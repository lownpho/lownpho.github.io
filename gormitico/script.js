const scentOptions = {
    'air': 'aria fresca',
    'earth': 'sandalo',
    'fire': 'cannella',
    'forest': 'cocco'
}

const prices = {
    's': 12.99,
    'm': 14.99,
    'l': 16.99
}

const gormitaSelect = document.getElementById('gormita');
const vasettoSelect = document.getElementById('vasetto');
const addToCartButton = document.getElementById('addToCartButton');
const priceDisplay = document.getElementById('priceDisplay');
const scentDisplay = document.getElementById('scentDisplay');

function updateProduct() {
    const gormita = gormitaSelect.value;
    const vasetto = vasettoSelect.value;

    const price = prices[vasetto];
    priceDisplay.textContent = `€${price.toFixed(2)}`;

    console.log(gormita);
    scentDisplay.textContent = scentOptions[gormita];
}


document.addEventListener('DOMContentLoaded', () => {
    updateProduct();
});

vasettoSelect.addEventListener('change', updateProduct);
gormitaSelect.addEventListener('change', updateProduct);