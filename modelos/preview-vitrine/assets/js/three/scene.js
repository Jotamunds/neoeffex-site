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

// Scroll-driven state — Etapa 4.1: Desacoplamento estrito entre scroll real e visual
let targetProgress = 0.0;       // Destino solicitado pelo scroll
let visualProgress = 0.0;       // Posição visual real atual da animação do N
let visualVelocity = 0.0;       // Velocidade instantânea do progresso visual (unidades/s)
let prevTargetProgress = 0.0;   // Para medição contínua da velocidade de scroll
let targetVelocity = 0.0;       // Velocidade suavizada da intenção do usuário
let scrollDirection = 0;        // +1: avançando, -1: retrocedendo, 0: repouso

// Timing (Delta time e tempo acumulado contínuo com proteção contra saltos de aba)
let startTime = 0;
let lastFrameTime = 0;
let accumulatedTime = 0;

// Resize debounce handle
let resizeTimer = null;

// Container reference for resize / cleanup
let _container = null;
let _mouseMoveHandler = null;

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
          lastFrameTime = performance.now();
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

    // Etapa 4.1: Inicialização coerente em recarga no meio da página (Seção 29)
    let initialProg = 0.0;
    if (typeof window.__neoeffexCurrentScrollProgress === 'number') {
      initialProg = window.__neoeffexCurrentScrollProgress;
    } else if (window.__neoeffexHeroScrollTrigger) {
      initialProg = window.__neoeffexHeroScrollTrigger.progress;
    } else if (window.scrollY > 40) {
      const heroEl = document.getElementById('threeSection');
      const maxScroll = heroEl ? heroEl.offsetHeight : window.innerHeight * 2;
      initialProg = clamp(window.scrollY / maxScroll, 0, 1);
    }

    targetProgress = clamp(initialProg, 0, 1);
    visualProgress = targetProgress; // Inicializa sincronizado sem salto
    prevTargetProgress = targetProgress;
    visualVelocity = 0.0;
    targetVelocity = 0.0;

    window.__neoeffexCurrentScrollProgress = targetProgress;
    window.__neoeffexVisualProgress = visualProgress;
    window.__neoeffexTargetProgress = targetProgress;

    if (particleMaterial) {
      particleMaterial.uniforms.uScrollProgress.value = visualProgress;
      particleMaterial.uniforms.uProgress.value = visualProgress;
      if (particleMaterial.uniforms.uVisualVelocity) {
        particleMaterial.uniforms.uVisualVelocity.value = 0.0;
      }
      if (_reducedMotion || visualProgress > 0.02 || (window.scrollY && window.scrollY > 80)) {
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

/**
 * Etapa 4.1 — Controlador Centralizado de Movimento do N
 * Desacopla o scroll real (targetProgress) da posição visual das partículas (visualProgress).
 * Integra um sistema de amortecimento adaptativo tipo spring próximo de critical damping,
 * limite estrito de velocidade visual, proteção ativa contra inversão brusca de direção
 * e estabilidade numérica via delta time protegido e substeps dinâmicos.
 *
 * @param {number} delta - Delta time em segundos (já sanitizado e limitado a <= 0.033)
 */
function updateMotionController(delta) {
  if (_reducedMotion) {
    visualProgress = targetProgress;
    visualVelocity = 0.0;
    window.__neoeffexVisualProgress = visualProgress;
    applyScrollTransforms();
    return;
  }

  // 1. Estimação e suavização da velocidade e direção do scroll de entrada
  const targetDelta = targetProgress - prevTargetProgress;
  const instantTargetVel = delta > 0 ? targetDelta / delta : 0;
  targetVelocity = THREE.MathUtils.damp(targetVelocity, instantTargetVel, 8.0, delta);
  prevTargetProgress = targetProgress;

  if (Math.abs(targetVelocity) > 0.01) {
    scrollDirection = Math.sign(targetVelocity);
  } else {
    scrollDirection = 0;
  }

  // 2. Substeps dinâmicos (Seção 14): 2 substeps para delta > 18ms garantem estabilidade absoluta
  const steps = delta > 0.018 ? 2 : 1;
  const dtSub = delta / steps;

  for (let s = 0; s < steps; s++) {
    const diff = targetProgress - visualProgress;
    const absDiff = Math.abs(diff);

    // Seção 12: Tratamento de inversão rápida de scroll
    // Se a direção do target inverteu contra a velocidade visual atual, dissipa a inércia contra-direcional
    if (diff * visualVelocity < 0 && absDiff > 0.006 && Math.abs(visualVelocity) > 0.015) {
      visualVelocity *= Math.exp(-14.0 * dtSub);
    }

    // Seção 10: Damping adaptativo e frequência natural da mola
    // - Scroll lento (pequeno diff, velocidade baixa): altíssima precisão e resposta imediata (~90ms)
    // - Scroll rápido (grande salto de target): maior amortecimento, sensação de massa e peso
    const speedIntensity = clamp(Math.max(absDiff * 3.5, Math.abs(targetVelocity) * 0.75), 0.0, 1.0);
    const omega = lerp(10.5, 6.2, speedIntensity); // rad/s (frequência natural da mola)
    const zeta = lerp(1.0, 1.18, speedIntensity);  // razão de amortecimento (critical damping para leve sobre-amortecido)

    // Forças do sistema massa-mola-amortecedor
    const springForce = omega * omega * diff;
    const dampingForce = 2.0 * zeta * omega * visualVelocity;
    let acceleration = springForce - dampingForce;

    // Limite máximo de aceleração (suaviza impulsos bruscos de target)
    const maxAccel = 6.2; // unidades/s²
    acceleration = clamp(acceleration, -maxAccel, maxAccel);

    visualVelocity += acceleration * dtSub;

    // Seção 9: Limite estrito de velocidade visual máxima
    // Impede que mesmo uma scrollada ultra-rápida faça o N saltar entre estados
    const maxVisualSpeed = 0.88; // unidades/s
    visualVelocity = clamp(visualVelocity, -maxVisualSpeed, maxVisualSpeed);

    visualProgress += visualVelocity * dtSub;
    visualProgress = clamp(visualProgress, 0.0, 1.0);

    // Assentamento perfeito quando em repouso próximo
    if (absDiff < 0.0003 && Math.abs(visualVelocity) < 0.0008) {
      visualProgress = targetProgress;
      visualVelocity = 0.0;
    }
  }

  window.__neoeffexVisualProgress = visualProgress;
  window.__neoeffexVisualVelocity = visualVelocity;

  applyScrollTransforms();
}

function animate() {
  if (!isVisible) {
    animationId = null;
    return;
  }

  animationId = requestAnimationFrame(animate);

  const now = performance.now();
  // Proteção contra saltos anormais de deltaTime (aba oculta, travamento, breakpoint)
  let rawDelta = (now - lastFrameTime) * 0.001;
  lastFrameTime = now;
  if (!Number.isFinite(rawDelta) || rawDelta <= 0) {
    rawDelta = 0.016;
  }
  // Seção 13: dt limitado a no máximo 33ms (~30fps min step) para evitar explosões e instabilidade
  const delta = Math.min(rawDelta, 0.033);
  accumulatedTime += delta;

  // Etapa 4.1: Atualiza o Motion Controller desacoplado antes da renderização
  updateMotionController(delta);

  if (particleMaterial && brandGroup) {
    particleMaterial.uniforms.uTime.value = accumulatedTime;
    
    if (!_isMobile && !_reducedMotion) {
      // Amortecimento rigorosamente desacoplado do framerate via deltaTime (60Hz, 75Hz, 120Hz, 144Hz)
      mouseCurrentX = THREE.MathUtils.damp(mouseCurrentX, mouseTargetX, 3.8, delta);
      mouseCurrentY = THREE.MathUtils.damp(mouseCurrentY, mouseTargetY, 3.8, delta);
      mouseActiveCurrent = THREE.MathUtils.damp(mouseActiveCurrent, mouseActiveTarget, 3.0, delta);

      // Micro inclinação suave interativa ao mouse (sem oscilação rígida global do N quando idle)
      const rotY = THREE.MathUtils.clamp(mouseCurrentX * 0.018, -0.026, 0.026);
      const rotX = THREE.MathUtils.clamp(-mouseCurrentY * 0.014, -0.020, 0.020);
      brandGroup.rotation.y = rotY;
      brandGroup.rotation.x = rotX;
      brandGroup.updateMatrixWorld();

      // Projeta o mouse no plano Z=0 da cena e converte para o espaço local do N (considerando escala e nOffsetY)
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
    } else {
      mouseActiveCurrent = THREE.MathUtils.damp(mouseActiveCurrent, 0.0, 3.0, delta);
      brandGroup.rotation.y = THREE.MathUtils.damp(brandGroup.rotation.y, 0.0, 3.0, delta);
      brandGroup.rotation.x = THREE.MathUtils.damp(brandGroup.rotation.x, 0.0, 3.0, delta);
      brandGroup.updateMatrixWorld();
      if (particleMaterial.uniforms.uMouseActive) {
        particleMaterial.uniforms.uMouseActive.value = mouseActiveCurrent;
      }
    }
  }

  renderer.render(scene, camera);
}

/**
 * Aplica o progresso visual nos uniforms do shader de forma contínua e reversível.
 */
function applyScrollTransforms() {
  if (!brandGroup || !particleMaterial || !particleMaterial.uniforms) return;
  particleMaterial.uniforms.uScrollProgress.value = visualProgress;
  particleMaterial.uniforms.uProgress.value = visualProgress;
  if (particleMaterial.uniforms.uVisualVelocity) {
    particleMaterial.uniforms.uVisualVelocity.value = visualVelocity;
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
    lastFrameTime = startTime;
    accumulatedTime = 0;

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
  targetProgress = clamp(progress, 0, 1);
  window.__neoeffexTargetProgress = targetProgress;
  window.__neoeffexCurrentScrollProgress = targetProgress;

  if (_reducedMotion) {
    visualProgress = targetProgress;
    visualVelocity = 0.0;
    window.__neoeffexVisualProgress = visualProgress;
    if (particleMaterial && particleMaterial.uniforms) {
      particleMaterial.uniforms.uScrollProgress.value = visualProgress;
      particleMaterial.uniforms.uProgress.value = visualProgress;
      if (particleMaterial.uniforms.uVisualVelocity) {
        particleMaterial.uniforms.uVisualVelocity.value = 0.0;
      }
    }
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
}

export function getVisualProgress() {
  return visualProgress;
}

export function getTargetProgress() {
  return targetProgress;
}

export function getVisualVelocity() {
  return visualVelocity;
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

  if (_mouseMoveHandler) {
    window.removeEventListener('mousemove', _mouseMoveHandler);
    _mouseMoveHandler = null;
  }

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
    // Etapa 2: Conversão precisa de coordenadas tela -> NDC (Normalized Device Coordinates)
    // O eixo Y no Three.js NDC vai de -1 (inferior) a +1 (superior), exigindo a inversão do clientY.
    const onMouseMove = (e) => {
      const canvas = renderer ? renderer.domElement : null;
      let nx = 0;
      let ny = 0;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          ny = 1 - ((e.clientY - rect.top) / rect.height) * 2;
        } else {
          nx = (e.clientX / window.innerWidth) * 2 - 1;
          ny = 1 - (e.clientY / window.innerHeight) * 2;
        }
      } else {
        nx = (e.clientX / window.innerWidth) * 2 - 1;
        ny = 1 - (e.clientY / window.innerHeight) * 2;
      }
      updateMouse(nx, ny, true);
    };

    _mouseMoveHandler = onMouseMove;
    window.addEventListener('mousemove', onMouseMove, { passive: true });

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
  window.__neoeffexGetVisualProgress = getVisualProgress;
  window.__neoeffexGetTargetProgress = getTargetProgress;
  window.__neoeffexGetVisualVelocity = getVisualVelocity;

  // Pausa/retomada inteligente em background para máxima performance (Seção 28)
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) {
      lastFrameTime = performance.now();
      visualVelocity = 0.0; // Dissipa qualquer velocidade residual acumulada ao retomar
      if (!_reducedMotion && animationId === null) {
        animationId = requestAnimationFrame(animate);
      }
    }
  });

  // Só cria ScrollTrigger local de fallback se modelos-preview.js não tiver criado o trigger coordenado
  if (!window.__neoeffexHeroTriggerActive && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const triggerEl = document.getElementById('threeSection') || document.body;
    if (triggerEl) {
      ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top top',
        end: () => isMobile ? '+=' + Math.round(window.innerHeight * 1.7) : '+=' + Math.round(window.innerHeight * 2.5),
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

