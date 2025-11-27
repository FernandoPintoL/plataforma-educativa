import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../wayfinder'
/**
* @see \TareaController::getHintsParaTarea
 * @see [unknown]:0
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
* @see \TareaController::getHintsParaTarea
 * @see [unknown]:0
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
* @see \TareaController::getHintsParaTarea
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/hints'
 */
getHintsParaTarea.get = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHintsParaTarea.url(args, options),
    method: 'get',
})
/**
* @see \TareaController::getHintsParaTarea
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/hints'
 */
getHintsParaTarea.head = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getHintsParaTarea.url(args, options),
    method: 'head',
})

    /**
* @see \TareaController::getHintsParaTarea
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/hints'
 */
    const getHintsParaTareaForm = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getHintsParaTarea.url(args, options),
        method: 'get',
    })

            /**
* @see \TareaController::getHintsParaTarea
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/hints'
 */
        getHintsParaTareaForm.get = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHintsParaTarea.url(args, options),
            method: 'get',
        })
            /**
* @see \TareaController::getHintsParaTarea
 * @see [unknown]:0
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
* @see \TareaController::getAnalisisProfesor
 * @see [unknown]:0
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
* @see \TareaController::getAnalisisProfesor
 * @see [unknown]:0
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
* @see \TareaController::getAnalisisProfesor
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
getAnalisisProfesor.get = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAnalisisProfesor.url(args, options),
    method: 'get',
})
/**
* @see \TareaController::getAnalisisProfesor
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
getAnalisisProfesor.head = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAnalisisProfesor.url(args, options),
    method: 'head',
})

    /**
* @see \TareaController::getAnalisisProfesor
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
    const getAnalisisProfesorForm = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAnalisisProfesor.url(args, options),
        method: 'get',
    })

            /**
* @see \TareaController::getAnalisisProfesor
 * @see [unknown]:0
 * @route '/api/tareas/{tareaId}/analisis-profesor'
 */
        getAnalisisProfesorForm.get = (args: { tareaId: string | number } | [tareaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAnalisisProfesor.url(args, options),
            method: 'get',
        })
            /**
* @see \TareaController::getAnalisisProfesor
 * @see [unknown]:0
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
* @see \TareaController::getProgresoTrabajo
 * @see [unknown]:0
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
* @see \TareaController::getProgresoTrabajo
 * @see [unknown]:0
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
* @see \TareaController::getProgresoTrabajo
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
getProgresoTrabajo.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getProgresoTrabajo.url(args, options),
    method: 'get',
})
/**
* @see \TareaController::getProgresoTrabajo
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
getProgresoTrabajo.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getProgresoTrabajo.url(args, options),
    method: 'head',
})

    /**
* @see \TareaController::getProgresoTrabajo
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
    const getProgresoTrabajoForm = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getProgresoTrabajo.url(args, options),
        method: 'get',
    })

            /**
* @see \TareaController::getProgresoTrabajo
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/progreso'
 */
        getProgresoTrabajoForm.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getProgresoTrabajo.url(args, options),
            method: 'get',
        })
            /**
* @see \TareaController::getProgresoTrabajo
 * @see [unknown]:0
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
* @see \TareaController::getHistorialHints
 * @see [unknown]:0
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
* @see \TareaController::getHistorialHints
 * @see [unknown]:0
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
* @see \TareaController::getHistorialHints
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
getHistorialHints.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHistorialHints.url(args, options),
    method: 'get',
})
/**
* @see \TareaController::getHistorialHints
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
getHistorialHints.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getHistorialHints.url(args, options),
    method: 'head',
})

    /**
* @see \TareaController::getHistorialHints
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
    const getHistorialHintsForm = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getHistorialHints.url(args, options),
        method: 'get',
    })

            /**
* @see \TareaController::getHistorialHints
 * @see [unknown]:0
 * @route '/api/trabajos/{trabajoId}/hints-historial'
 */
        getHistorialHintsForm.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getHistorialHints.url(args, options),
            method: 'get',
        })
            /**
* @see \TareaController::getHistorialHints
 * @see [unknown]:0
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
const TareaController = { getHintsParaTarea, registrarActividad, getAnalisisProfesor, getProgresoTrabajo, getHistorialHints }

export default TareaController