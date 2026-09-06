/**
 * Neoeffex 3D Scene — Brand Mark Particles
 *
 * A self-contained ES module that renders a particle system
 * forming the Neoeffex "N" logo using Three.js and custom shaders.
 * Supports scroll-driven animation, mouse interaction, mobile
 * optimisations, and reduced-motion.
 *
 * @module scene
 */

import * as THREE from 'three';
import { loadSVGPixels } from './particle-source.js';
import { createParticleLogo } from './particle-logo.js';

// ---------------------------------------------------------------------------
// Module-level state
// ---------------------------------------------------------------------------

let renderer = null;
let scene = null;
let camera = null;
let particlePoints = null;
let particleMaterial = null;
let brandGroup = null;      // Group holding the particles
let animationId = null;
let isVisible = true;
let observer = null;

// Options
let _isMobile = false;
let _reducedMotion = false;

// Mouse interaction targets (normalised –1 … 1)
let mouseTargetX = 0;
let mouseTargetY = 0;
let mouseCurrentX = 0;
let mouseCurrentY = 0;

// Scroll-driven state
let scrollProgress = 0;

// Timing
let startTime = 0;

// Resize debounce handle
let resizeTimer = null;

// Container reference for resize / cleanup
let _container = null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
}

// ---------------------------------------------------------------------------
// Debounced resize
// ---------------------------------------------------------------------------

function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!renderer || !camera || !_container) return;

    const width = _container.clientWidth;
    const height = _container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    
    if (particleMaterial) {
      particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, _isMobile ? 1.0 : 1.5);
    }
  }, 150);
}

// ---------------------------------------------------------------------------
// Intersection Observer — pause when off-screen
// ---------------------------------------------------------------------------

function setupVisibilityObserver(container) {
  if (typeof IntersectionObserver === 'undefined') return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;

        // Resume the loop if we became visible and it had stopped
        if (isVisible && !_reducedMotion && animationId === null) {
          animationId = requestAnimationFrame(animate);
        }
      });
    },
    { threshold: 0.05 }
  );

  observer.observe(container);
}

// ---------------------------------------------------------------------------
// Async Setup (Load SVG and generate particles)
// ---------------------------------------------------------------------------

async function setupParticles() {
  try {
    // Particle count logic based on instructions
    let particleCount = 4000;
    if (_isMobile) {
      particleCount = 1800; // Mobile: 1500–2000
    }
    
    // Load SVG and extract pixels
    const targetPositions = await loadSVGPixels('/img/logos/neoeffex-n-logo-white.svg', particleCount);
    
    // Create points and material
    const result = createParticleLogo(targetPositions, { isMobile: _isMobile, reducedMotion: _reducedMotion });
    particlePoints = result.points;
    particleMaterial = result.material;
    
    brandGroup = new THREE.Group();
    brandGroup.add(particlePoints);
    
    // Position group to fit composition (similar to Etapa 3)
    // The "N" will be slightly on the right
    brandGroup.position.set(0.5, 0, 0);
    scene.add(brandGroup);
    
    // Animate uProgress using GSAP if available
    if (!_reducedMotion && window.gsap) {
      window.gsap.to(particleMaterial.uniforms.uProgress, {
        value: 1.0,
        duration: 2.2,
        ease: 'power2.out'
      });
    }

  } catch (err) {
    console.error('[Neoeffex 3D] Error generating particles:', err);
    // If it fails, fallback to CSS will trigger manually or the canvas remains empty.
  }
}

// ---------------------------------------------------------------------------
// Animation loop
// ---------------------------------------------------------------------------

function animate() {
  if (!isVisible) {
    animationId = null;
    return;
  }

  animationId = requestAnimationFrame(animate);

  const elapsed = performance.now() - startTime;

  if (particleMaterial) {
    particleMaterial.uniforms.uTime.value = elapsed * 0.001;
    
    if (!_isMobile) {
      mouseCurrentX = lerp(mouseCurrentX, mouseTargetX, 0.04);
      mouseCurrentY = lerp(mouseCurrentY, mouseTargetY, 0.04);
      
      particleMaterial.uniforms.uMouse.value.set(mouseCurrentX, mouseCurrentY);
      
      // Very subtle base rotation tied to mouse on the group
      brandGroup.rotation.y = mouseCurrentX * 0.15;
      brandGroup.rotation.x = mouseCurrentY * 0.08;
    }
    
    // Micro idle rotation on the group
    if (!_reducedMotion) {
      brandGroup.rotation.y += Math.sin(elapsed * 0.0005) * 0.0005;
      brandGroup.rotation.x += Math.cos(elapsed * 0.0004) * 0.0005;
    }
  }

  applyScrollTransforms();

  renderer.render(scene, camera);
}

/**
 * Apply scale / position changes driven by scroll progress.
 */
function applyScrollTransforms() {
  if (!brandGroup || !particleMaterial) return;
  const p = scrollProgress;

  if (p <= 0.3) {
    // Normal view in hero
    const scale = mapRange(p, 0, 0.3, 1.0, 1.1);
    brandGroup.scale.setScalar(scale);
    brandGroup.position.y = mapRange(p, 0, 0.3, 0, -0.2);
    brandGroup.rotation.z = mapRange(p, 0, 0.3, 0, -0.05);
    
    // Full opacity for the container
    particleMaterial.opacity = 1.0;
  } else {
    // Scrolling out - N starts to dissolve/fade
    const scale = mapRange(p, 0.3, 1.0, 1.1, 0.8);
    brandGroup.scale.setScalar(scale);
    brandGroup.position.y = mapRange(p, 0.3, 1.0, -0.2, -1.0);
    brandGroup.rotation.z = mapRange(p, 0.3, 1.0, -0.05, -0.2);
    
    // We can simulate dissolving by affecting uProgress, but fade is safer.
    // We use a global transparency approach or reduce uProgress slightly:
    particleMaterial.uniforms.uProgress.value = mapRange(p, 0.3, 1.0, 1.0, 0.5);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function init(container, options = {}) {
  try {
    _isMobile = !!options.isMobile;
    _reducedMotion = !!options.reducedMotion;
    _container = container;

    // ----- Renderer ---------------------------------------------------------
    const maxDPR = _isMobile ? 1.0 : 1.5;

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true, // MSAA helps smooth particles
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDPR));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0); // fully transparent background
    container.appendChild(renderer.domElement);

    // ----- Scene & camera ---------------------------------------------------
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    // Adjusted camera distance for the new particles scale
    camera.position.set(0, 0, 5);

    // ----- Particles Async Load ---------------------------------------------
    setupParticles();

    // ----- Start time -------------------------------------------------------
    startTime = performance.now();

    // ----- Visibility observer ----------------------------------------------
    setupVisibilityObserver(container);

    // ----- Resize listener --------------------------------------------------
    window.addEventListener('resize', onResize);

    // ----- Render -----------------------------------------------------------
    if (_reducedMotion) {
      applyScrollTransforms();
      renderer.render(scene, camera);
    } else {
      animationId = requestAnimationFrame(animate);
    }

    return { destroy };
  } catch (err) {
    console.warn('[Neoeffex 3D] Initialisation failed:', err);
    return null;
  }
}

export function updateScrollProgress(progress) {
  scrollProgress = clamp(progress, 0, 1);
  if (_reducedMotion && renderer && scene && camera) {
    applyScrollTransforms();
    renderer.render(scene, camera);
  }
}

export function updateMouse(normalizedX, normalizedY) {
  if (_isMobile || _reducedMotion) return;
  mouseTargetX = clamp(normalizedX, -1, 1);
  mouseTargetY = clamp(normalizedY, -1, 1);
}

export function destroy() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  window.removeEventListener('resize', onResize);
  clearTimeout(resizeTimer);

  if (scene) {
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  }

  if (renderer) {
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    renderer = null;
  }

  scene = null;
  camera = null;
  brandGroup = null;
  particlePoints = null;
  particleMaterial = null;
  _container = null;
}

// ---------------------------------------------------------------------------
// Auto-initialisation
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('threeCanvas');
  const fallback = document.getElementById('threeFallback');
  if (!container) return;

  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handle = init(container, { isMobile, reducedMotion });

  if (!handle) {
    if (fallback) fallback.classList.add('is-active');
    return;
  }

  if (!isMobile && !reducedMotion) {
    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      updateMouse(nx, ny);
    });
  }

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const threeSection = document.getElementById('threeSection');
    if (threeSection) {
      ScrollTrigger.create({
        trigger: threeSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          updateScrollProgress(self.progress);
        }
      });
    }
  }
});
