import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LocalidadController::indexApi
 * @see app/Http/Controllers/LocalidadController.php:15
 * @route '/api/localidades'
 */
export const indexApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi.url(options),
    method: 'get',
})

indexApi.definition = {
    methods: ["get","head"],
    url: '/api/localidades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::indexApi
 * @see app/Http/Controllers/LocalidadController.php:15
 * @route '/api/localidades'
 */
indexApi.url = (options?: RouteQueryOptions) => {
    return indexApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::indexApi
 * @see app/Http/Controllers/LocalidadController.php:15
 * @route '/api/localidades'
 */
indexApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::indexApi
 * @see app/Http/Controllers/LocalidadController.php:15
 * @route '/api/localidades'
 */
indexApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LocalidadController::indexApi
 * @see app/Http/Controllers/LocalidadController.php:15
 * @route '/api/localidades'
 */
    const indexApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LocalidadController::indexApi
 * @see app/Http/Controllers/LocalidadController.php:15
 * @route '/api/localidades'
 */
        indexApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LocalidadController::indexApi
 * @see app/Http/Controllers/LocalidadController.php:15
 * @route '/api/localidades'
 */
        indexApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexApi.form = indexApiForm
/**
* @see \App\Http\Controllers\LocalidadController::storeApi
 * @see app/Http/Controllers/LocalidadController.php:50
 * @route '/api/localidades'
 */
export const storeApi = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApi.url(options),
    method: 'post',
})

storeApi.definition = {
    methods: ["post"],
    url: '/api/localidades',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LocalidadController::storeApi
 * @see app/Http/Controllers/LocalidadController.php:50
 * @route '/api/localidades'
 */
storeApi.url = (options?: RouteQueryOptions) => {
    return storeApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::storeApi
 * @see app/Http/Controllers/LocalidadController.php:50
 * @route '/api/localidades'
 */
storeApi.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApi.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LocalidadController::storeApi
 * @see app/Http/Controllers/LocalidadController.php:50
 * @route '/api/localidades'
 */
    const storeApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeApi.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LocalidadController::storeApi
 * @see app/Http/Controllers/LocalidadController.php:50
 * @route '/api/localidades'
 */
        storeApiForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeApi.url(options),
            method: 'post',
        })
    
    storeApi.form = storeApiForm
/**
* @see \App\Http\Controllers\LocalidadController::showApi
 * @see app/Http/Controllers/LocalidadController.php:42
 * @route '/api/localidades/{localidad}'
 */
export const showApi = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})

showApi.definition = {
    methods: ["get","head"],
    url: '/api/localidades/{localidad}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::showApi
 * @see app/Http/Controllers/LocalidadController.php:42
 * @route '/api/localidades/{localidad}'
 */
showApi.url = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidad: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { localidad: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    localidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidad: typeof args.localidad === 'object'
                ? args.localidad.id
                : args.localidad,
                }

    return showApi.definition.url
            .replace('{localidad}', parsedArgs.localidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::showApi
 * @see app/Http/Controllers/LocalidadController.php:42
 * @route '/api/localidades/{localidad}'
 */
showApi.get = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::showApi
 * @see app/Http/Controllers/LocalidadController.php:42
 * @route '/api/localidades/{localidad}'
 */
showApi.head = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showApi.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LocalidadController::showApi
 * @see app/Http/Controllers/LocalidadController.php:42
 * @route '/api/localidades/{localidad}'
 */
    const showApiForm = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showApi.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LocalidadController::showApi
 * @see app/Http/Controllers/LocalidadController.php:42
 * @route '/api/localidades/{localidad}'
 */
        showApiForm.get = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApi.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LocalidadController::showApi
 * @see app/Http/Controllers/LocalidadController.php:42
 * @route '/api/localidades/{localidad}'
 */
        showApiForm.head = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showApi.form = showApiForm
/**
* @see \App\Http\Controllers\LocalidadController::updateApi
 * @see app/Http/Controllers/LocalidadController.php:76
 * @route '/api/localidades/{localidad}'
 */
export const updateApi = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateApi.url(args, options),
    method: 'put',
})

updateApi.definition = {
    methods: ["put"],
    url: '/api/localidades/{localidad}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\LocalidadController::updateApi
 * @see app/Http/Controllers/LocalidadController.php:76
 * @route '/api/localidades/{localidad}'
 */
updateApi.url = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidad: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { localidad: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    localidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidad: typeof args.localidad === 'object'
                ? args.localidad.id
                : args.localidad,
                }

    return updateApi.definition.url
            .replace('{localidad}', parsedArgs.localidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::updateApi
 * @see app/Http/Controllers/LocalidadController.php:76
 * @route '/api/localidades/{localidad}'
 */
updateApi.put = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateApi.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\LocalidadController::updateApi
 * @see app/Http/Controllers/LocalidadController.php:76
 * @route '/api/localidades/{localidad}'
 */
    const updateApiForm = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateApi.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LocalidadController::updateApi
 * @see app/Http/Controllers/LocalidadController.php:76
 * @route '/api/localidades/{localidad}'
 */
        updateApiForm.put = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateApi.form = updateApiForm
/**
* @see \App\Http\Controllers\LocalidadController::destroyApi
 * @see app/Http/Controllers/LocalidadController.php:99
 * @route '/api/localidades/{localidad}'
 */
export const destroyApi = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyApi.url(args, options),
    method: 'delete',
})

destroyApi.definition = {
    methods: ["delete"],
    url: '/api/localidades/{localidad}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LocalidadController::destroyApi
 * @see app/Http/Controllers/LocalidadController.php:99
 * @route '/api/localidades/{localidad}'
 */
destroyApi.url = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidad: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { localidad: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    localidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidad: typeof args.localidad === 'object'
                ? args.localidad.id
                : args.localidad,
                }

    return destroyApi.definition.url
            .replace('{localidad}', parsedArgs.localidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::destroyApi
 * @see app/Http/Controllers/LocalidadController.php:99
 * @route '/api/localidades/{localidad}'
 */
destroyApi.delete = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyApi.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\LocalidadController::destroyApi
 * @see app/Http/Controllers/LocalidadController.php:99
 * @route '/api/localidades/{localidad}'
 */
    const destroyApiForm = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyApi.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LocalidadController::destroyApi
 * @see app/Http/Controllers/LocalidadController.php:99
 * @route '/api/localidades/{localidad}'
 */
        destroyApiForm.delete = (args: { localidad: string | number | { id: string | number } } | [localidad: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyApi.form = destroyApiForm
const LocalidadController = { indexApi, storeApi, showApi, updateApi, destroyApi }

export default LocalidadController