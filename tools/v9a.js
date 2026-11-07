/* ===== v9.0 · Giao diện kiểu Quỷ Cốc: cuộn trục tạo nhân vật, hội thoại có chân dung, chuyển động 2.5D ===== */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const D=window.DOLL;
// ---------- CSS ----------
const css=document.createElement('style');css.textContent=`
/* --- hình nhân vật nhiều lớp (2.5D) --- */
.par{--px:0;--py:0}
.fig{position:relative;height:100%;aspect-ratio:896/1200;margin:0 auto;transform-origin:50% 100%;animation:figbreath 5.5s ease-in-out infinite}
.fig img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;user-select:none;will-change:transform}
.fig .ly-b{transform:translate(calc(var(--px)*-22px),calc(var(--py)*-8px)) scale(1.04)}
.fig .ly-m{transform:translate(calc(var(--px)*7px),calc(var(--py)*3px))}
.fig .ly-f{transform:translate(calc(var(--px)*24px),calc(var(--py)*9px))}
.fig.one img{transform:translate(calc(var(--px)*8px),calc(var(--py)*3px))}
@keyframes figbreath{0%,100%{transform:scale(1,1)}50%{transform:scale(1.006,1.014)}}
@media (prefers-reduced-motion:reduce){.fig{animation:none}}
/* --- màn tạo nhân vật: cuộn trục --- */
#overlay:has(#modal.crmodal){padding:0;background:#cfc6ae;align-items:stretch;justify-content:stretch}
#overlay #modal.crmodal{max-width:none!important;width:100%!important;height:100%;max-height:none;border-radius:0;border:0;padding:0;box-shadow:none;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,#f3eee2 0%,#e6dfcd 60%,#d6cdb4 100%)}
#modal.crmodal::before{content:"";position:absolute;inset:0;background:url(doll/map_ink.webp) center/cover;opacity:.55;pointer-events:none;mix-blend-mode:multiply}
.cs,.crwrap.cs{position:relative;height:100%;display:flex!important;flex-direction:column;grid-template-columns:none!important;gap:0!important;color:#2b2117;z-index:1;padding:0;margin:0}
.cs-rod{position:absolute;top:0;bottom:0;width:58px;z-index:3;background:repeating-linear-gradient(90deg,#46463a 0 3px,#55563f 3px 6px),linear-gradient(90deg,#2a2a22,#5d5e45 50%,#2a2a22);box-shadow:inset 0 0 0 2px #222218,0 0 22px rgba(0,0,0,.45);background-blend-mode:multiply}
.cs-rod.l{left:0}.cs-rod.r{right:0}
.cs-rod::before,.cs-rod::after{content:"";position:absolute;left:-8px;right:-8px;height:54px;background:linear-gradient(90deg,#1d2024,#4c525b 45%,#1d2024);border-radius:6px;box-shadow:0 3px 8px rgba(0,0,0,.5),inset 0 2px 0 rgba(255,255,255,.18)}
.cs-rod::before{top:-6px}.cs-rod::after{bottom:-6px}
.cs-in{position:relative;flex:1;min-height:0;margin:0 70px;display:grid;grid-template-columns:minmax(300px,1fr) minmax(380px,1.05fr);grid-template-rows:minmax(0,1fr) auto auto;gap:6px 22px;padding:14px 0 8px}
.cs-stage{position:relative;grid-row:1;min-height:0;display:flex;flex-direction:column}
.cs-figbox{position:relative;flex:1;min-height:0;display:flex;justify-content:center;-webkit-mask-image:linear-gradient(#000 80%,transparent 100%);mask-image:linear-gradient(#000 80%,transparent 100%)}
.cs-figbox .fig{height:100%}
.cs-cloud{position:absolute;inset:6% 0 8%;background:radial-gradient(ellipse at 50% 55%,rgba(255,255,255,.6),transparent 62%);pointer-events:none}
.cs-id{display:flex;flex-wrap:wrap;align-items:flex-end;gap:6px 12px;margin:0 0 8px}.cs-id>div{flex:1 1 120px}
.cs-id input,.cs-id select{width:100%;box-sizing:border-box;background:rgba(251,246,234,.82);border:1px solid #bda977;border-radius:8px;padding:6px 9px;font:600 14px/1.2 inherit;color:#2b2117}
.cs-id label{font-size:11px;opacity:.7;margin:0}
.cs-al{display:flex;gap:4px;flex-wrap:wrap}.cs-al .mini{padding:3px 8px;font-size:12px}
.cs-alt{font-size:11px;line-height:1.35;opacity:.75;flex-basis:100%}
.cs-look{flex:none;background:rgba(251,246,234,.78);border:1px solid #bda977;border-radius:10px;padding:6px 10px;margin-top:4px}
.cs-look b{font-size:12px}
.cs-look .dollbox{margin:0;padding:0;border:0;background:none;display:grid;grid-template-columns:repeat(3,1fr);gap:0 12px}
.cs-look .dollbox>b{display:none}.cs-look .dlr{margin:1px 0;font-size:11.5px;gap:2px}.cs-look .dll{flex:0 0 auto;font-size:10.5px}.cs-look .dlr{min-width:0}.cs-look .dln{min-width:0;font-size:11.5px;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cs-look .dollbox .dlr:last-child{grid-column:1/-1;justify-content:center}
.cs-arr{display:flex;justify-content:center;gap:10px;margin-top:4px}
.cs-right{grid-row:1;min-height:0;overflow-y:auto;padding:0 4px 4px 0;scrollbar-width:thin}
.cs-h{display:flex;align-items:baseline;gap:12px;margin:2px 0 8px}
.cs-h b{font:700 17px/1 "Noto Serif","Songti SC",serif;padding:5px 16px 6px;background:linear-gradient(180deg,#f4d77d,#d6a944);border:1px solid #8b6a1c;border-radius:14px 3px 14px 3px;box-shadow:0 2px 0 #8b6a1c33;color:#3a2a05}
.cs-h span{font-size:12px;opacity:.75}
.cs-note{font-size:12px;line-height:1.45;background:rgba(251,246,234,.7);border:1px solid #c9b98d;border-radius:8px;padding:6px 10px;margin:0 0 8px}
.cs-note .cap6{margin-top:3px}
.cs-grp{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-bottom:10px}
.cs-gt{grid-column:1/-1;display:flex;align-items:center;gap:8px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;opacity:.8;margin-top:2px}
.cs-gt:after{content:"";flex:1;border-top:1px dashed #a8956a}
.cs-gt .mini{padding:2px 8px;font-size:11px}
.cs-tag,.cs-tag i,.cs-tag b,.cs-tag em{color:#fff!important}.cs-tag.gr6,.cs-tag.gr6 i,.cs-tag.gr6 b,.cs-tag.gr6 em{color:#ffe08a!important}.cs-tag{position:relative;text-align:center;border:2px solid #d4ac4a;outline:1px solid #3a2a0a;outline-offset:-4px;border-radius:3px;padding:7px 8px 8px;color:#fff;cursor:pointer;display:flex;flex-direction:column;gap:1px;min-height:50px;justify-content:center;box-shadow:0 2px 0 rgba(0,0,0,.25),inset 0 0 14px rgba(0,0,0,.22);background:linear-gradient(180deg,var(--c1),var(--c2));font-family:inherit;transition:transform .12s,filter .12s}
.cs-tag:hover{transform:translateY(-1px);filter:brightness(1.1)}
.cs-tag i{font-style:normal;font-size:10px;opacity:.82;letter-spacing:.05em;text-transform:uppercase}
.cs-tag b{font:700 14px/1.15 "Noto Serif","Songti SC",serif;text-shadow:0 1px 2px rgba(0,0,0,.55)}
.cs-tag em{font-style:normal;font-size:10px;opacity:.9}
.cs-tag.on{box-shadow:0 0 0 3px #1b1b1b,0 0 0 5px #f4d77d,0 0 16px rgba(244,215,125,.7);transform:translateY(-2px)}
.cs-tag.gr0{--c1:#7d8b74;--c2:#55634f}.cs-tag.gr1{--c1:#4aa266;--c2:#2d7646}.cs-tag.gr2{--c1:#4a86d9;--c2:#2a559c}.cs-tag.gr3{--c1:#8a5fd0;--c2:#5b3a9a}.cs-tag.gr4{--c1:#e8923a;--c2:#b4601a}.cs-tag.gr5{--c1:#d95a4a;--c2:#9a2b22}.cs-tag.gr6{--c1:#2a2a34;--c2:#0e0e14;color:#ffe08a}
.cs-desc{background:rgba(251,246,234,.9);border:1px solid #bda977;border-radius:10px;padding:10px 14px;margin:0 0 10px;min-height:92px;box-shadow:0 2px 10px rgba(60,40,10,.12)}
.cs-dh{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px}.cs-dh b{font:700 16px "Noto Serif",serif}.cs-dh .mini{margin-left:auto}
.cs-dt{font-size:13px;line-height:1.5}.cs-dt .small{font-size:13px;opacity:1}
.cs-strip{grid-column:1/-1;grid-row:2;display:grid;grid-template-columns:1fr 1fr 1.6fr;gap:10px;max-height:24vh;min-height:0}
.cs-col{background:rgba(251,246,234,.7);border:1px solid #c9b98d;border-radius:10px;padding:6px 10px 8px;overflow-y:auto;scrollbar-width:thin}
.cs-col h4{margin:0 0 4px;font:700 12px "Noto Serif",serif;letter-spacing:.12em;text-align:center;color:#fff;background:#1f1d1a;border-radius:2px 10px 2px 10px;padding:2px 10px}
.cs-col .crstats{display:grid;grid-template-columns:1fr 1fr;gap:1px 14px;border:0;background:none;padding:0}
.cs-col .crs{display:flex;justify-content:space-between;font-size:12.5px;padding:2px 0;border-bottom:1px dotted #c9b98d;background:none}
.cs-col .gchips{display:flex;flex-wrap:wrap;gap:4px}.cs-col .small{font-size:11.5px}
.cs-col #v7qt{margin-top:6px}
.cs-bar{grid-column:1/-1;grid-row:3;display:flex;align-items:center;gap:12px;justify-content:flex-end;padding:2px 0 0}
.cs-bar .cs-rc{margin-right:auto;font-size:12px;opacity:.8}
.cs-bar .crbtns{display:flex;gap:10px;margin:0}
.cs-bar .crb2{background:rgba(251,246,234,.9);border:1px solid #8b6a1c;border-radius:6px;padding:8px 16px;font:600 14px inherit;cursor:pointer;color:#3a2a05}
.cs-bar .crb1{background:linear-gradient(180deg,#f4d77d,#d6a944);border:2px solid #7a5a12;outline:1px solid #3a2a0a;outline-offset:-4px;border-radius:3px;padding:9px 26px;font:700 16px "Noto Serif",serif;cursor:pointer;color:#3a2a05;box-shadow:0 3px 0 #6e5210}
.cs-bar .crb1:hover{filter:brightness(1.08)}
.cs-extra .crsec{display:none}
@media (max-width:900px){
 .cs-rod{width:16px}.cs-rod::before,.cs-rod::after{height:26px;left:-3px;right:-3px}
 #overlay #modal.crmodal{overflow-y:auto}.crwrap.cs{height:auto!important;min-height:100%}
 .cs-in{margin:0 20px;display:flex;flex-direction:column;gap:10px;padding:10px 0 20px;flex:none}
 .cs-stage{height:min(56vh,470px);flex:none}
 .cs-right{overflow:visible}.cs-grp{grid-template-columns:repeat(2,1fr)}
 .cs-strip{grid-template-columns:1fr;max-height:none}
 .cs-bar{position:sticky;bottom:0;background:linear-gradient(transparent,rgba(214,205,180,.95) 30%);padding:18px 0 10px;z-index:4}
 .cs-bar .cs-rc{display:none}.cs-bar{justify-content:space-between}
 .cs-look .dollbox{grid-template-columns:1fr 1fr}
}
/* --- màn hội thoại có chân dung --- */
#overlay:has(#modal.vnmodal){padding:0;background:rgba(14,12,10,.62);backdrop-filter:blur(3px);align-items:stretch;justify-content:stretch}
#overlay #modal.vnmodal{max-width:none!important;width:100%!important;height:100%;max-height:none;border-radius:0;border:0;padding:0;background:transparent;box-shadow:none;overflow:hidden;color:#2b2117}
.vn{position:relative;height:100%;display:flex;flex-direction:column;max-width:1180px;margin:0 auto}
.vn-x{position:absolute;right:12px;top:10px;z-index:9;width:38px;height:38px;border-radius:50%;border:2px solid #d6a944;background:rgba(20,18,14,.8);color:#f4d77d;font-size:18px;cursor:pointer}
.vn-stage{position:relative;flex:1;min-height:200px;display:flex;justify-content:space-between;align-items:flex-end;padding:0 4%}
.vn-side{position:relative;height:100%;flex:0 0 38%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center}
.vn-side .vn-fig{flex:1;min-height:0;width:100%;display:flex;justify-content:center;padding-top:10px}
.vn-side.me .vn-fig{filter:brightness(.62) saturate(.8)}
.vn-side.me.on .vn-fig{filter:none}
.vn-side.npc .fig{filter:drop-shadow(0 8px 18px rgba(0,0,0,.55))}
.vn-plate{position:relative;z-index:3;margin:0 0 -16px;padding:5px 26px 6px;font:600 17px/1.1 "Noto Serif",serif;color:#f7f1df;background:linear-gradient(90deg,transparent,#111 12%,#111 88%,transparent);text-shadow:0 1px 2px #000;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.vn-plate small{font-size:11px;opacity:.72;margin-left:8px}
.vn-box{position:relative;z-index:2;background:linear-gradient(#e8e2d1,#d9d1bb);border:3px double #6a5a3a;border-radius:3px;margin:0 3%;padding:24px 28px 14px;min-height:78px;font-size:16px;line-height:1.6;box-shadow:0 6px 24px rgba(0,0,0,.55)}
.vn-box .vn-l{margin:0 0 4px}.vn-box .vn-l.sys{color:#5b3a12;font-size:14.5px}
.vn-box .vn-l:last-child{margin-bottom:0}
.vn-box em{font-style:normal;color:#b3261e;font-weight:600}
.vn-opts{margin:8px 3% 12px;background:linear-gradient(#e8e2d1,#d9d1bb);border:3px double #6a5a3a;border-radius:3px;padding:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px;max-height:36vh;overflow-y:auto;box-shadow:0 6px 24px rgba(0,0,0,.45)}
.vn-opts .choice{margin:0;text-align:left;border:1px solid #6a5a3a;border-radius:2px;background:linear-gradient(#f3eddb,#e2d9bf);padding:8px 12px;cursor:pointer;display:block;width:100%;box-shadow:none;color:#2b2117}
.vn-opts .choice:hover:not([disabled]){background:linear-gradient(#fff6d6,#f1dfa2);border-color:#9a6b12}
.vn-opts .choice b{font-size:14.5px}.vn-opts .choice small{display:block;font-size:11.5px;opacity:.72;margin-top:1px}
.vn-opts .choice[disabled],.vn-opts .choice.locked{opacity:.5;cursor:not-allowed}
.vn-info{grid-column:1/-1;justify-self:end;background:#1f1d1a;color:#f4d77d;border:1px solid #d6a944;border-radius:3px;padding:5px 16px;font:600 13px inherit;cursor:pointer}
.vn-detail{position:absolute;inset:44px 3% 10px;z-index:8;background:var(--paper,#fbf6ea);border:3px double #6a5a3a;border-radius:4px;padding:18px 22px;overflow-y:auto;display:none;box-shadow:0 10px 40px rgba(0,0,0,.6)}
.vn.det .vn-detail{display:block}
.vn-detail .vn-back{position:sticky;top:-6px;float:right;z-index:2}
.vn-hud{position:absolute;left:12px;top:10px;z-index:9;color:#f4d77d;font:600 13px "Noto Serif",serif;text-shadow:0 1px 3px #000}
@media (max-width:760px){
 .vn-stage{padding:0 1%;min-height:34vh}.vn-side{flex-basis:50%}.vn-plate{font-size:14px;padding:4px 14px 5px}.vn-plate small{display:none}
 .vn-box{margin:0 8px;padding:16px 14px 12px;font-size:14.5px}.vn-opts{margin:6px 8px 8px;grid-template-columns:1fr;max-height:42vh}
 .vn-detail{inset:44px 6px 6px;padding:14px}
}
`;document.head.appendChild(css);

// ---------- chuyển động 2.5D theo con trỏ / tự đung đưa ----------
(function(){let tx=0,ty=0,cx=0,cy=0,last=0,ptr=false,t0=performance.now();
 addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;ptr=true;last=performance.now();tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2},{passive:true});
 function loop(now){const els=document.getElementsByClassName('par');
  if(els.length){if(!ptr||now-last>3500){const t=(now-t0)/1000;tx=Math.sin(t*.5)*.55;ty=Math.sin(t*.37)*.25}
   cx+=(tx-cx)*.07;cy+=(ty-cy)*.07;for(const e of els){e.style.setProperty('--px',cx.toFixed(3));e.style.setProperty('--py',cy.toFixed(3))}}
  requestAnimationFrame(loop)}
 requestAnimationFrame(loop)})();

// ---------- hình nhiều lớp từ bộ ghép ----------
const fxMemo=new Map();
function fxUrl(M,it){if(!it||!D.img[it.file])return '';const k=it.file;if(fxMemo.has(k))return fxMemo.get(k);const c=document.createElement('canvas');c.width=M.W;c.height=M.H;c.getContext('2d').drawImage(D.img[it.file],it.x,it.y);const u=c.toDataURL('image/webp',.85);fxMemo.set(k,u);return u}
function layersOfLook(L){if(!D||!D.ready||!L||!D.man[L.pose])return null;const M=D.man[L.pose];const it=(k,id)=>id?M.items.find(i=>i.kind===k&&i.id===id):null;
 return {W:M.W,H:M.H,back:fxUrl(M,it('fxb',L.fxb)),front:fxUrl(M,it('fxf',L.fxf)),body:D.url({...L,fxb:'',fxf:''},'full')}}
// src: dữ liệu ảnh 'full' (từ D.fulls) hoặc ảnh thường; trả về HTML hình
function figHtml(src,look){let ly=null;try{const L=look||(src&&D&&D.fulls&&D.fulls.get(src));ly=layersOfLook(L)}catch(e){console.warn(e)}
 if(ly&&ly.body)return `<div class="fig">${ly.back?`<img class="ly-b" src="${ly.back}" alt="">`:''}<img class="ly-m" src="${ly.body}" alt="">${ly.front?`<img class="ly-f" src="${ly.front}" alt="">`:''}</div>`;
 return `<div class="fig one"><img src="${src||''}" alt=""></div>`}
window.v9Fig=figHtml;

// ---------- MÀN TẠO NHÂN VẬT ----------
window.__csSel=window.__csSel||'Xuất thân';
function csBuild(){
 const m=$('#modal');if(!m||!m.classList.contains('crmodal'))return;const w=$('.crwrap',m);if(!w||w.classList.contains('cs'))return;
 const left=$('.crleft',w),right=$('.crright',w);if(!left||!right)return;
 const nameI=$('#cName',w),genS=$('#cGender',w);
 const alignBox=[...left.children].find(c=>c.classList.contains('crbox')&&!c.classList.contains('dollbox'));
 const dollbox=$('.dollbox',w),ovalImg=$('.croval img',w),arrows=$$('.croval .crar',w);
 const rows=$$('.crrow',w),rl6=$('.rl6',w),head=$('.crh',w),stats=$('.crstats',w),gch=$('.gchips',w),qt=$('#v7qt',w),btns=$('.crbtns',w);
 const rc=head&&$('.small',head)?$('.small',head).textContent:'';
 // dữ liệu từng thẻ
 const info={};
 const tag=r=>{const lab=($('.crl',r)||{textContent:'?'}).textContent.trim();const crn=$('.crn',r);const nb=crn&&$('b',crn);const tg=crn&&$('.tg',crn);
  const g=(/\bg(\d)\b/.exec(r.className)||[0,0])[1];const smalls=crn?$$('.small',crn).map(x=>x.innerHTML).join('<br>'):'';
  const rb=$('button.crd',r)||$('button',r);info[lab]={name:nb?nb.textContent:lab,tg:tg?tg.outerHTML:'',desc:smalls,roll:rb?rb.getAttribute('onclick'):null,g};
  const b=document.createElement('button');b.type='button';b.className='cs-tag gr'+g;b.dataset.lab=lab;b.innerHTML=`<i>${lab}</i><b>${info[lab].name}</b>${tg?`<em>${tg.textContent}</em>`:''}`;return b};
 const main=rows.filter(r=>!/Thiên phú \d/.test(($('.crl',r)||{textContent:''}).textContent));
 const tal=rows.filter(r=>/Thiên phú \d/.test(($('.crl',r)||{textContent:''}).textContent));
 const talAll=$$('.crsec',w).find(s=>/Thiên phú/.test(s.textContent)&&$('button',s));
 const grp=document.createElement('div');grp.className='cs-grp';
 grp.insertAdjacentHTML('beforeend','<div class="cs-gt">Tiên thiên khí vận</div>');main.forEach(r=>grp.appendChild(tag(r)));
 const gt2=document.createElement('div');gt2.className='cs-gt';gt2.innerHTML='Thiên phú';
 if(talAll){const b=document.createElement('button');b.className='mini';b.type='button';b.textContent='🎲 cả 3';b.setAttribute('onclick',$('button',talAll).getAttribute('onclick'));gt2.appendChild(b)}
 grp.appendChild(gt2);tal.forEach(r=>grp.appendChild(tag(r)));
 const desc=document.createElement('div');desc.className='cs-desc';
 const show=lab=>{if(!info[lab])lab=Object.keys(info)[0];window.__csSel=lab;const i=info[lab];if(!i)return;
  $$('.cs-tag',grp).forEach(b=>b.classList.toggle('on',b.dataset.lab===lab));
  desc.innerHTML=`<div class="cs-dh"><b></b><span>${i.tg}</span></div><div class="cs-dt">${i.desc}</div>`;$('.cs-dh b',desc).textContent=i.name;
  if(i.roll){const rb=document.createElement('button');rb.type='button';rb.className='mini';rb.textContent='🎲 Roll lại mục này';rb.setAttribute('onclick',i.roll);$('.cs-dh',desc).appendChild(rb)}};
 grp.addEventListener('click',e=>{const t=e.target.closest('.cs-tag');if(t)show(t.dataset.lab)});
 // sân khấu nhân vật
 const doll=(D&&D.ready&&D.pose(CR.gender)&&CR.doll)?CR.doll:null;
 const stage=document.createElement('div');stage.className='cs-stage par';
 const fb=document.createElement('div');fb.className='cs-figbox';fb.innerHTML='<div class="cs-cloud"></div>'+(doll?figHtml(null,doll):`<div class="fig one" style="aspect-ratio:auto;width:60%"><img src="${ovalImg?ovalImg.src:''}" alt="" style="position:static;height:auto"></div>`);
 const id=document.createElement('div');id.className='cs-id';
 const mk=(lab,el)=>{const d=document.createElement('div');d.innerHTML=`<label>${lab}</label>`;if(el)d.appendChild(el);return d};
 id.appendChild(mk('Đạo hiệu',nameI));id.appendChild(mk('Giới tính',genS));
 if(alignBox){const d=document.createElement('div');d.innerHTML='<label>Lập trường</label>';const b=$('.btns',alignBox);if(b){b.className='cs-al';d.appendChild(b)}const s=$('.small',alignBox);if(s){s.className='cs-alt';d.appendChild(s)}id.appendChild(d)}
 stage.appendChild(fb);
 if(dollbox){const SH={'Khuôn mặt':'Mặt','Kiểu tóc':'Tóc','Trang phục':'Áo','Phụ kiện':'Phụ kiện','Sau lưng':'Sau','Hiệu ứng trước':'Hiệu ứng'};$$('.dll',dollbox).forEach(e=>{const t=e.textContent.trim();if(SH[t])e.textContent=SH[t]});const lk=document.createElement('div');lk.className='cs-look';lk.appendChild(dollbox);stage.appendChild(lk)}
 if(!doll&&arrows.length){const a=document.createElement('div');a.className='cs-arr';arrows.forEach(x=>{x.style.cssText='position:static;display:inline-block';a.appendChild(x)});stage.appendChild(a)}
 // cột phải
 const R=document.createElement('div');R.className='cs-right';
 const hd=document.createElement('div');hd.className='cs-h';hd.innerHTML='<b>Tiên thiên khí vận</b><span>Bấm từng thẻ để xem chi tiết · 🎲 để đổi</span>';
 R.appendChild(hd);R.appendChild(id);R.appendChild(desc);R.appendChild(grp);if(rl6){rl6.className='cs-note';R.appendChild(rl6)}
 // dải chỉ số
 const strip=document.createElement('div');strip.className='cs-strip';
 const sc=$$('.crs',stats||w);const colS=document.createElement('div');colS.className='cs-col';colS.innerHTML='<h4>Thuộc tính</h4>';
 const sa=document.createElement('div');sa.className='crstats';sc.slice(0,6).forEach(x=>sa.appendChild(x));colS.appendChild(sa);
 const colB=document.createElement('div');colB.className='cs-col';colB.innerHTML='<h4>Khởi đầu</h4>';const sb=document.createElement('div');sb.className='crstats';sc.slice(6).forEach(x=>sb.appendChild(x));colB.appendChild(sb);
 const colG=document.createElement('div');colG.className='cs-col';colG.innerHTML='<h4>Hành trang khởi đầu</h4>';if(gch)colG.appendChild(gch);
 $$('.crright > .small',w).forEach(x=>colG.appendChild(x));if(qt)colG.appendChild(qt);
 strip.append(colS,colB,colG);
 // thanh dưới
 const bar=document.createElement('div');bar.className='cs-bar';const rcs=document.createElement('span');rcs.className='cs-rc';rcs.textContent=rc;bar.appendChild(rcs);if(btns)bar.appendChild(btns);
 // phần còn sót
 const extra=document.createElement('div');extra.className='cs-extra';[...right.children].forEach(c=>{if(c!==head)extra.appendChild(c)});if(extra.children.length)colG.appendChild(extra);
 // lắp ráp
 const inn=document.createElement('div');inn.className='cs-in';inn.append(stage,R,strip,bar);
 const rl=document.createElement('div');rl.className='cs-rod l';const rr=document.createElement('div');rr.className='cs-rod r';
 w.className='crwrap cs';w.innerHTML='';w.append(rl,rr,inn);
 show(window.__csSel);
 const rt=$('.cs-right',w);if(rt&&window.__csScroll)rt.scrollTop=window.__csScroll;
 rt&&rt.addEventListener('scroll',()=>{window.__csScroll=rt.scrollTop},{passive:true});
}
function csRefreshFig(){const f=$('#modal.crmodal .cs-figbox');if(!f||!CR||!CR.doll)return;const old=$('.fig',f);const h=figHtml(null,CR.doll);if(old)old.outerHTML=h;else f.insertAdjacentHTML('beforeend',h)}
if(D){const _rf=D.refresh;D.refresh=function(ctx){const r=_rf.apply(this,arguments);try{if(ctx==='cr')csRefreshFig()}catch(e){console.warn(e)}return r}}
const _cs9=window.crScreen;
window.crScreen=function(){const r=_cs9.apply(this,arguments);try{csBuild()}catch(e){console.error('v9 csBuild',e)}return r};

// ---------- HỘI THOẠI CÓ CHÂN DUNG ----------
const VN={mark:0,id:null,t:0,log:[]};
const _ae=window.addEntry;
window.addEntry=function(html){try{VN.log.push({t:Date.now(),h:String(html)})}catch(e){}if(VN.log.length>40)VN.log.shift();return _ae.apply(this,arguments)};
const strip_=h=>String(h).replace(/<[^>]+>/g,'');
const GREET={
 love:['"{me}… ngươi đến rồi. Ta đã chờ từ sớm."','"Gặp ngươi, ta thấy lòng yên hơn nhiều."'],
 good:['"{me}, hôm nay ngươi có chuyện gì cần ta chăng?"','"Đạo hữu khỏe chứ? Lâu rồi không gặp."','"Có gì ngươi cứ nói, ta nghe."'],
 neutral:['"Ngươi là {me}? Có việc gì sao?"','"Thiên hạ rộng lớn, gặp nhau cũng là duyên."','"Nói đi, ta đang nghe."'],
 cold:['"Đừng làm phiền ta."','"Ngươi muốn gì? Nói nhanh."'],
 evil:['"Hừ, dám đến gặp ta? Cũng có chút gan."','"Ngươi nên nói cho khéo, kẻo khó sống."']};
function greet(n){const h=hashStr(n.id+(S.year||0)+(S.month||0));const pool=n.evil&&n.fav<30?GREET.evil:n.fav>=80?GREET.love:n.fav>=30?GREET.good:n.fav<=-20?GREET.cold:GREET.neutral;return pool[h%pool.length].replace('{me}',S.name)}
function vnBuild(id){
 const m=$('#modal');if(!m||!m.querySelector('h2')&&!m.querySelector('.choice'))return;const n=npcById(id);if(!n)return;
 if(m.classList.contains('vnmodal')||m.classList.contains('crmodal'))return;
 const here=n.loc===S.loc;const chs=$$('button.choice',m);if(!chs.length)return;
 const now=Date.now();if(VN.id!==id||now-VN.t>120000)VN.mark=VN.log.length;VN.id=id;VN.t=now;
 // nội dung chi tiết gốc
 const detail=document.createElement('div');detail.className='vn-detail';const keepClose=$('.mclose',m);
 const opts=document.createElement('div');opts.className='vn-opts';
 chs.forEach(c=>{opts.appendChild(c)});
 [...m.childNodes].forEach(c=>{if(c!==keepClose)detail.appendChild(c)});
 // dòng thoại
 const lines=VN.log.slice(VN.mark).filter(x=>now-x.t<600000).slice(-4);
 const box=document.createElement('div');box.className='vn-box';
 const far=`${esc(n.name)} không ở cạnh ngươi, chỉ gửi được thư.`;
 box.innerHTML=lines.map(x=>`<p class="vn-l sys">${strip_(x.h)}</p>`).join('')+`<p class="vn-l">${here?greet(n):far}</p>`;
 const meSrc=(typeof myPortrait==='function')?myPortrait():'';const npcSrc=spritePerson(n.name,n.g,n.sect,n.evil&&n.fav<0);
 const realm=(typeof REALMS!=='undefined'&&REALMS[n.realm])?REALMS[n.realm].name:'';
 const stage=document.createElement('div');stage.className='vn-stage par';
 stage.innerHTML=`<div class="vn-side me"><div class="vn-fig">${figHtml(meSrc)}</div><div class="vn-plate">${esc(S.name)}</div></div><div class="vn-side npc on"><div class="vn-fig">${figHtml(npcSrc)}</div><div class="vn-plate">${esc(n.name)}<small>${esc(realm)}${n.role?' · '+esc(n.role):''}</small></div></div>`;
 const info=document.createElement('button');info.type='button';info.className='vn-info';info.textContent='Xem xét';info.onclick=()=>$('.vn',m).classList.add('det');opts.insertBefore(info,opts.firstChild);
 const back=document.createElement('button');back.type='button';back.className='mini primary vn-back';back.textContent='‹ Quay lại';back.onclick=()=>$('.vn',m).classList.remove('det');detail.insertBefore(back,detail.firstChild);
 const x=document.createElement('button');x.type='button';x.className='vn-x';x.textContent='✕';x.setAttribute('aria-label','Đóng');x.onclick=()=>closeModal();
 const hud=document.createElement('div');hud.className='vn-hud';hud.textContent=`${favLabel(n.fav)} (${n.fav})`;
 const wrap=document.createElement('div');wrap.className='vn';wrap.append(hud,x,stage,box,opts,detail);
 m.innerHTML='';m.appendChild(wrap);m.classList.add('vnmodal');
}
const _on9=window.openNPC;
window.openNPC=function(id){const r=_on9.apply(this,arguments);try{vnBuild(id)}catch(e){console.error('v9 vnBuild',e)}return r};
const _cm9=window.closeModal;
window.closeModal=function(){try{const m=document.getElementById('modal');if(m)m.classList.remove('vnmodal')}catch(e){}return _cm9.apply(this,arguments)};
const _md9=window.modal;
window.modal=function(){try{const m=document.getElementById('modal');if(m)m.classList.remove('vnmodal')}catch(e){}return _md9.apply(this,arguments)};

try{PATCH_NOTES.unshift(['v9.0 · 07/11/2026 · Giao diện kiểu cuộn trục',[
 'Màn tạo nhân vật làm lại dạng cuộn trục: nhân vật vẽ lớn ở giữa không bị khung bó, thiên phú và khí vận là các thẻ màu theo phẩm, bấm thẻ để xem chi tiết, chỉ số và hành trang xếp ở dải dưới.',
 'Gặp NPC giờ là màn hội thoại: chân dung hai bên, bảng tên, lời thoại và các lựa chọn bên dưới. Nút "Xem xét" mở thông tin chi tiết cũ.',
 'Nhân vật ghép lớp có chuyển động 2.5D nhẹ: hiệu ứng phía sau, thân người và hiệu ứng phía trước lệch theo con trỏ, kèm nhịp thở.']])}catch(e){}
})();
