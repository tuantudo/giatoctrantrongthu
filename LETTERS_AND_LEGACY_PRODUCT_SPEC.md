# ĐẶC TẢ SẢN PHẨM: THƯ GỬI NHAU (LETTERS & LEGACY)
## First-Class Content Domain — Gia Tộc Trần Trọng Thu

**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Kiến trúc & QC:** Emarald (Strategic Architecture Authority)  
**Phụ trách:** AGENT 01 (Product & Journey Design Specialist)  
**Ngày ban hành:** 2026-11-11  
**Trạng thái:** `CANONICAL SPECIFICATION — FIRST-CLASS HERITAGE DOMAIN`

---

## 1. Ý NGHĨA SẢN PHẨM & TẦM NHÌN DI SẢN (PHILOSOPHY & VISION)

Trong đời sống của một dòng tộc, di sản không chỉ kết tinh ở những niên biểu năm sinh năm mất hay những dòng danh xưng khô khan trên gia phả. Di sản sâu sắc và trường tồn nhất nằm ở **tâm tư, tình cảm, lời dặn dò, sự tha thứ, niềm hy vọng và ký ức chân thật** mà các thế hệ gửi gắm cho nhau.

**"Thư gửi Clara"** là minh chứng khởi đầu cho thể loại này — một di sản tình cảm xúc động giữa ông bà Hạnh – Đào và người con gái. Định hướng mới của Tuấn nâng tầm thể loại này thành một **Phân hệ Di sản Đệ nhất (First-Class Content Domain)** với tên gọi chính thức:

> **THƯ GỬI NHAU — LETTERS & LEGACY**  
> *"Nơi lưu giữ những bức thư, lời nhắn nhủ và di sản tinh thần truyền trao giữa các thế hệ con cháu họ Trần."*

### Phân định bản chất cốt lõi:
- ❌ **Không phải ứng dụng chat / tin nhắn tức thời:** Không có "đang soạn tin...", không có "đã xem", không có thông báo rung bíp bíp hối hả.
- ❌ **Không phải mạng xã hội:** Không có nút "Like", không có thả tim, không có bình luận công khai tranh cãi.
- ✅ **Là Thư Tín Di Sản (Epistolary Heritage):** Trang trọng, sâu lắng, có độ lùi thời gian, được viết với sự suy ngẫm chín chắn và được lưu giữ như những kỷ vật số gia đình qua hàng chục, hàng trăm năm.

---

## 2. NĂM LOẠI HÌNH ĐỐI TƯỢNG TIẾP NHẬN (RECIPIENT SCOPES)

Mỗi bức thư trong thể loại "Thư Gửi Nhau" có một mục đích và đối tượng tiếp nhận xác định:

1. **Thư Gửi Cá Nhân (Personal Letter):**
   - Tác giả gửi đích danh cho một thành viên khác trong gia tộc (ví dụ: Cha gửi cho Con, Anh gửi cho Em, Cháu gửi cho Ông Bà).
   - Quyền đọc: Chỉ Tác giả và Người nhận.
2. **Thư Gửi Nhánh Gia Đình (Branch Letter):**
   - Tác giả gửi cho các thành viên thuộc một nhánh phả hệ cụ thể (ví dụ: Thư dành riêng cho con cháu nhánh cụ Hạnh – Đào; Thư gửi chi họ Trần Trọng...).
   - Quyền đọc: Các thành viên được xác minh thuộc nhánh phả hệ đó.
3. **Thư Gửi Toàn Gia Tộc (Family-Wide Letter):**
   - Tác giả gửi gắm tâm tình, lời chúc, thông điệp chung cho toàn thể bà con cô bác dâu rể trong họ Trần.
   - Quyền đọc: Mọi thành viên đã đăng nhập và kích hoạt tài khoản gia tộc.
4. **Thư Gửi Thế Hệ Tương Lai (Letters to Future Generations / Time Capsule):**
   - Lời dặn dò, ký ức của tiền nhân dành cho con cháu 10 năm, 20 năm, hoặc 50 năm sau; hoặc mở vào các mốc kỷ niệm đặc biệt (ví dụ: 100 năm ngày mất của Cố Thu).
   - Quyền đọc: Khóa kín cho đến khi đạt mốc thời gian hoặc được Người trông nom gia tộc (Family Steward) kích hoạt công bố.
5. **Thư Tưởng Niệm & Tri Ân Người Đã Khuất (Memorial Letters):**
   - Lời tâm sự, hoài niệm của con cháu gửi tới ông bà, cha mẹ đã qua đời như một hình thức cầu nguyện, tri ân và tự soi chiếu bản thân.
   - Quyền đọc: Do tác giả quyết định (giữ riêng tư hoặc chia sẻ cùng gia đình).

---

## 3. BẢY HÀNH TRÌNH TRẢI NGHIỆM CHI TIẾT (USER JOURNEYS)

### Hành trình 1: Khám phá Không gian Thư Gửi Nhau
- **Điểm vào:** Thanh menu thành viên `[Thư Gửi Nhau]` (`/me/letters`) hoặc thẻ giới thiệu tại `/me`.
- **Màn hình:**
  * Hộp Thư Đã Nhận (`/me/letters/inbox`): Những lá thư gửi riêng cho mình, cho nhánh mình, hoặc cho gia tộc.
  * Hộp Thư Đã Gửi (`/me/letters/sent`): Những lá thư mình đã viết và lưu giữ.
  * Kỷ Vật Clara (`/me/clara`): Vẫn được bảo vệ an toàn theo ranh giới `BRANCH_RESTRICTED_P0` dành riêng cho con cháu cụ Hạnh – Đào.

### Hành trình 2: Soạn một Lá Thư Mới
- **Điểm vào:** Nút `[✍️ Viết thư mới]` tại `/me/letters`.
- **Giao diện:** Tối giản, trang nhã, kiểu chữ Noto Serif / Playfair Display trang trọng, tạo cảm giác như đang viết trên trang giấy thư tay.
- **Các bước:**
  1. *Chọn phạm vi tiếp nhận:* Cá nhân người thân (chọn từ cây gia phả) / Nhánh gia đình / Toàn gia tộc / Thế hệ mai sau.
  2. *Gắn kết người được nhắc đến (`Mentioned Persons`):* Chọn những người thân được nhắc tên trong nội dung để sau này có thể tìm thấy trong hồ sơ nhân vật của họ.
  3. *Nhập Tiêu đề & Nội dung bức thư:* Hỗ trợ trình bày đoạn văn mạch lạc, thêm ảnh kỷ vật đính kèm nếu có.
  4. *Xác lập Ý định Lưu truyền (`Legacy Intent`):* Có cho phép lưu trữ vĩnh viễn trong kho tàng gia tộc hay chỉ người nhận được đọc?
  5. *Xem trước (Preview):* Đọc lại như một bức thư giấy hoàn chỉnh trước khi lưu.
  6. *Gửi & Lưu trữ:* Thư được lưu vào kho tàng số với mã định danh duy nhất (ví dụ: `LTR_2026_...`).

### Hành trình 3: Đọc Thư Được Nhận
- **Điểm vào:** Danh sách thư nhận tại `/me/letters`.
- **Trải nghiệm đọc:** Mở ra phong thư trang trọng, hiển thị rõ:
  * Tác giả: Tên người gửi kèm quan hệ huyết thống với người đọc (ví dụ: *"Bác Trần Trọng Hùng (Bác ruột) gửi cho Trần Quang Tuấn"*).
  * Thời gian viết và địa danh (nếu có).
  * Lời tựa và toàn văn bức thư.
  * Lựa chọn: `[Lưu vào kỷ vật gia đình]`, `[Viết thư hồi đáp]`.

### Hành trình 4: Quyền Tiếp Cận Của Người Được Nhắc Đến (Mentioned Person)
- Khi một lá thư nhắc đến một người thân trong họ (ví dụ: bức thư của người cha kể về thời thơ ấu của người con):
  - Người được nhắc đến có quyền xem đoạn trích hoặc bức thư đó (nếu tác giả cho phép chế độ `MENTIONED_ACCESS`).
  - Lá thư được xuất hiện trong Tab "Thư từ & Ký ức liên quan" tại Hồ sơ 6 tầng của người đó (`/me/tree/person/:id`).

---

## 4. BẢO TỒN RANH GIỚI TƯ LIỆU CLARA (CLARA INVARIANT)
- **8 lá thư Clara hiện hữu** là minh chứng tiêu biểu đầu tiên cho thể loại này.
- **Nguyên tắc bất biến:** Tư liệu Clara giữ nguyên vẹn chính sách `BRANCH_RESTRICTED_P0`. Không tự động chuyển thành thư chung, không nới lỏng quyền đọc cho người ngoài nhánh.
- Trong kiến trúc mới, Clara được xem là một Bộ Sưu Tập Thư Đặc Biệt (`Special Letter Collection`) với cờ bảo mật cao nhất, quản lý độc lập.

