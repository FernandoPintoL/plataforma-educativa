<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrecioProducto extends Model
{
    protected $fillable = [
        'producto_id',
        'tipo_precio_id',
        'precio',
        'activo',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function tipoPrecio()
    {
        return $this->belongsTo(TipoPrecio::class);
    }
}
