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
  const poems = [];

  for (const line of lines) {
    if (POEM_TITLES.includes(line.replace(/’/g, "'"))) { poems.push({ title: line, lines: [] }); continue; }
    poems.at(-1)?.lines.push(line);
    if (/^[-–—]/.test(line)) continue;
    verses.push(line);
  }

  // the book title and author are in POEM_TITLES too, but have no lines
  return { verses, poems: poems.filter(p => p.lines.length) };
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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
    const { verses, poems } = parseFanfole(raw);

    // Fill footer fanfola (mages page)
    const footerEl = document.getElementById('fanfola');
    if (footerEl) footerEl.textContent = pick(verses);

    // Fill whole-poem targets (data-fanfole="poem": an <h2> and a <p>);
    // data-poem="<title>" picks that poem, otherwise a random one
    document.querySelectorAll('[data-fanfole="poem"]').forEach(el => {
      const poem = poems.find(p => p.title === el.dataset.poem) ?? pick(poems);
      el.querySelector('h2').textContent = poem.title;
      el.querySelector('p').textContent = poem.lines.join('\n');
    });
  } catch (e) {
    // silently fail — placeholders stay as-is
  }
}

init();
