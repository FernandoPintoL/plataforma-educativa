<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

/**
 * Validador de Coherencia entre Predicciones
 *
 * Verifica que múltiples predicciones de diferentes modelos
 * sean coherentes entre sí
 */
class PredictionValidator
{
    /**
     * Reglas de validación y sus tolerancias
     */
    private array $coherenceRules = [
        'risk_career_contradiction' => [
            'rule' => 'IF risk_score >= 0.70 AND career_compatibility > 0.75',
            'severity' => 'warning',
            'action' => 'verify_data_quality',
            'explanation' => 'Estudiante con alto riesgo no debería tener carrera altamente compatible'
        ],
        'trend_risk_contradiction' => [
            'rule' => 'IF trend == "mejorando" AND risk_level == "alto"',
            'severity' => 'info',
            'action' => 'monitor',
            'explanation' => 'Tendencia mejorando pero riesgo alto (posible lag de datos)'
        ],
        'cluster_risk_mismatch' => [
            'rule' => 'expected_risk_by_cluster[cluster_id] != risk_level',
            'severity' => 'warning',
            'action' => 'investigate',
            'explanation' => 'Cluster assignment no coincide con predicción de riesgo'
        ],
        'trend_grade_mismatch' => [
            'rule' => 'IF trend does not match grade direction',
            'severity' => 'warning',
            'action' => 'verify',
            'explanation' => 'Tendencia no coincide con dirección del promedio'
        ],
    ];

    /**
     * Mapeo de cluster a riesgo esperado
     */
    private array $clusterRiskMapping = [
        0 => 'alto',    // Cluster 0 = Low performers
        1 => 'medio',   // Cluster 1 = Medium performers
        2 => 'bajo',    // Cluster 2 = High performers
    ];

    /**
     * Validar coherencia entre múltiples predicciones
     *
     * @param int $studentId
     * @param array $predictions Predicciones de diferentes modelos
     * @return array Resultado de validación
     */
    public function validatePredictions(int $studentId, array $predictions): array
    {
        $inconsistencies = [];

        // Extraer predicciones individuales
        $riskPred = $predictions['risk'] ?? null;
        $careerPred = $predictions['carrera'] ?? null;
        $trendPred = $predictions['tendencia'] ?? null;
        $clusterPred = $predictions['cluster'] ?? null;

        Log::info("Iniciando validación de coherencia", [
            'student_id' => $studentId,
            'predictions_types' => array_keys(array_filter([
                'risk' => $riskPred,
                'career' => $careerPred,
                'trend' => $trendPred,
                'cluster' => $clusterPred
            ]))
        ]);

        // REGLA 1: Risk alto + High compatibility = inconsistencia
        if ($riskPred && $careerPred) {
            $inconsistency = $this->validateRiskCareer($riskPred, $careerPred);
            if ($inconsistency) {
                $inconsistencies[] = $inconsistency;
            }
        }

        // REGLA 2: Trend mejorando pero risk alto
        if ($trendPred && $riskPred) {
            $inconsistency = $this->validateTrendRisk($trendPred, $riskPred);
            if ($inconsistency) {
                $inconsistencies[] = $inconsistency;
            }
        }

        // REGLA 3: Cluster bajo rendimiento pero risk bajo
        if ($clusterPred && $riskPred) {
            $inconsistency = $this->validateClusterRisk($clusterPred, $riskPred);
            if ($inconsistency) {
                $inconsistencies[] = $inconsistency;
            }
        }

        $isCoherent = empty($inconsistencies);
        $recommendedAction = $this->getRecommendedAction($inconsistencies);

        $result = [
            'student_id' => $studentId,
            'is_coherent' => $isCoherent,
            'inconsistencies_count' => count($inconsistencies),
            'inconsistencies' => $inconsistencies,
            'recommendation_action' => $recommendedAction,
            'severity' => $this->getMaxSeverity($inconsistencies),
            'timestamp' => now(),
        ];

        if (!$isCoherent) {
            Log::warning("Incoherencias detectadas en predicciones", [
                'student_id' => $studentId,
                'count' => count($inconsistencies),
                'inconsistencies' => $inconsistencies
            ]);
        } else {
            Log::info("Predicciones coherentes validadas", [
                'student_id' => $studentId
            ]);
        }

        return $result;
    }

    /**
     * REGLA 1: Validar Risk vs Career
     */
    private function validateRiskCareer(array $risk, array $career): ?array
    {
        $riskScore = $risk['score_riesgo'] ?? 0;
        $compatibility = $career['compatibilidad'] ?? 0;

        // Si riesgo es alto, compatibilidad con carrera NO debe ser muy alta
        if ($riskScore >= 0.70 && $compatibility > 0.75) {
            return [
                'type' => 'risk_career_contradiction',
                'severity' => 'warning',
                'confidence' => $this->calculateContradictionConfidence($riskScore, $compatibility),
                'message' => 'Alto riesgo pero recomendación carrera tiene compatibilidad muy alta',
                'details' => [
                    'risk_score' => $riskScore,
                    'risk_level' => $risk['nivel_riesgo'],
                    'career_name' => $career['carrera_nombre'],
                    'compatibility' => $compatibility,
                    'expected_max_compatibility' => 0.6,
                    'actual_gap' => $compatibility - 0.6,
                ],
                'action' => 'verify_student_data',
            ];
        }

        return null;
    }

    /**
     * REGLA 2: Validar Trend vs Risk
     */
    private function validateTrendRisk(array $trend, array $risk): ?array
    {
        $trendType = $trend['tendencia'] ?? null;
        $riskLevel = $risk['nivel_riesgo'] ?? null;

        // Si tendencia es "mejorando", risk NO debe ser "alto"
        if ($trendType === 'mejorando' && $riskLevel === 'alto') {
            return [
                'type' => 'trend_risk_contradiction',
                'severity' => 'info',  // Info porque podría ser lag de datos
                'confidence' => 0.7,
                'message' => 'Tendencia mejorando pero riesgo alto (posible lag de datos o cambio reciente)',
                'details' => [
                    'trend' => $trendType,
                    'risk_level' => $riskLevel,
                    'trend_confidence' => $trend['confianza'] ?? 0,
                    'risk_confidence' => $risk['confianza'] ?? 0,
                ],
                'action' => 'monitor_and_revalidate',
                'recommendation' => 'Revisar datos recientes, puede ser cambio positivo reciente'
            ];
        }

        // Si tendencia es "declinando" pero risk es "bajo"
        if ($trendType === 'declinando' && $riskLevel === 'bajo') {
            return [
                'type' => 'trend_risk_contradiction',
                'severity' => 'warning',
                'confidence' => 0.8,
                'message' => 'Tendencia declinando pero riesgo bajo (desacuerdo importante)',
                'details' => [
                    'trend' => $trendType,
                    'risk_level' => $riskLevel,
                ],
                'action' => 'escalate_risk',
                'recommendation' => 'Considerar escalar riesgo si hay tendencia declinando'
            ];
        }

        return null;
    }

    /**
     * REGLA 3: Validar Cluster vs Risk
     */
    private function validateClusterRisk(array $cluster, array $risk): ?array
    {
        $clusterId = $cluster['cluster_id'] ?? null;
        $riskLevel = $risk['nivel_riesgo'] ?? null;

        if ($clusterId === null || !isset($this->clusterRiskMapping[$clusterId])) {
            return null;
        }

        $expectedRisk = $this->clusterRiskMapping[$clusterId];

        // Si no coinciden, es una inconsistencia
        if ($expectedRisk !== $riskLevel) {
            return [
                'type' => 'cluster_risk_mismatch',
                'severity' => 'warning',
                'confidence' => $cluster['silhouette_score'] ?? 0.5,
                'message' => "Estudiante en cluster {$clusterId} pero riesgo es {$riskLevel}",
                'details' => [
                    'cluster_id' => $clusterId,
                    'cluster_name' => $this->getClusterName($clusterId),
                    'cluster_probability' => $cluster['cluster_probability'] ?? 0,
                    'cluster_silhouette' => $cluster['silhouette_score'] ?? 0,
                    'expected_risk' => $expectedRisk,
                    'actual_risk' => $riskLevel,
                ],
                'action' => 'investigate',
                'recommendation' => "Revisar por qué cluster {$clusterId} predice {$expectedRisk} pero modelo de riesgo predice {$riskLevel}"
            ];
        }

        return null;
    }

    /**
     * Calcular confianza en la contradicción
     */
    private function calculateContradictionConfidence(float $riskScore, float $compatibility): float
    {
        // Mientras más extrema la contradicción, más confianza
        $riskDeviation = abs($riskScore - 0.70);  // Qué tan alto es el riesgo
        $compatDeviation = abs($compatibility - 0.75);  // Qué tan alta es compatibilidad
        return min(1.0, ($riskDeviation + $compatDeviation) / 2);
    }

    /**
     * Obtener nombre del cluster
     */
    private function getClusterName(int $clusterId): string
    {
        return match($clusterId) {
            0 => 'Bajo Desempeño',
            1 => 'Desempeño Medio',
            2 => 'Alto Desempeño',
            default => "Cluster $clusterId"
        };
    }

    /**
     * Obtener acción recomendada basada en inconsistencias
     */
    private function getRecommendedAction(array $inconsistencies): string
    {
        if (empty($inconsistencies)) {
            return 'proceed_normally';
        }

        $severities = array_map(fn($i) => $i['severity'], $inconsistencies);

        // Si hay warnings
        if (in_array('warning', $severities)) {
            return 'verify_data_and_monitor';
        }

        // Si hay infos
        if (in_array('info', $severities)) {
            return 'monitor_and_log';
        }

        return 'proceed_with_caution';
    }

    /**
     * Obtener severidad máxima
     */
    private function getMaxSeverity(array $inconsistencies): string
    {
        if (empty($inconsistencies)) {
            return 'none';
        }

        $severities = array_map(fn($i) => $i['severity'], $inconsistencies);

        if (in_array('error', $severities)) return 'error';
        if (in_array('warning', $severities)) return 'warning';
        if (in_array('info', $severities)) return 'info';

        return 'none';
    }

    /**
     * Generar reporte de validación con sugerencias
     */
    public function generateValidationReport(int $studentId, array $predictions): array
    {
        $validation = $this->validatePredictions($studentId, $predictions);

        $suggestions = [];

        foreach ($validation['inconsistencies'] as $inconsistency) {
            $suggestions[] = match($inconsistency['type']) {
                'risk_career_contradiction' => [
                    'title' => 'Revisar recomendación de carrera',
                    'description' => 'El alto riesgo académico puede afectar el rendimiento en la carrera recomendada',
                    'action' => 'Considerado intervención académica antes de recomendar carrera',
                    'priority' => 'high'
                ],
                'trend_risk_contradiction' => [
                    'title' => 'Monitorear cambios recientes',
                    'description' => 'La tendencia mejorante es positiva pero el riesgo sigue alto',
                    'action' => 'Mantener monitoreo cercano, revalidar en 2 semanas',
                    'priority' => 'medium'
                ],
                'cluster_risk_mismatch' => [
                    'title' => 'Investigar asignación de cluster',
                    'description' => 'El grupo de estudiantes similares no coincide con la predicción de riesgo',
                    'action' => 'Revisar features del estudiante para entender la discrepancia',
                    'priority' => 'high'
                ],
                default => [
                    'title' => 'Revisar predicción',
                    'description' => $inconsistency['message'],
                    'action' => $inconsistency['action'] ?? 'Revisar datos',
                    'priority' => 'medium'
                ]
            };
        }

        return [
            'student_id' => $studentId,
            'validation' => $validation,
            'suggestions' => $suggestions,
            'overall_status' => $validation['is_coherent'] ? 'coherent' : 'needs_review',
            'next_steps' => $this->getNextSteps($validation, $suggestions),
        ];
    }

    /**
     * Obtener próximos pasos recomendados
     */
    private function getNextSteps(array $validation, array $suggestions): array
    {
        $steps = [];

        if (!$validation['is_coherent']) {
            $steps[] = [
                'priority' => 1,
                'action' => 'Review Data Quality',
                'description' => 'Verificar que los datos del estudiante sean correctos y actualizados'
            ];

            $steps[] = [
                'priority' => 2,
                'action' => 'Cross-Check Predictions',
                'description' => 'Validar cada predicción individualmente'
            ];

            if ($validation['severity'] === 'warning') {
                $steps[] = [
                    'priority' => 3,
                    'action' => 'Schedule Intervention',
                    'description' => 'Considerar intervención académica basada en inconsistencias'
                ];
            }
        } else {
            $steps[] = [
                'priority' => 1,
                'action' => 'Proceed with Recommendations',
                'description' => 'Las predicciones son coherentes, proceder con intervenciones recomendadas'
            ];

            $steps[] = [
                'priority' => 2,
                'action' => 'Monitor Progress',
                'description' => 'Continuar monitoreando progreso del estudiante'
            ];
        }

        return $steps;
    }

    /**
     * Validar predicción individual
     */
    public function validateIndividualPrediction(string $type, array $prediction): array
    {
        $errors = [];
        $warnings = [];

        match($type) {
            'risk' => [
                isset($prediction['score_riesgo']) &&
                    $prediction['score_riesgo'] >= 0 && $prediction['score_riesgo'] <= 1
                    ? null : $errors[] = 'Invalid score_riesgo',

                in_array($prediction['nivel_riesgo'] ?? null, ['alto', 'medio', 'bajo'])
                    ? null : $errors[] = 'Invalid nivel_riesgo',

                isset($prediction['confianza']) &&
                    $prediction['confianza'] >= 0 && $prediction['confianza'] <= 1
                    ? null : $errors[] = 'Invalid confianza',

                ($prediction['confianza'] ?? 0) < 0.6
                    ? $warnings[] = 'Low confidence in risk prediction' : null,
            ],

            'carrera' => [
                !empty($prediction['carrera_nombre'])
                    ? null : $errors[] = 'Missing carrera_nombre',

                isset($prediction['compatibilidad']) &&
                    $prediction['compatibilidad'] >= 0 && $prediction['compatibilidad'] <= 1
                    ? null : $errors[] = 'Invalid compatibilidad',
            ],

            'tendencia' => [
                in_array($prediction['tendencia'] ?? null,
                    ['mejorando', 'estable', 'declinando', 'fluctuando'])
                    ? null : $errors[] = 'Invalid tendencia',
            ],

            default => $errors[] = "Unknown prediction type: $type"
        };

        return [
            'type' => $type,
            'is_valid' => empty($errors),
            'errors' => $errors,
            'warnings' => $warnings,
        ];
    }
}
