import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import hijo from './hijo'
/**
* @see \App\Http\Controllers\Api\PadreChildController::hijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
export const hijos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hijos.url(options),
    method: 'get',
})

hijos.definition = {
    methods: ["get","head"],
    url: '/api/padre/hijos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PadreChildController::hijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
hijos.url = (options?: RouteQueryOptions) => {
    return hijos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PadreChildController::hijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
hijos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hijos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PadreChildController::hijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
hijos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: hijos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PadreChildController::hijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
    const hijosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: hijos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PadreChildController::hijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
        hijosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: hijos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PadreChildController::hijos
 * @see app/Http/Controllers/Api/PadreChildController.php:17
 * @route '/api/padre/hijos'
 */
        hijosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: hijos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    hijos.form = hijosForm
const padre = {
    hijos,
hijo,
}

export default padre