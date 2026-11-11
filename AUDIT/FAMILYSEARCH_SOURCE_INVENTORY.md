# BÁO CÁO KHẢO SÁT NGUỒN DỮ LIỆU GIA PHẢ
# BATCH 01 — GENEALOGY SOURCE INVENTORY
**Dự án:** CÂY GIA PHẢ — GIATOC TRẦN TRỌNG THU  
**Thời gian thực hiện:** 2026-10-31  
**Đơn vị thực hiện:** AGY (Backend Owner)  
**Chế độ thực thi:** STRICT READ-ONLY  
**Hệ quy chiếu thẩm quyền:** Tuấn (Human Final Authority) | Emarald (Architecture Review & QC)  

---

## 1. Executive Summary

### 1.1. Bối cảnh và Mục tiêu Khảo sát
Dự án GIATOC TRẦN TRỌNG THU định hướng xây dựng hạ tầng phả hệ tự chủ, độc lập và bảo mật cao. Nguồn phả hệ gốc ban đầu được Tuấn thu thập và đồng bộ từ nền tảng **FamilySearch** thông qua phần mềm phả hệ trung gian **RootsMagic**.

Khảo sát Batch 01 được thực hiện ở chế độ **STRICT READ-ONLY** nhằm phân loại rạch ròi nguồn dữ liệu gốc (Primary Source), các nguồn dẫn xuất (Derived Artifacts), đánh giá tính toàn vẹn (Data Completeness), xác định mức độ mất mát dữ liệu qua các tầng chuyển đổi, và lập bản đồ phả hệ dữ liệu (Data Lineage) trước khi bước vào các giai đoạn xử lý dữ liệu và thiết kế kiến trúc tiếp theo.

### 1.2. Kết luận Cốt lõi
1. **Nguồn dữ liệu gốc tại chỗ (Local Primary Source):** File GEDCOM `GIADINHONGTHU.ged` (73,799 bytes, 3,967 dòng) được xuất từ phần mềm **RootsMagic 5.5.1** vào ngày **03/09/2026** theo chuẩn **GEDCOM 5.5.1 (Lineage-Linked, UTF-8)**.
2. **Bằng chứng liên kết FamilySearch (`_FSFTID`):** 100% cá nhân (`223/223` bản ghi `INDI`) trong file GEDCOM đều mang thẻ tùy biến `1 _FSFTID <FamilySearch_ID>`. Đây là bằng chứng pháp y xác thực rằng toàn bộ 223 cá nhân trong cây gia phả đều có nguồn gốc trực tiếp từ FamilySearch Tree.
3. **Mối quan hệ phả hệ & Quy mô thực thể:** File GEDCOM định danh **223 cá nhân** (`INDI`) và **68 đơn vị gia đình hạt nhân** (`FAM`). Các quan hệ huyết thống và hôn nhân bao gồm 155 liên kết cha mẹ - con cái (`FAMC`/`CHIL`) và 134 liên kết vợ chồng (`FAMS`/`HUSB`/`WIFE`).
4. **Chuỗi dẫn xuất dữ liệu (Data Lineage):**  
   $$\text{FamilySearch (Cloud)} \xrightarrow{\text{RootsMagic Sync}} \text{GIADINHONGTHU.ged} \xrightarrow{\text{export\_genealogy\_json.py}} \text{genealogy.json} \xrightarrow{\text{db\_seed.js}} \text{family\_archive.db (SQLite)} \xrightarrow{\text{nas\_migrate.js}} \text{MariaDB NAS}$$
5. **Nguồn gốc Media & Tư liệu ký ức:** Toàn bộ dữ liệu media (185 bản ghi ảnh) và liên kết ảnh cá nhân (173 bản ghi `person_media`) **không có trong GEDCOM** và **không lấy từ FamilySearch**. Chúng bắt nguồn từ thư mục ảnh lưu trữ trên Synology NAS (`/volume1/web/family-api/assets/images/`) và được ánh xạ qua hai file cấu hình JSON cục bộ (`server/data/media.json` và `server/data/person_media.json`).
6. **Khoảng trống dữ liệu lớn (Critical Gaps):**
   - **Nguồn chứng thực (Citations):** `0` thẻ `SOUR`, `0` thẻ `REPO` trong GEDCOM. Toàn bộ trích dẫn nguồn trên FamilySearch chưa được xuất vào GEDCOM.
   - **Tư liệu ký ức / Ghi chú (Notes & Memories):** `0` thẻ `NOTE` trong các bản ghi INDI/FAM.
   - **Sự kiện phụng vụ & Hôn phối:** Chỉ có `2/223` cá nhân có ngày Rửa tội (`CHR`), chỉ có `2/68` gia đình có ngày hôn phối (`MARR`).
   - **Pháp lý quan hệ:** `0` thẻ `PEDI` / `ADOP` để phân định con nuôi, dưỡng tử hay huyết thống sinh học.

---

## 2. Source Inventory

Bảng kiểm kê toàn bộ các file dữ liệu gia phả và các script xử lý chuyển đổi dữ liệu tồn tại trong repository:

| Đường dẫn (Path) | Định dạng (Format) | Kích thước (Size) | Thời gian cập nhật (Mtime) | Phân loại dữ liệu (Category) | Phân tầng (Source/Derived) | Nguồn gốc (Provenance) | Quan hệ với các nguồn khác |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GIADINHONGTHU.ged` | GEDCOM 5.5.1 | 73,799 B (3,967 dòng) | 2026-09-03 | Phả hệ cốt lõi (Gia phả học) | **Primary Source** (Local) | Xuất từ RootsMagic 5.5.1 (đồng bộ từ FamilySearch) | Đầu vào trực tiếp của `generator/export_genealogy_json.py` |
| `server/data/genealogy.json` | JSON (UTF-8) | 148,849 B | 2026-09-03 | Phả hệ có cấu trúc | **Derived Artifact** | Tạo bởi `generator/export_genealogy_json.py` | Nguồn dữ liệu nạp cho `server/db_seed.js` và backend Express |
| `design-playground/data/genealogy-snapshot.json` | JSON (UTF-8) | 148,849 B | 2026-09-03 | Bản sao phục vụ UI prototype | **Derived Artifact** | Sao chép nguyên bản từ `server/data/genealogy.json` | Dùng cho mock frontend và playground kiểm thử |
| `server/family_archive.db` | SQLite 3 | 217,088 B | 2026-09-03 | Database vận hành cục bộ | **Derived Database** | Khởi tạo bởi `server/db_seed.js` | Lưu trữ trung gian cục bộ, nạp cho migration sang NAS |
| `server/data/media.json` | JSON (UTF-8) | 48,120 B | 2026-09-03 | Danh mục tư liệu ảnh | **Secondary Source** | Quét danh mục file từ Synology NAS | Đầu vào nạp bảng `media` trong SQLite/MariaDB |
| `server/data/person_media.json` | JSON (UTF-8) | 22,410 B | 2026-09-03 | Liên kết Người - Ảnh | **Secondary Source** | Gán nhãn thủ công hoặc bán tự động | Đầu vào nạp bảng `person_media` trong SQLite |
| `generator/export_genealogy_json.py` | Python 3 | 6,155 B | 2026-09-03 | Script chuyển đổi ETL | **ETL Pipeline** | Viết nội bộ cho dự án | Đọc GEDCOM, trích xuất `_FSFTID`, chuẩn hóa tên Công giáo, xuất JSON |
| `server/db_seed.js` | Node.js | 7,420 B | 2026-09-03 | Script nạp dữ liệu (Seeder) | **Database Seeder** | Viết nội bộ cho dự án | Đọc các file JSON trong `server/data/`, tạo DDL và nạp SQLite |
| `server/nas_migrate.js` | Node.js | 4,215 B | 2026-09-03 | Script di chuyển dữ liệu | **Database Migrator** | Viết nội bộ cho dự án | Đọc SQLite `family_archive.db`, ghi sang MariaDB Synology NAS |

---

## 3. GEDCOM Examination

Khảo sát chi tiết nội dung kỹ thuật file `GIADINHONGTHU.ged`.

### 3.1. Header & Siêu dữ liệu hệ thống
- **Dòng 1-13 (`HEAD`):**
  - `SOUR`: `RootsMagic`
  - `VERS`: `RootsMagic 5.5.1`
  - `NAME`: `RootsMagic`
  - `CORP`: `RootsMagic, Inc.` (PO Box 2734, Springville, UT 84663, USA)
  - `DEST`: `RootsMagic`
  - `DATE`: `3 SEP 2026`
  - `GEDC / VERS`: `5.5.1`
  - `GEDC / FORM`: `LINEAGE-LINKED`
  - `CHAR`: `UTF-8`
- **Định nghĩa sự kiện tùy biến (`_EVENT_DEFN`):** Có 65 thẻ `_EVENT_DEFN` định nghĩa các loại sự kiện mở rộng đặc thù của RootsMagic (như LDS ordinances, các mốc phụng vụ, chứng chỉ, nghề nghiệp, di cư...). Tuy nhiên, các định nghĩa này chỉ là schema header, phần lớn không có dữ liệu thực tế trong các bản ghi `INDI`.

### 3.2. Cấu trúc và Thống kê Bản ghi Cá nhân (`INDI`)
Tổng cộng có **223 bản ghi cá nhân** (định danh từ `@I1@` đến `@I223@`). Phân tích thống kê sự phân bố các thẻ GEDCOM:

| Thẻ GEDCOM | Số lượng xuất hiện | Tỷ lệ bản ghi | Ý nghĩa & Đánh giá chất lượng dữ liệu |
| :--- | :--- | :--- | :--- |
| `INDI` | 223 | 100.0% | Định danh cá thể phả hệ |
| `NAME` | 223 | 100.0% | Họ tên đầy đủ |
| `SURN` | 219 | 98.2% | Họ phả hệ (4 cá nhân thiếu thẻ họ riêng biệt) |
| `GIVN` | 210 | 94.2% | Tên đệm và tên gọi (13 cá nhân không tách riêng GIVN) |
| `NSFX` | 81 | 36.3% | Tên thánh Công giáo (Catholic Saint Names: Giuse, Maria, Phêrô, Têrêsa, Phanxicô...) |
| `SEX` | 222 | 99.6% | Giới tính (1 cá nhân khuyết thẻ `SEX`) |
| `BIRT` | 198 | 88.8% | Sự kiện sinh (198 có ngày/năm sinh, nơi sinh) |
| `DEAT` | 28 | 12.6% | Sự kiện tử (28 cá nhân ghi nhận đã mất) |
| `BURI` | 1 | 0.4% | Sự kiện an táng |
| `CHR` | 2 | 0.9% | Nghi thức Rửa tội (Christening / Baptism) |
| `FAMC` | 155 | 69.5% | Liên kết gia đình gốc (liên kết đến cha mẹ) |
| `FAMS` | 134 | 60.1% | Liên kết gia đình phối ngẫu (liên kết hôn nhân) |
| `_UID` | 223 | 100.0% | Mã định danh toàn cục 32 ký tự Hex do RootsMagic cấp |
| `_FSFTID` | 223 | 100.0% | **FamilySearch Family Tree Person ID** (Mã cá nhân trên FamilySearch) |
| `CHAN` | 223 | 100.0% | Dấu thời gian thay đổi lần cuối |

### 3.3. Cấu trúc và Thống kê Bản ghi Gia đình (`FAM`)
Tổng cộng có **68 bản ghi gia đình** (định danh từ `@F1@` đến `@F68@`):
- `HUSB`: 66 bản ghi (2 gia đình đơn thân mẹ hoặc khuyết thông tin người chồng).
- `WIFE`: 68 bản ghi (100% gia đình có định danh người vợ).
- `CHIL`: 155 lượt liên kết con cái.
- `MARR`: Chỉ có **2 bản ghi hôn nhân** chứa ngày tháng và địa điểm kết hôn (`DATE`, `PLAC`). 66 gia đình còn lại chỉ tồn tại mối liên kết chồng-vợ mà không có thông tin ngày cưới hay hôn thư.

### 3.4. Các Thẻ GEDCOM Hoàn toàn Vắng bóng
Qua phân tích quét cú pháp toàn diện trên file `GIADINHONGTHU.ged`, các nhóm thẻ sau hoàn toàn không tồn tại (`Count = 0`):
- `SOUR` (Source Citation): 0 — Không có bất kỳ trích dẫn văn bản, tài liệu, hay bằng chứng gốc nào.
- `REPO` (Repository): 0 — Không có cơ quan lưu trữ tài liệu.
- `OBJE` (Multimedia Object): 0 — File GEDCOM hoàn toàn không kèm file ảnh, tài liệu scan hay link media.
- `NOTE` (Notes): 0 bên trong các cá nhân và gia đình.
- `PEDI` / `ADOP`: 0 — Không có thẻ phân biệt huyết thống tự nhiên, con nuôi, dưỡng tử.
- `ALIA` (Alias / Nickname): 0 — Không có tên hiệu, biệt danh truyền thống phả hệ.

---

## 4. Database Examination

Khảo sát cơ sở dữ liệu SQLite `server/family_archive.db` và quy trình nạp từ `server/db_seed.js`.

### 4.1. Cấu trúc Lược đồ (DDL & Schema)
Cơ sở dữ liệu bao gồm 7 bảng dữ liệu quan hệ:
1. `people` (223 dòng):
   - Cột: `id` (VARCHAR PK), `full_name`, `gender`, `birth_year`, `death_year`, `generation`, `is_living`, `fsid` (VARCHAR), `payload` (JSON TEXT), `created_at`, `updated_at`.
   - Cột `fsid` lưu trực tiếp FamilySearch ID được trích xuất từ thẻ `_FSFTID` của GEDCOM.
   - Cột `payload` chứa toàn bộ cấu trúc phân tích mở rộng: quan hệ cha mẹ, anh chị em, con cái, danh sách hôn nhân, và tên thánh.
2. `families` (68 dòng):
   - Cột: `id` (VARCHAR PK), `husband_id`, `wife_id`, `payload` (JSON TEXT), `created_at`, `updated_at`.
3. `timeline` (215 dòng):
   - Cột: `id`, `person_id`, `event_type`, `year`, `title`, `description`, `created_at`.
   - **Bản chất kỹ thuật:** Đây là dòng sự kiện **tổng hợp tự động (Synthetic Events)** được script `export_genealogy_json.py` và `db_seed.js` sinh ra dựa trên các mốc năm sinh (`BIRT`) và năm tử (`DEAT`) của 223 cá nhân, không phải là dữ liệu sự kiện lịch sử gia tộc độc lập.
4. `media` (185 dòng):
   - Cột: `id`, `filename`, `file_path`, `media_type`, `caption`, `year`, `tags`, `nas_sync_status`, `created_at`.
   - **Nguồn gốc:** Nạp từ `server/data/media.json`. Dữ liệu đại diện cho 185 tập tin ảnh lưu trữ trên NAS.
5. `person_media` (173 dòng):
   - Cột: `id`, `person_id`, `media_id`, `role`, `created_at`.
   - **Lỗi kỹ thuật nghiêm trọng phát hiện tại `db_seed.js`:** 100% bản ghi (173/173 dòng) có cột `media_id` nhận giá trị `NULL`. Nguyên nhân: `db_seed.js` gọi trường `pm.assetId` trong khi file `person_media.json` lưu dưới tên khóa `pm.media_id`. Do đó khóa ngoại liên kết giữa Người và Ảnh trong database hiện tại bị đứt gãy hoàn toàn.
6. `memories` (2 dòng): Lưu 2 ghi chú văn bản mẫu.
7. `app_settings` (1 dòng): Lưu cấu hình ứng dụng.

### 4.2. Mối quan hệ giữa Database và Nguồn GEDCOM
- Dữ liệu phả hệ người và gia đình (`people`, `families`) trong `family_archive.db` là bản chiếu 1:1 từ `server/data/genealogy.json`, vốn được trích xuất nguyên bản từ `GIADINHONGTHU.ged`.
- Bảng `timeline` là dữ liệu phái sinh nội suy từ ngày tháng trong GEDCOM.
- Bảng `media` và `person_media` hoàn toàn độc lập với GEDCOM, được ghép nối từ kho tư liệu ảnh Synology NAS.

---

## 5. Data Lineage

Sơ đồ phả hệ dữ liệu thể hiện rõ nguồn gốc, các bước chuyển đổi (ETL), và mức độ phát sinh dữ liệu trong toàn bộ hệ thống:

```mermaid
flowchart TD
    subgraph S1["Tầng Nguồn Gốc (Original Upstream)"]
        FS["FamilySearch Family Tree<br/>(Dữ liệu trực tuyến của Tuấn)"]
        NAS_IMG["Synology NAS Image Store<br/>(/volume1/web/family-api/assets/images/)"]
    end

    subgraph S2["Tầng Đồng Bộ Cục Bộ (Local Extraction)"]
        RM["RootsMagic 5.5.1<br/>(Desktop Software)"]
        GED["GIADINHONGTHU.ged<br/>(3,967 dòng / 223 INDI / 68 FAM)<br/>*Chứa _FSFTID*"]
        JSON_MEDIA["server/data/media.json<br/>(185 mục ảnh)"]
        JSON_PM["server/data/person_media.json<br/>(173 liên kết người-ảnh)"]
    end

    subgraph S3["Tầng Chuyển Đổi Dữ Liệu (Transformation Pipeline)"]
        PY_EXP["generator/export_genealogy_json.py<br/>(Trích xuất _FSFTID, chuẩn hóa tên Thánh)"]
        JSON_GEN["server/data/genealogy.json<br/>(223 người, 68 gia đình)"]
        JSON_SNAP["design-playground/data/genealogy-snapshot.json<br/>(Bản sao phục vụ UI)"]
    end

    subgraph S4["Tầng Lưu Trữ & Vận Hành (Operational Storage)"]
        SEED["server/db_seed.js<br/>(Script nạp CSDL)"]
        SQLITE["server/family_archive.db<br/>(SQLite cục bộ: 7 bảng)"]
        MIG["server/nas_migrate.js"]
        MARIADB["MariaDB trên Synology NAS<br/>(family_archive live)"]
    end

    FS -->|Đồng bộ tài khoản| RM
    RM -->|Xuất GEDCOM 5.5.1| GED
    GED -->|Đọc file thô| PY_EXP
    PY_EXP -->|Tạo cấu trúc JSON| JSON_GEN
    JSON_GEN -.->|Sao chép đối xứng| JSON_SNAP

    NAS_IMG -->|Quét thư mục| JSON_MEDIA
    NAS_IMG -->|Gán nhãn cá nhân| JSON_PM

    JSON_GEN -->|Nạp people & families| SEED
    JSON_MEDIA -->|Nạp media| SEED
    JSON_PM -->|Nạp person_media (Lỗi media_id)| SEED
    SEED -->|Khởi tạo & ghi dữ liệu| SQLITE

    SQLITE -->|Đọc bảng & di chuyển| MIG
    MIG -->|Ghi dữ liệu mạng nội bộ| MARIADB

    classDef source fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef intermediate fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef storage fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px;
    class FS,NAS_IMG source;
    class RM,GED,JSON_MEDIA,JSON_PM,PY_EXP,JSON_GEN,JSON_SNAP,SEED,MIG intermediate;
    class SQLITE,MARIADB storage;
```

---

## 6. Data Completeness Matrix

Ma trận đánh giá mức độ đầy đủ của các thuộc tính dữ liệu qua từng tầng lưu trữ.  
*Quy chuẩn trạng thái:* `PROVEN` (Đã kiểm chứng xác thực), `OBSERVED` (Đã ghi nhận sự tồn tại), `PARTIAL` (Thiếu hụt một phần), `BLOCKED` (Bị chặn/Khuyết hoàn toàn).

| Hạng mục Dữ liệu (Category) | Dữ liệu trong GEDCOM | Dữ liệu trong SQLite | Dữ liệu trong JSON | Nguồn gốc thực tế (Provenance) | Trạng thái (Status) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cá nhân (Individuals)** | 223 bản ghi (`INDI`) | 223 dòng trong bảng `people` | 223 phần tử trong `people` | FamilySearch qua RootsMagic | `PROVEN` |
| **Gia đình hạt nhân (Families)** | 68 bản ghi (`FAM`) | 68 dòng trong bảng `families` | 68 phần tử trong `families` | FamilySearch qua RootsMagic | `PROVEN` |
| **FamilySearch ID (`fsid`)** | 223 bản ghi có `_FSFTID` | 223 dòng có cột `fsid` | 223 phần tử có thuộc tính `fsid` | FamilySearch | `PROVEN` |
| **Họ và tên (Names)** | 223 `NAME`, 219 `SURN` | 223 `full_name` | 223 `name`, `full_name` | FamilySearch | `PROVEN` |
| **Tên Thánh Công giáo (Saint Names)** | 81 bản ghi có thẻ `NSFX` | Tích hợp trong `payload` | Tích hợp trong `name` & `cname` | FamilySearch / Gia tộc truyền khẩu | `PROVEN` |
| **Giới tính (Gender)** | 222 thẻ `SEX` (1 thiếu) | 223 `gender` (1 mặc định/null) | 223 `gender` | FamilySearch | `PARTIAL` |
| **Ngày sinh / Năm sinh (Birth)** | 198 có `BIRT` | 198 có `birth_year` | 198 có `birth_year` | FamilySearch | `PARTIAL` |
| **Ngày mất / Năm mất (Death)** | 28 có `DEAT` | 28 có `death_year` | 28 có `death_year` | FamilySearch | `PARTIAL` |
| **Quan hệ Cha Mẹ - Con cái** | 155 thẻ `FAMC` / `CHIL` | Lưu trong `payload` (JSON) | Lưu trong `parents` / `children` | FamilySearch | `PROVEN` |
| **Quan hệ Vợ - Chồng** | 134 thẻ `FAMS` / 68 `FAM` | Lưu trong `husband_id`, `wife_id` | Lưu trong `spouses` | FamilySearch | `PROVEN` |
| **Ngày hôn phối (Marriage Dates)**| 2 gia đình có `MARR` | Khuyết (chỉ lưu ID cặp đôi) | Khuyết | FamilySearch | `PARTIAL` |
| **Nghi thức Rửa tội (Baptism)** | 2 cá nhân có `CHR` | Khuyết trong cột bảng | Khuyết | FamilySearch | `PARTIAL` |
| **Trích dẫn nguồn gốc (Citations)** | 0 thẻ `SOUR` | Khuyết hoàn toàn | Khuyết hoàn toàn | FamilySearch (Chưa xuất) | `BLOCKED` |
| **Ghi chú & Tiểu sử (Notes)** | 0 thẻ `NOTE` | 2 ghi chú mẫu (`memories`) | Khuyết | Gia đình tự biên soạn | `BLOCKED` |
| **Hình ảnh & Tư liệu (Media)** | 0 thẻ `OBJE` | 185 dòng trong `media` | 185 mục trong `media.json` | Synology NAS | `OBSERVED` |
| **Liên kết Người - Ảnh** | 0 liên kết | 173 dòng (`media_id` bị NULL) | 173 mục trong `person_media.json` | Khởi tạo thủ công | `PARTIAL` |
| **Sự kiện Dòng thời gian** | 0 sự kiện tổng hợp | 215 dòng trong `timeline` | Tự động sinh từ năm sinh/tử | Nội suy tự động | `OBSERVED` |

---

## 7. Known Gaps

Các khoảng trống và mất mát dữ liệu đã được nhận diện cụ thể giữa hạ tầng FamilySearch trực tuyến và hệ thống dữ liệu hiện hữu trong repository:

### 7.1. Mất mát nguồn chứng thực (Source Citations & Evidences)
Trên FamilySearch, mỗi thông tin sinh tử, hôn nhân thường đi kèm nguồn trích dẫn chứng chỉ giáo xứ (sổ rửa tội, sổ hôn phối, sổ an táng) hoặc tài liệu hộ tịch. Tuy nhiên, file `GIADINHONGTHU.ged` chứa **0 thẻ `SOUR`** và **0 thẻ `REPO`**. Điều này đồng nghĩa với việc toàn bộ căn cứ pháp lý và tính minh bạch chứng cứ của dữ liệu phả hệ đã bị lược bỏ trong quá trình xuất từ RootsMagic ra GEDCOM.

### 7.2. Thiếu hụt tư liệu ký ức và hình ảnh gốc từ FamilySearch
Trên FamilySearch có tính năng lưu trữ "Memories" (ảnh tư liệu, câu chuyện âm thanh, file PDF ghi chép). Toàn bộ kho tư liệu này không xuất hiện trong file GEDCOM (`0 thẻ OBJE`). Các hình ảnh hiện có trong hệ thống là do Tuấn thu thập độc lập trên Synology NAS.

### 7.3. Đứt gãy dữ liệu liên kết Người - Ảnh trong Cơ sở dữ liệu
Như đã phát hiện tại Mục 4.1, script `server/db_seed.js` gặp lỗi biến (`pm.assetId` thay vì `pm.media_id`), khiến cho toàn bộ 173 bản ghi liên kết giữa cá nhân và tư liệu ảnh trong bảng `person_media` của SQLite đều mang giá trị khóa ngoại `media_id = NULL`. Người dùng truy vấn hiện tại không thể thấy ảnh gắn với bất kỳ cá nhân nào thông qua quan hệ bảng.

### 7.4. Hạn chế thông tin hôn nhân và bí tích Công giáo
Mặc dù gia tộc có truyền thống Công giáo sâu sắc (thể hiện qua 81 cá nhân có tên Thánh định dạng trong thẻ `NSFX`), hệ thống chỉ ghi nhận được:
- 2 sự kiện Rửa tội (`CHR`) trên tổng số 223 người.
- 2 ngày cưới (`MARR`) trên tổng số 68 gia đình.
- Hoàn toàn không có dữ liệu Thêm sức (Confirmation), Hôn phối Công giáo tại giáo xứ cụ thể, hay ngày giỗ chính xác (theo âm lịch hoặc dương lịch).

### 7.5. Thiếu định danh tính chất huyết thống (`PEDI` / `ADOP`)
GEDCOM và CSDL hiện tại mặc định xem tất cả 155 mối quan hệ con cái đều là huyết thống tự nhiên (`birth`). Không có thẻ `PEDI` (Pedigree linkage type: adopted, foster, sealing) để thể hiện sự phân hóa nếu có con nuôi hoặc người được đỡ đầu.

---

## 8. Unknown / Blocked

Các điểm chưa thể kiểm chứng hoặc đang bị rào cản kỹ thuật/pháp lý ngăn chặn trong khuôn khổ khảo sát read-only:

1. **Khả năng đối soát trực tiếp với FamilySearch API:**
   - *Rào cản:* Tuân thủ nghiêm ngặt chỉ thị của Tuấn: Không lưu trữ personal credential, không tự ý đăng nhập tài khoản cá nhân, và không dùng bot crawl dữ liệu FamilySearch.
   - *Hệ quả:* Không thể so sánh tự động xem cây phả hệ trực tuyến trên FamilySearch hiện tại có thêm bao nhiêu cá nhân, ảnh hay nguồn mới so với bản snapshot xuất ngày 03/09/2026.
2. **Trạng thái bảng sống trên MariaDB Synology NAS:**
   - *Rào cản:* Khảo sát hiện tại giới hạn trong phạm vi repository cục bộ, không thực hiện kết nối mạng ra NAS production.
   - *Tình trạng:* Chưa đối chiếu xem script `nas_migrate.js` đã được chạy trên môi trường live hay chưa, và liệu lỗi `media_id = NULL` có tồn tại trên MariaDB production của gia tộc hay không.
3. **Ý nghĩa của 65 định nghĩa sự kiện mở rộng (`_EVENT_DEFN`):**
   - Cần xác nhận từ Tuấn xem khi tạo cây trên RootsMagic, có những trường thông tin đặc biệt nào (như ngày giỗ âm lịch, nhánh tộc, đời thứ) từng được nhập vào các trường tùy biến nhưng bị cấu hình xuất GEDCOM bỏ qua hay không.

---

## 9. Findings và Evidence

Tập hợp các bằng chứng kỹ thuật và dữ liệu pháp y cụ thể được trích xuất trong quá trình kiểm tra mã nguồn:

### Evidence 9.1: Bằng chứng xuất xứ từ RootsMagic & Thời gian xuất
Trích đoạn 13 dòng đầu tiên của `GIADINHONGTHU.ged`:
```text
0 HEAD
1 SOUR RootsMagic
2 VERS RootsMagic 5.5.1
2 NAME RootsMagic
2 CORP RootsMagic, Inc.
3 ADDR PO Box 2734
4 CITY Springville
4 STAE UT
4 POST 84663
4 CTRY USA
1 DEST RootsMagic
1 DATE 3 SEP 2026
1 GEDC
2 VERS 5.5.1
2 FORM LINEAGE-LINKED
1 CHAR UTF-8
```

### Evidence 9.2: Bằng chứng 100% cá nhân sở hữu mã FamilySearch ID (`_FSFTID`)
Kiểm tra cấu trúc bản ghi cá nhân mẫu `@I1@` tại dòng 14-29 của `GIADINHONGTHU.ged`:
```text
0 @I1@ INDI
1 NAME [...]
2 SURN [...]
2 GIVN [...]
2 NSFX Giuse
1 SEX M
1 BIRT
2 DATE [...]
2 PLAC [...]
1 FAMC @F1@
1 FAMS @F2@
1 CHAN
2 DATE 3 SEP 2026
1 _UID 3F9E1B8C245842888D161F2E8D2E496C3A02
1 _FSFTID K4V2-XXX
```
- Số lượng bản ghi `INDI`: 223
- Số lượng dòng mang thẻ `_FSFTID`: 223 (Tỷ lệ khớp: 100%).
- Mỗi cá nhân đều có một mã định danh dạng `XXXX-XXX` trùng khớp hoàn toàn với format Person ID của FamilySearch Tree.

### Evidence 9.3: Bằng chứng logic trích xuất `fsid` trong ETL script
Trích đoạn từ `generator/export_genealogy_json.py` (Dòng 50-70):
```python
# Code snippet minh chứng logic đọc thẻ FamilySearch ID
if tag == '_FSFTID':
    current_person['fsid'] = value
```
Điều này chứng minh trường `fsid` trong `server/data/genealogy.json` và cơ sở dữ liệu SQLite được tạo trực tiếp từ thẻ `_FSFTID` của file GEDCOM.

### Evidence 9.4: Bằng chứng lỗi đứt gãy khóa ngoại `media_id` trong `db_seed.js`
Trích đoạn từ `server/db_seed.js` (Dòng 145-155):
```javascript
// Đoạn code nạp person_media trong db_seed.js
const stmt = db.prepare(`
  INSERT INTO person_media (id, person_id, media_id, role, created_at)
  VALUES (?, ?, ?, ?, datetime('now'))
`);

personMediaData.forEach(pm => {
  // LỖI: pm.assetId không tồn tại trong person_media.json (file dùng pm.media_id)
  stmt.run(pm.id, pm.personId, pm.assetId, pm.role); 
});
```
Kết quả kiểm tra trực tiếp trên CSDL SQLite `server/family_archive.db`:
```sql
SELECT COUNT(*) FROM person_media WHERE media_id IS NULL;
-- Kết quả trả về: 173 / 173 dòng NULL.
```

---

## 10. Verification Checklist & Sign-off

- [x] Đã quét toàn bộ các file dữ liệu gia phả trong repository (`GIADINHONGTHU.ged`, JSON, DB).
- [x] Đã phân tích chi tiết cấu trúc thẻ GEDCOM và định dạng `_FSFTID`.
- [x] Đã xây dựng sơ đồ Data Lineage từ FamilySearch đến SQLite và NAS MariaDB.
- [x] Đã lập Data Completeness Matrix và xác định các điểm mất mát dữ liệu (Citations, Notes, Media).
- [x] Đảm bảo tuân thủ nguyên tắc bảo mật: Không hiển thị PII chi tiết, không lưu trữ thông tin nhạy cảm trong báo cáo.
- [x] Chế độ thực thi: STRICT READ-ONLY, không chỉnh sửa file mã nguồn hay CSDL hiện có.

**Dừng tác vụ tại Completion Gate:**  
Báo cáo sẵn sàng cho **Emarald (Architecture Review & QC)** thẩm định trước khi trình **Tuấn (Human Final Authority)** phê duyệt chỉ thị tiếp theo.

