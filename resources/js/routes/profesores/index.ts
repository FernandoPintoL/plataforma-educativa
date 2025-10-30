import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ProfesorController::index
 * @see app/Http/Controllers/ProfesorController.php:26
 * @route '/profesores'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/profesores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfesorController::index
 * @see app/Http/Controllers/ProfesorController.php:26
 * @route '/profesores'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfesorController::index
 * @see app/Http/Controllers/ProfesorController.php:26
 * @route '/profesores'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProfesorController::index
 * @see app/Http/Controllers/ProfesorController.php:26
 * @route '/profesores'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProfesorController::index
 * @see app/Http/Controllers/ProfesorController.php:26
 * @route '/profesores'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProfesorController::index
 * @see app/Http/Controllers/ProfesorController.php:26
 * @route '/profesores'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProfesorController::index
 * @see app/Http/Controllers/ProfesorController.php:26
 * @route '/profesores'
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
* @see \App\Http\Controllers\ProfesorController::create
 * @see app/Http/Controllers/ProfesorController.php:74
 * @route '/profesores/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/profesores/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfesorController::create
 * @see app/Http/Controllers/ProfesorController.php:74
 * @route '/profesores/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfesorController::create
 * @see app/Http/Controllers/ProfesorController.php:74
 * @route '/profesores/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProfesorController::create
 * @see app/Http/Controllers/ProfesorController.php:74
 * @route '/profesores/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProfesorController::create
 * @see app/Http/Controllers/ProfesorController.php:74
 * @route '/profesores/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProfesorController::create
 * @see app/Http/Controllers/ProfesorController.php:74
 * @route '/profesores/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProfesorController::create
 * @see app/Http/Controllers/ProfesorController.php:74
 * @route '/profesores/create'
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
* @see \App\Http\Controllers\ProfesorController::store
 * @see app/Http/Controllers/ProfesorController.php:93
 * @route '/profesores'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/profesores',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProfesorController::store
 * @see app/Http/Controllers/ProfesorController.php:93
 * @route '/profesores'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfesorController::store
 * @see app/Http/Controllers/ProfesorController.php:93
 * @route '/profesores'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProfesorController::store
 * @see app/Http/Controllers/ProfesorController.php:93
 * @route '/profesores'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfesorController::store
 * @see app/Http/Controllers/ProfesorController.php:93
 * @route '/profesores'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProfesorController::show
 * @see app/Http/Controllers/ProfesorController.php:133
 * @route '/profesores/{profesore}'
 */
export const show = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/profesores/{profesore}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfesorController::show
 * @see app/Http/Controllers/ProfesorController.php:133
 * @route '/profesores/{profesore}'
 */
show.url = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { profesore: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    profesore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profesore: args.profesore,
                }

    return show.definition.url
            .replace('{profesore}', parsedArgs.profesore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfesorController::show
 * @see app/Http/Controllers/ProfesorController.php:133
 * @route '/profesores/{profesore}'
 */
show.get = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProfesorController::show
 * @see app/Http/Controllers/ProfesorController.php:133
 * @route '/profesores/{profesore}'
 */
show.head = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProfesorController::show
 * @see app/Http/Controllers/ProfesorController.php:133
 * @route '/profesores/{profesore}'
 */
    const showForm = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProfesorController::show
 * @see app/Http/Controllers/ProfesorController.php:133
 * @route '/profesores/{profesore}'
 */
        showForm.get = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProfesorController::show
 * @see app/Http/Controllers/ProfesorController.php:133
 * @route '/profesores/{profesore}'
 */
        showForm.head = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProfesorController::edit
 * @see app/Http/Controllers/ProfesorController.php:155
 * @route '/profesores/{profesore}/edit'
 */
export const edit = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/profesores/{profesore}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfesorController::edit
 * @see app/Http/Controllers/ProfesorController.php:155
 * @route '/profesores/{profesore}/edit'
 */
edit.url = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { profesore: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    profesore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profesore: args.profesore,
                }

    return edit.definition.url
            .replace('{profesore}', parsedArgs.profesore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfesorController::edit
 * @see app/Http/Controllers/ProfesorController.php:155
 * @route '/profesores/{profesore}/edit'
 */
edit.get = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProfesorController::edit
 * @see app/Http/Controllers/ProfesorController.php:155
 * @route '/profesores/{profesore}/edit'
 */
edit.head = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProfesorController::edit
 * @see app/Http/Controllers/ProfesorController.php:155
 * @route '/profesores/{profesore}/edit'
 */
    const editForm = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProfesorController::edit
 * @see app/Http/Controllers/ProfesorController.php:155
 * @route '/profesores/{profesore}/edit'
 */
        editForm.get = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProfesorController::edit
 * @see app/Http/Controllers/ProfesorController.php:155
 * @route '/profesores/{profesore}/edit'
 */
        editForm.head = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProfesorController::update
 * @see app/Http/Controllers/ProfesorController.php:185
 * @route '/profesores/{profesore}'
 */
export const update = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/profesores/{profesore}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ProfesorController::update
 * @see app/Http/Controllers/ProfesorController.php:185
 * @route '/profesores/{profesore}'
 */
update.url = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { profesore: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    profesore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profesore: args.profesore,
                }

    return update.definition.url
            .replace('{profesore}', parsedArgs.profesore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfesorController::update
 * @see app/Http/Controllers/ProfesorController.php:185
 * @route '/profesores/{profesore}'
 */
update.put = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ProfesorController::update
 * @see app/Http/Controllers/ProfesorController.php:185
 * @route '/profesores/{profesore}'
 */
update.patch = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProfesorController::update
 * @see app/Http/Controllers/ProfesorController.php:185
 * @route '/profesores/{profesore}'
 */
    const updateForm = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfesorController::update
 * @see app/Http/Controllers/ProfesorController.php:185
 * @route '/profesores/{profesore}'
 */
        updateForm.put = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ProfesorController::update
 * @see app/Http/Controllers/ProfesorController.php:185
 * @route '/profesores/{profesore}'
 */
        updateForm.patch = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ProfesorController::destroy
 * @see app/Http/Controllers/ProfesorController.php:233
 * @route '/profesores/{profesore}'
 */
export const destroy = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/profesores/{profesore}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProfesorController::destroy
 * @see app/Http/Controllers/ProfesorController.php:233
 * @route '/profesores/{profesore}'
 */
destroy.url = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { profesore: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    profesore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profesore: args.profesore,
                }

    return destroy.definition.url
            .replace('{profesore}', parsedArgs.profesore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfesorController::destroy
 * @see app/Http/Controllers/ProfesorController.php:233
 * @route '/profesores/{profesore}'
 */
destroy.delete = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProfesorController::destroy
 * @see app/Http/Controllers/ProfesorController.php:233
 * @route '/profesores/{profesore}'
 */
    const destroyForm = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfesorController::destroy
 * @see app/Http/Controllers/ProfesorController.php:233
 * @route '/profesores/{profesore}'
 */
        destroyForm.delete = (args: { profesore: string | number } | [profesore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ProfesorController::toggleStatus
 * @see app/Http/Controllers/ProfesorController.php:251
 * @route '/profesores/{profesor}/toggle-status'
 */
export const toggleStatus = (args: { profesor: number | { id: number } } | [profesor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/profesores/{profesor}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProfesorController::toggleStatus
 * @see app/Http/Controllers/ProfesorController.php:251
 * @route '/profesores/{profesor}/toggle-status'
 */
toggleStatus.url = (args: { profesor: number | { id: number } } | [profesor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { profesor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { profesor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    profesor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profesor: typeof args.profesor === 'object'
                ? args.profesor.id
                : args.profesor,
                }

    return toggleStatus.definition.url
            .replace('{profesor}', parsedArgs.profesor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfesorController::toggleStatus
 * @see app/Http/Controllers/ProfesorController.php:251
 * @route '/profesores/{profesor}/toggle-status'
 */
toggleStatus.patch = (args: { profesor: number | { id: number } } | [profesor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProfesorController::toggleStatus
 * @see app/Http/Controllers/ProfesorController.php:251
 * @route '/profesores/{profesor}/toggle-status'
 */
    const toggleStatusForm = (args: { profesor: number | { id: number } } | [profesor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfesorController::toggleStatus
 * @see app/Http/Controllers/ProfesorController.php:251
 * @route '/profesores/{profesor}/toggle-status'
 */
        toggleStatusForm.patch = (args: { profesor: number | { id: number } } | [profesor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleStatus.form = toggleStatusForm
const profesores = {
    index,
create,
store,
show,
edit,
update,
destroy,
toggleStatus,
}

export default profesores