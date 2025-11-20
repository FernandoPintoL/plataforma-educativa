import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PadreChildController::getHijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
export const getHijos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHijos.url(options),
    method: 'get',
})

getHijos.definition = {
    methods: ["get","head"],
    url: '/api/padre/hijos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PadreChildController::getHijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
getHijos.url = (options?: RouteQueryOptions) => {
    return getHijos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PadreChildController::getHijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
getHijos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHijos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PadreChildController::getHijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
getHijos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getHijos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PadreChildController::getHijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
    const getHijosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getHijos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PadreChildController::getHijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
        getHijosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHijos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PadreChildController::getHijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
        getHijosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHijos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getHijos.form = getHijosForm
/**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoRiesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
 */
export const getHijoRiesgo = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHijoRiesgo.url(args, options),
    method: 'get',
})

getHijoRiesgo.definition = {
    methods: ["get","head"],
    url: '/api/padre/hijos/{hijoId}/riesgo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoRiesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
 */
getHijoRiesgo.url = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getHijoRiesgo.definition.url
            .replace('{hijoId}', parsedArgs.hijoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoRiesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
 */
getHijoRiesgo.get = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHijoRiesgo.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoRiesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
 */
getHijoRiesgo.head = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getHijoRiesgo.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoRiesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
 */
    const getHijoRiesgoForm = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getHijoRiesgo.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoRiesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
 */
        getHijoRiesgoForm.get = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHijoRiesgo.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoRiesgo
 * @see app/Http/Controllers/Api/PadreChildController.php:48
 * @route '/api/padre/hijos/{hijoId}/riesgo'
 */
        getHijoRiesgoForm.head = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHijoRiesgo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getHijoRiesgo.form = getHijoRiesgoForm
/**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoCarreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
 */
export const getHijoCarreras = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHijoCarreras.url(args, options),
    method: 'get',
})

getHijoCarreras.definition = {
    methods: ["get","head"],
    url: '/api/padre/hijos/{hijoId}/carreras',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoCarreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
 */
getHijoCarreras.url = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getHijoCarreras.definition.url
            .replace('{hijoId}', parsedArgs.hijoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoCarreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
 */
getHijoCarreras.get = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHijoCarreras.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoCarreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
 */
getHijoCarreras.head = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getHijoCarreras.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoCarreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
 */
    const getHijoCarrerasForm = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getHijoCarreras.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoCarreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
 */
        getHijoCarrerasForm.get = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHijoCarreras.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PadreChildController::getHijoCarreras
 * @see app/Http/Controllers/Api/PadreChildController.php:133
 * @route '/api/padre/hijos/{hijoId}/carreras'
 */
        getHijoCarrerasForm.head = (args: { hijoId: string | number } | [hijoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHijoCarreras.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getHijoCarreras.form = getHijoCarrerasForm
const PadreChildController = { getHijos, getHijoRiesgo, getHijoCarreras }

export default PadreChildController