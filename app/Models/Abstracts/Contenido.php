<?php

namespace App\Models\Abstracts;

use App\Models\Curso;
use App\Models\Profesor;
use App\Models\Recurso;
use App\Models\Trabajo;
use Illuminate\Database\Eloquent\Model;

abstract class Contenido extends Model
{
    protected $fillable = [
        'titulo',
        'descripcion',
        'fecha_creacion',
        'fecha_limite',
        'profesor_id',
        'curso_id',
        'estado',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_limite' => 'datetime',
    ];

    /**
     * Publicar el contenido
     */
    abstract public function publicar(): void;

    /**
     * Modificar el contenido
     */
    abstract public function modificar(): void;

    /**
     * Eliminar el contenido
     */
    abstract public function eliminar(): void;

    /**
     * Relación con el profesor creador
     */
    public function profesor()
    {
        return $this->belongsTo(Profesor::class);
    }

    /**
     * Relación con el curso al que pertenece
     */
    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }

    /**
     * Relación con los recursos asociados
     */
    public function recursos()
    {
        return $this->belongsToMany(Recurso::class, 'contenido_recurso');
    }

    /**
     * Relación con los trabajos de los estudiantes
     */
    public function trabajos()
    {
        return $this->hasMany(Trabajo::class);
    }

    /**
     * Verificar si el contenido está activo
     */
    public function estaActivo(): bool
    {
        return $this->estado === 'activo';
    }

    /**
     * Verificar si el contenido ha vencido
     */
    public function haVencido(): bool
    {
        return $this->fecha_limite < now();
    }
}
