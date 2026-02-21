import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ProdutoController::buscarCodigo
 * @see app/Http/Controllers/Api/ProdutoController.php:17
 * @route '/smartcaixa/api/produtos/buscar-codigo'
 */
export const buscarCodigo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscarCodigo.url(options),
    method: 'post',
})

buscarCodigo.definition = {
    methods: ["post"],
    url: '/smartcaixa/api/produtos/buscar-codigo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ProdutoController::buscarCodigo
 * @see app/Http/Controllers/Api/ProdutoController.php:17
 * @route '/smartcaixa/api/produtos/buscar-codigo'
 */
buscarCodigo.url = (options?: RouteQueryOptions) => {
    return buscarCodigo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProdutoController::buscarCodigo
 * @see app/Http/Controllers/Api/ProdutoController.php:17
 * @route '/smartcaixa/api/produtos/buscar-codigo'
 */
buscarCodigo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscarCodigo.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ProdutoController::buscarCodigo
 * @see app/Http/Controllers/Api/ProdutoController.php:17
 * @route '/smartcaixa/api/produtos/buscar-codigo'
 */
    const buscarCodigoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: buscarCodigo.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ProdutoController::buscarCodigo
 * @see app/Http/Controllers/Api/ProdutoController.php:17
 * @route '/smartcaixa/api/produtos/buscar-codigo'
 */
        buscarCodigoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: buscarCodigo.url(options),
            method: 'post',
        })
    
    buscarCodigo.form = buscarCodigoForm
/**
* @see \App\Http\Controllers\Api\ProdutoController::search
 * @see app/Http/Controllers/Api/ProdutoController.php:88
 * @route '/smartcaixa/api/produtos/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/api/produtos/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ProdutoController::search
 * @see app/Http/Controllers/Api/ProdutoController.php:88
 * @route '/smartcaixa/api/produtos/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProdutoController::search
 * @see app/Http/Controllers/Api/ProdutoController.php:88
 * @route '/smartcaixa/api/produtos/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ProdutoController::search
 * @see app/Http/Controllers/Api/ProdutoController.php:88
 * @route '/smartcaixa/api/produtos/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ProdutoController::search
 * @see app/Http/Controllers/Api/ProdutoController.php:88
 * @route '/smartcaixa/api/produtos/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ProdutoController::search
 * @see app/Http/Controllers/Api/ProdutoController.php:88
 * @route '/smartcaixa/api/produtos/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ProdutoController::search
 * @see app/Http/Controllers/Api/ProdutoController.php:88
 * @route '/smartcaixa/api/produtos/search'
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
* @see \App\Http\Controllers\Api\ProdutoController::show
 * @see app/Http/Controllers/Api/ProdutoController.php:183
 * @route '/smartcaixa/api/produtos/{codProd}'
 */
export const show = (args: { codProd: string | number } | [codProd: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/api/produtos/{codProd}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ProdutoController::show
 * @see app/Http/Controllers/Api/ProdutoController.php:183
 * @route '/smartcaixa/api/produtos/{codProd}'
 */
show.url = (args: { codProd: string | number } | [codProd: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codProd: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codProd: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codProd: args.codProd,
                }

    return show.definition.url
            .replace('{codProd}', parsedArgs.codProd.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProdutoController::show
 * @see app/Http/Controllers/Api/ProdutoController.php:183
 * @route '/smartcaixa/api/produtos/{codProd}'
 */
show.get = (args: { codProd: string | number } | [codProd: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ProdutoController::show
 * @see app/Http/Controllers/Api/ProdutoController.php:183
 * @route '/smartcaixa/api/produtos/{codProd}'
 */
show.head = (args: { codProd: string | number } | [codProd: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ProdutoController::show
 * @see app/Http/Controllers/Api/ProdutoController.php:183
 * @route '/smartcaixa/api/produtos/{codProd}'
 */
    const showForm = (args: { codProd: string | number } | [codProd: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ProdutoController::show
 * @see app/Http/Controllers/Api/ProdutoController.php:183
 * @route '/smartcaixa/api/produtos/{codProd}'
 */
        showForm.get = (args: { codProd: string | number } | [codProd: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ProdutoController::show
 * @see app/Http/Controllers/Api/ProdutoController.php:183
 * @route '/smartcaixa/api/produtos/{codProd}'
 */
        showForm.head = (args: { codProd: string | number } | [codProd: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const produtos = {
    buscarCodigo: Object.assign(buscarCodigo, buscarCodigo),
search: Object.assign(search, search),
show: Object.assign(show, show),
}

export default produtos