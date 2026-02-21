import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\FilialController::index
 * @see app/Http/Controllers/Api/FilialController.php:16
 * @route '/smartcaixa/api/filiais'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/api/filiais',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FilialController::index
 * @see app/Http/Controllers/Api/FilialController.php:16
 * @route '/smartcaixa/api/filiais'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FilialController::index
 * @see app/Http/Controllers/Api/FilialController.php:16
 * @route '/smartcaixa/api/filiais'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\FilialController::index
 * @see app/Http/Controllers/Api/FilialController.php:16
 * @route '/smartcaixa/api/filiais'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\FilialController::index
 * @see app/Http/Controllers/Api/FilialController.php:16
 * @route '/smartcaixa/api/filiais'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\FilialController::index
 * @see app/Http/Controllers/Api/FilialController.php:16
 * @route '/smartcaixa/api/filiais'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\FilialController::index
 * @see app/Http/Controllers/Api/FilialController.php:16
 * @route '/smartcaixa/api/filiais'
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
* @see \App\Http\Controllers\Api\FilialController::search
 * @see app/Http/Controllers/Api/FilialController.php:112
 * @route '/smartcaixa/api/filiais/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/api/filiais/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FilialController::search
 * @see app/Http/Controllers/Api/FilialController.php:112
 * @route '/smartcaixa/api/filiais/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FilialController::search
 * @see app/Http/Controllers/Api/FilialController.php:112
 * @route '/smartcaixa/api/filiais/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\FilialController::search
 * @see app/Http/Controllers/Api/FilialController.php:112
 * @route '/smartcaixa/api/filiais/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\FilialController::search
 * @see app/Http/Controllers/Api/FilialController.php:112
 * @route '/smartcaixa/api/filiais/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\FilialController::search
 * @see app/Http/Controllers/Api/FilialController.php:112
 * @route '/smartcaixa/api/filiais/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\FilialController::search
 * @see app/Http/Controllers/Api/FilialController.php:112
 * @route '/smartcaixa/api/filiais/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
/**
* @see \App\Http\Controllers\Api\FilialController::show
 * @see app/Http/Controllers/Api/FilialController.php:63
 * @route '/smartcaixa/api/filiais/{codigo}'
 */
export const show = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/api/filiais/{codigo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FilialController::show
 * @see app/Http/Controllers/Api/FilialController.php:63
 * @route '/smartcaixa/api/filiais/{codigo}'
 */
show.url = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo: args.codigo,
                }

    return show.definition.url
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FilialController::show
 * @see app/Http/Controllers/Api/FilialController.php:63
 * @route '/smartcaixa/api/filiais/{codigo}'
 */
show.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\FilialController::show
 * @see app/Http/Controllers/Api/FilialController.php:63
 * @route '/smartcaixa/api/filiais/{codigo}'
 */
show.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\FilialController::show
 * @see app/Http/Controllers/Api/FilialController.php:63
 * @route '/smartcaixa/api/filiais/{codigo}'
 */
    const showForm = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\FilialController::show
 * @see app/Http/Controllers/Api/FilialController.php:63
 * @route '/smartcaixa/api/filiais/{codigo}'
 */
        showForm.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\FilialController::show
 * @see app/Http/Controllers/Api/FilialController.php:63
 * @route '/smartcaixa/api/filiais/{codigo}'
 */
        showForm.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const FilialController = { index, search, show }

export default FilialController