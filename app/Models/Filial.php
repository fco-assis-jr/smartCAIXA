<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Filial extends Model
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
    protected $table = 'PCFILIAL';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'CODIGO';

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
        'CODIGO',
        'CONTATO',
        'CGC',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'CODIGO' => 'string',
    ];

    /**
     * Accessor para CODFILIAL (alias de CODIGO)
     */
    public function getCodfilialAttribute()
    {
        return $this->CODIGO;
    }

    /**
     * Accessor para RAZAOSOCIAL (alias de CONTATO)
     */
    public function getRazaosocialAttribute()
    {
        return $this->CONTATO;
    }

    /**
     * Accessor para CNPJ (alias de CGC)
     */
    public function getCnpjAttribute()
    {
        return $this->CGC;
    }

    /**
     * Scope para excluir filiais específicas (1,2,50,51,52,53,99)
     */
    public function scopeExcluirFiliais($query)
    {
        return $query->whereNotIn('CODIGO', ['1', '2', '50', '51', '52', '53', '99']);
    }

    /**
     * Scope para ordenar por código numérico
     */
    public function scopeOrdenadoPorCodigo($query)
    {
        return $query->orderByRaw('TO_NUMBER(CODIGO)');
    }
}
