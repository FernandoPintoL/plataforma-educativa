<?php

namespace App\Console\Commands;

use App\Models\MLPredictionFeedback;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * RecordMLPredictionFeedback Command
 *
 * Automatically records actual outcomes for ML predictions by matching
 * with actual student grades. Completes the feedback loop for model improvement.
 *
 * Usage:
 *   php artisan ml:record-feedback          # Process all pending predictions older than 7 days
 *   php artisan ml:record-feedback --days=14 # Process predictions older than 14 days
 *   php artisan ml:record-feedback --limit=50 # Process max 50 predictions
 */
class RecordMLPredictionFeedback extends Command
{
    protected $signature = 'ml:record-feedback
                          {--days=7 : Days old a prediction must be to process it}
                          {--limit=100 : Maximum predictions to process}
                          {--student-id= : Process feedback only for specific student}';

    protected $description = 'Record actual outcomes for pending ML predictions to complete feedback loop';

    protected int $processed = 0;
    protected int $skipped = 0;
    protected int $errors = 0;

    public function handle()
    {
        $this->info('Starting ML Prediction Feedback Recording...');
        $this->newLine();

        $daysOld = (int) $this->option('days');
        $limit = (int) $this->option('limit');
        $studentId = $this->option('student-id');

        try {
            // Get pending predictions
            $query = MLPredictionFeedback::pendingFeedback()
                ->where('prediction_timestamp', '<=', now()->subDays($daysOld));

            if ($studentId) {
                $query->where('estudiante_id', $studentId);
            }

            $predictions = $query
                ->with('student')
                ->orderBy('prediction_timestamp', 'asc')
                ->limit($limit)
                ->get();

            if ($predictions->isEmpty()) {
                $this->warn("No pending predictions found older than {$daysOld} days");
                return 0;
            }

            $this->info("Found {$predictions->count()} pending predictions to process");
            $this->newLine();

            // Process each prediction
            $progressBar = $this->output->createProgressBar($predictions->count());

            foreach ($predictions as $prediction) {
                try {
                    $this->processPrediction($prediction);
                    $this->processed++;
                } catch (\Exception $e) {
                    $this->errors++;
                    Log::error("Error processing prediction {$prediction->id}: {$e->getMessage()}");
                }

                $progressBar->advance();
            }

            $progressBar->finish();
            $this->newLine(2);

            // Summary
            $this->printSummary();

            return 0;

        } catch (\Exception $e) {
            $this->error("Error: {$e->getMessage()}");
            Log::error("RecordMLPredictionFeedback error: {$e->getMessage()}");
            return 1;
        }
    }

    private function processPrediction(MLPredictionFeedback $prediction): void
    {
        $student = $prediction->student;

        if (!$student) {
            $this->skipped++;
            return;
        }

        // Get actual outcome based on prediction type
        $outcome = $this->getActualOutcome($student, $prediction);

        if ($outcome === null) {
            $this->skipped++;
            return;
        }

        // Record feedback with actual outcome
        MLPredictionFeedback::recordFeedback(
            studentId: $student->id,
            type: $prediction->prediction_type,
            actualValue: $outcome['actual_value'],
            actualScore: $outcome['actual_score'],
            notes: "Auto-recorded via feedback loop on " . now()->format('Y-m-d H:i:s')
        );
    }

    /**
     * Get actual outcome based on prediction type
     */
    private function getActualOutcome(User $student, MLPredictionFeedback $prediction): ?array
    {
        return match ($prediction->prediction_type) {
            'risk' => $this->getRiskOutcome($student, $prediction),
            'carrera' => $this->getCareerOutcome($student, $prediction),
            'tendencia' => $this->getTrendOutcome($student, $prediction),
            'cluster' => $this->getClusterOutcome($student, $prediction),
            default => null,
        };
    }

    /**
     * Determine actual risk by looking at performance after prediction
     */
    private function getRiskOutcome(User $student, MLPredictionFeedback $prediction): ?array
    {
        try {
            // Get grades after prediction was made
            $recentGrades = $student->calificaciones()
                ->where('fecha_calificacion', '>', $prediction->prediction_timestamp)
                ->where('fecha_calificacion', '<=', now()->subDays(1))
                ->pluck('puntaje')
                ->toArray();

            if (empty($recentGrades)) {
                return null; // No grades yet to confirm
            }

            $avgGrade = array_sum($recentGrades) / count($recentGrades);

            // Determine if prediction was correct
            $predictedLevel = $prediction->predicted_value['nivel_riesgo'] ?? 'medio';
            $actualLevel = $this->determineRiskLevel($avgGrade);

            return [
                'actual_value' => ['nivel_riesgo' => $actualLevel, 'promedio_final' => $avgGrade],
                'actual_score' => $this->riskLevelToScore($actualLevel),
            ];

        } catch (\Exception $e) {
            Log::error("Error getting risk outcome for student {$student->id}: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Determine actual career by looking at official enrollment
     */
    private function getCareerOutcome(User $student, MLPredictionFeedback $prediction): ?array
    {
        try {
            // Check if student has officially enrolled in a career
            $currentCareer = $student->carrera_id;

            if (!$currentCareer) {
                return null; // No career enrollment yet
            }

            // Get the career model if relationship exists
            $careerName = $student->carrera?->nombre ?? 'Unknown';

            $predictedCareer = $prediction->predicted_value['carrera_predicha'] ?? null;

            return [
                'actual_value' => ['carrera_id' => $currentCareer, 'carrera_nombre' => $careerName],
                'actual_score' => $predictedCareer === $careerName ? 1.0 : 0.0,
            ];

        } catch (\Exception $e) {
            Log::error("Error getting career outcome for student {$student->id}: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Determine actual trend by comparing grade trajectory
     */
    private function getTrendOutcome(User $student, MLPredictionFeedback $prediction): ?array
    {
        try {
            // Get grades before and after prediction
            $beforePrediction = $student->calificaciones()
                ->where('fecha_calificacion', '<', $prediction->prediction_timestamp)
                ->orderBy('fecha_calificacion', 'desc')
                ->limit(5)
                ->pluck('puntaje')
                ->toArray();

            $afterPrediction = $student->calificaciones()
                ->where('fecha_calificacion', '>', $prediction->prediction_timestamp)
                ->where('fecha_calificacion', '<=', now()->subDays(1))
                ->orderBy('fecha_calificacion', 'asc')
                ->limit(5)
                ->pluck('puntaje')
                ->toArray();

            if (count($beforePrediction) < 2 || count($afterPrediction) < 2) {
                return null; // Not enough data
            }

            $beforeAvg = array_sum($beforePrediction) / count($beforePrediction);
            $afterAvg = array_sum($afterPrediction) / count($afterPrediction);

            $actualTrend = $this->determineTrend($beforeAvg, $afterAvg);
            $predictedTrend = $prediction->predicted_value['tendencia'] ?? 'estable';

            return [
                'actual_value' => ['tendencia' => $actualTrend, 'cambio_promedio' => $afterAvg - $beforeAvg],
                'actual_score' => $actualTrend === $predictedTrend ? 1.0 : 0.0,
            ];

        } catch (\Exception $e) {
            Log::error("Error getting trend outcome for student {$student->id}: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Determine actual cluster outcome
     */
    private function getClusterOutcome(User $student, MLPredictionFeedback $prediction): ?array
    {
        try {
            $recentGrades = $student->calificaciones()
                ->where('fecha_calificacion', '>', $prediction->prediction_timestamp)
                ->where('fecha_calificacion', '<=', now()->subDays(1))
                ->pluck('puntaje')
                ->toArray();

            if (empty($recentGrades)) {
                return null;
            }

            $avgGrade = array_sum($recentGrades) / count($recentGrades);
            $actualCluster = $this->determineCluster($avgGrade);
            $predictedCluster = $prediction->predicted_value['cluster'] ?? 1;

            return [
                'actual_value' => ['cluster' => $actualCluster, 'promedio' => $avgGrade],
                'actual_score' => $actualCluster == $predictedCluster ? 1.0 : 0.8,
            ];

        } catch (\Exception $e) {
            Log::error("Error getting cluster outcome for student {$student->id}: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Determine risk level from average grade
     */
    private function determineRiskLevel(float $avgGrade): string
    {
        return match (true) {
            $avgGrade >= 80 => 'bajo',
            $avgGrade >= 60 => 'medio',
            default => 'alto',
        };
    }

    /**
     * Convert risk level to numeric score
     */
    private function riskLevelToScore(string $level): float
    {
        return match ($level) {
            'bajo' => 0.2,
            'medio' => 0.5,
            'alto' => 0.8,
            default => 0.5,
        };
    }

    /**
     * Determine trend from before/after averages
     */
    private function determineTrend(float $before, float $after): string
    {
        $change = $after - $before;

        return match (true) {
            $change > 10 => 'mejorando',
            $change < -10 => 'declinando',
            abs($change) > 5 => 'fluctuando',
            default => 'estable',
        };
    }

    /**
     * Determine cluster based on performance
     */
    private function determineCluster(float $avgGrade): int
    {
        return match (true) {
            $avgGrade >= 80 => 0, // High performance
            $avgGrade >= 60 => 1, // Medium performance
            default => 2,         // Low performance
        };
    }

    /**
     * Print summary statistics
     */
    private function printSummary(): void
    {
        $this->info('╔════════════════════════════════════════╗');
        $this->info('║   ML Prediction Feedback Summary      ║');
        $this->info('╠════════════════════════════════════════╣');
        $this->line("║ ✓ Processed:      {$this->processed}");
        $this->line("║ ⊘ Skipped:        {$this->skipped}");
        $this->line("║ ✗ Errors:         {$this->errors}");
        $this->info('╚════════════════════════════════════════╝');

        Log::info('ML Feedback recording completed', [
            'processed' => $this->processed,
            'skipped' => $this->skipped,
            'errors' => $this->errors,
        ]);
    }
}
