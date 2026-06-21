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
- **opts** — per-stamp extras (`fronds`, `spread`, `baseAng` for the crown stamps…).

The creatures (`kiwi`, `fantail`) take `(cx, cy, s, fill)` — centre + a size scalar.

## The catalogue

In grid order (see `catalogue.html`):

| Stamp | te reo / type | Notes |
|---|---|---|
| `cabbageTree` | tī kōuka | forked trunk + three dense spiky sword-leaf mop-heads |
| `nikau` | nīkau palm | ringed trunk + bulging crownshaft + a drooping beaded **fruit panicle** below the bulge (continuous strands joined to the trunk by a neck collar) + a clean upright **cone** of feather fronds (outermost frond dropped; everything beyond the cone-edge angle clipped so no leaflet pokes past the silhouette); `opts:{fronds,spread,baseAng}` |
| `pohutukawa` | pōhutukawa / rātā | short trunk forking into a candelabra of boughs that **split into twigs**, each carrying a lobed foliage clump, leaving airy sky-gaps near the branches (alias `canopyTree`) |
| `flax` | harakeke | upright fan of stiff sword leaves (outer two nodding to ~half height) + drooping old "grandad" leaves + tall **kōrari flower stalks**: mostly-bare stems carrying spaced, side-alternating **clusters** of curved tubular flowers (bow out then curl up to a point) in a sparse candelabra, each topped by a slim terminal bud-spire |
| `toetoe` | plume grass | short, wide, droopy cascading tussock + tall stems topped by slim **one-sided, upward-fluffed curving** plumes |
| `grass` | reed tuft | `grass(x,baseY,w,h,n,fill,seed)` — `n` blades over width `w` |
| `frond` | single fern frond | `frond(x,baseY,len,fill,seed,dir)` — ground frond at angle `dir`° |
| `ponga` | silver fern | thick squarish trunk + broad weeping vase crown + 3 koru fiddleheads rising from the hub + two fronds draping over the front |
| `kiwi` | — | focal silhouette: pear body, rounded head, long thin down-curved bill, three-toed feet; `kiwi(cx,cy,s,fill)` |
| `fantail` | pīwakawaka | small round body + small head + broad cocked fan tail (steep on the right, shallow on the left); `fantail(cx,cy,s,fill)` |

Scene-only (not shown in the catalogue grid): `mamaku` (tall slender bendy tree fern with
a wide weeping crown, alias `treeFern`; `opts:{fronds,spread,baseAng}`) and `koru`
(unfurling fiddlehead spiral, `dir` ±1).

### Internal helpers
`rng(seed)` deterministic PRNG · `rachis(...)` + `frondPath(...)` the pinnate-frond path
generator (used by `frond`) · `ribFrond(...)` a pinnate frond along an arbitrary quadratic
rib, with optional one-sided leaflets (`trimSide`) · `frondCrown(...)` fans fronds up-then-out
from one hub, sized/leaned per `opts` (`maxLean`, `droopK`, `leanPow`, `coneTrim` full one-sided
outer edges, `coneClip` clips every leaflet splaying past the outer-frond cone angle
(+ `coneTrim2`/`coneTrim2Frac` a partial basal outer trim), `centerGap`, `coreShort`,
`dropOuter`…); shared by `nikau`, `ponga`, `mamaku` ·
`koruPath(...)` bare fiddlehead spiral (used by `koru`) · `fiddleheadPath(...)` stalk-into-tight-coil
crozier (used by `ponga`) · `plumePath(...)` one-sided curved foxtail plume (used by `toetoe`) ·
`cabbageHead(...)` spiky mop-head (used by `cabbageTree`) · `blob(...)` one scalloped foliage
lobe (builds `pohutukawa` clumps).
