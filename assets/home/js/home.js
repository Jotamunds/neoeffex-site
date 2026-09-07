(function () {
    'use strict';

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. Lenis & GSAP ScrollTrigger Setup ---
    let lenis = null;
    if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });
        window.lenis = lenis;

        // Loop de RAF fallback somente se GSAP não estiver disponível
        // Quando GSAP está ativo, o ticker do GSAP assume o controle exclusivo abaixo (Risk 5)
        if (typeof gsap === 'undefined') {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        if (lenis) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        }
    }

    // --- 1.1 Header Fixo e Sempre Visível (Etapa 1) ---
    const topbar = document.querySelector('.topbar');
    if (topbar) {
        const updateHeaderState = () => {
            const y = window.pageYOffset || window.scrollY || 0;
            if (y > 20) {
                topbar.classList.add('topbar--scrolled');
            } else {
                topbar.classList.remove('topbar--scrolled');
            }
        };

        if (lenis) {
            lenis.on('scroll', updateHeaderState);
        }
        window.addEventListener('scroll', updateHeaderState, { passive: true });
        updateHeaderState();
    }

    // --- 2. Central Pointer Engine & Custom Cursor (Etapa 6) ---
    // Fonte única e coerente de estado do ponteiro para Cursor, N de partículas e interações globais.
    const pointerState = {
        clientX: 0,
        clientY: 0,
        ndcX: 0,
        ndcY: 0,
        normX: 0,
        normY: 0,
        active: false,
        hasValidPosition: false,
        pointerType: 'mouse'
    };
    window.__neoeffexPointerState = pointerState;
    window.__neoeffexCentralPointer = true;

    // Cache de dimensões de viewport para zero layout thrashing em pointermove
    let vpWidth = window.innerWidth || 1200;
    let vpHeight = window.innerHeight || 800;
    let vpCenterX = vpWidth / 2;
    let vpCenterY = vpHeight / 2;

    function updateViewportDimensions() {
        vpWidth = window.innerWidth || 1200;
        vpHeight = window.innerHeight || 800;
        vpCenterX = vpWidth / 2;
        vpCenterY = vpHeight / 2;
    }
    window.addEventListener('resize', updateViewportDimensions, { passive: true });

    // Verificação de capacidades e dependências para ativação segura do Custom Cursor
    const cursor = document.getElementById('customCursor');
    const cursorLabel = cursor ? cursor.querySelector('.cursor-label') : null;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const hasGSAP = typeof gsap !== 'undefined';
    const enableCustomCursor = !!(cursor && hasFinePointer && hasGSAP && !prefersReducedMotion);

    let xTo = null;
    let yTo = null;
    let firstCursorMove = false;

    if (enableCustomCursor) {
        // Centralização geométrica estrita via GSAP: xPercent/yPercent: -50 garante que (x,y)
        // represente sempre o CENTRO exato do cursor, sem snap ao alternar de 22px para 68px
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power2.out' });
        yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power2.out' });

        // Adiciona classe de estado no documento APENAS após inicialização bem-sucedida do cursor
        document.documentElement.classList.add('has-custom-cursor');
    }

    // Cache de elementos para Parallax e Magnético
    const parallaxElements = Array.from(document.querySelectorAll('[data-parallax]'));
    const magneticButtons = Array.from(document.querySelectorAll('[data-magnetic]'));

    // --- Listener Único de Movimento do Ponteiro (Pointer Events) ---
    function onCentralPointerMove(e) {
        if (e.pointerType === 'touch') return;

        pointerState.clientX = e.clientX;
        pointerState.clientY = e.clientY;
        pointerState.pointerType = e.pointerType || 'mouse';
        pointerState.active = true;
        pointerState.hasValidPosition = true;

        // 1. Coordenadas normalizadas centradas (-1 a +1) para efeitos de UI globais
        pointerState.normX = (e.clientX - vpCenterX) / vpCenterX;
        pointerState.normY = (e.clientY - vpCenterY) / vpCenterY;

        // 2. Normalização matemática precisa NDC para Three.js (-1..1 no X, +1..-1 no Y)
        // O N recebe imediatamente as coordenadas FÍSICAS REAIS (zero atraso do cursor visual)
        pointerState.ndcX = Math.max(-1, Math.min(1, (e.clientX / vpWidth) * 2 - 1));
        pointerState.ndcY = Math.max(-1, Math.min(1, 1 - (e.clientY / vpHeight) * 2));

        if (typeof window.__neoeffexUpdateMouse === 'function') {
            window.__neoeffexUpdateMouse(pointerState.ndcX, pointerState.ndcY, true);
        }

        // 3. Atualização do Custom Cursor visual
        if (enableCustomCursor) {
            if (!firstCursorMove) {
                firstCursorMove = true;
                // No primeiro movimento, posicionamento direto sem viagem desde o centro da tela
                gsap.set(cursor, { x: e.clientX, y: e.clientY });
                cursor.classList.add('is-visible');
            } else {
                xTo(e.clientX);
                yTo(e.clientY);
                if (!cursor.classList.contains('is-visible')) {
                    cursor.classList.add('is-visible');
                }
            }

            // Delegação robusta para [data-cursor]
            const hoverTarget = (e.target && typeof e.target.closest === 'function')
                ? e.target.closest('[data-cursor]')
                : (document.elementFromPoint ? document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-cursor]') : null);
            if (hoverTarget) {
                const labelText = hoverTarget.getAttribute('data-cursor');
                if (cursorLabel && labelText) {
                    cursorLabel.textContent = labelText;
                }
                cursor.classList.add('is-hovering');
            } else {
                cursor.classList.remove('is-hovering');
                if (cursorLabel) {
                    cursorLabel.textContent = '';
                }
            }
        }

        // 4. Parallax Leve (consumindo a fonte única central de pointer)
        if (parallaxElements.length > 0 && hasGSAP && !prefersReducedMotion) {
            parallaxElements.forEach((el) => {
                const intensity = parseFloat(el.getAttribute('data-parallax')) || 4;
                gsap.to(el, {
                    x: pointerState.normX * intensity,
                    y: pointerState.normY * intensity,
                    duration: 0.6,
                    ease: 'power1.out',
                    overwrite: 'auto'
                });
            });
        }

        // 5. Botões magnéticos (consumindo a mesma leitura de coordenadas)
        if (magneticButtons.length > 0 && hasGSAP && !prefersReducedMotion) {
            magneticButtons.forEach((btn) => {
                const rect = btn.getBoundingClientRect();
                const btnCenterX = rect.left + rect.width / 2;
                const btnCenterY = rect.top + rect.height / 2;
                const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

                if (dist < 70) {
                    const pullX = (e.clientX - btnCenterX) * 0.22;
                    const pullY = (e.clientY - btnCenterY) * 0.22;
                    gsap.to(btn, {
                        x: pullX,
                        y: pullY,
                        duration: 0.3,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                } else {
                    gsap.to(btn, {
                        x: 0,
                        y: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                }
            });
        }
    }

    // Tratamento de saída/entrada da janela e troca de abas
    function onPointerLeaveDocument() {
        pointerState.active = false;
        if (enableCustomCursor && cursor) {
            cursor.classList.remove('is-visible');
        }
        if (typeof window.__neoeffexUpdateMouse === 'function') {
            window.__neoeffexUpdateMouse(pointerState.ndcX, pointerState.ndcY, false);
        }
    }

    function onPointerEnterDocument() {
        pointerState.active = true;
        if (enableCustomCursor && cursor && pointerState.hasValidPosition) {
            cursor.classList.add('is-visible');
        }
    }

    function onWindowBlur() {
        pointerState.active = false;
        if (enableCustomCursor && cursor) {
            cursor.classList.remove('is-visible');
        }
        if (typeof window.__neoeffexUpdateMouse === 'function') {
            window.__neoeffexUpdateMouse(pointerState.ndcX, pointerState.ndcY, false);
        }
    }

    window.addEventListener('pointermove', onCentralPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeaveDocument);
    document.addEventListener('mouseenter', onPointerEnterDocument);
    window.addEventListener('blur', onWindowBlur);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            onWindowBlur();
        }
    });

    // Envia coordenadas para o N se o carregamento da cena terminar após o primeiro movimento
    window.addEventListener('neoeffex:scene-ready', () => {
        if (pointerState.hasValidPosition && typeof window.__neoeffexUpdateMouse === 'function') {
            window.__neoeffexUpdateMouse(pointerState.ndcX, pointerState.ndcY, pointerState.active);
        }
    });

    // --- 5. Mudança de Atmosfera / Tema por Projeto Ativo ---
    const modelCards = document.querySelectorAll('.model-card[data-theme]');
    if (modelCards.length > 0 && 'IntersectionObserver' in window) {
        const themeObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
                    const theme = entry.target.getAttribute('data-theme');
                    if (theme) {
                        document.documentElement.setAttribute('data-active-theme', theme);
                    }
                }
            });
        }, { threshold: [0.35, 0.6] });

        modelCards.forEach((card) => themeObserver.observe(card));

        // Reset do tema ao retornar para o Hero (azul Neoeffex puro)
        const heroEl = document.getElementById('threeSection') || document.getElementById('inicio');
        if (heroEl) {
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
                        document.documentElement.removeAttribute('data-active-theme');
                    }
                });
            }, { threshold: [0.25, 0.6] });
            heroObserver.observe(heroEl);
        }
    }

    // --- 6. Entrada Sincronizada do Hero com Partículas (Etapa 2) ---
    if (typeof gsap !== 'undefined') {
        let heroEntranceStarted = false;

        function startSynchronizedEntrance(particleMat) {
            if (heroEntranceStarted) return;
            heroEntranceStarted = true;

            const mat = particleMat || window.__neoeffexParticleMaterial;

            if (prefersReducedMotion || (window.scrollY && window.scrollY > 80) || (window.__neoeffexCurrentScrollProgress && window.__neoeffexCurrentScrollProgress > 0.02)) {
                // Modo reduzido ou recarga no meio da página: garante exibição direta sem atraso
                gsap.set('.topbar, .hero-title .hero-line', { opacity: 1, y: 0 });
                if (mat && mat.uniforms && mat.uniforms.uIntro) {
                    mat.uniforms.uIntro.value = 1.0;
                }
                return;
            }

            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // 0. Header entra com extrema leveza e lentidão suave
            heroTl.fromTo('.topbar',
                { y: -18, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.3,
                    ease: 'power2.out',
                    onComplete: () => {
                        gsap.set('.topbar', { clearProps: 'transform,opacity' });
                    }
                },
                0
            );

            // 1. Headline surge suavemente em 2 linhas
            heroTl.fromTo('.hero-title .hero-line',
                { y: 35, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, stagger: 0.14 },
                0.15
            );

            // 2. Partículas surgem junto com a headline e ganham presença suavemente
            if (mat && mat.uniforms && mat.uniforms.uIntro) {
                heroTl.to(mat.uniforms.uIntro, {
                    value: 1.0,
                    duration: 1.4,
                    ease: 'power2.out'
                }, 0.2); // surge em sincronia com o texto
            }
        }

        // Coordenação da entrada: aguarda cena 3D, evento ou timeout de segurança (550ms)
        if (window.__neoeffexSceneReady) {
            startSynchronizedEntrance(window.__neoeffexParticleMaterial);
        } else {
            const onReady = (e) => {
                window.removeEventListener('neoeffex:scene-ready', onReady);
                window.removeEventListener('neoeffex:scene-failed', onFailed);
                clearTimeout(safetyTimer);
                startSynchronizedEntrance(e.detail && e.detail.particleMaterial);
            };

            const onFailed = () => {
                window.removeEventListener('neoeffex:scene-ready', onReady);
                window.removeEventListener('neoeffex:scene-failed', onFailed);
                clearTimeout(safetyTimer);
                startSynchronizedEntrance(null);
            };

            window.addEventListener('neoeffex:scene-ready', onReady);
            window.addEventListener('neoeffex:scene-failed', onFailed);

            const safetyTimer = setTimeout(() => {
                window.removeEventListener('neoeffex:scene-ready', onReady);
                window.removeEventListener('neoeffex:scene-failed', onFailed);
                startSynchronizedEntrance(window.__neoeffexParticleMaterial);
            }, 550);
        }

        // --- 6.1 Narrativa de Scroll do Hero (Etapa 3: Formação e Dispersão Reversível do N) ---
        if (typeof ScrollTrigger !== 'undefined') {
            const heroSection = document.getElementById('threeSection');
            if (heroSection) {
                window.__neoeffexHeroTriggerActive = true;

                // Distância dedicada para a transformação do N (250vh desktop, 170vh mobile para permanência visual ampla do N formado)
                const getPinDuration = () => isTouch ? '+=' + Math.round(window.innerHeight * 1.7) : '+=' + Math.round(window.innerHeight * 2.5);

                const heroTrigger = ScrollTrigger.create({
                    trigger: heroSection,
                    start: 'top top',
                    end: getPinDuration,
                    pin: !prefersReducedMotion,
                    pinSpacing: !prefersReducedMotion,
                    scrub: 0.6,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        window.__neoeffexCurrentScrollProgress = progress;

                        if (typeof window.__neoeffexUpdateScrollProgress === 'function') {
                            window.__neoeffexUpdateScrollProgress(progress);
                        }

                        // Esmaecimento suave e reversível da copy do hero na fase inicial da rolagem (0.0 -> 0.20)
                        // Limpa o palco para que o N surja como protagonista no centro da viewport
                        if (!prefersReducedMotion) {
                            if (progress > 0.001) {
                                const copyProgress = Math.min(progress / 0.20, 1.0);
                                gsap.set('.hero__copy', {
                                    opacity: 1 - copyProgress,
                                    y: -26 * copyProgress,
                                    pointerEvents: copyProgress > 0.6 ? 'none' : 'auto'
                                });
                            } else {
                                gsap.set('.hero__copy', {
                                    opacity: 1,
                                    y: 0,
                                    pointerEvents: 'auto'
                                });
                            }
                        }
                    }
                });

                window.__neoeffexHeroScrollTrigger = heroTrigger;

                // Se a cena 3D já estiver inicializada, aplica o progresso atual imediatamente
                if (typeof window.__neoeffexUpdateScrollProgress === 'function') {
                    window.__neoeffexUpdateScrollProgress(heroTrigger.progress);
                }
            }

            // ScrollTrigger para Revelação das Demonstrações Visuais (Etapa 4)
            const demoSections = document.querySelectorAll('.demo-section');
            demoSections.forEach((sec) => {
                const narrative = sec.querySelector('.demo-narrative');
                const stage = sec.querySelector('.demo-stage');

                if (narrative) {
                    gsap.from(narrative, {
                        scrollTrigger: {
                            trigger: sec,
                            start: 'top 82%',
                            toggleActions: 'play none none reverse'
                        },
                        y: 45,
                        opacity: 0,
                        duration: 0.85,
                        ease: 'power3.out'
                    });
                }

                if (stage) {
                    gsap.from(stage, {
                        scrollTrigger: {
                            trigger: sec,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        },
                        y: 55,
                        opacity: 0,
                        scale: 0.96,
                        duration: 0.95,
                        ease: 'power3.out',
                        onComplete: () => {
                            gsap.set(stage, { clearProps: 'transform,opacity' });
                        }
                    });
                }
            });

            // ScrollTrigger para Revelação dos Cards de Projetos
            modelCards.forEach((card) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            });

            // Seção de Fechamento CTA
            const ctaClosing = document.querySelector('.cta-closing__inner');
            if (ctaClosing) {
                gsap.from(ctaClosing, {
                    scrollTrigger: {
                        trigger: ctaClosing,
                        start: 'top 85%'
                    },
                    y: 40,
                    opacity: 0,
                    scale: 0.96,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }
        }

        // --- 7. Fio Condutor: Rolagem Contínua de Partículas Persistentes (Etapa 4) ---
        function updatePageScrollTracking() {
            const scrollY = window.scrollY || window.pageYOffset || 0;
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const pageProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

            if (typeof window.__neoeffexSetPageScroll === 'function') {
                window.__neoeffexSetPageScroll(scrollY, pageProgress);
            }
        }

        window.addEventListener('scroll', updatePageScrollTracking, { passive: true });
        if (lenis) {
            lenis.on('scroll', updatePageScrollTracking);
        }
        // Chamada inicial
        updatePageScrollTracking();

        // --- 8. Interação 3D com o Prisma Espacial (Etapa 5: WebGL Nativo) ---
        // A renderização, animação e interação física do Prisma 3D foram migradas
        // integralmente para o módulo nativo WebGL em `assets/js/three/prism-scene.js`.

        // Navegação suave por âncoras internas usando Lenis com compensação do header fixo (Etapa 1)
        if (lenis) {
            document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href && href.length > 1) {
                        const targetEl = document.querySelector(href);
                        if (targetEl) {
                            e.preventDefault();
                            const topbarEl = document.querySelector('.topbar');
                            const topbarHeight = topbarEl ? topbarEl.offsetHeight : 76;
                            const offset = href === '#inicio' ? 0 : -topbarHeight;
                            lenis.scrollTo(targetEl, { offset: offset, duration: 1.2 });
                        }
                    }
                });
            });
        }

        // Toggle de navegação mobile e fechamento automático ao navegar
        const menuToggle = document.getElementById('menuToggle');
        const topbarEl = document.querySelector('.topbar');
        if (menuToggle && topbarEl) {
            menuToggle.addEventListener('click', () => {
                const isOpen = topbarEl.classList.toggle('is-menu-open');
                menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            document.querySelectorAll('.mobile-menu a').forEach((link) => {
                link.addEventListener('click', () => {
                    topbarEl.classList.remove('is-menu-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }

        // Recalcula ScrollTrigger após carregamento das fontes para evitar saltos (Risk 6)
        if (document.fonts && document.fonts.ready && typeof ScrollTrigger !== 'undefined') {
            document.fonts.ready.then(() => {
                ScrollTrigger.refresh();
            });
        }
    }

    // --- 9. Observer de Autopause em Vídeos e Tab Visibility ---
    const videos = Array.from(document.querySelectorAll('.preview-video[data-autopause="true"]'));

    if (!prefersReducedMotion) {
        if (!('IntersectionObserver' in window) || videos.length === 0) {
            videos.forEach((video) => {
                video.play().catch(() => { });
            });
        } else {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.4 && !document.hidden) {
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }
                });
            }, {
                threshold: [0, 0.4, 0.8]
            });

            videos.forEach((video) => videoObserver.observe(video));

            // Pausa vídeos quando aba perde foco para poupar CPU/GPU
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    videos.forEach((v) => v.pause());
                } else {
                    videos.forEach((video) => {
                        const rect = video.getBoundingClientRect();
                        const inView = rect.top < window.innerHeight && rect.bottom > 0;
                        if (inView) {
                            video.play().catch(() => { });
                        }
                    });
                }
            });
        }
    }

})();
