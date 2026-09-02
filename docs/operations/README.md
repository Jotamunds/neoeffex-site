# Operação do catálogo — Etapa 10

## Estado

```text
Versão: v0.1.9.1
Bloco: suspensão + reativação + offboarding
Base anterior validada: v0.1.9
Branch: neoeffex-catalog
Migration mais recente: 008_catalog_identity.sql
```

## Objetivo desta versão

A `v0.1.9.1` formaliza o ciclo de vida do cliente depois do onboarding:

```text
Ativo
  ↓
Suspenso
  ↓
Reativado

ou

Ativo
  ↓
Cancelamento
  ↓
Retenção
  ↓
Offboarding
```

Suspensão não exclui dados.

Cancelamento não significa exclusão imediata.

---

## Documentos disponíveis

```text
CLIENT_ONBOARDING.md
CLIENT_TEMPLATE.md
CLIENT_SUSPENSION.md
CLIENT_OFFBOARDING.md
```

### Próximos blocos

```text
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

---

## Regras operacionais

1. não guardar senha de cliente;
2. não colocar segredo em documentação;
3. manter cadastro público desativado;
4. usar uma conta distinta para cada comércio;
5. validar o proprietário antes de alterar conteúdo;
6. suspensão deve usar a pausa do catálogo;
7. suspensão não deve excluir usuário ou dados;
8. reativação deve reutilizar os mesmos dados;
9. cancelamento começa pela pausa;
10. exclusão definitiva exige autorização e retenção;
11. cancelamento de um catálogo não autoriza excluir a conta inteira;
12. tratar banco e Storage separadamente no offboarding;
13. preservar RLS e políticas de Storage.

---

## Fonte de verdade

| Assunto | Arquivo |
|---|---|
| Configuração Supabase | `admin/setup/SETUP.md` |
| Segurança de produção | `admin/setup/PRODUCTION-CHECKLIST.md` |
| Onboarding | `docs/operations/CLIENT_ONBOARDING.md` |
| Suspensão e reativação | `docs/operations/CLIENT_SUSPENSION.md` |
| Cancelamento | `docs/operations/CLIENT_OFFBOARDING.md` |
| Ficha do cliente | `docs/operations/CLIENT_TEMPLATE.md` |
| Histórico do catálogo | `admin/CHANGELOG.md` |
| Versão do Admin | `admin/VERSION` |
| Versão pública | `catalogo/VERSION` |

---

## Decisões comerciais ainda pendentes

A `v0.1.9.1` não inventa valores para:

```text
prazo de retenção
prazo para exportação
responsável pela autorização final
prazo de resposta
forma oficial de encerramento
```

Esses itens permanecem:

```text
PENDENTE DE DEFINIÇÃO COMERCIAL
```

até existir decisão real.

---

## Próximo bloco

Depois de validar:

```text
v0.1.9.2
Backup + rollback + checklist de release
```
