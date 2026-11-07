/* ===== v10.22 · Kết thúc trận đấu: hiện dòng "hết kẻ địch", người chơi bấm Kết thúc ===== */
(function(){
'use strict';
const _ec=window.endCombat;if(typeof _ec!=='function')return;
const esc2=s=>String(s==null?'':s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function msgFor(result,e){
 const n=esc2(e&&e.name||'đối thủ');
 if(result==='win'){
  if(e&&e.kind==='heart')return ['🌅 Tâm ma đã tan biến.','Trong lòng chỉ còn một khoảng trời quang.'];
  if(e&&e.spar)return ['🤝 Tỷ thí kết thúc.',`${n} đã chịu thua. Không còn ai đứng đối diện ngươi.`];
  if(e&&e.kind==='beast')return ['🏆 Yêu thú đã bị hạ gục hết.',`${n} nằm bất động. Quanh đây không còn kẻ địch nào.`];
  return ['🏆 Kẻ địch đã bị hạ gục hết.',`${n} gục xuống. Quanh đây không còn ai cản đường ngươi.`]}
 if(result==='flee')return ['🏃 Ngươi đã thoát khỏi vòng vây.',`${n} không đuổi kịp nữa.`];
 if(result==='talk')return ['🕊 Chiến sự đã dừng lại.',`${n} hạ vũ khí, không còn kẻ nào muốn ra tay.`];
 return null}
function gate(result){return new Promise(res=>{
 const st=document.querySelector('#modal .cstage'),e=(typeof C!=='undefined'&&C)?C.e:null,m=msgFor(result,e);
 if(!st||!m){res();return}
 try{document.querySelectorAll('#modal button').forEach(b=>{b.disabled=true})}catch(x){}
 const foe=st.querySelector('.cfoe');if(foe&&result==='win'&&!(e&&e.spar)){foe.classList.add('pkko')}
 const d=document.createElement('div');d.className='pkend';
 d.innerHTML=`<div class="pkend-t">${m[0]}</div><div class="pkend-s">${m[1]}</div><button class="primary pkend-b">Kết thúc trận đấu ▶</button>`;
 st.appendChild(d);
 const go=()=>{d.remove();res()};
 d.querySelector('button').onclick=go;
 // phím tắt: Enter hoặc Space
 const key=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();document.removeEventListener('keydown',key);go()}};
 document.addEventListener('keydown',key);
 d.querySelector('button').addEventListener('click',()=>document.removeEventListener('keydown',key));
 try{if(window.__fx&&__fx.victory)__fx.victory(result)}catch(x){}
})}
window.endCombat=async function(result){
 try{if(!window.__skipEndGate)await gate(result)}catch(err){console.warn(err)}
 return _ec.apply(this,arguments)};
const css=`.pkend{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:12;width:min(86%,420px);text-align:center;padding:16px 18px 14px;border-radius:12px;background:linear-gradient(180deg,rgba(24,18,34,.94),rgba(14,10,22,.96));border:1px solid rgba(240,210,120,.55);box-shadow:0 0 0 3px rgba(0,0,0,.35),0 10px 40px rgba(0,0,0,.6),0 0 30px rgba(240,200,90,.25) inset;animation:pkend .45s cubic-bezier(.2,1.2,.3,1) both}
.pkend-t{font-family:"Noto Serif","Times New Roman",serif;font-weight:800;font-size:19px;letter-spacing:.04em;color:#ffe9a8;text-shadow:0 0 10px rgba(255,200,80,.6),0 2px 0 #000}
.pkend-s{margin:7px 0 12px;font-size:13px;line-height:1.5;color:#d9d2e6}
.pkend-b{font-size:15px;padding:9px 22px;border-radius:8px;cursor:pointer}
@keyframes pkend{0%{opacity:0;transform:translate(-50%,-40%) scale(.9)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
#modal .cfoe.pkko{animation:pkko 1s ease-in forwards}
@keyframes pkko{0%{filter:none;opacity:1;transform:none}30%{filter:brightness(2.2) saturate(.3)}100%{filter:brightness(.6) blur(3px);opacity:0;transform:translateY(26px) scale(.9)}}`;
if(!document.getElementById('v10scss')){const s=document.createElement('style');s.id='v10scss';s.textContent=css;document.head.appendChild(s)}
try{PATCH_NOTES.unshift(['v10.22 · 07/11/2026 · Kết thúc trận đấu không còn thoát ngang',[
 'Thắng, thoát được hay thuyết phục xong, màn đấu <b>không đóng ngay nữa</b>: kẻ địch mờ dần, hiện dòng "Kẻ địch đã bị hạ gục hết" (hoặc "Ngươi đã thoát khỏi vòng vây", "Chiến sự đã dừng lại"), người chơi bấm <b>Kết thúc trận đấu</b> (hoặc Enter/Space) mới sang phần nhận chiến lợi phẩm.',
 'Tâm ma, tỷ thí và yêu thú đều có lời kết riêng.']])}catch(e){}
})();
