/*
 * JOÃO/OS — Gerenciador de janelas
 *
 * Centraliza os estados, foco, profundidade, controles
 * e integração das janelas com a área de trabalho.
 */

import { createWindowDragManager } from "./window-drag.js";

function createAppRegistry() {
    const apps = new Map();

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

            /*
             * A própria janela pode receber foco quando o usuário
             * alterna aplicativos pelo teclado.
             */
            windowElement.tabIndex = -1;
            windowElement.setAttribute("aria-hidden", "true");
            windowElement.setAttribute("aria-keyshortcuts", "Escape");

            runningButton.setAttribute(
                "aria-controls",
                windowElement.id
            );

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

    return apps;
}

export function initializeWindowManager() {
    const windowLayer = document.querySelector(".window-layer");
    const taskbar = document.querySelector(".taskbar");
    const runningEmptyState = document.querySelector(
        "[data-running-empty]"
    );

    const apps = createAppRegistry();

    let highestWindowZIndex = 10;
    let activeApp = null;
    let lastInputWasKeyboard = false;

    function notifyAppStateChange(app) {
        document.dispatchEvent(
            new CustomEvent("joaoos:appstatechange", {
                detail: {
                    id: app.id,
                    state: app.state,
                },
            })
        );
    }

    function updateRunningButtonLabel(app) {
        if (app.state === "closed") {
            app.runningButton.removeAttribute("aria-label");
            return;
        }

        if (app.state === "minimized") {
            app.runningButton.setAttribute(
                "aria-label",
                `${app.name} minimizado. Ativar para restaurar.`
            );
            return;
        }

        if (activeApp === app) {
            app.runningButton.setAttribute(
                "aria-label",
                `${app.name}, janela ativa. Ativar para minimizar.`
            );
            return;
        }

        app.runningButton.setAttribute(
            "aria-label",
            `${app.name}, aberto em segundo plano. Ativar para minimizar.`
        );
    }

    function updateEmptyRunningState() {
        const hasOpenApplication = Array
            .from(apps.values())
            .some(function (app) {
                return app.state !== "closed";
            });

        runningEmptyState.hidden = hasOpenApplication;
    }

    function updateRunningButton(app) {
        if (app.state === "closed") {
            app.runningButton.hidden = true;
            app.runningButton.classList.remove("is-active");
            app.runningButton.removeAttribute("aria-pressed");
            app.runningButton.removeAttribute("aria-current");
            app.runningButton.title = "";

            updateRunningButtonLabel(app);
            updateEmptyRunningState();
            notifyAppStateChange(app);
            return;
        }

        app.runningButton.hidden = false;

        if (app.state === "minimized") {
            app.runningButton.textContent = `${app.name} — minimizado`;
            app.runningButton.setAttribute("aria-pressed", "false");
            app.runningButton.title = `Restaurar ${app.name}`;

            updateRunningButtonLabel(app);
            updateEmptyRunningState();
            notifyAppStateChange(app);
            return;
        }

        app.runningButton.textContent = `${app.name} aberto`;
        app.runningButton.setAttribute("aria-pressed", "true");
        app.runningButton.title = `Minimizar ${app.name}`;

        updateRunningButtonLabel(app);
        updateEmptyRunningState();
        notifyAppStateChange(app);
    }

    function deactivateWindow(app) {
        app.windowElement.classList.remove("is-active");
        app.runningButton.classList.remove("is-active");
        app.runningButton.removeAttribute("aria-current");

        if (activeApp === app) {
            activeApp = null;
        }

        updateRunningButtonLabel(app);
    }

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

        app.windowElement.style.zIndex = String(
            highestWindowZIndex
        );

        app.windowElement.classList.add("is-active");
        app.runningButton.classList.add("is-active");
        app.runningButton.setAttribute("aria-current", "true");

        activeApp = app;
        updateRunningButtonLabel(app);
    }

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

        return nextApp;
    }

    function focusWindow(app) {
        app.windowElement.focus({
            preventScroll: true,
        });
    }

    function openWindow(app) {
        app.state = "open";
        app.windowElement.hidden = false;
        app.windowElement.removeAttribute("aria-hidden");
        app.appButton.setAttribute("aria-expanded", "true");

        updateRunningButton(app);
        activateWindow(app);

        app.closeButton.focus();
    }

    function minimizeWindow(app, shouldMoveFocus = true) {
        const wasActive = activeApp === app;

        app.state = "minimized";
        deactivateWindow(app);

        app.windowElement.hidden = true;
        app.windowElement.setAttribute("aria-hidden", "true");
        app.appButton.setAttribute("aria-expanded", "false");

        updateRunningButton(app);

        if (wasActive) {
            activateTopVisibleWindow(app);
        }

        if (shouldMoveFocus) {
            app.runningButton.focus();
        }
    }

    function restoreWindow(app, shouldMoveFocus = true) {
        if (app.state !== "minimized") {
            return;
        }

        app.state = "open";
        app.windowElement.hidden = false;
        app.windowElement.removeAttribute("aria-hidden");
        app.appButton.setAttribute("aria-expanded", "true");

        updateRunningButton(app);
        activateWindow(app);

        if (shouldMoveFocus) {
            app.minimizeButton.focus();
        }
    }

    function resetMaximizeButton(app) {
        app.maximizeButton.setAttribute(
            "aria-label",
            "Maximizar janela"
        );

        app.maximizeButton.title = "Maximizar";
        app.maximizeSymbol.textContent = "□";
    }

    function closeWindow(app) {
        const wasActive = activeApp === app;

        app.state = "closed";
        app.isMaximized = false;

        deactivateWindow(app);

        app.windowElement.hidden = true;
        app.windowElement.setAttribute("aria-hidden", "true");
        app.windowElement.classList.remove("is-maximized");
        app.appButton.setAttribute("aria-expanded", "false");

        resetMaximizeButton(app);
        updateRunningButton(app);

        const nextApp = wasActive
            ? activateTopVisibleWindow(app)
            : null;

        if (nextApp) {
            focusWindow(nextApp);
            return;
        }

        app.appButton.focus();
    }

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
     * Alt + W percorre as aplicações abertas.
     * Shift + Alt + W percorre na direção contrária.
     * Aplicativos minimizados são restaurados ao serem escolhidos.
     */
    function cycleWindows(direction = 1) {
        const availableApps = Array
            .from(apps.values())
            .filter(function (app) {
                return app.state !== "closed";
            });

        if (availableApps.length === 0) {
            return;
        }

        const currentIndex = availableApps.indexOf(activeApp);
        const startIndex = currentIndex === -1
            ? direction === 1
                ? -1
                : 0
            : currentIndex;

        const nextIndex = (
            startIndex + direction + availableApps.length
        ) % availableApps.length;

        const nextApp = availableApps[nextIndex];

        if (nextApp.state === "minimized") {
            restoreWindow(nextApp, false);
        } else {
            activateWindow(nextApp);
        }

        focusWindow(nextApp);
    }

    const dragManager = createWindowDragManager({
        windowLayer,
        taskbar,
        activateWindow,
    });

    function connectAppEvents(app) {
        app.appButton.addEventListener("click", function () {
            toggleWindowFromDesktop(app);
        });

        app.minimizeButton.addEventListener("click", function () {
            minimizeWindow(app);
        });

        app.maximizeButton.addEventListener("click", function () {
            toggleMaximizeWindow(app);
        });

        app.closeButton.addEventListener("click", function () {
            closeWindow(app);
        });

        app.runningButton.addEventListener(
            "pointerdown",
            function (event) {
                if (event.pointerType === "mouse") {
                    event.preventDefault();
                }
            }
        );

        app.runningButton.addEventListener("click", function () {
            toggleWindowFromTaskbar(app);
        });

        app.windowElement.addEventListener(
            "pointerdown",
            function (event) {
                const control = event.target.closest(
                    "[data-window-action]"
                );

                if (control) {
                    const action = control.dataset.windowAction;

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

        /*
         * Ao alcançar uma janela de segundo plano usando Tab,
         * ela passa a ser a janela ativa.
         */
        app.windowElement.addEventListener(
            "focusin",
            function () {
                if (
                    lastInputWasKeyboard &&
                    activeApp !== app &&
                    app.state === "open"
                ) {
                    activateWindow(app);
                }
            }
        );

        dragManager.connect(app);
    }

    apps.forEach(connectAppEvents);

    document.addEventListener(
        "pointerdown",
        function () {
            lastInputWasKeyboard = false;
        },
        true
    );

    document.addEventListener("pointerdown", function (event) {
        if (
            event.target.closest(".system-window") ||
            event.target.closest(".taskbar") ||
            event.target.closest("[data-system-menu]") ||
            event.target.closest(".app-icon")
        ) {
            return;
        }

        apps.forEach(function (app) {
            deactivateWindow(app);
        });
    });

    document.addEventListener("keydown", function (event) {
        lastInputWasKeyboard = true;

        if (
            event.altKey &&
            event.key.toLowerCase() === "w"
        ) {
            event.preventDefault();
            cycleWindows(event.shiftKey ? -1 : 1);
            return;
        }

        if (event.key === "Escape" && activeApp) {
            event.preventDefault();
            closeWindow(activeApp);
        }
    });

    window.addEventListener("resize", function () {
        apps.forEach(function (app) {
            dragManager.keepWindowInsideBounds(app);
        });
    });

    updateEmptyRunningState();

    return Object.freeze({
        toggleWindow(appId) {
            const app = apps.get(appId);

            if (!app) {
                return false;
            }

            toggleWindowFromDesktop(app);
            return true;
        },

        getWindowState(appId) {
            const app = apps.get(appId);
            return app ? app.state : null;
        },
    });
}
