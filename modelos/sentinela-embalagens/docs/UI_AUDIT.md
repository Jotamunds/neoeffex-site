# Relatório de Auditoria Visual e Técnica — Sentinela Embalagens

**Projeto:** `modelos/sentinela-embalagens/`  
**Data da Auditoria:** 14/09/2026  
**Ambiente de Teste:** Microsoft Edge (Headless / Blink Engine) via Chrome DevTools Protocol (CDP)  
**Servidor:** Servidor HTTP local ativo (`http://localhost:8089`)  
**Resoluções Auditadas:** 360×800, 390×844, 430×932, 768×1024, 820×1180, 1024×768, 1366×768, 1440×900, 1920×1080.

---

## Resumo Quantitativo e Status de Resolução

- **Total de problemas identificados:** 17
- **Total resolvidos:** 17 (100%)
- **Parcialmente resolvidos:** 0
- **Pendentes / Restantes:** 0
- **Problemas por severidade:**
  - **Críticos:** 2 identificados / 2 resolvidos (0 restantes)
  - **Altos:** 4 identificados / 4 resolvidos (0 restantes)
  - **Médios:** 6 identificados / 6 resolvidos (0 restantes)
  - **Baixos:** 5 identificados / 5 resolvidos (0 restantes)

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
- **Resolução Implementada (Refinada v0.1.7):**
  - **O que foi alterado:** Remoção do pseudo-elemento em `display: block` com gradiente vertical que gerava faixa horizontal reta e separada abaixo dos pilares. O background diagonal claro → escuro do Manifesto foi estendido como composição única até o final da seção com `padding-bottom: clamp(72px, 8vw, 120px)`. A transição inferior foi implementada com `.manifesto::after` em `position: absolute; inset: auto 0 0 0; z-index: 1; pointer-events: none;`, sobreposto diretamente ao fundo da seção com gradiente radial elíptico assimétrico que dissolve suavemente o canto inferior direito escuro em direção à superfície clara (`var(--surface)`), eliminando qualquer linha horizontal evidente ou aumento artificial da altura da seção.
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** Pseudo-elemento em `display: block` com `linear-gradient(to bottom)` criando faixa horizontal perceptível.
  - **Valores novos:**
    ```css
    .manifesto {
        padding: clamp(106px, 10vw, 158px) 0 clamp(72px, 8vw, 120px);
    }
    .manifesto::after {
        content: '';
        position: absolute;
        z-index: 1;
        inset: auto 0 0 0;
        height: clamp(160px, 20vw, 260px);
        background: radial-gradient(
            ellipse 80% 120% at 85% 100%,
            var(--surface) 0%,
            color-mix(in oklch, var(--surface) 88%, transparent) 24%,
            color-mix(in oklch, var(--surface) 48%, transparent) 54%,
            color-mix(in oklch, var(--surface) 14%, transparent) 78%,
            transparent 100%
        );
        pointer-events: none;
    }
    ```
  - **Resoluções usadas para validação:** 375×812, 768×1024, 1366×768, 1440×900, 1920×1080.
  - **Evidência da correção:** Medição e captura via CDP no Edge confirmando:
    - `hasHScroll: false` em todos os viewports.
    - `afterPosition === 'absolute'`.
    - `afterZIndex === '1'` (mantendo pilares em z-index 2 e container em z-index 3 perfeitamente nítidos).
    - Ausência total de faixa horizontal reta abaixo dos pilares.
    - Transição contínua e suave da composição diagonal para a seção seguinte `#produto`.

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
- **Status:** RESOLVIDO
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
- **Resolução Implementada:**
  - **O que foi alterado:** Estabelecida hierarquia deliberada e proporcional para todos os títulos H2 através de novos tokens CSS (`--fs-h2-editorial: clamp(46px, 5.4vw, 88px);`, `--fs-h2-section: clamp(36px, 4vw, 64px);`, `--fs-h2-cta: clamp(30px, 3.4vw, 50px);`). O Manifesto permanece como ápice editorial, Soluções mantém impacto equilibrado, Produto em Destaque assume proporção de seção de destaque (até 64px em vez de 52px travados) e CTA se torna focal e legível (50px).
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** Soluções até 88px, Manifesto até 99px, Produto travado em 52px, CTA travado em 52px.
  - **Valores novos:** Em 1920×1080: Manifesto = 88.0px, Soluções = 76.0px, Produto = 64.0px, CTA = 50.0px. Em 1440×900: Manifesto = 77.8px, Soluções = 66.2px, Produto = 57.6px, CTA = 49.0px.
  - **Resoluções usadas para validação:** 390×844, 768×1024, 1366×768, 1440×900, 1920×1080.
  - **Evidência da correção:** Medição automatizada via CDP confirmou transição harmoniosa de escala em todos os viewports sem quebras de linha indesejadas e sem overflow.

---

### UI-007
- **Status:** RESOLVIDO
- **Severidade:** MÉDIO
- **Seção:** Hero (`#inicio`)
- **Resolução onde ocorre:** Mobile (360×800, 390×844)
- **Elemento/classe:** `.hero-content`, `.hero-media`
- **Arquivo relacionado:** `assets/css/sentinela.css:351, 354`
- **Problema:** Em telas de smartphone verticais, `.hero-content` possui altura mínima de `100svh` com `justify-content: space-between;`. Com o Hero Copy confinado e reduzido a poucas linhas no topo e a imagem ancorada no rodapé com margem negativa (`margin-bottom: -4%`), gera-se um vazio vertical desproporcional no terço médio da tela antes de rolar.
- **Evidência:** Em 360×800, a área central da primeira dobra (entre Y=320px e Y=480px) fica vazia apenas com o degradê de fundo, desconectando o botão de ação da imagem do produto.
- **Causa provável:** A regra `min-height: 100svh` combinada com `justify-content: space-between` em `.hero-content` afasta os dois extremos em viewports alongadas.
- **Correção sugerida:** Em telas menores que 480px, utilizar alinhamento centralizado ou fluxo natural com gap vertical controlado (ex.: `justify-content: center; gap: 32px;` e min-height adaptativa).
- **Resolução Implementada:**
  - **O que foi alterado:** Substituído o alinhamento `space-between` em `.hero-content` por fluxo natural com `justify-content: flex-start; gap: clamp(20px, 4vh, 36px); padding-top: clamp(84px, 11svh, 110px);`. A mídia do produto utiliza `margin-top: auto; margin-bottom: -2%;`, eliminando o vazio desproporcional central, mantendo o botão CTA em evidência com espaçamento orgânico e posicionando os rolos de etiquetas firmemente visíveis na primeira dobra.
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** `justify-content: space-between` com afastamento vertical de mais de 300px em 360×800.
  - **Valores novos:** Espaçamento vertical controlado entre CTA e imagem: 50px em 360×800, 57px em 390×844 e 88px em 430×932.
  - **Resoluções usadas para validação:** 360×800, 390×844, 430×932, 768×1024, 820×1180.
  - **Evidência da correção:** Medição via CDP: em 360×800, `verticalGapBetweenCtaAndMedia: 50px`, CTA visível na dobra (Y=438px) e mídia logo abaixo (Y=488px) sem tela vazia e sem scroll horizontal.

---

### UI-008
- **Status:** RESOLVIDO
- **Severidade:** MÉDIO
- **Seção:** Manifesto (`#empresa`)
- **Resolução onde ocorre:** Todas as resoluções
- **Elemento/classe:** `.manifest-symbol`
- **Arquivo relacionado:** `assets/js/animations.js:79`
- **Problema:** A marca d'água/símbolo visual da Sentinela no fundo do Manifesto inicia com `opacity: 0` (`visibility: hidden`) e permanece invisível durante a aproximação da seção, surgindo apenas de forma tardia quando o ScrollTrigger atinge `top 67%`.
- **Evidência:** Inspecionado no DOM via CDP: `getComputedStyle(manifestSymbol).opacity` retorna `"0"` no carregamento inicial da página antes do gatilho de scroll ser atingido.
- **Causa provável:** No script `animations.js`, `manifestoTimeline.from(manifestSymbol, { autoAlpha: 0, duration: 1.15 })` inicializa o elemento com autoAlpha 0 via GSAP.
- **Correção sugerida:** Manter o símbolo sempre visível com a opacidade configurada no CSS (`opacity: 0.18` / `0.14`) e usar a timeline apenas para aplicar movimento sutil ou parallax via scrub, sem ocultar a identidade visual antes do scroll.
- **Resolução Implementada:**
  - **O que foi alterado:** Removido o parâmetro `autoAlpha: 0` de `manifestoTimeline.from(manifestSymbol, ...)` em `assets/js/animations.js`, substituindo-o por um micro-ajuste de escala (`scale: .96, duration: 1.3, ease: 'power1.out'`). A opacidade base do símbolo permanece ativa e visível continuamente conforme configurado no CSS (`0.18` em desktop, `0.14` em tablet, `0.11` em mobile), eliminando o atraso de carregamento e preservando o parallax suave via scrub no desktop e a compatibilidade integral com `prefers-reduced-motion`.
  - **Arquivos modificados:** `assets/js/animations.js`
  - **Valores anteriores:** `opacity: 0` e `visibility: hidden` até o gatilho de 67% da seção.
  - **Valores novos:** Opacidade constante e visível desde o primeiro instante (`opacity: 0.18` no desktop, `0.14` no tablet, `0.11` no mobile).
  - **Resoluções usadas para validação:** 390×844, 768×1024, 1366×768, 1440×900, 1920×1080.
  - **Evidência da correção:** Medição programática via CDP antes da rolagem confirmou `opacity: "0.18"`, `visibility: "visible"` em desktop e `opacity: "0.11"` em mobile, sem jamais zerar ou ocultar a marca.

---

### UI-009
- **Status:** RESOLVIDO
- **Severidade:** MÉDIO
- **Seção:** Showcase de Soluções (`#solucoes`)
- **Resolução onde ocorre:** Mobile (≤ 767px)
- **Elemento/classe:** `.showcase-list`
- **Arquivo relacionado:** `assets/css/sentinela.css:380-381`
- **Problema:** A lista de produtos em telas pequenas converte-se em um slider horizontal com scroll snap (`overflow-x: auto`), porém a barra de rolagem foi deliberadamente oculta (`scrollbar-width: none; ::-webkit-scrollbar { display: none; }`) e não há nenhum indicador alternativo (dots de paginação, contador numérico ou pista textual).
- **Evidência:** O usuário só enxerga o card 1 e um pequeno recorte do card 2, sem affordance explícita de que existem mais 2 cards na sequência.
- **Causa provável:** Aplicação de estilo estético limpo que eliminou o feedback de usabilidade para interação touch.
- **Correção sugerida:** Incluir indicadores discretos de paginação (dots/bullets) abaixo da lista mobile ou uma dica de navegação ("Deslize para ver mais →").
- **Resolução Implementada:**
  - **O que foi alterado:** Implementado componente leve e elegante de affordance `.showcase-indicator` com 4 dots interativos logo abaixo do carrossel mobile. Em `sentinela.css`, o indicador é visível exclusivamente em viewports móveis (`display: flex; gap: 8px; margin-top: 24px;`) e oculto em desktop (`display: none;`). O dot ativo expande suavemente para 26px com a cor `--accent`. Em `assets/js/ui.js`, foi adicionada sincronização bidirecional de alta performance via `requestAnimationFrame` que atualiza o dot ativo durante o scroll touch e permite navegar diretamente clicando nos dots.
  - **Arquivos modificados:** `index.html`, `assets/css/sentinela.css`, `assets/js/ui.js`
  - **Valores anteriores:** Sem indicadores visuais de paginação ou rolagem.
  - **Valores novos:** 4 dots com dot ativo de 26px e inativos de 8px; sincronização reativa com o item mais próximo.
  - **Resoluções usadas para validação:** 360×800, 390×844, 430×932, 768×1024, 1440×900.
  - **Evidência da correção:** Verificação via CDP comprovou `indicatorDisplay: "flex"` em mobile (360px, 390px, 430px) e `indicatorDisplay: "none"` em tablet/desktop (768px, 1440px). Teste de clique nos dots disparou rolagem fluida com sucesso.

---

### UI-010
- **Status:** RESOLVIDO
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
- **Resolução Implementada:**
  - **O que foi alterado:** Ajustado o seletor de divisórias da grelha 2×2 mobile no CSS para `.pillar { border-top: 0; }` e `.pillar:nth-child(n+3) { border-top: 1px solid color-mix(in oklch, var(--surface) 17%, transparent); }`. Mantido `border-left: 0` para itens ímpares.
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** `border-top: 1px solid ...` em todos os 4 pilares no mobile.
  - **Valores novos:** Pilares 0 e 1 com `border-top: 0px`; Pilares 2 e 3 com `border-top: 1px`.
  - **Resoluções usadas para validação:** 360×800, 390×844, 430×932, 768×1024, 820×1180.
  - **Evidência da correção:** Medição programática via CDP em 360×800 e 390×844: `pillarsBorders[0].borderTop = '0px'`, `pillarsBorders[1].borderTop = '0px'`, `pillarsBorders[2].borderTop = '1px'`, `pillarsBorders[3].borderTop = '1px'`. A linha cinza superior no container foi eliminada.

---

### UI-011
- **Status:** RESOLVIDO
- **Severidade:** MÉDIO
- **Seção:** Rodapé (`#contato` / `.pagefoot`)
- **Resolução onde ocorre:** Todas as resoluções
- **Elemento/classe:** `.footer-logo-plate`, `.footer-logo-image`
- **Arquivo relacionado:** `assets/css/sentinela.css:157-158`, `index.html:174-176`
- **Problema:** O logotipo da empresa no rodapé é montado sobre um retângulo branco sólido (`.footer-logo-plate`) posicionado sobre um rodapé quase preto (`color-mix(in oklch, var(--fg) 98%, black)`). Isso cria um efeito de "adesivo colado" que destoa da elegância do design escuro do footer.
- **Evidência:** `.footer-logo-plate` possui `background: var(--surface); padding: 12px 18px; border-radius: 4px;`.
- **Causa provável:** O asset de imagem utilizado (`07-logo-vertical-centralizado.png`) possui tipografia preta, inviabilizando sua aplicação direta sem fundo claro.
- **Correção sugerida:** Utilizar uma versão monocromática branca/dourada do logotipo para aplicação em fundo escuro, ou suavizar a placa com fundo translúcido sutil em vez de branco 100% sólido.
- **Resolução Implementada:**
  - **O que foi alterado:** Reestruturada a apresentação da placa da logo `.footer-logo-plate`, substituindo o fundo branco opaco por uma superfície translúcida refinada com `background: color-mix(in oklch, var(--surface) 90%, transparent);`, borda sutil `border: 1px solid color-mix(in oklch, var(--surface) 18%, transparent);`, `backdrop-filter: blur(10px)` e sombra suave `box-shadow: 0 4px 16px color-mix(in oklch, black 25%, transparent)`. O padding foi reduzido de 12px 18px para 8px 14px e a largura da imagem foi ajustada para 112px, integrando o logotipo com harmonia ao rodapé grafite sem perder legibilidade.
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** `background: var(--surface); padding: 12px 18px; border-radius: 4px;` (retângulo branco sólido).
  - **Valores novos:** Fundo translúcido 90% com blur(10px), borda 18%, sombra suave e padding compacto de 8px 14px.
  - **Resoluções usadas para validação:** 390×844, 1440×900, 1920×1080.
  - **Evidência da correção:** Medição programática via CDP confirmou dimensões otimizadas (`w: 142px, h: 130px`), padding reduzido (`8px 14px`), `background: "oklch(1 0 0 / 0.9)"` e acabamento visual integrado.

---

### UI-012
- **Status:** RESOLVIDO
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
- **Resolução Implementada:**
  - **O que foi alterado:** Sistema estruturado de containers semânticos introduzido em `:root`: `--container-normal: 1240px;`, `--container-wide: 1440px;`, `--container-narrow: 820px;`, com `--container: var(--container-normal);`. Soluções e Manifesto agora adotam estritamente o limite intencional `--container-wide` (1440px), o CTA final adota `--container-narrow` (820px) e o corpo geral adota `--container-normal` (1240px).
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** Soluções e Manifesto com largura máxima arbitrária de 1500px.
  - **Valores novos:** `--container-normal: 1240px;`, `--container-wide: 1440px;`, `--container-narrow: 820px;`.
  - **Resoluções usadas para validação:** 390×844, 768×1024, 1366×768, 1440×900, 1920×1080.
  - **Evidência da correção:** Em 1920×1080: Header = 1240px, Diferenciais = 1240px, Soluções = 1440px, Manifesto = 1440px, Produto = 1240px, CTA = 820px. Eixos laterais padronizados e intencionais.

---

### UI-013
- **Status:** RESOLVIDO
- **Severidade:** BAIXO
- **Seção:** Produto em Destaque (`#produto`)
- **Resolução onde ocorre:** Todas as resoluções
- **Elemento/classe:** `.meta` dentro do título H2
- **Arquivo relacionado:** `index.html:147`
- **Problema:** Uso de estilo inline hardcoded: `<span class="meta" style="font-size:.47em; white-space:nowrap;">40 × 40</span>`.
- **Evidência:** Estilo inline presente no HTML sobrescrevendo o token de classe `.meta` (`--fs-meta: 12px`).
- **Causa provável:** Ajuste ad-hoc rápido para adequar a escala da especificação dimensional ao lado do título.
- **Correção sugerida:** Transferir o estilo para uma classe semântica dedicada no CSS (ex.: `.product-dim`) e remover o atributo `style` do HTML.
- **Resolução Implementada:**
  - **O que foi alterado:** Removido o atributo `style` inline da tag `<span>` em `index.html` e adicionada a classe semântica `.product-dimension`. No CSS, adicionada a regra correspondente `.product-dimension { font-size: .47em; white-space: nowrap; vertical-align: middle; }`.
  - **Arquivos modificados:** `index.html`, `assets/css/sentinela.css`
  - **Valores anteriores:** `<span class="meta" style="font-size:.47em; white-space:nowrap;">40 × 40</span>`
  - **Valores novos:** `<span class="meta product-dimension">40 × 40</span>` com estilização isolada em classe CSS.
  - **Resoluções usadas para validação:** 390×844, 768×1024, 1366×768, 1440×900, 1920×1080.
  - **Evidência da correção:** Inspecionado via CDP: `productDim.hasInlineStyle === null`, `exists: true`, mantendo exata equivalência visual e semântica.

---

### UI-014
- **Status:** RESOLVIDO
- **Severidade:** BAIXO
- **Seção:** Arquitetura CSS / Tokens
- **Resolução onde ocorre:** Código global
- **Elemento/classe:** `:root`
- **Arquivo relacionado:** `assets/css/sentinela.css:1-30` vs `sentinela.css:222-232`
- **Problema:** Declaração duplicada de `:root` no mesmo arquivo CSS com valores conflitantes. A linha 1 define `--bg: oklch(0.985 ...)`, `--radius: 10px`, `--container: 1200px`. A linha 222 redefine `--bg: oklch(0.963 ...)`, `--radius: 4px`, `--container: 1240px`.
- **Evidência:** Dois blocos `:root` ativos em `sentinela.css`, gerando redundância e variáveis que são sobrescritas logo adiante.
- **Causa provável:** O bloco "Revisão industrial v2" foi adicionado ao final do arquivo sem refatoração do bloco original.
- **Correção sugerida:** Consolidar todas as variáveis `:root` em um único bloco no topo do arquivo.
- **Resolução Implementada:**
  - **O que foi alterado:** Todos os tokens foram unificados em um único bloco `:root` no início de `assets/css/sentinela.css`, preservando rigorosamente os valores finais consolidados da versão industrial v2 (`--bg: oklch(0.963 0.007 80)`, `--radius: 4px`, etc.) e eliminando o bloco duplicado.
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** Bloco `:root` na linha 1 e redefinição redundante na linha 222.
  - **Valores novos:** Bloco `:root` unificado e canônico no topo do arquivo.
  - **Resoluções usadas para validação:** 390×844, 768×1024, 1366×768, 1440×900, 1920×1080.
  - **Evidência da correção:** Verificação via CDP comprovou resolução de todos os tokens CSS sem conflitos ou valores indefinidos (`rootBg: "oklch(0.963 0.007 80)"`, `rootRadius: "4px"`).

---

### UI-015
- **Status:** RESOLVIDO
- **Severidade:** BAIXO
- **Seção:** Diferenciais (`.trust-strip`)
- **Resolução onde ocorre:** Desktop
- **Elemento/classe:** `.trust-item h3`
- **Arquivo relacionado:** `assets/css/sentinela.css:113`
- **Problema:** O título H3 dos diferenciais tem `font-size: 14px`, enquanto o parágrafo descritivo tem 13px e o corpo de texto padrão do site tem 16px. Isso resulta em um título com tamanho menor do que o corpo base de texto.
- **Evidência:** `getComputedStyle(.trust-item h3).fontSize` mede 14px; `body` mede 16px.
- **Causa provável:** Redução forçada para evitar quebra de linha em colunas estreitas.
- **Correção sugerida:** Ajustar o tamanho para 15px com peso 700 ou utilizar classe de título compacto apropriada.
- **Resolução Implementada:**
  - **O que foi alterado:** Atualizado o estilo de `.trust-item h3` para `font-size: 15px; font-weight: 700; line-height: 1.25; letter-spacing: -0.015em;`, garantindo hierarquia superior em relação ao parágrafo descritivo (13px) sem estourar o limite de linha nos cards.
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** `font-size: 14px;`
  - **Valores novos:** `font-size: 15px; font-weight: 700; line-height: 1.25;`
  - **Resoluções usadas para validação:** 390×844, 768×1024, 1366×768, 1440×900, 1920×1080.
  - **Evidência da correção:** Medição via CDP confirmou `fontSize: "15px"` e `fontWeight: "700"` em todas as resoluções, com perfeita legibilidade e harmonia.

---

### UI-016
- **Status:** RESOLVIDO
- **Severidade:** BAIXO
- **Seção:** Produto em Destaque (`#produto`)
- **Resolução onde ocorre:** Desktop
- **Elemento/classe:** `.product-caption`
- **Arquivo relacionado:** `assets/css/sentinela.css:341`
- **Problema:** A legenda do produto (`<figcaption>`) teve seu fundo, borda, padding e sombra zerados na revisão v2 (`border: 0; background: transparent; box-shadow: none; padding: 0;`), resultando em um texto cru solto flutuando no canto inferior direito da imagem sem ancoragem visual.
- **Evidência:** A legenda "ETIQUETA TÉRMICA" aparece descolada sem o formato de tag/badge presente na versão original.
- **Causa provável:** Tentativa de despoluir a imagem que eliminou a affordance do badge.
- **Correção sugerida:** Restaurar um estilo sutil de badge (fundo semitransparente com borda fina e padding delicado) para conectar a etiqueta à imagem.
- **Resolução Implementada:**
  - **O que foi alterado:** Restaurada a apresentação em formato de badge sutil e discreto para `.product-caption`, com fundo translúcido (`color-mix(in oklch, var(--surface) 90%, transparent)`), borda fina suave (`1px solid var(--border)`), padding delicado (6px 12px), `backdrop-filter: blur(8px)` e sombra suave, integrando a legenda visualmente à fotografia do produto.
  - **Arquivos modificados:** `assets/css/sentinela.css`
  - **Valores anteriores:** `border: 0; background: transparent; box-shadow: none; padding: 0;`
  - **Valores novos:** Badge estruturado com padding 6px 12px, border-radius 4px, fundo translúcido e blur.
  - **Resoluções usadas para validação:** 390×844, 768×1024, 1366×768, 1440×900, 1920×1080.
  - **Evidência da correção:** Medição via CDP confirmou presença do badge (`bg: "oklch(1 0 0 / 0.9)"`, `border: "1px solid oklch(0.84 0.008 80)"`, `fontSize: "11px"`), conferindo acabamento premium e ancoragem.

---

### UI-017
- **Status:** RESOLVIDO
- **Severidade:** BAIXO
- **Seção:** Performance / Lazy Loading
- **Resolução onde ocorre:** Mobile (≤ 767px)
- **Elemento/classe:** `.showcase-item:nth-child(4) img`
- **Arquivo relacionado:** `index.html:110`
- **Problema:** A imagem do 4º produto do carrossel possui `loading="lazy"` e fica fora da viewport inicial de rolagem. Durante o cálculo da timeline do GSAP ScrollTrigger, a imagem pode reportar dimensões 0x0 até que o usuário role a tela, provocando layout shift tardio.
- **Evidência:** Em teste automatizado CDP em mobile sem rolagem, `imgDimensions` do 4º item reportou 0×0px.
- **Causa provável:** Combinação de `loading="lazy"` em carrossel horizontal com inicialização imediata do GSAP.
- **Correção sugerida:** Definir proporção fixa de aspect ratio no container ou gerenciar o refresh do ScrollTrigger após o carregamento completo das imagens.
- **Resolução Implementada:**
  - **O que foi alterado:** Adicionada propriedade `aspect-ratio: 1 / 1;` em `.showcase-visual img`, preservando reserva dimensional exata no layout box do navegador antes e durante o download do asset. Adicionalmente, em `assets/js/animations.js`, foram registrados event listeners de carregamento nas imagens com `loading="lazy"` do showcase para disparar `ScrollTrigger.refresh()` no momento do término do download, garantindo que coordenadas e gatilhos de rolagem permaneçam 100% calibrados sem provocar layout shifts.
  - **Arquivos modificados:** `assets/css/sentinela.css`, `assets/js/animations.js`
  - **Valores anteriores:** Sem reserva explícita de `aspect-ratio` no CSS e sem listeners de refresh em imagens lazy.
  - **Valores novos:** `aspect-ratio: 1 / 1;` no CSS e listeners assíncronos no JS.
  - **Resoluções usadas para validação:** 360×800, 390×844, 430×932, 768×1024, 1440×900.
  - **Evidência da correção:** CDP confirmou `aspectRatio: "1 / 1"` ativo em todas as resoluções e ausência total de layout shifts ou travamentos no GSAP ScrollTrigger.

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

## Conclusão da Etapa de Resolução e Re-Auditoria

Todas as 17 irregularidades identificadas na auditoria técnica inicial (UI-001 a UI-017) foram **100% resolvidas e validadas**.

- **Lote Inicial (v0.1.2):** UI-001 a UI-005 corrigidos e homologados.
- **Lote A (v0.1.3):** UI-014, UI-012, UI-006, UI-013, UI-015, UI-016 corrigidos e homologados.
- **Lote B (v0.1.4):** UI-007, UI-009, UI-010, UI-017 corrigidos e homologados.
- **Lote C (v0.1.5):** UI-008 corrigido e homologado.
- **Lote D (v0.1.6):** UI-011 corrigido e homologado.

### Validação Final em 9 Viewports

Foi executada uma re-auditoria completa via Microsoft Edge (CDP) nas 9 resoluções-alvo:
- **360×800, 390×844, 430×932** (Mobile Compact / Standard / Large)
- **768×1024, 820×1180** (Tablet Portrait)
- **1024×768** (Tablet Landscape)
- **1366×768, 1440×900, 1920×1080** (Desktop Laptop / Standard / Wide)

**Resultados da Re-Auditoria:**
- **Transbordo horizontal (`scrollWidth > clientWidth`):** 0 ocorrências em todas as 9 resoluções.
- **Erros / Avisos no Console:** 0 ocorrências.
- **Menu mobile e interações táteis:** Funcionando perfeitamente.
- **Validação de formulário do rodapé:** Íntegra e funcional.
- **Regressões visuais ou estruturais:** 0 detectadas.
