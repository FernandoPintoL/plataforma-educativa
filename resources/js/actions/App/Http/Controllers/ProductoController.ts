import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/app/productos'
 */
const indexApi5f94bd91c3d48d955f7b536c0a3189e1 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi5f94bd91c3d48d955f7b536c0a3189e1.url(options),
    method: 'get',
})

indexApi5f94bd91c3d48d955f7b536c0a3189e1.definition = {
    methods: ["get","head"],
    url: '/api/app/productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/app/productos'
 */
indexApi5f94bd91c3d48d955f7b536c0a3189e1.url = (options?: RouteQueryOptions) => {
    return indexApi5f94bd91c3d48d955f7b536c0a3189e1.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/app/productos'
 */
indexApi5f94bd91c3d48d955f7b536c0a3189e1.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi5f94bd91c3d48d955f7b536c0a3189e1.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/app/productos'
 */
indexApi5f94bd91c3d48d955f7b536c0a3189e1.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexApi5f94bd91c3d48d955f7b536c0a3189e1.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/app/productos'
 */
    const indexApi5f94bd91c3d48d955f7b536c0a3189e1Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexApi5f94bd91c3d48d955f7b536c0a3189e1.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/app/productos'
 */
        indexApi5f94bd91c3d48d955f7b536c0a3189e1Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi5f94bd91c3d48d955f7b536c0a3189e1.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/app/productos'
 */
        indexApi5f94bd91c3d48d955f7b536c0a3189e1Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi5f94bd91c3d48d955f7b536c0a3189e1.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexApi5f94bd91c3d48d955f7b536c0a3189e1.form = indexApi5f94bd91c3d48d955f7b536c0a3189e1Form
    /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/productos'
 */
const indexApica1ca34b4a118f4e84d7e3af666cfc55 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApica1ca34b4a118f4e84d7e3af666cfc55.url(options),
    method: 'get',
})

indexApica1ca34b4a118f4e84d7e3af666cfc55.definition = {
    methods: ["get","head"],
    url: '/api/productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/productos'
 */
indexApica1ca34b4a118f4e84d7e3af666cfc55.url = (options?: RouteQueryOptions) => {
    return indexApica1ca34b4a118f4e84d7e3af666cfc55.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/productos'
 */
indexApica1ca34b4a118f4e84d7e3af666cfc55.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApica1ca34b4a118f4e84d7e3af666cfc55.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/productos'
 */
indexApica1ca34b4a118f4e84d7e3af666cfc55.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexApica1ca34b4a118f4e84d7e3af666cfc55.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/productos'
 */
    const indexApica1ca34b4a118f4e84d7e3af666cfc55Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexApica1ca34b4a118f4e84d7e3af666cfc55.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/productos'
 */
        indexApica1ca34b4a118f4e84d7e3af666cfc55Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApica1ca34b4a118f4e84d7e3af666cfc55.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see [unknown]:0
 * @route '/api/productos'
 */
        indexApica1ca34b4a118f4e84d7e3af666cfc55Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApica1ca34b4a118f4e84d7e3af666cfc55.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexApica1ca34b4a118f4e84d7e3af666cfc55.form = indexApica1ca34b4a118f4e84d7e3af666cfc55Form

export const indexApi = {
    '/api/app/productos': indexApi5f94bd91c3d48d955f7b536c0a3189e1,
    '/api/productos': indexApica1ca34b4a118f4e84d7e3af666cfc55,
}

/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/app/productos/{producto}'
 */
const showApibf7395ef11ddc0ca3b5c235b5d86f8b9 = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url(args, options),
    method: 'get',
})

showApibf7395ef11ddc0ca3b5c235b5d86f8b9.definition = {
    methods: ["get","head"],
    url: '/api/app/productos/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/app/productos/{producto}'
 */
showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: args.producto,
                }

    return showApibf7395ef11ddc0ca3b5c235b5d86f8b9.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/app/productos/{producto}'
 */
showApibf7395ef11ddc0ca3b5c235b5d86f8b9.get = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/app/productos/{producto}'
 */
showApibf7395ef11ddc0ca3b5c235b5d86f8b9.head = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/app/productos/{producto}'
 */
    const showApibf7395ef11ddc0ca3b5c235b5d86f8b9Form = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/app/productos/{producto}'
 */
        showApibf7395ef11ddc0ca3b5c235b5d86f8b9Form.get = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/app/productos/{producto}'
 */
        showApibf7395ef11ddc0ca3b5c235b5d86f8b9Form.head = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showApibf7395ef11ddc0ca3b5c235b5d86f8b9.form = showApibf7395ef11ddc0ca3b5c235b5d86f8b9Form
    /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
const showApib4e9327e675be9b4660423209f3885e4 = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApib4e9327e675be9b4660423209f3885e4.url(args, options),
    method: 'get',
})

showApib4e9327e675be9b4660423209f3885e4.definition = {
    methods: ["get","head"],
    url: '/api/productos/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
showApib4e9327e675be9b4660423209f3885e4.url = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: args.producto,
                }

    return showApib4e9327e675be9b4660423209f3885e4.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
showApib4e9327e675be9b4660423209f3885e4.get = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApib4e9327e675be9b4660423209f3885e4.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
showApib4e9327e675be9b4660423209f3885e4.head = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showApib4e9327e675be9b4660423209f3885e4.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
    const showApib4e9327e675be9b4660423209f3885e4Form = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showApib4e9327e675be9b4660423209f3885e4.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
        showApib4e9327e675be9b4660423209f3885e4Form.get = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApib4e9327e675be9b4660423209f3885e4.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
        showApib4e9327e675be9b4660423209f3885e4Form.head = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApib4e9327e675be9b4660423209f3885e4.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showApib4e9327e675be9b4660423209f3885e4.form = showApib4e9327e675be9b4660423209f3885e4Form

export const showApi = {
    '/api/app/productos/{producto}': showApibf7395ef11ddc0ca3b5c235b5d86f8b9,
    '/api/productos/{producto}': showApib4e9327e675be9b4660423209f3885e4,
}

/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/app/productos/buscar'
 */
const buscarApi2f647e659f2ae29cad5423e3d6248ee7 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi2f647e659f2ae29cad5423e3d6248ee7.url(options),
    method: 'get',
})

buscarApi2f647e659f2ae29cad5423e3d6248ee7.definition = {
    methods: ["get","head"],
    url: '/api/app/productos/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/app/productos/buscar'
 */
buscarApi2f647e659f2ae29cad5423e3d6248ee7.url = (options?: RouteQueryOptions) => {
    return buscarApi2f647e659f2ae29cad5423e3d6248ee7.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/app/productos/buscar'
 */
buscarApi2f647e659f2ae29cad5423e3d6248ee7.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi2f647e659f2ae29cad5423e3d6248ee7.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/app/productos/buscar'
 */
buscarApi2f647e659f2ae29cad5423e3d6248ee7.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarApi2f647e659f2ae29cad5423e3d6248ee7.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/app/productos/buscar'
 */
    const buscarApi2f647e659f2ae29cad5423e3d6248ee7Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarApi2f647e659f2ae29cad5423e3d6248ee7.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/app/productos/buscar'
 */
        buscarApi2f647e659f2ae29cad5423e3d6248ee7Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi2f647e659f2ae29cad5423e3d6248ee7.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/app/productos/buscar'
 */
        buscarApi2f647e659f2ae29cad5423e3d6248ee7Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi2f647e659f2ae29cad5423e3d6248ee7.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarApi2f647e659f2ae29cad5423e3d6248ee7.form = buscarApi2f647e659f2ae29cad5423e3d6248ee7Form
    /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/productos/buscar'
 */
const buscarApi124bf748977a65c9d7e76c3fc9c13e6d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url(options),
    method: 'get',
})

buscarApi124bf748977a65c9d7e76c3fc9c13e6d.definition = {
    methods: ["get","head"],
    url: '/api/productos/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/productos/buscar'
 */
buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url = (options?: RouteQueryOptions) => {
    return buscarApi124bf748977a65c9d7e76c3fc9c13e6d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/productos/buscar'
 */
buscarApi124bf748977a65c9d7e76c3fc9c13e6d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/productos/buscar'
 */
buscarApi124bf748977a65c9d7e76c3fc9c13e6d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/productos/buscar'
 */
    const buscarApi124bf748977a65c9d7e76c3fc9c13e6dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/productos/buscar'
 */
        buscarApi124bf748977a65c9d7e76c3fc9c13e6dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see [unknown]:0
 * @route '/api/productos/buscar'
 */
        buscarApi124bf748977a65c9d7e76c3fc9c13e6dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarApi124bf748977a65c9d7e76c3fc9c13e6d.form = buscarApi124bf748977a65c9d7e76c3fc9c13e6dForm

export const buscarApi = {
    '/api/app/productos/buscar': buscarApi2f647e659f2ae29cad5423e3d6248ee7,
    '/api/productos/buscar': buscarApi124bf748977a65c9d7e76c3fc9c13e6d,
}

/**
* @see \App\Http\Controllers\ProductoController::storeApi
 * @see [unknown]:0
 * @route '/api/productos'
 */
export const storeApi = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApi.url(options),
    method: 'post',
})

storeApi.definition = {
    methods: ["post"],
    url: '/api/productos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductoController::storeApi
 * @see [unknown]:0
 * @route '/api/productos'
 */
storeApi.url = (options?: RouteQueryOptions) => {
    return storeApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::storeApi
 * @see [unknown]:0
 * @route '/api/productos'
 */
storeApi.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApi.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductoController::storeApi
 * @see [unknown]:0
 * @route '/api/productos'
 */
    const storeApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeApi.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::storeApi
 * @see [unknown]:0
 * @route '/api/productos'
 */
        storeApiForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeApi.url(options),
            method: 'post',
        })
    
    storeApi.form = storeApiForm
/**
* @see \App\Http\Controllers\ProductoController::updateApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
export const updateApi = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateApi.url(args, options),
    method: 'put',
})

updateApi.definition = {
    methods: ["put"],
    url: '/api/productos/{producto}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProductoController::updateApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
updateApi.url = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: args.producto,
                }

    return updateApi.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::updateApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
updateApi.put = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateApi.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ProductoController::updateApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
    const updateApiForm = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateApi.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::updateApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
        updateApiForm.put = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ProductoController::destroyApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
export const destroyApi = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyApi.url(args, options),
    method: 'delete',
})

destroyApi.definition = {
    methods: ["delete"],
    url: '/api/productos/{producto}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductoController::destroyApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
destroyApi.url = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: args.producto,
                }

    return destroyApi.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::destroyApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
destroyApi.delete = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyApi.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductoController::destroyApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
    const destroyApiForm = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyApi.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::destroyApi
 * @see [unknown]:0
 * @route '/api/productos/{producto}'
 */
        destroyApiForm.delete = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyApi.form = destroyApiForm
/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see [unknown]:0
 * @route '/api/productos/{producto}/historial-precios'
 */
export const historialPrecios = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialPrecios.url(args, options),
    method: 'get',
})

historialPrecios.definition = {
    methods: ["get","head"],
    url: '/api/productos/{producto}/historial-precios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see [unknown]:0
 * @route '/api/productos/{producto}/historial-precios'
 */
historialPrecios.url = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: args.producto,
                }

    return historialPrecios.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see [unknown]:0
 * @route '/api/productos/{producto}/historial-precios'
 */
historialPrecios.get = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialPrecios.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see [unknown]:0
 * @route '/api/productos/{producto}/historial-precios'
 */
historialPrecios.head = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historialPrecios.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see [unknown]:0
 * @route '/api/productos/{producto}/historial-precios'
 */
    const historialPreciosForm = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historialPrecios.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see [unknown]:0
 * @route '/api/productos/{producto}/historial-precios'
 */
        historialPreciosForm.get = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialPrecios.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see [unknown]:0
 * @route '/api/productos/{producto}/historial-precios'
 */
        historialPreciosForm.head = (args: { producto: string | number } | [producto: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialPrecios.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historialPrecios.form = historialPreciosForm
const ProductoController = { indexApi, showApi, buscarApi, storeApi, updateApi, destroyApi, historialPrecios }

export default ProductoController