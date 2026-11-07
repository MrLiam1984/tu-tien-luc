/* ===== v9.2 · Túi đồ dạng lưới với icon thủy mac ===== */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const COLS=8,ROWS=6,SZ=128;
const NAMES=["sword","hat","robe","armor","cloak","bracers","belt","boots","necklace","ring","jade","saber","spear","fan","staff","bow","bottle","pill_red","pill_gold","talis_gold","talis_blue","plate","furnace","orb","map","book","slip","token","stone","shard","gourd","tea","herb","lingzhi","ginseng","ore","crystal","meteor","core","fang","pelt","bone","pearl_kim","pearl_moc","pearl_thuy","pearl_hoa","pearl_tho","pearl_loi"];
const IDX=Object.fromEntries(NAMES.map((n,i)=>[n,i]));
const ATLAS=new Image();let atlasOk=false;const urlMemo={};
ATLAS.onload=()=>{atlasOk=true;try{Object.keys(urlMemo).forEach(k=>delete urlMemo[k]);if(document.querySelector('#modal .bgx'))window.openBag&&0}catch(e){}};
ATLAS.src='doll/ic_atlas.webp';
// ảnh icon đơn (dataURL) cho chỗ nào cần thẻ <img>
function iconUrl(name){if(!atlasOk||!(name in IDX))return '';if(urlMemo[name])return urlMemo[name];const i=IDX[name],c=document.createElement('canvas');c.width=c.height=SZ;c.getContext('2d').drawImage(ATLAS,(i%COLS)*SZ,Math.floor(i/COLS)*SZ,SZ,SZ,0,0,SZ,SZ);return urlMemo[name]=c.toDataURL('image/webp',.9)}
// dạng sprite CSS (không cần canvas)
function spr(name,px,fx){const i=IDX[name];if(i==null)return '';const x=i%COLS,y=Math.floor(i/COLS);return `<i class="bic" style="width:${px}px;height:${px}px;background-image:url(doll/ic_atlas.webp);background-size:${COLS*100}% ${ROWS*100}%;background-position:${x/(COLS-1)*100}% ${y/(ROWS-1)*100}%${fx?';'+fx:''}"></i>`}
const EL={Kim:'kim',Mộc:'moc',Thủy:'thuy',Hỏa:'hoa',Thổ:'tho',Lôi:'loi'};
// tên vật phẩm -> tên icon
function nameOfItem(k){const it=(typeof ITEMS!=='undefined'&&ITEMS[k])||{};
 const m=/^(Kim|Mộc|Thủy|Hỏa|Thổ|Lôi) linh châu/.exec(k);if(m)return 'pearl_'+EL[m[1]];
 if(it.cat==='chau')return 'pearl_kim';
 if(it.cat==='dan')return /Đột phá|Trúc Cơ|Kết|Ngưng|Cụ Linh|Hóa|Đăng|Diên|Tẩy|Nguyên/.test(k)?'pill_gold':(/Giải Độc|Định Tâm/.test(k)?'bottle':'pill_red');
 if(it.cat==='phu')return /Trận/.test(k)?'plate':(/Hộ|Kim Cang|Tĩnh/.test(k)?'talis_blue':'talis_gold');
 if(/Đan Lô|(^|\s)Lô(\s|$)/.test(k))return 'furnace';if(/Trận|Bàn/.test(k))return 'plate';
 if(it.cat==='bao')return /Châu|Khôi Lỗi/.test(k)?'orb':'orb';
 if(it.cat==='vat')return /Bản đồ/.test(k)?'map':/Ngọc|giản/.test(k)?'slip':/Nanh/.test(k)?'fang':'token';
 if(it.cat==='lieu'){const t=it.tier||1,ty=it.type;
  if(ty==='thao')return t>=6?'ginseng':t>=3?'lingzhi':'herb';if(ty==='moc')return 'herb';
  if(ty==='khoang')return t>=6?'meteor':t>=3?'crystal':'ore';
  if(ty==='yeudan'||/Yêu đan/.test(k))return 'core';
  if(ty==='thu')return t%3===0?'bone':t%2?'fang':'pelt';
  if(ty==='thuy')return 'crystal';if(ty==='sa')return 'shard';if(ty==='ngoc')return 'stone';if(ty==='huyet')return 'pill_red';return 'ore'}
 return 'orb'}

// biến thể màu theo hệ/tên để các vật phẩm dùng chung icon vẫn nhìn khác nhau + ánh sáng theo cấp
const HUES=[[/Hỏa|Xích|Liệt|Phượng|Diễm|Viêm|Dương|Huyết/,0],[/Thủy|Băng|Hàn|Âm|Tuyết|Giao|Huyền Vũ/,205],[/Mộc|Thanh|Linh Chi|Liên|Diệp|Tùng|Thảo/,110],[/Lôi|Tử |Tinh Thần/,275],[/Thổ|Hoàng|Sơn|Địa/,32],[/Kim|Bạch/,52],[/Hắc|Mặc|Ám|Quỷ|U Minh/,235]];
const BASEH={pill_red:0,pill_gold:45,crystal:215,stone:215,shard:140,core:40,herb:110,lingzhi:355,ginseng:35,talis_gold:45,talis_blue:210,furnace:25,plate:30};
function hashS(s){let h=0;for(const c of String(s))h=(h*131+c.charCodeAt(0))>>>0;return h}
function itemFilter(k){try{const ic=nameOfItem(k),it=ITEMS[k]||{};const f=[];
 if(ic in BASEH){let hue=null;for(const [re,h] of HUES)if(re.test(k)){hue=h;break}
  const rot=hue==null?((hashS(k)%7)-3)*22:((hue-BASEH[ic])%360+360)%360;
  if(rot%360)f.push('hue-rotate('+Math.round(rot)+'deg)');f.push('saturate(1.12)')}
 const t=it.tier||0;if(t>=5)f.push('drop-shadow(0 0 4px rgba(255,214,102,.95))');else if(t>=3)f.push('drop-shadow(0 0 3px rgba(255,255,255,.7))');
 return f.length?'filter:'+f.join(' '):''}catch(e){return ''}}
function itemCls(k){const t=(ITEMS[k]||{}).tier||0;return t>=6?'gr6':t>=5?'gr5':t>=4?'gr4':t>=3?'gr3':''}
window.__itemFilter=itemFilter;window.__itemCls=itemCls;
window.__nameOfItem=nameOfItem;
const itemSpr=(k,px)=>{try{const h=window.__ic2&&__ic2.html(k,px);if(h)return h}catch(e){}return spr(nameOfItem(k),px,itemFilter(k))};
const TYPE_NAME=(ty,t)=>nameOfItem('__'+ty+t);
// ghi đè hàm icon cũ để mọi chỗ trong game dùng icon thủy mặc
const _ii=window.itemIco;
window.itemIco=function(k,sz){try{const u=iconUrl(nameOfItem(k));if(u)return `<img class="iico" src="${u}" width="${sz||22}" height="${sz||22}" alt="" style="${itemFilter(k)}">`}catch(e){}return _ii.apply(this,arguments)};
const _mi=window.matIco;
window.matIco=function(ty,t,sz){try{const fake={cat:'lieu',type:ty,tier:t};const nm=(function(){ if(ty==='thao')return t>=6?'ginseng':t>=3?'lingzhi':'herb';if(ty==='khoang')return t>=6?'meteor':t>=3?'crystal':'ore';if(ty==='yeudan')return 'core';if(ty==='thu')return t%3===0?'bone':t%2?'fang':'pelt';return nameOfItem('__x')})();const u=iconUrl(nm);if(u)return `<img class="iico" src="${u}" width="${sz||26}" height="${sz||26}" alt="">`}catch(e){}return _mi.apply(this,arguments)};

const GC=['#8a8a82','#3f8f55','#3a72c9','#8a5fd0','#d9822b','#d04a3c','#c9a227'];
const css=document.createElement('style');css.textContent=`
.bic{display:inline-block;background-repeat:no-repeat;vertical-align:middle}
.bgx{position:relative}
.bgx h2{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.bg-tabs{display:flex;gap:6px;margin:8px 0 10px;flex-wrap:wrap}
.bg-tab{display:flex;align-items:center;gap:6px;padding:6px 12px 6px 8px;border:1px solid #bda977;border-radius:20px;background:rgba(251,246,234,.9);cursor:pointer;font:600 13px inherit;color:#2b2117}
.bg-tab.on{background:linear-gradient(180deg,#f4d77d,#d6a944);border-color:#8b6a1c}
.bg-tab small{opacity:.7;font-weight:500}
.bg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(66px,1fr));gap:8px}
.bg-t{position:relative;aspect-ratio:1;border:2px solid var(--gc,#b8a67a);border-radius:6px;background:radial-gradient(circle at 50% 40%,#fbf6e6,#e4dac0);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08),0 1px 3px rgba(60,40,10,.2);transition:transform .1s}
.bg-t:hover{transform:translateY(-2px)}
.bg-t.on{outline:3px solid #f4d77d;outline-offset:1px;box-shadow:0 0 12px rgba(214,169,68,.8)}
.bg-t .bic,.bg-t .gi{width:78%;height:78%;transform-origin:center}
.bg-t.empty .bic{opacity:.18;filter:grayscale(1)}
.bg-t.lock{opacity:.55}
.bg-t .n{position:absolute;right:3px;bottom:1px;font:700 12px "Noto Serif",serif;color:#2b2117;text-shadow:0 0 3px #fff,0 0 3px #fff}
.bg-t .sl{position:absolute;left:0;right:0;top:1px;text-align:center;font-size:9.5px;opacity:.7;letter-spacing:.03em}
.bg-t .gi{display:block;background-repeat:no-repeat}
.bg-det{margin-top:12px;border:1px solid #bda977;border-radius:10px;padding:10px 14px;background:rgba(251,246,234,.92);min-height:70px}
.bg-det .v7gl{display:flex;align-items:center;gap:8px}
.bg-det .dh{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:4px}.bg-det .dh .mini{margin-left:auto}
.bg-det .dx{font-size:13px;line-height:1.5}
.bg-det .dn{font:700 16px "Noto Serif",serif}
.bg-empty{font-size:13px;opacity:.7;padding:6px 2px}
.bg-eq{display:grid;grid-template-columns:minmax(110px,170px) 1fr;gap:12px;align-items:stretch}
.bg-eq .me{border:1px solid #bda977;border-radius:8px;background:radial-gradient(ellipse at 50% 30%,#fbf6e6,#e4dac0);display:flex;align-items:flex-end;justify-content:center;overflow:hidden;min-height:200px}
.bg-eq .me .fig{height:100%;max-height:260px}
@media (max-width:640px){.bg-eq{grid-template-columns:1fr}.bg-eq .me{display:none}.bg-grid{grid-template-columns:repeat(auto-fill,minmax(58px,1fr))}}
`;document.head.appendChild(css);

const SLOT_ICON={vu:'sword',mu:'hat',ao:'robe',giap:'armor',choang:'cloak',gang:'bracers',dai:'belt',giay:'boots',day:'necklace',nhan1:'ring',nhan2:'ring',boi:'jade'};
const esc_=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// tách icon của kho trang bị cũ (v7gi) từ gLabel
function gearIcon(it){try{const h=gLabel(it);const m=/<i class="v7sp v7gi" style="([^"]*)"><\/i>/.exec(h);if(m){const st=m[1].replace(/width:\d+px;height:\d+px;/,'').replace(/background-size:(\d+)px (\d+)px;background-position:(-?\d+)px (-?\d+)px/,(a,w,h2,x,y)=>`background-size:${(+w)/36*100}% ${(+h2)/36*100}%;background-position:${Math.abs(+x)/(+w-36)*100}% ${Math.abs(+y)/(+h2-36)*100}%`);return `<i class="gi" style="${st}"></i>`}}catch(e){}return spr(SLOT_ICON[it.slot]||'sword',48)}
const BG={tab:'eq',sel:null};
function consList(){return Object.keys(S.items).filter(k=>ITEMS[k]&&!['lieu','chau'].includes(ITEMS[k].cat))}
function matList(){return Object.keys(S.items).filter(k=>['lieu','chau'].includes(ITEMS[k]?.cat)).sort()}
function setBadge(it,px){try{const c=it&&it.set&&window.V7SETC&&window.V7SETC[it.set];return c&&window.v7Spr?window.v7Spr(c,px||22,'setm'):''}catch(e){return ''}}
function tileGear(it,key,extra){const g=Math.min(6,it.g||0),c=GC[g];return `<button type="button" class="bg-t gr${g}${it.set?' isset':''} ${extra||''}" style="--gc:${c}" data-k="${key}">${gearIcon(it)}${setBadge(it)}</button>`}
function renderBody(){
 const host=$('#modal .bg-body');if(!host)return;const tab=BG.tab;let html='';
 if(tab==='eq'){
  const me=(typeof myPortrait==='function')?myPortrait():'';
  html=`<div class="bg-eq"><div class="me par">${window.v9Fig?v9Fig(me):''}</div><div class="bg-grid">${EQ_SLOTS.map(k=>{const it=S.gear[k];
   return it?`${tileGear(it,'eq:'+k)}`.replace('<button','<button').replace('</button>',`<span class="sl">${EQ_N[k]}</span></button>`):`<button type="button" class="bg-t empty" data-k="eq:${k}">${spr(SLOT_ICON[k],48)}<span class="sl">${EQ_N[k]}</span></button>`}).join('')}</div></div>`}
 else if(tab==='kho'){html=S.gearBag.length?`<div class="bg-grid">${S.gearBag.map((it,i)=>tileGear(it,'gb:'+i,gearUsable(it)?'':'lock')).join('')}</div>`:'<div class="bg-empty">Kho trang bị trống.</div>'}
 else if(tab==='dan'){const L=consList();html=L.length?`<div class="bg-grid">${L.map(k=>`<button type="button" class="bg-t ${itemCls(k)}" data-k="it:${esc_(k)}" style="--gc:#b8a67a">${itemSpr(k,64)}<span class="n">${S.items[k]}</span></button>`).join('')}</div>`:'<div class="bg-empty">Chưa có đan dược, phù hay bảo vật.</div>'}
 else{const L=matList();html=L.length?`<div class="bg-grid">${L.map(k=>`<button type="button" class="bg-t ${itemCls(k)}" data-k="mt:${esc_(k)}" style="--gc:#b8a67a">${itemSpr(k,64)}<span class="n">${S.items[k]}</span></button>`).join('')}</div>`:'<div class="bg-empty">Chưa có nguyên liệu. Hái thảo, khai khoáng, săn yêu thú để có.</div>'}
 host.innerHTML=html;
 const det=$('#modal .bg-det');
 if(BG.sel&&BG.sel.startsWith(tab==='eq'?'eq:':tab==='kho'?'gb:':tab==='dan'?'it:':'mt:'))showDet(BG.sel);else{BG.sel=null;det.innerHTML='<div class="bg-empty">Chọn một ô để xem chi tiết.</div>'}
}
function showDet(key){BG.sel=key;const det=$('#modal .bg-det');if(!det)return;
 $$('#modal .bg-t').forEach(b=>b.classList.toggle('on',b.dataset.k===key));
 const [t,id]=[key.slice(0,2),key.slice(3)];let h='';
 if(t==='eq'){const it=S.gear[id];h=it?`<div class="dh">${gLabel(it)}<button class="mini" onclick="unGear('${id}')">Tháo</button></div><div class="dx">${gDesc(it)}</div>`:`<div class="dh"><b class="dn">${EQ_N[id]}</b></div><div class="dx small">Ô trống. Mặc trang bị từ Kho trang bị.</div>`}
 else if(t==='gb'){const it=S.gearBag[+id];if(it){const lk=!gearUsable(it);h=`<div class="dh">${gLabel(it)}${lk?`<span class="small">🔒 cần ${it.t>S.realm+2?'cảnh giới cao hơn':REALMS[gReq(it.g)].name}</span>`:`<button class="mini jade" onclick="eqGear(${+id})">Mặc → ${EQ_N[targetSlot(it)]}</button>`}</div><div class="dx">${gDesc(it)}</div>`}}
 else if(t==='it'){const k=id,it=ITEMS[k]||{};h=`<div class="dh"><span>${itemSpr(k,32)}</span><b class="dn">${esc_(k)}</b> <span>×${S.items[k]}</span><button class="mini" data-use="${esc_(k)}">Dùng / xem</button></div><div class="dx">${it.desc||''}${itemSource(k)?`<div class="small">📍 ${itemSource(k)}</div>`:''}</div>`}
 else if(t==='mt'){const k=id,it=ITEMS[k]||{};h=`<div class="dh"><span>${itemSpr(k,32)}</span><b class="dn">${esc_(k)}</b> <span>×${S.items[k]}</span></div><div class="dx">${it.tier?'Cấp '+it.tier+' · ':''}giá ${it.price}<div class="small">📍 ${itemSource(k)}</div></div>`}
 det.innerHTML=h||'<div class="bg-empty">—</div>';
 const u=$('[data-use]',det);if(u)u.onclick=()=>{closeModal();useItem(u.dataset.use)}}
function bagUI(){
 const m=$('#modal');if(!m||m.classList.contains('vnmodal')||m.classList.contains('crmodal'))return;const h2=$('h2',m);if(!h2||!/Hành trang/.test(h2.textContent))return;if($('.bgx',m))return;
 const intro=$('p.small',m),sslot=$('.sslot',m);const close=$('.mclose',m);
 const x=document.createElement('div');x.className='bgx';
 x.appendChild(h2);if(intro)x.appendChild(intro);if(sslot)x.appendChild(sslot);
 const tabs=document.createElement('div');tabs.className='bg-tabs';
 const T=[['eq','robe','Đang mặc',`${Object.values(S.gear).filter(Boolean).length}/12`],['kho','armor','Kho trang bị',S.gearBag.length],['dan','bottle','Đan · Phù · Bảo',consList().length],['mat','herb','Nguyên liệu',matList().length]];
 tabs.innerHTML=T.map(([k,ic,l,n])=>`<button type="button" class="bg-tab ${BG.tab===k?'on':''}" data-t="${k}">${spr(ic,22)}${l} <small>${n}</small></button>`).join('');
 const body=document.createElement('div');body.className='bg-body';const det=document.createElement('div');det.className='bg-det';
 const fb=document.createElement('div');fb.className='btns';fb.innerHTML='<button onclick="closeModal()">Đóng</button>';
 x.append(tabs,body,det,fb);
 m.innerHTML='';if(close)m.appendChild(close);m.appendChild(x);
 tabs.addEventListener('click',e=>{const b=e.target.closest('.bg-tab');if(!b)return;BG.tab=b.dataset.t;$$('.bg-tab',tabs).forEach(t=>t.classList.toggle('on',t===b));renderBody()});
 m.addEventListener('click',e=>{const t=e.target.closest('.bg-t');if(t&&m.contains(t))showDet(t.dataset.k)});
 renderBody();
}
const _ob=window.openBag;
window.openBag=function(){const r=_ob.apply(this,arguments);try{bagUI()}catch(e){console.error('v9 bagUI',e)}return r};
// gear thay đổi (tháo/mặc) thì game mở lại hành trang: nhớ tab
try{PATCH_NOTES.unshift(['v9.2 · 07/11/2026 · Túi đồ icon thủy mặc',[
 'Hành trang làm lại dạng lưới ô vuông: trang bị đang mặc, kho trang bị, đan phù bảo vật, nguyên liệu, mỗi món là một icon vẽ thủy mặc; bấm vào ô để xem chi tiết rồi mới dùng hoặc mặc.',
 'Linh châu, thảo dược, khoáng thạch, yêu đan, đan dược, phù, trận bàn đều có icon mới ở túi đồ, chợ và các bảng khác.']])}catch(e){}
})();
