# Bike Polo Boards

*A parametric OpenSCAD design for the fold-flat plywood boards that ring a hardcourt
bike polo court — modelled as code so the whole thing can be re-cut to fit any space or
sheet size.*

Hardcourt bike polo is played inside a perimeter of low boards: the ball (and the
occasional rider) bounces off them instead of disappearing across the car park. Good
boards are surprisingly fiddly — they have to be rigid enough to take a hit, light
enough to carry, and they need to **fold flat** so a club can stack them in a shed or a
van between games.

Rather than sketch one set on paper, I described the whole system parametrically in
[OpenSCAD](https://openscad.org/), so every dimension — ply thickness, sheet length,
board height, the angle of the support struts, where the hinge pockets get routed — is a
named variable at the top of the file. Change `ply_thickness` or `board_height` and the
geometry, the supports and the cut layout all update together.

```scad
// Material dimensions
ply_thickness = 12;
ply_length    = 2400;   // a standard ply sheet

// Board dimensions
board_height = 600;
strip_height = 100;

// Hinge parameters — routed pockets so the boards fold flat
hinge_router_width_wide   = 80;
hinge_router_width_narrow = 60;
hinge_height              = 100;
```

The model lays out the board panel, mirrors a pair of angled support struts, and marks
the routing positions for the hinges so the panels can fold against each other. A
separate `small_hinge.scad` models the hinge part itself, with a matching `.json` of its
parameters.

The interesting constraint is the same one furniture makers hit: everything has to come
out of a **2400 mm plywood sheet** with sensible offcuts, and the routed hinge pockets
have to line up across two panels for the fold to sit flush. Encoding that as variables
instead of fixed numbers means the design is really a *generator* — give it your sheet
size and your space, and it produces the cut geometry to match.

> The repo currently holds the OpenSCAD sources (`BIke Polo Boards.scad`,
> `small_hinge.scad`) and the hinge parameter file. A render and build photos make this
> sing — drop them in `img/` and this writeup will show them.
