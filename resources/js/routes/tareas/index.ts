import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TareaController::index
* @see app/Http/Controllers/TareaController.php:21
* @route '/tareas'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tareas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TareaController::index
* @see app/Http/Controllers/TareaController.php:21
* @route '/tareas'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::index
* @see app/Http/Controllers/TareaController.php:21
* @route '/tareas'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TareaController::index
* @see app/Http/Controllers/TareaController.php:21
* @route '/tareas'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TareaController::index
* @see app/Http/Controllers/TareaController.php:21
* @route '/tareas'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TareaController::index
* @see app/Http/Controllers/TareaController.php:21
* @route '/tareas'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TareaController::index
* @see app/Http/Controllers/TareaController.php:21
* @route '/tareas'
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
* @see \App\Http\Controllers\TareaController::show
* @see app/Http/Controllers/TareaController.php:185
* @route '/tareas/{tarea}'
*/
export const show = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tareas/{tarea}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TareaController::show
* @see app/Http/Controllers/TareaController.php:185
* @route '/tareas/{tarea}'
*/
show.url = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tarea: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tarea: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tarea: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tarea: typeof args.tarea === 'object'
        ? args.tarea.id
        : args.tarea,
    }

    return show.definition.url
            .replace('{tarea}', parsedArgs.tarea.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::show
* @see app/Http/Controllers/TareaController.php:185
* @route '/tareas/{tarea}'
*/
show.get = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TareaController::show
* @see app/Http/Controllers/TareaController.php:185
* @route '/tareas/{tarea}'
*/
show.head = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TareaController::show
* @see app/Http/Controllers/TareaController.php:185
* @route '/tareas/{tarea}'
*/
const showForm = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TareaController::show
* @see app/Http/Controllers/TareaController.php:185
* @route '/tareas/{tarea}'
*/
showForm.get = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TareaController::show
* @see app/Http/Controllers/TareaController.php:185
* @route '/tareas/{tarea}'
*/
showForm.head = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TareaController::create
* @see app/Http/Controllers/TareaController.php:79
* @route '/tareas/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tareas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TareaController::create
* @see app/Http/Controllers/TareaController.php:79
* @route '/tareas/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::create
* @see app/Http/Controllers/TareaController.php:79
* @route '/tareas/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TareaController::create
* @see app/Http/Controllers/TareaController.php:79
* @route '/tareas/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TareaController::create
* @see app/Http/Controllers/TareaController.php:79
* @route '/tareas/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TareaController::create
* @see app/Http/Controllers/TareaController.php:79
* @route '/tareas/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TareaController::create
* @see app/Http/Controllers/TareaController.php:79
* @route '/tareas/create'
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
* @see \App\Http\Controllers\TareaController::store
* @see app/Http/Controllers/TareaController.php:98
* @route '/tareas'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tareas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TareaController::store
* @see app/Http/Controllers/TareaController.php:98
* @route '/tareas'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::store
* @see app/Http/Controllers/TareaController.php:98
* @route '/tareas'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TareaController::store
* @see app/Http/Controllers/TareaController.php:98
* @route '/tareas'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TareaController::store
* @see app/Http/Controllers/TareaController.php:98
* @route '/tareas'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\TareaController::edit
* @see app/Http/Controllers/TareaController.php:239
* @route '/tareas/{tarea}/edit'
*/
export const edit = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/tareas/{tarea}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TareaController::edit
* @see app/Http/Controllers/TareaController.php:239
* @route '/tareas/{tarea}/edit'
*/
edit.url = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tarea: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tarea: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tarea: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tarea: typeof args.tarea === 'object'
        ? args.tarea.id
        : args.tarea,
    }

    return edit.definition.url
            .replace('{tarea}', parsedArgs.tarea.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::edit
* @see app/Http/Controllers/TareaController.php:239
* @route '/tareas/{tarea}/edit'
*/
edit.get = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TareaController::edit
* @see app/Http/Controllers/TareaController.php:239
* @route '/tareas/{tarea}/edit'
*/
edit.head = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TareaController::edit
* @see app/Http/Controllers/TareaController.php:239
* @route '/tareas/{tarea}/edit'
*/
const editForm = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TareaController::edit
* @see app/Http/Controllers/TareaController.php:239
* @route '/tareas/{tarea}/edit'
*/
editForm.get = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TareaController::edit
* @see app/Http/Controllers/TareaController.php:239
* @route '/tareas/{tarea}/edit'
*/
editForm.head = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TareaController::update
* @see app/Http/Controllers/TareaController.php:261
* @route '/tareas/{tarea}'
*/
export const update = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/tareas/{tarea}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TareaController::update
* @see app/Http/Controllers/TareaController.php:261
* @route '/tareas/{tarea}'
*/
update.url = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tarea: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tarea: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tarea: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tarea: typeof args.tarea === 'object'
        ? args.tarea.id
        : args.tarea,
    }

    return update.definition.url
            .replace('{tarea}', parsedArgs.tarea.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::update
* @see app/Http/Controllers/TareaController.php:261
* @route '/tareas/{tarea}'
*/
update.put = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\TareaController::update
* @see app/Http/Controllers/TareaController.php:261
* @route '/tareas/{tarea}'
*/
update.patch = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\TareaController::update
* @see app/Http/Controllers/TareaController.php:261
* @route '/tareas/{tarea}'
*/
const updateForm = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TareaController::update
* @see app/Http/Controllers/TareaController.php:261
* @route '/tareas/{tarea}'
*/
updateForm.put = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TareaController::update
* @see app/Http/Controllers/TareaController.php:261
* @route '/tareas/{tarea}'
*/
updateForm.patch = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TareaController::destroy
* @see app/Http/Controllers/TareaController.php:348
* @route '/tareas/{tarea}'
*/
export const destroy = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tareas/{tarea}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TareaController::destroy
* @see app/Http/Controllers/TareaController.php:348
* @route '/tareas/{tarea}'
*/
destroy.url = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tarea: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tarea: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tarea: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tarea: typeof args.tarea === 'object'
        ? args.tarea.id
        : args.tarea,
    }

    return destroy.definition.url
            .replace('{tarea}', parsedArgs.tarea.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TareaController::destroy
* @see app/Http/Controllers/TareaController.php:348
* @route '/tareas/{tarea}'
*/
destroy.delete = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\TareaController::destroy
* @see app/Http/Controllers/TareaController.php:348
* @route '/tareas/{tarea}'
*/
const destroyForm = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TareaController::destroy
* @see app/Http/Controllers/TareaController.php:348
* @route '/tareas/{tarea}'
*/
destroyForm.delete = (args: { tarea: number | { id: number } } | [tarea: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const tareas = {
    index,
    show,
    create,
    store,
    edit,
    update,
    destroy,
}

export default tareas