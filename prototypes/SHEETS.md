# Shadow box — sheet stack

The full layer stack for `prototypes/silhouette.html`, back to front.

Every layer is **one flat sheet of black card** — a single flat colour, never a
gradient. The **only** light is a flat panel at the very back; everything bright in
the scene is a **hole** cut down to that one light. Card tone differs only by depth,
on a strictly monotonic ramp:

```
light  >  sky  >  far  >  mid  >  bush  >  margin  >  fore
```

The **sun** and the **birds** are holes in the sky card (sheet 1) — the only bright
holes, both the same `--light` brightness, both kept clear of the text.

There is **no reading-window cut**. The page text reads in a **central sky column**:
**every** card in front of the sky — far, mid, bush, margin, fore — is massed in the
margins and **dives away from the centre on organic curves**, so the text always
floats over **pure sky** (not even the far range sits behind it). Every shape stays a
full, natural paper-cut — no flat margin cut-offs (see RULES.md §7b). The whole forest
is raised high up the frame (little bare sky, lots of bush); only at the very base
does a low **central mound** close the column — the "footer" the page copy ends on.

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

All the cut-out plants are reusable **stamps** from [`stamps.js`](./stamps.js); the
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
`l-sky` · `--sky` `#e0a455` · depth 0.03
- A flat sky-toned card filling the whole frame.
- **Holes:** the **sun** (circle at cx 250, cy 222, r 58) and **4 birds** (thin
  stroke cuts) — both reveal `--light`, so every bright thing is the same light,
  and both sit in the side sky **clear of the text**. (A free-floating dark bird
  can't exist on a single sheet — it would fall out — so the birds are bright cuts,
  not painted shapes.)

### SHEET 2 · FAR RANGE CARD
`l-far` · `--far` `#bd7e3c` · depth 0.07
- Two **generated shoulder banks** (raised high) with a **plateau** profile (`divePow`
  ~3) — they hold their crest height as a **broad receding hill-band** across the margin,
  then dive to the base only at the text-column edge, so plenty of the range is visible
  yet behind the whole text column there is **only sky**. A **distant mixed treeline**
  (all catalogue stamps, small ~40–104) rides each plateau, rooted on the generated crest.

### SHEET 3 · MID RANGE CARD
`l-mid` · `--mid` `#8a5729` · depth 0.11
- Two **plateau shoulder banks** (`divePow` ~2.6) that hold a visible hill-band then dive
  into the central valley. A nearer, larger **mixed treeline** (all stamps, ~60–160) rides
  each shoulder, receding between the far range and the bush band.

### SHEET 4 · BUSH BAND (backmost plant band → tall canopy)
`l-bush` · `--bush` `#562e14` · depth 0.22
- A natural bush bank **massed in the margins** (procedural crest), diving away from
  the centre. As the **back** plant band it carries the **tallest** trees, rooted on
  the crest from the palette **ponga · nīkau · pōhutukawa · cabbage tree** (height
  band ~185–330). They tower behind the text; the centre stays open.
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
  (height band ~92–188) — plus the focal **kiwi** planted on the bank crest (left
  frame, clear of the text) and a perched **fantail (pīwakawaka)**.
- A low **central mound** (`centreMound`) closes the base of the sky column, carrying a
  small **bush thicket** — a clump of harakeke, toetoe, ferns & grass (front-layer
  stamps only, no big trees) — the visible "footer middle" the page copy ends on. The
  reading column above it stays open sky; the footer line sits over it (on its halo).

---

## On top (the box hardware, not scene cards)

- **`.frame`** — the outer box frame around the opening. (There is no stepped mat
  any more — the stacked sheets give the depth illusion themselves.)

---

## Parallax

All six cards drift on vertical scroll, separation **max at the top → settled /
registered at the bottom**, normalised over the page height. The depth numbers above
are the per-sheet parallax weights (front sheets move most). The light panel does
not move.
