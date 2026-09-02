# Neoeffex

Site institucional e sistema de catálogo digital da Neoeffex.

## Estrutura principal

- `index.html` e arquivos da raiz — landing page principal.
- `admin/` — painel administrativo do sistema de catálogos.
- `catalogo/` — catálogo público acessado por slug.
- `admin/setup/` — migrations, auditoria e configuração do Supabase.
- `docs/` — documentação do projeto.
- `docs/operations/` — procedimentos operacionais para clientes.

## Sistema de catálogo

O catálogo atual possui:

- autenticação por e-mail e senha;
- recuperação de senha;
- múltiplos catálogos por conta;
- categorias e produtos;
- preços, descrições e imagens;
- editor simples de imagens;
- identidade do comércio;
- logo, descrição, região/endereço, horário e forma de atendimento;
- catálogo público sem login;
- busca e filtros;
- carrinho;
- envio do pedido para o WhatsApp.

A versão operacional do catálogo é registrada separadamente em:

```text
admin/VERSION
catalogo/VERSION
```

O `VERSION` da raiz pertence à landing page principal e não deve ser usado para versionar o catálogo.

## Configuração

Para configurar ou revisar o Supabase, use:

```text
admin/setup/SETUP.md
```

As migrations do catálogo devem ser aplicadas na ordem documentada.

A migration mais recente antes da versão `0.1.9` é:

```text
admin/setup/008_catalog_identity.sql
```

A `v0.1.9` não adiciona migration.

## Operação de clientes

O processo oficial de cadastro dos primeiros clientes começa em:

```text
docs/operations/CLIENT_ONBOARDING.md
```

A ficha operacional reutilizável está em:

```text
docs/operations/CLIENT_TEMPLATE.md
```

O índice da Etapa 10 está em:

```text
docs/operations/README.md
```

## Executar localmente

Use um servidor HTTP local, como Live Server no VS Code, e abra:

```text
/admin/
/catalogo/?catalogo=slug-do-catalogo
```

Evite testar fluxos de autenticação, Storage e redirects abrindo os arquivos somente por `file://`.

## Segurança

Nunca coloque no repositório:

- senha de cliente;
- senha de banco;
- chave secreta;
- `service_role`;
- token privado;
- código de recuperação.

Os arquivos `admin/config.js` e `catalogo/config.js` devem conter somente valores públicos necessários ao navegador.

Antes de atender clientes, siga também o checklist de produção existente em:

```text
admin/setup/PRODUCTION-CHECKLIST.md
```
