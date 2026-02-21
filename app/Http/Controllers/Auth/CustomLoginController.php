<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Pcempr;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class CustomLoginController extends Controller
{
    /**
     * Show the login form.
     */
    public function showLoginForm()
    {
        return Inertia::render('auth/CustomLogin');
    }

    /**
     * Handle a login request to the application.
     */
    public function login(Request $request)
    {
        $request->validate([
            'usuario' => 'required|string|max:100',
            'senha' => 'required|string|min:6|max:100',
        ], [
            'usuario.required' => 'O usuário é obrigatório.',
            'usuario.max' => 'O usuário não pode ter mais de 100 caracteres.',
            'senha.required' => 'A senha é obrigatória.',
            'senha.min' => 'A senha deve ter no mínimo 6 caracteres.',
            'senha.max' => 'A senha não pode ter mais de 100 caracteres.',
        ]);

        try {
            // Sanitizar inputs
            $usuario = trim($request->usuario);
            $senha = $request->senha;

            // Validar caracteres permitidos no usuário (prevenir SQL injection)
            if (!preg_match('/^[a-zA-Z0-9._-]+$/', $usuario)) {
                return back()->withErrors([
                    'usuario' => 'Usuário contém caracteres inválidos.',
                ])->onlyInput('usuario');
            }

            // Autenticar usando a query do Oracle
            $userData = Pcempr::autenticar($usuario, $senha);

            if (!$userData) {
                // Log de tentativa falha (sem dados sensíveis)
                \Log::warning('Tentativa de login falhou', [
                    'ip' => $request->ip(),
                    'user_agent' => substr($request->userAgent(), 0, 100),
                    'timestamp' => now()->toIso8601String(),
                ]);

                return back()->withErrors([
                    'usuario' => 'Usuário ou senha inválidos.',
                ])->onlyInput('usuario');
            }

            // Verificar se tem permissão
            if (!$userData['permissao']) {
                \Log::warning('Usuário sem permissão tentou acessar', [
                    'matricula' => $userData['matricula'],
                    'ip' => $request->ip(),
                ]);

                return back()->withErrors([
                    'usuario' => 'Você não tem permissão para acessar o sistema.',
                ])->onlyInput('usuario');
            }

            // Criar usuário para autenticação (dados já sanitizados pelo Model)
            $user = new Pcempr();
            $user->MATRICULA = $userData['matricula'];
            $user->NOME = $userData['nome'];
            $user->USUARIOBD = $userData['usuariobd'];
            $user->exists = true; // Marcar como existente para o Auth

            // Adicionar atributos mapeados para o frontend
            $user->setAttribute('id', $userData['matricula']);
            $user->setAttribute('name', $userData['nome']);
            $user->setAttribute('email', $userData['email']);
            $user->setAttribute('avatar', null);
            $user->setAttribute('email_verified_at', null);
            $user->setAttribute('created_at', now());
            $user->setAttribute('updated_at', now());

            // Fazer login do usuário PRIMEIRO
            Auth::login($user, $request->filled('remember'));

            // SEGURANÇA: Regenerar ID da sessão após login (previne session fixation)
            $request->session()->regenerate();

            // Dados da sessão (sem informações sensíveis)
            $sessionData = [
                'matricula' => $userData['matricula'],
                'nome' => $userData['nome'],
                'usuariobd' => $userData['usuariobd'],
                'email' => $userData['email'],
                'permissao' => $userData['permissao'],
            ];

            // Armazenar dados na sessão
            Session::put('user_data', $sessionData);

            // Log de login bem-sucedido (sem dados sensíveis)
            \Log::info('Login realizado com sucesso', [
                'matricula' => $userData['matricula'],
                'ip' => $request->ip(),
                'timestamp' => now()->toIso8601String(),
            ]);

            // Redirecionar para o dashboard
            return redirect()->intended('/smartcaixa/dashboard');
        } catch (\Exception $e) {
            \Log::error('Erro no processo de login', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'ip' => $request->ip(),
            ]);

            return back()->withErrors([
                'usuario' => 'Erro ao processar login. Tente novamente.',
            ])->onlyInput('usuario');
        }
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request)
    {
        $userId = Auth::id();

        // Log de logout
        \Log::info('Logout realizado', [
            'user_id' => $userId,
            'ip' => $request->ip(),
            'timestamp' => now()->toIso8601String(),
        ]);

        // Fazer logout
        Auth::logout();

        // Limpar todos os dados da sessão
        $request->session()->flush();

        // Invalidar sessão
        $request->session()->invalidate();

        // Regenerar token CSRF
        $request->session()->regenerateToken();

        // Redirecionar para login
        return redirect()->route('login')->with('status', 'Você foi desconectado com sucesso.');
    }
}
