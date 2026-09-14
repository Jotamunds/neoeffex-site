(function () {
    'use strict';

    if (!window.gsap || !window.ScrollTrigger) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add({
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 921px)'
    }, function (context) {
        if (!context.conditions.motion) return;

        const hero = document.querySelector('.hero-immersive');
        const heroCopy = document.querySelector('.hero-copy');
        const heroHeading = document.querySelector('.hero-copy h1');
        const heroProduct = document.querySelector('.hero-media');
        const heroQuote = document.querySelector('.hero-cta .btn-primary');
        const showcases = document.querySelector('.showcase-list');
        const manifesto = document.querySelector('.manifesto');
        const manifestCopy = document.querySelector('.manifest-copy');
        const manifestProducts = document.querySelector('.manifest-products');
        const manifestSymbol = document.querySelector('.manifest-symbol');
        const pillars = document.querySelector('.pillars');

        if (heroCopy && heroHeading && heroProduct && heroQuote) {
            const heroTimeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
            heroTimeline
                .from(heroCopy.querySelector('.eyebrow'), { y: 14, autoAlpha: 0, duration: .52 })
                .from(heroHeading, { y: 25, autoAlpha: 0, duration: .92 }, '-=.22')
                .from(heroProduct, { x: 26, autoAlpha: 0, scale: .94, duration: 1.05, transformOrigin: 'center bottom' }, '-=.7')
                .from(heroQuote, { y: 12, autoAlpha: 0, duration: .5 }, '-=.4');
        }

        if (showcases) {
            const showcaseTimeline = gsap.timeline({
                defaults: { ease: 'power2.out' },
                scrollTrigger: { trigger: showcases, start: 'top 76%', once: true }
            });

            showcaseTimeline
                .from(showcases.querySelectorAll('.product-pedestal'), {
                    autoAlpha: 0,
                    scaleX: .85,
                    duration: .76,
                    stagger: .12,
                    transformOrigin: 'center center'
                })
                .from(showcases.querySelectorAll('.showcase-visual img'), {
                    autoAlpha: 0,
                    y: 35,
                    scale: .96,
                    duration: .88,
                    stagger: .12,
                    transformOrigin: 'center bottom'
                }, '-=.58')
                .from(showcases.querySelectorAll('.showcase-content'), {
                    autoAlpha: 0,
                    y: 18,
                    duration: .66,
                    stagger: .12
                }, '-=.66');
        }

        if (manifesto && manifestCopy && manifestProducts && manifestSymbol) {
            const manifestoTimeline = gsap.timeline({
                defaults: { ease: 'power2.out' },
                scrollTrigger: { trigger: manifesto, start: 'top 67%', once: true }
            });

            manifestoTimeline
                .from(manifestCopy, { y: 35, autoAlpha: 0, duration: .84 })
                .from(manifestProducts, { y: 40, autoAlpha: 0, scale: .96, duration: .94, transformOrigin: 'center bottom' }, '-=.6')
                .from(manifestSymbol, { scale: .96, duration: 1.3, ease: 'power1.out', transformOrigin: 'center center' }, '-=.7');
        }

        if (pillars) {
            gsap.from(pillars.children, {
                y: 24,
                autoAlpha: 0,
                duration: .56,
                ease: 'power2.out',
                stagger: .1,
                scrollTrigger: { trigger: pillars, start: 'top 82%', once: true }
            });
        }

        gsap.utils.toArray('[data-reveal]').forEach(function (element) {
            if (element.closest('.hero-immersive')) return;

            gsap.from(element, {
                y: 18,
                autoAlpha: 0,
                duration: .6,
                ease: 'power2.out',
                scrollTrigger: { trigger: element, start: 'top 88%', once: true }
            });
        });

        if (context.conditions.desktop) {
            if (hero && heroProduct) {
                gsap.to(heroProduct, {
                    y: -12,
                    ease: 'none',
                    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .7 }
                });
            }

            if (manifesto && manifestSymbol) {
                gsap.to(manifestSymbol, {
                    y: -20,
                    ease: 'none',
                    scrollTrigger: { trigger: manifesto, start: 'top bottom', end: 'bottom top', scrub: .8 }
                });
            }
        }

        const lazyImgs = document.querySelectorAll('.showcase-visual img[loading="lazy"]');
        lazyImgs.forEach(function (img) {
            if (!img.complete) {
                img.addEventListener('load', function () {
                    ScrollTrigger.refresh();
                }, { once: true });
            }
        });

        window.addEventListener('load', function () {
            ScrollTrigger.refresh();
        }, { once: true });
    });
}());
