<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\AsCollection;

class PrediccionCarrera extends Model
{
    protected $table = 'predicciones_carrera';

    protected $fillable = [
        'estudiante_id',
        'carrera_nombre',
        'compatibilidad',
        'ranking',
        'descripcion',
        'fecha_prediccion',
        'modelo_version',
    ];

    protected $casts = [
        'fecha_prediccion' => 'datetime',
        'compatibilidad' => 'float',
    ];

    /**
     * Relación con Estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Scope: Top 3 carreras por estudiante
     */
    public function scopeTop3($query, int $estudianteId)
    {
        return $query->where('estudiante_id', $estudianteId)
            ->whereIn('ranking', [1, 2, 3])
            ->orderBy('ranking');
    }

    /**
     * Scope: Por confiabilidad
     */
    public function scopeAltoCompatibilidad($query)
    {
        return $query->where('compatibilidad', '>=', 0.75);
    }

    /**
     * Obtener color basado en compatibilidad
     */
    public function getColorAttribute(): string
    {
        if ($this->compatibilidad >= 0.8) return 'green';
        if ($this->compatibilidad >= 0.6) return 'blue';
        if ($this->compatibilidad >= 0.4) return 'yellow';
        return 'gray';
    }
}
