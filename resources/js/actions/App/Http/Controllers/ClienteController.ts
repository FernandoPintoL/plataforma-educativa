import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClienteController::indexApi
 * @see app/Http/Controllers/ClienteController.php:397
 * @route '/api/clientes'
 */
export const indexApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi.url(options),
    method: 'get',
})

indexApi.definition = {
    methods: ["get","head"],
    url: '/api/clientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::indexApi
 * @see app/Http/Controllers/ClienteController.php:397
 * @route '/api/clientes'
 */
indexApi.url = (options?: RouteQueryOptions) => {
    return indexApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::indexApi
 * @see app/Http/Controllers/ClienteController.php:397
 * @route '/api/clientes'
 */
indexApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::indexApi
 * @see app/Http/Controllers/ClienteController.php:397
 * @route '/api/clientes'
 */
indexApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::indexApi
 * @see app/Http/Controllers/ClienteController.php:397
 * @route '/api/clientes'
 */
    const indexApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::indexApi
 * @see app/Http/Controllers/ClienteController.php:397
 * @route '/api/clientes'
 */
        indexApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::indexApi
 * @see app/Http/Controllers/ClienteController.php:397
 * @route '/api/clientes'
 */
        indexApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexApi.form = indexApiForm
/**
* @see \App\Http\Controllers\ClienteController::storeApi
 * @see app/Http/Controllers/ClienteController.php:437
 * @route '/api/clientes'
 */
export const storeApi = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApi.url(options),
    method: 'post',
})

storeApi.definition = {
    methods: ["post"],
    url: '/api/clientes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClienteController::storeApi
 * @see app/Http/Controllers/ClienteController.php:437
 * @route '/api/clientes'
 */
storeApi.url = (options?: RouteQueryOptions) => {
    return storeApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::storeApi
 * @see app/Http/Controllers/ClienteController.php:437
 * @route '/api/clientes'
 */
storeApi.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApi.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClienteController::storeApi
 * @see app/Http/Controllers/ClienteController.php:437
 * @route '/api/clientes'
 */
    const storeApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeApi.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::storeApi
 * @see app/Http/Controllers/ClienteController.php:437
 * @route '/api/clientes'
 */
        storeApiForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeApi.url(options),
            method: 'post',
        })
    
    storeApi.form = storeApiForm
/**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:832
 * @route '/api/clientes/buscar'
 */
export const buscarApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi.url(options),
    method: 'get',
})

buscarApi.definition = {
    methods: ["get","head"],
    url: '/api/clientes/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:832
 * @route '/api/clientes/buscar'
 */
buscarApi.url = (options?: RouteQueryOptions) => {
    return buscarApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:832
 * @route '/api/clientes/buscar'
 */
buscarApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:832
 * @route '/api/clientes/buscar'
 */
buscarApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:832
 * @route '/api/clientes/buscar'
 */
    const buscarApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:832
 * @route '/api/clientes/buscar'
 */
        buscarApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:832
 * @route '/api/clientes/buscar'
 */
        buscarApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarApi.form = buscarApiForm
/**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:418
 * @route '/api/clientes/{cliente}'
 */
export const showApi = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})

showApi.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:418
 * @route '/api/clientes/{cliente}'
 */
showApi.url = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return showApi.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:418
 * @route '/api/clientes/{cliente}'
 */
showApi.get = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:418
 * @route '/api/clientes/{cliente}'
 */
showApi.head = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showApi.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:418
 * @route '/api/clientes/{cliente}'
 */
    const showApiForm = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showApi.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:418
 * @route '/api/clientes/{cliente}'
 */
        showApiForm.get = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApi.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:418
 * @route '/api/clientes/{cliente}'
 */
        showApiForm.head = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showApi.form = showApiForm
/**
* @see \App\Http\Controllers\ClienteController::updateApi
 * @see app/Http/Controllers/ClienteController.php:635
 * @route '/api/clientes/{cliente}'
 */
export const updateApi = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateApi.url(args, options),
    method: 'put',
})

updateApi.definition = {
    methods: ["put"],
    url: '/api/clientes/{cliente}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ClienteController::updateApi
 * @see app/Http/Controllers/ClienteController.php:635
 * @route '/api/clientes/{cliente}'
 */
updateApi.url = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return updateApi.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::updateApi
 * @see app/Http/Controllers/ClienteController.php:635
 * @route '/api/clientes/{cliente}'
 */
updateApi.put = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateApi.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ClienteController::updateApi
 * @see app/Http/Controllers/ClienteController.php:635
 * @route '/api/clientes/{cliente}'
 */
    const updateApiForm = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateApi.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::updateApi
 * @see app/Http/Controllers/ClienteController.php:635
 * @route '/api/clientes/{cliente}'
 */
        updateApiForm.put = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateApi.form = updateApiForm
/**
* @see \App\Http\Controllers\ClienteController::destroyApi
 * @see app/Http/Controllers/ClienteController.php:801
 * @route '/api/clientes/{cliente}'
 */
export const destroyApi = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyApi.url(args, options),
    method: 'delete',
})

destroyApi.definition = {
    methods: ["delete"],
    url: '/api/clientes/{cliente}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ClienteController::destroyApi
 * @see app/Http/Controllers/ClienteController.php:801
 * @route '/api/clientes/{cliente}'
 */
destroyApi.url = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return destroyApi.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::destroyApi
 * @see app/Http/Controllers/ClienteController.php:801
 * @route '/api/clientes/{cliente}'
 */
destroyApi.delete = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyApi.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ClienteController::destroyApi
 * @see app/Http/Controllers/ClienteController.php:801
 * @route '/api/clientes/{cliente}'
 */
    const destroyApiForm = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyApi.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::destroyApi
 * @see app/Http/Controllers/ClienteController.php:801
 * @route '/api/clientes/{cliente}'
 */
        destroyApiForm.delete = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyApi.form = destroyApiForm
/**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:858
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
export const saldoCuentasPorCobrar = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: saldoCuentasPorCobrar.url(args, options),
    method: 'get',
})

saldoCuentasPorCobrar.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/saldo-cuentas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:858
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
saldoCuentasPorCobrar.url = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return saldoCuentasPorCobrar.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:858
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
saldoCuentasPorCobrar.get = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: saldoCuentasPorCobrar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:858
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
saldoCuentasPorCobrar.head = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: saldoCuentasPorCobrar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:858
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
    const saldoCuentasPorCobrarForm = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: saldoCuentasPorCobrar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:858
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
        saldoCuentasPorCobrarForm.get = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: saldoCuentasPorCobrar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:858
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
        saldoCuentasPorCobrarForm.head = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: saldoCuentasPorCobrar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    saldoCuentasPorCobrar.form = saldoCuentasPorCobrarForm
/**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:883
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
export const historialVentas = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialVentas.url(args, options),
    method: 'get',
})

historialVentas.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/historial-ventas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:883
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
historialVentas.url = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return historialVentas.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:883
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
historialVentas.get = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialVentas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:883
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
historialVentas.head = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historialVentas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:883
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
    const historialVentasForm = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historialVentas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:883
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
        historialVentasForm.get = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialVentas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:883
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
        historialVentasForm.head = (args: { cliente: string | number | { id: string | number } } | [cliente: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialVentas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historialVentas.form = historialVentasForm
/**
* @see \App\Http\Controllers\ClienteController::cambiarCredenciales
 * @see app/Http/Controllers/ClienteController.php:920
 * @route '/api/clientes/cambiar-credenciales'
 */
export const cambiarCredenciales = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cambiarCredenciales.url(options),
    method: 'post',
})

cambiarCredenciales.definition = {
    methods: ["post"],
    url: '/api/clientes/cambiar-credenciales',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClienteController::cambiarCredenciales
 * @see app/Http/Controllers/ClienteController.php:920
 * @route '/api/clientes/cambiar-credenciales'
 */
cambiarCredenciales.url = (options?: RouteQueryOptions) => {
    return cambiarCredenciales.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::cambiarCredenciales
 * @see app/Http/Controllers/ClienteController.php:920
 * @route '/api/clientes/cambiar-credenciales'
 */
cambiarCredenciales.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cambiarCredenciales.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClienteController::cambiarCredenciales
 * @see app/Http/Controllers/ClienteController.php:920
 * @route '/api/clientes/cambiar-credenciales'
 */
    const cambiarCredencialesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cambiarCredenciales.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::cambiarCredenciales
 * @see app/Http/Controllers/ClienteController.php:920
 * @route '/api/clientes/cambiar-credenciales'
 */
        cambiarCredencialesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cambiarCredenciales.url(options),
            method: 'post',
        })
    
    cambiarCredenciales.form = cambiarCredencialesForm
const ClienteController = { indexApi, storeApi, buscarApi, showApi, updateApi, destroyApi, saldoCuentasPorCobrar, historialVentas, cambiarCredenciales }

export default ClienteController