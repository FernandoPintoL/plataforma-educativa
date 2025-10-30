import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:152
* @route '/recursos/{recurso}/descargar'
*/
export const descargar = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargar.url(args, options),
    method: 'get',
})

descargar.definition = {
    methods: ["get","head"],
    url: '/recursos/{recurso}/descargar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:152
* @route '/recursos/{recurso}/descargar'
*/
descargar.url = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurso: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recurso: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recurso: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recurso: typeof args.recurso === 'object'
        ? args.recurso.id
        : args.recurso,
    }

    return descargar.definition.url
            .replace('{recurso}', parsedArgs.recurso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:152
* @route '/recursos/{recurso}/descargar'
*/
descargar.get = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:152
* @route '/recursos/{recurso}/descargar'
*/
descargar.head = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargar.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:152
* @route '/recursos/{recurso}/descargar'
*/
const descargarForm = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: descargar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:152
* @route '/recursos/{recurso}/descargar'
*/
descargarForm.get = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: descargar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::descargar
* @see app/Http/Controllers/RecursoController.php:152
* @route '/recursos/{recurso}/descargar'
*/
descargarForm.head = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: descargar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

descargar.form = descargarForm

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:202
* @route '/recursos/{recurso}/ver'
*/
export const ver = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ver.url(args, options),
    method: 'get',
})

ver.definition = {
    methods: ["get","head"],
    url: '/recursos/{recurso}/ver',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:202
* @route '/recursos/{recurso}/ver'
*/
ver.url = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurso: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recurso: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recurso: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recurso: typeof args.recurso === 'object'
        ? args.recurso.id
        : args.recurso,
    }

    return ver.definition.url
            .replace('{recurso}', parsedArgs.recurso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:202
* @route '/recursos/{recurso}/ver'
*/
ver.get = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ver.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:202
* @route '/recursos/{recurso}/ver'
*/
ver.head = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ver.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:202
* @route '/recursos/{recurso}/ver'
*/
const verForm = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ver.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:202
* @route '/recursos/{recurso}/ver'
*/
verForm.get = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ver.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::ver
* @see app/Http/Controllers/RecursoController.php:202
* @route '/recursos/{recurso}/ver'
*/
verForm.head = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ver.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ver.form = verForm

/**
* @see \App\Http\Controllers\RecursoController::index
* @see app/Http/Controllers/RecursoController.php:15
* @route '/recursos'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/recursos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecursoController::index
* @see app/Http/Controllers/RecursoController.php:15
* @route '/recursos'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecursoController::index
* @see app/Http/Controllers/RecursoController.php:15
* @route '/recursos'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::index
* @see app/Http/Controllers/RecursoController.php:15
* @route '/recursos'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecursoController::index
* @see app/Http/Controllers/RecursoController.php:15
* @route '/recursos'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::index
* @see app/Http/Controllers/RecursoController.php:15
* @route '/recursos'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::index
* @see app/Http/Controllers/RecursoController.php:15
* @route '/recursos'
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
* @see \App\Http\Controllers\RecursoController::create
* @see app/Http/Controllers/RecursoController.php:55
* @route '/recursos/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/recursos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecursoController::create
* @see app/Http/Controllers/RecursoController.php:55
* @route '/recursos/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecursoController::create
* @see app/Http/Controllers/RecursoController.php:55
* @route '/recursos/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::create
* @see app/Http/Controllers/RecursoController.php:55
* @route '/recursos/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecursoController::create
* @see app/Http/Controllers/RecursoController.php:55
* @route '/recursos/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::create
* @see app/Http/Controllers/RecursoController.php:55
* @route '/recursos/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::create
* @see app/Http/Controllers/RecursoController.php:55
* @route '/recursos/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\RecursoController::store
* @see app/Http/Controllers/RecursoController.php:63
* @route '/recursos'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/recursos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecursoController::store
* @see app/Http/Controllers/RecursoController.php:63
* @route '/recursos'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecursoController::store
* @see app/Http/Controllers/RecursoController.php:63
* @route '/recursos'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecursoController::store
* @see app/Http/Controllers/RecursoController.php:63
* @route '/recursos'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecursoController::store
* @see app/Http/Controllers/RecursoController.php:63
* @route '/recursos'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\RecursoController::show
* @see app/Http/Controllers/RecursoController.php:95
* @route '/recursos/{recurso}'
*/
export const show = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/recursos/{recurso}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecursoController::show
* @see app/Http/Controllers/RecursoController.php:95
* @route '/recursos/{recurso}'
*/
show.url = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurso: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recurso: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recurso: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recurso: typeof args.recurso === 'object'
        ? args.recurso.id
        : args.recurso,
    }

    return show.definition.url
            .replace('{recurso}', parsedArgs.recurso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecursoController::show
* @see app/Http/Controllers/RecursoController.php:95
* @route '/recursos/{recurso}'
*/
show.get = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::show
* @see app/Http/Controllers/RecursoController.php:95
* @route '/recursos/{recurso}'
*/
show.head = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecursoController::show
* @see app/Http/Controllers/RecursoController.php:95
* @route '/recursos/{recurso}'
*/
const showForm = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::show
* @see app/Http/Controllers/RecursoController.php:95
* @route '/recursos/{recurso}'
*/
showForm.get = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::show
* @see app/Http/Controllers/RecursoController.php:95
* @route '/recursos/{recurso}'
*/
showForm.head = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\RecursoController::edit
* @see app/Http/Controllers/RecursoController.php:105
* @route '/recursos/{recurso}/edit'
*/
export const edit = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/recursos/{recurso}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecursoController::edit
* @see app/Http/Controllers/RecursoController.php:105
* @route '/recursos/{recurso}/edit'
*/
edit.url = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurso: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recurso: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recurso: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recurso: typeof args.recurso === 'object'
        ? args.recurso.id
        : args.recurso,
    }

    return edit.definition.url
            .replace('{recurso}', parsedArgs.recurso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecursoController::edit
* @see app/Http/Controllers/RecursoController.php:105
* @route '/recursos/{recurso}/edit'
*/
edit.get = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::edit
* @see app/Http/Controllers/RecursoController.php:105
* @route '/recursos/{recurso}/edit'
*/
edit.head = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecursoController::edit
* @see app/Http/Controllers/RecursoController.php:105
* @route '/recursos/{recurso}/edit'
*/
const editForm = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::edit
* @see app/Http/Controllers/RecursoController.php:105
* @route '/recursos/{recurso}/edit'
*/
editForm.get = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecursoController::edit
* @see app/Http/Controllers/RecursoController.php:105
* @route '/recursos/{recurso}/edit'
*/
editForm.head = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\RecursoController::update
* @see app/Http/Controllers/RecursoController.php:115
* @route '/recursos/{recurso}'
*/
export const update = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/recursos/{recurso}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\RecursoController::update
* @see app/Http/Controllers/RecursoController.php:115
* @route '/recursos/{recurso}'
*/
update.url = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurso: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recurso: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recurso: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recurso: typeof args.recurso === 'object'
        ? args.recurso.id
        : args.recurso,
    }

    return update.definition.url
            .replace('{recurso}', parsedArgs.recurso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecursoController::update
* @see app/Http/Controllers/RecursoController.php:115
* @route '/recursos/{recurso}'
*/
update.put = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\RecursoController::update
* @see app/Http/Controllers/RecursoController.php:115
* @route '/recursos/{recurso}'
*/
update.patch = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\RecursoController::update
* @see app/Http/Controllers/RecursoController.php:115
* @route '/recursos/{recurso}'
*/
const updateForm = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecursoController::update
* @see app/Http/Controllers/RecursoController.php:115
* @route '/recursos/{recurso}'
*/
updateForm.put = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecursoController::update
* @see app/Http/Controllers/RecursoController.php:115
* @route '/recursos/{recurso}'
*/
updateForm.patch = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\RecursoController::destroy
* @see app/Http/Controllers/RecursoController.php:245
* @route '/recursos/{recurso}'
*/
export const destroy = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/recursos/{recurso}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RecursoController::destroy
* @see app/Http/Controllers/RecursoController.php:245
* @route '/recursos/{recurso}'
*/
destroy.url = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurso: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recurso: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recurso: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recurso: typeof args.recurso === 'object'
        ? args.recurso.id
        : args.recurso,
    }

    return destroy.definition.url
            .replace('{recurso}', parsedArgs.recurso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecursoController::destroy
* @see app/Http/Controllers/RecursoController.php:245
* @route '/recursos/{recurso}'
*/
destroy.delete = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\RecursoController::destroy
* @see app/Http/Controllers/RecursoController.php:245
* @route '/recursos/{recurso}'
*/
const destroyForm = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecursoController::destroy
* @see app/Http/Controllers/RecursoController.php:245
* @route '/recursos/{recurso}'
*/
destroyForm.delete = (args: { recurso: number | { id: number } } | [recurso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const recursos = {
    descargar,
    ver,
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy,
}

export default recursos