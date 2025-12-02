<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * Servicio para validar la coherencia entre el título de una evaluación
 * y las preguntas generadas, asegurando que sean temáticamente relevantes.
 */
class CoherenceValidationService
{
    protected $client;
    protected $agentApiUrl;
    protected $timeout;

    public function __construct()
    {
        $this->agentApiUrl = env('ML_AGENTE_URL', 'http://localhost:8003');
        $this->timeout = env('ML_HTTP_TIMEOUT', 30);

        $this->client = new Client([
            'timeout' => $this->timeout,
            'connect_timeout' => 5,
        ]);
    }

    /**
     * Validar coherencia de preguntas con el título de la evaluación
     *
     * @param string $titulo Título de la evaluación
     * @param array $preguntas Array de preguntas con 'enunciado' y 'id'
     * @return array Array con scores de coherencia por pregunta
     */
    public function validateQuestions(string $titulo, array $preguntas): array
    {
        try {
            Log::info('Validando coherencia de preguntas', [
                'titulo' => $titulo,
                'cantidad_preguntas' => count($preguntas),
            ]);

            $validationResults = [];

            foreach ($preguntas as $idx => $pregunta) {
                try {
                    $coherenceScore = $this->analyzeCoherence($titulo, $pregunta['enunciado'] ?? '');

                    $validationResults[] = [
                        'pregunta_id' => $pregunta['id'] ?? $idx,
                        'enunciado' => $pregunta['enunciado'] ?? '',
                        'coherence_score' => $coherenceScore,
                        'is_coherent' => $coherenceScore >= 0.6,
                        'feedback' => $this->getCoherenceFeedback($coherenceScore),
                    ];
                } catch (Exception $e) {
                    Log::warning('Error validando pregunta individual', [
                        'index' => $idx,
                        'error' => $e->getMessage(),
                    ]);

                    // Fallback si hay error en una pregunta específica
                    $validationResults[] = [
                        'pregunta_id' => $pregunta['id'] ?? $idx,
                        'enunciado' => $pregunta['enunciado'] ?? '',
                        'coherence_score' => 0.5,
                        'is_coherent' => true, // Permitir por defecto
                        'feedback' => 'No se pudo validar',
                    ];
                }
            }

            Log::info('Validación de coherencia completada', [
                'total_preguntas' => count($validationResults),
                'coherentes' => count(array_filter($validationResults, fn($r) => $r['is_coherent'])),
            ]);

            return [
                'success' => true,
                'titulo' => $titulo,
                'validaciones' => $validationResults,
                'resumen' => $this->generateResumen($validationResults),
            ];

        } catch (Exception $e) {
            Log::error('Error validando coherencia de preguntas', [
                'error' => $e->getMessage(),
                'titulo' => $titulo,
            ]);

            // Retornar validación neutral si hay error
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'validaciones' => array_map(fn($p) => [
                    'pregunta_id' => $p['id'] ?? 0,
                    'enunciado' => $p['enunciado'] ?? '',
                    'coherence_score' => 0.5,
                    'is_coherent' => true,
                    'feedback' => 'Validación no disponible',
                ], $preguntas),
            ];
        }
    }

    /**
     * Analizar coherencia entre un título y un enunciado de pregunta
     * Usa similitud semántica basada en palabras clave
     *
     * @param string $titulo
     * @param string $enunciado
     * @return float Score entre 0 y 1
     */
    private function analyzeCoherence(string $titulo, string $enunciado): float
    {
        // Implementar validación basada en palabras clave primero (rápido)
        $keywordScore = $this->calculateKeywordSimilarity($titulo, $enunciado);

        // Si hay Agent Service disponible, intentar análisis semántico
        try {
            $semanticScore = $this->getSemanticSimilarity($titulo, $enunciado);
            // Promediar los dos scores
            return ($keywordScore + $semanticScore) / 2;
        } catch (Exception $e) {
            Log::debug('Agent Service no disponible para análisis semántico', [
                'error' => $e->getMessage(),
            ]);
            // Fallback solo a keyword score
            return $keywordScore;
        }
    }

    /**
     * Calcular similitud basada en palabras clave compartidas
     *
     * @param string $titulo
     * @param string $enunciado
     * @return float Score entre 0 y 1
     */
    private function calculateKeywordSimilarity(string $titulo, string $enunciado): float
    {
        // Normalizar y extraer palabras clave (palabras > 3 caracteres)
        $cleanTitle = strtolower(preg_replace('/[^a-záéíóú\s]/', '', $titulo));
        $cleanQuestion = strtolower(preg_replace('/[^a-záéíóú\s]/', '', $enunciado));

        $titleWords = array_filter(explode(' ', $cleanTitle), fn($w) => strlen($w) > 3);
        $questionWords = array_filter(explode(' ', $cleanQuestion), fn($w) => strlen($w) > 3);

        if (empty($titleWords) || empty($questionWords)) {
            return 0.5; // Score neutral si no hay palabras suficientes
        }

        // Palabras comunes entre título y enunciado
        $commonWords = array_intersect($titleWords, $questionWords);

        // Score basado en porcentaje de palabras compartidas
        $maxWords = max(count($titleWords), count($questionWords));
        return count($commonWords) / $maxWords;
    }

    /**
     * Obtener análisis semántico del Agent Service
     *
     * @param string $titulo
     * @param string $enunciado
     * @return float Score entre 0 y 1
     */
    private function getSemanticSimilarity(string $titulo, string $enunciado): float
    {
        try {
            $response = $this->client->post(
                $this->agentApiUrl . '/api/analysis/semantic-similarity',
                [
                    'json' => [
                        'text1' => $titulo,
                        'text2' => $enunciado,
                    ],
                    'connect_timeout' => 5,
                    'timeout' => 10,
                ]
            );

            if ($response->getStatusCode() === 200) {
                $data = json_decode($response->getBody(), true);
                return $data['similarity'] ?? 0.5;
            }

            return 0.5;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Generar feedback textual basado en el score
     *
     * @param float $score
     * @return string
     */
    private function getCoherenceFeedback(float $score): string
    {
        if ($score >= 0.8) {
            return 'Muy coherente con el título';
        } elseif ($score >= 0.6) {
            return 'Coherente con el título';
        } elseif ($score >= 0.4) {
            return 'Parcialmente coherente';
        } else {
            return 'Podría no ser coherente con el título';
        }
    }

    /**
     * Generar resumen de la validación
     *
     * @param array $validaciones
     * @return array
     */
    private function generateResumen(array $validaciones): array
    {
        $coherentes = array_filter($validaciones, fn($v) => $v['is_coherent']);
        $totalScore = array_reduce(
            $validaciones,
            fn($carry, $v) => $carry + $v['coherence_score'],
            0
        );

        return [
            'total_preguntas' => count($validaciones),
            'preguntas_coherentes' => count($coherentes),
            'porcentaje_coherencia' => count($validaciones) > 0
                ? round((count($coherentes) / count($validaciones)) * 100, 1)
                : 0,
            'score_promedio' => count($validaciones) > 0
                ? round($totalScore / count($validaciones), 2)
                : 0,
        ];
    }
}
