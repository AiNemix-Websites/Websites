document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('main-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const toggleMenu = () => {
            const isOpen = menuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        };

        menuToggle.addEventListener('click', toggleMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('show'), 100);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
            setTimeout(() => cookieBanner.style.display = 'none', 500);
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let currentImageIndex = -1;
        let galleryImages = [];

        const updateLightbox = () => {
            if (currentImageIndex >= 0 && currentImageIndex < galleryImages.length) {
                const imgElement = galleryImages[currentImageIndex];
                const imgSrc = imgElement.dataset.kmImage || imgElement.src;
                const imgAlt = imgElement.alt || 'Galeriebild';
                lightboxImage.src = imgElement.src.startsWith('..') ? `../${imgSrc}` : imgSrc;
                lightboxImage.alt = imgAlt;
            }
            prevBtn.style.display = currentImageIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentImageIndex < galleryImages.length - 1 ? 'block' : 'none';
        };

        const openLightbox = (index) => {
            currentImageIndex = index;
            lightbox.classList.add('show');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            updateLightbox();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        };

        document.addEventListener('click', (e) => {
            if (e.target.matches('.gallery-image')) {
                galleryImages = Array.from(document.querySelectorAll('.gallery-image'));
                const index = galleryImages.indexOf(e.target);
                openLightbox(index);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => { if (currentImageIndex > 0) { currentImageIndex--; updateLightbox(); } });
        nextBtn.addEventListener('click', () => { if (currentImageIndex < galleryImages.length - 1) { currentImageIndex++; updateLightbox(); } });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft' && currentImageIndex > 0) { currentImageIndex--; updateLightbox(); }
            if (e.key === 'ArrowRight' && currentImageIndex < galleryImages.length - 1) { currentImageIndex++; updateLightbox(); }
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const handleScrollCTA = () => {
            if (window.scrollY > window.innerHeight * 0.8) {
                stickyCTA.classList.add('show');
            } else {
                stickyCTA.classList.remove('show');
            }
        };
        window.addEventListener('scroll', handleScrollCTA);
    }
    
    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            if(dotsContainer) {
                Array.from(dotsContainer.children).forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        };

        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    showSlide(currentIndex);
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                showSlide(currentIndex);
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            });
        }

        showSlide(currentIndex);
    }

    // --- Contact Form Prevent Default ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real scenario, you would handle form submission here.
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }
});