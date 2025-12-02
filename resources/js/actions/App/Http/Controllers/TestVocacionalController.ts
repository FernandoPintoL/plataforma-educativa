import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:1007
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
 * @see app/Http/Controllers/TestVocacionalController.php:1007
 * @route '/api/vocacional/mi-perfil'
 */
getPerfilVocacional.url = (options?: RouteQueryOptions) => {
    return getPerfilVocacional.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:1007
 * @route '/api/vocacional/mi-perfil'
 */
getPerfilVocacional.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPerfilVocacional.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:1007
 * @route '/api/vocacional/mi-perfil'
 */
getPerfilVocacional.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPerfilVocacional.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:1007
 * @route '/api/vocacional/mi-perfil'
 */
    const getPerfilVocacionalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPerfilVocacional.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:1007
 * @route '/api/vocacional/mi-perfil'
 */
        getPerfilVocacionalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPerfilVocacional.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::getPerfilVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:1007
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
 * @see app/Http/Controllers/TestVocacionalController.php:1055
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
 * @see app/Http/Controllers/TestVocacionalController.php:1055
 * @route '/api/vocacional/recomendaciones-carrera'
 */
getRecomendacionesCarrera.url = (options?: RouteQueryOptions) => {
    return getRecomendacionesCarrera.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::getRecomendacionesCarrera
 * @see app/Http/Controllers/TestVocacionalController.php:1055
 * @route '/api/vocacional/recomendaciones-carrera'
 */
getRecomendacionesCarrera.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRecomendacionesCarrera.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::getRecomendacionesCarrera
 * @see app/Http/Controllers/TestVocacionalController.php:1055
 * @route '/api/vocacional/recomendaciones-carrera'
 */
getRecomendacionesCarrera.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRecomendacionesCarrera.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::getRecomendacionesCarrera
 * @see app/Http/Controllers/TestVocacionalController.php:1055
 * @route '/api/vocacional/recomendaciones-carrera'
 */
    const getRecomendacionesCarreraForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getRecomendacionesCarrera.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::getRecomendacionesCarrera
 * @see app/Http/Controllers/TestVocacionalController.php:1055
 * @route '/api/vocacional/recomendaciones-carrera'
 */
        getRecomendacionesCarreraForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRecomendacionesCarrera.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::getRecomendacionesCarrera
 * @see app/Http/Controllers/TestVocacionalController.php:1055
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
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraFormato
 * @see app/Http/Controllers/TestVocacionalController.php:1667
 * @route '/api/vocacional/recomendaciones-carrera-formato'
 */
export const obtenerRecomendacionesCarreraFormato = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerRecomendacionesCarreraFormato.url(options),
    method: 'get',
})

obtenerRecomendacionesCarreraFormato.definition = {
    methods: ["get","head"],
    url: '/api/vocacional/recomendaciones-carrera-formato',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraFormato
 * @see app/Http/Controllers/TestVocacionalController.php:1667
 * @route '/api/vocacional/recomendaciones-carrera-formato'
 */
obtenerRecomendacionesCarreraFormato.url = (options?: RouteQueryOptions) => {
    return obtenerRecomendacionesCarreraFormato.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraFormato
 * @see app/Http/Controllers/TestVocacionalController.php:1667
 * @route '/api/vocacional/recomendaciones-carrera-formato'
 */
obtenerRecomendacionesCarreraFormato.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerRecomendacionesCarreraFormato.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraFormato
 * @see app/Http/Controllers/TestVocacionalController.php:1667
 * @route '/api/vocacional/recomendaciones-carrera-formato'
 */
obtenerRecomendacionesCarreraFormato.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerRecomendacionesCarreraFormato.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraFormato
 * @see app/Http/Controllers/TestVocacionalController.php:1667
 * @route '/api/vocacional/recomendaciones-carrera-formato'
 */
    const obtenerRecomendacionesCarreraFormatoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerRecomendacionesCarreraFormato.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraFormato
 * @see app/Http/Controllers/TestVocacionalController.php:1667
 * @route '/api/vocacional/recomendaciones-carrera-formato'
 */
        obtenerRecomendacionesCarreraFormatoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerRecomendacionesCarreraFormato.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraFormato
 * @see app/Http/Controllers/TestVocacionalController.php:1667
 * @route '/api/vocacional/recomendaciones-carrera-formato'
 */
        obtenerRecomendacionesCarreraFormatoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerRecomendacionesCarreraFormato.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerRecomendacionesCarreraFormato.form = obtenerRecomendacionesCarreraFormatoForm
/**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraConAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1419
 * @route '/api/vocacional/recomendaciones-carrera-con-agente'
 */
export const obtenerRecomendacionesCarreraConAgente = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerRecomendacionesCarreraConAgente.url(options),
    method: 'get',
})

obtenerRecomendacionesCarreraConAgente.definition = {
    methods: ["get","head"],
    url: '/api/vocacional/recomendaciones-carrera-con-agente',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraConAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1419
 * @route '/api/vocacional/recomendaciones-carrera-con-agente'
 */
obtenerRecomendacionesCarreraConAgente.url = (options?: RouteQueryOptions) => {
    return obtenerRecomendacionesCarreraConAgente.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraConAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1419
 * @route '/api/vocacional/recomendaciones-carrera-con-agente'
 */
obtenerRecomendacionesCarreraConAgente.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerRecomendacionesCarreraConAgente.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraConAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1419
 * @route '/api/vocacional/recomendaciones-carrera-con-agente'
 */
obtenerRecomendacionesCarreraConAgente.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerRecomendacionesCarreraConAgente.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraConAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1419
 * @route '/api/vocacional/recomendaciones-carrera-con-agente'
 */
    const obtenerRecomendacionesCarreraConAgenteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerRecomendacionesCarreraConAgente.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraConAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1419
 * @route '/api/vocacional/recomendaciones-carrera-con-agente'
 */
        obtenerRecomendacionesCarreraConAgenteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerRecomendacionesCarreraConAgente.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::obtenerRecomendacionesCarreraConAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1419
 * @route '/api/vocacional/recomendaciones-carrera-con-agente'
 */
        obtenerRecomendacionesCarreraConAgenteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerRecomendacionesCarreraConAgente.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerRecomendacionesCarreraConAgente.form = obtenerRecomendacionesCarreraConAgenteForm
/**
* @see \App\Http\Controllers\TestVocacionalController::getAnalisisVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:1097
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
 * @see app/Http/Controllers/TestVocacionalController.php:1097
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
 * @see app/Http/Controllers/TestVocacionalController.php:1097
 * @route '/api/vocacional/analisis/{studentId}'
 */
getAnalisisVocacional.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnalisisVocacional.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::getAnalisisVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:1097
 * @route '/api/vocacional/analisis/{studentId}'
 */
getAnalisisVocacional.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAnalisisVocacional.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::getAnalisisVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:1097
 * @route '/api/vocacional/analisis/{studentId}'
 */
    const getAnalisisVocacionalForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAnalisisVocacional.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::getAnalisisVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:1097
 * @route '/api/vocacional/analisis/{studentId}'
 */
        getAnalisisVocacionalForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnalisisVocacional.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::getAnalisisVocacional
 * @see app/Http/Controllers/TestVocacionalController.php:1097
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
 * @see app/Http/Controllers/TestVocacionalController.php:1163
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
 * @see app/Http/Controllers/TestVocacionalController.php:1163
 * @route '/api/vocacional/reporte-institucional'
 */
getReporteInstitucional.url = (options?: RouteQueryOptions) => {
    return getReporteInstitucional.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::getReporteInstitucional
 * @see app/Http/Controllers/TestVocacionalController.php:1163
 * @route '/api/vocacional/reporte-institucional'
 */
getReporteInstitucional.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getReporteInstitucional.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::getReporteInstitucional
 * @see app/Http/Controllers/TestVocacionalController.php:1163
 * @route '/api/vocacional/reporte-institucional'
 */
getReporteInstitucional.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getReporteInstitucional.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::getReporteInstitucional
 * @see app/Http/Controllers/TestVocacionalController.php:1163
 * @route '/api/vocacional/reporte-institucional'
 */
    const getReporteInstitucionalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getReporteInstitucional.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::getReporteInstitucional
 * @see app/Http/Controllers/TestVocacionalController.php:1163
 * @route '/api/vocacional/reporte-institucional'
 */
        getReporteInstitucionalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getReporteInstitucional.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::getReporteInstitucional
 * @see app/Http/Controllers/TestVocacionalController.php:1163
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
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
export const generarSintesisAgente = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generarSintesisAgente.url(options),
    method: 'get',
})

generarSintesisAgente.definition = {
    methods: ["get","head"],
    url: '/api/vocacional/generar-sintesis-agente',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
generarSintesisAgente.url = (options?: RouteQueryOptions) => {
    return generarSintesisAgente.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
generarSintesisAgente.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generarSintesisAgente.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
generarSintesisAgente.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generarSintesisAgente.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
    const generarSintesisAgenteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generarSintesisAgente.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
        generarSintesisAgenteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generarSintesisAgente.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
        generarSintesisAgenteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generarSintesisAgente.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generarSintesisAgente.form = generarSintesisAgenteForm
/**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:54
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
 * @see app/Http/Controllers/TestVocacionalController.php:54
 * @route '/tests-vocacionales'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:54
 * @route '/tests-vocacionales'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:54
 * @route '/tests-vocacionales'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:54
 * @route '/tests-vocacionales'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:54
 * @route '/tests-vocacionales'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::index
 * @see app/Http/Controllers/TestVocacionalController.php:54
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
 * @see app/Http/Controllers/TestVocacionalController.php:107
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
 * @see app/Http/Controllers/TestVocacionalController.php:107
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
 * @see app/Http/Controllers/TestVocacionalController.php:107
 * @route '/tests-vocacionales/{testVocacional}'
 */
show.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::show
 * @see app/Http/Controllers/TestVocacionalController.php:107
 * @route '/tests-vocacionales/{testVocacional}'
 */
show.head = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::show
 * @see app/Http/Controllers/TestVocacionalController.php:107
 * @route '/tests-vocacionales/{testVocacional}'
 */
    const showForm = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::show
 * @see app/Http/Controllers/TestVocacionalController.php:107
 * @route '/tests-vocacionales/{testVocacional}'
 */
        showForm.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::show
 * @see app/Http/Controllers/TestVocacionalController.php:107
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
 * @see app/Http/Controllers/TestVocacionalController.php:121
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
 * @see app/Http/Controllers/TestVocacionalController.php:121
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
 * @see app/Http/Controllers/TestVocacionalController.php:121
 * @route '/tests-vocacionales/{testVocacional}/tomar'
 */
take.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::take
 * @see app/Http/Controllers/TestVocacionalController.php:121
 * @route '/tests-vocacionales/{testVocacional}/tomar'
 */
take.head = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: take.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::take
 * @see app/Http/Controllers/TestVocacionalController.php:121
 * @route '/tests-vocacionales/{testVocacional}/tomar'
 */
    const takeForm = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: take.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::take
 * @see app/Http/Controllers/TestVocacionalController.php:121
 * @route '/tests-vocacionales/{testVocacional}/tomar'
 */
        takeForm.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: take.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::take
 * @see app/Http/Controllers/TestVocacionalController.php:121
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
 * @see app/Http/Controllers/TestVocacionalController.php:180
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
 * @see app/Http/Controllers/TestVocacionalController.php:180
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
 * @see app/Http/Controllers/TestVocacionalController.php:180
 * @route '/tests-vocacionales/{testVocacional}/enviar'
 */
submitRespuestas.post = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitRespuestas.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::submitRespuestas
 * @see app/Http/Controllers/TestVocacionalController.php:180
 * @route '/tests-vocacionales/{testVocacional}/enviar'
 */
    const submitRespuestasForm = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitRespuestas.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::submitRespuestas
 * @see app/Http/Controllers/TestVocacionalController.php:180
 * @route '/tests-vocacionales/{testVocacional}/enviar'
 */
        submitRespuestasForm.post = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitRespuestas.url(args, options),
            method: 'post',
        })
    
    submitRespuestas.form = submitRespuestasForm
/**
* @see \App\Http\Controllers\TestVocacionalController::resultados
 * @see app/Http/Controllers/TestVocacionalController.php:291
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
 * @see app/Http/Controllers/TestVocacionalController.php:291
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
 * @see app/Http/Controllers/TestVocacionalController.php:291
 * @route '/tests-vocacionales/{testVocacional}/resultados'
 */
resultados.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resultados.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::resultados
 * @see app/Http/Controllers/TestVocacionalController.php:291
 * @route '/tests-vocacionales/{testVocacional}/resultados'
 */
resultados.head = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resultados.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::resultados
 * @see app/Http/Controllers/TestVocacionalController.php:291
 * @route '/tests-vocacionales/{testVocacional}/resultados'
 */
    const resultadosForm = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resultados.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::resultados
 * @see app/Http/Controllers/TestVocacionalController.php:291
 * @route '/tests-vocacionales/{testVocacional}/resultados'
 */
        resultadosForm.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resultados.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::resultados
 * @see app/Http/Controllers/TestVocacionalController.php:291
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
* @see \App\Http\Controllers\TestVocacionalController::generarPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1211
 * @route '/perfil-vocacional/generar'
 */
export const generarPerfilCombinado = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generarPerfilCombinado.url(options),
    method: 'post',
})

generarPerfilCombinado.definition = {
    methods: ["post"],
    url: '/perfil-vocacional/generar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::generarPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1211
 * @route '/perfil-vocacional/generar'
 */
generarPerfilCombinado.url = (options?: RouteQueryOptions) => {
    return generarPerfilCombinado.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::generarPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1211
 * @route '/perfil-vocacional/generar'
 */
generarPerfilCombinado.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generarPerfilCombinado.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::generarPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1211
 * @route '/perfil-vocacional/generar'
 */
    const generarPerfilCombinadoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generarPerfilCombinado.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::generarPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1211
 * @route '/perfil-vocacional/generar'
 */
        generarPerfilCombinadoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generarPerfilCombinado.url(options),
            method: 'post',
        })
    
    generarPerfilCombinado.form = generarPerfilCombinadoForm
/**
* @see \App\Http\Controllers\TestVocacionalController::obtenerPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
export const obtenerPerfilCombinado = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerPerfilCombinado.url(options),
    method: 'get',
})

obtenerPerfilCombinado.definition = {
    methods: ["get","head"],
    url: '/perfil-vocacional/obtener',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::obtenerPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
obtenerPerfilCombinado.url = (options?: RouteQueryOptions) => {
    return obtenerPerfilCombinado.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::obtenerPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
obtenerPerfilCombinado.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerPerfilCombinado.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::obtenerPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
obtenerPerfilCombinado.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerPerfilCombinado.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::obtenerPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
    const obtenerPerfilCombinadoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerPerfilCombinado.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::obtenerPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
        obtenerPerfilCombinadoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerPerfilCombinado.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::obtenerPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
        obtenerPerfilCombinadoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerPerfilCombinado.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerPerfilCombinado.form = obtenerPerfilCombinadoForm
/**
* @see \App\Http\Controllers\TestVocacionalController::mostrarPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
export const mostrarPerfilCombinado = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mostrarPerfilCombinado.url(options),
    method: 'get',
})

mostrarPerfilCombinado.definition = {
    methods: ["get","head"],
    url: '/perfil-vocacional',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::mostrarPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
mostrarPerfilCombinado.url = (options?: RouteQueryOptions) => {
    return mostrarPerfilCombinado.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::mostrarPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
mostrarPerfilCombinado.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mostrarPerfilCombinado.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::mostrarPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
mostrarPerfilCombinado.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mostrarPerfilCombinado.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::mostrarPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
    const mostrarPerfilCombinadoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: mostrarPerfilCombinado.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::mostrarPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
        mostrarPerfilCombinadoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mostrarPerfilCombinado.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::mostrarPerfilCombinado
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
        mostrarPerfilCombinadoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mostrarPerfilCombinado.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    mostrarPerfilCombinado.form = mostrarPerfilCombinadoForm
/**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:69
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
 * @see app/Http/Controllers/TestVocacionalController.php:69
 * @route '/tests-vocacionales/crear'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:69
 * @route '/tests-vocacionales/crear'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:69
 * @route '/tests-vocacionales/crear'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:69
 * @route '/tests-vocacionales/crear'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:69
 * @route '/tests-vocacionales/crear'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::create
 * @see app/Http/Controllers/TestVocacionalController.php:69
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
 * @see app/Http/Controllers/TestVocacionalController.php:77
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
 * @see app/Http/Controllers/TestVocacionalController.php:77
 * @route '/tests-vocacionales'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::store
 * @see app/Http/Controllers/TestVocacionalController.php:77
 * @route '/tests-vocacionales'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::store
 * @see app/Http/Controllers/TestVocacionalController.php:77
 * @route '/tests-vocacionales'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::store
 * @see app/Http/Controllers/TestVocacionalController.php:77
 * @route '/tests-vocacionales'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TestVocacionalController::edit
 * @see app/Http/Controllers/TestVocacionalController.php:311
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
 * @see app/Http/Controllers/TestVocacionalController.php:311
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
 * @see app/Http/Controllers/TestVocacionalController.php:311
 * @route '/tests-vocacionales/{testVocacional}/editar'
 */
edit.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::edit
 * @see app/Http/Controllers/TestVocacionalController.php:311
 * @route '/tests-vocacionales/{testVocacional}/editar'
 */
edit.head = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::edit
 * @see app/Http/Controllers/TestVocacionalController.php:311
 * @route '/tests-vocacionales/{testVocacional}/editar'
 */
    const editForm = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::edit
 * @see app/Http/Controllers/TestVocacionalController.php:311
 * @route '/tests-vocacionales/{testVocacional}/editar'
 */
        editForm.get = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::edit
 * @see app/Http/Controllers/TestVocacionalController.php:311
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
 * @see app/Http/Controllers/TestVocacionalController.php:323
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
 * @see app/Http/Controllers/TestVocacionalController.php:323
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
 * @see app/Http/Controllers/TestVocacionalController.php:323
 * @route '/tests-vocacionales/{testVocacional}'
 */
update6ad39cf0333ff8cbcf25d3912cd6dff4.put = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update6ad39cf0333ff8cbcf25d3912cd6dff4.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::update
 * @see app/Http/Controllers/TestVocacionalController.php:323
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
 * @see app/Http/Controllers/TestVocacionalController.php:323
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
 * @see app/Http/Controllers/TestVocacionalController.php:323
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
 * @see app/Http/Controllers/TestVocacionalController.php:323
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
 * @see app/Http/Controllers/TestVocacionalController.php:323
 * @route '/tests-vocacionales/{testVocacional}'
 */
update6ad39cf0333ff8cbcf25d3912cd6dff4.patch = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update6ad39cf0333ff8cbcf25d3912cd6dff4.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::update
 * @see app/Http/Controllers/TestVocacionalController.php:323
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
 * @see app/Http/Controllers/TestVocacionalController.php:323
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
 * @see app/Http/Controllers/TestVocacionalController.php:353
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
 * @see app/Http/Controllers/TestVocacionalController.php:353
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
 * @see app/Http/Controllers/TestVocacionalController.php:353
 * @route '/tests-vocacionales/{testVocacional}'
 */
destroy.delete = (args: { testVocacional: number | { id: number } } | [testVocacional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::destroy
 * @see app/Http/Controllers/TestVocacionalController.php:353
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
 * @see app/Http/Controllers/TestVocacionalController.php:353
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
const TestVocacionalController = { getPerfilVocacional, getRecomendacionesCarrera, obtenerRecomendacionesCarreraFormato, obtenerRecomendacionesCarreraConAgente, getAnalisisVocacional, getReporteInstitucional, generarSintesisAgente, index, show, take, submitRespuestas, resultados, generarPerfilCombinado, obtenerPerfilCombinado, mostrarPerfilCombinado, create, store, edit, update, destroy }

export default TestVocacionalController