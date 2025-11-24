import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::detect
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:118
 * @route '/api/discovery/anomalies/detect'
 */
export const detect = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: detect.url(options),
    method: 'post',
})

detect.definition = {
    methods: ["post"],
    url: '/api/discovery/anomalies/detect',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::detect
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:118
 * @route '/api/discovery/anomalies/detect'
 */
detect.url = (options?: RouteQueryOptions) => {
    return detect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::detect
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:118
 * @route '/api/discovery/anomalies/detect'
 */
detect.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: detect.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::detect
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:118
 * @route '/api/discovery/anomalies/detect'
 */
    const detectForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: detect.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::detect
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:118
 * @route '/api/discovery/anomalies/detect'
 */
        detectForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: detect.url(options),
            method: 'post',
        })
    
    detect.form = detectForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
export const student = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: student.url(args, options),
    method: 'get',
})

student.definition = {
    methods: ["get","head"],
    url: '/api/discovery/anomalies/student/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
student.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return student.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
student.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: student.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
student.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: student.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
    const studentForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: student.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
        studentForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: student.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:132
 * @route '/api/discovery/anomalies/student/{studentId}'
 */
        studentForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: student.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    student.form = studentForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
export const summary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})

summary.definition = {
    methods: ["get","head"],
    url: '/api/discovery/anomalies/summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
summary.url = (options?: RouteQueryOptions) => {
    return summary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
summary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
summary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: summary.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
    const summaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: summary.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
 */
        summaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::summary
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:142
 * @route '/api/discovery/anomalies/summary'
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
const anomalies = {
    detect,
student,
summary,
}

export default anomalies