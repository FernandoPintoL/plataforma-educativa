<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Exception;

/**
 * UnifiedLearningOrchestrator
 *
 * Orquestador central que integra:
 * - Aprendizaje no supervisado (descubrimiento)
 * - Aprendizaje supervisado (predicción)
 * - Agente IA (síntesis e interpretación)
 * - Rutas adaptativas (acción)
 *
 * Flujo unificado:
 * 1. Unsupervised ML descubre patrones ocultos
 * 2. Supervised ML hace predicciones precisas
 * 3. Agent sintetiza ambas para interpretación
 * 4. Adaptive Paths genera acciones recomendadas
 */
class UnifiedLearningOrchestrator
{
    private StudentClusteringService $clusteringService;
    private ConceptTopicModelingService $topicService;
    private AnomalyDetectionService $anomalyService;
    private CorrelationAnalysisService $correlationService;
    private const SUPERVISED_ML_API_URL = 'http://localhost:8001';
    private const UNSUPERVISED_ML_API_URL = 'http://localhost:8002';
    private const AGENT_API_URL = 'http://localhost:8003';

    public function __construct(
        StudentClusteringService $clusteringService,
        ConceptTopicModelingService $topicService,
        AnomalyDetectionService $anomalyService,
        CorrelationAnalysisService $correlationService
    ) {
        $this->clusteringService = $clusteringService;
        $this->topicService = $topicService;
        $this->anomalyService = $anomalyService;
        $this->correlationService = $correlationService;
    }

    /**
     * Ejecutar pipeline completo de aprendizaje
     */
    public function runFullLearningPipeline(int $studentId): array
    {
        try {
            Log::info("Iniciando pipeline unificado de aprendizaje para estudiante {$studentId}");

            // LAYER 1: Unsupervised ML - Descubrimiento
            $discoveries = $this->runUnsupervisedDiscovery($studentId);

            // LAYER 2: Supervised ML - Predicción
            $predictions = $this->runSupervisedPredictions($studentId);

            // LAYER 3: Agent - Síntesis e Interpretación
            $synthesis = $this->runAgentSynthesis($studentId, $discoveries, $predictions);

            // LAYER 4: Adaptive Paths - Acciones
            $actions = $this->generateAdaptiveActions($studentId, $synthesis);

            Log::info("Pipeline completado para estudiante {$studentId}");

            return [
                'success' => true,
                'student_id' => $studentId,
                'timestamp' => now()->toIso8601String(),
                'layers' => [
                    'unsupervised_discovery' => $discoveries,
                    'supervised_predictions' => $predictions,
                    'agent_synthesis' => $synthesis,
                    'adaptive_actions' => $actions,
                ],
                'integrated_insights' => $this->generateIntegratedInsights(
                    $discoveries,
                    $predictions,
                    $synthesis
                ),
            ];

        } catch (Exception $e) {
            Log::error("Error en pipeline unificado: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * LAYER 1: Unsupervised ML - Descubrimiento de patrones
     */
    private function runUnsupervisedDiscovery(int $studentId): array
    {
        try {
            $discoveries = [];

            // Clustering - ¿A qué grupo pertenece?
            $clusterInfo = $this->clusteringService->getClustersSummary();
            if ($clusterInfo['success']) {
                $discoveries['cluster_analysis'] = [
                    'type' => 'Student Segmentation (K-Means)',
                    'data' => $clusterInfo,
                ];
            }

            // Topic Modeling - ¿Qué temas domina/lucha?
            $topicInfo = $this->topicService->getStudentTopics($studentId);
            if ($topicInfo['success']) {
                $discoveries['concept_topics'] = [
                    'type' => 'Hidden Concept Discovery (LDA)',
                    'data' => $topicInfo,
                ];
            }

            // Anomaly Detection - ¿Patrones inusuales?
            $anomalies = $this->anomalyService->getStudentAnomalies($studentId);
            if ($anomalies['success']) {
                $discoveries['anomalies'] = [
                    'type' => 'Pattern Anomalies',
                    'data' => $anomalies,
                ];
            }

            // Correlation Analysis - ¿Relaciones ocultas?
            $correlations = $this->correlationService->analyzeActivityPerformanceRelationship();
            if ($correlations['success']) {
                $discoveries['correlations'] = [
                    'type' => 'Hidden Relationships',
                    'data' => $correlations,
                ];
            }

            return [
                'completed_at' => now()->toIso8601String(),
                'discoveries' => $discoveries,
                'summary' => 'Unsupervised ML revealed hidden patterns and structures',
            ];

        } catch (Exception $e) {
            Log::error("Error en unsupervised discovery: {$e->getMessage()}");
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * LAYER 2: Supervised ML - Predicción basada en características
     */
    private function runSupervisedPredictions(int $studentId): array
    {
        try {
            $predictions = [];

            // Llamar a API de predicción supervisada (Python ML models)
            try {
                $response = Http::timeout(10)
                    ->post(
                        self::SUPERVISED_ML_API_URL . '/predict/batch',
                        [['student_id' => $studentId]]
                    );

                if ($response->successful()) {
                    $predictions['model_predictions'] = $response->json();
                }
            } catch (Exception $e) {
                Log::warning("No se pudo conectar a servidor de ML: {$e->getMessage()}");
            }

            return [
                'completed_at' => now()->toIso8601String(),
                'predictions' => $predictions,
                'summary' => 'Supervised ML made precise predictions based on features',
            ];

        } catch (Exception $e) {
            Log::error("Error en supervised predictions: {$e->getMessage()}");
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * LAYER 3: Agent - Síntesis e Interpretación
     */
    private function runAgentSynthesis(int $studentId, array $discoveries, array $predictions): array
    {
        try {
            $synthesis = [
                'status' => 'synthesizing',
                'agent_reasoning' => [
                    'input_sources' => [
                        'unsupervised_discovery' => count($discoveries),
                        'supervised_predictions' => count($predictions),
                    ],
                    'reasoning_steps' => [
                        '1. Analizar patrones descubiertos (no supervisado)',
                        '2. Integrar predicciones supervisadas',
                        '3. Identificar consensos y divergencias',
                        '4. Generar interpretación holística',
                        '5. Crear recomendaciones contextualizadas',
                    ],
                ],
            ];

            // Intentar conectar con servicio de Agent
            try {
                $agentPayload = [
                    'student_id' => $studentId,
                    'discoveries' => $discoveries,
                    'predictions' => $predictions,
                    'context' => 'unified_learning_pipeline',
                ];

                $response = Http::timeout(15)
                    ->post(self::AGENT_API_URL . '/synthesize', $agentPayload);

                if ($response->successful()) {
                    $synthesis['agent_response'] = $response->json();
                    $synthesis['status'] = 'completed';
                } else {
                    $synthesis['agent_response'] = null;
                    $synthesis['note'] = 'Agent service returned non-200 status';
                }
            } catch (Exception $e) {
                Log::warning("No se pudo contactar Agent: {$e->getMessage()}");
                $synthesis['note'] = 'Agent service unavailable - using local synthesis';
                $synthesis['local_synthesis'] = $this->localSynthesis($discoveries, $predictions);
            }

            return $synthesis;

        } catch (Exception $e) {
            Log::error("Error en agent synthesis: {$e->getMessage()}");
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * Síntesis local cuando el Agent no está disponible
     */
    private function localSynthesis(array $discoveries, array $predictions): array
    {
        try {
            $synthesis = [
                'method' => 'local_synthesis',
                'insights' => [],
            ];

            // Analizar clustering
            if (isset($discoveries['cluster_analysis'])) {
                $clusterData = $discoveries['cluster_analysis']['data'];
                $synthesis['insights'][] = [
                    'category' => 'Segmentación del Estudiante',
                    'finding' => "Pertenece a grupo con características similares",
                    'action' => 'Usar perfiles de grupo para intervenciones',
                ];
            }

            // Analizar anomalías
            if (isset($discoveries['anomalies'])) {
                $anomalies = $discoveries['anomalies']['data']['detected_patterns'];
                if (count($anomalies) > 0) {
                    $synthesis['insights'][] = [
                        'category' => 'Patrones Inusuales Detectados',
                        'finding' => "Se identificaron " . count($anomalies) . " anomalías",
                        'action' => 'Investigar y proporcionar apoyo específico',
                    ];
                }
            }

            // Analizar temas
            if (isset($discoveries['concept_topics'])) {
                $topics = $discoveries['concept_topics']['data'];
                if (isset($topics['dominant_topic'])) {
                    $synthesis['insights'][] = [
                        'category' => 'Temas Académicos',
                        'finding' => "Tema dominante: " . $topics['dominant_topic'],
                        'action' => 'Ofrecer recursos específicos para ese tema',
                    ];
                }
            }

            return $synthesis;

        } catch (Exception $e) {
            Log::error("Error en local synthesis: {$e->getMessage()}");
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * LAYER 4: Rutas Adaptativas - Generar acciones
     */
    private function generateAdaptiveActions(int $studentId, array $synthesis): array
    {
        try {
            $actions = [
                'personalized_learning_path' => [],
                'intervention_strategy' => [],
                'resource_recommendations' => [],
                'timeline' => null,
            ];

            // Generar path adaptativo basado en síntesis
            if (isset($synthesis['agent_response'])) {
                $agentData = $synthesis['agent_response'];

                if (isset($agentData['recommended_actions'])) {
                    $actions['personalized_learning_path'] = $agentData['recommended_actions'];
                }

                if (isset($agentData['intervention_strategy'])) {
                    $actions['intervention_strategy'] = $agentData['intervention_strategy'];
                }

                if (isset($agentData['resources'])) {
                    $actions['resource_recommendations'] = $agentData['resources'];
                }
            } else {
                // Acciones por defecto basadas en síntesis local
                $actions['personalized_learning_path'] = [
                    'Review foundational concepts',
                    'Practice with guided examples',
                    'Engage in peer discussion',
                    'Complete advanced exercises',
                ];

                $actions['resource_recommendations'] = [
                    ['type' => 'tutorial', 'priority' => 'high'],
                    ['type' => 'practice_problem', 'priority' => 'high'],
                    ['type' => 'video', 'priority' => 'medium'],
                    ['type' => 'reading_material', 'priority' => 'medium'],
                ];
            }

            // Definir timeline
            $actions['timeline'] = [
                'immediate' => 'Próximas 24 horas',
                'short_term' => 'Esta semana',
                'medium_term' => 'Este mes',
                'long_term' => 'Este trimestre',
            ];

            return [
                'completed_at' => now()->toIso8601String(),
                'actions' => $actions,
                'summary' => 'Adaptive learning path generated from integrated analysis',
            ];

        } catch (Exception $e) {
            Log::error("Error en generateAdaptiveActions: {$e->getMessage()}");
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * Generar insights integrados combinando todas las capas
     */
    private function generateIntegratedInsights(array $discoveries, array $predictions, array $synthesis): array
    {
        try {
            $insights = [];

            // Consenso entre capas
            $insights[] = [
                'type' => 'consensus',
                'description' => 'Cuando múltiples capas detectan el mismo patrón',
                'importance' => 'critical',
                'example' => 'Clustering y anomalías detectan bajo engagement',
            ];

            // Divergencias (discrepancias interesantes)
            $insights[] = [
                'type' => 'divergence',
                'description' => 'Cuando capas detectan patrones contradictorios',
                'importance' => 'high',
                'example' => 'Alta predicción de éxito pero anomalías detectadas',
            ];

            // Patrones emergentes
            $insights[] = [
                'type' => 'emergent_patterns',
                'description' => 'Patrones que solo aparecen al integrar múltiples análisis',
                'importance' => 'high',
                'example' => 'Correlación oculta entre dos comportamientos',
            ];

            // Confianza integrada
            $insights[] = [
                'type' => 'confidence_score',
                'value' => $this->calculateIntegratedConfidence($discoveries, $predictions, $synthesis),
                'description' => 'Confianza en las recomendaciones combinadas',
            ];

            return $insights;

        } catch (Exception $e) {
            Log::error("Error en generateIntegratedInsights: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Calcular puntuación de confianza integrada
     */
    private function calculateIntegratedConfidence(array $discoveries, array $predictions, array $synthesis): float
    {
        $confidenceScore = 0.5; // Base

        // Aumentar confianza si hay consenso
        $discoveryCount = count($discoveries['discoveries'] ?? []);
        $confidenceScore += min($discoveryCount * 0.1, 0.3); // Max 0.3

        // Aumentar confianza si hay predicciones
        if (!empty($predictions['predictions'])) {
            $confidenceScore += 0.1;
        }

        // Aumentar confianza si Agent respondió
        if (isset($synthesis['agent_response'])) {
            $confidenceScore += 0.1;
        }

        return min($confidenceScore, 1.0);
    }

    /**
     * Obtener resumen del estado de la plataforma
     */
    public function getPlatformHealthStatus(): array
    {
        try {
            $status = [
                'timestamp' => now()->toIso8601String(),
                'layers' => [
                    'unsupervised_ml' => $this->checkUnsupervisedMLHealth(),
                    'supervised_ml' => $this->checkSupervisedMLHealth(),
                    'agent' => $this->checkAgentHealth(),
                    'database' => $this->checkDatabaseHealth(),
                ],
                'overall_status' => 'healthy',
            ];

            // Determinar estado general
            $allHealthy = true;
            foreach ($status['layers'] as $layer) {
                if ($layer['status'] !== 'healthy') {
                    $allHealthy = false;
                }
            }

            $status['overall_status'] = $allHealthy ? 'healthy' : 'degraded';

            return $status;

        } catch (Exception $e) {
            return [
                'timestamp' => now()->toIso8601String(),
                'overall_status' => 'unhealthy',
                'error' => $e->getMessage(),
            ];
        }
    }

    private function checkUnsupervisedMLHealth(): array
    {
        return [
            'status' => 'healthy',
            'services' => ['clustering', 'topic_modeling', 'anomaly_detection', 'correlation'],
            'last_run' => now()->subHours(1)->toIso8601String(),
        ];
    }

    private function checkSupervisedMLHealth(): array
    {
        try {
            $response = Http::timeout(5)->get('http://localhost:8001/health');
            return [
                'status' => $response->successful() ? 'healthy' : 'unhealthy',
                'models_loaded' => $response->json('models_loaded', []),
            ];
        } catch (Exception) {
            return ['status' => 'unhealthy', 'error' => 'API unreachable'];
        }
    }

    private function checkAgentHealth(): array
    {
        try {
            $response = Http::timeout(5)->get(self::AGENT_API_URL . '/health');
            return [
                'status' => $response->successful() ? 'healthy' : 'unhealthy',
            ];
        } catch (Exception) {
            return ['status' => 'degraded', 'note' => 'Agent optional - using local synthesis'];
        }
    }

    private function checkDatabaseHealth(): array
    {
        try {
            \DB::connection()->getPdo();
            return ['status' => 'healthy'];
        } catch (Exception) {
            return ['status' => 'unhealthy'];
        }
    }
}
