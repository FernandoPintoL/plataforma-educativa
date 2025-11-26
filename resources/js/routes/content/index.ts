import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyze
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:32
 * @route '/api/content/analyze'
 */
export const analyze = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

analyze.definition = {
    methods: ["post"],
    url: '/api/content/analyze',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyze
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:32
 * @route '/api/content/analyze'
 */
analyze.url = (options?: RouteQueryOptions) => {
    return analyze.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyze
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:32
 * @route '/api/content/analyze'
 */
analyze.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyze
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:32
 * @route '/api/content/analyze'
 */
    const analyzeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: analyze.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyze
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:32
 * @route '/api/content/analyze'
 */
        analyzeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: analyze.url(options),
            method: 'post',
        })
    
    analyze.form = analyzeForm
/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:163
 * @route '/api/content/health'
 */
export const health = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})

health.definition = {
    methods: ["get","head"],
    url: '/api/content/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:163
 * @route '/api/content/health'
 */
health.url = (options?: RouteQueryOptions) => {
    return health.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:163
 * @route '/api/content/health'
 */
health.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:163
 * @route '/api/content/health'
 */
health.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: health.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:163
 * @route '/api/content/health'
 */
    const healthForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: health.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:163
 * @route '/api/content/health'
 */
        healthForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: health.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:163
 * @route '/api/content/health'
 */
        healthForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: health.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    health.form = healthForm
const content = {
    analyze,
health,
}

export default content