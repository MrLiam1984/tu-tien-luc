/* ===== v10.23 · Hiệu ứng ánh sáng theo phẩm cho icon trang bị/vật phẩm + huy hiệu đồ theo bộ ===== */
(function(){
'use strict';
const css=`
/* khung icon dạng ô túi đồ và nhãn danh sách */
.gic{position:relative;display:inline-block;vertical-align:middle;line-height:0;border-radius:9px;margin-right:6px}
.gic .v7gi{margin:0!important}
.bg-t,.gic{--gc:#b8a67a}
.bg-t .bic,.bg-t .gi{position:relative;z-index:1}
/* phẩm 2 trở lên: viền sáng nhẹ */
.bg-t.gr2,.gic.gr2{box-shadow:0 0 6px color-mix(in srgb,var(--gc) 55%,transparent)}
.bg-t.gr3,.gic.gr3{box-shadow:0 0 9px color-mix(in srgb,var(--gc) 75%,transparent),inset 0 0 8px color-mix(in srgb,var(--gc) 30%,transparent)}
.bg-t.gr4,.gic.gr4{box-shadow:0 0 12px var(--gc),inset 0 0 10px color-mix(in srgb,var(--gc) 45%,transparent);animation:v10pulse 2.6s ease-in-out infinite}
.bg-t.gr5,.gic.gr5{box-shadow:0 0 14px var(--gc),0 0 4px #fff8,inset 0 0 12px color-mix(in srgb,var(--gc) 55%,transparent);animation:v10pulse 2.1s ease-in-out infinite}
.bg-t.gr6,.gic.gr6{box-shadow:0 0 18px var(--gc),0 0 6px #fff,inset 0 0 14px color-mix(in srgb,var(--gc) 65%,transparent);animation:v10pulse 1.6s ease-in-out infinite}
@keyframes v10pulse{0%,100%{filter:brightness(1)}50%{filter:brightness(1.18) saturate(1.15)}}
/* quét sáng chéo từ phẩm 3 */
.bg-t.gr3::after,.bg-t.gr4::after,.bg-t.gr5::after,.bg-t.gr6::after,.gic.gr3::after,.gic.gr4::after,.gic.gr5::after,.gic.gr6::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:2;background:linear-gradient(115deg,transparent 38%,rgba(255,255,255,.8) 50%,transparent 62%);background-size:260% 100%;background-position:160% 0;animation:v10shine 3.4s ease-in-out infinite;mix-blend-mode:overlay}
.bg-t:nth-child(3n)::after,.bg-t:nth-child(3n+1)::after{animation-delay:-1.1s}
.bg-t:nth-child(5n)::after{animation-delay:-2.2s}
@keyframes v10shine{0%,55%{background-position:160% 0}100%{background-position:-60% 0}}
/* lấp lánh từ phẩm 5 */
.bg-t.gr5::before,.bg-t.gr6::before,.gic.gr5::before,.gic.gr6::before{content:'';position:absolute;inset:-3px;border-radius:inherit;pointer-events:none;z-index:3;background:radial-gradient(circle at 18% 22%,#fff 0 1.6px,transparent 2.6px),radial-gradient(circle at 84% 28%,#fff 0 1.3px,transparent 2.3px),radial-gradient(circle at 72% 84%,#fff 0 1.7px,transparent 2.7px),radial-gradient(circle at 24% 78%,#fff 0 1.2px,transparent 2.2px);animation:v10twk 1.9s ease-in-out infinite}
@keyframes v10twk{0%,100%{opacity:.15;transform:scale(.96)}50%{opacity:1;transform:scale(1.04)}}
/* phẩm 6: vòng hào quang quay */
.bg-t.gr6{background:conic-gradient(from 0deg,rgba(255,255,255,.0),color-mix(in srgb,var(--gc) 45%,transparent),rgba(255,255,255,0) 40%),radial-gradient(circle at 50% 40%,#fbf6e6,#e4dac0)}
/* ĐỒ THEO BỘ: khung vàng nét đứt + huy hiệu tròn ở góc, nhìn là biết */
.bg-t.isset{outline:2px dashed #e2b83f;outline-offset:-4px}
.gic.isset{outline:2px dashed #e2b83f;outline-offset:1px}
.isset .setm{position:absolute!important;right:-6px;bottom:-6px;z-index:5;border-radius:50%;background-color:#2a1d0c!important;box-shadow:0 0 0 2px #f0cb5c,0 0 9px 2px rgba(255,208,80,.85),inset 0 0 0 1px #fff3;animation:v10set 2.4s ease-in-out infinite}
.gic.isset .setm{right:-5px;bottom:-5px}
.isset::after{background-size:260% 100%}
@keyframes v10set{0%,100%{box-shadow:0 0 0 2px #f0cb5c,0 0 6px 1px rgba(255,208,80,.6),inset 0 0 0 1px #fff3}50%{box-shadow:0 0 0 2px #ffe58a,0 0 12px 4px rgba(255,220,110,1),inset 0 0 0 1px #fff5}}
.bg-det .gic{margin-right:8px}
.iico{image-rendering:auto}`;
if(!document.getElementById('v10tcss')){const s=document.createElement('style');s.id='v10tcss';s.textContent=css;document.head.appendChild(s)}
try{PATCH_NOTES.unshift(['v10.23 · 08/11/2026 · Hiệu ứng cho icon trang bị, vật phẩm và đồ theo bộ',[
 '<b>Ánh sáng theo phẩm</b>: icon trang bị trong túi đồ, kho và danh sách có viền sáng từ phẩm Lương; từ phẩm Huyền có vệt sáng quét chéo; từ phẩm Bảo nhấp nháy nhịp thở; từ phẩm Thánh có lấp lánh; phẩm cao nhất có hào quang quay.',
 '<b>Đồ theo bộ có ký hiệu riêng</b>: khung vàng nét đứt cùng huy hiệu tròn của bộ (Thanh Phong, Kim Cang, Xích Diễm, Huyền Thủy, Hậu Thổ, Kinh Lôi, Tử Vân, Phúc Duyên) gắn ở góc icon, nhấp nháy vàng, nhìn lướt là biết món nào thuộc bộ.',
 '<b>Vật phẩm dùng chung icon nay có màu riêng</b>: đan dược, khoáng thạch, ngọc, sa, linh thảo, phù lục đổi sắc theo hệ trong tên (Hỏa đỏ, Thủy lam, Mộc lục, Lôi tím, Thổ nâu, Kim vàng, Ám tối) và phát sáng theo cấp.',
 'Sửa lỗi icon: các món có chữ "Lôi" (Lôi Báo Gân, Lôi Văn Sa, Tránh Lôi Châu) không còn bị hiện thành đan lô.']])}catch(e){}
})();
