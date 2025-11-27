import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import analysis from './analysis'
import predict from './predict'
import feedback from './feedback'
import reports from './reports'
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
* @see \App\Http\Controllers\MLAnalysisController::health
 * @see app/Http/Controllers/MLAnalysisController.php:170
 * @route '/api/ml/health'
 */
export const health = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: health.url(options),
    method: 'post',
})

health.definition = {
    methods: ["post"],
    url: '/api/ml/health',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MLAnalysisController::health
 * @see app/Http/Controllers/MLAnalysisController.php:170
 * @route '/api/ml/health'
 */
health.url = (options?: RouteQueryOptions) => {
    return health.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLAnalysisController::health
 * @see app/Http/Controllers/MLAnalysisController.php:170
 * @route '/api/ml/health'
 */
health.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: health.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MLAnalysisController::health
 * @see app/Http/Controllers/MLAnalysisController.php:170
 * @route '/api/ml/health'
 */
    const healthForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: health.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MLAnalysisController::health
 * @see app/Http/Controllers/MLAnalysisController.php:170
 * @route '/api/ml/health'
 */
        healthForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: health.url(options),
            method: 'post',
        })
    
    health.form = healthForm
/**
* @see \App\Http\Controllers\MLAnalysisController::info
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
export const info = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: info.url(options),
    method: 'get',
})

info.definition = {
    methods: ["get","head"],
    url: '/api/ml/info',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLAnalysisController::info
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
info.url = (options?: RouteQueryOptions) => {
    return info.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLAnalysisController::info
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
info.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: info.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLAnalysisController::info
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
info.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: info.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLAnalysisController::info
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
    const infoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: info.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLAnalysisController::info
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
        infoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: info.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLAnalysisController::info
 * @see app/Http/Controllers/MLAnalysisController.php:200
 * @route '/api/ml/info'
 */
        infoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: info.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    info.form = infoForm
/**
* @see \App\Http\Controllers\MLDashboardController::dashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/api/ml/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::dashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::dashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::dashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::dashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::dashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::dashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\MLDashboardController::metrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
export const metrics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metrics.url(options),
    method: 'get',
})

metrics.definition = {
    methods: ["get","head"],
    url: '/api/ml/metrics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::metrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
metrics.url = (options?: RouteQueryOptions) => {
    return metrics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::metrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
metrics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metrics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::metrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
metrics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: metrics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::metrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
    const metricsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: metrics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::metrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
        metricsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metrics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::metrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
        metricsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metrics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    metrics.form = metricsForm
/**
* @see \App\Http\Controllers\MLDashboardController::reviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
export const reviewQueue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reviewQueue.url(options),
    method: 'get',
})

reviewQueue.definition = {
    methods: ["get","head"],
    url: '/api/ml/review-queue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::reviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
reviewQueue.url = (options?: RouteQueryOptions) => {
    return reviewQueue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::reviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
reviewQueue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reviewQueue.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::reviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
reviewQueue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reviewQueue.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::reviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
    const reviewQueueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reviewQueue.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::reviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
        reviewQueueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reviewQueue.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::reviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
        reviewQueueForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reviewQueue.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reviewQueue.form = reviewQueueForm
/**
* @see \App\Http\Controllers\MLDashboardController::pendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
export const pendingFeedback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingFeedback.url(options),
    method: 'get',
})

pendingFeedback.definition = {
    methods: ["get","head"],
    url: '/api/ml/pending-feedback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::pendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
pendingFeedback.url = (options?: RouteQueryOptions) => {
    return pendingFeedback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::pendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
pendingFeedback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingFeedback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::pendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
pendingFeedback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendingFeedback.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::pendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
    const pendingFeedbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pendingFeedback.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::pendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
        pendingFeedbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingFeedback.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::pendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
        pendingFeedbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingFeedback.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pendingFeedback.form = pendingFeedbackForm
/**
* @see \App\Http\Controllers\MLDashboardController::degradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
export const degradation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: degradation.url(options),
    method: 'get',
})

degradation.definition = {
    methods: ["get","head"],
    url: '/api/ml/degradation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::degradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
degradation.url = (options?: RouteQueryOptions) => {
    return degradation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::degradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
degradation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: degradation.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::degradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
degradation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: degradation.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::degradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
    const degradationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: degradation.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::degradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
        degradationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: degradation.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::degradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
        degradationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: degradation.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    degradation.form = degradationForm
const ml = {
    analysis,
batchAnalysis,
health,
info,
predict,
feedback,
dashboard,
metrics,
reviewQueue,
pendingFeedback,
degradation,
reports,
}

export default ml