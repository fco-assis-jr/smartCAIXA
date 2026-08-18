<?php

// Controle de acesso a menus por setor do funcionário (PCEMPR.CODSETOR).
//
// Cada chave é um identificador de menu/grupo de funcionalidades; o valor
// é a lista de códigos de setor autorizados a acessá-lo. Um menu que não
// aparece aqui é liberado para todos os usuários autenticados (ex.: "Baixa
// Produto" não tem entrada de propósito).
//
// Escalável: para restringir um novo menu por setor, basta adicionar uma
// chave aqui e aplicar o middleware 'setor:<chave>' nas rotas dele (ver
// routes/web.php) — o menu correspondente já some da barra lateral
// automaticamente (ver HandleInertiaRequests::share() e app-sidebar.tsx).
return [
    'consultar-vendas' => [16, 21, 26],
    'ferramentas' => [16, 21, 26],
];
