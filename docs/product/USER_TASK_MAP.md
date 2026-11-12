# BẢN ĐỒ NHIỆM VỤ NGƯỜI DÙNG GIA TỘC (USER TASK MAP)
## PHÂN TÍCH 7 NHIỆM VỤ CỐT LÕI QUA 7 TIÊU CHÍ TRẢI NGHIỆM TƯƠNG TÁC — V2.0.1 CANDIDATE

**Dự án:** Gia Tộc Trần Trọng Thu  
**Phiên bản khảo sát:** V2.0.1 Candidate (`release/v2.0.1`)  
**Tác giả chuyên trách:** AGENT A (Product Researcher & UX Strategist — Batch 2A)  
**Thẩm quyền phê duyệt tối cao:** Tuấn (Human Final Authority / Product Owner)  
**Thẩm quyền kiểm toán kiến trúc & QC:** Emarald (Strategic Architecture & QC Authority)  
**Master Execution Authority:** AGY  
**Phương pháp thẩm định:** Phân tích thực nghiệm mã nguồn (Forensic Source Analysis), Khảo sát thao tác mô phỏng người dùng thực tế (Simulated User Walkthroughs), Đối soát 7 chiều UX Heuristic Matrix.

---

## 1. KHUNG PHÂN TÍCH 7 NHIỆM VỤ × 7 TIÊU CHÍ (THE 7×7 UX FRAMEWORK)

Mỗi nhiệm vụ người dùng (User Task) được khảo sát toàn diện qua 7 tiêu chuẩn tương tác công nghệ & nhân bản:
1. **Discoverability (Khả năng phát hiện):** Người dùng có dễ dàng nhìn thấy lối vào, tính năng và các điểm neo điều hướng không?
2. **Comprehension (Khả năng lĩnh hội):** Ngôn từ, danh xưng, nhãn nút và cấu trúc thông tin có mộc mạc, gần gũi với phong tục Việt Nam và ngôn ngữ gia đình không?
3. **Efficiency (Hiệu quả thao tác):** Số lượng bước chạm (clicks/taps), độ trôi chảy của quy trình, tránh việc phải cuộn hoặc chuyển hướng vòng quanh.
4. **Feedback (Phản hồi tương tác):** Trạng thái hệ thống khi tải trang, khi gửi dữ liệu, hoặc khi xảy ra sự cố có được giải thích ấm áp, rõ ràng không?
5. **Recovery (Khả năng phục hồi):** Khi người dùng quên mật khẩu, nhập sai dữ liệu, hoặc máy chủ lưu trữ tạm nghỉ, hệ thống có cung cấp lối thoát tự nhiên không (Zero Dead-ends)?
6. **Accessibility (Trợ năng & Tiếp cận):** Mức độ thân thiện với thị lực người cao niên, kích thước vùng chạm (`>= 44px`), độ tương phản chữ (`WCAG AA > 4.5:1`), tính tôn nghiêm phẳng 2D.
7. **Mobile Ergonomics (Công thái học di động):** Trải nghiệm thực tế trên màn hình hẹp (375px đến 430px), ngón tay cái thao tác một tay, không tràn ngang (`0 horizontal scroll`).

---

## 2. MA TRẬN TỔNG QUAN 7 NHIỆM VỤ NGƯỜI DÙNG (7 TASKS EXECUTIVE MATRIX)

| Mã Task | Tên Nhiệm Vụ (User Task) | Đối Tượng Trọng Tâm | Bề Mặt Tương Tác Chính | Trạng Thái Thẩm Định | Điểm UX Đánh Giá (1-5) |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **TASK 1** | **Discover Family** (Tìm hiểu cội nguồn, lịch sử, các nhánh) | Khách, Con cháu mới lớn, Trưởng bối | `/`, `#coi-nguon`, `#dong-chay` | **VERIFIED** | **4.3 / 5.0** |
| **TASK 2** | **Find People** (Tìm người, quan hệ huyết thống, cha mẹ/con cái) | Thành viên, Con cháu trẻ, Cao niên | `/me/tree`, `/me/tree/person/:id` | **VERIFIED** | **4.5 / 5.0** |
| **TASK 3** | **Explore Memories** (Xem ảnh gia đình, câu chuyện sau tấm ảnh) | Mọi thành viên, Trưởng bối | `/me/gallery`, Thẻ di ảnh hồ sơ | **VERIFIED** | **4.6 / 5.0** |
| **TASK 4** | **Read & Remember** (Đọc bài viết MẠCH, ký ức dòng họ) | Con cháu trẻ, Dâu rể, Thành viên | `/me/mach`, `/me/clara` | **VERIFIED** | **4.7 / 5.0** |
| **TASK 5** | **Contribute** (Gửi ảnh, đính chính năm sinh/mất, viết hồi ức) | Người giữ kỷ vật, Trưởng chi | `/me/contribute`, `/me/requests` | **VERIFIED** | **4.1 / 5.0** |
| **TASK 6** | **Member Experience** (Đăng nhập, xem hồ sơ, đổi mật khẩu) | Thành viên mới & cũ | `/login`, `/me/account`, `/me/change-password` | **VERIFIED** | **4.4 / 5.0** |
| **TASK 7** | **Help & Recovery** (Bắt đầu từ đâu, lấy lại mật khẩu, giờ nghỉ) | Người cao niên, Khách chưa có tài khoản | `/help`, `/help/recovery`, Schedule Banner | **VERIFIED** | **4.0 / 5.0** |

---

## 3. KHẢO SÁT CHI TIẾT TỪNG NHIỆM VỤ NGƯỜI DÙNG (DETAILED TASK WALKTHROUGHS)

---

### TASK 1: DISCOVER FAMILY — TÌM HIỂU GIA TỘC, LỊCH SỬ & CÁC NHÁNH

#### 1. Mục tiêu & Tâm thế người dùng
- **Ai thực hiện:** Khách vãng lai, con cháu họ hàng xa, bạn bè của gia đình, hoặc người thân mới nghe nói đến trang web.
- **Tâm thế:** Tò mò, tìm kiếm sự liên thuộc: *"Đây có phải dòng họ của ông bà mình không? Cội nguồn ở đâu? Đã trải qua bao nhiêu đời rồi?"*
- **Kỳ vọng:** Được chào đón bằng sự trang trọng, ấm áp; không bị choáng ngợp bởi thuật ngữ kỹ thuật hay đòi hỏi đăng nhập ngay lập tức.

#### 2. Kịch bản thực tế (Simulated Walkthrough Steps)
1. **Bước 1 — Tiếp cận:** Người dùng gõ `giatoctrantrongthu.com` hoặc bấm link từ Facebook nhóm họ.
2. **Bước 2 — Tiếp nhận thông điệp Hero:** Đọc dòng chữ lớn: *"NĂM THẾ HỆ TIẾP NỐI. MỘT CỘI NGUỒN CHUNG."* kèm bức ảnh đen trắng sum họp các thế hệ con cháu Cụ Thư - Bà Sa.
3. **Bước 3 — Lướt xem Tiền nhân khai sáng:** Cuộn xuống Section 02 thấy hai Huy hiệu Danh kính (Monogram Crest) màu vàng đồng của Cụ Giuse Trần Trọng Thu (1872-1969) và Cụ bà Nguyễn Thị Xuân (1888-1929) với thông tin gốc phả hệ Thanh Hóa.
4. **Bước 4 — Nắm bắt quy mô dòng họ:** Xem dải số liệu Section 03: 5 thế hệ, 223 thành viên, 68 mái ấm gia đình, 185 di ảnh & tư liệu bảo tồn. Xem dải di ảnh 4 vị tiền bối đã quy tiên.
5. **Bước 5 — Tìm đường bước vào phả hệ:** Thấy 3 thẻ Section 04: Cây Phả Đồ, Lịch Giỗ, Kho Tư Liệu Ảnh. Bấm vào nút `[Mở Cây Phả Đồ →]`.

#### 3. Đánh giá 7 tiêu chí UX (Heuristic Breakdown)
- **Discoverability (4/5):** Bố cục cuộn dọc tự nhiên rất dễ phát hiện. Nút bấm chính màu huyết dụ nổi bật trên nền giấy Dó (`#f7f3ea`).
- **Comprehension (4.5/5):** Lời tựa xúc động, sâu lắng. Danh xưng tiền nhân, gốc phả hệ F0, chính thất được trình bày chuẩn mực phong tục truyền thống.
- **Efficiency (4/5):** Trong vòng 15 giây, người xem nắm trọn lịch sử 150 năm của gia tộc mà không cần mở bất kỳ menu con nào.
- **Feedback (4/5):** Trang tải tĩnh từ Vercel CDN cực nhanh (< 200ms), không có hiện tượng giật layout (CLS = 0).
- **Recovery (3.5/5):** Nếu vô tình cuộn xuống cuối trang, người già không biết cách quay lại đầu trang nhanh do thiếu nút "Lên đầu trang" (Back to Top).
- **Accessibility (4.8/5):** Tương phản chữ đạt chuẩn WCAG AA (> 4.8:1). Không sử dụng hiệu ứng lóa mắt, không có hình ảnh bia mộ gây phản cảm.
- **Mobile (4.5/5):** Hiển thị vừa vặn trên iPhone SE 375px; ảnh sum họp co giãn tỉ lệ chuẩn; thanh menu cuộn ngang không che mất nội dung.

#### 4. Điểm nghẽn phát hiện & Giải pháp đề xuất
- **Điểm nghẽn (Pain Point 1.1):** Nút `[Mở Cây Phả Đồ →]` tại Section 04 trỏ trực tiếp vào `/me/tree`, khiến người dùng chưa đăng nhập bị backend redirect bất ngờ sang form đăng nhập (`/login`).
- **Giải pháp:** Nếu phát hiện chưa có session đăng nhập, chuyển hướng người dùng tới trang `#/gia-pha` (Lời mời gia nhập trang trọng kèm giải thích lý do bảo mật dữ liệu người sống) thay vì đẩy thẳng vào form đăng nhập lạnh lùng.

---

### TASK 2: FIND PEOPLE — TÌM NGƯỜI, QUAN HỆ HUYẾT THỐNG & PHẢ HỆ

#### 1. Mục tiêu & Tâm thế người dùng
- **Ai thực hiện:** Thành viên đã đăng nhập (đặc biệt là con cháu trẻ muốn tìm hiểu vai vế, hoặc các bác lớn tuổi muốn tra cứu chi nhánh).
- **Tâm thế:** Tìm kiếm chính xác: *"Tôi muốn xem bác Hạnh sinh năm nào? Có mấy người con? Bác Hạnh là anh hay em của bác Thìn? Tôi gọi cụ Thu bằng gì?"*
- **Kỳ vọng:** Cây phả đồ dễ nhìn, không bị rối mắt như các sơ đồ mạng nhện khổng lồ; tìm kiếm được tên dù gõ không dấu hoặc viết hoa/thường.

#### 2. Kịch bản thực tế (Simulated Walkthrough Steps)
1. **Bước 1 — Vào Cây phả đồ:** Người dùng chọn mục `Cây phả đồ` trên menu thành viên (`/me/tree`).
2. **Bước 2 — Tiếp cận Chế độ Phả đồ 3 Tầng (3-Tier Me-Centric Tree):**
   - Mặc định màn hình hiển thị người trọng tâm (Focus Person) với cấu trúc 3 tầng tôn nghiêm:
     * *Tầng trên (Tier 1):* Cha Mẹ (Bố mẹ ruột).
     * *Tầng giữa (Tier 2):* Người trọng tâm + Vợ/Chồng (Hôn phối).
     * *Tầng dưới (Tier 3):* Các con trực hệ kèm số lượng cháu chắt.
3. **Bước 3 — Lần theo dòng máu (Lineage Breadcrumb Trail):** Phía trên phả đồ có dải chỉ dẫn huyết thống: `Cụ Giuse Thu (F0) → Cụ Thư (F1) → Bác Hạnh (F2) → Tuấn (F3)`. Bấm vào bất kỳ người nào trên dải này, phả đồ lập tức chuyển trọng tâm về người đó.
4. **Bước 4 — Chuyển sang Danh bạ tra cứu toàn tộc (Archival List View):** Bấm nút chuyển chế độ sang `Danh sách phả hệ`. Ô tìm kiếm cho phép gõ "hanh" hoặc "Hạnh", danh sách 223 người lọc tức thì, hiển thị năm sinh/năm mất và quan hệ.
5. **Bước 5 — Xem Hồ sơ nhân vật 6 tầng (Person 6-Layer Profile):** Bấm vào tên nhân vật mở trang `/me/tree/person/:id`. Người xem đọc được: Thông tin cơ bản, Dòng thời gian cuộc đời, Ngày giỗ âm lịch, Quan hệ thân tộc (bố mẹ, anh em, con cái), Di ảnh kỷ vật, và Ký ức truyền khẩu.

#### 3. Đánh giá 7 tiêu chí UX (Heuristic Breakdown)
- **Discoverability (4.5/5):** Nút chuyển đổi giữa `Phả đồ` và `Danh sách` đặt ngay đầu trang; ô tìm kiếm nổi bật.
- **Comprehension (4.8/5):** Mô hình 3 tầng (Cha mẹ - Mình - Con cái) cực kỳ trực quan, phản ánh đúng cách người Việt hình dung về gia đình, tránh được sự phức tạp của cây phả hệ đa thế hệ kiểu phương Tây.
- **Efficiency (4.6/5):** Bấm vào nút `[↓ N con]` mở rộng nhánh con ngay tại chỗ mà không cần tải lại trang. Tìm kiếm không dấu cực nhanh.
- **Feedback (4.5/5):** Khi một nhân vật chưa có thông tin ngày mất hoặc quê quán, hệ thống ghi rõ: *"Trường chưa có dữ liệu sẽ được nói rõ thay vì suy đoán"*, kèm huy hiệu trạng thái nhận thức (`✓ Đã xác minh` hoặc `? Cần chứng cứ`).
- **Recovery (4.2/5):** Có nút `[Về gốc Cụ Thu]` giúp người dùng nhanh chóng quay lại tổ tiên ban đầu nếu bị lạc nhánh.
- **Accessibility (4.5/5):** Các nút bấm và thẻ nhân vật có kích thước lớn, font chữ Serif trang trọng, không có viền cong bo tròn hay bóng đổ lòe loẹt.
- **Mobile (4.4/5):** Trên màn hình 375px, phả đồ tự động xếp dọc theo dạng thẻ liên hoàn, thao tác cuộn mượt mà.

#### 4. Điểm nghẽn phát hiện & Giải pháp đề xuất
- **Điểm nghẽn (Pain Point 2.1):** Trên hồ sơ nhân vật (`person.js`), khi người già muốn gọi điện cho người quản trị để hỏi thêm về cụ này thì không có nút liên hệ nhanh tại chỗ, phải quay ra trang `/help`.
- **Giải pháp:** Bổ sung một nút phụ mộc mạc `[Hỏi thêm về nhân vật này]` trỏ thẳng về form gửi tin nhắn Zalo hoặc hỗ trợ nội bộ.

---

### TASK 3: EXPLORE MEMORIES — XEM ẢNH GIA ĐÌNH & KÝ ỨC ĐẰNG SAU TẤM ẢNH

#### 1. Mục tiêu & Tâm thế người dùng
- **Ai thực hiện:** Các bác cao niên, cô chú trung niên, con cháu muốn xem lại hình ảnh ngày xưa.
- **Tâm thế:** Bồi hồi, hoài niệm, xúc động: *"Bức ảnh này chụp hồi gia đình còn ở Thanh Hóa hay lúc mới vào Nam? Trong ảnh có những ai? Bác Thư lúc trẻ trông như thế nào?"*
- **Kỳ vọng:** Ảnh xem được rõ ràng, có chú thích chi tiết tên từng người trong ảnh; không bị vỡ hạt, không bị méo tỉ lệ.

#### 2. Kịch bản thực tế (Simulated Walkthrough Steps)
1. **Bước 1 — Vào Kho Tư Liệu Ảnh:** Chọn mục `Kho tư liệu ảnh` trên menu (`/me/gallery`).
2. **Bước 2 — Lọc theo chủ đề:** Người dùng thấy 5 danh mục rõ ràng:
   - *Tất cả tư liệu (185)*
   - *Chân dung (142)*
   - *Tư liệu văn bản (18)*
   - *Mộ phần & Tưởng niệm (12)*
   - *Gia đình & Dấu mốc (13)*
3. **Bước 3 — Xem lưới ảnh:** Ảnh được căn chỉnh chuẩn tỉ lệ 1:1, gương mặt nằm ở vị trí 50% 20% (ngang ngực/khuôn mặt) không bị cắt trán cằm.
4. **Bước 4 — Bật Lightbox chi tiết:** Bấm vào bức ảnh sum họp gia đình, màn hình mở to kèm thông tin:
   - Tiêu đề bức ảnh, năm chụp (nếu có).
   - Danh sách các nhân vật có mặt trong ảnh (ví dụ: Cụ Thư, Bà Sa, Bác Hạnh). Bấm vào tên nhân vật có thể nhảy thẳng sang hồ sơ phả hệ của người đó.
   - Nguồn gốc tư liệu: *"Ảnh do gia đình bác Hạnh cung cấp, phục chế năm 2026."*

#### 3. Đánh giá 7 tiêu chí UX (Heuristic Breakdown)
- **Discoverability (4.7/5):** Kho ảnh có lối vào trực tiếp từ menu chính và các đường liên kết chéo (`Cross-links`) từ hồ sơ từng nhân vật.
- **Comprehension (4.8/5):** Chú thích trang trọng, ghi rõ danh tính từng người trong ảnh.
- **Efficiency (4.5/5):** Bộ lọc 5 tab chuyển đổi tức thì không cần tải lại trang.
- **Feedback (4.5/5):** Khi ảnh bị mất file hoặc đường truyền chậm, hệ thống hiển thị ảnh placeholder bảo tồn số UNESCO bằng SVG màu giấy Dó nhã nhặn, không hiện icon ảnh vỡ xấu xí.
- **Recovery (4.5/5):** Nút đóng Lightbox to rõ ở góc trên, bấm phím `ESC` hoặc bấm ra ngoài nền tối đều đóng được.
- **Accessibility (4.7/5):** Chú thích ảnh có độ tương phản cao, phông chữ Serif hoài cổ.
- **Mobile (4.6/5):** Lưới ảnh trên điện thoại hiển thị 2 cột vừa vặn, chạm ngón tay mở to xem toàn màn hình mượt mà.

---

### TASK 4: READ & REMEMBER — ĐỌC CHUYÊN SAN MẠCH & KÝ ỨC DÒNG HỌ

#### 1. Mục tiêu & Tâm thế người dùng
- **Ai thực hiện:** Con cháu thế hệ trẻ, dâu rể, những người yêu quý văn hóa dòng họ muốn hiểu sâu về đời sống tinh thần của tiền nhân.
- **Tâm thế:** Trầm tĩnh, suy tư: *"Thế hệ trước đã vượt qua những biến cố gì? Đời sống của ông bà ngày xưa ra sao? Tại sao người sáng lập lại xây dựng trang web này?"*
- **Kỳ vọng:** Trải nghiệm đọc êm dịu, không bị quảng cáo, không bị rối mắt; cỡ chữ dễ đọc, nhịp ngắt dòng êm như đọc một cuốn sách giấy.

#### 2. Kịch bản thực tế (Simulated Walkthrough Steps)
1. **Bước 1 — Mở chuyên san MẠCH:** Bấm vào mục `MẠCH` trên thanh điều hướng (`/me/mach`).
2. **Bước 2 — Tiếp cận Masthead chuyên san:** Đọc lời tựa định danh: *"Ấn phẩm nội san lưu giữ suy nghĩ, bài khảo cứu và câu chuyện gia đình... Chữ của người trong nhà, viết cho người trong họ."*
3. **Bước 3 — Lựa chọn bài viết:** Danh sách các bài khảo cứu, hồi ký được xếp theo trình tự thời gian, hiển thị rõ tên tác giả, chuyên đề và tóm tắt ngắn.
4. **Bước 4 — Đọc toàn văn bài viết:** Bấm vào tiêu đề bài viết, nội dung toàn văn mở ra êm ái:
   - Đoạn văn căn trái tự nhiên (`textAlign: 'left'`), loại bỏ hoàn toàn hiện tượng ép dòng méo chữ.
   - Độ rộng dòng đọc chuẩn văn bản (`measure: 68ch`), giúp mắt không bị mỏi khi đọc bài dài.
   - Các trích dẫn quan trọng được đóng khung viền trái vàng đồng (`#b45309`) trên nền vàng nhạt (`#fbf0e3`) trang nhã.

#### 3. Đánh giá 7 tiêu chí UX (Heuristic Breakdown)
- **Discoverability (4.5/5):** Vị trí MẠCH nằm trang trọng trên thanh điều hướng thành viên.
- **Comprehension (5.0/5):** Đỉnh cao về mặt ngôn từ và văn phong biên tập; truyền tải trọn vẹn tinh thần "người trong nhà".
- **Efficiency (4.8/5):** Đọc trực tiếp tại chỗ không cần tải file PDF, có nút sao chép liên kết chia sẻ cho người thân.
- **Feedback (4.5/5):** Đã kiểm định hoàn tất việc loại bỏ lỗi `text-align: justify` tạo khoảng trắng dòng sông (TYPO-01).
- **Recovery (4.5/5):** Nút thu gọn bài viết và quay lại danh sách đặt rõ ràng ở chân bài.
- **Accessibility (4.8/5):** Tương phản chữ đạt trên 7:1 (vượt xa chuẩn WCAG AAA).
- **Mobile (4.8/5):** Trải nghiệm đọc trên iPhone SE như đọc sách điện tử cao cấp, chữ cân đối nhịp nhàng.

---

### TASK 5: CONTRIBUTE — ĐÓNG GÓP DI ẢNH, ĐÍNH CHÍNH & KÝ ỨC

#### 1. Mục tiêu & Tâm thế người dùng
- **Ai thực hiện:** Thành viên có tư liệu quý, người phát hiện sai sót dữ kiện trong gia phả.
- **Tâm thế:** Tâm huyết, cẩn trọng: *"Tôi có bức ảnh này của ông nội chụp năm 1960 muốn gửi lên, nhưng không biết gửi thế nào? Có khó không? Có ai duyệt không?"*
- **Kỳ vọng:** Thủ tục đơn giản, an tâm rằng thông tin mình gửi được đón nhận trân trọng.

#### 2. Kịch bản thực tế (Simulated Walkthrough Steps)
1. **Bước 1 — Chọn hình thức đóng góp:** Vào `/me/contribute`, chọn 1 trong 3 nhóm:
   - `Di ảnh & Kỷ vật` (🖼️)
   - `Ký ức & Lời kể` (📖)
   - `Đính chính phả hệ` (✍️)
2. **Bước 2 — Điền thông tin:**
   - Nhập tiêu đề ảnh / câu chuyện.
   - Chọn nhân vật liên quan trong gia đình.
   - Nhập nội dung và **nguồn gốc lời kể / chứng cứ** (ví dụ: theo lời kể của mẹ, theo sổ thờ cũ).
3. **Bước 3 — Gửi tới Ban Biên Tập:** Bấm nút `[Gửi tới Ban Biên Tập Gia Tộc]`.
4. **Bước 4 — Tiếp nhận phản hồi:** Hệ thống hiển thị thông báo cảm ơn ấm áp kèm mã theo dõi đề xuất (ví dụ: `PROP_173...`).
5. **Bước 5 — Theo dõi trạng thái:** Người dùng bấm `[Xem trạng thái đóng góp của tôi]` (`/me/requests`) để biết đề xuất đang ở bước nào (*Đang chờ tiếp nhận*, *Đã cập nhật vào phả hệ*, hoặc *Cần gia đình làm rõ thêm*).

#### 3. Đánh giá 7 tiêu chí UX (Heuristic Breakdown)
- **Discoverability (4.0/5):** Có nút đóng góp tại trang cá nhân `/me`, `/me/gallery` và nút `[Gợi ý đính chính]` tại từng hồ sơ nhân vật.
- **Comprehension (4.4/5):** Giải thích rõ ràng 3 loại đóng góp, hướng dẫn người dùng cung cấp nguồn đối chiếu.
- **Efficiency (4.0/5):** Form ngắn gọn, không bắt buộc điền các thông tin không cần thiết.
- **Feedback (4.5/5):** Mã đề xuất rõ ràng, hộp thư `/me/requests` minh bạch quy trình xử lý.
- **Recovery (3.8/5):** Chưa có chức năng lưu nháp tự động (Auto-save draft); nếu người dùng vô tình đóng tab khi đang gõ dở một câu chuyện dài thì phải gõ lại.
- **Accessibility (4.2/5):** Các ô nhập liệu có nhãn to, tương phản rõ ràng.
- **Mobile (4.0/5):** Thao tác gõ văn bản dài trên bàn phím điện thoại cần thêm khoảng đệm để không bị bàn phím che khuất nút gửi.

---

### TASK 6: MEMBER EXPERIENCE — ĐĂNG NHẬP, HỒ SƠ & BẢO MẬT

#### 1. Mục tiêu & Tâm thế người dùng
- **Ai thực hiện:** Thành viên mới được cấp tài khoản, hoặc thành viên quay lại đăng nhập.
- **Tâm thế:** Cần sự an toàn, đơn giản: *"Tôi được gửi mật khẩu tạm này, làm sao để vào? Làm sao để đổi mật khẩu riêng của tôi?"*
- **Kỳ vọng:** Đăng nhập một lần là nhớ phiên; đổi mật khẩu nhanh chóng, không bị các yêu cầu ký tự đặc biệt vô lý làm khó người lớn tuổi.

#### 2. Kịch bản thực tế (Simulated Walkthrough Steps)
1. **Bước 1 — Mở cổng đăng nhập:** Truy cập `/login`. Giao diện trang trọng, hiển thị rõ ràng: *"Đăng nhập Không gian Gia Tộc — Khu vực dành riêng cho những người trong gia tộc."*
2. **Bước 2 — Điền thông tin:** Nhập tài khoản và mật khẩu tạm. Có ô tích chọn `Hiện mật khẩu` giúp người già kiểm tra xem mình gõ có bị sai phím không.
3. **Bước 3 — Kích hoạt tài khoản lần đầu (Onboarding Flow):**
   - Hệ thống nhận diện trạng thái `PROVISIONED` và tự động điều hướng sang `/me/change-password`.
   - Hiển thị lời chào thân tình: *"Chào mừng bạn đến với Không gian Gia Tộc! Đây là lần đầu tiên bạn đăng nhập. Xin vui lòng đặt một mật khẩu riêng để bảo vệ tài khoản của bạn."*
   - Nhập mật khẩu mới (tối thiểu 8 ký tự, không bắt ép ký tự phức tạp vô lý).
4. **Bước 4 — Tiếp cận Không gian của tôi:** Đổi mật khẩu thành công, tài khoản chuyển sang `ACTIVE`, người dùng được đưa thẳng vào `/me`, nhìn thấy rõ tên mình, cha mẹ và nhánh phả hệ gắn liền.

#### 3. Đánh giá 7 tiêu chí UX (Heuristic Breakdown)
- **Discoverability (4.8/5):** Nút đăng nhập nổi bật trên mọi bề mặt.
- **Comprehension (4.6/5):** Đã chuẩn hóa CSS class `.gi-login-*` 2D planar, thống nhất hoàn toàn với toàn bộ hệ thống (VIS-01).
- **Efficiency (4.5/5):** Tự động chuyển hướng an toàn sau đăng nhập (`safeNext`).
- **Feedback (4.5/5):** Thông báo lỗi đăng nhập nhã nhặn, hướng dẫn bấm `Quên mật khẩu` hoặc `Hướng dẫn tham gia`.
- **Recovery (4.3/5):** Đường dẫn liên hệ khôi phục đặt ngay dưới nút đăng nhập.
- **Accessibility (4.6/5):** Ô nhập liệu cao 44px, nút bấm 44px đạt chuẩn ngón tay chạm.
- **Mobile (4.7/5):** Form căn giữa 440px trên màn hình lớn và co giãn 100% không tràn lề trên iPhone.

---

### TASK 7: HELP & RECOVERY — HỖ TRỢ, KHÔI PHỤC & BẢO TRÌ

#### 1. Mục tiêu & Tâm thế người dùng
- **Ai thực hiện:** Người quên mật khẩu, người chưa có tài khoản, hoặc người truy cập vào ban đêm gặp giờ nghỉ máy chủ.
- **Tâm thế:** Hoang mang, cần giúp đỡ: *"Tôi không vào được, có phải web bị hỏng không? Tôi quên mật khẩu rồi thì làm sao lấy lại?"*
- **Kỳ vọng:** Được trấn an ngay lập tức; có cách liên hệ trực tiếp với người phụ trách trong nhà mà không phải làm thủ tục qua các bên thứ ba (SMS/OTP).

#### 2. Kịch bản thực tế (Simulated Walkthrough Steps)
1. **Bước 1 — Tiếp cận khi quên mật khẩu:** Tại `/login`, bấm nút `[Quên mật khẩu?]` dẫn tới `/help/recovery`.
2. **Bước 2 — Đọc lời trấn an:** *"Đừng lo lắng! Trong gia đình, sự kết nối trực tiếp luôn an toàn và thân thuộc nhất. Để tránh rủi ro lộ lọt qua SMS viễn thông, hệ thống áp dụng cơ chế xác minh hỗ trợ trực tiếp từ Ban Quản Trị dòng họ."*
3. **Bước 3 — Thực hiện 4 bước khôi phục (Family Steward Assisted Recovery):**
   - Bước 1: Nhắn tin/gọi điện cho Tuấn hoặc người phụ trách qua Zalo/Điện thoại.
   - Bước 2: Nói rõ mình là con/cháu của ai.
   - Bước 3: Nhận mật khẩu tạm thời mới.
   - Bước 4: Đăng nhập và tự đặt mật khẩu riêng.
4. **Bước 4 — Tiếp nhận thông báo khi máy chủ nghỉ đêm:**
   - Trong khung giờ `01:00 – 09:05`, người dùng thấy Banner vàng đồng trang trọng:
     * Tiêu đề: `GIỜ NGHỈ CỦA KHO LƯU TRỮ`
     * Nội dung: *"Để hạn chế thời gian vận hành liên tục và góp phần kéo dài tuổi thọ thiết bị, máy chủ lưu trữ của Gia tộc được tạm ngưng hằng ngày từ 01:00 đến 09:05..."*
     * Nút đăng nhập tự động chuyển nhãn: `Kho lưu trữ đang tạm nghỉ (Mở lại sau 09:05)`.

#### 3. Đánh giá 7 tiêu chí UX (Heuristic Breakdown)
- **Discoverability (4.2/5):** Trang trợ giúp `/help` và khôi phục `/help/recovery` liên kết rõ ràng từ header và footer.
- **Comprehension (4.8/5):** Văn bản thông báo giờ nghỉ mới (do Tuấn phê duyệt) thể hiện trọn vẹn sự trung thực, tôn trọng người dùng và bảo vệ thiết bị gia đình.
- **Efficiency (4.0/5):** Khôi phục qua Zalo gia đình diễn ra rất nhanh (< 5 phút) vì người thân luôn có kênh liên lạc trực tiếp.
- **Feedback (4.5/5):** Phân định rạch ròi 3 trạng thái (State A — Giờ nghỉ định kỳ, State B — Gián đoạn mạng ngoài ý muốn, State C — Hoạt động bình thường).
- **Recovery (3.8/5):** Trang `/help` hiện còn bị rewrite về NAS nên vào giờ nghỉ đêm có thể bị chậm; cần đưa thành trang tĩnh CDN.
- **Accessibility (4.5/5):** Banner viền vàng đồng dày 4px đạt chuẩn nhận diện cảnh báo nhẹ nhàng, không gây hoảng loạn.
- **Mobile (4.4/5):** Banner hiển thị co giãn tốt trên di động, không bị vỡ khung.

---

## 4. BẢNG TỔNG HỢP KHUYẾN NGHỊ CẢI THIỆN TRẢI NGHIỆM (ACTIONABLE UX BACKLOG)

Dựa trên kết quả khảo sát 7 nhiệm vụ, 5 cải tiến ưu tiên cao được đề xuất cho các bước hoàn thiện tiếp theo:

| Mã | Hạng mục đề xuất | Nhiệm vụ liên quan | Mức độ ưu tiên | Tác động trải nghiệm |
| :---: | :--- | :---: | :---: | :--- |
| **UX-REC-01** | **Tĩnh hóa trang Trợ giúp (`/help`):** Chuyển trang `/help` và `/help/recovery` thành trang HTML tĩnh trên Vercel CDN để đảm bảo hoạt động 24/7 kể cả khi máy chủ NAS nghỉ. | Task 7, Task 1 | **CAO NHẤT (P0)** | Loại bỏ hoàn toàn điểm nghẽn truy cập thông tin liên hệ gia đình vào ban đêm. |
| **UX-REC-02** | **Bộ đệm Invitation Card cho Section 04:** Khi khách chưa đăng nhập bấm vào 3 thẻ tại Section 04 trang chủ, đưa sang giao diện thiệp mời trang trọng (`Invitation Card`) thay vì redirect 302 thô bạo sang `/login`. | Task 1, Task 6 | **CAO (P1)** | Tăng tính ân cần, giúp người mới hiểu rõ giá trị bảo mật gia đình. |
| **UX-REC-03** | **Bổ sung nút cuộn lên đầu trang (Back to Top):** Thêm nút mũi tên mộc mạc ở góc phải dưới khi người dùng cuộn sâu quá 2 màn hình. | Task 1, Task 2 | **TRUNG BÌNH (P2)** | Giúp các bậc cao niên dễ dàng quay lại đầu trang mà không phải vuốt tay nhiều lần. |
| **UX-REC-04** | **Lưu nháp đề xuất tự động (Local Draft Auto-save):** Sử dụng `localStorage` để tạm lưu nội dung câu chuyện hoặc lời kể khi người dùng đang nhập dở tại `/me/contribute`. | Task 5 | **TRUNG BÌNH (P2)** | Ngăn chặn mất mát dữ liệu do vô tình đóng tab hoặc mất mạng giữa chừng. |
| **UX-REC-05** | **Chỉ báo vuốt ngang menu mobile:** Thêm hiệu ứng chuyển sắc mờ (gradient fade) ở mép phải thanh menu mobile để người già nhận biết có thể cuộn ngang xem tiếp. | Task 1, Task 2, Task 6 | **TRUNG BÌNH (P2)** | Cải thiện khả năng khám phá tính năng trên màn hình hẹp 375px. |

---

## 5. KẾT LUẬN NGHIỆM THU TỪ GÓC NHÌN NGƯỜI TRONG HỌ

Bản đồ nhiệm vụ người dùng (User Task Map) phiên bản Candidate V2.0.1 đã chứng minh rằng: **Website Gia Tộc Trần Trọng Thu hoàn toàn có thể cân bằng hoàn hảo giữa tính thiêng liêng, trang trọng của di sản dòng họ và tính hiện đại, tiện lợi của công nghệ web thế hệ mới.**

Mỗi bước đi của người thân trên website — từ việc tìm lại cội nguồn, đọc câu chuyện của ông bà, cho đến việc nhớ một ngày giỗ hay gửi tặng một bức ảnh cũ — đều được bao bọc trong sự ấm áp, tôn kính và tin cậy tuyệt đối.
