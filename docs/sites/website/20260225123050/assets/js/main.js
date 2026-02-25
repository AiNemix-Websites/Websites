document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            toggleMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('open')) {
                toggleMenu();
            }
        });

        function toggleMenu() {
            mobileNavToggle.classList.toggle('open');
            mobileNavMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        }
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
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

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.classList.add('show');
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }
    
    // --- Sticky CTA Bar --- //
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    if (stickyCtaBar) {
        const showAt = 300; // Pixels from top to show the bar
        const hideAtFooter = document.querySelector('.site-footer');
        let footerOffset = hideAtFooter ? hideAtFooter.offsetTop : document.body.scrollHeight;
        
        window.addEventListener('scroll', () => {
            footerOffset = hideAtFooter ? hideAtFooter.offsetTop : document.body.scrollHeight;
            const scrollPosition = window.scrollY + window.innerHeight;

            if (window.scrollY > showAt && scrollPosition < footerOffset) {
                stickyCtaBar.classList.add('visible');
            } else {
                stickyCtaBar.classList.remove('visible');
            }
        });
    }

    // --- FAQ Accordion --- //
    const detailsElements = document.querySelectorAll('.faq-accordion details');
    detailsElements.forEach(details => {
        details.addEventListener('toggle', function() {
            if (this.open) {
                detailsElements.forEach(otherDetails => {
                    if (otherDetails !== this) {
                        otherDetails.removeAttribute('open');
                    }
                });
            }
        });
    });

});
