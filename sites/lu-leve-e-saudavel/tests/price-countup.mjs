/* Contratos e simulações da contagem de preços da v0.1.18. */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

function createPriceFixture(root, options = {}) {
    function element(text, children = []) {
        const classes = new Set();
        return {
            textContent: text,
            children,
            dataset: {},
            classList: {
                add: (name) => classes.add(name),
                remove: (name) => classes.delete(name),
                contains: (name) => classes.has(name)
            }
        };
    }

    const price = element("R$ 190,00");
    const secondPrice = element("R$ 19,00");
    const phone = element("(11) 97876-6842");
    const nested = element("R$ 20,00", [{}]);
    const elements = [price, secondPrice, phone, nested];
    const observers = [];
    const frames = new Map();
    let frameId = 0;
    const document = {
        hidden: Boolean(options.hidden),
        querySelectorAll: () => elements
    };
    const window = {
        LuLeve: {},
        performance: { now: () => 100 },
        requestAnimationFrame(callback) {
            frameId += 1;
            frames.set(frameId, callback);
            return frameId;
        },
        cancelAnimationFrame(id) {
            frames.delete(id);
        },
        IntersectionObserver: options.noObserver ? undefined : class {
            constructor(callback) {
                this.callback = callback;
                this.targets = new Set();
                this.disconnected = false;
                observers.push(this);
            }
            observe(target) { this.targets.add(target); }
            unobserve(target) { this.targets.delete(target); }
            disconnect() {
                this.disconnected = true;
                this.targets.clear();
            }
        }
    };

    vm.runInNewContext(readFileSync(join(root, "scripts/price-countup.js"), "utf8"), {
        window,
        document,
        Intl,
        Map,
        Number,
        Math
    });

    return {
        app: window.LuLeve,
        document,
        price,
        secondPrice,
        phone,
        nested,
        observers,
        frames,
        runLastFrame(now) {
            const entry = [...frames.entries()].at(-1);
            assert.ok(entry, "Quadro de animação ausente.");
            frames.delete(entry[0]);
            entry[1](now);
        }
    };
}

export function validatePriceCountup({ check, root, html, config }) {
    const read = (file) => readFileSync(join(root, file), "utf8");
    const script = read("scripts/price-countup.js");
    const css = read("styles/components/price-countup.css");

    check("Contagem de preços está conectada à estrutura final", () => {
        assert.equal(config.version, "0.1.20");
        assert.equal(config.motion.prices, true);
        assert.match(html, /<script src="\.\/scripts\/price-countup\.js" defer><\/script>/);
        assert.ok(html.indexOf("price-countup.js") < html.indexOf("animations.js"));
        assert.equal(read("styles/main.css").split("./components/price-countup.css").length - 1, 1);
        assert.equal(existsSync(join(root, "price-countup.js")), false);
        assert.equal(existsSync(join(root, "price-countup.css")), false);
        assert.equal(existsSync(join(root, "apply-v0.1.18.ps1")), false);
        assert.equal(existsSync(join(root, "rollback-v0.1.18.ps1")), false);
    });

    check("Parser aceita somente valores monetários completos em pt-BR", () => {
        assert.match(script, /PRICE_RE\s*=\s*\/\^\\s\*R\\\$/);
        assert.match(script, /replace\(\/\\\.\/g,\s*""\)\.replace\(",",\s*"\."\)/);
        assert.match(script, /toLocaleString\("pt-BR"/);
        assert.match(script, /minimumFractionDigits:\s*2/);
        assert.match(script, /maximumFractionDigits:\s*2/);
        assert.match(script, /\.numeric:not\(\[data-no-price-countup\]\)/);
    });

    check("Contagem observa cada preço separadamente e restaura o original", () => {
        const fixture = createPriceFixture(root);
        const state = fixture.app.priceCountup.configure(true);
        assert.equal(state.total, 2);
        assert.equal(fixture.observers.length, 1);
        assert.equal(fixture.observers[0].targets.size, 2);

        fixture.observers[0].callback([{ target: fixture.price, isIntersecting: true }]);
        assert.equal(fixture.price.textContent, "R$ 0,00");
        assert.equal(fixture.price.dataset.priceCountupPlayed, "true");
        assert.equal(fixture.phone.textContent, "(11) 97876-6842");
        assert.equal(fixture.nested.textContent, "R$ 20,00");
        fixture.runLastFrame(1000);
        assert.equal(fixture.price.textContent, "R$ 190,00");
        assert.equal(fixture.price.classList.contains("price-countup-active"), false);
        assert.equal(fixture.app.priceCountup.getState().played, 1);
    });

    check("Desativar ou ocultar a página interrompe quadros sem alterar preços", () => {
        const fixture = createPriceFixture(root);
        fixture.app.priceCountup.configure(true);
        fixture.observers[0].callback([{ target: fixture.price, isIntersecting: true }]);
        fixture.app.priceCountup.configure(false);
        assert.equal(fixture.price.textContent, "R$ 190,00");
        assert.equal(fixture.frames.size, 0);

        const hidden = createPriceFixture(root, { hidden: true });
        assert.equal(hidden.app.priceCountup.configure(true).enabled, false);
        assert.equal(hidden.observers.length, 0);
        assert.equal(hidden.price.textContent, "R$ 190,00");
    });

    check("Sem IntersectionObserver a alternativa permanece estática", () => {
        const fixture = createPriceFixture(root, { noObserver: true });
        assert.doesNotThrow(() => fixture.app.priceCountup.configure(true));
        assert.equal(fixture.observers.length, 0);
        assert.equal(fixture.price.textContent, "R$ 190,00");
        assert.equal(fixture.app.priceCountup.getState().played, 0);
    });

    check("CSS numérico respeita movimento reduzido, cores forçadas e impressão", () => {
        assert.match(css, /font-variant-numeric:\s*tabular-nums/);
        assert.match(css, /prefers-reduced-motion:\s*reduce/);
        assert.match(css, /forced-colors:\s*active/);
        assert.match(css, /@media print/);
        assert.doesNotMatch(css, /transform|opacity|position|pointer-events/);
    });
}
