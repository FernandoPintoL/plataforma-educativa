<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RealTimeMonitoring;
use App\Services\StudentProgressMonitor;
use App\Services\AlertSystem;
use App\Services\HintGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

/**
 * StudentActivityController
 *
 * API controller para registrar actividad estudiantil en tiempo real
 * y generar alertas e intervenciones basadas en el monitoreo
 */
class StudentActivityController extends Controller
{
    protected StudentProgressMonitor $progressMonitor;
    protected AlertSystem $alertSystem;
    protected HintGenerator $hintGenerator;

    public function __construct(
        StudentProgressMonitor $progressMonitor,
        AlertSystem $alertSystem,
        HintGenerator $hintGenerator
    ) {
        $this->progressMonitor = $progressMonitor;
        $this->alertSystem = $alertSystem;
        $this->hintGenerator = $hintGenerator;
    }

    /**
     * Registrar una actividad estudiantil
     *
     * POST /api/student-activity
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function registrarActividad(Request $request): JsonResponse
    {
        try {
            // Validar request
            $validated = $request->validate([
                'trabajo_id' => 'required|integer|exists:trabajos,id',
                'estudiante_id' => 'required|integer|exists:users,id',
                'contenido_id' => 'required|integer|exists:contenidos,id',
                'evento' => 'required|string|in:inicio_trabajo,respuesta_escrita,consulta_material,cambio_respuesta,pausa,reanudacion,envio_trabajo,abandono',
                'duracion_evento' => 'nullable|integer|min:0',
                'descripcion' => 'nullable|string|max:500',
                'contexto' => 'nullable|array',
                'respuestas_completas' => 'nullable|array',
                'total_respuestas' => 'nullable|integer|min:0',
                'caracteres_escritos' => 'nullable|integer|min:0',
                'num_correcciones' => 'nullable|integer|min:0',
                'num_consultas' => 'nullable|integer|min:0',
                'errores' => 'nullable|array',
            ]);

            // Registrar la actividad
            $monitoring = $this->progressMonitor->registrarActividad(
                $validated['trabajo_id'],
                $validated['estudiante_id'],
                $validated['contenido_id'],
                $validated['evento'],
                [
                    'duracion_evento' => $validated['duracion_evento'] ?? 0,
                    'descripcion' => $validated['descripcion'] ?? null,
                    'contexto' => $validated['contexto'] ?? [],
                    'respuestas_completas' => $validated['respuestas_completas'] ?? [],
                    'total_respuestas' => $validated['total_respuestas'] ?? 0,
                    'caracteres_escritos' => $validated['caracteres_escritos'] ?? 0,
                    'num_correcciones' => $validated['num_correcciones'] ?? 0,
                    'num_consultas' => $validated['num_consultas'] ?? 0,
                    'errores' => $validated['errores'] ?? [],
                ]
            );

            // Evaluar y generar alertas si es necesario
            $alerta = $this->alertSystem->evaluarYGenerarAlertas($monitoring);

            // Evaluar si se debe generar una sugerencia
            $sugerencia = null;
            if ($monitoring->tipo_intervencion === 'hint' && $validated['evento'] === 'respuesta_escrita') {
                $sugerencia = $this->generarSugerenciaAdaptativa(
                    $validated['trabajo_id'],
                    $validated['estudiante_id'],
                    $monitoring,
                    $validated
                );
            }

            Log::info('Actividad registrada exitosamente', [
                'trabajo_id' => $validated['trabajo_id'],
                'estudiante_id' => $validated['estudiante_id'],
                'evento' => $validated['evento'],
                'nivel_riesgo' => $monitoring->nivel_riesgo,
                'alerta_generada' => $alerta ? true : false,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Actividad registrada correctamente',
                'data' => [
                    'monitoring' => $this->formatearMonitoring($monitoring),
                    'alerta' => $alerta ? $this->formatearAlerta($alerta) : null,
                    'sugerencia' => $sugerencia ? $this->formatearSugerencia($sugerencia) : null,
                    'estadisticas' => $this->progressMonitor->obtenerEstadisticas(
                        $validated['trabajo_id']
                    ),
                ],
            ], 201);

        } catch (ValidationException $e) {
            Log::warning('Error de validación en registrar actividad', [
                'errors' => $e->errors(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error registrando actividad estudiantil', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => config('app.debug') ? $e->getMessage() : 'Error desconocido',
            ], 500);
        }
    }

    /**
     * Obtener resumen de actividad actual
     *
     * GET /api/student-activity/{trabajoId}
     *
     * @param int $trabajoId
     * @return JsonResponse
     */
    public function obtenerResumen(int $trabajoId): JsonResponse
    {
        try {
            $estadisticas = $this->progressMonitor->obtenerEstadisticas($trabajoId);
            $patrones = $this->progressMonitor->detectarPatronesProblematicos($trabajoId);

            return response()->json([
                'success' => true,
                'data' => [
                    'estadisticas' => $estadisticas,
                    'patrones' => $patrones,
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error obteniendo resumen de actividad', [
                'trabajo_id' => $trabajoId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener resumen',
            ], 500);
        }
    }

    /**
     * Obtener alertas pendientes para un estudiante
     *
     * GET /api/student-activity/alerts/{estudianteId}
     *
     * @param int $estudianteId
     * @return JsonResponse
     */
    public function obtenerAlertas(int $estudianteId): JsonResponse
    {
        try {
            $alertas = $this->alertSystem->obtenerAlertasPendientes($estudianteId);

            return response()->json([
                'success' => true,
                'data' => [
                    'alertas' => array_map(fn($alerta) => $this->formatearAlerta($alerta), $alertas),
                    'total' => count($alertas),
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error obteniendo alertas', [
                'estudiante_id' => $estudianteId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener alertas',
            ], 500);
        }
    }

    /**
     * Marcar alerta como intervenida
     *
     * PATCH /api/student-activity/alerts/{alertaId}/intervene
     *
     * @param int $alertaId
     * @param Request $request
     * @return JsonResponse
     */
    public function marcarAlertaIntervenida(int $alertaId, Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'accion' => 'nullable|string|max:500',
            ]);

            $this->alertSystem->marcarComoIntervenida(
                $alertaId,
                $validated['accion'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Alerta marcada como intervenida',
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error marcando alerta como intervenida', [
                'alerta_id' => $alertaId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar alerta',
            ], 500);
        }
    }

    /**
     * Generar sugerencia adaptativa basada en monitoreo
     */
    protected function generarSugerenciaAdaptativa(
        int $trabajoId,
        int $estudianteId,
        RealTimeMonitoring $monitoring,
        array $detalles
    ): ?\App\Models\StudentHint {
        try {
            // Determinar nivel de dificultad basado en score de riesgo
            $nivelDificultad = $this->determinarNivelDificultad($monitoring->score_riesgo);

            // Obtener tema del trabajo
            $trabajo = $monitoring->trabajo;
            $tema = $trabajo->titulo ?? 'Trabajo académico';

            // Generar sugerencia socrática
            if (count($detalles['errores'] ?? []) > 0) {
                return $this->hintGenerator->generarSugerenciaSocratica(
                    $trabajoId,
                    $estudianteId,
                    $tema,
                    $detalles['respuestas_completas'] ?? [],
                    $detalles['errores'] ?? [],
                    $nivelDificultad
                );
            }

            return null;

        } catch (\Exception $e) {
            Log::error('Error generando sugerencia adaptativa', [
                'trabajo_id' => $trabajoId,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Determinar nivel de dificultad Socrático basado en riesgo
     */
    protected function determinarNivelDificultad(float $scoreRiesgo): int
    {
        // Score alto = más ayuda (nivel bajo)
        if ($scoreRiesgo >= 0.8) return 1; // Muy guiado
        if ($scoreRiesgo >= 0.6) return 2; // Guiado
        if ($scoreRiesgo >= 0.4) return 3; // Equilibrado
        if ($scoreRiesgo >= 0.2) return 4; // Independiente
        return 5; // Muy independiente
    }

    /**
     * Formatear objeto monitoring para respuesta JSON
     */
    protected function formatearMonitoring(RealTimeMonitoring $monitoring): array
    {
        return [
            'id' => $monitoring->id,
            'evento' => $monitoring->evento,
            'timestamp' => $monitoring->timestamp?->toIso8601String(),
            'duracion_evento' => $monitoring->duracion_evento,
            'tiempo_total_acumulado' => $monitoring->tiempo_total_acumulado,
            'progreso_estimado' => $monitoring->progreso_estimado,
            'velocidad_respuesta' => $monitoring->velocidad_respuesta,
            'nivel_riesgo' => $monitoring->nivel_riesgo,
            'score_riesgo' => $monitoring->score_riesgo,
            'tipo_intervencion' => $monitoring->tipo_intervencion,
        ];
    }

    /**
     * Formatear objeto alerta para respuesta JSON
     */
    protected function formatearAlerta($alerta): array
    {
        if (is_array($alerta)) {
            return $alerta;
        }

        return [
            'id' => $alerta->id,
            'tipo_alerta' => $alerta->tipo_alerta,
            'severidad' => $alerta->severidad,
            'mensaje' => $alerta->mensaje,
            'recomendacion' => $alerta->recomendacion,
            'confianza' => $alerta->confianza,
            'estado' => $alerta->estado,
            'fecha_generacion' => $alerta->fecha_generacion?->toIso8601String(),
        ];
    }

    /**
     * Formatear objeto sugerencia para respuesta JSON
     */
    protected function formatearSugerencia($sugerencia): array
    {
        return [
            'id' => $sugerencia->id,
            'tipo_sugerencia' => $sugerencia->tipo_sugerencia,
            'contenido_sugerencia' => $sugerencia->contenido_sugerencia,
            'tema_abordado' => $sugerencia->tema_abordado,
            'relevancia_estimada' => $sugerencia->relevancia_estimada,
            'estado' => $sugerencia->estado,
            'preguntas_guia' => $sugerencia->preguntas_guia,
        ];
    }
}
