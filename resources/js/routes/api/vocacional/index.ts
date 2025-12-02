import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
export const generarSintesisAgente = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generarSintesisAgente.url(options),
    method: 'get',
})

generarSintesisAgente.definition = {
    methods: ["get","head"],
    url: '/api/vocacional/generar-sintesis-agente',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
generarSintesisAgente.url = (options?: RouteQueryOptions) => {
    return generarSintesisAgente.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
generarSintesisAgente.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generarSintesisAgente.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
generarSintesisAgente.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generarSintesisAgente.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
    const generarSintesisAgenteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generarSintesisAgente.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
        generarSintesisAgenteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generarSintesisAgente.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::generarSintesisAgente
 * @see app/Http/Controllers/TestVocacionalController.php:1365
 * @route '/api/vocacional/generar-sintesis-agente'
 */
        generarSintesisAgenteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generarSintesisAgente.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generarSintesisAgente.form = generarSintesisAgenteForm
const vocacional = {
    generarSintesisAgente,
}

export default vocacional