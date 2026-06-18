# Stamp catalogue — NZ-bush paper-cuts

All the cut-out shapes in the shadow box live in [`stamps.js`](./stamps.js) as a
library of reusable **stamps**. Each stamp is a single connected paper-cut — one
`<g fill="…">` of solid black card, cuttable from one sheet (RULES.md §6, §7b).

Verify/refine them in isolation with [`catalogue.html`](./catalogue.html):

```bash
node ~/.claude/skills/screenshot-verify/shoot.mjs prototypes/catalogue.html \
  --config prototypes/catalogue.shoot.json --out shots/cat
```

## Convention

```
stamp(x, baseY, h, fill, seed [, opts])  ->  "<g fill=…>…</g>"
```

- **x, baseY** — the base point the stamp grows from (trunk foot / ground line).
- **h** — overall height in viewBox units; the stamp scales to it.
- **fill** — the card colour for the sheet it sits on (e.g. `var(--bush)`).
- **seed** — integer; the PRNG is deterministic, so a seed always draws the same plant.
- **opts** — per-stamp extras (frond `spread`, `baseAng`, conifer `droop`/`density`…).

Birds/kiwi/fantail/tui take `(cx, cy, s, fill)` — centre + a size scalar.

## The catalogue

| Stamp | te reo / type | Notes |
|---|---|---|
| `treeFern` | ponga | stout trunk + crown of bold arching fronds; `opts:{fronds,spread,baseAng}` |
| `cabbageTree` | tī kōuka | trunk + spiky sword-leaf heads |
| `nikau` | nīkau palm | ringed trunk + crownshaft bulge + radiating fan; `opts:{spread,baseAng}` |
| `conifer` | kahikatea / rimu | slender trunk + feathered tiers; `opts:{droop,density,taper}` |
| `canopyTree` | rātā / broadleaf | trunk + solid lumpy crown (scalloped blobs) |
| `flax` | harakeke | fan of stiff upright sword leaves |
| `toetoe` | plume grass | arching stems topped by feathery plumes |
| `grass` | reed tuft | `grass(x,baseY,w,h,n,fill,seed)` — `n` blades over width `w` |
| `frond` | single fern frond | `frond(x,baseY,len,fill,seed,dir)` — ground frond at angle `dir`° |
| `koru` | fiddlehead | unfurling fern crozier (a fat stroked spiral); `dir` ±1 |
| `kiwi` | — | focal silhouette; `kiwi(cx,cy,s,fill)` |
| `fantail` | pīwakawaka | body + cocked wide fanned tail; `fantail(cx,cy,s,fill)` |
| `tui` | — | plump perching bird, cocked tail; `tui(cx,cy,s,fill)` |
| `bird` | distant gull | thin **stroke** — used as a light-HOLE in the sky, not a solid |

### Internal helpers
`rng(seed)` deterministic PRNG · `frondPath(opts)` the pinnate-frond path generator
(shared by ferns, palms, conifers, toetoe plumes) · `rachis(...)` the frond rib curve ·
`blob(...)` one scalloped foliage lobe (builds `canopyTree` crowns).
