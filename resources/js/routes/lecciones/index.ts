import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\LeccionController::index
 * @see app/Http/Controllers/LeccionController.php:19
 * @route '/lecciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/lecciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeccionController::index
 * @see app/Http/Controllers/LeccionController.php:19
 * @route '/lecciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeccionController::index
 * @see app/Http/Controllers/LeccionController.php:19
 * @route '/lecciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeccionController::index
 * @see app/Http/Controllers/LeccionController.php:19
 * @route '/lecciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LeccionController::index
 * @see app/Http/Controllers/LeccionController.php:19
 * @route '/lecciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LeccionController::index
 * @see app/Http/Controllers/LeccionController.php:19
 * @route '/lecciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LeccionController::index
 * @see app/Http/Controllers/LeccionController.php:19
 * @route '/lecciones'
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
* @see \App\Http\Controllers\LeccionController::show
 * @see app/Http/Controllers/LeccionController.php:123
 * @route '/lecciones/{leccione}'
 */
export const show = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/lecciones/{leccione}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeccionController::show
 * @see app/Http/Controllers/LeccionController.php:123
 * @route '/lecciones/{leccione}'
 */
show.url = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leccione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leccione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leccione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leccione: typeof args.leccione === 'object'
                ? args.leccione.id
                : args.leccione,
                }

    return show.definition.url
            .replace('{leccione}', parsedArgs.leccione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeccionController::show
 * @see app/Http/Controllers/LeccionController.php:123
 * @route '/lecciones/{leccione}'
 */
show.get = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeccionController::show
 * @see app/Http/Controllers/LeccionController.php:123
 * @route '/lecciones/{leccione}'
 */
show.head = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LeccionController::show
 * @see app/Http/Controllers/LeccionController.php:123
 * @route '/lecciones/{leccione}'
 */
    const showForm = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LeccionController::show
 * @see app/Http/Controllers/LeccionController.php:123
 * @route '/lecciones/{leccione}'
 */
        showForm.get = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LeccionController::show
 * @see app/Http/Controllers/LeccionController.php:123
 * @route '/lecciones/{leccione}'
 */
        showForm.head = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LeccionController::create
 * @see app/Http/Controllers/LeccionController.php:77
 * @route '/lecciones/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/lecciones/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeccionController::create
 * @see app/Http/Controllers/LeccionController.php:77
 * @route '/lecciones/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeccionController::create
 * @see app/Http/Controllers/LeccionController.php:77
 * @route '/lecciones/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeccionController::create
 * @see app/Http/Controllers/LeccionController.php:77
 * @route '/lecciones/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LeccionController::create
 * @see app/Http/Controllers/LeccionController.php:77
 * @route '/lecciones/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LeccionController::create
 * @see app/Http/Controllers/LeccionController.php:77
 * @route '/lecciones/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LeccionController::create
 * @see app/Http/Controllers/LeccionController.php:77
 * @route '/lecciones/create'
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
* @see \App\Http\Controllers\LeccionController::store
 * @see app/Http/Controllers/LeccionController.php:98
 * @route '/lecciones'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/lecciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeccionController::store
 * @see app/Http/Controllers/LeccionController.php:98
 * @route '/lecciones'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeccionController::store
 * @see app/Http/Controllers/LeccionController.php:98
 * @route '/lecciones'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LeccionController::store
 * @see app/Http/Controllers/LeccionController.php:98
 * @route '/lecciones'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LeccionController::store
 * @see app/Http/Controllers/LeccionController.php:98
 * @route '/lecciones'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\LeccionController::edit
 * @see app/Http/Controllers/LeccionController.php:163
 * @route '/lecciones/{leccione}/edit'
 */
export const edit = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/lecciones/{leccione}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeccionController::edit
 * @see app/Http/Controllers/LeccionController.php:163
 * @route '/lecciones/{leccione}/edit'
 */
edit.url = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leccione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leccione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leccione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leccione: typeof args.leccione === 'object'
                ? args.leccione.id
                : args.leccione,
                }

    return edit.definition.url
            .replace('{leccione}', parsedArgs.leccione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeccionController::edit
 * @see app/Http/Controllers/LeccionController.php:163
 * @route '/lecciones/{leccione}/edit'
 */
edit.get = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeccionController::edit
 * @see app/Http/Controllers/LeccionController.php:163
 * @route '/lecciones/{leccione}/edit'
 */
edit.head = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LeccionController::edit
 * @see app/Http/Controllers/LeccionController.php:163
 * @route '/lecciones/{leccione}/edit'
 */
    const editForm = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LeccionController::edit
 * @see app/Http/Controllers/LeccionController.php:163
 * @route '/lecciones/{leccione}/edit'
 */
        editForm.get = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LeccionController::edit
 * @see app/Http/Controllers/LeccionController.php:163
 * @route '/lecciones/{leccione}/edit'
 */
        editForm.head = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LeccionController::update
 * @see app/Http/Controllers/LeccionController.php:196
 * @route '/lecciones/{leccione}'
 */
export const update = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/lecciones/{leccione}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\LeccionController::update
 * @see app/Http/Controllers/LeccionController.php:196
 * @route '/lecciones/{leccione}'
 */
update.url = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leccione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leccione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leccione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leccione: typeof args.leccione === 'object'
                ? args.leccione.id
                : args.leccione,
                }

    return update.definition.url
            .replace('{leccione}', parsedArgs.leccione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeccionController::update
 * @see app/Http/Controllers/LeccionController.php:196
 * @route '/lecciones/{leccione}'
 */
update.put = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\LeccionController::update
 * @see app/Http/Controllers/LeccionController.php:196
 * @route '/lecciones/{leccione}'
 */
update.patch = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LeccionController::update
 * @see app/Http/Controllers/LeccionController.php:196
 * @route '/lecciones/{leccione}'
 */
    const updateForm = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LeccionController::update
 * @see app/Http/Controllers/LeccionController.php:196
 * @route '/lecciones/{leccione}'
 */
        updateForm.put = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\LeccionController::update
 * @see app/Http/Controllers/LeccionController.php:196
 * @route '/lecciones/{leccione}'
 */
        updateForm.patch = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LeccionController::destroy
 * @see app/Http/Controllers/LeccionController.php:221
 * @route '/lecciones/{leccione}'
 */
export const destroy = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/lecciones/{leccione}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LeccionController::destroy
 * @see app/Http/Controllers/LeccionController.php:221
 * @route '/lecciones/{leccione}'
 */
destroy.url = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leccione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leccione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leccione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leccione: typeof args.leccione === 'object'
                ? args.leccione.id
                : args.leccione,
                }

    return destroy.definition.url
            .replace('{leccione}', parsedArgs.leccione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeccionController::destroy
 * @see app/Http/Controllers/LeccionController.php:221
 * @route '/lecciones/{leccione}'
 */
destroy.delete = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\LeccionController::destroy
 * @see app/Http/Controllers/LeccionController.php:221
 * @route '/lecciones/{leccione}'
 */
    const destroyForm = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LeccionController::destroy
 * @see app/Http/Controllers/LeccionController.php:221
 * @route '/lecciones/{leccione}'
 */
        destroyForm.delete = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LeccionController::publicar
 * @see app/Http/Controllers/LeccionController.php:242
 * @route '/lecciones/{leccione}/publicar'
 */
export const publicar = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: publicar.url(args, options),
    method: 'patch',
})

publicar.definition = {
    methods: ["patch"],
    url: '/lecciones/{leccione}/publicar',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LeccionController::publicar
 * @see app/Http/Controllers/LeccionController.php:242
 * @route '/lecciones/{leccione}/publicar'
 */
publicar.url = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leccione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leccione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leccione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leccione: typeof args.leccione === 'object'
                ? args.leccione.id
                : args.leccione,
                }

    return publicar.definition.url
            .replace('{leccione}', parsedArgs.leccione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeccionController::publicar
 * @see app/Http/Controllers/LeccionController.php:242
 * @route '/lecciones/{leccione}/publicar'
 */
publicar.patch = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: publicar.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LeccionController::publicar
 * @see app/Http/Controllers/LeccionController.php:242
 * @route '/lecciones/{leccione}/publicar'
 */
    const publicarForm = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: publicar.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LeccionController::publicar
 * @see app/Http/Controllers/LeccionController.php:242
 * @route '/lecciones/{leccione}/publicar'
 */
        publicarForm.patch = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LeccionController::archivar
 * @see app/Http/Controllers/LeccionController.php:260
 * @route '/lecciones/{leccione}/archivar'
 */
export const archivar = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: archivar.url(args, options),
    method: 'patch',
})

archivar.definition = {
    methods: ["patch"],
    url: '/lecciones/{leccione}/archivar',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LeccionController::archivar
 * @see app/Http/Controllers/LeccionController.php:260
 * @route '/lecciones/{leccione}/archivar'
 */
archivar.url = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leccione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leccione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leccione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leccione: typeof args.leccione === 'object'
                ? args.leccione.id
                : args.leccione,
                }

    return archivar.definition.url
            .replace('{leccione}', parsedArgs.leccione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeccionController::archivar
 * @see app/Http/Controllers/LeccionController.php:260
 * @route '/lecciones/{leccione}/archivar'
 */
archivar.patch = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: archivar.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LeccionController::archivar
 * @see app/Http/Controllers/LeccionController.php:260
 * @route '/lecciones/{leccione}/archivar'
 */
    const archivarForm = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: archivar.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LeccionController::archivar
 * @see app/Http/Controllers/LeccionController.php:260
 * @route '/lecciones/{leccione}/archivar'
 */
        archivarForm.patch = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LeccionController::reordenar
 * @see app/Http/Controllers/LeccionController.php:278
 * @route '/lecciones/reordenar'
 */
export const reordenar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reordenar.url(options),
    method: 'post',
})

reordenar.definition = {
    methods: ["post"],
    url: '/lecciones/reordenar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeccionController::reordenar
 * @see app/Http/Controllers/LeccionController.php:278
 * @route '/lecciones/reordenar'
 */
reordenar.url = (options?: RouteQueryOptions) => {
    return reordenar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeccionController::reordenar
 * @see app/Http/Controllers/LeccionController.php:278
 * @route '/lecciones/reordenar'
 */
reordenar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reordenar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LeccionController::reordenar
 * @see app/Http/Controllers/LeccionController.php:278
 * @route '/lecciones/reordenar'
 */
    const reordenarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reordenar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LeccionController::reordenar
 * @see app/Http/Controllers/LeccionController.php:278
 * @route '/lecciones/reordenar'
 */
        reordenarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reordenar.url(options),
            method: 'post',
        })
    
    reordenar.form = reordenarForm
/**
* @see \App\Http\Controllers\LeccionController::duplicar
 * @see app/Http/Controllers/LeccionController.php:293
 * @route '/lecciones/{leccione}/duplicar'
 */
export const duplicar = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: duplicar.url(args, options),
    method: 'post',
})

duplicar.definition = {
    methods: ["post"],
    url: '/lecciones/{leccione}/duplicar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeccionController::duplicar
 * @see app/Http/Controllers/LeccionController.php:293
 * @route '/lecciones/{leccione}/duplicar'
 */
duplicar.url = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leccione: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leccione: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leccione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leccione: typeof args.leccione === 'object'
                ? args.leccione.id
                : args.leccione,
                }

    return duplicar.definition.url
            .replace('{leccione}', parsedArgs.leccione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeccionController::duplicar
 * @see app/Http/Controllers/LeccionController.php:293
 * @route '/lecciones/{leccione}/duplicar'
 */
duplicar.post = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: duplicar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LeccionController::duplicar
 * @see app/Http/Controllers/LeccionController.php:293
 * @route '/lecciones/{leccione}/duplicar'
 */
    const duplicarForm = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: duplicar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LeccionController::duplicar
 * @see app/Http/Controllers/LeccionController.php:293
 * @route '/lecciones/{leccione}/duplicar'
 */
        duplicarForm.post = (args: { leccione: number | { id: number } } | [leccione: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: duplicar.url(args, options),
            method: 'post',
        })
    
    duplicar.form = duplicarForm
const lecciones = {
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

export default lecciones