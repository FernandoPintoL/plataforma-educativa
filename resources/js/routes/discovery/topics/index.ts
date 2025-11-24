import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyze
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:84
 * @route '/api/discovery/topics/analyze'
 */
export const analyze = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

analyze.definition = {
    methods: ["post"],
    url: '/api/discovery/topics/analyze',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyze
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:84
 * @route '/api/discovery/topics/analyze'
 */
analyze.url = (options?: RouteQueryOptions) => {
    return analyze.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyze
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:84
 * @route '/api/discovery/topics/analyze'
 */
analyze.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyze
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:84
 * @route '/api/discovery/topics/analyze'
 */
    const analyzeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: analyze.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::analyze
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:84
 * @route '/api/discovery/topics/analyze'
 */
        analyzeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: analyze.url(options),
            method: 'post',
        })
    
    analyze.form = analyzeForm
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
 */
export const student = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: student.url(args, options),
    method: 'get',
})

student.definition = {
    methods: ["get","head"],
    url: '/api/discovery/topics/student/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
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
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
 */
student.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: student.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
 */
student.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: student.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
 */
    const studentForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: student.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
 */
        studentForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: student.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::student
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:98
 * @route '/api/discovery/topics/student/{studentId}'
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
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::distribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
export const distribution = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: distribution.url(options),
    method: 'get',
})

distribution.definition = {
    methods: ["get","head"],
    url: '/api/discovery/topics/distribution',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::distribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
distribution.url = (options?: RouteQueryOptions) => {
    return distribution.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::distribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
distribution.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: distribution.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::distribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
distribution.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: distribution.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::distribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
    const distributionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: distribution.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::distribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
        distributionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: distribution.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DiscoveryOrchestrationController::distribution
 * @see app/Http/Controllers/Api/DiscoveryOrchestrationController.php:108
 * @route '/api/discovery/topics/distribution'
 */
        distributionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: distribution.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    distribution.form = distributionForm
const topics = {
    analyze,
student,
distribution,
}

export default topics