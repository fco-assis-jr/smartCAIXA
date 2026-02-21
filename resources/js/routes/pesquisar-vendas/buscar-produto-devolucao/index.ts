import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PesquisarVendas\BuscarProdutoDevolucaoController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarProdutoDevolucaoController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-produto-devolucao'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/pesquisar-vendas/buscar-produto-devolucao',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PesquisarVendas\BuscarProdutoDevolucaoController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarProdutoDevolucaoController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-produto-devolucao'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\BuscarProdutoDevolucaoController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarProdutoDevolucaoController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-produto-devolucao'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PesquisarVendas\BuscarProdutoDevolucaoController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarProdutoDevolucaoController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-produto-devolucao'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\BuscarProdutoDevolucaoController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarProdutoDevolucaoController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-produto-devolucao'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\BuscarProdutoDevolucaoController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarProdutoDevolucaoController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-produto-devolucao'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PesquisarVendas\BuscarProdutoDevolucaoController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarProdutoDevolucaoController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-produto-devolucao'
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
const buscarProdutoDevolucao = {
    index: Object.assign(index, index),
}

export default buscarProdutoDevolucao