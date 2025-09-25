<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Chofer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'licencia',
        'telefono',
        'fecha_vencimiento_licencia',
        'activo',
        'observaciones',
    ];

    protected $casts = [
        'fecha_vencimiento_licencia' => 'date',
        'activo' => 'boolean',
    ];

    /**
     * Usuario asociado al chofer
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Transferencias asignadas a este chofer
     */
    public function transferencias(): HasMany
    {
        return $this->hasMany(TransferenciaInventario::class);
    }

    /**
     * Verificar si la licencia está vigente
     */
    public function licenciaVigente(): bool
    {
        return $this->fecha_vencimiento_licencia &&
        $this->fecha_vencimiento_licencia->isFuture();
    }

    /**
     * Choferes activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }
}
