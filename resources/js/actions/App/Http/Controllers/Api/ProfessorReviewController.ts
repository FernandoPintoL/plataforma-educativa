import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::intentosPendientes
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:65
 * @route '/api/profesor/evaluaciones/{evaluacionId}/intentos-pendientes'
 */
export const intentosPendientes = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: intentosPendientes.url(args, options),
    method: 'get',
})

intentosPendientes.definition = {
    methods: ["get","head"],
    url: '/api/profesor/evaluaciones/{evaluacionId}/intentos-pendientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::intentosPendientes
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:65
 * @route '/api/profesor/evaluaciones/{evaluacionId}/intentos-pendientes'
 */
intentosPendientes.url = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacionId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    evaluacionId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacionId: args.evaluacionId,
                }

    return intentosPendientes.definition.url
            .replace('{evaluacionId}', parsedArgs.evaluacionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::intentosPendientes
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:65
 * @route '/api/profesor/evaluaciones/{evaluacionId}/intentos-pendientes'
 */
intentosPendientes.get = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: intentosPendientes.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::intentosPendientes
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:65
 * @route '/api/profesor/evaluaciones/{evaluacionId}/intentos-pendientes'
 */
intentosPendientes.head = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: intentosPendientes.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::intentosPendientes
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:65
 * @route '/api/profesor/evaluaciones/{evaluacionId}/intentos-pendientes'
 */
    const intentosPendientesForm = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: intentosPendientes.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::intentosPendientes
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:65
 * @route '/api/profesor/evaluaciones/{evaluacionId}/intentos-pendientes'
 */
        intentosPendientesForm.get = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: intentosPendientes.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::intentosPendientes
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:65
 * @route '/api/profesor/evaluaciones/{evaluacionId}/intentos-pendientes'
 */
        intentosPendientesForm.head = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: intentosPendientes.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    intentosPendientes.form = intentosPendientesForm
/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::detalleRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:163
 * @route '/api/profesor/intentos/{intentoId}/revision'
 */
export const detalleRevision = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalleRevision.url(args, options),
    method: 'get',
})

detalleRevision.definition = {
    methods: ["get","head"],
    url: '/api/profesor/intentos/{intentoId}/revision',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::detalleRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:163
 * @route '/api/profesor/intentos/{intentoId}/revision'
 */
detalleRevision.url = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return detalleRevision.definition.url
            .replace('{intentoId}', parsedArgs.intentoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::detalleRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:163
 * @route '/api/profesor/intentos/{intentoId}/revision'
 */
detalleRevision.get = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalleRevision.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::detalleRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:163
 * @route '/api/profesor/intentos/{intentoId}/revision'
 */
detalleRevision.head = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detalleRevision.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::detalleRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:163
 * @route '/api/profesor/intentos/{intentoId}/revision'
 */
    const detalleRevisionForm = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detalleRevision.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::detalleRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:163
 * @route '/api/profesor/intentos/{intentoId}/revision'
 */
        detalleRevisionForm.get = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalleRevision.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::detalleRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:163
 * @route '/api/profesor/intentos/{intentoId}/revision'
 */
        detalleRevisionForm.head = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalleRevision.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detalleRevision.form = detalleRevisionForm
/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::confirmar
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:216
 * @route '/api/profesor/intentos/{intentoId}/confirmar'
 */
export const confirmar = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmar.url(args, options),
    method: 'post',
})

confirmar.definition = {
    methods: ["post"],
    url: '/api/profesor/intentos/{intentoId}/confirmar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::confirmar
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:216
 * @route '/api/profesor/intentos/{intentoId}/confirmar'
 */
confirmar.url = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return confirmar.definition.url
            .replace('{intentoId}', parsedArgs.intentoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::confirmar
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:216
 * @route '/api/profesor/intentos/{intentoId}/confirmar'
 */
confirmar.post = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::confirmar
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:216
 * @route '/api/profesor/intentos/{intentoId}/confirmar'
 */
    const confirmarForm = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::confirmar
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:216
 * @route '/api/profesor/intentos/{intentoId}/confirmar'
 */
        confirmarForm.post = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmar.url(args, options),
            method: 'post',
        })
    
    confirmar.form = confirmarForm
/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::ajustar
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:316
 * @route '/api/profesor/intentos/{intentoId}/ajustar'
 */
export const ajustar = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ajustar.url(args, options),
    method: 'post',
})

ajustar.definition = {
    methods: ["post"],
    url: '/api/profesor/intentos/{intentoId}/ajustar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::ajustar
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:316
 * @route '/api/profesor/intentos/{intentoId}/ajustar'
 */
ajustar.url = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return ajustar.definition.url
            .replace('{intentoId}', parsedArgs.intentoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::ajustar
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:316
 * @route '/api/profesor/intentos/{intentoId}/ajustar'
 */
ajustar.post = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ajustar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::ajustar
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:316
 * @route '/api/profesor/intentos/{intentoId}/ajustar'
 */
    const ajustarForm = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ajustar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::ajustar
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:316
 * @route '/api/profesor/intentos/{intentoId}/ajustar'
 */
        ajustarForm.post = (args: { intentoId: string | number } | [intentoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ajustar.url(args, options),
            method: 'post',
        })
    
    ajustar.form = ajustarForm
/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::estadisticasRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:413
 * @route '/api/profesor/evaluaciones/{evaluacionId}/estadisticas-revision'
 */
export const estadisticasRevision = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasRevision.url(args, options),
    method: 'get',
})

estadisticasRevision.definition = {
    methods: ["get","head"],
    url: '/api/profesor/evaluaciones/{evaluacionId}/estadisticas-revision',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::estadisticasRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:413
 * @route '/api/profesor/evaluaciones/{evaluacionId}/estadisticas-revision'
 */
estadisticasRevision.url = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacionId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    evaluacionId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacionId: args.evaluacionId,
                }

    return estadisticasRevision.definition.url
            .replace('{evaluacionId}', parsedArgs.evaluacionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::estadisticasRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:413
 * @route '/api/profesor/evaluaciones/{evaluacionId}/estadisticas-revision'
 */
estadisticasRevision.get = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasRevision.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ProfessorReviewController::estadisticasRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:413
 * @route '/api/profesor/evaluaciones/{evaluacionId}/estadisticas-revision'
 */
estadisticasRevision.head = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticasRevision.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::estadisticasRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:413
 * @route '/api/profesor/evaluaciones/{evaluacionId}/estadisticas-revision'
 */
    const estadisticasRevisionForm = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticasRevision.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::estadisticasRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:413
 * @route '/api/profesor/evaluaciones/{evaluacionId}/estadisticas-revision'
 */
        estadisticasRevisionForm.get = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticasRevision.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ProfessorReviewController::estadisticasRevision
 * @see app/Http/Controllers/Api/ProfessorReviewController.php:413
 * @route '/api/profesor/evaluaciones/{evaluacionId}/estadisticas-revision'
 */
        estadisticasRevisionForm.head = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticasRevision.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticasRevision.form = estadisticasRevisionForm
const ProfessorReviewController = { intentosPendientes, detalleRevision, confirmar, ajustar, estadisticasRevision }

export default ProfessorReviewController