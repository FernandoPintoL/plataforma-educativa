<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Curso extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'profesor_id',
        'codigo',
        'estado',
        'fecha_inicio',
        'fecha_fin',
        'capacidad_maxima',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    /**
     * Relación con el profesor que imparte el curso
     */
    public function profesor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'profesor_id');
    }

    /**
     * Relación con los estudiantes inscritos
     */
    public function estudiantes(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'curso_estudiante', 'curso_id', 'estudiante_id')
                    ->withPivot(['fecha_inscripcion', 'estado'])
                    ->withTimestamps();
    }

    /**
     * Relación con los contenidos del curso
     */
    public function contenidos(): HasMany
    {
        return $this->hasMany(Contenido::class);
    }

    /**
     * Relación con las tareas del curso
     */
    public function tareas(): HasMany
    {
        return $this->hasMany(Tarea::class);
    }

    /**
     * Relación con las evaluaciones del curso
     */
    public function evaluaciones(): HasMany
    {
        return $this->hasMany(Evaluacion::class);
    }

    /**
     * Inscribir un estudiante al curso
     */
    public function inscribirEstudiante(User $estudiante): void
    {
        $this->estudiantes()->attach($estudiante->id, [
            'fecha_inscripcion' => now(),
            'estado' => 'activo'
        ]);
    }

    /**
     * Desinscribir un estudiante del curso
     */
    public function desinscribirEstudiante(User $estudiante): void
    {
        $this->estudiantes()->updateExistingPivot($estudiante->id, [
            'estado' => 'inactivo'
        ]);
    }

    /**
     * Verificar si un estudiante está inscrito
     */
    public function tieneEstudiante(User $estudiante): bool
    {
        return $this->estudiantes()->where('estudiante_id', $estudiante->id)->exists();
    }

    /**
     * Generar reporte de rendimiento del curso
     */
    public function generarReporteRendimiento(): array
    {
        $estudiantes = $this->estudiantes()->with('trabajos.calificacion')->get();
        
        $reporte = [
            'curso' => $this->nombre,
            'total_estudiantes' => $estudiantes->count(),
            'promedio_general' => 0,
            'estudiantes' => []
        ];

        $suma_promedios = 0;
        $estudiantes_con_calificaciones = 0;

        foreach ($estudiantes as $estudiante) {
            $calificaciones = $estudiante->trabajos->pluck('calificacion.puntaje')->filter();
            $promedio = $calificaciones->avg();
            
            if ($promedio !== null) {
                $suma_promedios += $promedio;
                $estudiantes_con_calificaciones++;
            }

            $reporte['estudiantes'][] = [
                'estudiante' => $estudiante->nombre_completo,
                'promedio' => $promedio ?? 0,
                'total_trabajos' => $estudiante->trabajos->count(),
                'trabajos_entregados' => $estudiante->trabajos->where('estado', 'entregado')->count()
            ];
        }

        $reporte['promedio_general'] = $estudiantes_con_calificaciones > 0 
            ? $suma_promedios / $estudiantes_con_calificaciones 
            : 0;

        return $reporte;
    }
}
