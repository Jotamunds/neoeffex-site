/* Responsável somente por validar e montar os links do WhatsApp. */
(() => {
    "use strict";

    window.LuLeve = window.LuLeve || {};

    function normalizePhone(value) {
        if (typeof value !== "string") {
            return "";
        }

        // Aceita pontuação usual, mas rejeita texto ou um número sem DDI.
        const digits = value.trim().replace(/[+().\s-]/g, "");
        return /^55[1-9]\d\d{8,9}$/.test(digits) ? digits : "";
    }

    function formatPhone(digits) {
        if (!digits) {
            return "Número oficial ainda não informado.";
        }

        const areaCode = digits.slice(2, 4);
        const localNumber = digits.slice(4);
        const prefix = localNumber.slice(0, -4);
        const suffix = localNumber.slice(-4);
        return `+55 (${areaCode}) ${prefix}-${suffix}`;
    }

    function createWhatsappUrl(number, message) {
        const digits = normalizePhone(number);

        if (!digits) {
            return "";
        }

        const text = typeof message === "string" ? message : "";
        return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
    }

    function initWhatsapp(contact) {
        const phone = normalizePhone(contact.whatsappNumber);
        const url = createWhatsappUrl(phone, contact.whatsappMessage);

        document.querySelectorAll("[data-contact-phone]").forEach((element) => {
            element.textContent = formatPhone(phone);
        });

        // O número também é legível e clicável, sem depender do botão de pedido.
        document.querySelectorAll("[data-contact-phone-link]").forEach((link) => {
            link.hidden = !phone;
            link.textContent = phone ? formatPhone(phone) : "";

            if (phone) {
                link.setAttribute("href", `tel:+${phone}`);
            } else {
                link.removeAttribute("href");
            }
        });

        document.querySelectorAll("[data-contact-phone-fallback]").forEach((element) => {
            element.hidden = Boolean(phone);
        });

        document.querySelectorAll("[data-whatsapp-only]").forEach((element) => {
            element.hidden = !url;
        });

        document.querySelectorAll("[data-whatsapp-status]").forEach((element) => {
            element.hidden = Boolean(url);
        });

        document.querySelectorAll("[data-whatsapp]").forEach((link) => {
            // Preserve o span animável e seus atributos; altere só o texto interno.
            const label = link.querySelector("[data-whatsapp-text]") || link;
            if (!url) {
                // Sem número: não abrir uma conversa errada nem um link wa.me vazio.
                link.setAttribute("href", "#contato");
                link.removeAttribute("target");
                link.removeAttribute("rel");
                link.setAttribute("aria-describedby", "whatsapp-status");
                label.textContent = link.dataset.whatsappFallback || "Fale conosco";
                return;
            }

            link.setAttribute("href", url);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
            link.removeAttribute("aria-describedby");
            label.textContent = link.dataset.whatsappLabel || "Pedir pelo WhatsApp";
        });
    }

    window.LuLeve.whatsapp = {
        normalizePhone,
        formatPhone,
        createWhatsappUrl,
        init: initWhatsapp
    };
})();
