<?php

namespace App\Http\Controllers;

use App\Models\Trabajo;
use App\Models\Tarea;
use App\Http\Requests\StoreTrabajoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TrabajoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Trabajo::with([
            'contenido.curso',
            'contenido.tarea',
            'estudiante',
            'calificacion'
        ]);

        if ($user->esEstudiante()) {
            // Estudiante: ver sus propios trabajos
            $query->where('estudiante_id', $user->id);
        } elseif ($user->esProfesor()) {
            // Profesor: ver trabajos de sus tareas
            $tareasIds = Tarea::whereHas('contenido', function ($q) use ($user) {
                $q->where('creador_id', $user->id);
            })->pluck('contenido_id');

            $query->whereIn('contenido_id', $tareasIds);
        }

        // Filtros
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('curso_id')) {
            $query->whereHas('contenido', function ($q) use ($request) {
                $q->where('curso_id', $request->curso_id);
            });
        }

        // Ordenar
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $trabajos = $query->paginate(15)->withQueryString();

        // Obtener cursos para filtro
        $cursos = $user->esProfesor()
            ? $user->cursosComoProfesor()->get()
            : $user->cursosComoEstudiante()->get();

        return Inertia::render('Trabajos/Index', [
            'trabajos' => $trabajos,
            'cursos' => $cursos,
            'filters' => $request->only(['estado', 'curso_id', 'sort', 'direction']),
        ]);
    }

    /**
     * Store a newly created resource in storage (Entregar trabajo).
     */
    public function store(StoreTrabajoRequest $request, Tarea $tarea)
    {
        $user = $request->user();

        try {
            DB::beginTransaction();

            // Buscar o crear el trabajo del estudiante
            $trabajo = Trabajo::firstOrCreate(
                [
                    'contenido_id' => $tarea->contenido_id,
                    'estudiante_id' => $user->id,
                ],
                [
                    'estado' => 'en_progreso',
                    'fecha_inicio' => now(),
                ]
            );

            // Verificar que no esté ya entregado
            // TEMPORALMENTE COMENTADO: Permitir reentregas durante el desarrollo
            // if ($trabajo->estaEntregado() || $trabajo->estaCalificado()) {
            //     return back()->withErrors([
            //         'error' => 'Este trabajo ya fue entregado y no puede ser modificado.'
            //     ]);
            // }

            // Verificar fecha límite
            if ($tarea->fecha_limite && now() > $tarea->fecha_limite) {
                return back()->withErrors([
                    'error' => 'La fecha límite para entregar esta tarea ha expirado.'
                ]);
            }

            // Actualizar comentarios
            if ($request->filled('comentarios')) {
                $trabajo->comentarios = $request->comentarios;
            }

            // Manejar archivos subidos
            if ($request->hasFile('archivos')) {
                $archivosMetadata = [];

                foreach ($request->file('archivos') as $file) {
                    $path = $file->store("trabajos/{$trabajo->id}", 'public');

                    $archivosMetadata[] = [
                        'nombre' => $file->getClientOriginalName(),
                        'path' => $path,
                        'tamaño' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                        'fecha_subida' => now()->toDateTimeString(),
                    ];
                }

                // Guardar metadata en campo JSON
                $trabajo->respuestas = [
                    'archivos' => $archivosMetadata,
                ];
            }

            // Marcar como entregado
            $trabajo->entregar();
            $trabajo->save();

            // Notificar al profesor (con manejo de errores para no afectar la entrega)
            try {
                \App\Models\Notificacion::crear(
                    destinatario: $tarea->contenido->creador,
                    tipo: 'trabajo',
                    titulo: 'Nuevo trabajo entregado',
                    contenido: "{$user->name} ha entregado la tarea: {$tarea->contenido->titulo}",
                    datos_adicionales: [
                        'trabajo_id' => $trabajo->id,
                        'tarea_id' => $tarea->id,
                        'estudiante_id' => $user->id,
                    ]
                );
            } catch (\Exception $notificationError) {
                // Si falla la notificación, registrar en logs pero no afectar la entrega
                \Illuminate\Support\Facades\Log::warning('Error al crear notificación de trabajo entregado: ' . $notificationError->getMessage());
            }

            DB::commit();

            return redirect()
                ->route('tareas.show', $tarea->id)
                ->with('success', 'Trabajo entregado exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al entregar el trabajo: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Trabajo $trabajo)
    {
        $user = $request->user();

        // Solo el estudiante dueño puede actualizar antes de entregar
        if ($trabajo->estudiante_id !== $user->id) {
            abort(403, 'No tienes permiso para actualizar este trabajo.');
        }

        // No se puede actualizar si ya está entregado o calificado
        if ($trabajo->estaEntregado() || $trabajo->estaCalificado()) {
            return back()->withErrors([
                'error' => 'No puedes modificar un trabajo que ya fue entregado o calificado.'
            ]);
        }

        try {
            DB::beginTransaction();

            // Actualizar comentarios
            if ($request->filled('comentarios')) {
                $trabajo->comentarios = $request->comentarios;
            }

            // Manejar nuevos archivos
            if ($request->hasFile('archivos')) {
                $archivosMetadata = $trabajo->respuestas['archivos'] ?? [];

                foreach ($request->file('archivos') as $file) {
                    $path = $file->store("trabajos/{$trabajo->id}", 'public');

                    $archivosMetadata[] = [
                        'nombre' => $file->getClientOriginalName(),
                        'path' => $path,
                        'tamaño' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                        'fecha_subida' => now()->toDateTimeString(),
                    ];
                }

                $trabajo->respuestas = [
                    'archivos' => $archivosMetadata,
                ];
            }

            $trabajo->save();

            DB::commit();

            return back()->with('success', 'Trabajo actualizado exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al actualizar el trabajo: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trabajo $trabajo)
    {
        $user = auth()->user();

        // Solo el estudiante puede eliminar su trabajo antes de entregarlo
        if ($trabajo->estudiante_id !== $user->id) {
            abort(403, 'No tienes permiso para eliminar este trabajo.');
        }

        // No se puede eliminar si ya está entregado o calificado
        if ($trabajo->estaEntregado() || $trabajo->estaCalificado()) {
            return back()->withErrors([
                'error' => 'No puedes eliminar un trabajo que ya fue entregado o calificado.'
            ]);
        }

        try {
            // Eliminar archivos físicos si existen
            if (isset($trabajo->respuestas['archivos'])) {
                foreach ($trabajo->respuestas['archivos'] as $archivo) {
                    if (isset($archivo['path'])) {
                        Storage::disk('public')->delete($archivo['path']);
                    }
                }
            }

            $trabajo->delete();

            return redirect()
                ->route('trabajos.index')
                ->with('success', 'Trabajo eliminado exitosamente.');

        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Error al eliminar el trabajo: ' . $e->getMessage()]);
        }
    }

    /**
     * Descargar archivo de un trabajo
     */
    public function descargarArchivo(Trabajo $trabajo, $archivoIndex)
    {
        $user = auth()->user();

        // Verificar permisos
        if ($user->esEstudiante() && $trabajo->estudiante_id !== $user->id) {
            abort(403, 'No tienes acceso a este archivo.');
        }

        if ($user->esProfesor() && $trabajo->contenido->creador_id !== $user->id) {
            abort(403, 'No tienes acceso a este archivo.');
        }

        // Obtener archivo
        $archivos = $trabajo->respuestas['archivos'] ?? [];

        if (!isset($archivos[$archivoIndex])) {
            abort(404, 'Archivo no encontrado.');
        }

        $archivo = $archivos[$archivoIndex];
        $path = $archivo['path'];

        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'El archivo físico no existe.');
        }

        return Storage::disk('public')->download($path, $archivo['nombre']);
    }

    /**
     * Página para calificar un trabajo (solo para profesores)
     */
    public function calificar(Trabajo $trabajo)
    {
        $user = auth()->user();

        // Verificar que sea profesor y creador de la tarea
        if (!$user->esProfesor() || $trabajo->contenido->creador_id !== $user->id) {
            abort(403, 'No tienes permiso para calificar este trabajo.');
        }

        // Verificar que el trabajo esté entregado
        if (!$trabajo->estaEntregado()) {
            return back()->withErrors([
                'error' => 'No puedes calificar un trabajo que no ha sido entregado.'
            ]);
        }

        // Forzar refresh del modelo para obtener datos frescos de la BD
        // Esto es crítico después de un POST que actualiza la calificación
        $trabajo->refresh();

        $trabajo->load([
            'contenido.curso',
            'contenido.tarea',
            'estudiante',
            'calificacion',
            'calificacion.analisisIA'
        ]);

        Log::info('Cargando página de calificación con datos frescos', [
            'trabajo_id' => $trabajo->id,
            'calificacion_id' => $trabajo->calificacion?->id,
            'puntaje_actual' => $trabajo->calificacion?->puntaje,
            'timestamp' => now(),
        ]);

        // Obtener análisis de IA si existe
        $analisisIA = $trabajo->calificacion?->analisisIA;

        return Inertia::render('Trabajos/Calificar', [
            'trabajo' => $trabajo,
            'analisisIA' => $analisisIA,
        ]);
    }
}
