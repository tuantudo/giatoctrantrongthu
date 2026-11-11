# BÀN GIAO — HIỆU CHỈNH PRODUCT INTENT & DISCOURSE ARCHITECTURE (CLARA / MẠCH / PUBLIC)

- **Ngày:** 2026-11-02 · **Thực hiện:** AGY (Execution Coordinator) · **Chế độ:** DOCUMENT EDITING ONLY
- **Nguồn chỉ thị:** `EXECUTION DIRECTIVE — MẠCH / CLARA / PUBLIC DISCOURSE ALIGNMENT` (Tuấn)
- **Tài liệu canonical sau hiệu chỉnh:** [`MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md) (v2.1) §1.4 · §6A · §7A · Phụ lục A, và [`FRONTEND_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/FRONTEND_COMPLETION_PLAN.md) (v1.1)

> [!CAUTION]
> **PHÁT HIỆN P0 — cần Tuấn quyết định trước mọi triển khai Stage 1.**
> Quan sát chỉ-đọc ngày 2026-11-02: (a) `GET https://api.giatoctrantrongthu.com/api/mach.json` (ẩn danh) → HTTP 200, 20 mục, trong đó **7 mục thuộc chuỗi Thư gửi Clara** (`clara-001…007`) lẫn trong danh mục MẠCH; (b) file `content/mach/thu-gui-clara/*.md` và ảnh `assets/images/mach/thu-gui-clara/*` truy cập công khai trên `giatoctrantrongthu.com` (HTTP 200); (c) `scripts/build_mach.py` gộp Clara vào `seriesIds=[thu-gui-clara, issue-01]`; (d) `/me/clara` chỉ cần đăng nhập. Chưa tải hay in nội dung thư. **Kế hoạch cũ có `TASK-06C` "hiện đủ 20 bài MẠCH" sẽ làm lộ Clara rộng hơn → đã khóa (`BLOCKED`) và thêm `TASK-06D`.** Không thay đổi production nào được thực hiện.

## 1. Objective
Làm cho kế hoạch phản ánh đúng ba discourse scope: Clara (riêng tư, branch-scoped), MẠCH (không gian tư tưởng toàn dòng họ, không định kỳ), Public (tiếng nói hướng ra xã hội, hiện do Tuấn phát ngôn).

## 2. Work performed
- Thêm Executive Summary + §1.4 (taxonomy, cặp khái niệm không nhầm lẫn, nguyên tắc truy cập, biên tập MẠCH, phát ngôn Public) làm định nghĩa canonical duy nhất.
- Loại bỏ mô tả MẠCH là tập san/định kỳ (Master §1.1–1.2, P5, DoD #7, FE-04); bổ sung điều cấm.
- Thêm 7 task Master mới (`06D, 08C, 08D, 15B, 16B, 18B, 19B`, hiệu chỉnh `06C`) + 3 task Frontend (`FE-09→11`), 5 decision (DEC-09→13), 11 open question, 4 risk, ma trận kiểm thử `DT-01→DT-20`, 5 user journey, Phụ lục A (điểm chưa đồng bộ).
- Đồng bộ Frontend Plan (header, nguyên tắc 5, hiện trạng Discourse, FE-02/04/07 hiệu chỉnh, FE-09→11 mới, hợp đồng §5, acceptance §7, gate §8).
- Ghi D007/D008 vào `CORE_DECISIONS.md` (MẠCH Obsidian), sửa `mach_audit_pipeline.sh` (loại trừ báo cáo M01), biên dịch lại `MACH_AUDIT.md`.

## 3. Files changed
| Đã sửa | Loại |
|---|---|
| `AUDIT/MASTER_COMPLETION_PLAN.md` | Cập nhật v2.0 → v2.1 |
| `AUDIT/FRONTEND_COMPLETION_PLAN.md` | Cập nhật v1.0 → v1.1 |
| `AUDIT/ARCHITECTURE_DISCOVERY_RELATIONAL_IDENTITY_PRIVACY.md` | Ghi chú đính chính phân loại `INTIMATE-RESTRICTED` |
| `AUDIT/DISCOURSE_ALIGNMENT_HANDOFF.md` | Mới (báo cáo này) |
| `…/MACH_SYSTEM/CORE_DECISIONS.md` (Obsidian) | Thêm D007, D008 |
| `…/MACH_SYSTEM/mach_audit_pipeline.sh` (Obsidian) | Thêm 1 điều kiện loại trừ |
| `…/MACH_SYSTEM/MACH_AUDIT.md`, `MACH_SOURCE_OF_TRUTH.md`, `BACKUP/*` | Tái biên dịch; sinh bản backup mới, không ghi đè lịch sử |

**KHÔNG sửa:** mọi code/HTML/CSS/JS, `server/`, `database/`, `fixtures/`, `GIADINHONGTHU.ged`, SQLite/MariaDB, `docs/`, `brand/`, `.aios/`, `vercel.json`, cấu hình Cloudflare/Vercel/NAS, các file doctrine MẠCH đánh số (00–23, DNA, ONTOLOGY…). Không commit/reset/clean/stash.

## 4. Evidence
- Git working tree: 308 mục trước và sau; các file sửa trong repo chỉ nằm ở `AUDIT/` (3 file có sẵn + báo cáo này).
- Probe live (chỉ GET, đã xóa tệp tạm): `mach.json` 200 · 20 stories · series `{issue-01, thu-gui-clara}` · 7 mục Clara · file `.md` Clara 200 · ảnh Clara 200.
- `MACH_AUDIT.md` có D007; không còn chứa báo cáo M01; 0 chuỗi escape lỗi trong 2 plan.

## 5. Verification
Đối chiếu chéo Master ↔ Frontend: cùng tham chiếu §1.4, cùng ID `TASK-06D/08C/08D/15B/16B/18B/19B` ↔ `FE-09/10/11`, cùng `OQ-xx`, cùng `DT-xx`. **Chưa** có kiểm thử tự động (đây là thay đổi tài liệu). Chưa kiểm tra search/sitemap/feed/cache ở mức nội dung → `[UNKNOWN]`, giao `TASK-16B`.

## 6. Current state
Không có thay đổi code/DB/production. `TASK-06C` = `BLOCKED`; `TASK-06D` = `AWAITING HUMAN DECISION`. GATE-01 chưa duyệt.

## 7. Open questions — cần Tuấn quyết định (chi tiết Master §7A)
| Mã | Câu hỏi | Mức |
|---|---|:---:|
| OQ-06 | Cách xử lý 7 thư Clara đang nằm trên bề mặt công khai (gỡ/tách/cache/lịch sử Git) | **P0** |
| OQ-01 | "Nhánh ông bà Hạnh Đào" gồm ai, lấy từ dữ liệu nào? | P1 (UNKNOWN) |
| OQ-02 | Ai có quyền biên tập/quản trị Clara, MẠCH, Public? | P1 |
| OQ-03 | "Thành viên toàn dòng họ" xem MẠCH thế nào? (`UNMAPPED`/`PROVISIONED`?) | P1 |
| OQ-04 | Quy trình công bố MẠCH → Public | P1 |
| OQ-05 | Người không có quyền Clara: ẩn hẳn lối vào hay hiện trạng thái từ chối? | P1 |
| OQ-07 | Phân loại từng mục trong 20 mục; thư 007 gửi nhiều cháu — cùng nhánh? | P1 (UNKNOWN) |
| OQ-09 | Nhãn attribution phát ngôn Public | P1 |
| OQ-10 | Cấp quyền sửa `docs/`, `brand/`, `.aios/`, `fixtures/` (Phụ lục A) | P1 |
| OQ-08, OQ-11 | Giữ/bỏ khái niệm "issue" trong MẠCH; có điều chỉnh doctrine Obsidian không? | P2 |

## 8. Blockers
Không có P0 chặn **công việc tài liệu**. P0 chặn **triển khai Stage 1**: `TASK-06C` không chạy trước quyết định `OQ-06`.

## 9. Risks
Bản sao Clara có thể đã tồn tại ngoài hệ thống (cache, Git history CF-08, bản lưu); gỡ khỏi live không thu hồi được. `docs/MEMBER_SYSTEM_SPECIFICATION.md` còn mô tả Clara → Public Web (P0 về tài liệu) cho đến khi được cấp quyền sửa. Mô hình ReBAC hiện tại chưa biểu đạt scope + nhánh (ghi nhận ở `TASK-15B`; chưa đề xuất giải pháp kỹ thuật).

## 10. Recommended next action
1. Tuấn quyết định `OQ-06` (và xác nhận phân loại `OQ-07`) để mở khóa `TASK-06D` → `TASK-06C`.
2. Tuấn/Emarald trả lời `OQ-01/02/03/05` để chốt chính sách trước `GATE-04`.
3. Cấp quyền theo `OQ-10` để đồng bộ `docs/` và `fixtures/` (FE-09).
4. Duyệt gói GATE-01 đã cập nhật.
Dừng tại đây; không mở batch audit mới.

---

## Phụ lục — Bảng đối chiếu Trước / Sau cho ba Discourse Scope

| Khía cạnh | **CLARA** trước | **CLARA** sau | **MẠCH** trước | **MẠCH** sau | **PUBLIC** trước | **PUBLIC** sau |
|---|---|---|---|---|---|---|
| Định vị | Master Plan không nhắc; UI/Frontend: "diễn ngôn riêng tư", nhưng pipeline gộp vào MẠCH/issue-01 | Ký ức gia đình riêng tư, scope độc lập, **không** thuộc MẠCH | "Tập san/tạp chí", series `issue-01`, "20 bài tư liệu" | Không gian tư tưởng, khảo sát, đối thoại của toàn dòng họ; **không định kỳ** | "Tiếng nói của gia tộc" (UI), chưa có đặc tả nguyên tắc | Tiếng nói hướng ra xã hội; Tuấn là người phát ngôn hiện tại |
| Đối tượng | Mọi thành viên đăng nhập (`requireAccount`) | Gia đình nhỏ; chỉ nhánh ông bà Hạnh Đào | Mọi người (API ẩn danh) | Toàn dòng họ (lineage-scoped) | Công chúng | Công chúng, nội dung đã được phép công bố |
| Truy cập | Đăng nhập = xem; lại còn trong API/file tĩnh công khai | Branch-scoped; deny by default; cấm lộ qua API/search/sitemap/feed/cache | Công khai ẩn danh | Thành viên được phép; không mặc nhiên công khai | Không có chính sách công bố tường minh | Public-readable cho nội dung đã đánh dấu công bố; không phải bản sao MẠCH |
| Quyền đọc/biên tập/quản trị | Không phân biệt | Tách 3 quyền; không suy diễn quyền người khác (`OQ-02`) | Không phân biệt | Tách 3 quyền (`OQ-02`) | Không phân biệt | Tuấn phát ngôn; vai trò hiện tại, không vĩnh viễn |
| Đại diện | — | — | Ngầm định đại diện chung | Bài viết không mặc nhiên đại diện toàn dòng họ | Ngầm định đại diện dòng họ | Không tự gắn nhãn đồng thuận tập thể (`DT-09`, `RSK-09`) |
| Kiểm thử | Không có | `DT-01/02/03/10/11/14/15/17` | Không có | `DT-04/05/06/12/13/19/20` | Không có | `DT-07/08/09/16/18` |
