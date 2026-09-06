/**
 * Particle Shaders for Neoeffex 3D Logo
 * Etapa 3.2 — Microscopic point precision, controlled glow,
 * deep blue color harmony, and dynamic light sweep highlight.
 */

export const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform vec2 uMouse;
uniform float uPixelRatio;

attribute vec3 aStartPosition;
attribute vec3 aRandomness;
attribute float aSize;
attribute vec3 aColor;

varying vec3 vColor;
varying vec2 vTargetPos;
varying float vDepth;

void main() {
    // 1. Interpolate from start (dispersed) to target (precise N shape)
    vec3 targetPos = position;
    vec3 currentPos = mix(aStartPosition, targetPos, uProgress);

    // 2. Section 18: Micro idle movement (mostly in Z depth to preserve 2D silhouette)
    float idleZ = sin(uTime * 0.7 + aRandomness.z * 6.28) * 0.015 * uProgress;
    float idleY = cos(uTime * 0.5 + aRandomness.y * 6.28) * 0.003 * uProgress;
    currentPos.z += idleZ;
    currentPos.y += idleY;

    // 3. Section 19 & 20: Local mouse parallax (minimal offset, shape preserved)
    currentPos.x -= (uMouse.x * aRandomness.z * 0.012) * uProgress;
    currentPos.y -= (uMouse.y * aRandomness.z * 0.012) * uProgress;

    vec4 modelPosition = modelMatrix * vec4(currentPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Sections 5 & 14: Point size with gentle perspective attenuation
    float pointSize = aSize * uPixelRatio;
    // Scale slightly by depth (closer is slightly larger, farther is smaller)
    gl_PointSize = pointSize * (5.0 / -viewPosition.z);
    gl_PointSize = clamp(gl_PointSize, 1.5, 16.0);

    // Pass attributes to fragment shader
    vColor = aColor;
    vTargetPos = targetPos.xy;
    vDepth = -viewPosition.z;
}
`;

export const fragmentShader = `
uniform float uTime;
uniform float uProgress;

varying vec3 vColor;
varying vec2 vTargetPos;
varying float vDepth;

void main() {
    // Section 13: Círculos suaves e precisos via gl_PointCoord
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Smoothstep crisp circle with subtle anti-aliased border (no fuzzy blobs)
    float alpha = 1.0 - smoothstep(0.30, 0.49, dist);

    // Microscopic center highlight core
    float core = 1.0 - smoothstep(0.0, 0.22, dist);

    // Sections 16 & 17: Highlight dinâmico que atravessa diagonalmente o N
    float diag = vTargetPos.x * 0.65 + vTargetPos.y * 0.75;
    float sweepCycle = mod(uTime * 0.35, 3.6) - 1.2;
    float distToSweep = abs(diag - sweepCycle);
    float sweep = smoothstep(0.22, 0.0, distToSweep) * uProgress;

    // Section 10: Highlight em azul cristalino tecnológico (evita branco puro dominante)
    vec3 highlightColor = vec3(0.68, 0.88, 1.0);
    vec3 color = mix(vColor, highlightColor, sweep * 0.58);
    color += highlightColor * (core * 0.10 * sweep);

    // Alpha geral: partículas nítidas com halo mínimo
    float baseAlpha = mix(0.60, 0.90, uProgress);
    float finalAlpha = alpha * mix(baseAlpha, 0.98, sweep);

    gl_FragColor = vec4(color, finalAlpha);
}
`;
