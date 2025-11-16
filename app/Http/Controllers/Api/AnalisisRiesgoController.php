<?php

namespace App\Http\Controllers\Api;

use App\Models\PrediccionRiesgo;
use App\Models\PrediccionCarrera;
use App\Models\PrediccionTendencia;
use App\Models\User;
use App\Models\Curso;
use App\Models\Calificacion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AnalisisRiesgoController extends Controller
{
    /**
     * Dashboard general con métricas de riesgo
     */
    public function dashboard(Request $request): JsonResponse
    {
        $this->authorize('viewAny', PrediccionRiesgo::class);

        $cursoId = $request->input('curso_id');
        $diasAtraso = $request->input('dias', 30);

        // Query base
        $query = PrediccionRiesgo::query()
            ->with('estudiante', 'curso')
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
     * Listar predicciones de riesgo con filtros
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', PrediccionRiesgo::class);

        $perPage = $request->input('per_page', 15);
        $cursoId = $request->input('curso_id');
        $nivelRiesgo = $request->input('nivel_riesgo');
        $buscar = $request->input('search');
        $ordenar = $request->input('order_by', 'fecha_prediccion');
        $direccion = $request->input('direction', 'desc');

        $query = PrediccionRiesgo::query()
            ->with('estudiante:id,name,email', 'curso:id,nombre')
            ->recientes(30);

        // Filtros
        if ($cursoId) {
            $query->byCurso($cursoId);
        }

        if ($nivelRiesgo) {
            $query->byNivelRiesgo($nivelRiesgo);
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

        return response()->json([
            'data' => $predicciones->items(),
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
     * Análisis detallado de un estudiante
     */
    public function porEstudiante(int $estudianteId, Request $request): JsonResponse
    {
        $this->authorize('view', PrediccionRiesgo::class);

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
        $recomendacionesCarrera = PrediccionCarrera::where('estudiante_id', $estudianteId)
            ->top3($estudianteId)
            ->get();

        // Tendencia
        $tendencia = PrediccionTendencia::where('estudiante_id', $estudianteId)
            ->latest('fecha_prediccion')
            ->first();

        // Calificaciones recientes del estudiante
        $calificacionesRecientes = Calificacion::where('estudiante_id', $estudianteId)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get(['id', 'puntaje', 'fecha', 'trabajo_id', 'created_at']);

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
        $this->authorize('viewAny', PrediccionRiesgo::class);

        $curso = Curso::findOrFail($cursoId);
        $diasAtraso = $request->input('dias', 30);

        $predicciones = PrediccionRiesgo::where('fk_curso_id', $cursoId)
            ->recientes($diasAtraso)
            ->with('estudiante')
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
                    'score' => $p->score_riesgo,
                ])
                ->values(),
            'medio' => $predicciones
                ->where('nivel_riesgo', 'medio')
                ->map(fn($p) => [
                    'estudiante_id' => $p->estudiante_id,
                    'nombre' => $p->estudiante?->name,
                    'score' => $p->score_riesgo,
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
                    'score_riesgo' => $p->score_riesgo,
                    'nivel_riesgo' => $p->nivel_riesgo,
                    'fecha_prediccion' => $p->fecha_prediccion,
                ])->sortByDesc('score_riesgo')->values(),
            ],
            'message' => 'Análisis por curso cargado exitosamente',
        ], 200);
    }

    /**
     * Análisis de tendencias generales
     */
    public function tendencias(Request $request): JsonResponse
    {
        $this->authorize('viewAny', PrediccionRiesgo::class);

        $cursoId = $request->input('curso_id');
        $diasAtraso = $request->input('dias', 90);

        $query = PrediccionRiesgo::query()->recientes($diasAtraso);

        if ($cursoId) {
            $query->byCurso($cursoId);
        }

        // Datos para gráfico de línea
        $datosTendencia = $query->selectRaw('DATE(fecha_prediccion) as fecha, AVG(score_riesgo) as score_promedio, COUNT(*) as total')
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get();

        // Distribución por tendencia de estudiantes
        $distribucionTendencia = PrediccionTendencia::query()
            ->when($cursoId, fn($q) => $q->byCurso($cursoId))
            ->recientes($diasAtraso)
            ->selectRaw('tendencia, COUNT(*) as cantidad')
            ->groupBy('tendencia')
            ->get()
            ->mapWithKeys(fn($item) => [$item->tendencia => $item->cantidad]);

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
        $this->authorize('view', PrediccionRiesgo::class);

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
        $this->authorize('update', PrediccionRiesgo::class);

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
        $this->authorize('create', PrediccionRiesgo::class);

        $estudiante = User::findOrFail($estudianteId);

        // Aquí se integraría con el servicio de ML
        // Por ahora, retornamos un placeholder

        return response()->json([
            'data' => [
                'estudiante_id' => $estudianteId,
                'mensaje' => 'Predicciones en proceso de generación',
            ],
            'message' => 'Solicitud de predicción enviada. Se procesará en background.',
        ], 202);
    }
}
