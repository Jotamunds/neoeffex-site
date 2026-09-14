# Mapa do projeto — Sentinela Embalagens

## Objetivo desta organização

O export do Open Design concentrava HTML, CSS, JavaScript do site e scripts internos de preview em `index.html`.
Esta versão separa apresentação, comportamento e animação sem alterar a estrutura visual do site.

## Estrutura

```text
modelos/sentinela-embalagens/
├── index.html
├── assets/
│   ├── css/
│   │   └── sentinela.css
│   ├── js/
│   │   ├── ui.js
│   │   └── animations.js
│   └── sentinela-v2/
│       ├── 01-etiquetas-termicas.png
│       ├── 02-etiquetas-brancas.png
│       ├── 03-etiquetas-coloridas.png
│       ├── 04-lacres-seguranca.png
│       ├── 07-logo-vertical-centralizado.png
│       ├── 09-logo-icone-sem-texto.png
│       └── 10-logo-header-horizontal.png
└── docs/
    ├── PROJECT_MAP.md
    ├── OPEN-DESIGN-HANDOFF.md
    └── DESIGN-MANIFEST.json
```

## Responsabilidade dos arquivos

### `index.html`
Somente estrutura e conteúdo semântico da página. Mantém os IDs de navegação e as classes usadas pelo CSS/JS.
Não contém mais CSS grande, JavaScript da aplicação ou infraestrutura de preview do Open Design.

### `assets/css/sentinela.css`
Fonte única dos estilos visuais atuais. Contém:
- tokens em `:root`;
- tipografia e utilitários;
- header/topbar;
- botões;
- hero;
- faixa de diferenciais;
- soluções/showcase;
- manifesto;
- produto em destaque;
- CTA e footer;
- breakpoints e `prefers-reduced-motion`.

### `assets/js/ui.js`
Interações sem animação:
- abertura/fechamento do menu mobile;
- fechamento do menu ao navegar;
- validação básica do formulário do footer;
- mensagens de feedback do formulário.

### `assets/js/animations.js`
Animações atuais com GSAP + ScrollTrigger:
- timeline de entrada do hero;
- entrada dos pedestais/produtos/textos do showcase;
- entrada do manifesto;
- entrada em stagger dos pilares;
- `[data-reveal]` genérico;
- parallax do produto do hero em desktop;
- parallax do símbolo do Sentinela em desktop.

## Documentação herdada

`OPEN-DESIGN-HANDOFF.md` é o handoff original do export e descreve o estado antes desta organização. Para a estrutura atual, use este `PROJECT_MAP.md` e `DESIGN-MANIFEST.json`.

## Dependências externas

Carregadas pelo `index.html`:
- GSAP 3.12.5 via jsDelivr;
- ScrollTrigger 3.12.5 via jsDelivr.

Não foi adicionada nenhuma nova dependência.

## Mapa das seções

| ID | Seção | Classes principais | Assets principais |
|---|---|---|---|
| `#inicio` | Hero | `.hero-immersive`, `.hero-copy`, `.hero-media` | `01-etiquetas-termicas.png`, logo/símbolo |
| — | Diferenciais | `.trust-strip`, `.trust-item` | SVGs inline |
| `#solucoes` | Showcase de soluções | `.solutions-v2`, `.showcase-list`, `.showcase-item`, `.product-pedestal` | 01, 02, 03, 04 |
| `#empresa` | Manifesto | `.manifesto`, `.manifest-copy`, `.manifest-products`, `.manifest-symbol`, `.pillars` | 01, 03, 04, 09 |
| `#produto` | Produto em destaque | `.product-showcase`, `.product-figure`, `.product-copy` | `01-etiquetas-termicas.png` |
| — | CTA final | `.cta-band` | — |
| `#contato` | Footer/contato | `.pagefoot`, `.footer-form` | logo horizontal |

## Assets — onde são usados

### `01-etiquetas-termicas.png`
Hero, showcase de térmicas, manifesto e produto em destaque.

### `02-etiquetas-brancas.png`
Showcase “Embalagens sob demanda”.

### `03-etiquetas-coloridas.png`
Showcase de coloridas e composição do manifesto.

### `04-lacres-seguranca.png`
Showcase de lacres e composição do manifesto.

### `07-logo-vertical-centralizado.png`
Aplicações institucionais onde a versão vertical é necessária.

### `09-logo-icone-sem-texto.png`
Marca d'água/símbolo visual no hero/manifesto.

### `10-logo-header-horizontal.png`
Header/footer.

## Seletores que não devem ser renomeados sem atualizar CSS/JS

- `.topnav`
- `.menu-toggle`
- `.footer-form`
- `.form-note`
- `.hero-immersive`
- `.hero-copy`
- `.hero-media`
- `.hero-cta`
- `.showcase-list`
- `.product-pedestal`
- `.showcase-visual`
- `.showcase-content`
- `.manifesto`
- `.manifest-copy`
- `.manifest-products`
- `.manifest-symbol`
- `.pillars`
- `[data-reveal]`

## O que foi removido do export

Foram removidos somente elementos de infraestrutura do Open Design que não fazem parte do site final:
- `data-od-srcdoc-transport-activation`;
- redirect guard de preview;
- sandbox shim;
- tweaks bridge;
- preview content-size bridge;
- snapshot bridge;
- export capture bridge;
- template de conclusão do transport;
- atributos `data-od-id`.

Esses trechos serviam ao preview/editor do Open Design e não às animações ou interações do site.

## O que foi preservado

- todo o CSS autoral existente;
- GSAP e ScrollTrigger;
- timelines e timings atuais;
- parallax atual;
- menu mobile;
- formulário e feedback;
- `data-reveal`;
- IDs de navegação;
- classes e estrutura das seções;
- textos e links existentes;
- breakpoints atuais.

## Fluxo recomendado para próximas alterações

1. Layout/cores/spacing: editar `assets/css/sentinela.css`.
2. Menu/formulário: editar `assets/js/ui.js`.
3. GSAP/ScrollTrigger: editar `assets/js/animations.js`.
4. Conteúdo/ordem de seções: editar `index.html`.
5. Imagens: substituir em `assets/sentinela-v2/` mantendo o nome quando possível.
6. Atualizar este mapa se surgir uma nova seção, dependência ou asset.

## Pontos de teste

Validar pelo menos:
- 360×800;
- 390×844;
- 430×932;
- 820×1180;
- 1024×768;
- 1366×768;
- 1440×900;
- 1920×1080.

Revisar especificamente:
- menu mobile;
- hero e parallax;
- pedestais do showcase;
- scroll horizontal de soluções no mobile;
- composição de três produtos no manifesto;
- gradiente contínuo do manifesto;
- entrada dos pilares;
- formulário do footer.
