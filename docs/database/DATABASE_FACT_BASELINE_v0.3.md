# DATABASE FACT BASELINE v0.3

*Tài liệu này chỉ chứa những sự thật (FACT) đã được kiểm chứng trực tiếp (READ-ONLY) trên SQLite Database của dự án GIA TỘC.*

## A. SQLite Location & Size
- **Path:** `server/family_archive.db`
- **File Size:** ~404 KB (413696 bytes).

## B. Database Identity & Role
- **Identity:** SQLite Database
- **Role:** Local Development / Runtime Working Copy.
- **Source of Truth:** NAS (genealogy, images).
- **Security Status:** `SECRET EXPOSURE = CONFIRMED` (Trong mission v0.2, credential MariaDB dạng plaintext đã lọt vào Command History / Transcript).

## C. Tables, Row Counts, và Cơ chế JSON
| Bảng (Table) | Row Count | Cấu trúc Khóa Chính (PK) |
|---|---|---|
| `people` | 223 | `id TEXT PRIMARY KEY` |
| `families` | 68 | `id TEXT PRIMARY KEY` |
| `timeline` | 215 | `id TEXT PRIMARY KEY` |
| `media` | 185 | `id TEXT PRIMARY KEY` |
| `person_media` | 173 | `relation_id TEXT PRIMARY KEY` |
| `memories` | 2 | `id TEXT PRIMARY KEY` |
| `stories` | 1 | `id TEXT PRIMARY KEY` |
| `accounts` | 1 | `id TEXT PRIMARY KEY` |
| `identity_mappings` | 1 | `(account_id, person_id) PRIMARY KEY` |
| `admin_users` | 2 | `id TEXT PRIMARY KEY` |

Các bảng trống (0 rows): `edges`, `authorities`, `calendar_events`, `authors`, `series`.

## D. Columns Đặc Biệt (Payload)
- Các bảng: `people`, `families`, `memories`, `timeline`, `media` đều chứa một cột mang tên `payload` kiểu `TEXT`.
- **FACT:** `payload` này lưu trữ nguyên bản JSON sinh ra từ hệ thống gốc. Do đó, các quan hệ phức tạp (như danh sách con cái) được nhét vào trong mảng JSON của `payload`, chứ không có cột độc lập.

## E. Foreign Keys & Indexes
- **Foreign Keys thực sự:** KHÔNG TỒN TẠI ở mức Schema. Mọi liên kết (vd: `memories.person_id`) đều là Application-level Relationship, database không ràng buộc (No Constraint).
- **Indexes:** KHÔNG TỒN TẠI (ngoại trừ autoindex do Primary Key tự sinh).
- **Triggers / Views:** KHÔNG TỒN TẠI.

## F. MariaDB Status
- **Host:** `100.80.147.119`
- **Status:** `NOT VERIFIED`. Không có quyền truy cập ở môi trường Agent. Không thể kiểm chứng liệu MariaDB có cùng cấu trúc hay không. 
- *Lưu ý:* SQLite VERIFIED ≠ MariaDB VERIFIED.
