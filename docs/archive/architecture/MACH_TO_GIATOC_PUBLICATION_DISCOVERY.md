# MACH TO GIATOC PUBLICATION DISCOVERY
*Tài liệu Khảo sát Kiến trúc & Di sản Ý tưởng*
*Ngày: 2026-09-15*

---

## 1. Executive Summary
Báo cáo này phân tích sự tiến hóa của "MẠCH" từ một dự án độc lập định hướng "Ấn phẩm/PDF" (lưu tại Obsidian) trở thành một hệ thống Xuất bản Số (Digital Publication System) tích hợp bên trong dự án `giatoctrantrongthu`. 

Phát hiện quan trọng nhất: MẠCH không bắt đầu như một hệ thống CMS hay mạng xã hội. Nó bắt đầu như một **"Toà soạn" (Newsroom)** và **"Ấn phẩm" (Publication)** với tính biên tập (editorial) cực kỳ khắt khe, xoay quanh việc kể chuyện liên thế hệ. Trong Giatoc, MẠCH đang chuyển dịch từ định dạng Issue tĩnh sang một Digital Publication liên tục, nhưng bản chất "Editorial Voice" vẫn là cốt lõi.

---

## 2. Mạch thực sự là gì
[VERIFIED] MẠCH ban đầu được định nghĩa trong `MACH_PROGRAM.md` là một "Cultural Continuity Program" (Chương trình nối tiếp văn hóa) nhằm:
- Lưu giữ ký ức gia đình và khôi phục tính liên tục giữa các thế hệ.
- Chuyển hóa ký ức thành tri thức có cấu trúc.
- Đóng gói dưới dạng các "Publication" (Ấn phẩm) để trao truyền.

[VERIFIED] MẠCH không chỉ là kho lưu trữ dữ liệu (archive); nó là *hệ phương pháp luận ghi nhận và diễn giải ký ức*. Sự thành công của MẠCH được định nghĩa bằng "hành vi trao truyền tiếp tục tồn tại" chứ không phải "dữ liệu được lưu trữ".

---

## 3. Mạch Information Architecture
[VERIFIED] Cấu trúc không gian của MẠCH ban đầu gồm các Domain độc lập, phân định rõ Authority:
- `MACH_PROGRAM/`: Hiến pháp dự án (Sứ mệnh, Phạm vi).
- `MACH_SYSTEM/`: Hệ điều hành biên tập (Ontology, Roles, Typography).
- `PROJECTS/`: Không gian sản xuất (Active Issues).
- `OUTPUTS/`: Ấn phẩm đầu ra (PDF, Book).
- `RESEARCH/`: Tư liệu thô, Context.
- `ARCHIVE/`: Lịch sử, Snapshot.

---

## 4. Mạch Editorial Model
[VERIFIED] MẠCH vận hành bằng mô hình Toà soạn tối thiểu (Minimum Viable Newsroom).
- Có 24 Role được định nghĩa, chia thành Human, AI-Augmented, và AI-Exclusive.
- Các vai trò lõi: *Founder* (giữ sứ mệnh), *Editor-in-Chief* (kiến trúc Issue, emotional curve), *Art Director*, *Fact Checker*, *Oral Historian*.
- AI được giới hạn nghiêm ngặt ở vai trò *Editorial Intelligence* (kiểm chứng, phản chiếu, chuẩn hóa), tuyệt đối không có "Authorial Authority".

---

## 5. Mạch Publication Model
[VERIFIED] Vì sao MẠCH được hình dung là PDF/Ấn phẩm?
- Mô hình xuất bản ban đầu dựa trên khái niệm **Issue** (Kỳ xuất bản).
- Tư duy thiết kế bài viết dựa trên **Spreads** (trang đôi InDesign/PDF), **Visual Rhythm** (nhịp điệu hình ảnh), và **Pacing** (mật độ nội dung).
- Mục tiêu là tạo ra một trải nghiệm đọc có tính "đóng" (curated experience) thay vì một luồng dữ liệu (feed) vô tận.

---

## 6. Mạch Content Model
[VERIFIED] Bài viết trong MẠCH không phải là một blog post đơn thuần. Template `00 - CANONICAL ARTICLE TEMPLATE.md` cấu trúc một bài viết thành 2 phần:
1. **ARTICLE DNA:** Chức năng trong Issue, Thesis (Luận điểm), Core Tension (Căng thẳng cốt lõi), Human Truth, Desired Reader Shift.
2. **ARTICLE ORCHESTRATION NOTES:** Visual States, Required Images, Required Pacing, Typography Notes.

---

## 7. Mạch Archive Model
[VERIFIED] Trong MẠCH, Archive (Lưu trữ) tồn tại độc lập với Publication (Xuất bản).
- Xuất bản là sản phẩm đã qua màng lọc biên tập (Editorial Filter).
- Tư liệu thô (Hình ảnh, Scan gia phả, Lời kể chưa xác minh) nằm ở `RESEARCH/` hoặc `ARCHIVE/` và chỉ được trích xuất (curate) vào ấn phẩm khi cần thiết.

---

## 8. Các Entity Chính trong MẠCH
[VERIFIED]
1. **Program**: Dự án tổng thể (MẠCH).
2. **Issue**: Kỳ xuất bản (VD: ISSUE_01).
3. **Article / Story**: Bài viết (đơn vị nội dung chính).
4. **Series**: Tuyển tập có tính xâu chuỗi (VD: Thư gửi Clara).
5. **Spread**: Khối hiển thị hình ảnh + văn bản.
6. **Author / Contributor**: Người chấp bút hoặc cung cấp lời kể.
7. **Asset**: Hình ảnh, Document thô.

---

## 9. Các Workflow đã tồn tại
[VERIFIED] Quy trình xuất bản tuyến tính (Folder-based Lifecycle) thấy rõ trong `PROJECTS/ISSUE_01/`:
1. `WORKING/`: Viết nháp, lắp ráp fragment.
2. `AUDIT/`: Kiểm tra chất lượng, fact-check.
3. `CANONICAL/`: Source of truth của bài viết, chờ dàn trang.
4. `SPECS/`: Yêu cầu kỹ thuật/thiết kế.
5. **Output Generation**: Render ra PDF/LaTeX thông qua script.

---

## 10. Thư gửi Clara Case Study
[VERIFIED] "Thư gửi Clara" là một case study quan trọng minh chứng cho Series.
- **Series Structure:** Một chuỗi thư đánh số (001, 002...).
- **Author:** Duy nhất 1 tác giả (Tuấn).
- **Intended Audience:** Clara (cháu gái nội) và các thế hệ sau (Tina, Rina, Tito...).
- **Relationship:** Truyền tải bối cảnh thời đại, giải thích tên gọi, niềm tin tôn giáo, triết lý gia đình.
- **Publication Model:** Render tự động ra PDF / Sách (`publish_book.py`, LaTeX, Typst).
- **Metadata:** Frontmatter tối giản (created, updated).
- **AI Rule:** Document `CLARA_PROJECT_RULES.md` thiết lập quy tắc thép: AI không được thay đổi nội dung, không có thẩm quyền quyết định kiến giải.

---

## 11. Evolution Map: MẠCH → GIATOC

[VERIFIED] BẢN ĐỒ TIẾN HÓA:
- **Mạch Article** → **Giatoc Bài Viết (Story/Mach)** (`mach.json`).
- **Mạch Series** → **Giatoc Tuyển tập** (`SITEMAP: 2.6 Tuyển tập`). Thư gửi Clara là một Series nằm trong nhánh này.
- **Mạch Author/Contributor** → **Giatoc Tác giả** (`SITEMAP: 2.7 Tác giả`). Liên kết với Person Entity trong Gia phả.
- **Mạch Archive/Research** → **Giatoc Tư Liệu** (`SITEMAP: 3.0 Tư liệu`).

[INFERRED] QUÁ TRÌNH CHUYỂN DỊCH:
1. MẠCH (Cultural Program) 
2. ↓ Ấn phẩm PDF (InDesign/LaTeX mindset, tĩnh, Issue-based) 
3. ↓ Tích hợp vào Web Gia Phả (giatoctrantrongthu) 
4. ↓ Digital Publication (Bỏ Issue tĩnh, thay bằng Tuyển chọn/Series động, nhưng giữ nguyên tính "Curated Editorial").

---

## 12. Những gì Giatoc hiện đã có
[VERIFIED]
- Phân định không gian Public/Member, bảo vệ bản chất "Curated" của trang chủ.
- Nhánh `#/mach` (Tạp chí nội bộ) để hiển thị lưới bài viết.
- IA đã định nghĩa rõ các loại hình: Ký ức, Suy tưởng, Thư, Giai thoại.
- Kết nối dữ liệu thực (API `mach.json`) vào giao diện mới.

---

## 13. Những gì Giatoc đang thiếu
[VERIFIED]
- Dữ liệu Metadata chuẩn cho MẠCH trong Giatoc (hiện tại `mach.json` chưa hỗ trợ đầy đủ Concept "Series", "Tension", "Reading Pacing").
- Giao diện đọc bài (Article Detail) chưa phản ánh được "Visual Rhythm" hay "Spreads" như tư duy ấn phẩm gốc.
- Thiếu hệ thống quản trị nội dung (Owner Control Plane) cho phép áp dụng Editorial Workflow (`WORKING` → `CANONICAL`).

---

## 14. Những gì CHƯA nên xây
[VERIFIED] Dựa trên DNA của dự án, KHÔNG NÊN xây dựng:
- Mạng xã hội nội bộ (Feed/Timeline user tự post vô tội vạ). MẠCH đòi hỏi tính biên tập (Editorial Filter).
- CMS đồ sộ như báo chí hằng ngày (News site). MẠCH là "Slow Media" / "Publication".
- Hệ thống User Comment. Ký ức được lưu giữ qua đóng góp có định hướng, không phải qua tranh luận real-time.

---

## 15. Architectural Insights
[INFERRED]
Việc chuyển từ "Issue tĩnh (PDF)" sang "Web/Digital" đòi hỏi một thay đổi kiến trúc:
- Thay vì gộp bài vào 1 cụm "Issue 01", hệ thống số cần dùng "Series" hoặc "Topic" làm trục phân loại chính.
- Khái niệm "Spread" (Trang đôi) của in ấn cần được dịch mã (translate) thành "Section/Component Block" trên web (ví dụ: Full-bleed image block, Quote block).
- Tuyến đường `#/mach` của Giatoc phải hoạt động như một Front-page của một Tòa soạn thu nhỏ, tập trung vào Narrative thay vì chỉ liệt kê dữ liệu.

---

## 16. Open Questions
1. Trong Giatoc, khái niệm "Issue" có còn tồn tại không, hay sẽ bị thay thế hoàn toàn bởi cấu trúc "Tuyển tập" (Series)?
2. Ai sẽ đóng vai trò Editor-in-Chief trên Giatoc Web nếu MẠCH cho phép nhiều tác giả (Multi-author)?
3. Workflow biên tập (`WORKING` → `CANONICAL`) sẽ diễn ra trong Giatoc Owner Control Plane, hay vẫn giữ thói quen soạn thảo trên Obsidian và push lên API?
