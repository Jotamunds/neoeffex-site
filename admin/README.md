# Painel administrativo — Etapa 1

Base estática do painel de catálogo em `neoeffex.com.br/admin`.

## O que existe nesta etapa

- Layout responsivo de painel administrativo.
- Tema claro e escuro com preferência salva no navegador.
- Produtos de demonstração em um arquivo local.
- Busca e filtro por status.
- Indicadores automáticos de produtos, ativos e categorias.
- Estrutura isolada do restante do site para evitar impacto nas landing pages existentes.

## Estrutura

```text
admin/
├── index.html
├── assets/
│   ├── css/admin.css
│   └── js/admin.js
└── data/products.js
```

## Limites intencionais

Esta versão ainda não possui login, banco de dados, cadastro, edição ou exclusão real de produtos. Nenhuma segurança deve depender desta página estática; autenticação e permissões serão implementadas junto com o backend.

## Próxima etapa

Conectar os dados a um banco de dados e criar o fluxo de autenticação do administrador, mantendo regras de acesso no servidor/banco.
