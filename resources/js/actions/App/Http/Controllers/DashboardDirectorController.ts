import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardDirectorController::index
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboard/director',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardDirectorController::index
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardDirectorController::index
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardDirectorController::index
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardDirectorController::index
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardDirectorController::index
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardDirectorController::index
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
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

const DashboardDirectorController = { index }

export default DashboardDirectorController