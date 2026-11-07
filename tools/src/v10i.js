/* ===== v10.12 · Lớp vũ khí và bảo khí cho nhân vật ghép lớp ===== */
(function(){
const D=window.DOLL;if(!D)return;
// tư thế đã cầm sẵn vũ khí trong ảnh gốc: không ghép thêm vũ khí thường
D.HELD={nam2:1,nam4:1,nam5:1,nu6:1,nu3:1};
// pv: điểm cầm (tỷ lệ chiều cao ảnh từ đỉnh), len: độ dài so với chiều cao nhân vật
const W={
 kiem:{n:'Trường kiếm đeo lưng',f:'wpn_kiem',mount:'back',pv:.72,len:.62,rot:204,dx:.10,dy:.115},
 dao:{n:'Quỷ đầu đao đeo lưng',f:'wpn_dao',mount:'back',pv:.68,len:.62,rot:203,dx:.10,dy:.115},
 thuong:{n:'Trường thương sau lưng',f:'wpn_thuong',mount:'back',pv:.5,len:1.08,rot:-20,dx:0,dy:.5},
 con:{n:'Thiết côn sau lưng',f:'wpn_con',mount:'back',pv:.5,len:.98,rot:20,dx:0,dy:.5},
 phiensan:{n:'Chiết phiến cài eo',f:'wpn_phiensan',mount:'hip',pv:.2,len:.22,rot:-62,dx:.2,dy:.58,front:1},
 tienkiem:{n:'Tiên kiếm lơ lửng',f:'wpn_tienkiem',mount:'float',pv:.5,len:.78,rot:14,dx:.50,dy:.46,sp:1,glow:'#5de0c8'},
 madekiem:{n:'Ma Đế kiếm lơ lửng',f:'wpn_madekiem',mount:'float',pv:.5,len:.78,rot:-14,dx:-.50,dy:.46,sp:1,glow:'#e0453a'},
 danlo:{n:'Hồng Hoang đan lô',f:'wpn_danlo',mount:'float',pv:.5,len:.34,rot:0,dx:-.46,dy:.18,sp:1,glow:'#ffb24a'}};
D.WPN=W;
const IMG={};
function img(id){const w=W[id];if(!w)return null;let e=IMG[id];if(e)return e.ok?e.im:null;e=IMG[id]={ok:false,im:new Image()};
 e.im.onload=()=>{e.ok=true;try{D.memo.clear()}catch(x){}try{D.listeners.forEach(fn=>fn())}catch(x){}};e.im.src='doll/'+w.f+'.webp';return null}
const owned=id=>{try{return !!(S&&S.wpnOwn&&S.wpnOwn[id])}catch(e){return false}};
const maxG=()=>{try{const u=D.auraUnlocked('me');return u.length?Math.max(...u.map(x=>x.g||0)):0}catch(e){return 0}};
const canSp=()=>maxG()>=5;
// danh sách chọn được cho một look
D.wpn={
 list(L){const out=[];const held=D.HELD[L&&L.pose];
  for(const id in W){const w=W[id];if(w.sp){if(canSp()&&owned(id))out.push({id,name:w.n})}else if(!held)out.push({id,name:w.n})}return out},
 name(L){const held=D.HELD[L.pose];if(L.wp&&W[L.wp])return W[L.wp].n;return held&&!this.list(L).length?'Đã cầm sẵn vũ khí':'Không'},
 ok(L,id){return !!this.list(L).find(x=>x.id===id)},
 draw(x,look,pose,of,h,front){const id=look&&look.wp;const w=W[id];if(!w)return;if(!this.ok(look,id))return;
  if(!!w.front!==!!front)return;const im=img(id);if(!im)return;
  const top=Math.min(of?of.y:94,h?h.y:94,94);const bh=((of&&of.y+of.h)||1130)-top;const cx=(of?of.x+of.w/2:450)+0;
  const bw=Math.min(of?of.w:400,420);
  const Lw=bh*w.len,s=Lw/im.naturalHeight;const ax=cx+bw*w.dx*(w.mount==='float'?1.0:1),ay=top+bh*w.dy;
  x.save();
  if(w.glow){x.globalAlpha=.55;x.shadowColor=w.glow;x.shadowBlur=40}
  x.translate(ax,ay);x.rotate(w.rot*Math.PI/180);
  x.drawImage(im,-im.naturalWidth*s/2,-im.naturalHeight*s*w.pv,im.naturalWidth*s,im.naturalHeight*s);
  if(w.glow){x.shadowBlur=0;x.globalAlpha=1;x.drawImage(im,-im.naturalWidth*s/2,-im.naturalHeight*s*w.pv,im.naturalWidth*s,im.naturalHeight*s)}
  x.restore()}};
// chọn trong khung diện mạo
const _step=D.step;
D.step=function(ctx,kind,d){if(kind!=='wp')return _step.apply(this,arguments);
 const L0=(ctx==='cr')?(CR.doll):(()=>{const l=LK();return l.doll})();if(!L0)return;
 const ids=['',...D.wpn.list(L0).map(i=>i.id)];const n=(ids.indexOf(L0.wp||'')+d+ids.length)%ids.length;L0.wp=ids[n];D.refresh(ctx)};
const _fix=D.fixLook;
D.fixLook=function(L,g){const wp=L&&L.wp;L=_fix(L,g);if(!L)return L;if(wp)L.wp=wp;if(L.wp&&!D.wpn.ok(L,L.wp))L.wp='';return L};
// ---- sở hữu bảo khí ----
window.grantWeapon=function(id){if(!W[id])return false;S.wpnOwn=S.wpnOwn||{};if(S.wpnOwn[id])return false;S.wpnOwn[id]=1;try{narrate(`✨ Ngươi có được <b>${W[id].n}</b>. Vào Nhân vật › Đổi diện mạo › Vũ khí để mang theo.`)}catch(e){}return true};

// ---- cửa hàng bảo khí: phiên đấu giá và thương nhân (chỉ Chí Tôn+) ----
window.__wpnShop={has:k=>(k==='dau'||k==='thuong')&&canSp(),
 price:id=>Math.round(Math.max(30000,tierPrice(260,(S.realm||0)+1))*({tienkiem:1,madekiem:1.2,danlo:1.5}[id]||1)),
 async open(n){const left=Object.keys(W).filter(k=>W[k].sp);const price=id=>this.price(id);
  const opts=left.map(id=>owned(id)?{t:`✅ ${W[id].n} (đã có)`,desc:'Đã nằm trong kho, vào Đổi diện mạo để mang.',lock:'Đã sở hữu'}:{t:`💎 ${W[id].n} · ${price(id)} LS`,desc:'Bảo khí hiển hóa lơ lửng quanh thân, tỏa sáng.',run:async()=>{if(S.linhThach<price(id)){try{narrate('Linh thạch không đủ để mua bảo khí này.')}catch(e){}return}S.linhThach-=price(id);window.grantWeapon(id)}});
  opts.push({t:'Rời đi'});
  await choose('💎 Bảo khí hiếm',`${n?n.name:'Chủ quầy'} khẽ vén tấm vải nhung, để lộ những món bảo khí chỉ bậc Chí Tôn trở lên mới có thể điều khiển.`,opts)}};
// rơi từ boss (chỉ người đã đạt phẩm Chí Tôn trở lên)
const _sc=window.startCombat;
if(typeof _sc==='function')window.startCombat=async function(e){const r=await _sc.apply(this,arguments);
 try{if(r==='win'&&e&&e.boss&&canSp()&&typeof chance==='function'&&chance(8)){const left=Object.keys(W).filter(k=>W[k].sp&&!owned(k));if(left.length)window.grantWeapon(pick(left))}}catch(x){}return r};
try{PATCH_NOTES.unshift(['v10.12 · 07/11/2026 · Lớp vũ khí cho nhân vật',[
 'Đổi diện mạo có thêm mục Vũ khí: trường kiếm, quỷ đầu đao đeo lưng; trường thương, thiết côn sau lưng; chiết phiến cài eo. Vũ khí là lớp riêng, ghép vào đúng tư thế, có thể gỡ bất cứ lúc nào.',
 'Các tư thế đã cầm sẵn vũ khí (Khoanh tay · kiếm đeo lưng, Đứng tựa kiếm, Vung trọng đao, Cầm trượng, Yểu điệu · quạt lụa) không ghép thêm vũ khí thường.',
 'Bảo khí hiển hóa: Tiên kiếm, Ma Đế kiếm, Hồng Hoang đan lô lơ lửng quanh thân và tỏa sáng. Chỉ người có phẩm Chí Tôn trở lên mới mang được, lấy từ boss rơi ra hoặc mua ở phiên đấu giá.']])}catch(e){}
})();
