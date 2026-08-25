/*
 * JOÃO/OS — Menu do sistema
 *
 * Controla o painel do botão N e oferece navegação completa
 * por mouse, toque e teclado.
 */

export function initializeSystemMenu({
    toggleWindow,
    getWindowState,
}) {
    const menu = document.querySelector("[data-system-menu]");
    const launcher = document.querySelector(
        "[data-system-menu-launcher]"
    );

    const appButtons = Array.from(
        menu.querySelectorAll("[data-system-menu-app]")
    );

    function updateAppButton(button, state) {
        const appName = button
            .querySelector(".system-menu__app-name")
            .textContent
            .trim();

        const status = button.querySelector(
            "[data-system-menu-status]"
        );

        button.classList.toggle("is-open", state === "open");
        button.classList.toggle(
            "is-minimized",
            state === "minimized"
        );

        if (state === "open") {
            status.textContent = "Aberto";
            button.setAttribute(
                "aria-label",
                `${appName}, aberto. Ativar para minimizar.`
            );
            return;
        }

        if (state === "minimized") {
            status.textContent = "Minimizado";
            button.setAttribute(
                "aria-label",
                `${appName}, minimizado. Ativar para restaurar.`
            );
            return;
        }

        status.textContent = "Fechado";
        button.setAttribute(
            "aria-label",
            `${appName}, fechado. Ativar para abrir.`
        );
    }

    function refreshAppStates() {
        appButtons.forEach(function (button) {
            const appId = button.dataset.systemMenuApp;
            updateAppButton(button, getWindowState(appId));
        });
    }

    function openMenu() {
        refreshAppStates();

        menu.hidden = false;
        launcher.setAttribute("aria-expanded", "true");
        launcher.setAttribute("aria-label", "Fechar menu do sistema");

        appButtons[0].focus();
    }

    function closeMenu({ restoreFocus = false } = {}) {
        if (menu.hidden) {
            return;
        }

        const focusWasInsideMenu = menu.contains(
            document.activeElement
        );

        menu.hidden = true;
        launcher.setAttribute("aria-expanded", "false");
        launcher.setAttribute("aria-label", "Abrir menu do sistema");

        if (restoreFocus || focusWasInsideMenu) {
            launcher.focus();
        }
    }

    function toggleMenu() {
        if (menu.hidden) {
            openMenu();
            return;
        }

        closeMenu({
            restoreFocus: true,
        });
    }

    function moveFocus(currentButton, direction) {
        const currentIndex = appButtons.indexOf(currentButton);

        if (currentIndex === -1) {
            return;
        }

        const nextIndex = (
            currentIndex + direction + appButtons.length
        ) % appButtons.length;

        appButtons[nextIndex].focus();
    }

    launcher.addEventListener("click", toggleMenu);

    appButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const appId = button.dataset.systemMenuApp;

            closeMenu();
            toggleWindow(appId);
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
                appButtons[0].focus();
                return;
            }

            if (event.key === "End") {
                event.preventDefault();
                appButtons[appButtons.length - 1].focus();
            }
        });
    });

    document.addEventListener("pointerdown", function (event) {
        if (
            menu.hidden ||
            menu.contains(event.target) ||
            launcher.contains(event.target)
        ) {
            return;
        }

        closeMenu();
    });

    /*
     * A captura faz o menu consumir o Esc antes que o
     * gerenciador de janelas tente fechar a janela ativa.
     */
    document.addEventListener(
        "keydown",
        function (event) {
            if (event.key !== "Escape" || menu.hidden) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            closeMenu({
                restoreFocus: true,
            });
        },
        true
    );

    document.addEventListener(
        "joaoos:appstatechange",
        function (event) {
            const button = menu.querySelector(
                `[data-system-menu-app="${event.detail.id}"]`
            );

            if (button) {
                updateAppButton(button, event.detail.state);
            }
        }
    );

    document.addEventListener("joaoos:closesystemmenu", function () {
        closeMenu();
    });

    refreshAppStates();
}
