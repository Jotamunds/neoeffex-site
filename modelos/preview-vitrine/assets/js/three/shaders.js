/**
 * Particle Shaders for Neoeffex 3D Logo
 * Etapa 5 — Refinamento de layout, ritmo contínuo do N e microinterações locais.
 * 
 * Fases da transformação orientadas por scroll (Seções 5 a 10 e 27):
 * - 0% a 30%: Formação rápida (8/10, peso N atinge 0.85)
 * - 30% a 45%: Aproximação desacelerada (4/10, chegada suave a 1.0 com tangente 0)
 * - 45% a 65%: N completamente formado e estável (100% N, velocidade 0, vida interna viva)
 * - 65% a 80%: Início suave da dissolução (4/10, dispersão atinge 0.15)
 * - 80% a 100%: Dispersão acelerada (8/10, transição contínua para o campo ambiente)
 */

export const vertexShader = `
uniform float uTime;
uniform float uScrollProgress;
uniform float uPageScroll;
uniform float uScrollY;
uniform float uIntro;
uniform vec3 uMouseLocal;
uniform float uMouseActive;
uniform float uNScale;
uniform float uPixelRatio;
uniform vec2 uCopyCenter;

attribute vec3 aStartPosition;
attribute vec3 aEndPosition;
attribute vec3 aRandomness;
attribute float aSize;
attribute vec3 aColor;

varying vec3 vColor;
varying vec2 vTargetPos;
varying float vDepth;
varying float vCopyDamp;
varying float vFormedWeight;
varying float vDispersal;

void main() {
    float p = clamp(uScrollProgress, 0.0, 1.0);

    // =========================================================================
    // 1. Curva contínua de 5 fases com partição exata da unidade (C1-contínua)
    // =========================================================================
    float wForm = 0.0;
    if (p < 0.30) {
        float t = p / 0.30;
        // Fase 1: Formação perceptivelmente rápida (8/10) atingindo 0.85 em p=0.30
        wForm = 0.85 * (1.30 * t - 0.30 * t * t);
    } else if (p < 0.45) {
        float u = (p - 0.30) / 0.15;
        // Fase 2: Aproximação desacelerada (4/10) com chegada a 1.0 e tangente zero
        wForm = 0.85 + 0.15 * (2.0 * u - u * u);
    } else {
        wForm = 1.0;
    }

    float wDisp = 0.0;
    if (p <= 0.65) {
        // Fase 3: N completamente formado e estável (45% a 65%)
        wDisp = 0.0;
    } else if (p < 0.80) {
        float u = (p - 0.65) / 0.15;
        // Fase 4: Início suave da dissolução (4/10) partindo de tangente zero até 0.15
        wDisp = 0.15 * (u * u);
    } else {
        float t = clamp((p - 0.80) / 0.20, 0.0, 1.0);
        // Fase 5: Dispersão acelerada (8/10) de 0.15 até 1.0
        wDisp = 0.15 + 0.40 * t + 0.45 * (t * t);
    }

    // Pesos estáveis e reversíveis que somam identicamente 1.0 em qualquer ponto de scroll
    float pesoInicial = 1.0 - wForm;
    float pesoN = wForm * (1.0 - wDisp);
    float pesoFinal = wDisp;

    float formedWeight = pesoN;
    vFormedWeight = formedWeight;
    vDispersal = wDisp;

    // Escala do N isolada (92% da escala original sem encolher o campo ambiente)
    vec3 nTarget = position * uNScale;

    // Interpolação estável da forma-base derivada diretamente do progresso atual
    vec3 basePos = pesoInicial * aStartPosition + pesoN * nTarget + pesoFinal * aEndPosition;

    // Paralaxe vertical persistente ao longo de toda a página (Etapa 4)
    float pageParallax = uScrollY * 0.00035 * (0.3 + aRandomness.z * 0.7);
    basePos.y += pageParallax * wDisp;
    basePos.x += sin(uTime * 0.18 + aRandomness.y * 6.28) * 0.020 * wDisp;

    // =========================================================================
    // 2. Movimentos ambiente e micro-oscilações vivas (N vivo contido)
    // =========================================================================
    // A. Drift ambiente sutil quando disperso
    float ambientFactor = 1.0 - formedWeight * 0.85;
    float ambientX = sin(uTime * 0.25 + aRandomness.x * 6.28) * 0.032 * ambientFactor;
    float ambientY = cos(uTime * 0.28 + aRandomness.y * 6.28) * 0.032 * ambientFactor;
    float ambientZ = sin(uTime * 0.32 + aRandomness.z * 6.28) * 0.048 * ambientFactor;

    // B. Micro-movimento interno do N formado (independe do scroll avançar — tempo ativo)
    float idleZ = sin(uTime * 0.90 + aRandomness.z * 6.28) * 0.020 * formedWeight;
    float internalX = sin(uTime * 0.40 + aRandomness.x * 6.28) * 0.0030 * formedWeight;
    float internalY = cos(uTime * 0.40 + aRandomness.y * 6.28) * 0.0030 * formedWeight;

    vec3 currentPos = basePos + vec3(ambientX + internalX, ambientY + internalY, ambientZ + idleZ);

    // =========================================================================
    // 3. Reação suave e local ao mouse (Seções 6 e 28: 5px a 15px CSS de repulsão)
    // =========================================================================
    if (uMouseActive > 0.001 && formedWeight > 0.15) {
        vec2 dMouse = currentPos.xy - uMouseLocal.xy;
        float distMouse = length(dMouse);
        float mouseRadius = 0.58; // Raio de influência local (~150px CSS)
        if (distMouse < mouseRadius && distMouse > 0.0005) {
            float falloff = smoothstep(mouseRadius, 0.0, distMouse);
            vec2 dir = normalize(dMouse);
            float maxRepel = 0.040; // Deslocamento visual correspondente a ~11px CSS
            vec2 repel = dir * falloff * maxRepel * formedWeight * uMouseActive;
            currentPos.xy += repel;
        }
    }

    vec4 modelPosition = modelMatrix * vec4(currentPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // =========================================================================
    // 4. Calibração de tamanho dos pontos
    // =========================================================================
    float introScale = smoothstep(0.0, 1.0, uIntro);
    float sizeMultiplier = mix(1.0, 1.10, formedWeight);
    float pointSize = aSize * uPixelRatio * mix(0.40, 1.0, introScale) * sizeMultiplier;
    gl_PointSize = pointSize * (5.0 / -viewPosition.z);
    gl_PointSize = clamp(gl_PointSize, 2.0, 10.5);

    // =========================================================================
    // 5. Zona de atenuação na copy centralizada (Hero)
    // =========================================================================
    float distToCopy = length((currentPos.xy - uCopyCenter) * vec2(1.0, 1.25));
    float copyZoneDamp = smoothstep(0.20, 0.55, distToCopy);
    vCopyDamp = mix(mix(0.35, 1.0, copyZoneDamp), 1.0, wForm);

    vColor = aColor;
    vTargetPos = nTarget.xy;
    vDepth = -viewPosition.z;
}
`;

export const fragmentShader = `
uniform float uTime;
uniform float uScrollProgress;
uniform float uIntro;

varying vec3 vColor;
varying vec2 vTargetPos;
varying float vDepth;
varying float vCopyDamp;
varying float vFormedWeight;
varying float vDispersal;

void main() {
    // Círculos nítidos e suaves via gl_PointCoord
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float circleAlpha = 1.0 - smoothstep(0.32, 0.49, dist);
    float core = 1.0 - smoothstep(0.0, 0.20, dist);

    // Highlight discreto que atravessa o N diagonalmente quando formado
    float diag = vTargetPos.x * 0.65 + vTargetPos.y * 0.75;
    float sweepCycle = mod(uTime * 0.32, 3.8) - 1.3;
    float distToSweep = abs(diag - sweepCycle);
    float sweep = smoothstep(0.22, 0.0, distToSweep) * vFormedWeight;

    // Highlight em azul tecnológico ciano (predominantemente azul, sem branco estourado)
    vec3 highlightColor = vec3(0.65, 0.86, 1.0);
    vec3 color = mix(vColor, highlightColor, sweep * 0.55);
    color += highlightColor * (core * 0.07 * sweep);

    // Alpha equilibrado:
    // Hero: ~0.55, N formado: ~0.92 (alta definição), Campo ambiente pós-N persistente: ~0.38
    float introAlpha = smoothstep(0.0, 1.0, uIntro);
    float baseAlpha = mix(0.55, 0.92, vFormedWeight);
    baseAlpha = mix(baseAlpha, 0.38, vDispersal);

    float finalAlpha = circleAlpha * mix(baseAlpha * introAlpha * vCopyDamp, 0.95, sweep);

    gl_FragColor = vec4(color, finalAlpha);
}
`;
