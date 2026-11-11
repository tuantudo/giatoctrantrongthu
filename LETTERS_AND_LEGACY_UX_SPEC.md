# ĐẶC TẢ GIAO DIỆN & TRẢI NGHIỆM: THƯ GỬI NHAU
## LETTERS & LEGACY UX/UI SPECIFICATION

**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Kiến trúc & QC:** Emarald (Strategic Architecture Authority)  
**Phụ trách:** AGENT 02 (UX/UI & Interaction Design Specialist)  
**Ngày ban hành:** 2026-11-11  

---

## 1. TRIẾT LÝ THIẾT KẾ THƯ TÍN DI SẢN (EPISTOLARY DESIGN GRAMMAR)

1. **Trang trọng, Trầm mặc, Nhân bản:**
   - Sử dụng bảng màu di sản kế thừa `foundation.css` v0.2: Màu đỏ thẫm truyền thống (`--color-brand-heritage: #8b261e`), nền giấy hơi ngà ấm (`--color-surface-sunken: #fafaf9`), chữ đen xám tự nhiên (`--color-text-primary: #1c1917`).
   - Phông chữ tiêu đề và thân bài: `Noto Serif` / `Playfair Display`, tạo cảm giác như đọc một trang thư viết tay gửi từ những năm tháng xa xưa.
   - Không viền bo tròn bo góc đồ chơi (`border-radius: 0` hoặc tối đa `2px`), không đổ bóng hào nhoáng (`box-shadow: none`), không hiệu ứng mạng xã hội.
2. **Không khí của một Lá thư:**
   - Mỗi lá thư được hiển thị như một phong thư trang nhã: có con dấu dòng họ, có ngày tháng năm âm – dương lịch, có lời mở đầu tôn kính và chữ ký người gửi.
3. **Thân thiện trên Thiết bị Di động (Mobile-First):**
   - Khoảng cách đọc thoáng đãng, độ cao dòng 1.7–1.8, cỡ chữ tối thiểu 16px trên điện thoại giúp người lớn tuổi đọc thư không mỏi mắt.

---

## 2. BỐ CỤC CÁC MÀN HÌNH CHÍNH (KEY SCREENS & VIEWS)

### 2.1. Không gian Hộp Thư Di Sản (`/me/letters`)
- **Header:** "Thư Gửi Nhau · Letters & Legacy"  
  *Lời tựa: "Nơi lưu giữ những lời nhắn nhủ, tâm tư và di sản tinh thần giữa các thế hệ con cháu họ Trần."*
- **Thanh chuyển đổi chế độ xem (Segmented View):**
  * `[Thư nhận được]` (Mặc định): Danh sách thư gửi riêng cho tôi, cho chi nhánh tôi, hoặc cho toàn gia tộc.
  * `[Thư đã gửi]`: Những bức thư do chính tôi soạn thảo và gửi gắm.
  * `[Thư gửi Clara]`: Lối vào bộ sưu tập thư của gia đình cụ Hạnh – Đào (chỉ hiển thị nếu thỏa mãn điều kiện `isClaraEligible`).
- **Nút hành động chính:** `[✍️ Soạn thư mới]` (Nổi bật, trang nhã).
- **Thẻ lá thư (Letter Card):**
  * Con dấu nhận diện: `✉️ Thư riêng`, `🏛️ Thư chi nhánh`, `📜 Thư toàn gia tộc`, `⏳ Thư gửi tương lai`.
  * Tiêu đề lá thư: Kiểu chữ Serif lớn, trang trọng.
  * Thông tin tác giả & người nhận: Kèm quan hệ thân tộc cụ thể (ví dụ: *"Bác Trần Trọng Hùng (Bác ruột) gửi Trần Quang Tuấn"*).
  * Đoạn trích 2 dòng đầu tiên.
  * Nút `[Đọc thư →]`.

### 2.2. Soạn Thư Di Sản (`/me/letters/compose`)
- **Khung chọn người nhận (Recipient Selector):**
  * Nút chọn phạm vi: `Cá nhân người thân`, `Chi nhánh gia đình`, `Toàn gia tộc`, `Thế hệ tương lai`.
  * Nếu chọn Cá nhân: Ô tìm kiếm tên người thân trên cây phả hệ (liên kết canonical `person_id`).
- **Gắn kết người được nhắc đến (`Mentioned Persons`):**
  * Cho phép chọn 1 hoặc nhiều người thân có mặt trong câu chuyện để bức thư xuất hiện trong hồ sơ của họ.
- **Khung viết thư:**
  * Tiêu đề bức thư.
  * Lời mở đầu (ví dụ: *"Gửi con gái yêu quý của cha...", "Kính gửi bà con cô bác trong chi họ..."*).
  * Khung nội dung rộng rãi, phông chữ Serif, hỗ trợ ngắt đoạn mạch lạc.
- **Xác lập Ý định lưu truyền (`Legacy Intent`):**
  * Tùy chọn: *"Cho phép lưu vào kho tàng di sản dòng tộc để con cháu đời sau cùng đọc"* hoặc *"Chỉ người nhận và tôi được đọc"*.
- **Nút gửi:** `[Lưu vào Di Sản Gia Tộc]`.

### 2.3. Màn hình Đọc Thư (`/me/letters/view/:id`)
- **Khổ giấy thư cổ điển:**
  * Huy hiệu con dấu gia tộc ở góc trên bên phải.
  * Ngày tháng và địa danh mở đầu: *"Hải Phòng, ngày 15 tháng 10 năm..."*.
  * Lời mở đầu trang trọng.
  * Toàn văn bức thư được phân đoạn rõ ràng.
  * Chữ ký và danh xưng của tác giả ở cuối thư.
  * Ảnh đính kèm (nếu là thư scan tay hoặc có kỷ vật kèm theo).
- **Thanh công cụ chân thư:**
  * `[← Quay lại danh sách thư]`
  * `[In bức thư này ra giấy]`
  * `[Viết thư hồi đáp]` (nếu là thư gửi cá nhân).

