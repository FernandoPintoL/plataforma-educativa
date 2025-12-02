import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CalificacionController::index
 * @see app/Http/Controllers/CalificacionController.php:20
 * @route '/calificaciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/calificaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalificacionController::index
 * @see app/Http/Controllers/CalificacionController.php:20
 * @route '/calificaciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalificacionController::index
 * @see app/Http/Controllers/CalificacionController.php:20
 * @route '/calificaciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CalificacionController::index
 * @see app/Http/Controllers/CalificacionController.php:20
 * @route '/calificaciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CalificacionController::index
 * @see app/Http/Controllers/CalificacionController.php:20
 * @route '/calificaciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CalificacionController::index
 * @see app/Http/Controllers/CalificacionController.php:20
 * @route '/calificaciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CalificacionController::index
 * @see app/Http/Controllers/CalificacionController.php:20
 * @route '/calificaciones'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\CalificacionController::show
 * @see app/Http/Controllers/CalificacionController.php:224
 * @route '/calificaciones/{calificacione}'
 */
export const show = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/calificaciones/{calificacione}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalificacionController::show
 * @see app/Http/Controllers/CalificacionController.php:224
 * @route '/calificaciones/{calificacione}'
 */
show.url = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { calificacione: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    calificacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        calificacione: args.calificacione,
                }

    return show.definition.url
            .replace('{calificacione}', parsedArgs.calificacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalificacionController::show
 * @see app/Http/Controllers/CalificacionController.php:224
 * @route '/calificaciones/{calificacione}'
 */
show.get = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CalificacionController::show
 * @see app/Http/Controllers/CalificacionController.php:224
 * @route '/calificaciones/{calificacione}'
 */
show.head = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CalificacionController::show
 * @see app/Http/Controllers/CalificacionController.php:224
 * @route '/calificaciones/{calificacione}'
 */
    const showForm = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CalificacionController::show
 * @see app/Http/Controllers/CalificacionController.php:224
 * @route '/calificaciones/{calificacione}'
 */
        showForm.get = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CalificacionController::show
 * @see app/Http/Controllers/CalificacionController.php:224
 * @route '/calificaciones/{calificacione}'
 */
        showForm.head = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\CalificacionController::update
 * @see app/Http/Controllers/CalificacionController.php:261
 * @route '/calificaciones/{calificacione}'
 */
export const update = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/calificaciones/{calificacione}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CalificacionController::update
 * @see app/Http/Controllers/CalificacionController.php:261
 * @route '/calificaciones/{calificacione}'
 */
update.url = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { calificacione: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    calificacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        calificacione: args.calificacione,
                }

    return update.definition.url
            .replace('{calificacione}', parsedArgs.calificacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalificacionController::update
 * @see app/Http/Controllers/CalificacionController.php:261
 * @route '/calificaciones/{calificacione}'
 */
update.put = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CalificacionController::update
 * @see app/Http/Controllers/CalificacionController.php:261
 * @route '/calificaciones/{calificacione}'
 */
update.patch = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CalificacionController::update
 * @see app/Http/Controllers/CalificacionController.php:261
 * @route '/calificaciones/{calificacione}'
 */
    const updateForm = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CalificacionController::update
 * @see app/Http/Controllers/CalificacionController.php:261
 * @route '/calificaciones/{calificacione}'
 */
        updateForm.put = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\CalificacionController::update
 * @see app/Http/Controllers/CalificacionController.php:261
 * @route '/calificaciones/{calificacione}'
 */
        updateForm.patch = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\CalificacionController::destroy
 * @see app/Http/Controllers/CalificacionController.php:315
 * @route '/calificaciones/{calificacione}'
 */
export const destroy = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/calificaciones/{calificacione}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CalificacionController::destroy
 * @see app/Http/Controllers/CalificacionController.php:315
 * @route '/calificaciones/{calificacione}'
 */
destroy.url = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { calificacione: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    calificacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        calificacione: args.calificacione,
                }

    return destroy.definition.url
            .replace('{calificacione}', parsedArgs.calificacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalificacionController::destroy
 * @see app/Http/Controllers/CalificacionController.php:315
 * @route '/calificaciones/{calificacione}'
 */
destroy.delete = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CalificacionController::destroy
 * @see app/Http/Controllers/CalificacionController.php:315
 * @route '/calificaciones/{calificacione}'
 */
    const destroyForm = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CalificacionController::destroy
 * @see app/Http/Controllers/CalificacionController.php:315
 * @route '/calificaciones/{calificacione}'
 */
        destroyForm.delete = (args: { calificacione: string | number } | [calificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\CalificacionController::exportar
 * @see app/Http/Controllers/CalificacionController.php:421
 * @route '/calificaciones/exportar'
 */
export const exportar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportar.url(options),
    method: 'get',
})

exportar.definition = {
    methods: ["get","head"],
    url: '/calificaciones/exportar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalificacionController::exportar
 * @see app/Http/Controllers/CalificacionController.php:421
 * @route '/calificaciones/exportar'
 */
exportar.url = (options?: RouteQueryOptions) => {
    return exportar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalificacionController::exportar
 * @see app/Http/Controllers/CalificacionController.php:421
 * @route '/calificaciones/exportar'
 */
exportar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CalificacionController::exportar
 * @see app/Http/Controllers/CalificacionController.php:421
 * @route '/calificaciones/exportar'
 */
exportar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportar.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CalificacionController::exportar
 * @see app/Http/Controllers/CalificacionController.php:421
 * @route '/calificaciones/exportar'
 */
    const exportarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportar.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CalificacionController::exportar
 * @see app/Http/Controllers/CalificacionController.php:421
 * @route '/calificaciones/exportar'
 */
        exportarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportar.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CalificacionController::exportar
 * @see app/Http/Controllers/CalificacionController.php:421
 * @route '/calificaciones/exportar'
 */
        exportarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportar.form = exportarForm
const calificaciones = {
    index,
show,
update,
destroy,
exportar,
}

export default calificaciones