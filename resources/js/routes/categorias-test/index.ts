import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CategoriaTestController::store
 * @see app/Http/Controllers/CategoriaTestController.php:33
 * @route '/tests-vocacionales/{testVocacional}/categorias'
 */
export const store = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tests-vocacionales/{testVocacional}/categorias',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CategoriaTestController::store
 * @see app/Http/Controllers/CategoriaTestController.php:33
 * @route '/tests-vocacionales/{testVocacional}/categorias'
 */
store.url = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                }

    return store.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaTestController::store
 * @see app/Http/Controllers/CategoriaTestController.php:33
 * @route '/tests-vocacionales/{testVocacional}/categorias'
 */
store.post = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CategoriaTestController::store
 * @see app/Http/Controllers/CategoriaTestController.php:33
 * @route '/tests-vocacionales/{testVocacional}/categorias'
 */
    const storeForm = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CategoriaTestController::store
 * @see app/Http/Controllers/CategoriaTestController.php:33
 * @route '/tests-vocacionales/{testVocacional}/categorias'
 */
        storeForm.post = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CategoriaTestController::update
 * @see app/Http/Controllers/CategoriaTestController.php:69
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
export const update = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CategoriaTestController::update
 * @see app/Http/Controllers/CategoriaTestController.php:69
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
update.url = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                    categoriaTest: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                                categoriaTest: args.categoriaTest,
                }

    return update.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace('{categoriaTest}', parsedArgs.categoriaTest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaTestController::update
 * @see app/Http/Controllers/CategoriaTestController.php:69
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
update.put = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CategoriaTestController::update
 * @see app/Http/Controllers/CategoriaTestController.php:69
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
    const updateForm = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CategoriaTestController::update
 * @see app/Http/Controllers/CategoriaTestController.php:69
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
        updateForm.put = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\CategoriaTestController::destroy
 * @see app/Http/Controllers/CategoriaTestController.php:105
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
export const destroy = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CategoriaTestController::destroy
 * @see app/Http/Controllers/CategoriaTestController.php:105
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
destroy.url = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                    categoriaTest: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                                categoriaTest: args.categoriaTest,
                }

    return destroy.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace('{categoriaTest}', parsedArgs.categoriaTest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaTestController::destroy
 * @see app/Http/Controllers/CategoriaTestController.php:105
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
destroy.delete = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CategoriaTestController::destroy
 * @see app/Http/Controllers/CategoriaTestController.php:105
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
    const destroyForm = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CategoriaTestController::destroy
 * @see app/Http/Controllers/CategoriaTestController.php:105
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
        destroyForm.delete = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CategoriaTestController::reorder
 * @see app/Http/Controllers/CategoriaTestController.php:139
 * @route '/tests-vocacionales/{testVocacional}/categorias/reorder'
 */
export const reorder = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/tests-vocacionales/{testVocacional}/categorias/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CategoriaTestController::reorder
 * @see app/Http/Controllers/CategoriaTestController.php:139
 * @route '/tests-vocacionales/{testVocacional}/categorias/reorder'
 */
reorder.url = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                }

    return reorder.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaTestController::reorder
 * @see app/Http/Controllers/CategoriaTestController.php:139
 * @route '/tests-vocacionales/{testVocacional}/categorias/reorder'
 */
reorder.post = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CategoriaTestController::reorder
 * @see app/Http/Controllers/CategoriaTestController.php:139
 * @route '/tests-vocacionales/{testVocacional}/categorias/reorder'
 */
    const reorderForm = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reorder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CategoriaTestController::reorder
 * @see app/Http/Controllers/CategoriaTestController.php:139
 * @route '/tests-vocacionales/{testVocacional}/categorias/reorder'
 */
        reorderForm.post = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reorder.url(args, options),
            method: 'post',
        })
    
    reorder.form = reorderForm
/**
* @see \App\Http\Controllers\CategoriaTestController::index
 * @see app/Http/Controllers/CategoriaTestController.php:202
 * @route '/tests-vocacionales/{testVocacional}/categorias'
 */
export const index = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/{testVocacional}/categorias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaTestController::index
 * @see app/Http/Controllers/CategoriaTestController.php:202
 * @route '/tests-vocacionales/{testVocacional}/categorias'
 */
index.url = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testVocacional: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                }

    return index.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaTestController::index
 * @see app/Http/Controllers/CategoriaTestController.php:202
 * @route '/tests-vocacionales/{testVocacional}/categorias'
 */
index.get = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CategoriaTestController::index
 * @see app/Http/Controllers/CategoriaTestController.php:202
 * @route '/tests-vocacionales/{testVocacional}/categorias'
 */
index.head = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CategoriaTestController::index
 * @see app/Http/Controllers/CategoriaTestController.php:202
 * @route '/tests-vocacionales/{testVocacional}/categorias'
 */
    const indexForm = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CategoriaTestController::index
 * @see app/Http/Controllers/CategoriaTestController.php:202
 * @route '/tests-vocacionales/{testVocacional}/categorias'
 */
        indexForm.get = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CategoriaTestController::index
 * @see app/Http/Controllers/CategoriaTestController.php:202
 * @route '/tests-vocacionales/{testVocacional}/categorias'
 */
        indexForm.head = (args: { testVocacional: string | number } | [testVocacional: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\CategoriaTestController::show
 * @see app/Http/Controllers/CategoriaTestController.php:221
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
export const show = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaTestController::show
 * @see app/Http/Controllers/CategoriaTestController.php:221
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
show.url = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                    categoriaTest: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                                categoriaTest: args.categoriaTest,
                }

    return show.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace('{categoriaTest}', parsedArgs.categoriaTest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaTestController::show
 * @see app/Http/Controllers/CategoriaTestController.php:221
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
show.get = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CategoriaTestController::show
 * @see app/Http/Controllers/CategoriaTestController.php:221
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
show.head = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CategoriaTestController::show
 * @see app/Http/Controllers/CategoriaTestController.php:221
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
    const showForm = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CategoriaTestController::show
 * @see app/Http/Controllers/CategoriaTestController.php:221
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
        showForm.get = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CategoriaTestController::show
 * @see app/Http/Controllers/CategoriaTestController.php:221
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}'
 */
        showForm.head = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const categoriasTest = {
    store,
update,
destroy,
reorder,
index,
show,
}

export default categoriasTest