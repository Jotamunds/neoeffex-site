/*
 * Apenas valores públicos devem ficar neste arquivo.
 * Nunca use aqui uma service_role key, secret key ou senha de banco.
 */
window.NEOEFFEX_SUPABASE_CONFIG = Object.freeze({
    url: "https://jnixmatzvyxvgnexhilg.supabase.co",
    publishableKey: "sb_publishable_XzM6rVYH5ZZvd555tVp0XA_q5mTn8-2"
});

(function loadCatalogIdentityModule() {
    "use strict";

    if (window.supabase && !window.NEOEFFEX_CAPTURE_CLIENT_ENABLED) {
        const originalCreateClient = window.supabase.createClient.bind(window.supabase);
        window.supabase.createClient = function () {
            const coreClient = originalCreateClient.apply(null, arguments);
            if (!window.NEOEFFEX_SUPABASE_CLIENT) window.NEOEFFEX_SUPABASE_CLIENT = coreClient;
            return coreClient;
        };
        window.NEOEFFEX_CAPTURE_CLIENT_ENABLED = true;
    }

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "assets/css/catalog-identity.css";
    document.head.appendChild(stylesheet);

    const script = document.createElement("script");
    script.src = "assets/js/catalog-identity.js";
    script.async = false;
    document.head.appendChild(script);
}());
