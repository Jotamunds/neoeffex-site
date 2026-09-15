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

## v0.1.3

- Correção UI-014: consolidação dos tokens `:root` em bloco único canônico no início de `sentinela.css`.
- Correção UI-012: padronização semântica de containers (`--container-normal: 1240px;`, `--container-wide: 1440px;`, `--container-narrow: 820px;`) harmonizando eixos visuais.
- Correção UI-006: balanceamento deliberado da hierarquia de títulos H2 (Manifesto editorial, Soluções, Produto em Destaque até 64px e CTA 50px).
- Correção UI-013: remoção de estilo inline na dimensão 40 × 40 do produto em destaque e criação da classe `.product-dimension`.
- Correção UI-015: ajuste do título H3 dos diferenciais para 15px com peso 700, garantindo hierarquia sobre o texto corrido.
- Correção UI-016: restauração de badge estruturado com fundo translúcido, borda fina e blur para a legenda `.product-caption`.

## v0.1.4

- Correção UI-007: otimização do fluxo vertical do Hero mobile com gap controlado, eliminando vazio excessivo entre CTA e imagem na primeira dobra.
- Correção UI-009: adição de affordance para o carrossel mobile via indicadores de paginação interativos (`.showcase-indicator`), sincronizados via scroll touch e clique.
- Correção UI-010: remoção de borda superior na primeira linha da grelha de pilares no mobile via seletor `:nth-child(n+3)`.
- Correção UI-017: bloqueio de layout shifts com `aspect-ratio: 1 / 1` nas imagens de produtos e registro de listener de recálculo no `ScrollTrigger.refresh()`.

## v0.1.5

- Correção UI-008: preservação da visibilidade contínua da marca d'água no Manifesto, removendo inicialização em `autoAlpha: 0` e mantendo opacidade suave e estável com micro-ajuste de escala.

## v0.1.6

- Correção UI-011: refinamento da placa do logotipo no rodapé com superfície translúcida, desfoque de fundo, borda sutil e padding reduzido, integrando a marca ao rodapé escuro.

## v0.1.7

- Correção refinada UI-004: remoção do pseudo-elemento `.manifesto::after` em `display: block` com gradiente vertical que gerava faixa horizontal reta e separada abaixo dos pilares.
- O background diagonal claro → escuro do Manifesto agora estende-se como composição única e contínua até o término da seção com `padding-bottom: clamp(72px, 8vw, 120px)`.
- Implementação de transição inferior sobreposta via `.manifesto::after` com `position: absolute`, `z-index: 1`, `pointer-events: none` e gradiente radial elíptico assimétrico que conecta organicamente a zona escura à seção clara `#produto` sem corte linear perceptível ou aumento artificial de altura.
- Validação técnica e visual em 1366×768, 1440×900 e 1920×1080 com preservação integral de pilares, produtos e símbolo Sentinela.
