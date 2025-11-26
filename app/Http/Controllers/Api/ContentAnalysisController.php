<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
