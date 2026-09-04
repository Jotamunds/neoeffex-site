# Lu Leve e Saudável — Contexto de Desenvolvimento

Estas instruções complementam os `GEMINI.md` superiores.

Leia também `README.md`, `VERSION`, `CHANGELOG.md` e a documentação de publicação antes de mudanças relevantes.

## Projeto

Este é o site da Lu Leve e Saudável.

A implementação atual é uma landing page mobile-first estática, sem dependência de bibliotecas externas, integrada ao catálogo compartilhado da Neoeffex.

## Arquitetura atual

Preserve a separação existente:

- `index.html`: estrutura e conteúdo da página;
- `styles/main.css`: entrada principal de estilos;
- `scripts/config.js`: configurações, contatos, catálogo, promoção e movimento;
- `scripts/catalog.js`: resolução dos links do catálogo;
- `data/menu.json`: fonte editável de preços, combos e acréscimos;
- `tools/build-menu.mjs`: geração das regiões do cardápio;
- `tests/validate.mjs`: validações técnicas;
- `docs/PUBLICACAO.md`: checklist de publicação.

Não edite preços diretamente no HTML se o valor for controlado por `data/menu.json`.

Para mudanças de cardápio, preserve o fluxo:

1. editar `data/menu.json`;
2. executar `node tools/build-menu.mjs`;
3. executar `node tests/validate.mjs`;
4. executar `node tools/check-release.mjs` quando aplicável.

## Catálogo

O catálogo oficial usa o slug:

`lu-leve-e-saudavel`

A landing não deve implementar um carrinho separado.

Os CTAs principais devem continuar utilizando o mecanismo de `scripts/catalog.js`, que diferencia ambiente local e produção.

Não troque links controlados por `[data-catalog-link]` por URLs hardcoded sem necessidade.

## Identidade visual

Preserve a proposta:

- alimentação saudável;
- marmitas tradicionais e fitness;
- aparência moderna;
- foco mobile;
- comunicação prática;
- identidade própria da marca.

Não substitua logos reais por placeholders.

Não altere proporções de imagens de forma que distorça marmitas, embalagens ou textos presentes nas fotos.

## Movimento

As animações são controladas centralmente em `scripts/config.js`.

Antes de criar um novo sistema de animação, verifique os controles existentes:

- `motion.enabled`;
- `intro`;
- `cards`;
- `contact`;
- `fork`;
- `prices`;
- `reveal`;
- `smoothScroll`.

Preserve `prefers-reduced-motion`, impressão, cores forçadas e fallback estático.

## Conteúdo e publicação

Enquanto o projeto permanecer em pré-publicação, preserve `noindex` conforme a documentação atual.

Não invente ou altere sem solicitação explícita:

- preços;
- telefone;
- regiões de entrega;
- horários;
- Instagram;
- promoções;
- endereço;
- alegações comerciais.

Antes de publicar, siga `docs/PUBLICACAO.md`.

## Testes

Depois de mudanças relevantes, priorize os testes já existentes em vez de criar validações paralelas.

Uma alteração visual não deve quebrar:

- integração com catálogo;
- CTAs;
- responsividade;
- acessibilidade;
- dados do menu;
- assets;
- comportamento mobile.
