import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyze
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:152
 * @route '/api/discovery/correlations/analyze'
 */
export const analyze = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

analyze.definition = {
    methods: ["post"],
    url: '/api/discovery/correlations/analyze',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyze
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:152
 * @route '/api/discovery/correlations/analyze'
 */
analyze.url = (options?: RouteQueryOptions) => {
    return analyze.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyze
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:152
 * @route '/api/discovery/correlations/analyze'
 */
analyze.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyze
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:152
 * @route '/api/discovery/correlations/analyze'
 */
    const analyzeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: analyze.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyze
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:152
 * @route '/api/discovery/correlations/analyze'
 */
        analyzeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: analyze.url(options),
            method: 'post',
        })
    
    analyze.form = analyzeForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::activityPerformance
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:166
 * @route '/api/discovery/correlations/activity-performance'
 */
export const activityPerformance = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activityPerformance.url(options),
    method: 'post',
})

activityPerformance.definition = {
    methods: ["post"],
    url: '/api/discovery/correlations/activity-performance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::activityPerformance
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:166
 * @route '/api/discovery/correlations/activity-performance'
 */
activityPerformance.url = (options?: RouteQueryOptions) => {
    return activityPerformance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::activityPerformance
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:166
 * @route '/api/discovery/correlations/activity-performance'
 */
activityPerformance.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activityPerformance.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::activityPerformance
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:166
 * @route '/api/discovery/correlations/activity-performance'
 */
    const activityPerformanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: activityPerformance.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::activityPerformance
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:166
 * @route '/api/discovery/correlations/activity-performance'
 */
        activityPerformanceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: activityPerformance.url(options),
            method: 'post',
        })
    
    activityPerformance.form = activityPerformanceForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::predictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
export const predictiveFactors = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: predictiveFactors.url(options),
    method: 'get',
})

predictiveFactors.definition = {
    methods: ["get","head"],
    url: '/api/discovery/correlations/predictive-factors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::predictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
predictiveFactors.url = (options?: RouteQueryOptions) => {
    return predictiveFactors.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::predictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
predictiveFactors.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: predictiveFactors.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::predictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
predictiveFactors.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: predictiveFactors.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::predictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
    const predictiveFactorsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: predictiveFactors.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::predictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
        predictiveFactorsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: predictiveFactors.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::predictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
        predictiveFactorsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: predictiveFactors.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    predictiveFactors.form = predictiveFactorsForm
const correlations = {
    analyze,
activityPerformance,
predictiveFactors,
}

export default correlations