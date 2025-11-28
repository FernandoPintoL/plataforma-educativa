import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:830
 * @route '/api/vocacional/mi-perfil'
 */
export const getPerfilVocacional = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPerfilVocacional.url(options),
    method: 'get',
})

getPerfilVocacional.definition = {
    methods: ["get","head"],
    url: '/api/vocacional/mi-perfil',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:830
 * @route '/api/vocacional/mi-perfil'
 */
getPerfilVocacional.url = (options?: RouteQueryOptions) => {
    return getPerfilVocacional.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:830
 * @route '/api/vocacional/mi-perfil'
 */
getPerfilVocacional.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPerfilVocacional.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:830
 * @route '/api/vocacional/mi-perfil'
 */
getPerfilVocacional.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPerfilVocacional.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:830
 * @route '/api/vocacional/mi-perfil'
 */
    const getPerfilVocacionalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPerfilVocacional.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:830
 * @route '/api/vocacional/mi-perfil'
 */
        getPerfilVocacionalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPerfilVocacional.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:830
 * @route '/api/vocacional/mi-perfil'
 */
        getPerfilVocacionalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPerfilVocacional.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getPerfilVocacional.form = getPerfilVocacionalForm
/**
* @see \App\Http\Controllers\TestVocacionalController::getRecomendacionesCarrera
 * @see app/Http/Controllers/TestVocacionalController.php:878
 * @route '/api/vocacional/recomendaciones-carrera'
 */
export const getRecomendacionesCarrera = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRecomendacionesCarrera.url(options),
    method: 'get',
})

getRecomendacionesCarrera.definition = {
    methods: ["get","head"],
    url: '/api/vocacional/recomendaciones-carrera',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::getRecomendacionesCarrera
 * @see app/Http/Controllers/TestVocacionalController.php:878
 * @route '/api/vocacional/recomendaciones-carrera'
 */
getRecomendacionesCarrera.url = (options?: RouteQueryOptions) => {
    return getRecomendacionesCarrera.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::getRecomendacionesCarrera
 * @see app/Http/Controllers/TestVocacionalController.php:878
 * @route '/api/vocacional/recomendaciones-carrera'
 */
getRecomendacionesCarrera.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRecomendacionesCarrera.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::getRecomendacionesCarrera
 * @see app/Http/Controllers/TestVocacionalController.php:878
 * @route '/api/vocacional/recomendaciones-carrera'
 */
getRecomendacionesCarrera.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRecomendacionesCarrera.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::getRecomendacionesCarrera
 * @see app/Http/Controllers/TestVocacionalController.php:878
 * @route '/api/vocacional/recomendaciones-carrera'
 */
    const getRecomendacionesCarreraForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getRecomendacionesCarrera.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::getRecomendacionesCarrera
 * @see app/Http/Controllers/TestVocacionalController.php:878
 * @route '/api/vocacional/recomendaciones-carrera'
 */
        getRecomendacionesCarreraForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRecomendacionesCarrera.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::getRecomendacionesCarrera
 * @see app/Http/Controllers/TestVocacionalController.php:878
 * @route '/api/vocacional/recomendaciones-carrera'
 */
        getRecomendacionesCarreraForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRecomendacionesCarrera.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getRecomendacionesCarrera.form = getRecomendacionesCarreraForm
/**
* @see \App\Http\Controllers\TestVocacionalController::getAnalisisVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:920
 * @route '/api/vocacional/analisis/{studentId}'
 */
export const getAnalisisVocacional = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnalisisVocacional.url(args, options),
    method: 'get',
})

getAnalisisVocacional.definition = {
    methods: ["get","head"],
    url: '/api/vocacional/analisis/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::getAnalisisVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:920
 * @route '/api/vocacional/analisis/{studentId}'
 */
getAnalisisVocacional.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { studentId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    studentId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        studentId: args.studentId,
                }

    return getAnalisisVocacional.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::getAnalisisVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:920
 * @route '/api/vocacional/analisis/{studentId}'
 */
getAnalisisVocacional.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnalisisVocacional.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::getAnalisisVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:920
 * @route '/api/vocacional/analisis/{studentId}'
 */
getAnalisisVocacional.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAnalisisVocacional.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::getAnalisisVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:920
 * @route '/api/vocacional/analisis/{studentId}'
 */
    const getAnalisisVocacionalForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAnalisisVocacional.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::getAnalisisVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:920
 * @route '/api/vocacional/analisis/{studentId}'
 */
        getAnalisisVocacionalForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnalisisVocacional.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::getAnalisisVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:920
 * @route '/api/vocacional/analisis/{studentId}'
 */
        getAnalisisVocacionalForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnalisisVocacional.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getAnalisisVocacional.form = getAnalisisVocacionalForm
/**
* @see \App\Http\Controllers\TestVocacionalController::getReporteInstitucional
 * @see app/Http/Controllers/TestVocacionalController.php:986
 * @route '/api/vocacional/reporte-institucional'
 */
export const getReporteInstitucional = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getReporteInstitucional.url(options),
    method: 'get',
})

getReporteInstitucional.definition = {
    methods: ["get","head"],
    url: '/api/vocacional/reporte-institucional',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::getReporteInstitucional
 * @see app/Http/Controllers/TestVocacionalController.php:986
 * @route '/api/vocacional/reporte-institucional'
 */
getReporteInstitucional.url = (options?: RouteQueryOptions) => {
    return getReporteInstitucional.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::getReporteInstitucional
 * @see app/Http/Controllers/TestVocacionalController.php:986
 * @route '/api/vocacional/reporte-institucional'
 */
getReporteInstitucional.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getReporteInstitucional.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::getReporteInstitucional
 * @see app/Http/Controllers/TestVocacionalController.php:986
 * @route '/api/vocacional/reporte-institucional'
 */
getReporteInstitucional.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getReporteInstitucional.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::getReporteInstitucional
 * @see app/Http/Controllers/TestVocacionalController.php:986
 * @route '/api/vocacional/reporte-institucional'
 */
    const getReporteInstitucionalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getReporteInstitucional.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::getReporteInstitucional
 * @see app/Http/Controllers/TestVocacionalController.php:986
 * @route '/api/vocacional/reporte-institucional'
 */
        getReporteInstitucionalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getReporteInstitucional.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::getReporteInstitucional
 * @see app/Http/Controllers/TestVocacionalController.php:986
 * @route '/api/vocacional/reporte-institucional'
 */
        getReporteInstitucionalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getReporteInstitucional.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getReporteInstitucional.form = getReporteInstitucionalForm
/**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:53
 * @route '/tests-vocacionales'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:53
 * @route '/tests-vocacionales'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:53
 * @route '/tests-vocacionales'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:53
 * @route '/tests-vocacionales'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:53
 * @route '/tests-vocacionales'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:53
 * @route '/tests-vocacionales'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:53
 * @route '/tests-vocacionales'
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
* @see \App\Http\Controllers\TestVocacionalController::show
 * @see app/Http/Controllers/TestVocacionalController.php:106
 * @route '/tests-vocacionales/{testVocacional}'
 */
export const show = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/{testVocacional}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::show
 * @see app/Http/Controllers/TestVocacionalController.php:106
 * @route '/tests-vocacionales/{testVocacional}'
 */
show.url = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { testVocacional: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: typeof args.testVocacional === 'object'
                ? args.testVocacional.id
                : args.testVocacional,
                }

    return show.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::show
 * @see app/Http/Controllers/TestVocacionalController.php:106
 * @route '/tests-vocacionales/{testVocacional}'
 */
show.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::show
 * @see app/Http/Controllers/TestVocacionalController.php:106
 * @route '/tests-vocacionales/{testVocacional}'
 */
show.head = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::show
 * @see app/Http/Controllers/TestVocacionalController.php:106
 * @route '/tests-vocacionales/{testVocacional}'
 */
    const showForm = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::show
 * @see app/Http/Controllers/TestVocacionalController.php:106
 * @route '/tests-vocacionales/{testVocacional}'
 */
        showForm.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::show
 * @see app/Http/Controllers/TestVocacionalController.php:106
 * @route '/tests-vocacionales/{testVocacional}'
 */
        showForm.head = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TestVocacionalController::take
 * @see app/Http/Controllers/TestVocacionalController.php:118
 * @route '/tests-vocacionales/{testVocacional}/tomar'
 */
export const take = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})

take.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/{testVocacional}/tomar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::take
 * @see app/Http/Controllers/TestVocacionalController.php:118
 * @route '/tests-vocacionales/{testVocacional}/tomar'
 */
take.url = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { testVocacional: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: typeof args.testVocacional === 'object'
                ? args.testVocacional.id
                : args.testVocacional,
                }

    return take.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::take
 * @see app/Http/Controllers/TestVocacionalController.php:118
 * @route '/tests-vocacionales/{testVocacional}/tomar'
 */
take.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::take
 * @see app/Http/Controllers/TestVocacionalController.php:118
 * @route '/tests-vocacionales/{testVocacional}/tomar'
 */
take.head = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: take.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::take
 * @see app/Http/Controllers/TestVocacionalController.php:118
 * @route '/tests-vocacionales/{testVocacional}/tomar'
 */
    const takeForm = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: take.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::take
 * @see app/Http/Controllers/TestVocacionalController.php:118
 * @route '/tests-vocacionales/{testVocacional}/tomar'
 */
        takeForm.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: take.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::take
 * @see app/Http/Controllers/TestVocacionalController.php:118
 * @route '/tests-vocacionales/{testVocacional}/tomar'
 */
        takeForm.head = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TestVocacionalController::submitRespuestas
 * @see app/Http/Controllers/TestVocacionalController.php:133
 * @route '/tests-vocacionales/{testVocacional}/enviar'
 */
export const submitRespuestas = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitRespuestas.url(args, options),
    method: 'post',
})

submitRespuestas.definition = {
    methods: ["post"],
    url: '/tests-vocacionales/{testVocacional}/enviar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::submitRespuestas
 * @see app/Http/Controllers/TestVocacionalController.php:133
 * @route '/tests-vocacionales/{testVocacional}/enviar'
 */
submitRespuestas.url = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { testVocacional: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: typeof args.testVocacional === 'object'
                ? args.testVocacional.id
                : args.testVocacional,
                }

    return submitRespuestas.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::submitRespuestas
 * @see app/Http/Controllers/TestVocacionalController.php:133
 * @route '/tests-vocacionales/{testVocacional}/enviar'
 */
submitRespuestas.post = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitRespuestas.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::submitRespuestas
 * @see app/Http/Controllers/TestVocacionalController.php:133
 * @route '/tests-vocacionales/{testVocacional}/enviar'
 */
    const submitRespuestasForm = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitRespuestas.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::submitRespuestas
 * @see app/Http/Controllers/TestVocacionalController.php:133
 * @route '/tests-vocacionales/{testVocacional}/enviar'
 */
        submitRespuestasForm.post = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitRespuestas.url(args, options),
            method: 'post',
        })
    
    submitRespuestas.form = submitRespuestasForm
/**
* @see \App\Http\Controllers\TestVocacionalController::resultados
 * @see app/Http/Controllers/TestVocacionalController.php:172
 * @route '/tests-vocacionales/{testVocacional}/resultados'
 */
export const resultados = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resultados.url(args, options),
    method: 'get',
})

resultados.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/{testVocacional}/resultados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::resultados
 * @see app/Http/Controllers/TestVocacionalController.php:172
 * @route '/tests-vocacionales/{testVocacional}/resultados'
 */
resultados.url = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { testVocacional: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: typeof args.testVocacional === 'object'
                ? args.testVocacional.id
                : args.testVocacional,
                }

    return resultados.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::resultados
 * @see app/Http/Controllers/TestVocacionalController.php:172
 * @route '/tests-vocacionales/{testVocacional}/resultados'
 */
resultados.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resultados.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::resultados
 * @see app/Http/Controllers/TestVocacionalController.php:172
 * @route '/tests-vocacionales/{testVocacional}/resultados'
 */
resultados.head = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resultados.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::resultados
 * @see app/Http/Controllers/TestVocacionalController.php:172
 * @route '/tests-vocacionales/{testVocacional}/resultados'
 */
    const resultadosForm = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resultados.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::resultados
 * @see app/Http/Controllers/TestVocacionalController.php:172
 * @route '/tests-vocacionales/{testVocacional}/resultados'
 */
        resultadosForm.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resultados.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::resultados
 * @see app/Http/Controllers/TestVocacionalController.php:172
 * @route '/tests-vocacionales/{testVocacional}/resultados'
 */
        resultadosForm.head = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resultados.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    resultados.form = resultadosForm
/**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:68
 * @route '/tests-vocacionales/crear'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:68
 * @route '/tests-vocacionales/crear'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:68
 * @route '/tests-vocacionales/crear'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:68
 * @route '/tests-vocacionales/crear'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:68
 * @route '/tests-vocacionales/crear'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:68
 * @route '/tests-vocacionales/crear'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:68
 * @route '/tests-vocacionales/crear'
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
* @see \App\Http\Controllers\TestVocacionalController::store
 * @see app/Http/Controllers/TestVocacionalController.php:76
 * @route '/tests-vocacionales'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tests-vocacionales',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::store
 * @see app/Http/Controllers/TestVocacionalController.php:76
 * @route '/tests-vocacionales'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::store
 * @see app/Http/Controllers/TestVocacionalController.php:76
 * @route '/tests-vocacionales'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::store
 * @see app/Http/Controllers/TestVocacionalController.php:76
 * @route '/tests-vocacionales'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::store
 * @see app/Http/Controllers/TestVocacionalController.php:76
 * @route '/tests-vocacionales'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TestVocacionalController::edit
 * @see app/Http/Controllers/TestVocacionalController.php:192
 * @route '/tests-vocacionales/{testVocacional}/editar'
 */
export const edit = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/{testVocacional}/editar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::edit
 * @see app/Http/Controllers/TestVocacionalController.php:192
 * @route '/tests-vocacionales/{testVocacional}/editar'
 */
edit.url = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { testVocacional: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: typeof args.testVocacional === 'object'
                ? args.testVocacional.id
                : args.testVocacional,
                }

    return edit.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::edit
 * @see app/Http/Controllers/TestVocacionalController.php:192
 * @route '/tests-vocacionales/{testVocacional}/editar'
 */
edit.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::edit
 * @see app/Http/Controllers/TestVocacionalController.php:192
 * @route '/tests-vocacionales/{testVocacional}/editar'
 */
edit.head = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::edit
 * @see app/Http/Controllers/TestVocacionalController.php:192
 * @route '/tests-vocacionales/{testVocacional}/editar'
 */
    const editForm = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::edit
 * @see app/Http/Controllers/TestVocacionalController.php:192
 * @route '/tests-vocacionales/{testVocacional}/editar'
 */
        editForm.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::edit
 * @see app/Http/Controllers/TestVocacionalController.php:192
 * @route '/tests-vocacionales/{testVocacional}/editar'
 */
        editForm.head = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TestVocacionalController::update
 * @see app/Http/Controllers/TestVocacionalController.php:204
 * @route '/tests-vocacionales/{testVocacional}'
 */
const update6ad39cf0333ff8cbcf25d3912cd6dff4 = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update6ad39cf0333ff8cbcf25d3912cd6dff4.url(args, options),
    method: 'put',
})

update6ad39cf0333ff8cbcf25d3912cd6dff4.definition = {
    methods: ["put"],
    url: '/tests-vocacionales/{testVocacional}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::update
 * @see app/Http/Controllers/TestVocacionalController.php:204
 * @route '/tests-vocacionales/{testVocacional}'
 */
update6ad39cf0333ff8cbcf25d3912cd6dff4.url = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { testVocacional: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: typeof args.testVocacional === 'object'
                ? args.testVocacional.id
                : args.testVocacional,
                }

    return update6ad39cf0333ff8cbcf25d3912cd6dff4.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::update
 * @see app/Http/Controllers/TestVocacionalController.php:204
 * @route '/tests-vocacionales/{testVocacional}'
 */
update6ad39cf0333ff8cbcf25d3912cd6dff4.put = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update6ad39cf0333ff8cbcf25d3912cd6dff4.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::update
 * @see app/Http/Controllers/TestVocacionalController.php:204
 * @route '/tests-vocacionales/{testVocacional}'
 */
    const update6ad39cf0333ff8cbcf25d3912cd6dff4Form = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update6ad39cf0333ff8cbcf25d3912cd6dff4.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::update
 * @see app/Http/Controllers/TestVocacionalController.php:204
 * @route '/tests-vocacionales/{testVocacional}'
 */
        update6ad39cf0333ff8cbcf25d3912cd6dff4Form.put = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update6ad39cf0333ff8cbcf25d3912cd6dff4.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update6ad39cf0333ff8cbcf25d3912cd6dff4.form = update6ad39cf0333ff8cbcf25d3912cd6dff4Form
    /**
* @see \App\Http\Controllers\TestVocacionalController::update
 * @see app/Http/Controllers/TestVocacionalController.php:204
 * @route '/tests-vocacionales/{testVocacional}'
 */
const update6ad39cf0333ff8cbcf25d3912cd6dff4 = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update6ad39cf0333ff8cbcf25d3912cd6dff4.url(args, options),
    method: 'patch',
})

update6ad39cf0333ff8cbcf25d3912cd6dff4.definition = {
    methods: ["patch"],
    url: '/tests-vocacionales/{testVocacional}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::update
 * @see app/Http/Controllers/TestVocacionalController.php:204
 * @route '/tests-vocacionales/{testVocacional}'
 */
update6ad39cf0333ff8cbcf25d3912cd6dff4.url = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { testVocacional: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: typeof args.testVocacional === 'object'
                ? args.testVocacional.id
                : args.testVocacional,
                }

    return update6ad39cf0333ff8cbcf25d3912cd6dff4.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::update
 * @see app/Http/Controllers/TestVocacionalController.php:204
 * @route '/tests-vocacionales/{testVocacional}'
 */
update6ad39cf0333ff8cbcf25d3912cd6dff4.patch = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update6ad39cf0333ff8cbcf25d3912cd6dff4.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::update
 * @see app/Http/Controllers/TestVocacionalController.php:204
 * @route '/tests-vocacionales/{testVocacional}'
 */
    const update6ad39cf0333ff8cbcf25d3912cd6dff4Form = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update6ad39cf0333ff8cbcf25d3912cd6dff4.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::update
 * @see app/Http/Controllers/TestVocacionalController.php:204
 * @route '/tests-vocacionales/{testVocacional}'
 */
        update6ad39cf0333ff8cbcf25d3912cd6dff4Form.patch = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update6ad39cf0333ff8cbcf25d3912cd6dff4.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update6ad39cf0333ff8cbcf25d3912cd6dff4.form = update6ad39cf0333ff8cbcf25d3912cd6dff4Form

export const update = {
    '/tests-vocacionales/{testVocacional}': update6ad39cf0333ff8cbcf25d3912cd6dff4,
    '/tests-vocacionales/{testVocacional}': update6ad39cf0333ff8cbcf25d3912cd6dff4,
}

/**
* @see \App\Http\Controllers\TestVocacionalController::destroy
 * @see app/Http/Controllers/TestVocacionalController.php:234
 * @route '/tests-vocacionales/{testVocacional}'
 */
export const destroy = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tests-vocacionales/{testVocacional}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::destroy
 * @see app/Http/Controllers/TestVocacionalController.php:234
 * @route '/tests-vocacionales/{testVocacional}'
 */
destroy.url = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { testVocacional: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: typeof args.testVocacional === 'object'
                ? args.testVocacional.id
                : args.testVocacional,
                }

    return destroy.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::destroy
 * @see app/Http/Controllers/TestVocacionalController.php:234
 * @route '/tests-vocacionales/{testVocacional}'
 */
destroy.delete = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::destroy
 * @see app/Http/Controllers/TestVocacionalController.php:234
 * @route '/tests-vocacionales/{testVocacional}'
 */
    const destroyForm = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::destroy
 * @see app/Http/Controllers/TestVocacionalController.php:234
 * @route '/tests-vocacionales/{testVocacional}'
 */
        destroyForm.delete = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TestVocacionalController = { getPerfilVocacional, getRecomendacionesCarrera, getAnalisisVocacional, getReporteInstitucional, index, show, take, submitRespuestas, resultados, create, store, edit, update, destroy }

export default TestVocacionalController