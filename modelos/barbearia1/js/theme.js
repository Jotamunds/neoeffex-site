(() => {
    const demoConfig = window.DEMO_CONFIG;
    const presets = window.THEME_PRESETS;
    const themeButton = document.getElementById("themeButton");

    if (!demoConfig || !Array.isArray(presets) || !themeButton) {
        return;
    }

    if (!demoConfig.enabled) {
        themeButton.hidden = true;
        return;
    }

    const themeDialog = document.getElementById("themeDialog");
    const themeClose = document.getElementById("themeClose");
    const themeReset = document.getElementById("themeReset");
    const themePresets = document.getElementById("themePresets");
    const accentInput = document.getElementById("accentColor");
    const backgroundInput = document.getElementById("backgroundColor");
    const accentValue = document.getElementById("accentValue");
    const backgroundValue = document.getElementById("backgroundValue");
    const root = document.documentElement;

    if (
        !themeDialog ||
        !themeClose ||
        !themeReset ||
        !themePresets ||
        !accentInput ||
        !backgroundInput ||
        !accentValue ||
        !backgroundValue
    ) {
        themeButton.hidden = true;
        return;
    }

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

    const readSavedTheme = () => {
        if (!demoConfig.persistSelection) {
            return null;
        }

        try {
            const savedTheme = localStorage.getItem(demoConfig.storageKey);
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
        if (!demoConfig.persistSelection) {
            return;
        }

        try {
            localStorage.setItem(demoConfig.storageKey, JSON.stringify(theme));
        } catch (error) {
            /* O configurador continua funcionando sem armazenamento. */
        }
    };

    const updatePresetState = (activePresetId) => {
        themePresets.querySelectorAll("[data-theme-preset]").forEach((button) => {
            button.setAttribute(
                "aria-pressed",
                String(button.dataset.themePreset === activePresetId)
            );
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
        root.style.setProperty("--text-rgb", `${textRgb.r}, ${textRgb.g}, ${textRgb.b}`);
        root.style.setProperty("--muted", muted);
        root.style.setProperty("--accent", accent);
        root.style.setProperty("--accent-rgb", `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`);
        root.style.setProperty("--accent-light", accentLight);
        root.style.setProperty("--accent-dark", accentDark);
        root.style.setProperty("--accent-contrast", accentContrast);
        root.style.setProperty("--line", `rgba(${textRgb.r}, ${textRgb.g}, ${textRgb.b}, 0.13)`);
        root.style.setProperty("--line-accent", `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.45)`);
        root.style.setProperty(
            "--shadow",
            backgroundIsLight
                ? "0 24px 70px rgba(40, 30, 18, 0.16)"
                : "0 24px 70px rgba(0, 0, 0, 0.42)"
        );
        root.style.colorScheme = backgroundIsLight ? "light" : "dark";
        root.dataset.themeMode = backgroundIsLight ? "light" : "dark";

        accentInput.value = accent;
        backgroundInput.value = background;
        accentValue.value = accent.toUpperCase();
        backgroundValue.value = background.toUpperCase();

        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.content = background;
        }

        const currentTheme = { accent, background, presetId };
        updatePresetState(presetId);

        if (options.persist !== false) {
            saveTheme(currentTheme);
        }
    };

    presets.forEach((preset) => {
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

    const defaultTheme = presets.find((preset) => {
        return preset.id === demoConfig.defaultTheme;
    }) || presets[0];
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
            localStorage.removeItem(demoConfig.storageKey);
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
})();
