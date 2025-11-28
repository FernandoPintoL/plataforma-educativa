<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evaluacion;
use App\Models\IntentosEvaluacion;
use App\Models\RespuestaEvaluacion;
use App\Models\User;
use App\Services\AgentSynthesisService;
use App\Services\EvaluacionGradingService;
use App\Jobs\AnalizarRespuestaLargaJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EvaluacionesApiController extends Controller
{
    protected AgentSynthesisService $agentService;
    protected EvaluacionGradingService $gradingService;

    public function __construct(
        AgentSynthesisService $agentService,
        EvaluacionGradingService $gradingService
    ) {
        $this->agentService = $agentService;
        $this->gradingService = $gradingService;
    }

    /**
     * Listar evaluaciones disponibles para un estudiante
     * GET /api/evaluaciones
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user->esEstudiante()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo estudiantes pueden acceder a evaluaciones'
                ], 403);
            }

            // Obtener evaluaciones de los cursos del estudiante
            $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');

            $evaluaciones = Evaluacion::whereHas('contenido', function ($query) use ($cursosIds) {
                $query->whereIn('curso_id', $cursosIds)
                      ->where('estado', 'publicado');
            })
            ->with(['contenido:id,titulo,descripcion,fecha_limite,curso_id', 'preguntas:id,evaluacion_id'])
            ->get()
            ->map(function ($eval) use ($user) {
                $ultimoIntento = IntentosEvaluacion::where('evaluacion_id', $eval->id)
                    ->where('estudiante_id', $user->id)
                    ->latest('created_at')
                    ->first();

                return [
                    'id' => $eval->id,
                    'titulo' => $eval->contenido->titulo,
                    'descripcion' => $eval->contenido->descripcion,
                    'tipo_evaluacion' => $eval->tipo_evaluacion,
                    'puntuacion_total' => $eval->puntuacion_total,
                    'tiempo_limite' => $eval->tiempo_limite,
                    'total_preguntas' => $eval->preguntas->count(),
                    'fecha_limite' => $eval->contenido->fecha_limite,
                    'permite_reintento' => $eval->permite_reintento,
                    'ultimo_intento' => $ultimoIntento ? [
                        'id' => $ultimoIntento->id,
                        'estado' => $ultimoIntento->estado,
                        'porcentaje_acierto' => $ultimoIntento->porcentaje_acierto,
                        'fecha_entrega' => $ultimoIntento->fecha_entrega,
                    ] : null,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $evaluaciones,
                'total' => count($evaluaciones),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error listando evaluaciones: {$e->getMessage()}");
            return response()->json(['success' => false, 'message' => 'Error'], 500);
        }
    }

    /**
     * Obtener detalles de una evaluación con sus preguntas
     * GET /api/evaluaciones/{id}
     */
    public function show($id, Request $request)
    {
        try {
            $user = $request->user();
            $evaluacion = Evaluacion::with([
                'contenido:id,titulo,descripcion,fecha_limite',
                'preguntas:id,evaluacion_id,enunciado,tipo,opciones,puntos,orden'
            ])->findOrFail($id);

            // Verificar acceso
            if ($user->esEstudiante()) {
                $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
                if (!$cursosIds->contains($evaluacion->contenido->curso_id)) {
                    return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $evaluacion->id,
                    'titulo' => $evaluacion->contenido->titulo,
                    'descripcion' => $evaluacion->contenido->descripcion,
                    'tipo_evaluacion' => $evaluacion->tipo_evaluacion,
                    'puntuacion_total' => $evaluacion->puntuacion_total,
                    'tiempo_limite' => $evaluacion->tiempo_limite,
                    'calificacion_automatica' => $evaluacion->calificacion_automatica,
                    'mostrar_respuestas' => $evaluacion->mostrar_respuestas,
                    'permite_reintento' => $evaluacion->permite_reintento,
                    'max_reintentos' => $evaluacion->max_reintentos,
                    'fecha_limite' => $evaluacion->contenido->fecha_limite,
                    'preguntas' => $evaluacion->preguntas->map(fn($p) => [
                        'id' => $p->id,
                        'enunciado' => $p->enunciado,
                        'tipo' => $p->tipo,
                        'opciones' => $p->opciones ? json_decode($p->opciones, true) : null,
                        'puntos' => $p->puntos,
                        'orden' => $p->orden,
                    ]),
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error obteniendo evaluación: {$e->getMessage()}");
            return response()->json(['success' => false, 'message' => 'Error'], 500);
        }
    }

    /**
     * Iniciar un intento de evaluación
     * POST /api/evaluaciones/{id}/iniciar
     */
    public function iniciarIntento($id, Request $request)
    {
        try {
            $user = $request->user();
            $evaluacion = Evaluacion::findOrFail($id);

            // Verificar acceso
            if (!$user->esEstudiante()) {
                return response()->json(['success' => false, 'message' => 'Solo estudiantes pueden tomar evaluaciones'], 403);
            }

            // Crear intento
            $intento = IntentosEvaluacion::create([
                'evaluacion_id' => $evaluacion->id,
                'estudiante_id' => $user->id,
                'estado' => 'en_progreso',
                'fecha_inicio' => now(),
                'fecha_limite' => now()->addMinutes($evaluacion->tiempo_limite ?? 60),
                'numero_intento' => IntentosEvaluacion::where('evaluacion_id', $evaluacion->id)
                    ->where('estudiante_id', $user->id)
                    ->max('numero_intento') + 1,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Intento iniciado',
                'data' => [
                    'intento_id' => $intento->id,
                    'estado' => $intento->estado,
                    'fecha_inicio' => $intento->fecha_inicio,
                    'fecha_limite' => $intento->fecha_limite,
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error("Error iniciando intento: {$e->getMessage()}");
            return response()->json(['success' => false, 'message' => 'Error'], 500);
        }
    }

    /**
     * Guardar una respuesta individual
     * POST /api/intentos/{intentoId}/respuestas
     */
    public function guardarRespuesta($intentoId, Request $request)
    {
        try {
            $user = $request->user();
            $intento = IntentosEvaluacion::findOrFail($intentoId);

            // Verificar que sea el estudiante del intento
            if ($intento->estudiante_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
            }

            // Validar datos
            $validated = $request->validate([
                'pregunta_id' => 'required|integer|exists:preguntas,id',
                'respuesta_texto' => 'nullable|string',
                'respuesta_datos' => 'nullable|array',
                'tiempo_respuesta' => 'nullable|integer|min:0',
            ]);

            // Crear o actualizar respuesta
            $respuesta = RespuestaEvaluacion::updateOrCreate(
                [
                    'intento_evaluacion_id' => $intentoId,
                    'pregunta_id' => $validated['pregunta_id'],
                ],
                [
                    'respuesta_texto' => $validated['respuesta_texto'],
                    'respuesta_datos' => $validated['respuesta_datos'],
                    'tiempo_respuesta' => $validated['tiempo_respuesta'] ?? 0,
                    'numero_cambios' => (RespuestaEvaluacion::where('intento_evaluacion_id', $intentoId)
                        ->where('pregunta_id', $validated['pregunta_id'])
                        ->first()?->numero_cambios ?? 0) + 1,
                    'fecha_respuesta' => now(),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Respuesta guardada',
                'data' => [
                    'respuesta_id' => $respuesta->id,
                    'numero_cambios' => $respuesta->numero_cambios,
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error guardando respuesta: {$e->getMessage()}");
            return response()->json(['success' => false, 'message' => 'Error'], 500);
        }
    }

    /**
     * Completar un intento de evaluación
     * POST /api/intentos/{intentoId}/completar
     *
     * Flujo:
     * 1. CAPA 1: Validación automática (preguntas cerradas)
     * 2. CAPA 2: Análisis LLM (preguntas abiertas)
     * 3. CAPA 3: Confianza y flags (anomalías)
     * 4. CAPA 4: Espera revisión del profesor (siempre obligatoria)
     */
    public function completarIntento($intentoId, Request $request)
    {
        try {
            DB::beginTransaction();

            $user = $request->user();
            $intento = IntentosEvaluacion::findOrFail($intentoId);

            // Verificar que sea el estudiante del intento
            if ($intento->estudiante_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
            }

            // NUEVO: Usar EvaluacionGradingService para procesar el intento completo
            // Esto implementa las 4 capas de calificación
            $this->gradingService->procesarIntentoCompleto($intento);

            DB::commit();

            // NUEVO: Dispatch jobs asíncronos DESPUÉS de confirmar el commit
            // Esto es para respuestas >500 palabras que necesitan análisis más profundo
            $this->dispatchAnalysisJobs($intento);

            return response()->json([
                'success' => true,
                'message' => 'Evaluación completada',
                'data' => [
                    'intento_id' => $intento->id,
                    'estado' => $intento->estado,
                    'puntaje_obtenido' => $intento->puntaje_obtenido,
                    'porcentaje_acierto' => $intento->porcentaje_acierto,
                    'nivel_confianza' => $intento->nivel_confianza_respuestas,
                    'tiene_anomalias' => $intento->tiene_anomalias,
                    'requiere_revision_profesor' => true, // Siempre requiere revisión
                    'fecha_entrega' => $intento->fecha_entrega,
                ],
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error completando intento: {$e->getMessage()}", [
                'intento_id' => $intentoId,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['success' => false, 'message' => 'Error al procesar evaluación'], 500);
        }
    }

    /**
     * Dispatch jobs asíncronos para análisis de respuestas largas
     */
    private function dispatchAnalysisJobs(IntentosEvaluacion $intento): void
    {
        try {
            $respuestasLargas = $intento->respuestas_detalladas()
                ->whereHas('pregunta', fn($q) => $q->where('tipo', 'respuesta_larga'))
                ->get();

            foreach ($respuestasLargas as $respuesta) {
                $numeroPalabras = str_word_count($respuesta->respuesta_texto ?? '');

                // Solo hacer jobs para respuestas >500 palabras
                if ($numeroPalabras > 500) {
                    Log::info("Despachando job de análisis para respuesta larga #{$respuesta->id}");
                    AnalizarRespuestaLargaJob::dispatch($respuesta->id);
                }
            }
        } catch (\Exception $e) {
            Log::warning("Error despachando jobs: {$e->getMessage()}");
            // No lanzar excepción, los jobs son complementarios
        }
    }

    /**
     * Obtener historial de intentos de un estudiante para una evaluación
     * GET /api/evaluaciones/{id}/mis-intentos
     */
    public function misIntentos($id, Request $request)
    {
        try {
            $user = $request->user();

            if (!$user->esEstudiante()) {
                return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
            }

            $intentos = IntentosEvaluacion::where('evaluacion_id', $id)
                ->where('estudiante_id', $user->id)
                ->orderBy('numero_intento', 'desc')
                ->get()
                ->map(fn($intento) => [
                    'id' => $intento->id,
                    'numero_intento' => $intento->numero_intento,
                    'estado' => $intento->estado,
                    'puntaje_obtenido' => $intento->puntaje_obtenido,
                    'porcentaje_acierto' => $intento->porcentaje_acierto,
                    'fecha_inicio' => $intento->fecha_inicio,
                    'fecha_entrega' => $intento->fecha_entrega,
                    'tiempo_total' => $intento->tiempo_total,
                    'dificultad_detectada' => $intento->dificultad_detectada,
                ]);

            return response()->json([
                'success' => true,
                'data' => $intentos,
                'total' => count($intentos),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error obteniendo intentos: {$e->getMessage()}");
            return response()->json(['success' => false, 'message' => 'Error'], 500);
        }
    }

    /**
     * Obtener detalles y resultados de un intento específico
     * GET /api/intentos/{id}
     */
    public function verIntento($id, Request $request)
    {
        try {
            $user = $request->user();
            $intento = IntentosEvaluacion::with([
                'evaluacion.contenido',
                'respuestas_detalladas.pregunta'
            ])->findOrFail($id);

            // Verificar acceso
            if ($intento->estudiante_id !== $user->id && !$user->esProfesor()) {
                return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $intento->id,
                    'evaluacion' => [
                        'id' => $intento->evaluacion->id,
                        'titulo' => $intento->evaluacion->contenido->titulo,
                    ],
                    'numero_intento' => $intento->numero_intento,
                    'estado' => $intento->estado,
                    'puntaje_obtenido' => $intento->puntaje_obtenido,
                    'porcentaje_acierto' => $intento->porcentaje_acierto,
                    'tiempo_total' => $intento->tiempo_total,
                    'fecha_inicio' => $intento->fecha_inicio,
                    'fecha_entrega' => $intento->fecha_entrega,
                    'dificultad_detectada' => $intento->dificultad_detectada,
                    'nivel_confianza_respuestas' => $intento->nivel_confianza_respuestas,
                    'tiene_anomalias' => $intento->tiene_anomalias,
                    'areas_debilidad' => $intento->areas_debilidad,
                    'areas_fortaleza' => $intento->areas_fortaleza,
                    'recomendaciones_ia' => $intento->recomendaciones_ia,
                    'respuestas' => $intento->respuestas_detalladas->map(fn($r) => [
                        'id' => $r->id,
                        'pregunta' => [
                            'id' => $r->pregunta->id,
                            'enunciado' => $r->pregunta->enunciado,
                            'tipo' => $r->pregunta->tipo,
                            'opciones' => $r->pregunta->opciones ? json_decode($r->pregunta->opciones, true) : null,
                            'respuesta_correcta' => $intento->evaluacion->mostrar_respuestas ? $r->pregunta->respuesta_correcta : null,
                        ],
                        'respuesta_texto' => $r->respuesta_texto,
                        'es_correcta' => $r->es_correcta,
                        'puntos_obtenidos' => $r->puntos_obtenidos,
                        'puntos_totales' => $r->puntos_totales,
                        'confianza' => $r->confianza_respuesta,
                        'patrones' => $r->patrones,
                        'recomendacion' => $r->recomendacion,
                    ]),
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error obteniendo intento: {$e->getMessage()}");
            return response()->json(['success' => false, 'message' => 'Error'], 500);
        }
    }

    /**
     * Obtener análisis ML de un intento (síntesis con IA)
     * GET /api/intentos/{id}/analisis-ia
     */
    public function obtenerAnalisisIA($id, Request $request)
    {
        try {
            $user = $request->user();
            $intento = IntentosEvaluacion::with('estudiante', 'evaluacion.preguntas', 'respuestas_detalladas')->findOrFail($id);

            // Verificar acceso
            if ($intento->estudiante_id !== $user->id && !$user->esProfesor()) {
                return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
            }

            // Llamar al servicio de síntesis del agente
            $synthesis = $this->agentService->synthesizeStudentEvaluation(
                $intento->estudiante,
                $intento,
                $intento->evaluacion
            );

            return response()->json([
                'success' => true,
                'data' => $synthesis,
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error obteniendo análisis IA: {$e->getMessage()}");
            return response()->json(['success' => false, 'message' => 'Error'], 500);
        }
    }

    // ==================== MÉTODOS PRIVADOS ====================

    private function validarRespuesta(RespuestaEvaluacion $respuesta, $pregunta): bool
    {
        if (!$pregunta->respuesta_correcta) {
            return false;
        }

        return match ($pregunta->tipo) {
            'verdadero_falso' => $this->compararBooleano($respuesta->respuesta_texto, $pregunta->respuesta_correcta),
            'opcion_multiple' => $this->compararOpciones($respuesta->respuesta_datos, $pregunta->respuesta_correcta),
            'respuesta_corta' => $this->compararTextoSimilar($respuesta->respuesta_texto, $pregunta->respuesta_correcta),
            default => false,
        };
    }

    private function compararBooleano($respuesta, $correcta): bool
    {
        $respuesta = strtolower(trim((string)$respuesta));
        $correcta = strtolower(trim((string)$correcta));
        return ($respuesta === 'verdadero' && $correcta === 'verdadero') ||
               ($respuesta === 'falso' && $correcta === 'falso');
    }

    private function compararOpciones($respuesta, $correcta): bool
    {
        if (!is_array($respuesta)) {
            return false;
        }
        return in_array($correcta, $respuesta);
    }

    private function compararTextoSimilar($respuesta, $correcta): bool
    {
        $respuesta = strtolower(trim((string)$respuesta));
        $correcta = strtolower(trim((string)$correcta));

        if ($respuesta === $correcta) {
            return true;
        }

        // Permitir variaciones pequeñas
        $similarity = 0;
        similar_text($respuesta, $correcta, $similarity);
        return $similarity >= 80; // 80% de similitud
    }

    private function calcularDificultadDetectada($respuestas): float
    {
        if ($respuestas->isEmpty()) {
            return 0.5;
        }

        $correctas = $respuestas->where('es_correcta', true)->count();
        $total = $respuestas->count();

        // Dificultad inversa: más errores = más dificultad
        return round(1 - ($correctas / $total), 2);
    }

    private function identificarPatrones(IntentosEvaluacion $intento): array
    {
        $patrones = [];

        if ($intento->tiempo_total < 10) {
            $patrones[] = 'evaluacion_rapida';
        }
        if ($intento->tiempo_total > 120) {
            $patrones[] = 'evaluacion_lenta';
        }
        if ($intento->cambios_respuesta > 5) {
            $patrones[] = 'multiples_cambios';
        }
        if ($intento->consultas_material > 3) {
            $patrones[] = 'consulta_frecuente_material';
        }

        return $patrones;
    }

    private function identificarAreas($respuestas, $tipo): array
    {
        $areas = [];

        if ($tipo === 'debilidad') {
            $debiles = $respuestas->where('es_correcta', false);
            if ($debiles->isNotEmpty()) {
                $areas[] = 'Conceptos no comprendidos: ' . $debiles->count() . ' preguntas';
            }
        } else {
            $fuertes = $respuestas->where('es_correcta', true);
            if ($fuertes->isNotEmpty()) {
                $areas[] = 'Dominio demostrado: ' . $fuertes->count() . ' preguntas correctas';
            }
        }

        return $areas;
    }

    private function generarRecomendaciones(IntentosEvaluacion $intento): array
    {
        $recomendaciones = [];

        if ($intento->porcentaje_acierto < 60) {
            $recomendaciones[] = 'Revisa los temas con más dificultad antes de reintentar';
        }
        if ($intento->nivel_confianza_respuestas < 0.6) {
            $recomendaciones[] = 'Estudia más antes de tu próximo intento';
        }
        if ($intento->tiene_anomalias) {
            $recomendaciones[] = 'Se detectaron patrones inusuales en tus respuestas';
        }

        return $recomendaciones;
    }
}
