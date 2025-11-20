import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PadreChildController::riesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
 */
export const riesgo = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riesgo.url(args, options),
    method: 'get',
})

riesgo.definition = {
    methods: ["get","head"],
    url: '/api/padre/hijos/{hijoId}/riesgo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PadreChildController::riesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
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
* @see \App\Http\Controllers\Api\PadreChildController::riesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
 */
riesgo.get = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riesgo.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PadreChildController::riesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
 */
riesgo.head = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: riesgo.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PadreChildController::riesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
 */
    const riesgoForm = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: riesgo.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PadreChildController::riesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
 */
        riesgoForm.get = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riesgo.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PadreChildController::riesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
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
* @see \App\Http\Controllers\Api\PadreChildController::carreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
 */
export const carreras = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: carreras.url(args, options),
    method: 'get',
})

carreras.definition = {
    methods: ["get","head"],
    url: '/api/padre/hijos/{hijoId}/carreras',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PadreChildController::carreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
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
* @see \App\Http\Controllers\Api\PadreChildController::carreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
 */
carreras.get = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: carreras.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PadreChildController::carreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
 */
carreras.head = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: carreras.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PadreChildController::carreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
 */
    const carrerasForm = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: carreras.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PadreChildController::carreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
 */
        carrerasForm.get = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: carreras.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PadreChildController::carreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
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