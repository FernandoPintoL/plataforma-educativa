<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Curso;
use App\Models\Trabajo;
use App\Models\Evaluacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardDirectorController extends Controller
{
    public function index()
    {
        // Estadísticas generales del sistema
        $estadisticas = [
            'total_estudiantes' => User::where('tipo_usuario', 'estudiante')->where('activo', true)->count(),
            'total_profesores' => User::where('tipo_usuario', 'profesor')->where('activo', true)->count(),
            'total_padres' => User::where('tipo_usuario', 'padre')->where('activo', true)->count(),
            'total_cursos' => Curso::count(),
            'cursos_activos' => Curso::where('activo', true)->count(),
            'usuarios_nuevos_mes' => User::whereIn('tipo_usuario', ['profesor', 'estudiante', 'padre'])
                ->whereBetween('created_at', [now()->startOfMonth(), now()])
                ->count(),
        ];

        // Distribución de estudiantes por curso
        $cursosConEstudiantes = Curso::withCount('estudiantes')
            ->with('profesor')
            ->orderBy('estudiantes_count', 'desc')
            ->limit(10)
            ->get();

        // Profesores más activos (por cantidad de cursos)
        $profesoresActivos = User::where('tipo_usuario', 'profesor')
            ->where('activo', true)
            ->withCount('cursosComoProfesor')
            ->orderBy('cursos_como_profesor_count', 'desc')
            ->limit(5)
            ->get();

        // Actividad reciente del sistema
        $actividadReciente = [
            'trabajos_entregados_semana' => Trabajo::whereBetween('fecha_entrega', [now()->subDays(7), now()])
                ->count(),
            'evaluaciones_creadas_semana' => Evaluacion::whereBetween('created_at', [now()->subDays(7), now()])
                ->count(),
            'cursos_creados_mes' => Curso::whereBetween('created_at', [now()->startOfMonth(), now()])
                ->count(),
        ];

        // Usuarios recién registrados
        $usuariosRecientes = User::whereIn('tipo_usuario', ['profesor', 'estudiante', 'padre'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Estadísticas de rendimiento general
        $rendimientoGeneral = [
            'tasa_entrega_trabajos' => $this->calcularTasaEntrega(),
            'promedio_general_sistema' => $this->calcularPromedioSistema(),
        ];

        // Gráficas de crecimiento
        $crecimientoMensual = $this->getCrecimientoMensual();

        return Inertia::render('Dashboard/Director', [
            'estadisticas' => $estadisticas,
            'cursosConEstudiantes' => $cursosConEstudiantes,
            'profesoresActivos' => $profesoresActivos,
            'actividadReciente' => $actividadReciente,
            'usuariosRecientes' => $usuariosRecientes,
            'rendimientoGeneral' => $rendimientoGeneral,
            'crecimientoMensual' => $crecimientoMensual,
        ]);
    }

    private function calcularTasaEntrega()
    {
        $totalTareas = \App\Models\Tarea::where('fecha_limite', '<', now())->count();
        if ($totalTareas === 0) return 0;

        $tareasEntregadas = Trabajo::whereHas('tarea', function ($query) {
            $query->where('fecha_limite', '<', now());
        })->count();

        return round(($tareasEntregadas / $totalTareas) * 100, 2);
    }

    private function calcularPromedioSistema()
    {
        $promedio = \App\Models\Calificacion::avg('nota');
        return $promedio ? round($promedio, 2) : null;
    }

    private function getCrecimientoMensual()
    {
        $meses = [];
        for ($i = 5; $i >= 0; $i--) {
            $fecha = now()->subMonths($i);
            $meses[] = [
                'mes' => $fecha->format('M Y'),
                'estudiantes' => User::where('tipo_usuario', 'estudiante')
                    ->whereYear('created_at', $fecha->year)
                    ->whereMonth('created_at', $fecha->month)
                    ->count(),
                'profesores' => User::where('tipo_usuario', 'profesor')
                    ->whereYear('created_at', $fecha->year)
                    ->whereMonth('created_at', $fecha->month)
                    ->count(),
                'cursos' => Curso::whereYear('created_at', $fecha->year)
                    ->whereMonth('created_at', $fecha->month)
                    ->count(),
            ];
        }

        return $meses;
    }
}
