import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MLDashboardController::record
 * @see app/Http/Controllers/MLDashboardController.php:73
 * @route '/api/ml/feedback'
 */
export const record = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: record.url(options),
    method: 'post',
})

record.definition = {
    methods: ["post"],
    url: '/api/ml/feedback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MLDashboardController::record
 * @see app/Http/Controllers/MLDashboardController.php:73
 * @route '/api/ml/feedback'
 */
record.url = (options?: RouteQueryOptions) => {
    return record.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::record
 * @see app/Http/Controllers/MLDashboardController.php:73
 * @route '/api/ml/feedback'
 */
record.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: record.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::record
 * @see app/Http/Controllers/MLDashboardController.php:73
 * @route '/api/ml/feedback'
 */
    const recordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: record.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::record
 * @see app/Http/Controllers/MLDashboardController.php:73
 * @route '/api/ml/feedback'
 */
        recordForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: record.url(options),
            method: 'post',
        })
    
    record.form = recordForm
const feedback = {
    record,
}

export default feedback