# BÁO CÁO NGHIỆM THU MẠCH BATCH-M01
## Chuẩn hóa Canonical Source, Nâng cấp Compiler & Tái tạo MACH_AUDIT.md

**Thời gian thực hiện:** 2026-11-01 12:45:00+07:00  
**Thực hiện bởi:** AGY — Execution Coordinator  
**Thẩm định & Giám sát:** Tuấn (Human Final Authority) & Emarald (Analysis & Governance)  
**Trạng thái nghiệm thu:** **HOÀN THÀNH (DONE) — ĐẠT 7/7 SUCCESS CRITERIA**  

---

## 1. TỔNG QUAN VÀ MỤC TIÊU BATCH-M01

Thực hiện theo chỉ đạo tại `EXECUTION DIRECTIVE — MẠCH BATCH-M01`, mục tiêu của Batch-M01 là:
1. Xác minh thực địa canonical source directory giữa hai đường dẫn được chỉ định.
2. Kiểm tra mã nguồn compiler `mach_audit_pipeline.sh`, xác định nguyên nhân gốc rễ khiến `MACH_AUDIT.md` bị đóng băng từ ngày 28/05/2026.
3. Đối chiếu và phân tích phạm vi 5 file tài liệu nền tảng (`01`, `02`, `03`, `08`, `20`).
4. Điều chỉnh compiler path sang cơ chế tự động nhận diện đường dẫn (dynamic & portable), đưa `MACH_AUDIT.md` và `MACH_SOURCE_OF_TRUTH.md` về trạng thái đồng bộ tuyệt đối.
5. Biên dịch lại toàn bộ hệ thống tài liệu MẠCH, kiểm định tính ổn định tái lập (idempotency) và bảo toàn tính toàn vẹn của kho mã nguồn.

---

## 2. KẾT QUẢ XÁC MINH CANONICAL SOURCE (M01.1)

Hệ thống đã thực hiện kiểm tra pháp y hai đường dẫn được chỉ định trong chỉ thị:

| Đường dẫn kiểm tra | Tồn tại | Trạng thái thực tế | Đánh giá |
| :--- | :---: | :--- | :--- |
| `/Users/tuan/Obsidian/CAYGIAPHA/MACH_SYSTEM/` | ❌ KHÔNG | `No such file or directory`. User `tuan` không tồn tại trên macOS (`whoami` = `tuantq`). Thư mục `CAYGIAPHA` không tồn tại trong Obsidian. | Đường dẫn lịch sử cũ bị hardcode. |
| `/Users/tuantq/Obsidian/20_PROJECTS/Mach/MACH_SYSTEM/` | ✅ CÓ | Tồn tại đầy đủ với 43 mục cấp gốc (31 file `.md`, 5 thư mục con: `DNA`, `TAXONOMY`, `ONTOLOGY`, `TYPOGRAPHY`, `KNOWLEDGE`, 1 thư mục `BACKUP`, 1 compiler script). | **CANONICAL SOURCE DUY NHẤT & ĐANG HOẠT ĐỘNG.** |

- **Kết luận:** Hai đường dẫn không phải symlink hay mirror; đường dẫn `/Users/tuan/...` là cấu hình cũ từ môi trường trước đó. Canonical source duy nhất chứa toàn bộ active source files là:  
  👉 `/Users/tuantq/Obsidian/20_PROJECTS/Mach/MACH_SYSTEM/`

---

## 3. NGUYÊN NHÂN GỐC RỄ KHIẾN MACH_AUDIT KHÔNG ĐƯỢC CẬP NHẬT (M01.2)

Khảo sát lịch sử và mã nguồn compiler cũ cho thấy 4 nguyên nhân khiến `MACH_AUDIT.md` bị ngắt quãng từ 28/05/2026:
1. **Hardcoded Root Path:** Dòng 13 của `mach_audit_pipeline.sh` hardcode `ROOT="/Users/tuan/Obsidian/CAYGIAPHA"`. Khi thư mục được chuyển sang `20_PROJECTS/Mach/MACH_SYSTEM/` của user `tuantq`, script không thể chạy và báo lỗi thoát.
2. **Lệch tên file đầu ra (Target Drift):** Vào ngày 08/06/2026, compiler được nâng lên v4 và đổi biến đầu ra thành `SOURCE_OF_TRUTH="$MACH_SYSTEM/MACH_SOURCE_OF_TRUTH.md"`. `MACH_AUDIT.md` bị giữ nguyên ở lần build cuối cùng của v2 (28/05/2026).
3. **Chưa chạy sau đợt cập nhật kiến trúc Phase B (28/06/2026):** Các file phân tích kiến trúc Phase B (`AUTHORITY_MATRIX.md`, `FIRST_PRINCIPLES_ARCHITECTURE_REVIEW.md`, `PROPOSED_TARGET_ARCHITECTURE.md`, `TARGET_ARCHITECTURE_VALIDATION.md`) được tạo vào ngày 28/06/2026 nhưng compiler chưa từng được chạy sau thời điểm đó.
4. **Bỏ sót thư mục KNOWLEDGE:** Compiler v4 cũ chỉ quét `DNA`, `TAXONOMY`, `ONTOLOGY`, `TYPOGRAPHY` mà bỏ qua thư mục `KNOWLEDGE/` (chứa 9 file khái niệm nền tảng).

---

## 4. PHÂN TÍCH ĐỐI CHIẾU 5 FILE NỀN TẢNG (M01.3)

Đối chiếu với kho tài liệu thực tế và ma trận thẩm quyền (`AUTHORITY_MATRIX.md`):

| File nền tảng | Responsibility chính | Lý do đưa vào phạm vi compilation | Nội dung cần giữ lại (Keep) | Nội dung rò rỉ / Không thuộc phạm vi (Out of Scope / Delegate) |
| :--- | :--- | :--- | :--- | :--- |
| **01 - MACH PROGRAM MAP.md** *(và 01 - EDITORIAL MANUAL)* | - Sơ đồ phân nhánh chương trình MẠCH (Publication vs Web Gia Phả)<br>- Cốt lõi giáo thuyết xuất bản (Level 01 Doctrine) | Định vị ranh giới cao nhất của toàn bộ chương trình và tôn chỉ biên tập tối cao. | - Bản đồ cây Project / Capability / Output<br>- Tôn chỉ bản chất MẠCH (§§01–04)<br>- Triết lý hình ảnh (§§05–06)<br>- Nhịp thở & khoảng trắng (§§10–12)<br>- Core editorial principle (§16) | - §07 Caption rules (chuyển `04`)<br>- §08 Footnote rules (chuyển `05`)<br>- §§13–14 NAS/Obsidian (chuyển `11`)<br>- §15 InDesign rules (chuyển Layout Domain) |
| **02 - MẠCH — ARTICLE PHILOSOPHY.md** | Định nghĩa bài viết là "continuity vessel" và hệ thống trang đôi (spread system). | Xác lập cấu trúc vi mô và mối liên kết hữu cơ giữa các bài viết trong hệ tuần hoàn ký ức. | - §01 Spread rhythm & montage<br>- §02 Continuity trước narrative<br>- §06 Article không độc lập<br>- §09 Final principle | - §03 Image theory (chuyển `06`)<br>- §04 Caption theory (chuyển `04`)<br>- §05 Footnote theory (chuyển `05`)<br>- §07 Documentary ethics (chuyển `12`)<br>- §08 Silence rules (chuyển `03`) |
| **03 - MẠCH — VISUAL RHYTHM.md** | Hệ điều phối nhịp điệu thị giác, 5 trạng thái Spread, quy tắc pacing và thumbnail test. | Cung cấp từ vựng kỹ thuật điều phối nhận thức, mật độ thông tin và khoảng thở. | - §§01–04 Định nghĩa nhịp thị giác<br>- 5 Rhythm States (Dense, Quiet, Presence, Reflective, Archive)<br>- 4 Rhythm Rules (Density change, Silence as structure, Cognitive load, Visual variety) | - §05 & §10 Emotional pacing & Final rule ở tầng Issue (chuyển `07 - ISSUE ORCHESTRATION`)<br>- §09 Core principle ontology (chuyển `01`) |
| **08 - MẠCH — TYPOGRAPHY SYSTEM.md** | Quy chuẩn kiểu chữ (EB Garamond, Inter, Noto Serif), type scale, micro-typography và lỗi cấm kỵ. | Quy định thẩm quyền kiểu chữ ràng buộc cho cả dàn trang InDesign và hiển thị Web. | - §§01–12 Font families, scale, hierarchy, leading/tracking, margins<br>- §14 Typography states<br>- §15 Typography failures<br>- §17 Typography & rawness | - §§13 & 18 Typography & Consciousness (phát biểu triết lý rò rỉ, chuyển `01`)<br>- §16 Typography as temporal control (chuyển `03 - VISUAL RHYTHM`) |
| **20 - MẠCH — EDITORIAL PHILOSOPHY.md** | Triết lý chiều sâu: Documentary consciousness, Continuity sau phân mảnh, Montage, Cadence, System boundary. | Khung lý thuyết và phương pháp luận nhận thức giải thích vì sao MẠCH tồn tại. | - Khung ý thức tài liệu (Documentary consciousness)<br>- Khái niệm Continuity & Fragmentation<br>- Kỹ thuật Montage & quan hệ Image-Text<br>- Cadence & System boundary | - Trùng lặp học thuyết với `01 - EDITORIAL MANUAL` và `18 - EDITORIAL POSITION`. Được bảo toàn nguyên vẹn trong compiled state hiện tại; sẽ được hội tụ (converged) ở Batch-M02. |

---

## 5. NHỮNG ĐIỀU CHỈNH ĐÃ THỰC HIỆN TRÊN COMPILER (M01.4)

Tệp compiler `/Users/tuantq/Obsidian/20_PROJECTS/Mach/MACH_SYSTEM/mach_audit_pipeline.sh` đã được nâng cấp lên **v5**:
1. **Dynamic Path Resolution:** Tự động phát hiện vị trí thư mục hiện hành qua `SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"`, không còn phụ thuộc vào bất kỳ hardcoded path nào.
2. **Dual Target & Dual Backup:** 
   - Đầu ra chính được ghi trực tiếp vào `MACH_AUDIT.md`.
   - Đồng bộ song song 100% sang `MACH_SOURCE_OF_TRUTH.md`.
   - Trước khi ghi đè, compiler tự động sao lưu cả hai file cũ vào thư mục `BACKUP/` kèm nhãn thời gian `YYYYMMDD_HHMMSS`.
3. **Bổ sung quét KNOWLEDGE/ Subdirectory:** Tích hợp quét 9 file khái niệm thuộc `KNOWLEDGE/*.md` bằng `find` và sắp xếp theo thứ tự bảng chữ cái.
4. **Loại trừ chính xác các file sinh ra:** Loại bỏ khỏi danh sách quét: `MACH_AUDIT.md`, `MACH_SOURCE_OF_TRUTH.md`, `MACH_EXECUTIVE_SUMMARY.md`, `CORE_DECISIONS.md`, và `MACH_SYSTEM_EXECUTION_PLAN.md` (tránh đệ quy kế hoạch vận hành vào nội dung).
5. **An toàn ký tự UTF-8 và khoảng trắng:** Sử dụng vòng lặp `while IFS= read -r FILE; do` bảo đảm các tên tệp tiếng Việt có dấu hoặc có khoảng trắng được xử lý tuyệt đối chính xác.

---

## 6. KẾT QUẢ COMPILATION & ĐỐI CHIẾU (M01.4 & M01.5)

### So sánh trạng thái trước và sau khi thực thi Batch-M01:

| Chỉ số kiểm tra | Trạng thái cũ (Trước M01) | Trạng thái mới (Sau M01) | Mức độ thay đổi |
| :--- | :--- | :--- | :--- |
| **Ngày tạo file `MACH_AUDIT.md`** | 2026-05-28 18:07:20 | **2026-11-01 12:45:07** | Cập nhật mới nhất (+5 tháng dữ liệu) |
| **Số file được compile vào `MACH_AUDIT.md`** | 22 files (chỉ có root `00` đến `21`) | **49 files** | +27 files (toàn bộ DNA, TAXONOMY, ONTOLOGY, TYPOGRAPHY, KNOWLEDGE, các file Phase B) |
| **Tổng số dòng của `MACH_AUDIT.md`** | 2.128 dòng | **8.733 dòng** | Tăng +6.605 dòng tài liệu thực tế |
| **Source Path trong header của từng file** | `/Users/tuan/Obsidian/CAYGIAPHA/...` (Sai) | `/Users/tuantq/Obsidian/20_PROJECTS/Mach/...` | Chuẩn xác 100% theo canonical path |
| **Thư mục BACKUP** | 7 bản backup cũ | Tự động tạo thêm các bản sao lưu an toàn mới | Không mất bất kỳ dữ liệu lịch sử nào |

### Kiểm tra tính ổn định tái lập (Idempotency Test):
Chạy script `mach_audit_pipeline.sh` liên tiếp 2 lần:
- Lần 1 (12:34:30): Tạo `MACH_AUDIT.md` gồm **8.733 dòng**.
- Lần 2 (12:45:07): Tạo `MACH_AUDIT.md` gồm **8.733 dòng** (backup lần 1 vào `BACKUP/MACH_AUDIT_20261101_124507.md`).
- Hai bản biên dịch giống nhau tuyệt đối 100% về cấu trúc và dung lượng, chỉ khác duy nhất timestamp ở phần metadata.

---

## 7. ĐÁNH GIÁ 7 TIÊU CHÍ THÀNH CÔNG (SUCCESS CRITERIA)

| Mã SC | Tiêu chí đánh giá | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :---: |
| **SC-01** | Xác định được canonical source directory thực tế. | Xác định duy nhất: `/Users/tuantq/Obsidian/20_PROJECTS/Mach/MACH_SYSTEM/`. Đường dẫn `/Users/tuan/...` không tồn tại. | **DONE** |
| **SC-02** | Compiler tham chiếu đúng canonical source. | Đã cập nhật `mach_audit_pipeline.sh` sang dynamic path (`SCRIPT_DIR`), biên dịch trực tiếp từ canonical source. | **DONE** |
| **SC-03** | Phạm vi compilation được xác định và giải thích rõ. | Đã lập bảng phân tích chi tiết trách nhiệm, phần giữ lại và phần rò rỉ của 5 file nền tảng (`01`, `02`, `03`, `08`, `20`). | **DONE** |
| **SC-04** | `MACH_AUDIT.md` được tái tạo thành công. | Đã tái tạo `MACH_AUDIT.md` mới nhất với đầy đủ 49 files, 8.733 dòng. | **DONE** |
| **SC-05** | Output phản ánh đúng active source state. | Nguồn trích dẫn trong từng section phản ánh chính xác đường dẫn tệp thực tế; bao gồm đầy đủ các phân tích Phase B và KNOWLEDGE. | **DONE** |
| **SC-06** | Có bằng chứng xác nhận kết quả compilation. | Lệnh chạy thành công (exit code 0), kiểm định idempotency 2 lần khớp 8.733 dòng, backup tự động lưu trữ. | **DONE** |
| **SC-07** | Không phát sinh thay đổi ngoài phạm vi M01. | Git working tree của code repo giữ nguyên 100% (không commit, không reset); không can thiệp CÂY GIA PHẢ hay database. | **DONE** |

---

## 8. TÁC ĐỘNG WORKING TREE VÀ AN TOÀN HỆ THỐNG

- **Git Working Tree của repo `giatoctrantrongthu`:** Hoàn toàn không có bất kỳ thay đổi nào phát sinh ngoài ý muốn (`git status -s` giữ nguyên trạng thái dirty tree ban đầu, không có commit, không có stash).
- **Hệ thống CÂY GIA PHẢ / Database / Server:** Hoàn toàn không bị tác động (giữ nguyên chế độ STRICT READ-ONLY đối với database và production).
- **Obsidian Vault:** Chỉ có `mach_audit_pipeline.sh`, `MACH_AUDIT.md`, `MACH_SOURCE_OF_TRUTH.md` và các bản sao lưu trong `BACKUP/` được tạo mới/cập nhật theo đúng phạm vi được giao.

---

## 9. CÁC VẤN ĐỀ CÒN TỒN TẠI & ĐỀ XUẤT CHO BATCH-M02

### Các vấn đề ghi nhận từ kết quả compile:
1. **Trùng lặp thành phần giữa 22 và 23:** Cả hai file `22 - ARTICLE COMPONENT SYSTEM.md` và `23 - COMPONENT AUTHORITY MAP.md` đều định nghĩa danh mục linh kiện bài viết nhưng phân tán giữa tên gọi và ma trận thẩm quyền. Cần hợp nhất thành một `COMPONENT REGISTRY` duy nhất tại Batch-M02.
2. **Rò rỉ thẩm quyền ở 5 file nền tảng:** Các quy định cụ thể về Caption, Footnote, Typography đã được xác định rõ ranh giới cần bàn giao sang các file chuyên trách ở Batch-M02 để loại bỏ hoàn toàn sự xung đột.
3. **Thư mục KNOWLEDGE:** Hiện gồm 9 file độc lập, cần được ánh xạ chặt chẽ hơn vào Ontology chung trong các bước tiếp theo.

### Đề xuất lộ trình BATCH-M02 (Chờ phê duyệt):
- **Công việc 1 (M02.1 - Dependency Core):** Hợp nhất `22` và `23` thành một `MẠCH_COMPONENT_REGISTRY.md` duy nhất. Đây là điều kiện tiên quyết (blocking dependency) bắt buộc phải hoàn thành trước.
- **Công việc 2 (M02.2 & M02.3 - Có thể chạy song song sau M02.1):**
  - Xây dựng bản mẫu cấu trúc bài viết chuẩn: `MẠCH_ARTICLE_TEMPLATE.md`.
  - Ban hành bảng kiểm tra biên tập trước khi dàn trang: `PRE_LAYOUT_EDITORIAL_CHECKLIST.md`.

---

**Kính trình:** Tuấn (Human Final Authority) và Emarald xem xét, nghiệm thu kết quả BATCH-M01!

