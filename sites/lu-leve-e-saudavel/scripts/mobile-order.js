/* Mede apenas o espaço da barra. Cores, posição e breakpoints pertencem ao CSS. */
(() => {
    "use strict";

    window.LuLeve = window.LuLeve || {};
    let initialized = false;

    function updateSpace(bar) {
        const fixed = window.getComputedStyle(bar).position === "fixed";
        const height = fixed ? Math.ceil(bar.getBoundingClientRect().height) : 0;

        if (Number.isFinite(height) && height >= 0) {
            // Altura real: acompanha quebra de texto, fontes, zoom e área segura.
            document.documentElement.style.setProperty("--mobile-order-height", `${height}px`);
        }
    }

    function init() {
        const bar = document.querySelector("[data-mobile-order]");

        if (!bar || typeof window.getComputedStyle !== "function") {
            return;
        }

        document.documentElement.classList.add("has-mobile-order");
        updateSpace(bar);

        if (initialized) {
            return;
        }

        initialized = true;
        const update = () => updateSpace(bar);

        if (typeof window.ResizeObserver === "function") {
            const observer = new window.ResizeObserver(update);
            observer.observe(bar);
        }

        // Também cobre mudanças de breakpoint que alteram apenas a posição.
        window.addEventListener("resize", update, { passive: true });

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(update);
        }
    }

    window.LuLeve.mobileOrder = { init };
})();
