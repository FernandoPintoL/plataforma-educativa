import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TareaController::getHintsParaTarea
 * @see app/Http/Controllers/TareaController.php:788
 * @route '/api/tareas/{tareaId}/hints'
 */
export const getHintsParaTarea = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHintsParaTarea.url(args, options),
    method: 'get',
})

getHintsParaTarea.definition = {
    methods: ["get","head"],
    url: '/api/tareas/{tareaId}/hints',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TareaController::getHintsParaTarea
 * @see app/Http/Controllers/TareaController.php:788
 * @route '/api/tareas/{tareaId}/hints'
 */
getHintsParaTarea.url = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getHintsParaTarea.definition.url
            .replace('{tareaId}', parsedArgs.tareaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::getHintsParaTarea
 * @see app/Http/Controllers/TareaController.php:788
 * @route '/api/tareas/{tareaId}/hints'
 */
getHintsParaTarea.get = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHintsParaTarea.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TareaController::getHintsParaTarea
 * @see app/Http/Controllers/TareaController.php:788
 * @route '/api/tareas/{tareaId}/hints'
 */
getHintsParaTarea.head = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getHintsParaTarea.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TareaController::getHintsParaTarea
 * @see app/Http/Controllers/TareaController.php:788
 * @route '/api/tareas/{tareaId}/hints'
 */
    const getHintsParaTareaForm = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getHintsParaTarea.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TareaController::getHintsParaTarea
 * @see app/Http/Controllers/TareaController.php:788
 * @route '/api/tareas/{tareaId}/hints'
 */
        getHintsParaTareaForm.get = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHintsParaTarea.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TareaController::getHintsParaTarea
 * @see app/Http/Controllers/TareaController.php:788
 * @route '/api/tareas/{tareaId}/hints'
 */
        getHintsParaTareaForm.head = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHintsParaTarea.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getHintsParaTarea.form = getHintsParaTareaForm
/**
* @see \App\Http\Controllers\TareaController::registrarActividad
 * @see app/Http/Controllers/TareaController.php:847
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
* @see \App\Http\Controllers\TareaController::registrarActividad
 * @see app/Http/Controllers/TareaController.php:847
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
* @see \App\Http\Controllers\TareaController::registrarActividad
 * @see app/Http/Controllers/TareaController.php:847
 * @route '/api/tareas/{tareaId}/actividad'
 */
registrarActividad.post = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarActividad.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TareaController::registrarActividad
 * @see app/Http/Controllers/TareaController.php:847
 * @route '/api/tareas/{tareaId}/actividad'
 */
    const registrarActividadForm = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarActividad.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TareaController::registrarActividad
 * @see app/Http/Controllers/TareaController.php:847
 * @route '/api/tareas/{tareaId}/actividad'
 */
        registrarActividadForm.post = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarActividad.url(args, options),
            method: 'post',
        })
    
    registrarActividad.form = registrarActividadForm
/**
* @see \App\Http\Controllers\TareaController::getAnalisisProfesor
 * @see app/Http/Controllers/TareaController.php:952
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
export const getAnalisisProfesor = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnalisisProfesor.url(args, options),
    method: 'get',
})

getAnalisisProfesor.definition = {
    methods: ["get","head"],
    url: '/api/tareas/{tareaId}/analisis-profesor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TareaController::getAnalisisProfesor
 * @see app/Http/Controllers/TareaController.php:952
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
getAnalisisProfesor.url = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getAnalisisProfesor.definition.url
            .replace('{tareaId}', parsedArgs.tareaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::getAnalisisProfesor
 * @see app/Http/Controllers/TareaController.php:952
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
getAnalisisProfesor.get = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnalisisProfesor.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TareaController::getAnalisisProfesor
 * @see app/Http/Controllers/TareaController.php:952
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
getAnalisisProfesor.head = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAnalisisProfesor.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TareaController::getAnalisisProfesor
 * @see app/Http/Controllers/TareaController.php:952
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
    const getAnalisisProfesorForm = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAnalisisProfesor.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TareaController::getAnalisisProfesor
 * @see app/Http/Controllers/TareaController.php:952
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
        getAnalisisProfesorForm.get = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnalisisProfesor.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TareaController::getAnalisisProfesor
 * @see app/Http/Controllers/TareaController.php:952
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
        getAnalisisProfesorForm.head = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnalisisProfesor.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getAnalisisProfesor.form = getAnalisisProfesorForm
/**
* @see \App\Http\Controllers\TareaController::getProgresoTrabajo
 * @see app/Http/Controllers/TareaController.php:904
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
export const getProgresoTrabajo = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getProgresoTrabajo.url(args, options),
    method: 'get',
})

getProgresoTrabajo.definition = {
    methods: ["get","head"],
    url: '/api/trabajos/{trabajoId}/progreso',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TareaController::getProgresoTrabajo
 * @see app/Http/Controllers/TareaController.php:904
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
getProgresoTrabajo.url = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getProgresoTrabajo.definition.url
            .replace('{trabajoId}', parsedArgs.trabajoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::getProgresoTrabajo
 * @see app/Http/Controllers/TareaController.php:904
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
getProgresoTrabajo.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getProgresoTrabajo.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TareaController::getProgresoTrabajo
 * @see app/Http/Controllers/TareaController.php:904
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
getProgresoTrabajo.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getProgresoTrabajo.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TareaController::getProgresoTrabajo
 * @see app/Http/Controllers/TareaController.php:904
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
    const getProgresoTrabajoForm = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getProgresoTrabajo.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TareaController::getProgresoTrabajo
 * @see app/Http/Controllers/TareaController.php:904
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
        getProgresoTrabajoForm.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getProgresoTrabajo.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TareaController::getProgresoTrabajo
 * @see app/Http/Controllers/TareaController.php:904
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
        getProgresoTrabajoForm.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getProgresoTrabajo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getProgresoTrabajo.form = getProgresoTrabajoForm
/**
* @see \App\Http\Controllers\TareaController::getHistorialHints
 * @see app/Http/Controllers/TareaController.php:1001
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
export const getHistorialHints = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHistorialHints.url(args, options),
    method: 'get',
})

getHistorialHints.definition = {
    methods: ["get","head"],
    url: '/api/trabajos/{trabajoId}/hints-historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TareaController::getHistorialHints
 * @see app/Http/Controllers/TareaController.php:1001
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
getHistorialHints.url = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getHistorialHints.definition.url
            .replace('{trabajoId}', parsedArgs.trabajoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::getHistorialHints
 * @see app/Http/Controllers/TareaController.php:1001
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
getHistorialHints.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHistorialHints.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TareaController::getHistorialHints
 * @see app/Http/Controllers/TareaController.php:1001
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
getHistorialHints.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getHistorialHints.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TareaController::getHistorialHints
 * @see app/Http/Controllers/TareaController.php:1001
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
    const getHistorialHintsForm = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getHistorialHints.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TareaController::getHistorialHints
 * @see app/Http/Controllers/TareaController.php:1001
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
        getHistorialHintsForm.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHistorialHints.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TareaController::getHistorialHints
 * @see app/Http/Controllers/TareaController.php:1001
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
        getHistorialHintsForm.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHistorialHints.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getHistorialHints.form = getHistorialHintsForm
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
const update4a54e2dfee02fdfe7c497bc9f62299b2 = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update4a54e2dfee02fdfe7c497bc9f62299b2.url(args, options),
    method: 'put',
})

update4a54e2dfee02fdfe7c497bc9f62299b2.definition = {
    methods: ["put"],
    url: '/tareas/{tarea}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TareaController::update
 * @see app/Http/Controllers/TareaController.php:612
 * @route '/tareas/{tarea}'
 */
update4a54e2dfee02fdfe7c497bc9f62299b2.url = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update4a54e2dfee02fdfe7c497bc9f62299b2.definition.url
            .replace('{tarea}', parsedArgs.tarea.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::update
 * @see app/Http/Controllers/TareaController.php:612
 * @route '/tareas/{tarea}'
 */
update4a54e2dfee02fdfe7c497bc9f62299b2.put = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update4a54e2dfee02fdfe7c497bc9f62299b2.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\TareaController::update
 * @see app/Http/Controllers/TareaController.php:612
 * @route '/tareas/{tarea}'
 */
    const update4a54e2dfee02fdfe7c497bc9f62299b2Form = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update4a54e2dfee02fdfe7c497bc9f62299b2.url(args, {
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
        update4a54e2dfee02fdfe7c497bc9f62299b2Form.put = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update4a54e2dfee02fdfe7c497bc9f62299b2.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update4a54e2dfee02fdfe7c497bc9f62299b2.form = update4a54e2dfee02fdfe7c497bc9f62299b2Form
    /**
* @see \App\Http\Controllers\TareaController::update
 * @see app/Http/Controllers/TareaController.php:612
 * @route '/tareas/{tarea}'
 */
const update4a54e2dfee02fdfe7c497bc9f62299b2 = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update4a54e2dfee02fdfe7c497bc9f62299b2.url(args, options),
    method: 'patch',
})

update4a54e2dfee02fdfe7c497bc9f62299b2.definition = {
    methods: ["patch"],
    url: '/tareas/{tarea}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\TareaController::update
 * @see app/Http/Controllers/TareaController.php:612
 * @route '/tareas/{tarea}'
 */
update4a54e2dfee02fdfe7c497bc9f62299b2.url = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update4a54e2dfee02fdfe7c497bc9f62299b2.definition.url
            .replace('{tarea}', parsedArgs.tarea.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::update
 * @see app/Http/Controllers/TareaController.php:612
 * @route '/tareas/{tarea}'
 */
update4a54e2dfee02fdfe7c497bc9f62299b2.patch = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update4a54e2dfee02fdfe7c497bc9f62299b2.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TareaController::update
 * @see app/Http/Controllers/TareaController.php:612
 * @route '/tareas/{tarea}'
 */
    const update4a54e2dfee02fdfe7c497bc9f62299b2Form = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update4a54e2dfee02fdfe7c497bc9f62299b2.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
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
        update4a54e2dfee02fdfe7c497bc9f62299b2Form.patch = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update4a54e2dfee02fdfe7c497bc9f62299b2.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update4a54e2dfee02fdfe7c497bc9f62299b2.form = update4a54e2dfee02fdfe7c497bc9f62299b2Form

export const update = {
    '/tareas/{tarea}': update4a54e2dfee02fdfe7c497bc9f62299b2,
    '/tareas/{tarea}': update4a54e2dfee02fdfe7c497bc9f62299b2,
}

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
const TareaController = { getHintsParaTarea, registrarActividad, getAnalisisProfesor, getProgresoTrabajo, getHistorialHints, index, create, store, show, edit, update, destroy }

export default TareaController