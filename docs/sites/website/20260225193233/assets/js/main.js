document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE NAVIGATION ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', isActive);
            document.body.classList.toggle('scroll-locked', isActive);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('scroll-locked');
            }
        });
    }

    // --- STICKY HEADER ---
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

    // --- SCROLL REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- ACCORDION ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.carousel-next');
        const prevButton = document.querySelector('.carousel-prev');
        const dotsNav = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => moveToSlide(i));
            dotsNav.appendChild(dot);
        });
        const dots = Array.from(dotsNav.children);

        const moveToSlide = (targetIndex) => {
            carousel.style.transform = 'translateX(-' + targetIndex * 100 + '%)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        };

        nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });
        
        // Initial setup
        moveToSlide(0);
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('visible');
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- STICKY CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- LIGHTBOX (Singleton Pattern) ---
    // Even if no images are used, the functionality is required by the prompt.
    const lightbox = {
        element: document.getElementById('km-lightbox'),
        content: document.querySelector('.lightbox-content'),
        closeBtn: document.querySelector('.km-lightbox .close-btn'),
        prevBtn: document.querySelector('.km-lightbox .prev-btn'),
        nextBtn: document.querySelector('.km-lightbox .next-btn'),
        gallery: [],
        currentIndex: 0,

        init() {
            if (!this.element) return;
            this.closeBtn.addEventListener('click', () => this.close());
            this.element.addEventListener('click', (e) => {
                if (e.target === this.element) this.close();
            });
            document.addEventListener('keydown', (e) => {
                if (this.element.classList.contains('visible')) {
                    if (e.key === 'Escape') this.close();
                    if (e.key === 'ArrowRight') this.next();
                    if (e.key === 'ArrowLeft') this.prev();
                }
            });

            this.prevBtn.addEventListener('click', () => this.prev());
            this.nextBtn.addEventListener('click', () => this.next());
        },

        open(imageSrc, galleryItems) {
            this.gallery = galleryItems || [imageSrc];
            this.currentIndex = this.gallery.indexOf(imageSrc);
            this.loadImage();
            this.element.style.display = 'flex';
            setTimeout(() => this.element.classList.add('visible'), 10);
            document.body.classList.add('scroll-locked');
        },

        close() {
            this.element.classList.remove('visible');
            setTimeout(() => {
                this.element.style.display = 'none';
                this.content.innerHTML = '';
            }, 300);
            document.body.classList.remove('scroll-locked');
        },

        loadImage() {
            const img = document.createElement('img');
            img.src = this.gallery[this.currentIndex];
            this.content.innerHTML = '';
            this.content.appendChild(img);
            this.updateNav();
        },

        prev() {
            if (this.gallery.length > 1) {
                this.currentIndex = (this.currentIndex - 1 + this.gallery.length) % this.gallery.length;
                this.loadImage();
            }
        },

        next() {
            if (this.gallery.length > 1) {
                this.currentIndex = (this.currentIndex + 1) % this.gallery.length;
                this.loadImage();
            }
        },

        updateNav() {
            if (this.gallery.length <= 1) {
                this.prevBtn.style.display = 'none';
                this.nextBtn.style.display = 'none';
            } else {
                this.prevBtn.style.display = 'block';
                this.nextBtn.style.display = 'block';
            }
        }
    };

    lightbox.init();

});