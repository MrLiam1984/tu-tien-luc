/* ===== v10.5 · Tu luyện: ảnh nhân vật ngồi thiền + thanh tiến độ thật ===== */
(function(){
const D=window.DOLL;
// ---- tư thế ngồi chỉ dùng cho cảnh tu luyện, không còn là tư thế chọn trong diện mạo ----
if(D){
 D.SIT={'Nữ':'nu5','Nam':'nams'};
 const _pl=D.poseList;
 D.poseList=g=>_pl(g).filter(p=>!Object.values(D.SIT).includes(p.id));
 D.sitUrl=function(){try{
  if(!D.ready||typeof S==='undefined'||!S)return null;
  const g=S.gender==='Nam'?'Nam':'Nữ';const sp=D.SIT[g];if(!sp||!D.man[sp])return null;
  const outs=D.man[sp].items.filter(i=>i.kind==='outfit');if(!outs.length)return null;
  const L0=(S.look&&S.look.doll)||{};
  const pick=outs.find(o=>o.id===L0.outfit)||outs[hashStr(String(L0.outfit||S.name))%outs.length];
  return D.url({pose:sp,outfit:pick.id,fxb:L0.fxb||'',ag:L0.ag||0},'full')}catch(e){return null}};
}
// ---- CSS ----
const st=document.createElement('style');st.id='v10c-css';st.textContent=`
#cvscene{position:fixed;inset:0;z-index:44;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:radial-gradient(ellipse at 50% 42%,rgba(36,48,44,.95),rgba(12,10,8,.98) 72%);opacity:0;pointer-events:none;transition:opacity .45s;padding:20px 16px calc(96px + env(safe-area-inset-bottom,0px));box-sizing:border-box}
#cvscene.on{opacity:1;pointer-events:auto}
#cvscene .cvfig{position:relative;height:min(58vh,560px);aspect-ratio:3/4;display:flex;align-items:flex-end;justify-content:center}
#cvscene .cvfig::before{content:"";position:absolute;left:50%;top:54%;width:150%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(130,230,205,.5),rgba(242,210,122,.22) 40%,transparent 68%);animation:auraP 2.4s ease-in-out infinite}
#cvscene .cvfig::after{content:"";position:absolute;inset:-6% -26% 4%;background:radial-gradient(circle,rgba(170,255,235,.85) 1.5px,transparent 2.5px) 0 0/24px 28px;animation:qi 2.2s linear infinite;opacity:.32;-webkit-mask:linear-gradient(transparent,#000 35%,transparent);mask:linear-gradient(transparent,#000 35%,transparent)}
#cvscene .cvfig img{position:relative;z-index:1;height:100%;width:auto;max-width:100%;object-fit:contain;animation:tuF 3s ease-in-out infinite;filter:drop-shadow(0 8px 14px rgba(0,0,0,.5))}
#cvscene .cvnm{color:#f3ead8;font-size:18px;letter-spacing:.06em;text-shadow:0 2px 8px #000}#cvscene .cvnm small{display:block;text-align:center;font-size:12px;color:#f2d27a;letter-spacing:0;margin-top:2px}
#cvscene .cvbar{width:min(86vw,460px);box-sizing:border-box;background:rgba(43,33,23,.9);color:#f3ead8;padding:9px 16px 11px;border-radius:14px;font-size:13px;box-shadow:0 2px 14px rgba(0,0,0,.5);border:1px solid rgba(242,210,122,.35)}
#cvscene .cvt{display:flex;justify-content:space-between;gap:12px;margin-bottom:6px;white-space:nowrap}#cvscene .cvt em{font-style:normal;color:#f2d27a;overflow:hidden;text-overflow:ellipsis}
#cvscene .cvbar i{display:block;height:8px;border-radius:5px;background:rgba(255,255,255,.18);overflow:hidden}#cvscene .cvbar i b{display:block;height:100%;width:0;background:linear-gradient(90deg,#6fd6c0,#f2d27a);transition:width .25s}
@media(max-width:640px){#cvscene .cvfig{height:min(50vh,420px)}}`;
document.head.appendChild(st);
// ---- trạng thái + màn tu luyện ----
const CV={on:false,p:0,label:'',cur:'',t0:0};
function cvEl(){let e=document.getElementById('cvscene');if(!e){e=document.createElement('div');e.id='cvscene';
 e.innerHTML='<div class="cvfig"><img alt=""></div><div class="cvnm"><span class="cvn"></span><small class="cvr"></small></div><div class="cvbar"><div class="cvt"><span class="cvl"></span><em class="cvv"></em></div><i><b></b></i></div>';document.body.appendChild(e)}return e}
function cvPaint(){const e=cvEl();
 if(CV.on){const im=e.querySelector('img');let u=null;try{u=D&&D.sitUrl&&D.sitUrl()}catch(x){}if(!u){try{u=myPortrait()}catch(x){}}if(u&&im.getAttribute('src')!==u)im.src=u;
  e.querySelector('.cvn').textContent=S.name;try{e.querySelector('.cvr').textContent=tierName()}catch(x){}
  e.querySelector('.cvl').textContent=CV.label;e.querySelector('.cvv').textContent=CV.cur;e.querySelector('i b').style.width=Math.round(Math.min(1,CV.p)*100)+'%';
  e.classList.add('on')}else e.classList.remove('on')}
function cvSet(p,cur){CV.p=p;CV.cur=cur;cvPaint()}
function sitApply(){try{cvPaint()}catch(e){console.warn(e)}}
function gainTxt(){const g=Math.max(0,Math.round(S.tuvi-CV.t0));const t=realm().tuvi;return `+${g} tu vi${t&&t!==Infinity?` · ${Math.min(S.tuvi,t)}/${t}`:''}`}
// ---- tu luyện theo ngày ----
const _cu=window.cultivate;
if(typeof _cu==='function')window.cultivate=async function(pi,days){
 const pd=window.passDays;let n=0;CV.t0=S.tuvi;
 window.passDays=function(k){const r=pd.apply(this,arguments);if(r){n+=(k||1);if(!CV.on){CV.on=true;CV.label=`🧘 Nhập định · ${durStr(days)}`}cvSet(n/days,`Ngày ${Math.min(n,days)}/${days} · ${gainTxt()}`)}return r};
 try{return await _cu.apply(this,arguments)}finally{window.passDays=pd;if(CV.on){cvSet(1,gainTxt());await new Promise(r=>setTimeout(r,500))}CV.on=false;sitApply()}};
// ---- bế quan theo năm ----
const _bq=window.beQuan;
if(typeof _bq==='function')window.beQuan=async function(n){
 const pm=window.passMonths;let m=0;CV.t0=S.tuvi;const tot=Math.max(1,n*12);
 CV.on=true;CV.label=`🧘 Bế quan · ${n} năm`;cvSet(0,`Năm 0/${n} · +0 tu vi`);
 window.passMonths=function(k){const r=pm.apply(this,arguments);if(r){m+=(k||1);cvSet(m/tot,`Năm ${Math.min(n,Math.floor(m/12))}/${n} · ${gainTxt()}`)}return r};
 try{return await _bq.apply(this,arguments)}finally{window.passMonths=pm;cvSet(Math.min(1,m/tot),gainTxt());await new Promise(r=>setTimeout(r,500));CV.on=false;sitApply()}};
try{window.__CV=CV}catch(e){}
try{PATCH_NOTES.unshift(['v10.5 · 07/11/2026 · Tu luyện hiện nhân vật ngồi thiền và thanh tiến độ',[
 'Khi tu luyện hoặc bế quan, sân khấu hiện nhân vật ngồi thiền (đúng trang phục đang mặc) cùng thanh tiến độ thật: số ngày đã tu trên tổng, tu vi tăng thêm và tu vi hiện có trên mức cảnh giới. Bế quan hiển thị theo năm.',
 'Tư thế Ngồi thiền chỉ còn dùng trong cảnh tu luyện, không nằm trong danh sách tư thế chọn khi tạo nhân vật hay đổi diện mạo nữa. Người chơi đang dùng dáng ngồi sẽ tự chuyển về dáng đứng.']])}catch(e){}
try{PATCH_NOTES.unshift(['v10.6 · 07/11/2026 · Năm tư thế nam mới, vẽ theo khí chất nam nhi',[
 'Nam có thêm 5 tư thế đứng: Khoanh tay · kiếm đeo lưng, Mã bộ xuất quyền, Đứng tựa kiếm, Vung trọng đao, Quay lưng ngoái nhìn. Dáng người vạm vỡ, góc cạnh, khác hẳn dáng nữ.',
 'Cảnh tu luyện của nam cũng dùng tranh ngồi thiền riêng. Trang phục nam theo từng tư thế sẽ được vẽ bổ sung dần.',
 '<b>Chiến đấu</b>: bấm Chiến đấu hoặc Túi đồ thì bảng chiêu và bảng vật phẩm giữ nguyên sau mỗi lượt, chỉ quay về menu chính khi bấm Quay lại.']])}catch(e){}
})();
