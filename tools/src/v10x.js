/* ===== v10.27 · Bản đồ châu: nền và biểu tượng địa danh vẽ bằng Flow ===== */
(function(){
'use strict';
const MK=["thon", "tran", "huyen", "thanh", "dedo", "tong", "gate", "cave", "zone", "fortune", "boss", "secret", "portal", "quest", "yeuvuong", "chientruong", "huyettri", "kiemtrung", "duocvien", "thapco", "maicung", "longmach", "bandit", "hermit", "ruins", "teahouse", "shrine", "dock", "mine", "tomb"],MI={};MK.forEach((n,i)=>MI[n]=i);const MC=8,MS=192,MW=MC*MS,MH=Math.ceil(MK.length/MC)*MS;
const KINDS=['doi','song','dam','thanh','nui','hoa','mo','bang','tien'];
window.cmDeco10=function(i){const k=(typeof CHAU_SCENE!=='undefined'&&CHAU_SCENE[i])||'doi';const kk=KINDS.includes(k)?k:'doi';
 return `<image href="doll/cm_${kk}.webp" x="0" y="0" width="1600" height="1000" preserveAspectRatio="none"/><rect x="14" y="14" width="1572" height="972" fill="none" stroke="#2a261f" stroke-width="2.4" opacity=".5"/><rect x="24" y="24" width="1552" height="952" fill="none" stroke="#2a261f" stroke-width=".9" opacity=".35"/>`};
const SZ={thon:120,tran:132,huyen:150,thanh:168,dedo:182,tong:150,gate:112,cave:118,zone:124,fortune:116,boss:132,secret:120,portal:116,quest:96};
function mkKey(x){if(x.dom)return MI[x.dom]!=null?x.dom:'ruins';if(x.lv)return x.lv;if(MI[x.k]!=null)return x.k;if(x.k==='kn')return 'shrine';if(x.k==='q')return 'bandit';return 'shrine'}
let CID=0;function mkImg(key,X,Y,s){const i=MI[key];if(i==null)return '';const sx=(i%MC)*MS,sy=Math.floor(i/MC)*MS,k=s/MS,X0=X-s/2,Y0=Y-s*.62,id='mkc'+(CID++);
 return `<g class="mkg"><clipPath id="${id}" clipPathUnits="userSpaceOnUse"><rect x="${X0}" y="${Y0}" width="${s}" height="${s}"/></clipPath><image href="doll/mk_atlas.webp" x="${X0-sx*k}" y="${Y0-sy*k}" width="${MW*k}" height="${MH*k}" clip-path="url(#${id})" preserveAspectRatio="none"/></g>`}
window.cmIcon=function(x){const key=mkKey(x);const s=x.dom?140:(SZ[key]||SZ[x.lv]||118);return mkImg(key,x.x,x.y,s)};
window.__mk={MI,mkImg};
function mkSpr(key,px){const i=MI[key];if(i==null)return '';const R=Math.ceil(MK.length/MC);return `<i class="mkspr" style="width:${px}px;height:${px}px;background-image:url(doll/mk_atlas.webp);background-size:${MC*100}% ${R*100}%;background-position:${(i%MC)/(MC-1)*100}% ${Math.floor(i/MC)/(R-1)*100}%"></i>`}
window.__mk.spr=mkSpr;
const _cc=window.cmCard;if(typeof _cc==='function')window.cmCard=function(){const r=_cc.apply(this,arguments);try{const x=cmNodes().find(n=>n.id===CM.sel);const im=document.querySelector('#cmcard .cmhead img');if(x&&im){const h=mkSpr(mkKey(x),64);if(h)im.outerHTML=h}else if(x){const hd=document.querySelector('#cmcard .cmhead');if(hd&&!hd.querySelector('.mkspr'))hd.insertAdjacentHTML('afterbegin',mkSpr(mkKey(x),64))}}catch(e){}return r};
const css=`.mkspr{display:inline-block;flex:none;background-repeat:no-repeat;border-radius:4px}.cmsvg .cmn .mkg{filter:drop-shadow(0 3px 3px rgba(40,30,15,.35))}.cmsvg .cmn:hover .mkg{filter:drop-shadow(0 0 7px rgba(179,64,43,.85)) brightness(1.06)}.cmsvg .cmn.dim .mkg{filter:grayscale(.8) opacity(.6)}`;
if(!document.getElementById('v10xcss')){const s=document.createElement('style');s.id='v10xcss';s.textContent=css;document.head.appendChild(s)}
try{PATCH_NOTES.unshift(['v10.27 · 08/11/2026 · Bản đồ châu vẽ lại bằng Flow',[
 '<b>9 tranh nền thủy mặc</b> cho bản đồ châu theo từng vùng: đồi núi, châu thổ sông, đầm lầy, đồng hoa đào, núi đá cao, vùng núi lửa, đất mộ, băng nguyên, tiên cảnh mây.',
 '<b>30 biểu tượng địa danh</b> vẽ tay: thôn, trấn, huyện thành, châu thành, đế đô, sơn môn, cổng, động phủ, rừng hoang, cơ duyên, hang yêu vương, bí cảnh, cổng truyền tống, bảng truy nã và 8 cõi ở góc (trại binh linh Yêu Vương Động, cổ chiến trường, huyết trì, kiếm trủng, dược viên, tháp trấn yêu, mê cung gương, địa mạch).',
 'Thêm icon riêng cho Chân Long Huyết và Linh Quả.']])}catch(e){}
})();
