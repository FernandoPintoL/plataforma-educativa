<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeedbackAnalysis extends Model
{
    use HasFactory;

    protected $table = 'feedback_analysis';

    protected $fillable = [
        'calificacion_id',
        'trabajo_id',
        'profesor_id',
        'feedback_analysis',
        'conceptos_identificados',
        'errores_comunes',
        'areas_mejora',
        'feedback_por_criterio',
        'estado',
        'feedback_final',
        'cambios_profesor',
        'confidence_score',
        'tiempo_generacion',
        'fecha_analisis',
        'fecha_aprobacion',
    ];

    protected $casts = [
        'conceptos_identificados' => 'array',
        'errores_comunes' => 'array',
        'areas_mejora' => 'array',
        'feedback_por_criterio' => 'array',
        'cambios_profesor' => 'array',
        'fecha_analisis' => 'datetime',
        'fecha_aprobacion' => 'datetime',
    ];

    /**
     * Relación con la calificación
     */
    public function calificacion(): BelongsTo
    {
        return $this->belongsTo(Calificacion::class);
    }

    /**
     * Relación con el trabajo
     */
    public function trabajo(): BelongsTo
    {
        return $this->belongsTo(Trabajo::class);
    }

    /**
     * Relación con el profesor
     */
    public function profesor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'profesor_id');
    }

    /**
     * Verificar si el feedback ha sido aprobado
     */
    public function estaAprobado(): bool
    {
        return $this->estado === 'aprobado';
    }

    /**
     * Obtener el feedback a mostrar al estudiante
     * Devuelve feedback_final si fue aprobado, sino el feedback_analysis
     */
    public function getFeedbackParaMostrar(): string
    {
        if ($this->estaAprobado() && $this->feedback_final) {
            return $this->feedback_final;
        }

        return $this->feedback_analysis ?? '';
    }

    /**
     * Marcar como aprobado por el profesor
     */
    public function aprobar(string $feedbackFinal = null): void
    {
        $this->update([
            'estado' => 'aprobado',
            'feedback_final' => $feedbackFinal ?? $this->feedback_analysis,
            'fecha_aprobacion' => now(),
        ]);
    }

    /**
     * Rechazar y solicitar regeneración
     */
    public function rechazar(): void
    {
        $this->update([
            'estado' => 'rechazado',
        ]);
    }

    /**
     * Obtener resumen del análisis para vista rápida
     */
    public function obtenerResumen(): array
    {
        return [
            'id' => $this->id,
            'estado' => $this->estado,
            'confidence_score' => $this->confidence_score,
            'conceptos' => count($this->conceptos_identificados ?? []),
            'errores' => count($this->errores_comunes ?? []),
            'areas_mejora' => count($this->areas_mejora ?? []),
            'tiempo_generacion_ms' => round($this->tiempo_generacion, 2),
            'fecha_analisis' => $this->fecha_analisis?->format('d/m/Y H:i'),
            'fecha_aprobacion' => $this->fecha_aprobacion?->format('d/m/Y H:i'),
        ];
    }
}
