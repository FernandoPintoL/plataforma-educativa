<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\MLPipelineService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerarPrediccionesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying.
     */
    public $backoff = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $estudianteId,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(MLPipelineService $mlPipeline): void
    {
        try {
            Log::info("Iniciando generación de predicciones para estudiante {$this->estudianteId}");

            $estudiante = User::find($this->estudianteId);

            if (!$estudiante) {
                Log::error("Estudiante {$this->estudianteId} no encontrado");
                return;
            }

            // Ejecutar pipeline para este estudiante específico
            $resultado = $mlPipeline->ejecutarParaEstudiante($estudiante);

            Log::info("Predicciones generadas exitosamente para estudiante {$this->estudianteId}", [
                'resultado' => $resultado,
            ]);

            // Notificar al estudiante (opcional - si existe el modelo de notificación)
            // $estudiante->notify(new PrediccionesGeneradasNotification($resultado));

        } catch (\Exception $e) {
            Log::error("Error generando predicciones para estudiante {$this->estudianteId}: {$e->getMessage()}", [
                'exception' => $e,
            ]);

            // Relanzar la excepción para que el queue maneje los reintentos
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Job GenerarPrediccionesJob falló para estudiante {$this->estudianteId} después de {$this->tries} intentos", [
            'exception' => $exception->getMessage(),
        ]);
    }
}
