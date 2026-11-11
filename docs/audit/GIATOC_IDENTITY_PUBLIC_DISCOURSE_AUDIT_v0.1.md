# GIATỘC IDENTITY & PUBLIC DISCOURSE AUDIT v0.1

## 1. Executive Summary
Báo cáo này phân tích và hệ thống hóa lại các mô hình căn bản của dự án Giatộc xoay quanh **Định danh (Identity)** và **Không gian Diễn ngôn (Discourse)**. Quá trình Audit được thực hiện hoàn toàn từ các tài liệu và dữ liệu vật lý (Read-Only) trong Local Source Tree. Kết quả cho thấy sự phân định rõ ràng về mặt Kiến trúc (Architecture) giữa các thực thể, dù implementation ở code còn nhiều "khoảng trống". Đặc biệt, "Public Home" được xác định rõ là một "Gate" (Cửa ngõ) chứ không phải là một Bảng điều khiển (Dashboard) hay một Cơ sở dữ liệu Gia phả (Genealogy Database).

## 2. Source Inventory
Quá trình Audit đã rà soát các tài liệu định hướng và kỹ thuật:
- `[CURRENT HUMAN DECISION]`: `docs/audit/GIATOC_PROJECT_PURPOSE_SOURCE_MAP_AUDIT_v0.1.md`, `docs/audit/GIATOC_ARCHITECTURE_CONSOLIDATION_v0.1.md`
- `[PROPOSAL]`: `docs/architecture/ERD_v0.1.md`
- `[IMPLEMENTATION FACT]`: Code `server/index.js`, file `genealogy.json`, và báo cáo `REPORT_DATABASE_ADMIN_VERIFICATION_v0.2.md`, `DATABASE_FORENSICS_v0.4.md`.
- `[HISTORICAL / OBSOLETE]`: Frontend routing cũ `app-v2.js`, `index.html`.

## 3. Identity Model Audit
Mô hình Identity của Giatộc không phải là mô hình User/Account truyền thống của SaaS. Nó tách bạch giữa thực thể sinh học/lịch sử và thực thể kỹ thuật số.
- "Sự tồn tại trong dòng họ" (Genealogy Identity) độc lập với "Sự hiện diện trên website" (Digital Identity).
- Mối liên kết giữa hai thực thể này là một Mapping rõ ràng, không phải là một sự đánh đồng.

## 4. Person / Account / Member / Admin
- **Person (`[CURRENT HUMAN DECISION]`):** Một nút (node) trong cây gia phả. Là con người lịch sử/thực tế. Không có email, không có password.
- **Account (`[CURRENT HUMAN DECISION]`):** Một tài khoản kỹ thuật số (`accounts` table) có thông tin đăng nhập. 
- Một Account có bắt buộc tương ứng với Person không? `[PROPOSAL]` trong `ERD_v0.1.md` cho thấy `IdentityMapping` nối 1 Account với 1 Person. Nhưng về mặt logic, hệ thống cho phép Account tồn tại mà không cần Person (vd: Vợ/chồng chưa nhập gia phả, hoặc người ngoài).
- Một Person có bắt buộc có Account không? **KHÔNG**. Rất nhiều người đã khuất hoặc không dùng internet.
- Một Account có thể đại diện cho Person khác không? `[PROPOSAL]` ERD có khái niệm `Delegation` (ủy quyền) để cháu đại diện cho ông. 
- **Member (`[IMPLEMENTATION FACT]`):** Một `Account` có role = `member`, được phép tương tác với dữ liệu họ tộc (Family Space).
- **Admin (`[IMPLEMENTATION FACT]`):** Hệ thống có bảng `admin_users` tách biệt hoàn toàn khỏi `accounts`. Định nghĩa Admin là "Staff / Người vận hành hệ thống" (Owner/Editor), không liên quan đến cấu trúc gia phả.

## 5. Authority Model Audit
Việc phân quyền ở Giatộc không chỉ dừng ở thao tác CRUD.
- **WHO IS SOMEONE (Identity):** Xác định qua `IdentityMapping`.
- **WHO CAN ACT (Access):** Xác định qua Role trong hệ thống (`accounts`, `admin_users`).
- **WHO CAN SPEAK (Voice):** `[OPEN QUESTION]`. Không phải ai có Account cũng được phép phát ngôn đại diện cho gia tộc (Public Voice).
- **WHO CAN EDIT (Truth):** `[PROPOSAL]` ERD có hệ thống `Claim/Evidence/Submission`. Không Member nào được trực tiếp sửa Canonical Genealogy. Chỉ có Admin/Owner mới có quyền phê duyệt thay đổi (Mutation).
- **Tuyệt đối không:** Đánh đồng việc "Có Account" với việc "Có quyền quyết định tiếng nói/hình ảnh gia tộc".

## 6. Family / Genealogy / FamilySpace
- **Gia tộc (Family):** Là một chủ thể tập thể (Collective Entity). 
- **Gia phả (Genealogy):** `[ARCHITECTURE]` Là dữ liệu/cấu trúc liên kết (GenealogyConstruct / relationships). Genealogy KHÔNG PHẢI là bản thể của Gia tộc, nó chỉ là hồ sơ lưu trữ của Gia tộc.
- **Family Space:** `[PROPOSAL]` Là không gian tương tác số cho Member. `[IMPLEMENTATION FACT]`: Code hiện tại đang nhầm lẫn lưu cấu trúc cha con vào bảng mang tên `families`. `FamilySpace` không phải là `GenealogyConstruct`.

## 7. Discourse Model
Giatộc có 3 lớp diễn ngôn (Discourse Scope) với tính chất không thể trộn lẫn. Code hiện tại đang có xu hướng đánh đồng chúng vào thành "bài viết" (`stories`).

## 8. Clara / MẠCH / Public
- **THƯ GỬI CLARA:** `[CURRENT HUMAN DECISION]` Không gian cá nhân, thân mật (Intimate). Hướng tới đối tượng cụ thể. 
- **MẠCH:** `[CURRENT HUMAN DECISION]` Diễn ngôn nội bộ (Internal). Các bài nghị luận, suy tư, chia sẻ của trí thức trong họ dành cho thành viên trong họ.
- **PUBLIC:** `[CURRENT HUMAN DECISION]` Tiếng nói đối ngoại của gia tộc (External Voice).

## 9. Public Home Semantic Role
- **Mục đích:** Không phải là Dashboard. Không phải là thư viện gia phả. Nó là nơi thể hiện diện mạo gia tộc trước xã hội.
- **Người nói:** Gia tộc (Family Voice).
- **Người nghe:** Toàn thế giới (The World) và Người trong họ khi mới truy cập.
- **Yêu cầu:** Người ngoài vào phải hiểu đây là một thiết chế/kho tàng văn hóa của họ Trần Trọng. Người trong họ vào phải thấy "Cửa" để bước vào không gian của riêng mình (Login/Member Space).

## 10. Family Voice (Tiếng nói gia tộc)
- **Ai là người nói?** `[OPEN QUESTION]`. Hiện tại "Tiếng nói" đang mang đậm dấu ấn cá nhân của Tuấn (Editorial Voice / Owner). 
- Liệu Public Voice có phải là tổng hợp tiếng nói của mọi người? **KHÔNG**. Nó phải là những nội dung được tuyển lựa khắt khe (Selected).
- Family Voice là chủ thể phát ngôn cho những content nằm ngoài `MẠCH` và `Clara`.

## 11. Public Content Boundary
Những gì thuộc về Public và những gì không:
- **BELONGS:** Lịch sử chung, Tuyên ngôn, Các bài luận chọn lọc (Selected Essays), Family Events (nếu mang tính đại chúng).
- **DOES NOT BELONG:** Cây gia phả chi tiết (Canonical Tree), Hồ sơ cá nhân (Person profiles), MẠCH (Nội bộ), Thư Clara (Cá nhân).
- **Lưu ý:** "Public" không đồng nghĩa với "Những gì không bị đánh dấu Private". Public là một diễn ngôn được thiết kế có chủ đích.

## 12. Gate Model
Mô hình cửa ngõ:
```
                    THE WORLD
                        │
                        ▼
                 PUBLIC HOME (The Gate)
                     /   \
          (Reads)   /     \ (Logs in)
                   ▼       ▼
              OUTSIDER    FAMILY MEMBER
                 │             │
                 ▼             ▼
           FAMILY VOICE    ENTER FAMILY SPACE
```
- Mô hình này `[PHÙ HỢP]` với quyết định của Human. Public Home phải gánh 2 nhiệm vụ: **ĐẠI DIỆN** (Represent) và **NHẬN DIỆN** (Recognize member để cho vào cửa).

## 13. UX/UI Implications
- **`INFERENCE` (High Confidence):** Màn hình Public Home KHÔNG ĐƯỢC vẽ sơ đồ cây phả hệ (Genealogy Tree) làm yếu tố cốt lõi. Cây phả hệ nằm ở bên trong Member Space.
- **`INFERENCE` (High Confidence):** Trang Public phải có Identity riêng (Logo, Typography) thể hiện sự uy nghiêm, vững chãi của một thiết chế (Archive / Heritage).
- **`INFERENCE` (High Confidence):** MẠCH và Clara phải nằm sau bức tường đăng nhập, và không được xếp chung vào một "Tạp chí" (Magazine).
- **`INFERENCE` (Medium Confidence):** Call To Action (CTA) duy nhất trên Public Home dành cho thành viên là nút "Đăng nhập / Vào Nhà". 

## 14. Conflicts Found
- `[CONFLICT]` Code frontend cũ giả lập các route `#/gia-pha`, `#/tu-lieu` ở trang Public, mâu thuẫn với việc cấm mang Public Tree ra ngoài.
- `[CONFLICT]` Generator và Backend đang gộp bài của Clara vào chung một bảng `stories` với MẠCH và có thể fetch ra cùng nhau.

## 15. Superseded Assumptions
- Assumption: "MẠCH là Public" -> `[SUPERSEDED]`. MẠCH là Nội bộ.
- Assumption: "Account = Person" -> `[SUPERSEDED]`. Chúng được map với nhau.
- Assumption: "Admin_users thừa thãi" -> `[SUPERSEDED]`. Admin_users đại diện cho Staff, Accounts đại diện cho Dòng họ.

## 16. Open Questions
- Quy trình tuyển lựa (Editorial Process) bài viết từ MẠCH đẩy ra Public Voice sẽ do ai duyệt và hệ thống hỗ trợ thế nào?
- Việc cấp tài khoản cho người đã khuất (để ủy quyền quản lý - Delegation) sẽ được thể hiện ra sao trong Database?

## 17. Human Decisions Required
1. Phê duyệt Mô hình "Public Home as a Gate" để loại bỏ hoàn toàn các tư duy làm Dashboard/SaaS Landing Page.
2. Xác nhận cơ chế "Family Voice": Ai sẽ là Editor-in-Chief để duyệt bài từ MẠCH ra Public?

## 18. Recommended Product Model
Giatộc là một **Digital Family Institution** (Thiết chế Kỹ thuật số của Gia tộc).
- Lớp 1 (Vỏ bảo vệ): **The Gate & Family Voice** (Public Home).
- Lớp 2 (Không gian chung): **Family Space & Canonical Archive** (Genealogy, MẠCH, Memories).
- Lớp 3 (Không gian riêng): **Intimate Discourse** (Clara).

## 19. Evidence Matrix
- `families.payload` chứa con cái -> **FACT** (SQLite Forensics v0.4).
- MẠCH là Internal -> **HUMAN DECISION** (Purpose Audit v0.1).
- `admin_users` vs `accounts` -> **FACT** (Database Forensics v0.4).

## 20. Confidence Assessment
- Identity Separation (Person/Account): **HIGH**.
- Discourse Separation (Clara/MẠCH/Public): **HIGH**.
- Gate Model Concept: **HIGH**.

---

## IMPLEMENTATION BRIEF FOR CLINE

> **GỬI CLINE (UI/UX ENGINEER):**
> Trang Public Home (Landing Page) sau báo cáo này phải được thiết kế dựa trên các nguyên tắc ngữ nghĩa (Semantics) sau đây. Hãy bỏ qua các code HTML/CSS cũ nếu chúng vi phạm các nguyên tắc này.

**1. Purpose (Mục đích)**
Public Home là một Cửa Ngõ (Gate). Nó có 2 nhiệm vụ: Trình bày diện mạo Gia tộc cho Thế giới (Người ngoài), và mở cửa cho Thành viên (Người trong họ) vào Family Space. Nó **không phải** là một ứng dụng SaaS, không phải là một Dashboard, và không phải là thư viện tra cứu phả hệ.

**2. Audience (Khán giả)**
- Người lạ (Outsiders) đọc Family Voice.
- Thành viên (Members) chuẩn bị đăng nhập.

**3. Speaker (Người phát ngôn)**
Tiếng nói đại diện của Gia tộc (Family Voice) - Trang trọng, uy nghiêm, mang tính lưu trữ (Heritage/Archive).

**4. Semantic Boundaries (Giới hạn Ngữ nghĩa)**
- KHÔNG hiển thị Cây phả hệ (Genealogy Tree) ở Public.
- KHÔNG hiển thị Hồ sơ nhân vật (Person Profile) ở Public.
- KHÔNG hiển thị bài viết nội bộ (MẠCH) hay Thư gửi Clara.

**5. Core Message & Content Principles**
- Nội dung phải là các câu chuyện được tuyển chọn (Selected Statements/Essays) hướng ra bên ngoài.
- Dùng từ ngữ uyển chuyển, mang tính thiết chế văn hóa.

**6. UX Principles (Nguyên tắc UX)**
- Giao diện phải tĩnh lặng, rõ ràng (Clear Family Identity).
- Call-To-Action (Nút bấm) rõ nét nhất dành cho Member phải là đường dẫn vào Member Space (Đăng nhập / Về Nhà).
- Phải xóa bỏ các thanh điều hướng (Navigation bar) trỏ tới "Gia phả", "Tư liệu" mang tính nội bộ nếu đang nằm ở trang Public.

**7. What MUST NOT appear (Tuyệt đối cấm)**
- Cấm dùng Placeholder text (Lorem ipsum) hay câu hỏi mở (Open questions) làm nội dung hiển thị chính.
- Cấm đưa Architecture logic (API, DB structure) ra màn hình.
- Cấm vẽ sơ đồ tổ chức (Org chart) hoặc Dashboard UI.

**8. Success Criteria**
Một người ngoài vào trang web phải lập tức cảm nhận được chiều sâu văn hóa của Gia tộc Trần Trọng mà không nhìn thấy thông tin cá nhân nội bộ. Một thành viên dòng họ vào web phải dễ dàng thấy cổng đăng nhập để đi vào không gian an toàn của riêng họ.
