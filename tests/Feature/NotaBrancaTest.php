<?php

namespace Tests\Feature;

use App\Models\MenuSetorAcesso;
use App\Models\Pcempr;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotaBrancaTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Mesmo helper de MenuAcessoTest — monta um usuário autenticável sem
     * tocar no Oracle, só o suficiente pra simular a sessão que o
     * CustomLoginController criaria depois de autenticar.
     */
    private function usuarioComSetor(int $codSetor): Pcempr
    {
        $usuario = new Pcempr;
        $usuario->MATRICULA = 999;
        $usuario->NOME = 'Usuário de Teste';
        $usuario->USUARIOBD = 'TESTE';
        $usuario->exists = true;
        $usuario->setAttribute('codsetor', $codSetor);

        return $usuario;
    }

    public function test_setor_autorizado_acessa_nota_branca(): void
    {
        MenuSetorAcesso::definirSetores('consultar-vendas', [21, 26]);

        $this->actingAs($this->usuarioComSetor(21))
            ->get('/smartcaixa/pesquisar-vendas/nota-branca')
            ->assertOk();
    }

    public function test_setor_nao_autorizado_recebe_403(): void
    {
        MenuSetorAcesso::definirSetores('consultar-vendas', [21, 26]);

        $this->actingAs($this->usuarioComSetor(29))
            ->get('/smartcaixa/pesquisar-vendas/nota-branca')
            ->assertForbidden();
    }

    public function test_visitante_nao_autenticado_e_redirecionado_para_login(): void
    {
        $this->get('/smartcaixa/pesquisar-vendas/nota-branca')
            ->assertRedirect(route('login'));
    }
}
