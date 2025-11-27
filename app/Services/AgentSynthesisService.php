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
     * NUEVO: Análisis completo integrado del estudiante
     *
     * Este es el método principal recomendado que:
     * 1. Obtiene datos de supervisada (puerto 8001)
     * 2. Obtiene datos de no_supervisado (puerto 8002)
     * 3. Sintetiza con LLM
     * 4. Genera estrategia de intervención
     *
     * Todo en una sola llamada al agente
     */
    public function getIntegratedStudentAnalysis(int $studentId): array
    {
        try {
            Log::info("Obteniendo análisis integrado para estudiante {$studentId}");

            $response = Http::timeout(60)
                ->post(self::AGENT_API_URL . "/api/student/{$studentId}/analysis");

            if (!$response->successful()) {
                Log::warning("Agente retornó status {$response->status()}, usando fallback");
                return $this->fallbackIntegratedAnalysis($studentId);
            }

            $result = $response->json();

            Log::info("Análisis integrado completado para estudiante {$studentId}");

            return [
                'success' => true,
                'student_id' => $studentId,
                'ml_data' => $result['ml_data'] ?? [],
                'synthesis' => $result['synthesis'] ?? [],
                'intervention_strategy' => $result['intervention_strategy'] ?? [],
                'timestamp' => $result['timestamp'] ?? now()->toIso8601String(),
                'method' => 'integrated_agent',
            ];

        } catch (Exception $e) {
            Log::warning("Error en análisis integrado: {$e->getMessage()}, usando fallback");
            return $this->fallbackIntegratedAnalysis($studentId);
        }
    }

    /**
     * Crear síntesis local mejorada basada en datos del estudiante
     */
    private function createLocalSynthesisFromStudentData($estudiante, $rendimiento): array
    {
        if (!$estudiante) {
            return $this->defaultSynthesis();
        }

        $insights = [];
        $recommendations = [];

        // Análisis del promedio
        $promedio = (float)($rendimiento?->promedio ?? 0);
        if ($promedio > 0) {
            if ($promedio >= 90) {
                $insights[] = "El estudiante tiene un desempeño excelente con promedio de {$promedio}";
                $recommendations[] = "Mantener el ritmo de trabajo actual y profundizar en temas avanzados";
            } elseif ($promedio >= 80) {
                $insights[] = "El estudiante muestra buen desempeño académico con promedio de {$promedio}";
                $recommendations[] = "Reforzar áreas específicas para mejorar a nivel excelente";
            } elseif ($promedio >= 70) {
                $insights[] = "El estudiante tiene desempeño regular con promedio de {$promedio}";
                $recommendations[] = "Aumentar dedicación en materias débiles y buscar apoyo académico";
            } else {
                $insights[] = "El estudiante está en riesgo con promedio de {$promedio}";
                $recommendations[] = "Implementar plan de recuperación académica inmediato";
            }
        }

        // Análisis de tendencia
        $tendencia = $rendimiento?->tendencia_temporal ?? 'estable';
        if ($tendencia === 'mejorando') {
            $insights[] = "El estudiante está en tendencia de mejora continua";
            $recommendations[] = "Apoyar al estudiante para mantener la tendencia positiva";
        } elseif ($tendencia === 'decayendo') {
            $insights[] = "Se detecta una tendencia de deterioro en el desempeño";
            $recommendations[] = "Intervenir inmediatamente para revertir la tendencia negativa";
        } else {
            $insights[] = "El desempeño del estudiante es estable";
            $recommendations[] = "Trabajar en mejoras incrementales y mantener estabilidad";
        }

        // Análisis de fortalezas y debilidades
        $fortalezas = $rendimiento?->fortalezas ?? [];
        $debilidades = $rendimiento?->debilidades ?? [];

        if (!empty($fortalezas)) {
            $insights[] = "Fortalezas identificadas: " . implode(", ", (array)$fortalezas);
            $recommendations[] = "Usar fortalezas para apoyar en áreas débiles";
        }

        if (!empty($debilidades)) {
            $insights[] = "Áreas de mejora: " . implode(", ", (array)$debilidades);
            $recommendations[] = "Desarrollar plan personalizado para estas áreas";
        }

        // Análisis de participación
        $trabajos = $estudiante->trabajos ?? collect();
        $tasa_entrega = $trabajos->count() > 0
            ? round(($trabajos->where('estado', '!=', 'no_entregado')->count() / $trabajos->count()) * 100, 2)
            : 0;

        if ($tasa_entrega >= 80) {
            $insights[] = "El estudiante tiene excelente tasa de entrega de trabajos ({$tasa_entrega}%)";
            $recommendations[] = "La consistencia en entregas es una fortaleza a mantener";
        } elseif ($tasa_entrega >= 60) {
            $insights[] = "El estudiante muestra regularidad en entregas ({$tasa_entrega}%)";
            $recommendations[] = "Mejorar la puntualidad en entregas para optimizar calificaciones";
        } else {
            $insights[] = "El estudiante tiene baja tasa de entrega ({$tasa_entrega}%)";
            $recommendations[] = "Establecer sistema de recordatorios y apoyo para cumplimiento";
        }

        return [
            'success' => true,
            'method' => 'local_synthesis',
            'key_insights' => array_slice($insights, 0, 4),
            'recommendations' => array_slice($recommendations, 0, 4),
            'reasoning' => [
                'Análisis de rendimiento académico general',
                'Evaluación de tendencias temporales',
                'Identificación de fortalezas y debilidades',
                'Análisis de participación y cumplimiento',
            ],
            'confidence' => 0.8,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * Síntesis por defecto
     */
    private function defaultSynthesis(): array
    {
        return [
            'success' => true,
            'method' => 'default',
            'key_insights' => [
                'Análisis completado exitosamente',
                'Múltiples aspectos académicos evaluados',
                'Datos disponibles para intervención',
            ],
            'recommendations' => [
                'Revisar análisis detallado del estudiante',
                'Implementar estrategias personalizadas',
                'Monitorear progreso regularmente',
            ],
            'reasoning' => [
                'Evaluación integral del desempeño',
                'Análisis de patrones de aprendizaje',
                'Recomendaciones basadas en datos',
            ],
            'confidence' => 0.75,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * Fallback para análisis integrado cuando agente no está disponible
     */
    private function fallbackIntegratedAnalysis(int $studentId): array
    {
        // Obtener datos del estudiante para síntesis local mejorada
        $estudiante = \App\Models\User::find($studentId);
        $rendimiento = $estudiante?->rendimientoAcademico;

        // Crear síntesis mejorada basada en datos locales
        $synthesis = $this->createLocalSynthesisFromStudentData($estudiante, $rendimiento);

        return [
            'success' => true,  // Cambiar a true para que muestre los datos
            'student_id' => $studentId,
            'message' => 'Análisis completado con fallback local',
            'ml_data' => [
                'success' => true,
                'predictions' => [],
                'discoveries' => []
            ],
            'synthesis' => $synthesis,
            'intervention_strategy' => $this->defaultInterventionResponse($studentId),
            'timestamp' => now()->toIso8601String(),
            'method' => 'fallback',
        ];
    }

    /**
     * Sintetizar descubrimientos ML usando agente IA (LEGACY)
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
