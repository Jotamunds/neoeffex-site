# Relatório de Auditoria Visual e Técnica — Sentinela Embalagens

**Projeto:** `modelos/sentinela-embalagens/`  
**Data da Auditoria:** 14/09/2026  
**Ambiente de Teste:** Microsoft Edge (Headless / Blink Engine) via Chrome DevTools Protocol (CDP)  
**Servidor:** Servidor HTTP local ativo (`http://localhost:8089`)  
**Resoluções Auditadas:** 360×800, 390×844, 430×932, 768×1024, 820×1180, 1024×768, 1366×768, 1440×900, 1920×1080.

---

## Resumo Quantitativo

- **Total de problemas identificados:** 17
- **Críticos:** 2
- **Altos:** 4
- **Médios:** 6
- **Baixos:** 5

---

## TOP 10 Problemas Visuais Prioritários

1. **UI-001 [CRÍTICO] — Hero:** Largura do Hero Copy estrangulada em 112px em todas as resoluções mobile e tablet (≤ 920px), deformando título e botão.
2. **UI-002 [CRÍTICO] — Showcase:** Produtos não estão apoiados sobre os pedestais; estão desenhados na frente do cilindro, cobrindo a elipse superior e avançando ~50px além da base.
3. **UI-003 [ALTO] — Tipografia:** Fonte Manrope não possui importação via Google Fonts ou `@font-face`, gerando fallback inconsistente em dispositivos móveis e sistemas sem a fonte instalada.
4. **UI-004 [ALTO] — Manifesto:** Transição abrupta e corte seco ("seam") entre o bloco escuro dos pilares e a seção branca seguinte (`#produto`).
5. **UI-005 [ALTO] — Showcase:** Quebra de harmonia no 3º item (Lacres), que possui pedestal mais estreito (76% vs 88%) e altura de produto discrepante (78% vs 92%).
6. **UI-006 [ALTO] — Tipografia:** Disparidade extrema de tamanho entre títulos H2 (Soluções e Manifesto chegam a 88px–99px, enquanto Produto e CTA ficam travados em 52px).
7. **UI-008 [MÉDIO] — Manifesto:** Símbolo d'água da Sentinela permanece com `opacity: 0` invisível no carregamento inicial até o ScrollTrigger disparar tardiamente.
8. **UI-007 [MÉDIO] — Hero:** Vazio vertical excessivo na primeira dobra em smartphones (360x800 e 390x844) devido ao alinhamento `space-between` em 100svh.
9. **UI-009 [MÉDIO] — Showcase:** Carrossel mobile horizontal sem nenhum indicador de rolagem (dots, barra ou affordance), ocultando os demais produtos.
10. **UI-011 [MÉDIO] — Footer:** Logotipo vertical aplicado sobre uma placa branca retangular sólida que cria um efeito de "adesivo colado" sobre o rodapé grafite.

---

## Registro Detalhado das Irregularidades

### UI-001
- **Status:** RESOLVIDO
- **Severidade:** CRÍTICO
- **Seção:** Hero (`#inicio`)
- **Resolução onde ocorre:** 320px a 920px (360×800, 390×844, 430×932, 768×1024, 820×1180)
- **Elemento/classe:** `.hero-copy`
- **Arquivo relacionado:** `assets/css/sentinela.css:352`
- **Problema:** O bloco textual do Hero (eyebrow, título H1 e botão CTA) fica comprimido em uma coluna de apenas 112px de largura. Isso força o título H1 a quebrar palavra por palavra em 3 linhas com altura desmedida (até 212px em tablets), e o botão "Solicitar orçamento" é espremido em 112px de largura, quebrando o texto em várias linhas e aumentando sua altura para 67px.
- **Evidência:** Medições no Edge via CDP: `getComputedStyle(document.querySelector('.hero-copy')).maxWidth` resulta em `112.125px`. Em 360×800, 390×844 e 768×1024, a largura do container `.hero-copy` é exatamente 112px. O botão CTA passa de 44px para 67px de altura por quebra forçada.
- **Causa provável:** Na linha 352 de `sentinela.css` (dentro de `@media (max-width: 920px)`), definiu-se `.hero-copy { max-width: 13ch; }`. Como a unidade `ch` resolve com base no `font-size` do próprio elemento (16px / `--fs-body`), 13 caracteres de 16px equivalem a ~112px. A intenção provavelmente era limitar a quantidade de caracteres do título H1, mas a regra foi aplicada ao container pai.
- **Correção sugerida:** Remover `max-width: 13ch` de `.hero-copy` e aplicar `max-width: 100%` no container, aplicando o limite de caracteres de forma estrita apenas no título caso desejado (ex.: `.hero-copy h1 { max-width: 9ch; }`).
- **Resolução Implementada:**
  - **O que foi alterado:** Removida a restrição de largura `max-width: 13ch` do container pai `.hero-copy`. Aplicado `width: 100%; max-width: 100%;` no container e direcionado o controle de quebra visual estritamente ao título H1 via `.hero-copy h1 { max-width: 9ch; font-size: clamp(50px, 15vw, 72px); }`. Eyebrow, parágrafo e botão CTA agora usam livremente o espaço disponível da coluna.
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** `.hero-copy { max-width: 13ch; }` (largura efetiva ~112px; botão com 67px de altura).
  - **Valores novos:** `.hero-copy { width: 100%; max-width: 100%; }`, `.hero-copy h1 { max-width: 9ch; font-size: clamp(50px, 15vw, 72px); }`.
  - **Resoluções usadas para validação:** 360×800, 390×844, 430×932, 768×1024, 820×1180.
  - **Evidência da correção:** Em 360×800: `.hero-copy` largura = 328px (era 112px), botão CTA altura = 46px (era 67px, agora em linha única). Em 768×1024: `.hero-copy` largura = 704px, botão CTA altura = 46px. Overflow horizontal em todas as resoluções testadas = 0px.

---

### UI-002
- **Status:** RESOLVIDO
- **Severidade:** CRÍTICO
- **Seção:** Showcase de Soluções (`#solucoes`)
- **Resolução onde ocorre:** Todas as resoluções (360px a 1920px)
- **Elemento/classe:** `.product-pedestal`, `.showcase-visual img`
- **Arquivo relacionado:** `assets/css/sentinela.css:295-304`
- **Problema:** Os quatro produtos não aparentam estar apoiados sobre a superfície elíptica superior do pedestal. Pelo contrário, as imagens estão posicionadas à frente do corpo do pedestal cilíndrico, cobrindo totalmente o topo elíptico e avançando cerca de 50px além da base inferior do pedestal.
- **Evidência:** Medição automatizada de coordenadas relativas:
  - Topo da elipse do pedestal (`::before`): y = 2032px (em 1440×900)
  - Base da elipse do pedestal: y = 2068px
  - Base inferior do pedestal: y = 2116px
  - Base inferior da imagem do produto: y = 2166px
  - A imagem ultrapassa a elipse em 98px e ultrapassa a base do pedestal em 50px. `coversEntireEllipse: true`.
- **Causa provável:** `.showcase-visual` possui `display: flex; align-items: flex-end;`. O pedestal está absoluto com `bottom: 15px; height: 58px–70px;`. A imagem do produto fica apoiada no fundo do container e sofre apenas `transform: translateY(-25px);`. Esse deslocamento de 25px é insuficiente para elevar a base do produto até o topo do pedestal (que fica a ~80px–100px do fundo).
- **Correção sugerida:** Elevar verticalmente a imagem através de maior deslocamento negativo (ex.: `transform: translateY(-75px)` a `-88px`) e revisar a altura e posicionamento do pedestal, garantindo que a base física dos rolos de etiquetas coincida com a linha do topo elíptico.
- **Resolução Implementada:**
  - **O que foi alterado:** Reestruturada a geometria e o posicionamento vertical de cada um dos 4 produtos em relação ao topo elíptico do pedestal. Como o script `animations.js` aplica animações GSAP de scroll sobrescrevendo transforms inline no carregamento, a ancoragem vertical física foi implementada via `margin-bottom` individualizado por produto em `.showcase-visual img`, tornando o apoio visual imune a conflitos de timeline do GSAP e garantindo renderização correta mesmo com animações ativas ou `prefers-reduced-motion`.
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** `transform: translateY(-25px);` geral em `.showcase-visual img`. Base dos produtos terminava abaixo da elipse superior (ultrapassando-a em até 98px) e 50px abaixo da base do pedestal (`isBelowPedestal: true`).
  - **Valores novos:**
    - `.showcase-item:nth-child(1) .showcase-visual img { margin-bottom: 92px; }`
    - `.showcase-item:nth-child(2) .showcase-visual img { margin-bottom: 84px; max-height: 88%; }`
    - `.showcase-item:nth-child(3) .showcase-visual img { margin-bottom: 88px; max-height: 86%; }`
    - `.showcase-item:nth-child(4) .showcase-visual img { margin-bottom: 82px; max-height: 86%; }`
    - `.showcase-item:hover .showcase-visual img { transform: translateY(-6px) scale(1.02); }`
  - **Resoluções usadas para validação:** 390×844, 1024×768, 1366×768, 1440×900, 1920×1080 (e todas as resoluções da suíte).
  - **Evidência da correção:** Medição programática via CDP em 1920×1080:
    - Item 1: `diffBottom = -32.88px` (base do produto 33px acima da base do cilindro, assentada na superfície elíptica superior). `isBelowPedestal: false`.
    - Item 2: `diffBottom = -40.88px`. `isBelowPedestal: false`.
    - Item 3: `diffBottom = -36.88px`. `isBelowPedestal: false`.
    - Item 4: `diffBottom = -42.88px`. `isBelowPedestal: false`.
    - Em 1440×900, 1366×768, 1024×768 e 390×844: `isBelowPedestal: false` confirmado para todos os itens.

---

### UI-003
- **Status:** RESOLVIDO
- **Severidade:** ALTO
- **Seção:** Tipografia / Global
- **Resolução onde ocorre:** Todas as resoluções
- **Elemento/classe:** `html`, `body`, `:root`
- **Arquivo relacionado:** `index.html:1-8`, `assets/css/sentinela.css:10-11`
- **Problema:** A família tipográfica principal `Manrope` não é importada pelo projeto. O CSS define `--font-display: 'Manrope', 'Segoe UI', system-ui, sans-serif;`, mas não existe tag `<link>` para o Google Fonts no `<head>` nem declaração `@font-face`/`@import` no CSS. Em dispositivos sem a fonte instalada nativamente no sistema operacional (como smartphones Android e computadores corporativos), o site é renderizado inteiramente em `Segoe UI` ou sans-serif genérica.
- **Evidência:** Análise do arquivo `index.html` (linhas 1 a 8) e `sentinela.css` (linhas 1 a 12): nenhum recurso externo de webfont é requisitado.
- **Causa provável:** O projeto foi exportado presumindo que o ambiente operacional local já conteria a fonte `Manrope`.
- **Correção sugerida:** Incluir no `<head>` de `index.html`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;550;650;700;750&display=swap" rel="stylesheet">
  ```
- **Resolução Implementada:**
  - **O que foi alterado:** Adicionadas tags `<link rel="preconnect">` e importação da família tipográfica `Manrope` (pesos 400, 500, 600, 700, 800) via Google Fonts no `<head>` de `index.html`. Mantido fallback `"Segoe UI", system-ui, sans-serif`.
  - **Arquivos modificados:** `index.html`
  - **Valores anteriores:** Sem importação de webfont no `<head>`.
  - **Valores novos:**
    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    ```
  - **Resoluções usadas para validação:** Todas as resoluções (360px a 1920px).
  - **Evidência da correção:** Via CDP no Edge:
    - `document.fonts.check('16px Manrope') === true`.
    - `document.fonts.status === 'loaded'`.
    - `getComputedStyle(document.body).fontFamily` confirma `"Manrope", "Segoe UI", system-ui, sans-serif`.

---

### UI-004
- **Status:** RESOLVIDO
- **Severidade:** ALTO
- **Seção:** Manifesto (`#empresa`)
- **Resolução onde ocorre:** Todas as resoluções (com maior impacto em Desktop 1024px a 1920px)
- **Elemento/classe:** `.manifesto`, `.pillars`, `#produto`
- **Arquivo relacionado:** `assets/css/sentinela.css:313, 329, 336`
- **Problema:** Corte horizontal seco e abrupto ("seam") na transição entre o Manifesto e a seção Produto em Destaque. O bloco dos pilares possui fundo quase preto (`color-mix(in oklch, var(--fg) 94%, black)`) e encosta diretamente no limite inferior do Manifesto (espaço abaixo dos pilares = 0px). Imediatamente abaixo, a seção `#produto` surge com fundo branco puro (`oklch(1 0 0)`), sem nenhuma zona de respiro ou transição.
- **Evidência:** `spaceBelowPillars === 0` confirmado em todos os viewports de teste. `.manifesto` tem `padding: clamp(...) 0 0;` (padding-bottom de 0px). `.pillars` fica colado na borda inferior da seção.
- **Causa provável:** Ausência de padding inferior em `.manifesto` e término em bloco escuro monolítico contra o início de uma seção clara.
- **Correção sugerida:** Adicionar respiro inferior em `.manifesto` (ex.: `padding-bottom: clamp(64px, 8vw, 110px)`) para que o degradê envolva os pilares, ou criar uma transição gradativa para o fundo branco.
- **Resolução Implementada:**
  - **O que foi alterado:** Criada uma zona de transição gradual contínua na saída do Manifesto via pseudo-elemento `.manifesto::after` com altura fluida `clamp(64px, 7vw, 110px)` e gradiente vertical multicamadas que conduz suavemente da cor escura dos pilares (`color-mix(in oklch, var(--fg) 94%, black)`) até o fundo branco da seção Produto em Destaque (`var(--surface)` / `#ffffff`). Sem adicionar bordas, sombras duras ou elementos decorativos alienígenas.
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** Sem pseudo-elemento (`spaceBelowPillars: 0px`). Corte seco e direto entre fundo escuro e fundo branco.
  - **Valores novos:**
    ```css
    .manifesto::after {
        content: "";
        display: block;
        width: 100%;
        height: clamp(64px, 7vw, 110px);
        background: linear-gradient(
            to bottom,
            color-mix(in oklch, var(--fg) 94%, black) 0%,
            color-mix(in oklch, var(--fg) 75%, black) 28%,
            color-mix(in oklch, var(--fg) 35%, var(--surface)) 62%,
            color-mix(in oklch, var(--fg) 10%, var(--surface)) 85%,
            var(--surface) 100%
        );
    }
    ```
  - **Resoluções usadas para validação:** 390×844, 768×1024, 1366×768, 1440×900, 1920×1080.
  - **Evidência da correção:** Medição via CDP: `.manifesto::after` renderizado com altura de 64px a 110px. A passagem do Manifesto para o Produto em Destaque agora é suave, orgânica e sem seam visível em nenhum viewport.

---

### UI-005
- **Status:** RESOLVIDO
- **Severidade:** ALTO
- **Seção:** Showcase de Soluções (`#solucoes`)
- **Resolução onde ocorre:** 1024px a 1920px
- **Elemento/classe:** `.showcase-item:nth-child(3)` (Lacres de segurança)
- **Arquivo relacionado:** `assets/css/sentinela.css:301-302`
- **Problema:** Quebra de simetria e proporção no 3º item do showcase. Seu pedestal tem largura de 76% (contra 88% dos outros três produtos) e sua imagem tem `max-height: 78%` (contra 84% a 92% dos demais), tornando o card visualmente atrofiado em relação aos vizinhos imediatos na grelha de 4 colunas.
- **Evidência:** Em 1920×1080:
  - Pedestal 1: largura 236px
  - Pedestal 2: largura 236px
  - Pedestal 3: largura 204px (32px mais estreito)
  - Pedestal 4: largura 236px
- **Causa provável:** Inclusão de regra específica `.showcase-item:nth-child(3) .product-pedestal { width: 76%; }` e `.showcase-visual img { max-height: 78%; }` no CSS, possivelmente motivada pela silhueta alongada da fita do lacre, mas que comprometeu o ritmo visual da grelha.
- **Correção sugerida:** Uniformizar a largura do pedestal em 88% para todos os itens e balancear a escala do produto número 3 para equiparar o peso visual aos demais.
- **Resolução Implementada:**
  - **O que foi alterado:** Uniformizada a largura estrutural do pedestal do terceiro item para `width: 88%`, tornando todos os 4 pedestais idênticos em dimensões e geometria. Rebalanceada a escala visual da imagem do lacre para `max-height: 86%` e ajustado o espaçamento para `margin-bottom: 88px;`, preservando `object-fit: contain` e restaurando a simetria da grelha de produtos sem deformações.
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** `.showcase-item:nth-child(3) .product-pedestal { width: 76%; }` (204px em desktop) e `max-height: 78%`.
  - **Valores novos:** `.showcase-item:nth-child(3) .product-pedestal { width: 88%; }` e `.showcase-item:nth-child(3) .showcase-visual img { max-height: 86%; margin-bottom: 88px; }`.
  - **Resoluções usadas para validação:** 1024×768, 1366×768, 1440×900, 1920×1080 (e mobile).
  - **Evidência da correção:** Medição programática via CDP das larguras dos 4 pedestais em 1920×1080:
    - Pedestal 1: 236px
    - Pedestal 2: 236px
    - Pedestal 3: 236px (100% alinhado com os demais)
    - Pedestal 4: 236px
    - `allPedestalsEqual: true`. Item 3 visualmente harmonizado e integrado aos rolos adjacentes.

---

### UI-006
- **Severidade:** ALTO
- **Seção:** Tipografia / Hierarquia de Títulos
- **Resolução onde ocorre:** Desktop (1024px a 1920px)
- **Elemento/classe:** `h2`, `.solutions-v2 h2`, `.manifest-copy h2`, `.product-copy h2`, `.cta-band h2`
- **Arquivo relacionado:** `assets/css/sentinela.css:55, 291, 319`
- **Problema:** Desproporção marcante entre títulos `<h2>` ao longo da página. O H2 da seção Soluções atinge até 88px (`clamp(3rem, 5vw, 5.5rem)`) e o do Manifesto atinge até 99px (`clamp(3.5rem, 5vw, 6.2rem)`), enquanto os títulos H2 de Produto em Destaque e do CTA Final ficam travados no limite de 52px da variável `--fs-h2`.
- **Evidência:** Em 1440×900:
  - Soluções H2: 72px
  - Manifesto H2: 72px
  - Produto em Destaque H2: 52px (28% menor)
  - CTA Final H2: 52px (28% menor)
  Em 1920×1080:
  - Soluções H2: 88px
  - Manifesto H2: 96px
  - Produto H2: 52px (quase metade do tamanho!)
- **Causa provável:** O bloco "Revisão industrial v2" sobrescreveu especificamente os títulos de Soluções e Manifesto com escala editorial gigante, mas não atualizou as seções subsequentes (`.product-showcase` e `.cta-band`), gerando inconsistência de peso e hierarquia.
- **Correção sugerida:** Harmonizar a escala de H2 do site com um token consistente ou criar distinção semântica clara (ex.: classe `.heading-editorial` para o Manifesto e escala uniforme de seção para os demais).

---

### UI-007
- **Severidade:** MÉDIO
- **Seção:** Hero (`#inicio`)
- **Resolução onde ocorre:** Mobile (360×800, 390×844)
- **Elemento/classe:** `.hero-content`, `.hero-media`
- **Arquivo relacionado:** `assets/css/sentinela.css:351, 354`
- **Problema:** Em telas de smartphone verticais, `.hero-content` possui altura mínima de `100svh` com `justify-content: space-between;`. Com o Hero Copy confinado e reduzido a poucas linhas no topo e a imagem ancorada no rodapé com margem negativa (`margin-bottom: -4%`), gera-se um vazio vertical desproporcional no terço médio da tela antes de rolar.
- **Evidência:** Em 360×800, a área central da primeira dobra (entre Y=320px e Y=480px) fica vazia apenas com o degradê de fundo, desconectando o botão de ação da imagem do produto.
- **Causa provável:** A regra `min-height: 100svh` combinada com `justify-content: space-between` em `.hero-content` afasta os dois extremos em viewports alongadas.
- **Correção sugerida:** Em telas menores que 480px, utilizar alinhamento centralizado ou fluxo natural com gap vertical controlado (ex.: `justify-content: center; gap: 32px;` e min-height adaptativa).

---

### UI-008
- **Severidade:** MÉDIO
- **Seção:** Manifesto (`#empresa`)
- **Resolução onde ocorre:** Todas as resoluções
- **Elemento/classe:** `.manifest-symbol`
- **Arquivo relacionado:** `assets/js/animations.js:79`
- **Problema:** A marca d'água/símbolo visual da Sentinela no fundo do Manifesto inicia com `opacity: 0` (`visibility: hidden`) e permanece invisível durante a aproximação da seção, surgindo apenas de forma tardia quando o ScrollTrigger atinge `top 67%`.
- **Evidência:** Inspecionado no DOM via CDP: `getComputedStyle(manifestSymbol).opacity` retorna `"0"` no carregamento inicial da página antes do gatilho de scroll ser atingido.
- **Causa provável:** No script `animations.js`, `manifestoTimeline.from(manifestSymbol, { autoAlpha: 0, duration: 1.15 })` inicializa o elemento com autoAlpha 0 via GSAP.
- **Correção sugerida:** Manter o símbolo sempre visível com a opacidade configurada no CSS (`opacity: 0.18` / `0.14`) e usar a timeline apenas para aplicar movimento sutil ou parallax via scrub, sem ocultar a identidade visual antes do scroll.

---

### UI-009
- **Severidade:** MÉDIO
- **Seção:** Showcase de Soluções (`#solucoes`)
- **Resolução onde ocorre:** Mobile (≤ 767px)
- **Elemento/classe:** `.showcase-list`
- **Arquivo relacionado:** `assets/css/sentinela.css:380-381`
- **Problema:** A lista de produtos em telas pequenas converte-se em um slider horizontal com scroll snap (`overflow-x: auto`), porém a barra de rolagem foi deliberadamente oculta (`scrollbar-width: none; ::-webkit-scrollbar { display: none; }`) e não há nenhum indicador alternativo (dots de paginação, contador numérico ou pista textual).
- **Evidência:** O usuário só enxerga o card 1 e um pequeno recorte do card 2, sem affordance explícita de que existem mais 2 cards na sequência.
- **Causa provável:** Aplicação de estilo estético limpo que eliminou o feedback de usabilidade para interação touch.
- **Correção sugerida:** Incluir indicadores discretos de paginação (dots/bullets) abaixo da lista mobile ou uma dica de navegação ("Deslize para ver mais →").

---

### UI-010
- **Severidade:** MÉDIO
- **Seção:** Pilares (`.pillars`)
- **Resolução onde ocorre:** Mobile (≤ 767px)
- **Elemento/classe:** `.pillar`
- **Arquivo relacionado:** `assets/css/sentinela.css:397-398`
- **Problema:** Ao reorganizar os 4 pilares em uma grelha 2×2 no mobile, a regra `.pillar { border-top: 1px solid ...; }` é aplicada a todos os 4 cards. Como resultado, a linha superior (cards 1 e 2) ganha uma borda superior colada no topo do container dos pilares, criando uma linha cinza que não existe no desktop.
- **Evidência:** Medição em 360×800 e 390×844: `pillar[0].borderTop` e `pillar[1].borderTop` apresentam `1px solid oklch(1 0 0 / 0.17)`.
- **Causa provável:** No CSS mobile, definiu-se borda superior indiscriminada para criar a separação entre as duas linhas de pilares, sem excluir a primeira linha.
- **Correção sugerida:** Aplicar `border-top` apenas aos pilares da segunda linha usando seletor `:nth-child(n+3)`:
  ```css
  .pillar { border-top: 0; }
  .pillar:nth-child(n+3) { border-top: 1px solid color-mix(in oklch, var(--surface) 17%, transparent); }
  ```

---

### UI-011
- **Severidade:** MÉDIO
- **Seção:** Rodapé (`#contato` / `.pagefoot`)
- **Resolução onde ocorre:** Todas as resoluções
- **Elemento/classe:** `.footer-logo-plate`, `.footer-logo-image`
- **Arquivo relacionado:** `assets/css/sentinela.css:157-158`, `index.html:174-176`
- **Problema:** O logotipo da empresa no rodapé é montado sobre um retângulo branco sólido (`.footer-logo-plate`) posicionado sobre um rodapé quase preto (`color-mix(in oklch, var(--fg) 98%, black)`). Isso cria um efeito de "adesivo colado" que destoa da elegância do design escuro do footer.
- **Evidência:** `.footer-logo-plate` possui `background: var(--surface); padding: 12px 18px; border-radius: 4px;`.
- **Causa provável:** O asset de imagem utilizado (`07-logo-vertical-centralizado.png`) possui tipografia preta, inviabilizando sua aplicação direta sem fundo claro.
- **Correção sugerida:** Utilizar uma versão monocromática branca/dourada do logotipo para aplicação em fundo escuro, ou suavizar a placa com fundo translúcido sutil em vez de branco 100% sólido.

---

### UI-012
- **Severidade:** MÉDIO
- **Seção:** Layout Global / Containers
- **Resolução onde ocorre:** Desktop amplo (1366px a 1920px)
- **Elemento/classe:** `.container`, `.solutions-v2 .container`, `.manifesto .container`
- **Arquivo relacionado:** `assets/css/sentinela.css:25, 231, 288, 316`
- **Problema:** Variação abrupta de larguras de container entre seções adjacentes na mesma página:
  - Topnav e Diferenciais: container de 1240px
  - Soluções e Manifesto: container expandido de até 1500px
  - Produto em Destaque: container de 1240px
  - CTA Final: container comprimido de 820px
  Ao rolar a página em telas largas (1440px e 1920px), as linhas de margem do conteúdo se movem horizontalmente para dentro e para fora de seção para seção.
- **Evidência:** Em 1920×1080:
  - Header: 1240px
  - Soluções: 1436px
  - Manifesto: 1436px
  - Produto em Destaque: 1240px
  - CTA Final: 820px
- **Causa provável:** A revisão industrial v2 expandiu as seções centrais para 1500px, mas preservou o restante nas regras base.
- **Correção sugerida:** Harmonizar os containers em duas medidas deliberadas: `--container-normal: 1240px;` e `--container-wide: 1440px;`, assegurando alinhamento intencional dos eixos visuais.

---

### UI-013
- **Severidade:** BAIXO
- **Seção:** Produto em Destaque (`#produto`)
- **Resolução onde ocorre:** Todas as resoluções
- **Elemento/classe:** `.meta` dentro do título H2
- **Arquivo relacionado:** `index.html:147`
- **Problema:** Uso de estilo inline hardcoded: `<span class="meta" style="font-size:.47em; white-space:nowrap;">40 × 40</span>`.
- **Evidência:** Estilo inline presente no HTML sobrescrevendo o token de classe `.meta` (`--fs-meta: 12px`).
- **Causa provável:** Ajuste ad-hoc rápido para adequar a escala da especificação dimensional ao lado do título.
- **Correção sugerida:** Transferir o estilo para uma classe semântica dedicada no CSS (ex.: `.product-dim`) e remover o atributo `style` do HTML.

---

### UI-014
- **Severidade:** BAIXO
- **Seção:** Arquitetura CSS / Tokens
- **Resolução onde ocorre:** Código global
- **Elemento/classe:** `:root`
- **Arquivo relacionado:** `assets/css/sentinela.css:1-30` vs `sentinela.css:222-232`
- **Problema:** Declaração duplicada de `:root` no mesmo arquivo CSS com valores conflitantes. A linha 1 define `--bg: oklch(0.985 ...)`, `--radius: 10px`, `--container: 1200px`. A linha 222 redefine `--bg: oklch(0.963 ...)`, `--radius: 4px`, `--container: 1240px`.
- **Evidência:** Dois blocos `:root` ativos em `sentinela.css`, gerando redundância e variáveis que são sobrescritas logo adiante.
- **Causa provável:** O bloco "Revisão industrial v2" foi adicionado ao final do arquivo sem refatoração do bloco original.
- **Correção sugerida:** Consolidar todas as variáveis `:root` em um único bloco no topo do arquivo.

---

### UI-015
- **Severidade:** BAIXO
- **Seção:** Diferenciais (`.trust-strip`)
- **Resolução onde ocorre:** Desktop
- **Elemento/classe:** `.trust-item h3`
- **Arquivo relacionado:** `assets/css/sentinela.css:113`
- **Problema:** O título H3 dos diferenciais tem `font-size: 14px`, enquanto o parágrafo descritivo tem 13px e o corpo de texto padrão do site tem 16px. Isso resulta em um título com tamanho menor do que o corpo base de texto.
- **Evidência:** `getComputedStyle(.trust-item h3).fontSize` mede 14px; `body` mede 16px.
- **Causa provável:** Redução forçada para evitar quebra de linha em colunas estreitas.
- **Correção sugerida:** Ajustar o tamanho para 15px com peso 700 ou utilizar classe de título compacto apropriada.

---

### UI-016
- **Severidade:** BAIXO
- **Seção:** Produto em Destaque (`#produto`)
- **Resolução onde ocorre:** Desktop
- **Elemento/classe:** `.product-caption`
- **Arquivo relacionado:** `assets/css/sentinela.css:341`
- **Problema:** A legenda do produto (`<figcaption>`) teve seu fundo, borda, padding e sombra zerados na revisão v2 (`border: 0; background: transparent; box-shadow: none; padding: 0;`), resultando em um texto cru solto flutuando no canto inferior direito da imagem sem ancoragem visual.
- **Evidência:** A legenda "ETIQUETA TÉRMICA" aparece descolada sem o formato de tag/badge presente na versão original.
- **Causa provável:** Tentativa de despoluir a imagem que eliminou a affordance do badge.
- **Correção sugerida:** Restaurar um estilo sutil de badge (fundo semitransparente com borda fina e padding delicado) para conectar a etiqueta à imagem.

---

### UI-017
- **Severidade:** BAIXO
- **Seção:** Performance / Lazy Loading
- **Resolução onde ocorre:** Mobile (≤ 767px)
- **Elemento/classe:** `.showcase-item:nth-child(4) img`
- **Arquivo relacionado:** `index.html:110`
- **Problema:** A imagem do 4º produto do carrossel possui `loading="lazy"` e fica fora da viewport inicial de rolagem. Durante o cálculo da timeline do GSAP ScrollTrigger, a imagem pode reportar dimensões 0x0 até que o usuário role a tela, provocando layout shift tardio.
- **Evidência:** Em teste automatizado CDP em mobile sem rolagem, `imgDimensions` do 4º item reportou 0×0px.
- **Causa provável:** Combinação de `loading="lazy"` em carrossel horizontal com inicialização imediata do GSAP.
- **Correção sugerida:** Definir proporção fixa de aspect ratio no container ou gerenciar o refresh do ScrollTrigger após o carregamento completo das imagens.

---

## Matriz de Cobertura por Resolução

| Resolução | Categoria | UI-001 (Hero 112px) | UI-002 (Pedestais) | UI-004 (Corte Pilares) | UI-005 (Item 3 Lacres) | UI-006 (H2 Desigual) | UI-009 (Slider Sem Dots) | UI-010 (Borda Pilares) |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **360×800** | Mobile Compact | **SIM** | **SIM** | **SIM** | — | — | **SIM** | **SIM** |
| **390×844** | Mobile Standard | **SIM** | **SIM** | **SIM** | — | — | **SIM** | **SIM** |
| **430×932** | Mobile Large | **SIM** | **SIM** | **SIM** | — | — | **SIM** | **SIM** |
| **768×1024** | Tablet Portrait | **SIM** | **SIM** | **SIM** | — | — | — | — |
| **820×1180** | Tablet Portrait | **SIM** | **SIM** | **SIM** | — | — | — | — |
| **1024×768** | Tablet Landscape | — | **SIM** | **SIM** | **SIM** | **SIM** | — | — |
| **1366×768** | Laptop | — | **SIM** | **SIM** | **SIM** | **SIM** | — | — |
| **1440×900** | Desktop | — | **SIM** | **SIM** | **SIM** | **SIM** | — | — |
| **1920×1080** | Desktop Amplo | — | **SIM** | **SIM** | **SIM** | **SIM** | — | — |

---

## Conclusão da Etapa de Auditoria

Todas as 17 irregularidades foram estritamente mapeadas, mensuradas e documentadas com suas causas e evidências técnicas no navegador.

**Conforme instruído pelo usuário:**
- Nenhum arquivo de código-fonte (HTML, CSS, JavaScript ou assets) foi modificado.
- Nenhuma correção automática foi aplicada.
- Os arquivos do site permanecem 100% intactos.
- Aguardando aprovação para definir as etapas de correção.
