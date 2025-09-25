<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Almacen;
use App\Models\Categoria;
use App\Models\CodigoBarra;
use App\Models\ImagenProducto;
use App\Models\Marca;
use App\Models\PrecioProducto;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Models\TipoPrecio;
use App\Models\UnidadMedida;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    public function historialPrecios(Producto $producto): JsonResponse
    {
        $producto->load(['precios' => function ($q) {
            $q->where('activo', true)->with(['tipoPrecio', 'historialPrecios' => function ($h) {
                $h->orderByDesc('fecha_cambio');
            }]);
        }]);
        $historial = [];
        foreach ($producto->precios as $precio) {
            foreach ($precio->historialPrecios as $h) {
                $historial[] = [
                    'id' => $h->id,
                    'tipo_precio_id' => $precio->tipo_precio_id,
                    'tipo_precio_nombre' => $precio->tipoPrecio?->nombre,
                    'valor_anterior' => $h->valor_anterior,
                    'valor_nuevo' => $h->valor_nuevo,
                    'fecha_cambio' => $h->fecha_cambio?->format('Y-m-d H:i'),
                    'motivo' => $h->motivo,
                    'usuario' => $h->usuario,
                    'porcentaje_cambio' => $h->porcentaje_cambio,
                ];
            }
        }

        return ApiResponse::success($historial);
    }

    public function index(Request $request): Response
    {
        $q = (string) $request->string('q');
        $categoriaId = $request->integer('categoria_id');
        $marcaId = $request->integer('marca_id');
        $proveedorId = $request->integer('proveedor_id');
        $orderBy = $request->string('order_by')->toString();
        $orderDir = strtolower($request->string('order_dir')->toString()) === 'asc' ? 'asc' : 'desc';

        $allowedOrder = ['id' => 'productos.id', 'nombre' => 'productos.nombre', 'precio_base' => 'precio_base', 'fecha_creacion' => 'productos.fecha_creacion', 'stock_total' => 'stock_total_calc'];
        $orderColumnRaw = $allowedOrder[$orderBy] ?? 'productos.id';

        $items = Producto::query()
            ->with([
                'categoria:id,nombre',
                'marca:id,nombre',
                'proveedor:id,nombre,razon_social',
                'unidad:id,codigo,nombre',
                // Cargar todas las imágenes para poder mostrar galería en modal rápido
                'imagenes:id,producto_id,url,es_principal,orden',
                // Cargar todos los precios activos (no sólo el base) para modal rápido
                'precios' => function ($q) {
                    $q->where('activo', true)
                        ->select('id', 'producto_id', 'nombre', 'precio', 'es_precio_base', 'tipo_precio_id', 'activo');
                },
                // Códigos de barra activos para modal rápido
                'codigosBarra' => function ($q) {
                    $q->where('activo', true)
                        ->orderByDesc('es_principal')
                        ->select('id', 'producto_id', 'codigo', 'tipo', 'es_principal', 'activo');
                },
                'stock:producto_id,cantidad',
            ])
            ->when($q, function ($qq) use ($q) {
                $qq->where(function ($sub) use ($q) {
                    $sub->where('productos.nombre', 'ilike', "%$q%")
                        ->orWhere('productos.codigo_barras', 'ilike', "%$q%");
                });
            })
            ->when($categoriaId, fn ($qq) => $qq->where('productos.categoria_id', $categoriaId))
            ->when($marcaId, fn ($qq) => $qq->where('productos.marca_id', $marcaId))
            ->when($proveedorId, fn ($qq) => $qq->where('productos.proveedor_id', $proveedorId))
            ->select('productos.*')
            ->leftJoinSub(
                'select producto_id, sum(cantidad) as stock_total_calc from stock_productos group by producto_id',
                'stock_totales',
                'stock_totales.producto_id',
                '=',
                'productos.id'
            )
            ->addSelect(DB::raw('coalesce(stock_totales.stock_total_calc,0) as stock_total_calc'))
            ->orderBy($orderColumnRaw === 'precio_base' ? DB::raw('(select precio from precios_producto p where p.producto_id = productos.id and p.activo = true and p.es_precio_base = true limit 1)') : $orderColumnRaw, $orderDir)
            ->paginate(12)
            ->through(function ($producto) {
                // Perfil y galería
                $perfil = $producto->imagenes->firstWhere('es_principal', true) ?: $producto->imagenes->first();
                $galeria = $producto->imagenes->where('id', '!=', optional($perfil)->id)->values()->map(fn ($img) => ['id' => $img->id, 'url' => $img->url])->toArray();

                // Precios activos completos para modal rápido
                $preciosActivos = $producto->precios->map(function ($p) {
                    return [
                        'id' => $p->id,
                        'nombre' => $p->nombre,
                        'monto' => (float) $p->precio,
                        'tipo_precio_id' => $p->tipo_precio_id,
                        'es_precio_base' => (bool) $p->es_precio_base,
                    ];
                })->values();
                $precioBase = optional($producto->precios->firstWhere('es_precio_base', true))->precio;

                // Códigos de barra
                $codigos = $producto->codigosBarra->map(fn ($c) => [
                    'codigo' => $c->codigo,
                    'tipo' => $c->tipo,
                    'es_principal' => (bool) $c->es_principal,
                ])->values();

                $stockTotal = (int) ($producto->stock_total_calc ?? $producto->stock?->sum('cantidad') ?? 0);

                return [
                    'id' => $producto->id,
                    'nombre' => $producto->nombre,
                    'descripcion' => $producto->descripcion,
                    'peso' => $producto->peso,
                    'unidad_medida_id' => $producto->unidad_medida_id,
                    'codigo_barras' => $producto->codigo_barras,
                    'codigo_qr' => $producto->codigo_qr,
                    'stock_minimo' => $producto->stock_minimo,
                    'stock_maximo' => $producto->stock_maximo,
                    'stock_total' => $stockTotal,
                    'activo' => $producto->activo,
                    'fecha_creacion' => $producto->fecha_creacion,
                    'es_alquilable' => $producto->es_alquilable,
                    'categoria_id' => $producto->categoria_id,
                    'marca_id' => $producto->marca_id,
                    'proveedor_id' => $producto->proveedor_id,
                    'categoria' => $producto->categoria,
                    'marca' => $producto->marca,
                    'proveedor' => $producto->proveedor,
                    'unidad' => $producto->unidad,
                    'perfil' => $perfil ? ['id' => $perfil->id, 'url' => $perfil->url] : null,
                    'galeria' => $galeria,
                    'precios' => $preciosActivos,
                    'codigos' => $codigos->isNotEmpty() ? $codigos : [['codigo' => $producto->codigo_barras ?? '']],
                    'historial_precios' => [], // se puede cargar diferido si se requiere
                    'precio_base' => $precioBase,
                ];
            })
            ->withQueryString();

        $categorias = Categoria::query()->orderBy('nombre')->get(['id', 'nombre']);
        $marcas = Marca::query()->orderBy('nombre')->get(['id', 'nombre']);
        $proveedores = \App\Models\Proveedor::query()->orderBy('nombre')->get(['id', 'nombre', 'razon_social']);

        return Inertia::render('productos/index', [
            'productos' => $items,
            'filters' => [
                'q' => $q,
                'categoria_id' => $categoriaId ?: null,
                'marca_id' => $marcaId ?: null,
                'proveedor_id' => $request->integer('proveedor_id') ?: null,
                'order_by' => $orderBy ?: null,
                'order_dir' => $orderDir,
            ],
            'categorias' => $categorias,
            'marcas' => $marcas,
            'proveedores' => $proveedores,
            'unidades' => UnidadMedida::orderBy('nombre')->get(['id', 'codigo', 'nombre']),
            'tipos_precio' => TipoPrecio::getOptions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('productos/form', [
            'producto' => null,
            'categorias' => Categoria::orderBy('nombre')->get(['id', 'nombre']),
            'marcas' => Marca::orderBy('nombre')->get(['id', 'nombre']),
            'proveedores' => \App\Models\Proveedor::orderBy('nombre')->get(['id', 'nombre', 'razon_social']),
            'unidades' => UnidadMedida::orderBy('nombre')->get(['id', 'codigo', 'nombre']),
            'tipos_precio' => TipoPrecio::getOptions(),
            'configuraciones_ganancias' => \App\Models\ConfiguracionGlobal::configuracionesGanancias(),
            'almacenes' => Almacen::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    /**
     * Formulario moderno simplificado para crear productos
     */
    public function createModerno(): Response
    {
        return Inertia::render('productos/form-moderno', [
            'producto' => null,
            'categorias' => Categoria::orderBy('nombre')->get(['id', 'nombre']),
            'marcas' => Marca::orderBy('nombre')->get(['id', 'nombre']),
            'unidades' => UnidadMedida::orderBy('nombre')->get(['id', 'codigo', 'nombre']),
            'tipos_precio' => TipoPrecio::getOptions(),
            'configuraciones_ganancias' => \App\Models\ConfiguracionGlobal::configuracionesGanancias(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $tiposPrecios = TipoPrecio::activos()->pluck('id')->toArray();

        // Manejo simplificado y robusto de códigos
        $requestData = $request->all();

        // Procesar códigos de manera más simple
        if (isset($requestData['codigos'])) {
            $codigosLimpios = [];

            // Si no es array, convertir a array
            if (! is_array($requestData['codigos'])) {
                $requestData['codigos'] = [];
            }

            foreach ($requestData['codigos'] as $item) {
                $codigoString = '';

                // Extraer string del código independientemente del formato
                if (is_string($item)) {
                    $codigoString = trim($item);
                } elseif (is_array($item)) {
                    // Si es array, buscar la clave 'codigo' o tomar el primer valor válido
                    if (isset($item['codigo']) && is_string($item['codigo'])) {
                        $codigoString = trim($item['codigo']);
                    } elseif (! empty($item)) {
                        // Tomar el primer valor que sea string
                        foreach ($item as $value) {
                            if (is_string($value) && ! empty(trim($value))) {
                                $codigoString = trim($value);
                                break;
                            }
                        }
                    }
                } else {
                    // Si es otro tipo, intentar convertir a string
                    $codigoString = (string) $item;
                }

                // Solo agregar si no está vacío
                if (! empty($codigoString)) {
                    $codigosLimpios[] = $codigoString;
                }
            }

            $requestData['codigos'] = $codigosLimpios;
        }

        $data = $request->merge($requestData)->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'peso' => ['nullable', 'numeric', 'min:0'],
            'unidad_medida_id' => ['nullable', 'exists:unidades_medida,id'],
            'numero' => ['nullable', 'string', 'max:255'],
            'fecha_vencimiento' => ['nullable', 'date'],
            'categoria_id' => ['nullable', 'exists:categorias,id'],
            'marca_id' => ['nullable', 'exists:marcas,id'],
            'proveedor_id' => ['nullable', 'exists:proveedores,id'],
            'stock_minimo' => ['nullable', 'integer', 'min:0'],
            'stock_maximo' => ['nullable', 'integer', 'min:0'],
            'precios' => ['nullable', 'array'],
            'precios.*.monto' => ['required_with:precios.*', 'numeric', 'min:0'],
            'precios.*.tipo_precio_id' => ['sometimes', 'integer', 'in:'.implode(',', $tiposPrecios)],
            'codigos' => ['nullable', 'array'],
            'codigos.*' => ['string', 'max:255'],
            'perfil' => ['nullable', 'file', 'image', 'max:4096'],
            'galeria' => ['nullable', 'array'],
            'galeria.*' => ['file', 'image', 'max:4096'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $producto = null;

        DB::transaction(function () use ($data, $request, &$producto) {
            // Filtrar y limpiar códigos válidos de manera más robusta
            $codigosValidos = [];
            if (isset($data['codigos']) && is_array($data['codigos'])) {
                foreach ($data['codigos'] as $codigo) {
                    // Asegurarse de que el código sea un string y no esté vacío
                    if (is_string($codigo) && ! empty(trim($codigo))) {
                        $codigosValidos[] = trim($codigo);
                    }
                }
            }

            // También verificar si hay códigos en el request directamente (fallback)
            if (empty($codigosValidos) && $request->has('codigos')) {
                $requestCodigos = $request->get('codigos');
                if (is_array($requestCodigos)) {
                    foreach ($requestCodigos as $codigo) {
                        if (is_string($codigo) && ! empty(trim($codigo))) {
                            $codigosValidos[] = trim($codigo);
                        }
                    }
                }
            }

            // Crear el producto
            $producto = Producto::create([
                'nombre' => $data['nombre'],
                'descripcion' => $data['descripcion'] ?? null,
                'peso' => $data['peso'] ?? 0,
                'unidad_medida_id' => $data['unidad_medida_id'] ?? null,
                'codigo_barras' => null,
                'codigo_qr' => null,
                'stock_minimo' => $data['stock_minimo'] ?? 0,
                'stock_maximo' => $data['stock_maximo'] ?? 0,
                'activo' => $data['activo'] ?? true,
                'es_alquilable' => false,
                'categoria_id' => $data['categoria_id'] ?? null,
                'marca_id' => $data['marca_id'] ?? null,
                'proveedor_id' => $data['proveedor_id'] ?? null,
            ]);

            // Gestionar códigos de barra usando la nueva tabla
            if (! empty($codigosValidos)) {
                foreach ($codigosValidos as $index => $codigo) {
                    CodigoBarra::create([
                        'producto_id' => $producto->id,
                        'codigo' => trim($codigo),
                        'tipo' => 'EAN',        // Por defecto EAN
                        'es_principal' => $index === 0, // El primero es principal
                        'activo' => true,
                    ]);
                }
                // Actualizar el campo legacy con el código principal
                $codigoPrincipal = $codigosValidos[0];
                $producto->update([
                    'codigo_barras' => $codigoPrincipal,
                    'codigo_qr' => $codigoPrincipal, // Mismo valor para código QR
                ]);
            } else {
                // Si no hay códigos, crear uno con el ID del producto
                $codigoGenerado = (string) $producto->id;
                CodigoBarra::create([
                    'producto_id' => $producto->id,
                    'codigo' => $codigoGenerado,
                    'tipo' => 'INTERNAL',
                    'es_principal' => true,
                    'activo' => true,
                ]);
                // Actualizar el campo legacy
                $producto->update([
                    'codigo_barras' => $codigoGenerado,
                    'codigo_qr' => $codigoGenerado, // Mismo valor para código QR
                ]);
            }

            // Precios mejorados usando la nueva tabla de tipos de precio
            if (! empty($data['precios']) && is_array($data['precios'])) {
                // Obtener monto del precio base (costo) del payload para calcular márgenes
                $montoBase = 0.0;
                foreach ($data['precios'] as $pp) {
                    $tpIdTmp = $pp['tipo_precio_id'] ?? $this->determinarTipoPrecioId($pp['nombre'] ?? '');
                    $tpTmp = TipoPrecio::find($tpIdTmp);
                    if ($tpTmp && $tpTmp->es_precio_base) {
                        $montoBase = (float) ($pp['monto'] ?? 0);
                        break;
                    }
                }

                foreach ($data['precios'] as $p) {
                    // Validar que tenga monto válido
                    if (empty($p['monto']) || ! is_numeric($p['monto'])) {
                        continue;
                    }

                    // Determinar tipo de precio ID
                    $tipoPrecioId = $p['tipo_precio_id'] ?? null;
                    $tipoPrecio = TipoPrecio::find($tipoPrecioId);

                    if (! $tipoPrecio) {
                        continue; // Si no existe el tipo de precio, saltarlo
                    }

                    $monto = (float) $p['monto'];
                    $esBase = (bool) $tipoPrecio->es_precio_base;
                    $margen = $esBase ? 0.0 : max(0.0, $monto - $montoBase);
                    $porcentaje = ($esBase || $montoBase <= 0) ? 0.0 : (($monto - $montoBase) / max($montoBase, 1)) * 100;

                    // Generar nombre automáticamente basado en el tipo de precio
                    $nombre = $p['nombre'] ?? $tipoPrecio->nombre;

                    PrecioProducto::create([
                        'producto_id' => $producto->id,
                        'nombre' => $nombre,
                        'precio' => $monto,
                        'tipo_precio_id' => $tipoPrecioId,
                        'es_precio_base' => $esBase,
                        'margen_ganancia' => $margen,
                        'porcentaje_ganancia' => $porcentaje,
                        'activo' => true,
                        'fecha_ultima_actualizacion' => now(),
                    ]);
                }
            }

            // imágenes: perfil + galería
            $orden = 0;
            if ($request->hasFile('perfil')) {
                $file = $request->file('perfil');
                $path = $file->store('productos', 'public');
                ImagenProducto::create([
                    'producto_id' => $producto->id,
                    'url' => Storage::disk('public')->url($path),
                    'es_principal' => true,
                    'orden' => $orden++,
                ]);
            }
            if ($request->hasFile('galeria')) {
                foreach ($request->file('galeria') as $file) {
                    $path = $file->store('productos', 'public');
                    ImagenProducto::create([
                        'producto_id' => $producto->id,
                        'url' => Storage::disk('public')->url($path),
                        'es_principal' => false,
                        'orden' => $orden++,
                    ]);
                }
            }
        });

        return redirect()->route('productos.index')->with('success', 'Producto creado correctamente');
    }

    public function edit(Producto $producto): Response
    {
        $producto->load([
            'imagenes' => function ($q) {
                $q->orderBy('orden');
            },
            'codigosBarra' => function ($q) {
                $q->where('activo', true)->orderBy('es_principal', 'desc');
            },
            'proveedor:id,nombre,razon_social',
        ]);

        // Adapt payload for frontend form structure
        $perfil = $producto->imagenes->firstWhere('es_principal', true);
        $galeria = $producto->imagenes->where('es_principal', false)->values()->map(function ($img) {
            return ['id' => $img->id, 'url' => $img->url];
        });

        // Obtener códigos de barra de la nueva tabla
        $codigos = $producto->codigosBarra->map(function ($cb) {
            return ['codigo' => $cb->codigo, 'tipo' => $cb->tipo, 'es_principal' => $cb->es_principal];
        });

        // Obtener precios en formato simple que espera el frontend
        $precios = $producto->precios()
            ->where('activo', true)
            ->with('tipoPrecio')
            ->get()
            ->sortBy(function ($precio) {
                return $precio->tipoPrecio ? $precio->tipoPrecio->orden : 999;
            })
            ->map(function ($pr) {
                return [
                    'id' => $pr->id,
                    'monto' => (float) $pr->precio,
                    'tipo_precio_id' => (int) $pr->tipo_precio_id,
                ];
            })
            ->values();

        // Obtener historial de precios agrupado por tipo de precio
        $historialPrecios = [];
        $preciosActivos = $producto->precios()->with(['tipoPrecio', 'historialPrecios' => function ($q) {
            $q->orderByDesc('fecha_cambio');
        }])->where('activo', true)->get();
        foreach ($preciosActivos as $precio) {
            $historialPrecios[] = [
                'tipo_precio_id' => $precio->tipo_precio_id,
                'tipo_precio_nombre' => $precio->tipoPrecio?->nombre,
                'historial' => $precio->historialPrecios->map(function ($h) {
                    return [
                        'id' => $h->id,
                        'valor_anterior' => $h->valor_anterior,
                        'valor_nuevo' => $h->valor_nuevo,
                        'fecha_cambio' => $h->fecha_cambio?->format('Y-m-d H:i'),
                        'motivo' => $h->motivo,
                        'usuario' => $h->usuario,
                        'porcentaje_cambio' => $h->porcentaje_cambio,
                    ];
                })->toArray()];
        }

        $payload = [
            'id' => $producto->id,
            'nombre' => $producto->nombre,
            'descripcion' => $producto->descripcion,
            'sku' => null,
            'numero' => null,
            'categoria_id' => (int) $producto->categoria_id,
            'marca_id' => (int) $producto->marca_id,
            'proveedor_id' => $producto->proveedor_id ? (int) $producto->proveedor_id : null,
            'peso' => $producto->peso ? (float) $producto->peso : null,
            'unidad_medida_id' => $producto->unidad_medida_id ? (int) $producto->unidad_medida_id : null,
            'fecha_vencimiento' => null,
            'activo' => (bool) $producto->activo,
            'stock_minimo' => $producto->stock_minimo ? (int) $producto->stock_minimo : null,
            'stock_maximo' => $producto->stock_maximo ? (int) $producto->stock_maximo : null,
            'perfil' => $perfil ? ['id' => $perfil->id, 'url' => $perfil->url] : null,
            'galeria' => $galeria,
            'precios' => $precios,
            'codigos' => $codigos->isNotEmpty() ? $codigos->toArray() : [['codigo' => '']],
            // mapear stock por almacén para el frontend
            'almacenes' => StockProducto::where('producto_id', $producto->id)
                ->get(['almacen_id', 'cantidad as stock', 'lote', 'fecha_vencimiento'])
                ->map(function ($s) {
                    return ['almacen_id' => $s->almacen_id, 'stock' => $s->stock, 'lote' => $s->lote, 'fecha_vencimiento' => $s->fecha_vencimiento ? $s->fecha_vencimiento->format('Y-m-d') : null];
                })->toArray(),
            'historial_precios' => $historialPrecios,
        ];

        return Inertia::render('productos/form', [
            'producto' => $payload,
            'categorias' => Categoria::orderBy('nombre')->get(['id', 'nombre']),
            'marcas' => Marca::orderBy('nombre')->get(['id', 'nombre']),
            'proveedores' => \App\Models\Proveedor::orderBy('nombre')->get(['id', 'nombre', 'razon_social']),
            'unidades' => UnidadMedida::orderBy('nombre')->get(['id', 'codigo', 'nombre']),
            'tipos_precio' => TipoPrecio::getOptions(),
            'configuraciones_ganancias' => \App\Models\ConfiguracionGlobal::configuracionesGanancias(),
            'almacenes' => Almacen::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    public function update(Request $request, Producto $producto): RedirectResponse
    {
        $tiposPrecios = TipoPrecio::activos()->pluck('id')->toArray();

        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'peso' => ['nullable', 'numeric', 'min:0'],
            'unidad_medida_id' => ['nullable', 'exists:unidades_medida,id'],
            'numero' => ['nullable', 'string', 'max:255'],
            'fecha_vencimiento' => ['nullable', 'date'],
            'categoria_id' => ['nullable', 'exists:categorias,id'],
            'marca_id' => ['nullable', 'exists:marcas,id'],
            'proveedor_id' => ['nullable', 'exists:proveedores,id'],
            'stock_minimo' => ['nullable', 'integer', 'min:0'],
            'stock_maximo' => ['nullable', 'integer', 'min:0'],
            'precios' => ['nullable', 'array'],
            'precios.*.monto' => ['required_with:precios.*', 'numeric', 'min:0'],
            'precios.*.tipo_precio_id' => ['sometimes', 'integer', 'in:'.implode(',', $tiposPrecios)],
            'codigos' => ['nullable', 'array'],
            'codigos.*' => ['nullable', 'string', 'max:255'],
            'perfil' => ['nullable', 'file', 'image', 'max:4096'],
            'galeria' => ['nullable', 'array'],
            'galeria.*' => ['file', 'image', 'max:4096'],
            'galeria_eliminar' => ['sometimes', 'array'],
            'galeria_eliminar.*' => ['integer', 'exists:imagenes_productos,id'],
            'remove_perfil' => ['sometimes', 'boolean'],
            'activo' => ['nullable', 'boolean'],
        ]);

        DB::transaction(function () use ($data, $request, $producto) {
            $producto->update([
                'nombre' => $data['nombre'],
                'descripcion' => $data['descripcion'] ?? $producto->descripcion,
                'peso' => $data['peso'] ?? $producto->peso,
                'unidad_medida_id' => $data['unidad_medida_id'] ?? $producto->unidad_medida_id,
                'categoria_id' => $data['categoria_id'] ?? $producto->categoria_id,
                'marca_id' => $data['marca_id'] ?? $producto->marca_id,
                'proveedor_id' => $data['proveedor_id'] ?? $producto->proveedor_id,
                'stock_minimo' => $data['stock_minimo'] ?? $producto->stock_minimo,
                'stock_maximo' => $data['stock_maximo'] ?? $producto->stock_maximo,
                'activo' => $data['activo'] ?? $producto->activo,
            ]);

            // Codigos sólo si vienen
            if ($request->has('codigos')) {
                $producto->codigosBarra()->update(['activo' => false]);
                $codigosValidos = [];
                if (! empty($data['codigos']) && is_array($data['codigos'])) {
                    $codigosValidos = array_values(array_filter(array_map(fn ($c) => is_string($c) ? trim($c) : '', $data['codigos']), fn ($c) => $c !== ''));
                }
                if (! empty($codigosValidos)) {
                    foreach ($codigosValidos as $index => $codigo) {
                        $existente = $producto->codigosBarra()->where('codigo', $codigo)->first();
                        if ($existente) {
                            $existente->update(['es_principal' => $index === 0, 'activo' => true]);
                        } else {
                            CodigoBarra::create([
                                'producto_id' => $producto->id,
                                'codigo' => $codigo,
                                'tipo' => 'EAN',
                                'es_principal' => $index === 0,
                                'activo' => true,
                            ]);
                        }
                    }
                    $principal = $codigosValidos[0];
                    $producto->update(['codigo_barras' => $principal, 'codigo_qr' => $principal]);
                }
            }

            // Precios s��lo si vienen
            if ($request->has('precios')) {
                $producto->precios()->update(['activo' => false]);
                if (! empty($data['precios']) && is_array($data['precios'])) {
                    $montoBase = 0.0;
                    foreach ($data['precios'] as $pp) {
                        $tpIdTmp = $pp['tipo_precio_id'] ?? $this->determinarTipoPrecioId($pp['nombre'] ?? '');
                        $tpTmp = TipoPrecio::find($tpIdTmp);
                        if ($tpTmp && $tpTmp->es_precio_base) {
                            $montoBase = (float) ($pp['monto'] ?? 0);
                            break;
                        }
                    }
                    foreach ($data['precios'] as $precioData) {
                        // Validar que tenga monto válido
                        if (empty($precioData['monto']) || ! is_numeric($precioData['monto'])) {
                            continue;
                        }

                        $tipoPrecioId = $precioData['tipo_precio_id'] ?? null;
                        $tipoPrecio = TipoPrecio::find($tipoPrecioId);

                        if (! $tipoPrecio) {
                            continue; // Si no existe el tipo de precio, saltarlo
                        }

                        $monto = (float) $precioData['monto'];
                        $esBase = (bool) $tipoPrecio->es_precio_base;
                        $margen = $esBase ? 0.0 : max(0.0, $monto - $montoBase);
                        $porcentaje = ($esBase || $montoBase <= 0) ? 0.0 : (($monto - $montoBase) / max($montoBase, 1)) * 100;

                        // Generar nombre automáticamente basado en el tipo de precio
                        $nombre = $precioData['nombre'] ?? $tipoPrecio->nombre;

                        PrecioProducto::create([
                            'producto_id' => $producto->id,
                            'nombre' => $nombre,
                            'precio' => $monto,
                            'tipo_precio_id' => $tipoPrecioId,
                            'es_precio_base' => $esBase,
                            'margen_ganancia' => $margen,
                            'porcentaje_ganancia' => $porcentaje,
                            'activo' => true,
                            'fecha_ultima_actualizacion' => now(),
                        ]);
                    }
                }
            }

            // Eliminar imágenes de galería marcadas
            $galeriaEliminar = $request->input('galeria_eliminar', []);
            if (is_array($galeriaEliminar) && ! empty($galeriaEliminar)) {
                $imagenes = ImagenProducto::whereIn('id', $galeriaEliminar)->where('producto_id', $producto->id)->get();
                foreach ($imagenes as $img) {
                    $path = str_replace(Storage::disk('public')->url('/'), '', $img->url);
                    if ($path) {
                        Storage::disk('public')->delete($path);
                    }
                    $img->delete();
                }
            }

            // Quitar perfil si se solicitó
            if ($request->boolean('remove_perfil')) {
                $perfilActual = $producto->imagenes()->where('es_principal', true)->first();
                if ($perfilActual) {
                    $path = str_replace(Storage::disk('public')->url('/'), '', $perfilActual->url);
                    if ($path) {
                        Storage::disk('public')->delete($path);
                    }
                    $perfilActual->delete();
                }
            }

            // Reemplazar perfil si viene nuevo
            if ($request->hasFile('perfil')) {
                ImagenProducto::where('producto_id', $producto->id)->update(['es_principal' => false]);
                $file = $request->file('perfil');
                $path = $file->store('productos', 'public');
                ImagenProducto::create([
                    'producto_id' => $producto->id,
                    'url' => Storage::disk('public')->url($path),
                    'es_principal' => true,
                    'orden' => 0,
                ]);
            }
            // anexar nuevas galería
            if ($request->hasFile('galeria')) {
                $currentMaxOrden = (int) ($producto->imagenes()->max('orden') ?? -1);
                foreach ($request->file('galeria') as $idx => $file) {
                    $path = $file->store('productos', 'public');
                    ImagenProducto::create([
                        'producto_id' => $producto->id,
                        'url' => Storage::disk('public')->url($path),
                        'es_principal' => false,
                        'orden' => $currentMaxOrden + 1 + $idx,
                    ]);
                }
            }
        });

        return redirect()->route('productos.edit', $producto->id)->with('success', 'Producto actualizado correctamente');
    }

    public function destroy(Producto $producto): RedirectResponse
    {
        // delete images files too
        foreach ($producto->imagenes as $img) {
            $path = str_replace(Storage::disk('public')->url('/'), '', $img->url);
            if ($path) {
                Storage::disk('public')->delete($path);
            }
        }
        $producto->imagenes()->delete();
        $producto->delete();

        return redirect()->route('productos.index')->with('success', 'Producto eliminado');
    }

    /**
     * Determinar el ID del tipo de precio basado en el nombre
     */
    private function determinarTipoPrecioId(string $nombre): int
    {
        $nombre = strtolower($nombre);

        if (str_contains($nombre, 'costo') || str_contains($nombre, 'compra')) {
            return TipoPrecio::porCodigo('COSTO')?->id ?? 1;
        }
        if (str_contains($nombre, 'mayor') || str_contains($nombre, 'mayorista')) {
            return TipoPrecio::porCodigo('POR_MAYOR')?->id ?? 3;
        }
        if (str_contains($nombre, 'distribuidor')) {
            return TipoPrecio::porCodigo('DISTRIBUIDOR')?->id ?? 5;
        }
        if (str_contains($nombre, 'promocional') || str_contains($nombre, 'promoción')) {
            return TipoPrecio::porCodigo('PROMOCIONAL')?->id ?? 6;
        }
        if (str_contains($nombre, 'facturado')) {
            return TipoPrecio::porCodigo('FACTURADO')?->id ?? 4;
        }

        // Por defecto, precio de venta
        return TipoPrecio::porCodigo('VENTA')?->id ?? 2;
    }

    // ================================
    // MÉTODOS API
    // ================================

    /**
     * API: Listar productos
     */
    public function indexApi(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 20);
        $q = $request->string('q');
        $categoriaId = $request->integer('categoria_id');
        $marcaId = $request->integer('marca_id');
        $proveedorId = $request->integer('proveedor_id');
        $activo = $request->boolean('activo', true);

        $productos = Producto::with(['categoria:id,nombre', 'marca:id,nombre', 'proveedor:id,nombre,razon_social', 'unidadMedida:id,nombre'])
            ->when($q, fn ($query) => $query->where(function ($subQuery) use ($q) {
                $subQuery->where('nombre', 'ilike', "%$q%")
                    ->orWhere('codigo_barras', 'ilike', "%$q%")
                    ->orWhere('codigo_qr', 'ilike', "%$q%")
                    ->orWhere('descripcion', 'ilike', "%$q%");
            }))
            ->when($categoriaId, fn ($query) => $query->where('categoria_id', $categoriaId))
            ->when($marcaId, fn ($query) => $query->where('marca_id', $marcaId))
            ->when($proveedorId, fn ($query) => $query->where('proveedor_id', $proveedorId))
            ->where('activo', $activo)
            ->orderBy('nombre')
            ->paginate($perPage);

        return ApiResponse::success($productos);
    }

    /**
     * API: Mostrar producto específico
     */
    public function showApi(Producto $producto): JsonResponse
    {
        $producto->load([
            'categoria:id,nombre',
            'marca:id,nombre',
            'proveedor:id,nombre,razon_social',
            'unidadMedida:id,nombre',
            'stock.almacen:id,nombre',
            'precios.tipoPrecio:id,nombre',
            'codigosBarra',
            'imagenes',
        ]);

        return ApiResponse::success($producto);
    }

    /**
     * API: Crear producto
     */
    public function storeApi(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'codigo' => ['nullable', 'string', 'max:100', 'unique:productos,codigo'],
            'descripcion' => ['nullable', 'string'],
            'categoria_id' => ['required', 'exists:categorias,id'],
            'marca_id' => ['nullable', 'exists:marcas,id'],
            'proveedor_id' => ['nullable', 'exists:proveedores,id'],
            'unidad_medida_id' => ['required', 'exists:unidad_medidas,id'],
            'precio_compra' => ['required', 'numeric', 'min:0'],
            'precio_venta' => ['required', 'numeric', 'min:0'],
            'stock_minimo' => ['required', 'integer', 'min:0'],
            'stock_maximo' => ['required', 'integer', 'min:0'],
            'activo' => ['boolean'],
        ]);

        try {
            $producto = DB::transaction(function () use ($data) {
                $producto = Producto::create($data);

                // Crear precio base
                PrecioProducto::create([
                    'producto_id' => $producto->id,
                    'tipo_precio_id' => TipoPrecio::porCodigo('VENTA')?->id ?? 2,
                    'valor' => $data['precio_venta'],
                    'activo' => true,
                ]);

                return $producto;
            });

            return ApiResponse::success(
                $producto->load(['categoria', 'marca', 'proveedor', 'unidadMedida']),
                'Producto creado exitosamente',
                201
            );

        } catch (\Exception $e) {
            return ApiResponse::error('Error al crear producto: '.$e->getMessage(), 500);
        }
    }

    /**
     * API: Actualizar producto
     */
    public function updateApi(Request $request, Producto $producto): JsonResponse
    {
        $data = $request->validate([
            'nombre' => ['sometimes', 'required', 'string', 'max:255'],
            'codigo' => ['nullable', 'string', 'max:100', 'unique:productos,codigo,'.$producto->id],
            'descripcion' => ['nullable', 'string'],
            'categoria_id' => ['sometimes', 'required', 'exists:categorias,id'],
            'marca_id' => ['nullable', 'exists:marcas,id'],
            'proveedor_id' => ['nullable', 'exists:proveedores,id'],
            'unidad_medida_id' => ['sometimes', 'required', 'exists:unidad_medidas,id'],
            'precio_compra' => ['sometimes', 'required', 'numeric', 'min:0'],
            'precio_venta' => ['sometimes', 'required', 'numeric', 'min:0'],
            'stock_minimo' => ['sometimes', 'required', 'integer', 'min:0'],
            'stock_maximo' => ['sometimes', 'required', 'integer', 'min:0'],
            'activo' => ['boolean'],
        ]);

        try {
            $producto->update($data);

            return ApiResponse::success(
                $producto->fresh(['categoria', 'marca', 'proveedor', 'unidadMedida']),
                'Producto actualizado exitosamente'
            );

        } catch (\Exception $e) {
            return ApiResponse::error('Error al actualizar producto: '.$e->getMessage(), 500);
        }
    }

    /**
     * API: Eliminar producto
     */
    public function destroyApi(Producto $producto): JsonResponse
    {
        try {
            // Verificar si tiene stock
            $tieneStock = $producto->stock()->where('cantidad', '>', 0)->exists();
            if ($tieneStock) {
                return ApiResponse::error('No se puede eliminar un producto con stock', 400);
            }

            // Verificar si tiene movimientos
            $tieneMovimientos = $producto->stock()->whereHas('movimientos')->exists();
            if ($tieneMovimientos) {
                // Solo desactivar
                $producto->update(['activo' => false]);

                return ApiResponse::success(null, 'Producto desactivado (tiene historial de movimientos)');
            }

            // Eliminar completamente
            $producto->delete();

            return ApiResponse::success(null, 'Producto eliminado exitosamente');

        } catch (\Exception $e) {
            return ApiResponse::error('Error al eliminar producto: '.$e->getMessage(), 500);
        }
    }

    /**
     * API: Buscar productos para autocompletado
     */
    public function buscarApi(Request $request): JsonResponse
    {
        $q = $request->string('q');
        $limite = $request->integer('limite', 10);

        if (! $q || strlen($q) < 2) {
            return ApiResponse::success([]);
        }

        $productos = Producto::select(['id', 'nombre', 'codigo_barras', 'categoria_id', 'marca_id'])
            ->where('activo', true)
            ->where(function ($query) use ($q) {
                $query->where('nombre', 'LIKE', "%$q%")
                    ->orWhere('codigo_barras', 'LIKE', "%$q%")
                    ->orWhereHas('codigosBarra', function ($codigoQuery) use ($q) {
                        $codigoQuery->where('codigo', 'LIKE', "%$q%");
                    });
            })
            ->with([
                'codigosBarra:id,producto_id,codigo',
                'categoria:id,nombre',
                'marca:id,nombre',
                'precios' => function ($query) {
                    $query->select(['id', 'producto_id', 'precio', 'es_precio_base'])
                        ->activos()
                        ->precioBase()
                        ->orderBy('es_precio_base', 'desc')
                        ->limit(1);
                },
                'stock' => function ($query) {
                    $query->select(['producto_id', 'cantidad_disponible']);
                },
            ])
            ->limit($limite)
            ->get()
            ->map(function ($producto) {
                // Incluir códigos de barras en la respuesta
                $codigosTexto = $producto->codigosBarra->pluck('codigo')->toArray();

                // Calcular stock total
                $stockTotal = $producto->stock->sum('cantidad_disponible');

                // Obtener precio base
                $precioBase = $producto->precios->first()?->precio ?? 0;

                return [
                    'id' => $producto->id,
                    'nombre' => $producto->nombre,
                    'codigo_barras' => $producto->codigo_barras,
                    'codigos_barras' => $codigosTexto,
                    'precio_base' => $precioBase,
                    'stock_total' => $stockTotal,
                    'categoria' => $producto->categoria?->nombre ?? '',
                    'marca' => $producto->marca?->nombre ?? '',
                ];
            });

        return ApiResponse::success($productos);
    }
}
