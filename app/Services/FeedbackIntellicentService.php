<?php

namespace App\Services;

use App\Models\Trabajo;
use App\Models\Calificacion;
use App\Models\FeedbackAnalysis;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * Servicio para generar feedback inteligente usando Agente IA
 *
 * Análisis de respuestas del estudiante y generación de feedback estructurado
 * según rúbrica y criterios de evaluación
 */
class FeedbackIntellicentService
{
    protected $client;
    protected $agentUrl;
    protected $timeout;
    protected $retries;

    public function __construct()
    {
        $this->agentUrl = env('AGENT_SERVICE_URL', 'http://localhost:8002');
        $this->timeout = env('AGENT_HTTP_TIMEOUT', 30);
        $this->retries = env('AGENT_RETRIES', 2);

        $this->client = new Client([
            'timeout' => $this->timeout,
            'connect_timeout' => 5,
        ]);

        Log::info('FeedbackIntellicentService inicializado', [
            'url' => $this->agentUrl,
            'timeout' => $this->timeout,
        ]);
    }

    /**
     * Generar feedback inteligente para un trabajo calificado
     *
     * @param int $trabajoId ID del trabajo del estudiante
     * @param int $calificacionId ID de la calificación asignada
     * @return array Análisis de feedback generado
     * @throws Exception Si hay error en la generación
     */
    public function generarFeedback(int $trabajoId, int $calificacionId): array
    {
        $startTime = microtime(true);

        try {
            // Obtener datos
            $trabajo = Trabajo::with(['contenido', 'estudiante', 'calificacion'])->find($trabajoId);
            $calificacion = Calificacion::find($calificacionId);

            if (!$trabajo || !$calificacion) {
                throw new Exception("Trabajo o Calificación no encontrados");
            }

            Log::info('Iniciando generación de feedback inteligente', [
                'trabajo_id' => $trabajoId,
                'calificacion_id' => $calificacionId,
                'estudiante_id' => $trabajo->estudiante_id,
                'puntaje' => $calificacion->puntaje,
            ]);

            // Construir prompt para el agente
            $prompt = $this->construirPrompt($trabajo, $calificacion);

            // Llamar al agente
            $analisis = $this->llamarAgente($prompt, $trabajo->estudiante_id);

            $duracion = (microtime(true) - $startTime) * 1000;

            // Guardar análisis
            $feedback = FeedbackAnalysis::updateOrCreate(
                ['calificacion_id' => $calificacionId],
                [
                    'trabajo_id' => $trabajoId,
                    'feedback_analysis' => $analisis['feedback'] ?? '',
                    'conceptos_identificados' => $analisis['conceptos'] ?? [],
                    'errores_comunes' => $analisis['errores'] ?? [],
                    'areas_mejora' => $analisis['areas_mejora'] ?? [],
                    'feedback_por_criterio' => $analisis['feedback_criterios'] ?? [],
                    'estado' => 'generado',
                    'confidence_score' => $analisis['confidence'] ?? 0.5,
                    'tiempo_generacion' => $duracion,
                    'fecha_analisis' => now(),
                ]
            );

            Log::info('Feedback generado exitosamente', [
                'feedback_id' => $feedback->id,
                'trabajo_id' => $trabajoId,
                'confidence_score' => $feedback->confidence_score,
                'tiempo_ms' => round($duracion, 2),
                'conceptos_count' => count($feedback->conceptos_identificados ?? []),
                'errores_count' => count($feedback->errores_comunes ?? []),
            ]);

            return $feedback->toArray();

        } catch (Exception $e) {
            Log::error('Error en generación de feedback', [
                'trabajo_id' => $trabajoId,
                'calificacion_id' => $calificacionId,
                'error' => $e->getMessage(),
            ]);

            // Crear feedback de fallback
            return $this->generarFeedbackFallback($trabajoId, $calificacionId);
        }
    }

    /**
     * Construir prompt para el agente
     *
     * @param Trabajo $trabajo
     * @param Calificacion $calificacion
     * @return string Prompt estructurado
     */
    protected function construirPrompt(Trabajo $trabajo, Calificacion $calificacion): string
    {
        $respuestas = json_encode($trabajo->respuestas, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $criterios = json_encode($calificacion->criterios_evaluacion, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        $contenidoTitulo = $trabajo->contenido->titulo ?? 'Sin título';

        return <<<PROMPT
Analiza la siguiente respuesta de un estudiante y genera feedback constructivo y específico.

CONTEXTO:
- Actividad: $contenidoTitulo
- Puntaje Asignado: {$calificacion->puntaje}/100
- Descripción del Trabajo: {$trabajo->contenido->descripcion}

RESPUESTA DEL ESTUDIANTE:
$respuestas

CRITERIOS DE EVALUACIÓN:
$criterios

TAREAS A REALIZAR:

1. CONCEPTOS IDENTIFICADOS:
   - Identifica los conceptos clave que el estudiante demostró entender
   - Devuelve como lista

2. ERRORES Y CONCEPTOS ERRÓNEOS:
   - Identifica errores conceptuales, lógicos o de razonamiento
   - Sé específico y constructivo
   - Devuelve como lista

3. ÁREAS DE MEJORA:
   - Identifica áreas donde puede mejorar el estudiante
   - Conecta con los criterios de evaluación
   - Devuelve como lista

4. FEEDBACK POR CRITERIO:
   - Para cada criterio en la rúbrica, proporciona feedback específico
   - Estructura: {"criterio_nombre": "feedback detallado"}

5. FEEDBACK GENERAL:
   - Proporciona feedback global constructivo
   - Combina fortalezas y áreas de mejora
   - Sé específico y académicamente riguroso

FORMATO DE RESPUESTA (JSON):
{
  "feedback": "Texto general de feedback...",
  "conceptos": ["concepto1", "concepto2", ...],
  "errores": ["error1", "error2", ...],
  "areas_mejora": ["área1", "área2", ...],
  "feedback_criterios": {
    "criterio1": "feedback específico",
    "criterio2": "feedback específico"
  },
  "confidence": 0.85
}
PROMPT;
    }

    /**
     * Llamar al servicio de agente
     *
     * @param string $prompt
     * @param int $studentId
     * @return array Análisis generado
     * @throws Exception Si hay error
     */
    protected function llamarAgente(string $prompt, int $studentId): array
    {
        $attempt = 0;
        $lastError = null;

        while ($attempt < $this->retries) {
            try {
                $attempt++;
                Log::debug("Intento de llamada a Agent {$attempt}/{$this->retries}", [
                    'student_id' => $studentId,
                ]);

                $token = null;
                if (auth()->check() && auth()->user()) {
                    $currentToken = auth()->user()->currentAccessToken();
                    if ($currentToken) {
                        $token = $currentToken->plainTextToken;
                    }
                }

                $headers = [
                    'Content-Type' => 'application/json',
                ];

                if ($token) {
                    $headers['Authorization'] = 'Bearer ' . $token;
                }

                $response = $this->client->post(
                    "{$this->agentUrl}/analyze",
                    [
                        'json' => [
                            'prompt' => $prompt,
                            'student_id' => $studentId,
                            'model' => env('AGENT_MODEL', 'llama-3.3-70b'),
                        ],
                        'headers' => $headers,
                    ]
                );

                $result = json_decode($response->getBody(), true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception('JSON inválido: ' . json_last_error_msg());
                }

                Log::info('Respuesta del Agent recibida', [
                    'status_code' => $response->getStatusCode(),
                    'student_id' => $studentId,
                ]);

                return $result['analysis'] ?? $result;

            } catch (GuzzleException $e) {
                $lastError = $e;
                Log::warning("Error HTTP del Agent - Intento {$attempt}", [
                    'error' => $e->getMessage(),
                    'status_code' => $e->getResponse()?->getStatusCode(),
                ]);

                if ($attempt < $this->retries) {
                    sleep(1);
                }
            } catch (Exception $e) {
                $lastError = $e;
                Log::warning("Error en Agent - Intento {$attempt}", [
                    'error' => $e->getMessage(),
                ]);

                if ($attempt < $this->retries) {
                    sleep(1);
                }
            }
        }

        throw new Exception(
            "Agent no disponible después de {$this->retries} intentos: " .
            ($lastError ? $lastError->getMessage() : 'Error desconocido')
        );
    }

    /**
     * Generar feedback de fallback si el agente no está disponible
     *
     * @param int $trabajoId
     * @param int $calificacionId
     * @return array Feedback de fallback
     */
    protected function generarFeedbackFallback(int $trabajoId, int $calificacionId): array
    {
        Log::warning('Usando feedback fallback', [
            'trabajo_id' => $trabajoId,
            'calificacion_id' => $calificacionId,
        ]);

        $trabajo = Trabajo::find($trabajoId);
        $calificacion = Calificacion::find($calificacionId);

        if (!$trabajo || !$calificacion) {
            return [];
        }

        // Generar feedback genérico basado en el puntaje
        $feedback = $this->generarFeedbackGenerico($calificacion);

        $fallbackAnalysis = FeedbackAnalysis::updateOrCreate(
            ['calificacion_id' => $calificacionId],
            [
                'trabajo_id' => $trabajoId,
                'feedback_analysis' => $feedback,
                'conceptos_identificados' => [],
                'errores_comunes' => [],
                'areas_mejora' => [],
                'feedback_por_criterio' => [],
                'estado' => 'generado',
                'confidence_score' => 0.3,
                'tiempo_generacion' => 0,
                'fecha_analisis' => now(),
            ]
        );

        Log::info('Feedback fallback creado', [
            'feedback_id' => $fallbackAnalysis->id,
        ]);

        return $fallbackAnalysis->toArray();
    }

    /**
     * Generar feedback genérico basado en el puntaje
     *
     * @param Calificacion $calificacion
     * @return string
     */
    protected function generarFeedbackGenerico(Calificacion $calificacion): string
    {
        $puntaje = $calificacion->puntaje;

        if ($puntaje >= 90) {
            return "Excelente trabajo. Has demostrado un dominio sólido de los conceptos. "
                . "Continúa con este nivel de dedicación y profundización.";
        }

        if ($puntaje >= 80) {
            return "Muy buen trabajo. Has mostrado buena comprensión de los conceptos principales. "
                . "Considera revisar los detalles para alcanzar mayor precisión.";
        }

        if ($puntaje >= 70) {
            return "Buen trabajo. Has captado los conceptos fundamentales. "
                . "Te recomendamos revisar los criterios de evaluación para mejorar en los próximos trabajos.";
        }

        if ($puntaje >= 60) {
            return "Tu trabajo muestra esfuerzo. Sin embargo, identifica las áreas donde necesitas mejorar "
                . "y busca apoyo adicional si es necesario.";
        }

        return "Es necesario mejorar. Revisa los conceptos fundamentales "
            . "y considera buscar ayuda del profesor o recursos de apoyo.";
    }

    /**
     * Aprobar feedback generado
     *
     * @param int $feedbackId
     * @param string $feedbackFinal Feedback final después de revisión
     * @return void
     */
    public function aprobarFeedback(int $feedbackId, string $feedbackFinal = null): void
    {
        $feedback = FeedbackAnalysis::find($feedbackId);

        if (!$feedback) {
            throw new Exception("Feedback no encontrado");
        }

        $feedback->aprobar($feedbackFinal);

        Log::info('Feedback aprobado por profesor', [
            'feedback_id' => $feedbackId,
            'profesor_id' => auth()->id(),
        ]);
    }

    /**
     * Rechazar feedback y solicitar regeneración
     *
     * @param int $feedbackId
     * @return void
     */
    public function rechazarFeedback(int $feedbackId): void
    {
        $feedback = FeedbackAnalysis::find($feedbackId);

        if (!$feedback) {
            throw new Exception("Feedback no encontrado");
        }

        $feedback->rechazar();

        Log::info('Feedback rechazado por profesor', [
            'feedback_id' => $feedbackId,
            'profesor_id' => auth()->id(),
        ]);
    }
}
