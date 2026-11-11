# GIA TỘC DATABASE ADMIN GUIDE 
*(Dành cho Human/Data Steward - Viết bằng tiếng Việt dễ hiểu)*

Chào Tuấn, đây là cuốn cẩm nang giúp anh tự tin vận hành Database của GIA TỘC mà không cần phải là một gã DBA (Database Administrator) chuyên nghiệp 10 năm kinh nghiệm. Cẩm nang này sẽ giải thích các khái niệm CSDL thông qua chính thực tế của GIA TỘC.

---

## 1. PHẦN CƠ BẢN: DATABASE LÀ GÌ VÀ NÓ NẰM Ở ĐÂU?

**Server là gì?** 
Là cái "máy tính" đang mở 24/7 để chạy database. Trong dự án của anh, Server chính là con NAS (địa chỉ IP `100.80.147.119`).

**Database (CSDL) là gì?** 
Nó giống như một tòa nhà lưu trữ hồ sơ bọc thép. Tòa nhà đó tên là MariaDB. Bên trong tòa nhà có thể chứa nhiều phòng ban khác nhau, mỗi phòng ban là một "Schema" (hoặc cũng gọi là Database). Phòng ban của anh tên là `family_archive`.

**Runtime DB vs Source of Truth là gì?**
- **Source of Truth (Chân lý):** Là nơi chứa dữ liệu uy tín nhất, mất là mất hết, sai là sai hết. (Ví dụ: Các file gốc trên NAS).
- **Runtime DB (Thực thi):** Là nơi chứa bản copy để trang web đọc cho nhanh (như MariaDB hay SQLite của anh). Có hỏng Runtime DB, anh chỉ cần lấy Source of Truth nạp (Seed) lại là xong!

## 2. PHẦN CẤU TRÚC: TABLE, ROW, COLUMN

**Table (Bảng) là gì?**
Giống như một cuốn sổ Excel chuyên biệt.
Ví dụ: `people` là Table chỉ chứa thông tin Nhân vật. `memories` là Table chỉ chứa Ký ức.

**Row (Dòng/Bản ghi) là gì?**
Một dòng trong cuốn sổ Excel đó.
Ví dụ: Trong Table `people`, ông Cố Trần Trọng Thu nằm trên 1 Row.

**Column (Cột) là gì?**
Một thuộc tính cụ thể của Row.
Ví dụ: Trong Table `people` có cột `name` (chứa chữ "Trần Trọng Thu"), cột `birthYear` (chứa chữ "1872").

## 3. PHẦN RÀNG BUỘC: PK, FK, VÀ CONSTRAINT

**Primary Key (Khóa Chính) là gì?**
Là số Căn Cước Công Dân của cái Row đó, bắt buộc phải ĐỘC NHẤT, không bao giờ trùng.
Ví dụ: Ông Thu có Primary Key là `@I1@`. 

**Foreign Key (Khóa Ngoại) là gì?**
Là "Căn Cước Công Dân" của bảng này nhưng được ghi vào bảng kia để đánh dấu người quen.
Ví dụ: Khi một tài khoản của anh tạo Ký ức. Bảng `memories` sẽ có một cột tên là `person_id` và ghi mã `@I115@` vào. Cái mã `@I115@` đó chính là Foreign Key trỏ về Khóa Chính của bảng `people`. Nó báo cho hệ thống biết: "Ký ức này thuộc về người mang mã @I115@".

**Constraint (Ràng buộc) là gì?**
Là ông bảo vệ giữ cửa. Nếu anh tạo 1 Ký ức mà nhét đại mã `@I9999@` (không tồn tại trong bảng `people`), ông bảo vệ Constraint sẽ chửi: "Làm gì có thằng nào mã 9999 mà mày gắn Ký ức!" và đuổi anh ra (báo lỗi). 
*Lưu ý: Hiện tại DB SQLite của anh ĐANG THIẾU ông bảo vệ này. (Xem lỗi Critical trong báo cáo Integrity).*

**Index (Chỉ mục) là gì?**
Giống như mục lục ở cuối cuốn sách. Nếu không có mục lục, muốn tìm "Tuấn", DB phải lật tung 223 trang (Full Table Scan). Có Index trên cột `name`, DB chỉ cần lật đúng trang cần tìm. 

## 4. QUẢN TRỊ & BẢO VỆ

**Transaction (Giao dịch) là gì?**
Là nguyên tắc "Làm tất cả hoặc không làm gì".
Giả sử anh muốn xóa một Person, anh phải xóa cả Memories của họ. Nhỡ đang xóa Person xong, mất điện, Memories vẫn còn (thành Rác). Transaction sẽ bao bọc 2 lệnh xóa này lại, nếu đứt gánh giữa chừng, nó sẽ tự động Rollback (hủy bỏ lệnh Xóa Person) để Database không bị lỗi.

**Migration (Di cư/Chuyển đổi) là gì?**
Là quá trình anh viết code để báo cho DB biết: "Hôm nay tôi muốn thêm một Column mới tên là `avatar` vào bảng `people`". Quá trình này giúp thay đổi cấu trúc Database mà không làm mất dữ liệu cũ.

**Seed (Gieo mầm) là gì?**
Là thao tác tống một cục dữ liệu mồi vào Database trống rỗng để nó có dữ liệu ban đầu. Dự án Giatộc dùng file `genealogy.json` để Seed vào Database.

**User / Role / Privilege là gì?**
Là phân quyền cho người mở khóa tòa nhà MariaDB. (Lưu ý: Cái này là User của MySQL, KHÔNG PHẢI account đăng nhập của Website Giatộc). 
Ví dụ, user `root` (anh đang xài) là ông Giám đốc, có quyền xóa toàn bộ CSDL. Lý tưởng nhất, anh nên tạo user `giatoc_app` (Chỉ có quyền Read/Write dữ liệu, không có quyền xóa Bảng).

## TÓM LẠI: DATABASE CỦA ANH ĐANG RA SAO?

1. **Rất an toàn:** Vì cốt lõi Phả hệ vẫn nằm ở file `genealogy.json` và NAS. Cái Database hiện tại (cả MariaDB lẫn SQLite) chỉ giống như một cái RAM - đọc ra để render lên web cho lẹ.
2. **Cần tinh chỉnh Data:** Dữ liệu hình ảnh đang bị gãy link (`media_id` bị NULL). Chút nữa khi Seed lại cần sửa script Seed.
3. **Chưa cần cao siêu:** Anh chưa cần đụng tới Trigger, View, Stored Procedure vì logic hiện tại toàn dùng Node.js Backend xử lý hết rồi.

Giờ anh hãy mở **DBA_CHECKLIST_v0.1.md** để xem hàng ngày anh nên làm gì nhé!
