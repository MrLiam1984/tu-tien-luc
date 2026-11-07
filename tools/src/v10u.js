/* ===== v10.24 · Bản đồ châu mỗi kiếp một khác + 4 cõi ở 4 góc ===== */
(function(){
'use strict';
const clamp2=(v,a,b)=>Math.max(a,Math.min(b,v));
/* ---------- hạt giống thế giới của kiếp này ---------- */
function ws(){try{if(S.wseed===undefined)S.wseed=((S.year||1)<=1&&(S.month||1)<=3)?(1+Math.floor(Math.random()*2147483000)):0}catch(e){return 0}return S.wseed||0}
/* ---------- 8 loại cõi ---------- */
const DOM={
 yeuvuong:{ico:'🐲',names:['Yêu Vương Động','Huyết Yêu Quật','Hắc Diễm Yêu Động'],cd:4,d:'Hang ổ của một yêu vương. Ngoài cửa là trại binh linh canh giữ, hỏa đài sáng suốt đêm, giáp rỉ máu đứng im như tượng.'},
 chientruong:{ico:'⚔',names:['Cổ Chiến Trường','Tàn Binh Cốc','Vạn Cốt Nguyên'],cd:4,d:'Nơi hai đạo quân tu sĩ tàn sát nhau từ ngàn năm trước. Cờ rách còn phấp phới, oán hồn chưa chịu tan.'},
 huyettri:{ico:'🩸',names:['Huyết Trì','Xích Huyết Đầm','Máu Nóng Hồ'],cd:5,d:'Hồ máu nóng không cạn, bốc hơi đỏ. Truyền thuyết kể ai tắm được sẽ luyện thể thần tốc, nhưng chẳng mấy người ra khỏi hồ nguyên vẹn.'},
 kiemtrung:{ico:'🗡',names:['Kiếm Trủng','Vạn Kiếm Sơn','Đoạn Kiếm Nguyên'],cd:5,d:'Hàng vạn thanh kiếm cắm xuống đất, thanh nào cũng còn kiếm ý. Kiếm linh canh giữ không cho ai mang đi.'},
 duocvien:{ico:'🌿',names:['Dược Viên Bỏ Hoang','Linh Dược Cốc','Thiên Thảo Viên'],cd:3,d:'Vườn thuốc của một đan sư thượng cổ, nay dây leo phủ kín. Linh thảo vẫn mọc, chỉ là chúng đã biết ăn thịt người.'},
 thapco:{ico:'🏯',names:['Cổ Tháp Trấn Yêu','Trấn Yêu Tháp','Cửu Trọng Tháp'],cd:6,d:'Ngọn tháp đá ba tầng nhốt yêu quái từ thời xa xưa. Lên càng cao thưởng càng lớn, nhưng cửa tháp chỉ mở ra, không bao giờ khép lại phía sau ngươi.'},
 maicung:{ico:'🪞',names:['Mê Cung Gương','Vô Ảnh Cung','Huyễn Kính Điện'],cd:4,d:'Cung điện toàn gương, mỗi tấm hiện một khuôn mặt ngươi chưa từng thấy. Đi lạc ở đây là gặp chính mình.'},
 longmach:{ico:'🌋',names:['Địa Mạch Linh Huyệt','Long Mạch Động','Linh Tuyền Huyệt'],cd:3,d:'Nơi linh khí địa mạch trào lên. Tu sĩ nào cũng thèm khát, nên luôn có kẻ canh huyệt.'}};
const DKEYS=Object.keys(DOM);
/* ---------- bố cục châu ngẫu nhiên ---------- */
function rzLayout(i,L){
 const r=mkRng(hashStr('rz'+ws()+'_'+i)),R=(a,b)=>a+(b-a)*r(),pick2=a=>a[Math.floor(r()*a.length)];
 const N=L.N,placed=[];
 const near=(x,y,d)=>placed.every(p=>Math.hypot(p.x-x,p.y-y)>=d);
 const place=(n,gen,d)=>{let best=null;for(let k=0;k<80;k++){const [x,y]=gen();if(near(x,y,d)){best=[x,y];break}best=[x,y]}n.x=Math.round(clamp2(best[0],90,1510));n.y=Math.round(clamp2(best[1],110,900));placed.push(n)};
 // 4 góc: cõi
 const cr=[[R(150,280),R(130,230)],[R(1320,1450),R(130,230)],[R(150,280),R(760,880)],[R(1320,1450),R(760,880)]];
 cr.forEach(([x,y])=>placed.push({x,y}));
 L.corners=cr.map(p=>[Math.round(p[0]),Math.round(p[1])]);
 const g=N.find(n=>n.id==='gate');
 const gc=pick2([()=>[R(100,150),R(470,570)],()=>[R(100,150),R(470,570)],()=>[R(520,820),R(890,940)],()=>[R(520,820),R(80,130)]]);
 if(g)place(g,gc,200);
 // chuỗi thị trấn đi theo đường cong ngẫu nhiên từ cổng tới một "trung tâm"
 const T=N.filter(n=>n.lv).sort((a,b)=>a.id<b.id?-1:1);
 const hub=pick2([[R(1180,1400),R(430,620)],[R(820,1020),R(220,340)],[R(900,1100),R(690,820)],[R(1000,1250),R(300,700)]]);
 const a0=g?[g.x,g.y]:[120,500];const mx=(a0[0]+hub[0])/2,my=(a0[1]+hub[1])/2;const dx=hub[0]-a0[0],dy=hub[1]-a0[1],len=Math.hypot(dx,dy)||1;const off=R(120,280)*(r()<.5?-1:1);
 const cx=mx-dy/len*off,cy=my+dx/len*off;
 T.forEach((n,j)=>{const t=T.length>1?(.18+.82*j/(T.length-1)):.6;place(n,()=>[ (1-t)*(1-t)*a0[0]+2*(1-t)*t*cx+t*t*hub[0]+R(-40,40), (1-t)*(1-t)*a0[1]+2*(1-t)*t*cy+t*t*hub[1]+R(-40,40)],220)});
 // tông môn, vùng hoang dã, boss
 N.filter(n=>n.k==='tong').forEach(n=>place(n,()=>[R(300,1300),R(110,900)],220));
 N.filter(n=>n.k==='zone').forEach(n=>place(n,()=>[R(380,1260),R(190,860)],200));
 const b=N.find(n=>n.id==='boss');if(b)place(b,()=>pick2([[R(1250,1480),R(300,640)],[R(560,900),R(120,200)],[R(560,900),R(840,900)],[R(1300,1480),R(120,860)]]),230);
 // gán loại cõi cho 4 góc theo thứ tự xáo trộn
 const pool=DKEYS.slice();for(let k=pool.length-1;k>0;k--){const j=Math.floor(r()*(k+1));[pool[k],pool[j]]=[pool[j],pool[k]]}
 L.doms=pool.slice(0,4).map((d,k)=>({dom:d,name:DOM[d].names[Math.floor(r()*DOM[d].names.length)],x:L.corners[k][0],y:L.corners[k][1]}));
 try{L.deco=cmDeco10(i,mkRng(hashStr('dz'+ws()+'_'+i)),N)}catch(e){console.warn('v10u deco',e)}
 L.__ws=ws()}
const _cl=window.cmLayout;
window.cmLayout=function(i){const w=ws();let L=window.CM&&CM.lay[i];if(L&&L.__ws===w)return L;
 if(window.CM)delete CM.lay[i];try{if(window.OW&&OW.map)delete OW.map[i]}catch(e){}
 L=_cl.apply(this,arguments);if(w)try{rzLayout(i,L)}catch(e){console.warn('v10u layout',e)}L.__ws=w;if(!L.doms&&!w){L.doms=[]}return L};
// bản đồ ô vuông cũng đổi theo hạt giống
const _or=window.owRng;if(typeof _or==='function')window.owRng=function(s){return mkRng(hashStr(String(s)+(ws()||'')))};
const BIOME={yeuvuong:9,chientruong:10,huyettri:8,kiemtrung:11,duocvien:1,thapco:9,maicung:12,longmach:5};
function carve(M,i){if(M.__cr)return;M.__cr=1;const L=cmLayout(i);if(!L.doms||!L.doms.length)return;const W=M.W,H=M.H,t=M.t;const hub=L.N.find(n=>n.id==='t0')||L.N[0];
 for(const d of L.doms){const [x,y]=owTile(d.x,d.y),b=BIOME[d.dom]||0;
  for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const X=x+dx,Y=y+dy;if(X<1||Y<1||X>=W-1||Y>=H-1)continue;const q=dx*dx+dy*dy;if(q<=14+((X*7+Y*3)%5)){if(t[Y*W+X]!==4)t[Y*W+X]=b}}
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const k=(y+dy)*W+x+dx;if(OWT[t[k]].blk)t[k]=0}t[y*W+x]=4}
 for(const d of L.doms){const a=owTile(d.x,d.y),b2=owTile(hub.x,hub.y);try{for(const [px,py] of owPath(M,a,b2,true))t[py*W+px]=4}catch(e){}}}
const _og=window.owGen;if(typeof _og==='function')window.owGen=function(i){try{if(OW._ws!==ws()){OW.map={};OW._ws=ws()}}catch(e){}const M=_og.apply(this,arguments);try{carve(M,i)}catch(e){console.warn('v10u carve',e)}return M};
/* ---------- nút cõi trên bản đồ ---------- */
try{Object.keys(DOM).forEach(k=>{OW_ICON['cr_'+k]=DOM[k].ico})}catch(e){}
const _ce=window.cmExtraNodes;
window.cmExtraNodes=function(){const out=_ce?_ce.apply(this,arguments):[];try{const L=cmLayout(S.loc);for(const [k,d] of (L.doms||[]).entries()){const cd=((S.cr10||{})[S.loc+'_'+k]||{}).cd||0;const n=nowM();out.push({id:'cr'+k,k:'cr_'+d.dom,dom:d.dom,ck:k,n:d.name,x:d.x,y:d.y,d:DOM[d.dom].d+(cd>n?` (Vừa bị khuấy động, còn ${cd-n} tháng mới yên lại.)`:''),cdLeft:Math.max(0,cd-n)})}}catch(e){console.warn(e)}return out};
const _ca=window.cmActions;
window.cmActions=function(x){if(x&&x.dom){const t=here().t;return x.cdLeft?`<div class="small">Nơi này vừa bị khuấy động. Còn ${x.cdLeft} tháng nữa mới có thứ đáng giá.</div>`:`<div class="small">Cõi cấp ${t}. Đi sâu nguy hiểm dần, có thể rút lui giữa chừng, chết là mất hết chiến lợi phẩm.</div><button class="primary" onclick="v10uEnter('${x.id}')">${DOM[x.dom].ico} Tiến vào ${esc(x.n)}</button>`}return _ca.apply(this,arguments)};
const _ci=window.cmIcon;
function domIcon(x){const X=x.x,Y=x.y,ink='#3a3326';const base=(c1,c2)=>`<g class="cmsw"><circle cx="${X}" cy="${Y}" r="44" fill="${c1}" opacity=".88" stroke="${ink}" stroke-width="2.5"/><circle cx="${X}" cy="${Y}" r="36" fill="none" stroke="${c2}" stroke-width="2" stroke-dasharray="4 5"/></g>`;
 switch(x.dom){
  case 'yeuvuong':return base('#8a3b2a','#f0b25e')+`<path d="M${X-30} ${Y+22} v-30 h10 v-10 h10 v10 h6 v-14 h8 v14 h6 v-10 h10 v10 h10 v30 z" fill="#d9c6a0" stroke="${ink}" stroke-width="2"/><path d="M${X-8} ${Y+22} v-14 a8 8 0 0 1 16 0 v14 z" fill="#2b1810"/><path d="M${X-36} ${Y-26} l10 -16 l6 12 M${X+36} ${Y-26} l-10 -16 l-6 12" stroke="#f0b25e" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  case 'chientruong':return base('#5b4f6e','#c8bde0')+`<path d="M${X-24} ${Y+24} L${X-14} ${Y-30} M${X+24} ${Y+24} L${X+14} ${Y-30} M${X-30} ${Y-6} L${X+30} ${Y-6}" stroke="#d8d0c2" stroke-width="5" stroke-linecap="round"/><path d="M${X-14} ${Y-30} l22 6 l-22 10 z" fill="#b7412e" stroke="${ink}" stroke-width="1.5"/>`;
  case 'huyettri':return base('#7a1f26','#ff8a8a')+`<ellipse cx="${X}" cy="${Y+6}" rx="30" ry="14" fill="#c4282f" stroke="${ink}" stroke-width="2"/><path d="M${X-12} ${Y} q4 -16 0 -26 M${X+8} ${Y+2} q-4 -14 2 -24" stroke="#ffb0b0" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  case 'kiemtrung':return base('#4f6f86','#dff2ff')+[-24,-8,8,24].map((d,k)=>`<path d="M${X+d} ${Y+24} V${Y-26+k%2*8}" stroke="#e6eef4" stroke-width="5" stroke-linecap="round"/><path d="M${X+d-6} ${Y+4} h12" stroke="${ink}" stroke-width="3"/>`).join('');
  case 'duocvien':return base('#3f7a4a','#d3f5b0')+`<path d="M${X} ${Y+26} V${Y-6} M${X} ${Y+6} q-22 -4 -26 -22 q20 -2 26 22 M${X} ${Y+2} q22 -4 24 -24 q-22 0 -24 24" stroke="${ink}" stroke-width="2" fill="#8fd16a"/><circle cx="${X}" cy="${Y-16}" r="7" fill="#f2c94c" stroke="${ink}" stroke-width="2"/>`;
  case 'thapco':return base('#6a5a8a','#e9dcff')+[0,1,2].map(k=>{const w=44-k*10,y=Y+22-k*16;return `<path d="M${X-w/2} ${y} h${w} v-12 h${-w} z" fill="#d9c6a0" stroke="${ink}" stroke-width="2"/><path d="M${X-w/2-6} ${y-12} q${w/2+6} -10 ${w+12} 0" stroke="#b7412e" stroke-width="4" fill="none"/>`}).join('');
  case 'maicung':return base('#3a6f88','#c9f3ff')+`<ellipse cx="${X}" cy="${Y-2}" rx="18" ry="26" fill="#cfeaf2" stroke="${ink}" stroke-width="3"/><path d="M${X-8} ${Y-14} l8 -8 M${X-10} ${Y+2} l16 -14" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M${X-24} ${Y+26} h48" stroke="${ink}" stroke-width="4"/>`;
  default:return base('#8a5a2a','#ffd48a')+`<path d="M${X-30} ${Y+22} L${X-10} ${Y-8} L${X} ${Y+4} L${X+12} ${Y-18} L${X+30} ${Y+22} z" fill="#6b4a2a" stroke="${ink}" stroke-width="2"/><path d="M${X-6} ${Y-14} q-6 -12 2 -22 q4 8 10 4 q2 12 -6 18" fill="#ff9a2e" stroke="${ink}" stroke-width="1.5"/>`}}
window.cmIcon=function(x){if(x&&x.dom)return domIcon(x);return _ci.apply(this,arguments)};
/* ---------- chạy một cõi ---------- */
const FX={};
async function runDomain(node){
 const D=DOM[node.dom],c=here(),T=c.t,rr=clamp2(T-1,0,8),acc={ls:0,mat:[],items:{},gear:[],man:[],stat:{},tv:0,note:[]};
 const foe=(name,o)=>makeEnemy(o.kind||'beast',clamp2(rr+(o.up||0),0,8),name,Object.assign({noRand:true},o));
 const fight=async(name,o,why)=>{const r=await startCombat(foe(name,o),why||`${name} lao ra chặn đường.`);return r==='win'&&!S.dead};
 const give=e=>{if(!e)return;if(e.ls){if(e.ls<0){if(S.linhThach>=-e.ls*T)gainLS(e.ls*T);else acc.note.push('không đủ linh thạch')}else acc.ls+=e.ls*T}if(e.mat)for(const m of [].concat(e.mat[0]&&Array.isArray(e.mat[0])?e.mat:[e.mat]))acc.mat.push(m);if(e.item)acc.items[e.item[0]]=(acc.items[e.item[0]]||0)+e.item[1];if(e.gear)acc.gear.push(e.gear);if(e.man)acc.man.push(e.man);if(e.stat)acc.stat[e.stat[0]]=(acc.stat[e.stat[0]]||0)+e.stat[1];if(e.tv)acc.tv+=e.tv;if(e.mark)acc.mark=e.mark;
  if(e.hurt){hurt(S.hpMax*e.hurt);acc.note.push(`mất ${Math.round(e.hurt*100)}% HP`)}if(e.tam){addTamMa(e.tam)}if(e.dao)daoDuc(e.dao)};
 const finish=async(full)=>{
  const f=full?1:.5;let lines=[];
  if(acc.ls){const v=Math.round(acc.ls*f);gainLS(v);lines.push(`${v} linh thạch`)}
  for(const [ty,t,q] of acc.mat){const n=Math.max(1,Math.round(q*f));lines.push(gainMat(ty,t,n))}
  for(const k in acc.items){if(ITEMS[k]){addItem(k,acc.items[k]);lines.push(`${acc.items[k]} ${k}`)}}
  if(full)for(const [slot,b] of acc.gear)giveGear(genGear(slot,clamp2(T,1,9),rollGrade(b)),node.n);
  if(full)for(const [type,he] of acc.man)giveManual(genManual(type,clamp2(1+Math.floor(T/3),1,3),he),node.n);
  for(const k in acc.stat){const v=Math.max(1,Math.round(acc.stat[k]*f));statUp(k,v,true);lines.push(`${STATS[k]||k} +${v}`)}
  if(acc.tv){const v=Math.round(realm().tuvi*acc.tv*f);S.tuvi=Math.min(realm().tuvi,S.tuvi+v);lines.push(`tu vi +${v}`)}
  if(acc.mark)mark(acc.mark);
  (S.cr10=S.cr10||{})[S.loc+'_'+node.ck]={cd:nowM()+D.cd};
  addEntry(`${D.ico} ${esc(node.n)}: ${full?'quét sạch':'rút lui'}. Nhận ${lines.join(', ')||'tay không'}.${acc.gear.length&&full?' Có trang bị rơi.':''}`,'system');
  await say(full?`Hoàn tất ${node.n}.`:`Rút lui khỏi ${node.n}.`,lines.length?`Mang ra: ${lines.join(', ')}.`:'Ngươi ra về tay trắng.')};
 const ask=async(title,text,gain)=>choose(title,text,[{t:'Tiến sâu hơn',desc:'Chặng sau nguy hiểm hơn, thưởng cũng hơn. Chết thì mất hết.',run:async()=>'go'},{t:'Rút lui với chiến lợi phẩm',desc:gain||'Giữ những gì đã gom, nhưng bỏ phần thưởng lớn ở cuối.',run:async()=>'out'}]);
 const pickOpt=async(title,text,opts)=>{let res=null;await choose(title,text,opts.map(o=>{const base={t:o.t,desc:o.desc};if(o.chk)return Object.assign(base,{c:{s:o.chk[0],r:o.chk[1]},ok:async()=>{give(o.ok);res='ok';if(o.okFight)res=(await fight(...o.okFight))?'ok':'dead'},no:async()=>{give(o.no);res='no';if(o.noFight)res=(await fight(...o.noFight))?'no':'dead'}});return Object.assign(base,{run:async()=>{give(o.ok);res='ok';if(o.okFight)res=(await fight(...o.okFight))?'ok':'dead'}})}));return res};
 titleCard('🏴 '+node.n,D.d,2600,'boss');await sleep(500);
 const dead=()=>!!S.dead;
 const S1={
  yeuvuong:async()=>{if(!await fight('Binh Linh Cung Thủ',{he:'Thổ',up:-1,hpMul:.8},'Trại binh linh: hàng chục binh linh giương cung nhắm vào ngươi.'))return 0;give({ls:40,mat:['yeudan',T,1]});return 1},
  chientruong:async()=>{if(!await fight('Oán Hồn Binh',{he:'Ám',up:-1,hpMul:.9},'Một toán oán hồn binh đứng dậy từ đống xác.'))return 0;give({ls:35});return 1},
  huyettri:async()=>{if(!await fight('Huyết Thi Thủ Vệ',{he:'Ám',up:-1},'Thi thể ngâm máu ngàn năm đứng canh bờ hồ.'))return 0;give({ls:35,mat:['thu',T,1]});return 1},
  kiemtrung:async()=>{const r=await pickOpt('Kiếm Trủng · Vạn kiếm cắm đất','Gió thổi qua hàng vạn lưỡi kiếm tạo thành âm điệu lạ. Có thể tĩnh tâm cảm ngộ, hoặc thử nhổ một thanh.',[{t:'Tĩnh tâm cảm kiếm ý',desc:'Thử thách ngộ tính. Thành công tăng vĩnh viễn thân pháp.',chk:['ngo',48+T*5],ok:{stat:['than',2]},no:{hurt:.2}},{t:'Nhổ một thanh kiếm',desc:'Chắc chắn có trang bị, nhưng kiếm linh sẽ phản ứng.',ok:{gear:['vu',22]},okFight:['Kiếm Linh Thủ Trủng',{he:'Kim',up:-1}]}]);return r&&r!=='dead'?1:0},
  duocvien:async()=>{if(!await fight('Độc Đằng Yêu',{he:'Mộc',up:-1,hpMul:.9},'Dây leo độc quấn lấy chân ngươi từ bụi cỏ.'))return 0;give({ls:30,mat:['thao',T,2]});return 1},
  thapco:async()=>{if(!await fight('Thạch Tượng Tầng Một',{he:'Thổ',up:-1,hpMul:.9},'Tầng một: hai pho tượng đá bước xuống bệ.'))return 0;give({ls:50});return 1},
  maicung:async()=>{const r=await pickOpt('Mê Cung Gương · Vạn gương','Mỗi tấm gương phản chiếu một lối đi khác. Chỉ một là thật.',[{t:'Bình tĩnh phân biệt thật giả',desc:'Thử thách thần thức.',chk:['thanthuc',48+T*5],ok:{tv:.04},no:{tam:12}},{t:'Đập vỡ gương chắn đường',desc:'Nhanh nhưng khuấy động thứ nằm sau gương.',ok:{ls:20},okFight:['Mảnh Gương Hóa Linh',{he:'Thủy',up:-1}]}]);return r&&r!=='dead'?1:0},
  longmach:async()=>{const r=await pickOpt('Địa Mạch · Người giữ huyệt','Quanh huyệt có tu sĩ đóng trại, thu phí hoặc cướp sạch kẻ lạ.',[{t:`Nộp ${60*T} linh thạch qua cửa`,desc:'Không đánh nhau.',ok:{ls:-60},okFight:null},{t:'Cướp đường vào',desc:'Đánh tu sĩ giữ huyệt, thắng thì lấy luôn túi của hắn.',ok:{ls:30},okFight:['Tu Sĩ Giữ Huyệt',{kind:'human',he:pick(HE),up:0}]}]);return r&&r!=='dead'?1:0}};
 const S2={
  yeuvuong:async()=>{const r=await pickOpt('Yêu Vương Động · Hỏa đài canh gác','Giữa trại là hỏa đài do binh linh luân phiên canh gác. Đạp đổ thì kéo cả trại tới, lẻn qua thì phải khéo.',[{t:'Đạp đổ hỏa đài',desc:'Thử thách thể phách. Thành công thu được yêu đan.',chk:['the',50+T*4],ok:{mat:['yeudan',T+1,2],ls:60},no:{hurt:.25}},{t:'Lẻn qua hầm tối',desc:'Thử thách thân pháp. Thất bại là đụng tinh anh.',chk:['than',50+T*4],ok:{item:['Hồi khí đan',1],mat:['thu',T,2]},no:{},noFight:['Binh Linh Tinh Anh',{he:'Ám',up:0}]}]);return r&&r!=='dead'?1:0},
  chientruong:async()=>{const r=await pickOpt('Cổ Chiến Trường · Xác binh khắp nơi','Binh khí gãy cắm đầy đất. Một số còn nguyên, nhưng oán khí bám theo ai nhặt.',[{t:'Nhặt vũ khí còn nguyên',desc:'Có trang bị, tâm ma +8.',ok:{gear:['vu',18],tam:8}},{t:'Cúng tế vong linh',desc:'Đạo đức +1, nhận đan dược, không có trang bị.',ok:{dao:1,item:['Hồi khí đan',1],ls:30}}]);return r&&r!=='dead'?1:0},
  huyettri:async()=>{const r=await pickOpt('Huyết Trì · Hồ máu nóng','Hơi máu bốc nghi ngút. Nhảy xuống thì có thể luyện thể, nhưng thân thể phải chịu nổi.',[{t:'Nhảy xuống tắm máu',desc:'Thử thách thể phách. Thành công tăng vĩnh viễn thể phách; thất bại mất nhiều máu và tâm ma +14.',chk:['the',52+T*5],ok:{stat:['the',2],tam:10},no:{hurt:.3,tam:14}},{t:'Gom huyết châu bên bờ',desc:'An toàn, thu nguyên liệu.',ok:{mat:['thu',T,2],item:['Hồi khí đan',1]}}]);return r&&r!=='dead'?1:0},
  kiemtrung:async()=>{if(!await fight('Kiếm Linh',{he:'Kim',up:0,hpMul:1.1},'Kiếm linh ngưng tụ từ hàng vạn lưỡi kiếm đứng chắn trước ngươi.'))return 0;give({ls:70,mat:['khoang',T+1,2]});return 1},
  duocvien:async()=>{const r=await pickOpt('Dược Viên · Luống dược cổ','Linh thảo còn nguyên, rễ cắm sâu vào đất tanh mùi máu.',[{t:'Hái cẩn thận từng cây',desc:'Thử thách thần thức. Thành công được ba cây cao cấp.',chk:['thanthuc',50+T*4],ok:{mat:['thao',T+1,3]},no:{mat:['thao',T,1]}},{t:'Nhổ cả luống',desc:'Được nhiều hơn nhưng động tới thứ canh vườn.',ok:{mat:['thao',T+2,2]},okFight:['Hộ Viên Thạch Nhân',{he:'Thổ',up:0}]}]);return r&&r!=='dead'?1:0},
  thapco:async()=>{if(!await fight('Phù Văn Khôi Lỗi Tầng Hai',{he:'Kim',up:0},'Tầng hai: khôi lỗi phù văn quay đầu về phía ngươi.'))return 0;give({ls:80,mat:['khoang',T+1,2]});return 1},
  maicung:async()=>{if(!await fight('Ảnh của '+S.name,{kind:'human',he:S.he||'Kim',up:0,hpMul:.95,noMercy:true},'Một tấm gương bước ra thành người, giống ngươi như đúc.'))return 0;give({ls:60,tv:.05});return 1},
  longmach:async()=>{const r=await pickOpt('Địa Mạch · Hấp thụ linh khí','Linh khí cuộn lên thành vòi. Hút nhiều thì nhanh tiến cảnh, nhưng thân thể có thể nứt.',[{t:'Hút sâu',desc:'Thử thách thể phách. Thành công tu vi tăng mạnh; thất bại thương tổn và tâm ma.',chk:['the',50+T*4],ok:{tv:.16},no:{hurt:.2,tam:10}},{t:'Hút vừa phải',desc:'An toàn, tu vi tăng ít.',ok:{tv:.07}}]);return r&&r!=='dead'?1:0}};
 const S3={
  yeuvuong:async()=>{if(!await fight('Yêu Vương',{boss:true,hpMul:2.4,dmgMul:1.1,he:'Hỏa',up:0},'Cánh cửa hang bật mở. Yêu Vương ngồi trên ngai xương, mở mắt.'))return 0;give({mat:[['yeudan',T+1,3],['thu',T+1,2]],gear:['vu',32],ls:150,mark:'Diệt Yêu Vương Động'});return 1},
  chientruong:async()=>{if(!await fight('Quỷ Tướng Quân',{boss:true,hpMul:2.2,he:'Ám',up:0},'Quỷ tướng cầm cờ rách bước ra giữa đội hình oán hồn.'))return 0;give({gear:['giap',34],mat:['khoang',T+1,2],ls:140,mark:'Thanh tẩy Cổ Chiến Trường'});return 1},
  huyettri:async()=>{if(!await fight('Huyết Linh',{boss:true,hpMul:2.1,he:'Hỏa',up:0},'Mặt hồ sôi lên, một bóng người đỏ như máu trồi lên.'))return 0;give({stat:['the',1],mat:['yeudan',T+1,2],tv:.06,ls:110,mark:'Tắm Huyết Trì'});return 1},
  kiemtrung:async()=>{if(!await fight('Kiếm Hồn Tiền Bối',{boss:true,hpMul:2.3,he:'Kim',up:0},'Một bóng kiếm khách cũ bước ra khỏi thanh kiếm lớn nhất.'))return 0;give({man:['vo','Kim'],gear:['vu',40],ls:130,mark:'Nhận kiếm ý Kiếm Trủng'});return 1},
  duocvien:async()=>{if(!await fight('Linh Dược Thụ Yêu',{boss:true,hpMul:2.2,he:'Mộc',up:0},'Cây linh dược cổ thụ rút rễ khỏi đất, đứng dậy.'))return 0;give({mat:[['thao',T+2,3],['thao',T+1,2]],item:['Hồi khí đan',2],stat:['ngo',1],ls:100,mark:'Thanh tẩy Dược Viên'});return 1},
  thapco:async()=>{if(!await fight('Trấn Yêu Chủ Tầng Ba',{boss:true,hpMul:2.4,he:'Thổ',up:0},'Tầng ba: yêu quái bị trấn ngàn năm mở mắt trong xích sắt.'))return 0;give({gear:['giap',36],man:['tam','Thổ'],ls:160,mark:'Phá Cổ Tháp Trấn Yêu'});return 1},
  maicung:async()=>{const r=await pickOpt('Mê Cung Gương · Tấm gương thật','Giữa điện chỉ còn một tấm gương, phản chiếu ngươi không giống bất kỳ ai trong số trước đó.',[{t:'Đối diện chính mình',desc:'Thần thức tăng, tâm ma giảm.',ok:{stat:['thanthuc',2],tam:-15}},{t:'Đập vỡ tấm gương',desc:'Thể phách tăng, tâm ma +5, thêm linh thạch.',ok:{stat:['the',1],tam:5,ls:90}}]);if(r&&r!=='dead'){give({mark:'Vượt Mê Cung Gương'});return 1}return 0},
  longmach:async()=>{if(!await fight('Địa Mạch Linh',{boss:true,hpMul:2,he:'Thổ',up:0},'Linh khí trào lên thành hình người khổng lồ bằng đá nóng.'))return 0;give({tv:.12,mat:['khoang',T+1,3],ls:90,mark:'Chiếm Địa Mạch Linh Huyệt'});return 1}};
 const steps=[S1[node.dom],S2[node.dom],S3[node.dom]];
 const gains=['Đã gom được một ít, chặng sau tốt hơn nhiều.','Đã gom khá nhiều. Cuối đường mới là phần thưởng lớn.'];
 for(let k=0;k<3;k++){
  const ok=await steps[k]();if(dead()||!ok){if(!dead()){addEntry(`${D.ico} Bỏ dở ${esc(node.n)}, chỉ mang theo một nửa những gì đã gom.`,'system danger');await finish(false)}return}
  if(k<2){const a=await ask(`${node.n} · Chặng ${k+1} xong`,'Phía trước còn sâu hơn. Ngươi còn khỏe không?',gains[k]);if(a==='out'){await finish(false);return}}
 }
 await finish(true)}
window.v10uEnter=async function(id){if(busy)return;const N=cmNodes(),n=N.find(x=>x.id===id);if(!n||!n.dom)return;if(n.cdLeft){addEntry('Nơi này chưa yên lại.','system');return}
 await withBusy(async()=>{await runDomain(n);if(!S.dead)passCa(ri(4,6))});if(S.dead){try{closeChauMap()}catch(e){}return}try{cmRender()}catch(e){}try{owCardRender&&owCardRender()}catch(e){}};
window.__v10u={DOM,ws,rzLayout,run:runDomain};
try{PATCH_NOTES.unshift(['v10.24 · 08/11/2026 · Bản đồ mỗi kiếp một khác, 4 cõi ở 4 góc',[
 '<b>Bố cục châu ngẫu nhiên theo từng kiếp</b>: vị trí cổng châu, chuỗi thị trấn (đường cong khác nhau), tông môn, vùng hoang dã và hang boss được xáo mỗi lần chơi mới, không còn theo một khuôn. Bản đồ ô vuông (địa hình, sông núi) cũng sinh theo hạt giống riêng. Lưu cũ giữ nguyên bố cục để không hỏng nhiệm vụ.',
 '<b>4 cõi ở 4 góc bản đồ</b>, mỗi châu chọn ngẫu nhiên 4 trong 8 loại: Yêu Vương Động (trại binh linh canh hang yêu vương), Cổ Chiến Trường, Huyết Trì, Kiếm Trủng, Dược Viên Bỏ Hoang, Cổ Tháp Trấn Yêu, Mê Cung Gương, Địa Mạch Linh Huyệt.',
 'Mỗi cõi có 3 chặng (đánh, lựa chọn có thử thách, boss). Qua mỗi chặng ngươi được chọn <b>tiến sâu hay rút lui</b>: rút lui chỉ mang đi nửa phần đã gom và mất phần thưởng lớn cuối cùng; chết giữa chừng thì mất sạch. Cõi sau khi dọn xong cần vài tháng mới yên lại.',
 'Thưởng và quái trong cõi tự co giãn theo cấp châu, nên các sự kiện sau này không cần chỉnh lại. Nút trên bản đồ có biểu tượng riêng cho từng loại cõi.']])}catch(e){}
})();
