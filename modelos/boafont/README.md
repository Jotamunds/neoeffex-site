# Boafont — modelo Neoeffex

Landing page adaptada do export do Open Design para publicação em:

`https://neoeffex.com.br/modelos/boafont/`

## Estrutura

- `index.html`: entrada da rota;
- `assets/css/boafont.css`: estilos e motion layer;
- `assets/js/boafont.js`: menu, CTAs, reveals e parallax leve;
- `assets/img/`: imagens exclusivas da Boafont;
- `VERSION` / `CHANGELOG.md`: versionamento local do modelo.

## Pendência do export Open Design

O ZIP original não incluiu os quatro assets fotográficos usados pelo HTML. Para manter a fidelidade visual, adicione:

- `assets/img/hero.png` — corresponde a `../../image.png`;
- `assets/img/van.png` — corresponde a `../../image-1.png`;
- `assets/img/stock.png` — corresponde a `../../image-2.png`;
- `assets/img/facade.png` — corresponde a `../../image-3.png`.

Não substituir por crops das screenshots de referência: isso reduz qualidade e pode duplicar textos/overlays.

## Configuração dos CTAs

No início de `assets/js/boafont.js`, preencher `BOAFONT_CONFIG.catalogUrl` e `BOAFONT_CONFIG.contactUrl` quando os canais oficiais forem definidos.

## Animações

As animações originais foram mantidas e ampliadas com:

- entrada do header;
- entrada escalonada do hero;
- movimento orgânico da água;
- zoom/parallax sutil do hero;
- reveals direcionais nas seções;
- flutuação dos elementos de água;
- profundidade leve na composição fotográfica;
- microinterações de links e CTAs;
- header translúcido ao rolar.

Tudo respeita `prefers-reduced-motion`.
