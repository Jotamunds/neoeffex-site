# Catálogo público — Etapa 9

Página pública de leitura em `neoeffex.com.br/catalogo/?catalogo=identificador`.

## Publicação

1. Publique esta pasta como `/catalogo/` na raiz do site.
2. Mantenha em `config.js` somente a URL e a chave publicável do Supabase.
3. Execute as migrações de `admin/setup/` em ordem, incluindo `007_security_hardening.sql`.
4. Execute `admin/setup/audits/production_security_audit.sql` e prossiga somente se todas as linhas retornarem `PASS`.
5. No painel, configure o WhatsApp, ative os pedidos e use **Ver catálogo** para abrir o endereço público.

O visitante consegue consultar somente catálogos ativos e produtos ativos, com imagens públicas opcionais e fallback visual. Quando os pedidos estão habilitados, ele pode montar um carrinho salvo localmente e abrir o WhatsApp com a mensagem pronta. A página não grava pedidos no banco e não possui login ou acesso à área administrativa.

Esta versão adiciona uma Política de Segurança de Conteúdo, política de referência e dependência do Supabase fixada em versão específica. Publique `/admin` e `/catalogo` sempre com o mesmo número de versão.
