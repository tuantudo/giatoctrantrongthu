# LỘ TRÌNH TRIỂN KHAI: QUY TRÌNH THIẾT KẾ SẢN PHẨM DO CON NGƯỜI ĐỊNH HƯỚNG
# (HUMAN-DIRECTED PRODUCT DESIGN WORKFLOW IMPLEMENTATION ROADMAP)

**Mã tài liệu:** `AUDIT/IMPLEMENTATION_ROADMAP.md`  
**Dự án:** CÂY GIA PHẢ — GIATỘC TRẦN TRỌNG THU  
**Thẩm quyền:** Tuấn (Human Final Authority) · Emarald (Architecture & QC) · AGY (Execution Coordinator)  
**Phiên bản:** v1.0  
**Ngày ban hành:** 2026-11-03  

---

## 1. NGUYÊN TẮC PHÂN KỲ & CHỐT CHẶN (ROADMAP PRINCIPLES & GATES)

Lộ trình triển khai được chia thành **7 Phase tuần tự có kiểm soát chặt chẽ**. Tuyệt đối không nhảy cóc giai đoạn, không tự động chuyển từ lập kế hoạch sang viết code khi chưa có phê duyệt chính thức từ Tuấn tại từng **Approval Gate**.

```text
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5 ──► Phase 6
Current     Experience  Touchpoint  Experience  Dependency  Vertical    Product-wide
Audit       Arch        & Decision  Design Lab  & QA Engine Slice Test  Adoption
  │             │           │           │           │           │           │
[GATE 0]    [GATE 1]    [GATE 2]    [GATE 3]    [GATE 4]    [GATE 5]    [GATE 6]
```

---

## 2. CHI TIẾT 7 GIAI ĐOẠN TRIỂN KHAI (PHASES SPECIFICATION)

### PHASE 0: Current-State Audit & Baseline Reconnaissance
- **Objective:** Xác lập bức tranh pháp y toàn diện về mã nguồn, UI surfaces và công cụ Vibecode Lab hiện tại.
- **Scope:** Khảo sát READ-ONLY `src/js/ui/`, `lab.html`, `lab.js`, fixtures, các báo cáo audit trong `AUDIT/`.
- **Dependencies:** Không phụ thuộc.
- **Deliverables:** [`AUDIT/CURRENT_STATE_AUDIT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/CURRENT_STATE_AUDIT.md).
- **Acceptance Criteria:** Báo cáo phản ánh 100% bằng chứng thực tế, không có suy diễn.
- **Risks:** Bỏ sót các module ẩn hoặc giả định sai về tính năng đã có.
- **Approval Gate (GATE-0):** Tuấn nghiệm thu báo cáo hiện trạng.

---

### PHASE 1: Experience Architecture & Schemas Definition
- **Objective:** Chuẩn hóa cấu trúc thực thể cho Journey, Touchpoint, Component, Decision Record và Test Case.
- **Scope:** Định nghĩa các schema JSON và TypeScript/JSDoc types trong thư mục kiến trúc.
- **Dependencies:** Hoàn thành Phase 0.
- **Deliverables:**
  - `docs/architecture/HUMAN_DIRECTED_DESIGN_WORKFLOW.md`
  - `docs/architecture/TOUCHPOINT_DEPENDENCY_MODEL.md`
  - Tệp schema định dạng `config/schemas/journey_touchpoint_schema.json`.
- **Acceptance Criteria:** Mô hình quan hệ biểu diễn đầy đủ tính chất 1-N, N-N, loại trừ được Cartesian explosion.
- **Risks:** Mô hình quá trừu tượng hoặc cồng kềnh gây khó khăn khi tích hợp vào giao diện Lab.
- **Approval Gate (GATE-1):** Tuấn phê duyệt cấu trúc thực thể trải nghiệm.

---

### PHASE 2: Touchpoint & Decision Management Engine
- **Objective:** Xây dựng lõi quản lý điểm chạm và nhật ký quyết định trong Vibecode Lab.
- **Scope:**
  - Bổ sung `src/js/ui/journey-store.js` và `src/js/ui/decision-store.js`.
  - Tích hợp giao diện Touchpoint Registry và Decision Log Panel trên Studio Ribbon.
- **Dependencies:** Hoàn thành Phase 1.
- **Deliverables:**
  - Bảng tra cứu Touchpoints và trạng thái phê duyệt (`PROPOSED` ──► `APPROVED`).
  - Giao diện ghi nhận lý do quyết định của Tuấn kèm timestamp.
- **Acceptance Criteria:** Tuấn có thể bấm đổi trạng thái của một Touchpoint, nhập lý do và lưu vết thành công.
- **Risks:** Xung đột bộ nhớ LocalStorage với Content DraftStore.
- **Approval Gate (GATE-2):** Tuấn phê duyệt cơ chế lưu vết quyết định.

---

### PHASE 3: Experience Design Studio & Visual Comparison
- **Objective:** Cung cấp công cụ so sánh trực quan và biên tập câu chữ nâng cao.
- **Scope:**
  - Chế độ so sánh song song A/B (Current Baseline vs Working Proposal).
  - Tích hợp Token Explorer điều chỉnh typography và layout spacing theo Brand Governance.
- **Dependencies:** Hoàn thành Phase 2.
- **Deliverables:** Component `VisualComparator` tích hợp trực tiếp vào Vibecode Lab.
- **Acceptance Criteria:** Tuấn có thể nhìn thấy sự khác biệt trực quan giữa 2 phương án hiển thị trước khi bấm duyệt.
- **Risks:** Làm chậm tốc độ render của Lab khi mở 2 khung preview cùng lúc.
- **Approval Gate (GATE-3):** Tuấn nghiệm thu tính năng so sánh trực quan.

---

### PHASE 4: Dependency Analysis & Targeted Regression QA
- **Objective:** Tự động hóa việc phân tích tác động và chọn lọc kịch bản kiểm thử hồi quy.
- **Scope:**
  - Xây dựng thuật toán Impact Analysis dựa trên Shared Components Registry.
  - Tích hợp runner kích hoạt Playwright test tương ứng với Touchpoint vừa thay đổi.
- **Dependencies:** Hoàn thành Phase 3.
- **Deliverables:** Module `src/js/ui/impact-analyzer.js` và thanh trạng thái "Regression Health Indicator".
- **Acceptance Criteria:** Khi sửa menu công khai, hệ thống chỉ báo xanh các bài test liên quan đến `public` mà không kích hoạt test thừa.
- **Risks:** Playwright chạy ngầm chiếm dụng CPU hoặc treo tiến trình.
- **Approval Gate (GATE-4):** Emarald thẩm tra độ tin cậy của thuật toán phân tích tác động; Tuấn phê duyệt.

---

### PHASE 5: Vertical Slice Validation (Kiểm Chứng Trên Một Hành Trình Thật)
- **Objective:** Vận hành thử nghiệm toàn bộ quy trình 9 bước từ đầu đến cuối trên một hành trình tiêu biểu trước khi nhân rộng.
- **Scope:** Áp dụng cho Vertical Slice: `JRN-01: Public Research Exploration` (Chi tiết mục 3 dưới đây).
- **Dependencies:** Hoàn thành Phase 4.
- **Deliverables:**
  - Báo cáo chạy thực tế: `AUDIT/VERTICAL_SLICE_VALIDATION_REPORT.md`.
  - Biên bản nghiệm thu toàn bộ các điểm chạm của Slice.
  - Tệp xuất cấu hình đóng băng `Approved Baseline JSON` đầu tiên.
- **Acceptance Criteria:** Toàn bộ chu trình từ Journey ──► Touchpoint ──► Đề xuất ──► Tuấn duyệt ──► Test hồi quy ──► Đóng băng chuẩn diễn ra trơn tru không lỗi.
- **Risks:** Phát hiện điểm bất tiện trong luồng thao tác thực tế của Tuấn.
- **Approval Gate (GATE-5):** Tuấn trực tiếp trải nghiệm và ký duyệt nghiệm thu Vertical Slice.

---

### PHASE 6: Product-Wide Adoption (Phổ Cập Toàn Diện 7 Bề Mặt)
- **Objective:** Mở rộng quy trình thiết kế chuẩn ra toàn bộ 7 bề mặt trải nghiệm của hệ thống.
- **Scope:**
  - Số hóa toàn bộ Touchpoints của 6 bề mặt thành viên (`dashboard`, `tree`, `person`, `mach`, `clara`, `spaces`).
  - Đóng băng toàn bộ Approved Product Baseline v1.0.
- **Dependencies:** Hoàn thành Phase 5.
- **Deliverables:**
  - `AUDIT/COMPLETE_PRODUCT_BASELINE_v1.0.json`.
  - Báo cáo tổng kết sẵn sàng bước vào Phase 5 của Master Completion Plan (System Integration & Verification).
- **Acceptance Criteria:** 100% Touchpoints trong toàn bộ sản phẩm đạt trạng thái `APPROVED`.
- **Risks:** Khối lượng Touchpoints lớn gây quá tải việc xem xét của Tuấn.
- **Approval Gate (GATE-6):** Tuấn ban hành quyết định đóng băng Baseline v1.0.

---

## 3. THIẾT KẾ VERTICAL SLICE TIÊU BIỂU (REPRESENTATIVE JOURNEY)

Để kiểm chứng workflow một cách thực tế và an toàn nhất, AGY đề xuất chọn hành trình:  
👉 **`JRN-01: PUBLIC RESEARCH EXPLORATION & MẠCH DISCOVERY`**  
*(Hành trình Khảo Cứu Công Khai & Tiếp Cận Tuyển Tập MẠCH)*

### 3.1. Lý do lựa chọn hành trình này:
1. **Tính hoàn chỉnh và độ chín muồi cao nhất:** Bề mặt `public` hiện là bề mặt có cấu trúc nội dung đầy đủ nhất (6 khu vực rõ ràng, đã gắn `data-editable-id`, đã có Navigator động và ScrollSpy).
2. **Bao hàm đầy đủ các loại tương tác cốt lõi:**
   - Điều hướng cấp trang (Page navigation: `/` ──► `/login`).
   - Điều hướng cấp mục (Section navigation: `#van-de`, `#noi-dung`, `#mach`).
   - Biên tập văn bản mẫu (Copy tweaking trên thẻ bài viết, lời dẫn hero).
   - Ranh giới bảo mật phân định rõ (UNESCO công khai ──► Inward gate bảo vệ).
3. **Không động chạm dữ liệu thật (Zero PII Risk):** Sử dụng 100% dữ liệu khảo cứu tổng hợp sạch, an toàn tuyệt đối cho gia tộc.

### 3.2. Danh sách các Touchpoint được đưa vào Slice:
1. `TP-01: Định Vị Không Gian & Lời Mở Đầu (The Threshold)`
   - *Mục tiêu người dùng:* Hiểu rõ đây là không gian nghiên cứu đời sống gia đình Việt Nam từ một gia tộc, không phải mạng xã hội hay trang quảng cáo.
   - *Component liên quan:* `InstitutionHeader`, `GlobalNav`, `Section (dinh-vi)`, `Hero`.
   - *Persona:* `ANONYMOUS`.
   - *State:* `default`.
2. `TP-02: Bốn Câu Hỏi Nghiên Cứu Mở (Issues of Interest)`
   - *Mục tiêu người dùng:* Nhận diện các câu hỏi khảo cứu sâu sắc về biến thiên gia đình, ký ức truyền khẩu, quan hệ huyết thống và phụng vụ gia tiên.
   - *Component liên quan:* `Section (van-de)`, `Card (Questions Grid)`.
   - *Persona:* `ANONYMOUS`.
   - *State:* `default`.
3. `TP-03: Công Bố Khảo Cứu & Phân Loại 5 Hình Thức (Published Content)`
   - *Mục tiêu người dùng:* Tiếp cận minh bạch các tư liệu, ghi nhận ký ức tiền nhân cụ thể (Bà Sa, Cụ Thu...).
   - *Component liên quan:* `Section (noi-dung)`, `PillFilters`, `Card (Publications Grid)`.
   - *Persona:* `ANONYMOUS`.
   - *State:* `default`.
4. `TP-04: Cầu Nối Khám Phá Tuyển Tập MẠCH (MẠCH Gateway)`
   - *Mục tiêu người dùng:* Nhận biết không gian xuất bản và suy tư văn hóa độc lập MẠCH.
   - *Component liên quan:* `Section (mach)`, `MachBanner`, `ActionButtons`.
   - *Persona:* `ANONYMOUS`.
   - *State:* `default`.
5. `TP-05: Cổng Tiếp Cận Thành Viên Trong Dòng Họ (Inward Gate)`
   - *Mục tiêu người dùng:* Con cháu dòng họ nhìn thấy lối vào không gian nội bộ mà không tạo cảm giác phô trương hay ngăn cách xã hội.
   - *Component liên quan:* `MemberGateBanner`, `GateButton`.
   - *Persona:* `ANONYMOUS` ──► Chuyển đổi sang `ACTIVE`.
   - *State:* `default`.

### 3.3. Tiêu chí nghiệm thu của Slice (Slice Acceptance Criteria):
- [ ] Tuấn thực hiện thay đổi thử một tiêu đề câu hỏi nghiên cứu tại `TP-02` trong Lab.
- [ ] Đề xuất tự động chuyển sang trạng thái `PROPOSED` trong Decision Log.
- [ ] Tuấn xem so sánh trực quan phương án cũ và phương án mới, sau đó bấm `APPROVED`.
- [ ] Hệ thống Impact Analysis xác nhận chỉ có Surface `public` bị ảnh hưởng.
- [ ] Kịch bản Playwright tự động chạy và xác nhận 100% test cases của Public đạt kết quả xanh.
- [ ] Tuấn bấm xuất `Approved Baseline Slice JSON` hoàn tất chu trình.

