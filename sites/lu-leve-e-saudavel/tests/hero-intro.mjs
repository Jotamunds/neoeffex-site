/* Contratos e ciclo de vida da etapa 2. Sem dependências, rede ou navegador. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createIntroFixture } from "./intro-fixture.mjs";

export function validateHeroIntro({ check, root, html, config }) {
    const read = (file) => readFileSync(join(root, file), "utf8");
    const css = read("styles/components/hero-intro.css").replace(/\/\*[\s\S]*?\*\//g, "");
    const variables = read("styles/base/variables.css");
    const script = read("scripts/hero-intro.js");
    const hero = html.match(/<section\b[^>]*id="inicio"[\s\S]*?<\/section>/)[0];
    const make = (options) => createIntroFixture(root, options);
    const stopped = (fixture) => {
        assert.equal(fixture.hero.classes.has("is-intro-running"), false);
        assert.equal(fixture.app.heroIntro.getState().running, false);
        fixture.window.listeners.forEach((list) => assert.equal(list.length, 0));
        for (const name of ["pointerdown", "touchstart", "click", "keydown", "scroll"]) {
            assert.equal((fixture.document.listeners.get(name) || []).length, 0);
        }
    };
    const noReplay = (fixture) => {
        fixture.app.animations.configure({ enabled: true, intro: true });
        fixture.app.animations.destroy();
        fixture.app.animations.init();
        fixture.app.heroIntro.init(true);
        stopped(fixture);
    };

    check("Intro é um controle booleano real, integrado ao coordenador", () => {
        assert.equal(typeof config.motion.intro, "boolean");
        const fixture = make();
        fixture.app.animations.init(config.motion);
        assert.equal(fixture.app.animations.getState().intro, config.motion.enabled && config.motion.intro);
        assert.equal(fixture.app.heroIntro.getState().running, config.motion.enabled && config.motion.intro);
    });

    check("Hero usa grupos explícitos sem data-reveal ou animação de ancestrais", () => {
        assert.deepEqual([...hero.matchAll(/data-intro="([^"]+)"/g)].map((match) => match[1]), ["title", "title", "copy", "action", "photo"]);
        assert.doesNotMatch(hero, /data-reveal|is-intro-running/);
        assert.doesNotMatch(html.replace(hero, ""), /data-intro=/);
        assert.match(hero, /<div class="hero__artwork" data-intro="photo">/);
        assert.doesNotMatch(hero, /<(?:section|figure)\b[^>]*data-intro/);
        assert.doesNotMatch(html, /<html\b[^>]*data-motion-intro/);
    });

    check("CSS da intro é isolado, importado uma vez e preserva os componentes finais", () => {
        const imports = [...read("styles/main.css").matchAll(/@import url\("([^"]+)"\)/g)].map((match) => match[1]);
        assert.equal(imports.filter((path) => path.includes("hero-intro.css")).length, 1);
        assert.deepEqual(imports.slice(-3), ["./components/hero-intro.css", "./components/decorations.css", "./components/organic-backgrounds.css"]);
        assert.doesNotMatch(css, /\b(?:height|width|margin|padding|overflow|z-index|position|pointer-events|will-change)\s*:/);
        assert.doesNotMatch(css, /\.organic-wave|\.price-card|\.mobile-order|\.hero__visual/);
        assert.match(css, /html\[data-motion-intro="on"\] #inicio\.is-intro-running/);
    });

    check("Entrada conserva texto visível e não retém estilos ao terminar", () => {
        assert.doesNotMatch(css, /opacity:\s*0\s*;|visibility:\s*hidden|display:\s*none|\b(?:forwards|both|infinite)\b/);
        assert.match(css, /animation-fill-mode:\s*backwards/);
        assert.match(css, /animation-iteration-count:\s*1/);
        assert.match(css, /opacity:\s*clamp\(0.97, var\(--intro-start-opacity\), 1\)/);
        const actions = css.slice(css.indexOf("@keyframes hero-intro-action"), css.indexOf("@keyframes hero-intro-photo"));
        assert.match(actions, /transform:\s*none/);
        assert.doesNotMatch(actions, /opacity|translate/);
    });

    check("Texto animado mantém contraste mínimo sobre manchas e broto", () => {
        const values = Object.fromEntries([...variables.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2]]));
        const rgb = (name) => {
            let value = values[name];
            for (let i = 0; value.startsWith("var(") && i < 5; i += 1) value = values[value.slice(4, -1)];
            assert.match(value, /^#[a-f0-9]{6}$/i);
            return value.slice(1).match(/../g).map((channel) => parseInt(channel, 16));
        };
        const mix = (a, b, alpha) => a.map((value, index) => value * (1 - alpha) + b[index] * alpha);
        const luminance = (rgb) => rgb.map((value) => value / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
            .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
        const ratio = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
        const opacity = Math.max(0.97, Math.min(1, Number(values["--intro-start-opacity"])));
        const decor = Number(values["--decoration-hero-opacity"]);
        for (const shape of [0, 0.3, 0.62, 1]) {
            for (const alpha of [0, decor / 2, decor]) {
                const background = mix(mix(rgb("--color-primary"), rgb("--color-primary-light"), shape), rgb("--decoration-hero-color"), alpha);
                for (const name of ["--color-text-light", "--color-sage"]) {
                    assert.ok(ratio(background, mix(background, rgb(name), opacity)) >= 4.5, `Contraste da intro: ${name}`);
                }
                assert.ok(ratio(mix(background, rgb("--color-accent-soft"), opacity), mix(background, rgb("--color-primary"), opacity)) >= 4.5);
            }
        }
    });

    check("Foto conserva recorte interno e broto mantém rotação com bubble limitado", () => {
        assert.match(read("styles/sections/hero.css"), /\.hero__image-frame\s*\{\s*overflow:\s*hidden/);
        assert.match(css, /scale\(clamp\(0.94, var\(--intro-photo-start\), 1\)\)/);
        assert.match(css, /scale\(clamp\(1, var\(--intro-photo-peak\), 1.06\)\)/);
        assert.match(css, /rotate\(var\(--decoration-rotation\)\) scale\(0\)/);
        assert.match(css, /rotate\(var\(--decoration-rotation\)\) scale\(clamp\(1, var\(--intro-bubble-peak\), 1.20\)\)/);
        assert.match(css, /rotate\(var\(--decoration-rotation\)\) scale\(1\)/);
    });

    check("Composição agrupa foto e moldura, deixando a legenda fora", () => {
        assert.match(hero, /<figure class="hero__visual">\s*<div class="hero__artwork" data-intro="photo">\s*<div class="hero__image-frame">\s*<img\b[^>]*>\s*<\/div>\s*<\/div>\s*<figcaption class="hero__caption">Imagem ilustrativa<\/figcaption>\s*<\/figure>/);
        assert.equal((hero.match(/data-intro="photo"/g) || []).length, 1);
        assert.doesNotMatch(hero, /<img\b[^>]*data-intro/);
    });

    check("Contorno pertence à camada animável nos dois temas e não captura cliques", () => {
        const base = read("styles/sections/hero.css");
        const organic = read("styles/components/organic-backgrounds.css");
        assert.match(base, /\.hero__artwork\s*\{\s*position:\s*relative;\s*isolation:\s*isolate;/);
        assert.match(base, /\.hero__artwork::before\s*\{[^}]*z-index:\s*-1;[^}]*pointer-events:\s*none/);
        assert.match(base, /@media \(forced-colors: active\)\s*\{\s*\.hero__artwork::before\s*\{\s*display:\s*none/);
        assert.match(organic, /\.organic-backgrounds \.hero \.hero__artwork::before/);
        assert.doesNotMatch(base + organic, /\.hero__visual::before/);
    });

    check("Uma única escala sem recortar composição ou animar legenda", () => {
        const base = read("styles/sections/hero.css");
        for (const name of ["hero__visual", "hero__artwork", "hero__image", "hero__caption"]) {
            const rule = base.match(new RegExp(`\\.${name}\\s*\\{([^}]*)\\}`))[1];
            assert.doesNotMatch(rule, /(?:transform|animation|overflow|clip-path)\s*:/);
        }
        assert.doesNotMatch(css, /\.hero__image|\.hero__caption|\.hero__artwork::/);
        assert.match(css, /\[data-intro="photo"\]\s*\{[^}]*transform-origin:\s*center calc\(100% \+ var\(--space-0\)\)/);
        assert.match(read("styles/components/organic-backgrounds.css"), /inset:\s*calc\(-1 \* var\(--space-0\)\) calc\(-1 \* var\(--space-1\)\) calc\(-1 \* var\(--space-0\)\)/);
    });

    check("Evento de filho ou contorno não finaliza o conjunto da foto", () => {
        const fixture = make();
        fixture.app.animations.init();
        const photo = fixture.items[5];
        fixture.items.filter((item) => item !== photo).forEach((item) => fixture.finish(item));
        fixture.document.dispatch("animationend", { target: { parentElement: photo }, animationName: "hero-intro-photo" });
        fixture.document.dispatch("animationend", { target: photo, animationName: "hero-intro-photo", pseudoElement: "::before" });
        assert.equal(fixture.app.heroIntro.getState().running, true);
        fixture.finish(photo);
        assert.equal(fixture.app.heroIntro.getState().status, "completed");
        stopped(fixture);
    });

    check("Cancelamento da composição restaura tudo e não repete a abertura", () => {
        const fixture = make();
        fixture.app.animations.init();
        fixture.finish(fixture.items[5], "animationcancel");
        assert.equal(fixture.app.heroIntro.getState().status, "cancelled");
        stopped(fixture);
        noReplay(fixture);
    });

    check("Tempos, amplitude e sequência têm variáveis consumidas com limites", () => {
        const names = ["duration", "stagger", "distance", "start-opacity", "photo-start", "photo-peak", "button-start", "button-peak", "bubble-peak", "ease"];
        for (const name of names) {
            assert.ok(variables.includes(`--intro-${name}:`));
            assert.ok(css.includes(`var(--intro-${name})`));
        }
        assert.match(css, /clamp\(0ms, var\(--intro-duration\), 900ms\)/);
        assert.match(css, /clamp\(0ms, var\(--intro-stagger\), 120ms\)/);
        assert.match(css, /animation-delay:\s*0ms/);
        assert.match(css, /animation-delay:\s*calc\(clamp\(0ms, var\(--intro-stagger\), 120ms\) \* 2\)/);
        assert.equal((css.match(/animation-delay:\s*calc\(clamp\(0ms, var\(--intro-stagger\), 120ms\) \* 3\)/g) || []).length, 2);
    });

    check("Movimento reduzido, cores forçadas, foco e impressão têm proteção CSS", () => {
        assert.match(css, /@media screen and \(prefers-reduced-motion: no-preference\) and \(forced-colors: none\)/);
        assert.match(css, /@media \(prefers-reduced-motion: reduce\), \(forced-colors: active\)/);
        assert.match(css, /@media print/);
        assert.match(css, /\.hero__action:focus-within \[data-intro="action"\]\s*\{\s*animation:\s*none/);
        assert.match(variables, /--intro-duration:\s*0ms/);
        assert.match(variables, /--intro-stagger:\s*0ms/);
    });

    check("Sem timers, navegação artificial, rede ou espera por imagens e fontes", () => {
        assert.doesNotMatch(script, /setTimeout|setInterval|requestAnimationFrame|preventDefault|stopPropagation|fetch\(|innerHTML|\.fonts|\.decode\(|localStorage|sessionStorage|scrollTo\(|location\s*=|\.style\./);
        assert.match(script, /capture:\s*true, passive:\s*true/);
        assert.doesNotMatch(hero, /aria-hidden="true"[^>]*data-intro|inert|tabindex="[1-9]/);
    });

    check("Inicialização normal arma apenas os alvos do hero uma vez", () => {
        const fixture = make();
        fixture.app.animations.init();
        fixture.app.animations.init();
        fixture.app.heroIntro.init(true);
        assert.equal(fixture.app.heroIntro.getState().status, "running");
        assert.ok(fixture.hero.classes.has("is-intro-running"));
        assert.equal(fixture.observers.length, 1);
        assert.deepEqual([...fixture.observers[0].targets], [fixture.outside]);
        assert.equal(fixture.preference.listeners.get("change").length, 1);
        fixture.window.listeners.forEach((list) => assert.equal(list.length, 1));
        assert.equal(fixture.document.listeners.get("pointerdown").length, 1);
    });

    check("Término dos grupos limpa classes e listeners, sem depender da ordem dos eventos", () => {
        const fixture = make();
        fixture.app.animations.init();
        const reversed = [...fixture.items].reverse();
        reversed.slice(0, -1).forEach((item) => fixture.finish(item));
        assert.equal(fixture.app.heroIntro.getState().running, true);
        fixture.finish(reversed.at(-1));
        assert.equal(fixture.app.heroIntro.getState().status, "completed");
        stopped(fixture);
        noReplay(fixture);
    });

    check("Fim de outro efeito, filho ou pseudo-elemento não encerra a intro", () => {
        const fixture = make();
        fixture.app.animations.init();
        fixture.document.dispatch("animationend", { target: fixture.items[0], animationName: "outro" });
        fixture.document.dispatch("animationend", { target: { parentElement: fixture.items[0] }, animationName: "hero-intro-copy" });
        fixture.document.dispatch("animationend", { target: fixture.items[0], animationName: "hero-intro-copy", pseudoElement: "::before" });
        fixture.items.slice(1).forEach((item) => fixture.finish(item));
        assert.equal(fixture.app.heroIntro.getState().running, true);
        fixture.finish(fixture.items[0]);
        stopped(fixture);
    });

    check("Cancelamento de uma animação restaura a sequência inteira", () => {
        const fixture = make();
        fixture.app.animations.init();
        fixture.finish(fixture.items[4], "animationcancel");
        assert.equal(fixture.app.heroIntro.getState().status, "cancelled");
        stopped(fixture);
        noReplay(fixture);
    });

    check("Clique, toque, teclado, foco e rolagem interrompem sem bloquear o evento", () => {
        for (const name of ["pointerdown", "touchstart", "click", "keydown", "focusin", "scroll"]) {
            const fixture = make();
            fixture.app.animations.init();
            fixture.document.dispatch(name, {
                target: fixture.items[3],
                preventDefault: () => assert.fail("Não bloquear evento"),
                stopPropagation: () => assert.fail("Não bloquear propagação")
            });
            assert.equal(fixture.app.heroIntro.getState().status, "interaction");
            stopped(fixture);
            noReplay(fixture);
        }
    });

    check("Impressão, saída da página e resize liberam a abertura", () => {
        for (const [event, reason] of [["beforeprint", "print"], ["pagehide", "pagehide"], ["resize", "resize"]]) {
            const fixture = make();
            fixture.app.animations.init();
            fixture.window.dispatch(event);
            assert.equal(fixture.app.heroIntro.getState().status, reason);
            stopped(fixture);
            noReplay(fixture);
        }
    });

    check("Chave intro cancela só a abertura, preservando revelação e rolagem", () => {
        const fixture = make();
        fixture.app.animations.init();
        fixture.app.animations.configure({ intro: false });
        stopped(fixture);
        assert.equal(fixture.documentRoot.getAttribute("data-motion-intro"), null);
        assert.equal(fixture.app.animations.getState().reveal, true);
        assert.equal(fixture.app.animations.getState().smoothScroll, true);
        noReplay(fixture);
    });

    check("Revelação e rolagem desligadas não interrompem uma intro já ativa", () => {
        const fixture = make();
        fixture.app.animations.init();
        fixture.app.animations.configure({ reveal: false, smoothScroll: false });
        assert.equal(fixture.app.heroIntro.getState().running, true);
        fixture.items.forEach((item) => fixture.finish(item));
        stopped(fixture);
    });

    check("As 32 combinações da base mantêm abertura, cards e entradas independentes", () => {
        for (let mask = 0; mask < 32; mask += 1) {
            const [enabled, intro, reveal, smoothScroll, cards] = [1, 2, 4, 8, 16].map((bit) => Boolean(mask & bit));
            const fixture = make();
            const state = fixture.app.animations.init({ enabled, intro, reveal, smoothScroll, cards });
            assert.equal(state.cards, enabled && cards);
            assert.equal(fixture.documentRoot.getAttribute("data-motion-cards"), enabled && cards ? "on" : null);
            assert.equal(state.intro, enabled && intro);
            assert.equal(state.reveal, enabled && reveal);
            assert.equal(state.smoothScroll, enabled && smoothScroll);
            assert.equal(fixture.app.heroIntro.getState().running, enabled && intro);
        }
    });

    check("Intro desligada ou inválida no carregamento não começa ao reativar", () => {
        for (const value of [false, "true", "false", 1, 0, null, [], {}]) {
            const fixture = make();
            fixture.app.animations.init({ intro: value });
            stopped(fixture);
            assert.equal(fixture.app.heroIntro.getState().status, "disabled");
            noReplay(fixture);
        }
    });

    check("Preferências iniciais e aba oculta pulam a intro definitivamente", () => {
        for (const options of [{ reduced: true }, { forcedColors: true }, { hidden: true }]) {
            const fixture = make(options);
            fixture.app.animations.init();
            stopped(fixture);
            fixture.document.hidden = false;
            fixture.document.dispatch("visibilitychange");
            fixture.changePreference(false);
            noReplay(fixture);
        }
    });

    check("Mudança de preferência ou aba oculta cancela sem repetir no retorno", () => {
        for (const kind of ["preference", "visibility"]) {
            const fixture = make();
            fixture.app.animations.init();
            if (kind === "preference") fixture.changePreference(true);
            else {
                fixture.document.hidden = true;
                fixture.document.dispatch("visibilitychange");
            }
            stopped(fixture);
            fixture.changePreference(false);
            fixture.document.hidden = false;
            fixture.document.dispatch("visibilitychange");
            noReplay(fixture);
        }
    });

    check("Pintura anterior, carga tardia e histórico nunca escondem conteúdo novamente", () => {
        for (const [options, reason] of [
            [{ painted: true }, "already-painted"], [{ age: 1501 }, "late"],
            [{ age: NaN }, "late"], [{ age: -1 }, "late"],
            [{ readyState: "complete" }, "late"], [{ navigation: "back_forward" }, "history"]
        ]) {
            const fixture = make(options);
            fixture.app.animations.init();
            assert.equal(fixture.app.heroIntro.getState().status, reason);
            stopped(fixture);
            noReplay(fixture);
        }
    });

    check("Âncoras diretas, posição restaurada e foco anterior têm prioridade", () => {
        for (const [options, reason] of [
            [{ hash: "#tradicionais" }, "anchor"], [{ hash: "#fitness" }, "anchor"],
            [{ hash: "#contato" }, "anchor"], [{ scroll: 1 }, "scrolled"],
            [{ scroll: -1 }, "scrolled"], [{ focused: true }, "focused"]
        ]) {
            const fixture = make(options);
            fixture.app.animations.init();
            assert.equal(fixture.app.heroIntro.getState().status, reason);
            stopped(fixture);
        }
        const home = make({ hash: "#inicio" });
        home.app.animations.init();
        assert.equal(home.app.heroIntro.getState().running, true);
    });

    check("Sem medição de pintura, CSS compatível ou APIs, a alternativa é estática", () => {
        for (const options of [
            { noPaintTiming: true }, { unsupportedCss: true },
            ...["performance", "PerformanceObserver", "CSS", "getComputedStyle", "addEventListener", "removeEventListener"].map((name) => ({ missing: [name] }))
        ]) {
            const fixture = make(options);
            assert.doesNotThrow(() => fixture.app.animations.init());
            assert.equal(fixture.app.heroIntro.getState().status, "unsupported");
            stopped(fixture);
            assert.equal(fixture.app.animations.getState().reveal, true);
        }
    });

    check("Sem IntersectionObserver apenas a revelação é omitida, não a intro", () => {
        const fixture = make({ missing: ["IntersectionObserver"] });
        fixture.app.animations.init();
        assert.equal(fixture.app.animations.getState().reveal, false);
        assert.equal(fixture.app.heroIntro.getState().running, true);
    });

    check("Ausência do hero, CSS, alvos ou duração não deixa recursos pendurados", () => {
        for (const [options, reason] of [
            [{ noHero: true }, "no-hero"], [{ noCss: true }, "no-effects"],
            [{ noTargets: true }, "no-effects"], [{ noRects: true }, "no-effects"],
            [{ zeroDuration: true }, "no-effects"]
        ]) {
            const fixture = make(options);
            fixture.app.animations.init();
            assert.equal(fixture.app.heroIntro.getState().status, reason);
            stopped(fixture);
        }
    });

    check("Desligar decorações não faz a sequência esperar um evento inexistente", () => {
        const fixture = make({ noDecorations: true });
        fixture.app.animations.init();
        fixture.items.filter((item) => item.kind !== "sprout").forEach((item) => fixture.finish(item));
        assert.equal(fixture.app.heroIntro.getState().status, "completed");
        stopped(fixture);
    });

    check("Erros de timing e estilo são contidos com restauração estática", () => {
        for (const options of [{ throwTiming: true }, { throwStyle: true }]) {
            const fixture = make(options);
            assert.doesNotThrow(() => fixture.app.animations.init());
            assert.equal(fixture.app.heroIntro.getState().status, "error");
            stopped(fixture);
            assert.equal(fixture.app.animations.getState().reveal, true);
            assert.equal(fixture.app.animations.getState().smoothScroll, true);
        }
    });

    check("Módulo ausente ou com falha não interrompe os outros efeitos", () => {
        const absent = make({ noModule: true });
        absent.app.animations.init();
        assert.equal(absent.app.animations.getState().intro, false);
        assert.equal(absent.app.animations.getState().reveal, true);
        const broken = make();
        broken.app.heroIntro.init = () => { throw new Error("Falha simulada do módulo"); };
        assert.doesNotThrow(() => broken.app.animations.init());
        assert.equal(broken.documentRoot.getAttribute("data-motion-intro"), null);
        assert.equal(broken.app.animations.getState().reveal, true);
    });

    check("Destroy remove somente recursos próprios e não repete na reinicialização", () => {
        const fixture = make();
        fixture.documentRoot.classList.add("has-mobile-order");
        fixture.documentRoot.setAttribute("data-unrelated", "preservar");
        fixture.hero.classList.add("theme--forest");
        fixture.app.animations.init();
        fixture.app.animations.destroy();
        fixture.app.animations.destroy();
        stopped(fixture);
        fixture.document.listeners.forEach((list) => assert.equal(list.length, 0));
        assert.equal(fixture.preference.listeners.get("change").length, 0);
        assert.equal(fixture.documentRoot.getAttribute("data-motion-intro"), null);
        assert.equal(fixture.documentRoot.getAttribute("data-unrelated"), "preservar");
        assert.ok(fixture.documentRoot.classes.has("has-mobile-order"));
        assert.ok(fixture.hero.classes.has("theme--forest"));
        noReplay(fixture);
    });

    check("Estado público é uma cópia e callbacks antigos não reativam a sequência", () => {
        const fixture = make();
        fixture.app.animations.init();
        const snapshot = fixture.app.heroIntro.getState();
        snapshot.attempted = false;
        snapshot.running = false;
        assert.equal(fixture.app.heroIntro.getState().running, true);
        const stale = fixture.document.listeners.get("animationend").map((item) => item.callback);
        fixture.app.animations.configure({ enabled: false });
        stale.forEach((callback) => callback({ type: "animationend", target: fixture.items[0], animationName: "hero-intro-copy" }));
        stopped(fixture);
        noReplay(fixture);
    });

    check("Bubble do CTA principal usa um span visual dentro de link nativo estável", () => {
        const anchors = [...hero.matchAll(/<a class="hero__action" href="([^"]+)"[^>]*>\s*<span class="([^"]+)" data-intro="action"[^>]*>([^<]+)<\/span>\s*<\/a>/g)];
        assert.equal(anchors.length, 1);
        assert.deepEqual(anchors.map((match) => [match[3]]), [["Abrir cardápio"]]);
        assert.match(anchors[0][0], /data-catalog-link/);
        anchors.forEach((match) => {
            assert.ok(match[2].split(" ").includes("button"));
            assert.ok(match[2].split(" ").includes("hero__action-visual"));
            assert.doesNotMatch(match[0], /aria-hidden|tabindex|role=|onclick/);
        });
        assert.doesNotMatch(hero, /Fale conosco|data-whatsapp|<a\b[^>]*data-intro|data-intro="actions"/);
    });

    check("Link e alvo de toque permanecem estáticos, cobrindo todo o pico permitido", () => {
        const layout = read("styles/sections/hero.css").replace(/\/\*[\s\S]*?\*\//g, "");
        const link = layout.match(/\.hero__action\s*\{([^}]+)\}/)[1];
        assert.doesNotMatch(link, /transform|animation|transition|overflow|outline/);
        assert.match(link, /position:\s*relative/);
        assert.match(link, /max-width:\s*100%/);
        assert.match(layout, /\.hero__action-visual\s*\{[^}]*pointer-events:\s*none/);
        assert.match(layout, /\.hero__action::after\s*\{[^}]*inset:\s*0;[^}]*transform:\s*scale\(1.08\)/);
        assert.match(css, /scale\(clamp\(1, var\(--intro-button-peak\), 1.08\)\)/);
        assert.doesNotMatch(css, /(?:a\.hero__action|\.hero__actions|\.hero__action::after)\s*\{/);
    });

    check("Bubble dos botões é local, preserva legibilidade e usa o mesmo terceiro grupo", () => {
        const frames = css.slice(css.indexOf("@keyframes hero-intro-action"), css.indexOf("@keyframes hero-intro-photo"));
        assert.match(frames, /0%\s*\{\s*transform:\s*scale\(clamp\(0.8, var\(--intro-button-start\), 1\)\)/);
        assert.match(frames, /65%\s*\{/);
        assert.match(frames, /100%\s*\{\s*transform:\s*none/);
        assert.doesNotMatch(frames, /opacity|visibility|display|translate/);
        assert.match(css, /\[data-intro="action"\]\s*\{\s*animation-name:\s*hero-intro-action;\s*animation-delay:\s*calc\(clamp\(0ms, var\(--intro-stagger\), 120ms\) \* 2\)/);
        assert.doesNotMatch(read("styles/components/buttons.css"), /hero-intro|@keyframes|scale\(/);
    });

    check("Intervalo e margens comportam o limite horizontal do bubble nos layouts previstos", () => {
        const layout = read("styles/sections/hero.css");
        assert.match(layout, /\.hero__actions\s*\{\s*width:\s*100%;\s*row-gap:\s*var\(--space-2\);\s*column-gap:\s*max\(var\(--space-2\), 4%\)/);
        // Modelo conservador: ambos os links juntos ocupam toda a largura disponível.
        // Não substitui medidas de texto e pixels em navegador.
        for (const rem of [16, 20, 32]) {
            for (const viewport of [320, 375, 430, 768, 960, 1440, 2560]) {
                const gutter = Math.max(rem, Math.min(0.04 * viewport, 3 * rem));
                const container = Math.min(viewport - 2 * gutter, 70 * rem);
                const gap = Math.max(rem, 0.04 * container);
                assert.ok((container - gap) * 0.04 <= gap, "Os alvos não devem se cruzar na mesma linha");
                assert.ok(container * 0.04 <= gutter, "A borda ampliada deve caber na margem da página");
            }
        }
    });

    check("Hover, clique e foco continuam pertencendo aos links, inclusive sem a intro", () => {
        const layout = read("styles/sections/hero.css");
        for (const state of ["hover", "active"]) {
            assert.ok(layout.includes(`.hero__action:${state} .hero__action-visual`));
            assert.ok(layout.includes(`.hero__action:${state} .button--outline`));
        }
        assert.match(layout, /@media \(hover: hover\) and \(pointer: fine\)/);
        assert.match(css, /\.hero__action:focus-within \[data-intro="action"\]\s*\{\s*animation:\s*none/);
        assert.match(read("styles/base/reset.css"), /:focus-visible\s*\{\s*outline:/);
        assert.doesNotMatch(layout, /outline:\s*(?:none|0)|pointer-events:\s*none[^}]*\.hero__action/);
    });

    check("Controlador aguarda os dois botões individualmente, sem terminar no primeiro", () => {
        const fixture = make();
        fixture.app.animations.init();
        const actions = fixture.items.filter((item) => item.kind === "action");
        assert.equal(actions.length, 2);
        fixture.items.filter((item) => item.kind !== "action").forEach((item) => fixture.finish(item));
        fixture.finish(actions[0]);
        assert.equal(fixture.app.heroIntro.getState().running, true);
        fixture.finish(actions[1]);
        assert.equal(fixture.app.heroIntro.getState().status, "completed");
        stopped(fixture);
        noReplay(fixture);
    });

    check("Interagir com qualquer link cancela ambos os bubbles sem alterar o destino", () => {
        for (let index = 0; index < 2; index += 1) {
            for (const event of ["pointerdown", "touchstart", "focusin", "click"]) {
                const fixture = make();
                fixture.links[index].setAttribute("href", ["#tradicionais", "#contato"][index]);
                fixture.app.animations.init();
                fixture.document.dispatch(event, { target: fixture.links[index], preventDefault: () => assert.fail("Clique bloqueado") });
                stopped(fixture);
                assert.equal(fixture.links[index].getAttribute("href"), ["#tradicionais", "#contato"][index]);
                assert.ok(fixture.items.filter((item) => item.kind === "action").every((item) => item.parentElement.kind === "link"));
            }
        }
    });
}
