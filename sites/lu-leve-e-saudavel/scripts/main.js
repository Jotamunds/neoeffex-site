/* Ponto de entrada do JavaScript. Não coloque regras de aparência neste arquivo. */
(() => {
    "use strict";

    const app = window.LuLeve;

    if (!app || !app.config) {
        return;
    }

    const contact = app.config.contact;

    function setText(selector, value) {
        document.querySelectorAll(selector).forEach((element) => {
            // textContent evita interpretar informações editáveis como HTML.
            element.textContent = value;
        });
    }

    function getSafeHttpsUrl(value) {
        if (typeof value !== "string" || !value.trim()) {
            return "";
        }

        try {
            const url = new URL(value);
            return url.protocol === "https:" && !url.username && !url.password ? url.href : "";
        } catch {
            return "";
        }
    }

    function setOptionalContact(rowSelector, valueSelector, value) {
        const text = typeof value === "string" ? value.trim() : "";
        setText(valueSelector, text);

        document.querySelectorAll(rowSelector).forEach((row) => {
            row.hidden = !text;
        });
    }

    setText("[data-current-year]", String(new Date().getFullYear()));
    setText("[data-contact-regions]", contact.regions);
    setText("[data-contact-pickup]", contact.pickup);
    setText("[data-contact-delivery]", contact.delivery);
    setText("[data-instagram-handle]", contact.instagramHandle);

    setOptionalContact("[data-contact-address-row]", "[data-contact-address]", contact.address);
    setOptionalContact("[data-contact-hours-row]", "[data-contact-hours]", contact.openingHours);

    const instagramUrl = getSafeHttpsUrl(contact.instagramUrl);

    document.querySelectorAll("[data-instagram-link]").forEach((link) => {
        link.hidden = !instagramUrl;

        if (instagramUrl) {
            link.setAttribute("href", instagramUrl);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
        } else {
            // Remova também o destino anterior se o campo for apagado ou invalidado.
            link.removeAttribute("href");
            link.removeAttribute("target");
            link.removeAttribute("rel");
        }
    });

    const developer = app.config.developer;
    const developerUrl = getSafeHttpsUrl(developer.url);

    document.querySelectorAll("[data-developer-credit]").forEach((element) => {
        if (!developerUrl) {
            element.textContent = `Desenvolvido por ${developer.name}`;
            return;
        }

        const prefix = document.createElement("span");
        prefix.textContent = "Desenvolvido por ";
        const link = document.createElement("a");
        link.textContent = developer.name;
        link.setAttribute("href", developerUrl);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        element.replaceChildren(prefix, link);
    });

    if (app.whatsapp) {
        app.whatsapp.init(contact);
    }

    // Componente independente: não lê nem modifica preços do cardápio.
    if (app.promotion) {
        app.promotion.init(app.config.promotion);
    }

    // Medir a barra somente depois de preencher o texto do botão.
    if (app.mobileOrder) {
        app.mobileOrder.init();
    }

    if (app.animations) {
        app.animations.init(app.config.motion);
    }
})();
