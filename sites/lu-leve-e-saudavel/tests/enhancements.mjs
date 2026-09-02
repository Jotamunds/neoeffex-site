/* Testes da Etapa 7: simulações de APIs, sem navegador, rede ou dependências. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

class FixtureElement {
    constructor() {
        this.classes = new Set();
        this.classList = {
            add: (value) => this.classes.add(value),
            remove: (value) => this.classes.delete(value)
        };
        this.properties = new Map();
        this.attributes = new Map();
        this.parentElement = null;
        this.style = { setProperty: (name, value) => this.properties.set(name, value) };
        this.position = "fixed";
        this.height = 81;
    }

    getBoundingClientRect() {
        return { height: this.height };
    }

    setAttribute(name, value) {
        this.attributes.set(name, value);
    }

    removeAttribute(name) {
        this.attributes.delete(name);
    }

    getAttribute(name) {
        return this.attributes.get(name) ?? null;
    }

    contains(element) {
        for (let current = element; current; current = current.parentElement) {
            if (current === this) {
                return true;
            }
        }

        return false;
    }
}

export function createFixture(root, script, options = {}) {
    const documentRoot = new FixtureElement();
    const bar = new FixtureElement();
    const elements = options.noElements ? [] : [new FixtureElement(), new FixtureElement()];
    const resizes = [];
    const observers = [];
    const resizeListeners = [];
    const preferenceListeners = [];
    const fontCallbacks = [];
    const documentListeners = new Map();
    let reduced = Boolean(options.reduced);
    let forcedColors = Boolean(options.forcedColors);
    const removePreference = (callback) => {
        const index = preferenceListeners.indexOf(callback);
        if (index !== -1) {
            preferenceListeners.splice(index, 1);
        }
    };
    const preference = {
        matches: reduced || forcedColors,
        addEventListener: (name, callback) => {
            assert.equal(name, "change");
            preferenceListeners.push(callback);
        },
        removeEventListener: (name, callback) => {
            assert.equal(name, "change");
            removePreference(callback);
        }
    };

    if (options.legacyPreference) {
        delete preference.addEventListener;
        delete preference.removeEventListener;
        preference.addListener = (callback) => preferenceListeners.push(callback);
        preference.removeListener = removePreference;
    }

    if (options.noPreferenceEvents) {
        delete preference.addEventListener;
        delete preference.removeEventListener;
    }

    const window = {
        getComputedStyle: (element) => ({ position: element.position }),
        addEventListener: (name, callback, settings) => {
            assert.equal(name, "resize");
            assert.equal(settings.passive, true);
            resizeListeners.push(callback);
        },
        matchMedia: (query) => {
            assert.equal(query, "(prefers-reduced-motion: reduce), (forced-colors: active)");
            if (options.throwMedia) {
                throw new Error("Falha simulada de matchMedia");
            }

            return options.invalidMedia ? null : preference;
        },
        ResizeObserver: class {
            constructor(callback) {
                this.callback = callback;
                this.targets = new Set();
                resizes.push(this);
            }
            observe(element) {
                this.targets.add(element);
            }
        },
        IntersectionObserver: class {
            constructor(callback, settings) {
                if (options.throwObserver) {
                    throw new Error("Falha simulada do observador");
                }

                this.callback = callback;
                this.settings = settings;
                this.targets = new Set();
                this.disconnected = false;
                observers.push(this);
            }
            observe(element) {
                if (options.throwObserve) {
                    throw new Error("Falha simulada ao observar");
                }

                this.targets.add(element);
            }
            unobserve(element) {
                this.targets.delete(element);
            }
            disconnect() {
                this.disconnected = true;
                this.targets.clear();
            }
        }
    };

    for (const name of options.missing || []) {
        delete window[name];
    }

    const document = {
        documentElement: options.noRoot ? null : documentRoot,
        hidden: Boolean(options.hidden),
        activeElement: null,
        addEventListener: (name, callback) => {
            const callbacks = documentListeners.get(name) || [];
            callbacks.push(callback);
            documentListeners.set(name, callbacks);
        },
        removeEventListener: (name, callback) => {
            const callbacks = documentListeners.get(name) || [];
            documentListeners.set(name, callbacks.filter((item) => item !== callback));
        },
        querySelector: (selector) => selector === "[data-mobile-order]" && !options.noBar ? bar : null,
        querySelectorAll: (selector) => selector === "[data-reveal]" ? elements : [],
        fonts: { ready: { then: (callback) => fontCallbacks.push(callback) } }
    };

    vm.runInNewContext(readFileSync(join(root, "scripts", script), "utf8"), { window, document });

    return {
        app: window.LuLeve, document, documentRoot, bar, elements, resizes, observers,
        resizeListeners, preferenceListeners, fontCallbacks, documentListeners,
        dispatchDocument: (name, details = {}) => {
            (documentListeners.get(name) || []).slice().forEach((callback) => callback(details));
        },
        changeMotion: (value) => {
            reduced = value;
            preference.matches = reduced || forcedColors;
            preferenceListeners.slice().forEach((callback) => callback());
        },
        changeForcedColors: (value) => {
            forcedColors = value;
            preference.matches = reduced || forcedColors;
            preferenceListeners.slice().forEach((callback) => callback());
        }
    };
}

export function validateEnhancements({ check, root, html }) {
    const read = (file) => readFileSync(join(root, file), "utf8");
    const barCss = read("styles/components/mobile-order.css");
    const motionCss = read("styles/base/motion.css");
    const resetCss = read("styles/base/reset.css");

    check("Barra mobile tem rótulo legível, destino seguro e posição após o rodapé", () => {
        const bar = html.match(/<aside\b[^>]*data-mobile-order[\s\S]*?<\/aside>/)[0];
        assert.ok(html.indexOf(bar) > html.indexOf("</footer>"));
        assert.match(bar, /aria-label="Atalho para abrir o cardápio"/);
        assert.match(bar, /data-catalog-link/);
        assert.match(bar, /catalogo\/\?catalogo=lu-leve-e-saudavel/);
        assert.match(bar, />Abrir cardápio<\/a>/);
        assert.doesNotMatch(bar, /\bhidden\b|data-whatsapp-only|<button\b/);
        assert.doesNotMatch(html, /<html\b[^>]*has-mobile-order/);
    });

    check("Âncoras recebem foco sem substituir navegação e histórico nativos", () => {
        for (const id of ["inicio", "tradicionais", "fitness", "como-funciona", "contato", "instagram", "fazer-pedido"]) {
            const section = [...html.matchAll(/<section\b[^>]*>/g)].find(([tag]) => tag.includes(`id="${id}"`))[0];
            assert.match(section, /tabindex="-1"/);
        }

        assert.doesNotMatch(html, /tabindex="[1-9]|user-scalable\s*=\s*no|maximum-scale/);
        assert.match(resetCss, /\.section:focus-visible/);
        assert.match(resetCss, /scroll-margin-block:\s*var\(--space-2\)/);
        assert.doesNotMatch(read("scripts/main.js"), /preventDefault|pushState|replaceState/);
    });

    check("Área segura e reserva inferior acompanham a altura da barra", () => {
        assert.match(html, /viewport-fit=cover/);
        assert.match(read("styles/base/variables.css"), /safe-area-inset-left/);
        assert.match(read("styles/layout/grid.css"), /var\(--page-gutter-safe\)/);
        assert.match(barCss, /safe-area-inset-bottom/);
        assert.match(barCss, /padding-block-end:\s*var\(--mobile-order-height\)/);
        assert.match(resetCss, /scroll-padding-block-end:\s*calc\(var\(--mobile-order-height\)/);
        assert.doesNotMatch(barCss, /height:\s*\d+(?:px|vh)|overflow:\s*hidden/);
    });

    check("Barra fixa só no mobile aprimorado, com alternativas para paisagem e impressão", () => {
        assert.match(barCss, /\.mobile-order\s*\{[^}]*display:\s*none/);
        assert.match(barCss, /max-width:\s*47\.999rem/);
        assert.match(barCss, /\.has-mobile-order \.mobile-order\s*\{[^}]*position:\s*fixed/);
        assert.match(barCss, /max-height:\s*24rem/);
        assert.match(barCss, /position:\s*static/);
        assert.match(barCss, /@media print/);
        assert.match(read("styles/base/variables.css"), /--z-mobile-order:\s*50/);
    });

    check("Movimento não oculta preços e respeita preferência, foco e impressão", () => {
        for (const [, region] of html.matchAll(/<!-- MENU:(?:tradicionais|fitness):START -->([\s\S]*?)<!-- MENU:/g)) {
            assert.doesNotMatch(region, /data-reveal|is-revealed/);
        }

        assert.doesNotMatch(html, /<section\b[^>]*data-reveal/);
        assert.match(motionCss, /prefers-reduced-motion:\s*no-preference/);
        assert.match(motionCss, /prefers-reduced-motion:\s*reduce/);
        assert.match(motionCss, /:focus-within/);
        assert.match(motionCss, /@media print/);
        assert.doesNotMatch(motionCss, /opacity:\s*0\s*;|visibility:\s*hidden|display:\s*none/);
        assert.match(read("styles/base/variables.css"), /--duration-reveal:\s*0ms/);
    });

    check("Telefone, perfil e crédito têm áreas de toque sem reduzir fontes", () => {
        assert.match(read("styles/components/contact-card.css"), /\.contact-card__link\s*\{[^}]*min-height:\s*var\(--control-size\)/);
        assert.match(read("styles/layout/footer.css"), /\.site-footer__bottom a\s*\{[^}]*min-height:\s*var\(--control-size\)/);
        assert.match(barCss, /\.mobile-order__button\s*\{[^}]*min-height:\s*var\(--control-size\)/);
        assert.match(read("styles/base/variables.css"), /--font-size-body:\s*1rem/);
    });

    check("Cabeçalho pode quebrar linhas com texto ampliado sem ocultar atalhos", () => {
        const header = read("styles/layout/header.css");
        assert.match(header, /\.site-header__inner\s*\{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap/);
        assert.match(header, /\.site-header__brand\s*\{[^}]*max-width:\s*100%/);
        assert.match(header, /\.site-nav\s*\{[^}]*flex-basis:\s*100%/);
        assert.match(header, /@media\s*\(min-width:\s*60rem\)/);
        assert.doesNotMatch(header, /display:\s*none|white-space:\s*nowrap|overflow:\s*hidden/);
    });

    check("Barra mede altura real, fontes e redimensionamento sem duplicar observadores", () => {
        const fixture = createFixture(root, "mobile-order.js");
        fixture.bar.height = 81.4;
        fixture.app.mobileOrder.init();
        fixture.app.mobileOrder.init();
        assert.ok(fixture.documentRoot.classes.has("has-mobile-order"));
        assert.equal(fixture.documentRoot.properties.get("--mobile-order-height"), "82px");
        assert.equal(fixture.resizes.length, 1);
        assert.ok(fixture.resizes[0].targets.has(fixture.bar));
        assert.equal(fixture.resizeListeners.length, 1);
        assert.equal(fixture.fontCallbacks.length, 1);
        fixture.bar.height = 112;
        fixture.resizes[0].callback();
        assert.equal(fixture.documentRoot.properties.get("--mobile-order-height"), "112px");
        fixture.bar.height = 90;
        fixture.fontCallbacks[0]();
        assert.equal(fixture.documentRoot.properties.get("--mobile-order-height"), "90px");
    });

    check("Barra libera espaço no desktop ou fluxo e rejeita medidas inválidas", () => {
        const fixture = createFixture(root, "mobile-order.js");
        fixture.app.mobileOrder.init();
        fixture.bar.position = "static";
        fixture.resizeListeners[0]();
        assert.equal(fixture.documentRoot.properties.get("--mobile-order-height"), "0px");
        fixture.bar.position = "fixed";
        fixture.bar.height = 0;
        fixture.resizeListeners[0]();
        assert.equal(fixture.documentRoot.properties.get("--mobile-order-height"), "0px");

        for (const value of [-1, NaN, Infinity]) {
            fixture.bar.height = value;
            fixture.resizes[0].callback();
            assert.equal(fixture.documentRoot.properties.get("--mobile-order-height"), "0px");
        }
    });

    check("Barra mantém alternativa segura sem APIs ou sem componente", () => {
        for (const options of [{ noBar: true }, { missing: ["getComputedStyle"] }]) {
            const fixture = createFixture(root, "mobile-order.js", options);
            assert.doesNotThrow(() => fixture.app.mobileOrder.init());
            assert.equal(fixture.documentRoot.classes.size, 0);
        }

        const fixture = createFixture(root, "mobile-order.js", { missing: ["ResizeObserver"] });
        fixture.app.mobileOrder.init();
        assert.equal(fixture.resizes.length, 0);
        fixture.bar.height = 120;
        fixture.resizeListeners[0]();
        assert.equal(fixture.documentRoot.properties.get("--mobile-order-height"), "120px");
    });

    check("Entrada observa apenas elementos marcados e anima uma única vez", () => {
        const fixture = createFixture(root, "animations.js");
        fixture.app.animations.init();
        fixture.app.animations.init();
        assert.equal(fixture.observers.length, 1);
        assert.equal(fixture.preferenceListeners.length, 1);
        const observer = fixture.observers[0];
        assert.equal(observer.targets.size, 2);
        const target = fixture.elements[0];
        observer.callback([{ target, isIntersecting: false }]);
        assert.equal(target.classes.size, 0);
        observer.callback([{ target, isIntersecting: true }]);
        assert.ok(target.classes.has("is-revealed"));
        assert.equal(observer.targets.has(target), false);
        target.classList.remove("is-revealed");
        observer.callback([{ target, isIntersecting: true }]);
        assert.equal(target.classes.size, 0);
    });

    check("Movimento reduzido inicial evita efeitos e pode mudar durante a sessão", () => {
        const fixture = createFixture(root, "animations.js", { reduced: true });
        fixture.app.animations.init();
        assert.equal(fixture.observers.length, 0);
        fixture.changeMotion(false);
        assert.equal(fixture.observers.length, 1);
        fixture.observers[0].callback([{ target: fixture.elements[0], isIntersecting: true }]);
        fixture.changeMotion(true);
        assert.equal(fixture.observers[0].disconnected, true);
        assert.equal(fixture.elements[0].classes.size, 0);
        fixture.changeMotion(false);
        assert.equal(fixture.observers[1].targets.size, 1);
        assert.ok(fixture.observers[1].targets.has(fixture.elements[1]));
    });

    check("Notificações antigas não reiniciam movimento depois de desativado", () => {
        const fixture = createFixture(root, "animations.js");
        fixture.app.animations.init();
        const stale = fixture.observers[0];
        fixture.changeMotion(true);
        assert.doesNotThrow(() => stale.callback([{ target: fixture.elements[0], isIntersecting: true }]));
        fixture.changeMotion(false);
        stale.callback([{ target: fixture.elements[0], isIntersecting: true }]);
        assert.equal(fixture.elements[0].classes.size, 0);
        assert.equal(fixture.observers[1].targets.size, 2);
    });

    check("Sem APIs de movimento, conteúdo continua sem classes de animação", () => {
        for (const missing of [["matchMedia"], ["IntersectionObserver"], ["matchMedia", "IntersectionObserver"]]) {
            const fixture = createFixture(root, "animations.js", { missing });
            assert.doesNotThrow(() => fixture.app.animations.init());
            assert.equal(fixture.observers.length, 0);
            fixture.elements.forEach((element) => assert.equal(element.classes.size, 0));
        }
    });

    check("Aprimoramentos não usam rede, timers, bloqueio de rolagem nem HTML dinâmico", () => {
        const scripts = read("scripts/mobile-order.js") + read("scripts/animations.js");
        assert.doesNotMatch(scripts, /fetch\(|setTimeout|setInterval|innerHTML|preventDefault|localStorage|sessionStorage/);
        assert.doesNotMatch(scripts, /style\.(?:overflow|display|opacity|height)\s*=/);
        assert.match(scripts, /setProperty\("--mobile-order-height"/);
        const main = read("scripts/main.js");
        assert.ok(main.indexOf("app.whatsapp.init") < main.indexOf("app.mobileOrder.init"));
    });
}
