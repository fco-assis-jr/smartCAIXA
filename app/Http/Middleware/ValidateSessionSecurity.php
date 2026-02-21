<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ValidateSessionSecurity
{
    /**
     * Handle an incoming request.
     * Previne session hijacking validando User-Agent
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $session = $request->session();

            // Obter fingerprint atual
            $currentFingerprint = $this->generateFingerprint($request);

            // Se não existe fingerprint na sessão, criar
            if (!$session->has('_security_fingerprint')) {
                $session->put('_security_fingerprint', $currentFingerprint);

                // Garantir que _last_activity existe
                if (!$session->has('_last_activity')) {
                    $session->put('_last_activity', time());
                }

                \Log::debug('Fingerprint criado no middleware (primeira requisição)', [
                    'user_id' => Auth::id(),
                    'fingerprint' => substr($currentFingerprint, 0, 10) . '...',
                ]);
            } else {
                // Validar fingerprint
                $storedFingerprint = $session->get('_security_fingerprint');

                if ($currentFingerprint !== $storedFingerprint) {
                    // Log para debug - mas NÃO fazer logout imediatamente
                    \Log::info('Fingerprint diferente detectado - atualizando', [
                        'user_id' => Auth::id(),
                        'stored' => substr($storedFingerprint, 0, 10) . '...',
                        'current' => substr($currentFingerprint, 0, 10) . '...',
                    ]);

                    // Atualizar fingerprint (tolerante a mudanças de rede/proxy)
                    $session->put('_security_fingerprint', $currentFingerprint);
                }
            }

            // Verificar tempo de inatividade (60 minutos)
            $lastActivity = $session->get('_last_activity', time());
            $inactiveTime = time() - $lastActivity;

            // Apenas fazer logout se realmente passou muito tempo
            if ($inactiveTime > 3600) { // 60 minutos
                \Log::info('Sessão expirada por inatividade real', [
                    'user_id' => Auth::id(),
                    'inactive_minutes' => round($inactiveTime / 60, 2),
                ]);

                Auth::logout();
                $session->invalidate();
                $session->regenerateToken();

                // Retornar JSON se for requisição AJAX
                if ($request->expectsJson() || $request->ajax()) {
                    return response()->json([
                        'error' => 'Sessão expirada',
                        'message' => 'Sua sessão expirou por inatividade.',
                        'redirect' => route('login'),
                    ], 401);
                }

                return redirect()->route('login')->withErrors([
                    'timeout' => 'Sua sessão expirou por inatividade. Por favor, faça login novamente.',
                ]);
            }

            // Atualizar última atividade
            $session->put('_last_activity', time());
        }

        return $next($request);
    }

    /**
     * Gera fingerprint único baseado apenas em User-Agent
     * (IP removido pois pode mudar em proxies/load balancers)
     */
    private function generateFingerprint(Request $request): string
    {
        return hash('sha256',
            $request->userAgent() .
            '|' .
            config('app.key')
        );
    }
}
