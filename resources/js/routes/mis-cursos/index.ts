import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MisCursosController::index
 * @see [unknown]:0
 * @route '/mis-cursos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mis-cursos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MisCursosController::index
 * @see [unknown]:0
 * @route '/mis-cursos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MisCursosController::index
 * @see [unknown]:0
 * @route '/mis-cursos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MisCursosController::index
 * @see [unknown]:0
 * @route '/mis-cursos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MisCursosController::index
 * @see [unknown]:0
 * @route '/mis-cursos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MisCursosController::index
 * @see [unknown]:0
 * @route '/mis-cursos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MisCursosController::index
 * @see [unknown]:0
 * @route '/mis-cursos'
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
* @see \App\Http\Controllers\MisCursosController::show
 * @see [unknown]:0
 * @route '/mis-cursos/{curso}'
 */
export const show = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/mis-cursos/{curso}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MisCursosController::show
 * @see [unknown]:0
 * @route '/mis-cursos/{curso}'
 */
show.url = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { curso: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    curso: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        curso: args.curso,
                }

    return show.definition.url
            .replace('{curso}', parsedArgs.curso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MisCursosController::show
 * @see [unknown]:0
 * @route '/mis-cursos/{curso}'
 */
show.get = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MisCursosController::show
 * @see [unknown]:0
 * @route '/mis-cursos/{curso}'
 */
show.head = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MisCursosController::show
 * @see [unknown]:0
 * @route '/mis-cursos/{curso}'
 */
    const showForm = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MisCursosController::show
 * @see [unknown]:0
 * @route '/mis-cursos/{curso}'
 */
        showForm.get = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MisCursosController::show
 * @see [unknown]:0
 * @route '/mis-cursos/{curso}'
 */
        showForm.head = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const misCursos = {
    index,
show,
}

export default misCursos