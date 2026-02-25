document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- //
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    const body = document.body;

    const openMobileMenu = () => {
        body.classList.add('mobile-nav-open');
        body.classList.add('scroll-locked');
        mobileNavDrawer.setAttribute('aria-hidden', 'false');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuClose.focus();
    };

    const closeMobileMenu = () => {
        body.classList.remove('mobile-nav-open');
        body.classList.remove('scroll-locked');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.focus();
    };

    if (mobileMenuToggle && mobileNavDrawer && mobileMenuClose) {
        mobileMenuToggle.addEventListener('click', openMobileMenu);
        mobileMenuClose.addEventListener('click', closeMobileMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && body.classList.contains('mobile-nav-open')) {
                closeMobileMenu();
            }
        });

        mobileNavDrawer.addEventListener('click', (e) => {
            if (e.target === mobileNavDrawer) {
                closeMobileMenu();
            }
        });
    }

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Back to Top & Sticky CTA --- //
    const backToTopButton = document.getElementById('back-to-top');
    const stickyCta = document.getElementById('sticky-cta');

    if (backToTopButton || stickyCta) {
        const handleScrollVisibility = () => {
            const shouldBeVisible = window.scrollY > 300;
            if (backToTopButton) backToTopButton.classList.toggle('visible', shouldBeVisible);
            if (stickyCta) stickyCta.classList.toggle('visible', shouldBeVisible);
        };

        window.addEventListener('scroll', handleScrollVisibility, { passive: true });
        if(backToTopButton) {
            backToTopButton.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        handleScrollVisibility(); // Initial check
    }

    // --- Lightbox (Structure Only, no trigger elements) --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
        };

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
                closeLightbox();
            }
        });
    }
});