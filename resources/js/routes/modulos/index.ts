import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ModuloEducativoController::index
 * @see app/Http/Controllers/ModuloEducativoController.php:18
 * @route '/modulos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/modulos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloEducativoController::index
 * @see app/Http/Controllers/ModuloEducativoController.php:18
 * @route '/modulos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloEducativoController::index
 * @see app/Http/Controllers/ModuloEducativoController.php:18
 * @route '/modulos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloEducativoController::index
 * @see app/Http/Controllers/ModuloEducativoController.php:18
 * @route '/modulos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloEducativoController::index
 * @see app/Http/Controllers/ModuloEducativoController.php:18
 * @route '/modulos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloEducativoController::index
 * @see app/Http/Controllers/ModuloEducativoController.php:18
 * @route '/modulos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloEducativoController::index
 * @see app/Http/Controllers/ModuloEducativoController.php:18
 * @route '/modulos'
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
* @see \App\Http\Controllers\ModuloEducativoController::show
 * @see app/Http/Controllers/ModuloEducativoController.php:117
 * @route '/modulos/{modulo}'
 */
export const show = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/modulos/{modulo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloEducativoController::show
 * @see app/Http/Controllers/ModuloEducativoController.php:117
 * @route '/modulos/{modulo}'
 */
show.url = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { modulo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { modulo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    modulo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        modulo: typeof args.modulo === 'object'
                ? args.modulo.id
                : args.modulo,
                }

    return show.definition.url
            .replace('{modulo}', parsedArgs.modulo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloEducativoController::show
 * @see app/Http/Controllers/ModuloEducativoController.php:117
 * @route '/modulos/{modulo}'
 */
show.get = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloEducativoController::show
 * @see app/Http/Controllers/ModuloEducativoController.php:117
 * @route '/modulos/{modulo}'
 */
show.head = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloEducativoController::show
 * @see app/Http/Controllers/ModuloEducativoController.php:117
 * @route '/modulos/{modulo}'
 */
    const showForm = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloEducativoController::show
 * @see app/Http/Controllers/ModuloEducativoController.php:117
 * @route '/modulos/{modulo}'
 */
        showForm.get = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloEducativoController::show
 * @see app/Http/Controllers/ModuloEducativoController.php:117
 * @route '/modulos/{modulo}'
 */
        showForm.head = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ModuloEducativoController::create
 * @see app/Http/Controllers/ModuloEducativoController.php:76
 * @route '/modulos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/modulos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloEducativoController::create
 * @see app/Http/Controllers/ModuloEducativoController.php:76
 * @route '/modulos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloEducativoController::create
 * @see app/Http/Controllers/ModuloEducativoController.php:76
 * @route '/modulos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloEducativoController::create
 * @see app/Http/Controllers/ModuloEducativoController.php:76
 * @route '/modulos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloEducativoController::create
 * @see app/Http/Controllers/ModuloEducativoController.php:76
 * @route '/modulos/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloEducativoController::create
 * @see app/Http/Controllers/ModuloEducativoController.php:76
 * @route '/modulos/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloEducativoController::create
 * @see app/Http/Controllers/ModuloEducativoController.php:76
 * @route '/modulos/create'
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
* @see \App\Http\Controllers\ModuloEducativoController::store
 * @see app/Http/Controllers/ModuloEducativoController.php:92
 * @route '/modulos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/modulos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuloEducativoController::store
 * @see app/Http/Controllers/ModuloEducativoController.php:92
 * @route '/modulos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloEducativoController::store
 * @see app/Http/Controllers/ModuloEducativoController.php:92
 * @route '/modulos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuloEducativoController::store
 * @see app/Http/Controllers/ModuloEducativoController.php:92
 * @route '/modulos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloEducativoController::store
 * @see app/Http/Controllers/ModuloEducativoController.php:92
 * @route '/modulos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ModuloEducativoController::edit
 * @see app/Http/Controllers/ModuloEducativoController.php:150
 * @route '/modulos/{modulo}/edit'
 */
export const edit = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/modulos/{modulo}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloEducativoController::edit
 * @see app/Http/Controllers/ModuloEducativoController.php:150
 * @route '/modulos/{modulo}/edit'
 */
edit.url = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { modulo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { modulo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    modulo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        modulo: typeof args.modulo === 'object'
                ? args.modulo.id
                : args.modulo,
                }

    return edit.definition.url
            .replace('{modulo}', parsedArgs.modulo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloEducativoController::edit
 * @see app/Http/Controllers/ModuloEducativoController.php:150
 * @route '/modulos/{modulo}/edit'
 */
edit.get = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloEducativoController::edit
 * @see app/Http/Controllers/ModuloEducativoController.php:150
 * @route '/modulos/{modulo}/edit'
 */
edit.head = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloEducativoController::edit
 * @see app/Http/Controllers/ModuloEducativoController.php:150
 * @route '/modulos/{modulo}/edit'
 */
    const editForm = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloEducativoController::edit
 * @see app/Http/Controllers/ModuloEducativoController.php:150
 * @route '/modulos/{modulo}/edit'
 */
        editForm.get = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloEducativoController::edit
 * @see app/Http/Controllers/ModuloEducativoController.php:150
 * @route '/modulos/{modulo}/edit'
 */
        editForm.head = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ModuloEducativoController::update
 * @see app/Http/Controllers/ModuloEducativoController.php:174
 * @route '/modulos/{modulo}'
 */
export const update = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/modulos/{modulo}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ModuloEducativoController::update
 * @see app/Http/Controllers/ModuloEducativoController.php:174
 * @route '/modulos/{modulo}'
 */
update.url = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { modulo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { modulo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    modulo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        modulo: typeof args.modulo === 'object'
                ? args.modulo.id
                : args.modulo,
                }

    return update.definition.url
            .replace('{modulo}', parsedArgs.modulo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloEducativoController::update
 * @see app/Http/Controllers/ModuloEducativoController.php:174
 * @route '/modulos/{modulo}'
 */
update.put = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ModuloEducativoController::update
 * @see app/Http/Controllers/ModuloEducativoController.php:174
 * @route '/modulos/{modulo}'
 */
update.patch = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ModuloEducativoController::update
 * @see app/Http/Controllers/ModuloEducativoController.php:174
 * @route '/modulos/{modulo}'
 */
    const updateForm = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloEducativoController::update
 * @see app/Http/Controllers/ModuloEducativoController.php:174
 * @route '/modulos/{modulo}'
 */
        updateForm.put = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ModuloEducativoController::update
 * @see app/Http/Controllers/ModuloEducativoController.php:174
 * @route '/modulos/{modulo}'
 */
        updateForm.patch = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ModuloEducativoController::destroy
 * @see app/Http/Controllers/ModuloEducativoController.php:198
 * @route '/modulos/{modulo}'
 */
export const destroy = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/modulos/{modulo}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ModuloEducativoController::destroy
 * @see app/Http/Controllers/ModuloEducativoController.php:198
 * @route '/modulos/{modulo}'
 */
destroy.url = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { modulo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { modulo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    modulo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        modulo: typeof args.modulo === 'object'
                ? args.modulo.id
                : args.modulo,
                }

    return destroy.definition.url
            .replace('{modulo}', parsedArgs.modulo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloEducativoController::destroy
 * @see app/Http/Controllers/ModuloEducativoController.php:198
 * @route '/modulos/{modulo}'
 */
destroy.delete = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ModuloEducativoController::destroy
 * @see app/Http/Controllers/ModuloEducativoController.php:198
 * @route '/modulos/{modulo}'
 */
    const destroyForm = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloEducativoController::destroy
 * @see app/Http/Controllers/ModuloEducativoController.php:198
 * @route '/modulos/{modulo}'
 */
        destroyForm.delete = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ModuloEducativoController::publicar
 * @see app/Http/Controllers/ModuloEducativoController.php:221
 * @route '/modulos/{modulo}/publicar'
 */
export const publicar = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: publicar.url(args, options),
    method: 'patch',
})

publicar.definition = {
    methods: ["patch"],
    url: '/modulos/{modulo}/publicar',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ModuloEducativoController::publicar
 * @see app/Http/Controllers/ModuloEducativoController.php:221
 * @route '/modulos/{modulo}/publicar'
 */
publicar.url = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { modulo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { modulo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    modulo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        modulo: typeof args.modulo === 'object'
                ? args.modulo.id
                : args.modulo,
                }

    return publicar.definition.url
            .replace('{modulo}', parsedArgs.modulo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloEducativoController::publicar
 * @see app/Http/Controllers/ModuloEducativoController.php:221
 * @route '/modulos/{modulo}/publicar'
 */
publicar.patch = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: publicar.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ModuloEducativoController::publicar
 * @see app/Http/Controllers/ModuloEducativoController.php:221
 * @route '/modulos/{modulo}/publicar'
 */
    const publicarForm = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: publicar.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloEducativoController::publicar
 * @see app/Http/Controllers/ModuloEducativoController.php:221
 * @route '/modulos/{modulo}/publicar'
 */
        publicarForm.patch = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: publicar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    publicar.form = publicarForm
/**
* @see \App\Http\Controllers\ModuloEducativoController::archivar
 * @see app/Http/Controllers/ModuloEducativoController.php:237
 * @route '/modulos/{modulo}/archivar'
 */
export const archivar = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: archivar.url(args, options),
    method: 'patch',
})

archivar.definition = {
    methods: ["patch"],
    url: '/modulos/{modulo}/archivar',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ModuloEducativoController::archivar
 * @see app/Http/Controllers/ModuloEducativoController.php:237
 * @route '/modulos/{modulo}/archivar'
 */
archivar.url = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { modulo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { modulo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    modulo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        modulo: typeof args.modulo === 'object'
                ? args.modulo.id
                : args.modulo,
                }

    return archivar.definition.url
            .replace('{modulo}', parsedArgs.modulo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloEducativoController::archivar
 * @see app/Http/Controllers/ModuloEducativoController.php:237
 * @route '/modulos/{modulo}/archivar'
 */
archivar.patch = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: archivar.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ModuloEducativoController::archivar
 * @see app/Http/Controllers/ModuloEducativoController.php:237
 * @route '/modulos/{modulo}/archivar'
 */
    const archivarForm = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: archivar.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloEducativoController::archivar
 * @see app/Http/Controllers/ModuloEducativoController.php:237
 * @route '/modulos/{modulo}/archivar'
 */
        archivarForm.patch = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: archivar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    archivar.form = archivarForm
/**
* @see \App\Http\Controllers\ModuloEducativoController::reordenar
 * @see app/Http/Controllers/ModuloEducativoController.php:253
 * @route '/modulos/reordenar'
 */
export const reordenar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reordenar.url(options),
    method: 'post',
})

reordenar.definition = {
    methods: ["post"],
    url: '/modulos/reordenar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuloEducativoController::reordenar
 * @see app/Http/Controllers/ModuloEducativoController.php:253
 * @route '/modulos/reordenar'
 */
reordenar.url = (options?: RouteQueryOptions) => {
    return reordenar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloEducativoController::reordenar
 * @see app/Http/Controllers/ModuloEducativoController.php:253
 * @route '/modulos/reordenar'
 */
reordenar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reordenar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuloEducativoController::reordenar
 * @see app/Http/Controllers/ModuloEducativoController.php:253
 * @route '/modulos/reordenar'
 */
    const reordenarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reordenar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloEducativoController::reordenar
 * @see app/Http/Controllers/ModuloEducativoController.php:253
 * @route '/modulos/reordenar'
 */
        reordenarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reordenar.url(options),
            method: 'post',
        })
    
    reordenar.form = reordenarForm
/**
* @see \App\Http\Controllers\ModuloEducativoController::duplicar
 * @see app/Http/Controllers/ModuloEducativoController.php:268
 * @route '/modulos/{modulo}/duplicar'
 */
export const duplicar = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: duplicar.url(args, options),
    method: 'post',
})

duplicar.definition = {
    methods: ["post"],
    url: '/modulos/{modulo}/duplicar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuloEducativoController::duplicar
 * @see app/Http/Controllers/ModuloEducativoController.php:268
 * @route '/modulos/{modulo}/duplicar'
 */
duplicar.url = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { modulo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { modulo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    modulo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        modulo: typeof args.modulo === 'object'
                ? args.modulo.id
                : args.modulo,
                }

    return duplicar.definition.url
            .replace('{modulo}', parsedArgs.modulo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloEducativoController::duplicar
 * @see app/Http/Controllers/ModuloEducativoController.php:268
 * @route '/modulos/{modulo}/duplicar'
 */
duplicar.post = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: duplicar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuloEducativoController::duplicar
 * @see app/Http/Controllers/ModuloEducativoController.php:268
 * @route '/modulos/{modulo}/duplicar'
 */
    const duplicarForm = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: duplicar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloEducativoController::duplicar
 * @see app/Http/Controllers/ModuloEducativoController.php:268
 * @route '/modulos/{modulo}/duplicar'
 */
        duplicarForm.post = (args: { modulo: number | { id: number } } | [modulo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: duplicar.url(args, options),
            method: 'post',
        })
    
    duplicar.form = duplicarForm
const modulos = {
    index,
show,
create,
store,
edit,
update,
destroy,
publicar,
archivar,
reordenar,
duplicar,
}

export default modulos