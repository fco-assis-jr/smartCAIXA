<?php

namespace App\Http\Controllers\Ferramentas;

use App\Http\Controllers\Api\FilialController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DblinkController extends Controller
{
    /**
     * Nome da conexão Oracle dinâmica usada para falar diretamente com o caixa
     * selecionado (montada em tempo de execução a partir de PCCAIXASFATURAMENTOAUTOSERV).
     */
    private const CONEXAO_CAIXA = 'oracle_caixa';

    /**
     * Display the dblink management page
     */
    public function index()
    {
        // Buscar filiais usando o FilialController
        $filialController = new FilialController;
        $filiaisResponse = $filialController->index();
        $filiaisData = json_decode($filiaisResponse->getContent(), true);

        $filiais = $filiaisData['success'] ? $filiaisData['data'] : [];

        return Inertia::render('Ferramentas/Dblink/Index', [
            'filiais' => $filiais,
            'caixas' => $this->listarCaixas(),
        ]);
    }

    /**
     * Recriar o database link diretamente na Oracle do caixa selecionado
     */
    public function recriar(Request $request)
    {
        $validated = $request->validate([
            'codFilial' => 'required|string',
            'numeroCaixa' => 'required|integer|min:1',
        ]);

        $caixa = $this->buscarCaixa($validated['codFilial'], (int) $validated['numeroCaixa']);

        if (! $caixa || ! $caixa['endereco']) {
            return response()->json([
                'success' => false,
                'error' => 'Caixa não encontrado',
                'message' => "Não encontramos um caixa ativo com esse número na filial {$validated['codFilial']}.",
            ], 404);
        }

        $ip = $caixa['endereco'];

        \Log::info('Recriando DBLink', [
            'codFilial' => $validated['codFilial'],
            'numeroCaixa' => $validated['numeroCaixa'],
            'descricao' => $caixa['descricao'],
            'ip' => $ip,
        ]);

        // Passo 1: Verificar rapidamente se o caixa está online na rede
        $socket = @fsockopen($ip, 1521, $errno, $errstr, 3);

        if (! $socket) {
            \Log::warning('Caixa offline', ['ip' => $ip, 'error' => $errstr]);

            return response()->json([
                'success' => false,
                'error' => 'Caixa Offline',
                'message' => "Não foi possível conectar ao caixa {$caixa['descricao']}.\n\nVerifique se ele está ligado e conectado à rede, e tente novamente.",
            ], 400);
        }

        fclose($socket);

        // Passo 2: Autenticar na Oracle do próprio caixa, com as credenciais cadastradas
        $conexao = $this->conectarCaixa($caixa);

        try {
            DB::connection($conexao)->select('SELECT 1 FROM DUAL');
        } catch (\Exception $e) {
            \Log::warning('Caixa online na rede, mas a Oracle dele não respondeu', [
                'ip' => $ip,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Oracle indisponível',
                'message' => "O caixa {$caixa['descricao']} está online, mas não foi possível se conectar a ele.\n\nAguarde um instante e tente novamente, ou peça apoio da equipe de TI.",
            ], 502);
        }

        // Passo 3: Dropar o DBLink existente na Oracle do caixa (se existir)
        try {
            DB::connection($conexao)->statement('DROP DATABASE LINK DBLSERVIDOR');
            \Log::info('DBLink DBLSERVIDOR dropado com sucesso', ['ip' => $ip]);
        } catch (\Exception $e) {
            // Se não existir, não tem problema
            \Log::info('DBLink DBLSERVIDOR não existia', ['ip' => $ip, 'error' => $e->getMessage()]);
        }

        // Passo 4: Criar o novo DBLink na Oracle do caixa, apontando para os servidores centrais
        try {
            $createStatement = "
                CREATE DATABASE LINK DBLSERVIDOR
                CONNECT TO BARATAO
                IDENTIFIED BY SENHA
                USING '(DESCRIPTION =
                    (ADDRESS = (PROTOCOL = TCP)(HOST = 172.22.0.176)(PORT = 1521))
                    (ADDRESS = (PROTOCOL = TCP)(HOST = 172.22.0.177)(PORT = 1521))
                    (LOAD_BALANCE = yes)
                    (CONNECT_DATA =
                        (SERVER = DEDICATED)
                        (SERVICE_NAME = wint)
                        (FAILOVER_MODE =
                            (TYPE = SELECT)
                            (METHOD = BASIC)
                            (RETRIES = 180)
                            (DELAY = 5)
                        )
                    )
                )'
            ";

            DB::connection($conexao)->statement($createStatement);

            \Log::info('DBLink DBLSERVIDOR criado com sucesso', [
                'servidores' => ['172.22.0.176', '172.22.0.177'],
                'caixa' => $ip,
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao criar DBLink na Oracle do caixa', [
                'ip' => $ip,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao criar DBLink',
                'message' => "Não foi possível recriar a conexão do caixa {$caixa['descricao']}.\n\nTente novamente ou peça apoio da equipe de TI.",
            ], 500);
        } finally {
            DB::disconnect($conexao);
        }

        // Passo 5: Testar o DBLink recém-criado contra os servidores centrais
        try {
            DB::connection($conexao)->select('SELECT 1 FROM DUAL@DBLSERVIDOR');

            return response()->json([
                'success' => true,
                'message' => "Conexão do caixa {$caixa['descricao']} recriada com sucesso!",
                'data' => [
                    'descricaoCaixa' => $caixa['descricao'],
                    'codFilial' => $validated['codFilial'],
                    'numeroCaixa' => $validated['numeroCaixa'],
                ],
            ]);
        } catch (\Exception $e) {
            \Log::warning('DBLink criado, mas teste de conexão com os servidores centrais falhou', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => true,
                'warning' => true,
                'message' => "A conexão do caixa {$caixa['descricao']} foi recriada, mas ainda não foi possível confirmar a comunicação com o servidor central.\n\nAguarde um instante e verifique o status novamente.",
                'data' => [
                    'descricaoCaixa' => $caixa['descricao'],
                    'codFilial' => $validated['codFilial'],
                    'numeroCaixa' => $validated['numeroCaixa'],
                ],
            ]);
        } finally {
            DB::disconnect($conexao);
        }
    }

    /**
     * Verificar o status do DBLink do caixa selecionado, conectando na Oracle dele
     */
    public function status(Request $request)
    {
        $validated = $request->validate([
            'codFilial' => 'required|string',
            'numeroCaixa' => 'required|integer|min:1',
        ]);

        $caixa = $this->buscarCaixa($validated['codFilial'], (int) $validated['numeroCaixa']);

        if (! $caixa || ! $caixa['endereco']) {
            return response()->json([
                'success' => true,
                'exists' => false,
                'message' => 'Caixa não encontrado.',
            ]);
        }

        $conexao = $this->conectarCaixa($caixa);

        try {
            $dblink = DB::connection($conexao)->select("
                SELECT DB_LINK
                FROM USER_DB_LINKS
                WHERE DB_LINK = 'DBLSERVIDOR'
            ");

            if (empty($dblink)) {
                return response()->json([
                    'success' => true,
                    'exists' => false,
                    'message' => 'Este caixa ainda não foi conectado ao servidor central.',
                ]);
            }

            // Tentar testar a conexão com os servidores centrais
            $connectionOk = false;
            try {
                DB::connection($conexao)->select('SELECT 1 FROM DUAL@DBLSERVIDOR');
                $connectionOk = true;
            } catch (\Exception $e) {
                \Log::info('Teste de conexão DBLink falhou', ['error' => $e->getMessage()]);
            }

            return response()->json([
                'success' => true,
                'exists' => true,
                'connectionOk' => $connectionOk,
            ]);
        } catch (\Exception $e) {
            \Log::info('Não foi possível conectar à Oracle do caixa para verificar o status', [
                'ip' => $caixa['endereco'],
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => true,
                'exists' => false,
                'unreachable' => true,
                'message' => "Não foi possível verificar o caixa {$caixa['descricao']} agora.",
            ]);
        } finally {
            DB::disconnect($conexao);
        }
    }

    /**
     * Listar os caixas ativos de todas as filiais, para o combobox de seleção.
     * Não inclui endereço/usuário/senha — esses só são lidos server-side, em
     * buscarCaixa(), no momento em que de fato precisamos conectar num caixa.
     */
    private function listarCaixas(): array
    {
        try {
            // Cacheado por 10 minutos — são ~270 caixas de todas as filiais,
            // e essa lista dificilmente muda de um minuto pro outro. Sem o
            // cache, essa consulta roda de novo cada vez que a tela do
            // DBLink é aberta.
            return Cache::remember('dblink.caixas', now()->addMinutes(10), function () {
                $rows = DB::connection('oracle')->select("
                    SELECT c.codfilial, i.numcaixa, c.descricao
                    FROM pccaixasfaturamentoautoserv i
                    JOIN pccaixa c ON i.numcaixa = c.numcaixa
                    WHERE proxnummovimentopdv IS NOT NULL
                      AND i.ativo = 'S'
                    ORDER BY TO_NUMBER(c.codfilial), i.numcaixa
                ");

                return array_map(function ($row) {
                    $row = (array) $row;
                    $descricao = $row['descricao'] ?? $row['DESCRICAO'] ?? '';

                    return [
                        'codFilial' => (string) ($row['codfilial'] ?? $row['CODFILIAL'] ?? ''),
                        'numeroCaixa' => (int) ($row['numcaixa'] ?? $row['NUMCAIXA'] ?? 0),
                        'descricao' => trim(is_string($descricao) ? iconv('Windows-1252', 'UTF-8//IGNORE', $descricao) : $descricao),
                    ];
                }, $rows);
            });
        } catch (\Exception $e) {
            \Log::error('Erro ao listar caixas', ['error' => $e->getMessage()]);

            return [];
        }
    }

    /**
     * Buscar o endereço/usuário/senha reais de um caixa específico.
     * Só roda server-side — endereco/usuario/senha nunca são enviados ao frontend.
     */
    private function buscarCaixa(string $codFilial, int $numeroCaixa): ?array
    {
        $caixa = DB::connection('oracle')->selectOne('
            SELECT c.codfilial, i.numcaixa, c.descricao, i.endereco, i.usuario, i.senha
            FROM pccaixasfaturamentoautoserv i
            JOIN pccaixa c ON i.numcaixa = c.numcaixa
            WHERE c.codfilial = :codFilial
                AND i.numcaixa = :numeroCaixa
                AND proxnummovimentopdv IS NOT NULL
                AND i.ativo = \'S\'
        ', [
            'codFilial' => $codFilial,
            'numeroCaixa' => $numeroCaixa,
        ]);

        if (! $caixa) {
            return null;
        }

        $row = (array) $caixa;
        $descricao = $row['descricao'] ?? $row['DESCRICAO'] ?? '';

        return [
            'descricao' => trim(is_string($descricao) ? iconv('Windows-1252', 'UTF-8//IGNORE', $descricao) : $descricao),
            'endereco' => trim((string) ($row['endereco'] ?? $row['ENDERECO'] ?? '')),
            'usuario' => trim((string) ($row['usuario'] ?? $row['USUARIO'] ?? '')),
            'senha' => (string) ($row['senha'] ?? $row['SENHA'] ?? ''),
        ];
    }

    /**
     * Registrar (ou atualizar) a conexão Oracle dinâmica que fala diretamente
     * com a Oracle do caixa informado, usando o endereço/usuário/senha
     * cadastrados em PCCAIXASFATURAMENTOAUTOSERV.
     */
    private function conectarCaixa(array $caixa): string
    {
        config(['database.connections.'.self::CONEXAO_CAIXA => [
            'driver' => 'oracle',
            'host' => $caixa['endereco'],
            'port' => '1521',
            'database' => 'XE',
            'service_name' => 'XE',
            'username' => $caixa['usuario'],
            'password' => $caixa['senha'],
            'charset' => 'AL32UTF8',
            'prefix' => '',
        ]]);

        // Garante que não reaproveitamos uma conexão PDO já aberta para outro caixa.
        DB::purge(self::CONEXAO_CAIXA);

        return self::CONEXAO_CAIXA;
    }
}
