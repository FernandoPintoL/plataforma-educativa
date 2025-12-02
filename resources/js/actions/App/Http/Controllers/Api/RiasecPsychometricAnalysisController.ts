import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
export const getCronbachsAlphas = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCronbachsAlphas.url(args, options),
    method: 'get',
})

getCronbachsAlphas.definition = {
    methods: ["get","head"],
    url: '/api/psychometric/test/{testId}/cronbachs-alphas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
getCronbachsAlphas.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getCronbachsAlphas.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
getCronbachsAlphas.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCronbachsAlphas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
getCronbachsAlphas.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCronbachsAlphas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
    const getCronbachsAlphasForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getCronbachsAlphas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
        getCronbachsAlphasForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCronbachsAlphas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlphas
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:26
 * @route '/api/psychometric/test/{testId}/cronbachs-alphas'
 */
        getCronbachsAlphasForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCronbachsAlphas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getCronbachsAlphas.form = getCronbachsAlphasForm
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
export const getCronbachsAlpha = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCronbachsAlpha.url(args, options),
    method: 'get',
})

getCronbachsAlpha.definition = {
    methods: ["get","head"],
    url: '/api/psychometric/category/{categoryId}/cronbachs-alpha',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
getCronbachsAlpha.url = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getCronbachsAlpha.definition.url
            .replace('{categoryId}', parsedArgs.categoryId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
getCronbachsAlpha.get = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCronbachsAlpha.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
getCronbachsAlpha.head = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCronbachsAlpha.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
    const getCronbachsAlphaForm = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getCronbachsAlpha.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
        getCronbachsAlphaForm.get = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCronbachsAlpha.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCronbachsAlpha
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:47
 * @route '/api/psychometric/category/{categoryId}/cronbachs-alpha'
 */
        getCronbachsAlphaForm.head = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCronbachsAlpha.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getCronbachsAlpha.form = getCronbachsAlphaForm
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
export const getCorrelationMatrix = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCorrelationMatrix.url(args, options),
    method: 'get',
})

getCorrelationMatrix.definition = {
    methods: ["get","head"],
    url: '/api/psychometric/test/{testId}/correlation-matrix',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
getCorrelationMatrix.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getCorrelationMatrix.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
getCorrelationMatrix.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCorrelationMatrix.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
getCorrelationMatrix.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCorrelationMatrix.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
    const getCorrelationMatrixForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getCorrelationMatrix.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
        getCorrelationMatrixForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCorrelationMatrix.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelationMatrix
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:76
 * @route '/api/psychometric/test/{testId}/correlation-matrix'
 */
        getCorrelationMatrixForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCorrelationMatrix.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getCorrelationMatrix.form = getCorrelationMatrixForm
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
export const getCorrelation = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCorrelation.url(args, options),
    method: 'get',
})

getCorrelation.definition = {
    methods: ["get","head"],
    url: '/api/psychometric/correlation/{cat1Id}/{cat2Id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
getCorrelation.url = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions) => {
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

    return getCorrelation.definition.url
            .replace('{cat1Id}', parsedArgs.cat1Id.toString())
            .replace('{cat2Id}', parsedArgs.cat2Id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
getCorrelation.get = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCorrelation.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
getCorrelation.head = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCorrelation.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
    const getCorrelationForm = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getCorrelation.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
        getCorrelationForm.get = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCorrelation.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getCorrelation
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:97
 * @route '/api/psychometric/correlation/{cat1Id}/{cat2Id}'
 */
        getCorrelationForm.head = (args: { cat1Id: string | number, cat2Id: string | number } | [cat1Id: string | number, cat2Id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCorrelation.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getCorrelation.form = getCorrelationForm
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getDimensionDescriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
export const getDimensionDescriptives = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDimensionDescriptives.url(args, options),
    method: 'get',
})

getDimensionDescriptives.definition = {
    methods: ["get","head"],
    url: '/api/psychometric/category/{categoryId}/descriptives',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getDimensionDescriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
getDimensionDescriptives.url = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getDimensionDescriptives.definition.url
            .replace('{categoryId}', parsedArgs.categoryId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getDimensionDescriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
getDimensionDescriptives.get = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDimensionDescriptives.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getDimensionDescriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
getDimensionDescriptives.head = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDimensionDescriptives.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getDimensionDescriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
    const getDimensionDescriptivesForm = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getDimensionDescriptives.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getDimensionDescriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
        getDimensionDescriptivesForm.get = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDimensionDescriptives.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getDimensionDescriptives
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:126
 * @route '/api/psychometric/category/{categoryId}/descriptives'
 */
        getDimensionDescriptivesForm.head = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDimensionDescriptives.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getDimensionDescriptives.form = getDimensionDescriptivesForm
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getFullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
export const getFullReport = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFullReport.url(args, options),
    method: 'get',
})

getFullReport.definition = {
    methods: ["get","head"],
    url: '/api/psychometric/test/{testId}/full-report',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getFullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
getFullReport.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getFullReport.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getFullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
getFullReport.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFullReport.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getFullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
getFullReport.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getFullReport.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getFullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
    const getFullReportForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getFullReport.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getFullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
        getFullReportForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getFullReport.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecPsychometricAnalysisController::getFullReport
 * @see app/Http/Controllers/Api/RiasecPsychometricAnalysisController.php:155
 * @route '/api/psychometric/test/{testId}/full-report'
 */
        getFullReportForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getFullReport.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getFullReport.form = getFullReportForm
const RiasecPsychometricAnalysisController = { getCronbachsAlphas, getCronbachsAlpha, getCorrelationMatrix, getCorrelation, getDimensionDescriptives, getFullReport }

export default RiasecPsychometricAnalysisController