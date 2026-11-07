/* ===== v10.8 · Khung gọn nhẹ hơn; cảnh có tranh: hiện tranh trước, chạm mới hiện khung lựa chọn nhỏ bên dưới ===== */
(function(){
const GOLD='#c9a850',INKB='rgba(26,20,14,.9)';
const css=`
/* --- HUD và các khung: bỏ viền dày, dùng viền mảnh bo nhẹ --- */
#hud8 .pt{background:radial-gradient(circle at 50% 35%,#7a6e60,#2a231c)!important;box-shadow:0 0 0 2px ${GOLD},0 4px 12px rgba(0,0,0,.45)!important;margin:6px}
#hud8 .info{background:${INKB}!important;border:1px solid ${GOLD}!important;border-image:none!important;border-radius:10px!important;padding:6px 10px 8px!important;box-shadow:0 4px 14px rgba(0,0,0,.4)!important}
#hud8 .b8{border-radius:6px!important;background:rgba(0,0,0,.5)!important;box-shadow:none!important}
#hud8 .b8 i{border-radius:6px!important}
#dock8 button{border:1.5px solid ${GOLD}!important;border-radius:14px!important;background:${INKB}!important;box-shadow:0 4px 12px rgba(0,0,0,.4)!important;margin:4px 3px}
#dock8 button.hot{border-color:#ff7a5c!important;box-shadow:0 0 14px #ff7a5c!important}
header,#toast8,footer,#tut7,body.h8 footer{background:${INKB}!important;border:1px solid ${GOLD}!important;border-image:none!important;border-radius:10px!important;box-shadow:0 4px 14px rgba(0,0,0,.4)!important}
.owcard,.scap{border:2px solid #2a2118!important;border-image:none!important;border-radius:12px!important;box-shadow:0 8px 26px rgba(0,0,0,.4)!important}
#overlay #modal:not(.crmodal):not(.vnmodal):not(.scn){border:2px solid #2a2118!important;border-image:none!important;border-radius:12px!important;box-shadow:0 0 0 1px ${GOLD} inset,0 14px 40px rgba(0,0,0,.5)!important}
#overlay #modal .crbox,#overlay #modal .sec,#overlay #modal .box,#overlay #modal .card{border:1px solid #b79a55!important;border-image:none!important;border-radius:8px!important}
#overlay #modal button.choice{border:1px solid #6a5a3a!important;border-image:none!important;border-radius:8px!important;padding:7px 12px!important}
/* --- cảnh có tranh --- */
#overlay:has(#modal.scn){padding:0;background:#0b0907;align-items:stretch;justify-content:center}
#overlay #modal.scn:not(.crmodal):not(.vnmodal){width:100%;max-width:1200px;height:100%;max-height:none!important;margin:0;padding:0!important;display:flex;flex-direction:column;background:none!important;border:0!important;border-image:none!important;box-shadow:none!important;border-radius:0!important;overflow:hidden}
.scn-stage{position:relative;flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;padding:8px 8px 0}
.scn-stage img{max-width:100%;max-height:100%;object-fit:contain;display:block;border:2px solid #1b1815;box-shadow:0 0 40px rgba(0,0,0,.7);transition:all .3s}
.scn-cap{position:absolute;top:18px;left:50%;transform:translateX(-50%);color:#f7f1df;font:600 18px "Noto Serif",serif;letter-spacing:.1em;padding:5px 30px 7px;background:linear-gradient(90deg,transparent,rgba(13,13,13,.85) 14%,rgba(13,13,13,.85) 86%,transparent);white-space:nowrap;max-width:96%;overflow:hidden;text-overflow:ellipsis;pointer-events:none}
.scn-hint{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);color:#f7f1df;background:rgba(13,13,13,.72);border:1px solid ${GOLD};padding:6px 18px;border-radius:20px;font-size:14px;white-space:nowrap;animation:scnp 1.8s ease-in-out infinite;pointer-events:none}
@keyframes scnp{50%{opacity:.45}}
.scn-panel{flex:0 0 auto;display:none;max-height:46vh;overflow-y:auto;background:linear-gradient(#f7eed8,#e9dcb9);border-top:2px solid #1b1815;padding:10px 16px 14px;box-shadow:0 -6px 20px rgba(0,0,0,.5)}
#modal.scn-open .scn-panel{display:block;animation:scnu .28s ease-out}
#modal.scn-open .scn-hint{display:none}
@keyframes scnu{from{transform:translateY(24px);opacity:0}}
.scn-panel h2{display:none!important;font-size:16px!important;margin:0 0 6px!important;padding-bottom:8px!important}
.scn-panel h2:before{width:16px!important;height:16px!important;vertical-align:-2px!important}
.scn-panel p{font-size:14px;margin:0 0 6px}
#overlay #modal.scn button.choice{margin:5px 0!important}
@media(max-width:640px){.scn-cap{font-size:15px;padding:4px 18px 6px}.scn-panel{max-height:52vh;padding:8px 12px 12px}}
`;
const st=document.createElement('style');st.id='v10e-css';st.textContent=css;document.head.appendChild(st);
let evClosed=0;
try{const ec=document.getElementById('evcard');if(ec){let was=false;new MutationObserver(()=>{const on=ec.classList.contains('on');if(was&&!on)evClosed=Date.now();was=on}).observe(ec,{attributes:true,attributeFilter:['class']})}}catch(e){}
function openScn(m){if(m&&m.classList.contains('scn'))m.classList.add('scn-open')}
function scene(){const m=document.getElementById('modal');if(!m)return;if(!m.querySelector('.choice'))return;let ban=m.querySelector('.evban');if(!ban&&window.__sceneBanner)ban=window.__sceneBanner(m);if(!ban)return;
 const img=ban.querySelector('img');if(!img)return;const h2=m.querySelector('h2');
 const stage=document.createElement('div');stage.className='scn-stage';stage.appendChild(img);
 const cap=document.createElement('div');cap.className='scn-cap';cap.textContent=h2?h2.textContent.replace(/^[^\p{L}\p{N}]+/u,'').trim():'';
 const hint=document.createElement('div');hint.className='scn-hint';hint.textContent='Chạm vào tranh để tiếp tục';
 stage.append(cap,hint);
 const pan=document.createElement('div');pan.className='scn-panel';
 [...m.childNodes].forEach(n=>{if(n===ban||(n.classList&&n.classList.contains('mclose')))return;pan.appendChild(n)});
 ban.remove();const mc=m.querySelector('.mclose');if(mc)mc.remove();
 m.append(stage,pan);m.classList.add('scn');
 stage.addEventListener('click',()=>openScn(m));
 if(Date.now()-evClosed<20000)m.classList.add('scn-open')}
const _md=window.modal;
window.modal=function(){const m=document.getElementById('modal');if(m)m.classList.remove('scn','scn-open');const r=_md.apply(this,arguments);try{scene()}catch(e){console.warn(e)}return r};
addEventListener('keydown',e=>{const m=document.getElementById('modal');if(m&&m.classList.contains('scn')&&!m.classList.contains('scn-open')&&(e.key==='Enter'||e.key===' ')&&document.getElementById('overlay').classList.contains('show')){e.preventDefault();e.stopPropagation();openScn(m)}},true);
const _cm=window.closeModal;if(typeof _cm==='function')window.closeModal=function(){const m=document.getElementById('modal');if(m)m.classList.remove('scn','scn-open');return _cm.apply(this,arguments)};
try{PATCH_NOTES.unshift(['v10.8 · 07/11/2026 · Khung gọn hơn, cảnh có tranh hiện ảnh trước',[
 'Các khung ở thanh dưới (ô nhân vật, chỉ số, nút Tu luyện, Công pháp…), thanh trên, thẻ và cửa sổ đổi sang viền mảnh bo nhẹ, bỏ viền dày nặng nề.',
 'Cảnh có tranh thủy mặc (gặp lão nhân, sát thủ, cướp, yêu thú, độc khí…): tranh hiện lớn trước, chạm vào tranh mới hiện khung lựa chọn nhỏ ở bên dưới, tranh vẫn nằm trên không bị che.']])}catch(e){}
})();
