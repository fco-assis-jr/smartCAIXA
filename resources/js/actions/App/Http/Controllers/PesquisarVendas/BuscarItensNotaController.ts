import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\PesquisarVendas\BuscarItensNotaController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarItensNotaController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-itens-nota'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/pesquisar-vendas/buscar-itens-nota',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PesquisarVendas\BuscarItensNotaController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarItensNotaController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-itens-nota'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\BuscarItensNotaController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarItensNotaController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-itens-nota'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PesquisarVendas\BuscarItensNotaController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarItensNotaController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-itens-nota'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\BuscarItensNotaController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarItensNotaController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-itens-nota'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\BuscarItensNotaController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarItensNotaController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-itens-nota'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PesquisarVendas\BuscarItensNotaController::index
 * @see app/Http/Controllers/PesquisarVendas/BuscarItensNotaController.php:14
 * @route '/smartcaixa/pesquisar-vendas/buscar-itens-nota'
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
const BuscarItensNotaController = { index }

export default BuscarItensNotaController