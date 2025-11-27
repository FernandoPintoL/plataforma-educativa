<?php

namespace App\Jobs;

use App\Models\QuestionBank;
use App\Services\QuestionAnalyticsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RecalibrateQuestionDifficultyJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 2;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $delay = 300; // 5 minutos

    /**
     * Create a new job instance.
     */
    public function __construct(
        private ?int $cursoId = null
    ) {}

    /**
     * Execute the job.
     *
     * Recalibra la dificultad real de todas las preguntas
     * que han sido utilizadas suficientemente (> 5 veces)
     * basándose en el desempeño real de los estudiantes.
     *
     * La dificultad real se calcula como:
     * dificultad_real = 1 - (tasa_acierto / 100)
     *
     * Por ejemplo:
     * - Si 80% de estudiantes la responden correctamente -> dificultad = 0.20
     * - Si 50% la responden correctamente -> dificultad = 0.50
     * - Si 10% la responden correctamente -> dificultad = 0.90
     */
    public function handle(QuestionAnalyticsService $service): void
    {
        Log::info("Iniciando recalibración de dificultad de preguntas", [
            'curso_id' => $this->cursoId,
        ]);

        try {
            // Obtener preguntas con suficiente uso (> 5 veces)
            $query = QuestionBank::where('veces_usada', '>', 5);

            if ($this->cursoId) {
                $query->where('curso_id', $this->cursoId);
            }

            $questions = $query->get();

            Log::info("Recalibrando dificultad para {$questions->count()} preguntas");

            $recalibratedCount = 0;
            $significantChanges = 0;

            foreach ($questions as $question) {
                try {
                    $dificultadActual = $question->dificultad_estimada;
                    $dificultadReal = $service->recalibrateDifficulty($question->id);

                    // Calcular cambio en dificultad
                    $cambio = abs($dificultadReal - $dificultadActual);

                    if ($cambio > 0.15) {
                        // Cambio significativo (> 0.15)
                        $significantChanges++;

                        Log::info("Cambio significativo en dificultad", [
                            'question_id' => $question->id,
                            'dificultad_estimada' => $dificultadActual,
                            'dificultad_real' => $dificultadReal,
                            'cambio' => $cambio,
                        ]);
                    }

                    $recalibratedCount++;
                } catch (\Exception $e) {
                    Log::warning("Error recalibrando pregunta {$question->id}: {$e->getMessage()}");
                    continue;
                }
            }

            Log::info("Recalibración completada", [
                'total_preguntas' => $questions->count(),
                'recalibradas' => $recalibratedCount,
                'cambios_significativos' => $significantChanges,
            ]);
        } catch (\Exception $e) {
            Log::error("Error en recalibración de dificultad: {$e->getMessage()}", [
                'exception' => $e,
            ]);

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Job RecalibrateQuestionDifficultyJob falló permanentemente", [
            'curso_id' => $this->cursoId,
            'message' => $exception->getMessage(),
        ]);
    }
}
