<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     * Adiciona headers de segurança HTTP
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevenir clickjacking
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevenir MIME-type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // XSS Protection (browsers antigos)
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Content Security Policy (ajustado para desenvolvimento com Vite)
        $isDevelopment = config('app.env') === 'local' || config('app.debug');

        $scriptSrc = "'self' 'unsafe-inline' 'unsafe-eval'";
        $connectSrc = "'self' ws: wss:";

        // Adicionar Vite dev server em desenvolvimento
        if ($isDevelopment) {
            $scriptSrc .= " http://127.0.0.1:5173 http://localhost:5173";
            $connectSrc .= " http://127.0.0.1:5173 http://localhost:5173";
        }

        $cspDirectives = [
            "default-src 'self'",
            "script-src {$scriptSrc}",
            "style-src 'self' 'unsafe-inline' https://fonts.bunny.net",
            "font-src 'self' data: https://fonts.bunny.net",
            "img-src 'self' data: blob:",
            "connect-src {$connectSrc}",
            "frame-ancestors 'self'",
        ];

        $response->headers->set(
            'Content-Security-Policy',
            implode('; ', $cspDirectives)
        );

        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions Policy (desabilita recursos não usados)
        $response->headers->set(
            'Permissions-Policy',
            'geolocation=(), microphone=(), camera=()'
        );

        return $response;
    }
}
