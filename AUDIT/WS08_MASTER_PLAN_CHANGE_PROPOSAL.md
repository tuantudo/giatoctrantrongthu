# BẢN ĐỀ XUẤT ĐIỀU CHỈNH CANONICAL MASTER PLAN v4.0
## (WS08 MASTER PLAN CHANGE PROPOSAL)

- **Mã tài liệu:** `AUDIT/WS08_MASTER_PLAN_CHANGE_PROPOSAL.md`
- **Đường dẫn canonical:** `AUDIT/WS08_MASTER_PLAN_CHANGE_PROPOSAL.md`
- **Tài liệu tham chiếu:** [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md) (v4.0 Canonical)
- **Tài liệu đối soát:** [`AUDIT/ARCHITECTURE_RECONCILIATION_REPORT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/ARCHITECTURE_RECONCILIATION_REPORT.md)
- **Chỉ thị:** `# DIRECTIVE: WS08 ARCHITECTURE RECONCILIATION`
- **Dự án:** CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU (`giatoctrantrongthu.com`)
- **Product Owner / Thẩm quyền tối cao:** Tuấn
- **Thẩm định kiến trúc & QC:** Emarald
- **Đơn vị điều phối & thực thi:** AGY (Primary Agent)
- **Thời điểm lập đề xuất:** 2026-11-03T23:22:00+07:00

---

## 1. MỤC ĐÍCH & PHẠM VI ĐỀ XUẤT (PROPOSAL OBJECTIVE & SCOPE)

Bản đề xuất này cung cấp phương án điều chỉnh chi tiết, chính xác và có thể kiểm chứng đối với **Mục 6: WORKSTREAM KIẾN TRÚC & HIỆN ĐẠI HÓA MÃ NGUỒN (WS08)** trong tài liệu quản trị tối cao [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md).

Mục tiêu là:
1. Đồng bộ hóa toàn bộ các điểm đối soát `R01` đến `R06` vào văn kiện Master Plan.
2. Thiết lập bản đồ phụ thuộc ngược xuôi (Upstream / Downstream) giữa WS08 và 8 Delivery Batches (`B-01` đến `B-08`).
3. Khẳng định nguyên tắc đồng hành không chặn (Non-blocking enablement), bảo toàn 100% các cam kết tiến độ và phạm vi sản phẩm đã được Tuấn phê duyệt.
4. Trình Tuấn phê duyệt trước khi áp dụng bất kỳ thay đổi nào vào mã nguồn.

---

## 2. MA TRẬN ĐỐI SOÁT TOÀN DIỆN VỚI 6 TRỤ CỘT MASTER PLAN

| Trụ Cột Master Plan | Điểm Tiếp Xúc Của WS08 | Tác Động & Cam Kết Bảo Toàn Của WS08 | Mức Độ Kiểm Chứng |
| :--- | :--- | :--- | :---: |
| **1. Product & Experience Architecture** | Bốn bề mặt: Public Web, Member Space, Admin, Vibecode Lab. | Bảo toàn nguyên vẹn trải nghiệm 30 Touchpoints (`TP-001` đến `TP-030`). Không làm thay đổi bất kỳ hành vi hoặc luồng người dùng nào. | `PROVEN` |
| **2. Domain & Data Platform** | 5 Domain Cores (`genealogy`, `kinship`, `editorial`, `calendar`, `archive`) & 2 Platform Cores (`identity`, `content`). | Tách biệt hoàn toàn logic nghiệp vụ ra khỏi DOM; cung cấp `DataService` cho phép chạy cả Live API và Synthetic Mock mà không sửa code. | `PROVEN` |
| **3. Admin Control Center** | Phân hệ quản trị `admin/` và module hóa v2.1. | Nhúng năng lực xem trước của Lab thành phân hệ `#/lab` trong Admin; đồng bộ Design Tokens thương hiệu; triệt tiêu hoàn toàn nguy cơ XSS qua DOMPurify. | `TESTED` |
| **4. Infrastructure & Security** | Máy chủ Node.js/Express 5, SQLite, MariaDB, bảo vệ Thư Clara. | Tách nhỏ `server/index.js` thành các route độc lập; duy trì 100% chốt an toàn (CSRF 3 lớp, session HttpOnly, rate limiter); bảo vệ tuyệt đối ranh giới Thư Clara. | `TESTED` |
| **5. Quality & Governance** | Tiêu chuẩn bàn giao 10 mục, cơ chế Human Gates. | Áp dụng Khung an toàn 4 lớp (Pre-migration Characterization Tests, Shadow Extraction, Parity Tests, Atomic Rollback). | `PROVEN` |
| **6. Delivery Batches (B-01 đến B-08)** | Cung cấp nền tảng mã nguồn sạch cho từng Batch. | `SC-01..04` chạy song hành ở pha NOW phục vụ `B-01..03`; `SC-05..07` chạy ở pha NEXT phục vụ `B-04..07`; `SC-08` đóng gói cùng `B-08`. | `PROVEN` |

---

## 3. BẢN ĐỒ PHỤ THUỘC & CỘT MỐC CHIA SẺ VỚI 8 DELIVERY BATCHES

### 3.1 Ma Trận Phụ Thuộc Chi Tiết

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                 MA TRẬN PHỤ THUỘC GIỮA WS08 VÀ 8 DELIVERY BATCHES           │
├─────────────┬─────────────────┬───────────────────┬─────────────────────────┤
│ MÃ BATCH    │ NHẬN TỪ WS08    │ PHỤ THUỘC VÀO     │ TÍNH CHẤT CHUYỂN GIAO   │
│             │ (DOWNSTREAM)    │ SUB-PLAN NÀO?     │                         │
├─────────────┼─────────────────┼───────────────────┼─────────────────────────┤
│ BATCH 01    │ Tokens chuẩn &  │ SC-02 (Tokens)    │ KHÔNG CHẶN (Song hành). │
│ (Cổng Vào)  │ DataService     │ SC-04 (DataServ)  │ Dùng mock fixture trước.│
├─────────────┼─────────────────┼───────────────────┼─────────────────────────┤
│ BATCH 02    │ Kinship Rules & │ SC-03 (Kinship &  │ KHÔNG CHẶN (Song hành). │
│ (Hồ Sơ)     │ Epistemic Badges│ Editorial domain) │ Nối logic tính toán xưng│
│             │                 │                   │ hô chuẩn Việt Nam.      │
├─────────────┼─────────────────┼───────────────────┼─────────────────────────┤
│ BATCH 03    │ Tree Builder    │ SC-03 (Genealogy  │ KHÔNG CHẶN (Song hành). │
│ (Cây Phả Hệ)│ Algorithm       │ tree algorithm)   │ Tách biệt SVG render    │
│             │                 │                   │ khỏi thuật toán phân thế│
├─────────────┼─────────────────┼───────────────────┼─────────────────────────┤
│ BATCH 04    │ Media Metadata &│ SC-03 (Archive)   │ Phụ thuộc SC-05 để nối  │
│ (Kho Kỷ Vật)│ Live API Upload │ SC-05 (Backend)   │ upload API thật an toàn.│
├─────────────┼─────────────────┼───────────────────┼─────────────────────────┤
│ BATCH 05    │ Editorial Engine│ SC-03 (Editorial) │ Dùng Admin v2.1 làm     │
│ (MẠCH Tri   │ & Duyệt bài     │ SC-06 (Admin Ctr) │ giao diện quản trị và   │
│  Thức)      │ Markdown        │                   │ duyệt bài viết MẠCH.    │
├─────────────┼─────────────────┼───────────────────┼─────────────────────────┤
│ BATCH 06    │ Spaces Router & │ SC-03 (Kinship)   │ Áp dụng ReBAC phân quyền│
│ (Gia Đình)  │ ReBAC Guard     │ SC-05 (Backend)   │ truy cập không gian con.│
├─────────────┼─────────────────┼───────────────────┼─────────────────────────┤
│ BATCH 07    │ Âm Lịch Engine  │ SC-03 (Calendar)  │ Kế thừa module Lịch và  │
│ (Lịch & Tìm)│ & Search API    │ SC-05 (Backend)   │ tích hợp tìm kiếm phân  │
│             │                 │                   │ quyền an toàn.          │
├─────────────┼─────────────────┼───────────────────┼─────────────────────────┤
│ BATCH 08    │ Hệ thống hoàn   │ SC-08 (Tech Debt  │ CÙNG ĐÓNG GÓI V1.0.     │
│ (Tích Hợp)  │ chỉnh đạt DoD   │ Closure & E2E)    │ Thẩm định toàn diện để  │
│             │                 │                   │ trình Tuấn tại GATE-06. │
└─────────────┴─────────────────┴───────────────────┴─────────────────────────┘
```

### 3.2 Các Cột Mốc Chia Sẻ & Chốt Chặn Phê Duyệt (Milestones & Human Gates)
1. **CỘT MỐC M1 (Hoàn thành Nền tảng NOW):**
   - *Thời điểm:* Kết thúc `SC-01`, `SC-02`, `SC-03`, `SC-04` và `Batch 01`, `Batch 02`, `Batch 03`.
   - *Chốt chặn phê duyệt:* **`GATE-03`** — Tuấn trực tiếp nghiệm thu trải nghiệm Cây phả hệ Me-Centric, Hồ sơ 6 tầng và Cổng thành viên an toàn trên Vibecode Lab.
2. **CỘT MỐC M2 (Hoàn thành Mở rộng NEXT):**
   - *Thời điểm:* Kết thúc `SC-05`, `SC-06`, `SC-07` và `Batch 04`, `Batch 05`, `Batch 06`, `Batch 07`.
   - *Chốt chặn phê duyệt:* **`GATE-04`** — Tuấn phê duyệt ma trận ReBAC, chính sách phân quyền ảnh tư liệu, quy trình duyệt bài MẠCH và cơ chế bảo vệ trẻ em / người mất.
3. **CỘT MỐC M3 (Nghiệm thu V1.0 LATER):**
   - *Thời điểm:* Kết thúc `SC-08` và `Batch 08`.
   - *Chốt chặn phê duyệt:* **`GATE-05`** (Nghiệm thu kỹ thuật Staging) và **`GATE-06`** (Quyết định tối cao của Tuấn phát hành chính thức bản V1.0 ra toàn gia tộc).

---

## 4. CHI TIẾT NỘI DUNG ĐỀ XUẤT CẬP NHẬT VÀO MASTER PLAN (PROPOSED DIFF)

AGY đề xuất cập nhật Mục 6 trong tệp [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md) theo nội dung đã được đối soát chính xác:

### Đoạn Đề Xuất Cập Nhật (Proposed Content for Section 6):
```markdown
## 6. WORKSTREAM KIẾN TRÚC & HIỆN ĐẠI HÓA MÃ NGUỒN (WS08 — SOURCE CODE ARCHITECTURE & MODERNIZATION)

### 6.1 Mục Tiêu & Kết Quả Kỳ Vọng Đã Đối Soát (Reconciled Objectives)
- **Bản chất công tác:** Thiết lập kiến trúc **Modular Monolith** phân định rõ ranh giới giữa Client Runtime (Browser ESM) và Server Runtime (Node.js/Express 5); bảo tồn 100% URL công khai, API contract và dữ liệu hiện có; loại bỏ hoàn toàn việc ghép cứng mock data vào client code.
- **Kết quả kỳ vọng cốt lõi:**
  1. **Ranh giới phân lớp minh bạch:** 6 tầng kiến trúc (`Experience`, `Application`, `Domain`, `Platform`, `Shared`, `Infrastructure`).
  2. **Domain Core thuần khiết (Zero DOM in Domain):** 5 miền logic nghiệp vụ (`genealogy`, `kinship`, `editorial`, `calendar`, `archive`) độc lập 100% khỏi `window/document/DOM`, có thể kiểm thử tự động trên Node.js.
  3. **Đảo ngược phụ thuộc Tầng dữ liệu (DIP & DI):** Tầng Client UI chỉ phụ thuộc `DataService`. Việc nạp `HttpAdapter` (Live API) hay `MockAdapter` (Fixtures in-memory) do Composition Root (`boot.js`) tiêm tại runtime dựa trên cờ môi trường.
  4. **Hệ thống Design Tokens chuẩn mực duy nhất:** Xác lập `src/css/foundation/tokens.css` và `foundation.css` là nguồn chân lý duy nhất cho giao diện toàn nền tảng.
  5. **An toàn chuyển đổi có kiểm chứng:** Mọi bước di chuyển đều có bộ kiểm thử đặc tính (Characterization Tests) và kiểm thử đầu ra tương đương (Output Parity Tests) đối soát trên 100% dữ liệu 228 nhân vật trước khi cắt chuyển.

### 6.2 Ma Trận 8 Sub-Plan (SC-01 Đến SC-08) Đã Phân Loại Nợ Kỹ Thuật

| Mã Kế Hoạch | Tên Sub-Plan | Mã Gói | Phân Loại Nợ | Trọng Tâm Kiến Trúc | Tiêu Chí Nghiệm Thu (DoD) | Pha |
| :---: | :--- | :---: | :---: | :--- | :--- | :---: |
| **`SC-01`** | **Dọn dẹp Gốc & Lưu trữ Cũ** | `MIG-01` | `SHOULD FIX` | Lưu 54 scripts rác vào archive/scripts/; cô lập member-app.js cũ | 0 lỗi missing script; gốc repo sạch; dev server chạy tốt | `NOW` |
| **`SC-02`** | **Chuẩn hóa Tokens & Shared** | `MIG-02` | `SHOULD FIX` | src/css/foundation/tokens.css; trích xuất safe DOM utilities | CSS tokens đồng bộ; 0 visual regression > 1% | `NOW` |
| **`SC-03`** | **Tách Biệt Pure Domain Cores**| `MIG-03` | `MUST FIX` | Tách 5 domain cores (phả hệ, xưng hô, MẠCH, âm lịch, tư liệu) | 100% pure JS, zero DOM; Output Parity đạt 100% PASS | `NOW` |
| **`SC-04`** | **Đảo Ngược Phụ Thuộc Dữ Liệu**| `MIG-04` | `MUST FIX` | DataService + HttpAdapter & MockAdapter; gỡ mock trong data.js | 0 rò rỉ mock vào live; runtime adapter switching mượt mà | `NOW` |
| **`SC-05`** | **Module hóa Backend Express 5** | `MIG-05` | `MUST FIX` | Tách server/index.js thành modular routes, middleware, app.js | index.js < 100 dòng; pass 10/10 security tests (CF-01..08) | `NEXT` |
| **`SC-06`** | **Tích hợp Admin Center v2.1** | `MIG-06` | `SHOULD FIX` | Nâng cấp /admin theo Brand Tokens, DOMPurify và nhúng phân hệ Lab | Admin an toàn XSS 100%; preview lab hoạt động ổn định | `NEXT` |
| **`SC-07`** | **Tái tổ chức Experience Apps**| `MIG-07` | `SHOULD FIX` | Chuẩn hóa src/js/apps/{public, member, admin, lab}/ | 0 lỗi 404 module import trên cả 4 giao diện | `NEXT` |
| **`SC-08`** | **Đóng Nợ & Nghiệm thu Toàn diện**| `MIG-08` | `MUST FIX` | Khảo sát đóng dứt điểm TD-01..08; chạy E2E Staging Verification | 8/8 khoản nợ được giải quyết; đủ điều kiện trình GATE-06 | `LATER` |
```

---

## 5. KẾT LUẬN & ĐỀ XUẤT HÀNH ĐỘNG TRÌNH TUẤN

Bản đề xuất điều chỉnh WS08 đã hoàn thiện, đảm bảo:
- **Không tự ý mở rộng phạm vi sản phẩm (Scope):** Giữ nguyên vẹn 30 Touchpoints và cấu trúc 8 Batch.
- **Không thay đổi thứ tự ưu tiên:** Tuân thủ lộ trình NOW ──► NEXT ──► LATER.
- **Có đầy đủ bằng chứng đối soát:** Bám sát từng tệp mã nguồn và cấu trúc CSDL thực tế.

---

> [!IMPORTANT]
> ### 🛑 CHỐT CHẶN PHÊ DUYỆT (HUMAN APPROVAL GATE — GATE-01)
> AGY xin kính trình Tuấn (Product Owner) xem xét phê duyệt Bản Đề Xuất Điều Chỉnh này để làm căn cứ cập nhật chính thức vào Canonical Master Plan v4.0.  
> 
> Sau khi Tuấn phê duyệt:
> 1. AGY sẽ cập nhật nội dung đối soát vào `AUDIT/MASTER_COMPLETION_PLAN.md`.
> 2. AGY sẽ lập kế hoạch chi tiết cho các sub-plan mở đầu pha NOW (`SC-01` và `SC-02`) song hành cùng việc kích hoạt `Batch 01`.

