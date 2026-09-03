/* Etapa 4: simula eventos e WAAPI; não abre WhatsApp nem renderiza navegador. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { createIntroFixture } from "./intro-fixture.mjs";

function fixture(root, config, options = {}) {
    function events() {
        const listeners = new Map();
        return {
            listeners,
            addEventListener(name, fn) {
                const set = listeners.get(name) || new Set();
                set.add(fn);
                listeners.set(name, set);
            },
            removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
            dispatch(name, event = {}) { [...(listeners.get(name) || [])].forEach((fn) => fn(event)); }
        };
    }
    const attributes = new Map();
    const animations = [];
    const preference = { matches: false };
    const values = { "--contact-jump-duration": "280ms", "--contact-jump-height": "4px", ...options.values };
    const visual = {
        textContent: "Fale conosco",
        animate(frames, settings) {
            if (options.throwAnimate) throw Error("Falha visual simulada");
            const animation = {
                frames, settings, cancelled: false, onfinish: null, oncancel: null,
                cancel() { this.cancelled = true; this.oncancel?.(); }
            };
            animations.push(animation);
            return animation;
        }
    };
    if (options.noAnimate) delete visual.animate;
    const link = {
        dataset: { whatsappLabel: "Fale conosco", whatsappFallback: "Fale conosco" },
        querySelector: (selector) => selector === "[data-whatsapp-text]" ? visual : null,
        getAttribute: (name) => attributes.get(name) ?? null,
        setAttribute: (name, value) => attributes.set(name, value),
        removeAttribute: (name) => attributes.delete(name),
        closest: (selector) => selector === "[data-contact-jump]" ? link : null,
        set textContent(value) { throw Error("A atualização não pode remover a superfície interna: " + value); }
    };
    const document = {
        ...events(), hidden: false,
        querySelectorAll: (selector) => selector === "[data-whatsapp]" ? [link] : []
    };
    const app = { config: JSON.parse(JSON.stringify(config)), heroIntro: { stop: () => { app.stops += 1; } }, stops: 0 };
    const window = {
        ...events(), LuLeve: app,
        matchMedia: () => preference,
        getComputedStyle: () => ({ getPropertyValue: (name) => values[name] || "" })
    };
    if (options.noMedia) delete window.matchMedia;
    if (options.noStyle) delete window.getComputedStyle;
    for (const file of ["whatsapp.js", "contact-jump.js"]) {
        vm.runInNewContext(readFileSync(join(root, "scripts", file), "utf8"), { window, document });
    }
    app.whatsapp.init(app.config.contact);
    return {
        app, document, window, link, visual, animations, preference,
        click(details = {}) {
            const event = { target: link, button: 0, defaultPrevented: false, ...details };
            document.dispatch("click", event);
            return event;
        }
    };
}

export function validateContactJump({ check, root, html, config }) {
    const read = (file) => readFileSync(join(root, file), "utf8");
    const script = read("scripts/contact-jump.js");
    const make = (options) => fixture(root, config, options);

    check("WhatsApp oficial gera URL somente com dígitos e mensagem codificada", () => {
        const f = make();
        assert.ok(f.app.whatsapp.normalizePhone(config.contact.whatsappNumber));
        const url = new URL(f.link.getAttribute("href"));
        assert.equal(url.origin, "https://wa.me");
        assert.equal(url.pathname, "/" + config.contact.whatsappNumber);
        assert.equal(url.searchParams.get("text"), config.contact.whatsappMessage);
        assert.equal(f.link.getAttribute("target"), "_blank");
        assert.equal(f.link.getAttribute("rel"), "noopener noreferrer");
        assert.ok(html.includes(`href="https://wa.me/${config.contact.whatsappNumber}"`));
        assert.ok(html.includes(`href="tel:+${config.contact.whatsappNumber}"`));
    });

    check("Atualizar contato preserva a superfície bubble e trata rótulos como texto", () => {
        const f = make();
        f.link.dataset.whatsappLabel = "<b>Contato</b>";
        f.app.whatsapp.init({ whatsappNumber: config.contact.whatsappNumber, whatsappMessage: "Olá & ação?" });
        assert.equal(f.visual.textContent, "<b>Contato</b>");
        assert.equal(f.link.querySelector("[data-whatsapp-text]"), f.visual);
        assert.equal(new URL(f.link.getAttribute("href")).searchParams.get("text"), "Olá & ação?");
        f.app.whatsapp.init({ whatsappNumber: "", whatsappMessage: "" });
        assert.equal(f.link.getAttribute("href"), "#contato");
        assert.equal(f.link.getAttribute("target"), null);
        assert.equal(f.visual.textContent, "Fale conosco");
    });

    check("Pulinho atinge só a superfície e não cancela o clique nativo", () => {
        const f = make();
        f.app.contactJump.configure(true);
        const before = f.link.getAttribute("href");
        const event = f.click({ preventDefault() { throw Error("Navegação bloqueada"); } });
        assert.equal(event.defaultPrevented, false);
        assert.equal(f.link.getAttribute("href"), before);
        assert.equal(f.app.stops, 1);
        assert.equal(f.animations.length, 1);
        assert.equal(f.animations[0].frames[1].transform, "translateY(-4px)");
        assert.equal(f.animations[0].settings.duration, 280);
        assert.equal(f.animations[0].settings.fill, "none");
        assert.equal(f.animations[0].settings.iterations, 1);
        f.animations[0].onfinish();
        assert.equal(f.animations[0].onfinish, null);
    });

    check("Cliques repetidos substituem somente o salto ativo, sem empilhar", () => {
        const f = make();
        f.app.contactJump.configure(true);
        f.click();
        const first = f.animations[0];
        const stale = first.onfinish;
        f.click();
        assert.equal(first.cancelled, true);
        assert.equal(first.onfinish, null);
        stale();
        f.app.contactJump.stop();
        assert.equal(f.animations[1].cancelled, true);
    });

    check("Teclado e clique normal funcionam; atalhos modificados não disparam salto", () => {
        const f = make();
        f.app.contactJump.configure(true);
        for (const details of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { button: 2 }, { defaultPrevented: true }]) {
            f.click(details);
        }
        assert.equal(f.animations.length, 0);
        f.click({ detail: 0 });
        assert.equal(f.animations.length, 1);
        f.click({ target: { closest: () => f.link }, detail: 1 });
        assert.equal(f.animations.length, 2);
    });

    check("Destino inválido, outro elemento e contato desativado não animam", () => {
        const f = make();
        f.app.contactJump.configure(true);
        f.click({ target: {} });
        f.link.setAttribute("href", "https://example.invalid/");
        f.click();
        f.app.whatsapp.init({ whatsappNumber: "", whatsappMessage: "" });
        f.click();
        f.app.whatsapp.init(f.app.config.contact);
        f.link.setAttribute("aria-disabled", "true");
        f.click();
        assert.equal(f.animations.length, 0);
    });

    check("Preferência restritiva e aba oculta impedem o salto sem remover links", () => {
        const f = make();
        f.app.contactJump.configure(true);
        f.preference.matches = true;
        f.click();
        f.preference.matches = false;
        f.document.hidden = true;
        f.click();
        assert.equal(f.animations.length, 0);
        assert.match(f.link.getAttribute("href"), /^https:\/\/wa\.me\//);
        f.document.hidden = false;
        f.click();
        f.app.contactJump.configure(false);
        assert.equal(f.animations[0].cancelled, true);
    });

    check("Saída, impressão e resize cancelam a animação em andamento", () => {
        const f = make();
        f.app.contactJump.configure(true);
        for (const name of ["pagehide", "beforeprint", "resize"]) {
            f.click();
            f.window.dispatch(name);
            assert.equal(f.animations.at(-1).cancelled, true);
        }
    });

    check("Sem WAAPI ou com falha visual a navegação permanece nativa", () => {
        for (const options of [{ noAnimate: true }, { noMedia: true }, { noStyle: true }, { throwAnimate: true }]) {
            const f = make(options);
            f.app.contactJump.configure(true);
            assert.doesNotThrow(() => f.click());
            assert.equal(f.animations.length, 0);
            assert.equal(new URL(f.link.getAttribute("href")).pathname, "/" + config.contact.whatsappNumber);
        }
    });

    check("Duração e altura têm limites e zero desativa apenas o salto", () => {
        for (const [raw, expected] of [["999ms", 400], ["40ms", 40], ["inválido", 280]]) {
            const f = make({ values: { "--contact-jump-duration": raw, "--contact-jump-height": "900px" } });
            f.app.contactJump.configure(true);
            f.click();
            assert.equal(f.animations[0].settings.duration, expected);
            assert.equal(f.animations[0].frames[1].transform, "translateY(-6px)");
        }
        for (const values of [{ "--contact-jump-duration": "0ms" }, { "--contact-jump-height": "0px" }, { "--contact-jump-height": "-4px" }]) {
            const f = make({ values });
            f.app.contactJump.configure(true);
            f.click();
            assert.equal(f.animations.length, 0);
        }
    });

    check("Configure e destroy não duplicam eventos nem deixam animação retida", () => {
        const f = make();
        for (const invalid of [false, "true", 1, null]) f.app.contactJump.configure(invalid);
        f.click();
        assert.equal(f.animations.length, 0);
        f.app.contactJump.configure(true);
        f.app.contactJump.configure(true);
        assert.equal(f.document.listeners.get("click").size, 1);
        f.click();
        f.app.contactJump.destroy();
        f.app.contactJump.destroy();
        assert.equal(f.animations[0].cancelled, true);
        f.document.listeners.forEach((set) => assert.equal(set.size, 0));
        f.window.listeners.forEach((set) => assert.equal(set.size, 0));
        f.app.contactJump.configure(true);
        f.click();
        assert.equal(f.animations.length, 2);
    });

    check("As 64 combinações mantêm o contato independente dos outros efeitos", () => {
        for (let mask = 0; mask < 64; mask += 1) {
            const [enabled, intro, cards, contact, reveal, smoothScroll] = [1, 2, 4, 8, 16, 32].map((bit) => Boolean(mask & bit));
            const f = createIntroFixture(root);
            let allowed;
            f.app.contactJump = { configure: (value) => { allowed = value; }, destroy: () => { allowed = false; } };
            const state = f.app.animations.init({ enabled, intro, cards, contact, reveal, smoothScroll });
            assert.equal(state.contact, enabled && contact);
            assert.equal(allowed, enabled && contact);
            assert.equal(state.cards, enabled && cards);
            assert.equal(state.reveal, enabled && reveal);
            assert.equal(state.smoothScroll, enabled && smoothScroll);
            assert.equal(f.app.heroIntro.getState().running, enabled && intro);
            f.app.animations.destroy();
            assert.equal(allowed, false);
        }
    });

    check("Coordenador cancela por preferências/aba sem reiniciar bubble ou perder contato", () => {
        const f = createIntroFixture(root);
        const calls = [];
        f.app.contactJump = { configure: (value) => calls.push(value), destroy: () => calls.push(false) };
        f.app.animations.init();
        f.app.animations.configure({ contact: false });
        assert.equal(calls.at(-1), false);
        assert.equal(f.app.heroIntro.getState().running, true);
        f.app.animations.configure({ contact: true });
        f.preference.matches = true;
        f.preference.dispatch("change");
        assert.equal(calls.at(-1), false);
        f.preference.matches = false;
        f.preference.dispatch("change");
        assert.equal(calls.at(-1), true);
        f.document.hidden = true;
        f.document.dispatch("visibilitychange");
        assert.equal(calls.at(-1), false);
        f.app.contactJump.configure = () => { throw Error("Módulo indisponível"); };
        assert.doesNotThrow(() => f.app.animations.configure({ contact: true }));
    });

    check("Contato mantém marcação explícita, tokens próprios e nenhuma navegação por JS", () => {
        assert.equal((html.match(/\sdata-contact-jump(?=\s|>)/g) || []).length, 1);
        const finalSection = html.match(/<section\b[^>]*id="fazer-pedido"[\s\S]*?<\/section>/)[0];
        assert.match(finalSection, /data-contact-jump/);
        assert.match(finalSection, /data-whatsapp-text>Fale conosco/);
        assert.match(read("styles/base/variables.css"), /--contact-jump-duration:\s*280ms/);
        assert.match(read("styles/base/variables.css"), /--contact-jump-height:\s*4px/);
        assert.match(read("styles/components/contact-jump.css"), /\.final-cta__contact\[data-contact-jump\]/);
        assert.match(read("styles/components/contact-jump.css"), /\[data-whatsapp-text\]\s*\{\s*pointer-events:\s*none/);
        assert.equal(read("styles/main.css").split('./components/contact-jump.css').length - 1, 1);
        assert.doesNotMatch(script, /preventDefault|stopPropagation|window\.open|location\s*=|setTimeout|setInterval|requestAnimationFrame|fetch\(|\.finished|commitStyles|offsetWidth|innerHTML/);
        assert.match(script, /passive:\s*true/);
        assert.equal(config.motion.contact, true);
    });
}
