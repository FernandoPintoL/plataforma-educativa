<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evaluacion;
use App\Models\IntentosEvaluacion;
use App\Services\ProfessorReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Exception;

/**
 * ProfessorReviewController
 *
 * API REST para revisión de evaluaciones por profesores
 * Endpoints para obtener intentos pendientes, detalles, confirmar y ajustar calificaciones
 *
 * Rutas protegidas con middleware auth:sanctum + role:profesor|admin
 */
class ProfessorReviewController extends Controller
{
    protected ProfessorReviewService $reviewService;

    public function __construct(ProfessorReviewService $reviewService)
    {
        $this->reviewService = $reviewService;

        // Aplicar middlewares
        $this->middleware(['auth:sanctum', 'role:profesor|admin']);
    }

    /**
     * GET /api/profesor/evaluaciones/{evaluacionId}/intentos-pendientes
     *
     * Listar intentos pendientes de revisión para una evaluación
     * Ordenados por prioridad (urgente → media → baja)
     *
     * Query Parameters:
     * - prioridad: urgente|media|baja (opcional)
     * - buscar: string (nombre o email del estudiante)
     *
     * Response:
     * {
     *   "success": true,
     *   "data": [
     *     {
     *       "id": 123,
     *       "estudiante": { "id": 1, "nombre_completo": "Juan Pérez", "email": "juan@example.com" },
     *       "puntaje_obtenido": 75,
     *       "porcentaje_acierto": 75.5,
     *       "nivel_confianza": 0.82,
     *       "tiene_anomalias": false,
     *       "prioridad": "media",
     *       "fecha_entrega": "2024-11-28T10:30:00Z",
     *       "estado": "entregado",
     *       "numero_intento": 1
     *     }
     *   ],
     *   "total": 5,
     *   "estadisticas": { ... }
     * }
     */
    public function intentosPendientes($evaluacionId, Request $request)
    {
        try {
            // Validar entrada
            $filtros = $request->validate([
                'prioridad' => 'nullable|in:urgente,media,baja',
                'buscar' => 'nullable|string|max:255',
            ]);

            Log::info("Profesor solicitando intentos pendientes", [
                'evaluacion_id' => $evaluacionId,
                'profesor_id' => $request->user()->id,
                'filtros' => $filtros,
            ]);

            // Verificar que la evaluación existe
            $evaluacion = Evaluacion::findOrFail($evaluacionId);

            // Verificar que el profesor tenga acceso al curso
            $this->verificarAccesoEvaluacion($evaluacion, $request->user());

            // Obtener intentos con filtros
            $intentos = $this->reviewService->obtenerIntentosParaRevisar($evaluacionId, $filtros);

            // Obtener estadísticas
            $estadisticas = $this->reviewService->obtenerEstadisticasRevision($evaluacionId);

            return response()->json([
                'success' => true,
                'data' => $intentos,
                'total' => count($intentos),
                'estadisticas' => $estadisticas,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);

        } catch (Exception $e) {
            Log::error("Error obteniendo intentos pendientes: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener intentos pendientes',
            ], 500);
        }
    }

    /**
     * GET /api/profesor/intentos/{intentoId}/revision
     *
     * Obtener detalle completo de un intento para revisión
     * Incluye todas las respuestas con análisis LLM
     *
     * Response:
     * {
     *   "success": true,
     *   "data": {
     *     "intento": {
     *       "id": 123,
     *       "estudiante": { ... },
     *       "evaluacion": { ... },
     *       "puntaje_obtenido": 75,
     *       "porcentaje_acierto": 75.5,
     *       "nivel_confianza": 0.82,
     *       "tiene_anomalias": false,
     *       "prioridad": "media",
     *       "areas_debilidad": [ "Tema 1", "Tema 2" ],
     *       "areas_fortaleza": [ "Tema 3" ],
     *       "recomendaciones_ia": [ "Reforzar tema 1" ]
     *     },
     *     "respuestas": [
     *       {
     *         "id": 1,
     *         "pregunta_id": 10,
     *         "enunciado": "¿Qué es...?",
     *         "tipo_pregunta": "respuesta_corta",
     *         "respuesta_estudiante": "Es...",
     *         "es_correcta": true,
     *         "puntos_obtenidos": 10,
     *         "puntos_totales": 10,
     *         "confianza": 0.9,
     *         "analisis_llm": {
     *           "conceptos_correctos": ["concepto1"],
     *           "errores_encontrados": [],
     *           "nivel_bloom": "understand",
     *           "calidad_respuesta": 0.9
     *         },
     *         "respuesta_anomala": false,
     *         "recomendacion": "Excelente...",
     *         "necesita_revision": false
     *       }
     *     ]
     *   }
     * }
     */
    public function detalleRevision($intentoId, Request $request)
    {
        try {
            Log::info("Profesor solicitando detalle de revisión", [
                'intento_id' => $intentoId,
                'profesor_id' => $request->user()->id,
            ]);

            // Obtener intento y validar
            $intento = IntentosEvaluacion::findOrFail($intentoId);

            // Verificar que el profesor tenga acceso
            $this->verificarAccesoIntento($intento, $request->user());

            // Obtener detalle completo
            $detalle = $this->reviewService->obtenerDetalleRevision($intentoId);

            return response()->json([
                'success' => true,
                'data' => $detalle,
            ], 200);

        } catch (Exception $e) {
            Log::error("Error obteniendo detalle de revisión: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener detalle de revisión',
            ], 500);
        }
    }

    /**
     * POST /api/profesor/intentos/{intentoId}/confirmar
     *
     * Confirmar calificación automática del sistema
     * El profesor acepta la propuesta de calificación del sistema
     *
     * Body:
     * {
     *   "comentario": "Excelente trabajo (opcional)"
     * }
     *
     * Response:
     * {
     *   "success": true,
     *   "message": "Calificación confirmada",
     *   "data": {
     *     "intento_id": 123,
     *     "estado": "calificado",
     *     "puntaje_final": 75
     *   }
     * }
     */
    public function confirmar($intentoId, Request $request)
    {
        try {
            // Validar entrada
            $validated = $request->validate([
                'comentario' => 'nullable|string|max:1000',
            ]);

            Log::info("Profesor confirmando calificación", [
                'intento_id' => $intentoId,
                'profesor_id' => $request->user()->id,
            ]);

            // Obtener intento
            $intento = IntentosEvaluacion::findOrFail($intentoId);

            // Verificar que esté en estado 'entregado'
            if ($intento->estado !== 'entregado') {
                return response()->json([
                    'success' => false,
                    'message' => 'Este intento ya ha sido calificado',
                ], 400);
            }

            // Verificar acceso
            $this->verificarAccesoIntento($intento, $request->user());

            // Confirmar calificación
            $this->reviewService->confirmarCalificacion(
                $intentoId,
                $validated['comentario'] ?? null
            );

            // Recargar intento
            $intento->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Calificación confirmada',
                'data' => [
                    'intento_id' => $intento->id,
                    'estado' => $intento->estado,
                    'puntaje_final' => $intento->puntaje_obtenido,
                    'porcentaje_final' => $intento->porcentaje_acierto,
                ],
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);

        } catch (Exception $e) {
            Log::error("Error confirmando calificación: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error al confirmar calificación',
            ], 500);
        }
    }

    /**
     * POST /api/profesor/intentos/{intentoId}/ajustar
     *
     * Ajustar calificación manualmente
     * El profesor modifica puntos y/o recomendaciones de respuestas individuales
     *
     * Body:
     * {
     *   "ajustes": [
     *     {
     *       "respuesta_id": 1,
     *       "puntos_obtenidos": 8,
     *       "recomendacion": "Casi correcto, revisar X"
     *     },
     *     {
     *       "respuesta_id": 2,
     *       "puntos_obtenidos": 10,
     *       "recomendacion": "Excelente"
     *     }
     *   ],
     *   "comentario_general": "Trabajo en general bueno (opcional)"
     * }
     *
     * Response:
     * {
     *   "success": true,
     *   "message": "Calificación ajustada",
     *   "data": {
     *     "intento_id": 123,
     *     "estado": "calificado",
     *     "puntaje_original": 75,
     *     "puntaje_ajustado": 78,
     *     "porcentaje_ajustado": 78.0,
     *     "respuestas_ajustadas": 2
     *   }
     * }
     */
    public function ajustar($intentoId, Request $request)
    {
        try {
            // Validar entrada
            $validated = $request->validate([
                'ajustes' => 'required|array',
                'ajustes.*.respuesta_id' => 'required|integer|exists:respuestas_evaluacion,id',
                'ajustes.*.puntos_obtenidos' => 'required|numeric|min:0',
                'ajustes.*.recomendacion' => 'nullable|string|max:1000',
                'comentario_general' => 'nullable|string|max:1000',
            ]);

            Log::info("Profesor ajustando calificación", [
                'intento_id' => $intentoId,
                'profesor_id' => $request->user()->id,
                'respuestas_ajustadas' => count($validated['ajustes']),
            ]);

            // Obtener intento
            $intento = IntentosEvaluacion::with('respuestas_detalladas')->findOrFail($intentoId);

            // Verificar que esté en estado 'entregado'
            if ($intento->estado !== 'entregado') {
                return response()->json([
                    'success' => false,
                    'message' => 'Este intento ya ha sido calificado',
                ], 400);
            }

            // Verificar acceso
            $this->verificarAccesoIntento($intento, $request->user());

            // Guardar puntaje original
            $puntajeOriginal = $intento->puntaje_obtenido;

            // Ajustar calificación
            $this->reviewService->ajustarCalificacion($intentoId, $validated);

            // Recargar intento
            $intento->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Calificación ajustada',
                'data' => [
                    'intento_id' => $intento->id,
                    'estado' => $intento->estado,
                    'puntaje_original' => $puntajeOriginal,
                    'puntaje_ajustado' => $intento->puntaje_obtenido,
                    'porcentaje_ajustado' => $intento->porcentaje_acierto,
                    'respuestas_ajustadas' => count($validated['ajustes']),
                ],
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);

        } catch (Exception $e) {
            Log::error("Error ajustando calificación: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error al ajustar calificación',
            ], 500);
        }
    }

    /**
     * GET /api/profesor/evaluaciones/{evaluacionId}/estadisticas-revision
     *
     * Obtener estadísticas de revisión para una evaluación
     *
     * Response:
     * {
     *   "success": true,
     *   "data": {
     *     "total_intentos": 30,
     *     "entregados": 25,
     *     "calificados": 10,
     *     "pendientes": 15,
     *     "prioridades": {
     *       "urgente": 2,
     *       "media": 5,
     *       "baja": 8
     *     },
     *     "promedios": {
     *       "confianza": 0.75,
     *       "porcentaje_acierto": 72.5,
     *       "puntaje": 72.5
     *     },
     *     "porcentaje_completado": 40.0
     *   }
     * }
     */
    public function estadisticasRevision($evaluacionId, Request $request)
    {
        try {
            Log::info("Profesor solicitando estadísticas de revisión", [
                'evaluacion_id' => $evaluacionId,
                'profesor_id' => $request->user()->id,
            ]);

            // Verificar que la evaluación existe
            $evaluacion = Evaluacion::findOrFail($evaluacionId);

            // Verificar acceso
            $this->verificarAccesoEvaluacion($evaluacion, $request->user());

            // Obtener estadísticas
            $estadisticas = $this->reviewService->obtenerEstadisticasRevision($evaluacionId);

            return response()->json([
                'success' => true,
                'data' => $estadisticas,
            ], 200);

        } catch (Exception $e) {
            Log::error("Error obteniendo estadísticas: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas',
            ], 500);
        }
    }

    /**
     * Verificar que el profesor tenga acceso a la evaluación
     */
    private function verificarAccesoEvaluacion($evaluacion, $profesor)
    {
        // Por ahora, permitir acceso a todos los profesores/admin
        // En el futuro, verificar que el profesor sea del curso
        if (!$profesor->hasRole(['profesor', 'admin'])) {
            throw new \Illuminate\Auth\AuthorizationException('No tienes acceso a esta evaluación');
        }
    }

    /**
     * Verificar que el profesor tenga acceso al intento
     */
    private function verificarAccesoIntento($intento, $profesor)
    {
        // Por ahora, permitir acceso a todos los profesores/admin
        // En el futuro, verificar que el profesor sea del curso
        if (!$profesor->hasRole(['profesor', 'admin'])) {
            throw new \Illuminate\Auth\AuthorizationException('No tienes acceso a este intento');
        }
    }
}
