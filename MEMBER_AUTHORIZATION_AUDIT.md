# BÁO CÁO KIỂM TOÁN PHÂN QUYỀN THÀNH VIÊN
## MEMBER AUTHORIZATION & ACCESS CONTROL AUDIT

**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Kiến trúc & QC:** Emarald (Strategic Architecture Authority)  
**Phụ trách:** AGENT 05 (Family Governance & Authorization Specialist)  
**Ngày ban hành:** 2026-11-11  

---

## 1. MÔ HÌNH PHÂN TẦNG THẨM QUYỀN THỰC TẾ (ACTUAL 4-TIER ACCESS MODEL)

Hệ thống hiện tại vận hành theo mô hình kết hợp giữa **RBAC (Role-Based Access Control)** và **ReBAC (Relationship-Based Access Control)** qua 4 bảng cốt lõi:
1. `admin_users`: Quản lý tài khoản quản trị hệ thống (`owner`, `editor`).
2. `accounts`: Quản lý tài khoản thành viên (`owner`, `admin`, `member`), trạng thái (`PROVISIONED`, `ACTIVE`, `DISABLED`).
3. `identity_mappings`: Liên kết định danh `account_id` ➔ `person_id` (trọng tâm của ReBAC).
4. `authorities`: Cấp quyền chi tiết theo bộ ba `(actor_type, actor_id, resource_type, resource_id, action)`.

### 1.1. Bảng Đối Soát Quyền Hạn Thực Tế:

| Thực thể / Bản ghi | Tầng Xử Lý (Consumer) | Quyền Hạn Kỹ Thuật Được Cấp | Ranh Giới Nội Dung & Gia Đình |
| :--- | :--- | :--- | :--- |
| **`admin_users (owner)`** | `requireOwner` tại `server/index.js` | Toàn quyền xem schema DB, tạo tài khoản admin/member, xem toàn bộ audit log. | Chỉ là quyền vận hành hệ thống máy chủ; KHÔNG tự động có quyền đọc thư riêng của nhánh khác. |
| **`admin_users (editor)`** | `requireAuth` tại `server/admin_operations.js` | Xem danh sách đề xuất (`proposals`), xem danh sách thành viên (`member-accounts`). | Phục vụ công tác biên tập; không được xóa hoặc đổi quyền owner. |
| **`accounts (owner)`** | `requireAccount`, `isClaraEligible` | Toàn quyền không gian thành viên `/me`, phê duyệt đề xuất phả hệ, đổi mật khẩu. | Về mặt Clara: Chỉ được xem nếu thỏa mãn thêm điều kiện thuộc nhánh phả hệ hoặc tên đăng nhập được ủy thác. |
| **`accounts (member)`** | `requireAccount` | Truy cập `/me`, `/me/tree`, `/me/gallery`, `/me/events`, `/me/mach`, gửi đề xuất. | Chỉ xem được nội dung gia tộc chung; không xem được nội dung chi nhánh riêng tư khác. |
| **`identity_mappings (person_id)`** | `server/member.js` | Xác định tư cách đương sự trên cây gia phả (`Me-Centric Tree View`). | Là điều kiện bắt buộc để gửi đề xuất (`proposals`) sửa đổi thông tin phả hệ. |
| **`accounts.status = 'PROVISIONED'`** | `server/member.js` L446-452 | Bị khóa quyền gửi đề xuất (`proposals`), bắt buộc đổi mật khẩu lần đầu. | Ngăn chặn việc tài khoản dùng mật khẩu tạm thời thực hiện các thao tác ghi dữ liệu. |
| **`accounts.status = 'DISABLED'`** | `server/member.js` L57-73 | Chặn đứng toàn bộ truy cập, hủy phiên đăng nhập ngay lập tức. | Cơ chế khẩn cấp khi nghi ngờ rò rỉ thông tin hoặc mất quyền kiểm soát tài khoản. |

---

## 2. RANH GIỚI BẢO MẬT TƯ LIỆU CLARA (CLARA BRANCH_RESTRICTED_P0)

### 2.1. Hiện trạng triển khai trong mã nguồn
- Mã nguồn tại `server/member.js` bảo vệ 3 điểm chạm của Clara:
  1. `GET /api/member/clara.json` (API trả về siêu dữ liệu thư Clara)
  2. `GET /assets/private/images/clara/:filename` (Hình ảnh thư tay gốc)
  3. `GET /me/clara` (Giao diện đọc thư)
- Toàn bộ 3 điểm chạm đều gọi hàm kiểm tra tính đủ điều kiện `isClaraEligible(acc, mapping)`:
  * Kiểm tra tài khoản có `role = 'owner'` hoặc `username in ('tuantq', 'tuan')`.
  * Hoặc `mapping.person_id in ('@I18@', '@I170@')` (thuộc nhánh con cháu trực hệ của cụ Hạnh – Đào).
- Nếu không thỏa mãn:
  * Trả về `403 Forbidden` JSON cho API: `{ error: 'CLARA_RESTRICTED', message: 'Tài liệu này thuộc quyền riêng tư của gia đình cụ Hạnh - Đào.' }`.
  * Trả về `403 HTML` cho giao diện đọc: *"Tài liệu này không thuộc phạm vi truy cập của tài khoản hiện tại."*

### 2.2. Cam kết bất biến
- Tuyệt đối giữ nguyên vẹn logic bảo vệ này, không nới lỏng hay thay đổi ranh giới bảo mật Clara trong gói nhiệm vụ Member Experience.
- Không đọc, không sao chép và không xuất nội dung các lá thư Clara ra bất kỳ log hay tệp tin nào.

---

## 3. KẾT LUẬN KIỂM TOÁN
Cấu trúc phân quyền hiện tại đã có nền móng vững chắc:
1. `requireAccount` đã được gia cố để phân biệt yêu cầu API (trả về 401/403 JSON) và yêu cầu Web (redirect 302).
2. Trạng thái `PROVISIONED` hoạt động đúng như thiết kế chốt chặn bảo mật ban đầu.
3. Ranh giới giữa Quản trị kỹ thuật (`server/admin_operations.js`) và Hoạt động thành viên (`server/member.js`) được phân lập rõ ràng theo thẩm quyền.

