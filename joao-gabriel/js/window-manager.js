/*
 * JOÃO/OS — Gerenciador de janelas
 *
 * Centraliza os estados, foco, profundidade, controles
 * e integração das janelas com a área de trabalho.
 */

import { createWindowDragManager } from "./window-drag.js";
import { createWindowSessionStore } from "./session-store.js";

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

            const customFocusTarget = windowElement.querySelector(
                "[data-window-autofocus]"
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
                openFocusTarget: customFocusTarget || closeButton,
                restoreFocusTarget:
                    customFocusTarget || minimizeButton,

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
    const sessionStore = createWindowSessionStore(apps.keys());

    let highestWindowZIndex = 10;
    let activeApp = null;
    let lastInputWasKeyboard = false;
    let isRestoringSession = true;

    function getSavedPosition(app) {
        if (
            !app.windowElement.classList.contains("is-positioned")
        ) {
            return null;
        }

        const left = Number.parseFloat(
            app.windowElement.style.getPropertyValue(
                "--window-left"
            )
        );

        const top = Number.parseFloat(
            app.windowElement.style.getPropertyValue(
                "--window-top"
            )
        );

        if (!Number.isFinite(left) || !Number.isFinite(top)) {
            return null;
        }

        return {
            left,
            top,
        };
    }

    function createSessionSnapshot() {
        const savedApps = {};

        apps.forEach(function (app) {
            savedApps[app.id] = {
                state: app.state,
                isMaximized: app.isMaximized,
                position: getSavedPosition(app),
                zIndex: Number(
                    app.windowElement.style.zIndex || 10
                ),
            };
        });

        return {
            activeAppId: activeApp ? activeApp.id : null,
            apps: savedApps,
        };
    }

    function persistSession() {
        if (isRestoringSession) {
            return;
        }

        sessionStore.write(createSessionSnapshot());
    }

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
        persistSession();
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

        dragManager.keepWindowInsideBounds(app);
        updateRunningButton(app);
        activateWindow(app);

        app.openFocusTarget.focus();
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

        persistSession();
    }

    function restoreWindow(app, shouldMoveFocus = true) {
        if (app.state !== "minimized") {
            return;
        }

        app.state = "open";
        app.windowElement.hidden = false;
        app.windowElement.removeAttribute("aria-hidden");
        app.appButton.setAttribute("aria-expanded", "true");

        dragManager.keepWindowInsideBounds(app);
        updateRunningButton(app);
        activateWindow(app);

        if (shouldMoveFocus) {
            app.restoreFocusTarget.focus();
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

        persistSession();

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
            persistSession();
            return;
        }

        resetMaximizeButton(app);
        persistSession();
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
        onPositionChange: persistSession,
    });

    function restoreAppFromSession(app, savedApp) {
        if (!savedApp) {
            updateRunningButton(app);
            return;
        }

        app.state = savedApp.state;
        app.isMaximized =
            savedApp.isMaximized && app.state !== "closed";

        if (savedApp.position) {
            app.windowElement.style.setProperty(
                "--window-left",
                `${savedApp.position.left}px`
            );

            app.windowElement.style.setProperty(
                "--window-top",
                `${savedApp.position.top}px`
            );

            app.windowElement.classList.add("is-positioned");
        }

        app.windowElement.style.zIndex = String(savedApp.zIndex);
        highestWindowZIndex = Math.max(
            highestWindowZIndex,
            savedApp.zIndex
        );

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
        } else {
            resetMaximizeButton(app);
        }

        const isOpen = app.state === "open";

        app.windowElement.hidden = !isOpen;
        app.appButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        if (isOpen) {
            app.windowElement.removeAttribute("aria-hidden");
        } else {
            app.windowElement.setAttribute("aria-hidden", "true");
        }

        updateRunningButton(app);
    }

    function restoreSession() {
        const savedSession = sessionStore.read();

        apps.forEach(function (app) {
            restoreAppFromSession(
                app,
                savedSession?.apps[app.id]
            );
        });

        if (savedSession) {
            const savedActiveApp = apps.get(
                savedSession.activeAppId
            );

            if (
                savedActiveApp &&
                savedActiveApp.state === "open"
            ) {
                activateWindow(savedActiveApp);
            } else {
                activateTopVisibleWindow();
            }
        }

        isRestoringSession = false;

        requestAnimationFrame(function () {
            apps.forEach(function (app) {
                dragManager.keepWindowInsideBounds(app);
            });

            persistSession();
        });
    }

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
    restoreSession();

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
            event.target.closest("[data-notification-center]") ||
            event.target.closest(".app-icon")
        ) {
            return;
        }

        apps.forEach(function (app) {
            deactivateWindow(app);
        });

        persistSession();
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

    window.addEventListener("pagehide", persistSession);

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

        showWindow(appId) {
            const app = apps.get(appId);

            if (!app) {
                return false;
            }

            if (app.state === "closed") {
                openWindow(app);
                return true;
            }

            if (app.state === "minimized") {
                restoreWindow(app);
                return true;
            }

            activateWindow(app);
            app.openFocusTarget.focus();
            return true;
        },

        getWindowState(appId) {
            const app = apps.get(appId);
            return app ? app.state : null;
        },
    });
}
