document.addEventListener('DOMContentLoaded', function() {

    // --- PREFERS REDUCED MOTION CHECK ---
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', () => {
        prefersReducedMotion = motionQuery.matches;
    });

    // --- STICKY HEADER ---
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE MENU ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeButton = document.querySelector('.mobile-menu-close');

    function openMenu() {
        if (!mobileMenu || !menuToggle) return;
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.style.display = 'flex';
        setTimeout(() => mobileMenu.classList.add('open'), 10);
        document.body.classList.add('scroll-locked');
    }

    function closeMenu() {
        if (!mobileMenu || !menuToggle) return;
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        setTimeout(() => { mobileMenu.style.display = 'none'; }, 300);
        document.body.classList.remove('scroll-locked');
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        if(closeButton) closeButton.addEventListener('click', closeMenu);
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) closeMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let delay = 0;
                    if (entry.target.classList.contains('stagger')) {
                        delay = (entry.target.getAttribute('data-stagger-index') || 0) * 100;
                    }
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        let staggerIndex = 0;
        revealElements.forEach(el => {
            if(el.classList.contains('stagger')) {
                el.setAttribute('data-stagger-index', staggerIndex++);
            }
            observer.observe(el);
        });
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('show'), 100);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 500);
        });
    }

    // --- LIGHTBOX GALLERY ---
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');

        function updateImage(index) {
            const item = galleryItems[index];
            const imgSrc = item.getAttribute('data-km-image');
            const imgAlt = item.getAttribute('data-alt');
            const pathPrefix = window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/') ? '' : '../';
            lightboxImg.src = pathPrefix + imgSrc;
            lightboxImg.alt = imgAlt;
            currentIndex = index;
        }

        function openLightbox(index) {
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('open'), 10);
            document.body.classList.add('scroll-locked');
            updateImage(index);
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
            document.body.classList.remove('scroll-locked');
        }

        function showPrev() {
            const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateImage(newIndex);
        }

        function showNext() {
            const newIndex = (currentIndex + 1) % galleryItems.length;
            updateImage(newIndex);
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }

    // --- STICKY CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT visible
                if (!entry.isIntersecting) {
                    stickyCta.style.display = 'block';
                    setTimeout(() => stickyCta.classList.add('visible'), 10);
                } else {
                    stickyCta.classList.remove('visible');
                    setTimeout(() => { stickyCta.style.display = 'none'; }, 400);
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});