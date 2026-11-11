# TALAWAS SYNTHESIS

## 1. Mission & Research Boundary
**Status:** COMPLETE
**Lead:** AGY
**Type:** Research Synthesis & Comparative Morphology
**Objective:** Đối chiếu bằng chứng từ các báo cáo khảo cổ hệ thống Talawas (AGY, OpenCode), tái dựng mô hình kiến trúc và phân tích hình thái so sánh (Comparative Morphology) với dự án Giatoc.
**Boundary:** Chỉ khảo sát và phân tích, KHÔNG thiết kế hoặc quyết định implementation cho Giatoc ở phase này. Toàn bộ nhận định phân tách rõ OBSERVED, EVIDENCE, INFERENCE và HYPOTHESIS. (Do không tìm thấy `CLINE_REPORT.md` trong thư mục, báo cáo này tổng hợp UX/Discovery dựa trên evidence từ AGY và OpenCode).

## 2. Evidence Reconciliation
| Claim | AGY | OpenCode | Confidence | Final Classification | Notes |
|---|---|---|---|---|---|
| Cấu trúc đa ấn phẩm (Multi-publication) | Quan sát menu `nav_ext` (Diễn đàn, Tạp chí, Chủ nhật, Tủ sách). | Xác nhận qua URL và plugins (`talawas-taladb`, `talawas-chunhat`). | High | CONFIRMED FACT | Cấu trúc phân mảnh bề mặt đọc (surface) là có thật và được bảo tồn. |
| Số lượng bài viết | Không đếm tổng số. | WordPress ~2,000+, talaDB ~15,000+, Chunhat 269. | Medium | CURRENT OBSERVABLE COUNT | Con số 15,000+ là số liệu lưu trữ hiện tại quan sát được, không xác nhận historical total tuyệt đối. |
| Kiến trúc công nghệ | `talaDB` dùng PHP/DB, sau đó sang WordPress. | WP 7.1 (Atomic hosting), với 2 plugins bridge dữ liệu cũ. | High | CONFIRMED FACT | Chuyển đổi công nghệ nhưng bảo tồn cấu trúc dữ liệu qua plugin. |
| Ngôn ngữ phát triển | Không đề cập. | Dấu vết CSS tiếng Đức (`Beitr`, `Rub`). | Medium | INFERENCE | "German-language naming signals are observable" - không suy diễn lập trình viên là người Đức. |
| Content Object tách biệt Webpage | `res=[ID]` ánh xạ thành `/bai/[slug]`. | Xác nhận qua các RSS feed và URL pattern `/{id}/`. | High | INFERENCE | Evidence indicates that content entities (metadata/relationships) could be rendered across multiple presentation surfaces. |

## 3. Contradictions & Corrections
* **Contradiction:** AGY giả định `chu-de` là di sản trực tiếp của rubric (`rb`) cũ. OpenCode xác nhận `chu-de` là mapping URL của plugin `talawas-taladb`, nhưng WP gốc cũng có Category và Tags (như *Chính trị – Xã hội*). 
* **Correction:** Phân tách rõ: Taxonomy của WordPress (Blog) và Taxonomy giả lập của plugin (talaDB Archive) là hai hệ thống chạy song song trên cùng một domain.
* **Absence:** `CLINE_REPORT.md` không tồn tại. Mọi kết luận về User Experience (Mật độ nội dung, điều hướng) được INFERRED trực tiếp từ HTML snapshot do OpenCode cung cấp.

## 4. Reconstructed Talawas Model
Dựa trên bằng chứng, mô hình tái dựng (Reconstructed Structure):
**TALAWAS INSTITUTION (Ban Biên Tập)**
→ **PUBLICATION SYSTEM** (Hệ thống phân phối: Blog, Diễn đàn, Chủ nhật, Tủ sách)
→ **CONTENT OBJECTS** (Bài viết, Sáng tác, Bình luận - với định danh vĩnh cửu)
→ **TAXONOMIES** (Rubric/Chủ đề cứng, Category/Tag mềm)
→ **ARCHIVE REPRESENTATION** (Đóng băng dữ liệu, nhưng giữ nguyên URL và routing để tra cứu).

## 5. Talawas Ontology
Các entity xác định được từ evidence:
* **Institution:** Talawas (Nhà xuất bản/Diễn đàn). Role: Authority.
* **Publication:** Các không gian đọc (Blog, Diễn đàn, Chủ nhật, Tạp chí, Tủ sách). Role: Container có tính định hướng biên tập.
* **Article/Post:** Content object (Văn bản). Role: Đơn vị nội dung cốt lõi.
* **Author:** Tác giả (định danh qua metadata `autor` hoặc `authorlabel`).
* **Topic/Rubric/Category/Tag:** Hệ thống phân loại kép. Rubric (cấu trúc cứng của Diễn đàn/Chủ nhật), Tag/Category (cấu trúc folksonomy của Blog).
* **Archive:** Thực thể tĩnh (frozen state) duy trì dữ liệu sau năm 2010.

## 6. Information Architecture
### Layer 1 — Institutional
Talawas hoạt động như một toà soạn ảo (Editorial Board), kiểm soát ấn phẩm và quyết định nội dung nào vào Publication nào.
### Layer 2 — Publication
Phân mảnh thành các bề mặt: `talawas.org` (Blog/Tin), `/talawas/` (Kho diễn đàn/Tạp chí), `/chunhat/` (Văn chương), `/talaDBFront.php?rb=08` (Tủ sách).
### Layer 3 — Content
Các loại nội dung: Tin tức, Bình luận chính trị, Tiểu luận học thuật, Sáng tác văn xuôi/thơ, Sách dịch.
### Layer 4 — Relationship
Một Article liên kết với Author (Tác giả), Topic/Rubric (Chủ đề). Ở Blog, liên kết thêm qua Tag (như *Lũ lụt miền Trung*).
### Layer 5 — Navigation
Người đọc tiếp cận qua: Chronological (trang chủ Blog), Category browsing (menu dropdown), hoặc Publication hub (nhảy sang trang Chủ nhật để đọc văn).
### Layer 6 — Representation
Nội dung có thể hiển thị dưới dạng tóm tắt (RSS feed, HTML excerpt) và toàn văn (Single page). Cùng một bài viết Archive có thể được gọi bằng ID kiểu cũ hoặc slug kiểu mới thông qua plugin.

## 7. Content Model
* **Nội dung ≠ Webpage.**
* **Blog Post:** Có tiêu đề, ID, Date, Author, Category, Tag, Excerpt, Content, Comments.
* **talaDB Article:** Có Topic, Date, Author, Title, Excerpt, URL tĩnh.
* **Chunhat Article:** Có Genre (Văn/Thơ), Author, Title, Author Bio, Related Works (Cùng tác giả), Date.
* **Evidence:** Trích xuất từ HTML tags (`.titel`, `.autor`, `.genre`) và cấu trúc WordPress post.

## 8. Publishing Model
* *Tái dựng (Reconstructed Workflow - Inferred từ cấu trúc CMS):*
* AUTHOR (Tác giả gửi bài) → EDITORIAL SELECTION (Ban biên tập duyệt và phân loại vào Publication phù hợp: Blog cần nhanh, Tạp chí cần sâu, Chủ nhật cho văn học) → PUBLICATION (Đăng tải lên hệ thống với định danh ID) → ARCHIVE (Bài viết trôi về kho lưu trữ, nhưng URL không bao giờ chết).
* Không có evidence về việc tác giả có quyền đăng bài trực tiếp không qua kiểm duyệt (ngoại trừ Comment).

## 9. Editorial Governance
* **WHO CAN DO WHAT?**
* *Editorial Board (Toà soạn):* Kiểm soát xuất bản, định hướng chuyên mục, khóa bình luận toàn hệ thống (Observed: "Chức năng bình luận bị tắt" tại thông báo cuối).
* *Technical Team:* Xây dựng plugin bridge `talawas-taladb` để bảo tồn di sản (Inferred từ hành vi can thiệp kỹ thuật vào mã nguồn WP).
* *Authors:* Định danh rõ ràng, được nhóm các bài "cùng tác giả" (đặc biệt ở mục Chủ nhật).
* *Readers:* Chỉ có thể đọc (trước đây có quyền bình luận, nay đã bị khóa).

## 10. Archive & Preservation
* **PRESERVATION:** Toàn bộ text, ảnh, metadata được giữ lại vĩnh viễn trên máy chủ.
* **ACCESS:** Người dùng vẫn truy cập bình thường qua trình duyệt.
* **Technical Preservation:** Hệ thống cũ (PHP/talaDB) không thể vá lỗi bảo mật mãi mãi, nên Technical team đã quyết định chuyển toàn bộ Data vào cơ sở dữ liệu WordPress, dùng Custom Plugins để ánh xạ (map) URL cũ sang dữ liệu mới. Nghĩa là họ ưu tiên *Bảo tồn Link tham chiếu* hơn là bảo tồn công nghệ cũ.
* **Relationship:** Sau ngày 03/11/2010, Active Publication và Archive nhập làm một, website chuyển trạng thái Read-only.

## 11. Temporal Evolution
* **2001–2003:** Giai đoạn nguyên thủy, trilingual.
* **2003–2008:** Hệ thống `talaDB` (custom PHP forum), quản trị nội dung khổng lồ (15,000+ bài), phân loại bằng Rubric (`rb`).
* **2006:** Ra mắt `Talawas Chủ nhật` (hệ thống riêng).
* **2009–2010:** Đưa vào WordPress Blog để tăng tương tác thời sự.
* **POST-2010 ARCHIVE:** Toàn bộ `talaDB` và `Chủ nhật` được import vào WordPress thành các Custom Post Type, dùng Plugin giữ URL cũ.

## 12. Experience & Discovery
*(Inferred từ AGY/OpenCode HTML scraping)*
* **Discovery Paths:** Dày đặc (Dense). Homepage liệt kê dropdown hàng chục Categories. 
* **Navigation:** Chia rẽ theo Publication. Nếu muốn đọc văn học, người đọc phải rời Blog để chuyển hướng sang UI của `/chunhat/`.
* **Chronological Browsing:** Rất mạnh (có lịch Archive từng tháng từng năm từ 2001).
* **Observation:** Hệ thống chú trọng vào việc lập chỉ mục (Indexing) và liệt kê đầy đủ hơn là khoảng trắng (Whitespace) trải nghiệm kiểu hiện đại.

## 13. Technical Architecture
* **Frontend:** Hiện tại render bằng WordPress 7.1 block-library CSS. Legacy frontend (của Chủ nhật và talaDB) được tái lập cục bộ qua các file CSS riêng biệt (`talaDBFront.css`).
* **Legacy PHP/talaDB:** Đã bị tắt (Inferred), chỉ còn data nằm trong database WP.
* **Plugins:** Cấu trúc cầu nối (Bridging plugins) cực kỳ tinh xảo.
* **URL Routing:** Redirect/Rewrite rules từ `showFile.php?res=` sang `index.php` của WP.
* **Feeds:** Có cung cấp đầy đủ RSS cho từng ngách (Category RSS, Chủ nhật RSS).

## 14. Unknowns & Unresolved Questions
* Data schema vật lý của `talaDB` năm 2003 thực sự trông như thế nào?
* Quyền hạn của một "Tác giả" trên hệ thống cũ: Họ gửi qua Email hay có CMS login riêng?
* Tủ sách (Book) được cấu trúc từ các bài viết (Articles) rời rạc bằng logic gì?
* Không rõ chi phí và hạ tầng bảo trì Archive này hiện do ai tài trợ.

---

## 15. Comparative Morphology: Talawas ↔ Giatoc
*Mục tiêu: So sánh hình thái, không đánh giá.*

### 16. Spirit / Method / Structure
* **SPIRIT:** 
  * *Talawas:* Không gian sinh hoạt trí thức, lưu trữ tư tưởng dân chủ/văn chương của cộng đồng Việt Nam toàn cầu.
  * *Giatoc:* Không gian số hoá di sản, lưu giữ ký ức và kết nối các thế hệ của gia tộc Trần Trọng Thu.
* **METHOD:**
  * *Talawas:* Editorial selection (Lựa chọn biên tập) gắt gao, phân mảnh thành nhiều ấn phẩm theo nhịp điệu (Blog, Tạp chí).
  * *Giatoc:* Ghi chép, phỏng vấn, khảo cứu gia phả, phân tích hệ tư tưởng (qua các Thư gửi Clara, Tư liệu).
* **STRUCTURE:**
  * Cả hai đều đối mặt với bài toán: *Có một khối lượng lớn văn bản tri thức/di sản, làm sao phân loại và giữ nó tồn tại lâu dài?* Talawas giải quyết bằng Database + Plugins. Giatoc giải quyết bằng Headless JSON + Static Web/SPA.

### 17. Scale & Temporality
* **SCALE:**
  * *Talawas:* Audience khổng lồ (trí thức Việt Nam hải ngoại & quốc nội), hàng ngàn tác giả, hàng vạn bài viết.
  * *Giatoc:* Scale hẹp và sâu (Gia đình, Dòng họ, Hậu duệ), số lượng tác giả ít (chủ yếu là Tuấn/Người giữ mạch), lượng bài viết cô đặc.
* **TEMPORALITY (Tính thời gian):**
  * *Talawas:* Thời gian tuyến tính của Tạp chí (Hiện tại → Xuất bản → Lưu trữ tĩnh).
  * *Giatoc:* Thời gian kế thừa (Ký ức quá khứ → Khảo cứu hiện tại → Hậu duệ tương lai). Sự tồn tại (Continuity) phụ thuộc vào sự tiếp nhận của thế hệ sau, không chỉ là cái vỏ lưu trữ (Preservation).

### 18. Transferable / Non-transferable / Context-dependent Patterns
| Pattern từ Talawas | Evidence | Applicable to Giatoc? | Reason | Required Transformation |
|---|---|---|---|---|
| Phân mảnh Publication | Có menu `Diễn đàn`, `Chủ nhật` tách biệt. | TRANSFERABLE | Giúp tách bạch Gia Phả (Data), Tư Liệu (Archive) và Thư (Opinion). | Áp dụng vào SPA routing thay vì sub-folder. |
| URL Vĩnh cửu (Persistent) | Plugin giữ lại link `?res=ID`. | TRANSFERABLE | Link gia phả/thư phải tồn tại sau 20 năm dù đổi công nghệ. | Sử dụng ID tuyệt đối trong `mach.json`. |
| Cấu trúc Taxonomy kép | Có cả Rubric (cứng) và Tag (mềm). | CONTEXT-DEPENDENT| Phù hợp nếu lượng bài Giatoc lên hàng trăm. | Có thể đơn giản hoá thành Topic (Cứng). |
| Chronological Archive | Link lưu trữ theo `tháng/năm`. | REQUIRES REINTERPRETATION | Talawas là báo chí (cần thời gian xuất bản). Giatoc là ký ức (cần thời gian diễn ra sự kiện). | Chuyển từ "Lịch xuất bản" sang "Lịch sử dòng họ". |
| Bình luận (Comments) | HTML hiển thị khối bình luận bị khóa. | NON-TRANSFERABLE | Giatoc ưu tiên đọc sâu, bình luận phân tán sẽ phá vỡ sự mạch lạc của tài liệu gốc. | Bỏ qua hoặc dùng kênh trao đổi gia đình riêng. |

### 19. Implications for Giatoc
1. **Nội dung tách biệt khỏi Webpage (Content Object Isolation):** Sự bảo tồn thành công của Talawas là minh chứng thép cho việc: File dữ liệu (JSON/Markdown) phải sống độc lập khỏi Framework Frontend. `mach.json` hiện tại của Giatoc là cốt lõi hoàn hảo.
2. **The "Archive" is the App:** Talawas hiện tại sống dưới dạng một Archive. Giatoc ngay từ đầu nên được thiết kế như một Archive-First Platform. Không cần khái niệm "Tin tức mới nhất", mà là "Khám phá di sản".
3. **Institutional Authority (Tiếng nói tòa soạn):** Giatoc cần duy trì sự rõ ràng giữa các Publication: Đâu là tài liệu gốc khách quan (Tư liệu lịch sử), đâu là góc nhìn cá nhân (Thư gửi Clara). Talawas làm điều này bằng cách tách Tạp chí và Blog. Giatoc có thể dùng UI Layout và Routing.

### 20. Decisions NOT YET MADE
* Không quyết định chọn MPA hay SPA cho kiến trúc Frontend Giatoc.
* Không thiết kế UI/UX cụ thể cho các trang Đọc thư hay Gia phả.
* Không đưa ra quyết định thay thế công nghệ (Vercel/Nodejs) hiện tại của Giatoc.

### 21. Evidence Index
* `AGY_REPORT.md` (Khảo sát URL routing, taxonomy, content decoupling).
* `OPENCODE_REPORT.md` (Bóc tách công nghệ WordPress, CSS Plugins, phân loại số lượng bài viết 15k+, HTML extraction của TalaDB/Chunhat/Blog).
* (Các URL của `talawas.org`, `talawas.org/talawas/`, `talawas.org/chunhat/` đã được sử dụng làm baseline tham chiếu).
