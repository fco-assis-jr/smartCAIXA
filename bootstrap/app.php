<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\ValidateSessionSecurity;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Inertia\Inertia;

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

        // Renderizar páginas de erro customizadas com Inertia
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Página não encontrada.'], 404);
            }

            return Inertia::render('errors/404')
                ->toResponse($request)
                ->setStatusCode(404);
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Acesso negado.'], 403);
            }

            return Inertia::render('errors/403')
                ->toResponse($request)
                ->setStatusCode(403);
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, $request) {
            $status = $e->getStatusCode();

            if ($request->expectsJson()) {
                return response()->json(['message' => $e->getMessage() ?: 'Erro no servidor.'], $status);
            }

            // Renderizar página específica baseada no código de status
            if ($status === 503) {
                return Inertia::render('errors/503')
                    ->toResponse($request)
                    ->setStatusCode(503);
            }

            if ($status === 500) {
                return Inertia::render('errors/500')
                    ->toResponse($request)
                    ->setStatusCode(500);
            }

            // Para outros erros HTTP, usar página genérica
            return Inertia::render('errors/Error', [
                'status' => $status,
                'message' => $e->getMessage(),
            ])
                ->toResponse($request)
                ->setStatusCode($status);
        });

        // Tratamento genérico para outros erros
        $exceptions->render(function (\Throwable $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor.',
                ], 500);
            }

            // Em produção, mostrar página de erro genérica
            if (!config('app.debug')) {
                return Inertia::render('errors/500')
                    ->toResponse($request)
                    ->setStatusCode(500);
            }
        });
    })->create();
