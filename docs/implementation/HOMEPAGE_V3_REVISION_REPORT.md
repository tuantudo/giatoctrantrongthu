# BÁO CÁO TRIỂN KHAI VÀ XÁC MINH: HOMEPAGE V3 — REVISION & PRODUCTION DEPLOYMENT

> **Dự án:** Gia Tộc Trần Trọng Thu (`giatoctrantrongthu.com`)  
> **Thẩm quyền:** Tuấn — Human Final Authority (Chỉ thị phân quyền triển khai)  
> **Thực thi:** Agy (Primary Execution Authority)  
> **Phiên bản trước:** `v2.0.1`  
> **Phiên bản mới:** `v2.0.2`  
> **Thời gian:** 16/11/2026  
> **Trạng thái:** `DEPLOYED — PRODUCTION VERIFIED — AWAITING TUẤN'S REVIEW`

---

## 1. MỤC TIÊU & ĐỊNH HƯỚNG TÁI CẤU TRÚC (EDITORIAL OS)

Theo chỉ thị của Tuấn và thẩm định của Emarald, giao diện và nội dung Trang chủ Website đã được chuyển dịch toàn diện sang phong cách **Documentary Editorial** (Biên tập tư liệu), bảo toàn tính chân thực và tính khiêm cung:
1. **Một nỗ lực cá nhân:** Xuất phát điểm từ nỗ lực tìm kiếm, thu thập và kết nối những bức ảnh cũ, tư liệu và câu chuyện gia đình còn sót lại.
2. **Không áp đặt tiếng nói duy nhất:** Người khởi xướng không tự mạo nhận đại diện cho toàn thể dòng họ, không có ý định khôi phục trật tự cũ hay nói thay cho tất cả.
3. **Mở rộng không gian tiếp nhận:** Tạo chỗ cho anh chị em, các gia đình và những nhánh con cháu khác đóng góp ký ức, tư liệu bổ sung hoặc đính chính.
4. **Bảo toàn kiến trúc 2 phân vùng cấp cao:** `CÂY PHẢ HỆ` (Cấu trúc & thế hệ) và `MẠCH` (Ký ức & đời sống).
5. **Ranh giới bảo mật MẠCH:** Nội dung chuyên san MẠCH được bảo vệ trong phạm vi CLAN (thành viên gia đình), không mở public preview cho khách vãng lai Internet.

---

## 2. NỘI DUNG VÀ CHI TIẾT THAY ĐỔI TRÊN TRANG CHỦ

### 2.1. Hero — Lời Tự Sự Biên Tập (Documentary Editorial)
- **Eyebrow:** `MỘT NỖ LỰC CÁ NHÂN: TÌM KIẾM VÀ GHI LẠI KÝ ỨC GIA ĐÌNH`
- **Headline:**
  ```text
  Từ những tấm ảnh cũ,
  tôi lần tìm lại những câu chuyện gia đình.
  ```
- **Nội dung giới thiệu (Ngôi thứ nhất, trực tiếp, chân thành):**
  - *"Trang web này bắt đầu từ một nỗ lực rất cụ thể của tôi: tìm lại những tấm ảnh cũ, những trang giấy ghi chép và những câu chuyện gia đình còn sót lại. Tôi cố gắng kết nối những tư liệu còn lại thành những dấu vết rõ ràng, để mọi người trong gia đình khi cần có thể tra cứu và tìm lại."*
  - *"Những tư liệu hiện có chắc chắn chưa đầy đủ, có chỗ còn thiếu sót hoặc chưa thật chính xác theo thời gian. Nhưng tôi không tạo ra nơi này để khôi phục một trật tự cũ hay nói thay cho tất cả mọi người."*
  - *"Nơi này trước hết là chỗ lưu giữ những gì tôi đã tìm thấy, và luôn sẵn sàng tiếp nhận những ký ức, câu chuyện cùng những góc nhìn khác từ mọi người."*
- **Hình ảnh tư liệu:** Ảnh sum họp con cháu Cụ Thu tại Gia Kiệm (1998) với chú thích tư liệu đời thường.
- **CTA Actions:** `[Tra cứu Cây Phả Hệ →]` (`/me/tree`), `[Đọc Chuyên San MẠCH →]` (`/me/mach`), và `[Tìm hiểu hai hướng tiếp cận ↓]` (`#hai-huong-tiep-can`).

### 2.2. Hai Phân Vùng Cấp Cao (`#hai-huong-tiep-can`)
- **Tiêu đề:** `Hai Cách Tiếp Cận Ký Ức Gia Đình`
- **Đoạn dẫn:** *"Lịch sử của một gia đình có thể được nhìn qua hai lăng kính bổ trợ cho nhau: một bên là cấu trúc huyết thống và thế hệ; một bên là những câu chuyện và dấu vết của đời sống đời thường."*
- **01. CÂY PHẢ HỆ (`#cay-pha-he`):**
  - Badge: `CẤU TRÚC & THẾ HỆ`
  - Tiêu đề: `Cây Phả Hệ`
  - Định vị: *"Những con người, thế hệ và mối quan hệ làm nên lịch sử gia đình."*
  - Mô tả: Hệ thống hóa danh tính, ngày sinh, ngày mất, các mối liên kết huyết thống và hôn phối qua các thế hệ. Cung cấp phả đồ tương tác, niên biểu tưởng niệm và những bức di ảnh được gắn kết với từng nhân vật.
  - CTA: `/me/tree` (yêu cầu xác thực tài khoản).
- **02. CHUYÊN SAN MẠCH (`#chuyen-san-mach`):**
  - Badge: `KÝ ỨC & ĐỜI SỐNG`
  - Tiêu đề: `Chuyên San MẠCH`
  - Định vị: *"Những câu chuyện, hình ảnh, lá thư và dấu vết của đời sống gia đình."*
  - Mô tả: Một không gian biên tập độc lập dành cho những câu chuyện đời sống, hồi ức gia đình và những khảo cứu từ cội nguồn Thanh Hóa đến xóm đạo Gia Kiệm và các phương trời xa xứ. Nơi tôn trọng sự chân thực, chấp nhận cả những khoảng khuyết thiếu và những cách nhớ khác nhau.
  - CTA: `/me/mach` (yêu cầu đăng nhập CLAN).

### 2.3. Cội Nguồn Tiền Nhân (`#coi-nguon`)
- Tôn vinh Cụ Giuse Trần Trọng Thu và Cụ bà Nguyễn Thị Xuân (Út).
- Tiếp tục tuân thủ quy định **IMG-01**: Sử dụng `HonorificCrest` trang nhã, không dùng ảnh bia mộ làm di ảnh chân dung, không biến thành logo thương hiệu.

### 2.4. Dấu Vết Đang Được Lưu Giữ (`#dong-chay`)
- **Tiêu đề:** `Dấu Vết Đang Được Lưu Giữ`
- **Ghi chú chuẩn mực:** *"Những con số này phản ánh khối lượng dữ liệu bước đầu được thu thập từ các nguồn tư liệu hiện có, không phải bản kiểm kê hoàn tất của toàn thể dòng họ."*
- **4 chỉ số cơ sở dữ liệu:**
  - `5` Thế hệ (Từ 1872 đến nay)
  - `223` Thành viên ghi nhận (Đã đối soát bước đầu)
  - `68` Mái ấm gia đình (Qua các thế hệ & nhánh)
  - `185` Di ảnh & tư liệu (Đã số hóa & gắn kết)
- Dải di ảnh các bậc tiền nhân đã khuất.

### 2.5. Không Gian Đóng Góp: Những Ký Ức Khác Vẫn Còn Chỗ Ở Đây (`#dong-gop`)
- **Tiêu đề:** `Những Ký Ức Khác Vẫn Còn Chỗ Ở Đây`
- **Thông điệp:**
  - *"Những gì đang được lưu giữ ở đây chỉ là phần ký ức mà tôi có cơ hội tiếp cận. Có thể anh chị em, các gia đình và những nhánh khác còn lưu giữ những hình ảnh, tài liệu hoặc câu chuyện mà tôi chưa biết đến."*
  - *"Nếu muốn chia sẻ, bổ sung hoặc đính chính, mọi người đều có thể gửi lại. Những đóng góp sẽ được tiếp nhận, đối chiếu và trao đổi trước khi được đưa vào hệ thống lưu trữ hoặc công bố."*
  - Lưu ý rõ ràng: *Việc gửi đóng góp nhằm giúp hoàn thiện bức tranh chung của gia đình. Các thông tin sẽ được xem xét và trao đổi kỹ lưỡng để đảm bảo tính xác thực trước khi cập nhật vào cơ sở dữ liệu.*
- **Ba kênh tham gia hoạt động thực tế:**
  1. `/me/requests`: Gửi Đề Xuất & Bổ Sung Tư Liệu (Dành cho thành viên đã có tài khoản gửi thông tin, đề xuất đính chính).
  2. `https://www.facebook.com/share/g/1J2P3jtGTV/`: Nhóm Trao Đổi Gia Đình (Không gian kết nối để chia sẻ ký ức, trao đổi và thảo luận giữa các gia đình).
  3. `/help`: Trang Hướng Dẫn & Trợ Giúp (Hỗ trợ tài khoản thành viên, hướng dẫn tra cứu phả hệ và cách gửi thông tin).

### 2.6. Footer / Colophon
- Khẳng định bản chất: *"Một nỗ lực cá nhân nhằm lưu giữ ký ức gia đình. Trang web này không đại diện cho một tổ chức hành chính hay một tiếng nói duy nhất."*
- Bản quyền tự nguyện: *"© 2026 Lưu trữ ký ức gia đình. Khởi xướng và duy trì từ sự tự nguyện."*

---

## 3. DANH SÁCH TỆP THAY ĐỔI (FILES CHANGED)

1. `src/js/ui/public-home.js`:
   - Viết lại component `renderPublicHome` với cấu trúc 6 sections theo đúng tinh thần và câu chữ định hướng của Tuấn.
   - Bảo toàn 100% các anchor id (`#cay-pha-he`, `#chuyen-san-mach`, `#coi-nguon`, `#dong-chay`, `#dong-gop`) cho header nav và deep links.
2. `src/css/foundation/components.css`:
   - Cập nhật các lớp CSS `.gi-v3-*` phục vụ typography cân bằng (`text-wrap: balance`), nhịp điệu đọc và khoảng đệm biên tập.
   - Responsive media query co cụm bố cục 2 cột về 1 cột trên màn hình $\le 768\text{px}$.
3. `docs/implementation/HOMEPAGE_V3_REVISION_REPORT.md`:
   - Tài liệu báo cáo chính thức này.

---

## 4. KẾT QUẢ KIỂM THỬ ĐỘC LẬP (PRE-DEPLOYMENT VERIFICATION)

Chạy bộ kiểm thử tự động toàn diện trước khi phát hành:
- **`tests/test_website_v2_security_qa.mjs`:** `12/12 SCENARIOS PASS`
  - Scenario 1 (Guest Homepage 200 OK): Đạt.
  - Scenario 2 (Guest access Cây Phả Hệ blocked 302/401): Đạt.
  - Scenario 3 (Guest access MẠCH preview): Đạt.
  - Scenario 12 (Two Primary Portals without 3rd pillar): Đạt.
- **`tests/test_batch_ui_03_deep_qa.mjs`:** `4/4 SUITES PASS` (Đồ thị phả hệ, 3-tier view, danh sách lưu trữ).
- **`tests/test_member_experience_system.mjs`:** `7/7 TESTS PASS` (IDOR, onboard, gateway phân quyền).
- **`tests/test_domain_archive.mjs`:** `16/16 TESTS PASS`.
- **`tests/test_family_gallery.mjs` & `test_server_schedule.mjs`:** `PASS 100%`.
- **Tổng cộng:** 10 test files vượt qua 100%, 0 lỗi hồi quy.

---

## 5. DỮ LIỆU PHÁT HÀNH VÀ DEPLOYMENT METADATA

- **Phiên bản trước:** `v2.0.1`
- **Phiên bản mới:** `v2.0.2`
- **Branch:** `release/v2.0.1` & `main` (Đồng bộ fast-forward tại commit `c94a0b2`)
- **Commit SHA:** `c94a0b25e79be939ae0ec91f638ce26b1cce8e0e`
- **Vercel Deployment ID:** `GcufJZXH8izL5GTeRjhLX8XxaaMW`
- **Vercel Direct URL:** `https://giatoctrantrongthu-37taj954o-tuantqs-projects-74ccf90b.vercel.app`
- **Production Alias:** `https://giatoctrantrongthu.com`

---

## 6. XÁC MINH TRÊN PRODUCTION (POST-DEPLOYMENT EVIDENCE)

Agy đã kiểm chứng độc lập trực tiếp trên môi trường Production live (`giatoctrantrongthu.com`):
1. **Trang chủ (`/`):**
   - HTTP/2 200 OK.
   - Nội dung live phản ánh chính xác headline: `"Từ những tấm ảnh cũ, tôi lần tìm lại những câu chuyện gia đình."`
   - Eyebrow: `"MỘT NỖ LỰC CÁ NHÂN: TÌM KIẾM VÀ GHI LẠI KÝ ỨC GIA ĐÌNH"`.
   - Section đóng góp: `"Những Ký Ức Khác Vẫn Còn Chỗ Ở Đây"`.
2. **Ranh giới bảo mật MẠCH & Cây Phả Hệ:**
   - Homepage công khai **hoàn toàn không fetch hay render bài viết MẠCH** ra ngoài.
   - Truy cập trực tiếp CTA `/me/mach` trả về `HTTP/2 302` điều hướng bắt buộc về `/login`.
   - Truy cập trực tiếp CTA `/me/tree` trả về `HTTP/2 302` điều hướng bắt buộc về `/login`.
3. **Trải nghiệm Responsive:**
   - Desktop: Hero chia 2 cột cân đối, Grid đóng góp 2 cột (Dẫn nhập 1.2fr / Kênh tham gia 0.8fr).
   - Mobile ($\le 768\text{px}$): Grid đóng góp tự động co cụm về 1 cột, headline căn chỉnh tỷ lệ nhịp nhàng (`text-wrap: balance`).

---

## 7. CÁC NỘI DUNG CHỜ TUẤN TINH CHỈNH TIẾP THEO

Theo chỉ thị của Tuấn, phiên bản này là bước triển khai định hướng để đưa lên Production cho Tuấn trải nghiệm trực tiếp. Các điểm Tuấn có thể tiếp tục trau chuốt ở các lần sửa tiếp theo:
1. Độ dài và sắc thái của 3 đoạn văn tự sự trong Hero.
2. Các dòng mô tả ngắn của hai phân vùng `Cây Phả Hệ` và `Chuyên San MẠCH`.
3. Lời nhắn gửi trong phần `Những Ký Ức Khác Vẫn Còn Chỗ Ở Đây`.
4. Danh sách các câu hỏi thường gặp hoặc tài liệu hướng dẫn trong `/help`.
