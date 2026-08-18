<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Setores dos funcionários (WinThor). Só leitura — usado pra listar os
 * setores disponíveis na tela Administrador.
 */
class Pcsetor extends Model
{
    protected $connection = 'oracle';

    protected $table = 'PCSETOR';

    protected $primaryKey = 'CODSETOR';

    public $incrementing = false;

    public $timestamps = false;
}
