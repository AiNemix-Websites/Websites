document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --- SCROLL-BASED HEADER --- 
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE NAVIGATION --- 
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (menuToggle && mobileNav) {
        const toggleMenu = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !menuToggle.classList.contains('open');
            menuToggle.classList.toggle('open', open);
            menuToggle.setAttribute('aria-expanded', open);
            mobileNav.classList.toggle('open', open);
            body.classList.toggle('no-scroll', open);
        };

        menuToggle.addEventListener('click', () => toggleMenu());

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuToggle.classList.contains('open')) {
                toggleMenu(false);
            }
        });

        // Close on backdrop click (if we add one later)
        // mobileNav.addEventListener('click', (e) => {
        //     if (e.target === mobileNav) toggleMenu(false);
        // });
    }

    // --- SCROLL REVEAL ANIMATION --- 
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- FAQ ACCORDION --- 
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });
    }

    // --- COOKIE BANNER --- 
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookiesAccepted')) {
                cookieBanner.classList.add('visible');
            }
        }, 1000);

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- STICKY CTA --- 
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- CONTACT FORM --- 
    const contactForm = document.querySelector('.kontakt-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formWrapper = this.parentElement;
            formWrapper.innerHTML = `<div class='form-success'><h3>Vielen Dank!</h3><p>Ihre Nachricht wurde erfolgreich versendet. Wir werden uns in Kürze bei Ihnen melden.</p></div>`;
        });
    }
});