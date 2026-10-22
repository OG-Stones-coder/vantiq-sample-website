/**
 * VANTIQ Luxury E-Commerce Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
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

    // 2. Sticky Navbar Glass Effect on Scroll
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

    // 3. Toast Notification Helper
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

    // 4. Cart Badge Counter & Add to Cart
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

    // 5. Wishlist Toggle
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

    // 6. Category Filtering
    const filterTabs = document.querySelectorAll('.category-tab');
    const productCards = document.querySelectorAll('.home-cat-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue || category === 'unisex') {
                    card.style.display = 'flex';
                    card.classList.remove('card-fade');
                    void card.offsetWidth;
                    card.classList.add('card-fade');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 7. Promo Code 1-Click Copy
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

    // 8. VIP Newsletter & Footer Forms
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

    // 9. Back to Top Button
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

