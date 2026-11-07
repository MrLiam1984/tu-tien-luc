/* ===== v9.1 · Thẻ sự kiện có tranh thủy mặc + tranh đầu cửa sổ ===== */
(function(){
const $=(s,r=document)=>r.querySelector(s);
const KIND_TITLE={trom:'Trộm cắp',dotpha:'Đột phá',tong:'Tông môn',kyngo:'Kỳ ngộ',phucich:'Chặn đường',gapgo:'Gặp gỡ',tinhduyen:'Tình duyên',thienma:'Đại sự thiên hạ',chet:'Thân tử đạo tiêu',tuluyen:'Tu luyện',cho:'Chợ phiên',thienkiep:'Thiên kiếp',san:'Săn yêu thú',dan:'Luyện đan',cuoc:'Giao đấu',caosu:'Cố sự',tamma:'Tâm ma'};
// nhãn nhật ký -> loại tranh
const BY_LABEL={'Đột phá':'dotpha','Tông môn':'tong','Nhiệm vụ tông môn':'tong','Cơ duyên':'kyngo','Gặp gỡ':'gapgo','Tình duyên':'tinhduyen','Đạo lữ':'tinhduyen','Thiên Ma':'thienma','Đại sự':'thienma','Truy đuổi':'phucich','Thiên lộ':'thienkiep','Cố sự':'caosu','Hồi sau':'caosu','Chương I':'caosu','Vật độc nhất':'kyngo','Trường Sinh Lộ':'thienkiep'};
// chữ trong nội dung -> loại tranh (ưu tiên hơn nhãn)
const BY_TEXT=[[/trộm|móc túi|mất cắp|không cánh mà bay|chôm/i,'trom'],[/tẩu hỏa nhập ma|tâm ma bùng|tâm ma xâm/i,'tamma'],[/ĐỘT PHÁ THÀNH CÔNG|Kim Đan kết thành|kết thành Nguyên Anh|Tiến giai:/,'dotpha'],[/thiên kiếp|lôi kiếp|độ kiếp/i,'thienkiep'],[/Thăng cấp trong tông|gia nhập .*tông|nhập môn/i,'tong'],[/bị phục kích|chặn đường|cướp đường/i,'phucich'],[/Thiên hạ đại sự/,'thienma']];
const DONE=new Set();
const imgOf=k=>`doll/ev_${k}.webp`;
const card={q:null,t:0,last:0,open:false};
const strip=h=>String(h).replace(/<br\s*\/?>/gi,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
function pickKind(html,label){const t=strip(html);for(const [re,k] of BY_TEXT)if(re.test(t))return k;return BY_LABEL[label]||null}
const css=document.createElement('style');css.textContent=`
#evcard{position:fixed;inset:0;z-index:80;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(10,8,6,.66);backdrop-filter:blur(3px)}
#evcard.on{display:flex;animation:evin .35s ease-out}
@keyframes evin{from{opacity:0}to{opacity:1}}
.evc{width:min(880px,100%);max-height:100%;display:flex;flex-direction:column;position:relative;filter:drop-shadow(0 12px 40px rgba(0,0,0,.6))}
.evc-t{align-self:center;z-index:2;margin-bottom:-14px;padding:5px 40px 7px;background:linear-gradient(90deg,transparent,#0d0d0d 14%,#0d0d0d 86%,transparent);color:#f7f1df;font:600 18px "Noto Serif",serif;letter-spacing:.12em}
.evc-p{position:relative;overflow:hidden;aspect-ratio:16/9;background:#cfc6ae;border:3px solid #1b1815;min-height:0}
.evc-p img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform-origin:50% 50%;animation:kb 14s ease-in-out infinite alternate}
@keyframes kb{from{transform:scale(1.02) translate(0,0)}to{transform:scale(1.10) translate(-1.5%,-1%)}}
.evc-p:after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 60px rgba(30,22,10,.45);pointer-events:none}
.evc-b{background:linear-gradient(#e8e2d1,#d9d1bb);border:3px double #6a5a3a;border-top:0;padding:14px 26px 14px;text-align:center}
.evc-x{font-size:15.5px;line-height:1.6;color:#2b2117;max-height:20vh;overflow-y:auto;text-align:left}.evc-x p{margin:0 0 4px}
.evc-x em,.evc-x b{color:#b3261e;font-style:normal}
.evc-ok{margin-top:10px;min-width:220px;padding:8px 24px;font:600 15px "Noto Serif",serif;color:#f7f1df;background:#1f1d1a;border:2px solid #d6a944;border-radius:3px;cursor:pointer}
.evc-ok:hover{background:#2e2a24}
@media (max-width:700px){.evc-p{aspect-ratio:4/3}.evc-t{font-size:15px;padding:4px 26px 6px}.evc-x{font-size:14px}}
.evban{margin:-24px -26px 12px;height:150px;position:relative;overflow:hidden;border-radius:16px 16px 0 0;border-bottom:1px solid var(--line)}
.evban img{width:100%;height:100%;object-fit:cover;animation:kb 16s ease-in-out infinite alternate}
.evban:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 55%,var(--paper,#fbf6ea))}
@media (max-width:860px){.evban{margin:-18px -18px 10px;height:110px}}
`;document.head.appendChild(css);
const el=document.createElement('div');el.id='evcard';document.body.appendChild(el);
function show(kind,texts){
 if(card.open){card.q={kind,texts};return}
 card.open=true;card.last=Date.now();
 const body=texts.slice(-3).map(t=>`<p>${t}</p>`).join('');
 el.innerHTML=`<div class="evc"><div class="evc-t">${KIND_TITLE[kind]||'Sự kiện'}</div><div class="evc-p"><img src="${imgOf(kind)}" alt="" onerror="this.style.display='none'"></div><div class="evc-b"><div class="evc-x">${body}</div><button class="evc-ok" type="button">Xác định</button></div></div>`;
 el.classList.add('on');$('.evc-ok',el).focus({preventScroll:true})}
function close(){el.classList.remove('on');card.open=false;if(card.q){const q=card.q;card.q=null;setTimeout(()=>show(q.kind,q.texts),250)}}
el.addEventListener('click',e=>{if(e.target===el||e.target.closest('.evc-ok'))close()});
addEventListener('keydown',e=>{if(card.open&&(e.key==='Enter'||e.key===' '||e.key==='Escape')){e.preventDefault();e.stopPropagation();close()}},true);
window.v9Event=show;
// gom các dòng nhật ký cùng loại trong 400ms thành một thẻ
let pend=null;
const _ae=window.addEntry;
window.addEntry=function(html,cls,label){const r=_ae.apply(this,arguments);
 try{if(!S||!S.menh||S.dead)return r;const k=pickKind(html,label);if(!k)return r;
  const t=strip(html);if(!t||t.length<8)return r;
  if(pend&&pend.kind===k){pend.texts.push(t.length>260?t.slice(0,257)+'…':t);return r}
  if(pend){clearTimeout(pend.timer);flush()}
  if(Date.now()-card.last<9000&&!card.open)return r;
  pend={kind:k,texts:[t.length>260?t.slice(0,257)+'…':t]};pend.timer=setTimeout(flush,450)}catch(e){console.warn(e)}return r};
function flush(){if(!pend)return;const p=pend;pend=null;show(p.kind,p.texts)}
// tranh đầu cửa sổ cho một số màn
const BY_TITLE=[[/^Đột phá/,'dotpha'],[/^(Tông môn|🏯)/,'tong'],[/Thân tử đạo tiêu|đã chết/,'chet'],[/Chợ|Phường thị|Đấu giá|Thương nhân/,'cho'],[/Khách Điếm|^🧘|Động phủ/,'tuluyen'],[/Phi thăng|Thiên lộ/,'thienkiep'],[/Trà Lâu|Tửu Quán|Quảng Trường/,'gapgo'],[/Luyện đan|Rèn đúc|Lò rèn/,'dan'],[/Chiến đấu/,'cuoc']];
const _md=window.modal;
window.modal=function(){const r=_md.apply(this,arguments);
 try{const m=document.getElementById('modal');if(!m||m.classList.contains('crmodal')||m.classList.contains('vnmodal')||m.querySelector('.mscene,.evban'))return r;
  const h=m.querySelector('h2');if(!h)return r;const t=h.textContent.trim();let k=null;for(const [re,kk] of BY_TITLE)if(re.test(t)){k=kk;break}
  if(k){h.insertAdjacentHTML('beforebegin',`<div class="evban"><img src="${imgOf(k)}" alt="" onerror="this.parentNode.remove()"></div>`)}}catch(e){}return r};
try{PATCH_NOTES.unshift(['v9.1 · 07/11/2026 · Sự kiện có tranh',[
 'Các sự kiện lớn (trộm cắp, đột phá, kỳ ngộ, gặp gỡ, tông môn, tâm ma, thiên kiếp…) hiện thành thẻ có tranh thủy mặc chuyển động nhẹ kèm lời dẫn và nút Xác định.',
 'Nhiều cửa sổ như đột phá, tông môn, chợ, khách điếm, trà lâu có thêm tranh ở đầu cửa sổ.']])}catch(e){}
})();
