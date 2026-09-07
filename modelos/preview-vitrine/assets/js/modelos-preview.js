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

    // --- 2. Custom Cursor Engine ---
    const cursor = document.getElementById('customCursor');
    const cursorLabel = cursor ? cursor.querySelector('.cursor-label') : null;

    if (cursor && !isTouch && !prefersReducedMotion) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        // GSAP QuickTo for smooth lerp
        const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power2.out' });
        const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power2.out' });

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            xTo(mouseX);
            yTo(mouseY);
            if (!cursor.classList.contains('is-visible')) {
                cursor.classList.add('is-visible');
            }
        });

        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('is-visible');
        });

        document.addEventListener('mouseenter', () => {
            cursor.classList.add('is-visible');
        });

        // Hover elements listener
        const hoverTargets = document.querySelectorAll('[data-cursor]');
        hoverTargets.forEach((target) => {
            target.addEventListener('mouseenter', () => {
                const labelText = target.getAttribute('data-cursor');
                if (cursorLabel && labelText) {
                    cursorLabel.textContent = labelText;
                }
                cursor.classList.add('is-hovering');
            });

            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('is-hovering');
            });
        });
    }

    // --- 3. Parallax Leve com Mouse ---
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length > 0 && !isTouch && !prefersReducedMotion && typeof gsap !== 'undefined') {
        window.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const normX = (e.clientX - centerX) / centerX;
            const normY = (e.clientY - centerY) / centerY;

            parallaxElements.forEach((el) => {
                const intensity = parseFloat(el.getAttribute('data-parallax')) || 4;
                gsap.to(el, {
                    x: normX * intensity,
                    y: normY * intensity,
                    duration: 0.6,
                    ease: 'power1.out',
                    overwrite: 'auto'
                });
            });
        });
    }

    // --- 4. Microinterações Magnéticas nos Botões ---
    const magneticButtons = document.querySelectorAll('[data-magnetic]');
    if (magneticButtons.length > 0 && !isTouch && !prefersReducedMotion && typeof gsap !== 'undefined') {
        window.addEventListener('mousemove', (e) => {
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
        });
    }

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

            if (prefersReducedMotion) {
                // Modo reduzido: garante exibição estática sem animação
                gsap.set('.hero-title .hero-line, .hero-copy, .hero-actions', { opacity: 1, y: 0 });
                if (mat && mat.uniforms && mat.uniforms.uIntro) {
                    mat.uniforms.uIntro.value = 1.0;
                }
                return;
            }

            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // 1. Headline surge suavemente em 2 linhas
            heroTl.fromTo('.hero-title .hero-line', 
                { y: 35, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.9, stagger: 0.14 }
            );

            // 2. Partículas surgem junto com a headline e ganham presença suavemente
            if (mat && mat.uniforms && mat.uniforms.uIntro) {
                heroTl.to(mat.uniforms.uIntro, {
                    value: 1.0,
                    duration: 1.4,
                    ease: 'power2.out'
                }, 0.08); // surge em sincronia com o texto
            }

            // 3. Texto de apoio entra harmoniosamente
            heroTl.fromTo('.hero-copy', 
                { y: 20, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.7 }, 
                '-=0.5'
            )
            // 4. CTAs completam a apresentação
            .fromTo('.hero-actions', 
                { y: 20, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.6 }, 
                '-=0.4'
            );
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

                // Distância dedicada para a experiência do N (120% desktop, 95% mobile)
                const pinDuration = isTouch ? '+=95%' : '+=120%';

                const heroTrigger = ScrollTrigger.create({
                    trigger: heroSection,
                    start: 'top top',
                    end: pinDuration,
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

                        // Esmaecimento suave e reversível da copy do hero na fase inicial da rolagem (0.0 -> 0.22)
                        // Limpa o palco para que o N surja como protagonista no centro da viewport
                        if (!prefersReducedMotion) {
                            if (progress > 0.001) {
                                const copyProgress = Math.min(progress / 0.22, 1.0);
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
                        ease: 'power3.out'
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

        // --- 8. Interação 3D com o Prisma Espacial (Etapa 4) ---
        const spatialViewport = document.getElementById('spatialViewport');
        const spatialPrism = document.getElementById('spatialPrism');
        if (spatialViewport && spatialPrism && !prefersReducedMotion) {
            let targetRotX = -18;
            let targetRotY = 25;
            let currentRotX = -18;
            let currentRotY = 25;
            let isHovered = false;
            let prismRafId = null;

            spatialViewport.addEventListener('mousemove', (e) => {
                isHovered = true;
                const rect = spatialViewport.getBoundingClientRect();
                const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                targetRotY = normX * 42;
                targetRotX = -normY * 42;
            });

            spatialViewport.addEventListener('mouseleave', () => {
                isHovered = false;
                targetRotX = -18;
                targetRotY = 25;
            });

            function renderPrism() {
                const lerpFactor = isHovered ? 0.09 : 0.04;
                currentRotX += (targetRotX - currentRotX) * lerpFactor;
                currentRotY += (targetRotY - currentRotY) * lerpFactor;

                spatialPrism.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
                prismRafId = requestAnimationFrame(renderPrism);
            }

            prismRafId = requestAnimationFrame(renderPrism);

            // Pausa animação quando a aba não estiver visível
            document.addEventListener('visibilitychange', () => {
                if (document.hidden && prismRafId) {
                    cancelAnimationFrame(prismRafId);
                    prismRafId = null;
                } else if (!document.hidden && !prismRafId) {
                    prismRafId = requestAnimationFrame(renderPrism);
                }
            });
        }

        // Navegação suave por âncoras internas usando Lenis (evita conflitos de rolagem)
        if (lenis) {
            document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href && href.length > 1) {
                        const targetEl = document.querySelector(href);
                        if (targetEl) {
                            e.preventDefault();
                            lenis.scrollTo(targetEl, { offset: 0, duration: 1.2 });
                        }
                    }
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
                video.play().catch(() => {});
            });
        } else {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.4 && !document.hidden) {
                        video.play().catch(() => {});
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
                            video.play().catch(() => {});
                        }
                    });
                }
            });
        }
    }

})();
