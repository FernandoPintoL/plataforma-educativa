import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import student from './student'
import institutional from './institutional'
/**
* @see \App\Http\Controllers\MLDashboardController::anomalies
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
export const anomalies = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: anomalies.url(options),
    method: 'get',
})

anomalies.definition = {
    methods: ["get","head"],
    url: '/api/ml/reports/anomalies',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::anomalies
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
anomalies.url = (options?: RouteQueryOptions) => {
    return anomalies.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::anomalies
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
anomalies.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: anomalies.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::anomalies
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
anomalies.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: anomalies.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::anomalies
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
    const anomaliesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: anomalies.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::anomalies
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
        anomaliesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: anomalies.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::anomalies
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
        anomaliesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: anomalies.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    anomalies.form = anomaliesForm
/**
* @see \App\Http\Controllers\MLDashboardController::trends
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
export const trends = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trends.url(options),
    method: 'get',
})

trends.definition = {
    methods: ["get","head"],
    url: '/api/ml/reports/trends',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::trends
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
trends.url = (options?: RouteQueryOptions) => {
    return trends.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::trends
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
trends.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trends.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::trends
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
trends.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: trends.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::trends
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
    const trendsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: trends.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::trends
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
        trendsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: trends.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::trends
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
        trendsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: trends.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    trends.form = trendsForm
const reports = {
    student,
institutional,
anomalies,
trends,
}

export default reports