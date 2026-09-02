# Operação do catálogo — Etapa 10

## Estado

```text
Versão: v0.1.9.3
Bloco: guia + suporte + escopo + privacidade + catálogo demo
Base anterior validada: v0.1.9.2
Branch: neoeffex-catalog
Migration mais recente: 008_catalog_identity.sql
```

## Objetivo

A `v0.1.9.3` completa a estrutura documental planejada para a Etapa 10.

## Documentos operacionais

```text
CLIENT_ONBOARDING.md
CLIENT_TEMPLATE.md
CLIENT_SUSPENSION.md
CLIENT_OFFBOARDING.md
BACKUP_AND_ROLLBACK.md
RELEASE_CHECKLIST.md
SUPPORT_POLICY.md
SERVICE_SCOPE.md
PRIVACY_NOTICE.md
DEMO_CATALOG_CHECKLIST.md
```

## Guia do cliente

```text
docs/client/QUICK_START.md
```

---

## Fonte de verdade

| Assunto | Arquivo |
|---|---|
| Setup | `admin/setup/SETUP.md` |
| Segurança | `admin/setup/PRODUCTION-CHECKLIST.md` |
| Onboarding | `CLIENT_ONBOARDING.md` |
| Suspensão | `CLIENT_SUSPENSION.md` |
| Offboarding | `CLIENT_OFFBOARDING.md` |
| Backup | `BACKUP_AND_ROLLBACK.md` |
| Release | `RELEASE_CHECKLIST.md` |
| Suporte | `SUPPORT_POLICY.md` |
| Escopo | `SERVICE_SCOPE.md` |
| Privacidade | `PRIVACY_NOTICE.md` |
| Demo | `DEMO_CATALOG_CHECKLIST.md` |
| Guia | `../client/QUICK_START.md` |

---

## Pendências comerciais/jurídicas

```text
canal de suporte
horário
prazo de resposta
cadastro contínuo incluído ou adicional
retenção
exportação
autorização de exclusão
canal de privacidade
```

Esses itens não devem virar promessa enquanto estiverem pendentes.

---

## Catálogo demo

A especificação está pronta.

A criação efetiva deve ocorrer numa conta fictícia pelo fluxo normal do Admin.

Não foi adicionada seed/migration porque:

- não é necessário alterar schema;
- não se deve commitar número real de WhatsApp;
- o objetivo é validar o mesmo fluxo usado por clientes.

---

## Encerramento da Etapa 10

```text
documentação da Etapa 10 = concluída
validação prática para piloto = executar DEMO_CATALOG_CHECKLIST.md
```

Depois de validar o demo e resolver as pendências comerciais essenciais:

```text
CLIENTE PILOTO
```

Evitar novas funcionalidades antes de observar o uso real, salvo correção impeditiva.
