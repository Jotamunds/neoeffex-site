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

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
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
    if (modelCards.length > 0) {
        if ('IntersectionObserver' in window) {
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
        }
    }

    // --- 6. Animações GSAP (Hero + ScrollTrigger Cards) ---
    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        // Timeline do Hero
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        heroTl.from('.tech-badge', { y: -15, opacity: 0, duration: 0.6 })
              .from('.hero-line', { y: 40, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.3')
              .from('.hero-copy', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
              .from('.hero-actions', { y: 20, opacity: 0, duration: 0.5 }, '-=0.4')
              .from('.hero-meta li', { y: 15, opacity: 0, duration: 0.4, stagger: 0.08 }, '-=0.3');

        // ScrollTrigger para Revelação dos Cards
        if (typeof ScrollTrigger !== 'undefined') {
            modelCards.forEach((card) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 60,
                    opacity: 0,
                    scale: 0.96,
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
                    scale: 0.95,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }
        }
    }

    // --- 7. Observer de Autopause em Vídeos ---
    const videos = Array.from(document.querySelectorAll('.preview-video[data-autopause="true"]'));

    if (!('IntersectionObserver' in window) || videos.length === 0) {
        videos.forEach((video) => {
            video.play().catch(() => {});
        });
        return;
    }

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, {
        threshold: [0, 0.4, 0.8]
    });

    videos.forEach((video) => videoObserver.observe(video));

})();
