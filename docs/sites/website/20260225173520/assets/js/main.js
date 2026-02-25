document.addEventListener('DOMContentLoaded', () => {

    // --- 1. HEADER & NAVIGATION --- //
    const header = document.getElementById('site-header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Sticky header
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile navigation
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('no-scroll', !isExpanded);
        });
    }

    // --- 2. SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3. STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- 4. BEFORE/AFTER SLIDER --- //
    const baSlider = document.getElementById('before-after-slider');
    if (baSlider) {
        const sliderInput = baSlider.querySelector('.ba-slider');
        const afterImage = baSlider.querySelector('.ba-after');
        const handle = baSlider.querySelector('.ba-handle');

        sliderInput.addEventListener('input', (e) => {
            const value = e.target.value;
            afterImage.style.clipPath = `inset(0 0 0 ${value}%)`;
            handle.style.left = `${value}%`;
        });
    }

    // --- 5. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = document.getElementById('km-lightbox-image');
        const lightboxCaption = document.getElementById('km-lightbox-caption');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
        let galleryItems = [];
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            const item = galleryItems[currentIndex];
            lightboxImage.src = item.href;
            lightboxImage.alt = item.querySelector('img')?.alt || 'Galeriebild';
            lightboxCaption.textContent = item.dataset.caption || '';
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('open'), 10);
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
            setTimeout(() => {
                 lightbox.style.display = 'none';
                 lightboxImage.src = ''; // Prevent loading in background
            }, 300);
        };

        const showPrev = () => {
            const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            openLightbox(newIndex);
        };

        const showNext = () => {
            const newIndex = (currentIndex + 1) % galleryItems.length;
            openLightbox(newIndex);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-lightbox-trigger]');
            if (trigger) {
                e.preventDefault();
                const galleryName = trigger.dataset.lightboxTrigger;
                galleryItems = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${galleryName}']`));
                const index = galleryItems.indexOf(trigger);
                openLightbox(index);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
    }

    // --- 6. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        // Use setTimeout to avoid interfering with initial page load animation
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.style.display = 'block';
                setTimeout(() => cookieBanner.classList.add('visible'), 50);
            }
        }, 2000);

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.style.display = 'none', 300);
        });
    }
});