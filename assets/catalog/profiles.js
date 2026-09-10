(function (root) {
    "use strict";

    const PROFILES = Object.freeze({
        standard: Object.freeze({
            id: "standard",
            label: "Padrão",
            description: "Catálogo comercial geral com produtos e categorias simples.",
            features: Object.freeze({
                flavors: false,
                minimum_order: false,
                addons: false,
                allow_purchase_mode: false
            })
        }),
        food: Object.freeze({
            id: "food",
            label: "Alimentação",
            description: "Base para alimentação, lanches e refeições rápidas.",
            features: Object.freeze({
                flavors: false,
                minimum_order: false,
                addons: false,
                allow_purchase_mode: true
            })
        }),
        marmitas: Object.freeze({
            id: "marmitas",
            label: "Marmitas / Refeições montadas",
            description: "Especializado para marmitas, combos e distribuição de sabores.",
            features: Object.freeze({
                flavors: true,
                minimum_order: true,
                addons: true,
                allow_purchase_mode: true
            })
        }),
        services: Object.freeze({
            id: "services",
            label: "Serviços",
            description: "Apresentação e solicitação de orçamentos para serviços.",
            features: Object.freeze({
                flavors: false,
                minimum_order: false,
                addons: false,
                allow_purchase_mode: false
            })
        })
    });

    function getProfile(profileId) {
        const key = String(profileId || "").trim().toLowerCase();
        return PROFILES[key] || PROFILES.standard;
    }

    function getFeatures(catalog) {
        const profile = getProfile(catalog && catalog.catalog_profile);
        const features = Object.assign({}, profile.features);
        if (catalog && catalog.minimum_order_quantity && Number(catalog.minimum_order_quantity) > 0) {
            features.minimum_order = true;
        }
        return features;
    }

    const api = Object.freeze({
        PROFILES: PROFILES,
        getProfile: getProfile,
        getFeatures: getFeatures
    });

    if (typeof module === "object" && module.exports) module.exports = api;
    else root.NEOEFFEX_PROFILES = api;
})(typeof window === "object" ? window : globalThis);
