import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EstudianteController::index
 * @see app/Http/Controllers/EstudianteController.php:26
 * @route '/estudiantes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/estudiantes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EstudianteController::index
 * @see app/Http/Controllers/EstudianteController.php:26
 * @route '/estudiantes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstudianteController::index
 * @see app/Http/Controllers/EstudianteController.php:26
 * @route '/estudiantes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EstudianteController::index
 * @see app/Http/Controllers/EstudianteController.php:26
 * @route '/estudiantes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EstudianteController::index
 * @see app/Http/Controllers/EstudianteController.php:26
 * @route '/estudiantes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EstudianteController::index
 * @see app/Http/Controllers/EstudianteController.php:26
 * @route '/estudiantes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EstudianteController::index
 * @see app/Http/Controllers/EstudianteController.php:26
 * @route '/estudiantes'
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
* @see \App\Http\Controllers\EstudianteController::create
 * @see app/Http/Controllers/EstudianteController.php:74
 * @route '/estudiantes/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/estudiantes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EstudianteController::create
 * @see app/Http/Controllers/EstudianteController.php:74
 * @route '/estudiantes/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstudianteController::create
 * @see app/Http/Controllers/EstudianteController.php:74
 * @route '/estudiantes/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EstudianteController::create
 * @see app/Http/Controllers/EstudianteController.php:74
 * @route '/estudiantes/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EstudianteController::create
 * @see app/Http/Controllers/EstudianteController.php:74
 * @route '/estudiantes/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EstudianteController::create
 * @see app/Http/Controllers/EstudianteController.php:74
 * @route '/estudiantes/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EstudianteController::create
 * @see app/Http/Controllers/EstudianteController.php:74
 * @route '/estudiantes/create'
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
* @see \App\Http\Controllers\EstudianteController::store
 * @see app/Http/Controllers/EstudianteController.php:91
 * @route '/estudiantes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/estudiantes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EstudianteController::store
 * @see app/Http/Controllers/EstudianteController.php:91
 * @route '/estudiantes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstudianteController::store
 * @see app/Http/Controllers/EstudianteController.php:91
 * @route '/estudiantes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EstudianteController::store
 * @see app/Http/Controllers/EstudianteController.php:91
 * @route '/estudiantes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EstudianteController::store
 * @see app/Http/Controllers/EstudianteController.php:91
 * @route '/estudiantes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EstudianteController::show
 * @see app/Http/Controllers/EstudianteController.php:131
 * @route '/estudiantes/{estudiante}'
 */
export const show = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/estudiantes/{estudiante}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EstudianteController::show
 * @see app/Http/Controllers/EstudianteController.php:131
 * @route '/estudiantes/{estudiante}'
 */
show.url = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estudiante: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { estudiante: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    estudiante: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estudiante: typeof args.estudiante === 'object'
                ? args.estudiante.id
                : args.estudiante,
                }

    return show.definition.url
            .replace('{estudiante}', parsedArgs.estudiante.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstudianteController::show
 * @see app/Http/Controllers/EstudianteController.php:131
 * @route '/estudiantes/{estudiante}'
 */
show.get = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EstudianteController::show
 * @see app/Http/Controllers/EstudianteController.php:131
 * @route '/estudiantes/{estudiante}'
 */
show.head = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EstudianteController::show
 * @see app/Http/Controllers/EstudianteController.php:131
 * @route '/estudiantes/{estudiante}'
 */
    const showForm = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EstudianteController::show
 * @see app/Http/Controllers/EstudianteController.php:131
 * @route '/estudiantes/{estudiante}'
 */
        showForm.get = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EstudianteController::show
 * @see app/Http/Controllers/EstudianteController.php:131
 * @route '/estudiantes/{estudiante}'
 */
        showForm.head = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EstudianteController::edit
 * @see app/Http/Controllers/EstudianteController.php:156
 * @route '/estudiantes/{estudiante}/edit'
 */
export const edit = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/estudiantes/{estudiante}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EstudianteController::edit
 * @see app/Http/Controllers/EstudianteController.php:156
 * @route '/estudiantes/{estudiante}/edit'
 */
edit.url = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estudiante: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { estudiante: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    estudiante: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estudiante: typeof args.estudiante === 'object'
                ? args.estudiante.id
                : args.estudiante,
                }

    return edit.definition.url
            .replace('{estudiante}', parsedArgs.estudiante.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstudianteController::edit
 * @see app/Http/Controllers/EstudianteController.php:156
 * @route '/estudiantes/{estudiante}/edit'
 */
edit.get = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EstudianteController::edit
 * @see app/Http/Controllers/EstudianteController.php:156
 * @route '/estudiantes/{estudiante}/edit'
 */
edit.head = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EstudianteController::edit
 * @see app/Http/Controllers/EstudianteController.php:156
 * @route '/estudiantes/{estudiante}/edit'
 */
    const editForm = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EstudianteController::edit
 * @see app/Http/Controllers/EstudianteController.php:156
 * @route '/estudiantes/{estudiante}/edit'
 */
        editForm.get = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EstudianteController::edit
 * @see app/Http/Controllers/EstudianteController.php:156
 * @route '/estudiantes/{estudiante}/edit'
 */
        editForm.head = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EstudianteController::update
 * @see app/Http/Controllers/EstudianteController.php:184
 * @route '/estudiantes/{estudiante}'
 */
export const update = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/estudiantes/{estudiante}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EstudianteController::update
 * @see app/Http/Controllers/EstudianteController.php:184
 * @route '/estudiantes/{estudiante}'
 */
update.url = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estudiante: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { estudiante: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    estudiante: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estudiante: typeof args.estudiante === 'object'
                ? args.estudiante.id
                : args.estudiante,
                }

    return update.definition.url
            .replace('{estudiante}', parsedArgs.estudiante.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstudianteController::update
 * @see app/Http/Controllers/EstudianteController.php:184
 * @route '/estudiantes/{estudiante}'
 */
update.put = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\EstudianteController::update
 * @see app/Http/Controllers/EstudianteController.php:184
 * @route '/estudiantes/{estudiante}'
 */
update.patch = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EstudianteController::update
 * @see app/Http/Controllers/EstudianteController.php:184
 * @route '/estudiantes/{estudiante}'
 */
    const updateForm = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EstudianteController::update
 * @see app/Http/Controllers/EstudianteController.php:184
 * @route '/estudiantes/{estudiante}'
 */
        updateForm.put = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\EstudianteController::update
 * @see app/Http/Controllers/EstudianteController.php:184
 * @route '/estudiantes/{estudiante}'
 */
        updateForm.patch = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EstudianteController::destroy
 * @see app/Http/Controllers/EstudianteController.php:232
 * @route '/estudiantes/{estudiante}'
 */
export const destroy = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/estudiantes/{estudiante}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EstudianteController::destroy
 * @see app/Http/Controllers/EstudianteController.php:232
 * @route '/estudiantes/{estudiante}'
 */
destroy.url = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estudiante: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { estudiante: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    estudiante: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estudiante: typeof args.estudiante === 'object'
                ? args.estudiante.id
                : args.estudiante,
                }

    return destroy.definition.url
            .replace('{estudiante}', parsedArgs.estudiante.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstudianteController::destroy
 * @see app/Http/Controllers/EstudianteController.php:232
 * @route '/estudiantes/{estudiante}'
 */
destroy.delete = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EstudianteController::destroy
 * @see app/Http/Controllers/EstudianteController.php:232
 * @route '/estudiantes/{estudiante}'
 */
    const destroyForm = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EstudianteController::destroy
 * @see app/Http/Controllers/EstudianteController.php:232
 * @route '/estudiantes/{estudiante}'
 */
        destroyForm.delete = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EstudianteController::toggleStatus
 * @see app/Http/Controllers/EstudianteController.php:250
 * @route '/estudiantes/{estudiante}/toggle-status'
 */
export const toggleStatus = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/estudiantes/{estudiante}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\EstudianteController::toggleStatus
 * @see app/Http/Controllers/EstudianteController.php:250
 * @route '/estudiantes/{estudiante}/toggle-status'
 */
toggleStatus.url = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estudiante: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { estudiante: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    estudiante: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estudiante: typeof args.estudiante === 'object'
                ? args.estudiante.id
                : args.estudiante,
                }

    return toggleStatus.definition.url
            .replace('{estudiante}', parsedArgs.estudiante.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstudianteController::toggleStatus
 * @see app/Http/Controllers/EstudianteController.php:250
 * @route '/estudiantes/{estudiante}/toggle-status'
 */
toggleStatus.patch = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EstudianteController::toggleStatus
 * @see app/Http/Controllers/EstudianteController.php:250
 * @route '/estudiantes/{estudiante}/toggle-status'
 */
    const toggleStatusForm = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EstudianteController::toggleStatus
 * @see app/Http/Controllers/EstudianteController.php:250
 * @route '/estudiantes/{estudiante}/toggle-status'
 */
        toggleStatusForm.patch = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleStatus.form = toggleStatusForm
const EstudianteController = { index, create, store, show, edit, update, destroy, toggleStatus }

export default EstudianteController