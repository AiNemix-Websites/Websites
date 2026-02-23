document.addEventListener('DOMContentLoaded', () => {

    // --- Header & Mobile Navigation ---
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    if (mobileMenuToggle && mainNav) {
        const mobileNav = mainNav.cloneNode(true);
        mobileNav.classList.add('mobile');
        document.body.appendChild(mobileNav);

        mobileMenuToggle.addEventListener('click', () => {
            const isNavOpen = document.body.classList.toggle('nav-open');
            mobileMenuToggle.setAttribute('aria-expanded', isNavOpen);
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
                document.body.classList.remove('nav-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Scroll Animations ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.reveal === 'stagger' ? index * 100 : 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        if (el.dataset.reveal === 'stagger') {
            const children = el.children;
            for(let i=0; i < children.length; i++) {
                 children[i].style.transitionDelay = `${i * 100}ms`;
            }
        }
        revealObserver.observe(el);
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookie_consent')) {
            setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        }
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Testimonial Carousel ---
    const carousels = document.querySelectorAll('.testimonial-carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.testimonial-carousel');
        const slides = wrapper.querySelectorAll('.testimonial-slide');
        const prevBtn = wrapper.querySelector('.prev');
        const nextBtn = wrapper.querySelector('.next');
        const dotsContainer = wrapper.querySelector('.dots');
        let currentIndex = 0;

        if (!carousel || slides.length === 0) return;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            carousel.style.transition = 'transform 0.5s ease-in-out';
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (index === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if(nextBtn) nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        if(prevBtn) prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    });

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryItems = [];
        let currentIndex = 0;

        const galleryElements = document.querySelectorAll('[data-gallery-item]');
        galleryElements.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img) {
                galleryItems.push({ src: img.src, alt: img.alt, caption: item.dataset.caption || '' });
                item.addEventListener('click', () => openLightbox(index));
            }
        });

        function openLightbox(index) {
            currentIndex = index;
            updateLightboxContent();
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeydown);
        }

        function closeLightbox() {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeydown);
        }

        function updateLightboxContent() {
            const item = galleryItems[currentIndex];
            lightboxImage.src = item.src;
            lightboxImage.alt = item.alt;
            lightboxCaption.textContent = item.caption;
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateLightboxContent();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightboxContent();
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        }

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');

    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });
        ctaObserver.observe(heroSection);
    }

});