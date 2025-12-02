import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::riasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
export const riasecScores = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riasecScores.url(args, options),
    method: 'get',
})

riasecScores.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/riasec-scores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::riasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
riasecScores.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return riasecScores.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::riasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
riasecScores.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riasecScores.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::riasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
riasecScores.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: riasecScores.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::riasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
    const riasecScoresForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: riasecScores.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::riasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
        riasecScoresForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riasecScores.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::riasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
        riasecScoresForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riasecScores.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    riasecScores.form = riasecScoresForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
export const supervisedDataset = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: supervisedDataset.url(args, options),
    method: 'get',
})

supervisedDataset.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/supervised-dataset',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
supervisedDataset.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return supervisedDataset.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
supervisedDataset.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: supervisedDataset.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
supervisedDataset.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: supervisedDataset.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
    const supervisedDatasetForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: supervisedDataset.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
        supervisedDatasetForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: supervisedDataset.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
        supervisedDatasetForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: supervisedDataset.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    supervisedDataset.form = supervisedDatasetForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::unsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
export const unsupervisedDataset = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unsupervisedDataset.url(args, options),
    method: 'get',
})

unsupervisedDataset.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/unsupervised-dataset',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::unsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
unsupervisedDataset.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return unsupervisedDataset.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::unsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
unsupervisedDataset.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unsupervisedDataset.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::unsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
unsupervisedDataset.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unsupervisedDataset.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::unsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
    const unsupervisedDatasetForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: unsupervisedDataset.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::unsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
        unsupervisedDatasetForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: unsupervisedDataset.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::unsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
        unsupervisedDatasetForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: unsupervisedDataset.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    unsupervisedDataset.form = unsupervisedDatasetForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
export const exportSupervised = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportSupervised.url(args, options),
    method: 'get',
})

exportSupervised.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/export/supervised',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
exportSupervised.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return exportSupervised.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
exportSupervised.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportSupervised.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
exportSupervised.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportSupervised.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
    const exportSupervisedForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportSupervised.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
        exportSupervisedForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportSupervised.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
        exportSupervisedForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportSupervised.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportSupervised.form = exportSupervisedForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
export const exportUnsupervised = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportUnsupervised.url(args, options),
    method: 'get',
})

exportUnsupervised.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/export/unsupervised',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
exportUnsupervised.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return exportUnsupervised.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
exportUnsupervised.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportUnsupervised.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
exportUnsupervised.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportUnsupervised.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
    const exportUnsupervisedForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportUnsupervised.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
        exportUnsupervisedForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportUnsupervised.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervised
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
        exportUnsupervisedForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportUnsupervised.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportUnsupervised.form = exportUnsupervisedForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
export const supervisedStatistics = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: supervisedStatistics.url(args, options),
    method: 'get',
})

supervisedStatistics.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/supervised-dataset/statistics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
supervisedStatistics.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return supervisedStatistics.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
supervisedStatistics.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: supervisedStatistics.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
supervisedStatistics.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: supervisedStatistics.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
    const supervisedStatisticsForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: supervisedStatistics.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
        supervisedStatisticsForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: supervisedStatistics.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::supervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
        supervisedStatisticsForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: supervisedStatistics.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    supervisedStatistics.form = supervisedStatisticsForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::featureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
export const featureImportance = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: featureImportance.url(args, options),
    method: 'get',
})

featureImportance.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/feature-importance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::featureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
featureImportance.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return featureImportance.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::featureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
featureImportance.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: featureImportance.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::featureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
featureImportance.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: featureImportance.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::featureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
    const featureImportanceForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: featureImportance.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::featureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
        featureImportanceForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: featureImportance.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::featureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
        featureImportanceForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: featureImportance.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    featureImportance.form = featureImportanceForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::trainTestSplit
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:185
 * @route '/api/ml-data/test/{testId}/train-test-split'
 */
export const trainTestSplit = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: trainTestSplit.url(args, options),
    method: 'post',
})

trainTestSplit.definition = {
    methods: ["post"],
    url: '/api/ml-data/test/{testId}/train-test-split',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::trainTestSplit
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:185
 * @route '/api/ml-data/test/{testId}/train-test-split'
 */
trainTestSplit.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return trainTestSplit.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::trainTestSplit
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:185
 * @route '/api/ml-data/test/{testId}/train-test-split'
 */
trainTestSplit.post = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: trainTestSplit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::trainTestSplit
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:185
 * @route '/api/ml-data/test/{testId}/train-test-split'
 */
    const trainTestSplitForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: trainTestSplit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::trainTestSplit
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:185
 * @route '/api/ml-data/test/{testId}/train-test-split'
 */
        trainTestSplitForm.post = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: trainTestSplit.url(args, options),
            method: 'post',
        })
    
    trainTestSplit.form = trainTestSplitForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::summary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
export const summary = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(args, options),
    method: 'get',
})

summary.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::summary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
summary.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return summary.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::summary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
summary.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::summary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
summary.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: summary.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::summary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
    const summaryForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: summary.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::summary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
        summaryForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::summary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
        summaryForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    summary.form = summaryForm
const mlData = {
    riasecScores,
supervisedDataset,
unsupervisedDataset,
exportSupervised,
exportUnsupervised,
supervisedStatistics,
featureImportance,
trainTestSplit,
summary,
}

export default mlData