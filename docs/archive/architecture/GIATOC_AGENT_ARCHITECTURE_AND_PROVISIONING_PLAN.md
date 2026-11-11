# GIATOC AGENT ARCHITECTURE & PROVISIONING PLAN
**Project:** `/Users/tuantq/Projects/Personal/giatoctrantrongthu`
**Date:** 2026-09-15
**Status:** [PROPOSED] Design Mission

Tài liệu này xác định đội hình AI thực tế (Agent Topology) và kế hoạch cấp phát tài nguyên (Provisioning Plan) cho dự án Giatoc, tuân thủ chặt chẽ AIOS Project Agent Bootstrap Specification. 

Thay đổi cốt lõi: **Cline được tái định vị thành Experience Architect / Web UI Engineer / Visual QA** dựa trên thực tế năng lực thiết kế giao diện và browser-based verification, không còn là Independent Auditor thuần túy.

---

## 1. AGENT PROFILES & RESOURCE REALITY (A & I)

Đánh giá thực trạng tài nguyên định danh cấp AIOS đối với Giatoc:

- **AIOS-AGENT-AGY (AGY):** `[AVAILABLE]`
  - *Thế mạnh:* Lý luận ngữ nghĩa, kiến trúc hệ thống, phân tích sâu, quản lý Memorandum.
  - *Execution Surface:* Native Runtime (AGY CLI).
- **AIOS-AGENT-OC (OpenCode):** `[AVAILABLE]`
  - *Thế mạnh:* Kỹ thuật hệ thống, Node.js, MariaDB, tích hợp production, tự động hóa toàn trình.
  - *Execution Surface:* Native Runtime (OpenCode Adapter).
- **AIOS-AGENT-CLINE (Cline):** `[AVAILABLE]`
  - *Thế mạnh:* Thiết kế Web, UI/UX implementation, Visual refinement, Browser-based QA.
  - *Execution Surface:* IDE Extension (VS Code).

---

## 2. PROJECT ROLES & BOUNDARIES (B)

### 2.1 Heritage / Product Architect
- **Purpose:** Chịu trách nhiệm về ngữ nghĩa di sản, Information Architecture (IA) và Ontology.
- **Boundaries:** Không trực tiếp code Node.js/MariaDB nếu không cần thiết. Giữ quyền phán xử về Meaning.

### 2.2 Technical Lead / Systems Engineer
- **Purpose:** Triển khai hạ tầng, API, Database, và nối các luồng Production.
- **Boundaries:** Chịu trách nhiệm về độ ổn định vật lý và an toàn dữ liệu, nhưng không quyết định UX/UI.

### 2.3 Experience Architect / Web UI Engineer / Visual QA
- **Purpose:** Triển khai thiết kế Frontend, HTML/CSS/React, Visual QA trên trình duyệt.
- **Hard Boundaries (DENIED AUTHORITY):**
  - Không có thẩm quyền sửa Heritage Ontology & Genealogy Truth.
  - Không có thẩm quyền sửa Project Governance / Constitution / Contract.
  - Không được đưa ra Final Architectural Decisions.

---

## 3. ASSIGNMENTS (D)

Các Assignment dưới đây hiện đang ở trạng thái `[PROPOSED]`. Khi được ghi vào `.aios/PROJECT_CONTRACT.json` bởi Human, chúng sẽ chuyển thành `[PROJECT_ASSIGNED]`.

### ASSIGNMENT-01: THE ARCHITECT
- **Agent:** AIOS-AGENT-AGY
- **Role:** Heritage / Product Architect
- **Execution Surface:** AGY CLI
- **Allowed Skills:** `knowledge-ingestion`, `ontology-design` [PROPOSED]
- **Capability:** Read/Write Filesystem, Analyze Document.
- **Permission:** Allow sửa đổi `docs/architecture/*`.
- **Authority:** Dịch Human Intent thành IA.

### ASSIGNMENT-02: THE BUILDER
- **Agent:** AIOS-AGENT-OC
- **Role:** Technical Lead / Systems Engineer
- **Execution Surface:** OpenCode Native Runtime
- **Allowed Skills:** `database-migration` [REQUIRED], `api-integration` [REQUIRED]
- **Capability:** Shell, Node, DB access, Network.
- **Permission:** Allow sửa đổi thư mục source code backend và config hạ tầng.
- **Authority:** Triển khai kỹ thuật đảm bảo Operational Availability.

### ASSIGNMENT-03: THE EXPERIENCE MAKER
- **Agent:** AIOS-AGENT-CLINE
- **Role:** Experience Architect / Web UI Engineer / Visual QA
- **Execution Surface:** VS Code Extension
- **Allowed Skills:** `figma-design-to-code` [EXISTS], `browser-based-qa` [REQUIRED]
- **Capability:** Read/Write Frontend files, Playwright/Browser MCP.
- **Permission:** Allow sửa đổi Frontend (`index.html`, `src/css/*`, `src/components/*`).
- **Authority:** Chuyển hóa IA thành Giao diện Tương tác (Silent UI).

---

## 4. SKILLS PROVISIONING (C)

Phân loại các kỹ năng cục bộ (Project-local) cần thiết:
1. `figma-use` / `figma-design-to-code`: `[EXISTS]` (Có sẵn trên hệ thống AIOS, cần assign cho Cline).
2. `playwright-browser-qa`: `[EXISTS]` (Qua Playwright MCP).
3. `giatoc-ontology-parser`: `[REQUIRED]` (Cần build để AGY chuẩn hóa cách đọc MẠCH/Archive).
4. `database-heritage-migration`: `[REQUIRED]` (Cần build để OpenCode biết cách migrate từ schema Tạp chí sang Di sản mà không mất dữ liệu cũ).

---

## 5. GIATOC WEB / PRODUCT WORKFLOW (G)

Chuỗi quy trình:
`MEANING → IA → UX DESIGN → UI IMPL → TECH SYNC → VISUAL QA → E2E VERIFY → HUMAN APPROVAL`

**Sự tham gia của các Agent:**
1. **HERITAGE MEANING & IA:** AGY (Dịch từ Memorandum).
2. **EXPERIENCE DESIGN & UI IMPL:** Cline (Biến IA thành HTML/CSS/React mới).
3. **TECHNICAL INTEGRATION:** OpenCode (Nối UI của Cline với Node/MariaDB).
4. **VISUAL QA:** Cline (Mở trình duyệt, kiểm tra responsive/thẩm mỹ).
5. **E2E VERIFICATION:** AGY + OpenCode (Đánh giá chéo).
6. **HUMAN APPROVAL:** Tuấn.

---

## 6. COLLABORATION MODEL & INDEPENDENCE (E & H)

### 6.1 Sự song song (Parallelism)
- Trong khi Cline đang mài giũa (Refinement) CSS/UI cho trang "Thư gửi Clara", OpenCode hoàn toàn có thể chạy song song việc cấu trúc bảng MariaDB (Dựa trên IA do AGY cấp). Không nhất thiết phải chờ UI xong 100% mới làm DB.

### 6.2 Tính Độc lập (Independence)
- **Quy tắc:** Cline là người vẽ giao diện (UI Impl), Cline tự làm Visual QA (Vì Visual QA mang tính low-risk và thẩm mỹ). Nhưng Cline **không** được tự verify rằng UI đó đã đáp ứng đúng "Heritage Ontology" (Nhiệm vụ này của AGY / Human).
- Tránh bureaucracy: Lỗi vặt CSS thì Cline tự sửa, tự chốt. Lỗi liên quan đến "Cảm giác Di sản" (Silent UI) phải xin ý kiến AGY hoặc Human.

---

## 7. HANDOFF CONTRACT (F)

Cấu trúc chuẩn của một lệnh Handoff (Giao tiếp giữa các Agent):

```markdown
# HANDOFF CONTRACT: [Tên Handoff]
**From:** [Role / Agent A]
**To:** [Role / Agent B]
**Timestamp:** YYYY-MM-DD

### 1. Context & Objective
- Bối cảnh và mục tiêu của gói công việc này là gì.

### 2. Inputs & Decisions Made
- Artifacts đầu vào.
- Các quyết định kiến trúc đã chốt (Canonical Decisions).

### 3. Work Completed & Outputs
- File đã tạo/sửa (Kèm link trực tiếp).

### 4. Evidence
- Kết quả test, log, screenshot (nếu có).

### 5. Open Questions & Blockers
- Những điểm mù, lỗi hoặc sự cố chưa khắc phục được.

### 6. Required Next Action
- Nhiệm vụ cụ thể yêu cầu Agent B thực hiện.

### 7. Human Decision Pending (Tùy chọn)
- Các vấn đề cần Human duyệt trước khi Agent B bắt đầu.
```

*Ví dụ Luồng Handoff thực tế:* 
`AGY (giao bản vẽ IA) → HANDOFF → Cline (Code Frontend) → HANDOFF → OpenCode (Gắn API).`
