import { siteConfig } from "./config.js";

function isPrivateHost(hostname) {
    return hostname === "localhost"
        || hostname === "127.0.0.1"
        || hostname === "0.0.0.0"
        || /^10\./.test(hostname)
        || /^192\.168\./.test(hostname)
        || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
}

function hasValidSlug(value) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value || ""));
}

export function getCatalogUrl() {
    const catalog = siteConfig.catalog || {};
    if (!hasValidSlug(catalog.slug)) return "#cardapio";

    const query = "?catalogo=" + encodeURIComponent(catalog.slug);
    if (isPrivateHost(window.location.hostname)) {
        const developmentOrigin = String(catalog.developmentOrigin || "").replace(/\/$/, "");
        return developmentOrigin
            ? developmentOrigin + "/catalogo/" + query
            : new URL("../../catalogo/" + query, window.location.href).href;
    }

    const origin = String(catalog.productionOrigin || "").replace(/\/$/, "");
    const path = "/" + String(catalog.path || "/catalogo/").replace(/^\/+|\/+$/g, "") + "/";
    return origin ? origin + path + query : path + query;
}

export function connectCatalogLinks() {
    const url = getCatalogUrl();
    document.querySelectorAll("[data-catalog-link]").forEach((link) => {
        link.href = url;
    });
}
