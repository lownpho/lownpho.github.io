let cart = [];

const shoppingCart = document.getElementById('shoppingCart');
const cartToggle = document.getElementById('cartToggle');
const cartHeader = document.getElementById('cartHeader');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const totalEl = document.getElementById('total');
const cartEmptyEl = document.getElementById('cartEmpty');
const addToCartButton = document.getElementById('addToCartButton');
const checkoutBtn = document.getElementById('checkoutBtn');

function capitalize(s) { if (!s) return s; return s.charAt(0).toUpperCase() + s.slice(1); }

const gormitaNames = {
    earth: 'terra',
    air: 'aria',
    forest: 'foresta',
    fire: 'fuoco',
    sea: 'mare',
    light: 'luce',
    dark: 'oscurità',
};

function getGormitaDisplayName(key) {
    if (!key) return key;
    return gormitaNames[key] ? capitalize(gormitaNames[key]) : capitalize(key);
}

function renderCart() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
        if (cartEmptyEl) cartEmptyEl.classList.add('show');
        if (cartCountEl) cartCountEl.textContent = '0';
        if (totalEl) totalEl.textContent = formatEuro(0);
        return;
    }
    if (cartEmptyEl) cartEmptyEl.classList.remove('show');
    cart.forEach((item, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">Candela Gormitica (${item.vasetto.toUpperCase()}, ${capitalize(item.gormita)}) ${item.video ? '<span class="cart-video-tag">+video</span>' : ''}</div>
                <div class="cart-item-meta">${item.scent}</div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-price">${formatEuro(item.price)}</div>
                <button class="cart-item-remove" data-idx="${idx}" aria-label="Rimuovi">✕</button>
            </div>
        `;
        cartItemsEl.appendChild(itemEl);
    });

    if (cartCountEl) cartCountEl.textContent = String(cart.length);
    const total = cart.reduce((s, it) => s + it.price, 0);
    if (totalEl) totalEl.textContent = formatEuro(total);
}

function resetSelections() {
    const preferV = document.querySelector('input[name="vasetto"][value="s"]');
    const vasettoRadios = document.querySelectorAll('input[name="vasetto"]');
    const gormitaRadios = document.querySelectorAll('input[name="gormita"]');
    if (preferV && !preferV.disabled) preferV.checked = true;
    else {
        const firstAvailable = Array.from(vasettoRadios).find(r => !r.disabled);
        if (firstAvailable) firstAvailable.checked = true;
    }
    const preferG = document.querySelector('input[name="gormita"][value="air"]');
    if (preferG && !preferG.disabled) preferG.checked = true;
    else {
        const firstAvailable = Array.from(gormitaRadios).find(r => !r.disabled);
        if (firstAvailable) firstAvailable.checked = true;
    }
    const videoCheckboxLocal = document.getElementById('videoCheckbox');
    if (videoCheckboxLocal) videoCheckboxLocal.checked = false;
}

function addCurrentProductToCart() {
    const gormita = document.querySelector('input[name="gormita"]:checked')?.value;
    const vasetto = document.querySelector('input[name="vasetto"]:checked')?.value;
    if (!vasetto || !gormita) return;

    const base = (prices && prices[vasetto]) ? prices[vasetto] : 0;
    const hasVideo = !!(document.getElementById('videoCheckbox') && document.getElementById('videoCheckbox').checked);
    const itemPrice = base + (hasVideo ? videoExtra : 0);
    const item = {
        vasetto,
        gormita,
        video: hasVideo,
        price: Number(itemPrice),
        scent: scentOptions[gormita] || ''
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

function setCartCollapsed(collapsed) {
    if (!shoppingCart) return;
    if (collapsed) {
        shoppingCart.classList.add('collapsed');
        if (cartToggle) cartToggle.classList.remove('rotated');
    } else {
        shoppingCart.classList.remove('collapsed');
        if (cartToggle) cartToggle.classList.add('rotated');
    }
}
function toggleCart() {
    if (!shoppingCart) return;
    const isCollapsed = shoppingCart.classList.contains('collapsed');
    setCartCollapsed(!isCollapsed);
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

if (addToCartButton) addToCartButton.addEventListener('click', addCurrentProductToCart);
if (cartToggle) cartToggle.addEventListener('click', toggleCart);
if (cartHeader) cartHeader.addEventListener('click', toggleCart);

document.addEventListener('click', (e) => {
    if (!shoppingCart) return;
    if (!shoppingCart.contains(e.target)) {
        setCartCollapsed(true);
    }
});

if (cartItemsEl) {
    cartItemsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.cart-item-remove');
        if (!btn) return;
        e.stopPropagation();
        const idx = Number(btn.getAttribute('data-idx'));
        removeCartItem(idx);
    });
}

if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    cart = [];
    renderCart();
    setCartCollapsed(true);
});
