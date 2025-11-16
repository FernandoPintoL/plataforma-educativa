<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrediccionTendencia extends Model
{
    protected $table = 'predicciones_tendencia';

    protected $fillable = [
        'estudiante_id',
        'tendencia',
        'confianza',
        'fecha_prediccion',
        'modelo_version',
        'fk_curso_id',
    ];

    protected $casts = [
        'fecha_prediccion' => 'datetime',
        'confianza' => 'float',
    ];

    /**
     * Relación con Estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Relación con Curso
     */
    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class, 'fk_curso_id');
    }

    /**
     * Obtener etiqueta de tendencia
     */
    public function getTendenciaLabelAttribute(): string
    {
        return match ($this->tendencia) {
            'mejorando' => 'Mejorando',
            'estable' => 'Estable',
            'declinando' => 'Declinando',
            'fluctuando' => 'Fluctuando',
            default => 'Desconocida',
        };
    }

    /**
     * Obtener color para visualización
     */
    public function getColorAttribute(): string
    {
        return match ($this->tendencia) {
            'mejorando' => 'green',
            'estable' => 'blue',
            'declinando' => 'red',
            'fluctuando' => 'yellow',
            default => 'gray',
        };
    }

    /**
     * Obtener ícono
     */
    public function getIconoAttribute(): string
    {
        return match ($this->tendencia) {
            'mejorando' => 'TrendingUp',
            'estable' => 'Minus',
            'declinando' => 'TrendingDown',
            'fluctuando' => 'Zap',
            default => 'Help',
        };
    }

    /**
     * Scope: Por tendencia
     */
    public function scopeByTendencia($query, string $tendencia)
    {
        return $query->where('tendencia', $tendencia);
    }

    /**
     * Scope: Por curso
     */
    public function scopeByCurso($query, int $cursoId)
    {
        return $query->where('fk_curso_id', $cursoId);
    }

    /**
     * Scope: Predicciones recientes
     */
    public function scopeRecientes($query, int $dias = 30)
    {
        return $query->where('fecha_prediccion', '>=', now()->subDays($dias));
    }
}
