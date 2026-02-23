document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('#mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNavMenu) {
        const openMenu = () => {
            mobileNavMenu.classList.add('open');
            document.body.classList.add('no-scroll');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            mobileNavClose.focus();
        };

        const closeMenu = () => {
            mobileNavMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNavToggle.focus();
        };

        mobileNavToggle.addEventListener('click', openMenu);
        mobileNavClose.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

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

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.classList.contains('stagger')) {
                    const children = el.querySelectorAll('[data-stagger-index]');
                    children.forEach((child, index) => {
                        child.style.setProperty('--stagger-order', index);
                    });
                }
                el.classList.add('visible');
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');
        goToSlide(0);

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });
    }

    // --- Modernization Calculator ---
    const calculator = document.getElementById('modernization-calculator');
    if (calculator) {
        const steps = calculator.querySelectorAll('.calculator-step');
        const nextButtons = calculator.querySelectorAll('[data-next-step]');
        const backButtons = calculator.querySelectorAll('[data-prev-step]');

        const showStep = (stepIndex) => {
            steps.forEach(step => step.classList.remove('active'));
            const nextStep = calculator.querySelector(`.calculator-step[data-step='${stepIndex}']`);
            if (nextStep) nextStep.classList.add('active');
        };

        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const nextStepIndex = button.getAttribute('data-next-step');
                showStep(nextStepIndex);
            });
        });

        backButtons.forEach(button => {
            button.addEventListener('click', () => {
                const prevStepIndex = button.getAttribute('data-prev-step');
                showStep(prevStepIndex);
            });
        });
    }

    // --- Lightbox Gallery ---
    const lightbox = document.getElementById('km-lightbox');
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex = 0;

    if (lightbox && galleryImages.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const images = Array.from(galleryImages);

        const showImage = (index) => {
            const imgElement = images[index];
            const imgSrc = imgElement.getAttribute('data-km-image');
            const imgAlt = imgElement.getAttribute('alt');
            lightboxImg.setAttribute('src', window.location.pathname.includes('index.html') ? imgSrc : `../${imgSrc}`);
            lightboxImg.setAttribute('alt', imgAlt);
            currentImageIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('show');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        };

        images.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentImageIndex + 1) % images.length;
            showImage(nextIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // --- Sticky Context CTA ---
    const contextCta = document.getElementById('context-cta');
    if(contextCta) {
        const heroSection = document.querySelector('.hero');
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    contextCta.classList.add('show');
                } else {
                    contextCta.classList.remove('show');
                }
            });
        }, { threshold: 0 });
        if(heroSection) ctaObserver.observe(heroSection);
    }

});