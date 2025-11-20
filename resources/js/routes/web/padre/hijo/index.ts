import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/riesgo'
 */
export const riesgo = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riesgo.url(args, options),
    method: 'get',
})

riesgo.definition = {
    methods: ["get","head"],
    url: '/padre/hijo/{hijoId}/riesgo',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/riesgo'
 */
riesgo.url = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hijoId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hijoId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hijoId: args.hijoId,
                }

    return riesgo.definition.url
            .replace('{hijoId}', parsedArgs.hijoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/riesgo'
 */
riesgo.get = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riesgo.url(args, options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/riesgo'
 */
riesgo.head = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: riesgo.url(args, options),
    method: 'head',
})

    /**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/riesgo'
 */
    const riesgoForm = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: riesgo.url(args, options),
        method: 'get',
    })

            /**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/riesgo'
 */
        riesgoForm.get = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riesgo.url(args, options),
            method: 'get',
        })
            /**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/riesgo'
 */
        riesgoForm.head = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riesgo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    riesgo.form = riesgoForm
/**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/carreras'
 */
export const carreras = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: carreras.url(args, options),
    method: 'get',
})

carreras.definition = {
    methods: ["get","head"],
    url: '/padre/hijo/{hijoId}/carreras',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/carreras'
 */
carreras.url = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hijoId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hijoId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hijoId: args.hijoId,
                }

    return carreras.definition.url
            .replace('{hijoId}', parsedArgs.hijoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/carreras'
 */
carreras.get = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: carreras.url(args, options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/carreras'
 */
carreras.head = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: carreras.url(args, options),
    method: 'head',
})

    /**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/carreras'
 */
    const carrerasForm = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: carreras.url(args, options),
        method: 'get',
    })

            /**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/carreras'
 */
        carrerasForm.get = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: carreras.url(args, options),
            method: 'get',
        })
            /**
 * @see [serialized-closure]:2
 * @route '/padre/hijo/{hijoId}/carreras'
 */
        carrerasForm.head = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: carreras.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    carreras.form = carrerasForm
const hijo = {
    riesgo,
carreras,
}

export default hijo