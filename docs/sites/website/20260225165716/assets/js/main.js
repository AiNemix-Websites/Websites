document.addEventListener('DOMContentLoaded', function() {

    // --- 1. STICKY HEADER --- //
    const header = document.getElementById('site-header');
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

    // --- 2. MOBILE NAVIGATION --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

    const openMobileMenu = () => {
        if (mobileNavMenu) {
            mobileNavMenu.classList.add('is-open');
            mobileNavMenu.style.display = 'block';
            document.body.classList.add('scroll-locked');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        }
    };

    const closeMobileMenu = () => {
        if (mobileNavMenu) {
            mobileNavMenu.classList.remove('is-open');
            setTimeout(() => { mobileNavMenu.style.display = 'none'; }, 300);
            document.body.classList.remove('scroll-locked');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', openMobileMenu);
        mobileNavClose.addEventListener('click', closeMobileMenu);
        mobileNavBackdrop.addEventListener('click', closeMobileMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMobileMenu();
            }
        });
    }

    // --- 3. SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
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

    // --- 4. FAQ ACCORDION --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.style.display = isExpanded ? 'none' : 'block';
        });
    });

    // --- 5. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'block';
        setTimeout(() => cookieBanner.classList.add('is-visible'), 10);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 300);
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 300);
        });
    }

    // --- 6. STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const handleCtaScroll = () => {
            const heroSection = document.querySelector('.hero');
            if (heroSection && window.scrollY > heroSection.offsetHeight) {
                stickyCta.classList.add('is-visible');
                stickyCta.style.display = 'block';
            } else {
                stickyCta.classList.remove('is-visible');
                setTimeout(() => { if(!stickyCta.classList.contains('is-visible')) stickyCta.style.display = 'none'; }, 300);
            }
        };
        window.addEventListener('scroll', handleCtaScroll);
        handleCtaScroll(); // Initial check
    }

    // --- 7. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryImages = [];
        let currentIndex = 0;

        const updateImage = () => {
            const imgPath = galleryImages[currentIndex].dataset.kmImage || galleryImages[currentIndex].src;
            const altText = galleryImages[currentIndex].alt || 'Galeriebild';
            const relativePath = lightbox.ownerDocument.location.pathname.includes('/index.html') ? '' : '../';
            lightboxImage.src = relativePath + imgPath;
            lightboxImage.alt = altText;
        };

        const openLightbox = (index) => {
            currentIndex = index;
            lightbox.classList.add('is-open');
            lightbox.style.display = 'flex';
            document.body.classList.add('scroll-locked');
            updateImage();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
            document.body.classList.remove('scroll-locked');
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateImage();
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateImage();
        };

        document.querySelectorAll('.lightbox-gallery .gallery-image').forEach((img, index) => {
            galleryImages.push(img);
            img.addEventListener('click', () => openLightbox(index));
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxBackdrop.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrev);
        lightboxNext.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-open')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});