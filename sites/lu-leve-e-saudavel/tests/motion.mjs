/* Etapa 1 das animações: contratos e simulações, sem navegador ou dependências. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { createFixture } from "./enhancements.mjs";

export function validateMotion({ check, root, html, config }) {
    const read = (file) => readFileSync(join(root, file), "utf8");
    const css = read("styles/base/motion.css").replace(/\/\*[\s\S]*?\*\//g, "");
    const make = (options) => createFixture(root, "animations.js", options);
    const start = (fixture, target = fixture.elements[0]) => {
        fixture.observers.at(-1).callback([{ target, isIntersecting: true }]);
    };
    const assertStatic = (fixture) => {
        assert.equal(fixture.documentRoot.getAttribute("data-motion-reveal"), null);
        assert.equal(fixture.documentRoot.getAttribute("data-motion-scroll"), null);
        assert.equal(fixture.documentRoot.getAttribute("data-motion-cards"), null);
        fixture.elements.forEach((element) => assert.equal(element.classes.size, 0));
    };

    check("Movimento tem configuração central própria, sem habilitar efeitos futuros", () => {
        assert.deepEqual(Object.keys(config.motion).sort(), ["cards", "contact", "enabled", "intro", "reveal", "smoothScroll"]);
        Object.values(config.motion).forEach((value) => assert.equal(typeof value, "boolean"));
        const fixture = make();
        assert.equal(fixture.app.animations.getState().initialized, false);
        assertStatic(fixture);
        const state = fixture.app.animations.init(config.motion);
        assert.equal(state.reveal, config.motion.enabled && config.motion.reveal);
        assert.equal(state.smoothScroll, config.motion.enabled && config.motion.smoothScroll);
        assert.doesNotMatch(html.match(/<html\b[^>]*>/)[0], /data-motion/);
        assert.equal((css.match(/@keyframes/g) || []).length, 1);
        assert.match(css, /@keyframes reveal-soft/);
    });

    check("Entradas e rolagem exigem ativação explícita, sem travar estilos finais", () => {
        assert.match(css, /html\[data-motion-scroll="on"\]/);
        assert.match(css, /html\[data-motion-reveal="on"\] \[data-reveal\]\.is-revealed/);
        assert.match(css, /@media screen and \(prefers-reduced-motion: no-preference\) and \(forced-colors: none\)/);
        assert.doesNotMatch(css, /animation[^;{}]*\b(?:both|forwards|infinite)\b/);
        assert.doesNotMatch(css, /opacity:\s*0\s*;|visibility:\s*hidden|display:\s*none|will-change/);
        assert.doesNotMatch(css, /(?:body|main|\.section|\.organic-wave|\.section-decoration)\s*\{/);
        assert.doesNotMatch(css, /\b(?:overflow|height|width|margin|padding|z-index)\s*:/);
    });

    check("Valores da entrada têm variáveis próprias e preservam as proteções de foco e impressão", () => {
        const variables = read("styles/base/variables.css");
        for (const name of ["--duration-reveal", "--reveal-distance", "--reveal-start-opacity", "--ease-reveal"]) {
            assert.ok(variables.includes(`${name}:`));
            assert.ok(css.includes(`var(${name})`));
        }
        assert.match(css, /opacity:\s*var\(--reveal-start-opacity\)/);
        assert.match(css, /var\(--ease-reveal\)/);
        assert.match(css, /:focus-within\s*\{\s*animation:\s*none/);
        assert.match(css, /@media print/);
    });

    check("Inicialização repetida não duplica eventos ou observadores", () => {
        const fixture = make();
        fixture.app.animations.init();
        fixture.app.animations.init();
        assert.equal(fixture.observers.length, 1);
        assert.equal(fixture.preferenceListeners.length, 1);
        assert.deepEqual([...fixture.documentListeners.keys()].sort(), ["animationcancel", "animationend", "focusin", "visibilitychange"]);
        fixture.documentListeners.forEach((callbacks) => assert.equal(callbacks.length, 1));
        assert.equal(fixture.documentRoot.getAttribute("data-motion-reveal"), "on");
        assert.equal(fixture.documentRoot.getAttribute("data-motion-scroll"), "on");
    });

    check("Chave geral desliga imediatamente e rejeita callbacks antigos", () => {
        const fixture = make();
        const api = fixture.app.animations;
        api.init();
        start(fixture);
        const stale = fixture.observers[0];
        api.configure({ enabled: false });
        assertStatic(fixture);
        assert.ok(stale.disconnected);
        stale.callback([{ target: fixture.elements[1], isIntersecting: true }]);
        assertStatic(fixture);
        api.configure({ enabled: true });
        assert.equal(fixture.observers.at(-1).targets.size, 1);
        assert.ok(fixture.observers.at(-1).targets.has(fixture.elements[1]));
    });

    check("Controles de entrada e rolagem funcionam de forma independente", () => {
        const fixture = make();
        const api = fixture.app.animations;
        api.init();
        start(fixture);
        const current = fixture.observers[0];
        api.configure({ smoothScroll: false });
        assert.equal(fixture.documentRoot.getAttribute("data-motion-scroll"), null);
        assert.equal(fixture.documentRoot.getAttribute("data-motion-reveal"), "on");
        assert.ok(fixture.elements[0].classes.has("is-revealed"));
        assert.equal(fixture.observers.length, 1);
        assert.equal(current.disconnected, false);
        api.configure({ reveal: false, smoothScroll: true });
        assert.equal(fixture.documentRoot.getAttribute("data-motion-scroll"), "on");
        assert.equal(fixture.documentRoot.getAttribute("data-motion-reveal"), null);
        assert.equal(fixture.elements[0].classes.size, 0);
    });

    check("Desativação inicial e configuração parcial não alteram outras opções", () => {
        const fixture = make();
        const api = fixture.app.animations;
        api.init({ enabled: false, smoothScroll: false });
        assert.equal(fixture.observers.length, 0);
        assertStatic(fixture);
        api.configure({ enabled: true });
        assert.equal(api.getState().reveal, true);
        assert.equal(api.getState().smoothScroll, false);
        assert.equal(fixture.observers.length, 1);
    });

    check("Configurações inválidas não ativam efeitos por coerção", () => {
        for (const value of ["true", "false", 1, 0, null, [], {}]) {
            const fixture = make();
            fixture.app.animations.init({ enabled: value });
            assert.equal(fixture.app.animations.getState().enabled, false);
            assertStatic(fixture);
        }

        for (const options of [null, [], "true", 1]) {
            const fixture = make();
            assert.doesNotThrow(() => fixture.app.animations.init(options));
            assertStatic(fixture);
        }

        const fixture = make();
        fixture.app.animations.init();
        fixture.app.animations.configure({ reveal: "true", smoothScroll: "false", unexpected: true });
        assert.equal(fixture.app.animations.getState().reveal, false);
        assert.equal(fixture.app.animations.getState().smoothScroll, false);
        assert.equal("unexpected" in fixture.app.animations.getState(), false);
    });

    check("Estado retornado é uma cópia, sem permitir alterar o controlador", () => {
        const fixture = make();
        const state = fixture.app.animations.init();
        state.enabled = false;
        state.reveal = false;
        assert.equal(fixture.app.animations.getState().enabled, true);
        assert.equal(fixture.app.animations.getState().reveal, true);
    });

    check("Fim e cancelamento limpam só a animação de entrada correspondente", () => {
        for (const event of ["animationend", "animationcancel"]) {
            const fixture = make();
            fixture.app.animations.init();
            start(fixture);
            const target = fixture.elements[0];
            fixture.dispatchDocument(event, { target, animationName: "outro-efeito" });
            assert.ok(target.classes.has("is-revealed"));
            fixture.dispatchDocument(event, { target: { parentElement: target }, animationName: "reveal-soft" });
            assert.ok(target.classes.has("is-revealed"));
            fixture.dispatchDocument(event, { target, animationName: "reveal-soft" });
            assert.equal(target.classes.size, 0);
            start(fixture, target);
            assert.equal(target.classes.size, 0);
        }
    });

    check("Foco cancela entrada e impede animar um elemento já em uso", () => {
        const fixture = make();
        fixture.app.animations.init();
        start(fixture);
        const first = fixture.elements[0];
        fixture.dispatchDocument("focusin", { target: { parentElement: first } });
        assert.equal(first.classes.size, 0);
        assert.equal(fixture.observers[0].targets.has(first), false);
        const second = fixture.elements[1];
        fixture.document.activeElement = { parentElement: second };
        start(fixture, second);
        assert.equal(second.classes.size, 0);
        fixture.app.animations.configure({ reveal: false });
        fixture.app.animations.configure({ reveal: true });
        assert.equal(fixture.observers.length, 1);
    });

    check("Aba oculta cancela efeitos e o retorno não repete elementos já vistos", () => {
        const fixture = make({ hidden: true });
        const api = fixture.app.animations;
        api.init();
        assertStatic(fixture);
        assert.equal(fixture.observers.length, 0);
        fixture.document.hidden = false;
        fixture.dispatchDocument("visibilitychange");
        start(fixture);
        const stale = fixture.observers[0];
        fixture.document.hidden = true;
        fixture.dispatchDocument("visibilitychange");
        assertStatic(fixture);
        fixture.document.hidden = false;
        fixture.dispatchDocument("visibilitychange");
        assert.equal(fixture.observers[1].targets.size, 1);
        stale.callback([{ target: fixture.elements[1], isIntersecting: true }]);
        assert.equal(fixture.elements[1].classes.size, 0);
    });

    check("Cores forçadas e movimento reduzido prevalecem sobre a configuração", () => {
        const fixture = make({ forcedColors: true });
        const api = fixture.app.animations;
        api.init();
        assertStatic(fixture);
        api.configure({ enabled: true, reveal: true, smoothScroll: true });
        assertStatic(fixture);
        fixture.changeMotion(true);
        fixture.changeForcedColors(false);
        assertStatic(fixture);
        fixture.changeMotion(false);
        assert.equal(fixture.observers.length, 1);
        start(fixture);
        fixture.changeForcedColors(true);
        assertStatic(fixture);
        assert.ok(fixture.observers[0].disconnected);
    });

    check("Listener legado de preferências também é removido com segurança", () => {
        const fixture = make({ legacyPreference: true });
        fixture.app.animations.init();
        assert.equal(fixture.preferenceListeners.length, 1);
        fixture.changeMotion(true);
        assertStatic(fixture);
        fixture.app.animations.destroy();
        assert.equal(fixture.preferenceListeners.length, 0);
    });

    check("Destroy é repetível, libera recursos e permite reinicialização sem repetir entradas", () => {
        const fixture = make();
        const api = fixture.app.animations;
        api.init();
        start(fixture);
        const stale = fixture.observers[0];
        api.destroy();
        api.destroy();
        assertStatic(fixture);
        assert.equal(api.getState().initialized, false);
        assert.equal(fixture.preferenceListeners.length, 0);
        fixture.documentListeners.forEach((callbacks) => assert.equal(callbacks.length, 0));
        stale.callback([{ target: fixture.elements[1], isIntersecting: true }]);
        assertStatic(fixture);
        api.init();
        assert.equal(fixture.preferenceListeners.length, 1);
        fixture.documentListeners.forEach((callbacks) => assert.equal(callbacks.length, 1));
        assert.equal(fixture.observers[1].targets.size, 1);
        assert.ok(fixture.observers[1].targets.has(fixture.elements[1]));
    });

    check("Ausência de APIs, raiz ou alvos preserva a alternativa estática", () => {
        for (const options of [{ missing: ["matchMedia"] }, { noRoot: true }]) {
            const fixture = make(options);
            assert.doesNotThrow(() => fixture.app.animations.init());
            assertStatic(fixture);
            assert.equal(fixture.observers.length, 0);
        }

        const fixture = make({ missing: ["IntersectionObserver"] });
        fixture.app.animations.init();
        assert.equal(fixture.app.animations.getState().reveal, false);
        assert.equal(fixture.app.animations.getState().smoothScroll, true);
        assert.equal(fixture.documentRoot.getAttribute("data-motion-reveal"), null);
        const empty = make({ noElements: true });
        empty.app.animations.init();
        assert.equal(empty.observers.length, 0);
        assert.equal(empty.app.animations.getState().smoothScroll, true);
    });

    check("Falhas de APIs visuais não escapam para a inicialização do restante do site", () => {
        for (const options of [{ throwObserver: true }, { throwObserve: true }]) {
            const fixture = make(options);
            assert.doesNotThrow(() => fixture.app.animations.init());
            assert.equal(fixture.app.animations.getState().reveal, false);
            assert.equal(fixture.documentRoot.getAttribute("data-motion-reveal"), null);
            assert.equal(fixture.app.animations.getState().smoothScroll, true);
            fixture.observers.forEach((observer) => assert.ok(observer.disconnected));
        }

        for (const options of [{ throwMedia: true }, { invalidMedia: true }]) {
            const fixture = make(options);
            assert.doesNotThrow(() => fixture.app.animations.init());
            assertStatic(fixture);
            assert.equal(fixture.app.animations.getState().initialized, false);
            assert.equal(fixture.preferenceListeners.length, 0);
        }
    });

    check("Sem eventos da preferência, callbacks ainda respeitam o bloqueio atual", () => {
        const fixture = make({ noPreferenceEvents: true });
        fixture.app.animations.init();
        fixture.changeMotion(true);
        start(fixture);
        assert.equal(fixture.elements[0].classes.size, 0);
        assert.equal(fixture.app.animations.getState().reveal, false);
        fixture.app.animations.destroy();
        assertStatic(fixture);
    });

    check("Desligar movimento preserva classes, atributos e medidas de outros componentes", () => {
        const fixture = make();
        fixture.documentRoot.classList.add("has-mobile-order");
        fixture.documentRoot.setAttribute("data-unrelated", "preservar");
        fixture.documentRoot.style.setProperty("--mobile-order-height", "82px");
        fixture.app.animations.init();
        fixture.app.animations.configure({ enabled: false });
        fixture.app.animations.destroy();
        assert.ok(fixture.documentRoot.classes.has("has-mobile-order"));
        assert.equal(fixture.documentRoot.getAttribute("data-unrelated"), "preservar");
        assert.equal(fixture.documentRoot.properties.get("--mobile-order-height"), "82px");
        assertStatic(fixture);
    });

    check("Main passa a configuração após contatos e barra, sem reescrever o objeto", () => {
        const fixture = make();
        const order = [];
        fixture.app.config = {
            contact: {},
            developer: { name: "Teste", url: "" },
            motion: { enabled: false }
        };
        fixture.app.whatsapp = { init: () => order.push("whatsapp") };
        fixture.app.mobileOrder = { init: () => order.push("barra") };
        const initialize = fixture.app.animations.init;
        fixture.app.animations.init = (options) => {
            order.push("movimento");
            return initialize(options);
        };
        vm.runInNewContext(read("scripts/main.js"), { window: { LuLeve: fixture.app }, document: fixture.document, URL });
        assert.deepEqual(order, ["whatsapp", "barra", "movimento"]);
        assertStatic(fixture);
        assert.deepEqual(fixture.app.config.motion, { enabled: false });
    });
}
