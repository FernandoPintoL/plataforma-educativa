<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * EducationalResource Model
 *
 * Representa un recurso educativo disponible para recomendar a estudiantes.
 * Los recursos pueden ser videos, artículos, ejercicios, etc.
 *
 * @property int $id
 * @property string $title (Título del recurso)
 * @property string $description (Descripción detallada)
 * @property string $type (video, article, exercise, book, etc)
 * @property string $subject (Matemáticas, Ciencias, etc)
 * @property string $difficulty (beginner, intermediate, advanced)
 * @property string|null $risk_level (LOW, MEDIUM, HIGH - para qué nivel de riesgo es útil)
 * @property string|null $url (Enlace al recurso)
 * @property int|null $duration_minutes (Duración si aplica)
 * @property float|null $rating (Calificación 1-5)
 * @property int $uses_count (Cuántas veces ha sido recomendado)
 * @property string|null $provider (Khan Academy, YouTube, etc)
 * @property bool $active (¿Está disponible para recomendar?)
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class EducationalResource extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla
     */
    protected $table = 'educational_resources';

    /**
     * Atributos asignables en masa
     */
    protected $fillable = [
        'title',
        'description',
        'type',
        'subject',
        'difficulty',
        'risk_level',
        'url',
        'duration_minutes',
        'rating',
        'uses_count',
        'provider',
        'active',
    ];

    /**
     * Casteos de atributos
     */
    protected $casts = [
        'uses_count' => 'integer',
        'duration_minutes' => 'integer',
        'rating' => 'float',
        'active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación: Recomendaciones que usan este recurso
     */
    public function recommendations(): HasMany
    {
        return $this->hasMany(StudentRecommendation::class);
    }

    /**
     * Scope: Recursos activos
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope: Por tipo
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope: Por materia
     */
    public function scopeBySubject($query, $subject)
    {
        return $query->where('subject', $subject);
    }

    /**
     * Scope: Por dificultad
     */
    public function scopeByDifficulty($query, $difficulty)
    {
        return $query->where('difficulty', $difficulty);
    }

    /**
     * Scope: Por nivel de riesgo
     */
    public function scopeByRiskLevel($query, $riskLevel)
    {
        return $query->where('risk_level', $riskLevel);
    }

    /**
     * Scope: Más usados
     */
    public function scopeMostUsed($query)
    {
        return $query->orderBy('uses_count', 'desc');
    }

    /**
     * Scope: Mejor calificados
     */
    public function scopeHighestRated($query)
    {
        return $query->whereNotNull('rating')
            ->orderBy('rating', 'desc');
    }

    /**
     * Scope: Por proveedor
     */
    public function scopeByProvider($query, $provider)
    {
        return $query->where('provider', $provider);
    }

    /**
     * Incrementar contador de usos
     */
    public function incrementUsage(): void
    {
        $this->increment('uses_count');
    }

    /**
     * Obtener label del tipo
     */
    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'video' => 'Video',
            'article' => 'Artículo',
            'exercise' => 'Ejercicio',
            'book' => 'Libro',
            'podcast' => 'Podcast',
            'interactive' => 'Interactivo',
            default => 'Otro',
        };
    }

    /**
     * Obtener label de dificultad
     */
    public function getDifficultyLabelAttribute(): string
    {
        return match ($this->difficulty) {
            'beginner' => 'Principiante',
            'intermediate' => 'Intermedio',
            'advanced' => 'Avanzado',
            default => 'Desconocida',
        };
    }

    /**
     * Obtener label de nivel de riesgo
     */
    public function getRiskLevelLabelAttribute(): ?string
    {
        if ($this->risk_level === null) {
            return null;
        }

        return match ($this->risk_level) {
            'LOW' => 'Bajo',
            'MEDIUM' => 'Medio',
            'HIGH' => 'Alto',
            default => 'Desconocido',
        };
    }

    /**
     * Obtener calificación formateada
     */
    public function getFormattedRatingAttribute(): string
    {
        if ($this->rating === null) {
            return 'Sin calificación';
        }
        return "{$this->rating}/5.0";
    }

    /**
     * ¿Tiene enlace URL?
     */
    public function hasUrl(): bool
    {
        return !empty($this->url);
    }

    /**
     * ¿Tiene duración?
     */
    public function hasDuration(): bool
    {
        return $this->duration_minutes !== null;
    }

    /**
     * ¿Tiene calificación?
     */
    public function hasRating(): bool
    {
        return $this->rating !== null;
    }

    /**
     * Obtener duración formateada
     */
    public function getFormattedDurationAttribute(): ?string
    {
        if ($this->duration_minutes === null) {
            return null;
        }

        $hours = (int) ($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;

        if ($hours > 0) {
            return "{$hours}h {$minutes}m";
        }

        return "{$minutes}m";
    }
}
