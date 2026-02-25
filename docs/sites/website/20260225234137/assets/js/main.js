document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpened = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isOpened);
            document.body.classList.toggle('nav-open');
            document.body.style.overflow = document.body.classList.contains('nav-open') ? 'hidden' : '';
        });
    }

    // --- Sticky Header ---
    const header = document.getElementById('site-header');
    if (header) {
        const observer = new IntersectionObserver(([e]) => e.target.classList.toggle('scrolled', e.intersectionRatio < 1), { threshold: [1] });
        observer.observe(header);
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.dataset.reveal === 'stagger-parent') {
                    const children = entry.target.querySelectorAll('[data-reveal="stagger-child"]');
                    children.forEach((child, index) => {
                        child.style.setProperty('--stagger-index', index);
                        child.classList.add('visible');
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Before/After Slider ---
    const slider = document.querySelector('.before-after-slider');
    if (slider) {
        const sliderInput = slider.querySelector('.slider-input');
        const imageAfter = slider.querySelector('.image-after');
        const sliderHandle = slider.querySelector('.slider-handle');
        sliderInput.addEventListener('input', (e) => {
            const value = e.target.value;
            imageAfter.style.clipPath = `inset(0 0 0 ${value}%)`;
            sliderHandle.style.left = `${value}%`;
        });
    }

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

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

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedbackEl = document.getElementById('form-feedback');
            feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wurde (simuliert) gesendet.';
            feedbackEl.classList.add('success');
            feedbackEl.hidden = false;
            contactForm.reset();
            setTimeout(() => { feedbackEl.hidden = true; }, 5000);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('visible'), 100);
        }
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting
                stickyCta.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });
        const heroSection = document.querySelector('.hero');
        if (heroSection) ctaObserver.observe(heroSection);
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let galleryImages = [];
        let currentIndex = 0;

        const updateLightboxImage = (index) => {
            const imageSrc = galleryImages[index];
            if (imageSrc) {
                lightboxImg.src = imageSrc;
                currentIndex = index;
            }
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const trigger = e.target.closest('[data-lightbox-trigger]');
            if (!trigger) return;

            const gallery = trigger.closest('[data-reveal="stagger-parent"]') || document.getElementById('gallery-grid') || document.body;
            galleryImages = Array.from(gallery.querySelectorAll('[data-lightbox-trigger]')).map(el => el.dataset.kmImage);
            const clickedIndex = galleryImages.indexOf(trigger.dataset.kmImage);
            
            updateLightboxImage(clickedIndex);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
            addLightboxListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => { 
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.style.overflow = '';
            removeLightboxListeners();
        };

        const showPrev = () => updateLightboxImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
        const showNext = () => updateLightboxImage((currentIndex + 1) % galleryImages.length);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        function addLightboxListeners() {
            document.addEventListener('keydown', handleKeyDown);
            closeBtn.addEventListener('click', closeLightbox);
            prevBtn.addEventListener('click', showPrev);
            nextBtn.addEventListener('click', showNext);
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        }

        function removeLightboxListeners() {
            document.removeEventListener('keydown', handleKeyDown);
            closeBtn.removeEventListener('click', closeLightbox);
            prevBtn.removeEventListener('click', showPrev);
            nextBtn.removeEventListener('click', showNext);
            lightbox.removeEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        }

        document.body.addEventListener('click', openLightbox);
    }
});