import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\EvaluacionController::ver
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
export const ver = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ver.url(args, options),
    method: 'get',
})

ver.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacion}/intentos/{trabajo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::ver
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
ver.url = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                    trabajo: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: typeof args.evaluacion === 'object'
                ? args.evaluacion.id
                : args.evaluacion,
                                trabajo: typeof args.trabajo === 'object'
                ? args.trabajo.id
                : args.trabajo,
                }

    return ver.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace('{trabajo}', parsedArgs.trabajo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::ver
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
ver.get = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ver.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::ver
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
ver.head = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ver.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::ver
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
    const verForm = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ver.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::ver
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
        verForm.get = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ver.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::ver
 * @see app/Http/Controllers/EvaluacionController.php:1200
 * @route '/evaluaciones/{evaluacion}/intentos/{trabajo}'
 */
        verForm.head = (args: { evaluacion: number | { id: number }, trabajo: number | { id: number } } | [evaluacion: number | { id: number }, trabajo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ver.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ver.form = verForm
const intentos = {
    ver,
}

export default intentos