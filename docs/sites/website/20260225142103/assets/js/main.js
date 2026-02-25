document.addEventListener('DOMContentLoaded', function() {

    // --- Helper Functions ---
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // --- Sticky Header ---
    const header = select('#site-header');
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
    const mobileNavToggle = select('.mobile-nav-toggle');
    const mobileNavClose = select('.mobile-nav-close');
    const mobileNav = select('#mobile-nav-menu');

    function openMobileNav() {
        mobileNav.classList.add('is-open');
        mobileNav.setAttribute('aria-hidden', 'false');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('scroll-locked');
    }

    function closeMobileNav() {
        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('scroll-locked');
    }

    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', openMobileNav);
        mobileNavClose.addEventListener('click', closeMobileNav);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                closeMobileNav();
            }
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = selectAll('.reveal-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100); // Stagger effect
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // --- Testimonial Carousel ---
    const carousel = select('.testimonial-carousel');
    if (carousel) {
        const slides = selectAll('.testimonial-slide');
        const nextBtn = select('.carousel-controls .next');
        const prevBtn = select('.carousel-controls .prev');
        const dotsContainer = select('.dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            selectAll('.dots .dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- Cookie Banner ---
    const cookieBanner = select('#cookie-banner');
    const cookieAcceptBtn = select('#cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Global Lightbox ---
    const lightbox = select('#km-lightbox');
    const galleryItems = selectAll('.gallery-item');
    let currentImageIndex = -1;

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        const imageSources = Array.from(galleryItems).map(item => item.href);

        function showImage(index) {
            if (index < 0 || index >= imageSources.length) return;
            currentImageIndex = index;
            lightboxImg.src = imageSources[index];
            const galleryItem = galleryItems[index];
            const altText = galleryItem.querySelector('img')?.alt || 'Galeriebild';
            lightboxImg.alt = altText;
        }

        function openLightbox(index) {
            showImage(index);
            lightbox.classList.add('show');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
        }

        function closeLightbox() {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
            lightboxImg.src = ''; // Clear src to stop loading
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

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex + 1) % imageSources.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = select('#sticky-cta');
    if (stickyCTA) {
        const ctaFooter = select('.cta-footer');
        const footer = select('.site-footer-main');
        let isVisible = false;

        const observer = new IntersectionObserver(([entry]) => {
             // Show when the footer CTA is NOT visible
            if (!entry.isIntersecting && window.scrollY > 400) {
                if (!isVisible) {
                    stickyCTA.hidden = false;
                    setTimeout(() => stickyCTA.classList.add('visible'), 10);
                    isVisible = true;
                }
            } else {
                if (isVisible) {
                    stickyCTA.classList.remove('visible');
                    isVisible = false;
                    // Use transitionend to hide it after animation
                    stickyCTA.addEventListener('transitionend', () => { if(!isVisible) stickyCTA.hidden = true; }, { once: true });
                }
            }
        }, { threshold: 0.1 });

        if(ctaFooter) {
            observer.observe(ctaFooter);
        } else if (footer) {
             observer.observe(footer);
        }
    }

});