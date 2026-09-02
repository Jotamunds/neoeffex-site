/* Verificação sem dependências, sem rede e sem alteração de arquivos. */
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { escapeHtml, formatMoney, perMeal, renderCategory, updateMenuHtml, validateMenu } from "../tools/menu-template.mjs";
import { validateEnhancements } from "./enhancements.mjs";
import { validateRelease } from "./release.mjs";
import { validateOrganicBackgrounds } from "./organic-backgrounds.mjs";
import { validateDecorations } from "./decorations.mjs";
import { validateMotion } from "./motion.mjs";
import { validateHeroIntro } from "./hero-intro.mjs";
import { validateCardHover } from "./card-hover.mjs";
import { validateContactJump } from "./contact-jump.mjs";
import { validateForkHighlight } from "./fork-highlight.mjs";
import { validatePriceCountup } from "./price-countup.mjs";
import { validateCatalogLink } from "./catalog-link.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const failures = [];
let passed = 0;

function check(label, run) {
    try {
        run();
        passed += 1;
        console.log(`[OK] ${label}`);
    } catch (error) {
        failures.push(label);
        console.error(`[FALHA] ${label}: ${error.message}`);
    }
}

function walk(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        if ([".git", "node_modules", "dist"].includes(entry.name)) {
            return [];
        }

        const path = join(directory, entry.name);
        return entry.isDirectory() ? walk(path) : [path];
    });
}

function localReference(base, reference) {
    const path = resolve(base, reference.split(/[?#]/)[0]);
    assert.ok(path.startsWith(`${root}${sep}`), `Caminho fora do projeto: ${reference}`);
    assert.ok(existsSync(path), `Arquivo ausente: ${relative(root, path)}`);
    return path;
}

function readWebpDimensions(bytes) {
    for (let offset = 12; offset + 8 <= bytes.length;) {
        const kind = bytes.toString("ascii", offset, offset + 4);
        const size = bytes.readUInt32LE(offset + 4);
        const data = offset + 8;
        assert.ok(data + size <= bytes.length, "Bloco WebP incompleto.");

        if (kind === "VP8 ") {
            return [bytes.readUInt16LE(data + 6) & 0x3fff, bytes.readUInt16LE(data + 8) & 0x3fff];
        }

        if (kind === "VP8X") {
            return [bytes.readUIntLE(data + 4, 3) + 1, bytes.readUIntLE(data + 7, 3) + 1];
        }

        if (kind === "VP8L") {
            const bits = bytes.readUInt32LE(data + 1);
            return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
        }

        offset = data + size + (size % 2);
    }

    throw new Error("Dimensões WebP não encontradas.");
}

const allFiles = walk(root);
const codeFiles = allFiles.filter((file) => [".html", ".css", ".js", ".mjs", ".json"].includes(extname(file)));
const cssFiles = allFiles.filter((file) => extname(file) === ".css");
const scriptFiles = allFiles.filter((file) => extname(file) === ".js");

check("HTML semântico e idioma", () => {
    assert.match(html, /<html lang="pt-BR">/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    assert.match(html, /<header\b/);
    assert.match(html, /<footer\b/);
    assert.match(html, /name="viewport"/);
    assert.match(html, /<title>Lu Leve e Saudável<\/title>/);
});

check("IDs únicos, âncoras e rótulos existentes", () => {
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, "Há IDs duplicados.");

    for (const [, target] of html.matchAll(/href="#([^"]*)"/g)) {
        assert.ok(ids.includes(target), `Âncora sem destino: #${target}`);
    }

    for (const [, references] of html.matchAll(/aria-(?:labelledby|describedby)="([^"]+)"/g)) {
        for (const target of references.split(/\s+/)) {
            assert.ok(ids.includes(target), `Rótulo sem destino: ${target}`);
        }
    }

    for (const target of ["inicio", "tradicionais", "fitness", "como-funciona", "contato"]) {
        assert.ok(ids.includes(target), `Seção obrigatória ausente: ${target}`);
    }
});

check("Menu principal com os três destinos definidos", () => {
    const navigation = html.match(/<nav\b[\s\S]*?<\/nav>/)[0];
    const targets = [...navigation.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(targets, ["#tradicionais", "#fitness", "#como-funciona"]);
});

check("Cardápio é a ação prioritária e única no cabeçalho", () => {
    const header = html.match(/<header\b[\s\S]*?<\/header>/)[0];
    const navigation = header.match(/<nav\b[\s\S]*?<\/nav>/)[0];
    const catalog = header.match(/<a\b[^>]*class="[^"]*site-header__catalog[^"]*"[^>]*>Abrir cardápio<\/a>/);
    assert.ok(catalog, "O cabeçalho deve destacar o acesso ao cardápio.");
    assert.match(catalog[0], /data-catalog-link/);
    assert.ok(!navigation.includes(catalog[0]), "Cardápio é uma ação separada dos três atalhos.");
    assert.doesNotMatch(header, /site-header__contact|>Contato<\/a>/);
    assert.doesNotMatch(navigation, /\bhidden\b|aria-hidden="true"|href="javascript:/);
    assert.match(header, /aria-label="Lu Leve e Saudável — início"/);
});

const hero = html.match(/<section\b[^>]*id="inicio"[\s\S]*?<\/section>/)[0];

check("Abertura curta, texto antes da foto e imagem identificada", () => {
    assert.doesNotMatch(hero, /stage-placeholder/);
    assert.equal((hero.match(/<img\b/g) || []).length, 1);
    assert.ok(hero.indexOf("<h1") < hero.indexOf("<figure"));
    assert.match(hero, /data-catalog-link[^>]*>\s*<span\b[^>]*>Abrir cardápio<\/span>\s*<\/a>/);
    assert.equal((hero.match(/class="hero__action"/g) || []).length, 1);
    assert.doesNotMatch(hero, /Fale conosco|data-whatsapp|href="#contato"/);
    const figure = hero.match(/<figure\b[\s\S]*?<\/figure>/)[0];
    assert.doesNotMatch(figure, /<h[1-6]\b|<a\b|<button\b/);
    assert.match(figure, /<figcaption[^>]*>[^<]+<\/figcaption>/);
    const image = figure.match(/<img\b[^>]*>/)[0];
    assert.ok((image.match(/alt="([^"]+)"/)?.[1].trim().length || 0) >= 20, "Descreva o conteúdo da foto no texto alternativo.");
    assert.match(image, /width="960"/);
    assert.match(image, /height="960"/);
    assert.match(image, /loading="eager"/);
    assert.match(image, /fetchpriority="high"/);
    assert.match(image, /decoding="async"/);
});

check("Imagens locais WebP íntegras e srcset com dimensões corretas", () => {
    const srcset = hero.match(/srcset="([^"]+)"/)[1];
    const widths = [];

    for (const candidate of srcset.split(",")) {
        const match = candidate.trim().match(/^(\S+)\s+(\d+)w$/);
        assert.ok(match, "Descritor de srcset inválido.");
        const [, reference, descriptor] = match;
        const width = Number(descriptor);
        const bytes = readFileSync(localReference(root, reference));
        assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
        assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
        assert.equal(bytes.readUInt32LE(4) + 8, bytes.length, "Tamanho WebP divergente.");
        assert.deepEqual(readWebpDimensions(bytes), [width, width]);
        widths.push(width);
    }

    assert.deepEqual(widths, [640, 960]);
    assert.match(hero, /sizes="[^"]+"/);
});

check("Contratos CSS de cabeçalho e hero mobile-first", () => {
    const headerCss = readFileSync(join(root, "styles/layout/header.css"), "utf8");
    const heroCss = readFileSync(join(root, "styles/sections/hero.css"), "utf8");
    assert.match(headerCss, /flex-wrap:\s*wrap/);
    assert.match(headerCss, /min-height:\s*var\(--control-size\)/);
    assert.doesNotMatch(headerCss, /display:\s*none|visibility:\s*hidden/);
    assert.match(heroCss, /@media\s*\(min-width:\s*60rem\)/);
    assert.match(heroCss, /grid-template-columns:\s*minmax\(0,\s*1\.1fr\)\s*minmax\(0,\s*0\.9fr\)/);
    assert.match(heroCss, /object-fit:\s*cover/);
    assert.match(heroCss, /aspect-ratio:\s*4\s*\/\s*3/);
    assert.match(heroCss, /aspect-ratio:\s*1\s*\/\s*1/);
    assert.doesNotMatch(heroCss, /(?:min-)?height:\s*100(?:vh|dvh|svh)/);
});

check("Referências locais e ausência de estilos/eventos inline", () => {
    assert.doesNotMatch(html, /\s(?:style|on[a-z]+)\s*=/i);
    assert.doesNotMatch(html, /<style\b/i);

    for (const [, reference] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
        if (/^(?:#|https?:|mailto:|tel:)/.test(reference)) {
            continue;
        }

        localReference(root, reference);
    }
});

check("Imports do CSS sem arquivos ausentes ou ciclos", () => {
    const visited = new Set();
    const active = new Set();

    function visit(file) {
        assert.ok(!active.has(file), `Import circular: ${relative(root, file)}`);

        if (visited.has(file)) {
            return;
        }

        active.add(file);
        const source = readFileSync(file, "utf8");

        for (const [, reference] of source.matchAll(/@import\s+url\("([^"]+)"\);/g)) {
            visit(localReference(dirname(file), reference));
        }

        active.delete(file);
        visited.add(file);
    }

    visit(join(root, "styles/main.css"));
    assert.equal(visited.size, cssFiles.length, "Há CSS não conectado ao main.css.");
});

check("Variáveis CSS declaradas e cores centralizadas", () => {
    const variablesFile = join(root, "styles/base/variables.css");
    const definitions = new Set();

    for (const file of cssFiles) {
        const source = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

        for (const [, name] of source.matchAll(/(--[a-z0-9-]+)\s*:/g)) {
            definitions.add(name);
        }

        if (file !== variablesFile) {
            assert.doesNotMatch(source, /#[a-f0-9]{3,8}\b|\b(?:rgba?|hsla?)\(/i, `Cor fora das variáveis: ${relative(root, file)}`);
        }

        assert.equal((source.match(/\{/g) || []).length, (source.match(/\}/g) || []).length, `Chaves desbalanceadas: ${relative(root, file)}`);
    }

    for (const file of cssFiles) {
        const source = readFileSync(file, "utf8");

        for (const [, name] of source.matchAll(/var\((--[a-z0-9-]+)/g)) {
            assert.ok(definitions.has(name), `Variável ausente: ${name}`);
        }
    }
});

check("Fontes WOFF2 locais, preloads e licenças incluídas", () => {
    const fontCss = readFileSync(join(root, "styles/base/fonts.css"), "utf8");
    assert.equal((fontCss.match(/@font-face/g) || []).length, 2);
    assert.equal((fontCss.match(/font-display:\s*swap/g) || []).length, 2);

    for (const [, reference] of fontCss.matchAll(/url\("([^"]+)"\)/g)) {
        const file = localReference(join(root, "styles/base"), reference);
        const bytes = readFileSync(file);
        assert.equal(bytes.toString("ascii", 0, 4), "wOF2", `Fonte inválida: ${reference}`);
        assert.ok(bytes.length > 1000, "Arquivo de fonte incompleto.");
        assert.equal(bytes.readUInt32BE(8), bytes.length, "Tamanho WOFF2 divergente.");
        assert.ok(html.includes(`href="./assets/fonts/${file.split(sep).at(-1)}"`));
    }

    for (const family of ["Sora", "Manrope"]) {
        const license = readFileSync(join(root, `assets/fonts/OFL-${family}.txt`), "utf8");
        assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/);
    }

    for (const file of cssFiles) {
        assert.doesNotMatch(readFileSync(file, "utf8"), /url\(["']?https?:/);
    }
});

check("Contraste das combinações textuais da paleta", () => {
    const source = readFileSync(join(root, "styles/base/variables.css"), "utf8");
    const palette = Object.fromEntries([...source.matchAll(/(--color-[a-z-]+):\s*(#[a-f0-9]{6});/g)].map((match) => [match[1], match[2]]));

    function luminance(hex) {
        const channels = hex.slice(1).match(/../g).map((channel) => {
            const value = parseInt(channel, 16) / 255;
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });

        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    }

    const pairs = [];

    for (const surface of ["background", "surface", "sage", "accent-soft"]) {
        pairs.push(["text", surface], ["text-muted", surface]);
    }

    pairs.push(
        ["text-light", "primary"], ["text-light", "primary-light"],
        ["sage", "primary"], ["sage", "primary-light"],
        ["primary", "accent-soft"], ["primary", "accent"],
        ["primary", "sage"],
        ["text-light", "whatsapp"]
    );

    for (const [foreground, background] of pairs) {
        const a = luminance(palette[`--color-${foreground}`]);
        const b = luminance(palette[`--color-${background}`]);
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        assert.ok(ratio >= 4.5, `${foreground}/${background}: contraste ${ratio.toFixed(2)}:1`);
    }
});

check("Temas aplicados, foco visível e redução de movimento", () => {
    const sectionThemes = {
        inicio: "forest",
        tradicionais: "cream",
        fitness: "sage",
        "como-funciona": "warm",
        instagram: "paper",
        contato: "forest",
        "fazer-pedido": "forest"
    };

    for (const [id, theme] of Object.entries(sectionThemes)) {
        const section = [...html.matchAll(/<section\b[^>]*>/g)].find(([tag]) => tag.includes(`id="${id}"`));
        assert.ok(section && section[0].includes(`theme--${theme}`), `Tema ausente em ${id}`);
    }

    const variables = readFileSync(join(root, "styles/base/variables.css"), "utf8");
    const reset = readFileSync(join(root, "styles/base/reset.css"), "utf8");
    const buttons = readFileSync(join(root, "styles/components/buttons.css"), "utf8");
    assert.match(variables, /prefers-reduced-motion:\s*reduce/);
    assert.match(variables, /--duration-fast:\s*0ms/);
    assert.match(reset, /:focus-visible/);
    assert.match(reset, /var\(--focus-color\)/);
    assert.match(buttons, /min-height:\s*var\(--control-size\)/);
    assert.match(buttons, /forced-colors:\s*active/);
});

check("Scripts clássicos, defer e ordem de inicialização", () => {
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
    const paths = scripts.map(([, attributes, contents]) => {
        assert.match(attributes, /\bdefer\b/);
        assert.doesNotMatch(attributes, /type="module"/);
        assert.equal(contents.trim(), "");
        return attributes.match(/src="([^"]+)"/)[1];
    });

    assert.deepEqual(paths, ["./scripts/config.js", "./scripts/catalog.js", "./scripts/whatsapp.js", "./scripts/promotion.js", "./scripts/mobile-order.js", "./scripts/hero-intro.js", "./scripts/contact-jump.js", "./scripts/fork-highlight.js", "./scripts/price-countup.js", "./scripts/animations.js", "./scripts/main.js"]);

    for (const file of scriptFiles) {
        new vm.Script(readFileSync(file, "utf8"), { filename: relative(root, file) });
    }
});

check("Quatro espaços e finais de linha nos arquivos de código", () => {
    for (const file of codeFiles) {
        const source = readFileSync(file, "utf8");
        assert.ok(source.endsWith("\n"), `Sem quebra final: ${relative(root, file)}`);
        assert.ok(!source.includes("\t"), `Tabulação: ${relative(root, file)}`);

        source.split("\n").forEach((line, index) => {
            if (!line.trim() || /^\s*\*/.test(line)) {
                return;
            }

            const spaces = line.match(/^ */)[0].length;
            assert.equal(spaces % 4, 0, `Indentação: ${relative(root, file)}:${index + 1}`);
        });
    }
});

/* O JSON é a fonte dos preços. Os cards resultantes já ficam no HTML. */
const menu = JSON.parse(readFileSync(join(root, "data/menu.json"), "utf8"));

check("Cardápio válido e moeda brasileira com duas casas", () => {
    assert.equal(validateMenu(menu), menu);
    assert.equal(formatMoney(1600), "R$ 16,00");
    assert.equal(formatMoney(2467), "R$ 24,67");
    assert.equal(formatMoney(10500), "R$ 105,00");
    assert.throws(() => formatMoney(16.5));
    assert.throws(() => formatMoney(-100));
});

check("Preço por marmita calculado e aproximação explícita", () => {
    assert.deepEqual(perMeal({ totalCents: 29000, quantity: 20 }), { cents: 1450, approximate: false });
    assert.deepEqual(perMeal({ totalCents: 24500, quantity: 10 }), { cents: 2450, approximate: false });
    assert.deepEqual(perMeal({ totalCents: 37000, quantity: 15 }), { cents: 2467, approximate: true });
    assert.deepEqual(perMeal({ totalCents: 31500, quantity: 15 }), { cents: 2100, approximate: false });
    assert.throws(() => perMeal({ totalCents: 37000, quantity: 0 }));
});

check("Dados inválidos não geram preços silenciosamente", () => {
    const mutations = [
        (copy) => { copy.featuredQuantity = 0; },
        (copy) => { copy.categories.reverse(); },
        (copy) => { copy.categories[0].products = []; },
        (copy) => { copy.categories[0].products[0].id = '" onclick="alert(1)'; },
        (copy) => { copy.categories[0].products[1].id = copy.categories[0].products[0].id; },
        (copy) => { copy.categories[0].products[0].unitPriceCents = 16.5; },
        (copy) => { copy.categories[0].products[0].combos[0].totalCents = -10; },
        (copy) => { copy.categories[0].products[0].combos[1].quantity = 5; },
        (copy) => { copy.categories[0].products[0].combos[1].quantity = 11; },
        (copy) => { copy.surcharges[0].priceCents = "600"; }
    ];

    for (const mutate of mutations) {
        const copy = JSON.parse(JSON.stringify(menu));
        mutate(copy);
        assert.throws(() => updateMenuHtml(html, copy));
    }
});

check("Textos editáveis são escapados antes de entrar no HTML", () => {
    assert.equal(escapeHtml('<b>"Preço" & teste</b>'), "&lt;b&gt;&quot;Preço&quot; &amp; teste&lt;/b&gt;");
    const copy = JSON.parse(JSON.stringify(menu));
    copy.categories[0].products[0].name = "<script>alert(1)</script>";
    copy.surcharges[0].label = "<img src=x onerror=alert(1)>";
    const rendered = renderCategory(copy, "tradicionais");
    assert.doesNotMatch(rendered, /<script\b|<img\b/);
    assert.match(rendered, /&lt;script&gt;/);
});

check("HTML sincronizado com os dados e geração idempotente", () => {
    const updated = updateMenuHtml(html, menu);
    assert.equal(updated, html, "Execute node tools/build-menu.mjs após editar data/menu.json.");
    assert.equal(updateMenuHtml(updated, menu), updated);
    const copy = JSON.parse(JSON.stringify(menu));
    copy.categories[0].products[0].unitPriceCents += 100;
    const changed = updateMenuHtml(html, copy);
    const stripMenu = (source) => source.replace(/<!-- MENU:(tradicionais|fitness):START -->[\s\S]*?<!-- MENU:\1:END -->/g, "MENU");
    assert.equal(stripMenu(changed), stripMenu(html), "Conteúdo fora dos marcadores foi alterado.");
    assert.notEqual(changed, html);
});

check("Marcadores ausentes ou duplicados interrompem a geração", () => {
    const start = "<!-- MENU:tradicionais:START -->";
    assert.throws(() => updateMenuHtml(html.replace(start, ""), menu));
    assert.throws(() => updateMenuHtml(html.replace(start, start + start), menu));
    assert.throws(() => updateMenuHtml(html.replace(start, "<!-- MENU:tradicionais:END -->"), menu));
});

check("Todos os cards e combos estão visíveis no HTML estático", () => {
    for (const category of menu.categories) {
        const region = renderCategory(menu, category.id);
        assert.equal((region.match(/<article\b/g) || []).length, category.products.length);
        assert.equal((region.match(/class="price-card__combo(?:\s|")/g) || []).length, category.products.reduce((count, product) => count + product.combos.length, 0));
        assert.equal((region.match(/class="price-card__badge"/g) || []).length, category.products.length);
        assert.doesNotMatch(region, /(?:^|\s)hidden(?:\s|>)|<details\b|<select\b|<input\b|<table\b|<button\b/);

        for (const product of category.products) {
            assert.match(region, new RegExp(`id="${product.id}-title"`));
        }
    }
});

check("Acréscimos consistentes junto às duas categorias", () => {
    for (const category of menu.categories) {
        const region = renderCategory(menu, category.id);
        assert.match(region, /Válidos para tradicionais e fitness/);
        assert.match(region, /não incluem acréscimos nem entrega/);
        assert.equal((region.match(new RegExp(`aria-describedby="acrescimos-${category.id}"`, "g")) || []).length, category.products.length);

        for (const item of menu.surcharges) {
            assert.ok(region.includes(escapeHtml(item.label)));
            assert.ok(region.includes(formatMoney(item.priceCents)));
        }
    }
});

check("CSS dos preços preserva leitura e empilhamento no celular", () => {
    const cardCss = readFileSync(join(root, "styles/components/price-card.css"), "utf8");
    const productCss = readFileSync(join(root, "styles/sections/products.css"), "utf8");
    assert.match(cardCss, /\.price-card__per-meal\s*\{[^}]*font-size:\s*var\(--font-size-body\)/);
    assert.match(cardCss, /\.price-card__combo--featured\s*\{/);
    assert.match(productCss, /\.products__grid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    assert.match(productCss, /repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
    assert.match(productCss, /repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    assert.doesNotMatch(cardCss + productCss, /overflow(?:-x)?:\s*(?:auto|scroll|hidden)|display:\s*none|visibility:\s*hidden/);
});

check("Como funciona mantém três orientações no HTML sem formulário", () => {
    const section = html.match(/<section\b[^>]*id="como-funciona"[\s\S]*?<\/section>/)[0];
    const steps = section.match(/<ol\b[\s\S]*?<\/ol>/)[0];
    assert.match(steps, /role="list"/);
    assert.equal((steps.match(/<li\b/g) || []).length, 3);
    assert.equal((steps.match(/<h3\b/g) || []).length, 3);
    assert.match(steps, /Abra o cardápio/);
    assert.match(steps, /Adicione os produtos ao carrinho/);
    assert.match(steps, /Envie pelo WhatsApp/);
    const numbers = [...steps.matchAll(/class="how-it-works__number" aria-hidden="true">(\d+)<\/span>/g)].map((match) => match[1]);
    assert.deepEqual(numbers, ["01", "02", "03"]);
    assert.doesNotMatch(section, /<form\b|<input\b|<select\b|<details\b/);
});

check("Chamada de pedido direciona ao catálogo e mantém confirmação no WhatsApp", () => {
    const section = html.match(/<section\b[^>]*id="como-funciona"[\s\S]*?<\/section>/)[0];
    const action = section.match(/<a\b[^>]*data-catalog-link[^>]*>/)[0];
    assert.match(action, /catalogo\/\?catalogo=lu-leve-e-saudavel/);
    assert.match(section, /confirmação final de disponibilidade, recebimento e pagamento continua pelo WhatsApp/);
    assert.doesNotMatch(section, /data-whatsapp-label="Montar meu pedido"/);
});

check("Promoção fica antes dos preços e oculta sem JavaScript", () => {
    const promotion = html.match(/<aside\b[^>]*\sdata-promotion\s[\s\S]*?<\/aside>/)[0];
    assert.match(promotion.match(/^<aside[^>]*>/)[0], /\bhidden\b/);
    assert.match(promotion, /data-promotion-title><\/h2>/);
    assert.match(promotion, /data-promotion-description><\/p>/);
    assert.match(promotion, /theme--warm/);
    assert.ok(html.indexOf('id="promocao"') > html.indexOf('id="inicio"'));
    assert.ok(html.indexOf('id="promocao"') < html.indexOf('id="tradicionais"'));
    assert.doesNotMatch(promotion, /price-card|MENU:|<dialog\b|role="alert"/);
    assert.match(promotion, /data-catalog-link/);
    assert.match(promotion, />Abrir cardápio<\/a>/);
    assert.doesNotMatch(promotion, /data-whatsapp/);
});

check("CSS mantém promoção no fluxo e passos empilhados no celular", () => {
    const promotionCss = readFileSync(join(root, "styles/components/promotion.css"), "utf8");
    const stepsCss = readFileSync(join(root, "styles/sections/how-it-works.css"), "utf8");
    const reset = readFileSync(join(root, "styles/base/reset.css"), "utf8");
    assert.doesNotMatch(promotionCss, /position:\s*(?:fixed|absolute|sticky)|height:\s*\d/);
    assert.match(reset, /\[hidden\]\s*\{[^}]*display:\s*none\s*!important/);
    assert.match(promotionCss, /\.promotion__description\s*\{[^}]*font-size:\s*var\(--font-size-body\)/);
    assert.match(stepsCss, /\.how-it-works__steps\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    assert.match(stepsCss, /repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
    assert.doesNotMatch(stepsCss, /display:\s*none|overflow(?:-x)?:\s*(?:auto|scroll|hidden)/);
});

const contactSection = html.match(/<section\b[^>]*id="contato"[\s\S]*?<\/section>/)[0];
const gallerySection = html.match(/<section\b[^>]*id="instagram"[\s\S]*?<\/section>/)[0];
const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)[0];

check("Contato mostra canais e recebimento por extenso", () => {
    for (const label of ["Telefone e WhatsApp", "Instagram", "Regiões atendidas", "Retirada no local", "Entrega por aplicativo"]) {
        assert.ok(contactSection.includes(label), `Rótulo ausente: ${label}`);
    }

    assert.match(contactSection, /data-contact-phone-link hidden/);
    assert.match(contactSection, /data-contact-address-row hidden/);
    assert.match(contactSection, /data-contact-hours-row hidden/);
    assert.match(contactSection, /data-whatsapp-only hidden/);
    assert.doesNotMatch(contactSection, />Fale conosco<\/a>/);
    assert.match(contactSection, /com taxa adicional/);
    assert.match(contactSection, /Consulte o endereço antes de se deslocar/);
    assert.doesNotMatch(contactSection, /<form\b|<iframe\b/);
});

check("Galeria tem três fotos estáticas, legenda e descrições acessíveis", () => {
    assert.equal((gallerySection.match(/<img\b/g) || []).length, 3);
    assert.equal((gallerySection.match(/instagram__photo--main/g) || []).length, 1);
    assert.match(gallerySection, /<figcaption[^>]*>[^<]+<\/figcaption>/);
    assert.doesNotMatch(gallerySection, /stage-placeholder|<iframe\b|<script\b|<video\b|<canvas\b/);

    for (const [image] of gallerySection.matchAll(/<img\b[^>]*>/g)) {
        assert.ok((image.match(/alt="([^"]+)"/)?.[1].trim().length || 0) >= 20, "Descreva o conteúdo da foto no texto alternativo.");
        assert.match(image, /loading="lazy"/);
        assert.match(image, /decoding="async"/);
        assert.match(image, /sizes="[^"]+"/);
        assert.doesNotMatch(image, /fetchpriority="high"/);
    }
});

check("Seis arquivos WebP da galeria correspondem ao HTML", () => {
    const references = new Set();

    for (const [image] of gallerySection.matchAll(/<img\b[^>]*>/g)) {
        const width = Number(image.match(/width="(\d+)"/)[1]);
        const height = Number(image.match(/height="(\d+)"/)[1]);
        const source = image.match(/\ssrc="([^"]+)"/)[1];
        assert.deepEqual(readWebpDimensions(readFileSync(localReference(root, source))), [width, height]);

        for (const candidate of image.match(/srcset="([^"]+)"/)[1].split(",")) {
            const [, reference, descriptor] = candidate.trim().match(/^(\S+)\s+(\d+)w$/);
            assert.match(reference, /^\.\/assets\/images\/instagram\//);
            const bytes = readFileSync(localReference(root, reference));
            assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
            assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
            assert.equal(bytes.readUInt32LE(4) + 8, bytes.length);
            assert.deepEqual(readWebpDimensions(bytes), [Number(descriptor), Number(descriptor)]);
            references.add(reference);
        }
    }

    assert.equal(references.size, 6);
});

check("Fechamento mantém chamada, contatos e crédito no rodapé", () => {
    const finalSection = html.match(/<section\b[^>]*id="fazer-pedido"[\s\S]*?<\/section>/)[0];
    assert.ok(html.indexOf('id="contato"') < html.indexOf('id="instagram"'));
    assert.ok(html.indexOf('id="instagram"') < html.indexOf('id="fazer-pedido"'));
    assert.match(finalSection, /data-catalog-link/);
    assert.match(finalSection, />Abrir cardápio<\/a>/);
    assert.match(finalSection, /data-whatsapp[^>]*data-contact-jump/);
    assert.match(finalSection, /data-whatsapp-text>Fale conosco<\/span>/);
    assert.equal((html.match(/data-whatsapp-text>Fale conosco<\/span>/g) || []).length, 1);
    assert.match(footer, /data-contact-phone-link hidden/);
    assert.match(footer, /data-instagram-link/);
    assert.match(footer, /data-contact-regions/);
    assert.match(footer, /data-developer-credit>Desenvolvido por Neoeffex/);
    assert.doesNotMatch(finalSection + footer, /<form\b|<iframe\b/);
});

check("CSS de contato, galeria e fechamento preserva empilhamento", () => {
    const contactCss = readFileSync(join(root, "styles/sections/contact.css"), "utf8");
    const galleryCss = readFileSync(join(root, "styles/sections/instagram.css"), "utf8");
    const finalCss = readFileSync(join(root, "styles/sections/final-cta.css"), "utf8");
    const footerCss = readFileSync(join(root, "styles/layout/footer.css"), "utf8");
    assert.match(contactCss, /\.contact__layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    assert.match(finalCss, /\.final-cta__layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    assert.match(footerCss, /\.site-footer__grid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    assert.match(galleryCss, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    assert.match(galleryCss, /grid-row:\s*1\s*\/\s*3/);
    assert.match(galleryCss, /object-fit:\s*cover/);
    assert.doesNotMatch(contactCss + galleryCss + finalCss + footerCss, /overflow(?:-x)?:\s*(?:auto|scroll)|position:\s*(?:fixed|sticky)/);
});

/* DOM mínimo para verificar a lógica sem abrir navegador. */
class ElementFixture {
    constructor() {
        this.textContent = "";
        this.hidden = false;
        this.dataset = {};
        this.attributes = new Map();
        this.children = [];
        this.descendants = new Map();
    }

    get textContent() {
        return this._textContent;
    }

    set textContent(value) {
        this._textContent = String(value);
        this.children = [];
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    getAttribute(name) {
        return this.attributes.get(name) ?? null;
    }

    removeAttribute(name) {
        this.attributes.delete(name);
    }

    replaceChildren(...elements) {
        this._textContent = "";
        this.children = elements;
    }

    querySelector(selector) {
        return this.descendants.get(selector) || null;
    }
}

const selectors = new Map();
const selectorNames = [
    "[data-current-year]", "[data-contact-regions]", "[data-contact-pickup]",
    "[data-contact-delivery]", "[data-instagram-handle]", "[data-instagram-link]",
    "[data-contact-address-row]", "[data-contact-address]", "[data-contact-hours-row]",
    "[data-contact-hours]", "[data-developer-credit]", "[data-contact-phone]",
    "[data-whatsapp-status]", "[data-whatsapp]", "[data-promotion]",
    "[data-contact-phone-link]", "[data-contact-phone-fallback]", "[data-whatsapp-only]"
];

for (const name of selectorNames) {
    const attribute = name.slice(1, -1);
    const count = [...html.matchAll(new RegExp(`\\s${attribute}(?=\\s|=|>)`, "g"))].length;
    selectors.set(name, Array.from({ length: count }, () => new ElementFixture()));
}

const promotionSection = selectors.get("[data-promotion]")[0];
const promotionTitle = new ElementFixture();
const promotionDescription = new ElementFixture();
promotionSection.descendants.set("[data-promotion-title]", promotionTitle);
promotionSection.descendants.set("[data-promotion-description]", promotionDescription);
promotionSection.hidden = true;

// Simula cada botão real, incluindo promoção e Como funciona.
const whatsappTags = [...html.matchAll(/<a\b[^>]*\sdata-whatsapp(?:\s|>)[^>]*>/g)];
selectors.set("[data-whatsapp]", whatsappTags.map(([tag]) => {
    const fixture = new ElementFixture();
    fixture.dataset.whatsappLabel = tag.match(/data-whatsapp-label="([^"]+)"/)?.[1];
    fixture.dataset.whatsappFallback = tag.match(/data-whatsapp-fallback="([^"]+)"/)?.[1];
    return fixture;
}));

function element(selector) {
    return selectors.get(selector)[0];
}

const context = vm.createContext({
    window: {},
    URL,
    Date,
    document: {
        querySelector: (selector) => selectors.get(selector)?.[0] || null,
        querySelectorAll: (selector) => selectors.get(selector) || [],
        createElement: () => new ElementFixture()
    }
});

function runScript(name) {
    const file = join(root, "scripts", name);
    vm.runInContext(readFileSync(file, "utf8"), context, { filename: name });
}

runScript("config.js");
runScript("whatsapp.js");
runScript("promotion.js");
runScript("mobile-order.js");
runScript("animations.js");

const app = context.window.LuLeve;
const deliveredConfig = JSON.parse(JSON.stringify(app.config));
// Fixture de formato: não configura um contato real e nunca acessa a rede.
const phoneFixture = "5511999999999";

check("WhatsApp rejeita telefone vazio ou inválido", () => {
    for (const value of ["", "123", "11999999999", "abc", null, 5511999999999]) {
        assert.equal(app.whatsapp.normalizePhone(value), "");
        assert.equal(app.whatsapp.createWhatsappUrl(value, "Olá"), "");
    }
});

check("WhatsApp formata o número e codifica a mensagem", () => {
    assert.equal(app.whatsapp.normalizePhone("+55 (11) 99999-9999"), phoneFixture);
    assert.equal(app.whatsapp.formatPhone(phoneFixture), "+55 (11) 99999-9999");
    const message = "Olá! Tamanho & quantidade?";
    const url = new URL(app.whatsapp.createWhatsappUrl(phoneFixture, message));
    assert.equal(url.hostname, "wa.me");
    assert.equal(url.pathname, `/${phoneFixture}`);
    assert.equal(url.searchParams.get("text"), message);
});

check("Configuração mantém os campos públicos bem formados", () => {
    for (const key of ["whatsappNumber", "whatsappMessage", "instagramUrl", "instagramHandle", "regions", "pickup", "delivery", "address", "openingHours"]) {
        assert.equal(typeof app.config.contact[key], "string", `Campo inválido: ${key}`);
    }

    if (app.config.contact.whatsappNumber) {
        assert.notEqual(app.whatsapp.normalizePhone(app.config.contact.whatsappNumber), "", "WhatsApp fora do formato brasileiro esperado.");
    }

    assert.equal(typeof app.config.promotion.enabled, "boolean");
    assert.equal(typeof app.config.promotion.title, "string");
    assert.equal(typeof app.config.promotion.description, "string");
    assert.equal(typeof app.config.developer.url, "string");
});

check("Dados públicos de emergência do HTML acompanham a configuração", () => {
    for (const key of ["regions", "pickup", "delivery"]) {
        for (const [, text] of html.matchAll(new RegExp(`data-contact-${key}>([^<]*)<`, "g"))) {
            assert.equal(text, escapeHtml(deliveredConfig.contact[key]), `Atualize também o fallback HTML de ${key}.`);
        }
    }

    for (const [tag] of html.matchAll(/<a\b[^>]*data-instagram-link[^>]*>/g)) {
        assert.match(tag, /rel="noopener noreferrer"/);
        assert.equal(tag.match(/href="([^"]+)"/)[1], escapeHtml(deliveredConfig.contact.instagramUrl));
        assert.doesNotMatch(tag, /\bhidden\b/);
    }

    for (const [, text] of html.matchAll(/data-instagram-handle>([^<]*)</g)) {
        assert.equal(text, escapeHtml(deliveredConfig.contact.instagramHandle));
    }
});

check("Inicialização preenche dados e mantém o fallback de contato", () => {
    // Apenas a cópia em memória é alterada: seu config.js fica intacto.
    app.config.contact.whatsappNumber = "";
    app.config.contact.address = "";
    app.config.contact.openingHours = "";
    app.config.developer.url = "";
    runScript("main.js");
    assert.equal(element("[data-contact-regions]").textContent, app.config.contact.regions);
    assert.equal(element("[data-contact-address-row]").hidden, true);
    assert.equal(element("[data-contact-hours-row]").hidden, true);
    assert.equal(element("[data-whatsapp]").getAttribute("href"), "#contato");
    assert.equal(element("[data-whatsapp]").getAttribute("target"), null);
    assert.equal(element("[data-whatsapp-status]").hidden, false);
    assert.equal(element("[data-instagram-link]").getAttribute("href"), app.config.contact.instagramUrl);
});

check("Número configurado ativa o WhatsApp e retorna ao estado seguro", () => {
    app.whatsapp.init({ whatsappNumber: phoneFixture, whatsappMessage: "Teste" });
    assert.match(element("[data-whatsapp]").getAttribute("href"), /^https:\/\/wa\.me\//);
    assert.equal(element("[data-whatsapp]").getAttribute("rel"), "noopener noreferrer");
    assert.equal(element("[data-whatsapp-status]").hidden, true);

    app.whatsapp.init({ whatsappNumber: "", whatsappMessage: "Teste" });
    assert.equal(element("[data-whatsapp]").getAttribute("href"), "#contato");
    assert.equal(element("[data-whatsapp]").getAttribute("target"), null);
    assert.equal(element("[data-whatsapp-status]").hidden, false);
});

check("Campos opcionais e proteção de protocolo dos links", () => {
    app.config.contact.address = "Endereço de teste";
    app.config.contact.openingHours = "Horário de teste";
    app.config.contact.instagramUrl = "javascript:alert(1)";
    app.config.developer.url = "javascript:alert(1)";
    runScript("main.js");
    assert.equal(element("[data-contact-address-row]").hidden, false);
    assert.equal(element("[data-contact-address]").textContent, "Endereço de teste");
    assert.equal(element("[data-contact-hours-row]").hidden, false);
    assert.equal(element("[data-instagram-link]").hidden, true);
    assert.equal(element("[data-developer-credit]").children.length, 0);
});

check("Contato direto fica somente no fechamento e respeita configuração e fallback", () => {
    assert.equal(whatsappTags.length, 1);
    app.whatsapp.init({ whatsappNumber: phoneFixture, whatsappMessage: "Pedido de teste" });

    for (const link of selectors.get("[data-whatsapp]")) {
        assert.equal(link.textContent, link.dataset.whatsappLabel);
        assert.equal(new URL(link.getAttribute("href")).searchParams.get("text"), "Pedido de teste");
    }

    app.whatsapp.init({ whatsappNumber: "", whatsappMessage: "Pedido de teste" });

    for (const link of selectors.get("[data-whatsapp]")) {
        assert.equal(link.getAttribute("href"), "#contato");
        assert.equal(link.textContent, link.dataset.whatsappFallback);
        assert.equal(link.getAttribute("target"), null);
    }
});

check("Promoção rejeita estado desativado e configuração incompleta", () => {
    for (const config of [
        null, undefined, {}, false,
        { enabled: false, title: "Teste", description: "Condições" },
        { enabled: "true", title: "Teste", description: "Condições" },
        { enabled: "false", title: "Teste", description: "Condições" },
        { enabled: true, title: " ", description: "Condições" },
        { enabled: true, title: "Teste", description: " " },
        { enabled: true, title: 123, description: "Condições" },
        { enabled: true, title: "Teste", description: null }
    ]) {
        assert.equal(app.promotion.getContent(config), null);
    }
});

check("Promoção válida usa textos aparados sem modificar a configuração", () => {
    const config = { enabled: true, title: "  Oferta de teste  ", description: "  Condições de teste.  " };
    const before = JSON.stringify(config);
    const content = app.promotion.getContent(config);
    assert.equal(content.title, "Oferta de teste");
    assert.equal(content.description, "Condições de teste.");
    assert.equal(JSON.stringify(config), before);
});

check("Promoção renderiza texto literal e não interpreta HTML", () => {
    const title = "<img src=x onerror=alert(1)>";
    const description = "<script>alert(1)</script> & condições";
    app.promotion.init({ enabled: true, title, description });
    assert.equal(promotionSection.hidden, false);
    assert.equal(promotionTitle.textContent, title);
    assert.equal(promotionDescription.textContent, description);
    assert.equal(promotionTitle.children.length, 0);
    assert.doesNotMatch(readFileSync(join(root, "scripts/promotion.js"), "utf8"), /innerHTML|insertAdjacentHTML|fetch\(/);
});

check("Desativar ou invalidar a promoção também limpa a oferta antiga", () => {
    for (const config of [{ enabled: false }, { enabled: true, title: "Teste", description: "" }]) {
        app.promotion.init({ enabled: true, title: "Oferta de teste", description: "Condições de teste" });
        assert.equal(promotionSection.hidden, false);
        app.promotion.init(config);
        assert.equal(promotionSection.hidden, true);
        assert.equal(promotionTitle.textContent, "");
        assert.equal(promotionDescription.textContent, "");
    }
});

check("Componente ausente ou incompleto não interrompe a página", () => {
    const config = { enabled: true, title: "Teste", description: "Condições" };
    selectors.set("[data-promotion]", []);
    assert.doesNotThrow(() => app.promotion.init(config));
    selectors.set("[data-promotion]", [promotionSection]);
    promotionSection.descendants.delete("[data-promotion-description]");
    assert.doesNotThrow(() => app.promotion.init(config));
    assert.equal(promotionSection.hidden, true);
    assert.equal(promotionTitle.textContent, "");
    promotionSection.descendants.set("[data-promotion-description]", promotionDescription);
});

check("Inicialização integra a promoção sem modificar preços ou contatos", () => {
    const originalPromotion = app.config.promotion;
    const originalContact = JSON.stringify(app.config.contact);
    const originalMenu = readFileSync(join(root, "data/menu.json"), "utf8");
    const originalHtml = readFileSync(join(root, "index.html"), "utf8");
    app.config.promotion = { enabled: true, title: "Oferta de teste", description: "Condições de teste" };
    runScript("main.js");
    assert.equal(promotionSection.hidden, false);
    assert.equal(promotionTitle.textContent, "Oferta de teste");
    assert.equal(JSON.stringify(app.config.contact), originalContact);
    assert.equal(readFileSync(join(root, "data/menu.json"), "utf8"), originalMenu);
    assert.equal(readFileSync(join(root, "index.html"), "utf8"), originalHtml);
    app.config.promotion = originalPromotion;
    app.promotion.init(originalPromotion);
});

check("Telefone legível e link de ligação aparecem em todos os contatos", () => {
    app.whatsapp.init({ whatsappNumber: phoneFixture, whatsappMessage: "Teste" });
    assert.equal(selectors.get("[data-contact-phone-link]").length, 2);

    for (const link of selectors.get("[data-contact-phone-link]")) {
        assert.equal(link.hidden, false);
        assert.equal(link.textContent, "+55 (11) 99999-9999");
        assert.equal(link.getAttribute("href"), `tel:+${phoneFixture}`);
    }

    for (const fallback of selectors.get("[data-contact-phone-fallback]")) {
        assert.equal(fallback.hidden, true);
    }

    assert.equal(element("[data-whatsapp-only]").hidden, false);
});

check("Limpar ou invalidar o telefone remove destinos antigos", () => {
    for (const value of ["", " ", "abc", null, "javascript:alert(1)"]) {
        app.whatsapp.init({ whatsappNumber: phoneFixture, whatsappMessage: "Teste" });
        app.whatsapp.init({ whatsappNumber: value, whatsappMessage: "Teste" });

        for (const link of selectors.get("[data-contact-phone-link]")) {
            assert.equal(link.hidden, true);
            assert.equal(link.textContent, "");
            assert.equal(link.getAttribute("href"), null);
        }

        for (const fallback of selectors.get("[data-contact-phone-fallback]")) {
            assert.equal(fallback.hidden, false);
        }

        assert.equal(element("[data-whatsapp-only]").hidden, true);
        assert.equal(element("[data-whatsapp-status]").hidden, false);
    }
});

check("Instagram limpa todos os links inválidos e pode ser reativado", () => {
    assert.equal(selectors.get("[data-instagram-link]").length, 3);

    for (const value of ["", "http://example.com", "javascript:alert(1)", "https://name:pass@example.com", null]) {
        app.config.contact.instagramUrl = deliveredConfig.contact.instagramUrl;
        runScript("main.js");
        app.config.contact.instagramUrl = value;
        runScript("main.js");

        for (const link of selectors.get("[data-instagram-link]")) {
            assert.equal(link.hidden, true);
            assert.equal(link.getAttribute("href"), null);
            assert.equal(link.getAttribute("target"), null);
            assert.equal(link.getAttribute("rel"), null);
        }
    }

    app.config.contact.instagramUrl = deliveredConfig.contact.instagramUrl;
    runScript("main.js");

    for (const link of selectors.get("[data-instagram-link]")) {
        assert.equal(link.hidden, false);
        assert.equal(link.getAttribute("href"), deliveredConfig.contact.instagramUrl);
        assert.equal(link.getAttribute("rel"), "noopener noreferrer");
    }
});

check("Crédito da Neoeffex alterna entre link HTTPS e texto", () => {
    for (const invalid of ["", "javascript:alert(1)", "https://name:pass@example.com", null]) {
        app.config.developer.url = "https://example.com/credito";
        runScript("main.js");
        const credit = element("[data-developer-credit]");
        assert.equal(credit.children.length, 1);
        assert.equal(credit.children[0].textContent, `Desenvolvido por ${app.config.developer.name}`);
        assert.equal(credit.children[0].getAttribute("href"), "https://example.com/credito");
        assert.equal(credit.children[0].getAttribute("rel"), "noopener noreferrer");
        app.config.developer.url = invalid;
        runScript("main.js");
        assert.equal(credit.children.length, 0);
        assert.equal(credit.textContent, `Desenvolvido por ${app.config.developer.name}`);
    }

    app.config.developer.url = deliveredConfig.developer.url;
});

check("Endereço e horários admitem texto literal e voltam a ficar ocultos", () => {
    for (const [field, attribute] of [["address", "address"], ["openingHours", "hours"]]) {
        const value = "  Informação de teste\n<script>texto literal</script>  ";
        app.config.contact[field] = value;
        runScript("main.js");
        assert.equal(element(`[data-contact-${attribute}-row]`).hidden, false);
        assert.equal(element(`[data-contact-${attribute}]`).textContent, value.trim());

        for (const empty of [" ", null, 0]) {
            app.config.contact[field] = empty;
            runScript("main.js");
            assert.equal(element(`[data-contact-${attribute}-row]`).hidden, true);
            assert.equal(element(`[data-contact-${attribute}]`).textContent, "");
        }

        app.config.contact[field] = deliveredConfig.contact[field];
    }
});

check("Inicialização final sincroniza contato, rodapé e ano sem criar markup", () => {
    app.config.contact = JSON.parse(JSON.stringify(deliveredConfig.contact));
    app.config.contact.whatsappNumber = phoneFixture;
    app.config.contact.regions = "Região de teste <script>texto</script>";
    app.config.contact.instagramHandle = "@perfil-de-teste";
    runScript("main.js");

    for (const item of selectors.get("[data-contact-regions]")) {
        assert.equal(item.textContent, app.config.contact.regions);
        assert.equal(item.children.length, 0);
    }

    for (const item of selectors.get("[data-instagram-handle]")) {
        assert.equal(item.textContent, "@perfil-de-teste");
    }

    assert.equal(element("[data-current-year]").textContent, String(new Date().getFullYear()));
    assert.doesNotMatch(readFileSync(join(root, "scripts/main.js"), "utf8"), /innerHTML|insertAdjacentHTML|fetch\(/);
    app.config.contact = JSON.parse(JSON.stringify(deliveredConfig.contact));
    runScript("main.js");
});

validateEnhancements({ check, root, html });
validateRelease({ check, root, html, config: deliveredConfig, normalizePhone: app.whatsapp.normalizePhone });
validateOrganicBackgrounds({ check, root, html });
validateDecorations({ check, root, html });
validateMotion({ check, root, html, config: deliveredConfig });
validateHeroIntro({ check, root, html, config: deliveredConfig });
validateCardHover({ check, root, html, config: deliveredConfig });
validateContactJump({ check, root, html, config: deliveredConfig });
validateForkHighlight({ check, root, html, config: deliveredConfig });
validatePriceCountup({ check, root, html, config: deliveredConfig });
validateCatalogLink({ check, root, html, config: deliveredConfig });

console.log(`\n${passed} grupos aprovados; ${failures.length} falhas.`);

if (failures.length > 0) {
    process.exitCode = 1;
}
