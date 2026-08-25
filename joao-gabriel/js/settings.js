/*
 * JOÃO/OS — Configurações
 *
 * Salva apenas preferências visuais locais. Nenhuma informação
 * é enviada para um servidor ou associada ao visitante.
 */

const STORAGE_KEY = "joaoos.preferences";
const VALID_WALLPAPER_LEVELS = new Set([
    "low",
    "standard",
    "high",
]);

const DEFAULT_PREFERENCES = Object.freeze({
    wallpaper: "standard",
    motion: true,
    transparency: true,
});

function normalizePreferences(value) {
    if (!value || typeof value !== "object") {
        return { ...DEFAULT_PREFERENCES };
    }

    return {
        wallpaper: VALID_WALLPAPER_LEVELS.has(value.wallpaper)
            ? value.wallpaper
            : DEFAULT_PREFERENCES.wallpaper,
        motion: value.motion !== false,
        transparency: value.transparency !== false,
    };
}

function readPreferences() {
    try {
        return normalizePreferences(
            JSON.parse(window.localStorage.getItem(STORAGE_KEY))
        );
    } catch {
        return { ...DEFAULT_PREFERENCES };
    }
}

function savePreferences(preferences) {
    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(preferences)
        );
        return true;
    } catch {
        return false;
    }
}

function applyPreferences(preferences) {
    const root = document.documentElement;

    root.dataset.wallpaperIntensity = preferences.wallpaper;
    root.classList.toggle(
        "is-motion-reduced",
        !preferences.motion
    );
    root.classList.toggle(
        "is-transparency-reduced",
        !preferences.transparency
    );
}

export function initializeSettingsApp() {
    const app = document.querySelector("[data-settings-app]");

    if (!app) {
        return;
    }

    const wallpaperButtons = Array.from(
        app.querySelectorAll("[data-settings-wallpaper]")
    );
    const motionInput = app.querySelector("[data-settings-motion]");
    const transparencyInput = app.querySelector(
        "[data-settings-transparency]"
    );
    const resetButton = app.querySelector("[data-settings-reset]");
    const statusElement = app.querySelector("[data-settings-status]");

    let preferences = readPreferences();

    function updateControls() {
        wallpaperButtons.forEach(function (button) {
            const isSelected =
                button.dataset.settingsWallpaper ===
                preferences.wallpaper;

            button.setAttribute("aria-checked", String(isSelected));
            button.tabIndex = isSelected ? 0 : -1;
        });

        motionInput.checked = preferences.motion;
        transparencyInput.checked = preferences.transparency;
    }

    function updateStatus(message) {
        statusElement.textContent = message;
    }

    function commitPreferences(message) {
        applyPreferences(preferences);
        updateControls();

        updateStatus(
            savePreferences(preferences)
                ? message
                : "A alteração foi aplicada, mas não pôde ser salva."
        );
    }

    function selectWallpaper(value) {
        preferences = {
            ...preferences,
            wallpaper: value,
        };

        commitPreferences("Intensidade do ambiente atualizada.");
    }

    function moveWallpaperFocus(currentButton, direction) {
        const currentIndex = wallpaperButtons.indexOf(currentButton);
        const nextIndex = (
            currentIndex + direction + wallpaperButtons.length
        ) % wallpaperButtons.length;
        const nextButton = wallpaperButtons[nextIndex];

        selectWallpaper(nextButton.dataset.settingsWallpaper);
        nextButton.focus();
    }

    wallpaperButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectWallpaper(button.dataset.settingsWallpaper);
        });

        button.addEventListener("keydown", function (event) {
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                moveWallpaperFocus(button, 1);
                return;
            }

            if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                moveWallpaperFocus(button, -1);
            }
        });
    });

    motionInput.addEventListener("change", function () {
        preferences = {
            ...preferences,
            motion: motionInput.checked,
        };

        commitPreferences(
            motionInput.checked
                ? "Movimento da interface ativado."
                : "Movimento da interface reduzido."
        );
    });

    transparencyInput.addEventListener("change", function () {
        preferences = {
            ...preferences,
            transparency: transparencyInput.checked,
        };

        commitPreferences(
            transparencyInput.checked
                ? "Transparência ativada."
                : "Transparência desativada."
        );
    });

    resetButton.addEventListener("click", function () {
        preferences = { ...DEFAULT_PREFERENCES };
        commitPreferences("Preferências padrão restauradas.");
    });

    window.addEventListener("storage", function (event) {
        if (event.key !== STORAGE_KEY) {
            return;
        }

        preferences = readPreferences();
        applyPreferences(preferences);
        updateControls();
        updateStatus("Preferências sincronizadas com outra aba.");
    });

    applyPreferences(preferences);
    updateControls();
}
