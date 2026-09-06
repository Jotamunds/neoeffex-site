import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders.js';

/**
 * Creates the 3D particle logo based on the sampled target positions.
 * Etapa 3.2 — Calibrated particle sizes (3.5 - 7.0), deep blue palette
 * (70% dark blue, 20% Neoeffex blue, 8% light blue, 2% glint white),
 * and subtle Z depth (±0.14).
 *
 * @param {Float32Array} targetPositions - Array of [x,y,z] sampled from SVG
 * @param {Object} options - { isMobile, reducedMotion }
 * @returns {Object} { points (THREE.Points), material (THREE.ShaderMaterial) }
 */
export function createParticleLogo(targetPositions, options = {}) {
    const particleCount = targetPositions.length / 3;
    const geometry = new THREE.BufferGeometry();
    
    // Arrays for attributes
    const startPositions = new Float32Array(particleCount * 3);
    const randomness = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    // Sections 9 & 10: Paleta Neoeffex com 70% azul escuro rico (visível e definido contra fundo escuro)
    const colorDeepBlue  = new THREE.Color(0x10489e); // 70%: azul escuro rico e definido
    const colorPrimary   = new THREE.Color(0x1e86ff); // 20%: azul Neoeffex vivo
    const colorLight     = new THREE.Color(0x72bcff); // 8%: azul elétrico / claro
    const colorNearWhite = new THREE.Color(0xeef6ff); // 2%: quase branco para highlights
    
    // Limits for start positions (dispersion radius)
    const dispersionSpread = options.isMobile ? 1.8 : 2.8;
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Section 8: Z Depth 2.5D — sutil ±0.14 na escala local
        const zDepth = (Math.random() - 0.5) * 0.28;
        targetPositions[i3 + 2] = zDepth;
        
        // Start Position (dispersed)
        if (options.reducedMotion) {
            startPositions[i3 + 0] = targetPositions[i3 + 0];
            startPositions[i3 + 1] = targetPositions[i3 + 1];
            startPositions[i3 + 2] = targetPositions[i3 + 2];
        } else {
            startPositions[i3 + 0] = targetPositions[i3 + 0] + (Math.random() - 0.5) * dispersionSpread;
            startPositions[i3 + 1] = targetPositions[i3 + 1] + (Math.random() - 0.5) * dispersionSpread;
            startPositions[i3 + 2] = targetPositions[i3 + 2] + (Math.random() - 0.5) * dispersionSpread;
        }
        
        // Randomness for idle motion and phase
        randomness[i3 + 0] = Math.random();
        randomness[i3 + 1] = Math.random();
        randomness[i3 + 2] = Math.random();
        
        // Sections 5 & 15: Tamanho controlado (3.5 a 5.5 base, 5.5 a 7.0 highlights)
        // 70% base (3.6–4.4), 20% medium (4.4–5.2), 8% highlights (5.2–6.2), 2% especiais (6.2–7.0)
        const randSize = Math.random();
        if (randSize > 0.98) {
            sizes[i] = 6.2 + Math.random() * 0.8; // 2% especiais
        } else if (randSize > 0.90) {
            sizes[i] = 5.2 + Math.random() * 1.0; // 8% highlights
        } else if (randSize > 0.70) {
            sizes[i] = 4.4 + Math.random() * 0.8; // 20% medium
        } else {
            sizes[i] = 3.6 + Math.random() * 0.8; // 70% base
        }
        
        // Section 9: Distribuição de cor — 70% azul escuro, 20% vivo, 8% claro, 2% quase branco
        const randColor = Math.random();
        let particleColor;
        if (randColor > 0.98) {
            particleColor = colorNearWhite;
        } else if (randColor > 0.90) {
            particleColor = colorLight;
        } else if (randColor > 0.70) {
            particleColor = colorPrimary;
        } else {
            particleColor = colorDeepBlue;
        }
        
        colors[i3 + 0] = particleColor.r;
        colors[i3 + 1] = particleColor.g;
        colors[i3 + 2] = particleColor.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(targetPositions, 3));
    geometry.setAttribute('aStartPosition', new THREE.BufferAttribute(startPositions, 3));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    
    // Shader Material — Blending controlado sem estouro de branco
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uProgress: { value: options.reducedMotion ? 1.0 : 0.0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, options.isMobile ? 1.2 : 1.5) }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    
    const points = new THREE.Points(geometry, material);
    
    return { points, material };
}
