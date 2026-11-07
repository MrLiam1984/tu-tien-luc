/* ===== v10.10 · Mọi lựa chọn, hành động, trận đánh và kết quả đều có tranh thủy mặc ===== */
(function(){
const strip=h=>String(h==null?'':h).replace(/<br\s*\/?>/gi,' ').replace(/<[^>]+>/g,'').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim();
const noEmo=s=>strip(s).replace(/^[^\p{L}\p{N}]+/u,'').trim();
// ---- thư viện tranh: mỗi khóa là danh sách tệp ưu tiên (tệp chưa có thì dùng tệp sau) ----
const K={
 foe_human:['cb_human'],foe_tiger:['cb_tiger'],foe_snake:['cb_snake'],foe_bird:['cb_bird'],foe_ghost:['cb_ghost'],foe_demon:['cb_demon'],foe_boss:['cb_boss'],foe_wolf:['ci_thu'],foe_bandit:['ci_cuop'],foe_assassin:['ci_amsat'],foe_heart:['ci_tamma'],foe_spar:['sc_arena','cb_human'],
 win:['sc_win'],lose:['sc_lose'],flee:['sc_flee'],talk:['sc_talk'],
 ac_attack:['ac_attack','cb_human'],ac_hide:['ac_hide','ci_amsat'],ac_bribe:['ac_bribe','ev_cho'],ac_bow:['ac_bow','laonhan'],ac_search:['ac_search','sc_treasure'],ac_leave:['ac_leave','sc_flee'],
 rs_gain:['rs_gain','sc_treasure'],rs_loss:['rs_loss','ev_trom'],rs_hurt:['rs_hurt','sc_lose'],rs_enlight:['rs_enlight','ev_dotpha'],
 treasure:['sc_treasure','ev_kyngo'],thienma:['sc_thienma','ev_thienma'],secret:['sc_secret','ev_kyngo'],npc:['sc_npc','ev_gapgo'],arena:['sc_arena','cb_human'],
 dau:['ven_dau','ev_cho'],cho:['ven_cho','ev_cho'],thuong:['ven_thuong','ev_cho'],khach:['ven_khach','ev_tuluyen'],tra:['ven_tra','ev_gapgo'],y:['ven_y','ev_cho'],ren:['ven_ren','ev_dan'],lo:['ven_lo','ev_dan'],nha:['ven_nha','ev_phucich'],
 laonhan:['laonhan'],amsat:['ci_amsat'],cuop:['ci_cuop'],doc:['ci_doc'],tamma:['ci_tamma'],thu:['ci_thu'],linhkhi:['ci_linhkhi'],dotpha:['ev_dotpha'],kiep:['ev_thienkiep'],tinh:['ev_tinhduyen'],tong:['ev_tong'],thao:['thaoduoc'],khoang:['khoang'],tuluyen:['ev_tuluyen'],travel:['ev_gapgo','ev_caosu'],gap:['ev_gapgo']};
// ---- nhận diện cảnh từ chữ ----
const R=[[/thiên ma/i,'thienma'],[/bí cảnh|di tích|cổng đá|truyền tống/i,'secret'],[/đấu giá/i,'dau'],[/thương nhân|thương đoàn/i,'thuong'],[/chợ|phường thị|mua bán|cửa hàng/i,'cho'],[/khách điếm|khách sạn|nghỉ trọ|thuê phòng/i,'khach'],[/trà lâu|tửu quán|nghe ngóng/i,'tra'],[/y phường|trang phục|tiệm áo/i,'y'],[/rèn đúc|cường hóa|lò rèn|khảm/i,'ren'],[/luyện đan|đan phòng|trận pháp|luyện chế|đan lô/i,'lo'],[/nha môn|truy nã|bổ khoái/i,'nha'],
 [/lôi đài|tỷ thí|tỉ thí|đấu pháp|so tài/i,'arena'],[/lão nhân|lão ông|ông lão|cao nhân|ẩn sĩ|lão giả/i,'laonhan'],[/sát thủ|ám sát|thích khách/i,'amsat'],[/cướp|sơn tặc|thổ phỉ|chặn đường/i,'cuop'],[/độc khí|trúng độc|độc/i,'doc'],[/tâm ma|tẩu hỏa/i,'tamma'],[/yêu thú|sói|hổ|rắn|mãng|thú dữ|thú dữ|yêu vương/i,'thu'],[/linh khí.{0,20}bạo động/i,'linhkhi'],
 [/thiên kiếp|lôi kiếp|độ kiếp/i,'kiep'],[/đột phá|kết đan|nguyên anh|tiến giai/i,'dotpha'],[/truy đuổi|đào tẩu|bỏ chạy/i,'flee'],[/đạo lữ|tình duyên|kết hôn|cầu hôn|nàng|cô nương/i,'tinh'],[/tông môn|trưởng lão|sư phụ|sư huynh|nhiệm vụ/i,'tong'],[/cơ duyên|kỳ ngộ|bảo vật|kho báu|động phủ|vật độc nhất|rương|di vật/i,'treasure'],
 [/hái|linh thảo|thảo dược/i,'thao'],[/khoáng|đào mỏ|khai khoáng/i,'khoang'],[/bí ẩn|thần bí|áo choàng|người lạ|kẻ lạ|nhân vật đặc biệt/i,'npc'],[/tu luyện|nhập định|bế quan|tĩnh tọa/i,'tuluyen'],[/đi đường|hành trình|lịch luyện|khám phá|phiêu bạt/i,'travel']];
const RA=[[/đánh|tấn công|ra tay|phản sát|giết|khiêu chiến|chiến|tỷ thí|xông/i,'ac_attack'],[/ẩn|trốn|thu liễm|lén|im lặng|nép/i,'ac_hide'],[/nộp|trả tiền|đưa tiền|hối lộ|biếu|linh thạch cho|nhượng/i,'ac_bribe'],[/cung kính|hành lễ|bái|xin chỉ|cúi|thỉnh|kính/i,'ac_bow'],[/tìm|lục|thăm dò|điều tra|kiểm tra|khám|soi/i,'ac_search'],[/chạy|thoát|bỏ chạy|tẩu|đào tẩu/i,'flee'],[/thuyết phục|dọa|đàm|thương lượng|nói chuyện|hỏi/i,'talk'],[/bỏ qua|mặc kệ|từ chối|rời|không|đi tiếp|thôi/i,'ac_leave']];
function pickKeys(rules,text){for(const [re,k] of rules)if(re.test(text))return K[k]||null;return null}
const sceneFor=t=>pickKeys(R,t)||K.travel;
function foeKey(e){const n=String(e.name||'');
 if(e.kind==='heart')return K.foe_heart;if(e.spar)return K.foe_spar;if(e.boss)return K.foe_boss;
 if(e.kind==='beast'){if(/hổ|báo|sư tử/i.test(n))return K.foe_tiger;if(/mãng|giao|xà|hạt|trùng|rắn|rết/i.test(n))return K.foe_snake;if(/điểu|ưng|nha|phượng|chim|kền|cú|dơi/i.test(n))return K.foe_bird;return K.foe_wolf}
 if(/sát thủ|thích khách/i.test(n))return K.foe_assassin;if(/cướp|phỉ|sơn tặc|thủ lĩnh|tán tu/i.test(n))return K.foe_bandit;
 if(/ma tu|huyết|ma |ma$|tà|yêu nhân|ám|hắc/i.test(n)||e.evil)return K.foe_demon;if(/quỷ|thi|hồn|vong|cương|cốt/i.test(n))return K.foe_ghost;return K.foe_human}
// ---- CSS cảnh tạm (tranh toàn màn hình, chạm để tiếp tục) ----
const st=document.createElement('style');st.id='v10f-css';st.textContent=`
#xscn{position:fixed;inset:0;z-index:85;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(8,6,4,.96);cursor:pointer}
#xscn.on{display:flex;animation:evin .3s ease-out}
#xscn .xs-st{position:relative;flex:1 1 auto;min-height:0;width:100%;max-width:1200px;display:flex;align-items:center;justify-content:center;padding:10px 10px 0;overflow:hidden}
#xscn .xs-st img{max-width:100%;max-height:100%;object-fit:contain;border:2px solid #1b1815;box-shadow:0 0 40px rgba(0,0,0,.7)}
#xscn .xs-cap{position:absolute;top:16px;left:50%;transform:translateX(-50%);color:#f7f1df;font:600 18px "Noto Serif",serif;letter-spacing:.08em;padding:5px 30px 7px;background:linear-gradient(90deg,transparent,rgba(13,13,13,.88) 14%,rgba(13,13,13,.88) 86%,transparent);white-space:nowrap;max-width:94%;overflow:hidden;text-overflow:ellipsis;pointer-events:none}
#xscn .xs-tx{flex:0 0 auto;width:100%;max-width:1200px;box-sizing:border-box;background:linear-gradient(#f7eed8,#e9dcb9);border-top:2px solid #1b1815;padding:10px 18px 14px;font:15px/1.55 "Noto Serif",serif;color:#2b2117;max-height:34vh;overflow-y:auto}
#xscn .xs-tx p{margin:0 0 4px}
#xscn .xs-hint{color:#6a5a3a;font:12px Inter,sans-serif;text-align:center;margin-top:6px}
@media(max-width:640px){#xscn .xs-cap{font-size:15px;padding:4px 18px 6px}#xscn .xs-tx{font-size:14px}}`;
document.head.appendChild(st);
const altImg=keys=>{const l=keys.map(k=>`doll/${k}.webp`);return `<img src="${l[0]}" data-alt='${JSON.stringify(l.slice(1))}' alt="" onerror="try{var a=JSON.parse(this.dataset.alt||'[]');if(a.length){this.src=a.shift();this.dataset.alt=JSON.stringify(a)}else this.style.visibility='hidden'}catch(e){}">`};
let chain=Promise.resolve();
function showScene(o){const run=()=>new Promise(res=>{let e=document.getElementById('xscn');if(!e){e=document.createElement('div');e.id='xscn';document.body.appendChild(e)}
 const lines=(o.lines||[]).filter(Boolean);
 e.innerHTML=`<div class="xs-st">${altImg(o.keys||K.travel)}<div class="xs-cap">${(o.title||'').replace(/</g,'&lt;')}</div></div>${lines.length||o.text?`<div class="xs-tx">${o.text?`<p>${o.text.replace(/</g,'&lt;')}</p>`:''}${lines.map(l=>`<p>${l.replace(/</g,'&lt;')}</p>`).join('')}<div class="xs-hint">${o.auto?'Chạm để bỏ qua':'Chạm để tiếp tục'}</div></div>`:`<div class="xs-tx"><div class="xs-hint" style="margin:0">${o.auto?'Chạm để bỏ qua':'Chạm để tiếp tục'}</div></div>`}`;
 e.classList.add('on');let done=false,tm=null;
 const fin=()=>{if(done)return;done=true;clearTimeout(tm);e.classList.remove('on');removeEventListener('keydown',kh,true);setTimeout(res,60)};
 const kh=ev=>{if(ev.key==='Enter'||ev.key===' '||ev.key==='Escape'){ev.preventDefault();ev.stopPropagation();fin()}};
 addEventListener('keydown',kh,true);e.onclick=fin;if(o.auto)tm=setTimeout(fin,o.auto)});
 const p=chain.then(run,run);chain=p.catch(()=>{});return p}
window.showScene=showScene;
// ---- tranh đầu cửa sổ lựa chọn: luôn có ----
window.__sceneBanner=function(m){try{if(!m||m.querySelector('.mg,.mscene'))return null;if(m.classList.contains('crmodal')||m.classList.contains('vnmodal')||m.classList.contains('cmodal'))return null;
 const h=m.querySelector('h2');const p=m.querySelector('p.serif,p');const ch=[...m.querySelectorAll('.choice b')].map(b=>b.textContent).join(' ');
 const t=strip((h?h.textContent:'')+' '+(p?p.textContent:'')+' '+ch);const keys=sceneFor(t);
 const d=document.createElement('div');d.className='evban';d.innerHTML=altImg(keys);m.insertBefore(d,m.firstChild);return d}catch(e){return null}};
// ---- thu nhật ký trong lúc thực hiện một lựa chọn ----
const CAPS=[];const _ae=window.addEntry;
window.addEntry=function(html){try{if(CAPS.length){const t=strip(html);if(t)CAPS.forEach(c=>c.push(t))}}catch(e){}return _ae.apply(this,arguments)};
const combat={v:false};
const trivial=o=>{const t=noEmo(o&&o.t);return !t||/^(đóng|đã hiểu|tiếp tục|quay lại|thoát|hủy|xem|mở|ok|xác nhận|không sao|về)/i.test(t)||(o&&(o.lock||o.leave===true&&/rời|thoát/i.test(t)&&false))};
const BAD=/❌|thất bại|mất \d|bị thương|trúng|hp\s*[−-]|−\d+\s*hp|tâm ma \+|bị cướp|bị đánh|thua|xuất quan/i,GOOD=/✅|thành công|\+\d|nhận được|tặng|thu được|được \d|thắng|hậu tạ|chỉ điểm/i;
function resultKeys(kind,txt){let bad=BAD.test(txt),good=GOOD.test(txt);if(kind==='no')bad=true;if(kind==='ok'&&!bad)good=true;
 if(bad&&good){bad=/❌|thất bại/.test(txt)||kind==='no';good=!bad}
 if(bad)return {k:/thương|hp|máu|trúng|đòn|ám khí/i.test(txt)?K.rs_hurt:K.rs_loss,t:'Kết quả · Thất bại'};
 if(good)return {k:/tu vi|ngộ|chỉ điểm|thần thức|tâm ma −|đột phá/i.test(txt)?K.rs_enlight:K.rs_gain,t:'Kết quả · Thành công'};return null}
async function runWith(o,kind,f,ctx,args,title,desc){
 if(trivial(o))return f.apply(ctx,args);
 const cap=[];CAPS.push(cap);combat.v=false;
 try{await showScene({keys:pickKeys(RA,noEmo(o.t))||sceneFor(strip(title)+' '+strip(desc)+' '+strip(o.t)),title:noEmo(o.t),auto:1300})}catch(e){}
 let r;try{r=await f.apply(ctx,args)}finally{const i=CAPS.indexOf(cap);if(i>=0)CAPS.splice(i,1)}
 try{if(!combat.v&&cap.length){const txt=cap.join(' ');const rk=resultKeys(kind,txt);if(rk)await showScene({keys:rk.k,title:rk.t,lines:cap.slice(-3).map(l=>l.length>160?l.slice(0,157)+'…':l)})}}catch(e){console.warn(e)}
 return r}
function wrapOpt(o,title,desc){if(!o||o.lock||(!o.run&&!o.ok&&!o.no))return o;const w=Object.assign({},o);
 for(const k of ['run','ok','no'])if(typeof o[k]==='function'){const f=o[k];w[k]=function(){return runWith(o,k==='run'?'run':k,f,this,arguments,title,desc)}}return w}
const _ch=window.choose;
if(typeof _ch==='function')window.choose=function(title,desc,opts){try{if(Array.isArray(opts)&&opts.length>=1&&!window.__noScn)opts=opts.map(o=>wrapOpt(o,title,desc))}catch(e){console.warn(e)}return _ch.call(this,title,desc,opts)};
// ---- chiến đấu: vào trận, gặp lần đầu / boss, thắng, thua, chạy, thuyết phục ----
const _sc=window.startCombat;
if(typeof _sc==='function')window.startCombat=async function(e,why){
 if(!e||!e.name)return _sc.apply(this,arguments);
 combat.v=true;let first=false,boss=false;
 try{S.seenFoe=S.seenFoe||{};first=!S.seenFoe[e.name];S.seenFoe[e.name]=1;boss=!!e.boss||(e.tier||0)>=2;
  const realm=(typeof REALMS!=='undefined'&&REALMS[e.realm])?REALMS[e.realm].name:'';
  await showScene({keys:foeKey(e),title:(first?'Lần đầu gặp · ':'')+e.name+(e.boss?' ☠':''),lines:[strip(why||''),realm?`Cảnh giới ${realm}${boss&&!e.boss?' · Tinh anh':''}`:''],auto:(first||boss)?0:2300})}catch(err){console.warn(err)}
 const r=await _sc.apply(this,arguments);
 try{const m={win:['Thắng trận','win',2400],lose:['Bại trận','lose',0],flee:['Chạy thoát','flee',0],talk:['Thuyết phục thành công','talk',2400]}[r];
  if(m)await showScene({keys:K[m[1]],title:`${m[0]} · ${e.name}`,auto:m[2]})}catch(err){console.warn(err)}
 return r};
try{PATCH_NOTES.unshift(['v10.10 · 07/11/2026 · Mọi lựa chọn, hành động và trận đánh đều có tranh',[
 'Mọi cửa sổ có lựa chọn đều hiện tranh thủy mặc trước (tranh theo ngữ cảnh: cướp, yêu thú, lão nhân, chợ, khách điếm, cơ duyên, thiên ma, bí cảnh…), chạm vào tranh mới hiện khung chọn nhỏ phía dưới.',
 'Bấm một lựa chọn sẽ hiện tranh mô tả hành động đó (ra tay, ẩn nấp, nộp tiền, cung kính, tìm kiếm, rời đi…), rồi khi có kết quả thì hiện tranh kết quả (thành công, thất bại, bị thương, được lợi, ngộ đạo) cùng tóm tắt những gì vừa xảy ra.',
 'Chiến đấu: vào trận hiện tranh theo loại đối thủ (hổ, rắn, đại bàng, quỷ, ma tu, tu sĩ, sát thủ, cướp, boss); gặp quái hoặc boss lần đầu hiện tranh riêng và phải chạm để tiếp tục; kết thúc hiện tranh thắng, bại, chạy thoát hoặc thuyết phục thành công.']])}catch(e){}
})();
