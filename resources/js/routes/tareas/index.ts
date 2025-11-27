import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \TareaController::hints
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/hints'
 */
export const hints = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hints.url(args, options),
    method: 'get',
})

hints.definition = {
    methods: ["get","head"],
    url: '/api/tareas/{tareaId}/hints',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \TareaController::hints
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/hints'
 */
hints.url = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tareaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tareaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tareaId: args.tareaId,
                }

    return hints.definition.url
            .replace('{tareaId}', parsedArgs.tareaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \TareaController::hints
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/hints'
 */
hints.get = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hints.url(args, options),
    method: 'get',
})
/**
* @see \TareaController::hints
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/hints'
 */
hints.head = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: hints.url(args, options),
    method: 'head',
})

    /**
* @see \TareaController::hints
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/hints'
 */
    const hintsForm = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: hints.url(args, options),
        method: 'get',
    })

            /**
* @see \TareaController::hints
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/hints'
 */
        hintsForm.get = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: hints.url(args, options),
            method: 'get',
        })
            /**
* @see \TareaController::hints
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/hints'
 */
        hintsForm.head = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: hints.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    hints.form = hintsForm
/**
* @see \TareaController::registrarActividad
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/actividad'
 */
export const registrarActividad = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarActividad.url(args, options),
    method: 'post',
})

registrarActividad.definition = {
    methods: ["post"],
    url: '/api/tareas/{tareaId}/actividad',
} satisfies RouteDefinition<["post"]>

/**
* @see \TareaController::registrarActividad
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/actividad'
 */
registrarActividad.url = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tareaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tareaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tareaId: args.tareaId,
                }

    return registrarActividad.definition.url
            .replace('{tareaId}', parsedArgs.tareaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \TareaController::registrarActividad
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/actividad'
 */
registrarActividad.post = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarActividad.url(args, options),
    method: 'post',
})

    /**
* @see \TareaController::registrarActividad
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/actividad'
 */
    const registrarActividadForm = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarActividad.url(args, options),
        method: 'post',
    })

            /**
* @see \TareaController::registrarActividad
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/actividad'
 */
        registrarActividadForm.post = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarActividad.url(args, options),
            method: 'post',
        })
    
    registrarActividad.form = registrarActividadForm
/**
* @see \TareaController::analisisProfesor
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
export const analisisProfesor = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisisProfesor.url(args, options),
    method: 'get',
})

analisisProfesor.definition = {
    methods: ["get","head"],
    url: '/api/tareas/{tareaId}/analisis-profesor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \TareaController::analisisProfesor
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
analisisProfesor.url = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tareaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tareaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tareaId: args.tareaId,
                }

    return analisisProfesor.definition.url
            .replace('{tareaId}', parsedArgs.tareaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \TareaController::analisisProfesor
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
analisisProfesor.get = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisisProfesor.url(args, options),
    method: 'get',
})
/**
* @see \TareaController::analisisProfesor
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
analisisProfesor.head = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analisisProfesor.url(args, options),
    method: 'head',
})

    /**
* @see \TareaController::analisisProfesor
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
    const analisisProfesorForm = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analisisProfesor.url(args, options),
        method: 'get',
    })

            /**
* @see \TareaController::analisisProfesor
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
        analisisProfesorForm.get = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisisProfesor.url(args, options),
            method: 'get',
        })
            /**
* @see \TareaController::analisisProfesor
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
        analisisProfesorForm.head = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisisProfesor.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analisisProfesor.form = analisisProfesorForm
/**
* @see \App\Http\Controllers\TareaController::index
 * @see app/Http/Controllers/TareaController.php:48
 * @route '/tareas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tareas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TareaController::index
 * @see app/Http/Controllers/TareaController.php:48
 * @route '/tareas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::index
 * @see app/Http/Controllers/TareaController.php:48
 * @route '/tareas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TareaController::index
 * @see app/Http/Controllers/TareaController.php:48
 * @route '/tareas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TareaController::index
 * @see app/Http/Controllers/TareaController.php:48
 * @route '/tareas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TareaController::index
 * @see app/Http/Controllers/TareaController.php:48
 * @route '/tareas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TareaController::index
 * @see app/Http/Controllers/TareaController.php:48
 * @route '/tareas'
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
* @see \App\Http\Controllers\TareaController::create
 * @see app/Http/Controllers/TareaController.php:106
 * @route '/tareas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tareas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TareaController::create
 * @see app/Http/Controllers/TareaController.php:106
 * @route '/tareas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::create
 * @see app/Http/Controllers/TareaController.php:106
 * @route '/tareas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TareaController::create
 * @see app/Http/Controllers/TareaController.php:106
 * @route '/tareas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TareaController::create
 * @see app/Http/Controllers/TareaController.php:106
 * @route '/tareas/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TareaController::create
 * @see app/Http/Controllers/TareaController.php:106
 * @route '/tareas/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TareaController::create
 * @see app/Http/Controllers/TareaController.php:106
 * @route '/tareas/create'
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
* @see \App\Http\Controllers\TareaController::store
 * @see app/Http/Controllers/TareaController.php:126
 * @route '/tareas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tareas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TareaController::store
 * @see app/Http/Controllers/TareaController.php:126
 * @route '/tareas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::store
 * @see app/Http/Controllers/TareaController.php:126
 * @route '/tareas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TareaController::store
 * @see app/Http/Controllers/TareaController.php:126
 * @route '/tareas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TareaController::store
 * @see app/Http/Controllers/TareaController.php:126
 * @route '/tareas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TareaController::show
 * @see app/Http/Controllers/TareaController.php:218
 * @route '/tareas/{tarea}'
 */
export const show = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tareas/{tarea}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TareaController::show
 * @see app/Http/Controllers/TareaController.php:218
 * @route '/tareas/{tarea}'
 */
show.url = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{tarea}', parsedArgs.tarea.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::show
 * @see app/Http/Controllers/TareaController.php:218
 * @route '/tareas/{tarea}'
 */
show.get = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TareaController::show
 * @see app/Http/Controllers/TareaController.php:218
 * @route '/tareas/{tarea}'
 */
show.head = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TareaController::show
 * @see app/Http/Controllers/TareaController.php:218
 * @route '/tareas/{tarea}'
 */
    const showForm = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TareaController::show
 * @see app/Http/Controllers/TareaController.php:218
 * @route '/tareas/{tarea}'
 */
        showForm.get = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TareaController::show
 * @see app/Http/Controllers/TareaController.php:218
 * @route '/tareas/{tarea}'
 */
        showForm.head = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TareaController::edit
 * @see app/Http/Controllers/TareaController.php:590
 * @route '/tareas/{tarea}/edit'
 */
export const edit = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/tareas/{tarea}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TareaController::edit
 * @see app/Http/Controllers/TareaController.php:590
 * @route '/tareas/{tarea}/edit'
 */
edit.url = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{tarea}', parsedArgs.tarea.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::edit
 * @see app/Http/Controllers/TareaController.php:590
 * @route '/tareas/{tarea}/edit'
 */
edit.get = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TareaController::edit
 * @see app/Http/Controllers/TareaController.php:590
 * @route '/tareas/{tarea}/edit'
 */
edit.head = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TareaController::edit
 * @see app/Http/Controllers/TareaController.php:590
 * @route '/tareas/{tarea}/edit'
 */
    const editForm = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TareaController::edit
 * @see app/Http/Controllers/TareaController.php:590
 * @route '/tareas/{tarea}/edit'
 */
        editForm.get = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TareaController::edit
 * @see app/Http/Controllers/TareaController.php:590
 * @route '/tareas/{tarea}/edit'
 */
        editForm.head = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TareaController::update
 * @see app/Http/Controllers/TareaController.php:612
 * @route '/tareas/{tarea}'
 */
export const update = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/tareas/{tarea}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TareaController::update
 * @see app/Http/Controllers/TareaController.php:612
 * @route '/tareas/{tarea}'
 */
update.url = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{tarea}', parsedArgs.tarea.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::update
 * @see app/Http/Controllers/TareaController.php:612
 * @route '/tareas/{tarea}'
 */
update.put = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\TareaController::update
 * @see app/Http/Controllers/TareaController.php:612
 * @route '/tareas/{tarea}'
 */
    const updateForm = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TareaController::update
 * @see app/Http/Controllers/TareaController.php:612
 * @route '/tareas/{tarea}'
 */
        updateForm.put = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\TareaController::destroy
 * @see app/Http/Controllers/TareaController.php:699
 * @route '/tareas/{tarea}'
 */
export const destroy = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tareas/{tarea}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TareaController::destroy
 * @see app/Http/Controllers/TareaController.php:699
 * @route '/tareas/{tarea}'
 */
destroy.url = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{tarea}', parsedArgs.tarea.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::destroy
 * @see app/Http/Controllers/TareaController.php:699
 * @route '/tareas/{tarea}'
 */
destroy.delete = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TareaController::destroy
 * @see app/Http/Controllers/TareaController.php:699
 * @route '/tareas/{tarea}'
 */
    const destroyForm = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TareaController::destroy
 * @see app/Http/Controllers/TareaController.php:699
 * @route '/tareas/{tarea}'
 */
        destroyForm.delete = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const tareas = {
    hints,
registrarActividad,
analisisProfesor,
index,
create,
store,
show,
edit,
update,
destroy,
}

export default tareas