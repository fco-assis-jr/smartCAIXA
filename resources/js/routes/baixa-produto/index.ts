import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::index
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:18
 * @route '/smartcaixa/baixa-produto'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/baixa-produto',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::index
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:18
 * @route '/smartcaixa/baixa-produto'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::index
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:18
 * @route '/smartcaixa/baixa-produto'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::index
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:18
 * @route '/smartcaixa/baixa-produto'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::index
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:18
 * @route '/smartcaixa/baixa-produto'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::index
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:18
 * @route '/smartcaixa/baixa-produto'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::index
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:18
 * @route '/smartcaixa/baixa-produto'
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
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::buscarProdutos
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:49
 * @route '/smartcaixa/baixa-produto/buscar-produtos'
 */
export const buscarProdutos = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscarProdutos.url(options),
    method: 'post',
})

buscarProdutos.definition = {
    methods: ["post"],
    url: '/smartcaixa/baixa-produto/buscar-produtos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::buscarProdutos
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:49
 * @route '/smartcaixa/baixa-produto/buscar-produtos'
 */
buscarProdutos.url = (options?: RouteQueryOptions) => {
    return buscarProdutos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::buscarProdutos
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:49
 * @route '/smartcaixa/baixa-produto/buscar-produtos'
 */
buscarProdutos.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscarProdutos.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::buscarProdutos
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:49
 * @route '/smartcaixa/baixa-produto/buscar-produtos'
 */
    const buscarProdutosForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: buscarProdutos.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::buscarProdutos
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:49
 * @route '/smartcaixa/baixa-produto/buscar-produtos'
 */
        buscarProdutosForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: buscarProdutos.url(options),
            method: 'post',
        })
    
    buscarProdutos.form = buscarProdutosForm
/**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::buscarPorCodigo
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:90
 * @route '/smartcaixa/baixa-produto/buscar-por-codigo'
 */
export const buscarPorCodigo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscarPorCodigo.url(options),
    method: 'post',
})

buscarPorCodigo.definition = {
    methods: ["post"],
    url: '/smartcaixa/baixa-produto/buscar-por-codigo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::buscarPorCodigo
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:90
 * @route '/smartcaixa/baixa-produto/buscar-por-codigo'
 */
buscarPorCodigo.url = (options?: RouteQueryOptions) => {
    return buscarPorCodigo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::buscarPorCodigo
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:90
 * @route '/smartcaixa/baixa-produto/buscar-por-codigo'
 */
buscarPorCodigo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscarPorCodigo.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::buscarPorCodigo
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:90
 * @route '/smartcaixa/baixa-produto/buscar-por-codigo'
 */
    const buscarPorCodigoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: buscarPorCodigo.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BaixaProduto\BaixaProdutoController::buscarPorCodigo
 * @see app/Http/Controllers/BaixaProduto/BaixaProdutoController.php:90
 * @route '/smartcaixa/baixa-produto/buscar-por-codigo'
 */
        buscarPorCodigoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: buscarPorCodigo.url(options),
            method: 'post',
        })
    
    buscarPorCodigo.form = buscarPorCodigoForm
const baixaProduto = {
    index: Object.assign(index, index),
buscarProdutos: Object.assign(buscarProdutos, buscarProdutos),
buscarPorCodigo: Object.assign(buscarPorCodigo, buscarPorCodigo),
}

export default baixaProduto