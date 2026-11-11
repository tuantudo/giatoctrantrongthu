# DATABASE GAP MAP v0.3
*(Physical Current → Target Concept Mapping)*

| Physical Current (SQLite) | Target Concept (ERD_v0.1) | Gap | Evidence | Human Decision Required? | Migration Later? |
|---|---|---|---|---|---|
| `people` | **Person** | JSON payload dependency | `birthYear`, `deathYear`, `notes` có, nhưng chi tiết đều nằm ở JSON `payload`. | Không | Có (Tách cột) |
| `accounts` | **Account** | Gần chuẩn, nhưng vẫn tồn tại song song `admin_users`. | Có 1 `accounts` và 2 `admin_users`. | Gộp hay giữ `admin_users`? | Có (Gộp bảng) |
| `edges` | **Relationship** | Bảng đang **trống rỗng**. | `SELECT COUNT(*) FROM edges` = 0. Con cái nhét trong JSON của `families`. | Cần seed lại edges? | Có (Generate dữ liệu) |
| `families` | **GenealogyConstruct** | Lưu danh sách con dưới dạng mảng JSON thay vì quan hệ độc lập. | `payload` chứa `{"children":["@I1@",...]}` | Dùng JSON hay chuyển qua Relation table? | Có (Chuẩn hóa) |
| `memories` | **Memory** | Gắn thẳng ID vào `person_id`, thiếu FamilySpace. | Khuyết cột `space_id` | Khi nào tích hợp Family Space? | Có |
| `media` / `person_media` | **Media** | Bị lỗi toàn vẹn liên kết. | `media_id` đều = NULL. | Duyệt phương án Fix Data. | Có (Reseed) |
| `identity_mappings` | **IdentityMapping** | Khá chuẩn. | 1 bản ghi tồn tại. | - | Không |
| *Không có* | **Claim** / **Evidence** | Chưa code bảng nào. | Bảng vật lý không tồn tại. | Ưu tiên tính năng Evidence? | Có |
| *Không có* | **FamilySpace** | Không có bảng lưu định danh không gian. | Khái niệm chưa có trong CSDL. | Thiết kế ERD cụ thể cho Space. | Có |

**ĐẶC BIỆT CHÚ Ý:** 
- Tuyệt đối không đánh đồng `families` (GenealogyConstruct) thành `FamilySpace`. Một bên là Dữ liệu quan hệ Phả hệ, một bên là Không gian tương tác của Thành viên.
