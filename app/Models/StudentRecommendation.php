<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * StudentRecommendation Model
 *
 * Representa una recomendación educativa personalizada generada
 * por el Agente Inteligente para un estudiante específico.
 *
 * Las recomendaciones se generan basándose en:
 * - Datos académicos (calificaciones, trabajos, etc)
 * - Predicciones ML (riesgo, carrera, tendencia, progreso)
 * - Análisis del Agente usando Groq API
 *
 * @property int $id
 * @property int $student_id
 * @property int|null $educational_resource_id
 * @property string $recommendation_type (tutoring, intervention, enrichment)
 * @property string $urgency (immediate, normal, preventive)
 * @property string|null $subject (Matemáticas, Ciencias, etc)
 * @property string|null $reason (Razón detallada de la recomendación)
 * @property float|null $risk_score (0-1)
 * @property string|null $risk_level (LOW, MEDIUM, HIGH)
 * @property bool $accepted (¿Fue aceptada por el estudiante?)
 * @property bool $completed (¿Fue completada?)
 * @property float|null $effectiveness_rating (1-5)
 * @property \Carbon\Carbon|null $completed_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class StudentRecommendation extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla
     */
    protected $table = 'student_recommendations';

    /**
     * Atributos asignables en masa
     */
    protected $fillable = [
        'student_id',
        'educational_resource_id',
        'recommendation_type',
        'urgency',
        'subject',
        'reason',
        'risk_score',
        'risk_level',
        'accepted',
        'completed',
        'effectiveness_rating',
        'completed_at',
    ];

    /**
     * Casteos de atributos
     */
    protected $casts = [
        'student_id' => 'integer',
        'educational_resource_id' => 'integer',
        'risk_score' => 'float',
        'accepted' => 'boolean',
        'completed' => 'boolean',
        'effectiveness_rating' => 'float',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación: Pertenece a un estudiante
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Relación: Pertenece a un recurso educativo
     */
    public function educationalResource(): BelongsTo
    {
        return $this->belongsTo(EducationalResource::class);
    }

    /**
     * Scope: Recomendaciones activas (no completadas)
     */
    public function scopeActive($query)
    {
        return $query->where('completed', false);
    }

    /**
     * Scope: Recomendaciones completadas
     */
    public function scopeCompleted($query)
    {
        return $query->where('completed', true);
    }

    /**
     * Scope: Recomendaciones aceptadas
     */
    public function scopeAccepted($query)
    {
        return $query->where('accepted', true);
    }

    /**
     * Scope: Recomendaciones de alto riesgo
     */
    public function scopeHighRisk($query)
    {
        return $query->where('risk_level', 'HIGH');
    }

    /**
     * Scope: Recomendaciones urgentes
     */
    public function scopeUrgent($query)
    {
        return $query->where('urgency', 'immediate');
    }

    /**
     * Scope: Por estudiante
     */
    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    /**
     * Scope: Por tipo de recomendación
     */
    public function scopeByType($query, $type)
    {
        return $query->where('recommendation_type', $type);
    }

    /**
     * Scope: Por materia
     */
    public function scopeBySubject($query, $subject)
    {
        return $query->where('subject', $subject);
    }

    /**
     * Scope: Ordenadas por fecha
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Obtener el estado de la recomendación (string)
     */
    public function getStatusAttribute(): string
    {
        if ($this->completed) {
            return 'completed';
        } elseif ($this->accepted) {
            return 'accepted';
        }
        return 'pending';
    }

    /**
     * Obtener label de urgencia
     */
    public function getUrgencyLabelAttribute(): string
    {
        return match ($this->urgency) {
            'immediate' => 'Inmediata',
            'normal' => 'Normal',
            'preventive' => 'Preventiva',
            default => 'Desconocida',
        };
    }

    /**
     * Obtener label de tipo
     */
    public function getTypeLabelAttribute(): string
    {
        return match ($this->recommendation_type) {
            'tutoring' => 'Tutoría',
            'intervention' => 'Intervención',
            'enrichment' => 'Enriquecimiento',
            default => 'Otro',
        };
    }

    /**
     * Obtener label de nivel de riesgo
     */
    public function getRiskLevelLabelAttribute(): string
    {
        return match ($this->risk_level) {
            'LOW' => 'Bajo',
            'MEDIUM' => 'Medio',
            'HIGH' => 'Alto',
            default => 'Desconocido',
        };
    }

    /**
     * Obtener porcentaje de efectividad
     */
    public function getEffectivenessPercentAttribute(): ?int
    {
        if ($this->effectiveness_rating === null) {
            return null;
        }
        return (int) (($this->effectiveness_rating / 5) * 100);
    }
}
