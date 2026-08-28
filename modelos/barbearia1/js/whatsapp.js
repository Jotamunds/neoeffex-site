(() => {
    const config = window.BARBERSHOP_CONFIG;

    if (!config?.contact?.whatsapp) {
        return;
    }

    const buildWhatsAppUrl = (serviceIndex) => {
        let message = config.contact.whatsappMessage;

        if (serviceIndex !== undefined && config.services[serviceIndex]) {
            message += " Tenho interesse em: " + config.services[serviceIndex].name + ".";
        }

        return "https://wa.me/" +
            config.contact.whatsapp.replace(/\D/g, "") +
            "?text=" +
            encodeURIComponent(message);
    };

    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
        const serviceIndex = link.dataset.service;
        const normalizedIndex = serviceIndex === undefined ? undefined : Number(serviceIndex);
        link.href = buildWhatsAppUrl(normalizedIndex);
    });
})();
