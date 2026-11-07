/* ===== v10.0 · 5 dáng người · hào quang theo phẩm · nhiều trang phục ===== */
(function(){
const D=window.DOLL;if(!D)return;
const MAN=D.man;
const items=(pose,kind)=>MAN[pose]?MAN[pose].items.filter(i=>i.kind===kind):[];
const get=(pose,kind,id)=>items(pose,kind).find(i=>i.id===id);
// ---------- 5 dáng người mỗi giới (biến dạng ảnh theo hàng ngang/dọc, đầu giữ nguyên) ----------
// sh vai · ch ngực · wa eo · hp hông · th đùi · lw gấu/chân (hệ số ngang) · vt thân dài · v chân dài (hệ số dọc)
const BODIES={
 nu1:[
  {id:'can',name:'Cân đối',d:'Dáng chuẩn, hài hòa.',hf:.97,sh:1,ch:1,wa:1,hp:1,th:1,lw:1,vt:1,v:1},
  {id:'manh',name:'Thanh mảnh',d:'Mảnh mai, eo thon, tay chân dài.',hf:.98,sh:.94,ch:.93,wa:.82,hp:.91,th:.92,lw:.94,vt:1,v:1.04},
  {id:'day',name:'Đầy đặn',d:'Ngực đầy hông nở, đường cong rõ.',hf:.96,sh:1.02,ch:1.13,wa:.98,hp:1.22,th:1.17,lw:1.1,vt:1,v:.98},
  {id:'cao',name:'Cao ráo',d:'Dáng cao, chân dài.',hf:1,sh:1,ch:.98,wa:.9,hp:.98,th:.98,lw:1,vt:1.03,v:1.07},
  {id:'nho',name:'Nhỏ nhắn',d:'Thấp nhỏ, đáng yêu.',hf:.89,sh:.93,ch:.96,wa:.9,hp:.95,th:.95,lw:.94,vt:.96,v:.88}],
 nam1:[
  {id:'can',name:'Cân đối',d:'Dáng chuẩn, khỏe vừa phải.',hf:.97,sh:1,ch:1,wa:1,hp:1,th:1,lw:1,vt:1,v:1},
  {id:'thu',name:'Thư sinh',d:'Gầy thanh, nho nhã.',hf:.98,sh:.9,ch:.88,wa:.88,hp:.9,th:.9,lw:.92,vt:1,v:1.04},
  {id:'vam',name:'Vạm vỡ',d:'Vai rộng ngực dày, sức mạnh.',hf:1,sh:1.17,ch:1.17,wa:1.1,hp:1.07,th:1.1,lw:1.08,vt:1,v:1},
  {id:'cao',name:'Cao lớn',d:'Cao hơn người, bước dài.',hf:1,sh:1.05,ch:1.04,wa:1,hp:1,th:1,lw:1,vt:1.03,v:1.07},
  {id:'thap',name:'Thấp rắn',d:'Thấp mà chắc nịch.',hf:.89,sh:1.1,ch:1.12,wa:1.1,hp:1.08,th:1.08,lw:1.08,vt:.96,v:.88}]};
D.BODIES=BODIES;
const AXIS={nu1:450,nam1:456};
const Y={neck:262,sh:300,ch:385,wa:455,hp:565,th:720,lw:1000};
function profile(b){return [[0,1],[Y.neck,1],[Y.sh,b.sh],[Y.ch,b.ch],[Y.wa,b.wa],[Y.hp,b.hp],[Y.th,b.th],[Y.lw,b.lw],[1300,b.lw]]}
function interp(pts,y){if(y<=pts[0][0])return pts[0][1];for(let i=1;i<pts.length;i++){if(y<=pts[i][0]){const t=(y-pts[i-1][0])/(pts[i][0]-pts[i-1][0]);const s=t*t*(3-2*t);return pts[i-1][1]+(pts[i][1]-pts[i-1][1])*s}}return pts[pts.length-1][1]}
// hàm ánh xạ dọc y -> y' (chưa dời)
function vmap(b,y){if(y<=Y.neck)return y;const a=Math.min(y,Y.hp)-Y.neck;let r=Y.neck+a*b.vt;if(y>Y.hp)r+=(y-Y.hp)*b.v;return r}
D.warp=function(src,pose,dangId,bottom,top){
 const list=BODIES[pose];const b=list&&list.find(x=>x.id===dangId);if(!b)return {c:src,dy:0,k:1};
 const W=src.width,H=src.height,ax=AXIS[pose]||W/2;
 const sh=b.id==='can'?0:Math.round(bottom-vmap(b,bottom));
 const tmp=document.createElement('canvas');tmp.width=W;tmp.height=H;const x=tmp.getContext('2d');x.imageSmoothingQuality='high';
 if(b.id==='can')x.drawImage(src,0,0);else{
  const pts=profile(b);const STEP=2;
  for(let yo=0;yo<H;yo+=STEP){let lo=0,hi=H+200;for(let k=0;k<18;k++){const m=(lo+hi)/2;if(vmap(b,m)+sh<yo)lo=m;else hi=m}
   const ys=Math.min(H-1,Math.max(0,lo));const s=interp(pts,ys);
   x.drawImage(src,0,Math.floor(ys),W,STEP,ax-ax*s,yo,W*s,STEP)}}
 // thu phóng đều quanh chân để vừa khung, nhân hệ số chiều cao dáng
 const newTop=top+sh;let k=b.hf||1;const fit=(bottom-4)/Math.max(1,bottom-newTop);if(fit<k)k=fit;
 if(Math.abs(k-1)<.004)return {c:tmp,dy:sh,k:1};
 const out=document.createElement('canvas');out.width=W;out.height=H;const o=out.getContext('2d');o.imageSmoothingQuality='high';
 o.translate(ax,bottom);o.scale(k,k);o.translate(-ax,-bottom);o.drawImage(tmp,0,0);
 return {c:out,dy:sh,k,bottom}};
D.bodyOpts=pose=>BODIES[pose]||[];
// ---------- hào quang theo phẩm: nguồn mở khóa ----------
const COL={4:'#9a5ad6',5:'#e2b53c',6:'#e0452f'};
const PN={4:'Thánh',5:'Chí Tôn',6:'Hồng Mông'};
D.PHAM=PN;D.PHAM_COL=COL;
// tên đặc tính (từ phẩm Thánh) -> chủ đề hào quang
const AURA_OF={
 'Bất Diệt Kim Thân':'kimquang','Kim Cang Bất Hoại':'kimquang','Thánh thể':'thanhquang','Trường Sinh':'thanhquang',
 'Thiên Đạo Chi Tử':'thiendao','Thiên Đạo sủng nhi':'thiendao','Khí vận chi tử':'thiendao',
 'Tử Vi đế tinh':'tukhi','Thiên mệnh chi tử':'tukhi','Kiếp vận chi tử':'lei',
 'Hỗn Độn linh căn':'hondon','Hỗn Độn thể':'hondon','Vô mệnh chi nhân':'hondon','Nghịch thiên chi mệnh':'nghich',
 'Tiên linh căn':'lienhoa','Tiên Thiên Đạo Thể':'lienhoa','Thiên linh căn':'lienhoa',
 'Thiên Phượng thể':'phuong','Bất Tử Điểu':'phuong','Bất Tử Chi Thân':'phuong',
 'Thiên Ma':'mama','Thiên Ma thể':'mama','Huyết Sát':'huyet','Hung Tinh Chiếu Mệnh':'huyet','Thiên Sát Cô Tinh':'huyet',
 'Kiếm Chủng':'kiem','Đan Tổ Chuyển Thế':'dan','Linh Hồ Mị Cốt':'ho','Yêu Hoàng Huyết':'yeu','Vạn Thú Chi Chủ':'yeu',
 'Luân Hồi Giả':'luanhoi','Luân Hồi thể':'luanhoi','Thiên Cơ Diễn Toán':'thienco','Thiên thạch':'thienco','Thiên Khôi':'thienco','Vận May Nghịch Thiên':'nghich',
 'Hư Không thể':'hukhong','Hỗn Nguyên thể':'thaicuc','Đạo Tâm Kiên Định':'thaicuc',
 'Tuệ căn thâm hậu':'tinhha','Thiên túng kỳ tài':'tinhha','Sinh nhi tri chi':'tinhha','Thiên Kiêu':'tinhha','Tụ Linh Thể':'tulinh'};
const AURA_NAME={kimquang:'Kim quang hộ thể',thanhquang:'Thánh quang',thiendao:'Thiên đạo kim luân',tukhi:'Tử khí đông lai',lei:'Lôi kiếp quanh thân',hondon:'Hỗn độn khí xoáy',nghich:'Nghịch thiên vận khí',lienhoa:'Tiên khí liên hoa',phuong:'Phượng hoàng liệt hỏa',mama:'Ma khí cuồn cuộn',huyet:'Huyết sát hồng vụ',kiem:'Kiếm khí tung hoành',dan:'Đan hỏa dược hương',ho:'Hồ ảnh cửu vĩ',yeu:'Yêu hoàng thú ảnh',luanhoi:'Luân hồi pháp luân',thienco:'Thiên cơ bát quái',hukhong:'Hư không liệt ngân',thaicuc:'Thái cực hỗn nguyên',tinhha:'Tuệ nhãn tinh hà',tulinh:'Tụ linh vòng xoáy'};
D.AURA_NAME=AURA_NAME;
// gom nguồn từ trạng thái (CR khi tạo nhân vật, S khi đang chơi)
D.auraSources=function(ctx){const o=[];const add=(n,g,from)=>{if(n&&g>=4)o.push({n,g:Math.min(6,g),from,t:AURA_OF[n]||null})};
 try{if(ctx==='cr'&&typeof CR!=='undefined'&&CR&&CR.lc){add(CR.lc.name,CR.lc.g,'Linh căn');if(CR.body)add(CR.body.n,CR.body.g,'Thể chất');if(CR.ngo)add(CR.ngo.n,CR.ngo.g,'Ngộ tính');if(CR.menh)add(CR.menh.name,CR.menh.g,'Thiên mệnh');if(CR.mc)add(CR.mc.n||CR.mc.name,CR.mc.g,'Mệnh cách');(CR.tal||[]).forEach(t=>add(t.n,t.g,'Thiên phú'))}
  else if(typeof S!=='undefined'&&S&&S.menh){if(S.linhCan)add(S.linhCan.name,S.linhCan.g,'Linh căn');if(S.body10)add(S.body10.n,S.body10.g,'Thể chất');if(S.ngo10)add(S.ngo10.n,S.ngo10.g,'Ngộ tính');add(S.menh.name,S.menh.g,'Thiên mệnh');
   if(S.mc&&typeof MC!=='undefined'&&MC[S.mc])add(MC[S.mc].n,MC[S.mc].g,'Mệnh cách');(S.talents||[]).forEach(t=>add(t.n,t.g,'Thiên phú'))}}catch(e){console.warn(e)}
 o.sort((a,b)=>b.g-a.g);return o};
// các chủ đề đã mở khóa (không trùng), cao phẩm trước
D.auraUnlocked=function(ctx){const seen={};const out=[];for(const s of D.auraSources(ctx)){const t=s.t||'thienco';if(seen[t])continue;seen[t]=1;out.push({id:t,name:AURA_NAME[t]||t,g:s.g,from:s.n})}return out};
const ARTALIAS={thanhquang:'haoquang',lienhoa:'sen',thiendao:'rong'};
const artOf=(pose,id)=>get(pose,'fxb',id)||get(pose,'fxb',ARTALIAS[id]);
// ---------- vẽ ghép (thay bản cũ) ----------
D.draw=function(look,mode){const pose=look.pose||'nu1';const M=MAN[pose];if(!M)return null;
 const mk=()=>{const c=document.createElement('canvas');c.width=M.W;c.height=M.H;return c};
 const put=(x,it)=>{const im=it&&D.img[it.file];if(im)x.drawImage(im,it.x,it.y)};
 let body=mk();const bx=body.getContext('2d');
 const base=get(pose,'outfit','base');const of=get(pose,'outfit',look.outfit)||base;
 put(bx,of);
 const h=get(pose,'hair',look.hair);
 if(h&&h.er&&D.img[h.er]){bx.save();bx.globalCompositeOperation='destination-out';bx.drawImage(D.img[h.er],h.ex,h.ey);bx.restore()}
 put(bx,get(pose,'face',look.face));put(bx,h);
 for(const a of (look.acc||[]))put(bx,get(pose,'acc',a));
 let dy=0,kk=1,bot=1150;
 if(look.dang){bot=Math.min(M.H-2,((of&&of.y+of.h)||1150));const top=Math.min(of?of.y:94,h?h.y:94,20);const w=D.warp(body,pose,look.dang,bot,top);body=w.c;dy=w.dy;kk=w.k||1}
 const out=mk(),ox=out.getContext('2d');
 // hào quang: vòng sáng theo phẩm (phía sau) + tranh chủ đề
 if(look.fxb&&look.ag>=4)glow(ox,M,look.ag);
 put(ox,look.fxb&&artOf(pose,look.fxb));ox.drawImage(body,0,0);put(ox,look.fxf&&get(pose,'fxf',look.fxf));
 const c2=document.createElement('canvas');let sx=0,sy=0,sw=M.W,sh=M.H,ow=448,oh=600;
 const BUST=[196,20,510,680],HEAD=[311,45,280,280];
 if(mode==='bust'){[sx,sy,sw,sh]=BUST;ow=340;oh=Math.round(340*sh/sw)}
 else if(mode==='head'){[sx,sy,sw,sh]=HEAD;ow=oh=200}
 if(mode==='bust'||mode==='head'){const yh=sy+sh/2;const nyh=bot+(yh+dy-bot)*kk;const nx=AXIS[pose]+(sx+sw/2-AXIS[pose])*kk;sy=nyh-sh*kk/2*1;sx=nx-sw*kk/2;sw*=kk;sh*=kk}
 c2.width=ow;c2.height=oh;const cx=c2.getContext('2d');cx.imageSmoothingQuality='high';cx.drawImage(out,sx,sy,sw,sh,0,0,ow,oh);
 return c2};
function glow(x,M,g){const col=COL[g]||'#e2b53c';const cx=450,cy=560;x.save();
 const r=x.createRadialGradient(cx,cy,60,cx,cy,520);r.addColorStop(0,col+'00');r.addColorStop(.45,col+(g>=6?'66':'44'));r.addColorStop(.8,col+'1a');r.addColorStop(1,col+'00');
 x.fillStyle=r;x.fillRect(0,0,M.W,M.H);
 // tia
 x.globalAlpha=g>=6?.3:.2;x.translate(cx,300);const n=g>=6?28:g>=5?20:14;
 for(let i=0;i<n;i++){x.rotate(Math.PI*2/n);const lg=x.createLinearGradient(0,0,0,430);lg.addColorStop(0,col+'ee');lg.addColorStop(1,col+'00');x.fillStyle=lg;x.beginPath();x.moveTo(-6,0);x.lineTo(6,0);x.lineTo(0,430);x.fill()}
 x.restore()}
// ---------- tích hợp vào khung chọn ----------
const _kinds=D.KINDS;
D.KINDS=[['dang','Dáng người',0],['face','Khuôn mặt',0],['hair','Kiểu tóc',0],['outfit','Trang phục',0],['acc','Phụ kiện',1],['fxb','Hào quang',1],['fxf','Hiệu ứng',1]];
const ctxOf=ctx=>ctx==='cr'?'cr':'me';
const _ctxLook=L=>L;
// danh sách theo loại, có lọc hào quang theo đặc tính
const listOf=(ctx,pose,kind)=>{
 if(kind==='dang')return BODIES[pose]||[];
 if(kind==='fxb'){return D.auraUnlocked(ctxOf(ctx)).map(u=>({id:u.id,name:u.name,kind:'fxb'}))}
 return items(pose,kind)};
const lookOf=ctx=>ctx==='cr'?(CR.doll||(CR.doll=D.rollLook(CR.gender))):(()=>{const L=LK();return L.doll||(L.doll=D.rollLook(S.gender))})();
const gOf=ctx=>ctx==='cr'?CR.gender:S.gender;
D.step=function(ctx,kind,d){const L0=lookOf(ctx);const L=D.fixLook(L0,gOf(ctx));if(!L)return;const pose=L.pose;
 const opt=(D.KINDS.find(k=>k[0]===kind)||[0,0,0])[2];const list=listOf(ctx,pose,kind);
 if(!list.length&&kind!=='acc')return;
 if(kind==='acc'){const al=items(pose,'acc');const ids=['',...al.map(i=>i.id)];const cur=L.acc[0]||'';const n=(ids.indexOf(cur)+d+ids.length)%ids.length;L.acc=ids[n]?[ids[n]]:[]}
 else if(kind==='dang'){const ids=list.map(i=>i.id);const n=(ids.indexOf(L.dang||'can')+d+ids.length)%ids.length;L.dang=ids[n]}
 else{const ids=(opt?['']:[]).concat(list.map(i=>i.id));const n=(ids.indexOf(L[kind]||'')+d+ids.length)%ids.length;L[kind]=ids[n];
  if(kind==='fxb'){L.fxbSet=1;const u=D.auraUnlocked(ctxOf(ctx)).find(x=>x.id===L.fxb);L.ag=u?u.g:0}}
 D.refresh(ctx)};
// tên hiển thị
const _names=D.names;
D.names=function(L){const o=_names(L);const b=(BODIES[L.pose]||[]).find(x=>x.id===(L.dang||'can'));o.dang=b?b.name:'Cân đối';
 if(L.fxb){o.fxb=AURA_NAME[L.fxb]||o.fxb}else o.fxb='Không';return o};
D.rows=function(ctx){const L=D.fixLook(lookOf(ctx),gOf(ctx));if(!L)return '';const nm=D.names(L);const pose=L.pose;
 const un=D.auraUnlocked(ctxOf(ctx));
 return D.KINDS.filter(k=>{if(k[0]==='fxb')return true;if(k[0]==='dang')return true;return items(pose,k[0]).length}).map(([k,lab])=>{
  if(k==='fxb'&&!un.length)return `<div class="dlr"><span class="dll">${lab}</span><b class="dln" data-k="fxb" style="opacity:.6">🔒 cần phẩm Thánh+</b></div>`;
  return `<div class="dlr"><span class="dll">${lab}</span><button class="mini" onclick="DOLL.step('${ctx}','${k}',-1)">◀</button><b class="dln" data-k="${k}">${esc(nm[k])}</b><button class="mini" onclick="DOLL.step('${ctx}','${k}',1)">▶</button></div>`}).join('')
  +`<div class="dlr"><button class="mini" onclick="DOLL.roll('${ctx}')">🎲 Ngẫu nhiên</button></div>`};
// look mặc định / chuẩn hóa
const _roll=D.rollLook;
D.rollLook=function(g){const L=_roll(g);if(!L)return L;const bl=BODIES[L.pose]||[];L.dang=bl.length?bl[Math.floor(Math.random()*bl.length)].id:'can';return L};
const _fix=D.fixLook;
D.fixLook=function(L,g){L=_fix(L,g);if(!L)return L;const bl=BODIES[L.pose]||[];if(!bl.some(b=>b.id===L.dang))L.dang='can';
 // hào quang chỉ giữ khi còn được mở khóa
 try{const ctx=(typeof CR!=='undefined'&&CR&&CR.doll===L)?'cr':'me';const un=D.auraUnlocked(ctx);
  if(L.fxb&&!un.some(u=>u.id===L.fxb)){L.fxb='';L.ag=0}
  if(!L.fxb&&!L.fxbSet&&un.length){L.fxb=un[0].id}
  if(L.fxb){const u=un.find(x=>x.id===L.fxb);L.ag=u?u.g:0}else L.ag=0}catch(e){}
 return L};
// tự gán hào quang cao phẩm nhất khi vừa mở khóa
D.syncAura=function(L,ctx){try{const un=D.auraUnlocked(ctx||'me');if(un.length&&!L.fxbSet){L.fxb=un[0].id;L.ag=un[0].g}}catch(e){}return L};
// NPC: bậc cao (Hóa Thần+) hoặc Boss có hào quang theo cảnh giới
const _npc=D.npcLook;
D.npcLook=function(key,o){const L=_npc(key,o);if(!L)return L;o=o||{};const h=hashStr(String(key));const bl=BODIES[L.pose]||[];L.dang=bl[Math.abs(h>>9)%bl.length].id;
 if(o.realm>=6){L.fxb=(items(L.pose,'fxb')[0]||{}).id||'';L.ag=o.realm>=8?6:o.realm>=7?5:4}return L};
// vẽ lại khi đổi: xóa bộ nhớ đệm
D.memo.clear();
try{PATCH_NOTES.unshift(['v10.0 · 07/11/2026 · 5 dáng người, thêm trang phục, hào quang theo phẩm',[
 'Mỗi giới có 5 dáng người (nữ: Cân đối, Thanh mảnh, Đầy đặn, Cao ráo, Nhỏ nhắn; nam: Cân đối, Thư sinh, Vạm vỡ, Cao lớn, Thấp rắn). Dáng áp lên mọi trang phục và kiểu tóc.',
 'Thêm 13 bộ trang phục nữ vẽ mới (nữ tướng kim giáp, thanh long cung bào, hồ yêu, ma nữ, dạ hành, thôn nữ, quận chúa, đạo cô…).',
 'Hào quang chỉ xuất hiện khi nhân vật có linh căn, thể chất, ngộ tính, thiên mệnh, mệnh cách hay thiên phú từ phẩm Thánh trở lên. Phẩm Thánh quầng tím, Chí Tôn quầng vàng, Hồng Mông quầng đỏ; mỗi đặc tính có chủ đề riêng (Thiên Đạo kim luân, Phượng hoàng liệt hỏa, Luân hồi pháp luân…).']])}catch(e){}
})();
// ---------- bỏ hệ nhân vật chibi cũ: chỉ còn "Đổi diện mạo" ----------
(function(){
const _ol=window.openLook;
window.openLook=function(tab){const r=_ol.apply(this,arguments);try{document.querySelectorAll('#modal .bspr').forEach(b=>b.remove())}catch(e){}return r};
window.openSprPick=function(){try{openDoll()}catch(e){}};
})();
// ---------- cụ già cũng dùng nhân vật ghép (tóc bạc) ----------
(function(){
const D=window.DOLL;if(!D)return;
const _sp=window.spritePerson;
window.spritePerson=function(key,gender,sect,evil,look){const r=_sp.apply(this,arguments);
 try{if(typeof r==='string'&&!r.endsWith('#doll')&&D.ready&&D.pose(gender)&&!(look&&look.spr!=null)){
   const n=S&&S.npcs?S.npcs.find(x=>x.name===key):null;const L=D.npcLook(key,{evil:evil||(n&&n.evil),realm:(n&&n.realm)||2,gender});
   if(L){const hb=D.opts('hair',L.pose).find(h=>h.id==='bac');if(hb)L.hair='bac';const u=D.url(L,'full');if(u)return u}}}catch(e){}
 return r};
})();
