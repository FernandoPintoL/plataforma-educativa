import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MLDashboardController::student
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
export const student = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: student.url(args, options),
    method: 'get',
})

student.definition = {
    methods: ["get","head"],
    url: '/api/ml/predict/{studentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MLDashboardController::student
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
student.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return student.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MLDashboardController::student
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
student.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: student.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MLDashboardController::student
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
student.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: student.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MLDashboardController::student
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
    const studentForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: student.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MLDashboardController::student
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
        studentForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: student.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MLDashboardController::student
 * @see app/Http/Controllers/MLDashboardController.php:35
 * @route '/api/ml/predict/{studentId}'
 */
        studentForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: student.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    student.form = studentForm
const predict = {
    student,
}

export default predict