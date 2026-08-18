import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:17
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
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:17
 * @route '/smartcaixa/pesquisar-vendas/nota-branca'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:17
 * @route '/smartcaixa/pesquisar-vendas/nota-branca'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:17
 * @route '/smartcaixa/pesquisar-vendas/nota-branca'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:17
 * @route '/smartcaixa/pesquisar-vendas/nota-branca'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:17
 * @route '/smartcaixa/pesquisar-vendas/nota-branca'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::index
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:17
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
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:41
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
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:41
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/buscar'
 */
buscar.url = (options?: RouteQueryOptions) => {
    return buscar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:41
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/buscar'
 */
buscar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:41
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/buscar'
 */
    const buscarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: buscar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::buscar
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:41
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/buscar'
 */
        buscarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: buscar.url(options),
            method: 'post',
        })
    
    buscar.form = buscarForm
/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::xml
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:201
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/xml'
 */
export const xml = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: xml.url(args, options),
    method: 'get',
})

xml.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/xml',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::xml
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:201
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/xml'
 */
xml.url = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return xml.definition.url
            .replace('{numTransVenda}', parsedArgs.numTransVenda.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::xml
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:201
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/xml'
 */
xml.get = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: xml.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::xml
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:201
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/xml'
 */
xml.head = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: xml.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::xml
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:201
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/xml'
 */
    const xmlForm = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: xml.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::xml
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:201
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/xml'
 */
        xmlForm.get = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: xml.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PesquisarVendas\NotaBrancaController::xml
 * @see app/Http/Controllers/PesquisarVendas/NotaBrancaController.php:201
 * @route '/smartcaixa/pesquisar-vendas/nota-branca/{numTransVenda}/xml'
 */
        xmlForm.head = (args: { numTransVenda: string | number } | [numTransVenda: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: xml.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    xml.form = xmlForm
const notaBranca = {
    index: Object.assign(index, index),
buscar: Object.assign(buscar, buscar),
xml: Object.assign(xml, xml),
}

export default notaBranca