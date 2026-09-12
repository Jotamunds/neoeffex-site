/**
 * Testes Automatizados de Regressão e Estabilização — v0.3.9
 * Neoeffex Catalog Platform
 *
 * Cobre:
 * 1. Editor de imagens (idempotência, botão único, ciclo Apply/bypass, suporte aos 3 inputs)
 * 2. Ciclo de vida do formulário e botão de sabores (saveFlavor)
 * 3. Ciclo de vida das imagens de sabores e limpeza do Storage
 * 4. Sincronização segura e não destrutiva produto <-> sabores (syncProductFlavors)
 * 5. Layout e responsividade do Admin (.settings-form__grid)
 * 6. Tema Lu (proporções 1:1, 3:4, 4:3 e object-fit: contain)
 * 7. Catálogo público mobile (h3 break-word, modal de sabores)
 * 8. Cache busting e versionamento consistente v0.3.9
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const rootDir = path.resolve(import.meta.dirname, "..");
const { JSDOM } = require(path.join(rootDir, "tests/catalogo-unico/node_modules/jsdom"));

describe("Estabilização v0.3.9 — Editor de Imagens", () => {
    test("idempotencia_e_botao_unico_de_ajuste", () => {
        const dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <head></head>
            <body>
                <input type="file" id="productImage" accept="image/*">
                <div class="product-image-preview" id="productImagePreview">
                    <img id="productImagePreviewImg" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style="display:block;">
                </div>
                <input type="file" id="flavorImage" accept="image/*">
                <div class="product-image-preview" id="flavorImagePreview">
                    <img id="flavorImagePreviewImg" src="" style="display:none;">
                </div>
                <input type="file" id="catalogLogo" accept="image/*">
                <div class="product-image-preview" id="catalogLogoPreview">
                    <img id="catalogLogoPreviewImg" src="" style="display:none;">
                </div>
            </body>
            </html>
        `, { url: "https://admin.neoeffex.local" });

        const { window } = dom;
        globalThis.window = window;
        globalThis.document = window.document;
        globalThis.HTMLElement = window.HTMLElement;
        globalThis.CustomEvent = window.CustomEvent;

        const editorCode = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Executar primeira vez
        window.eval(editorCode);
        assert.equal(window.__NEOEFFEX_IMAGE_EDITOR_INITIALIZED__, true);

        // Chamar setupInputs novamente
        window.NEOEFFEX_IMAGE_EDITOR.setupInputs();
        window.NEOEFFEX_IMAGE_EDITOR.setupInputs();

        // Verificar que cada input tem exatamente 1 botão de lançamento
        const prodInput = window.document.getElementById("productImage");
        const prodWrapper = prodInput.closest(".image-editor-field") || prodInput.parentElement;
        const prodButtons = prodWrapper.querySelectorAll(".image-editor-launch");
        assert.equal(prodButtons.length, 1, "productImage deve ter exatamente 1 botão");

        const flavorInput = window.document.getElementById("flavorImage");
        const flavorWrapper = flavorInput.closest(".image-editor-field") || flavorInput.parentElement;
        const flavorButtons = flavorWrapper.querySelectorAll(".image-editor-launch");
        assert.equal(flavorButtons.length, 1, "flavorImage deve ter exatamente 1 botão");

        const logoInput = window.document.getElementById("catalogLogo");
        const logoWrapper = logoInput.closest(".image-editor-field") || logoInput.parentElement;
        const logoButtons = logoWrapper.querySelectorAll(".image-editor-launch");
        assert.equal(logoButtons.length, 1, "catalogLogo deve ter exatamente 1 botão");

        // Executar código do editor uma segunda vez (simulando duplo carregamento por script tag)
        window.eval(editorCode);

        const prodButtonsAfter = prodWrapper.querySelectorAll(".image-editor-launch");
        assert.equal(prodButtonsAfter.length, 1, "Duplo carregamento de script não deve duplicar botão");
    });

    test("catalog_identity_sem_duplo_loader_de_image_editor", () => {
        const identityJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/catalog-identity.js"), "utf8");
        // Não deve mais ter loadImageEditorModule() concorrendo com admin/index.html
        assert.equal(identityJs.includes("function loadImageEditorModule()"), false);
        assert.equal(identityJs.includes("loadImageEditorModule()"), false);
    });

    test("image_editor_bypass_flag_protege_contra_reabertura", () => {
        const editorCode = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");
        // Deve setar dataset.imageEditorBypass antes de despachar change e remover depois de propagar
        assert.match(editorCode, /input\.dataset\.imageEditorBypass\s*=\s*"true"/);
        assert.match(editorCode, /if\s*\(input\.dataset\.imageEditorBypass\s*===\s*"true"\)/);
    });
});

describe("Estabilização v0.3.9 — Gerenciamento e Ciclo de Vida de Sabores", () => {
    test("saveFlavorButton_centralizado_no_finally_e_openFlavorForm", () => {
        const adminJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/admin.js"), "utf8");

        // saveFlavor deve ter bloco finally garantindo reativação
        assert.match(adminJs, /async function saveFlavor\s*\([^)]*\)\s*\{[\s\S]*?finally\s*\{[\s\S]*?saveFlavorButton\.disabled\s*=\s*false/);
        assert.match(adminJs, /saveFlavorButton\.textContent\s*=\s*[\s\S]*?"Salvar alterações"[\s\S]*?"Salvar sabor"/);

        // openFlavorForm deve garantir habilitado
        assert.match(adminJs, /function openFlavorForm\s*\([^)]*\)\s*\{[\s\S]*?saveFlavorButton\.disabled\s*=\s*false/);
    });

    test("flavor_image_substituicao_limpa_imagem_antiga_somente_apos_sucesso_db", () => {
        const adminJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/admin.js"), "utf8");

        // Deve guardar previousImagePath
        assert.match(adminJs, /const previousImagePath = existingFlavor && existingFlavor\.image_path;/);

        // Se upload ok e update ok, remove previousImagePath
        assert.match(adminJs, /if \(shouldRemovePreviousImage && previousImagePath\) \{[\s\S]*?const removeErr = await removeStoredProductImage\(previousImagePath\);/);

        // Se update falhar após upload, deve limpar uploadedImagePath (rollback de storage)
        assert.match(adminJs, /if \(uploadedImagePath\) \{[\s\S]*?await removeStoredProductImage\(uploadedImagePath\);/);
    });

    test("flavor_image_novo_sabor_trata_erro_de_update_sem_sucesso_falso", () => {
        const adminJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/admin.js"), "utf8");

        // Validação estrita do resultado de update de image_path para novo sabor
        assert.match(adminJs, /if \(updatePathRes\.error\) \{[\s\S]*?await removeStoredProductImage\(uploadedImagePath\);[\s\S]*?await client\.from\("flavors"\)\.delete\(\)\.eq\("id", savedFlavorId\)/);
    });

    test("exclusao_de_sabor_reporta_erro_de_storage", () => {
        const adminJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/admin.js"), "utf8");

        // deletePendingItem para flavors checa remoção de imagem
        assert.match(adminJs, /const storageErr = await removeStoredProductImage\(deletion\.image_path\);/);
        assert.match(adminJs, /Sabor excluído, mas a foto não pôde ser removida do armazenamento/);
    });
});

describe("Estabilização v0.3.9 — Sincronização Produto <-> Sabores (syncProductFlavors)", () => {
    test("syncProductFlavors_utiliza_estrategia_diferencial_nao_destrutiva", async () => {
        const adminJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/admin.js"), "utf8");

        // Verifica que syncProductFlavors está definido e exposto para testes
        assert.match(adminJs, /async function syncProductFlavors\(productId, selectedFlavors\)/);
        assert.match(adminJs, /window\.NEOEFFEX_ADMIN_FLAVORS/);

        // Testar lógica isolada de syncProductFlavors
        const existingInDb = [
            { id: "pf-1", product_id: "prod-1", flavor_id: "fl-1", catalog_id: "cat-1", sort_order: 10, additional_price: 0, is_available: true },
            { id: "pf-2", product_id: "prod-1", flavor_id: "fl-2", catalog_id: "cat-1", sort_order: 20, additional_price: 5, is_available: true }
        ];

        let deleteCalledWith = [];
        let insertCalledWith = [];
        let updateCalledWith = [];

        function createChainableQuery(opType) {
            const query = {
                eq() { return query; },
                in(col, vals) {
                    if (opType === "delete") deleteCalledWith.push(...vals);
                    return query;
                },
                then(resolve, reject) {
                    if (opType === "select") {
                        return Promise.resolve({ data: [...existingInDb], error: null }).then(resolve, reject);
                    }
                    return Promise.resolve({ data: null, error: null }).then(resolve, reject);
                }
            };
            return query;
        }

        const mockClient = {
            from(table) {
                if (table !== "product_flavors") throw new Error("Unexpected table " + table);
                return {
                    select() { return createChainableQuery("select"); },
                    insert(rows) {
                        insertCalledWith.push(...rows);
                        return Promise.resolve({ error: null });
                    },
                    update(payload) {
                        updateCalledWith.push(payload);
                        return createChainableQuery("update");
                    },
                    delete() {
                        return createChainableQuery("delete");
                    }
                };
            }
        };

        const syncFnSlice = adminJs.slice(
            adminJs.indexOf("async function syncProductFlavors"),
            adminJs.indexOf("function renderFlavors()")
        );
        const testSync = new Function("client", "activeCatalog", "productFlavorsRelations", `
            ${syncFnSlice}
            return syncProductFlavors;
        `)(mockClient, { id: "cat-1" }, []);

        // 1. Manter fl-1 (mesmos dados), atualizar fl-2 (nova ordem), adicionar fl-3
        await testSync("prod-1", [
            { flavor_id: "fl-1", catalog_id: "cat-1", sort_order: 10, additional_price: 0, is_available: true },
            { flavor_id: "fl-2", catalog_id: "cat-1", sort_order: 30, additional_price: 5, is_available: true },
            { flavor_id: "fl-3", catalog_id: "cat-1", sort_order: 40, additional_price: 0, is_available: true }
        ]);

        // fl-3 deve ser inserido
        assert.equal(insertCalledWith.length, 1);
        assert.equal(insertCalledWith[0].flavor_id, "fl-3");

        // fl-2 deve ser atualizado
        assert.equal(updateCalledWith.length, 1);
        assert.equal(updateCalledWith[0].sort_order, 30);

        // Nenhum foi removido
        assert.equal(deleteCalledWith.length, 0);

        // 2. Agora remover fl-1
        insertCalledWith = [];
        updateCalledWith = [];
        deleteCalledWith = [];

        await testSync("prod-1", [
            { flavor_id: "fl-2", catalog_id: "cat-1", sort_order: 20, additional_price: 5, is_available: true }
        ]);

        // fl-1 deve ser deletado
        assert.equal(deleteCalledWith.length, 1);
        assert.equal(deleteCalledWith[0], "fl-1");
    });

    test("syncProductFlavors_falha_de_insert_nao_deleta_relacoes_existentes_previamente", async () => {
        const adminJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/admin.js"), "utf8");

        const existingInDb = [
            { id: "pf-1", product_id: "prod-1", flavor_id: "fl-1", catalog_id: "cat-1", sort_order: 10, additional_price: 0, is_available: true }
        ];

        let deleteExecuted = false;

        function createChainableQuery(opType) {
            const query = {
                eq() { return query; },
                in(col, vals) {
                    if (opType === "delete") deleteExecuted = true;
                    return query;
                },
                then(resolve, reject) {
                    if (opType === "select") {
                        return Promise.resolve({ data: [...existingInDb], error: null }).then(resolve, reject);
                    }
                    return Promise.resolve({ data: null, error: null }).then(resolve, reject);
                }
            };
            return query;
        }

        const mockClient = {
            from(table) {
                return {
                    select() { return createChainableQuery("select"); },
                    insert(rows) {
                        return Promise.resolve({ error: new Error("Falha simulada de inserção") });
                    },
                    delete() {
                        deleteExecuted = true;
                        return createChainableQuery("delete");
                    }
                };
            }
        };

        const syncFnSlice = adminJs.slice(
            adminJs.indexOf("async function syncProductFlavors"),
            adminJs.indexOf("function renderFlavors()")
        );
        const testSync = new Function("client", "activeCatalog", "productFlavorsRelations", `
            ${syncFnSlice}
            return syncProductFlavors;
        `)(mockClient, { id: "cat-1" }, []);

        // Tentar sync que adiciona fl-2 mas falha no insert
        const res = await testSync("prod-1", [
            { flavor_id: "fl-1", catalog_id: "cat-1", sort_order: 10, additional_price: 0, is_available: true },
            { flavor_id: "fl-2", catalog_id: "cat-1", sort_order: 20, additional_price: 0, is_available: true }
        ]);

        assert.ok(res.error, "Deve retornar erro na inserção");
        assert.equal(deleteExecuted, false, "DELETE não deve ser executado se o INSERT falhar");
    });
});

describe("Estabilização v0.3.9 — Layout e Responsividade", () => {
    test("admin_settings_form_grid_usa_css_grid_sem_esticamento", () => {
        const adminCss = fs.readFileSync(path.join(rootDir, "admin/assets/css/admin.css"), "utf8");

        // .settings-form__grid usa display: grid e align-items: start
        assert.match(adminCss, /\.settings-form__grid\s*\{[^}]*display:\s*grid;/);
        assert.match(adminCss, /\.settings-form__grid\s*\{[^}]*grid-template-columns:\s*repeat\(12,\s*1fr\);/);
        assert.match(adminCss, /\.settings-form__grid\s*\{[^}]*align-items:\s*start;/);

        // Mobile usa 1fr
        assert.match(adminCss, /@media\s*\(max-width:\s*700px\)\s*\{[\s\S]*?\.settings-form__grid\s*\{[^}]*grid-template-columns:\s*1fr;/);
    });

    test("admin_inputs_e_selects_com_min_height_adequado", () => {
        const adminCss = fs.readFileSync(path.join(rootDir, "admin/assets/css/admin.css"), "utf8");

        assert.match(adminCss, /\.settings-form\s+input\[type="text"\][^}]*min-height:\s*42px;/);
        assert.match(adminCss, /\.settings-form\s+textarea\s*\{[^}]*min-height:\s*68px;/);
    });

    test("lu_theme_respeita_todas_as_proporcoes_de_logo", () => {
        const luCss = fs.readFileSync(path.join(rootDir, "catalogo/assets/css/themes/lu-leve-e-saudavel.css"), "utf8");

        // Proporções explícitas
        assert.match(luCss, /\.catalog-identity-logo\[data-ratio="square"\][^}]*aspect-ratio:\s*1\s*\/\s*1;/);
        assert.match(luCss, /\.catalog-identity-logo\[data-ratio="portrait_3_4"\][^}]*aspect-ratio:\s*3\s*\/\s*4;/);
        assert.match(luCss, /\.catalog-identity-logo\[data-ratio="landscape_4_3"\][^}]*aspect-ratio:\s*4\s*\/\s*3;/);

        // Logo usa object-fit: contain para não cortar
        assert.match(luCss, /\.catalog-identity-logo\s+img\s*\{[^}]*object-fit:\s*contain;/);
    });

    test("catalogo_mobile_prevencao_overflow_e_modal_sabores", () => {
        const catalogoCss = fs.readFileSync(path.join(rootDir, "catalogo/assets/css/catalogo.css"), "utf8");

        // h3 quebra texto longo para evitar estouro
        assert.match(catalogoCss, /\.product-card\s+h3\s*\{[^}]*overflow-wrap:\s*anywhere;/);
        assert.match(catalogoCss, /\.product-card\s+h3\s*\{[^}]*word-break:\s*break-word;/);

        // modal sabores item colunas mobile
        assert.match(catalogoCss, /\.flavor-selection-item\s*\{[^}]*grid-template-columns:\s*40px\s+minmax\(0,\s*1fr\)\s+auto;/);
    });
});

describe("Estabilização v0.3.9 — Cache Busting e Versionamento", () => {
    test("versao_0_3_9_sincronizada_nos_arquivos_de_versao", () => {
        const adminVersion = fs.readFileSync(path.join(rootDir, "admin/VERSION"), "utf8").trim();
        const catalogoVersion = fs.readFileSync(path.join(rootDir, "catalogo/VERSION"), "utf8").trim();

        assert.equal(adminVersion, "0.3.9");
        assert.equal(catalogoVersion, "0.3.9");
    });

    test("admin_html_e_config_apontam_para_v0_3_9", () => {
        const adminHtml = fs.readFileSync(path.join(rootDir, "admin/index.html"), "utf8");
        const adminConfig = fs.readFileSync(path.join(rootDir, "admin/config.js"), "utf8");
        const adminIdentity = fs.readFileSync(path.join(rootDir, "admin/assets/js/catalog-identity.js"), "utf8");

        assert.match(adminHtml, /admin\.css\?v=0\.3\.9/);
        assert.match(adminHtml, /admin\.js\?v=0\.3\.9/);
        assert.match(adminHtml, /ADMIN\s*\/\s*0\.3\.9/);

        assert.match(adminConfig, /catalog-identity\.css\?v=0\.3\.9/);
        assert.match(adminConfig, /catalog-identity\.js\?v=0\.3\.9/);

        assert.match(adminIdentity, /ADMIN\s*\/\s*0\.3\.9/);
        assert.match(adminIdentity, /Catálogo v0\.3\.9 disponível/);
    });

    test("catalogo_html_e_config_apontam_para_v0_3_9", () => {
        const catalogoHtml = fs.readFileSync(path.join(rootDir, "catalogo/index.html"), "utf8");
        const catalogoConfig = fs.readFileSync(path.join(rootDir, "catalogo/config.js"), "utf8");

        assert.match(catalogoHtml, /catalogo\.css\?v=0\.3\.9/);
        assert.match(catalogoHtml, /catalogo\.js\?v=0\.3\.9/);

        assert.match(catalogoConfig, /catalog-identity\.css\?v=0\.3\.9/);
        assert.match(catalogoConfig, /catalog-identity\.js\?v=0\.3\.9/);
        assert.match(catalogoConfig, /themes\/lu-leve-e-saudavel\.css\?v=0\.3\.9/);
    });

    test("changelog_contem_versao_0_3_9", () => {
        const changelog = fs.readFileSync(path.join(rootDir, "admin/CHANGELOG.md"), "utf8");
        assert.match(changelog, /## \[0\.3\.9\] - 2026-09-12/);
    });
});
