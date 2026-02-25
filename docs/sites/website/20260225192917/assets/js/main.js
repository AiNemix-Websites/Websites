document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNavToggle && mobileNav) {
        const toggleNav = () => {
            const isOpen = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isOpen);
            mobileNav.classList.toggle('open');
            mobileNav.style.display = isOpen ? 'none' : 'flex';
            document.body.classList.toggle('no-scroll', !isOpen);
        };

        mobileNavToggle.addEventListener('click', toggleNav);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                toggleNav();
            }
        });
    }

    // --- Scroll Animations --- //
    const animatedElements = document.querySelectorAll('.animate-in');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.style.display = isExpanded ? 'none' : 'block';
            });
        }
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            cookieBanner.style.display = 'flex';
        }

        const handleConsent = (consent) => {
            localStorage.setItem('cookie_consent', consent);
            cookieBanner.style.display = 'none';
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const handleStickyCTA = () => {
            if (window.scrollY > 600) {
                stickyCTA.style.display = 'block';
                setTimeout(() => stickyCTA.classList.add('visible'), 10);
            } else {
                stickyCTA.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleStickyCTA, { passive: true });
    }

    // --- Before/After Slider --- //
    const slider = document.getElementById('before-after-slider');
    if (slider) {
        const afterImage = slider.querySelector('.ba-after-img');
        const rangeInput = slider.querySelector('.ba-range');
        const handle = slider.querySelector('.ba-handle');

        const updateSlider = (value) => {
            afterImage.style.clipPath = `inset(0 0 0 ${value}%)`;
            handle.style.left = `${value}%`;
        };

        rangeInput.addEventListener('input', (e) => {
            updateSlider(e.target.value);
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = document.getElementById('km-lightbox-image');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let currentImageIndex = 0;
        let galleryImages = [];

        const openLightbox = (index) => {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
            addLightboxEventListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImage.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            removeLightboxEventListeners();
        };

        const updateLightboxImage = () => {
            const imgElement = galleryImages[currentImageIndex];
            const imagePath = imgElement.dataset.kmImage || imgElement.src;
            const altText = imgElement.alt;
            const relativePath = lightbox.baseURI.includes('/index.html') ? '' : '../';
            lightboxImage.src = `${relativePath}${imagePath}`.replace('../assets', 'assets');
            lightboxImage.alt = altText;
            prevBtn.style.display = currentImageIndex === 0 ? 'none' : 'block';
            nextBtn.style.display = currentImageIndex === galleryImages.length - 1 ? 'none' : 'block';
        };

        const showPrev = () => {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateLightboxImage();
            }
        };

        const showNext = () => {
            if (currentImageIndex < galleryImages.length - 1) {
                currentImageIndex++;
                updateLightboxImage();
            }
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        const addLightboxEventListeners = () => {
            document.addEventListener('keydown', handleKeydown);
        };

        const removeLightboxEventListeners = () => {
            document.removeEventListener('keydown', handleKeydown);
        };

        document.querySelectorAll('.lightbox-gallery img').forEach((img, index) => {
            galleryImages.push(img);
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});