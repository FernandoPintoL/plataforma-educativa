<?php

namespace App\Observers;

use App\Models\PrecioProducto;

class PrecioProductoObserver
{
    /**
     * Handle the PrecioProducto "created" event.
     */
    public function created(PrecioProducto $precioProducto): void
    {
        //
    }

    /**
     * Handle the PrecioProducto "updated" event.
     */
    public function updated(PrecioProducto $precioProducto): void
    {
        //
    }

    /**
     * Handle the PrecioProducto "deleted" event.
     */
    public function deleted(PrecioProducto $precioProducto): void
    {
        //
    }

    /**
     * Handle the PrecioProducto "restored" event.
     */
    public function restored(PrecioProducto $precioProducto): void
    {
        //
    }

    /**
     * Handle the PrecioProducto "force deleted" event.
     */
    public function forceDeleted(PrecioProducto $precioProducto): void
    {
        //
    }
}
