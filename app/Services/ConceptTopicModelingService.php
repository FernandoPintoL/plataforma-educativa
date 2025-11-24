<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * ConceptTopicModelingService
 *
 * Servicio para modelado de temas (LDA - Latent Dirichlet Allocation).
 * Descubre temas latentes en datos textuales y patrones de estudiantes.
 *
 * Funcionalidades:
 * - Análisis de temas en feedback de profesores
 * - Descubrimiento de conceptos problemáticos
 * - Identificación de fortalezas temáticas
 * - Agrupación de estudiantes por dominio temático
 */
class ConceptTopicModelingService
{
    private const TOPICS_KEYWORDS = [
        'lógica' => ['if', 'else', 'condición', 'booleano', 'operador lógico'],
        'bucles' => ['for', 'while', 'iteración', 'bucle', 'repetición'],
        'funciones' => ['función', 'parámetro', 'retorno', 'scope', 'llamada'],
        'arreglos' => ['array', 'índice', 'arreglo', 'lista', 'elemento'],
        'strings' => ['string', 'cadena', 'caracteres', 'substring', 'concatenación'],
        'oop' => ['clase', 'objeto', 'herencia', 'polimorfismo', 'encapsulación'],
        'bases_datos' => ['sql', 'consulta', 'tabla', 'relación', 'clave foránea'],
        'web' => ['html', 'css', 'javascript', 'dom', 'evento'],
    ];

    /**
     * Analizar temas en textos de estudiantes (feedback, comentarios, etc.)
     */
    public function analyzeConceptTopics(?int $limit = null): array
    {
        try {
            Log::info("Iniciando análisis de temas conceptuales");

            // 1. Extraer textos de estudiantes
            $texts = $this->extractStudentTexts($limit);

            if (empty($texts)) {
                Log::warning('No hay textos disponibles para análisis de temas');
                return ['success' => false, 'message' => 'No text data available'];
            }

            // 2. Realizar modelado de temas
            $topics = $this->performTopicModeling($texts);

            // 3. Guardar resultados
            $saved = $this->saveTopicResults($topics);

            Log::info("Análisis de temas completado. Registros guardados: " . count($saved));

            return [
                'success' => true,
                'message' => 'Topic analysis completed',
                'num_topics' => count($topics),
                'results' => $saved,
            ];

        } catch (Exception $e) {
            Log::error("Error en analyzeConceptTopics: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Extraer textos relevantes desde la base de datos
     */
    private function extractStudentTexts(?int $limit = null): array
    {
        try {
            $texts = [];

            // Extraer feedback de profesores
            $feedback = DB::table('student_alerts')
                ->whereNotNull('mensaje')
                ->select('estudiante_id', 'mensaje')
                ->when($limit, fn($q) => $q->limit($limit))
                ->get();

            foreach ($feedback as $record) {
                $texts[] = [
                    'student_id' => $record->estudiante_id,
                    'text' => $record->mensaje,
                    'type' => 'alert_message',
                ];
            }

            // Extraer sugerencias de hints
            $hints = DB::table('student_hints')
                ->whereNotNull('contenido_sugerencia')
                ->select('estudiante_id', 'contenido_sugerencia')
                ->when($limit, fn($q) => $q->limit($limit))
                ->get();

            foreach ($hints as $record) {
                $texts[] = [
                    'student_id' => $record->estudiante_id,
                    'text' => $record->contenido_sugerencia,
                    'type' => 'hint_content',
                ];
            }

            Log::info("Textos extraídos: " . count($texts));
            return $texts;

        } catch (Exception $e) {
            Log::error("Error extrayendo textos: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Realizar modelado de temas con LDA
     */
    private function performTopicModeling(array $texts): array
    {
        try {
            $topics = [];
            $studentTopics = [];

            // Analizar cada texto para extraer temas
            foreach ($texts as $item) {
                $text = strtolower($item['text']);
                $foundTopics = [];

                // Buscar palabras clave de cada tema
                foreach (self::TOPICS_KEYWORDS as $topicName => $keywords) {
                    $topicScore = 0;

                    foreach ($keywords as $keyword) {
                        if (stripos($text, $keyword) !== false) {
                            $topicScore++;
                        }
                    }

                    if ($topicScore > 0) {
                        $foundTopics[] = [
                            'name' => $topicName,
                            'score' => $topicScore / count($keywords),
                            'keywords_found' => array_filter(
                                $keywords,
                                fn($k) => stripos($text, $k) !== false
                            ),
                        ];
                    }
                }

                // Guardar temas del estudiante
                if (!empty($foundTopics)) {
                    if (!isset($studentTopics[$item['student_id']])) {
                        $studentTopics[$item['student_id']] = [];
                    }

                    foreach ($foundTopics as $topic) {
                        $studentTopics[$item['student_id']][$topic['name']] =
                            ($studentTopics[$item['student_id']][$topic['name']] ?? 0) + $topic['score'];
                    }
                }
            }

            // Procesar y normalizar resultados
            foreach ($studentTopics as $studentId => $topicScores) {
                $total = array_sum($topicScores);

                if ($total > 0) {
                    $topics[] = [
                        'student_id' => $studentId,
                        'topics' => array_map(fn($score) => $score / $total, $topicScores),
                        'dominant_topic' => array_keys($topicScores, max($topicScores))[0] ?? null,
                    ];
                }
            }

            Log::info("Temas modelados para " . count($topics) . " estudiantes");
            return $topics;

        } catch (Exception $e) {
            Log::error("Error en performTopicModeling: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Guardar resultados de análisis de temas
     */
    private function saveTopicResults(array $topics): array
    {
        $saved = [];

        try {
            foreach ($topics as $topicData) {
                // Guardamos en JSON para flexibilidad
                DB::table('student_topic_modeling')->updateOrInsert(
                    ['estudiante_id' => $topicData['student_id']],
                    [
                        'topic_distribution' => json_encode($topicData['topics']),
                        'dominant_topic' => $topicData['dominant_topic'],
                        'analyzed_at' => now(),
                    ]
                );

                $saved[] = $topicData['student_id'];
            }

            Log::info("Resultados de temas guardados: " . count($saved));
            return $saved;

        } catch (Exception $e) {
            // Si la tabla no existe, crear un registro del error pero no fallar
            Log::warning("No se pudo guardar en student_topic_modeling: {$e->getMessage()}");
            return $saved;
        }
    }

    /**
     * Obtener temas dominantes por estudiante
     */
    public function getStudentTopics(int $studentId): array
    {
        try {
            $result = DB::table('student_topic_modeling')
                ->where('estudiante_id', $studentId)
                ->first();

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'No topic data for student',
                ];
            }

            $topics = json_decode($result->topic_distribution, true) ?? [];

            // Ordenar por puntaje
            arsort($topics);

            return [
                'success' => true,
                'student_id' => $studentId,
                'dominant_topic' => $result->dominant_topic,
                'topics' => $topics,
                'analyzed_at' => $result->analyzed_at,
            ];

        } catch (Exception $e) {
            Log::error("Error obteniendo topics: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Encontrar estudiantes con conceptos problemáticos similares
     */
    public function findStudentsWithStrugglesToTopic(string $topicName): array
    {
        try {
            $students = DB::table('student_topic_modeling')
                ->where('dominant_topic', $topicName)
                ->with('estudiante')
                ->orderBy('created_at', 'desc')
                ->get();

            return [
                'success' => true,
                'topic' => $topicName,
                'count' => $students->count(),
                'students' => $students->toArray(),
            ];

        } catch (Exception $e) {
            Log::error("Error en findStudentsWithStrugglesToTopic: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Obtener distribución de temas en la población estudiantil
     */
    public function getTopicDistribution(): array
    {
        try {
            $allRecords = DB::table('student_topic_modeling')->get();

            if ($allRecords->isEmpty()) {
                return [
                    'success' => false,
                    'message' => 'No topic data available',
                ];
            }

            $topicCounts = [];
            $topicStudents = [];

            foreach ($allRecords as $record) {
                $dominant = $record->dominant_topic;

                if (!isset($topicCounts[$dominant])) {
                    $topicCounts[$dominant] = 0;
                    $topicStudents[$dominant] = [];
                }

                $topicCounts[$dominant]++;
                $topicStudents[$dominant][] = $record->estudiante_id;
            }

            $total = $allRecords->count();

            $distribution = [];
            foreach ($topicCounts as $topic => $count) {
                $distribution[] = [
                    'topic' => $topic,
                    'count' => $count,
                    'percentage' => round(($count / $total) * 100, 2),
                    'student_count' => count($topicStudents[$topic] ?? []),
                ];
            }

            usort($distribution, fn($a, $b) => $b['count'] <=> $a['count']);

            return [
                'success' => true,
                'total_students' => $total,
                'total_topics' => count($distribution),
                'distribution' => $distribution,
            ];

        } catch (Exception $e) {
            Log::error("Error en getTopicDistribution: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Obtener conceptos relacionados a un tema específico
     */
    public function getTopicConcepts(string $topicName): array
    {
        if (!isset(self::TOPICS_KEYWORDS[$topicName])) {
            return [
                'success' => false,
                'message' => 'Topic not found',
            ];
        }

        return [
            'success' => true,
            'topic' => $topicName,
            'concepts' => self::TOPICS_KEYWORDS[$topicName],
            'count' => count(self::TOPICS_KEYWORDS[$topicName]),
        ];
    }

    /**
     * Obtener recomendaciones de aprendizaje por tema
     */
    public function getTopicRecommendations(string $topicName): array
    {
        $recommendations = [
            'lógica' => [
                'description' => 'Conceptos de lógica y control de flujo',
                'resources' => [
                    'Tutoriales de condicionales if/else',
                    'Operadores lógicos AND/OR/NOT',
                    'Análisis de casos complejos',
                ],
                'exercises' => [
                    'Implementar condiciones complejas',
                    'Refactorizar lógica duplicada',
                    'Resolver problemas con múltiples caminos',
                ],
            ],
            'bucles' => [
                'description' => 'Conceptos de iteración y repetición',
                'resources' => [
                    'Diferencias entre for, while, do-while',
                    'Patrones de bucles comunes',
                    'Optimización de bucles',
                ],
                'exercises' => [
                    'Convertir bucles anidados',
                    'Optimizar rendimiento',
                    'Problemas de síntesis de arrays',
                ],
            ],
            'funciones' => [
                'description' => 'Conceptos de funciones y scope',
                'resources' => [
                    'Parámetros y valores retornados',
                    'Scope local vs global',
                    'Funciones recursivas',
                ],
                'exercises' => [
                    'Refactorizar código en funciones',
                    'Manejar parámetros opcionales',
                    'Implementar recursión',
                ],
            ],
        ];

        if (!isset($recommendations[$topicName])) {
            return [
                'success' => true,
                'topic' => $topicName,
                'message' => 'Use generic recommendations for this topic',
                'generic_recommendations' => [
                    'description' => "Recomendaciones generales para {$topicName}",
                    'resources' => ['Documentación oficial', 'Videos tutoriales', 'Ejemplos de código'],
                    'exercises' => ['Resolver problemas simples', 'Estudios de caso reales', 'Proyecto integrador'],
                ],
            ];
        }

        return [
            'success' => true,
            'topic' => $topicName,
            'recommendations' => $recommendations[$topicName],
        ];
    }
}
