<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\AsCollection;

class PrediccionRiesgo extends Model
{
    protected $table = 'predicciones_riesgo';

    protected $fillable = [
        'estudiante_id',
        'score_riesgo',
        'nivel_riesgo',
        'confianza',
        'fecha_prediccion',
        'modelo_version',
        'factores_influyentes',
        'observaciones',
        'fk_curso_id',
    ];

    protected $casts = [
        'factores_influyentes' => AsCollection::class,
        'fecha_prediccion' => 'datetime',
        'score_riesgo' => 'float',
        'confianza' => 'float',
    ];

    /**
     * Relación con Estudiante (User)
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
     * Obtener etiqueta de nivel de riesgo
     */
    public function getNivelRiesgoLabelAttribute(): string
    {
        return match ($this->nivel_riesgo) {
            'alto' => 'Riesgo Alto',
            'medio' => 'Riesgo Medio',
            'bajo' => 'Riesgo Bajo',
            default => 'Desconocido',
        };
    }

    /**
     * Obtener color para visualización
     */
    public function getColorAttribute(): string
    {
        return match ($this->nivel_riesgo) {
            'alto' => 'red',
            'medio' => 'yellow',
            'bajo' => 'green',
            default => 'gray',
        };
    }

    /**
     * Obtener descripción de estado
     */
    public function getDescripcionAttribute(): string
    {
        return match ($this->nivel_riesgo) {
            'alto' => 'Requiere intervención inmediata. Probabilidad alta de bajo rendimiento.',
            'medio' => 'Monitoreo cercano recomendado. Apoyo académico sugerido.',
            'bajo' => 'Desempeño académico estable. Continuar con apoyo regular.',
            default => 'Estado indeterminado. Requiere análisis adicional.',
        };
    }

    /**
     * Scope: Filtrar por nivel de riesgo
     */
    public function scopeByNivelRiesgo($query, string $nivel)
    {
        return $query->where('nivel_riesgo', $nivel);
    }

    /**
     * Scope: Filtrar por curso
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

    /**
     * Scope: Score mayor a umbral
     */
    public function scopeByScoreThreshold($query, float $threshold)
    {
        return $query->where('score_riesgo', '>=', $threshold);
    }

    /**
     * Obtener predicción más reciente por estudiante
     */
    public static function ultimaPrediccion(int $estudianteId)
    {
        return self::where('estudiante_id', $estudianteId)
            ->orderBy('fecha_prediccion', 'desc')
            ->first();
    }

    /**
     * Obtener histórico de predicciones
     */
    public function getHistoricoAttribute()
    {
        return self::where('estudiante_id', $this->estudiante_id)
            ->orderBy('fecha_prediccion', 'desc')
            ->limit(12)
            ->get(['fecha_prediccion', 'score_riesgo', 'nivel_riesgo']);
    }
}
