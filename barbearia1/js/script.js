/* ================================================================
 * MODO DEMONSTRAÇÃO — PERSONALIZAÇÃO DE CORES
 * ================================================================ */
const hexToRgb = (hex) => {
    const normalized = hex.replace("#", "");
    const value = Number.parseInt(normalized, 16);

    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255
    };
};

const rgbToHex = ({ r, g, b }) => {
    const channel = (value) => Math.round(value).toString(16).padStart(2, "0");
    return "#" + channel(r) + channel(g) + channel(b);
};

const mixHex = (firstColor, secondColor, secondColorWeight) => {
    const first = hexToRgb(firstColor);
    const second = hexToRgb(secondColor);
    const firstColorWeight = 1 - secondColorWeight;

    return rgbToHex({
        r: first.r * firstColorWeight + second.r * secondColorWeight,
        g: first.g * firstColorWeight + second.g * secondColorWeight,
        b: first.b * firstColorWeight + second.b * secondColorWeight
    });
};

const relativeLuminance = (hex) => {
    const rgb = hexToRgb(hex);
    const channels = [rgb.r, rgb.g, rgb.b].map((value) => {
        const channel = value / 255;
        return channel <= 0.03928
            ? channel / 12.92
            : Math.pow((channel + 0.055) / 1.055, 2.4);
    });

    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

const initializeThemeDemo = () => {
    const themeButton = document.getElementById("themeButton");
    const themeDialog = document.getElementById("themeDialog");
    const themeClose = document.getElementById("themeClose");
    const themeReset = document.getElementById("themeReset");
    const themePresets = document.getElementById("themePresets");
    const accentInput = document.getElementById("accentColor");
    const backgroundInput = document.getElementById("backgroundColor");
    const accentValue = document.getElementById("accentValue");
    const backgroundValue = document.getElementById("backgroundValue");
    const root = document.documentElement;
    let currentTheme = null;

    if (!DEMO_CONFIG.enabled) {
        themeButton.hidden = true;
        return;
    }

    const readSavedTheme = () => {
        if (!DEMO_CONFIG.persistSelection) {
            return null;
        }

        try {
            const savedTheme = localStorage.getItem(DEMO_CONFIG.storageKey);
            const parsedTheme = savedTheme ? JSON.parse(savedTheme) : null;
            const validHex = /^#[0-9a-f]{6}$/i;

            return parsedTheme &&
                validHex.test(parsedTheme.accent) &&
                validHex.test(parsedTheme.background)
                ? parsedTheme
                : null;
        } catch (error) {
            return null;
        }
    };

    const saveTheme = (theme) => {
        if (!DEMO_CONFIG.persistSelection) {
            return;
        }

        try {
            localStorage.setItem(DEMO_CONFIG.storageKey, JSON.stringify(theme));
        } catch (error) {
            /* O modo demonstração continua funcionando sem armazenamento. */
        }
    };

    const updatePresetState = (activePresetId) => {
        themePresets.querySelectorAll("[data-theme-preset]").forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.themePreset === activePresetId));
        });
    };

    const applyTheme = (theme, options = {}) => {
        const accent = theme.accent.toLowerCase();
        const background = theme.background.toLowerCase();
        const accentRgb = hexToRgb(accent);
        const backgroundIsLight = relativeLuminance(background) > 0.52;
        const text = backgroundIsLight ? "#18140f" : "#f2efe8";
        const textRgb = hexToRgb(text);
        const muted = backgroundIsLight
            ? mixHex(text, background, 0.42)
            : mixHex(text, background, 0.35);
        const backgroundSoft = backgroundIsLight
            ? mixHex(background, "#000000", 0.035)
            : mixHex(background, "#ffffff", 0.045);
        const surface = backgroundIsLight
            ? mixHex(background, "#ffffff", 0.58)
            : mixHex(background, "#ffffff", 0.07);
        const surfaceTwo = backgroundIsLight
            ? mixHex(background, "#000000", 0.065)
            : mixHex(background, "#ffffff", 0.11);
        const accentLight = mixHex(accent, "#ffffff", backgroundIsLight ? 0.12 : 0.3);
        const accentDark = mixHex(accent, "#000000", 0.32);
        const accentContrast = relativeLuminance(accent) > 0.43 ? "#11100d" : "#ffffff";
        const presetId = options.presetId || theme.presetId || "custom";

        root.style.setProperty("--bg", background);
        root.style.setProperty("--bg-soft", backgroundSoft);
        root.style.setProperty("--surface", surface);
        root.style.setProperty("--surface-2", surfaceTwo);
        root.style.setProperty("--text", text);
        root.style.setProperty("--text-rgb", textRgb.r + ", " + textRgb.g + ", " + textRgb.b);
        root.style.setProperty("--muted", muted);
        root.style.setProperty("--accent", accent);
        root.style.setProperty("--accent-rgb", accentRgb.r + ", " + accentRgb.g + ", " + accentRgb.b);
        root.style.setProperty("--accent-light", accentLight);
        root.style.setProperty("--accent-dark", accentDark);
        root.style.setProperty("--accent-contrast", accentContrast);
        root.style.setProperty("--line", "rgba(" + textRgb.r + ", " + textRgb.g + ", " + textRgb.b + ", 0.13)");
        root.style.setProperty("--line-accent", "rgba(" + accentRgb.r + ", " + accentRgb.g + ", " + accentRgb.b + ", 0.45)");
        root.style.setProperty("--shadow", backgroundIsLight
            ? "0 24px 70px rgba(40, 30, 18, 0.16)"
            : "0 24px 70px rgba(0, 0, 0, 0.42)");
        root.style.colorScheme = backgroundIsLight ? "light" : "dark";
        root.dataset.themeMode = backgroundIsLight ? "light" : "dark";

        accentInput.value = accent;
        backgroundInput.value = background;
        accentValue.value = accent.toUpperCase();
        backgroundValue.value = background.toUpperCase();
        document.querySelector('meta[name="theme-color"]').content = background;

        currentTheme = { accent, background, presetId };
        updatePresetState(presetId);

        if (options.persist !== false) {
            saveTheme(currentTheme);
        }
    };

    THEME_PRESETS.forEach((preset) => {
        const button = document.createElement("button");
        const swatch = document.createElement("span");
        const label = document.createElement("span");

        button.className = "theme-preset";
        button.type = "button";
        button.dataset.themePreset = preset.id;
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-label", "Aplicar tema " + preset.name);

        swatch.className = "theme-preset__swatch";
        swatch.style.setProperty("--preset-background", preset.background);
        swatch.style.setProperty("--preset-accent", preset.accent);
        swatch.setAttribute("aria-hidden", "true");

        label.textContent = preset.name;
        button.append(swatch, label);
        button.addEventListener("click", () => {
            applyTheme(preset, { presetId: preset.id });
        });
        themePresets.appendChild(button);
    });

    const defaultTheme = THEME_PRESETS.find((preset) => preset.id === DEMO_CONFIG.defaultTheme) || THEME_PRESETS[0];
    const savedTheme = readSavedTheme();
    applyTheme(savedTheme || defaultTheme, {
        presetId: savedTheme?.presetId || defaultTheme.id,
        persist: false
    });

    const applyCustomTheme = () => {
        applyTheme({
            accent: accentInput.value,
            background: backgroundInput.value
        }, { presetId: "custom" });
    };

    accentInput.addEventListener("input", applyCustomTheme);
    backgroundInput.addEventListener("input", applyCustomTheme);

    themeButton.addEventListener("click", () => {
        themeDialog.showModal();
        themeButton.setAttribute("aria-expanded", "true");
        document.body.classList.add("theme-open");
    });

    themeClose.addEventListener("click", () => themeDialog.close());

    themeReset.addEventListener("click", () => {
        try {
            localStorage.removeItem(DEMO_CONFIG.storageKey);
        } catch (error) {
            /* Nada precisa ser feito quando o armazenamento está indisponível. */
        }

        applyTheme(defaultTheme, {
            presetId: defaultTheme.id,
            persist: false
        });
    });

    themeDialog.addEventListener("click", (event) => {
        const bounds = themeDialog.getBoundingClientRect();
        const clickedOutside = event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom;

        if (clickedOutside) {
            themeDialog.close();
        }
    });

    themeDialog.addEventListener("close", () => {
        themeButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("theme-open");
        themeButton.focus();
    });
};

initializeThemeDemo();

/* ================================================================
 * CONTEÚDO E INTERAÇÕES DA LANDING PAGE
 * ================================================================ */
const getConfigValue = (path) => {
    return path.split(".").reduce((value, key) => {
        return value !== undefined && value !== null ? value[key] : undefined;
    }, BARBERSHOP_CONFIG);
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

const buildWhatsAppUrl = (serviceIndex) => {
    let message = BARBERSHOP_CONFIG.contact.whatsappMessage;

    if (serviceIndex !== undefined && BARBERSHOP_CONFIG.services[serviceIndex]) {
        message += " Tenho interesse em: " + BARBERSHOP_CONFIG.services[serviceIndex].name + ".";
    }

    return "https://wa.me/" +
        BARBERSHOP_CONFIG.contact.whatsapp.replace(/\D/g, "") +
        "?text=" +
        encodeURIComponent(message);
};

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const serviceIndex = link.dataset.service;
    link.href = buildWhatsAppUrl(serviceIndex === undefined ? undefined : Number(serviceIndex));
});

document.querySelectorAll("[data-maps]").forEach((link) => {
    link.href = BARBERSHOP_CONFIG.contact.mapsUrl;
});

document.querySelectorAll("[data-instagram]").forEach((link) => {
    link.href = BARBERSHOP_CONFIG.contact.instagramUrl;
});

document.title = BARBERSHOP_CONFIG.brand.name + " | " + BARBERSHOP_CONFIG.hero.line2.replace(".", "");
document.querySelector('meta[name="description"]').content = BARBERSHOP_CONFIG.hero.description;
document.getElementById("currentYear").textContent = new Date().getFullYear();

const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const setMenu = (open) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    mainNav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
};

menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
});

const updateHeader = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 28);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const nowInSaoPaulo = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).formatToParts(new Date());

    const read = (type) => parts.find((part) => part.type === type).value;
    const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

    return {
        day: days[read("weekday")],
        hour: Number(read("hour")),
        minute: Number(read("minute"))
    };
};

const updateOpenStatus = () => {
    const current = nowInSaoPaulo();
    const hours = BARBERSHOP_CONFIG.contact.weeklyHours[current.day];
    const decimalHour = current.hour + current.minute / 60;
    const isOpen = hours && decimalHour >= hours[0] && decimalHour < hours[1];
    const status = document.getElementById("openStatus");
    const dot = document.getElementById("statusDot");

    status.textContent = isOpen ? "Aberto agora" : "Fechado agora";
    dot.classList.toggle("is-closed", !isOpen);
};

updateOpenStatus();
window.setInterval(updateOpenStatus, 60000);

const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
}

const observedSections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav__link");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
                });
            }
        });
    }, { rootMargin: "-38% 0px -52% 0px" });

    observedSections.forEach((section) => sectionObserver.observe(section));
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const galleryItems = Array.from(document.querySelectorAll("[data-gallery-index]"));
let currentGalleryIndex = 0;

const galleryPositions = ["0%", "20%", "40%", "60%", "80%", "100%"];

const updateLightbox = (index) => {
    currentGalleryIndex = (index + galleryItems.length) % galleryItems.length;
    const title = BARBERSHOP_CONFIG.gallery[currentGalleryIndex];
    lightboxImage.style.setProperty("--photo-position", galleryPositions[currentGalleryIndex]);
    lightboxImage.setAttribute("aria-label", title);
    lightboxTitle.textContent = title;
};

const openLightbox = (index) => {
    updateLightbox(index);
    lightbox.showModal();
    document.body.classList.add("modal-open");
};

const closeLightbox = () => {
    lightbox.close();
    document.body.classList.remove("modal-open");
};

galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(Number(item.dataset.galleryIndex)));
});

document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.getElementById("galleryPrev").addEventListener("click", () => updateLightbox(currentGalleryIndex - 1));
document.getElementById("galleryNext").addEventListener("click", () => updateLightbox(currentGalleryIndex + 1));

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

lightbox.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
    }

    if (lightbox.open && event.key === "ArrowLeft") {
        updateLightbox(currentGalleryIndex - 1);
    }

    if (lightbox.open && event.key === "ArrowRight") {
        updateLightbox(currentGalleryIndex + 1);
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
        setMenu(false);
    }
});

const structuredData = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: BARBERSHOP_CONFIG.brand.name,
    description: BARBERSHOP_CONFIG.hero.description,
    telephone: "+" + BARBERSHOP_CONFIG.contact.whatsapp,
    address: {
        "@type": "PostalAddress",
        streetAddress: BARBERSHOP_CONFIG.contact.address,
        addressLocality: BARBERSHOP_CONFIG.contact.city,
        addressCountry: "BR"
    },
    sameAs: [BARBERSHOP_CONFIG.contact.instagramUrl],
    priceRange: "$$"
};

const structuredDataScript = document.createElement("script");
structuredDataScript.type = "application/ld+json";
structuredDataScript.text = JSON.stringify(structuredData);
document.head.appendChild(structuredDataScript);
