import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:219
 * @route '/api/modulos-sidebar'
 */
export const apiIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})

apiIndex.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:219
 * @route '/api/modulos-sidebar'
 */
apiIndex.url = (options?: RouteQueryOptions) => {
    return apiIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:219
 * @route '/api/modulos-sidebar'
 */
apiIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:219
 * @route '/api/modulos-sidebar'
 */
apiIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiIndex.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:219
 * @route '/api/modulos-sidebar'
 */
    const apiIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: apiIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:219
 * @route '/api/modulos-sidebar'
 */
        apiIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:219
 * @route '/api/modulos-sidebar'
 */
        apiIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    apiIndex.form = apiIndexForm
const ModuloSidebarController = { apiIndex }

export default ModuloSidebarController