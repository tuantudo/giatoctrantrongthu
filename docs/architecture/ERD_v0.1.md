# AUTHORITY + DOMAIN MODEL & ERD v0.1

*Mission Status: PROPOSED*
*Mục tiêu: Xây dựng Target Domain Model và ERD v0.1 có khả năng tiến hóa từ Current System, đảm bảo các nguyên tắc về Identity, Genealogy, Social và Authority.*

---

## A. BẢN ĐỒ MAPPING (CURRENT → TARGET)
Dưới đây là phương án chuyển đổi từ implementation hiện tại sang khái niệm đích. **TUYỆT ĐỐI KHÔNG** migrate hoặc rename trực tiếp trên CSDL lúc này.

| Current Implementation | Target Entity | Action | Migration Risk |
|---|---|---|---|
| `people` | `Person` | Preserve / Extend | Thấp. Giữ nguyên làm hạt nhân phả hệ. |
| `admin_users` | `Account` | Migration later | Cao. Chuyển đổi Authentication và Session logic. |
| `edges` | `Relationship` | Preserve / Extend | Trung bình. Cần thêm cột provenance/evidence. |
| `families` | `GenealogyConstruct`| Preserve | Thấp. Giữ làm cấu trúc phả hệ (Husb-Wife), không trộn lẫn với Family Space. |
| `memories` | `Memory` | Redesign / Extend | Cao. Gỡ bỏ sự phụ thuộc 1:1 với Person, chuyển thành n:m subjects, thêm author, space. |
| `media`, `person_media`| `Media` | Extend | Trung bình. Thêm uploader (Account) và ownership. |
| `stories` | `Story` | Extend | Trung bình. Thêm author (Account) và visibility. |
| KHÔNG CÓ | `IdentityMapping` | Tạo mới | N/A |
| KHÔNG CÓ | `Delegation` | Tạo mới | N/A |
| KHÔNG CÓ | `FamilySpace` | Tạo mới | Phức tạp trong việc định nghĩa boundary của Space. |
| KHÔNG CÓ | `Membership` | Tạo mới | N/A |
| KHÔNG CÓ | `Claim`, `Evidence` | Tạo mới | Khối lượng dữ liệu quá khứ chưa có nguồn chứng minh. |
| KHÔNG CÓ | `Submission` | Tạo mới | N/A |
| KHÔNG CÓ | `Authority` | Tạo mới | N/A |

---

## B. ENTITY DEFINITIONS & ERD SUMMARY

### 1. IDENTITY & ACCESS (Định danh & Quyền hạn)
* **`Account`**: Định danh đăng nhập của hệ thống (Email, Password hash, Session). Đại diện cho một con người đang tương tác với website.
* **`Person`**: Thực thể phả hệ (Genealogical node). Có thể sống, đã mất, hoặc chưa bao giờ có Account.
* **`IdentityMapping`**: Liên kết 1:1 hoặc 1:N giữa `Account` và `Person` để trả lời câu hỏi: "Tài khoản này là ai trong cây gia phả?".
* **`Delegation`**: Cấp quyền cho một `Account` được phép quản lý/đại diện cho một `Person` khác (Ví dụ: Cháu quản lý hồ sơ cho ông nội không dùng internet).
* **`Authority`**: Bảng phân quyền động (Actor + Resource + Context + Action + State) dùng thay cho RBAC thuần túy.

### 2. GENEALOGY & PROVENANCE (Gia phả & Truy xuất nguồn gốc)
* **`Relationship`**: Các cạnh (edges) nối các `Person` lại với nhau (Parent, Child, Spouse).
* **`GenealogyConstruct`**: Cấu trúc tạo nhóm phả hệ (như bảng `families` hiện hành, lưu Husband-Wife relations).
* **`Claim`**: Một "Khẳng định" về sự thật gia phả (Ví dụ: "Người A sinh năm 1900"). Có trạng thái `Canonicalized` hoặc `Disputed`.
* **`Evidence` / `Source`**: Bằng chứng cho một Claim (Tài liệu, sổ gia phả cũ, lời kể).

### 3. FAMILY SPACE & SOCIAL (Không gian & Tương tác)
* **`FamilySpace`**: Một thực thể độc lập với Genealogy. Nó là không gian tương tác (collaborative area) dành cho một nhánh hoặc gia đình hạt nhân.
* **`Membership`**: Liên kết `Account` vào `FamilySpace` với các vai trò tương tác (Ví dụ: Member, Moderator).
* **`Memory`**: Ký ức. Có `author_id` (Account), liên kết tới nhiều `subject_ids` (People), có thể thuộc về một `space_id`, đính kèm `media_ids`, có `visibility` và `moderation_state`.
* **`Story`**: Nội dung bài viết dài (Có thể là Editorial từ Obsidian hoặc Story do member viết).
* **`Media`**: Asset được tải lên. Thuộc về `Account` tải lên, gắn với `FamilySpace` hoặc `Person`.

### 4. GOVERNANCE (Kiểm duyệt)
* **`Submission`**: (Không phải là universal write mechanism). Chỉ dùng khi Member muốn thay đổi **Canonical Genealogy Data** (Tạo/Sửa `Person`, `Relationship`, `Claim`).
* **`Review` / `Decision`**: Ghi nhận hành động của Moderator/Editor lên một `Submission` (Approve/Reject).
* **`AuditEvent`**: Log mọi thay đổi trạng thái của các thực thể quan trọng.

---

## C. PRIMARY RELATIONSHIPS & CARDINALITY (Mối quan hệ)

```text
[Account] 1 --- 1..* [IdentityMapping] 1 --- 1 [Person]
[Account] 1 --- * [Delegation] * --- 1 [Person]
[Account] 1 --- * [Membership] * --- 1 [FamilySpace]

[Person] 1 --- * [Claim] * --- 1..* [Evidence]
[Person] 1 --- * [Relationship] * --- 1 [Person]
[Relationship] 1 --- * [Claim]

[Account] 1 --- * [Memory] (As Author)
[Memory] * --- * [Person] (As Subjects)
[Memory] * --- 1 [FamilySpace] (Context)
[Memory] * --- * [Media]

[Account] 1 --- * [Submission] (As Submitter)
[Submission] 1 --- 1..* [Claim] / [Person] / [Relationship] (Proposed Change)
[Account] 1 --- * [Review] (As Moderator) -> 1 [Submission]
```

---

## D. AUTHORITY RELATIONSHIPS & CONTENT OWNERSHIP
Không dùng RBAC ma trận tĩnh. Quyền Write được quyết định bằng Authority Graph:

1. **Member-owned Content (Direct Write)**: 
   - *Quy tắc*: Nếu `Account` = Author của `Memory` / `Media` / Bio.
   - *Hành động*: Được phép **Direct Write** (Tạo, Sửa, Xóa mềm), không cần đi qua bảng `Submission`.
2. **Shared Family Content (Collaborative Write)**:
   - *Quy tắc*: Nếu `Account` có `Membership` hợp lệ trong `FamilySpace`.
   - *Hành động*: Có quyền upload `Media`, viết `Memory` vào Space đó. Cần cơ chế Hậu kiểm (Post-moderation) từ Space Moderator.
3. **Canonical Genealogy (Proposal / Canonicalization)**:
   - *Quy tắc*: Việc sửa `Person` (Ngày sinh, tên), `Relationship`.
   - *Hành động*: `Account` tạo `Submission`. Staff / Canonical Authority thực hiện `Review` và **Canonicalize** dữ liệu đó vào Database chính.
4. **Editorial Content (Publication)**:
   - *Quy tắc*: `MẠCH`, `Clara`.
   - *Hành động*: Author (Tuấn) xuất bản một chiều (Direct Publish) qua luồng Obsidian.

---

## E. NHỮNG QUYẾT ĐỊNH HUMAN CÒN THIẾU (DECISIONS)

### 🔴 BLOCKING (Phải quyết định trước khi vẽ DB Schema)
1. **Delegation Semantics (Quyền uỷ thác)**: 
   - Một Account có được phép tự do Claim "Tôi là đại diện của Person X" không? Hay phải do Admin / Canonical Authority cấp quyền Delegation? (Nếu cho tự do sẽ sinh ra xung đột khi 2 người cùng claim 1 Person).
2. **Family Space Boundaries**:
   - Family Space sẽ được định nghĩa dựa trên tiêu chí nào? 
   - Tự động sinh ra cho mỗi Node (VD: Một Space cho nhánh "Trần Trọng Thủ", một Space con cho "Trần Quốc A")? Hay Admin tạo thủ công (Manual Provisioning)?

### 🟡 NON-BLOCKING (Có thể quyết định trong quá trình dev)
1. **Visibility Model mặc định của Memory**: Khi một Account tạo Memory trong một Family Space, nó có mặc định public ra ngoài không, hay chỉ thành viên của Space mới thấy?
2. **Conflict Resolution trên Evidence**: Nếu có 2 Source cho ra 2 Claim khác nhau về ngày sinh, UI sẽ giải quyết như thế nào? (Về DB đã hỗ trợ 1 Person - N Claims).

### 🟢 FUTURE (Bỏ qua trong MVP)
1. Following / Subscription.
2. Comment, Reaction, Event Timeline tương tác.
3. Phân quyền đa lớp (Sub-moderator cho từng Family Space).

---
*End of Artifact. No code changes executed.*
