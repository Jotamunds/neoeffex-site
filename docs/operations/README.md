# Operação do catálogo — Etapa 10

## Estado

```text
Versão: v0.1.9
Bloco: onboarding + estrutura operacional
Base estável inspecionada: v0.1.8.3
Branch: neoeffex-catalog
Migration mais recente: 008_catalog_identity.sql
```

## Objetivo desta versão

A `v0.1.9` inicia a Etapa 10 sem criar um superadmin.

O foco é transformar o cadastro de um novo comércio em um processo:

- repetível;
- verificável;
- seguro;
- simples;
- documentado.

## Documentos disponíveis

### Nesta versão

```text
CLIENT_ONBOARDING.md
CLIENT_TEMPLATE.md
```

### Planejados para os próximos blocos

```text
v0.1.9.1
- CLIENT_SUSPENSION.md
- CLIENT_OFFBOARDING.md

v0.1.9.2
- BACKUP_AND_ROLLBACK.md
- RELEASE_CHECKLIST.md

v0.1.9.3
- QUICK_START.md
- SUPPORT_POLICY.md
- SERVICE_SCOPE.md
- PRIVACY_NOTICE.md
- DEMO_CATALOG_CHECKLIST.md
```

Não criar documentos duplicados antes de chegar ao bloco correspondente.

---

## Regras operacionais

1. não guardar senha de cliente;
2. não colocar segredo em documentação;
3. manter cadastro público desativado;
4. usar uma conta distinta para cada comércio;
5. validar o proprietário correto antes de criar conteúdo;
6. não usar cliente real como ambiente de regressão;
7. não ativar catálogo incompleto;
8. testar o WhatsApp antes da entrega;
9. testar em aba anônima;
10. preservar RLS e políticas de Storage.

---

## Resultado da inspeção da v0.1.9

Antes desta versão:

- `docs/` continha documentação de design, mas não onboarding operacional;
- o catálogo estava em `0.1.8.3`;
- a branch usada para o catálogo era `neoeffex-catalog`;
- novas contas já estavam definidas para criação manual no Supabase;
- a pausa de catálogo já existia e não exige exclusão;
- a migration 008 já era a migration mais recente;
- o README da raiz ainda descrevia o painel como se login e banco não existissem;
- o SETUP ainda estava centrado na versão 0.1.7 e não listava a migration 008 em instalação nova.

Essas duas documentações foram atualizadas na `v0.1.9`.

### Observação de deploy

Não há workflow de publicação dentro de `.github/` nesta branch.

O repositório possui arquivos estáticos e `CNAME`, mas o mecanismo exato de publicação/rollback não está documentado aqui.

A formalização de deploy, backup e rollback fica para `v0.1.9.2`.

Não assumir um mecanismo de deploy que ainda não esteja documentado.

---

## Fonte de verdade

| Assunto | Arquivo |
|---|---|
| Configuração Supabase | `admin/setup/SETUP.md` |
| Segurança de produção | `admin/setup/PRODUCTION-CHECKLIST.md` |
| Onboarding | `docs/operations/CLIENT_ONBOARDING.md` |
| Ficha do cliente | `docs/operations/CLIENT_TEMPLATE.md` |
| Histórico do catálogo | `admin/CHANGELOG.md` |
| Versão do Admin | `admin/VERSION` |
| Versão pública | `catalogo/VERSION` |

---

## Próximo bloco

Depois de validar esta versão:

```text
v0.1.9.1
Suspensão + reativação + offboarding
```
