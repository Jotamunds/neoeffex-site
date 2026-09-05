const SITE_CONFIG = {
  catalogSlug: "barbearia-exemplo",
  theme: { defaultPreset: "wine" }
};

const catalogUrl = `/catalogo/${SITE_CONFIG.catalogSlug}`;
document.querySelectorAll('.catalog-link, .nav-catalog').forEach((link) => { link.href = catalogUrl; });

const themes = ['wine', 'copper', 'cream', 'olive'];
const root = document.documentElement;
const savedTheme = localStorage.getItem('oficio13-theme');
function setTheme(theme) {
  const nextTheme = themes.includes(theme) ? theme : SITE_CONFIG.theme.defaultPreset;
  root.dataset.theme = nextTheme;
  document.querySelectorAll('.theme-option').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.theme === nextTheme)));
  localStorage.setItem('oficio13-theme', nextTheme);
}
setTheme(savedTheme || SITE_CONFIG.theme.defaultPreset);

const panel = document.querySelector('.theme-panel');
const trigger = document.querySelector('.theme-trigger');
const closePanel = () => { panel.hidden = true; trigger.setAttribute('aria-expanded', 'false'); trigger.focus(); };
trigger.addEventListener('click', () => { const open = panel.hidden; panel.hidden = !open; trigger.setAttribute('aria-expanded', String(open)); if (open) panel.querySelector('.theme-option').focus(); });
document.querySelector('.theme-close').addEventListener('click', closePanel);
document.querySelectorAll('.theme-option').forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.theme)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !panel.hidden) closePanel(); });

let currentReview = 0;
const reviews = [...document.querySelectorAll('.review-slide')];
function showReview(index) { currentReview = (index + reviews.length) % reviews.length; reviews.forEach((review, i) => { review.hidden = i !== currentReview; review.classList.toggle('is-active', i === currentReview); }); document.querySelector('[data-review-current]').textContent = String(currentReview + 1).padStart(2, '0'); }
document.querySelector('[data-review-prev]').addEventListener('click', () => showReview(currentReview - 1));
document.querySelector('[data-review-next]').addEventListener('click', () => showReview(currentReview + 1));

const menuButton = document.querySelector('.menu-toggle');
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!open)); document.body.classList.toggle('menu-open', !open); });
document.querySelectorAll('#menu a').forEach((link) => link.addEventListener('click', () => { menuButton.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); }));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = [...document.querySelectorAll('section[data-od-id], footer[data-od-id]')];

if (!reducedMotion && 'IntersectionObserver' in window) {
  document.body.classList.add('motion-ready');
  revealTargets.forEach((target) => target.classList.add('reveal-region'));
  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  revealTargets.forEach((target) => revealObserver.observe(target));
}
