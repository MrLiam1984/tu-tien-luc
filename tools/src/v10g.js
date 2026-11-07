/* ===== v10.9 · Vào trấn: thẻ tranh từng nơi, NPC đứng quầy, thiện cảm, giảm giá, nhiệm vụ ẩn ===== */
(function(){
const $=(s,r=document)=>r.querySelector(s);
// ---- tranh từng nơi: thử lần lượt các tệp, tệp nào chưa có thì dùng tệp kế ----
const VIMG={khach:['ven_khach','ev_tuluyen'],y:['ven_y','ev_cho'],tra:['ven_tra','ev_gapgo'],tuu:['ven_tuu','ven_tra','ev_gapgo'],cho:['ven_cho','ev_cho'],thuong:['ven_thuong','ev_cho'],lo:['ven_lo','ev_dan'],ren:['ven_ren','ev_dan'],dau:['ven_dau','ev_cho'],nha:['ven_nha','ev_phucich'],nguoi:['ven_nguoi','ev_gapgo'],bang:['ven_bang','ev_tong'],
 lytruong:['ven_lytruong','ev_gapgo'],thodet:['ven_ren','ev_dan'],thaiy:['ven_thaiy','ev_dan'],cung:['ven_cung','ev_tong'],quandoanh:['ven_nha','ev_phucich'],dia:['ven_dia','ven_nha','ev_phucich']};
const ROLE={khach:'Chủ khách điếm',y:'Chủ tiệm y phường',tra:'Chưởng quầy trà lâu',tuu:'Chủ tửu quán',cho:'Chủ sạp chợ',thuong:'Thương nhân',lo:'Đan sư',ren:'Thợ rèn',dau:'Chủ phiên đấu giá',nha:'Huyện úy',nguoi:'Dân thành',bang:'Thư lại cáo thị',lytruong:'Lý trưởng',thodet:'Thợ thủ công',thaiy:'Thầy thuốc',cung:'Thái giám',quandoanh:'Quản doanh',dia:'Thư lại địa khế'};
const GOOD={y:'Nữ',khach:'Nam',ren:'Nam',lo:'Nam'};
const NM_N=['Trương','Lý','Vương','Triệu','Hồ','Tiêu','Đỗ','Cao','Mạc','Phó'],NM_M=['Lão Tam','Đại Hải','Phúc Sinh','Thiết Trụ','Văn Bình','Quang Minh','Tiểu Ngũ','Hữu Lễ'],NM_F=['Thúy Lan','Bích Hà','Ngọc Yến','Mai Hương','Tố Nga','Hồng Liên'];
const LINES={
 0:['Khách quan cần gì cứ nói, đừng để ta mất công.','Hàng đây, tiền đó. Ngài đừng hỏi han nhiều.','Ngài lạ mặt quá, ta chưa quen.'],
 1:['Ồ, lại là ngài. Hôm nay cần gì?','Gặp ngài vài lần rồi, ta nhớ mặt. Lấy gì thì cứ chọn.','Dạo này ăn nên làm ra, hàng nhiều lắm, ngài xem.'],
 2:['Ngài đến rồi! Để ta lấy loại tốt nhất cho ngài.','Người quen cả, giá ta tính nhẹ tay cho ngài.','Ngồi nghỉ đi, uống ngụm trà rồi hẵng chọn.'],
 3:['Tri kỷ đến chơi! Ta giữ riêng cho ngài mấy món quý.','Với ngài thì ta không tính lãi nữa, chỉ lấy cái tình.','Ta có chuyện chưa kể ai, hôm nay muốn nhờ ngài.']};
const TALK=['Nghe nói dạo này ngoài thành có yêu thú về, đường xa phải cẩn thận.','Chuyện nhà chuyện cửa, cứ kể mãi cũng hết. Ngài kể ta nghe chuyện lên đường đi.','Ta làm nghề này hai mươi năm, thấy không biết bao nhiêu kẻ tu hành đến rồi đi.','Có kẻ mặc áo đen hỏi thăm ngài đấy, ngài nhớ đề phòng.','Giá cả dạo này lên xuống thất thường, đều tại thương đoàn phương xa.','Ngài trông không giống người tầm thường, ta nhìn người ít khi nhầm.'];
const SECRET=[
 {id:'nocu',t:'Món nợ cũ',txt:'Ta có một món đồ cũ bị kẻ cướp lấy mất trong hang gần đây. Ngài giúp lấy về, ta có hậu tạ.',
  go:async(n)=>{const lv=clamp(S.realm,0,8);const e=makeEnemy('human',lv,'Thủ lĩnh sơn tặc',{evil:true,noRand:true});const w=await startCombat(e,`Lấy lại đồ cho ${n.name}.`);if(w==='win'){const g=gainLS(Math.round(tierPrice(60,S.realm+1)));addItem('Hồi khí đan',2);rel(n.name,3);addEntry(`🎁 ${esc(n.name)} mừng rỡ, tặng ngươi ${g} linh thạch và 2 Hồi khí đan.`,'good','Nhiệm vụ ẩn')}else addEntry(`${esc(n.name)} thở dài: "Không sao, ngài giữ mạng là được."`,'system','Nhiệm vụ ẩn')}},
 {id:'bimat',t:'Tin mật',txt:'Ta nghe được một tin: có mạch linh khí chưa ai biết ở gần đây. Ta chỉ nói với người ta tin, ngài muốn nghe không?',
  go:async(n)=>{const tv=Math.max(5,Math.round(tuviGain()*3));S.tuvi+=tv;statUp('thanthuc',1,true);addEntry(`🔮 ${esc(n.name)} chỉ ngươi một chỗ tĩnh tọa: tu vi +${tv}, Thần thức +1.`,'good','Nhiệm vụ ẩn')}},
 {id:'chidiem',t:'Lời chỉ điểm',txt:'Hồi trẻ ta từng theo một cao nhân, học được chút khẩu quyết. Hôm nay ta truyền lại cho ngài.',
  go:async(n)=>{const k=pick(['the','than','ngo']);statUp(k,2,true);addEntry(`📖 ${esc(n.name)} truyền khẩu quyết cũ: ${STATS[k]} +2 (vĩnh viễn).`,'good','Nhiệm vụ ẩn')}}];
const tierOf=f=>f>=70?3:f>=40?2:f>=10?1:0;
const TIERN=['Người lạ','Quen mặt','Thân tình','Tri kỷ'];
const disc=f=>f>=90?.15:f>=70?.10:f>=40?.06:f>=20?.03:0;
// ---- NPC đứng quầy: mỗi nơi ở mỗi thành có một người cố định ----
function vNpc(k){S.vnpc=S.vnpc||{};const key=((typeof TW!=='undefined'&&TW.id)||S.loc)+':'+k;let n=S.vnpc[key]&&npcById(S.vnpc[key]);
 if(!n){const h=hashStr(key);const g=GOOD[k]||(h%2?'Nữ':'Nam');const nm=NM_N[h%NM_N.length]+' '+(g==='Nữ'?NM_F:NM_M)[(h>>3)%(g==='Nữ'?NM_F.length:NM_M.length)];
  n=genNPC({name:nm,g,realm:0,role:ROLE[k]||'Dân thành',loc:S.loc,met:true});n.vendor=k;S.npcs.push(n);S.vnpc[key]=n.id}
 return n}
function vNpcAny(k){try{return vNpc(k)}catch(e){return null}}
// ---- giảm giá theo thiện cảm với chủ sạp / thương nhân của thành đang đứng ----
const _ip=window.itemPrice;
if(typeof _ip==='function')window.itemPrice=function(k){let p=_ip.apply(this,arguments);try{if(typeof TW!=='undefined'&&TW.id){const f=Math.max(...['cho','thuong'].map(q=>{const key=TW.id+':'+q;const n=S.vnpc&&S.vnpc[key]&&npcById(S.vnpc[key]);return n?n.fav:0}));p=Math.round(p*(1-disc(f)))}}catch(e){}return Math.max(1,p)};
// ---- CSS ----
const st=document.createElement('style');st.id='v10g-css';st.textContent=`
.vgal{height:100%;width:100%;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px;padding:6px 2px 14px;align-content:start}
.vcard{position:relative;border:2px solid #1b1815;border-radius:10px;overflow:hidden;cursor:pointer;background:#1b1815;aspect-ratio:16/10;box-shadow:0 6px 18px rgba(0,0,0,.5);transition:transform .15s}
.vcard:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,0,0,.6)}
.vcard img{width:100%;height:100%;object-fit:cover;display:block}
.vcard .vl{position:absolute;left:0;right:0;bottom:0;padding:22px 10px 8px;background:linear-gradient(transparent,rgba(10,8,6,.9));color:#f7f1df;font:600 15px "Noto Serif",serif;letter-spacing:.04em}
.vcard .vl small{display:block;font:12px Inter,sans-serif;color:#f2d27a;letter-spacing:0;margin-top:2px}
#vscn{position:fixed;inset:0;z-index:48;display:none;flex-direction:column;align-items:center;background:#0b0907}
#vscn.on{display:flex}
#vscn .vs-stage{position:relative;flex:1 1 auto;min-height:0;width:100%;max-width:1200px;display:flex;align-items:center;justify-content:center;padding:8px 8px 0;overflow:hidden}
#vscn .vs-stage img{max-width:100%;max-height:100%;object-fit:contain;border:2px solid #1b1815;box-shadow:0 0 40px rgba(0,0,0,.7)}
#vscn .vs-cap{position:absolute;top:16px;left:50%;transform:translateX(-50%);color:#f7f1df;font:600 18px "Noto Serif",serif;letter-spacing:.1em;padding:5px 30px 7px;background:linear-gradient(90deg,transparent,rgba(13,13,13,.85) 14%,rgba(13,13,13,.85) 86%,transparent);white-space:nowrap;max-width:92%;overflow:hidden;text-overflow:ellipsis}
#vscn .vs-x{position:absolute;right:14px;top:14px;z-index:3;border:1px solid #c9a850;background:rgba(26,20,14,.9);color:#f7f1df;border-radius:8px;padding:4px 12px;font-size:16px;cursor:pointer}
#vscn .vs-pan{flex:0 0 auto;width:100%;max-width:1200px;max-height:50vh;overflow-y:auto;background:linear-gradient(#f7eed8,#e9dcb9);border-top:2px solid #1b1815;padding:10px 16px 14px;box-shadow:0 -6px 20px rgba(0,0,0,.5);box-sizing:border-box}
#vscn .vs-who{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px}
#vscn .vs-who b{font:600 16px "Noto Serif",serif;color:#2b2117}#vscn .vs-who small{color:#6a5a3a}
#vscn .vs-fav{flex:1;min-width:120px;max-width:260px;height:8px;border-radius:5px;background:rgba(0,0,0,.18);overflow:hidden}#vscn .vs-fav i{display:block;height:100%;background:linear-gradient(90deg,#d9583b,#f2d27a);width:0}
#vscn .vs-say{background:rgba(255,250,236,.85);border:1px solid #b79a55;border-radius:10px;padding:8px 12px;font:15px "Noto Serif",serif;color:#2b2117;margin:4px 0 8px;line-height:1.5}
#vscn .vs-btns{display:flex;flex-wrap:wrap;gap:8px}
#vscn .vs-btns button{border:1px solid #6a5a3a;border-radius:8px;background:rgba(255,250,236,.9);padding:7px 14px;font-size:14px;cursor:pointer;color:#2b2117}
#vscn .vs-btns button.primary{background:#8e1f1b;color:#fbe9d0;border-color:#5a1210}
#vscn .vs-btns button:disabled{opacity:.5;cursor:default}
@media(max-width:640px){.vgal{grid-template-columns:1fr 1fr;gap:8px}.vcard .vl{font-size:13px}#vscn .vs-cap{font-size:15px;padding:4px 18px 6px}#vscn .vs-pan{max-height:56vh}}
`;document.head.appendChild(st);
function imgTag(keys,cls){const l=keys.map(k=>`doll/${k}.webp`);return `<img ${cls?`class="${cls}"`:''} src="${l[0]}" data-alt='${JSON.stringify(l.slice(1))}' alt="" onerror="try{var a=JSON.parse(this.dataset.alt||'[]');if(a.length){this.src=a.shift();this.dataset.alt=JSON.stringify(a)}else this.style.visibility='hidden'}catch(e){}">`}
// ---- thẻ tranh trong thành ----
const _ot=window.openTown;
window.openTown=function(id){const r=_ot.apply(this,arguments);try{decorate()}catch(e){console.error(e)}return r};
function decorate(){const el=document.getElementById('ctown');if(!el||!el.classList.contains('on'))return;const body=$('.twbody',el);if(!body)return;
 const keys=[...body.querySelectorAll('.twlist button')].map(b=>(b.getAttribute('onclick')||'').match(/townGo\('(\w+)'\)/)).filter(Boolean).map(m=>m[1]);
 const T=(typeof TOWN_B!=='undefined'?TOWN_B:{});
 body.innerHTML=`<div class="vgal">${keys.map(k=>{const n=(S.vnpc&&S.vnpc[TW.id+':'+k]&&npcById(S.vnpc[TW.id+':'+k]));return `<div class="vcard" data-k="${k}">${imgTag(VIMG[k]||['ev_gapgo'])}<div class="vl">${(T[k]&&T[k].n)||k}<small>${n?esc(n.name)+' · '+TIERN[tierOf(n.fav)]:(ROLE[k]||'')}</small></div></div>`}).join('')}</div>`;
 body.style.cssText='display:block;flex:1;min-height:0;width:100%;overflow:hidden;grid-template-columns:none';
 const p=el.querySelector('.cmtop p');if(p)p.textContent=timeStr()+' · bấm vào tranh để vào bên trong';
 body.querySelectorAll('.vcard').forEach(c=>c.onclick=()=>venue(c.dataset.k))}
// ---- cảnh bên trong ----
let V={k:null};
function vEl(){let e=document.getElementById('vscn');if(!e){e=document.createElement('div');e.id='vscn';document.body.appendChild(e)}return e}
function venue(k){const T=(typeof TOWN_B!=='undefined'?TOWN_B:{});if(busy)return;const n=vNpcAny(k);V.k=k;
 if(k==='nha'&&typeof bountyHere==='function'&&!bountyHere()&&false)return;
 paint(k,n,null);vEl().classList.add('on')}
function closeV(){const e=document.getElementById('vscn');if(e)e.classList.remove('on');V.k=null;try{const el=document.getElementById('ctown');if(el&&el.classList.contains('on'))decorate()}catch(e){}}
window.__closeVenue=closeV;
function paint(k,n,say){const T=(typeof TOWN_B!=='undefined'?TOWN_B:{});const e=vEl();const f=n?n.fav:0;const t=tierOf(f);const d=disc(f);
 const line=say||pick(LINES[t]);const chat=(n&&n.vTalk&&n.vTalk.d===S.day+':'+nowM())?n.vTalk.c:0;
 const hasSecret=n&&f>=60&&!(n.vSec);
 e.innerHTML=`<button class="vs-x" aria-label="Rời quầy">✕ Rời quầy</button><div class="vs-stage">${imgTag(VIMG[k]||['ev_gapgo'])}<div class="vs-cap">${esc((T[k]&&T[k].ic)||'')} ${esc((T[k]&&T[k].n)||k)} · ${esc((typeof TW!=='undefined'&&TW.nm)||'')}</div></div>
 <div class="vs-pan"><div class="vs-who"><b>${n?esc(n.name):''}</b><small>${esc(ROLE[k]||'')} · ${TIERN[t]} · thiện cảm ${f}${d?` · giảm giá ${Math.round(d*100)}% ở chợ`:''}</small><div class="vs-fav"><i style="width:${clamp(f,0,100)}%"></i></div></div>
 <div class="vs-say">“${esc(line)}”</div>
 <div class="vs-btns"><button class="primary" data-a="svc">${esc((T[k]&&T[k].ic)||'')} ${esc((T[k]&&T[k].n)||'Vào')}: ${esc((T[k]&&T[k].d)||'')}</button><button data-a="talk" ${chat>=3?'disabled':''}>💬 Trò chuyện${chat>=3?' (hôm nay đã nói nhiều)':''}</button><button data-a="gift">🎁 Biếu chút quà · ${giftCost()} LS</button>${f>=20?'<button data-a="rumor">🗣 Hỏi tin đồn</button>':''}${hasSecret?'<button data-a="secret">📜 Nhiệm vụ ẩn</button>':''}</div></div>`;
 e.querySelector('.vs-x').onclick=closeV;
 e.querySelectorAll('.vs-btns button').forEach(b=>b.onclick=()=>act(b.dataset.a,k,n))}
const giftCost=()=>Math.max(5,Math.round(tierPrice(12,S.realm+1)));
async function act(a,k,n){const T=(typeof TOWN_B!=='undefined'?TOWN_B:{});if(!n)return;
 if(a==='svc'){try{T[k].f(TW.lv,TW.nm)}catch(e){console.error(e)}setTimeout(()=>{const el=document.getElementById('ctown');if(!el||!el.classList.contains('on'))closeV()},500);return}
 if(a==='talk'){const key=S.day+':'+nowM();const c=(n.vTalk&&n.vTalk.d===key?n.vTalk.c:0);if(c>=3)return;try{passDays(0.1)}catch(e){}n.vTalk={d:key,c:c+1};
  const gain=Math.max(1,Math.round(2+(eff('me')-50)/25+(n.like?0:0)+(chance(25)?2:0)));n.fav=clamp(n.fav+gain,-100,100);
  paint(k,n,pick(TALK)+` (thiện cảm +${gain})`);return}
 if(a==='gift'){const g=giftCost();if(S.linhThach<g){paint(k,n,'Ngài hào phóng quá, nhưng túi ngài chưa đủ linh thạch.');return}S.linhThach-=g;const gain=ri(4,8);n.fav=clamp(n.fav+gain,-100,100);try{render()}catch(e){}paint(k,n,`Ôi, ngài chu đáo quá! (thiện cảm +${gain})`);return}
 if(a==='rumor'){try{passDays(0.1)}catch(e){}const g=typeof GOSSIP!=='undefined'?pick(GOSSIP):'Dạo này chẳng có tin gì lạ.';paint(k,n,g);return}
 if(a==='secret'){const q=pick(SECRET);n.vSec=q.id;paint(k,n,q.txt);
  await choose(`📜 ${q.t}`,`${n.name} hạ giọng: "${q.txt}"`,[{t:'🤝 Nhận lời',desc:'Giúp một lần, đổi lấy cái tình và hậu tạ.',run:async()=>{try{await q.go(n)}catch(e){console.error(e)}}},{t:'🙏 Xin từ chối',desc:'Giữ nguyên quan hệ, nhưng cơ hội này sẽ không còn.',run:async()=>{addEntry(`Ngươi từ chối nhiệm vụ của ${esc(n.name)}.`,'system','Nhiệm vụ ẩn')}}]);
  try{render()}catch(e){}paint(k,n,null)}}
const _cax=window.cmActions;if(typeof _cax==='function')window.cmActions=function(x){if(x&&x.lv)return '';return _cax.apply(this,arguments)};
try{PATCH_NOTES.unshift(['v10.9 · 07/11/2026 · Vào trấn có tranh và NPC đứng quầy',[
 'Bỏ danh sách nút lối tắt ở thôn, trấn, thành. Vào trấn là thấy các thẻ tranh thủy mặc của từng nơi (khách điếm, y phường, trà lâu, chợ, thương nhân, đan phòng, lò rèn, đấu giá, nha môn…); bấm vào tranh để vào bên trong.',
 'Mỗi nơi có một NPC đứng quầy cố định theo từng thành: tên riêng, thiện cảm, câu thoại đổi theo mức quen. Có thể trò chuyện (tối đa 3 lần mỗi ngày), biếu quà, hỏi tin đồn.',
 'Thiện cảm 20 trở lên được giảm giá ở chợ và thương nhân của thành (3% đến 15%). Thiện cảm 60 trở lên NPC đưa ra nhiệm vụ ẩn (lấy lại đồ cũ, tin mật, lời chỉ điểm). NPC đứng quầy cũng xuất hiện trong mục Người quen và nhận quà thiện cảm như NPC thường.']])}catch(e){}
})();
