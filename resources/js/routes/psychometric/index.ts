import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
export const cronbachsAlphas = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cronbachsAlphas.url(args, options),
    method: 'get',
})

cronbachsAlphas.definition = {
    methods: ["get","head"],
    url: '/api/psychometric/test/{testId}/cronbachs-alphas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
cronbachsAlphas.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    testId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testId: args.testId,
                }

    return cronbachsAlphas.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
cronbachsAlphas.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cronbachsAlphas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
cronbachsAlphas.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cronbachsAlphas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
    const cronbachsAlphasForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cronbachsAlphas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
        cronbachsAlphasForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cronbachsAlphas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
        cronbachsAlphasForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cronbachsAlphas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cronbachsAlphas.form = cronbachsAlphasForm
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
export const cronbachsAlpha = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cronbachsAlpha.url(args, options),
    method: 'get',
})

cronbachsAlpha.definition = {
    methods: ["get","head"],
    url: '/api/psychometric/category/{categoryId}/cronbachs-alpha',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
cronbachsAlpha.url = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categoryId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    categoryId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        categoryId: args.categoryId,
                }

    return cronbachsAlpha.definition.url
            .replace('{categoryId}', parsedArgs.categoryId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
cronbachsAlpha.get = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cronbachsAlpha.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
cronbachsAlpha.head = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cronbachsAlpha.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
    const cronbachsAlphaForm = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cronbachsAlpha.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
        cronbachsAlphaForm.get = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cronbachsAlpha.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::cronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
        cronbachsAlphaForm.head = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cronbachsAlpha.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cronbachsAlpha.form = cronbachsAlphaForm
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
export const correlationMatrix = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correlationMatrix.url(args, options),
    method: 'get',
})

correlationMatrix.definition = {
    methods: ["get","head"],
    url: '/api/psychometric/test/{testId}/correlation-matrix',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
correlationMatrix.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    testId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testId: args.testId,
                }

    return correlationMatrix.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
correlationMatrix.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correlationMatrix.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
correlationMatrix.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: correlationMatrix.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
    const correlationMatrixForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: correlationMatrix.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
        correlationMatrixForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: correlationMatrix.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
        correlationMatrixForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: correlationMatrix.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    correlationMatrix.form = correlationMatrixForm
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
export const correlation = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correlation.url(args, options),
    method: 'get',
})

correlation.definition = {
    methods: ["get","head"],
    url: '/api/psychometric/correlation/{cat1Id}/{cat2Id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
correlation.url = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cat1Id: args[0],
                    cat2Id: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cat1Id: args.cat1Id,
                                cat2Id: args.cat2Id,
                }

    return correlation.definition.url
            .replace('{cat1Id}', parsedArgs.cat1Id.toString())
            .replace('{cat2Id}', parsedArgs.cat2Id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
correlation.get = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correlation.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
correlation.head = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: correlation.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
    const correlationForm = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: correlation.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
        correlationForm.get = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: correlation.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::correlation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
        correlationForm.head = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: correlation.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    correlation.form = correlationForm
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::descriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
export const descriptives = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descriptives.url(args, options),
    method: 'get',
})

descriptives.definition = {
    methods: ["get","head"],
    url: '/api/psychometric/category/{categoryId}/descriptives',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::descriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
descriptives.url = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categoryId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    categoryId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        categoryId: args.categoryId,
                }

    return descriptives.definition.url
            .replace('{categoryId}', parsedArgs.categoryId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::descriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
descriptives.get = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descriptives.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::descriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
descriptives.head = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descriptives.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::descriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
    const descriptivesForm = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descriptives.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::descriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
        descriptivesForm.get = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descriptives.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::descriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
        descriptivesForm.head = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descriptives.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descriptives.form = descriptivesForm
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::fullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
export const fullReport = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fullReport.url(args, options),
    method: 'get',
})

fullReport.definition = {
    methods: ["get","head"],
    url: '/api/psychometric/test/{testId}/full-report',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::fullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
fullReport.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    testId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testId: args.testId,
                }

    return fullReport.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::fullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
fullReport.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fullReport.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::fullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
fullReport.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fullReport.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::fullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
    const fullReportForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: fullReport.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::fullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
        fullReportForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: fullReport.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::fullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
        fullReportForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: fullReport.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    fullReport.form = fullReportForm
const psychometric = {
    cronbachsAlphas,
cronbachsAlpha,
correlationMatrix,
correlation,
descriptives,
fullReport,
}

export default psychometric