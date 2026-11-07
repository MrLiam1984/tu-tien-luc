/* ===== v10.11 · Quái và kẻ địch vẽ thủy mặc thay hình pixel ===== */
(function(){
const MON={tiger:'doll/mon_tiger.webp',wolf:'doll/mon_wolf.webp',snake:'doll/mon_snake.webp',eagle:'doll/mon_eagle.webp',boar:'doll/mon_boar.webp',bear:'doll/mon_bear.webp',spider:'doll/mon_spider.webp',ghost:'doll/mon_ghost.webp',demon:'doll/mon_demon.webp',bandit:'doll/mon_bandit.webp',assassin:'doll/mon_assassin.webp',boss:'doll/mon_boss.webp',fox:'doll/mon_fox.webp'};
const have={};
function pickMon(e){const n=String(e.name||'');
 if(e.kind==='beast'){
  if(e.boss)return 'boss';
  if(/hổ|báo|sư tử|mãnh/i.test(n))return 'tiger';
  if(/mãng|giao|xà|rắn|hạt|rết|trùng|bọ/i.test(n))return 'snake';
  if(/nhện|chu |thù/i.test(n))return 'spider';
  if(/điểu|ưng|nha|phượng|chim|kền|cú|dơi|bằng|hạc/i.test(n))return 'eagle';
  if(/trư|heo|lợn|ngưu|tê|tượng|sơn trư/i.test(n))return 'boar';
  if(/hùng|gấu|viên|vượn/i.test(n))return 'bear';
  if(/hồ|cáo|ly /i.test(n))return 'fox';
  if(/lang|sói|khuyển|cẩu/i.test(n))return 'wolf';
  const ks=['tiger','wolf','snake','eagle','boar','bear','spider','fox'];return ks[hashStr(n)%ks.length]}
 if(e.kind==='heart')return 'ghost';
 if(/sát thủ|thích khách/i.test(n))return 'assassin';
 if(/cướp|phỉ|sơn tặc|thủ lĩnh|giặc/i.test(n))return 'bandit';
 if(/quỷ|thi|hồn|vong|cương|cốt/i.test(n))return 'ghost';
 if(e.evil||/ma tu|huyết|tà|ma /i.test(n))return 'demon';
 return null}
const _es=window.enemySprite;
if(typeof _es==='function')window.enemySprite=function(e){try{const k=pickMon(e);if(k&&MON[k])return MON[k]}catch(x){}return _es.apply(this,arguments)};
const _pi=window.pimg;
if(typeof _pi==='function')window.pimg=function(src,size,extra){const r=_pi.apply(this,arguments);return typeof src==='string'&&src.indexOf('doll/mon_')===0?r.replace('image-rendering:pixelated;','image-rendering:auto;'):r};
const st=document.createElement('style');st.textContent=`.cfoe .cspr[src^="doll/mon_"]{image-rendering:auto;transform:none;filter:drop-shadow(0 6px 8px rgba(0,0,0,.3));object-fit:contain}
.cfoe.heart .cspr[src^="doll/mon_"]{filter:drop-shadow(0 0 10px #7a2bd6)}
.cfoe.beast .cspr[src^="doll/mon_"]{height:70%}.cfoe.boss .cspr[src^="doll/mon_"]{height:86%}
#modal.cmodal .fighter.cfoe .cspr[src^="doll/mon_"]{height:100%;max-width:140%}`;
document.head.appendChild(st);
try{PATCH_NOTES.unshift(['v10.11 · 07/11/2026 · Quái và kẻ địch vẽ thủy mặc',[
 'Trong chiến đấu, hổ, sói, rắn, đại bàng, heo rừng, gấu, nhện, hồ ly, quỷ hồn, ma tu, sơn tặc, sát thủ và boss đều hiện hình thủy mặc thay cho hình pixel.',
 'Thêm tranh cửa hiệu cho quảng trường, bảng cáo thị, tửu quán, thái y, lý trưởng, cung điện và địa khế.']])}catch(e){}
})();
