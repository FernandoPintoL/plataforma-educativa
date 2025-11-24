<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Exception;

/**
 * AgentSynthesisService
 *
 * Servicio para síntesis e interpretación de descubrimientos ML
 * usando LLM (Groq) mediante el Agent Service (puerto 8003)
 *
 * Funcionalidades:
 * - Síntesis inteligente de múltiples descubrimientos
 * - Generación de estrategias de intervención personalizadas
 * - Razonamiento transparente
 * - Recomendación de recursos adaptados
 * - Fallback a síntesis local si LLM no disponible
 */
class AgentSynthesisService
{
    private const AGENT_API_URL = 'http://localhost:8003';

    /**
     * Sintetizar descubrimientos ML usando agente IA
     */
    public function synthesizeDiscoveries(
        int $studentId,
        array $discoveries = [],
        array $predictions = [],
        string $context = 'unified_learning_pipeline'
    ): array {
        try {
            Log::info("Iniciando síntesis de agente para estudiante {$studentId}");

            $payload = [
                'student_id' => $studentId,
                'discoveries' => $discoveries,
                'predictions' => $predictions,
                'context' => $context,
            ];

            // Llamar a Agent Service
            $response = Http::timeout(15)
                ->post(self::AGENT_API_URL . '/synthesize', $payload);

            if (!$response->successful()) {
                Log::warning("Agent API retornó status {$response->status()}, usando fallback local");
                return $this->localSynthesis($discoveries, $predictions);
            }

            $result = $response->json();

            return [
                'success' => true,
                'student_id' => $studentId,
                'synthesis' => $result['synthesis'] ?? [],
                'reasoning' => $result['reasoning'] ?? [],
                'confidence' => $result['confidence'] ?? 0.5,
                'timestamp' => $result['timestamp'] ?? now()->toIso8601String(),
                'method' => 'agent_llm',
            ];

        } catch (Exception $e) {
            Log::warning("Error llamando a Agent API: {$e->getMessage()}, usando fallback");
            return $this->localSynthesis($discoveries, $predictions);
        }
    }

    /**
     * Obtener razonamiento detallado del agente
     */
    public function explainReasoning(
        int $studentId,
        array $discoveries = [],
        array $predictions = []
    ): array {
        try {
            Log::info("Solicitando razonamiento detallado para estudiante {$studentId}");

            $payload = [
                'student_id' => $studentId,
                'discoveries' => $discoveries,
                'predictions' => $predictions,
            ];

            $response = Http::timeout(15)
                ->post(self::AGENT_API_URL . '/reasoning', $payload);

            if ($response->successful()) {
                return $response->json();
            }

            return $this->localReasoning($discoveries, $predictions);

        } catch (Exception $e) {
            Log::error("Error en explainReasoning: {$e->getMessage()}");
            return $this->localReasoning($discoveries, $predictions);
        }
    }

    /**
     * Generar estrategia de intervención personalizada
     */
    public function generateInterventionStrategy(
        int $studentId,
        array $discoveries = [],
        array $predictions = []
    ): array {
        try {
            Log::info("Generando estrategia de intervención para estudiante {$studentId}");

            $payload = [
                'student_id' => $studentId,
                'discoveries' => $discoveries,
                'predictions' => $predictions,
            ];

            $response = Http::timeout(15)
                ->post(self::AGENT_API_URL . '/intervention-strategy', $payload);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'success' => true,
                    'student_id' => $studentId,
                    'strategy' => $data['strategy'] ?? $this->defaultInterventionStrategy(),
                    'actions' => $data['actions'] ?? [],
                    'resources' => $data['resources'] ?? [],
                    'confidence' => $data['confidence'] ?? 0.5,
                    'timestamp' => $data['timestamp'] ?? now()->toIso8601String(),
                ];
            }

            return $this->defaultInterventionResponse($studentId);

        } catch (Exception $e) {
            Log::warning("Error generando intervención: {$e->getMessage()}");
            return $this->defaultInterventionResponse($studentId);
        }
    }

    /**
     * Síntesis local cuando LLM no está disponible
     */
    private function localSynthesis(array $discoveries, array $predictions): array
    {
        try {
            $insights = [];
            $recommendations = [];

            // Analizar clustering
            if (isset($discoveries['cluster_analysis'])) {
                $clusterData = $discoveries['cluster_analysis']['data'] ?? [];
                $distribution = $clusterData['distribution'] ?? [];
                $clusterCount = count($distribution);

                $insights[] = "Estudiante pertenece a uno de {$clusterCount} segmentos identificados";
                $recommendations[] = "Aplicar estrategias probadas del grupo de similares";
            }

            // Analizar anomalías
            if (isset($discoveries['anomalies'])) {
                $anomalies = $discoveries['anomalies']['data']['detected_patterns'] ?? [];
                if (count($anomalies) > 0) {
                    $insights[] = "Se detectaron " . count($anomalies) . " patrones inusuales";
                    $recommendations[] = "Proporcionar apoyo especializado para patrones atípicos";
                }
            }

            // Analizar temas
            if (isset($discoveries['concept_topics'])) {
                $topics = $discoveries['concept_topics']['data'] ?? [];
                if (isset($topics['dominant_topic'])) {
                    $insights[] = "Tema académico dominante: " . $topics['dominant_topic'];
                    $recommendations[] = "Ofrecer recursos avanzados en " . $topics['dominant_topic'];
                }
            }

            // Analizar correlaciones
            if (isset($discoveries['correlations'])) {
                $corr = $discoveries['correlations']['data'] ?? [];
                if (isset($corr['correlation']) && $corr['correlation'] > 0.5) {
                    $insights[] = "Correlación fuerte entre actividad y desempeño";
                    $recommendations[] = "Mantener actividad consistente para mejorar desempeño";
                }
            }

            // Predicciones supervisadas
            if (!empty($predictions['predictions'])) {
                $insights[] = "Modelos supervisados confirman patrones identificados";
                $recommendations[] = "Usar predicciones para validar intervenciones";
            }

            return [
                'success' => true,
                'synthesis' => [
                    'method' => 'local_synthesis',
                    'key_insights' => $insights ?: ['Análisis completado exitosamente'],
                    'recommendations' => $recommendations ?: ['Revisar datos disponibles'],
                    'reasoning_process' => [
                        'Analizar resultados de clustering',
                        'Evaluar patrones anómalos detectados',
                        'Revisar distribución de temas conceptuales',
                        'Integrar predicciones de modelos supervisados',
                        'Generar recomendaciones basadas en consenso',
                    ]
                ],
                'reasoning' => [
                    'Clustering proporciona segmentación de estudiantes',
                    'Las anomalías indican comportamientos inusuales',
                    'Los temas revelan fortalezas académicas',
                    'Las correlaciones muestran relaciones importantes',
                ],
                'confidence' => 0.7,
                'timestamp' => now()->toIso8601String(),
                'method' => 'local_synthesis',
            ];

        } catch (Exception $e) {
            Log::error("Error en localSynthesis: {$e->getMessage()}");
            return [
                'success' => false,
                'message' => 'Error en síntesis local',
            ];
        }
    }

    /**
     * Razonamiento local
     */
    private function localReasoning(array $discoveries, array $predictions): array
    {
        return [
            'success' => true,
            'reasoning_steps' => [
                '1. Identificar patrones principales en clustering',
                '2. Detectar anomalías significativas',
                '3. Evaluar temas académicos dominantes',
                '4. Validar con predicciones supervisadas',
                '5. Generar conclusiones integradas',
            ],
            'key_insights' => [
                'Múltiples análisis detectan patrones consistentes',
                'Los datos muestran patrones académicos claros',
                'Las anomalías requieren atención personalizada',
            ],
            'recommendations' => [
                'Implementar intervenciones basadas en cluster',
                'Monitorear anomalías detectadas',
                'Reforzar áreas de fortaleza académica',
            ],
            'confidence' => 0.7,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * Estrategia de intervención por defecto
     */
    private function defaultInterventionStrategy(): array
    {
        return [
            'type' => 'personalized',
            'frequency' => 'weekly',
            'focus_areas' => [
                'Reforzar conceptos fundamentales',
                'Mejorar participación en actividades',
                'Reducir comportamientos anómalos',
            ],
            'success_criteria' => [
                'Mejora de 10% en métricas académicas',
                'Reducción de anomalías detectadas',
                'Mayor consistencia en participación',
                'Mejor desempeño en evaluaciones',
            ],
        ];
    }

    /**
     * Respuesta de intervención por defecto
     */
    private function defaultInterventionResponse(int $studentId): array
    {
        return [
            'success' => true,
            'student_id' => $studentId,
            'strategy' => $this->defaultInterventionStrategy(),
            'actions' => [
                'Revisar y reforzar áreas de debilidad',
                'Implementar intervenciones personalizadas',
                'Monitorear anomalías detectadas',
                'Evaluar progreso regularmente',
                'Ajustar estrategia según resultados',
            ],
            'resources' => [
                ['type' => 'tutorial', 'priority' => 'high', 'topic' => 'Conceptos fundamentales'],
                ['type' => 'practice_problem', 'priority' => 'high', 'topic' => 'Refuerzo de skills'],
                ['type' => 'peer_group', 'priority' => 'medium', 'topic' => 'Aprendizaje colaborativo'],
                ['type' => 'mentor_session', 'priority' => 'medium', 'topic' => 'Guía personalizada'],
                ['type' => 'assessment', 'priority' => 'low', 'topic' => 'Evaluación de progreso'],
            ],
            'confidence' => 0.75,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * Verificar salud del Agent Service
     */
    public function checkAgentHealth(): array
    {
        try {
            $response = Http::timeout(5)->get(self::AGENT_API_URL . '/health');

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'status' => 'healthy',
                    'llm_available' => $data['llm_available'] ?? false,
                    'agent_url' => self::AGENT_API_URL,
                ];
            }

            return [
                'status' => 'unhealthy',
                'error' => 'API retornó status ' . $response->status(),
            ];

        } catch (Exception $e) {
            Log::warning("Agent Service no accesible: {$e->getMessage()}");
            return [
                'status' => 'unavailable',
                'error' => $e->getMessage(),
                'note' => 'Sistema funcionará con síntesis local',
            ];
        }
    }

    /**
     * Obtener información del Agent Service
     */
    public function getAgentInfo(): array
    {
        try {
            $response = Http::timeout(5)->get(self::AGENT_API_URL);

            if ($response->successful()) {
                return $response->json();
            }

            return ['status' => 'unavailable'];

        } catch (Exception $e) {
            Log::warning("Error obteniendo info del agente: {$e->getMessage()}");
            return ['status' => 'unavailable'];
        }
    }
}
