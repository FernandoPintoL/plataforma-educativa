<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use App\Models\Contenido;
use App\Models\Curso;
use App\Models\Recurso;
use App\Http\Requests\StoreTareaRequest;
use App\Http\Requests\UpdateTareaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TareaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Tarea::with(['contenido.curso', 'contenido.creador'])
            ->join('contenidos', 'tareas.contenido_id', '=', 'contenidos.id');

        if ($user->esProfesor()) {
            // Profesor: ver solo las tareas que ha creado
            $query->where('contenidos.creador_id', $user->id);
        } elseif ($user->esEstudiante()) {
            // Estudiante: ver tareas de los cursos en los que está inscrito
            $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
            $query->whereIn('contenidos.curso_id', $cursosIds)
                ->where('contenidos.estado', 'publicado');
        }

        // Filtros
        if ($request->filled('curso_id')) {
            $query->where('contenidos.curso_id', $request->curso_id);
        }

        if ($request->filled('estado')) {
            $query->where('contenidos.estado', $request->estado);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('contenidos.titulo', 'like', "%{$search}%")
                  ->orWhere('tareas.instrucciones', 'like', "%{$search}%");
            });
        }

        // Ordenar
        $sortField = $request->get('sort', 'fecha_creacion');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy("contenidos.{$sortField}", $sortDirection);

        $tareas = $query->select('tareas.*')
            ->paginate(15)
            ->withQueryString();

        // Obtener cursos para el filtro
        $cursos = $user->esProfesor()
            ? $user->cursosComoProfesor()->get()
            : $user->cursosComoEstudiante()->get();

        return Inertia::render('Tareas/Index', [
            'tareas' => $tareas,
            'cursos' => $cursos,
            'filters' => $request->only(['curso_id', 'estado', 'search', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();

        // Solo profesores pueden crear tareas
        if (!$user->esProfesor()) {
            abort(403, 'No tienes permiso para crear tareas.');
        }

        $cursos = $user->cursosComoProfesor()->get();

        return Inertia::render('Tareas/Create', [
            'cursos' => $cursos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTareaRequest $request)
    {
        try {
            DB::beginTransaction();

            // Crear contenido base
            $contenido = Contenido::create([
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'fecha_creacion' => now(),
                'fecha_limite' => $request->fecha_limite,
                'creador_id' => auth()->id(),
                'curso_id' => $request->curso_id,
                'tipo' => 'tarea',
                'estado' => $request->estado ?? 'borrador',
            ]);

            // Crear la tarea
            $tarea = Tarea::create([
                'contenido_id' => $contenido->id,
                'instrucciones' => $request->instrucciones,
                'puntuacion' => $request->puntuacion,
                'permite_archivos' => $request->permite_archivos ?? true,
                'max_archivos' => $request->max_archivos ?? 5,
                'tipo_archivo_permitido' => $request->tipo_archivo_permitido,
                'fecha_limite' => $request->fecha_limite,
            ]);

            // Si la tarea se publica, asignar a todos los estudiantes del curso
            if ($request->estado === 'publicado') {
                $curso = Curso::find($request->curso_id);
                $estudiantes = $curso->estudiantes;

                foreach ($estudiantes as $estudiante) {
                    $tarea->asignar($estudiante);
                }

                // Crear notificaciones para los estudiantes
                foreach ($estudiantes as $estudiante) {
                    \App\Models\Notificacion::crear(
                        destinatario: $estudiante,
                        tipo: 'tarea',
                        titulo: 'Nueva tarea asignada',
                        contenido: "Se ha publicado una nueva tarea: {$request->titulo}",
                        datos_adicionales: [
                            'tarea_id' => $tarea->id,
                            'curso_id' => $request->curso_id,
                        ]
                    );
                }
            }

            // Manejar recursos adjuntos
            if ($request->hasFile('recursos')) {
                foreach ($request->file('recursos') as $file) {
                    $path = $file->store('recursos/tareas/' . $tarea->id, 'public');

                    $recurso = Recurso::create([
                        'nombre' => $file->getClientOriginalName(),
                        'tipo' => $this->detectarTipoRecurso($file->getMimeType()),
                        'archivo_path' => $path,
                        'tamaño' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                    ]);

                    $contenido->recursos()->attach($recurso->id);
                }
            }

            DB::commit();

            return redirect()
                ->route('tareas.show', $tarea->id)
                ->with('success', 'Tarea creada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al crear la tarea: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Tarea $tarea)
    {
        $user = auth()->user();

        // Cargar relaciones
        $tarea->load([
            'contenido.curso',
            'contenido.creador',
            'contenido.recursos',
            'trabajos.estudiante',
            'trabajos.calificacion'
        ]);

        // Verificar permisos
        if ($user->esEstudiante()) {
            // Estudiante solo puede ver tareas de sus cursos
            $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
            if (!$cursosIds->contains($tarea->contenido->curso_id)) {
                abort(403, 'No tienes acceso a esta tarea.');
            }

            // Obtener el trabajo del estudiante si existe
            $trabajo = $tarea->trabajos()
                ->where('estudiante_id', $user->id)
                ->with('calificacion')
                ->first();

            return Inertia::render('Tareas/Show', [
                'tarea' => $tarea,
                'trabajo' => $trabajo,
                'estadisticas' => null,
            ]);
        } elseif ($user->esProfesor()) {
            // Profesor solo puede ver sus propias tareas
            if ($tarea->contenido->creador_id !== $user->id) {
                abort(403, 'No tienes acceso a esta tarea.');
            }

            // Obtener estadísticas de la tarea
            $estadisticas = $tarea->obtenerEstadisticas();

            return Inertia::render('Tareas/Show', [
                'tarea' => $tarea,
                'trabajo' => null,
                'estadisticas' => $estadisticas,
            ]);
        }

        abort(403, 'No tienes permiso para ver esta tarea.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tarea $tarea)
    {
        $user = auth()->user();

        // Verificar que sea el profesor creador
        if (!$user->esProfesor() || $tarea->contenido->creador_id !== $user->id) {
            abort(403, 'No tienes permiso para editar esta tarea.');
        }

        $tarea->load(['contenido.curso', 'contenido.recursos']);

        $cursos = $user->cursosComoProfesor()->get();

        return Inertia::render('Tareas/Edit', [
            'tarea' => $tarea,
            'cursos' => $cursos,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTareaRequest $request, Tarea $tarea)
    {
        try {
            DB::beginTransaction();

            // Actualizar contenido
            $tarea->contenido->update([
                'titulo' => $request->titulo ?? $tarea->contenido->titulo,
                'descripcion' => $request->descripcion ?? $tarea->contenido->descripcion,
                'fecha_limite' => $request->fecha_limite ?? $tarea->contenido->fecha_limite,
                'estado' => $request->estado ?? $tarea->contenido->estado,
            ]);

            // Actualizar tarea
            $tarea->update([
                'instrucciones' => $request->instrucciones ?? $tarea->instrucciones,
                'puntuacion' => $request->puntuacion ?? $tarea->puntuacion,
                'permite_archivos' => $request->permite_archivos ?? $tarea->permite_archivos,
                'max_archivos' => $request->max_archivos ?? $tarea->max_archivos,
                'tipo_archivo_permitido' => $request->tipo_archivo_permitido ?? $tarea->tipo_archivo_permitido,
                'fecha_limite' => $request->fecha_limite ?? $tarea->fecha_limite,
            ]);

            // Si se está publicando por primera vez, asignar a estudiantes
            if ($request->estado === 'publicado' && $tarea->contenido->estado !== 'publicado') {
                $curso = Curso::find($tarea->contenido->curso_id);
                $estudiantes = $curso->estudiantes;

                foreach ($estudiantes as $estudiante) {
                    // Solo asignar si no existe ya un trabajo
                    $trabajoExistente = $tarea->trabajos()
                        ->where('estudiante_id', $estudiante->id)
                        ->exists();

                    if (!$trabajoExistente) {
                        $tarea->asignar($estudiante);

                        // Notificar al estudiante
                        \App\Models\Notificacion::crear(
                            destinatario: $estudiante,
                            tipo: 'tarea',
                            titulo: 'Nueva tarea asignada',
                            contenido: "Se ha publicado una nueva tarea: {$tarea->contenido->titulo}",
                            datos_adicionales: [
                                'tarea_id' => $tarea->id,
                                'curso_id' => $tarea->contenido->curso_id,
                            ]
                        );
                    }
                }
            }

            // Manejar nuevos recursos adjuntos
            if ($request->hasFile('recursos')) {
                foreach ($request->file('recursos') as $file) {
                    $path = $file->store('recursos/tareas/' . $tarea->id, 'public');

                    $recurso = Recurso::create([
                        'nombre' => $file->getClientOriginalName(),
                        'tipo' => $this->detectarTipoRecurso($file->getMimeType()),
                        'archivo_path' => $path,
                        'tamaño' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                    ]);

                    $tarea->contenido->recursos()->attach($recurso->id);
                }
            }

            DB::commit();

            return redirect()
                ->route('tareas.show', $tarea->id)
                ->with('success', 'Tarea actualizada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al actualizar la tarea: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tarea $tarea)
    {
        $user = auth()->user();

        // Verificar que sea el profesor creador
        if (!$user->esProfesor() || $tarea->contenido->creador_id !== $user->id) {
            abort(403, 'No tienes permiso para eliminar esta tarea.');
        }

        try {
            DB::beginTransaction();

            // Eliminar recursos asociados (archivos físicos)
            foreach ($tarea->contenido->recursos as $recurso) {
                if ($recurso->archivo_path) {
                    Storage::disk('public')->delete($recurso->archivo_path);
                }
                $recurso->delete();
            }

            // Eliminar trabajos asociados y sus archivos
            foreach ($tarea->trabajos as $trabajo) {
                // Eliminar archivos de entregas si existen
                // TODO: implementar cuando se agregue el sistema de archivos en trabajos

                $trabajo->delete();
            }

            // Eliminar tarea y contenido
            $contenidoId = $tarea->contenido_id;
            $tarea->delete();
            Contenido::find($contenidoId)->delete();

            DB::commit();

            return redirect()
                ->route('tareas.index')
                ->with('success', 'Tarea eliminada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al eliminar la tarea: ' . $e->getMessage()]);
        }
    }

    /**
     * Detectar el tipo de recurso según el MIME type
     */
    private function detectarTipoRecurso(string $mimeType): string
    {
        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        } elseif (str_starts_with($mimeType, 'image/')) {
            return 'imagen';
        } elseif (str_starts_with($mimeType, 'audio/')) {
            return 'audio';
        } elseif (in_array($mimeType, [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])) {
            return 'documento';
        } elseif (in_array($mimeType, [
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ])) {
            return 'presentacion';
        }

        return 'documento';
    }
}
