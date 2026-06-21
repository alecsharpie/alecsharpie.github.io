/* =====================================================================
   STAMP CATALOGUE — NZ-bush paper-cut silhouettes
   ---------------------------------------------------------------------
   A library of reusable shapes for the shadow box (see RULES.md). Every
   stamp is a single connected paper-cut: one <g fill="…"> of solid black
   card, cuttable from one sheet (Rule 6 — nothing free-floating). Each is
   placed by its BASE point (x, baseY) and a height/scale, so the same
   stamp can sit on any sheet at any size.

   Signature convention — two families:
     • ground stamps:   stamp(x, baseY, h, fill, seed [, opts])  — placed by
       BASE point, sized by height, jittered by seed (the plants).
     • creature stamps: stamp(cx, cy, s, fill)  — placed by CENTRE, sized by a
       scale, deterministic line-art with no seed (kiwi/fantail).
   Both return  "<g fill=…>…</g>".

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

function frondPath({len=150,curl=46,leaves=15,leafLen=30,leafAngle=0.72,rib=3,bareBase=0}){
  let d='';const rb=[];
  // solid rib envelope, tapering to a point at the tip (runs full length so the frond
  // stays connected even when the lower stretch is a bare leafless stipe)
  for(let i=0;i<=leaves;i++){const t=i/leaves,p=rachis(len,curl,t);const nx=-p.ty,ny=p.tx,w=rib*(1-t)+0.5;
    rb.push([p.x+nx*w,p.y+ny*w]);rb.unshift([p.x-nx*w,p.y-ny*w]);}
  d+='M'+rb.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L')+' Z ';
  // leaflets (pinnae) — smooth pointed leaf-blades, back-swept & gently curved, densely
  // packed and longest a little up from the leafy start, shrinking to the tip. `bareBase`
  // keeps the lower fraction of the rachis leafless (a stipe) so a crown of fronds
  // converges as thin radiating ribs instead of one solid blob at the hub.
  for(let i=1;i<=leaves;i++){const t=i/leaves;if(t<bareBase)continue;const p=rachis(len,curl,t);const nx=-p.ty,ny=p.tx;
    const tn=(t-bareBase)/(1-bareBase);                       // 0 at leafy start → 1 at tip
    const prof=Math.min(1,tn*4.5)*(1-tn*0.78);               // short at the start, taper to tip
    const ll=leafLen*(0.35+prof);
    for(const side of[1,-1]){let dxx=nx*side+p.tx*leafAngle,dyy=ny*side+p.ty*leafAngle;const L=Math.hypot(dxx,dyy)||1;dxx/=L;dyy/=L;
      const px=-dyy,py=dxx;                                    // across the pinna
      const tipx=p.x+dxx*ll, tipy=p.y+dyy*ll, hw=ll*0.22+1.0;
      const bend=ll*0.10*side;                                 // slight scythe curve
      const c1x=p.x+dxx*ll*0.45+px*hw+p.tx*bend, c1y=p.y+dyy*ll*0.45+py*hw+p.ty*bend;
      const c2x=p.x+dxx*ll*0.45-px*hw+p.tx*bend, c2y=p.y+dyy*ll*0.45-py*hw+p.ty*bend;
      d+=`M${p.x.toFixed(1)},${p.y.toFixed(1)} Q${c1x.toFixed(1)},${c1y.toFixed(1)} ${tipx.toFixed(1)},${tipy.toFixed(1)} Q${c2x.toFixed(1)},${c2y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)} Z `;}}
  return d;}

/* single ground frond, rooted at (x,baseY), arcing in `dir` (deg) */
function frond(x,baseY,len,fill,seed,dir=-90){
  return `<g fill="${fill}"><g transform="translate(${x.toFixed(1)},${baseY.toFixed(1)}) rotate(${dir})"><path d="${frondPath({len,curl:len*0.17,leaves:Math.max(12,Math.round(len/12)),leafLen:len*0.225,leafAngle:0.6,rib:Math.max(2,len*0.02)})}"/></g></g>`;
}

/* ---------- koru / fiddlehead — an unfurling fern crozier ----------
   A single tapering ribbon: a stalk rising from the base that coils smoothly
   into a tight closed spiral — one solid filled paper-cut, fat at the foot and
   narrowing to the curled centre (no joint, no straight segment). */
function koruPath(x,baseY,h,dir=1,wScale=1){
  const steps=120, turns=2.05;
  // spiral centre, up and slightly to the coil side; base sits on its outer arm
  const cx=x+dir*h*0.13, cy=baseY-h*0.60;
  const dxb=x-cx, dyb=baseY-cy, r0=Math.hypot(dxb,dyb);
  const a0=Math.atan2(-(dyb),dxb);            // angle (y-up) of centre->base
  const pt=t=>{const ang=a0+dir*turns*2*Math.PI*t;const r=r0*Math.pow(1-t,1.18);
    return [cx+Math.cos(ang)*r, cy-Math.sin(ang)*r];};
  const w0=h*0.058*wScale;                     // half-width at the foot
  const hw=t=>w0*(1-0.86*t)+0.6;              // taper to the curled tip
  const L=[],R=[];
  for(let i=0;i<=steps;i++){const t=i/steps,p=pt(t);
    const a=pt(Math.min(1,t+1e-3)),b=pt(Math.max(0,t-1e-3));
    let dx=a[0]-b[0],dy=a[1]-b[1];const m=Math.hypot(dx,dy)||1;dx/=m;dy/=m;
    const nx=-dy,ny=dx,wt=hw(t);
    L.push([p[0]+nx*wt,p[1]+ny*wt]);R.push([p[0]-nx*wt,p[1]-ny*wt]);}
  return 'M'+L.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L')+
         ' L'+R.reverse().map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L')+' Z';
}
function koru(x,baseY,h,fill,seed,dir=1){
  return `<g fill="${fill}"><path d="${koruPath(x,baseY,h,dir)}"/></g>`;
}

/* ---------- fiddlehead / crozier — a tall stalk that coils into a tight spiral ----------
   ONE continuous tapering ribbon: it rises (mostly straight, gently leaning) from the
   base, then curls over into a closed snail-spiral at the top — not a coil sitting on a
   stick. Used standing up out of the ponga crown. */
function fiddleheadPath(bx,baseY,h,dir=1,w0=3){
  const stalkH=h*0.74, R0=h*0.082, turns=2.2;
  const lean=dir*h*0.05;
  const Sx=bx+lean, Sy=baseY-stalkH;               // top of the stalk = outer end of the coil
  const Ox=Sx-dir*R0, Oy=Sy;                        // coil centre, to the dir side of S
  const phi0=dir>0?0:Math.PI;                       // start angle so the coil leaves S going up
  const Cx=bx+lean*0.4, Cy=baseY-stalkH*0.5;        // stalk control (gentle bow)
  const pts=[],ws=[];
  const nS=16,nC=80;
  for(let i=0;i<nS;i++){const t=i/nS;
    pts.push([(1-t)*(1-t)*bx+2*(1-t)*t*Cx+t*t*Sx, (1-t)*(1-t)*baseY+2*(1-t)*t*Cy+t*t*Sy]);
    ws.push(w0*(1-0.34*t));}
  for(let i=0;i<=nC;i++){const u=i/nC;const phi=phi0+dir*turns*2*Math.PI*u;const rr=R0*Math.pow(1-u,0.7);
    pts.push([Ox+Math.cos(phi)*rr, Oy-Math.sin(phi)*rr]);
    ws.push(w0*0.66*(1-0.85*u)+0.5);}
  const Lp=[],Rp=[];
  for(let i=0;i<pts.length;i++){
    const a=pts[Math.min(pts.length-1,i+1)],b=pts[Math.max(0,i-1)];
    let dx=a[0]-b[0],dy=a[1]-b[1];const m=Math.hypot(dx,dy)||1;dx/=m;dy/=m;
    const nx=-dy,ny=dx,wt=ws[i];
    Lp.push([pts[i][0]+nx*wt,pts[i][1]+ny*wt]);Rp.push([pts[i][0]-nx*wt,pts[i][1]-ny*wt]);}
  return 'M'+Lp.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L')+
         ' L'+Rp.reverse().map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L')+' Z';
}

/* ---------- a single pinnate frond along an arbitrary quadratic rib ----------
   The rib is the quadratic bezier (0,0) -> control(cx,cy) -> tip(ex,ey), with
   leaflets down both sides. By putting the control overhead and the tip out to the
   side, a frond grows straight UP from the hub and then arches OUT to its tip; the
   lower `bareBase` fraction is a leafless stipe. */
function ribFrond({cx,cy,ex,ey,leaves=16,leafLen=24,leafAngle=0.6,rib=3,bareBase=0.2,trimSide=0,trimFrac=1,coneHalf=0,outerSign=0}){
  const B=t=>[2*(1-t)*t*cx+t*t*ex, 2*(1-t)*t*cy+t*t*ey];
  const T=t=>{let dx=2*(1-t)*cx+2*t*(ex-cx),dy=2*(1-t)*cy+2*t*(ey-cy);const L=Math.hypot(dx,dy)||1;return[dx/L,dy/L];};
  let d='';const rb=[];
  for(let i=0;i<=leaves;i++){const t=i/leaves,p=B(t),tg=T(t),nx=-tg[1],ny=tg[0],w=rib*(1-t)+0.5;
    rb.push([p[0]+nx*w,p[1]+ny*w]);rb.unshift([p[0]-nx*w,p[1]-ny*w]);}
  d+='M'+rb.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L')+' Z ';
  for(let i=1;i<=leaves;i++){const t=i/leaves;if(t<bareBase)continue;const p=B(t),tg=T(t),nx=-tg[1],ny=tg[0],tx=tg[0],ty=tg[1];
    const tn=(t-bareBase)/(1-bareBase),prof=Math.min(1,tn*4.5)*(1-tn*0.78),ll=leafLen*(0.35+prof);
    for(const side of[1,-1]){let dxx=nx*side+tx*leafAngle,dyy=ny*side+ty*leafAngle;const L=Math.hypot(dxx,dyy)||1;dxx/=L;dyy/=L;
      // drop outer-side leaflets to clean the cone edge; trimFrac<1 removes only the
      // basal stretch (t<=trimFrac) — the ones that splay out past the next frond's rib
      if(t<=trimFrac){ if(trimSide>0&&dxx>0)continue; if(trimSide<0&&dxx<0)continue; }
      const px=-dyy,py=dxx,tipx=p[0]+dxx*ll,tipy=p[1]+dyy*ll,hw=ll*0.22+1.0,bend=ll*0.10*side;
      // cone clip: drop any outer-side leaflet whose tip splays past the cone edge angle
      // (= the outermost frond's rachis), so nothing pokes through the clean silhouette.
      if(coneHalf&&outerSign){const ang=Math.atan2(tipx,-tipy); if(outerSign>0?ang>coneHalf:ang<-coneHalf)continue;}
      const c1x=p[0]+dxx*ll*0.45+px*hw+tx*bend,c1y=p[1]+dyy*ll*0.45+py*hw+ty*bend;
      const c2x=p[0]+dxx*ll*0.45-px*hw+tx*bend,c2y=p[1]+dyy*ll*0.45-py*hw+ty*bend;
      d+=`M${p[0].toFixed(1)},${p[1].toFixed(1)} Q${c1x.toFixed(1)},${c1y.toFixed(1)} ${tipx.toFixed(1)},${tipy.toFixed(1)} Q${c2x.toFixed(1)},${c2y.toFixed(1)} ${p[0].toFixed(1)},${p[1].toFixed(1)} Z `;}}
  return d;
}

/* ---------- crown of pinnate fronds growing UP then OUT from one hub ----------
   Shared by the tree ferns and the nīkau. Every frond rises vertically from the
   crown hub, then arches OUT to its tip; outer fronds are longer (the mature ones)
   and droop more. `maxLean` sets how far the tips fan from vertical (nīkau small =
   upright, mamaku large = spreading); `droopK` how far the outer tips weep over.
   `tilt` rotates the whole crown about the hub (for trees leaning into a margin). */
function frondCrown(cx,cy,frondLen,fronds,r,opts={}){
  const {leafAngle=0.55,leafLenK=0.2,ribK=0.04,bareBase=0.22,
         maxLean=90,leanPow=1.3,rise=0.5,riseLean=0.22,outK=0.95,
         droopK=0.35,lenLo=0.8,lenHi=0.18,lenOut=0.18,innerRatio=0.4,jit=4,tilt=0,coneTrim=0,centerGap=0,
         coreBand=0,coreShort=1,dropOuter=0,coneTrim2=0,coneTrim2Frac=0.5,coneClip=0}=opts;
  const D=Math.PI/180;let g='';
  // the outermost drawn frond sets the cone edge angle; clip leaflets that splay past it
  const afMax=(fronds<=1)?0:1-2*dropOuter/(fronds-1);
  const coneHalf=coneClip?maxLean*Math.pow(afMax,leanPow)*D*coneClip:0;
  const frondAt=(len,th,trimSide=0,trimFrac=1)=>{
    let ex=Math.sin(th)*len*outK, rl=riseLean;
    const ey=-Math.cos(th)*len + droopK*len*Math.abs(Math.sin(th));
    if(trimSide){ rl=riseLean-0.14; }                // outer cone fronds curve very slightly inwards
    const ccx=ex*rl, ccy=-rise*len;
    const leaves=Math.max(16,Math.round(len/4.6));
    return `<path d="${ribFrond({cx:ccx,cy:ccy,ex,ey,leaves,leafLen:len*leafLenK,leafAngle,rib:Math.max(2.6,len*ribK),bareBase,trimSide,trimFrac,coneHalf,outerSign:Math.sign(ex)})}"/>`;
  };
  for(let i=0;i<fronds;i++){
    if(i<dropOuter||i>=fronds-dropOuter)continue;          // drop the outermost frond(s) on each side
    const f=(fronds===1)?0:(i/(fronds-1))*2-1, af=Math.abs(f);
    if(af<centerGap)continue;                              // leave a gap in the upright centre
    const th=Math.sign(f)*Math.pow(af,leanPow)*maxLean*D+(r()-0.5)*jit*D;
    // outermost fronds keep leaflets only on the inner side → clean cone edge;
    // the next fronds in (coneTrim2..coneTrim) get a partial outer-side trim, dropping
    // only the basal leaflets that splay past the outermost frond's rib.
    let trimSide=0, trimFrac=1;
    if(coneTrim&&af>coneTrim){ trimSide=Math.sign(f||1); }
    else if(coneTrim2&&af>coneTrim2){ trimSide=Math.sign(f||1); trimFrac=coneTrim2Frac; }
    const lenMul=(af<coreBand)?coreShort:1;               // shorten the upright near-centre fronds
    g+=frondAt(frondLen*(lenLo+lenOut*af+r()*lenHi)*lenMul, th, trimSide, trimFrac);
  }
  // inner ring: shorter, more upright fronds filling the crown core
  const inner=Math.round(fronds*innerRatio);
  for(let i=0;i<inner;i++){
    const f=(inner<=1)?0:(i/(inner-1))*2-1;
    const th=Math.sign(f)*Math.pow(Math.abs(f),leanPow+0.4)*maxLean*0.58*D+(r()-0.5)*jit*D;
    g+=frondAt(frondLen*(0.5+r()*0.14), th);
  }
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})${tilt?` rotate(${tilt})`:''}">${g}</g>`;
}

/* ---------- mamaku — tall, slender, bendy tree fern (black tree fern) ----------
   A very tall thin trunk topped by a wide parasol of long fronds that radiate
   from one point and weep right down on both sides (RULES.md §6). */
function mamaku(x,baseY,h,fill,seed,opts={}){
  const {fronds=15,spread,baseAng}=opts;
  const r=rng(seed);let g=`<g fill="${fill}">`;
  const trunkH=h*0.66, frondLen=h*0.42;
  const tw=Math.max(2.4,trunkH*0.020);          // very skinny trunk
  const lean=(0.5+r()*0.5)*(r()<0.5?-1:1)*h*0.12;  // a definite gentle bend
  const topX=x+lean, topY=baseY-trunkH;
  const midX=x+lean*0.35, midY=baseY-trunkH*0.5;
  // slender slightly-bent trunk, faint flare at the foot
  g+=`<path d="M${(x-tw*1.7).toFixed(1)},${baseY} C${(x-tw).toFixed(1)},${(baseY-trunkH*0.4).toFixed(1)} ${(midX-tw).toFixed(1)},${midY.toFixed(1)} ${(topX-tw*0.8).toFixed(1)},${topY.toFixed(1)} L${(topX+tw*0.8).toFixed(1)},${topY.toFixed(1)} C${(midX+tw).toFixed(1)},${midY.toFixed(1)} ${(x+tw).toFixed(1)},${(baseY-trunkH*0.4).toFixed(1)} ${(x+tw*1.7).toFixed(1)},${baseY} Z"/>`;
  g+=`<circle cx="${topX.toFixed(1)}" cy="${topY.toFixed(1)}" r="${Math.max(2.6,frondLen*0.028).toFixed(1)}"/>`;
  // fronds grow up from the crown then arch out & weep over — wide spreading parasol,
  // outer (mature) fronds longest and drooping most
  const crownOpts={maxLean:114,leanPow:1.25,rise:0.34,riseLean:0.22,outK:1.05,droopK:0.62,
       leafAngle:0.5,leafLenK:0.18,ribK:0.030,bareBase:0.4,lenLo:0.84,lenHi:0.14,lenOut:0.2,innerRatio:0.2,jit:8};
  if(spread!=null) crownOpts.maxLean=spread*0.5;
  if(baseAng!=null) crownOpts.tilt=baseAng+90;
  g+=frondCrown(topX,topY,frondLen,fronds,r,crownOpts);
  return g+`</g>`;
}
/* legacy name kept for the scene (silhouette.html) */
const treeFern = mamaku;

/* ---------- ponga — silver fern: shorter, wider tree fern + croziers ----------
   A stout shortish trunk under a broad spreading crown of fronds, with several
   unfurling koru fiddleheads standing up out of the crown centre (ponga.jpg). */
function ponga(x,baseY,h,fill,seed,opts={}){
  const {fronds=12,spread,baseAng}=opts;
  const r=rng(seed);let g=`<g fill="${fill}">`;
  const trunkH=h*0.28, frondLen=h*0.44;          // short trunk, long → wide vase crown
  const tw=Math.max(3,h*0.032), topY=baseY-trunkH;
  // thick, squarish fibrous trunk: near-vertical sides with a slight flare at the foot, and a
  // shoulder near the top that converges into the crown so it meets the leaves cleanly
  g+=`<path d="M${(x-tw*1.5).toFixed(1)},${baseY} L${(x-tw).toFixed(1)},${(baseY-trunkH*0.22).toFixed(1)} L${(x-tw).toFixed(1)},${(topY+frondLen*0.10).toFixed(1)} L${(x-tw*0.5).toFixed(1)},${topY.toFixed(1)} L${(x+tw*0.5).toFixed(1)},${topY.toFixed(1)} L${(x+tw).toFixed(1)},${(topY+frondLen*0.10).toFixed(1)} L${(x+tw).toFixed(1)},${(baseY-trunkH*0.22).toFixed(1)} L${(x+tw*1.5).toFixed(1)},${baseY} Z"/>`;
  // solid hub bridging trunk-top and the fronds so they read as one connected cut
  g+=`<circle cx="${x.toFixed(1)}" cy="${topY.toFixed(1)}" r="${Math.max(6,frondLen*0.09).toFixed(1)}"/>`;
  // fronds grow up from the crown then arch out & weep over — full rounded vase crown
  const crownOpts={maxLean:94,leanPow:1.18,rise:0.42,riseLean:0.22,outK:1.0,droopK:0.46,
       leafAngle:0.52,leafLenK:0.2,ribK:0.036,bareBase:0.5,lenLo:0.92,lenHi:0.04,lenOut:-0.14,innerRatio:0,jit:4,centerGap:0.12,coreBand:0.4,coreShort:0.68};
  if(spread!=null) crownOpts.maxLean=spread*0.5;
  if(baseAng!=null) crownOpts.tilt=baseAng+90;
  g+=frondCrown(x,topY,frondLen,fronds,r,crownOpts);
  // the two central fronds moved to the FRONT: they arch forward & droop down over the trunk
  for(const sd of [-1,1]){
    const fl=frondLen*0.9;
    const ex=sd*fl*0.30, ey=fl*0.52;                       // tip drapes down & a little to the side
    const ccx=sd*fl*0.16, ccy=fl*0.02;                     // gentle forward bow
    const leaves=Math.max(16,Math.round(fl/4.6));
    g+=`<g transform="translate(${x.toFixed(1)},${topY.toFixed(1)})"><path d="${ribFrond({cx:ccx,cy:ccy,ex,ey,leaves,leafLen:fl*0.2,leafAngle:0.52,rib:Math.max(2.6,fl*0.036),bareBase:0.32})}"/></g>`;
  }
  // unfurling fiddleheads standing up out of the crown centre — each ONE continuous
  // ribbon (stalk coiling into a tight spiral), rooted in the crown, clearing the top.
  const nc=3;
  for(let i=0;i<nc;i++){
    const t=(i/(nc-1))-0.5;
    const ch=frondLen*(1.0+(0.5-Math.abs(t))*0.44+r()*0.06);  // centre tall, sides short → staggered
    const dir=t<0?-1:1, sw=Math.max(1.6,frondLen*0.024);       // coil faces in toward the centre
    // all rooted at the crown hub (same origin as the fronds), fanned out by rotation
    g+=`<g transform="rotate(${(t*52).toFixed(1)} ${x.toFixed(1)} ${topY.toFixed(1)})"><path d="${fiddleheadPath(x,topY,ch,dir,sw)}"/></g>`;
  }
  return g+`</g>`;
}

/* ---------- cabbage tree / tī kōuka — forked bare trunk + rounded spiky mop-heads ----------
   A clear trunk that forks into a few bare branches, each tipped by a dense radiating
   ball of stiff sword-leaves (a spiky pom-pom), the lower leaves arching down. */
function cabbageHead(hx,hy,rad,r){
  // two rings of stiff sword-leaves: a longer outer spray + a shorter inner fill,
  // so the head reads as a dense shaggy mop, not a sparse starburst.
  const hubR=rad*0.40;                                     // big solid core so the head reads as a filled ball
  let d=`M${(hx+hubR).toFixed(1)},${hy.toFixed(1)} A${hubR.toFixed(1)},${hubR.toFixed(1)} 0 1 0 ${(hx-hubR).toFixed(1)},${hy.toFixed(1)} A${hubR.toFixed(1)},${hubR.toFixed(1)} 0 1 0 ${(hx+hubR).toFixed(1)},${hy.toFixed(1)} Z `;
  const ring=(n,lo,hi,wk,off)=>{
    for(let i=0;i<n;i++){
      const a=(i/n)*2*Math.PI - Math.PI/2 + off + (r()-0.5)*0.16;
      const dx=Math.cos(a),dy=Math.sin(a);
      const len=rad*(lo+r()*(hi-lo));
      const droop=(dy+1)/2;                                 // 0 up · 1 down → tips bow down
      const tx=hx+dx*len, ty=hy+dy*len+len*0.55*droop;      // stronger droop on the lower leaves
      const bw=rad*wk*(0.9+r()*0.25), px=-dy*bw, py=dx*bw;  // chunkier blade roots → crisp edge
      // sabre bow: control nudged sideways so the blade arches, not a straight needle
      const sw=(r()<0.5?1:-1)*len*0.10;
      const cx=hx+dx*len*0.55-dy*sw, cy=hy+dy*len*0.55+len*0.40*droop+dx*sw;
      d+=`M${(hx+px).toFixed(1)},${(hy+py).toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${(hx-px).toFixed(1)},${(hy-py).toFixed(1)} Z `;}};
  ring(34,0.92,1.12,0.15,0);          // outer long spray — tighter length variance
  ring(30,0.62,0.82,0.17,0.10);       // mid fill — keeps the ball dense
  ring(24,0.42,0.60,0.19,0.21);       // inner short fill, blends into the hub
  return d;
}
function cabbageTree(x,baseY,h,fill,seed){
  const r=rng(seed);let g=`<g fill="${fill}">`;
  const top=baseY-h, forkY=baseY-h*0.52, tw=Math.max(1.4,h*0.026);
  // heads: one tall centre, two lower side heads on splayed branches
  const heads=[[x+h*0.04,top,h*0.20],[x-h*0.24,baseY-h*0.70,h*0.165],[x+h*0.23,baseY-h*0.63,h*0.155]];
  // trunk to the fork, then a bare limb out to each head
  g+=`<path d="M${(x-tw).toFixed(1)},${baseY} L${(x-tw*0.55).toFixed(1)},${forkY.toFixed(1)} L${(x+tw*0.55).toFixed(1)},${forkY.toFixed(1)} L${(x+tw).toFixed(1)},${baseY} Z"/>`;
  for(const [hx,hy] of heads){
    const w0=tw*0.7, w1=Math.max(1.6,tw*0.34);
    const dx=hx-x,dy=hy-forkY,m=Math.hypot(dx,dy)||1,nx=-dy/m*0.5,ny=dx/m*0.5;
    const mxx=(x+hx)/2-dx*0.04, myy=(forkY+hy)/2;          // gentle bow
    g+=`<path d="M${(x+nx*w0).toFixed(1)},${(forkY+ny*w0).toFixed(1)} Q${(mxx+nx*w1).toFixed(1)},${(myy+ny*w1).toFixed(1)} ${(hx+nx*w1).toFixed(1)},${(hy+ny*w1).toFixed(1)} L${(hx-nx*w1).toFixed(1)},${(hy-ny*w1).toFixed(1)} Q${(mxx-nx*w1).toFixed(1)},${(myy-ny*w1).toFixed(1)} ${(x-nx*w0).toFixed(1)},${(forkY-ny*w0).toFixed(1)} Z"/>`;
  }
  for(const [hx,hy,rad] of heads) g+=`<path d="${cabbageHead(hx,hy,rad,r)}"/>`;
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

/* ---------- pōhutukawa — broad coastal tree: spreading branches + wide flat dome ----------
   A short trunk that forks low into a few boughs splaying out sideways, holding a
   broad billowing canopy that is wider than it is tall with a gently flattened top
   (pohutukawa.jpg). One connected paper-cut. */
function pohutukawa(x,baseY,h,fill,seed){
  const r=rng(seed);let g=`<g fill="${fill}">`;
  const trunkH=h*0.38, forkY=baseY-trunkH*0.55, tw=Math.max(1.8,h*0.030);
  const crownCy=baseY-h*0.70;
  const rx=h*0.52, ry=h*0.24;
  // short trunk to the low fork
  g+=`<path d="M${(x-tw).toFixed(1)},${baseY} C${(x-tw*0.7).toFixed(1)},${(baseY-trunkH*0.5).toFixed(1)} ${(x-tw*0.6).toFixed(1)},${forkY.toFixed(1)} ${(x-tw*0.5).toFixed(1)},${forkY.toFixed(1)} L${(x+tw*0.5).toFixed(1)},${forkY.toFixed(1)} C${(x+tw*0.6).toFixed(1)},${forkY.toFixed(1)} ${(x+tw*0.7).toFixed(1)},${(baseY-trunkH*0.5).toFixed(1)} ${(x+tw).toFixed(1)},${baseY} Z"/>`;
  // a tapered, gently-bowed limb segment (one connected cut)
  const limb=(ax,ay,bx,by,wa,wb)=>{
    const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,bow=(bx-ax)*0.14;
    const cx=(ax+bx)/2+nx*bow, cy=(ay+by)/2+ny*bow;
    g+=`<path d="M${(ax+nx*wa).toFixed(1)},${(ay+ny*wa).toFixed(1)} Q${(cx+nx*wb).toFixed(1)},${(cy+ny*wb).toFixed(1)} ${(bx+nx*wb).toFixed(1)},${(by+ny*wb).toFixed(1)} L${(bx-nx*wb).toFixed(1)},${(by-ny*wb).toFixed(1)} Q${(cx-nx*wb).toFixed(1)},${(cy-ny*wb).toFixed(1)} ${(ax-nx*wa).toFixed(1)},${(ay-ny*wa).toFixed(1)} Z"/>`;
  };
  // candelabra skeleton: fork → three boughs → each splits into twigs that carry the foliage,
  // so the branches elegantly divide and turn into leaves rather than ending in one blob.
  const bw0=tw*0.95, bw1=tw*0.5, bw2=Math.max(1.3,tw*0.26);
  const nodes=[
    [x-rx*0.36, crownCy+ry*0.62],   // left bough node
    [x+rx*0.02, crownCy+ry*0.40],   // centre bough node
    [x+rx*0.40, crownCy+ry*0.56],   // right bough node
  ];
  for(const [nx2,ny2] of nodes) limb(x,forkY,nx2,ny2,bw0,bw1);
  // twigs off each node → canopy tips (the outer ring of the dome)
  const tips=[];
  const splits=[
    [0,[[x-rx*0.86,crownCy+ry*0.10],[x-rx*0.58,crownCy-ry*0.40],[x-rx*0.26,crownCy-ry*0.66]]],
    [1,[[x-rx*0.04,crownCy-ry*0.86],[x+rx*0.30,crownCy-ry*0.66]]],
    [2,[[x+rx*0.60,crownCy-ry*0.34],[x+rx*0.86,crownCy+ry*0.12],[x+rx*0.30,crownCy-ry*0.04]]],
  ];
  for(const [ni,outs] of splits){
    const [nx2,ny2]=nodes[ni];
    for(const t of outs){ limb(nx2,ny2,t[0],t[1],bw1,bw2); tips.push(t); }
  }
  // foliage clumps at the twig tips — billowing lobes round the canopy edge. They overlap
  // along the top into one broad dome but leave airy sky-gaps lower down between the branches.
  for(const [tx,ty] of tips) g+=`<path d="${blob(tx,ty,rx*0.26,ry*0.60,10,r)}"/>`;
  // a couple of lobes bridging the top so the dome crest reads continuous
  g+=`<path d="${blob(x-rx*0.16,crownCy-ry*0.78,rx*0.22,ry*0.42,10,r)}"/>`;
  g+=`<path d="${blob(x+rx*0.16,crownCy-ry*0.76,rx*0.22,ry*0.42,10,r)}"/>`;
  return g+`</g>`;
}
/* legacy name kept for the scene (silhouette.html) */
const canopyTree = pohutukawa;

/* ---------- nīkau palm — ringed trunk + bulge + radiating fan of fronds ---------- */
function nikau(x,baseY,h,fill,seed,opts={}){
  const {spread,baseAng,fronds=7}=opts;
  const r=rng(seed);let g=`<g fill="${fill}">`;
  const tw=Math.max(1.5,h*0.023),topY=baseY-h;
  // tall smooth ringed trunk: runs from the foot up to the base of the crownshaft
  const csBot=topY+h*0.18;                              // where the crownshaft starts
  g+=`<path d="M${(x-tw).toFixed(1)},${baseY} L${(x-tw*0.7).toFixed(1)},${csBot.toFixed(1)} L${(x+tw*0.7).toFixed(1)},${csBot.toFixed(1)} L${(x+tw).toFixed(1)},${baseY} Z"/>`;
  // pronounced bulging crownshaft — a short, fat smooth bulb: bows out wide low down
  // then necks back in to a slim neck just under the crown (a distinct swelling).
  const csTop=topY+h*0.06, csMid=topY+h*0.13, bulge=tw*2.6;
  g+=`<path d="M${(x-tw*0.7).toFixed(1)},${csBot.toFixed(1)} C${(x-bulge).toFixed(1)},${csMid.toFixed(1)} ${(x-bulge*0.55).toFixed(1)},${(csTop+h*0.015).toFixed(1)} ${(x-tw*0.45).toFixed(1)},${csTop.toFixed(1)} L${(x+tw*0.45).toFixed(1)},${csTop.toFixed(1)} C${(x+bulge*0.55).toFixed(1)},${(csTop+h*0.015).toFixed(1)} ${(x+bulge).toFixed(1)},${csMid.toFixed(1)} ${(x+tw*0.7).toFixed(1)},${csBot.toFixed(1)} Z"/>`;
  // drooping flower/fruit panicle bursting from the neck just below the bulge and
  // weeping down around the trunk top. Each strand is a continuous tapered ribbon (so it
  // reads as ONE connected cut, RULES §6) with little fruit beads riding along its spine.
  const ix=x, iy=csBot, nStem=11, reach=bulge*1.7, drop=h*0.16, beadR=Math.max(0.9,h*0.013);
  // solid collar at the neck so every strand joins the trunk as one piece
  g+=`<ellipse cx="${ix.toFixed(1)}" cy="${iy.toFixed(1)}" rx="${(reach*0.32).toFixed(1)}" ry="${(beadR*1.8).toFixed(1)}"/>`;
  for(let s=0;s<nStem;s++){
    const u=(s/(nStem-1))*2-1, au=Math.abs(u);          // -1..1 across the spread
    const ex2=ix+u*reach*0.78, ey2=iy+drop*(0.82+0.18*(1-au));  // all strands weep down, centre lowest
    const cx2=ix+u*reach, cy2=iy+drop*0.16;              // control out near the top → arch out then down
    const B=t=>[(1-t)*(1-t)*ix+2*(1-t)*t*cx2+t*t*ex2, (1-t)*(1-t)*iy+2*(1-t)*t*cy2+t*t*ey2];
    const Tg=t=>{let dx=2*(1-t)*(cx2-ix)+2*t*(ex2-cx2),dy=2*(1-t)*(cy2-iy)+2*t*(ey2-cy2);const L=Math.hypot(dx,dy)||1;return[dx/L,dy/L];};
    // tapered ribbon spine
    const N=12,top=[],bot=[];
    for(let i=0;i<=N;i++){const t=i/N,p=B(t),tg=Tg(t),nx=-tg[1],ny=tg[0],w=beadR*0.8*(1-t)+beadR*0.3*t;
      top.push([p[0]+nx*w,p[1]+ny*w]);bot.unshift([p[0]-nx*w,p[1]-ny*w]);}
    g+=`<path d="M${top.concat(bot).map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L')} Z"/>`;
    // fruit beads as knobs riding on (and overlapping) the spine — stay one piece
    const beads=8;
    for(let b=1;b<=beads;b++){const t=b/beads,p=B(t),br=beadR*(0.95-0.45*t);
      g+=`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${br.toFixed(1)}"/>`;}
  }
  // crown emanates right at the slim neck atop the bulb, so the swelling reads below it.
  const cy=csTop-h*0.005,fl=h*0.44;
  // solid hub bridging the crownshaft neck and the frond bases — closes the gap below the crown
  g+=`<path d="M${(x-tw*1.0).toFixed(1)},${csTop.toFixed(1)} L${(x+tw*1.0).toFixed(1)},${csTop.toFixed(1)} L${(x+bulge*0.44).toFixed(1)},${(cy-h*0.07).toFixed(1)} L${(x-bulge*0.44).toFixed(1)},${(cy-h*0.07).toFixed(1)} Z"/>`;
  g+=`<circle cx="${x.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(bulge*0.42).toFixed(1)}"/>`;
  // feather fronds grow UP from the crownshaft then arch OUT — the most upright crown of
  // the three (least lean, least droop): a tall shuttlecock of fine pinnate fronds.
  const crownOpts={maxLean:50,leanPow:1.0,rise:0.30,riseLean:0.5,outK:1.0,droopK:0.04,
       leafAngle:0.92,leafLenK:0.26,ribK:0.026,bareBase:0.3,lenLo:0.92,lenHi:0,lenOut:-0.04,innerRatio:0.22,jit:0,coneTrim:0.5,coneClip:1.0,dropOuter:1};
  if(spread!=null) crownOpts.maxLean=spread*0.5;
  if(baseAng!=null) crownOpts.tilt=baseAng+90;
  // solid cone core behind the fronds — fills interior gaps so the crown body reads as one
  // piece; kept inside the outer-frond edge (~30°) so it never shows past the textured top.
  const coreH=fl*0.5, coreW=Math.tan(23*Math.PI/180)*coreH;
  g+=`<path d="M${x.toFixed(1)},${cy.toFixed(1)} L${(x-coreW).toFixed(1)},${(cy-coreH).toFixed(1)} L${(x+coreW).toFixed(1)},${(cy-coreH).toFixed(1)} Z"/>`;
  g+=frondCrown(x,cy,fl,fronds,r,crownOpts);
  return g+`</g>`;
}

/* ---------- flax / harakeke — fan of stiff upright sword leaves ---------- */
function flax(x,baseY,h,fill,seed){
  const r=rng(seed);let g=`<g fill="${fill}">`;
  const n=11;
  // fan of broad stiff sword-leaves — hold width then taper, outer ones lean & arch over more.
  // skip the two outermost upright blades on each side so the fan stays narrow.
  for(let i=2;i<n-2;i++){const t=(i/(n-1))-0.5;
    const edge=(i===2||i===n-3);                                 // the two outermost upright blades
    const lean=(edge?t*0.85:t*1.75)+(r()-0.5)*0.10, len=h*(0.74+ (0.22-Math.abs(t)*0.30) + r()*0.22);  // varied lengths
    // the outermost two rise more vertically then arch over, drooping to about half height
    const arch=edge?1.05:Math.abs(t)*0.7;                         // outer leaves bend over near the tip
    const droop=Math.sign(t||1)*len*(edge?0.2:Math.abs(t)*0.6);   // outer tips nod down (less outward swing)
    const tipx=x+lean*len*0.82+droop, tipy=baseY-len*(1-arch*0.42);   // outer tips nod lower
    const bw=Math.max(5.0,h*0.058)*(1-Math.abs(t)*0.24);         // broad blade base
    const bx=x+t*h*0.18;                                          // tight root cluster → blades fan out from a point
    // control points so the blade holds its width well up the shaft, then tapers near the tip;
    // upper control pushed further out than the tip so the blade bows over (arches) near the point
    const lowy=baseY-len*0.42, midy=baseY-len*0.78;
    const lx=bx+lean*len*0.22, mx=x+lean*len*0.62+droop*1.25;
    const wlow=bw*1.0, wmid=bw*0.62;                             // width profile: full low, still broad high
    g+=`<path d="M${(bx-bw).toFixed(1)},${baseY} `
      +`C${(lx-wlow).toFixed(1)},${lowy.toFixed(1)} ${(mx-wmid).toFixed(1)},${midy.toFixed(1)} ${tipx.toFixed(1)},${tipy.toFixed(1)} `
      +`C${(mx+wmid).toFixed(1)},${midy.toFixed(1)} ${(lx+wlow).toFixed(1)},${lowy.toFixed(1)} ${(bx+bw).toFixed(1)},${baseY} Z"/>`;}
  // a few old "grandad" leaves: the outermost oldest blades arch up then flop over, their
  // tips drooping right back down toward the ground (harakeke.jpg) — a touch of realism.
  // [side, size, lift] — lift fans the spray across angles: 0 = flops low to the ground,
  // 1 = held out near-horizontal to bridge the gap up into the upright fan.
  const grandads=[[-1,1.0,0.0],[1,0.92,0.72],[-1,0.78,0.46],[1,1.06,0.08],[-1,0.66,0.86],[1,0.74,0.30],[-1,0.88,0.20]];
  for(const [sd,k,lift] of grandads){
    const reach=h*(0.50+lift*0.14)*k, bw=Math.max(5.2,h*0.072);
    const tipx=x+sd*reach, tipy=baseY-h*(0.13+lift*0.52)*k;     // lift raises the tip → leaf points out, not down
    const gbx=x+sd*h*0.13;                                      // root off-centre so the bases don't stack into a block
    const c1x=x+sd*h*0.28, c1y=baseY-h*(0.34+lift*0.12)*k;      // rise fairly upright, then reach out
    const c2x=x+sd*h*0.46, c2y=baseY-h*(0.70+lift*0.22)*k;      // arches over the high outer bend
    g+=`<path d="M${(gbx-sd*bw).toFixed(1)},${baseY} `
      +`C${(c1x-sd*bw*0.5).toFixed(1)},${c1y.toFixed(1)} ${(c2x-sd*bw*0.5).toFixed(1)},${(c2y-bw).toFixed(1)} ${tipx.toFixed(1)},${tipy.toFixed(1)} `
      +`C${(c2x+sd*bw*0.5).toFixed(1)},${(c2y+bw*0.4).toFixed(1)} ${(c1x+sd*bw*0.5).toFixed(1)},${c1y.toFixed(1)} ${(gbx+sd*bw).toFixed(1)},${baseY} Z"/>`;
  }
  // tall flower stalks (kōrari) rising well above the fan. Each stalk is mostly BARE,
  // carrying a handful of distinct flower CLUSTERS spaced up its length and alternating
  // side to side — a sparse candelabra, not a dense spike. Each cluster is a small fan of
  // curved tubular flowers ("claws") that bow outward then curl back up to a point (harakeke.jpg).
  const stalks=[[-0.10,1.34,-1],[0.06,1.46,1],[0.18,1.22,1]];
  // one curved, tapered flower tube growing from `node` along base-angle `a` (radians from
  // vertical, signed toward its side), length L, base half-width w0; bows out then curls up.
  const flower=(nx0,ny0,a,L,w0)=>{
    const u=ang=>[Math.sin(ang),-Math.cos(ang)];
    const ud=u(a), uu=u(a*0.62);                                // base dir (out) → tip dir (up), gentle curl
    const cx2=nx0+ud[0]*L*0.55, cy2=ny0+ud[1]*L*0.55;
    const ex2=cx2+uu[0]*L*0.6, ey2=cy2+uu[1]*L*0.6;
    const B=t=>[(1-t)*(1-t)*nx0+2*(1-t)*t*cx2+t*t*ex2,(1-t)*(1-t)*ny0+2*(1-t)*t*cy2+t*t*ey2];
    const Tg=t=>{let dx=2*(1-t)*(cx2-nx0)+2*t*(ex2-cx2),dy=2*(1-t)*(cy2-ny0)+2*t*(ey2-cy2);const M=Math.hypot(dx,dy)||1;return[dx/M,dy/M];};
    const N=10,top=[],bot=[];
    for(let i=0;i<=N;i++){const t=i/N,p=B(t),tg=Tg(t),w=w0*Math.pow(1-t,0.82);  // slim curved-tube belly → clean point
      top.push([p[0]-tg[1]*w,p[1]+tg[0]*w]);bot.unshift([p[0]+tg[1]*w,p[1]-tg[0]*w]);}
    return `<path d="M${top.concat(bot).map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L')} Z"/>`;
  };
  for(const [slean,sh,sdir] of stalks){
    const sl=slean+(r()-0.5)*0.05, sH=h*sh, sw=Math.max(2.0,h*0.017);
    const tipx=x+sl*sH*0.6, tipy=baseY-sH, mx=x+sl*sH*0.32, my=baseY-sH*0.55;
    g+=`<path d="M${(x-sw).toFixed(1)},${baseY} Q${(mx-sw).toFixed(1)},${my.toFixed(1)} ${(tipx-sw*0.6).toFixed(1)},${tipy.toFixed(1)} Q${(mx+sw).toFixed(1)},${my.toFixed(1)} ${(x+sw).toFixed(1)},${baseY} Z"/>`;
    const at=tt=>[x+sl*sH*0.6*tt, baseY-sH*tt];                 // a point on the stalk centreline
    // a few clusters up the upper half, alternating side; fuller & longer low, sparser high
    const nc=6;
    for(let c=0;c<nc;c++){
      const tt=0.45+c*0.085, node=at(tt), side=(c%2?1:-1)*sdir;
      const taper=0.55+0.45*(1-(tt-0.45)/0.46);                 // size falls off up the stalk
      const nPet=Math.max(2,Math.round(1.4+taper*1.6));         // ~3 flowers low → ~2 high
      const cl=h*0.12*taper, w0=Math.max(2.0,h*0.025)*taper;
      for(let j=0;j<nPet;j++){
        const frac=nPet>1?j/(nPet-1):0.5;
        const a=side*(0.10+0.34*frac);                          // tight upright fan: inner ~6° → outer ~25°
        g+=flower(node[0],node[1],a,cl*(0.82+0.30*frac)*(0.9+r()*0.2),w0);
      }
    }
    // terminal bud: a slim pointed spire of two near-vertical buds at the very tip
    const tip=at(0.95), tb=h*0.09;
    for(const a of [-0.09,0.09]) g+=flower(tip[0],tip[1],a,tb*(0.92+r()*0.16),Math.max(1.7,h*0.018));
  }
  return g+`</g>`;
}

/* ---------- toetoe / plume grass — tussock + arching stems with fluffy nodding plumes ----------
   A low fan of arching blades, from which tall stems rise and arch over, each topped
   by a plump, soft, drooping feather plume (dense fine barbs swept to a nodding tip). */
function plumePath(len,w,dir=1,bend=0.3){
  // a soft, LOP-SIDED drooping foxtail: a slim curved core spindle + many fine back-swept
  // hairs that favour one side (`dir`), the whole spindle arcing gently toward that side so
  // the plume reads as a one-sided, nodding feather (real toetoe plume).
  const env=t=>Math.pow(Math.sin(Math.min(1,t*1.0)*Math.PI),0.62);  // fat belly, finer nodding tip
  const spine=t=>[t*len, dir*bend*len*Math.pow(t,1.7)];             // arcs to the `dir` side toward the tip
  const seg=30; const s0=spine(0); let d=`M${s0[0].toFixed(1)},${s0[1].toFixed(1)} `;
  // thin solid core spine so hairs all stay connected to one strand
  for(let i=0;i<=seg;i++){const t=i/seg,p=spine(t);d+=`L${p[0].toFixed(1)},${(p[1]-env(t)*w*0.10-0.5).toFixed(1)} `;}
  for(let i=seg;i>=0;i--){const t=i/seg,p=spine(t);d+=`L${p[0].toFixed(1)},${(p[1]+env(t)*w*0.10+0.5).toFixed(1)} `;}
  d+='Z ';
  // many fine back-swept hairs, dense + jittered; long on the favoured side, stubby on the other
  const hairs=140;
  for(let i=1;i<=hairs;i++){const t=i/hairs,p=spine(t),e=env(t);
    for(const side of[1,-1]){
      const favoured=(side===dir);
      const jit=0.7+0.6*((i*13)%7)/7;                // strong length jitter -> fuzzy edge
      const hl=e*w*jit*(favoured?1.22:0.26);         // long one side, short the other -> one-sided
      const fwd=0.42+0.22*((i*5)%3)/3;               // hairs slant FORWARD, up the stem toward the tip
      const ex=p[0]+hl*fwd, ey=p[1]+side*hl*0.9;      // hair tip: up the stem & out (slanted upward)
      const cx2=p[0]+hl*fwd*0.4, cy2=p[1]+side*hl*0.5;
      const hw=0.7;                                    // very fine hair
      d+=`M${(p[0]-hw).toFixed(1)},${p[1].toFixed(1)} Q${cx2.toFixed(1)},${cy2.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)} Q${(cx2+hw).toFixed(1)},${cy2.toFixed(1)} ${(p[0]+hw).toFixed(1)},${p[1].toFixed(1)} Z `;}}
  return d;
}
function toetoe(x,baseY,h,fill,seed){
  const r=rng(seed);let g=`<g fill="${fill}">`;
  // basal tussock — a big wide arching clump of blades (a proper bush under the plumes),
  // their feet spread across a clump (not one point) and tips splayed well out to the sides
  const nb=48, clumpW=h*0.22;
  for(let i=0;i<nb;i++){const t=(i/(nb-1))-0.5;const at=Math.abs(t);
    const bx=x+t*clumpW+(r()-0.5)*clumpW*0.24;
    const lean=t*2.8+(r()-0.5)*0.45;
    const bl=h*(0.2+r()*0.16);                              // short blades
    const peak=baseY-bl*(1.0-at*0.52);                      // outer blades peak lower → rounded mound
    const tx=bx+lean*bl*1.35;                               // tip swings out
    const ty=peak+(0.12+at*1.05)*bl+r()*bl*0.16;           // tips droop down more (droopy cascade)
    const bw=2.2;const mx=bx+lean*bl*0.55, my=peak-bl*0.04; // control near the peak → blade arches over
    g+=`<path d="M${(bx-bw).toFixed(1)},${baseY} Q${(mx-bw).toFixed(1)},${my.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)} Q${(mx+bw).toFixed(1)},${my.toFixed(1)} ${(bx+bw).toFixed(1)},${baseY} Z"/>`;}
  // tall stems rising from a SPREAD-OUT base (a wide tussock, not one point) into a broad
  // upright fountain of many distinct smaller plumes — staggered heights, gentle outward
  // lean, tips nodding only a little, so they read as a dense clump not two big masses.
  const ns=7, baseW=h*0.085;
  const order=[3,0,5,1,6,2,4];                       // break L->R symmetry in draw order
  for(let j=0;j<ns;j++){const i=order[j];const t=(i/(ns-1))-0.5;   // t in [-0.5,0.5]
    const bx=x+t*baseW+(r()-0.5)*baseW*0.10;          // stems rise from a tight central cluster
    const lean=t*0.6+(r()-0.5)*0.10;                  // fan the plumes out wider so they overlap less
    const stemH=h*(0.52+r()*0.5);                     // strongly staggered heights -> plumes sit apart
    const tipx=bx+lean*stemH*0.6, tipy=baseY-stemH;
    const cmx=bx+lean*stemH*0.28, cmy=baseY-stemH*0.6;// arch control
    g+=`<path d="M${(bx-1.2).toFixed(1)},${baseY} Q${(cmx-1.0).toFixed(1)},${cmy.toFixed(1)} ${(tipx-0.8).toFixed(1)},${tipy.toFixed(1)} L${(tipx+0.8).toFixed(1)},${tipy.toFixed(1)} Q${(cmx+1.0).toFixed(1)},${cmy.toFixed(1)} ${(bx+1.2).toFixed(1)},${baseY} Z"/>`;
    // smaller fluffy plume, mostly upright, tip nodding gently outward
    const pl=h*(0.16+r()*0.08), pw=pl*0.4;
    const stemAng=Math.atan2(tipy-cmy,tipx-cmx)*180/Math.PI;  // stem heading at the tip
    const leanSign=t>=0?1:-1;
    const nod=stemAng+ leanSign*(8+Math.abs(t)*22) + leanSign*r()*8;  // outer nod a bit more
    g+=`<path d="${plumePath(pl,pw,leanSign,0.42)}" transform="translate(${tipx.toFixed(1)},${tipy.toFixed(1)}) rotate(${nod.toFixed(1)})"/>`;}
  return g+`</g>`;
}

/* ---------- grass / reed tuft ---------- */
function grass(x,baseY,w,h,n,fill,seed){
  const r=rng(seed);let g=`<g fill="${fill}">`;
  for(let i=0;i<n;i++){
    const t=(i+0.5)/n, off=(t-0.5)*2;                         // -1..1 across the tuft
    // bases spread across the full width, packed a little tighter toward the shared root
    const bx=x+Math.sign(off)*Math.pow(Math.abs(off),1.15)*w*0.5+(r()-0.5)*w*0.04;
    // mound profile: blades are tall in the middle and taper shorter at the sides
    const env=1-Math.pow(Math.abs(off),1.7)*0.82;
    const bh=h*env*(0.78+r()*0.3);
    // blades splay outward from the centre, with a good dose of random tilt for a wild tuft
    const lean=off*0.2+(r()-0.5)*0.34;
    // mostly a gentle S, but ~1 in 3 blades takes a stronger bend here and there
    const bend=r()<0.34?(r()-0.5)*0.55:0;
    const curve=lean*0.5+(r()-0.5)*0.14+bend;
    const tipx=bx+lean*bh, tipy=baseY-bh;
    const bw=2.1+r()*1.3;                                      // bolder, cuttable base; wide enough to fill gaps
    const mx=bx+curve*bh, my=baseY-bh*0.5;
    g+=`<path d="M${(bx-bw).toFixed(1)},${baseY} Q${(mx-bw*0.35).toFixed(1)},${my.toFixed(1)} ${tipx.toFixed(1)},${tipy.toFixed(1)} Q${(mx+bw*0.35).toFixed(1)},${my.toFixed(1)} ${(bx+bw).toFixed(1)},${baseY} Z"/>`;
  }
  return g+`</g>`;
}

/* ---------- kiwi focal silhouette ----------
   A plump pear body, highest at the rounded rump, tapering to a small head that
   flows into one long, fine, gently down-curved bill; two short stout legs. Drawn
   as one connected paper-cut (body+bill merged, legs joined to the belly). */
function kiwi(cx,cy,s,fill){
  const P=(x,y)=>`${(cx+x*s).toFixed(1)},${(cy+y*s).toFixed(1)}`;
  let g=`<g fill="${fill}">`;
  // legs (behind the body) — a sturdy shank ending in a clear three-toed foot, toes
  // splayed forward with a short claw back (kiwi.jpg). Drawn first so the body overlaps
  // the top of each shank → one connected cut.
  const leg=(lx,ty,by)=>{const w=3.4;
    // ONE connected outline: shank flowing into a three-toed foot (no free-floating toes, rule 6)
    return `<path d="M${P(lx-w,ty)} L${P(lx+w,ty)}`+
      ` L${P(lx+w,by-1)}`+                                              // down the right shank to the ankle
      ` L${P(lx+8.5,by+6)} L${P(lx+6.5,by+6.5)} L${P(lx+2.6,by+1)}`+    // front toe — out then back to the foot
      ` L${P(lx+1.2,by+8)} L${P(lx-1.2,by+8)} L${P(lx-0.4,by+1)}`+      // middle toe — down then back
      ` L${P(lx-6.5,by+6.5)} L${P(lx-8.5,by+6)} L${P(lx-2.6,by+0.5)}`+  // back toe — out then back
      ` L${P(lx-w,by-1)} Z"/>`;};                                       // up the left shank, close
  g+=leg(-15,26,48)+leg(8,28,50);
  // body + head + bill as one smooth outline: a distinct rounded head set forward and
  // lower than the rump, joined by a slight neck notch, tapering into a long thin bill.
  g+=`<path d="M${P(-54,2)}`+
     ` C${P(-59,-28)} ${P(-50,-52)} ${P(-26,-53)}`+      // up and over the round rump (slimmer rear)
     ` C${P(2,-55)} ${P(24,-49)} ${P(38,-38)}`+          // back arcs down to the shoulders
     ` C${P(43,-33)} ${P(45,-30)} ${P(46,-27)}`+         // slope down toward the neck
     ` C${P(48,-23)} ${P(49,-25)} ${P(53,-30)}`+         // slight neck dip, then up into the head
     ` C${P(61,-35)} ${P(69,-31)} ${P(71,-22)}`+         // rounded head domes up & forward
     ` C${P(72,-19)} ${P(72,-15)} ${P(71,-12)}`+         // front of the face curving down
     ` C${P(88,-5)} ${P(107,6)} ${P(123,15)}`+           // long slender bill, gently down-curved…
     ` C${P(121,17)} ${P(104,12)} ${P(74,-3)}`+          // …to a fine point, thin underside
     ` C${P(66,-6)} ${P(60,-6)} ${P(54,-3)}`+            // chin / throat under the head
     ` C${P(47,1)} ${P(42,7)} ${P(36,15)}`+              // front of the chest curving down
     ` C${P(25,29)} ${P(0,38)} ${P(-24,37)}`+            // round full belly
     ` C${P(-44,36)} ${P(-54,24)} ${P(-54,2)} Z"/>`;     // back round up to the rump
  return g+`</g>`;
}

/* ---------- fantail / pīwakawaka — tiny body + huge cocked fanned tail ----------
   One connected paper-cut: the wide scalloped fan grows from the body's rear, the
   body carries a round head and fine bill. The fan reads far bigger than the body. */
function fantail(cx,cy,s,fill){
  const P=(x,y)=>`${(cx+x*s).toFixed(1)},${(cy+y*s).toFixed(1)}`;
  let g=`<g fill="${fill}">`;
  // the signature fan — ONE connected sheet (rule 6): a solid base wedge springing from a
  // pivot inside the body's rear, with the feather divisions cut only PART-WAY in from the
  // tips (notches stop at notchR), so it reads as splayed feathers but cuts as one piece.
  const pvx=0,pvy=3, R=33, nf=9, notchR=R*0.82;
  const a0=64*Math.PI/180, a1=160*Math.PI/180;               // steeper on the right, shallower on the left
  const PR=(ang,rr)=>P(pvx+Math.cos(ang)*rr, pvy-Math.sin(ang)*rr);
  let fan=`M${P(pvx,pvy)} `;
  for(let k=0;k<nf;k++){
    const f=k/(nf-1), ph=a0+(a1-a0)*f, rr=R*(0.8+0.2*Math.sin(f*Math.PI));   // longest mid-fan
    fan+=`L${PR(ph,rr)} `;
    if(k<nf-1){const phm=a0+(a1-a0)*((k+0.5)/(nf-1));        // notch dips only to notchR → solid base
      fan+=`L${PR(phm,notchR)} `;}
  }
  fan+=`L${P(pvx,pvy)} Z`;
  g+=`<path d="${fan}"/>`;
  // plump round body
  g+=`<ellipse cx="${(cx+4*s).toFixed(1)}" cy="${(cy+5*s).toFixed(1)}" rx="${(7.6*s).toFixed(1)}" ry="${(7.6*s).toFixed(1)}"/>`;
  // round head — small, nestled close to the body so little of it protrudes (a gentle dome)
  g+=`<circle cx="${(cx+9.2*s).toFixed(1)}" cy="${(cy+0.4*s).toFixed(1)}" r="${(3.9*s).toFixed(1)}"/>`;
  // neck mass filling the shoulder so head & body read as one smooth dome
  g+=`<path d="M${P(2.5,-2)} L${P(9,-3.4)} L${P(12,1.5)} L${P(6,6)} Z"/>`;
  // fine short bill
  g+=`<path d="M${P(12.8,-1.8)} L${P(18.4,-0.4)} L${P(12.8,0.9)} Z"/>`;
  // two slender legs gripping the perch
  g+=`<path d="M${P(0.6,11)} L${P(2.2,11)} L${P(1.8,18)} L${P(0.2,18)} Z"/>`;
  g+=`<path d="M${P(6,11)} L${P(7.6,11)} L${P(7.2,18)} L${P(5.6,18)} Z"/>`;
  return g+`</g>`;
}

