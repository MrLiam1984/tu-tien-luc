/* ===== v10.21 · Hoạt ảnh chiêu thức: hệ × loại chiêu × tuyệt kỹ (canvas) ===== */
(function(){
'use strict';
const TAU=Math.PI*2,rn=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rn(a,b+1)),pk=a=>a[Math.floor(Math.random()*a.length)];
let TS=1,CUR=null;const gc=()=>(CUR==='Thổ'||CUR==='Ám')?'source-over':'lighter';const sleep=ms=>new Promise(r=>setTimeout(r,ms*TS));const later=(f,ms)=>setTimeout(f,ms*TS);
const ease=k=>1-Math.pow(1-k,3),easeIn=k=>k*k;
// bảng màu theo hệ: [lõi sáng, màu chính, màu tối]
const PAL={Kim:['#fffbe0','#f2d25a','#a8861c'],Mộc:['#efffd8','#76d45f','#2f7d36'],Thủy:['#eefaff','#6cc4ff','#2b64c7'],Hỏa:['#fff6b8','#ff9a2e','#d7381f'],Thổ:['#ffe2a0','#c9822f','#5e3a14'],Lôi:['#f8eeff','#b98dff','#5a34c8'],Phong:['#f2fffb','#9fe8da','#3f9d8e'],Ám:['#e4d6f2','#8a66b0','#2a1f3a']};
const P=he=>PAL[he]||PAL.Kim;
const _rc={};function rgba(h,a){const k=h+'|'+(Math.round(a*50)/50);if(_rc[k])return _rc[k];const n=parseInt(h.slice(1),16);return _rc[k]=`rgba(${n>>16},${(n>>8)&255},${n&255},${Math.max(0,Math.min(1,a))})`}
function hash(s){let h=0;for(const ch of String(s||''))h=(h*31+ch.charCodeAt(0))|0;return Math.abs(h)}
const stage=()=>document.querySelector('#modal .cstage');
function ctr(sel){const st=stage(),el=st&&st.querySelector(sel+' .cspr');if(!st||!el)return null;const a=st.getBoundingClientRect(),b=el.getBoundingClientRect();return {x:b.left-a.left+b.width/2,y:b.top-a.top+b.height*.5,w:a.width,h:a.height,sh:b.height}}
/* ---------- engine ---------- */
let cv=null,ctx=null,W=0,H=0,FX=[],PARTS=[],raf=0,last=0,dimA=0,dimT=0;
function ensure(){const st=stage();if(!st)return false;
 if(!cv||cv.parentNode!==st){cv=document.createElement('canvas');cv.className='pkcv';cv.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;z-index:6;pointer-events:none';st.appendChild(cv);ctx=cv.getContext('2d');FX=[];PARTS=[]}
 const r=st.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);W=r.width;H=r.height;
 if(cv.width!==Math.round(W*d)||cv.height!==Math.round(H*d)){cv.width=Math.round(W*d);cv.height=Math.round(H*d)}
 ctx.setTransform(cv.width/W,0,0,cv.height/H,0,0);return true}
function glow(c,x,y,r,col,a){if(r<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()}
function drawP(c,p,u){const a=Math.pow(Math.max(0,1-u),.8);
 switch(p.shape){
  case 'spark':c.strokeStyle=rgba(p.col,a);c.lineWidth=p.size;c.lineCap='round';c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-p.vx*.045,p.y-p.vy*.045);c.stroke();break;
  case 'flame':glow(c,p.x,p.y,p.size*(1-u*.55),p.col,a*.9);break;
  case 'smoke':glow(c,p.x,p.y,p.size*(1+u*1.6),p.col,a*.45);break;
  case 'shard':c.save();c.translate(p.x,p.y);c.rotate(p.rot);c.fillStyle=rgba(p.col,a);c.beginPath();c.moveTo(-p.size,0);c.lineTo(0,-p.size*.32);c.lineTo(p.size*1.3,0);c.lineTo(0,p.size*.32);c.closePath();c.fill();c.restore();break;
  case 'leaf':c.save();c.translate(p.x,p.y);c.rotate(p.rot);c.fillStyle=rgba(p.col,a);c.beginPath();c.ellipse(0,0,p.size,p.size*.45,0,0,TAU);c.fill();c.strokeStyle=rgba('#1f4a22',a*.6);c.lineWidth=1;c.beginPath();c.moveTo(-p.size,0);c.lineTo(p.size,0);c.stroke();c.restore();break;
  case 'rock':c.save();c.translate(p.x,p.y);c.rotate(p.rot);c.fillStyle=rgba(p.col,a);c.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU,r=p.size*(.7+((p.seed*(i+3))%7)/14);c.lineTo(Math.cos(an)*r,Math.sin(an)*r)}c.closePath();c.fill();c.strokeStyle=rgba('#2b1f12',a*.7);c.lineWidth=1.2;c.stroke();c.restore();break;
  case 'drop':c.fillStyle=rgba(p.col,a);c.beginPath();c.arc(p.x,p.y,p.size,0,TAU);c.fill();break;
  case 'arc':c.save();c.translate(p.x,p.y);c.rotate(p.rot);c.strokeStyle=rgba(p.col,a);c.lineWidth=p.size*.3;c.lineCap='round';c.beginPath();c.arc(0,0,p.size*(1+u),-.9,.9);c.stroke();c.restore();break;
  case 'ember':c.fillStyle=rgba(p.col,a);c.beginPath();c.arc(p.x,p.y,p.size*(1-u*.5),0,TAU);c.fill();break;
  default:glow(c,p.x,p.y,p.size*(1-u*.4)*1.6,p.col,a)}}
function loop(t){if(!ensure()){FX=[];PARTS=[];raf=0;return}
 const dt=Math.min(50,t-last)/1000/TS;last=t;ctx.clearRect(0,0,W,H);
 dimA+=(dimT-dimA)*Math.min(1,dt*8);if(dimA>.01){ctx.fillStyle=`rgba(8,6,14,${dimA*.6})`;ctx.fillRect(0,0,W,H)}
 FX=FX.filter(f=>{f.t+=dt;if(f.t<f.delay)return true;const k=(f.t-f.delay)/f.dur;if(k>=1){if(f.end)try{f.end()}catch(e){}return false}ctx.save();try{f.draw(ctx,k,dt)}catch(e){}ctx.restore();return true});
 ctx.save();PARTS=PARTS.filter(p=>{p.age+=dt;if(p.age<0)return true;if(p.age>p.life)return false;const u=p.age/p.life,dr=1-Math.min(1,(p.drag||0)*dt);p.vx*=dr;p.vy=p.vy*dr+(p.g||0)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.vr)p.rot+=p.vr*dt;ctx.globalCompositeOperation=p.add?'lighter':'source-over';drawP(ctx,p,u);return true});ctx.restore();
 if(FX.length||PARTS.length||dimA>.02||dimT>0)raf=requestAnimationFrame(loop);else{raf=0;ctx.clearRect(0,0,W,H)}}
function add(f){if(!ensure())return f;f.t=0;f.delay=f.delay||0;FX.push(f);if(!raf){last=performance.now();raf=requestAnimationFrame(loop)}return f}
function part(o){PARTS.push(Object.assign({x:0,y:0,vx:0,vy:0,life:.5,age:0,size:4,col:'#fff',shape:'c',rot:0,vr:0,g:0,drag:0,add:(CUR==='Thổ'||CUR==='Ám')?0:1,seed:ri(1,99)},o));if(!raf&&ensure()){last=performance.now();raf=requestAnimationFrame(loop)}}
function dim(v){dimT=v;if(!raf&&ensure()){last=performance.now();raf=requestAnimationFrame(loop)}}
function flash(col,a,dur){add({dur:dur||.25,draw(c,k){c.fillStyle=rgba(col,a*(1-k));c.fillRect(0,0,W,H)}})}
function shake(mag,ms){const st=stage();if(!st||!st.animate)return;const fr=[];const n=8;for(let i=0;i<=n;i++){const m=mag*(1-i/n);fr.push({transform:`translate(${rn(-m,m)}px,${rn(-m,m)}px)`})}st.animate(fr,{duration:ms||350,easing:'linear'})}
/* ---------- primitives ---------- */
function ring(x,y,r0,r1,dur,col,o){o=o||{};add({dur,delay:o.delay,draw(c,k){const r=r0+(r1-r0)*ease(k);c.globalCompositeOperation=gc();c.strokeStyle=rgba(col,(o.a||1)*(1-k));c.lineWidth=(o.w||5)*(1-k)+1;c.beginPath();if(o.flat)c.ellipse(x,y,r,r*.34,0,0,TAU);else c.arc(x,y,r,0,TAU);c.stroke()}})}
function crescent(x,y,ang,R,thick,dur,pal,o){o=o||{};const sw=o.sweep||1.15,dir=o.flip?-1:1;
 add({dur,delay:o.delay,draw(c,k){const h=ease(Math.min(1,k*1.5)),t0=Math.max(0,h-.7),al=k<.7?1:1-(k-.7)/.3;c.globalCompositeOperation=gc();
  const pts=24,out=[],inn=[];for(let i=0;i<=pts;i++){const u=t0+(h-t0)*i/pts,a=ang+dir*(-sw+2*sw*u),w=Math.pow(Math.sin(Math.PI*((u-t0)/Math.max(.001,h-t0)*.9+.05)),.9)*thick*.5*(u-t0>0?1:0);out.push([x+Math.cos(a)*(R+w),y+Math.sin(a)*(R+w)*.92]);inn.push([x+Math.cos(a)*(R-w),y+Math.sin(a)*(R-w)*.92])}
  const g=c.createLinearGradient(out[0][0],out[0][1],out[pts][0],out[pts][1]);g.addColorStop(0,rgba(pal[2],0));g.addColorStop(.5,rgba(pal[1],.9*al));g.addColorStop(1,rgba(pal[0],al));
  c.fillStyle=g;c.beginPath();out.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));for(let i=pts;i>=0;i--)c.lineTo(inn[i][0],inn[i][1]);c.closePath();c.fill();
  c.strokeStyle=rgba('#ffffff',.85*al);c.lineWidth=2;c.beginPath();for(let i=0;i<=pts;i++){const p=[(out[i][0]+inn[i][0])/2,(out[i][1]+inn[i][1])/2];i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])}c.stroke()}})}
function bolt(x0,y0,x1,y1,pal,dur,o){o=o||{};const mk=()=>{const L=Math.hypot(x1-x0,y1-y0),n=Math.max(6,Math.round(L/16)),nx=-(y1-y0)/L,ny=(x1-x0)/L,pts=[[x0,y0]];for(let i=1;i<n;i++){const u=i/n,d=rn(-1,1)*(o.jag||14)*Math.sin(Math.PI*u)+0;pts.push([x0+(x1-x0)*u+nx*d,y0+(y1-y0)*u+ny*d])}pts.push([x1,y1]);return pts};
 let pts=mk(),acc=0;add({dur,delay:o.delay,draw(c,k,dt){acc+=dt;if(acc>.045){acc=0;pts=mk()}c.globalCompositeOperation=gc();c.lineJoin='round';c.lineCap='round';const a=(k<.7?1:1-(k-.7)/.3);
  for(const [w,col,al] of [[(o.w||7)*2.4,pal[2],.35],[(o.w||7),pal[1],.7],[(o.w||7)*.4,'#ffffff',1]]){c.strokeStyle=rgba(col,al*a);c.lineWidth=w;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()}}})}
function beam(x0,y0,x1,y1,pal,dur,w,o){o=o||{};const L=Math.hypot(x1-x0,y1-y0),ang=Math.atan2(y1-y0,x1-x0);
 add({dur,delay:o.delay,draw(c,k){c.globalCompositeOperation=gc();const a=Math.sin(Math.PI*Math.min(1,k*1.1))**.6,ww=w*(.5+.5*a);c.save();c.translate(x0,y0);c.rotate(ang);
  const prog=o.grow?ease(Math.min(1,k*3)):1,LL=L*prog;
  for(const [ws,col,al] of [[ww*2.6,pal[2],.3],[ww*1.4,pal[1],.6],[ww*.5,'#ffffff',.95]]){c.strokeStyle=rgba(col,al*a);c.lineWidth=ws;c.lineCap='round';c.beginPath();if(o.wave){for(let i=0;i<=40;i++){const u=i/40,y=Math.sin(u*14+k*30)*ww*.9*Math.sin(Math.PI*u);i?c.lineTo(u*LL,y):c.moveTo(0,y)}}else{c.moveTo(0,0);c.lineTo(LL,0)}c.stroke()}
  c.restore()}})}
/* đầu đạn theo hệ */
function head(c,he,x,y,s,ang,t,o){o=o||{};const pal=P(he);c.save();c.translate(x,y);c.rotate(ang);c.globalCompositeOperation=gc();
 switch(he){
  case 'Hỏa':glow(c,0,0,s*1.9,pal[2],.75);glow(c,0,0,s*1.2,pal[1],.95);glow(c,0,0,s*.6,pal[0],1);break;
  case 'Thủy':glow(c,0,0,s*1.6,pal[2],.6);c.fillStyle=rgba(pal[1],.9);c.beginPath();c.arc(0,0,s,0,TAU);c.fill();glow(c,-s*.3,-s*.3,s*.55,'#ffffff',.9);break;
  case 'Mộc':c.rotate(t*10);for(let i=0;i<3;i++){c.rotate(TAU/3);c.fillStyle=rgba(pal[1],.95);c.beginPath();c.ellipse(s*.7,0,s*.8,s*.34,0,0,TAU);c.fill()}glow(c,0,0,s*.9,pal[0],.7);break;
  case 'Thổ':c.globalCompositeOperation='source-over';c.rotate(t*6);c.fillStyle=pal[2];c.strokeStyle='#2b1f12';c.lineWidth=2;c.beginPath();for(let i=0;i<7;i++){const an=i/7*TAU,r=s*(.85+((i*5)%3)*.18);c.lineTo(Math.cos(an)*r,Math.sin(an)*r)}c.closePath();c.fill();c.stroke();c.fillStyle=rgba(pal[1],.6);c.beginPath();c.arc(-s*.2,-s*.2,s*.4,0,TAU);c.fill();break;
  case 'Kim':c.rotate(o.noSpin?0:t*14);c.fillStyle=rgba(pal[0],1);c.beginPath();c.moveTo(-s*(o.long?3:1.6),0);c.lineTo(0,-s*.34);c.lineTo(s*(o.long?3.4:2),0);c.lineTo(0,s*.34);c.closePath();c.fill();glow(c,0,0,s*1.3,pal[1],.7);break;
  case 'Lôi':glow(c,0,0,s*1.8,pal[2],.6);glow(c,0,0,s*.9,pal[1],.95);glow(c,0,0,s*.45,'#fff',1);c.strokeStyle=rgba('#fff',.9);c.lineWidth=1.8;for(let i=0;i<4;i++){const a=rn(0,TAU);c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*s*1.6+rn(-4,4),Math.sin(a)*s*1.6+rn(-4,4));c.stroke()}break;
  case 'Phong':c.rotate(t*16);c.strokeStyle=rgba(pal[0],.95);c.lineWidth=s*.4;c.lineCap='round';c.beginPath();c.arc(0,0,s,-1.3,1.3);c.stroke();c.strokeStyle=rgba(pal[1],.7);c.lineWidth=s*.8;c.beginPath();c.arc(0,0,s*.9,-1.2,1.2);c.stroke();break;
  default:c.globalCompositeOperation='source-over';glow(c,0,0,s*1.7,pal[2],.9);glow(c,0,0,s*1.1,'#0a0612',.95);c.globalCompositeOperation=gc();c.strokeStyle=rgba(pal[1],.8);c.lineWidth=2;c.beginPath();c.arc(0,0,s*1.05,0,TAU);c.stroke()}
 c.restore()}
function trail(he,x,y,s,vx,vy){const pal=P(he);
 switch(he){
  case 'Hỏa':part({x,y,vx:rn(-30,30)-vx*.1,vy:rn(-50,0),life:.4,size:s*rn(.7,1.2),col:pk([pal[1],pal[2]]),shape:'flame'});break;
  case 'Thủy':part({x,y,vx:rn(-20,20),vy:rn(-10,40),life:.45,size:rn(1.5,3.2),col:pal[1],shape:'drop',g:300});break;
  case 'Mộc':part({x,y,vx:rn(-40,40),vy:rn(-40,40),life:.55,size:rn(4,7),col:pk([pal[1],pal[2]]),shape:'leaf',rot:rn(0,TAU),vr:rn(-8,8),g:60});break;
  case 'Thổ':part({x,y,vx:rn(-30,30),vy:rn(-20,40),life:.45,size:rn(8,14),col:'#b8956a',shape:'smoke',add:0});break;
  case 'Kim':part({x,y,vx:rn(-60,60),vy:rn(-60,60),life:.3,size:rn(1.2,2.4),col:pal[0],shape:'spark',drag:2});break;
  case 'Lôi':part({x,y,vx:rn(-90,90),vy:rn(-90,90),life:.22,size:rn(1.2,2.4),col:pk([pal[0],pal[1]]),shape:'spark'});break;
  case 'Phong':part({x,y,vx:-vx*.1,vy:-vy*.1,life:.35,size:rn(6,10),col:pal[0],shape:'arc',rot:Math.atan2(vy,vx)+Math.PI});break;
  default:part({x,y,vx:rn(-30,30),vy:rn(-30,30),life:.6,size:rn(9,16),col:pk([pal[2],pal[1]]),shape:'smoke',add:0})}}
/* bắn đầu đạn từ A đến B */
function shoot(A,B,he,dur,s,o){o=o||{};const ang=Math.atan2(B.y-A.y,B.x-A.x),cx=-Math.sin(ang)*(o.curve||0),cy=Math.cos(ang)*(o.curve||0);let tt=0;
 return new Promise(res=>add({dur,delay:o.delay,draw(c,k,dt){tt+=dt;const u=o.lin?k:easeIn(k)*.6+k*.4,x=A.x+(B.x-A.x)*u+cx*Math.sin(Math.PI*u),y=A.y+(B.y-A.y)*u+cy*Math.sin(Math.PI*u);
  const a2=o.fall?Math.PI/2:ang;head(c,he,x,y,s,a2,tt,o);for(let i=0;i<(o.tr||2);i++)trail(he,x+rn(-3,3),y+rn(-3,3),s,(B.x-A.x)/dur,(B.y-A.y)/dur)},end(){res()}}))}
/* nổ khi trúng, mang đặc trưng hệ */
function impact(x,y,he,sc,hard){sc=sc||1;const pal=P(he),n=Math.round(14*sc);
 glow0(x,y,50*sc,pal,.9,.22);ring(x,y,6,60*sc,.35,pal[1],{w:5,flat:he==='Thổ'||he==='Thủy'});
 switch(he){
  case 'Kim':for(let i=0;i<n*1.4;i++){const a=rn(0,TAU),v=rn(140,460)*sc;part({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rn(.2,.5),size:rn(1.4,3),col:pk(pal),shape:'spark',drag:3})}break;
  case 'Mộc':for(let i=0;i<n;i++){const a=rn(0,TAU),v=rn(50,230)*sc;part({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,life:rn(.5,.9),size:rn(5,10),col:pk([pal[1],pal[2],'#a6e28b']),shape:'leaf',rot:rn(0,TAU),vr:rn(-9,9),g:140,add:0})}break;
  case 'Thủy':for(let i=0;i<n*1.5;i++){const a=rn(-Math.PI,0),v=rn(120,340)*sc;part({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rn(.4,.8),size:rn(2,4.5),col:pk([pal[1],pal[0]]),shape:'drop',g:620})}break;
  case 'Hỏa':for(let i=0;i<n;i++){const a=rn(0,TAU),v=rn(30,170)*sc;part({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-rn(40,120),life:rn(.4,.8),size:rn(12,26)*sc,col:pk([pal[1],pal[2],pal[0]]),shape:'flame'})}for(let i=0;i<n;i++){const a=rn(0,TAU),v=rn(80,260)*sc;part({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rn(.5,1),size:rn(1.5,3),col:pal[1],shape:'ember',g:-60})}break;
  case 'Thổ':spikes(x,y+34*sc,Math.max(3,Math.round(4*sc)),pal,sc);for(let i=0;i<n;i++){const a=rn(Math.PI,TAU),v=rn(100,340)*sc;part({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rn(.5,.9),size:rn(4,9),col:pk([pal[2],pal[1],'#5a4326']),shape:'rock',rot:rn(0,TAU),vr:rn(-9,9),g:760,add:0})}for(let i=0;i<7;i++)part({x:x+rn(-20,20),y:y+rn(0,12),vx:rn(-50,50),vy:rn(-30,0),life:.7,size:rn(16,28),col:'#b8956a',shape:'smoke',add:0});break;
  case 'Lôi':for(let i=0;i<5;i++){const a=rn(0,TAU),L=rn(40,90)*sc;bolt(x,y,x+Math.cos(a)*L,y+Math.sin(a)*L,pal,.22,{w:3,jag:8,delay:i*.03})}for(let i=0;i<n;i++){const a=rn(0,TAU),v=rn(100,380)*sc;part({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rn(.2,.45),size:rn(1.2,2.6),col:pk(pal),shape:'spark',drag:2})}break;
  case 'Phong':for(let i=0;i<6;i++){const a=rn(0,TAU),v=rn(80,220)*sc;part({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.5,size:rn(10,20)*sc,col:pal[0],shape:'arc',rot:a,vr:rn(-3,3)})}for(let i=0;i<n;i++){const a=rn(0,TAU),v=rn(60,200)*sc;part({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rn(.5,.9),size:rn(4,7),col:pal[1],shape:'leaf',rot:rn(0,TAU),vr:rn(-9,9),g:30})}break;
  default:for(let i=0;i<n;i++){const a=rn(0,TAU),r=rn(60,110)*sc;part({x:x+Math.cos(a)*r,y:y+Math.sin(a)*r,vx:-Math.cos(a)*r*3,vy:-Math.sin(a)*r*3,life:.35,size:rn(2,4),col:pal[1]})}for(let i=0;i<9;i++){const a=rn(0,TAU),v=rn(30,130)*sc;part({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rn(.5,.9),size:rn(14,26)*sc,col:pk([pal[2],'#1b1226']),shape:'smoke',add:0})}}
 if(hard)shake(Math.min(14,6*sc),380)}
function spikes(x,y,n,pal,sc){for(let i=0;i<n;i++){const ox=(i-(n-1)/2)*26*sc+rn(-6,6),h=rn(34,70)*sc,w=rn(7,11)*sc,d=i*.035;add({dur:.7,delay:d,draw(c,k){const u=k<.25?ease(k/.25):1-Math.max(0,(k-.6)/.4),hh=h*u,al=1-Math.max(0,(k-.7)/.3);c.globalCompositeOperation='source-over';c.fillStyle=rgba(pal[2],al);c.strokeStyle=rgba('#2b1608',al);c.lineWidth=2;c.beginPath();c.moveTo(x+ox-w,y);c.lineTo(x+ox+rn(-2,2),y-hh);c.lineTo(x+ox+w,y);c.closePath();c.fill();c.stroke();c.fillStyle=rgba(pal[1],al*.8);c.beginPath();c.moveTo(x+ox-w*.2,y);c.lineTo(x+ox+rn(-1,1),y-hh);c.lineTo(x+ox+w,y);c.closePath();c.fill()}})}}
function glow0(x,y,r,pal,a,dur){add({dur,draw(c,k){c.globalCompositeOperation=gc();glow(c,x,y,r*(.6+.6*k),pal[0],a*(1-k));glow(c,x,y,r*1.6*(.6+.6*k),pal[1],a*.5*(1-k))}})}
function speedLines(x,y,pal,n,dur,R){add({dur,draw(c,k){c.globalCompositeOperation=gc();c.lineCap='round';for(let i=0;i<n;i++){const a=i/n*TAU+.2,r0=R*(.3+ease(k)*.9),r1=r0+R*.5*(1-k);c.strokeStyle=rgba(i%2?pal[0]:pal[1],(1-k)*.9);c.lineWidth=3*(1-k)+1;c.beginPath();c.moveTo(x+Math.cos(a)*r0,y+Math.sin(a)*r0*.8);c.lineTo(x+Math.cos(a)*r1,y+Math.sin(a)*r1*.8);c.stroke()}}})}
function runeCircle(x,y,R,pal,dur,o){o=o||{};add({dur,delay:o.delay,draw(c,k){const a=Math.sin(Math.PI*Math.min(1,k*1.05))**.5,rot=k*(o.spin||2.5);c.globalCompositeOperation=gc();c.save();c.translate(x,y);if(o.flat)c.scale(1,.38);
  c.strokeStyle=rgba(pal[1],a);c.lineWidth=3;c.beginPath();c.arc(0,0,R,0,TAU);c.stroke();c.strokeStyle=rgba(pal[0],a*.8);c.lineWidth=1.5;c.beginPath();c.arc(0,0,R*.86,0,TAU);c.stroke();
  c.rotate(rot);const sides=o.sides||6;c.strokeStyle=rgba(pal[0],a*.9);c.beginPath();for(let i=0;i<=sides;i++){const an=i/sides*TAU;c.lineTo(Math.cos(an)*R*.86,Math.sin(an)*R*.86)}c.stroke();
  c.rotate(-rot*2);for(let i=0;i<sides*2;i++){const an=i/(sides*2)*TAU;c.save();c.rotate(an);c.fillStyle=rgba(pal[1],a);c.fillRect(R*.9,-2,R*.12,4);c.restore()}
  c.strokeStyle=rgba(pal[1],a*.7);c.lineWidth=2;c.beginPath();for(let i=0;i<sides;i++){const an=i/sides*TAU;c.moveTo(Math.cos(an)*R*.3,Math.sin(an)*R*.3);c.lineTo(Math.cos(an+Math.PI*.7)*R*.75,Math.sin(an+Math.PI*.7)*R*.75)}c.stroke();glow(c,0,0,R*.5,pal[1],a*.35);c.restore()}})}
function banner(name,he,big){const st=stage();if(!st)return;const pal=P(he);let d=st.querySelector('.pksk');if(d)d.remove();d=document.createElement('div');d.className='pksk'+(big?' big':'');d.innerHTML=`<i style="background:${pal[1]}"></i><b>${name}</b><em style="color:${pal[1]}">${he||''}</em>`;d.style.setProperty('--c',pal[1]);st.appendChild(d);setTimeout(()=>d.remove(),(big?1700:1250)*TS)}
/* ---------- đòn thường theo loại ---------- */
function wpn(m){const n=(m&&m.name)||'';return /Kiếm/.test(n)?'kiem':/Đao|Trảm/.test(n)?'dao':/Quyền/.test(n)?'quyen':/Chưởng|Thủ/.test(n)?'chuong':/Chỉ|Ấn/.test(n)?'chi':/Thương/.test(n)?'thuong':['kiem','dao','quyen','chuong','chi','thuong'][hash(n)%6]}
function ult(m){const n=(m&&m.name)||'';return /Diệt Thế/.test(n)?'diet':/Nhất Kích/.test(n)?'nhat':/Trảm Thiên/.test(n)?'tram':/Phá Không/.test(n)?'pha':/Tịch Diệt/.test(n)?'tich':['diet','nhat','tram','pha','tich'][hash(n)%5]}
const aff=(m,a)=>!!(m&&m.affix&&m.affix.includes(a));
async function melee(A,B,he,w,sc,m){const pal=P(he),ang=Math.atan2(B.y-A.y,B.x-A.x);
 if(w==='kiem'){const n=2+(sc>1.3?1:0);for(let i=0;i<n;i++){later(()=>{crescent(B.x,B.y,ang+Math.PI+rn(-.6,.6)+(i%2?.9:-.9),62*sc,18*sc,.38,pal,{flip:i%2,sweep:1.2});impact(B.x+rn(-14,14),B.y+rn(-14,14),he,.7*sc)},i*170)}await sleep(150*n+280);return}
 if(w==='dao'){crescent(B.x,B.y,ang+Math.PI+.5,92*sc,38*sc,.5,pal,{sweep:1.35});await sleep(190);add({dur:.4,draw(c,k){c.globalCompositeOperation=gc();c.strokeStyle=rgba(pal[1],1-k);c.lineWidth=4;c.beginPath();let x=B.x-20,y=B.y+50;c.moveTo(x,y);for(let i=1;i<8;i++){x+=rn(8,20);y+=rn(-8,10);if(i/8<ease(k)*1.2)c.lineTo(x,y)}c.stroke()}});impact(B.x,B.y,he,1.2*sc,true);await sleep(320);return}
 if(w==='quyen'){await sleep(100);speedLines(B.x,B.y,pal,14,.35,80*sc);ring(B.x,B.y+30,10,110*sc,.4,pal[1],{flat:true,w:7});ring(B.x,B.y,6,70*sc,.3,pal[0],{delay:.06});add({dur:.25,draw(c,k){c.globalCompositeOperation=gc();glow(c,B.x,B.y,60*sc*(1-k*.4),pal[0],.95*(1-k))}});impact(B.x,B.y,he,1.15*sc,true);await sleep(420);return}
 if(w==='chuong'){const L=Math.hypot(B.x-A.x,B.y-A.y);for(let i=0;i<3;i++)add({dur:.38,delay:i*.07,draw(c,k){const u=ease(k),x=A.x+(B.x-A.x)*u,y=A.y+(B.y-A.y)*u,r=22+u*46*sc;c.globalCompositeOperation=gc();c.strokeStyle=rgba(i?pal[1]:pal[0],(1-k)*.9);c.lineWidth=5*(1-k)+1.5;c.beginPath();c.arc(x,y,r,ang-1.05,ang+1.05);c.stroke();glow(c,x,y,r*.7,pal[1],.25*(1-k))}});
  await sleep(300);runeCircle(B.x,B.y,60*sc,pal,.6,{sides:8,spin:3});flash(pal[0],.25,.2);impact(B.x,B.y,he,1.1*sc,true);await sleep(450);return}
 if(w==='chi'){beam(A.x,A.y-10,B.x,B.y,pal,.5,9*sc,{grow:1,wave:he==='Thủy'});if(he==='Lôi')bolt(A.x,A.y-10,B.x,B.y,pal,.4,{w:5,jag:18});await sleep(260);impact(B.x,B.y,he,.95*sc,true);for(let i=0;i<10;i++)part({x:B.x,y:B.y,vx:Math.cos(ang)*rn(200,500),vy:Math.sin(ang)*rn(200,500)+rn(-60,60),life:.4,size:rn(1.5,3),col:pal[0],shape:'spark',drag:2});await sleep(300);return}
 if(w==='thuong'){const dx=Math.cos(ang),dy=Math.sin(ang),ex=B.x+dx*60,ey=B.y+dy*60;
  await new Promise(res=>add({dur:.3,draw(c,k){const u=easeIn(k)*.5+k*.5,x=A.x+(ex-A.x)*u,y=A.y+(ey-A.y)*u,L=110*sc;c.globalCompositeOperation=gc();c.save();c.translate(x,y);c.rotate(ang);const g=c.createLinearGradient(-L,0,0,0);g.addColorStop(0,rgba(pal[2],0));g.addColorStop(1,rgba(pal[1],.9));c.fillStyle=g;c.beginPath();c.moveTo(-L,0);c.lineTo(0,-6*sc);c.lineTo(22,0);c.lineTo(0,6*sc);c.closePath();c.fill();c.fillStyle=rgba('#fff',.95);c.beginPath();c.moveTo(-10,0);c.lineTo(0,-3);c.lineTo(22,0);c.lineTo(0,3);c.closePath();c.fill();c.restore();trail(he,x-dx*40,y-dy*40,6,0,0)},end:res}));
  impact(B.x,B.y,he,1*sc,true);add({dur:.35,draw(c,k){c.globalCompositeOperation=gc();c.strokeStyle=rgba(pal[0],1-k);c.lineWidth=3;c.beginPath();c.moveTo(B.x-dx*(30+80*k),B.y-dy*(30+80*k));c.lineTo(B.x+dx*(60+100*k),B.y+dy*(60+100*k));c.stroke()}});await sleep(330);return}
}
async function spell(A,B,he,sc){await shoot(A,B,he,.42,16*sc,{curve:rn(-25,25),tr:3});impact(B.x,B.y,he,sc,true);await sleep(380)}
async function basic(A,B,he){const pal=P(he),ang=Math.atan2(B.y-A.y,B.x-A.x);await sleep(110);crescent(B.x,B.y,ang+Math.PI+.4,54,15,.3,[ '#ffffff',pal[0],pal[1] ],{sweep:1.1});await sleep(120);impact(B.x,B.y,he,.55);await sleep(200)}
/* ---------- tuyệt kỹ ---------- */
async function ultimate(A,B,he,kind,sc,m){const pal=P(he);dim(1);banner(m&&m.name||'Tuyệt kỹ',he,true);
 const charge=()=>{for(let i=0;i<28;i++){const a=rn(0,TAU),r=rn(60,130);part({x:A.x+Math.cos(a)*r,y:A.y+Math.sin(a)*r,vx:-Math.cos(a)*r*3.2,vy:-Math.sin(a)*r*3.2,life:.38,size:rn(2,4.5),col:pk(pal)})}glow0(A.x,A.y,70,pal,.8,.5)};
 charge();await sleep(520);
 if(kind==='nhat'){const ang=Math.atan2(B.y-A.y,B.x-A.x);flash('#ffffff',.7,.18);crescent(B.x,B.y,ang+Math.PI+.15,Math.min(W,H)*.62,70*sc,.55,pal,{sweep:1.05});crescent(B.x,B.y,ang+Math.PI-.1,Math.min(W,H)*.5,30*sc,.5,['#ffffff',pal[0],pal[1]],{sweep:1.05,delay:.05});await sleep(260);speedLines(B.x,B.y,pal,22,.5,160*sc);impact(B.x,B.y,he,2*sc,true);ring(B.x,B.y,10,220*sc,.6,pal[0],{w:9});await sleep(700)}
 else if(kind==='tram'){const x=B.x;beam(x,-20,x,B.y+40,pal,.65,50*sc,{grow:1});await sleep(200);flash(pal[0],.55,.3);ring(x,B.y+36,10,230*sc,.6,pal[1],{flat:true,w:9});for(let i=0;i<8;i++)add({dur:.5,delay:i*.01,draw(c,k){c.globalCompositeOperation=gc();c.strokeStyle=rgba(pal[1],1-k);c.lineWidth=4*(1-k)+1;const a=i/8*TAU;c.beginPath();c.moveTo(x,B.y+40);c.lineTo(x+Math.cos(a)*200*ease(k),B.y+40+Math.sin(a)*70*ease(k));c.stroke()}});impact(x,B.y,he,2.1*sc,true);await sleep(750)}
 else if(kind==='diet'){runeCircle(B.x,B.y-60,Math.min(150,W*.2)*sc,pal,1.1,{sides:8,spin:2});runeCircle(B.x,B.y+36,130*sc,pal,1.1,{flat:true,sides:6,spin:-2});await sleep(520);for(let i=0;i<9;i++){const x=B.x+rn(-90,90);later(()=>{beam(x,-10,x+rn(-6,6),B.y+rn(-10,30),pal,.3,16*sc,{grow:1});impact(x,B.y+rn(0,30),he,.8*sc,false)},i*70)}await sleep(600);flash(pal[0],.6,.35);impact(B.x,B.y,he,2.2*sc,true);ring(B.x,B.y,10,260*sc,.7,pal[0],{w:10});await sleep(650)}
 else if(kind==='pha'){add({dur:1,draw(c,k){const a=k<.15?k/.15:k>.75?(1-k)/.25:1;c.save();c.translate(B.x,B.y);c.rotate(-.5);c.globalCompositeOperation='source-over';c.fillStyle=rgba('#05030a',a);c.beginPath();c.ellipse(0,0,30*a*sc,125*sc*a,0,0,TAU);c.fill();c.globalCompositeOperation=gc();c.strokeStyle=rgba(pal[0],a);c.lineWidth=5;c.stroke();c.strokeStyle=rgba(pal[1],a*.7);c.lineWidth=14;c.globalAlpha=.5;c.stroke();c.restore()}});
  for(let i=0;i<40;i++)later(()=>{const a=rn(0,TAU),r=rn(90,200);part({x:B.x+Math.cos(a)*r,y:B.y+Math.sin(a)*r,vx:-Math.cos(a)*r*2.6,vy:-Math.sin(a)*r*2.6,life:.5,size:rn(2,4),col:pk(pal)})},i*12);await sleep(700);flash(pal[0],.7,.3);impact(B.x,B.y,he,2.3*sc,true);ring(B.x,B.y,10,280*sc,.7,pal[1],{w:11});await sleep(650)}
 else{for(let i=0;i<3;i++)add({dur:.8,delay:i*.18,draw(c,k){const r=(1-ease(k))*210*sc+10;c.globalCompositeOperation=gc();c.strokeStyle=rgba(pal[i%2?0:1],Math.min(1,k*3)*(1-k*.3));c.lineWidth=7*(1-k)+2;c.beginPath();c.arc(B.x,B.y,r,0,TAU);c.stroke()}});
  add({dur:1,draw(c,k){const a=k<.2?k/.2:1-Math.max(0,k-.8)/.2;glow(c,B.x,B.y,40*sc*a,'#000000',a);c.globalCompositeOperation=gc();glow(c,B.x,B.y,60*sc*a,pal[2],.6*a)}});await sleep(900);flash(pal[0],.8,.4);impact(B.x,B.y,he,2.4*sc,true);ring(B.x,B.y,10,300*sc,.8,pal[0],{w:12});await sleep(700)}
 dim(0)}
/* ---------- phụ tố ---------- */
function afterFx(B,A,he,m){if(!m)return;const pal=P(he);
 if(aff(m,'dot'))for(let i=0;i<14;i++)later(()=>part({x:B.x+rn(-28,28),y:B.y+rn(-10,40),vx:rn(-20,20),vy:-rn(30,90),life:.8,size:rn(8,16),col:pk(['#ff9a2e','#d7381f']),shape:'flame'}),i*70);
 if(aff(m,'hut'))for(let i=0;i<8;i++)later(()=>{const o={x:B.x+rn(-20,20),y:B.y+rn(-20,20)},t0=performance.now();add({dur:.5,draw(c,k){const u=ease(k),x=o.x+(A.x-o.x)*u,y=o.y+(A.y-o.y)*u-Math.sin(Math.PI*u)*40;c.globalCompositeOperation=gc();glow(c,x,y,9,'#ff3a4a',1-k*.5)}})},i*60);
 if(aff(m,'troi')){add({dur:.9,draw(c,k){const a=k<.8?1:1-(k-.8)/.2;c.strokeStyle=rgba('#cfd6e8',a);c.lineWidth=3;for(let j=0;j<2;j++){c.beginPath();c.ellipse(B.x,B.y+(j?10:-18),34+j*6,12,0,0,TAU);c.setLineDash([7,5]);c.stroke()}c.setLineDash([])}})}
 if(aff(m,'choang'))add({dur:.9,draw(c,k){const a=k<.8?1:1-(k-.8)/.2;c.globalCompositeOperation=gc();for(let i=0;i<3;i++){const an=k*9+i*TAU/3,x=B.x+Math.cos(an)*28,y=B.y-58+Math.sin(an)*9;c.fillStyle=rgba('#ffe27a',a);c.beginPath();for(let j=0;j<10;j++){const r=j%2?3:7,ap=j/10*TAU;c.lineTo(x+Math.cos(ap)*r,y+Math.sin(ap)*r)}c.closePath();c.fill()}}});
 if(aff(m,'xuyen')){const ang=Math.atan2(B.y-A.y,B.x-A.x);add({dur:.35,draw(c,k){c.globalCompositeOperation=gc();c.strokeStyle=rgba('#ffffff',1-k);c.lineWidth=3;c.beginPath();c.moveTo(B.x-Math.cos(ang)*20,B.y-Math.sin(ang)*20);c.lineTo(B.x+Math.cos(ang)*(80+120*k),B.y+Math.sin(ang)*(80+120*k));c.stroke()}})}}
/* ---------- API ---------- */
const FXAPI={
 async player(a,m,he){const A=ctr('.cme'),B=ctr('.cfoe');if(!A||!B||!ensure())return;he=he||(m&&m.he)||'Kim';CUR=he;const g=m?(m.g||0):0,sc=1+g*.13;
  if(a==='sk'&&m){banner(m.name,he,false)}
  if(a==='atk'||!m){await basic(A,B,he);return}
  if(m.type==='tuyet'){await ultimate(A,B,he,ult(m),sc,m);afterFx(B,A,he,m);return}
  const sp=document.querySelector('#modal .cme');if(sp){sp.classList.remove('pkdash');void sp.offsetWidth;sp.classList.add('pkdash')}
  const w=wpn(m);
  // vũ khí kiểu ném/phép theo hệ thay cho cận chiến ở một số tổ hợp để đa dạng
  const spellish=(w==='chuong'&&(he==='Hỏa'||he==='Thủy'||he==='Mộc'||he==='Thổ'))||(w==='chi'&&(he==='Hỏa'||he==='Phong'||he==='Ám'));
  if(spellish&&Math.random()<.65)await spell(A,B,he,sc);else await melee(A,B,he,w,sc,m);
  if(aff(m,'lien')){await sleep(80);impact(B.x+rn(-20,20),B.y+rn(-20,20),he,.8*sc,true);await sleep(160)}
  afterFx(B,A,he,m)},
 async enemy(e){const A=ctr('.cfoe'),B=ctr('.cme');if(!A||!B||!ensure())return;const he=e.he||'Ám',pal=P(he),big=e.boss?1.5:1;CUR=he;
  const sp=document.querySelector('#modal .cfoe');if(sp){sp.classList.remove('pkdashf');void sp.offsetWidth;sp.classList.add('pkdashf')}
  if(e.kind==='beast'){await sleep(130);const ang=Math.atan2(B.y-A.y,B.x-A.x);for(let i=0;i<3;i++)add({dur:.35,delay:i*.06,draw(c,k){const u=ease(k);c.globalCompositeOperation=gc();c.strokeStyle=rgba(i===1?'#ffffff':'#ff8a6a',1-k);c.lineWidth=5*(1-k)+1;c.lineCap='round';c.beginPath();const ox=B.x+(i-1)*16-30,oy=B.y-40+(i-1)*4;c.moveTo(ox,oy);c.lineTo(ox+70*u,oy+90*u);c.stroke()}});await sleep(200);impact(B.x,B.y,he,.9*big,true);await sleep(260);return}
  if(e.boss){runeCircle(A.x,A.y,70,pal,.7,{flat:true,sides:6});await sleep(300)}
  await shoot(A,B,he,.45,15*big,{curve:rn(-30,30),tr:3});impact(B.x,B.y,he,big,true);await sleep(380)},
 misc(a,arg){const A=ctr('.cme');if(!A||!ensure())return;
  if(a==='def'){const pal=P('Thủy');add({dur:.9,draw(c,k){const al=k<.75?1:1-(k-.75)/.25;c.globalCompositeOperation=gc();c.strokeStyle=rgba(pal[0],al*.9);c.lineWidth=4;c.beginPath();c.arc(A.x,A.y,70+Math.sin(k*8)*2,-Math.PI*.95,Math.PI*.1);c.stroke();c.strokeStyle=rgba(pal[1],al*.5);c.lineWidth=14;c.stroke();glow(c,A.x,A.y,80,pal[1],.18*al)}});for(let i=0;i<10;i++)part({x:A.x+rn(-50,50),y:A.y+rn(10,60),vx:0,vy:-rn(30,80),life:.7,size:rn(2,4),col:pal[0]})}
  else if(a==='item'){for(let i=0;i<22;i++)later(()=>part({x:A.x+rn(-40,40),y:A.y+rn(10,70),vx:rn(-10,10),vy:-rn(50,130),life:.9,size:rn(2.5,5),col:pk(['#9af0a0','#e8ffd8','#7fe0ff']),shape:'c'}),i*28);glow0(A.x,A.y,70,['#e8ffd8','#7fe08a'],.6,.7)}
  else if(a==='flee'){for(let i=0;i<14;i++)part({x:A.x+rn(-20,20),y:A.y+rn(30,70),vx:rn(-140,-30),vy:rn(-20,10),life:.6,size:rn(14,26),col:'#cbbd9c',shape:'smoke',add:0})}},
 slow(v){TS=v||1},demo(kind,he,g){const m={name:kind==='tuyet'?'Tuyệt Kỹ':'Chiêu',type:kind==='tuyet'?'tuyet':'vo',he,g:g||2,affix:[]};return FXAPI.player('sk',m,he)},
 wpn,ult};
window.__fx=FXAPI;
const css=`.pksk{position:absolute;left:0;top:58px;z-index:8;pointer-events:none;display:flex;align-items:center;gap:8px;padding:5px 18px 5px 12px;background:linear-gradient(90deg,rgba(20,16,28,.9),rgba(20,16,28,.62) 80%,transparent);border-left:5px solid var(--c);animation:pksk 1.25s ease-out forwards}
.pksk b{font-size:19px;letter-spacing:.06em;color:#fff6d8;text-shadow:0 0 8px var(--c),0 2px 0 #000;font-family:"Noto Serif","Times New Roman",serif}.pksk em{font-style:normal;font-size:11px;font-weight:800;border:1px solid var(--c);border-radius:4px;padding:0 5px}.pksk i{display:none}
.pksk.big{top:34%;padding:10px 40px 10px 22px;border-left-width:8px;animation-duration:1.7s}.pksk.big b{font-size:30px;letter-spacing:.12em}.pksk.big em{font-size:13px}
@keyframes pksk{0%{transform:translateX(-110%);opacity:0}14%{transform:translateX(0);opacity:1}80%{transform:translateX(6px);opacity:1}100%{transform:translateX(30px);opacity:0}}`;
if(!document.getElementById('v10rcss')){const s=document.createElement('style');s.id='v10rcss';s.textContent=css;document.head.appendChild(s)}
try{PATCH_NOTES.unshift(['v10.21 · 07/11/2026 · Hoạt ảnh chiêu thức mới',[
 'Viết lại toàn bộ hiệu ứng chiến đấu bằng canvas: mỗi chiêu được vẽ theo <b>hệ</b> (Kim tia sáng, Mộc lá và dây, Thủy giọt nước, Hỏa lửa cháy, Thổ đá văng, Lôi sét giật, Phong lưỡi gió, Ám khói tối) kết hợp với <b>loại chiêu</b>.',
 'Loại chiêu: Kiếm (vài đường chém cung trăng), Đao (một nhát nặng nứt đất), Quyền (chấn động, vạch tốc độ), Chưởng (sóng chưởng và pháp trận), Chỉ/Ấn (tia xạ), Thương (đâm xuyên), cùng đạn phép theo hệ.',
 'Mỗi tuyệt kỹ có hoạt ảnh riêng, làm tối màn hình, tên chiêu hiện chữ lớn: Diệt Thế Thức (pháp trận cột sáng), Nhất Kích (nhát chém xuyên cả màn), Trảm Thiên (kiếm quang từ trời giáng), Phá Không (khe nứt không gian), Tịch Diệt (hố đen sụp đổ).',
 'Chiêu có phụ tố sẽ có hiệu ứng riêng: thiêu đốt có lửa bám, hút huyết có cầu máu bay về, trói buộc có xích, chấn hồn có sao quay, xuyên giáp có tia xuyên, liên kích đánh thêm nhát phụ.',
 'Tên chiêu hiện ngang đầu màn đấu mỗi lần dùng. Quái cũng có hoạt ảnh tấn công riêng; thủ thế có khiên, dùng đồ có ánh sáng hồi phục, bỏ chạy có bụi.']])}catch(e){}
})();
