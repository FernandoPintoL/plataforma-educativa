import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticas
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
export const estadisticas = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(args, options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/dashboard/estudiante/{estudianteId}/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticas
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
estadisticas.url = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return estadisticas.definition.url
            .replace('{estudianteId}', parsedArgs.estudianteId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticas
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
estadisticas.get = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticas
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
estadisticas.head = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticas
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
    const estadisticasForm = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticas
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
        estadisticasForm.get = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardAlertsController::estadisticas
 * @see app/Http/Controllers/DashboardAlertsController.php:266
 * @route '/dashboard/estudiante/{estudianteId}/estadisticas'
 */
        estadisticasForm.head = (args: { estudianteId: string | number } | [estudianteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticas.form = estadisticasForm
const estudiante = {
    estadisticas,
}

export default estudiante