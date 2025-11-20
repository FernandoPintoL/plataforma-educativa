<?php

namespace App\Http\Controllers;

use App\Models\Intervencion;
use App\Models\User;
use App\Models\Curso;
use App\Models\PrediccionRiesgo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class IntervencionController extends Controller
{
    /**
     * Mostrar lista de intervenciones
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Intervencion::with(['estudiante', 'profesor', 'curso']);

        // Filtrar según rol del usuario
        if (!$user->esDirector()) {
            if ($user->esProfesor()) {
                // Profesores ven sus intervenciones
                $query->where('profesor_id', $user->id);
            } else {
                // Estudiantes ven sus propias intervenciones
                $query->where('estudiante_id', $user->id);
            }
        }

        // Aplicar filtros adicionales
        if ($request->has('curso_id')) {
            $query->where('curso_id', $request->curso_id);
        }

        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->has('estudiante_id')) {
            $query->where('estudiante_id', $request->estudiante_id);
        }

        $intervenciones = $query->latest('created_at')->paginate(15);

        // Obtener datos para los selects
        $cursos = Curso::all();
        $estados = ['pendiente', 'en_progreso', 'completada', 'cancelada'];

        return Inertia::render('Intervenciones/Index', [
            'intervenciones' => $intervenciones,
            'cursos' => $cursos,
            'estados' => $estados,
            'filters' => $request->only(['curso_id', 'estado', 'estudiante_id']),
        ]);
    }

    /**
     * Mostrar formulario para crear intervención
     */
    public function create(Request $request)
    {
        $prediccionRiesgo = null;

        if ($request->has('prediccion_id')) {
            $prediccionRiesgo = PrediccionRiesgo::with('estudiante')->findOrFail($request->prediccion_id);
        }

        $estudiantes = User::where('role', 'estudiante')->get();
        $profesores = User::where('role', 'profesor')->get();
        $cursos = Curso::all();

        return Inertia::render('Intervenciones/Create', [
            'estudianteId' => $request->has('prediccion_id') ? $prediccionRiesgo?->estudiante_id : null,
            'prediccionId' => $request->has('prediccion_id') ? $request->prediccion_id : null,
            'estudiantes' => $estudiantes,
            'profesores' => $profesores,
            'cursos' => $cursos,
        ]);
    }

    /**
     * Guardar nueva intervención
     */
    public function store(Request $request)
    {
        $usuario = Auth::user();

        // Validar autorización: Solo profesores, orientadores y admin pueden crear intervenciones
        if ($usuario->tipo_usuario === 'estudiante') {
            return redirect()->back()
                ->with('error', 'Los estudiantes no pueden crear intervenciones');
        }

        $validated = $request->validate([
            'prediccion_riesgo_id' => 'nullable|exists:predicciones_riesgo,id',
            'estudiante_id' => 'required|exists:users,id',
            'curso_id' => 'required|exists:cursos,id',
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'tipo_intervencion' => 'required|in:apoyo_academico,orientacion_psicologica,tutoria,contacto_padres,actividades_complementarias,otro',
            'prioridad' => 'required|in:baja,media,alta,urgente',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin_planeada' => 'nullable|date|after_or_equal:fecha_inicio',
            'observaciones' => 'nullable|string',
        ]);

        // Si es profesor, validar que sea profesor del curso
        if ($usuario->tipo_usuario === 'profesor') {
            $esProfesor = DB::table('curso_profesor')
                ->where('profesor_id', $usuario->id)
                ->where('curso_id', $validated['curso_id'])
                ->exists();

            if (!$esProfesor) {
                return redirect()->back()
                    ->with('error', 'No eres profesor de este curso');
            }
        }
        // Si es orientador o admin, tienen acceso a todos los cursos

        $validated['profesor_id'] = $usuario->id;
        $validated['created_by'] = $usuario->id;

        $intervencion = Intervencion::create($validated);

        return redirect()->route('intervenciones.show', $intervencion->id)
            ->with('success', 'Intervención creada exitosamente');
    }

    /**
     * Mostrar detalles de intervención
     */
    public function show(Intervencion $intervencion)
    {
        $intervencion->load(['estudiante', 'profesor', 'curso', 'prediccionRiesgo', 'seguimientos.usuario']);

        return Inertia::render('Intervenciones/Show', [
            'intervencion' => $intervencion,
            'seguimientos' => $intervencion->seguimientos()->latest('fecha_seguimiento')->get(),
        ]);
    }

    /**
     * Mostrar formulario para editar intervención
     */
    public function edit(Intervencion $intervencion)
    {
        $intervencion->load(['estudiante', 'profesor', 'curso']);
        $estudiantes = User::where('role', 'estudiante')->get();
        $profesores = User::where('role', 'profesor')->get();
        $cursos = Curso::all();

        return Inertia::render('Intervenciones/Edit', [
            'intervencion' => $intervencion,
            'estudiantes' => $estudiantes,
            'profesores' => $profesores,
            'cursos' => $cursos,
        ]);
    }

    /**
     * Actualizar intervención
     */
    public function update(Request $request, Intervencion $intervencion)
    {
        $usuario = Auth::user();

        // Validar autorización: Solo profesor de la intervención, orientador o admin
        if ($usuario->tipo_usuario === 'profesor' && $intervencion->profesor_id !== $usuario->id) {
            return redirect()->back()
                ->with('error', 'No tienes permiso para actualizar esta intervención');
        }

        if ($usuario->tipo_usuario === 'estudiante') {
            return redirect()->back()
                ->with('error', 'Los estudiantes no pueden actualizar intervenciones');
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'tipo_intervencion' => 'required|in:apoyo_academico,orientacion_psicologica,tutoria,contacto_padres,actividades_complementarias,otro',
            'estado' => 'required|in:pendiente,en_progreso,completada,cancelada',
            'prioridad' => 'required|in:baja,media,alta,urgente',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin_planeada' => 'nullable|date|after_or_equal:fecha_inicio',
            'observaciones' => 'nullable|string',
            'seguimiento_requerido' => 'boolean',
        ]);

        $validated['updated_by'] = $usuario->id;

        $intervencion->update($validated);

        return redirect()->route('intervenciones.show', $intervencion->id)
            ->with('success', 'Intervención actualizada exitosamente');
    }

    /**
     * Eliminar intervención
     */
    public function destroy(Intervencion $intervencion)
    {
        $usuario = Auth::user();

        // Validar autorización: Solo el creador, orientador o admin pueden eliminar
        if ($usuario->tipo_usuario === 'profesor' && $intervencion->created_by !== $usuario->id) {
            return redirect()->back()
                ->with('error', 'No tienes permiso para eliminar esta intervención');
        }

        if ($usuario->tipo_usuario === 'estudiante') {
            return redirect()->back()
                ->with('error', 'Los estudiantes no pueden eliminar intervenciones');
        }

        $intervencion->delete();

        return redirect()->route('intervenciones.index')
            ->with('success', 'Intervención eliminada exitosamente');
    }

    /**
     * Ver intervenciones por estudiante
     */
    public function porEstudiante($estudianteId)
    {
        $estudiante = User::findOrFail($estudianteId);

        $intervenciones = Intervencion::with(['profesor', 'curso', 'seguimientos.usuario'])
            ->porEstudiante($estudianteId)
            ->latest('created_at')
            ->get();

        return Inertia::render('Intervenciones/PorEstudiante', [
            'estudianteId' => $estudianteId,
            'estudiante' => $estudiante,
            'intervenciones' => $intervenciones,
        ]);
    }
}
