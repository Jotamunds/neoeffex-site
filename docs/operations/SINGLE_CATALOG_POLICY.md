# Regra de catálogo único — v0.1.11

## Regra do MVP

```text
1 conta de cliente
        ↓
1 catálogo
        ↓
N categorias
        ↓
N produtos
```

A estrutura interna continua organizada por `catalog_id`, portanto categorias,
produtos, imagens, identidade e pedidos continuam funcionando como antes.

## O que mudou no Admin

Quando a conta não possui catálogo:

- `Novo catálogo` continua disponível;
- o primeiro catálogo pode ser criado normalmente.

Quando a conta já possui um catálogo:

- o botão de criar outro é ocultado;
- uma tentativa de criação é bloqueada antes do envio;
- o catálogo existente continua editável;
- o seletor de catálogo é ocultado quando existe exatamente um catálogo.

## Compatibilidade com contas antigas

Nenhum catálogo antigo é apagado.

Se uma conta antiga já possuir mais de um catálogo:

- o Admin não permite criar novos;
- o seletor permanece visível para não perder acesso aos existentes;
- a migration 009 NÃO é aplicada até que a conta seja revisada.

## Banco de dados

Execute primeiro:

```text
admin/setup/009_single_catalog_diagnostic.sql
```

Se não retornar linhas, aplique:

```text
admin/setup/009_single_catalog_per_owner.sql
```

A migration cria:

```text
unique index catalogs_owner_id_unique_key
on public.catalogs(owner_id)
```

Isso garante a regra também no banco, e não apenas na interface.

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
