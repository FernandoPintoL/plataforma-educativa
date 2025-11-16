<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Intervencion extends Model
{
    protected $table = 'intervenciones';

    protected $fillable = [
        'prediccion_riesgo_id',
        'estudiante_id',
        'profesor_id',
        'curso_id',
        'titulo',
        'descripcion',
        'tipo_intervencion',
        'estado',
        'prioridad',
        'fecha_inicio',
        'fecha_fin_planeada',
        'fecha_fin_real',
        'observaciones',
        'resultados',
        'seguimiento_requerido',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'resultados' => 'json',
        'seguimiento_requerido' => 'boolean',
        'fecha_inicio' => 'date',
        'fecha_fin_planeada' => 'date',
        'fecha_fin_real' => 'date',
    ];

    // Relations
    public function prediccionRiesgo(): BelongsTo
    {
        return $this->belongsTo(PrediccionRiesgo::class, 'prediccion_riesgo_id');
    }

    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    public function profesor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'profesor_id');
    }

    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class, 'curso_id');
    }

    public function creador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function seguimientos(): HasMany
    {
        return $this->hasMany(SeguimientoIntervencion::class, 'intervencion_id');
    }

    // Scopes
    public function scopePorEstudiante($query, $estudianteId)
    {
        return $query->where('estudiante_id', $estudianteId);
    }

    public function scopePorProfesor($query, $profesorId)
    {
        return $query->where('profesor_id', $profesorId);
    }

    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    public function scopePorCurso($query, $cursoId)
    {
        return $query->where('curso_id', $cursoId);
    }

    public function scopeActivas($query)
    {
        return $query->whereIn('estado', ['pendiente', 'en_progreso']);
    }

    public function scopeVencidas($query)
    {
        return $query->where('fecha_fin_planeada', '<', now())
            ->whereNotIn('estado', ['completada', 'cancelada']);
    }

    public function scopePorTipo($query, $tipo)
    {
        return $query->where('tipo_intervencion', $tipo);
    }

    // Methods
    public function marcarEnProgreso($usuarioId = null): void
    {
        $this->update([
            'estado' => 'en_progreso',
            'updated_by' => $usuarioId ?? auth()->id(),
        ]);
        $this->registrarSeguimiento(
            'Intervención marcada como en progreso',
            'en_progreso',
            $usuarioId ?? auth()->id()
        );
    }

    public function marcarCompletada($resultados = null, $usuarioId = null): void
    {
        $this->update([
            'estado' => 'completada',
            'fecha_fin_real' => now(),
            'resultados' => $resultados ?? $this->resultados,
            'updated_by' => $usuarioId ?? auth()->id(),
        ]);
        $this->registrarSeguimiento(
            'Intervención completada exitosamente',
            'completada',
            $usuarioId ?? auth()->id()
        );
    }

    public function marcarCancelada($razon = null, $usuarioId = null): void
    {
        $this->update([
            'estado' => 'cancelada',
            'updated_by' => $usuarioId ?? auth()->id(),
        ]);
        $this->registrarSeguimiento(
            'Intervención cancelada' . ($razon ? ': ' . $razon : ''),
            'cancelada',
            $usuarioId ?? auth()->id()
        );
    }

    public function agregarSeguimiento($descripcion, $estadoActual = null, $usuarioId = null, $observaciones = null)
    {
        return SeguimientoIntervencion::create([
            'intervencion_id' => $this->id,
            'usuario_id' => $usuarioId ?? auth()->id(),
            'descripcion' => $descripcion,
            'estado_actual' => $estadoActual,
            'observaciones' => $observaciones,
            'fecha_seguimiento' => now(),
        ]);
    }

    public function registrarSeguimiento($descripcion, $estado = null, $usuarioId = null): SeguimientoIntervencion
    {
        return $this->agregarSeguimiento($descripcion, $estado, $usuarioId);
    }

    public function estaVencida(): bool
    {
        return $this->fecha_fin_planeada && $this->fecha_fin_planeada < now()->date() && !in_array($this->estado, ['completada', 'cancelada']);
    }

    public function porcentajeCompleta(): float
    {
        if (!$this->seguimientos) {
            return 0;
        }
        $total = $this->seguimientos->count();
        if ($total === 0) {
            return 0;
        }
        return ($total / 10) * 100; // Aproximación: 10 seguimientos = 100%
    }

    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'estado' => $this->estado,
            'prioridad' => $this->prioridad,
            'estudiante' => $this->estudiante?->nombre_completo,
            'profesor' => $this->profesor?->nombre_completo,
            'curso' => $this->curso?->nombre,
            'fecha_inicio' => $this->fecha_inicio?->format('Y-m-d'),
            'fecha_fin' => $this->fecha_fin_planeada?->format('Y-m-d'),
            'vencida' => $this->estaVencida(),
            'progreso' => $this->porcentajeCompleta(),
        ];
    }
}
