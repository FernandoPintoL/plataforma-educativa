<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Curso;
use Illuminate\Support\Facades\Auth;

class AnalisisRiesgoWebController extends Controller
{
    /**
     * Dashboard general de análisis de riesgo
     */
    public function dashboard(): Response
    {
        return Inertia::render('AnalisisRiesgo/Index');
    }

    /**
     * Análisis por cursos con lista de cursos disponibles
     */
    public function porCursos(): Response
    {
        $usuario = Auth::user();

        // Obtener cursos según el rol del usuario
        $cursos = match ($usuario->tipo_usuario) {
            'profesor' => $usuario->cursosComoProfesor()
                ->select('id', 'nombre', 'codigo')
                ->orderBy('nombre')
                ->get()
                ->toArray(),
            'estudiante' => $usuario->cursosComoEstudiante()
                ->select('cursos.id', 'cursos.nombre', 'cursos.codigo')
                ->orderBy('cursos.nombre')
                ->get()
                ->toArray(),
            default => Curso::select('id', 'nombre', 'codigo')
                ->orderBy('nombre')
                ->get()
                ->toArray(), // admin, director, orientador ven todos
        };

        return Inertia::render('AnalisisRiesgo/Cursos', [
            'cursos' => $cursos,
        ]);
    }

    /**
     * Análisis de tendencias generales
     */
    public function tendencias(): Response
    {
        return Inertia::render('AnalisisRiesgo/Tendencias');
    }

    /**
     * Análisis individual de estudiante
     */
    public function estudiante(int $id): Response
    {
        return Inertia::render('AnalisisRiesgo/Estudiante', [
            'estudianteId' => $id,
        ]);
    }
}
