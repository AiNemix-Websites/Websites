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
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const navClose = document.querySelector('.mobile-nav-close');

    if (navToggle && mobileNav) {
        const toggleNav = (open) => {
            navToggle.setAttribute('aria-expanded', open);
            mobileNav.classList.toggle('open', open);
            document.body.classList.toggle('no-scroll', open);
        };

        navToggle.addEventListener('click', () => toggleNav(true));
        navClose.addEventListener('click', () => toggleNav(false));
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                toggleNav(false);
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const staggerDelay = parseInt(el.dataset.stagger) || 0;
                if (staggerDelay > 0) {
                    const children = el.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.transitionDelay = `${i * staggerDelay}ms`;
                    }
                }
                el.classList.add('visible');
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion ---
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

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dotsContainer.querySelector('.active').classList.remove('active');
            dotsContainer.children[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => goToSlide(i));
            if (i === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        });

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
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const lightboxClose = document.querySelector('.km-lightbox-close');
    const lightboxPrev = document.querySelector('.km-lightbox-prev');
    const lightboxNext = document.querySelector('.km-lightbox-next');
    let galleryItems = [];
    let currentImageIndex = -1;

    const galleryLinks = document.querySelectorAll('[data-lightbox-src]');
    galleryLinks.forEach((link, index) => {
        galleryItems.push(link.getAttribute('href'));
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentImageIndex = index;
            openLightbox(link.getAttribute('href'));
        });
    });

    function openLightbox(src) {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.setAttribute('src', src);
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('show'), 10);
        document.body.classList.add('no-scroll');
        updateLightboxNav();
        document.addEventListener('keydown', handleLightboxKeydown);
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('show');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxImage.setAttribute('src', '');
        }, 300);
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleLightboxKeydown);
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        lightboxImage.setAttribute('src', galleryItems[currentImageIndex]);
        updateLightboxNav();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        lightboxImage.setAttribute('src', galleryItems[currentImageIndex]);
        updateLightboxNav();
    }

    function updateLightboxNav() {
        lightboxPrev.style.display = galleryItems.length > 1 ? 'block' : 'none';
        lightboxNext.style.display = galleryItems.length > 1 ? 'block' : 'none';
    }

    function handleLightboxKeydown(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    }

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);
    }

    // --- Context CTA ---
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when the footer is NOT in view
                if (!entry.isIntersecting && window.scrollY > window.innerHeight / 2) {
                    contextCta.classList.add('visible');
                } else {
                    contextCta.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        const footer = document.querySelector('.site-footer');
        if (footer) {
            ctaObserver.observe(footer);
        }
    }
});