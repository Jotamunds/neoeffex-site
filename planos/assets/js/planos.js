/**
 * Neoeffex — Página de Planos (/planos/)
 * Versão: v0.1.2
 * Interações de base, navegação, observer reveal e apoio aos cards de planos
 */

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('ready');

  // Controle de scroll da barra de navegação
  const nav = document.querySelector('#navbar');
  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Menu mobile
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('#navLinks');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  // Ano dinâmico no rodapé
  const yearEl = document.querySelector('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Ativação suave das seções e elementos com reveal ao entrar no viewport
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-in-view');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll('.section').forEach(sec => sectionObserver.observe(sec));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px 60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('section-in-view'));
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }
});
