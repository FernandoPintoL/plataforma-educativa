import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AgentController::synthesize
 * @see app/Http/Controllers/Api/AgentController.php:42
 * @route '/api/agent/synthesize/{studentId}'
 */
export const synthesize = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: synthesize.url(args, options),
    method: 'post',
})

synthesize.definition = {
    methods: ["post"],
    url: '/api/agent/synthesize/{studentId}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AgentController::synthesize
 * @see app/Http/Controllers/Api/AgentController.php:42
 * @route '/api/agent/synthesize/{studentId}'
 */
synthesize.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return synthesize.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgentController::synthesize
 * @see app/Http/Controllers/Api/AgentController.php:42
 * @route '/api/agent/synthesize/{studentId}'
 */
synthesize.post = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: synthesize.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AgentController::synthesize
 * @see app/Http/Controllers/Api/AgentController.php:42
 * @route '/api/agent/synthesize/{studentId}'
 */
    const synthesizeForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: synthesize.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AgentController::synthesize
 * @see app/Http/Controllers/Api/AgentController.php:42
 * @route '/api/agent/synthesize/{studentId}'
 */
        synthesizeForm.post = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: synthesize.url(args, options),
            method: 'post',
        })
    
    synthesize.form = synthesizeForm
/**
* @see \App\Http\Controllers\Api\AgentController::reasoning
 * @see app/Http/Controllers/Api/AgentController.php:98
 * @route '/api/agent/reasoning/{studentId}'
 */
export const reasoning = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reasoning.url(args, options),
    method: 'get',
})

reasoning.definition = {
    methods: ["get","head"],
    url: '/api/agent/reasoning/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AgentController::reasoning
 * @see app/Http/Controllers/Api/AgentController.php:98
 * @route '/api/agent/reasoning/{studentId}'
 */
reasoning.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return reasoning.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgentController::reasoning
 * @see app/Http/Controllers/Api/AgentController.php:98
 * @route '/api/agent/reasoning/{studentId}'
 */
reasoning.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reasoning.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AgentController::reasoning
 * @see app/Http/Controllers/Api/AgentController.php:98
 * @route '/api/agent/reasoning/{studentId}'
 */
reasoning.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reasoning.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AgentController::reasoning
 * @see app/Http/Controllers/Api/AgentController.php:98
 * @route '/api/agent/reasoning/{studentId}'
 */
    const reasoningForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reasoning.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AgentController::reasoning
 * @see app/Http/Controllers/Api/AgentController.php:98
 * @route '/api/agent/reasoning/{studentId}'
 */
        reasoningForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reasoning.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AgentController::reasoning
 * @see app/Http/Controllers/Api/AgentController.php:98
 * @route '/api/agent/reasoning/{studentId}'
 */
        reasoningForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reasoning.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reasoning.form = reasoningForm
/**
* @see \App\Http\Controllers\Api\AgentController::intervention
 * @see app/Http/Controllers/Api/AgentController.php:149
 * @route '/api/agent/intervention/{studentId}'
 */
export const intervention = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: intervention.url(args, options),
    method: 'post',
})

intervention.definition = {
    methods: ["post"],
    url: '/api/agent/intervention/{studentId}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AgentController::intervention
 * @see app/Http/Controllers/Api/AgentController.php:149
 * @route '/api/agent/intervention/{studentId}'
 */
intervention.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return intervention.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgentController::intervention
 * @see app/Http/Controllers/Api/AgentController.php:149
 * @route '/api/agent/intervention/{studentId}'
 */
intervention.post = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: intervention.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AgentController::intervention
 * @see app/Http/Controllers/Api/AgentController.php:149
 * @route '/api/agent/intervention/{studentId}'
 */
    const interventionForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: intervention.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AgentController::intervention
 * @see app/Http/Controllers/Api/AgentController.php:149
 * @route '/api/agent/intervention/{studentId}'
 */
        interventionForm.post = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: intervention.url(args, options),
            method: 'post',
        })
    
    intervention.form = interventionForm
/**
* @see \App\Http\Controllers\Api\AgentController::completeAnalysis
 * @see app/Http/Controllers/Api/AgentController.php:249
 * @route '/api/agent/complete-analysis/{studentId}'
 */
export const completeAnalysis = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeAnalysis.url(args, options),
    method: 'post',
})

completeAnalysis.definition = {
    methods: ["post"],
    url: '/api/agent/complete-analysis/{studentId}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AgentController::completeAnalysis
 * @see app/Http/Controllers/Api/AgentController.php:249
 * @route '/api/agent/complete-analysis/{studentId}'
 */
completeAnalysis.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return completeAnalysis.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgentController::completeAnalysis
 * @see app/Http/Controllers/Api/AgentController.php:249
 * @route '/api/agent/complete-analysis/{studentId}'
 */
completeAnalysis.post = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeAnalysis.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AgentController::completeAnalysis
 * @see app/Http/Controllers/Api/AgentController.php:249
 * @route '/api/agent/complete-analysis/{studentId}'
 */
    const completeAnalysisForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: completeAnalysis.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AgentController::completeAnalysis
 * @see app/Http/Controllers/Api/AgentController.php:249
 * @route '/api/agent/complete-analysis/{studentId}'
 */
        completeAnalysisForm.post = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: completeAnalysis.url(args, options),
            method: 'post',
        })
    
    completeAnalysis.form = completeAnalysisForm
/**
* @see \App\Http\Controllers\Api\AgentController::health
 * @see app/Http/Controllers/Api/AgentController.php:199
 * @route '/api/agent/health'
 */
export const health = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})

health.definition = {
    methods: ["get","head"],
    url: '/api/agent/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AgentController::health
 * @see app/Http/Controllers/Api/AgentController.php:199
 * @route '/api/agent/health'
 */
health.url = (options?: RouteQueryOptions) => {
    return health.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgentController::health
 * @see app/Http/Controllers/Api/AgentController.php:199
 * @route '/api/agent/health'
 */
health.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AgentController::health
 * @see app/Http/Controllers/Api/AgentController.php:199
 * @route '/api/agent/health'
 */
health.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: health.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AgentController::health
 * @see app/Http/Controllers/Api/AgentController.php:199
 * @route '/api/agent/health'
 */
    const healthForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: health.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AgentController::health
 * @see app/Http/Controllers/Api/AgentController.php:199
 * @route '/api/agent/health'
 */
        healthForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: health.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AgentController::health
 * @see app/Http/Controllers/Api/AgentController.php:199
 * @route '/api/agent/health'
 */
        healthForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: health.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    health.form = healthForm
/**
* @see \App\Http\Controllers\Api\AgentController::info
 * @see app/Http/Controllers/Api/AgentController.php:223
 * @route '/api/agent/info'
 */
export const info = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: info.url(options),
    method: 'get',
})

info.definition = {
    methods: ["get","head"],
    url: '/api/agent/info',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AgentController::info
 * @see app/Http/Controllers/Api/AgentController.php:223
 * @route '/api/agent/info'
 */
info.url = (options?: RouteQueryOptions) => {
    return info.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgentController::info
 * @see app/Http/Controllers/Api/AgentController.php:223
 * @route '/api/agent/info'
 */
info.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: info.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AgentController::info
 * @see app/Http/Controllers/Api/AgentController.php:223
 * @route '/api/agent/info'
 */
info.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: info.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AgentController::info
 * @see app/Http/Controllers/Api/AgentController.php:223
 * @route '/api/agent/info'
 */
    const infoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: info.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AgentController::info
 * @see app/Http/Controllers/Api/AgentController.php:223
 * @route '/api/agent/info'
 */
        infoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: info.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AgentController::info
 * @see app/Http/Controllers/Api/AgentController.php:223
 * @route '/api/agent/info'
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
* @see \App\Http\Controllers\Api\AgentController::test
 * @see app/Http/Controllers/Api/AgentController.php:319
 * @route '/api/agent/test'
 */
export const test = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test.url(options),
    method: 'get',
})

test.definition = {
    methods: ["get","head"],
    url: '/api/agent/test',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AgentController::test
 * @see app/Http/Controllers/Api/AgentController.php:319
 * @route '/api/agent/test'
 */
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgentController::test
 * @see app/Http/Controllers/Api/AgentController.php:319
 * @route '/api/agent/test'
 */
test.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AgentController::test
 * @see app/Http/Controllers/Api/AgentController.php:319
 * @route '/api/agent/test'
 */
test.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: test.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AgentController::test
 * @see app/Http/Controllers/Api/AgentController.php:319
 * @route '/api/agent/test'
 */
    const testForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: test.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AgentController::test
 * @see app/Http/Controllers/Api/AgentController.php:319
 * @route '/api/agent/test'
 */
        testForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: test.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AgentController::test
 * @see app/Http/Controllers/Api/AgentController.php:319
 * @route '/api/agent/test'
 */
        testForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: test.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    test.form = testForm
const AgentController = { synthesize, reasoning, intervention, completeAnalysis, health, info, test }

export default AgentController