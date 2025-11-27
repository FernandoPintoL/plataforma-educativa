import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \TestVocacionalController::miPerfil
 * @see [unknown]:0
 * @route '/api/vocacional/mi-perfil'
 */
export const miPerfil = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: miPerfil.url(options),
    method: 'get',
})

miPerfil.definition = {
    methods: ["get","head"],
    url: '/api/vocacional/mi-perfil',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \TestVocacionalController::miPerfil
 * @see [unknown]:0
 * @route '/api/vocacional/mi-perfil'
 */
miPerfil.url = (options?: RouteQueryOptions) => {
    return miPerfil.definition.url + queryParams(options)
}

/**
* @see \TestVocacionalController::miPerfil
 * @see [unknown]:0
 * @route '/api/vocacional/mi-perfil'
 */
miPerfil.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: miPerfil.url(options),
    method: 'get',
})
/**
* @see \TestVocacionalController::miPerfil
 * @see [unknown]:0
 * @route '/api/vocacional/mi-perfil'
 */
miPerfil.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: miPerfil.url(options),
    method: 'head',
})

    /**
* @see \TestVocacionalController::miPerfil
 * @see [unknown]:0
 * @route '/api/vocacional/mi-perfil'
 */
    const miPerfilForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: miPerfil.url(options),
        method: 'get',
    })

            /**
* @see \TestVocacionalController::miPerfil
 * @see [unknown]:0
 * @route '/api/vocacional/mi-perfil'
 */
        miPerfilForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: miPerfil.url(options),
            method: 'get',
        })
            /**
* @see \TestVocacionalController::miPerfil
 * @see [unknown]:0
 * @route '/api/vocacional/mi-perfil'
 */
        miPerfilForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: miPerfil.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    miPerfil.form = miPerfilForm
/**
* @see \TestVocacionalController::recomendacionesCarrera
 * @see [unknown]:0
 * @route '/api/vocacional/recomendaciones-carrera'
 */
export const recomendacionesCarrera = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recomendacionesCarrera.url(options),
    method: 'get',
})

recomendacionesCarrera.definition = {
    methods: ["get","head"],
    url: '/api/vocacional/recomendaciones-carrera',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \TestVocacionalController::recomendacionesCarrera
 * @see [unknown]:0
 * @route '/api/vocacional/recomendaciones-carrera'
 */
recomendacionesCarrera.url = (options?: RouteQueryOptions) => {
    return recomendacionesCarrera.definition.url + queryParams(options)
}

/**
* @see \TestVocacionalController::recomendacionesCarrera
 * @see [unknown]:0
 * @route '/api/vocacional/recomendaciones-carrera'
 */
recomendacionesCarrera.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recomendacionesCarrera.url(options),
    method: 'get',
})
/**
* @see \TestVocacionalController::recomendacionesCarrera
 * @see [unknown]:0
 * @route '/api/vocacional/recomendaciones-carrera'
 */
recomendacionesCarrera.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recomendacionesCarrera.url(options),
    method: 'head',
})

    /**
* @see \TestVocacionalController::recomendacionesCarrera
 * @see [unknown]:0
 * @route '/api/vocacional/recomendaciones-carrera'
 */
    const recomendacionesCarreraForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: recomendacionesCarrera.url(options),
        method: 'get',
    })

            /**
* @see \TestVocacionalController::recomendacionesCarrera
 * @see [unknown]:0
 * @route '/api/vocacional/recomendaciones-carrera'
 */
        recomendacionesCarreraForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recomendacionesCarrera.url(options),
            method: 'get',
        })
            /**
* @see \TestVocacionalController::recomendacionesCarrera
 * @see [unknown]:0
 * @route '/api/vocacional/recomendaciones-carrera'
 */
        recomendacionesCarreraForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recomendacionesCarrera.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    recomendacionesCarrera.form = recomendacionesCarreraForm
/**
* @see \TestVocacionalController::analisis
 * @see [unknown]:0
 * @route '/api/vocacional/analisis/{studentId}'
 */
export const analisis = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisis.url(args, options),
    method: 'get',
})

analisis.definition = {
    methods: ["get","head"],
    url: '/api/vocacional/analisis/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \TestVocacionalController::analisis
 * @see [unknown]:0
 * @route '/api/vocacional/analisis/{studentId}'
 */
analisis.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return analisis.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \TestVocacionalController::analisis
 * @see [unknown]:0
 * @route '/api/vocacional/analisis/{studentId}'
 */
analisis.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisis.url(args, options),
    method: 'get',
})
/**
* @see \TestVocacionalController::analisis
 * @see [unknown]:0
 * @route '/api/vocacional/analisis/{studentId}'
 */
analisis.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analisis.url(args, options),
    method: 'head',
})

    /**
* @see \TestVocacionalController::analisis
 * @see [unknown]:0
 * @route '/api/vocacional/analisis/{studentId}'
 */
    const analisisForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analisis.url(args, options),
        method: 'get',
    })

            /**
* @see \TestVocacionalController::analisis
 * @see [unknown]:0
 * @route '/api/vocacional/analisis/{studentId}'
 */
        analisisForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisis.url(args, options),
            method: 'get',
        })
            /**
* @see \TestVocacionalController::analisis
 * @see [unknown]:0
 * @route '/api/vocacional/analisis/{studentId}'
 */
        analisisForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \TestVocacionalController::reporteInstitucional
 * @see [unknown]:0
 * @route '/api/vocacional/reporte-institucional'
 */
export const reporteInstitucional = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteInstitucional.url(options),
    method: 'get',
})

reporteInstitucional.definition = {
    methods: ["get","head"],
    url: '/api/vocacional/reporte-institucional',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \TestVocacionalController::reporteInstitucional
 * @see [unknown]:0
 * @route '/api/vocacional/reporte-institucional'
 */
reporteInstitucional.url = (options?: RouteQueryOptions) => {
    return reporteInstitucional.definition.url + queryParams(options)
}

/**
* @see \TestVocacionalController::reporteInstitucional
 * @see [unknown]:0
 * @route '/api/vocacional/reporte-institucional'
 */
reporteInstitucional.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteInstitucional.url(options),
    method: 'get',
})
/**
* @see \TestVocacionalController::reporteInstitucional
 * @see [unknown]:0
 * @route '/api/vocacional/reporte-institucional'
 */
reporteInstitucional.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteInstitucional.url(options),
    method: 'head',
})

    /**
* @see \TestVocacionalController::reporteInstitucional
 * @see [unknown]:0
 * @route '/api/vocacional/reporte-institucional'
 */
    const reporteInstitucionalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteInstitucional.url(options),
        method: 'get',
    })

            /**
* @see \TestVocacionalController::reporteInstitucional
 * @see [unknown]:0
 * @route '/api/vocacional/reporte-institucional'
 */
        reporteInstitucionalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteInstitucional.url(options),
            method: 'get',
        })
            /**
* @see \TestVocacionalController::reporteInstitucional
 * @see [unknown]:0
 * @route '/api/vocacional/reporte-institucional'
 */
        reporteInstitucionalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteInstitucional.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteInstitucional.form = reporteInstitucionalForm
/**
 * @see [serialized-closure]:2
 * @route '/vocacional'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/vocacional',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/vocacional'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/vocacional'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/vocacional'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see [serialized-closure]:2
 * @route '/vocacional'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see [serialized-closure]:2
 * @route '/vocacional'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see [serialized-closure]:2
 * @route '/vocacional'
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
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
export const perfil = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: perfil.url(options),
    method: 'get',
})

perfil.definition = {
    methods: ["get","head"],
    url: '/vocacional/perfil',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
perfil.url = (options?: RouteQueryOptions) => {
    return perfil.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
perfil.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: perfil.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
perfil.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: perfil.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
    const perfilForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: perfil.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
        perfilForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: perfil.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
        perfilForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: perfil.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    perfil.form = perfilForm
/**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
export const recomendaciones = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recomendaciones.url(options),
    method: 'get',
})

recomendaciones.definition = {
    methods: ["get","head"],
    url: '/vocacional/recomendaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
recomendaciones.url = (options?: RouteQueryOptions) => {
    return recomendaciones.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
recomendaciones.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recomendaciones.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
recomendaciones.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recomendaciones.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
    const recomendacionesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: recomendaciones.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
        recomendacionesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recomendaciones.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
        recomendacionesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recomendaciones.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    recomendaciones.form = recomendacionesForm
const vocacional = {
    miPerfil,
recomendacionesCarrera,
analisis,
reporteInstitucional,
index,
perfil,
recomendaciones,
}

export default vocacional