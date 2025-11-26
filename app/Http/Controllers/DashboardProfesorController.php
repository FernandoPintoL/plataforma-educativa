<?php
namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\Evaluacion;
use App\Models\Tarea;
use App\Models\Trabajo;
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
            'total_cursos'               => $cursos->count(),
            'total_estudiantes'          => $cursos->sum('estudiantes_count'),
            'tareas_pendientes_revision' => Trabajo::whereHas('contenido', function ($query) use ($profesor) {
                $query->where('tipo', 'tarea')
                    ->where('creador_id', $profesor->id);
            })
                ->where('estado', 'entregado')
                ->whereDoesntHave('calificacion')
                ->count(),
            'evaluaciones_activas'       => Evaluacion::join('contenidos', 'evaluaciones.contenido_id', '=', 'contenidos.id')
                ->join('cursos', 'contenidos.curso_id', '=', 'cursos.id')
                ->where('cursos.profesor_id', $profesor->id)
                ->where('contenidos.fecha_limite', '>=', now())
                ->count(),
        ];

        // Cursos con más estudiantes
        $cursosDestacados = $cursos->sortByDesc('estudiantes_count')->take(5);

        // Trabajos recientes pendientes de calificar
        $trabajosPendientes = Trabajo::with([
            'estudiante:id,name,apellido',
            'contenido:id,titulo,curso_id',
            'contenido.curso:id,nombre'
        ])
            ->whereHas('contenido', function ($query) use ($profesor) {
                $query->where('tipo', 'tarea')
                    ->where('creador_id', $profesor->id);
            })
            ->where('estado', 'entregado')
            ->whereDoesntHave('calificacion')
            ->orderBy('fecha_entrega', 'desc')
            ->limit(10)
            ->get();

        // Actividad reciente del profesor
        $actividadReciente = [
            'tareas_creadas'       => Tarea::join('contenidos', 'tareas.contenido_id', '=', 'contenidos.id')
                ->join('cursos', 'contenidos.curso_id', '=', 'cursos.id')
                ->where('cursos.profesor_id', $profesor->id)
                ->whereBetween('tareas.created_at', [now()->subDays(7), now()])
                ->count(),

            'trabajos_calificados' => Trabajo::whereHas('contenido', function ($query) use ($profesor) {
                $query->where('creador_id', $profesor->id);
            })
                ->where('estado', 'calificado')
                ->whereBetween('updated_at', [now()->subDays(7), now()])
                ->count(),
        ];

        // Obtener los módulos del sidebar para el usuario actual
        $modulosSidebar = $this->getMenuItems();

        return Inertia::render('Dashboard/Profesor', [
            'estadisticas'       => $estadisticas,
            'cursos'             => $cursosDestacados,
            'trabajosPendientes' => $trabajosPendientes,
            'actividadReciente'  => $actividadReciente,
            'modulosSidebar'     => $modulosSidebar, // Añadir los módulos del sidebar
        ]);
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
