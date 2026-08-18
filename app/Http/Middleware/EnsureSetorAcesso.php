<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Bloqueia o acesso a um grupo de rotas com base no setor do funcionário
 * autenticado (PCEMPR.CODSETOR), conforme config/menu_access.php.
 *
 * Uso: Route::middleware('setor:consultar-vendas')->group(...)
 *
 * Um menu sem entrada em config/menu_access.php é liberado para todos —
 * o middleware só bloqueia quando a chave existe e o setor do usuário não
 * está na lista permitida.
 */
class EnsureSetorAcesso
{
    public function handle(Request $request, Closure $next, string $menu)
    {
        $setoresPermitidos = config("menu_access.{$menu}");

        if ($setoresPermitidos === null) {
            return $next($request);
        }

        // O Eloquent devolve os atributos do PCEMPR em minúsculo quando o
        // usuário é recarregado da sessão (via find()) — só o objeto
        // montado à mão no login usa maiúsculo. Checar os dois casos.
        $usuario = Auth::user();
        $codSetor = (int) ($usuario->CODSETOR ?? $usuario->codsetor ?? 0);

        if (! in_array($codSetor, $setoresPermitidos, true)) {
            throw new AccessDeniedHttpException(
                'Seu setor não tem permissão para acessar esta área do sistema.'
            );
        }

        return $next($request);
    }
}
