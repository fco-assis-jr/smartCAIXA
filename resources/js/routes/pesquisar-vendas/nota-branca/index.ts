import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:18
 * @route '/smartcaixa/pesquisar-vendas/nota-branca'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/pesquisar-vendas/nota-branca',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:18
 * @route '/smartcaixa/pesquisar-vendas/nota-branca'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:18
 * @route '/smartcaixa/pesquisar-vendas/nota-branca'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:18
 * @route '/smartcaixa/pesquisar-vendas/nota-branca'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:18
 * @route '/smartcaixa/pesquisar-vendas/nota-branca'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:18
 * @route '/smartcaixa/pesquisar-vendas/nota-branca'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:18
 * @route '/smartcaixa/pesquisar-vendas/nota-branca'
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
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:42
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/buscar'
 */
export const buscar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscar.url(options),
    method: 'post',
})

buscar.definition = {
    methods: ["post"],
    url: '/smartcaixa/pesquisar-vendas/nota-branca/buscar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:42
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/buscar'
 */
buscar.url = (options?: RouteQueryOptions) => {
    return buscar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:42
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/buscar'
 */
buscar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:42
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/buscar'
 */
    const buscarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: buscar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:42
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/buscar'
 */
        buscarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: buscar.url(options),
            method: 'post',
        })
    
    buscar.form = buscarForm
/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::danfe
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:200
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/danfe'
 */
export const danfe = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: danfe.url(args, options),
    method: 'get',
})

danfe.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/danfe',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::danfe
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:200
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/danfe'
 */
danfe.url = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { numTransVenda: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    numTransVenda: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        numTransVenda: args.numTransVenda,
                }

    return danfe.definition.url
            .replace('{numTransVenda}', parsedArgs.numTransVenda.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::danfe
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:200
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/danfe'
 */
danfe.get = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: danfe.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::danfe
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:200
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/danfe'
 */
danfe.head = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: danfe.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::danfe
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:200
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/danfe'
 */
    const danfeForm = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: danfe.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::danfe
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:200
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/danfe'
 */
        danfeForm.get = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: danfe.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::danfe
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:200
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/danfe'
 */
        danfeForm.head = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: danfe.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    danfe.form = danfeForm
const notaBranca = {
    index: Object.assign(index, index),
buscar: Object.assign(buscar, buscar),
danfe: Object.assign(danfe, danfe),
}

export default notaBranca