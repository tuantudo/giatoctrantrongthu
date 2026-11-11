# DATABASE FORENSICS REPORT v0.4
*(Reconstructing Current Physical Data Semantics)*

## A. PERSON_MEDIA FORENSICS
**Quan sát:** 173 bản ghi trong `person_media` có `media_id` = NULL.
**Phương pháp phân tích:** Viết script Python (Read-Only) để trích xuất `media_hash` từ trường `relation_id` (định dạng `PMR_<person_id>_<media_hash>`) và đối chiếu với danh sách ID thực tế trong bảng `media`.
**Kết quả Forensic:**
- Tổng số bản ghi `person_media`: 173.
- Số bản ghi match thành công với bảng `media`: 173 (100%).
- Số bản ghi mồ côi (Orphan / Không tồn tại): 0.
- **Kết luận:** Dữ liệu hình ảnh **KHÔNG BỊ MẤT** (Not Lost). Liên kết (Association) **KHÔNG BỊ HỎNG** (Not Broken). Lỗi 100% nằm ở đoạn Script Seeding đã quên gán biến vào cột `media_id`, nhưng hệ thống hoàn toàn có thể phục hồi lại nhờ dữ liệu ẩn chứa trong `relation_id`. (Trường hợp D - Legacy/Incomplete record).

## B. RELATIONSHIP FORENSICS
**Quan sát:** Bảng `edges` có 0 records. Thông tin phả hệ con cái được tìm thấy trong JSON `payload` của bảng `families`.
**Phương pháp phân tích:** Dùng Python duyệt qua toàn bộ mảng JSON `payload` của bảng `families`, trích xuất `husband`, `wife`, và mảng `children` ra, sau đó kiểm tra xem các ID này có thực sự tồn tại trong bảng `people` hay không.
**Kết quả Forensic:**
- Tổng số gia đình (families): 68.
- Số liên kết Spouse (Vợ/Chồng) tham chiếu đến nhân vật hợp lệ (Valid): 134.
- Số liên kết Spouse mồ côi (Orphan): 0.
- Số liên kết Children tham chiếu đến nhân vật hợp lệ (Valid): 155.
- Số liên kết Children mồ côi (Orphan): 0.
- **Kết luận:** Bảng `edges` hiện tại là bảng "chết" (Dead/Unused table). Tuy nhiên, kiến trúc lưu trữ quan hệ bằng JSON bên trong `families.payload` lại **CỰC KỲ TOÀN VẸN** (100% Valid). Mọi liên kết cha-con, vợ-chồng đều khớp hoàn hảo với bảng `people`.

## C. ACCOUNT FORENSICS
**Quan sát:** Hai bảng `admin_users` và `accounts` cùng tồn tại song song.
**Phân tích Schema:**
- `accounts`: Có `email`, `role` mặc định là `member`, `status` là `PROVISIONED` / `ACTIVE`. Được dùng cho Member/Người trong dòng họ đăng nhập vào App. Tham gia vào bảng `identity_mappings` để link Account -> Person.
- `admin_users`: Không có `email`, `role` mặc định là `editor` hoặc `owner`. Không được nối với `identity_mappings`. Dành riêng cho nhân sự quản trị (Control Room).
- **Kết luận:** Đây KHÔNG PHẢI là thiết kế dư thừa hay mâu thuẫn. Hệ thống hiện đang tách bạch hai khái niệm: **Staff Account** (`admin_users` - quyền thao tác nội dung) và **Member Account** (`accounts` - quyền công dân của Phả hệ).

## D. FOREIGN KEY FORENSICS
**Quan sát:** Khẳng định SQLite không có Foreign Key.
**Kết quả Forensic:** 
Lệnh `PRAGMA foreign_key_list(table_name)` trả về tập rỗng cho TẤT CẢ các bảng.
Tuy nhiên, DB không bị "Corrupted". Đây là mô hình **Application-level integrity** - tức là code Node.js và bản gốc `genealogy.json` tự động giữ cho dữ liệu sạch, DB chỉ làm nơi chứa (Document Store/Cache). Không có Foreign Key (DB-level integrity) là một Fact, nhưng không phải là một lỗi toàn vẹn hiện hành.

---

## E. TARGET GAP (Đối chiếu với ERD_v0.1.md)

| CURRENT PHYSICAL | TARGET CONCEPT | EVIDENCE | CONFIDENCE | GAP | RISK | HUMAN DECISION |
|---|---|---|---|---|---|---|
| `families.payload.children` | Quan hệ `edges` (Parent-Child) | 155 valid children | HIGH | ERD muốn tách Edge, nhưng hiện tại 100% nằm trong JSON. | Low (Data vẫn toàn vẹn) | Chuyển JSON sang Edge table hay giữ nguyên? |
| `admin_users` & `accounts` | `Account` | 2 bảng riêng rẽ | HIGH | ERD chỉ vẽ 1 entity Account, kèm Delegation/Authority. Thực tế đang dùng 2 bảng vật lý cứng để phân quyền. | Medium (Sẽ khó map quyền sau này) | Có Merge 2 bảng thành 1 và dùng RBAC không? |
| No FK Constraints | Relational Model | PRAGMA check = 0 | HIGH | ERD là mô hình quan hệ chặt (Relational). DB hiện tại là Document-style (No Constraints). | High (Nếu có code mới INSERT bậy) | Có chạy Migration thêm FK Constraint không? |

---

## F. TRẢ LỜI 7 CÂU HỎI CỐT LÕI

**1. 173 records thực sự là gì?**
Đó là 173 bản ghi lưu trữ liên kết giữa một `Person` và một `Media`. Cột `media_id` bị trống do lỗi code Seed, nhưng liên kết vẫn nguyên vẹn nhờ mã `relation_id`.

**2. Có bao nhiêu media thực sự bị mất / không xác định?**
**0**. Hoàn toàn không mất bất kỳ file media (hình ảnh) nào, và không mất bất kỳ liên kết gốc nào.

**3. Genealogy relationship hiện đang nằm ở đâu?**
Nằm 100% trong cột `payload` (định dạng JSON) của bảng `families`.

**4. Có bao nhiêu relationship có thể reconstruct từ families JSON?**
100%. Đã trích xuất và xác minh thành công 134 spouse links và 155 children links. KHÔNG CÓ liên kết mồ côi.

**5. edges có phải dead/unused table không?**
Đúng. Nó hoàn toàn là một bảng chết ở thời điểm hiện tại. (0 records, không được dùng để query phả hệ).

**6. admin_users và accounts thực sự đóng vai trò gì?**
`admin_users` = Legacy/Staff Auth dành cho Quản trị viên (Control Room).
`accounts` = Member Auth dành cho người dùng cuối (Family App).

**7. Current DB có đủ đáng tin để bắt đầu thiết kế schema migration chưa?**
**YES**. 
*(Lý do: Trái với giả định ban đầu, dù thiết kế SQLite hiện tại rất lỏng lẻo và thiếu Constraint, nhưng DỮ LIỆU BÊN TRONG LẠI CỰC KỲ SẠCH VÀ TOÀN VẸN. 100% Relation khớp, 100% Media có thể phục hồi. Do đó, Physical Database Baseline này ĐÃ ĐỦ ĐỘ TIN CẬY để chuyển sang giai đoạn Migration/Redesign mà không lo sợ rác dữ liệu).*
