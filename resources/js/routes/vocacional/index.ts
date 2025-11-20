import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see [serialized-closure]:2
 * @route '/vocacional'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/vocacional',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/vocacional'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/vocacional'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/vocacional'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see [serialized-closure]:2
 * @route '/vocacional'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see [serialized-closure]:2
 * @route '/vocacional'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see [serialized-closure]:2
 * @route '/vocacional'
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
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
export const perfil = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: perfil.url(options),
    method: 'get',
})

perfil.definition = {
    methods: ["get","head"],
    url: '/vocacional/perfil',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
perfil.url = (options?: RouteQueryOptions) => {
    return perfil.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
perfil.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: perfil.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
perfil.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: perfil.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
    const perfilForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: perfil.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
        perfilForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: perfil.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VocacionalController::perfil
 * @see app/Http/Controllers/VocacionalController.php:14
 * @route '/vocacional/perfil'
 */
        perfilForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: perfil.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    perfil.form = perfilForm
/**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
export const recomendaciones = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recomendaciones.url(options),
    method: 'get',
})

recomendaciones.definition = {
    methods: ["get","head"],
    url: '/vocacional/recomendaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
recomendaciones.url = (options?: RouteQueryOptions) => {
    return recomendaciones.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
recomendaciones.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recomendaciones.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
recomendaciones.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recomendaciones.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
    const recomendacionesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: recomendaciones.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
        recomendacionesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recomendaciones.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VocacionalController::recomendaciones
 * @see app/Http/Controllers/VocacionalController.php:37
 * @route '/vocacional/recomendaciones'
 */
        recomendacionesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recomendaciones.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    recomendaciones.form = recomendacionesForm
const vocacional = {
    index,
perfil,
recomendaciones,
}

export default vocacional