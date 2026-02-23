document.addEventListener('DOMContentLoaded', () => {

    const initStickyHeader = () => {
        const header = document.getElementById('main-header');
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

    const initMobileMenu = () => {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const drawer = document.getElementById('mobile-menu-drawer');
        if (!toggleBtn || !drawer) return;

        const toggleMenu = (isOpen) => {
            const expanded = isOpen === undefined ? toggleBtn.getAttribute('aria-expanded') === 'false' : isOpen;
            toggleBtn.setAttribute('aria-expanded', expanded);
            toggleBtn.classList.toggle('is-active', expanded);
            drawer.classList.toggle('is-open', expanded);
            drawer.setAttribute('aria-hidden', !expanded);
            document.body.classList.toggle('scroll-locked', expanded);
        };

        toggleBtn.addEventListener('click', () => toggleMenu());
        drawer.addEventListener('click', (e) => {
            if (e.target === drawer) toggleMenu(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
                toggleMenu(false);
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
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if(prevBtn) prevBtn.style.display = 'none';
            if(nextBtn) nextBtn.style.display = 'none';
            return;
        }

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        };

        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
        carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) showNext();
            if (touchStartX - touchEndX < -50) showPrev();
        });
    };

    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        });
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const contentImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let galleryImages = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            currentIndex = index;
            contentImg.src = galleryImages[currentIndex].dataset.kmImage.replace('../', '');
            contentImg.alt = galleryImages[currentIndex].alt;
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
            prevBtn.style.display = galleryImages.length > 1 ? 'block' : 'none';
            nextBtn.style.display = galleryImages.length > 1 ? 'block' : 'none';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
            contentImg.src = '';
        };

        const showNextImage = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            openLightbox(currentIndex);
        };

        const showPrevImage = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            openLightbox(currentIndex);
        };

        document.querySelectorAll('.gallery-image').forEach((img, index) => {
            galleryImages.push(img);
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNextImage);
        prevBtn.addEventListener('click', showPrevImage);
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight' && galleryImages.length > 1) showNextImage();
                if (e.key === 'ArrowLeft' && galleryImages.length > 1) showPrevImage();
            }
        });
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        if (!banner) return;

        const acceptBtn = document.getElementById('accept-cookies');
        const declineBtn = document.getElementById('decline-cookies');
        const cookieConsent = localStorage.getItem('cookie_consent');

        if (!cookieConsent) {
            banner.classList.add('visible');
            banner.setAttribute('aria-hidden', 'false');
        }

        const handleConsent = (consent) => {
            localStorage.setItem('cookie_consent', consent);
            banner.classList.remove('visible');
            banner.setAttribute('aria-hidden', 'true');
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    };

    const initStickyCta = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        const scrollThreshold = window.innerHeight * 0.5;

        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                cta.classList.add('visible');
                cta.setAttribute('aria-hidden', 'false');
            } else {
                cta.classList.remove('visible');
                cta.setAttribute('aria-hidden', 'true');
            }
        });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initTestimonialCarousel();
    initFaqAccordion();
    initLightbox();
    initCookieBanner();
    initStickyCta();
});