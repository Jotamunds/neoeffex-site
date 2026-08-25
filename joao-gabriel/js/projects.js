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
        visualTheme: "neo",
        name: "Neo para Android",
        status: "Protótipo ativo",
        summary: "Assistente inteligente capaz de compreender objetivos e operar aplicativos.",
        category: "Inteligência artificial",
        period: "2026 — atual",
        availability: "Repositório público",
        visualEyebrow: "Assistente Android",
        visualTitle: "Observar. Decidir. Executar.",
        visualCode: "NEO/01",
        challenge:
            "Comandos tradicionais de voz dependem de frases rígidas e não " +
            "conseguem adaptar a execução quando a interface de um aplicativo muda.",
        solution:
            "O Neo interpreta o objetivo do usuário, observa os elementos da " +
            "tela e usa acessibilidade para decidir, executar e validar cada etapa.",
        result:
            "O protótipo já realizou fluxos testados em aplicativos como YouTube, " +
            "WhatsApp e Calculadora, com diagnóstico por logs para evolução contínua.",
        highlights: [
            "Interpretação de objetivos em linguagem natural",
            "Observação e validação da interface antes de cada ação",
            "Automação de fluxos em diferentes aplicativos",
        ],
        stack: ["Android", "Java", "Acessibilidade", "IA"],
        links: [
            {
                label: "Ver repositório",
                url: "https://github.com/Jotamunds/jarvis-android",
                type: "primary",
            },
        ],
    },
    {
        id: "joao-os",
        index: "02",
        symbol: "J",
        visualTheme: "os",
        name: "JOÃO/OS",
        status: "Em desenvolvimento",
        summary: "Portfólio pessoal apresentado como um sistema operacional interativo.",
        category: "Experiência web",
        period: "2026 — atual",
        availability: "Código e demonstração públicos",
        visualEyebrow: "Personal operating system",
        visualTitle: "Portfólio como ambiente digital.",
        visualCode: "J/OS",
        challenge:
            "Apresentar projetos e conhecimentos de maneira memorável sem perder " +
            "clareza, acessibilidade ou compatibilidade com diferentes telas.",
        solution:
            "Uma área de trabalho modular com múltiplas janelas, terminal, " +
            "explorador de arquivos, persistência de sessão e navegação por teclado.",
        result:
            "O portfólio funciona como uma aplicação completa no navegador e " +
            "continua evoluindo por tasks independentes e verificáveis.",
        highlights: [
            "Gerenciamento de janelas com arraste e persistência",
            "Terminal, menu do sistema e explorador de arquivos",
            "Interface responsiva com navegação por teclado",
        ],
        stack: ["HTML", "CSS", "JavaScript", "Git"],
        links: [
            {
                label: "Abrir demonstração",
                url: "https://neoeffex.com.br/joao-gabriel",
                type: "primary",
            },
            {
                label: "Ver repositório",
                url: "https://github.com/Jotamunds/neoeffex-site",
                type: "secondary",
            },
        ],
    },
    {
        id: "financeiro",
        index: "03",
        symbol: "F",
        visualTheme: "finance",
        name: "Meu Financeiro",
        status: "Em desenvolvimento",
        summary: "Dashboard para organizar transações, contas e análises financeiras.",
        category: "Produto web",
        period: "2026 — atual",
        availability: "Demonstração pública",
        visualEyebrow: "Finance dashboard",
        visualTitle: "Decisões com contexto financeiro.",
        visualCode: "FIN/03",
        challenge:
            "Extratos de bancos diferentes apresentam formatos inconsistentes, " +
            "dificultando a organização e a leitura consolidada das finanças.",
        solution:
            "Uma aplicação responsiva que importa transações, organiza categorias " +
            "e reúne contas, movimentações e análises em um único painel.",
        result:
            "O dashboard está publicado e já oferece uma base funcional para " +
            "importação, edição, filtros e acompanhamento das movimentações.",
        highlights: [
            "Importação e normalização de extratos bancários",
            "Dashboard com filtros e visão consolidada",
            "Organização assistida de categorias e descrições",
        ],
        stack: ["Next.js", "Supabase", "Vercel", "IA"],
        links: [
            {
                label: "Abrir demonstração",
                url: "https://meu-financeiro-joaomunds.vercel.app",
                type: "primary",
            },
        ],
    },
    {
        id: "automacoes",
        index: "04",
        symbol: "A",
        visualTheme: "automation",
        name: "Automações corporativas",
        status: "Em uso",
        summary: "Soluções para reduzir tarefas repetitivas e aumentar a confiabilidade.",
        category: "Automação de processos",
        period: "2025 — atual",
        availability: "Projeto interno — detalhes preservados",
        visualEyebrow: "Process automation",
        visualTitle: "Menos repetição. Mais análise.",
        visualCode: "AUTO/04",
        challenge:
            "Processos operacionais dependiam de etapas repetitivas entre " +
            "planilhas, SAP e plataformas Microsoft, aumentando tempo e risco de erro.",
        solution:
            "Automações conectam os sistemas, tratam dados e executam rotinas de " +
            "planejamento e qualidade com validações antes da entrega.",
        result:
            "As soluções desenvolvidas economizam, em conjunto, mais de 16 horas " +
            "por semana e algumas já são utilizadas por diferentes plantas.",
        highlights: [
            "Integrações entre Excel, SAP e SharePoint",
            "Automação de relatórios e processos recorrentes",
            "Redução de trabalho manual e erros operacionais",
        ],
        stack: ["Excel", "VBA", "SAP", "Power Automate", "Python"],
        links: [],
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
    const visualElement = detail.querySelector("[data-project-visual]");
    const visualEyebrowElement = detail.querySelector(
        "[data-project-visual-eyebrow]"
    );
    const visualTitleElement = detail.querySelector(
        "[data-project-visual-title]"
    );
    const visualCodeElement = detail.querySelector(
        "[data-project-visual-code]"
    );
    const categoryElement = detail.querySelector("[data-project-category]");
    const periodElement = detail.querySelector("[data-project-period]");
    const availabilityElement = detail.querySelector(
        "[data-project-availability]"
    );
    const challengeElement = detail.querySelector("[data-project-challenge]");
    const solutionElement = detail.querySelector("[data-project-solution]");
    const resultElement = detail.querySelector("[data-project-result]");
    const highlightsElement = detail.querySelector(
        "[data-project-highlights]"
    );
    const stackElement = detail.querySelector("[data-project-stack]");
    const actionsElement = detail.querySelector("[data-project-actions]");

    let selectedProjectId = null;

    function createTextItems(items) {
        return items.map(function (item) {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            return listItem;
        });
    }

    function createProjectLinks(project) {
        return project.links.map(function (link) {
            const anchor = document.createElement("a");

            anchor.className =
                `project-detail__action project-detail__action--${link.type}`;
            anchor.href = link.url;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
            anchor.textContent = `${link.label} ↗`;

            return anchor;
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

        visualElement.className =
            `project-detail__visual ` +
            `project-detail__visual--${project.visualTheme}`;

        visualElement.setAttribute(
            "aria-label",
            `Identidade visual do projeto ${project.name}`
        );

        visualEyebrowElement.textContent = project.visualEyebrow;
        visualTitleElement.textContent = project.visualTitle;
        visualCodeElement.textContent = project.visualCode;

        categoryElement.textContent = project.category;
        periodElement.textContent = project.period;
        availabilityElement.textContent = project.availability;
        challengeElement.textContent = project.challenge;
        solutionElement.textContent = project.solution;
        resultElement.textContent = project.result;

        highlightsElement.replaceChildren(
            ...createTextItems(project.highlights)
        );

        stackElement.replaceChildren(
            ...createTextItems(project.stack)
        );

        actionsElement.replaceChildren(
            ...createProjectLinks(project)
        );

        actionsElement.hidden = project.links.length === 0;

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

    document.addEventListener("joaoos:openproject", function (event) {
        const project = PROJECTS.find(function (item) {
            return item.id === event.detail?.id;
        });

        if (project) {
            openProject(project);
        }
    });

    showCatalog();
}
