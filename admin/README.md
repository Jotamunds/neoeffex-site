# Painel administrativo — Etapa 4

Painel de catálogo em `neoeffex.com.br/admin`, com autenticação, vários catálogos e categorias pelo Supabase.

## O que existe nesta etapa

- Login por e-mail e senha, recuperação de senha, sessão persistente e saída local.
- Vários catálogos por conta, com seletor que preserva a última escolha neste navegador.
- Criação e edição de catálogos, incluindo nome, identificador único e status ativo.
- Categorias próprias por catálogo: cadastro, edição e exclusão segura quando não há produtos vinculados.
- Produtos vinculados a uma categoria real, sem campo de texto livre.
- Cadastro, edição, pausa/ativação e exclusão confirmada de produtos.
- RLS por proprietário do catálogo, com permissão explícita apenas para usuários autenticados.

O identificador do catálogo e o status ativo ficam prontos para a futura página pública. Esta entrega mantém apenas `/admin`, sem abrir nenhum dado para visitantes anônimos.

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
    ├── 003_categories_and_multi_catalogs.sql
    └── SETUP.md
```

## Configuração

Siga `setup/SETUP.md` antes de publicar. Em `config.js`, use somente a URL do projeto e a chave publicável. Nunca adicione uma `service_role`, chave secreta ou senha de banco ao repositório.

## Próxima etapa

Página pública do catálogo usando o identificador de cada catálogo, sem expor a área administrativa.
