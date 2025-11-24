import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
export const detalle = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalle.url(args, options),
    method: 'get',
})

detalle.definition = {
    methods: ["get","head"],
    url: '/dashboard/alerta/{alertaId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
detalle.url = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return detalle.definition.url
            .replace('{alertaId}', parsedArgs.alertaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
detalle.get = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalle.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
detalle.head = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detalle.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
    const detalleForm = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detalle.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
        detalleForm.get = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalle.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardAlertsController::detalle
 * @see app/Http/Controllers/DashboardAlertsController.php:223
 * @route '/dashboard/alerta/{alertaId}'
 */
        detalleForm.head = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detalle.form = detalleForm
/**
* @see \App\Http\Controllers\DashboardAlertsController::intervenir
 * @see app/Http/Controllers/DashboardAlertsController.php:169
 * @route '/dashboard/alerta/{alertaId}/intervenir'
 */
export const intervenir = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: intervenir.url(args, options),
    method: 'post',
})

intervenir.definition = {
    methods: ["post"],
    url: '/dashboard/alerta/{alertaId}/intervenir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::intervenir
 * @see app/Http/Controllers/DashboardAlertsController.php:169
 * @route '/dashboard/alerta/{alertaId}/intervenir'
 */
intervenir.url = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return intervenir.definition.url
            .replace('{alertaId}', parsedArgs.alertaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::intervenir
 * @see app/Http/Controllers/DashboardAlertsController.php:169
 * @route '/dashboard/alerta/{alertaId}/intervenir'
 */
intervenir.post = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: intervenir.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::intervenir
 * @see app/Http/Controllers/DashboardAlertsController.php:169
 * @route '/dashboard/alerta/{alertaId}/intervenir'
 */
    const intervenirForm = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: intervenir.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::intervenir
 * @see app/Http/Controllers/DashboardAlertsController.php:169
 * @route '/dashboard/alerta/{alertaId}/intervenir'
 */
        intervenirForm.post = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: intervenir.url(args, options),
            method: 'post',
        })
    
    intervenir.form = intervenirForm
/**
* @see \App\Http\Controllers\DashboardAlertsController::resolver
 * @see app/Http/Controllers/DashboardAlertsController.php:194
 * @route '/dashboard/alerta/{alertaId}/resolver'
 */
export const resolver = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolver.url(args, options),
    method: 'post',
})

resolver.definition = {
    methods: ["post"],
    url: '/dashboard/alerta/{alertaId}/resolver',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::resolver
 * @see app/Http/Controllers/DashboardAlertsController.php:194
 * @route '/dashboard/alerta/{alertaId}/resolver'
 */
resolver.url = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return resolver.definition.url
            .replace('{alertaId}', parsedArgs.alertaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::resolver
 * @see app/Http/Controllers/DashboardAlertsController.php:194
 * @route '/dashboard/alerta/{alertaId}/resolver'
 */
resolver.post = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolver.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::resolver
 * @see app/Http/Controllers/DashboardAlertsController.php:194
 * @route '/dashboard/alerta/{alertaId}/resolver'
 */
    const resolverForm = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resolver.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::resolver
 * @see app/Http/Controllers/DashboardAlertsController.php:194
 * @route '/dashboard/alerta/{alertaId}/resolver'
 */
        resolverForm.post = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resolver.url(args, options),
            method: 'post',
        })
    
    resolver.form = resolverForm
const alerta = {
    detalle,
intervenir,
resolver,
}

export default alerta