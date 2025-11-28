<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

/**
 * IntentosEvaluacion - Registra cada intento de estudiante en una evaluación
 * Análogo a la tabla 'trabajos' pero para evaluaciones
 */
class IntentosEvaluacion extends Model
{
    use HasFactory;

    protected $table = 'intentos_evaluacion';

    protected $fillable = [
        'evaluacion_id',
        'estudiante_id',
        'estado',
        'respuestas',
        'comentarios',
        'fecha_inicio',
        'fecha_entrega',
        'fecha_limite',
        'tiempo_total',
        'numero_intento',
        'consultas_material',
        'cambios_respuesta',
        'puntaje_obtenido',
        'porcentaje_acierto',
        'dificultad_detectada',
        'nivel_confianza_respuestas',
        'tiene_anomalias',
        'patrones_identificados',
        'areas_debilidad',
        'areas_fortaleza',
        'recomendaciones_ia',
        'ultimo_analisis_ml',
    ];

    protected $casts = [
        'respuestas' => 'array',
        'patrones_identificados' => 'array',
        'areas_debilidad' => 'array',
        'areas_fortaleza' => 'array',
        'recomendaciones_ia' => 'array',
        'fecha_inicio' => 'datetime',
        'fecha_entrega' => 'datetime',
        'fecha_limite' => 'datetime',
        'ultimo_analisis_ml' => 'datetime',
        'tiene_anomalias' => 'boolean',
    ];

    /**
     * Relación con la evaluación
     */
    public function evaluacion(): BelongsTo
    {
        return $this->belongsTo(Evaluacion::class);
    }

    /**
     * Relación con el estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Relación con las respuestas detalladas
     */
    public function respuestas_detalladas(): HasMany
    {
        return $this->hasMany(RespuestaEvaluacion::class, 'intento_evaluacion_id');
    }

    /**
     * Relación con calificación (si existe)
     */
    public function calificacion(): HasOne
    {
        return $this->hasOne(Calificacion::class, 'intento_evaluacion_id');
    }

    /**
     * Iniciar evaluación
     */
    public function iniciar(): void
    {
        $this->update([
            'estado' => 'en_progreso',
            'fecha_inicio' => now(),
            'numero_intento' => ($this->numero_intento ?? 0) + 1,
        ]);
    }

    /**
     * Entregar evaluación
     */
    public function entregar(): void
    {
        $this->update([
            'estado' => 'entregado',
            'fecha_entrega' => now(),
            'tiempo_total' => $this->calcularTiempoTotal(),
        ]);
    }

    /**
     * Calcular tiempo total en minutos
     */
    public function calcularTiempoTotal(): int
    {
        if (!$this->fecha_inicio) {
            return 0;
        }
        return now()->diffInMinutes($this->fecha_inicio);
    }

    /**
     * Recibir retroalimentación
     */
    public function recibirRetroalimentacion(string $retroalimentacion): void
    {
        $this->update(['comentarios' => $retroalimentacion]);
    }

    /**
     * Verificar si está en progreso
     */
    public function estaEnProgreso(): bool
    {
        return $this->estado === 'en_progreso';
    }

    /**
     * Verificar si está entregado
     */
    public function estaEntregado(): bool
    {
        return $this->estado === 'entregado';
    }

    /**
     * Verificar si está calificado
     */
    public function estaCalificado(): bool
    {
        return $this->estado === 'calificado';
    }

    /**
     * Verificar si está expirado
     */
    public function estaExpirado(): bool
    {
        return $this->estado === 'expirado';
    }

    /**
     * Obtener puntaje de la calificación
     */
    public function getPuntaje(): float
    {
        return $this->puntaje_obtenido ?? 0;
    }

    /**
     * Obtener porcentaje de acierto
     */
    public function getPorcentajeAcierto(): float
    {
        return $this->porcentaje_acierto ?? 0;
    }

    /**
     * Incrementar consultas de material
     */
    public function incrementarConsultasMaterial(): void
    {
        $this->increment('consultas_material');
    }

    /**
     * Incrementar cambios de respuesta
     */
    public function incrementarCambios(): void
    {
        $this->increment('cambios_respuesta');
    }

    /**
     * Obtener tiempo transcurrido formateado
     */
    public function getTiempoTranscurridoFormateado(): string
    {
        if (!$this->fecha_inicio) {
            return 'No iniciado';
        }

        $tiempo = $this->tiempo_total ?? now()->diffInMinutes($this->fecha_inicio);
        $horas = floor($tiempo / 60);
        $minutos = $tiempo % 60;

        if ($horas > 0) {
            return "{$horas}h {$minutos}m";
        }

        return "{$minutos}m";
    }

    /**
     * Obtener estadísticas del intento
     */
    public function obtenerEstadisticas(): array
    {
        $respuestas = $this->respuestas_detalladas()->get();
        $correctas = $respuestas->where('es_correcta', true)->count();
        $total = $respuestas->count();

        return [
            'tiempo_total' => $this->tiempo_total ?? 0,
            'numero_intento' => $this->numero_intento,
            'consultas_material' => $this->consultas_material,
            'cambios_respuesta' => $this->cambios_respuesta,
            'puntaje' => $this->getPuntaje(),
            'porcentaje_acierto' => $this->getPorcentajeAcierto(),
            'respuestas_correctas' => $correctas,
            'respuestas_totales' => $total,
            'estado' => $this->estado,
            'tiene_anomalias' => $this->tiene_anomalias,
            'fecha_entrega' => $this->fecha_entrega?->format('d/m/Y H:i'),
        ];
    }

    /**
     * Calcular puntaje basado en respuestas
     */
    public function calcularPuntaje(): void
    {
        $respuestas = $this->respuestas_detalladas()->get();
        $puntaje_total = $respuestas->sum('puntos_obtenidos');
        $puntos_maximos = $respuestas->sum('puntos_totales');

        $porcentaje = $puntos_maximos > 0
            ? round(($puntaje_total / $puntos_maximos) * 100, 2)
            : 0;

        $this->update([
            'puntaje_obtenido' => $puntaje_total,
            'porcentaje_acierto' => $porcentaje,
        ]);
    }

    /**
     * Aplicar análisis ML
     */
    public function aplicarAnalisisML(array $analisisData): void
    {
        $this->update([
            'dificultad_detectada' => $analisisData['dificultad'] ?? null,
            'nivel_confianza_respuestas' => $analisisData['confianza'] ?? null,
            'tiene_anomalias' => $analisisData['tiene_anomalias'] ?? false,
            'patrones_identificados' => $analisisData['patrones'] ?? null,
            'areas_debilidad' => $analisisData['areas_debilidad'] ?? null,
            'areas_fortaleza' => $analisisData['areas_fortaleza'] ?? null,
            'recomendaciones_ia' => $analisisData['recomendaciones'] ?? null,
            'ultimo_analisis_ml' => now(),
        ]);
    }

    /**
     * Verificar si requiere revisión del profesor
     * IMPORTANTE: Todas las evaluaciones requieren revisión
     */
    public function requiereRevisionProfesor(): bool
    {
        return $this->estado === 'entregado';
    }

    /**
     * Marcar como calificado por el profesor
     * Crea registro en tabla calificaciones
     */
    public function marcarComoCalificado(int $evaluadorId, ?string $comentario = null): void
    {
        DB::transaction(function() use ($evaluadorId, $comentario) {
            // Actualizar estado
            $this->update([
                'estado' => 'calificado',
                'comentarios' => $comentario ?? $this->comentarios,
            ]);

            // Crear registro en tabla calificaciones
            \App\Models\Calificacion::create([
                'intento_evaluacion_id' => $this->id,
                'puntaje' => $this->puntaje_obtenido ?? 0,
                'comentario' => $comentario,
                'fecha_calificacion' => now(),
                'evaluador_id' => $evaluadorId,
            ]);
        });
    }

    /**
     * Obtener prioridad de revisión basada en métricas
     */
    public function obtenerPrioridad(): string
    {
        // URGENTE: Anomalías o muy baja confianza
        if ($this->tiene_anomalias || ($this->nivel_confianza_respuestas ?? 0) < 0.5) {
            return 'urgente';
        }

        // MEDIA: Confianza media
        if (($this->nivel_confianza_respuestas ?? 0) < 0.75) {
            return 'media';
        }

        // BAJA: Alta confianza sin anomalías
        return 'baja';
    }

    /**
     * Obtener resumen para revisión del profesor
     */
    public function obtenerResumenRevision(): array
    {
        return [
            'id' => $this->id,
            'estudiante_nombre' => $this->estudiante->nombre_completo ?? 'N/A',
            'estudiante_id' => $this->estudiante_id,
            'puntaje_obtenido' => $this->puntaje_obtenido ?? 0,
            'porcentaje_acierto' => $this->porcentaje_acierto ?? 0,
            'nivel_confianza' => round($this->nivel_confianza_respuestas ?? 0, 2),
            'tiene_anomalias' => $this->tiene_anomalias ?? false,
            'prioridad' => $this->obtenerPrioridad(),
            'patrones_identificados' => $this->patrones_identificados ?? [],
            'areas_debilidad' => array_slice($this->areas_debilidad ?? [], 0, 3),
            'areas_fortaleza' => array_slice($this->areas_fortaleza ?? [], 0, 3),
            'recomendaciones_ia' => $this->recomendaciones_ia ?? [],
            'fecha_entrega' => $this->fecha_entrega,
            'estado' => $this->estado,
        ];
    }
}
