<?php

namespace App\Services;

use App\Models\MLPredictionFeedback;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * ML Metrics Service
 *
 * Calcula métricas de rendimiento y precisión de los modelos ML
 * Genera reportes y alertas cuando hay degradación de performance.
 */
class MLMetricsService
{
    /**
     * Obtener resumen de rendimiento general
     */
    public function getPerformanceSummary(int $days = 30): array
    {
        try {
            $feedbacks = MLPredictionFeedback::withFeedback()
                ->where('feedback_timestamp', '>=', now()->subDays($days))
                ->get();

            if ($feedbacks->isEmpty()) {
                return $this->noDataResponse("No feedback data for last {$days} days");
            }

            $total = $feedbacks->count();
            $correct = $feedbacks->where('prediction_correct', true)->count();
            $accuracy = round(($correct / $total) * 100, 2);

            $avgError = round($feedbacks->avg('error_percentage'), 2);
            $avgConfidence = round($feedbacks->avg('confidence'), 3);

            // Contar por accuracy level
            $accuracyLevels = $feedbacks->groupBy('accuracy_level')->map->count();

            // Contar por tipo de predicción
            $byType = $feedbacks->groupBy('prediction_type')
                ->map(function ($group) {
                    $groupTotal = $group->count();
                    $groupCorrect = $group->where('prediction_correct', true)->count();
                    return [
                        'total' => $groupTotal,
                        'correct' => $groupCorrect,
                        'accuracy' => round(($groupCorrect / $groupTotal) * 100, 2),
                        'avg_error' => round($group->avg('error_percentage'), 2),
                    ];
                });

            return [
                'success' => true,
                'period_days' => $days,
                'total_predictions' => $total,
                'correct_predictions' => $correct,
                'overall_accuracy' => $accuracy,
                'average_error_percentage' => $avgError,
                'average_confidence' => $avgConfidence,
                'accuracy_distribution' => $accuracyLevels->toArray(),
                'metrics_by_type' => $byType->toArray(),
                'timestamp' => now(),
            ];

        } catch (Exception $e) {
            Log::error('Error in getPerformanceSummary', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Obtener métricas detalladas por modelo
     */
    public function getModelMetrics(): array
    {
        try {
            $analysis = MLPredictionFeedback::getModelAnalysis();

            if (empty($analysis)) {
                return $this->noDataResponse("No model versions with feedback");
            }

            return [
                'success' => true,
                'models' => $analysis,
                'timestamp' => now(),
            ];

        } catch (Exception $e) {
            Log::error('Error in getModelMetrics', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Obtener métricas por tipo de predicción
     */
    public function getTypeMetrics(): array
    {
        try {
            $metrics = MLPredictionFeedback::getMetricsByType();

            if (empty($metrics)) {
                return $this->noDataResponse("No prediction type metrics available");
            }

            return [
                'success' => true,
                'by_type' => $metrics,
                'timestamp' => now(),
            ];

        } catch (Exception $e) {
            Log::error('Error in getTypeMetrics', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Detectar degradación de rendimiento
     */
    public function detectPerformanceDegradation(int $recentDays = 7, int $baselineDays = 30): array
    {
        try {
            // Métricas recientes
            $recent = MLPredictionFeedback::withFeedback()
                ->where('feedback_timestamp', '>=', now()->subDays($recentDays))
                ->get();

            // Métricas baseline
            $baseline = MLPredictionFeedback::withFeedback()
                ->where('feedback_timestamp', '>=', now()->subDays($baselineDays))
                ->where('feedback_timestamp', '<', now()->subDays($recentDays))
                ->get();

            if ($recent->isEmpty() || $baseline->isEmpty()) {
                return ['success' => true, 'degradation_detected' => false, 'reason' => 'Insufficient data'];
            }

            $recentAccuracy = $recent->where('prediction_correct', true)->count() / $recent->count();
            $baselineAccuracy = $baseline->where('prediction_correct', true)->count() / $baseline->count();

            $accuracyDrop = ($baselineAccuracy - $recentAccuracy) * 100;

            $recentConfidence = $recent->avg('confidence');
            $baselineConfidence = $baseline->avg('confidence');
            $confidenceDrop = $baselineConfidence - $recentConfidence;

            $degradationDetected = $accuracyDrop > 5 || $confidenceDrop > 0.1;

            $alerts = [];

            if ($accuracyDrop > 5) {
                $recentAccuracyPercent = round($recentAccuracy * 100, 2);
                $baselineAccuracyPercent = round($baselineAccuracy * 100, 2);
                $alerts[] = [
                    'type' => 'accuracy_drop',
                    'severity' => $accuracyDrop > 15 ? 'critical' : 'warning',
                    'message' => "Accuracy dropped {$accuracyDrop}% ({$recentAccuracyPercent}% -> {$baselineAccuracyPercent}%)",
                ];
            }

            if ($confidenceDrop > 0.1) {
                $alerts[] = [
                    'type' => 'confidence_drop',
                    'severity' => $confidenceDrop > 0.2 ? 'critical' : 'warning',
                    'message' => "Confidence dropped {$confidenceDrop} ({$baselineConfidence} -> {$recentConfidence})",
                ];
            }

            // Detectar problemas por tipo
            $typeIssues = [];
            $recentByType = $recent->groupBy('prediction_type');

            foreach ($recentByType as $type => $typeRecent) {
                $typeBaseline = $baseline->where('prediction_type', $type);
                if ($typeBaseline->isEmpty()) continue;

                $typeRecentAcc = $typeRecent->where('prediction_correct', true)->count() / $typeRecent->count();
                $typeBaselineAcc = $typeBaseline->where('prediction_correct', true)->count() / $typeBaseline->count();

                if (($typeBaselineAcc - $typeRecentAcc) * 100 > 10) {
                    $typeIssues[] = [
                        'type' => $type,
                        'accuracy_drop' => round(($typeBaselineAcc - $typeRecentAcc) * 100, 2),
                    ];
                }
            }

            return [
                'success' => true,
                'degradation_detected' => $degradationDetected,
                'recent_period_days' => $recentDays,
                'baseline_period_days' => $baselineDays,
                'recent_accuracy' => round($recentAccuracy * 100, 2),
                'baseline_accuracy' => round($baselineAccuracy * 100, 2),
                'accuracy_drop_percentage' => round($accuracyDrop, 2),
                'recent_confidence' => round($recentConfidence, 3),
                'baseline_confidence' => round($baselineConfidence, 3),
                'confidence_drop' => round($confidenceDrop, 3),
                'alerts' => $alerts,
                'type_issues' => $typeIssues,
                'timestamp' => now(),
            ];

        } catch (Exception $e) {
            Log::error('Error in detectPerformanceDegradation', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Obtener predicciones que requieren revisión
     */
    public function getReviewQueue(int $limit = 50): array
    {
        try {
            $predictions = MLPredictionFeedback::needsReview()
                ->with('student')
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->map(fn($p) => [
                    'id' => $p->id,
                    'student_id' => $p->estudiante_id,
                    'student_name' => $p->student?->nombre_completo ?? 'Unknown',
                    'type' => $p->prediction_type,
                    'confidence' => $p->confidence,
                    'error_percentage' => $p->error_percentage,
                    'review_reason' => $p->review_reason,
                    'created_at' => $p->created_at,
                ]);

            return [
                'success' => true,
                'total_in_review' => MLPredictionFeedback::needsReview()->count(),
                'items' => $predictions->toArray(),
                'timestamp' => now(),
            ];

        } catch (Exception $e) {
            Log::error('Error in getReviewQueue', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Obtener pendientes de feedback
     */
    public function getPendingFeedback(int $olderThanDays = 7, int $limit = 50): array
    {
        try {
            $pending = MLPredictionFeedback::pendingFeedback()
                ->where('prediction_timestamp', '<=', now()->subDays($olderThanDays))
                ->with('student')
                ->orderBy('prediction_timestamp')
                ->limit($limit)
                ->get()
                ->map(fn($p) => [
                    'id' => $p->id,
                    'student_id' => $p->estudiante_id,
                    'student_name' => $p->student?->nombre_completo ?? 'Unknown',
                    'type' => $p->prediction_type,
                    'predicted_value' => $p->predicted_value,
                    'confidence' => $p->confidence,
                    'days_pending' => $p->prediction_timestamp->diffInDays(now()),
                ]);

            $totalPending = MLPredictionFeedback::pendingFeedback()
                ->where('prediction_timestamp', '<=', now()->subDays($olderThanDays))
                ->count();

            return [
                'success' => true,
                'total_pending' => $totalPending,
                'older_than_days' => $olderThanDays,
                'items' => $pending->toArray(),
                'timestamp' => now(),
            ];

        } catch (Exception $e) {
            Log::error('Error in getPendingFeedback', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Respuesta cuando no hay datos
     */
    private function noDataResponse(string $reason): array
    {
        return [
            'success' => true,
            'has_data' => false,
            'reason' => $reason,
            'timestamp' => now(),
        ];
    }

    /**
     * Log de métrica para alertas
     */
    public function logMetricAlert(string $type, array $metric, string $severity = 'warning'): void
    {
        Log::info("ML Metric Alert - {$type}", [
            'severity' => $severity,
            'metric' => $metric,
            'timestamp' => now(),
        ]);
    }
}
