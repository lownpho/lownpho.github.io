const videoExtra = 4.99;

let scentOptions = {};
let prices = {};

const gormitaRadios = document.querySelectorAll('input[name="gormita"]');
const vasettoRadios = document.querySelectorAll('input[name="vasetto"]');
const priceDisplay = document.getElementById('priceDisplay');
const scentDisplay = document.getElementById('scentDisplay');
const videoCheckbox = document.getElementById('videoCheckbox');

function formatEuro(n) {
    return '€' + n.toFixed(2).replace('.', ',');
}

function updateProduct() {
    const gormita = document.querySelector('input[name="gormita"]:checked')?.value;
    const vasetto = document.querySelector('input[name="vasetto"]:checked')?.value;

    let basePrice = (prices && prices[vasetto]) ? prices[vasetto] : 0;
    if (videoCheckbox && videoCheckbox.checked) basePrice += videoExtra;

    priceDisplay.textContent = formatEuro(basePrice);

    if (gormita && scentOptions[gormita]) scentDisplay.textContent = scentOptions[gormita];
}

async function fetchJson(path) {
	try {
		const res = await fetch(path, { cache: 'no-store' });
		if (!res.ok) throw new Error('fetch failed ' + path);
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
	else updateProduct();
}

function applyAvailability(data) {
    vasettoRadios.forEach(radio => {
        const ok = data.vasetti && data.vasetti[radio.value];
        radio.disabled = !ok;
        const label = radio.closest('.card-label');
        const text = label && label.querySelector('.card-text');
        if (text) {
            text.classList.toggle('disabled', !ok);
            if (!ok) text.setAttribute('title', 'Non disponibile');
            else text.removeAttribute('title');
        }
    });

    gormitaRadios.forEach(radio => {
        const ok = data.popoli && data.popoli[radio.value];
        radio.disabled = !ok;
        const label = radio.closest('.card-label');
        const text = label && label.querySelector('.card-text');
        if (text) {
            text.classList.toggle('disabled', !ok);
            if (!ok) text.setAttribute('title', 'Non disponibile');
            else text.removeAttribute('title');
        }
    });

    const selectedV = document.querySelector('input[name="vasetto"]:checked');
    if (!selectedV || selectedV.disabled) {
        const firstAvailable = Array.from(vasettoRadios).find(r => !r.disabled);
        if (firstAvailable) firstAvailable.checked = true;
        else if (selectedV) selectedV.checked = false;
    }

    const selectedG = document.querySelector('input[name="gormita"]:checked');
    if (!selectedG || selectedG.disabled) {
        const firstAvailable = Array.from(gormitaRadios).find(r => !r.disabled);
        if (firstAvailable) firstAvailable.checked = true;
        else if (selectedG) selectedG.checked = false;
    }

    updateProduct();
}

// event listeners
document.addEventListener('DOMContentLoaded', () => {
	loadResourcesAndAvailability();
});

vasettoRadios.forEach(radio => radio.addEventListener('change', updateProduct));
gormitaRadios.forEach(radio => radio.addEventListener('change', updateProduct));
if (videoCheckbox) videoCheckbox.addEventListener('change', updateProduct);