/*  fanfole.js — extracts text from Gnòsi delle fànfole (Fosco Maraini)
    Fetches the poem file, parses it, and fills placeholder elements. 
    
    This is probably against every copyright law in exstence...
  */

const POEM_TITLES = [
  'Gnòsi delle fànfole', 'Il lonfo', 'Ballo', 'Via Veneto',
  'Dialogo celeste', 'Il giorno ad urlapicchio', 'Circuito dell\'anima',
  'Fiore secco in libro vecchio', 'Le pietre rare', 'Solstizio d\'estate',
  'E gnacche alla formica', 'Gli Arconti dell\'Urazio', 'Il vecchio Troncia',
  'Che fanno?', 'Chiesa', 'Prato', 'Bottiglie', 'Fosco Maraini',
];

function parseFanfole(raw) {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const verses = [];
  const words = new Set();

  for (const line of lines) {
    if (POEM_TITLES.includes(line)) continue;
    if (/^[-–—]/.test(line)) continue;
    verses.push(line);
    for (const w of line.replace(/[^a-zA-ZÀ-ÿ'']/g, ' ').split(/\s+/)) {
      if (w.length >= 4) words.add(w);
    }
  }

  return { verses, words: [...words] };
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickPhrase(verses, minLen, maxLen) {
  const candidates = verses.filter(v => v.length >= minLen && v.length <= maxLen);
  return pick(candidates.length ? candidates : verses);
}

function pickWords(wordList, n) {
  const shuffled = [...wordList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).join(' ');
}

function resolvePath() {
  const script = document.querySelector('script[data-root]');
  const prefix = script ? script.dataset.root : '';
  return prefix + 'assets/gnosi-delle-fanfole.txt';
}

async function init() {
  try {
    const res = await fetch(resolvePath());
    if (!res.ok) return;
    const raw = await res.text();
    const { verses, words } = parseFanfole(raw);

    // Fill footer fanfola
    const footerEl = document.getElementById('fanfola');
    if (footerEl) footerEl.textContent = pick(verses);

    // Fill placeholder titles (data-fanfole="title")
    document.querySelectorAll('[data-fanfole="title"]').forEach(el => {
      el.textContent = pickWords(words, 2 + Math.floor(Math.random() * 2));
    });

    // Fill placeholder descriptions (data-fanfole="desc")
    document.querySelectorAll('[data-fanfole="desc"]').forEach(el => {
      el.textContent = pickPhrase(verses, 30, 80);
    });

    // Fill placeholder tags (data-fanfole="tag")
    document.querySelectorAll('[data-fanfole="tag"]').forEach(el => {
      el.textContent = pickWords(words, 1);
    });
  } catch (e) {
    // silently fail — placeholders stay as-is
  }
}

init();
