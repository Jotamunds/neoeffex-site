/*
 * JOÃO/OS — Pesquisa rápida
 *
 * Indexa conteúdos estáticos do portfólio e executa somente
 * ações internas conhecidas. Atalho global: Ctrl/Cmd + K.
 */

const SEARCH_ITEMS = [
    {
        id: "app-about",
        type: "app",
        typeLabel: "Aplicativo",
        symbol: "J",
        name: "Sistema",
        description: "Informações sobre o JOÃO/OS",
        terms: "sobre ambiente versão joao os",
        appId: "about",
    },
    {
        id: "app-projects",
        type: "app",
        typeLabel: "Aplicativo",
        symbol: "P",
        name: "Projetos",
        description: "Diretório de trabalhos selecionados",
        terms: "portfolio trabalhos cases",
        appId: "projects",
    },
    {
        id: "app-laboratory",
        type: "app",
        typeLabel: "Aplicativo",
        symbol: "L",
        name: "Laboratório",
        description: "Estudos, stack e experimentos",
        terms: "laboratorio estudos experimentos stack habilidades",
        appId: "laboratory",
    },
    {
        id: "app-neo",
        type: "app",
        typeLabel: "Aplicativo",
        symbol: "N",
        name: "Neo",
        description: "Assistente inteligente para Android",
        terms: "android inteligencia artificial assistente acessibilidade",
        appId: "neo",
    },
    {
        id: "app-terminal",
        type: "app",
        typeLabel: "Aplicativo",
        symbol: ">_",
        name: "Terminal",
        description: "Comandos internos do JOÃO/OS",
        terms: "console linha comando shell",
        appId: "terminal",
    },
    {
        id: "app-files",
        type: "app",
        typeLabel: "Aplicativo",
        symbol: "A",
        name: "Arquivos",
        description: "Explorador do conteúdo do portfólio",
        terms: "documentos pastas explorer files",
        appId: "files",
    },
    {
        id: "app-contact",
        type: "app",
        typeLabel: "Aplicativo",
        symbol: "@",
        name: "Contato",
        description: "Canais profissionais de João Gabriel",
        terms: "linkedin github email contato profissional",
        appId: "contact",
    },
    {
        id: "app-settings",
        type: "app",
        typeLabel: "Aplicativo",
        symbol: "◌",
        name: "Configurações",
        description: "Aparência e movimento do JOÃO/OS",
        terms: "preferencias personalizar wallpaper transparencia animacao",
        appId: "settings",
    },
    {
        id: "project-neo-android",
        type: "project",
        typeLabel: "Projeto",
        symbol: "N",
        name: "Neo para Android",
        description: "Assistente inteligente que opera aplicativos",
        terms: "ia acessibilidade java voz automacao",
        projectId: "neo-android",
    },
    {
        id: "project-joao-os",
        type: "project",
        typeLabel: "Projeto",
        symbol: "J",
        name: "JOÃO/OS",
        description: "Portfólio como sistema operacional interativo",
        terms: "joao os html css javascript portfolio sistema operacional",
        projectId: "joao-os",
    },
    {
        id: "project-financeiro",
        type: "project",
        typeLabel: "Projeto",
        symbol: "F",
        name: "Meu Financeiro",
        description: "Dashboard para organizar transações e contas",
        terms: "next supabase vercel finanças dashboard",
        projectId: "financeiro",
    },
    {
        id: "project-automacoes",
        type: "project",
        typeLabel: "Projeto",
        symbol: "A",
        name: "Automações corporativas",
        description: "Soluções para processos repetitivos",
        terms: "excel vba sap power automate python processos",
        projectId: "automacoes",
    },
    ...[
        ["home", "readme", "MD", "README.md", "Apresentação do portfólio"],
        ["home", "profile", "{ }", "perfil.json", "Perfil profissional"],
        ["projects", "neo-android", "N", "neo-android.md", "Projeto Neo para Android"],
        ["projects", "joao-os", "J", "joao-os.md", "Projeto JOÃO/OS"],
        ["projects", "automations", "A", "automacoes.md", "Automações corporativas"],
        ["projects", "finance", "F", "financeiro.md", "Dashboard financeiro"],
        ["stack", "languages", "{ }", "linguagens.json", "Linguagens utilizadas"],
        ["stack", "tools", "TXT", "ferramentas.txt", "Ferramentas e plataformas"],
        ["contact", "contact", "@", "contato.txt", "Canais profissionais"],
        ["contact", "github", "↗", "github.url", "Perfil público no GitHub"],
    ].map(function ([folderId, fileId, symbol, name, description]) {
        return {
            id: `file-${folderId}-${fileId}`,
            type: "file",
            typeLabel: "Arquivo",
            symbol,
            name,
            description,
            terms: `${folderId} ${fileId}`,
            folderId,
            fileId,
        };
    }),
    {
        id: "command-search",
        type: "command",
        typeLabel: "Comando",
        symbol: "⌕",
        name: "Pesquisar no sistema",
        description: "Abrir a pesquisa rápida",
        terms: "search pesquisar buscar ctrl k",
        command: "search",
    },
    {
        id: "command-restart",
        type: "command",
        typeLabel: "Comando",
        symbol: "↻",
        name: "Reiniciar JOÃO/OS",
        description: "Limpar a sessão e repetir a animação de entrada",
        terms: "restart reiniciar recarregar reload boot",
        command: "restart",
    },
    {
        id: "command-shutdown",
        type: "command",
        typeLabel: "Comando",
        symbol: "⏻",
        name: "Desligar",
        description: "Encerrar o JOÃO/OS e abrir o LinkedIn",
        terms: "shutdown desligar sair linkedin energia",
        command: "shutdown",
    },
];

const RESULT_LIMIT = 8;

function normalizeSearchText(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function getSearchScore(item, query) {
    const name = normalizeSearchText(item.name);
    const searchableText = normalizeSearchText(
        `${item.name} ${item.description} ${item.terms}`
    );

    if (name === query) {
        return 0;
    }

    if (name.startsWith(query)) {
        return 1;
    }

    if (name.includes(query)) {
        return 2;
    }

    if (searchableText.includes(query)) {
        return 3;
    }

    return null;
}

export function initializeSystemSearch({
    showWindow,
    restartSystem,
    shutdownSystem,
}) {
    const search = document.querySelector("[data-system-search]");
    const input = search?.querySelector("[data-system-search-input]");
    const resultsElement = search?.querySelector(
        "[data-system-search-results]"
    );
    const emptyElement = search?.querySelector("[data-system-search-empty]");
    const titleElement = search?.querySelector(".system-search__title");

    if (!search || !input || !resultsElement || !emptyElement) {
        return Object.freeze({
            open() {},
            close() {},
        });
    }

    const launchers = Array.from(
        document.querySelectorAll("[data-system-search-launcher]")
    );
    const closeButtons = Array.from(
        search.querySelectorAll("[data-system-search-close]")
    );

    let visibleResults = [];
    let selectedIndex = 0;
    let previousFocus = null;

    function setSelectedIndex(index) {
        const resultButtons = Array.from(
            resultsElement.querySelectorAll("[data-search-result]")
        );

        if (resultButtons.length === 0) {
            selectedIndex = 0;
            input.removeAttribute("aria-activedescendant");
            return;
        }

        selectedIndex = (
            index + resultButtons.length
        ) % resultButtons.length;

        resultButtons.forEach(function (button, buttonIndex) {
            const isSelected = buttonIndex === selectedIndex;

            button.classList.toggle("is-selected", isSelected);
            button.setAttribute("aria-selected", String(isSelected));
        });

        const selectedButton = resultButtons[selectedIndex];
        input.setAttribute("aria-activedescendant", selectedButton.id);
        selectedButton.scrollIntoView({ block: "nearest" });
    }

    function close({ restoreFocus = true } = {}) {
        if (search.hidden) {
            return;
        }

        search.hidden = true;
        input.value = "";
        input.removeAttribute("aria-activedescendant");

        if (
            restoreFocus &&
            previousFocus?.isConnected &&
            typeof previousFocus.focus === "function"
        ) {
            previousFocus.focus();
        }
    }

    function executeItem(item) {
        close({ restoreFocus: false });

        if (item.type === "app") {
            showWindow(item.appId);
            return;
        }

        if (item.type === "project") {
            showWindow("projects");
            document.dispatchEvent(
                new CustomEvent("joaoos:openproject", {
                    detail: { id: item.projectId },
                })
            );
            return;
        }

        if (item.type === "file") {
            showWindow("files");
            document.dispatchEvent(
                new CustomEvent("joaoos:openfile", {
                    detail: {
                        folderId: item.folderId,
                        fileId: item.fileId,
                    },
                })
            );
            return;
        }

        if (item.command === "restart") {
            restartSystem();
            return;
        }

        if (item.command === "shutdown") {
            shutdownSystem();
            return;
        }

        open();
    }

    function createResultButton(item, index) {
        const button = document.createElement("button");
        button.className = "system-search__result";
        button.type = "button";
        button.id = `system-search-result-${index}`;
        button.dataset.searchResult = item.id;
        button.setAttribute("role", "option");

        const symbol = document.createElement("span");
        symbol.className = "system-search__result-symbol";
        symbol.setAttribute("aria-hidden", "true");
        symbol.textContent = item.symbol;

        const content = document.createElement("span");
        content.className = "system-search__result-content";

        const name = document.createElement("span");
        name.className = "system-search__result-name";
        name.textContent = item.name;

        const description = document.createElement("span");
        description.className = "system-search__result-description";
        description.textContent = item.description;

        const type = document.createElement("span");
        type.className = "system-search__result-type";
        type.textContent = item.typeLabel;

        content.append(name, description);
        button.append(symbol, content, type);

        button.addEventListener("pointerenter", function () {
            setSelectedIndex(index);
        });

        button.addEventListener("click", function () {
            executeItem(item);
        });

        return button;
    }

    function renderResults() {
        const query = normalizeSearchText(input.value);

        if (!query) {
            visibleResults = SEARCH_ITEMS
                .filter(function (item) {
                    return item.type === "app";
                })
                .slice(0, RESULT_LIMIT);

            titleElement.textContent = "Aplicativos sugeridos";
        } else {
            visibleResults = SEARCH_ITEMS
                .map(function (item, originalIndex) {
                    return {
                        item,
                        originalIndex,
                        score: getSearchScore(item, query),
                    };
                })
                .filter(function (entry) {
                    return entry.score !== null;
                })
                .sort(function (first, second) {
                    return first.score - second.score ||
                        first.originalIndex - second.originalIndex;
                })
                .slice(0, RESULT_LIMIT)
                .map(function (entry) {
                    return entry.item;
                });

            titleElement.textContent = `Resultados para “${input.value.trim()}”`;
        }

        resultsElement.replaceChildren(
            ...visibleResults.map(createResultButton)
        );

        emptyElement.hidden = visibleResults.length !== 0;
        resultsElement.hidden = visibleResults.length === 0;
        setSelectedIndex(0);
    }

    function open() {
        document.dispatchEvent(new CustomEvent("joaoos:closesystemmenu"));
        document.dispatchEvent(new CustomEvent("joaoos:closecontextmenu"));

        if (!search.hidden) {
            input.focus();
            input.select();
            return;
        }

        previousFocus = document.activeElement;
        search.hidden = false;
        input.value = "";
        renderResults();
        input.focus();
    }

    launchers.forEach(function (launcher) {
        launcher.addEventListener("click", open);
    });

    closeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            close();
        });
    });

    input.addEventListener("input", renderResults);

    input.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setSelectedIndex(selectedIndex + 1);
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setSelectedIndex(selectedIndex - 1);
            return;
        }

        if (event.key === "Home") {
            event.preventDefault();
            setSelectedIndex(0);
            return;
        }

        if (event.key === "End") {
            event.preventDefault();
            setSelectedIndex(visibleResults.length - 1);
            return;
        }

        if (event.key === "Enter" && visibleResults[selectedIndex]) {
            event.preventDefault();
            executeItem(visibleResults[selectedIndex]);
        }
    });

    search.addEventListener("keydown", function (event) {
        if (event.key !== "Tab") {
            return;
        }

        const focusableElements = Array.from(
            search.querySelectorAll(
                "input, button:not([hidden]):not([disabled]):not([tabindex='-1'])"
            )
        ).filter(function (element) {
            return element.offsetParent !== null;
        });

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    });

    document.addEventListener(
        "keydown",
        function (event) {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                open();
                return;
            }

            if (event.key === "Escape" && !search.hidden) {
                event.preventDefault();
                event.stopPropagation();
                close();
            }
        },
        true
    );

    return Object.freeze({
        open,
        close,
    });
}
