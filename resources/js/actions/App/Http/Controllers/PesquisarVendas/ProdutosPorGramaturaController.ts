import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:19
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
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura/buscar'
 */
buscar.url = (options?: RouteQueryOptions) => {
    return buscar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura/buscar'
 */
buscar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura/buscar'
 */
    const buscarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: buscar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/ProdutosPorGramaturaController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura/buscar'
 */
        buscarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: buscar.url(options),
            method: 'post',
        })
    
    buscar.form = buscarForm
const ProdutosPorGramaturaController = { buscar }

export default ProdutosPorGramaturaController