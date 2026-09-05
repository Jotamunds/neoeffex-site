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

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "assets/css/catalog-identity.css?v=0.1.13";
    document.head.appendChild(stylesheet);

    const script = document.createElement("script");
    script.src = "assets/js/catalog-identity.js?v=0.1.13";
    script.async = false;
    document.head.appendChild(script);
}());