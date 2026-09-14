# Changelog — Sentinela Embalagens

## Organização estrutural

- CSS autoral extraído do `index.html` para `assets/css/sentinela.css`.
- Interações de menu/formulário movidas para `assets/js/ui.js`.
- Animações GSAP/ScrollTrigger movidas para `assets/js/animations.js`.
- Seletores JavaScript migrados de `data-od-id` para classes semânticas já existentes.
- Infraestrutura exclusiva de preview/export do Open Design removida do HTML final.
- Assets usados pela página reunidos em `assets/sentinela-v2/`.
- `DESIGN-MANIFEST.json` atualizado para refletir a estrutura real.
- `PROJECT_MAP.md` criado com mapa de seções, assets, interações e pontos seguros de edição.

Nenhuma alteração visual intencional foi feita nesta etapa.

## v0.1.1

- Estrutura organizada para uso em `modelos/sentinela-embalagens/`.
- Adicionado `VERSION` e mapa técnico do projeto.

## v0.1.2

- Correção UI-001: remoção de limitação de largura de 13ch em `.hero-copy` para telas <= 920px, restaurando botão e título sem quebras indevidas.
- Correção UI-002: reestruturação geométrica e vertical dos 4 produtos do showcase apoiados no topo elíptico dos pedestais.
- Correção UI-003: importação oficial da família tipográfica `Manrope` via Google Fonts no `<head>` do `index.html`.
- Correção UI-004: transição contínua entre Manifesto e Produto em Destaque via `.manifesto::after` com gradiente suave multicamadas.
- Correção UI-005: padronização da largura do pedestal do 3º item (Lacres) em 88% e balanceamento de escala/espaçamento do produto.

