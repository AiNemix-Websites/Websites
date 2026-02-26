document.addEventListener('DOMContentLoaded', () => {

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

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
            });
        }
    });

    // --- Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger-group');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('reveal-stagger-group')) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.setProperty('--stagger-index', i);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-controls .prev');
        const nextButton = document.querySelector('.carousel-controls .next');
        let currentIndex = 0;

        function showSlide(index) {
            carousel.style.transform = `translateX(-${index * 100}%)`;
        }

        function updateButtons() {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
        }

        if (prevButton && nextButton && slides.length > 0) {
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    showSlide(currentIndex);
                    updateButtons();
                }
            });

            nextButton.addEventListener('click', () => {
                if (currentIndex < slides.length - 1) {
                    currentIndex++;
                    showSlide(currentIndex);
                    updateButtons();
                }
            });
            showSlide(currentIndex);
            updateButtons();
        }
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Context CTA ---
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                contextCta.classList.add('visible');
            } else {
                contextCta.classList.remove('visible');
            }
        });
    }

});