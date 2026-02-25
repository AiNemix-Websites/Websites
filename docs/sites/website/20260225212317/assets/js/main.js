document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu --- //
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (mobileMenuToggle && mobileMenu) {
        const openMenu = () => {
            mobileMenu.classList.add('open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        };

        mobileMenuToggle.addEventListener('click', openMenu);
        mobileMenuClose.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

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

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Set stagger index for children if needed
                if (entry.target.classList.contains('stagger')) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.setProperty('--stagger-index', i);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion --- //
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

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = carousel.parentElement.querySelector('.prev');
        const nextButton = carousel.parentElement.querySelector('.next');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        nextButton.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            goToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1;
            }
            goToSlide(prevIndex);
        });
    }

    // --- Before/After Slider --- //
    const sliderContainer = document.getElementById('before-after-slider');
    if (sliderContainer) {
        const afterImg = sliderContainer.querySelector('.after-img');
        const handle = sliderContainer.querySelector('.slider-handle');
        let isDragging = false;

        const moveSlider = (x) => {
            const rect = sliderContainer.getBoundingClientRect();
            let newX = x - rect.left;
            if (newX < 0) newX = 0;
            if (newX > rect.width) newX = rect.width;
            const percentage = (newX / rect.width) * 100;
            afterImg.style.width = `${percentage}%`;
            handle.style.left = `${percentage}%`;
        };

        sliderContainer.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
        sliderContainer.addEventListener('touchstart', (e) => { isDragging = true; });
        
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('touchend', () => { isDragging = false; });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) moveSlider(e.clientX);
        });
        window.addEventListener('touchmove', (e) => {
            if (isDragging) moveSlider(e.touches[0].clientX);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            cookieBanner.classList.add('visible');
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past hero)
                if (!entry.isIntersecting && window.scrollY > 200) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        const heroSection = document.querySelector('.hero');
        if (heroSection) ctaObserver.observe(heroSection);
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const closeLightboxBtn = lightbox.querySelector('.close-lightbox');
    const prevLightboxBtn = lightbox.querySelector('.prev-lightbox');
    const nextLightboxBtn = lightbox.querySelector('.next-lightbox');
    const clickableImages = document.querySelectorAll('.clickable-image, .gallery-item img');
    let currentImageIndex = 0;
    const imageSources = Array.from(clickableImages).map(img => img.dataset.kmImage);

    const openLightbox = (index) => {
        currentImageIndex = index;
        const imagePath = imageSources[index];
        const relativePath = lightbox.ownerDocument.body.dataset.pageDepth === 'sub' ? `../${imagePath}` : imagePath;
        lightboxImg.setAttribute('src', relativePath);
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('visible'), 10);
        document.body.classList.add('no-scroll');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxImg.setAttribute('src', '');
        }, 200);
        document.body.classList.remove('no-scroll');
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
        openLightbox(currentImageIndex);
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % imageSources.length;
        openLightbox(currentImageIndex);
    };

    clickableImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    if (lightbox) {
        // Determine page depth for correct image paths
        if (window.location.pathname.split('/').filter(Boolean).length > 0 && !window.location.pathname.endsWith('/')) {
             lightbox.ownerDocument.body.dataset.pageDepth = 'sub';
        } else if (window.location.pathname.split('/').filter(Boolean).length > 1) {
            lightbox.ownerDocument.body.dataset.pageDepth = 'sub';
        }

        closeLightboxBtn.addEventListener('click', closeLightbox);
        prevLightboxBtn.addEventListener('click', showPrevImage);
        nextLightboxBtn.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const successMessage = document.getElementById('form-success-message');
            successMessage.style.display = 'block';
            contactForm.reset();
            setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
        });
    }
});