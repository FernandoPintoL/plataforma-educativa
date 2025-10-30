import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CalificacionController::store
 * @see app/Http/Controllers/CalificacionController.php:69
 * @route '/trabajos/{trabajo}/calificar'
 */
export const store = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trabajos/{trabajo}/calificar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CalificacionController::store
 * @see app/Http/Controllers/CalificacionController.php:69
 * @route '/trabajos/{trabajo}/calificar'
 */
store.url = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { trabajo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { trabajo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    trabajo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        trabajo: typeof args.trabajo === 'object'
                ? args.trabajo.id
                : args.trabajo,
                }

    return store.definition.url
            .replace('{trabajo}', parsedArgs.trabajo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalificacionController::store
 * @see app/Http/Controllers/CalificacionController.php:69
 * @route '/trabajos/{trabajo}/calificar'
 */
store.post = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CalificacionController::store
 * @see app/Http/Controllers/CalificacionController.php:69
 * @route '/trabajos/{trabajo}/calificar'
 */
    const storeForm = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CalificacionController::store
 * @see app/Http/Controllers/CalificacionController.php:69
 * @route '/trabajos/{trabajo}/calificar'
 */
        storeForm.post = (args: { trabajo: number | { id: number } } | [trabajo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const calificacion = {
    store,
}

export default calificacion