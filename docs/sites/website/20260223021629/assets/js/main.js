document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER --- //
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

    // --- 2. MOBILE NAVIGATION --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.toggle('is-open');
            mainNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('nav-open');
        });
    }

    // --- 3. SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. FAQ ACCORDION --- //
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

    // --- 5. TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        if(prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                const newIndex = (currentIndex - 1 + slides.length) % slides.length;
                goToSlide(newIndex);
            });

            nextButton.addEventListener('click', () => {
                const newIndex = (currentIndex + 1) % slides.length;
                goToSlide(newIndex);
            });
        }

        // Basic swipe functionality
        let touchstartX = 0;
        let touchendX = 0;
        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextButton.click();
            if (touchendX > touchstartX) prevButton.click();
        });
    }

    // --- 6. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && acceptCookies && declineCookies) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('show');
            }
        }, 2000);

        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- 7. STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('show');
                } else {
                    stickyCTA.classList.remove('show');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });
        const hero = document.querySelector('.hero');
        if (hero) ctaObserver.observe(hero);
    }

    // --- 8. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const galleryItems = Array.from(document.querySelectorAll('[data-lightbox-src]'));
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            const item = galleryItems[currentIndex];
            const src = item.getAttribute('data-lightbox-src');
            const alt = item.getAttribute('data-lightbox-alt') || item.querySelector('img')?.alt || '';
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        const showPrev = () => openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        const showNext = () => openLightbox((currentIndex + 1) % galleryItems.length);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.querySelector('.km-lightbox-backdrop').addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-open')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

});