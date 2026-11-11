# BẢN ĐỒ NGHIÊN CỨU HỆ QUY CHIẾU FAMILYSEARCH (PHASE 2C)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Product Owner / Human Final Authority) | Emarald (Strategic Architecture & Quality Authority)  
**Nghiên cứu & Đối soát:** AGY (Chief Orchestrator & Integration Authority)  
**Phương pháp nghiên cứu:** Reverse-Engineering từ giao diện, hành vi công khai, tài liệu FamilySearch Help Center & Tệp thiết kế [`assets/XD/FamilySearch_Baseline_01.xd`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/assets/XD/FamilySearch_Baseline_01.xd)  
**Thời điểm hoàn thành:** 06/11/2026  

---

## 1. NGUYÊN TẮC CỐT LÕI: PHÂN BIỆT HAI MÔ HÌNH HỆ THỐNG

Trước khi phân tích chi tiết, hệ thống xác lập nguyên tắc ranh giới bất biến giữa hai mô hình:

```text
┌───────────────────────────────────────────────┐     ┌───────────────────────────────────────────────┐
│              FAMILYSEARCH MODEL               │     │         GIA TỘC TRẦN TRỌNG THỤ MODEL          │
├───────────────────────────────────────────────┤     ├───────────────────────────────────────────────┤
│ • Triết lý: Một cây phả hệ duy nhất cho toàn  │     │ • Triết lý: Di sản số sống của một dòng họ cụ │
│   nhân loại (Single Shared Universal Tree).   │     │   thể, tôn nghiêm thờ phụng tiền nhân.        │
│ • Cơ chế sửa đổi: Crowd-sourced mở (Bất kỳ ai │     │ • Cơ chế sửa đổi: Đề xuất có kiểm duyệt       │
│   cũng có thể sửa dữ liệu của người đã khuất).│     │   (Proposals & Disputes qua Hội Đồng Gia Tộc).│
│ • Trọng tâm: Tìm kiếm hồ sơ lịch sử toàn cầu, │     │ • Trọng tâm: Tình thân huyết thống, truyền thống│
│   ghép nối nhân khẩu học, giải quyết trùng lặp│     │   gia phong, giáo dục thế hệ tương lai & MẠCH.│
│ • Điểm neo: ID toàn cầu ngẫu nhiên (VD: K123) │     │ • Điểm neo: Mốc cội nguồn Cố Thu (@I1@) và    │
│                                               │     │   Trang cá nhân thành viên (Me-Centric Tree). │
└───────────────────────────────────────────────┘     └───────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Không bao giờ sao chép máy móc mô hình FamilySearch.** Chúng ta học hỏi chuẩn mực tổ chức dữ liệu, cấu trúc hồ sơ khoa học và tư duy kiến trúc module của họ, nhưng bảo tồn 100% bản sắc văn hóa gia tộc Việt Nam và chính sách an ninh đóng gói của Gia Tộc Trần Trọng Thụ.

---

## 2. PHÂN TÍCH 14 NHÓM MODULE NGHIỆP VỤ CỦA FAMILYSEARCH

---

### Module 01: Person Profile (Trang Hồ Sơ Cá Nhân)
- **Mục đích nghiệp vụ:** Trung tâm tri thức về cuộc đời một cá nhân, tổng hợp mọi chiều kích: danh xưng, sự kiện sinh-tử, quan hệ gia đình, nguồn dẫn và kỷ niệm.
- **Người dùng mục tiêu:** Nhà nghiên cứu phả hệ, con cháu tra cứu thông tin tiền nhân.
- **Chức năng chính:**
  - Vitals (Thông tin sinh tử cơ bản: Tên, Giới tính, Ngày sinh, Nơi sinh, Ngày mất, Nơi mất).
  - Other Information (Thông tin bổ trợ: Tên hiệu, Tước vị, Nghề nghiệp, Nơi an táng).
  - Family Members (Bảng hiển thị cha mẹ, anh chị em, vợ/chồng, con cái).
- **Trạng thái giao diện:** Viewing (Xem), Editing (Hiệu đính), Adding Vital (Thêm sự kiện), Delete/Restore.
- **Input/Output:** In: ID cá nhân, Out: Dữ liệu cá nhân đa tầng + điểm tin cậy chứng cứ.
- **Điểm mạnh:** Cấu trúc phân tầng mạch lạc, tính khoa học cực cao.
- **Rủi ro:** Người lạ có thể tự ý sửa đổi gây tranh cãi về dữ liệu lịch sử.
- **Áp dụng cho Gia Tộc:** Đã kế thừa thành công mô hình **Hồ sơ 6 tầng (Person 6 Layers)** trong `src/js/ui/person.js` (`DEC-04`), bổ sung tầng Ký ức văn hóa và Tranh biện gia tộc TP-024.

---

### Module 02: Family Relationships (Quan Hệ Gia Đình)
- **Mục đích nghiệp vụ:** Định nghĩa cấu trúc gia đình hạt nhân và các liên kết huyết thống/hôn phối phức tạp.
- **Người dùng mục tiêu:** Quản trị viên phả hệ, con cháu ghi nhận thông tin gia đình.
- **Chức năng chính:**
  - Liên kết Cha-Mẹ-Con (`FAMC`/`CHIL`).
  - Liên kết Vợ-Chồng (`FAMS`/`HUSB`/`WIFE`), hỗ trợ đa thê/đa phu và các cuộc hôn nhân nối tiếp.
  - Phân loại quan hệ cha mẹ - con (Huyết thống, Con nuôi, Con đỡ đầu, Con nuôi theo tập quán).
- **Input/Output:** In: Hai cá nhân + loại quan hệ, Out: Family Unit ID và các ràng buộc toàn vẹn.
- **Điểm mạnh:** Mô hình hóa chính xác các mối quan hệ gia đình đa thê phức tạp trong lịch sử.
- **Áp dụng cho Gia Tộc:** Kế thừa 100% thông qua bảng `families` và `edges` trong SQLite, quản lý chuẩn xác các trường hợp đa hôn phối (như `@I18@` và `@I32@`).

---

### Module 03: Pedigree / Tree Visualization (Trực Quan Hóa Cây Phả Hệ)
- **Mục đích nghiệp vụ:** Giúp người dùng khám phá mạng lưới huyết thống trực quan qua nhiều góc nhìn.
- **Chức năng chính & Góc nhìn:**
  - Landscape (Góc nhìn ngang truyền thống): Trải rộng các thế hệ từ trái sang phải.
  - Portrait (Góc nhìn dọc thế hệ): Hiển thị cây tổ phụ từ trên xuống.
  - Fan Chart (Biểu đồ cánh quạt): Trực quan hóa 4-7 thế hệ theo hình nan quạt, phân màu dòng họ.
  - Descendancy (Cây hậu duệ): Liệt kê toàn bộ con cháu của một cụ tổ.
- **Điểm mạnh:** Hiệu năng render vượt trội, hỗ trợ co giãn và điều hướng mượt mà.
- **Giới hạn:** Góc nhìn toàn cầu dễ gây choáng ngợp cho người dùng phổ thông.
- **Áp dụng cho Gia Tộc:** Áp dụng mô hình **3-Tier Me-Centric Tree** (`DEC-03`). Người dùng là tâm điểm (Tier 2), thấy Phụ mẫu (Tier 1) và Hậu duệ (Tier 3), kèm đường dẫn huyết thống Breadcrumb về Cố Thu (`@I1@`). Đạt trải nghiệm ấm cúng, gần gũi.

---

### Module 04: Sources & Citations (Nguồn Trích Dẫn & Chứng Cứ)
- **Mục đích nghiệp vụ:** Chứng minh tính xác thực lịch sử của từng dữ kiện (ngày sinh, ngày mất, huyết thống) bằng các tài liệu lưu trữ gốc.
- **Chức năng chính:**
  - Đính kèm nguồn vào từng sự kiện cụ thể (Source Attachment).
  - Trích dẫn chi tiết: Cơ quan lưu trữ (Repository), Tập tài liệu, Số trang, URL ảnh chụp văn khế.
- **Áp dụng cho Gia Tộc:** Cực kỳ quan trọng. Hiện phả hệ gia tộc có lỗ hổng lớn là `0` thẻ SOUR trong file GEDCOM gốc. Cần áp dụng tầng Evidence trong Hồ sơ 6 tầng để lưu trữ văn tự chữ Nho, văn khế điền thổ và mộ bia làm chứng cứ xác thực.

---

### Module 05: Evidence & Research (Nghiên Cứu & Đối Soát Chứng Cứ)
- **Mục đích nghiệp vụ:** Hỗ trợ quy trình khảo cứu (Research Notes), đánh giá độ tin cậy của các giả thuyết lịch sử chưa ngã ngũ.
- **Áp dụng cho Gia Tộc:** Chuyển hóa thành module **Tranh Biện & Ghi Chú Lịch Sử TP-024 (Disputes)** trong Hồ sơ 6 tầng, giúp con cháu ghi nhận các giả thuyết về năm sinh, quê quán gốc mà không làm sai lệch cây phả hệ chính thức.

---

### Module 06: Memories / Media (Kho Ký Ức & Đa Phương Tiện)
- **Mục đích nghiệp vụ:** Lưu giữ hình ảnh, câu chuyện, ghi âm giọng nói, tài liệu gia đình.
- **Chức năng chính:** Gắn thẻ khuôn mặt (Face Tagging), viết câu chuyện dạng bài viết (Stories), nạp file ghi âm kỷ niệm.
- **Áp dụng cho Gia Tộc:** Được phân bổ vào 3 trụ cột:
  1. Kho 185 tư liệu ảnh lịch sử (Archive Domain).
  2. Không gian xuất bản MẠCH (12 bài viết văn hóa, ký ức).
  3. Thư riêng tư gửi Clara (8 bức thư gia truyền nhánh ông bà Hạnh Đào).

---

### Module 07: Timeline & Events (Dòng Thời Gian & Biên Niên Sử)
- **Mục đích nghiệp vụ:** Tái hiện cuộc đời cá nhân lồng ghép trong bối cảnh các sự kiện lịch sử của đất nước và dòng họ.
- **Áp dụng cho Gia Tộc:** Tích hợp với **Lịch Âm Dương Gia Tộc (Calendar Domain)** để tự động tính toán ngày giỗ chính xác theo chu kỳ lịch trăng, phân biệt ngày mất và ngày phụng tự truyền thống.

---

### Module 08: Places & Maps (Địa Danh & Bản Đồ Hành Trình)
- **Mục đích nghiệp vụ:** Chuẩn hóa địa danh lịch sử theo phân cấp hành chính (Xã, Huyện, Tỉnh, Quốc gia) và hiển thị bản đồ di cư.
- **Áp dụng cho Gia Tộc:** Cần thiết cho bài toán biên niên di cư: Tái hiện hành trình dòng họ từ miền Bắc di cư vào Nam lập nghiệp (được ghi nhận trong bài MẠCH 03 & 04).

---

### Module 09: Search & Discovery (Tìm Kiếm & Khám Phá)
- **Mục đích nghiệp vụ:** Tìm kiếm người thân qua tên, năm sinh, địa danh, mối quan hệ thân tộc.
- **Áp dụng cho Gia Tộc:** Triển khai **Archival List Search** hỗ trợ khử dấu và chuẩn hóa Collation tiếng Việt (`src/js/domain/genealogy/search.js`), giúp các cụ tìm đúng tên dù gõ có dấu hay không dấu.

---

### Module 10: Duplicate Detection & Merge (Phát Hiện Trùng Lặp & Hợp Nhất)
- **Mục đích nghiệp vụ:** Thuật toán AI quét và gợi ý gộp các bản ghi trùng lặp của cùng một người do nhiều người dùng tạo độc lập.
- **Đánh giá rủi ro:** Đây là tính năng gây tranh cãi và phá hỏng dữ liệu nhiều nhất trên FamilySearch khi người dùng thiếu kinh nghiệm gộp nhầm hai người khác nhau.
- **Áp dụng cho Gia Tộc:** **TUYỆT ĐỐI KHÔNG ÁP DỤNG TỰ ĐỘNG.** Cây phả hệ gia tộc được quản trị tập trung; mọi bổ sung hoặc hiệu đính phải đi qua cơ chế Đề xuất (`mod-proposals`) và do Ban Quản Trị thẩm định.

---

### Module 11: Collaboration & Contributions (Đóng Góp & Hợp Tác)
- **Mục đích nghiệp vụ:** Cho phép cộng đồng cùng đóng góp dữ liệu, mở thảo luận (Discussions) dưới từng nhân vật.
- **Áp dụng cho Gia Tộc:** Áp dụng theo nguyên tắc `DEC-05`: Tách bạch rõ 3 hình thức đóng góp:
  1. Gửi ảnh vào Kho Tư Liệu chung.
  2. Gửi bài viết/hồi ký vào MẠCH.
  3. Gửi đề xuất hiệu đính thông tin gia phả (Proposal Form TP-003).

---

### Module 12: Privacy & Permissions (Chính Sách Bảo Mật & Quyền Riêng Tư)
- **Mục đích nghiệp vụ:**
  - Quy tắc FamilySearch: Thông tin của **người còn sống (Living Persons)** được ẩn hoàn toàn (chỉ tài khoản tạo mới thấy); thông tin của **người đã khuất (Deceased Persons)** mở công khai toàn cầu.
- **So sánh & Áp dụng cho Gia Tộc:** Mô hình FamilySearch **KHÔNG ĐỦ AN TOÀN** cho gia đình Việt Nam. Đối với Gia Tộc Trần Trọng Thu:
  - Cả người sống và người đã khuất đều là tài sản tinh thần nội bộ, **KHÔNG mở công khai cho Internet**.
  - Áp dụng nguyên tắc `DEC-08`: **Quyền của Người Xuất Hiện luôn cao hơn quyền của Người Tải Lên** (cho phép người trong ảnh yêu cầu gỡ).
  - Áp dụng nguyên tắc `DEC-09`: **Cô lập tuyệt đối không gian Thư gửi Clara**.

---

### Module 13: Change History (Lịch Sử Thay Đổi & Khôi Phục)
- **Mục đích nghiệp vụ:** Lưu lại toàn bộ nhật ký (Audit Log) ai đã sửa trường nào, vào lúc nào, với lý do gì, và cung cấp nút Khôi phục (Restore).
- **Áp dụng cho Gia Tộc:** Áp dụng nhật ký kiểm toán trong Admin Control Center v2.1 để Ban Quản Trị theo dõi mọi đề xuất được duyệt hoặc từ chối.

---

### Module 14: User & Group Management (Quản Lý Nhóm & Thành Viên)
- **Mục đích nghiệp vụ:** Quản lý tài khoản, phân nhóm gia đình (Family Groups) để chia sẻ tư liệu riêng.
- **Áp dụng cho Gia Tộc:** Phân tầng tài khoản rõ ràng:
  - `Guest`: Khách ngoài họ chỉ thấy Trang nhất đối ngoại.
  - `Member`: Con cháu nội tộc xem cây phả hệ, lịch giỗ, gửi đề xuất.
  - `Branch Member (A-HD)`: Nhánh con cháu cụ Hạnh Đào được xem thêm Thư gửi Clara.
  - `Admin / Owner`: Ban Quản Trị duyệt bài, duyệt đề xuất, quản trị CSDL.

