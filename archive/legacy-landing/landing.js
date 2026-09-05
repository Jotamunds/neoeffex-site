/*
 * Neoeffex Landing v0.1.10
 *
 * Refinamentos do hero:
 * - reveal localizado com blur -> nitidez;
 * - profundidade sutil diferente entre os seis valores;
 * - micro-parallax do título;
 * - perturbação atmosférica irregular no mesmo requestAnimationFrame;
 * - sem física, Canvas, WebGL, Rive ou bibliotecas adicionais.
 */

(() => {
  const hero = document.querySelector(".hero");
  const title = document.querySelector(".hero__title");
  const values = Array.from(document.querySelectorAll(".hero__value"));
  const interactionField = document.querySelector(".hero__interaction-field");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!hero || values.length === 0) return;

  const MAX_OPACITY = 0.40;

  // Pequenas diferenças criam sensação de planos distintos sem mudar o layout.
  const VALUE_DEPTH = [
    { radiusScale: 0.94, blurMax: 2.8 },
    { radiusScale: 1.04, blurMax: 3.8 },
    { radiusScale: 0.98, blurMax: 3.2 },
    { radiusScale: 1.07, blurMax: 4.2 },
    { radiusScale: 0.91, blurMax: 3.5 },
    { radiusScale: 1.02, blurMax: 4.0 },
  ];

  let pointerPageX = 0;
  let pointerPageY = 0;
  let pointerActive = false;
  let activePointerType = "mouse";
  let framePending = false;

  let bounds = [];
  let heroOffsetX = 0;
  let heroOffsetY = 0;
  let heroWidth = 1;
  let heroHeight = 1;

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

  function getParallaxMax() {
    if (window.innerWidth <= 760) return 2.5;
    return 4.5;
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
    heroWidth = Math.max(heroRect.width, 1);
    heroHeight = Math.max(heroRect.height, 1);

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
    values.forEach((value, index) => {
      const profile = VALUE_DEPTH[index] || VALUE_DEPTH[0];
      value.style.setProperty("--value-opacity", "0");
      value.style.setProperty("--value-blur", `${profile.blurMax}px`);
    });
  }

  function hideInteractionField() {
    if (!interactionField) return;
    interactionField.style.setProperty("--field-opacity", "0");
  }

  function resetTitleParallax() {
    if (!title) return;
    title.style.setProperty("--title-parallax-x", "0px");
    title.style.setProperty("--title-parallax-y", "0px");
  }

  function updateTitleParallax(localX, localY) {
    if (!title || reducedMotion.matches || activePointerType === "touch") {
      resetTitleParallax();
      return;
    }

    const normalizedX = clamp((localX / heroWidth) * 2 - 1, -1, 1);
    const normalizedY = clamp((localY / heroHeight) * 2 - 1, -1, 1);
    const max = getParallaxMax();

    // Movimento levemente contrário ao ponteiro para aumentar a sensação de profundidade.
    title.style.setProperty("--title-parallax-x", `${(-normalizedX * max).toFixed(2)}px`);
    title.style.setProperty("--title-parallax-y", `${(-normalizedY * max * 0.72).toFixed(2)}px`);
  }

  function renderFrame() {
    framePending = false;

    if (!pointerActive) {
      setAllHidden();
      hideInteractionField();
      resetTitleParallax();
      return;
    }

    const localX = pointerPageX - heroOffsetX;
    const localY = pointerPageY - heroOffsetY;

    if (interactionField && !reducedMotion.matches) {
      interactionField.style.setProperty("--pointer-x", `${localX}px`);
      interactionField.style.setProperty("--pointer-y", `${localY}px`);
      interactionField.style.setProperty("--field-opacity", "1");
    }

    updateTitleParallax(localX, localY);

    const baseRadius = getRevealRadius();
    const innerRadius = getInnerRadius();

    values.forEach((value, index) => {
      const rect = bounds[index];
      const profile = VALUE_DEPTH[index] || VALUE_DEPTH[0];

      if (!rect) return;

      const radius = baseRadius * profile.radiusScale;
      const falloffRange = Math.max(radius - innerRadius, 1);
      const distance = distanceToRect(pointerPageX, pointerPageY, rect);

      const proximity = 1 - clamp(
        (distance - innerRadius) / falloffRange,
        0,
        1
      );

      const eased = smoothstep(proximity);
      const opacity = eased * MAX_OPACITY;
      const blur = (1 - eased) * profile.blurMax;

      value.style.setProperty("--value-opacity", opacity.toFixed(3));
      value.style.setProperty("--value-blur", `${blur.toFixed(2)}px`);
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

    if (pointerActive) {
      requestFrame();
    }
  }

  function handleReducedMotionChange() {
    if (reducedMotion.matches) {
      hideInteractionField();
      resetTitleParallax();
    }

    requestFrame();
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

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      hidePointerEffects();
    }
  });

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleReducedMotionChange);
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(refreshLayout);
  } else {
    window.addEventListener("load", refreshLayout, { once: true });
  }

  cacheLayout();
  setAllHidden();
  hideInteractionField();
  resetTitleParallax();
})();
