---
name: add-sticker
description: House style for lownpho.github.io. Use when adding, removing or restyling anything on the hub page (a project, a link, a text blurb, a placeholder) or adding a project subpage.
---

The site is one page: `index.html` is a **sticker collage**, `style.css` styles it, `fanfole.js` fills poems from `assets/gnosi-delle-fanfole.txt`. Everything on the page is a `.sticker` inside `.desk`. Read `index.html` and `style.css` before changing them; copy the nearest existing sticker rather than inventing a pattern.

## The rule: size = importance

- **Projects** are the big stickers (class `big`): one per row, below the title and tagline, alternating left, right and centre.
- **Everything else** is small and fills the gaps beside them.
- **The title** (`.s-name`) stays top centre with the tagline (`.s-bio`) tucked under it. Nothing else goes above them.

## Pick the kind

| Adding | Pattern to copy | Notes |
|---|---|---|
| A real project | `.s-mages` (with page), `.s-skyfall` (no page yet) | `<a class="sticker big …">` with `.tag`, `.title`, `.desc`, `.arrow`; without a page it is a `<div>` with no `.arrow`. `.big` gives size and type; the modifier sets only fill, tilt and extras. Must fit 6 of 12 columns (about 28rem). Its page lives in its own top-level folder (`/mages/`) with its own stylesheet and look; the hub style stays on the hub. |
| An outbound link | `.s-github`, `.s-linkedin` | Small circle or small tag, label plus `↗`. |
| Text that opens | `.s-work` (text), `.s-lonfo` (poem) | `<details class="sticker opener s-…">`: `<summary>` is a short label, `.opener-body` holds `<p>`s or a `<ul>` (`.s-like`, `.s-believe`); inline links in it are ink with an underline, and a closing `<p class="credit">` credits an author. Add `blob` for an uneven-radius shape. It grows in place; when taller than the screen the inline script adds `.wide` (full row, multi-column). Any click closes it. Overlays, modals and popovers are the wrong pattern here. The modifier class sets only fill, shape, `--tilt` and phone `align-self`. |

Poems: an `.opener-body` with `data-fanfole="poem"` holds an `<h2>` and a `<p>`; add `data-poem="<title as in the text file>"` for a specific poem, leave it off for a random one.

## Look

- **Fill**: one of `--red --blue --yellow --green --pink`, or `--paper`. Touching stickers get different fills. Text is `--ink`; white text only on blue. Spread the colours so none dominates.
- **Outline and hard shadow** come from `.sticker`; the title is the one exception, bare letters with no box. Light theme only.
- **Shape**: vary it. Rounded rectangle for content, pill, circle, small tag, or an uneven `border-radius` blob.
- **Tilt**: set `--tilt` between -8deg and 9deg, opposite in sign to the nearest neighbour. Hover straightening and wobble are inherited.
- **Type**: Inter for labels: 900 at `-0.04em` tracking (tags 800 uppercase, project `.desc` 600). Fraunces upright only for prose (tagline, opener text); italic only for `<em>`. The Google Fonts link in `index.html` loads only the weights in use; add one there before using it.

## Place it

No sticker gets its own coordinates or layout rules; the layout is generic.

1. DOM order is the phone order: title, tagline, projects, then links and openers mixed (not grouped by kind). Mixing breaks fill and tilt adjacency, so re-check both after reordering. Position on phones with `align-self` only.
2. Desktop (`@media (min-width: 1100px)`) is a 12-column grid with `grid-auto-flow: row dense`. Title and tagline span full rows. Each `.big` gets its own row; the inline script in `index.html` sets its `--row` and a `--col` cycling 1, 7, 4 (left, right, centre) by DOM order, so the layout is identical on every load. Every other sticker spans 3 columns and flows into the gaps in DOM order. Do not add per-sticker desktop rules.
3. The page scrolls; add rows rather than squeezing stickers in.

## Check

Serve over HTTP (the poems are fetched, `file://` leaves `···`) and screenshot with headless Chrome at 1100, 1440 and 390 wide; click openers open too (one taller than the screen should go `.wide`).

Done when, at all three sizes: every sticker's text is fully readable with no other sticker covering it, there is no horizontal scroll, and the new sticker's size matches its importance.
