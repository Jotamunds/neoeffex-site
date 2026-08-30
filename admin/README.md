# Painel administrativo — Etapa 2

Painel de catálogo em `neoeffex.com.br/admin`, com autenticação e leitura de dados pelo Supabase.

## O que existe nesta etapa

- Login por e-mail e senha.
- Recuperação e troca de senha.
- Sessão persistente e botão de sair.
- Catálogo e produtos carregados do banco de dados.
- Regras de acesso por proprietário do catálogo (RLS).
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

Cadastro, edição, pausa e exclusão de produtos conectados ao banco.
