import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ClusteringController::runClustering
 * @see app/Http/Controllers/Api/ClusteringController.php:28
 * @route '/api/clustering/run'
 */
export const runClustering = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runClustering.url(options),
    method: 'post',
})

runClustering.definition = {
    methods: ["post"],
    url: '/api/clustering/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ClusteringController::runClustering
 * @see app/Http/Controllers/Api/ClusteringController.php:28
 * @route '/api/clustering/run'
 */
runClustering.url = (options?: RouteQueryOptions) => {
    return runClustering.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClusteringController::runClustering
 * @see app/Http/Controllers/Api/ClusteringController.php:28
 * @route '/api/clustering/run'
 */
runClustering.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runClustering.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ClusteringController::runClustering
 * @see app/Http/Controllers/Api/ClusteringController.php:28
 * @route '/api/clustering/run'
 */
    const runClusteringForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: runClustering.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ClusteringController::runClustering
 * @see app/Http/Controllers/Api/ClusteringController.php:28
 * @route '/api/clustering/run'
 */
        runClusteringForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: runClustering.url(options),
            method: 'post',
        })
    
    runClustering.form = runClusteringForm
/**
* @see \App\Http\Controllers\Api\ClusteringController::getSummary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
export const getSummary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSummary.url(options),
    method: 'get',
})

getSummary.definition = {
    methods: ["get","head"],
    url: '/api/clustering/summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ClusteringController::getSummary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
getSummary.url = (options?: RouteQueryOptions) => {
    return getSummary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClusteringController::getSummary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
getSummary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSummary.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ClusteringController::getSummary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
getSummary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getSummary.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ClusteringController::getSummary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
    const getSummaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getSummary.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ClusteringController::getSummary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
        getSummaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSummary.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ClusteringController::getSummary
 * @see app/Http/Controllers/Api/ClusteringController.php:47
 * @route '/api/clustering/summary'
 */
        getSummaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSummary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getSummary.form = getSummaryForm
/**
* @see \App\Http\Controllers\Api\ClusteringController::getClusterAnalysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
export const getClusterAnalysis = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getClusterAnalysis.url(args, options),
    method: 'get',
})

getClusterAnalysis.definition = {
    methods: ["get","head"],
    url: '/api/clustering/cluster/{clusterId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ClusteringController::getClusterAnalysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
getClusterAnalysis.url = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getClusterAnalysis.definition.url
            .replace('{clusterId}', parsedArgs.clusterId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClusteringController::getClusterAnalysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
getClusterAnalysis.get = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getClusterAnalysis.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ClusteringController::getClusterAnalysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
getClusterAnalysis.head = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getClusterAnalysis.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ClusteringController::getClusterAnalysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
    const getClusterAnalysisForm = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getClusterAnalysis.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ClusteringController::getClusterAnalysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
        getClusterAnalysisForm.get = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getClusterAnalysis.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ClusteringController::getClusterAnalysis
 * @see app/Http/Controllers/Api/ClusteringController.php:57
 * @route '/api/clustering/cluster/{clusterId}'
 */
        getClusterAnalysisForm.head = (args: { clusterId: string | number } | [clusterId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getClusterAnalysis.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getClusterAnalysis.form = getClusterAnalysisForm
/**
* @see \App\Http\Controllers\Api\ClusteringController::getAnomalousStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
export const getAnomalousStudents = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnomalousStudents.url(options),
    method: 'get',
})

getAnomalousStudents.definition = {
    methods: ["get","head"],
    url: '/api/clustering/anomalous',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ClusteringController::getAnomalousStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
getAnomalousStudents.url = (options?: RouteQueryOptions) => {
    return getAnomalousStudents.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClusteringController::getAnomalousStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
getAnomalousStudents.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnomalousStudents.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ClusteringController::getAnomalousStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
getAnomalousStudents.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAnomalousStudents.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ClusteringController::getAnomalousStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
    const getAnomalousStudentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAnomalousStudents.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ClusteringController::getAnomalousStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
        getAnomalousStudentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnomalousStudents.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ClusteringController::getAnomalousStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:67
 * @route '/api/clustering/anomalous'
 */
        getAnomalousStudentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnomalousStudents.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getAnomalousStudents.form = getAnomalousStudentsForm
/**
* @see \App\Http\Controllers\Api\ClusteringController::getSimilarStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
export const getSimilarStudents = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSimilarStudents.url(args, options),
    method: 'get',
})

getSimilarStudents.definition = {
    methods: ["get","head"],
    url: '/api/clustering/similar/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ClusteringController::getSimilarStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
getSimilarStudents.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getSimilarStudents.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ClusteringController::getSimilarStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
getSimilarStudents.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSimilarStudents.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ClusteringController::getSimilarStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
getSimilarStudents.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getSimilarStudents.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ClusteringController::getSimilarStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
    const getSimilarStudentsForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getSimilarStudents.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ClusteringController::getSimilarStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
        getSimilarStudentsForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSimilarStudents.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ClusteringController::getSimilarStudents
 * @see app/Http/Controllers/Api/ClusteringController.php:78
 * @route '/api/clustering/similar/{studentId}'
 */
        getSimilarStudentsForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSimilarStudents.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getSimilarStudents.form = getSimilarStudentsForm
const ClusteringController = { runClustering, getSummary, getClusterAnalysis, getAnomalousStudents, getSimilarStudents }

export default ClusteringController