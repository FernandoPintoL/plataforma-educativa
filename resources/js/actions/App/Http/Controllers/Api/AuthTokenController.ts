import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AuthTokenController::getToken
 * @see app/Http/Controllers/Api/AuthTokenController.php:25
 * @route '/api/auth/token'
 */
export const getToken = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getToken.url(options),
    method: 'get',
})

getToken.definition = {
    methods: ["get","head"],
    url: '/api/auth/token',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AuthTokenController::getToken
 * @see app/Http/Controllers/Api/AuthTokenController.php:25
 * @route '/api/auth/token'
 */
getToken.url = (options?: RouteQueryOptions) => {
    return getToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthTokenController::getToken
 * @see app/Http/Controllers/Api/AuthTokenController.php:25
 * @route '/api/auth/token'
 */
getToken.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getToken.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AuthTokenController::getToken
 * @see app/Http/Controllers/Api/AuthTokenController.php:25
 * @route '/api/auth/token'
 */
getToken.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getToken.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AuthTokenController::getToken
 * @see app/Http/Controllers/Api/AuthTokenController.php:25
 * @route '/api/auth/token'
 */
    const getTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getToken.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AuthTokenController::getToken
 * @see app/Http/Controllers/Api/AuthTokenController.php:25
 * @route '/api/auth/token'
 */
        getTokenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getToken.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AuthTokenController::getToken
 * @see app/Http/Controllers/Api/AuthTokenController.php:25
 * @route '/api/auth/token'
 */
        getTokenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getToken.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getToken.form = getTokenForm
/**
* @see \App\Http\Controllers\Api\AuthTokenController::revokeToken
 * @see app/Http/Controllers/Api/AuthTokenController.php:67
 * @route '/api/auth/token/revoke'
 */
export const revokeToken = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeToken.url(options),
    method: 'post',
})

revokeToken.definition = {
    methods: ["post"],
    url: '/api/auth/token/revoke',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthTokenController::revokeToken
 * @see app/Http/Controllers/Api/AuthTokenController.php:67
 * @route '/api/auth/token/revoke'
 */
revokeToken.url = (options?: RouteQueryOptions) => {
    return revokeToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthTokenController::revokeToken
 * @see app/Http/Controllers/Api/AuthTokenController.php:67
 * @route '/api/auth/token/revoke'
 */
revokeToken.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeToken.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AuthTokenController::revokeToken
 * @see app/Http/Controllers/Api/AuthTokenController.php:67
 * @route '/api/auth/token/revoke'
 */
    const revokeTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: revokeToken.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthTokenController::revokeToken
 * @see app/Http/Controllers/Api/AuthTokenController.php:67
 * @route '/api/auth/token/revoke'
 */
        revokeTokenForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: revokeToken.url(options),
            method: 'post',
        })
    
    revokeToken.form = revokeTokenForm
const AuthTokenController = { getToken, revokeToken }

export default AuthTokenController