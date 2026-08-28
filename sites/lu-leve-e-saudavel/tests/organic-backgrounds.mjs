/* Contratos de CSS e cálculos, não uma simulação de renderização do navegador. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseContour, validateContour, scaleContour, sampleSegment } from "./curve-geometry.mjs";

export function validateOrganicBackgrounds({ check, root, html }) {
    const read = (path) => readFileSync(join(root, path), "utf8");
    const css = read("styles/components/organic-backgrounds.css").replace(/\/\*[\s\S]*?\*\//g, "");
    const tokens = read("styles/base/variables.css");
    const variables = Object.fromEntries([...tokens.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
    const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
        selectors: selector.trim().split(",").map((value) => value.trim()),
        declarations: Object.fromEntries(body.split(";").map((line) => line.trim()).filter(Boolean).map((line) => {
            const colon = line.indexOf(":");
            return [line.slice(0, colon).trim(), line.slice(colon + 1).trim()];
        }))
    }));
    const selectors = rules.flatMap((rule) => rule.selectors);
    const waves = [...html.matchAll(/<svg\b([^>]*\bclass="organic-wave(?: organic-wave--ribbon)?"[^>]*)>\s*<path d="([^"]+)"><\/path>\s*<\/svg>/g)].map((match) => ({
        attributes: Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map((item) => [item[1], item[2]])),
        path: match[2],
        markup: match[0],
        position: match.index
    }));

    check("Fundos orgânicos têm import único, final e ativação sem JavaScript novo", () => {
        const imports = [...read("styles/main.css").matchAll(/@import\s+url\("([^"]+)"\)/g)].map((match) => match[1]);
        assert.equal(imports.at(-1), "./components/organic-backgrounds.css");
        assert.equal(imports.filter((path) => path.includes("organic-backgrounds")).length, 1);
        assert.doesNotMatch(html, /<script[^>]*organic|data-organic|<canvas\b/);
        assert.equal((html.match(/<script\b/g) || []).length, 8);
    });

    check("Efeito depende da classe; apenas ocultar SVGs no visual-base é incondicional", () => {
        assert.ok(rules.length >= 8);
        assert.deepEqual(rules[0], { selectors: [".organic-wave"], declarations: { display: "none" } });

        for (const selector of selectors.slice(1)) {
            assert.ok(selector.startsWith(".organic-backgrounds "), selector);
            assert.doesNotMatch(selector, /(?:^|\s)(?:body|main|html|:root|\.container|\.section)(?=\s|$|:)/);
            assert.doesNotMatch(selector, /price-card|mobile-order|site-header|site-footer|contact/);
        }

        assert.doesNotMatch(css, /--(?:color|space|font|mobile|section|surface|text|button)-[\w-]+\s*:/);
    });

    check("Regras só atuam na tela sem alto contraste; impressão usa o visual-base", () => {
        const media = [...css.matchAll(/@media\s+([^{}]+)\{/g)].map((match) => match[1]);
        assert.equal(media.length, 2);
        assert.ok(media.every((query) => query.startsWith("screen and (forced-colors: none)")));
        assert.match(media[1], /min-width:\s*60rem/);
        assert.match(css.trim(), /^\.organic-wave\s*\{\s*display:\s*none;\s*\}\s*@media screen/);
        assert.doesNotMatch(css, /prefers-reduced-motion|@keyframes|\banimation\s*:|\btransition\s*:/);
    });

    check("Decoração não altera medidas do conteúdo, cores de texto nem recorta contêineres", () => {
        const forbidden = /^(?:padding(?:-.+)?|margin(?:-.+)?|clip(?:-path)?|filter|backdrop-filter|color|font(?:-.+)?|min-height|max-height|contain)$/;

        for (const { selectors: list, declarations } of rules) {
            for (const property of Object.keys(declarations)) {
                assert.doesNotMatch(property, forbidden);

                if (/^(?:display|width|overflow(?:-.+)?)$/.test(property)) {
                    assert.ok(list.every((selector) => /\.organic-wave$/.test(selector)), property);
                }
            }

            if ("height" in declarations || "background" in declarations || "transform" in declarations || "opacity" in declarations) {
                assert.ok(list.every((selector) => /::(?:before|after)$|\.organic-wave$/.test(selector)));
            }
        }

        assert.doesNotMatch(css, /!important|100vw|mask(?:-image)?\s*:|url\(|radial-gradient\(|clip-path|stroke\s*:/);
    });

    check("Pseudo-elementos criados têm camadas locais e não recebem cliques", () => {
        const parents = rules.filter((rule) => rule.declarations.isolation === "isolate").flatMap((rule) => rule.selectors);

        for (const rule of rules.filter((item) => "content" in item.declarations)) {
            assert.equal(rule.declarations.content, '""');
            assert.equal(rule.declarations.position, "absolute");
            assert.equal(rule.declarations["z-index"], "-1");
            assert.equal(rule.declarations["pointer-events"], "none");

            for (const selector of rule.selectors) {
                assert.ok(parents.includes(selector.replace(/::(?:before|after)$/, "")), `Falta isolamento local: ${selector}`);
            }
        }
    });

    check("CSS orgânico reaproveita o contorno sem transformar foto ou página", () => {
        const transformed = rules.filter((rule) => "transform" in rule.declarations);
        assert.equal(transformed.length, 1);
        assert.deepEqual(transformed[0].selectors, [".organic-backgrounds .hero .hero__artwork::before"]);
        assert.equal(transformed[0].declarations.transform, "none");
        assert.match(read("styles/sections/hero.css"), /\.hero__artwork::before\s*\{[^}]*pointer-events:\s*none/);
        assert.doesNotMatch(css, /\.hero__visual::after/);
    });

    check("Transição prevê promoção visível, oculta e removida sem depender de :has", () => {
        for (const suffix of [
            ".hero + .promotion:not([hidden]) > .organic-wave",
            ".hero + .promotion[hidden] + .products--traditional > .organic-wave",
            ".hero + .products--traditional > .organic-wave"
        ]) {
            const rule = rules.find((item) => item.selectors.includes(`.organic-backgrounds ${suffix}`));
            assert.ok(rule, suffix);
            assert.equal(rule.declarations.display, "block");
        }

        assert.doesNotMatch(css, /:has\(|\.promotion::before|products--traditional > \.organic-wave\s*\{/);
        assert.match(html, /id="promocao"[^>]*hidden/);
    });

    check("Curvas do fitness usam os fundos atuais e faixa secundária apenas na borda", () => {
        assert.match(html, /products--fitness theme--sage/);
        assert.match(html, /how-it-works theme--warm/);
        const top = ".organic-backgrounds .products--fitness > .organic-wave";
        const bottom = ".organic-backgrounds .products--fitness + .how-it-works > .organic-wave";
        assert.ok(selectors.includes(top) && selectors.includes(bottom));
        assert.ok(!rules.some((rule) => "box-shadow" in rule.declarations));
        const ribbon = rules.find((rule) => rule.selectors.includes(".organic-backgrounds .organic-wave--ribbon")).declarations;
        assert.equal(ribbon.fill, "var(--organic-ribbon-color)");
        assert.equal(ribbon["inset-block-start"], "calc(-1 * (var(--organic-curve-height) + var(--organic-ribbon-width)))");
    });

    check("Curvas ocupam a largura da seção e cobrem a emenda sem largura extra", () => {
        const curve = rules.find((rule) => "height" in rule.declarations).declarations;
        assert.equal(curve["inset-inline"], "0");
        assert.equal(curve["inset-block-start"], "calc(-1 * var(--organic-curve-height))");
        assert.equal(curve.height, "calc(var(--organic-curve-height) + var(--border-width))");
        assert.equal(curve.width, "100%");
        assert.equal(curve.overflow, "hidden");
        assert.equal(curve.position, "absolute");
        assert.equal(curve["z-index"], "-1");
        assert.equal(curve["pointer-events"], "none");
        assert.equal(curve.fill, "var(--section-background)");
        assert.doesNotMatch(css, /translate|rotate|scale|inset-inline:\s*-/);
    });

    check("Altura prevista das curvas cabe no respiro atual em larguras e fontes variadas", () => {
        function length(expression, width, fontSize) {
            const value = expression.replace(/var\((--[\w-]+)\)/g, (_, name) => variables[name]).trim();

            if (value.startsWith("clamp(")) {
                const [min, preferred, max] = value.slice(6, -1).split(",").map((part) => length(part, width, fontSize));
                return Math.max(min, Math.min(preferred, max));
            }

            if (value.includes("+")) {
                return value.split("+").reduce((sum, part) => sum + length(part, width, fontSize), 0);
            }

            const parts = value.match(/^([\d.]+)(rem|vw|px)$/);
            assert.ok(parts, `Unidade não prevista no cálculo: ${value}`);
            return Number(parts[1]) * ({ rem: fontSize, vw: width / 100, px: 1 }[parts[2]]);
        }

        const heroPadding = read("styles/sections/hero.css").match(/\.hero\s*\{\s*padding-block:\s*([^;]+)/)[1];

        for (const width of [320, 375, 430, 600, 767, 768, 960, 1024, 1440, 1920]) {
            for (const fontSize of [16, 20, 32]) {
                const curve = length(variables["--organic-curve-height"], width, fontSize);
                const ribbon = length(variables["--organic-ribbon-width"], width, fontSize);
                const hero = length(width >= 60 * fontSize ? variables["--space-6"] : heroPadding, width, fontSize);
                const section = length(variables["--space-section"], width, fontSize);
                assert.ok(curve <= hero, `Curva invade respiro do hero em ${width}px / fonte ${fontSize}px.`);
                assert.ok(curve + ribbon <= section, `Curva invade respiro das seções em ${width}px / fonte ${fontSize}px.`);
                assert.ok(ribbon <= curve * 0.25, "Faixa deve permanecer sobreposta à onda principal.");
            }
        }
    });

    check("Textos do hero mantêm contraste sobre a mancha e sua mistura com o fundo", () => {
        function color(name) {
            let value = variables[name];

            for (let depth = 0; value?.startsWith("var(") && depth < 5; depth += 1) {
                value = variables[value.slice(4, -1)];
            }

            assert.match(value, /^#[a-f0-9]{6}$/i);
            return value.slice(1).match(/../g).map((channel) => parseInt(channel, 16));
        }

        function luminance(rgb) {
            const linear = rgb.map((channel) => {
                const value = channel / 255;
                return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
            });
            return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
        }

        const base = color("--color-primary");
        const shape = color("--organic-hero-shape-color");
        const opacity = Number(variables["--organic-shape-opacity"]);
        const accentOpacity = Number(variables["--organic-hero-accent-opacity"]);
        assert.ok(Number.isFinite(opacity) && opacity >= 0 && opacity <= 1);
        assert.ok(Number.isFinite(accentOpacity) && accentOpacity >= 0 && accentOpacity <= 1);
        const overlapOpacity = 1 - (1 - opacity) * (1 - accentOpacity);

        for (const alpha of [0, opacity / 2, accentOpacity, opacity, overlapOpacity, 1]) {
            const background = luminance(base.map((channel, index) => channel * (1 - alpha) + shape[index] * alpha));

            for (const name of ["--color-text-light", "--color-sage"]) {
                const foreground = luminance(color(name));
                const ratio = (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05);
                assert.ok(ratio >= 4.5, `Contraste ${name} com opacidade ${alpha}: ${ratio.toFixed(2)}:1.`);
            }
        }
    });

    check("Segunda forma do hero usa a mesma cor segura e limites internos nos dois layouts", () => {
        const before = ".organic-backgrounds .hero::before";
        const after = ".organic-backgrounds .hero::after";
        const painting = rules.filter((rule) => rule.selectors.includes(after) && "background" in rule.declarations);
        assert.equal(painting.length, 1);
        assert.ok(painting[0].selectors.includes(before));
        assert.equal(painting[0].declarations.background, "var(--organic-hero-shape-color)");
        const accent = rules.find((rule) => rule.selectors.includes(after) && "opacity" in rule.declarations);
        assert.equal(accent.declarations.opacity, "var(--organic-hero-accent-opacity)");
        assert.notEqual(variables["--organic-hero-shape-radius"], variables["--organic-hero-accent-radius"]);

        for (const selector of [before, after]) {
            const placements = rules.filter((rule) => rule.selectors.includes(selector) && "inset" in rule.declarations);
            assert.equal(placements.length, 2, "Posições mobile e desktop devem ser explícitas.");

            for (const { declarations } of placements) {
                const sides = declarations.inset.match(/var\([^)]+\)|[^\s]+/g);
                assert.equal(sides.length, 4);
                assert.ok(sides.every((side) => /^(?:\d+(?:\.\d+)?%|var\(--(?:organic-shape-offset|page-gutter-safe)\))$/.test(side)));
            }
        }
    });

    check("Cinco SVGs locais têm um path decorativo cada, sem stroke ou recursos externos", () => {
        assert.equal(waves.length, 5);
        assert.equal((html.match(/<svg class="organic-wave(?: organic-wave--ribbon)?"/g) || []).length, waves.length);
        assert.ok(waves.every((wave) => (wave.markup.match(/<path\b/g) || []).length === 1));

        for (const { attributes, markup } of waves) {
            assert.deepEqual(Object.keys(attributes).sort(), ["aria-hidden", "class", "focusable", "preserveAspectRatio", "viewBox", "xmlns"].sort());
            assert.equal(attributes.xmlns, "http://www.w3.org/2000/svg");
            assert.equal(attributes.viewBox, "0 0 1440 100");
            assert.equal(attributes.preserveAspectRatio, "none");
            assert.equal(attributes["aria-hidden"], "true");
            assert.equal(attributes.focusable, "false");
            assert.match(attributes.class, /^organic-wave(?: organic-wave--ribbon)?$/);
            assert.doesNotMatch(markup, /\b(?:href|tabindex|stroke|style)=|<(?:use|image|script|a|defs)\b/);
        }

        assert.equal(waves[0].path, waves[1].path, "Os estados da promoção precisam da mesma silhueta.");
        assert.equal(waves[2].path, waves[3].path, "A faixa e a onda do fitness precisam ser idênticas.");
        assert.equal(waves[2].attributes.class, "organic-wave organic-wave--ribbon");
        assert.equal(new Set(waves.map((wave) => wave.path)).size, 3, "Preservar três perfis distintos.");
    });

    check("Contornos têm tangentes e segundas derivadas contínuas, sem cúspides ou auto-interseções", () => {
        for (const { path } of waves) {
            const curve = parseContour(path);
            validateContour(curve);
            let previousX = -1;

            for (const segment of curve.segments) {
                for (let step = 0; step <= 100; step += 1) {
                    const [x, y] = sampleSegment(segment, step / 100);
                    assert.ok(x >= previousX && y > 0 && y < 100);
                    previousX = x;
                }
            }
        }
    });

    check("Escalas positivas de largura, altura e zoom conservam a continuidade dos SVGs", () => {
        for (const { path } of waves) {
            const curve = parseContour(path);

            for (const width of [320, 375, 430, 767.5, 768, 959.5, 960, 1024, 1440, 1920]) {
                for (const height of [20, 30.7, 48, 60, 96]) {
                    for (const zoom of [1, 1.25, 2]) {
                        const scaleX = width * zoom / 1440;
                        const scaleY = height * zoom / 100;
                        validateContour(scaleContour(curve, scaleX, scaleY), 1440 * scaleX, 100 * scaleY);
                    }
                }
            }
        }
    });

    check("Regressão: validador rejeita tangentes quebradas, curvatura quebrada e controles invertidos", () => {
        const original = parseContour(waves[0].path);
        const cusp = structuredClone(original);
        cusp.segments[1][1][1] += 5;
        assert.throws(() => validateContour(cusp), /primeira derivada/);

        const kink = structuredClone(original);
        kink.segments[1][2][1] += 1;
        kink.segments[2][1][1] -= 1;
        assert.throws(() => validateContour(kink), /segunda derivada/);

        const reversed = structuredClone(original);
        reversed.segments[0][1][0] = -1;
        assert.throws(() => validateContour(reversed), /fora do SVG/);

        const stalled = structuredClone(original);
        stalled.segments[0][1][0] = 0;
        assert.throws(() => validateContour(stalled), /Controle X/);
    });

    check("Regressão: gramática impede retas no meio da onda, contorno extra e fechamento defeituoso", () => {
        const path = waves[0].path;

        for (const invalid of [
            path.replace("C", "L"),
            path.replace("C", "Q"),
            path.replace("160", "NaN"),
            path.replace("160", "Infinity"),
            path + " M 0 0",
            path.replace(" Z", "")
        ]) {
            assert.throws(() => parseContour(invalid));
        }

        const broken = parseContour(path.replace("L 1440 100", "L 1400 100"));
        assert.throws(() => validateContour(broken), /Fechamento/);
        const clipped = parseContour(path.replace("320 9", "320 0"));
        assert.throws(() => validateContour(clipped), /fora do SVG/);
    });

    check("Manchas do hero não se cruzam e os outros contornos decorativos mantêm raios positivos", () => {
        const placements = (pseudo) => rules.filter((rule) => rule.selectors.includes(".organic-backgrounds .hero::" + pseudo) && "inset" in rule.declarations)
            .map((rule) => rule.declarations.inset.match(/var\([^)]+\)|[^\s]+/g));
        const [mobileBefore, desktopBefore] = placements("before");
        const [mobileAfter, desktopAfter] = placements("after");
        assert.ok(100 - parseFloat(mobileAfter[2]) < parseFloat(mobileBefore[0]), "As manchas mobile devem ter intervalo vertical.");
        assert.ok(100 - parseFloat(desktopAfter[1]) < parseFloat(desktopBefore[3]), "As manchas desktop devem ter intervalo horizontal.");

        for (const name of ["--organic-hero-shape-radius", "--organic-hero-accent-radius", "--organic-photo-outline-radius", "--radius-hero-image", "--radius-hero-section"]) {
            const values = variables[name].match(/[\d.]+/g).map(Number);
            assert.ok(values.length > 0 && values.every((value) => value > 0), name);
        }

        assert.match(read("styles/sections/final-cta.css"), /border-start-start-radius:\s*var\(--radius-hero-section\)/);
    });

    check("SVGs precedem o conteúdo, com isolamento local e cópia da faixa atrás da onda", () => {
        const ids = ["promocao", "tradicionais", "fitness", "como-funciona"];
        const expectedCounts = [1, 1, 2, 1];
        let total = 0;

        for (const [index, id] of ids.entries()) {
            const section = html.match(new RegExp('<(?:section|aside)\\b[^>]*\\bid="' + id + '"[^>]*>([\\s\\S]*?)<div class="container'));
            assert.ok(section, id);
            const prefix = section[1];
            const count = (prefix.match(/<svg class="organic-wave(?: organic-wave--ribbon)?"/g) || []).length;
            assert.equal(count, expectedCounts[index], id);
            assert.doesNotMatch(prefix, /MENU:|data-reveal|<(?:p|a|h[1-6])\b/);
            total += count;
        }

        assert.equal(total, waves.length);
        const parents = rules.filter((rule) => rule.declarations.isolation === "isolate").flatMap((rule) => rule.selectors);
        const visible = rules.find((rule) => rule.declarations.display === "block");
        assert.equal(visible.selectors.length, 5);

        for (const selector of visible.selectors) {
            assert.ok(parents.includes(selector.replace(" > .organic-wave", "")), selector);
        }

        assert.ok(!selectors.includes(".organic-backgrounds .products--traditional > .organic-wave"));
        assert.ok(waves[2].position < waves[3].position, "A faixa deve pintar antes da onda principal.");
    });

    check("Variáveis orgânicas permanecem exclusivas do componente experimental", () => {
        const names = [...tokens.matchAll(/(--organic-[\w-]+):/g)].map((match) => match[1]);
        assert.ok(names.length >= 6);
        assert.equal(new Set(names).size, names.length);

        for (const name of names) {
            assert.ok(css.includes(`var(${name})`), `Variável sem uso: ${name}`);
        }

        assert.doesNotMatch(read("scripts/main.js") + read("scripts/mobile-order.js"), /organic/);
    });
}
