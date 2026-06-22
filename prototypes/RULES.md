# Shadow box — the rules

The scene in `prototypes/silhouette.html` is a literal simulation of a paper-cut
shadow box: a stack of thin black cards, spaced ~1cm apart, lit from behind by one
diffused light. These rules are what keep it physically honest. Don't break them.

## 1. There is exactly one light
A single flat panel of **even, diffused light** at the very back of the box
(`.glow` / `--light`). It is never a gradient and never moves. It is the only
source of brightness in the whole scene.

## 2. Every layer is one sheet of card = one flat colour
Each sheet is a single, **flat** fill — **no gradients anywhere** (not the sky, not
the mountains, not the water). A sheet may carry many shapes, but they are all the
**same** colour, because they're cut from the same sheet of card.

## 3. Anything bright is a hole, never a painted shape
You cannot paint light. Every bright thing — the **sun** and the **birds** — is a
*hole* cut in the cards, revealing the light panel behind. Nothing bright is drawn
as a filled shape.

## 4. All holes are the same brightness
Because every hole reveals the same flat panel, the sun and the birds are
**identical in brightness** (= `--light`). There are no "brighter" or "dimmer"
bright spots.

## 5. Tone is set only by depth — strictly monotonic
A card's colour is determined solely by how far back it sits. The ramp, back to
front, never reverses:

```
light  >  sky  >  haze  >  deep  >  far  >  mid  >  bush  >  margin  >  fore
```

Corollary: **nothing can be lighter than what is behind it.**

## 6. Every shape must be cuttable from a single sheet
No free-floating, disconnected solid pieces — they'd fall out of a real sheet. A
solid element (tree, kiwi, fantail) must connect to its sheet. Anything that appears
to "float" (the birds) must therefore be a **hole**, not a solid.

## 7. A light-hole is cut through every card in front of what it reveals
A hole only reveals what sits behind *all* the cards in front of it. The only holes
are the **light-holes** (sun, birds), cut clean down to the back panel. A hole is
never cut in just one front sheet, or it would look like it floats in front of the
cards behind it.

## 7b. Full natural shapes only — no flat margin cut-offs
Every shape is a complete, organic paper-cut. **Nothing is sliced by a straight
edge** where it meets the page text. There is no rectangular reading-window. Instead
the page text reads in a **central clearing** that the front sheets (mid, bush, fore)
naturally open around: their masses rise in the margins and **dive away from the
centre on smooth organic curves**, so the text always floats over the plain far/sky
backdrop and nothing dark crosses it. The only straight edges anywhere are the box
frame itself and foliage bleeding off the outer frame edge — never a cut facing the
text.

## 8. The depth illusion comes from the real sheets — nothing faked
Depth is produced by the actual stacked sheets, the soft shadow each sheet casts on
the one behind it (the ~1cm gap), and scroll parallax. There is **no faked stepped
mat** or painted vignette doing the work — those were removed.

---

### Sanctioned exceptions
1. The **text-shadow halo** on the page content (headings, project copy). It's a
   legibility aid so the dark paper-cut text stays readable over darker cards — a UI
   concession, not part of the scene's physics.
2. The **`aurora` palette** is the one deliberate rule-break. Instead of flat cards on a
   monotonic ramp, every sheet is filled with the *same* speckled aurora gradient (one
   shared marble of light cast across the whole scene), each depth level multiplied
   darker the nearer it sits. It trades Rules 1–2/5 (one light, flat cards, no gradient)
   for atmosphere; the depth fade-to-black is still strictly monotonic, so the stacking
   still reads. See SHEETS.md for the build.

See [`SHEETS.md`](./SHEETS.md) for the layer-by-layer breakdown.
