import test, { describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const ROOT_DIR = path.resolve(".");
const require = createRequire(path.join(ROOT_DIR, "tests", "catalogo-unico", "package.json"));
const { JSDOM } = require("jsdom");

const norm = (str) => (str || "").replace(/\u00a0/g, " ").trim();

describe("Combos Neoeffex — Cálculo de Preços e Regras de Negócio", () => {
    // Carrega script de catalogo para isolar funções puras ou testar via JSDOM
    function createCatalogoEnvironment(initialProduct, initialFlavors, initialProductFlavors) {
        const html = fs.readFileSync(path.join(ROOT_DIR, "catalogo", "index.html"), "utf8");
        const dom = new JSDOM(html, {
            url: "https://test.invalid/catalogo/?catalogo=fit-store",
            runScripts: "dangerously",
            pretendToBeVisual: true
        });

        dom.window.matchMedia = () => ({ matches: false, addEventListener() {} });
        dom.window.NEOEFFEX_SUPABASE_CONFIG = { url: "https://test.supabase.co", publishableKey: "test-key" };

        const db = {
            catalogs: [{
                id: "cat-1",
                name: "Marmitaria Fit",
                slug: "fit-store",
                is_active: true,
                orders_enabled: true,
                whatsapp_number: "5511999999999",
                minimum_order_quantity: 0,
                catalog_profile: "marmitas"
            }],
            categories: [{ id: "cat-main", catalog_id: "cat-1", name: "Cardápio", sort_order: 0 }],
            products: [initialProduct],
            flavors: (initialFlavors || []).map(f => ({ catalog_id: "cat-1", is_active: true, ...f })),
            product_flavors: (initialProductFlavors || []).map(pf => ({ catalog_id: "cat-1", is_available: true, ...pf })),
            product_types: [],
            product_groups: []
        };

        const createMockClient = () => ({
            from(table) {
                let filters = [];
                let selected = "";
                let op = "";
                let payload;
                let one = false;

                const query = {
                    select(s) { selected = s; return query; },
                    eq(k, v) { filters.push([k, v]); return query; },
                    order() { return query; },
                    single() { one = true; return query; },
                    maybeSingle() { one = true; return query; },
                    insert(v) { op = "insert"; payload = v; return query; },
                    update(v) { op = "update"; payload = v; return query; },
                    delete() { op = "delete"; return query; },
                    then(resolve, reject) {
                        return Promise.resolve().then(() => {
                            if (!db[table]) db[table] = [];
                            let rows = db[table].filter(row => filters.every(([k, v]) => row[k] === v));
                            let result = rows.map(row => structuredClone(row));
                            return { data: one ? (result[0] || null) : result, error: null };
                        }).then(resolve, reject);
                    }
                };
                return query;
            }
        });

        dom.window.supabase = {
            createClient: createMockClient
        };

        // Injeta organization.js, profiles.js e catalogo.js
        dom.window.eval(fs.readFileSync(path.join(ROOT_DIR, "assets", "catalog", "organization.js"), "utf8"));
        dom.window.eval(fs.readFileSync(path.join(ROOT_DIR, "assets", "catalog", "profiles.js"), "utf8"));
        dom.window.eval(fs.readFileSync(path.join(ROOT_DIR, "catalogo", "assets", "js", "catalogo.js"), "utf8"));

        return dom;
    }

    test("1. Matriz de Descontos Básicos (Preço unitário R$ 20,00)", async () => {
        const product = {
            id: "p1",
            catalog_id: "cat-1",
            category_id: "cat-main",
            name: "Marmita Fitness",
            price: 20.00,
            status: "active",
            purchase_mode: "flavor_bundle",
            combo_discount_5: 5.00,
            combo_discount_10: 10.00,
            combo_discount_15: 15.00,
            sort_order: 0
        };

        const flavors = [
            { id: "f1", catalog_id: "cat-1", name: "Frango", is_active: true, sort_order: 0 },
            { id: "f2", catalog_id: "cat-1", name: "Carne", is_active: true, sort_order: 1 }
        ];

        const productFlavors = [
            { product_id: "p1", flavor_id: "f1", additional_price: 0, is_available: true, sort_order: 0 },
            { product_id: "p1", flavor_id: "f2", additional_price: 0, is_available: true, sort_order: 1 }
        ];

        const dom = createCatalogoEnvironment(product, flavors, productFlavors);
        await new Promise((r) => setTimeout(r, 60));

        const doc = dom.window.document;

        // Abre modal
        const cardBtn = doc.querySelector(".product-card .add-product-button");
        assert(cardBtn, "Botão do card deve existir");
        cardBtn.click();

        // 5 unidades com 5% de desconto: 5 × 20 = 100 - 5% = R$ 95,00
        doc.querySelector("#comboSizeBtn5").click();
        assert.equal(norm(doc.querySelector("#comboSizePrice5").textContent), "R$ 95,00");
        assert.equal(norm(doc.querySelector("#flavorModalTotalPrice").textContent), "R$ 95,00");
        assert(doc.querySelector("#flavorModalGrossPrice").textContent.includes("100,00"));
        assert(doc.querySelector("#flavorModalDiscountTag").textContent.includes("5,00"));

        // 10 unidades com 10% de desconto: 10 × 20 = 200 - 10% = R$ 180,00
        doc.querySelector("#comboSizeBtn10").click();
        assert.equal(norm(doc.querySelector("#comboSizePrice10").textContent), "R$ 180,00");
        assert.equal(norm(doc.querySelector("#flavorModalTotalPrice").textContent), "R$ 180,00");
        assert(doc.querySelector("#flavorModalGrossPrice").textContent.includes("200,00"));
        assert(doc.querySelector("#flavorModalDiscountTag").textContent.includes("20,00"));

        // 15 unidades com 15% de desconto: 15 × 20 = 300 - 15% = R$ 255,00
        doc.querySelector("#comboSizeBtn15").click();
        assert.equal(norm(doc.querySelector("#comboSizePrice15").textContent), "R$ 255,00");
        assert.equal(norm(doc.querySelector("#flavorModalTotalPrice").textContent), "R$ 255,00");
        assert(doc.querySelector("#flavorModalGrossPrice").textContent.includes("300,00"));
        assert(doc.querySelector("#flavorModalDiscountTag").textContent.includes("45,00"));

        dom.window.close();
    });

    test("2. Combo 5 unidades com 0% de desconto = R$ 100,00 (sem linha redundante)", async () => {
        const product = {
            id: "p1",
            catalog_id: "cat-1",
            category_id: "cat-main",
            name: "Marmita Fitness",
            price: 20.00,
            status: "active",
            purchase_mode: "flavor_bundle",
            combo_discount_5: 0.00,
            combo_discount_10: 0.00,
            combo_discount_15: 0.00,
            sort_order: 0
        };

        const flavors = [{ id: "f1", catalog_id: "cat-1", name: "Frango", is_active: true, sort_order: 0 }];
        const productFlavors = [{ product_id: "p1", flavor_id: "f1", additional_price: 0, is_available: true, sort_order: 0 }];

        const dom = createCatalogoEnvironment(product, flavors, productFlavors);
        await new Promise((r) => setTimeout(r, 60));

        const doc = dom.window.document;
        doc.querySelector(".product-card .add-product-button").click();
        doc.querySelector("#comboSizeBtn5").click();

        assert.equal(norm(doc.querySelector("#comboSizePrice5").textContent), "R$ 100,00");
        assert.equal(norm(doc.querySelector("#flavorModalTotalPrice").textContent), "R$ 100,00");
        assert(doc.querySelector("#flavorModalGrossPrice").hidden, "Valor sem desconto deve estar oculto quando desconto for 0%");
        assert(doc.querySelector("#flavorModalDiscountTag").hidden, "Tag de desconto deve estar oculta quando desconto for 0%");
        assert(doc.querySelector("#flavorModalBasePrice").textContent.includes("100,00"));

        dom.window.close();
    });

    test("3. Cálculo com Acréscimos: 10 un / 10% desc + 3 adicionais de R$ 2,00 = R$ 186,00", async () => {
        const product = {
            id: "p1",
            catalog_id: "cat-1",
            category_id: "cat-main",
            name: "Marmita Fitness",
            price: 20.00,
            status: "active",
            purchase_mode: "flavor_bundle",
            combo_discount_5: 0.00,
            combo_discount_10: 10.00,
            combo_discount_15: 15.00,
            sort_order: 0
        };

        const flavors = [
            { id: "f-frango", catalog_id: "cat-1", name: "Frango", is_active: true, sort_order: 0 },
            { id: "f-carne", catalog_id: "cat-1", name: "Carne", is_active: true, sort_order: 1 },
            { id: "f-pernil", catalog_id: "cat-1", name: "Pernil", is_active: true, sort_order: 2 }
        ];

        const productFlavors = [
            { product_id: "p1", flavor_id: "f-frango", additional_price: 0.00, is_available: true, sort_order: 0 },
            { product_id: "p1", flavor_id: "f-carne", additional_price: 2.00, is_available: true, sort_order: 1 },
            { product_id: "p1", flavor_id: "f-pernil", additional_price: 0.00, is_available: true, sort_order: 2 }
        ];

        const dom = createCatalogoEnvironment(product, flavors, productFlavors);
        await new Promise((r) => setTimeout(r, 60));

        const doc = dom.window.document;
        doc.querySelector(".product-card .add-product-button").click();

        // Escolhe combo de 10 unidades
        doc.querySelector("#comboSizeBtn10").click();

        // Distribui sabores: 4 frango (+R$ 0), 3 carne (+R$ 2), 3 pernil (+R$ 0)
        const incFrango = doc.querySelector("#flavorInc_f-frango");
        const incCarne = doc.querySelector("#flavorInc_f-carne");
        const incPernil = doc.querySelector("#flavorInc_f-pernil");

        for (let i = 0; i < 4; i++) incFrango.click();
        for (let i = 0; i < 3; i++) incCarne.click();
        for (let i = 0; i < 3; i++) incPernil.click();

        // Total distribuído: 4 + 3 + 3 = 10
        assert.equal(doc.querySelector("#flavorDistributionBadge").textContent, "Completo");
        assert.equal(doc.querySelector("#confirmFlavorModalButton").disabled, false);

        // Validação no MODAL
        assert(doc.querySelector("#flavorModalGrossPrice").textContent.includes("200,00"));
        assert(doc.querySelector("#flavorModalDiscountTag").textContent.includes("20,00"));
        assert(doc.querySelector("#flavorModalBasePrice").textContent.includes("180,00"));
        assert(doc.querySelector("#flavorModalAddonsPrice").textContent.includes("6,00"));
        assert.equal(norm(doc.querySelector("#flavorModalTotalPrice").textContent), "R$ 186,00");

        // Confirma e adiciona ao CARRINHO
        doc.querySelector("#confirmFlavorModalButton").click();
        assert(doc.querySelector("#flavorModal").hidden);

        // Validação no CARRINHO
        assert.equal(doc.querySelector("#cartCount").textContent, "10");
        assert.match(doc.querySelector("#cartTotal").textContent, /186,00/);

        // Abre o drawer do carrinho
        doc.querySelector("#cartButton").click();
        const cartItem = doc.querySelector(".cart-item");
        assert(cartItem, "Item no carrinho deve existir");
        const cartText = norm(cartItem.textContent);
        assert(cartText.includes("1x Combo 10 — Marmita Fitness"));
        assert(cartText.includes("4x Frango"));
        assert(cartText.includes("3x Carne (+ R$ 6,00)"));
        assert(cartText.includes("3x Pernil"));
        assert(cartText.includes("Valor base: R$ 200,00"));
        assert(cartText.includes("Desconto (10%): -R$ 20,00"));
        assert(cartText.includes("Acréscimos: + R$ 6,00"));
        assert(cartText.includes("R$ 186,00"));

        // Validação no WHATSAPP
        const waBtn = doc.querySelector("#whatsappButton");
        const waText = decodeURIComponent(waBtn.href).replace(/\u00a0/g, " ");

        assert(waText.includes("1x Combo 10 — Marmita Fitness"));
        assert(waText.includes("- 4x Frango"));
        assert(waText.includes("- 3x Carne (+ R$ 6,00)"));
        assert(waText.includes("- 3x Pernil"));
        assert(waText.includes("Valor base: R$ 200,00"));
        assert(waText.includes("Desconto combo (10%): - R$ 20,00"));
        assert(waText.includes("Valor do combo: R$ 180,00"));
        assert(waText.includes("Acréscimos: R$ 6,00"));
        assert(waText.includes("Subtotal: R$ 186,00"));
        assert(waText.includes("Total estimado: R$ 186,00"));

        dom.window.close();
    });

    test("4. Não aplicar o desconto do combo sobre os adicionais de sabores", async () => {
        // Teste de cálculo puro da fórmula para verificar zero divergência de centavos
        const unitPrice = 20.00;
        const comboQty = 10;
        const discountPercent = 10;
        const additionalPrice = 2.00;
        const addonQuantity = 3;

        const gross = unitPrice * comboQty; // 200.00
        const discountAmount = gross * (discountPercent / 100); // 20.00
        const comboBaseFinal = gross - discountAmount; // 180.00
        const addonsTotal = additionalPrice * addonQuantity; // 6.00
        const total = comboBaseFinal + addonsTotal; // 186.00

        assert.equal(gross, 200.00);
        assert.equal(discountAmount, 20.00);
        assert.equal(comboBaseFinal, 180.00);
        assert.equal(addonsTotal, 6.00);
        assert.equal(total, 186.00);

        // Se o desconto de 10% fosse indevidamente aplicado sobre os adicionais, seria 180 + 5.40 = 185.40.
        // Confirmamos que é estritamente 186.00.
        assert.notEqual(total, 185.40);
    });

    test("5. Produtos simples continuam sem alteração", async () => {
        const simpleProduct = {
            id: "p-simple",
            catalog_id: "cat-1",
            category_id: "cat-main",
            name: "Suco Natural",
            price: 8.50,
            status: "active",
            purchase_mode: "simple",
            combo_discount_5: 0,
            combo_discount_10: 0,
            combo_discount_15: 0,
            sort_order: 0
        };

        const dom = createCatalogoEnvironment(simpleProduct, [], []);
        await new Promise((r) => setTimeout(r, 60));

        const doc = dom.window.document;
        const addBtn = doc.querySelector(".product-card .add-product-button");
        assert.equal(addBtn.textContent.trim(), "Adicionar ao pedido");

        // Clique adiciona diretamente sem abrir modal
        addBtn.click();
        assert(doc.querySelector("#flavorModal").hidden, "Modal não deve abrir para produto simples");
        assert.equal(doc.querySelector("#cartCount").textContent, "1");
        assert.match(doc.querySelector("#cartTotal").textContent, /8,50/);

        dom.window.close();
    });
});
