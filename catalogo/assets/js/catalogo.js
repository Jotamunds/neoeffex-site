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
    const toast = document.getElementById("toast");
    let client = null;
    let catalog = null;
    let categories = [];
    let products = [];
    let selectedCategory = "all";
    let toastTimeout = null;

    function hasValidConfig() {
        return Boolean(
            config.url
            && config.publishableKey
            && /^https:\/\/.+\.supabase\.co\/?$/.test(config.url)
        );
    }

    function getCatalogSlug() {
        const value = new URLSearchParams(window.location.search).get("catalogo") || "";
        const slug = value.trim().toLocaleLowerCase("pt-BR");
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : "";
    }

    function normalizeText(value) {
        return String(value || "")
            .toLocaleLowerCase("pt-BR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(Number(value));
    }

    function pluralizeProducts(value) {
        return value + " produto" + (value === 1 ? "" : "s");
    }

    function showError(title, message, canRetry) {
        loadingState.hidden = true;
        catalogContent.hidden = true;
        errorState.hidden = false;
        document.getElementById("errorTitle").textContent = title;
        document.getElementById("errorMessage").textContent = message;
        document.getElementById("retryButton").hidden = !canRetry;
        body.classList.remove("is-loading");
    }

    function getCategory(categoryId) {
        return categories.find(function (category) {
            return category.id === categoryId;
        });
    }

    function getFilteredProducts() {
        const search = normalizeText(searchInput.value.trim());

        return products.filter(function (product) {
            const category = getCategory(product.category_id);
            const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
            const searchableText = normalizeText([
                product.name,
                product.description,
                category ? category.name : ""
            ].join(" "));
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
            const count = products.filter(function (product) {
                return product.category_id === category.id;
            }).length;
            if (count > 0) categoryFilters.appendChild(createFilterButton(category.name, category.id, count));
        });
    }

    function createProductCard(product, category) {
        const article = document.createElement("article");
        const top = document.createElement("div");
        const categoryLabel = document.createElement("span");
        const price = document.createElement("strong");
        const mark = document.createElement("span");
        const title = document.createElement("h3");
        const description = document.createElement("p");

        article.className = "product-card";
        top.className = "product-card__top";
        categoryLabel.className = "product-card__category";
        price.className = "product-card__price";
        mark.className = "product-card__mark";
        categoryLabel.textContent = category.name;
        price.textContent = formatCurrency(product.price);
        mark.textContent = product.name.trim().charAt(0).toLocaleUpperCase("pt-BR") || "N";
        title.textContent = product.name;
        description.textContent = product.description || "Consulte as informações deste produto.";
        top.appendChild(categoryLabel);
        top.appendChild(price);
        article.appendChild(top);
        article.appendChild(mark);
        article.appendChild(title);
        article.appendChild(description);
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
        categoryProducts.forEach(function (product) {
            grid.appendChild(createProductCard(product, category));
        });
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
            const categoryProducts = visibleProducts.filter(function (product) {
                return product.category_id === category.id;
            });
            if (categoryProducts.length) {
                catalogSections.appendChild(createCategorySection(category, categoryProducts));
            }
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

    function showCatalog() {
        catalogName.textContent = catalog.name;
        document.title = catalog.name + " | Catálogo";
        document.querySelector("meta[name='description']").setAttribute(
            "content",
            "Consulte os produtos e preços disponíveis no catálogo " + catalog.name + "."
        );
        renderFilters();
        renderProducts();
        loadingState.hidden = true;
        errorState.hidden = true;
        catalogContent.hidden = false;
        body.classList.remove("is-loading");
    }

    async function loadCatalog() {
        const slug = getCatalogSlug();
        loadingState.hidden = false;
        loadingState.setAttribute("aria-busy", "true");
        errorState.hidden = true;
        catalogContent.hidden = true;

        if (!slug) {
            showError("Endereço incompleto", "Use o link completo fornecido pelo responsável pelo catálogo.", false);
            return;
        }

        const catalogResult = await client
            .from("catalogs")
            .select("id, name, slug")
            .eq("slug", slug)
            .eq("is_active", true)
            .maybeSingle();

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
            client.from("categories")
                .select("id, catalog_id, name, sort_order, created_at")
                .eq("catalog_id", catalog.id)
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: true }),
            client.from("products")
                .select("id, catalog_id, name, description, category_id, price, status, sort_order, created_at")
                .eq("catalog_id", catalog.id)
                .eq("status", "active")
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: true })
        ]);

        if (categoriesResult.error || productsResult.error) {
            console.error("Erro ao carregar dados públicos", categoriesResult.error || productsResult.error);
            showError("Catálogo indisponível", "Não foi possível carregar os produtos agora.", true);
            return;
        }

        categories = categoriesResult.data || [];
        products = (productsResult.data || []).filter(function (product) {
            return categories.some(function (category) {
                return category.id === product.category_id;
            });
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
        requestAnimationFrame(function () {
            toast.classList.add("toast--visible");
        });
        toastTimeout = window.setTimeout(function () {
            toast.classList.remove("toast--visible");
            window.setTimeout(function () {
                toast.hidden = true;
            }, 180);
        }, 3200);
    }

    async function shareCatalog() {
        const shareData = {
            title: catalog ? catalog.name : "Catálogo",
            text: catalog ? "Veja o catálogo " + catalog.name : "Veja este catálogo",
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                if (error.name !== "AbortError") console.error("Não foi possível compartilhar", error);
            }
            return;
        }

        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(shareData.url);
                showToast("Link copiado.");
                return;
            } catch (error) {
                console.error("Não foi possível copiar o link", error);
            }
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
