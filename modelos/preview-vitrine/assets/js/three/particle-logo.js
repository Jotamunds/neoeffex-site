import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders.js';

/**
 * Creates the 3D particle logo based on sampled target positions.
 * Etapa 2 — Entrada sincronizada, zona de baixa densidade para proteção da copy,
 * tamanhos calibrados (2.8–6.2) e paleta azul Neoeffex com profundidade Z.
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
    const endPositions = new Float32Array(particleCount * 3);
    const randomness = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    // Paleta Neoeffex com 70% azul escuro rico, 20% azul Neoeffex vivo, 8% azul claro, 2% quase branco
    const colorDeepBlue  = new THREE.Color(0x10489e); // 70%: azul escuro rico e definido
    const colorPrimary   = new THREE.Color(0x1e86ff); // 20%: azul Neoeffex vivo
    const colorLight     = new THREE.Color(0x72bcff); // 8%: azul elétrico / claro
    const colorNearWhite = new THREE.Color(0xeef6ff); // 2%: quase branco para highlights raros
    
    // Limits for start positions (dispersion spread across viewport field)
    const dispersionX = options.isMobile ? 1.6 : 3.8;
    const dispersionY = options.isMobile ? 3.0 : 2.8;
    const dispersionZ = 1.4;
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Z Depth 2.5D — sutil ±0.14 na escala local desktop, ±0.09 mobile
        const zDepth = (Math.random() - 0.5) * (options.isMobile ? 0.18 : 0.28);
        targetPositions[i3 + 2] = zDepth;
        
        // Start Position (dispersed across the 3D viewport field in Hero)
        let startX = (Math.random() - 0.5) * dispersionX;
        let startY = (Math.random() - 0.5) * dispersionY;
        let startZ = (Math.random() - 0.5) * dispersionZ;

        // Etapa 2 — Zona de baixa densidade próxima à copy:
        // Desvia 85% das partículas que cairiam sobre a headline para a região centro-direita
        // (onde o N se formará na Etapa 3) ou periferia atmosférica
        if (!options.isMobile) {
            // Desktop: headline na metade esquerda (X em [-1.55, -0.15], Y em [-0.45, 0.55])
            if (startX > -1.55 && startX < -0.15 && startY > -0.45 && startY < 0.55) {
                if (Math.random() < 0.85) {
                    startX = 0.15 + Math.random() * (dispersionX * 0.45);
                    startY += (Math.random() - 0.5) * 0.6;
                }
            }
        } else {
            // Mobile: headline na faixa central superior (X em [-0.45, 0.45], Y em [0.05, 0.45])
            if (Math.abs(startX) < 0.45 && startY > 0.05 && startY < 0.45) {
                if (Math.random() < 0.75) {
                    startY = (Math.random() > 0.5 ? 0.60 : -0.35) + (Math.random() - 0.5) * 0.3;
                }
            }
        }
        
        startPositions[i3 + 0] = startX;
        startPositions[i3 + 1] = startY;
        startPositions[i3 + 2] = startZ;

        // End Position (Etapa 3: Campo ambiente após dispersão do N)
        // Dispersão orgânica suave radial e descendente
        const endAngle = Math.random() * Math.PI * 2;
        const endRadius = (options.isMobile ? 0.75 : 1.35) + Math.random() * (options.isMobile ? 1.4 : 2.5);
        const endSpreadZ = (Math.random() - 0.5) * 1.6;

        endPositions[i3 + 0] = targetPositions[i3 + 0] * 0.45 + Math.cos(endAngle) * endRadius;
        endPositions[i3 + 1] = targetPositions[i3 + 1] * 0.45 + Math.sin(endAngle) * (endRadius * 0.82) - 0.18;
        endPositions[i3 + 2] = endSpreadZ;
        
        // Randomness for idle motion and phase
        randomness[i3 + 0] = Math.random();
        randomness[i3 + 1] = Math.random();
        randomness[i3 + 2] = Math.random();
        
        // Tamanho controlado e sofisticado (2.8 a 3.8 base, até 6.2 raros)
        const randSize = Math.random();
        if (randSize > 0.99) {
            sizes[i] = 5.6 + Math.random() * 0.8; // 1% glints discretos
        } else if (randSize > 0.92) {
            sizes[i] = 4.8 + Math.random() * 0.8; // 7% highlights
        } else if (randSize > 0.72) {
            sizes[i] = 4.0 + Math.random() * 0.8; // 20% medium
        } else {
            sizes[i] = (options.isMobile ? 3.8 : 2.8) + Math.random() * 1.0; // base calibrada
        }
        
        // Distribuição de cor: 70% azul escuro, 20% vivo, 8% claro, 2% quase branco
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
    geometry.setAttribute('aEndPosition', new THREE.BufferAttribute(endPositions, 3));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    
    // Shader Material — Blending controlado sem estouro de branco
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uScrollProgress: { value: 0.0 }, // Progresso contínuo de rolagem do hero (Etapa 3)
            uPageScroll: { value: 0.0 },     // Progresso global de rolagem da página (Etapa 4)
            uScrollY: { value: 0.0 },        // Pixel vertical de rolagem para parallax persistente
            uProgress: { value: 0.0 }, // Compatibilidade
            uIntro: { value: options.reducedMotion ? 1.0 : 0.0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, options.isMobile ? 1.2 : 1.5) },
            uCopyCenter: { value: new THREE.Vector2(options.isMobile ? 0.0 : -0.75, options.isMobile ? 0.25 : 0.05) }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    
    const points = new THREE.Points(geometry, material);
    
    return { points, material };
}
