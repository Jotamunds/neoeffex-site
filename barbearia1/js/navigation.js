(() => {
    const siteHeader = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (!siteHeader || !menuToggle || !mainNav) {
        return;
    }

    const setMenu = (open) => {
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        mainNav.classList.toggle("is-open", open);
        document.body.classList.toggle("menu-open", open);
    };

    menuToggle.addEventListener("click", () => {
        setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    const updateHeader = () => {
        siteHeader.classList.toggle("is-scrolled", window.scrollY > 28);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    const observedSections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav__link");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            "is-active",
                            link.getAttribute("href") === "#" + entry.target.id
                        );
                    });
                }
            });
        }, { rootMargin: "-38% 0px -52% 0px" });

        observedSections.forEach((section) => sectionObserver.observe(section));
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
            setMenu(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 820) {
            setMenu(false);
        }
    });
})();
