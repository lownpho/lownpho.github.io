// ============================================================================
// Product Configuration & Constants
// ============================================================================
const videoExtra = 4.99;

// ============================================================================
// State Management (GLOBAL - shared with cart.js)
// ============================================================================
let scentOptions = {};
let prices = {};

// ============================================================================
// DOM Elements (cached references - will be populated on load)
// ============================================================================
const dom = {};

// ============================================================================
// Utilities
// ============================================================================
function formatEuro(n) {
    return '€' + n.toFixed(2).replace('.', ',');
}

// ============================================================================
// Product Updates
// ============================================================================
function updateProduct() {
    const gormita = document.querySelector('input[name="gormita"]:checked')?.value;
    const vasetto = document.querySelector('input[name="vasetto"]:checked')?.value;

    let basePrice = prices[vasetto] ?? 0;
    if (dom.videoCheckbox?.checked) basePrice += videoExtra;

    if (dom.priceDisplay) dom.priceDisplay.textContent = formatEuro(basePrice);
    if (dom.scentDisplay) dom.scentDisplay.textContent = scentOptions[gormita] ?? '';
}

// ============================================================================
// Data Loading
// ============================================================================
async function fetchJson(path) {
    try {
        const res = await fetch(path, { cache: 'no-store' });
        if (!res.ok) throw new Error(`fetch failed ${path}`);
        return await res.json();
    } catch (e) {
        console.warn('Could not load', path, e);
        return null;
    }
}

async function loadResourcesAndAvailability() {
    const [avail, scents, priceData] = await Promise.all([
        fetchJson('availability.json'),
        fetchJson('scents.json'),
        fetchJson('prices.json')
    ]);

    if (scents) scentOptions = scents;
    if (priceData) prices = priceData;
    if (avail) applyAvailability(avail);
    
    updateProduct();
}

// ============================================================================
// Availability Logic
// ============================================================================
function selectFirstAvailable(radioGroup) {
    const selected = document.querySelector(`input[name="${radioGroup}"]:checked`);
    const firstAvailable = Array.from(
        document.querySelectorAll(`input[name="${radioGroup}"]`)
    ).find(r => !r.disabled);

    if (firstAvailable && (!selected || selected.disabled)) {
        firstAvailable.checked = true;
    } else if (selected?.disabled) {
        selected.checked = false;
    }
}

function applyAvailabilityToGroup(radioGroup, availabilityKey, data) {
    document.querySelectorAll(`input[name="${radioGroup}"]`).forEach(radio => {
        const isAvailable = data[availabilityKey]?.[radio.value] ?? false;
        radio.disabled = !isAvailable;

        const textEl = radio.closest('.card-label')?.querySelector('.card-text');
        if (textEl) {
            textEl.classList.toggle('disabled', !isAvailable);
            if (!isAvailable) {
                textEl.setAttribute('title', 'Non disponibile');
            } else {
                textEl.removeAttribute('title');
            }
        }
    });
}

function applyAvailability(data) {
    applyAvailabilityToGroup('vasetto', 'vasetti', data);
    applyAvailabilityToGroup('gormita', 'popoli', data);
    
    selectFirstAvailable('vasetto');
    selectFirstAvailable('gormita');
    
    updateProduct();
}

// ============================================================================
// Event Initialization
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements AFTER they exist
    dom.gormitaRadios = document.querySelectorAll('input[name="gormita"]');
    dom.vasettoRadios = document.querySelectorAll('input[name="vasetto"]');
    dom.priceDisplay = document.getElementById('priceDisplay');
    dom.scentDisplay = document.getElementById('scentDisplay');
    dom.videoCheckbox = document.getElementById('videoCheckbox');

    // Load data and setup
    loadResourcesAndAvailability();

    // Attach event listeners
    dom.vasettoRadios.forEach(radio => radio.addEventListener('change', updateProduct));
    dom.gormitaRadios.forEach(radio => radio.addEventListener('change', updateProduct));
    dom.videoCheckbox?.addEventListener('change', updateProduct);
});