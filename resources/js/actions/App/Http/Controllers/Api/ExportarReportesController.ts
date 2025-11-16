import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarRiesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
export const exportarRiesgo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarRiesgo.url(options),
    method: 'get',
})

exportarRiesgo.definition = {
    methods: ["get","head"],
    url: '/api/exportar/riesgo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarRiesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
exportarRiesgo.url = (options?: RouteQueryOptions) => {
    return exportarRiesgo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarRiesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
exportarRiesgo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarRiesgo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarRiesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
exportarRiesgo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarRiesgo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarRiesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
    const exportarRiesgoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarRiesgo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarRiesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
        exportarRiesgoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarRiesgo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarRiesgo
 * @see app/Http/Controllers/Api/ExportarReportesController.php:18
 * @route '/api/exportar/riesgo'
 */
        exportarRiesgoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarRiesgo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportarRiesgo.form = exportarRiesgoForm
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarDesempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
export const exportarDesempeno = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarDesempeno.url(options),
    method: 'get',
})

exportarDesempeno.definition = {
    methods: ["get","head"],
    url: '/api/exportar/desempeno',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarDesempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
exportarDesempeno.url = (options?: RouteQueryOptions) => {
    return exportarDesempeno.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarDesempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
exportarDesempeno.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarDesempeno.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarDesempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
exportarDesempeno.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarDesempeno.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarDesempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
    const exportarDesempenoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarDesempeno.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarDesempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
        exportarDesempenoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarDesempeno.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarDesempeno
 * @see app/Http/Controllers/Api/ExportarReportesController.php:55
 * @route '/api/exportar/desempeno'
 */
        exportarDesempenoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarDesempeno.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportarDesempeno.form = exportarDesempenoForm
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarCarreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
export const exportarCarreras = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarCarreras.url(options),
    method: 'get',
})

exportarCarreras.definition = {
    methods: ["get","head"],
    url: '/api/exportar/carreras',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarCarreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
exportarCarreras.url = (options?: RouteQueryOptions) => {
    return exportarCarreras.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarCarreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
exportarCarreras.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarCarreras.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarCarreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
exportarCarreras.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarCarreras.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarCarreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
    const exportarCarrerasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarCarreras.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarCarreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
        exportarCarrerasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarCarreras.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarCarreras
 * @see app/Http/Controllers/Api/ExportarReportesController.php:97
 * @route '/api/exportar/carreras'
 */
        exportarCarrerasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarCarreras.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportarCarreras.form = exportarCarrerasForm
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarTendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
export const exportarTendencias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarTendencias.url(options),
    method: 'get',
})

exportarTendencias.definition = {
    methods: ["get","head"],
    url: '/api/exportar/tendencias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarTendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
exportarTendencias.url = (options?: RouteQueryOptions) => {
    return exportarTendencias.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarTendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
exportarTendencias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarTendencias.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarTendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
exportarTendencias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarTendencias.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarTendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
    const exportarTendenciasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarTendencias.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarTendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
        exportarTendenciasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarTendencias.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::exportarTendencias
 * @see app/Http/Controllers/Api/ExportarReportesController.php:129
 * @route '/api/exportar/tendencias'
 */
        exportarTendenciasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarTendencias.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportarTendencias.form = exportarTendenciasForm
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumenGeneral
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
export const resumenGeneral = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumenGeneral.url(options),
    method: 'get',
})

resumenGeneral.definition = {
    methods: ["get","head"],
    url: '/api/exportar/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumenGeneral
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
resumenGeneral.url = (options?: RouteQueryOptions) => {
    return resumenGeneral.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumenGeneral
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
resumenGeneral.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumenGeneral.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumenGeneral
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
resumenGeneral.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumenGeneral.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumenGeneral
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
    const resumenGeneralForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resumenGeneral.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumenGeneral
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
        resumenGeneralForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumenGeneral.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ExportarReportesController::resumenGeneral
 * @see app/Http/Controllers/Api/ExportarReportesController.php:190
 * @route '/api/exportar/resumen'
 */
        resumenGeneralForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumenGeneral.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    resumenGeneral.form = resumenGeneralForm
const ExportarReportesController = { exportarRiesgo, exportarDesempeno, exportarCarreras, exportarTendencias, resumenGeneral }

export default ExportarReportesController