import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getRiasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
export const getRiasecScores = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRiasecScores.url(args, options),
    method: 'get',
})

getRiasecScores.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/riasec-scores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getRiasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
getRiasecScores.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getRiasecScores.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getRiasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
getRiasecScores.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRiasecScores.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getRiasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
getRiasecScores.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRiasecScores.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getRiasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
    const getRiasecScoresForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getRiasecScores.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getRiasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
        getRiasecScoresForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRiasecScores.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getRiasecScores
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:26
 * @route '/api/ml-data/test/{testId}/riasec-scores'
 */
        getRiasecScoresForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRiasecScores.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getRiasecScores.form = getRiasecScoresForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
export const getSupervisedDataset = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSupervisedDataset.url(args, options),
    method: 'get',
})

getSupervisedDataset.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/supervised-dataset',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
getSupervisedDataset.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getSupervisedDataset.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
getSupervisedDataset.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSupervisedDataset.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
getSupervisedDataset.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getSupervisedDataset.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
    const getSupervisedDatasetForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getSupervisedDataset.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
        getSupervisedDatasetForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSupervisedDataset.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:49
 * @route '/api/ml-data/test/{testId}/supervised-dataset'
 */
        getSupervisedDatasetForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSupervisedDataset.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getSupervisedDataset.form = getSupervisedDatasetForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getUnsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
export const getUnsupervisedDataset = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUnsupervisedDataset.url(args, options),
    method: 'get',
})

getUnsupervisedDataset.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/unsupervised-dataset',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getUnsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
getUnsupervisedDataset.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getUnsupervisedDataset.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getUnsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
getUnsupervisedDataset.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUnsupervisedDataset.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getUnsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
getUnsupervisedDataset.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getUnsupervisedDataset.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getUnsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
    const getUnsupervisedDatasetForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getUnsupervisedDataset.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getUnsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
        getUnsupervisedDatasetForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getUnsupervisedDataset.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getUnsupervisedDataset
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:72
 * @route '/api/ml-data/test/{testId}/unsupervised-dataset'
 */
        getUnsupervisedDatasetForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getUnsupervisedDataset.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getUnsupervisedDataset.form = getUnsupervisedDatasetForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
export const exportSupervisedCsv = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportSupervisedCsv.url(args, options),
    method: 'get',
})

exportSupervisedCsv.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/export/supervised',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
exportSupervisedCsv.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return exportSupervisedCsv.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
exportSupervisedCsv.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportSupervisedCsv.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
exportSupervisedCsv.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportSupervisedCsv.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
    const exportSupervisedCsvForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportSupervisedCsv.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
        exportSupervisedCsvForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportSupervisedCsv.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportSupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:95
 * @route '/api/ml-data/test/{testId}/export/supervised'
 */
        exportSupervisedCsvForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportSupervisedCsv.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportSupervisedCsv.form = exportSupervisedCsvForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
export const exportUnsupervisedCsv = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportUnsupervisedCsv.url(args, options),
    method: 'get',
})

exportUnsupervisedCsv.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/export/unsupervised',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
exportUnsupervisedCsv.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return exportUnsupervisedCsv.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
exportUnsupervisedCsv.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportUnsupervisedCsv.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
exportUnsupervisedCsv.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportUnsupervisedCsv.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
    const exportUnsupervisedCsvForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportUnsupervisedCsv.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
        exportUnsupervisedCsvForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportUnsupervisedCsv.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::exportUnsupervisedCsv
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:117
 * @route '/api/ml-data/test/{testId}/export/unsupervised'
 */
        exportUnsupervisedCsvForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportUnsupervisedCsv.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportUnsupervisedCsv.form = exportUnsupervisedCsvForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
export const getSupervisedStatistics = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSupervisedStatistics.url(args, options),
    method: 'get',
})

getSupervisedStatistics.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/supervised-dataset/statistics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
getSupervisedStatistics.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getSupervisedStatistics.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
getSupervisedStatistics.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSupervisedStatistics.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
getSupervisedStatistics.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getSupervisedStatistics.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
    const getSupervisedStatisticsForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getSupervisedStatistics.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
        getSupervisedStatisticsForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSupervisedStatistics.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getSupervisedStatistics
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:139
 * @route '/api/ml-data/test/{testId}/supervised-dataset/statistics'
 */
        getSupervisedStatisticsForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSupervisedStatistics.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getSupervisedStatistics.form = getSupervisedStatisticsForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getFeatureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
export const getFeatureImportance = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFeatureImportance.url(args, options),
    method: 'get',
})

getFeatureImportance.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/feature-importance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getFeatureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
getFeatureImportance.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getFeatureImportance.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getFeatureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
getFeatureImportance.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFeatureImportance.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getFeatureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
getFeatureImportance.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getFeatureImportance.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getFeatureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
    const getFeatureImportanceForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getFeatureImportance.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getFeatureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
        getFeatureImportanceForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getFeatureImportance.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getFeatureImportance
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:162
 * @route '/api/ml-data/test/{testId}/feature-importance'
 */
        getFeatureImportanceForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getFeatureImportance.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getFeatureImportance.form = getFeatureImportanceForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::createTrainTestSplit
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:185
 * @route '/api/ml-data/test/{testId}/train-test-split'
 */
export const createTrainTestSplit = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createTrainTestSplit.url(args, options),
    method: 'post',
})

createTrainTestSplit.definition = {
    methods: ["post"],
    url: '/api/ml-data/test/{testId}/train-test-split',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::createTrainTestSplit
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:185
 * @route '/api/ml-data/test/{testId}/train-test-split'
 */
createTrainTestSplit.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return createTrainTestSplit.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::createTrainTestSplit
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:185
 * @route '/api/ml-data/test/{testId}/train-test-split'
 */
createTrainTestSplit.post = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createTrainTestSplit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::createTrainTestSplit
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:185
 * @route '/api/ml-data/test/{testId}/train-test-split'
 */
    const createTrainTestSplitForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createTrainTestSplit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::createTrainTestSplit
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:185
 * @route '/api/ml-data/test/{testId}/train-test-split'
 */
        createTrainTestSplitForm.post = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createTrainTestSplit.url(args, options),
            method: 'post',
        })
    
    createTrainTestSplit.form = createTrainTestSplitForm
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getMlDataSummary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
export const getMlDataSummary = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMlDataSummary.url(args, options),
    method: 'get',
})

getMlDataSummary.definition = {
    methods: ["get","head"],
    url: '/api/ml-data/test/{testId}/summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getMlDataSummary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
getMlDataSummary.url = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getMlDataSummary.definition.url
            .replace('{testId}', parsedArgs.testId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getMlDataSummary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
getMlDataSummary.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMlDataSummary.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getMlDataSummary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
getMlDataSummary.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getMlDataSummary.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getMlDataSummary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
    const getMlDataSummaryForm = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getMlDataSummary.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getMlDataSummary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
        getMlDataSummaryForm.get = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMlDataSummary.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RiasecMLDataController::getMlDataSummary
 * @see app/Http/Controllers/Api/RiasecMLDataController.php:224
 * @route '/api/ml-data/test/{testId}/summary'
 */
        getMlDataSummaryForm.head = (args: { testId: string | number } | [testId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMlDataSummary.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getMlDataSummary.form = getMlDataSummaryForm
const RiasecMLDataController = { getRiasecScores, getSupervisedDataset, getUnsupervisedDataset, exportSupervisedCsv, exportUnsupervisedCsv, getSupervisedStatistics, getFeatureImportance, createTrainTestSplit, getMlDataSummary }

export default RiasecMLDataController