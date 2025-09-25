import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EstadoMermaController::index
 * @see app/Http/Controllers/Api/EstadoMermaController.php:13
 * @route '/api/estado-mermas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/estado-mermas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EstadoMermaController::index
 * @see app/Http/Controllers/Api/EstadoMermaController.php:13
 * @route '/api/estado-mermas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoMermaController::index
 * @see app/Http/Controllers/Api/EstadoMermaController.php:13
 * @route '/api/estado-mermas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EstadoMermaController::index
 * @see app/Http/Controllers/Api/EstadoMermaController.php:13
 * @route '/api/estado-mermas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EstadoMermaController::index
 * @see app/Http/Controllers/Api/EstadoMermaController.php:13
 * @route '/api/estado-mermas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EstadoMermaController::index
 * @see app/Http/Controllers/Api/EstadoMermaController.php:13
 * @route '/api/estado-mermas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EstadoMermaController::index
 * @see app/Http/Controllers/Api/EstadoMermaController.php:13
 * @route '/api/estado-mermas'
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
* @see \App\Http\Controllers\Api\EstadoMermaController::store
 * @see app/Http/Controllers/Api/EstadoMermaController.php:23
 * @route '/api/estado-mermas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/estado-mermas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EstadoMermaController::store
 * @see app/Http/Controllers/Api/EstadoMermaController.php:23
 * @route '/api/estado-mermas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoMermaController::store
 * @see app/Http/Controllers/Api/EstadoMermaController.php:23
 * @route '/api/estado-mermas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EstadoMermaController::store
 * @see app/Http/Controllers/Api/EstadoMermaController.php:23
 * @route '/api/estado-mermas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EstadoMermaController::store
 * @see app/Http/Controllers/Api/EstadoMermaController.php:23
 * @route '/api/estado-mermas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\EstadoMermaController::show
 * @see app/Http/Controllers/Api/EstadoMermaController.php:44
 * @route '/api/estado-mermas/{estado_merma}'
 */
export const show = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/estado-mermas/{estado_merma}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EstadoMermaController::show
 * @see app/Http/Controllers/Api/EstadoMermaController.php:44
 * @route '/api/estado-mermas/{estado_merma}'
 */
show.url = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estado_merma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estado_merma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estado_merma: args.estado_merma,
                }

    return show.definition.url
            .replace('{estado_merma}', parsedArgs.estado_merma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoMermaController::show
 * @see app/Http/Controllers/Api/EstadoMermaController.php:44
 * @route '/api/estado-mermas/{estado_merma}'
 */
show.get = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EstadoMermaController::show
 * @see app/Http/Controllers/Api/EstadoMermaController.php:44
 * @route '/api/estado-mermas/{estado_merma}'
 */
show.head = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EstadoMermaController::show
 * @see app/Http/Controllers/Api/EstadoMermaController.php:44
 * @route '/api/estado-mermas/{estado_merma}'
 */
    const showForm = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EstadoMermaController::show
 * @see app/Http/Controllers/Api/EstadoMermaController.php:44
 * @route '/api/estado-mermas/{estado_merma}'
 */
        showForm.get = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EstadoMermaController::show
 * @see app/Http/Controllers/Api/EstadoMermaController.php:44
 * @route '/api/estado-mermas/{estado_merma}'
 */
        showForm.head = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\EstadoMermaController::update
 * @see app/Http/Controllers/Api/EstadoMermaController.php:52
 * @route '/api/estado-mermas/{estado_merma}'
 */
export const update = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/estado-mermas/{estado_merma}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\EstadoMermaController::update
 * @see app/Http/Controllers/Api/EstadoMermaController.php:52
 * @route '/api/estado-mermas/{estado_merma}'
 */
update.url = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estado_merma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estado_merma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estado_merma: args.estado_merma,
                }

    return update.definition.url
            .replace('{estado_merma}', parsedArgs.estado_merma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoMermaController::update
 * @see app/Http/Controllers/Api/EstadoMermaController.php:52
 * @route '/api/estado-mermas/{estado_merma}'
 */
update.put = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\EstadoMermaController::update
 * @see app/Http/Controllers/Api/EstadoMermaController.php:52
 * @route '/api/estado-mermas/{estado_merma}'
 */
update.patch = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\EstadoMermaController::update
 * @see app/Http/Controllers/Api/EstadoMermaController.php:52
 * @route '/api/estado-mermas/{estado_merma}'
 */
    const updateForm = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EstadoMermaController::update
 * @see app/Http/Controllers/Api/EstadoMermaController.php:52
 * @route '/api/estado-mermas/{estado_merma}'
 */
        updateForm.put = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\EstadoMermaController::update
 * @see app/Http/Controllers/Api/EstadoMermaController.php:52
 * @route '/api/estado-mermas/{estado_merma}'
 */
        updateForm.patch = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\EstadoMermaController::destroy
 * @see app/Http/Controllers/Api/EstadoMermaController.php:73
 * @route '/api/estado-mermas/{estado_merma}'
 */
export const destroy = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/estado-mermas/{estado_merma}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\EstadoMermaController::destroy
 * @see app/Http/Controllers/Api/EstadoMermaController.php:73
 * @route '/api/estado-mermas/{estado_merma}'
 */
destroy.url = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estado_merma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estado_merma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estado_merma: args.estado_merma,
                }

    return destroy.definition.url
            .replace('{estado_merma}', parsedArgs.estado_merma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoMermaController::destroy
 * @see app/Http/Controllers/Api/EstadoMermaController.php:73
 * @route '/api/estado-mermas/{estado_merma}'
 */
destroy.delete = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\EstadoMermaController::destroy
 * @see app/Http/Controllers/Api/EstadoMermaController.php:73
 * @route '/api/estado-mermas/{estado_merma}'
 */
    const destroyForm = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EstadoMermaController::destroy
 * @see app/Http/Controllers/Api/EstadoMermaController.php:73
 * @route '/api/estado-mermas/{estado_merma}'
 */
        destroyForm.delete = (args: { estado_merma: string | number } | [estado_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const EstadoMermaController = { index, store, show, update, destroy }

export default EstadoMermaController