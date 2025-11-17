import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AuthTokenController::revoke
 * @see app/Http/Controllers/Api/AuthTokenController.php:62
 * @route '/api/auth/token/revoke'
 */
export const revoke = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(options),
    method: 'post',
})

revoke.definition = {
    methods: ["post"],
    url: '/api/auth/token/revoke',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthTokenController::revoke
 * @see app/Http/Controllers/Api/AuthTokenController.php:62
 * @route '/api/auth/token/revoke'
 */
revoke.url = (options?: RouteQueryOptions) => {
    return revoke.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthTokenController::revoke
 * @see app/Http/Controllers/Api/AuthTokenController.php:62
 * @route '/api/auth/token/revoke'
 */
revoke.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AuthTokenController::revoke
 * @see app/Http/Controllers/Api/AuthTokenController.php:62
 * @route '/api/auth/token/revoke'
 */
    const revokeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: revoke.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthTokenController::revoke
 * @see app/Http/Controllers/Api/AuthTokenController.php:62
 * @route '/api/auth/token/revoke'
 */
        revokeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: revoke.url(options),
            method: 'post',
        })
    
    revoke.form = revokeForm
const token = {
    revoke,
}

export default token