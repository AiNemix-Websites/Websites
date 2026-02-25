document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER --- //
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

    // --- MOBILE NAVIGATION --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.toggle('open');
            mobileNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            mobileNav.setAttribute('aria-hidden', !isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        });

        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) { // Click on backdrop
                closeMobileNav();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                closeMobileNav();
            }
        });

        function closeMobileNav() {
            navToggle.classList.remove('open');
            mobileNav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        }
    }

    // --- SCROLL REVEAL --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- FAQ ACCORDION --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.padding = '0 0 1.5rem 0';
                } else {
                    answer.style.maxHeight = '0';
                    answer.style.padding = '0';
                }
            });
        }
    });

    // --- TESTIMONIAL CAROUSEL --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('show');
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('show');
                } else {
                    stickyCta.classList.remove('show');
                }
            });
        }, { threshold: 0.1 });
        const heroSection = document.querySelector('.hero');
        if (heroSection) ctaObserver.observe(heroSection);
    }

    // --- GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('figcaption');
    const galleryLinks = document.querySelectorAll('.lightbox-gallery a');
    let currentImageIndex = 0;

    if (lightbox && galleryLinks.length > 0) {
        const images = Array.from(galleryLinks).map(link => ({
            src: link.href,
            alt: link.querySelector('img')?.alt || 'Galeriebild'
        }));

        function showImage(index) {
            const imgData = images[index];
            lightboxImg.src = imgData.src;
            lightboxImg.alt = imgData.alt;
            lightboxCaption.textContent = imgData.alt;
            currentImageIndex = index;
        }

        function openLightbox(index) {
            showImage(index);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('no-scroll');
        }

        function closeLightbox() {
            lightbox.classList.remove('show');
            setTimeout(() => lightbox.style.display = 'none', 350);
            document.body.classList.remove('no-scroll');
        }

        galleryLinks.forEach((link, index) => {
            link.addEventListener('click', e => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        lightbox.querySelector('.close-btn').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });

        lightbox.querySelector('.next-btn').addEventListener('click', () => {
            const nextIndex = (currentImageIndex + 1) % images.length;
            showImage(nextIndex);
        });

        lightbox.querySelector('.prev-btn').addEventListener('click', () => {
            const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        });

        document.addEventListener('keydown', e => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') lightbox.querySelector('.next-btn').click();
                if (e.key === 'ArrowLeft') lightbox.querySelector('.prev-btn').click();
            }
        });
    }
});