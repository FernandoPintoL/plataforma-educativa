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
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:198
 * @route '/evaluaciones/{evaluacione}'
 */
export const show = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacione}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:198
 * @route '/evaluaciones/{evaluacione}'
 */
show.url = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacione: typeof args.evaluacione === 'object'
                ? args.evaluacione.id
                : args.evaluacione,
                }

    return show.definition.url
            .replace('{evaluacione}', parsedArgs.evaluacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:198
 * @route '/evaluaciones/{evaluacione}'
 */
show.get = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:198
 * @route '/evaluaciones/{evaluacione}'
 */
show.head = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:198
 * @route '/evaluaciones/{evaluacione}'
 */
    const showForm = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:198
 * @route '/evaluaciones/{evaluacione}'
 */
        showForm.get = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::show
 * @see app/Http/Controllers/EvaluacionController.php:198
 * @route '/evaluaciones/{evaluacione}'
 */
        showForm.head = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:98
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
 * @see app/Http/Controllers/EvaluacionController.php:98
 * @route '/evaluaciones/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:98
 * @route '/evaluaciones/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:98
 * @route '/evaluaciones/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:98
 * @route '/evaluaciones/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:98
 * @route '/evaluaciones/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::create
 * @see app/Http/Controllers/EvaluacionController.php:98
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
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:117
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
 * @see app/Http/Controllers/EvaluacionController.php:117
 * @route '/evaluaciones'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:117
 * @route '/evaluaciones'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:117
 * @route '/evaluaciones'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::store
 * @see app/Http/Controllers/EvaluacionController.php:117
 * @route '/evaluaciones'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:259
 * @route '/evaluaciones/{evaluacione}/edit'
 */
export const edit = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacione}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:259
 * @route '/evaluaciones/{evaluacione}/edit'
 */
edit.url = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacione: typeof args.evaluacione === 'object'
                ? args.evaluacione.id
                : args.evaluacione,
                }

    return edit.definition.url
            .replace('{evaluacione}', parsedArgs.evaluacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:259
 * @route '/evaluaciones/{evaluacione}/edit'
 */
edit.get = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:259
 * @route '/evaluaciones/{evaluacione}/edit'
 */
edit.head = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:259
 * @route '/evaluaciones/{evaluacione}/edit'
 */
    const editForm = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:259
 * @route '/evaluaciones/{evaluacione}/edit'
 */
        editForm.get = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::edit
 * @see app/Http/Controllers/EvaluacionController.php:259
 * @route '/evaluaciones/{evaluacione}/edit'
 */
        editForm.head = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:283
 * @route '/evaluaciones/{evaluacione}'
 */
export const update = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/evaluaciones/{evaluacione}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:283
 * @route '/evaluaciones/{evaluacione}'
 */
update.url = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacione: typeof args.evaluacione === 'object'
                ? args.evaluacione.id
                : args.evaluacione,
                }

    return update.definition.url
            .replace('{evaluacione}', parsedArgs.evaluacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:283
 * @route '/evaluaciones/{evaluacione}'
 */
update.put = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:283
 * @route '/evaluaciones/{evaluacione}'
 */
update.patch = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:283
 * @route '/evaluaciones/{evaluacione}'
 */
    const updateForm = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:283
 * @route '/evaluaciones/{evaluacione}'
 */
        updateForm.put = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::update
 * @see app/Http/Controllers/EvaluacionController.php:283
 * @route '/evaluaciones/{evaluacione}'
 */
        updateForm.patch = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:344
 * @route '/evaluaciones/{evaluacione}'
 */
export const destroy = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/evaluaciones/{evaluacione}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:344
 * @route '/evaluaciones/{evaluacione}'
 */
destroy.url = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacione: typeof args.evaluacione === 'object'
                ? args.evaluacione.id
                : args.evaluacione,
                }

    return destroy.definition.url
            .replace('{evaluacione}', parsedArgs.evaluacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:344
 * @route '/evaluaciones/{evaluacione}'
 */
destroy.delete = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::destroy
 * @see app/Http/Controllers/EvaluacionController.php:344
 * @route '/evaluaciones/{evaluacione}'
 */
    const destroyForm = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/EvaluacionController.php:344
 * @route '/evaluaciones/{evaluacione}'
 */
        destroyForm.delete = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:387
 * @route '/evaluaciones/{evaluacione}/take'
 */
export const take = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})

take.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacione}/take',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:387
 * @route '/evaluaciones/{evaluacione}/take'
 */
take.url = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacione: typeof args.evaluacione === 'object'
                ? args.evaluacione.id
                : args.evaluacione,
                }

    return take.definition.url
            .replace('{evaluacione}', parsedArgs.evaluacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:387
 * @route '/evaluaciones/{evaluacione}/take'
 */
take.get = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:387
 * @route '/evaluaciones/{evaluacione}/take'
 */
take.head = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: take.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:387
 * @route '/evaluaciones/{evaluacione}/take'
 */
    const takeForm = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: take.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:387
 * @route '/evaluaciones/{evaluacione}/take'
 */
        takeForm.get = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: take.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::take
 * @see app/Http/Controllers/EvaluacionController.php:387
 * @route '/evaluaciones/{evaluacione}/take'
 */
        takeForm.head = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:447
 * @route '/evaluaciones/{evaluacione}/submit'
 */
export const submitRespuestas = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitRespuestas.url(args, options),
    method: 'post',
})

submitRespuestas.definition = {
    methods: ["post"],
    url: '/evaluaciones/{evaluacione}/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:447
 * @route '/evaluaciones/{evaluacione}/submit'
 */
submitRespuestas.url = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacione: typeof args.evaluacione === 'object'
                ? args.evaluacione.id
                : args.evaluacione,
                }

    return submitRespuestas.definition.url
            .replace('{evaluacione}', parsedArgs.evaluacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:447
 * @route '/evaluaciones/{evaluacione}/submit'
 */
submitRespuestas.post = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitRespuestas.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:447
 * @route '/evaluaciones/{evaluacione}/submit'
 */
    const submitRespuestasForm = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitRespuestas.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::submitRespuestas
 * @see app/Http/Controllers/EvaluacionController.php:447
 * @route '/evaluaciones/{evaluacione}/submit'
 */
        submitRespuestasForm.post = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitRespuestas.url(args, options),
            method: 'post',
        })
    
    submitRespuestas.form = submitRespuestasForm
/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacione}/results'
 */
export const results = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: results.url(args, options),
    method: 'get',
})

results.definition = {
    methods: ["get","head"],
    url: '/evaluaciones/{evaluacione}/results',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacione}/results'
 */
results.url = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluacione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluacione: typeof args.evaluacione === 'object'
                ? args.evaluacione.id
                : args.evaluacione,
                }

    return results.definition.url
            .replace('{evaluacione}', parsedArgs.evaluacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacione}/results'
 */
results.get = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: results.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacione}/results'
 */
results.head = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: results.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacione}/results'
 */
    const resultsForm = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: results.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacione}/results'
 */
        resultsForm.get = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: results.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EvaluacionController::results
 * @see app/Http/Controllers/EvaluacionController.php:500
 * @route '/evaluaciones/{evaluacione}/results'
 */
        resultsForm.head = (args: { evaluacione: number | { id: number } } | [evaluacione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: results.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    results.form = resultsForm
const EvaluacionController = { index, show, create, store, edit, update, destroy, take, submitRespuestas, results }

export default EvaluacionController