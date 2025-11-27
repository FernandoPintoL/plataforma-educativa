<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CursoController extends Controller
{
    /**
     * Mostrar los cursos del profesor autenticado
     */
    public function misCursos()
    {
        $user = Auth::user();

        // Validar que sea profesor
        if (!$user->esProfesor() && !$user->hasRole('profesor')) {
            abort(403, 'Solo los profesores pueden ver sus cursos');
        }

        // Obtener los cursos del profesor
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
                ];
            });

        return Inertia::render('Cursos/MisCursos', [
            'cursos' => $cursos,
            'totalCursos' => $cursos->count(),
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
