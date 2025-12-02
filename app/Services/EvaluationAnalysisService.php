<?php

namespace App\Services;

use App\Models\Trabajo;
use App\Models\Evaluacion;
use App\Models\User;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * Servicio para analizar evaluaciones y generar recomendaciones
 *
 * Cuando un estudiante completa una evaluación:
 * 1. Analiza qué preguntas respondió mal
 * 2. Identifica áreas de debilidad por tema
 * 3. Llama al Agente para generar recomendaciones personalizadas
 * 4. Guarda las recomendaciones en la base de datos
 */
class EvaluationAnalysisService
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

        Log::info('EvaluationAnalysisService inicializado', [
            'agent_api_url' => $this->agentApiUrl,
        ]);
    }

    /**
     * Analizar una evaluación completada y generar recomendaciones
     *
     * @param Trabajo $trabajo El trabajo/evaluación completada
     * @param Evaluacion $evaluacion La evaluación
     * @return array Recomendaciones personalizadas
     */
    public function analyzeAndRecommend(Trabajo $trabajo, Evaluacion $evaluacion): array
    {
        try {
            Log::info('Analizando evaluación completada', [
                'trabajo_id' => $trabajo->id,
                'evaluacion_id' => $evaluacion->id,
                'estudiante_id' => $trabajo->estudiante_id,
            ]);

            // 1. Analizar respuestas y determinar áreas débiles
            $analysisData = $this->analyzeResponses($trabajo, $evaluacion);

            // 2. Obtener datos del estudiante
            $student = User::find($trabajo->estudiante_id);
            $studentData = $this->getStudentContext($student);

            // 3. Preparar payload para el agente
            $payload = [
                'student_data' => $studentData,
                'evaluation_analysis' => $analysisData,
                'evaluation' => [
                    'titulo' => $evaluacion->contenido->titulo ?? 'Evaluación',
                    'descripcion' => $evaluacion->contenido->descripcion ?? '',
                    'tipo' => $evaluacion->tipo_evaluacion,
                    'puntuacion_total' => $evaluacion->puntuacion_total,
                ]
            ];

            // 4. Llamar al agente para generar recomendaciones
            $recommendations = $this->fetchAgentRecommendations($payload);

            Log::info('Recomendaciones generadas exitosamente', [
                'trabajo_id' => $trabajo->id,
                'num_recommendations' => count($recommendations['recommendations'] ?? []),
            ]);

            return $recommendations;

        } catch (Exception $e) {
            Log::error('Error analizando evaluación', [
                'trabajo_id' => $trabajo->id,
                'error' => $e->getMessage(),
            ]);

            // Retornar recomendaciones por defecto si hay error
            return $this->getDefaultRecommendations($analysisData ?? []);
        }
    }

    /**
     * Analizar respuestas y determinar áreas de debilidad
     *
     * @param Trabajo $trabajo
     * @param Evaluacion $evaluacion
     * @return array Análisis detallado de respuestas
     */
    protected function analyzeResponses(Trabajo $trabajo, Evaluacion $evaluacion): array
    {
        $respuestas = $trabajo->respuestas;
        if (is_string($respuestas)) {
            $respuestas = json_decode($respuestas, true);
        }
        if (is_object($respuestas)) {
            $respuestas = json_decode(json_encode($respuestas), true);
        }
        $respuestas = $respuestas ?? [];

        $preguntas = $evaluacion->preguntas;
        $totalPreguntas = $preguntas->count();
        $respuestasIncorrectas = 0;
        $areasDebiles = [];
        $respuestasDetalladas = [];

        foreach ($preguntas as $pregunta) {
            $esCorrecta = false;
            $respuestaEstudiante = null;

            // Buscar la respuesta del estudiante
            foreach ($respuestas as $respuesta) {
                if (is_array($respuesta) && ($respuesta['pregunta_id'] ?? null) == $pregunta->id) {
                    $respuestaEstudiante = $respuesta['respuesta'] ?? null;
                    $esCorrecta = $respuesta['es_correcta'] ?? false;
                    break;
                }
            }

            if (!$esCorrecta && $respuestaEstudiante !== null) {
                $respuestasIncorrectas++;

                // Registrar el tema/área de la pregunta
                $tema = $pregunta->tema ?? $pregunta->categoria ?? 'General';
                if (!isset($areasDebiles[$tema])) {
                    $areasDebiles[$tema] = [
                        'nombre' => $tema,
                        'incorrectas' => 0,
                        'total' => 0,
                        'preguntas_ids' => [],
                    ];
                }
                $areasDebiles[$tema]['incorrectas']++;
                $areasDebiles[$tema]['preguntas_ids'][] = $pregunta->id;
            }

            // Contar total por tema
            $tema = $pregunta->tema ?? $pregunta->categoria ?? 'General';
            if (!isset($areasDebiles[$tema])) {
                $areasDebiles[$tema] = [
                    'nombre' => $tema,
                    'incorrectas' => 0,
                    'total' => 0,
                    'preguntas_ids' => [],
                ];
            }
            $areasDebiles[$tema]['total']++;

            $respuestasDetalladas[] = [
                'pregunta_id' => $pregunta->id,
                'pregunta_texto' => substr($pregunta->enunciado, 0, 100),
                'respuesta_estudiante' => $respuestaEstudiante,
                'respuesta_correcta' => $pregunta->respuesta_correcta,
                'es_correcta' => $esCorrecta,
                'tema' => $tema,
            ];
        }

        // Calcular porcentaje de aciertos
        $porcentajeAciertos = $totalPreguntas > 0
            ? (($totalPreguntas - $respuestasIncorrectas) / $totalPreguntas) * 100
            : 0;

        // Ordenar áreas débiles por porcentaje de errores
        uasort($areasDebiles, function($a, $b) {
            $porcentajeA = $a['total'] > 0 ? ($a['incorrectas'] / $a['total']) * 100 : 0;
            $porcentajeB = $b['total'] > 0 ? ($b['incorrectas'] / $b['total']) * 100 : 0;
            return $porcentajeB <=> $porcentajeA;
        });

        return [
            'total_preguntas' => $totalPreguntas,
            'respuestas_correctas' => $totalPreguntas - $respuestasIncorrectas,
            'respuestas_incorrectas' => $respuestasIncorrectas,
            'porcentaje_aciertos' => round($porcentajeAciertos, 2),
            'calificacion' => round($trabajo->calificacion->puntaje ?? 0, 2),
            'calificacion_maxima' => $evaluacion->puntuacion_total,
            'areas_debiles' => $areasDebiles,
            'respuestas_detalladas' => $respuestasDetalladas,
        ];
    }

    /**
     * Obtener contexto académico del estudiante
     *
     * @param User $student
     * @return array
     */
    protected function getStudentContext(User $student): array
    {
        $trabajos = $student->trabajos()->with('calificacion')->get();

        $calificaciones = $trabajos
            ->filter(fn($t) => $t->calificacion !== null)
            ->map(fn($t) => $t->calificacion->puntaje)
            ->toArray();

        $promedio = !empty($calificaciones) ? array_sum($calificaciones) / count($calificaciones) : 0;

        return [
            'student_id' => $student->id,
            'nombre' => $student->name,
            'email' => $student->email,
            'total_evaluaciones' => $trabajos->count(),
            'promedio_general' => round($promedio, 2),
            'evaluaciones_completadas' => $trabajos->filter(fn($t) => $t->estaEntregado() || $t->estaCalificado())->count(),
        ];
    }

    /**
     * Llamar al agente para generar recomendaciones personalizadas
     *
     * @param array $payload
     * @return array
     */
    protected function fetchAgentRecommendations(array $payload): array
    {
        try {
            Log::info('Llamando agente para generar recomendaciones de evaluación', [
                'agent_url' => $this->agentApiUrl,
                'areas_debiles' => count($payload['evaluation_analysis']['areas_debiles'] ?? []),
            ]);

            // Intentar primero con /api/student/{id}/analysis si es disponible
            $studentId = $payload['student_data']['student_id'] ?? null;
            $endpoint = "/api/student/{$studentId}/analysis";

            $response = $this->client->post(
                "{$this->agentApiUrl}{$endpoint}",
                [
                    'json' => [
                        'student_id' => $studentId,
                        'analysis_type' => 'evaluation_performance',
                        'evaluation_data' => $payload['evaluation_analysis'],
                        'student_context' => $payload['student_data'],
                    ],
                    'headers' => ['Content-Type' => 'application/json'],
                    'timeout' => 60,
                ]
            );

            $result = json_decode($response->getBody(), true);

            Log::info('Agente generó recomendaciones', [
                'status' => $result['status'] ?? 'unknown',
            ]);

            // Extraer recomendaciones del resultado
            return [
                'recommendations' => $result['recommendations'] ?? $result['analysis'] ?? [],
                'evaluation_analysis' => $payload['evaluation_analysis'],
            ];

        } catch (\GuzzleHttp\Exception\ConnectException $e) {
            Log::warning('No se pudo conectar al agente - usando análisis básico', [
                'error' => $e->getMessage(),
            ]);

            // Retornar análisis básico si falla la conexión
            return [
                'recommendations' => [],
                'evaluation_analysis' => $payload['evaluation_analysis'],
            ];
        } catch (\Exception $e) {
            Log::warning('Error llamando al agente - usando análisis básico', [
                'error' => $e->getMessage(),
            ]);

            // Retornar análisis básico sin recomendaciones del agente
            return [
                'recommendations' => [],
                'evaluation_analysis' => $payload['evaluation_analysis'],
            ];
        }
    }

    /**
     * Recomendaciones por defecto si falla el agente
     *
     * @param array $analysisData
     * @return array
     */
    protected function getDefaultRecommendations(array $analysisData): array
    {
        $recommendations = [
            'recomendaciones' => [],
            'areas_mejora' => [],
            'recursos_sugeridos' => [],
        ];

        // Generar recomendaciones basadas en el análisis
        foreach ($analysisData['areas_debiles'] ?? [] as $area) {
            $porcentajeError = $area['total'] > 0
                ? ($area['incorrectas'] / $area['total']) * 100
                : 0;

            if ($porcentajeError > 50) {
                $recommendations['recomendaciones'][] = [
                    'titulo' => "Refuerza el área: {$area['nombre']}",
                    'descripcion' => "Tuviste {$area['incorrectas']} errores de {$area['total']} preguntas en este tema ({$porcentajeError}%)",
                    'tipo' => 'critical',
                    'urgencia' => 'alta',
                ];

                $recommendations['areas_mejora'][] = $area['nombre'];
            }
        }

        return $recommendations;
    }
}
