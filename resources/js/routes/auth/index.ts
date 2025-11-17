import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import token from './token'
/**
* @see \App\Http\Controllers\Api\AuthTokenController::token
 * @see app/Http/Controllers/Api/AuthTokenController.php:23
 * @route '/api/auth/token'
 */
export const token = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: token.url(options),
    method: 'get',
})

token.definition = {
    methods: ["get","head"],
    url: '/api/auth/token',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AuthTokenController::token
 * @see app/Http/Controllers/Api/AuthTokenController.php:23
 * @route '/api/auth/token'
 */
token.url = (options?: RouteQueryOptions) => {
    return token.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthTokenController::token
 * @see app/Http/Controllers/Api/AuthTokenController.php:23
 * @route '/api/auth/token'
 */
token.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: token.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AuthTokenController::token
 * @see app/Http/Controllers/Api/AuthTokenController.php:23
 * @route '/api/auth/token'
 */
token.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: token.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AuthTokenController::token
 * @see app/Http/Controllers/Api/AuthTokenController.php:23
 * @route '/api/auth/token'
 */
    const tokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: token.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AuthTokenController::token
 * @see app/Http/Controllers/Api/AuthTokenController.php:23
 * @route '/api/auth/token'
 */
        tokenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: token.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AuthTokenController::token
 * @see app/Http/Controllers/Api/AuthTokenController.php:23
 * @route '/api/auth/token'
 */
        tokenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: token.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    token.form = tokenForm
const auth = {
    token,
}

export default auth