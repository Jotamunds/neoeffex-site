(function () {
    "use strict";

    const config = window.NEOEFFEX_SITE_CONFIG || {};
    const header = document.querySelector(".site-header");
    const menu = document.querySelector("[data-menu-toggle]");
    const nav = document.getElementById("site-nav");

    document.querySelectorAll("[data-copy]").forEach(function (element) {
        const value = element.dataset.copy.split(".").reduce(function (source, key) {
            return source && Object.hasOwn(source, key) ? source[key] : undefined;
        }, config.content);
        if (typeof value === "string") element.textContent = value;
    });

    if (config.content?.brand?.name) {
        document.title = config.content.brand.name + " | " + config.content.brand.segment;
    }
    if (config.content?.hero?.description) {
        document.querySelector('meta[name="description"]').content = config.content.hero.description;
    }

    // Caminhos de imagens são locais; o modelo não aceita HTML ou scripts na configuração.
    document.querySelectorAll("[data-image]").forEach(function (element) {
        const path = config.images?.[element.dataset.image];
        if (typeof path !== "string" || !/^assets\/img\/[a-zA-Z0-9_./-]+$/.test(path) || path.includes("..")) return;
        if (element.tagName === "SOURCE") element.srcset = path;
        else element.src = path;
    });

    document.querySelectorAll("[data-social]").forEach(function (element) {
        const value = config.socials?.[element.dataset.social];
        if (!value) return;
        try {
            const url = new URL(value);
            if (url.protocol !== "https:" || url.username || url.password) return;
            element.href = url.href;
            element.hidden = false;
        } catch (_) { /* Link ausente ou inválido permanece oculto. */ }
    });
    document.querySelector("[data-year]").textContent = new Date().getFullYear();

    function closeMenu(restoreFocus) {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-label", "Abrir menu");
        if (restoreFocus) menu.focus();
    }

    menu.hidden = false;
    header.classList.add("has-menu");
    menu.addEventListener("click", function () {
        const open = menu.getAttribute("aria-expanded") !== "true";
        nav.classList.toggle("open", open);
        menu.setAttribute("aria-expanded", String(open));
        menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () { closeMenu(false); });
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") closeMenu(true);
    });
    // Um arraste iniciado dentro do menu não conta como clique fora.
    let pointerStartedOutside = false;
    document.addEventListener("pointerdown", function (event) {
        pointerStartedOutside = !header.contains(event.target);
    });
    document.addEventListener("click", function (event) {
        if (pointerStartedOutside && !header.contains(event.target)) closeMenu(false);
        pointerStartedOutside = false;
    });
    header.addEventListener("focusout", function () {
        requestAnimationFrame(function () {
            if (!header.contains(document.activeElement)) closeMenu(false);
        });
    });
    window.matchMedia("(min-width: 1100px)").addEventListener("change", function () { closeMenu(false); });

    function updateHeader() { header.classList.toggle("scrolled", window.scrollY > 32); }
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!motion.matches && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.remove("will-reveal");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08 });
        document.querySelectorAll(".reveal").forEach(function (element) {
            // O primeiro viewport permanece visível mesmo se uma animação falhar.
            if (element.getBoundingClientRect().top >= window.innerHeight) {
                element.classList.add("will-reveal");
                observer.observe(element);
            }
        });
        motion.addEventListener("change", function (event) {
            if (!event.matches) return;
            observer.disconnect();
            document.querySelectorAll(".will-reveal").forEach(function (element) {
                element.classList.remove("will-reveal");
            });
        });
    }
}());
