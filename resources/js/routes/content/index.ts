import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyze
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:35
 * @route '/api/content/analyze'
 */
export const analyze = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

analyze.definition = {
    methods: ["post"],
    url: '/api/content/analyze',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyze
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:35
 * @route '/api/content/analyze'
 */
analyze.url = (options?: RouteQueryOptions) => {
    return analyze.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyze
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:35
 * @route '/api/content/analyze'
 */
analyze.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyze
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:35
 * @route '/api/content/analyze'
 */
    const analyzeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: analyze.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyze
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:35
 * @route '/api/content/analyze'
 */
        analyzeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: analyze.url(options),
            method: 'post',
        })
    
    analyze.form = analyzeForm
/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyzeEvaluation
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:170
 * @route '/api/content/analyze-evaluation'
 */
export const analyzeEvaluation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyzeEvaluation.url(options),
    method: 'post',
})

analyzeEvaluation.definition = {
    methods: ["post"],
    url: '/api/content/analyze-evaluation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyzeEvaluation
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:170
 * @route '/api/content/analyze-evaluation'
 */
analyzeEvaluation.url = (options?: RouteQueryOptions) => {
    return analyzeEvaluation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyzeEvaluation
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:170
 * @route '/api/content/analyze-evaluation'
 */
analyzeEvaluation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyzeEvaluation.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyzeEvaluation
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:170
 * @route '/api/content/analyze-evaluation'
 */
    const analyzeEvaluationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: analyzeEvaluation.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::analyzeEvaluation
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:170
 * @route '/api/content/analyze-evaluation'
 */
        analyzeEvaluationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: analyzeEvaluation.url(options),
            method: 'post',
        })
    
    analyzeEvaluation.form = analyzeEvaluationForm
/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::generateEvaluation
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:277
 * @route '/api/content/generate-evaluation'
 */
export const generateEvaluation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateEvaluation.url(options),
    method: 'post',
})

generateEvaluation.definition = {
    methods: ["post"],
    url: '/api/content/generate-evaluation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::generateEvaluation
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:277
 * @route '/api/content/generate-evaluation'
 */
generateEvaluation.url = (options?: RouteQueryOptions) => {
    return generateEvaluation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::generateEvaluation
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:277
 * @route '/api/content/generate-evaluation'
 */
generateEvaluation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateEvaluation.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::generateEvaluation
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:277
 * @route '/api/content/generate-evaluation'
 */
    const generateEvaluationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generateEvaluation.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::generateEvaluation
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:277
 * @route '/api/content/generate-evaluation'
 */
        generateEvaluationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generateEvaluation.url(options),
            method: 'post',
        })
    
    generateEvaluation.form = generateEvaluationForm
/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::generateQuestions
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:432
 * @route '/api/content/generate-questions'
 */
export const generateQuestions = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateQuestions.url(options),
    method: 'post',
})

generateQuestions.definition = {
    methods: ["post"],
    url: '/api/content/generate-questions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::generateQuestions
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:432
 * @route '/api/content/generate-questions'
 */
generateQuestions.url = (options?: RouteQueryOptions) => {
    return generateQuestions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::generateQuestions
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:432
 * @route '/api/content/generate-questions'
 */
generateQuestions.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateQuestions.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::generateQuestions
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:432
 * @route '/api/content/generate-questions'
 */
    const generateQuestionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generateQuestions.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::generateQuestions
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:432
 * @route '/api/content/generate-questions'
 */
        generateQuestionsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generateQuestions.url(options),
            method: 'post',
        })
    
    generateQuestions.form = generateQuestionsForm
/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::validateQuestionsCoherence
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:551
 * @route '/api/content/validate-questions-coherence'
 */
export const validateQuestionsCoherence = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validateQuestionsCoherence.url(options),
    method: 'post',
})

validateQuestionsCoherence.definition = {
    methods: ["post"],
    url: '/api/content/validate-questions-coherence',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::validateQuestionsCoherence
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:551
 * @route '/api/content/validate-questions-coherence'
 */
validateQuestionsCoherence.url = (options?: RouteQueryOptions) => {
    return validateQuestionsCoherence.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::validateQuestionsCoherence
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:551
 * @route '/api/content/validate-questions-coherence'
 */
validateQuestionsCoherence.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validateQuestionsCoherence.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::validateQuestionsCoherence
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:551
 * @route '/api/content/validate-questions-coherence'
 */
    const validateQuestionsCoherenceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: validateQuestionsCoherence.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::validateQuestionsCoherence
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:551
 * @route '/api/content/validate-questions-coherence'
 */
        validateQuestionsCoherenceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: validateQuestionsCoherence.url(options),
            method: 'post',
        })
    
    validateQuestionsCoherence.form = validateQuestionsCoherenceForm
/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:603
 * @route '/api/content/health'
 */
export const health = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})

health.definition = {
    methods: ["get","head"],
    url: '/api/content/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:603
 * @route '/api/content/health'
 */
health.url = (options?: RouteQueryOptions) => {
    return health.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:603
 * @route '/api/content/health'
 */
health.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:603
 * @route '/api/content/health'
 */
health.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: health.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:603
 * @route '/api/content/health'
 */
    const healthForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: health.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:603
 * @route '/api/content/health'
 */
        healthForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: health.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ContentAnalysisController::health
 * @see app/Http/Controllers/Api/ContentAnalysisController.php:603
 * @route '/api/content/health'
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
const content = {
    analyze,
analyzeEvaluation,
generateEvaluation,
generateQuestions,
validateQuestionsCoherence,
health,
}

export default content