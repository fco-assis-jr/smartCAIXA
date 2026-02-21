import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Ferramentas\DblinkController::index
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:16
 * @route '/smartcaixa/ferramentas/dblink'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/ferramentas/dblink',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Ferramentas\DblinkController::index
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:16
 * @route '/smartcaixa/ferramentas/dblink'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ferramentas\DblinkController::index
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:16
 * @route '/smartcaixa/ferramentas/dblink'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Ferramentas\DblinkController::index
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:16
 * @route '/smartcaixa/ferramentas/dblink'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Ferramentas\DblinkController::index
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:16
 * @route '/smartcaixa/ferramentas/dblink'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Ferramentas\DblinkController::index
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:16
 * @route '/smartcaixa/ferramentas/dblink'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Ferramentas\DblinkController::index
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:16
 * @route '/smartcaixa/ferramentas/dblink'
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
* @see \App\Http\Controllers\Ferramentas\DblinkController::recriar
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:43
 * @route '/smartcaixa/ferramentas/dblink/recriar'
 */
export const recriar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recriar.url(options),
    method: 'post',
})

recriar.definition = {
    methods: ["post"],
    url: '/smartcaixa/ferramentas/dblink/recriar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ferramentas\DblinkController::recriar
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:43
 * @route '/smartcaixa/ferramentas/dblink/recriar'
 */
recriar.url = (options?: RouteQueryOptions) => {
    return recriar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ferramentas\DblinkController::recriar
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:43
 * @route '/smartcaixa/ferramentas/dblink/recriar'
 */
recriar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recriar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Ferramentas\DblinkController::recriar
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:43
 * @route '/smartcaixa/ferramentas/dblink/recriar'
 */
    const recriarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: recriar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Ferramentas\DblinkController::recriar
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:43
 * @route '/smartcaixa/ferramentas/dblink/recriar'
 */
        recriarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: recriar.url(options),
            method: 'post',
        })
    
    recriar.form = recriarForm
/**
* @see \App\Http\Controllers\Ferramentas\DblinkController::status
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:206
 * @route '/smartcaixa/ferramentas/dblink/status'
 */
export const status = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/ferramentas/dblink/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Ferramentas\DblinkController::status
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:206
 * @route '/smartcaixa/ferramentas/dblink/status'
 */
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ferramentas\DblinkController::status
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:206
 * @route '/smartcaixa/ferramentas/dblink/status'
 */
status.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Ferramentas\DblinkController::status
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:206
 * @route '/smartcaixa/ferramentas/dblink/status'
 */
status.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Ferramentas\DblinkController::status
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:206
 * @route '/smartcaixa/ferramentas/dblink/status'
 */
    const statusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: status.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Ferramentas\DblinkController::status
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:206
 * @route '/smartcaixa/ferramentas/dblink/status'
 */
        statusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Ferramentas\DblinkController::status
 * @see app/Http/Controllers/Ferramentas/DblinkController.php:206
 * @route '/smartcaixa/ferramentas/dblink/status'
 */
        statusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    status.form = statusForm
const dblink = {
    index: Object.assign(index, index),
recriar: Object.assign(recriar, recriar),
status: Object.assign(status, status),
}

export default dblink