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

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
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

<<<<<<< HEAD
=======
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
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
<<<<<<< HEAD
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

=======
<<<<<<< HEAD
    let lastInputWasKeyboard = false;

>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
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
<<<<<<< HEAD
=======
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7

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

<<<<<<< HEAD
            updateRunningButtonLabel(app);
            updateEmptyRunningState();
            notifyAppStateChange(app);
=======
<<<<<<< HEAD
            updateRunningButtonLabel(app);
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
            updateEmptyRunningState();
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
            return;
        }

        app.runningButton.hidden = false;

        if (app.state === "minimized") {
            app.runningButton.textContent = `${app.name} — minimizado`;
            app.runningButton.setAttribute("aria-pressed", "false");
            app.runningButton.title = `Restaurar ${app.name}`;

<<<<<<< HEAD
            updateRunningButtonLabel(app);
            updateEmptyRunningState();
            notifyAppStateChange(app);
=======
<<<<<<< HEAD
            updateRunningButtonLabel(app);
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
            updateEmptyRunningState();
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
            return;
        }

        app.runningButton.textContent = `${app.name} aberto`;
        app.runningButton.setAttribute("aria-pressed", "true");
        app.runningButton.title = `Minimizar ${app.name}`;

<<<<<<< HEAD
        updateRunningButtonLabel(app);
        updateEmptyRunningState();
        notifyAppStateChange(app);
=======
<<<<<<< HEAD
        updateRunningButtonLabel(app);
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
        updateEmptyRunningState();
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
    }

    function deactivateWindow(app) {
        app.windowElement.classList.remove("is-active");
        app.runningButton.classList.remove("is-active");
        app.runningButton.removeAttribute("aria-current");

        if (activeApp === app) {
            activeApp = null;
        }
<<<<<<< HEAD

        updateRunningButtonLabel(app);
=======
<<<<<<< HEAD

        updateRunningButtonLabel(app);
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
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
<<<<<<< HEAD
        updateRunningButtonLabel(app);
=======
<<<<<<< HEAD
        updateRunningButtonLabel(app);
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7

        return nextApp;
    }

    function focusWindow(app) {
        app.windowElement.focus({
            preventScroll: true,
        });
<<<<<<< HEAD
=======
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
    }

    function openWindow(app) {
        app.state = "open";
        app.windowElement.hidden = false;
<<<<<<< HEAD
        app.windowElement.removeAttribute("aria-hidden");
=======
<<<<<<< HEAD
        app.windowElement.removeAttribute("aria-hidden");
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
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
<<<<<<< HEAD
        app.windowElement.setAttribute("aria-hidden", "true");
=======
<<<<<<< HEAD
        app.windowElement.setAttribute("aria-hidden", "true");
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
        app.appButton.setAttribute("aria-expanded", "false");

        updateRunningButton(app);

        if (wasActive) {
            activateTopVisibleWindow(app);
        }

        if (shouldMoveFocus) {
            app.runningButton.focus();
        }
    }

<<<<<<< HEAD
    function restoreWindow(app, shouldMoveFocus = true) {
=======
<<<<<<< HEAD
    function restoreWindow(app, shouldMoveFocus = true) {
=======
    function restoreWindow(app) {
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
        if (app.state !== "minimized") {
            return;
        }

        app.state = "open";
        app.windowElement.hidden = false;
<<<<<<< HEAD
        app.windowElement.removeAttribute("aria-hidden");
=======
<<<<<<< HEAD
        app.windowElement.removeAttribute("aria-hidden");
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
        app.appButton.setAttribute("aria-expanded", "true");

        updateRunningButton(app);
        activateWindow(app);

<<<<<<< HEAD
        if (shouldMoveFocus) {
            app.minimizeButton.focus();
        }
=======
<<<<<<< HEAD
        if (shouldMoveFocus) {
            app.minimizeButton.focus();
        }
=======
        app.minimizeButton.focus();
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
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
<<<<<<< HEAD
        app.windowElement.setAttribute("aria-hidden", "true");
=======
<<<<<<< HEAD
        app.windowElement.setAttribute("aria-hidden", "true");
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
        app.windowElement.classList.remove("is-maximized");
        app.appButton.setAttribute("aria-expanded", "false");

        resetMaximizeButton(app);
        updateRunningButton(app);

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
        const nextApp = wasActive
            ? activateTopVisibleWindow(app)
            : null;

        if (nextApp) {
            focusWindow(nextApp);
            return;
<<<<<<< HEAD
=======
=======
        if (wasActive) {
            activateTopVisibleWindow(app);
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
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

<<<<<<< HEAD
=======
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
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

<<<<<<< HEAD
=======
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
        dragManager.connect(app);
    }

    apps.forEach(connectAppEvents);

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
    document.addEventListener(
        "pointerdown",
        function () {
            lastInputWasKeyboard = false;
        },
        true
    );

<<<<<<< HEAD
=======
=======
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
    document.addEventListener("pointerdown", function (event) {
        if (
            event.target.closest(".system-window") ||
            event.target.closest(".taskbar") ||
<<<<<<< HEAD
            event.target.closest("[data-system-menu]") ||
=======
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
            event.target.closest(".app-icon")
        ) {
            return;
        }

        apps.forEach(function (app) {
            deactivateWindow(app);
        });
    });

    document.addEventListener("keydown", function (event) {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
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
<<<<<<< HEAD
=======
=======
        if (event.key !== "Escape") {
            return;
        }

        const targetApp = activeApp || getTopVisibleWindow();

        if (targetApp) {
            closeWindow(targetApp);
>>>>>>> 0256313400664563c125250d3fef97c988119cfa
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
        }
    });

    window.addEventListener("resize", function () {
        apps.forEach(function (app) {
            dragManager.keepWindowInsideBounds(app);
        });
    });

    updateEmptyRunningState();
<<<<<<< HEAD

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
=======
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7
}
