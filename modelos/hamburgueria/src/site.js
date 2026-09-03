import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "./config.js";

gsap.registerPlugin(ScrollTrigger);

export function initSite() {
    const business = siteConfig.business || {};
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const siteHeader = document.querySelector(".site-header");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setText(selector, value) {
        if (!value) return;
        document.querySelectorAll(selector).forEach((element) => {
            element.textContent = value;
        });
    }

    setText("[data-business-name]", business.name);
    setText("[data-brand-primary]", business.brandPrimary);
    setText("[data-brand-accent]", business.brandAccent);
    setText("[data-phone]", business.phoneDisplay);
    setText("[data-address]", business.address);
    setText("[data-delivery]", business.delivery);

    document.querySelectorAll("[data-hours]").forEach((element, index, list) => {
        const value = index === list.length - 1 ? business.hoursFooter : business.hoursCompact;
        if (value) element.textContent = value;
    });

    document.querySelectorAll("[data-phone-link]").forEach((link) => {
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
        menuToggle.addEventListener("click", () => {
            const open = !mainNav.classList.contains("is-open");
            mainNav.classList.toggle("is-open", open);
            menuToggle.setAttribute("aria-expanded", String(open));
            document.body.classList.toggle("menu-open", open);
        });
        mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });
    }

    function updateHeader() {
        if (siteHeader) siteHeader.classList.toggle("is-scrolled", window.scrollY > 18);
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (reducedMotion) {
        document.querySelectorAll(".reveal").forEach((element) => element.classList.add("reveal--visible"));
        document.querySelectorAll("[data-count]").forEach((element) => {
            const suffix = element.dataset.suffix || "";
            const value = Number(element.dataset.count || 0);
            const decimals = String(element.dataset.count || "").includes(".") ? 1 : 0;
            element.textContent = (decimals ? value.toFixed(1).replace(".", ",") : Math.round(value)) + suffix;
        });
        return;
    }

    gsap.fromTo(".hero__copy > *",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.78, stagger: 0.09, ease: "power3.out", delay: 0.1 }
    );

    document.querySelectorAll(".reveal:not(.hero__copy)").forEach((element) => {
        gsap.fromTo(element,
            { opacity: 0, y: 34 },
            {
                opacity: 1,
                y: 0,
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 88%",
                    once: true
                }
            }
        );
    });

    document.querySelectorAll("[data-count]").forEach((element) => {
        const target = Number(element.dataset.count || 0);
        const suffix = element.dataset.suffix || "";
        const decimals = String(element.dataset.count || "").includes(".") ? 1 : 0;
        const state = { value: 0 };
        gsap.to(state, {
            value: target,
            duration: 1.25,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
            onUpdate: () => {
                const value = decimals ? state.value.toFixed(1).replace(".", ",") : String(Math.round(state.value));
                element.textContent = value + suffix;
            }
        });
    });

    document.querySelectorAll(".menu-sample-card").forEach((card, index) => {
        gsap.to(card, {
            y: index % 2 ? -7 : 7,
            rotation: index === 1 ? 1.2 : -0.8,
            duration: 2.8 + index * 0.35,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
    });
}
