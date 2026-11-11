# MEMBER SYSTEM SPECIFICATION & DOMAIN AUTHORITY MAP
## Dự án: CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THỦ

*Tài liệu này được tạo từ quá trình Architecture & Forensic Audit nhằm chuẩn bị nền móng cho Member Workspace và Staff Console.*

---

## 1. DOMAIN AUTHORITY MAP
Bản đồ thẩm quyền phân định rõ nguồn gốc, quyền biên tập và nguồn dữ liệu thực thi của từng Domain trong hệ thống.

| Domain | Authoring Authority | Editorial Authority | Canonical Authority | Runtime Authority | Public Surface |
|---|---|---|---|---|---|
| **Genealogy** | Member / Staff / Historical | Staff Console | Database | API | Public Web |
| **Person** | Member / Historical | Staff Console | Database | API | Public / Profile |
| **Family** | Member / Historical | Staff Console | Database | API | Public |
| **Member Profile**| Member | Member / Staff | Database | API | Public Projection |
| **Memory** | Member | Staff (Approval) | Database | API | Public Projection |
| **Story** | Member / Staff | Staff | Database | API | Publication |
| **Media** | Member / Staff | Staff | Database / Filesystem | API | Public / Private |
| **Clara Letters** | Obsidian | Tuấn | Obsidian / Build | Build JSON / API | Publication |
| **MẠCH** | Obsidian | Tuấn | Obsidian / Build | Build JSON / API | Publication |
| **Contribution** | Member | Staff | Database (Submissions)| API | Internal (Staff) |
| **Moderation** | Staff | Staff | Database | API | Internal |
| **Account** | Member / Staff | Staff | Database | API | Private |
| **Permission** | Code / System | Staff | Database / Config | API | Runtime |

---

## 2. IDENTITY MODEL
Hiện tại, Human đã chốt nguyên tắc: **PERSON ≠ ACCOUNT**. Khảo sát source code hiện tại (bảng `people` và bảng `admin_users`) cho thấy nguyên tắc này chưa bị vi phạm, nhưng hoàn toàn thiếu sự liên kết.

* **Person**: Thực thể phả hệ khách quan (Người sống, người đã mất, tổ tiên).
* **Account**: Tài khoản định danh đăng nhập vào hệ thống (Authentication). 
* **Staff (`admin_users`)**: Các Account có đặc quyền quản trị.
* **Membership / Mapping (OPEN DESIGN DECISION)**: Hiện chưa có. Cần thiết kế bảng `person_account_link` để gán 1 Account đại diện cho 1 (hoặc nhiều) Person, qua đó cấp quyền quản lý hồ sơ của Person đó.

---

## 3. OWNERSHIP MODEL
Hệ thống phân chia quyền sở hữu theo 4 phân lớp dữ liệu:

### A. Canonical Genealogy Data (Tên, Năm Sinh, Quan hệ, Lineage)
* **Xác nhận (Authority)**: Staff / Governance Committee.
* **Sửa trực tiếp (Direct Edit)**: Chỉ Staff thông qua Staff Console.
* **Đề xuất (Propose)**: Member thông qua Member Workspace.

### B. Member-owned Data (Avatar, Bio riêng, Setting)
* **Sửa trực tiếp**: Member có quyền ghi đè (qua `/api/member/`).
* **Kiểm duyệt**: Cơ chế Hậu kiểm (Post-moderation) hoặc cho phép auto-publish đối với các trường không nhạy cảm.

### C. Contributed Data (Nội dung đóng góp, Memory, Story)
* **Tính chất**: Là Dữ liệu Nộp (Submission/Contribution), không phải Direct Edit.
* **Workflow**: Nằm ở Moderation Queue cho đến khi Staff xác nhận (Incorporated).

### D. Editorial Content (MẠCH, Clara)
* **Workflow**: Tách biệt hoàn toàn khỏi Member. Tuấn chỉnh sửa trong Obsidian và xuất bản một chiều (One-Way Publication).

---

## 4. CONTRIBUTION MODEL
Hiện tại: **KHÔNG TỒN TẠI** (Missing). Source code chưa có bất kỳ route API hay table nào xử lý Submissions.

**Đề xuất Lifecycle (Proposed State Machine):**
`DRAFT` (Member đang viết) → `SUBMITTED` (Đã nộp) → `REVIEWING` (Staff đang xem) → `ACCEPTED` (Merged vào Canonical DB) / `REJECTED` (Từ chối).

---

## 5. PERMISSION MODEL
Hiện tại hệ thống chỉ có Permission bằng Role tĩnh:
* **Authentication**: Cookie session (`express-session`).
* **Roles**: `owner`, `editor` (dựa trên cột `role` trong `admin_users`).
* **Logic**: `requireAuth` và `requireOwner` (chặn bằng middleware API).

**Những gì còn thiếu (Required cho Member System):**
* Authentication cho Member.
* **Resource-based Authorization**: Xác minh quyền của Actor lên Resource (VD: Member A chỉ được `propose edit` lên Person B nếu có quan hệ gia đình hợp lệ, hoặc chỉ được `edit` chính Profile của mình).

---

## 6. PUBLICATION MODEL
Phân định rõ 2 luồng xuất bản (Không được gộp):

1. **Genealogy Application Pipeline:**
   `Member / Application` → `Database (Canonical Data)` → `API Public Projection` → `Public Web`
2. **Editorial Publication Pipeline:**
   `Tuấn` → `Obsidian` → `Editorial Final (Generator)` → `JSON / Build Output` → `Public Web`

---

## 7. DATABASE AUDIT & STATE
* **Bảng hiện có**: `people`, `families`, `memories`, `stories`, `edges`, `media`, `person_media`, `calendar_events`, `authors`, `series`, `admin_users`, `timeline`.
* **Tham chiếu hỏng**: KHÔNG CÓ. Đợt consolidation trước đưa thư mục cũ vào `archive/legacy_database/` hoàn toàn an toàn, không có lệnh runtime nào gọi nhầm vào đây.
* **Dữ liệu cần bổ sung**: Cần thiết kế Schema cho `accounts`, `person_account_link`, `submissions`.

---

## 8. API AUDIT & BOUNDARY
Bản đồ phân rã API (API Boundary):

| Scope | Prefix | Chức năng (Hiện tại) | Quyền hạn | Đề xuất tương lai |
|---|---|---|---|---|
| **Public** | `/api/...` (hoặc `/api/public/`) | Lấy danh sách `people`, `stories` (status='PUBLISHED') | Ai cũng đọc được | Giữ nguyên. Tối ưu Public Projection. |
| **Staff** | `/api/admin/...` | CRUD mọi entity | `requireAuth` | Đổi khái niệm thành Staff API. Thêm Moderation. |
| **Member** | `/api/member/...` | **MISSING** | Chưa có | **BẮT BUỘC TẠO MỚI**. Xử lý Profile và Contribution. |

---

## 9. MEMBER WORKSPACE (INFORMATION ARCHITECTURE)
Cấu trúc IA tham khảo (Chưa có UI code, chỉ là định hướng kiến trúc):

* **`/me` (Tổng quan)**
* **`/me/profile` (Hồ sơ của tôi)**: Data Model Map vào 1 Person cụ thể.
* **`/me/family` (Gia đình)**: View quan hệ cha mẹ/con cái/vợ chồng.
* **`/me/contributions` (Đóng góp)**: Quản lý Submissions, Kỷ niệm, Ảnh.
* **`/me/settings` (Tài khoản)**: Quản lý bảo mật.

---

## 10. STAFF CONSOLE
Thư mục `admin/` hiện hành chính xác là một **Staff Console**.
* **Đã có**: Authentication, CRUD, Publishing (cột `status`), User management (Owner).
* **Cần bổ sung**: Màn hình Duyệt đóng góp (Contribution Review Inbox). Không được đổi tên hay gọi `admin/` là "Member Admin".

---

## 11. STATE / LIFECYCLE MODEL
* **Person**: `DRAFT` → `PUBLISHED` (CURRENT).
* **Contribution**: `SUBMITTED` → `ACCEPTED` / `REJECTED` (PROPOSED).
* **Editorial Article**: `DRAFT` (Obsidian) → `PUBLISHED` (CURRENT).
* **Media**: `UPLOADED` → `LINKED` → `PUBLISHED` (PROPOSED).

---

## 12. AUTHORITY CHAIN
Chuỗi cung ứng dữ liệu:

* **Clara Letter**: Tuấn → Tuấn → Tuấn → JSON Output → Public Web.
* **Genealogy Person**: Member (Đề xuất) / Staff (Nhập liệu) → Staff (Duyệt) → Canonical Database → Public API → Public Web.
* **Contribution**: Member (Nộp) → Staff (Duyệt) → Canonical Database.

---

## 13. SOURCE OF TRUTH MAP
| Artifact | Authoring Source | Canonical Source | Build Source | Runtime Source | Public Projection |
|---|---|---|---|---|---|
| **Code** | Local Workspace | Git | Vercel / NAS | Node/Python | Trình duyệt |
| **Genealogy DB**| Staff Console | MariaDB (NAS) | N/A | API Server | `/api/people` |
| **Clara Letters**| Obsidian | Obsidian | Generator JSON | API Server | Trang Clara |
| **MẠCH Magazine**| Obsidian | Obsidian | Generator JSON | API Server | Trang MẠCH |
| **Member Profile**| Member Workspace | MariaDB (Submissions) | N/A | API Server | Trang Cá Nhân |

---

## 14. PIPELINE MAP
### CURRENT PIPELINE
```text
Staff → Admin UI → API → Database → API Public → Vercel Web
Tuấn → Obsidian → (Manual Export/Generator) → API/JSON → Vercel Web
```

### TARGET PIPELINE
```text
Member → Member Workspace (Vercel) → Member API → Submissions DB 
                                                         ↓ (Staff Console Duyệt)
                                                  Canonical Database → API Public → Vercel Web
```
