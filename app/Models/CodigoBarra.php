<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CodigoBarra extends Model
{
    use HasFactory;

    protected $table = 'codigos_barra';

    protected $fillable = [
        'producto_id',
        'codigo',
        'tipo',
        'es_principal',
        'activo',
    ];

    protected $casts = [
        'es_principal' => 'boolean',
        'activo' => 'boolean',
    ];

    /**
     * Relación con el producto
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    /**
     * Scope para códigos activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope para código principal
     */
    public function scopePrincipal($query)
    {
        return $query->where('es_principal', true);
    }
}
