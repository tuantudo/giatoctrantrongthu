# BIÊN NIÊN SỬ TIẾN HÓA SẢN PHẨM (PRODUCT EVOLUTION HISTORY)
**CÂY GIA PHẢ — GIATỘC TRẦN TRỌNG THU**

> **Trạng thái:** CANONICAL / HISTORICAL PRESERVATION  
> **Tác giả & Quản lý:** Emarald (Analysis Authority) & AGY (Execution Coordinator)  
> **Thẩm quyền phê duyệt:** Tuấn (Human Final Authority)  
> **Mục đích:** *Ghi nhận trung thực, đầy đủ và công bằng toàn bộ các chặng đường phát triển của dự án. Tuyệt đối không viết lại lịch sử theo một baseline duy nhất, bảo tồn nguyên vẹn giá trị kỹ thuật và công sức qua từng thời kỳ.*

---

## 1. TỔNG QUAN TIẾN TRÌNH LỊCH SỬ

Hệ thống **CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU** không sinh ra như một khối kiến trúc tĩnh đồng nhất mà đã trải qua **6 thời kỳ tiến hóa liên tục**:

```text
ERA 1: CALENDAR APP ──────> ERA 2: GEDCOM INTEGRATION ───> ERA 3: STATIC VERCEL SITE
(Âm lịch, Ngày giỗ, ICS)    (FamilySearch, GIADINHONGTHU)  (giatoctrantrongthu.vercel.app)
                                                                    │
ERA 6: COMMUNITY NETWORK <── ERA 5: LOCAL DYNAMIC LAB <─── ERA 4: DYNAMIC WEB & NAS
(Đa dòng họ, Mạng lưới)     (Vibecode Lab, Clara ReBAC)    (Express, MariaDB, DESIGN-001)
```

---

## 2. CHI TIẾT CÁC THỜI KỲ TIẾN HÓA

### THỜI KỲ 1: ỨNG DỤNG LỊCH GIA TỘC (CALENDAR APPLICATION)
- **Bối cảnh & Mục tiêu ban đầu:** Nhu cầu cốt lõi đầu tiên của dòng họ là nhớ và thực hành các nghi lễ truyền thống: Ngày giỗ tổ tiên (kỵ nhật), ngày sinh các thế hệ, và các sự kiện tế lễ hàng năm.
- **Thành quả Kỹ thuật:**
  - Xây dựng thuật toán chuyển đổi Âm - Dương lịch chính xác của Việt Nam (`src/js/core/lunar-engine.js`).
  - Thiết lập 4 bộ lịch chuẩn hóa theo định dạng iCalendar (`.ics`): `CAL_01_KY_GIO.ics`, `CAL_02_SINH_NHAT.ics`, `CAL_03_SU_KIEN_LICH_SU.ics`, `CAL_04_HOAT_DONG_DONG_HO.ics`.
  - Bộ phân tích cú pháp ICS chuyên biệt (`src/js/core/ics-parser.js`) cho phép đồng bộ lịch gia đình lên điện thoại thông minh (Apple Calendar, Google Calendar).
- **Di sản bảo tồn:** Toàn bộ 265 sự kiện gia tộc trong 4 tệp ICS là tài sản thiêng liêng và không thể thay thế của dự án.

---

### THỜI KỲ 2: TÍCH HỢP DỮ LIỆU PHẢ HỆ GEDCOM (GEDCOM INTEGRATION)
- **Bối cảnh & Mục tiêu:** Số hóa toàn bộ gia phả giấy truyền thống và hồ sơ nghiên cứu trên nền tảng FamilySearch thành dữ liệu máy tính có thể xử lý.
- **Thành quả Kỹ thuật:**
  - Nhập khẩu thành công tệp phả hệ gốc `GIADINHONGTHU.ged`.
  - Xây dựng parser phân tích cú pháp chuẩn GEDCOM 5.5, trích xuất cấu trúc quan hệ cha - mẹ - con cái, thế hệ và năm sinh/mất.
  - Thiết lập mô hình dữ liệu quan hệ nền tảng: bảng `people` (nhân vật) và bảng `families` (gia đình).
- **Di sản bảo tồn:** Bộ dữ liệu 223 nhân vật và 68 gia đình đã được chuẩn hóa pháp y và lưu trữ an toàn trong SQLite `server/family_archive.db`.

---

### THỜI KỲ 3: TRANG WEB TĨNH TRÊN VERCEL (STATIC WEBSITE ON VERCEL)
- **Bối cảnh & Mục tiêu:** Đưa gia phả lên Internet để bà con dòng họ ở khắp nơi có thể truy cập nhanh chóng, ổn định và miễn phí.
- **Thành quả Kỹ thuật:**
  - Phát hành phiên bản tĩnh đầu tiên tại `https://giatoctrantrongthu.vercel.app/` (lưu trữ trong `archive/legacy_frontend/`).
  - Dựng cây phả hệ tương tác bằng SVG/Canvas, cho phép zoom in/out, tìm kiếm theo tên và xem chi tiết nhân vật.
  - Dựng giao diện Lịch theo tháng dạng ô lưới trực quan.
  - Tích hợp 19 bài viết đầu tiên về lịch sử dòng họ và hồi ký gia đình.
- **Bài học & Di sản:** Nhận diện được vấn đề bảo vệ đời tư khi các bức thư riêng tư (Clara) bị trộn lẫn vào bài viết công khai, đặt tiền đề cho nhu cầu chuyển đổi sang kiến trúc bảo mật động.

---

### THỜI KỲ 4: KHỞI XƯỚNG KIẾN TRÚC WEB ĐỘNG & NAS (DYNAMIC WEB & SYNOLOGY NAS)
- **Bối cảnh & Mục tiêu:** Khắc phục hạn chế của web tĩnh, cho phép ban quản trị thêm sửa xóa dữ liệu trực tiếp, lưu trữ ảnh độ phân giải cao và bảo mật thông tin nội bộ.
- **Thành quả Kỹ thuật:**
  - Xây dựng máy chủ backend Node.js / Express (`server/index.js`, `server/member.js`).
  - Thiết kế giải pháp hạ tầng tự lưu trữ (self-hosted) trên Synology NAS chạy MariaDB 10 và lưu trữ tài nguyên ảnh vật lý.
  - Thử nghiệm kết nối mạng qua Cloudflare Tunnel.
  - Sáng tạo bản mẫu xuất bản cao cấp **DESIGN-001 Revision Prototype** mang đậm phong cách tạp chí văn hóa, đặt nền móng cho thương hiệu di sản số `Gia Tộc Trần Trọng Thu`.
- **Di sản bảo tồn:** Mã nguồn backend Express, API contracts, và phong cách xuất bản tạp chí DESIGN-001 đã trở thành chuẩn mực trải nghiệm của website hiện tại `https://giatoctrantrongthu.com`.

---

### THỜI KỲ 5: PHÁT TRIỂN NỘI BỘ, VIBECODE LAB & KIỂM TOÁN AN NINH (LOCAL DYNAMIC & SECURITY LAB)
- **Bối cảnh & Mục tiêu:** Khi môi trường NAS và production gặp rào cản kết nối cục bộ, dự án chuyển hướng tập trung hoàn thiện bộ máy cốt lõi tại local, kiểm toán an ninh toàn diện và thiết lập môi trường thiết kế độc lập.
- **Thành quả Kỹ thuật:**
  - Đóng gói toàn bộ backend động sang CSDL SQLite cục bộ siêu nhẹ (`server/family_archive.db`) với checksum bảo vệ toàn vẹn.
  - Thiết lập **Vibecode Lab (`lab.html`)** trên cổng 8888, vận hành hoàn toàn độc lập bằng mock fixtures an toàn, trở thành xưởng thiết kế UI/UX độc quyền cho Tuấn.
  - Hoàn tất kiểm toán an ninh nghiêm ngặt, xử lý và cô lập 8 lỗ hổng (CF-01..CF-08), đặc biệt là cô lập tuyệt đối 8 bức thư nhạy cảm Clara vào `server/data/private/clara.json`.
  - Ban hành hệ điều hành tác nhân **GIATOC AIOS** tại `AGENTS.md` với mô hình Primary Agent (AGY) và Specialized Resource (Cline).
- **Di sản bảo tồn:** CSDL SQLite sạch, hệ thống kiểm thử tự động (Security, Governance, Browser QA), và môi trường Vibecode Lab hoạt động ổn định.

---

### THỜI KỲ 6: MẠNG LƯỚI CỘNG ĐỒNG GIA ĐÌNH & PHÂN QUYỀN MỞ RỘNG (FAMILY COMMUNITY NETWORK)
- **Bối cảnh & Định hướng tương lai:** Theo chỉ đạo mới nhất của Tuấn (02/11/2026), CÂY GIA PHẢ không chỉ dừng lại ở một dòng họ Trần Trọng Thu duy nhất mà mở rộng thành một **Mạng lưới các cộng đồng gia đình liên đới (Family Community Network)**.
- **Mục tiêu Kiến trúc Đích:**
  - Đa dòng họ (Multi-lineage Ontology): Cho phép các nhánh ngoại tộc, gia đình sui gia cùng kết nối và truyền tiếp câu chuyện của mình.
  - Động cơ phân quyền quan hệ ReBAC (Relationship-Based Access Control): Quyền xem dữ liệu được quyết định tự nhiên theo mối quan hệ huyết thống, hôn nhân hoặc mức độ thân thuộc (Branch-scoped access).
  - Phân định triệt để giữa **Nhận diện (Recognition - Văn hóa xuất bản công khai)** và **Tiết lộ (Disclosure - Bảo vệ bí mật đời tư sau cửa ngõ xác thực)**.

---
*Biên niên sử này được đúc kết từ hồ sơ pháp y và mã nguồn thực tế, đóng vai trò là kim chỉ nam nhận thức cho mọi thành viên và AI Agent tham gia dự án.*

