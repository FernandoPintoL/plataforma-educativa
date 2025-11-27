<?php

namespace App\Services;

use App\Models\User;
use App\Models\MLPredictionFeedback;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * ML Integration Service
 *
 * Orquesta la integración completa del sistema ML:
 * - Predicciones de múltiples modelos
 * - Validación de coherencia entre predicciones
 * - Detección de anomalías LSTM con escalada de riesgo
 * - Registro de predicciones para feedback loop
 * - Cálculo de métricas de rendimiento
 */
class MLIntegrationService
{
    protected MLPredictionService $mlService;
    protected PredictionValidator $validator;
    protected ClusteringService $clusteringService;
    protected AnomalyDetectionService $anomalyService;
    protected MLMetricsService $metricsService;

    public function __construct()
    {
        $this->mlService = new MLPredictionService();
        $this->validator = new PredictionValidator();
        $this->clusteringService = new ClusteringService();
        $this->anomalyService = new AnomalyDetectionService();
        $this->metricsService = new MLMetricsService();
    }

    /**
     * Ejecutar predicción completa e integrada para un estudiante
     *
     * @param User $student Usuario estudiante
     * @return array Resultado completo con todas las predicciones
     */
    public function predictStudent(User $student): array
    {
        try {
            Log::info("Starting integrated prediction for student {$student->id}");

            // 1. Extraer features
            $features = $this->mlService->extractStudentFeatures($student);

            // 2. Hacer todas las predicciones
            $predictions = [];

            try {
                $predictions['risk'] = $this->mlService->predictRisk($features);
            } catch (Exception $e) {
                Log::error("Risk prediction failed: {$e->getMessage()}");
                $predictions['risk'] = null;
            }

            try {
                $predictions['carrera'] = $this->mlService->predictCareer($features);
            } catch (Exception $e) {
                Log::error("Career prediction failed: {$e->getMessage()}");
                $predictions['carrera'] = null;
            }

            try {
                $predictions['tendencia'] = $this->mlService->predictTrend($features);
            } catch (Exception $e) {
                Log::error("Trend prediction failed: {$e->getMessage()}");
                $predictions['tendencia'] = null;
            }

            try {
                $clusteringService = new ClusteringService();
                $clusterPred = $clusteringService->predictCluster($student->id, $features);
                if ($clusterPred['success']) {
                    $predictions['cluster'] = $clusterPred;
                }
            } catch (Exception $e) {
                Log::error("Clustering prediction failed: {$e->getMessage()}");
                $predictions['cluster'] = null;
            }

            // 3. Detectar anomalías en historial de calificaciones
            $grades = $this->getStudentGradeHistory($student, 20);
            $anomalyDetection = null;

            if (count($grades) >= 2) {
                try {
                    $anomalyDetection = $this->anomalyService->detectAnomalies($student->id, $grades);

                    // 4. Si hay anomalía, escalar riesgo
                    if ($anomalyDetection['is_anomaly'] ?? false) {
                        $predictions['risk'] = $this->escalateRiskByAnomaly(
                            $predictions['risk'] ?? [],
                            $anomalyDetection
                        );

                        Log::warning("Risk escalated for student {$student->id} due to anomaly", [
                            'anomaly_type' => $anomalyDetection['anomaly_type'],
                            'anomaly_score' => $anomalyDetection['anomaly_score'],
                        ]);
                    }
                } catch (Exception $e) {
                    Log::error("Anomaly detection failed: {$e->getMessage()}");
                }
            }

            // 5. Validar coherencia entre predicciones
            $validation = $this->validator->validatePredictions($student->id, $predictions);

            // 6. Registrar predicciones en feedback table
            foreach (['risk', 'carrera', 'tendencia', 'cluster'] as $type) {
                if (isset($predictions[$type]) && $predictions[$type]) {
                    $this->recordPredictionFeedback($student->id, $type, $predictions[$type], $validation);
                }
            }

            Log::info("Integrated prediction completed for student {$student->id}", [
                'coherent' => $validation['is_coherent'],
                'inconsistencies' => count($validation['inconsistencies']),
            ]);

            return [
                'success' => true,
                'student_id' => $student->id,
                'predictions' => $predictions,
                'validation' => $validation,
                'anomaly_detection' => $anomalyDetection,
                'timestamp' => now(),
            ];

        } catch (Exception $e) {
            Log::error("Error in integrated prediction: {$e->getMessage()}", [
                'student_id' => $student->id,
            ]);

            return [
                'success' => false,
                'student_id' => $student->id,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Registrar predicción en feedback table
     */
    private function recordPredictionFeedback(
        int $studentId,
        string $type,
        array $prediction,
        array $validation
    ): void {
        try {
            MLPredictionFeedback::create([
                'estudiante_id' => $studentId,
                'prediction_type' => $type,
                'predicted_value' => $prediction,
                'predicted_score' => $this->extractScore($prediction, $type),
                'confidence' => $prediction['confianza'] ?? $prediction['confidence'] ?? null,
                'modelo_version' => $prediction['modelo_version'] ?? 'unknown',
                'prediction_details' => $prediction,
                'validation_result' => $validation,
                'prediction_timestamp' => now(),
                'notes' => "Initial prediction - awaiting feedback",
            ]);

            Log::debug("Prediction recorded for feedback", [
                'student_id' => $studentId,
                'type' => $type,
            ]);
        } catch (Exception $e) {
            Log::error("Error recording prediction feedback: {$e->getMessage()}");
        }
    }

    /**
     * Escalar riesgo si hay anomalía LSTM
     */
    private function escalateRiskByAnomaly(array $riskPrediction, array $anomalyDetection): array
    {
        $anomalyType = $anomalyDetection['anomaly_type'] ?? null;

        // Solo escalar para caídas abruptas y degradación
        if ($anomalyType === 'spike_down' || $anomalyType === 'drift') {
            $currentScore = $riskPrediction['score_riesgo'] ?? 0.5;
            $escalationAmount = $anomalyType === 'spike_down' ? 0.25 : 0.15;

            $escalatedScore = min(1.0, $currentScore + $escalationAmount);
            $escalatedLevel = $escalatedScore >= 0.7 ? 'alto' : ($escalatedScore >= 0.4 ? 'medio' : 'bajo');

            // Agregar notas sobre escalada
            $riskPrediction['anomaly_escalation'] = true;
            $riskPrediction['original_score'] = $currentScore;
            $riskPrediction['original_level'] = $riskPrediction['nivel_riesgo'] ?? 'medio';
            $riskPrediction['score_riesgo'] = $escalatedScore;
            $riskPrediction['nivel_riesgo'] = $escalatedLevel;
            $riskPrediction['escalation_reason'] = "LSTM anomaly: {$this->anomalyService->getAnomalyDescription($anomalyType)}";
            $riskPrediction['escalation_score'] = $anomalyDetection['anomaly_score'] ?? 0;
        }

        return $riskPrediction;
    }

    /**
     * Obtener historial de calificaciones del estudiante
     */
    private function getStudentGradeHistory(User $student, int $limit = 20): array
    {
        try {
            $grades = $student->calificaciones()
                ->latest('fecha_calificacion')
                ->limit($limit)
                ->pluck('puntaje')
                ->reverse()
                ->toArray();

            return array_map(fn($g) => (float)$g, $grades);
        } catch (Exception $e) {
            Log::error("Error getting grade history: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Extraer score de una predicción
     */
    private function extractScore(array $prediction, string $type): ?float
    {
        return match ($type) {
            'risk' => $prediction['score_riesgo'] ?? null,
            'carrera' => $prediction['compatibilidad'] ?? null,
            'tendencia' => null,
            'cluster' => $prediction['cluster_probability'] ?? null,
            'anomaly' => $prediction['anomaly_score'] ?? null,
            default => null,
        };
    }

    /**
     * Registrar feedback real para una predicción
     */
    public function recordActualOutcome(int $studentId, string $type, mixed $actualValue): array
    {
        try {
            MLPredictionFeedback::recordFeedback($studentId, $type, $actualValue);

            Log::info("Feedback recorded for student {$studentId}", [
                'type' => $type,
                'actual_value' => $actualValue,
            ]);

            return [
                'success' => true,
                'message' => 'Feedback registered successfully',
            ];
        } catch (Exception $e) {
            Log::error("Error recording feedback: {$e->getMessage()}");

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Obtener dashboard de métricas ML
     */
    public function getMLDashboard(): array
    {
        try {
            $performance = $this->metricsService->getPerformanceSummary(30);
            $degradation = $this->metricsService->detectPerformanceDegradation(7, 30);
            $reviewQueue = $this->metricsService->getReviewQueue(10);
            $pending = $this->metricsService->getPendingFeedback(7, 10);

            $alerts = [];

            // Alerta si hay degradación
            if ($degradation['degradation_detected'] ?? false) {
                $alerts[] = [
                    'type' => 'performance_degradation',
                    'severity' => 'warning',
                    'message' => "Accuracy dropped {$degradation['accuracy_drop_percentage']}%",
                ];
            }

            // Alerta si hay muchas predicciones pendientes
            if ($pending['total_pending'] > 50) {
                $alerts[] = [
                    'type' => 'pending_feedback',
                    'severity' => 'info',
                    'message' => "{$pending['total_pending']} predictions awaiting feedback",
                ];
            }

            // Alerta si hay muchas en revisión
            if ($reviewQueue['total_in_review'] > 20) {
                $alerts[] = [
                    'type' => 'high_review_queue',
                    'severity' => 'warning',
                    'message' => "{$reviewQueue['total_in_review']} predictions need manual review",
                ];
            }

            return [
                'success' => true,
                'performance_summary' => $performance,
                'degradation_analysis' => $degradation,
                'review_queue' => $reviewQueue,
                'pending_feedback' => $pending,
                'alerts' => $alerts,
                'timestamp' => now(),
            ];
        } catch (Exception $e) {
            Log::error("Error generating ML dashboard: {$e->getMessage()}");

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
