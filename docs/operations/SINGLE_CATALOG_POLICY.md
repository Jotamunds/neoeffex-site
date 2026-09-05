# Política de Catálogos — Histórico e Suporte a Múltiplos Catálogos

## Decisão Vigente (v0.1.13)

**Uma mesma conta autenticada pode possuir e gerenciar múltiplos catálogos.**

```text
1 conta de cliente
        ↓
N catálogos independentes
        ↓
N categorias por catálogo
        ↓
N produtos por categoria
```

### Comportamento no Admin:
- O botão `Novo catálogo` está sempre acessível e habilitado.
- O seletor de catálogos permanece visível e funcional para alternar entre os catálogos existentes.
- Cada catálogo possui seu próprio `id`, slug único global, categorias, produtos, horários e identidade visual.
- A alternância entre catálogos atualiza imediatamente a tela e isola as ações operacionais.

---

## Histórico: Restrição Temporária (v0.1.11)

Na versão `v0.1.11`, foi implementada temporariamente uma política operacional que limitava a interface a 1 catálogo por conta e propunha a migration `009_single_catalog_per_owner.sql` (criando o índice único `catalogs_owner_id_unique_key`).

Essa imposição foi revogada na `v0.1.13`:
1. Na interface (`admin/assets/js/catalog-identity.js`), os bloqueios em fase de captura e ocultações de botão foram removidos;
2. No banco de dados, caso a migration 009 tenha sido instalada, a migration `011_remove_single_catalog_per_owner.sql` deve ser aplicada para remover o índice único e recriar o índice regular não único em `owner_id`.

## Banco de dados

Para ambientes que aplicaram a migration 009:

```text
admin/setup/011_remove_single_catalog_per_owner.sql
```

A migration executa:

```sql
alter table if exists public.catalogs drop constraint if exists catalogs_owner_id_unique_key;
drop index if exists public.catalogs_owner_id_unique_key;
create index if not exists catalogs_owner_id_idx on public.catalogs (owner_id);
```

## Slug/endereço já utilizado

`catalogs.slug` continua globalmente único.

Ao tentar usar um endereço existente, o formulário continua mostrando o erro e a
v0.1.11 também mostra a mesma mensagem como toast para ficar imediatamente visível.

O catálogo existente nunca é reutilizado ou associado automaticamente a outra conta.

## O que não mudou

- RLS;
- autenticação;
- produtos;
- categorias;
- carrinho público;
- WhatsApp;
- Storage;
- identidade;
- tema da Lu;
- URLs públicas existentes.
