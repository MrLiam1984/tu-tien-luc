/* ===== v10.28 · Sửa lỗi đổi trang phục ở tư thế khác bị trả về áo mặc định ===== */
(function(){
'use strict';
const D=window.DOLL;if(!D||!D.fixLook)return;
const has=(pose,k,id)=>{try{return !!id&&D.man[pose].items.some(i=>i.kind===k&&i.id===id)}catch(e){return false}};
const _f=D.fixLook;
D.fixLook=function(L,g){const keep=L?{pose:L.pose,face:L.face,hair:L.hair,outfit:L.outfit}:null;L=_f(L,g);
 if(L&&keep&&L.pose===keep.pose){for(const k of ['face','hair','outfit'])if(keep[k]&&has(L.pose,k,keep[k]))L[k]=keep[k]}return L};
const _nm=D.names;D.names=function(L){const o=_nm.apply(this,arguments);try{if(D.HELD&&D.HELD[L.pose]&&!L.wp)o.wp='Cầm sẵn theo tư thế'}catch(e){}return o};
try{PATCH_NOTES.unshift(['v10.28 · 08/11/2026 · Sửa nút đổi trang phục ở các tư thế',[
 'Sửa lỗi: ở các tư thế khác tư thế đầu (nam: khoanh tay, mã bộ, tựa kiếm, vung đao, ngoái nhìn; nữ: hiên ngang, yểu điệu, cầm trượng, ngoái nhìn) bấm ◀ ▶ trang phục không đổi hình vì bị trả về áo mặc định. Nay đổi được bình thường.',
 'Bản đồ ô vuông ở màn chính dùng biểu tượng địa danh vẽ bằng Flow thay cho emoji.']])}catch(e){}
try{PATCH_NOTES.unshift(['v10.29 · 08/11/2026 · Thêm trang phục và khuôn mặt cho các tư thế nam (vẽ bằng Flow)',[
 'Nam: tư thế Tựa kiếm, Vung trọng đao, Ngoái nhìn mỗi dáng thêm 5 trang phục (Long giáp kim bào, Thợ săn da thú, Tinh tú đạo bào, Kiếm tông hắc bạch, Yêu vương lang bì); Khoanh tay và Mã bộ có 15 bộ.',
 'Nam: tư thế Khoanh tay vác kiếm và Tựa kiếm nay chọn được 6 khuôn mặt (Hiền hòa, Mạnh mẽ, Gian xảo, Lạnh lùng, U sầu, Cười hiền), mỗi mặt là biểu cảm vẽ riêng bằng Flow.',
 'Còn thiếu: khuôn mặt cho nam Mã bộ, Vung đao, Ngoái nhìn, Đứng yên và toàn bộ dáng nữ nu2–nu7; xem HANDOFF.md.']])}catch(e){}
})();
