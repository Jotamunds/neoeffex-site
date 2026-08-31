# Catálogo público — Etapa 6

Página pública de leitura em `neoeffex.com.br/catalogo/?catalogo=identificador`.

## Publicação

1. Publique esta pasta como `/catalogo/` na raiz do site.
2. Mantenha em `config.js` somente a URL e a chave publicável do Supabase.
3. Execute `admin/setup/004_public_catalog_access.sql` e depois `admin/setup/005_whatsapp_orders.sql` no SQL Editor.
4. No painel, configure o WhatsApp, ative os pedidos e use **Ver catálogo** para abrir o endereço público.

O visitante consegue consultar somente catálogos ativos e produtos ativos. Quando os pedidos estão habilitados, ele pode montar um carrinho salvo localmente e abrir o WhatsApp com a mensagem pronta. A página não grava pedidos no banco e não possui login ou acesso à área administrativa.
