/**
 * Neoeffex 3D Scene — Brand Mark Vitrine
 *
 * A self-contained ES module that renders a geometric brand mark
 * (diamond + torus ring) with dark metallic material and blue
 * accent lighting. Supports scroll-driven animation, mouse
 * interaction, mobile optimisations, and reduced-motion.
 *
 * @module scene
 */

import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Module-level state
// ---------------------------------------------------------------------------

let renderer = null;
let scene = null;
let camera = null;
let brandGroup = null;      // Group holding diamond + ring
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

// Material reference for opacity fade
let brandMaterial = null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Clamp a number between min and max.
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation.
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Re-map a value from one range to another, clamped to the output range.
 */
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
// Build the 3D brand mark
// ---------------------------------------------------------------------------

function createBrandMark() {
  const group = new THREE.Group();

  // -- Shared material -------------------------------------------------------

  brandMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x0a0e1a),
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    transparent: true,
    opacity: 1,
  });

  // -- Diamond (scaled octahedron) -------------------------------------------

  const diamondGeo = new THREE.OctahedronGeometry(1.0, 0);
  const diamond = new THREE.Mesh(diamondGeo, brandMaterial);
  diamond.scale.set(1.0, 1.4, 1.0); // tall diamond silhouette
  group.add(diamond);

  // -- Torus ring ------------------------------------------------------------

  const torusTube = 0.025;
  const torusRadius = 1.3;
  const torusRadialSegments = _isMobile ? 12 : 16;
  const torusTubularSegments = _isMobile ? 32 : 64;

  const torusGeo = new THREE.TorusGeometry(
    torusRadius,
    torusTube,
    torusRadialSegments,
    torusTubularSegments
  );

  const ring = new THREE.Mesh(torusGeo, brandMaterial);
  ring.rotation.x = Math.PI / 2; // tilt so ring sits horizontally around diamond
  group.add(ring);

  return group;
}

// ---------------------------------------------------------------------------
// Lighting
// ---------------------------------------------------------------------------

function setupLighting() {
  // Ambient — very subtle fill
  const ambient = new THREE.AmbientLight(0x1a1a2e, 0.4);
  scene.add(ambient);

  // Key directional light
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(3, 5, 4);
  scene.add(dirLight);

  // Neoeffex blue accent
  const bluePoint = new THREE.PointLight(0x2d7dff, 1.2, 20);
  bluePoint.position.set(-3, 2, 3);
  scene.add(bluePoint);

  // Lighter blue fill
  const lightBluePoint = new THREE.PointLight(0x7fb2ff, 0.6, 20);
  lightBluePoint.position.set(4, -1, -2);
  scene.add(lightBluePoint);
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

  // -- Base rotation ---------------------------------------------------------

  brandGroup.rotation.y += 0.003;
  brandGroup.rotation.x += 0.001;

  // -- Floating (sine wave on Y) --------------------------------------------

  brandGroup.position.y = Math.sin(elapsed * 0.001) * 0.08;

  // -- Mouse interaction (lerp towards target) ------------------------------

  if (!_isMobile) {
    mouseCurrentX = lerp(mouseCurrentX, mouseTargetX, 0.04);
    mouseCurrentY = lerp(mouseCurrentY, mouseTargetY, 0.04);

    brandGroup.rotation.y += mouseCurrentX * 0.3;
    brandGroup.rotation.x += mouseCurrentY * 0.15;
  }

  // -- Scroll-driven transforms ---------------------------------------------

  applyScrollTransforms();

  renderer.render(scene, camera);
}

/**
 * Apply scale / position / opacity changes driven by scroll progress.
 */
function applyScrollTransforms() {
  const p = scrollProgress;

  if (p <= 0.3) {
    // Phase 1 — scale up & fade in
    const scale = mapRange(p, 0, 0.3, 0.6, 1.0);
    brandGroup.scale.setScalar(scale);
    brandMaterial.opacity = mapRange(p, 0, 0.3, 0, 1);
  } else if (p <= 0.7) {
    // Phase 2 — slow additional rotation, slight shift right
    brandGroup.scale.setScalar(1.0);
    brandMaterial.opacity = 1;

    const shiftX = mapRange(p, 0.3, 0.7, 0, 0.5);
    brandGroup.position.x = shiftX;
  } else {
    // Phase 3 — scale down & fade out
    const scale = mapRange(p, 0.7, 1.0, 1.0, 0.7);
    brandGroup.scale.setScalar(scale);
    brandMaterial.opacity = mapRange(p, 0.7, 1.0, 1, 0);

    // Keep the rightward shift from Phase 2
    brandGroup.position.x = 0.5;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Initialise the Three.js scene inside the given container.
 *
 * @param {HTMLElement} container - DOM element to host the canvas (e.g. `#threeCanvas`).
 * @param {object}      options
 * @param {boolean}     options.isMobile      - Simplify geometry & skip mouse.
 * @param {boolean}     options.reducedMotion - Render a single static frame.
 * @returns {{ destroy: Function } | null} Handle, or null on failure.
 */
export function init(container, options = {}) {
  try {
    _isMobile = !!options.isMobile;
    _reducedMotion = !!options.reducedMotion;
    _container = container;

    // ----- Renderer ---------------------------------------------------------

    const maxDPR = _isMobile ? 1.0 : 1.5;

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
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
    camera.position.set(0, 0, 5);

    // ----- Lighting ---------------------------------------------------------

    setupLighting();

    // ----- Brand mark -------------------------------------------------------

    brandGroup = createBrandMark();
    scene.add(brandGroup);

    // ----- Start time -------------------------------------------------------

    startTime = performance.now();

    // ----- Visibility observer ----------------------------------------------

    setupVisibilityObserver(container);

    // ----- Resize listener --------------------------------------------------

    window.addEventListener('resize', onResize);

    // ----- Render -----------------------------------------------------------

    if (_reducedMotion) {
      // Static single render — no animation loop
      applyScrollTransforms();
      renderer.render(scene, camera);
    } else {
      animationId = requestAnimationFrame(animate);
    }

    return { destroy };
  } catch (err) {
    // WebGL unavailable or any other init error — let caller show CSS fallback
    console.warn('[Neoeffex 3D] Initialisation failed:', err);
    return null;
  }
}

/**
 * Update the scroll progress value (0 → 1).
 *
 * @param {number} progress - Normalised scroll position, 0 at top, 1 at bottom.
 */
export function updateScrollProgress(progress) {
  scrollProgress = clamp(progress, 0, 1);

  // If reduced-motion, re-render the single frame with new scroll state
  if (_reducedMotion && renderer && scene && camera) {
    applyScrollTransforms();
    renderer.render(scene, camera);
  }
}

/**
 * Update the mouse position for interactive rotation.
 *
 * @param {number} normalizedX - Horizontal position, –1 (left) to 1 (right).
 * @param {number} normalizedY - Vertical position, –1 (top) to 1 (bottom).
 */
export function updateMouse(normalizedX, normalizedY) {
  if (_isMobile || _reducedMotion) return;
  mouseTargetX = clamp(normalizedX, -1, 1);
  mouseTargetY = clamp(normalizedY, -1, 1);
}

/**
 * Tear down the scene — dispose GPU resources and remove DOM / listeners.
 */
export function destroy() {
  // Stop animation loop
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // Disconnect visibility observer
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Remove resize listener
  window.removeEventListener('resize', onResize);
  clearTimeout(resizeTimer);

  // Dispose Three.js objects
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

  // Dispose renderer and remove canvas
  if (renderer) {
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    renderer = null;
  }

  // Null out references
  scene = null;
  camera = null;
  brandGroup = null;
  brandMaterial = null;
  _container = null;
}

// ---------------------------------------------------------------------------
// Auto-initialisation — runs after the page is already usable
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('threeCanvas');
  const fallback = document.getElementById('threeFallback');
  if (!container) return;

  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handle = init(container, { isMobile, reducedMotion });

  if (!handle) {
    // WebGL failed — show CSS fallback
    if (fallback) fallback.classList.add('is-active');
    return;
  }

  // --- Mouse integration (shared with Etapa 2 cursor) --------------------
  if (!isMobile && !reducedMotion) {
    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      updateMouse(nx, ny);
    });
  }

  // --- ScrollTrigger integration ------------------------------------------
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
