<?php

namespace App\Services;

use App\Models\Pregunta;
use App\Models\RespuestaEvaluacion;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Exception;

/**
 * EssayAnalysisService
 *
 * Servicio para análisis de respuestas abiertas (respuestas cortas y largas)
 * Utiliza el agente LLM (puerto 8003) para análisis semántico
 * Implementa fallback local si el agente no está disponible
 * Maneja rate limiting y caché de análisis
 */
class EssayAnalysisService
{
    private const AGENT_API_URL = 'http://localhost:8003';
    private const AGENT_TIMEOUT = 15;
    private const MAX_ANALYSES_PER_TASK = 5;
    private const COOLDOWN_SECONDS = 300; // 5 minutos
    private const CACHE_DURATION_HOURS = 1;

    /**
     * Analizar una respuesta de estudiante
     * Determina automáticamente si es síncrono o asíncrono
     */
    public function analizarRespuesta(RespuestaEvaluacion $respuesta, Pregunta $pregunta, bool $force_sync = false): array
    {
        try {
            $respuestaTexto = $respuesta->respuesta_texto ?? '';
            $numeroPalabras = str_word_count($respuestaTexto);

            Log::info("Analizando respuesta", [
                'respuesta_id' => $respuesta->id,
                'tipo' => $pregunta->tipo,
                'palabras' => $numeroPalabras,
            ]);

            // PROCESAMIENTO HÍBRIDO
            // Si es corto o se fuerza síncrono, analizar inmediatamente
            if ($numeroPalabras <= 500 || $force_sync) {
                return $this->analizarSincronico($respuesta, $pregunta);
            }

            // Si es largo, marcar para análisis asíncrono (Job)
            // Por ahora, retornar análisis local rápido
            return $this->analizarLocal($respuestaTexto, $pregunta->enunciado);

        } catch (Exception $e) {
            Log::error("Error analizando respuesta: {$e->getMessage()}");
            return $this->analizarLocal($respuesta->respuesta_texto ?? '', $pregunta->enunciado);
        }
    }

    /**
     * Análisis síncrono (para respuestas cortas)
     */
    private function analizarSincronico(RespuestaEvaluacion $respuesta, Pregunta $pregunta): array
    {
        // Verificar rate limiting
        if (!$this->verificarRateLimiting($respuesta->intento->evaluacion_id, $respuesta->intento->estudiante_id)) {
            Log::warning("Rate limit alcanzado para análisis LLM");
            return $this->analizarLocal($respuesta->respuesta_texto ?? '', $pregunta->enunciado);
        }

        // Intentar análisis con agente
        $analisis = $this->analizarConAgente($respuesta, $pregunta);

        if ($analisis['success']) {
            return $analisis['data'];
        }

        // Fallback si agente falla
        return $this->analizarLocal($respuesta->respuesta_texto ?? '', $pregunta->enunciado);
    }

    /**
     * Llamar al agente LLM en puerto 8003
     */
    private function analizarConAgente(RespuestaEvaluacion $respuesta, Pregunta $pregunta): array
    {
        try {
            $payload = $this->formatearRequestAgente($respuesta, $pregunta);

            Log::info("Llamando al agente LLM", [
                'endpoint' => '/api/analysis/student-solution',
                'task_id' => $respuesta->intento->evaluacion_id,
            ]);

            $response = Http::timeout(self::AGENT_TIMEOUT)
                ->post(self::AGENT_API_URL . '/api/analysis/student-solution', $payload);

            if (!$response->successful()) {
                Log::warning("Agente retornó status {$response->status()}", [
                    'respuesta_id' => $respuesta->id
                ]);
                return ['success' => false];
            }

            $resultado = $response->json();

            if (!isset($resultado['data'])) {
                Log::warning("Respuesta de agente sin 'data'");
                return ['success' => false];
            }

            // Registrar uso para rate limiting
            $this->registrarUsoAnalisis($respuesta->intento->evaluacion_id, $respuesta->intento->estudiante_id);

            return [
                'success' => true,
                'data' => $this->procesarRespuestaAgente($resultado['data'], $pregunta->puntos)
            ];

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::warning("No se pudo conectar al agente LLM: {$e->getMessage()}");
            return ['success' => false];
        } catch (Exception $e) {
            Log::error("Error llamando al agente: {$e->getMessage()}");
            return ['success' => false];
        }
    }

    /**
     * Formatear request para el agente LLM
     */
    private function formatearRequestAgente(RespuestaEvaluacion $respuesta, Pregunta $pregunta): array
    {
        $intento = $respuesta->intento;

        return [
            'task_id' => $intento->evaluacion_id,
            'student_id' => $intento->estudiante_id,
            'solution_code' => $respuesta->respuesta_texto ?? '',
            'task_type' => 'evaluacion',
            'language' => 'text',
            'question_context' => $pregunta->enunciado,
            'rubric' => $this->obtenerRubricaPregunta($pregunta),
        ];
    }

    /**
     * Obtener rúbrica de evaluación para la pregunta
     */
    private function obtenerRubricaPregunta(Pregunta $pregunta): string
    {
        // Por ahora, retornar rúbrica genérica
        // En el futuro, esto podría ser configurado por pregunta
        return 'Evalúa la respuesta según:
- Precisión conceptual
- Completitud de la respuesta
- Claridad de explicación
- Relevancia al tema';
    }

    /**
     * Procesar respuesta del agente LLM
     */
    private function procesarRespuestaAgente(array $data, int $puntosMaximos): array
    {
        $feedback = $data['feedback'] ?? [];

        // Extraer información del feedback
        $conceptosCorrectos = $feedback['conceptos_correctos'] ?? [];
        $erroresEncontrados = $feedback['errores_encontrados'] ?? [];
        $calidadCodigo = $feedback['calidad_codigo'] ?? 0.5;
        $nivelBloom = $feedback['nivel_bloom'] ?? 'apply';

        // Determinar si es correcta basado en calidad
        $esCorrecta = $calidadCodigo >= 0.7;

        // Calcular puntuación sugerida
        $puntosSugeridos = round($puntosMaximos * $calidadCodigo, 2);

        // Generar recomendación
        $recomendacion = $this->generarRecomendacion($conceptosCorrectos, $erroresEncontrados);

        return [
            'es_correcta' => $esCorrecta,
            'puntos_sugeridos' => max(0, min($puntosMaximos, $puntosSugeridos)),
            'confianza' => round($calidadCodigo, 2),
            'patrones' => [
                'conceptos_correctos' => $conceptosCorrectos,
                'errores_encontrados' => $erroresEncontrados,
                'nivel_bloom' => $nivelBloom,
                'calidad_respuesta' => round($calidadCodigo, 2),
                'similitud_semantica' => round($calidadCodigo, 2),
            ],
            'recomendacion' => $recomendacion,
        ];
    }

    /**
     * Generar recomendación basada en análisis
     */
    private function generarRecomendacion(array $conceptosCorrectos, array $erroresEncontrados): string
    {
        if (empty($erroresEncontrados)) {
            return 'Excelente respuesta con todos los conceptos clave identificados.';
        }

        $erroresTxt = implode(', ', array_slice($erroresEncontrados, 0, 2));
        return "Revisar los siguientes puntos: {$erroresTxt}.";
    }

    /**
     * Análisis local (fallback)
     * Análisis básico sin acceso al agente LLM
     */
    public function analizarLocal(string $respuesta, string $enunciado): array
    {
        // Calcular longitud y complejidad básica
        $longitud = strlen($respuesta);
        $palabras = str_word_count($respuesta);
        $oraciones = strlen($respuesta) - strlen(str_replace(['.', '?', '!'], '', $respuesta));

        // Detectar palabras clave del enunciado
        $palabrasClave = $this->extraerPalabrasClave($enunciado);
        $palabrasEncontradas = 0;

        foreach ($palabrasClave as $palabra) {
            if (stripos($respuesta, $palabra) !== false) {
                $palabrasEncontradas++;
            }
        }

        // Calcular confianza basada en heurísticas
        $confianza = 0.3; // Base baja sin agente

        // Aumentar confianza por longitud
        if ($palabras > 20) $confianza += 0.15;
        if ($palabras > 50) $confianza += 0.15;

        // Aumentar confianza por palabras clave encontradas
        if (!empty($palabrasClave)) {
            $porcentajePalabras = $palabrasEncontradas / count($palabrasClave);
            $confianza += $porcentajePalabras * 0.25;
        }

        // Limitar entre 0 y 1
        $confianza = min(1, max(0, $confianza));

        return [
            'es_correcta' => $confianza >= 0.6,
            'puntos_sugeridos' => 0, // Requiere revisión manual
            'confianza' => round($confianza, 2),
            'patrones' => [
                'longitud_respuesta' => $longitud,
                'numero_palabras' => $palabras,
                'numero_oraciones' => $oraciones,
                'palabras_clave_encontradas' => $palabrasEncontradas,
                'calidad_respuesta' => round($confianza, 2),
            ],
            'recomendacion' => 'Requiere revisión manual del profesor (agente LLM no disponible)',
        ];
    }

    /**
     * Extraer palabras clave del enunciado
     */
    private function extraerPalabrasClave(string $enunciado): array
    {
        // Palabras a ignorar
        $stopwords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'por', 'para', 'con', 'una', 'del', 'al'];

        // Dividir en palabras
        $palabras = explode(' ', strtolower($enunciado));

        // Filtrar
        $palabrasClave = array_filter($palabras, function ($palabra) use ($stopwords) {
            $palabra = preg_replace('/[^a-záéíóúñ]/', '', $palabra);
            return strlen($palabra) > 3 && !in_array($palabra, $stopwords);
        });

        return array_values($palabrasClave);
    }

    /**
     * Verificar rate limiting
     */
    private function verificarRateLimiting(int $evaluacionId, int $estudianteId): bool
    {
        $cacheKey = "evaluacion_analysis_{$evaluacionId}_{$estudianteId}";

        // Obtener contador de análisis
        $contador = Cache::get($cacheKey, 0);

        if ($contador >= self::MAX_ANALYSES_PER_TASK) {
            Log::warning("Rate limit alcanzado", [
                'evaluacion_id' => $evaluacionId,
                'estudiante_id' => $estudianteId,
                'contador' => $contador,
            ]);
            return false;
        }

        return true;
    }

    /**
     * Registrar uso de análisis para rate limiting
     */
    private function registrarUsoAnalisis(int $evaluacionId, int $estudianteId): void
    {
        $cacheKey = "evaluacion_analysis_{$evaluacionId}_{$estudianteId}";
        $contador = Cache::get($cacheKey, 0);
        Cache::put($cacheKey, $contador + 1, now()->addSeconds(self::COOLDOWN_SECONDS));
    }

    /**
     * Verificar salud del agente LLM
     */
    public function checkAgentHealth(): bool
    {
        try {
            $response = Http::timeout(5)
                ->get(self::AGENT_API_URL . '/health');

            return $response->successful();
        } catch (Exception $e) {
            Log::warning("Agente LLM no disponible: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Obtener información del agente
     */
    public function getAgentInfo(): array
    {
        try {
            $response = Http::timeout(5)
                ->get(self::AGENT_API_URL . '/');

            if ($response->successful()) {
                return $response->json();
            }

            return ['status' => 'unavailable'];
        } catch (Exception $e) {
            Log::warning("No se pudo obtener info del agente: {$e->getMessage()}");
            return ['status' => 'unavailable'];
        }
    }
}
