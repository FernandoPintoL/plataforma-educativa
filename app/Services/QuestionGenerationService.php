<?php

namespace App\Services;

use App\Models\Curso;
use App\Models\Evaluacion;
use App\Models\QuestionBank;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class QuestionGenerationService
{
    private $questionBankService;
    private $mlPredictionService;
    private $clusteringService;

    // Agent Service URLs (configurable)
    private $agentServiceUrl = 'http://localhost:8003';
    private $mlSupervisadoUrl = 'http://localhost:8001';
    private $mlNoSupervisadoUrl = 'http://localhost:8002';

    public function __construct(
        QuestionBankService $questionBankService,
        MLPredictionService $mlPredictionService,
        ClusteringService $clusteringService
    ) {
        $this->questionBankService = $questionBankService;
        $this->mlPredictionService = $mlPredictionService;
        $this->clusteringService = $clusteringService;

        // Read from config
        $this->agentServiceUrl = config('services.agent.url', $this->agentServiceUrl);
        $this->mlSupervisadoUrl = config('services.ml_supervisado.url', $this->mlSupervisadoUrl);
        $this->mlNoSupervisadoUrl = config('services.ml_no_supervisado.url', $this->mlNoSupervisadoUrl);
    }

    /**
     * Generar preguntas inteligentes con pipeline completo de 6 pasos
     *
     * @param array $params {
     *     curso_id: int,
     *     titulo: string,
     *     tipo_evaluacion: string,
     *     cantidad_preguntas: int,
     *     dificultad_deseada: string,
     *     contexto?: string,
     *     user_id: int
     * }
     */
    public function generateIntelligentQuestions(array $params): array
    {
        Log::info('Iniciando generación inteligente de preguntas', ['params' => $params]);

        try {
            // PASO 1: Análisis pre-generación
            $context = $this->buildGenerationContext($params);
            Log::info('Contexto de generación construido', ['context_keys' => array_keys($context)]);

            // PASO 2: Generar preguntas con Groq
            $rawQuestions = $this->generateWithGroq($context);
            Log::info('Preguntas generadas con Groq', ['count' => count($rawQuestions)]);

            // PASO 3: Enriquecer preguntas
            $enrichedQuestions = $this->enrichQuestions($rawQuestions, $context);
            Log::info('Preguntas enriquecidas', ['count' => count($enrichedQuestions)]);

            // PASO 4: Validar calidad
            $validQuestions = $this->validateQuestions($enrichedQuestions);
            Log::info('Preguntas validadas', ['count' => count($validQuestions)]);

            // PASO 5: Verificar duplicados
            $finalQuestions = $this->deduplicateQuestions($validQuestions, $context);
            Log::info('Preguntas sin duplicados', ['count' => count($finalQuestions)]);

            // PASO 6: Persistir y retornar
            return $this->persistAndReturn($finalQuestions, $context);
        } catch (\Exception $e) {
            Log::error('Error en generación de preguntas', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * PASO 1: Construir contexto de generación con información pedagógica
     */
    private function buildGenerationContext(array $params): array
    {
        $curso = Curso::findOrFail($params['curso_id']);

        // Obtener información del curso
        $courseInfo = [
            'curso_id' => $curso->id,
            'nombre_curso' => $curso->nombre,
            'nivel' => $curso->nivel ?? 'General',
        ];

        // Obtener temas del curso (del caché o del servicio de clustering)
        $topics = $this->getCourseTopic($curso->id);

        // Obtener análisis de clusters de estudiantes
        $clusterInfo = $this->analyzeStudentClusters($curso->id);

        // Obtener rendimiento promedio del curso
        $performanceInfo = $this->getCoursePerformanceStats($curso->id);

        return array_merge($courseInfo, [
            'titulo' => $params['titulo'],
            'tipo_evaluacion' => $params['tipo_evaluacion'],
            'cantidad_preguntas' => $params['cantidad_preguntas'],
            'dificultad_deseada' => $params['dificultad_deseada'],
            'contexto_adicional' => $params['contexto'] ?? '',
            'user_id' => $params['user_id'],
            'topics' => $topics,
            'cluster_info' => $clusterInfo,
            'performance' => $performanceInfo,
        ]);
    }

    /**
     * PASO 2: Generar preguntas base con Groq
     */
    private function generateWithGroq(array $context): array
    {
        try {
            $response = Http::timeout(30)->post(
                "{$this->agentServiceUrl}/api/generation/questions",
                [
                    'titulo' => $context['titulo'],
                    'tipo_evaluacion' => $context['tipo_evaluacion'],
                    'curso_id' => $context['curso_id'],
                    'cantidad_preguntas' => $context['cantidad_preguntas'],
                    'dificultad_deseada' => $context['dificultad_deseada'],
                    'contexto' => $this->buildRichContext($context),
                ]
            );

            if ($response->failed()) {
                throw new \Exception("Agent Service error: " . $response->body());
            }

            $data = $response->json();
            return $data['preguntas'] ?? [];
        } catch (\Exception $e) {
            Log::error('Error generando con Groq', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * PASO 3: Enriquecer preguntas (añadir explicaciones, referencias, distractores)
     */
    private function enrichQuestions(array $rawQuestions, array $context): array
    {
        $enrichedQuestions = [];

        foreach ($rawQuestions as $question) {
            try {
                $enriched = $question;

                // Generar distractores inteligentes si no existen
                if (empty($question['opciones']) || count($question['opciones']) <= 1) {
                    $distractores = $this->generateIntelligentDistractors($question, $context);
                    $enriched['opciones'] = array_merge([$question['respuesta_correcta']], $distractores);
                }

                // Calibrar dificultad con ML
                if (!isset($enriched['dificultad_estimada'])) {
                    $enriched['dificultad_estimada'] = $this->calibrateDifficultyWithML($enriched, $context);
                }

                $enrichedQuestions[] = $enriched;
            } catch (\Exception $e) {
                Log::warning("Error enriqueciendo pregunta: {$e->getMessage()}");
                $enrichedQuestions[] = $question;
            }
        }

        return $enrichedQuestions;
    }

    /**
     * PASO 4: Validar calidad de preguntas
     */
    private function validateQuestions(array $questions): array
    {
        return collect($questions)
            ->filter(function ($q) {
                // Enunciado válido
                if (empty($q['enunciado']) || strlen(trim($q['enunciado'])) < 10) {
                    return false;
                }

                // Respuesta correcta válida
                if (empty($q['respuesta_correcta'])) {
                    return false;
                }

                // Opciones válidas (para múltiple)
                if ($q['tipo'] === 'opcion_multiple' && (empty($q['opciones']) || count($q['opciones']) < 2)) {
                    return false;
                }

                // Dificultad en rango válido
                if (isset($q['dificultad_estimada'])) {
                    if ($q['dificultad_estimada'] < 0 || $q['dificultad_estimada'] > 1) {
                        return false;
                    }
                }

                // Nivel Bloom válido
                $validBloomLevels = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
                if (isset($q['nivel_bloom']) && !in_array($q['nivel_bloom'], $validBloomLevels)) {
                    return false;
                }

                return true;
            })
            ->values()
            ->toArray();
    }

    /**
     * PASO 5: Verificar duplicados
     */
    private function deduplicateQuestions(array $questions, array $context): array
    {
        $finalQuestions = [];

        foreach ($questions as $question) {
            // Buscar preguntas similares en el banco
            $similarQuestions = $this->questionBankService->findSimilarQuestions(
                $question['enunciado'],
                $context['curso_id'],
                0.85
            );

            if ($similarQuestions->isEmpty()) {
                $finalQuestions[] = $question;
            } else {
                // Pregunta duplicada encontrada
                Log::info("Pregunta duplicada detectada, usando existente");
                $finalQuestions[] = array_merge($question, [
                    'es_duplicada' => true,
                    'pregunta_similar_id' => $similarQuestions->first()['question']->id ?? null,
                ]);
            }
        }

        return $finalQuestions;
    }

    /**
     * PASO 6: Persistir y retornar preguntas
     */
    private function persistAndReturn(array $questions, array $context): array
    {
        $savedQuestions = [];

        foreach ($questions as $question) {
            // No guardar duplicados
            if ($question['es_duplicada'] ?? false) {
                $savedQuestions[] = $question;
                continue;
            }

            try {
                $questionData = [
                    'curso_id' => $context['curso_id'],
                    'tipo' => $question['tipo'],
                    'enunciado' => $question['enunciado'],
                    'opciones' => $question['opciones'] ?? null,
                    'respuesta_correcta' => $question['respuesta_correcta'],
                    'explicacion' => $question['explicacion_detallada'] ?? null,
                    'nivel_bloom' => $question['nivel_bloom'] ?? 'remember',
                    'dificultad_estimada' => $question['dificultad_estimada'] ?? 0.5,
                    'puntos' => $question['puntos'] ?? 10,
                    'conceptos_clave' => $question['conceptos_clave'] ?? [],
                    'notas_profesor' => $question['notas_profesor'] ?? null,
                    'fuente' => 'groq',
                    'creado_por' => $context['user_id'],
                    'validada' => true,
                    'metadata_generacion' => [
                        'titulo_evaluacion' => $context['titulo'],
                        'tipo_evaluacion' => $context['tipo_evaluacion'],
                        'dificultad_deseada' => $context['dificultad_deseada'],
                        'timestamp' => now(),
                    ],
                ];

                $saved = $this->questionBankService->saveQuestion($questionData);
                $savedQuestions[] = $saved->toArray();

                Log::info("Pregunta guardada", ['question_id' => $saved->id]);
            } catch (\Exception $e) {
                Log::error("Error guardando pregunta: {$e->getMessage()}");
            }
        }

        return $savedQuestions;
    }

    /**
     * Generar distractores inteligentes basados en errores comunes
     */
    public function generateIntelligentDistractors(array $question, array $context = []): array
    {
        try {
            $response = Http::timeout(20)->post(
                "{$this->agentServiceUrl}/api/generation/distractors",
                [
                    'enunciado' => $question['enunciado'],
                    'respuesta_correcta' => $question['respuesta_correcta'],
                    'tipo' => $question['tipo'],
                    'nivel_bloom' => $question['nivel_bloom'] ?? null,
                ]
            );

            if ($response->successful()) {
                $data = $response->json();
                $distractores = $data['distractores'] ?? [];
                return collect($distractores)->pluck('opcion')->toArray();
            }

            return [];
        } catch (\Exception $e) {
            Log::warning("Error generando distractores: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Calibrar dificultad usando ML Supervisado
     */
    public function calibrateDifficultyWithML(array $question, array $context = []): float
    {
        try {
            $response = Http::timeout(15)->post(
                "{$this->mlSupervisadoUrl}/predict/question-difficulty",
                [
                    'enunciado' => $question['enunciado'],
                    'tipo' => $question['tipo'],
                    'nivel_bloom' => $question['nivel_bloom'] ?? 'remember',
                    'curso_id' => $context['curso_id'] ?? null,
                ]
            );

            if ($response->successful()) {
                $data = $response->json();
                return (float)($data['dificultad_predicha'] ?? 0.5);
            }

            return $question['dificultad_estimada'] ?? 0.5;
        } catch (\Exception $e) {
            Log::warning("Error calibrando dificultad: {$e->getMessage()}");
            return $question['dificultad_estimada'] ?? 0.5;
        }
    }

    /**
     * Obtener temas del curso usando ML No Supervisado
     */
    private function getCourseTopic(int $cursoId): array
    {
        return Cache::remember("course_topics_{$cursoId}", 86400, function () use ($cursoId) {
            try {
                $response = Http::timeout(20)->post(
                    "{$this->mlNoSupervisadoUrl}/topics/extract",
                    ['curso_id' => $cursoId]
                );

                if ($response->successful()) {
                    return $response->json()['topics'] ?? [];
                }
            } catch (\Exception $e) {
                Log::warning("Error obteniendo temas: {$e->getMessage()}");
            }

            return [];
        });
    }

    /**
     * Analizar clusters de estudiantes del curso
     */
    private function analyzeStudentClusters(int $cursoId): array
    {
        return Cache::remember("course_clusters_{$cursoId}", 21600, function () use ($cursoId) {
            try {
                $response = Http::timeout(20)->post(
                    "{$this->mlNoSupervisadoUrl}/cluster/analysis",
                    ['curso_id' => $cursoId]
                );

                if ($response->successful()) {
                    return $response->json()['clusters'] ?? [];
                }
            } catch (\Exception $e) {
                Log::warning("Error analizando clusters: {$e->getMessage()}");
            }

            return [];
        });
    }

    /**
     * Obtener estadísticas de desempeño del curso
     */
    private function getCoursePerformanceStats(int $cursoId): array
    {
        // Evaluaciones vinculadas a contenidos del curso
        $evaluaciones = Evaluacion::whereHas('contenido', function ($query) use ($cursoId) {
            $query->where('curso_id', $cursoId);
        })->get();

        if ($evaluaciones->isEmpty()) {
            return ['promedio_desempeño' => 70, 'total_evaluaciones' => 0];
        }

        $promedios = [];
        foreach ($evaluaciones as $eval) {
            $calificaciones = $eval->calificaciones ?? [];
            if (!empty($calificaciones)) {
                $promedios[] = collect($calificaciones)->avg('calificacion') ?? 0;
            }
        }

        return [
            'promedio_desempeño' => count($promedios) > 0 ? array_sum($promedios) / count($promedios) : 70,
            'total_evaluaciones' => $evaluaciones->count(),
        ];
    }

    /**
     * Construir contexto enriquecido para el prompt de Groq
     */
    private function buildRichContext(array $context): string
    {
        $richContext = "Contexto pedagógico:\n";
        $richContext .= "- Curso: {$context['nombre_curso']} (Nivel: {$context['nivel']})\n";

        if (!empty($context['topics'])) {
            $richContext .= "- Temas relevantes: " . implode(', ', $context['topics']) . "\n";
        }

        if (!empty($context['performance'])) {
            $richContext .= "- Desempeño promedio del curso: {$context['performance']['promedio_desempeño']}%\n";
        }

        return $richContext;
    }
}
