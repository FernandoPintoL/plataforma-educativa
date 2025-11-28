<?php

namespace App\Services;

use App\Models\IntentosEvaluacion;
use App\Models\Pregunta;
use App\Models\RespuestaEvaluacion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * EvaluacionGradingService
 *
 * Orquestador principal para calificación automática de evaluaciones
 * Implementa la arquitectura de 4 capas:
 * 1. Validación automática (preguntas cerradas)
 * 2. Análisis inteligente (LLM para respuestas abiertas)
 * 3. Confianza y flags (anomalías, patrones)
 * 4. Revisión profesor (siempre obligatoria)
 */
class EvaluacionGradingService
{
    private EssayAnalysisService $essayAnalysisService;
    private AnomalyDetectionService $anomalyDetectionService;

    public function __construct(
        EssayAnalysisService $essayAnalysisService,
        AnomalyDetectionService $anomalyDetectionService
    ) {
        $this->essayAnalysisService = $essayAnalysisService;
        $this->anomalyDetectionService = $anomalyDetectionService;
    }

    /**
     * MÉTODO PRINCIPAL: Procesar intento completo de evaluación
     * Orquesta todo el flujo de calificación automática
     */
    public function procesarIntentoCompleto(IntentosEvaluacion $intento): void
    {
        try {
            Log::info("Iniciando procesamiento de intento #{$intento->id}");

            // Cargar relaciones necesarias
            $intento->load(['evaluacion.preguntas', 'respuestas_detalladas.pregunta']);

            $respuestas = $intento->respuestas_detalladas;
            $puntajeTotalIntento = 0;
            $respuestasCorrectas = 0;

            // CAPA 1 Y 2: Procesar cada respuesta
            foreach ($respuestas as $respuesta) {
                $pregunta = $respuesta->pregunta;

                // Determinar tipo de validación según tipo de pregunta
                $resultado = $this->procesarRespuesta($respuesta, $pregunta);

                // Actualizar respuesta individual
                $respuesta->update([
                    'es_correcta' => $resultado['es_correcta'],
                    'puntos_obtenidos' => $resultado['puntos_obtenidos'],
                    'puntos_totales' => $pregunta->puntos,
                    'confianza_respuesta' => $resultado['confianza'],
                    'patrones' => $resultado['patrones'] ?? [],
                    'recomendacion' => $resultado['recomendacion'] ?? null,
                    'respuesta_anomala' => $resultado['respuesta_anomala'] ?? false,
                ]);

                // Acumular puntaje
                if ($resultado['es_correcta']) {
                    $respuestasCorrectas++;
                }
                $puntajeTotalIntento += $resultado['puntos_obtenidos'];
            }

            // CAPA 3: Calcular métricas globales del intento
            $metricas = $this->calcularMetricasGlobales($intento, $respuestas);

            // CAPA 3: Detectar anomalías en el intento completo
            $anomalias = $this->detectarAnomaliasIntento($intento);

            // CAPA 3: Determinar prioridad
            $prioridad = $this->determinarPrioridad($intento, $metricas, $anomalias);

            // Actualizar intento con todas las métricas
            $puntajeTotal = $intento->evaluacion->preguntas->sum('puntos');
            $porcentaje = $puntajeTotal > 0 ? round(($puntajeTotalIntento / $puntajeTotal) * 100, 2) : 0;

            $intento->update([
                'estado' => 'entregado', // IMPORTANTE: No marcamos como 'calificado' aún
                'fecha_entrega' => now(),
                'tiempo_total' => $intento->fecha_inicio ? now()->diffInMinutes($intento->fecha_inicio) : 0,
                'puntaje_obtenido' => $puntajeTotalIntento,
                'porcentaje_acierto' => $porcentaje,
                'dificultad_detectada' => $metricas['dificultad_detectada'],
                'nivel_confianza_respuestas' => $metricas['nivel_confianza'],
                'tiene_anomalias' => $anomalias['tiene_anomalias'],
                'patrones_identificados' => $anomalias['patrones'] ?? [],
                'areas_debilidad' => $metricas['areas_debilidad'],
                'areas_fortaleza' => $metricas['areas_fortaleza'],
                'recomendaciones_ia' => $this->generarRecomendaciones($intento),
                'ultimo_analisis_ml' => now(),
            ]);

            Log::info("Intento #{$intento->id} procesado correctamente", [
                'puntaje' => $puntajeTotalIntento,
                'porcentaje' => $porcentaje,
                'confianza' => $metricas['nivel_confianza'],
                'anomalias' => $anomalias['tiene_anomalias'],
            ]);

        } catch (Exception $e) {
            Log::error("Error procesando intento: {$e->getMessage()}", [
                'intento_id' => $intento->id,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * CAPA 1 Y 2: Procesar una respuesta individual
     * Decide si usar validación simple o análisis LLM
     */
    private function procesarRespuesta(RespuestaEvaluacion $respuesta, Pregunta $pregunta): array
    {
        $tipo = $pregunta->tipo;

        // CAPA 1: Preguntas cerradas - Validación exacta
        if ($tipo === 'opcion_multiple' || $tipo === 'verdadero_falso') {
            return $this->calificarPreguntaCerrada($respuesta, $pregunta);
        }

        // CAPA 2: Preguntas abiertas - Análisis con LLM
        if ($tipo === 'respuesta_corta' || $tipo === 'respuesta_larga') {
            return $this->calificarPreguntaConLLM($respuesta, $pregunta);
        }

        // Fallback
        return [
            'es_correcta' => false,
            'puntos_obtenidos' => 0,
            'confianza' => 0,
            'respuesta_anomala' => false,
        ];
    }

    /**
     * CAPA 1: Calificar preguntas cerradas (opción múltiple, V/F)
     * Comparación exacta: 100% o 0%
     */
    private function calificarPreguntaCerrada(RespuestaEvaluacion $respuesta, Pregunta $pregunta): array
    {
        $respuestaTexto = trim($respuesta->respuesta_texto ?? '');
        $respuestaCorrecta = trim($pregunta->respuesta_correcta ?? '');

        // Normalizar para comparación
        $esCorrecta = $this->compararRespuestas($respuestaTexto, $respuestaCorrecta, $pregunta->tipo);

        return [
            'es_correcta' => $esCorrecta,
            'puntos_obtenidos' => $esCorrecta ? $pregunta->puntos : 0,
            'confianza' => 1.0, // Cercanía 100% para preguntas cerradas
            'respuesta_anomala' => false,
            'patrones' => [],
        ];
    }

    /**
     * CAPA 2: Calificar preguntas abiertas con LLM
     * Respuestas cortas y largas requieren análisis semántico
     */
    private function calificarPreguntaConLLM(RespuestaEvaluacion $respuesta, Pregunta $pregunta): array
    {
        try {
            // Usar servicio de análisis de ensayos
            $analisis = $this->essayAnalysisService->analizarRespuesta($respuesta, $pregunta);

            // El servicio retorna:
            // {
            //   'confianza': float (0-1),
            //   'es_correcta': bool,
            //   'puntos_sugeridos': float,
            //   'patrones': array,
            //   'recomendacion': string,
            //   'nivel_bloom': string
            // }

            return [
                'es_correcta' => $analisis['es_correcta'] ?? false,
                'puntos_obtenidos' => $analisis['puntos_sugeridos'] ?? 0,
                'confianza' => $analisis['confianza'] ?? 0.5,
                'respuesta_anomala' => ($analisis['confianza'] ?? 0) < 0.4,
                'patrones' => $analisis['patrones'] ?? [],
                'recomendacion' => $analisis['recomendacion'] ?? null,
            ];

        } catch (Exception $e) {
            Log::warning("Error analizando respuesta con LLM: {$e->getMessage()}");

            // Fallback: análisis local simple
            return [
                'es_correcta' => false,
                'puntos_obtenidos' => 0,
                'confianza' => 0.3, // Baja confianza sin agente
                'respuesta_anomala' => true,
                'patrones' => ['requiere_revision_manual'],
                'recomendacion' => 'Requiere revisión manual del profesor',
            ];
        }
    }

    /**
     * Comparar respuesta del estudiante con respuesta correcta
     */
    private function compararRespuestas(string $respuesta, string $correcta, string $tipo): bool
    {
        if ($tipo === 'verdadero_falso') {
            // Para V/F, normalizar a valores booleanos
            $respuestaNorm = strtolower($respuesta);
            $correctaNorm = strtolower($correcta);

            $respuestaNorm = in_array($respuestaNorm, ['verdadero', 'true', 'sí', '1', 'v']) ? 'verdadero' : 'falso';
            $correctaNorm = in_array($correctaNorm, ['verdadero', 'true', 'sí', '1', 'v']) ? 'verdadero' : 'falso';

            return $respuestaNorm === $correctaNorm;
        }

        // Para opción múltiple: comparación exacta case-insensitive
        return strtolower($respuesta) === strtolower($correcta);
    }

    /**
     * CAPA 3: Calcular métricas globales del intento
     */
    private function calcularMetricasGlobales(IntentosEvaluacion $intento, $respuestas): array
    {
        $confianzas = $respuestas->pluck('confianza_respuesta')->filter(fn($c) => $c !== null);
        $nivelConfianzaPromedio = $confianzas->count() > 0 ? $confianzas->avg() : 0.5;

        // Calcular dificultad detectada basada en porcentaje de acierto
        $respuestasCorrectas = $respuestas->where('es_correcta', true)->count();
        $totalRespuestas = $respuestas->count();
        $porcentajeAcierto = $totalRespuestas > 0 ? ($respuestasCorrectas / $totalRespuestas) * 100 : 0;

        $dificultadDetectada = match (true) {
            $porcentajeAcierto >= 80 => 'baja',
            $porcentajeAcierto >= 50 => 'media',
            default => 'alta'
        };

        // Identificar áreas de debilidad y fortaleza
        $areasDebilidad = $respuestas
            ->filter(fn($r) => !$r->es_correcta)
            ->pluck('pregunta.enunciado')
            ->values()
            ->toArray();

        $areasFortaleza = $respuestas
            ->filter(fn($r) => $r->es_correcta && $r->confianza_respuesta > 0.8)
            ->pluck('pregunta.enunciado')
            ->values()
            ->toArray();

        return [
            'nivel_confianza' => round($nivelConfianzaPromedio, 2),
            'dificultad_detectada' => $dificultadDetectada,
            'areas_debilidad' => array_slice($areasDebilidad, 0, 3), // Top 3
            'areas_fortaleza' => array_slice($areasFortaleza, 0, 3), // Top 3
        ];
    }

    /**
     * CAPA 3: Detectar anomalías en el intento
     */
    public function detectarAnomaliasIntento(IntentosEvaluacion $intento): array
    {
        $anomalias = [];

        // Usar servicio de detección de anomalías
        try {
            $resultado = $this->anomalyDetectionService->detectarPatronesAnómalos($intento);
            $anomalias = $resultado['anomalias'] ?? [];
        } catch (Exception $e) {
            Log::warning("Error detectando anomalías: {$e->getMessage()}");
        }

        // Contar respuestas anómalas
        $respuestasAnomalas = $intento->respuestas_detalladas->where('respuesta_anomala', true)->count();

        return [
            'tiene_anomalias' => $respuestasAnomalas > 0 || !empty($anomalias),
            'patrones' => [
                'respuestas_anomalas' => $respuestasAnomalas,
                'anomalias_detectadas' => $anomalias,
            ],
        ];
    }

    /**
     * CAPA 3: Determinar prioridad de revisión
     */
    public function determinarPrioridad(IntentosEvaluacion $intento, array $metricas, array $anomalias): string
    {
        // URGENTE: Anomalías detectadas o muy baja confianza
        if ($anomalias['tiene_anomalias'] || $metricas['nivel_confianza'] < 0.5) {
            return 'urgente';
        }

        // MEDIA: Confianza media
        if ($metricas['nivel_confianza'] < 0.75) {
            return 'media';
        }

        // BAJA: Alta confianza, sin anomalías
        return 'baja';
    }

    /**
     * Generar recomendaciones basadas en el análisis
     */
    private function generarRecomendaciones(IntentosEvaluacion $intento): array
    {
        $recomendaciones = [];
        $metricas = $intento->obtenerEstadisticas();

        // Recomendar refuerzo según áreas de debilidad
        if (!empty($intento->areas_debilidad)) {
            $recomendaciones[] = 'Reforzar los siguientes temas: ' . implode(', ', array_slice($intento->areas_debilidad, 0, 2));
        }

        // Recomendar práctica si hay muchos errores
        if (($metricas['respuestas_correctas'] ?? 0) < (($metricas['respuestas_totales'] ?? 1) / 2)) {
            $recomendaciones[] = 'Realizar ejercicios adicionales de práctica';
        }

        // Si tuvo anomalías, indicar revisión especial
        if ($intento->tiene_anomalias) {
            $recomendaciones[] = 'Esta evaluación presenta patrones inusuales - requiere revisión del profesor';
        }

        return $recomendaciones;
    }
}
