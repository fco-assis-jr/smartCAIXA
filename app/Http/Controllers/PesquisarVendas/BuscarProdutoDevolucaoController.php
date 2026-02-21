<?php

namespace App\Http\Controllers\PesquisarVendas;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class BuscarProdutoDevolucaoController extends Controller
{
    /**
     * Display the Buscar Produto Para Devolução page.
     */
    public function index(): Response
    {
        return Inertia::render('PesquisarVendas/BuscarProdutoDevolucao/Index');
    }
}
