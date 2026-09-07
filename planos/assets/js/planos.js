/**
 * Neoeffex — Página de Planos (/planos/)
 * Versão: v0.1.6
 * Etapa 7: Refinamento, responsividade e acessibilidade final
 */

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('ready');

  // --------------------------------------------------------------------------
  // Controle de scroll da barra de navegação
  // --------------------------------------------------------------------------
  const nav = document.querySelector('#navbar');
  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --------------------------------------------------------------------------
  // Menu mobile
  // --------------------------------------------------------------------------
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('#navLinks');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    navLinks.querySelectorAll('a, button').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  // --------------------------------------------------------------------------
  // Ano dinâmico no rodapé
  // --------------------------------------------------------------------------
  const yearEl = document.querySelector('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // Ativação suave das seções e elementos com reveal ao entrar no viewport
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // ETAPA 6: FAQ Accordion Acessível
  // --------------------------------------------------------------------------
  const faqAccordion = document.querySelector('#faq .faq-accordion');
  if (faqAccordion) {
    const triggers = faqAccordion.querySelectorAll('.faq-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        if (!item) return;
        const isCurrentlyOpen = item.classList.contains('open');
        const nextState = !isCurrentlyOpen;
        
        item.classList.toggle('open', nextState);
        trigger.setAttribute('aria-expanded', String(nextState));
      });
    });
  }

  // --------------------------------------------------------------------------
  // ETAPA 5: Modal e Fluxo de Solicitação de Orçamento
  // --------------------------------------------------------------------------
  const modal = document.querySelector('#quoteModal');
  if (!modal) return;

  const closeBtn = document.querySelector('#closeQuoteModal');
  const form = document.querySelector('#quoteForm');
  const successState = document.querySelector('#modalSuccessState');
  const successCloseBtn = document.querySelector('#successCloseBtn');
  const submitBtn = document.querySelector('#quoteSubmitBtn');
  const submitLabel = document.querySelector('#quoteSubmitLabel');
  const formStatus = document.querySelector('#quoteFormStatus');

  const nameInput = document.querySelector('#quoteName');
  const companyInput = document.querySelector('#quoteCompany');
  const emailInput = document.querySelector('#quoteEmail');
  const phoneInput = document.querySelector('#quotePhone');
  const planSelect = document.querySelector('#quotePlan');
  const maintenanceSelect = document.querySelector('#quoteMaintenance');
  const briefTextarea = document.querySelector('#quoteBrief');
  const subjectInput = document.querySelector('#quoteSubject');

  let lastFocusedElement = null;
  let isSubmittingForm = false;

  // Mapeamento de Planos de Implantação
  const IMPLEMENTATION_PLANS_MAP = {
    landing: 'Landing Page',
    institucional: 'Site Institucional',
    catalogo: 'Site + Catálogo Neoeffex',
    personalizado: 'Totalmente Personalizado'
  };

  // Mapeamento de Planos Mensais
  const MAINTENANCE_PLANS_MAP = {
    infraestrutura: 'Infraestrutura + Segurança',
    cuidado: 'Cuidado',
    evolucao: 'Evolução'
  };

  // Limpeza de erros por campo
  function clearFieldError(fieldInput) {
    if (!fieldInput) return;
    const container = fieldInput.closest('.field');
    if (!container) return;
    container.classList.remove('has-error');
    fieldInput.removeAttribute('aria-invalid');
    const errorMsgEl = container.querySelector('.field-error-msg');
    if (errorMsgEl) errorMsgEl.textContent = '';
  }

  function setFieldError(fieldInput, message) {
    if (!fieldInput) return;
    const container = fieldInput.closest('.field');
    if (!container) return;
    container.classList.add('has-error');
    fieldInput.setAttribute('aria-invalid', 'true');
    const errorMsgEl = container.querySelector('.field-error-msg');
    if (errorMsgEl) errorMsgEl.textContent = message;
  }

  function clearAllErrors() {
    [nameInput, companyInput, emailInput, phoneInput, planSelect, briefTextarea].forEach(input => {
      clearFieldError(input);
    });
    if (formStatus) {
      formStatus.classList.remove('show');
      formStatus.replaceChildren();
    }
  }

  // Formatação amigável de telefone brasileiro (DDD + 8 ou 9 dígitos)
  function formatPhoneBR(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits.length) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = formatPhoneBR(phoneInput.value);
      clearFieldError(phoneInput);
      if (formStatus) formStatus.classList.remove('show');
    });
  }

  // Limpar erro imediatamente ao digitar ou alterar campo
  [nameInput, companyInput, emailInput, planSelect, briefTextarea].forEach(el => {
    if (el) {
      el.addEventListener('input', () => {
        clearFieldError(el);
        if (formStatus) formStatus.classList.remove('show');
      });
      el.addEventListener('change', () => {
        clearFieldError(el);
        if (formStatus) formStatus.classList.remove('show');
      });
    }
  });

  // Abertura do Modal com Pré-seleção inteligente
  function openModal(options = {}) {
    const { planKey = null, maintenanceKey = null } = options;
    lastFocusedElement = document.activeElement;

    // Reseta visibilidade da view interna
    if (form) form.hidden = false;
    if (successState) successState.hidden = true;
    clearAllErrors();

    // Aplica pré-seleção conforme o gatilho acionado
    if (planKey && IMPLEMENTATION_PLANS_MAP[planKey]) {
      planSelect.value = IMPLEMENTATION_PLANS_MAP[planKey];
      maintenanceSelect.value = 'Quero conversar primeiro';
    } else if (maintenanceKey && MAINTENANCE_PLANS_MAP[maintenanceKey]) {
      maintenanceSelect.value = MAINTENANCE_PLANS_MAP[maintenanceKey];
      planSelect.value = ''; // Mantém sem escolha forçada de implantação
    } else {
      // CTA genérico ("Solicitar orçamento")
      planSelect.value = '';
      maintenanceSelect.value = 'Quero conversar primeiro';
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    window.setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 100);
  }

  // Fechamento do Modal com restauração de foco e scroll
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  // Fechamento seguro por clique no backdrop (previne clique arrastado de dentro para fora)
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

  // Fechamento por botão e acessibilidade de teclado
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
    if (event.key === 'Tab' && modal.classList.contains('open')) {
      const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href]:not([tabindex="-1"])')]
        .filter(el => !el.hidden && el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!modal.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Gatilhos dos cards de Implantação
  document.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', event => {
      event.preventDefault();
      const planKey = btn.getAttribute('data-plan');
      openModal({ planKey });
    });
  });

  // Gatilhos dos cards de Manutenção
  document.querySelectorAll('[data-maintenance]').forEach(btn => {
    btn.addEventListener('click', event => {
      event.preventDefault();
      const maintenanceKey = btn.getAttribute('data-maintenance');
      openModal({ maintenanceKey });
    });
  });

  // Gatilhos genéricos ("Solicitar orçamento")
  document.querySelectorAll('.open-quote-modal').forEach(btn => {
    btn.addEventListener('click', event => {
      event.preventDefault();
      openModal();
    });
  });

  // Exibição de mensagens de status
  function showFormStatus(message, state) {
    if (!formStatus) return;
    formStatus.classList.remove('show');
    formStatus.replaceChildren();
    formStatus.textContent = message;
    formStatus.dataset.state = state;
    requestAnimationFrame(() => formStatus.classList.add('show'));
  }

  function renderErrorStatusWithWhatsapp(text) {
    if (!formStatus) return;
    formStatus.classList.remove('show');
    formStatus.replaceChildren();
    formStatus.dataset.state = 'error';

    const messageSpan = document.createElement('span');
    messageSpan.textContent = text + ' ';

    const whatsappLink = document.createElement('a');
    whatsappLink.href = 'https://wa.me/5511997763958?text=Ol%C3%A1%2C%20tentei%20enviar%20uma%20solicita%C3%A7%C3%A3o%20de%20or%C3%A7amento%20pela%20p%C3%A1gina%20de%20planos%20e%20gostaria%20de%20conversar.';
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    whatsappLink.className = 'form-fallback-whatsapp';
    whatsappLink.textContent = 'Conversar pelo WhatsApp';

    formStatus.appendChild(messageSpan);
    formStatus.appendChild(whatsappLink);
    requestAnimationFrame(() => formStatus.classList.add('show'));
  }

  // Validação amigável campo a campo (sem alert nativo)
  function validateQuoteForm() {
    clearAllErrors();
    let isValid = true;
    let firstInvalidField = null;

    // 1. Nome
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
      setFieldError(nameInput, 'Informe seu nome.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = nameInput;
    } else if (nameVal.length < 2) {
      setFieldError(nameInput, 'Informe como podemos chamar você.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = nameInput;
    }

    // 2. Empresa ou Marca
    const compVal = companyInput ? companyInput.value.trim() : '';
    if (!compVal) {
      setFieldError(companyInput, 'Informe o nome da sua empresa, marca ou projeto.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = companyInput;
    }

    // 3. E-mail
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      setFieldError(emailInput, 'Informe seu e-mail.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = emailInput;
    } else if (!emailRegex.test(emailVal)) {
      setFieldError(emailInput, 'Informe um endereço de e-mail válido (ex: contato@suaempresa.com.br).');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = emailInput;
    }

    // 4. Telefone / WhatsApp
    const phoneDigits = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
    if (!phoneDigits) {
      setFieldError(phoneInput, 'Informe seu telefone ou WhatsApp com DDD.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = phoneInput;
    } else if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      setFieldError(phoneInput, 'Informe um número com DDD (10 ou 11 dígitos).');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = phoneInput;
    }

    // 5. Plano Desejado
    const planVal = planSelect ? planSelect.value : '';
    if (!planVal) {
      setFieldError(planSelect, 'Selecione um plano ou escolha "Ainda não sei qual plano escolher".');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = planSelect;
    }

    // 6. Descrição do Projeto
    const briefVal = briefTextarea ? briefTextarea.value.trim() : '';
    if (!briefVal) {
      setFieldError(briefTextarea, 'Conte um pouco sobre sua empresa e o que você precisa.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = briefTextarea;
    }

    if (!isValid && firstInvalidField) {
      firstInvalidField.focus();
    }

    return isValid;
  }

  // Envio do formulário via FormSubmit com proteção contra duplo envio
  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (isSubmittingForm) return;

      if (!validateQuoteForm()) {
        showFormStatus('Por favor, revise os campos destacados abaixo para continuar.', 'error');
        return;
      }

      isSubmittingForm = true;
      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = 'Enviando...';
      if (formStatus) formStatus.classList.remove('show');

      // Assunto customizado informativo
      if (subjectInput && nameInput && planSelect) {
        subjectInput.value = `Solicitação de Orçamento - /planos/ - ${nameInput.value.trim()} (${planSelect.value})`;
      }

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 12000);

      try {
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        const response = await fetch('https://formsubmit.co/ajax/joaogabrielvs2022@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
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
          // Transição para tela de confirmação (sem linguagem de compra)
          form.hidden = true;
          if (successState) successState.hidden = false;
          form.reset();
          clearAllErrors();
          window.setTimeout(() => {
            const successTitle = document.querySelector('#successTitle');
            if (successTitle) successTitle.focus();
            else if (successCloseBtn) successCloseBtn.focus();
          }, 100);
        } else {
          throw new Error('Serviço de envio não aceitou a requisição');
        }
      } catch (error) {
        window.clearTimeout(timeoutId);
        console.error('Falha no envio da solicitação de orçamento:', error);
        const isTimeout = error.name === 'AbortError';
        const errorText = isTimeout
          ? 'O envio demorou mais que o esperado. Seus dados continuam preenchidos. Tente novamente ou converse direto conosco:'
          : 'Não foi possível concluir o envio agora. Seus dados continuam preenchidos. Tente novamente ou use o WhatsApp:';

        renderErrorStatusWithWhatsapp(errorText);
      } finally {
        isSubmittingForm = false;
        if (submitBtn) submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = 'Enviar solicitação';
      }
    });
  }
});

