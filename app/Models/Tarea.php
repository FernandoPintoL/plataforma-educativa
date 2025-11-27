<?php
namespace App\Models;

use App\Models\Abstracts\Contenido;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tarea extends Contenido
{
    use HasFactory;

    protected $table = 'tareas';

    protected $fillable = [
        'contenido_id',
        'instrucciones',
        'puntuacion',
        'permite_archivos',
        'max_archivos',
        'tipo_archivo_permitido',
        'fecha_limite',
    ];

    protected $casts = [
        'permite_archivos' => 'boolean',
        'fecha_limite'     => 'datetime',
    ];

    /**
     * Relación con el contenido padre (clase concreta, no abstracta)
     */
    public function contenido(): BelongsTo
    {
        return $this->belongsTo('App\Models\Contenido', 'contenido_id', 'id');
    }

    public function publicar(): void
    {
        $this->update(['estado' => 'publicado']);
    }

    public function modificar(): void
    {
        $this->save();
    }

    public function eliminar(): void
    {
        $this->delete();
    }

    /**
     * Asignar la tarea a un estudiante
     */
    public function asignar(Estudiante $estudiante): void
    {
        Trabajo::create([
            'contenido_id'  => $this->contenido_id,
            'estudiante_id' => $estudiante->id,
            'estado'        => 'en_progreso',
            'fecha_inicio'  => now(),
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
        return $this->hasMany(Trabajo::class, 'contenido_id', 'contenido_id');
    }

    /**
     * Obtener estadísticas de la tarea
     */
    public function obtenerEstadisticas(): array
    {
        $trabajos          = $this->trabajos()->with('calificacion')->get();
        $total_estudiantes = $this->contenido->curso->estudiantes()->count();

        // Calcular promedio de puntajes de trabajos calificados
        $trabajosCalificados = $trabajos->filter(function($trabajo) {
            return $trabajo->calificacion !== null;
        });

        $promedio_puntaje = $trabajosCalificados->isNotEmpty()
            ? $trabajosCalificados->avg('calificacion.puntaje')
            : 0;

        return [
            'total_estudiantes'    => $total_estudiantes,
            'trabajos_entregados'  => $trabajos->where('estado', 'entregado')->count(),
            'trabajos_calificados' => $trabajos->where('estado', 'calificado')->count(),
            'promedio_puntaje'     => $promedio_puntaje,
            'porcentaje_entrega'   => $total_estudiantes > 0 ? ($trabajos->where('estado', 'entregado')->count() / $total_estudiantes) * 100 : 0,
        ];
    }
}
