import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\MiPerfilController::getRiesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:20
 * @route '/api/mi-perfil/riesgo'
 */
export const getRiesgo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRiesgo.url(options),
    method: 'get',
})

getRiesgo.definition = {
    methods: ["get","head"],
    url: '/api/mi-perfil/riesgo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MiPerfilController::getRiesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:20
 * @route '/api/mi-perfil/riesgo'
 */
getRiesgo.url = (options?: RouteQueryOptions) => {
    return getRiesgo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MiPerfilController::getRiesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:20
 * @route '/api/mi-perfil/riesgo'
 */
getRiesgo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRiesgo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MiPerfilController::getRiesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:20
 * @route '/api/mi-perfil/riesgo'
 */
getRiesgo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRiesgo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\MiPerfilController::getRiesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:20
 * @route '/api/mi-perfil/riesgo'
 */
    const getRiesgoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getRiesgo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\MiPerfilController::getRiesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:20
 * @route '/api/mi-perfil/riesgo'
 */
        getRiesgoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRiesgo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\MiPerfilController::getRiesgo
 * @see app/Http/Controllers/Api/MiPerfilController.php:20
 * @route '/api/mi-perfil/riesgo'
 */
        getRiesgoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRiesgo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getRiesgo.form = getRiesgoForm
/**
* @see \App\Http\Controllers\Api\MiPerfilController::getCarreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:95
 * @route '/api/mi-perfil/carreras'
 */
export const getCarreras = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCarreras.url(options),
    method: 'get',
})

getCarreras.definition = {
    methods: ["get","head"],
    url: '/api/mi-perfil/carreras',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MiPerfilController::getCarreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:95
 * @route '/api/mi-perfil/carreras'
 */
getCarreras.url = (options?: RouteQueryOptions) => {
    return getCarreras.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MiPerfilController::getCarreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:95
 * @route '/api/mi-perfil/carreras'
 */
getCarreras.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCarreras.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MiPerfilController::getCarreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:95
 * @route '/api/mi-perfil/carreras'
 */
getCarreras.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCarreras.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\MiPerfilController::getCarreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:95
 * @route '/api/mi-perfil/carreras'
 */
    const getCarrerasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getCarreras.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\MiPerfilController::getCarreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:95
 * @route '/api/mi-perfil/carreras'
 */
        getCarrerasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCarreras.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\MiPerfilController::getCarreras
 * @see app/Http/Controllers/Api/MiPerfilController.php:95
 * @route '/api/mi-perfil/carreras'
 */
        getCarrerasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCarreras.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getCarreras.form = getCarrerasForm
const MiPerfilController = { getRiesgo, getCarreras }

export default MiPerfilController