import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MLAnalysisController::integrated
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
export const integrated = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: integrated.url(args, options),
    method: 'get',
})

integrated.definition = {
    methods: ["get","head"],
    url: '/api/ml/student/{studentId}/analysis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLAnalysisController::integrated
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
integrated.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return integrated.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLAnalysisController::integrated
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
integrated.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: integrated.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLAnalysisController::integrated
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
integrated.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: integrated.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLAnalysisController::integrated
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
    const integratedForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: integrated.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLAnalysisController::integrated
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
        integratedForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: integrated.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLAnalysisController::integrated
 * @see app/Http/Controllers/MLAnalysisController.php:43
 * @route '/api/ml/student/{studentId}/analysis'
 */
        integratedForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: integrated.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    integrated.form = integratedForm
/**
* @see \App\Http\Controllers\MLAnalysisController::predictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
export const predictions = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: predictions.url(args, options),
    method: 'get',
})

predictions.definition = {
    methods: ["get","head"],
    url: '/api/ml/student/{studentId}/predictions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLAnalysisController::predictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
predictions.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return predictions.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLAnalysisController::predictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
predictions.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: predictions.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLAnalysisController::predictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
predictions.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: predictions.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLAnalysisController::predictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
    const predictionsForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: predictions.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLAnalysisController::predictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
        predictionsForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: predictions.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLAnalysisController::predictions
 * @see app/Http/Controllers/MLAnalysisController.php:89
 * @route '/api/ml/student/{studentId}/predictions'
 */
        predictionsForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: predictions.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    predictions.form = predictionsForm
/**
* @see \App\Http\Controllers\MLAnalysisController::clustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
export const clustering = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clustering.url(args, options),
    method: 'get',
})

clustering.definition = {
    methods: ["get","head"],
    url: '/api/ml/student/{studentId}/clustering',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLAnalysisController::clustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
clustering.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return clustering.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLAnalysisController::clustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
clustering.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clustering.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLAnalysisController::clustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
clustering.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: clustering.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLAnalysisController::clustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
    const clusteringForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: clustering.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLAnalysisController::clustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
        clusteringForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: clustering.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLAnalysisController::clustering
 * @see app/Http/Controllers/MLAnalysisController.php:131
 * @route '/api/ml/student/{studentId}/clustering'
 */
        clusteringForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: clustering.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    clustering.form = clusteringForm
const analysis = {
    integrated,
predictions,
clustering,
}

export default analysis