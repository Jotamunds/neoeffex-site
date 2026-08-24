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

/*
 * Elementos compartilhados por todas as janelas.
 */
const windowLayer = document.querySelector(".window-layer");
const taskbar = document.querySelector(".taskbar");
const runningEmptyState = document.querySelector(
    "[data-running-empty]"
);

/*
 * O Map armazena os aplicativos usando o identificador
 * presente no atributo data-window.
 */
const apps = new Map();

let highestWindowZIndex = 10;
let activeApp = null;

/*
 * Descobre todas as janelas do HTML e cria um objeto
 * de estado para cada aplicativo.
 */
document.querySelectorAll("[data-window]").forEach(
    function (windowElement) {
        const id = windowElement.dataset.window;

        const appButton = document.querySelector(
            `[data-app="${id}"]`
        );

        const runningButton = document.querySelector(
            `[data-running-app="${id}"]`
        );

        const minimizeButton = windowElement.querySelector(
            '[data-window-action="minimize"]'
        );

        const maximizeButton = windowElement.querySelector(
            '[data-window-action="maximize"]'
        );

        const closeButton = windowElement.querySelector(
            '[data-window-action="close"]'
        );

        const maximizeSymbol = maximizeButton.querySelector(
            "[data-maximize-symbol]"
        );

        const titlebar = windowElement.querySelector(
            "[data-window-drag-handle]"
        );

        const name = appButton
            .querySelector(".app-icon__name")
            .textContent
            .trim();

        apps.set(id, {
            id,
            name,

            appButton,
            runningButton,
            windowElement,
            titlebar,

            minimizeButton,
            maximizeButton,
            maximizeSymbol,
            closeButton,

            state: "closed",
            isMaximized: false,

            drag: {
                isDragging: false,
                pointerId: null,
                offsetX: 0,
                offsetY: 0,
            },
        });
    }
);

/*
 * Limita um número entre um valor mínimo e máximo.
 */
function clamp(value, minimum, maximum) {
    return Math.min(
        Math.max(value, minimum),
        maximum
    );
}

/*
 * Mostra o aviso somente quando não há aplicativos
 * abertos ou minimizados.
 */
function updateEmptyRunningState() {
    const hasOpenApplication = Array
        .from(apps.values())
        .some(function (app) {
            return app.state !== "closed";
        });

    runningEmptyState.hidden = hasOpenApplication;
}

/*
 * Atualiza o botão de um aplicativo na barra inferior.
 */
function updateRunningButton(app) {
    if (app.state === "closed") {
        app.runningButton.hidden = true;
        app.runningButton.classList.remove("is-active");
        app.runningButton.removeAttribute("aria-pressed");
        app.runningButton.removeAttribute("aria-current");
        app.runningButton.title = "";

        updateEmptyRunningState();
        return;
    }

    app.runningButton.hidden = false;

    if (app.state === "minimized") {
        app.runningButton.textContent =
            `${app.name} — minimizado`;

        app.runningButton.setAttribute(
            "aria-pressed",
            "false"
        );

        app.runningButton.title =
            `Restaurar ${app.name}`;

        updateEmptyRunningState();
        return;
    }

    app.runningButton.textContent =
        `${app.name} aberto`;

    app.runningButton.setAttribute(
        "aria-pressed",
        "true"
    );

    app.runningButton.title =
        `Minimizar ${app.name}`;

    updateEmptyRunningState();
}

/*
 * Remove o estado ativo sem fechar a janela.
 */
function deactivateWindow(app) {
    app.windowElement.classList.remove("is-active");
    app.runningButton.classList.remove("is-active");
    app.runningButton.removeAttribute("aria-current");

    if (activeApp === app) {
        activeApp = null;
    }
}

/*
 * Ativa uma janela, coloca-a na frente e desativa
 * todas as outras.
 */
function activateWindow(app) {
    if (app.state !== "open") {
        return;
    }

    apps.forEach(function (otherApp) {
        if (otherApp !== app) {
            deactivateWindow(otherApp);
        }
    });

    highestWindowZIndex += 1;

    app.windowElement.style.zIndex =
        String(highestWindowZIndex);

    app.windowElement.classList.add("is-active");
    app.runningButton.classList.add("is-active");

    app.runningButton.setAttribute(
        "aria-current",
        "true"
    );

    activeApp = app;
}

/*
 * Localiza a janela aberta que está visualmente
 * acima das demais.
 */
function getTopVisibleWindow(excludedApp = null) {
    const visibleApps = Array
        .from(apps.values())
        .filter(function (app) {
            return (
                app !== excludedApp &&
                app.state === "open"
            );
        });

    visibleApps.sort(function (firstApp, secondApp) {
        const firstZIndex = Number(
            firstApp.windowElement.style.zIndex || 10
        );

        const secondZIndex = Number(
            secondApp.windowElement.style.zIndex || 10
        );

        return secondZIndex - firstZIndex;
    });

    return visibleApps[0] || null;
}

function activateTopVisibleWindow(excludedApp) {
    const nextApp = getTopVisibleWindow(excludedApp);

    if (nextApp) {
        activateWindow(nextApp);
    }
}

/*
 * Abre e ativa uma janela.
 */
function openWindow(app) {
    app.state = "open";
    app.windowElement.hidden = false;

    app.appButton.setAttribute(
        "aria-expanded",
        "true"
    );

    updateRunningButton(app);
    activateWindow(app);

    app.closeButton.focus();
}

/*
 * Minimiza uma janela sem perder seu tamanho ou
 * sua posição anterior.
 */
function minimizeWindow(app, shouldMoveFocus = true) {
    const wasActive = activeApp === app;

    app.state = "minimized";
    deactivateWindow(app);

    app.windowElement.hidden = true;

    app.appButton.setAttribute(
        "aria-expanded",
        "false"
    );

    updateRunningButton(app);

    if (wasActive) {
        activateTopVisibleWindow(app);
    }

    if (shouldMoveFocus) {
        app.runningButton.focus();
    }
}

/*
 * Restaura uma janela que estava minimizada.
 */
function restoreWindow(app) {
    if (app.state !== "minimized") {
        return;
    }

    app.state = "open";
    app.windowElement.hidden = false;

    app.appButton.setAttribute(
        "aria-expanded",
        "true"
    );

    updateRunningButton(app);
    activateWindow(app);

    app.minimizeButton.focus();
}

function resetMaximizeButton(app) {
    app.maximizeButton.setAttribute(
        "aria-label",
        "Maximizar janela"
    );

    app.maximizeButton.title = "Maximizar";
    app.maximizeSymbol.textContent = "□";
}

/*
 * Fecha uma janela e reinicia seu estado maximizado.
 */
function closeWindow(app) {
    const wasActive = activeApp === app;

    app.state = "closed";
    app.isMaximized = false;

    deactivateWindow(app);

    app.windowElement.hidden = true;
    app.windowElement.classList.remove("is-maximized");

    app.appButton.setAttribute(
        "aria-expanded",
        "false"
    );

    resetMaximizeButton(app);
    updateRunningButton(app);

    if (wasActive) {
        activateTopVisibleWindow(app);
    }

    app.appButton.focus();
}

/*
 * Alterna entre o tamanho normal e maximizado.
 */
function toggleMaximizeWindow(app) {
    if (app.state !== "open") {
        return;
    }

    app.isMaximized = !app.isMaximized;

    app.windowElement.classList.toggle(
        "is-maximized",
        app.isMaximized
    );

    if (app.isMaximized) {
        app.maximizeButton.setAttribute(
            "aria-label",
            "Restaurar tamanho da janela"
        );

        app.maximizeButton.title = "Restaurar tamanho";
        app.maximizeSymbol.textContent = "❐";
        return;
    }

    resetMaximizeButton(app);
}

/*
 * Clique no ícone do desktop:
 * fechado -> abre
 * aberto -> minimiza
 * minimizado -> restaura
 */
function toggleWindowFromDesktop(app) {
    if (app.state === "closed") {
        openWindow(app);
        return;
    }

    if (app.state === "open") {
        minimizeWindow(app, false);
        return;
    }

    restoreWindow(app);
}

/*
 * Clique no botão da barra:
 * aberto -> minimiza
 * minimizado -> restaura
 */
function toggleWindowFromTaskbar(app) {
    if (app.state === "open") {
        minimizeWindow(app, false);
        return;
    }

    if (app.state === "minimized") {
        restoreWindow(app);
    }
}

/*
 * Calcula os limites de movimento sem permitir que
 * a janela cubra a barra inferior.
 */
function getWindowBounds(app) {
    const safeGap = 12;

    const layerRect =
        windowLayer.getBoundingClientRect();

    const taskbarRect =
        taskbar.getBoundingClientRect();

    const windowRect =
        app.windowElement.getBoundingClientRect();

    const taskbarTopInsideLayer =
        taskbarRect.top - layerRect.top;

    return {
        minimumLeft: safeGap,
        minimumTop: safeGap,

        maximumLeft: Math.max(
            layerRect.width -
                windowRect.width -
                safeGap,
            safeGap
        ),

        maximumTop: Math.max(
            taskbarTopInsideLayer -
                windowRect.height -
                safeGap,
            safeGap
        ),
    };
}

/*
 * Inicia o arraste pela barra de título.
 */
function startDraggingWindow(app, event) {
    const clickedControl = event.target.closest(
        ".system-window__controls"
    );

    if (clickedControl) {
        return;
    }

    if (
        window
            .matchMedia("(max-width: 600px)")
            .matches
    ) {
        return;
    }

    if (
        app.isMaximized ||
        app.state !== "open"
    ) {
        return;
    }

    activateWindow(app);

    const windowRect =
        app.windowElement.getBoundingClientRect();

    const layerRect =
        windowLayer.getBoundingClientRect();

    app.drag.isDragging = true;
    app.drag.pointerId = event.pointerId;
    app.drag.offsetX = event.clientX - windowRect.left;
    app.drag.offsetY = event.clientY - windowRect.top;

    app.windowElement.style.setProperty(
        "--window-left",
        `${windowRect.left - layerRect.left}px`
    );

    app.windowElement.style.setProperty(
        "--window-top",
        `${windowRect.top - layerRect.top}px`
    );

    app.windowElement.classList.add(
        "is-positioned",
        "is-dragging"
    );

    app.titlebar.setPointerCapture(event.pointerId);
}

/*
 * Movimenta a janela durante o arraste.
 */
function dragWindow(app, event) {
    if (
        !app.drag.isDragging ||
        event.pointerId !== app.drag.pointerId
    ) {
        return;
    }

    const layerRect =
        windowLayer.getBoundingClientRect();

    const bounds = getWindowBounds(app);

    const nextLeft = clamp(
        event.clientX -
            layerRect.left -
            app.drag.offsetX,
        bounds.minimumLeft,
        bounds.maximumLeft
    );

    const nextTop = clamp(
        event.clientY -
            layerRect.top -
            app.drag.offsetY,
        bounds.minimumTop,
        bounds.maximumTop
    );

    app.windowElement.style.setProperty(
        "--window-left",
        `${nextLeft}px`
    );

    app.windowElement.style.setProperty(
        "--window-top",
        `${nextTop}px`
    );
}

/*
 * Finaliza o arraste.
 */
function stopDraggingWindow(app, event) {
    if (
        !app.drag.isDragging ||
        event.pointerId !== app.drag.pointerId
    ) {
        return;
    }

    app.drag.isDragging = false;
    app.drag.pointerId = null;

    app.windowElement.classList.remove("is-dragging");

    if (app.titlebar.hasPointerCapture(event.pointerId)) {
        app.titlebar.releasePointerCapture(event.pointerId);
    }
}

/*
 * Mantém uma janela posicionada dentro da área útil
 * quando o navegador muda de tamanho.
 */
function keepWindowInsideBounds(app) {
    if (
        app.state === "closed" ||
        app.isMaximized ||
        !app.windowElement.classList.contains(
            "is-positioned"
        )
    ) {
        return;
    }

    const windowRect =
        app.windowElement.getBoundingClientRect();

    const layerRect =
        windowLayer.getBoundingClientRect();

    const bounds = getWindowBounds(app);

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

    app.windowElement.style.setProperty(
        "--window-left",
        `${correctedLeft}px`
    );

    app.windowElement.style.setProperty(
        "--window-top",
        `${correctedTop}px`
    );
}

/*
 * Conecta os eventos de todos os aplicativos.
 */
apps.forEach(function (app) {
    app.appButton.addEventListener(
        "click",
        function () {
            toggleWindowFromDesktop(app);
        }
    );

    app.minimizeButton.addEventListener(
        "click",
        function () {
            minimizeWindow(app);
        }
    );

    app.maximizeButton.addEventListener(
        "click",
        function () {
            toggleMaximizeWindow(app);
        }
    );

    app.closeButton.addEventListener(
        "click",
        function () {
            closeWindow(app);
        }
    );

    /*
     * Evita um destaque de foco desnecessário
     * quando o botão é clicado com o mouse.
     */
    app.runningButton.addEventListener(
        "pointerdown",
        function (event) {
            if (event.pointerType === "mouse") {
                event.preventDefault();
            }
        }
    );

    app.runningButton.addEventListener(
        "click",
        function () {
            toggleWindowFromTaskbar(app);
        }
    );

    app.titlebar.addEventListener(
        "pointerdown",
        function (event) {
            startDraggingWindow(app, event);
        }
    );

    app.titlebar.addEventListener(
        "pointermove",
        function (event) {
            dragWindow(app, event);
        }
    );

    app.titlebar.addEventListener(
        "pointerup",
        function (event) {
            stopDraggingWindow(app, event);
        }
    );

    app.titlebar.addEventListener(
        "pointercancel",
        function (event) {
            stopDraggingWindow(app, event);
        }
    );

    app.windowElement.addEventListener(
        "pointerdown",
        function (event) {
            const control = event.target.closest(
                "[data-window-action]"
            );

            /*
             * Minimizar ou fechar uma janela inativa
             * não deve ativá-la rapidamente.
             */
            if (control) {
                const action =
                    control.dataset.windowAction;

                if (
                    action === "minimize" ||
                    action === "close"
                ) {
                    return;
                }
            }

            activateWindow(app);
        }
    );
});

/*
 * Clicar no desktop desativa todas as janelas sem
 * fechá-las ou minimizá-las.
 */
document.addEventListener(
    "pointerdown",
    function (event) {
        if (
            event.target.closest(".system-window") ||
            event.target.closest(".taskbar") ||
            event.target.closest(".app-icon")
        ) {
            return;
        }

        apps.forEach(function (app) {
            deactivateWindow(app);
        });
    }
);

/*
 * Esc fecha a janela ativa. Se nenhuma estiver ativa,
 * fecha a janela visível que estiver mais acima.
 */
document.addEventListener(
    "keydown",
    function (event) {
        if (event.key !== "Escape") {
            return;
        }

        const targetApp =
            activeApp || getTopVisibleWindow();

        if (targetApp) {
            closeWindow(targetApp);
        }
    }
);

/*
 * Corrige todas as posições quando o navegador ou
 * o DevTools muda de tamanho.
 */
window.addEventListener(
    "resize",
    function () {
        apps.forEach(function (app) {
            keepWindowInsideBounds(app);
        });
    }
);

updateEmptyRunningState();

console.info("JOÃO/OS 0.1.0 iniciado.");

updateClock();
setInterval(updateClock, 1000);