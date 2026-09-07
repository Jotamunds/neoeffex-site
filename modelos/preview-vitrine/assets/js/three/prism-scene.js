/**
 * Neoeffex 3D Scene — Interactive Spatial Prism (WebGL Nativo Three.js)
 * Etapa 5 — Migração Definitiva de CSS 3D para WebGL
 *
 * Implements two-pass transparency (BackSide + FrontSide), crisp edges,
 * internal technological core, dual orbital rings, and smooth Pointer Events
 * drag & inertia physics with zero CSS 3D composition glitches.
 *
 * @module prism-scene
 */

import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Shaders para Vidro Tecnológico com Efeito Fresnel Discreto
// ---------------------------------------------------------------------------

const FRESNEL_VERTEX_SHADER = `
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`;

const FRESNEL_FRAGMENT_SHADER = `
uniform vec3 uBaseColor;
uniform vec3 uEdgeColor;
uniform float uFresnelPower;
uniform float uMinAlpha;
uniform float uMaxAlpha;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Suporte simétrico a BackSide e FrontSide via abs(dot)
    float dotNV = abs(dot(normal, viewDir));
    float fresnel = clamp(1.0 - dotNV, 0.0, 1.0);
    fresnel = pow(fresnel, uFresnelPower);
    
    vec3 color = mix(uBaseColor, uEdgeColor, fresnel * 0.85);
    float alpha = mix(uMinAlpha, uMaxAlpha, fresnel);
    
    gl_FragColor = vec4(color, alpha);
}
`;

// ---------------------------------------------------------------------------
// Inicialização do Prisma WebGL
// ---------------------------------------------------------------------------

function initPrismWebGL() {
    const spatialViewport = document.getElementById('spatialViewport') || document.getElementById('interactive3dViewport');
    if (!spatialViewport) return;

    // Localiza ou cria o elemento canvas dedicado ao Prisma
    let canvas = document.getElementById('spatialPrismCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'spatialPrismCanvas';
        canvas.className = 'spatial-prism-canvas';
        canvas.setAttribute('aria-label', 'Demonstração 3D interativa de prisma');
        spatialViewport.insertBefore(canvas, spatialViewport.firstChild);
    }

    // Dimensões iniciais
    const initialWidth = spatialViewport.clientWidth || 420;
    const initialHeight = spatialViewport.clientHeight || 420;

    // 1. WebGLRenderer dedicado e isolado
    const isMobile = window.innerWidth <= 768;
    const maxPixelRatio = isMobile ? 1.25 : 1.5;
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
    renderer.setSize(initialWidth, initialHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 2. Cena e Câmera Perspectiva
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, initialWidth / initialHeight, 0.1, 100);
    camera.position.set(0, 0, 7.2);
    camera.lookAt(0, 0, 0);

    // 3. Grupo Principal do Prisma (transformado pela física)
    const prismGroup = new THREE.Group();
    scene.add(prismGroup);

    // Geometria estrutural do cubo (escala calibrada para coincidir visualmente com os 190px da versão CSS)
    const boxSize = 2.3;
    const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);

    // -----------------------------------------------------------------------
    // Transparência em Dois Passes (Elimina Sorting Glitches)
    // -----------------------------------------------------------------------

    // 3.1 Back Pass (Render Order 1: faces traseiras com baixa opacidade)
    const backMaterial = new THREE.ShaderMaterial({
        vertexShader: FRESNEL_VERTEX_SHADER,
        fragmentShader: FRESNEL_FRAGMENT_SHADER,
        uniforms: {
            uBaseColor: { value: new THREE.Color(0x06142a) },
            uEdgeColor: { value: new THREE.Color(0x1e86ff) },
            uFresnelPower: { value: 2.2 },
            uMinAlpha: { value: 0.07 },
            uMaxAlpha: { value: 0.25 }
        },
        side: THREE.BackSide,
        transparent: true,
        depthTest: true,
        depthWrite: false
    });
    const backMesh = new THREE.Mesh(boxGeometry, backMaterial);
    backMesh.renderOrder = 1;
    prismGroup.add(backMesh);

    // 3.2 Core Tecnológico Interno (Render Order 2: contido no interior do cubo)
    const coreGroup = new THREE.Group();
    coreGroup.renderOrder = 2;

    // Estrutura geométrica octaédrica interna
    const coreOctaGeom = new THREE.OctahedronGeometry(0.55, 0);
    const coreOctaEdges = new THREE.EdgesGeometry(coreOctaGeom);
    const coreLineMat = new THREE.LineBasicMaterial({
        color: 0x64b5f6,
        transparent: true,
        opacity: 0.75,
        depthTest: true,
        depthWrite: false
    });
    const coreMesh = new THREE.LineSegments(coreOctaEdges, coreLineMat);
    coreMesh.renderOrder = 2;
    coreGroup.add(coreMesh);

    // Ponto nodal central sutilmente iluminado
    const nodeGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({
        color: 0x90caf9,
        transparent: true,
        opacity: 0.85,
        depthTest: true,
        depthWrite: false
    });
    const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
    nodeMesh.renderOrder = 2;
    coreGroup.add(nodeMesh);

    // Micro-anel interno equatorial
    const innerRingPoints = [];
    for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        innerRingPoints.push(new THREE.Vector3(Math.cos(theta) * 0.35, Math.sin(theta) * 0.35, 0));
    }
    const innerRingGeom = new THREE.BufferGeometry().setFromPoints(innerRingPoints);
    const innerRingMat = new THREE.LineBasicMaterial({
        color: 0x42a5f5,
        transparent: true,
        opacity: 0.7,
        depthTest: true,
        depthWrite: false
    });
    const innerRing = new THREE.LineLoop(innerRingGeom, innerRingMat);
    innerRing.rotation.x = Math.PI / 3;
    innerRing.renderOrder = 2;
    coreGroup.add(innerRing);

    prismGroup.add(coreGroup);

    // 3.3 Front Pass (Render Order 3: faces frontais translúcidas com destaque nas bordas)
    const frontMaterial = new THREE.ShaderMaterial({
        vertexShader: FRESNEL_VERTEX_SHADER,
        fragmentShader: FRESNEL_FRAGMENT_SHADER,
        uniforms: {
            uBaseColor: { value: new THREE.Color(0x0a1e3d) },
            uEdgeColor: { value: new THREE.Color(0x56aeff) },
            uFresnelPower: { value: 2.5 },
            uMinAlpha: { value: 0.12 },
            uMaxAlpha: { value: 0.42 }
        },
        side: THREE.FrontSide,
        transparent: true,
        depthTest: true,
        depthWrite: false
    });
    const frontMesh = new THREE.Mesh(boxGeometry, frontMaterial);
    frontMesh.renderOrder = 3;
    prismGroup.add(frontMesh);

    // 3.4 Arestas (Render Order 4: contornos nítidos e estáveis em azul claro)
    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
        color: 0x72bcff,
        transparent: true,
        opacity: 0.85,
        depthTest: true,
        depthWrite: false
    });
    const edgesMesh = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    edgesMesh.renderOrder = 4;
    prismGroup.add(edgesMesh);

    // 3.5 Anéis Orbitais Tridimensionais (Render Order 5: passam à frente e atrás do prisma em 3D real)
    const ringsGroup = new THREE.Group();
    ringsGroup.renderOrder = 5;

    // Anel 1 (raio equivalente a 320px no layout)
    const ring1Points = [];
    for (let i = 0; i <= 96; i++) {
        const theta = (i / 96) * Math.PI * 2;
        ring1Points.push(new THREE.Vector3(Math.cos(theta) * 1.95, Math.sin(theta) * 1.95, 0));
    }
    const ring1Geom = new THREE.BufferGeometry().setFromPoints(ring1Points);
    const ring1Mat = new THREE.LineBasicMaterial({
        color: 0x72bcff,
        transparent: true,
        opacity: 0.38,
        depthTest: true,
        depthWrite: false
    });
    const ring1Pivot = new THREE.Group();
    ring1Pivot.rotation.x = THREE.MathUtils.degToRad(68);
    ring1Pivot.rotation.y = THREE.MathUtils.degToRad(18);

    const ring1Loop = new THREE.LineLoop(ring1Geom, ring1Mat);
    ring1Loop.renderOrder = 5;
    ring1Pivot.add(ring1Loop);
    ringsGroup.add(ring1Pivot);

    // Anel 2 (raio equivalente a 380px no layout)
    const ring2Points = [];
    for (let i = 0; i <= 96; i++) {
        const theta = (i / 96) * Math.PI * 2;
        ring2Points.push(new THREE.Vector3(Math.cos(theta) * 2.35, Math.sin(theta) * 2.35, 0));
    }
    const ring2Geom = new THREE.BufferGeometry().setFromPoints(ring2Points);
    const ring2Mat = new THREE.LineBasicMaterial({
        color: 0x1e86ff,
        transparent: true,
        opacity: 0.26,
        depthTest: true,
        depthWrite: false
    });
    const ring2Pivot = new THREE.Group();
    ring2Pivot.rotation.x = THREE.MathUtils.degToRad(-42);
    ring2Pivot.rotation.y = THREE.MathUtils.degToRad(32);

    const ring2Loop = new THREE.LineLoop(ring2Geom, ring2Mat);
    ring2Loop.renderOrder = 5;
    ring2Pivot.add(ring2Loop);
    ringsGroup.add(ring2Pivot);

    prismGroup.add(ringsGroup);

    // -----------------------------------------------------------------------
    // Física de Interação e Parâmetros Preservados da Etapa 5
    // -----------------------------------------------------------------------

    const DRAG_THRESHOLD = 4; // px
    const ROT_SENSITIVITY = 0.38; // deg/px
    const MAX_ANGULAR_VELOCITY = 260; // deg/s
    const INERTIA_DECAY = 3.4;

    let rotX = -18;
    let rotY = 25;
    let velX = 0;
    let velY = 0;
    let dragRestRotX = -18;
    let dragRestRotY = 25;

    window.__spatialPrismThreeInstance = {
        getRotX: () => rotX,
        getRotY: () => rotY,
        getVelX: () => velX,
        getVelY: () => velY,
        prismGroup: prismGroup
    };

    let isPointerDown = false;
    let isDragging = false;
    let activePointerId = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let lastClientX = 0;
    let lastClientY = 0;
    let lastMoveTime = performance.now();

    let isHovered = false;
    let hoverNormX = 0;
    let hoverNormY = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Aplicação estática para modo de movimento reduzido
    if (prefersReducedMotion) {
        prismGroup.rotation.x = THREE.MathUtils.degToRad(rotX);
        prismGroup.rotation.y = THREE.MathUtils.degToRad(rotY);
        renderer.render(scene, camera);
        return; // não registra listeners nem loop contínuo
    }

    // -----------------------------------------------------------------------
    // Handlers de Pointer Events no Viewport
    // -----------------------------------------------------------------------

    function onPointerDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        isPointerDown = true;
        isDragging = false;
        activePointerId = e.pointerId;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        lastClientX = e.clientX;
        lastClientY = e.clientY;
        lastMoveTime = performance.now();

        // Cancela qualquer inércia anterior imediatamente ao tocar
        velX = 0;
        velY = 0;
    }

    function onPointerMove(e) {
        if (!isPointerDown) {
            if (e.pointerType !== 'touch') {
                isHovered = true;
                const rect = spatialViewport.getBoundingClientRect();
                hoverNormX = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width - 0.5) * 2));
                hoverNormY = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height - 0.5) * 2));
            }
            return;
        }

        if (e.pointerId !== activePointerId) return;

        const dist = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);

        if (!isDragging && dist >= DRAG_THRESHOLD) {
            isDragging = true;
            spatialViewport.classList.add('is-dragging');

            try {
                if (spatialViewport.setPointerCapture) {
                    spatialViewport.setPointerCapture(e.pointerId);
                }
            } catch (err) {}
        }

        if (isDragging) {
            const now = performance.now();
            const dt = Math.max(0.001, Math.min(0.1, (now - lastMoveTime) / 1000));
            const dx = e.clientX - lastClientX;
            const dy = e.clientY - lastClientY;

            rotY += dx * ROT_SENSITIVITY;
            rotX = Math.max(-75, Math.min(75, rotX + dy * ROT_SENSITIVITY));

            const instVelX = (dy * ROT_SENSITIVITY) / dt;
            const instVelY = (dx * ROT_SENSITIVITY) / dt;
            velX = velX * 0.3 + instVelX * 0.7;
            velY = velY * 0.3 + instVelY * 0.7;

            velX = Math.max(-MAX_ANGULAR_VELOCITY, Math.min(MAX_ANGULAR_VELOCITY, velX));
            velY = Math.max(-MAX_ANGULAR_VELOCITY, Math.min(MAX_ANGULAR_VELOCITY, velY));

            lastClientX = e.clientX;
            lastClientY = e.clientY;
            lastMoveTime = now;
        }
    }

    function endDrag(e) {
        if (activePointerId !== null && e.pointerId === activePointerId) {
            if (isDragging) {
                const timeSinceLastMove = (performance.now() - lastMoveTime) / 1000;
                if (timeSinceLastMove > 0.08) {
                    const dampFactor = Math.max(0, 1 - (timeSinceLastMove - 0.08) * 8);
                    velX *= dampFactor;
                    velY *= dampFactor;
                }

                velX = Math.max(-MAX_ANGULAR_VELOCITY, Math.min(MAX_ANGULAR_VELOCITY, velX));
                velY = Math.max(-MAX_ANGULAR_VELOCITY, Math.min(MAX_ANGULAR_VELOCITY, velY));

                try {
                    if (spatialViewport.hasPointerCapture && spatialViewport.hasPointerCapture(e.pointerId)) {
                        spatialViewport.releasePointerCapture(e.pointerId);
                    }
                } catch (err) {}
            }

            isPointerDown = false;
            isDragging = false;
            activePointerId = null;
            spatialViewport.classList.remove('is-dragging');

            dragRestRotX = rotX;
            dragRestRotY = rotY;
        }
    }

    function onPointerLeave() {
        if (!isDragging && !isPointerDown) {
            isHovered = false;
            hoverNormX = 0;
            hoverNormY = 0;
        }
    }

    function onWindowBlur() {
        if (isPointerDown || isDragging) {
            isPointerDown = false;
            isDragging = false;
            activePointerId = null;
            spatialViewport.classList.remove('is-dragging');
            velX = 0;
            velY = 0;
        }
    }

    spatialViewport.addEventListener('pointerdown', onPointerDown);
    spatialViewport.addEventListener('pointermove', onPointerMove);
    spatialViewport.addEventListener('pointerup', endDrag);
    spatialViewport.addEventListener('pointercancel', endDrag);
    spatialViewport.addEventListener('lostpointercapture', endDrag);
    spatialViewport.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('blur', onWindowBlur);

    // -----------------------------------------------------------------------
    // Loop de Animação e Renderização Único
    // -----------------------------------------------------------------------

    let rafId = null;
    let lastRafTime = performance.now();
    let isIntersecting = false;

    function renderLoop(now) {
        const dt = Math.max(0.001, Math.min(0.08, (now - lastRafTime) / 1000));
        lastRafTime = now;

        // 1. Rotação contínua e suave dos elementos internos e anéis
        coreGroup.rotation.y += dt * 0.45;
        coreGroup.rotation.x += dt * 0.22;
        innerRing.rotation.z += dt * 0.8;

        ring1Loop.rotation.z += dt * (Math.PI * 2 / 22);
        ring2Loop.rotation.z -= dt * (Math.PI * 2 / 28);

        // 2. Física de inércia ou repouso
        if (!isDragging) {
            const speed = Math.hypot(velX, velY);

            if (speed > 0.15) {
                rotX += velX * dt;
                rotY += velY * dt;

                // Limite vertical com absorção de impacto
                if (rotX > 75) {
                    rotX = 75;
                    velX = 0;
                } else if (rotX < -75) {
                    rotX = -75;
                    velX = 0;
                }

                const decay = Math.exp(-INERTIA_DECAY * dt);
                velX *= decay;
                velY *= decay;

                if (Math.hypot(velX, velY) <= 0.15) {
                    velX = 0;
                    velY = 0;
                    dragRestRotX = rotX;
                    dragRestRotY = rotY;
                }
            } else {
                if (isHovered) {
                    const targetHoverX = Math.max(-75, Math.min(75, dragRestRotX + hoverNormY * 12));
                    const targetHoverY = dragRestRotY + hoverNormX * 14;
                    const factor = 1 - Math.exp(-4.5 * dt);
                    rotX += (targetHoverX - rotX) * factor;
                    rotY += (targetHoverY - rotY) * factor;
                } else {
                    const factor = 1 - Math.exp(-3.5 * dt);
                    rotX += (dragRestRotX - rotX) * factor;
                    rotY += (dragRestRotY - rotY) * factor;
                }
            }
        }

        // 3. Normalização periódica do rotY sem snap visual para evitar acúmulos gigantes
        if (Math.abs(rotY) > 720) {
            const turns = Math.trunc(rotY / 360);
            rotY -= turns * 360;
            dragRestRotY -= turns * 360;
        }

        // 4. Aplicação das rotações ao grupo Three.js
        prismGroup.rotation.x = THREE.MathUtils.degToRad(rotX);
        prismGroup.rotation.y = THREE.MathUtils.degToRad(rotY);

        // 5. Renderização na GPU
        renderer.render(scene, camera);

        rafId = requestAnimationFrame(renderLoop);
    }

    function startLoop() {
        if (!rafId && !document.hidden && isIntersecting && !prefersReducedMotion) {
            lastRafTime = performance.now();
            lastMoveTime = performance.now();
            rafId = requestAnimationFrame(renderLoop);
        }
    }

    function stopLoop() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    // -----------------------------------------------------------------------
    // Autopause com IntersectionObserver & VisibilityChange
    // -----------------------------------------------------------------------

    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isIntersecting = entry.isIntersecting;
            if (isIntersecting) {
                startLoop();
            } else {
                stopLoop();
            }
        });
    }, { threshold: 0.05 });

    intersectionObserver.observe(spatialViewport);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopLoop();
        } else {
            startLoop();
        }
    });

    // -----------------------------------------------------------------------
    // ResizeObserver no spatialViewport
    // -----------------------------------------------------------------------

    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const width = entry.contentRect.width || spatialViewport.clientWidth;
            const height = entry.contentRect.height || spatialViewport.clientHeight;

            if (width > 0 && height > 0) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);

                if (!rafId) {
                    renderer.render(scene, camera);
                }
            }
        }
    });

    resizeObserver.observe(spatialViewport);

    // -----------------------------------------------------------------------
    // Cleanup / Dispose
    // -----------------------------------------------------------------------

    function dispose() {
        stopLoop();
        if (resizeObserver) resizeObserver.disconnect();
        if (intersectionObserver) intersectionObserver.disconnect();

        spatialViewport.removeEventListener('pointerdown', onPointerDown);
        spatialViewport.removeEventListener('pointermove', onPointerMove);
        spatialViewport.removeEventListener('pointerup', endDrag);
        spatialViewport.removeEventListener('pointercancel', endDrag);
        spatialViewport.removeEventListener('lostpointercapture', endDrag);
        spatialViewport.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('blur', onWindowBlur);

        boxGeometry.dispose();
        edgesGeometry.dispose();
        coreOctaGeom.dispose();
        coreOctaEdges.dispose();
        nodeGeom.dispose();
        innerRingGeom.dispose();
        ring1Geom.dispose();
        ring2Geom.dispose();

        backMaterial.dispose();
        frontMaterial.dispose();
        edgesMaterial.dispose();
        coreLineMat.dispose();
        nodeMat.dispose();
        innerRingMat.dispose();
        ring1Mat.dispose();
        ring2Mat.dispose();

        renderer.dispose();
        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
    }

    window.__neoeffexDisposePrism = dispose;
}

// Inicialização automática após carregamento do DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrismWebGL);
} else {
    initPrismWebGL();
}
