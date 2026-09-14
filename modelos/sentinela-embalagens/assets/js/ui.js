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

    const showcaseList = document.querySelector('.showcase-list');
    const dots = document.querySelectorAll('.showcase-dot');
    const showcaseItems = document.querySelectorAll('.showcase-item');

    if (showcaseList && dots.length > 0 && showcaseItems.length > 0) {
        let scrollRaf;
        const updateActiveDot = function () {
            const listLeft = showcaseList.getBoundingClientRect().left;
            const listCenter = listLeft + showcaseList.clientWidth / 2;
            let closestIndex = 0;
            let minDistance = Infinity;

            showcaseItems.forEach(function (item, index) {
                const rect = item.getBoundingClientRect();
                const itemCenter = rect.left + rect.width / 2;
                const distance = Math.abs(listCenter - itemCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            dots.forEach(function (dot, index) {
                dot.classList.toggle('is-active', index === closestIndex);
            });
        };

        showcaseList.addEventListener('scroll', function () {
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
            scrollRaf = requestAnimationFrame(updateActiveDot);
        }, { passive: true });

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                if (showcaseItems[index]) {
                    showcaseItems[index].scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest'
                    });
                }
            });
        });
    }
}());
