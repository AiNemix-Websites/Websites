document.addEventListener('DOMContentLoaded', () => {

    // --- HEADER SCROLL & STICKY CTA --- //
    const header = document.getElementById('main-header');
    const stickyCta = document.getElementById('sticky-cta');
    const scrollThreshold = 50;

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
            if (stickyCta) stickyCta.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            if (stickyCta) stickyCta.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // --- MOBILE MENU --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            document.body.classList.toggle('mobile-menu-open');
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('no-scroll', !isExpanded);
        });
    }

    // --- SCROLL REVEAL ANIMATIONS --- //
    const animatedElements = document.querySelectorAll('.animate-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'block';
        setTimeout(() => cookieBanner.classList.add('show'), 100);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- FOOTER YEAR --- //
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- LIGHTBOX --- //
    const lightbox = {
        element: document.getElementById('km-lightbox'),
        imgElement: null,
        closeBtn: null,
        prevBtn: null,
        nextBtn: null,
        gallery: [],
        currentIndex: -1,

        init() {
            if (!this.element) return;
            this.imgElement = this.element.querySelector('img');
            this.closeBtn = this.element.querySelector('.lightbox-close');
            this.prevBtn = this.element.querySelector('.lightbox-prev');
            this.nextBtn = this.element.querySelector('.lightbox-next');

            document.body.addEventListener('click', e => {
                if (e.target.classList.contains('lightbox-trigger')) {
                    e.preventDefault();
                    this.updateGallery(e.target);
                    const clickedSrc = e.target.dataset.kmImage || e.target.src;
                    this.currentIndex = this.gallery.findIndex(src => src === clickedSrc);
                    this.open();
                }
            });

            this.closeBtn.addEventListener('click', () => this.close());
            this.element.addEventListener('click', e => {
                if (e.target === this.element) this.close();
            });
            this.prevBtn.addEventListener('click', () => this.showPrev());
            this.nextBtn.addEventListener('click', () => this.showNext());

            document.addEventListener('keydown', e => {
                if (this.element.classList.contains('visible')) {
                    if (e.key === 'Escape') this.close();
                    if (e.key === 'ArrowLeft') this.showPrev();
                    if (e.key === 'ArrowRight') this.showNext();
                }
            });
        },

        updateGallery(clickedElement) {
            // Find all triggers in the same logical container (e.g., section, grid)
            const container = clickedElement.closest('.gallery-grid, .testimonial-carousel');
            const triggers = container ? container.querySelectorAll('.lightbox-trigger') : document.querySelectorAll('.lightbox-trigger');
            this.gallery = Array.from(triggers).map(el => el.dataset.kmImage || el.src);
        },

        open() {
            if (this.currentIndex === -1) return;
            this.updateImage();
            this.element.style.display = 'flex';
            setTimeout(() => this.element.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
        },

        close() {
            this.element.classList.remove('visible');
            setTimeout(() => { this.element.style.display = 'none'; }, 300);
            document.body.classList.remove('no-scroll');
        },

        updateImage() {
            const relativePath = this.gallery[this.currentIndex];
            // Adjust path for subdirectories if needed
            const isSubdirectory = window.location.pathname.split('/').length > 2;
            const imagePath = isSubdirectory ? `../${relativePath}` : relativePath;
            this.imgElement.src = imagePath;
            this.prevBtn.style.display = this.currentIndex > 0 ? 'block' : 'none';
            this.nextBtn.style.display = this.currentIndex < this.gallery.length - 1 ? 'block' : 'none';
        },

        showPrev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.updateImage();
            }
        },

        showNext() {
            if (this.currentIndex < this.gallery.length - 1) {
                this.currentIndex++;
                this.updateImage();
            }
        }
    };

    lightbox.init();

    // --- CAROUSEL --- //
    const carousel = document.getElementById('impressions-carousel');
    if (carousel) {
        const prevBtn = carousel.parentElement.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.parentElement.querySelector('.carousel-btn.next');
        const slides = carousel.querySelectorAll('.carousel-slide');

        const scrollCarousel = (direction) => {
            const slideWidth = slides[0].clientWidth;
            carousel.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
        };

        prevBtn.addEventListener('click', () => scrollCarousel(-1));
        nextBtn.addEventListener('click', () => scrollCarousel(1));
    }
});