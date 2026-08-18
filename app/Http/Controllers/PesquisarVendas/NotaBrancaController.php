<?php

namespace App\Http\Controllers\PesquisarVendas;

use App\Http\Controllers\Api\FilialController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class NotaBrancaController extends Controller
{
    /**
     * Display the Nota Branca (NFC) page.
     */
    public function index(): Response
    {
        // Obter filiais do FilialController (mesmo padrão duplicado das
        // demais telas de pesquisar-vendas — ver CLAUDE.md).
        $filialController = new FilialController;
        $response = $filialController->index();
        $data = $response->getData(true);
        $filiais = $data['data'] ?? [];

        return Inertia::render('PesquisarVendas/NotaBranca/Index', [
            'filiais' => $filiais,
        ]);
    }

    /**
     * Buscar notas fiscais modelo 55 por filial e período.
     *
     * Query adaptada de um relatório existente (fornecida pelo usuário):
     * mantém a lógica de join/UNION ALL (notas aprovadas + notas em
     * contingência FS/FSDA/EPEC), mas parametriza a filial (originalmente
     * hardcoded pra '9'/'13') e o período (originalmente fixo em
     * TRUNC(SYSDATE)), e remove o JOIN com PCDOCELETRONICO/XMLNFE — o CLOB
     * do XML só é buscado sob demanda, por nota, em xml() abaixo.
     */
    public function buscar(Request $request)
    {
        $validated = $request->validate([
            'filial' => 'required|string',
            'dataInicio' => 'required|date',
            'dataFim' => 'required|date|after_or_equal:dataInicio',
        ]);

        try {
            $notas = DB::connection('oracle')->select(<<<'SQL'
                SELECT
                    NUMNOTA,
                    NUMTRANSVENDA,
                    DTSAIDA,
                    HORA,
                    CLIENTE,
                    CPF_CNPJ,
                    CHAVENFE,
                    VLTOTAL,
                    CODFILIAL,
                    ORIGEM_NFE
                FROM (
                    -- Notas aprovadas (fluxo normal)
                    SELECT
                        PCNFSAID.NUMNOTA,
                        PCNFSAID.NUMTRANSVENDA AS NUMTRANSVENDA,
                        PCNFSAID.DTSAIDA,
                        TO_CHAR(PCNFSAID.HORALANC, 'FM00') || ':' || TO_CHAR(PCNFSAID.MINUTOLANC, 'FM00') AS HORA,
                        NVL(PCVENDACONSUM.CLIENTE, NVL(PCNFSAID.CLIENTE, PCCLIENT.CLIENTE)) AS CLIENTE,
                        NVL(PCVENDACONSUM.CGCENT, PCCLIENT.CGCENT) AS CPF_CNPJ,
                        PCNFSAID.CHAVENFE,
                        PCNFSAID.VLTOTAL,
                        NVL(PCNFSAID.CODFILIALNF, PCNFSAID.CODFILIAL) AS CODFILIAL,
                        'Autorizada' AS ORIGEM_NFE
                    FROM PCNFSAID, PCCLIENT, PCVENDACONSUM, PCPRACA, PCFILAMAISNEGLOG
                    WHERE (   (PCNFSAID.SITUACAONFE IN (100, 150))
                           OR (PCNFSAID.PROTOCOLONFEEPEC IS NOT NULL)
                           OR (    NVL(PCNFSAID.TIPOEMISSAO, '1') IN (2, 4, 5)
                               AND NVL(PCNFSAID.SITUACAONFE, 0) IN (0, 1001)))
                      AND PCNFSAID.DTCANCEL IS NULL
                      AND NVL(PCNFSAID.CONDVENDA, 0) NOT IN (3, 6, 12)
                      AND NVL(PCNFSAID.CONDVENDA, 0) IN ('1')
                      AND PCNFSAID.ESPECIE <> 'CF'
                      AND PCNFSAID.SERIE NOT IN ('CP', 'CF')
                      AND SUBSTR(PCNFSAID.CHAVENFE, 21, 2) = '55'
                      AND DECODE(NVL(PCNFSAID.CODCLINF, 0), 0, NVL(PCNFSAID.CODCLI, 0), PCNFSAID.CODCLINF) = PCCLIENT.CODCLI
                      AND DECODE(
                              NVL(PCNFSAID.CODCLINF, PCNFSAID.CODCLI),
                              1, DECODE(NVL(PCNFSAID.NUMPED, -1), 0, -1, NVL(PCNFSAID.NUMPED, -1)),
                              2, DECODE(NVL(PCNFSAID.NUMPED, -1), 0, -1, NVL(PCNFSAID.NUMPED, -1)),
                              3, DECODE(NVL(PCNFSAID.NUMPED, -1), 0, -1, NVL(PCNFSAID.NUMPED, -1)),
                              -1) = PCVENDACONSUM.NUMPED(+)
                      AND PCNFSAID.CODPRACA = PCPRACA.CODPRACA(+)
                      AND (   (    (PCNFSAID.CODFILIALNF IS NOT NULL)
                               AND (PCNFSAID.CODFILIALNF = :filial1))
                           OR (    (PCNFSAID.CODFILIALNF IS NULL)
                               AND (PCNFSAID.CODFILIAL = :filial2)))
                      AND NVL(PCNFSAID.BROKER, 'N') = 'N'
                      AND PCNFSAID.NUMTRANSVENDA = PCFILAMAISNEGLOG.NUMTRANSVENDA(+)
                      AND NVL(PCNFSAID.NOTADUPLIQUESVC, 'N') = 'N'
                      AND NVL(PCNFSAID.DOCEMISSAO, 'S') <> 'CE'
                      AND NOT EXISTS
                              (SELECT 1 FROM PCFILIAL F WHERE F.CODCLI = PCNFSAID.CODCLI)

                    UNION ALL

                    -- Notas em contingência (FS, FSDA, EPEC)
                    SELECT
                        PCNFSAIDPREFAT.NUMNOTA,
                        PCNFSAIDPREFAT.NUMTRANSVENDA AS NUMTRANSVENDA,
                        PCNFSAIDPREFAT.DTSAIDA,
                        TO_CHAR(PCNFSAIDPREFAT.HORALANC, 'FM00') || ':' || TO_CHAR(PCNFSAIDPREFAT.MINUTOLANC, 'FM00') AS HORA,
                        NVL(PCVENDACONSUM.CLIENTE, NVL(PCNFSAIDPREFAT.CLIENTE, PCCLIENT.CLIENTE)) AS CLIENTE,
                        NVL(PCVENDACONSUM.CGCENT, PCCLIENT.CGCENT) AS CPF_CNPJ,
                        PCNFSAIDPREFAT.CHAVENFE,
                        PCNFSAIDPREFAT.VLTOTAL,
                        NVL(PCNFSAIDPREFAT.CODFILIALNF, PCNFSAIDPREFAT.CODFILIAL) AS CODFILIAL,
                        'Contingência' AS ORIGEM_NFE
                    FROM PCNFSAIDPREFAT, PCCLIENT, PCVENDACONSUM, PCPRACA, PCFILAMAISNEGLOG
                    WHERE (   (PCNFSAIDPREFAT.PROTOCOLONFEEPEC IS NOT NULL)
                           OR (    NVL(PCNFSAIDPREFAT.TIPOEMISSAO, '1') IN (2, 4, 5)
                               AND NVL(PCNFSAIDPREFAT.SITUACAONFE, 0) IN (0, 1001)))
                      AND PCNFSAIDPREFAT.DTCANCEL IS NULL
                      AND NVL(PCNFSAIDPREFAT.CONDVENDA, 0) NOT IN (3, 6, 12)
                      AND NVL(PCNFSAIDPREFAT.CONDVENDA, 0) IN ('1')
                      AND PCNFSAIDPREFAT.ESPECIE <> 'CF'
                      AND PCNFSAIDPREFAT.SERIE NOT IN ('CP', 'CF')
                      AND SUBSTR(PCNFSAIDPREFAT.CHAVENFE, 21, 2) = '55'
                      AND DECODE(NVL(PCNFSAIDPREFAT.CODCLINF, 0), 0, NVL(PCNFSAIDPREFAT.CODCLI, 0), PCNFSAIDPREFAT.CODCLINF) = PCCLIENT.CODCLI
                      AND DECODE(
                              NVL(PCNFSAIDPREFAT.CODCLINF, PCNFSAIDPREFAT.CODCLI),
                              1, DECODE(NVL(PCNFSAIDPREFAT.NUMPED, -1), 0, -1, NVL(PCNFSAIDPREFAT.NUMPED, -1)),
                              2, DECODE(NVL(PCNFSAIDPREFAT.NUMPED, -1), 0, -1, NVL(PCNFSAIDPREFAT.NUMPED, -1)),
                              3, DECODE(NVL(PCNFSAIDPREFAT.NUMPED, -1), 0, -1, NVL(PCNFSAIDPREFAT.NUMPED, -1)),
                              -1) = PCVENDACONSUM.NUMPED(+)
                      AND PCNFSAIDPREFAT.CODPRACA = PCPRACA.CODPRACA(+)
                      AND (   (    (PCNFSAIDPREFAT.CODFILIALNF IS NOT NULL)
                               AND (PCNFSAIDPREFAT.CODFILIALNF = :filial3))
                           OR (    (PCNFSAIDPREFAT.CODFILIALNF IS NULL)
                               AND (PCNFSAIDPREFAT.CODFILIAL = :filial4)))
                      AND NVL(PCNFSAIDPREFAT.BROKER, 'N') = 'N'
                      AND PCNFSAIDPREFAT.NUMTRANSVENDA = PCFILAMAISNEGLOG.NUMTRANSVENDA(+)
                      AND NVL(PCNFSAIDPREFAT.NOTADUPLIQUESVC, 'N') = 'N'
                      AND NVL(PCNFSAIDPREFAT.DOCEMISSAO, 'S') <> 'CE'
                      AND NOT EXISTS
                              (SELECT 1 FROM PCFILIAL F WHERE F.CODCLI = PCNFSAIDPREFAT.CODCLI)
                )
                WHERE DTSAIDA >= TO_DATE(:dataInicio, 'YYYY-MM-DD')
                  AND DTSAIDA <= TO_DATE(:dataFim, 'YYYY-MM-DD')
                ORDER BY NUMTRANSVENDA
                SQL, [
                'filial1' => $validated['filial'],
                'filial2' => $validated['filial'],
                'filial3' => $validated['filial'],
                'filial4' => $validated['filial'],
                'dataInicio' => $validated['dataInicio'],
                'dataFim' => $validated['dataFim'],
            ]);

            $notasConvertidas = array_map(function ($nota) {
                $notaArray = (array) $nota;

                return [
                    'NUMNOTA' => $notaArray['numnota'] ?? '',
                    'NUMTRANSVENDA' => (string) ($notaArray['numtransvenda'] ?? ''),
                    'DTSAIDA' => $notaArray['dtsaida'] ?? '',
                    'HORA' => $notaArray['hora'] ?? '',
                    'CLIENTE' => is_string($notaArray['cliente'] ?? '') ? iconv('Windows-1252', 'UTF-8//IGNORE', $notaArray['cliente']) : $notaArray['cliente'],
                    'CPF_CNPJ' => $notaArray['cpf_cnpj'] ?? '',
                    'CHAVENFE' => $notaArray['chavenfe'] ?? '',
                    'VLTOTAL' => (float) ($notaArray['vltotal'] ?? 0),
                    'CODFILIAL' => $notaArray['codfilial'] ?? '',
                    'ORIGEM_NFE' => $notaArray['origem_nfe'] ?? '',
                ];
            }, $notas);

            return response()->json([
                'success' => true,
                'notas' => $notasConvertidas,
            ]);
        } catch (\Throwable $e) {
            \Log::error('Erro ao buscar notas (Nota Branca)', [
                'filtros' => $validated,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Não foi possível buscar as notas. Tente novamente.',
            ], 500);
        }
    }

    /**
     * Buscar o XML (CLOB) de uma nota específica, pra gerar o PDF no
     * frontend. Não faz nenhum parsing aqui — só devolve o XML crú; ver
     * resources/js/lib/gerar-pdf-nota-branca.ts pro parsing e montagem do
     * PDF (mantém a geração 100% client-side, mesmo padrão do resto do
     * projeto — ver gerar-pdf-baixa.ts).
     */
    public function xml(string $numTransVenda)
    {
        try {
            $registro = DB::connection('oracle')->selectOne(
                'SELECT XMLNFE FROM PCDOCELETRONICO WHERE NUMTRANSACAO = :numTransVenda',
                ['numTransVenda' => $numTransVenda]
            );

            if (! $registro || empty($registro->xmlnfe)) {
                return response()->json([
                    'success' => false,
                    'message' => 'XML da nota não encontrado.',
                ], 404);
            }

            $xml = $registro->xmlnfe;
            // Oracle CLOB pode voltar como string simples ou como objeto
            // lob-like (com método load()) dependendo do driver — cobre os
            // dois casos (confirmado empiricamente via tinker que hoje volta
            // como string simples, mas mantém a defesa pro caso mudar).
            if (is_object($xml) && method_exists($xml, 'load')) {
                $xml = $xml->load();
            }

            if (! is_string($xml) || trim($xml) === '') {
                \Log::warning('CLOB XMLNFE em formato inesperado', [
                    'numTransVenda' => $numTransVenda,
                    'tipo' => is_object($xml) ? get_class($xml) : gettype($xml),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Não foi possível ler o XML desta nota.',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'xml' => $xml,
            ]);
        } catch (\Throwable $e) {
            \Log::error('Erro ao buscar XML da nota', [
                'numTransVenda' => $numTransVenda,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Não foi possível buscar o XML da nota. Tente novamente.',
            ], 500);
        }
    }
}
