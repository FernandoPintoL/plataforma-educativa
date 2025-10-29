import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:14
* @route '/recursos/{recurso}/descargar'
*/
export const descargar = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargar.url(args, options),
    method: 'get',
})

descargar.definition = {
    methods: ["get","head"],
    url: '/recursos/{recurso}/descargar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:14
* @route '/recursos/{recurso}/descargar'
*/
descargar.url = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurso: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recurso: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recurso: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recurso: typeof args.recurso === 'object'
        ? args.recurso.id
        : args.recurso,
    }

    return descargar.definition.url
            .replace('{recurso}', parsedArgs.recurso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:14
* @route '/recursos/{recurso}/descargar'
*/
descargar.get = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:14
* @route '/recursos/{recurso}/descargar'
*/
descargar.head = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargar.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:14
* @route '/recursos/{recurso}/descargar'
*/
const descargarForm = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: descargar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:14
* @route '/recursos/{recurso}/descargar'
*/
descargarForm.get = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: descargar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:14
* @route '/recursos/{recurso}/descargar'
*/
descargarForm.head = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: descargar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

descargar.form = descargarForm

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:64
* @route '/recursos/{recurso}/ver'
*/
export const ver = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ver.url(args, options),
    method: 'get',
})

ver.definition = {
    methods: ["get","head"],
    url: '/recursos/{recurso}/ver',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:64
* @route '/recursos/{recurso}/ver'
*/
ver.url = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurso: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recurso: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recurso: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recurso: typeof args.recurso === 'object'
        ? args.recurso.id
        : args.recurso,
    }

    return ver.definition.url
            .replace('{recurso}', parsedArgs.recurso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:64
* @route '/recursos/{recurso}/ver'
*/
ver.get = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ver.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:64
* @route '/recursos/{recurso}/ver'
*/
ver.head = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ver.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:64
* @route '/recursos/{recurso}/ver'
*/
const verForm = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ver.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:64
* @route '/recursos/{recurso}/ver'
*/
verForm.get = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ver.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:64
* @route '/recursos/{recurso}/ver'
*/
verForm.head = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ver.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ver.form = verForm

/**
* @see \App\Http\Controllers\RecursoController::destroy
* @see app/Http/Controllers/RecursoController.php:107
* @route '/recursos/{recurso}'
*/
export const destroy = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/recursos/{recurso}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RecursoController::destroy
* @see app/Http/Controllers/RecursoController.php:107
* @route '/recursos/{recurso}'
*/
destroy.url = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurso: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recurso: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recurso: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recurso: typeof args.recurso === 'object'
        ? args.recurso.id
        : args.recurso,
    }

    return destroy.definition.url
            .replace('{recurso}', parsedArgs.recurso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecursoController::destroy
* @see app/Http/Controllers/RecursoController.php:107
* @route '/recursos/{recurso}'
*/
destroy.delete = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\RecursoController::destroy
* @see app/Http/Controllers/RecursoController.php:107
* @route '/recursos/{recurso}'
*/
const destroyForm = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecursoController::destroy
* @see app/Http/Controllers/RecursoController.php:107
* @route '/recursos/{recurso}'
*/
destroyForm.delete = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const RecursoController = { descargar, ver, destroy }

export default RecursoController