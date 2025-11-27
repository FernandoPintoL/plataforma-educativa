import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CursoController::misCursos
 * @see app/Http/Controllers/CursoController.php:14
 * @route '/mis-cursos'
 */
export const misCursos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: misCursos.url(options),
    method: 'get',
})

misCursos.definition = {
    methods: ["get","head"],
    url: '/mis-cursos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CursoController::misCursos
 * @see app/Http/Controllers/CursoController.php:14
 * @route '/mis-cursos'
 */
misCursos.url = (options?: RouteQueryOptions) => {
    return misCursos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CursoController::misCursos
 * @see app/Http/Controllers/CursoController.php:14
 * @route '/mis-cursos'
 */
misCursos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: misCursos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CursoController::misCursos
 * @see app/Http/Controllers/CursoController.php:14
 * @route '/mis-cursos'
 */
misCursos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: misCursos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CursoController::misCursos
 * @see app/Http/Controllers/CursoController.php:14
 * @route '/mis-cursos'
 */
    const misCursosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: misCursos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CursoController::misCursos
 * @see app/Http/Controllers/CursoController.php:14
 * @route '/mis-cursos'
 */
        misCursosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: misCursos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CursoController::misCursos
 * @see app/Http/Controllers/CursoController.php:14
 * @route '/mis-cursos'
 */
        misCursosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: misCursos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    misCursos.form = misCursosForm
/**
* @see \App\Http\Controllers\CursoController::show
 * @see app/Http/Controllers/CursoController.php:63
 * @route '/cursos/{curso}'
 */
export const show = (args: { curso: number | { id: number } } | [curso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cursos/{curso}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CursoController::show
 * @see app/Http/Controllers/CursoController.php:63
 * @route '/cursos/{curso}'
 */
show.url = (args: { curso: number | { id: number } } | [curso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { curso: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { curso: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    curso: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        curso: typeof args.curso === 'object'
                ? args.curso.id
                : args.curso,
                }

    return show.definition.url
            .replace('{curso}', parsedArgs.curso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CursoController::show
 * @see app/Http/Controllers/CursoController.php:63
 * @route '/cursos/{curso}'
 */
show.get = (args: { curso: number | { id: number } } | [curso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CursoController::show
 * @see app/Http/Controllers/CursoController.php:63
 * @route '/cursos/{curso}'
 */
show.head = (args: { curso: number | { id: number } } | [curso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CursoController::show
 * @see app/Http/Controllers/CursoController.php:63
 * @route '/cursos/{curso}'
 */
    const showForm = (args: { curso: number | { id: number } } | [curso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CursoController::show
 * @see app/Http/Controllers/CursoController.php:63
 * @route '/cursos/{curso}'
 */
        showForm.get = (args: { curso: number | { id: number } } | [curso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CursoController::show
 * @see app/Http/Controllers/CursoController.php:63
 * @route '/cursos/{curso}'
 */
        showForm.head = (args: { curso: number | { id: number } } | [curso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const CursoController = { misCursos, show }

export default CursoController