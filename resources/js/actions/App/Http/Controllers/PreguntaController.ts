import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PreguntaController::store
* @see app/Http/Controllers/PreguntaController.php:16
* @route '/preguntas'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/preguntas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PreguntaController::store
* @see app/Http/Controllers/PreguntaController.php:16
* @route '/preguntas'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreguntaController::store
* @see app/Http/Controllers/PreguntaController.php:16
* @route '/preguntas'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PreguntaController::store
* @see app/Http/Controllers/PreguntaController.php:16
* @route '/preguntas'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PreguntaController::store
* @see app/Http/Controllers/PreguntaController.php:16
* @route '/preguntas'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PreguntaController::update
* @see app/Http/Controllers/PreguntaController.php:51
* @route '/preguntas/{pregunta}'
*/
export const update = (args: { pregunta: number | { id: number } } | [pregunta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/preguntas/{pregunta}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PreguntaController::update
* @see app/Http/Controllers/PreguntaController.php:51
* @route '/preguntas/{pregunta}'
*/
update.url = (args: { pregunta: number | { id: number } } | [pregunta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pregunta: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { pregunta: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            pregunta: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pregunta: typeof args.pregunta === 'object'
        ? args.pregunta.id
        : args.pregunta,
    }

    return update.definition.url
            .replace('{pregunta}', parsedArgs.pregunta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreguntaController::update
* @see app/Http/Controllers/PreguntaController.php:51
* @route '/preguntas/{pregunta}'
*/
update.put = (args: { pregunta: number | { id: number } } | [pregunta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PreguntaController::update
* @see app/Http/Controllers/PreguntaController.php:51
* @route '/preguntas/{pregunta}'
*/
const updateForm = (args: { pregunta: number | { id: number } } | [pregunta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PreguntaController::update
* @see app/Http/Controllers/PreguntaController.php:51
* @route '/preguntas/{pregunta}'
*/
updateForm.put = (args: { pregunta: number | { id: number } } | [pregunta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\PreguntaController::destroy
* @see app/Http/Controllers/PreguntaController.php:79
* @route '/preguntas/{pregunta}'
*/
export const destroy = (args: { pregunta: number | { id: number } } | [pregunta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/preguntas/{pregunta}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PreguntaController::destroy
* @see app/Http/Controllers/PreguntaController.php:79
* @route '/preguntas/{pregunta}'
*/
destroy.url = (args: { pregunta: number | { id: number } } | [pregunta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pregunta: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { pregunta: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            pregunta: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pregunta: typeof args.pregunta === 'object'
        ? args.pregunta.id
        : args.pregunta,
    }

    return destroy.definition.url
            .replace('{pregunta}', parsedArgs.pregunta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreguntaController::destroy
* @see app/Http/Controllers/PreguntaController.php:79
* @route '/preguntas/{pregunta}'
*/
destroy.delete = (args: { pregunta: number | { id: number } } | [pregunta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PreguntaController::destroy
* @see app/Http/Controllers/PreguntaController.php:79
* @route '/preguntas/{pregunta}'
*/
const destroyForm = (args: { pregunta: number | { id: number } } | [pregunta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PreguntaController::destroy
* @see app/Http/Controllers/PreguntaController.php:79
* @route '/preguntas/{pregunta}'
*/
destroyForm.delete = (args: { pregunta: number | { id: number } } | [pregunta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\PreguntaController::reorder
* @see app/Http/Controllers/PreguntaController.php:100
* @route '/evaluaciones/{evaluacion}/preguntas/reorder'
*/
export const reorder = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/evaluaciones/{evaluacion}/preguntas/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PreguntaController::reorder
* @see app/Http/Controllers/PreguntaController.php:100
* @route '/evaluaciones/{evaluacion}/preguntas/reorder'
*/
reorder.url = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluacion: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { evaluacion: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            evaluacion: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        evaluacion: typeof args.evaluacion === 'object'
        ? args.evaluacion.id
        : args.evaluacion,
    }

    return reorder.definition.url
            .replace('{evaluacion}', parsedArgs.evaluacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreguntaController::reorder
* @see app/Http/Controllers/PreguntaController.php:100
* @route '/evaluaciones/{evaluacion}/preguntas/reorder'
*/
reorder.post = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PreguntaController::reorder
* @see app/Http/Controllers/PreguntaController.php:100
* @route '/evaluaciones/{evaluacion}/preguntas/reorder'
*/
const reorderForm = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PreguntaController::reorder
* @see app/Http/Controllers/PreguntaController.php:100
* @route '/evaluaciones/{evaluacion}/preguntas/reorder'
*/
reorderForm.post = (args: { evaluacion: number | { id: number } } | [evaluacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

reorder.form = reorderForm

const PreguntaController = { store, update, destroy, reorder }

export default PreguntaController