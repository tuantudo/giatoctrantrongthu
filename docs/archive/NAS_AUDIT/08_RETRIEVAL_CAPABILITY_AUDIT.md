# 08 RETRIEVAL CAPABILITY AUDIT

## 1. Mission
Đo lường khả năng truy hồi thực tế của hệ thống hiện tại, xác định khoảng trống (gap) giữa khả năng native của Synology và Natural Language Intent của người dùng. Từ đó thiết kế một lớp T-DOS Custom Layer nhỏ gọn nhất có thể, tránh việc phát minh lại bánh xe (như tự build SQLite hay Vector DB nếu Synology đã làm tốt).

## 2. Evidence Sources
- `01_DATA_INVENTORY.json` (Evidence về Filesystem).
- `02_DATA_TAXONOMY.md` đến `07_SEARCH_TEST_CASES.md` (Evidence/Inference/Proposal của Phase 2).
- Các API/CLI của Synology (nếu có thể truy cập qua SSH).
- Không thực hiện thao tác GUI/DSM trực tiếp (NOT TESTED).

## 3. Native Synology Capabilities
*Dựa trên Documented Specs của hệ điều hành Synology DSM:*
- **Universal Search:** Hỗ trợ index filename, file content (text/docx/pdf), date, extension, size, metadata.
- **Synology Photos:** Hỗ trợ index Date taken, People (Face Recognition), Geolocation (Places), Tags, Rating, Camera metadata (Lens, ISO, Exposure).

## 4. Actual Capabilities Observed
*Dựa trên quyền truy cập SSH và HUMAN-PROVIDED EVIDENCE:*
- **A. FILESYSTEM:** OBSERVED (path, filename, extension, size, mtime, hash).
- **B. UNIVERSAL SEARCH:** HUMAN-PROVIDED (GUI đã được HUMAN trực tiếp kiểm tra. TUAN_ATLAS: Filename / Finished. TUAN_FORGE: Filename / Checking. tuantudo: Filename / Re-indexing needed. tuandzain: Filename / Re-indexing needed).
- **C. SEMANTIC INDEXING:** NOT TESTED / NOT AVAILABLE (Native DSM không có Semantic Indexing cho tiếng Việt tự nhiên).
- **D. SYNOLOGY PHOTOS:** OBSERVED TỒN TẠI THƯ MỤC (`/volume1/homes/tuantudo/Photos`) nhưng tính năng Face Recognition / Tags bên trong: NOT TESTED.
- **E. T-DOS CUSTOM SEMANTICS:** NOT AVAILABLE (Chưa được xây dựng).

## 5. Capabilities Tested
Do rào cản kỹ thuật (chỉ có SSH vào shell, không có session DSM UI/API), việc kiểm thử GUI đã được giao cho Human.
- TUAN_ATLAS: Đã hoàn tất index (Finished).
- TUAN_FORGE: Đang kiểm tra (Checking).
- Các thư mục người dùng (tuantudo, tuandzain): Đang kẹt ở trạng thái Re-indexing needed do cấu hình legacy.

## 6. Retrieval Test Matrix

### QUERY 01: "Tìm ảnh ba"
- **USER INTENT:** Tìm tất cả ảnh có mặt cha của người dùng.
- **ENTITY / FILTERS REQUIRED:** Entity: Person = [Face_ID_Ba] OR Semantic Alias = "ba", "bố".
- **AVAILABLE NATIVE CAPABILITY:** Synology Photos (People/Face Recognition).
- **ACTUAL TEST RESULT:** NOT TESTED.
- **MISSING CAPABILITY:** Semantic alias mapping (Từ "ba" -> Hệ thống Photos Person).
- **CUSTOM LAYER REQUIRED?** Có (Chỉ cần Alias Layer, không cần build Face Recognition).

### QUERY 02: "Tìm ảnh gia đình"
- **USER INTENT:** Tìm các album/chuyến đi có sự tham gia của gia đình.
- **ENTITY / FILTERS REQUIRED:** Path chứa "Gia đình" OR Photos Album tags = "Gia đình".
- **AVAILABLE NATIVE CAPABILITY:** Universal Search (Filename/Path) / Synology Photos (Tags/Albums).
- **ACTUAL TEST RESULT:** NOT TESTED.
- **MISSING CAPABILITY:** Domain semantic mapping.
- **CUSTOM LAYER REQUIRED?** Có (Để map các thư mục con rời rạc thành concept "Gia đình").

### QUERY 03: "Ảnh Đà Lạt 2024"
- **USER INTENT:** Tìm ảnh thuộc 1 địa điểm và 1 khoảng thời gian.
- **ENTITY / FILTERS REQUIRED:** Geolocation = "Đà Lạt" AND Date_Taken = "2024".
- **AVAILABLE NATIVE CAPABILITY:** Synology Photos (Places + Date).
- **ACTUAL TEST RESULT:** NOT TESTED.
- **MISSING CAPABILITY:** Query Interpreter (Biến câu nói thành 2 bộ lọc độc lập).
- **CUSTOM LAYER REQUIRED?** Có (Query Interpreter).

### QUERY 04: "Ảnh chụp bằng iPhone"
- **USER INTENT:** Lọc theo thiết bị.
- **ENTITY / FILTERS REQUIRED:** Camera Make/Model = "Apple" / "iPhone".
- **AVAILABLE NATIVE CAPABILITY:** Synology Photos (Camera metadata).
- **ACTUAL TEST RESULT:** NOT TESTED.
- **MISSING CAPABILITY:** Query Interpretation.
- **CUSTOM LAYER REQUIRED?** Có (Query Interpreter).

### QUERY 05: "Tài liệu NPK"
- **USER INTENT:** Tìm tài liệu công việc liên quan đến NPK.
- **ENTITY / FILTERS REQUIRED:** Filename = *NPK* OR Content = *NPK* OR Parent Domain = *NPK2018*.
- **AVAILABLE NATIVE CAPABILITY:** Universal Search (Filename + Content).
- **ACTUAL TEST RESULT:** NOT TESTED.
- **MISSING CAPABILITY:** Domain semantic retrieval (Tài liệu thuộc domain NPK nhưng filename không chứa NPK).
- **CUSTOM LAYER REQUIRED?** Có (Domain Mapping).

### QUERY 06: "File thiết kế logo cũ"
- **USER INTENT:** Tìm bản thiết kế logo không phải bản mới nhất.
- **ENTITY / FILTERS REQUIRED:** Keyword = "logo" AND Extension = (ai, psd, cdr) AND Canonicality != CANONICAL.
- **AVAILABLE NATIVE CAPABILITY:** Universal Search (Keyword + Extension).
- **ACTUAL TEST RESULT:** NOT TESTED.
- **MISSING CAPABILITY:** Canonicality Inference.
- **CUSTOM LAYER REQUIRED?** Có (Mô hình Canonicality).

### QUERY 07: "File PVCFC năm 2018"
- **USER INTENT:** Lọc tài liệu theo domain tổ chức và năm.
- **ENTITY / FILTERS REQUIRED:** Domain = PVCFC AND mtime/Date = 2018.
- **AVAILABLE NATIVE CAPABILITY:** Universal Search (Date filter).
- **ACTUAL TEST RESULT:** NOT TESTED.
- **MISSING CAPABILITY:** Entity/Domain mapping ("PVCFC").
- **CUSTOM LAYER REQUIRED?** Có (Domain Semantics).

### QUERY 08: "Bản cuối của logo"
- **USER INTENT:** Tìm bản gốc, chính thức.
- **ENTITY / FILTERS REQUIRED:** Keyword = "logo" AND Status = CANONICAL.
- **AVAILABLE NATIVE CAPABILITY:** Không có.
- **ACTUAL TEST RESULT:** NOT POSSIBLE (Native).
- **MISSING CAPABILITY:** Canonical Status (UNKNOWN / CANONICAL_CANDIDATE / DERIVATIVE).
- **CUSTOM LAYER REQUIRED?** Có (Canonicality Rules Engine).

## 7. Query Interpretation Gaps
Synology có sẵn sức mạnh (như lọc theo Camera, ISO, Date, Location), nhưng nó đòi hỏi người dùng phải thao tác click chuột trên UI để chọn filter. 
**Gap thực sự** là: Chuyển đổi ngôn ngữ tự nhiên ("Ảnh iPhone 2022") thành các Query API / SQL / Filters tương ứng của hệ thống Native. Đây là khoảng trống của *Interpretation*, không phải khoảng trống của *Data Storage*.

## 8. Semantic Gaps
Synology Universal Search thực hiện Keyword Retrieval (Tìm chuỗi ký tự), không có khả năng Domain Semantic Retrieval.
- Keyword: Tìm file tên `Bao_cao_NPK.docx`.
- Semantic: Tìm thư mục `FLASHDRIVE-PVCFC` dù tên file bên trong không hề chứa chữ NPK.
T-DOS cần một lớp Metadata phụ trợ (Semantic Aliases) để định nghĩa các Domain/Entity này.

## 9. Provenance / Canonicality Gaps
Synology đánh đồng mọi file có tên chứa "logo". Hệ thống native không thể biết đâu là bản Gốc (Source), bản Nháp (Derivative), bản Dự phòng (Backup) hay bản Chính thức (Canonical).
Đòi hỏi T-DOS phải xây dựng một Canonicality Evidence Model chấm điểm các metadata (như Vị trí, Mtime, Danh pháp).

## 10. Architecture Implication
Dựa trên nguyên tắc "Smallest Custom Layer", kiến trúc truy hồi T-DOS không nên ôm đồm tạo lại các chức năng Index của Synology, mà nên đóng vai trò Trung gian (Middleware):

`USER QUERY (Natural Language)`
↓
`QUERY INTERPRETER (LLM/T-DOS - Bóc tách Intent, Entity, Filters)`
↓
`NATIVE SYNOLOGY SEARCH / PHOTOS (Thực thi Filter / Text Search mạnh mẽ có sẵn)`
↓
`T-DOS SEMANTIC & CANONICALITY MAPPING (Ánh xạ thêm Domain, gán nhãn Bản chính/Bản sao)`
↓
`RESULTS`

## 11. Minimal Custom Layer
Lớp T-DOS cần xây dựng chỉ tối thiểu:
1. **Alias Dictionary / Ontology:** Một file JSON/YAML siêu nhẹ định nghĩa: `ba` = `FaceID_01`, `NPK` = `Domain_PVCFC`.
2. **Canonicality Rules Engine:** Script đánh giá Evidence (Path, Mtime) để dán nhãn Candidate cho các file trùng lặp.
3. **Query Translator:** Một module Python nhận câu hỏi tự nhiên và dịch thành Synology API Request (hoặc Elasticsearch DSL tuỳ theo cách Synology expose API).

## 12. What We Should NOT Build
- KHÔNG tự xây lại Face Recognition bằng OpenCV/AI nếu Synology Photos đã có.
- KHÔNG tự index Full-text content của PDF/Word nếu Universal Search đang chạy ngầm.
- KHÔNG vội vã xây Vector DB / Embeddings.
- KHÔNG tự tạo DB SQLite *trừ khi* API của Synology quá đóng và buộc ta phải tự cache mtime/path để truy vấn độc lập. (PROPOSED / UNVERIFIED).

## 13. Unknowns
- Chưa biết Synology Universal Search có thực sự đang Index các thư mục `TUAN_FORGE` hay `TUAN_ATLAS` không (Cần Tuấn kiểm tra trên giao diện Web DSM -> Universal Search -> Preferences -> Indexed Folders).
- Chưa biết Synology Photos có được gán nhãn khuôn mặt của "Ba", "Mẹ" hay chưa.
- Chưa biết cách gọi Synology Universal Search qua API từ Python script cục bộ.

## 14. Human Gate
Chờ Tuấn (Final Authority) kiểm chứng các **Unknowns** trên giao diện DSM thực tế. Cụ thể:
1. Xác nhận các folder nào đang được đánh dấu Indexed.
2. Kiểm tra tính năng People trong Synology Photos.
3. Quyết định hướng tiếp cận API vs Local DB.

---
| Retrieval Capability | Native Synology | T-DOS Needed |
|---|---|---|
| Filename | CONFIGURED (Checking/Finished) | Query Interpreter |
| Content | DOCUMENTED (Not Configured) | Query Interpreter |
| Date | DOCUMENTED | Query Interpreter |
| EXIF | DOCUMENTED | Query Interpreter |
| Camera | DOCUMENTED | Query Interpreter |
| People | DOCUMENTED | Semantic Alias ("Ba") |
| Places | DOCUMENTED | Query Interpreter |
| Subjects | DOCUMENTED | Semantic Mapping |
| Tags | DOCUMENTED | Query Interpreter |
| Domain semantics | NOT AVAILABLE | Semantic Layer |
| Human aliases | NOT AVAILABLE | Alias Dictionary |
| Provenance | NOT AVAILABLE | Canonicality Rules |
| Canonicality | NOT AVAILABLE | Canonicality Model |
| Natural language query | NOT AVAILABLE | LLM/T-DOS NLP |
