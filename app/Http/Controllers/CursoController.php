<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CursoController extends Controller
{
    /**
     * Mostrar los cursos del usuario autenticado
     * - Para profesores: cursos que enseña
     * - Para estudiantes: cursos en los que está matriculado
     */
    public function misCursos()
    {
        $user = Auth::user();
        $userRole = $user->hasRole('profesor') ? 'profesor' : 'estudiante';

        // Obtener cursos según el rol
        if ($userRole === 'profesor') {
            // Profesor: obtener cursos que enseña
            $cursos = Curso::where('profesor_id', $user->id)
                ->with(['estudiantes', 'contenidos.tarea', 'contenidos.evaluaciones'])
                ->orderBy('fecha_inicio', 'desc')
                ->get()
                ->map(function ($curso) {
                    // Calcular total de tareas y evaluaciones desde los contenidos
                    $totalTareas = $curso->contenidos->reduce(fn ($sum, $c) => $sum + ($c->tarea ? 1 : 0), 0);
                    $totalEvaluaciones = $curso->contenidos->sum(fn ($c) => $c->evaluaciones->count());

                    return [
                        'id' => $curso->id,
                        'nombre' => $curso->nombre,
                        'codigo' => $curso->codigo,
                        'descripcion' => $curso->descripcion,
                        'estado' => $curso->estado,
                        'fecha_inicio' => $curso->fecha_inicio?->format('Y-m-d'),
                        'fecha_fin' => $curso->fecha_fin?->format('Y-m-d'),
                        'capacidad_maxima' => $curso->capacidad_maxima,
                        'total_estudiantes' => $curso->estudiantes->count(),
                        'total_contenidos' => $curso->contenidos->count(),
                        'total_tareas' => $totalTareas,
                        'total_evaluaciones' => $totalEvaluaciones,
                        'profesor' => [
                            'id' => $curso->profesor->id,
                            'nombre' => $curso->profesor->name,
                            'apellido' => $curso->profesor->apellido,
                        ],
                        'rol_usuario' => 'profesor',
                    ];
                });
        } else {
            // Estudiante: obtener cursos matriculados
            $cursos = $user->cursosComoEstudiante()
                ->with(['profesor', 'contenidos.tarea', 'contenidos.evaluaciones'])
                ->orderBy('fecha_inicio', 'desc')
                ->get()
                ->map(function ($curso) {
                    // Calcular total de tareas y evaluaciones desde los contenidos
                    $totalTareas = $curso->contenidos->reduce(fn ($sum, $c) => $sum + ($c->tarea ? 1 : 0), 0);
                    $totalEvaluaciones = $curso->contenidos->sum(fn ($c) => $c->evaluaciones->count());

                    return [
                        'id' => $curso->id,
                        'nombre' => $curso->nombre,
                        'codigo' => $curso->codigo,
                        'descripcion' => $curso->descripcion,
                        'estado' => $curso->estado,
                        'fecha_inicio' => $curso->fecha_inicio?->format('Y-m-d'),
                        'fecha_fin' => $curso->fecha_fin?->format('Y-m-d'),
                        'capacidad_maxima' => $curso->capacidad_maxima,
                        'total_contenidos' => $curso->contenidos->count(),
                        'total_tareas' => $totalTareas,
                        'total_evaluaciones' => $totalEvaluaciones,
                        'profesor' => [
                            'id' => $curso->profesor->id,
                            'nombre' => $curso->profesor->name,
                            'apellido' => $curso->profesor->apellido,
                        ],
                        'rol_usuario' => 'estudiante',
                    ];
                });
        }

        return Inertia::render('Cursos/MisCursos', [
            'cursos' => $cursos,
            'totalCursos' => $cursos->count(),
            'userRole' => $userRole,
        ]);
    }

    /**
     * Mostrar detalles de un curso específico
     */
    public function show(Curso $curso)
    {
        $user = Auth::user();

        // Validar permisos
        if ($user->esProfesor() && $curso->profesor_id !== $user->id) {
            abort(403, 'No tienes acceso a este curso');
        }

        $curso->load(['profesor', 'estudiantes', 'contenidos.tarea', 'contenidos.evaluaciones']);

        // Calcular total de tareas y evaluaciones desde los contenidos
        $totalTareas = $curso->contenidos->reduce(fn ($sum, $c) => $sum + ($c->tarea ? 1 : 0), 0);
        $totalEvaluaciones = $curso->contenidos->sum(fn ($c) => $c->evaluaciones->count());

        return Inertia::render('Cursos/Show', [
            'curso' => [
                'id' => $curso->id,
                'nombre' => $curso->nombre,
                'codigo' => $curso->codigo,
                'descripcion' => $curso->descripcion,
                'estado' => $curso->estado,
                'fecha_inicio' => $curso->fecha_inicio?->format('Y-m-d'),
                'fecha_fin' => $curso->fecha_fin?->format('Y-m-d'),
                'capacidad_maxima' => $curso->capacidad_maxima,
                'profesor' => [
                    'id' => $curso->profesor->id,
                    'nombre' => $curso->profesor->name,
                    'apellido' => $curso->profesor->apellido,
                ],
                'total_estudiantes' => $curso->estudiantes->count(),
                'estudiantes' => $curso->estudiantes->map(fn ($est) => [
                    'id' => $est->id,
                    'nombre' => $est->name,
                    'apellido' => $est->apellido,
                    'email' => $est->email,
                ])->toArray(),
                'total_contenidos' => $curso->contenidos->count(),
                'total_tareas' => $totalTareas,
                'total_evaluaciones' => $totalEvaluaciones,
            ],
        ]);
    }
}
