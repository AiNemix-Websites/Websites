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
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNavMenu.hidden = isExpanded;
            document.body.classList.toggle('no-scroll', !isExpanded);
        });
    }

    // --- Scroll Reveal Animations ---
    const revealItems = document.querySelectorAll('.reveal-item');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealItems.forEach(item => observer.observe(item));

    // --- FAQ Accordion ---
    const faqAccordion = document.getElementById('faq-accordion');
    if (faqAccordion) {
        faqAccordion.addEventListener('click', (e) => {
            const question = e.target.closest('.faq-question');
            if (question) {
                const answer = question.nextElementSibling;
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            }
        });
    }

    // --- Testimonial Carousel ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        let currentIndex = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.style.transform = `translateX(${(i - index) * 100}%)`;
            });
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });

        showSlide(0);
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let galleryImages = [];
        let currentImageIndex = -1;

        const updateLightboxNav = () => {
            prevBtn.style.display = currentImageIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentImageIndex < galleryImages.length - 1 ? 'block' : 'none';
        };

        const openLightbox = (imageSrc, index) => {
            lightboxImg.setAttribute('src', imageSrc.replace('../', ''));
            lightbox.classList.add('visible');
            lightbox.hidden = false;
            document.body.classList.add('no-scroll');
            currentImageIndex = index;
            updateLightboxNav();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.hidden = true;
            lightboxImg.setAttribute('src', '');
            document.body.classList.remove('no-scroll');
        };

        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-lightbox-trigger]');
            if (trigger) {
                e.preventDefault();
                const gallery = trigger.closest('.gallery-grid');
                galleryImages = Array.from(gallery.querySelectorAll('[data-lightbox-trigger]')).map(el => el.dataset.lightboxTrigger);
                const imageSrc = trigger.dataset.lightboxTrigger;
                const index = galleryImages.indexOf(imageSrc);
                openLightbox(imageSrc, index);
            }
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                openLightbox(galleryImages[currentImageIndex], currentImageIndex);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentImageIndex < galleryImages.length - 1) {
                currentImageIndex++;
                openLightbox(galleryImages[currentImageIndex], currentImageIndex);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
                closeLightbox();
            }
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');
    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (i.e., scrolled past)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });
        ctaObserver.observe(heroSection);
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    if (cookieBanner && acceptBtn && declineBtn) {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            cookieBanner.hidden = false;
            cookieBanner.classList.add('visible');
        }

        const handleConsent = (value) => {
            localStorage.setItem('cookie_consent', value);
            cookieBanner.classList.remove('visible');
            setTimeout(() => { cookieBanner.hidden = true; }, 300);
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

});