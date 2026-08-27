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
        $filialController = new FilialController;
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
        if (! empty($validated['codFilial'])) {
            $query->porFilial($validated['codFilial']);
        }

        // Filtrar por código auxiliar
        if (! empty($validated['codAuxiliar'])) {
            $query->porCodigoAuxiliar($validated['codAuxiliar']);
        }

        $produtos = $query->limit(100)->get();

        return response()->json([
            'produtos' => $produtos,
        ]);
    }

    /**
     * Buscar produto por código auxiliar.
     *
     * Consulta fornecida pelo usuário (ficha completa de produto, com preço,
     * custo, estoque, situação e restrições de venda) — filial e código
     * auxiliar são os únicos parâmetros; a região usada nas funções de
     * preço/margem (BUSCAPRECOS, BUSCAMARGEM) é sempre '1', fixo.
     */
    public function buscarPorCodigoAuxiliar(Request $request)
    {
        $validated = $request->validate([
            'codAuxiliar' => 'required|string|max:50|regex:/^[a-zA-Z0-9]+$/',
            'codFilial' => 'required|string|max:10',
        ]);

        // CODAUXILIAR é NUMBER no Oracle — um código com letra nunca vai
        // achar produto nenhum, e comparar contra a coluna faria o Oracle
        // tentar converter a string pra número e estourar ORA-01722 em vez
        // de simplesmente não encontrar nada. Responde 404 direto, sem
        // gastar a busca numa consulta que não pode achar.
        if (! ctype_digit($validated['codAuxiliar'])) {
            return response()->json([
                'error' => 'Produto não encontrado',
                'message' => "Não foi possível encontrar o produto com código {$validated['codAuxiliar']} na filial {$validated['codFilial']}",
            ], 404);
        }

        try {
            $produto = DB::connection('oracle')->selectOne(<<<'SQL'
                SELECT TBLPRODUT.DESCRICAO,
                       PCEMBALAGEM.CODPROD,
                       PCEMBALAGEM.DESTINOOFERTAATAC,
                       PCEMBALAGEM.DESTINOOFERTAVAREJO,
                       TO_CHAR (PCEMBALAGEM.CODAUXILIAR) CODAUXILIAR,
                       PCEMBALAGEM.EMBALAGEM,
                       PCEMBALAGEM.QTUNIT,
                       PCEMBALAGEM.UNIDADE,
                       (CASE
                            WHEN PCEMBALAGEM.DTINATIVO IS NULL THEN 'ATIVA'
                            ELSE 'INATIVA'
                        END)
                           SITUACAO,
                       (CASE WHEN TBLPRODUT.OBS = 'PV' THEN 'S' ELSE 'N' END)
                           PROIBIDOPRAVENDA,
                       (CASE WHEN TBLPRODUT.OBS2 = 'FL' THEN 'S' ELSE 'N' END)
                           FORADELINHA,
                       TBLPRODUT.MARCA,
                       NVL (COLUNA_PRECO (TBLPRECO.PRECO, 'PVENDA'), 0)
                           PVENDA,
                       NVL (COLUNA_PRECO (TBLPRECO.PRECO, 'PVENDAATAC'), 0)
                           PVENDAATAC,
                       TBLPRODUT.DIRFOTOPROD,
                       TBLTRIBUTACAO.CODICMTAB,
                       TBLTRIBUTACAO.CODECF,
                       PCEMBALAGEM.DESCRICAOECF,
                       PCEMBALAGEM.PERVARIACAOPTABELA,
                       (CASE
                            WHEN PKG_ESTOQUE.ESTOQUE_DISPONIVEL (PCEMBALAGEM.CODPROD,
                                                                 PCEMBALAGEM.CODFILIAL,
                                                                 'V') >
                                 0
                            THEN
                                'SIM'
                            ELSE
                                'NAO'
                        END)
                           PRODUTOCOMESTOQUE,
                       (CASE WHEN TBLPRODUT.DTEXCLUSAO IS NULL THEN 'NAO' ELSE 'SIM' END)
                           PRODUTOEXCLUIDO,
                       PKG_ESTOQUE.ESTOQUE_DISPONIVEL (PCEMBALAGEM.CODPROD,
                                                       PCEMBALAGEM.CODFILIAL,
                                                       'V')
                           QTESTOQUEDISPONIVEL,
                       TBLPRODUT.INFORMACOESTECNICAS,
                       CASE
                           WHEN (SELECT PCCONSUM.SUGVENDA FROM PCCONSUM) = 1
                           THEN
                               ROUND (NVL (PCEST.CUSTOREAL, 0), 2)
                           WHEN (SELECT PCCONSUM.SUGVENDA FROM PCCONSUM) = 2
                           THEN
                               ROUND (NVL (PCEST.CUSTOFIN, 0), 2)
                           ELSE
                               ROUND (NVL (PCEST.CUSTOULTENT, 0), 2)
                       END
                           CUSTO,
                       NVL (TBLPCPRODFILIAL.REVENDA, 'S')
                           REVENDAFILIAL,
                       NVL (TBLPRODUT.REVENDA, 'S')
                           REVENDAPROD,
                       NVL (TBLPCPRODFILIAL.ATIVO, 'S')
                           PRODUTOATIVO,
                       PCEST.CUSTOREAL,
                       PCEST.CUSTOFIN,
                       PCEST.CUSTOCONT,
                       PCEST.CUSTOULTENT,
                       TBLPRODUT.NBM
                FROM PCEMBALAGEM,
                     PCEST,
                     PCREGIAO,
                     (SELECT TBLCLASSIFICMERC.CODAUXILIAR,
                             TBLCLASSIFICMERC.CODFILIAL,
                             PCTRIBUT.CODICMTAB,
                             PCTRIBUT.CODECF,
                             PCEMBALAGEM.CODPROD
                      FROM PCEMBALAGEM,
                           PCPARAMFILIAL TBL_MARGEM,
                           PCPARAMFILIAL TBL_TRIBUT,
                           PCPARAMFILIAL TBL_TRIBUF,
                           (TABLE (BUSCAMARGEM (PCEMBALAGEM.CODFILIAL,
                                                PCEMBALAGEM.CODPROD,
                                                PCEMBALAGEM.CODAUXILIAR,
                                                '1',
                                                PCEMBALAGEM.PERVARIACAOPTABELA,
                                                NVL (TBL_MARGEM.VALOR, 'N'),
                                                NVL (TBL_TRIBUT.VALOR, 'N'),
                                                NVL (TBL_TRIBUF.VALOR, 'N'))))
                           TBLCLASSIFICMERC,
                           PCTRIBUT
                      WHERE     PCEMBALAGEM.CODFILIAL = TBL_MARGEM.CODFILIAL
                            AND PCEMBALAGEM.CODFILIAL = TBLCLASSIFICMERC.CODFILIAL
                            AND TBL_MARGEM.CODFILIAL = TBL_TRIBUT.CODFILIAL
                            AND TBL_MARGEM.NOME = 'UTILIZAMARGEMSUBCAT'
                            AND TBL_TRIBUT.NOME = 'UTILIZATRIBUTSUBCAT'
                            AND NVL (TBL_TRIBUF.NOME, 'CON_USATRIBUTACAOPORUF') =
                                'CON_USATRIBUTACAOPORUF'
                            AND TBL_TRIBUF.CODFILIAL = '99'
                            AND PCTRIBUT.CODST = TBLCLASSIFICMERC.CODST
                            AND ((PCEMBALAGEM.CODFILIAL = :codFilial1) OR (:codFilial2 = '99'))
                            AND PCEMBALAGEM.CODPROD IN
                                    (SELECT E.CODPROD
                                     FROM PCEMBALAGEM E
                                     WHERE E.CODAUXILIAR = :codAuxiliar1 AND E.CODFILIAL = :codFilial3))
                     TBLTRIBUTACAO,
                     (SELECT PCPRODUT.CODPROD,
                             PCPRODUT.CODINTERNO,
                             PCPRODUT.DESCRICAO,
                             PCPRODUT.DIRFOTOPROD,
                             PCPRODUT.OBS,
                             PCPRODUT.OBS2,
                             PCMARCA.MARCA,
                             PCPRODUT.DTEXCLUSAO,
                             PCPRODUT.INFORMACOESTECNICAS,
                             PCPRODUT.REVENDA,
                             PCPRODUT.NBM
                      FROM PCPRODUT, PCMARCA
                      WHERE PCPRODUT.CODMARCA = PCMARCA.CODMARCA(+)) TBLPRODUT,
                     (SELECT CODPROD, CODFILIAL, ATIVO, REVENDA FROM PCPRODFILIAL)
                     TBLPCPRODFILIAL,
                     (SELECT E.CODAUXILIAR,
                             E.CODPROD,
                             E.CODFILIAL,
                             BUSCAPRECOS (E.CODFILIAL,
                                          '1',
                                          E.CODAUXILIAR,
                                          TRUNC (SYSDATE)) PRECO
                      FROM PCEMBALAGEM E) TBLPRECO
                WHERE     PCEMBALAGEM.CODPROD = TBLPRODUT.CODPROD
                      AND (    PCEMBALAGEM.CODFILIAL = TBLTRIBUTACAO.CODFILIAL(+)
                           AND PCEMBALAGEM.CODPROD = TBLTRIBUTACAO.CODPROD(+)
                           AND PCEMBALAGEM.CODAUXILIAR = TBLTRIBUTACAO.CODAUXILIAR(+))
                      AND TBLPRECO.CODFILIAL = PCEMBALAGEM.CODFILIAL
                      AND TBLPRECO.CODAUXILIAR = PCEMBALAGEM.CODAUXILIAR
                      AND PCEST.CODPROD = PCEMBALAGEM.CODPROD
                      AND PCEST.CODFILIAL = PCEMBALAGEM.CODFILIAL
                      AND TBLPCPRODFILIAL.CODPROD = PCEMBALAGEM.CODPROD
                      AND TBLPCPRODFILIAL.CODFILIAL = PCEMBALAGEM.CODFILIAL
                      AND PCREGIAO.NUMREGIAO = '1'
                      AND ((PCEMBALAGEM.CODFILIAL = :codFilial4) OR (:codFilial5 = '99'))
                      AND PCEMBALAGEM.CODPROD IN
                              (SELECT E.CODPROD
                               FROM PCEMBALAGEM E
                               WHERE E.CODAUXILIAR = :codAuxiliar2 AND E.CODFILIAL = :codFilial6)
                SQL, [
                'codFilial1' => $validated['codFilial'],
                'codFilial2' => $validated['codFilial'],
                'codAuxiliar1' => $validated['codAuxiliar'],
                'codFilial3' => $validated['codFilial'],
                'codFilial4' => $validated['codFilial'],
                'codFilial5' => $validated['codFilial'],
                'codAuxiliar2' => $validated['codAuxiliar'],
                'codFilial6' => $validated['codFilial'],
            ]);

            if (! $produto || ($produto->produtoexcluido ?? 'NAO') === 'SIM') {

                return response()->json([
                    'error' => 'Produto não encontrado',
                    'message' => "Não foi possível encontrar o produto com código {$validated['codAuxiliar']} na filial {$validated['codFilial']}",
                ], 404);
            }

            // Oracle devolve texto em Windows-1252 — converter antes do json()
            // ou uma descrição/embalagem com acento quebra a codificação da
            // resposta (Malformed UTF-8 characters).
            $descricao = $produto->descricao ?? '';
            $embalagem = $produto->embalagem ?? '';
            $unidade = $produto->unidade ?? '';

            return response()->json([
                'produto' => [
                    'CODFILIAL' => $validated['codFilial'],
                    'CODPROD' => $produto->codprod ?? '',
                    'DESCRICAO' => is_string($descricao) ? iconv('Windows-1252', 'UTF-8//IGNORE', $descricao) : $descricao,
                    'EMBALAGEM' => is_string($embalagem) ? iconv('Windows-1252', 'UTF-8//IGNORE', $embalagem) : $embalagem,
                    'UNIDADE' => is_string($unidade) ? iconv('Windows-1252', 'UTF-8//IGNORE', $unidade) : $unidade,
                    'CODAUXILIAR' => $produto->codauxiliar ?? '',
                    'FORALINHA' => $produto->foradelinha ?? 'N',
                    'PRECO' => (float) ($produto->pvenda ?? 0),
                ],
            ]);
        } catch (\Throwable $e) {
            \Log::error('Erro ao buscar produto: '.$e->getMessage());

            return response()->json([
                'error' => 'Erro ao buscar produto',
                'message' => 'Não foi possível buscar o produto. Tente novamente.',
            ], 500);
        }
    }
}
