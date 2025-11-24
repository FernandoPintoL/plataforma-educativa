import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import alerta from './alerta'
/**
* @see \App\Http\Controllers\Api\StudentActivityController::registrar
 * @see app/Http/Controllers/Api/StudentActivityController.php:45
 * @route '/api/student-activity'
 */
export const registrar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrar.url(options),
    method: 'post',
})

registrar.definition = {
    methods: ["post"],
    url: '/api/student-activity',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\StudentActivityController::registrar
 * @see app/Http/Controllers/Api/StudentActivityController.php:45
 * @route '/api/student-activity'
 */
registrar.url = (options?: RouteQueryOptions) => {
    return registrar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StudentActivityController::registrar
 * @see app/Http/Controllers/Api/StudentActivityController.php:45
 * @route '/api/student-activity'
 */
registrar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\StudentActivityController::registrar
 * @see app/Http/Controllers/Api/StudentActivityController.php:45
 * @route '/api/student-activity'
 */
    const registrarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StudentActivityController::registrar
 * @see app/Http/Controllers/Api/StudentActivityController.php:45
 * @route '/api/student-activity'
 */
        registrarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrar.url(options),
            method: 'post',
        })
    
    registrar.form = registrarForm
/**
* @see \App\Http\Controllers\Api\StudentActivityController::resumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
export const resumen = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(args, options),
    method: 'get',
})

resumen.definition = {
    methods: ["get","head"],
    url: '/api/student-activity/trabajo/{trabajoId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StudentActivityController::resumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
resumen.url = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return resumen.definition.url
            .replace('{trabajoId}', parsedArgs.trabajoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StudentActivityController::resumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
resumen.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StudentActivityController::resumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
resumen.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumen.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StudentActivityController::resumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
    const resumenForm = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resumen.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StudentActivityController::resumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
        resumenForm.get = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StudentActivityController::resumen
 * @see app/Http/Controllers/Api/StudentActivityController.php:152
 * @route '/api/student-activity/trabajo/{trabajoId}'
 */
        resumenForm.head = (args: { trabajoId: string | number } | [trabajoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    resumen.form = resumenForm
/**
* @see \App\Http\Controllers\Api\StudentActivityController::alertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
export const alertas = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertas.url(args, options),
    method: 'get',
})

alertas.definition = {
    methods: ["get","head"],
    url: '/api/student-activity/alertas/{estudianteId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StudentActivityController::alertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
alertas.url = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return alertas.definition.url
            .replace('{estudianteId}', parsedArgs.estudianteId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StudentActivityController::alertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
alertas.get = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StudentActivityController::alertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
alertas.head = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: alertas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StudentActivityController::alertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
    const alertasForm = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: alertas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StudentActivityController::alertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
        alertasForm.get = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StudentActivityController::alertas
 * @see app/Http/Controllers/Api/StudentActivityController.php:187
 * @route '/api/student-activity/alertas/{estudianteId}'
 */
        alertasForm.head = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    alertas.form = alertasForm
const studentActivity = {
    registrar,
resumen,
alertas,
alerta,
}

export default studentActivity