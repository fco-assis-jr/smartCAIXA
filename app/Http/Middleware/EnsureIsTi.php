<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Restringe a tela Administrador ao setor 16 (TI).
 *
 * Diferente dos outros menus, o acesso a este aqui é fixo no código, não
 * configurável pela própria tela Administrador — se fosse editável pelo
 * mesmo mecanismo que ela controla, um erro na tela poderia trancar o
 * setor 16 pra fora sem ter como se corrigir sem acesso direto ao banco.
 */
class EnsureIsTi
{
    private const CODSETOR_TI = 16;

    public function handle(Request $request, Closure $next)
    {
        $usuario = Auth::user();
        $codSetor = (int) ($usuario->CODSETOR ?? $usuario->codsetor ?? 0);

        if ($codSetor !== self::CODSETOR_TI) {
            throw new AccessDeniedHttpException(
                'Apenas o setor de TI tem acesso a esta área.'
            );
        }

        return $next($request);
    }
}
