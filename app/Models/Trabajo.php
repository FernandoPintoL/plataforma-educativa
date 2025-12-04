<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Trabajo extends Model
{
    use HasFactory;

    protected $table = 'trabajos';

    protected $fillable = [
        'contenido_id',
        'estudiante_id',
        'respuestas',
        'comentarios',
        'estado',
        'fecha_entrega',
        'fecha_inicio',
        'tiempo_total',
        'intentos',
        'consultas_material',
    ];

    protected $casts = [
        'respuestas'    => 'array',
        'fecha_entrega' => 'datetime',
        'fecha_inicio'  => 'datetime',
    ];

    /**
     * Relación con el contenido
     */
    public function contenido(): BelongsTo
    {
        return $this->belongsTo(Contenido::class);
    }

    /**
     * Relación con el estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Relación con la calificación
     */
    public function calificacion(): HasOne
    {
        return $this->hasOne(Calificacion::class);
    }

    /**
     * Relación con los adjuntos
     */
    public function adjuntos(): HasMany
    {
        return $this->hasMany(AdjuntoTrabajo::class);
    }

    /**
     * Relación con el curso a través del contenido
     * CORRECCIÓN: Usar hasOneThrough en lugar de ->through() que no existe
     */
    public function cursoViaContenido()
    {
        return $this->hasOneThrough(
            Curso::class,
            Contenido::class,
            'id',           // FK en contenidos apuntando a...
            'id',           // FK en cursos apuntando a...
            'contenido_id', // Foreign key local en trabajos
            'curso_id'      // Foreign key en contenidos
        );
    }

    /**
     * Entregar el trabajo
     */
    public function entregar(): void
    {
        $this->update([
            'estado'        => 'entregado',
            'fecha_entrega' => now(),
            'tiempo_total'  => $this->calcularTiempoTotal(),
        ]);
    }

    /**
     * Calcular tiempo total en minutos
     */
    private function calcularTiempoTotal(): int
    {
        if (! $this->fecha_inicio) {
            return 0;
        }

        return now()->diffInMinutes($this->fecha_inicio);
    }

    /**
     * Recibir retroalimentación
     */
    public function recibirRetroalimentacion(string $retroalimentacion): void
    {
        $this->update(['comentarios' => $retroalimentacion]);
    }

    /**
     * Verificar si está entregado
     */
    public function estaEntregado(): bool
    {
        return $this->estado === 'entregado';
    }

    /**
     * Verificar si está calificado
     */
    public function estaCalificado(): bool
    {
        return $this->estado === 'calificado';
    }

    /**
     * Verificar si está en progreso
     */
    public function estaEnProgreso(): bool
    {
        return $this->estado === 'en_progreso';
    }

    /**
     * Obtener puntaje de la calificación
     */
    public function getPuntaje(): float
    {
        return $this->calificacion?->puntaje ?? 0;
    }

    /**
     * Obtener comentario de la calificación
     */
    public function getComentarioCalificacion(): string
    {
        return $this->calificacion?->comentario ?? '';
    }

    /**
     * Obtener tiempo transcurrido formateado
     */
    public function getTiempoTranscurridoFormateado(): string
    {
        if (! $this->fecha_inicio) {
            return 'No iniciado';
        }

        $tiempo  = $this->tiempo_total ?? now()->diffInMinutes($this->fecha_inicio);
        $horas   = floor($tiempo / 60);
        $minutos = $tiempo % 60;

        if ($horas > 0) {
            return "{$horas}h {$minutos}m";
        }

        return "{$minutos}m";
    }

    /**
     * Incrementar contador de intentos
     */
    public function incrementarIntentos(): void
    {
        $this->increment('intentos');
    }

    /**
     * Incrementar contador de consultas a material
     */
    public function incrementarConsultasMaterial(): void
    {
        $this->increment('consultas_material');
    }

    /**
     * Obtener estadísticas del trabajo
     */
    public function obtenerEstadisticas(): array
    {
        return [
            'tiempo_total'       => $this->tiempo_total ?? 0,
            'intentos'           => $this->intentos,
            'consultas_material' => $this->consultas_material,
            'puntaje'            => $this->getPuntaje(),
            'estado'             => $this->estado,
            'fecha_entrega'      => $this->fecha_entrega?->format('d/m/Y H:i'),
        ];
    }
}
