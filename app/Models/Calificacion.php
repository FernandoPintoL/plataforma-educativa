<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Calificacion extends Model
{
    use HasFactory;

    protected $table = 'calificaciones';

    protected $fillable = [
        'trabajo_id',
        'puntaje',
        'comentario',
        'fecha_calificacion',
        'evaluador_id',
        'criterios_evaluacion',
    ];

    protected $casts = [
        'fecha_calificacion' => 'datetime',
        'criterios_evaluacion' => 'array',
    ];

    /**
     * Relación con el trabajo
     */
    public function trabajo(): BelongsTo
    {
        return $this->belongsTo(Trabajo::class);
    }

    /**
     * Relación con el evaluador
     */
    public function evaluador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'evaluador_id');
    }

    /**
     * Relación con el estudiante a través del trabajo
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id', 'id')
            ->through('trabajo');
    }

    /**
     * Obtener calificación en letras
     */
    public function getCalificacionLetra(): string
    {
        if ($this->puntaje >= 90) {
            return 'A';
        }

        if ($this->puntaje >= 80) {
            return 'B';
        }

        if ($this->puntaje >= 70) {
            return 'C';
        }

        if ($this->puntaje >= 60) {
            return 'D';
        }

        return 'F';
    }

    /**
     * Verificar si está aprobado
     */
    public function estaAprobado(): bool
    {
        return $this->puntaje >= 60;
    }

    /**
     * Obtener descripción de la calificación
     */
    public function getDescripcionCalificacion(): string
    {
        if ($this->puntaje >= 90) {
            return 'Excelente';
        }

        if ($this->puntaje >= 80) {
            return 'Muy Bueno';
        }

        if ($this->puntaje >= 70) {
            return 'Bueno';
        }

        if ($this->puntaje >= 60) {
            return 'Satisfactorio';
        }

        return 'Necesita Mejorar';
    }

    /**
     * Obtener color de la calificación
     */
    public function getColorCalificacion(): string
    {
        if ($this->puntaje >= 80) {
            return 'green';
        }

        if ($this->puntaje >= 60) {
            return 'yellow';
        }

        return 'red';
    }

    /**
     * Obtener criterios de evaluación formateados
     */
    public function getCriteriosFormateados(): array
    {
        if (! $this->criterios_evaluacion) {
            return [];
        }

        $criterios = [];
        foreach ($this->criterios_evaluacion as $criterio => $puntaje) {
            $criterios[] = [
                'criterio' => $criterio,
                'puntaje' => $puntaje,
                'maximo' => $this->obtenerPuntajeMaximoCriterio($criterio),
            ];
        }

        return $criterios;
    }

    /**
     * Obtener puntaje máximo de un criterio específico
     */
    private function obtenerPuntajeMaximoCriterio(string $criterio): int
    {
        // Implementar lógica para obtener el puntaje máximo del criterio
        // Por ahora, retornar un valor por defecto
        return 10;
    }

    /**
     * Obtener resumen de la calificación
     */
    public function obtenerResumen(): array
    {
        return [
            'puntaje' => $this->puntaje,
            'letra' => $this->getCalificacionLetra(),
            'descripcion' => $this->getDescripcionCalificacion(),
            'aprobado' => $this->estaAprobado(),
            'color' => $this->getColorCalificacion(),
            'fecha' => $this->fecha_calificacion->format('d/m/Y H:i'),
            'evaluador' => $this->evaluador->nombre_completo,
        ];
    }
}
