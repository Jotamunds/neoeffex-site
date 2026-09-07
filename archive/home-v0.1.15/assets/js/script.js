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

    function dismissLoader() {
      if (!loader || loader.classList.contains('is-done')) return;
      loader.classList.add('is-done');
      document.body.classList.add('ready');
    }

    if (document.readyState === 'complete') {
      dismissLoader();
    } else {
      const motionReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.addEventListener('DOMContentLoaded', () => {
        window.setTimeout(dismissLoader, motionReduce ? 0 : 120);
      }, { once: true });
      window.addEventListener('load', dismissLoader, { once: true });
      window.setTimeout(dismissLoader, 1500);
    }

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

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal, .process-wrap').forEach(element => element.classList.add('in-view'));
      document.querySelectorAll('.section:not(.hero)').forEach(section => section.classList.add('section-in-view'));
    } else {
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
    }

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

    function trackEvent(eventName, params) {
      try {
        if (typeof window.gtag === 'function') {
          window.gtag('event', eventName, params);
        } else if (Array.isArray(window.dataLayer)) {
          window.dataLayer.push(Object.assign({ event: eventName }, params));
        }
      } catch (_) {}
    }

    function openModal() {
      trackEvent('contact_form_open', { trigger: 'modal' });
      lastFocused = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      window.setTimeout(() => {
        const nameField = document.querySelector('#name');
        if (nameField) nameField.focus();
      }, 100);
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    document.querySelectorAll('.open-contact').forEach(button => button.addEventListener('click', openModal));
    closeModalButton.addEventListener('click', closeModal);

    function dismissOnBackdropPointer(dialog, closeFn) {
      let startedOnBackdrop = false;
      dialog.addEventListener('pointerdown', event => {
        startedOnBackdrop = event.button === 0 && event.target === dialog;
      });
      dialog.addEventListener('pointerup', event => {
        const shouldClose = startedOnBackdrop && event.button === 0 && event.target === dialog;
        startedOnBackdrop = false;
        if (shouldClose) closeFn();
      });
      dialog.addEventListener('pointercancel', () => {
        startedOnBackdrop = false;
      });
    }
    dismissOnBackdropPointer(modal, closeModal);

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
      if (event.key === 'Tab' && modal.classList.contains('open')) {
        const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href]:not([tabindex="-1"])')]
          .filter(el => !el.hidden && el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    function showFormStatus(message, state) {
      formStatus.classList.remove('show');
      formStatus.replaceChildren();
      formStatus.textContent = message;
      formStatus.dataset.state = state;
      requestAnimationFrame(() => formStatus.classList.add('show'));
    }

    function renderErrorStatusWithWhatsapp(text) {
      formStatus.classList.remove('show');
      formStatus.replaceChildren();
      formStatus.dataset.state = 'error';

      const messageSpan = document.createElement('span');
      messageSpan.textContent = text + ' ';

      const whatsappLink = document.createElement('a');
      whatsappLink.href = 'https://wa.me/5511997763958?text=Ol%C3%A1%2C%20tentei%20enviar%20uma%20mensagem%20pelo%20site%20da%20Neoeffex%20e%20gostaria%20de%20conversar%20sobre%20meu%20projeto.';
      whatsappLink.target = '_blank';
      whatsappLink.rel = 'noopener noreferrer';
      whatsappLink.className = 'form-fallback-whatsapp';
      whatsappLink.textContent = 'Conversar pelo WhatsApp';

      formStatus.appendChild(messageSpan);
      formStatus.appendChild(whatsappLink);
      requestAnimationFrame(() => formStatus.classList.add('show'));
    }

    let isSubmittingForm = false;

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (isSubmittingForm) return;

      if (!form.checkValidity()) {
        showFormStatus('Revise os campos obrigatórios para continuar.', 'error');
        form.reportValidity();
        return;
      }

      isSubmittingForm = true;
      submitButton.disabled = true;
      submitLabel.textContent = 'Enviando...';

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 12000);

      try {
        const formData = new FormData(form);
        const response = await fetch('https://formsubmit.co/ajax/joaogabrielvs2022@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(Object.fromEntries(formData)),
          signal: controller.signal
        });

        window.clearTimeout(timeoutId);

        let result = null;
        try {
          result = await response.json();
        } catch (_) {
          result = null;
        }

        const isAccepted = response.ok && (
          !result || result.success === 'true' || result.success === true || Boolean(result.message)
        );

        if (isAccepted) {
          trackEvent('contact_request_accepted', { status: 200 });
          showFormStatus('Solicitação recebida com sucesso! Em breve entraremos em contato.', 'success');
          submitButton.classList.add('is-confirmed');
          submitLabel.textContent = 'Solicitação enviada';
          form.reset();
        } else {
          throw new Error('Serviço de envio não aceitou a solicitação');
        }
      } catch (error) {
        window.clearTimeout(timeoutId);
        console.error('Falha no envio do formulário de contato:', error);
        const isTimeout = error.name === 'AbortError';
        const errorText = isTimeout
          ? 'O envio demorou mais que o esperado. Seus dados continuam preenchidos. Tente novamente ou converse direto conosco:'
          : 'Não foi possível concluir o envio agora. Seus dados continuam preenchidos. Tente novamente ou use o WhatsApp:';

        renderErrorStatusWithWhatsapp(errorText);
        submitLabel.textContent = 'Enviar solicitação';
        submitButton.disabled = false;
      } finally {
        isSubmittingForm = false;
      }
    });

    form.addEventListener('input', () => {
      if (!submitButton.classList.contains('is-confirmed')) return;
      submitButton.classList.remove('is-confirmed');
      submitLabel.textContent = 'Enviar solicitação';
      submitButton.disabled = false;
      formStatus.classList.remove('show');
    });

    document.querySelectorAll('.btn-interact').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const card = button.closest('.project-card');
        card.classList.add('is-active');
      });
    });
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-active');
      });
    });

    const fabWhatsapp = document.querySelector('.fab-whatsapp');
    if (fabWhatsapp) {
      fabWhatsapp.addEventListener('click', () => {
        trackEvent('whatsapp_click', { location: 'fab' });
      });
    }

    const catalogCta = document.querySelector('a[href*="catalogo/"]');
    if (catalogCta) {
      catalogCta.addEventListener('click', () => {
        trackEvent('click_catalog_cta', { target: 'catalogo_demo' });
      });
    }

    document.querySelector('#year').textContent = new Date().getFullYear();
