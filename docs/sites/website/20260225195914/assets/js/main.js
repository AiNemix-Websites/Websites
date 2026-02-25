document.addEventListener('DOMContentLoaded', () => {

    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const closeBtn = document.querySelector('.mobile-nav-close');
        const drawer = document.getElementById('mobile-nav');
        if (!toggleBtn || !drawer || !closeBtn) return;

        const openMenu = () => {
            drawer.classList.add('is-open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
            drawer.querySelector('a').focus();
        };

        const closeMenu = () => {
            drawer.classList.remove('is-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            toggleBtn.focus();
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
                closeMenu();
            }
        });
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => observer.observe(el));
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        if (!banner || !acceptBtn || !declineBtn) return;

        const consent = localStorage.getItem('cookie_consent');
        if (consent === null) {
            banner.style.display = 'block';
            setTimeout(() => banner.classList.add('show'), 100);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            banner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            banner.classList.remove('show');
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        const showThreshold = window.innerHeight * 0.75;

        window.addEventListener('scroll', () => {
            if (window.scrollY > showThreshold) {
                cta.classList.add('show');
            } else {
                cta.classList.remove('show');
            }
        });
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const triggers = document.querySelectorAll('.lightbox-trigger');
        const galleryImages = Array.from(triggers).map(t => t.src);
        let currentIndex = 0;

        const imgElement = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');

        const showImage = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentIndex = index;
            imgElement.src = galleryImages[index];
            prevBtn.style.display = (index === 0) ? 'none' : 'block';
            nextBtn.style.display = (index === galleryImages.length - 1) ? 'none' : 'block';
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('show');
            document.body.classList.add('no-scroll');
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('no-scroll');
        };

        triggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initCookieBanner();
    initStickyCTA();
    initLightbox();
});