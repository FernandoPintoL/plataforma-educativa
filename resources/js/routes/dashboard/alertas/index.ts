import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardAlertsController::estudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
export const estudiante = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estudiante.url(options),
    method: 'get',
})

estudiante.definition = {
    methods: ["get","head"],
    url: '/dashboard/alertas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::estudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
estudiante.url = (options?: RouteQueryOptions) => {
    return estudiante.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::estudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
estudiante.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estudiante.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardAlertsController::estudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
estudiante.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estudiante.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::estudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
    const estudianteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estudiante.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::estudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
        estudianteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estudiante.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardAlertsController::estudiante
 * @see app/Http/Controllers/DashboardAlertsController.php:23
 * @route '/dashboard/alertas'
 */
        estudianteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estudiante.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estudiante.form = estudianteForm
/**
* @see \App\Http\Controllers\DashboardAlertsController::profesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
export const profesor = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profesor.url(options),
    method: 'get',
})

profesor.definition = {
    methods: ["get","head"],
    url: '/dashboard/alertas-profesor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardAlertsController::profesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
profesor.url = (options?: RouteQueryOptions) => {
    return profesor.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardAlertsController::profesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
profesor.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profesor.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardAlertsController::profesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
profesor.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profesor.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardAlertsController::profesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
    const profesorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: profesor.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardAlertsController::profesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
        profesorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profesor.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardAlertsController::profesor
 * @see app/Http/Controllers/DashboardAlertsController.php:80
 * @route '/dashboard/alertas-profesor'
 */
        profesorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profesor.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    profesor.form = profesorForm
const alertas = {
    estudiante,
profesor,
}

export default alertas