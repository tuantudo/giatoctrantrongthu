# TARGET DOMAIN MODEL & 4-GRAPH ARCHITECTURE
## Hệ thống: Giatộc Trần Trọng Thủ (Family Social System)

*Trạng thái tài liệu: PROPOSED / TARGET SPECIFICATION*
*Quy tắc nhãn: `[CURRENT]`, `[VERIFIED]`, `[UNKNOWN]`, `[CONFLICT]`, `[PROPOSED]`, `[OPEN DECISION]`*

---

## A. CURRENT DOMAIN MODEL
Mô hình hiện tại `[CURRENT]` là một kho lưu trữ tập trung (CMS-style), nơi toàn bộ dữ liệu (Genealogy, Media, Story) đều là Canonical Data, được nhập liệu và sở hữu bởi một thực thể duy nhất là `admin_users` (Staff). Các mối quan hệ hiện hữu:
* `Person` ← `Edge` → `Person` (Genealogy cơ bản).
* `Person` ← `Memory` / `Story`.
* Không có không gian riêng (Family Space), không có danh tính người dùng độc lập (Account/Member).

---

## B. TARGET DOMAIN MODEL (Mô hình đích)
Định hướng Giatộc thành một **Family Social System**. Ở đó, Family không phải là một "Group" kiểu diễn đàn, mà là một không gian thiêng liêng có tính chất kế thừa. Dữ liệu chia làm hai nửa rõ rệt: **Genealogy (Gia phả khách quan)** và **Social / Memory (Ký ức chủ quan)**.

---

## C. HỆ THỐNG 4 GRAPH (4-GRAPH ARCHITECTURE)

### 1. Identity Graph (Sơ đồ Định danh)
* **Person `[CURRENT]`**: Thực thể phả hệ khách quan (dù sống hay chết).
* **Account `[PROPOSED]`**: Định danh đăng nhập hệ thống (Email, Password, Session).
* **Identity Mapping `[PROPOSED]`**: 
  - Một `Person` có thể KHÔNG CÓ `Account` (Người đã khuất, trẻ em, người không dùng).
  - Một `Account` có thể quản lý (Đại diện) cho NHIỀU `Person` (Bố mẹ quản lý hồ sơ cho con nhỏ, cháu quản lý cho bà).
  - **Delegation `[OPEN DECISION]`**: Quyền ủy thác. Ai có quyền tạo Account đại diện cho một Person?

### 2. Genealogy Graph (Sơ đồ Gia phả)
* Mối quan hệ hạt nhân: `Person` ↔ `Relationship` (`Edge`) ↔ `Person`.
* **Phân loại `[CURRENT]`**: Parent, Child, Spouse.
* **Tính chất**: Thay vì gọi là "Sự thật tuyệt đối", đây là **Genealogical Claim / Conclusion** → **Evidence / Source** → **Canonicalized State**. Một genealogy fact có thể là trạng thái canonical hiện tại của hệ thống nhưng vẫn phải có provenance/evidence. Không coi canonical database là metaphysical truth.

### 3. Social Graph (Sơ đồ Tương tác)
* Không phải mạng xã hội mở. Tương tác xoay quanh Ký ức và Di sản.
* **Tương tác `[PROPOSED]`**: 
  - `Person` tạo `Memory` (Ký ức) gắn với một `Person` khác (VD: Con viết về Cha).
  - `Account` đóng góp `Media` (Ảnh cũ).
  - *Following/Subscription*: **NOT REQUIRED FOR MVP**, **OPEN FOR FUTURE**. Sự gắn kết tạm thời có thể dựa trên Genealogy Graph.

### 4. Authority Graph (Sơ đồ Thẩm quyền)
* `[PROPOSED]` Thẩm quyền không dựa trên RBAC (Role-Based) tĩnh, mà là hàm số: **Actor + Resource + Relationship + Action + State**.
* **Ví dụ**:
  - *Actor* (Account Tuấn) + *Action* (Edit bio) + *Resource* (Person Tuấn) = **DIRECT WRITE**.
  - *Actor* (Account Tuấn) + *Action* (Đổi ngày sinh) + *Resource* (Person Tuấn) = **SUBMIT PROPOSAL** (Vì ngày sinh là Canonical Fact).

---

## D. FAMILY SPACE MODEL (Mô hình Không gian Gia đình)
Family Space `[TARGET]` là sự kết hợp giữa Nhánh (Lineage) và Gia đình Hạt nhân (Nuclear Family). Phân biệt rạch ròi với implementation `[CURRENT]` (hiện tại `families` table chỉ lưu thông tin genealogy vợ chồng).
* **Thuộc tính**: Một `Person` có thể thuộc nhiều Không gian.
* **Membership**: `Account` có quyền truy cập vào các Không gian mà `Person` của họ trực thuộc.
* **Trạng thái Dữ liệu**:
  - *Shared Family Content*: Ảnh gia đình, giỗ chạp chung (Mọi thành viên trong Space đều có quyền upload, không cần Staff duyệt).
  - *Genealogy Projection*: Space chỉ hiển thị lát cắt phả hệ liên quan đến không gian đó.

---

## E. CONTENT OWNERSHIP (Quyền sở hữu Nội dung)
Không mặc định mọi hành động WRITE của Member phải đi qua Submission.

1. **Member-owned (Quyền cá nhân)** `[PROPOSED]`:
   - Avatar, Contact, Bio chủ quan, Memory cá nhân viết về người khác.
   - Hành động: **Direct Write** (Lưu trực tiếp).
2. **Shared Family Content (Nội dung gia đình)** `[PROPOSED]`:
   - Ảnh sum họp, sự kiện gia đình nội bộ.
   - Hành động: **Collaborative Write** (Các thành viên trong Space tự quản lý).
3. **Canonical Genealogy Fact (Sự thật Phả hệ)** `[VERIFIED]`:
   - Ngày sinh, quan hệ huyết thống, tên khai sinh.
   - Hành động: **Proposal / Submission** (Phải qua Canonical Authority duyệt).
4. **Editorial Content (Nội dung Biên tập)** `[VERIFIED]`:
   - MẠCH, Clara. Thuộc quyền của Author (Tuấn).

---

## F. CONTRIBUTION MODEL (Mô hình Đóng góp)
Phá vỡ tư duy "Mọi thứ đều là Submission".
* **Khi nào cần Submission?** Khi sửa đổi hoặc bổ sung **Canonical Fact**. (Ví dụ: Thêm một người con mới, sửa ngày mất của ông nội).
* **Khi nào Direct Collaboration?** Khi chia sẻ **Social Memory / Media** trong vùng an toàn (Family Space). Nếu nội dung vi phạm, Moderator có quyền hậu kiểm (Post-moderation), thay vì bắt chờ duyệt mọi bức ảnh.

---

## G. PIPELINE & PUBLICATION MODEL
Hai pipeline song song không bao giờ giao nhau `[CURRENT]`:

1. **Genealogy & Application Pipeline:**
   `Member / Account` → Tương tác trong `Family Space` → Nếu chạm vào Canonical Fact → `Governance (Submissions)` → `Staff Duyệt` → `Canonical Database` → `Public API` → `Web`.
2. **Editorial Pipeline (MẠCH, Clara):**
   `Tuấn` → Viết tại `Obsidian` → `Generator Final` → `Static JSON Artifacts` → `Web`. (Hoàn toàn bypass Database).

---

## H. DATABASE ENTITIES (CANDIDATE MAP)

| Entity | Trạng thái | Lý do |
|---|---|---|
| `admin_users` | `[CURRENT]` | Sẽ chuyển thành `accounts`. |
| `accounts` | `[PROPOSED]` | Định danh đăng nhập. |
| `people` | `[CURRENT]` | Thực thể phả hệ hạt nhân. |
| `person_account_link` | `[PROPOSED]`| Map 1 Account với N People. |
| `families` | `[CURRENT]` | Phân biệt `[CURRENT]` families (genealogy relations) và `[TARGET]` Family Space (interactive spaces). |
| `edges` | `[CURRENT]` | Lưu quan hệ Genealogy. |
| `memories` | `[PROPOSED]` | Biểu diễn author, subject Person(s), Space, media, provenance, visibility, moderation state. |
| `stories` | `[CURRENT]` | Bài viết độc lập. |
| `media` | `[CURRENT]` | File tĩnh. |
| `submissions` | `[PROPOSED]`| Bảng lưu trữ Draft/Proposals chờ duyệt. |

---

## I. AUTHORITY MATRIX (Ma trận Phân quyền)

| Resource | Member (Own) | Member (Other) | Moderator | Editor (Staff) | Canonical Authority |
|---|---|---|---|---|---|
| **Own Profile Bio** | Direct Write | Read Only | Soft Delete | Read Only | N/A |
| **Own Core Facts** | Propose Edit | Read Only | Review | Edit | Approve |
| **Ancestor Facts** | Propose Edit | Read Only | Review | Edit | Approve |
| **Family Media** | Direct Write | Read Only | Soft Delete | N/A | N/A |
| **Clara/MẠCH** | Read Only | Read Only | N/A | Edit | Publish |

*(Các quyền trên là `[PROPOSED]` chờ Human duyệt).*

---

## J. MỘT SỐ VẤN ĐỀ CẦN HUMAN QUYẾT ĐỊNH (OPEN DECISIONS)
1. **Delegation (Ủy quyền)**: Một Account tạo ra cho người lớn tuổi không dùng email, ai sẽ giữ quyền sở hữu Account đó?
2. **Visibility của Family Space**: Nội dung up vào Family Space (ảnh riêng tư) có mặc định bị đưa ra Public Web không, hay chỉ các account có Membership mới thấy?
3. **Quy tắc Moderation**: Ký ức (Memory) viết về người khác là Direct Write hay Cần Duyệt? (Ví dụ: Nếu viết ký ức sai lệch về một vị tổ tiên).

---

## K. BƯỚC TIẾP THEO (NEXT STEPS)
Để chuyển từ Domain Model này sang Database Schema thực tế:
1. Đợi Human giải quyết các `OPEN DECISION`.
2. Lập **ERD (Entity Relationship Diagram)** chi tiết cho các bảng mới (`accounts`, `person_account_link`, `submissions`).
3. Thực thi Database Migration trên local `sqlite` để test mô hình Account/Person. 
4. Nâng cấp `server/auth.js` thành Identity Server.
