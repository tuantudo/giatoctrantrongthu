# KIẾN TRÚC QUY TRÌNH THIẾT KẾ SẢN PHẨM DO CON NGƯỜI ĐỊNH HƯỚNG
# (HUMAN-DIRECTED PRODUCT DESIGN WORKFLOW ARCHITECTURE)

**Mã tài liệu:** `docs/architecture/HUMAN_DIRECTED_DESIGN_WORKFLOW.md`  
**Dự án:** CÂY GIA PHẢ — GIATỘC TRẦN TRỌNG THU  
**Thẩm quyền tối cao:** Tuấn (Human Final Authority / Product Owner / Design Decision Maker)  
**Thẩm định kiến trúc & QC:** Emarald (Analysis Authority)  
**Điều phối & Hạ tầng:** AGY (Execution Coordinator)  
**Phiên bản:** v1.0  
**Ngày ban hành:** 2026-11-03  

---

## 1. NGUYÊN TẮC QUẢN TRỊ CỐT LÕI (CORE GOVERNANCE PRINCIPLES)

Quy trình thiết kế sản phẩm của dự án CÂY GIA PHẢ tuân thủ tuyệt đối 4 định đề quản trị:

1. **Tuấn Quyết Định Mọi Điểm Chạm (Human Agency at Every Touchpoint):**
   - Tuấn trực tiếp trải nghiệm, đánh giá và ra quyết định trên toàn bộ hành trình.
   - Trí tuệ nhân tạo (AI/Agents) đóng vai trò phân tích, hỗ trợ đề xuất phương án (Proposals), phát hiện mâu thuẫn và kiểm tra hồi quy tự động.
   - **Tuyệt đối không có bất kỳ quyết định UI/UX nào được tự động thông qua hoặc tự động áp dụng nếu chưa có phê duyệt rõ ràng từ Tuấn.**
2. **Quy Trình Khép Kín 9 Bước Tuần Tự (Closed-Loop Design Cycle):**
   ```text
   Journey (Hành trình)
     └──► Touchpoint (Điểm chạm)
           └──► Experience Definition (Định nghĩa trải nghiệm)
                 └──► UI/UX Design (Thiết kế chi tiết)
                       └──► Interactive Prototype (Mô phỏng tương tác)
                             └──► Validation (Xác minh & Phản hồi)
                                   └──► Regression (Kiểm tra hồi quy)
                                         └──► Product Review (Nghiệm thu)
                                               └──► Approved Product Baseline (Đóng băng chuẩn)
   ```
3. **Phân Định 3 Môi Trường Độc Lập:**
   - **Lab Draft (Bản Nháp Thử Nghiệm):** Môi trường Sandbox linh hoạt, cho phép gõ thử chữ, đổi giao diện, tạo biến thể mock mà không ảnh hưởng ai.
   - **Approved Product Baseline (Cơ Sở Sản Phẩm Đã Duyệt):** Bản thiết kế và cấu trúc đã được Tuấn ký duyệt, đóng vai trò hợp đồng giao diện chính thức.
   - **Production (Môi Trường Triển Khai Thật):** Hệ thống phục vụ người dùng cuối, được bảo vệ nghiêm ngặt và chỉ cập nhật thông qua Human Gate chính thức.
4. **Mọi Quyết Định Đều Có Vết (Full Traceability & Audit Trail):**
   - Mọi thay đổi đều gắn với một Decision ID, lưu giữ ngữ cảnh, lý do thay đổi và các touchpoint chịu tác động.

---

## 2. KIẾN TRÚC 7 KHỐI CHỨC NĂNG (7 WORKFLOW MODULES)

Hệ thống thiết kế sản phẩm được tổ chức thành 7 khối chức năng gắn kết hữu cơ:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   VIBECODE STUDIO                                      │
├─────────────────────┬──────────────────────┬───────────────────────────────────────────┤
│ 1. JOURNEY STUDIO   │ 2. TOUCHPOINT MGR    │ 3. EXPERIENCE DESIGNER                    │
│ • User Journeys     │ • Touchpoint Registry│ • Typography / Tokens / Spacing           │
│ • Phases & Goals    │ • Persona × State    │ • Visual Copy & Hierarchy                 │
│ • Pain Points       │ • Privacy Boundaries │ • Interactive Variants                    │
├─────────────────────┼──────────────────────┼───────────────────────────────────────────┤
│ 4. INTERACTIVE LAB  │ 5. DEPENDENCY & QA   │ 6. DECISION LOG                           │
│ • 7 UI Surfaces     │ • Shared Components  │ • PROPOSED ──► REVIEWED ──► APPROVED      │
│ • Device Frame View │ • Impact Analysis    │ • Rationale & Audit Trail                 │
│ • Real Mock Flows   │ • Regression QA Suite│ • Rollback & Snapshot                     │
├─────────────────────┴──────────────────────┴───────────────────────────────────────────┤
│ 7. PRODUCT REVIEW & BASELINE MANAGEMENT                                                │
│ • Touchpoint Readiness Matrix · Baseline Freezing · Handoff Gate                       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1. Khối 1: Journey Studio (Quản Lý Hành Trình Người Dùng)
- **Mục tiêu:** Định hình bức tranh trải nghiệm tổng thể, giúp Tuấn nhìn thấy vị trí của người dùng trong mối quan hệ với không gian gia tộc.
- **Thực thể dữ liệu (Journey Entity):**
  - `journey_id`: Mã hành trình (ví dụ: `JRN-PUBLIC-EXPLORATION`, `JRN-MEMBER-CLARA-READ`).
  - `title`: Tên hành trình.
  - `persona`: Đối tượng trải nghiệm chính.
  - `phases`: Các giai đoạn tuần tự (Nhận biết → Tiếp cận → Khám phá → Thấu hiểu → Hành động).
  - `user_goal`: Mục tiêu cốt lõi mà người dùng muốn đạt được tại hành trình này.
  - `pain_points`: Các rào cản nhận thức hoặc tâm lý (ví dụ: e ngại lộ thông tin gia đình, bối rối vì cây phả quá lớn).
  - `expected_outcome`: Kết quả mong đợi về mặt cảm xúc và thông tin.

### 2.2. Khối 2: Touchpoint Manager (Quản Lý Ma Trận Điểm Chạm)
- **Mục tiêu:** Chia nhỏ hành trình thành từng điểm chạm cụ thể, có ranh giới kỹ thuật và ngữ nghĩa xác định.
- **Thực thể dữ liệu (Touchpoint Entity):**
  - `touchpoint_id`: Mã điểm chạm (ví dụ: `TP-PUB-01-THRESHOLD`, `TP-PUB-04-MACH-GATE`).
  - `journey_id`: Hành trình cha.
  - `surface_id`: Bề mặt giao diện tương ứng (`public`, `dashboard`, `tree`, `person`, `mach`, `clara`, `spaces`).
  - `persona_context`: Persona hợp lệ (`ANONYMOUS`, `ACTIVE`, `A-HD`...).
  - `system_state`: Trạng thái hệ thống (`default`, `empty`, `loading`, `error`).
  - `responsive_context`: Điểm thích ứng (`mobile-375`, `tablet-768`, `desktop-1440`).
  - `privacy_boundary`: Cấp độ bảo mật dữ liệu (`PUBLIC_GATEWAY`, `EPISTEMIC_RECORD`, `FAMILY_SECRET`).
  - `acceptance_criteria`: Danh sách tiêu chuẩn nghiệm thu của riêng điểm chạm đó.
  - `approval_status`: Trạng thái phê duyệt hiện tại của Tuấn.

### 2.3. Khối 3: Experience Designer (Biên Tập & Thử Nghiệm Trải Nghiệm)
- **Mục tiêu:** Cung cấp môi trường trực quan để Tuấn và AI thử nghiệm các biến thể câu chữ, phân cấp thông tin và bố cục trực tiếp.
- **Tính năng chủ đạo:**
  - **Copy Tweaker:** Chỉnh sửa văn bản mẫu trực tiếp, gắn chặt với `data-editable-id` ổn định.
  - **Design Proposals Comparator:** Xem so sánh song song (A/B Comparison) giữa Phương án Hiện tại (Current) và Đề xuất Mới (Proposal).
  - **Token Explorer:** Thử nghiệm thay đổi font chữ, khoảng cách padding, độ đậm nhạt theo hệ thống Design Tokens có sẵn mà không phá vỡ BRAND_GOVERNANCE.

### 2.4. Khối 4: Interactive Preview (Mô Phỏng Trực Quan Tương Tác)
- **Mục tiêu:** Cho phép trải nghiệm thực tế ngay trong trình duyệt.
- **Khả năng:**
  - Chuyển đổi linh hoạt giữa 7 bề mặt UI vNEXT.
  - Chuyển đổi khung thiết bị vật lý (375px, 768px, 1024px, 1440px, Fluid).
  - Tương tác điều hướng mượt mà, hỗ trợ cả `aria-current="location"` (mục nội bộ) và `aria-current="page"` (chuyển trang).
  - Chạy dữ liệu Synthetic Mock sạch PII, an toàn tuyệt đối.

### 2.5. Khối 5: Dependency & QA (Quản Lý Phụ Thuộc & Kiểm Thử Hồi Quy)
- **Mục tiêu:** Ngăn chặn lỗi dây chuyền khi một thành phần giao diện dùng chung bị thay đổi.
- **Cơ chế:**
  - **Shared Component Registry:** Danh mục các thành phần dùng chung (`GlobalNav`, `InstitutionHeader`, `Breadcrumb`, `Footer`, `Card`, `Section`...).
  - **Impact Analysis Engine:** Khi Tuấn hoặc AI đề xuất sửa `GlobalNav`, hệ thống lập tức liệt kê toàn bộ các Touchpoint và Surface bị ảnh hưởng (ví dụ: ảnh hưởng cả `public` lẫn `member`).
  - **Targeted Regression QA:** Chỉ kích hoạt các kịch bản kiểm thử Playwright liên quan đến các Touchpoint bị ảnh hưởng, tránh việc chạy bừa bãi lãng phí tài nguyên.

### 2.6. Khối 6: Decision Log (Nhật Ký Quyết Định Thiết Kế Có Cấu Trúc)
- **Mục tiêu:** Lưu vết minh bạch mọi quyết định của Tuấn, ngăn ngừa việc AI tự tiện thay đổi hoặc lặp lại những đề xuất đã bị từ chối.
- **Cấu trúc bản ghi:**
  - `decision_id`: Mã quyết định (ví dụ: `DEC-UI-2026-001`).
  - `touchpoint_id` / `component_id`: Đối tượng tác động.
  - `proposal`: Mô tả phương án AI đề xuất.
  - `decision`: Quyết định của Tuấn (`APPROVED`, `REJECTED`, `MODIFIED`).
  - `rationale`: Lý do lựa chọn hoặc chỉ đạo điều chỉnh của Tuấn.
  - `timestamp`: Thời điểm ra quyết định.
  - `status`: Vòng đời hiện tại.

### 2.7. Khối 7: Product Review & Baseline Management (Nghiệm Thu & Đóng Băng Chuẩn)
- **Mục tiêu:** Đánh giá độ sẵn sàng của toàn bộ hành trình trước khi bàn giao sang công đoạn đóng gói chính thức.
- **Tiêu chí cổng đóng băng (Baseline Freezing Criteria):**
  - 100% Touchpoints trong hành trình đạt trạng thái `APPROVED` bởi Tuấn.
  - Không còn `CRITICAL DEFECTS` hoặc lỗi hiển thị trên 4 độ phân giải (375, 768, 1024, 1440px).
  - Toàn bộ Test Cases hồi quy vượt qua kiểm thử tự động.
  - Xuất ra tệp cấu hình đóng băng `Approved Baseline JSON` làm căn cứ nghiệm thu.

---

## 3. QUY TRÌNH QUẢN TRỊ QUYẾT ĐỊNH 5 BƯỚC (5-STAGE DECISION GOVERNANCE)

Mọi quyết định thiết kế trải nghiệm bắt buộc phải vận hành theo đúng chu trình 5 bước sau:

```text
[PROPOSED] ────────► [REVIEWED] ────────► [APPROVED] ────────► [IMPLEMENTED] ────────► [VERIFIED]
 (Đề xuất)            (Thẩm tra)          (Phê duyệt)           (Triển khai)          (Xác minh)
     │                     │                   │                     │                     │
  AI hoặc               Emarald              Tuấn                AGY / Cline            Playwright
   Tuấn                kiểm tra             duyệt                   viết mã             Automated
  khởi tạo             tiêu chuẩn         thực tế                   nội bộ                 Test
```

### Chi tiết các trạng thái:
1. `PROPOSED`:
   - AI hoặc Tuấn tạo một phương án chỉnh sửa (ví dụ: đổi nhãn menu, viết lại lời dẫn hero, thay đổi bố cục thẻ).
   - Phương án chỉ tồn tại dưới dạng đề xuất trong bản nháp Lab, chưa có hiệu lực pháp lý trong dự án.
2. `REVIEWED`:
   - Emarald kiểm tra tính tương thích với BRAND_GOVERNANCE, quy chuẩn nhận diện và ranh giới đạo đức nhân học (UNESCO 2003).
   - Đưa ra nhận xét độc lập cho Tuấn tham khảo.
3. `APPROVED`:
   - **Chỉ duy nhất Tuấn mới có quyền chuyển một đề xuất sang `APPROVED`.**
   - Đề xuất được lưu vết vào `Approved Configuration` của hệ thống.
4. `IMPLEMENTED`:
   - AGY hoặc Cline triển khai mã nguồn hoặc cập nhật cấu hình theo đúng biên bản đã duyệt.
   - Tuyệt đối không được thêm bớt tính năng ngoài phạm vi duyệt.
5. `VERIFIED`:
   - Chạy bộ kiểm thử tự động Playwright trên môi trường thật để đối soát.
   - Cung cấp bằng chứng định lượng (log, diff, screenshot) chứng minh mã nguồn hoạt động chính xác như phê duyệt.

---

## 4. QUY CHẾ BẢO VỆ MÔI TRƯỜNG & CHỐNG THĂNG CẤP TỰ ĐỘNG

```text
┌────────────────────────┐      Phê duyệt của Tuấn       ┌────────────────────────┐      Human Gate (Gate 6)      ┌────────────────────────┐
│       LAB DRAFT        │ ────────────────────────────► │   APPROVED BASELINE    │ ────────────────────────────► │       PRODUCTION       │
│ (Thử nghiệm tự do cục bộ)│       (Lưu vết cấu hình)     │  (Hợp đồng giao diện)  │      (Triển khai thật)        │   (Người dùng cuối)    │
└────────────────────────┘                               └────────────────────────┘                               └────────────────────────┘
```

- **Ranh giới bất khả xâm phạm:** Lab Draft **tuyệt đối không được tự động thăng cấp (auto-promotion)** lên Approved Baseline hay Production.
- Mọi promotion từ Lab Draft sang Approved Baseline đều phải thông qua hành động chủ động của Tuấn trên giao diện Studio.
- Mọi promotion từ Approved Baseline sang Production bắt buộc phải đi qua **Human Gate chính thức từ Tuấn** theo đúng quy định tại `AGENTS.md`.

