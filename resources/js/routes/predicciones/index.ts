import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::index
 * @see [unknown]:0
 * @route '/api/predicciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/predicciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::index
 * @see [unknown]:0
 * @route '/api/predicciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::index
 * @see [unknown]:0
 * @route '/api/predicciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::index
 * @see [unknown]:0
 * @route '/api/predicciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::index
 * @see [unknown]:0
 * @route '/api/predicciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::index
 * @see [unknown]:0
 * @route '/api/predicciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::index
 * @see [unknown]:0
 * @route '/api/predicciones'
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
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::dashboard
 * @see [unknown]:0
 * @route '/api/predicciones/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/api/predicciones/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::dashboard
 * @see [unknown]:0
 * @route '/api/predicciones/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::dashboard
 * @see [unknown]:0
 * @route '/api/predicciones/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::dashboard
 * @see [unknown]:0
 * @route '/api/predicciones/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::dashboard
 * @see [unknown]:0
 * @route '/api/predicciones/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::dashboard
 * @see [unknown]:0
 * @route '/api/predicciones/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::dashboard
 * @see [unknown]:0
 * @route '/api/predicciones/dashboard'
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
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::estadisticas
 * @see [unknown]:0
 * @route '/api/predicciones/estadisticas'
 */
export const estadisticas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/api/predicciones/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::estadisticas
 * @see [unknown]:0
 * @route '/api/predicciones/estadisticas'
 */
estadisticas.url = (options?: RouteQueryOptions) => {
    return estadisticas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::estadisticas
 * @see [unknown]:0
 * @route '/api/predicciones/estadisticas'
 */
estadisticas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::estadisticas
 * @see [unknown]:0
 * @route '/api/predicciones/estadisticas'
 */
estadisticas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::estadisticas
 * @see [unknown]:0
 * @route '/api/predicciones/estadisticas'
 */
    const estadisticasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::estadisticas
 * @see [unknown]:0
 * @route '/api/predicciones/estadisticas'
 */
        estadisticasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::estadisticas
 * @see [unknown]:0
 * @route '/api/predicciones/estadisticas'
 */
        estadisticasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticas.form = estadisticasForm
/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/api/predicciones/curso/{cursoId}'
 */
export const porCurso = (args: { cursoId: string | number } | [cursoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porCurso.url(args, options),
    method: 'get',
})

porCurso.definition = {
    methods: ["get","head"],
    url: '/api/predicciones/curso/{cursoId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/api/predicciones/curso/{cursoId}'
 */
porCurso.url = (args: { cursoId: string | number } | [cursoId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cursoId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    cursoId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cursoId: args.cursoId,
                }

    return porCurso.definition.url
            .replace('{cursoId}', parsedArgs.cursoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/api/predicciones/curso/{cursoId}'
 */
porCurso.get = (args: { cursoId: string | number } | [cursoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porCurso.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/api/predicciones/curso/{cursoId}'
 */
porCurso.head = (args: { cursoId: string | number } | [cursoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: porCurso.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/api/predicciones/curso/{cursoId}'
 */
    const porCursoForm = (args: { cursoId: string | number } | [cursoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: porCurso.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/api/predicciones/curso/{cursoId}'
 */
        porCursoForm.get = (args: { cursoId: string | number } | [cursoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porCurso.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/api/predicciones/curso/{cursoId}'
 */
        porCursoForm.head = (args: { cursoId: string | number } | [cursoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porEstudiante
 * @see [unknown]:0
 * @route '/api/predicciones/estudiante/{estudianteId}'
 */
export const porEstudiante = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porEstudiante.url(args, options),
    method: 'get',
})

porEstudiante.definition = {
    methods: ["get","head"],
    url: '/api/predicciones/estudiante/{estudianteId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porEstudiante
 * @see [unknown]:0
 * @route '/api/predicciones/estudiante/{estudianteId}'
 */
porEstudiante.url = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return porEstudiante.definition.url
            .replace('{estudianteId}', parsedArgs.estudianteId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porEstudiante
 * @see [unknown]:0
 * @route '/api/predicciones/estudiante/{estudianteId}'
 */
porEstudiante.get = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porEstudiante.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porEstudiante
 * @see [unknown]:0
 * @route '/api/predicciones/estudiante/{estudianteId}'
 */
porEstudiante.head = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: porEstudiante.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porEstudiante
 * @see [unknown]:0
 * @route '/api/predicciones/estudiante/{estudianteId}'
 */
    const porEstudianteForm = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: porEstudiante.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porEstudiante
 * @see [unknown]:0
 * @route '/api/predicciones/estudiante/{estudianteId}'
 */
        porEstudianteForm.get = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porEstudiante.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::porEstudiante
 * @see [unknown]:0
 * @route '/api/predicciones/estudiante/{estudianteId}'
 */
        porEstudianteForm.head = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::show
 * @see [unknown]:0
 * @route '/api/predicciones/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/predicciones/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::show
 * @see [unknown]:0
 * @route '/api/predicciones/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::show
 * @see [unknown]:0
 * @route '/api/predicciones/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::show
 * @see [unknown]:0
 * @route '/api/predicciones/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::show
 * @see [unknown]:0
 * @route '/api/predicciones/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::show
 * @see [unknown]:0
 * @route '/api/predicciones/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PrediccionRiesgoController::show
 * @see [unknown]:0
 * @route '/api/predicciones/{id}'
 */
        showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const predicciones = {
    index,
dashboard,
estadisticas,
porCurso,
porEstudiante,
show,
}

export default predicciones