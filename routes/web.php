<?php

use App\Http\Controllers\Api\FilialController;
use App\Http\Controllers\Api\ProdutoController;
use App\Http\Controllers\Auth\CustomLoginController;
use App\Http\Controllers\BaixaProduto\BaixaProdutoController;
use App\Http\Controllers\Ferramentas\DblinkController;
use App\Http\Controllers\PesquisarVendas\ProdutosPorGramaturaController;
use App\Http\Controllers\PesquisarVendas\ProdutosPorDescricaoController;
use App\Http\Controllers\PesquisarVendas\BuscarProdutoDevolucaoController;
use App\Http\Controllers\PesquisarVendas\BuscarItensNotaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rotas de Login Customizado (Padrão do Sistema)
Route::get('login', [CustomLoginController::class, 'showLoginForm'])
    ->name('login')
    ->middleware('guest');

Route::post('login', [CustomLoginController::class, 'login'])
    ->name('login.store')
    ->middleware(['guest', 'throttle:5,1']); // Máximo 5 tentativas por minuto

Route::post('logout', [CustomLoginController::class, 'logout'])
    ->name('logout')
    ->middleware('auth');

// Rota Home (Redireciona para login se não autenticado)
Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/smartcaixa/dashboard');
    }
    return redirect()->route('login');
})->name('home');

// Grupo de rotas protegidas com prefixo smartcaixa
Route::middleware(['auth'])->prefix('smartcaixa')->group(function () {

    // Dashboard
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // API - Filiais
    Route::prefix('api/filiais')->group(function () {
        Route::get('/', [FilialController::class, 'index'])->name('api.filiais.index');
        Route::get('/search', [FilialController::class, 'search'])->name('api.filiais.search');
        Route::get('/{codigo}', [FilialController::class, 'show'])->name('api.filiais.show');
    });

    // API - Produtos
    Route::prefix('api/produtos')->group(function () {
        Route::post('/buscar-codigo', [ProdutoController::class, 'buscarPorCodigo'])->name('api.produtos.buscar-codigo');
        Route::get('/search', [ProdutoController::class, 'search'])->name('api.produtos.search');
        Route::get('/{codProd}', [ProdutoController::class, 'show'])->name('api.produtos.show');
    });

    // Baixa Produto
    Route::get('baixa-produto', [BaixaProdutoController::class, 'index'])->name('baixa-produto.index');
    Route::post('baixa-produto/buscar-produtos', [BaixaProdutoController::class, 'buscarProdutos'])->name('baixa-produto.buscar-produtos');
    Route::post('baixa-produto/buscar-por-codigo', [BaixaProdutoController::class, 'buscarPorCodigoAuxiliar'])->name('baixa-produto.buscar-por-codigo');

    // Ferramentas
    Route::prefix('ferramentas')->name('ferramentas.')->group(function () {
        // DBLink
        Route::get('dblink', [DblinkController::class, 'index'])->name('dblink.index');
        Route::post('dblink/recriar', [DblinkController::class, 'recriar'])->name('dblink.recriar');
        Route::get('dblink/status', [DblinkController::class, 'status'])->name('dblink.status');
    });

    // Pesquisar Vendas
    Route::prefix('pesquisar-vendas')->name('pesquisar-vendas.')->group(function () {
        // Produtos Por Gramatura
        Route::get('produtos-por-gramatura', [ProdutosPorGramaturaController::class, 'index'])->name('produtos-por-gramatura.index');
        Route::post('produtos-por-gramatura/buscar', [ProdutosPorGramaturaController::class, 'buscar'])->name('produtos-por-gramatura.buscar');

        // Produtos Por Descrição
        Route::get('produtos-por-descricao', [ProdutosPorDescricaoController::class, 'index'])->name('produtos-por-descricao.index');
        Route::post('produtos-por-descricao/buscar-produtos', [ProdutosPorDescricaoController::class, 'buscarProdutos'])->name('produtos-por-descricao.buscar-produtos');
        Route::post('produtos-por-descricao/buscar', [ProdutosPorDescricaoController::class, 'buscar'])->name('produtos-por-descricao.buscar');

        // Buscar Produto Para Devolução
        Route::get('buscar-produto-devolucao', [BuscarProdutoDevolucaoController::class, 'index'])->name('buscar-produto-devolucao.index');

        // Buscar Itens de Uma Nota
        Route::get('buscar-itens-nota', [BuscarItensNotaController::class, 'index'])->name('buscar-itens-nota.index');
    });

});

require __DIR__.'/settings.php';
