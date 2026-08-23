/*
 * JOÃO/OS — versão 0.1.0
 *
 * Ponto de entrada do sistema.
 */

const timeElement = document.querySelector(".taskbar__time");
const dateElement = document.querySelector(".taskbar__date");

function updateClock() {
    const now = new Date();

    const formattedTime = new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(now);

    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
    })
        .format(now)
        .replace(" de ", " ")
        .replace(".", "")
        .toUpperCase();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const machineDate = `${year}-${month}-${day}`;

    timeElement.textContent = formattedTime;
    timeElement.dateTime = now.toISOString();

    dateElement.textContent = formattedDate;
    dateElement.dateTime = machineDate;
}

const aboutAppButton = document.querySelector('[data-app="about"]');
const aboutWindow = document.querySelector("#about-window");
const minimizeAboutButton = aboutWindow.querySelector(
    '[data-window-action="minimize"]'
);

const maximizeAboutButton = aboutWindow.querySelector(
    '[data-window-action="maximize"]'
);

const closeAboutButton = aboutWindow.querySelector(
    '[data-window-action="close"]'
);

const maximizeSymbol = maximizeAboutButton.querySelector(
    "[data-maximize-symbol]"
);

const runningAppButton = document.querySelector("[data-running-app]");

let aboutWindowState = "closed";
let isAboutMaximized = false;
let isDraggingAboutWindow = false;
let dragPointerId = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function openAboutWindow() {
    aboutWindowState = "open";

    aboutWindow.hidden = false;
    aboutAppButton.setAttribute("aria-expanded", "true");

    updateRunningAppButton();
    closeAboutButton.focus();
}

function closeAboutWindow() {
    aboutWindowState = "closed";
    isAboutMaximized = false;

    aboutWindow.hidden = true;
    aboutWindow.classList.remove("is-maximized");

    aboutAppButton.setAttribute("aria-expanded", "false");

    maximizeAboutButton.setAttribute(
        "aria-label",
        "Maximizar janela"
    );

    maximizeSymbol.textContent = "□";
    maximizeAboutButton.title = "Maximizar";

    updateRunningAppButton();
    aboutAppButton.focus();
}

function minimizeAboutWindow() {
    aboutWindowState = "minimized";

    aboutWindow.hidden = true;
    aboutAppButton.setAttribute("aria-expanded", "false");

    updateRunningAppButton();
    runningAppButton.focus();
}

function restoreAboutWindow() {
    if (aboutWindowState !== "minimized") {
        return;
    }

    aboutWindowState = "open";

    aboutWindow.hidden = false;
    aboutAppButton.setAttribute("aria-expanded", "true");

    updateRunningAppButton();
    minimizeAboutButton.focus();
}

function toggleMaximizeAboutWindow() {
    isAboutMaximized = !isAboutMaximized;

    aboutWindow.classList.toggle(
        "is-maximized",
        isAboutMaximized
    );

    if (isAboutMaximized) {
        maximizeAboutButton.setAttribute(
            "aria-label",
            "Restaurar tamanho da janela"
        );

        maximizeSymbol.textContent = "❐";
        maximizeAboutButton.title = "Restaurar tamanho";
        return;
    }

    maximizeAboutButton.setAttribute(
        "aria-label",
        "Maximizar janela"
    );

    maximizeSymbol.textContent = "□";
    maximizeAboutButton.title = "Maximizar";
}

function updateRunningAppButton() {
    if (aboutWindowState === "closed") {
        runningAppButton.textContent = "Nenhum aplicativo aberto";
        runningAppButton.disabled = true;
        runningAppButton.removeAttribute("aria-pressed");
        runningAppButton.title = "";
        return;
    }

    runningAppButton.disabled = false;

    if (aboutWindowState === "minimized") {
        runningAppButton.textContent = "Sistema — minimizado";
        runningAppButton.setAttribute("aria-pressed", "false");
        runningAppButton.title = "Restaurar Sistema";
        return;
    }

    runningAppButton.textContent = "Sistema aberto";
    runningAppButton.setAttribute("aria-pressed", "true");
    runningAppButton.title = "Minimizar Sistema";
}

function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
}

function getAboutWindowBounds() {
    const safeGap = 12;

    const layerRect = windowLayer.getBoundingClientRect();
    const taskbarRect = taskbar.getBoundingClientRect();
    const windowRect = aboutWindow.getBoundingClientRect();

    const taskbarTopInsideLayer =
        taskbarRect.top - layerRect.top;

    return {
        minimumLeft: safeGap,
        minimumTop: safeGap,

        maximumLeft: Math.max(
            layerRect.width - windowRect.width - safeGap,
            safeGap
        ),

        maximumTop: Math.max(
            taskbarTopInsideLayer - windowRect.height - safeGap,
            safeGap
        ),
    };
}

function startDraggingAboutWindow(event) {
    const clickedWindowControl = event.target.closest(
        ".system-window__controls"
    );

    if (clickedWindowControl) {
        return;
    }

    if (isAboutMaximized || aboutWindowState !== "open") {
        return;
    }

    const windowRect = aboutWindow.getBoundingClientRect();
    const layerRect = windowLayer.getBoundingClientRect();

    isDraggingAboutWindow = true;
    dragPointerId = event.pointerId;

    dragOffsetX = event.clientX - windowRect.left;
    dragOffsetY = event.clientY - windowRect.top;

    aboutWindow.style.setProperty(
        "--window-left",
        `${windowRect.left - layerRect.left}px`
    );

    aboutWindow.style.setProperty(
        "--window-top",
        `${windowRect.top - layerRect.top}px`
    );

    aboutWindow.classList.add("is-positioned");
    aboutWindow.classList.add("is-dragging");

    aboutWindowTitlebar.setPointerCapture(event.pointerId);
}

function dragAboutWindow(event) {
    if (
        !isDraggingAboutWindow ||
        event.pointerId !== dragPointerId
    ) {
        return;
    }

    const layerRect = windowLayer.getBoundingClientRect();
    const bounds = getAboutWindowBounds();

    const nextLeft = clamp(
        event.clientX - layerRect.left - dragOffsetX,
        bounds.minimumLeft,
        bounds.maximumLeft
    );

    const nextTop = clamp(
        event.clientY - layerRect.top - dragOffsetY,
        bounds.minimumTop,
        bounds.maximumTop
    );

    aboutWindow.style.setProperty(
        "--window-left",
        `${nextLeft}px`
    );

    aboutWindow.style.setProperty(
        "--window-top",
        `${nextTop}px`
    );
}

function stopDraggingAboutWindow(event) {
    if (window.matchMedia("(max-width: 600px)").matches) {
        return;
    }

    if (
        !isDraggingAboutWindow ||
        event.pointerId !== dragPointerId
    ) {
        return;
    }

    isDraggingAboutWindow = false;
    dragPointerId = null;

    aboutWindow.classList.remove("is-dragging");

    if (
        aboutWindowTitlebar.hasPointerCapture(event.pointerId)
    ) {
        aboutWindowTitlebar.releasePointerCapture(
            event.pointerId
        );
    }
}

function keepAboutWindowInsideBounds() {
    if (
        aboutWindowState === "closed" ||
        isAboutMaximized ||
        !aboutWindow.classList.contains("is-positioned")
    ) {
        return;
    }

    const windowRect = aboutWindow.getBoundingClientRect();
    const layerRect = windowLayer.getBoundingClientRect();
    const bounds = getAboutWindowBounds();

    const currentLeft = windowRect.left - layerRect.left;
    const currentTop = windowRect.top - layerRect.top;

    const correctedLeft = clamp(
        currentLeft,
        bounds.minimumLeft,
        bounds.maximumLeft
    );

    const correctedTop = clamp(
        currentTop,
        bounds.minimumTop,
        bounds.maximumTop
    );

    aboutWindow.style.setProperty(
        "--window-left",
        `${correctedLeft}px`
    );

    aboutWindow.style.setProperty(
        "--window-top",
        `${correctedTop}px`
    );
}

const windowLayer = document.querySelector(".window-layer");
const taskbar = document.querySelector(".taskbar");
const aboutWindowTitlebar = aboutWindow.querySelector(
    "[data-window-drag-handle]"
);

/*
--- ADD EVENT LISTENER ---
*/

aboutAppButton.addEventListener("click", openAboutWindow);

minimizeAboutButton.addEventListener(
    "click",
    minimizeAboutWindow
);

maximizeAboutButton.addEventListener(
    "click",
    toggleMaximizeAboutWindow
);

closeAboutButton.addEventListener("click", closeAboutWindow);

runningAppButton.addEventListener(
    "click",
    function () {
        if (aboutWindowState === "open") {
            minimizeAboutWindow();
            return;
        }

        if (aboutWindowState === "minimized") {
            restoreAboutWindow();
        }
    }
);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && aboutWindowState !== "closed") {
        closeAboutWindow();
    }
});

aboutWindowTitlebar.addEventListener(
    "pointerdown",
    startDraggingAboutWindow
);

aboutWindowTitlebar.addEventListener(
    "pointermove",
    dragAboutWindow
);

aboutWindowTitlebar.addEventListener(
    "pointerup",
    stopDraggingAboutWindow
);

aboutWindowTitlebar.addEventListener(
    "pointercancel",
    stopDraggingAboutWindow
);

window.addEventListener(
    "resize",
    keepAboutWindowInsideBounds
);

/*
--- FIM DOS ADD EVENT LISTENER ---
*/

console.info("JOÃO/OS 0.1.0 iniciado.");

updateClock();
setInterval(updateClock, 1000);