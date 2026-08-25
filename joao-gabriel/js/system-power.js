/*
 * JOÃO/OS — Controles de energia
 *
 * Reiniciar limpa a sessão visual e repete a inicialização.
 * Desligar encerra a experiência abrindo o LinkedIn do autor.
 */

const BOOT_SESSION_KEY = "joaoos:boot-seen";
const WINDOW_SESSION_KEY = "joaoos.window-session";
const LINKEDIN_URL =
    "https://www.linkedin.com/in/joao-gabriel-vieira-da-silva";

function closeFloatingMenus() {
    document.dispatchEvent(new CustomEvent("joaoos:closesystemmenu"));
    document.dispatchEvent(new CustomEvent("joaoos:closecontextmenu"));
}

export function initializeSystemPower() {
    const restartButtons = Array.from(
        document.querySelectorAll("[data-system-restart]")
    );

    const shutdownButtons = Array.from(
        document.querySelectorAll("[data-system-shutdown]")
    );

    function restart() {
        closeFloatingMenus();
        document.dispatchEvent(new CustomEvent("joaoos:restarting"));

        try {
            window.sessionStorage.removeItem(BOOT_SESSION_KEY);
        } catch {
            // O reload ainda funciona se o armazenamento estiver bloqueado.
        }

        try {
            window.localStorage.removeItem(WINDOW_SESSION_KEY);
        } catch {
            // A sessão simplesmente não será apagada neste navegador.
        }

        window.location.reload();
    }

    function shutdown() {
        closeFloatingMenus();
        window.location.assign(LINKEDIN_URL);
    }

    restartButtons.forEach(function (button) {
        button.addEventListener("click", restart);
    });

    shutdownButtons.forEach(function (button) {
        button.addEventListener("click", shutdown);
    });

    return Object.freeze({
        restart,
        shutdown,
    });
}
