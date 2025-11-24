import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::runUnifiedPipeline
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:45
 * @route '/api/discovery/unified-pipeline/{studentId}'
 */
export const runUnifiedPipeline = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runUnifiedPipeline.url(args, options),
    method: 'post',
})

runUnifiedPipeline.definition = {
    methods: ["post"],
    url: '/api/discovery/unified-pipeline/{studentId}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::runUnifiedPipeline
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:45
 * @route '/api/discovery/unified-pipeline/{studentId}'
 */
runUnifiedPipeline.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return runUnifiedPipeline.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::runUnifiedPipeline
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:45
 * @route '/api/discovery/unified-pipeline/{studentId}'
 */
runUnifiedPipeline.post = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runUnifiedPipeline.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::runUnifiedPipeline
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:45
 * @route '/api/discovery/unified-pipeline/{studentId}'
 */
    const runUnifiedPipelineForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: runUnifiedPipeline.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::runUnifiedPipeline
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:45
 * @route '/api/discovery/unified-pipeline/{studentId}'
 */
        runUnifiedPipelineForm.post = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: runUnifiedPipeline.url(args, options),
            method: 'post',
        })
    
    runUnifiedPipeline.form = runUnifiedPipelineForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::runClustering
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:55
 * @route '/api/discovery/clustering/run'
 */
export const runClustering = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runClustering.url(options),
    method: 'post',
})

runClustering.definition = {
    methods: ["post"],
    url: '/api/discovery/clustering/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::runClustering
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:55
 * @route '/api/discovery/clustering/run'
 */
runClustering.url = (options?: RouteQueryOptions) => {
    return runClustering.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::runClustering
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:55
 * @route '/api/discovery/clustering/run'
 */
runClustering.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runClustering.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::runClustering
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:55
 * @route '/api/discovery/clustering/run'
 */
    const runClusteringForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: runClustering.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::runClustering
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:55
 * @route '/api/discovery/clustering/run'
 */
        runClusteringForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: runClustering.url(options),
            method: 'post',
        })
    
    runClustering.form = runClusteringForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getClusteringSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
export const getClusteringSummary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getClusteringSummary.url(options),
    method: 'get',
})

getClusteringSummary.definition = {
    methods: ["get","head"],
    url: '/api/discovery/clustering/summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getClusteringSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
getClusteringSummary.url = (options?: RouteQueryOptions) => {
    return getClusteringSummary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getClusteringSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
getClusteringSummary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getClusteringSummary.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getClusteringSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
getClusteringSummary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getClusteringSummary.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getClusteringSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
    const getClusteringSummaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getClusteringSummary.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getClusteringSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
        getClusteringSummaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getClusteringSummary.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getClusteringSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:74
 * @route '/api/discovery/clustering/summary'
 */
        getClusteringSummaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getClusteringSummary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getClusteringSummary.form = getClusteringSummaryForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeTopics
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:84
 * @route '/api/discovery/topics/analyze'
 */
export const analyzeTopics = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyzeTopics.url(options),
    method: 'post',
})

analyzeTopics.definition = {
    methods: ["post"],
    url: '/api/discovery/topics/analyze',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeTopics
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:84
 * @route '/api/discovery/topics/analyze'
 */
analyzeTopics.url = (options?: RouteQueryOptions) => {
    return analyzeTopics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeTopics
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:84
 * @route '/api/discovery/topics/analyze'
 */
analyzeTopics.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyzeTopics.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeTopics
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:84
 * @route '/api/discovery/topics/analyze'
 */
    const analyzeTopicsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: analyzeTopics.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeTopics
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:84
 * @route '/api/discovery/topics/analyze'
 */
        analyzeTopicsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: analyzeTopics.url(options),
            method: 'post',
        })
    
    analyzeTopics.form = analyzeTopicsForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentTopics
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
 */
export const getStudentTopics = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStudentTopics.url(args, options),
    method: 'get',
})

getStudentTopics.definition = {
    methods: ["get","head"],
    url: '/api/discovery/topics/student/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentTopics
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
 */
getStudentTopics.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getStudentTopics.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentTopics
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
 */
getStudentTopics.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStudentTopics.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentTopics
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
 */
getStudentTopics.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStudentTopics.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentTopics
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
 */
    const getStudentTopicsForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getStudentTopics.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentTopics
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
 */
        getStudentTopicsForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStudentTopics.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentTopics
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
 */
        getStudentTopicsForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStudentTopics.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getStudentTopics.form = getStudentTopicsForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getTopicsDistribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
export const getTopicsDistribution = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTopicsDistribution.url(options),
    method: 'get',
})

getTopicsDistribution.definition = {
    methods: ["get","head"],
    url: '/api/discovery/topics/distribution',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getTopicsDistribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
getTopicsDistribution.url = (options?: RouteQueryOptions) => {
    return getTopicsDistribution.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getTopicsDistribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
getTopicsDistribution.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTopicsDistribution.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getTopicsDistribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
getTopicsDistribution.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTopicsDistribution.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getTopicsDistribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
    const getTopicsDistributionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getTopicsDistribution.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getTopicsDistribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
        getTopicsDistributionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTopicsDistribution.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getTopicsDistribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
        getTopicsDistributionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTopicsDistribution.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getTopicsDistribution.form = getTopicsDistributionForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::detectAnomalies
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:118
 * @route '/api/discovery/anomalies/detect'
 */
export const detectAnomalies = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: detectAnomalies.url(options),
    method: 'post',
})

detectAnomalies.definition = {
    methods: ["post"],
    url: '/api/discovery/anomalies/detect',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::detectAnomalies
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:118
 * @route '/api/discovery/anomalies/detect'
 */
detectAnomalies.url = (options?: RouteQueryOptions) => {
    return detectAnomalies.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::detectAnomalies
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:118
 * @route '/api/discovery/anomalies/detect'
 */
detectAnomalies.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: detectAnomalies.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::detectAnomalies
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:118
 * @route '/api/discovery/anomalies/detect'
 */
    const detectAnomaliesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: detectAnomalies.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::detectAnomalies
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:118
 * @route '/api/discovery/anomalies/detect'
 */
        detectAnomaliesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: detectAnomalies.url(options),
            method: 'post',
        })
    
    detectAnomalies.form = detectAnomaliesForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentAnomalies
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
export const getStudentAnomalies = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStudentAnomalies.url(args, options),
    method: 'get',
})

getStudentAnomalies.definition = {
    methods: ["get","head"],
    url: '/api/discovery/anomalies/student/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentAnomalies
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
getStudentAnomalies.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getStudentAnomalies.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentAnomalies
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
getStudentAnomalies.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStudentAnomalies.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentAnomalies
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
getStudentAnomalies.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStudentAnomalies.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentAnomalies
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
    const getStudentAnomaliesForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getStudentAnomalies.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentAnomalies
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
        getStudentAnomaliesForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStudentAnomalies.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getStudentAnomalies
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
        getStudentAnomaliesForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStudentAnomalies.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getStudentAnomalies.form = getStudentAnomaliesForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getAnomaliesSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
export const getAnomaliesSummary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnomaliesSummary.url(options),
    method: 'get',
})

getAnomaliesSummary.definition = {
    methods: ["get","head"],
    url: '/api/discovery/anomalies/summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getAnomaliesSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
getAnomaliesSummary.url = (options?: RouteQueryOptions) => {
    return getAnomaliesSummary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getAnomaliesSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
getAnomaliesSummary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnomaliesSummary.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getAnomaliesSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
getAnomaliesSummary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAnomaliesSummary.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getAnomaliesSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
    const getAnomaliesSummaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAnomaliesSummary.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getAnomaliesSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
        getAnomaliesSummaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnomaliesSummary.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getAnomaliesSummary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
        getAnomaliesSummaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnomaliesSummary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getAnomaliesSummary.form = getAnomaliesSummaryForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeCorrelations
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:152
 * @route '/api/discovery/correlations/analyze'
 */
export const analyzeCorrelations = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyzeCorrelations.url(options),
    method: 'post',
})

analyzeCorrelations.definition = {
    methods: ["post"],
    url: '/api/discovery/correlations/analyze',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeCorrelations
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:152
 * @route '/api/discovery/correlations/analyze'
 */
analyzeCorrelations.url = (options?: RouteQueryOptions) => {
    return analyzeCorrelations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeCorrelations
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:152
 * @route '/api/discovery/correlations/analyze'
 */
analyzeCorrelations.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyzeCorrelations.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeCorrelations
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:152
 * @route '/api/discovery/correlations/analyze'
 */
    const analyzeCorrelationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: analyzeCorrelations.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeCorrelations
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:152
 * @route '/api/discovery/correlations/analyze'
 */
        analyzeCorrelationsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: analyzeCorrelations.url(options),
            method: 'post',
        })
    
    analyzeCorrelations.form = analyzeCorrelationsForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeActivityPerformance
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:166
 * @route '/api/discovery/correlations/activity-performance'
 */
export const analyzeActivityPerformance = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyzeActivityPerformance.url(options),
    method: 'post',
})

analyzeActivityPerformance.definition = {
    methods: ["post"],
    url: '/api/discovery/correlations/activity-performance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeActivityPerformance
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:166
 * @route '/api/discovery/correlations/activity-performance'
 */
analyzeActivityPerformance.url = (options?: RouteQueryOptions) => {
    return analyzeActivityPerformance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeActivityPerformance
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:166
 * @route '/api/discovery/correlations/activity-performance'
 */
analyzeActivityPerformance.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyzeActivityPerformance.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeActivityPerformance
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:166
 * @route '/api/discovery/correlations/activity-performance'
 */
    const analyzeActivityPerformanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: analyzeActivityPerformance.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyzeActivityPerformance
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:166
 * @route '/api/discovery/correlations/activity-performance'
 */
        analyzeActivityPerformanceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: analyzeActivityPerformance.url(options),
            method: 'post',
        })
    
    analyzeActivityPerformance.form = analyzeActivityPerformanceForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getPredictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
export const getPredictiveFactors = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPredictiveFactors.url(options),
    method: 'get',
})

getPredictiveFactors.definition = {
    methods: ["get","head"],
    url: '/api/discovery/correlations/predictive-factors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getPredictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
getPredictiveFactors.url = (options?: RouteQueryOptions) => {
    return getPredictiveFactors.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getPredictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
getPredictiveFactors.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPredictiveFactors.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getPredictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
getPredictiveFactors.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPredictiveFactors.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getPredictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
    const getPredictiveFactorsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPredictiveFactors.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getPredictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
        getPredictiveFactorsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPredictiveFactors.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getPredictiveFactors
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:180
 * @route '/api/discovery/correlations/predictive-factors'
 */
        getPredictiveFactorsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPredictiveFactors.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getPredictiveFactors.form = getPredictiveFactorsForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getIntegratedInsights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
export const getIntegratedInsights = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getIntegratedInsights.url(args, options),
    method: 'get',
})

getIntegratedInsights.definition = {
    methods: ["get","head"],
    url: '/api/discovery/insights/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getIntegratedInsights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
getIntegratedInsights.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getIntegratedInsights.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getIntegratedInsights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
getIntegratedInsights.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getIntegratedInsights.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getIntegratedInsights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
getIntegratedInsights.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getIntegratedInsights.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getIntegratedInsights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
    const getIntegratedInsightsForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getIntegratedInsights.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getIntegratedInsights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
        getIntegratedInsightsForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getIntegratedInsights.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getIntegratedInsights
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:200
 * @route '/api/discovery/insights/{studentId}'
 */
        getIntegratedInsightsForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getIntegratedInsights.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getIntegratedInsights.form = getIntegratedInsightsForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getHealthStatus
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
export const getHealthStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHealthStatus.url(options),
    method: 'get',
})

getHealthStatus.definition = {
    methods: ["get","head"],
    url: '/api/discovery/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getHealthStatus
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
getHealthStatus.url = (options?: RouteQueryOptions) => {
    return getHealthStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getHealthStatus
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
getHealthStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHealthStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getHealthStatus
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
getHealthStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getHealthStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getHealthStatus
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
    const getHealthStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getHealthStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getHealthStatus
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
        getHealthStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHealthStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::getHealthStatus
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:190
 * @route '/api/discovery/health'
 */
        getHealthStatusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHealthStatus.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getHealthStatus.form = getHealthStatusForm
const DiscoveryOrchestrationController = { runUnifiedPipeline, runClustering, getClusteringSummary, analyzeTopics, getStudentTopics, getTopicsDistribution, detectAnomalies, getStudentAnomalies, getAnomaliesSummary, analyzeCorrelations, analyzeActivityPerformance, getPredictiveFactors, getIntegratedInsights, getHealthStatus }

export default DiscoveryOrchestrationController