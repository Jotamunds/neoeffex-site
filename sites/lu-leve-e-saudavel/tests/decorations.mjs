/* Contratos estáticos, geração e contraste. Não executa um navegador. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { decorationAssets, renderDecoration, updateDecorationsHtml } from "../tools/build-decorations.mjs";

export function validateDecorations({ check, root, html }) {
    const read = (name) => readFileSync(join(root, name), "utf8");
    const ids = Object.keys(decorationAssets);
    const sections = { hero: "inicio", fitness: "fitness", final: "fazer-pedido", traditional: "tradicionais", steps: "como-funciona", contact: "contato" };
    const assets = Object.fromEntries(Object.entries(decorationAssets).map(([id, name]) => [id, read("assets/decorations/" + name)]));
    const css = read("styles/components/decorations.css").replace(/\/\*[\s\S]*?\*\//g, "");
    const variables = Object.fromEntries([...read("styles/base/variables.css").matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
    const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
        selectors: selector.trim().split(",").map((value) => value.trim()),
        declarations: Object.fromEntries(body.split(";").map((line) => line.trim()).filter(Boolean).map((line) => {
            const colon = line.indexOf(":");
            return [line.slice(0, colon).trim(), line.slice(colon + 1).trim()];
        }))
    }));
    const blocks = [...html.matchAll(/<!-- DECORATION:([a-z]+):START -->([\s\S]*?)<!-- DECORATION:\1:END -->/g)];

    check("Seis ícones locais com origem e licença incluídas, sem dependência de runtime", () => {
        assert.deepEqual(Object.values(decorationAssets), ["sprout.svg", "dumbbell.svg", "leaf.svg", "wheat.svg", "salad.svg", "sun.svg"]);
        assert.match(read("assets/decorations/LICENSE-LUCIDE.txt"), /ISC License[\s\S]*Lucide Icons and Contributors/);
        assert.match(read("assets/decorations/README.md"), /1\.8\.0/);

        for (const [id, svg] of Object.entries(assets)) {
            assert.ok(Buffer.byteLength(svg) < 2048);
            assert.ok(renderDecoration(id, svg).includes('stroke="currentColor"'));
        }
    });

    check("HTML sincronizado com SVGs e geração idempotente, sem alterar preços ou ondas", () => {
        assert.equal(updateDecorationsHtml(html, assets), html);
        const changed = { ...assets, hero: assets.hero.replace("M4 9a5", "M4.1 9a5") };
        const after = updateDecorationsHtml(html, changed);
        const strip = (value) => value.replace(/<!-- DECORATION:([a-z]+):START -->[\s\S]*?<!-- DECORATION:\1:END -->/g, "");
        assert.notEqual(after, html);
        assert.equal(updateDecorationsHtml(after, changed), after);
        assert.equal(strip(after), strip(html));
    });

    check("Gerador rejeita SVGs com conteúdo ativo, atributos extras ou recursos externos", () => {
        for (const invalid of [
            assets.hero.replace('<path d=', '<path onclick="alert(1)" d='),
            assets.hero.replace('</svg>', '<script>alert(1)</script></svg>'),
            assets.hero.replace('</svg>', '<use href="other.svg"></use></svg>'),
            assets.hero.replace('stroke="currentColor"', 'style="stroke:red"'),
            assets.hero.replace(/<path[^>]*><\/path>/g, ""),
            null
        ]) {
            assert.throws(() => renderDecoration("hero", invalid));
        }

        assert.throws(() => renderDecoration("unknown", assets.hero));
    });

    check("Gerador rejeita marcadores ausentes, duplicados, invertidos e aninhados", () => {
        const start = "            <!-- DECORATION:hero:START -->";
        const end = "            <!-- DECORATION:hero:END -->";
        assert.throws(() => updateDecorationsHtml(html.replace(start, ""), assets), /Marcador/);
        assert.throws(() => updateDecorationsHtml(html + start, assets), /Marcador/);
        assert.throws(() => updateDecorationsHtml(html.replace(start, "TEMP").replace(end, start).replace("TEMP", end), assets), /ordem/);
        assert.throws(() => updateDecorationsHtml(html.replace(start, start + "\n<!-- DECORATION:extra:START -->"), assets), /aninhados/);
    });

    check("Ícones são decorativos, sem foco, eventos, links ou conteúdo comercial", () => {
        assert.equal(blocks.length, 6);
        assert.deepEqual(blocks.map((block) => block[1]).sort(), [...ids].sort());

        for (const [match, id, body] of blocks) {
            assert.equal((body.match(/<svg\b/g) || []).length, 1);
            assert.match(body, /class="section-decoration__art" aria-hidden="true" focusable="false"/);
            assert.match(body, new RegExp('class="section-decoration section-decoration--' + id + '" aria-hidden="true"'));
            assert.doesNotMatch(match, /\b(?:tabindex|href|src|style|on\w+)=|<(?:title|a|text|image|use|script)\b|MENU:/);
        }
    });

    check("Decorações têm import isolado antes das ondas e ativação independente", () => {
        const imports = [...read("styles/main.css").matchAll(/@import\s+url\("([^"]+)"\)/g)].map((match) => match[1]);
        assert.deepEqual(imports.slice(-2), ["./components/decorations.css", "./components/organic-backgrounds.css"]);
        assert.equal(imports.filter((item) => item.includes("decorations.css")).length, 1);
        assert.deepEqual(rules[0], { selectors: [".section-decoration"], declarations: { display: "none" } });
        assert.match(html, /<body class="[^"]*\bdecorative-elements\b/);

        for (const rule of rules.slice(1)) {
            assert.ok(rule.selectors.every((selector) => selector.startsWith(".decorative-elements ")));
        }

        assert.doesNotMatch(css, /organic|--(?:color|organic|space|font|mobile)-[\w-]+\s*:/);
    });

    check("Recorte e rotação ficam somente na decoração, sem modificar conteúdo ou barra", () => {
        const frame = rules.find((rule) => rule.selectors.includes(".decorative-elements .section-decoration")).declarations;
        assert.equal(frame.position, "absolute");
        assert.equal(frame.inset, "0");
        assert.equal(frame["z-index"], "-1");
        assert.equal(frame.overflow, "hidden");
        assert.equal(frame["border-radius"], "inherit");
        assert.equal(frame["pointer-events"], "none");
        const parents = rules.find((rule) => rule.declarations.isolation === "isolate");
        assert.deepEqual(parents.selectors, [".decorative-elements .hero", ".decorative-elements .products--fitness", ".decorative-elements .final-cta", ".decorative-elements .products--traditional", ".decorative-elements .how-it-works", ".decorative-elements .contact"]);

        for (const rule of rules) {
            assert.doesNotMatch(Object.keys(rule.declarations).join(" "), /\b(?:padding|margin|filter|clip-path|contain)\b/);

            if ("transform" in rule.declarations || "opacity" in rule.declarations || "width" in rule.declarations) {
                assert.ok(rule.selectors.every((selector) => selector.endsWith(".section-decoration__art")));
            }

            if ("overflow" in rule.declarations) assert.deepEqual(rule.selectors, [".decorative-elements .section-decoration"]);
        }

        assert.doesNotMatch(css, /100vw|!important|\b(?:body|html|main|price-card|mobile-order|\.container)\b/);
    });

    check("CSS-base dos ícones é estático; impressão/cores forçadas ocultam; haltere só a partir de 60rem", () => {
        const media = [...css.matchAll(/@media\s+([^{}]+)\{/g)].map((match) => match[1]);
        assert.deepEqual(media, ["screen and (forced-colors: none) ", "screen and (forced-colors: none) and (min-width: 60rem) "]);
        assert.match(css.trim(), /^\.section-decoration\s*\{\s*display:\s*none;\s*\}\s*@media/);
        const fitness = rules.filter((rule) => rule.selectors.includes(".decorative-elements .section-decoration--fitness"));
        assert.deepEqual(fitness.map((rule) => rule.declarations.display), ["none", "block"]);
        assert.doesNotMatch(css, /animation|transition|@keyframes/);
    });

    check("Cores, tamanhos, posições e intensidade usam variáveis próprias consumidas", () => {
        const names = Object.keys(variables).filter((name) => name.startsWith("--decoration-"));
        assert.equal(names.length, 38);

        for (const name of names) assert.ok(css.includes(`var(${name})`), name);
        for (const id of ids) {
            assert.match(variables[`--decoration-${id}-size`], /^clamp\([\d.]+rem, [\d.]+vw, [\d.]+rem\)$/);
            const opacity = Number(variables[`--decoration-${id}-opacity`]);
            assert.ok(opacity > 0 && opacity < 1);
            assert.match(variables[`--decoration-${id}-color`], /^var\(--color-[\w-]+\)$/);
        }
    });

    check("Contraste permanece legível mesmo no pior encontro entre traço, fundo e texto", () => {
        const color = (name) => {
            let value = variables[name];
            for (let i = 0; value.startsWith("var(") && i < 5; i += 1) value = variables[value.slice(4, -1)];
            assert.match(value, /^#[a-f0-9]{6}$/i);
            return value.slice(1).match(/../g).map((channel) => parseInt(channel, 16));
        };
        const mix = (a, b, alpha) => a.map((value, index) => value * (1 - alpha) + b[index] * alpha);
        const luminance = (rgb) => rgb.map((channel) => channel / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
            .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
        const backgrounds = { hero: "--color-primary", fitness: "--color-sage", final: "--color-primary", traditional: "--color-background", steps: "--color-accent-soft", contact: "--color-primary" };
        for (const id of ids) {
            const base = color(backgrounds[id]);
            const lightBackground = ["fitness", "traditional", "steps"].includes(id);
            const texts = lightBackground ? ["--color-text", "--color-text-muted"] : ["--color-text-light", "--color-sage"];
            const opacity = Number(variables[`--decoration-${id}-opacity`]);
            for (const shapeAlpha of id === "hero" ? [0, 0.3, 0.62, 1] : [0]) {
                const underneath = mix(base, color("--color-primary-light"), shapeAlpha);
                for (const alpha of [0, opacity / 2, opacity]) {
                    const background = luminance(mix(underneath, color(`--decoration-${id}-color`), alpha));
                    for (const name of texts) {
                        const foreground = luminance(color(name));
                        const ratio = (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05);
                        assert.ok(ratio >= 4.5, `${id}: contraste ${name} = ${ratio.toFixed(2)}:1`);
                    }
                }
            }
        }
    });

    check("Comando de conferência funciona fora da raiz, não escreve e recusa argumentos extras", () => {
        const before = read("index.html");
        const file = join(root, "tools/build-decorations.mjs");
        const result = spawnSync(process.execPath, [file, "--check"], { cwd: dirname(root), encoding: "utf8" });
        assert.equal(result.status, 0, result.stderr);
        const invalid = spawnSync(process.execPath, [file, "--publish"], { cwd: dirname(root), encoding: "utf8" });
        assert.equal(invalid.status, 1);
        assert.equal(read("index.html"), before);
    });

    check("Seis ícones e o garfinho coexistem com cinco ondas, sem desenho em runtime", () => {
        assert.equal((html.match(/<svg\b/g) || []).length, 12);
        assert.equal((html.match(/<svg class="organic-wave/g) || []).length, 5);
        assert.equal((html.match(/<script\b/g) || []).length, 11);
        assert.doesNotMatch(html, /<script[^>]*(?:lucide|decorations)|<use\b|<img[^>]*\.svg/);
        assert.doesNotMatch(css, /url\(|mask/);
        for (const id of ids) {
            const sectionId = sections[id];
            const section = html.match(new RegExp('<section\\b[^>]*id="' + sectionId + '"[^>]*>([\\s\\S]*?)</section>'));
            assert.ok(section?.[1].includes(`DECORATION:${id}:START`));
            assert.ok(section[1].indexOf(`DECORATION:${id}:END`) < section[1].indexOf('<div class="container'));
        }
    });

    check("Broto preserva as folhas e o caule, sem a barrinha de solo no asset ou no HTML", () => {
        const paths = [...assets.hero.matchAll(/<path d="([^"]+)"/g)].map((match) => match[1]);
        assert.equal(paths.length, 2);
        assert.ok(paths.some((path) => path.startsWith("M14 9.536V7")));
        assert.ok(paths.includes("M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"));
        assert.doesNotMatch(assets.hero, /M5 21h14/);
        assert.doesNotMatch(blocks.find((block) => block[1] === "hero")[2], /M5 21h14/);
    });

    check("Sol aceita círculo local válido e rejeita raio inválido, eventos ou atributos extras", () => {
        assert.match(renderDecoration("contact", assets.contact), /<circle cx="12" cy="12" r="4"><\/circle>/);
        for (const invalid of [
            assets.contact.replace('r="4"', 'r="0"'),
            assets.contact.replace('r="4"', 'r="-1"'),
            assets.contact.replace('r="4"', 'r="25"'),
            assets.contact.replace('cx="12"', 'cx="NaN"'),
            assets.contact.replace('cy="12"', 'cy="Infinity"'),
            assets.contact.replace('r="4"', 'r="4" onclick="alert(1)"'),
            assets.contact.replace('<circle ', '<circle href="external.svg" ')
        ]) {
            assert.throws(() => renderDecoration("contact", invalid));
        }
    });

    check("Novos elementos alternam bordas sem deslocar a moldura ou o conteúdo", () => {
        const art = rules.find((rule) => rule.selectors.includes(".decorative-elements .section-decoration__art")).declarations;
        assert.equal(art.left, "var(--decoration-left, auto)");
        assert.equal(art.right, "var(--decoration-right, auto)");
        for (const [id, side, edge] of [["traditional", "left", "top"], ["steps", "right", "bottom"], ["contact", "left", "bottom"]]) {
            const settings = rules.find((rule) => rule.selectors.includes(`.decorative-elements .section-decoration--${id}`)).declarations;
            assert.equal(settings[`--decoration-${side}`], `var(--decoration-${id}-${side})`);
            assert.ok(!(`--decoration-${side === "left" ? "right" : "left"}` in settings));
            const placement = rules.find((rule) => rule.selectors.includes(`.decorative-elements .section-decoration--${id} .section-decoration__art`)).declarations;
            assert.equal(placement[edge], `var(--decoration-${id}-${edge})`);
        }
    });
}
