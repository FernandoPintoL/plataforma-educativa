<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'peso',
        'unidad_medida_id',
        'stock_minimo',
        'stock_maximo',
        'activo',
        'fecha_creacion',
        'es_alquilable',
        'categoria_id',
        'marca_id',
        'proveedor_id',
    ];

    protected $casts = [
        'peso' => 'float',
        'stock_minimo' => 'integer',
        'stock_maximo' => 'integer',
        'activo' => 'boolean',
        'es_alquilable' => 'boolean',
        'fecha_creacion' => 'datetime',
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function marca()
    {
        return $this->belongsTo(Marca::class, 'marca_id');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenProducto::class, 'producto_id');
    }

    public function precios()
    {
        return $this->hasMany(PrecioProducto::class, 'producto_id');
    }

    public function stock()
    {
        return $this->hasMany(StockProducto::class, 'producto_id');
    }

    public function unidad()
    {
        return $this->belongsTo(UnidadMedida::class, 'unidad_medida_id');
    }

    public function codigosBarra()
    {
        return $this->hasMany(CodigoBarra::class, 'producto_id');
    }

    /**
     * Obtener el código de barra principal activo
     */
    public function codigoPrincipal()
    {
        return $this->hasOne(CodigoBarra::class, 'producto_id')
            ->where('es_principal', true)
            ->where('activo', true);
    }

    public function configuracionesGanancias()
    {
        return $this->hasMany(ConfiguracionGanancia::class);
    }

    /**
     * Obtener el precio de un tipo específico
     */
    public function obtenerPrecio(TipoPrecio|int|string $tipoPrecio): ?PrecioProducto
    {
        return $this->precios()
            ->activos()
            ->porTipo($tipoPrecio)
            ->first();
    }

    /**
     * Agregar un nuevo precio con configuración de ganancia
     */
    public function agregarPrecio(string $nombre, float $precio, TipoPrecio|int|string $tipoPrecio, ?array $configuracionGanancia = null): PrecioProducto
    {
        // Obtener el ID del tipo de precio
        $tipoPrecioId = null;
        if ($tipoPrecio instanceof TipoPrecio) {
            $tipoPrecioId = $tipoPrecio->id;
            $tipoPrecioModel = $tipoPrecio;
        } elseif (is_numeric($tipoPrecio)) {
            $tipoPrecioId = $tipoPrecio;
            $tipoPrecioModel = TipoPrecio::find($tipoPrecio);
        } else {
            $tipoPrecioModel = TipoPrecio::porCodigo($tipoPrecio);
            $tipoPrecioId = $tipoPrecioModel?->id;
        }

        if (! $tipoPrecioModel) {
            throw new \InvalidArgumentException("Tipo de precio no válido: $tipoPrecio");
        }

        // Crear el precio
        $precioProducto = $this->precios()->create([
            'nombre' => $nombre,
            'precio' => $precio,
            'tipo_precio_id' => $tipoPrecioId,
            'es_precio_base' => $tipoPrecioModel->es_precio_base,
            'activo' => true,
            'fecha_ultima_actualizacion' => now(),
        ]);

        // Si se proporciona configuración de ganancia, crearla
        // Si no, usar configuración global como referencia
        if ($configuracionGanancia && $tipoPrecioModel->esGanancia()) {
            $this->configuracionesGanancias()->updateOrCreate(
                ['tipo_precio_id' => $tipoPrecioId],
                array_merge([
                    'margen_minimo' => ConfiguracionGlobal::margenMinimoGlobal(),
                    'porcentaje_ganancia_esperado' => ConfiguracionGlobal::porcentajeInteresGeneral(),
                    'calcular_automatico' => ConfiguracionGlobal::aplicarInteresAutomatico(),
                    'activo' => true,
                ], $configuracionGanancia)
            );
        } elseif (! $configuracionGanancia && $tipoPrecioModel->esGanancia()) {
            // Usar configuración global por defecto
            $this->configuracionesGanancias()->updateOrCreate(
                ['tipo_precio_id' => $tipoPrecioId],
                [
                    'margen_minimo' => ConfiguracionGlobal::margenMinimoGlobal(),
                    'porcentaje_ganancia_esperado' => ConfiguracionGlobal::porcentajeInteresGeneral(),
                    'calcular_automatico' => ConfiguracionGlobal::aplicarInteresAutomatico(),
                    'activo' => true,
                ]
            );
        }

        return $precioProducto;
    }

    /**
     * Eliminar precio de un tipo específico
     */
    public function eliminarPrecio(TipoPrecio|int|string $tipoPrecio): bool
    {
        $precio = $this->obtenerPrecio($tipoPrecio);

        if ($precio) {
            $precio->update(['activo' => false]);

            return true;
        }

        return false;
    }

    /**
     * Calcular ganancia para un tipo de venta específico
     */
    public function calcularGanancia(TipoPrecio|int|string $tipoVenta): float
    {
        $precioCosto = $this->obtenerPrecio(TipoPrecio::costo() ?? 'COSTO');
        $precioVenta = $this->obtenerPrecio($tipoVenta);

        if (! $precioCosto || ! $precioVenta) {
            return 0;
        }

        return $precioVenta->precio - $precioCosto->precio;
    }

    /**
     * Obtener todos los precios activos con sus tipos
     */
    public function obtenerTodosLosPrecios(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->precios()
            ->activos()
            ->with('tipoPrecio')
            ->get()
            ->sortBy(function ($precio) {
                return $precio->tipoPrecio ? $precio->tipoPrecio->orden : 999;
            });
    }

    /**
     * Crear precios automáticos basados en configuración global
     */
    public function crearPreciosAutomaticos(float $precioCosto): array
    {
        $preciosCreados = [];

        // Crear precio de costo (base)
        $tipoCosto = TipoPrecio::costo() ?? TipoPrecio::porCodigo('COSTO');
        if ($tipoCosto) {
            $preciosCreados[] = $this->agregarPrecio(
                'Precio de Costo',
                $precioCosto,
                $tipoCosto
            );
        }

        // Crear precios de ganancia automáticamente si está habilitado
        if (ConfiguracionGlobal::aplicarInteresAutomatico()) {
            $tiposGanancia = TipoPrecio::activos()
                ->ganancias()
                ->ordenados()
                ->get();

            foreach ($tiposGanancia as $tipo) {
                // Determinar el porcentaje a usar por prioridad:
                // 1) Configuración específica del producto para este tipo (si existe)
                // 2) Configuración en el propio Tipo de Precio (configuracion.porcentaje_ganancia)
                // 3) Configuración global
                $porcentajeGanancia = null;

                // Verificar si ya existe configuración específica para este tipo
                $configExistente = $this->configuracionesGanancias()
                    ->where('tipo_precio_id', $tipo->id)
                    ->first();

                if ($configExistente) {
                    $porcentajeGanancia = $configExistente->porcentaje_ganancia_esperado;
                }

                if ($porcentajeGanancia === null) {
                    $porcentajeGanancia = $tipo->porcentaje_ganancia !== null
                        ? (float) $tipo->porcentaje_ganancia
                        : (is_array($tipo->configuracion) && array_key_exists('porcentaje_ganancia', $tipo->configuracion)
                            ? (float) $tipo->configuracion['porcentaje_ganancia']
                            : null);
                }

                if ($porcentajeGanancia === null) {
                    $porcentajeGanancia = (float) ConfiguracionGlobal::porcentajeInteresGeneral();
                }

                $precioVenta = $precioCosto + ($precioCosto * $porcentajeGanancia / 100);

                $preciosCreados[] = $this->agregarPrecio(
                    $tipo->nombre,
                    $precioVenta,
                    $tipo
                );
            }
        }

        return $preciosCreados;
    }

    /**
     * Actualizar configuración de ganancia con valores globales como respaldo
     */
    public function actualizarConfiguracionGanancia(TipoPrecio|int|string $tipoPrecio, array $configuracion = []): ConfiguracionGanancia
    {
        $tipoPrecioId = null;
        if ($tipoPrecio instanceof TipoPrecio) {
            $tipoPrecioId = $tipoPrecio->id;
        } elseif (is_numeric($tipoPrecio)) {
            $tipoPrecioId = $tipoPrecio;
        } else {
            $tipoPrecioModel = TipoPrecio::porCodigo($tipoPrecio);
            $tipoPrecioId = $tipoPrecioModel?->id;
        }

        if (! $tipoPrecioId) {
            throw new \InvalidArgumentException("Tipo de precio no válido: $tipoPrecio");
        }

        // Combinar configuración proporcionada con valores globales como respaldo
        $configuracionCompleta = array_merge([
            'margen_minimo' => ConfiguracionGlobal::margenMinimoGlobal(),
            'porcentaje_ganancia_esperado' => ConfiguracionGlobal::porcentajeInteresGeneral(),
            'calcular_automatico' => ConfiguracionGlobal::aplicarInteresAutomatico(),
            'activo' => true,
        ], $configuracion);

        return $this->configuracionesGanancias()->updateOrCreate(
            ['tipo_precio_id' => $tipoPrecioId],
            $configuracionCompleta
        );
    }

    /**
     * Obtener porcentaje de ganancia efectivo (específico del producto o global)
     */
    public function obtenerPorcentajeGananciaEfectivo(TipoPrecio|int|string $tipoPrecio): float
    {
        $configuracion = $this->configuracionesGanancias()
            ->where('tipo_precio_id', $this->obtenerTipoPrecioId($tipoPrecio))
            ->where('activo', true)
            ->first();

        return $configuracion
            ? $configuracion->porcentaje_ganancia_esperado
            : ConfiguracionGlobal::porcentajeInteresGeneral();
    }

    /**
     * Obtener margen mínimo efectivo (específico del producto o global)
     */
    public function obtenerMargenMinimoEfectivo(TipoPrecio|int|string $tipoPrecio): float
    {
        $configuracion = $this->configuracionesGanancias()
            ->where('tipo_precio_id', $this->obtenerTipoPrecioId($tipoPrecio))
            ->where('activo', true)
            ->first();

        return $configuracion
            ? $configuracion->margen_minimo
            : ConfiguracionGlobal::margenMinimoGlobal();
    }

    /**
     * Actualizar precios automáticamente basado en configuración
     */
    public function actualizarPreciosAutomaticos(): void
    {
        $precioCosto = $this->obtenerPrecio(TipoPrecio::costo() ?? 'COSTO');

        if (! $precioCosto) {
            return;
        }

        $configuraciones = $this->configuracionesGanancias()
            ->where('activo', true)
            ->where('calcular_automatico', true)
            ->get();

        foreach ($configuraciones as $config) {
            $nuevoPrecio = $config->calcularPrecioAutomatico($precioCosto->precio);

            if ($nuevoPrecio > 0) {
                $precioExistente = $this->precios()
                    ->activos()
                    ->where('tipo_precio_id', $config->tipo_precio_id)
                    ->first();

                if ($precioExistente) {
                    $precioExistente->actualizarPrecio(
                        $nuevoPrecio,
                        'Actualización automática basada en configuración global/específica',
                        'Sistema'
                    );
                }
            }
        }
    }

    /**
     * Método auxiliar para obtener ID de tipo de precio
     */
    private function obtenerTipoPrecioId(TipoPrecio|int|string $tipoPrecio): ?int
    {
        if ($tipoPrecio instanceof TipoPrecio) {
            return $tipoPrecio->id;
        }

        if (is_numeric($tipoPrecio)) {
            return (int) $tipoPrecio;
        }

        $tipoPrecioModel = TipoPrecio::porCodigo($tipoPrecio);

        return $tipoPrecioModel?->id;
    }

    /**
     * Boot del modelo para aplicar configuración automática
     */
    protected static function boot()
    {
        parent::boot();

        // Al crear un producto, aplicar configuración global si está habilitada
        static::created(function ($producto) {
            if (ConfiguracionGlobal::aplicarInteresAutomatico()) {
                // Crear configuraciones de ganancia por defecto para tipos activos
                $tiposGanancia = TipoPrecio::activos()->ganancias()->get();

                foreach ($tiposGanancia as $tipo) {
                    $producto->actualizarConfiguracionGanancia($tipo);
                }
            }
        });
    }

    /**
     * ==========================================
     * MÉTODOS DE INVENTARIO Y STOCK
     * ==========================================
     */

    /**
     * Obtener stock total consolidado de todos los almacenes
     */
    public function stockTotal(): int
    {
        return $this->stock()->sum('cantidad');
    }

    /**
     * Verificar si el producto tiene stock bajo (menor al mínimo)
     */
    public function stockBajo(): bool
    {
        if ($this->stock_minimo <= 0) {
            return false;
        }

        return $this->stockTotal() < $this->stock_minimo;
    }

    /**
     * Verificar si el producto excede el stock máximo
     */
    public function stockAlto(): bool
    {
        if ($this->stock_maximo <= 0) {
            return false;
        }

        return $this->stockTotal() > $this->stock_maximo;
    }

    /**
     * Verificar si tiene productos próximos a vencer
     */
    public function proximoVencer(int $diasAnticipacion = 30): bool
    {
        $fechaLimite = now()->addDays($diasAnticipacion);

        return $this->stock()
            ->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<=', $fechaLimite)
            ->where('cantidad', '>', 0)
            ->exists();
    }

    /**
     * Obtener productos que vencen próximamente
     */
    public function stockProximoVencer(int $diasAnticipacion = 30): \Illuminate\Database\Eloquent\Collection
    {
        $fechaLimite = now()->addDays($diasAnticipacion);

        return $this->stock()
            ->with('almacen')
            ->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<=', $fechaLimite)
            ->where('cantidad', '>', 0)
            ->orderBy('fecha_vencimiento')
            ->get();
    }

    /**
     * Obtener productos vencidos
     */
    public function stockVencido(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->stock()
            ->with('almacen')
            ->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<', now()->toDateString())
            ->where('cantidad', '>', 0)
            ->orderBy('fecha_vencimiento')
            ->get();
    }

    /**
     * Registrar movimiento de inventario
     */
    public function registrarMovimiento(
        int $almacenId,
        int $cantidad,
        string $tipo,
        ?string $observacion = null,
        ?string $numeroDocumento = null,
        ?string $lote = null,
        ?\Carbon\Carbon $fechaVencimiento = null,
        ?int $userId = null
    ): MovimientoInventario {
        // Buscar o crear registro de stock
        $stockProducto = $this->stock()
            ->where('almacen_id', $almacenId)
            ->where(function ($q) use ($lote) {
                if ($lote) {
                    $q->where('lote', $lote);
                } else {
                    $q->whereNull('lote');
                }
            })
            ->first();

        if (! $stockProducto) {
            $stockProducto = StockProducto::create([
                'producto_id' => $this->id,
                'almacen_id' => $almacenId,
                'cantidad' => 0,
                'lote' => $lote,
                'fecha_vencimiento' => $fechaVencimiento,
                'fecha_actualizacion' => now(),
            ]);
        }

        return MovimientoInventario::registrar(
            $stockProducto,
            $cantidad,
            $tipo,
            $observacion,
            $numeroDocumento,
            $userId
        );
    }

    /**
     * Ajustar stock directo (para correcciones)
     */
    public function ajustarStock(
        int $almacenId,
        int $nuevaCantidad,
        string $observacion = 'Ajuste de inventario',
        ?string $lote = null
    ): MovimientoInventario {
        $stockProducto = $this->stock()
            ->where('almacen_id', $almacenId)
            ->where(function ($q) use ($lote) {
                if ($lote) {
                    $q->where('lote', $lote);
                } else {
                    $q->whereNull('lote');
                }
            })
            ->firstOrCreate(
                [
                    'producto_id' => $this->id,
                    'almacen_id' => $almacenId,
                    'lote' => $lote,
                ],
                [
                    'cantidad' => 0,
                    'fecha_actualizacion' => now(),
                ]
            );

        $diferencia = $nuevaCantidad - $stockProducto->cantidad;
        $tipo = $diferencia >= 0 ? MovimientoInventario::TIPO_ENTRADA_AJUSTE : MovimientoInventario::TIPO_SALIDA_AJUSTE;

        return MovimientoInventario::registrar(
            $stockProducto,
            $diferencia,
            $tipo,
            $observacion,
            null
        );
    }

    /**
     * Obtener historial de movimientos
     */
    public function movimientos(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(
            MovimientoInventario::class,
            StockProducto::class,
            'producto_id',       // Foreign key en stock_productos
            'stock_producto_id', // Foreign key en movimientos_inventario
            'id',                // Local key en productos
            'id'                 // Local key en stock_productos
        );
    }

    /**
     * Scopes para consultas de inventario
     */
    public function scopeStockBajo($query)
    {
        return $query->where('stock_minimo', '>', 0)
            ->whereRaw('(SELECT COALESCE(SUM(cantidad), 0) FROM stock_productos WHERE producto_id = productos.id) < stock_minimo');
    }

    public function scopeStockAlto($query)
    {
        return $query->where('stock_maximo', '>', 0)
            ->whereRaw('(SELECT COALESCE(SUM(cantidad), 0) FROM stock_productos WHERE producto_id = productos.id) > stock_maximo');
    }

    public function scopeProximosVencer($query, int $diasAnticipacion = 30)
    {
        $fechaLimite = now()->addDays($diasAnticipacion)->toDateString();

        return $query->whereHas('stock', function ($q) use ($fechaLimite) {
            $q->whereNotNull('fecha_vencimiento')
                ->where('fecha_vencimiento', '<=', $fechaLimite)
                ->where('cantidad', '>', 0);
        });
    }

    public function scopeVencidos($query)
    {
        return $query->whereHas('stock', function ($q) {
            $q->whereNotNull('fecha_vencimiento')
                ->where('fecha_vencimiento', '<', now()->toDateString())
                ->where('cantidad', '>', 0);
        });
    }
}
