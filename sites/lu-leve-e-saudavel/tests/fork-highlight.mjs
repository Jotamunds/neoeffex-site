/* Contratos e simulações do garfinho da v0.1.17. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

function createForkFixture(root, options = {}) {
    function events() {
        const listeners = new Map();
        return {
            listeners,
            addEventListener(name, callback) {
                const list = listeners.get(name) || [];
                list.push(callback);
                listeners.set(name, list);
            },
            removeEventListener(name, callback) {
                listeners.set(name, (listeners.get(name) || []).filter((item) => item !== callback));
            },
            dispatch(name, details = {}) {
                (listeners.get(name) || []).slice().forEach((callback) => callback({ type: name, ...details }));
            }
        };
    }

    const classes = new Set();
    const effect = events();
    const target = {
        classList: {
            add: (name) => classes.add(name),
            remove: (name) => classes.delete(name),
            contains: (name) => classes.has(name)
        },
        querySelector: () => options.noEffect ? null : effect
    };
    const document = {
        hidden: Boolean(options.hidden),
        querySelector: () => options.noTarget ? null : target
    };
    const observers = [];
    const window = {
        LuLeve: {},
        IntersectionObserver: options.noObserver ? undefined : class {
            constructor(callback) {
                this.callback = callback;
                this.targets = new Set();
                this.disconnected = false;
                observers.push(this);
            }
            observe(item) { this.targets.add(item); }
            disconnect() {
                this.disconnected = true;
                this.targets.clear();
            }
        }
    };

    vm.runInNewContext(readFileSync(join(root, "scripts/fork-highlight.js"), "utf8"), { window, document });
    return { app: window.LuLeve, document, target, effect, classes, observers };
}

export function validateForkHighlight({ check, root, html, config }) {
    const read = (file) => readFileSync(join(root, file), "utf8");
    const script = read("scripts/fork-highlight.js");
    const css = read("styles/components/fork-highlight.css");

    check("Garfinho identifica apenas o card tradicional de 400 g", () => {
        assert.equal(config.motion.fork, true);
        assert.equal((html.match(/data-fork-highlight-target/g) || []).length, 1);
        assert.equal((html.match(/data-fork-highlight(?=\s)/g) || []).length, 1);
        const card = html.match(/<article class="price-card surface" data-fork-highlight-target[\s\S]*?<\/article>/)?.[0];
        assert.ok(card);
        assert.match(card, /id="tradicional-400-title">400 g<\/h3>/);
        assert.match(card, /aria-hidden="true"/);
        assert.match(card, /focusable="false"/);
        assert.equal(read("styles/main.css").split("./components/fork-highlight.css").length - 1, 1);
        assert.ok(html.indexOf("fork-highlight.js") < html.indexOf("animations.js"));
    });

    check("Efeito inicia ao entrar na viewport e acontece uma única vez", () => {
        const fixture = createForkFixture(root);
        assert.equal(fixture.app.forkHighlight.configure(true).observing, true);
        assert.equal(fixture.observers.length, 1);
        fixture.observers[0].callback([{ target: fixture.target, isIntersecting: true }]);
        assert.equal(fixture.classes.has("is-fork-highlighted"), true);
        assert.equal(fixture.app.forkHighlight.getState().played, true);
        assert.equal(fixture.observers[0].disconnected, true);
        fixture.effect.dispatch("animationend", { target: fixture.effect, animationName: "fork-travel" });
        assert.equal(fixture.classes.has("is-fork-highlighted"), false);
        fixture.app.forkHighlight.configure(true);
        assert.equal(fixture.observers.length, 1);
    });

    check("Desativação e ambientes sem APIs mantêm o card estático", () => {
        const fixture = createForkFixture(root);
        fixture.app.forkHighlight.configure(true);
        fixture.app.forkHighlight.configure(false);
        assert.equal(fixture.observers[0].disconnected, true);
        assert.equal(fixture.classes.size, 0);

        for (const options of [{ noObserver: true }, { noTarget: true }, { noEffect: true }, { hidden: true }]) {
            const sample = createForkFixture(root, options);
            assert.doesNotThrow(() => sample.app.forkHighlight.configure(true));
            assert.equal(sample.classes.size, 0);
        }
    });

    check("Garfinho usa camada própria e respeita preferências de acesso", () => {
        assert.match(css, /html\[data-motion-fork="on"\]/);
        assert.match(css, /@keyframes fork-travel/);
        assert.match(css, /@keyframes fork-halo/);
        assert.match(css, /prefers-reduced-motion:\s*reduce/);
        assert.match(css, /forced-colors:\s*active/);
        assert.match(css, /@media print/);
        assert.doesNotMatch(css.match(/\.price-card\[data-fork-highlight-target\]\s*\{([\s\S]*?)\}/)[1], /transform|animation/);
        assert.match(script, /threshold:\s*0\.45/);
        assert.doesNotMatch(script, /setTimeout|setInterval|fetch\(|location\.|window\.open/);
    });
}
