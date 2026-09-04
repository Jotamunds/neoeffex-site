# Neoeffex Catálogo Público — Regras Específicas

Estas instruções complementam o `GEMINI.md` da raiz.

## Objetivo

O catálogo público deve ser rápido, simples, mobile-first e reutilizável por diferentes clientes.

## Dados

Nunca fixe conteúdo de um cliente diretamente na lógica compartilhada se ele já puder vir do catálogo.

Identidade, categorias, produtos e configurações devem usar o catálogo correto.

## Carrinho

Mudanças no carrinho devem preservar:

- produto;
- quantidade;
- preço;
- adicionais;
- subtotal;
- total;
- mensagem final do WhatsApp.

Evite estados duplicados que possam divergir entre UI e cálculo.

## Envio pelo WhatsApp

Antes de alterar o fluxo:

1. identifique onde a mensagem é montada;
2. preserve formatação útil;
3. preserve valores calculados;
4. execute a limpeza do carrinho somente no momento correto;
5. mantenha restauração do último carrinho quando essa função fizer parte da versão atual.

Não apagar o carrinho antes de os dados necessários para o envio terem sido consolidados.

## Identidade visual

Logo e elementos do topo devem aceitar proporções diferentes.

Não crie ajuste de CSS específico para um cliente quando o problema puder ser resolvido com:

- `object-fit`;
- `max-width`;
- `max-height`;
- container flex/grid;
- limites responsivos;
- proporção preservada.

## Responsividade

Priorize smartphone, mas valide também desktop.

CTAs principais devem continuar fáceis de tocar.

Evite elementos essenciais dependentes apenas de hover.

## Performance

Evite carregar bibliotecas grandes para recursos simples.

Imagens devem respeitar dimensões, compressão e lazy loading quando apropriado.
