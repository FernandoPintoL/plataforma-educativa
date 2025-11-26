<?php

namespace App\Http\Controllers\Api;

use App\Models\PrediccionRiesgo;
use App\Models\PrediccionCarrera;
use App\Models\PrediccionTendencia;
use App\Models\User;
use App\Models\Curso;
use App\Models\Calificacion;
use App\Jobs\GenerarPrediccionesJob;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AnalisisRiesgoController extends Controller
{
    /**
     * Dashboard general con métricas de desempeño académico
     *
     * Predice el riesgo de bajo desempeño basado en:
     * - Calificaciones promedio
     * - Comportamiento académico
     * - Tendencias de desempeño
     */
    public function dashboard(Request $request): JsonResponse
    {
        // Autorización manejada por el middleware de ruta (role:director|profesor|admin)

        $cursoId = $request->input('curso_id');
        $diasAtraso = $request->input('dias', 30);

        // Query base
        $query = PrediccionRiesgo::query()
            ->with('estudiante')
            ->recientes($diasAtraso);

        if ($cursoId) {
            $query->byCurso($cursoId);
        }

        $predicciones = $query->get();

        // Cálculos de métricas
        $totalEstudiantes = $predicciones->count();
        $riesgoAlto = $predicciones->where('nivel_riesgo', 'alto')->count();
        $riesgoMedio = $predicciones->where('nivel_riesgo', 'medio')->count();
        $riesgoBajo = $predicciones->where('nivel_riesgo', 'bajo')->count();

        $scorePromedio = $predicciones->avg('score_riesgo') ?? 0;
        $porcentajeAlto = $totalEstudiantes > 0 ? ($riesgoAlto / $totalEstudiantes) * 100 : 0;

        return response()->json([
            'data' => [
                'metricas' => [
                    'total_estudiantes' => $totalEstudiantes,
                    'riesgo_alto' => $riesgoAlto,
                    'riesgo_medio' => $riesgoMedio,
                    'riesgo_bajo' => $riesgoBajo,
                    'score_promedio' => round($scorePromedio, 4),
                    'porcentaje_alto_riesgo' => round($porcentajeAlto, 2),
                ],
                'distribucion' => [
                    'alto' => $riesgoAlto,
                    'medio' => $riesgoMedio,
                    'bajo' => $riesgoBajo,
                ],
                'estudiantes_criticos' => $predicciones
                    ->where('nivel_riesgo', 'alto')
                    ->sortByDesc('score_riesgo')
                    ->take(5)
                    ->values()
                    ->map(fn($p) => [
                        'id' => $p->id,
                        'estudiante_id' => $p->estudiante_id,
                        'estudiante_nombre' => $p->estudiante?->name,
                        'score_riesgo' => $p->score_riesgo,
                        'nivel_riesgo' => $p->nivel_riesgo,
                    ]),
            ],
            'message' => 'Dashboard de análisis de riesgo cargado exitosamente',
        ], 200);
    }

    /**
     * Listar predicciones de desempeño con filtros
     *
     * Retorna estudiantes clasificados por su probabilidad de bajo desempeño:
     * - Alto: > 70% de probabilidad
     * - Medio: 40-70% de probabilidad
     * - Bajo: < 40% de probabilidad
     */
    public function index(Request $request): JsonResponse
    {
        // Autorización manejada por el middleware de ruta

        $perPage = $request->input('per_page', 15);
        $cursoId = $request->input('curso_id');
        $nivelRiesgo = $request->input('nivel_riesgo');
        $buscar = $request->input('search');
        $ordenar = $request->input('order_by', 'fecha_prediccion');
        $direccion = $request->input('direction', 'desc');

        $query = PrediccionRiesgo::query()
            ->with('estudiante:id,name,email')
            ->recientes(30);

        // Filtros
        if ($cursoId) {
            $query->byCurso($cursoId);
        }

        if ($nivelRiesgo) {
            $query->where('nivel_riesgo', $nivelRiesgo);
        }

        if ($buscar) {
            $query->whereHas('estudiante', function ($q) use ($buscar) {
                $q->where('name', 'like', "%$buscar%")
                  ->orWhere('email', 'like', "%$buscar%");
            });
        }

        // Ordenamiento
        $query->orderBy($ordenar, $direccion);

        $predicciones = $query->paginate($perPage);

        // Transformar datos para que coincidan con los nombres esperados por el frontend
        $transformedData = $predicciones->items();
        array_walk($transformedData, function (&$item) {
            $item = [
                'id' => $item->id,
                'estudiante_id' => $item->estudiante_id,
                'estudiante' => $item->estudiante,
                'score_riesgo' => (float) $item->score_riesgo,
                'nivel_riesgo' => strtolower($item->nivel_riesgo ?? 'bajo'),
                'confianza' => (float) $item->confianza,
                'fecha_prediccion' => $item->fecha_prediccion,
                'fk_curso_id' => $item->fk_curso_id,
            ];
        });

        return response()->json([
            'data' => $transformedData,
            'pagination' => [
                'total' => $predicciones->total(),
                'per_page' => $predicciones->perPage(),
                'current_page' => $predicciones->currentPage(),
                'last_page' => $predicciones->lastPage(),
            ],
            'message' => 'Predicciones cargadas exitosamente',
        ], 200);
    }

    /**
     * Análisis detallado de desempeño académico de un estudiante
     *
     * Retorna predicción de bajo desempeño, histórico, tendencias y recomendaciones
     */
    public function porEstudiante(int $estudianteId, Request $request): JsonResponse
    {
        // Autorización manejada por el middleware de ruta

        $estudiante = User::findOrFail($estudianteId);
        $diasAtraso = $request->input('dias', 12);

        // Predicción de riesgo más reciente
        $prediccionRiesgo = PrediccionRiesgo::where('estudiante_id', $estudianteId)
            ->recientes($diasAtraso * 30)
            ->latest('fecha_prediccion')
            ->first();

        // Histórico de riesgo
        $historicoRiesgo = PrediccionRiesgo::where('estudiante_id', $estudianteId)
            ->recientes($diasAtraso * 30)
            ->orderBy('fecha_prediccion', 'desc')
            ->limit($diasAtraso)
            ->get(['fecha_prediccion', 'score_riesgo', 'nivel_riesgo']);

        // Recomendaciones de carrera
        $recomendacionesCarrera = collect();
        try {
            $recomendacionesCarrera = PrediccionCarrera::where('estudiante_id', $estudianteId)
                ->top3($estudianteId)
                ->get();
        } catch (\Exception $e) {
            // PrediccionCarrera table might not exist yet
        }

        // Tendencia
        $tendencia = null;
        try {
            $tendencia = PrediccionTendencia::where('estudiante_id', $estudianteId)
                ->latest('fecha_prediccion')
                ->first();
        } catch (\Exception $e) {
            // PrediccionTendencia table might not exist yet
        }

        // Calificaciones recientes del estudiante (via trabajo -> estudiante)
        $calificacionesRecientes = collect();
        try {
            $calificacionesRecientes = Calificacion::with('trabajo')
                ->whereHas('trabajo', fn($q) => $q->where('estudiante_id', $estudianteId))
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(['id', 'puntaje', 'fecha_calificacion', 'trabajo_id', 'created_at']);
        } catch (\Exception $e) {
            // Unable to fetch calificaciones
        }

        if (!$prediccionRiesgo) {
            return response()->json([
                'message' => 'No hay predicciones disponibles para este estudiante',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'data' => [
                'estudiante' => [
                    'id' => $estudiante->id,
                    'nombre' => $estudiante->name,
                    'email' => $estudiante->email,
                    'avatar' => $estudiante->avatar ?? null,
                ],
                'prediccion_riesgo' => [
                    'id' => $prediccionRiesgo->id,
                    'score_riesgo' => $prediccionRiesgo->score_riesgo,
                    'nivel_riesgo' => $prediccionRiesgo->nivel_riesgo,
                    'nivel_riesgo_label' => $prediccionRiesgo->nivel_riesgo_label,
                    'confianza' => $prediccionRiesgo->confianza,
                    'fecha_prediccion' => $prediccionRiesgo->fecha_prediccion,
                    'descripcion' => $prediccionRiesgo->descripcion,
                    'color' => $prediccionRiesgo->color,
                    'factores_influyentes' => $prediccionRiesgo->factores_influyentes,
                ],
                'historico_riesgo' => $historicoRiesgo,
                'recomendaciones_carrera' => $recomendacionesCarrera->map(fn($r) => [
                    'id' => $r->id,
                    'carrera_nombre' => $r->carrera_nombre,
                    'compatibilidad' => $r->compatibilidad,
                    'ranking' => $r->ranking,
                    'descripcion' => $r->descripcion,
                    'color' => $r->color,
                ]),
                'tendencia' => $tendencia ? [
                    'id' => $tendencia->id,
                    'tendencia' => $tendencia->tendencia,
                    'tendencia_label' => $tendencia->tendencia_label,
                    'confianza' => $tendencia->confianza,
                    'color' => $tendencia->color,
                    'icono' => $tendencia->icono,
                    'fecha_prediccion' => $tendencia->fecha_prediccion,
                ] : null,
                'calificaciones_recientes' => $calificacionesRecientes,
            ],
            'message' => 'Análisis de estudiante cargado exitosamente',
        ], 200);
    }

    /**
     * Análisis por curso
     */
    public function porCurso(int $cursoId, Request $request): JsonResponse
    {
        try {
            $usuario = Auth::user();
            if (!$usuario) {
                return response()->json(['error' => 'No autenticado'], 401);
            }

            $curso = Curso::findOrFail($cursoId);
            $diasAtraso = $request->input('dias', 30);

            // Validar acceso según rol
            if ($usuario->tipo_usuario === 'profesor') {
                // Profesor solo ve sus propios cursos
                $esSuCurso = DB::table('curso_profesor')
                    ->where('profesor_id', $usuario->id)
                    ->where('curso_id', $cursoId)
                    ->exists();

                if (!$esSuCurso) {
                    Log::warning("Profesor {$usuario->id} intentó acceder a curso {$cursoId} sin permisos");
                    return response()->json(['error' => 'No eres profesor de este curso'], 403);
                }
            } elseif ($usuario->tipo_usuario === 'estudiante') {
                // Estudiante solo ve su propio curso
                $esSuCurso = DB::table('curso_estudiante')
                    ->where('estudiante_id', $usuario->id)
                    ->where('curso_id', $cursoId)
                    ->exists();

                if (!$esSuCurso) {
                    Log::warning("Estudiante {$usuario->id} intentó acceder a curso {$cursoId} sin permisos");
                    return response()->json(['error' => 'No eres estudiante de este curso'], 403);
                }
            }
            // Admin y orientador tienen acceso a todos los cursos

            // Obtener predicciones del curso
            $predicciones = PrediccionRiesgo::where('fk_curso_id', $cursoId)
                ->where('fecha_prediccion', '>=', now()->subDays($diasAtraso))
                ->with('estudiante:id,name,email')
                ->get();

            // Agregar por nivel
            $distribucion = [
                'alto' => $predicciones->where('nivel_riesgo', 'alto')->count(),
                'medio' => $predicciones->where('nivel_riesgo', 'medio')->count(),
                'bajo' => $predicciones->where('nivel_riesgo', 'bajo')->count(),
            ];

            // Score promedio
            $scorePromedio = $predicciones->avg('score_riesgo') ?? 0;

            // Estudiantes por nivel
            $estudiantesPorNivel = [
                'alto' => $predicciones
                    ->where('nivel_riesgo', 'alto')
                    ->sortByDesc('score_riesgo')
                    ->map(fn($p) => [
                        'estudiante_id' => $p->estudiante_id,
                        'nombre' => $p->estudiante?->name,
                        'score' => (float) $p->score_riesgo,
                    ])
                    ->values(),
                'medio' => $predicciones
                    ->where('nivel_riesgo', 'medio')
                    ->map(fn($p) => [
                        'estudiante_id' => $p->estudiante_id,
                        'nombre' => $p->estudiante?->name,
                        'score' => (float) $p->score_riesgo,
                    ])
                    ->values(),
            ];

            return response()->json([
                'data' => [
                    'curso' => [
                        'id' => $curso->id,
                        'nombre' => $curso->nombre,
                        'codigo' => $curso->codigo ?? null,
                    ],
                    'metricas' => [
                        'total_estudiantes' => $predicciones->count(),
                        'score_promedio' => round($scorePromedio, 4),
                        'distribucion' => $distribucion,
                        'porcentaje_alto_riesgo' => $predicciones->count() > 0
                            ? round(($distribucion['alto'] / $predicciones->count()) * 100, 2)
                            : 0,
                    ],
                    'estudiantes_por_nivel' => $estudiantesPorNivel,
                    'lista_completa' => $predicciones->map(fn($p) => [
                        'id' => $p->id,
                        'estudiante_id' => $p->estudiante_id,
                        'nombre' => $p->estudiante?->name,
                        'score_riesgo' => (float) $p->score_riesgo,
                        'nivel_riesgo' => strtolower($p->nivel_riesgo ?? 'bajo'),
                        'fecha_prediccion' => $p->fecha_prediccion,
                    ])->sortByDesc('score_riesgo')->values(),
                ],
                'message' => 'Análisis por curso cargado exitosamente',
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error en porCurso: {$e->getMessage()}", [
                'curso_id' => $cursoId,
                'usuario_id' => Auth::id(),
                'exception' => $e,
            ]);

            return response()->json([
                'error' => 'Error al cargar análisis del curso',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Análisis de tendencias generales
     */
    public function tendencias(Request $request): JsonResponse
    {
        // Autorización manejada por el middleware de ruta

        $cursoId = $request->input('curso_id');
        $diasAtraso = $request->input('dias', 90);

        $query = PrediccionRiesgo::query()->recientes($diasAtraso);

        if ($cursoId) {
            $query->byCurso($cursoId);
        }

        // Datos para gráfico de línea
        $datosTendencia = $query->selectRaw("DATE_TRUNC('day', fecha_prediccion)::date as fecha, AVG(score_riesgo) as score_promedio, COUNT(*) as total")
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get();

        // Distribución por tendencia de estudiantes
        $distribucionTendencia = [];
        try {
            $distribucionTendencia = PrediccionTendencia::query()
                ->when($cursoId, fn($q) => $q->byCurso($cursoId))
                ->recientes($diasAtraso)
                ->selectRaw('tendencia, COUNT(*) as cantidad')
                ->groupBy('tendencia')
                ->get()
                ->mapWithKeys(fn($item) => [$item->tendencia => $item->cantidad]);
        } catch (\Exception $e) {
            // PrediccionTendencia table might not exist yet
            $distribucionTendencia = collect();
        }

        return response()->json([
            'data' => [
                'grafico_tendencia' => $datosTendencia->map(fn($d) => [
                    'fecha' => $d->fecha,
                    'score_promedio' => round($d->score_promedio, 4),
                    'total' => $d->total,
                ]),
                'distribucion_tendencia' => [
                    'mejorando' => $distribucionTendencia->get('mejorando', 0),
                    'estable' => $distribucionTendencia->get('estable', 0),
                    'declinando' => $distribucionTendencia->get('declinando', 0),
                    'fluctuando' => $distribucionTendencia->get('fluctuando', 0),
                ],
            ],
            'message' => 'Análisis de tendencias cargado exitosamente',
        ], 200);
    }

    /**
     * Recomendaciones de carrera para un estudiante
     */
    public function recomendacionesCarrera(int $estudianteId): JsonResponse
    {
        // Autorización manejada por el middleware de ruta

        $recomendaciones = PrediccionCarrera::where('estudiante_id', $estudianteId)
            ->orderBy('ranking')
            ->get();

        if ($recomendaciones->isEmpty()) {
            return response()->json([
                'message' => 'No hay recomendaciones de carrera disponibles',
                'data' => [],
            ], 404);
        }

        return response()->json([
            'data' => $recomendaciones->map(fn($r) => [
                'id' => $r->id,
                'carrera_nombre' => $r->carrera_nombre,
                'compatibilidad' => $r->compatibilidad,
                'ranking' => $r->ranking,
                'descripcion' => $r->descripcion,
                'color' => $r->color,
            ]),
            'message' => 'Recomendaciones de carrera cargadas exitosamente',
        ], 200);
    }

    /**
     * Actualizar predicción manualmente (admin)
     */
    public function update(Request $request, int $id): JsonResponse
    {
        // Autorización manejada por el middleware de ruta

        $prediccion = PrediccionRiesgo::findOrFail($id);

        $validated = $request->validate([
            'observaciones' => 'nullable|string',
            'nivel_riesgo' => 'nullable|in:alto,medio,bajo',
        ]);

        $prediccion->update($validated);

        return response()->json([
            'data' => $prediccion,
            'message' => 'Predicción actualizada exitosamente',
        ], 200);
    }

    /**
     * Generar nuevas predicciones para un estudiante
     */
    public function generarPredicciones(Request $request, int $estudianteId): JsonResponse
    {
        try {
            $usuario = Auth::user();
            if (!$usuario) {
                return response()->json(['error' => 'No autenticado'], 401);
            }

            // Validar que el estudiante existe y es estudiante
            $estudiante = User::where('id', $estudianteId)
                ->where('tipo_usuario', 'estudiante')
                ->firstOrFail();

            // Validar autorización
            // Solo admin, orientador o el mismo estudiante pueden solicitar predicciones
            if ($usuario->id !== $estudianteId && !in_array($usuario->tipo_usuario, ['admin', 'orientador'])) {
                Log::warning("Intento no autorizado de generar predicciones para estudiante {$estudianteId} por usuario {$usuario->id}");
                return response()->json(['error' => 'No autorizado'], 403);
            }

            Log::info("Generando predicciones para estudiante {$estudianteId} solicitado por usuario {$usuario->id}");

            // Disparar job para generar predicciones en background
            GenerarPrediccionesJob::dispatch($estudianteId);

            return response()->json([
                'success' => true,
                'message' => 'Generación de predicciones iniciada',
                'data' => [
                    'estudiante_id' => $estudianteId,
                    'estado' => 'procesando',
                    'timestamp' => now(),
                ],
            ], 202);

        } catch (\Exception $e) {
            Log::error("Error generando predicciones para estudiante {$estudianteId}: {$e->getMessage()}", [
                'exception' => $e,
            ]);

            return response()->json([
                'error' => 'Error al generar predicciones',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
