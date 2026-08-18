<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Quais setores (PCEMPR.CODSETOR, via Oracle) podem acessar cada menu
     * controlado (config/menus.php). Editável pela tela Administrador —
     * substitui a lista fixa que existia antes em config/menu_access.php.
     */
    public function up(): void
    {
        Schema::create('menu_setor_acessos', function (Blueprint $table) {
            $table->id();
            $table->string('menu');
            $table->unsignedSmallInteger('codsetor');
            $table->timestamps();

            $table->unique(['menu', 'codsetor']);
        });

        // Preserva o acesso que já existia via config/menu_access.php
        // (setores 16-TI, 21-Operadoras de Caixa, 26-Fiscal de Caixa) —
        // sem isso, todo mundo perderia acesso a Consultar Vendas e
        // Ferramentas no exato momento em que essa migration rodasse.
        $agora = now();
        $linhas = [];
        foreach (['consultar-vendas', 'ferramentas'] as $menu) {
            foreach ([16, 21, 26] as $codsetor) {
                $linhas[] = [
                    'menu' => $menu,
                    'codsetor' => $codsetor,
                    'created_at' => $agora,
                    'updated_at' => $agora,
                ];
            }
        }
        DB::table('menu_setor_acessos')->insert($linhas);
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_setor_acessos');
    }
};
