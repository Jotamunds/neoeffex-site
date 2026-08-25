/*
 * JOÃO/OS — Terminal
 *
 * Interpreta apenas comandos internos e seguros do portfólio.
 * Nenhum comando é enviado ao sistema operacional do visitante.
 */

const APP_ALIASES = new Map([
    ["sistema", "about"],
    ["system", "about"],
    ["about", "about"],
    ["projetos", "projects"],
    ["projects", "projects"],
    ["laboratorio", "laboratory"],
    ["laboratório", "laboratory"],
    ["laboratory", "laboratory"],
    ["terminal", "terminal"],
    ["arquivos", "files"],
    ["files", "files"],
    ["contato", "contact"],
    ["contact", "contact"],
]);

const APP_NAMES = new Map([
    ["about", "Sistema"],
    ["projects", "Projetos"],
    ["laboratory", "Laboratório"],
    ["terminal", "Terminal"],
    ["files", "Arquivos"],
    ["contact", "Contato"],
]);

const STATE_NAMES = {
    closed: "fechado",
    open: "aberto",
    minimized: "minimizado",
};

export function initializeTerminal({
    showWindow,
    getWindowState,
}) {
    const form = document.querySelector("[data-terminal-form]");
    const input = document.querySelector("[data-terminal-input]");
    const output = document.querySelector("[data-terminal-output]");

    const commandHistory = [];
    let historyIndex = 0;

    function scrollToLatestEntry() {
        output.scrollTop = output.scrollHeight;
    }

    function appendCommand(command) {
        const entry = document.createElement("div");
        entry.className = "terminal__entry terminal__entry--command";

        const prompt = document.createElement("span");
        prompt.className = "terminal__inline-prompt";
        prompt.setAttribute("aria-hidden", "true");
        prompt.textContent = "joao@os:~$";

        const value = document.createElement("span");
        value.textContent = command;

        entry.append(prompt, value);
        output.append(entry);
        scrollToLatestEntry();
    }

    function appendResponse(lines, type = "response") {
        const entry = document.createElement("div");
        entry.className = `terminal__entry terminal__entry--${type}`;

        const normalizedLines = Array.isArray(lines)
            ? lines
            : [lines];

        normalizedLines.forEach(function (line) {
            const row = document.createElement("span");
            row.textContent = line;
            entry.append(row);
        });

        output.append(entry);
        scrollToLatestEntry();
    }

    function openApp(appName) {
        const appId = APP_ALIASES.get(appName.toLowerCase());

        if (!appId) {
            appendResponse(
                `Aplicativo desconhecido: ${appName || "não informado"}.`,
                "error"
            );
            return;
        }

        showWindow(appId);
        appendResponse(`${APP_NAMES.get(appId)} foi ativado.`);
    }

    function listApps() {
        const lines = Array.from(APP_NAMES).map(
            function ([appId, appName]) {
                const state = getWindowState(appId);
                return `${appName.padEnd(10, " ")} ${STATE_NAMES[state]}`;
            }
        );

        appendResponse(lines);
    }

    function executeCommand(commandLine) {
        const [rawCommand, ...args] = commandLine.split(/\s+/);
        const command = rawCommand.toLowerCase();

        if (command === "clear" || command === "cls") {
            output.replaceChildren();
            return;
        }

        if (command === "help" || command === "ajuda") {
            appendResponse([
                "Comandos disponíveis:",
                "help              mostra esta lista",
                "about             abre o aplicativo Sistema",
                "projects          abre o diretório de Projetos",
                "laboratory        abre o Laboratório",
                "files             abre o explorador de Arquivos",
                "contact           abre os canais de Contato",
                "open <app>        abre um aplicativo",
                "apps              lista o estado das janelas",
                "whoami            exibe a identidade do portfólio",
                "date              exibe data e hora locais",
                "echo <texto>      repete um texto",
                "clear             limpa o terminal",
            ]);
            return;
        }

        if (command === "about" || command === "sistema") {
            openApp("about");
            return;
        }

        if (command === "projects" || command === "projetos") {
            openApp("projects");
            return;
        }

        if (
            command === "laboratory" ||
            command === "laboratorio" ||
            command === "laboratório"
        ) {
            openApp("laboratory");
            return;
        }

        if (command === "files" || command === "arquivos") {
            openApp("files");
            return;
        }

        if (command === "contact" || command === "contato") {
            openApp("contact");
            return;
        }

        if (command === "open" || command === "abrir") {
            openApp(args.join(" "));
            return;
        }

        if (command === "apps") {
            listApps();
            return;
        }

        if (command === "whoami") {
            appendResponse([
                "João Gabriel",
                "Desenvolvedor de automações e estudante de Sistemas de Informação.",
            ]);
            return;
        }

        if (command === "date" || command === "data") {
            const formattedDate = new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "full",
                timeStyle: "medium",
            }).format(new Date());

            appendResponse(formattedDate);
            return;
        }

        if (command === "echo") {
            appendResponse(args.join(" "));
            return;
        }

        appendResponse(
            `Comando não encontrado: ${rawCommand}. Digite “help”.`,
            "error"
        );
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const commandLine = input.value.trim();

        if (!commandLine) {
            return;
        }

        appendCommand(commandLine);

        commandHistory.push(commandLine);
        historyIndex = commandHistory.length;

        input.value = "";
        executeCommand(commandLine);
    });

    input.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp") {
            event.preventDefault();

            historyIndex = Math.max(historyIndex - 1, 0);
            input.value = commandHistory[historyIndex] || "";
            input.setSelectionRange(
                input.value.length,
                input.value.length
            );
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();

            historyIndex = Math.min(
                historyIndex + 1,
                commandHistory.length
            );

            input.value = commandHistory[historyIndex] || "";
            input.setSelectionRange(
                input.value.length,
                input.value.length
            );
        }
    });
}
