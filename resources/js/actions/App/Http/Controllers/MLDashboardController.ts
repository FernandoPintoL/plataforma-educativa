import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MLDashboardController::predictStudent
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
export const predictStudent = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: predictStudent.url(args, options),
    method: 'get',
})

predictStudent.definition = {
    methods: ["get","head"],
    url: '/api/ml/predict/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::predictStudent
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
predictStudent.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return predictStudent.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::predictStudent
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
predictStudent.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: predictStudent.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::predictStudent
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
predictStudent.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: predictStudent.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::predictStudent
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
    const predictStudentForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: predictStudent.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::predictStudent
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
        predictStudentForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: predictStudent.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::predictStudent
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
        predictStudentForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: predictStudent.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    predictStudent.form = predictStudentForm
/**
* @see \App\Http\Controllers\MLDashboardController::recordFeedback
 * @see app/Http/Controllers/MLDashboardController.php:73
 * @route '/api/ml/feedback'
 */
export const recordFeedback = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordFeedback.url(options),
    method: 'post',
})

recordFeedback.definition = {
    methods: ["post"],
    url: '/api/ml/feedback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MLDashboardController::recordFeedback
 * @see app/Http/Controllers/MLDashboardController.php:73
 * @route '/api/ml/feedback'
 */
recordFeedback.url = (options?: RouteQueryOptions) => {
    return recordFeedback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::recordFeedback
 * @see app/Http/Controllers/MLDashboardController.php:73
 * @route '/api/ml/feedback'
 */
recordFeedback.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordFeedback.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::recordFeedback
 * @see app/Http/Controllers/MLDashboardController.php:73
 * @route '/api/ml/feedback'
 */
    const recordFeedbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: recordFeedback.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::recordFeedback
 * @see app/Http/Controllers/MLDashboardController.php:73
 * @route '/api/ml/feedback'
 */
        recordFeedbackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: recordFeedback.url(options),
            method: 'post',
        })
    
    recordFeedback.form = recordFeedbackForm
/**
* @see \App\Http\Controllers\MLDashboardController::getDashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
export const getDashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDashboard.url(options),
    method: 'get',
})

getDashboard.definition = {
    methods: ["get","head"],
    url: '/api/ml/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::getDashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
getDashboard.url = (options?: RouteQueryOptions) => {
    return getDashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::getDashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
getDashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::getDashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
getDashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::getDashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
    const getDashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getDashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::getDashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
        getDashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::getDashboard
 * @see app/Http/Controllers/MLDashboardController.php:117
 * @route '/api/ml/dashboard'
 */
        getDashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getDashboard.form = getDashboardForm
/**
* @see \App\Http\Controllers\MLDashboardController::getMetrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
export const getMetrics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMetrics.url(options),
    method: 'get',
})

getMetrics.definition = {
    methods: ["get","head"],
    url: '/api/ml/metrics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::getMetrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
getMetrics.url = (options?: RouteQueryOptions) => {
    return getMetrics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::getMetrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
getMetrics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMetrics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::getMetrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
getMetrics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getMetrics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::getMetrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
    const getMetricsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getMetrics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::getMetrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
        getMetricsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMetrics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::getMetrics
 * @see app/Http/Controllers/MLDashboardController.php:145
 * @route '/api/ml/metrics'
 */
        getMetricsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMetrics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getMetrics.form = getMetricsForm
/**
* @see \App\Http\Controllers\MLDashboardController::getReviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
export const getReviewQueue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getReviewQueue.url(options),
    method: 'get',
})

getReviewQueue.definition = {
    methods: ["get","head"],
    url: '/api/ml/review-queue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::getReviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
getReviewQueue.url = (options?: RouteQueryOptions) => {
    return getReviewQueue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::getReviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
getReviewQueue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getReviewQueue.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::getReviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
getReviewQueue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getReviewQueue.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::getReviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
    const getReviewQueueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getReviewQueue.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::getReviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
        getReviewQueueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getReviewQueue.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::getReviewQueue
 * @see app/Http/Controllers/MLDashboardController.php:180
 * @route '/api/ml/review-queue'
 */
        getReviewQueueForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getReviewQueue.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getReviewQueue.form = getReviewQueueForm
/**
* @see \App\Http\Controllers\MLDashboardController::getPendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
export const getPendingFeedback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPendingFeedback.url(options),
    method: 'get',
})

getPendingFeedback.definition = {
    methods: ["get","head"],
    url: '/api/ml/pending-feedback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::getPendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
getPendingFeedback.url = (options?: RouteQueryOptions) => {
    return getPendingFeedback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::getPendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
getPendingFeedback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPendingFeedback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::getPendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
getPendingFeedback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPendingFeedback.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::getPendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
    const getPendingFeedbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPendingFeedback.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::getPendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
        getPendingFeedbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPendingFeedback.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::getPendingFeedback
 * @see app/Http/Controllers/MLDashboardController.php:211
 * @route '/api/ml/pending-feedback'
 */
        getPendingFeedbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPendingFeedback.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getPendingFeedback.form = getPendingFeedbackForm
/**
* @see \App\Http\Controllers\MLDashboardController::checkDegradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
export const checkDegradation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkDegradation.url(options),
    method: 'get',
})

checkDegradation.definition = {
    methods: ["get","head"],
    url: '/api/ml/degradation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::checkDegradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
checkDegradation.url = (options?: RouteQueryOptions) => {
    return checkDegradation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::checkDegradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
checkDegradation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkDegradation.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::checkDegradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
checkDegradation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkDegradation.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::checkDegradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
    const checkDegradationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkDegradation.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::checkDegradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
        checkDegradationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkDegradation.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::checkDegradation
 * @see app/Http/Controllers/MLDashboardController.php:246
 * @route '/api/ml/degradation'
 */
        checkDegradationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkDegradation.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkDegradation.form = checkDegradationForm
/**
* @see \App\Http\Controllers\MLDashboardController::getStudentRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
export const getStudentRiskReport = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStudentRiskReport.url(args, options),
    method: 'get',
})

getStudentRiskReport.definition = {
    methods: ["get","head"],
    url: '/api/ml/reports/student/{studentId}/risk',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::getStudentRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
getStudentRiskReport.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getStudentRiskReport.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::getStudentRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
getStudentRiskReport.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStudentRiskReport.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::getStudentRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
getStudentRiskReport.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStudentRiskReport.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::getStudentRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
    const getStudentRiskReportForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getStudentRiskReport.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::getStudentRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
        getStudentRiskReportForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStudentRiskReport.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::getStudentRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
        getStudentRiskReportForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStudentRiskReport.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getStudentRiskReport.form = getStudentRiskReportForm
/**
* @see \App\Http\Controllers\MLDashboardController::getInstitutionalRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
export const getInstitutionalRiskReport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getInstitutionalRiskReport.url(options),
    method: 'get',
})

getInstitutionalRiskReport.definition = {
    methods: ["get","head"],
    url: '/api/ml/reports/institutional/risk',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::getInstitutionalRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
getInstitutionalRiskReport.url = (options?: RouteQueryOptions) => {
    return getInstitutionalRiskReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::getInstitutionalRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
getInstitutionalRiskReport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getInstitutionalRiskReport.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::getInstitutionalRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
getInstitutionalRiskReport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getInstitutionalRiskReport.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::getInstitutionalRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
    const getInstitutionalRiskReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getInstitutionalRiskReport.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::getInstitutionalRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
        getInstitutionalRiskReportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getInstitutionalRiskReport.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::getInstitutionalRiskReport
 * @see app/Http/Controllers/MLDashboardController.php:344
 * @route '/api/ml/reports/institutional/risk'
 */
        getInstitutionalRiskReportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getInstitutionalRiskReport.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getInstitutionalRiskReport.form = getInstitutionalRiskReportForm
/**
* @see \App\Http\Controllers\MLDashboardController::getAnomalyReport
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
export const getAnomalyReport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnomalyReport.url(options),
    method: 'get',
})

getAnomalyReport.definition = {
    methods: ["get","head"],
    url: '/api/ml/reports/anomalies',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::getAnomalyReport
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
getAnomalyReport.url = (options?: RouteQueryOptions) => {
    return getAnomalyReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::getAnomalyReport
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
getAnomalyReport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnomalyReport.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::getAnomalyReport
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
getAnomalyReport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAnomalyReport.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::getAnomalyReport
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
    const getAnomalyReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAnomalyReport.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::getAnomalyReport
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
        getAnomalyReportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnomalyReport.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::getAnomalyReport
 * @see app/Http/Controllers/MLDashboardController.php:427
 * @route '/api/ml/reports/anomalies'
 */
        getAnomalyReportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnomalyReport.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getAnomalyReport.form = getAnomalyReportForm
/**
* @see \App\Http\Controllers\MLDashboardController::getTrendAnalysis
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
export const getTrendAnalysis = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTrendAnalysis.url(options),
    method: 'get',
})

getTrendAnalysis.definition = {
    methods: ["get","head"],
    url: '/api/ml/reports/trends',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::getTrendAnalysis
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
getTrendAnalysis.url = (options?: RouteQueryOptions) => {
    return getTrendAnalysis.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::getTrendAnalysis
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
getTrendAnalysis.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTrendAnalysis.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::getTrendAnalysis
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
getTrendAnalysis.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTrendAnalysis.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::getTrendAnalysis
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
    const getTrendAnalysisForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getTrendAnalysis.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::getTrendAnalysis
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
        getTrendAnalysisForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTrendAnalysis.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::getTrendAnalysis
 * @see app/Http/Controllers/MLDashboardController.php:487
 * @route '/api/ml/reports/trends'
 */
        getTrendAnalysisForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTrendAnalysis.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getTrendAnalysis.form = getTrendAnalysisForm
const MLDashboardController = { predictStudent, recordFeedback, getDashboard, getMetrics, getReviewQueue, getPendingFeedback, checkDegradation, getStudentRiskReport, getInstitutionalRiskReport, getAnomalyReport, getTrendAnalysis }

export default MLDashboardController