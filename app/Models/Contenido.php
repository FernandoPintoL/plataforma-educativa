<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Contenido extends Model
{
    use HasFactory;

    protected $table = 'contenidos';

    protected $fillable = [
        'titulo',
        'descripcion',
        'fecha_creacion',
        'fecha_limite',
        'creador_id',
        'curso_id',
        'tipo',
        'estado',
    ];

    protected $casts = [
        'fecha_creacion' => 'date',
        'fecha_limite' => 'date',
    ];

    /**
     * Relación con el creador del contenido
     */
    public function creador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creador_id');
    }

    /**
     * Relación con el curso
     */
    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class);
    }

    /**
     * Relación con los trabajos entregados
     */
    public function trabajos(): HasMany
    {
        return $this->hasMany(Trabajo::class);
    }

    /**
     * Relación con los recursos asociados
     */
    public function recursos(): BelongsToMany
    {
        return $this->belongsToMany(Recurso::class, 'contenido_recurso');
    }

    /**
     * Relación polimórfica con tarea o evaluación
     */
    public function contenidoDetalle(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Publicar el contenido
     */
    public function publicar(): void
    {
        $this->update(['estado' => 'publicado']);
    }

    /**
     * Finalizar el contenido
     */
    public function finalizar(): void
    {
        $this->update(['estado' => 'finalizado']);
    }

    /**
     * Verificar si el contenido está publicado
     */
    public function estaPublicado(): bool
    {
        return $this->estado === 'publicado';
    }

    /**
     * Verificar si el contenido está finalizado
     */
    public function estaFinalizado(): bool
    {
        return $this->estado === 'finalizado';
    }

    /**
     * Verificar si el contenido ha expirado
     */
    public function haExpirado(): bool
    {
        return $this->fecha_limite && $this->fecha_limite->isPast();
    }

    /**
     * Obtener trabajos de un estudiante específico
     */
    public function trabajosDelEstudiante(User $estudiante): HasMany
    {
        return $this->trabajos()->where('estudiante_id', $estudiante->id);
    }

    /**
     * Obtener estadísticas del contenido
     */
    public function obtenerEstadisticas(): array
    {
        $total_estudiantes = $this->curso->estudiantes()->count();
        $trabajos_entregados = $this->trabajos()->where('estado', 'entregado')->count();
        $trabajos_calificados = $this->trabajos()->whereHas('calificacion')->count();

        return [
            'total_estudiantes' => $total_estudiantes,
            'trabajos_entregados' => $trabajos_entregados,
            'trabajos_calificados' => $trabajos_calificados,
            'porcentaje_entrega' => $total_estudiantes > 0 ? ($trabajos_entregados / $total_estudiantes) * 100 : 0,
            'porcentaje_calificacion' => $trabajos_entregados > 0 ? ($trabajos_calificados / $trabajos_entregados) * 100 : 0,
        ];
    }
}
