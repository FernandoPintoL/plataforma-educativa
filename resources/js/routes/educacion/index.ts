import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see routes/web.php:48
* @route '/educacion/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/educacion/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:48
* @route '/educacion/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see routes/web.php:48
* @route '/educacion/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see routes/web.php:48
* @route '/educacion/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see routes/web.php:48
* @route '/educacion/dashboard'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see routes/web.php:48
* @route '/educacion/dashboard'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see routes/web.php:48
* @route '/educacion/dashboard'
*/
dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard.form = dashboardForm

/**
* @see routes/web.php:51
* @route '/educacion/estudiantes'
*/
export const estudiantes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estudiantes.url(options),
    method: 'get',
})

estudiantes.definition = {
    methods: ["get","head"],
    url: '/educacion/estudiantes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:51
* @route '/educacion/estudiantes'
*/
estudiantes.url = (options?: RouteQueryOptions) => {
    return estudiantes.definition.url + queryParams(options)
}

/**
* @see routes/web.php:51
* @route '/educacion/estudiantes'
*/
estudiantes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estudiantes.url(options),
    method: 'get',
})

/**
* @see routes/web.php:51
* @route '/educacion/estudiantes'
*/
estudiantes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estudiantes.url(options),
    method: 'head',
})

/**
* @see routes/web.php:51
* @route '/educacion/estudiantes'
*/
const estudiantesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: estudiantes.url(options),
    method: 'get',
})

/**
* @see routes/web.php:51
* @route '/educacion/estudiantes'
*/
estudiantesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: estudiantes.url(options),
    method: 'get',
})

/**
* @see routes/web.php:51
* @route '/educacion/estudiantes'
*/
estudiantesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: estudiantes.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

estudiantes.form = estudiantesForm

/**
* @see routes/web.php:54
* @route '/educacion/profesores'
*/
export const profesores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profesores.url(options),
    method: 'get',
})

profesores.definition = {
    methods: ["get","head"],
    url: '/educacion/profesores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:54
* @route '/educacion/profesores'
*/
profesores.url = (options?: RouteQueryOptions) => {
    return profesores.definition.url + queryParams(options)
}

/**
* @see routes/web.php:54
* @route '/educacion/profesores'
*/
profesores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profesores.url(options),
    method: 'get',
})

/**
* @see routes/web.php:54
* @route '/educacion/profesores'
*/
profesores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profesores.url(options),
    method: 'head',
})

/**
* @see routes/web.php:54
* @route '/educacion/profesores'
*/
const profesoresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profesores.url(options),
    method: 'get',
})

/**
* @see routes/web.php:54
* @route '/educacion/profesores'
*/
profesoresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profesores.url(options),
    method: 'get',
})

/**
* @see routes/web.php:54
* @route '/educacion/profesores'
*/
profesoresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profesores.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

profesores.form = profesoresForm

/**
* @see routes/web.php:57
* @route '/educacion/cursos'
*/
export const cursos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cursos.url(options),
    method: 'get',
})

cursos.definition = {
    methods: ["get","head"],
    url: '/educacion/cursos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:57
* @route '/educacion/cursos'
*/
cursos.url = (options?: RouteQueryOptions) => {
    return cursos.definition.url + queryParams(options)
}

/**
* @see routes/web.php:57
* @route '/educacion/cursos'
*/
cursos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cursos.url(options),
    method: 'get',
})

/**
* @see routes/web.php:57
* @route '/educacion/cursos'
*/
cursos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cursos.url(options),
    method: 'head',
})

/**
* @see routes/web.php:57
* @route '/educacion/cursos'
*/
const cursosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cursos.url(options),
    method: 'get',
})

/**
* @see routes/web.php:57
* @route '/educacion/cursos'
*/
cursosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cursos.url(options),
    method: 'get',
})

/**
* @see routes/web.php:57
* @route '/educacion/cursos'
*/
cursosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cursos.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

cursos.form = cursosForm

const educacion = {
    dashboard,
    estudiantes,
    profesores,
    cursos,
}

export default educacion