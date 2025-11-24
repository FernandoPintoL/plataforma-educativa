import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ClusteringController::analysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
export const analysis = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analysis.url(args, options),
    method: 'get',
})

analysis.definition = {
    methods: ["get","head"],
    url: '/api/clustering/cluster/{clusterId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ClusteringController::analysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
analysis.url = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { clusterId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    clusterId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        clusterId: args.clusterId,
                }

    return analysis.definition.url
            .replace('{clusterId}', parsedArgs.clusterId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClusteringController::analysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
analysis.get = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analysis.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ClusteringController::analysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
analysis.head = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analysis.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ClusteringController::analysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
    const analysisForm = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analysis.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ClusteringController::analysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
        analysisForm.get = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analysis.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ClusteringController::analysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
        analysisForm.head = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analysis.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analysis.form = analysisForm
const cluster = {
    analysis,
}

export default cluster