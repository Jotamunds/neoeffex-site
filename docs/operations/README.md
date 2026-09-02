# Operação do catálogo — Etapa 10

## Estado

```text
Versão: v0.1.9.2
Bloco: backup + rollback + checklist de release
Base anterior validada: v0.1.9.1
Branch de desenvolvimento: neoeffex-catalog
Migration mais recente: 008_catalog_identity.sql
```

## Objetivo desta versão

A `v0.1.9.2` formaliza como proteger e recuperar o sistema durante manutenção e atualizações globais.

Novos documentos:

```text
BACKUP_AND_ROLLBACK.md
RELEASE_CHECKLIST.md
```

---

## Documentos disponíveis

```text
CLIENT_ONBOARDING.md
CLIENT_TEMPLATE.md
CLIENT_SUSPENSION.md
CLIENT_OFFBOARDING.md
BACKUP_AND_ROLLBACK.md
RELEASE_CHECKLIST.md
```

### Próximo bloco

```text
v0.1.9.3
- QUICK_START.md
- SUPPORT_POLICY.md
- SERVICE_SCOPE.md
- PRIVACY_NOTICE.md
- DEMO_CATALOG_CHECKLIST.md
```

---

## Fonte de verdade

| Assunto | Arquivo |
|---|---|
| Configuração Supabase | `admin/setup/SETUP.md` |
| Segurança de produção | `admin/setup/PRODUCTION-CHECKLIST.md` |
| Onboarding | `docs/operations/CLIENT_ONBOARDING.md` |
| Suspensão e reativação | `docs/operations/CLIENT_SUSPENSION.md` |
| Cancelamento | `docs/operations/CLIENT_OFFBOARDING.md` |
| Backup e rollback | `docs/operations/BACKUP_AND_ROLLBACK.md` |
| Releases | `docs/operations/RELEASE_CHECKLIST.md` |
| Ficha do cliente | `docs/operations/CLIENT_TEMPLATE.md` |
| Histórico | `admin/CHANGELOG.md` |

---

## Regras adicionadas na v0.1.9.2

1. identificar commit estável antes da alteração;
2. backup de banco e backup de Storage são coisas diferentes;
3. Storage deve ser protegido separadamente antes de exclusões;
4. não restaurar banco automaticamente por erro de frontend;
5. rollback de código deve preservar histórico;
6. não reaplicar migrations em todo release;
7. não reaplicar 007 sem executar 008 depois;
8. toda publicação global precisa de smoke test;
9. não usar cliente real como ambiente primário de regressão;
10. registrar a fonte real do GitHub Pages antes de depender de rollback.

---

## Situação do deploy

O repositório possui GitHub Pages habilitado.

A branch do catálogo não contém workflow próprio de deploy.

Por isso, o procedimento exige conferir e registrar em:

```text
Settings → Pages
```

a fonte realmente publicada.

Não assumir que a branch de desenvolvimento é a fonte do site.

---

## Situação do backup

O projeto não possui automação de backup de Storage dentro do repositório.

A v0.1.9.2 documenta um processo manual seguro.

Automação só deve ser adicionada depois que o processo for validado e houver uma necessidade real.

---

## Próximo bloco

Depois de validar:

```text
v0.1.9.3
Guia do cliente + suporte + escopo + privacidade + catálogo demo
```
