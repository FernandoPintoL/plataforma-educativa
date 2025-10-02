import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardPadreController::index
 * @see app/Http/Controllers/DashboardPadreController.php:10
 * @route '/dashboard/padre'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboard/padre',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardPadreController::index
 * @see app/Http/Controllers/DashboardPadreController.php:10
 * @route '/dashboard/padre'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardPadreController::index
 * @see app/Http/Controllers/DashboardPadreController.php:10
 * @route '/dashboard/padre'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardPadreController::index
 * @see app/Http/Controllers/DashboardPadreController.php:10
 * @route '/dashboard/padre'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardPadreController::index
 * @see app/Http/Controllers/DashboardPadreController.php:10
 * @route '/dashboard/padre'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardPadreController::index
 * @see app/Http/Controllers/DashboardPadreController.php:10
 * @route '/dashboard/padre'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardPadreController::index
 * @see app/Http/Controllers/DashboardPadreController.php:10
 * @route '/dashboard/padre'
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
const DashboardPadreController = { index }

export default DashboardPadreController