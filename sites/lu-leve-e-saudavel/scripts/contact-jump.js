/* Etapa 4: feedback visual opcional. A navegação é sempre a da âncora.
 * Sem timers, janela manual ou espera pelo fim. WAAPI não modifica o HTML.
 */
(() => {
    "use strict";

    window.LuLeve = window.LuLeve || {};
    let enabled = false;
    let animation = null;
    const passive = { passive: true };
    const cancelEvents = ["pagehide", "beforeprint", "resize"];

    function stop() {
        const previous = animation;
        animation = null;
        if (previous) {
            previous.onfinish = null;
            previous.oncancel = null;
            previous.cancel();
        }
    }

    function value(style, name, unit, fallback, maximum) {
        const raw = style.getPropertyValue(name).trim();
        const match = raw.match(new RegExp(`^(-?\\d+(?:\\.\\d+)?)${unit}$`));
        return match ? Math.max(0, Math.min(maximum, Number(match[1]))) : fallback;
    }

    function activate(event) {
        if (!enabled || event.defaultPrevented || event.button > 0
            || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || document.hidden) {
            return;
        }

        try {
            const link = event.target?.closest?.("[data-contact-jump]");
            const app = window.LuLeve;
            const contact = app.config?.contact;
            const expected = contact && app.whatsapp?.createWhatsappUrl(contact.whatsappNumber, contact.whatsappMessage);
            if (!link || !expected || link.getAttribute("href") !== expected
                || link.getAttribute("aria-disabled") === "true") {
                return;
            }

            const visual = link.querySelector("[data-whatsapp-text]");
            if (!visual || typeof visual.animate !== "function"
                || typeof window.getComputedStyle !== "function"
                || typeof window.matchMedia !== "function"
                || window.matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)").matches) {
                return;
            }

            const style = window.getComputedStyle(visual);
            const duration = value(style, "--contact-jump-duration", "ms", 280, 400);
            const height = value(style, "--contact-jump-height", "px", 4, 6);
            if (!duration || !height) {
                return;
            }

            // A intro libera o transform antes do salto, inclusive por teclado.
            app.heroIntro?.stop("interaction");
            stop();
            const current = visual.animate([
                { transform: "translateY(0)", offset: 0 },
                { transform: `translateY(-${height}px)`, offset: 0.4 },
                { transform: "translateY(0)", offset: 1 }
            ], { duration, easing: "ease-out", iterations: 1, fill: "none" });
            animation = current;
            const finish = () => {
                if (animation === current) {
                    animation = null;
                }
                current.onfinish = null;
                current.oncancel = null;
            };
            current.onfinish = finish;
            current.oncancel = finish;
        } catch {
            // Até uma API visual com falha deve deixar o clique nativo prosseguir.
            stop();
        }
    }

    function configure(allowed) {
        const next = allowed === true;
        if (next === enabled) {
            return;
        }
        if (!next) {
            enabled = false;
            document.removeEventListener("click", activate);
            cancelEvents.forEach((name) => window.removeEventListener(name, stop));
            stop();
            return;
        }
        enabled = true;
        document.addEventListener("click", activate, passive);
        cancelEvents.forEach((name) => window.addEventListener(name, stop, passive));
    }

    function destroy() {
        configure(false);
        stop();
    }

    window.LuLeve.contactJump = { configure, stop, destroy };
})();
