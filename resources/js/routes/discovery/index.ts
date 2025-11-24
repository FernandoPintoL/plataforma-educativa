import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import clustering from './clustering'
import topics from './topics'
import anomalies from './anomalies'
import correlations from './correlations'
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::unifiedPipeline
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:45
 * @route '/api/discovery/unified-pipeline/{studentId}'
 */
export const unifiedPipeline = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unifiedPipeline.url(args, options),
    method: 'post',
})

unifiedPipeline.definition = {
    methods: ["post"],
    url: '/api/discovery/unified-pipeline/{studentId}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::unifiedPipeline
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:45
 * @route '/api/discovery/unified-pipeline/{studentId}'
 */
unifiedPipeline.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { studentId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    studentId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        studentId: args.studentId,
                }

    return unifiedPipeline.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::unifiedPipeline
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:45
 * @route '/api/discovery/unified-pipeline/{studentId}'
 */
unifiedPipeline.post = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unifiedPipeline.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::unifiedPipeline
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:45
 * @route '/api/discovery/unified-pipeline/{studentId}'
 */
    const unifiedPipelineForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: unifiedPipeline.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::unifiedPipeline
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:45
 * @route '/api/discovery/unified-pipeline/{studentId}'
 */
        unifiedPipelineForm.post = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: unifiedPipeline.url(args, options),
            method: 'post',
        })
    
    unifiedPipeline.form = unifiedPipelineForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::insights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
export const insights = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: insights.url(args, options),
    method: 'get',
})

insights.definition = {
    methods: ["get","head"],
    url: '/api/discovery/insights/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::insights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
insights.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { studentId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    studentId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        studentId: args.studentId,
                }

    return insights.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::insights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
insights.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: insights.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::insights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
insights.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: insights.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::insights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
    const insightsForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: insights.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::insights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
        insightsForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: insights.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::insights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
        insightsForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: insights.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    insights.form = insightsForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::health
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
export const health = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})

health.definition = {
    methods: ["get","head"],
    url: '/api/discovery/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::health
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
health.url = (options?: RouteQueryOptions) => {
    return health.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::health
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
health.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::health
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
health.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: health.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::health
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
    const healthForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: health.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::health
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
        healthForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: health.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::health
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
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
const discovery = {
    unifiedPipeline,
clustering,
topics,
anomalies,
correlations,
insights,
health,
}

export default discovery