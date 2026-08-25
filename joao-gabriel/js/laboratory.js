/*
 * JOÃO/OS — Laboratório
 *
 * Organiza estudos e protótipos menores, permitindo filtrar
 * categorias e abrir os registros de cada experimento.
 */

const EXPERIMENTS = [
    {
        id: "neural-network",
        symbol: "NN",
        title: "Rede neural do zero",
        category: "ai",
        categoryLabel: "IA",
        status: "Estudo ativo",
        summary: "Construção gradual de perceptrons para compreender os fundamentos.",
        objective:
            "Entender pesos, vieses, funções de ativação, treinamento e erro " +
            "antes de depender de bibliotecas de alto nível.",
        notes: [
            "Visualizar como cada peso influencia a previsão",
            "Comparar funções de ativação e taxas de aprendizado",
            "Evoluir do perceptron para uma rede com múltiplas camadas",
        ],
        stack: ["Python", "Matemática", "Machine Learning"],
    },
    {
        id: "bank-marketing",
        symbol: "45K",
        title: "Bank Marketing ML",
        category: "data",
        categoryLabel: "Dados",
        status: "Em exploração",
        summary: "Análise de 45.211 registros para estudar classificação supervisionada.",
        objective:
            "Explorar o conjunto Bank Marketing, preparar variáveis e avaliar " +
            "modelos capazes de estimar a adesão a uma campanha bancária.",
        notes: [
            "Investigar distribuição, valores ausentes e desequilíbrio da resposta",
            "Codificar variáveis categóricas sem perder rastreabilidade",
            "Comparar métricas além da acurácia antes de escolher um modelo",
        ],
        stack: ["Python", "Pandas", "Scikit-learn", "Matplotlib"],
    },
    {
        id: "mobile-screen-patterns",
        symbol: "UI",
        title: "Padrões de interfaces móveis",
        category: "automation",
        categoryLabel: "Automação",
        status: "Pesquisa aplicada",
        summary: "Estruturas reutilizáveis para reconhecer telas de aplicativos diferentes.",
        objective:
            "Identificar padrões como listas, pesquisas, conversas, vídeos curtos " +
            "e pop-ups para tornar as automações do Neo mais adaptáveis.",
        notes: [
            "Separar o tipo da tela do nome específico do aplicativo",
            "Reaproveitar estratégias entre interfaces estruturalmente parecidas",
            "Registrar falhas e evidências para melhorar a próxima decisão",
        ],
        stack: ["Android", "Acessibilidade", "UI Parsing", "IA"],
    },
    {
        id: "interactive-atmosphere",
        symbol: "FX",
        title: "Atmosfera interativa",
        category: "web",
        categoryLabel: "Web",
        status: "Experimento concluído",
        summary: "Movimento atmosférico e revelação de palavras pela proximidade do cursor.",
        objective:
            "Criar profundidade e resposta visual mantendo a composição leve, " +
            "sem Canvas, WebGL ou bibliotecas adicionais.",
        notes: [
            "Movimento das massas limitado a transform e opacity",
            "Cálculos de proximidade agrupados em requestAnimationFrame",
            "Fallback estático completo para movimento reduzido",
        ],
        stack: ["HTML", "CSS", "JavaScript", "Motion"],
    },
];

export function initializeLaboratoryApp() {
    const laboratory = document.querySelector("[data-laboratory]");

    if (!laboratory) {
        return;
    }

    const catalog = laboratory.querySelector("[data-laboratory-catalog]");
    const list = laboratory.querySelector("[data-laboratory-list]");
    const filterButtons = Array.from(
        laboratory.querySelectorAll("[data-laboratory-filter]")
    );
    const detail = laboratory.querySelector("[data-experiment-detail]");
    const backButton = laboratory.querySelector("[data-experiment-back]");
    const footerStatus = document.querySelector("[data-laboratory-status]");

    const symbolElement = detail.querySelector("[data-experiment-symbol]");
    const statusElement = detail.querySelector("[data-experiment-status]");
    const titleElement = detail.querySelector("[data-experiment-title]");
    const summaryElement = detail.querySelector("[data-experiment-summary]");
    const objectiveElement = detail.querySelector("[data-experiment-objective]");
    const notesElement = detail.querySelector("[data-experiment-notes]");
    const stackElement = detail.querySelector("[data-experiment-stack]");

    let activeFilter = "all";
    let selectedExperimentId = null;

    function createListItems(items) {
        return items.map(function (item) {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            return listItem;
        });
    }

    function getFilteredExperiments() {
        if (activeFilter === "all") {
            return EXPERIMENTS;
        }

        return EXPERIMENTS.filter(function (experiment) {
            return experiment.category === activeFilter;
        });
    }

    function openExperiment(experiment) {
        selectedExperimentId = experiment.id;

        symbolElement.textContent = experiment.symbol;
        statusElement.textContent =
            `${experiment.categoryLabel} · ${experiment.status}`;
        titleElement.textContent = experiment.title;
        summaryElement.textContent = experiment.summary;
        objectiveElement.textContent = experiment.objective;

        notesElement.replaceChildren(
            ...createListItems(experiment.notes)
        );

        stackElement.replaceChildren(
            ...createListItems(experiment.stack)
        );

        catalog.hidden = true;
        detail.hidden = false;
        laboratory.scrollTop = 0;
        footerStatus.textContent = "EXPERIMENTO ABERTO";
        backButton.focus();
    }

    function createExperimentButton(experiment) {
        const button = document.createElement("button");
        button.className = "experiment-card";
        button.type = "button";
        button.dataset.experimentId = experiment.id;

        const header = document.createElement("span");
        header.className = "experiment-card__header";

        const symbol = document.createElement("span");
        symbol.className = "experiment-card__symbol";
        symbol.setAttribute("aria-hidden", "true");
        symbol.textContent = experiment.symbol;

        const status = document.createElement("span");
        status.className = "experiment-card__status";
        status.textContent = experiment.status;

        const title = document.createElement("strong");
        title.className = "experiment-card__title";
        title.textContent = experiment.title;

        const summary = document.createElement("span");
        summary.className = "experiment-card__summary";
        summary.textContent = experiment.summary;

        const footer = document.createElement("span");
        footer.className = "experiment-card__footer";
        footer.textContent = `${experiment.categoryLabel} · abrir registro →`;

        header.append(symbol, status);
        button.append(header, title, summary, footer);

        button.setAttribute(
            "aria-label",
            `${experiment.title}. ${experiment.status}. Abrir registro.`
        );

        button.addEventListener("click", function () {
            openExperiment(experiment);
        });

        return button;
    }

    function updateFilterButtons() {
        filterButtons.forEach(function (button) {
            const isActive =
                button.dataset.laboratoryFilter === activeFilter;

            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    function renderExperiments() {
        const filteredExperiments = getFilteredExperiments();

        list.replaceChildren(
            ...filteredExperiments.map(createExperimentButton)
        );

        updateFilterButtons();

        footerStatus.textContent = activeFilter === "all"
            ? `${filteredExperiments.length} EXPERIMENTOS`
            : `${filteredExperiments.length} RESULTADO`;
    }

    function showCatalog({ restoreFocus = false } = {}) {
        const previousExperimentId = selectedExperimentId;

        selectedExperimentId = null;
        detail.hidden = true;
        catalog.hidden = false;
        laboratory.scrollTop = 0;
        renderExperiments();

        if (!restoreFocus || !previousExperimentId) {
            return;
        }

        const previousButton = list.querySelector(
            `[data-experiment-id="${previousExperimentId}"]`
        );

        if (previousButton) {
            previousButton.focus();
        }
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            activeFilter = button.dataset.laboratoryFilter;
            renderExperiments();
        });
    });

    backButton.addEventListener("click", function () {
        showCatalog({
            restoreFocus: true,
        });
    });

    showCatalog();
}
