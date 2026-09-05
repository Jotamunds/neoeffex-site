/* Base de movimento opcional. Sem este módulo, o conteúdo já está visível.
 * Coordena abertura, cards, contato, garfinho, preços, entrada suave e rolagem.
 */
(() => {
    "use strict";

    window.LuLeve = window.LuLeve || {};
    const root = document.documentElement;
    const settings = { enabled: true, intro: true, cards: true, contact: true, fork: false, prices: false, reveal: true, smoothScroll: true };
    const seen = new WeakSet();
    let initialized = false;
    let preference = null;
    let removePreferenceListener = null;
    let observer = null;
    let elements = [];
    let revealFailed = false;

    function getState() {
        const enabled = Boolean(initialized && settings.enabled && preference && !preference.matches && !document.hidden);
        return {
            initialized,
            enabled,
            intro: enabled && settings.intro && Boolean(window.LuLeve.heroIntro),
            // Permissão geral; hover/ponteiro são avaliados pelo CSS, sem listeners novos.
            cards: enabled && settings.cards,
            contact: enabled && settings.contact && Boolean(window.LuLeve.contactJump),
            fork: enabled && settings.fork && Boolean(window.LuLeve.forkHighlight),
            prices: enabled && settings.prices && Boolean(window.LuLeve.priceCountup),
            reveal: enabled && settings.reveal && !revealFailed && typeof window.IntersectionObserver === "function",
            smoothScroll: enabled && settings.smoothScroll
        };
    }

    function introAction(method, argument) {
        const intro = window.LuLeve.heroIntro;
        if (intro && typeof intro[method] === "function") {
            try {
                intro[method](argument);
            } catch {
                // O efeito opcional não pode impedir os outros aprimoramentos.
                mark("data-motion-intro", false);
            }
        }
    }

    function mark(name, enabled) {
        if (!root) {
            return;
        }

        if (enabled) {
            root.setAttribute(name, "on");
        } else {
            root.removeAttribute(name);
        }
    }

    function contactAction(method, argument) {
        const effect = window.LuLeve.contactJump;
        if (effect && typeof effect[method] === "function") {
            try {
                effect[method](argument);
            } catch {
                // Falha no efeito nunca impede contato, abertura ou leitura.
            }
        }
    }

    function forkAction(method, argument) {
        const effect = window.LuLeve.forkHighlight;
        if (effect && typeof effect[method] === "function") {
            try {
                effect[method](argument);
            } catch {
                mark("data-motion-fork", false);
            }
        }
    }

    function priceAction(method, argument) {
        const effect = window.LuLeve.priceCountup;
        if (effect && typeof effect[method] === "function") {
            try {
                effect[method](argument);
            } catch {
                mark("data-motion-prices", false);
            }
        }
    }

    function stopReveal() {
        const previousObserver = observer;
        observer = null;

        if (previousObserver) {
            previousObserver.disconnect();
        }

        elements.forEach((element) => element.classList.remove("is-revealed"));
    }

    function refresh() {
        const state = getState();
        mark("data-motion-scroll", state.smoothScroll);
        mark("data-motion-reveal", state.reveal);
        mark("data-motion-intro", state.intro);
        mark("data-motion-cards", state.cards);
        mark("data-motion-fork", state.fork);
        mark("data-motion-prices", state.prices);
        contactAction("configure", state.contact);
        forkAction("configure", state.fork);
        priceAction("configure", state.prices);
        if (!state.intro) {
            introAction("stop", "disabled");
        }

        if (!state.reveal) {
            stopReveal();
            return;
        }

        // Mudar só a rolagem não reinicia nem interrompe as entradas.
        if (observer) {
            return;
        }

        const pending = elements.filter((element) => !seen.has(element));

        if (!pending.length) {
            return;
        }

        try {
            const currentObserver = new window.IntersectionObserver((entries) => {
                // Notificações enfileiradas não podem reviver um efeito cancelado.
                if (!getState().reveal || observer !== currentObserver) {
                    return;
                }

                entries.forEach((entry) => {
                    if (!entry.isIntersecting || seen.has(entry.target)) {
                        return;
                    }

                    seen.add(entry.target);
                    currentObserver.unobserve(entry.target);

                    // Quem já está interagindo não precisa esperar uma entrada.
                    if (!entry.target.contains(document.activeElement)) {
                        entry.target.classList.add("is-revealed");
                    }
                });
            }, { threshold: 0.12 });

            observer = currentObserver;
            pending.forEach((element) => currentObserver.observe(element));
        } catch {
            // Uma falha visual não deve interromper contatos ou outros módulos.
            revealFailed = true;
            mark("data-motion-reveal", false);
            stopReveal();
        }
    }

    function finishReveal(event) {
        if (event.animationName === "reveal-soft" && elements.includes(event.target)) {
            event.target.classList.remove("is-revealed");
        }
    }

    function focusReveal(event) {
        elements.forEach((element) => {
            if (element.contains(event.target)) {
                seen.add(element);
                element.classList.remove("is-revealed");

                if (observer) {
                    observer.unobserve(element);
                }
            }
        });
    }

    const events = {
        animationend: finishReveal,
        animationcancel: finishReveal,
        focusin: focusReveal,
        visibilitychange: refresh
    };

    function configure(options = {}) {
        if (!options || typeof options !== "object" || Array.isArray(options)) {
            settings.enabled = false;
        } else {
            Object.keys(settings).forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(options, key)) {
                    // Valores como "false" ou 1 não ativam efeitos por engano.
                    settings[key] = options[key] === true;
                }
            });
        }

        if (initialized) {
            refresh();
        }

        return getState();
    }

    function destroy() {
        initialized = false;
        contactAction("destroy");
        forkAction("destroy");
        priceAction("destroy");
        mark("data-motion-scroll", false);
        mark("data-motion-reveal", false);
        stopReveal();
        mark("data-motion-intro", false);
        mark("data-motion-cards", false);
        mark("data-motion-fork", false);
        mark("data-motion-prices", false);
        introAction("destroy");

        if (removePreferenceListener) {
            removePreferenceListener();
            removePreferenceListener = null;
        }

        if (typeof document.removeEventListener === "function") {
            Object.entries(events).forEach(([name, callback]) => document.removeEventListener(name, callback));
        }

        preference = null;
        elements = [];
        revealFailed = false;
        // O histórico permanece: reinicializar não repete entradas já vistas.
        return getState();
    }

    function init(options) {
        if (initialized) {
            return getState();
        }

        configure(options);

        if (!root || typeof window.matchMedia !== "function" || typeof document.addEventListener !== "function") {
            return getState();
        }

        try {
            preference = window.matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)");

            if (!preference || typeof preference.matches !== "boolean") {
                return getState();
            }

            elements = [...document.querySelectorAll("[data-reveal]")];
            initialized = true;

            if (typeof preference.addEventListener === "function" && typeof preference.removeEventListener === "function") {
                preference.addEventListener("change", refresh);
                removePreferenceListener = () => preference.removeEventListener("change", refresh);
            } else if (typeof preference.addListener === "function" && typeof preference.removeListener === "function") {
                preference.addListener(refresh);
                removePreferenceListener = () => preference.removeListener(refresh);
            }

            Object.entries(events).forEach(([name, callback]) => document.addEventListener(name, callback));
            refresh();
            // Única tentativa no init. Configure/retorno de aba nunca iniciam a abertura.
            introAction("init", getState().intro);
        } catch {
            destroy();
        }

        return getState();
    }

    window.LuLeve.animations = { init, configure, getState, destroy };
})();
