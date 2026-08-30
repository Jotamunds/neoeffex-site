/* v0.1.18 — contagem dos preços integrada ao controlador de movimento. */
(() => {
    "use strict";

    window.LuLeve = window.LuLeve || {};

    const PRICE_RE = /^\s*R\$\s*(\d{1,4}(?:\.\d{3})*,\d{2})\s*$/;
    const TARGET_SELECTOR = ".numeric:not([data-no-price-countup])";
    const DURATION_MS = 760;
    const STAGGER_MS = 70;
    const MAX_STAGGER_MS = 280;
    const VIEWPORT_THRESHOLD = 0.22;
    const targets = [];
    const frames = new Map();
    let initialized = false;
    let enabled = false;
    let observer = null;
    let sequence = 0;

    function parseBRL(raw) {
        const normalized = raw.replace(/\./g, "").replace(",", ".");
        const value = Number.parseFloat(normalized);
        return Number.isFinite(value) ? value : null;
    }

    function formatBRL(value) {
        return value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function easeOutCubic(progress) {
        return 1 - Math.pow(1 - progress, 3);
    }

    function collectTargets() {
        if (initialized) {
            return;
        }

        initialized = true;
        document.querySelectorAll(TARGET_SELECTOR).forEach((element) => {
            if (element.children.length > 0) {
                return;
            }

            const original = element.textContent || "";
            const match = original.match(PRICE_RE);
            const value = match ? parseBRL(match[1]) : null;

            if (value === null) {
                return;
            }

            targets.push({ element, original, value, played: false });
        });
    }

    function restore(target) {
        const frame = frames.get(target);

        if (frame !== undefined && typeof window.cancelAnimationFrame === "function") {
            window.cancelAnimationFrame(frame);
        }

        frames.delete(target);
        target.element.textContent = target.original;
        target.element.classList.remove("price-countup-active");
    }

    function restoreRunning() {
        [...frames.keys()].forEach(restore);
    }

    function render(target, progress) {
        target.element.textContent = `R$ ${formatBRL(target.value * progress)}`;
    }

    function animate(target, delay) {
        if (!enabled || target.played) {
            return;
        }

        target.played = true;
        target.element.dataset.priceCountupPlayed = "true";
        target.element.classList.add("price-countup-active");
        render(target, 0);

        const startedAt = window.performance.now() + delay;
        const tick = (now) => {
            if (!enabled || document.hidden) {
                restore(target);
                return;
            }

            if (now < startedAt) {
                frames.set(target, window.requestAnimationFrame(tick));
                return;
            }

            const elapsed = Math.min(1, (now - startedAt) / DURATION_MS);
            render(target, easeOutCubic(elapsed));

            if (elapsed < 1) {
                frames.set(target, window.requestAnimationFrame(tick));
            } else {
                restore(target);
            }
        };

        frames.set(target, window.requestAnimationFrame(tick));
    }

    function disconnect() {
        observer?.disconnect();
        observer = null;
    }

    function observe() {
        if (!enabled || observer || typeof window.IntersectionObserver !== "function") {
            return;
        }

        const pending = targets.filter((target) => !target.played);

        if (!pending.length) {
            return;
        }

        try {
            const byElement = new Map(pending.map((target) => [target.element, target]));
            const currentObserver = new window.IntersectionObserver((entries) => {
                if (!enabled || observer !== currentObserver || document.hidden) {
                    return;
                }

                entries.forEach((entry) => {
                    const target = byElement.get(entry.target);

                    if (!entry.isIntersecting || !target || target.played) {
                        return;
                    }

                    currentObserver.unobserve(entry.target);
                    animate(target, Math.min(sequence * STAGGER_MS, MAX_STAGGER_MS));
                    sequence += 1;
                });
            }, {
                threshold: VIEWPORT_THRESHOLD,
                rootMargin: "0px 0px -5% 0px"
            });

            observer = currentObserver;
            pending.forEach((target) => currentObserver.observe(target.element));
        } catch {
            disconnect();
        }
    }

    function configure(value) {
        enabled = value === true && !document.hidden;
        collectTargets();

        if (!enabled) {
            disconnect();
            restoreRunning();
            return getState();
        }

        observe();
        return getState();
    }

    function destroy() {
        enabled = false;
        disconnect();
        restoreRunning();
        return getState();
    }

    function getState() {
        return {
            enabled,
            total: targets.length,
            played: targets.filter((target) => target.played).length,
            running: frames.size
        };
    }

    window.LuLeve.priceCountup = { configure, destroy, getState };
})();
