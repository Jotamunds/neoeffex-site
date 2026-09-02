import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

function runCatalog(root, location) {
    const links = Array.from({ length: 8 }, () => ({
        href: "",
        setAttribute(name, value) {
            if (name === "href") {
                this.href = value;
            }
        }
    }));

    const window = {
        LuLeve: {},
        location
    };

    const context = vm.createContext({
        window,
        document: {
            querySelectorAll(selector) {
                return selector === "[data-catalog-link]" ? links : [];
            }
        },
        URL
    });

    vm.runInContext(readFileSync(join(root, "scripts/config.js"), "utf8"), context, {
        filename: "config.js",
        timeout: 1000
    });
    vm.runInContext(readFileSync(join(root, "scripts/catalog.js"), "utf8"), context, {
        filename: "catalog.js",
        timeout: 1000
    });

    return { app: window.LuLeve, links };
}

export function validateCatalogLink({ check, root, html, config }) {
    const script = readFileSync(join(root, "scripts/catalog.js"), "utf8");

    check("Catálogo tem slug e URLs centralizados", () => {
        assert.equal(config.catalog.slug, "lu-leve-e-saudavel");
        assert.equal(config.catalog.productionUrl, "https://neoeffex.com.br/catalogo/?catalogo=lu-leve-e-saudavel");
        assert.equal(config.catalog.localPath, "../../catalogo/?catalogo=lu-leve-e-saudavel");
        assert.equal((html.match(/data-catalog-link/g) || []).length, 8);
    });

    check("Localhost e IP privado usam o catálogo local", () => {
        for (const href of [
            "http://localhost:8080/sites/lu-leve-e-saudavel/",
            "http://127.0.0.1:5500/sites/lu-leve-e-saudavel/",
            "http://192.168.0.50:8080/sites/lu-leve-e-saudavel/"
        ]) {
            const location = new URL(href);
            const fixture = runCatalog(root, location);
            const expected = new URL("../../catalogo/?catalogo=lu-leve-e-saudavel", href).href;
            assert.equal(fixture.app.catalog.resolveUrl(location), expected);
            fixture.links.forEach((link) => assert.equal(link.href, expected));
        }
    });

    check("Domínio Neoeffex e domínio externo usam a URL oficial", () => {
        for (const href of [
            "https://neoeffex.com.br/sites/lu-leve-e-saudavel/",
            "https://luleveesaudavel.com.br/"
        ]) {
            const location = new URL(href);
            const fixture = runCatalog(root, location);
            assert.equal(fixture.app.catalog.resolveUrl(location), config.catalog.productionUrl);
            fixture.links.forEach((link) => assert.equal(link.href, config.catalog.productionUrl));
        }
    });

    check("Integração altera apenas href e preserva navegação nativa", () => {
        assert.doesNotMatch(script, /preventDefault|window\.open|location\.(?:assign|replace)|location\.href\s*=/);
        assert.doesNotMatch(script, /innerHTML|insertAdjacentHTML|fetch\(/);
        assert.match(script, /querySelectorAll\("\[data-catalog-link\]"\)/);
        assert.match(script, /setAttribute\("href", url\)/);
    });
}
