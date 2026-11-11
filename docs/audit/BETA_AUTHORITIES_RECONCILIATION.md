# BÁO CÁO ĐỐI SOÁT PHÂN QUYỀN BETA (BETA AUTHORITIES RECONCILIATION)

**Dự án:** Gia Tộc Trần Trọng Thu  
**Cấp thẩm quyền:**  
- **Tuấn:** Human Final Authority  
- **Emarald:** Strategic Architecture & QC Authority  
- **AGY:** Execution Agent  
**Thời điểm đối soát:** 2026-11-11 16:00 (GMT+7)  
**Chế độ thực thi:** STRICT READ-ONLY *(Không sao chép, không sửa đổi dữ liệu)*

---

## 1. KHẢO SÁT 2 BẢN GHI `authorities` HIỆN CÓ TRÊN PRODUCTION MARIADB

Truy vấn trực tiếp từ CSDL Production `family_archive` trên NAS Synology:

### Bản ghi 1:
- **`id`:** `2ea0c214-7939-4d32-8cb7-0f0147fc9b7d`
- **`actor_type`:** `ACCOUNT`
- **`actor_id`:** `a8b1027f-78c5-49ae-85f0-6d80783183ea`
- **`resource_type`:** `SYSTEM`
- **`resource_id`:** `*`
- **`action`:** `ADMIN_ACCESS`
- **Tài khoản liên kết trong `accounts`:**  
  `{"id":"a8b1027f-78c5-49ae-85f0-6d80783183ea", "username":"owner_e2e", "role":"owner", "status":"DISABLED"}`
- **Người dùng quản trị liên kết trong `admin_users`:**  
  `{"id":1, "username":"owner_e2e", "role":"owner", "is_active":0}`
- **Trạng thái kích hoạt & Hiệu lực phân quyền thực tế:**  
  **`HOÀN TOÀN KHÔNG CÓ HIỆU LỰC (INOPERATIVE / DORMANT)`**.  
  Do tài khoản `owner_e2e` đã bị vô hiệu hóa cứng (`is_active: 0` và `status: DISABLED`), middleware `requireOwner` và `requireAuth` sẽ chặn ngay tại bước kiểm tra trạng thái hoạt động và hủy phiên. Bản ghi này không cấp bất kỳ quyền hạn thực tế nào trên Production.

---

### Bản ghi 2:
- **`id`:** `733c5844-6b57-4848-be61-211d38a246fa`
- **`actor_type`:** `ACCOUNT`
- **`actor_id`:** `b640d5ea-32db-420a-9660-ab5f4b97e579`
- **`resource_type`:** `SYSTEM`
- **`resource_id`:** `*`
- **`action`:** `ADMIN_ACCESS`
- **Tài khoản liên kết trong `accounts`:**  
  `{"id":"b640d5ea-32db-420a-9660-ab5f4b97e579", "username":"editor_e2e", "role":"editor", "status":"DISABLED"}`
- **Người dùng quản trị liên kết trong `admin_users`:**  
  `{"id":2, "username":"editor_e2e", "role":"editor", "is_active":0}`
- **Trạng thái kích hoạt & Hiệu lực phân quyền thực tế:**  
  **`HOÀN TOÀN KHÔNG CÓ HIỆU LỰC (INOPERATIVE / DORMANT)`**.  
  Tương tự như trên, tài khoản `editor_e2e` đã bị vô hiệu hóa cứng (`is_active: 0` và `status: DISABLED`).

---

## 2. KẾT LUẬN NGUỒN GỐC & RỦI RO KHI NHÂN BẢN SANG BETA

1. **Nguồn gốc bản ghi:**  
   Cả 2 bản ghi quyền hạn này được sinh ra tự động bởi hàm `syncAdminUserToAccount` trong quá trình chạy kiểm thử chấp nhận E2E trước đây cho các tài khoản giả lập `owner_e2e` và `editor_e2e`.
2. **Rủi ro mồ côi dữ liệu (Orphaned Foreign Keys):**  
   Trong kế hoạch nạp dữ liệu Beta Step 2B, toàn bộ các tài khoản trong bảng `accounts` và `admin_users` của Production **bị loại trừ 100% (EXCLUDE)** nhằm đảm bảo CSDL Beta sạch hoàn toàn.  
   Nếu chúng ta sao chép 2 bản ghi `authorities` này sang `family_archive_beta`, các trường `actor_id` sẽ trỏ vào các ID tài khoản **không hề tồn tại** trong bảng `accounts` của Beta. Đây là rác dữ liệu mồ côi (dangling references).

---

## 3. ĐỀ XUẤT KIẾN TRÚC: `EXCLUDE & RECREATE DYNAMICALLY`

| Phương án xem xét | Đánh giá kỹ thuật | Khuyến nghị của AGY |
| :--- | :--- | :---: |
| **Phương án 1: INCLUDE** (Sao chép 2 dòng sang Beta) | Tạo ra 2 bản ghi mồ côi vô nghĩa trỏ vào tài khoản không tồn tại. | ❌ **BÁC BỎ** |
| **Phương án 2: EXCLUDE & KHỞI TẠO RỖNG** (Khuyến nghị) | Khởi tạo bảng `authorities` trong `family_archive_beta` với cấu trúc chuẩn nhưng **RỖNG (0 bản ghi)**, đồng bộ với 5 bảng vận hành sạch. | ✅ **KHUYẾN NGHỊ CAO NHẤT** |
| **Phương án 3: RECREATE DYNAMICALLY** | Khi cấp tài khoản quản trị Beta (hoặc khi tài khoản đăng nhập lần đầu), hệ thống sẽ tự động sinh quyền `authorities` gắn đúng `account_id` mới. | ✅ **THỰC THI THEO QUY TRÌNH NÀY** |

### Tác động đến số liệu nạp Baseline Step 2B:
- **Nếu giữ nguyên 2 bản ghi:** Baseline nạp `1,180` dòng (gồm 2 dòng mồ côi).
- **Nếu làm sạch bảng `authorities` (Khuyến nghị chuẩn):**
  * Số bảng dữ liệu cốt lõi nạp vào Beta: **13 bảng**.
  * Tổng số bản ghi baseline thực nạp: **`1,178 bản ghi`** (`1,180 - 2 = 1,178 dòng`).
  * 6 bảng vận hành & phân quyền (`accounts`, `admin_users`, `identity_mappings`, `authorities`, `proposals`, `audit_logs`) đều là **EMPTY SCHEMA (0 dòng)**.

---

**DỪNG TẠI HUMAN CHECKPOINT — KHÔNG SAO CHÉP DỮ LIỆU KHI CHƯA ĐƯỢC TUẤN DUYỆT.**

