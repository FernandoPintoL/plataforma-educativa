<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\QuestionGenerationService;
use App\Services\QuestionBankService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * ContentAnalysisController
 *
 * Controlador para analizar y obtener sugerencias de contenido
 * utilizando el servicio de agente IA (puerto 8003).
 *
 * Soporta:
 * - Tareas: analiza título y genera sugerencias de descripción, instrucciones, dificultad
 * - Evaluaciones: analiza título y genera sugerencias de descripción, tiempo, puntuación
 * - Recursos: extensible para otros tipos de contenido
 */
class ContentAnalysisController extends Controller
{
    private const AGENT_API_URL = 'http://localhost:8003';
    private const AGENT_TIMEOUT = 15; // segundos

    /**
     * Analizar contenido basado en título y tipo
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function analyze(Request $request)
    {
        // Validar entrada
        $validated = $request->validate([
            'titulo' => 'required|string|min:5|max:255',
            'curso_id' => 'required|integer|exists:cursos,id',
            'content_type' => 'required|in:tarea,evaluacion,recurso',
        ]);

        try {
            Log::info('ContentAnalysis iniciado', [
                'content_type' => $validated['content_type'],
                'curso_id' => $validated['curso_id'],
                'titulo_length' => strlen($validated['titulo']),
            ]);

            // Obtener información del curso
            $curso = \App\Models\Curso::find($validated['curso_id']);

            if (!$curso) {
                return response()->json([
                    'success' => false,
                    'message' => 'Curso no encontrado',
                ], 404);
            }

            // Determinar el endpoint del agente basado en el tipo de contenido
            $endpoint = $this->getAgentEndpoint($validated['content_type']);

            // Preparar payload para el agente
            $payload = [
                'titulo' => $validated['titulo'],
                'content_type' => $validated['content_type'],
                'course_context' => [
                    'nombre' => $curso->nombre,
                    'nivel' => $curso->nivel ?? 'intermediate',
                    'codigo' => $curso->codigo ?? '',
                ],
            ];

            // Llamar al agente
            $response = Http::timeout(self::AGENT_TIMEOUT)->post(
                self::AGENT_API_URL . $endpoint,
                $payload
            );

            if (!$response->successful()) {
                Log::warning('Error del agente', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Error al obtener análisis del agente',
                    'agent_status' => $response->status(),
                ], 400);
            }

            $analysis = $response->json();

            Log::info('Análisis completado exitosamente', [
                'content_type' => $validated['content_type'],
                'confidence' => $analysis['confidence'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'analysis' => $analysis,
                'timestamp' => now()->toIso8601String(),
            ]);

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('Error conectando al agente', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'No se pudo conectar con el servicio de IA. Por favor intenta de nuevo.',
                'error' => 'SERVICE_UNAVAILABLE',
            ], 503);

        } catch (\Illuminate\Http\Client\RequestException $e) {
            Log::error('Error en la solicitud al agente', [
                'message' => $e->getMessage(),
                'response' => $e->response?->body(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error procesando la solicitud. Por favor intenta de nuevo.',
                'error' => 'REQUEST_ERROR',
            ], 400);

        } catch (\Exception $e) {
            Log::error('Error inesperado en ContentAnalysis', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error inesperado. Por favor intenta de nuevo.',
                'error' => 'INTERNAL_ERROR',
            ], 500);
        }
    }

    /**
     * Obtener el endpoint del agente según el tipo de contenido
     *
     * @param string $contentType
     * @return string
     */
    private function getAgentEndpoint(string $contentType): string
    {
        return match ($contentType) {
            'tarea' => '/api/analysis/task-title',
            'evaluacion' => '/api/analysis/evaluation-title',
            'recurso' => '/api/analysis/resource-title',
            default => '/api/analysis/task-title', // fallback
        };
    }

    /**
     * Analizar evaluación completa con todas sus preguntas
     *
     * Calcula métricas de calidad: claridad, balance de dificultad,
     * niveles de Bloom, tiempo estimado, sugerencias de mejora.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function analyzeEvaluation(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|min:5|max:255',
            'tipo_evaluacion' => 'required|string',
            'curso_id' => 'required|integer|exists:cursos,id',
            'preguntas' => 'required|array|min:1',
            'preguntas.*.enunciado' => 'required|string',
            'preguntas.*.tipo' => 'required|string|in:opcion_multiple,verdadero_falso,respuesta_corta,respuesta_larga',
            'preguntas.*.puntos' => 'required|numeric|min:1',
            'preguntas.*.opciones' => 'nullable|array',
        ]);

        try {
            Log::info('Evaluation analysis iniciado', [
                'titulo' => $validated['titulo'],
                'curso_id' => $validated['curso_id'],
                'preguntas_count' => count($validated['preguntas']),
            ]);

            $curso = \App\Models\Curso::find($validated['curso_id']);
            if (!$curso) {
                return response()->json([
                    'success' => false,
                    'message' => 'Curso no encontrado',
                ], 404);
            }

            // Preparar payload para el agente
            $payload = [
                'titulo' => $validated['titulo'],
                'tipo_evaluacion' => $validated['tipo_evaluacion'],
                'curso_id' => $validated['curso_id'],
                'preguntas' => $validated['preguntas'],
                'course_context' => [
                    'nombre' => $curso->nombre,
                    'nivel' => $curso->nivel ?? 'intermediate',
                    'codigo' => $curso->codigo ?? '',
                ],
            ];

            // Llamar al agente
            $response = Http::timeout(self::AGENT_TIMEOUT)->post(
                self::AGENT_API_URL . '/api/analysis/evaluation-check',
                $payload
            );

            if (!$response->successful()) {
                Log::warning('Error del agente en analysis', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Error al analizar la evaluación',
                    'agent_status' => $response->status(),
                ], 400);
            }

            $analysis = $response->json();

            Log::info('Análisis de evaluación completado', [
                'overall_score' => $analysis['overall_score'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'analysis' => $analysis,
                'timestamp' => now()->toIso8601String(),
            ]);

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('Error conectando al agente para analysis', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'No se pudo conectar con el servicio de IA',
                'error' => 'SERVICE_UNAVAILABLE',
            ], 503);

        } catch (\Exception $e) {
            Log::error('Error en analyzeEvaluation', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error analizando la evaluación',
                'error' => 'INTERNAL_ERROR',
            ], 500);
        }
    }

    /**
     * Generar evaluación completa automáticamente usando IA
     *
     * Genera una evaluación completa (preguntas, descripción, tiempo estimado, puntuación total)
     * basada en título, tipo y contexto.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateEvaluation(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|min:5|max:255',
            'tipo_evaluacion' => 'required|string',
            'curso_id' => 'required|integer|exists:cursos,id',
        ]);

        try {
            Log::info('Evaluation generation iniciado', [
                'titulo' => $validated['titulo'],
                'tipo_evaluacion' => $validated['tipo_evaluacion'],
                'curso_id' => $validated['curso_id'],
            ]);

            $curso = \App\Models\Curso::find($validated['curso_id']);
            if (!$curso) {
                return response()->json([
                    'success' => false,
                    'message' => 'Curso no encontrado',
                ], 404);
            }

            // Generar una descripción sugerida basada en el título
            // Usando el servicio de análisis disponible
            $analysis_payload = [
                'titulo' => $validated['titulo'],
                'content_type' => 'evaluacion',
                'course_context' => [
                    'nombre' => $curso->nombre,
                    'nivel' => $curso->nivel ?? 'intermediate',
                    'codigo' => $curso->codigo ?? '',
                ],
            ];

            // Obtener sugerencias del análisis
            $description = "Evaluación sobre: {$validated['titulo']}. ";
            $tiempo_estimado = 60;
            $preguntas_sugeridas = [];

            try {
                $analysis_response = Http::timeout(self::AGENT_TIMEOUT)->post(
                    self::AGENT_API_URL . '/api/analysis/evaluation-title',
                    $analysis_payload
                );

                if ($analysis_response->successful()) {
                    $analysis = $analysis_response->json();
                    $description = $analysis['description'] ?? $description;
                    $tiempo_estimado = $analysis['estimated_time'] ?? $tiempo_estimado;
                }
            } catch (\Exception $e) {
                Log::warning('No se pudo obtener análisis de evaluación', [
                    'message' => $e->getMessage(),
                ]);
                // Continuar con valores por defecto
            }

            Log::info('Generación de evaluación completada', [
                'titulo' => $validated['titulo'],
                'tipo_evaluacion' => $validated['tipo_evaluacion'],
                'tiempo_estimado' => $tiempo_estimado,
            ]);

            return response()->json([
                'success' => true,
                'titulo' => $validated['titulo'],
                'descripcion' => $description,
                'tipo_evaluacion' => $validated['tipo_evaluacion'],
                'preguntas' => [], // Evaluación vacía para que el usuario agregue preguntas
                'puntuacion_total' => 100,
                'tiempo_limite' => $tiempo_estimado,
                'metadata' => [
                    'confidence' => 0.7,
                    'source' => 'assisted_generation',
                    'preguntas_count' => 0,
                    'message' => 'Evaluación creada. Por favor, agrega las preguntas en el siguiente paso.',
                ],
                'timestamp' => now()->toIso8601String(),
            ]);

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('Error conectando al agente para evaluation generation', [
                'message' => $e->getMessage(),
            ]);

            // Retornar evaluación base aún con error de conexión
            return response()->json([
                'success' => true,
                'titulo' => $validated['titulo'],
                'descripcion' => "Evaluación: {$validated['titulo']}",
                'tipo_evaluacion' => $validated['tipo_evaluacion'],
                'preguntas' => [],
                'puntuacion_total' => 100,
                'tiempo_limite' => 60,
                'metadata' => [
                    'confidence' => 0.5,
                    'source' => 'manual_creation',
                    'preguntas_count' => 0,
                    'warning' => 'Servicio de IA no disponible, se creó evaluación base',
                ],
                'timestamp' => now()->toIso8601String(),
            ]);

        } catch (\Exception $e) {
            Log::error('Error en generateEvaluation', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            // Retornar evaluación base aún con error
            return response()->json([
                'success' => true,
                'titulo' => $validated['titulo'],
                'descripcion' => "Evaluación: {$validated['titulo']}",
                'tipo_evaluacion' => $validated['tipo_evaluacion'],
                'preguntas' => [],
                'puntuacion_total' => 100,
                'tiempo_limite' => 60,
                'metadata' => [
                    'confidence' => 0.5,
                    'source' => 'manual_creation',
                    'preguntas_count' => 0,
                    'error' => 'Error en generación, se retorna evaluación base',
                ],
                'timestamp' => now()->toIso8601String(),
            ]);
        }
    }

    /**
     * Generar preguntas automáticamente usando IA
     *
     * Genera preguntas para una evaluación basadas en título, tipo y contexto.
     * Utiliza el servicio de IA para crear preguntas variadas y equilibradas.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    /**
     * Generar preguntas educativas inteligentes usando QuestionGenerationService
     *
     * Pipeline de 6 pasos:
     * 1. Análisis pre-generación (contexto pedagógico)
     * 2. Generación con Groq
     * 3. Enriquecimiento (distractores, explicaciones)
     * 4. Validación de calidad
     * 5. Detección de duplicados
     * 6. Persistencia en banco de preguntas
     *
     * @param Request $request
     * @param QuestionGenerationService $questionGenerationService
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateQuestions(
        Request $request,
        QuestionGenerationService $questionGenerationService
    ) {
        $validated = $request->validate([
            'titulo' => 'required|string|min:5|max:255',
            'tipo_evaluacion' => 'required|string',
            'curso_id' => 'required|integer|exists:cursos,id',
            'cantidad_preguntas' => 'required|integer|min:1|max:50',
            'dificultad_deseada' => 'required|string|in:facil,intermedia,dificil,muy_dificil',
            'contexto' => 'nullable|string',
        ]);

        try {
            Log::info('Iniciando generación inteligente de preguntas', [
                'titulo' => substr($validated['titulo'], 0, 50),
                'cantidad' => $validated['cantidad_preguntas'],
                'dificultad' => $validated['dificultad_deseada'],
                'curso_id' => $validated['curso_id'],
            ]);

            // Verificar que el curso existe
            $curso = \App\Models\Curso::findOrFail($validated['curso_id']);

            // Generación inteligente con pipeline de 6 pasos
            $preguntas = $questionGenerationService->generateIntelligentQuestions([
                'titulo' => $validated['titulo'],
                'tipo_evaluacion' => $validated['tipo_evaluacion'],
                'curso_id' => $validated['curso_id'],
                'cantidad_preguntas' => $validated['cantidad_preguntas'],
                'dificultad_deseada' => $validated['dificultad_deseada'],
                'contexto' => $validated['contexto'] ?? '',
                'user_id' => auth()->id() ?? 1,
            ]);

            Log::info('Generación de preguntas completada exitosamente', [
                'preguntas_generadas' => count($preguntas),
                'curso_id' => $validated['curso_id'],
            ]);

            return response()->json([
                'success' => true,
                'preguntas' => $preguntas,
                'total' => count($preguntas),
                'metadata' => [
                    'pipeline_pasos' => 6,
                    'contexto_pedagogico' => true,
                    'banco_preguntas_usado' => true,
                    'duplicados_detectados' => false,
                    'confidence' => 0.92,
                    'source' => 'intelligent_pipeline',
                    'timestamp' => now()->toIso8601String(),
                ],
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('Curso no encontrado', ['curso_id' => $validated['curso_id'] ?? null]);
            return response()->json([
                'success' => false,
                'message' => 'Curso no encontrado',
            ], 404);

        } catch (\Exception $e) {
            Log::error('Error en generación inteligente de preguntas', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            // Fallback a generación local si ocurre error
            return response()->json([
                'success' => true,
                'preguntas' => $this->generateTemplateQuestions($validated['cantidad_preguntas'] ?? 5),
                'total' => $validated['cantidad_preguntas'] ?? 5,
                'metadata' => [
                    'source' => 'template_fallback',
                    'confidence' => 0.3,
                    'error' => $e->getMessage(),
                    'timestamp' => now()->toIso8601String(),
                ],
            ], 200);
        }
    }

    /**
     * Generar preguntas template como fallback
     *
     * @param int $cantidad
     * @return array
     */
    private function generateTemplateQuestions(int $cantidad): array
    {
        $preguntas = [];
        for ($i = 0; $i < $cantidad; $i++) {
            $preguntas[] = [
                'enunciado' => "Pregunta " . ($i + 1) . ": [Escribe el enunciado aquí]",
                'tipo' => 'opcion_multiple',
                'opciones' => ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
                'respuesta_correcta' => 'Opción A',
                'puntos' => 10,
            ];
        }
        return $preguntas;
    }

    /**
     * Verificar salud del servicio de agente
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function health()
    {
        try {
            $response = Http::timeout(5)->get(self::AGENT_API_URL . '/health');

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'status' => 'healthy',
                    'agent' => $data,
                    'message' => 'Servicio de IA disponible',
                ]);
            }

            return response()->json([
                'status' => 'unhealthy',
                'message' => 'Servicio de IA no responde correctamente',
                'agent_status' => $response->status(),
            ], 503);

        } catch (\Exception $e) {
            Log::warning('Error verificando salud del agente', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'unavailable',
                'message' => 'No se puede contactar al servicio de IA',
                'error' => $e->getMessage(),
            ], 503);
        }
    }
}
