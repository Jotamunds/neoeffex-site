# Catálogo público — Etapa 5

Página pública de leitura em `neoeffex.com.br/catalogo/?catalogo=identificador`.

## Publicação

1. Publique esta pasta como `/catalogo/` na raiz do site.
2. Mantenha em `config.js` somente a URL e a chave publicável do Supabase.
3. Execute `admin/setup/004_public_catalog_access.sql` no SQL Editor.
4. No painel, deixe o catálogo ativo e use **Ver catálogo** para abrir o endereço público.

O visitante consegue consultar somente catálogos ativos e produtos ativos. A página não possui login, escrita no banco ou acesso à área administrativa.
