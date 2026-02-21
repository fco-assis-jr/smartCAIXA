<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    /**
     * The connection name for the model.
     *
     * @var string
     */
    protected $connection = 'oracle';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'PCPRODUT';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'CODPROD';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'CODPROD',
        'DESCRICAO',
        'EMBALAGEM',
        'UNIDADE',
        'CODAUXILIAR',
        'CODFILIAL',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'CODPROD' => 'integer',
        'CODFILIAL' => 'string',
    ];

    /**
     * Relacionamento com Filial
     */
    public function filial()
    {
        return $this->belongsTo(Filial::class, 'CODFILIAL', 'CODIGO');
    }

    /**
     * Scope para produtos com estoque
     */
    public function scopeComEstoque($query)
    {
        return $query->where('DTEXCLUSAO', null);
    }

    /**
     * Scope para filtrar por filial
     */
    public function scopePorFilial($query, $codFilial)
    {
        if ($codFilial) {
            return $query->where('CODFILIAL', $codFilial);
        }
        return $query;
    }

    /**
     * Scope para buscar por código auxiliar
     */
    public function scopePorCodigoAuxiliar($query, $codAuxiliar)
    {
        return $query->where('CODAUXILIAR', $codAuxiliar);
    }
}
