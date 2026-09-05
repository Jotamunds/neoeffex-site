/*
 * Apenas valores públicos devem ficar neste arquivo.
 * Nunca use aqui uma service_role key, secret key ou senha de banco.
 */
window.NEOEFFEX_SUPABASE_CONFIG = Object.freeze({
    url: "https://jnixmatzvyxvgnexhilg.supabase.co",
    publishableKey: "sb_publishable_XzM6rVYH5ZZvd555tVp0XA_q5mTn8-2"
});

window.NEOEFFEX_CATALOG_CONFIG = Object.freeze({
    simulationSlugs: Object.freeze(["demo-neoeffex"])
});

(function loadCatalogIdentityModule() {
    "use strict";

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "assets/css/catalog-identity.css?v=0.1.13";
    document.head.appendChild(stylesheet);

    const script = document.createElement("script");
    script.src = "assets/js/catalog-identity.js?v=0.1.13";
    script.async = false;
    document.head.appendChild(script);
}());

(function loadCatalogVisualTheme() {
    "use strict";

    const slug = (new URLSearchParams(window.location.search).get("catalogo") || "")
        .trim()
        .toLocaleLowerCase("pt-BR");

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return;

    const themes = Object.freeze({
        "lu-leve-e-saudavel": Object.freeze({
            stylesheet: "assets/css/themes/lu-leve-e-saudavel.css",
            siteUrl: "../sites/lu-leve-e-saudavel/",
            themeColor: "#153b2b",
            brandName: "Lu Leve e Saudável",
            headerLogo: "assets/images/brands/lu-leve-e-saudavel/logo-header.webp",
            headerLabel: "CARDÁPIO DIGITAL"
        })
    });

    const theme = themes[slug];
    if (!theme) return;

    document.documentElement.dataset.catalogTheme = slug;

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = theme.stylesheet;
    stylesheet.dataset.catalogTheme = slug;
    document.head.appendChild(stylesheet);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", theme.themeColor);

    function adaptCatalogChrome() {
        const headerBrand = document.querySelector(".site-header .brand");
        const headerLabel = document.querySelector(".site-header__label");
        const footerLabel = document.querySelector(".site-footer__inner > span");
        const footerLink = document.querySelector(".site-footer a");

        if (headerBrand) {
            headerBrand.href = theme.siteUrl;
            headerBrand.setAttribute("aria-label", "Voltar para o site " + theme.brandName);

            if (theme.headerLogo) {
                const image = document.createElement("img");
                image.className = "brand__image";
                image.src = theme.headerLogo;
                image.alt = theme.brandName;
                image.decoding = "async";

                headerBrand.replaceChildren(image);
            } else {
                const brandName = headerBrand.querySelector("span:last-child");
                if (brandName) brandName.textContent = theme.brandName;
            }
        }

        if (headerLabel) headerLabel.textContent = theme.headerLabel;
        if (footerLabel) footerLabel.textContent = "Cardápio digital";

        if (footerLink) {
            footerLink.href = theme.siteUrl;
            footerLink.textContent = "Voltar ao site";
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", adaptCatalogChrome, { once: true });
    } else {
        adaptCatalogChrome();
    }
}());
