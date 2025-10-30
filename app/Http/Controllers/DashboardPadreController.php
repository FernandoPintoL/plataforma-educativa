<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Tarea;
use App\Models\Trabajo;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardPadreController extends Controller
{
    public function index()
    {
        $padre = Auth::user();

        // Obtener hijos reales del padre
        $hijos = $padre->hijos()
            ->with(['cursosComoEstudiante', 'trabajos.calificacion'])
            ->get();

        // Obtener información detallada de cada hijo
        $hijosInfo = $this->getHijosInfo($hijos);

        // Estadísticas generales de los hijos
        $estadisticas = [
            'total_hijos'       => $hijos->count(),
            'total_cursos'      => collect($hijosInfo)->sum('total_cursos'),
            'tareas_pendientes' => collect($hijosInfo)->sum('tareas_pendientes'),
            'promedio_general'  => collect($hijosInfo)->avg('promedio') ?? 0,
        ];

        // Notificaciones importantes
        $notificaciones = $this->getNotificacionesImportantes($hijosInfo);

        // Calendario de próximas evaluaciones
        $proximasEvaluaciones = $this->getProximasEvaluaciones($hijos);

        // Resumen de rendimiento por hijo
        $rendimientoPorHijo = collect($hijosInfo)->map(function ($hijo) {
            return [
                'id'                => $hijo['id'],
                'nombre'            => $hijo['nombre'],
                'promedio'          => $hijo['promedio'],
                'cursos'            => $hijo['total_cursos'],
                'tareas_pendientes' => $hijo['tareas_pendientes'],
            ];
        })->values();

        // Obtener los módulos del sidebar para el usuario actual
        $modulosSidebar = $this->getMenuItems();

        return Inertia::render('Dashboard/Padre', [
            'estadisticas'         => $estadisticas,
            'hijos'                => $rendimientoPorHijo,
            'hijosInfo'            => $hijosInfo,
            'notificaciones'       => $notificaciones,
            'proximasEvaluaciones' => $proximasEvaluaciones,
            'modulosSidebar'       => $modulosSidebar,
        ]);
    }

    /**
     * Obtener información detallada de cada hijo
     */
    private function getHijosInfo($hijos)
    {
        return $hijos->map(function ($hijo) {
            $cursos = $hijo->cursosComoEstudiante;
            $trabajos = $hijo->trabajos;
            // Nota: rendimientoAcademico no se carga porque la tabla no existe aún
            $rendimiento = null;

            // Contar tareas pendientes (trabajos sin calificar)
            $tareasPendientes = $trabajos
                ->filter(function ($trabajo) {
                    return $trabajo->estado === 'en_progreso' || $trabajo->estado === 'entregado';
                })
                ->count();

            // Obtener calificaciones recientes para calcular promedio
            $calificacionesTodas = $trabajos
                ->filter(function ($trabajo) {
                    return $trabajo->calificacion !== null;
                })
                ->pluck('calificacion.puntaje')
                ->toArray();

            // Calcular promedio desde las calificaciones
            $promedio = count($calificacionesTodas) > 0
                ? array_sum($calificacionesTodas) / count($calificacionesTodas)
                : 0;

            // Obtener calificaciones recientes
            $calificacionesRecientes = $trabajos
                ->filter(function ($trabajo) {
                    return $trabajo->calificacion !== null;
                })
                ->sortByDesc(function ($trabajo) {
                    return $trabajo->calificacion->fecha_calificacion;
                })
                ->take(5)
                ->map(function ($trabajo) {
                    return [
                        'tarea_titulo' => $trabajo->contenido?->titulo ?? 'Sin título',
                        'puntaje' => $trabajo->calificacion->puntaje,
                        'fecha' => $trabajo->calificacion->fecha_calificacion,
                        'comentario' => $trabajo->calificacion->comentario,
                    ];
                })
                ->values()
                ->toArray();

            return [
                'id'                      => $hijo->id,
                'nombre'                  => $hijo->nombre_completo,
                'email'                   => $hijo->email,
                'total_cursos'            => $cursos->count(),
                'tareas_pendientes'       => $tareasPendientes,
                'promedio'                => round($promedio, 2),
                'calificaciones_recientes' => $calificacionesRecientes,
                'fortalezas'              => $rendimiento?->fortalezas ?? [],
                'debilidades'             => $rendimiento?->debilidades ?? [],
                'tendencia'               => $rendimiento?->tendencia_temporal ?? 'estable',
            ];
        })->toArray();
    }

    private function getNotificacionesImportantes($hijosInfo)
    {
        $notificaciones = [];

        foreach ($hijosInfo as $hijo) {
            // Tareas pendientes próximas a vencer
            if ($hijo['tareas_pendientes'] > 0) {
                $notificaciones[] = [
                    'tipo'    => 'warning',
                    'mensaje' => "{$hijo['nombre']} tiene {$hijo['tareas_pendientes']} tarea(s) pendiente(s)",
                    'fecha' => now(),
                ];
            }

            // Promedio bajo
            if ($hijo['promedio'] < 70) {
                $notificaciones[] = [
                    'tipo'    => 'danger',
                    'mensaje' => "{$hijo['nombre']} tiene un promedio bajo: {$hijo['promedio']}",
                    'fecha' => now(),
                ];
            }

            // Buenas calificaciones
            if ($hijo['promedio'] >= 90) {
                $notificaciones[] = [
                    'tipo'    => 'success',
                    'mensaje' => "¡{$hijo['nombre']} tiene un excelente promedio: {$hijo['promedio']}!",
                    'fecha' => now(),
                ];
            }
        }

        return $notificaciones;
    }

    /**
     * Obtener próximas evaluaciones/tareas con fecha límite
     */
    private function getProximasEvaluaciones($hijos)
    {
        $hijosIds = $hijos->pluck('id')->toArray();

        // Obtener próximas tareas no entregadas
        $tareasProximas = Tarea::whereHas('contenido.curso.estudiantes', function ($query) use ($hijosIds) {
            $query->whereIn('users.id', $hijosIds);
        })
            ->where('fecha_limite', '>=', now())
            ->orderBy('fecha_limite', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($tarea) {
                return [
                    'titulo' => $tarea->contenido?->titulo,
                    'tipo' => 'tarea',
                    'curso' => $tarea->contenido?->curso?->nombre,
                    'fecha_limite' => $tarea->fecha_limite,
                    'dias_restantes' => now()->diffInDays($tarea->fecha_limite),
                ];
            });

        return $tareasProximas->toArray();
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
