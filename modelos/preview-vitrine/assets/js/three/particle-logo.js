import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders.js';

/**
 * Creates the 3D particle logo based on the sampled target positions.
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
    
    const colorPrimary = new THREE.Color(0x1478ff); // azul vivo
    const colorLight = new THREE.Color(0x82c5ff);   // azul claro
    const colorWhite = new THREE.Color(0xffffff);   // branco
    
    // Limits for start positions (dispersion radius)
    const dispersionSpread = options.isMobile ? 3.0 : 5.0;
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Z Depth (target position)
        // Add slight depth based on instruction: z = random(-0.18, 0.18)
        const zDepth = (Math.random() - 0.5) * 0.36;
        targetPositions[i3 + 2] = zDepth;
        
        // Start Position (dispersed)
        if (options.reducedMotion) {
            // No dispersion if reduced motion
            startPositions[i3 + 0] = targetPositions[i3 + 0];
            startPositions[i3 + 1] = targetPositions[i3 + 1];
            startPositions[i3 + 2] = targetPositions[i3 + 2];
        } else {
            startPositions[i3 + 0] = targetPositions[i3 + 0] + (Math.random() - 0.5) * dispersionSpread;
            startPositions[i3 + 1] = targetPositions[i3 + 1] + (Math.random() - 0.5) * dispersionSpread;
            startPositions[i3 + 2] = targetPositions[i3 + 2] + (Math.random() - 0.5) * dispersionSpread;
        }
        
        // Randomness for idle motion
        randomness[i3 + 0] = Math.random();
        randomness[i3 + 1] = Math.random();
        randomness[i3 + 2] = Math.random();
        
        // Size variation
        // 70% normal, 20% slightly bigger, 10% highlights
        const randSize = Math.random();
        if (randSize > 0.9) {
            sizes[i] = Math.random() * 20.0 + 15.0; // Highlights
        } else if (randSize > 0.7) {
            sizes[i] = Math.random() * 10.0 + 8.0;  // Medium
        } else {
            sizes[i] = Math.random() * 5.0 + 3.0;   // Base
        }
        
        // Color variation
        const randColor = Math.random();
        let particleColor;
        if (randColor > 0.95) {
            particleColor = colorWhite;
        } else if (randColor > 0.8) {
            particleColor = colorLight;
        } else {
            particleColor = colorPrimary;
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
    
    // Shader Material
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uProgress: { value: options.reducedMotion ? 1.0 : 0.0 }, // If reduced motion, starts fully formed
            uMouse: { value: new THREE.Vector2(0, 0) },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) }
        },
        transparent: true,
        depthWrite: false, // Prevents z-fighting between particles
        blending: THREE.AdditiveBlending // Soft glowing overlap
    });
    
    const points = new THREE.Points(geometry, material);
    
    return { points, material };
}
