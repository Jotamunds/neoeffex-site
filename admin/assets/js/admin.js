(function () {
    "use strict";

    const config = window.NEOEFFEX_SUPABASE_CONFIG || {};
    const storageKey = "neoeffex-admin-theme";
    const authStorageKey = "neoeffex-admin-auth";
    const authSyncStorageKey = "neoeffex-admin-auth-sync";
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
    const editCatalogButton = document.getElementById("editCatalogButton");
    const viewCatalogLink = document.getElementById("viewCatalogLink");
    const catalogSelect = document.getElementById("catalogSelect");
    const activeCatalogName = document.getElementById("activeCatalogName");
    const manageCategoriesButton = document.getElementById("manageCategoriesButton");
    const configureOrdersButton = document.getElementById("configureOrdersButton");
    const settingsMenuLink = document.getElementById("settingsMenuLink") || document.getElementById("categoriesMenuLink");
    const menuSettingsCount = document.getElementById("menuSettingsCount") || document.getElementById("menuCategoryCount");
    const productModal = document.getElementById("productModal");
    const catalogModal = document.getElementById("catalogModal");
    const deleteModal = document.getElementById("deleteModal");
    const productForm = document.getElementById("productForm");
    const catalogForm = document.getElementById("catalogForm");
    const productFeedback = document.getElementById("productFeedback");
    const catalogFeedback = document.getElementById("catalogFeedback");
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
    const toggleStatusButton = document.getElementById("toggleStatusButton");
    const deleteProductButton = document.getElementById("deleteProductButton");
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    const settingsCatalogName = document.getElementById("settingsCatalogName");
    const categoriesTabButton = document.getElementById("categoriesTabButton");
    const subcategoriesTabButton = document.getElementById("subcategoriesTabButton");
    const typesTabButton = document.getElementById("typesTabButton");
    const groupsTabButton = document.getElementById("groupsTabButton");
    const categoriesTabPanel = document.getElementById("categoriesTabPanel");
    const subcategoriesTabPanel = document.getElementById("subcategoriesTabPanel");
    const typesTabPanel = document.getElementById("typesTabPanel");
    const groupsTabPanel = document.getElementById("groupsTabPanel");
    const categoriesTabCount = document.getElementById("categoriesTabCount");
    const subcategoriesTabCount = document.getElementById("subcategoriesTabCount");
    const typesTabCount = document.getElementById("typesTabCount");
    const groupsTabCount = document.getElementById("groupsTabCount");
    const newRootCategoryButton = document.getElementById("newRootCategoryButton");
    const rootCategoryForm = document.getElementById("rootCategoryForm");
    const rootCategoryId = document.getElementById("rootCategoryId");
    const rootCategoryName = document.getElementById("rootCategoryName");
    const rootCategoryOrder = document.getElementById("rootCategoryOrder");
    const rootCategoryFeedback = document.getElementById("rootCategoryFeedback");
    const cancelRootCategoryButton = document.getElementById("cancelRootCategoryButton");
    const saveRootCategoryButton = document.getElementById("saveRootCategoryButton");
    const rootCategoryList = document.getElementById("rootCategoryList");
    const emptyRootCategoryState = document.getElementById("emptyRootCategoryState");
    const newSubcategoryButton = document.getElementById("newSubcategoryButton");
    const subcategoryForm = document.getElementById("subcategoryForm");
    const subcategoryId = document.getElementById("subcategoryId");
    const subcategoryName = document.getElementById("subcategoryName");
    const subcategoryParent = document.getElementById("subcategoryParent");
    const subcategoryOrder = document.getElementById("subcategoryOrder");
    const subcategoryFeedback = document.getElementById("subcategoryFeedback");
    const cancelSubcategoryButton = document.getElementById("cancelSubcategoryButton");
    const saveSubcategoryButton = document.getElementById("saveSubcategoryButton");
    const subcategoryList = document.getElementById("subcategoryList");
    const emptySubcategoryState = document.getElementById("emptySubcategoryState");
    const newProductTypeButton = document.getElementById("newProductTypeButton");
    const productTypeForm = document.getElementById("productTypeForm");
    const productTypeId = document.getElementById("productTypeId");
    const productTypeName = document.getElementById("productTypeName");
    const productTypeOrder = document.getElementById("productTypeOrder");
    const productTypeFeedback = document.getElementById("productTypeFeedback");
    const cancelProductTypeButton = document.getElementById("cancelProductTypeButton");
    const saveProductTypeButton = document.getElementById("saveProductTypeButton");
    const productTypeList = document.getElementById("productTypeList");
    const emptyProductTypeState = document.getElementById("emptyProductTypeState");
    const newProductGroupButton = document.getElementById("newProductGroupButton");
    const productGroupForm = document.getElementById("productGroupForm");
    const productGroupId = document.getElementById("productGroupId");
    const productGroupName = document.getElementById("productGroupName");
    const productGroupOrder = document.getElementById("productGroupOrder");
    const productGroupFeedback = document.getElementById("productGroupFeedback");
    const cancelProductGroupButton = document.getElementById("cancelProductGroupButton");
    const saveProductGroupButton = document.getElementById("saveProductGroupButton");
    const productGroupList = document.getElementById("productGroupList");
    const emptyProductGroupState = document.getElementById("emptyProductGroupState");
    const organization = window.NEOEFFEX_ORGANIZATION;
    let organizationEnabled = false;
    let client = null;
    let catalogs = [];
    let categories = [];
    let productTypes = [];
    let productGroups = [];
    let products = [];
    let activeCatalog = null;
    let pendingDeletion = null;
    let toastTimeout;
    let lastFocusedElement = null;
    let loadSequence = 0;
    let productImageObjectUrl = null;
    let authenticatedUserId = null;
    const productImagesBucket = "catalog-products";
    const catalogIdentitiesBucket = "catalog-identities";
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

    function notifyAuthTabs(action) {
        try {
            window.localStorage.setItem(authSyncStorageKey, JSON.stringify({
                action: action,
                timestamp: Date.now(),
                nonce: Math.random().toString(36).slice(2)
            }));
        } catch (error) {
            // A sessão local continua funcionando se o navegador bloquear armazenamento local.
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

    function sanitizeSlugDraft(value) {
        return String(value || "")
            .toLocaleLowerCase("pt-BR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+/g, "")
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
        return organization.categoryLabel(categories, categoryId);
    }

    function getFilteredProducts() {
        const search = searchField.value.trim().toLocaleLowerCase("pt-BR");
        const status = statusFilter.value;

        return products.filter(function (product) {
            const searchableText = [product.name, product.categoryName, product.description, product.product_type, (product.product_groups || []).join(" ")]
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
            tableDescription.textContent = catalogs.length === 0
                ? "Nenhuma loja vinculada a esta conta. Entre em contato com a Neoeffex para concluir a configuração."
                : "Nenhuma loja selecionada.";
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
        if (menuSettingsCount) menuSettingsCount.textContent = categories.length + productTypes.length + productGroups.length;
        const legacyMenuCatCount = document.getElementById("menuCategoryCount");
        if (legacyMenuCatCount) legacyMenuCatCount.textContent = categories.length;
        newProductButton.disabled = !activeCatalog;
        if (manageCategoriesButton) manageCategoriesButton.disabled = !activeCatalog;
    }

    function renderCatalogControls() {
        catalogSelect.replaceChildren();
        const selectContainer = catalogSelect.closest(".catalog-select-field") || catalogSelect;

        if (!catalogs.length) {
            activeCatalog = null;
            selectContainer.hidden = true;
            catalogSelect.disabled = true;
            editCatalogButton.disabled = true;
            newProductButton.disabled = true;
            manageCategoriesButton.disabled = true;
            configureOrdersButton.disabled = true;
            activeCatalogName.textContent = "Nenhuma loja vinculada a esta conta. Entre em contato com a Neoeffex para concluir a configuração.";
            viewCatalogLink.removeAttribute("href");
            viewCatalogLink.classList.add("is-disabled");
            viewCatalogLink.setAttribute("aria-disabled", "true");
            viewCatalogLink.setAttribute("tabindex", "-1");
            viewCatalogLink.title = "Nenhuma loja vinculada";
            renderOrdersSummary();
            renderSettingsSection();
            return;
        }

        if (catalogs.length === 1) {
            activeCatalog = catalogs[0];
            selectContainer.hidden = true;
            catalogSelect.disabled = true;
            catalogSelect.appendChild(new Option(catalogs[0].name, catalogs[0].id));
        } else {
            selectContainer.hidden = false;
            catalogSelect.hidden = false;
            catalogSelect.disabled = false;
            catalogs.forEach(function (catalog) {
                const option = new Option(catalog.name + (catalog.is_active ? "" : " — pausado"), catalog.id);
                option.selected = activeCatalog && catalog.id === activeCatalog.id;
                catalogSelect.appendChild(option);
            });
        }

        editCatalogButton.disabled = !activeCatalog;
        newProductButton.disabled = !activeCatalog;
        manageCategoriesButton.disabled = !activeCatalog;
        configureOrdersButton.disabled = !activeCatalog;
        activeCatalogName.textContent = activeCatalog
            ? activeCatalog.name + (activeCatalog.is_active ? "" : " (pausado)")
            : "Nenhuma loja selecionada";

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
            status.textContent = "Nenhuma loja vinculada";
            status.dataset.state = "";
            whatsapp.textContent = "Não configurado";
            message.textContent = catalogs.length === 0
                ? "Nenhuma loja vinculada a esta conta. Entre em contato com a Neoeffex para concluir a configuração."
                : "Nenhuma loja selecionada.";
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
        tableDescription.textContent = "Carregando lojas…";
        products = [];
        categories = [];
        productTypes = [];
        productGroups = [];
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
        productTypes = [];
        productGroups = [];

        if (!activeCatalog) {
            renderProducts();
            updateSummary();
            renderSettingsSection();
            return;
        }

        tableDescription.textContent = "Carregando produtos…";
        renderProducts();
        updateSummary();

        const catalogId = activeCatalog.id;
        const rowsPromise = organization.loadRows(client, catalogId, false);
        const typesPromise = client.from("product_types")
            .select("id, catalog_id, name, sort_order, created_at")
            .eq("catalog_id", catalogId)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true });
        const groupsPromise = client.from("product_groups")
            .select("id, catalog_id, name, sort_order, created_at")
            .eq("catalog_id", catalogId)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true });

        const [rows, typesResult, groupsResult] = await Promise.all([rowsPromise, typesPromise, groupsPromise]);
        const categoriesResult = rows.categories;
        const productsResult = rows.products;

        if ((sequence && sequence !== loadSequence) || !activeCatalog || activeCatalog.id !== catalogId) return;

        if (categoriesResult.error || productsResult.error) {
            console.error("Erro ao carregar categorias ou produtos", categoriesResult.error || productsResult.error);
            tableDescription.textContent = "Não foi possível carregar os dados deste catálogo.";
            showToast("Execute o arquivo 003_categories_and_multi_catalogs.sql e revise as regras de acesso.");
            return;
        }

        if (typesResult.error) {
            console.error("Erro ao carregar tipos de produto", typesResult.error);
        }
        if (groupsResult.error) {
            console.error("Erro ao carregar grupos de produtos", groupsResult.error);
        }

        organizationEnabled = rows.enabled;
        document.querySelectorAll("[data-organization-field]").forEach(function (field) {
            field.disabled = !organizationEnabled;
        });
        document.getElementById("organizationNotice").hidden = organizationEnabled;
        categories = organization.orderedCategories(categoriesResult.data || []);
        productTypes = typesResult && !typesResult.error ? (typesResult.data || []) : [];
        productGroups = groupsResult && !groupsResult.error ? (groupsResult.data || []) : [];
        products = (productsResult.data || []).map(function (product) {
            return Object.assign({}, product, { categoryName: getCategoryName(product.category_id) });
        });
        renderProducts();
        updateSummary();
        renderSettingsSection();
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
        saveCatalogButton.textContent = isLoading ? "Salvando…" : "Salvar loja";
    }



    function populateProductCategories(selectedId) {
        productCategory.replaceChildren();
        productCategory.appendChild(new Option("Selecione uma categoria", ""));
        categories.forEach(function (category) {
            const option = new Option(getCategoryName(category.id), category.id);
            option.selected = category.id === selectedId;
            productCategory.appendChild(option);
        });
    }

    function openProductModal(product) {
        if (!activeCatalog) {
            showToast("Crie uma loja antes de cadastrar produtos.");
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
        document.getElementById("productType").value = editing ? product.product_type || "" : "";
        document.getElementById("productGroups").value = editing ? (product.product_groups || []).join(", ") : "";
        [["productTypeOptions", "product_type"], ["productGroupOptions", "product_groups"]].forEach(function (entry) {
            const list = document.getElementById(entry[0]);
            list.replaceChildren();
            organization.facets(products, entry[1]).forEach(function (value) { list.appendChild(new Option(value, value)); });
        });
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
        if (!catalog || !catalog.id) return;

        lastFocusedElement = document.activeElement;
        catalogForm.reset();
        setFeedback(catalogFeedback, "", "");
        catalogModal.hidden = false;
        catalogModal.setAttribute("aria-hidden", "false");
        body.classList.add("has-modal");

        document.getElementById("catalogModalTitle").textContent = "Editar loja";
        document.getElementById("catalogModalDescription").textContent = "Atualize os dados de identificação e o status deste catálogo.";
        document.getElementById("catalogId").value = catalog.id;
        document.getElementById("catalogName").value = catalog.name || "";
        document.getElementById("catalogSlug").value = catalog.slug || "";
        document.getElementById("catalogSlug").dataset.touched = "";
        document.getElementById("catalogActive").checked = Boolean(catalog.is_active);
        document.getElementById("catalogWhatsapp").value = catalog.whatsapp_number || "";
        document.getElementById("catalogOrderMessage").value = catalog.order_message
            || "Confirme disponibilidade, prazo e forma de pagamento pelo WhatsApp.";
        document.getElementById("catalogOrdersEnabled").checked = Boolean(catalog.orders_enabled);
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

    function switchSettingsTab(tabName) {
        const isCategories = tabName === "categories";
        const isSubcategories = tabName === "subcategories";
        const isTypes = tabName === "types";
        const isGroups = tabName === "groups";

        categoriesTabButton.classList.toggle("settings-tab--active", isCategories);
        categoriesTabButton.setAttribute("aria-selected", String(isCategories));
        categoriesTabPanel.hidden = !isCategories;

        subcategoriesTabButton.classList.toggle("settings-tab--active", isSubcategories);
        subcategoriesTabButton.setAttribute("aria-selected", String(isSubcategories));
        subcategoriesTabPanel.hidden = !isSubcategories;

        typesTabButton.classList.toggle("settings-tab--active", isTypes);
        typesTabButton.setAttribute("aria-selected", String(isTypes));
        typesTabPanel.hidden = !isTypes;

        groupsTabButton.classList.toggle("settings-tab--active", isGroups);
        groupsTabButton.setAttribute("aria-selected", String(isGroups));
        groupsTabPanel.hidden = !isGroups;
    }

    function getNextSortOrder(items) {
        if (!items || !items.length) return 0;
        const max = Math.max.apply(null, items.map(function (item) { return Number(item.sort_order) || 0; }));
        return max >= 0 ? max + 1 : 0;
    }

    function renderSettingsSection() {
        if (!settingsCatalogName) return;

        if (!activeCatalog) {
            settingsCatalogName.textContent = "Nenhuma loja vinculada";
            newRootCategoryButton.disabled = true;
            newSubcategoryButton.disabled = true;
            newProductTypeButton.disabled = true;
            newProductGroupButton.disabled = true;
            rootCategoryForm.hidden = true;
            subcategoryForm.hidden = true;
            productTypeForm.hidden = true;
            productGroupForm.hidden = true;
            rootCategoryList.replaceChildren();
            subcategoryList.replaceChildren();
            productTypeList.replaceChildren();
            productGroupList.replaceChildren();
            emptyRootCategoryState.hidden = false;
            emptyRootCategoryState.textContent = "Nenhuma loja vinculada a esta conta.";
            emptySubcategoryState.hidden = false;
            emptySubcategoryState.textContent = "Nenhuma loja vinculada a esta conta.";
            emptyProductTypeState.hidden = false;
            emptyProductTypeState.textContent = "Nenhuma loja vinculada a esta conta.";
            emptyProductGroupState.hidden = false;
            emptyProductGroupState.textContent = "Nenhuma loja vinculada a esta conta.";
            categoriesTabCount.textContent = "0";
            subcategoriesTabCount.textContent = "0";
            typesTabCount.textContent = "0";
            groupsTabCount.textContent = "0";
            return;
        }

        settingsCatalogName.textContent = activeCatalog.name;
        newRootCategoryButton.disabled = false;
        newSubcategoryButton.disabled = false;
        newProductTypeButton.disabled = false;
        newProductGroupButton.disabled = false;
        renderRootCategories();
        renderSubcategories();
        renderProductTypes();
        renderProductGroups();
    }

    function renderRootCategories() {
        const rootCategories = categories.filter(function (item) { return !item.parent_id; });
        categoriesTabCount.textContent = rootCategories.length;
        rootCategoryList.replaceChildren();
        emptyRootCategoryState.hidden = rootCategories.length !== 0;
        emptyRootCategoryState.textContent = "Nenhuma categoria principal cadastrada.";

        rootCategories.forEach(function (category) {
            const tr = document.createElement("tr");

            const nameTd = document.createElement("td");
            const strong = document.createElement("strong");
            strong.textContent = category.name;
            nameTd.appendChild(strong);

            const orderTd = document.createElement("td");
            orderTd.textContent = String(category.sort_order);

            const prodCount = getCategoryProductCount(category.id);
            const prodsTd = document.createElement("td");
            prodsTd.textContent = prodCount + (prodCount === 1 ? " produto" : " produtos");

            const subcats = categories.filter(function (item) { return item.parent_id === category.id; });
            const subcatsTd = document.createElement("td");
            subcatsTd.textContent = subcats.length + (subcats.length === 1 ? " subcategoria" : " subcategorias");

            const actionsTd = document.createElement("td");
            actionsTd.className = "settings-table__actions";

            const editButton = document.createElement("button");
            editButton.className = "category-action";
            editButton.type = "button";
            editButton.textContent = "Editar";
            editButton.addEventListener("click", function () {
                openRootCategoryForm(category);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "category-action category-action--danger";
            deleteButton.type = "button";
            deleteButton.textContent = "Excluir";

            const hasSubcategories = subcats.length > 0;
            const hasProducts = prodCount > 0;
            deleteButton.disabled = hasSubcategories || hasProducts;
            deleteButton.title = hasSubcategories
                ? "Esta categoria possui subcategorias. Mova ou exclua as subcategorias primeiro."
                : (hasProducts ? "Esta categoria possui produtos vinculados. Altere os produtos antes de excluir." : "Excluir categoria");

            deleteButton.addEventListener("click", function () {
                if (hasSubcategories) {
                    showToast("Esta categoria possui subcategorias. Mova ou exclua as subcategorias primeiro.");
                    return;
                }
                if (hasProducts) {
                    showToast("Esta categoria possui produtos vinculados. Altere os produtos antes de excluir.");
                    return;
                }
                openDeleteModal({ type: "category", id: category.id, name: category.name });
            });

            actionsTd.append(editButton, deleteButton);
            tr.append(nameTd, orderTd, prodsTd, subcatsTd, actionsTd);
            rootCategoryList.appendChild(tr);
        });
    }

    function renderSubcategories() {
        const rootCategories = categories.filter(function (item) { return !item.parent_id; });
        const subcategories = categories.filter(function (item) { return Boolean(item.parent_id); });
        subcategoriesTabCount.textContent = subcategories.length;
        subcategoryList.replaceChildren();
        emptySubcategoryState.hidden = subcategories.length !== 0;
        emptySubcategoryState.textContent = "Nenhuma subcategoria cadastrada.";

        subcategoryParent.replaceChildren(new Option("Selecione a categoria principal", ""));
        rootCategories.forEach(function (cat) {
            subcategoryParent.appendChild(new Option(cat.name, cat.id));
        });

        subcategories.forEach(function (subcategory) {
            const tr = document.createElement("tr");

            const nameTd = document.createElement("td");
            const strong = document.createElement("strong");
            strong.textContent = subcategory.name;
            nameTd.appendChild(strong);

            const parent = categories.find(function (item) { return item.id === subcategory.parent_id; });
            const parentTd = document.createElement("td");
            const badge = document.createElement("span");
            badge.className = "badge";
            badge.textContent = parent ? parent.name : "Indisponível";
            parentTd.appendChild(badge);

            const orderTd = document.createElement("td");
            orderTd.textContent = String(subcategory.sort_order);

            const prodCount = getCategoryProductCount(subcategory.id);
            const prodsTd = document.createElement("td");
            prodsTd.textContent = prodCount + (prodCount === 1 ? " produto" : " produtos");

            const actionsTd = document.createElement("td");
            actionsTd.className = "settings-table__actions";

            const editButton = document.createElement("button");
            editButton.className = "category-action";
            editButton.type = "button";
            editButton.textContent = "Editar";
            editButton.addEventListener("click", function () {
                openSubcategoryForm(subcategory);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "category-action category-action--danger";
            deleteButton.type = "button";
            deleteButton.textContent = "Excluir";

            const hasProducts = prodCount > 0;
            deleteButton.disabled = hasProducts;
            deleteButton.title = hasProducts
                ? "Esta subcategoria possui produtos vinculados. Altere os produtos antes de excluir."
                : "Excluir subcategoria";

            deleteButton.addEventListener("click", function () {
                if (hasProducts) {
                    showToast("Esta subcategoria possui produtos vinculados. Altere os produtos antes de excluir.");
                    return;
                }
                openDeleteModal({ type: "category", id: subcategory.id, name: subcategory.name });
            });

            actionsTd.append(editButton, deleteButton);
            tr.append(nameTd, parentTd, orderTd, prodsTd, actionsTd);
            subcategoryList.appendChild(tr);
        });
    }

    function openRootCategoryForm(category) {
        if (!activeCatalog) return;
        setFeedback(rootCategoryFeedback, "", "");
        const roots = categories.filter(function (item) { return !item.parent_id; });
        if (category) {
            document.getElementById("rootCategoryFormTitle").textContent = "Editar categoria principal";
            rootCategoryId.value = category.id;
            rootCategoryName.value = category.name;
            rootCategoryOrder.value = category.sort_order;
            saveRootCategoryButton.textContent = "Salvar alterações";
        } else {
            document.getElementById("rootCategoryFormTitle").textContent = "Nova categoria principal";
            rootCategoryId.value = "";
            rootCategoryName.value = "";
            rootCategoryOrder.value = getNextSortOrder(roots);
            saveRootCategoryButton.textContent = "Salvar categoria";
        }
        rootCategoryForm.hidden = false;
        window.setTimeout(function () { rootCategoryName.focus(); }, 0);
    }

    function closeRootCategoryForm() {
        rootCategoryForm.hidden = true;
        rootCategoryForm.reset();
        rootCategoryId.value = "";
        setFeedback(rootCategoryFeedback, "", "");
    }

    function openSubcategoryForm(subcategory) {
        if (!activeCatalog) return;
        setFeedback(subcategoryFeedback, "", "");
        const subs = categories.filter(function (item) { return Boolean(item.parent_id); });
        const roots = categories.filter(function (item) { return !item.parent_id; });

        subcategoryParent.replaceChildren(new Option("Selecione a categoria principal", ""));
        roots.forEach(function (cat) {
            subcategoryParent.appendChild(new Option(cat.name, cat.id));
        });

        if (subcategory) {
            document.getElementById("subcategoryFormTitle").textContent = "Editar subcategoria";
            subcategoryId.value = subcategory.id;
            subcategoryName.value = subcategory.name;
            subcategoryParent.value = subcategory.parent_id || "";
            subcategoryOrder.value = subcategory.sort_order;
            saveSubcategoryButton.textContent = "Salvar alterações";
        } else {
            document.getElementById("subcategoryFormTitle").textContent = "Nova subcategoria";
            subcategoryId.value = "";
            subcategoryName.value = "";
            subcategoryParent.value = roots[0] ? roots[0].id : "";
            subcategoryOrder.value = getNextSortOrder(subs);
            saveSubcategoryButton.textContent = "Salvar subcategoria";
        }
        subcategoryForm.hidden = false;
        window.setTimeout(function () { subcategoryName.focus(); }, 0);
    }

    function closeSubcategoryForm() {
        subcategoryForm.hidden = true;
        subcategoryForm.reset();
        subcategoryId.value = "";
        setFeedback(subcategoryFeedback, "", "");
    }

    async function saveRootCategory(event) {
        event.preventDefault();
        if (!activeCatalog) return;

        const name = rootCategoryName.value.trim();
        const categoryId = rootCategoryId.value;
        if (name.length < 2 || name.length > 80) {
            setFeedback(rootCategoryFeedback, "O nome da categoria precisa ter entre 2 e 80 caracteres.", "error");
            return;
        }

        const order = Number(rootCategoryOrder.value);
        if (!Number.isInteger(order) || order < 0 || order > 2147483647) {
            setFeedback(rootCategoryFeedback, "Informe uma ordem inteira a partir de zero.", "error");
            return;
        }

        saveRootCategoryButton.disabled = true;
        saveRootCategoryButton.textContent = "Salvando…";
        setFeedback(rootCategoryFeedback, "", "");

        const payload = { name: name, sort_order: order, parent_id: null };
        let result;
        if (categoryId) {
            result = await client.from("categories").update(payload).eq("id", categoryId).select("id").single();
        } else {
            result = await client.from("categories").insert(Object.assign({}, payload, { catalog_id: activeCatalog.id })).select("id").single();
        }

        saveRootCategoryButton.disabled = false;
        saveRootCategoryButton.textContent = categoryId ? "Salvar alterações" : "Salvar categoria";

        if (result.error) {
            console.error("Erro ao salvar categoria", result.error);
            setFeedback(rootCategoryFeedback, result.error.code === "23505"
                ? "Já existe uma categoria com este nome neste catálogo."
                : "Não foi possível salvar a categoria. Tente novamente.", "error");
            return;
        }

        closeRootCategoryForm();
        await loadActiveCatalogData();
        showToast(categoryId ? "Categoria atualizada com sucesso." : "Categoria adicionada com sucesso.");
    }

    async function saveSubcategory(event) {
        event.preventDefault();
        if (!activeCatalog) return;

        const name = subcategoryName.value.trim();
        const categoryId = subcategoryId.value;
        const parentId = subcategoryParent.value;

        if (name.length < 2 || name.length > 80) {
            setFeedback(subcategoryFeedback, "O nome da subcategoria precisa ter entre 2 e 80 caracteres.", "error");
            return;
        }

        if (!parentId) {
            setFeedback(subcategoryFeedback, "Selecione a categoria principal para esta subcategoria.", "error");
            return;
        }

        const parentCategory = categories.find(function (item) { return item.id === parentId; });
        if (!parentCategory || parentCategory.parent_id) {
            setFeedback(subcategoryFeedback, "Uma subcategoria só pode ser vinculada a uma categoria principal (máximo 2 níveis).", "error");
            return;
        }

        const order = Number(subcategoryOrder.value);
        if (!Number.isInteger(order) || order < 0 || order > 2147483647) {
            setFeedback(subcategoryFeedback, "Informe uma ordem inteira a partir de zero.", "error");
            return;
        }

        saveSubcategoryButton.disabled = true;
        saveSubcategoryButton.textContent = "Salvando…";
        setFeedback(subcategoryFeedback, "", "");

        const payload = { name: name, sort_order: order, parent_id: parentId };
        let result;
        if (categoryId) {
            result = await client.from("categories").update(payload).eq("id", categoryId).select("id").single();
        } else {
            result = await client.from("categories").insert(Object.assign({}, payload, { catalog_id: activeCatalog.id })).select("id").single();
        }

        saveSubcategoryButton.disabled = false;
        saveSubcategoryButton.textContent = categoryId ? "Salvar alterações" : "Salvar subcategoria";

        if (result.error) {
            console.error("Erro ao salvar subcategoria", result.error);
            setFeedback(subcategoryFeedback, result.error.code === "23505"
                ? "Já existe uma categoria com este nome neste catálogo."
                : "Não foi possível salvar a subcategoria. Tente novamente.", "error");
            return;
        }

        closeSubcategoryForm();
        await loadActiveCatalogData();
        showToast(categoryId ? "Subcategoria atualizada com sucesso." : "Subcategoria adicionada com sucesso.");
    }

    function getCategoryProductCount(categoryId) {
        return products.filter(function (product) {
            return product.category_id === categoryId;
        }).length;
    }

    function renderProductTypes() {
        typesTabCount.textContent = productTypes.length;
        productTypeList.replaceChildren();
        emptyProductTypeState.hidden = productTypes.length !== 0;
        emptyProductTypeState.textContent = "Nenhum tipo configurado.";

        productTypes.forEach(function (type) {
            const tr = document.createElement("tr");

            const nameTd = document.createElement("td");
            const strong = document.createElement("strong");
            strong.textContent = type.name;
            nameTd.appendChild(strong);

            const orderTd = document.createElement("td");
            orderTd.textContent = String(type.sort_order);

            const actionsTd = document.createElement("td");
            actionsTd.className = "settings-table__actions";

            const editButton = document.createElement("button");
            editButton.className = "category-action";
            editButton.type = "button";
            editButton.textContent = "Editar";
            editButton.addEventListener("click", function () {
                openProductTypeForm(type);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "category-action category-action--danger";
            deleteButton.type = "button";
            deleteButton.textContent = "Excluir";
            deleteButton.title = "Excluir tipo";
            deleteButton.addEventListener("click", function () {
                openDeleteModal({ type: "product_type", id: type.id, name: type.name });
            });

            actionsTd.append(editButton, deleteButton);
            tr.append(nameTd, orderTd, actionsTd);
            productTypeList.appendChild(tr);
        });
    }

    function openProductTypeForm(type) {
        if (!activeCatalog) return;
        setFeedback(productTypeFeedback, "", "");
        if (type) {
            document.getElementById("productTypeFormTitle").textContent = "Editar tipo";
            productTypeId.value = type.id;
            productTypeName.value = type.name;
            productTypeOrder.value = type.sort_order;
            saveProductTypeButton.textContent = "Salvar alterações";
        } else {
            document.getElementById("productTypeFormTitle").textContent = "Novo tipo";
            productTypeId.value = "";
            productTypeName.value = "";
            productTypeOrder.value = getNextSortOrder(productTypes);
            saveProductTypeButton.textContent = "Salvar tipo";
        }
        productTypeForm.hidden = false;
        window.setTimeout(function () { productTypeName.focus(); }, 0);
    }

    function closeProductTypeForm() {
        productTypeForm.hidden = true;
        productTypeForm.reset();
        productTypeId.value = "";
        setFeedback(productTypeFeedback, "", "");
    }

    async function saveProductType(event) {
        event.preventDefault();
        if (!activeCatalog) return;

        const name = productTypeName.value.trim();
        const typeId = productTypeId.value;

        if (name.length < 1 || name.length > 60) {
            setFeedback(productTypeFeedback, "O nome do tipo precisa ter entre 1 e 60 caracteres.", "error");
            return;
        }

        const order = Number(productTypeOrder.value);
        if (!Number.isInteger(order) || order < 0 || order > 2147483647) {
            setFeedback(productTypeFeedback, "Informe uma ordem inteira a partir de zero.", "error");
            return;
        }

        saveProductTypeButton.disabled = true;
        saveProductTypeButton.textContent = "Salvando…";
        setFeedback(productTypeFeedback, "", "");

        const payload = { name: name, sort_order: order };
        let result;
        if (typeId) {
            result = await client.from("product_types").update(payload).eq("id", typeId).select("id").single();
        } else {
            result = await client.from("product_types").insert(Object.assign({}, payload, { catalog_id: activeCatalog.id })).select("id").single();
        }

        saveProductTypeButton.disabled = false;
        saveProductTypeButton.textContent = typeId ? "Salvar alterações" : "Salvar tipo";

        if (result.error) {
            if (result.error.code !== "23505") console.error("Erro ao salvar tipo", result.error);
            setFeedback(productTypeFeedback, result.error.code === "23505"
                ? "Já existe um tipo com este nome neste catálogo."
                : "Não foi possível salvar o tipo. Tente novamente.", "error");
            return;
        }

        closeProductTypeForm();
        await loadActiveCatalogData();
        showToast(typeId ? "Tipo atualizado com sucesso." : "Tipo adicionado com sucesso.");
    }

    function renderProductGroups() {
        groupsTabCount.textContent = productGroups.length;
        productGroupList.replaceChildren();
        emptyProductGroupState.hidden = productGroups.length !== 0;
        emptyProductGroupState.textContent = "Nenhum grupo configurado.";

        productGroups.forEach(function (group) {
            const tr = document.createElement("tr");

            const nameTd = document.createElement("td");
            const strong = document.createElement("strong");
            strong.textContent = group.name;
            nameTd.appendChild(strong);

            const orderTd = document.createElement("td");
            orderTd.textContent = String(group.sort_order);

            const actionsTd = document.createElement("td");
            actionsTd.className = "settings-table__actions";

            const editButton = document.createElement("button");
            editButton.className = "category-action";
            editButton.type = "button";
            editButton.textContent = "Editar";
            editButton.addEventListener("click", function () {
                openProductGroupForm(group);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "category-action category-action--danger";
            deleteButton.type = "button";
            deleteButton.textContent = "Excluir";
            deleteButton.title = "Excluir grupo";
            deleteButton.addEventListener("click", function () {
                openDeleteModal({ type: "product_group", id: group.id, name: group.name });
            });

            actionsTd.append(editButton, deleteButton);
            tr.append(nameTd, orderTd, actionsTd);
            productGroupList.appendChild(tr);
        });
    }

    function openProductGroupForm(group) {
        if (!activeCatalog) return;
        setFeedback(productGroupFeedback, "", "");
        if (group) {
            document.getElementById("productGroupFormTitle").textContent = "Editar grupo";
            productGroupId.value = group.id;
            productGroupName.value = group.name;
            productGroupOrder.value = group.sort_order;
            saveProductGroupButton.textContent = "Salvar alterações";
        } else {
            document.getElementById("productGroupFormTitle").textContent = "Novo grupo";
            productGroupId.value = "";
            productGroupName.value = "";
            productGroupOrder.value = getNextSortOrder(productGroups);
            saveProductGroupButton.textContent = "Salvar grupo";
        }
        productGroupForm.hidden = false;
        window.setTimeout(function () { productGroupName.focus(); }, 0);
    }

    function closeProductGroupForm() {
        productGroupForm.hidden = true;
        productGroupForm.reset();
        productGroupId.value = "";
        setFeedback(productGroupFeedback, "", "");
    }

    async function saveProductGroup(event) {
        event.preventDefault();
        if (!activeCatalog) return;

        const name = productGroupName.value.trim();
        const groupId = productGroupId.value;

        if (name.length < 1 || name.length > 60) {
            setFeedback(productGroupFeedback, "O nome do grupo precisa ter entre 1 e 60 caracteres.", "error");
            return;
        }

        if (name.includes(",")) {
            setFeedback(productGroupFeedback, "O nome do grupo não pode conter vírgulas.", "error");
            return;
        }

        const order = Number(productGroupOrder.value);
        if (!Number.isInteger(order) || order < 0 || order > 2147483647) {
            setFeedback(productGroupFeedback, "Informe uma ordem inteira a partir de zero.", "error");
            return;
        }

        saveProductGroupButton.disabled = true;
        saveProductGroupButton.textContent = "Salvando…";
        setFeedback(productGroupFeedback, "", "");

        const payload = { name: name, sort_order: order };
        let result;
        if (groupId) {
            result = await client.from("product_groups").update(payload).eq("id", groupId).select("id").single();
        } else {
            result = await client.from("product_groups").insert(Object.assign({}, payload, { catalog_id: activeCatalog.id })).select("id").single();
        }

        saveProductGroupButton.disabled = false;
        saveProductGroupButton.textContent = groupId ? "Salvar alterações" : "Salvar grupo";

        if (result.error) {
            if (result.error.code !== "23505") console.error("Erro ao salvar grupo", result.error);
            setFeedback(productGroupFeedback, result.error.code === "23505"
                ? "Já existe um grupo com este nome neste catálogo."
                : "Não foi possível salvar o grupo. Tente novamente.", "error");
            return;
        }

        closeProductGroupForm();
        await loadActiveCatalogData();
        showToast(groupId ? "Grupo atualizado com sucesso." : "Grupo adicionado com sucesso.");
    }

    function openDeleteModal(deletion) {
        pendingDeletion = deletion;
        const isCategory = deletion.type === "category";
        const isCatalog = deletion.type === "catalog";
        const isProductType = deletion.type === "product_type";
        const isProductGroup = deletion.type === "product_group";
        if (deletion.baseModal) {
            deletion.baseModal.setAttribute("aria-hidden", "true");
        }
        document.getElementById("deleteModalTitle").textContent = isCatalog
            ? "Excluir loja e catálogo pausado?"
            : (isCategory
                ? "Excluir categoria?"
                : (isProductType
                    ? "Excluir tipo?"
                    : (isProductGroup
                        ? "Excluir grupo?"
                        : "Excluir produto?")));
        document.getElementById("deleteModalDescription").textContent = isCatalog
            ? "O catálogo “" + deletion.name + "”, suas categorias, produtos e imagens vinculadas serão removidos. Essa ação não poderá ser desfeita."
            : (isCategory
                ? "A categoria “" + deletion.name + "” será removida. Essa ação não poderá ser desfeita."
                : (isProductType
                    ? "O tipo “" + deletion.name + "” será removido. Essa ação não poderá ser desfeita."
                    : (isProductGroup
                        ? "O grupo “" + deletion.name + "” será removido. Essa ação não poderá ser desfeita."
                        : "O produto “" + deletion.name + "” será removido do banco de dados e não poderá ser desfeito.")));
        confirmDeleteButton.textContent = isCatalog
            ? "Excluir catálogo"
            : (isCategory
                ? "Excluir categoria"
                : (isProductType
                    ? "Excluir tipo"
                    : (isProductGroup
                        ? "Excluir grupo"
                        : "Excluir produto")));
        deleteModal.hidden = false;
        deleteModal.setAttribute("aria-hidden", "false");
        window.setTimeout(function () {
            document.getElementById("cancelDeleteButton").focus();
        }, 0);
    }

    function closeDeleteModal() {
        deleteModal.hidden = true;
        deleteModal.setAttribute("aria-hidden", "true");
        if (pendingDeletion && pendingDeletion.baseModal && !pendingDeletion.baseModal.hidden) {
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

        const payload = { name: name, category_id: categoryId, description: description, price: price.toFixed(2), status: status };
        if (organizationEnabled) {
            const type = document.getElementById("productType").value.trim();
            const groups = organization.parseGroups(document.getElementById("productGroups").value);
            if (type.length > 60 || groups.length > 10 || groups.some(function (group) { return group.length > 60; })) {
                setFeedback(productFeedback, "Use até 60 caracteres no tipo e em cada grupo, com no máximo 10 grupos.", "error");
                return null;
            }
            payload.product_type = type || null;
            payload.product_groups = groups;
        }
        return payload;
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

        const productIdField = document.getElementById("productId");
        const productId = productIdField.value;
        const currentProduct = products.find(function (product) { return product.id === productId; }) || null;
        const imageFile = productImageInput.files && productImageInput.files[0];
        const imageValidationMessage = validateProductImage(imageFile);
        if (imageValidationMessage) {
            setFeedback(productFeedback, imageValidationMessage, "error");
            return;
        }

        setProductFormLoading(true);
        setFeedback(productFeedback, "", "");

        let uploadedImagePath = "";
        let savedProductId = productId;
        let isNewProduct = !productId;
        let createdProductRecord = false;

        try {
            if (productId) {
                if (imageFile) {
                    const uploadResult = await uploadProductImage(imageFile, productId);
                    if (uploadResult.error) {
                        console.error("Erro ao enviar imagem", uploadResult.error);
                        setFeedback(productFeedback, "Não foi possível enviar a imagem. Confirme se a migração 006 foi executada.", "error");
                        return;
                    }
                    uploadedImagePath = uploadResult.path;
                    payload.image_path = uploadedImagePath;
                } else if (removeProductImage.checked && currentProduct && currentProduct.image_path) {
                    payload.image_path = null;
                }
                const updateResult = await client.from("products").update(payload).eq("id", productId).select("id, image_path").single();
                if (updateResult.error) {
                    console.error("Erro ao salvar produto", updateResult.error);
                    if (uploadedImagePath) await removeStoredProductImage(uploadedImagePath);
                    setFeedback(productFeedback, "Não foi possível salvar o produto. Tente novamente.", "error");
                    return;
                }
            } else {
                const insertResult = await client.from("products").insert(Object.assign({}, payload, {
                    catalog_id: activeCatalog.id,
                    sort_order: getNextSortOrder(products)
                })).select("id, image_path").single();

                if (insertResult.error) {
                    console.error("Erro ao cadastrar produto", insertResult.error);
                    setFeedback(productFeedback, "Não foi possível salvar o produto. Tente novamente.", "error");
                    return;
                }
                savedProductId = insertResult.data.id;
                createdProductRecord = true;
            }

            if (isNewProduct && imageFile) {
                const uploadResult = await uploadProductImage(imageFile, savedProductId);
                if (uploadResult.error) {
                    console.error("Erro ao enviar imagem", uploadResult.error);
                    const compensationResult = await client.from("products").delete().eq("id", savedProductId);
                    if (compensationResult.error) {
                        console.error("Falha na exclusão compensatória do produto", compensationResult.error);
                        productIdField.value = savedProductId;
                        await loadActiveCatalogData();
                        setFeedback(productFeedback, "O produto foi criado, mas a imagem não pôde ser enviada. Você pode editar este produto e tentar adicionar a imagem novamente.", "error");
                        return;
                    }
                    setFeedback(productFeedback, "Não foi possível enviar a imagem. O produto não foi criado; confirme se a migração 006 foi executada.", "error");
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
                    const cleanupError = await removeStoredProductImage(uploadedImagePath);
                    if (cleanupError) console.error("Falha ao remover imagem órfã", cleanupError);

                    const compensationResult = await client.from("products").delete().eq("id", savedProductId);
                    if (compensationResult.error) {
                        console.error("Falha na exclusão compensatória após erro de vinculação", compensationResult.error);
                        productIdField.value = savedProductId;
                        await loadActiveCatalogData();
                        setFeedback(productFeedback, "O produto foi criado, mas a imagem não pôde ser vinculada. Tente salvar novamente para concluir a vinculação.", "error");
                        return;
                    }
                    setFeedback(productFeedback, "Não foi possível vincular a imagem. O produto não foi criado.", "error");
                    return;
                }
            }

            let imageCleanupFailed = false;
            const previousImagePath = currentProduct && currentProduct.image_path;
            if (previousImagePath && (uploadedImagePath || removeProductImage.checked)) {
                imageCleanupFailed = Boolean(await removeStoredProductImage(previousImagePath));
            }

            closeProductModal();
            await loadActiveCatalogData();
            showToast(imageCleanupFailed
                ? "Produto salvo, mas a imagem anterior não pôde ser removida do armazenamento."
                : (productId ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso."));
        } catch (unexpectedError) {
            console.error("Erro inesperado ao salvar produto", unexpectedError);
            if (createdProductRecord && savedProductId) {
                productIdField.value = savedProductId;
                await loadActiveCatalogData();
                setFeedback(productFeedback, "Ocorreu uma falha inesperada. O produto foi salvo; você pode continuar editando-o.", "error");
            } else {
                setFeedback(productFeedback, "Ocorreu um erro inesperado. Tente novamente.", "error");
            }
        } finally {
            setProductFormLoading(false);
        }
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
        if (!catalogId) {
            setFeedback(catalogFeedback, "Não é possível salvar: nenhuma loja selecionada para edição.", "error");
            return;
        }

        setCatalogFormLoading(true);
        setFeedback(catalogFeedback, "", "");
        const result = await client.from("catalogs").update(payload).eq("id", catalogId).select("id").single();

        if (result.error) {
            console.error("Erro ao salvar catálogo", result.error);
            setFeedback(catalogFeedback, result.error.code === "23505"
                ? "Este identificador já está em uso. Escolha outro."
                : "Não foi possível salvar o catálogo. Tente novamente.", "error");
            setCatalogFormLoading(false);
            return;
        }

        closeCatalogModal();
        await loadCatalogs(catalogId);
        showToast("Loja atualizada com sucesso.");
    }



    async function removeStoredFiles(bucket, paths) {
        const candidates = Array.isArray(paths) ? paths : [paths];
        const uniquePaths = Array.from(new Set(candidates.filter(function (path) {
            return typeof path === "string" && path;
        })));
        let firstError = null;

        for (let index = 0; index < uniquePaths.length; index += 1000) {
            const result = await client.storage.from(bucket).remove(uniquePaths.slice(index, index + 1000));
            if (result.error && !firstError) firstError = result.error;
        }
        return firstError;
    }

    async function deletePendingItem() {
        if (!pendingDeletion) return;
        const deletion = pendingDeletion;
        confirmDeleteButton.disabled = true;
        confirmDeleteButton.textContent = "Excluindo…";

        if (deletion.type === "catalog") {
            const result = await client.rpc("delete_own_paused_catalog", {
                catalog_id_to_delete: deletion.id
            });

            confirmDeleteButton.disabled = false;
            if (result.error || !result.data) {
                console.error("Erro ao excluir catálogo pausado", result.error);
                closeDeleteModal();
                setFeedback(catalogFeedback, result.error && result.error.message && result.error.message.includes("pausado")
                    ? "Somente um catálogo pausado pode ser excluído. Atualize a página e tente novamente."
                    : "Não foi possível excluir o catálogo. Confirme se a migration 010 foi aplicada.", "error");
                return;
            }

            const storageErrors = await Promise.all([
                removeStoredFiles(productImagesBucket, result.data.product_image_paths),
                removeStoredFiles(catalogIdentitiesBucket, [result.data.logo_path])
            ]);
            const storageCleanupFailed = storageErrors.some(Boolean);

            closeDeleteModal();
            closeCatalogModal();
            catalogs = [];
            categories = [];
            productTypes = [];
            productGroups = [];
            products = [];
            activeCatalog = null;
            clearRememberedCatalog();
            await loadCatalogs();
            showToast(storageCleanupFailed
                ? "Catálogo excluído, mas algum arquivo não pôde ser removido do armazenamento."
                : "Loja e catálogo excluídos com sucesso.");
            return;
        }

        if (deletion.type === "product_type" || deletion.type === "product_group") {
            const isType = deletion.type === "product_type";
            const table = isType ? "product_types" : "product_groups";
            const label = isType ? "tipo" : "grupo";
            const { data, error } = await client
                .from(table)
                .delete()
                .eq("id", deletion.id)
                .select("id")
                .maybeSingle();

            confirmDeleteButton.disabled = false;
            if (error || !data) {
                console.error("Erro ao excluir " + label, error);
                closeDeleteModal();
                showToast("Não foi possível excluir o " + label + ". Tente novamente.");
                return;
            }

            closeDeleteModal();
            await loadActiveCatalogData();
            showToast(isType ? "Tipo excluído com sucesso." : "Grupo excluído com sucesso.");
            return;
        }

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
            await loadActiveCatalogData();
            showToast("Categoria excluída com sucesso.");
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

        notifyAuthTabs("signed-in");
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
        notifyAuthTabs("signed-out");
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
        window.NEOEFFEX_SUPABASE_CLIENT = client;
        window.dispatchEvent(new CustomEvent("neoeffex:client-ready", { detail: client }));

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
    editCatalogButton.addEventListener("click", function () { if (activeCatalog) openCatalogModal(activeCatalog); });
    configureOrdersButton.addEventListener("click", function () { if (activeCatalog) openCatalogModal(activeCatalog); });
    catalogSelect.addEventListener("change", function () {
        activeCatalog = catalogs.find(function (catalog) { return catalog.id === catalogSelect.value; }) || null;
        if (!activeCatalog) return;
        closeRootCategoryForm();
        closeSubcategoryForm();
        closeProductTypeForm();
        closeProductGroupForm();
        rememberActiveCatalog(activeCatalog.id);
        renderCatalogControls();
        loadActiveCatalogData(++loadSequence);
    });

    if (manageCategoriesButton) {
        manageCategoriesButton.addEventListener("click", function () {
            const section = document.getElementById("configuracoes");
            if (section && typeof section.scrollIntoView === "function") {
                section.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    if (settingsMenuLink) {
        settingsMenuLink.addEventListener("click", function () {
            toggleMenu(false);
        });
    }

    categoriesTabButton.addEventListener("click", function () { switchSettingsTab("categories"); });
    subcategoriesTabButton.addEventListener("click", function () { switchSettingsTab("subcategories"); });
    typesTabButton.addEventListener("click", function () { switchSettingsTab("types"); });
    groupsTabButton.addEventListener("click", function () { switchSettingsTab("groups"); });
    newRootCategoryButton.addEventListener("click", function () { openRootCategoryForm(null); });
    cancelRootCategoryButton.addEventListener("click", closeRootCategoryForm);
    rootCategoryForm.addEventListener("submit", saveRootCategory);
    newSubcategoryButton.addEventListener("click", function () { openSubcategoryForm(null); });
    cancelSubcategoryButton.addEventListener("click", closeSubcategoryForm);
    subcategoryForm.addEventListener("submit", saveSubcategory);
    newProductTypeButton.addEventListener("click", function () { openProductTypeForm(null); });
    cancelProductTypeButton.addEventListener("click", closeProductTypeForm);
    productTypeForm.addEventListener("submit", saveProductType);
    newProductGroupButton.addEventListener("click", function () { openProductGroupForm(null); });
    cancelProductGroupButton.addEventListener("click", closeProductGroupForm);
    productGroupForm.addEventListener("submit", saveProductGroup);

    document.getElementById("ordersMenuLink").addEventListener("click", function () { toggleMenu(false); });
    productForm.addEventListener("submit", saveProduct);
    catalogForm.addEventListener("submit", saveCatalog);
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
    document.getElementById("catalogSlug").addEventListener("input", function () {
        this.dataset.touched = "true";
        this.value = sanitizeSlugDraft(this.value);
    });
    document.getElementById("catalogSlug").addEventListener("blur", function () {
        this.value = slugify(this.value);
    });
    document.getElementById("closeProductModal").addEventListener("click", closeProductModal);
    document.getElementById("closeCatalogModal").addEventListener("click", closeCatalogModal);
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
    function dismissOnBackdropPointer(modal, closeModal) {
        let startedOnBackdrop = false;

        modal.addEventListener("pointerdown", function (event) {
            startedOnBackdrop = event.button === 0 && event.target === modal;
        });
        modal.addEventListener("pointerup", function (event) {
            const shouldClose = startedOnBackdrop && event.button === 0 && event.target === modal;
            startedOnBackdrop = false;
            if (shouldClose) closeModal();
        });
        modal.addEventListener("pointercancel", function () {
            startedOnBackdrop = false;
        });
    }

    dismissOnBackdropPointer(productModal, closeProductModal);
    dismissOnBackdropPointer(catalogModal, closeCatalogModal);
    dismissOnBackdropPointer(deleteModal, closeDeleteModal);
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
    window.addEventListener("storage", function (event) {
        if (event.key === authSyncStorageKey && event.newValue) window.location.reload();
    });
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

