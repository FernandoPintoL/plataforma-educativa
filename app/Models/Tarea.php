<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tarea extends Model
{
    use HasFactory;

    protected $fillable = [
        'contenido_id',
        'instrucciones',
        'puntuacion',
        'permite_archivos',
        'max_archivos',
        'tipo_archivo_permitido',
    ];

    protected $casts = [
        'permite_archivos' => 'boolean',
    ];

    /**
     * Relación con el contenido
     */
    public function contenido(): BelongsTo
    {
        return $this->belongsTo(Contenido::class);
    }

    /**
     * Relación con el curso a través del contenido
     */
    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class, 'curso_id', 'id')
                    ->through('contenido');
    }

    /**
     * Asignar la tarea a un estudiante
     */
    public function asignarAEstudiante(User $estudiante): void
    {
        // Crear un trabajo para el estudiante
        Trabajo::create([
            'contenido_id' => $this->contenido_id,
            'estudiante_id' => $estudiante->id,
            'estado' => 'en_progreso',
            'fecha_inicio' => now(),
        ]);
    }

    /**
     * Verificar si permite archivos
     */
    public function permiteArchivos(): bool
    {
        return $this->permite_archivos;
    }

    /**
     * Obtener tipos de archivo permitidos
     */
    public function getTiposArchivoPermitidos(): array
    {
        return $this->tipo_archivo_permitido 
            ? explode(',', $this->tipo_archivo_permitido)
            : [];
    }

    /**
     * Verificar si un tipo de archivo es permitido
     */
    public function esTipoArchivoPermitido(string $tipo): bool
    {
        $tiposPermitidos = $this->getTiposArchivoPermitidos();
        return empty($tiposPermitidos) || in_array($tipo, $tiposPermitidos);
    }

    /**
     * Obtener trabajos de la tarea
     */
    public function trabajos()
    {
        return $this->contenido->trabajos();
    }

    /**
     * Obtener estadísticas de la tarea
     */
    public function obtenerEstadisticas(): array
    {
        $trabajos = $this->trabajos()->get();
        $total_estudiantes = $this->contenido->curso->estudiantes()->count();
        
        return [
            'total_estudiantes' => $total_estudiantes,
            'trabajos_entregados' => $trabajos->where('estado', 'entregado')->count(),
            'trabajos_calificados' => $trabajos->where('estado', 'calificado')->count(),
            'promedio_puntaje' => $trabajos->whereHas('calificacion')->avg('calificacion.puntaje') ?? 0,
            'porcentaje_entrega' => $total_estudiantes > 0 ? ($trabajos->where('estado', 'entregado')->count() / $total_estudiantes) * 100 : 0,
        ];
    }
}
