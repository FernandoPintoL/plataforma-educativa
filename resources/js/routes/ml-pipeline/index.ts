import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\MLPipelineController::execute
 * @see app/Http/Controllers/Api/MLPipelineController.php:22
 * @route '/api/ml-pipeline/execute'
 */
export const execute = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: execute.url(options),
    method: 'post',
})

execute.definition = {
    methods: ["post"],
    url: '/api/ml-pipeline/execute',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MLPipelineController::execute
 * @see app/Http/Controllers/Api/MLPipelineController.php:22
 * @route '/api/ml-pipeline/execute'
 */
execute.url = (options?: RouteQueryOptions) => {
    return execute.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MLPipelineController::execute
 * @see app/Http/Controllers/Api/MLPipelineController.php:22
 * @route '/api/ml-pipeline/execute'
 */
execute.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: execute.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\MLPipelineController::execute
 * @see app/Http/Controllers/Api/MLPipelineController.php:22
 * @route '/api/ml-pipeline/execute'
 */
    const executeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: execute.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\MLPipelineController::execute
 * @see app/Http/Controllers/Api/MLPipelineController.php:22
 * @route '/api/ml-pipeline/execute'
 */
        executeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: execute.url(options),
            method: 'post',
        })
    
    execute.form = executeForm
/**
* @see \App\Http\Controllers\Api\MLPipelineController::status
 * @see app/Http/Controllers/Api/MLPipelineController.php:52
 * @route '/api/ml-pipeline/status'
 */
export const status = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/api/ml-pipeline/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MLPipelineController::status
 * @see app/Http/Controllers/Api/MLPipelineController.php:52
 * @route '/api/ml-pipeline/status'
 */
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MLPipelineController::status
 * @see app/Http/Controllers/Api/MLPipelineController.php:52
 * @route '/api/ml-pipeline/status'
 */
status.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MLPipelineController::status
 * @see app/Http/Controllers/Api/MLPipelineController.php:52
 * @route '/api/ml-pipeline/status'
 */
status.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\MLPipelineController::status
 * @see app/Http/Controllers/Api/MLPipelineController.php:52
 * @route '/api/ml-pipeline/status'
 */
    const statusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: status.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\MLPipelineController::status
 * @see app/Http/Controllers/Api/MLPipelineController.php:52
 * @route '/api/ml-pipeline/status'
 */
        statusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\MLPipelineController::status
 * @see app/Http/Controllers/Api/MLPipelineController.php:52
 * @route '/api/ml-pipeline/status'
 */
        statusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    status.form = statusForm
/**
* @see \App\Http\Controllers\Api\MLPipelineController::statistics
 * @see app/Http/Controllers/Api/MLPipelineController.php:66
 * @route '/api/ml-pipeline/statistics'
 */
export const statistics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

statistics.definition = {
    methods: ["get","head"],
    url: '/api/ml-pipeline/statistics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MLPipelineController::statistics
 * @see app/Http/Controllers/Api/MLPipelineController.php:66
 * @route '/api/ml-pipeline/statistics'
 */
statistics.url = (options?: RouteQueryOptions) => {
    return statistics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MLPipelineController::statistics
 * @see app/Http/Controllers/Api/MLPipelineController.php:66
 * @route '/api/ml-pipeline/statistics'
 */
statistics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MLPipelineController::statistics
 * @see app/Http/Controllers/Api/MLPipelineController.php:66
 * @route '/api/ml-pipeline/statistics'
 */
statistics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statistics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\MLPipelineController::statistics
 * @see app/Http/Controllers/Api/MLPipelineController.php:66
 * @route '/api/ml-pipeline/statistics'
 */
    const statisticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: statistics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\MLPipelineController::statistics
 * @see app/Http/Controllers/Api/MLPipelineController.php:66
 * @route '/api/ml-pipeline/statistics'
 */
        statisticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: statistics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\MLPipelineController::statistics
 * @see app/Http/Controllers/Api/MLPipelineController.php:66
 * @route '/api/ml-pipeline/statistics'
 */
        statisticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: statistics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    statistics.form = statisticsForm
/**
* @see \App\Http\Controllers\Api\MLPipelineController::logs
 * @see app/Http/Controllers/Api/MLPipelineController.php:84
 * @route '/api/ml-pipeline/logs'
 */
export const logs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logs.url(options),
    method: 'get',
})

logs.definition = {
    methods: ["get","head"],
    url: '/api/ml-pipeline/logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MLPipelineController::logs
 * @see app/Http/Controllers/Api/MLPipelineController.php:84
 * @route '/api/ml-pipeline/logs'
 */
logs.url = (options?: RouteQueryOptions) => {
    return logs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MLPipelineController::logs
 * @see app/Http/Controllers/Api/MLPipelineController.php:84
 * @route '/api/ml-pipeline/logs'
 */
logs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logs.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MLPipelineController::logs
 * @see app/Http/Controllers/Api/MLPipelineController.php:84
 * @route '/api/ml-pipeline/logs'
 */
logs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logs.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\MLPipelineController::logs
 * @see app/Http/Controllers/Api/MLPipelineController.php:84
 * @route '/api/ml-pipeline/logs'
 */
    const logsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: logs.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\MLPipelineController::logs
 * @see app/Http/Controllers/Api/MLPipelineController.php:84
 * @route '/api/ml-pipeline/logs'
 */
        logsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: logs.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\MLPipelineController::logs
 * @see app/Http/Controllers/Api/MLPipelineController.php:84
 * @route '/api/ml-pipeline/logs'
 */
        logsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: logs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    logs.form = logsForm
const mlPipeline = {
    execute,
status,
statistics,
logs,
}

export default mlPipeline