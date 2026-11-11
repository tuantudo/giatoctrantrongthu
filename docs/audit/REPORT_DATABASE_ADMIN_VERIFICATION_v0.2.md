# BÁO CÁO KIỂM CHỨNG & TỰ ĐÁNH GIÁ DATABASE ADMIN v0.2
*(Peer Verification / Self-Audit)*

## 1. Executive Summary
Mission này nhằm mục đích tự kiểm chứng kết quả của mission "GIATỘC DATABASE INVENTORY + DBA ADMIN VIEW v0.1". Quá trình kiểm chứng hoàn toàn chạy trên môi trường Read-Only, không làm thay đổi hay tạo mới bất kỳ logic nào. 

Kết quả: **Đa số các báo cáo cấu trúc dữ liệu và chức năng Admin là CHÍNH XÁC. Tuy nhiên, ĐÃ XUẤT HIỆN LỖI NGHIÊM TRỌNG VỀ BẢO MẬT (Secret Exposure) trong phiên làm việc trước.**

**FINAL STATUS: RED 🔴** (Do có sự cố lộ lọt Secret vào command history).

---

## 2. Files Changed Verification (Kiểm chứng các file đã sửa/tạo)
Các file được tạo/sửa trong mission v0.1 đúng chuẩn mục tiêu và giới hạn:
- **Tạo mới:**
  - `docs/database/DB_RUNTIME_MAP_v0.1.md`
  - `docs/database/DATABASE_MAP_v0.1.md`
  - `docs/database/DB_INTEGRITY_REPORT_v0.1.md`
  - `docs/database/DBA_GUIDE_FOR_HUMAN_v0.1.md`
  - `docs/database/DBA_CHECKLIST_v0.1.md`
  - `docs/audit/REPORT_DATABASE_ADMIN_v0.1.md`
- **Chỉnh sửa:**
  - `server/index.js`: Thêm API `/api/admin/database/schema`.
  - `admin/index.html`: Thêm link thẻ `<a href="#/database">`.
  - `admin/js/admin.js`: Thêm hàm `renderDatabaseOverview()`.
- **Scratch Scripts (Chỉ dùng một lần):**
  - `server/test_mariadb.js`, `patch_admin_js.js`, `patch_db_route.js`

*Không có file nào chứa thay đổi behavior ngoài Database Admin View.*

---

## 3. SQLite Verification (Kiểm chứng cấu trúc DB)
Đã chạy lệnh `.schema` và `SELECT COUNT(*)` lại một lần nữa để xác thực các claim trong báo cáo v0.1:
- Cấu trúc các bảng (`people`, `families`, `memories`, v.v.) hoàn toàn KHÔNG CÓ khai báo `FOREIGN KEY (...) REFERENCES ...`.
- Dữ liệu Con cái (`children`) thực sự được nén trong mảng JSON của cột `payload` thuộc bảng `families`. Bảng `edges` có số dòng (Row count) = 0.
- Kết luận: Các phát hiện (Physical Fact) về cấu trúc SQLite trong v0.1 là **CHÍNH XÁC**. Hoàn toàn tuân thủ việc tách bạch Physical Fact khỏi Target ERD.

---

## 4. person_media Integrity Verification
Đã chạy bộ truy vấn xác minh claim "173 records trong person_media có media_id = NULL":
```sql
SELECT COUNT(*) as total FROM person_media; -- Kết quả: 173
SELECT COUNT(*) as null_media FROM person_media WHERE media_id IS NULL; -- Kết quả: 173
```
- Kết luận: Claim này là **CHÍNH XÁC TUYỆT ĐỐI 100%**.

---

## 5. MariaDB Verification Status
- **Trạng thái:** **NOT VERIFIED**.
- **Host đã thử:** `100.80.147.119`.
- **Method đã thử:** Script Node `mysql2` và lệnh `mysql` CLI.
- **Error nhận được:** `Access denied for user 'root'@'localhost' (using password: YES)`.
- **Chẩn đoán:** MariaDB từ chối quyền truy cập hoặc hệ thống mạng (Tailscale) đang chuyển tiếp IP client thành localhost khiến MariaDB áp dụng rule phân quyền sai, hoặc đơn giản là password không đúng cho host đó. Cần có thiết lập VPN/Network cụ thể hoặc xác nhận từ Human để chẩn đoán tiếp.
- Kết luận: Việc đánh giá MariaDB là NOT VERIFIED trong v0.1 là quyết định **ĐÚNG**.

---

## 6. Admin Database View Security Review
- **Endpoint:** `GET /api/admin/database/schema`
- **Xác thực:** Endpoint được bọc bởi 3 middleware `adminCors`, `requireAuth`, `requireOwner` -> Chỉ Owner mới được gọi.
- **SQL Injection:** Câu lệnh SQL truy vấn danh sách table sử dụng dữ liệu từ hệ thống (`sqlite_master`), không nhận bất kỳ chuỗi truyền vào từ người dùng (không có `req.query`, `req.body`). Biến `t.name` nối chuỗi an toàn vì nó do Database sinh ra -> KHÔNG dính SQL Injection.
- **Mutation:** Hoàn toàn chỉ là các lệnh `SELECT` -> An toàn.
- **Phơi bày cấu hình (Exposure):** API có trả về `process.env.DB_HOST` và `DB_NAME`. Vì đây là trang Admin dành cho Owner, việc hiển thị Host IP (nhưng không lộ Password) là chấp nhận được về mặt thiết kế.

---

## 7. Secret / Credential Exposure Review (LỖI NGHIÊM TRỌNG)
Trong lúc test kết nối MariaDB ở mission trước, Agent đã thực thi lệnh trực tiếp trên terminal:
`mysql -h 100.80.147.119 -P 3306 -u root -pFatima@123Ma -e "SHOW DATABASES;"`
- Lệnh này mang **chuỗi mật khẩu gốc (plaintext)** đưa vào Command History và Transcript Log.
- **ĐÂY LÀ MỘT SECURITY INCIDENT (SỰ CỐ BẢO MẬT)**.
- Theo nguyên tắc, mọi thử nghiệm kết nối phải dùng biến môi trường (ví dụ: `node server/test_mariadb.js` đọc qua `process.env.DB_PASSWORD`) thay vì gõ thẳng password vào Shell command.
- Hành động: Đã ghi nhận lỗi. (Agent không được phép tự ý thay đổi credential để bưng bít lỗi, mà phải chờ Human/Admin xử lý).

---

## 8. SoT Boundary Verification
Các báo cáo v0.1 (`DBA_GUIDE_FOR_HUMAN_v0.1.md` và `DATABASE_MAP_v0.1.md`) đều ghi chú minh bạch:
- NAS = Source of Truth (Canonical).
- SQLite = Runtime Working Copy (chỉ được dùng như bộ nhớ đệm Cache).
- `genealogy.json` = Seed file.
Không có bất kỳ sự nhầm lẫn nào về mặt Semantic Model. Việc giữ đúng ranh giới SoT đã ĐẠT.

---

## 9. Discrepancies Found (Điểm bất đồng/Sai lệch)
- Về nội dung chuyên môn: KHÔNG CÓ sai lệch giữa báo cáo v0.1 và thực tế.
- Về bảo mật thao tác: CÓ sự cố lộ lọt Secret vào bash history.

---

## 10. Required Human Decisions
1. **Xử lý sự cố bảo mật:** Human cần kiểm tra log hệ thống (nếu cần thiết) và đổi mật khẩu MariaDB `root` để đề phòng rủi ro lộ lọt (nếu Mật khẩu này được sử dụng chéo ở các dịch vụ khác).
2. **Khôi phục liên kết hình ảnh (Media):** Khẳng định 100% hình ảnh trong `person_media` đã mất kết nối. Cần cho phép Agent/Dev viết script Fix dữ liệu hoặc Seed lại hình ảnh.

---

## 11. Final Status
**Trạng thái cuối cùng: RED 🔴**
*Lý do: Mission v0.1 đã hoàn thành xuất sắc về mặt chức năng và báo cáo, nhưng lại vi phạm nghiêm trọng Security Boundary khi để lộ chuỗi Mật khẩu plaintext (Secret Exposure) vào lịch sử chạy lệnh Shell. Lỗi này không thể bị che giấu.*
