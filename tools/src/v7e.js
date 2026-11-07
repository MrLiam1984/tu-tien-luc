/* ===== v7.7 · Đi bộ liền mạch, bỏ "Tìm cơ duyên", mini game hái linh thảo & khai khoáng, chiến đấu kiểu Pokémon 2D ===== */
(function(){
const rn=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const sleep2=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- 1. đi bộ liền mạch: một đồng hồ chung, không dừng ở ranh giới ô ---------- */
window.owWalk=async function(path){if(OW.walking||busy)return;const goal=path.length?path[path.length-1]:null;OW.walking=true;OW.peek=false;owPeekApply();OW.stop=false;OW.path=path.slice();const M=owGen(S.loc);let msg='';
 let clock=null;// thời điểm logic kết thúc ô trước: ô sau tiếp nối đúng từ đó
 try{while(OW.path.length){if(OW.stop||busy||S.dead)break;const ov=document.getElementById('overlay');if(ov&&ov.classList.contains('show'))break;
   const [nx,ny]=OW.path[0];const cost=owCost(M,nx,ny);if(typeof tinhLuc==='function'&&tinhLuc()<cost*.35){msg='Kiệt sức (hết tinh lực). Nghỉ ngơi, tĩnh tâm hoặc tu luyện để hồi.';break}
   const p=owPos();const from={x:p[0],y:p[1]};const dur=Math.min(200,120+cost*12);
   const t0=clock!=null?clock:performance.now();
   await new Promise(res=>{const f=now=>{const k=Math.max(0,(now-t0)/dur);
     if(k<1){OW.cam={x:from.x+(nx-from.x)*k,y:from.y+(ny-from.y)*k};owDraw();requestAnimationFrame(f);return}
     const nx2=OW.path[1];if(nx2&&!OW.stop){const d2=Math.min(200,120+owCost(M,nx2[0],nx2[1])*12);const k2=Math.min(1,(now-t0-dur)/d2);OW.cam={x:nx+(nx2[0]-nx)*k2,y:ny+(nx2[1]-ny)*k2}}else OW.cam={x:nx,y:ny};owDraw();res()};requestAnimationFrame(f)});
   clock=t0+dur;
   OW.path.shift();owS().pos[S.loc]=[nx,ny];if(typeof tlUse==='function')tlUse(cost*.35);OW.acc+=cost*(S.mount?.6:1);while(OW.acc>=3){OW.acc-=3;if(!passCa(1))break}owReveal();
   const n=owNodeAt(nx,ny);if(n){S.cpos={loc:S.loc,id:n.id,x:n.x,y:n.y}}
   if(S.dead)break;if(OW.path.length&&await owEncounter(nx,ny)){clock=null;break}
   if(performance.now()-clock>120)clock=null}// bị dừng lâu (sự kiện) thì bắt đầu lại, không nhảy cóc
 }finally{OW.walking=false;OW.path=[];OW.cam=null;owPeekSync()}
 if(msg)addEntry('⚡ '+msg,'system');
 if(!S.dead){owDraw();owCardRender();const p=owPos();const m=owMarks().find(q=>q.loc===S.loc&&q.tx===p[0]&&q.ty===p[1]&&q.auto);if(m)owMarkGo(m.id);else if(goal&&p[0]===goal[0]&&p[1]===goal[1]&&path.length>0){const gn=owNodeAt(p[0],p[1]);if(gn&&gn.lv){const ov=document.getElementById('overlay');if(!(ov&&ov.classList.contains('show')))openTown(gn.id)}}render()}};

/* ---------- 2. bỏ "Tìm cơ duyên"; hái linh thảo, khai khoáng thành mini game ---------- */
const _ch=window.choose;
window.choose=function(title,desc,opts){try{if(Array.isArray(opts)&&opts.some(o=>/Tìm cơ duyên|Hái linh thảo|Khai khoáng/.test(String(o&&o.t)))){const t=Math.max(1,here().t);
  opts=opts.filter(o=>!/Tìm cơ duyên/.test(String(o.t))).map(o=>{const s=String(o.t);
   if(/Hái linh thảo/.test(s))return {t:'🌿 Hái linh thảo',desc:`Mini game nhổ rễ · linh thảo cấp ${t} · điểm càng cao càng nhiều, càng quý`,run:async()=>{await gatherGame('herb',t)}};
   if(/Khai khoáng/.test(s))return {t:'⛏ Khai khoáng',desc:`Mini game gõ mạch khoáng · khoáng thạch cấp ${t} · gõ trượt nhiều dễ sập hầm`,run:async()=>{await gatherGame('ore',t)}};
   return o})}}catch(e){console.error(e)}return _ch.call(this,title,desc,opts)};
const GCSS=`<style id="v7gcss">
.mg{user-select:none}.mg h2{margin-bottom:4px}.mg .mgsub{font-size:13px;opacity:.8;margin-bottom:8px}
.mgbar{position:relative;height:46px;border-radius:23px;background:linear-gradient(90deg,#d9cfb4,#efe6cf,#d9cfb4);border:2px solid #6b5a3e;overflow:hidden;margin:14px 0;cursor:pointer}
.mgzone{position:absolute;top:0;bottom:0;background:rgba(95,163,90,.55);border-left:2px solid #3f7a3a;border-right:2px solid #3f7a3a}
.mgperf{position:absolute;top:0;bottom:0;background:rgba(232,190,60,.85)}
.mgneedle{position:absolute;top:-4px;bottom:-4px;width:6px;margin-left:-3px;background:#8a1c1c;border-radius:3px;box-shadow:0 0 6px rgba(0,0,0,.4)}
.mgrow{display:flex;justify-content:space-between;align-items:center;font-size:14px}
.mgpts{display:flex;gap:4px}.mgpts i{width:14px;height:14px;border-radius:50%;background:#d8d0bd;border:1px solid #9a8a6a;display:inline-block}.mgpts i.g{background:#e8be3c}.mgpts i.h{background:#5fa35a}
.mgfb{height:22px;text-align:center;font-weight:700;margin:4px 0}
.mggrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:12px auto;max-width:330px}
.mgcell{aspect-ratio:1;border-radius:12px;background:radial-gradient(circle at 35% 30%,#a59a8a,#5d5448 70%);border:2px solid #3e3730;cursor:pointer;position:relative;transition:transform .08s}
.mgcell:active{transform:scale(.94)}
.mgcell.on{background:radial-gradient(circle at 40% 35%,#fff7c2,#e8be3c 30%,#8a6a2a 75%);box-shadow:0 0 18px #ffd56a}
.mgcell.bad{background:radial-gradient(circle,#c55,#5d2a2a 75%)}.mgcell.hit{background:radial-gradient(circle,#bff0a8,#3f7a3a 75%)}
.mgshake{animation:mgsh .3s}@keyframes mgsh{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.mgres{text-align:center;font-size:22px;font-weight:800;margin:10px 0}
</style>`;
function css(){if(!document.getElementById('v7gcss'))document.head.insertAdjacentHTML('beforeend',GCSS)}
const pts=(sc,n,cls)=>`<div class="mgpts">${Array.from({length:n},(_,i)=>`<i class="${i<sc.g?'g':i<sc.g+sc.h?'h':''}"></i>`).join('')}</div>`;
/* nhổ rễ linh thảo: 5 lượt, kim chạy qua lại, bấm đúng vùng xanh (1 điểm) hay vùng vàng (2 điểm) */
function herbGame(t){return new Promise(res=>{css();const tt=Math.max(1,t);const bonus=Math.max(-4,Math.min(8,(eff('thanthuc')-40)/8));
 const speed=.55+tt*.09;// lượt chạy hết thanh mỗi giây
 let round=0,score=0,g=0,h=0,pos=0,dir=1,zone=null,raf=0,last=0,lock=false;
 const newZone=()=>{const w=Math.max(9,24-tt*1.6-round*1.2+bonus);const c=12+Math.random()*(76-w);zone={a:c,b:c+w,pa:c+w*.36,pb:c+w*.64}};
 const draw=()=>{const m=document.getElementById('modal');if(!m)return;const nd=m.querySelector('.mgneedle');if(nd)nd.style.left=pos+'%'};
 const ui=fb=>{modal(`<div class="mg"><h2>🌿 Nhổ rễ linh thảo</h2><div class="mgsub">Linh thảo cấp ${tt}. Rễ cắm sâu, chỉ nhổ được khi linh khí trong rễ dâng lên. Bấm vào thanh (hoặc phím Space) khi kim nằm trong vùng <b style="color:#3f7a3a">xanh</b> (1 điểm), giữa vùng <b style="color:#b8913f">vàng</b> (2 điểm). Năm lượt, tối đa 10 điểm.</div>
  <div class="mgrow"><span>Lượt ${Math.min(round+1,5)}/5</span>${pts({g,h},5)}<span><b>${score}</b>/10 điểm</span></div>
  <div class="mgbar" id="mgbar"><div class="mgzone" style="left:${zone.a}%;width:${zone.b-zone.a}%"></div><div class="mgperf" style="left:${zone.pa}%;width:${zone.pb-zone.pa}%"></div><div class="mgneedle" style="left:${pos}%"></div></div>
  <div class="mgfb">${fb||''}</div><div class="btns"><button class="primary" id="mgbtn">🌿 Nhổ!</button></div></div>`,true);
  document.getElementById('mgbar').onclick=hit;document.getElementById('mgbtn').onclick=hit};
 const loop=now=>{if(!last)last=now;const dt=Math.min(50,now-last)/1000;last=now;pos+=dir*speed*100*dt*(1+round*.12);if(pos>=100){pos=100;dir=-1}if(pos<=0){pos=0;dir=1}draw();raf=requestAnimationFrame(loop)};
 const key=e=>{if(e.code==='Space'||e.key===' '){e.preventDefault();hit()}};
 function hit(){if(lock)return;lock=true;let fb;if(pos>=zone.pa&&pos<=zone.pb){score+=2;g++;fb='<span style="color:#b8913f">✨ Hoàn hảo! +2</span>'}else if(pos>=zone.a&&pos<=zone.b){score+=1;h++;fb='<span style="color:#3f7a3a">✔ Được +1</span>'}else{fb='<span style="color:#a33">✗ Rễ đứt</span>';const b=document.getElementById('mgbar');b&&b.classList.add('mgshake')}
  round++;if(round>=5){cancelAnimationFrame(raf);document.removeEventListener('keydown',key);ui(fb);setTimeout(()=>{closeModal();res(score)},700);return}
  setTimeout(()=>{newZone();ui(fb);lock=false},420)}
 newZone();ui('');document.addEventListener('keydown',key);raf=requestAnimationFrame(loop);
 const wd=setInterval(()=>{if(round>=5){clearInterval(wd);return}if(!document.querySelector('#modal .mg')||!document.querySelector('#overlay.show')){clearInterval(wd);round=5;cancelAnimationFrame(raf);document.removeEventListener('keydown',key);res(score)}},300)})}
/* gõ mạch khoáng: 10 lượt, mạch khoáng lóe sáng trong chốc lát, gõ trúng trước khi tắt */
function oreGame(t){return new Promise(res=>{css();const tt=Math.max(1,t);const bonus=(eff('the')-40)*3;
 const win=Math.max(420,1150-tt*65+bonus);let round=0,score=0,miss=0,cur=-1,tm=0,done=false;
 const ui=fb=>{modal(`<div class="mg"><h2>⛏ Gõ mạch khoáng</h2><div class="mgsub">Khoáng thạch cấp ${tt}. Mạch khoáng chỉ lóe sáng trong chốc lát: gõ trúng ô đang sáng trước khi tắt. Gõ nhầm vào đá trơ làm hầm rung; nhầm 3 lần là sập hầm. Mười lượt, tối đa 10 điểm.</div>
  <div class="mgrow"><span>Lượt ${Math.min(round+1,10)}/10</span><span>⚠ Gõ nhầm ${miss}/3</span><span><b>${score}</b>/10 điểm</span></div>
  <div class="mggrid" id="mggrid">${Array.from({length:9},(_,i)=>`<div class="mgcell" data-i="${i}"></div>`).join('')}</div><div class="mgfb" id="mgfb">${fb||''}</div></div>`,true);
  document.querySelectorAll('#mggrid .mgcell').forEach(c=>c.onclick=()=>tap(+c.dataset.i))};
 const fbk=(h)=>{const e=document.getElementById('mgfb');if(e)e.innerHTML=h};
 const next=()=>{if(done)return;if(round>=10||miss>=3){done=true;fbk(miss>=3?'<span style="color:#a33">💥 Hầm rung chuyển dữ dội!</span>':'');setTimeout(()=>{closeModal();res({score,collapse:miss>=3})},700);return}
  const cells=document.querySelectorAll('#mggrid .mgcell');cells.forEach(c=>c.className='mgcell');
  setTimeout(()=>{if(done)return;cur=rn(0,8);const c=document.querySelectorAll('#mggrid .mgcell')[cur];c&&c.classList.add('on');
   tm=setTimeout(()=>{if(cur<0)return;cur=-1;round++;fbk('<span style="color:#a33">Mạch khoáng tắt mất</span>');ui('<span style="color:#a33">Mạch khoáng tắt mất</span>');next()},win*(1-round*.025))},rn(350,800))};
 function tap(i){if(done)return;const cells=document.querySelectorAll('#mggrid .mgcell');
  if(cur>=0&&i===cur){clearTimeout(tm);cells[i].className='mgcell hit';cur=-1;score++;round++;setTimeout(()=>{ui('<span style="color:#3f7a3a">⛏ Trúng mạch! +1</span>');next()},180)}
  else{miss++;cells[i].classList.add('bad');const g=document.getElementById('mggrid');g&&g.classList.remove('mgshake');void (g&&g.offsetWidth);g&&g.classList.add('mgshake');fbk(`<span style="color:#a33">Gõ nhầm đá trơ (${miss}/3)</span>`);if(miss>=3){clearTimeout(tm);next()}}}
 ui('');next();
 const wd=setInterval(()=>{if(done){clearInterval(wd);return}if(!document.querySelector('#modal .mg')||!document.querySelector('#overlay.show')){clearInterval(wd);done=true;clearTimeout(tm);res({score,collapse:false})}},300)})}
async function gatherGame(kind,t){const herb=kind==='herb';let sc,collapse=false;
 if(herb)sc=await herbGame(t);else{const r=await oreGame(t);sc=r.score;collapse=r.collapse}
 passCa(rn(2,3));const ty=herb?'thao':'khoang';const pf=prof(herb?'dan':'khi').lv>=t?1:0;const L=[];
 if(sc<=3){addEntry(herb?`🌿 ${sc}/10 điểm: rễ đứt, linh khí tan hết, không hái được gì.`:`⛏ ${sc}/10 điểm: chỉ đào được đá vụn.`,'system danger')}
 else if(sc<=5){L.push(gainMat(ty,Math.max(1,t-1),1))}
 else if(sc<=7){L.push(gainMat(ty,t,1+(Math.random()<.5?1:0)+pf))}
 else if(sc<=9){L.push(gainMat(ty,t,2+(Math.random()<.5?1:0)+pf));if(Math.random()<.25)L.push(gainMat(ty,Math.min(9,t+1),1))}
 else{L.push(gainMat(ty,t,3+pf));L.push(gainMat(ty,Math.min(9,t+1),1));if(Math.random()<.2)L.push(gainMat(ty,Math.min(9,t+2),1))}
 if(L.length)addEntry(`${herb?'🌿':'⛏'} ${sc}/10 điểm${sc===10?' (hoàn hảo)':''}: ${herb?'hái':'đào'} được ${L.join(', ')}.`,'system');
 if(collapse||(!herb&&sc<=2)){const d=Math.ceil(S.hpMax*.15);hurt(d);addEntry(`💥 Hầm mỏ sập, bị đá đè: −${d} HP.`,'system danger')}}
window.v7Gather=gatherGame;

/* ---------- 3. chiến đấu kiểu Pokémon 2D ---------- */
const PCSS=`<style id="v7pcss">
#modal.cmodal{max-width:min(900px,97vw);padding:10px 12px}
#modal.cmodal .cstage{height:clamp(300px,52vh,430px);margin:0 0 8px;border:3px solid #3a2f22;border-radius:14px;background:#cfe3c0}
#modal.cmodal .cstage .cbg{position:absolute;inset:0;opacity:.9}
#modal.cmodal .cstage .cbg svg{width:100%;height:100%}
.pkplat{position:absolute;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,rgba(255,255,255,.55),rgba(120,100,70,.55) 60%,rgba(60,45,30,.4));box-shadow:0 6px 10px rgba(0,0,0,.25)}
.pkplat.foe{right:6%;top:40%;width:32%;height:13%}.pkplat.me{left:3%;bottom:4%;width:40%;height:14%}
#modal.cmodal .fighter{position:absolute;display:block;padding:0;background:none;border:0;width:auto;height:auto}
#modal.cmodal .fighter.cfoe{right:9%;top:6%;width:26%;height:44%;left:auto}
#modal.cmodal .fighter.cme{left:6%;bottom:9%;width:34%;height:54%;right:auto}
#modal.cmodal .fighter .cspr{position:absolute;bottom:0;left:50%;height:100%;width:auto;max-width:none;transform:translateX(-50%);image-rendering:auto;animation:pkbob 2.4s ease-in-out infinite}
#modal.cmodal .fighter.cme .cspr{transform:translateX(-50%) scaleX(-1);animation-name:pkbobm}
@keyframes pkbob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-4px)}}
@keyframes pkbobm{0%,100%{transform:translateX(-50%) scaleX(-1) translateY(0)}50%{transform:translateX(-50%) scaleX(-1) translateY(-4px)}}
#modal.cmodal .fighter .ctag{display:none}
.pkbox{position:absolute;background:#fbf6e6;border:3px solid #3a2f22;border-radius:12px 4px 12px 4px;padding:6px 10px 7px;min-width:min(270px,44%);box-shadow:3px 3px 0 rgba(0,0,0,.25);font-size:13px;z-index:3}
.pkbox.foe{left:3%;top:5%}.pkbox.me{right:3%;bottom:6%}
.pkbox .pkn{display:flex;justify-content:space-between;gap:8px;font-weight:800;font-size:15px}.pkbox .pkn small{font-weight:600;opacity:.75;font-size:12px}
.pkhp{display:flex;align-items:center;gap:6px;margin-top:4px}.pkhp b{font-size:11px;background:#3a2f22;color:#f7d26a;border-radius:4px;padding:0 4px}
.pkbar{flex:1;height:9px;border-radius:5px;background:#54493a;border:1px solid #3a2f22;overflow:hidden}.pkbar i{display:block;height:100%;background:#4fc35a;transition:width .6s ease,background .6s}
.pkbar.mid i{background:#e8c23c}.pkbar.low i{background:#e0503c}.pkbar.ll i{background:#5b8fd1}
.pknum{text-align:right;font-weight:700;font-size:13px;margin-top:2px}.pkst{font-size:11px;margin-top:2px}
.pkui{display:grid;grid-template-columns:1.25fr 1fr;gap:8px}
.pkmsg{background:#2f3e5a;color:#fff;border:3px solid #c9b26a;border-radius:10px;padding:10px 12px;min-height:92px;font-size:14px;line-height:1.45;overflow:auto;max-height:150px}
.pkmsg .small{color:#dfe6f2}.pkmsg .crit{color:#ffd56a}
.pkmenu{background:#fbf6e6;border:3px solid #3a2f22;border-radius:10px;padding:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px;align-content:start}
.pkmenu button{margin:0;text-align:left;font-weight:700;padding:9px 10px;border-radius:8px;font-size:14px;min-height:42px}
.pkmenu button .small{display:block;font-weight:500;font-size:11px;opacity:.8}
.pkmenu .pkback{grid-column:1/-1;text-align:center;font-weight:600;min-height:32px;padding:5px}
.pktype{display:inline-block;font-size:10px;font-weight:800;color:#fff;border-radius:4px;padding:0 5px;margin-right:4px;vertical-align:1px}
#modal.cmodal p.cinfo{font-size:11.5px;opacity:.85;margin:6px 2px 0}
.pkfx{position:absolute;pointer-events:none;z-index:5}
.pkball{width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;animation:pkfly var(--d,.45s) ease-in forwards}
@keyframes pkfly{from{left:var(--x0);top:var(--y0);transform:scale(.6)}to{left:var(--x1);top:var(--y1);transform:scale(1.15)}}
.pkburst{width:120px;height:120px;margin:-60px 0 0 -60px;border-radius:50%;animation:pkbu .45s ease-out forwards}
@keyframes pkbu{from{transform:scale(.2);opacity:1}to{transform:scale(1.5);opacity:0}}
.pkslash{width:120px;height:6px;margin:-3px 0 0 -60px;border-radius:3px;background:linear-gradient(90deg,transparent,#fff,transparent);box-shadow:0 0 10px var(--c,#fff);animation:pksl .32s ease-out forwards}
@keyframes pksl{from{transform:rotate(var(--r)) scaleX(.1);opacity:1}60%{transform:rotate(var(--r)) scaleX(1.1);opacity:1}to{transform:rotate(var(--r)) scaleX(1.2);opacity:0}}
.pkleaf{width:18px;height:10px;border-radius:0 100%;background:#5fa35a;animation:pkfly var(--d,.5s) ease-in forwards}
.pkrock{width:26px;height:22px;border-radius:40% 50% 35% 45%;background:#8a6f4a;border:2px solid #4e3d28;animation:pkfall .45s ease-in forwards}
@keyframes pkfall{from{left:var(--x1);top:-10%}to{left:var(--x1);top:var(--y1)}}
.pkbolt{width:60px;height:100%;top:0;margin-left:-30px;animation:pkfl .4s steps(2) forwards}
@keyframes pkfl{0%,50%{opacity:1}25%,75%{opacity:.2}100%{opacity:0}}
.pkflash{inset:0;background:#fff;animation:pkfa .25s forwards}@keyframes pkfa{from{opacity:.75}to{opacity:0}}
.pkdmg{font-weight:900;font-size:26px;color:#fff;-webkit-text-stroke:1.5px #8a1c1c;text-shadow:0 2px 0 #8a1c1c;animation:pkdm .9s ease-out forwards;margin-left:-20px}
.pkdmg.me{-webkit-text-stroke-color:#1f3a7a;text-shadow:0 2px 0 #1f3a7a}
@keyframes pkdm{from{transform:translateY(0) scale(.6);opacity:1}30%{transform:translateY(-18px) scale(1.15)}to{transform:translateY(-46px) scale(1);opacity:0}}
.pkbanner{left:50%;top:44%;transform:translate(-50%,-50%);background:rgba(30,25,18,.82);color:#ffe9a6;font-weight:900;font-size:20px;padding:6px 16px;border-radius:10px;border:2px solid #c9b26a;animation:pkbn 1.1s ease forwards;white-space:nowrap}
@keyframes pkbn{0%{opacity:0;transform:translate(-50%,-30%)}15%,75%{opacity:1;transform:translate(-50%,-50%)}100%{opacity:0}}
.pkhit{animation:pkblink .45s steps(2) 1}@keyframes pkblink{0%,50%{opacity:.15}25%,75%,100%{opacity:1}}
.pkshake{animation:pkshk .35s}@keyframes pkshk{0%,100%{transform:translate(0)}20%{transform:translate(-7px,3px)}40%{transform:translate(6px,-3px)}60%{transform:translate(-5px,2px)}80%{transform:translate(4px,-1px)}}
.pkdash{animation:pkda .3s ease-out}@keyframes pkda{50%{translate:28px -10px}}
.pkdashf{animation:pkdf .3s ease-out}@keyframes pkdf{50%{translate:-28px 10px}}
@media (max-width:620px){.pkui{grid-template-columns:1fr}.pkbox{min-width:52%;font-size:12px}#modal.cmodal .fighter.cfoe{width:34%}#modal.cmodal .fighter.cme{width:42%}}
</style>`;
const HECOL={Kim:'#c9b26a',Mộc:'#4f9a4a',Thủy:'#3f7fc9',Hỏa:'#d9583b',Thổ:'#a07a45',Lôi:'#8a5cd6',Phong:'#5fb3a6',Ám:'#4a3f5a'};
const tb=he=>`<span class="pktype" style="background:${HECOL[he]||'#777'}">${esc(he||'?')}</span>`;
function barCls(v,m){const r=v/m;return r>.5?'':r>.2?'mid':'low'}
function pkBox(side,name,sub,hp,hpm,extra){return `<div class="pkbox ${side}"><div class="pkn"><span>${name}</span><small>${sub}</small></div><div class="pkhp"><b>HP</b><div class="pkbar ${barCls(hp,hpm)} ${side}hp"><i style="width:${Math.max(0,Math.min(100,hp/hpm*100))}%"></i></div></div>${side==='me'?`<div class="pknum"><span class="mehpn">${Math.max(0,Math.round(hp))}</span>/${hpm}</div>`:''}${extra||''}</div>`}
let MENU='main';
const _rc=window.renderCombat;
window.renderCombat=function(msg){const r=_rc.apply(this,arguments);try{if(!document.getElementById('v7pcss'))document.head.insertAdjacentHTML('beforeend',PCSS);pkLayout()}catch(e){console.error(e)}return r};
function pkLayout(){const st=document.querySelector('#modal .cstage');if(!st||!C||!C.e)return;const e=C.e;
 st.querySelectorAll('.pkbox,.pkplat').forEach(x=>x.remove());
 {const bg=st.querySelector('.cbg');const h='<div class="pkplat foe"></div><div class="pkplat me"></div>';if(bg)bg.insertAdjacentHTML('afterend',h);else st.insertAdjacentHTML('afterbegin',h)}
 const est=(e.bound?'⛓ bị trói ':'')+(e.burn?'🔥 bỏng ':'')+(e.stun?'💫 choáng':'');
 st.insertAdjacentHTML('beforeend',pkBox('foe',esc(e.name)+(e.boss?' ☠':''),`${REALMS[e.realm].name}${e.tier?' · '+TIER_N[e.tier]:''}`,e.hp,e.hpMax,`<div class="pkst">${tb(e.he)}${est}</div>`)+
  pkBox('me',esc(S.name),tierName(),S.hp,S.hpMax,`<div class="pkhp"><b style="background:#1f3a7a;color:#cfe0ff">LL</b><div class="pkbar ll"><i style="width:${Math.max(0,Math.min(100,S.ll/S.llMax*100))}%"></i></div></div><div class="pkst">${tb(S.he)} ${esc(S.linhCan&&S.linhCan.name||'')}</div>`));
 // bảng lệnh
 const B=document.querySelector('#modal .btns');const cm=document.getElementById('cmsg');if(!B||!cm||B.dataset.pk)return;B.dataset.pk=1;
 const all=[...B.querySelectorAll('button')];const of=b=>b.getAttribute('onclick')||'';
 const moves=all.filter(b=>/'atk'|'sk'|'weak'|'def'|pbUse/.test(of(b))),bag=all.filter(b=>/'item'/.test(of(b))),flee=all.find(b=>/'flee'/.test(of(b))),talk=all.find(b=>/'talk'/.test(of(b)));
 const sks=[S.eq.vo[0],S.eq.vo[1],S.eq.tuyet];
 for(const b of moves){const o=of(b);let he=null;const m=o.match(/'sk',(\d)/);if(m){const k=sks[+m[1]];he=k&&(k.he||S.he)}
  if(/'atk'/.test(o))b.innerHTML=`${tb('Kim').replace('Kim','Thường')} Đánh thường<span class="small">không tốn linh lực</span>`;
  else if(he)b.innerHTML=b.innerHTML.replace(/^✨\s*/,tb(he));
  else if(/'weak'/.test(o))b.innerHTML=b.innerHTML.replace(/^🎯\s*/,'🎯 ');}
 const ui=document.createElement('div');ui.className='pkui';const msgBox=document.createElement('div');msgBox.className='pkmsg';msgBox.appendChild(cm);
 const menu=document.createElement('div');menu.className='pkmenu';ui.appendChild(msgBox);ui.appendChild(menu);B.replaceWith(ui);
 const mk=(t,f,dis)=>{const b=document.createElement('button');b.innerHTML=t;if(dis)b.disabled=true;b.onclick=f;return b};
 const show=w=>{MENU=w;menu.innerHTML='';if(w==='main'){menu.append(mk('⚔ Chiến đấu<span class="small">chiêu thức</span>',()=>show('fight')),mk(`🎒 Túi đồ<span class="small">${bag.length} món dùng được</span>`,()=>show('bag'),!bag.length),talk||mk('🗣 Thuyết phục',()=>{},true),flee||mk('🏃 Thoát',()=>{},true))}
  else{const L=w==='fight'?moves:bag;L.forEach(b=>menu.append(b));menu.append(mk('↩ Quay lại',()=>show('main')));menu.lastChild.className='pkback'}};
 if(talk)talk.innerHTML=talk.innerHTML.replace(/^🗣\s*/,'🗣 ');if(window.__pkC!==C){window.__pkC=C;MENU='main'}show(MENU==='bag'&&!bag.length?'main':MENU)}
/* hiệu ứng */
function stage(){return document.querySelector('#modal .cstage')}
function ctr(sel){const st=stage(),el=st&&st.querySelector(sel+' .cspr');if(!st||!el)return null;const a=st.getBoundingClientRect(),b=el.getBoundingClientRect();return {x:b.left-a.left+b.width/2,y:b.top-a.top+b.height*.5,w:a.width,h:a.height}}
function fx(cls,style,ms){const st=stage();if(!st)return null;const d=document.createElement('div');d.className='pkfx '+cls;d.setAttribute('style',style||'');st.appendChild(d);setTimeout(()=>d.remove(),ms||900);return d}
async function pkAttack(fromMe,he,kind){const A=ctr(fromMe?'.cme':'.cfoe'),Bp=ctr(fromMe?'.cfoe':'.cme');if(!A||!Bp)return;const c=HECOL[he]||'#fff';
 const sp=document.querySelector(fromMe?'#modal .cme':'#modal .cfoe');if(sp){sp.classList.remove('pkdash','pkdashf');void sp.offsetWidth;sp.classList.add(fromMe?'pkdash':'pkdashf')}
 const v=`--x0:${A.x}px;--y0:${A.y}px;--x1:${Bp.x}px;--y1:${Bp.y}px;`;
 if(kind==='atk'||kind==='claw'){await sleep2(140);for(let i=0;i<3;i++)fx('pkslash',`left:${Bp.x+(i-1)*14}px;top:${Bp.y+(i-1)*16}px;--r:${kind==='claw'?60:-35}deg;--c:${kind==='claw'?'#ff8a6a':'#fff'}`,400);await sleep2(220);return}
 if(he==='Lôi'){(fx('pkbolt',`left:${Bp.x}px`,450)||{}).innerHTML=`<svg viewBox="0 0 60 300" preserveAspectRatio="none" style="width:100%;height:100%"><polyline points="34,0 18,110 38,120 14,220 40,230 26,300" fill="none" stroke="#e6d4ff" stroke-width="6"/><polyline points="34,0 18,110 38,120 14,220 40,230 26,300" fill="none" stroke="${c}" stroke-width="2"/></svg>`;fx('pkflash','',260);await sleep2(380);return}
 if(he==='Thổ'){for(let i=0;i<4;i++)setTimeout(()=>fx('pkrock',`--x1:${Bp.x+rn(-30,30)}px;--y1:${Bp.y+rn(-10,20)}px`,500),i*70);await sleep2(520);return}
 if(he==='Mộc'){for(let i=0;i<6;i++)setTimeout(()=>fx('pkleaf',`--x0:${A.x}px;--y0:${A.y+rn(-20,20)}px;--x1:${Bp.x+rn(-24,24)}px;--y1:${Bp.y+rn(-24,24)}px;--d:.45s`,520),i*50);await sleep2(560);return}
 if(he==='Kim'){await sleep2(80);for(let i=0;i<4;i++)setTimeout(()=>fx('pkslash',`left:${Bp.x}px;top:${Bp.y+(i-1.5)*12}px;--r:${[-30,30,-60,0][i]}deg;--c:#f7e9a8`,380),i*60);await sleep2(420);return}
 const g=he==='Hỏa'?'radial-gradient(circle,#fff6c2,#ffb347 35%,#d9583b 70%,transparent 72%)':he==='Thủy'?'radial-gradient(circle,#e6f6ff,#7fc4f0 40%,#3f7fc9 70%,transparent 72%)':he==='Phong'?'radial-gradient(circle,#f0fffb,#9fe0d4 45%,transparent 72%)':`radial-gradient(circle,#fff,${c} 45%,transparent 72%)`;
 fx('pkball',v+`background:${g};--d:.42s`,480);await sleep2(420);fx('pkburst',`left:${Bp.x}px;top:${Bp.y}px;background:radial-gradient(circle,${c}cc,transparent 65%)`,480);await sleep2(120)}
function pkDmg(onMe,v){const P=ctr(onMe?'.cme':'.cfoe');if(!P||!v)return;{const d=fx('pkdmg'+(onMe?' me':''),`left:${P.x}px;top:${P.y-30}px`,950);if(d)d.textContent='-'+v}const sp=document.querySelector(onMe?'#modal .cme .cspr':'#modal .cfoe .cspr');if(sp){sp.classList.remove('pkhit');void sp.offsetWidth;sp.classList.add('pkhit')}const st=stage();if(st){st.classList.remove('pkshake');void st.offsetWidth;st.classList.add('pkshake')}}
function pkBanner(t){const d=fx('pkbanner','',1150);if(d)d.textContent=t}
function setBar(sel,v,m){const b=document.querySelector('#modal '+sel);if(!b)return;b.className=b.className.replace(/\b(mid|low)\b/g,'').trim()+' '+barCls(v,m);const i=b.querySelector('i');if(i)i.style.width=Math.max(0,Math.min(100,v/m*100))+'%'}
window.cSkillFx=function(){};// thay bằng hiệu ứng mới
const _ca=window.combatAct;
window.combatAct=async function(a,arg){if(!C||C.done||C._busy)return _ca.apply(this,arguments);const e=C.e;const eh=e.hp,ph=S.hp;
 let he=null,M=null;if(a==='sk'){M=[S.eq.vo[0],S.eq.vo[1],S.eq.tuyet][arg];he=M&&(M.he||S.he)}
 const atk=['atk','sk','weak'].includes(a);
 if(atk){if(window.__fx)try{await window.__fx.player(a==='sk'?'sk':'atk',M,he||S.he||'Kim')}catch(er){console.error(er);await pkAttack(true,he||'Kim',a==='sk'?'skill':'atk')}else await pkAttack(true,he||'Kim',a==='sk'?'skill':'atk')}
 else if(window.__fx&&['def','item','flee','pbUse'].includes(a))try{window.__fx.misc(a==='pbUse'?'item':a,arg)}catch(er){}
 await _ca.apply(this,arguments);
 try{if(!document.querySelector('#modal .cstage'))return;
  const ehp=C&&C.e?C.e.hp:e.hp;
  // dựng lại trình tự: thanh máu về giá trị cũ rồi tụt dần
  setBar('.foehp',eh,e.hpMax);setBar('.mehp',ph,S.hpMax);const n=document.querySelector('#modal .mehpn');if(n)n.textContent=Math.max(0,Math.round(ph));
  await sleep2(30);
  if(ehp<eh){setBar('.foehp',ehp,e.hpMax);pkDmg(false,Math.round(eh-ehp));const msg=(document.getElementById('cmsg')||{}).innerHTML||'';
   if(/Bạo kích|crit/.test(msg))pkBanner('Chí mạng!');else if(he&&KHAC[he]===e.he)pkBanner('Hiệu quả rất lớn!');else if(he&&KHAC[e.he]===he)pkBanner('Không hiệu quả lắm…');await sleep2(650)}
  else if(atk){pkBanner('Trượt rồi!');await sleep2(500)}
  if(S.hp<ph&&ehp>0){if(window.__fx)try{await window.__fx.enemy(e)}catch(er){await pkAttack(false,e.he,e.kind==='beast'?'claw':'skill')}else await pkAttack(false,e.he,e.kind==='beast'?'claw':'skill');setBar('.mehp',S.hp,S.hpMax);if(n)n.textContent=Math.max(0,Math.round(S.hp));pkDmg(true,Math.round(ph-S.hp));if(KHAC[e.he]===S.he)setTimeout(()=>pkBanner('Đòn khắc chế!'),100)}
  else{setBar('.mehp',S.hp,S.hpMax);if(n)n.textContent=Math.max(0,Math.round(S.hp))}}catch(err){console.error(err)}};

try{PATCH_NOTES.unshift(['v7.7 · 07/11/2026 · Đi mượt, hái thuốc đào khoáng, chiến đấu kiểu Pokémon',[
 '<b>Sửa giật khi đi đường dài</b>: trước đây mỗi ô đi xong mới bắt đầu ô sau, tạo khựng ở mọi ranh giới ô và đôi khi giật lùi. Giờ cả quãng đường dùng một đồng hồ chung nên trượt liền mạch; tốc độ giữa các loại địa hình cũng đều hơn.',
 '<b>Bỏ "Tìm cơ duyên"</b> khỏi vùng hoang dã. Cơ duyên chỉ đến từ manh mối, tin tức và tranh đoạt.',
 '<b>Hái linh thảo là mini game nhổ rễ</b>: 5 lượt, bấm khi kim ở vùng xanh (1 điểm) hay vùng vàng (2 điểm), tối đa 10 điểm. Thần thức cao thì vùng rộng hơn, linh thảo cấp cao thì kim chạy nhanh hơn. 0–3 điểm: không được gì; 4–5: 1 cây cấp thấp; 6–7: 1–2 cây đúng cấp; 8–9: 2–3 cây, có thể thêm cây cao cấp; 10: 3 cây + chắc chắn 1 cây cao cấp.',
 '<b>Khai khoáng là mini game gõ mạch khoáng</b>: 10 lượt, gõ trúng ô sáng trước khi tắt. Gõ nhầm 3 lần là sập hầm, bị thương. Thể phách cao thì có thêm thời gian; khoáng cấp cao thì mạch tắt nhanh hơn. Thang thưởng giống hái linh thảo.',
 '<b>Chiến đấu kiểu Pokémon 2D</b>: địch ở góc trên bên phải, ngươi ở góc dưới bên trái, đứng trên bệ đất; khung tên kèm cảnh giới, thanh HP xanh, vàng, đỏ tụt dần; khung lời dẫn và bảng lệnh Chiến đấu / Túi đồ / Thuyết phục / Thoát; chiêu thức ghi hệ ngũ hành và linh lực tiêu hao (như PP). Mỗi hệ một hiệu ứng: Hỏa cầu lửa, Thủy cầu nước, Mộc lá bay, Kim kiếm quang, Thổ đá rơi, Lôi sét đánh. Có số sát thương bay lên, rung màn, "Hiệu quả rất lớn!" khi khắc chế, "Không hiệu quả lắm…" khi bị khắc, "Chí mạng!".']])}catch(e){}
})();
