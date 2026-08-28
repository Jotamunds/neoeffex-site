/* Simulador limitado de DOM/APIs: verifica controle, não renderiza o CSS. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

export function createIntroFixture(root, options = {}) {
    function element(kind = "") {
        const attributes = new Map();
        const classes = new Set();
        return {
            kind, classes, attributes, parentElement: null,
            classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) },
            setAttribute: (name, value) => attributes.set(name, value),
            getAttribute: (name) => attributes.get(name) ?? null,
            removeAttribute: (name) => attributes.delete(name),
            getClientRects: () => options.noRects || (kind === "sprout" && options.noDecorations) ? [] : [{}],
            contains(target) {
                for (let current = target; current; current = current.parentElement) {
                    if (current === this) return true;
                }
                return false;
            }
        };
    }

    function events() {
        const listeners = new Map();
        return {
            listeners,
            addEventListener(name, callback, settings = false) {
                const list = listeners.get(name) || [];
                list.push({ callback, capture: settings === true || settings.capture === true, settings });
                listeners.set(name, list);
            },
            removeEventListener(name, callback, capture = false) {
                listeners.set(name, (listeners.get(name) || []).filter((item) => item.callback !== callback || item.capture !== capture));
            },
            dispatch(name, details = {}) {
                const event = { type: name, ...details };
                (listeners.get(name) || []).slice().forEach((item) => item.callback(event));
                return event;
            }
        };
    }

    const documentRoot = element();
    const body = element();
    const hero = element();
    const items = ["title", "title", "copy", "action", "action", "photo", "sprout"].map(element);
    const links = [element("link"), element("link")];
    const outside = element();
    items.forEach((item) => { item.parentElement = hero; });
    links.forEach((link) => { link.parentElement = hero; });
    items.filter((item) => item.kind === "action").forEach((item, index) => { item.parentElement = links[index]; });
    hero.querySelectorAll = (selector) => {
        if (options.noTargets) return [];
        if (selector.startsWith(".section-decoration")) return items.filter((item) => item.kind === "sprout");
        const kind = selector.match(/data-intro="([a-z]+)"/)?.[1];
        return items.filter((item) => item.kind === kind);
    };
    const preferenceEvents = events();
    const preference = {
        ...preferenceEvents,
        matches: Boolean(options.reduced || options.forcedColors)
    };
    const document = {
        ...events(), documentElement: documentRoot, body,
        activeElement: options.focused ? links[0] : body,
        hidden: Boolean(options.hidden), readyState: options.readyState || "interactive",
        querySelector: (selector) => selector === "#inicio" && !options.noHero ? hero : null,
        querySelectorAll: (selector) => selector === "[data-reveal]" ? [outside] : []
    };
    const observers = [];
    const names = { title: "hero-intro-copy", copy: "hero-intro-copy", action: "hero-intro-action", photo: "hero-intro-photo", sprout: "hero-intro-sprout" };
    const window = {
        ...events(), location: { hash: options.hash || "" }, scrollY: options.scroll || 0,
        CSS: { supports: () => !options.unsupportedCss },
        PerformanceObserver: { supportedEntryTypes: options.noPaintTiming ? [] : ["paint", "navigation"] },
        performance: {
            now: () => options.age ?? 100,
            getEntriesByType: (type) => {
                if (options.throwTiming) throw new Error("Falha simulada de timing");
                if (type === "paint") return options.painted ? [{ name: "first-contentful-paint", startTime: 50 }] : [];
                if (type === "navigation") return [{ type: options.navigation || "navigate" }];
                throw new Error(`Tipo inesperado: ${type}`);
            }
        },
        getComputedStyle: (item) => {
            if (options.throwStyle) throw new Error("Falha simulada de estilo");
            const active = hero.classes.has("is-intro-running") && documentRoot.getAttribute("data-motion-intro") === "on";
            return {
                animationName: active && !options.noCss ? names[item.kind] : "none",
                animationDuration: options.zeroDuration ? "0s" : "0.64s"
            };
        },
        matchMedia: () => preference,
        IntersectionObserver: class {
            constructor(callback) {
                this.callback = callback;
                this.targets = new Set();
                observers.push(this);
            }
            observe(target) { this.targets.add(target); }
            unobserve(target) { this.targets.delete(target); }
            disconnect() { this.targets.clear(); }
        }
    };
    for (const name of options.missing || []) delete window[name];
    const scripts = options.noModule ? ["animations.js"] : ["hero-intro.js", "animations.js"];
    for (const name of scripts) {
        vm.runInNewContext(readFileSync(join(root, "scripts", name), "utf8"), { window, document });
    }
    return {
        app: window.LuLeve, document, window, documentRoot, hero, items, links, outside, observers, preference,
        finish: (item, type = "animationend") => document.dispatch(type, { target: item, animationName: names[item.kind] }),
        changePreference: (value) => {
            preference.matches = value;
            preference.dispatch("change");
        }
    };
}
