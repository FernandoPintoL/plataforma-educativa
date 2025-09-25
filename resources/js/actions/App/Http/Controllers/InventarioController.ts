import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/inventario/buscar-productos'
 */
export const buscarProductos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarProductos.url(options),
    method: 'get',
})

buscarProductos.definition = {
    methods: ["get","head"],
    url: '/api/inventario/buscar-productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/inventario/buscar-productos'
 */
buscarProductos.url = (options?: RouteQueryOptions) => {
    return buscarProductos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/inventario/buscar-productos'
 */
buscarProductos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarProductos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/inventario/buscar-productos'
 */
buscarProductos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarProductos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/inventario/buscar-productos'
 */
    const buscarProductosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarProductos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/inventario/buscar-productos'
 */
        buscarProductosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarProductos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/inventario/buscar-productos'
 */
        buscarProductosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarProductos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarProductos.form = buscarProductosForm
/**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/inventario/stock-producto/{producto}'
 */
export const stockProducto = (args: { producto: string | number | { id: string | number } } | [producto: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockProducto.url(args, options),
    method: 'get',
})

stockProducto.definition = {
    methods: ["get","head"],
    url: '/api/inventario/stock-producto/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/inventario/stock-producto/{producto}'
 */
stockProducto.url = (args: { producto: string | number | { id: string | number } } | [producto: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { producto: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                }

    return stockProducto.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/inventario/stock-producto/{producto}'
 */
stockProducto.get = (args: { producto: string | number | { id: string | number } } | [producto: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockProducto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/inventario/stock-producto/{producto}'
 */
stockProducto.head = (args: { producto: string | number | { id: string | number } } | [producto: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockProducto.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/inventario/stock-producto/{producto}'
 */
    const stockProductoForm = (args: { producto: string | number | { id: string | number } } | [producto: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockProducto.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/inventario/stock-producto/{producto}'
 */
        stockProductoForm.get = (args: { producto: string | number | { id: string | number } } | [producto: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockProducto.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/inventario/stock-producto/{producto}'
 */
        stockProductoForm.head = (args: { producto: string | number | { id: string | number } } | [producto: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockProducto.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockProducto.form = stockProductoForm
/**
* @see \App\Http\Controllers\InventarioController::procesarAjusteApi
 * @see app/Http/Controllers/InventarioController.php:429
 * @route '/api/inventario/ajustes'
 */
export const procesarAjusteApi = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarAjusteApi.url(options),
    method: 'post',
})

procesarAjusteApi.definition = {
    methods: ["post"],
    url: '/api/inventario/ajustes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::procesarAjusteApi
 * @see app/Http/Controllers/InventarioController.php:429
 * @route '/api/inventario/ajustes'
 */
procesarAjusteApi.url = (options?: RouteQueryOptions) => {
    return procesarAjusteApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::procesarAjusteApi
 * @see app/Http/Controllers/InventarioController.php:429
 * @route '/api/inventario/ajustes'
 */
procesarAjusteApi.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarAjusteApi.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::procesarAjusteApi
 * @see app/Http/Controllers/InventarioController.php:429
 * @route '/api/inventario/ajustes'
 */
    const procesarAjusteApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: procesarAjusteApi.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::procesarAjusteApi
 * @see app/Http/Controllers/InventarioController.php:429
 * @route '/api/inventario/ajustes'
 */
        procesarAjusteApiForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: procesarAjusteApi.url(options),
            method: 'post',
        })
    
    procesarAjusteApi.form = procesarAjusteApiForm
/**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:484
 * @route '/api/inventario/movimientos'
 */
export const movimientosApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosApi.url(options),
    method: 'get',
})

movimientosApi.definition = {
    methods: ["get","head"],
    url: '/api/inventario/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:484
 * @route '/api/inventario/movimientos'
 */
movimientosApi.url = (options?: RouteQueryOptions) => {
    return movimientosApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:484
 * @route '/api/inventario/movimientos'
 */
movimientosApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:484
 * @route '/api/inventario/movimientos'
 */
movimientosApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientosApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:484
 * @route '/api/inventario/movimientos'
 */
    const movimientosApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: movimientosApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:484
 * @route '/api/inventario/movimientos'
 */
        movimientosApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientosApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:484
 * @route '/api/inventario/movimientos'
 */
        movimientosApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientosApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    movimientosApi.form = movimientosApiForm
/**
* @see \App\Http\Controllers\InventarioController::crearMovimiento
 * @see app/Http/Controllers/InventarioController.php:512
 * @route '/api/inventario/movimientos'
 */
export const crearMovimiento = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearMovimiento.url(options),
    method: 'post',
})

crearMovimiento.definition = {
    methods: ["post"],
    url: '/api/inventario/movimientos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::crearMovimiento
 * @see app/Http/Controllers/InventarioController.php:512
 * @route '/api/inventario/movimientos'
 */
crearMovimiento.url = (options?: RouteQueryOptions) => {
    return crearMovimiento.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::crearMovimiento
 * @see app/Http/Controllers/InventarioController.php:512
 * @route '/api/inventario/movimientos'
 */
crearMovimiento.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearMovimiento.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::crearMovimiento
 * @see app/Http/Controllers/InventarioController.php:512
 * @route '/api/inventario/movimientos'
 */
    const crearMovimientoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: crearMovimiento.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::crearMovimiento
 * @see app/Http/Controllers/InventarioController.php:512
 * @route '/api/inventario/movimientos'
 */
        crearMovimientoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: crearMovimiento.url(options),
            method: 'post',
        })
    
    crearMovimiento.form = crearMovimientoForm
const InventarioController = { buscarProductos, stockProducto, procesarAjusteApi, movimientosApi, crearMovimiento }

export default InventarioController