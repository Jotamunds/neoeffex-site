(function () {
    "use strict";

    const config = window.NEOEFFEX_HAMBURGUERIA_CONFIG || {};
    const business = config.business || {};
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

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

    const hourBlocks = document.querySelectorAll("[data-hours]");
    hourBlocks.forEach(function (element, index) {
        const value = index === hourBlocks.length - 1 ? business.hoursFooter : business.hoursCompact;
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

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = document.querySelectorAll(".reveal:not(.reveal--visible)");

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
}());
