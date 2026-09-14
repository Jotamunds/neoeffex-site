(function () {
    'use strict';

    const nav = document.querySelector('.topnav');
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('.topnav nav a');
    const form = document.querySelector('.footer-form');
    const feedback = document.querySelector('.form-note');

    if (nav && toggle) {
        toggle.addEventListener('click', function () {
            const isOpen = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Abrir menu');
            });
        });
    }

    if (form && feedback) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = form.elements.email;

            if (!email.validity.valid) {
                feedback.textContent = 'Informe um e-mail corporativo válido para continuar.';
                email.focus();
                return;
            }

            feedback.textContent = 'Recebemos seu contato. Nossa equipe retornará em breve.';
            form.reset();
        });
    }
}());
