<?php
namespace App\Models;

use App\Models\Abstracts\Contenido;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tarea extends Contenido
{
    use HasFactory;

    protected $fillable = [
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
        $trabajos          = $this->trabajos()->get();
        $total_estudiantes = $this->contenido->curso->estudiantes()->count();

        return [
            'total_estudiantes'    => $total_estudiantes,
            'trabajos_entregados'  => $trabajos->where('estado', 'entregado')->count(),
            'trabajos_calificados' => $trabajos->where('estado', 'calificado')->count(),
            'promedio_puntaje'     => $trabajos->whereHas('calificacion')->avg('calificacion.puntaje') ?? 0,
            'porcentaje_entrega'   => $total_estudiantes > 0 ? ($trabajos->where('estado', 'entregado')->count() / $total_estudiantes) * 100 : 0,
        ];
    }
}
