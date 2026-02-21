<?php

namespace App\Http\Controllers\Ferramentas;

use App\Http\Controllers\Api\FilialController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DblinkController extends Controller
{
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

        // Lista de caixas (1 a 30)
        $caixas = [];
        for ($i = 1; $i <= 30; $i++) {
            $caixas[] = [
                'value' => (string) $i,
                'label' => "Caixa {$i}",
            ];
        }

        return Inertia::render('Ferramentas/Dblink/Index', [
            'filiais' => $filiais,
            'caixas' => $caixas,
        ]);
    }

    /**
     * Recriar o database link
     */
    public function recriar(Request $request)
    {
        $validated = $request->validate([
            'codFilial' => 'required|string',
            'numeroCaixa' => 'required|integer|min:1|max:30',
        ]);

        try {
            // Montar o IP do caixa
            $ip = "172.22.{$validated['codFilial']}.{$validated['numeroCaixa']}";

            \Log::info('Recriando DBLink', [
                'codFilial' => $validated['codFilial'],
                'numeroCaixa' => $validated['numeroCaixa'],
                'ip' => $ip,
            ]);

            // Passo 1: Verificar se o caixa está online
            \Log::info('Testando conectividade com o caixa', ['ip' => $ip]);

            $caixaOnline = false;
            $errorMessage = '';

            try {
                // Tentar conectar diretamente no caixa para verificar se está online
                $testConnection = "(DESCRIPTION =
                    (ADDRESS = (PROTOCOL = TCP)(HOST = {$ip})(PORT = 1521))
                    (CONNECT_DATA =
                        (SERVER = DEDICATED)
                        (SERVICE_NAME = xe)
                    )
                )";

                // Criar uma conexão temporária para testar
                $config = [
                    'driver' => 'oracle',
                    'tns' => $testConnection,
                    'username' => 'caixa',
                    'password' => 'caixa',
                    'charset' => 'AL32UTF8',
                    'prefix' => '',
                ];

                $testDb = DB::connection()->getPdo();
                $stmt = $testDb->prepare("SELECT 1 FROM DUAL");
                $stmt->execute();

                // Tentar com fsockopen para verificar se a porta está aberta
                $socket = @fsockopen($ip, 1521, $errno, $errstr, 2);
                if ($socket) {
                    fclose($socket);
                    $caixaOnline = true;
                    \Log::info('Caixa está online', ['ip' => $ip]);
                } else {
                    $errorMessage = "Caixa offline ou porta 1521 inacessível: {$errstr} ({$errno})";
                    \Log::warning('Caixa offline', ['ip' => $ip, 'error' => $errorMessage]);
                }
            } catch (\Exception $e) {
                $errorMessage = $e->getMessage();
                \Log::warning('Erro ao testar conexão com o caixa', [
                    'ip' => $ip,
                    'error' => $errorMessage,
                ]);
            }

            // Se o caixa não está online, retornar erro
            if (!$caixaOnline) {
                return response()->json([
                    'success' => false,
                    'error' => 'Caixa Offline',
                    'message' => "Não foi possível conectar ao caixa.\n\nFilial: {$validated['codFilial']}\nCaixa: {$validated['numeroCaixa']}\nIP: {$ip}\n\nVerifique se:\n• O caixa está ligado\n• A rede está funcionando\n• O Oracle está rodando no caixa\n\nDetalhes: {$errorMessage}",
                ], 400);
            }

            // Passo 2: Dropar o DBLink existente (se existir)
            try {
                DB::connection('oracle')->statement('DROP DATABASE LINK DBLSERVIDOR');
                \Log::info('DBLink DBLSERVIDOR dropado com sucesso');
            } catch (\Exception $e) {
                // Se não existir, não tem problema
                \Log::info('DBLink DBLSERVIDOR não existia', ['error' => $e->getMessage()]);
            }

            // Passo 3: Criar o novo DBLink apontando para os servidores centrais
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

            DB::connection('oracle')->statement($createStatement);

            \Log::info('DBLink DBLSERVIDOR criado com sucesso', [
                'servidores' => ['172.22.0.176', '172.22.0.177'],
                'load_balance' => 'yes',
                'caixa' => $ip,
            ]);

            // Passo 4: Testar o DBLink com os servidores centrais
            try {
                DB::connection('oracle')->select('SELECT 1 FROM DUAL@DBLSERVIDOR');
                \Log::info('Teste de conexão com DBLink bem-sucedido');

                return response()->json([
                    'success' => true,
                    'message' => "DBLink recriado com sucesso!",
                    'data' => [
                        'ipCaixa' => $ip,
                        'caixaOnline' => true,
                        'servidores' => ['172.22.0.176', '172.22.0.177'],
                        'codFilial' => $validated['codFilial'],
                        'numeroCaixa' => $validated['numeroCaixa'],
                    ],
                ]);
            } catch (\Exception $e) {
                \Log::warning('DBLink criado mas teste de conexão com servidores centrais falhou', [
                    'error' => $e->getMessage(),
                ]);

                return response()->json([
                    'success' => true,
                    'warning' => true,
                    'message' => "DBLink criado e caixa está online.\n\nMas não foi possível testar a conexão com os servidores centrais.\n\nVerifique se os servidores estão acessíveis:\n• 172.22.0.176:1521\n• 172.22.0.177:1521\n\nCaixa: {$ip}",
                    'data' => [
                        'ipCaixa' => $ip,
                        'servidores' => ['172.22.0.176', '172.22.0.177'],
                        'codFilial' => $validated['codFilial'],
                        'numeroCaixa' => $validated['numeroCaixa'],
                    ],
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Erro ao recriar DBLink', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao recriar DBLink',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verificar status do DBLink atual
     */
    public function status()
    {
        try {
            // Buscar informações do DBLink atual
            $dblink = DB::connection('oracle')
                ->select("
                    SELECT
                        DB_LINK,
                        USERNAME,
                        HOST,
                        CREATED
                    FROM USER_DB_LINKS
                    WHERE DB_LINK = 'DBLSERVIDOR'
                ");

            if (empty($dblink)) {
                return response()->json([
                    'success' => true,
                    'exists' => false,
                    'message' => 'DBLink DBLSERVIDOR não existe',
                ]);
            }

            $info = $dblink[0];

            // Tentar testar a conexão
            $connectionOk = false;
            try {
                DB::connection('oracle')->select('SELECT 1 FROM DUAL@DBLSERVIDOR');
                $connectionOk = true;
            } catch (\Exception $e) {
                \Log::info('Teste de conexão DBLink falhou', ['error' => $e->getMessage()]);
            }

            return response()->json([
                'success' => true,
                'exists' => true,
                'connectionOk' => $connectionOk,
                'data' => [
                    'db_link' => $info->db_link ?? '',
                    'username' => $info->username ?? '',
                    'host' => $info->host ?? '',
                    'created' => $info->created ?? '',
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao verificar status do DBLink', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao verificar status',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
