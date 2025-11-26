import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::dashboard
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:29
 * @route '/api/analisis-riesgo/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/api/analisis-riesgo/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::dashboard
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:29
 * @route '/api/analisis-riesgo/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::dashboard
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:29
 * @route '/api/analisis-riesgo/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::dashboard
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:29
 * @route '/api/analisis-riesgo/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::dashboard
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:29
 * @route '/api/analisis-riesgo/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::dashboard
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:29
 * @route '/api/analisis-riesgo/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::dashboard
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:29
 * @route '/api/analisis-riesgo/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::index
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:96
 * @route '/api/analisis-riesgo'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/analisis-riesgo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::index
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:96
 * @route '/api/analisis-riesgo'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::index
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:96
 * @route '/api/analisis-riesgo'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::index
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:96
 * @route '/api/analisis-riesgo'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::index
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:96
 * @route '/api/analisis-riesgo'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::index
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:96
 * @route '/api/analisis-riesgo'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::index
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:96
 * @route '/api/analisis-riesgo'
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
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porEstudiante
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:164
 * @route '/api/analisis-riesgo/estudiante/{id}'
 */
export const porEstudiante = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porEstudiante.url(args, options),
    method: 'get',
})

porEstudiante.definition = {
    methods: ["get","head"],
    url: '/api/analisis-riesgo/estudiante/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porEstudiante
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:164
 * @route '/api/analisis-riesgo/estudiante/{id}'
 */
porEstudiante.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return porEstudiante.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porEstudiante
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:164
 * @route '/api/analisis-riesgo/estudiante/{id}'
 */
porEstudiante.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porEstudiante.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porEstudiante
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:164
 * @route '/api/analisis-riesgo/estudiante/{id}'
 */
porEstudiante.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: porEstudiante.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porEstudiante
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:164
 * @route '/api/analisis-riesgo/estudiante/{id}'
 */
    const porEstudianteForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: porEstudiante.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porEstudiante
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:164
 * @route '/api/analisis-riesgo/estudiante/{id}'
 */
        porEstudianteForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porEstudiante.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porEstudiante
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:164
 * @route '/api/analisis-riesgo/estudiante/{id}'
 */
        porEstudianteForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porEstudiante.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    porEstudiante.form = porEstudianteForm
/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porCurso
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:269
 * @route '/api/analisis-riesgo/curso/{id}'
 */
export const porCurso = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porCurso.url(args, options),
    method: 'get',
})

porCurso.definition = {
    methods: ["get","head"],
    url: '/api/analisis-riesgo/curso/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porCurso
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:269
 * @route '/api/analisis-riesgo/curso/{id}'
 */
porCurso.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return porCurso.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porCurso
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:269
 * @route '/api/analisis-riesgo/curso/{id}'
 */
porCurso.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porCurso.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porCurso
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:269
 * @route '/api/analisis-riesgo/curso/{id}'
 */
porCurso.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: porCurso.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porCurso
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:269
 * @route '/api/analisis-riesgo/curso/{id}'
 */
    const porCursoForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: porCurso.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porCurso
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:269
 * @route '/api/analisis-riesgo/curso/{id}'
 */
        porCursoForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porCurso.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::porCurso
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:269
 * @route '/api/analisis-riesgo/curso/{id}'
 */
        porCursoForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porCurso.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    porCurso.form = porCursoForm
/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::tendencias
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:388
 * @route '/api/analisis-riesgo/tendencias'
 */
export const tendencias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tendencias.url(options),
    method: 'get',
})

tendencias.definition = {
    methods: ["get","head"],
    url: '/api/analisis-riesgo/tendencias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::tendencias
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:388
 * @route '/api/analisis-riesgo/tendencias'
 */
tendencias.url = (options?: RouteQueryOptions) => {
    return tendencias.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::tendencias
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:388
 * @route '/api/analisis-riesgo/tendencias'
 */
tendencias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tendencias.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::tendencias
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:388
 * @route '/api/analisis-riesgo/tendencias'
 */
tendencias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tendencias.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::tendencias
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:388
 * @route '/api/analisis-riesgo/tendencias'
 */
    const tendenciasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: tendencias.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::tendencias
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:388
 * @route '/api/analisis-riesgo/tendencias'
 */
        tendenciasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tendencias.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::tendencias
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:388
 * @route '/api/analisis-riesgo/tendencias'
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
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::recomendacionesCarrera
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:443
 * @route '/api/analisis-riesgo/carrera/{id}'
 */
export const recomendacionesCarrera = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recomendacionesCarrera.url(args, options),
    method: 'get',
})

recomendacionesCarrera.definition = {
    methods: ["get","head"],
    url: '/api/analisis-riesgo/carrera/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::recomendacionesCarrera
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:443
 * @route '/api/analisis-riesgo/carrera/{id}'
 */
recomendacionesCarrera.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return recomendacionesCarrera.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::recomendacionesCarrera
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:443
 * @route '/api/analisis-riesgo/carrera/{id}'
 */
recomendacionesCarrera.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recomendacionesCarrera.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::recomendacionesCarrera
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:443
 * @route '/api/analisis-riesgo/carrera/{id}'
 */
recomendacionesCarrera.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recomendacionesCarrera.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::recomendacionesCarrera
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:443
 * @route '/api/analisis-riesgo/carrera/{id}'
 */
    const recomendacionesCarreraForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: recomendacionesCarrera.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::recomendacionesCarrera
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:443
 * @route '/api/analisis-riesgo/carrera/{id}'
 */
        recomendacionesCarreraForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recomendacionesCarrera.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::recomendacionesCarrera
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:443
 * @route '/api/analisis-riesgo/carrera/{id}'
 */
        recomendacionesCarreraForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recomendacionesCarrera.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    recomendacionesCarrera.form = recomendacionesCarreraForm
/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::update
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:474
 * @route '/api/analisis-riesgo/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/analisis-riesgo/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::update
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:474
 * @route '/api/analisis-riesgo/{id}'
 */
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::update
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:474
 * @route '/api/analisis-riesgo/{id}'
 */
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::update
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:474
 * @route '/api/analisis-riesgo/{id}'
 */
    const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::update
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:474
 * @route '/api/analisis-riesgo/{id}'
 */
        updateForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::generarPredicciones
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:496
 * @route '/api/analisis-riesgo/generar/{estudianteId}'
 */
export const generarPredicciones = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generarPredicciones.url(args, options),
    method: 'post',
})

generarPredicciones.definition = {
    methods: ["post"],
    url: '/api/analisis-riesgo/generar/{estudianteId}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::generarPredicciones
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:496
 * @route '/api/analisis-riesgo/generar/{estudianteId}'
 */
generarPredicciones.url = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estudianteId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estudianteId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estudianteId: args.estudianteId,
                }

    return generarPredicciones.definition.url
            .replace('{estudianteId}', parsedArgs.estudianteId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::generarPredicciones
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:496
 * @route '/api/analisis-riesgo/generar/{estudianteId}'
 */
generarPredicciones.post = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generarPredicciones.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::generarPredicciones
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:496
 * @route '/api/analisis-riesgo/generar/{estudianteId}'
 */
    const generarPrediccionesForm = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generarPredicciones.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AnalisisRiesgoController::generarPredicciones
 * @see app/Http/Controllers/Api/AnalisisRiesgoController.php:496
 * @route '/api/analisis-riesgo/generar/{estudianteId}'
 */
        generarPrediccionesForm.post = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generarPredicciones.url(args, options),
            method: 'post',
        })
    
    generarPredicciones.form = generarPrediccionesForm
const AnalisisRiesgoController = { dashboard, index, porEstudiante, porCurso, tendencias, recomendacionesCarrera, update, generarPredicciones }

export default AnalisisRiesgoController