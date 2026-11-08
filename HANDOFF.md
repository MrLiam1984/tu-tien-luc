# Bàn giao Tu Tiên Lục (08/11/2026)

Game 1 file HTML (index.html = build từ tools/src/*.js + doll/*.webp). Artifact: https://claude.ai/artifact/VMafMZEMzXWWdv4TQNy31s. Quy tắc: tiếng Việt, thiết kế "trả giá và đánh đổi", mọi hình (bản đồ, icon, trang phục, mặt) PHẢI vẽ bằng Google Flow, không tự vẽ bằng code.

## Đã xong
- Icon vật phẩm (ic2_atlas.webp), bản đồ/marker thủy mặc (cm_*.webp, mk_atlas.webp) từ Flow.
- Sửa lỗi nút trang phục không đổi ở dáng 2+ (v10y.js, fixLook).
- Nam: nam4, nam5, nam6 mỗi dáng 12 trang phục; nam2, nam3 15 bộ; nam1 40 bộ.
- Khuôn mặt chọn được: nam1 (14), nam2 (6), nam4 (6: hien, manh, gian, lanh, usau, cuoi).

## Còn thiếu (làm tiếp)
1. Khuôn mặt (biểu cảm) cho nam3 (Mã bộ/đấm), nam5 (Vung đao), nam6 (Ngoái nhìn), nams, và nữ nu2–nu7 (nữ chỉ nu1 có mặt; nu2–7 mới có 7 bộ).
2. Thêm trang phục cho nữ nu2–nu7 cho ngang nam.
3. ~79 sự kiện còn dùng tranh cảnh chung: vẽ tranh riêng bằng Flow.
4. Bản đồ thị trấn (v10v.js twDeco/townSvg) còn vẽ bằng code: thay bằng ảnh Flow; bản đồ 3D Bát Hoang chưa đồng bộ thủy mặc.
5. ic2_atlas: v10w.js còn ROWS=8 trong khi có 130 tên (cần 9 hàng); chạy lại gen/ic2/mk.py và /tmp ic2t.py để kiểm.
6. Smoke test báo "load fail" (s.onerror) ở index.html: chưa kịp tra, nghi một ảnh/atlas thiếu.
7. Bật GitHub Pages thủ công và thêm collaborator `mangomint1805`.

## Quy trình thêm ảnh
- Flow (flow.google.com project e0bfce9c-5c94-4ccc-8575-7ccc458280dc): chọn ảnh tham chiếu bằng "+", gõ prompt dạng "Same man, same exact pose... Only change his clothes/facial expression to ...", nền magenta phẳng. Chờ ~20s giữa các lần.
- Trang phục: `python3 tools/addout.py <pose> id:shot:Tên:tag1/tag2` (cần ảnh chụp ở /tmp). Khuôn mặt: `python3 tools/addface.py <pose> id:shot:Tên:tags` (cắt vùng mặt 100x135, ellipse mờ, lọc nền). Sau đó `python3 tools/mkdoll.py` (sinh v8a.js, copy doll) rồi `python3 build.py out.html`.
- Ghi PATCH_NOTES trong v10y.js, commit kèm Co-Authored-By.
