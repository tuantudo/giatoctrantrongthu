# AIOS CAPABILITY UPGRADE PLAN 001

Danh sách hàng đợi nâng cấp (Prioritized Upgrade Queue) dành cho hệ thống AIOS của dự án Giatoc. Quá trình nâng cấp đang DỪNG ở bước đợi Tuấn (Human Gate) phê duyệt. Không tự động thực thi.

## P0 — FIX BROKEN / DUPLICATE CAPABILITY
**1. Khử trùng lặp Browser Tools**
- **Action:** Gỡ bỏ / Disable `puppeteer` khỏi global MCP list.
- **Value:** Giải phóng lượng lớn context window.
- **Cost/Risk:** Bằng 0 (vì `playwright` đã bao phủ toàn bộ use-case).
- **Owner:** AGY (Coordinate) / OpenCode (Execute config).
- **Verification:** Cline vẫn dùng được `playwright` bình thường.

**2. Khử trùng lặp Knowledge Tools**
- **Action:** Disable `context7`, `aios-working-memory`, `memory` đối với OpenCode và Cline. Chỉ giữ `knowledge-graph` cho AGY.
- **Value:** Tránh Agent bị rối loạn Source of Truth.
- **Cost/Risk:** Thấp.

## P1 — HIGH-VALUE MISSING CAPABILITY (CRITICAL GAPS)
**3. Database Read-Only MCP cho OpenCode**
- **Action:** Cài đặt và tích hợp một `mysql` / `mariadb` MCP server. Cấu hình cấp quyền `READ-ONLY` (Chỉ cho phép `SELECT`, `SHOW TABLES`, `DESCRIBE`).
- **Value:** Rất cao. OpenCode cần thấy schema thực tế của Giatoc DB để viết Backend/API.
- **Cost/Risk:** Cao (Nếu rò rỉ credential hoặc bị inject lệnh `DROP`).
- **Dependency:** Cần cài đặt open-source `mysql-mcp-server` và cấu hình Role read-only trên DB.
- **Owner:** OpenCode.
- **Verification:** Chạy `SELECT 1` thành công, chặn chạy `DELETE`.

**4. Cấu hình Isolation / Role-based Configs**
- **Action:** Phân tách file cấu hình MCP cho từng Agent (`AGY_mcp.json`, `OpenCode_mcp.json`, `Cline_mcp.json`) thay vì load chung một cục `mcp_servers` khổng lồ.
- **Value:** Cao. Tiết kiệm Token (Giảm Context Cost), tăng độ tập trung của LLM.
- **Cost/Risk:** Vừa (Yêu cầu thay đổi cách AIOS bootstrap agent).

## P2 — USEFUL CAPABILITY
**5. Observability / Sentry MCP**
- **Action:** Cài đặt Sentry MCP Server.
- **Value:** Giúp OpenCode chủ động fetch Error Trace từ Production.
- **Cost/Risk:** Thấp (Read-only API).
- **Dependency:** Cần Sentry API Token.

**6. Bật MCP Client cho DSH**
- **Action:** Chuyển `disabled: false` cho `@deepseek-ai/dsh-mcp-client`.
- **Value:** DSH có thể gọi trực tiếp các tool của AIOS.
- **Cost/Risk:** Vừa.

## P3 — EXPERIMENTAL / DEFER
**7. Cloud / Vercel / Cloudflare MCP**
- **Action:** Quản lý hạ tầng deploy bằng MCP.
- **Value:** Hữu ích nhưng chưa cấp thiết cho V1 Closure.
- **Action:** **DEFER** (Hoãn lại).

---

## 3. LỊCH SỬ THỰC THI (UPDATE 2026-09-17)
- **P0 - Khử trùng lặp Browser Tools:** [COMPLETED] Đã disable `puppeteer`.
- **P0 - Khử trùng lặp Knowledge:** [COMPLETED] Đã disable `context7`.
- **P1 - Database MCP:** [DEFERRED] Đã stub cấu hình `mariadb-giatoc` trong config nhưng đang bị Blocked (Chưa có Read-Only credential từ Human Gate). Đưa vào trạng thái chờ.

## 4. LỊCH SỬ THỰC THI (UPDATE SAU MISSION P1-DB)
- **P1 - Database MCP:** [VERIFIED / BLOCKED] Đã cài đặt `mcp-server-mysql`, cấu hình thành công cho OpenCode nhưng kết nối đang ở trạng thái BLOCKED chờ Human Gate cấp tài khoản Read-Only. Đã đáp ứng điều kiện dừng.
