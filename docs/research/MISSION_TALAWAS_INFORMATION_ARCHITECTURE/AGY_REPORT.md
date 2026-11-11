# AGY REPORT: Talawas Information Architecture & Publishing System

## 1. Executive Summary
Talawas (2001–2010) là một hệ sinh thái xuất bản (Publishing Ecosystem) phức tạp, vận hành đồng thời nhiều mô hình nội dung: diễn đàn, tạp chí, ấn phẩm chọn lọc (Chủ nhật), tủ sách và blog. Thông qua việc phân tách rõ ràng giữa Content Object (thực thể nội dung) và Webpage (trang hiển thị) bằng hệ thống cơ sở dữ liệu `talaDB`, hệ thống đã duy trì được tính nguyên vẹn của danh tính tài liệu (persistent identity). Ở giai đoạn hậu hoạt động (post-closure), toàn bộ hệ thống đã được di cư thành công vào một nền tảng WordPress thống nhất mà vẫn bảo tồn được các cấu trúc định tuyến (routing) của thập kỷ trước.

## 2. Scope
Khảo sát kiến trúc thông tin (IA), mô hình nội dung (Content Model), mô hình xuất bản (Publishing Model), sự tiến hóa theo thời gian (Temporal Evolution) và cơ chế lưu trữ (Archival Preservation) của hệ thống talawas.org.

## 3. Sources / Evidence
Nghiên cứu dựa trên các phương pháp quan sát (OBSERVED) từ giao diện tĩnh và source code trả về qua HTTP request (cURL) tới tên miền `talawas.org`:
* Trang chủ (`https://talawas.org/`)
* Phân hệ lưu trữ Diễn đàn 2001-2008 (`https://talawas.org/talawas/`)
* Phân hệ Chủ đề (`https://talawas.org/chu-de/am-nhac/`)
* Chi tiết bài viết Blog và Article trong Archive.
* Tra cứu cấu trúc URL qua các trích dẫn học thuật lưu trữ trên Internet.

---

## 4. Observations

### 4.1. Multi-modal Publishing (Sự phân mảnh ấn phẩm)
* **Problem:** Talawas cần giải quyết vấn đề xuất bản nhiều loại hình nội dung (bài nghiên cứu dài, sáng tác văn học, thảo luận nhanh, sách) mà không làm loãng (dilute) trải nghiệm đọc của từng thể loại.
* **Observed structure:** Chia website thành các "Publication" (ấn phẩm) riêng biệt với nhận diện và URL riêng.
* **Evidence:** Menu điều hướng `nav_ext` (quan sát qua HTML trang chủ) chứa các liên kết:
  * `Diễn đàn 2001-2008` (trỏ về `/talawas/`)
  * `Tạp chí`
  * `Trang chủ nhật` (trỏ về `/chunhat/`)
  * `Tủ sách` (trỏ về `talaDBFront.php?rb=08`)
  * `talawas blog` (trang chủ hiện tại).
* **Inference:** Hệ thống coi mỗi Publication là một luồng (stream) độc lập. Thay vì hiển thị tất cả theo chronological order (thời gian tính), nội dung được phân phối vào đúng container của nó.
* **Unknown:** Không rõ hệ thống quản trị (CMS backend) giai đoạn 2001-2008 là một instance duy nhất hay chia làm nhiều database độc lập cho từng ấn phẩm.

### 4.2. Taxonomy & Information Architecture (Phân loại nội dung)
* **Problem:** Làm sao để tổ chức hàng ngàn bài viết để người dùng dễ dàng khám phá (discovery) nội dung theo chủ đề.
* **Observed structure:** Sử dụng hệ thống phân loại kép (Dual Taxonomy): `chu-de` (Topic/Rubric) cho các bài viết Archive, và `category`/`tag` cho các bài viết Blog.
* **Evidence:**
  * Archive list bài viết tại `https://talawas.org/chu-de/am-nhac/`.
  * Blog post list bài viết tại `https://talawas.org/category/chinh-tri-xa-hoi/` kèm theo các `tag`.
* **Inference:** Khái niệm `chu-de` (chuyên mục) là di sản kế thừa từ `talaDB` (dùng biến `rb` - rubric), đại diện cho cấu trúc cây cứng (rigid hierarchy) của tạp chí. Trong khi đó, `tag` là cấu trúc phẳng (folksonomy) sinh ra ở giai đoạn Blog (2009) để liên kết chéo (cross-linking) các chủ đề thời sự.
* **Unknown:** Quy trình gán `chu-de` (do tác giả tự chọn hay Ban biên tập quy định).

### 4.3. Content Object Identity (Định danh thực thể nội dung)
* **Problem:** Làm sao để URL của một bài viết không bị gãy (broken link) khi website chuyển đổi công nghệ từ PHP custom sang WordPress, đảm bảo giá trị trích dẫn học thuật (academic citation).
* **Observed structure:** Ánh xạ (mapping) URL cũ sang kiến trúc mới qua plugin.
* **Evidence:** 
  * Cấu trúc cũ: `talaDB/showFile.php?res=[ID]`.
  * Cấu trúc mới: Các bài viết Archive sử dụng Custom Post Type `bai` (`/bai/thu-7804/`).
  * Khám phá được file CSS `wp-content/plugins/talawas-taladb/assets/css/talaDBFront.css`, chứng tỏ có một plugin tên `talawas-taladb` được viết riêng để xử lý các legacy URL và redirect chúng.
* **Inference:** Bài viết (Content Object) được định danh hoàn toàn tách biệt khỏi Webpage. `res=[ID]` là định danh tuyệt đối trong cơ sở dữ liệu. Dù frontend có thay đổi từ PHP thô sơ sang WordPress, bài viết vẫn tồn tại.

---

## 5. Reconstructed Model

### A. Content Objects
Dựa trên bằng chứng, hệ thống tồn tại các object sau:
* **Article (Bài viết archive):** Nằm ở path `/bai/[slug]`. 
* **Blog Post (Bài blog):** Nằm ở path `/[id]/` (ví dụ: `https://talawas.org/26858/`).
* **Author (Tác giả):** Tồn tại dưới dạng metadata được query qua URL parameter hoặc taxonomy.
* **Book (Tủ sách):** Là một tập hợp các chương (chapter), được quy định bằng một rubric đặc biệt (`rb=08`).

### B. Mối quan hệ (Relationships)
* `Article` `belongs_to` `Chu-de` (Rubric).
* `Article` `belongs_to` `Publication` (Tạp chí, Chủ nhật, Tủ sách).
* `Blog Post` `has_many` `Tags`.

---

## 6. Uncertainties
* **Editorial Governance (Quyền duyệt/đăng):** Không có evidence trên frontend về việc phân quyền giữa Admin, Editor, và Contributor. (UNKNOWN).
* **Submission Model:** Không rõ tác giả tự submit bài qua một giao diện portal hay gửi email cho Ban biên tập để họ post. (UNKNOWN).
* **Search Mechanics:** Không rõ thuật toán search của hệ thống cũ quét qua metadata hay full-text index. (UNKNOWN).

---

## 7. Important Patterns
* **Persistent Archival Routing:** Mô hình tạo ra một legacy plugin (talawas-taladb) đóng vai trò như một "bộ phiên dịch" để tiếp nhận các truy vấn kiểu cũ (`?res=X`) và trả về nội dung trên nền tảng mới.
* **Vertical Segmentation (Phân lô dọc):** Không trộn lẫn các loại nội dung có nhịp độ đọc (reading cadence) khác nhau. Blog (thời sự, thảo luận nhanh) được tách biệt hoàn toàn khỏi Tạp chí và Tủ sách (hàn lâm, đọc sâu).
* **Content Object ≠ Webpage:** Mỗi bài viết là một Object có thể xuất hiện ở Homepage, ở trang Category, ở RSS Feed, và ở Archive list mà không bị duplicate vật lý.

---

## 8. Implications / Lessons (Transferable Patterns)
* **Định danh trừu tượng cho nội dung:** Kiến trúc `mach.json` của Giatoc cần tiếp tục duy trì việc mỗi bài viết (như một lá thư Clara) có một ID duy nhất. Việc hiển thị nó ở đâu (web, PDF, hay mobile app) chỉ là vấn đề của view layer.
* **Cấu trúc nhiều Ấn phẩm (Multi-Publication Architecture):** Giatoc có thể áp dụng mô hình của Talawas: thiết lập "Gia Phả", "Tư Liệu", "Thư gửi Clara" thành các Publication độc lập thay vì gom tất cả vào một dòng thời gian duy nhất. Mỗi Publication sẽ có UX/UI riêng phù hợp với mục đích đọc.
* **Chiến lược Lưu trữ vĩnh cửu (Preservation Strategy):** URL của Giatoc phải được thiết kế để miễn nhiễm với sự thay đổi framework. Route `# /mach/thu-gui-clara-008` của SPA hiện tại phải có khả năng ánh xạ tĩnh (static mapping) nếu 10 năm sau hệ thống đổi công nghệ.

---

## 9. Questions Remaining
* Về mặt Technical: Cấu trúc cơ sở dữ liệu vật lý (schema) của talaDB cũ đã được map 1-1 sang wp_posts của WordPress như thế nào? (Chờ OPENCODE_REPORT giải đáp).
* Về mặt Trải nghiệm (UX): Làm sao người đọc thời đó (2006) nhận biết được họ đang ở không gian "Chủ nhật" mang tính thư giãn văn chương thay vì không gian "Tạp chí" nghiêm túc? Hệ thống dùng màu sắc hay layout nào để đánh dấu? (Chờ CLINE_REPORT giải đáp).

---

## 10. Evidence Index
1. `nav_ext` links HTML từ `curl https://talawas.org/` (Chứng minh Multi-modal Publishing).
2. URL Category path `https://talawas.org/chu-de/am-nhac/` (Chứng minh cấu trúc Taxonomy Archive).
3. URL Bài viết `/bai/[slug]/` và URL Blog `/[id]/` (Chứng minh sự tách biệt giữa Blog Post và Legacy Article).
4. Đường dẫn file `wp-content/plugins/talawas-taladb/assets/css/talaDBFront.css` (Chứng minh sự tồn tại của hệ thống tương thích ngược cho talaDB).
5. Chuỗi tham số `talaDBFront.php?rb=08` cho Tủ sách (Chứng minh Book là một Rubric ID cụ thể trong cấu trúc cũ).
