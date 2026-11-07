/* ===== v10.17 · Chống spam thiện cảm: trò chuyện/quà 1 lần mỗi tháng, có trần ===== */
(function(){
window.__favCap=window.__favCap||{thu:30,talk:50,gift:70};
const CAP=window.__favCap;
const _npcAct=window.npcAct;
window.npcAct=async function(id,act){const n=npcById(id);const before=n?n.fav:0;
 const r=await _npcAct.apply(this,arguments);
 try{if(n&&(act==='talk'||act==='thu')){const cap=CAP[act];if(n.fav>before&&n.fav>cap){n.fav=Math.max(before,cap);addEntry(`Chỉ trò chuyện suông thì ${esc(n.name)} cũng chỉ thân thiết đến mức này. Muốn hơn, cần cùng trải qua việc gì đó (giúp đỡ, luận đạo, tỷ thí, quà quý).`,'system')}}}catch(e){}
 return r};
const _gift=window.npcGift;
window.npcGift=function(id){const r=_gift.apply(this,arguments);
 try{const n=npcById(id);if(n&&!canAct(n,'gift')){const m=document.getElementById('modal');if(m){m.querySelectorAll('button.mini').forEach(b=>{b.disabled=true});const p=m.querySelector('p.small');if(p)p.insertAdjacentHTML('afterend','<p class="small" style="color:#a33">Tháng này ngươi đã tặng quà cho người này rồi. Mỗi người chỉ nhận một món mỗi tháng.</p>')}}}catch(e){}
 return r};
window.giveGift=function(id,k){const n=npcById(id);if(!n||!n.alive)return;let val,cat;if(ITEMS[k]&&ITEMS[k].quest)return;
 if(!canAct(n,'gift')){addEntry(`Tháng này ngươi đã tặng quà cho ${esc(n.name)} rồi.`,'system');openNPC(id);return}
 if(k==='__ls'){val=100*(S.realm+1);if(S.linhThach<val)return;S.linhThach-=val;n.ls+=val;cat='ls'}
 else if(k.startsWith('__g')){const it=S.gearBag[+k.slice(3)];if(!it)return;S.gearBag.splice(+k.slice(3),1);val=gearPrice(it);cat='vu'}
 else{if(!has(k))return;addItem(k,-1);val=ITEMS[k].price||50;cat=ITEMS[k].cat==='dan'?'dan':ITEMS[k].cat==='lieu'?'lieu':'bao'}
 markAct(n,'gift');
 const base=val/(25*Math.pow(1.6,n.realm));let v=Math.round(clamp(base*8,1,30)*(cat===n.like?2:1))+persMod(n,'gift');v=clamp(v,1,40);
 const before=n.fav;let after=clamp(before+v,-100,100);
 if(v>0&&after>CAP.gift)after=Math.max(before,CAP.gift);
 n.fav=after;const got=after-before;
 addEntry(got>0?`Tặng quà cho ${esc(n.name)}: thiện cảm +${got}${cat===n.like?' (đúng sở thích!)':''}.`:(v>0?`Tặng quà cho ${esc(n.name)}, nhưng quà vật không thân thêm được nữa: cần cùng trải qua việc gì đó.`:`Tặng quà cho ${esc(n.name)} nhưng không hợp ý. Thiện cảm ${got}.`),'system');
 render();openNPC(id)};
try{PATCH_NOTES.unshift(['v10.17 · 07/11/2026 · Sửa lỗi spam thiện cảm',[
 'Mỗi NPC chỉ trò chuyện được 1 lần mỗi tháng (kể cả NPC đứng quầy trong trấn, trước đây có thể bấm liên tục 3 lần mỗi ngày). Tặng quà cũng chỉ 1 lần mỗi tháng cho mỗi người, cả ở quầy lẫn trong hồ sơ nhân vật.',
 'Thêm trần thiện cảm: gửi thư tối đa 30, trò chuyện tối đa 50, tặng quà tối đa 70. Trên mức đó chỉ tăng được bằng việc thật: giúp đỡ, cùng chiến đấu, luận đạo, tỷ thí, nhiệm vụ ẩn, sự kiện gặp gỡ.',
 'Hồ sơ NPC báo rõ khi tháng này đã trò chuyện/tặng quà hoặc khi đã chạm trần.']])}catch(e){}
})();
