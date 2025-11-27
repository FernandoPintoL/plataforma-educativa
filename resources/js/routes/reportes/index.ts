import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReportesController::studentSynthesis
 * @see app/Http/Controllers/ReportesController.php:636
 * @route '/api/reportes/student/{studentId}/synthesis'
 */
export const studentSynthesis = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentSynthesis.url(args, options),
    method: 'get',
})

studentSynthesis.definition = {
    methods: ["get","head"],
    url: '/api/reportes/student/{studentId}/synthesis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::studentSynthesis
 * @see app/Http/Controllers/ReportesController.php:636
 * @route '/api/reportes/student/{studentId}/synthesis'
 */
studentSynthesis.url = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { studentId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    studentId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        studentId: args.studentId,
                }

    return studentSynthesis.definition.url
            .replace('{studentId}', parsedArgs.studentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::studentSynthesis
 * @see app/Http/Controllers/ReportesController.php:636
 * @route '/api/reportes/student/{studentId}/synthesis'
 */
studentSynthesis.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentSynthesis.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::studentSynthesis
 * @see app/Http/Controllers/ReportesController.php:636
 * @route '/api/reportes/student/{studentId}/synthesis'
 */
studentSynthesis.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentSynthesis.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::studentSynthesis
 * @see app/Http/Controllers/ReportesController.php:636
 * @route '/api/reportes/student/{studentId}/synthesis'
 */
    const studentSynthesisForm = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentSynthesis.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::studentSynthesis
 * @see app/Http/Controllers/ReportesController.php:636
 * @route '/api/reportes/student/{studentId}/synthesis'
 */
        studentSynthesisForm.get = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentSynthesis.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::studentSynthesis
 * @see app/Http/Controllers/ReportesController.php:636
 * @route '/api/reportes/student/{studentId}/synthesis'
 */
        studentSynthesisForm.head = (args: { studentId: string | number } | [studentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentSynthesis.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentSynthesis.form = studentSynthesisForm
/**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:44
 * @route '/reportes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reportes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:44
 * @route '/reportes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:44
 * @route '/reportes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:44
 * @route '/reportes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:44
 * @route '/reportes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:44
 * @route '/reportes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::index
 * @see app/Http/Controllers/ReportesController.php:44
 * @route '/reportes'
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
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:63
 * @route '/reportes/desempeno'
 */
export const desempeno = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: desempeno.url(options),
    method: 'get',
})

desempeno.definition = {
    methods: ["get","head"],
    url: '/reportes/desempeno',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:63
 * @route '/reportes/desempeno'
 */
desempeno.url = (options?: RouteQueryOptions) => {
    return desempeno.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:63
 * @route '/reportes/desempeno'
 */
desempeno.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: desempeno.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:63
 * @route '/reportes/desempeno'
 */
desempeno.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: desempeno.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:63
 * @route '/reportes/desempeno'
 */
    const desempenoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: desempeno.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:63
 * @route '/reportes/desempeno'
 */
        desempenoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: desempeno.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::desempeno
 * @see app/Http/Controllers/ReportesController.php:63
 * @route '/reportes/desempeno'
 */
        desempenoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: desempeno.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    desempeno.form = desempenoForm
/**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:195
 * @route '/reportes/cursos'
 */
export const cursos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cursos.url(options),
    method: 'get',
})

cursos.definition = {
    methods: ["get","head"],
    url: '/reportes/cursos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:195
 * @route '/reportes/cursos'
 */
cursos.url = (options?: RouteQueryOptions) => {
    return cursos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:195
 * @route '/reportes/cursos'
 */
cursos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cursos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:195
 * @route '/reportes/cursos'
 */
cursos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cursos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:195
 * @route '/reportes/cursos'
 */
    const cursosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cursos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:195
 * @route '/reportes/cursos'
 */
        cursosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cursos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::cursos
 * @see app/Http/Controllers/ReportesController.php:195
 * @route '/reportes/cursos'
 */
        cursosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cursos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cursos.form = cursosForm
/**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:253
 * @route '/reportes/analisis'
 */
export const analisis = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisis.url(options),
    method: 'get',
})

analisis.definition = {
    methods: ["get","head"],
    url: '/reportes/analisis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:253
 * @route '/reportes/analisis'
 */
analisis.url = (options?: RouteQueryOptions) => {
    return analisis.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:253
 * @route '/reportes/analisis'
 */
analisis.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analisis.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:253
 * @route '/reportes/analisis'
 */
analisis.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analisis.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:253
 * @route '/reportes/analisis'
 */
    const analisisForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analisis.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:253
 * @route '/reportes/analisis'
 */
        analisisForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisis.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::analisis
 * @see app/Http/Controllers/ReportesController.php:253
 * @route '/reportes/analisis'
 */
        analisisForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analisis.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analisis.form = analisisForm
/**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:448
 * @route '/reportes/metricas'
 */
export const metricas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metricas.url(options),
    method: 'get',
})

metricas.definition = {
    methods: ["get","head"],
    url: '/reportes/metricas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:448
 * @route '/reportes/metricas'
 */
metricas.url = (options?: RouteQueryOptions) => {
    return metricas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:448
 * @route '/reportes/metricas'
 */
metricas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metricas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:448
 * @route '/reportes/metricas'
 */
metricas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: metricas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:448
 * @route '/reportes/metricas'
 */
    const metricasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: metricas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:448
 * @route '/reportes/metricas'
 */
        metricasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metricas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::metricas
 * @see app/Http/Controllers/ReportesController.php:448
 * @route '/reportes/metricas'
 */
        metricasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metricas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    metricas.form = metricasForm
/**
* @see \App\Http\Controllers\ReportesController::riesgo
 * @see app/Http/Controllers/ReportesController.php:311
 * @route '/reportes/riesgo'
 */
export const riesgo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riesgo.url(options),
    method: 'get',
})

riesgo.definition = {
    methods: ["get","head"],
    url: '/reportes/riesgo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::riesgo
 * @see app/Http/Controllers/ReportesController.php:311
 * @route '/reportes/riesgo'
 */
riesgo.url = (options?: RouteQueryOptions) => {
    return riesgo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::riesgo
 * @see app/Http/Controllers/ReportesController.php:311
 * @route '/reportes/riesgo'
 */
riesgo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riesgo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::riesgo
 * @see app/Http/Controllers/ReportesController.php:311
 * @route '/reportes/riesgo'
 */
riesgo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: riesgo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::riesgo
 * @see app/Http/Controllers/ReportesController.php:311
 * @route '/reportes/riesgo'
 */
    const riesgoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: riesgo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::riesgo
 * @see app/Http/Controllers/ReportesController.php:311
 * @route '/reportes/riesgo'
 */
        riesgoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riesgo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::riesgo
 * @see app/Http/Controllers/ReportesController.php:311
 * @route '/reportes/riesgo'
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
const reportes = {
    studentSynthesis,
index,
desempeno,
cursos,
analisis,
metricas,
riesgo,
}

export default reportes