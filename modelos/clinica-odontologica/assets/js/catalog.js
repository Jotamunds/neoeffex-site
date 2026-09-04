(function () {
    "use strict";

    const config = window.NEOEFFEX_SITE_CONFIG?.catalog || {};
    const links = document.querySelectorAll("[data-catalog-link]");
    const notice = document.getElementById("catalog-notice");
    const slug = typeof config.slug === "string" ? config.slug : "";
    const isValidSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
    const isLocal = /^(localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0|\[::1\])$/.test(location.hostname)
        || /^10\./.test(location.hostname)
        || /^192\.168\./.test(location.hostname)
        || /^172\.(1[6-9]|2\d|3[01])\./.test(location.hostname);

    function getOrigin(value) {
        if (typeof value !== "string" || !value) return "";
        const url = new URL(value);
        if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
            throw new Error("Origem de catálogo inválida");
        }
        return url.origin;
    }

    let catalogUrl = "";
    if (isValidSlug) {
        try {
            const origin = isLocal
                ? getOrigin(config.developmentOrigin) || location.origin
                : getOrigin(config.productionOrigin);
            if (origin) {
                const url = new URL("/catalogo/", origin);
                url.searchParams.set("catalogo", slug);
                catalogUrl = url.href;
            }
        } catch (_) {
            // O site permanece utilizável mesmo com uma configuração incorreta.
        }
    }

    links.forEach(function (link) {
        if (catalogUrl) {
            link.href = catalogUrl;
            return;
        }
        link.href = "#catalog-notice";
        link.addEventListener("click", function (event) {
            event.preventDefault();
            notice.hidden = false;
            notice.focus();
            notice.scrollIntoView({ block: "center", behavior: "instant" });
        });
    });

    if (!catalogUrl) notice.hidden = false;
}());
