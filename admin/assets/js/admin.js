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
    const newProductButton = document.getElementById("newProductButton");
    const productModal = document.getElementById("productModal");
    const deleteModal = document.getElementById("deleteModal");
    const productForm = document.getElementById("productForm");
    const productFeedback = document.getElementById("productFeedback");
    const productDescription = document.getElementById("productDescription");
    const descriptionCounter = document.getElementById("descriptionCounter");
    const productDangerActions = document.getElementById("productDangerActions");
    const saveProductButton = document.getElementById("saveProductButton");
    const toggleStatusButton = document.getElementById("toggleStatusButton");
    const deleteProductButton = document.getElementById("deleteProductButton");
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    let client = null;
    let products = [];
    let activeCatalog = null;
    let toastTimeout;
    let lastFocusedElement = null;

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
            + "<button class=\"row-action\" type=\"button\" aria-label=\"Editar " + escapeHtml(product.name) + "\" title=\"Editar produto\"><svg aria-hidden=\"true\" viewBox=\"0 0 24 24\"><path d=\"M5 19h4l9-9a2.8 2.8 0 0 0-4-4l-9 9v4Z\"></path><path d=\"m12.5 7.5 4 4\"></path></svg></button>";

        article.querySelector(".row-action").addEventListener("click", function () {
            openProductModal(product);
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
        newProductButton.disabled = !activeCatalog;
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

    function updateDescriptionCounter() {
        descriptionCounter.textContent = productDescription.value.length + " / 500";
    }

    function setProductFormLoading(isLoading) {
        saveProductButton.disabled = isLoading;
        toggleStatusButton.disabled = isLoading;
        deleteProductButton.disabled = isLoading;
        saveProductButton.textContent = isLoading ? "Salvando…" : "Salvar produto";
    }

    function openProductModal(product) {
        if (!activeCatalog) {
            showToast("Crie ou vincule um catálogo antes de cadastrar produtos.");
            return;
        }

        lastFocusedElement = document.activeElement;
        productForm.reset();
        setFeedback(productFeedback, "", "");
        productModal.hidden = false;
        productModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("has-modal");

        const editing = Boolean(product);
        document.getElementById("productModalTitle").textContent = editing ? "Editar produto" : "Novo produto";
        document.getElementById("productModalDescription").textContent = editing
            ? "Altere os dados e salve para atualizar o catálogo."
            : "Preencha os dados que serão exibidos no catálogo.";
        document.getElementById("productId").value = editing ? product.id : "";
        document.getElementById("productName").value = editing ? product.name : "";
        document.getElementById("productCategory").value = editing ? product.category : "";
        document.getElementById("productPrice").value = editing ? Number(product.price).toFixed(2) : "";
        productDescription.value = editing ? product.description || "" : "";
        document.getElementById("productStatus").value = editing ? product.status : "active";
        productDangerActions.hidden = !editing;
        toggleStatusButton.textContent = editing && product.status === "active" ? "Pausar produto" : "Ativar produto";
        setProductFormLoading(false);
        updateDescriptionCounter();
        window.setTimeout(function () {
            document.getElementById("productName").focus();
        }, 0);
    }

    function closeProductModal() {
        productModal.hidden = true;
        productModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("has-modal");
        productForm.reset();
        setFeedback(productFeedback, "", "");
        updateDescriptionCounter();
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
    }

    function openDeleteModal() {
        if (!document.getElementById("productId").value) return;
        productModal.setAttribute("aria-hidden", "true");
        deleteModal.hidden = false;
        deleteModal.setAttribute("aria-hidden", "false");
        window.setTimeout(function () {
            document.getElementById("cancelDeleteButton").focus();
        }, 0);
    }

    function closeDeleteModal() {
        deleteModal.hidden = true;
        deleteModal.setAttribute("aria-hidden", "true");
        if (!productModal.hidden) productModal.setAttribute("aria-hidden", "false");
    }

    function getProductPayload() {
        const name = document.getElementById("productName").value.trim();
        const category = document.getElementById("productCategory").value.trim();
        const description = productDescription.value.trim();
        const priceInput = document.getElementById("productPrice").value.trim();
        const price = Number(priceInput);
        const status = document.getElementById("productStatus").value;

        if (name.length < 2 || category.length < 2) {
            setFeedback(productFeedback, "Nome e categoria precisam ter ao menos 2 caracteres.", "error");
            return null;
        }

        if (!priceInput || !Number.isFinite(price) || price < 0 || price > 99999999.99) {
            setFeedback(productFeedback, "Informe um preço válido e maior ou igual a zero.", "error");
            return null;
        }

        if (description.length > 500 || !["active", "paused"].includes(status)) {
            setFeedback(productFeedback, "Revise a descrição e o status do produto.", "error");
            return null;
        }

        return {
            name: name,
            category: category,
            description: description,
            price: price.toFixed(2),
            status: status
        };
    }

    function getNextSortOrder() {
        return products.reduce(function (highest, product) {
            return Math.max(highest, Number(product.sort_order) || 0);
        }, -1) + 1;
    }

    async function saveProduct(event) {
        event.preventDefault();
        if (!activeCatalog) {
            setFeedback(productFeedback, "Não há catálogo vinculado a esta conta.", "error");
            return;
        }

        const payload = getProductPayload();
        if (!payload) return;

        const productId = document.getElementById("productId").value;
        setProductFormLoading(true);
        setFeedback(productFeedback, "", "");

        let error;
        if (productId) {
            ({ error } = await client
                .from("products")
                .update(payload)
                .eq("id", productId)
                .select("id")
                .single());
        } else {
            ({ error } = await client
                .from("products")
                .insert(Object.assign({}, payload, {
                    catalog_id: activeCatalog.id,
                    sort_order: getNextSortOrder()
                }))
                .select("id")
                .single());
        }

        if (error) {
            console.error("Erro ao salvar produto", error);
            setFeedback(productFeedback, "Não foi possível salvar o produto. Tente novamente.", "error");
            setProductFormLoading(false);
            return;
        }

        closeProductModal();
        await loadCatalog();
        showToast(productId ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.");
    }

    async function toggleProductStatus() {
        const productId = document.getElementById("productId").value;
        const currentProduct = products.find(function (product) {
            return product.id === productId;
        });
        if (!currentProduct) return;

        const nextStatus = currentProduct.status === "active" ? "paused" : "active";
        setProductFormLoading(true);

        const { error } = await client
            .from("products")
            .update({ status: nextStatus })
            .eq("id", productId)
            .select("id")
            .single();

        if (error) {
            console.error("Erro ao alterar status do produto", error);
            setFeedback(productFeedback, "Não foi possível alterar o status do produto.", "error");
            setProductFormLoading(false);
            return;
        }

        closeProductModal();
        await loadCatalog();
        showToast(nextStatus === "paused" ? "Produto pausado." : "Produto ativado.");
    }

    async function deleteProduct() {
        const productId = document.getElementById("productId").value;
        if (!productId) return;

        confirmDeleteButton.disabled = true;
        confirmDeleteButton.textContent = "Excluindo…";

        const { data, error } = await client
            .from("products")
            .delete()
            .eq("id", productId)
            .select("id")
            .maybeSingle();

        confirmDeleteButton.disabled = false;
        confirmDeleteButton.textContent = "Excluir produto";

        if (error || !data) {
            console.error("Erro ao excluir produto", error);
            closeDeleteModal();
            setFeedback(productFeedback, "Não foi possível excluir o produto. Atualize a página e tente novamente.", "error");
            return;
        }

        closeDeleteModal();
        closeProductModal();
        await loadCatalog();
        showToast("Produto excluído com sucesso.");
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
        openProductModal();
    });
    productForm.addEventListener("submit", saveProduct);
    productDescription.addEventListener("input", updateDescriptionCounter);
    document.getElementById("closeProductModal").addEventListener("click", closeProductModal);
    toggleStatusButton.addEventListener("click", toggleProductStatus);
    deleteProductButton.addEventListener("click", openDeleteModal);
    document.getElementById("closeDeleteModal").addEventListener("click", closeDeleteModal);
    document.getElementById("cancelDeleteButton").addEventListener("click", closeDeleteModal);
    confirmDeleteButton.addEventListener("click", deleteProduct);
    productModal.addEventListener("click", function (event) {
        if (event.target === productModal) closeProductModal();
    });
    deleteModal.addEventListener("click", function (event) {
        if (event.target === deleteModal) closeDeleteModal();
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
        if (event.key !== "Escape") return;

        if (!deleteModal.hidden) {
            closeDeleteModal();
            return;
        }

        if (!productModal.hidden) {
            closeProductModal();
            return;
        }

        toggleMenu(false);
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
