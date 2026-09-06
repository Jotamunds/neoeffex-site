/**
 * Neoeffex 3D Scene — Brand Mark Particles
 * Etapa 3.2 — Protagonista Visual
 *
 * Implements mathematical contain fit, responsive particle density,
 * calibrated camera frustum, subtle 2.5D depth, and smooth mouse/scroll choreography.
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
let brandGroup = null;      // Group holding the particle N
let animationId = null;
let isVisible = true;
let observer = null;

// Options
let _isMobile = false;
let _reducedMotion = false;

// Geometry bounds and fit scale
let nBounds = { width: 0.895, height: 1.0 };
let baseFitScale = 3.2;

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

/**
 * Section 6 & 36: Particle count based on viewport width and device class
 */
function getParticleCount(isMobile) {
  const w = window.innerWidth;
  if (isMobile || w < 768) return 2200;
  if (w < 1100) return 3600;
  if (w < 1600) return 4800;
  return 6200;
}

// ---------------------------------------------------------------------------
// Dynamic Contain Fit (Sections 24, 26, 27, 28, 29)
// ---------------------------------------------------------------------------

function updateFit() {
  if (!renderer || !camera || !_container || !brandGroup) return;

  const width = _container.clientWidth;
  const height = _container.clientHeight;
  if (width <= 0 || height <= 0) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  // Compute visible frustum dimensions at z=0 (camera at z=5)
  const vFovRad = (camera.fov * Math.PI) / 180;
  const visibleHeight = 2 * Math.tan(vFovRad / 2) * camera.position.z;
  const visibleWidth = visibleHeight * camera.aspect;

  // Section 25: Safety margin (10% desktop, 12% mobile)
  const marginFactor = _isMobile ? 0.76 : 0.80;

  // Section 26: Scale calculated for contain (never cover or crop)
  const scaleH = (visibleWidth * marginFactor) / nBounds.width;
  const scaleV = (visibleHeight * marginFactor) / nBounds.height;
  baseFitScale = Math.min(scaleH, scaleV);

  brandGroup.scale.setScalar(baseFitScale);
  brandGroup.position.set(0, 0, 0);

  if (particleMaterial) {
    particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, _isMobile ? 1.2 : 1.5);
  }
}

function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateFit();
  }, 100);
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
    const particleCount = getParticleCount(_isMobile);
    
    // Load SVG and extract pixels with bounding box metadata
    const targetPositions = await loadSVGPixels('/img/logos/neoeffex-n-logo-white.svg', particleCount);
    
    if (targetPositions.bounds) {
      nBounds = targetPositions.bounds;
    }
    
    // Create points and shader material
    const result = createParticleLogo(targetPositions, { isMobile: _isMobile, reducedMotion: _reducedMotion });
    particlePoints = result.points;
    particleMaterial = result.material;
    
    brandGroup = new THREE.Group();
    brandGroup.add(particlePoints);
    scene.add(brandGroup);
    
    // Calculate exact dynamic contain fit
    updateFit();
    
    // Animate uProgress (dispersion -> formed N) over 2.0s
    if (!_reducedMotion && window.gsap) {
      window.gsap.to(particleMaterial.uniforms.uProgress, {
        value: 1.0,
        duration: 2.0,
        ease: 'power2.out'
      });
    }

  } catch (err) {
    console.error('[Neoeffex 3D] Error generating particles:', err);
    const fallback = document.getElementById('threeFallback');
    if (fallback) fallback.classList.add('is-active');
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

  if (particleMaterial && brandGroup) {
    particleMaterial.uniforms.uTime.value = elapsed * 0.001;
    
    // Section 18: Micro idle rotation
    const idleRotY = _reducedMotion ? 0 : Math.sin(elapsed * 0.0006) * 0.018; // ±1.0°
    const idleRotX = _reducedMotion ? 0 : Math.cos(elapsed * 0.0005) * 0.012; // ±0.7°
    
    if (!_isMobile && !_reducedMotion) {
      // Section 19: Smooth mouse reaction via lerp (±2.5° max)
      mouseCurrentX = lerp(mouseCurrentX, mouseTargetX, 0.045);
      mouseCurrentY = lerp(mouseCurrentY, mouseTargetY, 0.045);
      
      particleMaterial.uniforms.uMouse.value.set(mouseCurrentX, mouseCurrentY);
      
      brandGroup.rotation.y = mouseCurrentX * 0.045 + idleRotY;
      brandGroup.rotation.x = -mouseCurrentY * 0.030 + idleRotX;
    } else {
      brandGroup.rotation.y = idleRotY;
      brandGroup.rotation.x = idleRotX;
    }
  }

  applyScrollTransforms();

  renderer.render(scene, camera);
}

/**
 * Section 21: Apply scale / position changes driven by scroll progress.
 * Preserves N legibility during initial descent, then gently dissolves.
 */
function applyScrollTransforms() {
  if (!brandGroup || !particleMaterial) return;
  const p = scrollProgress;

  if (p <= 0.20) {
    brandGroup.scale.setScalar(baseFitScale);
    brandGroup.position.y = 0;
    brandGroup.rotation.z = 0;
    particleMaterial.uniforms.uProgress.value = 1.0;
  } else {
    const scaleFactor = mapRange(p, 0.20, 1.0, 1.0, 0.85);
    brandGroup.scale.setScalar(baseFitScale * scaleFactor);
    brandGroup.position.y = mapRange(p, 0.20, 1.0, 0, -0.6);
    brandGroup.rotation.z = mapRange(p, 0.20, 1.0, 0, -0.05);
    particleMaterial.uniforms.uProgress.value = mapRange(p, 0.20, 0.90, 1.0, 0.25);
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
    const maxDPR = _isMobile ? 1.2 : 1.5;

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDPR));
    renderer.setSize(container.clientWidth || 600, container.clientHeight || 500);
    renderer.setClearColor(0x000000, 0); // fully transparent background
    container.appendChild(renderer.domElement);

    // ----- Scene & camera ---------------------------------------------------
    scene = new THREE.Scene();

    const aspect = (container.clientWidth || 600) / (container.clientHeight || 500);
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
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
    const visualBlock = document.querySelector('.hero__visual');
    const triggerEl = isMobile ? (visualBlock || threeSection) : threeSection;
    if (triggerEl) {
      ScrollTrigger.create({
        trigger: triggerEl,
        start: isMobile ? 'top 40%' : 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          updateScrollProgress(self.progress);
        }
      });
    }
  }
});

