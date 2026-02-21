import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/pesquisar-vendas/produtos-por-descricao',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::index
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:17
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao'
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
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::buscarProdutos
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:33
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar-produtos'
 */
export const buscarProdutos = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscarProdutos.url(options),
    method: 'post',
})

buscarProdutos.definition = {
    methods: ["post"],
    url: '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar-produtos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::buscarProdutos
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:33
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar-produtos'
 */
buscarProdutos.url = (options?: RouteQueryOptions) => {
    return buscarProdutos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::buscarProdutos
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:33
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar-produtos'
 */
buscarProdutos.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscarProdutos.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::buscarProdutos
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:33
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar-produtos'
 */
    const buscarProdutosForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: buscarProdutos.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::buscarProdutos
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:33
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar-produtos'
 */
        buscarProdutosForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: buscarProdutos.url(options),
            method: 'post',
        })
    
    buscarProdutos.form = buscarProdutosForm
/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:110
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar'
 */
export const buscar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscar.url(options),
    method: 'post',
})

buscar.definition = {
    methods: ["post"],
    url: '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:110
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar'
 */
buscar.url = (options?: RouteQueryOptions) => {
    return buscar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:110
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar'
 */
buscar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:110
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar'
 */
    const buscarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: buscar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorDescricaoController.php:110
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar'
 */
        buscarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: buscar.url(options),
            method: 'post',
        })
    
    buscar.form = buscarForm
const ProdutosPorDescricaoController = { index, buscarProdutos, buscar }

export default ProdutosPorDescricaoController