import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AsientoContableController::indexApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos'
 */
export const indexApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi.url(options),
    method: 'get',
})

indexApi.definition = {
    methods: ["get","head"],
    url: '/api/contabilidad/asientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AsientoContableController::indexApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos'
 */
indexApi.url = (options?: RouteQueryOptions) => {
    return indexApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsientoContableController::indexApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos'
 */
indexApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AsientoContableController::indexApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos'
 */
indexApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AsientoContableController::indexApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos'
 */
    const indexApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AsientoContableController::indexApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos'
 */
        indexApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AsientoContableController::indexApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos'
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
* @see \App\Http\Controllers\AsientoContableController::showApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos/{asientoContable}'
 */
export const showApi = (args: { asientoContable: string | number } | [asientoContable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})

showApi.definition = {
    methods: ["get","head"],
    url: '/api/contabilidad/asientos/{asientoContable}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AsientoContableController::showApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos/{asientoContable}'
 */
showApi.url = (args: { asientoContable: string | number } | [asientoContable: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asientoContable: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    asientoContable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        asientoContable: args.asientoContable,
                }

    return showApi.definition.url
            .replace('{asientoContable}', parsedArgs.asientoContable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsientoContableController::showApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos/{asientoContable}'
 */
showApi.get = (args: { asientoContable: string | number } | [asientoContable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AsientoContableController::showApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos/{asientoContable}'
 */
showApi.head = (args: { asientoContable: string | number } | [asientoContable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showApi.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AsientoContableController::showApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos/{asientoContable}'
 */
    const showApiForm = (args: { asientoContable: string | number } | [asientoContable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showApi.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AsientoContableController::showApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos/{asientoContable}'
 */
        showApiForm.get = (args: { asientoContable: string | number } | [asientoContable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApi.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AsientoContableController::showApi
 * @see [unknown]:0
 * @route '/api/contabilidad/asientos/{asientoContable}'
 */
        showApiForm.head = (args: { asientoContable: string | number } | [asientoContable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showApi.form = showApiForm
const AsientoContableController = { indexApi, showApi }

export default AsientoContableController