# AIOS MCP UPGRADE ARCHITECTURE 001

## 1. THIẾT KẾ KIẾN TRÚC TỔNG THỂ (INFERENCE & PROPOSED)
Kiến trúc nâng cấp MCP được xây dựng dựa trên nguyên tắc **Per-Agent Enablement**. Thay vì bật mọi MCP server ở cấp độ global (khiến mọi Agent đều bị phình Context Budget), hệ thống sẽ load MCP theo Role của từng Agent.

**Flow Kiến trúc:**
`CAPABILITY REQUIRED` → `CHECK OVERLAP` → `ASSIGN TO ROLE` → `ISOLATE VIA MCP SEAM` → `HUMAN GATE APPROVAL` → `VERIFIED`

## 2. QUẢN TRỊ CONTEXT BUDGET
Các Agent hiện tại đang bị "nhiễu" do danh sách MCP quá dài. 
Giải pháp:
- **Khử trùng lặp (Deduplication):** 
  - Gỡ bỏ `puppeteer` vì `playwright` cung cấp khả năng E2E testing tương đương nhưng hiện đại hơn.
  - Gỡ bỏ `git` MCP vì Agent (OpenCode) hoàn toàn có thể dùng `bash` (đã được sandbox) để chạy lệnh git cục bộ, tiết kiệm một MCP server.
  - Hợp nhất Knowledge: Chọn 1 Source of Truth duy nhất (ví dụ: `knowledge-graph`), tắt `context7`, `aios-working-memory`, `memory` đối với các agent không chuyên trách.

## 3. SECURITY TIERS (PHÂN QUYỀN BẢO MẬT)
Dựa trên quyền hạn (Authority), mọi MCP phải được mapping vào 4 Tiers:

- **TIER 0 (READ):** 
  - Không thay đổi state. Tự động cấp cho các Agent cần thiết (AGY, DSH). 
  - *Ví dụ:* Filesystem Read, Database Read-Only, Sentry/Observability, Figma, Web Search.
- **TIER 1 (WRITE WITH APPROVAL):** 
  - Thay đổi state cục bộ, an toàn, có thể rollback. 
  - *Ví dụ:* Filesystem Write (Workspace), Playwright (tương tác UI test). Yêu cầu Ask approval nếu cấu hình.
- **TIER 2 (WRITE):** 
  - Thay đổi state mạnh, ảnh hưởng remote. 
  - *Ví dụ:* GitHub Push, Serena Edit/Refactor quy mô lớn. 
  - *Gán cho:* OpenCode (Technical Lead) và phải có review.
- **TIER 3 (PRODUCTION / IRREVERSIBLE):** 
  - Tác động Production, Xóa DB, Xóa Cloud.
  - *Ví dụ:* MySQL DROP/DELETE, Vercel Deploy.
  - *Gán cho:* Không Agent nào. Phải chặn ở mức MCP Protocol hoặc Human Gate (Tuấn).

## 4. QUẢN LÝ GAPS (KHOẢNG TRỐNG)
Hệ thống hiện tại [OBSERVED] thiếu 3 capability quan trọng nhất cho V1 Release:
1. **Database MCP:** OpenCode không thể chẩn đoán data trên Giatoc MariaDB.
2. **Observability MCP:** Thiếu Sentry để trace bug.
3. **Cloud/Deployment MCP:** Chưa có công cụ quản lý Vercel/Cloudflare (Tạm thời defer).

## 5. CƠ CHẾ VERIFICATION
- Không cấp thẻ "VERIFIED" chỉ vì đã setup config.
- **Test chuẩn:** Bắt buộc phải có kịch bản Smoke Test (Ví dụ: Chạy query `SELECT 1` cho Database MCP, chạy `search` cho Exa MCP) trước khi đánh dấu là `ASSIGNED`.
