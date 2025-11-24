import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RecommendationController::myRecommendations
 * @see app/Http/Controllers/RecommendationController.php:44
 * @route '/api/recommendations/my'
 */
export const myRecommendations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myRecommendations.url(options),
    method: 'get',
})

myRecommendations.definition = {
    methods: ["get","head"],
    url: '/api/recommendations/my',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecommendationController::myRecommendations
 * @see app/Http/Controllers/RecommendationController.php:44
 * @route '/api/recommendations/my'
 */
myRecommendations.url = (options?: RouteQueryOptions) => {
    return myRecommendations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::myRecommendations
 * @see app/Http/Controllers/RecommendationController.php:44
 * @route '/api/recommendations/my'
 */
myRecommendations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myRecommendations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecommendationController::myRecommendations
 * @see app/Http/Controllers/RecommendationController.php:44
 * @route '/api/recommendations/my'
 */
myRecommendations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myRecommendations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecommendationController::myRecommendations
 * @see app/Http/Controllers/RecommendationController.php:44
 * @route '/api/recommendations/my'
 */
    const myRecommendationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: myRecommendations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::myRecommendations
 * @see app/Http/Controllers/RecommendationController.php:44
 * @route '/api/recommendations/my'
 */
        myRecommendationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myRecommendations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecommendationController::myRecommendations
 * @see app/Http/Controllers/RecommendationController.php:44
 * @route '/api/recommendations/my'
 */
        myRecommendationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myRecommendations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    myRecommendations.form = myRecommendationsForm
/**
* @see \App\Http\Controllers\RecommendationController::history
 * @see app/Http/Controllers/RecommendationController.php:317
 * @route '/api/recommendations/history'
 */
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/api/recommendations/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecommendationController::history
 * @see app/Http/Controllers/RecommendationController.php:317
 * @route '/api/recommendations/history'
 */
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::history
 * @see app/Http/Controllers/RecommendationController.php:317
 * @route '/api/recommendations/history'
 */
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecommendationController::history
 * @see app/Http/Controllers/RecommendationController.php:317
 * @route '/api/recommendations/history'
 */
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecommendationController::history
 * @see app/Http/Controllers/RecommendationController.php:317
 * @route '/api/recommendations/history'
 */
    const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: history.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::history
 * @see app/Http/Controllers/RecommendationController.php:317
 * @route '/api/recommendations/history'
 */
        historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecommendationController::history
 * @see app/Http/Controllers/RecommendationController.php:317
 * @route '/api/recommendations/history'
 */
        historyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    history.form = historyForm
/**
* @see \App\Http\Controllers\RecommendationController::stats
 * @see app/Http/Controllers/RecommendationController.php:358
 * @route '/api/recommendations/stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/api/recommendations/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecommendationController::stats
 * @see app/Http/Controllers/RecommendationController.php:358
 * @route '/api/recommendations/stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::stats
 * @see app/Http/Controllers/RecommendationController.php:358
 * @route '/api/recommendations/stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecommendationController::stats
 * @see app/Http/Controllers/RecommendationController.php:358
 * @route '/api/recommendations/stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecommendationController::stats
 * @see app/Http/Controllers/RecommendationController.php:358
 * @route '/api/recommendations/stats'
 */
    const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::stats
 * @see app/Http/Controllers/RecommendationController.php:358
 * @route '/api/recommendations/stats'
 */
        statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecommendationController::stats
 * @see app/Http/Controllers/RecommendationController.php:358
 * @route '/api/recommendations/stats'
 */
        statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stats.form = statsForm
/**
* @see \App\Http\Controllers\RecommendationController::studentRecommendations
 * @see app/Http/Controllers/RecommendationController.php:88
 * @route '/api/recommendations/student/{studentId}'
 */
export const studentRecommendations = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentRecommendations.url(args, options),
    method: 'get',
})

studentRecommendations.definition = {
    methods: ["get","head"],
    url: '/api/recommendations/student/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecommendationController::studentRecommendations
 * @see app/Http/Controllers/RecommendationController.php:88
 * @route '/api/recommendations/student/{studentId}'
 */
studentRecommendations.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return studentRecommendations.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::studentRecommendations
 * @see app/Http/Controllers/RecommendationController.php:88
 * @route '/api/recommendations/student/{studentId}'
 */
studentRecommendations.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentRecommendations.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecommendationController::studentRecommendations
 * @see app/Http/Controllers/RecommendationController.php:88
 * @route '/api/recommendations/student/{studentId}'
 */
studentRecommendations.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentRecommendations.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecommendationController::studentRecommendations
 * @see app/Http/Controllers/RecommendationController.php:88
 * @route '/api/recommendations/student/{studentId}'
 */
    const studentRecommendationsForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentRecommendations.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::studentRecommendations
 * @see app/Http/Controllers/RecommendationController.php:88
 * @route '/api/recommendations/student/{studentId}'
 */
        studentRecommendationsForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentRecommendations.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecommendationController::studentRecommendations
 * @see app/Http/Controllers/RecommendationController.php:88
 * @route '/api/recommendations/student/{studentId}'
 */
        studentRecommendationsForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentRecommendations.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentRecommendations.form = studentRecommendationsForm
/**
* @see \App\Http\Controllers\RecommendationController::show
 * @see app/Http/Controllers/RecommendationController.php:139
 * @route '/api/recommendations/{recommendationId}'
 */
export const show = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/recommendations/{recommendationId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecommendationController::show
 * @see app/Http/Controllers/RecommendationController.php:139
 * @route '/api/recommendations/{recommendationId}'
 */
show.url = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recommendationId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    recommendationId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        recommendationId: args.recommendationId,
                }

    return show.definition.url
            .replace('{recommendationId}', parsedArgs.recommendationId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::show
 * @see app/Http/Controllers/RecommendationController.php:139
 * @route '/api/recommendations/{recommendationId}'
 */
show.get = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecommendationController::show
 * @see app/Http/Controllers/RecommendationController.php:139
 * @route '/api/recommendations/{recommendationId}'
 */
show.head = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecommendationController::show
 * @see app/Http/Controllers/RecommendationController.php:139
 * @route '/api/recommendations/{recommendationId}'
 */
    const showForm = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::show
 * @see app/Http/Controllers/RecommendationController.php:139
 * @route '/api/recommendations/{recommendationId}'
 */
        showForm.get = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecommendationController::show
 * @see app/Http/Controllers/RecommendationController.php:139
 * @route '/api/recommendations/{recommendationId}'
 */
        showForm.head = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\RecommendationController::accept
 * @see app/Http/Controllers/RecommendationController.php:192
 * @route '/api/recommendations/{recommendationId}/accept'
 */
export const accept = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/api/recommendations/{recommendationId}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecommendationController::accept
 * @see app/Http/Controllers/RecommendationController.php:192
 * @route '/api/recommendations/{recommendationId}/accept'
 */
accept.url = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recommendationId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    recommendationId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        recommendationId: args.recommendationId,
                }

    return accept.definition.url
            .replace('{recommendationId}', parsedArgs.recommendationId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::accept
 * @see app/Http/Controllers/RecommendationController.php:192
 * @route '/api/recommendations/{recommendationId}/accept'
 */
accept.post = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RecommendationController::accept
 * @see app/Http/Controllers/RecommendationController.php:192
 * @route '/api/recommendations/{recommendationId}/accept'
 */
    const acceptForm = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: accept.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::accept
 * @see app/Http/Controllers/RecommendationController.php:192
 * @route '/api/recommendations/{recommendationId}/accept'
 */
        acceptForm.post = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: accept.url(args, options),
            method: 'post',
        })
    
    accept.form = acceptForm
/**
* @see \App\Http\Controllers\RecommendationController::complete
 * @see app/Http/Controllers/RecommendationController.php:247
 * @route '/api/recommendations/{recommendationId}/complete'
 */
export const complete = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/api/recommendations/{recommendationId}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecommendationController::complete
 * @see app/Http/Controllers/RecommendationController.php:247
 * @route '/api/recommendations/{recommendationId}/complete'
 */
complete.url = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recommendationId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    recommendationId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        recommendationId: args.recommendationId,
                }

    return complete.definition.url
            .replace('{recommendationId}', parsedArgs.recommendationId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::complete
 * @see app/Http/Controllers/RecommendationController.php:247
 * @route '/api/recommendations/{recommendationId}/complete'
 */
complete.post = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RecommendationController::complete
 * @see app/Http/Controllers/RecommendationController.php:247
 * @route '/api/recommendations/{recommendationId}/complete'
 */
    const completeForm = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: complete.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::complete
 * @see app/Http/Controllers/RecommendationController.php:247
 * @route '/api/recommendations/{recommendationId}/complete'
 */
        completeForm.post = (args: { recommendationId: string | number } | [recommendationId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: complete.url(args, options),
            method: 'post',
        })
    
    complete.form = completeForm
/**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:396
 * @route '/api/recommendations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/recommendations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:396
 * @route '/api/recommendations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:396
 * @route '/api/recommendations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:396
 * @route '/api/recommendations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:396
 * @route '/api/recommendations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:396
 * @route '/api/recommendations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:396
 * @route '/api/recommendations'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const RecommendationController = { myRecommendations, history, stats, studentRecommendations, show, accept, complete, index }

export default RecommendationController