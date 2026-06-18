/* =====================================================================
   STAMP CATALOGUE — NZ-bush paper-cut silhouettes
   ---------------------------------------------------------------------
   A library of reusable shapes for the shadow box (see RULES.md). Every
   stamp is a single connected paper-cut: one <g fill="…"> of solid black
   card, cuttable from one sheet (Rule 6 — nothing free-floating). Each is
   placed by its BASE point (x, baseY) and a height/scale, so the same
   stamp can sit on any sheet at any size.

   Signature convention:
     stamp(x, baseY, h, fill, seed [, opts])  ->  "<g fill=…>…</g>"

   The catalogue (CATALOGUE.md / catalogue.html) renders every stamp on
   the lit panel so each shape can be perfected in isolation.
   ===================================================================== */

/* deterministic PRNG so a given seed always draws the same plant */
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

/* ---------- pinnate fern frond — the core NZ detail element ----------
   A quadratic-bezier rachis (central rib) drawn as a solid tapering
   blade, with chunky leaflets (pinnae) running down both sides. Bold
   enough to read as a clean cut, not lacework. */
function rachis(len,curl,t){const cx=len*0.5,cy=-curl,x1=len;const mt=1-t;
  const x=2*mt*t*cx+t*t*x1, y=2*mt*t*cy;
  let dx=2*mt*cx+2*t*(x1-cx), dy=2*mt*cy-2*t*cy;const L=Math.hypot(dx,dy)||1;return{x,y,tx:dx/L,ty:dy/L};}

function frondPath({len=150,curl=46,leaves=15,leafLen=30,leafAngle=0.72,rib=3}){
  let d='';const rb=[];
  // solid rib envelope, tapering to a point at the tip
  for(let i=0;i<=leaves;i++){const t=i/leaves,p=rachis(len,curl,t);const nx=-p.ty,ny=p.tx,w=rib*(1-t)+0.5;
    rb.push([p.x+nx*w,p.y+ny*w]);rb.unshift([p.x-nx*w,p.y-ny*w]);}
  d+='M'+rb.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L')+' Z ';
  // leaflets — chunky leaf-blades, slightly back-swept, shrinking to the tip
  for(let i=1;i<=leaves;i++){const t=i/leaves,p=rachis(len,curl,t);const nx=-p.ty,ny=p.tx,ll=leafLen*(1-t*0.8);
    for(const side of[1,-1]){let dxx=nx*side+p.tx*leafAngle,dyy=ny*side+p.ty*leafAngle;const L=Math.hypot(dxx,dyy)||1;dxx/=L;dyy/=L;
      const ax=p.x+dxx*ll,ay=p.y+dyy*ll,bw=ll*0.24+2.0;
      const cxp=p.x+dxx*ll*0.5+p.tx*ll*0.2, cyp=p.y+dyy*ll*0.5+p.ty*ll*0.2;
      d+=`M${(p.x+p.tx*bw).toFixed(1)},${(p.y+p.ty*bw).toFixed(1)} Q${cxp.toFixed(1)},${cyp.toFixed(1)} ${ax.toFixed(1)},${ay.toFixed(1)} Q${(cxp).toFixed(1)},${(cyp+bw*0.6).toFixed(1)} ${(p.x-p.tx*bw).toFixed(1)},${(p.y-p.ty*bw).toFixed(1)} Z `;}}
  return d;}

/* single ground frond, rooted at (x,baseY), arcing in `dir` (deg) */
function frond(x,baseY,len,fill,seed,dir=-90){
  return `<g fill="${fill}"><g transform="translate(${x.toFixed(1)},${baseY.toFixed(1)}) rotate(${dir})"><path d="${frondPath({len,curl:len*0.42,leaves:Math.max(10,Math.round(len/12)),leafLen:len*0.22,leafAngle:0.7,rib:Math.max(2,len*0.02)})}"/></g></g>`;
}

/* ---------- koru / fiddlehead — an unfurling fern crozier ----------
   A fat spiral, drawn as a stroked path given width so it reads solid. */
function koru(x,baseY,h,fill,seed,dir=1){
  const turns=2.4, steps=46, a0=Math.PI*0.5;
  const cx=x+dir*h*0.16, cy=baseY-h*0.72, r0=h*0.30;
  let pts=[];
  for(let i=0;i<=steps;i++){const t=i/steps;const ang=a0+dir*turns*Math.PI*t;const r=r0*(1-0.82*t);
    pts.push([cx+Math.cos(ang)*r, cy-Math.sin(ang)*r]);}
  // stem from base up to the spiral start
  let d=`M${x.toFixed(1)},${baseY.toFixed(1)} L${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} `;
  d+='L'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L');
  const w=h*0.07;
  return `<g fill="none" stroke="${fill}" stroke-width="${w.toFixed(1)}" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></g>`;
}

/* ---------- tree fern / ponga — stout trunk + crown of arching fronds ---------- */
function treeFern(x,baseY,h,fill,seed,opts={}){
  const {fronds=9,spread=158,baseAng=-90}=opts;
  const r=rng(seed);let g=`<g fill="${fill}">`;
  const trunkH=h*0.62, frondLen=h*0.52;
  const tw=Math.max(5,trunkH*0.058), topY=baseY-trunkH;
  // slightly flared, fibrous trunk
  g+=`<path d="M${(x-tw*1.6).toFixed(1)},${baseY} C${(x-tw*0.8).toFixed(1)},${(baseY-trunkH*0.5).toFixed(1)} ${(x-tw*0.55).toFixed(1)},${(topY+12).toFixed(1)} ${(x-tw*0.55).toFixed(1)},${topY.toFixed(1)} L${(x+tw*0.55).toFixed(1)},${topY.toFixed(1)} C${(x+tw*0.55).toFixed(1)},${(topY+12).toFixed(1)} ${(x+tw*0.8).toFixed(1)},${(baseY-trunkH*0.5).toFixed(1)} ${(x+tw*1.6).toFixed(1)},${baseY} Z"/>`;
  g+=`<circle cx="${x.toFixed(1)}" cy="${topY.toFixed(1)}" r="${Math.max(7,frondLen*0.08).toFixed(1)}"/>`;
  for(let i=0;i<fronds;i++){
    const a=baseAng+((i/(fronds-1))-0.5)*spread+(r()-0.5)*6;
    const len=frondLen*(0.84+r()*0.28);
    g+=`<g transform="translate(${x.toFixed(1)},${topY.toFixed(1)}) rotate(${a.toFixed(1)})"><path d="${frondPath({len,curl:len*0.40,leaves:Math.max(7,Math.round(len/16)),leafLen:len*0.34,leafAngle:0.62,rib:Math.max(3.2,len*0.05)})}"/></g>`;
  }
  return g+`</g>`;
}

/* ---------- cabbage tree / tī kōuka — trunk + spiky sword-leaf heads ---------- */
function cabbageTree(x,baseY,h,fill,seed){
  const r=rng(seed);let g=`<g fill="${fill}">`;
  g+=`<path d="M${(x-3.8).toFixed(1)},${baseY} L${(x-2.1).toFixed(1)},${(baseY-h).toFixed(1)} L${(x+2.1).toFixed(1)},${(baseY-h).toFixed(1)} L${(x+3.8).toFixed(1)},${baseY} Z"/>`;
  const heads=[[x,baseY-h]];
  if(r()<0.8){const fy=baseY-h*0.82;
    g+=`<path d="M${x.toFixed(1)},${(baseY-h*0.62).toFixed(1)} L${(x-14).toFixed(1)},${(fy-8).toFixed(1)} L${(x-9).toFixed(1)},${(fy-13).toFixed(1)} L${x.toFixed(1)},${(baseY-h*0.56).toFixed(1)} Z"/>`;
    heads.push([x-13,fy-11],[x+9,fy-3]);}
  for(const [hx,hy] of heads){const n=14,base=24+r()*16;
    g+=`<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="6"/>`;
    for(let i=0;i<n;i++){const a=-Math.PI/2+((i/(n-1))-0.5)*Math.PI*1.62,ll=base*(0.7+r()*0.7);
      const tx=hx+Math.cos(a)*ll,ty=hy+Math.sin(a)*ll,px=-Math.sin(a)*3.4,py=Math.cos(a)*3.4;
      const mx=hx+Math.cos(a)*ll*0.55,my=hy+Math.sin(a)*ll*0.55+ll*0.12;
      g+=`<path d="M${(hx+px).toFixed(1)},${(hy+py).toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)} L${(hx-px).toFixed(1)},${(hy-py).toFixed(1)} Z"/>`;}}
  return g+`</g>`;
}

/* ---------- tall conifer (kahikatea / rimu) — slender trunk + feathered tiers ---------- */
function conifer(x,baseY,h,fill,seed,opts={}){
  const {droop=23,density=1,taper=2.4}=opts;
  const r=rng(seed);let g=`<g fill="${fill}">`;
  const top=baseY-h;
  g+=`<path d="M${(x-taper).toFixed(1)},${baseY} L${(x-0.9).toFixed(1)},${top.toFixed(1)} L${(x+0.9).toFixed(1)},${top.toFixed(1)} L${(x+taper).toFixed(1)},${baseY} Z"/>`;
  const tiers=Math.max(7,Math.round(h/19*density));
  for(let i=0;i<tiers;i++){
    const t=i/(tiers-1);
    const ty=top+Math.pow(t,1.05)*h*0.9;
    const len=13+t*h*0.18;
    for(const side of[1,-1]){
      const a=(side>0?droop:180-droop)+(r()-0.5)*8;
      g+=`<g transform="translate(${x.toFixed(1)},${ty.toFixed(1)}) rotate(${a.toFixed(1)})"><path d="${frondPath({len,curl:len*0.5,leaves:Math.max(6,Math.round(len/5)),leafLen:len*0.22,leafAngle:0.6,rib:Math.max(0.8,len*0.03)})}"/></g>`;
    }
  }
  g+=`<g transform="translate(${x.toFixed(1)},${(top-1).toFixed(1)}) rotate(-90)"><path d="${frondPath({len:Math.min(30,h*0.13),curl:4,leaves:6,leafLen:4,leafAngle:0.45,rib:0.8})}"/></g>`;
  return g+`</g>`;
}

/* ---------- lumpy foliage blob (one solid scalloped mass = a clean cut) ---------- */
function blob(cx,cy,rx,ry,lobes,r){
  const P=[];
  for(let i=0;i<lobes;i++){const a=i/lobes*2*Math.PI,k=0.82+r()*0.4;P.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);}
  let d=`M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
  for(let i=0;i<lobes;i++){const nxt=P[(i+1)%lobes],ma=(i+0.5)/lobes*2*Math.PI,bulge=1.12+r()*0.18;
    d+=` Q${(cx+Math.cos(ma)*rx*bulge).toFixed(1)},${(cy+Math.sin(ma)*ry*bulge).toFixed(1)} ${nxt[0].toFixed(1)},${nxt[1].toFixed(1)}`;}
  return d+' Z';
}

/* ---------- broadleaf / podocarp canopy tree (rātā / tawa) — trunk + lumpy crown ---------- */
function canopyTree(x,baseY,h,fill,seed){
  const r=rng(seed);let g=`<g fill="${fill}">`;
  const trunkH=h*0.40,crownH=h-trunkH,cy=baseY-trunkH-crownH*0.46,tw=Math.max(3.8,h*0.022);
  g+=`<path d="M${(x-tw).toFixed(1)},${baseY} C${(x-tw*0.6).toFixed(1)},${(baseY-trunkH*0.6).toFixed(1)} ${(x-tw*0.5).toFixed(1)},${(baseY-trunkH).toFixed(1)} ${(x-tw*0.5).toFixed(1)},${(baseY-trunkH-8).toFixed(1)} L${(x+tw*0.5).toFixed(1)},${(baseY-trunkH-8).toFixed(1)} C${(x+tw*0.5).toFixed(1)},${(baseY-trunkH).toFixed(1)} ${(x+tw*0.6).toFixed(1)},${(baseY-trunkH*0.6).toFixed(1)} ${(x+tw).toFixed(1)},${baseY} Z"/>`;
  const rx=h*0.30,ry=crownH*0.54;
  g+=`<path d="${blob(x,cy,rx,ry,13,r)}"/>`;
  g+=`<path d="${blob(x-rx*0.54,cy+ry*0.28,rx*0.62,ry*0.68,9,r)}"/>`;
  g+=`<path d="${blob(x+rx*0.58,cy+ry*0.2,rx*0.6,ry*0.72,9,r)}"/>`;
  g+=`<path d="${blob(x+rx*0.04,cy-ry*0.48,rx*0.64,ry*0.64,10,r)}"/>`;
  return g+`</g>`;
}

/* ---------- nīkau palm — ringed trunk + bulge + radiating fan of fronds ---------- */
function nikau(x,baseY,h,fill,seed,opts={}){
  const {spread=132,baseAng=-90}=opts;
  const r=rng(seed);let g=`<g fill="${fill}">`;
  const tw=Math.max(3.8,h*0.023),topY=baseY-h;
  g+=`<path d="M${(x-tw).toFixed(1)},${baseY} L${(x-tw*0.7).toFixed(1)},${(topY+h*0.12).toFixed(1)} L${(x+tw*0.7).toFixed(1)},${(topY+h*0.12).toFixed(1)} L${(x+tw).toFixed(1)},${baseY} Z"/>`;
  g+=`<ellipse cx="${x.toFixed(1)}" cy="${(topY+h*0.1).toFixed(1)}" rx="${(tw*1.95).toFixed(1)}" ry="${(h*0.05).toFixed(1)}"/>`;
  const cy=topY+h*0.06,fr=8,fl=h*0.5;
  for(let i=0;i<fr;i++){const t=i/(fr-1);const a=baseAng+(t-0.5)*spread+(r()-0.5)*6; const len=fl*(0.86+r()*0.24);
    g+=`<g transform="translate(${x.toFixed(1)},${cy.toFixed(1)}) rotate(${a.toFixed(1)})"><path d="${frondPath({len,curl:len*0.46,leaves:Math.max(9,Math.round(len/9)),leafLen:len*0.26,leafAngle:0.58,rib:Math.max(2.6,len*0.03)})}"/></g>`;}
  return g+`</g>`;
}

/* ---------- flax / harakeke — fan of stiff upright sword leaves ---------- */
function flax(x,baseY,h,fill,seed){
  const r=rng(seed);let g=`<g fill="${fill}">`;
  const n=9;
  for(let i=0;i<n;i++){const t=(i/(n-1))-0.5;
    const lean=t*0.9+(r()-0.5)*0.12, len=h*(0.78+ (0.22-Math.abs(t)*0.3) + r()*0.1);
    const tipx=x+lean*len*0.7, tipy=baseY-len, bw=Math.max(2.6,h*0.03)*(1-Math.abs(t)*0.3);
    const mx=x+lean*len*0.36, my=baseY-len*0.55;
    g+=`<path d="M${(x-bw).toFixed(1)},${baseY} Q${(mx-bw*0.4).toFixed(1)},${my.toFixed(1)} ${tipx.toFixed(1)},${tipy.toFixed(1)} Q${(mx+bw*0.4).toFixed(1)},${my.toFixed(1)} ${(x+bw).toFixed(1)},${baseY} Z"/>`;}
  return g+`</g>`;
}

/* ---------- toetoe / plume grass — arching stems topped by feathery plumes ---------- */
function toetoe(x,baseY,h,fill,seed){
  const r=rng(seed);let g=`<g fill="${fill}">`;
  const n=5;
  for(let i=0;i<n;i++){const t=(i/(n-1))-0.5;
    const lean=t*1.1+(r()-0.5)*0.15, len=h*(0.7+r()*0.4);
    const tipx=x+lean*len, tipy=baseY-len;
    // stem
    g+=`<path d="M${(x-1.4).toFixed(1)},${baseY} Q${(x+lean*len*0.4-1).toFixed(1)},${(baseY-len*0.55).toFixed(1)} ${(tipx-1).toFixed(1)},${tipy.toFixed(1)} L${(tipx+1).toFixed(1)},${tipy.toFixed(1)} Q${(x+lean*len*0.4+1).toFixed(1)},${(baseY-len*0.55).toFixed(1)} ${(x+1.4).toFixed(1)},${baseY} Z"/>`;
    // plume — a bold feathery flame: a tapered spine with soft barbs both sides
    const pl=len*0.6;
    const dirx=lean, diry=-1, L=Math.hypot(dirx,diry); const ux=dirx/L, uy=diry/L; const px=-uy, py=ux;
    const nb=9;
    g+=`<path d="${frondPath({len:pl,curl:pl*0.08,leaves:nb,leafLen:pl*0.34,leafAngle:0.78,rib:pl*0.05})}" transform="translate(${tipx.toFixed(1)},${tipy.toFixed(1)}) rotate(${(Math.atan2(uy,ux)*180/Math.PI).toFixed(1)})"/>`;}
  return g+`</g>`;
}

/* ---------- grass / reed tuft ---------- */
function grass(x,baseY,w,h,n,fill,seed){
  const r=rng(seed);let g=`<g fill="${fill}">`;
  for(let i=0;i<n;i++){
    const bx=x+(r()-0.5)*w,lean=(r()-0.5)*0.6,bh=h*(0.45+r()*0.75);
    const tipx=bx+lean*bh,tipy=baseY-bh,bw=1.3+r()*1.5,mx=bx+lean*bh*0.5,my=baseY-bh*0.55;
    g+=`<path d="M${(bx-bw).toFixed(1)},${baseY} Q${(mx-bw*0.5).toFixed(1)},${my.toFixed(1)} ${tipx.toFixed(1)},${tipy.toFixed(1)} Q${(mx+bw*0.5).toFixed(1)},${my.toFixed(1)} ${(bx+bw).toFixed(1)},${baseY} Z"/>`;
  }
  return g+`</g>`;
}

/* ---------- kiwi focal silhouette ---------- */
function kiwi(cx,cy,s,fill){
  const P=(x,y)=>`${(cx+x*s).toFixed(1)},${(cy+y*s).toFixed(1)}`;
  let g=`<g fill="${fill}">`;
  g+=`<path d="M${P(-54,-4)} C${P(-55,-26)} ${P(-32,-39)} ${P(-2,-39)} C${P(27,-39)} ${P(49,-27)} ${P(50,-7)} C${P(51,16)} ${P(28,28)} ${P(-6,28)} C${P(-36,28)} ${P(-54,17)} ${P(-54,-4)} Z"/>`;
  g+=`<path d="M${P(40,-27)} C${P(62,-31)} ${P(82,-18)} ${P(100,28)} L${P(92,31)} C${P(76,-7)} ${P(58,-18)} ${P(38,-16)} Z"/>`;
  g+=`<path d="M${P(-8,25)} L${P(-2,25)} L${P(-2,47)} L${P(-10,47)} Z"/>`;
  g+=`<path d="M${P(13,25)} L${P(19,25)} L${P(19,47)} L${P(11,47)} Z"/>`;
  return g+`</g>`;
}

/* ---------- fantail / pīwakawaka ---------- */
function fantail(cx,cy,s,fill){
  const P=(x,y)=>`${(cx+x*s).toFixed(1)},${(cy+y*s).toFixed(1)}`;
  let g=`<g fill="${fill}">`;
  g+=`<path d="M${P(0,0)} C${P(-6,-9)} ${P(5,-15)} ${P(11,-10)} C${P(17,-5)} ${P(14,5)} ${P(5,6)} C${P(1,6)} ${P(-2,4)} ${P(0,0)} Z"/>`;
  g+=`<path d="M${P(10,-12)} C${P(15,-19)} ${P(23,-16)} ${P(23,-10)} C${P(23,-6)} ${P(14,-6)} ${P(10,-8)} Z"/>`;
  g+=`<path d="M${P(23,-12)} L${P(31,-11)} L${P(23,-9)} Z"/>`;
  // the signature wide fanned tail — a clean solid sector, cocked up and back
  const pvx=-2,pvy=2,a0=Math.PI*0.78,a1=Math.PI*1.34,ln=27,seg=14;
  let tail=`M${P(pvx,pvy)} `;
  for(let i=0;i<=seg;i++){const a=a0+(a1-a0)*(i/seg);const rr=ln*(0.96+0.04*Math.sin(i/seg*Math.PI));
    tail+=`L${P(pvx+Math.cos(a)*rr,pvy-Math.sin(a)*rr)} `;}
  g+=`<path d="${tail}Z"/>`;
  return g+`</g>`;
}

/* ---------- tui — plump perching bird with a cocked tail ---------- */
function tui(cx,cy,s,fill){
  const P=(x,y)=>`${(cx+x*s).toFixed(1)},${(cy+y*s).toFixed(1)}`;
  let g=`<g fill="${fill}">`;
  // body
  g+=`<path d="M${P(-2,2)} C${P(-9,-6)} ${P(-4,-16)} ${P(6,-15)} C${P(16,-14)} ${P(18,-2)} ${P(12,5)} C${P(8,9)} ${P(2,8)} ${P(-2,2)} Z"/>`;
  // head + beak
  g+=`<path d="M${P(8,-13)} C${P(10,-20)} ${P(18,-20)} ${P(19,-13)} C${P(24,-15)} ${P(28,-14)} ${P(30,-13)} L${P(22,-9)} C${P(19,-7)} ${P(11,-8)} ${P(8,-13)} Z"/>`;
  // cocked tail
  g+=`<path d="M${P(-6,0)} L${P(-22,8)} L${P(-20,12)} L${P(-4,5)} Z"/>`;
  return g+`</g>`;
}

/* distant bird, drawn as a thin stroke (used as a light-HOLE in the sky) */
function bird(x,y,s,fill){
  return `<path d="M${(x-7*s).toFixed(1)},${y.toFixed(1)} Q${(x-3*s).toFixed(1)},${(y-4.5*s).toFixed(1)} ${x.toFixed(1)},${(y-0.5*s).toFixed(1)} Q${(x+3*s).toFixed(1)},${(y-4.5*s).toFixed(1)} ${(x+7*s).toFixed(1)},${y.toFixed(1)}" fill="none" stroke="${fill}" stroke-width="${(1.5*s).toFixed(2)}" stroke-linecap="round"/>`;
}
