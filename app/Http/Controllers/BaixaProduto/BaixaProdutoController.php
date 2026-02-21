<?php

namespace App\Http\Controllers\BaixaProduto;

use App\Http\Controllers\Api\FilialController;
use App\Http\Controllers\Controller;
use App\Models\Filial;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BaixaProdutoController extends Controller
{
    /**
     * Display the baixa produto page.
     */
    public function index()
    {
        // Buscar filiais usando o FilialController
        $filialController = new FilialController();
        $filiaisResponse = $filialController->index();
        $filiaisData = json_decode($filiaisResponse->getContent(), true);

        $filiais = $filiaisData['success'] ? $filiaisData['data'] : [];

        // Tipos de baixa
        $tiposBaixa = [
            ['value' => 'VENCIMENTO', 'label' => 'Vencimento'],
            ['value' => 'AVARIA', 'label' => 'Avaria'],
            ['value' => 'AVARIA_UNI', 'label' => 'Avaria Unitária'],
            ['value' => 'COZINHA', 'label' => 'Cozinha'],
            ['value' => 'LIXO', 'label' => 'Lixo'],
            ['value' => 'DOACAO', 'label' => 'Doação'],
            ['value' => 'MOEDA', 'label' => 'Moeda'],
            ['value' => 'USO_CONSUMO', 'label' => 'Uso e Consumo'],
            ['value' => 'BRINDES', 'label' => 'Brindes'],
        ];

        return Inertia::render('BaixaProduto/Index', [
            'filiais' => $filiais,
            'tiposBaixa' => $tiposBaixa,
        ]);
    }

    /**
     * Buscar produtos para baixa
     */
    public function buscarProdutos(Request $request)
    {
        $validated = $request->validate([
            'codFilial' => 'nullable|string',
            'tipoBaixa' => 'nullable|string',
            'dataInicio' => 'nullable|date',
            'dataFim' => 'nullable|date',
            'codAuxiliar' => 'nullable|string',
        ]);

        $query = Produto::query()
            ->select([
                'CODPROD',
                'DESCRICAO',
                'EMBALAGEM',
                'UNIDADE',
                'CODAUXILIAR',
                'CODFILIAL',
            ])
            ->comEstoque();

        // Filtrar por filial
        if (!empty($validated['codFilial'])) {
            $query->porFilial($validated['codFilial']);
        }

        // Filtrar por código auxiliar
        if (!empty($validated['codAuxiliar'])) {
            $query->porCodigoAuxiliar($validated['codAuxiliar']);
        }

        $produtos = $query->limit(100)->get();

        return response()->json([
            'produtos' => $produtos,
        ]);
    }

    /**
     * Buscar produto por código auxiliar
     */
    public function buscarPorCodigoAuxiliar(Request $request)
    {
        $validated = $request->validate([
            'codAuxiliar' => 'required|string|max:50|regex:/^[a-zA-Z0-9]+$/',
            'codFilial' => 'required|string|max:10',
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
                    DB::raw("ROUND(COLUNA_PRECO(BUSCAPRECOS(E.CODFILIAL, '1', E.CODAUXILIAR, SYSDATE), 'PVENDA'), 2) AS PRECO"),
                ])
                ->whereNull('P.DTEXCLUSAO')
                ->where('E.CODFILIAL', $validated['codFilial']);

            // Ajustar a condição para buscar por código - SEGURO contra SQL Injection
            $codBusca = $validated['codAuxiliar'];
            $query->where(function ($q) use ($codBusca) {
                $q->where('E.CODAUXILIAR', $codBusca)
                    ->orWhereRaw('TO_CHAR(E.CODPROD) = ?', [$codBusca]); // ✅ SEGURO - usa binding
            });

            $produto = $query->first();

            if (!$produto) {

                return response()->json([
                    'error' => 'Produto não encontrado',
                    'message' => "Não foi possível encontrar o produto com código {$validated['codAuxiliar']} na filial {$validated['codFilial']}",
                ], 404);
            }


            return response()->json([
                'produto' => [
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
            \Log::error('Erro ao buscar produto: ' . $e->getMessage());

            return response()->json([
                'error' => 'Erro ao buscar produto',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
