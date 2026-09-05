# Configuração do catálogo Neoeffex

Este documento descreve a ordem técnica atual para preparar o Supabase usado por `/admin/` e `/catalogo/`.

## Versão de referência

```text
Catálogo: 0.1.13
Migrations mais recentes:
  - 011_remove_single_catalog_per_owner.sql
  - 012_enforce_paused_catalog_delete_policy.sql
```

A `v0.1.13` consolida o suporte a múltiplos catálogos por conta e alinha a política RLS de exclusão direta de catálogos para exigir estado pausado.

---

## 1. Instalação já existente

Se o projeto já chegou à `v0.1.12`:

1. aplique `011_remove_single_catalog_per_owner.sql` (remove índice único de owner_id);
2. aplique `012_enforce_paused_catalog_delete_policy.sql` (alinha RLS de exclusão ao estado pausado);
3. execute `audits/production_security_audit.sql`;
4. confirme que `admin/VERSION` e `catalogo/VERSION` estão em `0.1.13`.

### Atenção à ordem 007 → 008

`007_security_hardening.sql` revoga e recria os privilégios públicos das tabelas.

`008_catalog_identity.sql` adiciona depois as permissões públicas das novas colunas de identidade.

Portanto:

```text
007_security_hardening.sql
        ↓
008_catalog_identity.sql
```

Se por qualquer motivo a `007` for reaplicada em um banco que já possui a `008`, **reaplique a `008` em seguida** antes de validar ou publicar o catálogo.

Não use a ordem inversa.

---

## 2. Instalação nova

Crie um projeto Supabase dedicado ao catálogo.

No SQL Editor, aplique as migrations nesta ordem:

```text
001_initial_schema.sql
002_seed_example.sql           (opcional, depois de criar a primeira conta)
003_categories_and_multi_catalogs.sql
004_public_catalog_access.sql
005_whatsapp_orders.sql
006_product_images.sql
007_security_hardening.sql
008_catalog_identity.sql
010_delete_paused_catalog.sql
011_remove_single_catalog_per_owner.sql
012_enforce_paused_catalog_delete_policy.sql
```

*(Nota: em instalações novas, a migration 009 foi superada pela 011 e não deve ser aplicada).*

Depois:

1. execute `audits/production_security_audit.sql`;
2. confirme os resultados esperados da auditoria;
3. execute os testes de `PRODUCTION-CHECKLIST.md`;
4. teste identidade, logo e exclusão de catálogo pausado;
5. somente então inicie o onboarding de um cliente.

---

## 3. Configurar autenticação

No Supabase, mantenha o cadastro público fechado.

### Authentication → Sign In / Providers → Email

- desative **Allow new users to sign up**;
- mantenha **Allow anonymous sign-ins** desativado;
- novas contas de clientes devem ser criadas manualmente pela operação da Neoeffex;
- prefira convite/confirmação de e-mail para o primeiro acesso;
- não armazene senhas de clientes em documentos, planilhas ou no repositório.

### Authentication → URL Configuration

Use os endereços oficiais:

```text
Site URL:
https://neoeffex.com.br/admin/

Redirect URL:
https://neoeffex.com.br/admin/reset-password.html
```

Para desenvolvimento local, adicione somente os redirects exatos usados pelo servidor local.

Exemplo:

```text
http://127.0.0.1:5500/admin/reset-password.html
```

Evite curingas em produção.

### E-mails

Antes de tratar recuperação de senha como fluxo de produção:

- configure SMTP próprio;
- teste o recebimento;
- teste o link no domínio oficial;
- confirme que a redefinição realmente invalida a senha anterior.

---

## 4. Configurar os arquivos públicos

`admin/config.js` e `catalogo/config.js` devem usar somente:

```js
window.NEOEFFEX_SUPABASE_CONFIG = Object.freeze({
    url: "https://SEU-PROJETO.supabase.co",
    publishableKey: "SUA_CHAVE_PUBLICAVEL"
});
```

Nunca coloque nesses arquivos:

```text
service_role
secret key
senha de banco
token privado
senha de cliente
```

---

## 5. Teste mínimo da instalação

Antes do onboarding:

```text
[ ] Login funciona
[ ] Login ou logout em uma aba atualiza outra aba do mesmo Admin
[ ] Recuperação de senha funciona
[ ] Conta A não acessa dados da Conta B
[ ] Criar catálogo funciona
[ ] Pausar catálogo retira o catálogo do público
[ ] Reativar catálogo funciona
[ ] Catálogo ativo não oferece exclusão
[ ] Catálogo pausado exige confirmação e pode ser excluído
[ ] Identificador acompanha o nome e sanitiza edição manual
[ ] Categorias funcionam
[ ] Produtos funcionam
[ ] Produto sem imagem usa fallback
[ ] Upload de produto funciona
[ ] Identidade do comércio funciona
[ ] Logo funciona
[ ] Logo fica centralizada também em uma segunda conta
[ ] Busca pública funciona
[ ] Filtros funcionam
[ ] Carrinho funciona
[ ] Total está correto
[ ] WhatsApp abre com o número correto
[ ] Abrir o WhatsApp limpa o carrinho
[ ] Último carrinho pode ser restaurado
[ ] Aba anônima consegue ler somente o conteúdo público
```

---

## 6. Onboarding

Depois que a instalação estiver validada, siga:

```text
docs/operations/CLIENT_ONBOARDING.md
```

Não crie atalhos que enfraqueçam RLS, Storage ou autenticação apenas para facilitar o cadastro de clientes.
