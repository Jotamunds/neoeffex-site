/*
 * Neoeffex Landing v0.1.9
 *
 * Refinamento da interação:
 * - raio do reveal dos valores reduzido;
 * - coordenadas do ponteiro independentes da posição do hero na viewport;
 * - fumaça e campo visual mantêm o comportamento aprovado.
 */

(() => {
  const hero = document.querySelector(".hero");
  const values = Array.from(document.querySelectorAll(".hero__value"));
  const interactionField = document.querySelector(".hero__interaction-field");

  if (!hero || values.length === 0) return;

  const MAX_OPACITY = 0.40;

  let pointerPageX = 0;
  let pointerPageY = 0;
  let pointerActive = false;
  let activePointerType = "mouse";
  let framePending = false;
  let bounds = [];
  let heroOffsetX = 0;
  let heroOffsetY = 0;

  function getRevealRadius() {
    if (window.innerWidth <= 480) return 125;
    if (window.innerWidth <= 760) return 165;
    return 220;
  }

  function getInnerRadius() {
    if (window.innerWidth <= 480) return 22;
    if (window.innerWidth <= 760) return 28;
    return 34;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function smoothstep(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function cacheLayout() {
    const heroRect = hero.getBoundingClientRect();

    heroOffsetX = heroRect.left + window.scrollX;
    heroOffsetY = heroRect.top + window.scrollY;

    bounds = values.map((value) => {
      const rect = value.getBoundingClientRect();

      return {
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX,
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
      };
    });
  }

  function distanceToRect(x, y, rect) {
    const nearestX = clamp(x, rect.left, rect.right);
    const nearestY = clamp(y, rect.top, rect.bottom);

    return Math.hypot(x - nearestX, y - nearestY);
  }

  function setAllHidden() {
    values.forEach((value) => {
      value.style.setProperty("--value-opacity", "0");
    });
  }

  function hideInteractionField() {
    if (!interactionField) return;
    interactionField.style.setProperty("--field-opacity", "0");
  }

  function renderFrame() {
    framePending = false;

    if (!pointerActive) {
      setAllHidden();
      hideInteractionField();
      return;
    }

    if (interactionField) {
      interactionField.style.setProperty("--pointer-x", `${pointerPageX - heroOffsetX}px`);
      interactionField.style.setProperty("--pointer-y", `${pointerPageY - heroOffsetY}px`);
      interactionField.style.setProperty("--field-opacity", "1");
    }

    const radius = getRevealRadius();
    const innerRadius = getInnerRadius();
    const falloffRange = Math.max(radius - innerRadius, 1);

    values.forEach((value, index) => {
      const rect = bounds[index];
      if (!rect) return;

      const distance = distanceToRect(pointerPageX, pointerPageY, rect);
      const proximity = 1 - clamp(
        (distance - innerRadius) / falloffRange,
        0,
        1
      );

      const opacity = smoothstep(proximity) * MAX_OPACITY;
      value.style.setProperty("--value-opacity", opacity.toFixed(3));
    });
  }

  function requestFrame() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(renderFrame);
  }

  function updatePointer(event) {
    pointerPageX = event.pageX;
    pointerPageY = event.pageY;
    activePointerType = event.pointerType || "mouse";
    pointerActive = true;
    requestFrame();
  }

  function hidePointerEffects() {
    pointerActive = false;
    requestFrame();
  }

  function refreshLayout() {
    cacheLayout();
    if (pointerActive) requestFrame();
  }

  hero.addEventListener("pointermove", updatePointer, { passive: true });
  hero.addEventListener("pointerdown", updatePointer, { passive: true });

  hero.addEventListener("pointerup", () => {
    if (activePointerType !== "mouse") hidePointerEffects();
  }, { passive: true });

  hero.addEventListener("pointerleave", hidePointerEffects);
  hero.addEventListener("pointercancel", hidePointerEffects);

  window.addEventListener("blur", hidePointerEffects);
  window.addEventListener("resize", refreshLayout, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hidePointerEffects();
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(refreshLayout);
  } else {
    window.addEventListener("load", refreshLayout, { once: true });
  }

  cacheLayout();
  setAllHidden();
  hideInteractionField();
})();
