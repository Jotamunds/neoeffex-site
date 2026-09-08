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

  const aboutSection = document.querySelector(".about");
  const photoComposition = document.querySelector(".photo-composition");

  let ticking = false;
  const updateScrollMotion = () => {
    const scrollY = window.scrollY || 0;
    topbar.classList.toggle("is-scrolled", scrollY > 20);

    if (!reducedMotion.matches) {
      if (scrollY < window.innerHeight * 1.15) {
        const parallax = Math.min(scrollY * .075, 38);
        hero.style.setProperty("--hero-parallax-y", `${parallax}px`);
      }

      if (aboutSection && photoComposition && window.innerWidth > 760) {
        const rect = aboutSection.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.top < vh && rect.bottom > 0) {
          const progress = (vh - rect.top) / (vh + rect.height) - 0.5;
          const pFacade = (progress * 12).toFixed(1);
          const pVan = (progress * -24).toFixed(1);
          const pStock = (progress * 18).toFixed(1);
          photoComposition.style.setProperty("--p-facade-y", `${pFacade}px`);
          photoComposition.style.setProperty("--p-van-y", `${pVan}px`);
          photoComposition.style.setProperty("--p-stock-y", `${pStock}px`);
        }
      }
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

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (photoComposition && finePointer.matches) {
    let mouseRaf = 0;
    let targetX = 0;
    let targetY = 0;

    const applyMouseDepth = () => {
      photoComposition.style.setProperty("--mouse-x", targetX.toFixed(3));
      photoComposition.style.setProperty("--mouse-y", targetY.toFixed(3));
      mouseRaf = 0;
    };

    photoComposition.addEventListener("mousemove", (event) => {
      if (reducedMotion.matches || window.innerWidth <= 760) return;
      const rect = photoComposition.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 2;
      targetY = y * 2;
      if (!mouseRaf) {
        mouseRaf = window.requestAnimationFrame(applyMouseDepth);
      }
    }, { passive: true });

    photoComposition.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
      if (!mouseRaf) {
        mouseRaf = window.requestAnimationFrame(applyMouseDepth);
      }
    });
  }

  reducedMotion.addEventListener?.("change", () => {
    if (reducedMotion.matches) {
      hero.style.removeProperty("--hero-parallax-y");
      if (photoComposition) {
        photoComposition.style.removeProperty("--p-facade-y");
        photoComposition.style.removeProperty("--p-van-y");
        photoComposition.style.removeProperty("--p-stock-y");
        photoComposition.style.removeProperty("--mouse-x");
        photoComposition.style.removeProperty("--mouse-y");
      }
    }
  });
})();

