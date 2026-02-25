document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileMenuToggle && mainNav) {
        const toggleMenu = () => {
            document.body.classList.toggle('nav-open');
        };

        mobileMenuToggle.addEventListener('click', toggleMenu);

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
                toggleMenu();
            }
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = (el.dataset.staggerIndex || 0) * 100;
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, delay);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        // Show banner if consent not given
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('visible'), 100); 
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.style.display = 'none', 500);
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Show CTA when hero is NOT intersecting (scrolled past it)
                    if (!entry.isIntersecting) {
                        stickyCTA.classList.add('visible');
                    } else {
                        stickyCTA.classList.remove('visible');
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(heroSection);
        }
    }
    
    // --- Blog Filter --- //
    const filterControls = document.getElementById('blog-filter-controls');
    const postsGrid = document.getElementById('blog-posts-grid');
    const noResultsMessage = document.getElementById('no-results-message');

    if (filterControls && postsGrid) {
        const filterButtons = filterControls.querySelectorAll('.filter-btn');
        const allPosts = postsGrid.querySelectorAll('.blog-post');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;
                let visibleCount = 0;

                allPosts.forEach(post => {
                    const category = post.dataset.category;
                    const shouldShow = (filter === 'all' || category === filter);
                    
                    post.style.display = shouldShow ? '' : 'none';
                    if (shouldShow) {
                        visibleCount++;
                    }
                });

                if (noResultsMessage) {
                    noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
                }
            });
        });
    }
});