# Checklist de produção — segurança do catálogo

Este documento valida os controles de segurança do sistema.

Para o processo completo de atualização global, use também:

```text
docs/operations/RELEASE_CHECKLIST.md
docs/operations/BACKUP_AND_ROLLBACK.md
```

## 1. Importante sobre migrations

Não execute migrations apenas porque existe um novo release de frontend.

A migration mais recente da base atual é:

```text
008_catalog_identity.sql
```

Para uma instalação nova:

```text
001_initial_schema.sql
002_seed_example.sql (opcional)
003_categories_and_multi_catalogs.sql
004_public_catalog_access.sql
005_whatsapp_orders.sql
006_product_images.sql
007_security_hardening.sql
008_catalog_identity.sql
```

### Regra 007 → 008

`007_security_hardening.sql` revoga e recria grants públicos com a estrutura existente naquela etapa.

`008_catalog_identity.sql` adiciona depois os grants públicos das colunas de identidade.

Se a 007 for reaplicada:

```text
007
 ↓
008
```

Não publicar depois de reaplicar somente a 007.

---

## 2. Auditoria SQL

Depois de mudança em:

- schema;
- grants;
- RLS;
- Storage policy;

execute:

```text
admin/setup/audits/production_security_audit.sql
```

Revise os resultados esperados antes da publicação.

Uma atualização exclusivamente documental não exige reaplicar migrations.

---

## 3. Authentication

### Email

```text
[ ] Allow new users to sign up desativado
[ ] Allow anonymous sign-ins desativado
[ ] Contas novas são criadas manualmente
```

### Redirect

Confirmar:

```text
Site URL:
https://neoeffex.com.br/admin/

Redirect:
https://neoeffex.com.br/admin/reset-password.html
```

Evitar curingas desnecessários em produção.

### Recuperação

```text
[ ] SMTP de produção configurado
[ ] E-mail chega
[ ] Link abre domínio correto
[ ] Nova senha funciona
[ ] Senha anterior deixa de funcionar
```

---

## 4. Conta do projeto

```text
[ ] MFA na conta Supabase
[ ] 2FA no GitHub
[ ] Security Advisor revisado
[ ] Alertas relevantes avaliados
```

---

## 5. Teste com duas contas

Obrigatório depois de mudanças em segurança, RLS, owner, Auth ou Storage.

Criar/usar:

```text
Comércio A
Comércio B
```

Confirmar:

```text
[ ] B não encontra catálogos administrativos de A
[ ] B não altera categorias de A
[ ] B não altera produtos de A
[ ] B não exclui dados de A
[ ] Imagens de B usam owner B
[ ] Logout remove a sessão
```

Se qualquer item falhar:

```text
NÃO PUBLICAR
```

---

## 6. Teste público em aba anônima

```text
[ ] Catálogo ativo aparece
[ ] Produto ativo aparece
[ ] Produto pausado não aparece
[ ] Catálogo pausado não expõe conteúdo
[ ] Visitante não possui escrita
[ ] Carrinho funciona
[ ] WhatsApp funciona
```

---

## 7. Imagens

Produtos:

```text
JPEG / PNG / WebP
limite atual: 5 MB no arquivo selecionado
```

Logo:

```text
JPEG / PNG / WebP
limite atual: 2 MB no arquivo selecionado
```

Confirmar:

```text
[ ] arquivo incompatível é bloqueado
[ ] substituir imagem funciona
[ ] remover imagem mantém fallback
[ ] editor não quebra upload
[ ] logo respeita catálogo correto
```

---

## 8. Arquivos publicados

```text
[ ] admin/VERSION = catalogo/VERSION
[ ] config.js contém somente valores públicos
[ ] biblioteca Supabase está fixada em versão específica
[ ] nenhum service_role
[ ] nenhuma secret key
[ ] nenhuma senha de banco
[ ] nenhuma credencial de cliente
[ ] /admin usa noindex/nofollow
```

---

## 9. CSP e navegador

Confirmar que alterações de dependências externas foram refletidas na CSP somente quando realmente necessárias.

Não abrir a CSP de forma genérica apenas para contornar erro.

---

## 10. Critério de segurança

A segurança está aprovada quando:

```text
[ ] Auditoria aplicável foi revisada
[ ] Isolamento entre contas funciona
[ ] Público continua somente leitura
[ ] Recuperação de senha funciona
[ ] Upload continua isolado
[ ] Nenhum segredo foi publicado
```

O release completo só é liberado depois de concluir:

```text
docs/operations/RELEASE_CHECKLIST.md
```
