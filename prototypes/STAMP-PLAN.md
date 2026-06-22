# Stamp refinement — realised silhouettes

Goal: every stamp in `stamps.js` reads as a **professionally cut, picture-perfect
paper-cut silhouette** of its real NZ subject — instantly recognisable from its
outline alone, clean (no scraggly stray strokes), bold enough to cut from card
(Rule 6: one connected shape per `<g>`), and true to the plant/animal's form.

Verified in isolation with the catalogue grid:
`node ~/.claude/skills/screenshot-verify/shoot.mjs prototypes/catalogue.html --config prototypes/catalogue.shoot.json --out shots/cat`
or a single stamp large via
`node ~/.claude/skills/screenshot-verify/shoot.mjs 'prototypes/stamp.html?name=<stamp>' --config prototypes/stamp.shoot.json --out shots/one`.

Reference photos live in `goal/`. Below is the **current realised design** of each
catalogue stamp (the grid holds ten; `mamaku` and `koru` are scene-only).

---

## 1. `ponga` — silver fern (tree fern)
Thick, squarish fibrous trunk (near-vertical sides, slight foot flare) whose top
shoulders converge cleanly into the crown. A broad weeping **vase crown** of fronds
arching up then out and drooping at the tips; the two upright near-centre fronds are
kept short. Three **koru fiddleheads** (tight small coils on tall stalks, the side
two curling inward) rise from the crown hub, and two fronds drape forward over the
trunk front. Sized a little larger than the other plants.

## 2. `cabbageTree` — tī kōuka
Clear trunk that forks into a few bare limbs, each tipped by a dense radiating
**spiky mop-head** of stiff sword-leaves (a shaggy pom-pom), lower leaves arching down.

## 3. `nikau` — nīkau palm
Smooth ringed trunk swelling to a bulbous **crownshaft**. Just below the bulge a
**drooping beaded fruit panicle** weeps down around the trunk top — continuous tapered
ribbon strands (joined to the trunk by a solid neck collar so it cuts as one piece, Rule
6) with little fruit beads riding the spine. Above the bulge a tidy upright **cone** of
fine pinnate feather fronds radiates — outer fronds at ~50°, the outermost frond on each
side dropped, and every leaflet that would splay past the cone-edge angle clipped
(`coneClip`) so the silhouette edge stays clean and fully leafed (no bare ribs, no
strays).

## 4. `pohutukawa` — rātā / broadleaf  (alias `canopyTree`)
Short trunk forking into a **candelabra** of boughs that each split into twigs; a
lobed (cumulus) foliage clump sits at every twig tip. Branches and sky show through
near the trunk, so the broad billowing crown reads airy — not one solid blob.

## 5. `flax` — harakeke
A fan of stiff sword-leaves rising from one base; the **outer two** standing blades
rise fairly vertically then nod over to about half height. A skirt of drooping old
**"grandad"** leaves flops down around the base, and tall kōrari **flower stalks** rise
well above the fan — each a mostly-bare stem carrying a few spaced, side-alternating
**clusters** of curved tubular flowers (each flower bows outward then curls back up to a
point) in a sparse candelabra, topped by a slim terminal bud-spire.

## 6. `toetoe` — plume grass
A short, wide, **droopy cascading tussock** (many arching blades peaking low and
flopping outward into a rounded mound), from which staggered stems rise to slim,
**one-sided** feather plumes — the fluff swept forward/up the stem (out the end as
well as sideways), the whole spindle curving gently as it nods.

## 7. `grass` — reed tuft
Simple tuft of fine blades of varying height with a few cross-leaning blades for life.

## 8. `frond` — single fern frond
One pinnate fern frond: central rib with paired leaflets, gently arching, leaflets
longest near the base shrinking to the tip.

## 9. `kiwi` — focal silhouette
Plump pear body, highest at the rounded rump, with a **distinct rounded head** set
forward and lower (a slight neck notch), flowing into one long, fine, gently
down-curved bill ~half the body length. Two short sturdy legs, each a single
connected three-toed foot (no free-floating toes).

## 10. `fantail` — pīwakawaka
Small neat round body + small head set close to the body, fine bill, and the
signature broad **cocked fan tail** (gently scalloped, larger than the body) — the
fan steeper on the right and shallower on the left, the bird facing slightly right.

---

### Scene-only stamps
- `mamaku` (alias `treeFern`) — tall slender bendy tree fern with a wide weeping
  parasol crown, used in the shadow-box scene (`silhouette.html`).
- `koru` — a single unfurling fiddlehead spiral, `dir` ±1.

### Working method
Each loop: edit `stamps.js` → reshoot the catalogue (or one stamp) → view the PNG →
note residual issues → refine. Keep silhouettes clean and cuttable (one connected
shape per `<g>`), consistent in line weight, and true to the `goal/` photos.
