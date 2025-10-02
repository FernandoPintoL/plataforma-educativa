<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\Tarea;
use App\Models\Trabajo;
use App\Models\Evaluacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardProfesorController extends Controller
{
    public function index()
    {
        $profesor = Auth::user();

        // Obtener cursos del profesor
        $cursos = Curso::where('profesor_id', $profesor->id)
            ->withCount('estudiantes')
            ->get();

        // Estadísticas generales
        $estadisticas = [
            'total_cursos' => $cursos->count(),
            'total_estudiantes' => $cursos->sum('estudiantes_count'),
            'tareas_pendientes_revision' => Trabajo::whereHas('tarea', function ($query) use ($profesor) {
                $query->whereHas('contenido.curso', function ($q) use ($profesor) {
                    $q->where('profesor_id', $profesor->id);
                });
            })
            ->where('calificacion', null)
            ->count(),
            'evaluaciones_activas' => Evaluacion::whereHas('contenido.curso', function ($query) use ($profesor) {
                $query->where('profesor_id', $profesor->id);
            })
            ->where('fecha_limite', '>=', now())
            ->count(),
        ];

        // Cursos con más estudiantes
        $cursosDestacados = $cursos->sortByDesc('estudiantes_count')->take(5);

        // Trabajos recientes pendientes de calificar
        $trabajosPendientes = Trabajo::with(['estudiante', 'tarea.contenido.curso'])
            ->whereHas('tarea.contenido.curso', function ($query) use ($profesor) {
                $query->where('profesor_id', $profesor->id);
            })
            ->where('calificacion', null)
            ->orderBy('fecha_entrega', 'desc')
            ->limit(10)
            ->get();

        // Actividad reciente del profesor
        $actividadReciente = [
            'tareas_creadas' => Tarea::whereHas('contenido.curso', function ($query) use ($profesor) {
                $query->where('profesor_id', $profesor->id);
            })
            ->whereBetween('created_at', [now()->subDays(7), now()])
            ->count(),

            'trabajos_calificados' => Trabajo::whereHas('tarea.contenido.curso', function ($query) use ($profesor) {
                $query->where('profesor_id', $profesor->id);
            })
            ->whereNotNull('calificacion')
            ->whereBetween('updated_at', [now()->subDays(7), now()])
            ->count(),
        ];

        return Inertia::render('Dashboard/Profesor', [
            'estadisticas' => $estadisticas,
            'cursos' => $cursosDestacados,
            'trabajosPendientes' => $trabajosPendientes,
            'actividadReciente' => $actividadReciente,
        ]);
    }
}
