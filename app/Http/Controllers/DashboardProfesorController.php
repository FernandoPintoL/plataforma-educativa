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

        // Obtener cursos del profesor con conteo de estudiantes ACTIVOS
        $cursos = Curso::where('profesor_id', $profesor->id)->get();

        // Estadísticas generales - CORREGIDAS PARA COHERENCIA
        $estadisticas = [
            // CORRECCIÓN 1: Contar solo estudiantes ACTIVOS (estado = 'activo')
            'total_cursos' => $cursos->count(),
            'total_estudiantes' => $cursos->sum(function ($curso) {
                return $curso->estudiantes()
                    ->wherePivot('estado', 'activo')
                    ->count();
            }),

            // CORRECCIÓN 2: Validar que el contenido esté PUBLICADO
            'tareas_pendientes_revision' => Trabajo::whereHas('contenido', function ($query) use ($profesor) {
                $query->where('tipo', 'tarea')
                    ->where('creador_id', $profesor->id)
                    ->where('estado', 'publicado'); // ← AGREGADO: Validar estado publicado
            })
                ->where('estado', 'entregado')
                ->whereDoesntHave('calificacion')
                ->count(),

            // CORRECCIÓN 3: Validar que la evaluación esté PUBLICADA y tenga fecha_límite válida
            'evaluaciones_activas' => Evaluacion::join('contenidos', 'evaluaciones.contenido_id', '=', 'contenidos.id')
                ->join('cursos', 'contenidos.curso_id', '=', 'cursos.id')
                ->where('cursos.profesor_id', $profesor->id)
                ->where('contenidos.estado', 'publicado') // ← AGREGADO: Validar estado publicado
                ->where('contenidos.fecha_limite', '>=', now())
                ->count(),
        ];

        // Cursos con más estudiantes ACTIVOS
        $cursosDestacados = $cursos->map(function ($curso) {
            $curso->estudiantes_activos_count = $curso->estudiantes()
                ->wherePivot('estado', 'activo')
                ->count();
            return $curso;
        })
            ->sortByDesc('estudiantes_activos_count')
            ->take(5)
            ->map(function ($curso) {
                // Retornar con la estructura esperada por el frontend
                return [
                    'id' => $curso->id,
                    'nombre' => $curso->nombre,
                    'estudiantes_count' => $curso->estudiantes_activos_count,
                    'estado' => $curso->estado, // ← CAMBIO: 'estado' en lugar de 'activo'
                ];
            })
            ->values();

        // Trabajos recientes pendientes de calificar
        // CORRECCIÓN 4: Validar que el contenido esté publicado
        $trabajosPendientes = Trabajo::with([
            'estudiante:id,name,apellido',
            'contenido:id,titulo,curso_id',
            'contenido.curso:id,nombre'
        ])
            ->whereHas('contenido', function ($query) use ($profesor) {
                $query->where('tipo', 'tarea')
                    ->where('creador_id', $profesor->id)
                    ->where('estado', 'publicado'); // ← AGREGADO: Validar estado publicado
            })
            ->where('estado', 'entregado')
            ->whereDoesntHave('calificacion')
            ->orderBy('fecha_entrega', 'desc')
            ->limit(10)
            ->get();

        // Actividad reciente del profesor
        $actividadReciente = [
            'tareas_creadas' => Tarea::join('contenidos', 'tareas.contenido_id', '=', 'contenidos.id')
                ->join('cursos', 'contenidos.curso_id', '=', 'cursos.id')
                ->where('cursos.profesor_id', $profesor->id)
                ->where('contenidos.estado', 'publicado') // ← AGREGADO: Validar estado publicado
                ->whereBetween('tareas.created_at', [now()->subDays(7), now()])
                ->count(),

            // CORRECCIÓN 5: Contar trabajos con calificación en lugar de estado 'calificado'
            'trabajos_calificados' => Trabajo::whereHas('contenido', function ($query) use ($profesor) {
                $query->where('creador_id', $profesor->id);
            })
                ->whereHas('calificacion') // ← CAMBIO: Usar whereHas en lugar de estado
                ->whereBetween('updated_at', [now()->subDays(7), now()])
                ->count(),
        ];

        // Obtener los módulos del sidebar para el usuario actual
        $modulosSidebar = $this->getMenuItems();

        return Inertia::render('Dashboard/Profesor', [
            'estadisticas' => $estadisticas,
            'cursos' => $cursosDestacados,
            'trabajosPendientes' => $trabajosPendientes,
            'actividadReciente' => $actividadReciente,
            'modulosSidebar' => $modulosSidebar,
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
