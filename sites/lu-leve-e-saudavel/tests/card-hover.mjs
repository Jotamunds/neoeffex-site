/* Etapa 3: contratos CSS e controle em simulação; não renderiza navegador. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createFixture } from "./enhancements.mjs";
import { createIntroFixture } from "./intro-fixture.mjs";

export function validateCardHover({ check, root, html, config }) {
    const read = (file) => readFileSync(join(root, file), "utf8");
    const css = read("styles/components/card-hover.css").replace(/\/\*[\s\S]*?\*\//g, "");
    const variables = read("styles/base/variables.css");
    const script = read("scripts/animations.js");
    const make = (options) => createFixture(root, "animations.js", options);
    const permission = (fixture) => fixture.documentRoot.getAttribute("data-motion-cards");

    check("Hover alcança os cinco cards informativos sem mudar sua semântica", () => {
        const cards = [...html.matchAll(/<article\b[^>]*class="[^"]*price-card[^"]*"[^>]*>[\s\S]*?<\/article>/g)];
        assert.equal(cards.length, 5);
        for (const [card] of cards) {
            assert.doesNotMatch(card, /tabindex|role="button"|onclick|data-reveal|data-intro|(?:^|\s)hidden(?:\s|>)/);
            assert.match(card, /price-card__combo--featured/);
        }
        assert.doesNotMatch(css, /cursor|pointer-events|user-select|touch-action/);
        assert.doesNotMatch(html.match(/<html\b[^>]*>/)[0], /data-motion-cards/);
    });

    check("Componente é importado uma vez após a superfície, sem alterar a intro", () => {
        const imports = [...read("styles/main.css").matchAll(/@import url\("([^"]+)"\)/g)].map((match) => match[1]);
        assert.equal(imports.filter((path) => path.includes("card-hover.css")).length, 1);
        assert.ok(imports.indexOf("./components/card-hover.css") > imports.indexOf("./components/surfaces.css"));
        assert.deepEqual(imports.slice(-3), ["./components/hero-intro.css", "./components/decorations.css", "./components/organic-backgrounds.css"]);
        assert.doesNotMatch(css, /\.hero|\.organic|\.section-decoration|\.contact|\.mobile-order/);
    });

    check("Hover requer ponteiro preciso, capacidade primária e movimento permitido", () => {
        assert.match(css, /@media screen and \(hover: hover\) and \(pointer: fine\) and \(prefers-reduced-motion: no-preference\) and \(forced-colors: none\)/);
        assert.doesNotMatch(css, /any-hover|any-pointer/);
        const selector = 'html[data-motion-cards="on"] .products__grid > .price-card';
        assert.equal(css.split(selector).length - 1, 4);
        assert.match(css, /\.price-card:hover\s*\{\s*border-color: var\(--card-hover-border\);\s*box-shadow: var\(--card-hover-shadow\);\s*\}/);
    });

    check("Somente sombra e cor da borda variam, sem escala, deslocamento ou recorte", () => {
        const properties = [...css.matchAll(/([\w-]+)\s*:\s*[^;{}]+;/g)].map((match) => match[1]);
        const allowed = ["transition-property", "transition-duration", "transition-timing-function", "border-color", "box-shadow", "transition"];
        properties.forEach((property) => assert.ok(allowed.includes(property), property));
        assert.match(css, /transition-property:\s*border-color, box-shadow;/);
        assert.doesNotMatch(css, /\ball\b|@keyframes|!important|will-change|::before|::after/);
        assert.match(read("styles/components/surfaces.css"), /border:\s*var\(--border-width\) solid var\(--surface-border\)/);
        assert.match(read("styles/components/surfaces.css"), /box-shadow:\s*var\(--shadow-small\)/);
    });

    check("Valores do destaque ficam centralizados e a duração tem limite", () => {
        for (const name of ["duration", "ease", "border", "shadow"]) {
            assert.ok(variables.includes(`--card-hover-${name}:`));
            assert.ok(css.includes(`var(--card-hover-${name})`));
        }
        assert.match(variables, /--card-hover-duration:\s*220ms;/);
        assert.match(css, /clamp\(0ms, var\(--card-hover-duration\), 300ms\)/);
        assert.match(variables, /--card-hover-border:\s*var\(--color-sage-dark\)/);
        assert.match(variables, /--card-hover-shadow:\s*0 8px 20px var\(--color-shadow\)/);
        assert.match(css, /@media \(prefers-reduced-motion: reduce\), \(forced-colors: active\)/);
        assert.match(css, /@media print/);
        assert.equal((css.match(/transition: none/g) || []).length, 2);
    });

    check("Controle cards aceita booleanos e preserva configurações anteriores", () => {
        assert.equal(config.motion.cards, true);
        const fixture = make();
        assert.equal(permission(fixture), null);
        fixture.app.animations.init({ enabled: true, intro: true, reveal: true, smoothScroll: true });
        assert.equal(permission(fixture), "on");
        for (const cards of [false, "true", "false", 0, 1, null, [], {}]) {
            fixture.app.animations.configure({ cards });
            assert.equal(permission(fixture), null);
            assert.equal(fixture.app.animations.getState().cards, false);
        }
        fixture.app.animations.configure({ cards: true });
        assert.equal(permission(fixture), "on");
    });

    check("Cards independem de reveal e rolagem, mas obedecem à chave geral", () => {
        const fixture = make();
        const api = fixture.app.animations;
        api.init({ reveal: false, smoothScroll: false });
        assert.equal(permission(fixture), "on");
        assert.equal(fixture.observers.length, 0);
        api.configure({ cards: false, reveal: true, smoothScroll: true });
        assert.equal(permission(fixture), null);
        assert.equal(api.getState().reveal, true);
        assert.equal(api.getState().smoothScroll, true);
        api.configure({ cards: true, enabled: false });
        assert.equal(permission(fixture), null);
        api.configure({ enabled: true });
        assert.equal(permission(fixture), "on");
    });

    check("Movimento reduzido e cores forçadas retiram a permissão imediatamente", () => {
        for (const options of [{ reduced: true }, { forcedColors: true }]) {
            const fixture = make(options);
            fixture.app.animations.init();
            assert.equal(permission(fixture), null);
            fixture.changeMotion(false);
            fixture.changeForcedColors(false);
            assert.equal(permission(fixture), "on");
            fixture.changeMotion(true);
            assert.equal(permission(fixture), null);
            fixture.changeMotion(false);
            fixture.changeForcedColors(true);
            assert.equal(permission(fixture), null);
        }
    });

    check("Aba oculta e destroy removem cards; reinicializar não duplica recursos", () => {
        const fixture = make({ hidden: true });
        const api = fixture.app.animations;
        api.init();
        assert.equal(permission(fixture), null);
        fixture.document.hidden = false;
        fixture.dispatchDocument("visibilitychange");
        assert.equal(permission(fixture), "on");
        fixture.document.hidden = true;
        fixture.dispatchDocument("visibilitychange");
        assert.equal(permission(fixture), null);
        api.destroy();
        assert.equal(permission(fixture), null);
        assert.equal(api.getState().cards, false);
        fixture.document.hidden = false;
        api.init();
        api.init();
        assert.equal(permission(fixture), "on");
        assert.equal(fixture.preferenceListeners.length, 1);
        fixture.documentListeners.forEach((listeners) => assert.equal(listeners.length, 1));
    });

    check("Falhas opcionais não ligam cards sem base nem os prendem à observação", () => {
        for (const options of [{ missing: ["matchMedia"] }, { noRoot: true }, { throwMedia: true }, { invalidMedia: true }]) {
            const fixture = make(options);
            fixture.app.animations.init();
            assert.equal(permission(fixture), null);
        }
        for (const options of [{ missing: ["IntersectionObserver"] }, { throwObserver: true }, { throwObserve: true }, { noElements: true }]) {
            const fixture = make(options);
            fixture.app.animations.init();
            assert.equal(permission(fixture), "on");
            fixture.app.animations.configure({ enabled: false });
            assert.equal(permission(fixture), null);
        }
    });

    check("Alternar cards não reinicia nem interrompe o bubble em andamento", () => {
        const fixture = createIntroFixture(root);
        fixture.app.animations.init();
        const observer = fixture.observers[0];
        fixture.app.animations.configure({ cards: false });
        assert.equal(fixture.app.heroIntro.getState().running, true);
        fixture.app.animations.configure({ cards: true });
        assert.equal(fixture.observers[0], observer);
        fixture.items.forEach((item) => fixture.finish(item));
        fixture.app.animations.configure({ cards: false });
        fixture.app.animations.configure({ cards: true });
        assert.equal(fixture.app.heroIntro.getState().status, "completed");
    });

    check("Nenhum listener por card, timer, dependência ou navegação artificial", () => {
        assert.doesNotMatch(script, /mouseenter|mouseleave|mousemove|pointermove|touchstart|setTimeout|setInterval|requestAnimationFrame|preventDefault|fetch\(|\.style\./);
        assert.equal((html.match(/<script\b/g) || []).length, 10);
        const fixture = make();
        fixture.app.animations.init();
        assert.deepEqual([...fixture.documentListeners.keys()].sort(), ["animationcancel", "animationend", "focusin", "visibilitychange"]);
    });
}
