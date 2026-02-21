<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\ValidateSessionSecurity;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            SecurityHeaders::class, // Headers de segurança HTTP
        ]);

        // Middleware de segurança para rotas autenticadas
        $middleware->alias([
            'session.security' => ValidateSessionSecurity::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Tratamento customizado para erro 429 (Too Many Requests / Rate Limit)
        $exceptions->render(function (\Illuminate\Http\Exceptions\ThrottleRequestsException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Muitas tentativas de login. Por favor, aguarde alguns instantes antes de tentar novamente.',
                    'retry_after' => $e->getHeaders()['Retry-After'] ?? 60,
                ], 429);
            }

            return back()->withErrors([
                'usuario' => 'Muitas tentativas de login. Por favor, aguarde ' .
                    ($e->getHeaders()['Retry-After'] ?? 60) .
                    ' segundos antes de tentar novamente.',
            ])->onlyInput('usuario');
        });
    })->create();
