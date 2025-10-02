<?php
namespace App\Http\Controllers;

use App\Models\Calificacion;
use App\Models\Curso;
use App\Models\Evaluacion;
use App\Models\Tarea;
use App\Models\Trabajo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardEstudianteController extends Controller
{
    public function index()
    {
        $estudiante = Auth::user();

        // Obtener cursos del estudiante
        $cursos = Curso::join('curso_estudiante', 'cursos.id', '=', 'curso_estudiante.curso_id')
            ->where('curso_estudiante.estudiante_id', $estudiante->id)
            ->with('profesor')
            ->select('cursos.*')
            ->get();

        // Estadísticas generales
        $estadisticas = [
            'total_cursos'          => $cursos->count(),
            'tareas_pendientes'     => $this->getTareasPendientes($estudiante),
            'evaluaciones_proximas' => Evaluacion::join('contenidos', 'evaluaciones.contenido_id', '=', 'contenidos.id')
                ->join('cursos', 'contenidos.curso_id', '=', 'cursos.id')
                ->join('curso_estudiante', 'cursos.id', '=', 'curso_estudiante.curso_id')
                ->where('curso_estudiante.estudiante_id', $estudiante->id)
                ->where('contenidos.fecha_limite', '>=', now())
                ->where('contenidos.fecha_limite', '<=', now()->addDays(7))
                ->count(),
            'promedio_general'      => $this->calcularPromedioGeneral($estudiante),
        ];

        // Tareas pendientes
        $tareasPendientes = Tarea::join('contenidos', 'tareas.contenido_id', '=', 'contenidos.id')
            ->join('cursos', 'contenidos.curso_id', '=', 'cursos.id')
            ->join('curso_estudiante', 'cursos.id', '=', 'curso_estudiante.curso_id')
            ->where('curso_estudiante.estudiante_id', $estudiante->id)
            ->whereNotExists(function ($query) use ($estudiante) {
                $query->select(DB::raw(1))
                    ->from('trabajos')
                    ->whereRaw('trabajos.contenido_id = contenidos.id')
                    ->where('trabajos.estudiante_id', $estudiante->id);
            })
            ->where('contenidos.fecha_limite', '>=', now())
            ->select('tareas.*', 'contenidos.titulo', 'contenidos.descripcion', 'contenidos.fecha_limite', 'cursos.nombre as curso_nombre')
            ->orderBy('contenidos.fecha_limite', 'asc')
            ->limit(10)
            ->get();

        // Evaluaciones próximas
        $evaluacionesProximas = Evaluacion::join('contenidos', 'evaluaciones.contenido_id', '=', 'contenidos.id')
            ->join('cursos', 'contenidos.curso_id', '=', 'cursos.id')
            ->join('curso_estudiante', 'cursos.id', '=', 'curso_estudiante.curso_id')
            ->where('curso_estudiante.estudiante_id', $estudiante->id)
            ->where('contenidos.fecha_limite', '>=', now())
            ->select('evaluaciones.*', 'contenidos.titulo', 'contenidos.descripcion', 'contenidos.fecha_limite', 'cursos.nombre as curso_nombre')
            ->orderBy('contenidos.fecha_limite', 'asc')
            ->limit(5)
            ->get();

        // Calificaciones recientes
        $calificacionesRecientes = Calificacion::join('trabajos', 'calificaciones.trabajo_id', '=', 'trabajos.id')
            ->join('contenidos', 'trabajos.contenido_id', '=', 'contenidos.id')
            ->join('cursos', 'contenidos.curso_id', '=', 'cursos.id')
            ->where('trabajos.estudiante_id', $estudiante->id)
            ->select('calificaciones.*', 'trabajos.id as trabajo_id', 'contenidos.titulo', 'contenidos.tipo', 'cursos.nombre as curso_nombre')
            ->orderBy('calificaciones.created_at', 'desc')
            ->limit(5)
            ->get();

        // Progreso por curso
        $progresoCursos = $cursos->map(function ($curso) use ($estudiante) {
            $totalTareas = Tarea::join('contenidos', 'tareas.contenido_id', '=', 'contenidos.id')
                ->where('contenidos.curso_id', $curso->id)
                ->count();

            $tareasCompletadas = Trabajo::join('contenidos', 'trabajos.contenido_id', '=', 'contenidos.id')
                ->where('contenidos.curso_id', $curso->id)
                ->where('contenidos.tipo', 'tarea')
                ->where('trabajos.estudiante_id', $estudiante->id)
                ->count();

            return [
                'curso'              => $curso,
                'total_tareas'       => $totalTareas,
                'tareas_completadas' => $tareasCompletadas,
                'porcentaje'         => $totalTareas > 0 ? round(($tareasCompletadas / $totalTareas) * 100, 2) : 0,
            ];
        });

        // Obtener los módulos del sidebar para el usuario actual
        $modulosSidebar = $this->getMenuItems();

        return Inertia::render('Dashboard/Estudiante', [
            'estadisticas'            => $estadisticas,
            'tareasPendientes'        => $tareasPendientes,
            'evaluacionesProximas'    => $evaluacionesProximas,
            'calificacionesRecientes' => $calificacionesRecientes,
            'progresoCursos'          => $progresoCursos,
            'modulosSidebar'          => $modulosSidebar, // Añadir los módulos del sidebar
        ]);
    }

    private function getTareasPendientes($estudiante)
    {
        return Tarea::join('contenidos', 'tareas.contenido_id', '=', 'contenidos.id')
            ->join('cursos', 'contenidos.curso_id', '=', 'cursos.id')
            ->join('curso_estudiante', 'cursos.id', '=', 'curso_estudiante.curso_id')
            ->where('curso_estudiante.estudiante_id', $estudiante->id)
            ->whereNotExists(function ($query) use ($estudiante) {
                $query->select(DB::raw(1))
                    ->from('trabajos')
                    ->whereRaw('trabajos.contenido_id = contenidos.id')
                    ->where('trabajos.estudiante_id', $estudiante->id);
            })
            ->where('contenidos.fecha_limite', '>=', now())
            ->count();
    }

    private function calcularPromedioGeneral($estudiante)
    {
        $promedio = Calificacion::join('trabajos', 'calificaciones.trabajo_id', '=', 'trabajos.id')
            ->where('trabajos.estudiante_id', $estudiante->id)
            ->avg('calificaciones.puntaje');

        return $promedio ? round($promedio, 2) : null;
    }

    /**
     * Obtener elementos del menú sidebar filtrados por permisos del usuario actual
     */
    private function getMenuItems()
    {
        // Obtener módulos del sidebar filtrados por permisos del usuario
        $modulos = \App\Models\ModuloSidebar::obtenerParaSidebar();

        // Convertir a formato para frontend
        return $modulos->map(function ($modulo) {
            return $modulo->toNavItem();
        })->values()->toArray();
    }
}
