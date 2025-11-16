import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::riesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
export const riesgo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riesgo.url(options),
    method: 'get',
})

riesgo.definition = {
    methods: ["get","head"],
    url: '/api/exportar/riesgo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::riesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
riesgo.url = (options?: RouteQueryOptions) => {
    return riesgo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::riesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
riesgo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riesgo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::riesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
riesgo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: riesgo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ExportarReportesController::riesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
    const riesgoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: riesgo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::riesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
        riesgoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riesgo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::riesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
        riesgoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riesgo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    riesgo.form = riesgoForm
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::desempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
export const desempeno = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: desempeno.url(options),
    method: 'get',
})

desempeno.definition = {
    methods: ["get","head"],
    url: '/api/exportar/desempeno',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::desempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
desempeno.url = (options?: RouteQueryOptions) => {
    return desempeno.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::desempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
desempeno.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: desempeno.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::desempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
desempeno.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: desempeno.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ExportarReportesController::desempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
    const desempenoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: desempeno.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::desempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
        desempenoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: desempeno.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::desempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
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
* @see \App\Http\Controllers\Api\ExportarReportesController::carreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
export const carreras = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: carreras.url(options),
    method: 'get',
})

carreras.definition = {
    methods: ["get","head"],
    url: '/api/exportar/carreras',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::carreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
carreras.url = (options?: RouteQueryOptions) => {
    return carreras.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::carreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
carreras.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: carreras.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::carreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
carreras.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: carreras.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ExportarReportesController::carreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
    const carrerasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: carreras.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::carreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
        carrerasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: carreras.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::carreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
        carrerasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: carreras.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    carreras.form = carrerasForm
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::tendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
export const tendencias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tendencias.url(options),
    method: 'get',
})

tendencias.definition = {
    methods: ["get","head"],
    url: '/api/exportar/tendencias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::tendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
tendencias.url = (options?: RouteQueryOptions) => {
    return tendencias.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::tendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
tendencias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tendencias.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::tendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
tendencias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tendencias.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ExportarReportesController::tendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
    const tendenciasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: tendencias.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::tendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
        tendenciasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tendencias.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::tendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
        tendenciasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tendencias.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    tendencias.form = tendenciasForm
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumen
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
export const resumen = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(options),
    method: 'get',
})

resumen.definition = {
    methods: ["get","head"],
    url: '/api/exportar/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumen
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
resumen.url = (options?: RouteQueryOptions) => {
    return resumen.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumen
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
resumen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumen
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
resumen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumen.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumen
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
    const resumenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resumen.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumen
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
        resumenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumen
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
        resumenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    resumen.form = resumenForm
const exportar = {
    riesgo,
desempeno,
carreras,
tendencias,
resumen,
}

export default exportar