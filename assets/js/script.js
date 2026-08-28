    const loader = document.querySelector('#loader');
    const nav = document.querySelector('#navbar');
    const menuButton = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('#navLinks');
    const modal = document.querySelector('#contactModal');
    const closeModalButton = document.querySelector('.close-modal');
    const form = document.querySelector('#contactForm');
    const formStatus = document.querySelector('#formStatus');
    const submitButton = form.querySelector('button[type="submit"]');
    const submitLabel = submitButton.querySelector('span');
    let lastFocused = null;

    window.addEventListener('load', () => {
      window.setTimeout(() => {
        loader.classList.add('is-done');
        document.body.classList.add('ready');
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900);
    });

    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 24), { passive: true });

    menuButton.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    document.querySelectorAll('.reveal, .process-wrap').forEach(element => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-in-view');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.section:not(.hero)').forEach(section => sectionObserver.observe(section));

    const serviceGlow = document.createElement('span');
    serviceGlow.className = 'service-glow';
    serviceGlow.setAttribute('aria-hidden', 'true');
    let glowFrame = null;

    function moveServiceGlow(card, event) {
      const clientX = event.clientX;
      const clientY = event.clientY;
      if (glowFrame) cancelAnimationFrame(glowFrame);
      glowFrame = requestAnimationFrame(() => {
        if (serviceGlow.parentElement !== card) return;
        const rect = card.getBoundingClientRect();
        const x = clientX - rect.left - 85;
        const y = clientY - rect.top - 85;
        serviceGlow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    }

    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('pointerenter', event => {
        if (event.pointerType === 'touch') return;
        document.querySelector('.service-card.glow-active')?.classList.remove('glow-active');
        card.append(serviceGlow);
        moveServiceGlow(card, event);
        card.classList.add('glow-active');
      });
      card.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch') return;
        moveServiceGlow(card, event);
      });
      card.addEventListener('pointerleave', () => card.classList.remove('glow-active'));
    });

    document.querySelectorAll('.faq-question').forEach(button => button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    }));

    function openModal() {
      lastFocused = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      window.setTimeout(() => document.querySelector('#name').focus(), 100);
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastFocused) lastFocused.focus();
    }
    document.querySelectorAll('.open-contact').forEach(button => button.addEventListener('click', openModal));
    closeModalButton.addEventListener('click', closeModal);
    modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
      if (event.key === 'Tab' && modal.classList.contains('open')) {
        const focusable = [...modal.querySelectorAll('button, input, textarea')];
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });

    function showFormStatus(message, state) {
      formStatus.classList.remove('show');
      formStatus.textContent = message;
      formStatus.dataset.state = state;
      requestAnimationFrame(() => formStatus.classList.add('show'));
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.checkValidity()) {
        showFormStatus('Revise os campos obrigatórios para continuar.', 'error');
        form.reportValidity();
        return;
      }
      showFormStatus('Solicitação validada. Integre este formulário ao canal comercial para ativar o envio.', 'success');
      submitButton.classList.add('is-confirmed');
      submitLabel.textContent = 'Solicitação validada';
    });
    form.addEventListener('input', () => {
      if (!submitButton.classList.contains('is-confirmed')) return;
      submitButton.classList.remove('is-confirmed');
      submitLabel.textContent = 'Validar solicitação';
      formStatus.classList.remove('show');
    });
    document.querySelector('#year').textContent = new Date().getFullYear();
