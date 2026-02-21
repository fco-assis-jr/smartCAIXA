import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/pesquisar-vendas/produtos-por-gramatura',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
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
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:32
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura/buscar'
 */
export const buscar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscar.url(options),
    method: 'post',
})

buscar.definition = {
    methods: ["post"],
    url: '/smartcaixa/pesquisar-vendas/produtos-por-gramatura/buscar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:32
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura/buscar'
 */
buscar.url = (options?: RouteQueryOptions) => {
    return buscar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:32
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura/buscar'
 */
buscar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:32
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura/buscar'
 */
    const buscarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: buscar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:32
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura/buscar'
 */
        buscarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: buscar.url(options),
            method: 'post',
        })
    
    buscar.form = buscarForm
const ProdutosPorGramaturaController = { index, buscar }

export default ProdutosPorGramaturaController