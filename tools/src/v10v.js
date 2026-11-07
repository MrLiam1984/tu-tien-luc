/* ===== v10.25 · Bản đồ châu và bản đồ thành vẽ lại theo phong cách thủy mặc ===== */
(function(){
'use strict';
const INK='#2a261f',VERM='#b3402b',PAP='#f4ecd6';
const TINT={ // [giấy, nước, mực núi, mảng màu nhạt]
 doi:['#eee5cd','#9fb6b0','#454a43','#cfd6b4'],song:['#ece6d0','#8fb0b4','#3f4a46','#c5d3bb'],dam:['#e6e2cd','#94a99b','#45493f','#bfc7a7'],
 thanh:['#f0e6d0','#a9bcb8','#4a4a44','#ddd2b4'],nui:['#e9e4cf','#9db3ab','#3c433d','#c3cfb0'],hoa:['#efdfc4','#c79a80','#4a3a32','#e2b995'],
 mo:['#e4e0d4','#9aa0ab','#3d3d40','#c9c7bf'],bang:['#eef0ec','#b4cad6','#4f5b63','#dfe8ec'],tien:['#f1ead3','#a8c2c2','#4a4d4a','#e6dcb0'],samac:['#f0e2bd','#a9b9ae','#5a4a38','#e6cf9a']};
const f1=v=>Math.round(v*10)/10;
const mixC=(c,k)=>{try{const a=hexRGB(c),b=hexRGB(INK);return `rgb(${a.map((v,i)=>Math.round(v*(1-k)+b[i]*k))})`}catch(e){return '#3a352d'}};

/* ---------- bộ lọc dùng chung cho tranh nền ---------- */
function DEFS(mt){return `<defs>
<linearGradient id="mtG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mt}" stop-opacity=".88"/><stop offset=".45" stop-color="${mt}" stop-opacity=".42"/><stop offset="1" stop-color="${mt}" stop-opacity="0"/></linearGradient>
<radialGradient id="edge" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#8a6a3a" stop-opacity="0"/><stop offset="1" stop-color="#7a5a2a" stop-opacity=".42"/></radialGradient>
<radialGradient id="lava" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e0502a" stop-opacity=".95"/><stop offset="1" stop-color="#e0502a" stop-opacity="0"/></radialGradient>
<filter id="iwBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="24"/></filter>
<filter id="iwMist" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="13"/></filter>
<filter id="iwSoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="iwRough" x="-4%" y="-4%" width="108%" height="108%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="3" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="8" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="iwBrush" x="-4%" y="-4%" width="108%" height="108%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="iwPaper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .42  0 0 0 0 .33  0 0 0 0 .2  1.5 0 0 0 -.62"/></filter>
<filter id="iwFiber" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .22" numOctaves="2" seed="2"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .25  1.2 0 0 0 -.7"/></filter>
</defs>`}

/* ---------- núi mực ---------- */
function peak(x,y,h,w,J,mt,op){
 const t=y-h,sx=x+J(-.22,.22)*w,lx=x-w,rx=x+w;
 const body=`M${f1(lx)} ${f1(y)} C${f1(lx+w*.08)} ${f1(y-h*.3)} ${f1(sx-w*.62)} ${f1(y-h*.5)} ${f1(sx-w*.3)} ${f1(y-h*.78)} Q${f1(sx-w*.16)} ${f1(t+h*.04)} ${f1(sx)} ${f1(t)} Q${f1(sx+w*.14)} ${f1(t+h*.06)} ${f1(sx+w*.28)} ${f1(y-h*.72)} C${f1(sx+w*.62)} ${f1(y-h*.48)} ${f1(rx-w*.08)} ${f1(y-h*.28)} ${f1(rx)} ${f1(y)} Z`;
 const shade=`M${f1(sx)} ${f1(t)} Q${f1(sx+w*.14)} ${f1(t+h*.06)} ${f1(sx+w*.28)} ${f1(y-h*.72)} C${f1(sx+w*.62)} ${f1(y-h*.48)} ${f1(rx-w*.08)} ${f1(y-h*.28)} ${f1(rx)} ${f1(y)} L${f1(sx+w*.1)} ${f1(y)} Q${f1(sx+w*.32)} ${f1(y-h*.45)} ${f1(sx)} ${f1(t)} Z`;
 const ridge=`M${f1(lx+w*.03)} ${f1(y-h*.12)} C${f1(lx+w*.1)} ${f1(y-h*.3)} ${f1(sx-w*.62)} ${f1(y-h*.5)} ${f1(sx-w*.3)} ${f1(y-h*.78)} Q${f1(sx-w*.16)} ${f1(t+h*.04)} ${f1(sx)} ${f1(t)} Q${f1(sx+w*.14)} ${f1(t+h*.06)} ${f1(sx+w*.28)} ${f1(y-h*.72)} C${f1(sx+w*.62)} ${f1(y-h*.48)} ${f1(rx-w*.1)} ${f1(y-h*.3)} ${f1(rx-w*.03)} ${f1(y-h*.1)}`;
 let cun='';for(let k=0;k<5;k++){const yy=y-h*J(.14,.7),xx=sx+J(-.5,.3)*w*(1-(y-yy)/h*.55);cun+=`M${f1(xx)} ${f1(yy)} q${f1(-w*.1)} ${f1(h*.09)} ${f1(-w*.04)} ${f1(h*.2)} `}
 const moss=[[-.3,.78],[-.12,.93],[.05,.97],[.2,.8]].map(([a,b])=>`<ellipse cx="${f1(sx+a*w)}" cy="${f1(y-h*b)}" rx="${f1(w*.05+1.5)}" ry="1.7" fill="${mt}" opacity=".7"/>`).join('');
 return `<g opacity="${op.toFixed(2)}"><path d="${body}" fill="url(#mtG)"/><path d="${shade}" fill="${mt}" opacity=".2"/><path d="${cun}" stroke="${mt}" stroke-width="1.1" fill="none" opacity=".32" stroke-linecap="round"/><path d="${ridge}" stroke="${mt}" stroke-width="1.7" fill="none" opacity=".6" stroke-linejoin="round" stroke-linecap="round"/>${moss}</g>`}

/* ---------- tranh nền châu: dựng một lần rồi nhúng thành ảnh để bản đồ không giật ---------- */
function decoInk(i,r,N){
 const kind=(typeof CHAU_SCENE!=='undefined'&&CHAU_SCENE[i])||'doi';const [pap,wat,mt,wash]=TINT[kind]||TINT.doi;const J=(a,b)=>a+(b-a)*r();
 const avoid=(x,y)=>N.some(n=>Math.hypot(n.x-x,n.y-y)<95);
 let s=`<rect width="1600" height="1000" fill="${pap}"/><g filter="url(#iwBlur)">`;
 for(let k=0;k<22;k++)s+=`<ellipse cx="${f1(J(0,1600))}" cy="${f1(J(0,1000))}" rx="${f1(J(140,340))}" ry="${f1(J(60,150))}" fill="${wash}" opacity="${J(.3,.6).toFixed(2)}"/>`;
 s+='</g>';
 // mặt trời son
 if(kind!=='bang')s+=`<circle cx="${f1(J(1000,1300))}" cy="${f1(J(70,120))}" r="${f1(J(40,56))}" fill="#c4452e" opacity=".55" filter="url(#iwSoft)"/>`;
 // dãy núi xa
 s+='<g filter="url(#iwRough)">';
 for(let k=0;k<9;k++)s+=peak(J(0,1600),J(300,430),J(200,320),J(130,230),J,mt,J(.14,.26));
 s+='</g>';
 const mist=(y,n)=>{let m='<g filter="url(#iwMist)">';for(let k=0;k<n;k++)m+=`<ellipse cx="${f1(J(0,1600))}" cy="${f1(y+J(-40,40))}" rx="${f1(J(240,460))}" ry="${f1(J(22,44))}" fill="#f8f2df" opacity="${J(.55,.85).toFixed(2)}"/>`;return m+'</g>'};
 s+=mist(330,5);
 // sông
 if(kind!=='samac'){const y0=J(420,560);const P=[[-20,y0],[300,y0+J(-60,60)],[620,y0+J(-90,40)],[900,y0+J(20,110)],[1250,y0+J(-80,40)],[1620,y0+J(-40,60)]];const d='M'+P.map(p=>p.map(f1).join(' ')).join(' T');const W=kind==='song'?44:28;
  const wc=kind==='hoa'?'#c98a6a':kind==='mo'?'#8a909e':wat;
  s+=`<g filter="url(#iwRough)"><path d="${d}" stroke="${INK}" stroke-width="${W+4}" fill="none" stroke-linecap="round" opacity=".38"/><path d="${d}" stroke="#f6efdb" stroke-width="${W+1}" fill="none" stroke-linecap="round" opacity=".9"/><path d="${d}" stroke="${wc}" stroke-width="${W-3}" fill="none" stroke-linecap="round" opacity=".85"/><path d="${d}" stroke="#ffffff" stroke-width="${W*.35}" fill="none" stroke-linecap="round" opacity=".38"/></g><path d="${d}" stroke="${INK}" stroke-width="1.1" fill="none" stroke-dasharray="26 46" opacity=".3" stroke-linecap="round"/><path d="${d}" stroke="#fff" stroke-width="2.5" fill="none" stroke-dasharray="2 24" opacity=".7" stroke-linecap="round"/>`}
 if(kind==='dam')for(let k=0;k<9;k++)s+=`<ellipse cx="${f1(J(200,1500))}" cy="${f1(J(250,900))}" rx="${f1(J(40,90))}" ry="${f1(J(14,30))}" fill="${wat}" opacity=".5" filter="url(#iwSoft)"/>`;
 if(kind==='samac')for(let k=0;k<16;k++){const x=J(-40,1500),y=J(120,960),l=J(160,320);s+=`<path d="M${f1(x)} ${f1(y)} q${f1(l*.35)} ${f1(-J(30,70))} ${f1(l)} ${f1(J(-6,10))} q${f1(-l*.4)} 14 ${f1(-l)} 4 z" fill="${wash}" opacity=".5"/><path d="M${f1(x)} ${f1(y)} q${f1(l*.35)} ${f1(-J(30,70))} ${f1(l)} ${f1(J(-6,10))}" stroke="${INK}" stroke-width="1.3" fill="none" opacity=".4" stroke-linecap="round"/>`}
 // núi chính
 const peaks=[];const nP=kind==='nui'?64:kind==='doi'||kind==='tien'?38:kind==='thanh'?26:kind==='samac'?12:32;
 for(let k=0;k<nP*3&&peaks.length<nP;k++){const x=J(20,1580),y=J(150,990);if(avoid(x,y))continue;peaks.push([x,y,J(46,kind==='nui'?130:92),J(24,48)])}
 for(let k=0;k<10;k++){const x=k<5?J(0,260):J(1380,1600),y=J(120,990);peaks.push([x,y,J(100,180),J(44,78)])}
 peaks.sort((a,b)=>a[1]-b[1]);
 const third=Math.ceil(peaks.length/3);
 for(let b=0;b<3;b++){s+='<g filter="url(#iwRough)">';peaks.slice(b*third,(b+1)*third).forEach(p=>{s+=peak(p[0],p[1],p[2],p[3],J,mt,.4+.55*(p[1]/1000))});s+='</g>';if(b<2)s+=mist(b?700:500,4)}
 if(kind==='hoa')s+=`<path d="M1170 270 L1260 100 L1350 270 Z" fill="#5a4034" opacity=".85" stroke="${INK}" stroke-width="2"/><ellipse cx="1260" cy="104" rx="80" ry="40" fill="url(#lava)"/><ellipse cx="1260" cy="100" rx="24" ry="7" fill="#e8532a"/><path d="M1252 88 q-18 -44 8 -76" stroke="#6a5a50" stroke-width="16" fill="none" opacity=".25" filter="url(#iwSoft)"/>`;
 // cây
 const cc=kind==='bang'?'#8a9aa0':kind==='mo'?'#4a4a4c':kind==='hoa'?'#5a4636':INK;
 const broad=(x,y,z)=>{let t=`<path d="M${f1(x)} ${f1(y)} q${f1(z*.12)} ${f1(-z*.5)} 0 ${f1(-z)}" stroke="${INK}" stroke-width="1.3" fill="none" opacity=".75"/>`;for(let k=0;k<5;k++)t+=`<ellipse cx="${f1(x+J(-.55,.55)*z)}" cy="${f1(y-z*J(.9,1.35))}" rx="${f1(z*J(.38,.6))}" ry="${f1(z*J(.2,.32))}" fill="${cc}" opacity="${J(.38,.72).toFixed(2)}"/>`;return t};
 const pine=(x,y,z)=>{let t=`<path d="M${f1(x)} ${f1(y)} v${f1(-z*1.2)}" stroke="${INK}" stroke-width="1.3" opacity=".7"/>`;for(let k=0;k<3;k++){const yy=y-z*(.35+k*.3),ww=z*(.42-k*.09);t+=`<path d="M${f1(x-ww)} ${f1(yy+z*.2)} L${f1(x)} ${f1(yy-z*.1)} L${f1(x+ww)} ${f1(yy+z*.2)}" stroke="${cc}" stroke-width="2.2" fill="none" opacity=".7" stroke-linecap="round" stroke-linejoin="round"/>`}return t};
 const bare=(x,y,z)=>`<path d="M${f1(x)} ${f1(y)} q${f1(z*.1)} ${f1(-z*.6)} ${f1(-z*.05)} ${f1(-z*1.2)} M${f1(x)} ${f1(y-z*.6)} l${f1(z*.5)} ${f1(-z*.4)} M${f1(x)} ${f1(y-z*.8)} l${f1(-z*.45)} ${f1(-z*.35)}" stroke="${cc}" stroke-width="1.5" fill="none" opacity=".7" stroke-linecap="round"/>`;
 const tf=kind==='nui'||kind==='bang'||kind==='tien'?pine:kind==='mo'||kind==='hoa'||kind==='samac'?bare:broad;
 s+='<g filter="url(#iwBrush)">';
 const nT=kind==='samac'?26:100;for(let k=0;k<nT;k++){const x=J(40,1560),y=J(110,990);if(!avoid(x,y))s+=tf(x,y,J(11,19))}
 for(let k=0;k<26;k++){const x=J(80,1520),y=J(140,980);if(!avoid(x,y))s+=`<path d="M${f1(x-14)} ${f1(y)} q4 -13 16 -13 q10 0 12 13 z" fill="${mt}" opacity=".2" stroke="${mt}" stroke-width="1" stroke-opacity=".55"/><path d="M${f1(x-6)} ${f1(y-4)} q4 -4 8 0" stroke="${mt}" stroke-width=".9" fill="none" opacity=".45"/>`}
 if(kind==='mo')for(let k=0;k<30;k++){const x=J(300,1500),y=J(200,980);if(!avoid(x,y))s+=`<path d="M${f1(x-6)} ${f1(y)} v-13 q6 -8 12 0 v13 z" fill="#8a8890" opacity=".55" stroke="${INK}" stroke-width="1" stroke-opacity=".6"/>`}
 if(kind==='thanh')for(let k=0;k<30;k++){const x=J(300,1300),y=J(250,950);if(!avoid(x,y))s+=`<circle cx="${f1(x)}" cy="${f1(y-J(10,24))}" r="${f1(J(3,6))}" fill="#c97a86" opacity=".6"/>`}
 if(kind==='dam')for(let k=0;k<40;k++){const x=J(120,1480),y=J(220,980);if(!avoid(x,y))s+=`<path d="M${f1(x)} ${f1(y)} l-3 -16 M${f1(x)} ${f1(y)} l1 -19 M${f1(x)} ${f1(y)} l4 -14" stroke="${INK}" stroke-width="1.3" opacity=".5" stroke-linecap="round"/>`}
 if(kind==='bang')for(let k=0;k<60;k++)s+=`<circle cx="${f1(J(30,1570))}" cy="${f1(J(60,980))}" r="${f1(J(1.5,3.2))}" fill="#ffffff" opacity=".85"/>`;
 s+='</g>';
 if(kind==='tien')for(let k=0;k<9;k++){const x=J(80,1500),y=J(80,920),w=J(60,100);s+=`<g opacity=".92"><path d="M${f1(x)} ${f1(y)} a${f1(w*.28)} ${f1(w*.28)} 0 0 1 ${f1(w*.5)} ${f1(-w*.12)} a${f1(w*.22)} ${f1(w*.22)} 0 0 1 ${f1(w*.45)} ${f1(w*.1)} a${f1(w*.18)} ${f1(w*.18)} 0 0 1 ${f1(w*.1)} ${f1(w*.18)} h${f1(-w*1.05)} z" fill="#fffdf2" stroke="${INK}" stroke-width="1.2" stroke-opacity=".4"/><path d="M${f1(x+w*.25)} ${f1(y-w*.02)} a${f1(w*.1)} ${f1(w*.1)} 0 1 1 ${f1(w*.1)} ${f1(w*.1)}" stroke="${INK}" stroke-width="1" fill="none" opacity=".3"/></g>`}
 // chim
 for(let k=0;k<5;k++){const x=J(300,1300),y=J(60,260);s+=`<path d="M${f1(x)} ${f1(y)} q7 -7 14 0 q7 -7 14 0" stroke="${INK}" stroke-width="1.6" fill="none" opacity=".6" stroke-linecap="round"/>`}
 // giấy dó, ố mép, khung tranh, con dấu
 s+=`<rect width="1600" height="1000" filter="url(#iwFiber)" opacity=".35"/><rect width="1600" height="1000" filter="url(#iwPaper)" opacity=".5"/><rect width="1600" height="1000" fill="url(#edge)"/>`;
 s+=`<rect x="14" y="14" width="1572" height="972" fill="none" stroke="${INK}" stroke-width="2.4" opacity=".55"/><rect x="24" y="24" width="1552" height="952" fill="none" stroke="${INK}" stroke-width=".9" opacity=".4"/>`;
 s+=`<g transform="translate(1520 920)"><rect x="-24" y="-24" width="48" height="48" rx="3" fill="${VERM}" opacity=".88"/><path d="M-12 12 V-10 M0 12 V-16 M12 12 V-10 M-15 12 H15" stroke="#f6e7cf" stroke-width="4.2" stroke-linecap="round" fill="none"/></g>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">${DEFS(mt)}${s}</svg>`}
function cmDecoInk(i,r,N){try{const svg=decoInk(i,r,N);return `<image href="data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}" x="0" y="0" width="1600" height="1000" preserveAspectRatio="none"/>`}catch(e){console.error('v10v deco',e);return typeof _oldDeco==='function'?_oldDeco(i,r,N):''}}
const _oldDeco=window.cmDeco10;
window.cmDeco10=cmDecoInk;

/* ---------- nhà, tháp: mái cong nét mực ---------- */
function cmHouse(x,y,w,roof){
 const h=w*.34,hw=w*.64,rh=w*.36,yb=y-h,rc=mixC(roof||'#3a9c97',.6);let tl='';
 for(let k=-2;k<=2;k++)tl+=`M${f1(x+k*hw*.19)} ${f1(yb-rh*.92)} L${f1(x+k*hw*.34)} ${f1(yb+rh*.06)} `;
 return `<g><ellipse cx="${f1(x)}" cy="${f1(y+1)}" rx="${f1(w*.72)}" ry="${f1(w*.07)}" fill="${INK}" opacity=".16"/>
<rect x="${f1(x-w*.4)}" y="${f1(yb)}" width="${f1(w*.8)}" height="${f1(h)}" fill="#f3ead3" stroke="${INK}" stroke-width="1.3"/>
<rect x="${f1(x-w*.09)}" y="${f1(y-h*.64)}" width="${f1(w*.18)}" height="${f1(h*.64)}" fill="#4a392a"/>
<rect x="${f1(x-w*.33)}" y="${f1(yb+h*.22)}" width="${f1(w*.15)}" height="${f1(h*.32)}" fill="#d9c9a0" stroke="${INK}" stroke-width=".8"/><rect x="${f1(x+w*.18)}" y="${f1(yb+h*.22)}" width="${f1(w*.15)}" height="${f1(h*.32)}" fill="#d9c9a0" stroke="${INK}" stroke-width=".8"/>
<path d="M${f1(x-hw)} ${f1(yb-rh*.14)} Q${f1(x-hw*.8)} ${f1(yb+rh*.16)} ${f1(x-hw*.45)} ${f1(yb+rh*.1)} L${f1(x+hw*.45)} ${f1(yb+rh*.1)} Q${f1(x+hw*.8)} ${f1(yb+rh*.16)} ${f1(x+hw)} ${f1(yb-rh*.14)} Q${f1(x+hw*.74)} ${f1(yb-rh*.42)} ${f1(x+hw*.4)} ${f1(yb-rh)} L${f1(x-hw*.4)} ${f1(yb-rh)} Q${f1(x-hw*.74)} ${f1(yb-rh*.42)} ${f1(x-hw)} ${f1(yb-rh*.14)} Z" fill="${rc}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="${tl}" stroke="#f4ecd6" stroke-width=".9" opacity=".22" fill="none"/><path d="M${f1(x-hw*.42)} ${f1(yb-rh)} H${f1(x+hw*.42)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`}
function cmPagoda(x,y,w,n,roof){let s='',yy=y;for(let k=0;k<n;k++){const ww=w*(1-k*.17);s+=cmHouse(x,yy,ww,roof);yy-=ww*.34+ww*.3}
 return s+`<path d="M${f1(x)} ${f1(yy+w*.2)} v${f1(-w*.34)}" stroke="${INK}" stroke-width="2"/><circle cx="${f1(x)}" cy="${f1(yy-w*.17)}" r="${f1(w*.05)}" fill="${VERM}" stroke="${INK}" stroke-width=".8"/>`}
window.cmHouse=cmHouse;window.cmPagoda=cmPagoda;

/* ---------- biểu tượng các nơi ---------- */
function seal(X,Y,c,glyph,r){r=r||34;
 return `<g class="cmsw"><circle cx="${X}" cy="${Y}" r="${r+8}" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="44 8 12 8" stroke-linecap="round" opacity=".65"/></g><circle cx="${X}" cy="${Y}" r="${r}" fill="${c}" opacity=".72"/><circle cx="${X+2}" cy="${Y+2}" r="${r*.74}" fill="${c}" opacity=".5"/><circle cx="${X}" cy="${Y}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.8" opacity=".6"/><circle cx="${X}" cy="${Y}" r="${r-4}" fill="none" stroke="#f6e9cc" stroke-width="1" opacity=".6"/>${glyph}`}
const G={
 zone:(X,Y)=>`<path d="M${X-22} ${Y+14} L${X-8} ${Y-16} L${X+2} ${Y-2} L${X+10} ${Y-12} L${X+24} ${Y+14} Z" fill="${INK}" opacity=".82"/><path d="M${X-18} ${Y+18} h36" stroke="#f6e9cc" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`,
 fortune:(X,Y)=>{let p='';for(const a of [-52,0,52])p+=`<path transform="rotate(${a} ${X} ${Y+12})" d="M${X} ${Y+12} Q${X-13} ${Y-2} ${X} ${Y-20} Q${X+13} ${Y-2} ${X} ${Y+12} Z" fill="#fbf1d6" stroke="${INK}" stroke-width="1.3"/>`;return p},
 boss:(X,Y)=>`<path d="M${X-24} ${Y-4} Q${X-26} ${Y-26} ${X-10} ${Y-28} Q${X-20} ${Y-16} ${X-14} ${Y-2} Z M${X+24} ${Y-4} Q${X+26} ${Y-26} ${X+10} ${Y-28} Q${X+20} ${Y-16} ${X+14} ${Y-2} Z" fill="${INK}"/><path d="M${X-16} ${Y+20} Q${X-18} ${Y-2} ${X} ${Y-4} Q${X+18} ${Y-2} ${X+16} ${Y+20} Q${X} ${Y+12} ${X-16} ${Y+20} Z" fill="#efe3c8" stroke="${INK}" stroke-width="1.6"/><circle cx="${X-6}" cy="${Y+6}" r="3" fill="${VERM}"/><circle cx="${X+6}" cy="${Y+6}" r="3" fill="${VERM}"/>`,
 spiral:(X,Y)=>`<path d="M${X-20} ${Y} a20 20 0 1 1 20 20 a14 14 0 1 1 -14 -14 a8 8 0 1 1 8 8" fill="none" stroke="#fbf1d6" stroke-width="3.4" stroke-linecap="round"/><path d="M${X-20} ${Y} a20 20 0 1 1 20 20 a14 14 0 1 1 -14 -14 a8 8 0 1 1 8 8" fill="none" stroke="${INK}" stroke-width="1" stroke-linecap="round" opacity=".6"/>`};
const DOMC={yeuvuong:'#9b4a36',chientruong:'#6b6179',huyettri:'#9a2f35',kiemtrung:'#5f7f92',duocvien:'#5f8a5a',thapco:'#7a6d96',maicung:'#4d7f93',longmach:'#a06a35'};
function domGlyph(d,X,Y){const L='#f6e9cc';
 switch(d){
  case 'yeuvuong':return `<path d="M${X-28} ${Y+20} v-28 h9 v-9 h9 v9 h6 v-13 h8 v13 h6 v-9 h9 v9 h9 v28 z" fill="#efe3c8" stroke="${INK}" stroke-width="1.6"/><path d="M${X-8} ${Y+20} v-12 a8 8 0 0 1 16 0 v12 z" fill="${INK}"/><path d="M${X-32} ${Y-22} l9 -15 l6 11 M${X+32} ${Y-22} l-9 -15 l-6 11" stroke="${INK}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  case 'chientruong':return `<path d="M${X-22} ${Y+22} L${X-12} ${Y-28} M${X+22} ${Y+22} L${X+12} ${Y-28} M${X-28} ${Y-4} L${X+28} ${Y-4}" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M${X-12} ${Y-28} l22 6 l-22 10 z" fill="${VERM}" stroke="${INK}" stroke-width="1.3"/>`;
  case 'huyettri':return `<ellipse cx="${X}" cy="${Y+8}" rx="28" ry="12" fill="#c4282f" stroke="${INK}" stroke-width="1.6"/><path d="M${X-12} ${Y+2} q4 -14 0 -26 M${X+8} ${Y+4} q-4 -12 2 -22" stroke="${L}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>`;
  case 'kiemtrung':return [-22,-7,8,23].map((d2,k)=>`<path d="M${X+d2} ${Y+22} V${Y-24+k%2*8}" stroke="${L}" stroke-width="5" stroke-linecap="round"/><path d="M${X+d2} ${Y+22} V${Y-24+k%2*8}" stroke="${INK}" stroke-width="1.2" opacity=".6"/><path d="M${X+d2-6} ${Y+4} h12" stroke="${INK}" stroke-width="2.6"/>`).join('');
  case 'duocvien':return `<path d="M${X} ${Y+24} V${Y-6} M${X} ${Y+6} q-22 -4 -26 -22 q20 -2 26 22 M${X} ${Y+2} q22 -4 24 -24 q-22 0 -24 24" stroke="${INK}" stroke-width="1.6" fill="#a8c98a"/><circle cx="${X}" cy="${Y-16}" r="6" fill="#e6b84a" stroke="${INK}" stroke-width="1.4"/>`;
  case 'thapco':return [0,1,2].map(k=>{const w=42-k*10,y=Y+22-k*15;return `<path d="M${X-w/2} ${y} h${w} v-11 h${-w} z" fill="#efe3c8" stroke="${INK}" stroke-width="1.5"/><path d="M${X-w/2-6} ${y-11} q${w/2+6} -9 ${w+12} 0" stroke="${VERM}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`}).join('');
  case 'maicung':return `<ellipse cx="${X}" cy="${Y-2}" rx="17" ry="25" fill="#dcecef" stroke="${INK}" stroke-width="2"/><path d="M${X-8} ${Y-14} l8 -8 M${X-10} ${Y+2} l16 -14" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M${X-24} ${Y+26} h48" stroke="${INK}" stroke-width="3"/>`;
  default:return `<path d="M${X-28} ${Y+22} L${X-10} ${Y-8} L${X} ${Y+4} L${X+12} ${Y-18} L${X+28} ${Y+22} z" fill="#6b5640" stroke="${INK}" stroke-width="1.6"/><path d="M${X-6} ${Y-14} q-6 -12 2 -22 q4 8 10 4 q2 12 -6 18" fill="#e8532a" stroke="${INK}" stroke-width="1.2"/>`}}
function cmIcon(x){const X=x.x,Y=x.y,teal='#3a9c97';
 if(x.dom)return seal(X,Y,DOMC[x.dom]||'#8a5a2a',domGlyph(x.dom,X,Y),44);
 if(x.lv){const L={thon:[[-26,8,34],[18,0,30]],tran:[[-34,10,36],[10,-4,34],[40,14,28]],huyen:[[-44,14,38],[0,-6,40],[44,12,34]],thanh:[[-56,16,40],[0,-10,46],[56,14,40]],dedo:[[-60,18,42],[0,-12,50],[60,16,42]]}[x.lv]||[[0,0,34]];
  let s='';if(['huyen','thanh','dedo'].includes(x.lv))s+=`<path d="M${X-92} ${Y+24} L${X-82} ${Y-38} L${X+82} ${Y-38} L${X+94} ${Y+24} Z" fill="#e3d6b2" opacity=".85" stroke="${INK}" stroke-width="1.6"/><path d="M${X-82} ${Y-38} H${X+82}" stroke="${INK}" stroke-width="6" stroke-dasharray="7 6" opacity=".7"/>`;
  L.forEach(([dx,dy,w])=>s+=cmHouse(X+dx,Y+dy+16,w,teal));if(['thanh','dedo'].includes(x.lv))s+=cmPagoda(X,Y-18,44,3,x.lv==='dedo'?'#c99a2e':'#8a5a3a');if(x.lv==='tran')s+=`<circle cx="${X+52}" cy="${Y-18}" r="6" fill="${VERM}" stroke="${INK}"/>`;return `<g transform="translate(${X} ${Y}) scale(1.3) translate(${-X} ${-Y})">${s}</g>`}
 if(x.k==='tong')return `<ellipse cx="${X}" cy="${Y+22}" rx="70" ry="12" fill="#f8f2df" opacity=".7"/><path d="M${X-62} ${Y+22} C${X-42} ${Y-40} ${X-15} ${Y-72} ${X} ${Y-72} C${X+20} ${Y-72} ${X+45} ${Y-40} ${X+66} ${Y+22} Z" fill="#7b8579" opacity=".85" stroke="${INK}" stroke-width="1.8"/><path d="M${X} ${Y-72} C${X+20} ${Y-72} ${X+45} ${Y-40} ${X+66} ${Y+22} L${X+20} ${Y+22} Z" fill="${INK}" opacity=".18"/>`+cmPagoda(X+2,Y-18,34,3,teal)+`<path d="M${X-34} ${Y+22} v-26 M${X-44} ${Y-4} h20 M${X+30} ${Y+22} v-26 M${X+20} ${Y-4} h20" stroke="${VERM}" stroke-width="4" stroke-linecap="round"/>`;
 if(x.k==='gate')return `<path d="M${X-30} ${Y+22} v-48 M${X+30} ${Y+22} v-48" stroke="${VERM}" stroke-width="7" stroke-linecap="round"/><path d="M${X-46} ${Y-28} Q${X-30} ${Y-44} ${X} ${Y-40} Q${X+30} ${Y-44} ${X+46} ${Y-28} Q${X+36} ${Y-22} ${X} ${Y-22} Q${X-36} ${Y-22} ${X-46} ${Y-28} Z" fill="#3a352d" stroke="${INK}" stroke-width="1.6"/><path d="M${X-34} ${Y-8} h68" stroke="${VERM}" stroke-width="5" stroke-linecap="round"/>`;
 if(x.k==='quest')return `<path d="M${X} ${Y+24} v-56" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M${X} ${Y-32} q18 -6 36 4 q-8 6 -4 10 q-18 -4 -32 4 z" fill="${VERM}" stroke="${INK}" stroke-width="1.4"/><ellipse cx="${X}" cy="${Y+20}" rx="16" ry="5" fill="${INK}" opacity=".2"/>`;
 if(x.k==='zone')return seal(X,Y,'#7f9aa3',G.zone(X,Y));
 if(x.k==='fortune')return seal(X,Y,'#c9a24a',G.fortune(X,Y));
 if(x.k==='boss')return seal(X,Y,'#5d4a78',G.boss(X,Y));
 if(x.k==='secret')return seal(X,Y,'#4f9a92',G.spiral(X,Y));
 if(x.k==='portal')return seal(X,Y,'#5b6fa0',G.spiral(X,Y));
 if(x.k==='cave')return `<ellipse cx="${X}" cy="${Y+22}" rx="52" ry="9" fill="${INK}" opacity=".16"/><path d="M${X-42} ${Y+22} Q${X-38} ${Y-38} ${X} ${Y-42} Q${X+38} ${Y-38} ${X+42} ${Y+22} Z" fill="#8a8072" opacity=".9" stroke="${INK}" stroke-width="1.8"/><path d="M${X-14} ${Y+22} Q${X-12} ${Y-8} ${X} ${Y-10} Q${X+12} ${Y-8} ${X+14} ${Y+22} Z" fill="${INK}"/>`;
 return `<circle cx="${X}" cy="${Y}" r="20" fill="#f6eed8" stroke="${INK}" stroke-width="1.8"/><circle cx="${X}" cy="${Y}" r="11" fill="${VERM}" opacity=".8"/>`}
window.cmIcon=cmIcon;

function cmBanner(x,y,name,sel,dim){const lines=String(name).split(/\s+/).filter(Boolean),lh=21,h=lines.length*lh+22,w=Math.max(36,Math.max(...lines.map(l=>l.length))*10.6+16);
 return `<g class="cmb${sel?' sel':''}${dim?' dim':''}" transform="translate(${x} ${y})"><path d="M3 4 h${w} v${h-8} l${-w/2} 11 l${-w/2} -11 Z" fill="${INK}" opacity=".16"/><path class="cmbg" d="M0 0 h${w} v${h-10} l${-w/2} 10 l${-w/2} -10 Z" fill="${sel?'#f7e1bd':PAP}" stroke="${sel?VERM:INK}" stroke-width="${sel?2.4:1.3}"/><rect width="${w}" height="5" fill="${VERM}"/><text class="cmbt" x="${w/2}" y="25" text-anchor="middle">${lines.map((l,i)=>`<tspan x="${w/2}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('')}</text></g>`}
window.cmBanner=cmBanner;

/* ---------- bản đồ châu ---------- */
function cmSvg(){const L=cmLayout(S.loc),N=cmNodes(),P=cmPos();const me=cmMe(N,P);
 let s=`<svg viewBox="0 0 ${CMW} ${CMH}" class="cmsvg ink" role="img" aria-label="Bản đồ ${esc(here().n)}" onclick="if(event.target.closest('.cmn')==null){CM.sel=null;cmCard()}"><g>${L.deco}</g>`;
 const T=N.filter(x=>x.lv),road=[N.find(x=>x.id==='gate'),...T];let d='';for(let k=1;k<road.length;k++){const a=road[k-1],b=road[k];if(!a||!b)continue;d+=`M${a.x} ${a.y} Q${(a.x+b.x)/2} ${(a.y+b.y)/2+40} ${b.x} ${b.y} `}
 const hub=T[T.length-1]||N[0];for(const x of N)if(!x.lv&&x.id!=='gate'){const a=x.k==='tong'?(T[0]||hub):hub;d+=`M${a.x} ${a.y} Q${(a.x+x.x)/2+30} ${(a.y+x.y)/2+30} ${x.x} ${x.y} `}
 s+=`<path d="${d}" stroke="#d8c79c" stroke-width="12" stroke-linecap="round" fill="none" opacity=".5"/><path d="${d}" stroke="#4a3f2c" stroke-width="2.4" stroke-dasharray="7 8" stroke-linecap="round" fill="none" opacity=".62"/><path d="${d}" stroke="#4a3f2c" stroke-width="1" stroke-dasharray="2 17" stroke-dashoffset="6" stroke-linecap="round" fill="none" opacity=".4"/>`;
 const bs=(S.bossSpawn||{})[S.loc],n=nowM();const bossOn=bs&&n>=bs.from&&n<=bs.until&&!bs.dead;
 for(const x of N){const sel=CM.sel===x.id;const dim=(x.k==='boss'&&!bossOn)||x.soon;
  s+=`<g class="cmn${sel?' sel':''}${dim?' dim':''}${x.k==='boss'&&bossOn?' on':''}" onclick="event.stopPropagation();cmSelect('${x.id}')" style="cursor:pointer"><ellipse cx="${x.x}" cy="${x.y+26}" rx="70" ry="14" fill="${INK}" opacity=".08"/>${cmIcon(x)}${cmBanner(x.x+(x.lv&&['thanh','dedo','huyen'].includes(x.lv)?92:52),x.y-62,x.n,sel,dim)}${x.k==='fortune'&&!x.soon?`<circle cx="${x.x}" cy="${x.y}" r="50" fill="none" stroke="#c9a24a" stroke-width="3" class="mpulse"/>`:''}${x.k==='boss'&&bossOn?`<circle cx="${x.x}" cy="${x.y}" r="52" fill="none" stroke="${VERM}" stroke-width="4" class="mpulse"/>`:''}${sel?`<circle cx="${x.x}" cy="${x.y}" r="${x.lv?70:56}" fill="none" stroke="${VERM}" stroke-width="2" stroke-dasharray="3 7" opacity=".8"/>`:''}</g>`}
 s+=`<g id="cmTok" style="transform:translate(${me.x}px,${me.y-10}px)"><ellipse cx="0" cy="22" rx="30" ry="7" fill="${INK}" opacity=".25"/><path d="M-36 12 h72 l-4 13 h-64 z" fill="${PAP}" stroke="${INK}" stroke-width="1.4"/><circle cx="-26" cy="18.5" r="3" fill="${VERM}"/><image class="cmme" href="${myPortrait()}" x="-48" y="-82" width="96" height="96"/></g>`;
 return s+'</svg>'}
window.cmSvg=cmSvg;

/* ---------- bản đồ thành trấn ---------- */
function twDeco(lv,nm){const r=mkRng(hashStr('town'+nm));const J=(a,b)=>a+(b-a)*r();const big=['huyen','thanh','dedo'].includes(lv);const [pap,wat,mt,wash]=TINT.doi;
 let s=`<rect width="1600" height="1000" fill="${pap}"/><g filter="url(#iwBlur)">`;for(let k=0;k<16;k++)s+=`<ellipse cx="${f1(J(0,1600))}" cy="${f1(J(0,1000))}" rx="${f1(J(160,340))}" ry="${f1(J(60,150))}" fill="${wash}" opacity="${J(.3,.6).toFixed(2)}"/>`;s+='</g><g filter="url(#iwRough)">';
 for(let k=0;k<9;k++)s+=peak(J(0,1600),J(170,300),J(110,230),J(110,210),J,mt,J(.3,.55));s+='</g>';
 s+=`<g filter="url(#iwMist)"><ellipse cx="400" cy="270" rx="420" ry="30" fill="#f8f2df" opacity=".8"/><ellipse cx="1200" cy="250" rx="420" ry="26" fill="#f8f2df" opacity=".8"/></g>`;
 const rv='M-20 262 Q400 205 800 258 T1620 240';
 s+=`<g filter="url(#iwRough)"><path d="${rv}" stroke="${INK}" stroke-width="52" fill="none" opacity=".34"/><path d="${rv}" stroke="#f6efdb" stroke-width="49" fill="none"/><path d="${rv}" stroke="${wat}" stroke-width="42" fill="none" opacity=".85"/><path d="${rv}" stroke="#fff" stroke-width="14" fill="none" opacity=".35"/></g><path d="${rv}" stroke="#fff" stroke-width="2.5" stroke-dasharray="2 26" fill="none" opacity=".7" stroke-linecap="round"/>`;
 s+=`<g filter="url(#iwBrush)"><path d="M120 300 L1480 300 L1580 960 L20 960 Z" fill="#ece0c0" opacity=".95" stroke="${INK}" stroke-width="3"/></g>`;
 for(let k=0;k<70;k++){const x=J(40,1560),y=J(320,950);s+=`<path d="M${f1(x)} ${f1(y)} h${f1(J(14,34))}" stroke="${INK}" stroke-width="1" opacity=".13" stroke-linecap="round"/>`}
 if(big){s+=`<path d="M120 300 L1480 300" stroke="#b9a37a" stroke-width="20" opacity=".9"/>`;for(let x=130;x<1480;x+=34)s+=`<rect x="${x}" y="280" width="18" height="14" fill="#cbb58c" stroke="${INK}" stroke-width="1"/>`}
 s+=`<path d="M800 300 L800 960 M120 620 L1520 620" stroke="#d8c79c" stroke-width="70" opacity=".75"/><path d="M800 300 L800 960 M120 620 L1520 620" stroke="${INK}" stroke-width="1.3" stroke-dasharray="4 14" opacity=".4"/>`;
 s+=`<rect width="1600" height="1000" filter="url(#iwFiber)" opacity=".3"/><rect width="1600" height="1000" filter="url(#iwPaper)" opacity=".45"/><rect width="1600" height="1000" fill="url(#edge)"/><rect x="14" y="14" width="1572" height="972" fill="none" stroke="${INK}" stroke-width="2.4" opacity=".55"/><rect x="24" y="24" width="1552" height="952" fill="none" stroke="${INK}" stroke-width=".9" opacity=".4"/>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">${DEFS(mt)}${s}</svg>`}
function twScroll(x,y,name){const W=String(name).split(/\s+/);const h=W.length*30+26;return `<g transform="translate(${x} ${y})"><path d="M-23 3 h46 v${h} h-46 z" fill="${INK}" opacity=".15"/><path d="M-22 0 h44 v${h} h-44 z" fill="${PAP}" stroke="${INK}" stroke-width="1.3"/><rect x="-22" y="0" width="44" height="5" fill="${VERM}"/><path d="M-27 -3 h54 M-27 ${h+3} h54" stroke="#5b4630" stroke-width="6" stroke-linecap="round"/><text x="0" y="28" text-anchor="middle" class="twt">${W.map((w,i)=>`<tspan x="0" dy="${i?30:0}">${esc(w)}</tspan>`).join('')}</text></g>`}
window.twScroll=twScroll;
function townSvg(lv,nm){const keys=TOWN_SET[lv]||TOWN_SET.tran;const r=mkRng(hashStr('town'+nm));const J=(a,b)=>a+(b-a)*r();
 const teal=lv==='dedo'?'#c99a2e':'#3a9c97';
 let bg='';try{bg=`<image href="data:image/svg+xml;charset=utf-8,${encodeURIComponent(twDeco(lv,nm))}" x="0" y="0" width="1600" height="1000" preserveAspectRatio="none"/>`}catch(e){console.error(e)}
 let s=`<svg viewBox="0 0 1600 1000" class="twsvg ink">${bg}`;
 const slots=[[400,540],[1180,540],[590,890],[1030,890],[250,880],[1360,880],[560,420],[1040,420],[230,560],[1380,580],[800,400],[820,980],[420,740],[1190,740],[620,560],[990,560]];
 const B=keys.slice(0,slots.length).map((k,i)=>({k,x:slots[i][0]+J(-15,15),y:slots[i][1]+J(-10,10)})).sort((a,b)=>a.y-b.y);
 for(const b of B){const T=TOWN_B[b.k];const w=b.k==='dau'||b.k==='nha'?190:170;
  s+=`<g class="twb" onclick="townGo('${b.k}')">${b.k==='dau'?cmPagoda(b.x,b.y,w*.82,3,teal):b.k==='cho'?cmHouse(b.x-60,b.y,120,'#c4703a')+cmHouse(b.x+70,b.y+12,104,'#c4703a'):b.k==='nguoi'?`<ellipse cx="${b.x}" cy="${b.y-10}" rx="90" ry="34" fill="#e0d2ac" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${b.x}" cy="${b.y-10}" rx="60" ry="22" fill="none" stroke="${INK}" stroke-width="1" opacity=".4"/><circle cx="${b.x}" cy="${b.y-14}" r="15" fill="#9fb6b0" stroke="${INK}" stroke-width="1.4"/>`:b.k==='bang'?`<rect x="${b.x-44}" y="${b.y-90}" width="88" height="62" fill="#c9a76a" stroke="${INK}" stroke-width="1.6"/><rect x="${b.x-34}" y="${b.y-82}" width="30" height="40" fill="#f6eed8"/><rect x="${b.x+4}" y="${b.y-82}" width="30" height="34" fill="#f6eed8"/><path d="M${b.x-38} ${b.y-28} v28 M${b.x+38} ${b.y-28} v28" stroke="${INK}" stroke-width="5"/>`:cmHouse(b.x,b.y,w,b.k==='lo'?'#7a5bb0':b.k==='ren'?'#8a4a33':teal)}
  ${b.k==='lo'?`<path d="M${b.x+30} ${b.y-90} q-8 -20 6 -36" stroke="#8a8478" stroke-width="7" fill="none" opacity=".5" class="twsmoke"/>`:''}${b.k==='ren'?`<circle cx="${b.x-20}" cy="${b.y-30}" r="5" fill="#e8742a" class="twspark"/>`:''}
  ${twScroll(b.x+(w/2)+30,b.y-w*.95-40,T.n)}</g>`}
 const N=S.npcs.filter(n=>n.alive&&n.loc===S.loc).slice(0,4);N.forEach((n,i)=>{const x=[700,900,560,1040][i],y=[640,600,660,610][i];s+=`<image class="twnpc" href="${spritePerson(n.name,n.g,n.sect,n.evil&&n.fav<0)}" x="${x-55}" y="${y-110}" width="110" height="110" onclick="openNPC('${n.id}')"/>`});
 s+=`<image class="twme" href="${myPortrait()}" x="730" y="780" width="140" height="140"/>`;return s+'</svg>'}
window.townSvg=townSvg;

/* ---------- CSS ---------- */
const css=`
#cmap{background:radial-gradient(ellipse at 50% 38%,#4b3a27,#231910)}
.cmboard10{border-radius:3px!important;box-shadow:0 0 0 2px #1f160d,0 0 0 9px #d3c196,0 0 0 11px #1f160d,0 18px 44px rgba(0,0,0,.55)!important}
.twboard{border-radius:3px!important;box-shadow:0 0 0 2px #1f160d,0 0 0 9px #d3c196,0 0 0 11px #1f160d,0 18px 44px rgba(0,0,0,.55)!important}
.cmsvg .cmb .cmbt,.twsvg .twt{fill:#2a261f!important;font:700 16.5px 'Noto Serif',serif}
.twsvg .twt{font-size:21px}
.cmsvg .cmb text{fill:#2a261f}
.cmn:hover .cmbg{fill:#f9ecd0}.cmn.sel .cmbg{fill:#f7e1bd}
.cmsvg .cmn:hover circle{stroke:#2a261f}
.cmsvg .cmn.dim>*:not(.cmb){opacity:.5}
#cmcard{background:#f6eed8!important;border:1px solid #2a261f!important;border-radius:3px!important;box-shadow:0 0 0 3px #f6eed8,0 0 0 4px #8a7650,0 12px 28px rgba(0,0,0,.45)!important;font-family:'Noto Serif','Be Vietnam Pro',serif}
#cmcard::before{content:'';position:absolute;right:10px;top:-7px;width:16px;height:16px;background:#b3402b;border-radius:2px;box-shadow:0 1px 3px rgba(0,0,0,.4)}
#cmcard .cmhead b{font-family:'Noto Serif',serif;letter-spacing:.02em}
#cmcard .cmhead img,#cmcard img{filter:grayscale(.55) sepia(.42) contrast(1.06) brightness(1.04);mix-blend-mode:multiply;image-rendering:auto!important;border-radius:2px}
#cmcard .primary{background:#7c2f1f!important;color:#f6e9cc!important;border:1px solid #2a261f!important;border-radius:3px!important}
.cmgo{background:radial-gradient(circle at 40% 35%,#c9573b,#8a2c1c 72%)!important;border:3px solid #2a261f!important;color:#f8ecd2!important;box-shadow:0 4px 0 #3a120a,0 0 0 4px rgba(179,64,43,.22)!important}
.twbody .twlist .mini{background:#f6eed8;color:#2a261f;border:1px solid #2a261f;border-radius:3px}
.twb:hover{filter:brightness(1.08) drop-shadow(0 0 6px #b3402b)!important}`;
if(!document.getElementById('v10vcss')){const st=document.createElement('style');st.id='v10vcss';st.textContent=css;document.head.appendChild(st)}
try{PATCH_NOTES.unshift(['v10.25 · 08/11/2026 · Bản đồ vẽ lại theo phong cách thủy mặc',[
 '<b>Bản đồ châu</b>: nền giấy dó ố mép, núi mực nhòe theo lớp có sương mù chen giữa, sông nhạt viền mực, cây chấm mực (thông, tre, cây trụi tùy vùng), mặt trời son, chim bay, khung tranh và con dấu đỏ.',
 '<b>Địa danh</b>: nhà mái cong nét mực, tháp nhiều tầng, tông môn ẩn trong núi, cổng son; cõi hoang dã, cơ duyên, hang yêu vương, tám cõi ở góc đều thành ấn mực tròn thay cho nút màu cũ. Nhãn là phướn giấy có dải son.',
 '<b>Thẻ thông tin</b>: giấy dó, viền mực, ảnh trong thẻ phủ sắc mực. <b>Bản đồ thành trấn</b> cũng đổi cùng phong cách.']])}catch(e){}
})();
