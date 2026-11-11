# Giatộc — SITEMAP v0.1

## 1. MỤC TIÊU & HIỆN TRẠNG
Tài liệu này hệ thống hóa toàn bộ các tuyến đường (routes) và trang (pages) hiện đang tồn tại trên Giatộc, bao gồm cả các trang public (D001 Prototype) và Member Space (Dynamic & Legacy SPAs). `[FACT]` Mọi route dưới đây được trích xuất từ cấu hình Express server (`server/index.js`, `server/member.js`) và Hash Router nội bộ (`app-v2.js`, `member-app.js`).

---

## 2. PUBLIC SPACE (Khách vãng lai)
Entry Point: `GET /` (Trang Prototype D001 - `index.html`)

* **Trang chủ (`#/`)**
  * Tóm tắt dự án, định vị dòng họ, điều hướng.
* **MẠCH - Tập san Di sản (`#/mach`)**
  * Danh sách bài viết công khai.
  * **Chi tiết MẠCH (`#/mach/bai-viet/:slug`)**
* **Giới thiệu / Về dự án**
  * `[FACT]` Prototype D001 cung cấp route `#/tu-cach-thanh-vien` hoặc `#/ve-du-an`.
* **Tra Cứu (`#/tim-kiem`)**
* **Đăng nhập (`/login`)**
  * Express Route độc lập, là cánh cổng (Auth Boundary) bước vào Member Space.

---

## 3. MEMBER SPACE (Thành viên xác thực)
Entry Point 1: `GET /me` (Member Dashboard mới).
Entry Point 2: `GET /me/tree` (Trang Cây Phả Đồ - Kế thừa ứng dụng Legacy).

* **Dashboard (`/me`)**
  * Hồ sơ cá nhân (Person Identity), Tóm tắt Gia phả, Quyền truy cập.
* **Cây Gia Phả Toàn Tộc (`/me/tree`)**
  * Trở thành Entry point cho Legacy SPA (ứng dụng `member-app.js`).
  * **Cây Phả Đồ (`#/gia-pha` hoặc `#/tree`)**
  * **Hồ sơ Cá nhân (Person Detail)** (`#/person/:id` hoặc `#/gia-pha/nhan-vat/:id`)
  * **Hồ sơ Gia đình (Family Detail)** (`#/family/:id` hoặc `#/gia-pha/gia-dinh/:id`)
  * **Danh bạ Thành viên** (`#/people`)
  * **Dòng thời gian** (`#/timeline`)
* **Ký ức (`/me/tree#/memories` hoặc `#/gia-pha/ky-uc`)**
* **Tư liệu / Media (`/me/tree#/tu-lieu` hoặc `#/archive`)**
* **MẠCH (Bản nội bộ)** (`/me/tree#/mach`)
  * **Chi tiết Bài viết** (`#/mach/bai-viet/:slug`)
  * **Chuyên đề / Series** (`#/mach/series/:slug`)
  * **Tác giả** (`#/mach/tac-gia/:id`)
* **Hệ thống Lịch / Sự kiện (`/me/tree#/lich` hoặc `#/calendar`)**
* **Tài khoản / Cài đặt Profile (`/me/tree#/cai-dat`)**
* **Đổi Mật Khẩu Tạm (`/me/change-password`)**
* **Đăng xuất (`/logout`)**

## 4. ROUTE MATRIX (Bảng Ma trận Tuyến đường)

| Route (URL) | Page (Tên Trang) | Audience | Parent | Global Nav | Local Nav | Breadcrumb | Back Target | Auth | Data Source | Current Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Trang chủ (D001) | Public | - | Có | Không | Không | - | None | `mach.json` | Prototype |
| `/#/mach` | Danh sách MẠCH | Public | `/` | Có | Không | Không | `/` | None | `mach.json` | Prototype |
| `/#/mach/bai-viet/:slug` | Chi tiết MẠCH | Public | `/#/mach` | Có | Không | Có | `/#/mach` | None | `stories` DB | Dynamic |
| `/#/tim-kiem` | Tìm kiếm | Public | `/` | Có | Không | Không | `/` | None | Client-side | Prototype |
| `/login` | Đăng nhập | Public | `/` | Không | Không | Không | `/` | None | None | Dynamic |
| `/me` | Member Dashboard | Member | - | Không | Có | Không | - | Req | `accounts`/`people` | Dynamic |
| `/me/change-password` | Đổi Mật Khẩu | Member | `/me` | Không | Không | Không | `/me` | Req | `accounts` | Dynamic |
| `/me/tree#/gia-pha` | Cây Phả Đồ | Member | `/me/tree` | Không | Có | Không | `/me` | Req | `genealogy.json` | Legacy SPA |
| `/me/tree#/person/:id` | Hồ sơ Cá nhân | Member | `#/gia-pha`| Không | Có | Có | `#/gia-pha` | Req | `genealogy.json` | Dynamic UI |
| `/me/tree#/family/:id` | Hồ sơ Gia đình | Member | `#/gia-pha`| Không | Có | Có | `#/gia-pha` | Req | `genealogy.json` | Dynamic UI |
| `/me/tree#/ky-uc` | Ký ức | Member | `/me/tree` | Không | Có | Không | `/me` | Req | None (Future) | UI only |
| `/me/tree#/tu-lieu` | Thư viện Tư liệu | Member | `/me/tree` | Không | Có | Không | `/me` | Req | `media.json` | Dynamic UI |
| `/me/tree#/mach` | MẠCH (Nội bộ) | Member | `/me/tree` | Không | Có | Không | `/me` | Req | `mach.json` | Dynamic UI |

