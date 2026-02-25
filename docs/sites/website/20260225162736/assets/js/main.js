document.addEventListener('DOMContentLoaded', () => {

    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    const initMobileMenu = () => {
        const toggleBtn = document.querySelector('.mobile-menu-toggle');
        const closeBtn = document.querySelector('.mobile-menu-close');
        const menu = document.querySelector('#mobile-menu');
        if (!toggleBtn || !menu) return;

        const openMenu = () => {
            menu.classList.add('open');
            menu.setAttribute('aria-hidden', 'false');
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
        };

        const closeMenu = () => {
            menu.classList.remove('open');
            menu.setAttribute('aria-hidden', 'true');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const initAccordions = () => {
        const accordionItems = document.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
                content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
            });
        });
    };

    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if(nextBtn) nextBtn.style.display = 'none';
            if(prevBtn) prevBtn.style.display = 'none';
            return;
        }

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => showSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const showSlide = (index) => {
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');
            currentIndex = (index + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        };

        nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const imgElement = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let currentImages = [];
        let currentIndex = 0;

        const showImage = (index) => {
            if (index < 0 || index >= currentImages.length) return;
            currentIndex = index;
            const imgPath = currentImages[currentIndex].dataset.kmImage.replace('../', '');
            imgElement.src = (window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/')) ? imgPath : `../${imgPath}`;
            imgElement.alt = currentImages[currentIndex].alt;
        };

        const openLightbox = (images, index) => {
            currentImages = images;
            showImage(index);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                imgElement.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };
        
        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        };

        document.querySelectorAll('[data-gallery]').forEach(gallery => {
            const images = Array.from(gallery.querySelectorAll('img'));
            images.forEach((img, index) => {
                img.parentElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLightbox(images, index);
                });
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        if (!banner || !acceptBtn) return;

        if (localStorage.getItem('cookiesAccepted') !== 'true') {
            banner.classList.add('visible');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            banner.classList.remove('visible');
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        const hero = document.querySelector('.hero');
        if (!cta || !hero) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    cta.classList.add('visible');
                } else {
                    cta.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        observer.observe(hero);
    };

    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initAccordions();
    initTestimonialCarousel();
    initLightbox();
    initCookieBanner();
    initStickyCTA();
});