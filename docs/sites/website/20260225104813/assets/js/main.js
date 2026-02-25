document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
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

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            const isOpen = open !== undefined ? open : !menuToggle.classList.contains('active');
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
            mobileMenu.classList.toggle('open', isOpen);
            document.body.classList.toggle('body-no-scroll', isOpen);
        };

        menuToggle.addEventListener('click', () => toggleMenu());
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) { // Click on backdrop
                toggleMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.revealDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- Accordion --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        if (header && content) {
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
                content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
            });
        }
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const scrollStep = () => carousel.querySelector('.testimonial-card').offsetWidth;

        if (nextBtn) nextBtn.addEventListener('click', () => carousel.scrollBy({ left: scrollStep(), behavior: 'smooth' }));
        if (prevBtn) prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -scrollStep(), behavior: 'smooth' }));
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('show');
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const handleCtaScroll = () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                stickyCta.classList.add('show');
            } else {
                stickyCta.classList.remove('show');
            }
        };
        window.addEventListener('scroll', handleCtaScroll, { passive: true });
        handleCtaScroll();
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = Array.from(document.querySelectorAll('[data-gallery-item]'));
    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let currentIndex = 0;

        const showImage = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            currentIndex = index;
            const item = galleryItems[index];
            const imageSrc = item.getAttribute('href');
            lightboxImg.setAttribute('src', imageSrc);
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const clickedIndex = galleryItems.indexOf(e.currentTarget);
            showImage(clickedIndex);
            lightbox.classList.add('open');
            document.body.classList.add('body-no-scroll');
            addLightboxListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.classList.remove('body-no-scroll');
            removeLightboxListeners();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        };
        
        const handleBackdropClick = (e) => {
            if (e.target === lightbox) closeLightbox();
        }

        function addLightboxListeners() {
            closeBtn.addEventListener('click', closeLightbox);
            prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
            nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
            document.addEventListener('keydown', handleKeydown);
            lightbox.addEventListener('click', handleBackdropClick);
        }

        function removeLightboxListeners() {
            closeBtn.removeEventListener('click', closeLightbox);
            prevBtn.removeEventListener('click', () => showImage(currentIndex - 1));
            nextBtn.removeEventListener('click', () => showImage(currentIndex + 1));
            document.removeEventListener('keydown', handleKeydown);
            lightbox.removeEventListener('click', handleBackdropClick);
        }

        galleryItems.forEach(item => item.addEventListener('click', openLightbox));
    }

    // --- Form Submission --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // This is a demo. In a real project, this would send data to a server.
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }
});