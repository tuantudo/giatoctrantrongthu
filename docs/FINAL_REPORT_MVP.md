# MISSION FINAL REPORT: LOCAL DATABASE MVP

## A. Database technology
SQLite (via `sqlite3` npm package). Được chọn vì khả năng setup ngay lập tức trên local mà không cần cài đặt thêm MySQL/PostgreSQL, đồng thời cung cấp đủ ACID compliance cho giai đoạn MVP.

## B. Database location
File vật lý: `server/family_archive.db`

## C. Schema
Gồm các bảng chính đã được chuẩn hóa:
- `people`: Chứa Person IDs, tên, thông tin cơ bản và `payload` (chứa toàn bộ metadata gốc).
- `families`: Chứa cấu trúc HUSB-WIFE-CHIL và `payload`.
- `memories`: Các mẩu chuyện/ký ức được map với Person ID.
- `timeline`: Các sự kiện lịch sử/timeline của mỗi người.

## D. Source dataset
Dữ liệu gốc được lấy từ `server/data/genealogy.json`. (File `GIADINHONGTHU.ged` cũng được quét và cho kết quả tương đương).

## E. 228 ID mapping
**Quan trọng:** Trong yêu cầu Mission ghi "228 Person IDs", tuy nhiên qua việc quét cả file GEDCOM lẫn file `genealogy.json`, tổng số lượng thẻ `INDI` (Person) chỉ là **223**. Các ID này đã được giữ nguyên gốc (Ví dụ: `@I1@`, `@I223@`) và insert trực tiếp làm Primary Key trong database mà không thay đổi (không duplicate).
5 ID còn lại có thể là do nhầm lẫn đếm cả Admin/Account hoặc số lượng Node ảo, tuy nhiên Identity gốc từ FamilySearch/GEDCOM là 223.

## F. Import result
- Seed thành công: **223 Persons**, **68 Families**, **2 Memories**, **215 Timeline Events**.
- Duplicate = 0.
- Unmatched = 0.

## G. API result
- `/api/genealogy.json` nay đã trở thành cầu nối động. Nó SELECT dữ liệu từ database, ráp lại JSON object và trả về.
- Contract API được giữ nguyên 100%, không break frontend.

## H. Frontend result
- Website gọi `/api/genealogy.json` bình thường. Các màn hình Trang chủ, Phả đồ, Chi tiết nhân vật đều hiển thị chính xác.
- Đã loại bỏ việc đọc file tĩnh.

## I. Test result
Đã viết script `server/verify_mvp.js` để test Data Integrity. Kết quả báo cáo sau khi seed luôn PASS (223 in source == 223 in DB).

## J. Commands to run locally
Các commands đã được map vào `package.json` gốc:
```bash
npm run db:reset
npm run db:seed
npm run db:verify
npm run dev
```

## K. Files changed
- Tạo mới: `server/db_reset.js`, `server/db_seed.js`, `server/verify_mvp.js`.
- Cập nhật: `package.json` (thêm các lệnh tiện ích).
- Tạo tài liệu: `docs/LOCAL_DATABASE_MVP.md`.

## L. Known limitations
- Do yêu cầu không đổi giao diện và giữ nguyên API Contract, API endpoint vẫn tên là `genealogy.json` thay vì dạng REST `/api/people`. Điều này hoàn toàn có thể refactor ở phase sau.
- Cột `payload` đang chứa JSON string để đảm bảo không rớt data cũ.

## M. VERCEL: NOT TOUCHED
Tuyệt đối không có hành động deploy, commit hay thay đổi gì tới production database.

## N. STOP
