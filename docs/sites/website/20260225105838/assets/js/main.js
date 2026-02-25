document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- Mobile Menu --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const toggleMenu = () => {
            const isOpen = mobileMenu.classList.toggle('is-open');
            menuToggle.classList.toggle('is-active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        };

        menuToggle.addEventListener('click', toggleMenu);

        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                toggleMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                toggleMenu();
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                    if (delay > 0) {
                        const children = entry.target.children;
                        for (let i = 0; i < children.length; i++) {
                            setTimeout(() => {
                                children[i].classList.add('visible');
                            }, i * delay);
                        }
                    } else {
                        entry.target.classList.add('visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.style.display = 'block';
        }
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const handleStickyCTAScroll = () => {
            if (window.scrollY > 400 && window.innerHeight + window.scrollY < document.body.offsetHeight - 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleStickyCTAScroll, { passive: true });
    }

    // --- References Slider --- //
    const slider = document.getElementById('references-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.slider-btn--prev');
        const nextBtn = document.querySelector('.slider-btn--next');
        let currentIndex = 0;

        const goToSlide = (index) => {
            slider.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        nextBtn.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1;
            goToSlide(prevIndex);
        });
        slider.style.transition = 'transform 0.4s ease-in-out';
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox__close');
        const prevBtn = lightbox.querySelector('.km-lightbox__prev');
        const nextBtn = lightbox.querySelector('.km-lightbox__next');
        let galleryItems = [];
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            const item = galleryItems[currentIndex];
            lightboxImg.src = item.dataset.lightboxSrc || item.src;
            lightboxImg.alt = item.alt;
            lightbox.classList.add('is-open');
            document.body.classList.add('no-scroll');
            updateLightboxNav();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            document.body.classList.remove('no-scroll');
        };

        const showPrev = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
            openLightbox(currentIndex);
        };

        const showNext = () => {
            currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
            openLightbox(currentIndex);
        };
        
        const updateLightboxNav = () => {
            prevBtn.style.display = galleryItems.length > 1 ? 'block' : 'none';
            nextBtn.style.display = galleryItems.length > 1 ? 'block' : 'none';
        };

        document.querySelectorAll('[data-lightbox-src]').forEach((item, index) => {
            galleryItems.push(item);
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
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }
});