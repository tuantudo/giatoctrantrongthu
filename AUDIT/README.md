# TRUNG TÂM ĐIỀU HƯỚNG & QUẢN TRỊ TÀI LIỆU AUDIT
## (AUDIT GOVERNANCE & ARCHITECTURE NAVIGATION HUB)

**Mã tài liệu:** `AUDIT/README.md`  
**Dự án:** CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU (`giatoctrantrongthu.com`)  
**Thẩm quyền tối cao:** Tuấn (Human Final Authority / Product Owner)  
**Thẩm định kiến trúc & QC:** Emarald (Strategic Analysis / Quality Control)  
**Cơ quan thực thi:** AGY (Execution Coordinator / Primary Agent)  
**Chỉ thị gốc:** `DIRECTIVE: AUDIT DOCUMENTATION CONSOLIDATION`  
**Ngày cập nhật:** 2026-11-03  

---

## 1. TÀI LIỆU HIỆN HÀNH CÓ THẨM QUYỀN (CURRENT AUTHORITATIVE DOCUMENTS)

Đây là các tài liệu điều hành và kiến trúc chính thức đang có hiệu lực thi hành hoặc đang trong quá trình xem xét phê duyệt:

| Tên Tài Liệu & Đường Dẫn | Phiên Bản | Vai Trò & Thẩm Quyền | Trạng Thái Quản Trị |
| :--- | :---: | :--- | :---: |
| [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md) | `v4.0 Canonical` | **Kế hoạch Điều hành & Triển khai Sản phẩm Toàn diện**. Single Source of Truth cho 8 Batch, Vibecode Lab, Content Governance và WS08 (Kiến trúc mã nguồn). | **ACTIVE** (Chờ Tuấn kích hoạt Batch 01) |
| [`AUDIT/ARCHITECTURE_RECONCILIATION_REPORT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/ARCHITECTURE_RECONCILIATION_REPORT.md) | `v2.0 Canonical` | **Báo Cáo Đối Soát Kiến Trúc Mã Nguồn (R01 đến R06)**. Xử lý 100% phản biện của Emarald, bổ sung ma trận bằng chứng và khung an toàn chuyển đổi. | **COMPLETED** (Đã đối soát) |
| [`AUDIT/REVISED_SOURCE_CODE_TARGET_ARCHITECTURE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/REVISED_SOURCE_CODE_TARGET_ARCHITECTURE.md) | `v2.0 Canonical` | **Đặc Tả Kiến Trúc Đích Đã Đối Soát**. Chuẩn hóa 6 tầng tách biệt Client/Server runtime, 5 domain cores + 2 platform cores, tokens canonical. | **PENDING OWNER APPROVAL** |
| [`AUDIT/REVISED_SOURCE_CODE_MIGRATION_ROADMAP.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/REVISED_SOURCE_CODE_MIGRATION_ROADMAP.md) | `v2.0 Canonical` | **Lộ Trình Di Chuyển Tiệm Tiến Đã Đối Soát (MIG-01 đến MIG-08)**. Bổ sung bộ Characterization Parity Tests, tiêu chí hoàn nguyên cụ thể từng gói. | **PENDING OWNER APPROVAL** |
| [`AUDIT/WS08_MASTER_PLAN_CHANGE_PROPOSAL.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/WS08_MASTER_PLAN_CHANGE_PROPOSAL.md) | `v2.0 Canonical` | **Bản Đề Xuất Điều Chỉnh Canonical Master Plan v4.0**. Bản đồ phụ thuộc ngược xuôi với 8 Delivery Batches, các cột mốc chia sẻ và Human Gates. | **PENDING OWNER APPROVAL** |
| [`AUDIT/ADMIN_CONTROL_CENTER_ARCHITECTURE_v2.1.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/ADMIN_CONTROL_CENTER_ARCHITECTURE_v2.1.md) | `v2.1 Working` | **Đặc tả Kiến trúc Trung tâm Quản trị Thống nhất**. Xử lý toàn bộ 9 phản biện của Emarald (REV-01 đến REV-09). | **ACTIVE** (Đang trình Emarald & Tuấn review) |
| [`docs/product/PRODUCT_EXPERIENCE_SPECIFICATION_v1.0.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/product/PRODUCT_EXPERIENCE_SPECIFICATION_v1.0.md) | `v1.0 Canonical` | **Đặc tả Trải nghiệm Sản phẩm v1.0**. Nguồn chân lý cho 30 Touchpoints (TP-001 đến TP-030). | **ACTIVE** (Đã nghiệm thu Phase 1) |
| [`PRODUCT_SPECIFICATION_FINALIZATION_REPORT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/PRODUCT_SPECIFICATION_FINALIZATION_REPORT.md) | `v1.0 Checkpoint` | Báo cáo hoàn tất nghiệm thu Product Specification v1.0. | **ACTIVE** (Checkpoint chính thức) |

---

## 2. TRẠNG THÁI CÁC QUYẾT ĐỊNH CHIẾN LƯỢC (CURRENT DECISION STATUS)

### 2.1 Các Quyết Định Thuộc Nhóm Quản Trị Trung Tâm (Admin Control Center)
- **`DEC-A01` (Admin Core Foundation):** `APPROVED IN PRINCIPLE`. Giữ `/admin` làm hạt nhân duy nhất; nhúng Vibecode Lab thành module `Design & Experience` (`#/lab`). Không tạo Admin thứ hai.
- **`DEC-A02` (Identity & Account Model):** `APPROVED IN PRINCIPLE`. Tiếp tục duy trì riêng 3 thực thể: `admin_users` (quản trị), `accounts` (thành viên), `identity_mappings` (nhân thân). Identity Mapping $\neq$ Permission Mapping. Chưa hợp nhất CSDL.
- **`DEC-A04` (MẠCH Editorial Pipeline):** `APPROVED IN PRINCIPLE`. Sử dụng Markdown + Split Preview song song; bắt buộc có pipeline khử độc DOMPurify 2 đầu và URL allowlist.

### 2.2 Các Quyết Định Thuộc Nhóm Sản Phẩm & Lộ Trình (Master Plan)
- **`DEC-01` đến `DEC-11`:** `APPROVED`. Bảo toàn Product Baseline, 3 vùng bảo mật, 7 Không gian UI vNEXT, 8 Batch triển khai tuần tự, tích hợp Vibecode Lab và mô hình Content Governance 5 nhóm.

---

## 3. CÁC QUYẾT ĐỊNH CÒN MỞ (OPEN DECISIONS — CHỜ TUẤN PHÊ DUYỆT)

1. **`DEC-A03` (Cơ chế lưu trữ Homepage Copy & Thẻ Mời Cửa Ngõ):**
   - *Hiện trạng:* Toàn bộ text đang bị hardcode trong `src/js/ui/public-home.js`.
   - *Phương án A:* Lưu file JSON trong Git (`content/public_home.json`).
   - *Phương án B:* Bảng Key-Value trong SQLite (`cms_content`).
   - *Phương án C (Khuyến nghị của AGY):* Bảng Document Section trong SQLite (`cms_documents`) có hỗ trợ lưu vết phiên bản (Versioning).
   - *Trạng thái:* `OPEN` — Chờ chỉ đạo chính thức từ Tuấn.
2. **`DEC-12` đến `DEC-15` (Ranh giới riêng tư người vị thành niên & người đã mất):**
   - Tạm thời áp dụng chốt an toàn kỹ thuật: `Restrict by default` (Giấu mặc định ngày sinh/SĐT của người còn sống, bảo vệ tuyệt đối Thư riêng Clara).
   - *Trạng thái:* `OPEN` — Chờ quyết định chính sách từ Tuấn ở Phase 4.

---

## 4. CÔNG VIỆC CHỜ TRIỂN KHAI (PENDING WORK — BATCH 01 NOW TIER)

Ngay sau khi Tuấn phê duyệt Kiến trúc Admin v2.1 và kích hoạt triển khai, các đầu việc ưu tiên của Batch 01 sẵn sàng thực thi:
1. **`W-B01-01`**: Đóng 4 cửa ngõ công khai (`#/mach`, `#/gia-pha`, `#/lich`, `#/tim-kiem`) bằng Thẻ Mời Cửa Ngõ (`InvitationGatewayCard`) trang trọng.
2. **`LAB-01`**: Ổn định và chuẩn hóa Vibecode Lab (`lab.html`, `src/js/ui/lab.js`), dọn sạch lỗi console trên cả 7 không gian.
3. **`CONTENT-01`**: Kiểm kê và phân loại kho chuỗi chữ hardcode trên UI theo mô hình quản trị 5 nhóm nội dung.
4. **`W-B01-02`**: Xây dựng modal kích hoạt và đăng nhập thành viên (Member Onboarding & Activation) trên Lab.

---

## 5. DANH MỤC TÀI LIỆU THAM CHIẾU KỸ THUẬT & BẰNG CHỨNG (REFERENCE DOCUMENTS)

Các tài liệu dưới đây được lưu giữ tại thư mục `AUDIT/` và `docs/audit/` làm bằng chứng pháp lý và cơ sở đối soát kỹ thuật:

### 5.1 Tài Liệu Bằng Chứng Trong Thư Mục `AUDIT/` (15 Tài liệu)
- [`AUDIT/FRONTEND_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/FRONTEND_COMPLETION_PLAN.md): Tài liệu kế hoạch frontend cơ sở (Được kiểm tra bởi `scripts/verify_governance.py`).
- [`AUDIT/PHASE_1_FINALIZATION_REMEDIATION_REPORT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/PHASE_1_FINALIZATION_REMEDIATION_REPORT.md): Bằng chứng khắc phục 5 nhóm lỗi Phase 1.
- [`AUDIT/POST_REMEDIATION_VERIFICATION_REPORT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/POST_REMEDIATION_VERIFICATION_REPORT.md): Báo cáo kiểm chứng độc lập xác nhận Spec v1.0 đạt chuẩn QC.
- [`AUDIT/CURRENT_STATE_AUDIT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/CURRENT_STATE_AUDIT.md): Báo cáo khảo sát toàn diện hiện trạng hệ thống ngày 03/11/2026.
- [`AUDIT/VIBECODE_LAB_GAP_ANALYSIS.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/VIBECODE_LAB_GAP_ANALYSIS.md): Phân tích khoảng trống năng lực của Vibecode Lab so với quy trình thiết kế.
- [`AUDIT/VIBECODE_VISUAL_EDITOR_NAVIGATOR_AUDIT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/VIBECODE_VISUAL_EDITOR_NAVIGATOR_AUDIT.md): Bằng chứng kiểm thử Playwright chứng minh hiện tượng Zero Persistence của bộ sửa nhanh.
- [`AUDIT/REPOSITORY_AUDIT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/REPOSITORY_AUDIT.md): Báo cáo khảo sát pháp y toàn diện repository ngày 31/10/2026.
- [`AUDIT/SECURITY_EXPOSURE_VERIFICATION.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/SECURITY_EXPOSURE_VERIFICATION.md): Bằng chứng rà quét và cô lập 8 lỗ hổng an ninh (CF-01 đến CF-08).
- [`AUDIT/SECURITY_CONTAINMENT_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/SECURITY_CONTAINMENT_PLAN.md): Kế hoạch phòng tỏa và bảo vệ an ninh thông tin.
- [`AUDIT/PRE_CLEANUP_SAFETY_REVIEW.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/PRE_CLEANUP_SAFETY_REVIEW.md): Báo cáo thẩm định an toàn trước dọn dẹp kho lưu trữ.
- [`AUDIT/FAMILYSEARCH_SOURCE_INVENTORY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/FAMILYSEARCH_SOURCE_INVENTORY.md): Kiểm kê kho dữ liệu nguồn FamilySearch và đối soát cây gia phả.
- [`AUDIT/ARCHITECTURE_DISCOVERY_RELATIONAL_IDENTITY_PRIVACY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/ARCHITECTURE_DISCOVERY_RELATIONAL_IDENTITY_PRIVACY.md): Khảo sát kiến trúc định danh quan hệ huyết thống và bảo vệ dữ liệu riêng tư Phase 4.
- [`AUDIT/FAMILY_COMMUNITY_NETWORK_ALIGNMENT_REPORT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/FAMILY_COMMUNITY_NETWORK_ALIGNMENT_REPORT.md): Báo cáo mô hình mạng lưới cộng đồng gia tộc.
- [`AUDIT/BATCH_02A_REAL_CONTENT_INVENTORY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/BATCH_02A_REAL_CONTENT_INVENTORY.md): Kiểm kê kho tư liệu và bài viết MẠCH thực tế.
- [`AUDIT/PRODUCT_RECONCILIATION_AUDIT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/PRODUCT_RECONCILIATION_AUDIT.md): Báo cáo đối soát sản phẩm và sự tiến hóa tính năng.

### 5.2 Kho Bằng Chứng Lịch Sử Phase 0 Tại `docs/audit/` (47 Tài liệu)
Thư mục [`docs/audit/`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/audit/) lưu giữ toàn bộ 47 báo cáo khảo sát và thư mục ảnh chứng thực `evidence/` từ giai đoạn sơ khai (Đầu tháng 10/2026), bao gồm các báo cáo về Design System v0.1, Brand Governance, và các biên bản kiểm thử ban đầu. Thư mục này được bảo tồn nguyên vẹn để phục vụ tra cứu lịch sử kiến trúc.

---

## 6. DANH MỤC TÀI LIỆU LỊCH SỬ ĐÃ LƯU TRỮ (ARCHIVE INDEX — `AUDIT/archive/`)

Toàn bộ **28 tài liệu lịch sử** đã được thay thế hoặc hoàn thành sứ mệnh đã được di chuyển an toàn vào thư mục [`AUDIT/archive/`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/archive/) (Không có file nào bị xóa):

| Tên File Đã Lưu Trữ | Lý Do Phân Loại & Tài Liệu Thay Thế |
| :--- | :--- |
| `ADMIN_CONTROL_CENTER_ARCHITECTURE_v2.md` | `SUPERSEDED` — Đã được nâng cấp và thay thế toàn diện bởi `ADMIN_CONTROL_CENTER_ARCHITECTURE_v2.1.md`. |
| `ADMIN_CONTROL_CENTER_AUDIT.md` | `SUPERSEDED` — Bản khảo sát sơ bộ v1.0, đã được tích hợp vào kiến trúc v2.1. |
| `AGENT_OPERATING_SYSTEM_IMPLEMENTATION.md`| `SUPERSEDED` — Quy chế AIOS ban đầu, đã được chuẩn hóa vào `AGENTS.md` và `.agents/skills/`. |
| `AGY_AUTONOMOUS_CONTINUATION_REPORT.md` | `SUPERSEDED` — Báo cáo phiên làm việc ngày 02/11/2026, đã hết hiệu lực điều hành. |
| `BACKEND_EXECUTION_AUDIT.md` | `SUPERSEDED` — Đã được thay thế bởi `CURRENT_STATE_AUDIT.md`. |
| `BATCH_01_LOCAL_MIRROR_COMPLETION_REPORT.md`| `SUPERSEDED` — Báo cáo nghiệm thu Batch 01 (Mirror cũ), công việc đã hoàn thành. |
| `BATCH_02B_DYNAMIC_CONTENT_RENDERING_REPORT.md`| `SUPERSEDED` — Báo cáo kiểm thử render động Batch 02B, đã hoàn thành. |
| `BATCH_02C_VIBECODE_REAL_CONTENT_REPORT.md`| `SUPERSEDED` — Báo cáo thử nghiệm nội dung thật Batch 02C, đã hoàn thành. |
| `BATCH_02_VIBECODE_LAB_ACTIVATION_REPORT.md`| `SUPERSEDED` — Báo cáo kích hoạt Lab cũ, đã được thay thế bởi quy trình trong Master Plan v4.0. |
| `CHANGELOG_AND_SUPERSESSION_MAP.md` | `SUPERSEDED` — Bảng phân loại cũ, đã được hợp nhất vào `AUDIT/README.md`. |
| `CLINE_IMPLEMENTATION_FAILURE_DIAGNOSIS.md`| `SUPERSEDED` — Phân tích lỗi của Cline ngày 02/11, đã được khắc phục hoàn toàn trong đợt recovery. |
| `CLINE_PUBLIC_HOMEPAGE_IMPLEMENTATION_REPORT.md`| `SUPERSEDED` — Báo cáo dở dang của Cline, đã được thay thế bởi bản chuẩn trong `public-home.js`. |
| `CURRENT_WORK_SESSION_HANDOFF.md` | `SUPERSEDED` — Biên bản bàn giao phiên cũ ngày 31/10/2026. |
| `DISCOURSE_ALIGNMENT_HANDOFF.md` | `SUPERSEDED` — Biên bản bàn giao không gian MẠCH ngày 02/11/2026. |
| `EXECUTION_EVIDENCE_RECONCILIATION.md` | `DUPLICATE` — Tệp rỗng 0-byte tạo nhầm ngày 02/11/2026. |
| `FRONTEND_PROGRESS_AUDIT.md` | `SUPERSEDED` — Báo cáo tiến độ frontend ngày 31/10/2026. |
| `FRONTEND_SLICE_01_REPORT.md` | `SUPERSEDED` — Báo cáo phân mảnh frontend ngày 02/11/2026. |
| `GOVERNANCE_VISUAL_VALIDATION.md` | `SUPERSEDED` — Báo cáo kiểm chứng giao diện ngày 31/10/2026. |
| `IMPLEMENTATION_ROADMAP.md` | `SUPERSEDED` — Lộ trình cũ, đã được thay thế chính thức bởi `MASTER_COMPLETION_PLAN.md` v4.0. |
| `LIVE_PRODUCT_REVIEW_AND_PLAN_RECONCILIATION.md`| `SUPERSEDED` — Biên bản đối soát ngày 01/11/2026. |
| `MACH_M01_COMPLETION_REPORT.md` | `SUPERSEDED` — Báo cáo hoàn thành bài M01 ngày 01/11/2026. |
| `MACH_SYSTEM_EXECUTION_PLAN.md` | `SUPERSEDED` — Kế hoạch MẠCH cũ, đã được tích hợp vào Master Plan v4.0. |
| `MASTER_PLAN_RESTRUCTURE_REPORT.md` | `SUPERSEDED` — Báo cáo tái cấu trúc kế hoạch ngày 01/11/2026. |
| `MASTER_PLAN_V2_REVISION_REPORT.md` | `SUPERSEDED` — Báo cáo điều chỉnh kế hoạch v2 ngày 02/11/2026. |
| `PRODUCT_EXECUTION_REPORT.md` | `SUPERSEDED` — Báo cáo thực thi sản phẩm ngày 02/11/2026. |
| `PUBLIC_HOMEPAGE_IMPLEMENTATION_RECOVERY.md`| `SUPERSEDED` — Báo cáo khôi phục trang chủ công khai ngày 02/11/2026. |
| `REPOSITORY_GOVERNANCE_IMPLEMENTATION_REPORT.md`| `SUPERSEDED` — Báo cáo triển khai quản trị repo ngày 02/11/2026. |
| `STAGE_1_ACCEPTANCE_STAGE_2_READINESS_REPORT.md`| `SUPERSEDED` — Báo cáo nghiệm thu Stage 1 ngày 02/11/2026. |

---

## 7. LIÊN KẾT NGUỒN QUẢN TRỊ CỐT LÕI (CORE GOVERNANCE LINKS)

- **Quy chế hoạt động tối cao của các Agent:** [`AGENTS.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AGENTS.md)
- **Quy chuẩn nhận diện thương hiệu:** [`brand/BRAND_GOVERNANCE_v0.1.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/brand/BRAND_GOVERNANCE_v0.1.md)
- **Kiến trúc truyền thông công khai:** [`docs/architecture/PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/architecture/PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md)
- **Bộ kỹ năng chuẩn hóa của Agent:** [`.agents/skills/`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/.agents/skills/)

---

*Trung tâm Điều hướng & Quản trị Tài liệu Audit là đầu mối tra cứu thông tin chính thức, duy nhất và bất biến của dự án.*

