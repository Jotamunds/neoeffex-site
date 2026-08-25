/*
 * JOÃO/OS — Sequência de inicialização
 *
 * Controla a abertura cinematográfica antes de liberar
 * a interação com a área de trabalho.
 */

const BOOT_SESSION_KEY = "joaoos:boot-seen";

const TIMING = {
    initialPause: 180,
    nameEntrance: 620,
    lineTravel: 860,
    screenOpening: 920,
    desktopPause: 800,
    elementEntrance: 360,
};

function wait(duration) {
    return new Promise(function (resolve) {
        window.setTimeout(resolve, duration);
    });
}

function saveBootSession() {
    try {
        sessionStorage.setItem(BOOT_SESSION_KEY, "true");
    } catch (error) {
        /*
         * A animação continua funcionando mesmo quando o navegador
         * impede o acesso ao armazenamento da sessão.
         */
    }
}

function finishBootSequence(root, bootScreen, desktop) {
    desktop.inert = false;
    desktop.removeAttribute("aria-busy");

    root.classList.remove(
        "has-boot-sequence",
        "is-desktop-ready"
    );

    bootScreen.remove();
}

async function playBootSequence(root, bootScreen, desktop) {
    await wait(TIMING.initialPause);

    bootScreen.classList.add("is-name-visible");
    await wait(TIMING.nameEntrance);

    bootScreen.classList.add("is-line-drawn");
    await wait(TIMING.lineTravel);

    bootScreen.classList.add("is-opening");
    await wait(TIMING.screenOpening);

    /*
     * A área de trabalho fica visível, mas vazia, por um instante
     * antes de seus controles aparecerem.
     */
    await wait(TIMING.desktopPause);

    root.classList.add("is-desktop-ready");
    await wait(TIMING.elementEntrance);

    finishBootSequence(root, bootScreen, desktop);
}

export function initializeBootSequence() {
    const root = document.documentElement;
    const bootScreen = document.querySelector("[data-boot-sequence]");
    const desktop = document.querySelector(".desktop");

    if (!bootScreen || !desktop) {
        return;
    }

    if (!root.classList.contains("has-boot-sequence")) {
        bootScreen.remove();
        return;
    }

    desktop.inert = true;
    desktop.setAttribute("aria-busy", "true");
    saveBootSession();

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        root.classList.add("is-desktop-ready");
        finishBootSequence(root, bootScreen, desktop);
        return;
    }

    void playBootSequence(root, bootScreen, desktop);
}
