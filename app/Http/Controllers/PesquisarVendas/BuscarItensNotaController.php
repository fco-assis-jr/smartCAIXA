<?php

namespace App\Http\Controllers\PesquisarVendas;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class BuscarItensNotaController extends Controller
{
    /**
     * Display the Buscar Itens de Uma Nota page.
     */
    public function index(): Response
    {
        return Inertia::render('PesquisarVendas/BuscarItensNota/Index');
    }
}
