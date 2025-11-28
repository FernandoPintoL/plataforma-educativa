<?php

namespace App\Jobs;

use App\Models\RespuestaEvaluacion;
use App\Services\EssayAnalysisService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * AnalizarRespuestaLargaJob
 *
 * Job asíncrono para analizar respuestas largas (>500 palabras)
 * Se ejecuta en background después de que el estudiante completa la evaluación
 * Actualiza el análisis LLM de la respuesta individual y recalcula métricas del intento
 */
class AnalizarRespuestaLargaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Configuración del job
     */
    public int $tries = 2; // Reintentos
    public int $timeout = 60; // Timeout en segundos
    public int $backoff = 30; // Esperar 30 segundos antes de reintentar

    private int $respuestaId;

    public function __construct(int $respuestaId)
    {
        $this->respuestaId = $respuestaId;
    }

    /**
     * Ejecutar el job
     */
    public function handle(EssayAnalysisService $essayAnalysisService): void
    {
        try {
            Log::info("Iniciando análisis de respuesta larga #{$this->respuestaId}");

            // Obtener respuesta y pregunta
            $respuesta = RespuestaEvaluacion::findOrFail($this->respuestaId);
            $pregunta = $respuesta->pregunta;

            // Validar que la respuesta sea lo suficientemente larga
            $numeroPalabras = str_word_count($respuesta->respuesta_texto ?? '');
            if ($numeroPalabras <= 500) {
                Log::warning("Respuesta #{$this->respuestaId} tiene solo {$numeroPalabras} palabras, no requería job");
                return;
            }

            // Analizar con el servicio (fuerza análisis síncrono en el job)
            $analisis = $essayAnalysisService->analizarRespuesta($respuesta, $pregunta, true);

            Log::info("Análisis completado para respuesta larga #{$this->respuestaId}", [
                'confianza' => $analisis['confianza'] ?? 0,
                'es_correcta' => $analisis['es_correcta'] ?? false,
            ]);

            // Actualizar respuesta con resultados del análisis
            $respuesta->update([
                'patrones' => $analisis['patrones'] ?? [],
                'recomendacion' => $analisis['recomendacion'] ?? null,
                'confianza_respuesta' => $analisis['confianza'] ?? 0.5,
                'es_correcta' => $analisis['es_correcta'] ?? false,
                'puntos_obtenidos' => $analisis['puntos_sugeridos'] ?? 0,
            ]);

            // Recalcular métricas globales del intento
            $intento = $respuesta->intento;
            $this->recalcularMetricasIntento($intento);

            Log::info("Respuesta larga #{$this->respuestaId} procesada correctamente");

        } catch (\Exception $e) {
            Log::error("Error analizando respuesta larga: {$e->getMessage()}", [
                'respuesta_id' => $this->respuestaId,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e; // Relanzar para reintentos
        }
    }

    /**
     * Recalcular métricas del intento después de análisis
     */
    private function recalcularMetricasIntento(RespuestaEvaluacion $respuesta): void
    {
        try {
            $intento = $respuesta->intento;

            // Recargar relaciones
            $intento->load(['respuestas_detalladas.pregunta', 'evaluacion.preguntas']);

            // Recalcular confianza global
            $confianzas = $intento->respuestas_detalladas()
                ->pluck('confianza_respuesta')
                ->filter(fn($c) => $c !== null);

            $nivelConfianzaPromedio = $confianzas->count() > 0 ? $confianzas->avg() : 0.5;

            // Recalcular puntaje total
            $puntajeTotalIntento = $intento->respuestas_detalladas()
                ->sum('puntos_obtenidos');

            $puntajeTotal = $intento->evaluacion->preguntas->sum('puntos');
            $porcentaje = $puntajeTotal > 0
                ? round(($puntajeTotalIntento / $puntajeTotal) * 100, 2)
                : 0;

            // Actualizar intento
            $intento->update([
                'puntaje_obtenido' => $puntajeTotalIntento,
                'porcentaje_acierto' => $porcentaje,
                'nivel_confianza_respuestas' => round($nivelConfianzaPromedio, 2),
                'ultimo_analisis_ml' => now(),
            ]);

            Log::info("Métricas recalculadas para intento #{$intento->id}", [
                'puntaje' => $puntajeTotalIntento,
                'porcentaje' => $porcentaje,
                'confianza' => $nivelConfianzaPromedio,
            ]);

        } catch (\Exception $e) {
            Log::warning("Error recalculando métricas: {$e->getMessage()}");
            // No relanzar excepción, el análisis ya se completó
        }
    }

    /**
     * Callback cuando el job falla permanentemente
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Job AnalizarRespuestaLargaJob falló permanentemente", [
            'respuesta_id' => $this->respuestaId,
            'error' => $exception->getMessage(),
            'archivo' => $exception->getFile(),
            'línea' => $exception->getLine(),
        ]);

        // Opcionalmente, notificar al profesor o al sistema de monitoreo
        // Enviar notificación, registrar incidente, etc.
    }
}
