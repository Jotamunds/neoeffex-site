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
    // 1. Ciclo de 5 Estados de Formação, Assentamento, Hold e Dispersão (Etapa 4)
    //    - 0%–28%:  Formação principal rápida (velocidade ~8/10)
    //    - 28%–42%: Aproximação final desacelerada e assentamento suave (4/10 -> 0)
    //    - 42%–62%: N formado / Hold (Plateau 100% estável e nítido)
    //    - 62%–76%: Preparação para saída (liberação lenta e gradual, 0 -> 4/10)
    //    - 76%–100%: Dispersão principal aberta (aceleração progressiva para 8/10)
    // =========================================================================

    // Micro-variação determinística por partícula para assentamento orgânico (0.40 a 0.42)
    float pFormEnd = 0.40 + aRandomness.x * 0.02;
    float s = clamp(p / pFormEnd, 0.0, 1.0);

    float wForm = 0.0;
    float sSplit = 0.683; // Transição exata em ~28% do scroll (0.28 / 0.41)
    if (s < sSplit) {
        float t = s / sSplit;
        // Fase 1 (0%–28%): Formação principal ágil (8/10)
        wForm = 0.80 * (1.25 * t - 0.25 * t * t);
    } else if (s < 1.0) {
        float u = (s - sSplit) / (1.0 - sSplit);
        // Fase 2 (28%–42%): Aproximação final e assentamento amortecido (4/10 -> 0)
        wForm = 0.80 + 0.278 * u + 0.044 * (u * u) - 0.122 * (u * u * u);
    } else {
        // Fase 3 (42%–62%): N 100% formado e estável (Plateau Hold)
        wForm = 1.0;
    }

    // Dispersão com saída lenta partindo estritamente após o platô de 62%
    float pDispStart = 0.62 + aRandomness.y * 0.02;
    float wDisp = 0.0;
    if (p > pDispStart) {
        float v = clamp((p - pDispStart) / (1.0 - pDispStart), 0.0, 1.0);
        float vSplit = 0.351; // Transição exata em ~76% do scroll ((0.76 - 0.63) / 0.37)

        if (v < vSplit) {
            float t = v / vSplit;
            // Fase 4 (62%–76%): Preparação para saída (tangente zero -> 4/10)
            wDisp = 0.16 * (t * t);
        } else {
            float u = (v - vSplit) / (1.0 - vSplit);
            // Fase 5 (76%–100%): Dispersão principal acelerada para o campo aberto (8/10)
            wDisp = 0.16 + 0.592 * u + 0.248 * (u * u);
        }
    }

    // Pesos estáveis e reversíveis com partição exata da unidade (soma identicamente 1.0)
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

    // Assentamento amortecido das partículas: micro-curvatura que se anula com derivada nula ao pousar no N
    float settleProgress = clamp((s - 0.65) / 0.35, 0.0, 1.0);
    float settleEnvelope = sin(settleProgress * 3.14159) * (1.0 - wForm);
    vec3 settleOffset = vec3(
        sin(settleProgress * 3.14159 + aRandomness.x * 6.28) * 0.030,
        cos(settleProgress * 3.14159 + aRandomness.y * 6.28) * 0.030,
        sin(settleProgress * 6.28318 + aRandomness.z * 6.28) * 0.045
    ) * settleEnvelope;
    basePos += settleOffset;

    // Paralaxe vertical persistente ao longo de toda a página (Etapa 4)
    float pageParallax = uScrollY * 0.00035 * (0.3 + aRandomness.z * 0.7);
    basePos.y += pageParallax * wDisp;
    basePos.x += sin(uTime * 0.18 + aRandomness.y * 6.28) * 0.020 * wDisp;

    // =========================================================================
    // 2. Micro-vida individual das partículas (N vivo orgânico, sem balançar o bloco todo)
    // =========================================================================
    // A. Drift ambiente sutil quando disperso
    float ambientFactor = 1.0 - formedWeight * 0.85;
    float ambientX = sin(uTime * 0.25 + aRandomness.x * 6.28) * 0.032 * ambientFactor;
    float ambientY = cos(uTime * 0.28 + aRandomness.y * 6.28) * 0.032 * ambientFactor;
    float ambientZ = sin(uTime * 0.32 + aRandomness.z * 6.28) * 0.048 * ambientFactor;

    // B. Micro-respiração viva e individual de cada partícula no N formado (Hold 42%–62%)
    // Movimento individual descorrelacionado sem oscilar o N como um bloco rígido
    // Mantém a silhueta da letra N 100% nítida e reconhecível (amplitude em XY <= 0.0045)
    float lifeX = (sin(uTime * 0.70 + aRandomness.x * 6.28) * 0.0035 +
                   cos(uTime * 1.30 + aRandomness.y * 6.28) * 0.0018) * formedWeight;
    float lifeY = (cos(uTime * 0.75 + aRandomness.y * 6.28) * 0.0035 +
                   sin(uTime * 1.25 + aRandomness.z * 6.28) * 0.0018) * formedWeight;
    float lifeZ = (sin(uTime * 1.10 + aRandomness.z * 6.28) * 0.022 +
                   cos(uTime * 0.60 + aRandomness.x * 6.28) * 0.012) * formedWeight;

    vec3 currentPos = basePos + vec3(ambientX + lifeX, ambientY + lifeY, ambientZ + lifeZ);

    // =========================================================================
    // 3. Reação suave e local ao mouse no N formado
    //    - Repulsão sutil (~7.5px CSS) sem abrir buracos grandes no N
    //    - Transição cúbica smootherstep com derivadas nulas na fronteira do raio
    //    - Retorno amortecido via deltaTime
    // =========================================================================
    if (uMouseActive > 0.001 && formedWeight > 0.15) {
        vec2 dMouse = currentPos.xy - uMouseLocal.xy;
        float distMouse = length(dMouse);
        float mouseRadius = 0.52; // Raio local de influência (~130px CSS)
        if (distMouse < mouseRadius && distMouse > 0.0005) {
            float normDist = distMouse / mouseRadius;
            // Smootherstep (Ken Perlin): derivadas 1ª e 2ª estritamente nulas na borda
            float tFalloff = 1.0 - normDist;
            float falloff = tFalloff * tFalloff * tFalloff * (tFalloff * (tFalloff * 6.0 - 15.0) + 10.0);
            
            vec2 dir = normalize(dMouse);
            float maxRepel = 0.028; // Repulsão suave (~7.5px CSS) preservando a integridade da letra
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
