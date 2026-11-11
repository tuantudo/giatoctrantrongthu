# BÁO CÁO BÀN GIAO THỰC THI BATCH 2: ACTIVATE VIBECODE LAB
## CHUYỂN VIBECODE LAB THÀNH MÔI TRƯỜNG THIẾT KẾ VÀ PROTOTYPE CỤC BỘ
### (EXECUTION ORDER 02 — BATCH 2 COMPLETION DOSSIER)

- **Thẩm quyền phê duyệt tối cao:** Tuấn (Human Final Authority & Product Decision Maker)
- **Thẩm quyền phân tích kiến trúc:** Emarald (Analysis Authority)
- **Đơn vị điều phối thực thi:** AGY (Execution Coordinator & Primary Agent)
- **Tài nguyên hỗ trợ chuyên biệt:** Cline (Frontend Specialist)
- **Chế độ thực thi:** `CONTROLLED LOCAL IMPLEMENTATION (Vibecode Lab only)`
- **Trạng thái:** **`BATCH 2 HOÀN TẤT 100% — ĐÃ KÍCH HOẠT STUDIO THIẾT KẾ & PROTOTYPING CỤC BỘ`**

---

## 1. MỤC TIÊU VÀ KẾT QUẢ ĐẠT ĐƯỢC

Theo đúng chỉ đạo tại **EXECUTION ORDER 02**, AGY đã hoàn thành chuyển đổi **Vibecode Lab** từ một màn hình review thụ động thành **Môi trường Thiết kế & Prototyping Cục bộ (Local Design & Prototyping Studio)** hoàn chỉnh.

Môi trường này trao toàn bộ quyền năng cho Tuấn để:
1. **Xác lập cấu trúc nội dung:** Thử nghiệm câu chữ, tiêu đề, khẩu hiệu dòng họ, lời dẫn nhập trực tiếp trên trình duyệt.
2. **Điều chỉnh Information Architecture & Layout:** Trực tiếp đánh giá nhịp điệu không gian, phân cấp thị giác trên cả 7 bề mặt.
3. **Thử nghiệm tương tác (Interaction Prototyping):** Lọc tìm kiếm thời gian thực, chuyển đổi người trong phả hệ, mở form đề xuất chỉnh sửa thông tin mô phỏng, điều chỉnh cỡ chữ đọc sách.
4. **Kiểm tra Responsive đa thiết bị:** Trải nghiệm trên 4 kích thước thực tế (Mobile 375px, Tablet 768px, Laptop 1024px, Desktop 1440px) được đóng khung thiết bị trực quan.
5. **Mô phỏng các trạng thái biên (Edge Cases):** Kiểm tra tức thì giao diện khi Đang tải (Loading), Dữ liệu trống (Empty), Chưa đăng nhập (401), Bị chặn quyền (403), hoặc Lỗi hệ thống (500).

---

## 2. DANH SÁCH CÁC TỆP ĐÃ THAY ĐỔI (FILES CHANGED)

Chỉ tác động duy nhất vào phạm vi Vibecode Lab được cho phép; **tuyệt đối không chạm vào Production, Local Mirror, Backend hay Database**:

| Tệp tin | Loại thay đổi | Vai trò trong Batch 2 |
| :--- | :--- | :--- |
| `src/js/ui/lab.js` | Sửa đổi nâng cấp | Bộ điều khiển trung tâm Vibecode Lab Studio: Tích hợp Topbar điều khiển, Bộ chuyển khung hình Viewport (375/768/1024/1440/Fluid), Bộ chuyển 6 Persona, Bộ giả lập 6 State, Chế độ sửa nhanh Inline Edit, Bảng Inspector tra cứu nguồn, và Bộ thu phát tương tác mẫu. |
| `lab.html` | Cập nhật tiêu đề & meta | Chuẩn hóa tiêu đề thành *Studio Thiết Kế & Prototyping 7 Bề Mặt UI*, kích hoạt chế độ Mock toàn cục. |
| `shots/lab/*` | Tạo mới (12 ảnh) | Bằng chứng kiểm thử tự động Playwright chụp 7 bề mặt và 5 tính năng studio mới. |
| `AUDIT/BATCH_02_VIBECODE_LAB_ACTIVATION_REPORT.md` | Tạo mới | Báo cáo nghiệm thu bàn giao chính thức cho Tuấn. |

*Ghi chú an toàn:*  
- `mirror.html` & `src/js/mirror.js`: **0 byte thay đổi (Nguyên vẹn 100%)**.  
- `server/family_archive.db`: **0 byte thay đổi** (Mã SHA-256: `b3350d2e6b1aed795664d5c4fe8f688d5171c289a2ca183f247a82781bc2a30e` khớp tuyệt đối).  
- `Git working tree`: **Không commit, không push, không merge**.

---

## 3. CÁC NĂNG LỰC ĐÃ TRIỂN KHAI TRONG LAB (CAPABILITIES IMPLEMENTED)

### A. Năng Lực Biên Tập Nội Dung (Content Prototyping)
- **Nút gạt Sửa Nhanh Trực Tiếp (`✏️ Sửa Nhanh: BẬT / TẮT`):** Khi BẬT, toàn bộ tiêu đề (`h1, h2, h3`), đoạn văn (`p`), tên thẻ (`.gi-card__title`), và dữ liệu mẫu được cấp thuộc tính `contenteditable="true"` kèm viền nét đứt màu hổ phách. Tuấn có thể click chuột trực tiếp vào bất kỳ đoạn chữ nào để gõ và xem trước câu từ mới ngay trong bối cảnh giao diện thực tế.
- **Dải chỉ dẫn trực quan:** Thông báo rõ ràng việc chỉnh sửa chữ trên màn hình chỉ phục vụ đánh giá thị giác, không làm ảnh hưởng mã nguồn.
- **Thanh tra mã nguồn (Source & Fixture Inspector):** Cố định ở chân trang hiển thị rõ ràng file Component UI (`src/js/ui/*`), file dữ liệu mẫu (`fixtures/*`), và Route tương ứng của bề mặt đang xem.

### B. Năng Lực Kiểm Thử Bố Cục & Đa Màn Hình (UI & Responsive Prototyping)
- **Bộ chuyển đổi khung hình thiết bị thực tế:**
  - `📱 375px (Mobile)`: Giới hạn độ rộng 375px, bo tròn góc viền điện thoại 24px, đổ bóng viền nổi, kích hoạt CSS breakpoint di động.
  - `📱 768px (Tablet)`: Giới hạn 768px, đóng khung máy tính bảng dọc.
  - `💻 1024px (Laptop)`: Giới hạn 1024px, đóng khung máy tính xách tay / tablet ngang.
  - `🖥️ 1440px (Desktop)`: Giới hạn 1440px, bố cục màn hình rộng chuẩn mực.
  - `↔️ 100% (Fluid)`: Tràn đều theo toàn bộ độ rộng cửa sổ trình duyệt.

### C. Năng Lực Thử Nghiệm Tương Tác (Interaction Prototyping)
- **Điều hướng khép kín nội bộ (In-Lab Navigation):** Khi click vào bất kỳ liên kết nội bộ nào trong giao diện (như thẻ thành viên, cây phả đồ, bài viết MẠCH), hệ thống tự động bắt giữ và định tuyến qua URL Hash nội bộ (`#view=...`), giữ Tuấn ở lại trong Lab mà không bị văng sang trang 404.
- **Hồ sơ nhân vật (`#view=person`):**
  - Thanh chọn nhanh 7 nhân vật mẫu (`p1` đến `p7`) để quan sát phản ứng của giao diện với các cấu trúc thân tộc khác nhau.
  - Nút bấm `[✏️ Thử nghiệm Form Đề Xuất Thay Đổi (Mock)]` mở hộp thoại Modal tương tác cho phép nhập đề xuất sửa đổi và phát thông báo Toast mô phỏng.
- **Cây phả đồ (`#view=tree`):**
  - Ô tìm kiếm lọc danh sách nhân vật theo tên thời gian thực, có đếm số kết quả.
  - Click vào tên nhân vật bất kỳ lập tức mở Hồ sơ nhân vật tương ứng.
- **Diễn ngôn MẠCH & Thư Clara (`#view=mach`, `#view=clara`):**
  - Thanh điều chỉnh cỡ chữ đọc: `[A- (Nhỏ)]`, `[A (Chuẩn)]`, `[A+ (Lớn)]` phục vụ việc căn chỉnh trải nghiệm đọc văn hóa.
  - Nút gửi phản hồi / lời bình mô phỏng kèm Toast xác nhận.
- **Không gian gia đình (`#view=spaces`):**
  - Nút thử nghiệm tạo yêu cầu mở Không Gian Nhánh mới.

### D. Năng Lực Giả Lập Trạng Thái Biên (State Simulation)
Cho phép Tuấn thử nghiệm 6 trạng thái hệ thống qua menu xổ xuống:
1. `Bình thường`: Hiển thị dữ liệu mẫu trọn vẹn.
2. `Đang tải`: Khung skeleton/loading của UI System vNEXT.
3. `Trống`: Giao diện StatePanel thông báo chưa có dữ liệu ghi nhận.
4. `Chưa login (401)`: Khung thông báo yêu cầu đăng nhập và nút điều hướng về Cổng vào.
5. `Không có quyền (403)`: Khung cảnh báo chặn truy cập (đặc thù bảo vệ quyền riêng tư Thư Clara).
6. `Lỗi hệ thống (500)`: Khung xử lý sự cố kèm nút Thử lại mô phỏng.

### E. Năng Lực Duyệt Theo Persona Giả Lập Sạch PII
Duy trì 6 Persona giả lập:
- `A-HD`: Tuấn / Nhánh Hạnh Đào (Quyền xem Thư Clara + MẠCH).
- `A-OB`: Chi khác / Ngoài nhánh (Bị chặn xem Thư Clara theo ma trận bảo mật).
- `ACTIVE`: Trần Trọng Mẫu C (Trưởng họ - Đời 2).
- `PROVISIONED`: Trần Quốc Mẫu F (Thành viên mới cấp tài khoản).
- `UNMAPPED`: Thành viên chưa gắn hồ sơ phả hệ.
- `ANONYMOUS`: Khách vãng lai ngoài xã hội.

---

## 4. BẢNG ĐỐI SOÁT CHÍNH XÁC 7 BỀ MẶT TRONG LAB

| STT | Tên Bề Mặt | Route / Entry Point | File Component UI | File Fixture Dữ Liệu | Quyền Hạn & Tính Năng Nổi Bật |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Cổng vào (Public)** | `/#view=public` | `src/js/ui/public-home.js` | `fixtures/synthetic_profile.json` | Khách xã hội; bố cục Dichotomy phân luồng nghiêm cẩn; dẫn vào Cổng thành viên. |
| **2** | **Của tôi (Dashboard)** | `/#view=dashboard` | `src/js/ui/dashboard.js` | `fixtures/synthetic_profile.json` | Thành viên; 4 cánh cửa dẫn vào các không gian; lược bỏ thuật ngữ kỹ thuật. |
| **3** | **Cây phả đồ (Tree)** | `/#view=tree` | `src/js/ui/tree.js` | `fixtures/synthetic_genealogy.json` | Lưu trữ gia phả dạng danh mục tra cứu; tìm kiếm tên người trực tiếp. |
| **4** | **Hồ sơ nhân vật (Person)** | `/#view=person&id=p3` | `src/js/ui/person.js` | `fixtures/synthetic_genealogy.json` | Thông tin người, thân tộc 4 nhóm quan hệ, tư liệu, form đề xuất sửa đổi mẫu. |
| **5** | **MẠCH** | `/#view=mach` | `src/js/ui/discourse.js` | `fixtures/synthetic_mach.json` | Diễn ngôn tư tưởng chung toàn họ; thanh chỉnh cỡ chữ; lọc bài viết. |
| **6** | **Thư Clara** | `/#view=clara` | `src/js/ui/discourse.js` | `fixtures/synthetic_clara.json` | Diễn ngôn thân mật riêng tư; kích hoạt rào chắn 403 đối với persona ngoài nhánh. |
| **7** | **Không gian (Spaces)** | `/#view=spaces` | `src/js/ui/spaces.js` | `fixtures/synthetic_profile.json` | Không gian sinh hoạt các nhánh; trạng thái chờ kích hoạt; thử nghiệm tạo mới. |

> **GHI CHẬN KHÁC BIỆT THEO CHỈ THỊ CỦA TUẤN:**  
> Trong tài liệu *Frontend Completion Plan v2.0* trước đây chỉ ghi nhận 6 bề mặt (chưa tách riêng Không gian gia đình). Tuy nhiên, trên mã nguồn thực tế của Vibecode Lab hiện có đủ 7 bề mặt. AGY tuân thủ chỉ thị: **giữ nguyên vẹn 7 bề mặt, không tự ý gộp hoặc xóa**, và ghi nhận vào biên bản này để Tuấn quyết định chính thức trong các phiên tiếp theo.

---

## 5. NHỮNG NĂNG LỰC CHƯA TRIỂN KHAI & GIỚI HẠN HIỆN TẠI

1. **Chưa có lưu trữ trạng thái biên tập nội dung xuống file (Write-back Persistence):**  
   - Chế độ Sửa Nhanh hiện tại hoạt động in-memory trên DOM trình duyệt. Khi bấm F5 tải lại trang, nội dung sẽ quay về mặc định của file fixture.  
   - *Lý do:* Tuân thủ triệt để ranh giới an toàn không ghi file khi chưa có chỉ thị rõ ràng về format lưu trữ.
2. **Chưa kết nối Backend API & Database thật:**  
   - Toàn bộ dữ liệu hiển thị lấy từ thư mục `fixtures/` sạch PII.  
   - *Lý do:* Theo đúng nguyên tắc của Batch 2 — tách biệt hoàn toàn thiết kế giao diện khỏi rủi ro backend và CSDL.
3. **Form đề xuất chỉnh sửa là Mock Modal:**  
   - Chưa gửi gói tin về backend duyệt bài (Admin Approval Workflow).

---

## 6. HƯỚNG DẪN ĐỂ TUẤN BẮT ĐẦU THIẾT KẾ VÀ CHỈNH SỬA PROTOTYPE

Tuấn mở trình duyệt truy cập:  
👉 **[http://localhost:8888/lab.html](http://localhost:8888/lab.html)**

### Các bước thao tác nhanh:
1. **Duyệt qua 7 bề mặt:** Click trực tiếp vào 7 nút tab màu cam trên đỉnh màn hình (`1. Cổng vào` đến `7. Không gian`).
2. **Thử nghiệm chỉnh sửa câu chữ trực tiếp:**
   - Bấm nút **`[✏️ Sửa Nhanh: TẮT]`** ở góc trên bên phải thanh công cụ.
   - Nút chuyển sang màu xanh **`[✏️ Sửa Nhanh: BẬT]`** và xuất hiện dải màu vàng trên đầu trang.
   - Click chuột vào bất kỳ tiêu đề hoặc đoạn văn nào trên trang (ví dụ khẩu hiệu ở Trang chủ, tên cánh cửa ở Trang Của tôi) và gõ câu chữ Tuấn muốn thử nghiệm.
3. **Xem giao diện trên điện thoại và máy tính bảng:**
   - Bấm nút **`[📱 375px (Mobile)]`** để xem giao diện co về tỷ lệ điện thoại với khung viền thiết bị.
   - Bấm **`[📱 768px (Tablet)]`** hoặc **`[💻 1024px (Laptop)]`** để xem bố cục máy tính bảng.
   - Bấm **`[↔️ 100% (Fluid)]`** để quay lại toàn màn hình.
4. **Kiểm tra quyền riêng tư Thư Clara:**
   - Vào bề mặt **`6. Thư Clara`**.
   - Ở mục **Persona**, chọn `A-OB · Chi khác / Ngoài nhánh` -> Giao diện lập tức hiện thông báo chặn quyền truy cập (403), chứng minh tính năng bảo mật hoạt động.
   - Chọn lại `A-HD · Tuấn / Nhánh Hạnh Đào` -> Nội dung mở ra trọn vẹn.
5. **Thử nghiệm tương tác:**
   - Vào **`4. Hồ sơ (/person)`**, click nút **`[✏️ Thử nghiệm Form Đề Xuất Thay Đổi (Mock)]`** để trải nghiệm luồng đóng góp ý kiến của con cháu.
   - Vào **`3. Phả đồ (/me/tree)`**, gõ chữ vào ô tìm kiếm để thấy danh sách tự động lọc.
6. **Đối chiếu với bản sao Production:**
   - Bấm nút đỏ **`[🌐 Bản Sao Production (Local Mirror) →]`** trên thanh công cụ bất kỳ lúc nào để chuyển sang xem trang web hiện tại.

---

## 7. BẰNG CHỨNG KIỂM THỬ ĐỊNH LƯỢNG (AUTOMATED TEST ARTIFACTS)

AGY đã chạy kiểm thử tự động toàn bộ 7 bề mặt và các tính năng mới bằng Playwright; tất cả ảnh chụp màn hình được lưu trữ tại `shots/lab/`:

### Bảy Bề Mặt Giao Diện Trong Lab:
1. **Bề mặt 1 — Cổng vào (Public):**  
   ![Surface Public](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/lab/12-surface-public.png)
2. **Bề mặt 2 — Của tôi (Member Dashboard):**  
   ![Surface Dashboard](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/lab/13-surface-dashboard.png)
3. **Bề mặt 3 — Cây phả đồ (Tree):**  
   ![Surface Tree](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/lab/14-surface-tree.png)
4. **Bề mặt 4 — Hồ sơ nhân vật (Person Detail):**  
   ![Surface Person](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/lab/15-surface-person.png)
5. **Bề mặt 5 — Diễn ngôn MẠCH:**  
   ![Surface Mach](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/lab/16-surface-mach.png)
6. **Bề mặt 6 — Thư gửi Clara (Intimate):**  
   ![Surface Clara](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/lab/17-surface-clara.png)
7. **Bề mặt 7 — Không gian gia đình (Spaces):**  
   ![Surface Spaces](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/lab/18-surface-spaces.png)

### Các Năng Lực Prototyping Mới Được Kích Hoạt:
8. **Khung hình di động thực tế (Mobile 375px Device Frame):**  
   ![Viewport Mobile](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/lab/19-feature-viewport-mobile-375.png)
9. **Khung hình máy tính bảng (Tablet 768px Frame):**  
   ![Viewport Tablet](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/lab/20-feature-viewport-tablet-768.png)
10. **Hộp thoại tương tác Đề xuất chỉnh sửa thông tin:**  
    ![Mock Modal](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/lab/21-feature-person-mock-modal.png)
11. **Chế độ sửa nhanh câu chữ trực tiếp (Inline Edit Active):**  
    ![Inline Edit Active](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/lab/22-feature-inline-edit-active.png)
12. **Mô phỏng trạng thái 403 Chặn truy cập trên Thư Clara:**  
    ![State Sim 403](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/lab/23-feature-state-sim-403.png)

---

## 8. CHECKPOINT — ĐIỀU KIỆN DỪNG THEO MỆNH LỆNH (STOP CONDITION)

> **MỆNH LỆNH QUẢN TRỊ TUÂN THỦ NGHIÊM NGẶT:**  
> - ❌ **Không tự ý triển khai thiết kế mới cho 7 bề mặt.**  
> - ❌ **Không tự ý quyết định nội dung thay cho Tuấn.**  
> - ❌ **Không tự chuyển sang Backend Integration.**  
> - ❌ **Không tự ý triển khai Batch tiếp theo.**  
>  
> **AGY DỪNG THỰC THI TẠI ĐÂY.**  
> Môi trường làm việc Vibecode Lab đã hoàn toàn sẵn sàng để **Tuấn trực tiếp sử dụng, thẩm định thị giác, và đưa ra các chỉ đạo thiết kế / nội dung tiếp theo**.

---
*Báo cáo được lập bởi AGY (Execution Coordinator) — Ngày 02/11/2026.*

