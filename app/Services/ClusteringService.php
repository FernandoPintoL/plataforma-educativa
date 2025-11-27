<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Servicio de Clustering
 *
 * Comunica con la API Python (FastAPI) para obtener predicciones de clusters
 * K-Means agrupa estudiantes en grupos similares para detección de anomalías
 */
class ClusteringService
{
    private string $apiUrl;
    private int $timeout;

    public function __construct()
    {
        $this->apiUrl = config('ml.api_url', 'http://localhost:8001');
        $this->timeout = config('ml.request_timeout', 30);
    }

    /**
     * Obtener predicción de cluster para un estudiante
     *
     * @param int $studentId ID del estudiante
     * @param array $features Features del estudiante
     * @return array Predicción de cluster
     *
     * @throws \Exception Si la API no responde
     */
    public function predictCluster(int $studentId, array $features): array
    {
        try {
            // Preparar features para la API
            $payload = [
                'student_id' => $studentId,
                'promedio' => $features['promedio'] ?? 50,
                'asistencia' => $features['asistencia'] ?? 80,
                'trabajos_entregados' => $features['trabajos_entregados'] ?? 0,
                'trabajos_totales' => $features['trabajos_totales'] ?? 1,
                'varianza_calificaciones' => $features['varianza_calificaciones'] ?? 0,
                'dias_desde_ultima_calificacion' => $features['dias_desde_ultima_calificacion'] ?? 0,
                'num_consultas_materiales' => $features['num_consultas_materiales'] ?? 0,
            ];

            Log::debug('Clustering prediction request', [
                'student_id' => $studentId,
                'features_keys' => array_keys($payload)
            ]);

            // Llamar a FastAPI
            $response = Http::timeout($this->timeout)
                ->post("{$this->apiUrl}/predict/cluster", $payload);

            if (!$response->successful()) {
                throw new \Exception("API error: {$response->status()} - {$response->body()}");
            }

            $result = $response->json();

            Log::info('Clustering prediction successful', [
                'student_id' => $studentId,
                'cluster_id' => $result['cluster_id'] ?? null,
                'cluster_name' => $result['cluster_name'] ?? null,
                'confidence' => $result['confidence'] ?? null,
            ]);

            return [
                'success' => true,
                'cluster_id' => $result['cluster_id'] ?? null,
                'cluster_name' => $result['cluster_name'] ?? 'Unknown',
                'expected_risk' => $result['expected_risk'] ?? 'desconocido',
                'cluster_probability' => $result['cluster_probability'] ?? 0,
                'silhouette_score' => $result['silhouette_score'] ?? 0,
                'confidence' => $result['confidence'] ?? 0,
                'timestamp' => $result['timestamp'] ?? now(),
            ];

        } catch (\Exception $e) {
            Log::error('Clustering prediction error', [
                'student_id' => $studentId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'cluster_id' => null,
                'confidence' => 0,
            ];
        }
    }

    /**
     * Obtener información sobre un cluster
     *
     * @param int $clusterId ID del cluster (0, 1, o 2)
     * @return array Información del cluster
     */
    public function getClusterInfo(int $clusterId): array
    {
        $info = [
            0 => [
                'id' => 0,
                'name' => 'Bajo Desempeño',
                'expected_risk' => 'alto',
                'description' => 'Estudiantes con bajo desempeño académico. Requieren atención y apoyo inmediato.',
                'color' => '#ff6b6b',
                'icon' => '🔴'
            ],
            1 => [
                'id' => 1,
                'name' => 'Desempeño Medio',
                'expected_risk' => 'medio',
                'description' => 'Estudiantes con desempeño medio. Tienen potencial pero necesitan seguimiento.',
                'color' => '#ffc107',
                'icon' => '🟡'
            ],
            2 => [
                'id' => 2,
                'name' => 'Alto Desempeño',
                'expected_risk' => 'bajo',
                'description' => 'Estudiantes con alto desempeño. Mantienen consistencia académica positiva.',
                'color' => '#51cf66',
                'icon' => '🟢'
            ]
        ];

        return $info[$clusterId] ?? [
            'id' => $clusterId,
            'name' => "Cluster {$clusterId}",
            'expected_risk' => 'desconocido',
            'description' => 'Cluster desconocido',
            'color' => '#999',
            'icon' => '⚪'
        ];
    }

    /**
     * Validar coherencia entre cluster predicho y riesgo
     *
     * Verifica que el cluster esperado coincida con el riesgo predicho
     *
     * @param array $clusterPrediction Predicción de cluster
     * @param array $riskPrediction Predicción de riesgo
     * @return array Resultado de validación
     */
    public function validateClusterRiskCoherence(array $clusterPrediction, array $riskPrediction): array
    {
        $clusterId = $clusterPrediction['cluster_id'] ?? null;
        $expectedRisk = $clusterPrediction['expected_risk'] ?? null;
        $actualRisk = $riskPrediction['nivel_riesgo'] ?? null;

        if ($clusterId === null || $expectedRisk === null || $actualRisk === null) {
            return [
                'is_coherent' => true,
                'inconsistency' => null,
            ];
        }

        // Verificar si hay discrepancia
        if ($expectedRisk !== $actualRisk) {
            return [
                'is_coherent' => false,
                'inconsistency' => [
                    'type' => 'cluster_risk_mismatch',
                    'severity' => 'warning',
                    'message' => "Estudiante en cluster '{$clusterPrediction['cluster_name']}' "
                        . "espera riesgo '{$expectedRisk}' pero predicción indica '{$actualRisk}'",
                    'details' => [
                        'cluster_id' => $clusterId,
                        'cluster_name' => $clusterPrediction['cluster_name'] ?? 'Unknown',
                        'expected_risk' => $expectedRisk,
                        'actual_risk' => $actualRisk,
                        'cluster_probability' => $clusterPrediction['cluster_probability'] ?? 0,
                        'cluster_confidence' => $clusterPrediction['confidence'] ?? 0,
                        'risk_confidence' => $riskPrediction['confianza'] ?? 0,
                    ],
                ]
            ];
        }

        return [
            'is_coherent' => true,
            'inconsistency' => null,
        ];
    }

    /**
     * Detectar anomalías basadas en cluster
     *
     * Un estudiante es anómalo si su distancia al centroide es muy alta
     *
     * @param array $clusterPrediction Predicción de cluster
     * @return bool True si es anomalía
     */
    public function isAnomalous(array $clusterPrediction): bool
    {
        $distance = $clusterPrediction['silhouette_score'] ?? 0;
        $probability = $clusterPrediction['cluster_probability'] ?? 0;

        // Anómalo si:
        // - Baja probabilidad (<0.5) O
        // - Silhouette score muy negativo (<-0.3)
        return $probability < 0.5 || $distance < -0.3;
    }

    /**
     * Obtener descripción de anomalía
     *
     * @param array $clusterPrediction Predicción de cluster
     * @return string Descripción de la anomalía
     */
    public function getAnomalyDescription(array $clusterPrediction): string
    {
        $probability = $clusterPrediction['cluster_probability'] ?? 0;
        $silhouette = $clusterPrediction['silhouette_score'] ?? 0;

        if ($probability < 0.5) {
            return sprintf("Estudiante no pertenece claramente a ningún cluster (prob: %.2f)", $probability);
        }

        if ($silhouette < -0.3) {
            return sprintf("Estudiante muy alejado de su cluster (silhouette: %.2f)", $silhouette);
        }

        return "Comportamiento anómalo detectado";
    }

    /**
     * Calcular score de "fitment" (qué tan bien encaja en su cluster)
     *
     * Basado en probabilidad y distancia
     *
     * @param array $clusterPrediction Predicción de cluster
     * @return float Score entre 0 y 1 (1 = perfecto ajuste)
     */
    public function calculateFitmentScore(array $clusterPrediction): float
    {
        $probability = $clusterPrediction['cluster_probability'] ?? 0;
        $silhouette = $clusterPrediction['silhouette_score'] ?? 0;

        // Normalizar silhouette [-1, 1] a [0, 1]
        $silhouette_normalized = ($silhouette + 1) / 2;

        // Combinar: 60% probabilidad, 40% silhueta
        $fitment = ($probability * 0.6) + ($silhouette_normalized * 0.4);

        return min(1.0, max(0.0, $fitment));
    }
}
