document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            document.body.classList.toggle('scroll-locked');
        });
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.stagger || '0') * 100;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            carousel.style.transition = 'transform 0.5s ease-in-out';
            updateDots(index);
            currentIndex = index;
        };

        const updateDots = (index) => {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        goToSlide(0);
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.getElementById('hero');
    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        ctaObserver.observe(heroSection);

        const closeCTA = document.getElementById('sticky-cta-close');
        closeCTA.addEventListener('click', () => {
            stickyCTA.style.display = 'none';
        });
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = Array.from(document.querySelectorAll('#image-gallery .gallery-item'));
    let currentImageIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        const showImage = (index) => {
            const item = galleryItems[index];
            if (!item) return;
            const imageSrc = item.getAttribute('href');
            lightboxImg.setAttribute('src', imageSrc);
            currentImageIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('visible');
            document.body.classList.add('scroll-locked');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('scroll-locked');
            lightboxImg.setAttribute('src', ''); // Cleanup
        };

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
            const newIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex + 1) % galleryItems.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && acceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }
});