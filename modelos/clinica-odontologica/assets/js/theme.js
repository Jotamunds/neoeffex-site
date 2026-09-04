(function () {
    "use strict";

    const keys = ["accent", "background", "soft", "dark"];
    const presets = {
        original: { accent: "#a06a3b", background: "#ffffff", soft: "#faf8f4", dark: "#1c1b19" },
        azul: { accent: "#88c8ec", background: "#ffffff", soft: "#eff8fe", dark: "#102a43" },
        verde: { accent: "#287c69", background: "#ffffff", soft: "#eef7f3", dark: "#15382f" },
        grafite: { accent: "#bdc8d7", background: "#ffffff", soft: "#f0f2f5", dark: "#1b2430" }
    };
    const config = window.NEOEFFEX_LANDING || {};
    const validHex = function (value) { return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value); };
    const validPalette = function (value) { return value && keys.every(function (key) { return validHex(value[key]); }); };
    const defaults = validPalette(window.NEOEFFEX_THEME) ? window.NEOEFFEX_THEME : presets.original;
    const slug = config.catalog && config.catalog.slug;
    const scope = typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : "demonstracao";
    const storageKey = "neoeffex:landing:clinica-odontologica:theme:v1:" + scope;
    const root = document.documentElement;
    let current = Object.assign({}, defaults);
    let storageAvailable = true;
    let refreshControls = function () {};

    function rgb(hex) {
        return [1, 3, 5].map(function (offset) { return parseInt(hex.slice(offset, offset + 2), 16); });
    }
    function mix(a, b, weight) {
        const aa = rgb(a), bb = rgb(b);
        return "#" + aa.map(function (channel, index) {
            return Math.round(channel * (1 - weight) + bb[index] * weight).toString(16).padStart(2, "0");
        }).join("");
    }
    function luminance(hex) {
        const channels = rgb(hex).map(function (channel) {
            const value = channel / 255;
            return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    }
    function contrast(a, b) {
        const aa = luminance(a), bb = luminance(b);
        return (Math.max(aa, bb) + 0.05) / (Math.min(aa, bb) + 0.05);
    }
    function onColor(background) {
        return contrast("#000000", background) > contrast("#ffffff", background) ? "#000000" : "#ffffff";
    }
    function readable(color, background) {
        const target = onColor(background);
        let result = color;
        for (let step = 0; contrast(result, background) < 4.5 && step <= 20; step += 1) {
            result = mix(color, target, step / 20);
        }
        return result;
    }
    function apply(palette) {
        if (!validPalette(palette)) return false;
        current = Object.fromEntries(keys.map(function (key) { return [key, palette[key].toLowerCase()]; }));
        const fg = readable(mix(onColor(current.background), current.background, 0.10), current.background);
        const onSoft = readable(mix(onColor(current.soft), current.soft, 0.10), current.soft);
        const onDark = readable(mix(onColor(current.dark), current.dark, 0.05), current.dark);
        const accentOn = onColor(current.accent);
        // Deriva textos, bordas e hover de cada fundo, inclusive em paletas extremas.
        const hover = mix(current.accent, accentOn === "#ffffff" ? "#000000" : "#ffffff", 0.10);
        const vars = {
            "--accent": current.accent, "--accent-on": accentOn,
            "--accent-hover": hover, "--accent-hover-on": onColor(hover),
            "--surface": current.background, "--bg": current.soft,
            "--surface-warm": current.soft, "--dark": current.dark,
            "--fg": fg, "--fg-2": readable(mix(fg, current.background, 0.24), current.background),
            "--muted": readable(mix(fg, current.background, 0.35), current.background),
            "--meta": readable(current.accent, current.background),
            "--border": mix(current.background, fg, 0.20),
            "--on-soft": onSoft,
            "--soft-muted": readable(mix(onSoft, current.soft, 0.24), current.soft),
            "--soft-meta": readable(current.accent, current.soft),
            "--soft-border": mix(current.soft, onSoft, 0.20),
            "--on-dark": onDark,
            "--dark-muted": readable(mix(onDark, current.dark, 0.22), current.dark),
            "--dark-border": mix(current.dark, onDark, 0.40)
        };
        Object.keys(vars).forEach(function (key) { root.style.setProperty(key, vars[key]); });
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.content = current.background;
        refreshControls();
        return true;
    }
    function readSaved() {
        try {
            const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null");
            // Uma nova paleta publicada invalida preferências baseadas na versão anterior.
            if (saved && saved.base === JSON.stringify(defaults) && validPalette(saved.colors)) return saved.colors;
        } catch (_) { storageAvailable = false; }
        return defaults;
    }
    function save() {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify({ base: JSON.stringify(defaults), colors: current }));
            storageAvailable = true;
        } catch (_) { storageAvailable = false; }
    }
    // Aplica antes do primeiro desenho da página para evitar piscar na paleta padrão.
    apply(config.themeEditor === false ? defaults : readSaved());

    document.addEventListener("DOMContentLoaded", function () {
        const opener = document.getElementById("theme-open");
        const dialog = document.getElementById("theme-dialog");
        const status = document.getElementById("theme-status");
        if (config.themeEditor === false || !dialog || typeof dialog.showModal !== "function") return;
        opener.hidden = false;
        function announce(message) { status.textContent = message; }
        function savedMessage() {
            announce(storageAvailable ? "Cores salvas neste navegador." : "Prévia aplicada. Este navegador não permitiu salvar as cores; você ainda pode exportar a paleta.");
        }
        refreshControls = function () {
            // Evita manter uma exportação antiga visível depois de trocar a paleta.
            document.getElementById("theme-export-fallback").hidden = true;
            keys.forEach(function (key) {
                dialog.querySelector('[data-color-picker="' + key + '"]').value = current[key];
                const text = dialog.querySelector('[data-color-text="' + key + '"]');
                if (document.activeElement !== text) text.value = current[key];
                text.removeAttribute("aria-invalid");
            });
            dialog.querySelectorAll("[data-preset]").forEach(function (button) {
                const preset = presets[button.dataset.preset];
                button.setAttribute("aria-pressed", String(keys.every(function (key) { return current[key] === preset[key]; })));
            });
        };
        refreshControls();
        opener.addEventListener("click", function () {
            refreshControls();
            dialog.showModal();
            opener.setAttribute("aria-expanded", "true");
            root.classList.add("theme-dialog-open");
        });
        document.getElementById("theme-close").addEventListener("click", function () { dialog.close(); });
        dialog.addEventListener("close", function () {
            root.classList.remove("theme-dialog-open");
            opener.setAttribute("aria-expanded", "false");
            opener.focus();
        });
        // Só fecha no fundo quando o gesto inteiro começa E termina fora do painel.
        let startedOutside = false;
        function outside(event) {
            const box = dialog.getBoundingClientRect();
            return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
        }
        dialog.addEventListener("pointerdown", function (event) { startedOutside = event.target === dialog && outside(event); });
        dialog.addEventListener("pointerup", function (event) {
            if (startedOutside && event.target === dialog && outside(event)) dialog.close();
            startedOutside = false;
        });
        dialog.addEventListener("pointercancel", function () { startedOutside = false; });
        dialog.querySelectorAll("[data-preset]").forEach(function (button) {
            button.addEventListener("click", function () { apply(presets[button.dataset.preset]); save(); savedMessage(); });
        });
        dialog.querySelectorAll("[data-color-picker]").forEach(function (input) {
            input.addEventListener("input", function () {
                apply(Object.assign({}, current, { [input.dataset.colorPicker]: input.value }));
                save();
            });
            input.addEventListener("change", savedMessage);
        });
        dialog.querySelectorAll("[data-color-text]").forEach(function (input) {
            input.addEventListener("input", function () {
                const value = input.value.trim();
                if (!validHex(value)) { input.setAttribute("aria-invalid", "true"); return; }
                apply(Object.assign({}, current, { [input.dataset.colorText]: value }));
                save();
                savedMessage();
            });
            input.addEventListener("blur", function () {
                if (!validHex(input.value.trim())) announce("Código inválido. A última cor válida foi mantida.");
                input.value = current[input.dataset.colorText];
                input.removeAttribute("aria-invalid");
            });
        });
        document.getElementById("theme-reset").addEventListener("click", function () {
            try { window.localStorage.removeItem(storageKey); storageAvailable = true; }
            catch (_) { storageAvailable = false; }
            apply(defaults);
            announce(storageAvailable ? "Paleta padrão restaurada." : "Paleta padrão aplicada. O navegador não permitiu remover a preferência salva.");
        });
        document.getElementById("theme-export").addEventListener("click", function () {
            const code = "/* Paleta exportada. Substitua assets/js/theme-config.js por este arquivo. */\n"
                + "window.NEOEFFEX_THEME = Object.freeze(" + JSON.stringify(current, null, 4) + ");\n";
            const fallback = document.getElementById("theme-export-fallback");
            const codeField = document.getElementById("theme-export-code");
            codeField.value = code;
            fallback.hidden = false;
            const url = URL.createObjectURL(new Blob([code], { type: "text/javascript;charset=utf-8" }));
            const link = document.createElement("a");
            link.href = url;
            link.download = "theme-config.js";
            // O restante da página está inerte enquanto o diálogo modal está aberto.
            // O link precisa ficar dentro do diálogo para receber a ativação.
            dialog.appendChild(link);
            link.click();
            link.remove();
            codeField.focus();
            codeField.select();
            window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
            announce("Cores prontas para baixar ou copiar. Veja no README como publicar a paleta.");
        });
        window.addEventListener("storage", function (event) {
            if (event.key !== storageKey && event.key !== null) return;
            apply(readSaved());
            if (dialog.open) announce("Cores atualizadas a partir de outra aba.");
        });
    });
}());
