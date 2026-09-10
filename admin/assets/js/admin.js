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
    const productSubcategory = document.getElementById("productSubcategory");
    const productType = document.getElementById("productType");
    const productTypeHint = document.getElementById("productTypeHint");
    const productTypeLegacyWarning = document.getElementById("productTypeLegacyWarning");
    const productGroupsContainer = document.getElementById("productGroupsContainer");
    const productGroupsEmptyHint = document.getElementById("productGroupsEmptyHint");
    const productGroupsLegacyWarning = document.getElementById("productGroupsLegacyWarning");
    const productImageInput = document.getElementById("productImage");
    const productImagePreviewImage = document.getElementById("productImagePreviewImage");
    const productImagePreviewFallback = document.getElementById("productImagePreviewFallback");
    const removeProductImage = document.getElementById("removeProductImage");
    const removeProductImageField = document.getElementById("removeProductImageField");
    const productDangerActions = document.getElementById("productDangerActions");
    const saveProductButton = document.getElementById("saveProductButton");
    const saveCatalogButton = document.getElementById("saveCatalogButton");
    const catalogProfile = document.getElementById("catalogProfile");
    const catalogMinimumOrder = document.getElementById("catalogMinimumOrder");
    const catalogProfileFeatures = document.getElementById("catalogProfileFeatures");
    const ordersProfile = document.getElementById("ordersProfile");
    const ordersMinimum = document.getElementById("ordersMinimum");
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
    const flavorsTabButton = document.getElementById("flavorsTabButton");
    const flavorsTabCount = document.getElementById("flavorsTabCount");
    const flavorsTabPanel = document.getElementById("flavorsTabPanel");
    const newFlavorButton = document.getElementById("newFlavorButton");
    const flavorForm = document.getElementById("flavorForm");
    const flavorFormTitle = document.getElementById("flavorFormTitle");
    const flavorId = document.getElementById("flavorId");
    const flavorName = document.getElementById("flavorName");
    const flavorOrder = document.getElementById("flavorOrder");
    const flavorStatus = document.getElementById("flavorStatus");
    const flavorDescription = document.getElementById("flavorDescription");
    const flavorImageInput = document.getElementById("flavorImage");
    const flavorImagePreviewImage = document.getElementById("flavorImagePreviewImage");
    const flavorImagePreviewFallback = document.getElementById("flavorImagePreviewFallback");
    const removeFlavorImage = document.getElementById("removeFlavorImage");
    const removeFlavorImageField = document.getElementById("removeFlavorImageField");
    const cancelFlavorButton = document.getElementById("cancelFlavorButton");
    const saveFlavorButton = document.getElementById("saveFlavorButton");
    const flavorFeedback = document.getElementById("flavorFeedback");
    const flavorList = document.getElementById("flavorList");
    const emptyFlavorState = document.getElementById("emptyFlavorState");
    const productPurchaseMode = document.getElementById("productPurchaseMode");
    const productFlavorsFieldWrapper = document.getElementById("productFlavorsFieldWrapper");
    const productFlavorsFieldset = document.getElementById("productFlavorsFieldset");
    const productFlavorsEmptyMessage = document.getElementById("productFlavorsEmptyMessage");
    const productFlavorsTableWrapper = document.getElementById("productFlavorsTableWrapper");
    const productFlavorsList = document.getElementById("productFlavorsList");
    const organization = window.NEOEFFEX_ORGANIZATION;
    let organizationEnabled = false;
    let client = null;
    let catalogs = [];
    let categories = [];
    let productTypes = [];
    let productGroups = [];
    let flavors = [];
    let productFlavorsRelations = [];
    let productTypesLoadError = false;
    let productGroupsLoadError = false;
    let flavorsLoadError = false;
    let products = [];
    let activeCatalog = null;
    let pendingDeletion = null;
    let toastTimeout;
    let lastFocusedElement = null;
    let loadSequence = 0;
    let productImageObjectUrl = null;
    let flavorImageObjectUrl = null;
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
        if (product.purchase_mode === "flavor_bundle") {
            const bundleTag = document.createElement("span");
            bundleTag.className = "catalog-profile-badge catalog-profile-badge--food";
            bundleTag.style.fontSize = "10px";
            bundleTag.style.marginLeft = "6px";
            bundleTag.textContent = "Com sabores";
            productName.appendChild(bundleTag);
        }
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
            if (ordersProfile) ordersProfile.textContent = "—";
            if (ordersMinimum) ordersMinimum.textContent = "—";
            whatsapp.textContent = "Não configurado";
            message.textContent = catalogs.length === 0
                ? "Nenhuma loja vinculada a esta conta. Entre em contato com a Neoeffex para concluir a configuração."
                : "Nenhuma loja selecionada.";
            return;
        }

        const enabled = Boolean(activeCatalog.orders_enabled && activeCatalog.whatsapp_number);
        status.textContent = enabled ? "Pedidos ativados" : "Pedidos desativados";
        status.dataset.state = enabled ? "active" : "inactive";

        if (ordersProfile) {
            const profilesApi = window.NEOEFFEX_PROFILES;
            const profile = profilesApi ? profilesApi.getProfile(activeCatalog.catalog_profile) : null;
            ordersProfile.textContent = profile ? profile.label : (activeCatalog.catalog_profile || "Padrão");
        }

        if (ordersMinimum) {
            const min = Number(activeCatalog.minimum_order_quantity);
            ordersMinimum.textContent = (Number.isInteger(min) && min > 0)
                ? (min + " " + (min === 1 ? "item" : "itens"))
                : "Sem mínimo";
        }

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
        productTypesLoadError = false;
        productGroupsLoadError = false;
        renderProducts();
        updateSummary();

        let { data, error } = await client
            .from("catalogs")
            .select("id, name, slug, is_active, whatsapp_number, orders_enabled, order_message, catalog_profile, minimum_order_quantity, created_at")
            .order("created_at", { ascending: true });

        if (error && /column.*catalog_profile|column.*minimum_order_quantity/.test(error.message || "")) {
            const fallback = await client
                .from("catalogs")
                .select("id, name, slug, is_active, whatsapp_number, orders_enabled, order_message, created_at")
                .order("created_at", { ascending: true });
            data = fallback.data;
            error = fallback.error;
        }

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
        productTypesLoadError = false;
        productGroupsLoadError = false;

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
        const flavorsPromise = client.from("flavors")
            .select("id, catalog_id, name, description, image_path, is_active, sort_order, created_at")
            .eq("catalog_id", catalogId)
            .order("sort_order", { ascending: true })
            .order("name", { ascending: true });
        const productFlavorsPromise = client.from("product_flavors")
            .select("product_id, flavor_id, catalog_id, sort_order, additional_price, is_available")
            .eq("catalog_id", catalogId);

        const [rows, typesResult, groupsResult, flavorsResult, productFlavorsResult] = await Promise.all([
            rowsPromise,
            typesPromise,
            groupsPromise,
            flavorsPromise,
            productFlavorsPromise
        ]);
        const categoriesResult = rows.categories;
        const productsResult = rows.products;

        if ((sequence && sequence !== loadSequence) || !activeCatalog || activeCatalog.id !== catalogId) return;

        if (categoriesResult.error || productsResult.error) {
            console.error("Erro ao carregar categorias ou produtos", categoriesResult.error || productsResult.error);
            tableDescription.textContent = "Não foi possível carregar os dados deste catálogo.";
            showToast("Execute o arquivo 003_categories_and_multi_catalogs.sql e revise as regras de acesso.");
            return;
        }

        productTypesLoadError = Boolean(typesResult && typesResult.error);
        productGroupsLoadError = Boolean(groupsResult && groupsResult.error);
        flavorsLoadError = Boolean(flavorsResult && flavorsResult.error);

        if (productTypesLoadError) {
            console.error("Erro ao carregar tipos de produto", typesResult.error);
        }
        if (productGroupsLoadError) {
            console.error("Erro ao carregar grupos de produtos", groupsResult.error);
        }
        if (flavorsLoadError) {
            console.error("Erro ao carregar sabores do catálogo", flavorsResult.error);
        }

        organizationEnabled = rows.enabled;
        document.querySelectorAll("[data-organization-field]").forEach(function (field) {
            field.disabled = !organizationEnabled;
        });
        document.getElementById("organizationNotice").hidden = organizationEnabled;
        categories = organization.orderedCategories(categoriesResult.data || []);
        productTypes = typesResult && !typesResult.error ? (typesResult.data || []) : [];
        productGroups = groupsResult && !groupsResult.error ? (groupsResult.data || []) : [];
        flavors = flavorsResult && !flavorsResult.error ? (flavorsResult.data || []) : [];
        productFlavorsRelations = productFlavorsResult && !productFlavorsResult.error ? (productFlavorsResult.data || []) : [];
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



    function populateProductCategories(selectedRootId, selectedSubId) {
        productCategory.replaceChildren();
        productCategory.appendChild(new Option("Selecione uma categoria", ""));
        const rootCategories = categories.filter(function (category) {
            return !category.parent_id;
        });
        rootCategories.forEach(function (category) {
            const option = new Option(category.name, category.id);
            option.selected = category.id === selectedRootId;
            productCategory.appendChild(option);
        });
        populateProductSubcategories(productCategory.value, selectedSubId);
    }

    function populateProductSubcategories(rootCategoryId, selectedSubId) {
        productSubcategory.replaceChildren();
        productSubcategory.appendChild(new Option("Nenhuma subcategoria", ""));
        if (!rootCategoryId) {
            productSubcategory.disabled = true;
            return;
        }
        const subcategories = categories.filter(function (category) {
            return category.parent_id === rootCategoryId;
        });
        subcategories.forEach(function (sub) {
            const option = new Option(sub.name, sub.id);
            option.selected = sub.id === selectedSubId;
            productSubcategory.appendChild(option);
        });
        productSubcategory.disabled = false;
    }

    function populateProductTypes(selectedType) {
        productType.replaceChildren();
        productTypeLegacyWarning.hidden = true;
        productTypeLegacyWarning.textContent = "";

        if (productTypesLoadError) {
            productType.appendChild(new Option("Erro ao carregar tipos", ""));
            productType.disabled = true;
            productTypeHint.textContent = "Não foi possível carregar os tipos deste catálogo.";
            return;
        }

        if (!organizationEnabled) {
            productType.appendChild(new Option("Recurso desativado", ""));
            productType.disabled = true;
            productTypeHint.textContent = "";
            return;
        }

        productType.disabled = false;
        if (productTypes.length === 0) {
            productType.appendChild(new Option("Nenhum tipo configurado", ""));
            productTypeHint.textContent = "Gerencie os tipos em Configurações.";
        } else {
            productType.appendChild(new Option("Nenhum tipo", ""));
            productTypeHint.textContent = "Gerencie os tipos em Configurações.";
        }

        let foundSelected = false;
        productTypes.forEach(function (t) {
            const option = new Option(t.name, t.name);
            if (selectedType && organization.key(t.name) === organization.key(selectedType)) {
                option.selected = true;
                foundSelected = true;
            }
            productType.appendChild(option);
        });

        if (selectedType && !foundSelected) {
            const legacyOption = new Option(selectedType + " (não configurado)", selectedType);
            legacyOption.selected = true;
            legacyOption.dataset.legacy = "true";
            productType.appendChild(legacyOption);
            productTypeLegacyWarning.textContent = "Este produto utiliza o tipo '" + selectedType + "', que não existe mais em Configurações.";
            productTypeLegacyWarning.hidden = false;
        }
    }

    function populateProductGroups(selectedGroupNames) {
        productGroupsContainer.replaceChildren();
        productGroupsLegacyWarning.hidden = true;
        productGroupsLegacyWarning.textContent = "";

        if (productGroupsLoadError) {
            productGroupsEmptyHint.textContent = "Não foi possível carregar os grupos deste catálogo.";
            productGroupsEmptyHint.hidden = false;
            return;
        }

        if (!organizationEnabled) {
            productGroupsEmptyHint.textContent = "Recurso desativado.";
            productGroupsEmptyHint.hidden = false;
            return;
        }

        const selectedKeys = new Set((selectedGroupNames || []).map(function (g) { return organization.key(g); }));

        if (productGroups.length === 0) {
            productGroupsEmptyHint.textContent = "Nenhum grupo configurado. Configure os grupos em Configurações.";
            productGroupsEmptyHint.hidden = false;
        } else {
            productGroupsEmptyHint.hidden = true;
        }

        const configuredKeys = new Set();
        productGroups.forEach(function (g) {
            const key = organization.key(g.name);
            configuredKeys.add(key);
            const label = document.createElement("label");
            label.className = "product-group-chip";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "productGroupItem";
            checkbox.value = g.name;
            checkbox.checked = selectedKeys.has(key);
            const span = document.createElement("span");
            span.textContent = g.name;
            label.appendChild(checkbox);
            label.appendChild(span);
            productGroupsContainer.appendChild(label);
        });

        const missingGroups = (selectedGroupNames || []).filter(function (g) {
            return !configuredKeys.has(organization.key(g));
        });

        if (missingGroups.length > 0) {
            productGroupsLegacyWarning.textContent = "Este produto utiliza grupos antigos que não existem mais em Configurações: " + missingGroups.join(", ") + ".";
            productGroupsLegacyWarning.hidden = false;

            missingGroups.forEach(function (missingGroup) {
                const label = document.createElement("label");
                label.className = "product-group-chip product-group-chip--legacy";
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "productGroupItem";
                checkbox.value = missingGroup;
                checkbox.dataset.legacy = "true";
                checkbox.checked = true;
                const span = document.createElement("span");
                span.textContent = missingGroup + " (não configurado)";
                label.appendChild(checkbox);
                label.appendChild(span);
                productGroupsContainer.appendChild(label);
            });
        }
    }

    function countProductsUsingType(typeName) {
        if (!activeCatalog || !typeName) return 0;
        const targetKey = organization.key(typeName);
        return products.filter(function (p) {
            return p.catalog_id === activeCatalog.id && organization.key(p.product_type) === targetKey;
        }).length;
    }

    function countProductsUsingGroup(groupName) {
        if (!activeCatalog || !groupName) return 0;
        const targetKey = organization.key(groupName);
        return products.filter(function (p) {
            return p.catalog_id === activeCatalog.id && (p.product_groups || []).some(function (g) {
                return organization.key(g) === targetKey;
            });
        }).length;
    }

    function openProductModal(product) {
        if (!activeCatalog) {
            showToast("Crie uma loja antes de cadastrar produtos.");
            return;
        }
        const rootCategories = categories.filter(function (c) { return !c.parent_id; });
        if (!rootCategories.length) {
            showToast("Cadastre ao menos uma categoria principal antes de adicionar produtos.");
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

        let selectedRootId = "";
        let selectedSubId = "";
        if (editing && product.category_id) {
            const cat = categories.find(function (c) { return c.id === product.category_id; });
            if (cat) {
                if (cat.parent_id) {
                    selectedRootId = cat.parent_id;
                    selectedSubId = cat.id;
                } else {
                    selectedRootId = cat.id;
                    selectedSubId = "";
                }
            }
        }
        populateProductCategories(selectedRootId, selectedSubId);

        document.getElementById("productPrice").value = editing ? Number(product.price).toFixed(2) : "";
        productDescription.value = editing ? product.description || "" : "";

        populateProductTypes(editing ? product.product_type || "" : "");
        populateProductGroups(editing ? product.product_groups || [] : []);

        if (productPurchaseMode) {
            productPurchaseMode.value = editing ? (product.purchase_mode || "simple") : "simple";
        }
        syncProductPurchaseModeUI(editing ? product.id : null);

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
        if (productPurchaseMode) productPurchaseMode.value = "simple";
        if (productFlavorsFieldWrapper) productFlavorsFieldWrapper.hidden = true;
        if (productFlavorsList) productFlavorsList.replaceChildren();
        productTypeLegacyWarning.hidden = true;
        productTypeLegacyWarning.textContent = "";
        productGroupsLegacyWarning.hidden = true;
        productGroupsLegacyWarning.textContent = "";
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
    }

    function renderCatalogProfileFeatures(profileId) {
        if (!catalogProfileFeatures) return;
        const profilesApi = window.NEOEFFEX_PROFILES;
        const profile = profilesApi ? profilesApi.getProfile(profileId) : null;
        const features = profile ? profile.features : { flavors: false, minimum_order: false, addons: false, allow_purchase_mode: false };

        const items = [
            { label: "Seleção de sabores", enabled: features.flavors },
            { label: "Acréscimos por sabor", enabled: features.addons },
            { label: "Pedido mínimo", enabled: features.minimum_order },
            { label: "Modos de compra no produto", enabled: features.allow_purchase_mode }
        ];

        catalogProfileFeatures.replaceChildren();
        items.forEach(function (item) {
            const badge = document.createElement("span");
            badge.className = "profile-feature-badge " + (item.enabled ? "profile-feature-badge--active" : "profile-feature-badge--inactive");
            badge.textContent = (item.enabled ? "✓ " : "✕ ") + item.label;
            catalogProfileFeatures.appendChild(badge);
        });
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

        if (catalogProfile) {
            catalogProfile.value = catalog.catalog_profile || "standard";
            renderCatalogProfileFeatures(catalogProfile.value);
        }
        if (catalogMinimumOrder) {
            const min = Number(catalog.minimum_order_quantity);
            catalogMinimumOrder.value = (Number.isInteger(min) && min > 0) ? String(min) : "";
        }

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
        const isFlavors = tabName === "flavors";

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

        if (flavorsTabButton && flavorsTabPanel) {
            flavorsTabButton.classList.toggle("settings-tab--active", isFlavors);
            flavorsTabButton.setAttribute("aria-selected", String(isFlavors));
            flavorsTabPanel.hidden = !isFlavors;
        }
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
            if (newFlavorButton) newFlavorButton.disabled = true;
            rootCategoryForm.hidden = true;
            subcategoryForm.hidden = true;
            productTypeForm.hidden = true;
            productGroupForm.hidden = true;
            if (flavorForm) flavorForm.hidden = true;
            rootCategoryList.replaceChildren();
            subcategoryList.replaceChildren();
            productTypeList.replaceChildren();
            productGroupList.replaceChildren();
            if (flavorList) flavorList.replaceChildren();
            emptyRootCategoryState.hidden = false;
            emptyRootCategoryState.textContent = "Nenhuma loja vinculada a esta conta.";
            emptySubcategoryState.hidden = false;
            emptySubcategoryState.textContent = "Nenhuma loja vinculada a esta conta.";
            emptyProductTypeState.hidden = false;
            emptyProductTypeState.textContent = "Nenhuma loja vinculada a esta conta.";
            emptyProductGroupState.hidden = false;
            emptyProductGroupState.textContent = "Nenhuma loja vinculada a esta conta.";
            if (emptyFlavorState) {
                emptyFlavorState.hidden = false;
                emptyFlavorState.textContent = "Nenhuma loja vinculada a esta conta.";
            }
            categoriesTabCount.textContent = "0";
            subcategoriesTabCount.textContent = "0";
            typesTabCount.textContent = "0";
            groupsTabCount.textContent = "0";
            if (flavorsTabCount) flavorsTabCount.textContent = "0";
            return;
        }

        settingsCatalogName.textContent = activeCatalog.name;
        newRootCategoryButton.disabled = false;
        newSubcategoryButton.disabled = false;
        newProductTypeButton.disabled = false;
        newProductGroupButton.disabled = false;
        if (newFlavorButton) newFlavorButton.disabled = false;
        renderRootCategories();
        renderSubcategories();
        renderProductTypes();
        renderProductGroups();
        renderFlavors();
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
        emptyProductTypeState.textContent = productTypesLoadError
            ? "Não foi possível carregar os tipos. Tente novamente."
            : "Nenhum tipo configurado.";

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
            const usedCount = countProductsUsingType(type.name);
            if (usedCount > 0) {
                deleteButton.disabled = true;
                deleteButton.title = "Este tipo está sendo usado por " + usedCount + " produto" + (usedCount === 1 ? "" : "s");
            }
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
            const existingType = productTypes.find(function (t) { return t.id === typeId; });
            if (existingType && organization.key(existingType.name) !== organization.key(name)) {
                const count = countProductsUsingType(existingType.name);
                if (count > 0) {
                    saveProductTypeButton.disabled = false;
                    saveProductTypeButton.textContent = "Salvar alterações";
                    setFeedback(productTypeFeedback, "Este tipo está sendo usado por " + count + " produto" + (count === 1 ? "" : "s") + ". Altere os produtos antes de renomeá-lo.", "error");
                    return;
                }
            }
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
        emptyProductGroupState.textContent = productGroupsLoadError
            ? "Não foi possível carregar os grupos. Tente novamente."
            : "Nenhum grupo configurado.";

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
            const usedCount = countProductsUsingGroup(group.name);
            if (usedCount > 0) {
                deleteButton.disabled = true;
                deleteButton.title = "Este grupo está sendo usado por " + usedCount + " produto" + (usedCount === 1 ? "" : "s");
            }
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
            const existingGroup = productGroups.find(function (g) { return g.id === groupId; });
            if (existingGroup && organization.key(existingGroup.name) !== organization.key(name)) {
                const count = countProductsUsingGroup(existingGroup.name);
                if (count > 0) {
                    saveProductGroupButton.disabled = false;
                    saveProductGroupButton.textContent = "Salvar alterações";
                    setFeedback(productGroupFeedback, "Este grupo está sendo usado por " + count + " produto" + (count === 1 ? "" : "s") + ". Remova ou altere o grupo nos produtos antes de renomeá-lo.", "error");
                    return;
                }
            }
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

    function clearFlavorImageObjectUrl() {
        if (!flavorImageObjectUrl) return;
        URL.revokeObjectURL(flavorImageObjectUrl);
        flavorImageObjectUrl = null;
    }

    function showFlavorImagePreview(url, flavorNameText) {
        if (!flavorImagePreviewFallback || !flavorImagePreviewImage) return;
        flavorImagePreviewFallback.textContent = (flavorNameText || "S").trim().charAt(0).toLocaleUpperCase("pt-BR") || "S";
        flavorImagePreviewImage.hidden = !url;
        flavorImagePreviewFallback.hidden = Boolean(url);
        flavorImagePreviewImage.src = url || "";
        flavorImagePreviewImage.alt = url ? "Prévia de " + (flavorNameText || "sabor") : "";
    }

    function previewSelectedFlavorImage() {
        const file = flavorImageInput.files && flavorImageInput.files[0];
        const validationMessage = validateProductImage(file);
        if (validationMessage) {
            flavorImageInput.value = "";
            setFeedback(flavorFeedback, validationMessage, "error");
            return;
        }
        if (!file) return;
        clearFlavorImageObjectUrl();
        flavorImageObjectUrl = URL.createObjectURL(file);
        removeFlavorImage.checked = false;
        showFlavorImagePreview(flavorImageObjectUrl, flavorName.value || "Sabor");
        setFeedback(flavorFeedback, "", "");
    }

    function countProductsUsingFlavor(targetFlavorId) {
        return productFlavorsRelations.filter(function (r) { return r.flavor_id === targetFlavorId; }).length;
    }

    function syncProductPurchaseModeUI(productId) {
        if (!productPurchaseMode || !productFlavorsFieldWrapper) return;
        const isBundle = productPurchaseMode.value === "flavor_bundle";
        productFlavorsFieldWrapper.hidden = !isBundle;
        if (isBundle) {
            renderProductFlavorsSelection(productId);
        }
    }

    function renderProductFlavorsSelection(productId) {
        if (!productFlavorsList || !productFlavorsTableWrapper || !productFlavorsEmptyMessage) return;
        productFlavorsList.replaceChildren();

        const activeFlavors = flavors.slice().sort(function (a, b) {
            return (a.sort_order - b.sort_order) || a.name.localeCompare(b.name);
        });

        if (activeFlavors.length === 0) {
            productFlavorsTableWrapper.hidden = true;
            productFlavorsEmptyMessage.hidden = false;
            return;
        }

        productFlavorsTableWrapper.hidden = false;
        productFlavorsEmptyMessage.hidden = true;

        const currentRelations = productId
            ? productFlavorsRelations.filter(function (r) { return r.product_id === productId; })
            : [];

        activeFlavors.forEach(function (flavor) {
            const rel = currentRelations.find(function (r) { return r.flavor_id === flavor.id; });
            const isChecked = Boolean(rel);
            const sortOrder = rel ? rel.sort_order : flavor.sort_order;
            const additionalPrice = rel && rel.additional_price ? Number(rel.additional_price).toFixed(2) : "0.00";
            const isAvailable = rel ? Boolean(rel.is_available) : true;

            const tr = document.createElement("tr");
            tr.dataset.flavorId = flavor.id;

            // Ativo / Selecionado
            const checkTd = document.createElement("td");
            checkTd.style.textAlign = "center";
            const check = document.createElement("input");
            check.type = "checkbox";
            check.name = "productFlavorSelect";
            check.value = flavor.id;
            check.checked = isChecked;
            checkTd.appendChild(check);

            // Sabor
            const nameTd = document.createElement("td");
            const strong = document.createElement("strong");
            strong.textContent = flavor.name;
            nameTd.appendChild(strong);
            if (!flavor.is_active) {
                const badge = document.createElement("span");
                badge.className = "flavor-status-btn flavor-status-btn--paused";
                badge.style.marginLeft = "6px";
                badge.textContent = "Pausado";
                nameTd.appendChild(badge);
            }
            if (flavor.description) {
                const small = document.createElement("small");
                small.style.display = "block";
                small.style.color = "var(--text-muted)";
                small.textContent = flavor.description;
                nameTd.appendChild(small);
            }

            // Ordem
            const orderTd = document.createElement("td");
            const orderInput = document.createElement("input");
            orderInput.type = "number";
            orderInput.name = "productFlavorSortOrder";
            orderInput.min = "0";
            orderInput.max = "2147483647";
            orderInput.step = "1";
            orderInput.value = String(sortOrder);
            orderInput.disabled = !isChecked;
            orderTd.appendChild(orderInput);

            // Acréscimo
            const priceTd = document.createElement("td");
            const priceInput = document.createElement("input");
            priceInput.type = "number";
            priceInput.name = "productFlavorAdditionalPrice";
            priceInput.min = "0";
            priceInput.max = "999999.99";
            priceInput.step = "0.01";
            priceInput.inputMode = "decimal";
            priceInput.value = additionalPrice;
            priceInput.disabled = !isChecked;
            priceTd.appendChild(priceInput);

            // Disponível
            const availTd = document.createElement("td");
            const availLabel = document.createElement("label");
            availLabel.className = "checkbox-field checkbox-field--compact";
            const availInput = document.createElement("input");
            availInput.type = "checkbox";
            availInput.name = "productFlavorAvailable";
            availInput.checked = isAvailable;
            availInput.disabled = !isChecked;
            const availSpan = document.createElement("span");
            availSpan.textContent = "Sim";
            availLabel.append(availInput, availSpan);
            availTd.appendChild(availLabel);

            check.addEventListener("change", function () {
                orderInput.disabled = !check.checked;
                priceInput.disabled = !check.checked;
                availInput.disabled = !check.checked;
            });

            tr.append(checkTd, nameTd, orderTd, priceTd, availTd);
            productFlavorsList.appendChild(tr);
        });
    }

    function getSelectedProductFlavors(productId) {
        if (!productFlavorsList) return { data: [] };
        const rows = Array.from(productFlavorsList.querySelectorAll("tr[data-flavor-id]"));
        const selected = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const check = row.querySelector("input[name='productFlavorSelect']");
            if (!check || !check.checked) continue;
            const flavorId = row.dataset.flavorId;
            const sortOrderInput = row.querySelector("input[name='productFlavorSortOrder']");
            const priceInput = row.querySelector("input[name='productFlavorAdditionalPrice']");
            const availInput = row.querySelector("input[name='productFlavorAvailable']");

            const sortOrder = Number(sortOrderInput ? sortOrderInput.value : 0);
            const additionalPrice = Number(priceInput ? priceInput.value : 0);
            const isAvailable = availInput ? availInput.checked : true;

            if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 2147483647) {
                return { error: "A ordem dos sabores selecionados deve ser um número inteiro a partir de zero." };
            }
            if (!Number.isFinite(additionalPrice) || additionalPrice < 0 || additionalPrice > 999999.99) {
                return { error: "O acréscimo de preço dos sabores deve ser maior ou igual a zero." };
            }

            selected.push({
                product_id: productId,
                flavor_id: flavorId,
                catalog_id: activeCatalog.id,
                sort_order: sortOrder,
                additional_price: Number(additionalPrice.toFixed(2)),
                is_available: isAvailable
            });
        }
        return { data: selected };
    }

    function renderFlavors() {
        if (!flavorsTabCount || !flavorList) return;
        flavorsTabCount.textContent = String(flavors.length);
        flavorList.replaceChildren();
        emptyFlavorState.hidden = flavors.length !== 0;

        flavors.forEach(function (flavor) {
            const tr = document.createElement("tr");

            // Coluna Foto
            const photoTd = document.createElement("td");
            const thumb = document.createElement("div");
            thumb.className = "flavor-thumb";
            if (flavor.image_path) {
                const img = document.createElement("img");
                img.src = getProductImageUrl(flavor.image_path);
                img.alt = flavor.name;
                img.className = "flavor-thumb";
                img.addEventListener("error", function () {
                    thumb.textContent = flavor.name.charAt(0).toUpperCase();
                    photoTd.replaceChildren(thumb);
                });
                photoTd.appendChild(img);
            } else {
                thumb.textContent = flavor.name.charAt(0).toUpperCase();
                photoTd.appendChild(thumb);
            }

            // Coluna Nome & Descrição
            const nameTd = document.createElement("td");
            const strong = document.createElement("strong");
            strong.textContent = flavor.name;
            nameTd.appendChild(strong);
            if (flavor.description) {
                const desc = document.createElement("small");
                desc.style.display = "block";
                desc.style.color = "var(--text-muted)";
                desc.style.fontSize = "11px";
                desc.textContent = flavor.description;
                nameTd.appendChild(desc);
            }

            // Coluna Status
            const statusTd = document.createElement("td");
            const statusBadge = document.createElement("button");
            statusBadge.type = "button";
            statusBadge.className = "flavor-status-btn " + (flavor.is_active ? "flavor-status-btn--active" : "flavor-status-btn--paused");
            statusBadge.textContent = flavor.is_active ? "Ativo" : "Pausado";
            statusBadge.title = flavor.is_active ? "Clique para pausar este sabor" : "Clique para ativar este sabor";
            statusBadge.addEventListener("click", function () {
                toggleFlavorStatus(flavor);
            });
            statusTd.appendChild(statusBadge);

            // Coluna Ordem
            const orderTd = document.createElement("td");
            orderTd.textContent = String(flavor.sort_order);

            // Coluna Ações
            const actionsTd = document.createElement("td");
            actionsTd.className = "settings-table__actions";

            const editButton = document.createElement("button");
            editButton.className = "category-action";
            editButton.type = "button";
            editButton.textContent = "Editar";
            editButton.addEventListener("click", function () {
                openFlavorForm(flavor);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "category-action category-action--danger";
            deleteButton.type = "button";
            deleteButton.textContent = "Excluir";
            deleteButton.title = "Excluir sabor";
            const usedCount = countProductsUsingFlavor(flavor.id);
            if (usedCount > 0) {
                deleteButton.disabled = true;
                deleteButton.title = "Este sabor está associado a " + usedCount + " produto" + (usedCount === 1 ? "" : "s");
            }
            deleteButton.addEventListener("click", function () {
                openDeleteModal({ type: "flavor", id: flavor.id, name: flavor.name, image_path: flavor.image_path });
            });

            actionsTd.append(editButton, deleteButton);
            tr.append(photoTd, nameTd, statusTd, orderTd, actionsTd);
            flavorList.appendChild(tr);
        });
    }

    function openFlavorForm(flavor) {
        if (!activeCatalog) return;
        setFeedback(flavorFeedback, "", "");
        clearFlavorImageObjectUrl();
        if (flavor) {
            flavorFormTitle.textContent = "Editar sabor";
            flavorId.value = flavor.id;
            flavorName.value = flavor.name;
            flavorOrder.value = flavor.sort_order;
            flavorStatus.value = flavor.is_active ? "active" : "paused";
            flavorDescription.value = flavor.description || "";
            removeFlavorImageField.hidden = !flavor.image_path;
            removeFlavorImage.checked = false;
            showFlavorImagePreview(flavor.image_path ? getProductImageUrl(flavor.image_path) : "", flavor.name);
            saveFlavorButton.textContent = "Salvar alterações";
        } else {
            flavorFormTitle.textContent = "Novo sabor";
            flavorId.value = "";
            flavorName.value = "";
            flavorOrder.value = getNextSortOrder(flavors);
            flavorStatus.value = "active";
            flavorDescription.value = "";
            removeFlavorImageField.hidden = true;
            removeFlavorImage.checked = false;
            showFlavorImagePreview("", "S");
            saveFlavorButton.textContent = "Salvar sabor";
        }
        flavorImageInput.value = "";
        flavorForm.hidden = false;
        window.setTimeout(function () { flavorName.focus(); }, 0);
    }

    function closeFlavorForm() {
        flavorForm.hidden = true;
        flavorForm.reset();
        flavorId.value = "";
        clearFlavorImageObjectUrl();
        showFlavorImagePreview("", "S");
        removeFlavorImageField.hidden = true;
        setFeedback(flavorFeedback, "", "");
    }

    async function toggleFlavorStatus(flavor) {
        if (!activeCatalog || !flavor) return;
        const nextActive = !flavor.is_active;
        const result = await client.from("flavors").update({ is_active: nextActive }).eq("id", flavor.id).eq("catalog_id", activeCatalog.id);
        if (result.error) {
            console.error("Erro ao alternar status do sabor", result.error);
            showToast("Não foi possível alterar o status do sabor.");
            return;
        }
        await loadActiveCatalogData();
        showToast(nextActive ? "Sabor ativado." : "Sabor pausado.");
    }

    async function saveFlavor(event) {
        event.preventDefault();
        if (!activeCatalog) return;

        const name = flavorName.value.trim();
        const currentId = flavorId.value;
        const description = flavorDescription.value.trim();
        const isActive = flavorStatus.value === "active";

        if (name.length < 1 || name.length > 80) {
            setFeedback(flavorFeedback, "O nome do sabor precisa ter entre 1 e 80 caracteres.", "error");
            return;
        }

        if (description.length > 500) {
            setFeedback(flavorFeedback, "A descrição do sabor não pode ter mais de 500 caracteres.", "error");
            return;
        }

        const order = Number(flavorOrder.value);
        if (!Number.isInteger(order) || order < 0 || order > 2147483647) {
            setFeedback(flavorFeedback, "Informe uma ordem inteira a partir de zero.", "error");
            return;
        }

        const imageFile = flavorImageInput.files && flavorImageInput.files[0];
        const imageValidation = validateProductImage(imageFile);
        if (imageValidation) {
            setFeedback(flavorFeedback, imageValidation, "error");
            return;
        }

        saveFlavorButton.disabled = true;
        saveFlavorButton.textContent = "Salvando…";
        setFeedback(flavorFeedback, "", "");

        const payload = {
            name: name,
            description: description,
            is_active: isActive,
            sort_order: order
        };

        const existingFlavor = flavors.find(function (f) { return f.id === currentId; }) || null;
        let uploadedImagePath = "";
        let savedFlavorId = currentId;

        try {
            if (currentId) {
                if (imageFile) {
                    const uploadRes = await uploadCatalogImage(imageFile, currentId);
                    if (uploadRes.error) {
                        console.error("Erro no upload de imagem de sabor", uploadRes.error);
                        setFeedback(flavorFeedback, "Não foi possível enviar a imagem do sabor.", "error");
                        saveFlavorButton.disabled = false;
                        saveFlavorButton.textContent = "Salvar alterações";
                        return;
                    }
                    uploadedImagePath = uploadRes.path;
                    payload.image_path = uploadedImagePath;
                } else if (removeFlavorImage.checked && existingFlavor && existingFlavor.image_path) {
                    payload.image_path = null;
                }

                const updateRes = await client.from("flavors").update(payload).eq("id", currentId).eq("catalog_id", activeCatalog.id).select("id").single();
                if (updateRes.error) {
                    if (updateRes.error.code !== "23505") console.error("Erro ao atualizar sabor", updateRes.error);
                    if (uploadedImagePath) await removeStoredProductImage(uploadedImagePath);
                    setFeedback(flavorFeedback, updateRes.error.code === "23505"
                        ? "Já existe um sabor com este nome neste catálogo."
                        : "Não foi possível salvar o sabor. Tente novamente.", "error");
                    saveFlavorButton.disabled = false;
                    saveFlavorButton.textContent = "Salvar alterações";
                    return;
                }
                if (removeFlavorImage.checked && existingFlavor && existingFlavor.image_path) {
                    await removeStoredProductImage(existingFlavor.image_path);
                }
            } else {
                const insertRes = await client.from("flavors").insert(Object.assign({}, payload, {
                    catalog_id: activeCatalog.id
                })).select("id").single();

                if (insertRes.error) {
                    if (insertRes.error.code !== "23505") console.error("Erro ao inserir sabor", insertRes.error);
                    setFeedback(flavorFeedback, insertRes.error.code === "23505"
                        ? "Já existe um sabor com este nome neste catálogo."
                        : "Não foi possível salvar o sabor. Tente novamente.", "error");
                    saveFlavorButton.disabled = false;
                    saveFlavorButton.textContent = "Salvar sabor";
                    return;
                }
                savedFlavorId = insertRes.data.id;

                if (imageFile) {
                    const uploadRes = await uploadCatalogImage(imageFile, savedFlavorId);
                    if (uploadRes.error) {
                        console.error("Erro no upload de imagem de novo sabor", uploadRes.error);
                        await client.from("flavors").delete().eq("id", savedFlavorId).eq("catalog_id", activeCatalog.id);
                        setFeedback(flavorFeedback, "Não foi possível enviar a foto do sabor. Tente novamente.", "error");
                        saveFlavorButton.disabled = false;
                        saveFlavorButton.textContent = "Salvar sabor";
                        return;
                    }
                    await client.from("flavors").update({ image_path: uploadRes.path }).eq("id", savedFlavorId).eq("catalog_id", activeCatalog.id);
                }
            }

            closeFlavorForm();
            await loadActiveCatalogData();
            showToast(currentId ? "Sabor atualizado com sucesso." : "Sabor cadastrado com sucesso.");
        } catch (err) {
            console.error("Exceção ao salvar sabor", err);
            setFeedback(flavorFeedback, "Ocorreu um erro ao salvar o sabor.", "error");
            saveFlavorButton.disabled = false;
            saveFlavorButton.textContent = currentId ? "Salvar alterações" : "Salvar sabor";
        }
    }

    function openDeleteModal(deletion) {
        pendingDeletion = deletion;
        const isCategory = deletion.type === "category";
        const isCatalog = deletion.type === "catalog";
        const isProductType = deletion.type === "product_type";
        const isProductGroup = deletion.type === "product_group";
        const isFlavor = deletion.type === "flavor";
        if (isProductType) {
            const count = countProductsUsingType(deletion.name);
            if (count > 0) {
                showToast("Este tipo está sendo usado por " + count + " produto" + (count === 1 ? "" : "s") + ". Altere esses produtos antes de excluir o tipo.");
                return;
            }
        }
        if (isProductGroup) {
            const count = countProductsUsingGroup(deletion.name);
            if (count > 0) {
                showToast("Este grupo está sendo usado por " + count + " produto" + (count === 1 ? "" : "s") + ". Remova o grupo desses produtos antes de excluí-lo.");
                return;
            }
        }
        if (isFlavor) {
            const count = countProductsUsingFlavor(deletion.id);
            if (count > 0) {
                showToast("Este sabor está associado a " + count + " produto" + (count === 1 ? "" : "s") + ". Remova-o dos produtos antes de excluir o sabor.");
                return;
            }
        }
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
                        : (isFlavor
                            ? "Excluir sabor?"
                            : "Excluir produto?"))));
        document.getElementById("deleteModalDescription").textContent = isCatalog
            ? "O catálogo “" + deletion.name + "”, suas categorias, produtos e imagens vinculadas serão removidos. Essa ação não poderá ser desfeita."
            : (isCategory
                ? "A categoria “" + deletion.name + "” será removida. Essa ação não poderá ser desfeita."
                : (isProductType
                    ? "O tipo “" + deletion.name + "” será removido. Essa ação não poderá ser desfeita."
                    : (isProductGroup
                        ? "O grupo “" + deletion.name + "” será removido. Essa ação não poderá ser desfeita."
                        : (isFlavor
                            ? "O sabor “" + deletion.name + "” será removido. Essa ação não poderá ser desfeita."
                            : "O produto “" + deletion.name + "” será removido do banco de dados e não poderá ser desfeito."))));
        confirmDeleteButton.textContent = isCatalog
            ? "Excluir catálogo"
            : (isCategory
                ? "Excluir categoria"
                : (isProductType
                    ? "Excluir tipo"
                    : (isProductGroup
                        ? "Excluir grupo"
                        : (isFlavor
                            ? "Excluir sabor"
                            : "Excluir produto"))));
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
        const rootCatId = productCategory.value;
        const subCatId = productSubcategory.value;
        const description = productDescription.value.trim();
        const priceInput = document.getElementById("productPrice").value.trim();
        const price = Number(priceInput);
        const status = document.getElementById("productStatus").value;

        if (name.length < 2) {
            setFeedback(productFeedback, "Informe um nome para o produto.", "error");
            return null;
        }

        const rootCategory = categories.find(function (category) {
            return category.id === rootCatId && !category.parent_id && category.catalog_id === activeCatalog.id;
        });
        if (!rootCategory) {
            setFeedback(productFeedback, "Selecione uma categoria válida.", "error");
            return null;
        }

        let finalCategoryId = rootCatId;
        if (subCatId) {
            const subCategory = categories.find(function (category) {
                return category.id === subCatId && category.parent_id === rootCatId && category.catalog_id === activeCatalog.id;
            });
            if (!subCategory) {
                setFeedback(productFeedback, "A subcategoria selecionada não pertence à categoria escolhida.", "error");
                return null;
            }
            finalCategoryId = subCatId;
        }

        if (!priceInput || !Number.isFinite(price) || price < 0 || price > 99999999.99) {
            setFeedback(productFeedback, "Informe um preço válido e maior ou igual a zero.", "error");
            return null;
        }
        if (description.length > 500 || !["active", "paused"].includes(status)) {
            setFeedback(productFeedback, "Revise a descrição e o status do produto.", "error");
            return null;
        }

        const payload = { name: name, category_id: finalCategoryId, description: description, price: price.toFixed(2), status: status };
        if (organizationEnabled) {
            const editingProductId = document.getElementById("productId").value;
            const currentProduct = editingProductId
                ? products.find(function (p) { return p.id === editingProductId; }) || null
                : null;

            // Validação de Tipo
            const selectedType = productType.value.trim();
            let finalType = null;
            if (selectedType) {
                const validConfigType = productTypes.find(function (t) {
                    return organization.key(t.name) === organization.key(selectedType) && t.catalog_id === activeCatalog.id;
                });
                if (validConfigType) {
                    finalType = validConfigType.name;
                } else if (currentProduct && organization.key(currentProduct.product_type) === organization.key(selectedType)) {
                    finalType = currentProduct.product_type;
                } else {
                    setFeedback(productFeedback, "O tipo selecionado não pertence a este catálogo.", "error");
                    return null;
                }
            }
            payload.product_type = finalType;

            // Validação de Grupos
            const checkedBoxes = Array.from(productGroupsContainer.querySelectorAll("input[name='productGroupItem']:checked"));
            const selectedGroupNames = [];
            for (let i = 0; i < checkedBoxes.length; i++) {
                const val = checkedBoxes[i].value.trim();
                const isLegacy = checkedBoxes[i].dataset.legacy === "true";
                const validConfigGroup = productGroups.find(function (g) {
                    return organization.key(g.name) === organization.key(val) && g.catalog_id === activeCatalog.id;
                });
                if (validConfigGroup) {
                    selectedGroupNames.push(validConfigGroup.name);
                } else if (isLegacy && currentProduct && (currentProduct.product_groups || []).some(function (g) { return organization.key(g) === organization.key(val); })) {
                    selectedGroupNames.push(val);
                } else {
                    setFeedback(productFeedback, "Um ou mais grupos selecionados não pertencem a este catálogo.", "error");
                    return null;
                }
            }
            if (selectedGroupNames.length > 10) {
                setFeedback(productFeedback, "Selecione no máximo 10 grupos para o produto.", "error");
                return null;
            }
            payload.product_groups = selectedGroupNames;

            // Validação de modo de compra (purchase_mode)
            const purchaseMode = (productPurchaseMode && productPurchaseMode.value) || "simple";
            if (!["simple", "flavor_bundle"].includes(purchaseMode)) {
                setFeedback(productFeedback, "Selecione um comportamento de compra válido.", "error");
                return null;
            }

            if (purchaseMode === "flavor_bundle") {
                const editingProductId = document.getElementById("productId").value;
                const flavorValidation = getSelectedProductFlavors(editingProductId || "temp");
                if (flavorValidation.error) {
                    setFeedback(productFeedback, flavorValidation.error, "error");
                    return null;
                }
                if (!flavorValidation.data || flavorValidation.data.length === 0) {
                    setFeedback(productFeedback, "Selecione ao menos um sabor para produtos com escolha de sabores.", "error");
                    return null;
                }
            }
            payload.purchase_mode = purchaseMode;
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

    async function uploadCatalogImage(file, entityId) {
        const userResult = await client.auth.getUser();
        const user = userResult.data && userResult.data.user;
        if (userResult.error || !user) {
            return { path: "", error: userResult.error || new Error("Sessão não encontrada") };
        }
        const extension = getProductImageExtension(file);
        const path = user.id + "/" + activeCatalog.id + "/" + entityId + "/" + Date.now() + "." + extension;
        const uploadResult = await client.storage.from(productImagesBucket).upload(path, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: false
        });
        return { path: uploadResult.error ? "" : path, error: uploadResult.error };
    }

    async function uploadProductImage(file, productId) {
        return uploadCatalogImage(file, productId);
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

            if (organizationEnabled) {
                if (payload.purchase_mode === "flavor_bundle") {
                    const flavorsResult = getSelectedProductFlavors(savedProductId);
                    const selectedFlavors = flavorsResult.data || [];
                    const deleteFlavorsRes = await client.from("product_flavors")
                        .delete()
                        .eq("product_id", savedProductId)
                        .eq("catalog_id", activeCatalog.id);
                    if (deleteFlavorsRes.error) {
                        console.error("Erro ao sincronizar sabores do produto (delete)", deleteFlavorsRes.error);
                    }
                    if (selectedFlavors.length > 0) {
                        const insertFlavorsRes = await client.from("product_flavors").insert(selectedFlavors);
                        if (insertFlavorsRes.error) {
                            console.error("Erro ao salvar sabores do produto", insertFlavorsRes.error);
                            setFeedback(productFeedback, "Não foi possível vincular os sabores ao produto.", "error");
                            return;
                        }
                    }
                } else {
                    const cleanupFlavorsRes = await client.from("product_flavors")
                        .delete()
                        .eq("product_id", savedProductId)
                        .eq("catalog_id", activeCatalog.id);
                    if (cleanupFlavorsRes.error) {
                        console.error("Erro ao limpar sabores do produto", cleanupFlavorsRes.error);
                    }
                }
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

        const allowedProfiles = ["standard", "food", "marmitas", "services"];
        const profileCandidate = catalogProfile ? catalogProfile.value.trim().toLowerCase() : "standard";
        const profile = allowedProfiles.includes(profileCandidate) ? profileCandidate : "standard";

        let minimumOrder = null;
        if (catalogMinimumOrder && catalogMinimumOrder.value.trim()) {
            const parsed = Number(catalogMinimumOrder.value.trim());
            if (!Number.isInteger(parsed) || parsed < 1) {
                setFeedback(catalogFeedback, "O pedido mínimo deve ser um número inteiro positivo maior ou igual a 1.", "error");
                return null;
            }
            minimumOrder = parsed;
        }

        return {
            name: name,
            slug: slug,
            is_active: isActive,
            whatsapp_number: whatsapp || null,
            orders_enabled: ordersEnabled,
            order_message: orderMessage,
            catalog_profile: profile,
            minimum_order_quantity: minimumOrder
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
            if (isType) {
                const count = countProductsUsingType(deletion.name);
                if (count > 0) {
                    confirmDeleteButton.disabled = false;
                    closeDeleteModal();
                    showToast("Este tipo está sendo usado por " + count + " produto" + (count === 1 ? "" : "s") + ". Altere esses produtos antes de excluir o tipo.");
                    return;
                }
            } else {
                const count = countProductsUsingGroup(deletion.name);
                if (count > 0) {
                    confirmDeleteButton.disabled = false;
                    closeDeleteModal();
                    showToast("Este grupo está sendo usado por " + count + " produto" + (count === 1 ? "" : "s") + ". Remova o grupo desses produtos antes de excluí-lo.");
                    return;
                }
            }
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

        if (deletion.type === "flavor") {
            const count = countProductsUsingFlavor(deletion.id);
            if (count > 0) {
                confirmDeleteButton.disabled = false;
                closeDeleteModal();
                showToast("Este sabor está associado a " + count + " produto" + (count === 1 ? "" : "s") + ". Remova-o dos produtos antes de excluí-lo.");
                return;
            }

            const { data, error } = await client
                .from("flavors")
                .delete()
                .eq("id", deletion.id)
                .eq("catalog_id", activeCatalog.id)
                .select("id")
                .maybeSingle();

            confirmDeleteButton.disabled = false;
            if (error || !data) {
                console.error("Erro ao excluir sabor", error);
                closeDeleteModal();
                showToast("Não foi possível excluir o sabor. Tente novamente.");
                return;
            }

            if (deletion.image_path) {
                await removeStoredProductImage(deletion.image_path);
            }

            closeDeleteModal();
            await loadActiveCatalogData();
            showToast("Sabor excluído com sucesso.");
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
        closeProductModal();
        closeCatalogModal();
        closeDeleteModal();
        closeRootCategoryForm();
        closeSubcategoryForm();
        closeProductTypeForm();
        closeProductGroupForm();
        closeFlavorForm();
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
    if (flavorsTabButton) flavorsTabButton.addEventListener("click", function () { switchSettingsTab("flavors"); });
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
    if (newFlavorButton) newFlavorButton.addEventListener("click", function () { openFlavorForm(null); });
    if (cancelFlavorButton) cancelFlavorButton.addEventListener("click", closeFlavorForm);
    if (flavorForm) flavorForm.addEventListener("submit", saveFlavor);
    if (flavorImageInput) flavorImageInput.addEventListener("change", previewSelectedFlavorImage);
    if (flavorImagePreviewImage) {
        flavorImagePreviewImage.addEventListener("error", function () {
            flavorImagePreviewImage.hidden = true;
            flavorImagePreviewFallback.hidden = false;
        });
    }
    if (removeFlavorImage) {
        removeFlavorImage.addEventListener("change", function () {
            if (!removeFlavorImage.checked) {
                const currentId = flavorId.value;
                const flavor = flavors.find(function (f) { return f.id === currentId; });
                showFlavorImagePreview(flavor && flavor.image_path ? getProductImageUrl(flavor.image_path) : "", flavor ? flavor.name : "S");
                return;
            }
            flavorImageInput.value = "";
            clearFlavorImageObjectUrl();
            showFlavorImagePreview("", flavorName.value || "S");
        });
    }

    document.getElementById("ordersMenuLink").addEventListener("click", function () { toggleMenu(false); });
    productForm.addEventListener("submit", saveProduct);
    productCategory.addEventListener("change", function () {
        populateProductSubcategories(productCategory.value, "");
    });
    if (productPurchaseMode) {
        productPurchaseMode.addEventListener("change", function () {
            const currentEditingId = document.getElementById("productId").value;
            syncProductPurchaseModeUI(currentEditingId || null);
        });
    }
    catalogForm.addEventListener("submit", saveCatalog);
    if (catalogProfile) {
        catalogProfile.addEventListener("change", function () {
            renderCatalogProfileFeatures(this.value);
        });
    }
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

