<?php

namespace App\Http\Controllers;

use App\Models\Evaluacion;
use App\Models\Contenido;
use App\Models\Curso;
use App\Models\Pregunta;
use App\Models\Trabajo;
use App\Http\Requests\StoreEvaluacionRequest;
use App\Http\Requests\UpdateEvaluacionRequest;
use App\Http\Requests\StoreRespuestaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EvaluacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Evaluacion::with(['contenido.curso', 'contenido.creador', 'preguntas'])
            ->join('contenidos', 'evaluaciones.contenido_id', '=', 'contenidos.id');

        if ($user->esProfesor()) {
            // Profesor: ver solo las evaluaciones que ha creado
            $query->where('contenidos.creador_id', $user->id);
        } elseif ($user->esEstudiante()) {
            // Estudiante: ver evaluaciones de los cursos en los que está inscrito
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

        if ($request->filled('tipo_evaluacion')) {
            $query->where('evaluaciones.tipo_evaluacion', $request->tipo_evaluacion);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('contenidos.titulo', 'like', "%{$search}%")
                  ->orWhere('contenidos.descripcion', 'like', "%{$search}%");
            });
        }

        // Ordenar
        $sortField = $request->get('sort', 'fecha_creacion');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy("contenidos.{$sortField}", $sortDirection);

        $evaluaciones = $query->select('evaluaciones.*')
            ->paginate(15)
            ->withQueryString();

        // Para cada evaluación, si es estudiante, agregar información de su intento
        if ($user->esEstudiante()) {
            $evaluaciones->getCollection()->transform(function ($evaluacion) use ($user) {
                $trabajo = $evaluacion->contenido->trabajos()
                    ->where('estudiante_id', $user->id)
                    ->with('calificacion')
                    ->latest()
                    ->first();

                $evaluacion->mi_trabajo = $trabajo;
                return $evaluacion;
            });
        }

        // Obtener cursos para el filtro
        $cursos = $user->esProfesor()
            ? $user->cursosComoProfesor()->get()
            : $user->cursosComoEstudiante()->get();

        // Renderizar vista según el rol
        if ($user->esProfesor()) {
            return Inertia::render('Evaluaciones/IndexProfesor', [
                'evaluaciones' => $evaluaciones,
                'cursos' => $cursos,
                'filters' => $request->only(['curso_id', 'estado', 'tipo_evaluacion', 'search', 'sort', 'direction']),
            ]);
        } else {
            return Inertia::render('Evaluaciones/IndexEstudiante', [
                'evaluaciones' => $evaluaciones,
                'cursos' => $cursos,
                'filters' => $request->only(['curso_id', 'search']),
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();

        // Solo profesores pueden crear evaluaciones
        if (!$user->esProfesor()) {
            abort(403, 'No tienes permiso para crear evaluaciones.');
        }

        $cursos = $user->cursosComoProfesor()->get();

        return Inertia::render('Evaluaciones/Create', [
            'cursos' => $cursos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEvaluacionRequest $request)
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
                'tipo' => 'evaluacion',
                'estado' => $request->estado ?? 'borrador',
            ]);

            // Crear la evaluación
            $evaluacion = Evaluacion::create([
                'contenido_id' => $contenido->id,
                'tipo_evaluacion' => $request->tipo_evaluacion,
                'puntuacion_total' => $request->puntuacion_total,
                'tiempo_limite' => $request->tiempo_limite,
                'calificacion_automatica' => $request->calificacion_automatica ?? true,
                'mostrar_respuestas' => $request->mostrar_respuestas ?? true,
                'permite_reintento' => $request->permite_reintento ?? false,
                'max_reintentos' => $request->max_reintentos ?? 1,
            ]);

            // Crear preguntas si se proporcionaron
            if ($request->has('preguntas') && is_array($request->preguntas)) {
                foreach ($request->preguntas as $index => $preguntaData) {
                    Pregunta::create([
                        'evaluacion_id' => $evaluacion->id,
                        'enunciado' => $preguntaData['enunciado'],
                        'tipo' => $preguntaData['tipo'],
                        'opciones' => $preguntaData['opciones'] ?? null,
                        'respuesta_correcta' => $preguntaData['respuesta_correcta'],
                        'puntos' => $preguntaData['puntos'],
                        'orden' => $index + 1,
                    ]);
                }
            }

            // Si la evaluación se publica, notificar a estudiantes
            if ($request->estado === 'publicado') {
                $curso = Curso::find($request->curso_id);
                $estudiantes = $curso->estudiantes;

                foreach ($estudiantes as $estudiante) {
                    \App\Models\Notificacion::crear(
                        destinatario: $estudiante,
                        tipo: 'evaluacion',
                        titulo: 'Nueva evaluación disponible',
                        contenido: "Se ha publicado una nueva evaluación: {$request->titulo}",
                        datos_adicionales: [
                            'evaluacion_id' => $evaluacion->id,
                            'curso_id' => $request->curso_id,
                        ]
                    );
                }
            }

            DB::commit();

            return redirect()
                ->route('evaluaciones.show', $evaluacion->id)
                ->with('success', 'Evaluación creada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al crear la evaluación: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Evaluacion $evaluacione)
    {
        $user = auth()->user();

        // Cargar relaciones
        $evaluacione->load([
            'contenido.curso',
            'contenido.creador',
            'preguntas' => function ($query) {
                $query->orderBy('orden');
            },
        ]);

        // Verificar que la evaluación tiene contenido asociado
        if (!$evaluacione->contenido) {
            abort(404, 'La evaluación no tiene contenido asociado.');
        }

        // Verificar permisos
        if ($user->esEstudiante()) {
            // Estudiante solo puede ver evaluaciones de sus cursos
            $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
            if (!$cursosIds->contains($evaluacione->contenido->curso_id)) {
                abort(403, 'No tienes acceso a esta evaluación.');
            }

            // Obtener el trabajo del estudiante si existe
            $trabajo = $evaluacione->contenido->trabajos()
                ->where('estudiante_id', $user->id)
                ->with('calificacion')
                ->latest()
                ->first();

            return Inertia::render('Evaluaciones/Show', [
                'evaluacion' => $evaluacione,
                'trabajo' => $trabajo,
                'estadisticas' => null,
            ]);
        } elseif ($user->esProfesor()) {
            // Profesor solo puede ver sus propias evaluaciones
            if ($evaluacione->contenido->creador_id !== $user->id) {
                abort(403, 'No tienes acceso a esta evaluación.');
            }

            // Obtener estadísticas de la evaluación
            $estadisticas = $evaluacione->obtenerEstadisticas();

            // Obtener trabajos con calificaciones
            $trabajos = $evaluacione->contenido->trabajos()
                ->with(['estudiante', 'calificacion'])
                ->get();

            return Inertia::render('Evaluaciones/Show', [
                'evaluacion' => $evaluacione,
                'trabajo' => null,
                'estadisticas' => $estadisticas,
                'trabajos' => $trabajos,
            ]);
        }

        abort(403, 'No tienes permiso para ver esta evaluación.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Evaluacion $evaluacione)
    {
        $user = auth()->user();

        // Verificar que sea el profesor creador
        if (!$user->esProfesor() || $evaluacione->contenido->creador_id !== $user->id) {
            abort(403, 'No tienes permiso para editar esta evaluación.');
        }

        $evaluacione->load(['contenido.curso', 'preguntas' => function ($query) {
            $query->orderBy('orden');
        }]);

        $cursos = $user->cursosComoProfesor()->get();

        return Inertia::render('Evaluaciones/Edit', [
            'evaluacion' => $evaluacione,
            'cursos' => $cursos,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEvaluacionRequest $request, Evaluacion $evaluacione)
    {
        try {
            DB::beginTransaction();

            // Actualizar contenido
            $evaluacione->contenido->update([
                'titulo' => $request->titulo ?? $evaluacione->contenido->titulo,
                'descripcion' => $request->descripcion ?? $evaluacione->contenido->descripcion,
                'fecha_limite' => $request->fecha_limite ?? $evaluacione->contenido->fecha_limite,
                'estado' => $request->estado ?? $evaluacione->contenido->estado,
            ]);

            // Actualizar evaluación
            $evaluacione->update([
                'tipo_evaluacion' => $request->tipo_evaluacion ?? $evaluacione->tipo_evaluacion,
                'puntuacion_total' => $request->puntuacion_total ?? $evaluacione->puntuacion_total,
                'tiempo_limite' => $request->tiempo_limite ?? $evaluacione->tiempo_limite,
                'calificacion_automatica' => $request->calificacion_automatica ?? $evaluacione->calificacion_automatica,
                'mostrar_respuestas' => $request->mostrar_respuestas ?? $evaluacione->mostrar_respuestas,
                'permite_reintento' => $request->permite_reintento ?? $evaluacione->permite_reintento,
                'max_reintentos' => $request->max_reintentos ?? $evaluacione->max_reintentos,
            ]);

            // Si se está publicando por primera vez, notificar a estudiantes
            if ($request->estado === 'publicado' && $evaluacione->contenido->estado !== 'publicado') {
                $curso = Curso::find($evaluacione->contenido->curso_id);
                $estudiantes = $curso->estudiantes;

                foreach ($estudiantes as $estudiante) {
                    \App\Models\Notificacion::crear(
                        destinatario: $estudiante,
                        tipo: 'evaluacion',
                        titulo: 'Nueva evaluación disponible',
                        contenido: "Se ha publicado una nueva evaluación: {$evaluacione->contenido->titulo}",
                        datos_adicionales: [
                            'evaluacion_id' => $evaluacione->id,
                            'curso_id' => $evaluacione->contenido->curso_id,
                        ]
                    );
                }
            }

            DB::commit();

            return redirect()
                ->route('evaluaciones.show', $evaluacione->id)
                ->with('success', 'Evaluación actualizada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al actualizar la evaluación: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Evaluacion $evaluacione)
    {
        $user = auth()->user();

        // Verificar que sea el profesor creador
        if (!$user->esProfesor() || $evaluacione->contenido->creador_id !== $user->id) {
            abort(403, 'No tienes permiso para eliminar esta evaluación.');
        }

        try {
            DB::beginTransaction();

            // Eliminar preguntas
            $evaluacione->preguntas()->delete();

            // Eliminar trabajos asociados
            foreach ($evaluacione->contenido->trabajos as $trabajo) {
                $trabajo->calificaciones()->delete();
                $trabajo->delete();
            }

            // Eliminar evaluación y contenido
            $contenidoId = $evaluacione->contenido_id;
            $evaluacione->delete();
            Contenido::find($contenidoId)->delete();

            DB::commit();

            return redirect()
                ->route('evaluaciones.index')
                ->with('success', 'Evaluación eliminada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al eliminar la evaluación: ' . $e->getMessage()]);
        }
    }

    /**
     * Página para tomar la evaluación (estudiante)
     */
    public function take(Evaluacion $evaluacione)
    {
        $user = auth()->user();

        // Solo estudiantes pueden tomar evaluaciones
        if (!$user->esEstudiante()) {
            abort(403, 'Solo los estudiantes pueden tomar evaluaciones.');
        }

        // Verificar que el estudiante esté inscrito en el curso
        $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
        if (!$cursosIds->contains($evaluacione->contenido->curso_id)) {
            abort(403, 'No tienes acceso a esta evaluación.');
        }

        // Verificar que la evaluación esté publicada
        if ($evaluacione->contenido->estado !== 'publicado') {
            return back()->withErrors(['error' => 'Esta evaluación no está disponible.']);
        }

        // Verificar si ya tiene un trabajo en progreso o terminado
        $trabajoExistente = $evaluacione->contenido->trabajos()
            ->where('estudiante_id', $user->id)
            ->latest()
            ->first();

        // Verificar reintentos
        if ($trabajoExistente && $trabajoExistente->estaCalificado()) {
            if (!$evaluacione->puedeReintentar($user)) {
                return back()->withErrors([
                    'error' => 'Has agotado el número máximo de intentos para esta evaluación.'
                ]);
            }
        }

        // Cargar preguntas (sin respuestas correctas para el estudiante)
        $evaluacione->load([
            'contenido.curso',
            'preguntas' => function ($query) {
                $query->orderBy('orden')->select([
                    'id',
                    'evaluacion_id',
                    'enunciado',
                    'tipo',
                    'opciones',
                    'puntos',
                    'orden'
                ]);
            },
        ]);

        return Inertia::render('Evaluaciones/Take', [
            'evaluacion' => $evaluacione,
            'trabajo_existente' => $trabajoExistente,
        ]);
    }

    /**
     * Guardar respuestas de la evaluación
     */
    public function submitRespuestas(StoreRespuestaRequest $request, Evaluacion $evaluacione)
    {
        $user = $request->user();

        try {
            DB::beginTransaction();

            // Crear el trabajo del estudiante
            $trabajo = Trabajo::create([
                'contenido_id' => $evaluacione->contenido_id,
                'estudiante_id' => $user->id,
                'estado' => 'entregado',
                'fecha_inicio' => now()->subMinutes($request->tiempo_usado ?? 0),
                'fecha_entrega' => now(),
                'respuestas' => $request->respuestas,
            ]);

            // Si tiene calificación automática, calificar inmediatamente
            if ($evaluacione->calificacion_automatica) {
                $evaluacione->calificarAutomaticamente($trabajo);
            }

            // Notificar al profesor
            \App\Models\Notificacion::crear(
                destinatario: $evaluacione->contenido->creador,
                tipo: 'evaluacion',
                titulo: 'Evaluación completada',
                contenido: "{$user->name} ha completado la evaluación: {$evaluacione->contenido->titulo}",
                datos_adicionales: [
                    'evaluacion_id' => $evaluacione->id,
                    'trabajo_id' => $trabajo->id,
                    'estudiante_id' => $user->id,
                ]
            );

            DB::commit();

            return redirect()
                ->route('evaluaciones.results', $evaluacione->id)
                ->with('success', 'Evaluación enviada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al enviar la evaluación: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Ver resultados de la evaluación (estudiante)
     */
    public function results(Evaluacion $evaluacione)
    {
        $user = auth()->user();

        // Solo estudiantes pueden ver sus resultados
        if (!$user->esEstudiante()) {
            abort(403);
        }

        // Cargar relaciones necesarias
        $evaluacione->load([
            'contenido.curso',
            'preguntas' => function ($query) use ($evaluacione) {
                $query->orderBy('orden');
                // Solo mostrar respuestas correctas si está configurado
                if (!$evaluacione->mostrar_respuestas) {
                    $query->select([
                        'id',
                        'evaluacion_id',
                        'enunciado',
                        'tipo',
                        'opciones',
                        'puntos',
                        'orden'
                    ]);
                }
            },
        ]);

        // Verificar que la evaluación tiene contenido
        if (!$evaluacione->contenido) {
            abort(404, 'La evaluación no tiene contenido asociado.');
        }

        // Verificar que el estudiante está inscrito en el curso
        $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
        if (!$cursosIds->contains($evaluacione->contenido->curso_id)) {
            abort(403, 'No tienes acceso a esta evaluación.');
        }

        // Obtener el último trabajo del estudiante
        $trabajo = $evaluacione->contenido->trabajos()
            ->where('estudiante_id', $user->id)
            ->with('calificacion')
            ->latest()
            ->first();

        if (!$trabajo) {
            abort(404, 'No has completado esta evaluación aún.');
        }

        return Inertia::render('Evaluaciones/Results', [
            'evaluacion' => $evaluacione,
            'trabajo' => $trabajo,
            'mostrar_respuestas' => $evaluacione->mostrar_respuestas,
        ]);
    }
}
