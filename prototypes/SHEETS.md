# Shadow box — sheet stack

The full layer stack for `prototypes/silhouette.html`, back to front.

Every layer is **one flat sheet of black card** — a single flat colour, never a
gradient. The **only** light is a flat panel at the very back; everything bright in
the scene is a **hole** cut down to that one light. Card tone differs only by depth,
on a strictly monotonic ramp:

```
light  >  sky  >  haze  >  deep  >  far  >  mid  >  bush  >  margin  >  fore
```

The **sun** and the **birds** are holes in the sky card (sheet 1) — the only bright
holes, both the same `--light` brightness, both kept clear of the text.

There is **no reading-window cut**. The two deepest ranges are now **FULL-WIDTH forest
bands** bunched tight near the horizon — the palest **haze** band just under an open sky
strip, then the **deep** band only ~45u below it — and the page text reads on **that flat
forested hillside** (`--deep`), not bare sky; only a thin strip of sky + the small **moon**
sit above the haze treeline. The nearer cards — far, mid, bush, margin, fore — are still
massed in the margins and **dive away from the centre on organic curves**, opening a
central column that reveals the **deep band** (a plain flat card, so the copy stays
legible on its halo). Every shape stays a full, natural paper-cut — no flat margin
cut-offs (see RULES.md §7b). The whole forest is raised high (very little bare sky,
mostly bush).

**CONVERGING valley:** each successive range opens a *wider* central gap than the one
behind it (the inner edge steps outward deep→fore), so the ranges funnel inward to the
narrow **deep** gap high in the centre — the valley's vanishing point — and the eye is
drawn down into it. Every gap still contains the text column, so the copy stays on sky.
At the base a **stacked central mound** (one band per front sheet, each lower/darker/
nearer) closes the column with a little receding valley-floor — the "footer" the copy
ends on.

**Colour schemes:** two dozen palettes switch live from the corner swatches (choice persists;
`?palette=…` also works), grouped into families:
- **Moody** (`sepia` · `dusk` · `forest` · `ember`) — mid-tone clearing, full-saturation
  scene; atmosphere over contrast.
- **Paper** (`paper` · `bone` · `slate` · `sage` · `mist` · `blush` · `sand` · `lavender`)
  — a near-white light panel and barely-tinted cards fading to a near-black foreground;
  dark ink stays crisp on the bright clearing (maximum legibility).
- **Aotearoa** (`kauri` · `kowhai` · `pohutukawa` · `pounamu`) — the paper recipe pushed
  more saturated and keyed to unmistakably NZ colours.
- **Greens** — bright ones (`fern` · `moss` · `manuka` · `rimu` · `nikau`) keep the paper
  recipe (black copy); the **dark** ones (`ngahere` · `kelp`, `dark:true` → `.pal-dark`)
  invert it to a dim native-bush night with white copy and crisp air-gap shadows.

Every palette keeps the strict monotonic ramp and the one warm light — **except `aurora`**.
Aurora is the **one sanctioned rule-breaker**: instead of flat cards it fills every sheet
with the **same** speckled aurora gradient (`patternUnits=userSpaceOnUse`, so every sheet
and stamp samples one shared marble of light by position) — deep blue/black night up top,
magenta-rose curtains through the middle, aurora green toward the horizon — each depth
level the same marble multiplied **darker** the nearer it sits, so depth still reads while
the foreground stays tinted-and-speckled rather than flat black. Built from a baked
grayscale value-noise field (`buildAuroraNoise`/`genNoise`) plus a low-frequency warp that
waves the colour bands like real curtains. Text is plain **white**, no halo.

## Procedural scatter (the plants reshuffle each load)

The three plant sheets (bush, margin, fore) are **scattered procedurally** from one
master seed per page load, so the scene is slightly different every visit but always
tidy. Tidiness is structural, not luck:

- **Bays, never the centre.** Plants only sit in a left/right bay hugging the frame
  (`bay(edgeX, innerX, …)`); the central clearing is never touched, so the text
  always floats on plain sky/far.
- **Natural ground, no floating.** Every ground line — the plant banks AND the far/mid
  ridges — is a **procedural crest**: an overall shape (rise-at-edge / dive-at-clearing,
  or a full-width roll) plus several random harmonics led by a big low-frequency mound,
  so the ground reads as lumpy land, not a smooth arc. The **same crest both draws the
  card and roots every plant**, so a trunk can never float above the ground.
- **Nothing behind the text.** A crown-aware clamp (`clampX`, using a per-stamp crown
  width) pulls every plant back toward its frame edge until its *whole* crown clears the
  text column (`CLEAR_L`..`CLEAR_R`). So no foliage on any card sits behind the text —
  it always reads on the plain flat sky/far backdrop.
- **Edge-tall.** A plant's height grows toward the frame edge and shrinks toward the
  clearing, so the masses always rise in the margins and dive to the open centre.
- **Small in front, large at the back.** Each sheet draws from a size band that
  shrinks front-ward: far/mid ranges (back) = a full mixed distant treeline, bush =
  tall canopy trees, margin = medium shrubs, fore (front) = the smallest ground plants.
  The big trees are filtered only out of the **front** layers — the back ranges carry
  **all** the catalogue stamps (just small, since they're far).
- **Front plants stand proud.** Foreground plants are few, bold and tall with a tiny
  `bury`, so the near-black silhouettes read clearly against the lighter bands behind
  instead of merging into one dark blob.
- **Distant treelines** (`treeline`) forest the far & mid ridges (margins only, with
  a clean central gap), rooted on the **generated** ridge so they never float, so the
  bush climbs the hills and the bare sky shrinks.
- **Only the ten authoritative catalogue stamps** (catalogue.html) appear in the
  scene — no scene-only `mamaku` or standalone `koru`. (The koru *fiddleheads* you
  see are part of the `ponga` stamp itself.)
- Evenly-spaced jittered slots; tallest drawn first; left & right use different
  sub-seeds (never mirror-symmetric). The kiwi (planted on the fore crest) & fantail
  are focal anchors with only tiny jitter. Override the load with `?seed=N`.

All the cut-out plants are reusable **stamps** from [`stamps.js`](../js/stamps.js); the
[stamp catalogue](./catalogue.html) renders each in isolation.

---

## The light (behind everything)

**`.glow` — diffused light panel** · color `--light` `#ffe7b4`
- One flat, even panel of warm light. No gradient. The *only* light source —
  everything bright in the scene is a hole cut down to this.
- Fixed; does not parallax (it's the back wall of the box).

---

## The cards (each a single flat colour, on a strict back→front ramp)

### SHEET 1 · SKY CARD
`l-sky` · `--sky` `#e0a455` · depth 0.02
- A flat sky-toned card filling the whole frame (mostly hidden now — only the thin
  strip above the haze forest band shows).
- **Holes:** the small **moon** (circle at cx 232, cy 72, r 22), high in the sky strip
  above the haze treeline, **plus a loose skein of birds in flight** (`birdsSkein` →
  `birdHole`, a simple two-winged silhouette) drifting across the upper sky strip,
  clear of the moon and above the haze treeline. Both reveal `--light` — every bright
  thing is the one light (RULES §3–4).

### SHEET 1.25 · HAZE BAND — FULL-WIDTH FOREST BAND (furthest, palest)
`l-haze` · `--haze` `#d79b4e` · depth 0.03
- The furthest, palest range, spanning the **whole width** high on the frame (`band()`),
  with a **distant hazy treeline across the top** of tiny, numerous stamps (~11–40). It
  sits just below the open sky strip; the moon + birds float above it.

### SHEET 1.5 · DEEP RANGE — FULL-WIDTH FOREST BAND
`l-deep` · `--deep` `#ce9148` · depth 0.04
- The second full-width band, only ~45u below the haze band (the two are bunched tight
  near the horizon for aerial perspective). A `band()` of slightly larger stamps (~15–52).
  The page text reads on its flat card below the ridge. This is the back wall the nearer
  ranges funnel down into.

### SHEET 2 · FAR RANGE CARD
`l-far` · `--far` `#bd7e3c` · depth 0.06
- Two **generated shoulder banks** (raised high) with a **plateau** profile (`divePow`
  ~3) — they hold their crest height as a **broad receding hill-band** across the margin,
  then dive to the base only at the text-column edge, so plenty of the range is visible
  yet behind the whole text column there is **only sky**. A **distant mixed treeline**
  (all catalogue stamps, small ~24–86) rides each plateau, rooted on the generated crest.

### SHEET 3 · MID RANGE CARD
`l-mid` · `--mid` `#8a5729` · depth 0.11
- Two **plateau shoulder banks** (`divePow` ~2.6) that hold a visible hill-band then dive
  into the central valley. A nearer, larger **mixed treeline** (all stamps, ~38–140) rides
  each shoulder, receding between the far range and the bush band.

### SHEET 4 · BUSH BAND (backmost plant band → tall canopy)
`l-bush` · `--bush` `#562e14` · depth 0.22
- A natural bush bank **massed in the margins** (procedural crest). Unlike the ranges
  behind it, the bush wall **plateaus toward the clearing** (`divePow` 2.4 + a high
  `diveY` 486) so the tall canopy stays massed right up beside the hero text — the side
  bays meet just below the title, leaving only a tall central slot. As the **back** plant
  band it carries the **tallest** trees, rooted on the crest from the palette
  **ponga · nīkau · pōhutukawa · cabbage tree** (height band ~180–330). They tower behind
  the text; the central slot stays open.
- *(On mobile only — where just the clearing shows — a low bush band + outward-arching
  tree ferns + grass are added to frame the view from the bottom.)*

### SHEET 5 · FRAMING TREES (mid plant band, in front of the text)
`l-margin` · `--margin` `#2a1809` · depth 0.40
- **Medium** shrubs & smaller trees hugging the left & right margins on a natural
  bank, rooted on its crest from **ponga · cabbage · flax · toetoe** (height band
  ~120–205). Smaller than the bush band behind → the scene reads small-in-front,
  large-behind. Centre kept open (they never cross it).

### SHEET 6 · FOREGROUND BANK + FOCAL KIWI (frontmost, smallest)
`l-fore` · `--fore` `#120a04` (nearly black) · depth 0.70
- The frontmost, darkest card: a low natural **corner bank** in each margin. Its
  plants stand **proud** of the bank (small bury) so the dark silhouettes read against
  the lighter bands behind — a few bold **grass · single frond · flax · toetoe**
  (height band ~64–188), kept on the **right** bay only. The **left** bay is left
  **plant-free** so the focal **kiwi** — enlarged, stood near the frame edge where the
  bank rides highest, facing right into the clearing — is the sole bold foreground
  silhouette there, reading cleanly against the lighter bush/mid bands with nothing
  crossing it (bill clear of the text column). A perched **fantail (pīwakawaka)** sits
  just beside it.
- A **stacked central footer floor** closes the base of the sky column: one low
  `centreMound` + `footThicket` per front sheet (bush behind/palest → margin → fore
  nearest/darkest), so the footer reads as a small **receding valley-floor** of bush
  (harakeke, toetoe, ferns, grass — no big trees). The reading column above it stays
  open sky; the footer line sits over it (on its halo).

---

## On top (the box hardware, not scene cards)

- **`.frame`** — the outer box frame around the opening. (There is no stepped mat
  any more — the stacked sheets give the depth illusion themselves.)

---

## Parallax

All eight scene cards (sky, haze, deep, far, mid, bush, margin, fore) drift on vertical
scroll, separation **max at the top → settled / registered at the bottom**, normalised
over the page height. The depth numbers above are the per-sheet parallax weights (front
sheets move most). The light panel does not move.
