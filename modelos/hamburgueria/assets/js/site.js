(function () {
    "use strict";

    const config = window.NEOEFFEX_HAMBURGUERIA_CONFIG || {};
    const business = config.business || {};
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const siteHeader = document.querySelector(".site-header");
    const hero = document.querySelector(".hero");
    const burgerScene = document.getElementById("burgerScene");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setText(selector, value) {
        if (!value) return;
        document.querySelectorAll(selector).forEach(function (element) {
            element.textContent = value;
        });
    }

    setText("[data-business-name]", business.name);
    setText("[data-brand-primary]", business.brandPrimary);
    setText("[data-brand-accent]", business.brandAccent);
    setText("[data-phone]", business.phoneDisplay);
    setText("[data-address]", business.address);
    setText("[data-delivery]", business.delivery);

    document.querySelectorAll("[data-hours]").forEach(function (element, index, list) {
        const value = index === list.length - 1 ? business.hoursFooter : business.hoursCompact;
        if (value) element.textContent = value;
    });

    document.querySelectorAll("[data-phone-link]").forEach(function (link) {
        if (business.phoneHref) link.href = "tel:" + business.phoneHref;
    });

    const year = document.getElementById("currentYear");
    if (year) year.textContent = String(new Date().getFullYear());

    function closeMenu() {
        if (!mainNav || !menuToggle) return;
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            const open = !mainNav.classList.contains("is-open");
            mainNav.classList.toggle("is-open", open);
            menuToggle.setAttribute("aria-expanded", String(open));
            document.body.classList.toggle("menu-open", open);
        });

        mainNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        window.addEventListener("keydown", function (event) {
            if (event.key === "Escape") closeMenu();
        });
    }

    function updateHeader() {
        if (siteHeader) siteHeader.classList.toggle("is-scrolled", window.scrollY > 18);
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    const revealElements = document.querySelectorAll(".reveal:not(.reveal--visible)");
    revealElements.forEach(function (element, index) {
        element.style.setProperty("--reveal-delay", Math.min(index % 4, 3) * 65 + "ms");
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach(function (element) { element.classList.add("reveal--visible"); });
    } else {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("reveal--visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -30px" });
        revealElements.forEach(function (element) { observer.observe(element); });
    }

    function formatCounter(value, decimals, suffix) {
        const number = decimals ? value.toFixed(decimals).replace(".", ",") : String(Math.round(value));
        return number + (suffix || "");
    }

    function animateCounter(element) {
        if (element.dataset.counted === "true") return;
        element.dataset.counted = "true";
        const target = Number(element.dataset.count || 0);
        const suffix = element.dataset.suffix || "";
        const decimals = String(element.dataset.count || "").includes(".") ? 1 : 0;
        if (reducedMotion) {
            element.textContent = formatCounter(target, decimals, suffix);
            return;
        }
        const start = performance.now();
        const duration = 1150;
        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = formatCounter(target * eased, decimals, suffix);
            if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    const counters = document.querySelectorAll("[data-count]");
    if ("IntersectionObserver" in window && !reducedMotion) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            });
        }, { threshold: 0.55 });
        counters.forEach(function (element) { counterObserver.observe(element); });
    } else {
        counters.forEach(animateCounter);
    }

    if (hero && burgerScene && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
        let queued = false;
        let pointerX = 0;
        let pointerY = 0;

        function paintParallax() {
            queued = false;
            burgerScene.style.setProperty("--scene-x", (pointerX * 4.5).toFixed(2) + "deg");
            burgerScene.style.setProperty("--scene-y", (pointerY * -3.2).toFixed(2) + "deg");
        }

        hero.addEventListener("pointermove", function (event) {
            const bounds = hero.getBoundingClientRect();
            pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
            pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
            if (!queued) {
                queued = true;
                requestAnimationFrame(paintParallax);
            }
        });

        hero.addEventListener("pointerleave", function () {
            pointerX = 0;
            pointerY = 0;
            if (!queued) {
                queued = true;
                requestAnimationFrame(paintParallax);
            }
        });
    }
}());
