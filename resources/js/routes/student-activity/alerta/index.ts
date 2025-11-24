import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\StudentActivityController::intervene
 * @see app/Http/Controllers/Api/StudentActivityController.php:222
 * @route '/api/student-activity/alertas/{alertaId}/intervene'
 */
export const intervene = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: intervene.url(args, options),
    method: 'patch',
})

intervene.definition = {
    methods: ["patch"],
    url: '/api/student-activity/alertas/{alertaId}/intervene',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\StudentActivityController::intervene
 * @see app/Http/Controllers/Api/StudentActivityController.php:222
 * @route '/api/student-activity/alertas/{alertaId}/intervene'
 */
intervene.url = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return intervene.definition.url
            .replace('{alertaId}', parsedArgs.alertaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StudentActivityController::intervene
 * @see app/Http/Controllers/Api/StudentActivityController.php:222
 * @route '/api/student-activity/alertas/{alertaId}/intervene'
 */
intervene.patch = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: intervene.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\StudentActivityController::intervene
 * @see app/Http/Controllers/Api/StudentActivityController.php:222
 * @route '/api/student-activity/alertas/{alertaId}/intervene'
 */
    const interveneForm = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: intervene.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StudentActivityController::intervene
 * @see app/Http/Controllers/Api/StudentActivityController.php:222
 * @route '/api/student-activity/alertas/{alertaId}/intervene'
 */
        interveneForm.patch = (args: { alertaId: string | number } | [alertaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: intervene.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    intervene.form = interveneForm
const alerta = {
    intervene,
}

export default alerta