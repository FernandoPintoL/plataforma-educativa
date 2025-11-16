<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeguimientoIntervencion extends Model
{
    protected $table = 'seguimientos_intervenciones';

    protected $fillable = [
        'intervencion_id',
        'usuario_id',
        'descripcion',
        'fecha_seguimiento',
        'estado_actual',
        'observaciones',
        'evidencia',
    ];

    protected $casts = [
        'evidencia' => 'json',
        'fecha_seguimiento' => 'datetime',
    ];

    // Relations
    public function intervencion(): BelongsTo
    {
        return $this->belongsTo(Intervencion::class, 'intervencion_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // Methods
    public function obtenerNombreUsuario(): string
    {
        return $this->usuario?->nombre_completo ?? $this->usuario?->name ?? 'Desconocido';
    }

    public function getTiempoTranscurrido(): string
    {
        return $this->fecha_seguimiento->diffForHumans();
    }

    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'usuario' => $this->obtenerNombreUsuario(),
            'descripcion' => $this->descripcion,
            'fecha' => $this->fecha_seguimiento->format('Y-m-d H:i'),
            'estado' => $this->estado_actual,
            'observaciones' => $this->observaciones,
            'tiempo_transcurrido' => $this->getTiempoTranscurrido(),
        ];
    }
}
