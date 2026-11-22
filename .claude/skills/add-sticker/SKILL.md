---
name: add-sticker
description: House style for lownpho.github.io. Use when adding, removing or restyling anything on the hub page (a project, a link, a text blurb, a placeholder) or adding a project subpage.
---

The site is one page: `index.html` is a **sticker collage**, `style.css` styles it, `fanfole.js` fills poems from `assets/gnosi-delle-fanfole.txt`. Everything on the page is a `.sticker` inside `.desk`. Read `index.html` and `style.css` before changing them; copy the nearest existing sticker rather than inventing a pattern.

## The rule: size = importance

- **Projects** are the big stickers (class `big`): they own big blocks of the desktop grid (about 8x5 cells).
- **Everything else** is small: a few cells (3x2 or so) in the gaps between them.
- **The title** (`.s-name`) stays top centre with the tagline (`.s-bio`) tucked under it. Small stickers may flank them; nothing sits above them.

## Pick the kind

| Adding | Pattern to copy | Notes |
|---|---|---|
| A real project | `.s-mages` (with page), `.s-skyfall` (no page yet) | `<a class="sticker big …">` with `.tag`, `.title`, `.desc`, `.arrow`; without a page it is a `<div>` with no `.arrow`. `.big` gives size and type; the modifier sets only fill, tilt and extras. Must fit 6 of 12 columns (about 28rem). Its page lives in its own top-level folder (`/mages/`) with its own stylesheet and look; the hub style stays on the hub. |
| An outbound link | `.s-github`, `.s-linkedin` | Small circle or small tag, label plus `↗`. |
| Text that opens | `.s-work` (text), `.s-lonfo` (poem) | `<details class="sticker opener s-…">`: `<summary>` is a short label, `.opener-body` holds `<p>`s or a `<ul>` (`.s-like`, `.s-believe`); inline links in it are ink with an underline, and a closing `<p class="credit">` credits an author. Add `blob` for an uneven-radius shape. It grows from where it sits, floating over neighbours on desktop; when taller than the screen the inline script adds `.wide` (wider, multi-column). Any click closes it. Separate modals and popovers are the wrong pattern here. The modifier class sets only fill, shape, `--tilt` and phone `justify-self`. |

Poems: an `.opener-body` with `data-fanfole="poem"` holds an `<h2>` and a `<p>`; add `data-poem="<title as in the text file>"` for a specific poem, leave it off for a random one.

## Look

- **Fill**: one of `--red --blue --yellow --green --pink`, or `--paper`. Touching stickers get different fills. Text is `--ink`; white text only on blue. Spread the colours so none dominates.
- **Outline and hard shadow** come from `.sticker`; the title is the one exception, bare letters with no box. Light theme only.
- **Shape**: vary it. Rounded rectangle for content, pill, circle, small tag, or an uneven `border-radius` blob.
- **Tilt**: set `--tilt` between -8deg and 9deg, opposite in sign to the nearest neighbour. Hover straightening and wobble are inherited.
- **Type**: Inter for labels: 900 at `-0.04em` tracking (tags 800 uppercase, project `.desc` 600). Fraunces for prose (tagline, opener text): upright 500 in openers with the key phrase of each paragraph or bullet in `<strong>` (700); italic only for `<em>`. Opener bullets are tilted ink squares, not discs. The Google Fonts link in `index.html` loads only the weights in use; add one there before using it.

## Place it

1. DOM order is the phone order: title, tagline, then projects interleaved with small stickers (a pair of small ones between projects, the rest after), links and openers mixed (not grouped by kind). Phones scroll a grid: title, tagline and projects span full rows (`grid-column: 1 / -1`), small stickers pack two or more per row; nudge one inside its cell with `justify-self` only.
2. Desktop (`@media (min-width: 1100px)`) is the whole collage on **one screen, no scrolling**: a 20x12 `grid-template-areas` map in `style.css`, exactly one viewport tall, with type scaled to the viewport. Each sticker gets one `grid-area` line there and sits centred in its block. To add a sticker, claim an empty rectangle of `.` cells in the map (bigger block = more important) and add its `grid-area`; leave empty cells around things, the gaps are part of the look. If there is no room, move things or shrink blocks; never add rows past 12 or make the page scroll.
3. Re-check fill and tilt adjacency in the map, since neighbours there are what touch.
4. Open openers float over their neighbours (desktop width 26rem, `.wide` when taller than the screen); the inline script in `index.html` nudges them back inside the viewport. Nothing reflows.

## Check

Serve over HTTP (the poems are fetched, `file://` leaves `···`) and screenshot with headless Chrome at 1100x800, 1440x900, 1280x650 and 390 wide; click openers open too (one taller than the screen should go `.wide`).

Done when, at all three sizes: every sticker's text is fully readable with no other sticker covering it, there is no scroll at all on desktop (no horizontal scroll on phones), and the new sticker's size matches its importance.
