/*
 * JOÃO/OS — Aplicativos da área de trabalho
 *
 * Oferece feedback para ícones que ainda não possuem uma janela.
 */

export function initializeUnavailableApps({ notify }) {
    const unavailableApps = document.querySelectorAll(
        '[data-app-status="unavailable"]'
    );

    unavailableApps.forEach(function (appButton) {
        const appId = appButton.dataset.app;

        const appName = appButton
            .querySelector(".app-icon__name")
            .textContent
            .trim();

        const appSymbol = appButton
            .querySelector(".app-icon__symbol")
            .textContent
            .trim();

        appButton.title = "Disponível em breve";
        appButton.setAttribute(
            "aria-label",
            `${appName}, disponível em breve`
        );

        appButton.addEventListener("click", function () {
            notify({
                id: `unavailable-${appId}`,
                symbol: appSymbol,
                title: `${appName} ainda não está disponível`,
                message:
                    "Este aplicativo está em desenvolvimento e será " +
                    "liberado em uma próxima atualização.",
                sourceElement: appButton,
            });
        });
    });
}
