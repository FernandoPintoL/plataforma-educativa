import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:19
 * @route '/reportes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reportes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:19
 * @route '/reportes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:19
 * @route '/reportes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:19
 * @route '/reportes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:19
 * @route '/reportes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:19
 * @route '/reportes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:19
 * @route '/reportes'
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
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
export const desempeno = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: desempeno.url(options),
    method: 'get',
})

desempeno.definition = {
    methods: ["get","head"],
    url: '/reportes/desempeno',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
desempeno.url = (options?: RouteQueryOptions) => {
    return desempeno.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
desempeno.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: desempeno.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
desempeno.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: desempeno.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
    const desempenoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: desempeno.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
        desempenoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: desempeno.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
        desempenoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: desempeno.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    desempeno.form = desempenoForm
/**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
export const cursos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cursos.url(options),
    method: 'get',
})

cursos.definition = {
    methods: ["get","head"],
    url: '/reportes/cursos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
cursos.url = (options?: RouteQueryOptions) => {
    return cursos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
cursos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cursos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
cursos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cursos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
    const cursosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cursos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
        cursosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cursos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
        cursosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cursos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cursos.form = cursosForm
/**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
export const analisis = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisis.url(options),
    method: 'get',
})

analisis.definition = {
    methods: ["get","head"],
    url: '/reportes/analisis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
analisis.url = (options?: RouteQueryOptions) => {
    return analisis.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
analisis.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisis.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
analisis.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analisis.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
    const analisisForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analisis.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
        analisisForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisis.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
        analisisForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisis.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analisis.form = analisisForm
/**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
export const metricas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metricas.url(options),
    method: 'get',
})

metricas.definition = {
    methods: ["get","head"],
    url: '/reportes/metricas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
metricas.url = (options?: RouteQueryOptions) => {
    return metricas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
metricas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metricas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
metricas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: metricas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
    const metricasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: metricas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
        metricasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metricas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
        metricasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metricas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    metricas.form = metricasForm
const reportes = {
    index,
desempeno,
cursos,
analisis,
metricas,
}

export default reportes