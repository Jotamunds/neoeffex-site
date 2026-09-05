(function () {
    "use strict";

    const identityBucket = "catalog-identities";
    const logoOverrides = Object.freeze({
        "lu-leve-e-saudavel": "assets/images/brands/lu-leve-e-saudavel/logo-catalogo.webp"
    });
    let initAttempts = 0;

    function getCatalogSlug() {
        const value = new URLSearchParams(window.location.search).get("catalogo") || "";
        const slug = value.trim().toLocaleLowerCase("pt-BR");
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : "";
    }

    function getLogoOverride(slug) {
        return slug && logoOverrides[slug] ? logoOverrides[slug] : "";
    }

    function getLogoUrl(client, path) {
        if (!path) return "";
        const result = client.storage.from(identityBucket).getPublicUrl(path);
        return result.data && result.data.publicUrl ? result.data.publicUrl : "";
    }

    function createDetail(label, value) {
        if (!value) return null;

        const item = document.createElement("p");
        const strong = document.createElement("strong");
        const span = document.createElement("span");

        item.className = "catalog-identity-detail";
        strong.textContent = label;
        span.textContent = value;

        item.append(strong, span);
        return item;
    }

    function getDefaultDescription(title) {
        const candidate = title.nextElementSibling;

        if (
            candidate
            && candidate.tagName === "P"
            && !candidate.hasAttribute("data-catalog-identity")
        ) {
            return candidate;
        }

        return null;
    }

    function renderIdentity(client, catalog) {
        const copy = document.querySelector(".catalog-hero__copy");
        const title = document.getElementById("catalogName");

        if (!copy || !title) return;

        document.querySelectorAll("[data-catalog-identity]").forEach(function (element) {
            element.remove();
        });

        const defaultDescription = getDefaultDescription(title);
        const hasCustomDescription = Boolean(catalog.short_description);

        if (defaultDescription) {
            defaultDescription.hidden = hasCustomDescription;
        }

        const slug = getCatalogSlug();
        const overrideLogoUrl = getLogoOverride(slug);
        const storageLogoUrl = getLogoUrl(client, catalog.logo_path);
        const logoUrl = overrideLogoUrl || storageLogoUrl;

        if (logoUrl) {
            const logoBox = document.createElement("div");
            const image = document.createElement("img");

            logoBox.className = "catalog-identity-logo";
            logoBox.dataset.catalogIdentity = "logo";

            image.src = logoUrl;
            image.alt = "Logo de " + catalog.name;
            image.decoding = "async";

            image.addEventListener("error", function () {
                if (
                    overrideLogoUrl
                    && storageLogoUrl
                    && image.dataset.logoFallback !== "storage"
                ) {
                    image.dataset.logoFallback = "storage";
                    image.src = storageLogoUrl;
                    return;
                }

                logoBox.remove();
            });

            logoBox.appendChild(image);
            copy.insertBefore(logoBox, copy.firstChild);
        }

        if (hasCustomDescription) {
            const description = document.createElement("p");

            description.className = "catalog-identity-description";
            description.dataset.catalogIdentity = "description";
            description.textContent = catalog.short_description;

            title.insertAdjacentElement("afterend", description);

            const meta = document.querySelector("meta[name='description']");
            if (meta) meta.setAttribute("content", catalog.short_description);
        }

        const fulfillmentLabels = {
            pickup: "Retirada",
            delivery: "Entrega",
            both: "Retirada e entrega"
        };

        const details = [
            createDetail("Região / endereço", catalog.service_area),
            createDetail("Horário", catalog.business_hours),
            createDetail("Atendimento", fulfillmentLabels[catalog.fulfillment_mode] || "")
        ].filter(Boolean);

        if (details.length) {
            const detailsBox = document.createElement("div");

            detailsBox.className = "catalog-identity-details";
            detailsBox.dataset.catalogIdentity = "details";

            details.forEach(function (detail) {
                detailsBox.appendChild(detail);
            });

            copy.appendChild(detailsBox);
        }
    }

    function handleCatalogData(client, catalogData) {
        if (!client || !catalogData) return;
        const slug = getCatalogSlug();
        const hasIdentity = Boolean(
            getLogoOverride(slug)
            || catalogData.logo_path
            || catalogData.short_description
            || catalogData.service_area
            || catalogData.business_hours
            || catalogData.fulfillment_mode
        );
        if (!hasIdentity) return;

        const renderWhenHeroIsReady = function () {
            if (document.getElementById("catalogName")) {
                renderIdentity(client, catalogData);
            }
        };

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", renderWhenHeroIsReady, { once: true });
        } else {
            renderWhenHeroIsReady();
        }
    }

    function init() {
        const slug = getCatalogSlug();
        if (!slug) return;

        if (window.NEOEFFEX_ACTIVE_CATALOG && window.NEOEFFEX_SUPABASE_CLIENT) {
            handleCatalogData(window.NEOEFFEX_SUPABASE_CLIENT, window.NEOEFFEX_ACTIVE_CATALOG);
            return;
        }

        window.addEventListener("neoeffex:catalog-loaded", function (event) {
            if (event.detail && event.detail.client && event.detail.catalog) {
                handleCatalogData(event.detail.client, event.detail.catalog);
            }
        }, { once: true });
    }

    init();
}());
