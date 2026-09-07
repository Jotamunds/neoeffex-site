# Changelog

## v0.5.0 - Etapa 5: Prisma 3D Interativo e Refinamento Tipográfico Hero
- Interação 3D com o Prisma Espacial refinada e estabilizada:
  - Motor de eventos baseado em Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`, `lostpointercapture`, `pointerleave`) com suporte unificado a desktop (mouse) e touch.
  - Distinção clara entre clique e arraste com limiar de ativação (`DRAG_THRESHOLD = 4px`), garantindo que cliques simples não acionem deslocamento acidental.
  - Captura de ponteiro robusta via `setPointerCapture` ativada ao iniciar o arraste, assegurando que movimentos rápidos fora dos limites do elemento continuem sendo rastreados sem perder o controle.
  - Liberação segura de captura em `pointerup`, `pointercancel`, `lostpointercapture` e `window.blur`, impedindo que o estado de arraste fique preso.
  - Física de inércia angular temporal baseada em `deltaTime`, com desaceleração exponencial contínua ($\exp(-3.4 \cdot \Delta t)$) e velocidade angular rigorosamente limitada a $260^\circ/\text{s}$, eliminando giros infinitos ou saltos bruscos.
  - Amortecimento progressivo de soltura: se o ponteiro parar antes de ser liberado, a velocidade residual é amortecida proporcionalmente.
  - Bloqueio de rotação excessiva no eixo vertical ($[-75^\circ, +75^\circ]$), prevenindo inversões anômalas de perspectiva.
  - Desativação de `transition` CSS conflitante no `.spatial-prism`, eliminando duplicidade de interpolação e conferindo resposta visual direta a 60 FPS.
  - Definição de `touch-action: pan-y;` no viewport e `pointer-events: none;` nas faces e camadas internas, garantindo que o scroll vertical da página nunca seja sequestrado ou bloqueado em dispositivos móveis.
  - Pausa e retomada limpa do loop RAF em `visibilitychange`, sem acúmulo de tempo ou saltos de rotação ao alternar de aba.
- Refinamento tipográfico do Hero ("SEU SITE / PODE IR ALÉM"):
  - Adoção da família tipográfica `Bebas Neue` (`font-weight: 400`) via Google Fonts, conferindo estética alta, condensada, editorial e tecnológica.
  - Hierarquia visual estrita de ~2x a 2.5x entre as duas linhas:
    - Linha 1 ("SEU SITE"): letras maiúsculas claras (#ffffff), `clamp(2rem, 3.2vw, 3.4rem)`, letter-spacing aberto (`0.15em`) com compensação ótica de padding para centralização exata, line-height `1.0`.
    - Linha 2 ("PODE IR ALÉM"): elemento dominante em azul ciano (`var(--theme-accent-light)` com glow), `clamp(4.5rem, 8.2vw, 9rem)`, letter-spacing condensado (`0.015em`), line-height calibrado em `0.94` com `padding-top: 4px` para proteção estrita contra o corte do acento agudo no "É".
  - Entrelinha compacta sem encavalar caracteres e sem criar dois blocos dissociados.
  - Responsividade sem quebras indesejadas em 3 linhas: media queries dedicadas para 760px, 440px e telas notebook (max-height 820px), sem overflow horizontal.
- Preservação estrita:
  - Física do N de partículas congelada (Etapa 4.1 intocada, sem alteração de spring, damping, velocidade máxima ou shaders).
  - Header fixo, partículas de fundo, seções adjacentes e links 100% preservados.
  - Etapa 6 (Cursor) rigorosamente não iniciada.

## v0.4.10 - Etapa 4.1: Refinamento avançado da física e suavidade do N
- Desacoplamento estrito entre o scroll real e a posição visual das partículas:
  - Separação conceitual e programática entre `targetProgress` (destino solicitado pelo scroll) e `visualProgress` (posição física e visual real atual da animação do N).
  - O scroll real deixa de controlar diretamente os uniforms e posições das partículas; o progresso é governado exclusivamente pelo Motion Controller centralizado em `scene.js`.
- Motion Controller com amortecimento adaptativo (Spring-Damper):
  - Integração de sistema massa-mola-amortecedor com critical damping ($\zeta \in [1.0, 1.18]$) e frequência natural adaptativa ($\omega \in [6.2, 10.5]\text{ rad/s}$).
  - Em scroll lento: acompanhamento de altíssima precisão com tempo de resposta imediato (~90ms).
  - Em scroll rápido: amortecimento adaptativo aumentado, conferindo sensação de massa, inércia física e movimento contínuo sem saltos.
- Limite estrito de velocidade visual máxima:
  - Velocidade visual rigorosamente limitada a $v_{\text{max}} = 0.88\text{ unidades/s}$ e aceleração máxima a $a_{\text{max}} = 6.2\text{ unidades/s}^2$. Mesmo rolagens extremamente rápidas do wheel ou touchpad são transpostas pelo N em velocidade suave e controlada.
- Tratamento ativo e contínuo de reversão de scroll:
  - Detecção imediata de inversão de comando ($\text{diff} \cdot v < 0$) com freio de dissipação exponencial ($\exp(-14.0 \cdot \Delta t)$), redirecionando a animação com velocidade contínua sem tranco, snap ou persistência contra a intenção do usuário.
- DeltaTime protegido e substeps dinâmicos:
  - Limite estrito de $\Delta t \le 33\text{ms}$ com 2 substeps de integração numérica para $\Delta t > 18\text{ms}$, eliminando instabilidades e dependência de framerate.
  - Reset temporal e dissipação de velocidade residual em eventos de `visibilitychange`, protegendo contra saltos após alternar abas.
- Stagger determinístico por partícula no shader (`shaders.js`):
  - Micro-variação temporal determinística individual (~80-250ms equivalentes) baseada em `aRandomness.z`, que se contrai suavemente para zero na aproximação final, garantindo 100% de nitidez, estabilidade e legibilidade do N na zona formada (Hold 42%–62%).
- Preservação estrita:
  - Header fixo, enquadramento vertical com `nOffsetY`, coordenadas e repulsão ao mouse, layout do Hero e demais seções preservados sem regressões.
  - Etapas 5 (Prisma) e 6 (Cursor) rigorosamente intocadas.

## v0.4.9 - Etapa 4: Suavidade, permanência e N vivo com repulsão amortecida
- Ciclo de 5 estados com transições $C^1$ contínuas:
  - 0%–28% (Formação Principal): deslocamento inicial ágil com velocidade percebida ~8/10, iniciando a convergência fluida das partículas a partir do início da rolagem
  - 28%–42% (Aproximação Final e Assentamento): desaceleração progressiva contínua (4/10 -> 0), eliminando paradas bruscas com derivada nula exata ao pousar
  - 42%–62% (N Formado / Hold Plateau): zona de permanência visual ampla (20% do scroll útil) onde o N permanece 100% formado, firme, legível e responsivo, sem início de dispersão prematura
  - 62%–76% (Preparação para Saída): liberação extremamente lenta e sutil das partículas a partir de tangente zero (0 -> 4/10)
  - 76%–100% (Dispersão Principal): aceleração suave e progressiva para dispersão aberta (8/10) integrando-se ao fundo contínuo da página
- Assentamento amortecido das partículas:
  - Implementação de micro-curvatura amortecida tridimensional (`settleOffset`) na aproximação final ($s \in [0.65, 1.0]$), garantindo que as partículas pousem como um enxame suave na silhueta do N com amortecimento quadrático/cúbico
- N vivo orgânico sem balanço de bloco rígido:
  - Eliminação da oscilação rígida global do `brandGroup` quando idle, evitando que o N balance como um bloco sólido
  - Micro-respiração e vida interna independentes calculadas por partícula no shader (`lifeX`, `lifeY`, `lifeZ`) com fases descorrelacionadas via `aRandomness`, mantendo a forma da letra N 100% nítida e reconhecível com variação sutil de profundidade
- Repulsão ao mouse amortecida e natural:
  - Falloff cúbico smootherstep (Ken Perlin) com derivadas 1ª e 2ª estritamente nulas na borda do raio de influência (~130px CSS)
  - Limite de repulsão calibrado para ~7.5px CSS (`maxRepel = 0.028`), preservando a legibilidade sem abrir buracos grandes nem deformar o centro da letra
- Amortecimento rigorosamente desacoplado do framerate (DeltaTime):
  - Substituição de lerp com taxa fixa por `THREE.MathUtils.damp(..., delta)` para coordenadas do mouse e fator de ativação, garantindo comportamento perfeitamente idêntico em telas de 60Hz, 75Hz, 120Hz e 144Hz
  - Retorno elástico suave à posição de repouso sem sobressaltos ou snaps quando o cursor deixa a tela
- Ampliação do percurso de rolagem (Pinning):
  - Calibração de `getPinDuration` para `250vh` desktop e `170vh` mobile, proporcionando tempo e espaço visual generosos para que o visitante contemple o N formado e interaja com o mouse antes de prosseguir para as demonstrações visuais
- Preservação estrita: header fixo, enquadramento vertical com `nOffsetY`, mapeamento NDC do mouse, prisma e cursor customizado mantidos intactos

## v0.4.8 - Etapa 3: Suavização da formação e desformação do N
- Eliminação de parada abrupta e pouso tangencial suave ($C^1$ contínuo):
  - Identificada a causa da parada repentina: a curva anterior concentrava 85% do deslocamento em $p \in [0, 0.30]$ e os 15% finais eram comprimidos até $p=0.45$, onde todas as partículas atingiam $wForm=1.0$ simultaneamente em um limite abrupto
  - Implementada nova curva de aproximação desacelerada com pouso suave $C^1$: a desaceleração progressiva (referência 4/10) é antecipada para começar aos 60% do percurso de formação ($s=0.60$), convergindo suavemente para $wForm=1.0$ com derivada nula ($\frac{dwForm}{ds} \to 0$), eliminando qualquer sensação de tranco ou freio repentino
  - Formação inicial e intermediária ágil (referência visual 8/10) preservada para manter dinamismo e resposta imediata ao início da rolagem
- Micro-variação determinística por partícula:
  - Adicionada dispersão sutil e determinística de chegada ($pEnd \in [0.44, 0.48]$) utilizando o atributo existente `aRandomness.x`, gerando uma constelação orgânica onde as partículas chegam em micro-tempos ligeiramente distintos, garantindo que 100% estejam perfeitamente acomodadas no N em $p=0.48$
- Platô nítido e estável:
  - Intervalo de $p \in [0.48, 0.64]$ com $wForm \equiv 1.0$ e $wDisp \equiv 0.0$ ($pesoN = 1.0$), garantindo estabilidade absoluta, nitidez da silhueta da marca e interação plena com o mouse sem risco de dispersão precoce
- Desformação com saída lenta e dispersão progressiva:
  - Início da desformação com saída sutil partindo de tangente zero ($\frac{dwDisp}{dp} = 0$, referência 4/10) a partir de $pStart \in [0.64, 0.68]$ (via `aRandomness.y`)
  - Aceleração suave e progressiva para dispersão aberta (referência 8/10) à medida que o scroll avança até $p=1.0$
- Partição estável da unidade:
  - Preservação estrita de $pesoInicial + pesoN + pesoFinal \equiv 1.00000$ em todos os pontos do percurso de scroll, sem compressão ou expansão volumétrica
- Continuidade temporal e proteção contra saltos de aba/recarga:
  - Substituição do `elapsed = performance.now() - startTime` por delta time acumulado contínuo no loop `animate()`, com limitação estrita de $\Delta t \le 100\text{ms}$ por frame
  - Reinicialização do âncora de tempo (`lastFrameTime`) no listener de `visibilitychange` e no `IntersectionObserver`, garantindo retorno limpo e sem saltos após alternar ou ocultar abas
  - Inicialização adequada do estado ao recarregar a página com scroll ativo ou via âncora intermediária, aplicando o progresso atual imediatamente e exibindo o conteúdo sem atrasos de animação de entrada
- Preservação estrita: header fixo, enquadramento vertical com `nOffsetY`, coordenadas e correspondência do mouse da Etapa 2, efeitos de prisma e cursor mantidos intactos

## v0.4.7 - Etapa 2: Correção de coordenadas e correspondência do mouse
- Correção da orientação do eixo Y:
  - Identificada a causa-raiz do espelhamento vertical: a conversão anterior utilizava `(e.clientY / innerHeight) * 2 - 1`, associando o topo da tela (`clientY = 0`) a `-1` e a base da tela a `+1`, o inverso exato da convenção NDC (Normalized Device Coordinates) do Three.js onde $+1$ é o topo e $-1$ é a base
  - Implementada a conversão normalizada correta: `ny = 1 - ((e.clientY - rect.top) / rect.height) * 2` e `nx = ((e.clientX - rect.left) / rect.width) * 2 - 1`, referenciando o retângulo real do canvas via `getBoundingClientRect()` com suporte a zoom e redimensionamento
- Correspondência precisa de espaço entre mouse e partículas:
  - Projeção via Raycaster calibrada no plano $Z=0$ com conversão para o espaço local de coordenadas do `brandGroup` através de `worldToLocal()`
  - O deslocamento vertical `nOffsetY` aplicado na Etapa 1 é absorvido naturalmente pela matriz de transformação do grupo (`matrixWorld`), sem necessidade de compensação manual dupla
  - Atualização síncrona de `brandGroup.updateMatrixWorld()` antes de projetar o cursor, garantindo zero latência entre a micro-rotação do N e o ponto de repulsão
- Validação nos 4 quadrantes e centro:
  - Superior Direito (+X, +Y): repulsão confirmada nas partículas superiores direitas
  - Superior Esquerdo (-X, +Y): repulsão confirmada nas partículas superiores esquerdas
  - Inferior Direito (+X, -Y): repulsão confirmada nas partículas inferiores direitas (corrigindo a falha relatada)
  - Inferior Esquerdo (-X, -Y): repulsão confirmada nas partículas inferiores esquerdas
  - Centro do N (0, 0): alinhamento exato no centro deslocado do N
- Preservação estrita: parâmetros de força de repulsão (`maxRepel`), raio (`mouseRadius`), amortecimento lerp, oscilações idle e curvas de formação do N rigorosamente mantidos sem alterações

## v0.4.6 - Etapa 1: Header fixo e enquadramento vertical do N

- Header fixo e sempre visível: remoção completa da lógica de ocultação durante a rolagem (`topbar--hidden`), garantindo que o header permaneça afixado ao topo em qualquer posição da página, em rolagens lentas, rápidas ou reversas
- Transição de fundo no scroll: adição da classe `.topbar--scrolled` quando `scrollY > 20px`, aumentando discretamente o contraste e o amortecimento de fundo (`rgba(4, 7, 13, 0.88)` com sombra difusa) sobre o conteúdo rolado
- Compensação de âncoras e altura do header:
  - Criação da variável CSS `--header-height` (76px desktop, 68px/64px mobile)
  - Aplicação de `scroll-padding-top` no elemento raiz `html` e `scroll-margin-top` em todas as seções-alvo (`#demonstracoes`, `#hamburgueria`, `#clinica`, `#hortifruti`, `#lu`, `.demo-section`, `.model-card`)
  - Compensação dinâmica da altura real do header (`topbar.offsetHeight`) no listener de cliques de âncoras gerenciado pelo Lenis, mantendo offset 0 para o topo (`#inicio`)
  - Calibração do padding superior do `.hero` em breakpoints mobile (`clamp(84px, 14vh, 110px)` e `clamp(80px, 14vh, 100px)`), eliminando qualquer sobreposição entre a headline e o header
- Enquadramento do N em Three.js:
  - Deslocamento discreto para baixo do centro de formação das partículas do N (`brandGroup.position.set(0, nOffsetY, 0)`), calculado matematicamente a partir de pixels visuais no plano Z=0 (`targetShiftPx = 24px` no desktop; `14px` no mobile)
  - Preservação rigorosa do tamanho, proporção e enquadramento dinâmico contain (`baseFitScale` e `uNScale`) sem recortes ou ampliação de áreas vazias
  - Geometria exposta via `window.__neoeffexSceneGeometry` e função exportada `getSceneGeometry()` para integração perfeita com o cálculo de coordenadas do mouse na Etapa 2
  - Ajuste equivalente no `.three-fallback` para coerência visual quando WebGL não estiver ativo
- Preservação estrita: configurações atuais de mouse, formação/desformação, micro-movimentos do N, prisma demonstrativo, cursor personalizado e vídeos/sites incorporados mantidos intactos para suas respectivas etapas subsequentes

- Hero: remoção do texto de apoio ("Design, tecnologia e movimento para transformar presença em experiência.") e dos dois botões de ação ("Explorar projetos" e "Falar com especialista") exclusivamente do Hero, transformando a abertura em uma composição editorial pura com a headline "SEU SITE / PODE IR ALÉM" sobre o canvas 3D
- Header Smart Reveal: adicionada leveza e lentidão suave na entrada e saída do header da página (topbar):
  - Entrada inicial com float sutil e desaceleração suave (1.3s com `power2.out`), limpando estilos inline na conclusão para integração natural com o CSS
  - Saída elegante para cima (`translateY(-100%)` e `opacity: 0`) ao rolar a página para baixo com curva de amortecimento fluida (0.85s `cubic-bezier(0.16, 1, 0.3, 1)`)
  - Reentrada suave (`translateY(0)` e `opacity: 1`) ao iniciar rolagem para cima em qualquer ponto da página ou retornar ao topo
  - Fixação em `position: fixed` de largura total para garantir sincronização perfeita em viewports desktop e mobile com `overflow-x: hidden`
  - Respeito integral a `prefers-reduced-motion` com desativação de transições dinâmicas
- Preservação: botões e chamadas para ação de todas as demais seções (topbar, cards e CTA de encerramento) permanecem intactos

## v0.4.4 - Refinamento de layout, ritmo do N e interações (Etapa 5)
- Header: expansão visual da topbar por toda a largura disponível da viewport com fundo translúcido (rgba(4, 7, 13, 0.72)) e backdrop-filter: blur(14px), mantendo o conteúdo interno rigorosamente centralizado e limitado por max-width via .topbar__inner, eliminando qualquer risco de overflow horizontal
- Hero: centralização horizontal precisa de headline, texto de apoio e botões de ação em coluna simétrica, preservando a camada de partículas no fundo e a zona de baixa densidade centrada para garantir contraste e legibilidade impecáveis em todas as resoluções
- Escala do N: redução proporcional refinada para 92% da escala original (uNScale = 0.92), garantindo enquadramento completo (fit contain com margem segura de 73.6% desktop e 70% mobile) sem encolher o campo ambiental circundante
- Percurso de rolagem: calibração da distância de transformação do N para 180–220vh (efetivo: +=200vh desktop e +=140vh mobile), diferenciando altura de seção de percurso útil com contabilização única de pinSpacing
- Ritmo de transformação em 5 fases contínuas com partição da unidade (C1 Hermite sem descontinuidades):
  - 0–30%: formação perceptivelmente mais rápida (w_form -> 0.85)
  - 30–45%: aproximação progressivamente desacelerada até a silhueta exata com derivada nula (w_form -> 1.0)
  - 45–65%: N 100% formado, estável e protagonista visual, com vida interna contínua
  - 65–80%: início suave da dissolução a partir de velocidade zero (w_disp -> 0.15)
  - 80–100%: dispersão acelerada em direção ao campo ambiental aberto (w_disp -> 1.0)
- N vivo e repelência ao mouse: micromovimentos internos 3D mantidos quando a rolagem para no trecho formado; repelência local suave em coordenadas do modelo projetadas via raycaster Z=0, calibrada para 5–15px CSS (~0.040 unidades 3D no raio de 0.58) com retorno elástico; inclinação global combinada estritamente limitada a 2.5° (0.043 rad)
- Reversibilidade total: interpolação determinística sem deriva de estado em rolagem reversa ou recarregamento no meio do documento
- Seleção e arraste: restrição de seleção e arraste aplicada exclusivamente aos elementos visuais e decorativos da vitrine (user-select: none; -webkit-user-drag: none;), preservando campos de texto editáveis, links, botões, foco via teclado e interação independente com iframes de preview
- Footer: destaque com peso 700 e sublinhado aplicado exclusivamente ao nome "Neoeffex" (.footer-brand), mantendo semântica e ano dinâmico

## v0.4.3 - Demonstrações visuais abertas e partículas persistentes contínuas (Etapa 4)
- fio condutor de partículas persistentes: reuso global do mesmo canvas Three.js (`.particles-bg-layer`), mantendo partículas ativas em baixa densidade e movimento sutil ao longo de toda a rolagem da página
- novos uniforms `uPageScroll` e `uScrollY` no ShaderMaterial para criar paralaxe vertical e deriva sutil com base no scroll contínuo do documento
- calibração de alpha base (0.38) das partículas dispersas, garantindo que acompanhem a página sem competir com textos ou mídia
- transição da landing para "menos texto, mais demonstração": eliminação do padrão comum de IA (caixas com borda fina, glassmorphism genérico, repetição de feature cards em grade)
- inclusão de 3 seções demonstrativas abertas e assimétricas com grande respiro visual:
  - 01 · 3D Espacial (`SEU SITE PODE TER / ELEMENTOS 3D`): prisma tridimensional interativo renderizado via CSS 3D Transforms com anéis orbitais e rastreamento de ponteiro suave, sem segundo canvas WebGL
  - 02 · Direção Autoral (`PODE TER FOTOS / REAIS DO SEU NEGÓCIO`): composição editorial assimétrica de fotografia autêntica com paralaxe diferencial (usando ativos reais existentes do Hortifruti)
  - 03 · Resposta Tátil (`MOTION · INTERAÇÃO / PERFORMANCE`): laboratório interativo com métricas de desempenho em tempo real e chips magnéticos com física elástica
- vitrine de projetos refinada: remoção de caixas e bordas pesadas nos cards, aumento de área dedicada aos previews de vídeo (proporção 1:1.55 desktop), eliminação de badges/tags redundantes e adoção de copy ultra-concisa:
  - Hamburgueria: "Produto em movimento."
  - Clínica: "Presença sofisticada."
  - Hortifruti: "Frescor visual."
  - Lu Leve: "Pedido simplificado."
- fechamento CTA simplificado e de alto impacto: "VAMOS CRIAR ALGO / QUE VÁ ALÉM?", com call-to-action direto para WhatsApp e navegação reversa para projetos
- economia de recursos e performance: pausa de RAF e de reprodução de vídeos HTML5 em background tabs via listener de `visibilitychange`
- conformidade estrita com acessibilidade e `prefers-reduced-motion` em todas as novas seções

## v0.4.2 - Formação e dispersão narrativa do N orientada por scroll (Etapa 3)
- implementação da formação contínua, progressiva e reversível do N da Neoeffex através de `uScrollProgress` no ShaderMaterial
- interpolação dual-phase no Vertex Shader: `aStartPosition` (hero disperso) → `position` (N preciso) → `aEndPosition` (campo ambiente pós-N)
- scroll progress com fases calibradas:
  - 0.00 a 0.18: partículas dispersas no hero em baixa densidade, headline 100% legível
  - 0.18 a 0.55: convergência progressiva e orgânica das partículas formando o N
  - 0.55 a 0.72: N completamente formado, protagonista visual com fit contain (78% viewport), sem cortes em qualquer resolução
  - 0.72 a 1.00: dispersão suave em direção ao campo de partículas ambiente, preparando a continuidade visual da página
- reversibilidade completa: ao rolar para cima, o fluxo inverte matematicamente (campo ambiente → N formado → hero disperso)
- vida interna contínua quando formado: micro oscilações em Z (profundidade 2.5D viva), micro drift interno sem prejudicar a silhueta
- micro rotação contida (±1.0° Y desktop, ±0.5° mobile) e reação suave ao mouse (±2.0° max)
- highlight dinâmico diagonal em azul tecnológico ciano atravessando o N a cada ciclo quando formado
- resolução de conflito de RAF do Lenis (Risk 5): remoção do loop redundante de `requestAnimationFrame` em favor do controle exclusivo pelo ticker do GSAP
- fixação controlada do hero (`pin: true`, 120% desktop, 95% mobile) com esmaecimento suave e reversível da copy (0.0 a 0.22)
- sincronização estrita em recarregamento no meio da página e salto por âncoras (Risk 6)
- compatibilidade total com `prefers-reduced-motion` e suporte responsivo desktop/mobile

## v0.4.1 - Entrada sincronizada do hero com partículas (Etapa 2)
- orquestração e sincronização da entrada: hero surge praticamente limpo, headline aparece e partículas emergem simultaneamente via uniform `uIntro` (0.0 -> 1.0)
- criação de zona de baixa densidade (exclusão inteligente da copy) que afasta 85% das partículas do traçado da headline, preservando 100% da legibilidade
- atenuação de brilho/alpha em shaders (`vCopyDamp`) para qualquer partícula que transite pela área do texto
- remoção de qualquer container ou borda visível: canvas ocupa toda a viewport em camada de fundo contínua e transparente
- ajuste de densidade responsiva e contagem de partículas (4000 telas grandes, 3200 desktop, 2200 tablet, 1400 mobile)
- escala controlada de pontos (2.8 a 3.8 base, máximo 6.2 em highlights raros), eliminando efeito de plasma, fumaça ou bolhas
- movimento ambiente sutil e sofisticado em 3D nos eixos X, Y e Z
- suporte estrito a `prefers-reduced-motion` com exibição estática imediata sem necessidade de rolagem
- coordenação resiliente com timeout de segurança (550ms) e fallback SVG garantindo que o conteúdo nunca fique bloqueado

## v0.4.0 - Novo Hero, tipografia e camada contínua de partículas (Etapa 1)
- nova headline do hero em maiúsculas: "SEU SITE / PODE IR ALÉM", em 2 linhas intencionais
- tipografia refinada e mais fina (Inter, font-weight: 600, fluid clamp, line-height 1.12, letter-spacing -0.015em)
- texto de apoio conciso: "Design, tecnologia e movimento para transformar presença em experiência."
- redução para 2 CTAs essenciais com links corretos ("Explorar projetos" -> #modelos, "Falar com especialista" -> /#contato)
- remoção de badges, pílulas redundantes e bordas genéricas no hero
- identidade Azul Neoeffex (#1e86ff) garantida como dominante global, sem contaminação por temas locais de cards
- instalação da camada definitiva de partículas fixa na viewport (`.particles-bg-layer`), desacoplada de transforms
- partículas dispersas no fundo com drift ambiente tridimensional suave; N mantido sem formação automática nesta etapa
- layout espaçoso com amplo respiro visual no hero, testado em desktop, notebook e mobile

## v0.3.2 - Refinamento do N em partículas 3D (Etapa 3.2)
- N como protagonista visual integrado no Hero (56% largura desktop, altura proporcional 73vh)
- eliminação de estouro branco com distribuição calibrada: 70% azul escuro rico (#10489e), 20% azul Neoeffex vivo (#1e86ff), 8% azul claro (#72bcff), 2% glints quase branco (#eef6ff)
- tamanho de partículas reduzido para escala microscópica (base 3.6–5.2, highlights 5.2–7.0)
- densidade responsiva calibrada (6200 desktop forte, 4800 desktop, 3600 tablet, 2200 mobile)
- cálculo matemático de contain fit e bounding box automático (N nunca cortado, margem interna 10%)
- highlight móvel dinâmico: onda diagonal suave de luz que atravessa o N a cada ciclo
- profundidade 2.5D precisa no eixo Z (±0.14) preservando silhueta frontal exata do SVG
- shaders otimizados com gl_PointCoord (círculos nítidos sem halos exagerados ou efeito bolha)
- ajuste de ScrollTrigger e layout mobile com stacking perfeito e zero quebra
- suporte estrito a `prefers-reduced-motion` e fallback SVG responsivo

## v0.3.0 - 3D WebGL e identidade experimental (Etapa 3)
- adiciona Three.js com objeto 3D marca Neoeffex (losango metálico + anel torus)
- integra objeto 3D com ScrollTrigger (escala, opacidade e posição reativa ao scroll)
- adiciona reação suave do objeto ao mouse via lerp (desktop)
- iluminação com accent azul Neoeffex e materiais MeshPhysicalMaterial
- fallback CSS automático caso WebGL não esteja disponível
- mobile: DPR reduzido, geometria simplificada, sem interação de mouse
- `prefers-reduced-motion`: render estático sem loop de animação
- canvas com pause automático fora da viewport (IntersectionObserver)
- preserva integralmente cursor, parallax, atmosfera e transições da Etapa 2

## v0.2.0 - interações e atmosfera da vitrine (Etapa 2)
- adiciona cursor customizado tecnológico com estados dinâmicos (ABRIR, ↗) para desktop
- implementa parallax leve com controle via movimento do mouse
- adiciona transição de atmosfera por projeto ativo (hamburgueria, clínica, hortifruti, lu leve) via variáveis CSS dinâmicas
- adiciona suporte a GSAP 3, ScrollTrigger e Lenis para navegação e animações cinematográficas
- implementa seção de movimento tipográfico ("NÃO UM TEMPLATE. NÃO UMA CÓPIA...")
- adiciona microinterações magnéticas em botões e links
- atualiza a vitrine para exibir os 4 modelos autorizados (hamburgueria, clínica, hortifruti, lu leve) e remove barbearia
- adiciona seção de encerramento "QUAL VAI SER O SEU?" com CTA direto
- preserva total responsividade mobile e suporte a `prefers-reduced-motion`

## v0.1.0 - preview vitrine
- adiciona posters WebP dos 5 modelos
- adiciona previews curtos WebM com fallback MP4
- cria página HTML pronta para vitrine de modelos
- adiciona CSS e JS para autoplay em loop com pause fora da viewport
