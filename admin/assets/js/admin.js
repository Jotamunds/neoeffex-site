(function () {
    "use strict";

    const config = window.NEOEFFEX_SUPABASE_CONFIG || {};
    const storageKey = "neoeffex-admin-theme";
    const authStorageKey = "neoeffex-admin-auth";
    const activeCatalogStorageKey = "neoeffex-admin-active-catalog";
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
    const newCatalogButton = document.getElementById("newCatalogButton");
    const editCatalogButton = document.getElementById("editCatalogButton");
    const viewCatalogLink = document.getElementById("viewCatalogLink");
    const catalogSelect = document.getElementById("catalogSelect");
    const activeCatalogName = document.getElementById("activeCatalogName");
    const manageCategoriesButton = document.getElementById("manageCategoriesButton");
    const configureOrdersButton = document.getElementById("configureOrdersButton");
    const productModal = document.getElementById("productModal");
    const catalogModal = document.getElementById("catalogModal");
    const categoryModal = document.getElementById("categoryModal");
    const deleteModal = document.getElementById("deleteModal");
    const productForm = document.getElementById("productForm");
    const catalogForm = document.getElementById("catalogForm");
    const categoryForm = document.getElementById("categoryForm");
    const productFeedback = document.getElementById("productFeedback");
    const catalogFeedback = document.getElementById("catalogFeedback");
    const categoryFeedback = document.getElementById("categoryFeedback");
    const productDescription = document.getElementById("productDescription");
    const descriptionCounter = document.getElementById("descriptionCounter");
    const productCategory = document.getElementById("productCategory");
    const productImageInput = document.getElementById("productImage");
    const productImagePreviewImage = document.getElementById("productImagePreviewImage");
    const productImagePreviewFallback = document.getElementById("productImagePreviewFallback");
    const removeProductImage = document.getElementById("removeProductImage");
    const removeProductImageField = document.getElementById("removeProductImageField");
    const productDangerActions = document.getElementById("productDangerActions");
    const saveProductButton = document.getElementById("saveProductButton");
    const saveCatalogButton = document.getElementById("saveCatalogButton");
    const saveCategoryButton = document.getElementById("saveCategoryButton");
    const toggleStatusButton = document.getElementById("toggleStatusButton");
    const deleteProductButton = document.getElementById("deleteProductButton");
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    const categoryList = document.getElementById("categoryList");
    const emptyCategoryState = document.getElementById("emptyCategoryState");
    let client = null;
    let catalogs = [];
    let categories = [];
    let products = [];
    let activeCatalog = null;
    let pendingDeletion = null;
    let toastTimeout;
    let lastFocusedElement = null;
    let loadSequence = 0;
    let productImageObjectUrl = null;
    let authenticatedUserId = null;
    const productImagesBucket = "catalog-products";
    const maximumProductImageSize = 5 * 1024 * 1024;

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

    function rememberActiveCatalog(id) {
        try {
            if (id) window.localStorage.setItem(activeCatalogStorageKey, id);
        } catch (error) {
            // O painel ainda funciona se o navegador bloquear armazenamento local.
        }
    }

    function readRememberedCatalog() {
        try {
            return window.localStorage.getItem(activeCatalogStorageKey);
        } catch (error) {
            return null;
        }
    }

    function clearRememberedCatalog() {
        try {
            window.localStorage.removeItem(activeCatalogStorageKey);
        } catch (error) {
            // O logout continua funcionando mesmo se o navegador bloquear armazenamento local.
        }
    }

    function showLogin() {
        authenticatedUserId = null;
        body.classList.remove("is-authenticated");
        authScreen.hidden = false;
        loginForm.reset();
        setFeedback(authFeedback, "", "");
    }

    async function showDashboard(user) {
        if (!user) {
            showLogin();
            return;
        }

        const dashboardAlreadyLoaded = authenticatedUserId === user.id
            && body.classList.contains("is-authenticated");
        authenticatedUserId = user.id;
        body.classList.add("is-authenticated");
        authScreen.hidden = true;
        accountEmail.textContent = user.email || "Conta conectada";
        if (dashboardAlreadyLoaded) return;
        await loadCatalogs();
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(Number(value));
    }

    function slugify(value) {
        return value
            .toLocaleLowerCase("pt-BR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80);
    }

    function normalizeWhatsapp(value) {
        let digits = String(value || "").replace(/\D/g, "").replace(/^0+/, "");
        if (digits.length === 10 || digits.length === 11) digits = "55" + digits;
        return digits;
    }

    function formatWhatsapp(value) {
        const digits = normalizeWhatsapp(value);
        if (!digits) return "Não configurado";
        if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
            const local = digits.slice(4);
            const split = local.length === 9 ? 5 : 4;
            return "+55 (" + digits.slice(2, 4) + ") " + local.slice(0, split) + "-" + local.slice(split);
        }
        return "+" + digits;
    }

    function getProductImageUrl(imagePath) {
        if (!imagePath || !client) return "";
        const result = client.storage.from(productImagesBucket).getPublicUrl(imagePath);
        return result.data && result.data.publicUrl ? result.data.publicUrl : "";
    }

    function getCategoryName(categoryId) {
        const category = categories.find(function (item) {
            return item.id === categoryId;
        });
        return category ? category.name : "Categoria indisponível";
    }

    function getFilteredProducts() {
        const search = searchField.value.trim().toLocaleLowerCase("pt-BR");
        const status = statusFilter.value;

        return products.filter(function (product) {
            const searchableText = [product.name, product.categoryName, product.description]
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
        const statusClass = product.status === "active" ? "active" : "paused";
        const imageUrl = getProductImageUrl(product.image_path);
        article.className = "product-row";

        const nameBlock = document.createElement("div");
        nameBlock.className = "product-row__name";

        const productIcon = document.createElement("span");
        productIcon.className = "product-icon";
        productIcon.setAttribute("aria-hidden", "true");

        const fallback = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        fallback.setAttribute("viewBox", "0 0 24 24");
        fallback.hidden = Boolean(imageUrl);
        [
            "M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z",
            "M4 12.5 12 17l8-4.5",
            "M4 17 12 21l8-4"
        ].forEach(function (pathData) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            fallback.appendChild(path);
        });

        if (imageUrl) {
            const thumbnail = document.createElement("img");
            thumbnail.src = imageUrl;
            thumbnail.alt = "";
            thumbnail.loading = "lazy";
            thumbnail.addEventListener("error", function () {
                thumbnail.hidden = true;
                fallback.hidden = false;
            });
            productIcon.appendChild(thumbnail);
        }
        productIcon.appendChild(fallback);

        const productCopy = document.createElement("div");
        const productName = document.createElement("strong");
        const productDescriptionText = document.createElement("small");
        productName.textContent = product.name;
        productDescriptionText.textContent = product.description || "Sem descrição.";
        productCopy.append(productName, productDescriptionText);
        nameBlock.append(productIcon, productCopy);

        const category = document.createElement("span");
        category.className = "product-row__category";
        category.textContent = product.categoryName;

        const price = document.createElement("strong");
        price.className = "product-row__price";
        price.textContent = formatCurrency(product.price);

        const status = document.createElement("span");
        status.className = "status status--" + statusClass;
        status.append(document.createElement("i"), document.createTextNode(statusLabel));

        const editButton = document.createElement("button");
        editButton.className = "row-action";
        editButton.type = "button";
        editButton.setAttribute("aria-label", "Editar " + product.name);
        editButton.title = "Editar produto";
        const editIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        editIcon.setAttribute("aria-hidden", "true");
        editIcon.setAttribute("viewBox", "0 0 24 24");
        ["M5 19h4l9-9a2.8 2.8 0 0 0-4-4l-9 9v4Z", "m12.5 7.5 4 4"].forEach(function (pathData) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            editIcon.appendChild(path);
        });
        editButton.appendChild(editIcon);
        editButton.addEventListener("click", function () {
            openProductModal(product);
        });

        article.append(nameBlock, category, price, status, editButton);

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
            tableDescription.textContent = "Crie o primeiro catálogo para começar a organizar seus produtos.";
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

        document.getElementById("totalProducts").textContent = products.length;
        document.getElementById("activeProducts").textContent = activeProducts.length;
        document.getElementById("categoryCount").textContent = categories.length;
        document.getElementById("menuProductCount").textContent = products.length;
        document.getElementById("menuCategoryCount").textContent = categories.length;
        newProductButton.disabled = !activeCatalog;
        manageCategoriesButton.disabled = !activeCatalog;
    }

    function renderCatalogControls() {
        catalogSelect.replaceChildren();

        if (!catalogs.length) {
            catalogSelect.appendChild(new Option("Nenhum catálogo cadastrado", ""));
            catalogSelect.disabled = true;
            editCatalogButton.disabled = true;
            activeCatalogName.textContent = "Nenhum catálogo selecionado";
            viewCatalogLink.removeAttribute("href");
            viewCatalogLink.classList.add("is-disabled");
            viewCatalogLink.setAttribute("aria-disabled", "true");
            viewCatalogLink.setAttribute("tabindex", "-1");
            viewCatalogLink.title = "Crie e ative um catálogo para visualizar a página pública";
            renderOrdersSummary();
            return;
        }

        catalogs.forEach(function (catalog) {
            const option = new Option(catalog.name + (catalog.is_active ? "" : " — pausado"), catalog.id);
            option.selected = activeCatalog && catalog.id === activeCatalog.id;
            catalogSelect.appendChild(option);
        });

        catalogSelect.disabled = false;
        editCatalogButton.disabled = !activeCatalog;
        activeCatalogName.textContent = activeCatalog
            ? activeCatalog.name + (activeCatalog.is_active ? "" : " (pausado)")
            : "Nenhum catálogo selecionado";

        const publicCatalogAvailable = Boolean(activeCatalog && activeCatalog.is_active);
        viewCatalogLink.classList.toggle("is-disabled", !publicCatalogAvailable);
        viewCatalogLink.setAttribute("aria-disabled", String(!publicCatalogAvailable));
        viewCatalogLink.setAttribute("tabindex", publicCatalogAvailable ? "0" : "-1");
        viewCatalogLink.title = publicCatalogAvailable
            ? "Abrir catálogo público em uma nova aba"
            : "Ative este catálogo para disponibilizar a página pública";
        if (publicCatalogAvailable) {
            viewCatalogLink.href = "../catalogo/?catalogo=" + encodeURIComponent(activeCatalog.slug);
        } else {
            viewCatalogLink.removeAttribute("href");
        }
        renderOrdersSummary();
    }

    function renderOrdersSummary() {
        const status = document.getElementById("ordersStatus");
        const whatsapp = document.getElementById("ordersWhatsapp");
        const message = document.getElementById("ordersMessage");
        configureOrdersButton.disabled = !activeCatalog;

        if (!activeCatalog) {
            status.textContent = "Nenhum catálogo selecionado";
            status.dataset.state = "";
            whatsapp.textContent = "Não configurado";
            message.textContent = "Selecione ou crie um catálogo para configurar.";
            return;
        }

        const enabled = Boolean(activeCatalog.orders_enabled && activeCatalog.whatsapp_number);
        status.textContent = enabled ? "Pedidos ativados" : "Pedidos desativados";
        status.dataset.state = enabled ? "active" : "inactive";
        whatsapp.textContent = formatWhatsapp(activeCatalog.whatsapp_number);
        message.textContent = activeCatalog.order_message
            || "Confirme disponibilidade, prazo e forma de pagamento pelo WhatsApp.";
    }

    async function loadCatalogs(preferredCatalogId) {
        const sequence = ++loadSequence;
        tableDescription.textContent = "Carregando catálogos…";
        products = [];
        categories = [];
        renderProducts();
        updateSummary();

        const { data, error } = await client
            .from("catalogs")
            .select("id, name, slug, is_active, whatsapp_number, orders_enabled, order_message, created_at")
            .order("created_at", { ascending: true });

        if (sequence !== loadSequence) return;

        if (error) {
            console.error("Erro ao carregar catálogos", error);
            catalogs = [];
            activeCatalog = null;
            renderCatalogControls();
            renderProducts();
            updateSummary();
            showToast("Não foi possível carregar os catálogos. Verifique a configuração e as regras de acesso.");
            return;
        }

        catalogs = data || [];
        const desiredId = preferredCatalogId || readRememberedCatalog();
        activeCatalog = catalogs.find(function (catalog) {
            return catalog.id === desiredId;
        }) || catalogs[0] || null;
        if (activeCatalog) rememberActiveCatalog(activeCatalog.id);
        renderCatalogControls();
        await loadActiveCatalogData(sequence);
    }

    async function loadActiveCatalogData(sequence) {
        products = [];
        categories = [];

        if (!activeCatalog) {
            renderProducts();
            updateSummary();
            return;
        }

        tableDescription.textContent = "Carregando produtos…";
        renderProducts();
        updateSummary();

        const catalogId = activeCatalog.id;
        const [categoriesResult, productsResult] = await Promise.all([
            client.from("categories")
                .select("id, name, sort_order, created_at")
                .eq("catalog_id", catalogId)
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: true }),
            client.from("products")
                .select("id, name, description, category_id, price, status, image_path, sort_order, created_at")
                .eq("catalog_id", catalogId)
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: true })
        ]);

        if ((sequence && sequence !== loadSequence) || !activeCatalog || activeCatalog.id !== catalogId) return;

        if (categoriesResult.error || productsResult.error) {
            console.error("Erro ao carregar categorias ou produtos", categoriesResult.error || productsResult.error);
            tableDescription.textContent = "Não foi possível carregar os dados deste catálogo.";
            showToast("Execute o arquivo 003_categories_and_multi_catalogs.sql e revise as regras de acesso.");
            return;
        }

        categories = categoriesResult.data || [];
        products = (productsResult.data || []).map(function (product) {
            return Object.assign({}, product, { categoryName: getCategoryName(product.category_id) });
        });
        renderProducts();
        updateSummary();
        renderCategoryList();
    }

    function updateDescriptionCounter() {
        descriptionCounter.textContent = productDescription.value.length + " / 500";
    }

    function setProductFormLoading(isLoading) {
        saveProductButton.disabled = isLoading;
        toggleStatusButton.disabled = isLoading;
        deleteProductButton.disabled = isLoading;
        productImageInput.disabled = isLoading;
        removeProductImage.disabled = isLoading;
        saveProductButton.textContent = isLoading ? "Salvando…" : "Salvar produto";
    }

    function clearProductImageObjectUrl() {
        if (!productImageObjectUrl) return;
        URL.revokeObjectURL(productImageObjectUrl);
        productImageObjectUrl = null;
    }

    function showProductImagePreview(url, productName) {
        productImagePreviewFallback.textContent = (productName || "N").trim().charAt(0).toLocaleUpperCase("pt-BR") || "N";
        productImagePreviewImage.hidden = !url;
        productImagePreviewFallback.hidden = Boolean(url);
        productImagePreviewImage.src = url || "";
        productImagePreviewImage.alt = url ? "Prévia de " + (productName || "produto") : "";
    }

    function resetProductImageFields(product) {
        clearProductImageObjectUrl();
        productImageInput.value = "";
        removeProductImage.checked = false;
        removeProductImageField.hidden = !(product && product.image_path);
        showProductImagePreview(product ? getProductImageUrl(product.image_path) : "", product ? product.name : "N");
    }

    function validateProductImage(file) {
        if (!file) return "";
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            return "Use uma imagem JPEG, PNG ou WebP.";
        }
        if (file.size <= 0 || file.size > maximumProductImageSize) {
            return "A imagem precisa ter no máximo 5 MB.";
        }
        return "";
    }

    function previewSelectedProductImage() {
        const file = productImageInput.files && productImageInput.files[0];
        const validationMessage = validateProductImage(file);
        if (validationMessage) {
            productImageInput.value = "";
            setFeedback(productFeedback, validationMessage, "error");
            return;
        }
        if (!file) return;
        clearProductImageObjectUrl();
        productImageObjectUrl = URL.createObjectURL(file);
        removeProductImage.checked = false;
        showProductImagePreview(productImageObjectUrl, document.getElementById("productName").value || "Produto");
        setFeedback(productFeedback, "", "");
    }

    function setCatalogFormLoading(isLoading) {
        saveCatalogButton.disabled = isLoading;
        saveCatalogButton.textContent = isLoading ? "Salvando…" : "Salvar catálogo";
    }

    function setCategoryFormLoading(isLoading) {
        saveCategoryButton.disabled = isLoading;
        saveCategoryButton.textContent = isLoading
            ? "Salvando…"
            : (document.getElementById("categoryId").value ? "Salvar categoria" : "Adicionar");
    }

    function populateProductCategories(selectedId) {
        productCategory.replaceChildren();
        productCategory.appendChild(new Option("Selecione uma categoria", ""));
        categories.forEach(function (category) {
            const option = new Option(category.name, category.id);
            option.selected = category.id === selectedId;
            productCategory.appendChild(option);
        });
    }

    function openProductModal(product) {
        if (!activeCatalog) {
            showToast("Crie um catálogo antes de cadastrar produtos.");
            return;
        }
        if (!categories.length) {
            showToast("Cadastre ao menos uma categoria antes de adicionar produtos.");
            return;
        }

        lastFocusedElement = document.activeElement;
        productForm.reset();
        setFeedback(productFeedback, "", "");
        productModal.hidden = false;
        productModal.setAttribute("aria-hidden", "false");
        body.classList.add("has-modal");

        const editing = Boolean(product);
        document.getElementById("productModalTitle").textContent = editing ? "Editar produto" : "Novo produto";
        document.getElementById("productModalDescription").textContent = editing
            ? "Altere os dados e salve para atualizar o catálogo."
            : "Preencha os dados que serão exibidos no catálogo.";
        document.getElementById("productId").value = editing ? product.id : "";
        document.getElementById("productName").value = editing ? product.name : "";
        populateProductCategories(editing ? product.category_id : "");
        document.getElementById("productPrice").value = editing ? Number(product.price).toFixed(2) : "";
        productDescription.value = editing ? product.description || "" : "";
        document.getElementById("productStatus").value = editing ? product.status : "active";
        resetProductImageFields(editing ? product : null);
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
        body.classList.remove("has-modal");
        productForm.reset();
        clearProductImageObjectUrl();
        showProductImagePreview("", "N");
        setFeedback(productFeedback, "", "");
        updateDescriptionCounter();
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
    }

    function openCatalogModal(catalog) {
        lastFocusedElement = document.activeElement;
        catalogForm.reset();
        setFeedback(catalogFeedback, "", "");
        catalogModal.hidden = false;
        catalogModal.setAttribute("aria-hidden", "false");
        body.classList.add("has-modal");

        const editing = Boolean(catalog);
        document.getElementById("catalogModalTitle").textContent = editing ? "Editar catálogo" : "Novo catálogo";
        document.getElementById("catalogModalDescription").textContent = editing
            ? "Atualize os dados de identificação e o status deste catálogo."
            : "Defina o nome e o endereço que será usado no catálogo público.";
        document.getElementById("catalogId").value = editing ? catalog.id : "";
        document.getElementById("catalogName").value = editing ? catalog.name : "";
        document.getElementById("catalogSlug").value = editing ? catalog.slug : "";
        document.getElementById("catalogSlug").dataset.touched = editing ? "true" : "";
        document.getElementById("catalogActive").checked = editing ? catalog.is_active : true;
        document.getElementById("catalogWhatsapp").value = editing ? (catalog.whatsapp_number || "") : "";
        document.getElementById("catalogOrderMessage").value = editing
            ? (catalog.order_message || "Confirme disponibilidade, prazo e forma de pagamento pelo WhatsApp.")
            : "Confirme disponibilidade, prazo e forma de pagamento pelo WhatsApp.";
        document.getElementById("catalogOrdersEnabled").checked = editing ? Boolean(catalog.orders_enabled) : false;
        setCatalogFormLoading(false);
        window.setTimeout(function () {
            document.getElementById("catalogName").focus();
        }, 0);
    }

    function closeCatalogModal() {
        catalogModal.hidden = true;
        catalogModal.setAttribute("aria-hidden", "true");
        body.classList.remove("has-modal");
        catalogForm.reset();
        setFeedback(catalogFeedback, "", "");
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
    }

    function openCategoryModal() {
        if (!activeCatalog) {
            showToast("Crie um catálogo antes de organizar categorias.");
            return;
        }

        lastFocusedElement = document.activeElement;
        resetCategoryForm();
        document.getElementById("categoryCatalogName").textContent = activeCatalog.name;
        categoryModal.hidden = false;
        categoryModal.setAttribute("aria-hidden", "false");
        body.classList.add("has-modal");
        renderCategoryList();
        window.setTimeout(function () {
            document.getElementById("categoryName").focus();
        }, 0);
    }

    function closeCategoryModal() {
        categoryModal.hidden = true;
        categoryModal.setAttribute("aria-hidden", "true");
        body.classList.remove("has-modal");
        resetCategoryForm();
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
    }

    function resetCategoryForm() {
        categoryForm.reset();
        document.getElementById("categoryId").value = "";
        saveCategoryButton.textContent = "Adicionar";
        setCategoryFormLoading(false);
        setFeedback(categoryFeedback, "", "");
    }

    function getCategoryProductCount(categoryId) {
        return products.filter(function (product) {
            return product.category_id === categoryId;
        }).length;
    }

    function renderCategoryList() {
        categoryList.replaceChildren();
        emptyCategoryState.hidden = categories.length !== 0;

        categories.forEach(function (category) {
            const item = document.createElement("article");
            const copy = document.createElement("div");
            const actions = document.createElement("div");
            const name = document.createElement("strong");
            const detail = document.createElement("small");
            const editButton = document.createElement("button");
            const deleteButton = document.createElement("button");
            const productCount = getCategoryProductCount(category.id);

            item.className = "category-list__item";
            name.textContent = category.name;
            detail.textContent = productCount + " produto" + (productCount === 1 ? " vinculado" : "s vinculados");
            copy.appendChild(name);
            copy.appendChild(detail);
            editButton.className = "category-action";
            editButton.type = "button";
            editButton.textContent = "Editar";
            editButton.addEventListener("click", function () {
                document.getElementById("categoryId").value = category.id;
                document.getElementById("categoryName").value = category.name;
                saveCategoryButton.textContent = "Salvar categoria";
                setFeedback(categoryFeedback, "", "");
                document.getElementById("categoryName").focus();
            });
            deleteButton.className = "category-action category-action--danger";
            deleteButton.type = "button";
            deleteButton.textContent = "Excluir";
            deleteButton.disabled = productCount > 0;
            deleteButton.title = productCount > 0 ? "Remova ou altere os produtos desta categoria antes de excluí-la" : "Excluir categoria";
            deleteButton.addEventListener("click", function () {
                if (productCount > 0) {
                    setFeedback(categoryFeedback, "Esta categoria possui produtos vinculados e não pode ser excluída.", "error");
                    return;
                }
                openDeleteModal({ type: "category", id: category.id, name: category.name, baseModal: categoryModal });
            });
            actions.appendChild(editButton);
            actions.appendChild(deleteButton);
            item.appendChild(copy);
            item.appendChild(actions);
            categoryList.appendChild(item);
        });
    }

    function openDeleteModal(deletion) {
        pendingDeletion = deletion;
        const isCategory = deletion.type === "category";
        deletion.baseModal.setAttribute("aria-hidden", "true");
        document.getElementById("deleteModalTitle").textContent = isCategory ? "Excluir categoria?" : "Excluir produto?";
        document.getElementById("deleteModalDescription").textContent = isCategory
            ? "A categoria “" + deletion.name + "” será removida. Essa ação não poderá ser desfeita."
            : "O produto “" + deletion.name + "” será removido do banco de dados e não poderá ser desfeito.";
        confirmDeleteButton.textContent = isCategory ? "Excluir categoria" : "Excluir produto";
        deleteModal.hidden = false;
        deleteModal.setAttribute("aria-hidden", "false");
        window.setTimeout(function () {
            document.getElementById("cancelDeleteButton").focus();
        }, 0);
    }

    function closeDeleteModal() {
        deleteModal.hidden = true;
        deleteModal.setAttribute("aria-hidden", "true");
        if (pendingDeletion && !pendingDeletion.baseModal.hidden) {
            pendingDeletion.baseModal.setAttribute("aria-hidden", "false");
        }
        pendingDeletion = null;
    }

    function getProductPayload() {
        const name = document.getElementById("productName").value.trim();
        const categoryId = productCategory.value;
        const description = productDescription.value.trim();
        const priceInput = document.getElementById("productPrice").value.trim();
        const price = Number(priceInput);
        const status = document.getElementById("productStatus").value;
        const categoryExists = categories.some(function (category) {
            return category.id === categoryId;
        });

        if (name.length < 2 || !categoryExists) {
            setFeedback(productFeedback, "Informe um nome e selecione uma categoria válida.", "error");
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

        return { name: name, category_id: categoryId, description: description, price: price.toFixed(2), status: status };
    }

    function getNextSortOrder(items) {
        return items.reduce(function (highest, item) {
            return Math.max(highest, Number(item.sort_order) || 0);
        }, -1) + 1;
    }

    function getProductImageExtension(file) {
        return {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp"
        }[file.type] || "";
    }

    async function uploadProductImage(file, productId) {
        const userResult = await client.auth.getUser();
        const user = userResult.data && userResult.data.user;
        if (userResult.error || !user) {
            return { path: "", error: userResult.error || new Error("Sessão não encontrada") };
        }
        const extension = getProductImageExtension(file);
        const path = user.id + "/" + activeCatalog.id + "/" + productId + "/" + Date.now() + "." + extension;
        const uploadResult = await client.storage.from(productImagesBucket).upload(path, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: false
        });
        return { path: uploadResult.error ? "" : path, error: uploadResult.error };
    }

    async function removeStoredProductImage(imagePath) {
        if (!imagePath) return null;
        const result = await client.storage.from(productImagesBucket).remove([imagePath]);
        return result.error || null;
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
        const currentProduct = products.find(function (product) { return product.id === productId; }) || null;
        const imageFile = productImageInput.files && productImageInput.files[0];
        const imageValidationMessage = validateProductImage(imageFile);
        if (imageValidationMessage) {
            setFeedback(productFeedback, imageValidationMessage, "error");
            return;
        }
        setProductFormLoading(true);
        setFeedback(productFeedback, "", "");
        let result;
        let uploadedImagePath = "";
        let imageCleanupFailed = false;
        if (productId) {
            if (imageFile) {
                const uploadResult = await uploadProductImage(imageFile, productId);
                if (uploadResult.error) {
                    console.error("Erro ao enviar imagem", uploadResult.error);
                    setFeedback(productFeedback, "Não foi possível enviar a imagem. Confirme se a migração 006 foi executada.", "error");
                    setProductFormLoading(false);
                    return;
                }
                uploadedImagePath = uploadResult.path;
                payload.image_path = uploadedImagePath;
            } else if (removeProductImage.checked && currentProduct && currentProduct.image_path) {
                payload.image_path = null;
            }
            result = await client.from("products").update(payload).eq("id", productId).select("id, image_path").single();
        } else {
            result = await client.from("products").insert(Object.assign({}, payload, {
                catalog_id: activeCatalog.id,
                sort_order: getNextSortOrder(products)
            })).select("id, image_path").single();
        }

        if (result.error) {
            console.error("Erro ao salvar produto", result.error);
            if (uploadedImagePath) await removeStoredProductImage(uploadedImagePath);
            setFeedback(productFeedback, "Não foi possível salvar o produto. Tente novamente.", "error");
            setProductFormLoading(false);
            return;
        }

        const savedProductId = productId || result.data.id;
        if (!productId && imageFile) {
            const uploadResult = await uploadProductImage(imageFile, savedProductId);
            if (uploadResult.error) {
                console.error("Erro ao enviar imagem", uploadResult.error);
                await client.from("products").delete().eq("id", savedProductId);
                setFeedback(productFeedback, "Não foi possível enviar a imagem. O produto não foi criado; confirme se a migração 006 foi executada.", "error");
                setProductFormLoading(false);
                return;
            }
            uploadedImagePath = uploadResult.path;
            const imageUpdateResult = await client.from("products")
                .update({ image_path: uploadedImagePath })
                .eq("id", savedProductId)
                .select("id")
                .single();
            if (imageUpdateResult.error) {
                console.error("Erro ao vincular imagem", imageUpdateResult.error);
                await removeStoredProductImage(uploadedImagePath);
                await client.from("products").delete().eq("id", savedProductId);
                setFeedback(productFeedback, "Não foi possível vincular a imagem. O produto não foi criado.", "error");
                setProductFormLoading(false);
                return;
            }
        }

        const previousImagePath = currentProduct && currentProduct.image_path;
        if (previousImagePath && (uploadedImagePath || removeProductImage.checked)) {
            imageCleanupFailed = Boolean(await removeStoredProductImage(previousImagePath));
        }

        closeProductModal();
        await loadActiveCatalogData();
        showToast(imageCleanupFailed
            ? "Produto salvo, mas a imagem anterior não pôde ser removida do armazenamento."
            : (productId ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso."));
    }

    async function toggleProductStatus() {
        const productId = document.getElementById("productId").value;
        const currentProduct = products.find(function (product) {
            return product.id === productId;
        });
        if (!currentProduct) return;

        const nextStatus = currentProduct.status === "active" ? "paused" : "active";
        setProductFormLoading(true);
        const { error } = await client.from("products")
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
        await loadActiveCatalogData();
        showToast(nextStatus === "paused" ? "Produto pausado." : "Produto ativado.");
    }

    function getCatalogPayload() {
        const name = document.getElementById("catalogName").value.trim();
        const slug = slugify(document.getElementById("catalogSlug").value);
        const isActive = document.getElementById("catalogActive").checked;
        const whatsapp = normalizeWhatsapp(document.getElementById("catalogWhatsapp").value);
        const ordersEnabled = document.getElementById("catalogOrdersEnabled").checked;
        const orderMessage = document.getElementById("catalogOrderMessage").value.trim();

        if (name.length < 2 || name.length > 100 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            setFeedback(catalogFeedback, "Informe um nome e um identificador válido com letras minúsculas, números e hífens.", "error");
            return null;
        }
        if (whatsapp && !/^[1-9][0-9]{9,14}$/.test(whatsapp)) {
            setFeedback(catalogFeedback, "Informe um WhatsApp válido com DDI, DDD e número.", "error");
            return null;
        }
        if (ordersEnabled && !whatsapp) {
            setFeedback(catalogFeedback, "Informe o número do WhatsApp antes de ativar os pedidos.", "error");
            return null;
        }
        if (orderMessage.length < 10 || orderMessage.length > 300) {
            setFeedback(catalogFeedback, "A instrução ao cliente precisa ter entre 10 e 300 caracteres.", "error");
            return null;
        }
        return {
            name: name,
            slug: slug,
            is_active: isActive,
            whatsapp_number: whatsapp || null,
            orders_enabled: ordersEnabled,
            order_message: orderMessage
        };
    }

    async function saveCatalog(event) {
        event.preventDefault();
        const payload = getCatalogPayload();
        if (!payload) return;

        const catalogId = document.getElementById("catalogId").value;
        setCatalogFormLoading(true);
        setFeedback(catalogFeedback, "", "");
        let result;
        if (catalogId) {
            result = await client.from("catalogs").update(payload).eq("id", catalogId).select("id").single();
        } else {
            const userResult = await client.auth.getUser();
            const user = userResult.data && userResult.data.user;
            if (userResult.error || !user) {
                setFeedback(catalogFeedback, "Não foi possível confirmar a conta conectada. Entre novamente.", "error");
                setCatalogFormLoading(false);
                return;
            }
            result = await client.from("catalogs").insert(Object.assign({}, payload, { owner_id: user.id })).select("id").single();
        }

        if (result.error) {
            console.error("Erro ao salvar catálogo", result.error);
            setFeedback(catalogFeedback, result.error.code === "23505"
                ? "Este identificador já está em uso. Escolha outro."
                : "Não foi possível salvar o catálogo. Tente novamente.", "error");
            setCatalogFormLoading(false);
            return;
        }

        closeCatalogModal();
        await loadCatalogs(catalogId || result.data.id);
        showToast(catalogId ? "Catálogo atualizado com sucesso." : "Catálogo criado com sucesso.");
    }

    async function saveCategory(event) {
        event.preventDefault();
        if (!activeCatalog) return;

        const name = document.getElementById("categoryName").value.trim();
        const categoryId = document.getElementById("categoryId").value;
        if (name.length < 2 || name.length > 80) {
            setFeedback(categoryFeedback, "O nome da categoria precisa ter entre 2 e 80 caracteres.", "error");
            return;
        }

        setCategoryFormLoading(true);
        setFeedback(categoryFeedback, "", "");
        let result;
        if (categoryId) {
            result = await client.from("categories").update({ name: name }).eq("id", categoryId).select("id").single();
        } else {
            result = await client.from("categories").insert({
                catalog_id: activeCatalog.id,
                name: name,
                sort_order: getNextSortOrder(categories)
            }).select("id").single();
        }

        if (result.error) {
            console.error("Erro ao salvar categoria", result.error);
            setFeedback(categoryFeedback, result.error.code === "23505"
                ? "Já existe uma categoria com este nome neste catálogo."
                : "Não foi possível salvar a categoria. Tente novamente.", "error");
            setCategoryFormLoading(false);
            return;
        }

        resetCategoryForm();
        await loadActiveCatalogData();
        setFeedback(categoryFeedback, categoryId ? "Categoria atualizada." : "Categoria adicionada.", "success");
    }

    async function deletePendingItem() {
        if (!pendingDeletion) return;
        const deletion = pendingDeletion;
        confirmDeleteButton.disabled = true;
        confirmDeleteButton.textContent = "Excluindo…";
        const { data, error } = await client
            .from(deletion.type === "category" ? "categories" : "products")
            .delete()
            .eq("id", deletion.id)
            .select("id")
            .maybeSingle();

        confirmDeleteButton.disabled = false;
        if (error || !data) {
            console.error("Erro ao excluir item", error);
            closeDeleteModal();
            setFeedback(deletion.type === "category" ? categoryFeedback : productFeedback, deletion.type === "category"
                ? "Não foi possível excluir a categoria. Verifique se não há produtos vinculados."
                : "Não foi possível excluir o produto. Atualize a página e tente novamente.", "error");
            return;
        }

        const imageRemovalError = deletion.type === "product" && deletion.image_path
            ? await removeStoredProductImage(deletion.image_path)
            : null;

        closeDeleteModal();
        if (deletion.type === "category") {
            resetCategoryForm();
            await loadActiveCatalogData();
            setFeedback(categoryFeedback, "Categoria excluída.", "success");
        } else {
            closeProductModal();
            await loadActiveCatalogData();
            showToast(imageRemovalError
                ? "Produto excluído, mas a imagem não pôde ser removida do armazenamento."
                : "Produto excluído com sucesso.");
        }
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
        passwordField.value = "";
        if (error || !data.session) {
            setFeedback(authFeedback, "Não foi possível entrar com esses dados.", "error");
            loginButton.disabled = false;
            loginButton.textContent = "Entrar no painel";
            return;
        }

        await showDashboard(data.user);
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

        catalogs = [];
        categories = [];
        products = [];
        activeCatalog = null;
        clearRememberedCatalog();
        passwordField.value = "";
        renderCatalogControls();
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
                detectSessionInUrl: true,
                storageKey: authStorageKey
            }
        });

        client.auth.onAuthStateChange(function (event, session) {
            if (event === "SIGNED_OUT") {
                showLogin();
            } else if (event === "SIGNED_IN" && session && session.user) {
                showDashboard(session.user);
            }
        });

        client.auth.getUser().then(function (result) {
            body.classList.remove("is-loading");
            if (!result.error && result.data.user) {
                showDashboard(result.data.user);
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
    newProductButton.addEventListener("click", function () { openProductModal(); });
    newCatalogButton.addEventListener("click", function () { openCatalogModal(); });
    editCatalogButton.addEventListener("click", function () { if (activeCatalog) openCatalogModal(activeCatalog); });
    configureOrdersButton.addEventListener("click", function () { if (activeCatalog) openCatalogModal(activeCatalog); });
    catalogSelect.addEventListener("change", function () {
        activeCatalog = catalogs.find(function (catalog) { return catalog.id === catalogSelect.value; }) || null;
        if (!activeCatalog) return;
        rememberActiveCatalog(activeCatalog.id);
        renderCatalogControls();
        loadActiveCatalogData(++loadSequence);
    });
    manageCategoriesButton.addEventListener("click", openCategoryModal);
    document.getElementById("categoriesMenuLink").addEventListener("click", function (event) {
        event.preventDefault();
        toggleMenu(false);
        openCategoryModal();
    });
    document.getElementById("ordersMenuLink").addEventListener("click", function () { toggleMenu(false); });
    productForm.addEventListener("submit", saveProduct);
    catalogForm.addEventListener("submit", saveCatalog);
    categoryForm.addEventListener("submit", saveCategory);
    productDescription.addEventListener("input", updateDescriptionCounter);
    productImageInput.addEventListener("change", previewSelectedProductImage);
    productImagePreviewImage.addEventListener("error", function () {
        productImagePreviewImage.hidden = true;
        productImagePreviewFallback.hidden = false;
    });
    removeProductImage.addEventListener("change", function () {
        if (!removeProductImage.checked) {
            const productId = document.getElementById("productId").value;
            const product = products.find(function (item) { return item.id === productId; });
            showProductImagePreview(product ? getProductImageUrl(product.image_path) : "", product ? product.name : "N");
            return;
        }
        productImageInput.value = "";
        clearProductImageObjectUrl();
        showProductImagePreview("", document.getElementById("productName").value || "N");
    });
    document.getElementById("catalogName").addEventListener("input", function () {
        const slugInput = document.getElementById("catalogSlug");
        if (!slugInput.dataset.touched) slugInput.value = slugify(this.value);
    });
    document.getElementById("catalogSlug").addEventListener("input", function () { this.dataset.touched = "true"; });
    document.getElementById("closeProductModal").addEventListener("click", closeProductModal);
    document.getElementById("closeCatalogModal").addEventListener("click", closeCatalogModal);
    document.getElementById("closeCategoryModal").addEventListener("click", closeCategoryModal);
    toggleStatusButton.addEventListener("click", toggleProductStatus);
    deleteProductButton.addEventListener("click", function () {
        const productId = document.getElementById("productId").value;
        const product = products.find(function (item) { return item.id === productId; });
        if (product) openDeleteModal({
            type: "product",
            id: product.id,
            name: product.name,
            image_path: product.image_path,
            baseModal: productModal
        });
    });
    document.getElementById("closeDeleteModal").addEventListener("click", closeDeleteModal);
    document.getElementById("cancelDeleteButton").addEventListener("click", closeDeleteModal);
    confirmDeleteButton.addEventListener("click", deletePendingItem);
    [productModal, catalogModal, categoryModal].forEach(function (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target !== modal) return;
            if (modal === productModal) closeProductModal();
            if (modal === catalogModal) closeCatalogModal();
            if (modal === categoryModal) closeCategoryModal();
        });
    });
    deleteModal.addEventListener("click", function (event) { if (event.target === deleteModal) closeDeleteModal(); });
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
    themeButton.addEventListener("click", function () { setTheme(root.dataset.theme === "dark" ? "light" : "dark"); });
    menuButton.addEventListener("click", function () { toggleMenu(); });
    mobileOverlay.addEventListener("click", function () { toggleMenu(false); });
    window.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        if (!deleteModal.hidden) {
            closeDeleteModal();
        } else if (!productModal.hidden) {
            closeProductModal();
        } else if (!catalogModal.hidden) {
            closeCatalogModal();
        } else if (!categoryModal.hidden) {
            closeCategoryModal();
        } else {
            toggleMenu(false);
        }
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
