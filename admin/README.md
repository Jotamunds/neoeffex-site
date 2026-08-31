# Painel administrativo — Etapa 6

Painel em `neoeffex.com.br/admin` e catálogo público em `neoeffex.com.br/catalogo/?catalogo=identificador`, usando Supabase.

## O que existe nesta etapa

- Login por e-mail e senha, recuperação de senha, sessão persistente e saída local.
- Vários catálogos por conta, com seletor que preserva a última escolha neste navegador.
- Criação e edição de catálogos, incluindo nome, identificador único e status ativo.
- Categorias próprias por catálogo: cadastro, edição e exclusão segura quando não há produtos vinculados.
- Produtos vinculados a uma categoria real, sem campo de texto livre.
- Cadastro, edição, pausa/ativação e exclusão confirmada de produtos.
- RLS por proprietário do catálogo, com permissão explícita apenas para usuários autenticados.
- Botão para abrir o catálogo público selecionado em uma nova aba.
- Página pública com busca, filtros por categoria e somente produtos ativos.
- Permissão anônima somente de leitura, limitada às colunas públicas.
- Configuração de número, ativação e instrução de pedidos por catálogo.
- Carrinho público persistido somente no navegador do visitante.
- Mensagem de pedido com itens, quantidades, subtotais e total enviada pelo WhatsApp.

Catálogos pausados e produtos pausados não aparecem para visitantes. O painel administrativo continua protegido por autenticação e pelas políticas de proprietário.

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
    ├── 004_public_catalog_access.sql
    ├── 005_whatsapp_orders.sql
    └── SETUP.md
```

A pasta pública `/catalogo/` é entregue separadamente para ser publicada na raiz do repositório.

## Configuração

Siga `setup/SETUP.md` antes de publicar. Em `config.js`, use somente a URL do projeto e a chave publicável. Nunca adicione uma `service_role`, chave secreta ou senha de banco ao repositório.

## Limite desta etapa

O pedido não é gravado no banco e não inclui pagamento on-line. O WhatsApp abre com a mensagem pronta para o responsável confirmar disponibilidade, prazo e pagamento.
