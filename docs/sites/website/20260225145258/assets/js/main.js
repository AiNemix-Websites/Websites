document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
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
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    if (menuToggle && mobileNavContainer) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('open');
            mobileNavContainer.classList.toggle('open');
            document.body.classList.toggle('no-scroll', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        mobileNavContainer.addEventListener('click', (e) => {
            if (e.target === mobileNavContainer) {
                menuToggle.classList.remove('open');
                mobileNavContainer.classList.remove('open');
                document.body.classList.remove('no-scroll');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                const staggerGroup = entry.target.querySelectorAll('.reveal-stagger-group > *');
                if(staggerGroup.length > 0) {
                    staggerGroup.forEach((child, index) => {
                        child.style.transitionDelay = `${index * 100}ms`;
                        child.classList.add('revealed'); // Assuming children also have reveal-on-scroll class
                    });
                } else {
                     const group = entry.target.closest('.reveal-stagger-group');
                     if(group) {
                        const children = Array.from(group.children);
                        const index = children.indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 100}ms`;
                     }
                }
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
        // Also add reveal class to children of stagger groups for individual animation
        const staggerChildren = el.querySelectorAll('.reveal-stagger-group > *');
        staggerChildren.forEach(child => child.classList.add('reveal-on-scroll'));
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -200px 0px' });
        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
    
    // --- Project Filter --- //
    const filterContainer = document.querySelector('.project-filters');
    if (filterContainer) {
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                projectCards.forEach(card => {
                    if (filter === 'Alle' || card.dataset.category === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // --- Testimonial Carousel --- //
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const track = carouselContainer.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carouselContainer.querySelector('.carousel-next');
        const prevButton = carouselContainer.querySelector('.carousel-prev');
        const dotsNav = carouselContainer.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
            const currentDot = dotsNav.querySelector('.active');
            if(currentDot) currentDot.classList.remove('active');
            dotsNav.children[currentIndex].classList.add('active');
        };

        // Create dots
        slides.forEach((slide, index) => {
            const button = document.createElement('button');
            button.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(button);
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });
        
        // Touch controls
        let startX = 0;
        let endX = 0;
        track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            if(startX > endX + 50) { // Swipe left
                 if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
            } else if (startX < endX - 50) { // Swipe right
                 if (currentIndex > 0) moveToSlide(currentIndex - 1);
            }
        });

        moveToSlide(0);
    }

    // --- Global Keydown Listener for Modals --- //
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu
            if (mobileNavContainer && mobileNavContainer.classList.contains('open')) {
                menuToggle.click();
            }
            // Close lightbox (if implemented and open)
            const lightbox = document.getElementById('km-lightbox');
            if (lightbox && lightbox.style.display === 'flex') {
                closeLightbox();
            }
        }
    });

    // --- Lightbox (Code ready, but no images to trigger it) ---
    // This part is included for future use when images are added.
    // To use, add class 'lightbox-trigger' to clickable image containers.
    // const lightbox = document.getElementById('km-lightbox');
    // const lightboxImg = lightbox.querySelector('img');
    // const triggers = document.querySelectorAll('.lightbox-trigger');
    // let currentImageIndex;

    // function openLightbox(index) { ... }
    // function closeLightbox() { ... }
    // function showImage(index) { ... }

});