/* Integração do site da Lu com o catálogo compartilhado da Neoeffex. */
(() => {
    "use strict";

    window.LuLeve = window.LuLeve || {};

    function isPrivateIpv4(hostname) {
        const match = String(hostname || "").match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);

        if (!match) {
            return false;
        }

        const parts = match.slice(1).map(Number);

        if (parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
            return false;
        }

        return parts[0] === 10
            || parts[0] === 127
            || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
            || (parts[0] === 192 && parts[1] === 168);
    }

    function isLocalEnvironment(locationObject = window.location) {
        const hostname = String(locationObject?.hostname || "").toLowerCase();
        const protocol = String(locationObject?.protocol || "").toLowerCase();

        return protocol === "file:"
            || hostname === "localhost"
            || hostname === "[::1]"
            || hostname === "::1"
            || hostname.endsWith(".local")
            || (!hostname.includes(".") && hostname !== "")
            || isPrivateIpv4(hostname);
    }

    function resolveUrl(locationObject = window.location) {
        const config = window.LuLeve?.config?.catalog || {};
        const productionUrl = String(config.productionUrl || "").trim();
        const localPath = String(config.localPath || "").trim();

        if (isLocalEnvironment(locationObject) && localPath) {
            try {
                return new URL(localPath, locationObject.href).href;
            } catch {
                return localPath;
            }
        }

        return productionUrl;
    }

    function init() {
        const url = resolveUrl();

        if (!url) {
            return;
        }

        document.querySelectorAll("[data-catalog-link]").forEach((link) => {
            if (link && typeof link.setAttribute === "function") {
                link.setAttribute("href", url);
            }
        });
    }

    window.LuLeve.catalog = Object.freeze({
        init,
        resolveUrl,
        isLocalEnvironment
    });

    init();
})();
