(function () {
    "use strict";

    const config = window.NEOEFFEX_SITE_CONFIG?.theme || {};
    const root = document.documentElement;
    const keys = ["primary", "accent", "background", "support"];
    const builtIn = { primary: "#39794E", accent: "#B74432", background: "#F6F9F2", support: "#E0EEF3" };
    const presets = {
        original: config.colors || builtIn,
        mercado: { primary: "#176A56", accent: "#C04B24", background: "#F4FAF8", support: "#DFEDF8" },
        solar: { primary: "#AF4921", accent: "#306B43", background: "#FFFAF1", support: "#E5F0DD" }
    };
    const labels = { primary: "Cor principal", accent: "Destaques", background: "Fundo", support: "Seções de apoio" };
    const path = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "");
    const storageKey = (config.storageKey || "neoeffex:tema:v1") + ":" + path;

    function sanitize(value, fallback) {
        return Object.fromEntries(keys.map(function (key) {
            const color = value?.[key];
            return [key, typeof color === "string" && /^#[a-fA-F0-9]{6}$/.test(color)
                ? color.toUpperCase() : fallback[key]];
        }));
    }
    const defaults = sanitize(config.colors, builtIn);
    let colors = { ...defaults };
    let storageAvailable = true;
    if (config.enabled !== false) {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
            if (saved) colors = sanitize(saved, defaults);
        } catch (_) { storageAvailable = false; }
    }

    function rgb(hex) { return [1, 3, 5].map(function (start) { return parseInt(hex.slice(start, start + 2), 16); }); }
    function mix(a, b, amount) {
        const start = rgb(a), end = rgb(b);
        return "#" + start.map(function (value, i) {
            return Math.round(value * (1 - amount) + end[i] * amount).toString(16).padStart(2, "0");
        }).join("").toUpperCase();
    }
    function luminance(hex) {
        const channels = rgb(hex).map(function (value) {
            const unit = value / 255;
            return unit <= 0.04045 ? unit / 12.92 : Math.pow((unit + 0.055) / 1.055, 2.4);
        });
        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    }
    function contrast(a, b) {
        const x = luminance(a), y = luminance(b);
        return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    }
    function ink(background) {
        return contrast(background, "#102519") >= 4.5 ? "#102519"
            : contrast(background, "#FFFFFF") >= 4.5 ? "#FFFFFF" : "#000000";
    }
    function readable(color, backgrounds) {
        const target = ink(backgrounds[0]);
        for (let i = 0; i <= 20; i += 1) {
            const candidate = mix(color, target, i / 20);
            if (backgrounds.every(function (bg) { return contrast(candidate, bg) >= 4.5; })) return candidate;
        }
        return target;
    }

    function apply() {
        const foreground = ink(colors.background);
        const surface = mix(colors.background, foreground === "#FFFFFF" ? "#000000" : "#FFFFFF", 0.05);
        const supportInk = ink(colors.support);
        const journey = mix(colors.background, colors.primary, 0.055);
        const variables = {
            "--bg": colors.background,
            "--surface": surface,
            "--fg": foreground,
            "--muted": readable(mix(foreground, colors.background, 0.18), [colors.background, surface]),
            "--border": mix(colors.background, foreground, 0.18),
            "--accent": colors.primary,
            "--on-accent": ink(colors.primary),
            "--accent-ink": readable(colors.primary, [colors.background, surface]),
            "--tomato": readable(colors.accent, [colors.background, surface]),
            "--sky": colors.support,
            "--sky-fg": supportInk,
            "--sky-muted": readable(mix(supportInk, colors.support, 0.15), [colors.support]),
            "--sky-accent": readable(colors.primary, [colors.support]),
            "--sky-detail": readable(colors.accent, [colors.support]),
            "--journey": journey,
            "--journey-fg": ink(journey),
            "--journey-accent": readable(colors.primary, [journey]),
            "--journey-detail": readable(colors.accent, [journey])
        };
        Object.entries(variables).forEach(function ([key, value]) { root.style.setProperty(key, value); });
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", colors.primary);
    }
    apply();

    document.addEventListener("DOMContentLoaded", function () {
        if (config.enabled === false) return;
        const toggle = document.getElementById("theme-toggle");
        const dialog = document.getElementById("theme-dialog");
        const status = document.getElementById("theme-status");
        const fields = document.getElementById("theme-fields");
        const code = document.getElementById("theme-code");
        toggle.hidden = false;

        function sync() {
            keys.forEach(function (key) {
                document.getElementById("color-" + key).value = colors[key];
                document.getElementById("value-" + key).textContent = colors[key];
            });
            document.querySelectorAll("[data-preset]").forEach(function (button) {
                const preset = sanitize(presets[button.dataset.preset], defaults);
                button.setAttribute("aria-pressed", String(keys.every(function (key) { return preset[key] === colors[key]; })));
            });
            code.value = JSON.stringify(colors, null, 4);
        }
        function save() {
            try {
                localStorage.setItem(storageKey, JSON.stringify(colors));
                storageAvailable = true;
            } catch (_) { storageAvailable = false; }
            status.textContent = storageAvailable ? "Cores salvas neste navegador." : "Cores aplicadas. Este navegador não permitiu salvar a preferência.";
        }
        keys.forEach(function (key) {
            const label = document.createElement("label");
            label.className = "color-field";
            label.htmlFor = "color-" + key;
            const text = document.createElement("span");
            text.textContent = labels[key];
            const output = document.createElement("output");
            output.id = "value-" + key;
            output.htmlFor = "color-" + key;
            const input = document.createElement("input");
            input.type = "color";
            input.id = "color-" + key;
            input.value = colors[key];
            input.addEventListener("input", function () {
                colors[key] = input.value.toUpperCase();
                apply();
                sync();
            });
            input.addEventListener("change", save);
            label.append(text, output, input);
            fields.appendChild(label);
        });
        sync();
        toggle.addEventListener("click", function () {
            dialog.showModal();
            toggle.setAttribute("aria-expanded", "true");
        });
        dialog.addEventListener("close", function () {
            toggle.setAttribute("aria-expanded", "false");
            toggle.focus();
        });
        document.getElementById("theme-close").addEventListener("click", function () { dialog.close(); });
        // Feche somente se o gesto inteiro ocorreu no fundo, sem arrastar um campo.
        let startedOnBackdrop = false;
        function isBackdrop(event) {
            const box = dialog.getBoundingClientRect();
            return event.target === dialog && (event.clientX < box.left || event.clientX > box.right
                || event.clientY < box.top || event.clientY > box.bottom);
        }
        dialog.addEventListener("pointerdown", function (event) { startedOnBackdrop = isBackdrop(event); });
        dialog.addEventListener("click", function (event) {
            if (startedOnBackdrop && isBackdrop(event)) dialog.close();
            startedOnBackdrop = false;
        });
        document.querySelectorAll("[data-preset]").forEach(function (button) {
            button.addEventListener("click", function () {
                colors = sanitize(presets[button.dataset.preset], defaults);
                apply(); sync(); save();
            });
        });
        document.getElementById("theme-reset").addEventListener("click", function () {
            colors = { ...defaults };
            apply(); sync();
            try { localStorage.removeItem(storageKey); } catch (_) { /* A prévia continua funcionando. */ }
            status.textContent = "Cores originais restauradas.";
        });
        document.getElementById("theme-copy").addEventListener("click", async function () {
            try {
                await navigator.clipboard.writeText(code.value);
                status.textContent = "Cores copiadas.";
            } catch (_) {
                code.hidden = false;
                code.focus();
                code.select();
                status.textContent = "Selecione e copie os códigos abaixo.";
            }
        });
        window.addEventListener("storage", function (event) {
            if (event.key !== storageKey && event.key !== null) return;
            try { colors = sanitize(JSON.parse(event.newValue || "null"), defaults); }
            catch (_) { colors = { ...defaults }; }
            apply(); sync();
        });
    }, { once: true });
}());
