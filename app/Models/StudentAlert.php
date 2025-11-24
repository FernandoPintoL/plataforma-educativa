<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAlert extends Model
{
    use HasFactory;

    protected $table = 'student_alerts';

    protected $fillable = [
        'trabajo_id',
        'estudiante_id',
        'monitoring_id',
        'tipo_alerta',
        'severidad',
        'confianza',
        'mensaje',
        'recomendacion',
        'detalles_alerta',
        'metricas_activacion',
        'estado',
        'fecha_generacion',
        'fecha_notificacion',
        'fecha_intervencion',
        'fecha_resolucion',
        'profesor_id',
        'accion_profesor',
        'fecha_revision_profesor',
        'impacto_en_desempeño',
        'estudiante_mejoro',
    ];

    protected $casts = [
        'fecha_generacion' => 'datetime',
        'fecha_notificacion' => 'datetime',
        'fecha_intervencion' => 'datetime',
        'fecha_resolucion' => 'datetime',
        'fecha_revision_profesor' => 'datetime',
        'detalles_alerta' => 'array',
        'metricas_activacion' => 'array',
    ];

    public function trabajo(): BelongsTo
    {
        return $this->belongsTo(Trabajo::class);
    }

    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    public function profesor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'profesor_id');
    }

    public function estaActiva(): bool
    {
        return in_array($this->estado, ['generada', 'notificada']);
    }

    public function marcarComoIntervenida($accion = null): void
    {
        $this->update([
            'estado' => 'intervenida',
            'fecha_intervencion' => now(),
            'accion_profesor' => $accion,
            'fecha_revision_profesor' => now(),
        ]);
    }

    public function marcarComoResuelta($mejoro = false, $impacto = null): void
    {
        $this->update([
            'estado' => 'resuelta',
            'fecha_resolucion' => now(),
            'estudiante_mejoro' => $mejoro,
            'impacto_en_desempeño' => $impacto,
        ]);
    }
}
