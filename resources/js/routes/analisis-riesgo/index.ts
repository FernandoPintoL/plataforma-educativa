import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AnalisisRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/analisis-riesgo/por-curso/{cursoId}'
 */
export const porCurso = (args: { cursoId: string | number } | [cursoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porCurso.url(args, options),
    method: 'get',
})

porCurso.definition = {
    methods: ["get","head"],
    url: '/analisis-riesgo/por-curso/{cursoId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/analisis-riesgo/por-curso/{cursoId}'
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
* @see \App\Http\Controllers\AnalisisRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/analisis-riesgo/por-curso/{cursoId}'
 */
porCurso.get = (args: { cursoId: string | number } | [cursoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porCurso.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/analisis-riesgo/por-curso/{cursoId}'
 */
porCurso.head = (args: { cursoId: string | number } | [cursoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: porCurso.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AnalisisRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/analisis-riesgo/por-curso/{cursoId}'
 */
    const porCursoForm = (args: { cursoId: string | number } | [cursoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: porCurso.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalisisRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/analisis-riesgo/por-curso/{cursoId}'
 */
        porCursoForm.get = (args: { cursoId: string | number } | [cursoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porCurso.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalisisRiesgoController::porCurso
 * @see [unknown]:0
 * @route '/analisis-riesgo/por-curso/{cursoId}'
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
* @see \App\Http\Controllers\AnalisisRiesgoController::estudiante
 * @see [unknown]:0
 * @route '/analisis-riesgo/estudiante/{estudianteId}'
 */
export const estudiante = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estudiante.url(args, options),
    method: 'get',
})

estudiante.definition = {
    methods: ["get","head"],
    url: '/analisis-riesgo/estudiante/{estudianteId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisRiesgoController::estudiante
 * @see [unknown]:0
 * @route '/analisis-riesgo/estudiante/{estudianteId}'
 */
estudiante.url = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return estudiante.definition.url
            .replace('{estudianteId}', parsedArgs.estudianteId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisRiesgoController::estudiante
 * @see [unknown]:0
 * @route '/analisis-riesgo/estudiante/{estudianteId}'
 */
estudiante.get = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estudiante.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisRiesgoController::estudiante
 * @see [unknown]:0
 * @route '/analisis-riesgo/estudiante/{estudianteId}'
 */
estudiante.head = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estudiante.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AnalisisRiesgoController::estudiante
 * @see [unknown]:0
 * @route '/analisis-riesgo/estudiante/{estudianteId}'
 */
    const estudianteForm = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estudiante.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalisisRiesgoController::estudiante
 * @see [unknown]:0
 * @route '/analisis-riesgo/estudiante/{estudianteId}'
 */
        estudianteForm.get = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estudiante.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalisisRiesgoController::estudiante
 * @see [unknown]:0
 * @route '/analisis-riesgo/estudiante/{estudianteId}'
 */
        estudianteForm.head = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estudiante.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estudiante.form = estudianteForm
const analisisRiesgo = {
    porCurso,
estudiante,
}

export default analisisRiesgo