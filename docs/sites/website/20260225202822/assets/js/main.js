document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE NAVIGATION ---
    const navToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('mobile-nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll', !isOpen);
        });
    }

    // --- STICKY HEADER ---
    const header = document.getElementById('site-header');
    if (header) {
        const observer = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '10px 0px 0px 0px', threshold: 1 });
        observer.observe(document.body);
    }

    // --- SCROLL ANIMATIONS ---
    const animatedElements = document.querySelectorAll('.animate-in');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.stagger || '0') * 100;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    }

    // --- FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });

    // --- INTERACTIVE CHIROPRACTIC SECTION ---
    const interactiveSection = document.getElementById('interactive-chiropractic');
    if (interactiveSection) {
        const triggers = interactiveSection.querySelectorAll('.trigger-btn');
        const descriptions = interactiveSection.querySelectorAll('.description-content');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                triggers.forEach(t => t.classList.remove('active'));
                trigger.classList.add('active');
                descriptions.forEach(desc => desc.hidden = true);
                const targetId = trigger.dataset.target;
                const targetDesc = document.getElementById(targetId);
                if (targetDesc) targetDesc.hidden = false;
            });
        });
        if (triggers.length > 0) triggers[0].classList.add('active');
    }

    // --- TESTIMONIAL CAROUSEL ---
    const carouselContainer = document.getElementById('testimonial-carousel');
    if (carouselContainer) {
        const slides = carouselContainer.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        if (slides.length > 1) {
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

            // Clone for infinite scroll effect
            const firstClone = slides[0].cloneNode(true);
            const lastClone = slides[slides.length - 1].cloneNode(true);
            carouselContainer.appendChild(firstClone);
            carouselContainer.insertBefore(lastClone, slides[0]);
            carouselContainer.style.transition = 'none';
            currentIndex = 1;
            carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

            const allSlides = carouselContainer.querySelectorAll('.testimonial-slide');
            carouselContainer.style.width = `${allSlides.length * 100}%`;
            allSlides.forEach(s => s.style.width = `${100 / allSlides.length}%`);

            setTimeout(() => {
                carouselContainer.style.transition = 'transform var(--transition-base)';
            }, 50);

            nextBtn.addEventListener('click', () => {
                if (currentIndex >= allSlides.length - 1) return;
                currentIndex++;
                carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                updateDotsReal();
            });

            prevBtn.addEventListener('click', () => {
                if (currentIndex <= 0) return;
                currentIndex--;
                carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                updateDotsReal();
            });

            carouselContainer.addEventListener('transitionend', () => {
                if (currentIndex === 0) {
                    carouselContainer.style.transition = 'none';
                    currentIndex = allSlides.length - 2;
                    carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                    setTimeout(() => { carouselContainer.style.transition = 'transform var(--transition-base)'; });
                }
                if (currentIndex === allSlides.length - 1) {
                    carouselContainer.style.transition = 'none';
                    currentIndex = 1;
                    carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                    setTimeout(() => { carouselContainer.style.transition = 'transform var(--transition-base)'; });
                }
            });

            function updateDotsReal() {
                const realIndex = (currentIndex - 1 + slides.length) % slides.length;
                dotsContainer.querySelectorAll('.dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === realIndex);
                });
            }
            updateDotsReal();
        }
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- STICKY CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                stickyCta.hidden = false;
            } else {
                stickyCta.hidden = true;
            }
        }, { rootMargin: '-200px 0px 0px 0px' });
        const heroSection = document.querySelector('.hero');
        if (heroSection) observer.observe(heroSection);
    }
});