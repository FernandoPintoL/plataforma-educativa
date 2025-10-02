<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Curso;
use App\Models\Trabajo;
use App\Models\Calificacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardPadreController extends Controller
{
    public function index()
    {
        $padre = Auth::user();

        // TODO: Implementar relación padre-hijo cuando se agregue la tabla
        // Por ahora, mostramos información general

        // En el futuro, obtener hijos del padre:
        // $hijos = $padre->hijos()->with('cursosComoEstudiante')->get();

        // Simulación temporal - en producción esto vendrá de la relación padre-hijo
        $hijosInfo = $this->getHijosInfo($padre);

        // Estadísticas generales de los hijos
        $estadisticas = [
            'total_hijos' => count($hijosInfo),
            'total_cursos' => collect($hijosInfo)->sum('total_cursos'),
            'tareas_pendientes' => collect($hijosInfo)->sum('tareas_pendientes'),
            'promedio_general' => collect($hijosInfo)->avg('promedio'),
        ];

        // Notificaciones importantes
        $notificaciones = $this->getNotificacionesImportantes($hijosInfo);

        // Calendario de próximas evaluaciones
        $proximasEvaluaciones = $this->getProximasEvaluaciones($hijosInfo);

        // Resumen de rendimiento por hijo
        $rendimientoPorHijo = collect($hijosInfo)->map(function ($hijo) {
            return [
                'nombre' => $hijo['nombre'],
                'promedio' => $hijo['promedio'],
                'cursos' => $hijo['total_cursos'],
                'tareas_pendientes' => $hijo['tareas_pendientes'],
                'asistencia' => $hijo['asistencia'], // Por implementar
            ];
        });

        return Inertia::render('Dashboard/Padre', [
            'estadisticas' => $estadisticas,
            'hijos' => $hijosInfo,
            'notificaciones' => $notificaciones,
            'proximasEvaluaciones' => $proximasEvaluaciones,
            'rendimientoPorHijo' => $rendimientoPorHijo,
        ]);
    }

    private function getHijosInfo($padre)
    {
        // TODO: Implementar cuando se agregue la relación padre-hijo
        // Por ahora retornamos datos de ejemplo

        // En producción esto sería:
        // return $padre->hijos->map(function ($hijo) { ... });

        // Datos de ejemplo temporal
        return [
            [
                'id' => 1,
                'nombre' => 'Hijo 1',
                'total_cursos' => 5,
                'tareas_pendientes' => 3,
                'promedio' => 85.5,
                'asistencia' => 95,
            ],
        ];
    }

    private function getNotificacionesImportantes($hijosInfo)
    {
        $notificaciones = [];

        foreach ($hijosInfo as $hijo) {
            // Tareas pendientes próximas a vencer
            if ($hijo['tareas_pendientes'] > 0) {
                $notificaciones[] = [
                    'tipo' => 'warning',
                    'mensaje' => "{$hijo['nombre']} tiene {$hijo['tareas_pendientes']} tarea(s) pendiente(s)",
                    'fecha' => now(),
                ];
            }

            // Promedio bajo
            if ($hijo['promedio'] < 70) {
                $notificaciones[] = [
                    'tipo' => 'danger',
                    'mensaje' => "{$hijo['nombre']} tiene un promedio bajo: {$hijo['promedio']}",
                    'fecha' => now(),
                ];
            }

            // Buenas calificaciones
            if ($hijo['promedio'] >= 90) {
                $notificaciones[] = [
                    'tipo' => 'success',
                    'mensaje' => "¡{$hijo['nombre']} tiene un excelente promedio: {$hijo['promedio']}!",
                    'fecha' => now(),
                ];
            }
        }

        return $notificaciones;
    }

    private function getProximasEvaluaciones($hijosInfo)
    {
        // TODO: Implementar con datos reales de evaluaciones
        // Por ahora retornamos array vacío

        // En producción:
        // return Evaluacion::whereHas('contenido.curso.estudiantes', function ($query) use ($hijosIds) {
        //     $query->whereIn('users.id', $hijosIds);
        // })
        // ->where('fecha_limite', '>=', now())
        // ->orderBy('fecha_limite', 'asc')
        // ->get();

        return [];
    }
}
