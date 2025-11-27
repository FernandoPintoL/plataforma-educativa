import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../wayfinder'
/**
* @see \TestVocacionalController::getPerfilVocacional
 * @see [unknown]:0
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
* @see \TestVocacionalController::getPerfilVocacional
 * @see [unknown]:0
 * @route '/api/vocacional/mi-perfil'
 */
getPerfilVocacional.url = (options?: RouteQueryOptions) => {
    return getPerfilVocacional.definition.url + queryParams(options)
}

/**
* @see \TestVocacionalController::getPerfilVocacional
 * @see [unknown]:0
 * @route '/api/vocacional/mi-perfil'
 */
getPerfilVocacional.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPerfilVocacional.url(options),
    method: 'get',
})
/**
* @see \TestVocacionalController::getPerfilVocacional
 * @see [unknown]:0
 * @route '/api/vocacional/mi-perfil'
 */
getPerfilVocacional.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPerfilVocacional.url(options),
    method: 'head',
})

    /**
* @see \TestVocacionalController::getPerfilVocacional
 * @see [unknown]:0
 * @route '/api/vocacional/mi-perfil'
 */
    const getPerfilVocacionalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPerfilVocacional.url(options),
        method: 'get',
    })

            /**
* @see \TestVocacionalController::getPerfilVocacional
 * @see [unknown]:0
 * @route '/api/vocacional/mi-perfil'
 */
        getPerfilVocacionalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPerfilVocacional.url(options),
            method: 'get',
        })
            /**
* @see \TestVocacionalController::getPerfilVocacional
 * @see [unknown]:0
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
* @see \TestVocacionalController::getRecomendacionesCarrera
 * @see [unknown]:0
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
* @see \TestVocacionalController::getRecomendacionesCarrera
 * @see [unknown]:0
 * @route '/api/vocacional/recomendaciones-carrera'
 */
getRecomendacionesCarrera.url = (options?: RouteQueryOptions) => {
    return getRecomendacionesCarrera.definition.url + queryParams(options)
}

/**
* @see \TestVocacionalController::getRecomendacionesCarrera
 * @see [unknown]:0
 * @route '/api/vocacional/recomendaciones-carrera'
 */
getRecomendacionesCarrera.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRecomendacionesCarrera.url(options),
    method: 'get',
})
/**
* @see \TestVocacionalController::getRecomendacionesCarrera
 * @see [unknown]:0
 * @route '/api/vocacional/recomendaciones-carrera'
 */
getRecomendacionesCarrera.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRecomendacionesCarrera.url(options),
    method: 'head',
})

    /**
* @see \TestVocacionalController::getRecomendacionesCarrera
 * @see [unknown]:0
 * @route '/api/vocacional/recomendaciones-carrera'
 */
    const getRecomendacionesCarreraForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getRecomendacionesCarrera.url(options),
        method: 'get',
    })

            /**
* @see \TestVocacionalController::getRecomendacionesCarrera
 * @see [unknown]:0
 * @route '/api/vocacional/recomendaciones-carrera'
 */
        getRecomendacionesCarreraForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRecomendacionesCarrera.url(options),
            method: 'get',
        })
            /**
* @see \TestVocacionalController::getRecomendacionesCarrera
 * @see [unknown]:0
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
* @see \TestVocacionalController::getAnalisisVocacional
 * @see [unknown]:0
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
* @see \TestVocacionalController::getAnalisisVocacional
 * @see [unknown]:0
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
* @see \TestVocacionalController::getAnalisisVocacional
 * @see [unknown]:0
 * @route '/api/vocacional/analisis/{studentId}'
 */
getAnalisisVocacional.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnalisisVocacional.url(args, options),
    method: 'get',
})
/**
* @see \TestVocacionalController::getAnalisisVocacional
 * @see [unknown]:0
 * @route '/api/vocacional/analisis/{studentId}'
 */
getAnalisisVocacional.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAnalisisVocacional.url(args, options),
    method: 'head',
})

    /**
* @see \TestVocacionalController::getAnalisisVocacional
 * @see [unknown]:0
 * @route '/api/vocacional/analisis/{studentId}'
 */
    const getAnalisisVocacionalForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAnalisisVocacional.url(args, options),
        method: 'get',
    })

            /**
* @see \TestVocacionalController::getAnalisisVocacional
 * @see [unknown]:0
 * @route '/api/vocacional/analisis/{studentId}'
 */
        getAnalisisVocacionalForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnalisisVocacional.url(args, options),
            method: 'get',
        })
            /**
* @see \TestVocacionalController::getAnalisisVocacional
 * @see [unknown]:0
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
* @see \TestVocacionalController::getReporteInstitucional
 * @see [unknown]:0
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
* @see \TestVocacionalController::getReporteInstitucional
 * @see [unknown]:0
 * @route '/api/vocacional/reporte-institucional'
 */
getReporteInstitucional.url = (options?: RouteQueryOptions) => {
    return getReporteInstitucional.definition.url + queryParams(options)
}

/**
* @see \TestVocacionalController::getReporteInstitucional
 * @see [unknown]:0
 * @route '/api/vocacional/reporte-institucional'
 */
getReporteInstitucional.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getReporteInstitucional.url(options),
    method: 'get',
})
/**
* @see \TestVocacionalController::getReporteInstitucional
 * @see [unknown]:0
 * @route '/api/vocacional/reporte-institucional'
 */
getReporteInstitucional.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getReporteInstitucional.url(options),
    method: 'head',
})

    /**
* @see \TestVocacionalController::getReporteInstitucional
 * @see [unknown]:0
 * @route '/api/vocacional/reporte-institucional'
 */
    const getReporteInstitucionalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getReporteInstitucional.url(options),
        method: 'get',
    })

            /**
* @see \TestVocacionalController::getReporteInstitucional
 * @see [unknown]:0
 * @route '/api/vocacional/reporte-institucional'
 */
        getReporteInstitucionalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getReporteInstitucional.url(options),
            method: 'get',
        })
            /**
* @see \TestVocacionalController::getReporteInstitucional
 * @see [unknown]:0
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
const TestVocacionalController = { getPerfilVocacional, getRecomendacionesCarrera, getAnalisisVocacional, getReporteInstitucional }

export default TestVocacionalController