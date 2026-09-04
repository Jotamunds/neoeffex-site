(function () {
    "use strict";

    const config = window.NEOEFFEX_LANDING || {};
    const brand = config.brand || {};
    const content = config.content || {};
    const header = document.querySelector(".site-header");
    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    const notice = document.getElementById("catalogo-indisponivel");
    const mobile = window.matchMedia("(max-width: 999px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Nenhum dado operacional é consultado ou mantido nesta landing.
    // Contrato oficial confirmado em /catalogo/README.md e no modelo hamburgueria.
    function getCatalogUrl() {
        const slug = config.catalog && config.catalog.slug;
        if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            return "";
        }
        const hostname = window.location.hostname;
        const isLocal = hostname === "localhost" || hostname === "127.0.0.1"
            || hostname === "[::1]" || hostname === "0.0.0.0"
            || /^10\./.test(hostname) || /^192\.168\./.test(hostname)
            || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
        const useLocal = config.catalog.useLocalCatalog === true && isLocal
            && /^https?:$/.test(window.location.protocol);
        const url = new URL("/catalogo/", useLocal ? window.location.origin : "https://neoeffex.com.br");
        url.searchParams.set("catalogo", slug);
        return url.href;
    }

    const catalogUrl = getCatalogUrl();
    notice.hidden = Boolean(catalogUrl);
    document.querySelectorAll("[data-catalog-link]").forEach(function (link) {
        link.href = catalogUrl || "#catalogo-indisponivel";
        if (!catalogUrl) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                closeMenu();
                notice.focus({ preventScroll: true });
                notice.scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth", block: "center" });
            });
        }
    });

    document.querySelectorAll("[data-copy]").forEach(function (element) {
        const value = content[element.dataset.copy];
        if (typeof value === "string" && value.trim()) element.textContent = value;
    });
    document.querySelectorAll("[data-brand-name]").forEach(function (element) {
        if (typeof brand.name === "string" && brand.name.trim()) element.textContent = brand.name;
    });
    document.querySelectorAll("[data-brand-subtitle]").forEach(function (element) {
        if (typeof brand.subtitle === "string") element.textContent = brand.subtitle;
    });
    if (brand.name) {
        document.title = brand.name + " | " + (brand.subtitle || "Clínica odontológica");
        const description = document.querySelector('meta[name="description"]');
        description.content = brand.name + " — " + (content.heroLead || "Cuidado odontológico individual.");
    }
    document.querySelectorAll("[data-demo-only]").forEach(function (element) {
        element.hidden = brand.demo === false;
    });
    const demoLabel = document.querySelector(".footer [data-demo-only]");
    if (demoLabel && brand.name) demoLabel.textContent = "Modelo demonstrativo. " + brand.name + " é uma clínica fictícia.";

    function localImagePath(path) {
        return typeof path === "string" && /^assets\/img\/[a-z0-9_./-]+$/i.test(path)
            && !path.split("/").includes("..") ? path : "";
    }
    document.querySelectorAll("[data-image]").forEach(function (element) {
        const path = localImagePath((config.images || {})[element.dataset.image]);
        if (!path) return;
        element.setAttribute(element.tagName === "SOURCE" ? "srcset" : "src", path);
    });
    const logo = localImagePath(brand.logo);
    if (logo) {
        document.querySelectorAll("[data-brand-logo]").forEach(function (image) {
            image.addEventListener("error", function () { image.hidden = true; }, { once: true });
            // A marca escrita ao lado já nomeia o link; a imagem é decorativa.
            image.alt = "";
            image.src = logo;
            image.hidden = false;
        });
    }

    function updateHeader() {
        header.classList.toggle("is-scrolled", window.scrollY > 30);
    }
    function closeMenu(returnFocus) {
        header.classList.remove("nav-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
        nav.hidden = mobile.matches;
        if (returnFocus) menuButton.focus();
    }
    document.documentElement.classList.add("js");
    menuButton.hidden = !mobile.matches;
    closeMenu();
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    menuButton.addEventListener("click", function () {
        const open = menuButton.getAttribute("aria-expanded") !== "true";
        header.classList.toggle("nav-open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        nav.hidden = !open;
    });
    nav.addEventListener("click", function (event) {
        const link = event.target.closest("a");
        if (!link) return;
        closeMenu();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
        }
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && header.classList.contains("nav-open")) closeMenu(true);
    });
    document.addEventListener("click", function (event) {
        if (!header.contains(event.target) && header.classList.contains("nav-open")) closeMenu();
    });
    header.addEventListener("focusout", function () {
        window.setTimeout(function () {
            if (!header.contains(document.activeElement)) closeMenu();
        }, 0);
    });
    mobile.addEventListener("change", function () {
        menuButton.hidden = !mobile.matches;
        closeMenu();
    });

    // O conteúdo começa visível. Só entra na animação se o observador estiver disponível.
    if ("IntersectionObserver" in window && !reducedMotion.matches) {
        const elements = document.querySelectorAll(".reveal");
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.remove("reveal-pending");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        elements.forEach(function (element) {
            element.classList.add("reveal-pending");
            observer.observe(element);
        });
        reducedMotion.addEventListener("change", function (event) {
            if (event.matches) {
                observer.disconnect();
                elements.forEach(function (element) { element.classList.remove("reveal-pending"); });
            }
        });
    }
}());
