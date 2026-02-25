document.addEventListener('DOMContentLoaded', () => {

    // --- HEADER & MOBILE NAV --- //
    const header = document.getElementById('site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const navToggleClose = document.querySelector('.nav-toggle-close');
    const mobileNav = document.getElementById('mobile-nav-menu');

    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    const openMobileNav = () => {
        if (mobileNav) {
            mobileNav.classList.add('is-open');
            mobileNav.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        }
    };

    const closeMobileNav = () => {
        if (mobileNav) {
            mobileNav.classList.remove('is-open');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        }
    };

    if (navToggle) navToggle.addEventListener('click', openMobileNav);
    if (navToggleClose) navToggleClose.addEventListener('click', closeMobileNav);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
            closeMobileNav();
        }
    });

    // --- SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.setProperty('--stagger-index', i);
                    }
                }
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- FAQ ACCORDION --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        };

        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

        goToSlide(0); // Initialize
    }

    // --- STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const footerCTA = document.getElementById('cta-footer');

    if (stickyCTA && footerCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show sticky CTA if footer CTA is NOT visible
                stickyCTA.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });
        ctaObserver.observe(footerCTA);
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookie_consent')) {
            cookieBanner.classList.add('visible');
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.prev-lightbox');
    const nextBtn = lightbox.querySelector('.next-lightbox');
    const galleryImages = document.querySelectorAll('.lightbox-trigger');
    let currentIndex = 0;

    if (lightbox && galleryImages.length > 0) {
        const imageSources = Array.from(galleryImages).map(img => img.dataset.kmImage);

        const openLightbox = (index) => {
            currentIndex = index;
            lightboxImg.src = `../${imageSources[currentIndex]}`.replace('../assets', 'assets'); // Adjust path for subpages
            lightbox.style.display = 'flex';
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
            document.body.classList.remove('no-scroll');
        };

        const showPrev = () => openLightbox((currentIndex - 1 + imageSources.length) % imageSources.length);
        const showNext = () => openLightbox((currentIndex + 1) % imageSources.length);

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeLightboxBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});