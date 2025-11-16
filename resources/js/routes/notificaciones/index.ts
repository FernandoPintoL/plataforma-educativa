import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\NotificacionController::index
 * @see app/Http/Controllers/Api/NotificacionController.php:19
 * @route '/api/notificaciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificacionController::index
 * @see app/Http/Controllers/Api/NotificacionController.php:19
 * @route '/api/notificaciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificacionController::index
 * @see app/Http/Controllers/Api/NotificacionController.php:19
 * @route '/api/notificaciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificacionController::index
 * @see app/Http/Controllers/Api/NotificacionController.php:19
 * @route '/api/notificaciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificacionController::index
 * @see app/Http/Controllers/Api/NotificacionController.php:19
 * @route '/api/notificaciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificacionController::index
 * @see app/Http/Controllers/Api/NotificacionController.php:19
 * @route '/api/notificaciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificacionController::index
 * @see app/Http/Controllers/Api/NotificacionController.php:19
 * @route '/api/notificaciones'
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
 * @see routes/web.php:344
 * @route '/notificaciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/notificaciones',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:344
 * @route '/notificaciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:344
 * @route '/notificaciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:344
 * @route '/notificaciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:344
 * @route '/notificaciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:344
 * @route '/notificaciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:344
 * @route '/notificaciones'
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
* @see \App\Http\Controllers\Api\NotificacionController::noLeidas
 * @see app/Http/Controllers/Api/NotificacionController.php:44
 * @route '/api/notificaciones/no-leidas'
 */
export const noLeidas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: noLeidas.url(options),
    method: 'get',
})

noLeidas.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/no-leidas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificacionController::noLeidas
 * @see app/Http/Controllers/Api/NotificacionController.php:44
 * @route '/api/notificaciones/no-leidas'
 */
noLeidas.url = (options?: RouteQueryOptions) => {
    return noLeidas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificacionController::noLeidas
 * @see app/Http/Controllers/Api/NotificacionController.php:44
 * @route '/api/notificaciones/no-leidas'
 */
noLeidas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: noLeidas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificacionController::noLeidas
 * @see app/Http/Controllers/Api/NotificacionController.php:44
 * @route '/api/notificaciones/no-leidas'
 */
noLeidas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: noLeidas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificacionController::noLeidas
 * @see app/Http/Controllers/Api/NotificacionController.php:44
 * @route '/api/notificaciones/no-leidas'
 */
    const noLeidasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: noLeidas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificacionController::noLeidas
 * @see app/Http/Controllers/Api/NotificacionController.php:44
 * @route '/api/notificaciones/no-leidas'
 */
        noLeidasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: noLeidas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificacionController::noLeidas
 * @see app/Http/Controllers/Api/NotificacionController.php:44
 * @route '/api/notificaciones/no-leidas'
 */
        noLeidasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: noLeidas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    noLeidas.form = noLeidasForm
/**
* @see \App\Http\Controllers\Api\NotificacionController::stream
 * @see app/Http/Controllers/Api/NotificacionController.php:197
 * @route '/api/notificaciones/stream'
 */
export const stream = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(options),
    method: 'get',
})

stream.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/stream',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificacionController::stream
 * @see app/Http/Controllers/Api/NotificacionController.php:197
 * @route '/api/notificaciones/stream'
 */
stream.url = (options?: RouteQueryOptions) => {
    return stream.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificacionController::stream
 * @see app/Http/Controllers/Api/NotificacionController.php:197
 * @route '/api/notificaciones/stream'
 */
stream.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificacionController::stream
 * @see app/Http/Controllers/Api/NotificacionController.php:197
 * @route '/api/notificaciones/stream'
 */
stream.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stream.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificacionController::stream
 * @see app/Http/Controllers/Api/NotificacionController.php:197
 * @route '/api/notificaciones/stream'
 */
    const streamForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stream.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificacionController::stream
 * @see app/Http/Controllers/Api/NotificacionController.php:197
 * @route '/api/notificaciones/stream'
 */
        streamForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stream.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificacionController::stream
 * @see app/Http/Controllers/Api/NotificacionController.php:197
 * @route '/api/notificaciones/stream'
 */
        streamForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stream.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stream.form = streamForm
/**
* @see \App\Http\Controllers\Api\NotificacionController::estadisticas
 * @see app/Http/Controllers/Api/NotificacionController.php:157
 * @route '/api/notificaciones/estadisticas'
 */
export const estadisticas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificacionController::estadisticas
 * @see app/Http/Controllers/Api/NotificacionController.php:157
 * @route '/api/notificaciones/estadisticas'
 */
estadisticas.url = (options?: RouteQueryOptions) => {
    return estadisticas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificacionController::estadisticas
 * @see app/Http/Controllers/Api/NotificacionController.php:157
 * @route '/api/notificaciones/estadisticas'
 */
estadisticas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificacionController::estadisticas
 * @see app/Http/Controllers/Api/NotificacionController.php:157
 * @route '/api/notificaciones/estadisticas'
 */
estadisticas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificacionController::estadisticas
 * @see app/Http/Controllers/Api/NotificacionController.php:157
 * @route '/api/notificaciones/estadisticas'
 */
    const estadisticasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificacionController::estadisticas
 * @see app/Http/Controllers/Api/NotificacionController.php:157
 * @route '/api/notificaciones/estadisticas'
 */
        estadisticasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificacionController::estadisticas
 * @see app/Http/Controllers/Api/NotificacionController.php:157
 * @route '/api/notificaciones/estadisticas'
 */
        estadisticasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticas.form = estadisticasForm
/**
* @see \App\Http\Controllers\Api\NotificacionController::marcarLeido
 * @see app/Http/Controllers/Api/NotificacionController.php:60
 * @route '/api/notificaciones/{notificacion}/leido'
 */
export const marcarLeido = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: marcarLeido.url(args, options),
    method: 'put',
})

marcarLeido.definition = {
    methods: ["put"],
    url: '/api/notificaciones/{notificacion}/leido',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\NotificacionController::marcarLeido
 * @see app/Http/Controllers/Api/NotificacionController.php:60
 * @route '/api/notificaciones/{notificacion}/leido'
 */
marcarLeido.url = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notificacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notificacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificacion: typeof args.notificacion === 'object'
                ? args.notificacion.id
                : args.notificacion,
                }

    return marcarLeido.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificacionController::marcarLeido
 * @see app/Http/Controllers/Api/NotificacionController.php:60
 * @route '/api/notificaciones/{notificacion}/leido'
 */
marcarLeido.put = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: marcarLeido.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\NotificacionController::marcarLeido
 * @see app/Http/Controllers/Api/NotificacionController.php:60
 * @route '/api/notificaciones/{notificacion}/leido'
 */
    const marcarLeidoForm = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: marcarLeido.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificacionController::marcarLeido
 * @see app/Http/Controllers/Api/NotificacionController.php:60
 * @route '/api/notificaciones/{notificacion}/leido'
 */
        marcarLeidoForm.put = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: marcarLeido.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    marcarLeido.form = marcarLeidoForm
/**
* @see \App\Http\Controllers\Api\NotificacionController::marcarNoLeido
 * @see app/Http/Controllers/Api/NotificacionController.php:86
 * @route '/api/notificaciones/{notificacion}/no-leido'
 */
export const marcarNoLeido = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: marcarNoLeido.url(args, options),
    method: 'put',
})

marcarNoLeido.definition = {
    methods: ["put"],
    url: '/api/notificaciones/{notificacion}/no-leido',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\NotificacionController::marcarNoLeido
 * @see app/Http/Controllers/Api/NotificacionController.php:86
 * @route '/api/notificaciones/{notificacion}/no-leido'
 */
marcarNoLeido.url = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notificacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notificacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificacion: typeof args.notificacion === 'object'
                ? args.notificacion.id
                : args.notificacion,
                }

    return marcarNoLeido.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificacionController::marcarNoLeido
 * @see app/Http/Controllers/Api/NotificacionController.php:86
 * @route '/api/notificaciones/{notificacion}/no-leido'
 */
marcarNoLeido.put = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: marcarNoLeido.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\NotificacionController::marcarNoLeido
 * @see app/Http/Controllers/Api/NotificacionController.php:86
 * @route '/api/notificaciones/{notificacion}/no-leido'
 */
    const marcarNoLeidoForm = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: marcarNoLeido.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificacionController::marcarNoLeido
 * @see app/Http/Controllers/Api/NotificacionController.php:86
 * @route '/api/notificaciones/{notificacion}/no-leido'
 */
        marcarNoLeidoForm.put = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: marcarNoLeido.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    marcarNoLeido.form = marcarNoLeidoForm
/**
* @see \App\Http\Controllers\Api\NotificacionController::marcarTodasLeidas
 * @see app/Http/Controllers/Api/NotificacionController.php:112
 * @route '/api/notificaciones/marcar/todas-leidas'
 */
export const marcarTodasLeidas = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: marcarTodasLeidas.url(options),
    method: 'put',
})

marcarTodasLeidas.definition = {
    methods: ["put"],
    url: '/api/notificaciones/marcar/todas-leidas',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\NotificacionController::marcarTodasLeidas
 * @see app/Http/Controllers/Api/NotificacionController.php:112
 * @route '/api/notificaciones/marcar/todas-leidas'
 */
marcarTodasLeidas.url = (options?: RouteQueryOptions) => {
    return marcarTodasLeidas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificacionController::marcarTodasLeidas
 * @see app/Http/Controllers/Api/NotificacionController.php:112
 * @route '/api/notificaciones/marcar/todas-leidas'
 */
marcarTodasLeidas.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: marcarTodasLeidas.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\NotificacionController::marcarTodasLeidas
 * @see app/Http/Controllers/Api/NotificacionController.php:112
 * @route '/api/notificaciones/marcar/todas-leidas'
 */
    const marcarTodasLeidasForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: marcarTodasLeidas.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificacionController::marcarTodasLeidas
 * @see app/Http/Controllers/Api/NotificacionController.php:112
 * @route '/api/notificaciones/marcar/todas-leidas'
 */
        marcarTodasLeidasForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: marcarTodasLeidas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    marcarTodasLeidas.form = marcarTodasLeidasForm
/**
* @see \App\Http\Controllers\Api\NotificacionController::eliminar
 * @see app/Http/Controllers/Api/NotificacionController.php:131
 * @route '/api/notificaciones/{notificacion}'
 */
export const eliminar = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminar.url(args, options),
    method: 'delete',
})

eliminar.definition = {
    methods: ["delete"],
    url: '/api/notificaciones/{notificacion}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\NotificacionController::eliminar
 * @see app/Http/Controllers/Api/NotificacionController.php:131
 * @route '/api/notificaciones/{notificacion}'
 */
eliminar.url = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notificacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notificacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificacion: typeof args.notificacion === 'object'
                ? args.notificacion.id
                : args.notificacion,
                }

    return eliminar.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificacionController::eliminar
 * @see app/Http/Controllers/Api/NotificacionController.php:131
 * @route '/api/notificaciones/{notificacion}'
 */
eliminar.delete = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminar.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\NotificacionController::eliminar
 * @see app/Http/Controllers/Api/NotificacionController.php:131
 * @route '/api/notificaciones/{notificacion}'
 */
    const eliminarForm = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: eliminar.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificacionController::eliminar
 * @see app/Http/Controllers/Api/NotificacionController.php:131
 * @route '/api/notificaciones/{notificacion}'
 */
        eliminarForm.delete = (args: { notificacion: number | { id: number } } | [notificacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: eliminar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    eliminar.form = eliminarForm
const notificaciones = {
    index,
noLeidas,
stream,
estadisticas,
marcarLeido,
marcarNoLeido,
marcarTodasLeidas,
eliminar,
}

export default notificaciones