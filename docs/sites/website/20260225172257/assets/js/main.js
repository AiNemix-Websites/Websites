document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNavMenu.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- STICKY HEADER ---
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- SCROLL ANIMATIONS ---
    const animatedElements = document.querySelectorAll('.animate-in');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    // --- FAQ ACCORDION ---
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

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        let currentIndex = 0;

        const showSlide = (index) => {
            const offset = -index * 100;
            carousel.style.transform = `translateX(${offset}%)`;
        };

        if (slides.length > 0) {
            carousel.style.display = 'flex';
            carousel.style.transition = 'transform 0.5s ease-in-out';
            slides.forEach(slide => slide.style.flex = '0 0 100%');

            if (prevButton && nextButton) {
                prevButton.addEventListener('click', () => {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                    showSlide(currentIndex);
                });

                nextButton.addEventListener('click', () => {
                    currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                    showSlide(currentIndex);
                });
            }
            showSlide(0);
        }
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('is-visible');
        }
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- STICKY CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const ctaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                    if (!entry.isIntersecting) {
                        stickyCta.classList.add('is-visible');
                    } else {
                        stickyCta.classList.remove('is-visible');
                    }
                });
            }, { threshold: 0 });
            ctaObserver.observe(heroSection);
        }
    }

    // --- GLOBAL LIGHTBOX ---
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = document.querySelectorAll('[data-lightbox-src]');
    if (lightbox && galleryItems.length > 0) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let currentIndex = 0;

        const imageSources = Array.from(galleryItems).map(item => item.dataset.lightboxSrc);

        const showImage = (index) => {
            if (index >= 0 && index < imageSources.length) {
                currentIndex = index;
                lightboxImage.setAttribute('src', imageSources[index]);
            }
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('is-visible');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            document.body.classList.remove('no-scroll');
            lightboxImage.setAttribute('src', ''); // Stop loading
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex > 0) ? currentIndex - 1 : imageSources.length - 1;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex < imageSources.length - 1) ? currentIndex + 1 : 0;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

});