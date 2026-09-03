import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "./config.js";

gsap.registerPlugin(ScrollTrigger);

function makeSteamTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 56);
    gradient.addColorStop(0, "rgba(255,255,255,.62)");
    gradient.addColorStop(0.35, "rgba(255,238,224,.24)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
}

function addSteam(scene) {
    const texture = makeSteamTexture();
    const steam = [];
    for (let index = 0; index < 7; index += 1) {
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            opacity: 0.18,
            color: index % 2 ? 0xffeee4 : 0xffffff,
            blending: THREE.AdditiveBlending
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.set((Math.random() - 0.5) * 2.0, 1.0 + Math.random() * 1.5, (Math.random() - 0.5) * 0.4);
        const scale = 0.55 + Math.random() * 0.5;
        sprite.scale.set(scale, scale * 1.18, 1);
        sprite.userData = {
            baseX: sprite.position.x,
            speed: 0.14 + Math.random() * 0.14,
            phase: Math.random() * Math.PI * 2
        };
        scene.add(sprite);
        steam.push(sprite);
    }
    return steam;
}

function addEmbers(scene) {
    const count = 24;
    const positions = new Float32Array(count * 3);
    const speeds = [];
    for (let index = 0; index < count; index += 1) {
        positions[index * 3] = (Math.random() - 0.5) * 4.2;
        positions[index * 3 + 1] = -1.1 + Math.random() * 3.7;
        positions[index * 3 + 2] = (Math.random() - 0.5) * 1.1;
        speeds.push(0.08 + Math.random() * 0.16);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
        color: 0xff7a21,
        size: 0.035,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    return { points, speeds };
}

function enhanceMaterial(material, renderer) {
    if (!material) return;
    const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const textures = [
        material.map,
        material.normalMap,
        material.roughnessMap,
        material.metalnessMap,
        material.aoMap,
        material.emissiveMap
    ].filter(Boolean);

    textures.forEach((texture) => {
        texture.anisotropy = anisotropy;
        if (texture === material.map || texture === material.emissiveMap) {
            texture.colorSpace = THREE.SRGBColorSpace;
        }
    });

    material.envMapIntensity = material.envMapIntensity ?? 1.1;
    material.needsUpdate = true;
}

function fitModel(model, compact) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    model.position.sub(center);

    const targetWidth = compact ? 4.0 : 4.45;
    const targetHeight = compact ? 3.05 : 3.5;
    const width = Math.max(size.x, size.z);
    const height = size.y;
    const scale = Math.min(targetWidth / Math.max(width, 0.01), targetHeight / Math.max(height, 0.01));
    model.scale.setScalar(scale);

    const fitted = new THREE.Box3().setFromObject(model);
    const fittedSize = fitted.getSize(new THREE.Vector3());
    const fittedCenter = fitted.getCenter(new THREE.Vector3());
    model.position.x -= fittedCenter.x;
    model.position.y -= fittedCenter.y - (compact ? -0.04 : -0.02);
    model.position.z -= fittedCenter.z;

    return { size: fittedSize };
}

function introAnimation(modelRig, modelRoot, reducedMotion) {
    if (reducedMotion) return;
    modelRig.position.set(0.16, -0.2, 0);
    modelRig.rotation.set(-0.04, -0.28, -0.08);
    modelRig.scale.setScalar(0.84);

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline.to(modelRig.position, { x: 0, y: 0.02, duration: 1.15 }, 0);
    timeline.to(modelRig.rotation, { x: 0, y: 0.10, z: 0, duration: 1.2 }, 0);
    timeline.to(modelRig.scale, { x: 1, y: 1, z: 1, duration: 1.05 }, 0.05);
    timeline.to(modelRoot.rotation, { z: -0.02, duration: 0.9 }, 0.15);
}

export function initBurger3D() {
    const canvas = document.getElementById("burgerCanvas");
    const stage = document.getElementById("burgerStage");
    const hero = document.querySelector(".hero");
    if (!canvas || !stage || !hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const compact = window.matchMedia("(max-width: 720px)").matches;
    let renderer;

    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: !compact,
            alpha: true,
            powerPreference: "high-performance"
        });
    } catch (error) {
        console.warn("WebGL indisponível; usando fallback visual.", error);
        stage.classList.add("burger-stage--fallback");
        return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !compact;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const pixelRatioLimit = compact ? siteConfig.hero3d.mobilePixelRatio : siteConfig.hero3d.maxPixelRatio;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioLimit));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(compact ? 34 : 29, 1, 0.1, 50);
    camera.position.set(0, compact ? 0.20 : 0.14, compact ? 7.3 : 6.5);

    const modelRig = new THREE.Group();
    const modelRoot = new THREE.Group();
    modelRig.add(modelRoot);
    scene.add(modelRig);

    const warmKey = new THREE.SpotLight(0xff9a47, 72, 16, Math.PI / 5.6, 0.64, 1.22);
    warmKey.position.set(4.8, 4.6, 4.2);
    warmKey.target.position.set(0, 0.3, 0.1);
    warmKey.castShadow = !compact;
    warmKey.shadow.mapSize.set(compact ? 512 : 1024, compact ? 512 : 1024);
    scene.add(warmKey, warmKey.target);

    const fill = new THREE.DirectionalLight(0xffead6, 2.2);
    fill.position.set(-4.2, 2.8, 3.8);
    scene.add(fill);

    const rim = new THREE.PointLight(0xff641a, 24, 10, 1.7);
    rim.position.set(-2.4, 2.3, -2.8);
    scene.add(rim);

    const bounce = new THREE.PointLight(0xf9d4b0, 5, 6, 2.2);
    bounce.position.set(0, -1.25, 2.4);
    scene.add(bounce);

    const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(5.8, 3.9),
        new THREE.ShadowMaterial({ color: 0x000000, transparent: true, opacity: 0.27 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -1.42, 0.0);
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const steam = compact ? [] : addSteam(scene);
    const embers = addEmbers(scene);
    const clock = new THREE.Clock();
    const pointer = { x: 0, y: 0 };
    const pointerSmooth = { x: 0, y: 0 };
    let active = true;
    let modelLoaded = false;

    const modelUrl = import.meta.env.BASE_URL + siteConfig.hero3d.model;
    const environmentUrl = import.meta.env.BASE_URL + siteConfig.hero3d.environment;

    const hdrLoader = new RGBELoader();
    hdrLoader.load(environmentUrl, (texture) => {
        const pmrem = new THREE.PMREMGenerator(renderer);
        const environment = pmrem.fromEquirectangular(texture).texture;
        scene.environment = environment;
        texture.dispose();
        pmrem.dispose();
    }, undefined, (error) => {
        console.warn("HDRI não carregou; mantendo iluminação de estúdio local.", error);
    });

    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
        const model = gltf.scene;
        modelRoot.rotation.set(0, Math.PI * 0.07, reducedMotion ? 0 : -0.02);

        model.traverse((object) => {
            if (!object.isMesh) return;
            object.castShadow = !compact;
            object.receiveShadow = true;
            if (Array.isArray(object.material)) object.material.forEach((material) => enhanceMaterial(material, renderer));
            else enhanceMaterial(object.material, renderer);
        });

        fitModel(model, compact);
        modelRoot.add(model);
        modelLoaded = true;
        stage.classList.add("is-webgl-ready");
        introAnimation(modelRig, modelRoot, reducedMotion);

        if (!reducedMotion) {
            gsap.to(modelRig.position, {
                y: 0.08,
                duration: 2.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            gsap.to(modelRig.rotation, {
                y: 0.11,
                duration: 5.0,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            gsap.to(modelRoot.rotation, {
                z: 0.01,
                duration: 4.0,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            ScrollTrigger.create({
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.75,
                onUpdate: (self) => {
                    modelRig.position.x = self.progress * (compact ? 0.10 : 0.30);
                    modelRig.rotation.y = 0.02 + self.progress * 0.17;
                    modelRig.scale.setScalar(1 - self.progress * 0.05);
                }
            });
        }
    }, (event) => {
        if (event.total > 0) {
            const progress = Math.round((event.loaded / event.total) * 100);
            stage.style.setProperty("--load-progress", progress + "%");
        }
    }, (error) => {
        console.warn("Modelo 3D não carregou; usando fallback visual.", error);
        stage.classList.add("burger-stage--fallback");
    });

    if (finePointer && !reducedMotion) {
        hero.addEventListener("pointermove", (event) => {
            const bounds = hero.getBoundingClientRect();
            pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
            pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        });
        hero.addEventListener("pointerleave", () => {
            pointer.x = 0;
            pointer.y = 0;
        });
    }

    function resize() {
        const width = Math.max(stage.clientWidth, 1);
        const height = Math.max(stage.clientHeight, 1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();

    function updateParticles(elapsed, delta) {
        steam.forEach((sprite, index) => {
            sprite.position.y += sprite.userData.speed * delta;
            sprite.position.x = sprite.userData.baseX + Math.sin(elapsed * 0.75 + sprite.userData.phase) * 0.18;
            sprite.material.opacity = 0.10 + (1 - Math.min((sprite.position.y - 1.0) / 3.0, 1)) * 0.15;
            if (sprite.position.y > 3.9) {
                sprite.position.y = 1.2 + (index % 3) * 0.12;
                sprite.position.x = sprite.userData.baseX;
            }
        });

        const positions = embers.points.geometry.attributes.position.array;
        for (let index = 0; index < embers.speeds.length; index += 1) {
            positions[index * 3 + 1] += embers.speeds[index] * delta;
            positions[index * 3] += Math.sin(elapsed * 1.5 + index) * 0.0007;
            if (positions[index * 3 + 1] > 2.8) positions[index * 3 + 1] = -1.05;
        }
        embers.points.geometry.attributes.position.needsUpdate = true;
        embers.points.rotation.y = Math.sin(elapsed * 0.16) * 0.08;
    }

    function render() {
        if (!active) return;
        const delta = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.elapsedTime;

        if (!reducedMotion) {
            pointerSmooth.x += (pointer.x - pointerSmooth.x) * 0.055;
            pointerSmooth.y += (pointer.y - pointerSmooth.y) * 0.055;
            modelRoot.rotation.y = Math.PI * 0.07 + pointerSmooth.x * 0.12;
            modelRoot.rotation.x = pointerSmooth.y * -0.03;
            camera.position.x = pointerSmooth.x * 0.14;
            camera.position.y = (compact ? 0.20 : 0.14) + pointerSmooth.y * -0.06;
            warmKey.position.x = 4.8 + pointerSmooth.x * 0.95;
            warmKey.position.y = 4.6 + pointerSmooth.y * -0.58;
            updateParticles(elapsed, delta);
        }

        camera.lookAt(0, compact ? 0.03 : 0.07, 0);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            active = false;
        } else if (!active) {
            active = true;
            clock.getDelta();
            requestAnimationFrame(render);
        }
    });

    canvas.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        active = false;
        stage.classList.remove("is-webgl-ready");
        stage.classList.add("burger-stage--fallback");
    });

    requestAnimationFrame(render);

    window.addEventListener("beforeunload", () => {
        active = false;
        resizeObserver.disconnect();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        renderer.dispose();
    }, { once: true });

    window.setTimeout(() => {
        if (!modelLoaded) stage.classList.add("is-loading-model");
    }, 350);
}
