# GIATỘC IMPLEMENTATION BASELINE

*Mission Status: COMPLETED*
*This document captures the Current Implementation Baseline, Gap Analysis, and Build Order for the Target Architecture.*

## 1. CURRENT SYSTEM AUDIT (RUNTIME BASELINE)
Dựa trên quá trình kiểm tra toàn bộ implementation hiện tại và tác động của Source Consolidation đợt trước:
* **Frontend Entry Point thực tế**: `index.html` → `src/js/app-v2.js` (Hash routing SPA).
* **Backend Entry Point**: `server/index.js` (Express.js Node server chạy ở cổng 3000).
* **API thực tế**: Các endpoint `/api/*` (Dữ liệu tĩnh & SQLite local khi chạy local dev, MariaDB thật khi chạy trên Synology NAS).
* **Database thực tế**: `family_archive` (MariaDB / SQLite).
* **Media Storage**: Filesystem cục bộ (`assets/`).
* **Generator/Publication Path**: `generator/` directory (Phục vụ MẠCH, Clara exports tĩnh thành JSON/Markdown).
* **Authentication**: `admin_users` table với cơ chế cookie-session (Chỉ có staff).
* **Admin Runtime**: `admin/index.html` (Staff Console).
* **Local Development Runtime**: Cổng 8080 (Python HTTP) và Cổng 3000 (Node API + Fallback static serve).
* **Source Consolidation Impact**: KHÔNG CÓ broken reference nào. Tất cả scripts/legacy docs đã được archive an toàn. Toàn bộ lệnh runtime gốc hoạt động ổn định.

## 2. IMPLEMENTATION MAP (TARGET → CURRENT)

| Target Concept | Current Implementation | Gap | Migration Required | Priority |
|---|---|---|---|---|
| **Person** | `people` table | Thiếu metadata phục vụ mapping | Không (chỉ extend) | P0 |
| **Account** | `admin_users` table | Cần mở rộng cho Member (chứ không chỉ Admin) | Sửa table name/role | P0 |
| **Identity Mapping** | KHÔNG CÓ | Thiếu bảng liên kết `person_id` và `account_id` | Tạo bảng mới | P0 |
| **Family Space** | `families` table (Genealogy) | Current chỉ là data vợ chồng. Thiếu thực thể không gian (Space) thực sự cho tương tác. | Tạo `spaces` entity | P1 |
| **Relationship** | `edges` table | Chỉ lưu parent/child/spouse | Extend properties | P0 |
| **Evidence/Source**| KHÔNG CÓ | Các Claim chưa có chỗ lưu nguồn chứng minh | Bổ sung bảng/column | P0 |
| **Memory** | `memories` table | Gắn cứng vào 1 PersonId, thiếu provenance, media, space, moderation state. | Mở rộng schema | P1 |
| **Media** | `media`, `person_media` | Thiếu chủ sở hữu, upload tracking, moderation | Extend schema | P1 |
| **Submission/Proposal** | KHÔNG CÓ | Mọi update đều ghi đè thẳng vào Canonical DB | Tạo bảng Submissions | P1 |
| **Authority** | Auth middleware (Owner/Editor) | Thiếu Resource-based (Row-level) authorization | Refactor Auth/Middleware | P0 |

## 3. THỨ TỰ BUILD (BUILD ORDER)

**P0 — Foundation**
1. Person
2. Account
3. Identity Mapping
4. Authentication
5. Authority foundation
6. Existing genealogy preservation

**P1 — Family**
7. Family Space
8. Membership
9. Family-level permissions
10. Media
11. Memory / Story

**P2 — Canonicalization**
12. Claims / Conclusions
13. Evidence / Sources
14. Proposal / Submission
15. Review
16. Canonicalization
17. Audit history

**P3 — Public**
18. Public projection
19. Person pages
20. Family pages
21. Memory/media presentation

**P4 — Sovereignty**
22. GEDCOM import
23. GEDCOM export
24. Full data export
25. Media archive
26. Backup / restore
27. Migration package

## 4. QUY TẮC "DO NOT TOUCH" (KHÔNG ĐƯỢC CHẠM VÀO LÚC NÀY)
* Không tạo ERD hoặc SQL Migration code ở giai đoạn này.
* Không sửa frontend `app-v2.js` hay `admin/js/api.js`.
* Không tác động tới luồng Obsidian/MẠCH.
* Không sửa đổi production database.

## 5. NHỮNG QUYẾT ĐỊNH HUMAN CÒN THIẾU (BLOCKING DECISIONS)
1. **Delegation Rules**: Một Account có thể claim/ủy quyền bao nhiêu Person? Ai là người cấp quyền này?
2. **Family Space Definition**: Không gian gia đình được định nghĩa tự động dựa trên cấu trúc phả hệ (mỗi Node là một nhánh) hay do Admin tạo thủ công (Ví dụ: "Không gian nhánh ông A", "Không gian nhà ông B")?
