# AIOS SECURITY CREDENTIAL ROTATION 001
**Date:** 2026-09-18
**Status:** [BLOCKED / HUMAN GATE REQUIRED]
**Mission:** AIOS-SECURITY-CREDENTIAL-ROTATION-001

## 1. INCIDENT INVENTORY
- **SECRET_TYPE:** PASSWORD
- **SERVICE:** MariaDB
- **ACCOUNT:** [UNKNOWN / ASSUMED APPLICATION OR HIGH-PRIVILEGE]
- **LOCATION_OF_EXPOSURE:** Terminal command / process arguments / session logs trong quá trình thực thi MCP gần đây.
- **EXPOSURE_STATUS:** COMPROMISED

## 2. ROTATION SCOPE
Dựa trên nguyên tắc bảo mật, credential bị lộ có khả năng thuộc nhóm **Application Database Credential** hoặc **Root/High-Privilege Credential** được sử dụng tạm thời. 
Không thể tự động rotate vì rủi ro làm gián đoạn hệ thống Production đang chạy.

## 3. ROOT / HIGH-PRIVILEGE CREDENTIAL
**[STOP] HUMAN GATE REQUIRED.**
- AGY yêu cầu Tuấn (Final Authority) trực tiếp revoke password cũ và thực hiện rotation trên máy chủ MariaDB.
- **TUYỆT ĐỐI KHÔNG** paste password mới vào cửa sổ chat.
- **TUYỆT ĐỐI KHÔNG** echo password trong terminal có lưu log.

## 4. MCP CREDENTIAL STATUS
- Trạng thái hiện tại: `PROVISIONED / CONNECTION BLOCKED` (Ngắt kết nối, cấm sử dụng credential đã lộ).
- MCP không được phép dùng lại Exposed Credential dưới mọi hình thức, kể cả để "test cho nhanh".

## 5. DEDICATED READ-ONLY MCP USER (REQUIRED)
Sau khi Human Gate phê duyệt, yêu cầu tạo tài khoản chuyên dụng cho MCP:
- **Tài khoản:** `giatoc_mcp_ro`
- **Quyền hạn (Privileges):** `SELECT`, cộng thêm quyền đọc metadata/schema cơ bản.
- **Bị cấm (Denied):** `INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, TRUNCATE, GRANT, REVOKE`.
- **Cơ chế truyền mật khẩu:** Inject qua Environment Variable hoặc Secret Manager của hệ điều hành, không lưu plaintext trong MCP Config.

## 6. SECRET RESIDUES AUDIT
- Yêu cầu xóa sạch dấu vết (residues) của câu lệnh làm lộ credential trong `shell history` (vd: `~/.zsh_history`, DSH session logs, và AIOS artifacts). 
- Các log đã bị nhiễm plaintext phải được xóa thủ công hoặc redact an toàn.
- **Git:** Không phát hiện rò rỉ credential vào Git tracked files.

## 7. VERIFICATION
Các bước này sẽ được đánh check sau khi Human hoàn tất can thiệp:
- [ ] Exposed credential đã bị revoke/rotated.
- [ ] Credential cũ bị INVALIDATE, không còn quyền truy cập.
- [ ] Tài khoản `giatoc_mcp_ro` tồn tại với quyền Read-Only.
- [ ] MCP config không chứa plaintext secret.
- [ ] Application credential không bị phá hỏng ngoài scope.

## 8. NEXT STATE
Chờ Human (Tuấn) xác nhận đã hoàn tất Rotation thủ công và dọn dẹp residues.
Sau đó chuyển trạng thái sang `SECURITY REMEDIATED` và Handoff cho Agent tiếp theo.
