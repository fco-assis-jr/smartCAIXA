<?php

namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class Pcempr extends Model implements AuthenticatableContract
{
    use Authenticatable;

    protected $connection = 'oracle';
    protected $table = 'PCEMPR';
    protected $primaryKey = 'MATRICULA';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'MATRICULA',
        'NOME',
        'USUARIOBD',
    ];

    protected $hidden = [
        'SENHABD',
    ];

    /**
     * Get the name of the unique identifier for the user.
     */
    public function getAuthIdentifierName()
    {
        return 'MATRICULA';
    }

    /**
     * Get the column name for the "remember me" token.
     */
    public function getRememberTokenName()
    {
        return null;
    }

    /**
     * Prevent saving to database (read-only model)
     */
    public function save(array $options = [])
    {
        return false;
    }

    public function delete()
    {
        return false;
    }

    public function update(array $attributes = [], array $options = [])
    {
        return false;
    }

    /**
     * Converte os campos para UTF-8, vindo do Oracle com charset WE8MSWIN1252
     */
    public function toArray()
    {
        $array = parent::toArray();

        // Converter encoding de todos os campos string
        $array = array_map(function ($value) {
            return is_string($value)
                ? iconv('Windows-1252', 'UTF-8//IGNORE', $value)
                : $value;
        }, $array);

        // Mapear campos do Oracle para o formato esperado pelo frontend
        return [
            'id' => $array['MATRICULA'] ?? $array['matricula'] ?? $array['id'] ?? null,
            'name' => $array['NOME'] ?? $array['nome'] ?? $array['name'] ?? '',
            'email' => $array['email'] ?? '',
            'avatar' => $array['avatar'] ?? null,
            'email_verified_at' => $array['email_verified_at'] ?? null,
            'created_at' => $array['created_at'] ?? now()->toISOString(),
            'updated_at' => $array['updated_at'] ?? now()->toISOString(),
            // Manter campos originais também
            'MATRICULA' => $array['MATRICULA'] ?? $array['matricula'] ?? null,
            'NOME' => $array['NOME'] ?? $array['nome'] ?? null,
            'USUARIOBD' => $array['USUARIOBD'] ?? $array['usuariobd'] ?? null,
        ];
    }

    /**
     * Buscar usuário e verificar permissão com a query fornecida
     */
    public static function autenticar($usuario, $senha)
    {
        try {
            $result = \DB::connection('oracle')->select("
                SELECT
                    P.MATRICULA,
                    P.NOME,
                    P.USUARIOBD,
                    NVL(P.EMAIL, P.NOME_GUERRA) AS EMAIL,
                    DECODE(C.ACESSO, 'S', 'S', 'N') AS PERMISSAO
                FROM PCEMPR P
                LEFT JOIN PCCONTRO C ON P.MATRICULA = C.CODUSUARIO AND C.CODROTINA = 2075
                WHERE P.USUARIOBD = UPPER(:USUARIO)
                AND P.SENHABD = CRYPT(UPPER(:SENHA), P.USUARIOBD)
                AND ROWNUM = 1
            ", [
                'USUARIO' => strtoupper($usuario),
                'SENHA' => strtoupper($senha),
            ]);

            if (empty($result)) {
                return null;
            }

            $userData = $result[0];

            // Extrair valores (Oracle pode retornar maiúsculo ou minúsculo)
            $matricula = $userData->MATRICULA ?? $userData->matricula;
            $nome = $userData->NOME ?? $userData->nome;
            $usuariobd = $userData->USUARIOBD ?? $userData->usuariobd;
            $email = $userData->EMAIL ?? $userData->email;
            $permissao = ($userData->PERMISSAO ?? $userData->permissao) === 'S';

            // Converter encoding Windows-1252 para UTF-8
            $nome = is_string($nome) ? iconv('Windows-1252', 'UTF-8//IGNORE', $nome) : $nome;
            $usuariobd = is_string($usuariobd) ? iconv('Windows-1252', 'UTF-8//IGNORE', $usuariobd) : $usuariobd;
            $email = is_string($email) ? iconv('Windows-1252', 'UTF-8//IGNORE', $email) : $email;

            // Retornar array com dados convertidos
            return [
                'matricula' => (int)$matricula,
                'nome' => trim($nome ?? ''),
                'usuariobd' => trim($usuariobd ?? ''),
                'email' => trim($email ?? ''),
                'permissao' => $permissao,
            ];
        } catch (\Exception $e) {
            \Log::error('Erro na autenticação Oracle', [
                'error' => $e->getMessage(),
                'usuario' => $usuario,
            ]);
            return null;
        }
    }
}
