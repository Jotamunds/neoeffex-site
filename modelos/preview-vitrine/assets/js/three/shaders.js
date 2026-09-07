/**
 * Particle Shaders for Neoeffex 3D Logo
 * Etapa 3 — Formação e dispersão narrativa do N orientada por scroll.
 * 
 * Interpolação contínua e reversível:
 * - 0.00 a 0.18: Disperso no hero com proteção de densidade na copy
 * - 0.18 a 0.55: Convergência suave e progressiva para o N
 * - 0.55 a 0.72: N completamente formado, protagonista visual com micro-movimento vivo e highlight
 * - 0.72 a 1.00: Dispersão suave para o campo de partículas ambiente
 */

export const vertexShader = `
uniform float uTime;
uniform float uScrollProgress;
uniform float uPageScroll;
uniform float uScrollY;
uniform float uIntro;
uniform vec2 uMouse;
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
    // 1. Individualidade orgânica sutil no tempo de transição (sem saltos)
    float pOffset = (aRandomness.x - 0.5) * 0.08;

    // Fase 1: Convergência para o N (0.18 a 0.55)
    float formProgress = clamp((uScrollProgress - (0.18 + pOffset)) / 0.35, 0.0, 1.0);
    float formEase = smoothstep(0.0, 1.0, formProgress);

    // Fase 2: Dispersão para o campo ambiente (0.72 a 1.00)
    float dispProgress = clamp((uScrollProgress - (0.72 + pOffset)) / 0.26, 0.0, 1.0);
    float dispEase = smoothstep(0.0, 1.0, dispProgress);

    // Peso da forma N: 1.0 quando completamente formado, decaindo nas dispersões
    float formedWeight = formEase * (1.0 - dispEase);
    vFormedWeight = formedWeight;
    vDispersal = dispEase;

    // Interpolação contínua de posições:
    // aStartPosition (hero disperso) -> position (N preciso) -> aEndPosition (campo ambiente)
    vec3 targetPos = position;
    vec3 formedPos = mix(aStartPosition, targetPos, formEase);
    vec3 currentPos = mix(formedPos, aEndPosition, dispEase);

    // Parallax persistente ao longo de todas as seções inferiores da página (Etapa 4)
    // As partículas acompanham suavemente a descida da página com profundidade diferencial
    float pageParallax = uScrollY * 0.00035 * (0.3 + aRandomness.z * 0.7);
    currentPos.y += pageParallax * dispEase;
    currentPos.x += sin(uTime * 0.18 + aRandomness.y * 6.28) * 0.020 * dispEase;

    // 2. Movimentos ambiente e micro-oscilações vivas
    // A. Drift ambiente quando disperso (no hero ou pós-N)
    float ambientFactor = 1.0 - formedWeight * 0.82;
    float ambientX = sin(uTime * 0.28 + aRandomness.x * 6.28) * 0.035 * ambientFactor;
    float ambientY = cos(uTime * 0.32 + aRandomness.y * 6.28) * 0.035 * ambientFactor;
    float ambientZ = sin(uTime * 0.38 + aRandomness.z * 6.28) * 0.055 * ambientFactor;

    // B. Movimento vivo interno quando o N está formado:
    // Micro variação em Z (profundidade 2.5D viva) e micro pulso sem alterar a silhueta
    float idleZ = sin(uTime * 0.85 + aRandomness.z * 6.28) * 0.022 * formedWeight;
    float internalX = sin(uTime * 0.45 + aRandomness.x * 6.28) * 0.0035 * formedWeight;
    float internalY = cos(uTime * 0.45 + aRandomness.y * 6.28) * 0.0035 * formedWeight;

    currentPos += vec3(ambientX + internalX, ambientY + internalY, ambientZ + idleZ);

    // 3. Reação suave ao mouse
    float mouseStrength = mix(0.015, 0.025, formedWeight);
    currentPos.x -= (uMouse.x * aRandomness.z * mouseStrength);
    currentPos.y -= (uMouse.y * aRandomness.z * mouseStrength);

    vec4 modelPosition = modelMatrix * vec4(currentPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // 4. Tamanho dos pontos controlado e calibrado
    float introScale = smoothstep(0.0, 1.0, uIntro);
    float sizeMultiplier = mix(1.0, 1.10, formedWeight);
    float pointSize = aSize * uPixelRatio * mix(0.40, 1.0, introScale) * sizeMultiplier;
    gl_PointSize = pointSize * (5.0 / -viewPosition.z);
    gl_PointSize = clamp(gl_PointSize, 2.0, 10.5);

    // 5. Zona de baixa densidade (ativa no hero quando a copy está visível)
    float distToCopy = length((currentPos.xy - uCopyCenter) * vec2(1.0, 1.3));
    float copyZoneDamp = smoothstep(0.18, 0.52, distToCopy);
    vCopyDamp = mix(mix(0.35, 1.0, copyZoneDamp), 1.0, formEase);

    vColor = aColor;
    vTargetPos = targetPos.xy;
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
