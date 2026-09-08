(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const BOAFONT_CONFIG = {
    slug: "boafont",
    catalogUrl: "",
    contactUrl: ""
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const menu = document.querySelector(".menu");
  const navLinks = document.querySelector(".nav-links");
  const notice = document.querySelector(".notice");
  const hero = document.querySelector(".hero");
  const topbar = document.querySelector(".topbar");

  const setMenuState = (open) => {
    navLinks.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.textContent = open ? "×" : "☰";
  };

  menu.addEventListener("click", () => setMenuState(!navLinks.classList.contains("open")));

  navLinks.querySelectorAll("a:not(.requires-config)").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  let noticeTimer = 0;
  const showNotice = (message) => {
    window.clearTimeout(noticeTimer);
    notice.textContent = message;
    notice.classList.add("show");
    noticeTimer = window.setTimeout(() => notice.classList.remove("show"), 4200);
  };

  document.querySelectorAll(".requires-config").forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = link.dataset.target === "catalog" ? BOAFONT_CONFIG.catalogUrl : BOAFONT_CONFIG.contactUrl;
      if (!url) {
        event.preventDefault();
        showNotice(
          link.dataset.target === "catalog"
            ? "Catálogo oficial aguardando a URL configurada para a Boafont."
            : "Canal comercial aguardando confirmação para a Boafont."
        );
        return;
      }
      link.href = url;
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reducedMotion.matches) {
    revealItems.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .14, rootMargin: "0px 0px -4%" });
    revealItems.forEach((element) => observer.observe(element));
  }

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    new IntersectionObserver(([entry]) => {
      hero.classList.toggle("is-active", entry.isIntersecting);
    }, { threshold: .1 }).observe(hero);
  } else {
    hero.classList.add("is-active");
  }

  let ticking = false;
  const updateScrollMotion = () => {
    const scrollY = window.scrollY || 0;
    topbar.classList.toggle("is-scrolled", scrollY > 20);

    if (!reducedMotion.matches && scrollY < window.innerHeight * 1.15) {
      const parallax = Math.min(scrollY * .075, 38);
      hero.style.setProperty("--hero-parallax-y", `${parallax}px`);
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollMotion);
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  updateScrollMotion();

  reducedMotion.addEventListener?.("change", () => {
    if (reducedMotion.matches) hero.style.removeProperty("--hero-parallax-y");
  });
})();
