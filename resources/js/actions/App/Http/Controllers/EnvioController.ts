import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EnvioController::enviosCliente
 * @see [unknown]:0
 * @route '/api/app/cliente/envios'
 */
export const enviosCliente = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: enviosCliente.url(options),
    method: 'get',
})

enviosCliente.definition = {
    methods: ["get","head"],
    url: '/api/app/cliente/envios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EnvioController::enviosCliente
 * @see [unknown]:0
 * @route '/api/app/cliente/envios'
 */
enviosCliente.url = (options?: RouteQueryOptions) => {
    return enviosCliente.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EnvioController::enviosCliente
 * @see [unknown]:0
 * @route '/api/app/cliente/envios'
 */
enviosCliente.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: enviosCliente.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EnvioController::enviosCliente
 * @see [unknown]:0
 * @route '/api/app/cliente/envios'
 */
enviosCliente.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: enviosCliente.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EnvioController::enviosCliente
 * @see [unknown]:0
 * @route '/api/app/cliente/envios'
 */
    const enviosClienteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: enviosCliente.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EnvioController::enviosCliente
 * @see [unknown]:0
 * @route '/api/app/cliente/envios'
 */
        enviosClienteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: enviosCliente.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EnvioController::enviosCliente
 * @see [unknown]:0
 * @route '/api/app/cliente/envios'
 */
        enviosClienteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: enviosCliente.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    enviosCliente.form = enviosClienteForm
/**
* @see \App\Http\Controllers\EnvioController::seguimientoApi
 * @see [unknown]:0
 * @route '/api/app/envios/{envio}/seguimiento'
 */
export const seguimientoApi = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: seguimientoApi.url(args, options),
    method: 'get',
})

seguimientoApi.definition = {
    methods: ["get","head"],
    url: '/api/app/envios/{envio}/seguimiento',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EnvioController::seguimientoApi
 * @see [unknown]:0
 * @route '/api/app/envios/{envio}/seguimiento'
 */
seguimientoApi.url = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { envio: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    envio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        envio: args.envio,
                }

    return seguimientoApi.definition.url
            .replace('{envio}', parsedArgs.envio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EnvioController::seguimientoApi
 * @see [unknown]:0
 * @route '/api/app/envios/{envio}/seguimiento'
 */
seguimientoApi.get = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: seguimientoApi.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EnvioController::seguimientoApi
 * @see [unknown]:0
 * @route '/api/app/envios/{envio}/seguimiento'
 */
seguimientoApi.head = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: seguimientoApi.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EnvioController::seguimientoApi
 * @see [unknown]:0
 * @route '/api/app/envios/{envio}/seguimiento'
 */
    const seguimientoApiForm = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: seguimientoApi.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EnvioController::seguimientoApi
 * @see [unknown]:0
 * @route '/api/app/envios/{envio}/seguimiento'
 */
        seguimientoApiForm.get = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: seguimientoApi.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EnvioController::seguimientoApi
 * @see [unknown]:0
 * @route '/api/app/envios/{envio}/seguimiento'
 */
        seguimientoApiForm.head = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: seguimientoApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    seguimientoApi.form = seguimientoApiForm
/**
* @see \App\Http\Controllers\EnvioController::actualizarUbicacion
 * @see [unknown]:0
 * @route '/api/app/envios/{envio}/ubicacion'
 */
export const actualizarUbicacion = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarUbicacion.url(args, options),
    method: 'post',
})

actualizarUbicacion.definition = {
    methods: ["post"],
    url: '/api/app/envios/{envio}/ubicacion',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EnvioController::actualizarUbicacion
 * @see [unknown]:0
 * @route '/api/app/envios/{envio}/ubicacion'
 */
actualizarUbicacion.url = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { envio: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    envio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        envio: args.envio,
                }

    return actualizarUbicacion.definition.url
            .replace('{envio}', parsedArgs.envio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EnvioController::actualizarUbicacion
 * @see [unknown]:0
 * @route '/api/app/envios/{envio}/ubicacion'
 */
actualizarUbicacion.post = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarUbicacion.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EnvioController::actualizarUbicacion
 * @see [unknown]:0
 * @route '/api/app/envios/{envio}/ubicacion'
 */
    const actualizarUbicacionForm = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarUbicacion.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EnvioController::actualizarUbicacion
 * @see [unknown]:0
 * @route '/api/app/envios/{envio}/ubicacion'
 */
        actualizarUbicacionForm.post = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarUbicacion.url(args, options),
            method: 'post',
        })
    
    actualizarUbicacion.form = actualizarUbicacionForm
/**
* @see \App\Http\Controllers\EnvioController::dashboardStats
 * @see [unknown]:0
 * @route '/api/logistica/dashboard/stats'
 */
export const dashboardStats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardStats.url(options),
    method: 'get',
})

dashboardStats.definition = {
    methods: ["get","head"],
    url: '/api/logistica/dashboard/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EnvioController::dashboardStats
 * @see [unknown]:0
 * @route '/api/logistica/dashboard/stats'
 */
dashboardStats.url = (options?: RouteQueryOptions) => {
    return dashboardStats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EnvioController::dashboardStats
 * @see [unknown]:0
 * @route '/api/logistica/dashboard/stats'
 */
dashboardStats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardStats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EnvioController::dashboardStats
 * @see [unknown]:0
 * @route '/api/logistica/dashboard/stats'
 */
dashboardStats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboardStats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EnvioController::dashboardStats
 * @see [unknown]:0
 * @route '/api/logistica/dashboard/stats'
 */
    const dashboardStatsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboardStats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EnvioController::dashboardStats
 * @see [unknown]:0
 * @route '/api/logistica/dashboard/stats'
 */
        dashboardStatsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardStats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EnvioController::dashboardStats
 * @see [unknown]:0
 * @route '/api/logistica/dashboard/stats'
 */
        dashboardStatsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardStats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboardStats.form = dashboardStatsForm
/**
* @see \App\Http\Controllers\EnvioController::index
 * @see [unknown]:0
 * @route '/api/envios'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/envios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EnvioController::index
 * @see [unknown]:0
 * @route '/api/envios'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EnvioController::index
 * @see [unknown]:0
 * @route '/api/envios'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EnvioController::index
 * @see [unknown]:0
 * @route '/api/envios'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EnvioController::index
 * @see [unknown]:0
 * @route '/api/envios'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EnvioController::index
 * @see [unknown]:0
 * @route '/api/envios'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EnvioController::index
 * @see [unknown]:0
 * @route '/api/envios'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\EnvioController::seguimiento
 * @see [unknown]:0
 * @route '/api/envios/{envio}/seguimiento'
 */
export const seguimiento = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: seguimiento.url(args, options),
    method: 'get',
})

seguimiento.definition = {
    methods: ["get","head"],
    url: '/api/envios/{envio}/seguimiento',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EnvioController::seguimiento
 * @see [unknown]:0
 * @route '/api/envios/{envio}/seguimiento'
 */
seguimiento.url = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { envio: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    envio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        envio: args.envio,
                }

    return seguimiento.definition.url
            .replace('{envio}', parsedArgs.envio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EnvioController::seguimiento
 * @see [unknown]:0
 * @route '/api/envios/{envio}/seguimiento'
 */
seguimiento.get = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: seguimiento.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EnvioController::seguimiento
 * @see [unknown]:0
 * @route '/api/envios/{envio}/seguimiento'
 */
seguimiento.head = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: seguimiento.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EnvioController::seguimiento
 * @see [unknown]:0
 * @route '/api/envios/{envio}/seguimiento'
 */
    const seguimientoForm = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: seguimiento.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EnvioController::seguimiento
 * @see [unknown]:0
 * @route '/api/envios/{envio}/seguimiento'
 */
        seguimientoForm.get = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: seguimiento.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EnvioController::seguimiento
 * @see [unknown]:0
 * @route '/api/envios/{envio}/seguimiento'
 */
        seguimientoForm.head = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: seguimiento.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    seguimiento.form = seguimientoForm
/**
* @see \App\Http\Controllers\EnvioController::actualizarEstado
 * @see [unknown]:0
 * @route '/api/envios/{envio}/estado'
 */
export const actualizarEstado = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarEstado.url(args, options),
    method: 'post',
})

actualizarEstado.definition = {
    methods: ["post"],
    url: '/api/envios/{envio}/estado',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EnvioController::actualizarEstado
 * @see [unknown]:0
 * @route '/api/envios/{envio}/estado'
 */
actualizarEstado.url = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { envio: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    envio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        envio: args.envio,
                }

    return actualizarEstado.definition.url
            .replace('{envio}', parsedArgs.envio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EnvioController::actualizarEstado
 * @see [unknown]:0
 * @route '/api/envios/{envio}/estado'
 */
actualizarEstado.post = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarEstado.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EnvioController::actualizarEstado
 * @see [unknown]:0
 * @route '/api/envios/{envio}/estado'
 */
    const actualizarEstadoForm = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarEstado.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EnvioController::actualizarEstado
 * @see [unknown]:0
 * @route '/api/envios/{envio}/estado'
 */
        actualizarEstadoForm.post = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarEstado.url(args, options),
            method: 'post',
        })
    
    actualizarEstado.form = actualizarEstadoForm
const EnvioController = { enviosCliente, seguimientoApi, actualizarUbicacion, dashboardStats, index, seguimiento, actualizarEstado }

export default EnvioController