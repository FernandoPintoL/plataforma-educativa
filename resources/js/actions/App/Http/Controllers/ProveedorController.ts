import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProveedorController::storeApi
 * @see app/Http/Controllers/ProveedorController.php:164
 * @route '/api/proveedores'
 */
export const storeApi = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApi.url(options),
    method: 'post',
})

storeApi.definition = {
    methods: ["post"],
    url: '/api/proveedores',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProveedorController::storeApi
 * @see app/Http/Controllers/ProveedorController.php:164
 * @route '/api/proveedores'
 */
storeApi.url = (options?: RouteQueryOptions) => {
    return storeApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProveedorController::storeApi
 * @see app/Http/Controllers/ProveedorController.php:164
 * @route '/api/proveedores'
 */
storeApi.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApi.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProveedorController::storeApi
 * @see app/Http/Controllers/ProveedorController.php:164
 * @route '/api/proveedores'
 */
    const storeApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeApi.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProveedorController::storeApi
 * @see app/Http/Controllers/ProveedorController.php:164
 * @route '/api/proveedores'
 */
        storeApiForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeApi.url(options),
            method: 'post',
        })
    
    storeApi.form = storeApiForm
/**
* @see \App\Http\Controllers\ProveedorController::buscarApi
 * @see app/Http/Controllers/ProveedorController.php:70
 * @route '/api/proveedores/buscar'
 */
export const buscarApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi.url(options),
    method: 'get',
})

buscarApi.definition = {
    methods: ["get","head"],
    url: '/api/proveedores/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProveedorController::buscarApi
 * @see app/Http/Controllers/ProveedorController.php:70
 * @route '/api/proveedores/buscar'
 */
buscarApi.url = (options?: RouteQueryOptions) => {
    return buscarApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProveedorController::buscarApi
 * @see app/Http/Controllers/ProveedorController.php:70
 * @route '/api/proveedores/buscar'
 */
buscarApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProveedorController::buscarApi
 * @see app/Http/Controllers/ProveedorController.php:70
 * @route '/api/proveedores/buscar'
 */
buscarApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProveedorController::buscarApi
 * @see app/Http/Controllers/ProveedorController.php:70
 * @route '/api/proveedores/buscar'
 */
    const buscarApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProveedorController::buscarApi
 * @see app/Http/Controllers/ProveedorController.php:70
 * @route '/api/proveedores/buscar'
 */
        buscarApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProveedorController::buscarApi
 * @see app/Http/Controllers/ProveedorController.php:70
 * @route '/api/proveedores/buscar'
 */
        buscarApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarApi.form = buscarApiForm
const ProveedorController = { storeApi, buscarApi }

export default ProveedorController