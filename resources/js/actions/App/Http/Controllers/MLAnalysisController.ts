import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MLAnalysisController::getIntegratedAnalysis
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
export const getIntegratedAnalysis = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getIntegratedAnalysis.url(args, options),
    method: 'get',
})

getIntegratedAnalysis.definition = {
    methods: ["get","head"],
    url: '/api/ml/student/{studentId}/analysis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLAnalysisController::getIntegratedAnalysis
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
getIntegratedAnalysis.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getIntegratedAnalysis.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLAnalysisController::getIntegratedAnalysis
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
getIntegratedAnalysis.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getIntegratedAnalysis.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLAnalysisController::getIntegratedAnalysis
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
getIntegratedAnalysis.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getIntegratedAnalysis.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLAnalysisController::getIntegratedAnalysis
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
    const getIntegratedAnalysisForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getIntegratedAnalysis.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLAnalysisController::getIntegratedAnalysis
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
        getIntegratedAnalysisForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getIntegratedAnalysis.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLAnalysisController::getIntegratedAnalysis
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
        getIntegratedAnalysisForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getIntegratedAnalysis.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getIntegratedAnalysis.form = getIntegratedAnalysisForm
/**
* @see \App\Http\Controllers\MLAnalysisController::getPredictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
export const getPredictions = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPredictions.url(args, options),
    method: 'get',
})

getPredictions.definition = {
    methods: ["get","head"],
    url: '/api/ml/student/{studentId}/predictions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLAnalysisController::getPredictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
getPredictions.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getPredictions.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLAnalysisController::getPredictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
getPredictions.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPredictions.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLAnalysisController::getPredictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
getPredictions.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPredictions.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLAnalysisController::getPredictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
    const getPredictionsForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPredictions.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLAnalysisController::getPredictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
        getPredictionsForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPredictions.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLAnalysisController::getPredictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
        getPredictionsForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPredictions.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getPredictions.form = getPredictionsForm
/**
* @see \App\Http\Controllers\MLAnalysisController::getClustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
export const getClustering = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getClustering.url(args, options),
    method: 'get',
})

getClustering.definition = {
    methods: ["get","head"],
    url: '/api/ml/student/{studentId}/clustering',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLAnalysisController::getClustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
getClustering.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getClustering.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLAnalysisController::getClustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
getClustering.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getClustering.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLAnalysisController::getClustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
getClustering.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getClustering.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLAnalysisController::getClustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
    const getClusteringForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getClustering.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLAnalysisController::getClustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
        getClusteringForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getClustering.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLAnalysisController::getClustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
        getClusteringForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getClustering.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getClustering.form = getClusteringForm
/**
* @see \App\Http\Controllers\MLAnalysisController::batchAnalysis
 * @see app/Http/Controllers/MLAnalysisController.php:235
 * @route '/api/ml/batch-analysis'
 */
export const batchAnalysis = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batchAnalysis.url(options),
    method: 'post',
})

batchAnalysis.definition = {
    methods: ["post"],
    url: '/api/ml/batch-analysis',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MLAnalysisController::batchAnalysis
 * @see app/Http/Controllers/MLAnalysisController.php:235
 * @route '/api/ml/batch-analysis'
 */
batchAnalysis.url = (options?: RouteQueryOptions) => {
    return batchAnalysis.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLAnalysisController::batchAnalysis
 * @see app/Http/Controllers/MLAnalysisController.php:235
 * @route '/api/ml/batch-analysis'
 */
batchAnalysis.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batchAnalysis.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MLAnalysisController::batchAnalysis
 * @see app/Http/Controllers/MLAnalysisController.php:235
 * @route '/api/ml/batch-analysis'
 */
    const batchAnalysisForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: batchAnalysis.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MLAnalysisController::batchAnalysis
 * @see app/Http/Controllers/MLAnalysisController.php:235
 * @route '/api/ml/batch-analysis'
 */
        batchAnalysisForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: batchAnalysis.url(options),
            method: 'post',
        })
    
    batchAnalysis.form = batchAnalysisForm
/**
* @see \App\Http\Controllers\MLAnalysisController::checkMLHealth
 * @see app/Http/Controllers/MLAnalysisController.php:170
 * @route '/api/ml/health'
 */
export const checkMLHealth = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkMLHealth.url(options),
    method: 'post',
})

checkMLHealth.definition = {
    methods: ["post"],
    url: '/api/ml/health',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MLAnalysisController::checkMLHealth
 * @see app/Http/Controllers/MLAnalysisController.php:170
 * @route '/api/ml/health'
 */
checkMLHealth.url = (options?: RouteQueryOptions) => {
    return checkMLHealth.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLAnalysisController::checkMLHealth
 * @see app/Http/Controllers/MLAnalysisController.php:170
 * @route '/api/ml/health'
 */
checkMLHealth.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkMLHealth.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MLAnalysisController::checkMLHealth
 * @see app/Http/Controllers/MLAnalysisController.php:170
 * @route '/api/ml/health'
 */
    const checkMLHealthForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkMLHealth.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MLAnalysisController::checkMLHealth
 * @see app/Http/Controllers/MLAnalysisController.php:170
 * @route '/api/ml/health'
 */
        checkMLHealthForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkMLHealth.url(options),
            method: 'post',
        })
    
    checkMLHealth.form = checkMLHealthForm
/**
* @see \App\Http\Controllers\MLAnalysisController::getMLInfo
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
export const getMLInfo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMLInfo.url(options),
    method: 'get',
})

getMLInfo.definition = {
    methods: ["get","head"],
    url: '/api/ml/info',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLAnalysisController::getMLInfo
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
getMLInfo.url = (options?: RouteQueryOptions) => {
    return getMLInfo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLAnalysisController::getMLInfo
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
getMLInfo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMLInfo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLAnalysisController::getMLInfo
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
getMLInfo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getMLInfo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLAnalysisController::getMLInfo
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
    const getMLInfoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getMLInfo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLAnalysisController::getMLInfo
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
        getMLInfoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMLInfo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLAnalysisController::getMLInfo
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
        getMLInfoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMLInfo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getMLInfo.form = getMLInfoForm
const MLAnalysisController = { getIntegratedAnalysis, getPredictions, getClustering, batchAnalysis, checkMLHealth, getMLInfo }

export default MLAnalysisController