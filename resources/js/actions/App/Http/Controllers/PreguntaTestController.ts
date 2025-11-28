import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PreguntaTestController::store
 * @see app/Http/Controllers/PreguntaTestController.php:73
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas'
 */
export const store = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PreguntaTestController::store
 * @see app/Http/Controllers/PreguntaTestController.php:73
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas'
 */
store.url = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace('{categoriaTest}', parsedArgs.categoriaTest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreguntaTestController::store
 * @see app/Http/Controllers/PreguntaTestController.php:73
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas'
 */
store.post = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PreguntaTestController::store
 * @see app/Http/Controllers/PreguntaTestController.php:73
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas'
 */
    const storeForm = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PreguntaTestController::store
 * @see app/Http/Controllers/PreguntaTestController.php:73
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas'
 */
        storeForm.post = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PreguntaTestController::update
 * @see app/Http/Controllers/PreguntaTestController.php:135
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
export const update = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PreguntaTestController::update
 * @see app/Http/Controllers/PreguntaTestController.php:135
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
update.url = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                    preguntaTest: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                                preguntaTest: args.preguntaTest,
                }

    return update.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace('{preguntaTest}', parsedArgs.preguntaTest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreguntaTestController::update
 * @see app/Http/Controllers/PreguntaTestController.php:135
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
update.put = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PreguntaTestController::update
 * @see app/Http/Controllers/PreguntaTestController.php:135
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
    const updateForm = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PreguntaTestController::update
 * @see app/Http/Controllers/PreguntaTestController.php:135
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
        updateForm.put = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PreguntaTestController::destroy
 * @see app/Http/Controllers/PreguntaTestController.php:189
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
export const destroy = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PreguntaTestController::destroy
 * @see app/Http/Controllers/PreguntaTestController.php:189
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
destroy.url = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                    preguntaTest: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                                preguntaTest: args.preguntaTest,
                }

    return destroy.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace('{preguntaTest}', parsedArgs.preguntaTest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreguntaTestController::destroy
 * @see app/Http/Controllers/PreguntaTestController.php:189
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
destroy.delete = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PreguntaTestController::destroy
 * @see app/Http/Controllers/PreguntaTestController.php:189
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
    const destroyForm = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PreguntaTestController::destroy
 * @see app/Http/Controllers/PreguntaTestController.php:189
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
        destroyForm.delete = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PreguntaTestController::reorder
 * @see app/Http/Controllers/PreguntaTestController.php:223
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas/reorder'
 */
export const reorder = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PreguntaTestController::reorder
 * @see app/Http/Controllers/PreguntaTestController.php:223
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas/reorder'
 */
reorder.url = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions) => {
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

    return reorder.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace('{categoriaTest}', parsedArgs.categoriaTest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreguntaTestController::reorder
 * @see app/Http/Controllers/PreguntaTestController.php:223
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas/reorder'
 */
reorder.post = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PreguntaTestController::reorder
 * @see app/Http/Controllers/PreguntaTestController.php:223
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas/reorder'
 */
    const reorderForm = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reorder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PreguntaTestController::reorder
 * @see app/Http/Controllers/PreguntaTestController.php:223
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas/reorder'
 */
        reorderForm.post = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reorder.url(args, options),
            method: 'post',
        })
    
    reorder.form = reorderForm
/**
* @see \App\Http\Controllers\PreguntaTestController::indexByCategoria
 * @see app/Http/Controllers/PreguntaTestController.php:290
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas'
 */
export const indexByCategoria = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexByCategoria.url(args, options),
    method: 'get',
})

indexByCategoria.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PreguntaTestController::indexByCategoria
 * @see app/Http/Controllers/PreguntaTestController.php:290
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas'
 */
indexByCategoria.url = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions) => {
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

    return indexByCategoria.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace('{categoriaTest}', parsedArgs.categoriaTest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreguntaTestController::indexByCategoria
 * @see app/Http/Controllers/PreguntaTestController.php:290
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas'
 */
indexByCategoria.get = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexByCategoria.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PreguntaTestController::indexByCategoria
 * @see app/Http/Controllers/PreguntaTestController.php:290
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas'
 */
indexByCategoria.head = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexByCategoria.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PreguntaTestController::indexByCategoria
 * @see app/Http/Controllers/PreguntaTestController.php:290
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas'
 */
    const indexByCategoriaForm = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexByCategoria.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PreguntaTestController::indexByCategoria
 * @see app/Http/Controllers/PreguntaTestController.php:290
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas'
 */
        indexByCategoriaForm.get = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexByCategoria.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PreguntaTestController::indexByCategoria
 * @see app/Http/Controllers/PreguntaTestController.php:290
 * @route '/tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas'
 */
        indexByCategoriaForm.head = (args: { testVocacional: string | number, categoriaTest: string | number } | [testVocacional: string | number, categoriaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexByCategoria.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexByCategoria.form = indexByCategoriaForm
/**
* @see \App\Http\Controllers\PreguntaTestController::show
 * @see app/Http/Controllers/PreguntaTestController.php:313
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
export const show = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PreguntaTestController::show
 * @see app/Http/Controllers/PreguntaTestController.php:313
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
show.url = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    testVocacional: args[0],
                    preguntaTest: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testVocacional: args.testVocacional,
                                preguntaTest: args.preguntaTest,
                }

    return show.definition.url
            .replace('{testVocacional}', parsedArgs.testVocacional.toString())
            .replace('{preguntaTest}', parsedArgs.preguntaTest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreguntaTestController::show
 * @see app/Http/Controllers/PreguntaTestController.php:313
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
show.get = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PreguntaTestController::show
 * @see app/Http/Controllers/PreguntaTestController.php:313
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
show.head = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PreguntaTestController::show
 * @see app/Http/Controllers/PreguntaTestController.php:313
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
    const showForm = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PreguntaTestController::show
 * @see app/Http/Controllers/PreguntaTestController.php:313
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
        showForm.get = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PreguntaTestController::show
 * @see app/Http/Controllers/PreguntaTestController.php:313
 * @route '/tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}'
 */
        showForm.head = (args: { testVocacional: string | number, preguntaTest: string | number } | [testVocacional: string | number, preguntaTest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PreguntaTestController::tipos
 * @see app/Http/Controllers/PreguntaTestController.php:331
 * @route '/preguntas-test/tipos'
 */
export const tipos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tipos.url(options),
    method: 'get',
})

tipos.definition = {
    methods: ["get","head"],
    url: '/preguntas-test/tipos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PreguntaTestController::tipos
 * @see app/Http/Controllers/PreguntaTestController.php:331
 * @route '/preguntas-test/tipos'
 */
tipos.url = (options?: RouteQueryOptions) => {
    return tipos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreguntaTestController::tipos
 * @see app/Http/Controllers/PreguntaTestController.php:331
 * @route '/preguntas-test/tipos'
 */
tipos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tipos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PreguntaTestController::tipos
 * @see app/Http/Controllers/PreguntaTestController.php:331
 * @route '/preguntas-test/tipos'
 */
tipos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tipos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PreguntaTestController::tipos
 * @see app/Http/Controllers/PreguntaTestController.php:331
 * @route '/preguntas-test/tipos'
 */
    const tiposForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: tipos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PreguntaTestController::tipos
 * @see app/Http/Controllers/PreguntaTestController.php:331
 * @route '/preguntas-test/tipos'
 */
        tiposForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tipos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PreguntaTestController::tipos
 * @see app/Http/Controllers/PreguntaTestController.php:331
 * @route '/preguntas-test/tipos'
 */
        tiposForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tipos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    tipos.form = tiposForm
const PreguntaTestController = { store, update, destroy, reorder, indexByCategoria, show, tipos }

export default PreguntaTestController