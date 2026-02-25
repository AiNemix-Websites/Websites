document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER --- //
    const header = document.getElementById('main-header');
    if (header) {
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. MOBILE NAVIGATION --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isActive = mobileMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            document.body.classList.toggle('no-scroll', isActive);
        });
    }

    // --- 3. SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-group, .reveal-item');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- 4. TESTIMONIAL SLIDER --- //
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.slider-btn.next');
        const prevBtn = document.querySelector('.slider-btn.prev');
        const dotsContainer = document.querySelector('.slider-dots');
        let currentIndex = 0;

        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        });

        updateSlider();
    }

    // --- 5. FAQ ACCORDION --- //
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

    // --- 6. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
        }
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- 7. STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaThreshold = 400;
        window.addEventListener('scroll', () => {
            if (window.scrollY > ctaThreshold) {
                if (!stickyCTA.style.display || stickyCTA.style.display === 'none') {
                    stickyCTA.style.display = 'block';
                    setTimeout(() => stickyCTA.classList.add('visible'), 10);
                }
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- 8. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let currentGallery = [];
        let currentIndex = -1;

        const updateLightboxNav = () => {
            prevBtn.style.display = currentIndex > 0 ? 'flex' : 'none';
            nextBtn.style.display = currentIndex < currentGallery.length - 1 ? 'flex' : 'none';
        };

        const showImage = (index) => {
            if (index >= 0 && index < currentGallery.length) {
                currentIndex = index;
                const imagePath = currentGallery[index];
                lightboxImg.setAttribute('src', imagePath.startsWith('..') ? imagePath : `../${imagePath}`.replace('../assets', 'assets'));
                updateLightboxNav();
            }
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const trigger = e.target.closest('[data-km-lightbox-trigger]');
            if (!trigger) return;

            const galleryName = trigger.dataset.kmLightboxTrigger;
            const allTriggers = document.querySelectorAll(`[data-km-lightbox-trigger='${galleryName}']`);
            currentGallery = Array.from(allTriggers).map(el => el.dataset.kmImage);
            const clickedImage = trigger.dataset.kmImage;
            const startIndex = currentGallery.indexOf(clickedImage);

            showImage(startIndex);
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
            lightboxImg.setAttribute('src', '');
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        };

        document.body.addEventListener('click', openLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    }
});