<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Curso;
use App\Models\Trabajo;
use App\Models\Calificacion;
use App\Models\RendimientoAcademico;
use App\Services\MLIntegrationService;
use App\Services\StudentProgressMonitor;
use App\Services\MLMetricsService;
use App\Services\AnomalyDetectionService;
use App\Services\AgentSynthesisService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportesController extends Controller
{
    protected MLIntegrationService $mlService;
    protected StudentProgressMonitor $progressMonitor;
    protected MLMetricsService $metricsService;
    protected AnomalyDetectionService $anomalyService;
    protected AgentSynthesisService $agentService;

    public function __construct(
        MLIntegrationService $mlService,
        StudentProgressMonitor $progressMonitor,
        MLMetricsService $metricsService,
        AnomalyDetectionService $anomalyService,
        AgentSynthesisService $agentService
    ) {
        $this->mlService = $mlService;
        $this->progressMonitor = $progressMonitor;
        $this->metricsService = $metricsService;
        $this->anomalyService = $anomalyService;
        $this->agentService = $agentService;
    }
    /**
     * Página principal de reportes
     */
    public function index()
    {
        $modulosSidebar = $this->getMenuItems();

        return Inertia::render('reportes/Index', [
            'modulosSidebar' => $modulosSidebar,
            'reportesLinks' => [
                'desempeno' => route('reportes.desempeno'),
                'cursos' => route('reportes.cursos'),
                'analisis' => route('reportes.analisis'),
                'riesgo' => route('reportes.riesgo'),
                'metricas' => route('reportes.metricas'),
            ],
        ]);
    }

    /**
     * Reportes de desempeño académico por estudiante (ENRIQUECIDO CON ML)
     */
    public function desempenioPorEstudiante()
    {
        $estudiantes = User::where('tipo_usuario', 'estudiante')
            ->with(['rendimientoAcademico', 'cursosComoEstudiante', 'trabajos.calificacion'])
            ->get();

        // OPTIMIZACIÓN: Limitar síntesis Agent a top 10 estudiantes de riesgo
        // Esto evita timeouts al procesar reportes grandes
        $estudiante_ids_agent = [];

        $reportes = $estudiantes->map(function ($estudiante) use (&$estudiante_ids_agent) {
            try {
                $rendimiento = $estudiante->rendimientoAcademico;
                $trabajos = $estudiante->trabajos;
                $trabajosCalificados = $trabajos->filter(fn($t) => $t->calificacion !== null);
                $tasa_entrega = $trabajos->count() > 0
                    ? round(($trabajosCalificados->count() / $trabajos->count()) * 100, 2)
                    : 0;

                $reporte = [
                    'id' => $estudiante->id,
                    'nombre' => $estudiante->nombre_completo,
                    'email' => $estudiante->email,
                    'promedio' => (float)($rendimiento?->promedio ?? 0),
                    'cursos_inscritos' => $estudiante->cursosComoEstudiante->count(),
                    'total_trabajos' => $trabajos->count(),
                    'trabajos_calificados' => $trabajosCalificados->count(),
                    'tasa_entrega' => $tasa_entrega,
                    'fortalezas' => $rendimiento?->fortalezas ?? [],
                    'debilidades' => $rendimiento?->debilidades ?? [],
                    'tendencia' => $rendimiento?->tendencia_temporal ?? 'estable',
                    'estado' => $this->getEstadoEstudiante((float)($rendimiento?->promedio ?? 0)),
                    'ultima_actualizacion' => $rendimiento?->updated_at,
                    // Inicializar campos para síntesis posterior
                    'agent_synthesis' => null,
                    'anomalias_detectadas' => null,
                    'tiene_anomalias' => false,
                ];

                // ENRIQUECIMIENTO ML: Obtener predicciones integradas
                $prediccion_ml = $this->mlService->predictStudent($estudiante);
                if ($prediccion_ml['success']) {
                    $predictions = $prediccion_ml['predictions'] ?? [];

                    // Riesgo predicho (supervisado)
                    if (isset($predictions['risk'])) {
                        $riesgo = $predictions['risk'];
                        $reporte['riesgo_predicho'] = $riesgo['score_riesgo'] ?? 0;
                        $reporte['riesgo_nivel'] = $riesgo['nivel_riesgo'] ?? 'medio';
                        $reporte['riesgo_confianza'] = round($riesgo['confianza'] ?? 0, 3);
                        $reporte['riesgo_escalado'] = $riesgo['anomaly_escalation'] ?? false;
                    }

                    // Tendencia predicha
                    if (isset($predictions['tendencia'])) {
                        $tendencia = $predictions['tendencia'];
                        $reporte['tendencia_predicha'] = $tendencia['prediccion'] ?? 'estable';
                    }

                    // Cluster (no supervisado)
                    if (isset($predictions['cluster'])) {
                        $cluster = $predictions['cluster'];
                        $reporte['cluster_id'] = $cluster['cluster'] ?? null;
                        $reporte['cluster_probabilidad'] = $cluster['cluster_probability'] ?? 0;
                    }
                }

                // DETECCIÓN DE ANOMALÍAS
                try {
                    $anomalias = $this->anomalyService->detectAllAnomalies(1);

                    // Validar que anomalias es un array y contiene items válidos
                    if (is_array($anomalias) && !empty($anomalias)) {
                        $estudianteAnomalias = [];
                        foreach ($anomalias as $anomalia) {
                            // Validar que cada anomalía es un array con la estructura correcta
                            if (is_array($anomalia) && isset($anomalia['student_id']) && $anomalia['student_id'] === $estudiante->id) {
                                $estudianteAnomalias[] = $anomalia;
                            }
                        }

                        if (!empty($estudianteAnomalias)) {
                            $reporte['anomalias_detectadas'] = $estudianteAnomalias;
                            $reporte['tiene_anomalias'] = true;
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning("Error detectando anomalías para estudiante {$estudiante->id}: {$e->getMessage()}");
                }

                // OPTIMIZACIÓN: Registrar todos los estudiantes para síntesis posterior (se procesan top 10 de riesgo)
                $estudiante_ids_agent[] = [
                    'id' => $estudiante->id,
                    'riesgo' => $reporte['riesgo_predicho'] ?? 0
                ];

                return $reporte;

            } catch (\Exception $e) {
                Log::error("Error al procesar predicción ML para estudiante {$estudiante->id}: {$e->getMessage()}");

                // Retornar reporte básico si ML falla
                return [
                    'id' => $estudiante->id,
                    'nombre' => $estudiante->nombre_completo,
                    'email' => $estudiante->email,
                    'promedio' => 0,
                    'estado' => 'sin_datos',
                    'ml_error' => true,
                ];
            }
        })->sortByDesc('promedio')->values()->toArray();

        // NOTA: La síntesis Agent se carga bajo demanda (lazy loading) via endpoint separado
        // Esto evita timeouts cuando se procesan muchos estudiantes

        // Convertir de vuelta a Collection para métodos de estadísticas
        $reportesCollection = collect($reportes);

        $modulosSidebar = $this->getMenuItems();

        return Inertia::render('reportes/DesempenioPorEstudiante', [
            'reportes' => $reportes,
            'estadisticas' => $this->calcularEstadisticasGenerales($reportesCollection),
            'estadisticas_ml' => $this->calcularEstadisticasML($reportesCollection),
            'modulosSidebar' => $modulosSidebar,
        ]);
    }

    /**
     * Reportes de progreso por curso
     */
    public function progresoPorCurso()
    {
        $cursos = Curso::with(['estudiantes', 'profesor'])
            ->where('estado', 'activo')
            ->get();

        $reportes = $cursos->map(function ($curso) {
            $estudiantes = $curso->estudiantes;
            $promedios = $estudiantes->map(function ($estudiante) {
                return $estudiante->rendimientoAcademico?->promedio ?? 0;
            })->filter(fn($p) => $p > 0);

            $promedio_curso = $promedios->count() > 0 ? (float)round($promedios->avg(), 2) : 0;
            $max_promedio = $promedios->count() > 0 ? (float)$promedios->max() : 0;
            $min_promedio = $promedios->count() > 0 ? (float)$promedios->min() : 0;

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

        return Inertia::render('reportes/ProgresoPorCurso', [
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
                'promedio' => (float)($rendimiento?->promedio ?? 0),
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

        return Inertia::render('reportes/AnalisisComparativo', [
            'topEstudiantes' => $topEstudiantes,
            'bottomEstudiantes' => $bottomEstudiantes,
            'distribucion' => $distribucion,
            'tendencia' => $tendencia,
            'totalEstudiantes' => $reportes->count(),
            'promedioGeneral' => (float)round($reportes->avg('promedio'), 2),
            'modulosSidebar' => $modulosSidebar,
        ]);
    }

    /**
     * Reportes integrados con análisis de riesgo (ML-POWERED)
     */
    public function reportesRiesgo()
    {
        try {
            $modulosSidebar = $this->getMenuItems();

            // CORRECCIÓN: Leer DIRECTAMENTE de PrediccionRiesgo en lugar de generar on-demand
            // Obtener todas las predicciones de riesgo con datos del estudiante
            $predicciones_bd = \App\Models\PrediccionRiesgo::with('estudiante')
                ->orderBy('score_riesgo', 'desc')
                ->get();

            $predicciones_riesgo = [];
            $estudiantes_mayor_riesgo = [];

            foreach ($predicciones_bd as $pred) {
                $estudiante = $pred->estudiante;

                if (!$estudiante) {
                    continue;
                }

                $score = $pred->score_riesgo ?? 0;
                $nivel = $pred->nivel_riesgo ?? 'medio';

                $predicciones_riesgo[] = [
                    'estudiante_id' => $estudiante->id,
                    'nombre' => $estudiante->nombre_completo,
                    'score_riesgo' => round($score, 3),
                    'nivel_riesgo' => $nivel,
                    'confianza' => round($pred->confianza ?? 0, 3),
                    'escalado_anomalia' => false,
                    'razon_escalada' => null,
                ];

                // Detectar estudiantes de alto riesgo
                if ($nivel === 'alto') {
                    // Obtener la razón del riesgo basado en el score
                    $razon_riesgo = $this->obtenerRazonRiesgo($pred, $estudiante);

                    // Determinar el tipo de riesgo
                    $tipo_riesgo = $this->determinarTipoRiesgo($razon_riesgo, $score);

                    $estudiantes_mayor_riesgo[] = [
                        'id' => $estudiante->id,
                        'nombre' => $estudiante->nombre_completo,
                        'score_riesgo' => round($score, 3),
                        'confianza' => round($pred->confianza ?? 0, 3),
                        'fecha_prediccion' => $pred->fecha_prediccion ? $pred->fecha_prediccion->format('Y-m-d') : date('Y-m-d'),
                        'razon' => $razon_riesgo,
                        'descripcion_riesgo' => $this->obtenerDescripcionRiesgo($score),
                        'tipo_riesgo' => $tipo_riesgo['tipo'],
                        'icono_riesgo' => $tipo_riesgo['icono'],
                        'color_riesgo' => $tipo_riesgo['color'],
                        'text_color_riesgo' => $tipo_riesgo['text_color'],
                    ];
                }
            }

            // Ordenar por riesgo y tomar top 10
            usort($estudiantes_mayor_riesgo, fn($a, $b) => $b['score_riesgo'] <=> $a['score_riesgo']);
            $estudiantes_mayor_riesgo = array_slice($estudiantes_mayor_riesgo, 0, 10);

            // SÍNTESIS COLECTIVA DE RIESGOS CON AGENT
            $sintesis_colectiva = null;
            try {
                // Para los 5 estudiantes de mayor riesgo, obtener síntesis detallada
                $top5Riesgo = array_slice($estudiantes_mayor_riesgo, 0, 5);

                if (!empty($top5Riesgo)) {
                    $sintesis_estudiantes = [];

                    foreach ($top5Riesgo as $estudianteRiesgo) {
                        try {
                            $analysis = $this->agentService->getIntegratedStudentAnalysis($estudianteRiesgo['id']);

                            if ($analysis['success']) {
                                $sintesis_estudiantes[] = [
                                    'estudiante_id' => $estudianteRiesgo['id'],
                                    'estudiante_nombre' => $estudianteRiesgo['nombre'],
                                    'insights' => $analysis['synthesis']['key_insights'] ?? [],
                                    'acciones' => array_slice($analysis['intervention_strategy']['actions'] ?? [], 0, 2),
                                ];
                            }
                        } catch (\Exception $e) {
                            Log::warning("Error en síntesis de estudiante {$estudianteRiesgo['id']}: {$e->getMessage()}");
                        }
                    }

                    $sintesis_colectiva = [
                        'total_analizados' => count($sintesis_estudiantes),
                        'estudiantes' => $sintesis_estudiantes,
                        'patron_comun' => $this->detectarPatronComunRiesgo($sintesis_estudiantes),
                    ];

                    Log::info("Síntesis colectiva completada para {$sintesis_colectiva['total_analizados']} estudiantes de alto riesgo");
                }
            } catch (\Exception $e) {
                Log::warning("Síntesis colectiva falló: {$e->getMessage()}");
            }

            // Calcular distribución de riesgos
            $distribucion = [
                'alto' => count(array_filter($predicciones_riesgo, fn($p) => $p['nivel_riesgo'] === 'alto')),
                'medio' => count(array_filter($predicciones_riesgo, fn($p) => $p['nivel_riesgo'] === 'medio')),
                'bajo' => count(array_filter($predicciones_riesgo, fn($p) => $p['nivel_riesgo'] === 'bajo')),
            ];

            $total_pred = count($predicciones_riesgo);
            $score_promedio = $total_pred > 0
                ? array_sum(array_column($predicciones_riesgo, 'score_riesgo')) / $total_pred
                : 0;

            // Obtener métricas ML del servicio
            $metricas_ml = $this->metricsService->getPerformanceSummary(30);

            // CORRECCIÓN: Obtener distribución de tendencias para gráfico
            $tendencias_data = [
                'mejorando' => 0,
                'estable' => 0,
                'declinando' => 0,
                'fluctuando' => 0,
            ];

            try {
                // Intentar obtener datos de PrediccionTendencia si existen
                $predicciones_tendencia = \App\Models\PrediccionTendencia::selectRaw('tendencia, COUNT(*) as cantidad')
                    ->groupBy('tendencia')
                    ->get();

                foreach ($predicciones_tendencia as $pred_tend) {
                    $tendencias_data[$pred_tend->tendencia] = $pred_tend->cantidad;
                }
            } catch (\Exception $e) {
                Log::info("No se pudieron obtener predicciones de tendencia: {$e->getMessage()}");
                // Mantener valores por defecto de cero
            }

            return Inertia::render('reportes/ReportesRiesgo', [
                'estadisticas_riesgo' => [
                    'total_predicciones' => $total_pred,
                    'riesgo_alto' => $distribucion['alto'],
                    'riesgo_medio' => $distribucion['medio'],
                    'riesgo_bajo' => $distribucion['bajo'],
                    'score_promedio' => round($score_promedio, 3),
                    'porcentaje_alto_riesgo' => round(($distribucion['alto'] / max($total_pred, 1)) * 100, 2),
                ],
                'estudiantes_mayor_riesgo' => $estudiantes_mayor_riesgo,
                'distribucion_riesgo' => $distribucion,
                'tendencias' => $tendencias_data, // CORRECCIÓN: Agregar datos de tendencias
                'carreras_recomendadas' => [], // TODO: Agregar recomendaciones de carreras
                'metricas_modelo_ml' => $metricas_ml['success'] ? [
                    'accuracy_general' => $metricas_ml['overall_accuracy'] ?? 0,
                    'confianza_promedio' => $metricas_ml['average_confidence'] ?? 0,
                    'error_promedio' => $metricas_ml['average_error_percentage'] ?? 0,
                ] : null,
                'sintesis_colectiva_ia' => $sintesis_colectiva,
                'modulosSidebar' => $modulosSidebar,
            ]);

        } catch (\Exception $e) {
            Log::error("Error en reportes de riesgo: {$e->getMessage()}");

            return Inertia::render('reportes/ReportesRiesgo', [
                'error' => 'Error al generar reportes de riesgo',
                'modulosSidebar' => $this->getMenuItems(),
            ]);
        }
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
        $totalCursos = Curso::where('estado', 'activo')->count();

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

        return Inertia::render('reportes/MetricasInstitucionales', [
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

    /**
     * Calcular estadísticas enriquecidas con ML
     */
    private function calcularEstadisticasML($reportes)
    {
        $estudiantes_riesgo_alto = $reportes->where('riesgo_nivel', 'alto')->count();
        $estudiantes_riesgo_medio = $reportes->where('riesgo_nivel', 'medio')->count();
        $estudiantes_riesgo_bajo = $reportes->where('riesgo_nivel', 'bajo')->count();
        $estudiantes_con_anomalias = $reportes->where('tiene_anomalias', true)->count();

        $total_riesgo = $estudiantes_riesgo_alto + $estudiantes_riesgo_medio + $estudiantes_riesgo_bajo;

        return [
            'total_estudiantes_evaluados' => $total_riesgo,
            'distribucion_riesgo' => [
                'alto' => $estudiantes_riesgo_alto,
                'medio' => $estudiantes_riesgo_medio,
                'bajo' => $estudiantes_riesgo_bajo,
            ],
            'porcentaje_alto_riesgo' => $total_riesgo > 0
                ? round(($estudiantes_riesgo_alto / $total_riesgo) * 100, 2)
                : 0,
            'estudiantes_con_anomalias' => $estudiantes_con_anomalias,
            'porcentaje_anomalias' => $total_riesgo > 0
                ? round(($estudiantes_con_anomalias / $total_riesgo) * 100, 2)
                : 0,
            'riesgo_promedio' => round(
                $reportes->where('riesgo_predicho', '>', 0)
                    ->avg('riesgo_predicho') ?? 0,
                3
            ),
        ];
    }

    /**
     * Obtener síntesis de Agent para un estudiante (Lazy Loading via API)
     * GET /api/reportes/student/{studentId}/synthesis
     */
    public function getStudentSynthesis($studentId)
    {
        try {
            Log::info("Solicitando síntesis Agent para estudiante {$studentId}");

            $agentAnalysis = $this->agentService->getIntegratedStudentAnalysis($studentId);

            if ($agentAnalysis['success']) {
                // Extraer insights - pueden estar en 'key_insights' o 'insights'
                $synthesis = $agentAnalysis['synthesis'];
                $key_insights = $synthesis['key_insights'] ?? $synthesis['synthesis']['insights'] ?? $synthesis['insights'] ?? [];

                return response()->json([
                    'success' => true,
                    'synthesis' => [
                        'key_insights' => $key_insights,
                        'recommendations' => $synthesis['recommendations'] ?? $synthesis['synthesis']['recommendations'] ?? [],
                        'intervention_actions' => $agentAnalysis['intervention_strategy']['actions'] ?? [],
                        'confidence' => $synthesis['confidence'] ?? 0,
                        'method' => $agentAnalysis['method']
                    ]
                ], 200);
            } else {
                Log::warning("Síntesis Agent falló para estudiante {$studentId}");
                return response()->json([
                    'success' => false,
                    'message' => 'No se pudo obtener síntesis del Agent'
                ], 422);
            }
        } catch (\Exception $e) {
            Log::error("Error obteniendo síntesis para estudiante {$studentId}: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la síntesis: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Interpretar nivel de riesgo con contexto del Agent
     */
    private function interpretarRiesgoConAgent(float $scoreRiesgo, array $agentAnalysis): array
    {
        $insights = $agentAnalysis['synthesis']['key_insights'] ?? [];
        $actions = $agentAnalysis['intervention_strategy']['actions'] ?? [];

        return [
            'score' => $scoreRiesgo,
            'nivel' => $scoreRiesgo > 0.7 ? 'alto' : ($scoreRiesgo > 0.4 ? 'medio' : 'bajo'),
            'explicacion_ia' => implode('. ', array_slice($insights, 0, 2)),
            'acciones_sugeridas' => array_slice($actions, 0, 3),
            'requiere_atencion_inmediata' => $scoreRiesgo > 0.8,
        ];
    }

    /**
     * Detectar patrón común en estudiantes de alto riesgo
     */
    private function detectarPatronComunRiesgo(array $sintesis): array
    {
        if (empty($sintesis)) {
            return ['patron' => 'No hay suficientes datos', 'frecuencia' => 0];
        }

        // Analizar insights comunes
        $palabras_frecuentes = [];
        foreach ($sintesis as $item) {
            foreach ($item['insights'] as $insight) {
                $palabras = explode(' ', strtolower($insight));
                foreach ($palabras as $palabra) {
                    if (strlen($palabra) > 5) { // Solo palabras significativas
                        $palabras_frecuentes[$palabra] = ($palabras_frecuentes[$palabra] ?? 0) + 1;
                    }
                }
            }
        }

        arsort($palabras_frecuentes);
        $patron_principal = array_key_first($palabras_frecuentes) ?? 'No detectado';

        return [
            'patron' => ucfirst($patron_principal),
            'frecuencia' => $palabras_frecuentes[$patron_principal] ?? 0,
            'palabras_clave' => array_slice(array_keys($palabras_frecuentes), 0, 5),
        ];
    }

    /**
     * Obtener la razón específica del riesgo del estudiante
     */
    private function obtenerRazonRiesgo($prediccion, $estudiante): string
    {
        try {
            // Obtener rendimiento académico del estudiante
            $rendimiento = $estudiante->rendimientoAcademico()
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$rendimiento) {
                return 'Datos insuficientes para análisis';
            }

            $promedio = $rendimiento->promedio ?? 0;
            $asistencia = $rendimiento->asistencia ?? 0;
            $tareas_completadas = $rendimiento->tareas_completadas ?? 0;

            // Determinar razón principal basada en métricas
            $razones = [];

            if ($promedio < 3.0) {
                $razones[] = 'Promedio muy bajo (' . round($promedio, 2) . ')';
            } elseif ($promedio < 3.5) {
                $razones[] = 'Promedio bajo (' . round($promedio, 2) . ')';
            }

            if ($asistencia < 70) {
                $razones[] = 'Baja asistencia (' . round($asistencia, 1) . '%)';
            } elseif ($asistencia < 80) {
                $razones[] = 'Asistencia insuficiente (' . round($asistencia, 1) . '%)';
            }

            if ($tareas_completadas < 50) {
                $razones[] = 'Pocas tareas completadas';
            }

            if (empty($razones)) {
                $razones[] = 'Riesgo detectado por modelo de ML';
            }

            return implode(' | ', array_slice($razones, 0, 2)); // Top 2 razones
        } catch (\Exception $e) {
            return 'Riesgo detectado por modelo supervisado';
        }
    }

    /**
     * Obtener descripción clara del nivel de riesgo
     */
    private function obtenerDescripcionRiesgo(float $score): string
    {
        if ($score >= 0.85) {
            return 'Riesgo Crítico - Requiere atención inmediata';
        } elseif ($score >= 0.70) {
            return 'Riesgo Alto - Intervención recomendada';
        } elseif ($score >= 0.50) {
            return 'Riesgo Moderado - Monitoreo necesario';
        } else {
            return 'Riesgo Bajo - Seguimiento regular';
        }
    }

    /**
     * Determinar el tipo principal de riesgo basado en las razones detectadas
     */
    private function determinarTipoRiesgo(string $razon, float $score): array
    {
        // Analizar la razón para determinar tipo
        $razon_lower = strtolower($razon);

        // Determinamos el tipo y el icono basado en lo que detectamos
        if (strpos($razon_lower, 'asistencia') !== false) {
            $tipo = 'Abandono';
            $icono = '⚠️';
            $color = 'bg-orange-50 border-orange-200';
            $text_color = 'text-orange-700';
        } elseif (strpos($razon_lower, 'promedio') !== false || strpos($razon_lower, 'tareas') !== false) {
            $tipo = 'Desempeño';
            $icono = '📈';
            $color = 'bg-red-50 border-red-200';
            $text_color = 'text-red-700';
        } else {
            // Default: considerar el nivel del score
            if ($score >= 0.85) {
                $tipo = 'Crítico';
                $icono = '🔴';
                $color = 'bg-red-50 border-red-200';
                $text_color = 'text-red-700';
            } else {
                $tipo = 'Académico';
                $icono = '📊';
                $color = 'bg-yellow-50 border-yellow-200';
                $text_color = 'text-yellow-700';
            }
        }

        return [
            'tipo' => $tipo,
            'icono' => $icono,
            'color' => $color,
            'text_color' => $text_color,
        ];
    }
}
