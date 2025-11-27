<?php

namespace App\Jobs;

use App\Services\QuestionAnalyticsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class UpdateQuestionAnalyticsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     */
    public int $maxExceptions = 1;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $delay = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private int $evaluacionId
    ) {}

    /**
     * Execute the job.
     *
     * Actualiza las métricas analytics de todas las preguntas
     * utilizadas en una evaluación después de que los estudiantes
     * la hayan respondido.
     *
     * Calcula:
     * - Tasa de acierto
     * - Índice de discriminación
     * - Tiempo promedio de respuesta
     * - Distribución de respuestas
     * - Rendimiento por cluster
     */
    public function handle(QuestionAnalyticsService $service): void
    {
        Log::info("Iniciando cálculo de analytics para evaluación: {$this->evaluacionId}");

        try {
            // Actualizar analytics de todas las preguntas
            $service->updateAnalytics($this->evaluacionId);

            Log::info("Analytics actualizado exitosamente para evaluación: {$this->evaluacionId}");
        } catch (\Exception $e) {
            Log::error("Error actualizando analytics: {$e->getMessage()}", [
                'evaluacion_id' => $this->evaluacionId,
                'exception' => $e,
            ]);

            // Relanzar el error para que el job se reintente
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Job UpdateQuestionAnalyticsJob falló permanentemente", [
            'evaluacion_id' => $this->evaluacionId,
            'message' => $exception->getMessage(),
        ]);
    }
}
