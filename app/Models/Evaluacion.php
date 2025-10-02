<?php
namespace App\Models;

use App\Models\Abstracts\Contenido;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Evaluacion extends Contenido
{
    use HasFactory;

    protected $table = 'evaluaciones';

    protected $fillable = [
        'tipo_evaluacion',
        'puntuacion_total',
        'tiempo_limite',
        'calificacion_automatica',
        'mostrar_respuestas',
        'permite_reintento',
        'max_reintentos',
    ];

    protected $casts = [
        'calificacion_automatica' => 'boolean',
        'mostrar_respuestas'      => 'boolean',
        'permite_reintento'       => 'boolean',
        'tiempo_limite'           => 'integer',
    ];

    public function publicar(): void
    {
        if ($this->preguntas()->count() > 0) {
            $this->update(['estado' => 'publicado']);
        }
    }

    public function modificar(): void
    {
        $this->save();
    }

    public function eliminar(): void
    {
        $this->preguntas()->delete();
        $this->delete();
    }

    /**
     * Relación con las preguntas
     */
    public function preguntas(): HasMany
    {
        return $this->hasMany(Pregunta::class);
    }

    public function curso()
    {
        // La evaluación extiende de Contenido, que ya tiene la relación curso
        return parent::curso();
    }

    /**
     * Calificar automáticamente una evaluación
     */
    public function calificarAutomaticamente(Trabajo $trabajo): void
    {
        if (! $this->calificacion_automatica) {
            return;
        }

        $puntajeTotal = 0;
        $respuestas   = $trabajo->respuestas ?? [];

        foreach ($this->preguntas as $pregunta) {
            $respuestaEstudiante = $respuestas[$pregunta->id] ?? null;

            if ($respuestaEstudiante && $pregunta->validarRespuesta($respuestaEstudiante)) {
                $puntajeTotal += $pregunta->puntos;
            }
        }

        // Crear calificación
        Calificacion::create([
            'trabajo_id'         => $trabajo->id,
            'puntaje'            => $puntajeTotal,
            'comentario'         => 'Calificación automática',
            'fecha_calificacion' => now(),
            'evaluador_id'       => $this->contenido->creador_id,
        ]);

        $trabajo->update(['estado' => 'calificado']);
    }

    /**
     * Verificar si permite reintentos
     */
    public function permiteReintentos(): bool
    {
        return $this->permite_reintento;
    }

    /**
     * Verificar si un estudiante puede reintentar
     */
    public function puedeReintentar(User $estudiante): bool
    {
        if (! $this->permite_reintentos()) {
            return false;
        }

        $trabajosAnteriores = $this->contenido->trabajos()
            ->where('estudiante_id', $estudiante->id)
            ->count();

        return $trabajosAnteriores < $this->max_reintentos;
    }

    /**
     * Obtener tiempo límite en formato legible
     */
    public function getTiempoLimiteFormateado(): string
    {
        if (! $this->tiempo_limite) {
            return 'Sin límite de tiempo';
        }

        $horas   = floor($this->tiempo_limite / 60);
        $minutos = $this->tiempo_limite % 60;

        if ($horas > 0) {
            return "{$horas}h {$minutos}m";
        }

        return "{$minutos} minutos";
    }

    /**
     * Obtener estadísticas de la evaluación
     */
    public function obtenerEstadisticas(): array
    {
        $trabajos          = $this->contenido->trabajos()->get();
        $total_estudiantes = $this->contenido->curso->estudiantes()->count();

        $calificaciones = $trabajos->whereHas('calificacion')->pluck('calificacion.puntaje');

        return [
            'total_estudiantes'     => $total_estudiantes,
            'trabajos_entregados'   => $trabajos->where('estado', 'entregado')->count(),
            'trabajos_calificados'  => $trabajos->where('estado', 'calificado')->count(),
            'promedio_puntaje'      => $calificaciones->avg() ?? 0,
            'puntaje_maximo'        => $calificaciones->max() ?? 0,
            'puntaje_minimo'        => $calificaciones->min() ?? 0,
            'porcentaje_aprobacion' => $calificaciones->where('>=', $this->puntuacion_total * 0.6)->count() / max($calificaciones->count(), 1) * 100,
        ];
    }
}
