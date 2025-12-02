import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EvaluacionController::getAnalisisDetallado
 * @see app/Http/Controllers/EvaluacionController.php:1115
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
export const getAnalisisDetallado = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnalisisDetallado.url(args, options),
    method: 'get',
})

getAnalisisDetallado.definition = {
    methods: ["get","head"],
    url: '/api/evaluaciones/{evaluacionId}/analisis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::getAnalisisDetallado
 * @see app/Http/Controllers/EvaluacionController.php:1115
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
getAnalisisDetallado.url = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getAnalisisDetallado.definition.url
            .replace('{evaluacionId}', parsedArgs.evaluacionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::getAnalisisDetallado
 * @see app/Http/Controllers/EvaluacionController.php:1115
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
getAnalisisDetallado.get = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnalisisDetallado.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::getAnalisisDetallado
 * @see app/Http/Controllers/EvaluacionController.php:1115
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
getAnalisisDetallado.head = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAnalisisDetallado.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::getAnalisisDetallado
 * @see app/Http/Controllers/EvaluacionController.php:1115
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
    const getAnalisisDetalladoForm = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAnalisisDetallado.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::getAnalisisDetallado
 * @see app/Http/Controllers/EvaluacionController.php:1115
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
        getAnalisisDetalladoForm.get = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnalisisDetallado.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::getAnalisisDetallado
 * @see app/Http/Controllers/EvaluacionController.php:1115
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
        getAnalisisDetalladoForm.head = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnalisisDetallado.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getAnalisisDetallado.form = getAnalisisDetalladoForm
/**
* @see \App\Http\Controllers\EvaluacionController::getCorrelaciones
 * @see app/Http/Controllers/EvaluacionController.php:1145
 * @route '/api/evaluaciones/correlaciones'
 */
export const getCorrelaciones = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCorrelaciones.url(options),
    method: 'get',
})

getCorrelaciones.definition = {
    methods: ["get","head"],
    url: '/api/evaluaciones/correlaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::getCorrelaciones
 * @see app/Http/Controllers/EvaluacionController.php:1145
 * @route '/api/evaluaciones/correlaciones'
 */
getCorrelaciones.url = (options?: RouteQueryOptions) => {
    return getCorrelaciones.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::getCorrelaciones
 * @see app/Http/Controllers/EvaluacionController.php:1145
 * @route '/api/evaluaciones/correlaciones'
 */
getCorrelaciones.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCorrelaciones.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::getCorrelaciones
 * @see app/Http/Controllers/EvaluacionController.php:1145
 * @route '/api/evaluaciones/correlaciones'
 */
getCorrelaciones.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCorrelaciones.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::getCorrelaciones
 * @see app/Http/Controllers/EvaluacionController.php:1145
 * @route '/api/evaluaciones/correlaciones'
 */
    const getCorrelacionesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getCorrelaciones.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::getCorrelaciones
 * @see app/Http/Controllers/EvaluacionController.php:1145
 * @route '/api/evaluaciones/correlaciones'
 */
        getCorrelacionesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCorrelaciones.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::getCorrelaciones
 * @see app/Http/Controllers/EvaluacionController.php:1145
 * @route '/api/evaluaciones/correlaciones'
 */
        getCorrelacionesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCorrelaciones.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getCorrelaciones.form = getCorrelacionesForm
/**
* @see \App\Http\Controllers\EvaluacionController::getRecomendacionesEstudiante
 * @see app/Http/Controllers/EvaluacionController.php:1169
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
export const getRecomendacionesEstudiante = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRecomendacionesEstudiante.url(args, options),
    method: 'get',
})

getRecomendacionesEstudiante.definition = {
    methods: ["get","head"],
    url: '/api/evaluaciones/{evaluacionId}/recomendaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::getRecomendacionesEstudiante
 * @see app/Http/Controllers/EvaluacionController.php:1169
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
getRecomendacionesEstudiante.url = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getRecomendacionesEstudiante.definition.url
            .replace('{evaluacionId}', parsedArgs.evaluacionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::getRecomendacionesEstudiante
 * @see app/Http/Controllers/EvaluacionController.php:1169
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
getRecomendacionesEstudiante.get = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRecomendacionesEstudiante.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::getRecomendacionesEstudiante
 * @see app/Http/Controllers/EvaluacionController.php:1169
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
getRecomendacionesEstudiante.head = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRecomendacionesEstudiante.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::getRecomendacionesEstudiante
 * @see app/Http/Controllers/EvaluacionController.php:1169
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
    const getRecomendacionesEstudianteForm = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getRecomendacionesEstudiante.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::getRecomendacionesEstudiante
 * @see app/Http/Controllers/EvaluacionController.php:1169
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
        getRecomendacionesEstudianteForm.get = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRecomendacionesEstudiante.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::getRecomendacionesEstudiante
 * @see app/Http/Controllers/EvaluacionController.php:1169
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
        getRecomendacionesEstudianteForm.head = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRecomendacionesEstudiante.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getRecomendacionesEstudiante.form = getRecomendacionesEstudianteForm
/**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:48
 * @route '/evaluaciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/evaluaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:48
 * @route '/evaluaciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:48
 * @route '/evaluaciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:48
 * @route '/evaluaciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:48
 * @route '/evaluaciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:48
 * @route '/evaluaciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:48
 * @route '/evaluaciones'
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
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:133
 * @route '/evaluaciones/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:133
 * @route '/evaluaciones/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:133
 * @route '/evaluaciones/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:133
 * @route '/evaluaciones/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:133
 * @route '/evaluaciones/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:133
 * @route '/evaluaciones/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:133
 * @route '/evaluaciones/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\EvaluacionController::wizard
 * @see app/Http/Controllers/EvaluacionController.php:157
 * @route '/evaluaciones/wizard'
 */
export const wizard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wizard.url(options),
    method: 'get',
})

wizard.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/wizard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::wizard
 * @see app/Http/Controllers/EvaluacionController.php:157
 * @route '/evaluaciones/wizard'
 */
wizard.url = (options?: RouteQueryOptions) => {
    return wizard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::wizard
 * @see app/Http/Controllers/EvaluacionController.php:157
 * @route '/evaluaciones/wizard'
 */
wizard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wizard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::wizard
 * @see app/Http/Controllers/EvaluacionController.php:157
 * @route '/evaluaciones/wizard'
 */
wizard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: wizard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::wizard
 * @see app/Http/Controllers/EvaluacionController.php:157
 * @route '/evaluaciones/wizard'
 */
    const wizardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: wizard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::wizard
 * @see app/Http/Controllers/EvaluacionController.php:157
 * @route '/evaluaciones/wizard'
 */
        wizardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wizard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::wizard
 * @see app/Http/Controllers/EvaluacionController.php:157
 * @route '/evaluaciones/wizard'
 */
        wizardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wizard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    wizard.form = wizardForm
/**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacion}/take'
 */
export const take = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})

take.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacion}/take',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacion}/take'
 */
take.url = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: typeof args.evaluacion === 'object'
                ? args.evaluacion.id
                : args.evaluacion,
                }

    return take.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacion}/take'
 */
take.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacion}/take'
 */
take.head = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: take.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacion}/take'
 */
    const takeForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: take.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacion}/take'
 */
        takeForm.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: take.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacion}/take'
 */
        takeForm.head = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: take.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    take.form = takeForm
/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:661
 * @route '/evaluaciones/{evaluacion}/results'
 */
export const results = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: results.url(args, options),
    method: 'get',
})

results.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacion}/results',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:661
 * @route '/evaluaciones/{evaluacion}/results'
 */
results.url = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: typeof args.evaluacion === 'object'
                ? args.evaluacion.id
                : args.evaluacion,
                }

    return results.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:661
 * @route '/evaluaciones/{evaluacion}/results'
 */
results.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: results.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:661
 * @route '/evaluaciones/{evaluacion}/results'
 */
results.head = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: results.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:661
 * @route '/evaluaciones/{evaluacion}/results'
 */
    const resultsForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: results.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:661
 * @route '/evaluaciones/{evaluacion}/results'
 */
        resultsForm.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: results.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:661
 * @route '/evaluaciones/{evaluacion}/results'
 */
        resultsForm.head = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: results.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    results.form = resultsForm
/**
* @see \App\Http\Controllers\EvaluacionController::verIntento
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
export const verIntento = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verIntento.url(args, options),
    method: 'get',
})

verIntento.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacion}/intentos/{trabajo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::verIntento
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
verIntento.url = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                    trabajo: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: typeof args.evaluacion === 'object'
                ? args.evaluacion.id
                : args.evaluacion,
                                trabajo: typeof args.trabajo === 'object'
                ? args.trabajo.id
                : args.trabajo,
                }

    return verIntento.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace('{trabajo}', parsedArgs.trabajo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::verIntento
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
verIntento.get = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verIntento.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::verIntento
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
verIntento.head = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verIntento.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::verIntento
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
    const verIntentoForm = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verIntento.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::verIntento
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
        verIntentoForm.get = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verIntento.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::verIntento
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
        verIntentoForm.head = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:560
 * @route '/evaluaciones/{evaluacion}/submit'
 */
export const submitRespuestas = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitRespuestas.url(args, options),
    method: 'post',
})

submitRespuestas.definition = {
    methods: ["post"],
    url: '/evaluaciones/{evaluacion}/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:560
 * @route '/evaluaciones/{evaluacion}/submit'
 */
submitRespuestas.url = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: typeof args.evaluacion === 'object'
                ? args.evaluacion.id
                : args.evaluacion,
                }

    return submitRespuestas.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:560
 * @route '/evaluaciones/{evaluacion}/submit'
 */
submitRespuestas.post = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitRespuestas.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:560
 * @route '/evaluaciones/{evaluacion}/submit'
 */
    const submitRespuestasForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitRespuestas.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:560
 * @route '/evaluaciones/{evaluacion}/submit'
 */
        submitRespuestasForm.post = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitRespuestas.url(args, options),
            method: 'post',
        })
    
    submitRespuestas.form = submitRespuestasForm
/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:345
 * @route '/evaluaciones/{evaluacion}/edit'
 */
export const edit = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacion}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:345
 * @route '/evaluaciones/{evaluacion}/edit'
 */
edit.url = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: typeof args.evaluacion === 'object'
                ? args.evaluacion.id
                : args.evaluacion,
                }

    return edit.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:345
 * @route '/evaluaciones/{evaluacion}/edit'
 */
edit.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:345
 * @route '/evaluaciones/{evaluacion}/edit'
 */
edit.head = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:345
 * @route '/evaluaciones/{evaluacion}/edit'
 */
    const editForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:345
 * @route '/evaluaciones/{evaluacion}/edit'
 */
        editForm.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:345
 * @route '/evaluaciones/{evaluacion}/edit'
 */
        editForm.head = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:177
 * @route '/evaluaciones'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/evaluaciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:177
 * @route '/evaluaciones'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:177
 * @route '/evaluaciones'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:177
 * @route '/evaluaciones'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:177
 * @route '/evaluaciones'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:369
 * @route '/evaluaciones/{evaluacion}'
 */
const update7598730f5bb15464ada22e14ca919d72 = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update7598730f5bb15464ada22e14ca919d72.url(args, options),
    method: 'put',
})

update7598730f5bb15464ada22e14ca919d72.definition = {
    methods: ["put"],
    url: '/evaluaciones/{evaluacion}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:369
 * @route '/evaluaciones/{evaluacion}'
 */
update7598730f5bb15464ada22e14ca919d72.url = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: typeof args.evaluacion === 'object'
                ? args.evaluacion.id
                : args.evaluacion,
                }

    return update7598730f5bb15464ada22e14ca919d72.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:369
 * @route '/evaluaciones/{evaluacion}'
 */
update7598730f5bb15464ada22e14ca919d72.put = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update7598730f5bb15464ada22e14ca919d72.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:369
 * @route '/evaluaciones/{evaluacion}'
 */
    const update7598730f5bb15464ada22e14ca919d72Form = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update7598730f5bb15464ada22e14ca919d72.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:369
 * @route '/evaluaciones/{evaluacion}'
 */
        update7598730f5bb15464ada22e14ca919d72Form.put = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update7598730f5bb15464ada22e14ca919d72.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update7598730f5bb15464ada22e14ca919d72.form = update7598730f5bb15464ada22e14ca919d72Form
    /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:369
 * @route '/evaluaciones/{evaluacion}'
 */
const update7598730f5bb15464ada22e14ca919d72 = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update7598730f5bb15464ada22e14ca919d72.url(args, options),
    method: 'patch',
})

update7598730f5bb15464ada22e14ca919d72.definition = {
    methods: ["patch"],
    url: '/evaluaciones/{evaluacion}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:369
 * @route '/evaluaciones/{evaluacion}'
 */
update7598730f5bb15464ada22e14ca919d72.url = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: typeof args.evaluacion === 'object'
                ? args.evaluacion.id
                : args.evaluacion,
                }

    return update7598730f5bb15464ada22e14ca919d72.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:369
 * @route '/evaluaciones/{evaluacion}'
 */
update7598730f5bb15464ada22e14ca919d72.patch = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update7598730f5bb15464ada22e14ca919d72.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:369
 * @route '/evaluaciones/{evaluacion}'
 */
    const update7598730f5bb15464ada22e14ca919d72Form = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update7598730f5bb15464ada22e14ca919d72.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:369
 * @route '/evaluaciones/{evaluacion}'
 */
        update7598730f5bb15464ada22e14ca919d72Form.patch = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update7598730f5bb15464ada22e14ca919d72.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update7598730f5bb15464ada22e14ca919d72.form = update7598730f5bb15464ada22e14ca919d72Form

export const update = {
    '/evaluaciones/{evaluacion}': update7598730f5bb15464ada22e14ca919d72,
    '/evaluaciones/{evaluacion}': update7598730f5bb15464ada22e14ca919d72,
}

/**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:457
 * @route '/evaluaciones/{evaluacion}'
 */
export const destroy = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/evaluaciones/{evaluacion}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:457
 * @route '/evaluaciones/{evaluacion}'
 */
destroy.url = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: typeof args.evaluacion === 'object'
                ? args.evaluacion.id
                : args.evaluacion,
                }

    return destroy.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:457
 * @route '/evaluaciones/{evaluacion}'
 */
destroy.delete = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:457
 * @route '/evaluaciones/{evaluacion}'
 */
    const destroyForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:457
 * @route '/evaluaciones/{evaluacion}'
 */
        destroyForm.delete = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:265
 * @route '/evaluaciones/{evaluacion}'
 */
export const show = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:265
 * @route '/evaluaciones/{evaluacion}'
 */
show.url = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: typeof args.evaluacion === 'object'
                ? args.evaluacion.id
                : args.evaluacion,
                }

    return show.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:265
 * @route '/evaluaciones/{evaluacion}'
 */
show.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:265
 * @route '/evaluaciones/{evaluacion}'
 */
show.head = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:265
 * @route '/evaluaciones/{evaluacion}'
 */
    const showForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:265
 * @route '/evaluaciones/{evaluacion}'
 */
        showForm.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:265
 * @route '/evaluaciones/{evaluacion}'
 */
        showForm.head = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const EvaluacionController = { getAnalisisDetallado, getCorrelaciones, getRecomendacionesEstudiante, index, create, wizard, take, results, verIntento, submitRespuestas, edit, store, update, destroy, show }

export default EvaluacionController