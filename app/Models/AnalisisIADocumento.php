<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalisisIADocumento extends Model
{
    use HasFactory;

    protected $table = 'analisis_ia_documentos';

    protected $fillable = [
        'calificacion_id',
        'trabajo_id',
        'porcentaje_ia',
        'detalles_analisis',
        'estado',
        'mensaje_error',
        'fecha_analisis',
    ];

    protected $casts = [
        'detalles_analisis' => 'array',
        'fecha_analisis' => 'datetime',
    ];

    /**
     * Relación con calificación
     */
    public function calificacion(): BelongsTo
    {
        return $this->belongsTo(Calificacion::class);
    }

    /**
     * Relación con trabajo
     */
    public function trabajo(): BelongsTo
    {
        return $this->belongsTo(Trabajo::class);
    }

    /**
     * Determinar si el análisis sospecha contenido de IA
     */
    public function tieneContenidoIA(): bool
    {
        return $this->porcentaje_ia >= 50;
    }

    /**
     * Obtener descripción del nivel de IA detectado
     */
    public function obtenerNivelDeteccion(): string
    {
        if ($this->porcentaje_ia >= 80) {
            return 'Alto riesgo de contenido generado por IA';
        }

        if ($this->porcentaje_ia >= 50) {
            return 'Posible contenido generado por IA';
        }

        if ($this->porcentaje_ia >= 20) {
            return 'Algo de similitud con patrones de IA';
        }

        return 'Parece contenido original';
    }

    /**
     * Obtener color para mostrar en UI
     */
    public function obtenerColor(): string
    {
        if ($this->porcentaje_ia >= 80) {
            return 'red';
        }

        if ($this->porcentaje_ia >= 50) {
            return 'orange';
        }

        if ($this->porcentaje_ia >= 20) {
            return 'yellow';
        }

        return 'green';
    }
}
