# Painel administrativo — Etapa 3

Painel de catálogo em `neoeffex.com.br/admin`, com autenticação e gestão de produtos pelo Supabase.

## O que existe nesta etapa

- Login por e-mail e senha.
- Recuperação e troca de senha.
- Sessão persistente e botão de sair.
- Catálogo e produtos carregados do banco de dados.
- Regras de acesso por proprietário do catálogo (RLS).
- Cadastro, edição, pausa/ativação e exclusão confirmada de produtos.
- Tema claro e escuro, busca e filtro de produtos.

## Estrutura

```text
admin/
├── index.html
├── reset-password.html
├── config.js
├── assets/
│   ├── css/admin.css
│   └── js/
│       ├── admin.js
│       └── reset-password.js
└── setup/
    ├── 001_initial_schema.sql
    ├── 002_seed_example.sql
    └── SETUP.md
```

## Configuração

Siga `setup/SETUP.md` antes de publicar. Em `config.js`, use somente a URL do projeto e a chave publicável. Nunca adicione uma `service_role`, chave secreta ou senha de banco ao repositório.

## Próxima etapa

Gestão de categorias, vários catálogos por usuário e preparação do catálogo público.
