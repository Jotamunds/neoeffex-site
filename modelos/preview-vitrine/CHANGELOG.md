# Changelog

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
