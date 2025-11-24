import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import cluster from './cluster'
/**
* @see \App\Http\Controllers\Api\ClusteringController::run
 * @see app/Http/Controllers/Api/ClusteringController.php:28
 * @route '/api/clustering/run'
 */
export const run = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

run.definition = {
    methods: ["post"],
    url: '/api/clustering/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ClusteringController::run
 * @see app/Http/Controllers/Api/ClusteringController.php:28
 * @route '/api/clustering/run'
 */
run.url = (options?: RouteQueryOptions) => {
    return run.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClusteringController::run
 * @see app/Http/Controllers/Api/ClusteringController.php:28
 * @route '/api/clustering/run'
 */
run.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ClusteringController::run
 * @see app/Http/Controllers/Api/ClusteringController.php:28
 * @route '/api/clustering/run'
 */
    const runForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: run.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ClusteringController::run
 * @see app/Http/Controllers/Api/ClusteringController.php:28
 * @route '/api/clustering/run'
 */
        runForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: run.url(options),
            method: 'post',
        })
    
    run.form = runForm
/**
* @see \App\Http\Controllers\Api\ClusteringController::summary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
export const summary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})

summary.definition = {
    methods: ["get","head"],
    url: '/api/clustering/summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ClusteringController::summary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
summary.url = (options?: RouteQueryOptions) => {
    return summary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClusteringController::summary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
summary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ClusteringController::summary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
summary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: summary.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ClusteringController::summary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
    const summaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: summary.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ClusteringController::summary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
        summaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ClusteringController::summary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
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
/**
* @see \App\Http\Controllers\Api\ClusteringController::anomalous
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
export const anomalous = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: anomalous.url(options),
    method: 'get',
})

anomalous.definition = {
    methods: ["get","head"],
    url: '/api/clustering/anomalous',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ClusteringController::anomalous
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
anomalous.url = (options?: RouteQueryOptions) => {
    return anomalous.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClusteringController::anomalous
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
anomalous.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: anomalous.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ClusteringController::anomalous
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
anomalous.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: anomalous.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ClusteringController::anomalous
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
    const anomalousForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: anomalous.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ClusteringController::anomalous
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
        anomalousForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: anomalous.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ClusteringController::anomalous
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
        anomalousForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: anomalous.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    anomalous.form = anomalousForm
/**
* @see \App\Http\Controllers\Api\ClusteringController::similar
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
export const similar = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: similar.url(args, options),
    method: 'get',
})

similar.definition = {
    methods: ["get","head"],
    url: '/api/clustering/similar/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ClusteringController::similar
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
similar.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return similar.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClusteringController::similar
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
similar.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: similar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ClusteringController::similar
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
similar.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: similar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ClusteringController::similar
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
    const similarForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: similar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ClusteringController::similar
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
        similarForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: similar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ClusteringController::similar
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
        similarForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: similar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    similar.form = similarForm
const clustering = {
    run,
summary,
cluster,
anomalous,
similar,
}

export default clustering