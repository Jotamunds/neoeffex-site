/*
 * Neoeffex Landing v0.1.6
 *
 * Reveal de palavras por proximidade do ponteiro.
 *
 * Correções desta versão:
 * - o arquivo agora é efetivamente carregado pelo index.html;
 * - assets locais usam cache busting por versão;
 * - bounds/centros são cacheados e recalculados só quando necessário.
 */

(() => {
  const hero = document.querySelector(".hero");
  const values = Array.from(document.querySelectorAll(".hero__value"));

  if (!hero || values.length === 0) return;

  const MAX_OPACITY = 0.60;

  let pointerX = 0;
  let pointerY = 0;
  let pointerActive = false;
  let framePending = false;
  let centers = [];

  function getRevealRadius() {
    if (window.innerWidth <= 480) return 170;
    if (window.innerWidth <= 760) return 210;
    return 280;
  }

  function getInnerRadius() {
    return window.innerWidth <= 760 ? 42 : 64;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function cacheCenters() {
    centers = values.map((value) => {
      const rect = value.getBoundingClientRect();

      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });
  }

  function setAllHidden() {
    values.forEach((value) => {
      value.style.setProperty("--value-opacity", "0");
    });
  }

  function renderReveal() {
    framePending = false;

    if (!pointerActive) {
      setAllHidden();
      return;
    }

    const radius = getRevealRadius();
    const innerRadius = getInnerRadius();
    const falloffRange = Math.max(radius - innerRadius, 1);

    values.forEach((value, index) => {
      const center = centers[index];
      if (!center) return;

      const distance = Math.hypot(
        pointerX - center.x,
        pointerY - center.y
      );

      const normalized = 1 - clamp(
        (distance - innerRadius) / falloffRange,
        0,
        1
      );

      const opacity = easeOutCubic(normalized) * MAX_OPACITY;

      value.style.setProperty(
        "--value-opacity",
        opacity.toFixed(3)
      );
    });
  }

  function requestRevealFrame() {
    if (framePending) return;

    framePending = true;
    requestAnimationFrame(renderReveal);
  }

  function updatePointer(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerActive = true;
    requestRevealFrame();
  }

  function refreshLayout() {
    cacheCenters();

    if (pointerActive) {
      requestRevealFrame();
    }
  }

  hero.addEventListener("pointermove", updatePointer, { passive: true });
  hero.addEventListener("pointerdown", updatePointer, { passive: true });

  hero.addEventListener("pointerleave", () => {
    pointerActive = false;
    requestRevealFrame();
  });

  hero.addEventListener("pointercancel", () => {
    pointerActive = false;
    requestRevealFrame();
  });

  window.addEventListener("blur", () => {
    pointerActive = false;
    requestRevealFrame();
  });

  window.addEventListener("resize", refreshLayout, { passive: true });

  // Garante centros corretos após o carregamento das webfonts.
  if (document.fonts?.ready) {
    document.fonts.ready.then(refreshLayout);
  } else {
    window.addEventListener("load", refreshLayout, { once: true });
  }

  cacheCenters();
  setAllHidden();
})();
