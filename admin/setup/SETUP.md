# Configuração da Etapa 5

## Para uma instalação já feita nas etapas anteriores

1. Confirme que a Etapa 4 e o arquivo `003_categories_and_multi_catalogs.sql` já foram aplicados.
2. No SQL Editor do projeto Supabase, execute `004_public_catalog_access.sql` inteiro.
3. Publique a pasta `/admin/` em `neoeffex.com.br/admin/`.
4. Publique a pasta `/catalogo/` em `neoeffex.com.br/catalogo/`.
5. Entre no painel, selecione um catálogo ativo e clique em **Ver catálogo**.

O arquivo `004` executa em transação e pode ser reaplicado: as políticas públicas são recriadas com as mesmas restrições.

## Para uma instalação nova

1. Crie um projeto Supabase dedicado ao catálogo.
2. No SQL Editor, execute nesta ordem:

   1. `001_initial_schema.sql`
   2. `002_seed_example.sql` depois de criar a primeira conta, se quiser iniciar com um catálogo de exemplo
   3. `003_categories_and_multi_catalogs.sql`
   4. `004_public_catalog_access.sql`

As permissões são explícitas porque tabelas novas podem não ser expostas automaticamente pela Data API. Visitantes recebem somente leitura das colunas públicas, limitada por RLS a catálogos e produtos ativos.

## Configurar autenticação

Em **Authentication > General Configuration**, desative **Allow new users to sign up** e **Allow anonymous sign-ins**. Novas contas devem ser criadas por você no Supabase.

Em **Authentication > URL Configuration**, adicione:

```text
Site URL: https://neoeffex.com.br
Redirect URL: https://neoeffex.com.br/admin/reset-password.html
```

Para testes locais, adicione também a URL usada pelo seu servidor local, por exemplo `http://127.0.0.1:5500/admin/reset-password.html`.

## Configurar o painel

Em `admin/config.js`, deixe somente a **Project URL** e a **publishable key**:

```js
window.NEOEFFEX_SUPABASE_CONFIG = Object.freeze({
    url: "https://seu-projeto.supabase.co",
    publishableKey: "sb_publishable_..."
});
```

Nunca use `service_role`, chave secreta ou senha de banco em arquivos do navegador.

Use os mesmos valores públicos em `catalogo/config.js`. Não adicione nenhum segredo à página pública.

## Testar antes de publicar

1. Entre com a conta criada e confirme que o catálogo existente aparece.
2. Abra **Categorias**, confira as categorias migradas e crie uma nova categoria.
3. Edite um produto e troque sua categoria; crie outro produto usando a nova categoria.
4. Confirme que uma categoria com produtos vinculados não pode ser excluída.
5. Crie um segundo catálogo, adicione uma categoria e um produto nele, e alterne entre os catálogos pelo seletor.
6. Edite o identificador de um catálogo e confirme que o painel alerta se ele já estiver em uso.
7. Entre com uma segunda conta e confirme que ela não consegue visualizar ou alterar nenhum catálogo, categoria ou produto da primeira.
8. Clique em **Ver catálogo** e confirme que o catálogo abre em `/catalogo/?catalogo=identificador`.
9. Pause um produto e confirme que ele desaparece da página pública após atualizar.
10. Pause o catálogo e confirme que o endereço público informa que ele está indisponível.
11. Reative o catálogo, teste a busca e os filtros por categoria.
12. Clique em **Sair** e teste a recuperação de senha.

Para produção, configure SMTP próprio antes de depender de e-mails de recuperação em volume.
