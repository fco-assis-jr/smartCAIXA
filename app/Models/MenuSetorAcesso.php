<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Quais setores (PCEMPR.CODSETOR) podem acessar cada menu controlado —
 * editável pela tela Administrador (setor 16/TI). Fica no MySQL, não no
 * Oracle: é configuração da aplicação, não dado do ERP.
 */
class MenuSetorAcesso extends Model
{
    protected $fillable = [
        'menu',
        'codsetor',
    ];

    protected $casts = [
        'codsetor' => 'integer',
    ];

    private const CACHE_MINUTOS = 5;

    /**
     * Setores autorizados a acessar um menu. Cacheado porque o middleware
     * 'setor' consulta isto em toda requisição das rotas protegidas.
     */
    public static function setoresPermitidos(string $menu): array
    {
        return Cache::remember(
            self::cacheKey($menu),
            now()->addMinutes(self::CACHE_MINUTOS),
            fn () => static::where('menu', $menu)->pluck('codsetor')->all(),
        );
    }

    public static function temAcesso(string $menu, int $codSetor): bool
    {
        return in_array($codSetor, self::setoresPermitidos($menu), true);
    }

    /**
     * Substitui a lista inteira de setores permitidos para um menu —
     * é assim que a tela Administrador salva (sempre manda o conjunto
     * completo desejado, não um diff).
     */
    public static function definirSetores(string $menu, array $codsetores): void
    {
        static::where('menu', $menu)->delete();

        if (! empty($codsetores)) {
            $agora = now();
            static::query()->insert(array_map(
                fn ($codsetor) => [
                    'menu' => $menu,
                    'codsetor' => (int) $codsetor,
                    'created_at' => $agora,
                    'updated_at' => $agora,
                ],
                array_unique(array_map('intval', $codsetores)),
            ));
        }

        Cache::forget(self::cacheKey($menu));
    }

    private static function cacheKey(string $menu): string
    {
        return "menu_setor_acessos.{$menu}";
    }
}
