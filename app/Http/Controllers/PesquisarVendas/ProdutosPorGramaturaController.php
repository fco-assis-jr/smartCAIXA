<?php

namespace App\Http\Controllers\PesquisarVendas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * A busca por gramatura é um modo de filtro dentro da tela "Vendas por Produto"
 * (ProdutosPorDescricaoController::index). Este controller mantém apenas a
 * consulta em si — sem página própria.
 */
class ProdutosPorGramaturaController extends Controller
{
    /**
     * Buscar vendas por gramatura
     */
    public function buscar(Request $request)
    {
        $request->validate([
            'filial' => 'required|string',
            'gramatura' => 'required|numeric|min:0',
            'dataInicio' => 'required|date',
            'dataFim' => 'required|date|after_or_equal:dataInicio',
            'caixa' => 'nullable|string|max:20',
            'valor' => 'nullable|numeric|min:0',
        ]);

        // Caixa e valor são filtros opcionais — só entram na consulta se informados.
        $filtrosOpcionais = '';
        $paramsOpcionais = [];

        if ($request->filled('caixa')) {
            $filtrosOpcionais .= ' AND S.CAIXA = :caixa';
            $paramsOpcionais['caixa'] = $request->caixa;
        }

        if ($request->filled('valor')) {
            $filtrosOpcionais .= ' AND ROUND(M.QT * M.PUNIT, 2) = :valor';
            $paramsOpcionais['valor'] = $request->valor;
        }

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
                        AND M.DTMOV BETWEEN TO_DATE(:dataInicio, 'YYYY-MM-DD') AND TO_DATE(:dataFim, 'YYYY-MM-DD')
                        AND M.CODOPER = 'S'
                        {$filtrosOpcionais}
                    ORDER BY M.CODPROD
                ", array_merge([
                    'filial' => $request->filial,
                    'gramatura' => $request->gramatura,
                    'dataInicio' => $request->dataInicio,
                    'dataFim' => $request->dataFim,
                ], $paramsOpcionais));

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
                'dataInicio' => $request->dataInicio,
                'dataFim' => $request->dataFim,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Não foi possível buscar as vendas. Tente novamente.',
            ], 500);
        }
    }
}
