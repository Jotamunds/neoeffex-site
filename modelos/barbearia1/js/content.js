(() => {
    const config = window.BARBERSHOP_CONFIG;

    if (!config) {
        return;
    }

    const getConfigValue = (path) => {
        return path.split(".").reduce((value, key) => {
            return value !== undefined && value !== null ? value[key] : undefined;
        }, config);
    };

    document.querySelectorAll("[data-bind]").forEach((element) => {
        const value = getConfigValue(element.dataset.bind);

        if (value !== undefined) {
            element.textContent = value;
        }
    });

    document.querySelectorAll("[data-initial]").forEach((element) => {
        const name = getConfigValue(element.dataset.initial);
        element.textContent = name ? name.trim().charAt(0).toUpperCase() : "C";
    });

    document.querySelectorAll("[data-maps]").forEach((link) => {
        link.href = config.contact.mapsUrl;
    });

    document.querySelectorAll("[data-instagram]").forEach((link) => {
        link.href = config.contact.instagramUrl;
    });

    const description = document.querySelector('meta[name="description"]');
    const currentYear = document.getElementById("currentYear");

    document.title = config.brand.name + " | " + config.hero.line2.replace(".", "");

    if (description) {
        description.content = config.hero.description;
    }

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
})();
