/* ===== v7.9 · Icon trang bị, pháp bảo, khí linh vẽ tay (Flow / Nano Banana Pro) ===== */
(function(){
const CODES=["E001","E002","E003","E004","E005","E006","E007","E008","E009","E010","E011","E012","E013","E014","E015","E016","E017","E018","E019","E020","E021","E022","E023","E024","E025","E026","E027","E028","E029","E030","E031","E032","E033","E034","E035","E036","E037","E038","E039","E040","E041","E042","E043","E044","E045","E046","E047","E048","E049","E050","E051","E052","E053","E054","E055","E056","E057","E058","E059","E060","E061","E062","E063","E064","E065","E066","E067","E068","E069","E070","E071","E072","E073","E074","E075","E076","E077","E078","E079","E080","E081","E082","E083","E084","E085","E086","E087","E088","E089","E090","E091","E092","E093","E094","E095","E096","E097","E098","E099","E100","E101","E102","E103","E104","E105","E106","E107","E108","E109","E110","E111","E112","E113","E114","E115","E116","E117","E118","E119","KL01","KL02","KL03","KL04","KL05","KL06","PB01","PB02","PB03","PB04","PB05","PB06","PB07","PB08","PB09","PB10"];const ATL='gear_atlas.webp',AC=15,AR=9;
const POS={};CODES.forEach((c,i)=>POS[c]=i);let ATL_OK=true;{const t=new Image();t.onerror=()=>{ATL_OK=false;try{for(const k in PB)if(PB[k].ic0)PB[k].ic=PB[k].ic0}catch(e){}};t.src=ATL}
function spr(code,sz,cls,extra){const i=POS[code];if(i==null||!ATL_OK)return '';return `<i class="v7sp ${cls||''}" style="width:${sz}px;height:${sz}px;background-image:url(${ATL});background-size:${AC*sz}px ${AR*sz}px;background-position:-${(i%AC)*sz}px -${Math.floor(i/AC)*sz}px;${extra||''}"></i>`}
const IC=new Proxy({},{get:(o,k)=>POS[k]!=null&&ATL_OK?k:undefined});window.V7G=IC;window.v7Spr=spr;
// thứ tự gốc của các tên trang bị, khớp mã E001–E111 (mỗi tên 3 phẩm: Phàm/Lương · Bảo/Huyền · Thánh trở lên)
const ORDER=['vu','mu','ao','giap','choang','gang','dai','giay','day','nhan','boi'];
const BN={vu:['Kiếm','Đao','Thương','Phiến','Côn','Kích'],mu:['Quan','Khôi','Đầu Cân','Mão'],ao:['Đạo Bào','Thanh Sam','Vũ Y','Pháp Bào'],giap:['Giáp','Khải','Lân Giáp'],choang:['Phi Phong','Vân Bào','Hạc Sưởng'],gang:['Hộ Uyển','Thủ Sáo','Quyền Sáo'],dai:['Ngọc Đái','Yêu Đái','Bảo Đái'],giay:['Ngoa','Hài','Vân Lý'],day:['Hạng Liên','Chuỗi Ngọc','Linh Liên'],nhan:['Giới Chỉ','Nhẫn'],boi:['Bội','Ngọc Bội','Linh Bội']};
const BASE=[];ORDER.forEach(s=>BN[s].forEach(n=>BASE.push([s,n])));
const ALIAS={'Nhuyễn Tiên':'Kiếm','Song Câu':'Kích','Phất Trần':'Côn','Trâm':'Quan','Quần':'Vũ Y','Nghê Thường':'Vũ Y','Thanh Y':'Thanh Sam','Nghê Giáp':'Giáp','Quang Khải':'Khải','Hạc Y':'Vũ Y','Lân Đái':'Yêu Đái','Đái':'Ngọc Đái','Châu':'Hạng Liên','Liên':'Linh Liên','Giới':'Giới Chỉ','Hoàn':'Nhẫn','Quyết':'Ngọc Bội'};
function slotOf(it){let s=it.slot;if(s==='phu')s='boi';if(s==='nhan1'||s==='nhan2')s='nhan';return SLOT12[s]?s:'vu'}
function tierOf(g){g=g||0;return g<=1?0:g<=3?1:2}
function gearCode(it){if(!it)return null;const s=slotOf(it);const nm=String(it.name||'').trim();
 const cand=BASE.map((b,i)=>[b,i]).filter(([b])=>b[0]===s).sort((a,b)=>b[0][1].length-a[0][1].length);
 let hit=cand.find(([b])=>nm.endsWith(b[1]));
 if(!hit){for(const k in ALIAS)if(nm.endsWith(k)){const a=ALIAS[k];hit=cand.find(([b])=>b[1]===a);if(hit)break}}
 if(!hit)hit=cand[cand.length-1];if(!hit)return null;
 return 'E'+String(hit[1]*3+tierOf(it.g)+1).padStart(3,'0')}
window.v7GearCode=gearCode;
const GCOL=['#8d8a83','#4f8a6a','#3c6fbf','#7b4cc2','#d29a2f','#d0562d','#c43c7a'];
function gimg(it,sz){const c=gearCode(it);const u=c&&IC[c];if(!u)return '';const col=GCOL[Math.max(0,Math.min(6,it.g||0))];
 return spr(c,sz,'v7gi','--gc:'+col)}
window.v7GearImg=gimg;window.V7GCOL=GCOL;
const SETC={tp:'E112',kc:'E113',xd:'E114',ht:'E115',hth:'E116',kl:'E117',tv:'E118',pd:'E119'};window.V7SETC=SETC;
// CSS
document.head.insertAdjacentHTML('beforeend',`<style id="v7gcss">
.v7sp{display:inline-block;flex:none;background-repeat:no-repeat;font-style:normal}
.v7gi{vertical-align:middle;object-fit:contain;border-radius:9px;margin:-4px 6px -4px 0;background:radial-gradient(circle at 50% 45%,color-mix(in srgb,var(--gc) 28%,transparent),transparent 70%);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--gc) 55%,transparent)}
.v7gl{display:inline-flex;align-items:center;gap:0;text-align:left}
.v7si{width:16px;height:16px;vertical-align:-3px;margin-right:3px}
.v7pi{width:40px;height:40px;vertical-align:middle;margin-right:6px;object-fit:contain;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}
.v7ki{width:30px;height:30px;vertical-align:middle;margin-right:5px;object-fit:contain}
.pbbtn .v7pi{width:26px;height:26px;margin:-4px 4px -4px 0}
</style>`);
// nhãn trang bị: icon mới thay cho icon vẽ máy
window.gLabelV5=function(it){const g6=Math.max(0,Math.min(6,it.g||0)),sb=(it.set&&SETC[it.set]&&IC[SETC[it.set]])?spr(SETC[it.set],15,'setm'):'';return `<span class="v7gl"><span class="gic gr${g6}${it.set?' isset':''}" style="--gc:${GCOL[g6]}">${gimg(it,36)}${sb}</span><b class="g${it.g}">${esc(it.name)}</b></span> <span class="small">${GGRADE[it.g]} · cấp ${it.t} · ${SLOT12[slotOf(it)]?.n||it.slot}</span>`};
const _gl=window.gLabel;
window.gLabel=function(it){let s=_gl.apply(this,arguments);if(it&&it.set&&SETC[it.set]&&IC[SETC[it.set]])s=s.replace('<span class="tag set">',`<span class="tag set">${spr(SETC[it.set],16,'v7si')}`);return s};
// pháp bảo & khí linh
const PBK=['hao','chuy','kiem','chung','dien','xi','chau','bong','cam','ty'];
PBK.forEach((k,i)=>{const u=IC['PB'+String(i+1).padStart(2,'0')];if(PB[k]&&u){PB[k].ic0=PB[k].ic;PB[k].ic=spr('PB'+String(i+1).padStart(2,'0'),40,'v7pi')}});
const KLK=['ho','dieu','tru','meo','nguu','hung'];
window.klImg=k=>{const i=KLK.indexOf(k);const u=i>=0&&IC['KL0'+(i+1)];return u?spr('KL0'+(i+1),30,'v7ki'):''};
try{let src=window.openPhapBao.toString();
 src=src.split('<b>${KL[k].n}</b>').join('${klImg(k)}<b>${KL[k].n}</b>').split('<b>${KL[p.kl.k].n} cấp').join('${klImg(p.kl.k)}<b>${KL[p.kl.k].n} cấp');
 window.openPhapBao=(0,eval)('('+src+')')}catch(e){console.error('v7g pb',e)}
function fixPb(){document.querySelectorAll('#modal .pbbtn').forEach(b=>{if(b.dataset.v7)return;const p=pbOf&&pbOf();if(!p)return;b.dataset.v7=1;b.innerHTML=b.innerHTML.replace(/^\s*🔱\s*/,PB[p.k].ic.replace('width:40px;height:40px','width:26px;height:26px').replace(/background-size:[^;]+;background-position:[^;]+/,m=>{const i=POS['PB'+String(PBK.indexOf(p.k)+1).padStart(2,'0')];return `background-size:${AC*26}px ${AR*26}px;background-position:-${(i%AC)*26}px -${Math.floor(i/AC)*26}px`})+' ')})}
const _rc=window.renderCombat;window.renderCombat=function(){const r=_rc.apply(this,arguments);try{fixPb()}catch(e){}return r};
document.addEventListener('click',()=>setTimeout(()=>{try{fixPb()}catch(e){}},0),true);
try{PATCH_NOTES.unshift(['v7.9 · 07/11/2026 · Icon trang bị vẽ tay',[
 '119 icon trang bị mới, vẽ cùng phong cách nhân vật: mỗi loại (Kiếm, Đao, Thương, Phiến, Côn, Kích, Quan, Khôi, Đạo Bào, Giáp, Phi Phong, Hộ Uyển, Ngọc Đái, Ngoa, Hạng Liên, Giới Chỉ, Ngọc Bội…) có 3 dáng theo phẩm: Phàm/Lương mộc mạc, Bảo/Huyền khảm ngọc, Thánh trở lên rực hào quang.',
 'Món thuộc bộ (Thanh Phong, Kim Cang, Xích Diễm, Huyền Thủy, Hậu Thổ, Kinh Lôi, Tử Vân, Phúc Duyên) có huy hiệu riêng cạnh nhãn bộ.',
 '10 pháp bảo và 6 khí linh có hình riêng trong bảng Pháp bảo và trên nút tế pháp bảo khi chiến đấu.',
 'Khung icon đổi màu theo phẩm để nhìn là biết đồ tốt hay xấu.']])}catch(e){}
})();
