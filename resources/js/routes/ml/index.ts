import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import analysis from './analysis'
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
const ml = {
    analysis,
batchAnalysis,
health,
info,
}

export default ml