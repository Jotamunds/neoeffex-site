# Catálogo único por loja — v0.2.0

Código preparado sobre a main `3511df4187890818362fc5f2a880928bedaa6d02`.
Revisão do GitHub em 09/09/2026: a main avançou para
`5b4e040116414ae7bde067d0bbc972aadbf9d447`, alterando somente arquivos da Boafont e seu documento de etapas.
Esses arquivos não fazem parte deste pacote. A referência v0.4.7 da vitrine já
está incorporada à main; não é necessário voltar a ela nem mesclar a branch antiga.

## Resultado desta versão

- Uma conta pode administrar várias lojas; cada loja tem exatamente um catálogo.
- Criar a loja pelo painel cria loja e catálogo em uma transação.
- Cada catálogo existente vira uma loja, conservando ID, dono, slug, logo, produtos e categorias.
- Categorias principais e subcategorias, com no máximo dois níveis e ordem editável.
- Um tipo opcional e até 10 grupos por produto, editados no formulário de produto.
- Busca e filtros de categoria, tipo e grupo combinados, mantendo o link e o carrinho.
- Marca N original da Neoeffex reutilizada em CSS a partir do SVG existente.

Exemplo ilustrativo de organização da Lu, sem importação automática:

| Campo | Exemplo |
| --- | --- |
| Loja | Lu Leve e Saudável |
| Link preservado | `/catalogo/?catalogo=lu-leve-e-saudavel` |
| Categoria | Marmitas |
| Subcategoria | Tradicionais ou Fitness |
| Tipo | Individual ou Combo |
| Grupo | Mais pedido |

Tipo e grupo são classificações. Não calculam desconto, peso, quantidade de
marmitas, carnes ou adicionais. Um grupo chamado “Combo” não muda o preço do item.
O carrinho continua comprando produtos de preço fixo. Variações, montagem de
marmitas e importação da planilha são etapas do plano maior ainda não implementadas.

## 1. Banco — execução manual

No projeto **Neoeffex Catalog**, abra **SQL Editor → New query**.
O diagnóstico enviado confirmou a conta da Lu e uma base com 4 catálogos,
10 categorias e 15 produtos. O catálogo principal da Lu tem 1 produto e 2 categorias.

Antes da alteração, guarde uma cópia dos dados atuais. Esta consulta é somente leitura;
salve o resultado como JSON:

```sql
select jsonb_pretty(jsonb_build_object(
  'catalogs', (select coalesce(jsonb_agg(to_jsonb(c)), '[]'::jsonb) from public.catalogs c),
  'categories', (select coalesce(jsonb_agg(to_jsonb(c)), '[]'::jsonb) from public.categories c),
  'products', (select coalesce(jsonb_agg(to_jsonb(p)), '[]'::jsonb) from public.products p)
)) as copia_antes_da_alteracao;
```

1. Execute uma única vez o conteúdo de
   `supabase/migrations/20260907235435_store_catalog_organization.sql`.
   O arquivo avulso `APLICAR_CATALOGO_UNICO_NEOEFFEX.sql` contém o mesmo SQL;
   execute apenas uma das cópias.
2. O resultado deve mostrar `ESTRUTURA_APLICADA`, 4 lojas e 4 catálogos.
   O número de produtos deve permanecer 15, salvo alterações legítimas feitas após o diagnóstico.
3. Execute `admin/setup/verify_store_catalog_organization.sql`, também entregue
   separadamente como `VERIFICAR_CATALOGO_UNICO_NEOEFFEX.sql`.
4. Todas as verificações devem ser `true`. Guarde ou envie esse JSON.

A migração executa em transação. Em caso de erro, não continue com comandos avulsos:
nenhuma mudança parcial desse arquivo é confirmada. Se `stores` já existir,
a migração aborta com mensagem de reaplicação; use a verificação antes de decidir qualquer correção.
Não execute a antiga `009_single_catalog_per_owner.sql`.

O catálogo de teste da Lu e os demais catálogos permanecem independentes.
Nenhum catálogo é apagado, pausado, transferido ou mesclado por este SQL.

## 2. Site — aplicar na main

O pacote contém os arquivos alterados nos caminhos originais e novos arquivos
compartilhados. Não é uma cópia completa do repositório. Não apague o projeto
existente para usar este pacote.

No checkout atualizado de `Jotamunds/neoeffex-site`:

1. Confira alterações locais e atualize a main sem descartar trabalho existente.
2. Compare os arquivos do pacote com a main atual. Se houve alterações nesses
   mesmos arquivos desde a base informada, incorpore os trechos, preservando as atualizações.
3. Aplique os arquivos do pacote diretamente na main, incluindo
   `assets/catalog/organization.js`. Publique Admin, catálogo público e esse módulo juntos.
4. Valide o navegador com duas contas e uma aba anônima antes de publicar.
5. Use a mensagem de commit: `v0.2.0 - organiza lojas com catálogo único e filtros`.

As logos já existem no repositório em `img/logos`. O código usa
`img/logos/neoeffex-n-logo-white.svg` como máscara, preservando o desenho e
adaptando a cor ao tema. A identidade comercial da Lu permanece nos campos atuais.

Os scripts detectam ausência das novas colunas e mantêm a leitura e edição dos
campos antigos. Isso ajuda durante a troca de arquivos; não substitui a migração.
Não publique apenas o JavaScript novo deixando HTML ou módulo compartilhado antigos.

## 3. Conferência no navegador

- Conta A vê suas lojas e não os dados administrativos da conta B.
- “Nova loja” cria uma loja com seu catálogo; o seletor permite alternar lojas.
- Criação/edição de categoria principal, subcategoria e ordem funcionam.
- Categoria principal com filhos não pode ser excluída nem virar subcategoria.
- Produto aceita tipo e grupos, preservando os demais campos e imagens.
- Categoria principal inclui produtos das subcategorias no catálogo público.
- Categoria, tipo, grupo e busca combinam; “Limpar filtros” restaura a listagem.
- Produtos de categorias diferentes entram no mesmo carrinho; total e WhatsApp conferem.
- Restaurar último carrinho continua funcionando; produtos pausados não aparecem.
- Logo da Neoeffex e marca da loja são legíveis em celular, desktop e tema escuro.
- Exclusão confirmada de uma loja pausada remove seu catálogo e dados vinculados.

## 4. Recuperação

Se a migração falhar antes do COMMIT, a transação não grava alterações.
Depois de aplicada, a recuperação preferencial é voltar **somente o frontend**
ao commit anterior, mantendo as colunas e tabelas aditivas no banco. O código antigo
continua criando lojas pelo trigger e lendo os produtos pelos mesmos IDs.
Ele exibirá subcategorias como categorias planas e não mostrará tipos/grupos.
Não derrube `stores` nem remova colunas preenchidas para reverter uma falha visual.

Transferências futuras de proprietário exigem atualizar `stores.owner_id` e
`catalogs.owner_id` na mesma transação e revisar separadamente as imagens do Storage.
Esta migração não altera o fluxo de transferência nem as políticas de Storage.

## Validação realizada

- Migração e SQL de verificação executados em PGlite 0.5.8 / PostgreSQL 18.3,
  com esquema, permissões e políticas reproduzidos do diagnóstico. Supabase alvo: PostgreSQL 17.6.
- 32 verificações de banco, incluindo criação atômica, FKs, isolamento entre contas,
  leitura pública, escrita proibida, dois níveis de categorias e exclusão pela RPC legada.
- 19 testes de DOM com JSDOM e cliente Supabase simulado para formulários, filtros e carrinho.
- Sintaxe de JavaScript e `git diff --check`.
- A verificação visual em navegador ficou bloqueada pelo download do executável.
  Não foram testados backend real, Auth, upload, deploy nem Security Advisor do projeto.

Referências técnicas: [RLS no Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security)
e [restrições do PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html).

O SQL não foi executado no Supabase remoto e os arquivos ainda não foram enviados à main.
