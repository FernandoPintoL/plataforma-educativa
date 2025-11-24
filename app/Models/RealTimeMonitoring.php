<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * RealTimeMonitoring
 *
 * Modelo para rastrear la actividad en tiempo real del estudiante durante su trabajo
 * Registra eventos, métricas y cambios en el estado del estudiante
 */
class RealTimeMonitoring extends Model
{
    use HasFactory;

    protected $table = 'real_time_monitoring';

    protected $fillable = [
        'trabajo_id',
        'estudiante_id',
        'contenido_id',
        'evento',
        'timestamp',
        'duracion_evento',
        'tiempo_total_acumulado',
        'descripcion_evento',
        'contexto_evento',
        'metricas_cognitivas',
        'progreso_estimado',
        'velocidad_respuesta',
        'num_correcciones',
        'num_consultas',
        'errores_detectados',
        'nivel_riesgo',
        'score_riesgo',
        'indicadores_riesgo',
        'alerta_generada',
        'alerta_id',
        'sugerencia_generada',
        'sugerencia_id',
        'tipo_intervencion',
    ];

    protected $casts = [
        'timestamp' => 'datetime',
        'contexto_evento' => 'array',
        'metricas_cognitivas' => 'array',
        'errores_detectados' => 'array',
        'indicadores_riesgo' => 'array',
    ];

    /**
     * Relación con el trabajo
     */
    public function trabajo(): BelongsTo
    {
        return $this->belongsTo(Trabajo::class);
    }

    /**
     * Relación con el estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Relación con el contenido
     */
    public function contenido(): BelongsTo
    {
        return $this->belongsTo(Contenido::class);
    }

    /**
     * Relación con la alerta generada
     */
    public function alerta(): HasOne
    {
        return $this->hasOne(StudentAlert::class, 'id', 'alerta_id');
    }

    /**
     * Relación con la sugerencia generada
     */
    public function sugerencia(): HasOne
    {
        return $this->hasOne(StudentHint::class, 'id', 'sugerencia_id');
    }

    /**
     * Detectar si hay riesgo basado en métricas
     */
    public function evaluarRiesgo(): string
    {
        $riesgo = 'bajo';

        // Criterios para detectar riesgo
        if ($this->score_riesgo >= 0.75) {
            $riesgo = 'critico';
        } elseif ($this->score_riesgo >= 0.5) {
            $riesgo = 'alto';
        } elseif ($this->score_riesgo >= 0.3) {
            $riesgo = 'medio';
        }

        // Actualizar el modelo con el nivel de riesgo
        $this->nivel_riesgo = $riesgo;

        return $riesgo;
    }

    /**
     * Obtener resumen de la sesión de trabajo
     */
    public function obtenerResumenSesion(): array
    {
        return [
            'trabajo_id' => $this->trabajo_id,
            'estudiante_id' => $this->estudiante_id,
            'evento' => $this->evento,
            'duracion_evento' => $this->duracion_evento,
            'tiempo_acumulado' => $this->tiempo_total_acumulado,
            'progreso' => $this->progreso_estimado,
            'velocidad' => $this->velocidad_respuesta,
            'correcciones' => $this->num_correcciones,
            'consultas' => $this->num_consultas,
            'nivel_riesgo' => $this->nivel_riesgo,
            'score_riesgo' => $this->score_riesgo,
            'alerta_generada' => $this->alerta_generada,
            'tipo_intervencion' => $this->tipo_intervencion,
        ];
    }

    /**
     * Determinar si debe generarse una alerta
     */
    public function debeGenerarseAlerta(): bool
    {
        // Criterios para generar alerta
        if ($this->nivel_riesgo === 'critico' || $this->nivel_riesgo === 'alto') {
            return true;
        }

        if ($this->evento === 'abandono') {
            return true;
        }

        if ($this->progreso_estimado !== null && $this->progreso_estimado < 10 && $this->tiempo_total_acumulado > 600) {
            return true; // Poco progreso después de 10 minutos
        }

        return false;
    }

    /**
     * Obtener el tipo de intervención recomendada
     */
    public function obtenerTipoIntervencion(): string
    {
        if ($this->debeGenerarseAlerta()) {
            if (count($this->errores_detectados ?? []) > 2) {
                return 'hint';
            } else {
                return 'encouragement';
            }
        }

        if ($this->num_consultas > 3) {
            return 'resource';
        }

        return 'none';
    }
}
