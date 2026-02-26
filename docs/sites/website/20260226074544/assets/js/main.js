document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const nav = document.querySelector('.main-nav');
    const navToggle = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('main-menu');
    if (navToggle && menu) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('is-open');
            const isOpen = nav.classList.contains('is-open');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        });

        // Close on link click
        menu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                nav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
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

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'flex';
        }
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const triggers = document.querySelectorAll('[data-lightbox-trigger]');

        const openLightbox = (src, alt) => {
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('is-visible'), 10);
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
                lightboxImg.alt = '';
            }, 300);
            document.body.classList.remove('no-scroll');
        };

        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const src = trigger.src.replace('/..', '.');
                const alt = trigger.alt;
                openLightbox(src, alt);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-visible')) closeLightbox();
        });
    }

    // --- Sticky Context CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the header is not intersecting (i.e., scrolled past)
                if (!entry.isIntersecting) {
                    stickyCta.style.display = 'block';
                    setTimeout(() => stickyCta.classList.add('is-visible'), 10);
                } else {
                    stickyCta.classList.remove('is-visible');
                    setTimeout(() => stickyCta.style.display = 'none', 300);
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });
        ctaObserver.observe(header);
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedbackEl = document.getElementById('form-feedback');
            feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wurde empfangen.';
            feedbackEl.className = 'form-feedback success';
            feedbackEl.style.display = 'block';
            contactForm.reset();
        });
    }

    // --- Sub-Nav Active State on Scroll (Leistungen page) --- //
    const subNav = document.getElementById('sub-nav');
    if (subNav) {
        const scrollTargets = document.querySelectorAll('.scroll-target');
        const subNavLinks = subNav.querySelectorAll('a');
        const offset = subNav.offsetHeight + header.offsetHeight + 20;

        const onScroll = () => {
            let currentId = '';
            scrollTargets.forEach(target => {
                if (window.scrollY >= target.offsetTop - offset) {
                    currentId = target.id;
                }
            });

            subNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === currentId) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', onScroll);
        onScroll(); // Initial check
    }
});