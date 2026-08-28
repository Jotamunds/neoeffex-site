/* Etapa 2: sequência curta, somente na primeira abertura e antes da pintura.
 * Este módulo cuida do hero; animations.js fornece o controle e as preferências.
 * Sem timers, espera por imagens/fontes ou estado-base invisível.
 */
(() => {
    "use strict";

    window.LuLeve = window.LuLeve || {};
    const targets = [
        ['[data-intro="title"]', "hero-intro-copy"],
        ['[data-intro="copy"]', "hero-intro-copy"],
        ['[data-intro="action"]', "hero-intro-action"],
        ['[data-intro="photo"]', "hero-intro-photo"],
        [".section-decoration--hero .section-decoration__art", "hero-intro-sprout"]
    ];
    const pending = new Map();
    const listenerOptions = { capture: true, passive: true };
    let attempted = false;
    let running = false;
    let status = "idle";
    let hero = null;

    function getState() {
        return { attempted, running, status };
    }

    function stop(reason = "cancelled") {
        if (hero) {
            hero.classList.remove("is-intro-running");
        }

        if (running) {
            status = reason;
        }

        running = false;
        pending.clear();
        Object.entries(documentEvents).forEach(([name, callback]) => {
            if (typeof document.removeEventListener === "function") {
                document.removeEventListener(name, callback, true);
            }
        });
        Object.entries(windowEvents).forEach(([name, callback]) => {
            if (typeof window.removeEventListener === "function") {
                window.removeEventListener(name, callback, true);
            }
        });
        hero = null;
        return getState();
    }

    function interrupt() {
        stop("interaction");
    }

    function finish(event) {
        if (!running || event.pseudoElement || pending.get(event.target) !== event.animationName) {
            return;
        }

        // Um cancelamento de CSS/preferência cancela a sequência inteira.
        if (event.type === "animationcancel") {
            stop("cancelled");
            return;
        }

        pending.delete(event.target);
        if (!pending.size) {
            stop("completed");
        }
    }

    const documentEvents = {
        animationend: finish,
        animationcancel: finish,
        pointerdown: interrupt,
        touchstart: interrupt,
        click: interrupt,
        keydown: interrupt,
        focusin: interrupt,
        scroll: interrupt
    };
    const windowEvents = {
        pagehide: () => stop("pagehide"),
        beforeprint: () => stop("print"),
        resize: () => stop("resize")
    };

    function skip(reason) {
        status = reason;
        return getState();
    }

    function init(allowed = false) {
        if (attempted) {
            return getState();
        }

        attempted = true;
        if (allowed !== true || document.hidden) {
            return skip("disabled");
        }

        try {
            const timing = window.performance;
            const paintTypes = window.PerformanceObserver && window.PerformanceObserver.supportedEntryTypes;
            if (!timing || typeof timing.now !== "function" || typeof timing.getEntriesByType !== "function"
                || !paintTypes || !paintTypes.includes("paint")
                || typeof window.getComputedStyle !== "function"
                || typeof document.addEventListener !== "function" || typeof document.removeEventListener !== "function"
                || typeof window.addEventListener !== "function" || typeof window.removeEventListener !== "function"
                || !window.CSS || typeof window.CSS.supports !== "function"
                || !window.CSS.supports("animation-duration", "clamp(0ms, 640ms, 900ms)")) {
                return skip("unsupported");
            }

            const age = timing.now();
            // Limite de segurança, não duração da animação. Nunca esperar a página carregar.
            if (!Number.isFinite(age) || age < 0 || age > 1500 || document.readyState === "complete") {
                return skip("late");
            }

            if (timing.getEntriesByType("paint").length) {
                return skip("already-painted");
            }

            if (timing.getEntriesByType("navigation").some((entry) => entry.type === "back_forward")) {
                return skip("history");
            }

            if (window.location.hash && window.location.hash !== "#inicio") {
                return skip("anchor");
            }

            if (Math.abs(window.scrollY || window.pageYOffset || 0) > 0) {
                return skip("scrolled");
            }

            if (document.activeElement && document.activeElement !== document.body && document.activeElement !== document.documentElement) {
                return skip("focused");
            }

            hero = document.querySelector("#inicio");
            if (!hero) {
                return skip("no-hero");
            }

            running = true;
            status = "running";
            Object.entries(documentEvents).forEach(([name, callback]) => document.addEventListener(name, callback, listenerOptions));
            Object.entries(windowEvents).forEach(([name, callback]) => window.addEventListener(name, callback, listenerOptions));
            hero.classList.add("is-intro-running");

            // Só aguardar alvos com animação real. Decorações desligadas não emitem fim.
            targets.forEach(([selector, animationName]) => {
                hero.querySelectorAll(selector).forEach((element) => {
                    const style = window.getComputedStyle(element);
                    if (element.getClientRects().length && style.animationName === animationName && parseFloat(style.animationDuration) > 0) {
                        pending.set(element, animationName);
                    }
                });
            });

            if (!pending.size) {
                stop("no-effects");
            }
        } catch {
            stop("error");
            status = "error";
        }

        return getState();
    }

    // O histórico fica no módulo: destroy/init não repete a abertura nesta página.
    window.LuLeve.heroIntro = { init, stop, getState, destroy: () => stop("destroyed") };
})();
