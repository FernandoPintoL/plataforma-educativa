import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::dashboard
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:15
 * @route '/analisis-riesgo'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/analisis-riesgo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::dashboard
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:15
 * @route '/analisis-riesgo'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::dashboard
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:15
 * @route '/analisis-riesgo'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::dashboard
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:15
 * @route '/analisis-riesgo'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::dashboard
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:15
 * @route '/analisis-riesgo'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::dashboard
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:15
 * @route '/analisis-riesgo'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::dashboard
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:15
 * @route '/analisis-riesgo'
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
* @see \App\Http\Controllers\AnalisisRiesgoWebController::porCursos
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:23
 * @route '/analisis-riesgo/cursos'
 */
export const porCursos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porCursos.url(options),
    method: 'get',
})

porCursos.definition = {
    methods: ["get","head"],
    url: '/analisis-riesgo/cursos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::porCursos
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:23
 * @route '/analisis-riesgo/cursos'
 */
porCursos.url = (options?: RouteQueryOptions) => {
    return porCursos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::porCursos
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:23
 * @route '/analisis-riesgo/cursos'
 */
porCursos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porCursos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::porCursos
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:23
 * @route '/analisis-riesgo/cursos'
 */
porCursos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: porCursos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::porCursos
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:23
 * @route '/analisis-riesgo/cursos'
 */
    const porCursosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: porCursos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::porCursos
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:23
 * @route '/analisis-riesgo/cursos'
 */
        porCursosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porCursos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::porCursos
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:23
 * @route '/analisis-riesgo/cursos'
 */
        porCursosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porCursos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    porCursos.form = porCursosForm
/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::tendencias
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:53
 * @route '/analisis-riesgo/tendencias'
 */
export const tendencias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tendencias.url(options),
    method: 'get',
})

tendencias.definition = {
    methods: ["get","head"],
    url: '/analisis-riesgo/tendencias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::tendencias
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:53
 * @route '/analisis-riesgo/tendencias'
 */
tendencias.url = (options?: RouteQueryOptions) => {
    return tendencias.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::tendencias
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:53
 * @route '/analisis-riesgo/tendencias'
 */
tendencias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tendencias.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::tendencias
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:53
 * @route '/analisis-riesgo/tendencias'
 */
tendencias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tendencias.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::tendencias
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:53
 * @route '/analisis-riesgo/tendencias'
 */
    const tendenciasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: tendencias.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::tendencias
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:53
 * @route '/analisis-riesgo/tendencias'
 */
        tendenciasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tendencias.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::tendencias
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:53
 * @route '/analisis-riesgo/tendencias'
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
* @see \App\Http\Controllers\AnalisisRiesgoWebController::estudiante
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:61
 * @route '/analisis-riesgo/estudiante/{id}'
 */
export const estudiante = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estudiante.url(args, options),
    method: 'get',
})

estudiante.definition = {
    methods: ["get","head"],
    url: '/analisis-riesgo/estudiante/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::estudiante
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:61
 * @route '/analisis-riesgo/estudiante/{id}'
 */
estudiante.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return estudiante.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::estudiante
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:61
 * @route '/analisis-riesgo/estudiante/{id}'
 */
estudiante.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estudiante.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::estudiante
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:61
 * @route '/analisis-riesgo/estudiante/{id}'
 */
estudiante.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estudiante.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::estudiante
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:61
 * @route '/analisis-riesgo/estudiante/{id}'
 */
    const estudianteForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estudiante.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::estudiante
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:61
 * @route '/analisis-riesgo/estudiante/{id}'
 */
        estudianteForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estudiante.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalisisRiesgoWebController::estudiante
 * @see app/Http/Controllers/AnalisisRiesgoWebController.php:61
 * @route '/analisis-riesgo/estudiante/{id}'
 */
        estudianteForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estudiante.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estudiante.form = estudianteForm
const AnalisisRiesgoWebController = { dashboard, porCursos, tendencias, estudiante }

export default AnalisisRiesgoWebController