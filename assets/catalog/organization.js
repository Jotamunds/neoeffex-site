(function (root) {
    "use strict";

    function key(value) { return String(value || "").trim().toLocaleLowerCase("pt-BR"); }

    function parseGroups(value) {
        const seen = new Set();
        return String(value || "").split(",").map(function (item) { return item.trim(); })
            .filter(function (item) {
                if (!item || seen.has(key(item))) return false;
                seen.add(key(item));
                return true;
            });
    }

    function categoryLabel(categories, categoryId) {
        const category = categories.find(function (item) { return item.id === categoryId; });
        if (!category) return "Categoria indisponível";
        const parent = categories.find(function (item) { return item.id === category.parent_id; });
        return parent ? parent.name + " / " + category.name : category.name;
    }

    function orderedCategories(categories) {
        const ordered = [];
        categories.filter(function (item) { return !item.parent_id; }).forEach(function (parent) {
            ordered.push(parent);
            categories.filter(function (item) { return item.parent_id === parent.id; }).forEach(function (child) {
                ordered.push(child);
            });
        });
        // Preserva itens legíveis se uma resposta incompleta omitir o pai.
        categories.forEach(function (item) { if (!ordered.includes(item)) ordered.push(item); });
        return ordered;
    }

    function matchesCategory(product, selected, categories) {
        if (selected === "all" || product.category_id === selected) return true;
        const category = categories.find(function (item) { return item.id === product.category_id; });
        return Boolean(category && category.parent_id === selected);
    }

    function matchesFacets(product, type, group) {
        return (!type || key(product.product_type) === key(type))
            && (!group || (product.product_groups || []).some(function (item) { return key(item) === key(group); }));
    }

    function facets(products, field) {
        const values = new Map();
        products.forEach(function (product) {
            const items = Array.isArray(product[field]) ? product[field] : [product[field]];
            items.filter(Boolean).forEach(function (item) { if (!values.has(key(item))) values.set(key(item), item); });
        });
        return Array.from(values.values()).sort(function (a, b) { return a.localeCompare(b, "pt-BR"); });
    }

    function missingOrganizationColumn(error) {
        return Boolean(error && ["42703", "PGRST204"].includes(error.code)
            && /parent_id|product_type|product_groups/.test(error.message || ""));
    }

    async function loadRows(client, catalogId, publicOnly) {
        async function query(extended) {
            const categories = client.from("categories")
                .select("id, catalog_id, name, sort_order, created_at" + (extended ? ", parent_id" : ""))
                .eq("catalog_id", catalogId).order("sort_order", { ascending: true }).order("created_at", { ascending: true });
            let products = client.from("products")
                .select("id, catalog_id, name, description, category_id, price, status, image_path, sort_order, created_at"
                    + (extended ? ", product_type, product_groups" : ""))
                .eq("catalog_id", catalogId);
            if (publicOnly) products = products.eq("status", "active");
            products = products.order("sort_order", { ascending: true }).order("created_at", { ascending: true });
            return Promise.all([categories, products]);
        }
        let results = await query(true);
        const legacy = results.some(function (result) { return missingOrganizationColumn(result.error); });
        if (legacy) results = await query(false);
        return { categories: results[0], products: results[1], enabled: !legacy };
    }

    const api = Object.freeze({ key: key, parseGroups: parseGroups, categoryLabel: categoryLabel,
        orderedCategories: orderedCategories, matchesCategory: matchesCategory,
        matchesFacets: matchesFacets, facets: facets, loadRows: loadRows });
    if (typeof module === "object" && module.exports) module.exports = api;
    else root.NEOEFFEX_ORGANIZATION = api;
})(typeof window === "object" ? window : globalThis);
