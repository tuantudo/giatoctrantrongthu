# SỔ TAY TÀI LIỆU QUY CHUẨN (CANONICAL DOCUMENT REGISTRY)
**Hệ thống Quản trị Tri thức — CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU**

> **Trạng thái:** CANONICAL / ACTIVE  
> **Cơ quan quản trị:** AGY (Execution Coordinator) & Emarald (Analysis Authority)  
> **Thẩm quyền phê duyệt tối cao:** Tuấn (Human Final Authority)  
> **Phiên bản:** v1.0 (Ban hành: 02/11/2026)  
> **Nguyên tắc cốt lõi:** *Mỗi chủ đề kỹ thuật và nghiệp vụ chỉ có DUY NHẤT MỘT tài liệu quy chuẩn (Single Source of Truth - SoT). Mọi tài liệu khác phải tham chiếu đến tài liệu này hoặc được phân loại là tài liệu lịch sử, bằng chứng kiểm thử.*

---

## 1. BẢNG DANH MỤC TÀI LIỆU QUY CHUẨN (CANONICAL REGISTRY TABLE)

| Miền Tri Thức (Domain) | Tài Liệu Quy Chuẩn (Canonical SoT) | Chủ Sở Hữu (Owner) | Thẩm Quyền Phê Duyệt | Trạng Thái | Mô Tả Phạm Vi & Bất Biến (Scope & Invariants) |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **Thẩm Quyền & Mô Hình Vận Hành** | [`AGENTS.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AGENTS.md) | Emarald | Tuấn | `ACTIVE` | Quản trị tối cao toàn bộ dự án. Định nghĩa mô hình Primary Agent (AGY), Specialized Resource (Cline), 6 Human Gates, 8 Skills bắt buộc và các hành vi cấm kỵ. |
| **Ý Định Sản Phẩm & Chỉ Thị Cốt Lõi** | [`USER.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/USER.md) | Tuấn | Tuấn | `ACTIVE` | Ý định của người sáng lập, các chỉ thị bất khả xâm phạm về bảo tồn di sản dòng họ, nhận diện thương hiệu, và ranh giới quyền riêng tư. |
| **Tư Liệu Nền Tảng & Phỏng Vấn Sáng Lập** | [`docs/product/FOUNDER_STORY_AND_PRODUCT_DISCOVERY_INTERVIEW.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/product/FOUNDER_STORY_AND_PRODUCT_DISCOVERY_INTERVIEW.md) | Tuấn / Emarald | Tuấn | `ACTIVE` (v1.0) | Tư liệu nguồn phỏng vấn người sáng lập: Động cơ cá nhân tìm về cội nguồn, hình dung 'nhà thờ tổ online', ranh giới huyết thống vs sự thuộc về, và các nguyên tắc nội dung không tô hồng. |
| **Kế Hoạch Tổng Thể & Lộ Trình** | [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md) | AGY | Tuấn | `ACTIVE` (v2.0) | Lộ trình 5 Phase hoàn thiện sản phẩm V1.0. Lấy website sống làm baseline. Tách chốt chặn GATE-01A/B. |
| **Kế Hoạch Giao Diện & Trải Nghiệm** | [`AUDIT/FRONTEND_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/FRONTEND_COMPLETION_PLAN.md) | AGY / Cline | Tuấn | `ACTIVE` (v2.0) | Lộ trình hoàn thiện 4 cửa ngõ thành viên, hệ thống component UI vNEXT, và quy trình nghiệm thu Vibecode Lab. |
| **Bản Đồ Thay Thế & Đối Soát Nhiệm Vụ** | [`AUDIT/CHANGELOG_AND_SUPERSESSION_MAP.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/CHANGELOG_AND_SUPERSESSION_MAP.md) | AGY | Emarald / Tuấn | `ACTIVE` (v2.0) | Bảng tra cứu lịch sử thay thế task, ánh xạ 8 lỗ hổng an ninh CF-01..CF-08, và phân loại 3 bản backup CSDL. |
| **Quy Chuẩn Nhận Diện & Thiết Kế** | [`brand/BRAND_GOVERNANCE_v0.1.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/brand/BRAND_GOVERNANCE_v0.1.md) | Emarald | Tuấn | `ACTIVE` | Hệ thống màu sắc (Crimson/Amber/Slate), Typography (Cinzel, Be Vietnam Pro, Playfair Display), Lưới layout và Logo dòng họ. |
| **Đặc Tả Hệ Thống Giao Diện (UI System)** | [`docs/design/GIATOC_UI_SYSTEM_vNEXT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/design/GIATOC_UI_SYSTEM_vNEXT.md) | Cline / AGY | Emarald | `ACTIVE` | Đặc tả kỹ thuật các token CSS, components (`masthead`, `hero`, `card`, `tree-node`), và trạng thái phản hồi responsive. |
| **Bản Đồ Cấu Trúc Kho Mã Nguồn** | [`docs/REPOSITORY_MAP.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/REPOSITORY_MAP.md) | AGY | Emarald | `ACTIVE` | Phân quyền sở hữu thư mục, trách nhiệm module, điểm khởi nhập (entrypoints), luồng dữ liệu và trạng thái nhận thức. |
| **Quản Trị Tri Thức & Tra Cứu Nhanh** | [`docs/HELP.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/HELP.md) | AGY | Emarald | `ACTIVE` | Điểm tra cứu đầu tiên (FAQ), giải đáp các câu hỏi kỹ thuật chuẩn hóa, ghi nhận mâu thuẫn và điểm chưa rõ (Unknowns). |
| **Quy Trình Quản Trị Thay Đổi** | [`docs/CHANGE_GOVERNANCE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/CHANGE_GOVERNANCE.md) | AGY | Tuấn | `ACTIVE` | Quy trình 8 bước: PROPOSE → SCOPE → EVIDENCE → APPROVE → IMPLEMENT → TEST → DOCUMENT → VERIFY. |
| **Quy Chuẩn Phối Hợp Tác Nhân (Agents)** | [`docs/AGENT_GOVERNANCE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/AGENT_GOVERNANCE.md) | AGY | Emarald | `ACTIVE` | Hướng dẫn hành vi chi tiết cho AGY, OpenCode, Cline; nguyên tắc handoff và danh sách kiểm tra trước khi thực thi. |
| **Lịch Sử Tiến Hóa Sản Phẩm** | [`docs/PRODUCT_HISTORY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/PRODUCT_HISTORY.md) | Emarald | Tuấn | `ACTIVE` | Biên niên sử ghi nhận trung thực 6 thời kỳ phát triển của hệ thống từ ứng dụng Lịch đến Mạng lưới cộng đồng gia đình. |
| **Mô Hình Thực Thể & Phả Hệ (Domain)** | [`docs/architecture/DOMAIN_MODEL.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/architecture/DOMAIN_MODEL.md) | AGY | Tuấn | `ACTIVE` | Định nghĩa thực thể: Person, Family, Timeline, Media, Memory, Story, Edge (ReBAC). |
| **Kiến Trúc Truyền Thông Public** | [`docs/architecture/PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/architecture/PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md) | Tuấn / Emarald | Tuấn | `ACTIVE` (v1.0) | Định nghĩa bản chất truyền thông, chủ thể phát ngôn (Tuấn), ranh giới Di sản dòng họ vs PUBLIC vs MẠCH, 3 tầng thông điệp, 6 lĩnh vực diễn ngôn, 6 khu vực trang chủ và 4 trạng thái nhận thức. |
| **Kiến Trúc Quản Trị Nội Dung (CMS/DB/Config/Code)** | [`docs/architecture/CONTENT_MANAGEMENT_ARCHITECTURE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/architecture/CONTENT_MANAGEMENT_ARCHITECTURE.md) | OpenCode / AGY | Tuấn | `ACTIVE` (v1.0) | Phân định ranh giới 4 lớp (ADMIN/CMS, DATABASE, CONFIGURATION, CODE) cho 11 nhóm nội dung; quy định vòng đời nội dung, phân quyền biên tập và 5 kịch bản cập nhật không chạm mã nguồn. |
| **Đặc Tả An Ninh & Riêng Tư (Clara/ReBAC)** | [`AUDIT/ARCHITECTURE_DISCOVERY_RELATIONAL_IDENTITY_PRIVACY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/ARCHITECTURE_DISCOVERY_RELATIONAL_IDENTITY_PRIVACY.md) | AGY | Tuấn | `ACTIVE` | Đặc tả cô lập không gian Thư Clara, phân quyền quan hệ theo chi nhánh (Branch-scoped access control). |

---

## 2. QUY TẮC THAY THẾ VÀ LƯU TRỮ (SUPERSESSION & ARCHIVAL RULES)

1. **Nguyên tắc "Một Chủ Thể — Một Tiếng Nói":** Không duy trì hai tài liệu cùng mô tả một phân hệ kỹ thuật mà không có quan hệ kế thừa hoặc tham chiếu rõ ràng.
2. **Quy trình gắn nhãn tài liệu bị thay thế (Superseded Marking):**
   - Khi một tài liệu mới được ban hành để thay thế tài liệu cũ, tài liệu cũ **KHÔNG ĐƯỢC XÓA TÙY TIỆN**.
   - Phần đầu của tài liệu cũ phải được chèn Header cảnh báo:
     ```text
     > [!WARNING] TÀI LIỆU ĐÃ BỊ THAY THẾ (SUPERSEDED)
     > Tài liệu này đã được thay thế bởi [Tên Tài Liệu Mới](duong-dan-moi) vào ngày DD/MM/YYYY.
     > Chỉ giữ lại với mục đích lưu trữ lịch sử pháp y. KHÔNG sử dụng làm căn cứ kỹ thuật.
     ```
3. **Phân loại vào thư mục lưu trữ (`docs/archive/`):**
   - Các tài liệu thuộc các giai đoạn trước (tháng 9/2026 trở về trước) hoặc các bản phân tích nhiệm vụ đã hoàn thành phải được di chuyển có kiểm soát vào các thư mục con tương ứng trong `docs/archive/` (`architecture/`, `design/`, `missions/`, `operations/`).

---

## 3. QUY TẮC CẬP NHẬT TÀI LIỆU KHI MÃ NGUỒN THAY ĐỔI (SYNC PROTOCOL)

| Loại Thay Đổi Mã Nguồn (Code Change) | Tài Liệu Bắt Buộc Cập Nhật | Trách Nhiệm Cập Nhật | Chốt Chặn Kiểm Tra |
| :--- | :--- | :--- | :--- |
| **Thêm / Sửa / Xóa Route Backend API** (`server/index.js`, `server/member.js`) | `docs/architecture/CURRENT_ARCHITECTURE.md`, `docs/HELP.md` | AGY | Chạy skill `api-contract-validation` trước khi nghiệm thu. |
| **Sửa đổi Cấu trúc CSDL / DDL** (`server/schema_update.sql`, tables) | `docs/database/`, `docs/CANONICAL_DOCUMENT_REGISTRY.md` | AGY | Cần **GATE-02** phê duyệt từ Tuấn. |
| **Sửa đổi Design Tokens / CSS Foundation** (`src/css/foundation/`) | `brand/BRAND_GOVERNANCE_v0.1.md`, `docs/design/GIATOC_UI_SYSTEM_vNEXT.md` | Cline / AGY | Chạy skill `browser-qa` nghiệm thu 4 viewports. |
| **Thay đổi Cấu hình Hạ tầng / Triển khai** (`vercel.json`, ports) | `docs/REPOSITORY_MAP.md`, `docs/HELP.md` | AGY | Kiểm tra tương thích CDN trước khi cập nhật. |
| **Hoàn thành một Task trong Lộ trình** | `AUDIT/MASTER_COMPLETION_PLAN.md`, `AUDIT/CHANGELOG_AND_SUPERSESSION_MAP.md` | AGY | Cập nhật trạng thái `[DONE]` kèm checksum commit bằng chứng. |

---

## 4. QUY TRÌNH GIẢI QUYẾT XUNG ĐỘT TÀI LIỆU (CONFLICT RESOLUTION PROTOCOL)

Khi phát hiện mâu thuẫn giữa hai tài liệu hoặc giữa tài liệu và mã nguồn:

```text
                           PHÁT HIỆN XUNG ĐỘT
                                   │
                                   ▼
        [Áp dụng Hệ Thống Cấp Bậc Bằng Chứng (Evidentiary Hierarchy)]
        1. Bằng chứng kiểm thử thực tế (PROVEN Test Runs / SHA-256)
        2. Dữ liệu thực tế trong CSDL / Live Network Response
        3. Mã nguồn thực thi (Working Code in Server / Client)
        4. Tài liệu Canonical quy định tại Registry này
        5. Các tài liệu phụ trợ, biên bản nháp, đề xuất cũ
                                   │
                                   ▼
        Xung đột có thể tự làm rõ dựa trên Bằng chứng Cấp 1-3?
        ├── YES ──> Cập nhật tài liệu yếu hơn theo Bằng chứng thực tế
        └── NO  ──> Đưa vào mục UNKNOWN/BLOCKER trình Tuấn & Emarald quyết định
```

---
*Tài liệu thuộc hệ thống quản trị tối cao GIATOC AIOS. Mọi sửa đổi phải được sự đồng thuận của Emarald và phê duyệt từ Tuấn.*
