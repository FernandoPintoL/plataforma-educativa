import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import intentos from './intentos'
/**
* @see \App\Http\Controllers\EvaluacionController::analisis
 * @see app/Http/Controllers/EvaluacionController.php:1051
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
export const analisis = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisis.url(args, options),
    method: 'get',
})

analisis.definition = {
    methods: ["get","head"],
    url: '/api/evaluaciones/{evaluacionId}/analisis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::analisis
 * @see app/Http/Controllers/EvaluacionController.php:1051
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
analisis.url = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return analisis.definition.url
            .replace('{evaluacionId}', parsedArgs.evaluacionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::analisis
 * @see app/Http/Controllers/EvaluacionController.php:1051
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
analisis.get = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisis.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::analisis
 * @see app/Http/Controllers/EvaluacionController.php:1051
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
analisis.head = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analisis.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::analisis
 * @see app/Http/Controllers/EvaluacionController.php:1051
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
    const analisisForm = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analisis.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::analisis
 * @see app/Http/Controllers/EvaluacionController.php:1051
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
        analisisForm.get = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisis.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::analisis
 * @see app/Http/Controllers/EvaluacionController.php:1051
 * @route '/api/evaluaciones/{evaluacionId}/analisis'
 */
        analisisForm.head = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisis.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analisis.form = analisisForm
/**
* @see \App\Http\Controllers\EvaluacionController::correlaciones
 * @see app/Http/Controllers/EvaluacionController.php:1081
 * @route '/api/evaluaciones/correlaciones'
 */
export const correlaciones = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correlaciones.url(options),
    method: 'get',
})

correlaciones.definition = {
    methods: ["get","head"],
    url: '/api/evaluaciones/correlaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::correlaciones
 * @see app/Http/Controllers/EvaluacionController.php:1081
 * @route '/api/evaluaciones/correlaciones'
 */
correlaciones.url = (options?: RouteQueryOptions) => {
    return correlaciones.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::correlaciones
 * @see app/Http/Controllers/EvaluacionController.php:1081
 * @route '/api/evaluaciones/correlaciones'
 */
correlaciones.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correlaciones.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::correlaciones
 * @see app/Http/Controllers/EvaluacionController.php:1081
 * @route '/api/evaluaciones/correlaciones'
 */
correlaciones.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: correlaciones.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::correlaciones
 * @see app/Http/Controllers/EvaluacionController.php:1081
 * @route '/api/evaluaciones/correlaciones'
 */
    const correlacionesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: correlaciones.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::correlaciones
 * @see app/Http/Controllers/EvaluacionController.php:1081
 * @route '/api/evaluaciones/correlaciones'
 */
        correlacionesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: correlaciones.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::correlaciones
 * @see app/Http/Controllers/EvaluacionController.php:1081
 * @route '/api/evaluaciones/correlaciones'
 */
        correlacionesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: correlaciones.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    correlaciones.form = correlacionesForm
/**
* @see \App\Http\Controllers\EvaluacionController::recomendaciones
 * @see app/Http/Controllers/EvaluacionController.php:1105
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
export const recomendaciones = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recomendaciones.url(args, options),
    method: 'get',
})

recomendaciones.definition = {
    methods: ["get","head"],
    url: '/api/evaluaciones/{evaluacionId}/recomendaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::recomendaciones
 * @see app/Http/Controllers/EvaluacionController.php:1105
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
recomendaciones.url = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return recomendaciones.definition.url
            .replace('{evaluacionId}', parsedArgs.evaluacionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::recomendaciones
 * @see app/Http/Controllers/EvaluacionController.php:1105
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
recomendaciones.get = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recomendaciones.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::recomendaciones
 * @see app/Http/Controllers/EvaluacionController.php:1105
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
recomendaciones.head = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recomendaciones.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::recomendaciones
 * @see app/Http/Controllers/EvaluacionController.php:1105
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
    const recomendacionesForm = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: recomendaciones.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::recomendaciones
 * @see app/Http/Controllers/EvaluacionController.php:1105
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
        recomendacionesForm.get = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recomendaciones.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::recomendaciones
 * @see app/Http/Controllers/EvaluacionController.php:1105
 * @route '/api/evaluaciones/{evaluacionId}/recomendaciones'
 */
        recomendacionesForm.head = (args: { evaluacionId: string | number } | [evaluacionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recomendaciones.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    recomendaciones.form = recomendacionesForm
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
 * @see app/Http/Controllers/EvaluacionController.php:458
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
 * @see app/Http/Controllers/EvaluacionController.php:458
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
 * @see app/Http/Controllers/EvaluacionController.php:458
 * @route '/evaluaciones/{evaluacion}/take'
 */
take.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:458
 * @route '/evaluaciones/{evaluacion}/take'
 */
take.head = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: take.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:458
 * @route '/evaluaciones/{evaluacion}/take'
 */
    const takeForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: take.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:458
 * @route '/evaluaciones/{evaluacion}/take'
 */
        takeForm.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: take.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:458
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
 * @see app/Http/Controllers/EvaluacionController.php:619
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
 * @see app/Http/Controllers/EvaluacionController.php:619
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
 * @see app/Http/Controllers/EvaluacionController.php:619
 * @route '/evaluaciones/{evaluacion}/results'
 */
results.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: results.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:619
 * @route '/evaluaciones/{evaluacion}/results'
 */
results.head = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: results.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:619
 * @route '/evaluaciones/{evaluacion}/results'
 */
    const resultsForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: results.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:619
 * @route '/evaluaciones/{evaluacion}/results'
 */
        resultsForm.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: results.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:619
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
* @see \App\Http\Controllers\EvaluacionController::submit
 * @see app/Http/Controllers/EvaluacionController.php:518
 * @route '/evaluaciones/{evaluacion}/submit'
 */
export const submit = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/evaluaciones/{evaluacion}/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvaluacionController::submit
 * @see app/Http/Controllers/EvaluacionController.php:518
 * @route '/evaluaciones/{evaluacion}/submit'
 */
submit.url = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return submit.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::submit
 * @see app/Http/Controllers/EvaluacionController.php:518
 * @route '/evaluaciones/{evaluacion}/submit'
 */
submit.post = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::submit
 * @see app/Http/Controllers/EvaluacionController.php:518
 * @route '/evaluaciones/{evaluacion}/submit'
 */
    const submitForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::submit
 * @see app/Http/Controllers/EvaluacionController.php:518
 * @route '/evaluaciones/{evaluacion}/submit'
 */
        submitForm.post = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submit.url(args, options),
            method: 'post',
        })
    
    submit.form = submitForm
/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:330
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
 * @see app/Http/Controllers/EvaluacionController.php:330
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
 * @see app/Http/Controllers/EvaluacionController.php:330
 * @route '/evaluaciones/{evaluacion}/edit'
 */
edit.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:330
 * @route '/evaluaciones/{evaluacion}/edit'
 */
edit.head = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:330
 * @route '/evaluaciones/{evaluacion}/edit'
 */
    const editForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:330
 * @route '/evaluaciones/{evaluacion}/edit'
 */
        editForm.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:330
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
 * @see app/Http/Controllers/EvaluacionController.php:354
 * @route '/evaluaciones/{evaluacion}'
 */
export const update = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/evaluaciones/{evaluacion}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:354
 * @route '/evaluaciones/{evaluacion}'
 */
update.url = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:354
 * @route '/evaluaciones/{evaluacion}'
 */
update.put = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:354
 * @route '/evaluaciones/{evaluacion}'
 */
    const updateForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:354
 * @route '/evaluaciones/{evaluacion}'
 */
        updateForm.put = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:415
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
 * @see app/Http/Controllers/EvaluacionController.php:415
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
 * @see app/Http/Controllers/EvaluacionController.php:415
 * @route '/evaluaciones/{evaluacion}'
 */
destroy.delete = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:415
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
 * @see app/Http/Controllers/EvaluacionController.php:415
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
 * @see app/Http/Controllers/EvaluacionController.php:250
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
 * @see app/Http/Controllers/EvaluacionController.php:250
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
 * @see app/Http/Controllers/EvaluacionController.php:250
 * @route '/evaluaciones/{evaluacion}'
 */
show.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:250
 * @route '/evaluaciones/{evaluacion}'
 */
show.head = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:250
 * @route '/evaluaciones/{evaluacion}'
 */
    const showForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:250
 * @route '/evaluaciones/{evaluacion}'
 */
        showForm.get = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:250
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
const evaluaciones = {
    analisis,
correlaciones,
recomendaciones,
index,
create,
wizard,
take,
results,
intentos,
submit,
edit,
store,
update,
destroy,
show,
}

export default evaluaciones