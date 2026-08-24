/*
 * JOÃO/OS — Diretório de projetos
 *
 * Monta o catálogo do portfólio e controla a visualização
 * dos detalhes sem recarregar a página.
 */

const PROJECTS = [
    {
        id: "neo-android",
        index: "01",
        symbol: "N",
        name: "Neo para Android",
        status: "Protótipo ativo",
        summary: "Assistente inteligente capaz de compreender objetivos e operar aplicativos.",
        description:
            "Um assistente para Android que recebe comandos por voz ou texto, " +
            "observa os elementos da tela e executa ações por meio dos recursos " +
            "de acessibilidade do sistema.",
        highlights: [
            "Interpretação de objetivos em linguagem natural",
            "Observação e validação da interface antes de cada ação",
            "Automação de fluxos em diferentes aplicativos",
        ],
        stack: ["Android", "Java", "Acessibilidade", "IA"],
    },
    {
        id: "joao-os",
        index: "02",
        symbol: "J",
        name: "JOÃO/OS",
        status: "Em desenvolvimento",
        summary: "Portfólio pessoal apresentado como um sistema operacional interativo.",
        description:
            "Uma experiência web modular que reúne projetos, conhecimentos e " +
            "experimentos em uma área de trabalho com múltiplas janelas.",
        highlights: [
            "Gerenciamento de janelas com arraste e persistência",
            "Terminal, menu do sistema e explorador de arquivos",
            "Interface responsiva com navegação por teclado",
        ],
        stack: ["HTML", "CSS", "JavaScript", "Git"],
    },
    {
        id: "financeiro",
        index: "03",
        symbol: "F",
        name: "Meu Financeiro",
        status: "Em desenvolvimento",
        summary: "Dashboard para organizar transações, contas e análises financeiras.",
        description:
            "Aplicação responsiva para centralizar entradas, saídas, assinaturas " +
            "e extratos, com importação de transações e organização de categorias.",
        highlights: [
            "Importação e normalização de extratos bancários",
            "Dashboard com filtros e visão consolidada",
            "Organização assistida de categorias e descrições",
        ],
        stack: ["Next.js", "Supabase", "Vercel", "IA"],
    },
    {
        id: "automacoes",
        index: "04",
        symbol: "A",
        name: "Automações corporativas",
        status: "Em uso",
        summary: "Soluções para reduzir tarefas repetitivas e aumentar a confiabilidade.",
        description:
            "Conjunto de automações aplicadas a rotinas administrativas, de " +
            "planejamento e qualidade, conectando dados e sistemas corporativos.",
        highlights: [
            "Integrações entre Excel, SAP e SharePoint",
            "Automação de relatórios e processos recorrentes",
            "Redução de trabalho manual e erros operacionais",
        ],
        stack: ["Excel", "VBA", "SAP", "Power Automate", "Python"],
    },
];

export function initializeProjectsApp() {
    const browser = document.querySelector("[data-projects-browser]");

    if (!browser) {
        return;
    }

    const catalog = browser.querySelector("[data-projects-catalog]");
    const projectList = browser.querySelector("[data-projects-list]");
    const detail = browser.querySelector("[data-project-detail]");
    const backButton = browser.querySelector("[data-project-back]");
    const statusElement = document.querySelector("[data-projects-status]");

    const symbolElement = detail.querySelector("[data-project-symbol]");
    const projectStatusElement = detail.querySelector("[data-project-status]");
    const titleElement = detail.querySelector("[data-project-title]");
    const summaryElement = detail.querySelector("[data-project-summary]");
    const descriptionElement = detail.querySelector(
        "[data-project-description]"
    );
    const highlightsElement = detail.querySelector(
        "[data-project-highlights]"
    );
    const stackElement = detail.querySelector("[data-project-stack]");

    let selectedProjectId = null;

    function createTextItems(items) {
        return items.map(function (item) {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            return listItem;
        });
    }

    function showCatalog({ restoreFocus = false } = {}) {
        const previousProjectId = selectedProjectId;

        selectedProjectId = null;
        detail.hidden = true;
        catalog.hidden = false;
        browser.scrollTop = 0;
        statusElement.textContent = `${PROJECTS.length} PROJETOS`;

        if (!restoreFocus || !previousProjectId) {
            return;
        }

        const previousButton = projectList.querySelector(
            `[data-project-id="${previousProjectId}"]`
        );

        if (previousButton) {
            previousButton.focus();
        }
    }

    function openProject(project) {
        selectedProjectId = project.id;

        symbolElement.textContent = project.symbol;
        projectStatusElement.textContent = project.status;
        titleElement.textContent = project.name;
        summaryElement.textContent = project.summary;
        descriptionElement.textContent = project.description;

        highlightsElement.replaceChildren(
            ...createTextItems(project.highlights)
        );

        stackElement.replaceChildren(
            ...createTextItems(project.stack)
        );

        catalog.hidden = true;
        detail.hidden = false;
        browser.scrollTop = 0;
        statusElement.textContent = "PROJETO ABERTO";
        backButton.focus();
    }

    function createProjectButton(project) {
        const button = document.createElement("button");
        button.className = "project-card";
        button.type = "button";
        button.dataset.projectId = project.id;

        const index = document.createElement("span");
        index.className = "project-card__index";
        index.textContent = project.index;

        const identity = document.createElement("span");
        identity.className = "project-card__identity";

        const name = document.createElement("span");
        name.className = "project-card__name";
        name.textContent = project.name;

        const summary = document.createElement("span");
        summary.className = "project-card__summary";
        summary.textContent = project.summary;

        const status = document.createElement("span");
        status.className = "project-card__status";
        status.textContent = project.status;

        const arrow = document.createElement("span");
        arrow.className = "project-card__arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";

        identity.append(name, summary);
        button.append(index, identity, status, arrow);

        button.setAttribute(
            "aria-label",
            `${project.name}. ${project.status}. Abrir detalhes.`
        );

        button.addEventListener("click", function () {
            openProject(project);
        });

        return button;
    }

    projectList.replaceChildren(
        ...PROJECTS.map(createProjectButton)
    );

    backButton.addEventListener("click", function () {
        showCatalog({
            restoreFocus: true,
        });
    });

    showCatalog();
}
