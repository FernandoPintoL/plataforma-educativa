import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
export const risk = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: risk.url(args, options),
    method: 'get',
})

risk.definition = {
    methods: ["get","head"],
    url: '/api/ml/reports/student/{studentId}/risk',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
risk.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { studentId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    studentId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        studentId: args.studentId,
                }

    return risk.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
risk.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: risk.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
risk.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: risk.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
    const riskForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: risk.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
        riskForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: risk.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::risk
 * @see app/Http/Controllers/MLDashboardController.php:278
 * @route '/api/ml/reports/student/{studentId}/risk'
 */
        riskForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: risk.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    risk.form = riskForm
const student = {
    risk,
}

export default student