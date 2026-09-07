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
let targetShiftPx = 24; // Referência visual inicial de deslocamento em pixels CSS (Etapa 1)
let nOffsetY = 0;       // Deslocamento correspondente em unidades de mundo no plano Z=0

// Mouse interaction targets (normalised –1 … 1)
let mouseTargetX = 0;
let mouseTargetY = 0;
let mouseCurrentX = 0;
let mouseCurrentY = 0;
let mouseActiveTarget = 0.0;
let mouseActiveCurrent = 0.0;

const raycaster = new THREE.Raycaster();
const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const intersectionPoint = new THREE.Vector3();
const localMouse = new THREE.Vector3(999, 999, 0);

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
  if (isMobile || w < 768) return 1400;
  if (w < 1100) return 2200;
  if (w < 1600) return 3200;
  return 4000;
}

// ---------------------------------------------------------------------------
// Dynamic Contain Fit (Sections 24, 26, 27, 28, 29)
// ---------------------------------------------------------------------------

function updateFit() {
  if (!renderer || !camera || !brandGroup) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width <= 0 || height <= 0) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  // Compute visible frustum dimensions at z=0 (camera at z=5)
  const vFovRad = (camera.fov * Math.PI) / 180;
  const visibleHeight = 2 * Math.tan(vFovRad / 2) * camera.position.z;
  const visibleWidth = visibleHeight * camera.aspect;

  // Margem base de enquadramento contain (0.80 desktop, 0.76 mobile).
  // A redução para 92% é isolada no shader via uNScale (0.92), evitando encolher o campo ambiente.
  const marginFactor = _isMobile ? 0.76 : 0.80;

  // Scale calculated for contain (never cover or crop)
  const scaleH = (visibleWidth * marginFactor) / nBounds.width;
  const scaleV = (visibleHeight * marginFactor) / nBounds.height;
  baseFitScale = Math.min(scaleH, scaleV);

  brandGroup.scale.setScalar(baseFitScale);

  // Etapa 1: Deslocamento discreto para baixo do centro de formação do N.
  // Converte pixels visuais para unidades de mundo da cena no plano z=0.
  // 24px no desktop como referência visual inicial; ~14px calibrado no mobile para respeitar a altura do header.
  targetShiftPx = _isMobile ? 14 : 24;
  nOffsetY = - (targetShiftPx / height) * visibleHeight;
  brandGroup.position.set(0, nOffsetY, 0);

  // Expor parâmetros geométricos para etapas posteriores (Etapa 2: coordenadas do mouse)
  window.__neoeffexSceneGeometry = {
    baseFitScale,
    targetShiftPx,
    nOffsetY,
    visibleWidth,
    visibleHeight,
    cameraZ: camera.position.z
  };

  if (particleMaterial) {
    particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, _isMobile ? 1.2 : 1.5);
    if (particleMaterial.uniforms.uCopyCenter) {
      particleMaterial.uniforms.uCopyCenter.value.set(0.0, 0.05);
    }
    if (particleMaterial.uniforms.uNScale) {
      particleMaterial.uniforms.uNScale.value = 0.92;
    }
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
    
    // Expor função de atualização para o coordenador de scroll
    window.__neoeffexUpdateScrollProgress = updateScrollProgress;

    // Verificar se já existe progresso de scroll ativo (ex: recarga no meio da página)
    if (typeof window.__neoeffexCurrentScrollProgress === 'number') {
      scrollProgress = window.__neoeffexCurrentScrollProgress;
    } else if (window.__neoeffexHeroScrollTrigger) {
      scrollProgress = window.__neoeffexHeroScrollTrigger.progress;
    } else {
      scrollProgress = 0.0;
    }

    if (particleMaterial) {
      particleMaterial.uniforms.uScrollProgress.value = scrollProgress;
      particleMaterial.uniforms.uProgress.value = scrollProgress;
      if (_reducedMotion) {
        particleMaterial.uniforms.uIntro.value = 1.0;
        renderer.render(scene, camera);
      } else {
        particleMaterial.uniforms.uIntro.value = 0.0;
      }
    }

    // Notifica o coordenador de entrada do Hero
    window.__neoeffexSceneReady = true;
    window.__neoeffexParticleMaterial = particleMaterial;
    window.dispatchEvent(new CustomEvent('neoeffex:scene-ready', { 
      detail: { particleMaterial } 
    }));

  } catch (err) {
    console.error('[Neoeffex 3D] Error generating particles:', err);
    window.__neoeffexSceneFailed = true;
    window.dispatchEvent(new CustomEvent('neoeffex:scene-failed', { detail: { error: err } }));
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
    
    // Micro rotação idle — contida e suave (±0.9° Y desktop, ±0.4° mobile; ±0.5° X)
    // Mantém a silhueta do N impecável e reconhecível
    const idleRotY = _reducedMotion ? 0 : Math.sin(elapsed * 0.0006) * (_isMobile ? 0.007 : 0.015);
    const idleRotX = _reducedMotion ? 0 : Math.cos(elapsed * 0.0005) * (_isMobile ? 0.004 : 0.009);
    
    if (!_isMobile && !_reducedMotion) {
      // Reação suave ao mouse com limites estritos (±2.5° max)
      mouseCurrentX = lerp(mouseCurrentX, mouseTargetX, 0.055);
      mouseCurrentY = lerp(mouseCurrentY, mouseTargetY, 0.055);
      mouseActiveCurrent = lerp(mouseActiveCurrent, mouseActiveTarget, 0.06);
      
      // Projeta o mouse no plano Z=0 da cena e converte para o espaço local do N
      if (camera && mouseActiveCurrent > 0.005) {
        raycaster.setFromCamera({ x: mouseCurrentX, y: mouseCurrentY }, camera);
        if (raycaster.ray.intersectPlane(planeZ, intersectionPoint)) {
          localMouse.copy(intersectionPoint);
          brandGroup.worldToLocal(localMouse);
          if (particleMaterial.uniforms.uMouseLocal) {
            particleMaterial.uniforms.uMouseLocal.value.copy(localMouse);
          }
        }
      }
      if (particleMaterial.uniforms.uMouseActive) {
        particleMaterial.uniforms.uMouseActive.value = mouseActiveCurrent;
      }
      
      // Micro inclinação global combinada limitada estritamente a 2.5° (0.043 rad)
      const rotY = THREE.MathUtils.clamp(mouseCurrentX * 0.032, -0.043, 0.043) + idleRotY;
      const rotX = THREE.MathUtils.clamp(-mouseCurrentY * 0.022, -0.035, 0.035) + idleRotX;
      brandGroup.rotation.y = rotY;
      brandGroup.rotation.x = rotX;
    } else {
      brandGroup.rotation.y = idleRotY;
      brandGroup.rotation.x = idleRotX;
      if (particleMaterial.uniforms.uMouseActive) {
        particleMaterial.uniforms.uMouseActive.value = 0.0;
      }
    }
  }

  applyScrollTransforms();

  renderer.render(scene, camera);
}

/**
 * Aplica o progresso de rolagem nos uniforms do shader de forma contínua e reversível.
 */
function applyScrollTransforms() {
  if (!brandGroup || !particleMaterial) return;
  particleMaterial.uniforms.uScrollProgress.value = scrollProgress;
  particleMaterial.uniforms.uProgress.value = scrollProgress;
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
    const width = window.innerWidth || 1200;
    const height = window.innerHeight || 800;
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // fully transparent background
    container.appendChild(renderer.domElement);

    // ----- Scene & camera ---------------------------------------------------
    scene = new THREE.Scene();

    const aspect = width / height;
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
  window.__neoeffexCurrentScrollProgress = scrollProgress;
  if (particleMaterial && particleMaterial.uniforms) {
    if (particleMaterial.uniforms.uScrollProgress) {
      particleMaterial.uniforms.uScrollProgress.value = scrollProgress;
    }
    if (particleMaterial.uniforms.uProgress) {
      particleMaterial.uniforms.uProgress.value = scrollProgress;
    }
  }
  if (_reducedMotion && renderer && scene && camera) {
    applyScrollTransforms();
    renderer.render(scene, camera);
  }
}

export function setPageScroll(scrollY, progress) {
  if (particleMaterial && particleMaterial.uniforms) {
    if (particleMaterial.uniforms.uScrollY) {
      particleMaterial.uniforms.uScrollY.value = scrollY;
    }
    if (particleMaterial.uniforms.uPageScroll) {
      particleMaterial.uniforms.uPageScroll.value = progress;
    }
  }
}

export function updateMouse(normalizedX, normalizedY, active = true) {
  if (_isMobile || _reducedMotion) return;
  mouseTargetX = clamp(normalizedX, -1, 1);
  mouseTargetY = clamp(normalizedY, -1, 1);
  mouseActiveTarget = active ? 1.0 : 0.0;
}

export function getParticleMaterial() {
  return particleMaterial;
}

export function getSceneGeometry() {
  return window.__neoeffexSceneGeometry || {
    baseFitScale,
    targetShiftPx,
    nOffsetY,
    nBounds
  };
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
      updateMouse(nx, ny, true);
    });

    document.addEventListener('mouseleave', () => {
      mouseActiveTarget = 0.0;
    });

    document.addEventListener('mouseenter', () => {
      mouseActiveTarget = 1.0;
    });
  }

  window.__neoeffexUpdateScrollProgress = updateScrollProgress;
  window.__neoeffexSetPageScroll = setPageScroll;
  window.__neoeffexUpdateMouse = updateMouse;

  // Pausa/retomada inteligente em background para máxima performance (Etapa 4 / Risk 5)
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible && !reducedMotion && animationId === null) {
      startTime = performance.now();
      animationId = requestAnimationFrame(animate);
    }
  });

  // Só cria ScrollTrigger local de fallback se modelos-preview.js não tiver criado o trigger coordenado
  if (!window.__neoeffexHeroTriggerActive && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const triggerEl = document.getElementById('threeSection') || document.body;
    if (triggerEl) {
      ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top top',
        end: () => isMobile ? '+=' + Math.round(window.innerHeight * 1.4) : '+=' + Math.round(window.innerHeight * 2.0),
        pin: !reducedMotion,
        pinSpacing: !reducedMotion,
        scrub: 0.6,
        onUpdate: (self) => {
          updateScrollProgress(self.progress);
        }
      });
    }
  }
});

