<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use App\Models\Contenido;
use App\Models\Curso;
use App\Models\Recurso;
use App\Models\Trabajo;
use App\Models\User;
use App\Http\Requests\StoreTareaRequest;
use App\Http\Requests\UpdateTareaRequest;
use App\Services\HintGenerator;
use App\Services\StudentProgressMonitor;
use App\Services\FeedbackIntellicentService;
use App\Services\AnomalyDetectionService;
use App\Services\AgentSynthesisService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TareaController extends Controller
{
    protected HintGenerator $hintGenerator;
    protected StudentProgressMonitor $progressMonitor;
    protected FeedbackIntellicentService $feedbackService;
    protected AnomalyDetectionService $anomalyService;
    protected AgentSynthesisService $agentService;

    public function __construct(
        HintGenerator $hintGenerator,
        StudentProgressMonitor $progressMonitor,
        FeedbackIntellicentService $feedbackService,
        AnomalyDetectionService $anomalyService,
        AgentSynthesisService $agentService
    ) {
        $this->hintGenerator = $hintGenerator;
        $this->progressMonitor = $progressMonitor;
        $this->feedbackService = $feedbackService;
        $this->anomalyService = $anomalyService;
        $this->agentService = $agentService;
    }
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
            'userRole' => $user->esProfesor() ? 'profesor' : ($user->esEstudiante() ? 'estudiante' : 'otro'),
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

        return Inertia::render('Tareas/TareaWizard', [
            'cursos' => $cursos,
            'csrfToken' => csrf_token(),
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
                ->route('tareas.index')
                ->with('success', 'Tarea "' . $request->titulo . '" publicada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al crear la tarea: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource (ML-ENHANCED)
     * Enriquece la vista con:
     * - Monitoreo de progreso
     * - Hints inteligentes
     * - Detección de dificultad
     * - Predicción de entrega tardía
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

            // ENRIQUECIMIENTO ML para estudiantes
            $enriquecimiento_ml = [];
            if ($trabajo) {
                try {
                    $enriquecimiento_ml = $this->enriquecerVistaTareaEstudiante($trabajo, $tarea, $user);
                } catch (\Exception $e) {
                    Log::warning("Error enriqueciendo vista ML para tarea {$tarea->id}: {$e->getMessage()}");
                }
            }

            // Vista para estudiante
            return Inertia::render('Tareas/ViewEstudiante', [
                'tarea' => $tarea,
                'trabajo' => $trabajo,
                'ml_insights' => $enriquecimiento_ml,
            ]);
        } elseif ($user->esProfesor()) {
            // Profesor solo puede ver sus propias tareas
            if ($tarea->contenido->creador_id !== $user->id) {
                abort(403, 'No tienes acceso a esta tarea.');
            }

            // Obtener estadísticas de la tarea
            $estadisticas = $tarea->obtenerEstadisticas();

            // ENRIQUECIMIENTO ML para profesor
            $analisis_ml = [];
            try {
                $analisis_ml = $this->analizarTareaML($tarea);
            } catch (\Exception $e) {
                Log::warning("Error analizando tarea ML: {$e->getMessage()}");
            }

            // Vista para profesor
            return Inertia::render('Tareas/ViewProfesor', [
                'tarea' => $tarea,
                'estadisticas' => $estadisticas,
                'ml_analysis' => $analisis_ml,
            ]);
        }

        abort(403, 'No tienes permiso para ver esta tarea.');
    }

    /**
     * Enriquecer vista de tarea para estudiante
     * Agrega: hints, progreso, dificultad, alertas
     */
    private function enriquecerVistaTareaEstudiante(Trabajo $trabajo, Tarea $tarea, User $estudiante): array
    {
        $datos_ml = [
            'progreso' => null,
            'dificultad_detectada' => null,
            'hints_disponibles' => [],
            'riesgo_entrega_tardía' => false,
            'estimación_tiempo' => null,
            'recomendaciones' => [],
            'alerta' => null,
        ];

        try {
            // 1. MONITOREO DE PROGRESO
            $progreso = $this->obtenerProgresoTarea($trabajo);
            $datos_ml['progreso'] = $progreso;

            // 2. DETECCIÓN DE DIFICULTAD
            if ($trabajo->estado !== 'entregado' && $trabajo->estado !== 'calificado') {
                $dificultad = $this->detectarDificultad($trabajo, $tarea);
                $datos_ml['dificultad_detectada'] = $dificultad;

                // 3. GENERAR HINTS si hay dificultad
                if ($dificultad && $dificultad['nivel'] > 0.6) {
                    $hints = $this->generarHintsInteligentes($trabajo, $dificultad);
                    $datos_ml['hints_disponibles'] = $hints;
                }
            }

            // 4. PREDICCIÓN DE ENTREGA TARDÍA
            if ($tarea->contenido->fecha_limite) {
                $riesgo_entrega = $this->predecirRetrasoEntrega($trabajo, $tarea);
                $datos_ml['riesgo_entrega_tardía'] = $riesgo_entrega['en_riesgo'] ?? false;

                if ($riesgo_entrega['en_riesgo']) {
                    $datos_ml['alerta'] = [
                        'tipo' => 'warning',
                        'mensaje' => "Riesgo de entrega tardía detectado. {$riesgo_entrega['recomendacion']}",
                        'severidad' => $riesgo_entrega['severidad'],
                    ];
                }
            }

            // 5. ESTIMACIÓN DE TIEMPO
            $estimacion = $this->estimarTiempoRestante($trabajo, $tarea);
            $datos_ml['estimación_tiempo'] = $estimacion;

            // 6. RECOMENDACIONES
            $recomendaciones = $this->generarRecomendaciones($trabajo, $tarea, $estudiante);
            $datos_ml['recomendaciones'] = $recomendaciones;

        } catch (\Exception $e) {
            Log::error("Error en enriquecimiento ML: {$e->getMessage()}");
        }

        return $datos_ml;
    }

    /**
     * Obtener progreso actual de la tarea
     */
    private function obtenerProgresoTarea(Trabajo $trabajo): array
    {
        $tiempo_total = $trabajo->tiempo_total ?? 0;
        $intentos = $trabajo->intentos ?? 0;
        $consultas = $trabajo->consultas_material ?? 0;
        $correcciones = $trabajo->respuestas ? count(array_filter($trabajo->respuestas)) : 0;

        return [
            'tiempo_dedicado_minutos' => ceil($tiempo_total / 60),
            'num_intentos' => $intentos,
            'num_consultas_material' => $consultas,
            'num_correcciones' => $correcciones,
            'porcentaje_completado' => min(100, ($intentos * 25) + ($correcciones * 10)),
            'estado_actual' => $trabajo->estado,
        ];
    }

    /**
     * Detectar dificultad de la tarea para este estudiante
     */
    private function detectarDificultad(Trabajo $trabajo, Tarea $tarea): ?array
    {
        try {
            // Usar AnomalyDetectionService para detectar si hay dificultad
            $anomalias = $this->anomalyService->getStudentAnomalies($trabajo->estudiante_id);

            // Buscar anomalías relacionadas con esta tarea
            if (!empty($anomalias)) {
                // Retornar la primera anomalía encontrada
                $anomalia = reset($anomalias);
                return [
                    'nivel' => $anomalia['anomaly_score'] ?? 0.5,
                    'tipo' => $anomalia['anomaly_type'] ?? 'dificultad_general',
                    'descripcion' => $anomalia['anomaly_description'] ?? 'Dificultad detectada',
                ];
            }

            return null;

        } catch (\Exception $e) {
            Log::warning("Error detectando dificultad: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Generar hints inteligentes basado en dificultad
     */
    private function generarHintsInteligentes(Trabajo $trabajo, array $dificultad): array
    {
        $hints = [];

        try {
            $tema = $trabajo->contenido->titulo ?? 'Tarea';
            $nivel_dificultad = ceil($dificultad['nivel'] * 5); // Escala 1-5

            // Generar hint socrático
            if ($nivel_dificultad >= 3) {
                $hint_socratico = $this->hintGenerator->generarSugerenciaSocratica(
                    $trabajo->id,
                    $trabajo->estudiante_id,
                    $tema,
                    $trabajo->respuestas ?? [],
                    [],
                    $nivel_dificultad
                );

                if ($hint_socratico) {
                    $hints[] = [
                        'id' => $hint_socratico->id,
                        'tipo' => 'socratico',
                        'contenido' => $hint_socratico->contenido_sugerencia,
                        'preguntas_guia' => $hint_socratico->preguntas_guia ?? [],
                        'relevancia' => round($hint_socratico->relevancia_estimada, 2),
                    ];
                }
            }

            // Generar sugerencia de recurso
            $hint_recurso = $this->hintGenerator->generarSugerenciaRecurso(
                $trabajo->id,
                $trabajo->estudiante_id,
                $tema,
                $dificultad['tipo'] ? [$dificultad['tipo']] : []
            );

            if ($hint_recurso) {
                $hints[] = [
                    'id' => $hint_recurso->id,
                    'tipo' => 'recurso',
                    'contenido' => $hint_recurso->contenido_sugerencia,
                    'relevancia' => round($hint_recurso->relevancia_estimada, 2),
                ];
            }

        } catch (\Exception $e) {
            Log::warning("Error generando hints: {$e->getMessage()}");
        }

        return $hints;
    }

    /**
     * Predecir si habrá retraso en la entrega
     */
    private function predecirRetrasoEntrega(Trabajo $trabajo, Tarea $tarea): array
    {
        $fecha_limite = $tarea->contenido->fecha_limite;
        $dias_restantes = $fecha_limite ? $fecha_limite->diffInDays(now()) : null;
        $tiempo_estimado = $trabajo->tiempo_total ?? 0;

        return [
            'en_riesgo' => $dias_restantes !== null && $dias_restantes < 2,
            'dias_restantes' => $dias_restantes,
            'severidad' => $dias_restantes === null ? 'none' : ($dias_restantes < 1 ? 'critical' : 'warning'),
            'recomendacion' => $dias_restantes !== null && $dias_restantes < 2
                ? 'Completa la tarea lo antes posible para evitar la fecha límite.'
                : 'Vas bien de tiempo, pero no dejes para último momento.',
        ];
    }

    /**
     * Estimar tiempo restante para completar la tarea
     */
    private function estimarTiempoRestante(Trabajo $trabajo, Tarea $tarea): array
    {
        // Basado en progreso actual y tareas similares
        $tiempo_dedicado = $trabajo->tiempo_total ?? 0;
        $tiempo_estimado_total = 60 * 60; // 1 hora por defecto

        $progreso = min(100, ($trabajo->intentos ?? 0) * 25);
        $tiempo_restante = max(0, $tiempo_estimado_total - $tiempo_dedicado);

        return [
            'minutos_estimados' => ceil($tiempo_restante / 60),
            'horas_estimadas' => round($tiempo_restante / 3600, 1),
            'progreso_porcentaje' => $progreso,
        ];
    }

    /**
     * Generar recomendaciones personalizadas
     */
    private function generarRecomendaciones(Trabajo $trabajo, Tarea $tarea, User $estudiante): array
    {
        $recomendaciones = [];

        // 1. Si está retrasado
        if ($trabajo->tiempo_total === null || $trabajo->tiempo_total < 300) {
            $recomendaciones[] = [
                'tipo' => 'progreso',
                'mensaje' => 'Dedica más tiempo a esta tarea. Estudios demuestran que más tiempo = mejor aprendizaje.',
                'prioridad' => 'alta',
            ];
        }

        // 2. Si hay muchos intentos fallidos
        if (($trabajo->intentos ?? 0) > 5) {
            $recomendaciones[] = [
                'tipo' => 'ayuda',
                'mensaje' => 'Parece que tienes dificultades. Considera revisar los recursos del curso o consultar al profesor.',
                'prioridad' => 'alta',
            ];
        }

        // 3. Motivación
        $recomendaciones[] = [
            'tipo' => 'motivacion',
            'mensaje' => '¡Lo estás haciendo bien! Cada intento te acerca a la solución.',
            'prioridad' => 'baja',
        ];

        return $recomendaciones;
    }

    /**
     * Analizar tarea desde perspectiva del profesor
     */
    private function analizarTareaML(Tarea $tarea): array
    {
        $análisis = [
            'estudiantes_con_dificultad' => [],
            'estudiantes_en_riesgo' => [],
            'patrones_detectados' => [],
            'recomendaciones_profesor' => [],
        ];

        try {
            $trabajos = $tarea->trabajos()->with('estudiante')->get();

            foreach ($trabajos as $trabajo) {
                // Detectar estudiantes con dificultad
                $dificultad = $this->detectarDificultad($trabajo, $tarea);
                if ($dificultad && $dificultad['nivel'] > 0.6) {
                    $análisis['estudiantes_con_dificultad'][] = [
                        'estudiante_id' => $trabajo->estudiante_id,
                        'nombre' => $trabajo->estudiante->nombre_completo,
                        'dificultad_nivel' => $dificultad['nivel'],
                    ];
                }

                // Detectar estudiantes en riesgo de entrega tardía
                $riesgo = $this->predecirRetrasoEntrega($trabajo, $tarea);
                if ($riesgo['en_riesgo']) {
                    $análisis['estudiantes_en_riesgo'][] = [
                        'estudiante_id' => $trabajo->estudiante_id,
                        'nombre' => $trabajo->estudiante->nombre_completo,
                        'dias_restantes' => $riesgo['dias_restantes'],
                    ];
                }
            }

            // Recomendaciones para el profesor
            if (count($análisis['estudiantes_con_dificultad']) > 3) {
                $análisis['recomendaciones_profesor'][] = [
                    'tipo' => 'dificultad_general',
                    'mensaje' => 'Muchos estudiantes tienen dificultad con esta tarea. Considera revisar los recursos o proporcionar ejemplos adicionales.',
                ];
            }

            if (count($análisis['estudiantes_en_riesgo']) > 2) {
                $análisis['recomendaciones_profesor'][] = [
                    'tipo' => 'entrega_tardía',
                    'mensaje' => 'Varios estudiantes pueden entregar tarde. Considera enviar un recordatorio.',
                ];
            }

        } catch (\Exception $e) {
            Log::warning("Error analizando tarea ML: {$e->getMessage()}");
        }

        return $análisis;
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
                // Eliminar adjuntos del trabajo (se eliminarán automáticamente los archivos)
                foreach ($trabajo->adjuntos as $adjunto) {
                    $adjunto->delete();
                }

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

    /**
     * ====================================
     * ENDPOINTS API (NUEVO - HINTS & MONITOREO)
     * ====================================
     */

    /**
     * Obtener hints y análisis para una tarea
     *
     * GET /api/tareas/{tareaId}/hints
     */
    public function getHintsParaTarea($tareaId)
    {
        try {
            $tarea = Tarea::findOrFail($tareaId);
            $estudiante = auth()->user();

            if (!$estudiante->esEstudiante()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo estudiantes pueden acceder a hints',
                ], 403);
            }

            // Obtener el trabajo del estudiante
            $trabajo = $tarea->trabajos()
                ->where('estudiante_id', $estudiante->id)
                ->first();

            if (!$trabajo) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes un trabajo asociado a esta tarea',
                ], 404);
            }

            // Enriquecer vista
            $ml_insights = $this->enriquecerVistaTareaEstudiante($trabajo, $tarea, $estudiante);

            return response()->json([
                'success' => true,
                'progreso' => $ml_insights['progreso'],
                'dificultad_detectada' => $ml_insights['dificultad_detectada'],
                'hints' => $ml_insights['hints_disponibles'],
                'alerta' => $ml_insights['alerta'],
                'estimación_tiempo' => $ml_insights['estimación_tiempo'],
                'recomendaciones' => $ml_insights['recomendaciones'],
                'timestamp' => now(),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Tarea no encontrada',
            ], 404);

        } catch (\Exception $e) {
            Log::error("Error obteniendo hints: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo hints',
            ], 500);
        }
    }

    /**
     * Registrar actividad de estudiante en una tarea
     *
     * POST /api/tareas/{tareaId}/actividad
     */
    public function registrarActividad(Request $request, $tareaId)
    {
        try {
            $tarea = Tarea::findOrFail($tareaId);
            $estudiante = auth()->user();

            $validated = $request->validate([
                'evento' => 'required|string',
                'duracion_segundos' => 'nullable|integer',
                'intentos' => 'nullable|integer',
                'respuestas' => 'nullable|array',
            ]);

            // Obtener trabajo
            $trabajo = $tarea->trabajos()
                ->where('estudiante_id', $estudiante->id)
                ->firstOrFail();

            // Registrar actividad
            $actividad = $this->progressMonitor->registrarActividad(
                $trabajo->id,
                $estudiante->id,
                $tarea->contenido_id,
                $validated['evento'],
                [
                    'duracion_evento' => $validated['duracion_segundos'] ?? null,
                    'num_correcciones' => $validated['intentos'] ?? 0,
                    'respuestas' => $validated['respuestas'] ?? [],
                ]
            );

            return response()->json([
                'success' => true,
                'actividad_registrada' => [
                    'id' => $actividad->id,
                    'evento' => $actividad->evento,
                    'timestamp' => $actividad->timestamp,
                    'progreso_estimado' => $actividad->progreso_estimado,
                    'score_riesgo' => $actividad->score_riesgo,
                    'nivel_riesgo' => $actividad->nivel_riesgo,
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error("Error registrando actividad: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error registrando actividad',
            ], 500);
        }
    }

    /**
     * Obtener progreso detallado de un trabajo
     *
     * GET /api/trabajos/{trabajoId}/progreso
     */
    public function getProgresoTrabajo($trabajoId)
    {
        try {
            $trabajo = Trabajo::findOrFail($trabajoId);
            $estudiante = auth()->user();

            // Verificar permisos
            if ($trabajo->estudiante_id !== $estudiante->id && !$estudiante->esProfesor()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para ver este progreso',
                ], 403);
            }

            $tarea = $trabajo->contenido->tarea;
            $progreso = $this->obtenerProgresoTarea($trabajo);

            return response()->json([
                'success' => true,
                'trabajo_id' => $trabajo->id,
                'estado' => $trabajo->estado,
                'progreso' => $progreso,
                'dificultad_detectada' => $this->detectarDificultad($trabajo, $tarea),
                'tiempo_límite' => $tarea->contenido->fecha_limite,
                'tiempo_transcurrido_minutos' => ceil($trabajo->tiempo_total / 60),
                'timestamp' => now(),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Trabajo no encontrado',
            ], 404);

        } catch (\Exception $e) {
            Log::error("Error obteniendo progreso: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo progreso',
            ], 500);
        }
    }

    /**
     * Obtener análisis de tareas para profesor
     *
     * GET /api/tareas/{tareaId}/analisis-profesor
     */
    public function getAnalisisProfesor($tareaId)
    {
        try {
            $tarea = Tarea::findOrFail($tareaId);
            $profesor = auth()->user();

            // Verificar que sea el profesor creador
            if (!$profesor->esProfesor() || $tarea->contenido->creador_id !== $profesor->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para acceder a este análisis',
                ], 403);
            }

            $analisis = $this->analizarTareaML($tarea);

            return response()->json([
                'success' => true,
                'tarea_id' => $tarea->id,
                'estudiantes_con_dificultad' => $analisis['estudiantes_con_dificultad'],
                'estudiantes_en_riesgo' => $analisis['estudiantes_en_riesgo'],
                'recomendaciones' => $analisis['recomendaciones_profesor'],
                'total_estudiantes_analizados' => count(array_merge(
                    $analisis['estudiantes_con_dificultad'],
                    $analisis['estudiantes_en_riesgo']
                )),
                'timestamp' => now(),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Tarea no encontrada',
            ], 404);

        } catch (\Exception $e) {
            Log::error("Error obteniendo análisis de profesor: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo análisis',
            ], 500);
        }
    }

    /**
     * Obtener historial de hints para un trabajo
     *
     * GET /api/trabajos/{trabajoId}/hints-historial
     */
    public function getHistorialHints($trabajoId)
    {
        try {
            $trabajo = Trabajo::findOrFail($trabajoId);
            $estudiante = auth()->user();

            if ($trabajo->estudiante_id !== $estudiante->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para ver este historial',
                ], 403);
            }

            // Obtener hints generados para este trabajo
            $hints = \App\Models\StudentHint::where('trabajo_id', $trabajoId)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($hint) {
                    return [
                        'id' => $hint->id,
                        'tipo' => $hint->tipo_sugerencia,
                        'contenido' => $hint->contenido_sugerencia,
                        'preguntas_guia' => $hint->preguntas_guia,
                        'relevancia' => round($hint->relevancia_estimada, 2),
                        'utilizada' => $hint->estado === 'utilizada',
                        'efectiva' => $hint->fue_efectiva,
                        'fecha_generacion' => $hint->created_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'total_hints' => $hints->count(),
                'hints' => $hints,
                'timestamp' => now(),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Trabajo no encontrado',
            ], 404);

        } catch (\Exception $e) {
            Log::error("Error obteniendo historial de hints: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo historial',
            ], 500);
        }
    }
}
