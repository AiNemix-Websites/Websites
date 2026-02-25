document.addEventListener('DOMContentLoaded', function() {

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
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.add('open');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleEscKey);
            mobileMenu.addEventListener('click', handleBackdropClick);
        }
    };

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleEscKey);
            mobileMenu.removeEventListener('click', handleBackdropClick);
        }
    };

    const handleEscKey = (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    };
    
    const handleBackdropClick = (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    };

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);

    // --- Scroll Animations ---
    const revealItems = document.querySelectorAll('.reveal-item');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // Staggered delay
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealItems.forEach(item => {
        observer.observe(item);
    });

    // --- FAQ Accordion ---
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

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.toggle('active', index === currentIndex);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        };

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

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        if (cookieBanner) cookieBanner.classList.remove('show');
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxContent = lightbox ? lightbox.querySelector('.lightbox-content') : null;
    const closeBtn = lightbox ? lightbox.querySelector('.close-btn') : null;
    const prevBtn = lightbox ? lightbox.querySelector('.prev-btn') : null;
    const nextBtn = lightbox ? lightbox.querySelector('.next-btn') : null;

    let galleryItems = [];
    let currentImageIndex = -1;

    document.querySelectorAll('.gallery .gallery-item').forEach((item, index) => {
        const imagePath = item.dataset.kmImage || item.src;
        const altText = item.alt || 'Galeriebild';
        galleryItems.push({ src: imagePath, alt: altText });
        item.addEventListener('click', (e) => {
            e.preventDefault();
            currentImageIndex = index;
            openLightbox();
        });
    });

    const openLightbox = () => {
        if (!lightbox || currentImageIndex < 0 || currentImageIndex >= galleryItems.length) return;
        const item = galleryItems[currentImageIndex];
        const imageSrc = lightboxContent.src.includes('../') ? `../${item.src}` : item.src;
        lightboxContent.src = item.src.startsWith('../') ? item.src : (document.querySelector('body').dataset.pageDepth === 'sub' ? '../' + item.src : item.src);
        lightboxContent.alt = item.alt;
        lightbox.classList.add('show');
        document.body.classList.add('no-scroll');
        document.addEventListener('keydown', handleLightboxKeys);
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('show');
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleLightboxKeys);
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox();
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        openLightbox();
    };

    const handleLightboxKeys = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    };

    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);

    // Set page depth for asset loading in JS
    const isSubPage = window.location.pathname.split('/').filter(Boolean).length > 0 && !window.location.pathname.endsWith('/');
    if(window.location.pathname.split('/').filter(p => p && p !== 'index.html').length > 0) {
        document.body.dataset.pageDepth = 'sub';
    }

});