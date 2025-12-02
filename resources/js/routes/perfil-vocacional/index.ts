import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TestVocacionalController::generar
 * @see app/Http/Controllers/TestVocacionalController.php:1211
 * @route '/perfil-vocacional/generar'
 */
export const generar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generar.url(options),
    method: 'post',
})

generar.definition = {
    methods: ["post"],
    url: '/perfil-vocacional/generar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::generar
 * @see app/Http/Controllers/TestVocacionalController.php:1211
 * @route '/perfil-vocacional/generar'
 */
generar.url = (options?: RouteQueryOptions) => {
    return generar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::generar
 * @see app/Http/Controllers/TestVocacionalController.php:1211
 * @route '/perfil-vocacional/generar'
 */
generar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::generar
 * @see app/Http/Controllers/TestVocacionalController.php:1211
 * @route '/perfil-vocacional/generar'
 */
    const generarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::generar
 * @see app/Http/Controllers/TestVocacionalController.php:1211
 * @route '/perfil-vocacional/generar'
 */
        generarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generar.url(options),
            method: 'post',
        })
    
    generar.form = generarForm
/**
* @see \App\Http\Controllers\TestVocacionalController::obtener
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
export const obtener = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtener.url(options),
    method: 'get',
})

obtener.definition = {
    methods: ["get","head"],
    url: '/perfil-vocacional/obtener',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::obtener
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
obtener.url = (options?: RouteQueryOptions) => {
    return obtener.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::obtener
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
obtener.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtener.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::obtener
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
obtener.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtener.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::obtener
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
    const obtenerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtener.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::obtener
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
        obtenerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtener.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::obtener
 * @see app/Http/Controllers/TestVocacionalController.php:1279
 * @route '/perfil-vocacional/obtener'
 */
        obtenerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtener.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtener.form = obtenerForm
/**
* @see \App\Http\Controllers\TestVocacionalController::mostrar
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
export const mostrar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mostrar.url(options),
    method: 'get',
})

mostrar.definition = {
    methods: ["get","head"],
    url: '/perfil-vocacional',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestVocacionalController::mostrar
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
mostrar.url = (options?: RouteQueryOptions) => {
    return mostrar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestVocacionalController::mostrar
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
mostrar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mostrar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestVocacionalController::mostrar
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
mostrar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mostrar.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestVocacionalController::mostrar
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
    const mostrarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: mostrar.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestVocacionalController::mostrar
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
        mostrarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mostrar.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestVocacionalController::mostrar
 * @see app/Http/Controllers/TestVocacionalController.php:1312
 * @route '/perfil-vocacional'
 */
        mostrarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mostrar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    mostrar.form = mostrarForm
const perfilVocacional = {
    generar,
obtener,
mostrar,
}

export default perfilVocacional