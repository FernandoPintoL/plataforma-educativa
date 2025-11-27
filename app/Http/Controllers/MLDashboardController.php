<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\MLIntegrationService;
use App\Services\MLMetricsService;
use App\Services\AnomalyDetectionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

/**
 * ML Dashboard Controller
 *
 * Exposes ML integration endpoints for:
 * - Getting integrated predictions for a student
 * - Recording actual outcomes for feedback loop
 * - Retrieving ML system metrics and alerts
 */
class MLDashboardController extends Controller
{
    protected MLIntegrationService $mlService;

    public function __construct(MLIntegrationService $mlService)
    {
        $this->mlService = $mlService;
    }

    /**
     * Get integrated ML predictions for a specific student
     *
     * GET /api/ml/predict/{studentId}
     */
    public function predictStudent($studentId): JsonResponse
    {
        try {
            $student = User::findOrFail($studentId);

            Log::info("ML prediction requested for student {$studentId}");

            $result = $this->mlService->predictStudent($student);

            return response()->json($result, $result['success'] ? 200 : 422);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => "Student with ID {$studentId} not found",
            ], 404);

        } catch (\Exception $e) {
            Log::error("Error in ML prediction: {$e->getMessage()}");

            return response()->json([
                'success' => false,
                'message' => 'Error generating ML predictions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Record actual outcome for a prediction (feedback loop)
     *
     * POST /api/ml/feedback
     * Body: {
     *   "student_id": 123,
     *   "type": "risk|carrera|tendencia|cluster",
     *   "actual_value": "actual_outcome"
     * }
     */
    public function recordFeedback(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'student_id' => 'required|integer|exists:users,id',
                'type' => 'required|in:risk,carrera,tendencia,progreso,cluster,anomaly',
                'actual_value' => 'required',
            ]);

            Log::info("Feedback recorded for student {$validated['student_id']}", [
                'type' => $validated['type'],
            ]);

            $result = $this->mlService->recordActualOutcome(
                studentId: $validated['student_id'],
                type: $validated['type'],
                actualValue: $validated['actual_value']
            );

            return response()->json($result, $result['success'] ? 200 : 422);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error("Error recording feedback: {$e->getMessage()}");

            return response()->json([
                'success' => false,
                'message' => 'Error recording feedback',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get ML system dashboard with metrics and alerts
     *
     * GET /api/ml/dashboard
     */
    public function getDashboard(): JsonResponse
    {
        try {
            Log::info("ML dashboard requested");

            $result = $this->mlService->getMLDashboard();

            return response()->json($result, $result['success'] ? 200 : 500);

        } catch (\Exception $e) {
            Log::error("Error getting ML dashboard: {$e->getMessage()}");

            return response()->json([
                'success' => false,
                'message' => 'Error retrieving ML dashboard',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get detailed metrics for ML system
     *
     * GET /api/ml/metrics
     * Query params:
     *   - days: period for metrics (default 30)
     *   - type: filter by prediction type (optional)
     */
    public function getMetrics(Request $request): JsonResponse
    {
        try {
            $days = (int) $request->query('days', 30);
            $type = $request->query('type');

            Log::info("ML metrics requested", [
                'days' => $days,
                'type' => $type,
            ]);

            // Get metrics service via integration service
            $metricsService = app('App\Services\MLMetricsService');
            $result = $metricsService->getPerformanceSummary($days);

            return response()->json($result, 200);

        } catch (\Exception $e) {
            Log::error("Error getting ML metrics: {$e->getMessage()}");

            return response()->json([
                'success' => false,
                'message' => 'Error retrieving ML metrics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get predictions requiring manual review
     *
     * GET /api/ml/review-queue
     * Query params:
     *   - limit: max predictions to return (default 50)
     */
    public function getReviewQueue(Request $request): JsonResponse
    {
        try {
            $limit = (int) $request->query('limit', 50);

            Log::info("Review queue requested", ['limit' => $limit]);

            $metricsService = app('App\Services\MLMetricsService');
            $result = $metricsService->getReviewQueue($limit);

            return response()->json($result, 200);

        } catch (\Exception $e) {
            Log::error("Error getting review queue: {$e->getMessage()}");

            return response()->json([
                'success' => false,
                'message' => 'Error retrieving review queue',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get pending predictions awaiting feedback
     *
     * GET /api/ml/pending-feedback
     * Query params:
     *   - days: minimum age of predictions (default 7)
     *   - limit: max predictions to return (default 50)
     */
    public function getPendingFeedback(Request $request): JsonResponse
    {
        try {
            $days = (int) $request->query('days', 7);
            $limit = (int) $request->query('limit', 50);

            Log::info("Pending feedback requested", [
                'days' => $days,
                'limit' => $limit,
            ]);

            $metricsService = app('App\Services\MLMetricsService');
            $result = $metricsService->getPendingFeedback($days, $limit);

            return response()->json($result, 200);

        } catch (\Exception $e) {
            Log::error("Error getting pending feedback: {$e->getMessage()}");

            return response()->json([
                'success' => false,
                'message' => 'Error retrieving pending feedback',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get performance degradation analysis
     *
     * GET /api/ml/degradation
     * Query params:
     *   - recent: days for recent period (default 7)
     *   - baseline: days for baseline period (default 30)
     */
    public function checkDegradation(Request $request): JsonResponse
    {
        try {
            $recentDays = (int) $request->query('recent', 7);
            $baselineDays = (int) $request->query('baseline', 30);

            Log::info("Performance degradation check requested", [
                'recent_days' => $recentDays,
                'baseline_days' => $baselineDays,
            ]);

            $metricsService = app('App\Services\MLMetricsService');
            $result = $metricsService->detectPerformanceDegradation($recentDays, $baselineDays);

            return response()->json($result, 200);

        } catch (\Exception $e) {
            Log::error("Error checking degradation: {$e->getMessage()}");

            return response()->json([
                'success' => false,
                'message' => 'Error checking performance degradation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get detailed risk report for a specific student
     *
     * GET /api/ml/reports/student/{studentId}/risk
     */
    public function getStudentRiskReport($studentId): JsonResponse
    {
        try {
            $student = User::findOrFail($studentId);

            Log::info("Risk report requested for student {$studentId}");

            $prediction = $this->mlService->predictStudent($student);

            if (!$prediction['success']) {
                return response()->json($prediction, 422);
            }

            $risk = $prediction['predictions']['risk'] ?? [];
            $anomaly = $prediction['anomaly_detection'] ?? null;

            return response()->json([
                'success' => true,
                'student' => [
                    'id' => $student->id,
                    'nombre' => $student->nombre_completo,
                    'email' => $student->email,
                ],
                'risk_analysis' => [
                    'score' => $risk['score_riesgo'] ?? 0,
                    'level' => $risk['nivel_riesgo'] ?? 'medio',
                    'confidence' => round($risk['confianza'] ?? 0, 3),
                    'escalated_by_anomaly' => $risk['anomaly_escalation'] ?? false,
                    'original_score' => $risk['original_score'] ?? null,
                    'escalation_reason' => $risk['escalation_reason'] ?? null,
                ],
                'anomaly_detection' => $anomaly ? [
                    'detected' => $anomaly['is_anomaly'] ?? false,
                    'type' => $anomaly['anomaly_type'] ?? null,
                    'score' => $anomaly['anomaly_score'] ?? 0,
                    'description' => $anomaly['anomaly_description'] ?? null,
                ] : null,
                'validation' => $prediction['validation'] ?? [],
                'timestamp' => $prediction['timestamp'],
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => "Student with ID {$studentId} not found",
            ], 404);

        } catch (\Exception $e) {
            Log::error("Error generating risk report: {$e->getMessage()}");

            return response()->json([
                'success' => false,
                'message' => 'Error generating risk report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get institutional risk report for all students
     *
     * GET /api/ml/reports/institutional/risk
     * Query params:
     *   - level: filter by risk level (alto|medio|bajo)
     *   - limit: max students to return (default 50)
     */
    public function getInstitutionalRiskReport(Request $request): JsonResponse
    {
        try {
            $riskLevel = $request->query('level');
            $limit = (int) $request->query('limit', 50);

            Log::info("Institutional risk report requested", [
                'level' => $riskLevel,
                'limit' => $limit,
            ]);

            $estudiantes = User::where('tipo_usuario', 'estudiante')->get();
            $allPredictions = [];
            $distribucion = ['alto' => 0, 'medio' => 0, 'bajo' => 0];

            foreach ($estudiantes as $estudiante) {
                try {
                    $pred = $this->mlService->predictStudent($estudiante);

                    if ($pred['success'] && isset($pred['predictions']['risk'])) {
                        $riesgo = $pred['predictions']['risk'];
                        $nivel = $riesgo['nivel_riesgo'] ?? 'medio';

                        $distribucion[$nivel]++;

                        $prediction = [
                            'student_id' => $estudiante->id,
                            'nombre' => $estudiante->nombre_completo,
                            'score_riesgo' => round($riesgo['score_riesgo'] ?? 0, 3),
                            'nivel_riesgo' => $nivel,
                            'confianza' => round($riesgo['confianza'] ?? 0, 3),
                            'escalado' => $riesgo['anomaly_escalation'] ?? false,
                        ];

                        if (!$riskLevel || $nivel === $riskLevel) {
                            $allPredictions[] = $prediction;
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning("Error prediciendo riesgo para estudiante {$estudiante->id}");
                }
            }

            // Ordenar por score y limitar
            usort($allPredictions, fn($a, $b) => $b['score_riesgo'] <=> $a['score_riesgo']);
            $allPredictions = array_slice($allPredictions, 0, $limit);

            $total = count($allPredictions);

            return response()->json([
                'success' => true,
                'summary' => [
                    'total_estudiantes' => count($estudiantes),
                    'estudiantes_evaluados' => array_sum($distribucion),
                    'distribucion' => $distribucion,
                    'porcentaje_alto_riesgo' => array_sum($distribucion) > 0
                        ? round(($distribucion['alto'] / array_sum($distribucion)) * 100, 2)
                        : 0,
                ],
                'predictions' => $allPredictions,
                'filter' => $riskLevel ? "Risk level: {$riskLevel}" : 'All levels',
                'timestamp' => now(),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error generating institutional risk report: {$e->getMessage()}");

            return response()->json([
                'success' => false,
                'message' => 'Error generating institutional risk report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get anomaly detection report
     *
     * GET /api/ml/reports/anomalies
     * Query params:
     *   - type: filter by anomaly type (optional)
     *   - limit: max anomalies to return (default 50)
     */
    public function getAnomalyReport(Request $request): JsonResponse
    {
        try {
            $anomalyType = $request->query('type');
            $limit = (int) $request->query('limit', 50);

            Log::info("Anomaly report requested", [
                'type' => $anomalyType,
                'limit' => $limit,
            ]);

            $anomalyService = app(AnomalyDetectionService::class);
            $allAnomalies = $anomalyService->detectAllAnomalies();

            $filtered = [];
            foreach ($allAnomalies as $anomaly) {
                if (!$anomalyType || $anomaly['anomaly_type'] === $anomalyType) {
                    $filtered[] = $anomaly;
                }
            }

            // Limitar
            $filtered = array_slice($filtered, 0, $limit);

            // Agrupar por tipo
            $byType = [];
            foreach ($filtered as $anomaly) {
                $type = $anomaly['anomaly_type'] ?? 'unknown';
                if (!isset($byType[$type])) {
                    $byType[$type] = [];
                }
                $byType[$type][] = $anomaly;
            }

            return response()->json([
                'success' => true,
                'total_anomalies_detected' => count($allAnomalies),
                'filtered_count' => count($filtered),
                'by_type' => $byType,
                'timestamp' => now(),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error generating anomaly report: {$e->getMessage()}");

            return response()->json([
                'success' => false,
                'message' => 'Error generating anomaly report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get trend analysis with ML predictions
     *
     * GET /api/ml/reports/trends
     * Query params:
     *   - days: period for trend analysis (default 30)
     */
    public function getTrendAnalysis(Request $request): JsonResponse
    {
        try {
            $days = (int) $request->query('days', 30);

            Log::info("Trend analysis requested", ['days' => $days]);

            // Get metrics
            $metricsService = app(MLMetricsService::class);
            $performance = $metricsService->getPerformanceSummary($days);
            $degradation = $metricsService->detectPerformanceDegradation(7, $days);

            // Get predictions
            $estudiantes = User::where('tipo_usuario', 'estudiante')->get();
            $trends = [];
            $trendCounts = ['mejorando' => 0, 'estable' => 0, 'decayendo' => 0];

            foreach ($estudiantes as $estudiante) {
                try {
                    $pred = $this->mlService->predictStudent($estudiante);

                    if ($pred['success'] && isset($pred['predictions']['tendencia'])) {
                        $tendencia = $pred['predictions']['tendencia']['prediccion'] ?? 'estable';
                        $trendCounts[$tendencia]++;
                    }
                } catch (\Exception $e) {
                    Log::warning("Error getting trend for student {$estudiante->id}");
                }
            }

            return response()->json([
                'success' => true,
                'performance_metrics' => $performance,
                'degradation_analysis' => $degradation,
                'trend_distribution' => $trendCounts,
                'analysis_period_days' => $days,
                'timestamp' => now(),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error generating trend analysis: {$e->getMessage()}");

            return response()->json([
                'success' => false,
                'message' => 'Error generating trend analysis',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
