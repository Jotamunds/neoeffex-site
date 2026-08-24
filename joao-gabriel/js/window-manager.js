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

            updateEmptyRunningState();
            return;
        }

        app.runningButton.hidden = false;

        if (app.state === "minimized") {
            app.runningButton.textContent = `${app.name} — minimizado`;
            app.runningButton.setAttribute("aria-pressed", "false");
            app.runningButton.title = `Restaurar ${app.name}`;

            updateEmptyRunningState();
            return;
        }

        app.runningButton.textContent = `${app.name} aberto`;
        app.runningButton.setAttribute("aria-pressed", "true");
        app.runningButton.title = `Minimizar ${app.name}`;

        updateEmptyRunningState();
    }

    function deactivateWindow(app) {
        app.windowElement.classList.remove("is-active");
        app.runningButton.classList.remove("is-active");
        app.runningButton.removeAttribute("aria-current");

        if (activeApp === app) {
            activeApp = null;
        }
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
    }

    function openWindow(app) {
        app.state = "open";
        app.windowElement.hidden = false;
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
        app.appButton.setAttribute("aria-expanded", "false");

        updateRunningButton(app);

        if (wasActive) {
            activateTopVisibleWindow(app);
        }

        if (shouldMoveFocus) {
            app.runningButton.focus();
        }
    }

    function restoreWindow(app) {
        if (app.state !== "minimized") {
            return;
        }

        app.state = "open";
        app.windowElement.hidden = false;
        app.appButton.setAttribute("aria-expanded", "true");

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

    function closeWindow(app) {
        const wasActive = activeApp === app;

        app.state = "closed";
        app.isMaximized = false;

        deactivateWindow(app);

        app.windowElement.hidden = true;
        app.windowElement.classList.remove("is-maximized");
        app.appButton.setAttribute("aria-expanded", "false");

        resetMaximizeButton(app);
        updateRunningButton(app);

        if (wasActive) {
            activateTopVisibleWindow(app);
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

        dragManager.connect(app);
    }

    apps.forEach(connectAppEvents);

    document.addEventListener("pointerdown", function (event) {
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
    });

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") {
            return;
        }

        const targetApp = activeApp || getTopVisibleWindow();

        if (targetApp) {
            closeWindow(targetApp);
        }
    });

    window.addEventListener("resize", function () {
        apps.forEach(function (app) {
            dragManager.keepWindowInsideBounds(app);
        });
    });

    updateEmptyRunningState();
}
