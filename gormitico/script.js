const scentOptions = {
    'air': 'aria fresca',
    'earth': 'sandalo',
    'fire': 'cannella',
    'forest': 'cocco',
    'sea': 'brezza marina',
    'light': 'fiori solari',
    'dark': 'ambra notturna'
}

const prices = {
    's': 12.99,
    'm': 14.99,
    'l': 16.99
}

const gormitaRadios = document.querySelectorAll('input[name="gormita"]');
const vasettoRadios = document.querySelectorAll('input[name="vasetto"]');
const addToCartButton = document.getElementById('addToCartButton');
const priceDisplay = document.getElementById('priceDisplay');
const scentDisplay = document.getElementById('scentDisplay');

function updateProduct() {
    const gormita = document.querySelector('input[name="gormita"]:checked').value;
    const vasetto = document.querySelector('input[name="vasetto"]:checked').value;

    const price = prices[vasetto];
    priceDisplay.textContent = `€${price.toFixed(2)}`;

    scentDisplay.textContent = scentOptions[gormita];
}

document.addEventListener('DOMContentLoaded', () => {
    updateProduct();
});

vasettoRadios.forEach(radio => radio.addEventListener('change', updateProduct));
gormitaRadios.forEach(radio => radio.addEventListener('change', updateProduct));