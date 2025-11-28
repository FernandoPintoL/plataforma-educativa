import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RespuestaTestController::index
 * @see app/Http/Controllers/RespuestaTestController.php:34
 * @route '/tests-vocacionales/{testVocacional}/respuestas'
 */
export const index = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/{testVocacional}/respuestas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RespuestaTestController::index
 * @see app/Http/Controllers/RespuestaTestController.php:34
 * @route '/tests-vocacionales/{testVocacional}/respuestas'
 */
index.url = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                }

    return index.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RespuestaTestController::index
 * @see app/Http/Controllers/RespuestaTestController.php:34
 * @route '/tests-vocacionales/{testVocacional}/respuestas'
 */
index.get = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RespuestaTestController::index
 * @see app/Http/Controllers/RespuestaTestController.php:34
 * @route '/tests-vocacionales/{testVocacional}/respuestas'
 */
index.head = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RespuestaTestController::index
 * @see app/Http/Controllers/RespuestaTestController.php:34
 * @route '/tests-vocacionales/{testVocacional}/respuestas'
 */
    const indexForm = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RespuestaTestController::index
 * @see app/Http/Controllers/RespuestaTestController.php:34
 * @route '/tests-vocacionales/{testVocacional}/respuestas'
 */
        indexForm.get = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RespuestaTestController::index
 * @see app/Http/Controllers/RespuestaTestController.php:34
 * @route '/tests-vocacionales/{testVocacional}/respuestas'
 */
        indexForm.head = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\RespuestaTestController::show
 * @see app/Http/Controllers/RespuestaTestController.php:121
 * @route '/tests-vocacionales/{testVocacional}/respuestas/{resultadoTestVocacional}'
 */
export const show = (args: { testVocacional: string | number, resultadoTestVocacional: string | number } | [testVocacional: string | number, resultadoTestVocacional: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/{testVocacional}/respuestas/{resultadoTestVocacional}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RespuestaTestController::show
 * @see app/Http/Controllers/RespuestaTestController.php:121
 * @route '/tests-vocacionales/{testVocacional}/respuestas/{resultadoTestVocacional}'
 */
show.url = (args: { testVocacional: string | number, resultadoTestVocacional: string | number } | [testVocacional: string | number, resultadoTestVocacional: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                    resultadoTestVocacional: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                                resultadoTestVocacional: args.resultadoTestVocacional,
                }

    return show.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace('{resultadoTestVocacional}', parsedArgs.resultadoTestVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RespuestaTestController::show
 * @see app/Http/Controllers/RespuestaTestController.php:121
 * @route '/tests-vocacionales/{testVocacional}/respuestas/{resultadoTestVocacional}'
 */
show.get = (args: { testVocacional: string | number, resultadoTestVocacional: string | number } | [testVocacional: string | number, resultadoTestVocacional: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RespuestaTestController::show
 * @see app/Http/Controllers/RespuestaTestController.php:121
 * @route '/tests-vocacionales/{testVocacional}/respuestas/{resultadoTestVocacional}'
 */
show.head = (args: { testVocacional: string | number, resultadoTestVocacional: string | number } | [testVocacional: string | number, resultadoTestVocacional: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RespuestaTestController::show
 * @see app/Http/Controllers/RespuestaTestController.php:121
 * @route '/tests-vocacionales/{testVocacional}/respuestas/{resultadoTestVocacional}'
 */
    const showForm = (args: { testVocacional: string | number, resultadoTestVocacional: string | number } | [testVocacional: string | number, resultadoTestVocacional: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RespuestaTestController::show
 * @see app/Http/Controllers/RespuestaTestController.php:121
 * @route '/tests-vocacionales/{testVocacional}/respuestas/{resultadoTestVocacional}'
 */
        showForm.get = (args: { testVocacional: string | number, resultadoTestVocacional: string | number } | [testVocacional: string | number, resultadoTestVocacional: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RespuestaTestController::show
 * @see app/Http/Controllers/RespuestaTestController.php:121
 * @route '/tests-vocacionales/{testVocacional}/respuestas/{resultadoTestVocacional}'
 */
        showForm.head = (args: { testVocacional: string | number, resultadoTestVocacional: string | number } | [testVocacional: string | number, resultadoTestVocacional: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\RespuestaTestController::estadisticas
 * @see app/Http/Controllers/RespuestaTestController.php:198
 * @route '/tests-vocacionales/{testVocacional}/respuestas/estadisticas'
 */
export const estadisticas = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(args, options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/{testVocacional}/respuestas/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RespuestaTestController::estadisticas
 * @see app/Http/Controllers/RespuestaTestController.php:198
 * @route '/tests-vocacionales/{testVocacional}/respuestas/estadisticas'
 */
estadisticas.url = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                }

    return estadisticas.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RespuestaTestController::estadisticas
 * @see app/Http/Controllers/RespuestaTestController.php:198
 * @route '/tests-vocacionales/{testVocacional}/respuestas/estadisticas'
 */
estadisticas.get = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RespuestaTestController::estadisticas
 * @see app/Http/Controllers/RespuestaTestController.php:198
 * @route '/tests-vocacionales/{testVocacional}/respuestas/estadisticas'
 */
estadisticas.head = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RespuestaTestController::estadisticas
 * @see app/Http/Controllers/RespuestaTestController.php:198
 * @route '/tests-vocacionales/{testVocacional}/respuestas/estadisticas'
 */
    const estadisticasForm = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RespuestaTestController::estadisticas
 * @see app/Http/Controllers/RespuestaTestController.php:198
 * @route '/tests-vocacionales/{testVocacional}/respuestas/estadisticas'
 */
        estadisticasForm.get = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RespuestaTestController::estadisticas
 * @see app/Http/Controllers/RespuestaTestController.php:198
 * @route '/tests-vocacionales/{testVocacional}/respuestas/estadisticas'
 */
        estadisticasForm.head = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticas.form = estadisticasForm
/**
* @see \App\Http\Controllers\RespuestaTestController::exportMethod
 * @see app/Http/Controllers/RespuestaTestController.php:294
 * @route '/tests-vocacionales/{testVocacional}/respuestas/export'
 */
export const exportMethod = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/{testVocacional}/respuestas/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RespuestaTestController::exportMethod
 * @see app/Http/Controllers/RespuestaTestController.php:294
 * @route '/tests-vocacionales/{testVocacional}/respuestas/export'
 */
exportMethod.url = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                }

    return exportMethod.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RespuestaTestController::exportMethod
 * @see app/Http/Controllers/RespuestaTestController.php:294
 * @route '/tests-vocacionales/{testVocacional}/respuestas/export'
 */
exportMethod.get = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RespuestaTestController::exportMethod
 * @see app/Http/Controllers/RespuestaTestController.php:294
 * @route '/tests-vocacionales/{testVocacional}/respuestas/export'
 */
exportMethod.head = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RespuestaTestController::exportMethod
 * @see app/Http/Controllers/RespuestaTestController.php:294
 * @route '/tests-vocacionales/{testVocacional}/respuestas/export'
 */
    const exportMethodForm = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RespuestaTestController::exportMethod
 * @see app/Http/Controllers/RespuestaTestController.php:294
 * @route '/tests-vocacionales/{testVocacional}/respuestas/export'
 */
        exportMethodForm.get = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RespuestaTestController::exportMethod
 * @see app/Http/Controllers/RespuestaTestController.php:294
 * @route '/tests-vocacionales/{testVocacional}/respuestas/export'
 */
        exportMethodForm.head = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
const RespuestaTestController = { index, show, estadisticas, exportMethod, export: exportMethod }

export default RespuestaTestController