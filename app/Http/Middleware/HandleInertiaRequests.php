<?php

namespace App\Http\Middleware;

use App\Models\MenuSetorAcesso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'menuAccess' => $this->menuAccess(),
        ];
    }

    /**
     * Quais menus restritos por setor (config/menus.php, com os setores
     * permitidos configurados no MySQL) o usuário autenticado pode ver —
     * usado pra esconder itens da barra lateral. A aplicação real da
     * restrição é feita pelos middlewares 'setor'/'setor.ti' nas rotas;
     * isto é só pra não mostrar um link que vai dar 403.
     *
     * @return array<string, bool>
     */
    private function menuAccess(): array
    {
        if (! Auth::check()) {
            return [];
        }

        // O Eloquent devolve os atributos do PCEMPR em minúsculo quando o
        // usuário é recarregado da sessão (via find()) — só o objeto
        // montado à mão no login usa maiúsculo. Checar os dois casos.
        $usuario = Auth::user();
        $codSetor = (int) ($usuario->CODSETOR ?? $usuario->codsetor ?? 0);

        $acessos = [];
        foreach (array_keys(config('menus', [])) as $menu) {
            $acessos[$menu] = MenuSetorAcesso::temAcesso($menu, $codSetor);
        }

        // "administrador" não vem de config/menus.php de propósito — o
        // acesso a ele é fixo no código (ver EnsureIsTi), não editável
        // pela própria tela que ele controla.
        $acessos['administrador'] = $codSetor === 16;

        return $acessos;
    }
}
