# GIATỘC PROJECT PURPOSE & SOURCE MAP AUDIT v0.1

## 1. Executive Summary
Tài liệu này thực hiện kiểm toán toàn bộ hệ thống định nghĩa (semantics) và cấu trúc tài liệu của dự án Giatộc, dựa trên working tree thực tế ở local và Quyết định mới nhất của Human (Current Human Product Decision).
Nhiều báo cáo audit trước đây đã đưa ra kết luận vội vàng dựa trên Implementation (code) hoặc Proposed Architecture, dẫn đến việc đồng nhất sai lệch các khái niệm `MẠCH = Public` hoặc `Clara = Publication`.
Bản audit này đính chính lại Semantic Boundaries và xây dựng sơ đồ Source of Truth để định hướng cho hệ thống tài liệu.

## 2. Source Boundary
- **Vùng quét (Scope):** `CURRENT LOCAL WORKING TREE` (`/Users/tuantq/Projects/Personal/giatoctrantrongthu`).
- **Nguồn thẩm quyền (Authority Hierarchy):**
  CURRENT LOCAL WORKING TREE > CURRENT HUMAN DECISIONS > CURRENT LOCAL DOCUMENTATION > CURRENT LOCAL CODE/CONFIG > GIT HISTORY > origin/main/GitHub.

## 3. Repository Structure
Kho chứa chứa một lượng lớn các file tài liệu (`*.md`), scripts (`.py`, `.js`), thư mục `docs/`, `server/`, `src/`. Nhiều file trong số này là những bản nháp (proposal) hoặc phân tích lịch sử (archaeology). Việc thiếu một `PROJECT_MAP.md` đang khiến việc định hướng trở nên khó khăn.

## 4. Product Evolution
Sự tiến hóa sản phẩm không đơn thuần là "Tắt tính năng Public Tree và biến Public thành tạp chí MẠCH" như bản audit `GIATOC_PRODUCT_EVOLUTION_AUDIT_v0.1.md` đã lầm tưởng.
Thực chất, sự tiến hóa nằm ở việc **phân lớp các cấp độ diễn ngôn (Discourse Scopes)**:
- Từ một khối dữ liệu trộn lẫn (Data = Content = Public).
- Trở thành một cấu trúc đa tầng: Phả hệ (Data) -> Thư Clara (Intimate) -> MẠCH (Internal) -> Public (External).

## 5. Current Human Decisions (The Ultimate Truth)
Đây là quyết định mới nhất, định hình lại toàn bộ mô hình nội dung `[CURRENT HUMAN DECISION]`:
1. **Thư gửi Clara:** Diễn ngôn cá nhân, thân mật, riêng tư, hướng tới người nhận cụ thể (thế hệ Clara).
2. **MẠCH:** Diễn ngôn nội bộ (internal family intellectual / cultural discourse). Không đồng nghĩa với Public. Không mặc định là public publication.
3. **Public:** Tiếng nói của gia tộc hướng ra bên ngoài (external family voice). Không mặc định là MẠCH hay projection của MẠCH. Không phải là public family database.

## 6. Historical Decisions & Obsolete Assumptions
Những nhận định sau đây từng xuất hiện trong các báo cáo / tài liệu cũ và hiện bị coi là **SUPERSEDED / OBSOLETE**:
- *"Public chỉ có MẠCH."* (Nguồn: `GIATOC_PRODUCT_EVOLUTION_AUDIT_v0.1.md`) -> `[SUPERSEDED]`
- *"Public dành sân khấu 100% cho Tạp chí MẠCH."* -> `[SUPERSEDED]`
- *"MẠCH là tạp chí hướng ra công chúng."* -> `[SUPERSEDED]`
- *"Public = publication engine"* -> `[SUPERSEDED]`

## 7. Current Product Model (Conceptual)
```text
                         GIA TỘC
                            │
                    CONTENT / DISCOURSE
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
       THƯ GỬI CLARA      MẠCH          PUBLIC
             │              │              │
         intimate       internal        external
         personal       family          family
         discourse      intellectual    voice
                        / cultural
                        discourse
```

## 8. Clara / MẠCH / Public Semantic Map
- **THƯ GỬI CLARA:**
  - `[CURRENT HUMAN DECISION]`: Personal, intimate discourse.
  - `[IMPLEMENTATION FACT]`: Code `generator/` và `member-app.js` đang gộp Clara vào danh sách articles của MẠCH (coi Clara là một Series). `[CONFLICT]` -> Cần refactor cấu trúc dữ liệu sau này.
- **MẠCH:**
  - `[CURRENT HUMAN DECISION]`: Internal family discourse.
  - `[PROPOSAL/OBSOLETE]`: `ERD_v0.1.md` xếp MẠCH vào nhóm "Editorial Content (Publication)" public ra ngoài. `[SUPERSEDED]`
- **PUBLIC:**
  - `[CURRENT HUMAN DECISION]`: External family voice (Truyền thông ra xã hội).
  - `[HISTORICAL]`: `index.html` đang chứa các route giả lập (`#/gia-pha`, `#/tu-lieu`) và giao diện hiển thị bài viết MẠCH. `[OBSOLETE]`

## 9. Architecture / Implementation / Product Separation
Rất nhiều nhầm lẫn sinh ra do đánh đồng Code với Semantic:
- **FACT:** Thư mục `generator/` xuất Clara thành JSON chung với MẠCH.
- **ERROR:** Suy diễn rằng "Clara là một chuyên mục của MẠCH".
- **TRUTH:** Clara và MẠCH là hai không gian diễn ngôn độc lập (Intimate vs Internal). Implementation sẽ phải thay đổi để phục vụ Truth này.

## 10. Documentation Authority Map
- File nào là **canonical**: Chưa có file nào thực sự đóng vai trò Canonical Root. Cần thiết lập `README.md`, `PROJECT.md`, `SOURCE_OF_TRUTH.md`.
- File nào là **historical / audit**: Các file trong `docs/audit/`, `docs/research/`.
- File nào là **proposal**: Các `SITEMAP_*.md`, `NAVIGATION_MODEL_*.md`, `ERD_v0.1.md`. Đều cần cập nhật hoặc đánh dấu `[SUPERSEDED]` một số phần.

## 11. Source of Truth Map
- **NAS:** Source of Truth tuyệt đối cho Genealogy (Phả hệ gốc) và Images.
- **Local SQLite (`family_archive.db`):** Development / Runtime Working Copy. `[FACT]` KHÔNG PHẢI Canonical DB.
- **`genealogy.json`:** Seed / Import / Projection Artifact. `[FACT]`

## 12. Legacy / Obsolete Assumptions
- Đánh đồng Public với MẠCH.
- Đánh đồng Clara với Bài viết MẠCH.
- Bị đánh lừa bởi UI (`index.html`) để cho rằng Public = Magazine.

## 13. Conflicts
- **Semantic vs Code:** Code hiện tại (`app-v2.js`, `server/index.js`) đang gộp chung dữ liệu bài viết (Stories) và ném ra Public. Điều này mâu thuẫn trực tiếp với Current Human Decision (MẠCH là Internal, Public là External riêng).
- **Semantic vs Docs:** `ERD_v0.1.md` và `IMPLEMENTATION_BASELINE.md` vẫn còn chứa các câu chữ nhóm MẠCH và Clara vào "Publication Layer".

## 14. Open Questions
- Hình thái nội dung cụ thể của "PUBLIC" (External Family Voice) sẽ là gì nếu nó không phải là MẠCH? (Sẽ viết các bài tiểu luận công khai riêng, hay chọn lọc bài từ MẠCH đẩy ra?)
- Clara sẽ được trình bày ở UI nào trong Member Space để tách biệt khỏi MẠCH?

## 15. Recommended Documentation Reading Order (Khi được xây dựng)
1. `README.md` (Điểm neo, bản đồ định hướng)
2. `PROJECT.md` (Lý do tồn tại, Product Identity)
3. `PROJECT_MAP.md` (Mục lục tài liệu)
4. `SOURCE_OF_TRUTH.md` (Các nguyên lý bất biến)
5. `HELP.md` (Cẩm nang thao tác cho Dev/Agent)

## 16. Documentation Gaps
Repository hiện tại ngập tràn các file Audit và Archaeology nhưng lại **vắng bóng hoàn toàn** 5 file lõi (`PROJECT.md`, `SOURCE_OF_TRUTH.md`, v.v.) chuẩn chỉ. `README.md` cũ cũng đang trỏ sai thông tin.

## 17. Final Status
- **Trạng thái:** HOÀN THÀNH AUDIT - SẴN SÀNG ĐỂ TẠO DOCUMENTS.
- Mọi mâu thuẫn về khái niệm đã được bóc tách. Đã có đủ bằng chứng (Evidence) và Human Decisions để xây dựng cấu trúc `README -> PROJECT -> SOURCE_OF_TRUTH`.
