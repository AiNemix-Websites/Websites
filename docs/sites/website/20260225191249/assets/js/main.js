document.addEventListener('DOMContentLoaded', () => {

    const App = {
        init() {
            this.initStickyHeader();
            this.initMobileNav();
            this.initScrollReveal();
            this.initFaqAccordion();
            this.initCookieBanner();
            this.initStickyCTA();
            this.initContactForm();
        },

        initStickyHeader() {
            const header = document.getElementById('site-header');
            if (!header) return;

            const observer = new IntersectionObserver(([entry]) => {
                header.classList.toggle('scrolled', !entry.isIntersecting);
            }, { rootMargin: '200px 0px 0px 0px' });

            observer.observe(document.body);
        },

        initMobileNav() {
            const toggleBtn = document.getElementById('mobile-nav-toggle');
            const closeBtn = document.getElementById('mobile-nav-close');
            const drawer = document.getElementById('mobile-nav-drawer');

            if (!toggleBtn || !drawer || !closeBtn) return;

            const openDrawer = () => {
                drawer.classList.add('is-open');
                drawer.setAttribute('aria-hidden', 'false');
                toggleBtn.setAttribute('aria-expanded', 'true');
                document.body.classList.add('scroll-locked');
            };

            const closeDrawer = () => {
                drawer.classList.remove('is-open');
                drawer.setAttribute('aria-hidden', 'true');
                toggleBtn.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('scroll-locked');
            };

            toggleBtn.addEventListener('click', openDrawer);
            closeBtn.addEventListener('click', closeDrawer);
            
            drawer.addEventListener('click', (e) => {
                if (e.target === drawer) {
                    closeDrawer();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
                    closeDrawer();
                }
            });
        },

        initScrollReveal() {
            const revealElements = document.querySelectorAll('.reveal-up');
            if (revealElements.length === 0) return;

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
        },

        initFaqAccordion() {
            const accordion = document.getElementById('faq-accordion');
            if (!accordion) return;

            accordion.addEventListener('click', (e) => {
                const question = e.target.closest('.faq-question');
                if (question) {
                    const item = question.parentElement;
                    const answer = document.getElementById(question.getAttribute('aria-controls'));
                    const isExpanded = question.getAttribute('aria-expanded') === 'true';

                    question.setAttribute('aria-expanded', !isExpanded);
                    answer.hidden = isExpanded;
                }
            });
        },

        initCookieBanner() {
            const banner = document.getElementById('cookie-banner');
            const acceptBtn = document.getElementById('cookie-accept');

            if (!banner || !acceptBtn) return;

            const consent = localStorage.getItem('cookieConsent');
            if (!consent) {
                banner.hidden = false;
            }

            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'true');
                banner.hidden = true;
            });
        },

        initStickyCTA() {
            const cta = document.getElementById('sticky-cta');
            const closeBtn = document.getElementById('sticky-cta-close');
            if (!cta || !closeBtn) return;

            let isShown = false;
            window.addEventListener('scroll', () => {
                if (window.scrollY > window.innerHeight * 0.5 && !isShown) {
                    cta.hidden = false;
                    isShown = true;
                }
            });

            closeBtn.addEventListener('click', () => {
                cta.hidden = true;
            });
        },

        initContactForm() {
            const form = document.getElementById('contact-form');
            const statusEl = document.getElementById('form-status');
            if (!form || !statusEl) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                statusEl.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet...';
                
                // Simulate form submission
                setTimeout(() => {
                    statusEl.textContent = 'Nachricht erfolgreich gesendet!';
                    form.reset();
                }, 1000);
            });
        }
    };

    App.init();
});