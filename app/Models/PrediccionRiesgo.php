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
        'risk_score',
        'risk_level',
        'confidence_score',
        'fecha_prediccion',
        'modelo_version',
        'modelo_tipo',
        'features_used',
        'creado_por',
        'observaciones',
    ];

    protected $casts = [
        'features_used' => AsCollection::class,
        'fecha_prediccion' => 'datetime',
        'risk_score' => 'float',
        'confidence_score' => 'float',
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
     * Note: Not available until fk_curso_id column is added
     */
    // public function curso(): BelongsTo
    // {
    //     return $this->belongsTo(Curso::class, 'fk_curso_id');
    // }

    /**
     * Obtener etiqueta de nivel de riesgo
     */
    public function getNivelRiesgoLabelAttribute(): string
    {
        return match ($this->risk_level) {
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
        return match ($this->risk_level) {
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
        return match ($this->risk_level) {
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
        return $query->where('risk_level', $nivel);
    }

    /**
     * Scope: Filtrar por curso
     * Note: PrediccionRiesgo table doesn't have fk_curso_id column yet
     */
    public function scopeByCurso($query, int $cursoId)
    {
        // TODO: Implement when fk_curso_id is added to predicciones_riesgo table
        return $query;
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
        return $query->where('risk_score', '>=', $threshold);
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
            ->get(['fecha_prediccion', 'risk_score', 'risk_level']);
    }
}
