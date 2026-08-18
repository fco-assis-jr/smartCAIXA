<?php

namespace App\Http\Middleware;

use App\Models\MenuSetorAcesso;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Bloqueia o acesso a um grupo de rotas com base no setor do funcionário
 * autenticado (PCEMPR.CODSETOR) — os setores permitidos por menu ficam no
 * MySQL (tabela menu_setor_acessos), editáveis pela tela Administrador.
 *
 * Uso: Route::middleware('setor:consultar-vendas')->group(...)
 *
 * Diferente do menu "Baixa Produto" (sem este middleware, liberado pra
 * todos), qualquer rota que passe por aqui exige configuração explícita:
 * um menu sem nenhum setor cadastrado bloqueia todo mundo, em vez de
 * liberar por padrão.
 */
class EnsureSetorAcesso
{
    public function handle(Request $request, Closure $next, string $menu)
    {
        // O Eloquent devolve os atributos do PCEMPR em minúsculo quando o
        // usuário é recarregado da sessão (via find()) — só o objeto
        // montado à mão no login usa maiúsculo. Checar os dois casos.
        $usuario = Auth::user();
        $codSetor = (int) ($usuario->CODSETOR ?? $usuario->codsetor ?? 0);

        if (! MenuSetorAcesso::temAcesso($menu, $codSetor)) {
            throw new AccessDeniedHttpException(
                'Seu setor não tem permissão para acessar esta área do sistema.'
            );
        }

        return $next($request);
    }
}
