document.addEventListener('DOMContentLoaded', () => {

    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    };

    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const drawer = document.querySelector('#mobile-menu');
        if (!toggleBtn || !drawer) return;

        toggleBtn.addEventListener('click', () => {
            const isOpen = toggleBtn.classList.toggle('active');
            drawer.classList.toggle('open');
            toggleBtn.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        });
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -50px 0px' });

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
                answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
            });
        });
    };

    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const wrapper = carousel.closest('.testimonial-carousel-wrapper');
        const prevBtn = wrapper.querySelector('.prev');
        const nextBtn = wrapper.querySelector('.next');
        const dotsContainer = wrapper.querySelector('.dots');
        const slides = Array.from(carousel.children);
        let slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const getVisibleSlides = () => {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        };

        const totalPages = () => Math.ceil(slides.length / getVisibleSlides());

        const updateCarousel = () => {
            const visibleSlides = getVisibleSlides();
            const offset = (currentIndex * slideWidth * visibleSlides);
            carousel.style.transform = `translateX(-${offset}px)`;
            updateDots();
        };

        const createDots = () => {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalPages(); i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            }
        };

        const updateDots = () => {
            const dots = Array.from(dotsContainer.children);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalPages();
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalPages()) % totalPages();
            updateCarousel();
        });

        const setup = () => {
            slideWidth = slides[0].getBoundingClientRect().width / getVisibleSlides();
            createDots();
            updateCarousel();
        }

        window.addEventListener('resize', setup);
        setup();
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => banner.classList.add('visible'), 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('visible');
        });
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const contentImg = lightbox.querySelector('.lightbox-content img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        let galleryImages = [];
        let currentIndex = 0;

        const imageTriggers = document.querySelectorAll('.lightbox-trigger');
        if (imageTriggers.length > 0) {
            galleryImages = Array.from(imageTriggers).map(img => img.dataset.kmImage || img.src);
        }

        const showImage = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentIndex = index;
            contentImg.src = galleryImages[index].startsWith('..') ? galleryImages[index] : `../${galleryImages[index]}`.replace('../assets', 'assets');
            // A bit of a hack for relative paths, works for one level deep
            const path = window.location.pathname;
            const depth = (path.match(/\//g) || []).length -1;
            let prefix = depth > 1 ? '../' : '';
            contentImg.src = `${prefix}${galleryImages[index]}`;
        };

        const openLightbox = (e) => {
            const imgSrc = e.currentTarget.dataset.kmImage || e.currentTarget.src;
            const index = galleryImages.findIndex(src => src.includes(imgSrc.split('/').pop()));
            if (index > -1) {
                showImage(index);
                lightbox.style.display = 'flex';
                setTimeout(() => lightbox.classList.add('visible'), 10);
                document.body.classList.add('no-scroll');
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
                lightbox.style.display = 'none';
                contentImg.src = '';
            }, 300);
        };

        imageTriggers.forEach(trigger => {
            trigger.addEventListener('click', openLightbox);
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    };

    const initContextCta = () => {
        const cta = document.getElementById('context-cta');
        if (!cta) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        }, { passive: true });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initFaqAccordion();
    initTestimonialCarousel();
    initCookieBanner();
    initLightbox();
    initContextCta();
});