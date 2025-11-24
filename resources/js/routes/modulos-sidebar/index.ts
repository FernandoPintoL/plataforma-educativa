import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ModuloSidebarController::index
 * @see app/Http/Controllers/Api/ModuloSidebarController.php:15
 * @route '/api/modulos-sidebar'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ModuloSidebarController::index
 * @see app/Http/Controllers/Api/ModuloSidebarController.php:15
 * @route '/api/modulos-sidebar'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ModuloSidebarController::index
 * @see app/Http/Controllers/Api/ModuloSidebarController.php:15
 * @route '/api/modulos-sidebar'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ModuloSidebarController::index
 * @see app/Http/Controllers/Api/ModuloSidebarController.php:15
 * @route '/api/modulos-sidebar'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ModuloSidebarController::index
 * @see app/Http/Controllers/Api/ModuloSidebarController.php:15
 * @route '/api/modulos-sidebar'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ModuloSidebarController::index
 * @see app/Http/Controllers/Api/ModuloSidebarController.php:15
 * @route '/api/modulos-sidebar'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ModuloSidebarController::index
 * @see app/Http/Controllers/Api/ModuloSidebarController.php:15
 * @route '/api/modulos-sidebar'
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
const modulosSidebar = {
    index,
}

export default modulosSidebar