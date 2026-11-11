# MACH → GIATOC: PUBLICATION ARCHITECTURE SYNTHESIS
*Tài liệu Tổng hợp Kiến trúc Khái niệm Hệ thống Xuất bản*
*Ngày: 2026-09-15*

---

## 1. MAPPING: MẠCH (OBSIDIAN) VÀ GIATOC (WEB)

Dưới đây là mapping các khái niệm từ dự án MẠCH nguyên bản sang hệ thống Giatoc hiện tại, phân loại theo mức độ bằng chứng:

| MẠCH Concept | Giatoc Concept | Status | Chú thích & Hệ quả Kiến trúc |
|---|---|---|---|
| **Program** | **Institution (Gia Tộc)** | [VERIFIED] | MẠCH từng là Program bao trùm cả Gia Phả. Giatoc lật ngược lại: Gia Tộc là Program lớn, MẠCH chỉ là cơ quan xuất bản trực thuộc. |
| **Issue (Kỳ)** | **Digital Publication** | [INFERRED] | Giatoc hiện không có Route cho Issue, mà hiển thị MẠCH theo lưới bài viết liên tục. Khái niệm Issue (Kỳ xuất bản đóng) có nguy cơ biến mất nếu không chủ động thiết kế. |
| **Article** | **Story / Bài Viết** | [VERIFIED] | Entity cơ sở không đổi (hiện lưu tại `mach.json` và render ở `#/mach/bai-viet/:slug`). |
| **Series** | **Tuyển tập (Sitemap 2.6)** | [VERIFIED] | Ánh xạ trực tiếp. "Thư gửi Clara" là minh chứng rõ nhất của Series (chuỗi bài chung chủ đề/tác giả). |
| **Author** | **Tác giả (Sitemap 2.7)** | [VERIFIED] | Tác giả trong MẠCH (người viết) sẽ liên kết với Person entity (Nhân vật) trong Gia Phả. Cần phân định giữa "Hành vi viết" và "Hành vi tồn tại trong phả hệ". |
| **Spread (Trang)** | **Web Component** | [INFERRED] | Khái niệm dàn trang in (Pacing/Density) không dịch nguyên vẹn lên Web. Giatoc cần Web Components (Block trích dẫn, Hero image, Grid) để giả lập nhịp đọc. |
| **Asset** | **Media / Tư Liệu** | [VERIFIED] | Hình ảnh/Scan trong bài viết MẠCH giờ được truy xuất từ kho Media chung của Giatoc. |
| **Archive** | **Tư Liệu (Sitemap 3.0)** | [VERIFIED] | Tương đương. Nơi chứa bằng chứng (evidence) thô chưa qua màng lọc biên tập. |
| **Editorial Workflow**| **Owner Control Plane** | [INFERRED] | MẠCH dùng Folder (WORKING → CANONICAL). Giatoc Web chưa có CMS/Workflow này, chỉ có `mach.json` là đầu ra tĩnh. Cơ chế biên tập (Control Plane) đang khuyết. |

---

## 2. TRẢ LỜI 5 CÂU HỎI KIẾN TRÚC

### A. MẠCH thực sự đang đóng vai trò gì trong Giatoc?
MẠCH đóng vai trò **"Editorial Voice" (Cơ quan tự sự và biên tập)** của dòng họ. Nếu Gia Phả (Genealogy) là bộ khung xương logic vô hồn, và Tư Liệu (Archive) là đống hồ sơ thô, thì MẠCH là lớp da thịt — nơi diễn giải, kể chuyện, tạo cảm xúc và bối cảnh hóa dữ liệu. Nó biến "database" thành "publication".

### B. Giatoc nên giữ nguyên những nguyên lý nào của MẠCH?
- **Tính Biên Tập (Curated Experience):** Nội dung phải được chọn lọc (qua Editor/Newsroom model), tuyệt đối không biến thành Mạng xã hội User-Generated Content (UGC) ai cũng tự đăng bài được.
- **Sự tách biệt giữa Data và Narrative:** Bài viết (Narrative) có thể viện dẫn một Nhân vật (Data), nhưng bài viết không bao giờ được phép làm hỏng/biến dạng dữ liệu gốc của nhân vật đó.
- **Quyền Tác Giả (Authorial Authority):** Như "Thư gửi Clara", nội dung do ai viết phải giữ nguyên chủ đích của người đó, AI chỉ hỗ trợ định dạng/phản chiếu.

### C. Những khái niệm nào của MẠCH cần chuyển hóa khi lên Digital?
- **Pacing & Spreads:** Nhịp điệu trang in (InDesign) phải chuyển hóa thành thiết kế Web Typography & Scroll Pacing (khoảng trắng, drop cap, blockquote, cách chèn ảnh ngang/dọc trên màn hình mobile).
- **Phát hành (Distribution):** Từ việc gửi 1 file PDF nguyên khối sang việc tạo ra các Permalink (`#/mach/bai-viet/...`) có thể chia sẻ độc lập, yêu cầu phải bối cảnh hóa từng bài viết (người đọc có thể rơi thẳng vào bài viết mà không qua trang chủ).

### D. Những capability nào Giatoc hiện đã có nhưng chưa hoàn chỉnh?
- Khả năng render bài viết đơn lẻ (`renderArticleDetail`).
- Tổ chức tuyến đường theo MẠCH (`#/mach`).
- *Chưa hoàn chỉnh:* Chưa có liên kết ngược (Backlink) từ Bài viết sang Hồ sơ Nhân vật trong Gia phả; chưa có cơ chế hiển thị "Tác giả" rõ ràng như một thực thể click được.

### E. Những capability nào còn thiếu để Publication System hoạt động?
- **Editorial Workflow System:** Nơi Tuấn (hoặc Editor) viết, nháp, duyệt trước khi "publish" ra `mach.json`. 
- **Series/Issue Router:** Chưa có logic gom nhóm các bài viết thành một "Kỳ" (Issue) hoặc "Chuỗi" (Series) để đọc liên tục.

---

## 3. PHÂN TÍCH: ISSUE vs SERIES vs CONTINUOUS PUBLICATION

Hệ thống số (Giatoc) đang đứng trước ngã ba đường về cách tổ chức ấn bản:

| Mô hình | Evidence | Ưu điểm | Mất mát | Hệ quả Kiến trúc |
|---|---|---|---|---|
| **ISSUE (Kỳ / Cuốn đóng)** | MẠCH gốc (Issue 01, PDF) | Tạo ra một "công trình" hoàn chỉnh, có cảm xúc đóng gói, dễ archive. | Khó cập nhật bài đơn lẻ. Web không tự nhiên hỗ trợ mô hình "tạp chí lật trang". | Web chỉ đóng vai trò "Kệ sách" chứa các cục Issue nguyên khối. |
| **SERIES (Tuyển tập)** | Thư gửi Clara, Sitemap 2.6 | Xâu chuỗi mượt mà các bài cùng chủ đề. Dễ đọc theo tuyến thời gian. | Thiếu tính bao quát đa chủ đề của một Issue. | Cần bổ sung Route `#/mach/series/:id` và Table of Contents riêng cho Series. |
| **CONTINUOUS (Lưới bài)**| Giatoc hiện tại (`#/mach`) | Phù hợp Web/Mobile, nội dung mới lên đầu, dễ scale. | Dễ rơi vào hội chứng "Blog vô hồn", mất đi cấu trúc kiến trúc sư (Editor-in-Chief) của MẠCH. | Chỉ cần 1 file `mach.json` và render dạng thẻ (Card) vô tận. |

**Open Question (Human Quyết Định):** Giatoc sẽ từ bỏ khái niệm ISSUE để chuyển hoàn toàn sang CONTINUOUS kết hợp SERIES, hay Giatoc sẽ giữ ISSUE như những "Ấn phẩm đặc biệt" (Special Editions) phát hành hàng năm?

---

## 4. PHÂN TÍCH EDITORIAL WORKFLOW

**Workflow MẠCH (Obsidian):** `WORKING` (Nháp) → `AUDIT` (Fact-check) → `CANONICAL` (Chốt) → `SPECS` (Dàn trang) → `OUTPUT` (PDF).

**Workflow Giatoc (Hiện trạng):** Edit file `mach.json` thủ công → Đẩy lên Vercel → Khách truy cập web đọc.

**Tổng hợp chuyển hóa:**
- *Phần đã chuyển hóa:* Output (Web thay cho PDF).
- *Phần bị mất:* Không còn thư mục WORKING/CANONICAL rõ ràng cho từng bài (Giatoc chưa có CMS).
- *Phần KHÔNG NÊN đưa vào Web:* Toàn bộ quy trình `WORKING` và `AUDIT` là nghiệp vụ Nội bộ (Owner Control Plane). Tuyệt đối không nhúng giao diện viết/nháp (WYSIWYG editor) hay nút "Đăng bài" ra Public Web Front-end. Workflow biên tập nên tiếp tục nằm ở local (ví dụ: Obsidian hoặc một Admin Dashboard ẩn) và build tĩnh ra JSON.

---

## 5. ONTOLOGY: QUAN HỆ GIỮA CÁC THỰC THỂ

Không dồn tất cả vào một Database nguyên khối. Dựa trên bằng chứng, Ontology của Giatoc là sự giao thoa (Graph) của các khối độc lập:

```text
[GENEALOGY] (Khoa học, Khách quan)
  └─ Person (Người) <──────────┐ (Tham chiếu / Khắc họa)
  └─ Family (Gia đình)         │
                               │
[ARCHIVE] (Bằng chứng, Thô)    │
  └─ Media / Scan <────────────┼─────┐ (Sử dụng làm minh họa)
                               │     │
[PUBLICATION / MẠCH] (Cảm xúc, Chủ quan)
  └─ Series (Chuỗi bài)        │     │
  └─ Story / Article (Bài) ────┘     │
       └─ Memory (Ký ức)             │
       └─ Author (Tác giả) <─────────┘ (Author có thể chính là một Person trong Genealogy)
```
**Quy tắc Ontology:** Story/Article có quyền kể sai (theo trí nhớ), nhưng Genealogy thì phải chính xác. Publication chỉ *tham chiếu* (link) đến Person, chứ Publication không *sửa* cấu trúc Genealogy.

---

## 6. TARGET ARCHITECTURE (CONCEPTUAL)

Mô hình kiến trúc mức khái niệm cho Publication System trong tương lai của Giatoc:

- **Institution:** Giatoc (Chủ thể bảo trợ).
- **Publication (MẠCH):** Là một Frontend App module (`#/mach`), chịu trách nhiệm render Nội dung đã biên tập.
- **Editorial System:** Chạy ngầm (Owner Control Plane - có thể vẫn là Obsidian thư mục `CANONICAL`). Khi chốt bài, một script compile Markdown thành `mach.json`.
- **Content Model:** Một Story JSON object chứa `title`, `author_id` (trỏ sang Person), `content_html` (với các tag đặc biệt cho typography), `linked_media_ids` (trỏ sang Archive).
- **Publishing Lifecycle:** Tác giả viết trên Obsidian → Hệ thống duyệt (Audit) → Compile ra JSON → Git Push → Web tự động hiển thị trên lưới MẠCH (hoặc chèn vào Series).

---

## 7. ĐỊNH HƯỚNG CAPABILITY (TÁCH RÕ)

- **[KEEP]**: Tính chất Curated Editorial (Có Tổng biên tập định hướng), không mở cổng đăng bài tự do.
- **[RESTORE]**: Khái niệm Tác giả (Authorial Authority) và Thẩm định Fact-check trước khi lên web.
- **[EVOLVE]**: Chuyển "Spread / Layout InDesign" thành "Web Editorial Typography" (Responsive, hỗ trợ đọc sâu).
- **[NEW]**: Cross-linking giữa Bài viết và Hồ sơ Gia phả (Đọc bài về cụ A → Click ra cây phả hệ cụ A).
- **[DEFER]**: Hệ thống Headless CMS hoặc Database động. Tạm thời cứ dùng File-based JSON (git) vì tốc độ nhanh, dễ lưu trữ dài hạn (archivable).

---

## 8. KẾT LUẬN

### A. Architectural Synthesis
Publication System của Giatoc (nhánh MẠCH) không phải là một "trang tin tức" (News) hay "Blog". Nó là một **Living Archive Narrative** — nơi các dữ liệu lạnh (Gia phả, File PDF) được thổi hồn thông qua các bài viết, thư từ, ký ức, được dàn dựng (orchestrated) với mục đích duy trì văn hóa liên thế hệ.

### B. Canonical Principles inherited from MẠCH
1. Biên tập tập trung (Newsroom model).
2. Tôn trọng ranh giới tác giả (Authorial boundaries).
3. Đặt cảm xúc (Narrative) lên trên khối lượng dữ liệu (Data dump).

### C. Giatoc-specific evolution
Giatoc mang MẠCH từ định dạng đóng (PDF) ra một không gian mở có tính tương tác. MẠCH giờ đây không đứng một mình mà trở thành lớp "Voice" đắp lên trên lớp "Genealogy Graph".

### D. Decisions already supported by evidence
- "Thư gửi Clara" là một Series, không phải một bài lẻ.
- MẠCH là tổ hợp đa tác giả (Multi-author), không chỉ của riêng một người.
- Giatoc Web phân tách rạch ròi Public (Publication) và Member (Deep Data).

### E. Decisions requiring Tuấn
1. Quyết định dứt điểm về mô hình ISSUE (Kỳ) hay bỏ hẳn để dùng CONTINUOUS (Lưới bài) + SERIES (Chuỗi)?
2. Workflow viết bài sẽ giữ ở Obsidian hay làm một Admin Dashboard trên Web?

### F. Questions that should NOT be decided yet
1. Cấu trúc Database quan hệ (SQL) hay NoSQL cho bài viết? (Cứ dùng JSON tĩnh cho đến khi quy mô lên hàng ngàn bài).
2. Cơ chế phân quyền Member đọc bài Private. (Xây xong lớp Public Editorial trước).
