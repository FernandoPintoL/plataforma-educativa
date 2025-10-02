<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\Tarea;
use App\Models\Trabajo;
use App\Models\Evaluacion;
use App\Models\Calificacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardEstudianteController extends Controller
{
    public function index()
    {
        $estudiante = Auth::user();

        // Obtener cursos del estudiante
        $cursos = $estudiante->cursosComoEstudiante()
            ->with('profesor')
            ->get();

        // Estadísticas generales
        $estadisticas = [
            'total_cursos' => $cursos->count(),
            'tareas_pendientes' => $this->getTareasPendientes($estudiante),
            'evaluaciones_proximas' => Evaluacion::whereHas('contenido.curso.estudiantes', function ($query) use ($estudiante) {
                $query->where('users.id', $estudiante->id);
            })
            ->where('fecha_limite', '>=', now())
            ->where('fecha_limite', '<=', now()->addDays(7))
            ->count(),
            'promedio_general' => $this->calcularPromedioGeneral($estudiante),
        ];

        // Tareas pendientes
        $tareasPendientes = Tarea::whereHas('contenido.curso.estudiantes', function ($query) use ($estudiante) {
            $query->where('users.id', $estudiante->id);
        })
        ->whereDoesntHave('trabajos', function ($query) use ($estudiante) {
            $query->where('estudiante_id', $estudiante->id);
        })
        ->where('fecha_limite', '>=', now())
        ->with('contenido.curso')
        ->orderBy('fecha_limite', 'asc')
        ->limit(10)
        ->get();

        // Evaluaciones próximas
        $evaluacionesProximas = Evaluacion::whereHas('contenido.curso.estudiantes', function ($query) use ($estudiante) {
            $query->where('users.id', $estudiante->id);
        })
        ->where('fecha_limite', '>=', now())
        ->with('contenido.curso')
        ->orderBy('fecha_limite', 'asc')
        ->limit(5)
        ->get();

        // Calificaciones recientes
        $calificacionesRecientes = Calificacion::where('estudiante_id', $estudiante->id)
            ->with(['evaluacion.contenido.curso'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Progreso por curso
        $progresoCursos = $cursos->map(function ($curso) use ($estudiante) {
            $totalTareas = Tarea::whereHas('contenido', function ($query) use ($curso) {
                $query->where('curso_id', $curso->id);
            })->count();

            $tareasCompletadas = Trabajo::whereHas('tarea.contenido', function ($query) use ($curso) {
                $query->where('curso_id', $curso->id);
            })
            ->where('estudiante_id', $estudiante->id)
            ->count();

            return [
                'curso' => $curso,
                'total_tareas' => $totalTareas,
                'tareas_completadas' => $tareasCompletadas,
                'porcentaje' => $totalTareas > 0 ? round(($tareasCompletadas / $totalTareas) * 100, 2) : 0,
            ];
        });

        return Inertia::render('Dashboard/Estudiante', [
            'estadisticas' => $estadisticas,
            'tareasPendientes' => $tareasPendientes,
            'evaluacionesProximas' => $evaluacionesProximas,
            'calificacionesRecientes' => $calificacionesRecientes,
            'progresoCursos' => $progresoCursos,
        ]);
    }

    private function getTareasPendientes($estudiante)
    {
        return Tarea::whereHas('contenido.curso.estudiantes', function ($query) use ($estudiante) {
            $query->where('users.id', $estudiante->id);
        })
        ->whereDoesntHave('trabajos', function ($query) use ($estudiante) {
            $query->where('estudiante_id', $estudiante->id);
        })
        ->where('fecha_limite', '>=', now())
        ->count();
    }

    private function calcularPromedioGeneral($estudiante)
    {
        $promedio = Calificacion::where('estudiante_id', $estudiante->id)
            ->avg('nota');

        return $promedio ? round($promedio, 2) : null;
    }
}
