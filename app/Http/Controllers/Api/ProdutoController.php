<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProdutoController extends Controller
{
    /**
     * Buscar produto por código auxiliar ou código de produto
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function buscarPorCodigo(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|string',
            'codFilial' => 'required|string',
        ]);

        try {
            $produto = DB::connection('oracle')
                ->table('PCPRODUT as P')
                ->join('PCEMBALAGEM as E', 'P.CODPROD', '=', 'E.CODPROD')
                ->select([
                    'E.CODFILIAL',
                    'P.CODPROD',
                    'P.DESCRICAO',
                    'E.EMBALAGEM',
                    'E.UNIDADE',
                    'E.CODAUXILIAR',
                    DB::raw("DECODE(TRIM(P.OBS2), NULL, 'N', 'S') AS FORALINHA"),
                    DB::raw("ROUND(COLUNA_PRECO(BUSCAPRECOS(E.CODFILIAL, '1', E.CODAUXILIAR, SYSDATE), 'PVENDA'), 2) AS PRECO"),
                ])
                ->whereNull('P.DTEXCLUSAO')
                ->where('E.CODFILIAL', $validated['codFilial'])
                ->where(function ($query) use ($validated) {
                    $query->where('E.CODAUXILIAR', $validated['codigo'])
                        ->orWhere(DB::raw('TO_CHAR(E.CODPROD)'), $validated['codigo']);
                })
                ->first();

            if (!$produto) {
                return response()->json([
                    'success' => false,
                    'error' => 'Produto não encontrado',
                    'message' => "Não foi possível encontrar o produto com código {$validated['codigo']} na filial {$validated['codFilial']}",
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'CODFILIAL' => $produto->codfilial ?? '',
                    'CODPROD' => $produto->codprod ?? '',
                    'DESCRICAO' => $produto->descricao ?? '',
                    'EMBALAGEM' => $produto->embalagem ?? '',
                    'UNIDADE' => $produto->unidade ?? '',
                    'CODAUXILIAR' => $produto->codauxiliar ?? '',
                    'FORALINHA' => $produto->foralinha ?? 'N',
                    'PRECO' => (float) ($produto->preco ?? 0),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar produto', [
                'codigo' => $validated['codigo'],
                'codFilial' => $validated['codFilial'],
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao buscar produto',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Buscar produtos com filtros customizados
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'codFilial' => 'nullable|string',
            'descricao' => 'nullable|string',
            'codAuxiliar' => 'nullable|string',
            'codProd' => 'nullable|string',
            'comEstoque' => 'nullable|boolean',
            'foraLinha' => 'nullable|boolean',
            'limit' => 'nullable|integer|max:500',
        ]);

        try {
            $query = DB::connection('oracle')
                ->table('PCPRODUT as P')
                ->join('PCEMBALAGEM as E', 'P.CODPROD', '=', 'E.CODPROD')
                ->select([
                    'E.CODFILIAL',
                    'P.CODPROD',
                    'P.DESCRICAO',
                    'E.EMBALAGEM',
                    'E.UNIDADE',
                    'E.CODAUXILIAR',
                    DB::raw("DECODE(TRIM(P.OBS2), NULL, 'N', 'S') AS FORALINHA"),
                ])
                ->whereNull('P.DTEXCLUSAO');

            // Filtro por filial
            if (!empty($validated['codFilial'])) {
                $query->where('E.CODFILIAL', $validated['codFilial']);
            }

            // Filtro por descrição
            if (!empty($validated['descricao'])) {
                $query->where('P.DESCRICAO', 'like', '%' . $validated['descricao'] . '%');
            }

            // Filtro por código auxiliar
            if (!empty($validated['codAuxiliar'])) {
                $query->where('E.CODAUXILIAR', $validated['codAuxiliar']);
            }

            // Filtro por código de produto
            if (!empty($validated['codProd'])) {
                $query->where('E.CODPROD', $validated['codProd']);
            }

            // Filtro produtos fora de linha
            if (isset($validated['foraLinha'])) {
                if ($validated['foraLinha']) {
                    $query->whereNotNull('P.OBS2');
                } else {
                    $query->whereNull('P.OBS2');
                }
            }

            $limit = $validated['limit'] ?? 100;
            $produtos = $query->limit($limit)->get();

            return response()->json([
                'success' => true,
                'data' => $produtos->map(function ($produto) {
                    return [
                        'CODFILIAL' => $produto->codfilial ?? '',
                        'CODPROD' => $produto->codprod ?? '',
                        'DESCRICAO' => $produto->descricao ?? '',
                        'EMBALAGEM' => $produto->embalagem ?? '',
                        'UNIDADE' => $produto->unidade ?? '',
                        'CODAUXILIAR' => $produto->codauxiliar ?? '',
                        'FORALINHA' => $produto->foralinha ?? 'N',
                    ];
                }),
                'count' => $produtos->count(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar produtos', [
                'filtros' => $validated,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao buscar produtos',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Buscar produto específico por código de produto
     *
     * @param string $codProd
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($codProd, Request $request)
    {
        $validated = $request->validate([
            'codFilial' => 'required|string',
        ]);

        try {
            $produto = DB::connection('oracle')
                ->table('PCPRODUT as P')
                ->join('PCEMBALAGEM as E', 'P.CODPROD', '=', 'E.CODPROD')
                ->select([
                    'E.CODFILIAL',
                    'P.CODPROD',
                    'P.DESCRICAO',
                    'E.EMBALAGEM',
                    'E.UNIDADE',
                    'E.CODAUXILIAR',
                    DB::raw("DECODE(TRIM(P.OBS2), NULL, 'N', 'S') AS FORALINHA"),
                    DB::raw("ROUND(COLUNA_PRECO(BUSCAPRECOS(E.CODFILIAL, '1', E.CODAUXILIAR, SYSDATE), 'PVENDA'), 2) AS PRECO"),
                ])
                ->whereNull('P.DTEXCLUSAO')
                ->where('E.CODFILIAL', $validated['codFilial'])
                ->where('E.CODPROD', $codProd)
                ->first();

            if (!$produto) {
                return response()->json([
                    'success' => false,
                    'error' => 'Produto não encontrado',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'CODFILIAL' => $produto->codfilial ?? '',
                    'CODPROD' => $produto->codprod ?? '',
                    'DESCRICAO' => $produto->descricao ?? '',
                    'EMBALAGEM' => $produto->embalagem ?? '',
                    'UNIDADE' => $produto->unidade ?? '',
                    'CODAUXILIAR' => $produto->codauxiliar ?? '',
                    'FORALINHA' => $produto->foralinha ?? 'N',
                    'PRECO' => (float) ($produto->preco ?? 0),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar produto', [
                'codProd' => $codProd,
                'codFilial' => $validated['codFilial'],
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao buscar produto',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
