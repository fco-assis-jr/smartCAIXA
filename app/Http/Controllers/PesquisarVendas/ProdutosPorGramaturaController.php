<?php

namespace App\Http\Controllers\PesquisarVendas;

use App\Http\Controllers\Api\FilialController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProdutosPorGramaturaController extends Controller
{
    /**
     * Display the Produtos Por Gramatura page.
     */
    public function index(): Response
    {
        $filialController = new FilialController();
        $response = $filialController->index();
        $data = $response->getData(true);
        $filiais = $data['data'] ?? [];

        return Inertia::render('PesquisarVendas/ProdutosPorGramatura/Index', [
            'filiais' => $filiais,
        ]);
    }

    /**
     * Buscar vendas por gramatura
     */
    public function buscar(Request $request)
    {
        $request->validate([
            'filial' => 'required|string',
            'gramatura' => 'required|numeric|min:0',
            'data' => 'required|date',
        ]);

        try {
            $vendas = DB::connection('oracle')
                ->select("
                    SELECT M.CODAUXILIAR,
                           M.CODPROD,
                           M.DESCRICAO,
                           M.QT,
                           M.PUNIT,
                           M.NUMNOTA,
                           S.CAIXA,
                           TO_CHAR(P.HORA,'00') || ':' || TO_CHAR(P.MINUTO,'00') AS HORA,
                           S.QRCODENFCE,
                           TO_CHAR(E.MATRICULA, '0000') || ' - ' || E.NOME AS NOME
                    FROM PCMOV M
                        INNER JOIN PCNFSAID S ON M.NUMTRANSVENDA = S.NUMTRANSVENDA
                        INNER JOIN PCPEDC P ON S.NUMPED = P.NUMPED
                        INNER JOIN PCEMPR E ON E.MATRICULA = S.CODEMITENTE
                    WHERE M.CODFILIAL = :filial
                        AND M.DTCANCEL IS NULL
                        AND M.QT <= :gramatura
                        AND M.DTMOV = TO_DATE(:data, 'YYYY-MM-DD')
                        AND M.CODOPER = 'S'
                    ORDER BY M.CODPROD
                ", [
                    'filial' => $request->filial,
                    'gramatura' => $request->gramatura,
                    'data' => $request->data,
                ]);

            // Converter para UTF-8 e tipos corretos
            $vendasConvertidas = array_map(function ($venda) {
                $vendaArray = (array) $venda;
                return [
                    'CODAUXILIAR' => is_string($vendaArray['codauxiliar'] ?? '') ? iconv('Windows-1252', 'UTF-8//IGNORE', $vendaArray['codauxiliar']) : $vendaArray['codauxiliar'],
                    'CODPROD' => is_string($vendaArray['codprod'] ?? '') ? iconv('Windows-1252', 'UTF-8//IGNORE', $vendaArray['codprod']) : $vendaArray['codprod'],
                    'DESCRICAO' => is_string($vendaArray['descricao'] ?? '') ? iconv('Windows-1252', 'UTF-8//IGNORE', $vendaArray['descricao']) : $vendaArray['descricao'],
                    'QT' => (float) ($vendaArray['qt'] ?? 0),
                    'PUNIT' => (float) ($vendaArray['punit'] ?? 0),
                    'NUMNOTA' => is_string($vendaArray['numnota'] ?? '') ? iconv('Windows-1252', 'UTF-8//IGNORE', $vendaArray['numnota']) : $vendaArray['numnota'],
                    'CAIXA' => is_string($vendaArray['caixa'] ?? '') ? iconv('Windows-1252', 'UTF-8//IGNORE', $vendaArray['caixa']) : $vendaArray['caixa'],
                    'HORA' => $vendaArray['hora'] ?? '',
                    'QRCODENFCE' => $vendaArray['qrcodenfce'] ?? '',
                    'NOME' => is_string($vendaArray['nome'] ?? '') ? iconv('Windows-1252', 'UTF-8//IGNORE', $vendaArray['nome']) : $vendaArray['nome'],
                ];
            }, $vendas);

            return response()->json([
                'success' => true,
                'vendas' => $vendasConvertidas,
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar vendas por gramatura', [
                'error' => $e->getMessage(),
                'filial' => $request->filial,
                'gramatura' => $request->gramatura,
                'data' => $request->data,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar vendas: ' . $e->getMessage(),
            ], 500);
        }
    }
}
