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
    const cartMinimumNotice = document.getElementById("cartMinimumNotice");
    const whatsappButton = document.getElementById("whatsappButton");
    const restoreCartButton = document.getElementById("restoreCartButton");
    const toast = document.getElementById("toast");
    const organization = window.NEOEFFEX_ORGANIZATION;
    const typeFilter = document.getElementById("typeFilter");
    const groupFilter = document.getElementById("groupFilter");

    // Elementos do Modal de Sabores
    const flavorModal = document.getElementById("flavorModal");
    const flavorModalOverlay = document.getElementById("flavorModalOverlay");
    const closeFlavorModal = document.getElementById("closeFlavorModal");
    const cancelFlavorModalButton = document.getElementById("cancelFlavorModalButton");
    const confirmFlavorModalButton = document.getElementById("confirmFlavorModalButton");
    const flavorModalTitle = document.getElementById("flavorModalTitle");
    const flavorModalDescription = document.getElementById("flavorModalDescription");
    const bundleQtyDecrease = document.getElementById("bundleQtyDecrease");
    const bundleQtyIncrease = document.getElementById("bundleQtyIncrease");
    const bundleTotalQuantityDisplay = document.getElementById("bundleTotalQuantityDisplay");
    const flavorDistributionCount = document.getElementById("flavorDistributionCount");
    const flavorDistributionBadge = document.getElementById("flavorDistributionBadge");
    const flavorSelectionList = document.getElementById("flavorSelectionList");
    const flavorModalBasePrice = document.getElementById("flavorModalBasePrice");
    const flavorModalAddonsPrice = document.getElementById("flavorModalAddonsPrice");
    const flavorModalTotalPrice = document.getElementById("flavorModalTotalPrice");
    const flavorModalFeedback = document.getElementById("flavorModalFeedback");

    let client = null;
    let catalog = null;
    let categories = [];
    let products = [];
    let flavors = [];
    let productFlavors = [];
    let flavorsLoadError = null;
    let cart = {};
    let lastCart = {};
    let selectedCategory = "all";
    let toastTimeout = null;
    let lastFocusedElement = null;
    const productImagesBucket = "catalog-products";

    // Estado do Modal de Sabores
    let currentModalProduct = null;
    let currentBundleTargetQty = 1;
    let modalAvailableFlavors = [];

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

    function isSimulationMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const configuredSlugs = (window.NEOEFFEX_CATALOG_CONFIG && window.NEOEFFEX_CATALOG_CONFIG.simulationSlugs) || ["demo-neoeffex"];
        return urlParams.get("demo") === "1"
            || urlParams.get("simulacao") === "1"
            || Boolean(catalog && configuredSlugs.includes(catalog.slug))
            || Boolean(catalog && catalog.fulfillment_mode === "simulation");
    }

    function ordersAvailable() {
        return Boolean(catalog && (isSimulationMode() || (catalog.orders_enabled && catalog.whatsapp_number)));
    }

    function getProductImageUrl(imagePath) {
        if (!imagePath || !client) return "";
        const result = client.storage.from(productImagesBucket).getPublicUrl(imagePath);
        return result.data && result.data.publicUrl ? result.data.publicUrl : "";
    }

    function showError(title, message, canRetry) {
        closeCart();
        closeFlavorModalWindow();
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
            const matchesCategory = organization.matchesCategory(product, selectedCategory, categories);
            const searchableText = normalizeText([product.name, product.description, organization.categoryLabel(categories, product.category_id), product.product_type, (product.product_groups || []).join(" ")].join(" "));
            return matchesCategory && organization.matchesFacets(product, typeFilter.value, groupFilter.value) && (!search || searchableText.includes(search));
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
            const count = products.filter(function (product) { return organization.matchesCategory(product, category.id, categories); }).length;
            if (count > 0) categoryFilters.appendChild(createFilterButton(organization.categoryLabel(categories, category.id), category.id, count));
        });
    }

    function addToCart(productId) {
        const product = getProduct(productId);
        if (!product || !ordersAvailable()) return;
        const current = typeof cart[productId] === "number" ? cart[productId] : (cart[productId] && cart[productId].quantity) || 0;
        cart[productId] = Math.min(current + 1, 99);
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
        categoryLabel.textContent = organization.categoryLabel(categories, category.id);
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
        const labels = [product.product_type].concat(product.product_groups || []).filter(Boolean);
        if (labels.length) {
            const badges = document.createElement("div");
            badges.className = "product-labels";
            labels.forEach(function (label) {
                const badge = document.createElement("span");
                badge.textContent = label;
                badges.appendChild(badge);
            });
            article.appendChild(badges);
        }
        if (ordersAvailable()) {
            const addButton = document.createElement("button");
            addButton.className = "add-product-button";
            addButton.type = "button";
            const isBundle = product.purchase_mode === "flavor_bundle";
            addButton.textContent = isBundle ? "Escolher sabores" : "Adicionar ao pedido";
            addButton.setAttribute("aria-label", (isBundle ? "Escolher sabores para " : "Adicionar ") + product.name + " ao pedido");
            addButton.addEventListener("click", function () {
                if (isBundle) {
                    openFlavorModal(product);
                } else {
                    addToCart(product.id);
                }
            });
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
        title.textContent = organization.categoryLabel(categories, category.id);
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
        const textoDisponibilidade = products.length === 1 ? "disponível" : "disponíveis";
        const textoEncontrado = visibleProducts.length === 1 ? "encontrado" : "encontrados";
        resultSummary.textContent = visibleProducts.length === products.length
            ? pluralizeProducts(products.length) + " " + textoDisponibilidade
            : pluralizeProducts(visibleProducts.length) + " " + textoEncontrado;
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

    /* Modal de Sabores */
    function openFlavorModal(product) {
        const productPf = productFlavors.filter(function (pf) {
            return pf.product_id === product.id && pf.is_available !== false;
        });

        const available = productPf.map(function (pf) {
            const f = flavors.find(function (item) { return item.id === pf.flavor_id; });
            if (!f || f.is_active === false) return null;
            return {
                flavor_id: f.id,
                name: f.name,
                description: f.description || "",
                image_path: f.image_path || "",
                additional_price: Number(pf.additional_price) || 0,
                sort_order: Number(pf.sort_order) || 0,
                quantity: 0
            };
        }).filter(Boolean);

        if (flavorsLoadError) {
            showToast("Não foi possível carregar as opções de sabores deste produto no momento. Tente novamente mais tarde.");
            return;
        }

        if (!available.length) {
            showToast("Nenhum sabor disponível no momento para este produto.");
            return;
        }

        currentModalProduct = product;
        currentBundleTargetQty = 1;
        modalAvailableFlavors = available;

        flavorModalTitle.textContent = product.name;
        flavorModalDescription.textContent = "Distribua as unidades entre os sabores disponíveis.";

        renderFlavorSelectionList();
        updateFlavorModalState();

        flavorModalOverlay.hidden = false;
        flavorModal.hidden = false;
        flavorModal.setAttribute("aria-hidden", "false");
        body.classList.add("has-cart-open");
    }

    function closeFlavorModalWindow() {
        if (!flavorModal) return;
        flavorModal.hidden = true;
        flavorModal.setAttribute("aria-hidden", "true");
        flavorModalOverlay.hidden = true;
        body.classList.remove("has-cart-open");
        currentModalProduct = null;
        modalAvailableFlavors = [];
    }

    function renderFlavorSelectionList() {
        flavorSelectionList.replaceChildren();
        modalAvailableFlavors.forEach(function (flavorItem) {
            const row = document.createElement("div");
            row.className = "flavor-selection-item" + (flavorItem.quantity > 0 ? " flavor-selection-item--selected" : "");
            row.id = "flavorRow_" + flavorItem.flavor_id;

            const media = document.createElement("div");
            media.className = "flavor-selection-item__media";
            const imgUrl = getProductImageUrl(flavorItem.image_path);
            if (imgUrl) {
                const img = document.createElement("img");
                img.src = imgUrl;
                img.alt = flavorItem.name;
                img.className = "flavor-selection-item__image";
                img.loading = "lazy";
                img.addEventListener("error", function () {
                    img.hidden = true;
                    mark.hidden = false;
                });
                media.appendChild(img);
            }
            const mark = document.createElement("span");
            mark.className = "flavor-selection-item__mark";
            mark.textContent = flavorItem.name.trim().charAt(0).toLocaleUpperCase("pt-BR") || "S";
            if (imgUrl) mark.hidden = true;
            media.appendChild(mark);

            const info = document.createElement("div");
            info.className = "flavor-selection-item__info";
            const name = document.createElement("strong");
            name.className = "flavor-selection-item__name";
            name.textContent = flavorItem.name;
            info.appendChild(name);
            if (flavorItem.description) {
                const desc = document.createElement("p");
                desc.className = "flavor-selection-item__description";
                desc.textContent = flavorItem.description;
                info.appendChild(desc);
            }
            if (flavorItem.additional_price > 0) {
                const badge = document.createElement("span");
                badge.className = "flavor-selection-item__price-badge";
                badge.textContent = "+ " + formatCurrency(flavorItem.additional_price) + " / un.";
                info.appendChild(badge);
            }

            const controls = document.createElement("div");
            controls.className = "quantity-control";

            const decBtn = document.createElement("button");
            decBtn.type = "button";
            decBtn.textContent = "−";
            decBtn.id = "flavorDec_" + flavorItem.flavor_id;
            decBtn.setAttribute("aria-label", "Diminuir " + flavorItem.name);
            decBtn.addEventListener("click", function () {
                if (flavorItem.quantity > 0) {
                    flavorItem.quantity--;
                    updateFlavorModalState();
                }
            });

            const countSpan = document.createElement("span");
            countSpan.textContent = String(flavorItem.quantity);
            countSpan.id = "flavorCount_" + flavorItem.flavor_id;

            const incBtn = document.createElement("button");
            incBtn.type = "button";
            incBtn.textContent = "+";
            incBtn.id = "flavorInc_" + flavorItem.flavor_id;
            incBtn.setAttribute("aria-label", "Aumentar " + flavorItem.name);
            incBtn.addEventListener("click", function () {
                const totalDistributed = modalAvailableFlavors.reduce(function (sum, f) { return sum + f.quantity; }, 0);
                if (totalDistributed < currentBundleTargetQty) {
                    flavorItem.quantity++;
                    updateFlavorModalState();
                }
            });

            controls.appendChild(decBtn);
            controls.appendChild(countSpan);
            controls.appendChild(incBtn);

            row.appendChild(media);
            row.appendChild(info);
            row.appendChild(controls);
            flavorSelectionList.appendChild(row);
        });
    }

    function updateFlavorModalState() {
        if (!currentModalProduct) return;
        const totalDistributed = modalAvailableFlavors.reduce(function (sum, f) { return sum + f.quantity; }, 0);
        bundleTotalQuantityDisplay.textContent = String(currentBundleTargetQty);
        flavorDistributionCount.textContent = totalDistributed + " de " + currentBundleTargetQty + " selecionados";
        bundleQtyDecrease.disabled = currentBundleTargetQty <= 1;

        if (totalDistributed < currentBundleTargetQty) {
            const missing = currentBundleTargetQty - totalDistributed;
            flavorDistributionBadge.textContent = "Faltam " + missing;
            flavorDistributionBadge.className = "flavor-distribution-badge flavor-distribution-badge--pending";
            confirmFlavorModalButton.disabled = true;
            flavorModalFeedback.hidden = false;
            flavorModalFeedback.textContent = "Distribua mais " + missing + " " + (missing === 1 ? "sabor" : "sabores") + " para atingir o total.";
        } else if (totalDistributed === currentBundleTargetQty) {
            flavorDistributionBadge.textContent = "Completo";
            flavorDistributionBadge.className = "flavor-distribution-badge flavor-distribution-badge--complete";
            confirmFlavorModalButton.disabled = false;
            flavorModalFeedback.hidden = true;
        } else {
            const excess = totalDistributed - currentBundleTargetQty;
            flavorDistributionBadge.textContent = "Excesso (" + excess + ")";
            flavorDistributionBadge.className = "flavor-distribution-badge flavor-distribution-badge--excess";
            confirmFlavorModalButton.disabled = true;
            flavorModalFeedback.hidden = false;
            flavorModalFeedback.textContent = "A soma excede a quantidade total em " + excess + ".";
        }

        // Atualiza botões e contadores individuais de cada sabor
        modalAvailableFlavors.forEach(function (flavorItem) {
            const countSpan = document.getElementById("flavorCount_" + flavorItem.flavor_id);
            const decBtn = document.getElementById("flavorDec_" + flavorItem.flavor_id);
            const incBtn = document.getElementById("flavorInc_" + flavorItem.flavor_id);
            const row = document.getElementById("flavorRow_" + flavorItem.flavor_id);
            if (countSpan) countSpan.textContent = String(flavorItem.quantity);
            if (decBtn) decBtn.disabled = flavorItem.quantity <= 0;
            if (incBtn) incBtn.disabled = totalDistributed >= currentBundleTargetQty;
            if (row) {
                if (flavorItem.quantity > 0) row.classList.add("flavor-selection-item--selected");
                else row.classList.remove("flavor-selection-item--selected");
            }
        });

        // Preços
        const basePrice = Number(currentModalProduct.price) || 0;
        const baseTotal = basePrice * currentBundleTargetQty;
        const addonsTotal = modalAvailableFlavors.reduce(function (sum, f) {
            return sum + (Number(f.additional_price) || 0) * f.quantity;
        }, 0);
        const subtotal = baseTotal + addonsTotal;

        flavorModalBasePrice.textContent = "Base: " + formatCurrency(baseTotal);
        if (addonsTotal > 0) {
            flavorModalAddonsPrice.hidden = false;
            flavorModalAddonsPrice.textContent = "Acréscimos: + " + formatCurrency(addonsTotal);
        } else {
            flavorModalAddonsPrice.hidden = true;
        }
        flavorModalTotalPrice.textContent = formatCurrency(subtotal);
    }

    function getCartStorageKey() {
        return catalog ? "neoeffex-catalog-cart-" + catalog.id : "";
    }

    function getLastCartStorageKey() {
        return catalog ? "neoeffex-catalog-last-cart-" + catalog.id : "";
    }

    function sanitizeStoredCart(value) {
        const sanitized = {};
        if (!value || typeof value !== "object") return sanitized;
        const entries = Array.isArray(value) ? value : Object.keys(value).map(function (k) {
            const item = value[k];
            if (typeof item === "number") return { product_id: k, quantity: item };
            if (item && typeof item === "object") return Object.assign({ id: k }, item);
            return null;
        }).filter(Boolean);

        entries.forEach(function (entry) {
            if (!entry || !entry.product_id) return;
            const product = getProduct(entry.product_id);
            if (!product) return;
            const qty = Math.min(Math.max(Math.floor(Number(entry.quantity)) || 0, 0), 99);
            if (qty <= 0) return;

            if (Array.isArray(entry.flavors) && entry.flavors.length > 0) {
                const validFlavors = entry.flavors.map(function (f) {
                    if (!f || !f.flavor_id) return null;
                    const fQty = Math.max(Math.floor(Number(f.quantity)) || 0, 0);
                    if (fQty <= 0) return null;
                    return {
                        flavor_id: String(f.flavor_id),
                        name: String(f.name || "Sabor"),
                        quantity: fQty,
                        additional_price: Math.max(Number(f.additional_price) || 0, 0)
                    };
                }).filter(Boolean);

                const sumFlavors = validFlavors.reduce(function (sum, f) { return sum + f.quantity; }, 0);
                if (validFlavors.length > 0 && sumFlavors === qty) {
                    const bundleId = entry.id || ("bundle_" + Math.random().toString(36).slice(2, 9));
                    sanitized[bundleId] = {
                        id: bundleId,
                        product_id: product.id,
                        quantity: qty,
                        flavors: validFlavors
                    };
                }
            } else {
                sanitized[product.id] = (Number(sanitized[product.id]) || 0) + qty;
            }
        });
        return sanitized;
    }

    function loadCart() {
        cart = {};
        lastCart = {};
        if (!ordersAvailable()) return;
        try {
            cart = sanitizeStoredCart(JSON.parse(window.localStorage.getItem(getCartStorageKey()) || "{}"));
            lastCart = sanitizeStoredCart(JSON.parse(window.localStorage.getItem(getLastCartStorageKey()) || "{}"));
            saveCart();
            saveLastCart();
        } catch (error) {
            cart = {};
            lastCart = {};
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

    function saveLastCart() {
        const key = getLastCartStorageKey();
        if (!key) return;
        try {
            window.localStorage.setItem(key, JSON.stringify(lastCart));
        } catch (error) {
            // A restauração continua disponível durante esta visita se o armazenamento estiver bloqueado.
        }
    }

    function getCartEntriesFrom(source) {
        if (!source || typeof source !== "object") return [];
        return Object.keys(source).map(function (key) {
            const val = source[key];
            let productId = null;
            let quantity = 0;
            let entryFlavors = [];
            let itemId = key;

            if (typeof val === "number") {
                productId = key;
                quantity = Math.min(Math.max(Math.floor(val) || 0, 0), 99);
            } else if (val && typeof val === "object") {
                productId = val.product_id;
                quantity = Math.min(Math.max(Math.floor(Number(val.quantity)) || 0, 0), 99);
                entryFlavors = Array.isArray(val.flavors) ? val.flavors : [];
                itemId = val.id || key;
            }

            const product = getProduct(productId);
            if (!product || quantity <= 0) return null;

            const unitPrice = Number(product.price) || 0;
            const baseTotal = unitPrice * quantity;
            const addonsTotal = entryFlavors.reduce(function (sum, f) {
                return sum + (Number(f.additional_price) || 0) * (Number(f.quantity) || 0);
            }, 0);
            const totalPrice = baseTotal + addonsTotal;

            return {
                id: itemId,
                product: product,
                quantity: quantity,
                flavors: entryFlavors,
                unitPrice: unitPrice,
                baseTotal: baseTotal,
                addonsTotal: addonsTotal,
                totalPrice: totalPrice,
                isBundle: entryFlavors.length > 0
            };
        }).filter(Boolean);
    }

    function getCartEntries() {
        return getCartEntriesFrom(cart);
    }

    function updateCartQuantity(productId, change) {
        const current = typeof cart[productId] === "number" ? cart[productId] : (cart[productId] && cart[productId].quantity) || 0;
        const next = Math.min(current + change, 99);
        if (next <= 0) delete cart[productId];
        else {
            if (typeof cart[productId] === "object") cart[productId].quantity = next;
            else cart[productId] = next;
        }
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
        const removeButton = document.createElement("button");
        item.className = "cart-item";
        copy.className = "cart-item__copy";
        name.textContent = entry.product.name;
        subtotal.textContent = formatCurrency(entry.totalPrice);
        copy.appendChild(name);

        if (entry.isBundle) {
            const flavorsList = document.createElement("div");
            flavorsList.className = "cart-item__flavors";
            entry.flavors.forEach(function (f) {
                const flavorRow = document.createElement("small");
                const addonText = Number(f.additional_price) > 0
                    ? " (+ " + formatCurrency(Number(f.additional_price) * f.quantity) + ")"
                    : "";
                flavorRow.textContent = f.quantity + "x " + f.name + addonText;
                flavorsList.appendChild(flavorRow);
            });
            copy.appendChild(flavorsList);

            if (entry.addonsTotal > 0) {
                const addonsTag = document.createElement("span");
                addonsTag.className = "cart-item__addons";
                addonsTag.textContent = "Acréscimos: + " + formatCurrency(entry.addonsTotal);
                copy.appendChild(addonsTag);
            }
            copy.appendChild(subtotal);

            const controls = document.createElement("div");
            controls.className = "quantity-control";
            const qtySpan = document.createElement("span");
            qtySpan.textContent = entry.quantity + " un.";
            qtySpan.style.gridColumn = "1 / -1";
            controls.appendChild(qtySpan);

            removeButton.className = "remove-item-button";
            removeButton.type = "button";
            removeButton.textContent = "Remover";
            removeButton.addEventListener("click", function () {
                delete cart[entry.id];
                saveCart();
                renderCart();
            });

            item.appendChild(copy);
            item.appendChild(controls);
            item.appendChild(removeButton);
        } else {
            copy.appendChild(subtotal);
            const controls = document.createElement("div");
            controls.className = "quantity-control";
            const quantity = document.createElement("span");
            quantity.textContent = String(entry.quantity);
            quantity.setAttribute("aria-label", "Quantidade: " + entry.quantity);
            controls.appendChild(createQuantityButton("Diminuir " + entry.product.name, "−", entry.id, -1));
            controls.appendChild(quantity);
            controls.appendChild(createQuantityButton("Aumentar " + entry.product.name, "+", entry.id, 1));

            removeButton.className = "remove-item-button";
            removeButton.type = "button";
            removeButton.textContent = "Remover";
            removeButton.addEventListener("click", function () {
                delete cart[entry.id];
                saveCart();
                renderCart();
            });

            item.appendChild(copy);
            item.appendChild(controls);
            item.appendChild(removeButton);
        }
        return item;
    }

    function buildOrderMessage(entries, total) {
        const lines = ["Olá! Gostaria de fazer este pedido pelo catálogo " + catalog.name + ":", ""];
        entries.forEach(function (entry) {
            if (!entry.flavors || !entry.flavors.length) {
                // Produto simples
                lines.push("• " + entry.quantity + "x " + entry.product.name);
                lines.push("  " + entry.quantity + " × " + formatCurrency(entry.unitPrice) + " = " + formatCurrency(entry.totalPrice));
            } else {
                // Produto com sabores (flavor_bundle)
                lines.push("• " + entry.quantity + "x " + entry.product.name);
                lines.push("");
                lines.push("  Sabores:");
                entry.flavors.forEach(function (f) {
                    const addonInfo = Number(f.additional_price) > 0
                        ? " (+ " + formatCurrency(Number(f.additional_price) * f.quantity) + ")"
                        : "";
                    lines.push("  " + f.quantity + "x " + f.name + addonInfo);
                });
                if (entry.addonsTotal > 0) {
                    lines.push("");
                    lines.push("  Acréscimos: " + formatCurrency(entry.addonsTotal));
                }
                lines.push("  Subtotal: " + formatCurrency(entry.totalPrice));
            }
            lines.push("");
        });
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
        const restorableEntries = available ? getCartEntriesFrom(lastCart) : [];
        const itemCount = entries.reduce(function (sum, entry) { return sum + entry.quantity; }, 0);
        const total = entries.reduce(function (sum, entry) { return sum + entry.totalPrice; }, 0);

        cartButton.hidden = !available;
        cartCount.textContent = String(itemCount);
        cartItems.replaceChildren();
        entries.forEach(function (entry) { cartItems.appendChild(createCartItem(entry)); });
        cartEmpty.hidden = entries.length > 0;
        restoreCartButton.hidden = entries.length > 0 || restorableEntries.length === 0;
        cartFooter.hidden = entries.length === 0;

        // Regra de Pedido Mínimo
        const minOrder = Number(catalog && catalog.minimum_order_quantity) || 0;
        const meetsMinimum = minOrder <= 0 || itemCount >= minOrder;

        if (entries.length > 0 && minOrder > 0) {
            if (!meetsMinimum) {
                const missing = minOrder - itemCount;
                cartMinimumNotice.textContent = "Adicione mais " + missing + " " + (missing === 1 ? "item" : "itens") + " para finalizar o pedido (mínimo de " + minOrder + " itens).";
                cartMinimumNotice.hidden = false;
            } else {
                cartMinimumNotice.hidden = true;
            }
        } else {
            cartMinimumNotice.hidden = true;
        }

        if (entries.length) {
            cartTotal.textContent = formatCurrency(total);
            const orderMessage = buildOrderMessage(entries, total);

            if (!meetsMinimum) {
                whatsappButton.classList.add("whatsapp-button--disabled");
                whatsappButton.setAttribute("aria-disabled", "true");
                whatsappButton.removeAttribute("href");
                whatsappButton.removeAttribute("target");
            } else {
                whatsappButton.classList.remove("whatsapp-button--disabled");
                whatsappButton.removeAttribute("aria-disabled");

                if (isSimulationMode()) {
                    cartInstruction.textContent = "Ambiente de demonstração: este pedido fictício não será enviado a um comércio real.";
                    whatsappButton.removeAttribute("target");
                    whatsappButton.href = "#simulacao";
                    whatsappButton.dataset.simulation = "true";
                } else {
                    delete whatsappButton.dataset.simulation;
                    cartInstruction.textContent = catalog.order_message || "Confirme os detalhes pelo WhatsApp.";
                    whatsappButton.target = "_blank";
                    whatsappButton.href = "https://wa.me/" + catalog.whatsapp_number
                        + "?text=" + encodeURIComponent(orderMessage);
                }
            }
        } else {
            whatsappButton.removeAttribute("href");
            whatsappButton.classList.remove("whatsapp-button--disabled");
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
        closeFlavorModalWindow();
        loadingState.hidden = false;
        loadingState.setAttribute("aria-busy", "true");
        errorState.hidden = true;
        catalogContent.hidden = true;
        cartButton.hidden = true;
        if (!slug) {
            showError("Endereço incompleto", "Use o link completo fornecido pelo responsável pelo catálogo.", false);
            return;
        }

        let catalogResult = await client.from("catalogs")
            .select("id, name, slug, whatsapp_number, orders_enabled, order_message, logo_path, short_description, service_area, business_hours, fulfillment_mode, catalog_profile, minimum_order_quantity, logo_aspect_ratio")
            .eq("slug", slug).eq("is_active", true).maybeSingle();

        if (catalogResult.error && (catalogResult.error.code === "42703" || catalogResult.error.code === "PGRST204" || /logo_aspect_ratio/.test(catalogResult.error.message || ""))) {
            catalogResult = await client.from("catalogs")
                .select("id, name, slug, whatsapp_number, orders_enabled, order_message, logo_path, short_description, service_area, business_hours, fulfillment_mode, catalog_profile, minimum_order_quantity")
                .eq("slug", slug).eq("is_active", true).maybeSingle();
        }

        if (catalogResult.error && (catalogResult.error.code === "42703" || catalogResult.error.code === "PGRST204")) {
            catalogResult = await client.from("catalogs")
                .select("id, name, slug, whatsapp_number, orders_enabled, order_message, logo_path, short_description, service_area, business_hours, fulfillment_mode")
                .eq("slug", slug).eq("is_active", true).maybeSingle();
        }

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
        catalog.catalog_profile = catalog.catalog_profile || "standard";
        catalog.minimum_order_quantity = Number(catalog.minimum_order_quantity) || 0;
        catalog.logo_aspect_ratio = catalog.logo_aspect_ratio || "square";

        window.NEOEFFEX_ACTIVE_CATALOG = catalog;
        window.dispatchEvent(new CustomEvent("neoeffex:catalog-loaded", {
            detail: { client: client, catalog: catalog }
        }));

        // Carrega categorias e produtos
        const rows = await organization.loadRows(client, catalog.id, true);
        const categoriesResult = rows.categories;
        const productsResult = rows.products;
        if (categoriesResult.error || productsResult.error) {
            console.error("Erro ao carregar dados públicos", categoriesResult.error || productsResult.error);
            showError("Catálogo indisponível", "Não foi possível carregar os produtos agora.", true);
            return;
        }
        categories = organization.orderedCategories(categoriesResult.data || []);
        products = (productsResult.data || []).filter(function (product) {
            return categories.some(function (category) { return category.id === product.category_id; });
        });

        // Carrega sabores e relações de produto x sabor
        let flavorsRes = { data: [] };
        let pfRes = { data: [] };
        flavorsLoadError = null;
        try {
            [flavorsRes, pfRes] = await Promise.all([
                client.from("flavors")
                    .select("id, catalog_id, name, description, image_path, sort_order, is_active")
                    .eq("catalog_id", catalog.id)
                    .eq("is_active", true)
                    .order("sort_order", { ascending: true })
                    .order("created_at", { ascending: true }),

                client.from("product_flavors")
                    .select("catalog_id, product_id, flavor_id, additional_price, is_available, sort_order")
                    .eq("catalog_id", catalog.id)
            ]);

            if (flavorsRes && flavorsRes.error) {
                console.error("Erro ao carregar sabores do catálogo", flavorsRes.error);
                flavorsLoadError = flavorsRes.error;
            }
            if (pfRes && pfRes.error) {
                console.error("Erro ao carregar relações produto-sabor", pfRes.error);
                flavorsLoadError = flavorsLoadError || pfRes.error;
            }
        } catch (err) {
            console.error("Falha na requisição de sabores ou tabela ausente", err);
            flavorsLoadError = err;
        }
        flavors = (flavorsRes && !flavorsRes.error && flavorsRes.data) || [];
        productFlavors = (pfRes && !pfRes.error && pfRes.data) || [];

        selectedCategory = "all";
        typeFilter.value = "";
        groupFilter.value = "";
        searchInput.value = "";
        renderFacetOptions();
        loadingState.setAttribute("aria-busy", "false");
        showCatalog();
    }

    function renderFacetOptions() {
        [[typeFilter, "product_type", "Todos os tipos"], [groupFilter, "product_groups", "Todos os grupos"]].forEach(function (entry) {
            const values = organization.facets(products, entry[1]);
            entry[0].replaceChildren(new Option(entry[2], ""));
            values.forEach(function (value) { entry[0].appendChild(new Option(value, value)); });
            entry[0].closest("label").hidden = !values.length;
        });
        document.getElementById("organizationFilters").hidden = !typeFilter.options.length ||
            (typeFilter.options.length === 1 && groupFilter.options.length === 1);
    }

    typeFilter.addEventListener("change", renderProducts);
    groupFilter.addEventListener("change", renderProducts);

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
        typeFilter.value = "";
        groupFilter.value = "";
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
    restoreCartButton.addEventListener("click", function () {
        cart = sanitizeStoredCart(lastCart);
        saveCart();
        renderCart();
        showToast("Último carrinho restaurado.");
    });
    whatsappButton.addEventListener("click", function (event) {
        if (!ordersAvailable() || !getCartEntries().length) {
            event.preventDefault();
            return;
        }

        const minOrder = Number(catalog && catalog.minimum_order_quantity) || 0;
        const totalUnits = getCartEntries().reduce(function (sum, entry) { return sum + entry.quantity; }, 0);
        if (minOrder > 0 && totalUnits < minOrder) {
            event.preventDefault();
            showToast("Pedido mínimo de " + minOrder + " itens não atingido.");
            return;
        }

        if (whatsappButton.dataset.simulation === "true") {
            event.preventDefault();
            const entries = getCartEntries();
            const total = entries.reduce(function (sum, entry) { return sum + entry.totalPrice; }, 0);
            const message = buildOrderMessage(entries, total);
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(message).catch(function () { });
            }
            showToast("Demonstração: mensagem copiada para transferência. Nenhum pedido foi enviado.");
            return;
        }

        lastCart = Object.assign({}, cart);
        saveLastCart();
        window.setTimeout(function () {
            cart = {};
            saveCart();
            renderCart();
            showToast("Carrinho limpo. Você pode restaurar o último carrinho.");
        }, 0);
    });

    // Listeners do Modal de Sabores
    if (closeFlavorModal) closeFlavorModal.addEventListener("click", closeFlavorModalWindow);
    if (cancelFlavorModalButton) cancelFlavorModalButton.addEventListener("click", closeFlavorModalWindow);
    if (flavorModalOverlay) flavorModalOverlay.addEventListener("click", closeFlavorModalWindow);

    if (bundleQtyDecrease) {
        bundleQtyDecrease.addEventListener("click", function () {
            if (currentBundleTargetQty > 1) {
                currentBundleTargetQty--;
                updateFlavorModalState();
            }
        });
    }

    if (bundleQtyIncrease) {
        bundleQtyIncrease.addEventListener("click", function () {
            if (currentBundleTargetQty < 99) {
                currentBundleTargetQty++;
                updateFlavorModalState();
            }
        });
    }

    if (confirmFlavorModalButton) {
        confirmFlavorModalButton.addEventListener("click", function () {
            if (!currentModalProduct) return;
            const totalDistributed = modalAvailableFlavors.reduce(function (sum, f) { return sum + f.quantity; }, 0);
            if (totalDistributed !== currentBundleTargetQty) return;

            const selectedFlavors = modalAvailableFlavors.filter(function (f) { return f.quantity > 0; }).map(function (f) {
                return {
                    flavor_id: f.flavor_id,
                    name: f.name,
                    quantity: f.quantity,
                    additional_price: Number(f.additional_price) || 0
                };
            });

            const bundleKey = "bundle_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
            cart[bundleKey] = {
                id: bundleKey,
                product_id: currentModalProduct.id,
                quantity: currentBundleTargetQty,
                flavors: selectedFlavors
            };

            const addedProductName = currentModalProduct.name;
            saveCart();
            renderCart();
            closeFlavorModalWindow();
            showToast(addedProductName + " (" + currentBundleTargetQty + " un.) adicionado ao pedido.");
        });
    }

    window.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            if (flavorModal && !flavorModal.hidden) {
                closeFlavorModalWindow();
            } else if (cartDrawer && cartDrawer.classList.contains("cart-drawer--open")) {
                closeCart();
            }
        }
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
    window.NEOEFFEX_SUPABASE_CLIENT = client;
    window.dispatchEvent(new CustomEvent("neoeffex:client-ready", { detail: client }));
    loadCatalog();
}());
