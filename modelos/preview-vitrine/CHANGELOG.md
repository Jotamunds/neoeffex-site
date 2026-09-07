# Changelog

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
