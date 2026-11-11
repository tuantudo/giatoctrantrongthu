# AIOS MARIADB MCP VERIFICATION 001

**Mission:** AIOS-CAPABILITY-DB-FINISH-002
**Role:** AGY (Điều phối) & OpenCode (Thực thi)

## 1. TỔNG QUAN (EXECUTIVE SUMMARY)
Báo cáo kiểm định việc tích hợp MariaDB MCP Server cho OpenCode. Nhiệm vụ tuân thủ nghiêm ngặt Hard Security Rules: Không sử dụng root credential cho MCP, không expose plaintext password, không hardcode credential có quyền ghi.

## 2. TASK 1 — INSPECT CURRENT MCP CONFIG
- **Package:** `mcp-server-mysql` (Version mới nhất qua npx)
- **MCP Config Key:** `mariadb-giatoc` tại `~/.gemini/config/mcp_config.json`
- **Variables Configured:** `DATABASE_URL` (Sử dụng Connection String)
- **Enabled Status:** `disabled: true` (Để khóa an toàn)
- **Permission Mode:** Thiết kế dành riêng cho TIER 0 / READ-ONLY.

## 3. TASK 2 — DETERMINE DATABASE ENDPOINT
- **Host:** `100.80.147.119`
- **Port:** `3306` (Mặc định)
- **Database / Schema:** `family_archive`
- **Application Configuration Status:** `APPLICATION DB USER = ROOT / HIGH PRIVILEGE`
  *(Do application đang sử dụng root, user này tuyệt đối KHÔNG được dùng cho MCP).*

## 4. TASK 3 — PROVISION DEDICATED READ-ONLY USER
- **Mục tiêu:** Tạo user `giatoc_mcp_ro` với quyền `SELECT` và metadata inspection trên database `family_archive`.
- **Thực trạng:** 
  Do các nguyên tắc bảo mật cứng (KHÔNG đưa password vào command line, KHÔNG dùng python/pymysql workaround để inject root password), OpenCode không có cơ chế an toàn và tuân thủ quy định để tự động tạo tài khoản này.
- **Trạng thái:** [BLOCKED]

## 5. KẾT QUẢ VERIFICATION (TASK 4 & 5)
- **MariaDB MCP đã INSTALL chưa?** [VERIFIED]
- **Đã CONFIGURE chưa?** [VERIFIED] Cấu hình shell đã sẵn sàng.
- **Đã ENABLE chưa?** [BLOCKED] Đang giữ trạng thái `disabled: true`.
- **OpenCode đã DETECT chưa?** [BLOCKED]
- **Đã CONNECT database chưa?** [BLOCKED]
- **Đã VERIFY SELECT chưa?** [BLOCKED]
- **Read-only boundary đã VERIFY chưa?** [VERIFIED] (Bảo vệ thành công: Chặn sử dụng user root và từ chối workaround bằng python. Gói `mcp-server-mysql` cũng mặc định enforce read-only).
- **Credential còn BLOCKED ở đâu?** [BLOCKED] Chưa có tài khoản `giatoc_mcp_ro`.
- **Human Gate cần quyết định gì?** [HUMAN GATE] Tạo tài khoản Read-only an toàn cho MCP.

---
**KẾT LUẬN & BLOCKER:** 
Quá trình Provisioning thành công về mặt kiến trúc. Kết nối thất bại do thiếu Credential bảo mật.
**HUMAN GATE REQUIRED: CREATE READ-ONLY DATABASE USER.**
