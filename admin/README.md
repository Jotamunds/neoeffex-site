# Painel administrativo — v0.1.12

Painel em `neoeffex.com.br/admin` e catálogo público em `neoeffex.com.br/catalogo/?catalogo=identificador`, usando Supabase.

## O que existe nesta etapa

- Login por e-mail e senha, recuperação de senha, sessão persistente e sincronização de login/logout entre abas da mesma origem.
- Um catálogo por conta no MVP, preservando a compatibilidade de leitura de contas legadas.
- Criação e edição de catálogo, com identificador automático, edição manual sanitizada e status ativo/pausado.
- Exclusão confirmada somente para catálogo pausado, protegida por função transacional e validação de proprietário.
- Categorias próprias por catálogo: cadastro, edição e exclusão segura quando não há produtos vinculados.
- Produtos vinculados a uma categoria real, sem campo de texto livre.
- Cadastro, edição, pausa/ativação e exclusão confirmada de produtos.
- RLS por proprietário do catálogo, com permissão explícita apenas para usuários autenticados.
- Botão para abrir o catálogo público selecionado em uma nova aba.
- Página pública com busca, filtros por categoria e somente produtos ativos.
- Permissão anônima somente de leitura, limitada às colunas públicas.
- Configuração de número, ativação e instrução de pedidos por catálogo.
- Carrinho público persistido somente no navegador do visitante, limpo ao abrir o WhatsApp e com restauração do último carrinho.
- Mensagem de pedido com itens, quantidades, subtotais e total enviada pelo WhatsApp.
- Upload opcional de imagens JPEG, PNG ou WebP com limite de 5 MB.
- Prévia, substituição e remoção de imagens no formulário do produto.
- Editor de logo com autoajuste compartilhado por todas as contas.
- Supabase Storage com caminhos isolados por usuário, catálogo e produto.
- Exibição pública responsiva com fallback automático quando não há imagem.
- Migração de endurecimento que reaplica privilégios mínimos e políticas RLS com papéis explícitos.
- Auditoria SQL de leitura que verifica RLS, privilégios, políticas, bucket e função de atualização.
- Sessão persistida validada no servidor antes de liberar o painel.
- Política de Segurança de Conteúdo (CSP), referrer policy e criação segura da interface sem HTML de usuário.
- Checklist de produção, teste com duas contas e procedimento de rollback.

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
    ├── 006_product_images.sql
    ├── 007_security_hardening.sql
    ├── 008_catalog_identity.sql
    ├── 009_single_catalog_per_owner.sql
    ├── 010_delete_paused_catalog.sql
    ├── audits/
    │   └── production_security_audit.sql
    ├── PRODUCTION-CHECKLIST.md
    └── SETUP.md
```

A pasta pública `/catalogo/` é entregue separadamente para ser publicada na raiz do repositório.

## Configuração

Siga `setup/SETUP.md` e `setup/PRODUCTION-CHECKLIST.md` antes de publicar. Em `config.js`, use somente a URL do projeto e a chave publicável. Nunca adicione uma `service_role`, chave secreta ou senha de banco ao repositório.

Em uma instalação existente na v0.1.11, execute `010_delete_paused_catalog.sql` e depois `audits/production_security_audit.sql`. A versão só deve ser liberada se todas as verificações retornarem `PASS`.

## Limites atuais

O pedido não é gravado no banco e não inclui pagamento on-line. O WhatsApp abre com a mensagem pronta para o responsável confirmar disponibilidade, prazo e pagamento.

O editor otimiza o enquadramento no navegador, mas o resultado ainda deve ser conferido antes de salvar — especialmente quando o arquivo original possui margens internas incomuns.
