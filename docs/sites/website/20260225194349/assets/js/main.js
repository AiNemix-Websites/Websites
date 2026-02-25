document.addEventListener('DOMContentLoaded', () => {

    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
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

    const initMobileNav = () => {
        const toggleBtn = document.getElementById('mobile-nav-toggle');
        const menu = document.getElementById('mobile-nav-menu');
        if (!toggleBtn || !menu) return;

        toggleBtn.addEventListener('click', () => {
            const isOpen = toggleBtn.classList.toggle('active');
            menu.classList.toggle('open');
            toggleBtn.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        });
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!question || !answer) return;

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
    };

    const initBeforeAfterSlider = () => {
        const slider = document.getElementById('before-after-slider');
        if (!slider) return;

        const handle = slider.querySelector('.ba-slider-handle');
        const afterImage = slider.querySelector('.ba-image-after');
        let isDragging = false;

        const moveSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let pos = (x - rect.left) / rect.width;
            pos = Math.max(0, Math.min(1, pos));
            handle.style.left = (pos * 100) + '%';
            afterImage.style.clipPath = `polygon(${(pos * 100)}% 0, 100% 0, 100% 100%, ${(pos * 100)}% 100%)`;
        };

        slider.addEventListener('mousedown', () => isDragging = true);
        slider.addEventListener('touchstart', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('mousemove', (e) => isDragging && moveSlider(e.clientX));
        window.addEventListener('touchmove', (e) => isDragging && moveSlider(e.touches[0].clientX));
    };

    const initTestimonialCarousel = () => {
        const carousel = document.getElementById('testimonial-carousel');
        if (!carousel) return;
        const wrapper = carousel.closest('.testimonial-carousel-wrapper');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = wrapper.querySelector('.carousel-btn.prev');
        const nextBtn = wrapper.querySelector('.carousel-btn.next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) return;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const image = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let currentGroup = [];
        let currentIndex = -1;

        const showImage = (index) => {
            if (index < 0 || index >= currentGroup.length) return;
            currentIndex = index;
            const item = currentGroup[currentIndex];
            const imagePath = item.dataset.kmImage.startsWith('../') ? item.dataset.kmImage : `../${item.dataset.kmImage}`;
            const pagePath = window.location.pathname;
            const isHomePage = pagePath.endsWith('/') || pagePath.endsWith('index.html');
            image.src = isHomePage ? item.dataset.kmImage : `../${item.dataset.kmImage}`;
            image.alt = item.alt || 'Großansicht';
            prevBtn.style.display = currentGroup.length > 1 ? 'flex' : 'none';
            nextBtn.style.display = currentGroup.length > 1 ? 'flex' : 'none';
        };

        const openLightbox = (el) => {
            const groupName = el.dataset.lightboxTrigger;
            currentGroup = [...document.querySelectorAll(`[data-lightbox-trigger='${groupName}']`)];
            const index = currentGroup.indexOf(el);
            document.body.classList.add('no-scroll');
            lightbox.classList.add('visible');
            showImage(index);
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            document.body.classList.remove('no-scroll');
            lightbox.classList.remove('visible');
            document.removeEventListener('keydown', handleKeydown);
            currentGroup = [];
            currentIndex = -1;
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        };

        document.body.addEventListener('click', (e) => {
            if (e.target.matches('[data-lightbox-trigger]')) {
                e.preventDefault();
                openLightbox(e.target);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookiesAccepted')) {
            banner.classList.add('visible');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            banner.classList.remove('visible');
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initFaqAccordion();
    initBeforeAfterSlider();
    initTestimonialCarousel();
    initLightbox();
    initCookieBanner();
    initStickyCTA();
});