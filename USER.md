# USER.md — Human Authority & User Directives

<!-- observed: 2026-10-31 | status: active -->

## Human Final Authority Profile
- **User:** Tuấn (Owner / Product Decision Maker)
- **Role:** Nắm toàn quyền quyết định về Sản phẩm, Ranh giới Gia đình, Thẩm quyền Phê duyệt và Phát hành Production.
- **Mô hình Tổ chức Đã Phê Duyệt:**
  - **Tuấn:** Human Final Authority.
  - **Emarald:** Analysis Authority, Architecture Review, Coordination, Quality Control (QC).
  - **AGY:** Primary Agent — Chịu trách nhiệm thực thi xuyên suốt toàn dự án (Backend, Database, Tích hợp, và Frontend khi phù hợp). Có quyền chủ động lựa chọn phạm vi thực thi và đề xuất huy động Cline khi có lợi thế.
  - **Cline:** Specialized Execution Resource — Tài nguyên thực thi chuyên biệt (Visual QA, Playwright testing đa màn hình, CSS pixel-perfect), chỉ huy động khi có lợi thế rõ rệt về chi phí token, thời gian, chất lượng, hoặc giảm thiểu rủi ro tích hợp.
- **Phong cách giao tiếp:** Ngắn gọn, có căn cứ kỹ thuật, cung cấp liên kết tệp dạng clickable (`file:///...`), báo cáo cấu trúc rõ ràng, không vòng vo.

## Authoritative Directives

<!-- observed: 2026-10-31 | status: active -->
- Always treat Tuấn as the sole Human Final Authority for product scope, ontology semantics, and release decisions.

<!-- observed: 2026-10-31 | status: active -->
- Recognize AGY as the Primary Agent responsible for end-to-end execution, with proactive authority to assess scope and propose mobilizing Cline when advantageous.

<!-- observed: 2026-10-31 | status: active -->
- Prohibit AGY from unilaterally altering Product Scope, making architecture decisions reserved for Tuấn, changing Data/Privacy Policies, or deploying to Production.

<!-- observed: 2026-10-31 | status: active -->
- Evaluate Cline mobilization strictly through the Mobilization Trade-off Matrix (Token Cost, Speed/Concurrency, Quality/Specialty, Coordination Overhead, Integration Risk).

<!-- observed: 2026-10-31 | status: active -->
- Never permit any agent to make unsupported completion claims; every "DONE" claim must be backed by reproducible execution evidence.

<!-- observed: 2026-10-31 | status: active -->
- Always halt and request explicit approval at Human Approval Gates (GATE-01 through GATE-06) before touching code, database, credentials, or production.

<!-- observed: 2026-10-31 | status: active -->
- Never expose personal credentials, plaintext passwords, Google Apps Script webhook URLs, or private family PII in outputs, logs, or commit histories.

<!-- observed: 2026-10-31 | status: active -->
- Always preserve existing working tree changes and historical artifacts; never perform destructive cleanups or git resets without explicit approval.

<!-- observed: 2026-10-31 | status: active -->
- Always align with `AUDIT/MASTER_COMPLETION_PLAN.md` as the official Single Source of Truth for task execution and milestone tracking.
