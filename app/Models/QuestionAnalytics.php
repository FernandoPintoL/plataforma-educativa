<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionAnalytics extends Model
{
    use HasFactory;

    protected $table = 'question_analytics';

    protected $fillable = [
        'question_id',
        'evaluacion_id',
        'veces_respondida',
        'veces_correcta',
        'veces_incorrecta',
        'tasa_acierto',
        'indice_discriminacion',
        'tiempo_promedio_respuesta',
        'distribucion_respuestas',
        'rendimiento_por_cluster',
        'reportes_incorrecta',
        'comentarios_profesor',
    ];

    protected $casts = [
        'tasa_acierto' => 'decimal:2',
        'indice_discriminacion' => 'decimal:2',
        'tiempo_promedio_respuesta' => 'decimal:2',
        'distribucion_respuestas' => 'array',
        'rendimiento_por_cluster' => 'array',
    ];

    /**
     * Relación con la pregunta del banco
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(QuestionBank::class, 'question_id');
    }

    /**
     * Relación con la evaluación
     */
    public function evaluacion(): BelongsTo
    {
        return $this->belongsTo(Evaluacion::class);
    }

    /**
     * Calcular la tasa de acierto
     */
    public function calcularTasaAcierto(): float
    {
        if ($this->veces_respondida === 0) {
            return 0;
        }

        return round(($this->veces_correcta / $this->veces_respondida) * 100, 2);
    }

    /**
     * Obtener rendimiento por cluster
     */
    public function getRendimientoPorCluster(): array
    {
        return $this->rendimiento_por_cluster ?? [];
    }

    /**
     * Obtener distribución de respuestas
     */
    public function getDistribucionRespuestas(): array
    {
        return $this->distribucion_respuestas ?? [];
    }

    /**
     * Determinar si la pregunta necesita revisión (bajo discriminación)
     */
    public function necesitaRevision(): bool
    {
        return $this->indice_discriminacion !== null && $this->indice_discriminacion < 0.15;
    }

    /**
     * Determinar si la pregunta es de alta calidad
     */
    public function esAltaCalidad(): bool
    {
        return $this->indice_discriminacion !== null && $this->indice_discriminacion > 0.30;
    }
}
