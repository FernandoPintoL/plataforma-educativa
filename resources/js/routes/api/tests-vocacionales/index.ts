import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TestVocacionalApiController::index
 * @see app/Http/Controllers/Api/TestVocacionalApiController.php:16
 * @route '/api/tests-vocacionales'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/tests-vocacionales',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TestVocacionalApiController::index
 * @see app/Http/Controllers/Api/TestVocacionalApiController.php:16
 * @route '/api/tests-vocacionales'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TestVocacionalApiController::index
 * @see app/Http/Controllers/Api/TestVocacionalApiController.php:16
 * @route '/api/tests-vocacionales'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TestVocacionalApiController::index
 * @see app/Http/Controllers/Api/TestVocacionalApiController.php:16
 * @route '/api/tests-vocacionales'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TestVocacionalApiController::index
 * @see app/Http/Controllers/Api/TestVocacionalApiController.php:16
 * @route '/api/tests-vocacionales'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TestVocacionalApiController::index
 * @see app/Http/Controllers/Api/TestVocacionalApiController.php:16
 * @route '/api/tests-vocacionales'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TestVocacionalApiController::index
 * @see app/Http/Controllers/Api/TestVocacionalApiController.php:16
 * @route '/api/tests-vocacionales'
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
const testsVocacionales = {
    index,
}

export default testsVocacionales