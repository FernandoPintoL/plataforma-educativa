import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
export const dashboardEstudiante = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardEstudiante.url(options),
    method: 'get',
})

dashboardEstudiante.definition = {
    methods: ["get","head"],
    url: '/dashboard/alertas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
dashboardEstudiante.url = (options?: RouteQueryOptions) => {
    return dashboardEstudiante.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
dashboardEstudiante.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardEstudiante.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
dashboardEstudiante.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboardEstudiante.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
    const dashboardEstudianteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboardEstudiante.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
        dashboardEstudianteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardEstudiante.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
        dashboardEstudianteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardEstudiante.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboardEstudiante.form = dashboardEstudianteForm
/**
* @see \App\Http\Controllers\DashboardAlertsController::marcarSugerenciaUtilizada
 * @see app/Http/Controllers/DashboardAlertsController.php:144
 * @route '/dashboard/sugerencias/{sugerenciaId}/marcar-utilizada'
 */
export const marcarSugerenciaUtilizada = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarSugerenciaUtilizada.url(args, options),
    method: 'post',
})

marcarSugerenciaUtilizada.definition = {
    methods: ["post"],
    url: '/dashboard/sugerencias/{sugerenciaId}/marcar-utilizada',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::marcarSugerenciaUtilizada
 * @see app/Http/Controllers/DashboardAlertsController.php:144
 * @route '/dashboard/sugerencias/{sugerenciaId}/marcar-utilizada'
 */
marcarSugerenciaUtilizada.url = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sugerenciaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    sugerenciaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sugerenciaId: args.sugerenciaId,
                }

    return marcarSugerenciaUtilizada.definition.url
            .replace('{sugerenciaId}', parsedArgs.sugerenciaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::marcarSugerenciaUtilizada
 * @see app/Http/Controllers/DashboardAlertsController.php:144
 * @route '/dashboard/sugerencias/{sugerenciaId}/marcar-utilizada'
 */
marcarSugerenciaUtilizada.post = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarSugerenciaUtilizada.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::marcarSugerenciaUtilizada
 * @see app/Http/Controllers/DashboardAlertsController.php:144
 * @route '/dashboard/sugerencias/{sugerenciaId}/marcar-utilizada'
 */
    const marcarSugerenciaUtilizadaForm = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: marcarSugerenciaUtilizada.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::marcarSugerenciaUtilizada
 * @see app/Http/Controllers/DashboardAlertsController.php:144
 * @route '/dashboard/sugerencias/{sugerenciaId}/marcar-utilizada'
 */
        marcarSugerenciaUtilizadaForm.post = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: marcarSugerenciaUtilizada.url(args, options),
            method: 'post',
        })
    
    marcarSugerenciaUtilizada.form = marcarSugerenciaUtilizadaForm
/**
* @see \App\Http\Controllers\DashboardAlertsController::detalleAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
export const detalleAlerta = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalleAlerta.url(args, options),
    method: 'get',
})

detalleAlerta.definition = {
    methods: ["get","head"],
    url: '/dashboard/alerta/{alertaId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::detalleAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
detalleAlerta.url = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alertaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    alertaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        alertaId: args.alertaId,
                }

    return detalleAlerta.definition.url
            .replace('{alertaId}', parsedArgs.alertaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::detalleAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
detalleAlerta.get = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalleAlerta.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardAlertsController::detalleAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
detalleAlerta.head = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detalleAlerta.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::detalleAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
    const detalleAlertaForm = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detalleAlerta.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::detalleAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
        detalleAlertaForm.get = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalleAlerta.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardAlertsController::detalleAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
        detalleAlertaForm.head = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalleAlerta.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detalleAlerta.form = detalleAlertaForm
/**
* @see \App\Http\Controllers\DashboardAlertsController::detalleSugerencia
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
export const detalleSugerencia = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalleSugerencia.url(args, options),
    method: 'get',
})

detalleSugerencia.definition = {
    methods: ["get","head"],
    url: '/dashboard/sugerencia/{sugerenciaId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::detalleSugerencia
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
detalleSugerencia.url = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sugerenciaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    sugerenciaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sugerenciaId: args.sugerenciaId,
                }

    return detalleSugerencia.definition.url
            .replace('{sugerenciaId}', parsedArgs.sugerenciaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::detalleSugerencia
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
detalleSugerencia.get = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalleSugerencia.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardAlertsController::detalleSugerencia
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
detalleSugerencia.head = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detalleSugerencia.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::detalleSugerencia
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
    const detalleSugerenciaForm = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detalleSugerencia.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::detalleSugerencia
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
        detalleSugerenciaForm.get = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalleSugerencia.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardAlertsController::detalleSugerencia
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
        detalleSugerenciaForm.head = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalleSugerencia.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detalleSugerencia.form = detalleSugerenciaForm
/**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardProfesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
export const dashboardProfesor = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardProfesor.url(options),
    method: 'get',
})

dashboardProfesor.definition = {
    methods: ["get","head"],
    url: '/dashboard/alertas-profesor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardProfesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
dashboardProfesor.url = (options?: RouteQueryOptions) => {
    return dashboardProfesor.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardProfesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
dashboardProfesor.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardProfesor.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardProfesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
dashboardProfesor.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboardProfesor.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardProfesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
    const dashboardProfesorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboardProfesor.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardProfesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
        dashboardProfesorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardProfesor.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardAlertsController::dashboardProfesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
        dashboardProfesorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardProfesor.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboardProfesor.form = dashboardProfesorForm
/**
* @see \App\Http\Controllers\DashboardAlertsController::intervenirAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:169
 * @route '/dashboard/alerta/{alertaId}/intervenir'
 */
export const intervenirAlerta = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: intervenirAlerta.url(args, options),
    method: 'post',
})

intervenirAlerta.definition = {
    methods: ["post"],
    url: '/dashboard/alerta/{alertaId}/intervenir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::intervenirAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:169
 * @route '/dashboard/alerta/{alertaId}/intervenir'
 */
intervenirAlerta.url = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alertaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    alertaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        alertaId: args.alertaId,
                }

    return intervenirAlerta.definition.url
            .replace('{alertaId}', parsedArgs.alertaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::intervenirAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:169
 * @route '/dashboard/alerta/{alertaId}/intervenir'
 */
intervenirAlerta.post = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: intervenirAlerta.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::intervenirAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:169
 * @route '/dashboard/alerta/{alertaId}/intervenir'
 */
    const intervenirAlertaForm = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: intervenirAlerta.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::intervenirAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:169
 * @route '/dashboard/alerta/{alertaId}/intervenir'
 */
        intervenirAlertaForm.post = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: intervenirAlerta.url(args, options),
            method: 'post',
        })
    
    intervenirAlerta.form = intervenirAlertaForm
/**
* @see \App\Http\Controllers\DashboardAlertsController::resolverAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:194
 * @route '/dashboard/alerta/{alertaId}/resolver'
 */
export const resolverAlerta = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolverAlerta.url(args, options),
    method: 'post',
})

resolverAlerta.definition = {
    methods: ["post"],
    url: '/dashboard/alerta/{alertaId}/resolver',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::resolverAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:194
 * @route '/dashboard/alerta/{alertaId}/resolver'
 */
resolverAlerta.url = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alertaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    alertaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        alertaId: args.alertaId,
                }

    return resolverAlerta.definition.url
            .replace('{alertaId}', parsedArgs.alertaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::resolverAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:194
 * @route '/dashboard/alerta/{alertaId}/resolver'
 */
resolverAlerta.post = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolverAlerta.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::resolverAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:194
 * @route '/dashboard/alerta/{alertaId}/resolver'
 */
    const resolverAlertaForm = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resolverAlerta.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::resolverAlerta
 * @see app/Http/Controllers/DashboardAlertsController.php:194
 * @route '/dashboard/alerta/{alertaId}/resolver'
 */
        resolverAlertaForm.post = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resolverAlerta.url(args, options),
            method: 'post',
        })
    
    resolverAlerta.form = resolverAlertaForm
/**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticasEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
export const estadisticasEstudiante = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasEstudiante.url(args, options),
    method: 'get',
})

estadisticasEstudiante.definition = {
    methods: ["get","head"],
    url: '/dashboard/estudiante/{estudianteId}/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticasEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
estadisticasEstudiante.url = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estudianteId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estudianteId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estudianteId: args.estudianteId,
                }

    return estadisticasEstudiante.definition.url
            .replace('{estudianteId}', parsedArgs.estudianteId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticasEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
estadisticasEstudiante.get = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasEstudiante.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticasEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
estadisticasEstudiante.head = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticasEstudiante.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticasEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
    const estadisticasEstudianteForm = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticasEstudiante.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticasEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
        estadisticasEstudianteForm.get = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticasEstudiante.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticasEstudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
        estadisticasEstudianteForm.head = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticasEstudiante.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticasEstudiante.form = estadisticasEstudianteForm
const DashboardAlertsController = { dashboardEstudiante, marcarSugerenciaUtilizada, detalleAlerta, detalleSugerencia, dashboardProfesor, intervenirAlerta, resolverAlerta, estadisticasEstudiante }

export default DashboardAlertsController