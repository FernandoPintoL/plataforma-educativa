<?php

namespace App\Http\Controllers;

use App\Models\StudentRecommendation;
use App\Services\EducationalRecommendationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * RecommendationController
 *
 * Gestiona las recomendaciones educativas personalizadas.
 * Permite:
 * - Obtener recomendaciones para un estudiante
 * - Aceptar/completar recomendaciones
 * - Ver historial y estadísticas
 */
class RecommendationController extends Controller
{
    protected $recommendationService;

    /**
     * Constructor del controlador
     *
     * @param EducationalRecommendationService $recommendationService
     */
    public function __construct(EducationalRecommendationService $recommendationService)
    {
        $this->middleware('auth:sanctum');
        $this->recommendationService = $recommendationService;
    }

    /**
     * Obtener recomendaciones para el estudiante autenticado
     *
     * GET /api/recommendations/my
     * Retorna las recomendaciones personalizadas del estudiante actual
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function myRecommendations(Request $request)
    {
        try {
            $studentId = auth()->id();

            Log::info('Obteniendo recomendaciones personalizadas', [
                'student_id' => $studentId,
                'user' => auth()->user()?->name,
            ]);

            // Generar recomendaciones
            $recommendations = $this->recommendationService->getAndSaveRecommendations($studentId);

            return response()->json([
                'status' => 'success',
                'message' => 'Recomendaciones obtenidas exitosamente',
                'data' => $recommendations,
                'timestamp' => now()->toIso8601String(),
            ], 200);

        } catch (Exception $e) {
            Log::error('Error obteniendo recomendaciones personalizadas', [
                'student_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error obteniendo recomendaciones: ' . $e->getMessage(),
                'timestamp' => now()->toIso8601String(),
            ], 500);
        }
    }

    /**
     * Obtener recomendaciones para un estudiante específico (solo profesor/admin)
     *
     * GET /api/recommendations/student/{studentId}
     * Solo accesible por profesores y administradores
     *
     * @param int $studentId
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function studentRecommendations(int $studentId, Request $request)
    {
        try {
            // Verificar permisos
            $user = auth()->user();
            if (!$user || !in_array($user->role, ['admin', 'teacher'])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No autorizado para ver recomendaciones de otros estudiantes',
                ], 403);
            }

            Log::info('Profesor obteniendo recomendaciones de estudiante', [
                'teacher_id' => $user->id,
                'student_id' => $studentId,
            ]);

            // Generar recomendaciones
            $recommendations = $this->recommendationService->getAndSaveRecommendations($studentId);

            return response()->json([
                'status' => 'success',
                'message' => 'Recomendaciones obtenidas',
                'student_id' => $studentId,
                'data' => $recommendations,
                'timestamp' => now()->toIso8601String(),
            ], 200);

        } catch (Exception $e) {
            Log::error('Error obteniendo recomendaciones del estudiante', [
                'teacher_id' => auth()->id(),
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Ver una recomendación específica
     *
     * GET /api/recommendations/{recommendationId}
     *
     * @param int $recommendationId
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $recommendationId, Request $request)
    {
        try {
            $recommendation = StudentRecommendation::findOrFail($recommendationId);

            // Verificar que el usuario sea el estudiante o un profesor/admin
            $user = auth()->user();
            if ($user->id !== $recommendation->student_id && !in_array($user->role, ['admin', 'teacher'])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No autorizado',
                ], 403);
            }

            Log::info('Viendo recomendación', [
                'recommendation_id' => $recommendationId,
                'user_id' => $user->id,
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $recommendation->load('educationalResource'),
                'timestamp' => now()->toIso8601String(),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Recomendación no encontrada',
            ], 404);

        } catch (Exception $e) {
            Log::error('Error viendo recomendación', [
                'recommendation_id' => $recommendationId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Aceptar una recomendación
     *
     * POST /api/recommendations/{recommendationId}/accept
     *
     * @param int $recommendationId
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function accept(int $recommendationId, Request $request)
    {
        try {
            $recommendation = StudentRecommendation::findOrFail($recommendationId);

            // Verificar que sea el estudiante
            if (auth()->id() !== $recommendation->student_id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No autorizado',
                ], 403);
            }

            Log::info('Aceptando recomendación', [
                'recommendation_id' => $recommendationId,
                'student_id' => auth()->id(),
            ]);

            $this->recommendationService->acceptRecommendation($recommendationId);

            return response()->json([
                'status' => 'success',
                'message' => 'Recomendación aceptada',
                'data' => $recommendation->refresh(),
                'timestamp' => now()->toIso8601String(),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Recomendación no encontrada',
            ], 404);

        } catch (Exception $e) {
            Log::error('Error aceptando recomendación', [
                'recommendation_id' => $recommendationId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Completar una recomendación
     *
     * POST /api/recommendations/{recommendationId}/complete
     *
     * @param int $recommendationId
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function complete(int $recommendationId, Request $request)
    {
        try {
            $recommendation = StudentRecommendation::findOrFail($recommendationId);

            // Verificar que sea el estudiante
            if (auth()->id() !== $recommendation->student_id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No autorizado',
                ], 403);
            }

            // Validar entrada
            $request->validate([
                'effectiveness_rating' => 'nullable|numeric|between:1,5',
            ]);

            Log::info('Completando recomendación', [
                'recommendation_id' => $recommendationId,
                'student_id' => auth()->id(),
                'effectiveness_rating' => $request->get('effectiveness_rating'),
            ]);

            $this->recommendationService->completeRecommendation(
                $recommendationId,
                $request->get('effectiveness_rating')
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Recomendación completada',
                'data' => $recommendation->refresh(),
                'timestamp' => now()->toIso8601String(),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Recomendación no encontrada',
            ], 404);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);

        } catch (Exception $e) {
            Log::error('Error completando recomendación', [
                'recommendation_id' => $recommendationId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener historial de recomendaciones
     *
     * GET /api/recommendations/history
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function history(Request $request)
    {
        try {
            $studentId = auth()->id();
            $limit = $request->get('limit', 10);

            Log::info('Obteniendo historial de recomendaciones', [
                'student_id' => $studentId,
                'limit' => $limit,
            ]);

            $history = $this->recommendationService->getStudentRecommendationHistory($studentId, $limit);

            return response()->json([
                'status' => 'success',
                'data' => $history,
                'count' => count($history),
                'timestamp' => now()->toIso8601String(),
            ], 200);

        } catch (Exception $e) {
            Log::error('Error obteniendo historial', [
                'student_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de recomendaciones
     *
     * GET /api/recommendations/stats
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats(Request $request)
    {
        try {
            $studentId = auth()->id();

            Log::info('Obteniendo estadísticas de recomendaciones', [
                'student_id' => $studentId,
            ]);

            $stats = $this->recommendationService->getRecommendationStats($studentId);

            return response()->json([
                'status' => 'success',
                'data' => $stats,
                'timestamp' => now()->toIso8601String(),
            ], 200);

        } catch (Exception $e) {
            Log::error('Error obteniendo estadísticas', [
                'student_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener todas las recomendaciones (solo admin/profesor)
     *
     * GET /api/recommendations
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $user = auth()->user();
            if (!$user || !in_array($user->role, ['admin', 'teacher'])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No autorizado',
                ], 403);
            }

            $query = StudentRecommendation::query();

            // Filtros opcionales
            if ($request->has('student_id')) {
                $query->where('student_id', $request->get('student_id'));
            }

            if ($request->has('recommendation_type')) {
                $query->where('recommendation_type', $request->get('recommendation_type'));
            }

            if ($request->has('risk_level')) {
                $query->where('risk_level', $request->get('risk_level'));
            }

            if ($request->has('completed')) {
                $query->where('completed', $request->boolean('completed'));
            }

            // Paginación
            $limit = $request->get('limit', 50);
            $recommendations = $query->paginate($limit);

            Log::info('Listando recomendaciones', [
                'user_id' => $user->id,
                'total' => $recommendations->total(),
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $recommendations->items(),
                'pagination' => [
                    'total' => $recommendations->total(),
                    'per_page' => $recommendations->perPage(),
                    'current_page' => $recommendations->currentPage(),
                    'last_page' => $recommendations->lastPage(),
                ],
                'timestamp' => now()->toIso8601String(),
            ], 200);

        } catch (Exception $e) {
            Log::error('Error listando recomendaciones', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
