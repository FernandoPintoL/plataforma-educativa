import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\ReportesController::desempenioPorEstudiante
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
export const desempenioPorEstudiante = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: desempenioPorEstudiante.url(options),
    method: 'get',
})

desempenioPorEstudiante.definition = {
    methods: ["get","head"],
    url: '/reportes/desempeno',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::desempenioPorEstudiante
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
desempenioPorEstudiante.url = (options?: RouteQueryOptions) => {
    return desempenioPorEstudiante.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::desempenioPorEstudiante
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
desempenioPorEstudiante.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: desempenioPorEstudiante.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::desempenioPorEstudiante
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
desempenioPorEstudiante.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: desempenioPorEstudiante.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::desempenioPorEstudiante
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
    const desempenioPorEstudianteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: desempenioPorEstudiante.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::desempenioPorEstudiante
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
        desempenioPorEstudianteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: desempenioPorEstudiante.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::desempenioPorEstudiante
 * @see app/Http/Controllers/ReportesController.php:31
 * @route '/reportes/desempeno'
 */
        desempenioPorEstudianteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: desempenioPorEstudiante.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    desempenioPorEstudiante.form = desempenioPorEstudianteForm
/**
* @see \App\Http\Controllers\ReportesController::progresoPorCurso
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
export const progresoPorCurso = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progresoPorCurso.url(options),
    method: 'get',
})

progresoPorCurso.definition = {
    methods: ["get","head"],
    url: '/reportes/cursos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::progresoPorCurso
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
progresoPorCurso.url = (options?: RouteQueryOptions) => {
    return progresoPorCurso.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::progresoPorCurso
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
progresoPorCurso.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progresoPorCurso.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::progresoPorCurso
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
progresoPorCurso.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: progresoPorCurso.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::progresoPorCurso
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
    const progresoPorCursoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: progresoPorCurso.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::progresoPorCurso
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
        progresoPorCursoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: progresoPorCurso.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::progresoPorCurso
 * @see app/Http/Controllers/ReportesController.php:74
 * @route '/reportes/cursos'
 */
        progresoPorCursoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: progresoPorCurso.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    progresoPorCurso.form = progresoPorCursoForm
/**
* @see \App\Http\Controllers\ReportesController::analisisComparativo
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
export const analisisComparativo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisisComparativo.url(options),
    method: 'get',
})

analisisComparativo.definition = {
    methods: ["get","head"],
    url: '/reportes/analisis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::analisisComparativo
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
analisisComparativo.url = (options?: RouteQueryOptions) => {
    return analisisComparativo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::analisisComparativo
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
analisisComparativo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisisComparativo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::analisisComparativo
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
analisisComparativo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analisisComparativo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::analisisComparativo
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
    const analisisComparativoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analisisComparativo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::analisisComparativo
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
        analisisComparativoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisisComparativo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::analisisComparativo
 * @see app/Http/Controllers/ReportesController.php:132
 * @route '/reportes/analisis'
 */
        analisisComparativoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisisComparativo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analisisComparativo.form = analisisComparativoForm
/**
* @see \App\Http\Controllers\ReportesController::metricasInstitucionales
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
export const metricasInstitucionales = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metricasInstitucionales.url(options),
    method: 'get',
})

metricasInstitucionales.definition = {
    methods: ["get","head"],
    url: '/reportes/metricas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::metricasInstitucionales
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
metricasInstitucionales.url = (options?: RouteQueryOptions) => {
    return metricasInstitucionales.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::metricasInstitucionales
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
metricasInstitucionales.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metricasInstitucionales.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::metricasInstitucionales
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
metricasInstitucionales.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: metricasInstitucionales.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::metricasInstitucionales
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
    const metricasInstitucionalesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: metricasInstitucionales.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::metricasInstitucionales
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
        metricasInstitucionalesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metricasInstitucionales.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::metricasInstitucionales
 * @see app/Http/Controllers/ReportesController.php:190
 * @route '/reportes/metricas'
 */
        metricasInstitucionalesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metricasInstitucionales.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    metricasInstitucionales.form = metricasInstitucionalesForm
const ReportesController = { index, desempenioPorEstudiante, progresoPorCurso, analisisComparativo, metricasInstitucionales }

export default ReportesController