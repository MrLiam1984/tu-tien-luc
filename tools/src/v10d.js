/* ===== v10.7 · Tranh thủy mặc cho biến cố tu luyện, hái thuốc, khai khoáng; gặp lão nhân khi nhập định ===== */
(function(){
const _ci=window.cultIncident;
async function laoNhan(x){
 addEntry('👴 Một lão nhân râu bạc chống gậy bước tới, đứng lặng nhìn ngươi nhập định, tay xách bầu rượu.','system','Tu luyện');
 await sleep(400);
 let stop='';
 const pGood=clamp(38+(eff('ngo')-50)*0.5+(eff('duyen')-50)*0.4-S.tamMa/6,12,85);
 await choose('👴 Lão nhân giữa đường tu luyện','Lão nhân cười hiền, không nói tên, chỉ hỏi: "Tiểu hữu, đường tu hành khổ lắm, có muốn nghe lão nói vài câu?"',[
  {t:'🙇 Cung kính xin chỉ giáo',desc:`Có thể được chỉ điểm (~${Math.round(pGood)}%); lão nhân cũng có thể chỉ là kẻ say rượu, tốn nửa ngày`,run:async()=>{
    if(chance(pGood)){const g=Math.max(1,Math.round(tuviGain()*ri(4,8)/3));S.tuvi+=g;addTamMa(-2);addEntry(`✅ Lão nhân điểm một câu khiến ngươi sáng ra: tu vi +${g}, tâm ma −2.`,'good','Tu luyện')}
    else{const l=Math.min(S.linhThach,Math.round(ri(8,20)*(S.realm+1)));S.linhThach-=l;addEntry(`❌ Lão nhân say khướt nói lảm nhảm, còn kéo ngươi uống rượu giùm: mất ${l} linh thạch.`,'system danger','Tu luyện');stop='Bị lão nhân quấy nhiễu, đành xuất quan.'}}},
  {t:'🍶 Mời lão một bầu rượu quý',desc:'Tốn linh thạch nhưng thân thiện hơn: chắc chắn được một lời chỉ điểm nhỏ',run:async()=>{const fee=Math.min(S.linhThach,Math.round(ri(10,25)*(S.realm+1)));S.linhThach-=fee;const g=Math.max(1,Math.round(tuviGain()*ri(2,4)/3));S.tuvi+=g;addEntry(`Mời lão chén rượu (−${fee} linh thạch), được chỉ vài câu: tu vi +${g}.`,'system','Tu luyện')}},
  {t:'👁 Giữ cảnh giác, mặc kệ',desc:'Không được gì, cũng không mất gì. Nhưng biết đâu lão là cao nhân.',run:async()=>{addEntry('Ngươi giữ nguyên tư thế nhập định, lão nhân lắc đầu rồi biến mất sau làn sương.','system','Tu luyện')}}]);
 return stop}
if(typeof _ci==='function')window.cultIncident=async function(x,info){
 if(!window._ciForce&&S&&!S.dead&&chance(9)){try{return await laoNhan(x)}catch(e){console.error(e)}}
 return _ci.apply(this,arguments)};
window.__laoNhan=laoNhan;
try{PATCH_NOTES.unshift(['v10.7 · 07/11/2026 · Thêm tranh thủy mặc cho biến cố tu luyện và nghề phụ',[
 'Bảy tranh cảnh mới: sát thủ ám sát, yêu thú đánh hơi, bị cướp vây, độc khí, tâm ma hiện hình, linh khí bạo động và lão nhân gặp giữa đường. Mỗi biến cố khi tu luyện giờ hiện thẻ tranh riêng, và cửa sổ lựa chọn có tranh ở đầu.',
 'Mini game hái linh thảo và khai khoáng có tranh riêng ở đầu cửa sổ.',
 'Thêm biến cố mới khi tu luyện: gặp lão nhân. Cung kính xin chỉ giáo có thể được điểm hóa (tu vi tăng, tâm ma giảm) hoặc gặp phải lão say rượu; mời rượu thì chắc chắn được chỉ điểm nhỏ; mặc kệ thì không được gì.']])}catch(e){}
})();
