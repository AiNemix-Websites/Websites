document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
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

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        mobileMenu.classList.add('open');
        document.body.classList.add('scroll-locked');
        document.body.addEventListener('click', closeMenuOutside, true);
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('scroll-locked');
        document.body.removeEventListener('click', closeMenuOutside, true);
    };

    const closeMenuOutside = (event) => {
        if (!mobileMenu.contains(event.target) && event.target !== menuToggle) {
            closeMenu();
        }
    };

    if (menuToggle && mobileMenu && menuClose) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            openMenu();
        });
        menuClose.addEventListener('click', closeMenu);
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
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

    // --- Before/After Slider --- //
    const baSlider = document.querySelector('.ba-slider');
    if (baSlider) {
        const afterImage = document.querySelector('.ba-image.after');
        baSlider.addEventListener('input', (e) => {
            afterImage.style.clipPath = `inset(0 0 0 ${e.target.value}%)`;
        });
    }

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const dotsContainer = document.querySelector('.carousel-dots');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, i) => {
            const button = document.createElement('button');
            button.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(button);
        });

        const dots = Array.from(dotsContainer.children);

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- FAQ Accordion --- //
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

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.close-btn');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');
    let galleryImages = [];
    let currentImageIndex = -1;

    const openLightbox = (index) => {
        if (index < 0 || index >= galleryImages.length) return;
        currentImageIndex = index;
        const imgElement = galleryImages[currentImageIndex];
        const imagePath = imgElement.dataset.kmImage.startsWith('../') ? imgElement.dataset.kmImage : `../${imgElement.dataset.kmImage}`;
        const pageUrl = window.location.pathname;
        const isHomePage = pageUrl.endsWith('/') || pageUrl.endsWith('index.html');
        lightboxContent.src = isHomePage ? imgElement.dataset.kmImage : `../${imgElement.dataset.kmImage}`;
        lightboxContent.alt = imgElement.alt;
        lightbox.classList.add('show');
        document.body.classList.add('scroll-locked');
        document.addEventListener('keydown', handleLightboxKeydown);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('show');
        document.body.classList.remove('scroll-locked');
        document.removeEventListener('keydown', handleLightboxKeydown);
    };

    const showPrevImage = () => openLightbox((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);
    const showNextImage = () => openLightbox((currentImageIndex + 1) % galleryImages.length);

    const handleLightboxKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    };

    if (lightbox) {
        document.querySelectorAll('.gallery-image').forEach((img, index) => {
            galleryImages.push(img);
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
    }

    // --- Context CTA & Back to Top --- //
    const contextCta = document.getElementById('context-cta');
    const backToTopBtn = document.getElementById('back-to-top');
    if (contextCta || backToTopBtn) {
        window.addEventListener('scroll', () => {
            const show = window.scrollY > 400;
            if (contextCta) contextCta.classList.toggle('show', show);
            if (backToTopBtn) backToTopBtn.classList.toggle('show', show);
        });
    }
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});