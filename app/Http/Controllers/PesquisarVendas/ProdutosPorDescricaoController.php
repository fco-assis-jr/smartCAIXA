<?php

namespace App\Http\Controllers\PesquisarVendas;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\FilialController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProdutosPorDescricaoController extends Controller
{
    /**
     * Display the Produtos Por Descrição page.
     */
    public function index(): Response
    {
        // Obter filiais do FilialController
        $filialController = new FilialController();
        $response = $filialController->index();
        $data = $response->getData(true);
        $filiais = $data['data'] ?? [];

        return Inertia::render('PesquisarVendas/ProdutosPorDescricao/Index', [
            'filiais' => $filiais,
        ]);
    }

    /**
     * Buscar produtos por descrição para autocomplete
     */
    public function buscarProdutos(Request $request)
    {
        try {
            // Validar que a filial foi informada
            $request->validate([
                'filial' => 'required',
                'tipoBusca' => 'required|in:codauxiliar,codprod,descricao',
                'termo' => 'required|min:1',
            ]);

            $termo = strtoupper($request->termo);
            $filial = $request->filial;
            $tipoBusca = $request->tipoBusca;

            // Montar a cláusula WHERE baseada no tipo de busca
            $whereClause = '';
            $bindParams = ['filial' => $filial];

            switch ($tipoBusca) {
                case 'codauxiliar':
                    $whereClause = 'AND E.CODAUXILIAR LIKE :termo';
                    $bindParams['termo'] = "{$termo}%";
                    break;
                case 'codprod':
                    $whereClause = 'AND P.CODPROD LIKE :termo';
                    $bindParams['termo'] = "{$termo}%";
                    break;
                case 'descricao':
                    $whereClause = 'AND P.DESCRICAO LIKE :termo';
                    $bindParams['termo'] = "{$termo}%";
                    break;
            }

            $produtos = DB::connection('oracle')
                ->select("
                    SELECT E.CODAUXILIAR,
                           P.CODPROD,
                           P.DESCRICAO,
                           E.EMBALAGEM
                    FROM PCPRODUT P
                    JOIN PCEMBALAGEM E ON E.CODPROD = P.CODPROD
                    WHERE P.DTEXCLUSAO IS NULL
                          AND E.PVENDA > 0
                          AND NVL(E.EXCLUIDO, 'N') = 'N'
                          AND E.CODFILIAL = :filial
                          {$whereClause}
                    GROUP BY E.CODAUXILIAR, P.CODPROD, P.DESCRICAO, E.EMBALAGEM
                    ORDER BY P.DESCRICAO
                    FETCH FIRST 50 ROWS ONLY
                ", $bindParams);

            // Converter para UTF-8
            $produtosConvertidos = array_map(function ($produto) {
                $produtoArray = (array) $produto;
                return [
                    'CODAUXILIAR' => $produtoArray['codauxiliar'] ?? '',
                    'CODPROD' => $produtoArray['codprod'] ?? '',
                    'DESCRICAO' => is_string($produtoArray['descricao'] ?? '') ? iconv('Windows-1252', 'UTF-8//IGNORE', $produtoArray['descricao']) : $produtoArray['descricao'],
                    'EMBALAGEM' => is_string($produtoArray['embalagem'] ?? '') ? iconv('Windows-1252', 'UTF-8//IGNORE', $produtoArray['embalagem']) : $produtoArray['embalagem'],
                ];
            }, $produtos);

            return response()->json([
                'success' => true,
                'produtos' => $produtosConvertidos,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar produtos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Buscar vendas por produtos selecionados
     */
    public function buscar(Request $request)
    {
        try {
            $request->validate([
                'filial' => 'required',
                'codauxiliares' => 'required|array',
                'data' => 'required|date',
            ]);

            // Converter array de códigos para string IN
            $codauxiliares = implode(',', array_map(function ($cod) {
                return "'{$cod}'";
            }, $request->codauxiliares));

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
                        AND M.CODAUXILIAR IN ({$codauxiliares})
                        AND M.DTMOV = TO_DATE(:data, 'YYYY-MM-DD')
                        AND M.CODOPER = 'S'
                    ORDER BY M.CODPROD
                ", [
                    'filial' => $request->filial,
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
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar vendas: ' . $e->getMessage(),
            ], 500);
        }
    }
}
