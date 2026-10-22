/**
 * VANTIQ Luxury E-Commerce Interactions
 * Includes Brand V-Logo Preloader & Skeleton Loaders
 */

// 1. Brand V-Logo Preloader Logic (Starts immediately before full DOMContentLoaded)
(function initBrandPreloader() {
    const preloader = document.getElementById('brandPreloader');
    const progressBar = document.getElementById('vLoaderBar');
    const startTime = Date.now();
    const minDisplayMs = 750; // Minimum time to showcase the luxury V-logo animation

    let progress = 15;
    if (progressBar) progressBar.style.width = '15%';

    const progressInterval = setInterval(() => {
        if (progress < 85) {
            progress += Math.floor(Math.random() * 12) + 5;
            if (progress > 85) progress = 85;
            if (progressBar) progressBar.style.width = progress + '%';
        }
    }, 120);

    function dismissPreloader() {
        clearInterval(progressInterval);
        if (progressBar) progressBar.style.width = '100%';

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minDisplayMs - elapsed);

        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }
        }, remaining);
    }

    if (document.readyState === 'complete') {
        dismissPreloader();
    } else {
        window.addEventListener('load', dismissPreloader);
        // Safety fallback: dismiss after max 2.2 seconds even on slow networks
        setTimeout(dismissPreloader, 2200);
    }

    // Expose programmatic trigger for demo or page transitions
    window.showVantiqLoader = function(durationMs = 900) {
        if (!preloader) return;
        preloader.style.display = 'flex';
        preloader.classList.remove('fade-out');
        if (progressBar) progressBar.style.width = '0%';
        setTimeout(() => { if (progressBar) progressBar.style.width = '100%'; }, 50);
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => { preloader.style.display = 'none'; }, 600);
        }, durationMs);
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileDrawerClose = document.getElementById('mobileDrawerClose');
    const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');

    function openMobileMenu() {
        if (mobileDrawer && mobileDrawerOverlay) {
            mobileDrawer.classList.add('open');
            mobileDrawerOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (mobileMenuBtn) {
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            }
        }
    }

    function closeMobileMenu() {
        if (mobileDrawer && mobileDrawerOverlay) {
            mobileDrawer.classList.remove('open');
            mobileDrawerOverlay.classList.remove('open');
            document.body.style.overflow = '';
            if (mobileMenuBtn) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }
    if (mobileDrawerClose) {
        mobileDrawerClose.addEventListener('click', closeMobileMenu);
    }
    if (mobileDrawerOverlay) {
        mobileDrawerOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close mobile drawer when clicking any link inside it
    const mobileDrawerLinks = document.querySelectorAll('.mobile-drawer-link, .mobile-drawer-footer a');
    mobileDrawerLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // 3. Image Skeleton Loader Handlers
    function initImageSkeletons() {
        const images = document.querySelectorAll('.home-cat-card-image, .hero-image');
        images.forEach(img => {
            const wrapper = img.closest('.card-image-wrapper') || img.closest('.hero-image-frame');
            const placeholder = wrapper ? wrapper.querySelector('.card-skeleton-placeholder') : null;

            function reveal() {
                img.classList.add('loaded');
                if (placeholder) {
                    placeholder.classList.add('loaded');
                }
            }

            if (img.complete) {
                // If already cached by browser
                setTimeout(reveal, 60);
            } else {
                img.addEventListener('load', reveal);
                img.addEventListener('error', reveal); // reveal anyway if error
            }
        });
    }
    initImageSkeletons();

    // 4. Sticky Navbar Glass Effect on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // 5. Toast Notification Helper
    const toast = document.getElementById('luxuryToast');
    const toastMessage = document.getElementById('toastMessage');
    let toastTimeout;

    function showToast(message) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // 6. Cart Badge Counter & Add to Cart
    let cartCount = 2; // initial demo items
    const cartBadge = document.getElementById('cartBadge');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cartCount++;
            if (cartBadge) {
                cartBadge.textContent = cartCount;
                cartBadge.classList.remove('bump');
                void cartBadge.offsetWidth; // trigger reflow
                cartBadge.classList.add('bump');
            }
            const productTitle = btn.getAttribute('data-product-name') || 'Item';
            showToast(`Added "${productTitle}" to your shopping bag.`);
        });
    });

    // 7. Wishlist Toggle
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = btn.classList.toggle('active');
            const productTitle = btn.getAttribute('data-product-name') || 'Item';
            if (isActive) {
                showToast(`Saved "${productTitle}" to your wishlist.`);
            } else {
                showToast(`Removed "${productTitle}" from wishlist.`);
            }
        });
    });

    // 8. Category Filtering with Skeleton Cards Transition
    const filterTabs = document.querySelectorAll('.category-tab');
    const productCards = document.querySelectorAll('.home-cat-card');
    const skeletonCards = document.querySelectorAll('.skeleton-card');
    let isFiltering = false;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (isFiltering) return;
            if (tab.classList.contains('active')) return;

            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');
            isFiltering = true;

            // 1. Temporarily hide actual product cards
            productCards.forEach(card => {
                card.style.display = 'none';
            });

            // 2. Show shimmering skeleton placeholders
            skeletonCards.forEach(sk => {
                sk.classList.add('active');
            });

            // 3. After short realistic shimmer duration (320ms), show filtered results
            setTimeout(() => {
                skeletonCards.forEach(sk => {
                    sk.classList.remove('active');
                });

                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue || category === 'unisex') {
                        card.style.display = 'flex';
                        card.classList.remove('card-fade');
                        void card.offsetWidth; // trigger reflow
                        card.classList.add('card-fade');
                    } else {
                        card.style.display = 'none';
                    }
                });

                isFiltering = false;
            }, 320);
        });
    });

    // 9. Promo Code 1-Click Copy
    const copyPromoBtn = document.getElementById('copyPromoBtn');
    if (copyPromoBtn) {
        copyPromoBtn.addEventListener('click', () => {
            const code = copyPromoBtn.getAttribute('data-code') || 'VANTIQ20';
            navigator.clipboard.writeText(code).then(() => {
                showToast(`Promo code "${code}" copied to clipboard!`);
            }).catch(() => {
                showToast(`Promo code is ${code}`);
            });
        });
    }

    // 10. VIP Newsletter & Footer Forms
    const vipForm = document.getElementById('vipForm');
    if (vipForm) {
        vipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = vipForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                showToast(`Welcome to the Private Circle. Check your inbox.`);
                emailInput.value = '';
            }
        });
    }

    const footerForm = document.getElementById('footerForm');
    if (footerForm) {
        footerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            if (emailInput && emailInput.value) {
                showToast(`Thank you for subscribing to VANTIQ journal.`);
                emailInput.value = '';
            }
        });
    }

    // 11. Back to Top Button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
