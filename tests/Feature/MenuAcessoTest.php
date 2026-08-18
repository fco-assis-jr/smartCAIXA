<?php

namespace Tests\Feature;

use App\Models\MenuSetorAcesso;
use App\Models\Pcempr;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MenuAcessoTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Monta um usuário autenticável sem tocar no Oracle — só o suficiente
     * pra simular a sessão que o CustomLoginController criaria depois de
     * autenticar. CODSETOR em minúsculo de propósito, reproduzindo como o
     * Eloquent devolve os atributos do PCEMPR quando recarrega o usuário
     * da sessão via Pcempr::find() (ver EnsureSetorAcesso).
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

    public function test_setor_autorizado_acessa_menu_restrito(): void
    {
        MenuSetorAcesso::definirSetores('consultar-vendas', [21, 26]);

        $this->actingAs($this->usuarioComSetor(21))
            ->get('/smartcaixa/pesquisar-vendas/produtos-por-descricao')
            ->assertOk();
    }

    public function test_setor_nao_autorizado_recebe_403(): void
    {
        MenuSetorAcesso::definirSetores('consultar-vendas', [21, 26]);

        $this->actingAs($this->usuarioComSetor(29))
            ->get('/smartcaixa/pesquisar-vendas/produtos-por-descricao')
            ->assertForbidden();
    }

    public function test_menu_sem_setor_configurado_bloqueia_todo_mundo(): void
    {
        // A migration semeia 'ferramentas' com 16/21/26 (preserva o que já
        // existia em config/menu_access.php) — zera pra simular de fato um
        // menu ainda sem nenhuma configuração.
        MenuSetorAcesso::definirSetores('ferramentas', []);

        $this->actingAs($this->usuarioComSetor(21))
            ->get('/smartcaixa/ferramentas/dblink')
            ->assertForbidden();
    }

    public function test_baixa_produto_e_liberado_para_todos(): void
    {
        $this->actingAs($this->usuarioComSetor(29))
            ->get('/smartcaixa/baixa-produto')
            ->assertOk();
    }

    public function test_apenas_setor_ti_acessa_administrador(): void
    {
        $this->actingAs($this->usuarioComSetor(16))
            ->get('/smartcaixa/administrador/menu-acesso')
            ->assertOk();

        $this->actingAs($this->usuarioComSetor(21))
            ->get('/smartcaixa/administrador/menu-acesso')
            ->assertForbidden();
    }

    public function test_dashboard_recebe_menuaccess_refletindo_o_setor_do_usuario(): void
    {
        MenuSetorAcesso::definirSetores('consultar-vendas', [21, 26]);
        MenuSetorAcesso::definirSetores('ferramentas', [16]);

        // Setor 21: tem acesso a "consultar-vendas", mas não a "ferramentas"
        // — o dashboard usa isso pra decidir quais seções mostrar.
        $this->actingAs($this->usuarioComSetor(21))
            ->get('/smartcaixa/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('menuAccess.consultar-vendas', true)
                ->where('menuAccess.ferramentas', false)
            );

        // Setor 29: sem acesso a nenhum dos dois menus restritos.
        $this->actingAs($this->usuarioComSetor(29))
            ->get('/smartcaixa/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('menuAccess.consultar-vendas', false)
                ->where('menuAccess.ferramentas', false)
            );
    }

    public function test_atualizar_substitui_a_lista_de_setores_do_menu(): void
    {
        MenuSetorAcesso::definirSetores('consultar-vendas', [21, 26]);

        $this->actingAs($this->usuarioComSetor(16))
            ->post('/smartcaixa/administrador/menu-acesso', [
                'menu' => 'consultar-vendas',
                'codsetores' => [16, 26],
            ])
            ->assertOk()
            ->assertJson(['success' => true]);

        $this->assertEqualsCanonicalizing(
            [16, 26],
            MenuSetorAcesso::setoresPermitidos('consultar-vendas'),
        );
    }
}
