# Hướng dẫn chạy Giatộc MVP trên Local Database

Phiên bản này đã chuyển đổi toàn bộ data từ file JSON static sang database SQLite thực thụ. Database chứa 223 Person records (đúng với dữ liệu trong file `server/data/genealogy.json` và `GIADINHONGTHU.ged`).

## 1. Vị trí Database
- Công nghệ: **SQLite**
- Đường dẫn file: `server/family_archive.db`
- File gốc lấy dữ liệu: `server/data/genealogy.json`

## 2. Các lệnh NPM quan trọng

Từ thư mục gốc của project (chứa file `package.json`), bạn có thể chạy:

- **Reset database** (Xóa sạch bảng dữ liệu phả hệ và tạo lại):
  ```bash
  npm run db:reset
  ```

- **Seed database** (Import dữ liệu từ file `genealogy.json` vào SQLite):
  ```bash
  npm run db:seed
  ```

- **Verify database** (Kiểm tra xem số lượng bản ghi có khớp không):
  ```bash
  npm run db:verify
  ```

- **Chạy Local Server**:
  ```bash
  npm run dev
  ```
  Sau khi chạy, mở `http://localhost:3000` trên trình duyệt.

## 3. Quy trình làm việc Local
1. `npm run db:reset`
2. `npm run db:seed`
3. `npm run db:verify`
4. `npm run dev`

Khi Dev Server đang chạy, Frontend Public SPA sẽ không còn lấy `genealogy.json` cứng từ disk nữa, mà gọi qua endpoint `/api/genealogy.json` -> API này sẽ query vào SQLite database và trả về đúng dữ liệu như cũ.
