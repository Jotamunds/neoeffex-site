# Boafont — modelo Neoeffex

Landing page adaptada do export do Open Design para publicação em:

`https://neoeffex.com.br/modelos/boafont/`

## Estrutura

- `index.html`: entrada da rota;
- `assets/css/boafont.css`: estilos e motion layer;
- `assets/js/boafont.js`: menu, CTAs, reveals e parallax leve;
- `assets/img/`: imagens exclusivas da Boafont;
- `VERSION` / `CHANGELOG.md`: versionamento local do modelo.

## Assets fotográficos adicionados

Foram integrados os quatro arquivos reais enviados para a Boafont:

- `assets/img/hero.png` — foto principal usada no hero;
- `assets/img/van.png` — veículo identificado da Boafont;
- `assets/img/stock.png` — estoque de galões;
- `assets/img/facade.png` — fachada ampla da unidade.

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
