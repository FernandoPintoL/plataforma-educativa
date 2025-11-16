import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CursoController::index
 * @see [unknown]:0
 * @route '/cursos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cursos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CursoController::index
 * @see [unknown]:0
 * @route '/cursos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CursoController::index
 * @see [unknown]:0
 * @route '/cursos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CursoController::index
 * @see [unknown]:0
 * @route '/cursos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CursoController::index
 * @see [unknown]:0
 * @route '/cursos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CursoController::index
 * @see [unknown]:0
 * @route '/cursos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CursoController::index
 * @see [unknown]:0
 * @route '/cursos'
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
* @see \App\Http\Controllers\CursoController::show
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
export const show = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cursos/{curso}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CursoController::show
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
show.url = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { curso: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    curso: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        curso: args.curso,
                }

    return show.definition.url
            .replace('{curso}', parsedArgs.curso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CursoController::show
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
show.get = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CursoController::show
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
show.head = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CursoController::show
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
    const showForm = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CursoController::show
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
        showForm.get = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CursoController::show
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
        showForm.head = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CursoController::create
 * @see [unknown]:0
 * @route '/cursos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/cursos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CursoController::create
 * @see [unknown]:0
 * @route '/cursos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CursoController::create
 * @see [unknown]:0
 * @route '/cursos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CursoController::create
 * @see [unknown]:0
 * @route '/cursos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CursoController::create
 * @see [unknown]:0
 * @route '/cursos/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CursoController::create
 * @see [unknown]:0
 * @route '/cursos/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CursoController::create
 * @see [unknown]:0
 * @route '/cursos/create'
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
* @see \App\Http\Controllers\CursoController::store
 * @see [unknown]:0
 * @route '/cursos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cursos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CursoController::store
 * @see [unknown]:0
 * @route '/cursos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CursoController::store
 * @see [unknown]:0
 * @route '/cursos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CursoController::store
 * @see [unknown]:0
 * @route '/cursos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CursoController::store
 * @see [unknown]:0
 * @route '/cursos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CursoController::edit
 * @see [unknown]:0
 * @route '/cursos/{curso}/edit'
 */
export const edit = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/cursos/{curso}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CursoController::edit
 * @see [unknown]:0
 * @route '/cursos/{curso}/edit'
 */
edit.url = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { curso: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    curso: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        curso: args.curso,
                }

    return edit.definition.url
            .replace('{curso}', parsedArgs.curso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CursoController::edit
 * @see [unknown]:0
 * @route '/cursos/{curso}/edit'
 */
edit.get = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CursoController::edit
 * @see [unknown]:0
 * @route '/cursos/{curso}/edit'
 */
edit.head = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CursoController::edit
 * @see [unknown]:0
 * @route '/cursos/{curso}/edit'
 */
    const editForm = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CursoController::edit
 * @see [unknown]:0
 * @route '/cursos/{curso}/edit'
 */
        editForm.get = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CursoController::edit
 * @see [unknown]:0
 * @route '/cursos/{curso}/edit'
 */
        editForm.head = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CursoController::update
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
export const update = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/cursos/{curso}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CursoController::update
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
update.url = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { curso: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    curso: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        curso: args.curso,
                }

    return update.definition.url
            .replace('{curso}', parsedArgs.curso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CursoController::update
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
update.put = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CursoController::update
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
update.patch = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CursoController::update
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
    const updateForm = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CursoController::update
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
        updateForm.put = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\CursoController::update
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
        updateForm.patch = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CursoController::destroy
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
export const destroy = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cursos/{curso}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CursoController::destroy
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
destroy.url = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { curso: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    curso: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        curso: args.curso,
                }

    return destroy.definition.url
            .replace('{curso}', parsedArgs.curso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CursoController::destroy
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
destroy.delete = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CursoController::destroy
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
    const destroyForm = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CursoController::destroy
 * @see [unknown]:0
 * @route '/cursos/{curso}'
 */
        destroyForm.delete = (args: { curso: string | number } | [curso: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const cursos = {
    index,
show,
create,
store,
edit,
update,
destroy,
}

export default cursos