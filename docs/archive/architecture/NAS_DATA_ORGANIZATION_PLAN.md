# KẾ HOẠCH TỔ CHỨC VÀ QUẢN TRỊ DỮ LIỆU DI SẢN (GIATOC NAS ARCHIVE)

## 1. Hiện trạng (Current State)
Dữ liệu hình ảnh và tài liệu gia đình hiện đang bị phân mảnh trên NAS ở nhiều thư mục mang tính cá nhân, làm việc tạm thời hoặc đồng bộ tự động:
- `/volume1/homes/tuandzain/MAC_SYNC_WORKSPACE/05_ARCHIVE/Canhan/anh tho/`
- `/volume1/homes/tuandzain/HINH ANH FAMILY/`
- `/volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO2/`

**Vấn đề:** 
- Khó truy xuất khi cần thiết (do tên file không đồng nhất, thư mục lồng ghép sâu).
- Mang tính chất "chỗ chứa" (Storage) thay vì "di sản" (Heritage).
- Rủi ro bị xóa nhầm hoặc thất lạc khi dọn dẹp các thư mục cá nhân/đồng bộ máy tính.

---

## 2. Đề xuất Cấu trúc Lưu trữ Di sản (The Heritage Archive)
Cần tách biệt rạch ròi giữa **Dữ liệu cá nhân (Personal Sync)** và **Dữ liệu Di sản Gia tộc (Heritage Archive)**. 

Đề xuất tạo một Root Shared Folder riêng trên NAS dành riêng cho việc lưu trữ có hệ thống: 
`NAS: /volume1/GIATOC_ARCHIVE/`

### Cấu trúc thư mục (Canonical Structure)

```text
/volume1/GIATOC_ARCHIVE/
├── 01_GENEALOGY/                 # Dữ liệu Gia phả
│   ├── Sodo_Giapha_2024.pdf
│   └── Hinh_Anh_Thanh_Vien/      # Nơi chứa folder Hinhgiaphabanoi2024
├── 02_RITUALS_AND_EVENTS/        # Lễ nghi và Sự kiện quan trọng
│   ├── Dam_Tang_Ba_Noi_Teresa/   # Chuyển từ DamtangBanoi sang đây
│   └── Cac_Le_Gio_Chap/
├── 03_OBJECTS_AND_RELICS/        # Kỷ vật, Bài vị, Hũ cốt (Ảnh/Scan)
│   ├── Baivi_OngBaNoi/           # Gom các file baivi_ongbanoi_Ba.jpg...
│   └── GiayTo_TroCot/            # Gom file hudungtrocot_banoi.pdf
├── 04_DOCUMENTS/                 # Văn bản, Thư từ, Ký ức
│   ├── Thu_Gui_Clara/            # Bản backup dữ liệu/bản nháp thư
│   └── Tu_Lieu_Gia_Dinh/
└── 05_MEDIA_DUMP/                # Kho lưu trữ ảnh/video chưa phân loại
```

---

## 3. Quy chuẩn Đặt tên (Naming Convention)
Để sau này AI hoặc con cháu dễ dàng tìm kiếm (search), mọi file quan trọng đưa vào Archive cần tuân thủ quy tắc:
`[YYYY_MM_DD]_[ChuDe]_[DoiTuong]_[ChiTiet].[ext]` (Nếu không rõ ngày tháng thì bắt đầu bằng `[ChuDe]`).

*Ví dụ:*
- Thay vì `baivi_ongbanoi_Ba.jpg` -> `BaiVi_BaNoi_TeresaPhamThiHung.jpg`
- Thay vì `hudungtrocot_banoi.pdf` -> `GiayTo_HuCot_BaNoi_TeresaPhamThiHung.pdf`

---

## 4. Kế hoạch Thực thi (Execution Plan)

- **Bước 1: Khởi tạo (Setup)**
  - Tạo Shared Folder `GIATOC_ARCHIVE` trên NAS.
  - Phân quyền (Permissions): Chỉ "Người giữ mạch" (tuandzain) có quyền Read/Write, set Read-only cho các tài khoản gia đình khác.

- **Bước 2: Gom tụ (Consolidation)**
  - Move/Copy toàn bộ folder `DamtangBanoi` và ảnh bài vị từ `MAC_SYNC_WORKSPACE` sang `GIATOC_ARCHIVE/02_RITUALS_AND_EVENTS/Dam_Tang_Ba_Noi_Teresa/`.
  - Move/Copy thư mục `Hinhgiaphabanoi2024` sang `GIATOC_ARCHIVE/01_GENEALOGY/`.

- **Bước 3: Tích hợp Giatoc (Web Integration)**
  - Khi cần public thông tin nào lên web `giatoctrantrongthu.com`, copy file ảnh/tài liệu đó từ NAS vào repository (thư mục `data/` hoặc `public/`) để compile thông qua `mach.json`.
  - NAS sẽ đóng vai trò là "Kho lưu trữ gốc" (Master Archive), Web là "Mặt tiền xuất bản" (Publication Surface).

- **Bước 4: Bảo quản (Preservation)**
  - Bật tính năng Snapshot/Version Control (Btrfs) cho thư mục `GIATOC_ARCHIVE` trên NAS Synology để chống ransomware.
  - Thiết lập Cloud Sync backup định kỳ thư mục này lên Google Drive hoặc kho lưu trữ đám mây.

---

> **Ghi chú thông tin (System Memory Log):** 
> *Hệ thống đã lưu lại tọa độ của dữ liệu (Teresa Phạm Thị Hưng - Bà nội). Đám tang và hình ảnh bài vị hiện đang phân tán tại `/volume1/homes/tuandzain/MAC_SYNC_WORKSPACE/05_ARCHIVE/Canhan/anh tho/` và `FLASHDRIVE-TUANTUDO2`. Kế hoạch này được lập ra để di chuyển và bảo tồn số tài liệu đó.*
