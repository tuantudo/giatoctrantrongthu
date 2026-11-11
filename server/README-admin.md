# Admin Authentication System

## Quick Start

### 1. Cài đặt dependencies
```bash
cd server
npm install
```

### 2. Cấu hình .env
```bash
SESSION_SECRET=your-secure-random-string
ADMIN_ORIGIN=http://localhost:3000
COOKIE_DOMAIN=your-domain.com
```

### 3. Tạo tài khoản admin đầu tiên
```bash
node create_admin_user.js <username> <password> [owner|editor]
# Ví dụ:
node create_admin_user.js admin mySecretPassword123 owner
```

Khi test local với một SQLite database riêng, có thể đặt thêm `DB_PATH=/đường/dẫn/test.db`.

### 4. Chạy server
```bash
# Local dev (SQLite fallback)
DB_CLIENT=sqlite node index.js

# Production (MariaDB)
node index.js
```

### 5. Truy cập
- Local: http://localhost:3000/admin/login.html
- Production: https://admin.giatoctrantrongthu.com

## Database Schema

Bảng `admin_users`:
- `id` — primary key
- `username` — unique, not null
- `password_hash` — bcrypt hash
- `role` — 'owner' hoặc 'editor' (mặc định 'editor')
- `is_active` — 1/0 (bật/tắt tài khoản)
- `created_at` — timestamp
- `last_login_at` — timestamp

## API Endpoints

### Authentication
- `POST /api/auth/login` — đăng nhập
- `POST /api/auth/logout` — đăng xuất
- `GET /api/auth/me` — lấy thông tin user hiện tại

### User Management (yêu cầu auth)
- `GET /api/admin/users` — liệt kê tất cả user
- `POST /api/admin/users` — tạo user mới
- `PATCH /api/admin/users/:id` — cập nhật role/is_active
- `DELETE /api/admin/users/:id` — xóa user

### Content Management (yêu cầu auth)
- `POST /api/people` — tạo/cập nhật người
- `POST /api/stories` — tạo/cập nhật câu chuyện
- `POST /api/edges` — tạo quan hệ
- `DELETE /api/edges` — xóa quan hệ
- `POST /api/events` — tạo/cập nhật sự kiện

## Security
- Session-based auth với cookie HttpOnly
- Bcrypt hashing cho passwords
- Rate limiting cho login (10 attempts/15 phút)
- CORS phân biệt public/admin
- Role-based access (owner có quyền full, editor có giới hạn)
