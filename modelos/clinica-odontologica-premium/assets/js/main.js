const SITE_CONFIG = {
  catalogSlug: 'clinica-odontologica-premium',
  brandName: 'Auréa Odontologia',
  appointmentLabel: 'Agendar avaliação'
};

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const dialog = document.querySelector('[data-schedule-dialog]');
const scheduleForm = document.querySelector('[data-schedule-form]');
const feedback = document.querySelector('[data-form-feedback]');
const treatmentSelect = scheduleForm.querySelector('[name="treatment"]');

const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 28);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.classList.toggle('is-open', !isOpen);
  mobileNav.hidden = isOpen;
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.classList.remove('is-open');
  mobileNav.hidden = true;
}));

document.querySelectorAll('[data-open-schedule]').forEach((button) => {
  button.addEventListener('click', () => {
    const treatment = button.dataset.treatment;
    if (treatment) treatmentSelect.value = treatment;
    feedback.textContent = '';
    dialog.showModal();
    scheduleForm.elements.name.focus();
  });
});

document.querySelector('[data-close-schedule]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

scheduleForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!scheduleForm.checkValidity()) {
    scheduleForm.reportValidity();
    return;
  }
  const name = scheduleForm.elements.name.value.trim();
  feedback.textContent = `${name}, recebemos sua solicitação. Nossa equipe entrará em contato.`;
  scheduleForm.reset();
});

const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealed = document.querySelectorAll('.reveal');
if (motionAllowed && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: .12 });
  revealed.forEach((item) => observer.observe(item));
} else {
  revealed.forEach((item) => item.classList.add('is-visible'));
}

const parallax = document.querySelector('[data-parallax]');
if (motionAllowed && parallax) {
  window.addEventListener('scroll', () => {
    const offset = Math.min(window.scrollY * -.025, 18);
    parallax.style.setProperty('--parallax-y', `${offset}px`);
  }, { passive: true });
}
