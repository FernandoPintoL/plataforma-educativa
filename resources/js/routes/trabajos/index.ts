import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import calificacion from './calificacion'
/**
* @see \TareaController::progreso
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
export const progreso = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progreso.url(args, options),
    method: 'get',
})

progreso.definition = {
    methods: ["get","head"],
    url: '/api/trabajos/{trabajoId}/progreso',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \TareaController::progreso
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
progreso.url = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { trabajoId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    trabajoId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        trabajoId: args.trabajoId,
                }

    return progreso.definition.url
            .replace('{trabajoId}', parsedArgs.trabajoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \TareaController::progreso
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
progreso.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progreso.url(args, options),
    method: 'get',
})
/**
* @see \TareaController::progreso
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
progreso.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: progreso.url(args, options),
    method: 'head',
})

    /**
* @see \TareaController::progreso
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
    const progresoForm = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: progreso.url(args, options),
        method: 'get',
    })

            /**
* @see \TareaController::progreso
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
        progresoForm.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: progreso.url(args, options),
            method: 'get',
        })
            /**
* @see \TareaController::progreso
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
        progresoForm.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: progreso.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    progreso.form = progresoForm
/**
* @see \TareaController::hintsHistorial
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
export const hintsHistorial = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hintsHistorial.url(args, options),
    method: 'get',
})

hintsHistorial.definition = {
    methods: ["get","head"],
    url: '/api/trabajos/{trabajoId}/hints-historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \TareaController::hintsHistorial
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
hintsHistorial.url = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { trabajoId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    trabajoId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        trabajoId: args.trabajoId,
                }

    return hintsHistorial.definition.url
            .replace('{trabajoId}', parsedArgs.trabajoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \TareaController::hintsHistorial
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
hintsHistorial.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hintsHistorial.url(args, options),
    method: 'get',
})
/**
* @see \TareaController::hintsHistorial
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
hintsHistorial.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: hintsHistorial.url(args, options),
    method: 'head',
})

    /**
* @see \TareaController::hintsHistorial
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
    const hintsHistorialForm = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: hintsHistorial.url(args, options),
        method: 'get',
    })

            /**
* @see \TareaController::hintsHistorial
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
        hintsHistorialForm.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: hintsHistorial.url(args, options),
            method: 'get',
        })
            /**
* @see \TareaController::hintsHistorial
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
        hintsHistorialForm.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: hintsHistorial.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    hintsHistorial.form = hintsHistorialForm
/**
* @see \App\Http\Controllers\TrabajoController::index
 * @see app/Http/Controllers/TrabajoController.php:18
 * @route '/trabajos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/trabajos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TrabajoController::index
 * @see app/Http/Controllers/TrabajoController.php:18
 * @route '/trabajos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrabajoController::index
 * @see app/Http/Controllers/TrabajoController.php:18
 * @route '/trabajos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TrabajoController::index
 * @see app/Http/Controllers/TrabajoController.php:18
 * @route '/trabajos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TrabajoController::index
 * @see app/Http/Controllers/TrabajoController.php:18
 * @route '/trabajos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TrabajoController::index
 * @see app/Http/Controllers/TrabajoController.php:18
 * @route '/trabajos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TrabajoController::index
 * @see app/Http/Controllers/TrabajoController.php:18
 * @route '/trabajos'
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
* @see \App\Http\Controllers\TrabajoController::create
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/trabajos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TrabajoController::create
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrabajoController::create
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TrabajoController::create
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TrabajoController::create
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TrabajoController::create
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TrabajoController::create
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/create'
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
* @see \App\Http\Controllers\TrabajoController::store
 * @see app/Http/Controllers/TrabajoController.php:74
 * @route '/trabajos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trabajos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TrabajoController::store
 * @see app/Http/Controllers/TrabajoController.php:74
 * @route '/trabajos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrabajoController::store
 * @see app/Http/Controllers/TrabajoController.php:74
 * @route '/trabajos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TrabajoController::store
 * @see app/Http/Controllers/TrabajoController.php:74
 * @route '/trabajos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TrabajoController::store
 * @see app/Http/Controllers/TrabajoController.php:74
 * @route '/trabajos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TrabajoController::show
 * @see app/Http/Controllers/TrabajoController.php:169
 * @route '/trabajos/{trabajo}'
 */
export const show = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/trabajos/{trabajo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TrabajoController::show
 * @see app/Http/Controllers/TrabajoController.php:169
 * @route '/trabajos/{trabajo}'
 */
show.url = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { trabajo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { trabajo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    trabajo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        trabajo: typeof args.trabajo === 'object'
                ? args.trabajo.id
                : args.trabajo,
                }

    return show.definition.url
            .replace('{trabajo}', parsedArgs.trabajo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrabajoController::show
 * @see app/Http/Controllers/TrabajoController.php:169
 * @route '/trabajos/{trabajo}'
 */
show.get = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TrabajoController::show
 * @see app/Http/Controllers/TrabajoController.php:169
 * @route '/trabajos/{trabajo}'
 */
show.head = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TrabajoController::show
 * @see app/Http/Controllers/TrabajoController.php:169
 * @route '/trabajos/{trabajo}'
 */
    const showForm = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TrabajoController::show
 * @see app/Http/Controllers/TrabajoController.php:169
 * @route '/trabajos/{trabajo}'
 */
        showForm.get = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TrabajoController::show
 * @see app/Http/Controllers/TrabajoController.php:169
 * @route '/trabajos/{trabajo}'
 */
        showForm.head = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TrabajoController::edit
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/{trabajo}/edit'
 */
export const edit = (args: { trabajo: string | number } | [trabajo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/trabajos/{trabajo}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TrabajoController::edit
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/{trabajo}/edit'
 */
edit.url = (args: { trabajo: string | number } | [trabajo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { trabajo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    trabajo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        trabajo: args.trabajo,
                }

    return edit.definition.url
            .replace('{trabajo}', parsedArgs.trabajo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrabajoController::edit
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/{trabajo}/edit'
 */
edit.get = (args: { trabajo: string | number } | [trabajo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TrabajoController::edit
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/{trabajo}/edit'
 */
edit.head = (args: { trabajo: string | number } | [trabajo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TrabajoController::edit
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/{trabajo}/edit'
 */
    const editForm = (args: { trabajo: string | number } | [trabajo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TrabajoController::edit
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/{trabajo}/edit'
 */
        editForm.get = (args: { trabajo: string | number } | [trabajo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TrabajoController::edit
 * @see app/Http/Controllers/TrabajoController.php:0
 * @route '/trabajos/{trabajo}/edit'
 */
        editForm.head = (args: { trabajo: string | number } | [trabajo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TrabajoController::update
 * @see app/Http/Controllers/TrabajoController.php:197
 * @route '/trabajos/{trabajo}'
 */
export const update = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/trabajos/{trabajo}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TrabajoController::update
 * @see app/Http/Controllers/TrabajoController.php:197
 * @route '/trabajos/{trabajo}'
 */
update.url = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { trabajo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { trabajo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    trabajo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        trabajo: typeof args.trabajo === 'object'
                ? args.trabajo.id
                : args.trabajo,
                }

    return update.definition.url
            .replace('{trabajo}', parsedArgs.trabajo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrabajoController::update
 * @see app/Http/Controllers/TrabajoController.php:197
 * @route '/trabajos/{trabajo}'
 */
update.put = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TrabajoController::update
 * @see app/Http/Controllers/TrabajoController.php:197
 * @route '/trabajos/{trabajo}'
 */
update.patch = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TrabajoController::update
 * @see app/Http/Controllers/TrabajoController.php:197
 * @route '/trabajos/{trabajo}'
 */
    const updateForm = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TrabajoController::update
 * @see app/Http/Controllers/TrabajoController.php:197
 * @route '/trabajos/{trabajo}'
 */
        updateForm.put = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\TrabajoController::update
 * @see app/Http/Controllers/TrabajoController.php:197
 * @route '/trabajos/{trabajo}'
 */
        updateForm.patch = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TrabajoController::destroy
 * @see app/Http/Controllers/TrabajoController.php:260
 * @route '/trabajos/{trabajo}'
 */
export const destroy = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/trabajos/{trabajo}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TrabajoController::destroy
 * @see app/Http/Controllers/TrabajoController.php:260
 * @route '/trabajos/{trabajo}'
 */
destroy.url = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { trabajo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { trabajo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    trabajo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        trabajo: typeof args.trabajo === 'object'
                ? args.trabajo.id
                : args.trabajo,
                }

    return destroy.definition.url
            .replace('{trabajo}', parsedArgs.trabajo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrabajoController::destroy
 * @see app/Http/Controllers/TrabajoController.php:260
 * @route '/trabajos/{trabajo}'
 */
destroy.delete = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TrabajoController::destroy
 * @see app/Http/Controllers/TrabajoController.php:260
 * @route '/trabajos/{trabajo}'
 */
    const destroyForm = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TrabajoController::destroy
 * @see app/Http/Controllers/TrabajoController.php:260
 * @route '/trabajos/{trabajo}'
 */
        destroyForm.delete = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TrabajoController::entregar
 * @see app/Http/Controllers/TrabajoController.php:74
 * @route '/tareas/{tarea}/entregar'
 */
export const entregar = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: entregar.url(args, options),
    method: 'post',
})

entregar.definition = {
    methods: ["post"],
    url: '/tareas/{tarea}/entregar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TrabajoController::entregar
 * @see app/Http/Controllers/TrabajoController.php:74
 * @route '/tareas/{tarea}/entregar'
 */
entregar.url = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tarea: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tarea: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tarea: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tarea: typeof args.tarea === 'object'
                ? args.tarea.id
                : args.tarea,
                }

    return entregar.definition.url
            .replace('{tarea}', parsedArgs.tarea.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrabajoController::entregar
 * @see app/Http/Controllers/TrabajoController.php:74
 * @route '/tareas/{tarea}/entregar'
 */
entregar.post = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: entregar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TrabajoController::entregar
 * @see app/Http/Controllers/TrabajoController.php:74
 * @route '/tareas/{tarea}/entregar'
 */
    const entregarForm = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: entregar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TrabajoController::entregar
 * @see app/Http/Controllers/TrabajoController.php:74
 * @route '/tareas/{tarea}/entregar'
 */
        entregarForm.post = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: entregar.url(args, options),
            method: 'post',
        })
    
    entregar.form = entregarForm
/**
* @see \App\Http\Controllers\TrabajoController::calificar
 * @see app/Http/Controllers/TrabajoController.php:334
 * @route '/trabajos/{trabajo}/calificar'
 */
export const calificar = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calificar.url(args, options),
    method: 'get',
})

calificar.definition = {
    methods: ["get","head"],
    url: '/trabajos/{trabajo}/calificar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TrabajoController::calificar
 * @see app/Http/Controllers/TrabajoController.php:334
 * @route '/trabajos/{trabajo}/calificar'
 */
calificar.url = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { trabajo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { trabajo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    trabajo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        trabajo: typeof args.trabajo === 'object'
                ? args.trabajo.id
                : args.trabajo,
                }

    return calificar.definition.url
            .replace('{trabajo}', parsedArgs.trabajo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrabajoController::calificar
 * @see app/Http/Controllers/TrabajoController.php:334
 * @route '/trabajos/{trabajo}/calificar'
 */
calificar.get = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calificar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TrabajoController::calificar
 * @see app/Http/Controllers/TrabajoController.php:334
 * @route '/trabajos/{trabajo}/calificar'
 */
calificar.head = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calificar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TrabajoController::calificar
 * @see app/Http/Controllers/TrabajoController.php:334
 * @route '/trabajos/{trabajo}/calificar'
 */
    const calificarForm = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: calificar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TrabajoController::calificar
 * @see app/Http/Controllers/TrabajoController.php:334
 * @route '/trabajos/{trabajo}/calificar'
 */
        calificarForm.get = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: calificar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TrabajoController::calificar
 * @see app/Http/Controllers/TrabajoController.php:334
 * @route '/trabajos/{trabajo}/calificar'
 */
        calificarForm.head = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: calificar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    calificar.form = calificarForm
/**
* @see \App\Http\Controllers\TrabajoController::descargarArchivo
 * @see app/Http/Controllers/TrabajoController.php:301
 * @route '/trabajos/{trabajo}/archivo/{archivoIndex}'
 */
export const descargarArchivo = (args: { trabajo: number | { id: number }, archivoIndex: string | number } | [trabajo: number | { id: number }, archivoIndex: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarArchivo.url(args, options),
    method: 'get',
})

descargarArchivo.definition = {
    methods: ["get","head"],
    url: '/trabajos/{trabajo}/archivo/{archivoIndex}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TrabajoController::descargarArchivo
 * @see app/Http/Controllers/TrabajoController.php:301
 * @route '/trabajos/{trabajo}/archivo/{archivoIndex}'
 */
descargarArchivo.url = (args: { trabajo: number | { id: number }, archivoIndex: string | number } | [trabajo: number | { id: number }, archivoIndex: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    trabajo: args[0],
                    archivoIndex: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        trabajo: typeof args.trabajo === 'object'
                ? args.trabajo.id
                : args.trabajo,
                                archivoIndex: args.archivoIndex,
                }

    return descargarArchivo.definition.url
            .replace('{trabajo}', parsedArgs.trabajo.toString())
            .replace('{archivoIndex}', parsedArgs.archivoIndex.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrabajoController::descargarArchivo
 * @see app/Http/Controllers/TrabajoController.php:301
 * @route '/trabajos/{trabajo}/archivo/{archivoIndex}'
 */
descargarArchivo.get = (args: { trabajo: number | { id: number }, archivoIndex: string | number } | [trabajo: number | { id: number }, archivoIndex: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarArchivo.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TrabajoController::descargarArchivo
 * @see app/Http/Controllers/TrabajoController.php:301
 * @route '/trabajos/{trabajo}/archivo/{archivoIndex}'
 */
descargarArchivo.head = (args: { trabajo: number | { id: number }, archivoIndex: string | number } | [trabajo: number | { id: number }, archivoIndex: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargarArchivo.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TrabajoController::descargarArchivo
 * @see app/Http/Controllers/TrabajoController.php:301
 * @route '/trabajos/{trabajo}/archivo/{archivoIndex}'
 */
    const descargarArchivoForm = (args: { trabajo: number | { id: number }, archivoIndex: string | number } | [trabajo: number | { id: number }, archivoIndex: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descargarArchivo.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TrabajoController::descargarArchivo
 * @see app/Http/Controllers/TrabajoController.php:301
 * @route '/trabajos/{trabajo}/archivo/{archivoIndex}'
 */
        descargarArchivoForm.get = (args: { trabajo: number | { id: number }, archivoIndex: string | number } | [trabajo: number | { id: number }, archivoIndex: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarArchivo.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TrabajoController::descargarArchivo
 * @see app/Http/Controllers/TrabajoController.php:301
 * @route '/trabajos/{trabajo}/archivo/{archivoIndex}'
 */
        descargarArchivoForm.head = (args: { trabajo: number | { id: number }, archivoIndex: string | number } | [trabajo: number | { id: number }, archivoIndex: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarArchivo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descargarArchivo.form = descargarArchivoForm
const trabajos = {
    progreso,
hintsHistorial,
index,
create,
store,
show,
edit,
update,
destroy,
entregar,
calificar,
descargarArchivo,
calificacion,
}

export default trabajos