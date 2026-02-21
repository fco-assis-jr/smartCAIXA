<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rotas de configurações dentro do prefixo smartcaixa e protegidas por autenticação
Route::middleware(['auth'])->prefix('smartcaixa')->group(function () {

    // Redireciona /smartcaixa/settings para /smartcaixa/settings/appearance
    Route::redirect('settings', '/smartcaixa/settings/appearance');

    // Apenas Appearance disponível
    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

});
