(function () {
    "use strict";

    const config = window.NEOEFFEX_SUPABASE_CONFIG || {};
    const storageKey = "neoeffex-admin-theme";
    const root = document.documentElement;
    const body = document.body;
    const authScreen = document.getElementById("authScreen");
    const loginForm = document.getElementById("loginForm");
    const recoveryForm = document.getElementById("recoveryForm");
    const authSetup = document.getElementById("authSetup");
    const authFeedback = document.getElementById("authFeedback");
    const recoveryFeedback = document.getElementById("recoveryFeedback");
    const loginButton = document.getElementById("loginButton");
    const passwordField = document.getElementById("password");
    const passwordToggle = document.getElementById("passwordToggle");
    const productsList = document.getElementById("productsList");
    const emptyState = document.getElementById("emptyState");
    const searchField = document.getElementById("productSearch");
    const statusFilter = document.getElementById("statusFilter");
    const tableDescription = document.getElementById("tableDescription");
    const toast = document.getElementById("toast");
    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menuButton");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const themeButton = document.getElementById("themeButton");
    const accountEmail = document.getElementById("accountEmail");
    let client = null;
    let products = [];
    let activeCatalog = null;
    let toastTimeout;

    function setFeedback(element, message, type) {
        element.textContent = message;
        element.dataset.type = type || "";
    }

    function hasValidConfig() {
        return Boolean(
            config.url
            && config.publishableKey
            && /^https:\/\/.+\.supabase\.co\/?$/.test(config.url)
        );
    }

    function setTheme(theme) {
        const isDark = theme === "dark";
        root.dataset.theme = theme;
        themeButton.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
        document.querySelector("meta[name='theme-color']").setAttribute("content", isDark ? "#0c1119" : "#f7f9fc");

        try {
            window.localStorage.setItem(storageKey, theme);
        } catch (error) {
            // A preferência visual continua funcionando mesmo se o navegador bloquear armazenamento local.
        }
    }

    function showLogin() {
        body.classList.remove("is-authenticated");
        authScreen.hidden = false;
        loginForm.reset();
        setFeedback(authFeedback, "", "");
    }

    async function showDashboard(session) {
        if (!session) {
            showLogin();
            return;
        }

        body.classList.add("is-authenticated");
        authScreen.hidden = true;
        accountEmail.textContent = session.user.email || "Conta conectada";
        await loadCatalog();
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(Number(value));
    }

    function escapeHtml(value) {
        const element = document.createElement("div");
        element.textContent = value || "";
        return element.innerHTML;
    }

    function getFilteredProducts() {
        const search = searchField.value.trim().toLocaleLowerCase("pt-BR");
        const status = statusFilter.value;

        return products.filter(function (product) {
            const searchableText = [product.name, product.category, product.description]
                .join(" ")
                .toLocaleLowerCase("pt-BR");
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
            + "<div><strong>" + escapeHtml(product.name) + "</strong><small>" + escapeHtml(product.description || "Sem descrição.") + "</small></div>"
            + "</div>"
            + "<span class=\"product-row__category\">" + escapeHtml(product.category) + "</span>"
            + "<strong class=\"product-row__price\">" + formatCurrency(product.price) + "</strong>"
            + "<span class=\"status status--" + product.status + "\"><i></i>" + statusLabel + "</span>"
            + "<button class=\"row-action\" type=\"button\" aria-label=\"Ver " + escapeHtml(product.name) + "\" title=\"Edição disponível na próxima etapa\"><svg aria-hidden=\"true\" viewBox=\"0 0 24 24\"><path d=\"M12 5v14M5 12h14\"></path></svg></button>";

        article.querySelector(".row-action").addEventListener("click", function () {
            showToast("A edição de produtos será adicionada na próxima etapa.");
        });

        return article;
    }

    function renderProducts() {
        const visibleProducts = getFilteredProducts();
        productsList.replaceChildren();

        visibleProducts.forEach(function (product) {
            productsList.appendChild(createProductRow(product));
        });

        emptyState.hidden = visibleProducts.length !== 0 || !activeCatalog;

        if (!activeCatalog) {
            tableDescription.textContent = "Nenhum catálogo está vinculado a esta conta.";
        } else if (visibleProducts.length === products.length) {
            tableDescription.textContent = products.length + " produto" + (products.length === 1 ? " configurado" : "s configurados") + " em " + activeCatalog.name + ".";
        } else {
            tableDescription.textContent = visibleProducts.length + " produto" + (visibleProducts.length === 1 ? " encontrado." : "s encontrados.");
        }
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

    async function loadCatalog() {
        products = [];
        activeCatalog = null;
        tableDescription.textContent = "Carregando produtos…";
        renderProducts();
        updateSummary();

        const { data: catalogs, error: catalogError } = await client
            .from("catalogs")
            .select("id, name, slug")
            .order("created_at", { ascending: true })
            .limit(1);

        if (catalogError) {
            console.error("Erro ao carregar catálogo", catalogError);
            tableDescription.textContent = "Não foi possível carregar o catálogo desta conta.";
            showToast("Não foi possível carregar os dados. Verifique a configuração e as regras de acesso.");
            return;
        }

        activeCatalog = catalogs && catalogs[0] ? catalogs[0] : null;

        if (!activeCatalog) {
            renderProducts();
            updateSummary();
            return;
        }

        const { data: loadedProducts, error: productsError } = await client
            .from("products")
            .select("id, name, description, category, price, status, sort_order, created_at")
            .eq("catalog_id", activeCatalog.id)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true });

        if (productsError) {
            console.error("Erro ao carregar produtos", productsError);
            tableDescription.textContent = "Não foi possível carregar os produtos deste catálogo.";
            showToast("Não foi possível carregar os produtos. Tente novamente mais tarde.");
            return;
        }

        products = loadedProducts || [];
        renderProducts();
        updateSummary();
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

    function toggleMenu(forceOpen) {
        const open = typeof forceOpen === "boolean" ? forceOpen : !sidebar.classList.contains("sidebar--open");
        sidebar.classList.toggle("sidebar--open", open);
        mobileOverlay.hidden = !open;
        menuButton.setAttribute("aria-expanded", String(open));
    }

    function showRecovery() {
        loginForm.hidden = true;
        recoveryForm.hidden = false;
        document.getElementById("recoveryEmail").focus();
    }

    function hideRecovery() {
        recoveryForm.hidden = true;
        loginForm.hidden = false;
        setFeedback(recoveryFeedback, "", "");
        document.getElementById("email").focus();
    }

    async function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = passwordField.value;

        if (!email || !password) {
            setFeedback(authFeedback, "Preencha seu e-mail e sua senha.", "error");
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = "Entrando…";
        setFeedback(authFeedback, "", "");

        const { data, error } = await client.auth.signInWithPassword({ email: email, password: password });

        if (error || !data.session) {
            setFeedback(authFeedback, "Não foi possível entrar com esses dados.", "error");
            loginButton.disabled = false;
            loginButton.textContent = "Entrar no painel";
            return;
        }

        await showDashboard(data.session);
        loginButton.disabled = false;
        loginButton.textContent = "Entrar no painel";
    }

    async function handleRecovery(event) {
        event.preventDefault();
        const email = document.getElementById("recoveryEmail").value.trim();
        const button = document.getElementById("recoverySubmit");

        if (!email) {
            setFeedback(recoveryFeedback, "Informe um e-mail válido.", "error");
            return;
        }

        button.disabled = true;
        button.textContent = "Enviando…";
        setFeedback(recoveryFeedback, "", "");

        const redirectTo = new URL("reset-password.html", window.location.href).toString();
        const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: redirectTo });

        button.disabled = false;
        button.textContent = "Enviar link de redefinição";

        if (error) {
            setFeedback(recoveryFeedback, "Não foi possível enviar o link agora. Tente novamente mais tarde.", "error");
            return;
        }

        setFeedback(recoveryFeedback, "Se houver uma conta vinculada a este e-mail, enviaremos um link de redefinição.", "success");
    }

    async function signOut() {
        const { error } = await client.auth.signOut({ scope: "local" });
        if (error) {
            showToast("Não foi possível encerrar a sessão agora.");
            return;
        }

        products = [];
        activeCatalog = null;
        updateSummary();
        renderProducts();
        showLogin();
    }

    function initializeConfiguredPanel() {
        if (!window.supabase) {
            authSetup.hidden = false;
            loginForm.hidden = true;
            body.classList.remove("is-loading");
            return;
        }

        client = window.supabase.createClient(config.url, config.publishableKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });

        client.auth.onAuthStateChange(function (_event, session) {
            if (session) {
                showDashboard(session);
            } else {
                showLogin();
            }
        });

        client.auth.getSession().then(function (result) {
            body.classList.remove("is-loading");
            if (result.data.session) {
                showDashboard(result.data.session);
            } else {
                showLogin();
            }
        }).catch(function () {
            body.classList.remove("is-loading");
            setFeedback(authFeedback, "Não foi possível verificar sua sessão. Atualize a página e tente novamente.", "error");
        });
    }

    searchField.addEventListener("input", renderProducts);
    statusFilter.addEventListener("change", renderProducts);
    document.getElementById("newProductButton").addEventListener("click", function () {
        showToast("O cadastro de produtos será ativado na próxima etapa.");
    });
    loginForm.addEventListener("submit", handleLogin);
    recoveryForm.addEventListener("submit", handleRecovery);
    document.getElementById("recoveryButton").addEventListener("click", showRecovery);
    document.getElementById("backToLogin").addEventListener("click", hideRecovery);
    passwordToggle.addEventListener("click", function () {
        const visible = passwordField.type === "text";
        passwordField.type = visible ? "password" : "text";
        passwordToggle.textContent = visible ? "Mostrar" : "Ocultar";
        passwordToggle.setAttribute("aria-label", visible ? "Mostrar senha" : "Ocultar senha");
    });
    document.getElementById("signOutButton").addEventListener("click", signOut);
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
        if (event.key === "Escape") toggleMenu(false);
    });

    try {
        setTheme(window.localStorage.getItem(storageKey) || "light");
    } catch (error) {
        setTheme("light");
    }

    if (!hasValidConfig()) {
        authSetup.hidden = false;
        loginForm.hidden = true;
        body.classList.remove("is-loading");
        return;
    }

    initializeConfiguredPanel();
}());
