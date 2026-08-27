(() => {
    const config = window.BARBERSHOP_CONFIG;

    if (!config) {
        return;
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BarberShop",
        name: config.brand.name,
        description: config.hero.description,
        telephone: "+" + config.contact.whatsapp,
        address: {
            "@type": "PostalAddress",
            streetAddress: config.contact.address,
            addressLocality: config.contact.city,
            addressCountry: "BR"
        },
        sameAs: [config.contact.instagramUrl],
        priceRange: "$$"
    };

    const structuredDataScript = document.createElement("script");
    structuredDataScript.type = "application/ld+json";
    structuredDataScript.text = JSON.stringify(structuredData);
    document.head.appendChild(structuredDataScript);
})();
