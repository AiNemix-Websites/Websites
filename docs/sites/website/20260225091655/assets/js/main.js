document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                header.classList.toggle('scrolled', window.scrollY > 0);
            });
        });
        // Dummy element to observe for initial load
        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.top = '1px';
        document.body.prepend(sentinel);
        scrollObserver.observe(sentinel);
        window.addEventListener('scroll', () => {
             header.classList.toggle('scrolled', window.scrollY > 0);
        }, { passive: true });
    }

    // --- 2. Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.querySelector('#mobile-nav-drawer');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    const openDrawer = () => {
        mobileNavDrawer.style.display = 'block';
        setTimeout(() => {
            mobileNavDrawer.classList.add('open');
            document.body.classList.add('no-scroll');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        }, 10);
    };

    const closeDrawer = () => {
        mobileNavDrawer.classList.remove('open');
        document.body.classList.remove('no-scroll');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        setTimeout(() => {
            mobileNavDrawer.style.display = 'none';
        }, 300); // Match CSS transition duration
    };

    if (mobileNavToggle && mobileNavDrawer) {
        mobileNavToggle.addEventListener('click', openDrawer);
        mobileNavClose.addEventListener('click', closeDrawer);
        
        // Close on backdrop click
        document.addEventListener('click', (e) => {
            if (mobileNavDrawer.classList.contains('open') && !mobileNavDrawer.contains(e.target) && e.target !== mobileNavToggle) {
                closeDrawer();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
                closeDrawer();
            }
        });
    }

    // --- 3. Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger effect
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100); 
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- 4. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1500);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- 5. Smooth Scroll for Anchor Links --- //
    document.querySelectorAll('a[href^=\'#\']').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- 6. Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero section is NOT intersecting (i.e., scrolled past it)
                stickyCta.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});