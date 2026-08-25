/*
 * JOÃO/OS — Apresentação do Neo
 *
 * Executa uma simulação local e visual do ciclo de decisão.
 * Nenhuma ação é enviada ao dispositivo ou a serviços externos.
 */

const STEP_MESSAGES = [
    "Interpretando o objetivo informado...",
    "Observando a estrutura da tela atual...",
    "Selecionando a próxima ação segura...",
    "Simulando a execução pela acessibilidade...",
    "Validando se o objetivo foi concluído...",
];

export function initializeNeoApp() {
    const neoApp = document.querySelector("[data-neo-app]");

    if (!neoApp) {
        return;
    }

    const commandInput = neoApp.querySelector("[data-neo-demo-command]");
    const startButton = neoApp.querySelector("[data-neo-demo-start]");
    const steps = Array.from(
        neoApp.querySelectorAll("[data-neo-demo-step]")
    );
    const output = neoApp.querySelector("[data-neo-demo-output]");
    const footerStatus = document.querySelector("[data-neo-status]");

    const timers = new Set();

    function schedule(callback, delay) {
        const timer = window.setTimeout(function () {
            timers.delete(timer);
            callback();
        }, delay);

        timers.add(timer);
    }

    function clearScheduledSteps() {
        timers.forEach(function (timer) {
            window.clearTimeout(timer);
        });

        timers.clear();
    }

    function resetSteps() {
        steps.forEach(function (step) {
            step.classList.remove("is-active", "is-complete");
        });
    }

    function activateStep(activeIndex) {
        steps.forEach(function (step, index) {
            step.classList.toggle("is-active", index === activeIndex);
            step.classList.toggle("is-complete", index < activeIndex);
        });

        output.textContent = STEP_MESSAGES[activeIndex];
        footerStatus.textContent =
            `PROCESSING ${String(activeIndex + 1).padStart(2, "0")}/05`;
    }

    function finishSimulation(command) {
        steps.forEach(function (step) {
            step.classList.remove("is-active");
            step.classList.add("is-complete");
        });

        output.textContent =
            `Simulação concluída para: “${command}” ` +
            "O aplicativo real repetiria a observação até validar o resultado.";

        footerStatus.textContent = "SIMULATION COMPLETE";
        startButton.disabled = false;
        startButton.textContent = "Simular novamente";
    }

    function runSimulation() {
        const command = commandInput.value.trim() ||
            "Abra o YouTube e procure vídeos do Flamengo.";

        clearScheduledSteps();
        resetSteps();

        startButton.disabled = true;
        startButton.textContent = "Simulando...";
        output.textContent = `Comando recebido: “${command}”`;
        footerStatus.textContent = "PROCESSING";

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            finishSimulation(command);
            return;
        }

        steps.forEach(function (step, index) {
            schedule(function () {
                activateStep(index);
            }, 300 + index * 620);
        });

        schedule(function () {
            finishSimulation(command);
        }, 300 + steps.length * 620);
    }

    startButton.addEventListener("click", runSimulation);

    commandInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !startButton.disabled) {
            event.preventDefault();
            runSimulation();
        }
    });

    window.addEventListener("pagehide", clearScheduledSteps);
}
