/*
 * Neoeffex Landing v0.1.5
 *
 * Reveal de palavras por proximidade do ponteiro.
 *
 * Regras:
 * - a atmosfera da v0.1.4 não é alterada;
 * - palavras começam 100% transparentes;
 * - cada palavra reage individualmente;
 * - opacidade máxima: 0.60;
 * - cálculo limitado a no máximo 1 atualização por frame;
 * - funciona com mouse, caneta e toque via Pointer Events;
 * - nenhuma física, Canvas, WebGL ou biblioteca externa.
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

  function getRevealRadius() {
    if (window.innerWidth <= 480) return 170;
    if (window.innerWidth <= 760) return 210;
    return 280;
  }

  function getInnerRadius() {
    if (window.innerWidth <= 760) return 42;
    return 64;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
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

    values.forEach((value) => {
      const rect = value.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.hypot(
        pointerX - centerX,
        pointerY - centerY
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

  window.addEventListener("resize", () => {
    if (pointerActive) requestRevealFrame();
  }, { passive: true });

  setAllHidden();
})();
