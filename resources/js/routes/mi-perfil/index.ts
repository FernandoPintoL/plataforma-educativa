import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\MiPerfilController::riesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:17
 * @route '/api/mi-perfil/riesgo'
 */
export const riesgo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riesgo.url(options),
    method: 'get',
})

riesgo.definition = {
    methods: ["get","head"],
    url: '/api/mi-perfil/riesgo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MiPerfilController::riesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:17
 * @route '/api/mi-perfil/riesgo'
 */
riesgo.url = (options?: RouteQueryOptions) => {
    return riesgo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MiPerfilController::riesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:17
 * @route '/api/mi-perfil/riesgo'
 */
riesgo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riesgo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MiPerfilController::riesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:17
 * @route '/api/mi-perfil/riesgo'
 */
riesgo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: riesgo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\MiPerfilController::riesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:17
 * @route '/api/mi-perfil/riesgo'
 */
    const riesgoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: riesgo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\MiPerfilController::riesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:17
 * @route '/api/mi-perfil/riesgo'
 */
        riesgoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riesgo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\MiPerfilController::riesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:17
 * @route '/api/mi-perfil/riesgo'
 */
        riesgoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riesgo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    riesgo.form = riesgoForm
/**
* @see \App\Http\Controllers\Api\MiPerfilController::carreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:99
 * @route '/api/mi-perfil/carreras'
 */
export const carreras = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: carreras.url(options),
    method: 'get',
})

carreras.definition = {
    methods: ["get","head"],
    url: '/api/mi-perfil/carreras',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MiPerfilController::carreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:99
 * @route '/api/mi-perfil/carreras'
 */
carreras.url = (options?: RouteQueryOptions) => {
    return carreras.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MiPerfilController::carreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:99
 * @route '/api/mi-perfil/carreras'
 */
carreras.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: carreras.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MiPerfilController::carreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:99
 * @route '/api/mi-perfil/carreras'
 */
carreras.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: carreras.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\MiPerfilController::carreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:99
 * @route '/api/mi-perfil/carreras'
 */
    const carrerasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: carreras.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\MiPerfilController::carreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:99
 * @route '/api/mi-perfil/carreras'
 */
        carrerasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: carreras.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\MiPerfilController::carreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:99
 * @route '/api/mi-perfil/carreras'
 */
        carrerasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: carreras.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    carreras.form = carrerasForm
const miPerfil = {
    riesgo,
carreras,
}

export default miPerfil