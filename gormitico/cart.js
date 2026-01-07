// ============================================================================
// Shopping Cart State
// ============================================================================
let cart = [];

// ============================================================================
// DOM Elements (cached references - will be populated on load)
// ============================================================================
const cartDOM = {};

// ============================================================================
// Gormita Naming (single source of truth)
// ============================================================================
const gormitaMapping = {
    display: { earth: 'terra', air: 'aria', forest: 'foresta', fire: 'fuoco', sea: 'mare', light: 'luce', dark: 'oscurità' },
    backend: { earth: 'terra', air: 'aria', forest: 'foresta', fire: 'fuoco', sea: 'mare', light: 'luce', dark: 'oscurita' }
};

// ============================================================================
// Utilities
// ============================================================================
function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function formatEuro(n) {
    return '€' + n.toFixed(2).replace('.', ',');
}

function getGormitaDisplayName(key) {
    if (!key) return key;
    const displayName = gormitaMapping.display[key];
    return displayName ? capitalize(displayName) : capitalize(key);
}

function buildLookupKey(vasetto, gormita, hasVideo) {
    const gKey = gormitaMapping.backend[gormita] ?? gormita;
    return `${vasetto}-${gKey}-${hasVideo ? 'video' : 'novideo'}`;
}

// ============================================================================
// Cart Rendering
// ============================================================================
function renderCart() {
    if (!cartDOM.cartItemsEl) return;

    cartDOM.cartItemsEl.innerHTML = '';

    // Handle empty cart
    const isEmpty = cart.length === 0;
    cartDOM.cartEmptyEl?.classList.toggle('show', isEmpty);
    cartDOM.cartCountEl && (cartDOM.cartCountEl.textContent = String(cart.length));

    if (isEmpty) {
        cartDOM.totalEl && (cartDOM.totalEl.textContent = formatEuro(0));
        return;
    }

    // Render items
    cart.forEach((item, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">
                    Candela Gormitica (${item.vasetto.toUpperCase()}, ${getGormitaDisplayName(item.gormita)})
                    ${item.video ? '<span class="cart-video-tag">+video</span>' : ''}
                </div>
                <div class="cart-item-meta">${item.scent}</div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-price">${formatEuro(item.price ?? 0)}</div>
                <button class="cart-item-remove" data-idx="${idx}" aria-label="Rimuovi">✕</button>
            </div>
        `;
        cartDOM.cartItemsEl.appendChild(itemEl);
    });

    // Update total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartDOM.totalEl && (cartDOM.totalEl.textContent = formatEuro(total));
}

// ============================================================================
// Cart Manipulation
// ============================================================================
function addCurrentProductToCart() {
    const gormita = document.querySelector('input[name="gormita"]:checked')?.value;
    const vasetto = document.querySelector('input[name="vasetto"]:checked')?.value;
    
    if (!vasetto || !gormita) return;

    const hasVideo = document.getElementById('videoCheckbox')?.checked ?? false;
    const basePrice = prices[vasetto] ?? 0;
    const itemPrice = basePrice + (hasVideo ? videoExtra : 0);

    const item = {
        vasetto,
        gormita,
        video: hasVideo,
        lookupKey: buildLookupKey(vasetto, gormita, hasVideo),
        price: Number(itemPrice),
        scent: scentOptions[gormita] ?? ''
    };

    cart.push(item);
    renderCart();
    resetSelections();
    
    if (typeof updateProduct === 'function') updateProduct();
}

function removeCartItem(idx) {
    if (idx >= 0 && idx < cart.length) {
        cart.splice(idx, 1);
        renderCart();
    }
}

// ============================================================================
// Cart UI Control
// ============================================================================
function resetSelections() {
    const selectDefault = (name, defaultValue) => {
        const default_radio = document.querySelector(`input[name="${name}"][value="${defaultValue}"]`);
        if (default_radio && !default_radio.disabled) {
            default_radio.checked = true;
            return;
        }
        
        const available = Array.from(document.querySelectorAll(`input[name="${name}"]`)).find(r => !r.disabled);
        if (available) available.checked = true;
    };

    selectDefault('vasetto', 's');
    selectDefault('gormita', 'air');
    
    const videoCheckbox = document.getElementById('videoCheckbox');
    if (videoCheckbox) videoCheckbox.checked = false;
}

function setCartCollapsed(collapsed) {
    if (!cartDOM.shoppingCart) return;
    
    cartDOM.shoppingCart.classList.toggle('collapsed', collapsed);
    cartDOM.cartToggle?.classList.toggle('rotated', !collapsed);
}

function toggleCart() {
    const isCollapsed = cartDOM.shoppingCart?.classList.contains('collapsed');
    setCartCollapsed(!isCollapsed);
}

// ============================================================================
// Checkout
// ============================================================================
async function handleCheckout() {
    try {
        const payload = {
            items: cart.map(i => ({ 
                lookupKey: i.lookupKey, 
                quantity: 1, 
                vasetto: i.vasetto 
            }))
        };

        const response = await fetch('http://127.0.0.1:5000/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { url } = await response.json();
        alert('Reindirizzamento alla pagina di pagamento: ' + url);
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Errore nel checkout: ' + error.message);
    }
}

// ============================================================================
// Event Initialization
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements AFTER they exist
    cartDOM.shoppingCart = document.getElementById('shoppingCart');
    cartDOM.cartToggle = document.getElementById('cartToggle');
    cartDOM.cartHeader = document.getElementById('cartHeader');
    cartDOM.cartItemsEl = document.getElementById('cartItems');
    cartDOM.cartCountEl = document.getElementById('cartCount');
    cartDOM.totalEl = document.getElementById('total');
    cartDOM.cartEmptyEl = document.getElementById('cartEmpty');
    cartDOM.addToCartButton = document.getElementById('addToCartButton');
    cartDOM.checkoutBtn = document.getElementById('checkoutBtn');

    // Render initial cart
    renderCart();

    // Cart interactions
    cartDOM.addToCartButton?.addEventListener('click', addCurrentProductToCart);
    cartDOM.cartToggle?.addEventListener('click', toggleCart);
    cartDOM.cartHeader?.addEventListener('click', toggleCart);

    // Remove item from cart
    cartDOM.cartItemsEl?.addEventListener('click', (e) => {
        const btn = e.target.closest('.cart-item-remove');
        if (!btn) return;
        e.stopPropagation();
        removeCartItem(Number(btn.getAttribute('data-idx')));
    });

    // Checkout handler
    cartDOM.checkoutBtn?.addEventListener('click', handleCheckout);

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (cartDOM.shoppingCart && !cartDOM.shoppingCart.contains(e.target)) {
            setCartCollapsed(true);
        }
    });
});