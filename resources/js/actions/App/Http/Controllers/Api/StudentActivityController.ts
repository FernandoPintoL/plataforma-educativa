import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\StudentActivityController::registrarActividad
 * @see app/Http/Controllers/Api/StudentActivityController.php:45
 * @route '/api/student-activity'
 */
export const registrarActividad = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarActividad.url(options),
    method: 'post',
})

registrarActividad.definition = {
    methods: ["post"],
    url: '/api/student-activity',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\StudentActivityController::registrarActividad
 * @see app/Http/Controllers/Api/StudentActivityController.php:45
 * @route '/api/student-activity'
 */
registrarActividad.url = (options?: RouteQueryOptions) => {
    return registrarActividad.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StudentActivityController::registrarActividad
 * @see app/Http/Controllers/Api/StudentActivityController.php:45
 * @route '/api/student-activity'
 */
registrarActividad.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarActividad.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\StudentActivityController::registrarActividad
 * @see app/Http/Controllers/Api/StudentActivityController.php:45
 * @route '/api/student-activity'
 */
    const registrarActividadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarActividad.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StudentActivityController::registrarActividad
 * @see app/Http/Controllers/Api/StudentActivityController.php:45
 * @route '/api/student-activity'
 */
        registrarActividadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarActividad.url(options),
            method: 'post',
        })
    
    registrarActividad.form = registrarActividadForm
/**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerResumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
export const obtenerResumen = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumen.url(args, options),
    method: 'get',
})

obtenerResumen.definition = {
    methods: ["get","head"],
    url: '/api/student-activity/trabajo/{trabajoId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerResumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
obtenerResumen.url = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return obtenerResumen.definition.url
            .replace('{trabajoId}', parsedArgs.trabajoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerResumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
obtenerResumen.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumen.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerResumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
obtenerResumen.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerResumen.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerResumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
    const obtenerResumenForm = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerResumen.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerResumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
        obtenerResumenForm.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerResumen.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerResumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
        obtenerResumenForm.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerResumen.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerResumen.form = obtenerResumenForm
/**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerAlertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
export const obtenerAlertas = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerAlertas.url(args, options),
    method: 'get',
})

obtenerAlertas.definition = {
    methods: ["get","head"],
    url: '/api/student-activity/alertas/{estudianteId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerAlertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
obtenerAlertas.url = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return obtenerAlertas.definition.url
            .replace('{estudianteId}', parsedArgs.estudianteId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerAlertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
obtenerAlertas.get = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerAlertas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerAlertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
obtenerAlertas.head = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerAlertas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerAlertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
    const obtenerAlertasForm = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerAlertas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerAlertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
        obtenerAlertasForm.get = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerAlertas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StudentActivityController::obtenerAlertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
        obtenerAlertasForm.head = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerAlertas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerAlertas.form = obtenerAlertasForm
/**
* @see \App\Http\Controllers\Api\StudentActivityController::marcarAlertaIntervenida
 * @see app/Http/Controllers/Api/StudentActivityController.php:222
 * @route '/api/student-activity/alertas/{alertaId}/intervene'
 */
export const marcarAlertaIntervenida = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: marcarAlertaIntervenida.url(args, options),
    method: 'patch',
})

marcarAlertaIntervenida.definition = {
    methods: ["patch"],
    url: '/api/student-activity/alertas/{alertaId}/intervene',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\StudentActivityController::marcarAlertaIntervenida
 * @see app/Http/Controllers/Api/StudentActivityController.php:222
 * @route '/api/student-activity/alertas/{alertaId}/intervene'
 */
marcarAlertaIntervenida.url = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return marcarAlertaIntervenida.definition.url
            .replace('{alertaId}', parsedArgs.alertaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StudentActivityController::marcarAlertaIntervenida
 * @see app/Http/Controllers/Api/StudentActivityController.php:222
 * @route '/api/student-activity/alertas/{alertaId}/intervene'
 */
marcarAlertaIntervenida.patch = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: marcarAlertaIntervenida.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\StudentActivityController::marcarAlertaIntervenida
 * @see app/Http/Controllers/Api/StudentActivityController.php:222
 * @route '/api/student-activity/alertas/{alertaId}/intervene'
 */
    const marcarAlertaIntervenidaForm = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: marcarAlertaIntervenida.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StudentActivityController::marcarAlertaIntervenida
 * @see app/Http/Controllers/Api/StudentActivityController.php:222
 * @route '/api/student-activity/alertas/{alertaId}/intervene'
 */
        marcarAlertaIntervenidaForm.patch = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: marcarAlertaIntervenida.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    marcarAlertaIntervenida.form = marcarAlertaIntervenidaForm
const StudentActivityController = { registrarActividad, obtenerResumen, obtenerAlertas, marcarAlertaIntervenida }

export default StudentActivityController