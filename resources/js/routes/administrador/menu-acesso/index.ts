import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Administrador\MenuAcessoController::index
 * @see app/Http/Controllers/Administrador/MenuAcessoController.php:19
 * @route '/smartcaixa/administrador/menu-acesso'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/smartcaixa/administrador/menu-acesso',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Administrador\MenuAcessoController::index
 * @see app/Http/Controllers/Administrador/MenuAcessoController.php:19
 * @route '/smartcaixa/administrador/menu-acesso'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Administrador\MenuAcessoController::index
 * @see app/Http/Controllers/Administrador/MenuAcessoController.php:19
 * @route '/smartcaixa/administrador/menu-acesso'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Administrador\MenuAcessoController::index
 * @see app/Http/Controllers/Administrador/MenuAcessoController.php:19
 * @route '/smartcaixa/administrador/menu-acesso'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Administrador\MenuAcessoController::index
 * @see app/Http/Controllers/Administrador/MenuAcessoController.php:19
 * @route '/smartcaixa/administrador/menu-acesso'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Administrador\MenuAcessoController::index
 * @see app/Http/Controllers/Administrador/MenuAcessoController.php:19
 * @route '/smartcaixa/administrador/menu-acesso'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Administrador\MenuAcessoController::index
 * @see app/Http/Controllers/Administrador/MenuAcessoController.php:19
 * @route '/smartcaixa/administrador/menu-acesso'
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
* @see \App\Http\Controllers\Administrador\MenuAcessoController::atualizar
 * @see app/Http/Controllers/Administrador/MenuAcessoController.php:40
 * @route '/smartcaixa/administrador/menu-acesso'
 */
export const atualizar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: atualizar.url(options),
    method: 'post',
})

atualizar.definition = {
    methods: ["post"],
    url: '/smartcaixa/administrador/menu-acesso',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Administrador\MenuAcessoController::atualizar
 * @see app/Http/Controllers/Administrador/MenuAcessoController.php:40
 * @route '/smartcaixa/administrador/menu-acesso'
 */
atualizar.url = (options?: RouteQueryOptions) => {
    return atualizar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Administrador\MenuAcessoController::atualizar
 * @see app/Http/Controllers/Administrador/MenuAcessoController.php:40
 * @route '/smartcaixa/administrador/menu-acesso'
 */
atualizar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: atualizar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Administrador\MenuAcessoController::atualizar
 * @see app/Http/Controllers/Administrador/MenuAcessoController.php:40
 * @route '/smartcaixa/administrador/menu-acesso'
 */
    const atualizarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: atualizar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Administrador\MenuAcessoController::atualizar
 * @see app/Http/Controllers/Administrador/MenuAcessoController.php:40
 * @route '/smartcaixa/administrador/menu-acesso'
 */
        atualizarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: atualizar.url(options),
            method: 'post',
        })
    
    atualizar.form = atualizarForm
const menuAcesso = {
    index: Object.assign(index, index),
atualizar: Object.assign(atualizar, atualizar),
}

export default menuAcesso