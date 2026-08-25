/*
 * JOÃO/OS — Menu de contexto do desktop
 *
 * Oferece ações rápidas sem substituir os menus nativos
 * de campos, links, aplicativos ou janelas.
 */

export function initializeDesktopContextMenu({
    showWindow,
    notify,
}) {
    const desktop = document.querySelector(".desktop");
    const menu = document.querySelector("[data-desktop-context-menu]");
    const appGrid = document.querySelector(".app-grid");

    if (!desktop || !menu || !appGrid) {
        return;
    }

    const actionButtons = Array.from(
        menu.querySelectorAll("[data-desktop-context-action]")
    );
    const originalAppOrder = Array.from(appGrid.children);
    const arrangeLabel = menu.querySelector("[data-desktop-arrange-label]");
    const arrangeStatus = menu.querySelector("[data-desktop-arrange-status]");

    let previousFocus = null;
    let isAlphabetical = false;
    let refreshTimer = null;

    function clamp(value, minimum, maximum) {
        return Math.min(Math.max(value, minimum), maximum);
    }

    function isDesktopBackground(target) {
        return !target.closest(
            ".app-icon, .system-window, .taskbar, " +
            ".system-menu, .desktop-context-menu, " +
            ".notification-center, a, button, input, textarea"
        );
    }

    function positionMenu(clientX, clientY) {
        const desktopRect = desktop.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const margin = 8;

        const left = clamp(
            clientX - desktopRect.left,
            margin,
            Math.max(desktopRect.width - menuRect.width - margin, margin)
        );

        const top = clamp(
            clientY - desktopRect.top,
            margin,
            Math.max(desktopRect.height - menuRect.height - margin, margin)
        );

        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
    }

    function openMenu(clientX, clientY) {
        if (!menu.contains(document.activeElement)) {
            previousFocus = document.activeElement;
        }

        menu.hidden = false;

        positionMenu(clientX, clientY);
        actionButtons[0].focus();
    }

    function closeMenu({ restoreFocus = false } = {}) {
        if (menu.hidden) {
            return;
        }

        menu.hidden = true;

        if (
            restoreFocus &&
            previousFocus?.isConnected &&
            typeof previousFocus.focus === "function"
        ) {
            previousFocus.focus();
        }
    }

    function refreshDesktop(sourceElement) {
        window.clearTimeout(refreshTimer);
        desktop.classList.remove("is-refreshing");

        /* Reinicia a animação mesmo em atualizações consecutivas. */
        void desktop.offsetWidth;
        desktop.classList.add("is-refreshing");

        refreshTimer = window.setTimeout(function () {
            desktop.classList.remove("is-refreshing");
        }, 420);

        notify({
            id: "desktop-refreshed",
            symbol: "↻",
            title: "Área de trabalho atualizada",
            message: "Os elementos visuais foram recarregados sem fechar aplicativos.",
            sourceElement,
        });
    }

    function getAppName(appButton) {
        return appButton
            .querySelector(".app-icon__name")
            .textContent
            .trim();
    }

    function arrangeApps(sourceElement) {
        isAlphabetical = !isAlphabetical;

        const nextOrder = isAlphabetical
            ? [...originalAppOrder].sort(function (firstApp, secondApp) {
                return getAppName(firstApp).localeCompare(
                    getAppName(secondApp),
                    "pt-BR",
                    { sensitivity: "base" }
                );
            })
            : originalAppOrder;

        appGrid.append(...nextOrder);

        arrangeLabel.textContent = isAlphabetical
            ? "Restaurar ordem original"
            : "Organizar alfabeticamente";

        arrangeStatus.textContent = isAlphabetical
            ? "A–Z"
            : "Original";

        notify({
            id: "desktop-arranged",
            symbol: "⇅",
            title: "Ícones reorganizados",
            message: isAlphabetical
                ? "Os aplicativos estão em ordem alfabética."
                : "A ordem original dos aplicativos foi restaurada.",
            sourceElement,
        });
    }

    function showSettingsNotice(sourceElement) {
        notify({
            id: "desktop-settings-upcoming",
            symbol: "◌",
            title: "Configurações em desenvolvimento",
            message:
                "As opções de aparência e movimento serão adicionadas na Task 23.",
            sourceElement,
        });
    }

    function executeAction(button) {
        const action = button.dataset.desktopContextAction;
        const sourceElement = previousFocus?.isConnected
            ? previousFocus
            : null;

        closeMenu();

        if (action === "refresh") {
            refreshDesktop(sourceElement);
            return;
        }

        if (action === "arrange") {
            arrangeApps(sourceElement);
            return;
        }

        if (action === "terminal") {
            showWindow("terminal");
            return;
        }

        if (action === "about") {
            showWindow("about");
            return;
        }

        if (action === "settings") {
            showSettingsNotice(sourceElement);
        }
    }

    function moveFocus(currentButton, direction) {
        const currentIndex = actionButtons.indexOf(currentButton);
        const nextIndex = (
            currentIndex + direction + actionButtons.length
        ) % actionButtons.length;

        actionButtons[nextIndex].focus();
    }

    desktop.addEventListener("contextmenu", function (event) {
        if (!isDesktopBackground(event.target)) {
            return;
        }

        event.preventDefault();
        openMenu(event.clientX, event.clientY);
    });

    menu.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });

    actionButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            executeAction(button);
        });

        button.addEventListener("keydown", function (event) {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                moveFocus(button, 1);
                return;
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                moveFocus(button, -1);
                return;
            }

            if (event.key === "Home") {
                event.preventDefault();
                actionButtons[0].focus();
                return;
            }

            if (event.key === "End") {
                event.preventDefault();
                actionButtons[actionButtons.length - 1].focus();
            }
        });
    });

    document.addEventListener("pointerdown", function (event) {
        if (!menu.hidden && !menu.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener(
        "keydown",
        function (event) {
            if (!menu.hidden && event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                closeMenu({
                    restoreFocus: true,
                });
                return;
            }

            if (
                menu.hidden &&
                (event.key === "ContextMenu" ||
                    (event.shiftKey && event.key === "F10")) &&
                isDesktopBackground(event.target)
            ) {
                event.preventDefault();

                const desktopRect = desktop.getBoundingClientRect();
                openMenu(
                    desktopRect.left + desktopRect.width / 2,
                    desktopRect.top + desktopRect.height / 2
                );
            }
        },
        true
    );

    window.addEventListener("resize", function () {
        closeMenu();
    });

    document.addEventListener("joaoos:closecontextmenu", function () {
        closeMenu();
    });
}
