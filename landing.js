(() => {
  const header = document.querySelector('.site-header');
  const revealItems = document.querySelectorAll('.reveal');
  const year = document.getElementById('current-year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      activeObserver.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.08,
  });

  revealItems.forEach((item) => observer.observe(item));
})();
