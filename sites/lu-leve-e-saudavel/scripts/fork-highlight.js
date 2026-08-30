/* v0.1.17 — garfinho decorativo no card tradicional de 400 g. */
(() => {
    "use strict";

    window.LuLeve = window.LuLeve || {};

    const targetSelector = "[data-fork-highlight-target]";
    const effectSelector = "[data-fork-highlight]";
    let enabled = false;
    let played = false;
    let observer = null;
    let target = null;
    let effect = null;

    function clearAnimation() {
        target?.classList.remove("is-fork-highlighted");
    }

    function disconnect() {
        observer?.disconnect();
        observer = null;
    }

    function finish(event) {
        if (event.target === effect && event.animationName === "fork-travel") {
            clearAnimation();
        }
    }

    function play() {
        if (!enabled || played || !target || !effect || document.hidden) {
            return;
        }

        played = true;
        disconnect();
        clearAnimation();
        target.classList.add("is-fork-highlighted");
    }

    function observe() {
        if (!enabled || played || observer || !target || typeof window.IntersectionObserver !== "function") {
            return;
        }

        try {
            const currentObserver = new window.IntersectionObserver((entries) => {
                if (!enabled || observer !== currentObserver || document.hidden) {
                    return;
                }

                if (entries.some((entry) => entry.target === target && entry.isIntersecting)) {
                    play();
                }
            }, {
                threshold: 0.45,
                rootMargin: "0px 0px -8% 0px"
            });

            observer = currentObserver;
            currentObserver.observe(target);
        } catch {
            disconnect();
        }
    }

    function configure(value) {
        enabled = value === true;

        if (!enabled) {
            disconnect();
            clearAnimation();
            return getState();
        }

        if (!target) {
            target = document.querySelector(targetSelector);
            effect = target?.querySelector(effectSelector) || null;

            if (!target || !effect) {
                enabled = false;
                return getState();
            }

            effect.addEventListener("animationend", finish);
            effect.addEventListener("animationcancel", finish);
        }

        observe();
        return getState();
    }

    function stop() {
        disconnect();
        clearAnimation();
        return getState();
    }

    function destroy() {
        enabled = false;
        disconnect();
        clearAnimation();
        effect?.removeEventListener("animationend", finish);
        effect?.removeEventListener("animationcancel", finish);
        target = null;
        effect = null;
        return getState();
    }

    function getState() {
        return {
            enabled,
            played,
            observing: Boolean(observer),
            running: Boolean(target?.classList.contains("is-fork-highlighted"))
        };
    }

    window.LuLeve.forkHighlight = { configure, stop, destroy, getState };
})();
