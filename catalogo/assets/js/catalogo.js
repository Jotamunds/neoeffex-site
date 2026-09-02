(function () {
    "use strict";

    const config = window.NEOEFFEX_SUPABASE_CONFIG || {};
    const body = document.body;
    const loadingState = document.getElementById("loadingState");
    const errorState = document.getElementById("errorState");
    const catalogContent = document.getElementById("catalogContent");
    const catalogName = document.getElementById("catalogName");
    const searchInput = document.getElementById("catalogSearch");
    const categoryFilters = document.getElementById("categoryFilters");
    const catalogSections = document.getElementById("catalogSections");
    const resultSummary = document.getElementById("resultSummary");
    const emptyResults = document.getElementById("emptyResults");
    const emptyResultsTitle = document.getElementById("emptyResultsTitle");
    const emptyResultsMessage = document.getElementById("emptyResultsMessage");
    const clearFiltersButton = document.getElementById("clearFiltersButton");
    const shareButton = document.getElementById("shareButton");
    const cartButton = document.getElementById("cartButton");
    const cartCount = document.getElementById("cartCount");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartItems = document.getElementById("cartItems");
    const cartEmpty = document.getElementById("cartEmpty");
    const cartFooter = document.getElementById("cartFooter");
    const cartTotal = document.getElementById("cartTotal");
    const cartInstruction = document.getElementById("cartInstruction");
    const whatsappButton = document.getElementById("whatsappButton");
    const toast = document.getElementById("toast");
    let client = null;
    let catalog = null;
    let categories = [];
    let products = [];
    let cart = {};
    let selectedCategory = "all";
    let toastTimeout = null;
    let lastFocusedElement = null;
    const productImagesBucket = "catalog-products";

    function hasValidConfig() {
        return Boolean(config.url && config.publishableKey && /^https:\/\/.+\.supabase\.co\/?$/.test(config.url));
    }

    function getCatalogSlug() {
        const value = new URLSearchParams(window.location.search).get("catalogo") || "";
        const slug = value.trim().toLocaleLowerCase("pt-BR");
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : "";
    }

    function normalizeText(value) {
        return String(value || "").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));
    }

    function pluralizeProducts(value) {
        return value + " produto" + (value === 1 ? "" : "s");
    }

    function ordersAvailable() {
        return Boolean(catalog && catalog.orders_enabled && catalog.whatsapp_number);
    }

    function getProductImageUrl(imagePath) {
        if (!imagePath || !client) return "";
        const result = client.storage.from(productImagesBucket).getPublicUrl(imagePath);
        return result.data && result.data.publicUrl ? result.data.publicUrl : "";
    }

    function showError(title, message, canRetry) {
        closeCart();
        loadingState.hidden = true;
        catalogContent.hidden = true;
        errorState.hidden = false;
        cartButton.hidden = true;
        document.getElementById("errorTitle").textContent = title;
        document.getElementById("errorMessage").textContent = message;
        document.getElementById("retryButton").hidden = !canRetry;
        body.classList.remove("is-loading");
    }

    function getCategory(categoryId) {
        return categories.find(function (category) { return category.id === categoryId; });
    }

    function getProduct(productId) {
        return products.find(function (product) { return product.id === productId; });
    }

    function getFilteredProducts() {
        const search = normalizeText(searchInput.value.trim());
        return products.filter(function (product) {
            const category = getCategory(product.category_id);
            const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
            const searchableText = normalizeText([product.name, product.description, category ? category.name : ""].join(" "));
            return matchesCategory && (!search || searchableText.includes(search));
        });
    }

    function createFilterButton(label, value, count) {
        const button = document.createElement("button");
        const text = document.createElement("span");
        const counter = document.createElement("small");
        button.className = "category-filter";
        button.type = "button";
        button.dataset.categoryId = value;
        button.setAttribute("aria-pressed", String(selectedCategory === value));
        text.textContent = label;
        counter.textContent = String(count);
        button.appendChild(text);
        button.appendChild(counter);
        button.addEventListener("click", function () {
            selectedCategory = value;
            renderFilters();
            renderProducts();
        });
        return button;
    }

    function renderFilters() {
        categoryFilters.replaceChildren();
        categoryFilters.appendChild(createFilterButton("Todos", "all", products.length));
        categories.forEach(function (category) {
            const count = products.filter(function (product) { return product.category_id === category.id; }).length;
            if (count > 0) categoryFilters.appendChild(createFilterButton(category.name, category.id, count));
        });
    }

    function addToCart(productId) {
        const product = getProduct(productId);
        if (!product || !ordersAvailable()) return;
        cart[productId] = Math.min((Number(cart[productId]) || 0) + 1, 99);
        saveCart();
        renderCart();
        showToast(product.name + " adicionado ao pedido.");
    }

    function createProductCard(product, category) {
        const article = document.createElement("article");
        const top = document.createElement("div");
        const categoryLabel = document.createElement("span");
        const price = document.createElement("strong");
        const media = document.createElement("div");
        const image = document.createElement("img");
        const mark = document.createElement("span");
        const title = document.createElement("h3");
        const description = document.createElement("p");
        article.className = "product-card";
        top.className = "product-card__top";
        categoryLabel.className = "product-card__category";
        price.className = "product-card__price";
        media.className = "product-card__media";
        image.className = "product-card__image";
        mark.className = "product-card__mark";
        categoryLabel.textContent = category.name;
        price.textContent = formatCurrency(product.price);
        mark.textContent = product.name.trim().charAt(0).toLocaleUpperCase("pt-BR") || "N";
        const imageUrl = getProductImageUrl(product.image_path);
        if (imageUrl) {
            image.src = imageUrl;
            image.alt = product.name;
            image.loading = "lazy";
            image.decoding = "async";
            mark.hidden = true;
            image.addEventListener("error", function () {
                image.hidden = true;
                mark.hidden = false;
            });
            media.appendChild(image);
        }
        media.appendChild(mark);
        title.textContent = product.name;
        description.textContent = product.description || "Consulte as informações deste produto.";
        top.appendChild(categoryLabel);
        top.appendChild(price);
        article.appendChild(top);
        article.appendChild(media);
        article.appendChild(title);
        article.appendChild(description);
        if (ordersAvailable()) {
            const addButton = document.createElement("button");
            addButton.className = "add-product-button";
            addButton.type = "button";
            addButton.textContent = "Adicionar ao pedido";
            addButton.setAttribute("aria-label", "Adicionar " + product.name + " ao pedido");
            addButton.addEventListener("click", function () { addToCart(product.id); });
            article.appendChild(addButton);
        }
        return article;
    }

    function createCategorySection(category, categoryProducts) {
        const section = document.createElement("section");
        const heading = document.createElement("div");
        const title = document.createElement("h2");
        const count = document.createElement("span");
        const grid = document.createElement("div");
        section.className = "category-section";
        section.setAttribute("aria-labelledby", "category-" + category.id);
        heading.className = "category-section__heading";
        title.id = "category-" + category.id;
        title.textContent = category.name;
        count.textContent = pluralizeProducts(categoryProducts.length);
        grid.className = "product-grid";
        categoryProducts.forEach(function (product) { grid.appendChild(createProductCard(product, category)); });
        heading.appendChild(title);
        heading.appendChild(count);
        section.appendChild(heading);
        section.appendChild(grid);
        return section;
    }

    function renderProducts() {
        const visibleProducts = getFilteredProducts();
        catalogSections.replaceChildren();
        categories.forEach(function (category) {
            const categoryProducts = visibleProducts.filter(function (product) { return product.category_id === category.id; });
            if (categoryProducts.length) catalogSections.appendChild(createCategorySection(category, categoryProducts));
        });
        resultSummary.textContent = visibleProducts.length === products.length
            ? pluralizeProducts(products.length) + " disponível" + (products.length === 1 ? "" : "is")
            : pluralizeProducts(visibleProducts.length) + " encontrado" + (visibleProducts.length === 1 ? "" : "s");
        emptyResults.hidden = visibleProducts.length !== 0;
        if (!products.length) {
            emptyResultsTitle.textContent = "Catálogo em preparação";
            emptyResultsMessage.textContent = "Ainda não há produtos publicados neste catálogo.";
            clearFiltersButton.hidden = true;
        } else {
            emptyResultsTitle.textContent = "Nenhum produto encontrado";
            emptyResultsMessage.textContent = "Tente buscar outro termo ou escolher uma categoria diferente.";
            clearFiltersButton.hidden = false;
        }
    }

    function getCartStorageKey() {
        return catalog ? "neoeffex-catalog-cart-" + catalog.id : "";
    }

    function loadCart() {
        cart = {};
        if (!ordersAvailable()) return;
        try {
            const stored = JSON.parse(window.localStorage.getItem(getCartStorageKey()) || "{}");
            if (stored && typeof stored === "object" && !Array.isArray(stored)) {
                Object.keys(stored).forEach(function (productId) {
                    const quantity = Math.floor(Number(stored[productId]));
                    if (getProduct(productId) && quantity > 0) cart[productId] = Math.min(quantity, 99);
                });
            }
            saveCart();
        } catch (error) {
            cart = {};
        }
    }

    function saveCart() {
        const key = getCartStorageKey();
        if (!key) return;
        try {
            window.localStorage.setItem(key, JSON.stringify(cart));
        } catch (error) {
            // O carrinho continua funcionando durante esta visita se o armazenamento estiver bloqueado.
        }
    }

    function getCartEntries() {
        return Object.keys(cart).map(function (productId) {
            const product = getProduct(productId);
            const quantity = Math.min(Math.max(Math.floor(Number(cart[productId])) || 0, 0), 99);
            return product && quantity ? { product: product, quantity: quantity } : null;
        }).filter(Boolean);
    }

    function updateCartQuantity(productId, change) {
        const current = Number(cart[productId]) || 0;
        const next = Math.min(current + change, 99);
        if (next <= 0) delete cart[productId];
        else cart[productId] = next;
        saveCart();
        renderCart();
    }

    function createQuantityButton(label, text, productId, change) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = text;
        button.setAttribute("aria-label", label);
        button.addEventListener("click", function () { updateCartQuantity(productId, change); });
        return button;
    }

    function createCartItem(entry) {
        const item = document.createElement("article");
        const copy = document.createElement("div");
        const name = document.createElement("strong");
        const subtotal = document.createElement("span");
        const controls = document.createElement("div");
        const quantity = document.createElement("span");
        const removeButton = document.createElement("button");
        item.className = "cart-item";
        copy.className = "cart-item__copy";
        controls.className = "quantity-control";
        name.textContent = entry.product.name;
        subtotal.textContent = formatCurrency(Number(entry.product.price) * entry.quantity);
        quantity.textContent = String(entry.quantity);
        quantity.setAttribute("aria-label", "Quantidade: " + entry.quantity);
        controls.appendChild(createQuantityButton("Diminuir " + entry.product.name, "−", entry.product.id, -1));
        controls.appendChild(quantity);
        controls.appendChild(createQuantityButton("Aumentar " + entry.product.name, "+", entry.product.id, 1));
        removeButton.className = "remove-item-button";
        removeButton.type = "button";
        removeButton.textContent = "Remover";
        removeButton.addEventListener("click", function () {
            delete cart[entry.product.id];
            saveCart();
            renderCart();
        });
        copy.appendChild(name);
        copy.appendChild(subtotal);
        item.appendChild(copy);
        item.appendChild(controls);
        item.appendChild(removeButton);
        return item;
    }

    function buildOrderMessage(entries, total) {
        const lines = ["Olá! Gostaria de fazer este pedido pelo catálogo " + catalog.name + ":", ""];
        entries.forEach(function (entry) {
            const itemTotal = Number(entry.product.price) * entry.quantity;
            lines.push("• " + entry.quantity + "x " + entry.product.name);
            lines.push("  " + entry.quantity + " × " + formatCurrency(entry.product.price) + " = " + formatCurrency(itemTotal));
        });
        lines.push("");
        lines.push("Total estimado: " + formatCurrency(total));
        if (catalog.order_message) {
            lines.push("");
            lines.push(catalog.order_message);
        }
        return lines.join("\n");
    }

    function renderCart() {
        const available = ordersAvailable();
        const entries = available ? getCartEntries() : [];
        const itemCount = entries.reduce(function (sum, entry) { return sum + entry.quantity; }, 0);
        const total = entries.reduce(function (sum, entry) { return sum + Number(entry.product.price) * entry.quantity; }, 0);
        cartButton.hidden = !available;
        cartCount.textContent = String(itemCount);
        cartItems.replaceChildren();
        entries.forEach(function (entry) { cartItems.appendChild(createCartItem(entry)); });
        cartEmpty.hidden = entries.length > 0;
        cartFooter.hidden = entries.length === 0;
        if (entries.length) {
            cartTotal.textContent = formatCurrency(total);
            cartInstruction.textContent = catalog.order_message || "Confirme os detalhes pelo WhatsApp.";
            whatsappButton.href = "https://wa.me/" + catalog.whatsapp_number
                + "?text=" + encodeURIComponent(buildOrderMessage(entries, total));
        } else {
            whatsappButton.removeAttribute("href");
        }
    }

    function openCart() {
        if (!ordersAvailable()) return;
        lastFocusedElement = document.activeElement;
        cartOverlay.hidden = false;
        cartDrawer.inert = false;
        cartDrawer.classList.add("cart-drawer--open");
        cartDrawer.setAttribute("aria-hidden", "false");
        cartButton.setAttribute("aria-expanded", "true");
        body.classList.add("has-cart-open");
        cartDrawer.focus();
    }

    function closeCart() {
        cartDrawer.classList.remove("cart-drawer--open");
        cartDrawer.setAttribute("aria-hidden", "true");
        cartDrawer.inert = true;
        cartButton.setAttribute("aria-expanded", "false");
        cartOverlay.hidden = true;
        body.classList.remove("has-cart-open");
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
        lastFocusedElement = null;
    }

    function showCatalog() {
        catalogName.textContent = catalog.name;
        document.title = catalog.name + " | Catálogo";
        document.querySelector("meta[name='description']").setAttribute("content", "Consulte os produtos e preços disponíveis no catálogo " + catalog.name + ".");
        renderFilters();
        renderProducts();
        loadCart();
        renderCart();
        loadingState.hidden = true;
        errorState.hidden = true;
        catalogContent.hidden = false;
        body.classList.remove("is-loading");
    }

    async function loadCatalog() {
        const slug = getCatalogSlug();
        closeCart();
        loadingState.hidden = false;
        loadingState.setAttribute("aria-busy", "true");
        errorState.hidden = true;
        catalogContent.hidden = true;
        cartButton.hidden = true;
        if (!slug) {
            showError("Endereço incompleto", "Use o link completo fornecido pelo responsável pelo catálogo.", false);
            return;
        }
        const catalogResult = await client.from("catalogs")
            .select("id, name, slug, whatsapp_number, orders_enabled, order_message")
            .eq("slug", slug).eq("is_active", true).maybeSingle();
        if (catalogResult.error) {
            console.error("Erro ao carregar catálogo", catalogResult.error);
            showError("Catálogo indisponível", "Não foi possível abrir este catálogo agora.", true);
            return;
        }
        if (!catalogResult.data) {
            showError("Catálogo não encontrado", "Este catálogo não existe ou está temporariamente pausado.", false);
            return;
        }
        catalog = catalogResult.data;
        const [categoriesResult, productsResult] = await Promise.all([
            client.from("categories").select("id, catalog_id, name, sort_order, created_at")
                .eq("catalog_id", catalog.id).order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
            client.from("products").select("id, catalog_id, name, description, category_id, price, status, image_path, sort_order, created_at")
                .eq("catalog_id", catalog.id).eq("status", "active")
                .order("sort_order", { ascending: true }).order("created_at", { ascending: true })
        ]);
        if (categoriesResult.error || productsResult.error) {
            console.error("Erro ao carregar dados públicos", categoriesResult.error || productsResult.error);
            showError("Catálogo indisponível", "Não foi possível carregar os produtos agora.", true);
            return;
        }
        categories = categoriesResult.data || [];
        products = (productsResult.data || []).filter(function (product) {
            return categories.some(function (category) { return category.id === product.category_id; });
        });
        selectedCategory = "all";
        searchInput.value = "";
        loadingState.setAttribute("aria-busy", "false");
        showCatalog();
    }

    function showToast(message) {
        window.clearTimeout(toastTimeout);
        toast.textContent = message;
        toast.hidden = false;
        requestAnimationFrame(function () { toast.classList.add("toast--visible"); });
        toastTimeout = window.setTimeout(function () {
            toast.classList.remove("toast--visible");
            window.setTimeout(function () { toast.hidden = true; }, 180);
        }, 3200);
    }

    async function shareCatalog() {
        const shareData = {
            title: catalog ? catalog.name : "Catálogo",
            text: catalog ? "Veja o catálogo " + catalog.name : "Veja este catálogo",
            url: window.location.href
        };
        if (navigator.share) {
            try { await navigator.share(shareData); }
            catch (error) { if (error.name !== "AbortError") console.error("Não foi possível compartilhar", error); }
            return;
        }
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(shareData.url);
                showToast("Link copiado.");
                return;
            } catch (error) { console.error("Não foi possível copiar o link", error); }
        }
        window.prompt("Copie o link do catálogo:", shareData.url);
    }

    searchInput.addEventListener("input", renderProducts);
    clearFiltersButton.addEventListener("click", function () {
        selectedCategory = "all";
        searchInput.value = "";
        renderFilters();
        renderProducts();
        searchInput.focus();
    });
    document.getElementById("retryButton").addEventListener("click", loadCatalog);
    shareButton.addEventListener("click", shareCatalog);
    cartButton.addEventListener("click", openCart);
    cartOverlay.addEventListener("click", closeCart);
    document.getElementById("closeCartButton").addEventListener("click", closeCart);
    document.getElementById("clearCartButton").addEventListener("click", function () {
        cart = {};
        saveCart();
        renderCart();
    });
    window.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && cartDrawer.classList.contains("cart-drawer--open")) closeCart();
    });

    if (!window.supabase || !hasValidConfig()) {
        showError("Catálogo indisponível", "A conexão deste catálogo ainda não foi configurada.", false);
        return;
    }
    client = window.supabase.createClient(config.url, config.publishableKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
            storageKey: "neoeffex-public-catalog"
        }
    });
    loadCatalog();
}());
