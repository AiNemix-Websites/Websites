document.addEventListener('DOMContentLoaded', () => {

    const initMobileNav = () => {
        const navToggle = document.querySelector('.mobile-nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (!navToggle || !navLinks) return;

        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navLinks.classList.toggle('open');
            document.body.classList.toggle('no-scroll', !isOpen);
        });
    };

    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        const declineBtn = document.getElementById('decline-cookies');

        if (!banner || !acceptBtn || !declineBtn) return;

        const cookieStatus = localStorage.getItem('cookie_status');
        if (!cookieStatus) {
            banner.hidden = false;
            setTimeout(() => banner.classList.add('show'), 100);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_status', 'accepted');
            banner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_status', 'declined');
            banner.classList.remove('show');
        });
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const contentImg = lightbox.querySelector('.km-lightbox-content img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let galleryItems = [];
        let currentIndex = 0;

        const updateImage = () => {
            const item = galleryItems[currentIndex];
            const imagePath = item.dataset.kmImage.startsWith('../') 
                ? item.dataset.kmImage 
                : (location.pathname.includes('/leistungen/') || location.pathname.includes('/ueber-uns/') || location.pathname.includes('/kontakt/')) 
                ? `../${item.dataset.kmImage}` 
                : item.dataset.kmImage;
            contentImg.src = imagePath;
            contentImg.alt = item.alt;
        };

        const showLightbox = (index) => {
            currentIndex = index;
            updateImage();
            lightbox.hidden = false;
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const hideLightbox = () => {
            lightbox.hidden = true;
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateImage();
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') hideLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };

        document.addEventListener('click', (e) => {
            if (e.target.matches('.gallery-item')) {
                galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
                const index = galleryItems.indexOf(e.target);
                showLightbox(index);
            }
        });

        closeBtn.addEventListener('click', hideLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                hideLightbox();
            }
        });
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initCookieBanner();
    initLightbox();
});