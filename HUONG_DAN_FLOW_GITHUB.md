# Hướng dẫn: kết nối Flow và đẩy GitHub cho người mới

## A. Kết nối Flow (flow.google.com) với Claude
1. Dùng Chrome trên máy có đăng nhập tài khoản Google đã có Flow (gói PRO/Ultra để tạo ảnh Nano Banana).
2. Cài tiện ích **Claude in Chrome**, đăng nhập cùng tài khoản Claude, bật quyền cho flow.google.com khi được hỏi. Chrome phải đang mở và máy không ngủ.
3. Mở sẵn project Flow (ví dụ https://flow.google.com/project/e0bfce9c-5c94-4ccc-8575-7ccc458280dc) rồi nhắn Claude "dùng Flow vẽ ...". Nếu Claude báo mất kết nối tab: mở lại tab Flow, gọi lại để Claude tạo nhóm tab mới.
4. Nếu app Claude Desktop có trình duyệt tích hợp, cũng dùng được, nhưng đăng nhập Google riêng.

## B. Dùng Flow tối ưu (rút từ dự án này)
- **Một ảnh gốc, nhiều biến thể**: gắn ảnh tham chiếu bằng nút "+", prompt cố định: "Same man, same exact pose and framing, same face and hair, same style, same flat magenta background. Only change his clothes to ..." (hoặc "Only change his facial expression to ..."). Nhờ vậy mọi biến thể cùng khung, ghép lớp được.
- **Nền magenta phẳng** để tách nền tự động (addout.py/addface.py).
- Cách nhau khoảng 20 giây mỗi lần tạo. Lỗi "hoạt động bất thường" thì tải lại trang project rồi thử lại.
- Gửi tối đa 3 ảnh mỗi lô lệnh để tránh Chrome hết thời gian chờ.
- Chọn ảnh tham chiếu bằng ô tìm kiếm trong "+" (tên ảnh do Flow tự đặt, ví dụ "Man standing with sword"); sau khi dùng, ảnh đó nhảy lên đầu danh sách.
- Xem ảnh đầy đủ độ phân giải: phóng ảnh 896x1200 rồi chụp vùng đó với lưu ra đĩa (không dùng chụp thu nhỏ, sẽ bị mờ).
- Ghi tên ảnh/mô tả rõ ràng, để Claude tìm lại.
- Mọi hình trong game phải vẽ bằng Flow, không tự vẽ bằng code.

## C. Kết nối và đẩy GitHub
1. Tạo tài khoản GitHub, tạo repo (repo hiện tại: MrLiam1984/tu-tien-luc).
2. Thêm collaborator: Settings > Collaborators > Add people (ví dụ `mangomint1805`).
3. Cho Claude quyền repo: trong claude.ai > Settings > Connectors > GitHub, cài GitHub App và chọn repo. Trong phiên làm việc, Claude gắn repo bằng công cụ add_repo rồi clone.
4. Quy trình đẩy mã:
   - `cp out66.html tu-tien-luc/index.html`; copy script vào `tools/src/`, ảnh mới vào `doll/`.
   - `cd tu-tien-luc && git add -A && git commit -m "..." && git push`.
   - Commit kèm dòng "Co-Authored-By" như quy ước dự án.
5. Bật GitHub Pages thủ công: Settings > Pages > Deploy from a branch > main / root. Sau 1–2 phút có link chơi trực tiếp.
6. Người nhận bàn giao: clone repo, đọc HANDOFF.md, build bằng `python3 build.py out.html` (cần thư mục nguồn như trong tools/).
