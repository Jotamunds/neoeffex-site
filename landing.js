/*
 * Neoeffex Landing v0.1.8
 *
 * Reveal de valores + interação local leve da atmosfera.
 *
 * Regras:
 * - palavras chegam no máximo a 40% de opacidade;
 * - fumaça mantém o movimento CSS independente;
 * - uma camada visual separada acompanha o ponteiro;
 * - nenhuma física, Canvas, WebGL, Rive ou biblioteca adicional;
 * - reveal e campo local são atualizados no mesmo requestAnimationFrame.
 */

(() => {
  const hero = document.querySelector(".hero");
  const values = Array.from(document.querySelectorAll(".hero__value"));
  const interactionField = document.querySelector(".hero__interaction-field");

  if (!hero || values.length === 0) return;

  const MAX_OPACITY = 0.40;

  let pointerX = 0;
  let pointerY = 0;
  let pointerActive = false;
  let activePointerType = "mouse";
  let framePending = false;
  let bounds = [];

  function getRevealRadius() {
    if (window.innerWidth <= 480) return 175;
    if (window.innerWidth <= 760) return 225;
    return 320;
  }

  function getInnerRadius() {
    if (window.innerWidth <= 480) return 28;
    if (window.innerWidth <= 760) return 38;
    return 52;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function smoothstep(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function cacheBounds() {
    bounds = values.map((value) => {
      const rect = value.getBoundingClientRect();

      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      };
    });
  }

  function distanceToRect(x, y, rect) {
    const nearestX = clamp(x, rect.left, rect.right);
    const nearestY = clamp(y, rect.top, rect.bottom);

    return Math.hypot(
      x - nearestX,
      y - nearestY
    );
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
      interactionField.style.setProperty("--pointer-x", `${pointerX}px`);
      interactionField.style.setProperty("--pointer-y", `${pointerY}px`);
      interactionField.style.setProperty("--field-opacity", "1");
    }

    const radius = getRevealRadius();
    const innerRadius = getInnerRadius();
    const falloffRange = Math.max(radius - innerRadius, 1);

    values.forEach((value, index) => {
      const rect = bounds[index];
      if (!rect) return;

      const distance = distanceToRect(pointerX, pointerY, rect);

      const proximity = 1 - clamp(
        (distance - innerRadius) / falloffRange,
        0,
        1
      );

      const opacity = smoothstep(proximity) * MAX_OPACITY;

      value.style.setProperty(
        "--value-opacity",
        opacity.toFixed(3)
      );
    });
  }

  function requestFrame() {
    if (framePending) return;

    framePending = true;
    requestAnimationFrame(renderFrame);
  }

  function updatePointer(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;
    activePointerType = event.pointerType || "mouse";
    pointerActive = true;
    requestFrame();
  }

  function hidePointerEffects() {
    pointerActive = false;
    requestFrame();
  }

  function refreshLayout() {
    cacheBounds();

    if (pointerActive) {
      requestFrame();
    }
  }

  hero.addEventListener("pointermove", updatePointer, { passive: true });
  hero.addEventListener("pointerdown", updatePointer, { passive: true });

  hero.addEventListener("pointerup", () => {
    if (activePointerType !== "mouse") {
      hidePointerEffects();
    }
  }, { passive: true });

  hero.addEventListener("pointerleave", hidePointerEffects);
  hero.addEventListener("pointercancel", hidePointerEffects);
  window.addEventListener("blur", hidePointerEffects);

  window.addEventListener("resize", refreshLayout, { passive: true });

  if (document.fonts?.ready) {
    document.fonts.ready.then(refreshLayout);
  } else {
    window.addEventListener("load", refreshLayout, { once: true });
  }

  cacheBounds();
  setAllHidden();
  hideInteractionField();
})();
