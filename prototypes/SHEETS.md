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

There is **no reading-window cut**. The page text reads in a **central clearing**:
every sheet in front of the far range (mid, bush, fore) is massed in the margins and
**dives away from the centre on organic curves**, so the text always floats over the
plain flat far/sky backdrop. Every shape stays a full, natural paper-cut — no flat
margin cut-offs (see RULES.md §7b).

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
- One flat mountain card with a clean rolling ridge. **No holes** — together with
  the sky it is the **plain backdrop the page text reads on**.

### SHEET 3 · MID RANGE CARD
`l-mid` · `--mid` `#8a5729` · depth 0.11
- Two **mountain shoulders** that dive on smooth curves into a **central valley**,
  opening the clearing the text reads through (revealing the far range + sky behind).
  No cut — the opening is the shape of the card itself.

### SHEET 4 · BUSH BAND
`l-bush` · `--bush` `#562e14` · depth 0.22
- A bush band **massed in the margins**, diving away from the centre on organic
  curves. Bold trees rise from each side mass; the centre stays open:
  - left: a **cabbage tree (tī kōuka)** + an arching **tree fern (ponga)**
  - right: a **cabbage tree** + a tall **conifer (kahikatea/rimu)**
- *(On mobile only — where just the clearing shows — a low bush band + outward-arching
  tree ferns + grass are added to frame the view from the bottom.)*

### SHEET 5 · FRAMING TREES (margins only)
`l-margin` · `--margin` `#2a1809` · depth 0.40
- Bold trees hugging the left & right margins, centre kept open for the text
  (they never cross it):
  - left margin: **nīkau palm** + arching **tree fern** + solid **canopy tree**
    mass, on a connected ground lump
  - right margin: **tree fern** + **nīkau palm** + **cabbage tree** + a **canopy tree**,
    on a ground lump

### SHEET 6 · FOREGROUND BANK + FOCAL KIWI
`l-fore` · `--fore` `#120a04` (nearly black) · depth 0.70
- The frontmost, darkest card: low **corner banks** diving to the open centre, with a
  **fern-frond fringe**, two **koru / fiddleheads**, two **grass/reed tufts**, the
  **kiwi** focal silhouette (in the left frame, clear of the text), and a perched
  **fantail (pīwakawaka)**.

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
