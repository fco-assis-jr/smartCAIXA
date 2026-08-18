<?php

namespace App\Http\Controllers\Administrador;

use App\Http\Controllers\Controller;
use App\Models\MenuSetorAcesso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MenuAcessoController extends Controller
{
    /**
     * Tela Administrador: quais setores podem acessar cada menu
     * controlado (config/menus.php).
     */
    public function index(): Response
    {
        $menus = collect(config('menus', []))
            ->map(fn ($label, $chave) => ['chave' => $chave, 'label' => $label])
            ->values();

        $permissoes = MenuSetorAcesso::query()
            ->get(['menu', 'codsetor'])
            ->groupBy('menu')
            ->map(fn ($linhas) => $linhas->pluck('codsetor')->values());

        return Inertia::render('Administrador/Index', [
            'menus' => $menus,
            'setores' => $this->listarSetores(),
            'permissoes' => $permissoes,
        ]);
    }

    /**
     * Substitui os setores permitidos de um menu pelo conjunto enviado.
     */
    public function atualizar(Request $request)
    {
        $menusValidos = array_keys(config('menus', []));

        $request->validate([
            'menu' => ['required', 'string', 'in:'.implode(',', $menusValidos)],
            'codsetores' => ['present', 'array'],
            'codsetores.*' => ['integer'],
        ], [
            'menu.in' => 'Menu desconhecido.',
        ]);

        try {
            MenuSetorAcesso::definirSetores((string) $request->input('menu'), $request->input('codsetores', []));

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            \Log::error('Erro ao salvar acesso de menu por setor', [
                'menu' => $request->input('menu'),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Não foi possível salvar as permissões. Tente novamente.',
            ], 500);
        }
    }

    /**
     * Setores do WinThor (PCSETOR) — muda raramente, cacheado como as
     * filiais (ver Api\FilialController::index()).
     */
    private function listarSetores()
    {
        return Cache::remember('setores.index', now()->addMinutes(10), function () {
            return DB::connection('oracle')
                ->table('PCSETOR')
                ->select('CODSETOR', 'DESCRICAO')
                ->orderBy('CODSETOR')
                ->get()
                ->map(fn ($setor) => [
                    'codsetor' => (int) $setor->codsetor,
                    'descricao' => trim($setor->descricao ?? ''),
                ]);
        });
    }
}
