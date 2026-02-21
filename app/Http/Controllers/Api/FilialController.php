<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FilialController extends Controller
{
    /**
     * Listar todas as filiais ativas
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $filiais = DB::connection('oracle')
                ->table('PCFILIAL')
                ->select('CODIGO', 'CONTATO', 'CGC')
                ->whereNotIn('CODIGO', ['1', '2', '50', '51', '52', '53', '99'])
                ->orderByRaw('TO_NUMBER(CODIGO)')
                ->get()
                ->map(function ($filial) {
                    return [
                        'value' => (string) ($filial->codigo ?? ''),
                        'label' => ($filial->codigo ?? '') . ' - ' . trim($filial->contato ?? ''),
                        'cnpj' => $filial->cgc ?? '',
                        'codigo' => $filial->codigo ?? '',
                        'nome' => trim($filial->contato ?? ''),
                    ];
                })
                ->filter(function ($filial) {
                    return !empty($filial['value']);
                })
                ->values();

            return response()->json([
                'success' => true,
                'data' => $filiais,
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar filiais', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao buscar filiais',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Buscar filial específica por código
     *
     * @param string $codigo
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($codigo)
    {
        try {
            $filial = DB::connection('oracle')
                ->table('PCFILIAL')
                ->select('CODIGO', 'CONTATO', 'CGC', 'ENDERECO', 'CIDADE', 'UF', 'CEP', 'TELEFONE')
                ->where('CODIGO', $codigo)
                ->first();

            if (!$filial) {
                return response()->json([
                    'success' => false,
                    'error' => 'Filial não encontrada',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'codigo' => $filial->codigo ?? '',
                    'nome' => trim($filial->contato ?? ''),
                    'cnpj' => $filial->cgc ?? '',
                    'endereco' => $filial->endereco ?? '',
                    'cidade' => $filial->cidade ?? '',
                    'uf' => $filial->uf ?? '',
                    'cep' => $filial->cep ?? '',
                    'telefone' => $filial->telefone ?? '',
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar filial', [
                'codigo' => $codigo,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao buscar filial',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Buscar filiais com filtros customizados
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        try {
            $query = DB::connection('oracle')
                ->table('PCFILIAL')
                ->select('CODIGO', 'CONTATO', 'CGC');

            // Filtro por códigos específicos
            if ($request->has('codigos')) {
                $codigos = is_array($request->codigos)
                    ? $request->codigos
                    : explode(',', $request->codigos);
                $query->whereIn('CODIGO', $codigos);
            }

            // Filtro por códigos excluídos
            if ($request->has('excluir_codigos')) {
                $excluir = is_array($request->excluir_codigos)
                    ? $request->excluir_codigos
                    : explode(',', $request->excluir_codigos);
                $query->whereNotIn('CODIGO', $excluir);
            } else {
                // Excluir códigos padrão
                $query->whereNotIn('CODIGO', ['1', '2', '50', '51', '52', '53', '99']);
            }

            // Filtro por nome
            if ($request->has('nome')) {
                $query->where('CONTATO', 'like', '%' . $request->nome . '%');
            }

            $filiais = $query
                ->orderByRaw('TO_NUMBER(CODIGO)')
                ->get()
                ->map(function ($filial) {
                    return [
                        'value' => (string) ($filial->codigo ?? ''),
                        'label' => ($filial->codigo ?? '') . ' - ' . trim($filial->contato ?? ''),
                        'cnpj' => $filial->cgc ?? '',
                        'codigo' => $filial->codigo ?? '',
                        'nome' => trim($filial->contato ?? ''),
                    ];
                })
                ->filter(function ($filial) {
                    return !empty($filial['value']);
                })
                ->values();

            return response()->json([
                'success' => true,
                'data' => $filiais,
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar filiais com filtros', [
                'filtros' => $request->all(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao buscar filiais',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
