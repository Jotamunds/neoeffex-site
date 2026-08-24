/*
 * JOÃO/OS — Explorador de arquivos
 *
 * Representa conteúdos do portfólio como um sistema de arquivos virtual.
 * Os dados são somente leitura e não acessam arquivos do visitante.
 */

const FOLDERS = {
    home: {
        name: "Início",
        path: "/home/joao",
        files: [
            {
                id: "readme",
                name: "README.md",
                symbol: "MD",
                type: "Markdown",
                size: "1.2 KB",
                description: "Apresentação do portfólio",
                content: `# João Gabriel

Estudante de Sistemas de Informação e desenvolvedor de automações.

Este ambiente reúne projetos, estudos e experiências com desenvolvimento, dados, processos e inteligência artificial.`,
            },
            {
                id: "profile",
                name: "perfil.json",
                symbol: "{ }",
                type: "JSON",
                size: "0.8 KB",
                description: "Perfil profissional",
                content: `{
    "nome": "João Gabriel",
    "formacao": "Sistemas de Informação",
    "interesses": [
        "automação",
        "desenvolvimento",
        "dados",
        "inteligência artificial"
    ],
    "status": "em desenvolvimento"
}`,
            },
        ],
    },
    projects: {
        name: "Projetos",
        path: "/home/joao/projetos",
        files: [
            {
                id: "neo-android",
                name: "neo-android.md",
                symbol: "N",
                type: "Projeto",
                size: "2.4 KB",
                description: "Assistente inteligente para Android",
                content: `# Neo para Android

Assistente capaz de interpretar objetivos, observar elementos da tela e controlar outros aplicativos usando os recursos de acessibilidade do Android.

Fluxo principal:
VOZ/TEXTO → OBJETIVO → OBSERVAR → DECIDIR → EXECUTAR → VALIDAR`,
            },
            {
                id: "joao-os",
                name: "joao-os.md",
                symbol: "J",
                type: "Projeto",
                size: "1.8 KB",
                description: "Portfólio em formato de sistema operacional",
                content: `# JOÃO/OS

Interface experimental criada com HTML, CSS e JavaScript modular.

Recursos atuais:
- múltiplas janelas;
- arraste, minimização e maximização;
- navegação por teclado;
- persistência de sessão;
- menu, notificações e Terminal.`,
            },
            {
                id: "automations",
                name: "automacoes.md",
                symbol: "A",
                type: "Experiência",
                size: "1.5 KB",
                description: "Automação de processos corporativos",
                content: `# Automações

Desenvolvimento de soluções com Excel, VBA, SAP GUI, Power Automate, Python e integrações com SharePoint.

Objetivo: reduzir tarefas repetitivas, melhorar a confiabilidade dos processos e liberar tempo para atividades analíticas.`,
            },
            {
                id: "finance",
                name: "financeiro.md",
                symbol: "F",
                type: "Projeto",
                size: "1.3 KB",
                description: "Dashboard financeiro pessoal",
                content: `# Meu Financeiro

Aplicação para organizar entradas, saídas, assinaturas, extratos e análises financeiras.

O projeto utiliza uma interface responsiva e trabalha com importação e organização de transações.`,
            },
        ],
    },
    stack: {
        name: "Stack",
        path: "/home/joao/stack",
        files: [
            {
                id: "languages",
                name: "linguagens.json",
                symbol: "{ }",
                type: "JSON",
                size: "0.6 KB",
                description: "Linguagens utilizadas",
                content: `{
    "principal": ["JavaScript", "Python", "Java", "SQL"],
    "automacao": ["VBA", "Power Automate", "SAP GUI Scripting"],
    "web": ["HTML", "CSS", "JavaScript"]
}`,
            },
            {
                id: "tools",
                name: "ferramentas.txt",
                symbol: "TXT",
                type: "Texto",
                size: "0.7 KB",
                description: "Ferramentas e plataformas",
                content: `Git e GitHub
Visual Studio Code
IntelliJ IDEA
Android Studio
Power BI
Excel e Power Query
SAP S/4HANA
Supabase e Vercel`,
            },
        ],
    },
    contact: {
        name: "Contato",
        path: "/home/joao/contato",
        files: [
            {
                id: "contact",
                name: "contato.txt",
                symbol: "@",
                type: "Texto",
                size: "0.4 KB",
                description: "Canais profissionais",
                content: `João Gabriel Vieira da Silva

GitHub: @jotamunds
LinkedIn: João Gabriel Vieira da Silva`,
            },
            {
                id: "github",
                name: "github.url",
                symbol: "↗",
                type: "Atalho da internet",
                size: "0.2 KB",
                description: "Perfil público no GitHub",
                content: `https://github.com/jotamunds`,
                url: "https://github.com/jotamunds",
            },
        ],
    },
};

export function initializeFilesApp() {
    const folderButtons = Array.from(
        document.querySelectorAll("[data-files-folder]")
    );

    const backButton = document.querySelector("[data-files-back]");
    const pathElement = document.querySelector("[data-files-path]");
    const headingElement = document.querySelector("[data-files-heading]");
    const countElement = document.querySelector("[data-files-count]");
    const statusElement = document.querySelector("[data-files-status]");
    const fileList = document.querySelector("[data-file-list]");
    const preview = document.querySelector("[data-file-preview]");
    const previewType = document.querySelector("[data-file-preview-type]");
    const previewTitle = document.querySelector("[data-file-preview-title]");
    const previewMeta = document.querySelector("[data-file-preview-meta]");
    const previewContent = document.querySelector(
        "[data-file-preview-content]"
    );
    const previewLink = document.querySelector("[data-file-preview-link]");

    let currentFolderId = "home";
    let selectedFile = null;

    function updateFolderSelection() {
        folderButtons.forEach(function (button) {
            const isCurrent =
                button.dataset.filesFolder === currentFolderId;

            button.classList.toggle("is-active", isCurrent);

            if (isCurrent) {
                button.setAttribute("aria-current", "page");
            } else {
                button.removeAttribute("aria-current");
            }
        });
    }

    function closePreview() {
        const folder = FOLDERS[currentFolderId];

        selectedFile = null;
        preview.hidden = true;
        fileList.hidden = false;
        pathElement.textContent = folder.path;
        headingElement.textContent = folder.name;
    }

    function openFile(file) {
        const folder = FOLDERS[currentFolderId];

        selectedFile = file;
        fileList.hidden = true;
        preview.hidden = false;

        pathElement.textContent = `${folder.path}/${file.name}`;
        headingElement.textContent = file.name;
        previewType.textContent = file.type;
        previewTitle.textContent = file.name;
        previewMeta.textContent = file.size;
        previewContent.textContent = file.content;

        if (file.url) {
            previewLink.hidden = false;
            previewLink.href = file.url;
        } else {
            previewLink.hidden = true;
            previewLink.removeAttribute("href");
        }
    }

    function createFileButton(file) {
        const button = document.createElement("button");
        button.className = "file-explorer__file";
        button.type = "button";

        const symbol = document.createElement("span");
        symbol.className = "file-explorer__file-symbol";
        symbol.setAttribute("aria-hidden", "true");
        symbol.textContent = file.symbol;

        const information = document.createElement("span");
        information.className = "file-explorer__file-information";

        const name = document.createElement("span");
        name.className = "file-explorer__file-name";
        name.textContent = file.name;

        const description = document.createElement("span");
        description.className = "file-explorer__file-description";
        description.textContent = file.description;

        const meta = document.createElement("span");
        meta.className = "file-explorer__file-meta";
        meta.textContent = file.size;

        information.append(name, description);
        button.append(symbol, information, meta);

        button.addEventListener("click", function () {
            openFile(file);
        });

        return button;
    }

    function renderFolder(folderId) {
        const folder = FOLDERS[folderId];

        if (!folder) {
            return;
        }

        currentFolderId = folderId;
        selectedFile = null;

        fileList.replaceChildren(
            ...folder.files.map(createFileButton)
        );

        preview.hidden = true;
        fileList.hidden = false;

        pathElement.textContent = folder.path;
        headingElement.textContent = folder.name;
        countElement.textContent = `${folder.files.length} itens`;
        statusElement.textContent = `${folder.files.length} ITEMS`;

        updateFolderSelection();
    }

    folderButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            renderFolder(button.dataset.filesFolder);
        });
    });

    backButton.addEventListener("click", function () {
        if (selectedFile) {
            closePreview();
            return;
        }

        if (currentFolderId !== "home") {
            renderFolder("home");
        }
    });

    renderFolder("home");
}
