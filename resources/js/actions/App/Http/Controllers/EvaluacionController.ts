import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:22
 * @route '/evaluaciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/evaluaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:22
 * @route '/evaluaciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:22
 * @route '/evaluaciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:22
 * @route '/evaluaciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:22
 * @route '/evaluaciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:22
 * @route '/evaluaciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::index
 * @see app/Http/Controllers/EvaluacionController.php:22
 * @route '/evaluaciones'
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
/**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:107
 * @route '/evaluaciones/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:107
 * @route '/evaluaciones/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:107
 * @route '/evaluaciones/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:107
 * @route '/evaluaciones/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:107
 * @route '/evaluaciones/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:107
 * @route '/evaluaciones/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:107
 * @route '/evaluaciones/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:401
 * @route '/evaluaciones/{evaluacion}/take'
 */
export const take = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})

take.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacion}/take',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:401
 * @route '/evaluaciones/{evaluacion}/take'
 */
take.url = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: args.evaluacion,
                }

    return take.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:401
 * @route '/evaluaciones/{evaluacion}/take'
 */
take.get = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:401
 * @route '/evaluaciones/{evaluacion}/take'
 */
take.head = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: take.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:401
 * @route '/evaluaciones/{evaluacion}/take'
 */
    const takeForm = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: take.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:401
 * @route '/evaluaciones/{evaluacion}/take'
 */
        takeForm.get = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: take.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:401
 * @route '/evaluaciones/{evaluacion}/take'
 */
        takeForm.head = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: take.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    take.form = takeForm
/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:514
 * @route '/evaluaciones/{evaluacion}/results'
 */
export const results = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: results.url(args, options),
    method: 'get',
})

results.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacion}/results',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:514
 * @route '/evaluaciones/{evaluacion}/results'
 */
results.url = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: args.evaluacion,
                }

    return results.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:514
 * @route '/evaluaciones/{evaluacion}/results'
 */
results.get = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: results.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:514
 * @route '/evaluaciones/{evaluacion}/results'
 */
results.head = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: results.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:514
 * @route '/evaluaciones/{evaluacion}/results'
 */
    const resultsForm = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: results.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:514
 * @route '/evaluaciones/{evaluacion}/results'
 */
        resultsForm.get = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: results.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:514
 * @route '/evaluaciones/{evaluacion}/results'
 */
        resultsForm.head = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: results.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    results.form = resultsForm
/**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:461
 * @route '/evaluaciones/{evaluacion}/submit'
 */
export const submitRespuestas = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitRespuestas.url(args, options),
    method: 'post',
})

submitRespuestas.definition = {
    methods: ["post"],
    url: '/evaluaciones/{evaluacion}/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:461
 * @route '/evaluaciones/{evaluacion}/submit'
 */
submitRespuestas.url = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: args.evaluacion,
                }

    return submitRespuestas.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:461
 * @route '/evaluaciones/{evaluacion}/submit'
 */
submitRespuestas.post = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitRespuestas.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:461
 * @route '/evaluaciones/{evaluacion}/submit'
 */
    const submitRespuestasForm = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitRespuestas.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:461
 * @route '/evaluaciones/{evaluacion}/submit'
 */
        submitRespuestasForm.post = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitRespuestas.url(args, options),
            method: 'post',
        })
    
    submitRespuestas.form = submitRespuestasForm
/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:273
 * @route '/evaluaciones/{evaluacion}/edit'
 */
export const edit = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacion}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:273
 * @route '/evaluaciones/{evaluacion}/edit'
 */
edit.url = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: args.evaluacion,
                }

    return edit.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:273
 * @route '/evaluaciones/{evaluacion}/edit'
 */
edit.get = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:273
 * @route '/evaluaciones/{evaluacion}/edit'
 */
edit.head = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:273
 * @route '/evaluaciones/{evaluacion}/edit'
 */
    const editForm = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:273
 * @route '/evaluaciones/{evaluacion}/edit'
 */
        editForm.get = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:273
 * @route '/evaluaciones/{evaluacion}/edit'
 */
        editForm.head = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:126
 * @route '/evaluaciones'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/evaluaciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:126
 * @route '/evaluaciones'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:126
 * @route '/evaluaciones'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:126
 * @route '/evaluaciones'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:126
 * @route '/evaluaciones'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:297
 * @route '/evaluaciones/{evaluacion}'
 */
const update7598730f5bb15464ada22e14ca919d72 = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update7598730f5bb15464ada22e14ca919d72.url(args, options),
    method: 'put',
})

update7598730f5bb15464ada22e14ca919d72.definition = {
    methods: ["put"],
    url: '/evaluaciones/{evaluacion}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:297
 * @route '/evaluaciones/{evaluacion}'
 */
update7598730f5bb15464ada22e14ca919d72.url = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: args.evaluacion,
                }

    return update7598730f5bb15464ada22e14ca919d72.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:297
 * @route '/evaluaciones/{evaluacion}'
 */
update7598730f5bb15464ada22e14ca919d72.put = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update7598730f5bb15464ada22e14ca919d72.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:297
 * @route '/evaluaciones/{evaluacion}'
 */
    const update7598730f5bb15464ada22e14ca919d72Form = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update7598730f5bb15464ada22e14ca919d72.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:297
 * @route '/evaluaciones/{evaluacion}'
 */
        update7598730f5bb15464ada22e14ca919d72Form.put = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update7598730f5bb15464ada22e14ca919d72.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update7598730f5bb15464ada22e14ca919d72.form = update7598730f5bb15464ada22e14ca919d72Form
    /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:297
 * @route '/evaluaciones/{evaluacion}'
 */
const update7598730f5bb15464ada22e14ca919d72 = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update7598730f5bb15464ada22e14ca919d72.url(args, options),
    method: 'patch',
})

update7598730f5bb15464ada22e14ca919d72.definition = {
    methods: ["patch"],
    url: '/evaluaciones/{evaluacion}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:297
 * @route '/evaluaciones/{evaluacion}'
 */
update7598730f5bb15464ada22e14ca919d72.url = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: args.evaluacion,
                }

    return update7598730f5bb15464ada22e14ca919d72.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:297
 * @route '/evaluaciones/{evaluacion}'
 */
update7598730f5bb15464ada22e14ca919d72.patch = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update7598730f5bb15464ada22e14ca919d72.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:297
 * @route '/evaluaciones/{evaluacion}'
 */
    const update7598730f5bb15464ada22e14ca919d72Form = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update7598730f5bb15464ada22e14ca919d72.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:297
 * @route '/evaluaciones/{evaluacion}'
 */
        update7598730f5bb15464ada22e14ca919d72Form.patch = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update7598730f5bb15464ada22e14ca919d72.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update7598730f5bb15464ada22e14ca919d72.form = update7598730f5bb15464ada22e14ca919d72Form

export const update = {
    '/evaluaciones/{evaluacion}': update7598730f5bb15464ada22e14ca919d72,
    '/evaluaciones/{evaluacion}': update7598730f5bb15464ada22e14ca919d72,
}

/**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:358
 * @route '/evaluaciones/{evaluacion}'
 */
export const destroy = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/evaluaciones/{evaluacion}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:358
 * @route '/evaluaciones/{evaluacion}'
 */
destroy.url = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: args.evaluacion,
                }

    return destroy.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:358
 * @route '/evaluaciones/{evaluacion}'
 */
destroy.delete = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:358
 * @route '/evaluaciones/{evaluacion}'
 */
    const destroyForm = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:358
 * @route '/evaluaciones/{evaluacion}'
 */
        destroyForm.delete = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:207
 * @route '/evaluaciones/{evaluacion}'
 */
export const show = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:207
 * @route '/evaluaciones/{evaluacion}'
 */
show.url = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    evaluacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacion: args.evaluacion,
                }

    return show.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:207
 * @route '/evaluaciones/{evaluacion}'
 */
show.get = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:207
 * @route '/evaluaciones/{evaluacion}'
 */
show.head = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:207
 * @route '/evaluaciones/{evaluacion}'
 */
    const showForm = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:207
 * @route '/evaluaciones/{evaluacion}'
 */
        showForm.get = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:207
 * @route '/evaluaciones/{evaluacion}'
 */
        showForm.head = (args: { evaluacion: string | number } | [evaluacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const EvaluacionController = { index, create, take, results, submitRespuestas, edit, store, update, destroy, show }

export default EvaluacionController