import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "./config.js";

gsap.registerPlugin(ScrollTrigger);

function makeNoiseTexture({ base, speckles, lines = false, size = 256 }) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    context.fillStyle = base;
    context.fillRect(0, 0, size, size);

    let seed = 92821;
    const random = () => {
        seed = (seed * 48271) % 2147483647;
        return seed / 2147483647;
    };

    speckles.forEach(({ color, count, min = 1, max = 4, alpha = 1 }) => {
        context.fillStyle = color;
        context.globalAlpha = alpha;
        for (let index = 0; index < count; index += 1) {
            const radius = min + random() * (max - min);
            context.beginPath();
            context.arc(random() * size, random() * size, radius, 0, Math.PI * 2);
            context.fill();
        }
    });

    if (lines) {
        context.globalAlpha = 0.16;
        context.strokeStyle = "#120805";
        context.lineWidth = 2;
        for (let row = 0; row < 16; row += 1) {
            const y = 18 + row * 15 + random() * 4;
            context.beginPath();
            context.moveTo(0, y);
            for (let x = 0; x <= size; x += 22) {
                context.quadraticCurveTo(x + 10, y + (random() - 0.5) * 7, x + 22, y + (random() - 0.5) * 3);
            }
            context.stroke();
        }
    }

    context.globalAlpha = 1;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.35, 1.35);
    texture.needsUpdate = true;
    return texture;
}

function makeBumpTexture({ contrast = 1, size = 256 }) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    const data = context.createImageData(size, size);
    let seed = 71237;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
    };
    for (let index = 0; index < data.data.length; index += 4) {
        const value = Math.max(0, Math.min(255, 128 + (random() - 0.5) * 120 * contrast));
        data.data[index] = value;
        data.data[index + 1] = value;
        data.data[index + 2] = value;
        data.data[index + 3] = 255;
    }
    context.putImageData(data, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2.4, 2.4);
    return texture;
}

function makeSteamTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 56);
    gradient.addColorStop(0, "rgba(255,255,255,.52)");
    gradient.addColorStop(0.35, "rgba(255,238,224,.20)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
}

function createMaterials(renderer) {
    const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const bunMap = makeNoiseTexture({
        base: "#c8752b",
        speckles: [
            { color: "#efa75d", count: 160, min: 0.5, max: 2.2, alpha: 0.48 },
            { color: "#6f2f12", count: 80, min: 0.7, max: 2.7, alpha: 0.20 }
        ]
    });
    const meatMap = makeNoiseTexture({
        base: "#4b1e13",
        speckles: [
            { color: "#23100c", count: 330, min: 0.8, max: 3.8, alpha: 0.82 },
            { color: "#a34d28", count: 120, min: 0.5, max: 2.4, alpha: 0.28 }
        ],
        lines: true
    });
    bunMap.anisotropy = maxAnisotropy;
    meatMap.anisotropy = maxAnisotropy;

    const bunBump = makeBumpTexture({ contrast: 0.48 });
    const meatBump = makeBumpTexture({ contrast: 1.25 });

    return {
        bun: new THREE.MeshPhysicalMaterial({
            color: 0xd47f33,
            map: bunMap,
            bumpMap: bunBump,
            bumpScale: 0.035,
            roughness: 0.46,
            metalness: 0,
            clearcoat: 0.12,
            clearcoatRoughness: 0.72,
            sheen: 0.18,
            sheenColor: new THREE.Color(0xff8b3a)
        }),
        bunDark: new THREE.MeshPhysicalMaterial({
            color: 0xaa5721,
            map: bunMap,
            bumpMap: bunBump,
            bumpScale: 0.025,
            roughness: 0.52,
            clearcoat: 0.08,
            clearcoatRoughness: 0.8
        }),
        meat: new THREE.MeshStandardMaterial({
            color: 0x542014,
            map: meatMap,
            bumpMap: meatBump,
            bumpScale: 0.085,
            roughness: 0.78,
            metalness: 0
        }),
        cheese: new THREE.MeshPhysicalMaterial({
            color: 0xffaa24,
            roughness: 0.28,
            metalness: 0,
            clearcoat: 0.16,
            clearcoatRoughness: 0.6
        }),
        bacon: new THREE.MeshPhysicalMaterial({
            color: 0xb24e2a,
            roughness: 0.48,
            clearcoat: 0.18,
            clearcoatRoughness: 0.58
        }),
        lettuce: new THREE.MeshStandardMaterial({ color: 0x517a2e, roughness: 0.72, side: THREE.DoubleSide }),
        pickle: new THREE.MeshPhysicalMaterial({ color: 0x6f8d36, roughness: 0.42, clearcoat: 0.14 }),
        onion: new THREE.MeshPhysicalMaterial({
            color: 0xd7b7d8,
            roughness: 0.32,
            transparent: true,
            opacity: 0.86,
            transmission: 0.06,
            thickness: 0.12
        }),
        sauce: new THREE.MeshPhysicalMaterial({ color: 0x8d2114, roughness: 0.26, clearcoat: 0.3, clearcoatRoughness: 0.42 }),
        seed: new THREE.MeshStandardMaterial({ color: 0xf2d293, roughness: 0.58 })
    };
}

function materialForName(name, materials) {
    const value = name.toLowerCase();
    if (value.includes("bottom_bun")) return materials.bunDark;
    if (value.includes("bun")) return materials.bun;
    if (value.includes("patty")) return materials.meat;
    if (value.includes("cheese")) return materials.cheese;
    if (value.includes("bacon")) return materials.bacon;
    if (value.includes("lettuce")) return materials.lettuce;
    if (value.includes("pickle")) return materials.pickle;
    if (value.includes("onion")) return materials.onion;
    if (value.includes("sauce")) return materials.sauce;
    if (value.includes("sesame")) return materials.seed;
    return null;
}

function addSteam(scene) {
    const texture = makeSteamTexture();
    const steam = [];
    for (let index = 0; index < 8; index += 1) {
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            opacity: 0.16,
            color: index % 2 ? 0xffeee4 : 0xffffff,
            blending: THREE.AdditiveBlending
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.set((Math.random() - 0.5) * 2.1, 1.2 + Math.random() * 2.0, (Math.random() - 0.5) * 0.55);
        const scale = 0.55 + Math.random() * 0.55;
        sprite.scale.set(scale, scale * 1.25, 1);
        sprite.userData = {
            baseX: sprite.position.x,
            speed: 0.15 + Math.random() * 0.14,
            phase: Math.random() * Math.PI * 2
        };
        scene.add(sprite);
        steam.push(sprite);
    }
    return steam;
}

function addEmbers(scene) {
    const count = 28;
    const positions = new Float32Array(count * 3);
    const speeds = [];
    for (let index = 0; index < count; index += 1) {
        positions[index * 3] = (Math.random() - 0.5) * 4.4;
        positions[index * 3 + 1] = -1.1 + Math.random() * 3.9;
        positions[index * 3 + 2] = (Math.random() - 0.5) * 1.2;
        speeds.push(0.08 + Math.random() * 0.18);
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

function animateModelAssembly(modelRoot, reducedMotion) {
    if (reducedMotion) return;
    const layers = [];
    modelRoot.traverse((object) => {
        if (!object.isMesh || !object.name) return;
        const originalZ = object.position.z;
        const normalized = THREE.MathUtils.clamp((originalZ - 1.1) / 1.5, -1, 1);
        object.userData.originalZ = originalZ;
        object.position.z = originalZ + normalized * 1.7 + (normalized >= 0 ? 0.34 : -0.2);
        layers.push(object);
    });

    gsap.to(modelRoot.scale, { x: 1, y: 1, z: 1, duration: 1.25, ease: "power3.out" });
    gsap.to(modelRoot.rotation, { z: 0, duration: 1.5, ease: "power3.out" });
    layers.forEach((layer, index) => {
        gsap.to(layer.position, {
            z: layer.userData.originalZ,
            duration: 1.05,
            delay: 0.12 + index * 0.018,
            ease: "back.out(1.25)"
        });
    });
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
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !compact;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const pixelRatioLimit = compact ? siteConfig.hero3d.mobilePixelRatio : siteConfig.hero3d.maxPixelRatio;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioLimit));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(compact ? 38 : 32, 1, 0.1, 50);
    camera.position.set(0, compact ? 0.35 : 0.15, compact ? 7.4 : 6.7);

    const modelRig = new THREE.Group();
    const modelRoot = new THREE.Group();
    modelRoot.rotation.x = -Math.PI / 2;
    modelRoot.rotation.z = reducedMotion ? 0 : -0.08;
    modelRoot.scale.setScalar(reducedMotion ? 1 : 0.82);
    modelRig.add(modelRoot);
    scene.add(modelRig);

    const warmKey = new THREE.SpotLight(0xff8a3d, 72, 15, Math.PI / 5.5, 0.6, 1.35);
    warmKey.position.set(4.3, 5.2, 4.2);
    warmKey.target.position.set(0, 0.7, 0);
    warmKey.castShadow = !compact;
    warmKey.shadow.mapSize.set(compact ? 512 : 1024, compact ? 512 : 1024);
    scene.add(warmKey, warmKey.target);

    const fill = new THREE.DirectionalLight(0xffd2b0, 2.4);
    fill.position.set(-4, 2.6, 4);
    scene.add(fill);

    const rim = new THREE.PointLight(0xff5a16, 38, 11, 1.5);
    rim.position.set(-3.1, 3.2, -2.7);
    scene.add(rim);

    const coolFill = new THREE.PointLight(0x6584ff, 8, 10, 2);
    coolFill.position.set(2, -1.5, -3.5);
    scene.add(coolFill);

    const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(5.4, 3.4),
        new THREE.ShadowMaterial({ color: 0x000000, transparent: true, opacity: 0.34 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -1.55, 0.1);
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const steam = compact ? [] : addSteam(scene);
    const embers = addEmbers(scene);
    const materials = createMaterials(renderer);
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
        model.traverse((object) => {
            if (!object.isMesh) return;
            object.castShadow = !compact;
            object.receiveShadow = true;
            const material = materialForName(`${object.name || ""} ${object.parent?.name || ""}`, materials);
            if (material) object.material = material;
        });

        modelRoot.add(model);
        model.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(modelRoot);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.z -= center.y - 0.18;

        modelLoaded = true;
        stage.classList.add("is-webgl-ready");
        animateModelAssembly(modelRoot, reducedMotion);

        if (!reducedMotion) {
            gsap.to(modelRig.position, {
                y: 0.12,
                duration: 2.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            gsap.to(modelRig.rotation, {
                y: 0.09,
                duration: 4.6,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            gsap.to(modelRig.rotation, {
                z: -0.04,
                duration: 3.6,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            ScrollTrigger.create({
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.7,
                onUpdate: (self) => {
                    modelRig.position.x = self.progress * (compact ? 0.18 : 0.55);
                    modelRig.rotation.y = self.progress * 0.36;
                    modelRig.scale.setScalar(1 - self.progress * 0.09);
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
            sprite.position.x = sprite.userData.baseX + Math.sin(elapsed * 0.7 + sprite.userData.phase) * 0.18;
            sprite.material.opacity = 0.08 + (1 - Math.min((sprite.position.y - 1.1) / 3.0, 1)) * 0.14;
            if (sprite.position.y > 4.1) {
                sprite.position.y = 1.3 + (index % 3) * 0.12;
                sprite.position.x = sprite.userData.baseX;
            }
        });

        const positions = embers.points.geometry.attributes.position.array;
        for (let index = 0; index < embers.speeds.length; index += 1) {
            positions[index * 3 + 1] += embers.speeds[index] * delta;
            positions[index * 3] += Math.sin(elapsed * 1.4 + index) * 0.0007;
            if (positions[index * 3 + 1] > 3.0) positions[index * 3 + 1] = -1.05;
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
            modelRoot.rotation.y = pointerSmooth.x * 0.16;
            modelRoot.rotation.z = pointerSmooth.y * -0.055;
            camera.position.x = pointerSmooth.x * 0.18;
            camera.position.y = (compact ? 0.35 : 0.15) + pointerSmooth.y * -0.10;
            warmKey.position.x = 4.3 + pointerSmooth.x * 1.2;
            warmKey.position.y = 5.2 + pointerSmooth.y * -0.8;
            updateParticles(elapsed, delta);
        }

        camera.lookAt(0, compact ? 0.15 : 0.2, 0);
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
        Object.values(materials).forEach((material) => material.dispose());
    }, { once: true });

    window.setTimeout(() => {
        if (!modelLoaded) stage.classList.add("is-loading-model");
    }, 350);
}
