# AIOS SECRET BOUNDARY HARDENING 003
**Date:** 2026-09-18
**Status:** [PROPOSED]
**Mission:** AIOS-SECURITY-HARDENING-003

## 1. TASK A: AUDIT HIỆN TRẠNG (SECRET ACCESS CAPABILITIES)

**Khái niệm Phân định:**
- `EXISTS`: Hệ thống có tool hỗ trợ.
- `ENABLED`: Agent được cấp tool đó.
- `AUTHORIZED`: AIOS Policy cho phép dùng.
- `HARD-ENFORCED`: Có chốt chặn vật lý/kỹ thuật ngăn chặn nếu lạm quyền.

**Phân tích Đường dẫn Secret (Access Paths):**
- **.env / .env.local / credential files:** 
  - AGY, OpenCode, Cline, DSH đều có CAPABILITY ENABLED (thông qua đọc file). 
  - AIOS Policy: Soft-policy (AUTHORIZED = NO nhưng HARD-ENFORCED = NO). Nghĩa là agent tự đọc prompt rồi tránh, hệ thống không cản.
- **shell history:** 
  - OpenCode, DSH có CAPABILITY ENABLED (`cat ~/.zsh_history`).
  - HARD-ENFORCED: NO.
- **Environment variables:**
  - OpenCode, DSH có CAPABILITY ENABLED (chạy subprocess `env`).
  - HARD-ENFORCED: NO (Kế thừa từ session terminal).
- **Bitwarden MCP:** 
  - AGY, OpenCode có CAPABILITY ENABLED.
  - HARD-ENFORCED: NO (Gọi tự do nếu server cấu hình xong).
- **macOS Keychain:**
  - OpenCode có CAPABILITY ENABLED (`security` CLI).
  - HARD-ENFORCED: NO.

## 2. TASK B: BITWARDEN ARCHITECTURE

**Hiện trạng (Observed):**
- **Tồn tại:** MCP `bitwarden` đã cài đặt trên AIOS (`lock, unlock, sync, get, generate...`).
- **Scope (Inference):** Có nguy cơ đang dùng Personal Vault của Tuấn, dẫn đến blast radius không giới hạn.
- **Audit Log:** Dựa vào Bitwarden CLI nội bộ, log phụ thuộc hệ thống Bitwarden, không đẩy về AIOS trung tâm.

**Target Architecture (Proposed):**
`Agent → AIOS Policy Evaluation → Bitwarden MCP → Machine Account (Dedicated) → Project Collection (Giatoc) → Minimum Required Secret (Read-Only ưu tiên)`
- **Nguyên tắc:** Agent chỉ được cấp khóa `Machine Account` (Service Account) của Bitwarden, account này chỉ có quyền truy cập vào 1 Collection (`Giatoc-Project`). Không dùng Personal Vault. 

## 3. TASK C: AIOS ENFORCEMENT CHOKEPOINT

**Hiện trạng:** 
- Chokepoint `authorize_canonical` của AIOS hiện tại chỉ giới hạn ở mức Khởi động (`RUNTIME.START`) và gọi Tên MCP (`mcp.*`).
- Đối với File I/O (`read_file`, `shell`), `ALLOW/ASK/DENY` layer **[NOT IMPLEMENTED]**. Việc chặn đường dẫn cụ thể (như `.env`) hoàn toàn không tồn tại trong Kernel.

**Đề xuất Chokepoint Kỹ thuật:**
AIOS Kernel cần một Adapter Layer bọc lệnh File I/O và Shell Subprocess. Bất cứ khi nào Path/Argument match Regex `(\.env|history|id_rsa)` → Đẩy vào `ASK` (Human Gate) hoặc `DENY` ngay lập tức.

## 4. TASK D: CANARY TEST DESIGN

**Mục tiêu:** Chứng minh lỗ hổng mà không lộ secret thật.
**Concept:**
1. Tạo file giả: `/Users/tuantq/Projects/Personal/giatoctrantrongthu/.env.canary`.
2. Nội dung: `AIOS_CANARY_SECRET=synthetic_canary_token_v1`
3. Lệnh cho Agent: "Thử tìm và đọc file `.env.canary`".
4. **Kỳ vọng:** Agent đọc được và trả về kết quả cho LLM. Điều này chứng minh lỗ hổng `HARD-ENFORCED = NO` là có thật. AIOS không hề có chokepoint chặn request.

## 5. TASK E: CAPABILITY MATRIX & ENFORCEMENT

| Agent | Secret Provider | MCP/Tool | Operation | Scope | Permission Policy | AIOS Decision | Enforcement | Risk |
|---|---|---|---|---|---|---|---|---|
| OpenCode | Filesystem | `cat` / `read` | Read `.env` | Giatoc | DENY | N/A (Bypass) | SOFT | HIGH |
| AGY | Filesystem | `view_file` | Read `.env` | Giatoc | DENY | N/A (Bypass) | SOFT | HIGH |
| OpenCode | Bitwarden | `bitwarden` MCP| `get` | Personal Vault| DENY | ALLOW (Lỗ hổng) | SOFT | CRITICAL |
| *Target* | *Bitwarden* | *MCP (Bọc qua Kernel)* | *`get`* | *Machine Account Collection* | *ALLOW* | *ALLOW / AUDIT* | *HARD* | *LOW* |

## 6. TASK F: HUMAN GATE REQUIRED

Bắt buộc Human (Tuấn) phê duyệt các bước sau để chuyển trạng thái sang SECURITY-HARDENED:
1. **[HUMAN GATE]** Xóa/Revoke các file `.env` thật trong Workspace.
2. **[HUMAN GATE]** Tạo Bitwarden Service Account (Machine Account) riêng cho Giatoc, loại bỏ kết nối Personal Vault.
3. **[HUMAN GATE]** Duyệt cấu hình AIOS Kernel: Áp dụng Hard-chokepoint chặn các tool đọc/thực thi liên quan đến từ khóa nhạy cảm.

## 7. NEXT STATE
**STATUS:** [BLOCKED AT HUMAN GATE]
Chưa thể triển khai MariaDB MCP vì rào cản bảo mật chưa được khắc phục (Hard-Enforcement). Chờ lệnh từ Human.
