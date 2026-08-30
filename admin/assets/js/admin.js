(function () {
    "use strict";

    const products = Array.isArray(window.CATALOG_DEMO_PRODUCTS) ? window.CATALOG_DEMO_PRODUCTS : [];
    const storageKey = "neoeffex-admin-theme";
    const root = document.documentElement;
    const productsList = document.getElementById("productsList");
    const emptyState = document.getElementById("emptyState");
    const searchField = document.getElementById("productSearch");
    const statusFilter = document.getElementById("statusFilter");
    const toast = document.getElementById("toast");
    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menuButton");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const themeButton = document.getElementById("themeButton");
    let toastTimeout;

    function formatCurrency(value) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(value);
    }

    function getFilteredProducts() {
        const search = searchField.value.trim().toLocaleLowerCase("pt-BR");
        const status = statusFilter.value;

        return products.filter(function (product) {
            const searchableText = [product.name, product.category, product.description].join(" ").toLocaleLowerCase("pt-BR");
            const matchesSearch = !search || searchableText.includes(search);
            const matchesStatus = status === "all" || product.status === status;

            return matchesSearch && matchesStatus;
        });
    }

    function createProductRow(product) {
        const article = document.createElement("article");
        const statusLabel = product.status === "active" ? "Ativo" : "Pausado";

        article.className = "product-row";
        article.innerHTML = ""
            + "<div class=\"product-row__name\">"
            + "<span class=\"product-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z\"></path><path d=\"M4 12.5 12 17l8-4.5\"></path><path d=\"M4 17 12 21l8-4\"></path></svg></span>"
            + "<div><strong>" + escapeHtml(product.name) + "</strong><small>" + escapeHtml(product.description) + "</small></div>"
            + "</div>"
            + "<span class=\"product-row__category\">" + escapeHtml(product.category) + "</span>"
            + "<strong class=\"product-row__price\">" + formatCurrency(product.price) + "</strong>"
            + "<span class=\"status status--" + product.status + "\"><i></i>" + statusLabel + "</span>"
            + "<button class=\"row-action\" type=\"button\" aria-label=\"Ver " + escapeHtml(product.name) + "\" title=\"Edição disponível na próxima etapa\"><svg aria-hidden=\"true\" viewBox=\"0 0 24 24\"><path d=\"M12 5v14M5 12h14\"></path></svg></button>";

        article.querySelector(".row-action").addEventListener("click", function () {
            showToast("A edição real de produtos será adicionada quando o banco de dados for conectado.");
        });

        return article;
    }

    function escapeHtml(value) {
        const element = document.createElement("div");
        element.textContent = value;
        return element.innerHTML;
    }

    function renderProducts() {
        const visibleProducts = getFilteredProducts();
        productsList.replaceChildren();

        visibleProducts.forEach(function (product) {
            productsList.appendChild(createProductRow(product));
        });

        emptyState.hidden = visibleProducts.length !== 0;
        document.getElementById("tableDescription").textContent = visibleProducts.length === products.length
            ? products.length + " produtos configurados neste catálogo de demonstração."
            : visibleProducts.length + " produto" + (visibleProducts.length === 1 ? " encontrado." : "s encontrados.");
    }

    function updateSummary() {
        const activeProducts = products.filter(function (product) {
            return product.status === "active";
        });
        const categories = new Set(products.map(function (product) {
            return product.category;
        }));

        document.getElementById("totalProducts").textContent = products.length;
        document.getElementById("activeProducts").textContent = activeProducts.length;
        document.getElementById("categoryCount").textContent = categories.size;
        document.getElementById("menuProductCount").textContent = products.length;
    }

    function showToast(message) {
        window.clearTimeout(toastTimeout);
        toast.textContent = message;
        toast.hidden = false;
        requestAnimationFrame(function () {
            toast.classList.add("toast--visible");
        });
        toastTimeout = window.setTimeout(function () {
            toast.classList.remove("toast--visible");
            window.setTimeout(function () {
                toast.hidden = true;
            }, 180);
        }, 4200);
    }

    function setTheme(theme) {
        root.dataset.theme = theme;
        const isDark = theme === "dark";
        themeButton.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
        document.querySelector("meta[name='theme-color']").setAttribute("content", isDark ? "#0c1119" : "#f7f9fc");
        try {
            window.localStorage.setItem(storageKey, theme);
        } catch (error) {
            // A preferência visual continua funcionando mesmo se o navegador bloquear armazenamento local.
        }
    }

    function toggleMenu(forceOpen) {
        const open = typeof forceOpen === "boolean" ? forceOpen : !sidebar.classList.contains("sidebar--open");
        sidebar.classList.toggle("sidebar--open", open);
        mobileOverlay.hidden = !open;
        menuButton.setAttribute("aria-expanded", String(open));
    }

    searchField.addEventListener("input", renderProducts);
    statusFilter.addEventListener("change", renderProducts);
    document.getElementById("newProductButton").addEventListener("click", function () {
        showToast("O cadastro será ativado na Etapa 2, junto com a persistência segura dos dados.");
    });
    themeButton.addEventListener("click", function () {
        setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
    menuButton.addEventListener("click", function () {
        toggleMenu();
    });
    mobileOverlay.addEventListener("click", function () {
        toggleMenu(false);
    });
    window.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            toggleMenu(false);
        }
    });

    try {
        setTheme(window.localStorage.getItem(storageKey) || "light");
    } catch (error) {
        setTheme("light");
    }

    updateSummary();
    renderProducts();
}());
