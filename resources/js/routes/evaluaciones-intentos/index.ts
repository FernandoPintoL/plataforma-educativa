import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::index
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:38
 * @route '/api/api/evaluaciones-intentos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/api/evaluaciones-intentos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::index
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:38
 * @route '/api/api/evaluaciones-intentos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::index
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:38
 * @route '/api/api/evaluaciones-intentos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::index
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:38
 * @route '/api/api/evaluaciones-intentos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::index
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:38
 * @route '/api/api/evaluaciones-intentos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::index
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:38
 * @route '/api/api/evaluaciones-intentos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::index
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:38
 * @route '/api/api/evaluaciones-intentos'
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
* @see \App\Http\Controllers\Api\EvaluacionesApiController::show
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:100
 * @route '/api/api/evaluaciones-intentos/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/api/evaluaciones-intentos/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::show
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:100
 * @route '/api/api/evaluaciones-intentos/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::show
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:100
 * @route '/api/api/evaluaciones-intentos/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::show
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:100
 * @route '/api/api/evaluaciones-intentos/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::show
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:100
 * @route '/api/api/evaluaciones-intentos/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::show
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:100
 * @route '/api/api/evaluaciones-intentos/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::show
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:100
 * @route '/api/api/evaluaciones-intentos/{id}'
 */
        showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::iniciar
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:152
 * @route '/api/api/evaluaciones-intentos/{id}/iniciar'
 */
export const iniciar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciar.url(args, options),
    method: 'post',
})

iniciar.definition = {
    methods: ["post"],
    url: '/api/api/evaluaciones-intentos/{id}/iniciar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::iniciar
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:152
 * @route '/api/api/evaluaciones-intentos/{id}/iniciar'
 */
iniciar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return iniciar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::iniciar
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:152
 * @route '/api/api/evaluaciones-intentos/{id}/iniciar'
 */
iniciar.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::iniciar
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:152
 * @route '/api/api/evaluaciones-intentos/{id}/iniciar'
 */
    const iniciarForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: iniciar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::iniciar
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:152
 * @route '/api/api/evaluaciones-intentos/{id}/iniciar'
 */
        iniciarForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: iniciar.url(args, options),
            method: 'post',
        })
    
    iniciar.form = iniciarForm
/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::guardarRespuesta
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:196
 * @route '/api/api/evaluaciones-intentos/intentos/{intentoId}/respuestas'
 */
export const guardarRespuesta = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: guardarRespuesta.url(args, options),
    method: 'post',
})

guardarRespuesta.definition = {
    methods: ["post"],
    url: '/api/api/evaluaciones-intentos/intentos/{intentoId}/respuestas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::guardarRespuesta
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:196
 * @route '/api/api/evaluaciones-intentos/intentos/{intentoId}/respuestas'
 */
guardarRespuesta.url = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { intentoId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    intentoId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        intentoId: args.intentoId,
                }

    return guardarRespuesta.definition.url
            .replace('{intentoId}', parsedArgs.intentoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::guardarRespuesta
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:196
 * @route '/api/api/evaluaciones-intentos/intentos/{intentoId}/respuestas'
 */
guardarRespuesta.post = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: guardarRespuesta.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::guardarRespuesta
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:196
 * @route '/api/api/evaluaciones-intentos/intentos/{intentoId}/respuestas'
 */
    const guardarRespuestaForm = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: guardarRespuesta.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::guardarRespuesta
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:196
 * @route '/api/api/evaluaciones-intentos/intentos/{intentoId}/respuestas'
 */
        guardarRespuestaForm.post = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: guardarRespuesta.url(args, options),
            method: 'post',
        })
    
    guardarRespuesta.form = guardarRespuestaForm
/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::completar
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:257
 * @route '/api/api/evaluaciones-intentos/intentos/{intentoId}/completar'
 */
export const completar = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completar.url(args, options),
    method: 'post',
})

completar.definition = {
    methods: ["post"],
    url: '/api/api/evaluaciones-intentos/intentos/{intentoId}/completar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::completar
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:257
 * @route '/api/api/evaluaciones-intentos/intentos/{intentoId}/completar'
 */
completar.url = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { intentoId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    intentoId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        intentoId: args.intentoId,
                }

    return completar.definition.url
            .replace('{intentoId}', parsedArgs.intentoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::completar
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:257
 * @route '/api/api/evaluaciones-intentos/intentos/{intentoId}/completar'
 */
completar.post = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::completar
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:257
 * @route '/api/api/evaluaciones-intentos/intentos/{intentoId}/completar'
 */
    const completarForm = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: completar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::completar
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:257
 * @route '/api/api/evaluaciones-intentos/intentos/{intentoId}/completar'
 */
        completarForm.post = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: completar.url(args, options),
            method: 'post',
        })
    
    completar.form = completarForm
/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::misIntentos
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:334
 * @route '/api/api/evaluaciones-intentos/{id}/mis-intentos'
 */
export const misIntentos = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: misIntentos.url(args, options),
    method: 'get',
})

misIntentos.definition = {
    methods: ["get","head"],
    url: '/api/api/evaluaciones-intentos/{id}/mis-intentos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::misIntentos
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:334
 * @route '/api/api/evaluaciones-intentos/{id}/mis-intentos'
 */
misIntentos.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return misIntentos.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::misIntentos
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:334
 * @route '/api/api/evaluaciones-intentos/{id}/mis-intentos'
 */
misIntentos.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: misIntentos.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::misIntentos
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:334
 * @route '/api/api/evaluaciones-intentos/{id}/mis-intentos'
 */
misIntentos.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: misIntentos.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::misIntentos
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:334
 * @route '/api/api/evaluaciones-intentos/{id}/mis-intentos'
 */
    const misIntentosForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: misIntentos.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::misIntentos
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:334
 * @route '/api/api/evaluaciones-intentos/{id}/mis-intentos'
 */
        misIntentosForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: misIntentos.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::misIntentos
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:334
 * @route '/api/api/evaluaciones-intentos/{id}/mis-intentos'
 */
        misIntentosForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: misIntentos.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    misIntentos.form = misIntentosForm
/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::verIntento
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:375
 * @route '/api/api/evaluaciones-intentos/intentos/{id}'
 */
export const verIntento = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verIntento.url(args, options),
    method: 'get',
})

verIntento.definition = {
    methods: ["get","head"],
    url: '/api/api/evaluaciones-intentos/intentos/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::verIntento
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:375
 * @route '/api/api/evaluaciones-intentos/intentos/{id}'
 */
verIntento.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return verIntento.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::verIntento
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:375
 * @route '/api/api/evaluaciones-intentos/intentos/{id}'
 */
verIntento.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verIntento.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::verIntento
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:375
 * @route '/api/api/evaluaciones-intentos/intentos/{id}'
 */
verIntento.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verIntento.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::verIntento
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:375
 * @route '/api/api/evaluaciones-intentos/intentos/{id}'
 */
    const verIntentoForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verIntento.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::verIntento
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:375
 * @route '/api/api/evaluaciones-intentos/intentos/{id}'
 */
        verIntentoForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verIntento.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::verIntento
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:375
 * @route '/api/api/evaluaciones-intentos/intentos/{id}'
 */
        verIntentoForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verIntento.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    verIntento.form = verIntentoForm
/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::analisisIa
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:440
 * @route '/api/api/evaluaciones-intentos/intentos/{id}/analisis-ia'
 */
export const analisisIa = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisisIa.url(args, options),
    method: 'get',
})

analisisIa.definition = {
    methods: ["get","head"],
    url: '/api/api/evaluaciones-intentos/intentos/{id}/analisis-ia',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::analisisIa
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:440
 * @route '/api/api/evaluaciones-intentos/intentos/{id}/analisis-ia'
 */
analisisIa.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return analisisIa.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::analisisIa
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:440
 * @route '/api/api/evaluaciones-intentos/intentos/{id}/analisis-ia'
 */
analisisIa.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisisIa.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::analisisIa
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:440
 * @route '/api/api/evaluaciones-intentos/intentos/{id}/analisis-ia'
 */
analisisIa.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analisisIa.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::analisisIa
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:440
 * @route '/api/api/evaluaciones-intentos/intentos/{id}/analisis-ia'
 */
    const analisisIaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analisisIa.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::analisisIa
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:440
 * @route '/api/api/evaluaciones-intentos/intentos/{id}/analisis-ia'
 */
        analisisIaForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisisIa.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EvaluacionesApiController::analisisIa
 * @see app/Http/Controllers/Api/EvaluacionesApiController.php:440
 * @route '/api/api/evaluaciones-intentos/intentos/{id}/analisis-ia'
 */
        analisisIaForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisisIa.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analisisIa.form = analisisIaForm
const evaluacionesIntentos = {
    index,
show,
iniciar,
guardarRespuesta,
completar,
misIntentos,
verIntento,
analisisIa,
}

export default evaluacionesIntentos