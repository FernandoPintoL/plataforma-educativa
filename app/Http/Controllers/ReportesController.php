<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Curso;
use App\Models\Trabajo;
use App\Models\Calificacion;
use App\Models\RendimientoAcademico;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportesController extends Controller
{
    /**
     * Página principal de reportes
     */
    public function index()
    {
        $modulosSidebar = $this->getMenuItems();

        return Inertia::render('Reportes/Index', [
            'modulosSidebar' => $modulosSidebar,
        ]);
    }

    /**
     * Reportes de desempeño académico por estudiante
     */
    public function desempenioPorEstudiante()
    {
        $estudiantes = User::where('tipo_usuario', 'estudiante')
            ->with(['rendimientoAcademico', 'cursosComoEstudiante', 'trabajos.calificacion'])
            ->get();

        $reportes = $estudiantes->map(function ($estudiante) {
            $rendimiento = $estudiante->rendimientoAcademico;
            $trabajos = $estudiante->trabajos;
            $trabajosCalificados = $trabajos->filter(fn($t) => $t->calificacion !== null);
            $tasa_entrega = $trabajos->count() > 0
                ? round(($trabajosCalificados->count() / $trabajos->count()) * 100, 2)
                : 0;

            return [
                'id' => $estudiante->id,
                'nombre' => $estudiante->nombre_completo,
                'email' => $estudiante->email,
                'promedio' => $rendimiento?->promedio ?? 0,
                'cursos_inscritos' => $estudiante->cursosComoEstudiante->count(),
                'total_trabajos' => $trabajos->count(),
                'trabajos_calificados' => $trabajosCalificados->count(),
                'tasa_entrega' => $tasa_entrega,
                'fortalezas' => $rendimiento?->fortalezas ?? [],
                'debilidades' => $rendimiento?->debilidades ?? [],
                'tendencia' => $rendimiento?->tendencia_temporal ?? 'estable',
                'estado' => $this->getEstadoEstudiante($rendimiento?->promedio ?? 0),
                'ultima_actualizacion' => $rendimiento?->updated_at,
            ];
        })->sortByDesc('promedio')->values();

        $modulosSidebar = $this->getMenuItems();

        return Inertia::render('Reportes/DesempenioPorEstudiante', [
            'reportes' => $reportes,
            'estadisticas' => $this->calcularEstadisticasGenerales($reportes),
            'modulosSidebar' => $modulosSidebar,
        ]);
    }

    /**
     * Reportes de progreso por curso
     */
    public function progresoPorCurso()
    {
        $cursos = Curso::with(['estudiantes', 'profesor'])
            ->where('activo', true)
            ->get();

        $reportes = $cursos->map(function ($curso) {
            $estudiantes = $curso->estudiantes;
            $promedios = $estudiantes->map(function ($estudiante) {
                return $estudiante->rendimientoAcademico?->promedio ?? 0;
            })->filter(fn($p) => $p > 0);

            $promedio_curso = $promedios->count() > 0 ? round($promedios->avg(), 2) : 0;
            $max_promedio = $promedios->count() > 0 ? $promedios->max() : 0;
            $min_promedio = $promedios->count() > 0 ? $promedios->min() : 0;

            // Contar trabajos del curso
            $totalTrabajosAsignados = Trabajo::whereHas('contenido', function ($query) use ($curso) {
                $query->where('curso_id', $curso->id);
            })->count();

            $trabajosEntregados = Trabajo::whereHas('contenido', function ($query) use ($curso) {
                $query->where('curso_id', $curso->id);
            })->whereIn('estado', ['entregado', 'calificado'])->count();

            $tasa_entrega = $totalTrabajosAsignados > 0
                ? round(($trabajosEntregados / $totalTrabajosAsignados) * 100, 2)
                : 0;

            return [
                'id' => $curso->id,
                'nombre' => $curso->nombre,
                'codigo' => $curso->codigo ?? 'N/A',
                'profesor' => $curso->profesor?->nombre_completo ?? 'Sin asignar',
                'total_estudiantes' => $estudiantes->count(),
                'promedio_curso' => $promedio_curso,
                'promedio_maximo' => $max_promedio,
                'promedio_minimo' => $min_promedio,
                'tasa_entrega' => $tasa_entrega,
                'total_trabajos_asignados' => $totalTrabajosAsignados,
                'total_trabajos_entregados' => $trabajosEntregados,
                'estado' => $this->getEstadoCurso($promedio_curso, $estudiantes->count()),
                'ultima_actualizacion' => $curso->updated_at,
            ];
        })->sortByDesc('promedio_curso')->values();

        $modulosSidebar = $this->getMenuItems();

        return Inertia::render('Reportes/ProgresoPorCurso', [
            'reportes' => $reportes,
            'estadisticas' => $this->calcularEstadisticasCursos($reportes),
            'modulosSidebar' => $modulosSidebar,
        ]);
    }

    /**
     * Análisis comparativo y rankings
     */
    public function analisisComparativo()
    {
        $estudiantes = User::where('tipo_usuario', 'estudiante')
            ->with(['rendimientoAcademico', 'cursosComoEstudiante', 'trabajos.calificacion'])
            ->get();

        $reportes = $estudiantes->map(function ($estudiante) {
            $rendimiento = $estudiante->rendimientoAcademico;
            $trabajos = $estudiante->trabajos;
            $trabajosCalificados = $trabajos->filter(fn($t) => $t->calificacion !== null);

            return [
                'id' => $estudiante->id,
                'nombre' => $estudiante->nombre_completo,
                'promedio' => $rendimiento?->promedio ?? 0,
                'cursos' => $estudiante->cursosComoEstudiante->count(),
                'trabajos_entregados' => $trabajosCalificados->count(),
                'tendencia' => $rendimiento?->tendencia_temporal ?? 'estable',
            ];
        })->filter(fn($r) => $r['promedio'] > 0);

        // Ranking: Top 10 mejores estudiantes
        $topEstudiantes = $reportes->sortByDesc('promedio')->take(10)->values();

        // Ranking: Top 10 estudiantes en bajo desempeño
        $bottomEstudiantes = $reportes->sortBy('promedio')->take(10)->values();

        // Distribución por rango de promedios
        $distribucion = [
            'excelente' => $reportes->filter(fn($r) => $r['promedio'] >= 90)->count(),
            'bueno' => $reportes->filter(fn($r) => $r['promedio'] >= 80 && $r['promedio'] < 90)->count(),
            'regular' => $reportes->filter(fn($r) => $r['promedio'] >= 70 && $r['promedio'] < 80)->count(),
            'bajo' => $reportes->filter(fn($r) => $r['promedio'] < 70)->count(),
        ];

        // Análisis de tendencia
        $tendencia = [
            'mejorando' => $reportes->filter(fn($r) => $r['tendencia'] === 'mejorando')->count(),
            'estable' => $reportes->filter(fn($r) => $r['tendencia'] === 'estable')->count(),
            'decayendo' => $reportes->filter(fn($r) => $r['tendencia'] === 'decayendo')->count(),
        ];

        $modulosSidebar = $this->getMenuItems();

        return Inertia::render('Reportes/AnalisisComparativo', [
            'topEstudiantes' => $topEstudiantes,
            'bottomEstudiantes' => $bottomEstudiantes,
            'distribucion' => $distribucion,
            'tendencia' => $tendencia,
            'totalEstudiantes' => $reportes->count(),
            'promedioGeneral' => round($reportes->avg('promedio'), 2),
            'modulosSidebar' => $modulosSidebar,
        ]);
    }

    /**
     * Reportes integrados con análisis de riesgo
     */
    public function reportesRiesgo()
    {
        $modulosSidebar = $this->getMenuItems();

        // Obtener datos del análisis de riesgo
        $riesgoAlto = \App\Models\PrediccionRiesgo::where('risk_level', 'alto')->count();
        $riesgoMedio = \App\Models\PrediccionRiesgo::where('risk_level', 'medio')->count();
        $riesgoBajo = \App\Models\PrediccionRiesgo::where('risk_level', 'bajo')->count();

        $scorePromedio = \App\Models\PrediccionRiesgo::avg('risk_score') ?? 0;

        // Estudiantes con mayor riesgo
        $estudiantesMayorRiesgo = \App\Models\PrediccionRiesgo::query()
            ->with('estudiante')
            ->where('risk_level', 'alto')
            ->orderByDesc('risk_score')
            ->limit(10)
            ->get()
            ->map(function ($pred) {
                return [
                    'id' => $pred->estudiante_id,
                    'nombre' => $pred->estudiante?->name ?? 'N/A',
                    'score_riesgo' => round($pred->risk_score, 3),
                    'confianza' => round($pred->confidence_score, 3),
                    'fecha_prediccion' => $pred->fecha_prediccion,
                ];
            });

        // Tendencias de riesgo
        $tendencias = \App\Models\PrediccionTendencia::query()
            ->selectRaw('tendencia, COUNT(*) as cantidad')
            ->groupBy('tendencia')
            ->get()
            ->mapWithKeys(fn($item) => [$item->tendencia => $item->cantidad]);

        // Recomendaciones de carrera más frecuentes
        $carrerasTop = \App\Models\PrediccionCarrera::query()
            ->selectRaw('carrera_nombre, COUNT(*) as cantidad, AVG(compatibilidad) as compatibilidad_promedio')
            ->groupBy('carrera_nombre')
            ->orderByDesc('cantidad')
            ->limit(5)
            ->get();

        return Inertia::render('Reportes/ReportesRiesgo', [
            'estadisticas_riesgo' => [
                'total_predicciones' => $riesgoAlto + $riesgoMedio + $riesgoBajo,
                'riesgo_alto' => $riesgoAlto,
                'riesgo_medio' => $riesgoMedio,
                'riesgo_bajo' => $riesgoBajo,
                'score_promedio' => round($scorePromedio, 3),
            ],
            'estudiantes_mayor_riesgo' => $estudiantesMayorRiesgo,
            'distribucion_riesgo' => [
                'alto' => $riesgoAlto,
                'medio' => $riesgoMedio,
                'bajo' => $riesgoBajo,
            ],
            'tendencias' => [
                'mejorando' => $tendencias->get('mejorando', 0),
                'estable' => $tendencias->get('estable', 0),
                'declinando' => $tendencias->get('declinando', 0),
                'fluctuando' => $tendencias->get('fluctuando', 0),
            ],
            'carreras_recomendadas' => $carrerasTop->map(fn($c) => [
                'nombre' => $c->carrera_nombre,
                'cantidad' => $c->cantidad,
                'compatibilidad_promedio' => round($c->compatibilidad_promedio, 3),
            ]),
            'modulosSidebar' => $modulosSidebar,
        ]);
    }

    /**
     * Métricas institucionales
     */
    public function metricasInstitucionales()
    {
        // Estadísticas generales
        $totalEstudiantes = User::where('tipo_usuario', 'estudiante')->count();
        $totalProfesores = User::where('tipo_usuario', 'profesor')->count();
        $totalPadres = User::where('tipo_usuario', 'padre')->count();
        $totalCursos = Curso::where('activo', true)->count();

        // Promedios generales
        $promedioGeneral = RendimientoAcademico::avg('promedio') ?? 0;

        // Trabajos entregados vs pendientes
        $trabajosTotales = Trabajo::count();
        $trabajosEntregados = Trabajo::whereIn('estado', ['entregado', 'calificado'])->count();
        $trabajosPendientes = Trabajo::whereIn('estado', ['en_progreso', 'no_entregado'])->count();
        $tasaEntregaGeneral = $trabajosTotales > 0
            ? round(($trabajosEntregados / $trabajosTotales) * 100, 2)
            : 0;

        // Distribución de desempeño
        $estudiantes = User::where('tipo_usuario', 'estudiante')
            ->with('rendimientoAcademico')
            ->get();

        $desempenioPorEstudiante = $estudiantes->map(fn($e) => $e->rendimientoAcademico?->promedio ?? 0)
            ->filter(fn($p) => $p > 0);

        $distribucionDesempeno = [
            'excelente' => $desempenioPorEstudiante->filter(fn($p) => $p >= 90)->count(),
            'bueno' => $desempenioPorEstudiante->filter(fn($p) => $p >= 80 && $p < 90)->count(),
            'regular' => $desempenioPorEstudiante->filter(fn($p) => $p >= 70 && $p < 80)->count(),
            'bajo' => $desempenioPorEstudiante->filter(fn($p) => $p < 70)->count(),
        ];

        // Actividad reciente (últimos 7 días)
        $actividadReciente = [
            'trabajos_entregados_semana' => Trabajo::where('created_at', '>=', Carbon::now()->subDays(7))
                ->whereIn('estado', ['entregado', 'calificado'])
                ->count(),
            'calificaciones_semana' => Calificacion::where('created_at', '>=', Carbon::now()->subDays(7))->count(),
            'usuarios_nuevos_semana' => User::where('created_at', '>=', Carbon::now()->subDays(7))->count(),
        ];

        // Crecimiento mensual (últimos 6 meses)
        $crecimientoMensual = collect();
        for ($i = 5; $i >= 0; $i--) {
            $mes = Carbon::now()->subMonths($i);
            $crecimientoMensual->push([
                'mes' => $mes->format('M'),
                'estudiantes' => User::where('tipo_usuario', 'estudiante')
                    ->whereMonth('created_at', $mes->month)
                    ->whereYear('created_at', $mes->year)
                    ->count(),
                'calificaciones' => Calificacion::whereMonth('created_at', $mes->month)
                    ->whereYear('created_at', $mes->year)
                    ->count(),
            ]);
        }

        $modulosSidebar = $this->getMenuItems();

        return Inertia::render('Reportes/MetricasInstitucionales', [
            'estadisticas' => [
                'total_estudiantes' => $totalEstudiantes,
                'total_profesores' => $totalProfesores,
                'total_padres' => $totalPadres,
                'total_cursos' => $totalCursos,
            ],
            'desempeno' => [
                'promedio_general' => round($promedioGeneral, 2),
                'trabajos_totales' => $trabajosTotales,
                'trabajos_entregados' => $trabajosEntregados,
                'trabajos_pendientes' => $trabajosPendientes,
                'tasa_entrega' => $tasaEntregaGeneral,
            ],
            'distribucion' => $distribucionDesempeno,
            'actividad_reciente' => $actividadReciente,
            'crecimiento_mensual' => $crecimientoMensual,
            'modulosSidebar' => $modulosSidebar,
        ]);
    }

    /**
     * Obtener elementos del menú sidebar filtrados por permisos del usuario actual
     */
    private function getMenuItems()
    {
        $modulos = \App\Models\ModuloSidebar::obtenerParaSidebar();
        return $modulos->map(function ($modulo) {
            return $modulo->toNavItem();
        })->values()->toArray();
    }

    /**
     * Calcular estado del estudiante
     */
    private function getEstadoEstudiante($promedio)
    {
        if ($promedio >= 90) return 'excelente';
        if ($promedio >= 80) return 'bueno';
        if ($promedio >= 70) return 'regular';
        return 'bajo';
    }

    /**
     * Calcular estado del curso
     */
    private function getEstadoCurso($promedio, $totalEstudiantes)
    {
        if ($totalEstudiantes === 0) return 'sin_estudiantes';
        if ($promedio >= 85) return 'excelente';
        if ($promedio >= 75) return 'bueno';
        if ($promedio >= 65) return 'regular';
        return 'bajo';
    }

    /**
     * Calcular estadísticas generales de desempeño
     */
    private function calcularEstadisticasGenerales($reportes)
    {
        return [
            'total_estudiantes' => $reportes->count(),
            'promedio_general' => round($reportes->avg('promedio'), 2),
            'promedio_maximo' => round($reportes->max('promedio'), 2),
            'promedio_minimo' => round($reportes->min('promedio'), 2),
            'tasa_entrega_promedio' => round($reportes->avg('tasa_entrega'), 2),
            'estudiantes_excelentes' => $reportes->filter(fn($r) => $r['promedio'] >= 90)->count(),
            'estudiantes_buenos' => $reportes->filter(fn($r) => $r['promedio'] >= 80 && $r['promedio'] < 90)->count(),
            'estudiantes_regulares' => $reportes->filter(fn($r) => $r['promedio'] >= 70 && $r['promedio'] < 80)->count(),
            'estudiantes_bajos' => $reportes->filter(fn($r) => $r['promedio'] < 70)->count(),
        ];
    }

    /**
     * Calcular estadísticas de cursos
     */
    private function calcularEstadisticasCursos($reportes)
    {
        return [
            'total_cursos' => $reportes->count(),
            'promedio_general' => round($reportes->avg('promedio_curso'), 2),
            'promedio_maximo' => round($reportes->max('promedio_curso'), 2),
            'promedio_minimo' => round($reportes->min('promedio_curso'), 2),
            'tasa_entrega_promedio' => round($reportes->avg('tasa_entrega'), 2),
            'total_estudiantes' => $reportes->sum('total_estudiantes'),
            'total_trabajos' => $reportes->sum('total_trabajos_asignados'),
        ];
    }
}
