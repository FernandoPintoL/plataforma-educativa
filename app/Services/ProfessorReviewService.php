<?php

namespace App\Services;

use App\Models\Evaluacion;
use App\Models\IntentosEvaluacion;
use App\Models\RespuestaEvaluacion;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * ProfessorReviewService
 *
 * Gestión de revisión de evaluaciones por profesores
 * Proporciona priorización inteligente, obtención de detalles y confirmación/ajuste de calificaciones
 */
class ProfessorReviewService
{
    /**
     * Obtener intentos pendientes de revisión para una evaluación
     * Ordenados por prioridad (urgente → media → baja)
     */
    public function obtenerIntentosParaRevisar(int $evaluacionId, array $filtros = []): Collection
    {
        try {
            Log::info("Obteniendo intentos para revisar", [
                'evaluacion_id' => $evaluacionId,
                'filtros' => $filtros,
            ]);

            // Cargar evaluación
            $evaluacion = Evaluacion::findOrFail($evaluacionId);

            // Query base
            $query = IntentosEvaluacion::where('evaluacion_id', $evaluacionId)
                ->where('estado', 'entregado') // Solo los entregados pero no calificados
                ->with(['estudiante:id,nombre_completo,email'])
                ->orderByRaw(
                    // Priorización: CASE para ordenar urgente, media, baja
                    "CASE
                        WHEN tiene_anomalias = true OR nivel_confianza_respuestas < 0.5 THEN 0
                        WHEN nivel_confianza_respuestas < 0.75 THEN 1
                        ELSE 2
                    END,
                    fecha_entrega ASC"
                );

            // Aplicar filtro de prioridad
            if (isset($filtros['prioridad']) && !empty($filtros['prioridad'])) {
                $prioridad = $filtros['prioridad'];

                $query->where(function ($q) use ($prioridad) {
                    if ($prioridad === 'urgente') {
                        $q->where('tiene_anomalias', true)
                            ->orWhere('nivel_confianza_respuestas', '<', 0.5);
                    } elseif ($prioridad === 'media') {
                        $q->where('tiene_anomalias', false)
                            ->where('nivel_confianza_respuestas', '>=', 0.5)
                            ->where('nivel_confianza_respuestas', '<', 0.75);
                    } elseif ($prioridad === 'baja') {
                        $q->where('tiene_anomalias', false)
                            ->where('nivel_confianza_respuestas', '>=', 0.75);
                    }
                });
            }

            // Aplicar filtro de búsqueda (por nombre de estudiante)
            if (isset($filtros['buscar']) && !empty($filtros['buscar'])) {
                $busqueda = $filtros['buscar'];
                $query->whereHas('estudiante', function ($q) use ($busqueda) {
                    $q->where('nombre_completo', 'ilike', "%{$busqueda}%")
                        ->orWhere('email', 'ilike', "%{$busqueda}%");
                });
            }

            // Mapear resultados para presentación
            return $query->get()->map(function ($intento) {
                return [
                    'id' => $intento->id,
                    'estudiante' => [
                        'id' => $intento->estudiante->id,
                        'nombre_completo' => $intento->estudiante->nombre_completo,
                        'email' => $intento->estudiante->email,
                    ],
                    'puntaje_obtenido' => $intento->puntaje_obtenido,
                    'porcentaje_acierto' => $intento->porcentaje_acierto,
                    'nivel_confianza' => round($intento->nivel_confianza_respuestas ?? 0, 2),
                    'tiene_anomalias' => $intento->tiene_anomalias,
                    'prioridad' => $intento->obtenerPrioridad(),
                    'fecha_entrega' => $intento->fecha_entrega,
                    'estado' => $intento->estado,
                    'numero_intento' => $intento->numero_intento,
                ];
            });

        } catch (Exception $e) {
            Log::error("Error obteniendo intentos para revisar: {$e->getMessage()}");
            throw $e;
        }
    }

    /**
     * Obtener detalle completo de un intento para revisión
     */
    public function obtenerDetalleRevision(int $intentoId): array
    {
        try {
            $intento = IntentosEvaluacion::with([
                'estudiante:id,nombre_completo,email',
                'evaluacion.contenido:id,titulo',
                'respuestas_detalladas.pregunta'
            ])->findOrFail($intentoId);

            Log::info("Obteniendo detalle de revisión para intento #{$intentoId}");

            // Preparar resumen del intento
            $resumenIntento = [
                'id' => $intento->id,
                'estudiante' => [
                    'id' => $intento->estudiante->id,
                    'nombre_completo' => $intento->estudiante->nombre_completo,
                    'email' => $intento->estudiante->email,
                ],
                'evaluacion' => [
                    'id' => $intento->evaluacion->id,
                    'titulo' => $intento->evaluacion->contenido->titulo,
                ],
                'puntaje_obtenido' => $intento->puntaje_obtenido,
                'porcentaje_acierto' => $intento->porcentaje_acierto,
                'nivel_confianza' => round($intento->nivel_confianza_respuestas ?? 0, 2),
                'tiene_anomalias' => $intento->tiene_anomalias,
                'prioridad' => $intento->obtenerPrioridad(),
                'patrones_identificados' => $intento->patrones_identificados ?? [],
                'areas_debilidad' => array_slice($intento->areas_debilidad ?? [], 0, 3),
                'areas_fortaleza' => array_slice($intento->areas_fortaleza ?? [], 0, 3),
                'recomendaciones_ia' => $intento->recomendaciones_ia ?? [],
                'fecha_entrega' => $intento->fecha_entrega,
                'tiempo_total' => $intento->tiempo_total,
                'numero_intento' => $intento->numero_intento,
                'estado' => $intento->estado,
            ];

            // Preparar respuestas detalladas
            $respuestas = $intento->respuestas_detalladas->map(function ($respuesta) {
                return $respuesta->obtenerResumenParaProfesor();
            })->toArray();

            return [
                'intento' => $resumenIntento,
                'respuestas' => $respuestas,
            ];

        } catch (Exception $e) {
            Log::error("Error obteniendo detalle de revisión: {$e->getMessage()}");
            throw $e;
        }
    }

    /**
     * Confirmar calificación automática del sistema
     * Marca el intento como 'calificado'
     */
    public function confirmarCalificacion(int $intentoId, ?string $comentario = null): bool
    {
        try {
            DB::beginTransaction();

            $intento = IntentosEvaluacion::findOrFail($intentoId);

            Log::info("Confirmando calificación para intento #{$intentoId}", [
                'puntaje' => $intento->puntaje_obtenido,
                'profesor_comentario' => !empty($comentario),
            ]);

            // Usar el método del modelo para marcar como calificado
            // Esto crea el registro en la tabla calificaciones
            $intento->marcarComoCalificado(
                auth()->id(),
                $comentario
            );

            DB::commit();

            Log::info("Calificación confirmada para intento #{$intentoId}");

            return true;

        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error confirmando calificación: {$e->getMessage()}");
            throw $e;
        }
    }

    /**
     * Ajustar calificación manualmente
     * El profesor modifica puntos y/o recomendaciones
     */
    public function ajustarCalificacion(int $intentoId, array $datos): bool
    {
        try {
            DB::beginTransaction();

            $intento = IntentosEvaluacion::with('respuestas_detalladas')->findOrFail($intentoId);

            Log::info("Ajustando calificación para intento #{$intentoId}");

            // Procesar ajustes por respuesta
            if (isset($datos['ajustes']) && is_array($datos['ajustes'])) {
                foreach ($datos['ajustes'] as $ajuste) {
                    $respuesta = RespuestaEvaluacion::findOrFail($ajuste['respuesta_id']);

                    // Validar que no exceda puntos máximos
                    $puntosAjustados = min(
                        floatval($ajuste['puntos_obtenidos']),
                        $respuesta->puntos_totales ?? 0
                    );

                    $respuesta->update([
                        'puntos_obtenidos' => $puntosAjustados,
                        'recomendacion' => $ajuste['recomendacion'] ?? $respuesta->recomendacion,
                    ]);
                }
            }

            // Recalcular puntaje total del intento
            $puntajeTotalIntento = $intento->respuestas_detalladas()
                ->sum('puntos_obtenidos');

            $puntajeTotal = $intento->evaluacion->preguntas->sum('puntos');
            $porcentaje = $puntajeTotal > 0
                ? round(($puntajeTotalIntento / $puntajeTotal) * 100, 2)
                : 0;

            // Actualizar intento
            $intento->update([
                'puntaje_obtenido' => $puntajeTotalIntento,
                'porcentaje_acierto' => $porcentaje,
            ]);

            // Marcar como calificado
            $intento->marcarComoCalificado(
                auth()->id(),
                $datos['comentario_general'] ?? null
            );

            DB::commit();

            Log::info("Calificación ajustada para intento #{$intentoId}", [
                'puntaje_nuevo' => $puntajeTotalIntento,
                'porcentaje_nuevo' => $porcentaje,
            ]);

            return true;

        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error ajustando calificación: {$e->getMessage()}");
            throw $e;
        }
    }

    /**
     * Obtener estadísticas de revisión para una evaluación
     */
    public function obtenerEstadisticasRevision(int $evaluacionId): array
    {
        try {
            $evaluacion = Evaluacion::findOrFail($evaluacionId);

            $intentos = IntentosEvaluacion::where('evaluacion_id', $evaluacionId)
                ->get();

            $entregados = $intentos->where('estado', 'entregado')->count();
            $calificados = $intentos->where('estado', 'calificado')->count();

            // Conteo por prioridad (solo entregados)
            $intentosEntregados = $intentos->where('estado', 'entregado');

            $urgentes = $intentosEntregados->where('tiene_anomalias', true)
                ->concat($intentosEntregados->where('nivel_confianza_respuestas', '<', 0.5))
                ->unique('id')
                ->count();

            $medios = $intentosEntregados
                ->where('tiene_anomalias', false)
                ->where('nivel_confianza_respuestas', '>=', 0.5)
                ->where('nivel_confianza_respuestas', '<', 0.75)
                ->count();

            $bajos = $intentosEntregados
                ->where('tiene_anomalias', false)
                ->where('nivel_confianza_respuestas', '>=', 0.75)
                ->count();

            // Promedios
            $confianzaPromedio = $intentos->avg('nivel_confianza_respuestas') ?? 0;
            $porcentajePromedio = $intentos->avg('porcentaje_acierto') ?? 0;
            $puntajePromedio = $intentos->avg('puntaje_obtenido') ?? 0;

            return [
                'total_intentos' => $intentos->count(),
                'entregados' => $entregados,
                'calificados' => $calificados,
                'pendientes' => $entregados,
                'prioridades' => [
                    'urgente' => $urgentes,
                    'media' => $medios,
                    'baja' => $bajos,
                ],
                'promedios' => [
                    'confianza' => round($confianzaPromedio, 2),
                    'porcentaje_acierto' => round($porcentajePromedio, 2),
                    'puntaje' => round($puntajePromedio, 2),
                ],
                'porcentaje_completado' => $intentos->count() > 0
                    ? round(($calificados / $intentos->count()) * 100, 2)
                    : 0,
            ];

        } catch (Exception $e) {
            Log::error("Error obteniendo estadísticas de revisión: {$e->getMessage()}");
            throw $e;
        }
    }
}
