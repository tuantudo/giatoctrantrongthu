# GIATỘC ARCHITECTURE CONSOLIDATION v0.1

*Mission: GIATỘC ARCHITECTURE CONSOLIDATION v0.1*
*Status: COMPLETED*

## 1. MỤC TIÊU & TẦM NHÌN CONSOLIDATION
Dự án không đập đi xây lại (Evolution without Rupture / Stable Outside, Evolvable Inside). Kiến trúc hiện hành (tài sản tư duy) được đối chiếu với **Current Human Product Decision** để loại bỏ các nhầm lẫn giữa *Implementation Fact* và *Semantic Truth*, từ đó tạo ra một **Architecture Baseline vNEXT** nhất quán, sẵn sàng giao quyền cho bộ phận UI (Cline).

## 2. PHÂN LOẠI TÀI LIỆU (DOCUMENT STATUS MAP)
- `docs/audit/GIATOC_PROJECT_PURPOSE_SOURCE_MAP_AUDIT_v0.1.md` ➔ **CANONICAL** (Chứa Product Model gốc).
- `docs/architecture/ERD_v0.1.md` ➔ **WORKING** (Schema hợp lệ, nhưng phần diễn giải "Editorial Content" gộp MẠCH và Clara là OBSOLETE).
- `docs/architecture/IMPLEMENTATION_BASELINE.md` ➔ **WORKING** (Liệt kê gap kỹ thuật đúng, nhưng wording đánh đồng MẠCH/Clara thành Publication Engine là OBSOLETE).
- `docs/audit/GIATOC_PRODUCT_EVOLUTION_AUDIT_v0.1.md` ➔ **SUPERSEDED** (Bị thay thế bởi Purpose Audit).
- `docs/architecture/SITEMAP_v0.1.md` ➔ **OBSOLETE** (Mang tàn dư của Public Tree).
- `docs/architecture/NAVIGATION_MODEL_v0.1.md` & `USER_FLOWS_v0.1.md` ➔ **NEEDS REVISION** (Cần cập nhật theo Product Model mới).
- `docs/README.md` & `README.md` ➔ **NEEDS REVISION** (Sẽ được viết lại để trở thành Discovery Map).

## 3. ARCHITECTURE LAYERS (BASELINE vNEXT)
Dưới đây là các layer kiến trúc đã được chốt (Canonical), giữ nguyên những gì đã xây dựng được:

### 3.1. PRODUCT / PURPOSE (Chốt)
- **Hệ sinh thái phân lớp:** Gia Tộc không phải là một "Public Tree". Nó chia thành hai bán cầu: `FAMILY / GENEALOGY` (Lưu trữ lõi) và `CONTENT / DISCOURSE` (Không gian diễn ngôn).
- **Quy tắc:** Evolution without Rupture - Danh tính sản phẩm không đổi tùy tiện dù implementation thay đổi.

### 3.2. CONTENT / DISCOURSE MODEL (Chốt)
Gồm 3 scope tuyệt đối KHÔNG gộp chung:
- **THƯ GỬI CLARA:** Intimate, personal, private discourse.
- **MẠCH:** Internal family intellectual / cultural discourse.
- **PUBLIC:** External family voice.

### 3.3. DOMAIN / ONTOLOGY (Chốt từ ERD_v0.1)
- `Person` (Node gia phả) **≠** `Account` (Định danh hệ thống). Liên kết bằng `IdentityMapping`.
- `GenealogyConstruct` (Cấu trúc phả hệ: Vợ-Chồng, Cha-Con) **≠** `FamilySpace` (Không gian tương tác thành viên).
- **Submission:** Không phải universal write. Chỉ dùng khi đề xuất sửa đổi Canonical Genealogy.

### 3.4. SOURCE OF TRUTH MODEL (Chốt)
- **NAS (MariaDB / Filesystem):** Source of Truth cho Genealogy và Images.
- **Local SQLite (`family_archive.db`):** Development / Runtime Working Copy. Tuyệt đối không gọi là Canonical Genealogy DB.
- **`genealogy.json`:** Seed / Projection Artifact.

### 3.5. PUBLIC CONTRACT
- URL, Navigation, và Core Concepts (Tên MẠCH, Thư Clara, Phả Đồ) phải ổn định (Stable).
- Internal implementation (cách Generator parse JSON, cách Backend gọi SQLite) có thể thay đổi (Evolvable).

## 4. RESOLVING CONFLICTS & IMPLEMENTATION GAPS
- **Thực trạng Code:** File `server/index.js` và `member-app.js` đang fetch `stories` và gộp chung Clara vào MẠCH, đẩy ra Public.
- **Kết luận Kiến trúc:** Đây là một `[IMPLEMENTATION GAP]`. Code đang lệch chuẩn với Architecture. Không được lấy cấu trúc Code hiện tại để ép Clara và MẠCH vào cùng một Data Model hay UI. Sẽ cần Migration sau này.

## 5. BỨC TRANH TỔNG THỂ (KIẾN TRÚC HIỆN TẠI ĐÃ ĐẠT ĐƯỢC GÌ?)
1. Đã hình thành Identity Boundary vững chắc (Authentication, Session, IdentityMapping).
2. Đã dịch chuyển thành công từ Static JSON sang Database-backed (SQLite).
3. Đã có ERD quy hoạch được sự khác biệt giữa Data Cốt lõi (Person) và Data Tương tác (Space, Memory).
4. Đã phân tách được 3 mức độ diễn ngôn: Intimate (Clara) - Internal (MẠCH) - External (Public).

**Open Questions (Blocking):**
1. Physical Data Schema: Clara, MẠCH, và Public sẽ được thiết kế Database Schema như thế nào để tách biệt hoàn toàn (Dùng chung bảng `stories` với `visibility_flag` hay tách hẳn bảng)?
2. UI Composition: Trong Member Space, Clara và MẠCH sẽ hiển thị ở 2 tab/view tách biệt hoàn toàn hay chung một "Reading Library"?

---

## 6. ARCHITECTURE HANDOFF FOR UI (FOR CLINE)

> **GỬI CLINE (UI/UX ENGINEER):**
> Dưới đây là các ràng buộc kiến trúc bạn PHẢI tuân thủ khi thiết kế UI (Shell, Navigation, Sitemap v0.2). TUYỆT ĐỐI KHÔNG giả định hoặc sửa đổi Architecture bằng UI.

### 6.1. CURRENT PRODUCT IDENTITY
Giatộc là một "Family Information System" kết hợp với các phân lớp diễn ngôn riêng biệt.
**Không thiết kế UI trông giống SaaS Dashboard thô cứng.** Hãy hướng tới phong cách "Digital Institution / Archive / Heritage".

### 6.2. BOUNDARIES & SEMANTICS (BẮT BUỘC TUÂN THỦ)
- **MẠCH ≠ PUBLIC:** MẠCH là không gian thảo luận văn hóa/trí thức **nội bộ**. Không thiết kế MẠCH như một tờ báo mạng public.
- **PUBLIC:** Là tiếng nói đại diện (External Voice). Giao diện Public chỉ hiển thị những gì được dán nhãn "Public". KHÔNG thiết kế bất kỳ cây gia phả (Public Tree) hay hồ sơ (Public Person) nào trên Public Shell.
- **THƯ GỬI CLARA:** Là diễn ngôn cá nhân, thân mật. Hãy thiết kế không gian đọc/hiển thị Clara sao cho mang tính riêng tư, không bị trộn lẫn với không gian nghị luận của MẠCH.
- **Account ≠ Person:** Giao diện User Profile (`/me`) phải thể hiện rõ: "Bạn đang đăng nhập bằng Tài khoản X" và "Bạn đang đại diện cho Nhân vật Y trong Gia phả".

### 6.3. MEMBER SPACE & FAMILY SPACE
- Member Space là toàn bộ không gian sau khi đăng nhập.
- Hãy thiết kế UI hỗ trợ khái niệm "Member-owned Content" (ví dụ: Góc ký ức của tôi) phân biệt với "Canonical Genealogy" (Cây phả hệ gốc không thể tự do chỉnh sửa).

### 6.4. TERMINOLOGY
- **ĐƯỢC DÙNG:** "MẠCH", "Thư gửi Clara", "Cây phả đồ", "Hồ sơ nhân vật", "Tài khoản".
- **KHÔNG DÙNG:** "Public Genealogy", "Tạp chí Public", "Canonical SQLite", "Admin Dashboard" (thay vì Member Space).

### 6.5. UI CONSTRAINTS (NHỮNG GÌ BẠN ĐƯỢC VÀ CHƯA ĐƯỢC LÀM)
- **ĐƯỢC LÀM:** 
  - Xóa bỏ mọi route "rác" trên trang Public cũ (`#/gia-pha`, `#/tu-lieu`).
  - Thiết kế Sitemap v0.2 phẳng (flatten) cho Member Space, thoát khỏi `#` Hash Routing cũ.
  - Đề xuất Component hiển thị độc lập cho Clara và MẠCH.
- **KHÔNG ĐƯỢC LÀM:**
  - Không tự gộp Clara vào danh mục của MẠCH trên UI.
  - Không tự định nghĩa Database Schema hay API Data Mapping để phục vụ UI.
- **TRÁNH GIẢ ĐỊNH (OPEN QUESTIONS):**
  - Tránh giả định rằng mọi bài viết MẠCH đều sẽ public ra ngoài. UI cần có khả năng phân biệt bài MẠCH nội bộ và bài Public.
