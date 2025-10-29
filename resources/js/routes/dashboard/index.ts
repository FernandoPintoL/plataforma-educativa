import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardDirectorController::director
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
export const director = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: director.url(options),
    method: 'get',
})

director.definition = {
    methods: ["get","head"],
    url: '/dashboard/director',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardDirectorController::director
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
director.url = (options?: RouteQueryOptions) => {
    return director.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardDirectorController::director
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
director.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: director.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardDirectorController::director
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
director.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: director.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardDirectorController::director
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
const directorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: director.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardDirectorController::director
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
directorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: director.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardDirectorController::director
* @see app/Http/Controllers/DashboardDirectorController.php:12
* @route '/dashboard/director'
*/
directorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: director.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

director.form = directorForm

/**
* @see \App\Http\Controllers\DashboardProfesorController::profesor
* @see app/Http/Controllers/DashboardProfesorController.php:13
* @route '/dashboard/profesor'
*/
export const profesor = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profesor.url(options),
    method: 'get',
})

profesor.definition = {
    methods: ["get","head"],
    url: '/dashboard/profesor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardProfesorController::profesor
* @see app/Http/Controllers/DashboardProfesorController.php:13
* @route '/dashboard/profesor'
*/
profesor.url = (options?: RouteQueryOptions) => {
    return profesor.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardProfesorController::profesor
* @see app/Http/Controllers/DashboardProfesorController.php:13
* @route '/dashboard/profesor'
*/
profesor.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profesor.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardProfesorController::profesor
* @see app/Http/Controllers/DashboardProfesorController.php:13
* @route '/dashboard/profesor'
*/
profesor.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profesor.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardProfesorController::profesor
* @see app/Http/Controllers/DashboardProfesorController.php:13
* @route '/dashboard/profesor'
*/
const profesorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profesor.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardProfesorController::profesor
* @see app/Http/Controllers/DashboardProfesorController.php:13
* @route '/dashboard/profesor'
*/
profesorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profesor.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardProfesorController::profesor
* @see app/Http/Controllers/DashboardProfesorController.php:13
* @route '/dashboard/profesor'
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

/**
* @see \App\Http\Controllers\DashboardEstudianteController::estudiante
* @see app/Http/Controllers/DashboardEstudianteController.php:15
* @route '/dashboard/estudiante'
*/
export const estudiante = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estudiante.url(options),
    method: 'get',
})

estudiante.definition = {
    methods: ["get","head"],
    url: '/dashboard/estudiante',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardEstudianteController::estudiante
* @see app/Http/Controllers/DashboardEstudianteController.php:15
* @route '/dashboard/estudiante'
*/
estudiante.url = (options?: RouteQueryOptions) => {
    return estudiante.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardEstudianteController::estudiante
* @see app/Http/Controllers/DashboardEstudianteController.php:15
* @route '/dashboard/estudiante'
*/
estudiante.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estudiante.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardEstudianteController::estudiante
* @see app/Http/Controllers/DashboardEstudianteController.php:15
* @route '/dashboard/estudiante'
*/
estudiante.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estudiante.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardEstudianteController::estudiante
* @see app/Http/Controllers/DashboardEstudianteController.php:15
* @route '/dashboard/estudiante'
*/
const estudianteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: estudiante.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardEstudianteController::estudiante
* @see app/Http/Controllers/DashboardEstudianteController.php:15
* @route '/dashboard/estudiante'
*/
estudianteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: estudiante.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardEstudianteController::estudiante
* @see app/Http/Controllers/DashboardEstudianteController.php:15
* @route '/dashboard/estudiante'
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
* @see \App\Http\Controllers\DashboardPadreController::padre
* @see app/Http/Controllers/DashboardPadreController.php:10
* @route '/dashboard/padre'
*/
export const padre = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: padre.url(options),
    method: 'get',
})

padre.definition = {
    methods: ["get","head"],
    url: '/dashboard/padre',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardPadreController::padre
* @see app/Http/Controllers/DashboardPadreController.php:10
* @route '/dashboard/padre'
*/
padre.url = (options?: RouteQueryOptions) => {
    return padre.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardPadreController::padre
* @see app/Http/Controllers/DashboardPadreController.php:10
* @route '/dashboard/padre'
*/
padre.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: padre.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardPadreController::padre
* @see app/Http/Controllers/DashboardPadreController.php:10
* @route '/dashboard/padre'
*/
padre.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: padre.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardPadreController::padre
* @see app/Http/Controllers/DashboardPadreController.php:10
* @route '/dashboard/padre'
*/
const padreForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: padre.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardPadreController::padre
* @see app/Http/Controllers/DashboardPadreController.php:10
* @route '/dashboard/padre'
*/
padreForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: padre.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardPadreController::padre
* @see app/Http/Controllers/DashboardPadreController.php:10
* @route '/dashboard/padre'
*/
padreForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: padre.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

padre.form = padreForm

const dashboard = {
    director,
    profesor,
    estudiante,
    padre,
}

export default dashboard