import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardAlertsController::marcarUtilizada
 * @see app/Http/Controllers/DashboardAlertsController.php:144
 * @route '/dashboard/sugerencias/{sugerenciaId}/marcar-utilizada'
 */
export const marcarUtilizada = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarUtilizada.url(args, options),
    method: 'post',
})

marcarUtilizada.definition = {
    methods: ["post"],
    url: '/dashboard/sugerencias/{sugerenciaId}/marcar-utilizada',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::marcarUtilizada
 * @see app/Http/Controllers/DashboardAlertsController.php:144
 * @route '/dashboard/sugerencias/{sugerenciaId}/marcar-utilizada'
 */
marcarUtilizada.url = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return marcarUtilizada.definition.url
            .replace('{sugerenciaId}', parsedArgs.sugerenciaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::marcarUtilizada
 * @see app/Http/Controllers/DashboardAlertsController.php:144
 * @route '/dashboard/sugerencias/{sugerenciaId}/marcar-utilizada'
 */
marcarUtilizada.post = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarUtilizada.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::marcarUtilizada
 * @see app/Http/Controllers/DashboardAlertsController.php:144
 * @route '/dashboard/sugerencias/{sugerenciaId}/marcar-utilizada'
 */
    const marcarUtilizadaForm = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: marcarUtilizada.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::marcarUtilizada
 * @see app/Http/Controllers/DashboardAlertsController.php:144
 * @route '/dashboard/sugerencias/{sugerenciaId}/marcar-utilizada'
 */
        marcarUtilizadaForm.post = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: marcarUtilizada.url(args, options),
            method: 'post',
        })
    
    marcarUtilizada.form = marcarUtilizadaForm
/**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
export const detalle = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalle.url(args, options),
    method: 'get',
})

detalle.definition = {
    methods: ["get","head"],
    url: '/dashboard/sugerencia/{sugerenciaId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
detalle.url = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return detalle.definition.url
            .replace('{sugerenciaId}', parsedArgs.sugerenciaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
detalle.get = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalle.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
detalle.head = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detalle.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
    const detalleForm = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detalle.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
        detalleForm.get = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalle.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:245
 * @route '/dashboard/sugerencia/{sugerenciaId}'
 */
        detalleForm.head = (args: { sugerenciaId: string | number } | [sugerenciaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detalle.form = detalleForm
const sugerencia = {
    marcarUtilizada,
detalle,
}

export default sugerencia