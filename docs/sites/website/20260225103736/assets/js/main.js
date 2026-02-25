document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav-drawer');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('is-active');
            mobileNav.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll');
        });

        // Close on backdrop click
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('is-open') && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('is-active');
                mobileNav.classList.remove('is-open');
                document.body.classList.remove('no-scroll');
            }
        });

        // Close with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                menuToggle.click();
            }
        });
    }

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('sticky-header');
            } else {
                header.classList.remove('sticky-header');
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const staggerChildren = entry.target.querySelectorAll('.stagger-children > *');
                staggerChildren.forEach((child, index) => {
                    child.style.setProperty('--stagger-index', index);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('show');
            }
        }, 2000);

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- FAQ Accordion --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // Close all other items
            // accordionItems.forEach(otherItem => {
            //     otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            //     otherItem.querySelector('.accordion-content').style.maxHeight = null;
            // });

            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
            } else {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

});