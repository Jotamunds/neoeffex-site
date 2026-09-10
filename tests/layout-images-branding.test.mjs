/**
 * Testes Automatizados — Layout, Imagens e Branding Neoeffex
 * Suíte de testes abrangente cobrindo os requisitos de PLANO_LAYOUT_IMAGENS_BRANDING_NEOEFFEX.md
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const rootDir = path.resolve(import.meta.dirname, "..");
const { JSDOM } = require(path.join(rootDir, "tests/catalogo-unico/node_modules/jsdom"));

describe("Layout, Imagens e Branding Neoeffex", () => {

    test("product_image_square", () => {
        const adminCss = fs.readFileSync(path.join(rootDir, "admin/assets/css/admin.css"), "utf8");
        const catalogoCss = fs.readFileSync(path.join(rootDir, "catalogo/assets/css/catalogo.css"), "utf8");

        // Admin product-image-preview deve ter aspect-ratio: 1 / 1 e object-fit: cover
        assert.match(adminCss, /\.product-image-preview\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/);
        assert.match(adminCss, /\.product-image-preview\s+img\s*\{[^}]*object-fit:\s*cover/);

        // Catalogo product-card__media deve ter aspect-ratio: 1 / 1
        assert.match(catalogoCss, /\.product-card__media\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/);
        assert.match(catalogoCss, /\.product-card__image\s*\{[^}]*object-fit:\s*cover/);
    });

    test("flavor_image_square", () => {
        const adminHtml = fs.readFileSync(path.join(rootDir, "admin/index.html"), "utf8");
        const catalogoCss = fs.readFileSync(path.join(rootDir, "catalogo/assets/css/catalogo.css"), "utf8");

        // Admin flavor preview usa .product-image-preview (1:1)
        assert.match(adminHtml, /class="product-image-preview"\s+id="flavorImagePreview"/);

        // Catalogo modal de sabores media e image devem ter aspect-ratio 1:1 e object-fit cover
        assert.match(catalogoCss, /\.flavor-selection-item__media\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/);
        assert.match(catalogoCss, /\.flavor-selection-item__image\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/);
        assert.match(catalogoCss, /\.flavor-selection-item__image\s*\{[^}]*object-fit:\s*cover/);
    });

    test("logo_ratio_default_square", () => {
        const migrationSql = fs.readFileSync(path.join(rootDir, "supabase/migrations/20260910200000_catalog_logo_aspect_ratio.sql"), "utf8");
        const adminIdentityJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/catalog-identity.js"), "utf8");
        const catalogoJs = fs.readFileSync(path.join(rootDir, "catalogo/assets/js/catalogo.js"), "utf8");
        const catalogoIdentityJs = fs.readFileSync(path.join(rootDir, "catalogo/assets/js/catalog-identity.js"), "utf8");

        // Migration define default 'square'
        assert.match(migrationSql, /default\s+'square'/);

        // Admin catalog-identity define square como padrão
        assert.match(adminIdentityJs, /value:\s*"square"/);
        assert.match(adminIdentityJs, /opt\.value\s*===\s*"square"/);

        // Catalogo JS faz fallback para square
        assert.match(catalogoJs, /catalog\.logo_aspect_ratio\s*=\s*catalog\.logo_aspect_ratio\s*\|\|\s*"square"/);
        assert.match(catalogoIdentityJs, /catalog\.logo_aspect_ratio\)\s*\|\|\s*"square"/);
    });

    test("logo_ratio_square", () => {
        const catalogoIdentityCss = fs.readFileSync(path.join(rootDir, "catalogo/assets/css/catalog-identity.css"), "utf8");
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Regra CSS para logo quadrada 1:1
        assert.match(catalogoIdentityCss, /\.catalog-identity-logo--square[^}]*aspect-ratio:\s*1\s*\/\s*1/);

        // Image editor configura dimensões de logo quadrada (~1000x1000)
        assert.match(imageEditorJs, /square:\s*Object\.freeze\(\{\s*width:\s*1000,\s*height:\s*1000/);
    });

    test("logo_ratio_portrait_3_4", () => {
        const catalogoIdentityCss = fs.readFileSync(path.join(rootDir, "catalogo/assets/css/catalog-identity.css"), "utf8");
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Regra CSS para logo vertical 3:4
        assert.match(catalogoIdentityCss, /\.catalog-identity-logo--portrait_3_4[^}]*aspect-ratio:\s*3\s*\/\s*4/);

        // Image editor configura dimensões de logo vertical (~900x1200)
        assert.match(imageEditorJs, /portrait_3_4:\s*Object\.freeze\(\{\s*width:\s*900,\s*height:\s*1200/);
    });

    test("logo_ratio_landscape_4_3", () => {
        const catalogoIdentityCss = fs.readFileSync(path.join(rootDir, "catalogo/assets/css/catalog-identity.css"), "utf8");
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Regra CSS para logo horizontal 4:3
        assert.match(catalogoIdentityCss, /\.catalog-identity-logo--landscape_4_3[^}]*aspect-ratio:\s*4\s*\/\s*3/);

        // Image editor configura dimensões de logo horizontal (~1200x900)
        assert.match(imageEditorJs, /landscape_4_3:\s*Object\.freeze\(\{\s*width:\s*1200,\s*height:\s*900/);
    });

    test("logo_ratio_legacy_fallback", () => {
        const adminJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/admin.js"), "utf8");
        const adminIdentityJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/catalog-identity.js"), "utf8");
        const catalogoJs = fs.readFileSync(path.join(rootDir, "catalogo/assets/js/catalogo.js"), "utf8");

        // Fallback no admin caso a coluna logo_aspect_ratio não exista ainda
        assert.match(adminJs, /column\.\*logo_aspect_ratio/);
        assert.match(adminIdentityJs, /result\.error\.code\s*===\s*"42703"/);

        // Fallback no catálogo
        assert.match(catalogoJs, /logo_aspect_ratio/);
    });

    test("image_editor_product", () => {
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Configuração de produto: kind "product", 1200x1200, 1:1, max 5MB
        assert.match(imageEditorJs, /productImage:\s*Object\.freeze\(\{[\s\S]*?kind:\s*"product"/);
        assert.match(imageEditorJs, /productImage:\s*Object\.freeze\(\{[\s\S]*?width:\s*1200,\s*height:\s*1200/);
        assert.match(imageEditorJs, /productImage:\s*Object\.freeze\(\{[\s\S]*?maximumSourceBytes:\s*5\s*\*\s*1024\s*\*\s*1024/);
    });

    test("image_editor_flavor", () => {
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Configuração de sabor: kind "flavor", 1200x1200, 1:1, max 5MB
        assert.match(imageEditorJs, /flavorImage:\s*Object\.freeze\(\{[\s\S]*?kind:\s*"flavor"/);
        assert.match(imageEditorJs, /flavorImage:\s*Object\.freeze\(\{[\s\S]*?width:\s*1200,\s*height:\s*1200/);
        assert.match(imageEditorJs, /flavorImage:\s*Object\.freeze\(\{[\s\S]*?maximumSourceBytes:\s*5\s*\*\s*1024\s*\*\s*1024/);
    });

    test("image_editor_logo", () => {
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Configuração de logo: kind "logo", proporções dinâmicas, max 2MB
        assert.match(imageEditorJs, /catalogLogo:\s*Object\.freeze\(\{[\s\S]*?kind:\s*"logo"/);
        assert.match(imageEditorJs, /catalogLogo:\s*Object\.freeze\(\{[\s\S]*?ratios:\s*Object\.freeze\(\{/);
        assert.match(imageEditorJs, /catalogLogo:\s*Object\.freeze\(\{[\s\S]*?maximumSourceBytes:\s*2\s*\*\s*1024\s*\*\s*1024/);
    });

    test("image_editor_existing_product", () => {
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Permite abrir editor a partir de imagem já existente sem selecionar novo arquivo
        assert.match(imageEditorJs, /openFromLaunchButton/);
        assert.match(imageEditorJs, /loadImageToBlobViaCanvas/);
        assert.match(imageEditorJs, /openEditor/);
    });

    test("image_editor_existing_flavor", () => {
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Sabor possui suporte ao botão de ajustar foto atual
        assert.match(imageEditorJs, /if\s*\(input\.id\s*===\s*"flavorImage"\)/);
        assert.match(imageEditorJs, /document\.getElementById\("flavorImagePreviewImage"\)/);
    });

    test("image_editor_existing_logo", () => {
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Logo possui suporte ao botão de ajustar foto atual
        assert.match(imageEditorJs, /document\.getElementById\("catalogLogoPreviewImage"\)/);
    });

    test("image_editor_cancel", () => {
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Cancelar editor não altera o arquivo prévio e fecha modal
        assert.match(imageEditorJs, /function\s+cancelEditor\(\)/);
        assert.match(imageEditorJs, /closeEditor/);
    });

    test("image_editor_apply", () => {
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Aplicar gera blob otimizado, cria File e despacha evento change com bypass
        assert.match(imageEditorJs, /async\s+function\s+applyEditor\(\)/);
        assert.match(imageEditorJs, /createOptimizedBlob/);
        assert.match(imageEditorJs, /input\.dataset\.imageEditorBypass\s*=\s*"true"/);
        assert.match(imageEditorJs, /new\s+Event\("change"/);
    });

    test("image_editor_escape", () => {
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Tecla Escape fecha editor e previne propagação para não fechar modal pai
        assert.match(imageEditorJs, /if\s*\(event\.key\s*===\s*"Escape"\)/);
        assert.match(imageEditorJs, /event\.stopPropagation\(\)/);
        assert.match(imageEditorJs, /event\.preventDefault\(\)/);
    });

    test("image_editor_focus_restore", () => {
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Salva elemento focado ao abrir e restaura ao fechar, mantendo focus trap durante exibição
        assert.match(imageEditorJs, /previousFocusedElement\s*=\s*document\.activeElement/);
        assert.match(imageEditorJs, /previousFocusedElement\.focus/);
        assert.match(imageEditorJs, /handleGlobalKeydown/);
        assert.match(imageEditorJs, /event\.key\s*===\s*"Tab"/);
    });

    test("image_editor_object_url_cleanup", () => {
        const imageEditorJs = fs.readFileSync(path.join(rootDir, "admin/assets/js/image-editor.js"), "utf8");

        // Liberação cuidadosa de URL.revokeObjectURL
        assert.match(imageEditorJs, /URL\.revokeObjectURL/);
    });

    test("catalog_logo_responsive", () => {
        const catalogoIdentityCss = fs.readFileSync(path.join(rootDir, "catalogo/assets/css/catalog-identity.css"), "utf8");

        // Regras responsivas para logo em telas móveis
        assert.match(catalogoIdentityCss, /@media\s*\(max-width:\s*620px\)/);
        assert.match(catalogoIdentityCss, /@media\s*\(max-width:\s*420px\)/);
        assert.match(catalogoIdentityCss, /\.catalog-identity-logo--square/);
        assert.match(catalogoIdentityCss, /\.catalog-identity-logo--portrait_3_4/);
        assert.match(catalogoIdentityCss, /\.catalog-identity-logo--landscape_4_3/);
    });

    test("product_card_square_image", () => {
        const catalogoCss = fs.readFileSync(path.join(rootDir, "catalogo/assets/css/catalogo.css"), "utf8");
        const catalogoJs = fs.readFileSync(path.join(rootDir, "catalogo/assets/js/catalogo.js"), "utf8");

        // Card público usa classe product-card__media com proporção 1:1
        assert.match(catalogoCss, /\.product-card__media\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/);
        assert.match(catalogoJs, /product-card__media/);
        assert.match(catalogoJs, /product-card__image/);
    });

    test("flavor_modal_square_image", () => {
        const catalogoCss = fs.readFileSync(path.join(rootDir, "catalogo/assets/css/catalogo.css"), "utf8");
        const catalogoJs = fs.readFileSync(path.join(rootDir, "catalogo/assets/js/catalogo.js"), "utf8");

        // Modal público de sabores usa .flavor-selection-item__media 1:1
        assert.match(catalogoCss, /\.flavor-selection-item__media\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/);
        assert.match(catalogoJs, /flavor-selection-item__media/);
        assert.match(catalogoJs, /flavor-selection-item__image/);
    });

    test("frontend_schema_flavors", () => {
        const catalogoJs = fs.readFileSync(path.join(rootDir, "catalogo/assets/js/catalogo.js"), "utf8");

        // Tratamento de erro na query de sabores sem conversão silenciosa em array vazio
        assert.match(catalogoJs, /flavorsLoadError/);
        assert.match(catalogoJs, /if\s*\(flavorsLoadError\)\s*\{/);
        assert.match(catalogoJs, /showToast\("Não foi possível carregar as opções de sabores deste produto no momento\./);
    });

    test("neoeffex_brand_catalog", () => {
        const catalogoHtml = fs.readFileSync(path.join(rootDir, "catalogo/index.html"), "utf8");
        const catalogoCss = fs.readFileSync(path.join(rootDir, "catalogo/assets/css/catalogo.css"), "utf8");

        // Rodapé contém "Tecnologia Neoeffex" com ícone N discreto
        assert.match(catalogoHtml, /Tecnologia Neoeffex/);
        assert.match(catalogoHtml, /class="brand__mark brand__mark--footer"/);
        assert.match(catalogoCss, /\.site-footer__tech/);
        assert.match(catalogoCss, /\.brand__mark--footer/);
        assert.match(catalogoCss, /neoeffex-n-logo-white\.svg/);
    });

    test("neoeffex_brand_admin", () => {
        const adminHtml = fs.readFileSync(path.join(rootDir, "admin/index.html"), "utf8");
        const adminCss = fs.readFileSync(path.join(rootDir, "admin/assets/css/admin.css"), "utf8");

        // Admin contém a marca oficial da Neoeffex vinculada aos assets locais
        assert.match(adminHtml, /class="brand"/);
        assert.match(adminHtml, /class="brand__mark"/);
        assert.match(adminCss, /neoeffex-n-logo-white\.svg/);
    });
});
