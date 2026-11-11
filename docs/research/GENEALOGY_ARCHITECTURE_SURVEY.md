# Genealogy Architecture Survey

## 1. Scope
Tài liệu này khảo sát kiến trúc của ba hệ thống tiêu biểu trong lĩnh vực lưu trữ và quản lý gia phả (Genealogy):
- **Gramps / Gramps Web**: Phần mềm mã nguồn mở phổ biến nhất (Desktop + Web).
- **webtrees**: Nền tảng web-based mã nguồn mở hàng đầu, thiết kế bám sát tiêu chuẩn GEDCOM.
- **GEDCOM (v5.5.1 / v7.0) / FamilySearch**: Tiêu chuẩn trao đổi dữ liệu toàn cầu và nền tảng dữ liệu khổng lồ của FamilySearch.

Mục tiêu là thu thập các pattern thực tế về Data Model, Database, Storage, Evidence/Provenance, và Identity/Authority để cung cấp tham chiếu (reference) cho kiến trúc của Giatộc. Tài liệu này KHÔNG chứa quyết định kiến trúc cho Giatộc.

## 2. Research Questions
1. **Genealogy Data Model:** Các thực thể Person, Family, Event, Place, Source, Citation, Repository được kết nối với nhau như thế nào?
2. **Database:** Engine, deployment model, transaction, backup.
3. **Storage:** Phân tách giữa DB, Media, Search, Cache.
4. **Evidence / Provenance:** Source → Citation → Claim → Conclusion được mô hình hóa ra sao?
5. **Identity / Authority:** Account, Person, Membership, Privacy, Delegation được thiết lập như thế nào?

---

## 3. Gramps / Gramps Web
- **Bản Desktop**: Viết bằng Python, sử dụng SQLite (hoặc BSDDB cũ) làm local database.
- **Gramps Web**: Giao diện web đồng bộ với DB qua API.
- **Data Model**: Dựa trên các primary objects: Person, Family, Event, Place, Source, Citation, Repository, Media, Note.
- **Identity/Authority**: Gramps Web có khái niệm người dùng (Users) với Role-based Access Control (Owner, Editor, Contributor, Reader). Tài khoản người dùng có thể (hoặc không) gắn với một Person trong cây.
- **Storage**: Media files lưu trên filesystem (hoặc S3 trong Gramps Web). Text/Metadata lưu trong DB. Search index dùng PostgreSQL full-text search hoặc backend tìm kiếm riêng biệt.

## 4. webtrees
- **Công nghệ**: PHP + MySQL/MariaDB.
- **Data Model**: Lưu trữ dữ liệu cấu trúc dưới dạng các bản ghi (records) GEDCOM thô trong database, sau đó parse khi runtime. Cấu trúc bảng khá phẳng, phụ thuộc mạnh vào cú pháp GEDCOM.
- **Identity/Authority**: Có hệ thống User Accounts. User có thể được liên kết (link) với một `INDI` (Person record) cụ thể. Hệ thống sử dụng liên kết này để áp dụng Privacy rules (ví dụ: User chỉ thấy những người sống có họ hàng gần với mình).
- **Storage**: Media lưu trong thư mục `data/media` trên web server (filesystem). Database lưu trữ cấu trúc cây.

## 5. GEDCOM / FamilySearch
- **GEDCOM (Genealogical Data Communication)**: Tiêu chuẩn de-facto. 
  - Mô hình lõi: `INDI` (Individual - Person), `FAM` (Family - chứa liên kết tới chồng, vợ, và các con), `SOUR` (Source), `REPO` (Repository), `OBJE` (Media).
  - Person không tự kết nối trực tiếp với Person khác, mà phải thông qua `FAM` record (vd: Person A là HUSB của FAM 1, Person B là CHIL của FAM 1).
- **FamilySearch**: Hệ thống multi-tenant, cloud-scale khổng lồ.
  - **Evidence Model**: Cực kỳ phức tạp. Phân tách rõ ràng giữa "Conclusion" (Fact hiển thị ra ngoài) và "Evidence/Claim" (Người A nói Person X sinh năm Y dựa vào Văn bản Z). Mỗi fact đều đính kèm một "Reason this is correct".

---

## 6. Database Architecture
- **Gramps Web**: PostgreSQL, SQLite. Multi-user thông qua API. Có transaction quản lý sửa đổi. 
- **webtrees**: MySQL / MariaDB. Multi-user trực tiếp trên web. 
- **FamilySearch**: Kiến trúc phân tán (Cassandra, Graph DB, Relational DB) phục vụ scale toàn cầu.

## 7. Storage Architecture
- Các hệ thống self-hosted (Gramps Web, webtrees) thường chia rõ:
  - **Operational DB**: MySQL/PostgreSQL lưu metadata, event, relation.
  - **Media Storage**: Filesystem cục bộ hoặc cloud object storage (S3) chứa hình ảnh, PDF.
  - **Cache/Background**: Gramps Web dùng Redis + Celery để xử lý việc import/export file GEDCOM lớn (tránh block main thread).

## 8. Evidence / Provenance
- Cả ba hệ thống đều tuân thủ luồng: **Repository** (Nơi lưu trữ) → **Source** (Tài liệu gốc) → **Citation** (Trích dẫn cụ thể) → Gắn vào một **Event** hoặc **Fact** của một **Person**.
- FamilySearch đưa model này lên cao nhất bằng việc yêu cầu mọi thay đổi (Conclusion) trên Shared Tree phải có Reason/Source đi kèm.
- webtrees cho phép hiển thị trực tiếp Citation dưới mỗi Fact.

## 9. Identity / Authority
- **Account ↔ Person**: webtrees cho phép link 1 User account với 1 Person record. Gramps Web có khái niệm User nhưng thường tập trung vào phân quyền admin/editor hơn là "Family Space".
- **Privacy**: webtrees có bộ rule cực kỳ phức tạp dựa trên Identity: 
  - Người lạ (Public): Không thấy người còn sống.
  - Người đăng nhập (Member): Thấy người còn sống có quan hệ họ hàng.
  - Admin: Thấy tất cả.
- Khái niệm "Delegation" hay "Family Space" (như mạng xã hội thu nhỏ) hầu như KHÔNG CÓ ở Gramps và webtrees (vì chúng thiên về phần mềm lưu trữ/record-keeping truyền thống).

---

## 10. Cross-System Comparison

| Concern | Gramps Web | webtrees | GEDCOM/FamilySearch | Common Pattern | Difference |
|---|---|---|---|---|---|
| **Person ↔ Family** | Person tham gia vào Family object | `INDI` nối với `FAM` bằng thẻ `FAMS`/`FAMC` | Tương tự webtrees | Person không nối trực tiếp Person, mà qua Family/Edge | Mô hình Family đóng vai trò trung gian |
| **Media Storage** | Filesystem / S3 | Filesystem | Object Storage | Tách biệt Media ra khỏi DB | Gramps hỗ trợ S3 native tốt hơn |
| **Evidence Model** | Source, Citation, Repo | Source, Citation, Repo | Cấu trúc Evidence / Conclusion | Tách bạch giữa Tài liệu (Source) và Trích dẫn (Citation) | FamilySearch ép Reason/Proof chặt chẽ nhất |
| **Identity/Account**| RBAC (Admin, Editor...) | Account linked to `INDI` | Account linked to FS Tree | Có tách biệt Account và Entity | webtrees ứng dụng link để xử lý Privacy |

---

## 11. Common Patterns
- **Person và Family là hai Entity độc lập**: Quan hệ cha-con, vợ-chồng không phải là 1 line trong bảng Person, mà là 1 entity trung gian (Family).
- **Tách biệt Storage**: Bất kể database engine là gì, Media (ảnh, scan) luôn được thiết kế để nằm ngoài database (trên Filesystem hoặc Object Storage).
- **Privacy mặc định cho người sống**: Dữ liệu người sống luôn bị ẩn đối với khách vãng lai.

## 12. Divergent Patterns
- **Lưu trữ lõi (Core DB schema)**: 
  - webtrees giữ data gần như nguyên thủy định dạng GEDCOM (dùng text blob) để parse.
  - Gramps thiết kế schema relational (hoặc object) rất chặt chẽ, GEDCOM chỉ là format để export/import.
- **Mục đích của Account**: 
  - Gramps: Account là để "quản trị" phần mềm.
  - webtrees: Account là để "tham gia" vào cây và xem thông tin họ hàng (gần với Giatộc hơn).

## 13. Trade-offs
- **Tuân thủ chặt chẽ GEDCOM vs. Custom Model**: Tuân thủ chặt GEDCOM giúp import/export không mất data, nhưng giới hạn khả năng mở rộng (như thêm Social Graph, Discussion).
- **Lưu trữ Blob vs Relational Tables**: webtrees lưu GEDCOM blob cho tốc độ import/export nhanh, nhưng query phức tạp lại khó.

## 14. Unknowns
- Chưa rõ cách FamilySearch lưu trữ dữ liệu Graph ở quy mô tỷ node dưới tầng vật lý.
- Cách Gramps Web xử lý conflict khi nhiều user sửa cùng một Person record trong cùng một thời điểm.

## 15. Implications for Giatộc
- Mô hình **Source → Citation → Fact** của các hệ thống này là precedent (tiền lệ) quan trọng khi Giatộc thiết kế tính năng Chứng minh/Đóng góp thông tin (Claims/Evidence).
- Việc tách **Media Storage** (vd: NAS/S3) ra khỏi Database là một precedent kỹ thuật cần xem xét để tối ưu hóa performance và backup.
- Tính năng **liên kết User Account với Person Record** của webtrees để quyết định quyền hạn xem thông tin (Privacy) có sự tương đồng lớn với Identity Mapping mà Giatộc đã thử nghiệm ở P0.
- Các hệ thống hiện tại thiên về "Lưu trữ phả hệ" (Genealogy Record-keeping). Hầu như không có hệ thống nào có mô hình "Family Space" (Không gian tương tác/mạng xã hội gia đình). Đây là một gap lớn trên thị trường và Giatộc sẽ phải tự thiết kế mô hình Social Graph này thay vì tham khảo trực tiếp.

## 16. Architecture Questions Requiring Human Decision
1. Giatộc có muốn tương thích 100% với GEDCOM (như webtrees) để ưu tiên Import/Export, hay sẽ tự do mở rộng Schema (như Gramps/Social Network)?
2. Storage cho Media (Tư liệu, ảnh thờ, giấy tờ) sẽ nằm chung máy chủ (Filesystem) hay đẩy ra Cloud/NAS độc lập ngay từ đầu?
3. Với tính năng Privacy, Giatộc có áp dụng rule tự động ẩn toàn bộ thông tin người sống với Public, hay để gia đình tự tick chọn ai được công khai?

## 17. Sources
- [Gramps Project Documentation](https://gramps-project.org/)
- [webtrees Documentation](https://webtrees.net/)
- [GEDCOM 5.5.1 / 7.0 Specification](https://gedcom.io/)
- [FamilySearch Engineering Blog (Various public posts)](#)
