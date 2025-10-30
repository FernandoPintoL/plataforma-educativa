<?php

namespace App\Http\Controllers;

use App\Models\Calificacion;
use App\Models\Trabajo;
use App\Http\Requests\StoreCalificacionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CalificacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->esEstudiante()) {
            // Estudiante: ver sus propias calificaciones
            $calificaciones = Calificacion::whereHas('trabajo', function ($q) use ($user) {
                $q->where('estudiante_id', $user->id);
            })
                ->with([
                    'trabajo.contenido.curso',
                    'trabajo.contenido.tarea',
                    'evaluador'
                ])
                ->orderBy('fecha_calificacion', 'desc')
                ->paginate(15);

            // Obtener cursos del estudiante
            $cursos = $user->cursosComoEstudiante()->get();

            return Inertia::render('Calificaciones/Index', [
                'calificaciones' => $calificaciones,
                'cursos' => $cursos,
            ]);
        }

        // Profesor: ver calificaciones que ha hecho
        if ($user->esProfesor()) {
            $calificaciones = Calificacion::where('evaluador_id', $user->id)
                ->with([
                    'trabajo.contenido.curso',
                    'trabajo.contenido.tarea',
                    'trabajo.estudiante'
                ])
                ->orderBy('fecha_calificacion', 'desc')
                ->paginate(15);

            // Obtener cursos del profesor
            $cursos = $user->cursosComoProfesor()->get();

            return Inertia::render('Calificaciones/Index', [
                'calificaciones' => $calificaciones,
                'cursos' => $cursos,
            ]);
        }

        abort(403, 'No tienes permiso para ver calificaciones.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCalificacionRequest $request, Trabajo $trabajo)
    {
        try {
            DB::beginTransaction();

            // Verificar que el trabajo esté entregado
            if (!$trabajo->estaEntregado()) {
                return back()->withErrors([
                    'error' => 'No puedes calificar un trabajo que no ha sido entregado.'
                ]);
            }

            // Verificar si ya existe una calificación
            if ($trabajo->calificacion) {
                return back()->withErrors([
                    'error' => 'Este trabajo ya ha sido calificado. Usa la opción de actualizar si deseas modificar la calificación.'
                ]);
            }

            // Crear la calificación
            $calificacion = Calificacion::create([
                'trabajo_id' => $trabajo->id,
                'puntaje' => $request->puntaje,
                'comentario' => $request->comentario,
                'fecha_calificacion' => now(),
                'evaluador_id' => auth()->id(),
                'criterios_evaluacion' => $request->criterios_evaluacion,
            ]);

            // Actualizar estado del trabajo a "calificado"
            $trabajo->update([
                'estado' => 'calificado',
            ]);

            // Notificar al estudiante
            \App\Models\Notificacion::crear(
                destinatario: $trabajo->estudiante,
                tipo: 'calificacion',
                titulo: 'Trabajo calificado',
                contenido: "Tu trabajo '{$trabajo->contenido->titulo}' ha sido calificado. Puntaje: {$request->puntaje}",
                datos_adicionales: [
                    'trabajo_id' => $trabajo->id,
                    'calificacion_id' => $calificacion->id,
                    'puntaje' => $request->puntaje,
                ]
            );

            DB::commit();

            return redirect()
                ->route('trabajos.show', $trabajo->id)
                ->with('success', 'Trabajo calificado exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al calificar el trabajo: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Calificacion $calificacion)
    {
        $user = auth()->user();

        // Verificar permisos
        if ($user->esEstudiante() && $calificacion->trabajo->estudiante_id !== $user->id) {
            abort(403, 'No tienes acceso a esta calificación.');
        }

        if ($user->esProfesor() && $calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes acceso a esta calificación.');
        }

        $calificacion->load([
            'trabajo.contenido.curso',
            'trabajo.contenido.tarea',
            'trabajo.estudiante',
            'evaluador'
        ]);

        return Inertia::render('Calificaciones/Show', [
            'calificacion' => $calificacion,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Calificacion $calificacion)
    {
        $user = $request->user();

        // Solo el profesor evaluador puede actualizar
        if (!$user->esProfesor() || $calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes permiso para actualizar esta calificación.');
        }

        // Validar
        $validated = $request->validate([
            'puntaje' => 'required|numeric|min:0',
            'comentario' => 'nullable|string|max:5000',
            'criterios_evaluacion' => 'nullable|array',
        ]);

        try {
            DB::beginTransaction();

            $calificacion->update([
                'puntaje' => $validated['puntaje'],
                'comentario' => $validated['comentario'] ?? $calificacion->comentario,
                'criterios_evaluacion' => $validated['criterios_evaluacion'] ?? $calificacion->criterios_evaluacion,
            ]);

            // Notificar al estudiante sobre la actualización
            \App\Models\Notificacion::crear(
                destinatario: $calificacion->trabajo->estudiante,
                tipo: 'calificacion',
                titulo: 'Calificación actualizada',
                contenido: "Tu calificación para '{$calificacion->trabajo->contenido->titulo}' ha sido actualizada. Nuevo puntaje: {$validated['puntaje']}",
                datos_adicionales: [
                    'trabajo_id' => $calificacion->trabajo_id,
                    'calificacion_id' => $calificacion->id,
                    'puntaje' => $validated['puntaje'],
                ]
            );

            DB::commit();

            return back()->with('success', 'Calificación actualizada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al actualizar la calificación: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Calificacion $calificacion)
    {
        $user = auth()->user();

        // Solo el profesor evaluador o un administrador pueden eliminar
        if (!$user->esProfesor() || $calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes permiso para eliminar esta calificación.');
        }

        try {
            DB::beginTransaction();

            // Actualizar estado del trabajo a "entregado" (ya no calificado)
            $calificacion->trabajo->update([
                'estado' => 'entregado',
            ]);

            $calificacion->delete();

            DB::commit();

            return redirect()
                ->route('trabajos.show', $calificacion->trabajo_id)
                ->with('success', 'Calificación eliminada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al eliminar la calificación: ' . $e->getMessage()]);
        }
    }

    /**
     * Exportar calificaciones de un curso a CSV
     */
    public function exportar(Request $request)
    {
        $user = $request->user();

        if (!$user->esProfesor()) {
            abort(403, 'No tienes permiso para exportar calificaciones.');
        }

        $cursoId = $request->get('curso_id');

        if (!$cursoId) {
            return back()->withErrors(['error' => 'Debes especificar un curso.']);
        }

        // Obtener calificaciones del curso
        $calificaciones = Calificacion::whereHas('trabajo.contenido', function ($q) use ($cursoId, $user) {
            $q->where('curso_id', $cursoId)
              ->where('creador_id', $user->id);
        })
            ->with([
                'trabajo.contenido.tarea',
                'trabajo.estudiante'
            ])
            ->get();

        // Generar CSV
        $filename = 'calificaciones_curso_' . $cursoId . '_' . date('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($calificaciones) {
            $file = fopen('php://output', 'w');

            // Encabezados
            fputcsv($file, [
                'Estudiante',
                'Matrícula',
                'Tarea',
                'Puntaje',
                'Calificación Letra',
                'Estado',
                'Fecha Entrega',
                'Fecha Calificación',
                'Comentario'
            ]);

            // Datos
            foreach ($calificaciones as $calificacion) {
                fputcsv($file, [
                    $calificacion->trabajo->estudiante->name,
                    $calificacion->trabajo->estudiante->estudiante->matricula ?? 'N/A',
                    $calificacion->trabajo->contenido->titulo,
                    $calificacion->puntaje,
                    $calificacion->getCalificacionLetra(),
                    $calificacion->trabajo->estado,
                    $calificacion->trabajo->fecha_entrega?->format('Y-m-d H:i'),
                    $calificacion->fecha_calificacion->format('Y-m-d H:i'),
                    $calificacion->comentario ?? '',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
