import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
export const risk = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: risk.url(options),
    method: 'get',
})

risk.definition = {
    methods: ["get","head"],
    url: '/api/ml/reports/institutional/risk',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
risk.url = (options?: RouteQueryOptions) => {
    return risk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
risk.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: risk.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
risk.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: risk.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
    const riskForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: risk.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
        riskForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: risk.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
        riskForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: risk.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    risk.form = riskForm
const institutional = {
    risk,
}

export default institutional