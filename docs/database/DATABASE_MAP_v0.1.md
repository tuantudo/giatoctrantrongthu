# PHYSICAL DATABASE MAP v0.1

*(Inspect dựa trên Local SQLite `family_archive.db`)*

## A. Physical Schema Map (Các Bảng Thực Tế)
```
family_archive (SQLite)
│
├── accounts           (Tài khoản Member)
├── admin_users        (Tài khoản Admin - Legacy)
├── identity_mappings  (Mapping Account -> Person)
├── authorities        (Phân quyền - Chưa dùng)
│
├── people             (Dữ liệu Nhân vật gốc)
├── families           (Dữ liệu Gia đình Vợ-Chồng-Con)
├── timeline           (Sự kiện lịch sử)
├── edges              (Quan hệ biểu đồ - Rỗng)
│
├── memories           (Ký ức do Member viết)
├── media              (Tài nguyên hình ảnh tĩnh)
├── person_media       (Link Hình ảnh - Nhân vật)
│
├── stories            (Bài viết MẠCH/Clara)
├── authors            (Tác giả)
├── series             (Tuyển tập)
│
└── calendar_events    (Lịch sự kiện)
```

## B. Relationship Map (Mô Hình Quan Hệ Thực Tế)

Cực kỳ quan trọng: **KHÔNG CÓ FOREIGN KEY RÀNG BUỘC (CONSTRAINT) NÀO TỒN TẠI TRONG SQLITE.**
Mọi quan hệ bên dưới hoàn toàn là **APPLICATION-LEVEL RELATIONSHIP** (Liên kết ảo thông qua Node.js code).

```
accounts (id)
   │
   └── [IdentityMapping] ── identity_mappings (account_id, person_id) ── [IdentityMapping] ── people (id)

people (id)
   │
   ├── [Creator] ─────── memories (person_id)
   │
   ├── [Entity] ──────── timeline (person_id)
   │
   ├── [Subject] ─────── person_media (person_id)
   │                        │
   │                        └── [Asset] ──────── media (media_id)
   │
   └── [Husband/Wife] ── families (husband_id / wife_id)
          *Lưu ý: Children không có bảng nối rời, mà được nhét cứng vào JSON trong cột payload của bảng families!
```

## C. Target Model Comparison (ĐỐI CHIẾU THIẾT KẾ vs THỰC TẾ)

| Target Concept (Từ ERD) | Current Physical Table | Trạng thái (Status) |
|---|---|---|
| **Person** | `people` | IMPLEMENTED (Nhưng dùng JSON payload) |
| **GenealogyConstruct** | `families` | IMPLEMENTED (Lưu con cái dưới dạng JSON array) |
| **Account** | `accounts` | IMPLEMENTED |
| **Admin Account** | `admin_users` | IMPLEMENTED (Legacy, tồn tại song song accounts) |
| **IdentityMapping** | `identity_mappings` | IMPLEMENTED |
| **Delegation** | *Không có* | MISSING |
| **Authority** | `authorities` | PARTIAL (Bảng trống, code chưa xử lý) |
| **Relationship** | `edges` | PARTIAL (Bảng trống, không lưu thông tin) |
| **Claim** | *Không có* | MISSING |
| **Evidence / Source** | *Không có* | MISSING |
| **FamilySpace** | *Không có* | MISSING (Chưa tách được Space khỏi Genealogy) |
| **Membership** | *Không có* | MISSING |
| **Memory** | `memories` | IMPLEMENTED (Gắn trực tiếp vào Person) |
| **Story** | `stories` | IMPLEMENTED (Dùng chung cho MẠCH và Clara) |
| **Media** | `media` | IMPLEMENTED |
| **Submission / Review** | *Không có* | MISSING |
| **Decision / Audit** | *Không có* | MISSING |
