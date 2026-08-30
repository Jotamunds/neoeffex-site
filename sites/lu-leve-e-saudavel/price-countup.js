(() => {
    'use strict';

    const PRICE_RE = /R\$\s*(\d{1,4}(?:\.\d{3})*,\d{2})/g;
    const DURATION_MS = 760;
    const STAGGER_MS = 70;
    const VIEWPORT_THRESHOLD = 0.22;
    const ROOT_SELECTOR = 'main, [role="main"], body';
    const EXCLUDED_SELECTOR = [
        'script',
        'style',
        'noscript',
        'template',
        'svg',
        'path',
        'input',
        'textarea',
        'select',
        'option',
        '[contenteditable="true"]',
        '[data-no-price-countup]'
    ].join(',');

    const prefersReducedMotion = () =>
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

    const parseBRL = (raw) => {
        const normalized = raw.replace(/\./g, '').replace(',', '.');
        const value = Number.parseFloat(normalized);
        return Number.isFinite(value) ? value : null;
    };

    const formatBRL = (value) =>
        value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const hasEligiblePrice = (text) => {
        PRICE_RE.lastIndex = 0;
        return PRICE_RE.test(text);
    };

    const collectTargets = () => {
        const root = document.querySelector(ROOT_SELECTOR) || document.body;
        if (!root) return [];

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parent = node.parentElement;
                    if (!parent || parent.closest(EXCLUDED_SELECTOR)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    const text = node.nodeValue || '';
                    return hasEligiblePrice(text)
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const targets = [];
        let node;
        while ((node = walker.nextNode())) {
            const original = node.nodeValue || '';
            const matches = [...original.matchAll(new RegExp(PRICE_RE.source, 'g'))];
            if (!matches.length) continue;

            const prices = matches
                .map((match) => ({
                    raw: match[1],
                    value: parseBRL(match[1])
                }))
                .filter((price) => price.value !== null);

            if (!prices.length) continue;

            targets.push({
                node,
                original,
                prices,
                owner: node.parentElement
            });
        }

        return targets;
    };

    const renderFrame = (target, progress) => {
        let index = 0;
        const animatedText = target.original.replace(
            new RegExp(PRICE_RE.source, 'g'),
            (full) => {
                const price = target.prices[index++];
                if (!price) return full;
                const current = price.value * progress;
                return `R$ ${formatBRL(current)}`;
            }
        );
        target.node.nodeValue = animatedText;
    };

    const restore = (target) => {
        target.node.nodeValue = target.original;
        target.owner?.classList.remove('price-countup-active');
    };

    const animate = (target, delay = 0) => {
        if (target.owner?.dataset.priceCountupPlayed === 'true') return;
        if (target.owner) target.owner.dataset.priceCountupPlayed = 'true';

        if (prefersReducedMotion()) {
            restore(target);
            return;
        }

        target.owner?.classList.add('price-countup-active');
        renderFrame(target, 0);

        const startAt = performance.now() + delay;
        const tick = (now) => {
            if (now < startAt) {
                requestAnimationFrame(tick);
                return;
            }

            const elapsed = Math.min(1, (now - startAt) / DURATION_MS);
            renderFrame(target, easeOutCubic(elapsed));

            if (elapsed < 1) {
                requestAnimationFrame(tick);
            } else {
                restore(target);
            }
        };

        requestAnimationFrame(tick);
    };

    const start = () => {
        const targets = collectTargets();
        if (!targets.length) return;

        if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
            targets.forEach(restore);
            return;
        }

        let sequence = 0;
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;

                const target = targets.find((item) => item.owner === entry.target);
                observer.unobserve(entry.target);
                if (!target) continue;

                animate(target, Math.min(sequence * STAGGER_MS, 280));
                sequence += 1;
            }
        }, {
            threshold: VIEWPORT_THRESHOLD,
            rootMargin: '0px 0px -5% 0px'
        });

        targets.forEach((target) => {
            if (target.owner) observer.observe(target.owner);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
