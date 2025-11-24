import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::run
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:55
 * @route '/api/discovery/clustering/run'
 */
export const run = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

run.definition = {
    methods: ["post"],
    url: '/api/discovery/clustering/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::run
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:55
 * @route '/api/discovery/clustering/run'
 */
run.url = (options?: RouteQueryOptions) => {
    return run.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::run
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:55
 * @route '/api/discovery/clustering/run'
 */
run.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::run
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:55
 * @route '/api/discovery/clustering/run'
 */
    const runForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: run.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::run
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:55
 * @route '/api/discovery/clustering/run'
 */
        runForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: run.url(options),
            method: 'post',
        })
    
    run.form = runForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
export const summary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})

summary.definition = {
    methods: ["get","head"],
    url: '/api/discovery/clustering/summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
summary.url = (options?: RouteQueryOptions) => {
    return summary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
summary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
summary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: summary.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
    const summaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: summary.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
        summaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
        summaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    summary.form = summaryForm
const clustering = {
    run,
summary,
}

export default clustering