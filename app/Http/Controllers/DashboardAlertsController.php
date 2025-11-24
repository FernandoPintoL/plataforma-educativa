<?php

namespace App\Http\Controllers;

use App\Models\StudentAlert;
use App\Models\StudentHint;
use App\Models\RealTimeMonitoring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * DashboardAlertsController
 *
 * Controlador para mostrar el dashboard de alertas y sugerencias
 * Permite a estudiantes y profesores ver y gestionar alertas
 */
class DashboardAlertsController extends Controller
{
    /**
     * Dashboard del estudiante
     * Muestra sus alertas y sugerencias pendientes
     */
    public function dashboardEstudiante()
    {
        $user = Auth::user();

        // Obtener alertas pendientes del estudiante
        $alertasPendientes = StudentAlert::where('estudiante_id', $user->id)
            ->whereIn('estado', ['generada', 'notificada'])
            ->with(['trabajo', 'trabajo.contenido'])
            ->orderBy('fecha_generacion', 'desc')
            ->limit(10)
            ->get();

        // Obtener sugerencias pendientes del estudiante
        $sugerenciasPendientes = StudentHint::where('estudiante_id', $user->id)
            ->where('estado', '!=', 'ignorada')
            ->with(['trabajo', 'trabajo.contenido'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Obtener estadísticas de riesgo
        $estadisticasRecientes = RealTimeMonitoring::where('estudiante_id', $user->id)
            ->orderBy('timestamp', 'desc')
            ->limit(20)
            ->get();

        $nivelRiesgoActual = $estadisticasRecientes->first()?->nivel_riesgo ?? 'bajo';
        $scoreRiesgoPromedio = $estadisticasRecientes->avg('score_riesgo') ?? 0;
        $totalTiempo = $estadisticasRecientes->sum('duracion_evento') ?? 0;
        $progresoPromedio = $estadisticasRecientes->avg('progreso_estimado') ?? 0;

        // Contar alertas por severidad
        $alertasPorSeveridad = StudentAlert::where('estudiante_id', $user->id)
            ->whereIn('estado', ['generada', 'notificada'])
            ->select('severidad')
            ->selectRaw('count(*) as cantidad')
            ->groupBy('severidad')
            ->get()
            ->keyBy('severidad');

        return view('dashboard.alertas-estudiante', [
            'alertasPendientes' => $alertasPendientes,
            'sugerenciasPendientes' => $sugerenciasPendientes,
            'nivelRiesgoActual' => $nivelRiesgoActual,
            'scoreRiesgoPromedio' => round($scoreRiesgoPromedio, 2),
            'totalTiempoMinutos' => round($totalTiempo / 60, 1),
            'progresoPromedio' => round($progresoPromedio, 1),
            'alertasPorSeveridad' => $alertasPorSeveridad,
            'totalAlertas' => $alertasPendientes->count(),
            'totalSugerencias' => $sugerenciasPendientes->count(),
        ]);
    }

    /**
     * Dashboard del profesor
     * Muestra alertas de sus estudiantes
     */
    public function dashboardProfesor()
    {
        $user = Auth::user();

        // Obtener todos los trabajos del profesor
        $trabajosProfesor = \App\Models\Trabajo::where('profesor_id', $user->id)->pluck('id');

        // Obtener alertas pendientes de los estudiantes del profesor
        $alertasPendientes = StudentAlert::whereIn('trabajo_id', $trabajosProfesor)
            ->whereIn('estado', ['generada', 'notificada'])
            ->with(['trabajo', 'estudiante', 'trabajo.contenido'])
            ->orderBy('severidad', 'desc')
            ->orderBy('fecha_generacion', 'desc')
            ->limit(20)
            ->get();

        // Obtener estudiantes con alertas críticas
        $estudiantesEnRiesgo = StudentAlert::whereIn('trabajo_id', $trabajosProfesor)
            ->where('severidad', 'critica')
            ->whereIn('estado', ['generada', 'notificada'])
            ->select('estudiante_id')
            ->distinct()
            ->with('estudiante')
            ->get()
            ->pluck('estudiante')
            ->unique('id');

        // Estadísticas generales
        $totalAlertasActivas = StudentAlert::whereIn('trabajo_id', $trabajosProfesor)
            ->whereIn('estado', ['generada', 'notificada'])
            ->count();

        $totalAlertasIntervenidas = StudentAlert::whereIn('trabajo_id', $trabajosProfesor)
            ->where('estado', 'intervenida')
            ->where('fecha_intervencion', '>=', now()->subDays(7))
            ->count();

        $totalAlertasResueltas = StudentAlert::whereIn('trabajo_id', $trabajosProfesor)
            ->where('estado', 'resuelta')
            ->where('fecha_resolucion', '>=', now()->subDays(7))
            ->count();

        // Tendencias de alertas
        $tendenciaAlertasPorDia = StudentAlert::whereIn('trabajo_id', $trabajosProfesor)
            ->selectRaw('DATE(fecha_generacion) as fecha')
            ->selectRaw('count(*) as total')
            ->where('fecha_generacion', '>=', now()->subDays(30))
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get();

        return view('dashboard.alertas-profesor', [
            'alertasPendientes' => $alertasPendientes,
            'estudiantesEnRiesgo' => $estudiantesEnRiesgo,
            'totalAlertasActivas' => $totalAlertasActivas,
            'totalAlertasIntervenidas' => $totalAlertasIntervenidas,
            'totalAlertasResueltas' => $totalAlertasResueltas,
            'tendenciaAlertasPorDia' => $tendenciaAlertasPorDia,
        ]);
    }

    /**
     * Marcar sugerencia como utilizada
     */
    public function marcarSugerenciaUtilizada(Request $request, $sugerenciaId)
    {
        $user = Auth::user();
        $sugerencia = StudentHint::findOrFail($sugerenciaId);

        // Verificar que el estudiante sea el dueño de la sugerencia
        if ($sugerencia->estudiante_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'efectiva' => 'required|boolean',
        ]);

        $sugerencia->marcarComoUtilizada($validated['efectiva']);

        return response()->json([
            'success' => true,
            'message' => 'Sugerencia marcada como ' . ($validated['efectiva'] ? 'utilizada' : 'no efectiva'),
        ]);
    }

    /**
     * Intervenir en una alerta (solo profesor)
     */
    public function intervenirAlerta(Request $request, $alertaId)
    {
        $user = Auth::user();
        $alerta = StudentAlert::with('trabajo')->findOrFail($alertaId);

        // Verificar que el profesor sea dueño del trabajo
        if ($alerta->trabajo->profesor_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'accion' => 'nullable|string|max:500',
        ]);

        $alerta->marcarComoIntervenida($validated['accion'] ?? null);

        return response()->json([
            'success' => true,
            'message' => 'Alerta marcada como intervenida',
        ]);
    }

    /**
     * Resolver una alerta (solo profesor)
     */
    public function resolverAlerta(Request $request, $alertaId)
    {
        $user = Auth::user();
        $alerta = StudentAlert::with('trabajo')->findOrFail($alertaId);

        // Verificar que el profesor sea dueño del trabajo
        if ($alerta->trabajo->profesor_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'mejoro' => 'boolean',
            'impacto' => 'nullable|numeric|min:0|max:1',
        ]);

        $alerta->marcarComoResuelta(
            $validated['mejoro'] ?? false,
            $validated['impacto'] ?? null
        );

        return response()->json([
            'success' => true,
            'message' => 'Alerta marcada como resuelta',
        ]);
    }

    /**
     * Obtener detalles de una alerta
     */
    public function detalleAlerta($alertaId)
    {
        $user = Auth::user();
        $alerta = StudentAlert::with([
            'trabajo.contenido',
            'estudiante',
            'trabajo.estudiante'
        ])->findOrFail($alertaId);

        // Verificar permisos
        if ($alerta->estudiante_id === $user->id || $alerta->trabajo->profesor_id === $user->id) {
            return view('dashboard.detalle-alerta', [
                'alerta' => $alerta,
            ]);
        }

        abort(403);
    }

    /**
     * Obtener detalles de una sugerencia
     */
    public function detalleSugerencia($sugerenciaId)
    {
        $user = Auth::user();
        $sugerencia = StudentHint::with([
            'trabajo.contenido',
            'estudiante'
        ])->findOrFail($sugerenciaId);

        // Verificar permisos
        if ($sugerencia->estudiante_id === $user->id) {
            return view('dashboard.detalle-sugerencia', [
                'sugerencia' => $sugerencia,
            ]);
        }

        abort(403);
    }

    /**
     * Obtener estadísticas de un estudiante (para profesor)
     */
    public function estadisticasEstudiante(Request $request, $estudianteId)
    {
        $user = Auth::user();
        $estudiante = \App\Models\User::findOrFail($estudianteId);

        // Obtener trabajos del profesor para este estudiante
        $trabajosProfesor = \App\Models\Trabajo::where('profesor_id', $user->id)
            ->pluck('id');

        // Obtener alertas del estudiante en trabajos del profesor
        $alertas = StudentAlert::where('estudiante_id', $estudianteId)
            ->whereIn('trabajo_id', $trabajosProfesor)
            ->with('trabajo')
            ->orderBy('fecha_generacion', 'desc')
            ->get();

        // Obtener monitoreos del estudiante
        $monitoreos = RealTimeMonitoring::where('estudiante_id', $estudianteId)
            ->whereIn('trabajo_id', $trabajosProfesor)
            ->orderBy('timestamp', 'desc')
            ->limit(50)
            ->get();

        $estadisticas = [
            'total_alertas' => $alertas->count(),
            'alertas_activas' => $alertas->whereIn('estado', ['generada', 'notificada'])->count(),
            'alertas_intervenidas' => $alertas->where('estado', 'intervenida')->count(),
            'alertas_resueltas' => $alertas->where('estado', 'resuelta')->count(),
            'nivel_riesgo_promedio' => $monitoreos->avg('score_riesgo') ?? 0,
            'tiempo_total' => $monitoreos->sum('duracion_evento') ?? 0,
            'progreso_promedio' => $monitoreos->avg('progreso_estimado') ?? 0,
        ];

        return view('dashboard.estadisticas-estudiante', [
            'estudiante' => $estudiante,
            'alertas' => $alertas,
            'monitoreos' => $monitoreos,
            'estadisticas' => $estadisticas,
        ]);
    }
}
