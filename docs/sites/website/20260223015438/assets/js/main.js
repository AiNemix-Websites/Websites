document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const nav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainMenu = document.querySelector('.main-menu');
    if (navToggle && mainMenu) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mainMenu.classList.toggle('active');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Reveal Animations ---
    const revealItems = document.querySelectorAll('.reveal-item');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    revealItems.forEach(item => observer.observe(item));

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- Testimonial Carousel ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('active');
            targetDot.classList.add('active');
        }

        // Create dots
        slides.forEach((slide, index) => {
            const button = document.createElement('button');
            button.classList.add('dot');
            if (index === 0) button.classList.add('active');
            dotsNav.appendChild(button);
        });
        const dots = Array.from(dotsNav.children);

        let currentIndex = 0;

        const updateCarousel = (newIndex) => {
            const currentSlide = track.querySelector('.carousel-slide:nth-child(' + (currentIndex + 1) + ')');
            const currentDot = dots[currentIndex];
            
            currentIndex = newIndex;
            if (currentIndex < 0) currentIndex = slides.length - 1;
            if (currentIndex >= slides.length) currentIndex = 0;

            const targetSlide = track.querySelector('.carousel-slide:nth-child(' + (currentIndex + 1) + ')');
            const targetDot = dots[currentIndex];

            track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
            updateDots(currentDot, targetDot);
        };

        nextButton.addEventListener('click', e => {
            updateCarousel(currentIndex + 1);
        });

        prevButton.addEventListener('click', e => {
            updateCarousel(currentIndex - 1);
        });

        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button.dot');
            if (!targetDot) return;
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            updateCarousel(targetIndex);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('visible'), 100);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.hidden = true, 400);
        });
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeButton = lightbox.querySelector('.lightbox-close');
        const prevButton = lightbox.querySelector('.lightbox-prev');
        const nextButton = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryItems = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            currentIndex = index;
            const item = galleryItems[currentIndex];
            const imageSrc = item.dataset.kmImage || item.src;
            lightboxImage.src = imageSrc;
            lightboxImage.alt = item.alt;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        const showPrev = () => openLightbox(currentIndex - 1);
        const showNext = () => openLightbox(currentIndex + 1);

        document.addEventListener('click', (e) => {
            if (e.target.matches('.gallery-item')) {
                const group = e.target.dataset.galleryGroup || 'default';
                galleryItems = Array.from(document.querySelectorAll('.gallery-item[data-gallery-group="' + group + '"]'));
                const index = galleryItems.indexOf(e.target);
                openLightbox(index);
            }
        });

        closeButton.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevButton.addEventListener('click', showPrev);
        nextButton.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.hidden) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const showAt = document.body.scrollHeight * 0.2;
        const hideAt = document.body.scrollHeight * 0.9;
        window.addEventListener('scroll', () => {
            if (window.scrollY > showAt && window.scrollY < hideAt) {
                stickyCTA.hidden = false;
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }
});