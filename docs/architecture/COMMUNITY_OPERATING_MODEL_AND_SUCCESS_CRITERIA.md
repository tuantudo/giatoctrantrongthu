rồi# Community Operating Model & Success Criteria

## 1. Scope
Tài liệu này nghiên cứu và mô hình hóa cách vận hành cộng đồng (Community Operating Model), vòng đời thành viên (Member Life Cycle), mô hình quản trị (Governance Model) và bộ tiêu chí thành công (Success Criteria) cho Giatộc — Family Digital Institution. Tài liệu cung cấp **Evidence** và **Implications**, KHÔNG đưa ra các quyết định kiến trúc (Architecture Decisions).

## 2. Research Questions
- Một thành viên bước vào hệ thống sẽ sống, tương tác, đóng góp và được quản trị như thế nào?
- Hệ thống Admin/Steward vận hành ra sao nếu số lượng thành viên lên tới hàng trăm/nghìn người?
- Giatộc định nghĩa sự "Thành công" là gì, dựa trên Purpose của hệ thống?

## 3. Research Method
- Khảo sát các tài liệu kiến trúc nội bộ của Giatộc (ERD_v0.1.md, GENEALOGY_ARCHITECTURE_SURVEY.md).
- Nghiên cứu mô hình từ các tổ chức cộng đồng, nền tảng số và tài liệu học thuật về quản trị cộng đồng (Community Roundtable, Ostrom's Design Principles, FamilySearch Collaboration Model).
- Phân tách rõ ràng giữa FACT (Sự thật/Tính năng đã có ở nơi khác), OBSERVATION (Quan sát hành vi), và INFERENCE (Suy luận áp dụng).

## 4. Community Precedents
- **FamilySearch (Collaborative Genealogy):** (Sample size: 1) Sử dụng mô hình Single Shared Tree. Mọi thành viên đều có thể chỉnh sửa, nhưng mọi thay đổi phải có Reason/Source. Có hệ thống "Watch" để nhận thông báo thay đổi, "Discussions" để giải quyết tranh chấp.
- **Reddit / Discord (Moderation & Spaces):** (Sample size: 2) Phân cấp Sub-communities (Guilds/Subreddits). Có hệ thống Roles (Admin, Moderator, Member) với permissions chi tiết.
- **Wikipedia (Knowledge Governance):** (Sample size: 1) Mô hình Steward/Sysop dựa trên sự tín nhiệm. Tồn tại trang "Talk" để thảo luận trước khi sửa bài.
- **Ostrom's Commons (Academic):** Các cộng đồng tự quản thành công yêu cầu boundary rõ ràng, quy tắc gắn với local needs, và hệ thống giải quyết xung đột (conflict resolution) chi phí thấp.

## 5. Member Life Cycle
Mô hình hóa vòng đời thành viên (Hypothesis/Observation based on Community Roundtable):
1. **Discovery / Invitation:** Person được sinh ra từ cây gia phả. Cần một Invitation.
2. **Onboarding / Provisioning:** Account được cấp và kích hoạt.
3. **Identity Establishment:** Liên kết Account với Person (IdentityMapping). 
4. **Participation / Lurking:** Quan sát FamilySpace, xem thông báo.
5. **Contribution:** Thêm Memory, upload Media, đề xuất sửa phả hệ (Submission).
6. **Responsibility / Stewardship:** Trở thành Moderator hoặc Genealogy Authority của một nhánh.
7. **Dormancy:** Tạm ngưng hoạt động.
8. **Departure / Deactivation / Death:** Tài khoản bị khóa hoặc đánh dấu đã mất. Dữ liệu (Contribution, Memory) vẫn được bảo tồn và chuyển quyền (Succession).

*Câu hỏi Authority:* Ai có quyền chuyển trạng thái từ Dormancy sang Deactivation?

## 6. Member Journey
| Stage | Member need | Desired outcome | System support | Success condition |
|---|---|---|---|---|
| Provisioning | Xác nhận danh tính | Có Account an toàn | Flow cấp pass tạm | Login đổi pass thành công |
| Identity | Tìm vị trí trong họ | Thấy mình trên cây | IdentityMapping UI | Confirm "Đây là tôi" |
| Discovery | Biết họ hàng đang làm gì | Khám phá FamilySpace | Notification / Feed | Đọc Memory/Story |
| Contribution| Muốn đóng góp ký ức | Ký ức được lưu trữ | Memory / Media Upload | Memory hiển thị trên Space |
| Dispute | Sửa thông tin sai | Thông tin được đính chính | Claim/Evidence Submission | Decision được phê duyệt |

## 7. Contribution Model
*Taxonomy of Contributions (Inference based on Genealogy constraints):*
- **Genealogy Evidence:** Cung cấp tài liệu (khai sinh, gia phả cũ).
- **Genealogy Correction:** Báo cáo sai sót qua Submission (VD: Sai năm sinh).
- **Memory / Storytelling:** Kể chuyện, ghi chép ký ức cá nhân hoặc chung.
- **Media Archiving:** Upload và tag ảnh (Photo/Document).
- **Moderation / Curation:** Duyệt nội dung, gỡ bỏ nội dung rác.
- **Mentoring:** Hỗ trợ người lớn tuổi dùng hệ thống.
*(Lưu ý: 1 historical document được verify có giá trị lưu trữ cao hơn 100 comments giao tiếp hàng ngày).*

## 8. Community Health
Phân biệt các thước đo (Dựa trên Feverbee Health Metrics):
- **Growth:** Số Account mới được provision. (Metric)
- **Activation:** % Account đã login và đổi mật khẩu. (Health Indicator)
- **Contribution:** Tỷ lệ Submission/Memory trên tổng Account. (Signal)
- **Governance:** Thời gian trung bình để một Submission/Claim được Decision. (Diagnostic Indicator)
- **Preservation:** Số lượng Fact có đính kèm Evidence hợp lệ. (Outcome)

## 9. Governance Model
*Phân biệt 2 hệ thống quyền lực (Observation từ ERD_v0.1):*
1. **Community Governance:** Quản lý hành vi (Mute, Ban, Xóa comment toxic). Vai trò: Moderator, Admin.
2. **Canonical Genealogy Governance:** Quản lý Sự Thật (Duyệt Claim, chốt Fact). Vai trò: Genealogy Authority, Steward.
*Đặc tính:* Authority có thể có Scope (chỉ quản lý nhánh họ Nguyễn, nhánh họ Trần) và có thể Delegate (ủy quyền).

## 10. Admin / Steward Operating Model
Nếu có 1000 members, Tuấn không thể tự xử lý (Inference). Operating Model:
- **Routine (Weekly):** Review Community Health Dashboard (Dormant accounts, Pending Onboarding).
- **Event-driven:** Xử lý Escalation khi có "Evidence Conflict" (Hai nhánh họ cãi nhau về ngày giỗ).
- **Escalation Path:** Member (Submit) → Moderator (Lọc rác) → Steward/Genealogy Authority (Verify) → Human Authority / Tuấn (Final Decision đối với Core Heritage).

## 11. Community Command Center
Admin cần một Operator Dashboard. Các category thông tin:
- **Information:** Tổng quan Member, Health Metrics.
- **Action Required:** Pending Invitations, Pending Submissions, Reported Comments.
- **Decision Required:** Conflict Evidence, Architectural/Rule changes.

## 12. Success Definition
Thành công của Giatộc không phải là DAU/MAU cao như Facebook.
- **A. PURPOSE:** Giatộc trở thành "Digital Institution" bảo tồn di sản dòng họ vĩnh cửu.
- **B. MEMBER OUTCOME:** Thành viên hiểu rõ cội nguồn, cảm thấy thân thuộc.
- **C. COMMUNITY OUTCOME:** Cộng đồng tự vận hành giải quyết tranh chấp thông tin trong hòa bình.
- **D. KNOWLEDGE OUTCOME:** Mọi thông tin cốt lõi (Fact) đều có Source/Evidence minh bạch, không thể bị tẩy xóa vô lý.
- **E. SOVEREIGNTY OUTCOME:** Dữ liệu hoàn toàn độc lập, có thể export/backup và phục hồi nguyên vẹn nếu Tuấn rời đi.

## 13. Maturity / Community Lifecycle
*(Hypothesis stages)*
- **Stage 0 (Foundation):** Technical baseline, Data mapping. (Success: Admin có thể provision account).
- **Stage 1 (First Members):** Onboard nhóm nòng cốt. (Success: Core member đăng nhập, Identity chính xác).
- **Stage 2 (Active Community):** Mở rộng. (Success: Có UGC - User Generated Content như Memory, Media).
- **Stage 3 (Self-sustaining):** Phân quyền Steward. (Success: Submissions được xử lý bởi Steward, không phải Tuấn).
- **Stage 4 (Multi-generational):** Kế thừa. (Success: Chuyển giao Owner Account mà hệ thống vẫn sống).

## 14. Success Criteria Register

| ID | Domain | Success Criterion | Observable Evidence | Metric/Signal | Phase | Failure Signal |
|---|---|---|---|---|---|---|
| SC-001 | Identity | Member xác nhận đúng vị trí phả hệ | IdentityMapping confirmed | % Active accounts có mapping | Stage 1 | Login xong nhưng không thấy `/me` có tên |
| SC-002 | Governance | Uỷ quyền hoạt động tự nhiên | Có Delegation records | Số Moderator != Tuấn | Stage 3 | Mọi Submission đều dồn về Tuấn |
| SC-003 | Preservation | Mọi Fact quan trọng đều có nguồn | Claim nối với Evidence | Tỷ lệ Fact/Source > 0.8 | Stage 2 | Data phả hệ thay đổi không có AuditEvent |
| SC-004 | Continuity | Data không bị lock-in | Export tool sinh ra chuẩn JSON/GEDCOM | Có bản backup tự động hàng tuần | Stage 0 | Database crash không thể khôi phục |

## 15. Anti-Metrics & Failure Conditions
- **Anti-metric 1: Login Frequency / DAU.** Ép member ngày nào cũng vào Giatộc là sai mục đích. Đám giỗ 1 năm mới có 1 lần. 
- **Anti-metric 2: Số lượng Comment.** Comment nhiều có thể là do tranh cãi (Flamewar), không phản ánh Family Harmony.
- **Goodhart's Law Risk:** Nếu thưởng điểm cho việc tạo "Memory", member có thể spam ảnh rác để lấy điểm.

## 16. AI Assistance Boundary
- **AI làm (Recommendation):** Summarize tiểu sử từ Memory, tìm kiếm (Semantic Search) trùng lặp người trong phả hệ, tự động crop ảnh thẻ.
- **AI KHÔNG ĐƯỢC LÀM (Authority):** Không tự động merge Person, không tự xóa Account, không tự Canonicalize một tranh chấp phả hệ (Evidence Conflict). Quyết định cuối cùng bắt buộc là Human.

## 17. Sovereignty & Long-Term Continuity
- **Requirement:** Khi Tuấn (Owner) mất hoặc mất khả năng hành vi, hệ thống phải có cơ chế Succession (Trao quyền Owner cho người kế nhiệm).
- **Data Ownership:** Dữ liệu thuộc về Gia Tộc, không thuộc về vendor (Vercel/Cloudflare/Hosting).
- **Risk:** Founder dependency (Chỉ Tuấn biết cách deploy/bảo trì).

## 18. Architecture Implications
- Việc tách bạch Community Governance và Canonical Genealogy Governance đòi hỏi ERD của `Authority` phải có thiết kế Resource và Action cực kỳ rành mạch (VD: `MODERATE_SPACE` khác với `EDIT_GENEALOGY`). *(This creates an architecture question about RBAC vs ABAC)*.
- Để phục vụ Sovereignty (Backup/Restore độc lập), hệ thống Storage (DB + Media) có thể cần một kiến trúc Export toàn diện định kỳ.
- State của Account (Dormant, Deactivated) khi vướng với `IdentityMapping` sẽ ảnh hưởng tới hiển thị trên Cây gia phả (Public Tree). *(This creates a constraint on how deletion is handled - soft delete vs hard delete)*.

## 19. Human Decision Register

| ID | Question | Why it matters | Evidence | Options | Decision owner |
|---|---|---|---|---|---|
| HDR-01 | Ai có quyền chuyển trạng thái Account thành Deactivated/Dead? | Ảnh hưởng Continuity, bảo vệ dữ liệu người quá cố. | Social media (FB) có tính năng Memorialized Account. | 1. Admin/Tuấn, 2. Steward nhánh, 3. Tự động khi có Fact báo tử. | Tuấn / Human Authority |
| HDR-02 | Có phân tách Role Moderator (Cộng đồng) và Steward (Phả hệ) không? | Tránh lạm quyền sửa gia phả từ người chỉ có năng lực dọn rác comment. | ERD hiện tại có Authority Graph cho phép fine-grained permission. | 1. Tách biệt, 2. Gộp chung (Admin làm hết). | Tuấn / Human Authority |
| HDR-03 | Phạm vi (Boundary) của Family Space là gì? | Quyết định ai nhìn thấy nội dung riêng tư. | Ostrom's Principle 1 (Clear boundaries). | 1. Gắn với Family (Vợ/Chồng/Con), 2. Gắn với Nhánh (Lineage). | Tuấn / Human Authority |

## 20. Unknowns / Research Gaps
- Chưa rõ cơ chế pháp lý / quy ước dòng họ về việc "Người bị trục xuất khỏi dòng họ" (Tước Membership) thì thông tin phả hệ (Person) của họ có bị xóa hay không.
- Chưa rõ quy trình kỹ thuật để bàn giao toàn bộ Source Code / Cloud Credentials cho thế hệ tiếp theo (Succession Planning).

## 21. Sources
- [ERD_v0.1.md](ERD_v0.1.md) (Internal Database Modeling)
- [GENEALOGY_ARCHITECTURE_SURVEY.md](../research/GENEALOGY_ARCHITECTURE_SURVEY.md)
- Ostrom, E. (1990). *Governing the Commons*.
- The Community Roundtable (2020). *Community Maturity Model*.
- FeverBee (Richard Millington). *Community Health Metrics*.

## 22. Validation
- [x] Đã research community operating precedent.
- [x] Có source traceability.
- [x] Phân biệt FACT / OBSERVATION / INFERENCE.
- [x] Có Member Life Cycle & Journey.
- [x] Có Contribution & Health Model.
- [x] Có Governance & Steward Model.
- [x] Có Success Definition & Register, Maturity stages.
- [x] Không đưa ra architecture decision, không sửa ERD/Code/DB.
- [x] Git diff chỉ chứa file md mới.

## 23. STOP
Nhiệm vụ hoàn tất, chờ Human/Emarald review.
