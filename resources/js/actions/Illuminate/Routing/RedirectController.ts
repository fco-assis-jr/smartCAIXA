import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
const RedirectController8a2fe04f80d08f748b0caebb39882bef = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectController8a2fe04f80d08f748b0caebb39882bef.url(options),
    method: 'get',
})

RedirectController8a2fe04f80d08f748b0caebb39882bef.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/smartcaixa/pesquisar-vendas/produtos-por-gramatura',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
RedirectController8a2fe04f80d08f748b0caebb39882bef.url = (options?: RouteQueryOptions) => {
    return RedirectController8a2fe04f80d08f748b0caebb39882bef.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
RedirectController8a2fe04f80d08f748b0caebb39882bef.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectController8a2fe04f80d08f748b0caebb39882bef.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
RedirectController8a2fe04f80d08f748b0caebb39882bef.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RedirectController8a2fe04f80d08f748b0caebb39882bef.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
RedirectController8a2fe04f80d08f748b0caebb39882bef.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RedirectController8a2fe04f80d08f748b0caebb39882bef.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
RedirectController8a2fe04f80d08f748b0caebb39882bef.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: RedirectController8a2fe04f80d08f748b0caebb39882bef.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
RedirectController8a2fe04f80d08f748b0caebb39882bef.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RedirectController8a2fe04f80d08f748b0caebb39882bef.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
RedirectController8a2fe04f80d08f748b0caebb39882bef.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: RedirectController8a2fe04f80d08f748b0caebb39882bef.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
RedirectController8a2fe04f80d08f748b0caebb39882bef.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: RedirectController8a2fe04f80d08f748b0caebb39882bef.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
    const RedirectController8a2fe04f80d08f748b0caebb39882befForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: RedirectController8a2fe04f80d08f748b0caebb39882bef.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
        RedirectController8a2fe04f80d08f748b0caebb39882befForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController8a2fe04f80d08f748b0caebb39882bef.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
        RedirectController8a2fe04f80d08f748b0caebb39882befForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController8a2fe04f80d08f748b0caebb39882bef.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
        RedirectController8a2fe04f80d08f748b0caebb39882befForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController8a2fe04f80d08f748b0caebb39882bef.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
        RedirectController8a2fe04f80d08f748b0caebb39882befForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController8a2fe04f80d08f748b0caebb39882bef.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
        RedirectController8a2fe04f80d08f748b0caebb39882befForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController8a2fe04f80d08f748b0caebb39882bef.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
        RedirectController8a2fe04f80d08f748b0caebb39882befForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController8a2fe04f80d08f748b0caebb39882bef.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/pesquisar-vendas/produtos-por-gramatura'
 */
        RedirectController8a2fe04f80d08f748b0caebb39882befForm.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController8a2fe04f80d08f748b0caebb39882bef.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    RedirectController8a2fe04f80d08f748b0caebb39882bef.form = RedirectController8a2fe04f80d08f748b0caebb39882befForm
    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
const RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url(options),
    method: 'get',
})

RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/smartcaixa/settings',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url = (options?: RouteQueryOptions) => {
    return RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
    const RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
        RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
        RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
        RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
        RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70Form.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
        RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70Form.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
        RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70Form.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/smartcaixa/settings'
 */
        RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70Form.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70.form = RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70Form

const RedirectController = {
    '/smartcaixa/pesquisar-vendas/produtos-por-gramatura': RedirectController8a2fe04f80d08f748b0caebb39882bef,
    '/smartcaixa/settings': RedirectControllerb08b3b3432ce91d1dcdf87e584c51a70,
}

export default RedirectController