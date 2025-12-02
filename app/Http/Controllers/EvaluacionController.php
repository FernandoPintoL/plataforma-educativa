<?php

namespace App\Http\Controllers;

use App\Models\Evaluacion;
use App\Models\Contenido;
use App\Models\Curso;
use App\Models\Pregunta;
use App\Models\Trabajo;
use App\Models\User;
use App\Http\Requests\StoreEvaluacionRequest;
use App\Http\Requests\UpdateEvaluacionRequest;
use App\Http\Requests\StoreRespuestaRequest;
use App\Services\ConceptTopicModelingService;
use App\Services\CorrelationAnalysisService;
use App\Services\AnomalyDetectionService;
use App\Services\EducationalRecommendationService;
use App\Services\AgentSynthesisService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EvaluacionController extends Controller
{
    protected ConceptTopicModelingService $conceptService;
    protected CorrelationAnalysisService $correlationService;
    protected AnomalyDetectionService $anomalyService;
    protected EducationalRecommendationService $recommendationService;
    protected AgentSynthesisService $agentService;

    public function __construct(
        ConceptTopicModelingService $conceptService,
        CorrelationAnalysisService $correlationService,
        AnomalyDetectionService $anomalyService,
        EducationalRecommendationService $recommendationService,
        AgentSynthesisService $agentService
    ) {
        $this->conceptService = $conceptService;
        $this->correlationService = $correlationService;
        $this->anomalyService = $anomalyService;
        $this->recommendationService = $recommendationService;
        $this->agentService = $agentService;
    }
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

        return Inertia::render('Evaluaciones/EvaluacionWizard', [
            'cursos' => $cursos,
        ]);
    }

    /**
     * Mostrar wizard para crear evaluaciones con IA
     *
     * Renderiza una página con un asistente paso a paso para crear evaluaciones,
     * incluyendo generación automática de preguntas con IA.
     *
     * @return \Inertia\Response
     */
    public function wizard()
    {
        $user = auth()->user();

        // Solo profesores pueden crear evaluaciones
        if (!$user->esProfesor()) {
            abort(403, 'No tienes permiso para crear evaluaciones.');
        }

        $cursos = $user->cursosComoProfesor()->get();

        return Inertia::render('Evaluaciones/EvaluacionWizard', [
            'cursos' => $cursos,
        ]);
    }

    /**
     * Store a newly created resource in storage (ML-ENHANCED)
     * Agrega análisis automático de preguntas con ML
     */
    public function store(StoreEvaluacionRequest $request)
    {
        try {
            // 📋 LOGS DE DEBUG
            Log::info('🔵 [EvaluacionController.store] Iniciando creación de evaluación');
            Log::info('📥 [EvaluacionController.store] Datos recibidos del request:', [
                'titulo' => $request->titulo,
                'tipo_evaluacion' => $request->tipo_evaluacion,
                'curso_id' => $request->curso_id,
                'estado' => $request->estado,
                'fecha_inicio' => $request->fecha_inicio,
                'fecha_fin' => $request->fecha_fin,
                'tiempo_limite' => $request->tiempo_limite,
                'preguntas_count' => is_array($request->preguntas) ? count($request->preguntas) : 0,
            ]);

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

            Log::info('✅ [EvaluacionController.store] Contenido creado', [
                'contenido_id' => $contenido->id,
                'estado_guardado' => $contenido->estado,
            ]);

            // Crear la evaluación
            $evaluacion = Evaluacion::create([
                'contenido_id' => $contenido->id,
                'tipo_evaluacion' => $request->tipo_evaluacion,
                'puntuacion_total' => $request->puntuacion_total,
                'tiempo_limite' => $request->tiempo_limite,
                'calificacion_automatica' => $request->calificacion_automatica ?? true,
                'mostrar_respuestas' => $request->mostrar_respuestas ?? true,
                'permite_reintento' => $request->permite_reintento ?? true,
                'max_reintentos' => $request->max_reintentos ?? 3,
            ]);

            // ANÁLISIS ML DE PREGUNTAS
            $analisis_ml = null;
            if ($request->has('preguntas') && is_array($request->preguntas)) {
                $analisis_ml = $this->analizarYCrearPreguntas($evaluacion, $request->preguntas);
            }

            // Si la evaluación se publica, notificar a estudiantes
            if ($request->estado === 'publicado') {
                Log::info('📢 [EvaluacionController.store] Evaluación PUBLICADA');
                // TODO: Implementar notificaciones sin romper las existentes
                // $curso = Curso::find($request->curso_id);
                // $estudiantes = $curso->estudiantes;
                // foreach ($estudiantes as $estudiante) { ... }
            } else {
                Log::info('📝 [EvaluacionController.store] Evaluación guardada como BORRADOR');
            }

            DB::commit();

            Log::info('✅ [EvaluacionController.store] Evaluación creada exitosamente', [
                'evaluacion_id' => $evaluacion->id,
                'estado_final' => $contenido->estado,
            ]);

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
     * Display the specified resource (ML-ENHANCED)
     * Enriquece con análisis de patrones, anomalías, correlaciones
     */
    public function show(Evaluacion $evaluacion)
    {
        $user = auth()->user();

        // Cargar relaciones
        $evaluacion->load([
            'contenido.curso',
            'contenido.creador',
            'preguntas' => function ($query) {
                $query->orderBy('orden');
            },
        ]);

        // Verificar que la evaluación tiene contenido asociado
        if (!$evaluacion->contenido) {
            abort(404, 'La evaluación no tiene contenido asociado.');
        }

        // Verificar permisos
        if ($user->esEstudiante()) {
            // Estudiante solo puede ver evaluaciones de sus cursos
            $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
            if (!$cursosIds->contains($evaluacion->contenido->curso_id)) {
                abort(403, 'No tienes acceso a esta evaluación.');
            }

            // Obtener el trabajo del estudiante si existe
            $trabajo = $evaluacion->contenido->trabajos()
                ->where('estudiante_id', $user->id)
                ->with('calificacion')
                ->latest()
                ->first();

            // ENRIQUECIMIENTO ML para estudiante
            $ml_insights = [];
            if ($trabajo && $trabajo->calificacion) {
                try {
                    $ml_insights = $this->enriquecerResultadosEstudiante($trabajo, $evaluacion, $user);
                } catch (\Exception $e) {
                    Log::warning("Error enriqueciendo resultados: {$e->getMessage()}");
                }
            }

            return Inertia::render('Evaluaciones/Show', [
                'evaluacion' => $evaluacion,
                'trabajo' => $trabajo,
                'estadisticas' => null,
                'ml_insights' => $ml_insights,
            ]);
        } elseif ($user->esProfesor()) {
            // Profesor solo puede ver sus propias evaluaciones
            if ($evaluacion->contenido->creador_id !== $user->id) {
                abort(403, 'No tienes acceso a esta evaluación.');
            }

            // ENRIQUECIMIENTO ML para profesor
            $ml_analysis = [];
            try {
                $ml_analysis = $this->analizarEvaluacionML($evaluacion);
            } catch (\Exception $e) {
                Log::warning("Error analizando evaluación: {$e->getMessage()}");
            }

            // Obtener estadísticas de la evaluación
            $estadisticas = $evaluacion->obtenerEstadisticas();

            return Inertia::render('Evaluaciones/Show', [
                'evaluacion' => $evaluacion,
                'trabajo' => null,
                'estadisticas' => $estadisticas,
                'ml_analysis' => $ml_analysis,
            ]);
        }

        abort(403, 'No tienes permiso para ver esta evaluación.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Evaluacion $evaluacion)
    {
        $user = auth()->user();

        // Verificar que sea el profesor creador
        if (!$user->esProfesor() || $evaluacion->contenido->creador_id !== $user->id) {
            abort(403, 'No tienes permiso para editar esta evaluación.');
        }

        $evaluacion->load(['contenido.curso', 'preguntas' => function ($query) {
            $query->orderBy('orden');
        }]);

        $cursos = $user->cursosComoProfesor()->get();

        return Inertia::render('Evaluaciones/Edit', [
            'evaluacion' => $evaluacion,
            'cursos' => $cursos,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEvaluacionRequest $request, Evaluacion $evaluacion)
    {
        try {
            Log::info('🔵 [EvaluacionController.update] Iniciando actualización', [
                'evaluacion_id' => $evaluacion->id,
                'titulo' => $evaluacion->contenido?->titulo,
                'estado_actual' => $evaluacion->contenido?->estado,
            ]);

            Log::info('📥 [EvaluacionController.update] Datos recibidos:', [
                'titulo' => $request->titulo,
                'estado' => $request->estado,
                'fecha_limite' => $request->fecha_limite,
            ]);

            DB::beginTransaction();

            // Actualizar contenido
            $evaluacion->contenido->update([
                'titulo' => $request->titulo ?? $evaluacion->contenido->titulo,
                'descripcion' => $request->descripcion ?? $evaluacion->contenido->descripcion,
                'fecha_limite' => $request->fecha_limite ?? $evaluacion->contenido->fecha_limite,
                'estado' => $request->estado ?? $evaluacion->contenido->estado,
            ]);

            Log::info('✅ [EvaluacionController.update] Contenido actualizado', [
                'estado_nuevo' => $evaluacion->contenido->estado,
            ]);

            // Actualizar evaluación
            $evaluacion->update([
                'tipo_evaluacion' => $request->tipo_evaluacion ?? $evaluacion->tipo_evaluacion,
                'puntuacion_total' => $request->puntuacion_total ?? $evaluacion->puntuacion_total,
                'tiempo_limite' => $request->tiempo_limite ?? $evaluacion->tiempo_limite,
                'calificacion_automatica' => $request->calificacion_automatica ?? $evaluacion->calificacion_automatica,
                'mostrar_respuestas' => $request->mostrar_respuestas ?? $evaluacion->mostrar_respuestas,
                'permite_reintento' => $request->permite_reintento ?? $evaluacion->permite_reintento,
                'max_reintentos' => $request->max_reintentos ?? $evaluacion->max_reintentos,
            ]);

            // Si se está publicando por primera vez, notificar a estudiantes
            if ($request->estado === 'publicado' && $evaluacion->contenido->estado !== 'publicado') {
                $curso = Curso::find($evaluacion->contenido->curso_id);
                $estudiantes = $curso->estudiantes;

                foreach ($estudiantes as $estudiante) {
                    \App\Models\Notificacion::crear(
                        destinatario: $estudiante,
                        tipo: 'evaluacion',
                        titulo: 'Nueva evaluación disponible',
                        contenido: "Se ha publicado una nueva evaluación: {$evaluacion->contenido->titulo}",
                        datos_adicionales: [
                            'evaluacion_id' => $evaluacion->id,
                            'curso_id' => $evaluacion->contenido->curso_id,
                        ]
                    );
                }
            }

            DB::commit();

            Log::info('✅ [EvaluacionController.update] Evaluación actualizada exitosamente', [
                'evaluacion_id' => $evaluacion->id,
                'estado_final' => $evaluacion->contenido->estado,
            ]);

            return redirect()
                ->route('evaluaciones.show', $evaluacion->id)
                ->with('success', 'Evaluación actualizada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('❌ [EvaluacionController.update] Error en actualización', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return back()
                ->withErrors(['error' => 'Error al actualizar la evaluación: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Evaluacion $evaluacion)
    {
        $user = auth()->user();

        // Verificar que sea el profesor creador
        if (!$user->esProfesor() || $evaluacion->contenido->creador_id !== $user->id) {
            abort(403, 'No tienes permiso para eliminar esta evaluación.');
        }

        try {
            DB::beginTransaction();

            // Eliminar preguntas
            $evaluacion->preguntas()->delete();

            // Eliminar trabajos asociados
            foreach ($evaluacion->contenido->trabajos as $trabajo) {
                $trabajo->calificaciones()->delete();
                $trabajo->delete();
            }

            // Eliminar evaluación y contenido
            $contenidoId = $evaluacion->contenido_id;
            $evaluacion->delete();
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
    public function take(Evaluacion $evaluacion)
    {
        $user = auth()->user();

        // Solo estudiantes pueden tomar evaluaciones
        if (!$user->esEstudiante()) {
            abort(403, 'Solo los estudiantes pueden tomar evaluaciones.');
        }

        // Verificar que el estudiante esté inscrito en el curso
        $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
        if (!$cursosIds->contains($evaluacion->contenido->curso_id)) {
            abort(403, 'No tienes acceso a esta evaluación.');
        }

        // Verificar que la evaluación esté publicada
        if ($evaluacion->contenido->estado !== 'publicado') {
            return back()->withErrors(['error' => 'Esta evaluación no está disponible.']);
        }

        // Verificar si ya tiene un trabajo en progreso o terminado
        $trabajoExistente = $evaluacion->contenido->trabajos()
            ->where('estudiante_id', $user->id)
            ->latest()
            ->first();

        // Verificar reintentos
        if ($trabajoExistente && $trabajoExistente->estaCalificado()) {
            if (!$evaluacion->puedeReintentar($user)) {
                return back()->withErrors([
                    'error' => 'Has agotado el número máximo de intentos para esta evaluación.'
                ]);
            }
        }

        // Cargar preguntas (sin respuestas correctas para el estudiante)
        $evaluacion->load([
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
            'evaluacion' => $evaluacion,
            'trabajo_existente' => $trabajoExistente,
        ]);
    }

    /**
     * Guardar respuestas de la evaluación
     */
    public function submitRespuestas(StoreRespuestaRequest $request, Evaluacion $evaluacion)
    {
        $user = $request->user();

        try {
            DB::beginTransaction();

            // DEBUG: Registrar qué se está recibiendo
            \Log::info('submitRespuestas recibió', [
                'respuestas_raw' => $request->respuestas,
                'respuestas_type' => gettype($request->respuestas),
                'evaluacion_id' => $evaluacion->id,
            ]);

            // Procesar respuestas para enriquecerlas con información de corrección
            $respuestasEnriquecidas = $this->enriquecerRespuestas($request->respuestas, $evaluacion);

            // DEBUG: Registrar qué se enriqueció
            \Log::info('submitRespuestas enriqueció', [
                'respuestas_enriquecidas' => $respuestasEnriquecidas,
                'count' => count($respuestasEnriquecidas),
            ]);

            // Crear el trabajo del estudiante
            $trabajo = Trabajo::create([
                'contenido_id' => $evaluacion->contenido_id,
                'estudiante_id' => $user->id,
                'estado' => 'entregado',
                'fecha_inicio' => now()->subMinutes($request->tiempo_usado ?? 0),
                'fecha_entrega' => now(),
                'respuestas' => $respuestasEnriquecidas,
            ]);

            // Si tiene calificación automática, calificar inmediatamente
            if ($evaluacion->calificacion_automatica) {
                $evaluacion->calificarAutomaticamente($trabajo);
            }

            // Notificar al profesor usando los campos reales de la tabla
            \App\Models\Notificacion::create([
                'titulo' => 'Evaluación completada',
                'contenido' => "{$user->name} ha completado la evaluación: {$evaluacion->contenido->titulo}",
                'fecha' => now(),
                'destinatario_id' => $evaluacion->contenido->creador->id,
                'tipo' => 'evaluacion',
                'datos_adicionales' => [
                    'evaluacion_id' => $evaluacion->id,
                    'trabajo_id' => $trabajo->id,
                    'estudiante_id' => $user->id,
                ],
            ]);

            DB::commit();

            // PASO ASINCRÓNICO: Generar recomendaciones personalizadas mediante el agente
            // Se ejecuta DESPUÉS de guardar la evaluación para no bloquear la respuesta
            try {
                dispatch(function () use ($trabajo, $evaluacion) {
                    $analysisService = new \App\Services\EvaluationAnalysisService();
                    $recommendations = $analysisService->analyzeAndRecommend($trabajo, $evaluacion);

                    // Notificar al estudiante sobre las recomendaciones disponibles
                    if (!empty($recommendations)) {
                        \App\Models\Notificacion::create([
                            'titulo' => 'Recomendaciones de mejora disponibles',
                            'contenido' => "El agente ha analizado tu evaluación y generado recomendaciones personalizadas para mejorar en {$evaluacion->contenido->titulo}",
                            'fecha' => now(),
                            'destinatario_id' => $trabajo->estudiante_id,
                            'tipo' => 'recomendacion',
                            'datos_adicionales' => [
                                'evaluacion_id' => $evaluacion->id,
                                'trabajo_id' => $trabajo->id,
                                'recommendation_type' => 'evaluacion_feedback',
                            ],
                        ]);
                    }
                });
            } catch (\Exception $e) {
                // Log del error pero no bloquea la respuesta al estudiante
                \Log::warning('Error generando recomendaciones asincrónicas', [
                    'trabajo_id' => $trabajo->id,
                    'error' => $e->getMessage(),
                ]);
            }

            return redirect()
                ->route('evaluaciones.results', $evaluacion->id)
                ->with('success', 'Evaluación enviada exitosamente. El agente está generando recomendaciones personalizadas para ti.');

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
    public function results(Evaluacion $evaluacion)
    {
        $user = auth()->user();

        // Solo estudiantes pueden ver sus resultados
        if (!$user->esEstudiante()) {
            abort(403);
        }

        // Cargar relaciones necesarias
        $evaluacion->load([
            'contenido.curso',
            'preguntas' => function ($query) use ($evaluacion) {
                $query->orderBy('orden');
                // Solo mostrar respuestas correctas si está configurado
                if (!$evaluacion->mostrar_respuestas) {
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
        if (!$evaluacion->contenido) {
            abort(404, 'La evaluación no tiene contenido asociado.');
        }

        // Verificar que el estudiante está inscrito en el curso
        $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
        if (!$cursosIds->contains($evaluacion->contenido->curso_id)) {
            abort(403, 'No tienes acceso a esta evaluación.');
        }

        // Obtener el último trabajo del estudiante
        $trabajo = $evaluacion->contenido->trabajos()
            ->where('estudiante_id', $user->id)
            ->with('calificacion')
            ->latest()
            ->first();

        if (!$trabajo) {
            abort(404, 'No has completado esta evaluación aún.');
        }

        // Asegurar que respuestas es un array - manejar todos los tipos de datos posibles
        $respuestasArray = [];
        if (!empty($trabajo->respuestas)) {
            if (is_array($trabajo->respuestas)) {
                // Si ya es un array, usarlo directamente
                $respuestasArray = $trabajo->respuestas;
            } elseif (is_object($trabajo->respuestas)) {
                // Si es un objeto (stdClass), convertir a array
                $respuestasArray = json_decode(json_encode($trabajo->respuestas), true) ?? [];
            } elseif (is_string($trabajo->respuestas)) {
                // Si es una cadena JSON, decodificar
                $respuestasArray = json_decode($trabajo->respuestas, true) ?? [];
            }
        }

        // Convertir formato antiguo al nuevo formato enriquecido si es necesario
        $respuestasArray = $this->convertirFormatoAntiguoRespuestas($respuestasArray, $evaluacion);

        // Obtener el puntaje de la calificación
        // Prioridad: 1. De la BD (si existe), 2. Calcular desde respuestas enriquecidas
        $calificacionValue = 0;

        if ($trabajo->calificacion && isset($trabajo->calificacion->puntaje)) {
            $calificacionValue = (float) $trabajo->calificacion->puntaje;
        } else {
            // Calcular desde respuestas enriquecidas
            \Log::info('Calculando calificación desde respuestas', [
                'respuestas_array' => $respuestasArray,
                'trabajo_id' => $trabajo->id,
            ]);

            $calificacionValue = array_sum(array_map(function($r) {
                return $r['puntos_obtenidos'] ?? 0;
            }, $respuestasArray));

            \Log::info('Calificación calculada', [
                'calificacion' => $calificacionValue,
                'trabajo_id' => $trabajo->id,
            ]);
        }

        // Contar intentos del estudiante
        $totalIntentos = $evaluacion->contenido->trabajos()
            ->where('estudiante_id', $user->id)
            ->count();

        // Determinar si puede intentar de nuevo
        $puedeReintentar = false;
        if ($evaluacion->permite_reintento && $evaluacion->max_reintentos > 0) {
            $puedeReintentar = $totalIntentos < $evaluacion->max_reintentos;
        }

        // NUEVA LÓGICA: Generar recomendaciones SIEMPRE (invertir lógica anterior)
        // - Si puede reintentar: recomendaciones para mejorar la nota
        // - Si no puede: recomendaciones para próxima evaluación
        $recommendations = null;
        $tipoRecomendacion = null; // 'avanzado' o 'refuerzo'
        $mensajeRecomendacion = null;

        $porcentajeCalificacion = ($calificacionValue / $evaluacion->puntuacion_total) * 100;

        // Determinar tipo y mensaje según desempeño Y capacidad de reintento
        if ($porcentajeCalificacion >= 90) {
            $tipoRecomendacion = 'avanzado';
            $mensajeRecomendacion = $puedeReintentar
                ? 'Excelente desempeño! Recursos avanzados para profundizar:'
                : 'Excelente desempeño! Explora estos recursos para tu próxima evaluación:';
        } else {
            $tipoRecomendacion = 'refuerzo';
            $mensajeRecomendacion = $puedeReintentar
                ? 'Recursos para mejorar antes de tu próximo intento:'
                : 'Revisa estos recursos para reforzar conceptos:';
        }

        try {
            // Generar análisis y recomendaciones
            $analysisService = new \App\Services\EvaluationAnalysisService();
            $analysisData = $analysisService->analyzeAndRecommend($trabajo, $evaluacion);

            // Si se generaron recomendaciones, incluirlas con mensaje
            if (!empty($analysisData)) {
                $recommendations = $analysisData;
                $recommendations['mensaje'] = $mensajeRecomendacion;
            }
        } catch (\Exception $e) {
            // Si falla el análisis, continuar sin recomendaciones
            \Log::warning('Error obteniendo recomendaciones en results()', [
                'trabajo_id' => $trabajo->id,
                'error' => $e->getMessage(),
            ]);
        }

        $trabajoData = [
            'id' => $trabajo->id,
            'calificacion' => $calificacionValue,
            'tiempo_usado' => $trabajo->tiempo_usado,
            'estado' => $trabajo->estado,
            'fecha_entrega' => $trabajo->fecha_entrega,
            'respuestas' => $respuestasArray,
        ];

        return Inertia::render('Evaluaciones/Results', [
            'evaluacion' => $evaluacion,
            'trabajo' => $trabajoData,
            'mostrar_respuestas' => $evaluacion->mostrar_respuestas,
            'recommendations' => $recommendations,
            'tipo_recomendacion' => $tipoRecomendacion, // 'avanzado' o 'refuerzo'
            'intento_actual' => $totalIntentos,
            'max_intentos' => $evaluacion->max_reintentos,
            'puede_reintentar' => $puedeReintentar,
        ]);
    }

    /**
     * ====================================
     * MÉTODOS PRIVADOS DE ANÁLISIS ML
     * ====================================
     */

    /**
     * Analizar y crear preguntas con análisis ML
     */
    private function analizarYCrearPreguntas(Evaluacion $evaluacion, array $preguntas): array
    {
        $analisis_completo = [
            'preguntas_analizadas' => [],
            'dificultad_promedio' => 0,
            'balance_evaluado' => true,
            'recomendaciones' => [],
        ];

        try {
            foreach ($preguntas as $index => $preguntaData) {
                // Crear pregunta
                $pregunta = Pregunta::create([
                    'evaluacion_id' => $evaluacion->id,
                    'enunciado' => $preguntaData['enunciado'],
                    'tipo' => $preguntaData['tipo'],
                    'opciones' => $preguntaData['opciones'] ?? null,
                    'respuesta_correcta' => $preguntaData['respuesta_correcta'],
                    'tema' => $preguntaData['tema'] ?? null,
                    'puntos' => $preguntaData['puntos'],
                    'orden' => $index + 1,
                ]);

                // Analizar dificultad de la pregunta
                $dificultad = $this->analizarDificultadPregunta($pregunta);

                $analisis_completo['preguntas_analizadas'][] = [
                    'pregunta_id' => $pregunta->id,
                    'dificultad' => $dificultad,
                    'conceptos' => $this->extraerConceptosPreguntas($pregunta),
                ];
            }

            // Calcular dificultad promedio
            if (!empty($analisis_completo['preguntas_analizadas'])) {
                $dificultades = array_column($analisis_completo['preguntas_analizadas'], 'dificultad');
                $analisis_completo['dificultad_promedio'] = array_sum($dificultades) / count($dificultades);
            }

            // Validar balance de dificultad
            $analisis_completo['balance_evaluado'] = $this->validarBalanceDificultad($analisis_completo['preguntas_analizadas']);

            // Generar recomendaciones
            if ($analisis_completo['dificultad_promedio'] > 0.8) {
                $analisis_completo['recomendaciones'][] = 'La evaluación es muy difícil. Considera agregar preguntas más fáciles.';
            }
            if ($analisis_completo['dificultad_promedio'] < 0.3) {
                $analisis_completo['recomendaciones'][] = 'La evaluación es muy fácil. Considera agregar preguntas más difíciles.';
            }

        } catch (\Exception $e) {
            Log::warning("Error analizando preguntas: {$e->getMessage()}");
        }

        return $analisis_completo;
    }

    /**
     * Analizar dificultad de una pregunta
     */
    private function analizarDificultadPregunta(Pregunta $pregunta): float
    {
        $dificultad = 0.5; // Default

        // Estimar basado en tipo de pregunta
        $mapeo_dificultad = [
            'verdadero_falso' => 0.3,
            'opcion_multiple' => 0.5,
            'respuesta_corta' => 0.6,
            'desarrollo' => 0.8,
        ];

        if (isset($mapeo_dificultad[$pregunta->tipo])) {
            $dificultad = $mapeo_dificultad[$pregunta->tipo];
        }

        // Ajustar según puntos (más puntos = más difícil)
        if ($pregunta->puntos && $pregunta->puntos > 3) {
            $dificultad += 0.2;
        }

        return min(1.0, $dificultad);
    }

    /**
     * Extraer conceptos de una pregunta
     *
     * Prioridad 1: Usar campo tema si existe (más preciso)
     * Prioridad 2: Heurística mejorada con keywords si no hay tema
     */
    private function extraerConceptosPreguntas(Pregunta $pregunta): array
    {
        // Prioridad 1: Si el campo tema está definido, usarlo directamente
        if (!empty($pregunta->tema)) {
            return [$pregunta->tema];
        }

        // Prioridad 2: Fallback a heurística mejorada con más keywords
        $conceptos = [];
        $enunciado = strtolower($pregunta->enunciado);

        $palabras_clave = [
            'Lógica' => ['if', 'condition', 'booleano', 'condicional', 'else'],
            'Bucles' => ['for', 'while', 'repetir', 'iteración', 'do', 'foreach'],
            'Funciones' => ['función', 'function', 'method', 'parámetro', 'return', 'llamada'],
            'Estructuras de Datos' => ['array', 'lista', 'estructura', 'variable', 'arreglo'],
            'Matemáticas' => ['suma', 'resta', 'multiplicación', 'división', 'ecuación', 'número'],
            'Strings' => ['cadena', 'string', 'texto', 'caracteres', 'concatenar', 'substring'],
            'Objetos' => ['clase', 'objeto', 'instancia', 'propiedad', 'atributo', 'method'],
            'Bases de Datos' => ['sql', 'consulta', 'tabla', 'relación', 'clave', 'foránea'],
            'Web' => ['html', 'css', 'javascript', 'dom', 'evento', 'formulario'],
            'Entrada/Salida' => ['input', 'output', 'lectura', 'escritura', 'archivo'],
        ];

        foreach ($palabras_clave as $concepto => $palabras) {
            foreach ($palabras as $palabra) {
                if (strpos($enunciado, $palabra) !== false) {
                    $conceptos[] = $concepto;
                    break;
                }
            }
        }

        return $conceptos ?: ['General'];
    }

    /**
     * Validar balance de dificultad
     */
    private function validarBalanceDificultad(array $preguntas): bool
    {
        if (empty($preguntas)) {
            return false;
        }

        $dificultades = array_column($preguntas, 'dificultad');
        $promedio = array_sum($dificultades) / count($dificultades);
        $varianza = 0;

        foreach ($dificultades as $d) {
            $varianza += pow($d - $promedio, 2);
        }
        $varianza /= count($dificultades);

        // Balance aceptable si hay variación de dificultades
        return $varianza > 0.05;
    }

    /**
     * Enriquecer resultados para estudiante
     */
    private function enriquecerResultadosEstudiante($trabajo, Evaluacion $evaluacion, User $estudiante): array
    {
        $insights = [
            'puntuacion' => $trabajo->calificacion->puntaje ?? 0,
            'porcentaje' => round(($trabajo->calificacion->puntaje ?? 0) / $evaluacion->puntuacion_total * 100, 2),
            'recomendaciones' => [],
            'areas_mejora' => [],
            'correlaciones' => [],
        ];

        try {
            // Detectar patrones de respuesta problemáticos
            $patrones = $this->detectarPatronesProblematicos($trabajo);
            $insights['areas_mejora'] = $patrones;

            // Correlacionar con otras evaluaciones
            $correlaciones = $this->correlationService->analyzeAcademicCorrelations();
            if ($correlaciones['success']) {
                $insights['correlaciones'] = array_slice($correlaciones['correlations'] ?? [], 0, 3);
            }

            // Recomendaciones personalizadas
            if ($insights['porcentaje'] < 60) {
                $insights['recomendaciones'][] = [
                    'tipo' => 'mejora',
                    'mensaje' => 'Necesitas mejorar tu desempeño. Revisa los conceptos clave y practica más.',
                ];
            } elseif ($insights['porcentaje'] >= 80) {
                $insights['recomendaciones'][] = [
                    'tipo' => 'felicitacion',
                    'mensaje' => '¡Excelente desempeño! Sigue así.',
                ];
            }

        } catch (\Exception $e) {
            Log::warning("Error enriqueciendo resultados: {$e->getMessage()}");
        }

        return $insights;
    }

    /**
     * Detectar patrones problemáticos en respuestas
     */
    private function detectarPatronesProblematicos($trabajo): array
    {
        $patrones = [];

        // Analizar respuestas del trabajo
        if ($trabajo->respuestas && is_array($trabajo->respuestas)) {
            $num_respuestas = count($trabajo->respuestas);
            $num_incorrectas = count(array_filter($trabajo->respuestas, fn($r) => !$r));

            if ($num_incorrectas / $num_respuestas > 0.5) {
                $patrones[] = [
                    'area' => 'Comprensión general',
                    'descripción' => 'Más del 50% de respuestas incorrectas',
                    'prioridad' => 'alta',
                ];
            }
        }

        return $patrones;
    }

    /**
     * Analizar evaluación desde perspectiva del profesor
     */
    private function analizarEvaluacionML(Evaluacion $evaluacion): array
    {
        $análisis = [
            'resumen' => [],
            'estudiantes_dificultad' => [],
            'patrones_detectados' => [],
            'recomendaciones' => [],
        ];

        try {
            $trabajos = $evaluacion->contenido->trabajos()->with(['estudiante', 'calificacion'])->get();

            if ($trabajos->isEmpty()) {
                return $análisis;
            }

            $calificaciones = $trabajos->pluck('calificacion.puntaje')->filter();
            $análisis['resumen'] = [
                'total_estudiantes' => $trabajos->count(),
                'promedio' => round($calificaciones->avg(), 2),
                'máximo' => $calificaciones->max(),
                'mínimo' => $calificaciones->min(),
            ];

            // Detectar estudiantes con bajo desempeño
            $promedio_evaluacion = $calificaciones->avg();
            foreach ($trabajos as $trabajo) {
                if ($trabajo->calificacion && $trabajo->calificacion->puntaje < $promedio_evaluacion * 0.7) {
                    $análisis['estudiantes_dificultad'][] = [
                        'estudiante_id' => $trabajo->estudiante_id,
                        'nombre' => $trabajo->estudiante->nombre_completo,
                        'puntuacion' => $trabajo->calificacion->puntaje,
                    ];
                }
            }

            // Recomendaciones
            if (count($análisis['estudiantes_dificultad']) > 3) {
                $análisis['recomendaciones'][] = [
                    'tipo' => 'contenido',
                    'mensaje' => 'Muchos estudiantes tuvieron bajo desempeño. Considera revisar la calidad del contenido o la evaluación.',
                ];
            }

        } catch (\Exception $e) {
            Log::warning("Error analizando evaluación ML: {$e->getMessage()}");
        }

        return $análisis;
    }

    /**
     * ====================================
     * ENDPOINTS API (NUEVO - EVALUACIONES ML)
     * ====================================
     */

    /**
     * Obtener análisis detallado de una evaluación
     *
     * GET /api/evaluaciones/{evaluacionId}/analisis
     */
    public function getAnalisisDetallado($evaluacionId)
    {
        try {
            $evaluacion = Evaluacion::findOrFail($evaluacionId);
            $profesor = auth()->user();

            if (!$profesor->esProfesor() || $evaluacion->contenido->creador_id !== $profesor->id) {
                return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
            }

            $análisis = $this->analizarEvaluacionML($evaluacion);

            return response()->json([
                'success' => true,
                'evaluacion_id' => $evaluacionId,
                'análisis' => $análisis,
                'timestamp' => now(),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error obteniendo análisis: {$e->getMessage()}");
            return response()->json(['success' => false, 'message' => 'Error'], 500);
        }
    }

    /**
     * Obtener correlaciones académicas
     *
     * GET /api/evaluaciones/correlaciones
     */
    public function getCorrelaciones()
    {
        try {
            $correlaciones = $this->correlationService->analyzeAcademicCorrelations();

            return response()->json([
                'success' => $correlaciones['success'],
                'total_correlations' => $correlaciones['total_correlations'] ?? 0,
                'significant' => $correlaciones['significant_correlations'] ?? 0,
                'data' => $correlaciones['correlations'] ?? [],
                'timestamp' => now(),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error obteniendo correlaciones: {$e->getMessage()}");
            return response()->json(['success' => false, 'message' => 'Error'], 500);
        }
    }

    /**
     * Obtener recomendaciones personalizadas para un estudiante
     *
     * GET /api/evaluaciones/{evaluacionId}/recomendaciones
     */
    public function getRecomendacionesEstudiante($evaluacionId)
    {
        try {
            $evaluacion = Evaluacion::findOrFail($evaluacionId);
            $estudiante = auth()->user();

            $trabajo = $evaluacion->contenido->trabajos()
                ->where('estudiante_id', $estudiante->id)
                ->with('calificacion')
                ->firstOrFail();

            $insights = $this->enriquecerResultadosEstudiante($trabajo, $evaluacion, $estudiante);

            return response()->json([
                'success' => true,
                'puntuacion' => $insights['puntuacion'],
                'porcentaje' => $insights['porcentaje'],
                'areas_mejora' => $insights['areas_mejora'],
                'recomendaciones' => $insights['recomendaciones'],
                'timestamp' => now(),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error obteniendo recomendaciones: {$e->getMessage()}");
            return response()->json(['success' => false, 'message' => 'Error'], 500);
        }
    }

    /**
     * Ver un intento específico de evaluación
     */
    public function verIntento(Evaluacion $evaluacion, Trabajo $trabajo)
    {
        $user = auth()->user();

        // Solo estudiantes pueden ver sus propios intentos
        if (!$user->esEstudiante()) {
            abort(403);
        }

        // Verificar que el trabajo pertenece al estudiante autenticado
        if ($trabajo->estudiante_id != $user->id) {
            abort(403, 'No puedes ver este intento.');
        }

        // Cargar relaciones necesarias
        $evaluacion->load([
            'contenido.curso',
            'preguntas' => function ($query) use ($evaluacion) {
                $query->orderBy('orden');
                if (!$evaluacion->mostrar_respuestas) {
                    $query->select(['id', 'evaluacion_id', 'enunciado', 'tipo', 'opciones', 'puntos', 'orden']);
                }
            },
        ]);

        $trabajo->load('calificacion');

        // Verificar que el trabajo pertenece a esta evaluación
        if ($trabajo->contenido_id != $evaluacion->contenido_id) {
            abort(404, 'Este intento no pertenece a esta evaluación.');
        }

        // Verificar que el estudiante está inscrito en el curso
        $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
        if (!$cursosIds->contains($evaluacion->contenido->curso_id)) {
            abort(403, 'No tienes acceso a esta evaluación.');
        }

        // Asegurar que respuestas es un array - manejar todos los tipos de datos posibles
        $respuestasArray = [];
        if (!empty($trabajo->respuestas)) {
            if (is_array($trabajo->respuestas)) {
                // Si ya es un array, usarlo directamente
                $respuestasArray = $trabajo->respuestas;
            } elseif (is_object($trabajo->respuestas)) {
                // Si es un objeto (stdClass), convertir a array
                $respuestasArray = json_decode(json_encode($trabajo->respuestas), true) ?? [];
            } elseif (is_string($trabajo->respuestas)) {
                // Si es una cadena JSON, decodificar
                $respuestasArray = json_decode($trabajo->respuestas, true) ?? [];
            }
        }

        // Convertir formato antiguo al nuevo formato enriquecido si es necesario
        $respuestasArray = $this->convertirFormatoAntiguoRespuestas($respuestasArray, $evaluacion);

        // Extraer solo el puntaje de la calificación
        $calificacionPuntaje = 0;
        if ($trabajo->calificacion && isset($trabajo->calificacion->puntaje)) {
            $calificacionPuntaje = (float) $trabajo->calificacion->puntaje;
        }

        // Contar intentos del estudiante y determinar cuál es este intento
        $todosLosIntentos = $evaluacion->contenido->trabajos()
            ->where('estudiante_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        $numeroIntento = $todosLosIntentos->search(function ($t) use ($trabajo) {
            return $t->id === $trabajo->id;
        }) + 1;

        $totalIntentos = $todosLosIntentos->count();

        $trabajoData = [
            'id' => $trabajo->id,
            'calificacion' => $calificacionPuntaje,
            'tiempo_usado' => $trabajo->tiempo_usado,
            'estado' => $trabajo->estado,
            'fecha_entrega' => $trabajo->fecha_entrega,
            'respuestas' => $respuestasArray,
        ];

        return Inertia::render('Evaluaciones/VerIntento', [
            'evaluacion' => $evaluacion,
            'trabajo' => $trabajoData,
            'mostrar_respuestas' => $evaluacion->mostrar_respuestas,
            'numero_intento' => $numeroIntento,
            'total_intentos' => $totalIntentos,
            'max_intentos' => $evaluacion->max_reintentos,
        ]);
    }

    /**
     * Enriquecer respuestas con información de corrección
     *
     * @param array $respuestas Array de respuestas del estudiante
     * @param Evaluacion $evaluacion Evaluación asociada
     * @return array Respuestas enriquecidas con es_correcta y puntos_obtenidos
     */
    private function enriquecerRespuestas(array $respuestas, Evaluacion $evaluacion): array
    {
        // Cargar preguntas de la evaluación
        $preguntas = $evaluacion->preguntas()->get();

        $respuestasEnriquecidas = [];

        foreach ($respuestas as $key => $value) {
            // Manejo flexible de formatos:
            // 1. Si es un string: {16: '120'} → pregunta_id=16, respuesta='120'
            // 2. Si es un objeto: {pregunta_id: 16, respuesta: '120'}

            $preguntaId = null;
            $respuestaTexto = null;

            if (is_string($value)) {
                // Formato 1: La key es pregunta_id, el valor es la respuesta
                if (is_numeric($key)) {
                    $preguntaId = (int)$key;
                    $respuestaTexto = $value;
                }
            } else {
                // Formato 2: Es un objeto/array con pregunta_id y respuesta
                $respuestaData = is_array($value) ? $value : (array) $value;
                $preguntaId = $respuestaData['pregunta_id'] ?? (is_numeric($key) ? (int)$key : null);
                $respuestaTexto = $respuestaData['respuesta'] ?? null;
            }

            if (!$preguntaId) {
                continue;
            }

            // Encontrar la pregunta
            $pregunta = $preguntas->firstWhere('id', $preguntaId);

            if (!$pregunta) {
                continue;
            }

            // Verificar si la respuesta es correcta
            $esCorrecta = false;
            $puntosObtenidos = 0;

            if ($respuestaTexto) {
                $respuestaEstudiante = trim($respuestaTexto);
                $respuestaCorrecta = trim($pregunta->respuesta_correcta ?? '');

                // Comparación flexible (case-insensitive para texto)
                $esCorrecta = strtolower($respuestaEstudiante) === strtolower($respuestaCorrecta);

                if ($esCorrecta) {
                    $puntosObtenidos = $pregunta->puntos ?? 0;
                }
            }

            // Crear respuesta enriquecida
            $respuestasEnriquecidas[] = [
                'id' => null,
                'pregunta_id' => $preguntaId,
                'respuesta' => $respuestaTexto,
                'es_correcta' => $esCorrecta,
                'puntos_obtenidos' => $puntosObtenidos,
            ];
        }

        return $respuestasEnriquecidas;
    }

    /**
     * Convertir respuestas del formato antiguo al nuevo formato enriquecido
     *
     * Detecta si las respuestas están en formato antiguo (objeto con keys numéricas)
     * y las convierte al nuevo formato (array de objetos con pregunta_id, respuesta, etc.)
     *
     * @param array $respuestas Respuestas que pueden estar en formato antiguo o nuevo
     * @param Evaluacion $evaluacion Evaluación asociada
     * @return array Respuestas en formato enriquecido
     */
    private function convertirFormatoAntiguoRespuestas(array $respuestas, Evaluacion $evaluacion): array
    {
        if (empty($respuestas)) {
            return [];
        }

        // Detectar si está en formato antiguo (keys numéricas sin 'pregunta_id')
        $primerElemento = reset($respuestas);
        $esFormatoAntiguo = is_string($primerElemento) || is_numeric($primerElemento) ||
                           (is_array($primerElemento) && !isset($primerElemento['pregunta_id']) && isset($primerElemento[0]) === false);

        // Si ya está en formato nuevo, retornar tal cual
        if (!$esFormatoAntiguo && is_array($primerElemento) && isset($primerElemento['pregunta_id'])) {
            return $respuestas;
        }

        // Convertir formato antiguo al nuevo
        $preguntas = $evaluacion->preguntas()->get();
        $respuestasConvertidas = [];

        // El formato antiguo es: {"16": "120", "17": "Verdadero", ...}
        // Convertir a: [{"pregunta_id": 16, "respuesta": "120", ...}, ...]
        foreach ($respuestas as $preguntaId => $respuestaTexto) {
            $preguntaId = (int) $preguntaId;
            $pregunta = $preguntas->firstWhere('id', $preguntaId);

            // Verificar si la respuesta es correcta
            $esCorrecta = false;
            $puntosObtenidos = 0;

            if ($pregunta && $respuestaTexto) {
                $respuestaEstudiante = trim($respuestaTexto);
                $respuestaCorrecta = trim($pregunta->respuesta_correcta ?? '');

                $esCorrecta = strtolower($respuestaEstudiante) === strtolower($respuestaCorrecta);

                if ($esCorrecta) {
                    $puntosObtenidos = $pregunta->puntos ?? 0;
                }
            }

            // Incluir la respuesta incluso si la pregunta no existe
            // (puede haber sido eliminada o modificada después de que se guardó la respuesta)
            $respuestasConvertidas[] = [
                'pregunta_id' => $preguntaId,
                'respuesta' => $respuestaTexto,
                'es_correcta' => $esCorrecta,
                'puntos_obtenidos' => $puntosObtenidos,
            ];
        }

        return $respuestasConvertidas;
    }
}
