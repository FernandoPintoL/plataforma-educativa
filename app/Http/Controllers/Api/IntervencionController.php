<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Intervencion;
use App\Models\PrediccionRiesgo;
use App\Models\User;
use App\Models\Notificacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IntervencionController extends Controller
{
    /**
     * GET /api/intervenciones
     * Obtener lista de intervenciones con filtros
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            if (!$user) {
                abort(401, 'No autenticado');
            }

            console_log('[IntervencionController] Obteniendo intervenciones del usuario ' . $user->id);

            $query = Intervencion::with(['estudiante', 'profesor', 'curso'])
                ->orderBy('created_at', 'desc');

            // Filtrar según rol
            if (!$user->esDirector()) {
                if ($user->esProfesor()) {
                    $query->where('profesor_id', $user->id);
                } else {
                    $query->where('estudiante_id', $user->id);
                }
            }

            // Aplicar filtros
            if ($request->has('curso_id')) {
                $query->where('curso_id', $request->curso_id);
            }

            if ($request->has('estado')) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('prioridad')) {
                $query->where('prioridad', $request->prioridad);
            }

            if ($request->has('estudiante_id')) {
                $query->where('estudiante_id', $request->estudiante_id);
            }

            if ($request->has('risk_level')) {
                $riskLevel = $request->risk_level;
                $query->whereHas('prediccionRiesgo', function ($q) use ($riskLevel) {
                    $q->where('risk_level', $riskLevel);
                });
            }

            // Filtro de fechas
            if ($request->has('fecha_desde')) {
                $query->where('fecha_inicio', '>=', $request->fecha_desde);
            }

            if ($request->has('fecha_hasta')) {
                $query->where('fecha_fin_planeada', '<=', $request->fecha_hasta);
            }

            $limit = $request->integer('limit', 20);
            $page = $request->integer('page', 1);

            $intervenciones = $query->paginate($limit, ['*'], 'page', $page);

            console_log('[IntervencionController] ' . $intervenciones->total() . ' intervenciones encontradas');

            return response()->json($intervenciones);
        } catch (\Exception $e) {
            console_log('[IntervencionController] Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al obtener intervenciones',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/intervenciones/dashboard
     * Dashboard de intervenciones para profesor/director
     */
    public function dashboard(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            if (!$user) {
                abort(401, 'No autenticado');
            }

            console_log('[IntervencionController] Obteniendo dashboard de intervenciones');

            $query = Intervencion::with(['estudiante', 'prediccionRiesgo']);

            if (!$user->esDirector()) {
                $query->where('profesor_id', $user->id);
            }

            // Estadísticas
            $total = (clone $query)->count();
            $pendientes = (clone $query)->where('estado', 'pendiente')->count();
            $enProgreso = (clone $query)->where('estado', 'en_progreso')->count();
            $completadas = (clone $query)->where('estado', 'completada')->count();
            $canceladas = (clone $query)->where('estado', 'cancelada')->count();
            $vencidas = (clone $query)->vencidas()->count();

            // Por prioridad
            $urgentes = (clone $query)->where('prioridad', 'urgente')->count();
            $altas = (clone $query)->where('prioridad', 'alta')->count();

            // Intervenciones recientes
            $recientes = $query->latest('created_at')->limit(5)->get();

            // Intervenciones vencidas
            $vencidasLista = $query->vencidas()->latest('fecha_fin_planeada')->limit(5)->get();

            return response()->json([
                'stats' => [
                    'total' => $total,
                    'pendientes' => $pendientes,
                    'en_progreso' => $enProgreso,
                    'completadas' => $completadas,
                    'canceladas' => $canceladas,
                    'vencidas' => $vencidas,
                    'urgentes' => $urgentes,
                    'altas' => $altas,
                ],
                'intervenciones_recientes' => $recientes,
                'intervenciones_vencidas' => $vencidasLista,
            ]);
        } catch (\Exception $e) {
            console_log('[IntervencionController] Error en dashboard: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al obtener dashboard',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/intervenciones/por-estudiante/{id}
     * Obtener intervenciones de un estudiante
     */
    public function porEstudiante($estudianteId, Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            if (!$user) {
                abort(401, 'No autenticado');
            }

            console_log('[IntervencionController] Obteniendo intervenciones del estudiante ' . $estudianteId);

            // Autorización: el usuario puede ver si es director, profesor del estudiante, o el mismo estudiante
            if ((int)auth()->id() !== (int)$estudianteId && !$user->esDirector()) {
                // Verificar si es profesor del estudiante
                $esProfesor = User::find($estudianteId)?->cursosComoEstudiante()
                    ->where('profesor_id', $user->id)
                    ->exists();

                if (!$esProfesor) {
                    abort(403, 'No autorizado');
                }
            }

            $intervenciones = Intervencion::with(['profesor', 'curso', 'prediccionRiesgo', 'seguimientos'])
                ->porEstudiante($estudianteId)
                ->orderBy('created_at', 'desc')
                ->get();

            // Agrupar por estado
            $porEstado = [
                'pendiente' => $intervenciones->where('estado', 'pendiente')->values(),
                'en_progreso' => $intervenciones->where('estado', 'en_progreso')->values(),
                'completada' => $intervenciones->where('estado', 'completada')->values(),
                'cancelada' => $intervenciones->where('estado', 'cancelada')->values(),
            ];

            return response()->json([
                'intervenciones' => $intervenciones,
                'por_estado' => $porEstado,
                'total' => $intervenciones->count(),
            ]);
        } catch (\Exception $e) {
            console_log('[IntervencionController] Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al obtener intervenciones',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/intervenciones/{id}
     * Obtener detalles de una intervención
     */
    public function show($id): JsonResponse
    {
        try {
            $intervencion = Intervencion::with(['estudiante', 'profesor', 'curso', 'prediccionRiesgo', 'seguimientos.usuario'])
                ->findOrFail($id);

            console_log('[IntervencionController] Obteniendo detalles de intervención ' . $id);

            return response()->json($intervencion);
        } catch (\Exception $e) {
            console_log('[IntervencionController] Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al obtener intervención',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * POST /api/intervenciones
     * Crear nueva intervención
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            if (!$user) {
                abort(401, 'No autenticado');
            }

            console_log('[IntervencionController] Creando nueva intervención');

            $validated = $request->validate([
                'prediccion_riesgo_id' => 'nullable|exists:predicciones_riesgo,id',
                'estudiante_id' => 'required|exists:users,id',
                'curso_id' => 'required|exists:cursos,id',
                'titulo' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'tipo_intervencion' => 'required|in:apoyo_academico,orientacion_psicologica,tutoria,contacto_padres,actividades_complementarias,otro',
                'prioridad' => 'required|in:baja,media,alta,urgente',
                'fecha_inicio' => 'nullable|date',
                'fecha_fin_planeada' => 'nullable|date|after_or_equal:fecha_inicio',
                'observaciones' => 'nullable|string',
            ]);

            $validated['profesor_id'] = $user->id;
            $validated['created_by'] = $user->id;

            $intervencion = Intervencion::create($validated);

            // Crear notificación para el estudiante
            $estudiante = User::find($validated['estudiante_id']);
            Notificacion::crearParaUsuario(
                $estudiante->id,
                'intervention_update',
                '📋 Nueva Intervención Asignada',
                "Se ha asignado una intervención para: {$validated['titulo']}",
                [
                    'intervencion_id' => $intervencion->id,
                    'tipo' => $validated['tipo_intervencion'],
                ],
                $validated['prediccion_riesgo_id'] ?? null
            );

            console_log('[IntervencionController] Intervención creada: ' . $intervencion->id);

            return response()->json($intervencion, 201);
        } catch (\Exception $e) {
            console_log('[IntervencionController] Error creando: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al crear intervención',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * PATCH /api/intervenciones/{id}
     * Actualizar intervención
     */
    public function update($id, Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            if (!$user) {
                abort(401, 'No autenticado');
            }

            $intervencion = Intervencion::findOrFail($id);

            console_log('[IntervencionController] Actualizando intervención ' . $id);

            $validated = $request->validate([
                'titulo' => 'string|max:255',
                'descripcion' => 'string',
                'tipo_intervencion' => 'in:apoyo_academico,orientacion_psicologica,tutoria,contacto_padres,actividades_complementarias,otro',
                'estado' => 'in:pendiente,en_progreso,completada,cancelada',
                'prioridad' => 'in:baja,media,alta,urgente',
                'fecha_inicio' => 'nullable|date',
                'fecha_fin_planeada' => 'nullable|date|after_or_equal:fecha_inicio',
                'observaciones' => 'nullable|string',
                'seguimiento_requerido' => 'boolean',
            ]);

            // Manejar cambios de estado
            if (isset($validated['estado']) && $validated['estado'] !== $intervencion->estado) {
                if ($validated['estado'] === 'en_progreso') {
                    $intervencion->marcarEnProgreso($user->id);
                } elseif ($validated['estado'] === 'completada') {
                    $intervencion->marcarCompletada(null, $user->id);
                } elseif ($validated['estado'] === 'cancelada') {
                    $intervencion->marcarCancelada($validated['observaciones'] ?? 'Sin especificar', $user->id);
                }
                unset($validated['estado']);
            }

            $validated['updated_by'] = $user->id;
            $intervencion->update($validated);

            return response()->json($intervencion);
        } catch (\Exception $e) {
            console_log('[IntervencionController] Error actualizando: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al actualizar intervención',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * DELETE /api/intervenciones/{id}
     * Eliminar intervención
     */
    public function destroy($id): JsonResponse
    {
        try {
            $user = auth()->user();
            if (!$user) {
                abort(401, 'No autenticado');
            }

            $intervencion = Intervencion::findOrFail($id);

            console_log('[IntervencionController] Eliminando intervención ' . $id);

            // Solo director o creador pueden eliminar
            if ($intervencion->created_by !== $user->id && !$user->esDirector()) {
                abort(403, 'No autorizado');
            }

            $intervencion->delete();

            return response()->json(['message' => 'Intervención eliminada']);
        } catch (\Exception $e) {
            console_log('[IntervencionController] Error eliminando: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al eliminar intervención',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/intervenciones/{id}/seguimientos
     * Agregar seguimiento a una intervención
     */
    public function agregarSeguimiento($id, Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            if (!$user) {
                abort(401, 'No autenticado');
            }

            $intervencion = Intervencion::findOrFail($id);

            console_log('[IntervencionController] Agregando seguimiento a intervención ' . $id);

            $validated = $request->validate([
                'descripcion' => 'required|string',
                'estado_actual' => 'nullable|in:pendiente,en_progreso,completada,cancelada',
                'observaciones' => 'nullable|string',
            ]);

            $seguimiento = $intervencion->agregarSeguimiento(
                $validated['descripcion'],
                $validated['estado_actual'] ?? $intervencion->estado,
                $user->id,
                $validated['observaciones'] ?? null
            );

            return response()->json($seguimiento, 201);
        } catch (\Exception $e) {
            console_log('[IntervencionController] Error agregando seguimiento: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al agregar seguimiento',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
