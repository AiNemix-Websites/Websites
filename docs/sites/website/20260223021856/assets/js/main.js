document.addEventListener('DOMContentLoaded', () => {

    const initStickyHeader = () => {
        const header = document.getElementById('main-header');
        if (!header) return;
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    const initMobileMenu = () => {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const closeBtn = document.getElementById('mobile-menu-close');
        const menu = document.getElementById('mobile-menu');
        const backdrop = document.getElementById('menu-backdrop');
        const mainContent = document.querySelector('main');

        if (!toggleBtn || !menu || !backdrop || !closeBtn) return;

        const openMenu = () => {
            menu.classList.add('open');
            menu.setAttribute('aria-hidden', 'false');
            toggleBtn.setAttribute('aria-expanded', 'true');
            backdrop.classList.add('open');
            document.body.classList.add('no-scroll');
            mainContent.setAttribute('inert', '');
            closeBtn.focus();
        };

        const closeMenu = () => {
            menu.classList.remove('open');
            menu.setAttribute('aria-hidden', 'true');
            toggleBtn.setAttribute('aria-expanded', 'false');
            backdrop.classList.remove('open');
            document.body.classList.remove('no-scroll');
            mainContent.removeAttribute('inert');
            toggleBtn.focus();
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                closeMenu();
            }
        });
    };

    const initScrollReveal = () => {
        const elements = document.querySelectorAll('.scroll-reveal');
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    };

    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const wrapper = carousel.closest('.testimonial-carousel-wrapper');
        const prevBtn = wrapper.querySelector('.carousel-prev');
        const nextBtn = wrapper.querySelector('.carousel-next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        const slides = Array.from(carousel.children);
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = Array.from(dotsContainer.children);

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots[currentIndex].classList.remove('active');
            dots[index].classList.add('active');
            currentIndex = index;
        };

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
        carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) nextBtn.click();
            if (touchEndX - touchStartX > 50) prevBtn.click();
        });
    };

    const initFaqAccordion = () => {
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
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');

        if (!banner || !acceptBtn || !declineBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => banner.classList.add('show'), 1000);
        }

        const hideBanner = () => banner.classList.remove('show');

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            hideBanner();
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'false');
            hideBanner();
        });
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const triggers = document.querySelectorAll('.lightbox-trigger');
        if (triggers.length === 0) return;

        const galleryImages = Array.from(triggers).map(t => t.href);
        let currentIndex = 0;

        const img = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const backdrop = lightbox.querySelector('.km-lightbox-backdrop');

        const showImage = (index) => {
            img.src = galleryImages[index];
            currentIndex = index;
            prevBtn.style.display = index === 0 ? 'none' : 'block';
            nextBtn.style.display = index === galleryImages.length - 1 ? 'none' : 'block';
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const index = galleryImages.indexOf(e.currentTarget.href);
            showImage(index);
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        triggers.forEach(trigger => trigger.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft' && currentIndex > 0) prevBtn.click();
            if (e.key === 'ArrowRight' && currentIndex < galleryImages.length - 1) nextBtn.click();
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        const trigger = document.querySelector('.main-footer');
        if (!cta || !trigger) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when footer is NOT visible
                if (!entry.isIntersecting && window.scrollY > 400) {
                    cta.classList.add('show');
                } else {
                    cta.classList.remove('show');
                }
            });
        }, { threshold: 0 });

        observer.observe(trigger);
    };

    // Initialize all modules
    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initTestimonialCarousel();
    initFaqAccordion();
    initCookieBanner();
    initLightbox();
    initStickyCTA();
});