<?php

// Catálogo dos menus com controle de acesso por setor. A chave é o
// identificador usado no middleware ('setor:<chave>') e em app-sidebar.tsx
// (menuKey); o valor é o rótulo mostrado na tela Administrador.
//
// Isto só registra QUAIS menus existem — QUEM pode acessá-los (quais
// setores) fica no MySQL (tabela menu_setor_acessos), editável pela tela
// Administrador (setor 16/TI). Um menu sem entrada aqui não tem controle
// de acesso algum (ex.: "Baixa Produto" é liberado para todos).
//
// Escalável: pra colocar um novo menu sob controle de setor, adicione uma
// chave aqui, aplique Route::middleware('setor:<chave>') nas rotas dele,
// e marque o item correspondente em app-sidebar.tsx com menuKey: '<chave>'
// — o acesso por setor já aparece pronto pra configurar na tela Administrador.
return [
    'consultar-vendas' => 'Consultar Vendas',
    'ferramentas' => 'Ferramentas',
];
