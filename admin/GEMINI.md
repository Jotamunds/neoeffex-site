# Neoeffex Admin — Regras Específicas

Estas instruções complementam o `GEMINI.md` da raiz.

## Prioridade

O `/admin` é uma área sensível porque controla dados e configuração de clientes.

Antes de alterar:

1. localize o fluxo atual;
2. verifique dependências com Supabase;
3. entenda o relacionamento entre conta, catálogo, categoria e produto;
4. preserve dados existentes;
5. evite qualquer solução específica para um cliente.

## Múltiplos catálogos

Uma conta pode possuir vários catálogos.

Nunca use lógica equivalente a:

- "pegar o primeiro catálogo";
- "assumir apenas um catálogo";
- hardcode de slug;
- hardcode de nome de cliente.

Sempre use o catálogo atualmente selecionado ou o identificador correto do fluxo.

## Supabase

Ao alterar consultas:

- preserve filtros de proprietário/conta/catalog_id existentes;
- não aumente o acesso a dados de outros clientes;
- mantenha compatibilidade com RLS quando utilizada;
- não exponha chaves privadas;
- não substitua o modelo de dados sem necessidade.

Se uma alteração exigir SQL/migration, explique claramente a necessidade e mantenha-a idempotente ou segura quando possível.

## Identidade do catálogo

Campos como nome, slug, logo, descrição e configurações devem ser genéricos.

Ao gerar slug a partir do nome:

- normalizar para minúsculas;
- remover acentos;
- substituir espaços por hífens;
- remover caracteres inadequados;
- evitar hífens duplicados;
- não sobrescrever uma decisão manual do usuário de maneira inesperada.

## Modais e overlays

Ao corrigir fechamento por clique externo:

- diferencie corretamente interação dentro do conteúdo de interação realmente iniciada fora;
- considere `pointerdown`/`mousedown` e `pointerup`/`click`;
- não prejudique touch/mobile;
- não bloqueie fechamento legítimo pelo backdrop ou botão.

## Sessão entre abas

Quando houver sincronização de login/logout:

- prefira o mecanismo oficial da biblioteca de autenticação;
- quando necessário, use eventos apropriados entre abas;
- evite polling constante;
- garanta que logout em uma aba não deixe outra exibindo dados como se ainda estivesse autenticada.

## Exclusão

Para exclusão de catálogo ou outro dado importante:

- peça confirmação;
- confira dependências;
- evite deixar registros órfãos;
- preserve o comportamento esperado de catálogos ativos/pausados.

## UI

Correções de logo, botões, espaçamentos e cards devem funcionar para todos os clientes.

Não use seletores específicos como solução permanente para apenas um slug.
