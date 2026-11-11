# PUBLIC HOME SOURCE CONTENT TRACE v0.1

**Mục tiêu:** Truy nguyên toàn bộ codebase để tìm kiếm nội dung giới thiệu, lịch sử, cội nguồn của Gia Tộc Trần Trọng Thu, phục vụ cho câu hỏi: *"Gia tộc này là ai?"* trên Public Home.

---

## 1. CÁC PHÁT HIỆN (FINDINGS)

### FINDING 1: Đoạn giới thiệu "Về dòng họ" (Legacy Frontend)
- **File:** `archive/legacy_frontend/index.html`
- **Vị trí/Heading:** `<!-- 16. VỀ DÒNG HỌ (HERITAGE OVERVIEW) -->`
- **Đoạn nội dung:** 
  > *"Gia tộc Trần Trọng Thu không bắt đầu từ một kho tàng lớn. Nó bắt đầu từ những cái tên, những mối quan hệ, những câu chuyện được nhớ lại, những bức ảnh cũ, những giấy tờ còn sót và những điều có nguy cơ biến mất nếu hôm nay không được ghi lại. Cội nguồn dòng họ gắn liền với Thọ Vực, Bình Châu, Bình Triệu và hành trình tới Sài Gòn. Mỗi thế hệ F0–F4 đều mang trong mình những ký ức và bài học đời sống được trao truyền qua từng nếp nhà."*
- **Tình trạng authority:** `FOUND — draft / chưa xác định authority`. Nằm trong bản prototype cũ, chưa được xác nhận thành Brand Narrative chính thức.
- **Dùng cho Public Home?:** **CÓ THỂ**. Đây là đoạn văn duy nhất mang tính chất kể chuyện lịch sử/cội nguồn thực sự (chứa địa danh và hành trình), rất phù hợp để làm Institutional Statement.

### FINDING 2: Cột mốc khởi nguồn (Legacy UI Logic)
- **File:** `archive/temp_outputs/tmp_renderHome_old.txt`
- **Vị trí:** Logic fallback cho Hero Anchor (dòng 1946).
- **Đoạn nội dung:**
  > *"Bắt đầu từ cụ Giuse Trần Trọng Thu (1872–1969) tại Thanh Hóa, trải qua hơn 150 năm với 5 thế hệ tiếp nối."*
- **Tình trạng authority:** `FOUND — UI copy / historical note`.
- **Dùng cho Public Home?:** **CÓ THỂ**. Cung cấp factual evidence (1872, Thanh Hóa, 150 năm, 5 thế hệ) cực kỳ chắc chắn để đưa vào phần giới thiệu.

### FINDING 3: Cấu trúc Gia phả (GEDCOM / JSON)
- **File:** `GIADINHONGTHU.ged` và `server/data/genealogy.json`
- **Vị trí:** Khai báo cá nhân (Person data).
- **Đoạn nội dung:** Ghi nhận `Giuse Trần Trọng Thu` sinh năm 1872, mất 1969 tại Thanh Hóa, Việt Nam. Lời tựa: *"Trích lục Gia phả nhà ông Trần Trọng Thu"*.
- **Tình trạng authority:** `FOUND — authoritative`.
- **Dùng cho Public Home?:** **KHÔNG TRỰC TIẾP**. Đây là raw data, chỉ dùng để đối chiếu tính chính xác của các đoạn text (Finding 2).

### FINDING 4: Tự sự nội bộ (MẠCH/Clara)
- **File:** `server/data/mach.json`
- **Vị trí:** Bài viết `art_clara_003` ("Thư gửi Clara — Số 03: Cảm Thức Cộng Đồng").
- **Đoạn nội dung:** Các trăn trở sâu sắc về tính kế thừa, vai trò "đích tôn", sự chuyển dịch khỏi mô hình phong kiến sang hiện đại...
- **Tình trạng authority:** `FOUND — historical note / internal reflection`.
- **Dùng cho Public Home?:** **TUYỆT ĐỐI KHÔNG**. Đây là không gian riêng tư (Intimate), hướng tới "con" và người trong nhà. Sẽ gây rò rỉ (leak) MẠCH nếu đưa ra Public.

### FINDING 5: Giải thích hệ thống (Brand Narrative)
- **File:** `brand/02_BRAND_NARRATIVE.md`
- **Vị trí:** Heading `- Về Gia Tộc:`
- **Đoạn nội dung:** 
  > *"Đây là không gian chính thức của gia tộc trên mạng: nơi những điều thuộc về gia tộc được ghi lại và giữ theo thời gian. Bên trong là những khoảng không gian dành riêng cho người trong nhà..."*
- **Tình trạng authority:** `FOUND — authoritative`.
- **Dùng cho Public Home?:** **CÓ THỂ**. Tuy nhiên, đoạn này chỉ giải thích **hệ thống/website**, chứ KHÔNG trả lời câu hỏi "Gia tộc này là ai?".

---

## 2. KẾT LUẬN CUỐI CÙNG

**[ B. CÓ SOURCE NHƯNG CẦN XÁC ĐỊNH AUTHORITY / BIÊN TẬP TRƯỚC KHI PUBLIC ]**

**Phân tích rủi ro & Đề xuất cho Tuấn/Emarald:**
Chúng ta **KHÔNG** rơi vào tình trạng "Không có gì để nói". Thực tế, trong kho di chỉ (legacy files) đã có sẵn một đoạn giới thiệu rất giá trị đề cập đến *Thọ Vực, Bình Châu, Bình Triệu, hành trình vào Sài Gòn*, cùng với các mốc thời gian *1872–1969, Thanh Hóa*. 

Vấn đề duy nhất là những nội dung này đang nằm ở dạng Draft của một bản Prototype cũ, chưa từng được Tuấn chính thức "đóng dấu" trở thành Brand Constitution/Narrative để Agy/Cline có quyền đưa thẳng lên Public Home mới.

**Yêu cầu Quyết định (Human Action Required):**
Tuấn có đồng ý cấp phép (authorize) cho việc biên tập, kết hợp **Finding 1** và **Finding 2** thành một đoạn Institutional Statement chính thức để lấp vào khoảng trống Content Gap trên Public Home không?
