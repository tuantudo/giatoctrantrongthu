# MEMBER EXPERIENCE WORKSTREAMS SPECIFICATION
## Phân Bổ Nhiệm Vụ & Ranh Giới Quyền Hạn Đa Agent

**Dự án:** Gia Tộc Trần Trọng Thu  
**Điều phối:** AGY (AGENT 00 — Orchestrator)  
**Ngày ban hành:** 2026-11-11  

---

## 1. MA TRẬN PHÂN CÔNG & TRÁCH NHIỆM CHÍNH (RACI MATRIX)

| Mã Agent | Định Danh Chuyên Môn | Trách nhiệm Trọng tâm (Ownership) | Tệp Đầu Ra (Deliverables) | Tệp Mã Nguồn Phụ Trách (File Scope) |
| :--- | :--- | :--- | :--- | :--- |
| **AGENT 00** | Architecture & Orchestrator | Điều phối, hợp đồng chung, kiểm soát xung đột, tổng hợp | `MEMBER_EXPERIENCE_MASTER_PLAN.md`<br>`MEMBER_EXPERIENCE_WORKSTREAMS.md`<br>`MEMBER_EXPERIENCE_DECISION_LOG.md` | Toàn quyền điều phối cấu trúc |
| **AGENT 01** | Product & Journey Design | Thiết kế 7 hành trình người dùng (A-G), từ điểm chạm đến phục hồi | `docs/product/MEMBER_JOURNEYS.md` | Read-only tài liệu & Specs |
| **AGENT 02** | UX/UI & Interaction Design | Triển khai giao diện thực tế (12 màn hình), mobile-first, ngôn ngữ gia đình | `MEMBER_UI_INVENTORY.md`<br>`MEMBER_UI_IMPLEMENTATION_REPORT.md` | `server/member_*.html`<br>`src/js/ui/`<br>`src/css/` |
| **AGENT 03** | Authentication & Lifecycle | Vòng đời tài khoản, kích hoạt, mật khẩu, session, recovery | `MEMBER_ACCOUNT_LIFECYCLE.md`<br>`AUTHENTICATION_IMPLEMENTATION_REPORT.md`<br>`SECURITY_GAPS.md` | `server/member.js`<br>`server/auth.js`<br>`server/index.js` |
| **AGENT 04** | Admin Ops & Member Support | Giao diện và quy trình xử lý yêu cầu, phê duyệt, hỗ trợ người thân | `FAMILY_MEMBER_OPERATIONS.md`<br>`MEMBER_SUPPORT_WORKFLOW.md` | `admin/`<br>`server/admin_operations.js` |
| **AGENT 05** | Governance & Authorization | Kiểm toán RBAC/ReBAC, ranh giới Clara P0, quyền quản lý vs huyết thống | `MEMBER_AUTHORIZATION_AUDIT.md`<br>`FAMILY_GOVERNANCE_REQUIREMENTS.md`<br>`ACCESS_CONTROL_GAP_ANALYSIS.md` | `server/governance.js`<br>`server/member.js` (Audit) |
| **AGENT 06** | QA / Integration / Security | Kiểm thử độc lập E2E, đa độ phân giải, kiểm tra IDOR, bảo mật | `MEMBER_EXPERIENCE_QA_MATRIX.md`<br>`MEMBER_EXPERIENCE_QA_REPORT.md`<br>`OPEN_DEFECTS.md` | `tests/` |

---

## 2. QUY TẮC PHỐI HỢP & CHỐNG XUNG ĐỘT (FILE CONCURRENCY & ISOLATION)

Để đảm bảo các workstream hoạt động trơn tru không ghi đè lẫn nhau:
1. **Frontend UI System (`src/js/ui/`, `server/member_*.html`):** Do **AGENT 02** sở hữu. Các agent khác không chỉnh sửa file UI khi chưa thông qua AGENT 00.
2. **Backend API Routes (`server/member.js`, `server/admin_operations.js`):** Do **AGENT 03** và **AGENT 04** phụ trách theo phân vùng:
   - AGENT 03: Phụ trách nhóm route `/api/member/auth/*`, `/api/member/change-password`, `/api/member/activate`, session lifecycle.
   - AGENT 04: Phụ trách nhóm route `/api/admin/*`, `/api/member/requests`, `/api/member/support`.
3. **Kiểm tra An ninh & Phân quyền:** **AGENT 05** rà soát và cung cấp bộ quy tắc kiểm tra (Checklist) cho AGENT 03, AGENT 04 và AGENT 06.
4. **Kiểm thử Độc lập:** **AGENT 06** tuyệt đối KHÔNG chỉnh sửa mã nguồn nghiệp vụ để làm "đẹp" kết quả test; chỉ tạo các script test trong `tests/` và báo cáo trung thực các lỗi (Defects) phát hiện được.

